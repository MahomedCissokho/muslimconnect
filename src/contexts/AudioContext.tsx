import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";

import {
  audioPlayer,
  type AudioTrack,
  type PlaybackState,
} from "../services/audio";
import {
  buildHizbPlaylist,
  buildJuzPlaylist,
  buildPagePlaylist,
  buildSurahPlaylist,
} from "../utils/playlistBuilder";
import { useSettings } from "./SettingsContext";

interface AudioContextValue {
  playbackState: PlaybackState;
  playTrack: (track: AudioTrack) => Promise<void>;
  loadPlaylist: (tracks: AudioTrack[], startIndex?: number) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    audioPlayer.getState(),
  );
  const wasPlayingRef = useRef(false);
  const { reciterId } = useSettings();
  const prevReciterIdRef = useRef(reciterId);

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe(setPlaybackState);
    return unsubscribe;
  }, []);

  // Rebuild playlist when reciter changes while audio is active
  useEffect(() => {
    if (prevReciterIdRef.current === reciterId) return;
    prevReciterIdRef.current = reciterId;

    const state = audioPlayer.getState();
    if (state.playlist.length === 0 || !state.currentTrack) return;

    const origin = state.currentTrack.origin;
    if (!origin) return;

    let newPlaylist: AudioTrack[] = [];
    if (origin.type === "surah")
      newPlaylist = buildSurahPlaylist(origin.id, reciterId);
    if (origin.type === "juz")
      newPlaylist = buildJuzPlaylist(origin.id, reciterId);
    if (origin.type === "hizb")
      newPlaylist = buildHizbPlaylist(origin.id, reciterId);
    if (origin.type === "page")
      newPlaylist = buildPagePlaylist(origin.id, reciterId);

    if (newPlaylist.length === 0) return;

    const resumeIndex = Math.min(state.currentIndex, newPlaylist.length - 1);
    audioPlayer.loadPlaylist(newPlaylist, resumeIndex);
  }, [reciterId]);

  // Stop playback when playlist reaches its boundary (first/last verse)
  useEffect(() => {
    audioPlayer.setOnPlaylistBoundary(async () => {
      await audioPlayer.stop();
    });

    return () => audioPlayer.setOnPlaylistBoundary(null);
  }, []);

  // Auto-pause when app goes to background
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        const currentState = audioPlayer.getState();
        if (currentState.isPlaying) {
          wasPlayingRef.current = true;
          try {
            await audioPlayer.pause();
          } catch {
            // Session lookup can fail when app transitions to background
          }
        }
      } else if (nextAppState === "active" && wasPlayingRef.current) {
        wasPlayingRef.current = false;
        try {
          await audioPlayer.resume();
        } catch {
          // Session lookup can fail when app transitions back
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  const value: AudioContextValue = {
    playbackState,
    playTrack: (track) => audioPlayer.playTrack(track),
    loadPlaylist: (tracks, startIndex) =>
      audioPlayer.loadPlaylist(tracks, startIndex),
    play: () => audioPlayer.play(),
    pause: () => audioPlayer.pause(),
    resume: () => audioPlayer.resume(),
    stop: () => audioPlayer.stop(),
    next: () => audioPlayer.next(),
    previous: () => audioPlayer.previous(),
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
