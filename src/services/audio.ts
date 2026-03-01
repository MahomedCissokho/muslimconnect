import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import type { AudioPlayer as ExpoAudioPlayer } from "expo-audio/build/AudioModule.types";

export type AudioOriginType = "surah" | "juz" | "hizb" | "page";

export interface AudioOrigin {
  type: AudioOriginType;
  id: number;
}

export interface AudioTrack {
  globalAyahNumber: number;
  surahNumber: number;
  ayahNumberInSurah: number;
  audioUrl: string;
  localUri?: string;
  /** Where the playback originates — used to navigate back from the mini-player */
  origin?: AudioOrigin;
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTrack: AudioTrack | null;
  positionMs: number;
  durationMs: number;
  playlist: AudioTrack[];
  currentIndex: number;
}

const INITIAL_STATE: PlaybackState = {
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentTrack: null,
  positionMs: 0,
  durationMs: 0,
  playlist: [],
  currentIndex: -1,
};

type BoundaryCallback = (direction: 'next' | 'previous', origin?: AudioOrigin) => Promise<void> | void;

class AudioPlayerManager {
  private player: ExpoAudioPlayer | null = null;
  private nextPlayer: ExpoAudioPlayer | null = null;
  private nextTrackIndex: number = -1;
  private state: PlaybackState = { ...INITIAL_STATE };
  private listeners: Set<(state: PlaybackState) => void> = new Set();
  private initialized = false;
  private advancing = false;
  // Stored subscription so we can explicitly remove it before destroying the player
  private statusSubscription: { remove: () => void } | null = null;
  private boundaryCallback: BoundaryCallback | null = null;

  setOnPlaylistBoundary(cb: BoundaryCallback | null) {
    this.boundaryCallback = cb;
  }

  private async initialize() {
    if (this.initialized) return;
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
    this.initialized = true;
  }

