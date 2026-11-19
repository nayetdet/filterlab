import type { CourseModule, Lesson } from '@/data/course-content';

type LessonHeaderProps = {
  lesson: Lesson;
  currentModule: CourseModule;
  moduleIndex: number;
  moduleCount: number;
  lessonIndex: number;
};

export const LessonHeader = ({
  lesson,
  currentModule,
  moduleIndex,
  moduleCount,
  lessonIndex,
}: LessonHeaderProps) => (
  <>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Módulo {moduleIndex + 1} de {moduleCount}
        </p>
        <p className="mt-1 text-base font-semibold tracking-tight">
          {currentModule.title.replace(/^\d+\.\s*/, '')}
        </p>
      </div>
      <p className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium tabular-nums">
        Aula {lessonIndex + 1} de {currentModule.lessons.length}
      </p>
    </div>
    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
      {lesson.title}
    </h1>
    <p className="mt-5 max-w-4xl text-lg/8">{lesson.concept}</p>
  </>
);

export default LessonHeader;
