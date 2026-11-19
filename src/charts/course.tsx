import type { Lesson } from '@/data/course';

export type ChartPoint = Record<string, number | null>;
export type ChartSeries = {
  key: string;
  name: string;
  color: string;
  style: 'line' | 'points' | 'stem';
  dashed?: boolean;
};
export type ChartReference = { axis: 'x' | 'y'; value: number; label: string };
export type CourseChart = {
  title: string;
  xLabel: string;
  yLabel: string;
  points: ChartPoint[];
  series: ChartSeries[];
  references: ChartReference[];
  yDomain?: [number, number];
  controlValue: number;
};

const colors = {
  graphite: '#27272a',
  blue: '#287fbb',
  teal: '#168574',
  orange: '#d97706',
  violet: '#8b6bb1',
};

const line = (
  key: string,
  name: string,
  color: string,
  dashed = false,
): ChartSeries => ({ key, name, color, style: 'line', dashed });
const stem = (key: string, name: string, color: string): ChartSeries => ({
  key,
  name,
  color,
  style: 'stem',
});
const points = (key: string, name: string, color: string): ChartSeries => ({
  key,
  name,
  color,
  style: 'points',
});
const sinc = (value: number) =>
  Math.abs(value) < 1e-8 ? 1 : Math.sin(Math.PI * value) / (Math.PI * value);
const sample = (
  count: number,
  start: number,
  end: number,
  value: (x: number, index: number) => ChartPoint,
) =>
  Array.from({ length: count }, (_, index) => {
    const x = start + ((end - start) * index) / (count - 1);
    return { x, ...value(x, index) };
  });
const controlValue = (lesson: Lesson, level: number) => {
  const control = lesson.control;
  const raw = control.min + ((control.max - control.min) * level) / 100;
  return (
    control.min + Math.round((raw - control.min) / control.step) * control.step
  );
};
const dft = (signal: number[], sampleRate: number) => {
  const size = signal.length;
  return Array.from({ length: Math.floor(size / 2) + 1 }, (_, bin) => {
    let real = 0;
    let imaginary = 0;
    signal.forEach((value, index) => {
      const phase = (2 * Math.PI * bin * index) / size;
      real += value * Math.cos(phase);
      imaginary -= value * Math.sin(phase);
    });
    const scale = bin === 0 || bin === size / 2 ? 1 / size : 2 / size;
    return {
      x: (bin * sampleRate) / size,
      magnitude: scale * Math.hypot(real, imaginary),
    };
  });
};

