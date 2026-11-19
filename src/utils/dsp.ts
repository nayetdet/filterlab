import type { FilterKind } from '@/types/filter';

export const SAMPLE_RATE = 16000;
export const FILTER_LENGTH = 129;
export const FILTER_DELAY = (FILTER_LENGTH - 1) / 2;

export const designFir = (kind: FilterKind, cutoff: number): number[] => {
  const normalized = cutoff / SAMPLE_RATE;
  const middle = FILTER_DELAY;
  const lowpass = Array.from({ length: FILTER_LENGTH }, (_, index) => {
    const offset = index - middle;
    const ideal =
      offset === 0
        ? 2 * normalized
        : Math.sin(2 * Math.PI * normalized * offset) / (Math.PI * offset);
    const window =
      0.54 - 0.46 * Math.cos((2 * Math.PI * index) / (FILTER_LENGTH - 1));
    return ideal * window;
  });
  const sum = lowpass.reduce((total, value) => total + value, 0);
  const normalizedLowpass = lowpass.map((value) => value / sum);
  return kind === 'lowpass'
    ? normalizedLowpass
    : normalizedLowpass.map(
        (value, index) => (index === middle ? 1 : 0) - value,
      );
};

export const convolve = (input: number[], impulse: number[]): number[] =>
  Array.from({ length: input.length + impulse.length - 1 }, (_, index) => {
    let total = 0;
    const start = Math.max(0, index - impulse.length + 1);
    const end = Math.min(index, input.length - 1);
    for (let sample = start; sample <= end; sample += 1) {
      total += (input[sample] ?? 0) * (impulse[index - sample] ?? 0);
    }
    return total;
  });

export const createSignal = (
  interferenceFrequency: number,
  intensity: number,
  duration = 1,
): number[] =>
  Array.from({ length: Math.floor(SAMPLE_RATE * duration) }, (_, index) => {
    const time = index / SAMPLE_RATE;
    return (
      Math.sin(2 * Math.PI * 440 * time) +
      intensity * Math.sin(2 * Math.PI * interferenceFrequency * time)
    );
  });

export const frequencyResponse = (
  impulse: number[],
  frequency: number,
): number => {
  let real = 0;
  let imaginary = 0;
  impulse.forEach((value, index) => {
    const angle =
      (2 * Math.PI * frequency * (index - FILTER_DELAY)) / SAMPLE_RATE;
    real += value * Math.cos(angle);
    imaginary -= value * Math.sin(angle);
  });
  return Math.hypot(real, imaginary);
};

export const estimateToneAmplitude = (
  samples: number[],
  frequency: number,
  start = 256,
  count = 8192,
): number => {
  let real = 0;
  let imaginary = 0;
  let weightSum = 0;
  const available = Math.min(count, samples.length - start);
  for (let index = 0; index < available; index += 1) {
    const window =
      0.5 - 0.5 * Math.cos((2 * Math.PI * index) / (available - 1));
    const angle = (2 * Math.PI * frequency * index) / SAMPLE_RATE;
    const sample = samples[start + index] ?? 0;
    real += sample * window * Math.cos(angle);
    imaginary -= sample * window * Math.sin(angle);
    weightSum += window;
  }
  return (2 * Math.hypot(real, imaginary)) / weightSum;
};

export const calculateSpectrum = (
  samples: number[],
  count = 2048,
  start = 256,
): Array<{ frequency: number; amplitude: number }> => {
  const available = Math.min(count, samples.length - start);
  return Array.from({ length: 129 }, (_, bin) => {
    const frequency = bin * 62.5;
    let real = 0;
    let imaginary = 0;
    let weightSum = 0;
    for (let index = 0; index < available; index += 1) {
      const window =
        0.5 - 0.5 * Math.cos((2 * Math.PI * index) / (available - 1));
      const angle = (2 * Math.PI * frequency * index) / SAMPLE_RATE;
      const sample = samples[start + index] ?? 0;
      real += sample * window * Math.cos(angle);
      imaginary -= sample * window * Math.sin(angle);
      weightSum += window;
    }
    return {
      frequency,
      amplitude: (2 * Math.hypot(real, imaginary)) / weightSum,
    };
  });
};

export const formatDb = (gain: number): string =>
  gain < 0.001 ? '−∞' : `${(20 * Math.log10(gain)).toFixed(1)} dB`;
