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

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe(setPlaybackState);
    return unsubscribe;
  }, []);

  // Auto-pause when app goes to background, remember state for resume
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        const currentState = audioPlayer.getState();
        if (currentState.isPlaying) {
          wasPlayingRef.current = true;
          audioPlayer.pause();
        }
      }
      // Do NOT auto-resume — let the user tap play manually
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