const createSignalChart = (
  lesson: Lesson,
  value: number,
  base: Pick<CourseChart, 'references' | 'controlValue'>,
): CourseChart => {
  switch (lesson.id) {
    case 'signals':
      return {
        ...base,
        title: 'Uma senoide amostrada no tempo',
        xLabel: 'Tempo (ms)',
        yLabel: 'Amplitude',
        points: sample(201, 0, 10, (time) => ({
          signal: Math.sin((2 * Math.PI * value * time) / 1000),
        })),
        series: [line('signal', 'Sinal', colors.graphite)],
      };
    case 'signal-parameters':
      return {
        ...base,
        title: 'A amplitude altera a escala vertical',
        xLabel: 'Tempo (s)',
        yLabel: 'Amplitude',
        points: sample(161, 0, 1, (time) => ({
          reference: Math.sin(2 * Math.PI * 4 * time),
          signal: value * Math.sin(2 * Math.PI * 4 * time),
        })),
        series: [
          line('reference', 'Amplitude 1', colors.graphite, true),
          line('signal', 'Sinal ajustado', colors.blue),
        ],
      };
    case 'sampling': {
      const rate = value;
      const duration = 4;
      const periodInGrid = 160 / ((duration * rate) / 1000);
      return {
        ...base,
        title: 'Amostras sobre a senoide contínua',
        xLabel: 'Tempo (ms)',
        yLabel: 'Amplitude',
        points: sample(161, 0, duration, (time, index) => {
          const continuous = Math.sin((2 * Math.PI * 1000 * time) / 1000);
          const sampled =
            index % Math.max(1, Math.round(periodInGrid)) === 0
              ? continuous
              : null;
          return { continuous, sampled };
        }),
        series: [
          line('continuous', 'Sinal contínuo', colors.graphite),
          points('sampled', 'Amostras', colors.blue),
        ],
      };
    }
    case 'sampling-reconstruction': {
      const rate = value;
      const frequency = 1500;
      const duration = 6;
      const sampleCount = Math.ceil((duration * rate) / 1000);
      const sampledValues = Array.from(
        { length: sampleCount + 1 },
        (_, index) => Math.sin((2 * Math.PI * frequency * index) / rate),
      );
      const reconstructed = (time: number) => {
        const position = (time * rate) / 1000;
        return sampledValues.reduce(
          (sum, sampleValue, index) =>
            sum + sampleValue * sinc(position - index),
          0,
        );
      };
      const every = Math.max(1, Math.round(160 / ((duration * rate) / 1000)));
      return {
        ...base,
        title: 'Amostras e reconstrução por sinc',
        xLabel: 'Tempo (ms)',
        yLabel: 'Amplitude',
        points: sample(161, 0, duration, (time, index) => {
          const original = Math.sin((2 * Math.PI * frequency * time) / 1000);
          const reconstructedValue = reconstructed(time);
          return {
            original,
            reconstructed: reconstructedValue,
            sampled: index % every === 0 ? reconstructedValue : null,
          };
        }),
        series: [
          line('original', 'Sinal original', colors.graphite),
          line('reconstructed', 'Reconstrução', colors.teal),
          points('sampled', 'Amostras', colors.blue),
        ],
        references: [
          ...base.references,
          { axis: 'y', value: 1, label: 'fₘₐₓ = 1,5 kHz' },
        ],
      };
    }
    case 'aliasing': {
      const sampleRate = 8000;
      const aliasFrequency = Math.abs(
        ((value + sampleRate / 2) % sampleRate) - sampleRate / 2,
      );
      const duration = 4;
      return {
        ...base,
        title: 'O tom aparente depois da amostragem',
        xLabel: 'Tempo (ms)',
        yLabel: 'Amplitude',
        points: sample(161, 0, duration, (time, index) => {
          const original = Math.sin((2 * Math.PI * value * time) / 1000);
          const alias = Math.sin((2 * Math.PI * aliasFrequency * time) / 1000);
          const sampleStep = 160 / ((duration * sampleRate) / 1000);
          return {
            original,
            alias,
            samples:
              index % Math.max(1, Math.round(sampleStep)) === 0
                ? original
                : null,
          };
        }),
        series: [
          line('original', 'Original', colors.graphite, true),
          line(
            'alias',
            `Aparente, ${Math.round(aliasFrequency)} Hz`,
            colors.orange,
          ),
          points('samples', 'Amostras', colors.blue),
        ],
        references: base.references,
      };
    }
  }
  throw new Error('No signal chart is defined for this lesson.');
};