  private updateState(partial: Partial<PlaybackState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l(this.state));
  }

  subscribe(listener: (state: PlaybackState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): PlaybackState {
    return this.state;
  }

  /** Remove the playbackStatusUpdate listener from the current player. */
  private removeStatusListener() {
    if (this.statusSubscription) {
      try { this.statusSubscription.remove(); } catch { /* ignore */ }
      this.statusSubscription = null;
    }
  }

  private cleanupNextPlayer() {
    if (this.nextPlayer) {
      try {
        this.nextPlayer.remove();
      } catch {
        // ignore cleanup errors
      }
      this.nextPlayer = null;
      this.nextTrackIndex = -1;
    }
  }

  private async preloadNextTrack() {
    const nextIndex = this.state.currentIndex + 1;
    if (nextIndex >= this.state.playlist.length) return;
    if (nextIndex === this.nextTrackIndex && this.nextPlayer) return;

    const track = this.state.playlist[nextIndex];
    if (!track) return;

    try {
      this.cleanupNextPlayer();
      const uri = track.localUri || track.audioUrl;
      this.nextPlayer = createAudioPlayer(uri);
      // On Android, ExoPlayer may auto-start playback when a player is created.
      // Explicitly pause to prevent the pre-buffered track from playing silently
      // (which would cause it to be at the end by the time we actually want it).
      try { this.nextPlayer.pause(); } catch { /* ignore */ }
      this.nextTrackIndex = nextIndex;
      // pre-buffered track nextIndex
    } catch (err) {
      console.error("[AudioPlayer] Error preloading next track:", err);
      this.nextPlayer = null;
      this.nextTrackIndex = -1;
    }
  }

  async loadPlaylist(tracks: AudioTrack[], startIndex = 0) {
    // Stop any active playback first to prevent dual audio on Android
    await this.stop();
    this.updateState({ playlist: tracks, currentIndex: startIndex });
    await this.playTrackAtIndex(startIndex);
  }

  async playTrack(track: AudioTrack) {
    await this.loadPlaylist([track], 0);
  }

  private async playTrackAtIndex(index: number) {
    await this.initialize();

    const track = this.state.playlist[index];
    if (!track) return;

    this.updateState({
      isLoading: true,
      isPlaying: false,
      isPaused: false,
      currentTrack: track,
      currentIndex: index,
    });

    try {
      // Remove the old status listener BEFORE removing the player so stale
      // playbackStatusUpdate events cannot trigger an unwanted next().
      this.removeStatusListener();

      // Remove previous player — prevents dual audio on Android
      if (this.player) {
        try { this.player.pause(); } catch { /* ignore */ }
        try { this.player.remove(); } catch { /* ignore */ }
        this.player = null;
      }

      // Use pre-buffered player if available for this index
      if (this.nextPlayer && this.nextTrackIndex === index) {
        // using pre-buffered player for track index
        this.player = this.nextPlayer;
        this.nextPlayer = null;
        this.nextTrackIndex = -1;
        // Safety net: seek to 0 in case Android auto-played the buffered track
        try { this.player.seekTo(0); } catch { /* ignore */ }
      } else {
        this.cleanupNextPlayer();
        const uri = track.localUri || track.audioUrl;
        this.player = createAudioPlayer(uri);
      }

      // Store the subscription so it can be removed on the next track change
      this.statusSubscription = this.player.addListener("playbackStatusUpdate", (status) => {
        try {
          // Only update position/duration — never overwrite isPlaying from here
          this.updateState({
            positionMs: (status.currentTime || 0) * 1000,
            durationMs: (status.duration || 0) * 1000,
          });

          // Auto-advance when track finishes
          if (
            !this.advancing &&
            status.currentTime > 0 &&
            status.duration > 0 &&
            status.currentTime >= status.duration - 0.3 &&
            !status.playing
          ) {
            this.advancing = true;
            this.next().finally(() => {
              this.advancing = false;
            });
          }
        } catch {
          // Session lookup can fail when app is in background
        }
      });

      this.player.play();
      this.updateState({ isPlaying: true, isPaused: false, isLoading: false });

      // Pre-buffer the next track while this one plays
      this.preloadNextTrack();
    } catch (error) {
      console.error("[AudioPlayer] Error loading track:", error);
      this.updateState({ isLoading: false });
    }
  }

  async play() {
    if (this.player) {
      try {
        this.player.play();
        this.updateState({ isPlaying: true, isPaused: false });
      } catch (e) {
        // Session lookup can fail when app is in background
      }
    }
  }

  async pause() {
    if (this.player) {
      try {
        this.player.pause();
        this.updateState({ isPlaying: false, isPaused: true });
      } catch (e) {
        // Session lookup can fail when app is in background
      }
    }
  }

  async resume() {
    if (this.player && this.state.isPaused) {
      try {
        this.player.play();
        this.updateState({ isPlaying: true, isPaused: false });
      } catch (e) {
        // Session lookup can fail when app is in background
      }
    }
  }

  async stop() {
    this.removeStatusListener();
    if (this.player) {
      try { this.player.pause(); } catch { /* ignore */ }
      try { this.player.remove(); } catch { /* ignore */ }
      this.player = null;
    }
    this.cleanupNextPlayer();
    this.updateState({ ...INITIAL_STATE });
  }

  async next() {
    const nextIndex = this.state.currentIndex + 1;
    if (nextIndex < this.state.playlist.length) {
      await this.playTrackAtIndex(nextIndex);
    } else if (this.boundaryCallback) {
      await this.boundaryCallback('next', this.state.currentTrack?.origin);
    } else {
      await this.stop();
    }
  }

  async previous() {
    const prevIndex = this.state.currentIndex - 1;
    if (prevIndex >= 0) {
      await this.playTrackAtIndex(prevIndex);
    } else if (this.boundaryCallback) {
      await this.boundaryCallback('previous', this.state.currentTrack?.origin);
    }
  }
}

export const audioPlayer = new AudioPlayerManager();
