import type { CourseChartSample } from '@/data/course-chart';
import type { Lesson } from '@/data/course-content';
import { Slider } from '@/components/ui/slider';
import LessonChart from '@/components/course/lesson/charts/lesson-chart';

type LessonExperimentProps = {
  lesson: Lesson;
  value: number;
  data: CourseChartSample[];
  onChange: (value: number) => void;
};

const hasFilterCharts = (kind: string) =>
  ['lowpass', 'highpass', 'response', 'spectrum', 'windows', 'fir'].includes(
    kind,
  );

export const LessonExperiment = ({
  lesson,
  value,
  data,
  onChange,
}: LessonExperimentProps) => (
  <>
    <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold">Explore no gráfico</h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson.prompt}</p>
      </div>
      <div className="w-full max-w-sm">
        <label
          htmlFor="lesson-control"
          className="mb-3 block cursor-pointer text-sm font-medium"
        >
          {lesson.control}:{' '}
          <span className="text-muted-foreground tabular-nums">{value}%</span>
        </label>
        <Slider
          id="lesson-control"
          value={[value]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => onChange(values[0] ?? 0)}
        />
      </div>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <LessonChart title="Sinal no tempo" data={data} dataKey="input" />
      <LessonChart
        title={
          lesson.kind === 'continuous'
            ? 'Sobreposição dos pulsos'
            : 'Efeito do parâmetro'
        }
        data={data}
        dataKey={lesson.kind === 'continuous' ? 'moving' : 'output'}
        color="#168574"
        reference={lesson.kind === 'response' || lesson.kind === 'lowpass'}
      />
    </div>
    {hasFilterCharts(lesson.kind) && (
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <LessonChart
          title="Entrada e saída"
          data={data}
          dataKey="filtered"
          color="#287fbb"
        />
        <LessonChart
          title="Resposta ideal de referência"
          data={data}
          dataKey="ideal"
          color="#d97706"
        />
      </div>
    )}
  </>
);

export default LessonExperiment;
