import type { LessonKind } from '@/data/course';

export type CourseChartSample = {
  x: number;
  input: number;
  output: number;
  ideal: number;
  filtered: number;
  moving: number;
};

export const createCourseChartData = (
  kind: LessonKind,
  control: number,
): CourseChartSample[] =>
  Array.from({ length: 101 }, (_, index) => {
    const x = (index - 50) / 10;
    const amount = control / 100;
    const tone = Math.sin(x * (0.6 + amount * 2));
    const second = 0.45 * Math.sin(x * 4.4);
    const cutoff = 0.6 + amount * 3;
    const low = 1 / (1 + Math.exp((Math.abs(x) - cutoff) * 3));
    const windowed =
      Math.exp(-Math.abs(x) * (0.35 + amount * 0.9)) * Math.cos(x * 2.4);
    const pulse = Math.max(
      0,
      Math.min(1, 1.5 - Math.abs(x - (amount * 5 - 2.5))),
    );

    const values: Record<LessonKind, number> = {
      signal: tone,
      sampling: tone,
      aliasing: Math.sin(x * (amount * 5 + 0.2)),
      frequency: tone,
      spectrum:
        Math.exp(-((x - 1) ** 2)) + amount * 0.6 * Math.exp(-((x + 2) ** 2)),
      lowpass: low,
      highpass: 1 - low,
      response: low,
      impulse: windowed,
      windows: windowed,
      discrete: pulse,
      continuous: Math.max(0, 2 - Math.abs(x - (amount * 5 - 2.5))),
      iir: Math.exp(-Math.abs(x) * (1.2 - amount)) * Math.cos(x * 2),
      phase: x * amount,
    };

    return {
      x,
      input: tone + second,
      output: values[kind],
      ideal: Math.abs(x) < cutoff ? 1 : 0,
      filtered: tone * low + second * (1 - low),
      moving: Math.abs(x - (amount * 5 - 2.5)) < 2 ? 1 : 0,
    };
  });
