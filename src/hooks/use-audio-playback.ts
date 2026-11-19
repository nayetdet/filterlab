import { useEffect, useRef, useState } from 'react';
import { SAMPLE_RATE } from '@/utils/dsp';

export type AudioSource = 'original' | 'filtered';

export const useAudioPlayback = (
  inputSignal: number[],
  filteredSignal: number[],
) => {
  const [selectedSource, setSelectedSource] = useState<AudioSource>('filtered');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const playbackOffsetRef = useRef(0);
  const playbackStartTimeRef = useRef(0);

  const play = (
    source: AudioSource = selectedSource,
    offset = playbackOffsetRef.current,
  ) => {
    const audioContext = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = audioContext;
    const samples = source === 'original' ? inputSignal : filteredSignal;
    const audioBuffer = audioContext.createBuffer(
      1,
      samples.length,
      SAMPLE_RATE,
    );
    audioBuffer.copyToChannel(
      Float32Array.from(samples, (sample) => sample * 0.45),
      0,
    );

    const sourceNode = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.78,
      audioContext.currentTime + 0.04,
    );
    sourceNode.onended = () => {
      if (sourceNodeRef.current === sourceNode) {
        sourceNodeRef.current = null;
        gainNodeRef.current = null;
        playbackOffsetRef.current = 0;
        setIsPlaying(false);
      }
    };
    sourceNode.start(0, offset % (samples.length / SAMPLE_RATE));
    sourceNodeRef.current = sourceNode;
    gainNodeRef.current = gainNode;
    playbackStartTimeRef.current = audioContext.currentTime;
    playbackOffsetRef.current = offset;
    setIsPlaying(true);
  };

  const pause = () => {
    const audioContext = audioContextRef.current;
    const sourceNode = sourceNodeRef.current;
    if (audioContext && sourceNode) {
      playbackOffsetRef.current =
        (playbackOffsetRef.current +
          audioContext.currentTime -
          playbackStartTimeRef.current) %
        1;
      gainNodeRef.current?.gain.linearRampToValueAtTime(
        0,
        audioContext.currentTime + 0.035,
      );
      sourceNode.stop(audioContext.currentTime + 0.04);
      sourceNodeRef.current = null;
      gainNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const selectSource = (nextSource: AudioSource) => {
    if (nextSource === selectedSource) {
      return;
    }
    const resume = isPlaying;
    if (resume && audioContextRef.current) {
      pause();
    }
    setSelectedSource(nextSource);
    if (resume) {
      window.setTimeout(() => play(nextSource), 45);
    }
  };

  useEffect(
    () => () => {
      sourceNodeRef.current?.stop();
      void audioContextRef.current?.close();
    },
    [],
  );

  return { selectedSource, isPlaying, play, pause, selectSource };
};
