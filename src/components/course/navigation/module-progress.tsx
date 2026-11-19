import type { LessonId } from '@/stores/course-store';
import { courseModules } from '@/data/course';

type ModuleProgressProps = {
  completedLessons: LessonId[];
  currentModuleIndex: number;
};

export const ModuleProgress = ({
  completedLessons,
  currentModuleIndex,
}: ModuleProgressProps) => {
  return (
    <fieldset className="grid grid-cols-6 gap-2 border-0 p-0">
      <legend className="sr-only">Progresso por módulo</legend>
      {courseModules.map((module, index) => {
        const completedCount = module.lessons.filter((lesson) =>
          completedLessons.includes(lesson.id),
        ).length;

        return (
          <div
            key={module.title}
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            aria-hidden="true"
          >
            <div
              className={`h-full transition-[width] ${index === currentModuleIndex ? 'bg-primary' : 'bg-foreground/70'}`}
              style={{
                width: `${(completedCount / module.lessons.length) * 100}%`,
              }}
            />
          </div>
        );
      })}
    </fieldset>
  );
};

export default ModuleProgress;
