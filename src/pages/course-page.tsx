import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Check, Lock, RotateCcw } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useCourseStore, type LessonId } from '@/stores/course-store';

import { courseLessons, courseModules } from '@/data/course-content';

type ProgressSegment = { key: string; fill: number; current: boolean };
const getProgressSegments = (
  completed: LessonId[],
  currentModuleIndex: number,
): ProgressSegment[] =>
  courseModules.map((module, index) => ({
    key: module.title,
    fill:
      (module.lessons.filter((lesson) => completed.includes(lesson.id)).length /
        module.lessons.length) *
      100,
    current: index === currentModuleIndex,
  }));
const isUnlocked = (targetIndex: number, completedLessons: LessonId[]) =>
  targetIndex === 0 ||
  courseLessons
    .slice(0, targetIndex)
    .every((item) => completedLessons.includes(item.id));
const chartColor = '#287fbb';
const createChartData = (kind: string, control: number) =>
  Array.from({ length: 101 }, (_, i) => {
    const x = (i - 50) / 10;
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
    const values: Record<string, number> = {
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
      output: values[kind] ?? tone,
      ideal: Math.abs(x) < cutoff ? 1 : 0,
      filtered: tone * low + second * (1 - low),
      fixed: Math.abs(x) < 2 ? 1 : 0,
      moving: Math.abs(x - (amount * 5 - 2.5)) < 2 ? 1 : 0,
    };
  });

