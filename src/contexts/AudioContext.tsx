import React, { createContext, useContext, useEffect, useState } from 'react';

import { audioPlayer, type PlaybackState, type AudioTrack } from '../services/audio';

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
  const [playbackState, setPlaybackState] = useState<PlaybackState>(audioPlayer.getState());

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe(setPlaybackState);
    return unsubscribe;
  }, []);

  const value: AudioContextValue = {
    playbackState,
    playTrack: (track) => audioPlayer.playTrack(track),
    loadPlaylist: (tracks, startIndex) => audioPlayer.loadPlaylist(tracks, startIndex),
    play: () => audioPlayer.play(),
    pause: () => audioPlayer.pause(),
    resume: () => audioPlayer.resume(),
    stop: () => audioPlayer.stop(),
    next: () => audioPlayer.next(),
    previous: () => audioPlayer.previous(),
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
