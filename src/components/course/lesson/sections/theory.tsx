import type { Lesson } from '@/data/course';
import LessonFormula from '@/components/course/lesson/sections/formula';

type LessonTheoryProps = { lesson: Lesson };

export const LessonTheory = ({ lesson }: LessonTheoryProps) => (
  <>
    <div className="mt-7 grid gap-5 lg:grid-cols-2">
      <section className="rounded-xl bg-muted/50 p-5">
        <h2 className="text-sm font-semibold">Intuição</h2>
        <p className="mt-2 text-base/7 text-muted-foreground">
          {lesson.intuition}
        </p>
      </section>
      <section className="rounded-xl bg-muted/50 p-5">
        <h2 className="mb-3 text-sm font-semibold">A relação matemática</h2>
        <LessonFormula value={lesson.formula} />
      </section>
    </div>
    <section className="mt-5 rounded-xl bg-zinc-950 p-5 text-zinc-50">
      <h2 className="text-sm font-semibold">Por que isso importa</h2>
      <p className="mt-2 text-base/7 text-zinc-300">{lesson.consequence}</p>
    </section>
  </>
);

export default LessonTheory;