const createFrequencyChart = (
  lesson: Lesson,
  value: number,
  base: Pick<CourseChart, 'references' | 'controlValue'>,
): CourseChart => {
  switch (lesson.id) {
    case 'frequency':
      return {
        ...base,
        title: 'Um ciclo dura T = 1/f',
        xLabel: 'Tempo (ms)',
        yLabel: 'Amplitude',
        points: sample(161, 0, 3000 / value, (time) => ({
          signal: Math.sin((2 * Math.PI * value * time) / 1000),
        })),
        series: [line('signal', `Senoide, ${value} Hz`, colors.blue)],
      };
    case 'frequency-components':
      return {
        ...base,
        title: 'Duas senoides formam um sinal composto',
        xLabel: 'Tempo (ms)',
        yLabel: 'Amplitude',
        points: sample(201, 0, 40, (time) => {
          const first = Math.sin((2 * Math.PI * 50 * time) / 1000);
          const second = value * Math.sin((2 * Math.PI * 150 * time) / 1000);
          return { first, second, sum: first + second };
        }),
        series: [
          line('first', '50 Hz', colors.graphite),
          line('second', '150 Hz ajustado', colors.orange),
          line('sum', 'Soma', colors.blue),
        ],
      };
    case 'spectrum': {
      const size = 128;
      const rate = 8000;
      const signal = Array.from(
        { length: size },
        (_, index) =>
          Math.sin((2 * Math.PI * 1000 * index) / rate) +
          0.5 * Math.sin((2 * Math.PI * value * index) / rate),
      );
      return {
        ...base,
        title: 'Magnitude dos componentes por frequência',
        xLabel: 'Frequência (Hz)',
        yLabel: 'Amplitude relativa',
        points: dft(signal, rate).map(({ x, magnitude }) => ({ x, magnitude })),
        series: [stem('magnitude', 'Espectro', colors.violet)],
        references: [],
        yDomain: [0, 1.2],
      };
    }
    case 'fft-resolution': {
      const size = Math.round(value);
      const rate = 16000;
      const signal = Array.from(
        { length: size },
        (_, index) =>
          Math.sin((2 * Math.PI * 1000 * index) / rate) +
          0.8 * Math.sin((2 * Math.PI * 1200 * index) / rate),
      );
      return {
        ...base,
        title: `Bin spacing: ${(rate / size).toFixed(1)} Hz`,
        xLabel: 'Frequência (Hz)',
        yLabel: 'Amplitude relativa',
        points: dft(signal, rate).map(({ x, magnitude }) => ({ x, magnitude })),
        series: [stem('magnitude', 'Espectro', colors.blue)],
        references: [],
        yDomain: [0, 1.5],
      };
    }
  }
  throw new Error('No frequency chart is defined for this lesson.');
};

const createFilterChart = (
  lesson: Lesson,
  value: number,
  base: Pick<CourseChart, 'references' | 'controlValue'>,
): CourseChart => {
  switch (lesson.id) {
    case 'lowpass':
    case 'highpass': {
      const isLowpass = lesson.id === 'lowpass';
      const cutoff = value;
      const edge = 180;
      const response = (frequency: number) => {
        const low = 1 / (1 + Math.exp((frequency - cutoff) / edge));
        return isLowpass ? low : 1 - low;
      };
      return {
        ...base,
        title: isLowpass
          ? 'Ganho ideal e transição do passa-baixa'
          : 'Ganho ideal e transição do passa-alta',
        xLabel: 'Frequência (Hz)',
        yLabel: 'Ganho linear',
        points: sample(161, 0, 8000, (frequency) => {
          const ideal = isLowpass
            ? Number(frequency <= cutoff)
            : Number(frequency >= cutoff);
          return { ideal, practical: response(frequency) };
        }),
        series: [
          line('ideal', 'Ideal', colors.graphite, true),
          line('practical', 'Transição ilustrativa', colors.blue),
        ],
        references: [
          ...base.references,
          { axis: 'x', value: cutoff, label: `f_c = ${cutoff} Hz` },
        ],
        yDomain: [0, 1.1],
      };
    }
    case 'filter-bands': {
      const attenuation = value;
      const cutoff = 2500;
      const transition = 700;
      return {
        ...base,
        title: 'Faixa passante, transição e rejeição',
        xLabel: 'Frequência (Hz)',
        yLabel: 'Ganho (dB)',
        points: sample(161, 0, 8000, (frequency) => {
          let gain = 0;
          if (frequency > cutoff + transition / 2) {
            gain = -attenuation;
          } else if (frequency >= cutoff - transition / 2) {
            gain =
              -(attenuation * (frequency - cutoff + transition / 2)) /
              transition;
          }
          return { gain };
        }),
        series: [line('gain', 'Magnitude', colors.teal)],
        references: [
          { axis: 'y', value: 0, label: '0 dB' },
          {
            axis: 'x',
            value: cutoff - transition / 2,
            label: 'Início da transição',
          },
          {
            axis: 'x',
            value: cutoff + transition / 2,
            label: 'Fim da transição',
          },
        ],
        yDomain: [-90, 5],
      };
    }
    case 'fir': {
      const cutoff = 2500;
      const width = value;
      return {
        ...base,
        title: 'Resposta ideal e resposta realizável',
        xLabel: 'Frequência (Hz)',
        yLabel: 'Ganho linear',
        points: sample(161, 0, 8000, (frequency) => {
          const ideal = Number(frequency <= cutoff);
          const practical = 1 / (1 + Math.exp((frequency - cutoff) / width));
          return { ideal, practical };
        }),
        series: [
          line('ideal', 'Ideal', colors.graphite, true),
          line('practical', 'FIR ilustrativo', colors.blue),
        ],
        references: [
          ...base.references,
          { axis: 'x', value: cutoff, label: 'f_c' },
        ],
        yDomain: [0, 1.1],
      };
    }
  }
  throw new Error('No filter chart is defined for this lesson.');
};

