import katex from 'katex';
import type { CourseChart as CourseChartData } from '@/charts/course';
import type { Lesson } from '@/data/course';
import { Slider } from '@/components/ui/slider';
import CourseChart from '@/components/charts/course/chart';

type LessonExperimentProps = {
  lesson: Lesson;
  value: number;
  chart: CourseChartData;
  onChange: (value: number) => void;
};

const renderMath = (value: string) => ({
  __html: katex.renderToString(value, { throwOnError: false }),
});

export const LessonExperiment = ({
  lesson,
  value,
  chart,
  onChange,
}: LessonExperimentProps) => {
  const { control } = lesson;
  const displayValue = chart.controlValue.toFixed(control.digits);

  return (
    <section className="mt-10" aria-labelledby="experiment-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Experimento interativo
          </p>
          <h2
            id="experiment-title"
            className="mt-1 text-xl font-semibold tracking-tight"
          >
            Explore no gráfico
          </h2>
          <p className="mt-2 text-base/7 text-muted-foreground">
            {lesson.prompt}
          </p>
        </div>
        <div className="w-full max-w-sm">
          <label
            htmlFor="lesson-control"
            className="mb-3 flex items-center justify-between gap-3 text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              {control.label}
              <span
                className="font-mono text-sm text-muted-foreground"
                dangerouslySetInnerHTML={renderMath(control.symbol)}
              />
            </span>
            <span className="tabular-nums">
              {displayValue} {control.unit}
            </span>
          </label>
          <Slider
            id="lesson-control"
            aria-label={control.label}
            value={[value]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => onChange(values[0] ?? 0)}
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>
              {control.min.toFixed(control.digits)} {control.unit}
            </span>
            <span>
              {control.max.toFixed(control.digits)} {control.unit}
            </span>
          </div>
        </div>
      </div>
      <CourseChart chart={chart} />
    </section>
  );
};

export default LessonExperiment;
