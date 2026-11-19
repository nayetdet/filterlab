import { useMemo } from 'react';
import type { ToneAmplitude, WaveformPoint } from '@/types/audio-analysis';
import type { AudioSettings } from '@/types/audio-settings';
import {
  calculateSpectrum,
  convolve,
  createSignal,
  designFir,
  estimateToneAmplitude,
  FILTER_DELAY,
  frequencyResponse,
  SAMPLE_RATE,
} from '@/utils/dsp';

const PRINCIPAL_TONE_HZ = 440;
const WAVEFORM_SAMPLES = 401;
const WAVEFORM_RADIUS = Math.floor(WAVEFORM_SAMPLES / 2);

export const useAudioFilterModel = (
  settings: AudioSettings,
  cursorSample: number,
  cursorFrequency: number,
) => {
  const filterModel = useMemo(() => {
    const inputSignal = createSignal(
      settings.interferenceFrequency,
      settings.intensity,
    );
    const filterCoefficients = designFir(settings.filterKind, settings.cutoff);
    const causalOutput = convolve(inputSignal, filterCoefficients);
    const filteredSignal = inputSignal.map(
      (_, index) => causalOutput[index + FILTER_DELAY] ?? 0,
    );
    const inputTones = {
      principal: estimateToneAmplitude(inputSignal, PRINCIPAL_TONE_HZ),
      interference: estimateToneAmplitude(
        inputSignal,
        settings.interferenceFrequency,
      ),
    };
    const outputTones = {
      principal: estimateToneAmplitude(filteredSignal, PRINCIPAL_TONE_HZ),
      interference: estimateToneAmplitude(
        filteredSignal,
        settings.interferenceFrequency,
      ),
    };
    const toneSpectrum: ToneAmplitude[] = [
      {
        frequency: PRINCIPAL_TONE_HZ,
        original: inputTones.principal,
        filtered: outputTones.principal,
      },
      {
        frequency: settings.interferenceFrequency,
        original: inputTones.interference,
        filtered: outputTones.interference,
      },
    ];
    const inputSpectrum = calculateSpectrum(inputSignal);
    const outputSpectrum = calculateSpectrum(filteredSignal);
    const fftSpectrum: ToneAmplitude[] = inputSpectrum.map((point, index) => ({
      frequency: Math.round(point.frequency),
      original: point.amplitude,
      filtered: outputSpectrum[index]?.amplitude ?? 0,
    }));
    const stepResponse = filterCoefficients.reduce<number[]>(
      (values, coefficient) => [...values, (values.at(-1) ?? 0) + coefficient],
      [],
    );

    return {
      inputSignal,
      filterCoefficients,
      filteredSignal,
      inputTones,
      outputTones,
      toneSpectrum,
      fftSpectrum,
      stepResponse,
    };
  }, [
    settings.cutoff,
    settings.filterKind,
    settings.intensity,
    settings.interferenceFrequency,
  ]);

  const waveform = useMemo<WaveformPoint[]>(() => {
    const firstSample = Math.max(
      0,
      Math.min(
        filterModel.inputSignal.length - WAVEFORM_SAMPLES,
        cursorSample - WAVEFORM_RADIUS,
      ),
    );
    return Array.from({ length: WAVEFORM_SAMPLES }, (_, index) => {
      const sample = firstSample + index;
      return {
        sample,
        timeMs: (sample / SAMPLE_RATE) * 1000,
        original: filterModel.inputSignal[sample] ?? 0,
        filtered: filterModel.filteredSignal[sample] ?? 0,
      };
    });
  }, [cursorSample, filterModel.filteredSignal, filterModel.inputSignal]);

  return {
    ...filterModel,
    waveform,
    cursorGain: frequencyResponse(
      filterModel.filterCoefficients,
      cursorFrequency,
    ),
  };
};