const createImpulseChart = (
  lesson: Lesson,
  value: number,
  base: Pick<CourseChart, 'references' | 'controlValue'>,
): CourseChart => {
  switch (lesson.id) {
    case 'impulse': {
      const size = Math.round(value);
      const center = (size - 1) / 2;
      const normalizedCutoff = 0.2;
      const coefficients = Array.from({ length: size }, (_, index) => {
        const offset = index - center;
        const ideal = normalizedCutoff * sinc(normalizedCutoff * offset);
        const window =
          0.54 - 0.46 * Math.cos((2 * Math.PI * index) / (size - 1));
        return ideal * window;
      });
      const sum = coefficients.reduce(
        (total, coefficient) => total + coefficient,
        0,
      );
      return {
        ...base,
        title: 'Coeficientes de um FIR passa-baixa',
        xLabel: 'Índice n',
        yLabel: 'h[n]',
        points: coefficients.map((coefficient, index) => ({
          x: index,
          coefficient: coefficient / sum,
        })),
        series: [stem('coefficient', 'h[n]', colors.blue)],
        references: [
          ...base.references,
          { axis: 'x', value: center, label: 'Centro' },
        ],
      };
    }
    case 'windows': {
      const size = Math.round(value);
      return {
        ...base,
        title: 'Janela retangular e janela de Hamming',
        xLabel: 'Índice n',
        yLabel: 'Peso da janela',
        points: Array.from({ length: size }, (_, index) => ({
          x: index,
          rectangular: 1,
          hamming: 0.54 - 0.46 * Math.cos((2 * Math.PI * index) / (size - 1)),
        })),
        series: [
          stem('rectangular', 'Retangular', colors.graphite),
          line('hamming', 'Hamming', colors.orange),
        ],
        references: [],
        yDomain: [0, 1.1],
      };
    }
  }
  throw new Error('No impulse chart is defined for this lesson.');
};

