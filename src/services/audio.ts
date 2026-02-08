import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer as ExpoAudioPlayer } from 'expo-audio/build/AudioModule.types';

export interface AudioTrack {
  globalAyahNumber: number;
  surahNumber: number;
  ayahNumberInSurah: number;
  audioUrl: string;
  localUri?: string;
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

class AudioPlayerManager {
  private player: ExpoAudioPlayer | null = null;
  private state: PlaybackState = { ...INITIAL_STATE };
  private listeners: Set<(state: PlaybackState) => void> = new Set();
  private initialized = false;
  private advancing = false;

  private async initialize() {
    if (this.initialized) return;
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
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

  async loadPlaylist(tracks: AudioTrack[], startIndex = 0) {
    // Silently clean up previous player without broadcasting a full reset
    if (this.player) {
      this.player.pause();
      this.player.remove();
      this.player = null;
    }
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
      const uri = track.localUri || track.audioUrl;

      // Remove previous player if it exists
      if (this.player) {
        this.player.remove();
        this.player = null;
      }

      this.player = createAudioPlayer(uri);

      this.player.addListener('playbackStatusUpdate', (status) => {
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
      });

      this.player.play();
      this.updateState({ isPlaying: true, isPaused: false, isLoading: false });
    } catch (error) {
      console.error('[AudioPlayer] Error loading track:', error);
      this.updateState({ isLoading: false });
    }
  }

  async play() {
    if (this.player) {
      this.player.play();
      this.updateState({ isPlaying: true, isPaused: false });
    }
  }

  async pause() {
    if (this.player) {
      this.player.pause();
      this.updateState({ isPlaying: false, isPaused: true });
    }
  }

  async resume() {
    if (this.player && this.state.isPaused) {
      this.player.play();
      this.updateState({ isPlaying: true, isPaused: false });
    }
  }

  async stop() {
    if (this.player) {
      this.player.pause();
      this.player.remove();
      this.player = null;
    }
    this.updateState({ ...INITIAL_STATE });
  }

  async next() {
    const nextIndex = this.state.currentIndex + 1;
    if (nextIndex < this.state.playlist.length) {
      await this.playTrackAtIndex(nextIndex);
    } else {
      await this.stop();
    }
  }

  async previous() {
    const prevIndex = this.state.currentIndex - 1;
    if (prevIndex >= 0) {
      await this.playTrackAtIndex(prevIndex);
    }
  }
}

export const audioPlayer = new AudioPlayerManager();
