import katex from 'katex';
import { BookOpenText, Lightbulb, Sigma, Sparkles } from 'lucide-react';
import type { Lesson } from '@/data/course';
import LessonFormula from '@/components/course/lesson/sections/formula';
import LessonText from '@/components/course/lesson/sections/lesson-text';

type LessonTheoryProps = { lesson: Lesson };

const math = (value: string, displayMode = false) => ({
  __html: katex.renderToString(value, { displayMode, throwOnError: false }),
});

export const LessonTheory = ({ lesson }: LessonTheoryProps) => (
  <div className="mt-8 space-y-8">
    <section aria-labelledby="concept-title">
      <h2
        id="concept-title"
        className="flex items-center gap-2 text-lg font-semibold tracking-tight"
      >
        <BookOpenText
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
        A ideia
      </h2>
      <p className="mt-2 max-w-4xl text-base/7 text-muted-foreground">
        <LessonText value={lesson.concept} />
      </p>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="bg-muted/40 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            Intuição
          </h3>
          <p className="mt-2 text-sm/6 text-muted-foreground">
            <LessonText value={lesson.intuition} />
          </p>
        </div>
        <div className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            O que muda na prática
          </h3>
          <p className="mt-2 text-sm/6 text-muted-foreground">
            <LessonText value={lesson.consequence} />
          </p>
        </div>
      </div>
    </section>

    <section aria-labelledby="formula-title">
      <div className="mb-3">
        <h2
          id="formula-title"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Sigma className="size-4 text-muted-foreground" aria-hidden="true" />
          Relação matemática
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Leia os símbolos e depois acompanhe um exemplo numérico.
        </p>
      </div>
      <LessonFormula value={lesson.formula} />
      <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {lesson.symbols.map((symbol) => (
          <div key={`${lesson.id}-${symbol.symbol}`} className="min-w-0 py-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex min-h-8 min-w-10 items-center justify-center bg-muted/60 px-2 font-mono text-sm text-foreground"
                dangerouslySetInnerHTML={math(symbol.symbol)}
              />
              <div>
                <h3 className="text-sm font-medium">{symbol.name}</h3>
                <p className="text-xs text-muted-foreground">{symbol.unit}</p>
              </div>
            </div>
            <p className="mt-2 text-sm/6 text-muted-foreground">
              <LessonText value={symbol.meaning} />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 bg-muted/35 p-5 sm:p-6">
        <h3 className="text-sm font-semibold">Exemplo resolvido</h3>
        <p className="mt-2 text-sm/6 text-muted-foreground">
          <LessonText value={lesson.example.question} />
        </p>
        <ol className="mt-4 space-y-4">
          {lesson.example.steps.map((step, index) => (
            <li
              key={`${lesson.id}-example-${index}`}
              className="grid grid-cols-[24px_minmax(0,1fr)] gap-3"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-background text-xs font-medium tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm/6 text-muted-foreground">
                  <LessonText value={step.explanation} />
                </p>
                {step.equation && (
                  <div className="mt-2 overflow-x-auto">
                    <LessonFormula value={step.equation} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm/6 font-medium">
          <LessonText value={lesson.example.result} />
        </p>
      </div>

      <details className="group mt-4">
        <summary className="cursor-pointer list-none py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="transition-transform group-open:rotate-90">›</span>
            Derivação passo a passo
          </span>
        </summary>
        <ol className="space-y-5 pt-3 pb-2">
          {lesson.derivation.map((step, index) => (
            <li
              key={`${lesson.id}-derivation-${index}`}
              className="grid grid-cols-[24px_minmax(0,1fr)] gap-3"
            >
              <span className="flex size-6 items-center justify-center bg-muted/70 text-xs font-medium tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm/6 text-muted-foreground">
                  <LessonText value={step.explanation} />
                </p>
                {step.equation && (
                  <div className="mt-2 overflow-x-auto">
                    <LessonFormula value={step.equation} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </details>
    </section>
  </div>
);

export default LessonTheory;
