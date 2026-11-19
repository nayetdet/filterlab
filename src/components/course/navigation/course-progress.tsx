import type { LessonId } from '@/stores/course-store';
import { getCourseProgressSegments } from '@/utils/course-progress';

type CourseProgressProps = {
  completedLessons: LessonId[];
  currentModuleIndex: number;
};

export const CourseProgress = ({
  completedLessons,
  currentModuleIndex,
}: CourseProgressProps) => {
  const segments = getCourseProgressSegments(
    completedLessons,
    currentModuleIndex,
  );

  return (
    <fieldset className="grid grid-cols-6 gap-2 border-0 p-0">
      <legend className="sr-only">Progresso por módulo</legend>
      {segments.map((segment) => (
        <div
          key={segment.key}
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={`h-full transition-[width] ${segment.current ? 'bg-primary' : 'bg-foreground/70'}`}
            style={{ width: `${segment.fill}%` }}
          />
        </div>
      ))}
    </fieldset>
  );
};

export default CourseProgress;
