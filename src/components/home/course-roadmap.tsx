import { BookOpen } from 'lucide-react';
import { courseModules } from '@/data/course';

export const CourseRoadmap = () => (
  <section className="mt-20 pb-24">
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          O percurso
        </h2>
        <p className="mt-2 text-muted-foreground">
          Do primeiro sinal aos filtros digitais.
        </p>
      </div>
      <div className="grid size-10 place-items-center rounded-full bg-muted/50">
        <BookOpen className="size-5 text-muted-foreground" />
      </div>
    </div>
    <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
      {courseModules.map((module, index) => (
        <div
          key={module.title}
          className="flex gap-4 border-t border-border/70 py-5"
        >
          <span className="text-sm text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-semibold">
              {module.title.replace(/^\d+\.\s*/, '')}
            </h3>
            <p className="mt-1 text-sm/6 text-muted-foreground">
              {module.summary}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default CourseRoadmap;