const createConvolutionChart = (
  lesson: Lesson,
  value: number,
  base: Pick<CourseChart, 'references' | 'controlValue'>,
): CourseChart => {
  switch (lesson.id) {
    case 'convolution-discrete': {
      const input = Array.from({ length: 7 }, (_, index) =>
        Number(index >= 1 && index <= 5),
      );
      const coefficients = [1 / 3, 1 / 3, 1 / 3];
      const output = Array.from(
        { length: input.length + coefficients.length - 1 },
        (_, index) =>
          coefficients.reduce(
            (sum, coefficient, coefficientIndex) =>
              sum + coefficient * (input[index - coefficientIndex] ?? 0),
            0,
          ),
      );
      return {
        ...base,
        title: `Convolução discreta na amostra n=${value}`,
        xLabel: 'Índice n',
        yLabel: 'Amplitude',
        points: Array.from({ length: output.length }, (_, index) => ({
          x: index,
          input: input[index] ?? 0,
          output: output[index] ?? 0,
          selected: index === value ? (output[index] ?? 0) : null,
        })),
        series: [
          stem('input', 'Entrada x[n]', colors.graphite),
          stem('output', 'Saída y[n]', colors.blue),
          points('selected', 'Amostra selecionada', colors.orange),
        ],
        references: [],
        yDomain: [0, 1.2],
      };
    }
    case 'convolution-continuous': {
      const shift = value;
      return {
        ...base,
        title: 'Sobreposição dos pulsos no deslocamento atual',
        xLabel: 'Posição τ (s)',
        yLabel: 'Amplitude',
        points: sample(161, -1, 4, (tau) => {
          const fixed = Number(tau >= 0 && tau <= 2);
          const moving = Number(tau >= shift && tau <= shift + 1);
          return { fixed, moving, product: fixed * moving };
        }),
        series: [
          line('fixed', 'Pulso x(τ)', colors.graphite),
          line('moving', 'Pulso h(t−τ)', colors.blue),
          line('product', 'Produto', colors.teal),
        ],
        references: [],
        yDomain: [-0.05, 1.2],
      };
    }
  }
  throw new Error('No convolution chart is defined for this lesson.');
};

const createSystemChart = (
  lesson: Lesson,
  value: number,
  base: Pick<CourseChart, 'references' | 'controlValue'>,
): CourseChart => {
  switch (lesson.id) {
    case 'iir':
    case 'iir-stability': {
      const radius = value;
      const size = 31;
      return {
        ...base,
        title:
          Math.abs(radius) < 1
            ? 'Resposta ao impulso decrescente'
            : 'Resposta ao impulso crescente',
        xLabel: 'Índice n',
        yLabel: 'h[n]',
        points: Array.from({ length: size }, (_, index) => ({
          x: index,
          response: Math.pow(radius, index),
        })),
        series: [stem('response', 'Resposta', colors.violet)],
        references: [
          ...base.references,
          { axis: 'y', value: 1, label: '|r| = 1' },
        ],
      };
    }
    case 'phase': {
      const delay = value;
      return {
        ...base,
        title: 'Fase linear corresponde a atraso constante',
        xLabel: 'Frequência normalizada ω/π',
        yLabel: 'Fase (rad)',
        points: sample(101, 0, 1, (frequency) => ({
          phase: -Math.PI * frequency * delay,
        })),
        series: [line('phase', `Atraso de ${delay} amostras`, colors.orange)],
        references: [
          ...base.references,
          { axis: 'x', value: 0.5, label: 'ω/π = 0,5' },
        ],
      };
    }
  }
  throw new Error('No system chart is defined for this lesson.');
};

export const createCourseChart = (
  lesson: Lesson,
  level: number,
): CourseChart => {
  const value = controlValue(lesson, level);
  const base = {
    references: [{ axis: 'y' as const, value: 0, label: 'Zero' }],
    controlValue: value,
  };
  if (
    [
      'signals',
      'signal-parameters',
      'sampling',
      'sampling-reconstruction',
      'aliasing',
    ].includes(lesson.id)
  ) {
    return createSignalChart(lesson, value, base);
  }
  if (
    [
      'frequency',
      'frequency-components',
      'spectrum',
      'fft-resolution',
    ].includes(lesson.id)
  ) {
    return createFrequencyChart(lesson, value, base);
  }
  if (['lowpass', 'highpass', 'filter-bands', 'fir'].includes(lesson.id)) {
    return createFilterChart(lesson, value, base);
  }
  if (['impulse', 'windows'].includes(lesson.id)) {
    return createImpulseChart(lesson, value, base);
  }
  if (['convolution-discrete', 'convolution-continuous'].includes(lesson.id)) {
    return createConvolutionChart(lesson, value, base);
  }
  if (['iir', 'iir-stability', 'phase'].includes(lesson.id)) {
    return createSystemChart(lesson, value, base);
  }
  throw new Error('No chart is defined for this lesson.');
};
