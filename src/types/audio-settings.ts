import type { FilterKind } from '@/types/filter';

export type AudioExperiment = 'whistle' | 'hum';

export type AudioSettings = {
  experiment: AudioExperiment;
  filterKind: FilterKind;
  cutoff: number;
  interferenceFrequency: number;
  intensity: number;
};

export type AudioSettingsPatch = Partial<AudioSettings>;