const MathFormula = ({ value }: { value: string }) => (
  <div
    className="overflow-x-auto rounded-lg bg-background px-5 py-4 text-center"
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(value, {
        displayMode: true,
        throwOnError: false,
      }),
    }}
  />
);
const LessonChart = ({
  title,
  data,
  dataKey,
  color = chartColor,
  reference,
}: {
  title: string;
  data: ReturnType<typeof createChartData>;
  dataKey: string;
  color?: string;
  reference?: boolean;
}) => (
  <section className="min-w-0 rounded-xl bg-muted/30 p-3 sm:p-4">
    <h3 className="mb-2 text-sm font-semibold">{title}</h3>
    <div className="h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={32}
            tick={{ fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="#71717a" />
          {reference && (
            <ReferenceLine y={1} stroke="#71717a" strokeDasharray="4 4" />
          )}
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>
);

export const CoursePage = () => {
  const {
    activeLesson,
    completedLessons,
    experimentValue,
    selectLesson,
    completeActivity,
    setExperimentValue,
    resetCourse,
  } = useCourseStore();
  const [resetPending, setResetPending] = useState(false);
  const courseMapRef = useRef<HTMLElement>(null);
  const lessonContentRef = useRef<HTMLElement>(null);
  const lessonConclusionRef = useRef<HTMLDivElement>(null);
  const lessonIndex = Math.max(
    0,
    courseLessons.findIndex((lesson) => lesson.id === activeLesson),
  );
  const lesson = courseLessons[lessonIndex] ?? {
    id: 'signals' as const,
    title: 'Sinais contínuos e discretos',
    concept: '',
    intuition: '',
    consequence: '',
    formula: '',
    prompt: '',
    control: '',
    kind: 'signal',
  };
  const moduleIndex = courseModules.findIndex((module) =>
    module.lessons.some((item) => item.id === lesson.id),
  );
  const currentModule = courseModules[moduleIndex] ?? {
    title: '',
    summary: '',
    lessons: [lesson],
  };
  const moduleLessonIndex = currentModule.lessons.findIndex(
    (item) => item.id === lesson.id,
  );
  const data = createChartData(lesson.kind, experimentValue);
  const progressSegments = getProgressSegments(completedLessons, moduleIndex);
  const changeValue = (value: number) => {
    setExperimentValue(value);
    completeActivity();
  };
  const select = (id: LessonId) => selectLesson(id);
  const reset = () => setResetPending(true);
  useLayoutEffect(() => {
    const map = courseMapRef.current;
    const content = lessonContentRef.current;
    const conclusion = lessonConclusionRef.current;
    if (!map || !content || !conclusion) {
      return undefined;
    }

    const syncHeight = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const contentTop = content.getBoundingClientRect().top;
      const conclusionBottom = conclusion.getBoundingClientRect().bottom;
      const mapHeight = `${conclusionBottom - contentTop}px`;
      map.style.height = desktop ? mapHeight : '';
      map.style.maxHeight = desktop ? mapHeight : '';
      map.style.minHeight = desktop ? mapHeight : '';
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(content);
    observer.observe(conclusion);
    window.addEventListener('resize', syncHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeight);
      map.style.height = '';
      map.style.maxHeight = '';
      map.style.minHeight = '';
    };
  }, []);
  return (
    <main className="mx-auto grid w-full max-w-[1240px] gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-10">
      <aside
        ref={courseMapRef}
        className="flex flex-col gap-5 lg:min-h-0 lg:overflow-hidden"
        aria-label="Mapa do curso"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold">Seu percurso</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {completedLessons.length} de {courseLessons.length} aulas
              concluídas
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw /> Reiniciar
          </Button>
        </div>
        <div
          hidden={!resetPending}
          role="alertdialog"
          aria-label="Confirmar reinício"
          className="rounded-lg bg-muted p-4"
        >
          <p className="text-sm font-medium">
            Apagar o progresso e reiniciar o curso?
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                resetCourse();
                setResetPending(false);
              }}
            >
              Reiniciar curso
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setResetPending(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
        <fieldset
          className="grid grid-cols-6 gap-1.5 border-0 p-0"
          aria-label="Progresso por módulo"
        >
          {progressSegments.map((segment) => (
            <div
              key={segment.key}
              className="h-2 overflow-hidden rounded-full bg-muted"
              aria-hidden="true"
            >
              <div
                className={`h-full transition-[width] ${segment.current ? 'bg-primary' : 'bg-foreground/70'}`}
                style={{ width: `${segment.fill}%` }}
              />
            </div>
          ))}
        </fieldset>
        <div className="space-y-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
          {courseModules.map((module) => (
            <section key={module.title} className="space-y-1">
              <div className="px-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {module.title}
                </p>
                <p className="mt-1 text-xs/5 text-muted-foreground">
                  {module.summary}
                </p>
              </div>
              {module.lessons.map((item) => {
                const globalIndex = courseLessons.findIndex(
                  (entry) => entry.id === item.id,
                );
                const locked = !isUnlocked(globalIndex, completedLessons);
                const complete = completedLessons.includes(item.id);
                let marker = <span>{globalIndex + 1}</span>;
                if (complete) {
                  marker = <Check className="size-3.5" />;
                } else if (locked) {
                  marker = <Lock className="size-3" />;
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={locked}
                    onClick={() => select(item.id)}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${activeLesson === item.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60'} disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background text-[11px]">
                      {marker}
                    </span>
                    <span className="text-sm/5 font-medium">{item.title}</span>
                  </button>
                );
              })}
            </section>
          ))}
        </div>
      </aside>
      <article ref={lessonContentRef} className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Módulo {moduleIndex + 1} de {courseModules.length}
            </p>
            <p className="mt-1 text-base font-semibold tracking-tight">
              {currentModule.title.replace(/^\d+\.\s*/, '')}
            </p>
          </div>
          <p className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium tabular-nums">
            Aula {moduleLessonIndex + 1} de {currentModule.lessons.length}
          </p>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-5 max-w-4xl text-lg/8">{lesson.concept}</p>
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <section className="rounded-xl bg-muted/50 p-5">
            <h2 className="text-sm font-semibold">Intuição</h2>
            <p className="mt-2 text-base/7 text-muted-foreground">
              {lesson.intuition}
            </p>
          </section>
          <section className="rounded-xl bg-muted/50 p-5">
            <h2 className="mb-3 text-sm font-semibold">A relação matemática</h2>
            <MathFormula value={lesson.formula} />
          </section>
        </div>
        <section className="mt-5 rounded-xl bg-zinc-950 p-5 text-zinc-50">
          <h2 className="text-sm font-semibold">Por que isso importa</h2>
          <p className="mt-2 text-base/7 text-zinc-300">{lesson.consequence}</p>
        </section>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Explore no gráfico</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {lesson.prompt}
            </p>
          </div>
          <div className="w-full max-w-sm">
            <label
              htmlFor="lesson-control"
              className="mb-3 block cursor-pointer text-sm font-medium"
            >
              {lesson.control}:{' '}
              <span className="text-muted-foreground tabular-nums">
                {experimentValue}%
              </span>
            </label>
            <Slider
              id="lesson-control"
              value={[experimentValue]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => changeValue(values[0] ?? 0)}
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
        {[
          'lowpass',
          'highpass',
          'response',
          'spectrum',
          'windows',
          'fir',
        ].includes(lesson.kind) && (
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
        <div
          ref={lessonConclusionRef}
          className="mt-8 flex min-h-[88px] flex-wrap items-center justify-between gap-4 rounded-xl bg-muted/50 p-5"
        >
          <div>
            <p className="font-semibold">
              {completedLessons.includes(lesson.id)
                ? 'Exploração concluída'
                : 'Pronto para seguir?'}
            </p>
            <p className="mt-1 text-sm/6 text-muted-foreground">
              {completedLessons.includes(lesson.id)
                ? 'A próxima aula já está disponível no mapa.'
                : 'Conclua esta exploração para liberar a próxima aula.'}
            </p>
          </div>
          {!completedLessons.includes(lesson.id) && (
            <Button
              size="lg"
              className="h-11 gap-2 px-5"
              onClick={completeActivity}
            >
              <Check /> Concluir aula
            </Button>
          )}
        </div>
      </article>
    </main>
  );
};

export default CoursePage;
