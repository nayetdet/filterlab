export type ToneAmplitude = {
  frequency: number;
  original: number;
  filtered: number;
};

export type WaveformPoint = {
  sample: number;
  timeMs: number;
  original: number;
  filtered: number;
};
