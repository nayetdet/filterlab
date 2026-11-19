import type { CourseModule, Lesson } from '@/data/course';
import type { CourseChart as CourseChartData } from '@/charts/course';
import LessonNavigation from '@/components/course/navigation/lesson-navigation';
import LessonExperiment from '@/components/course/lesson/sections/experiment';
import LessonHeader from '@/components/course/lesson/sections/header';
import LessonTheory from '@/components/course/lesson/sections/theory';

type LessonContentProps = {
  lesson: Lesson;
  currentModule: CourseModule;
  moduleIndex: number;
  moduleCount: number;
  lessonIndex: number;
  lessonCompleted: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  experimentValue: number;
  chart: CourseChartData;
  onExperimentChange: (value: number) => void;
  onPrevious: () => void;
  onComplete: () => void;
  onNext: () => void;
};

const getLessonDescription = (completed: boolean, hasNext: boolean) => {
  if (!completed) {
    return 'Avance para marcar esta aula como concluída.';
  }
  if (hasNext) {
    return 'Continue para a próxima aula quando quiser.';
  }
  return 'Você concluiu o percurso.';
};

export const LessonContent = ({
  lesson,
  currentModule,
  moduleIndex,
  moduleCount,
  lessonIndex,
  lessonCompleted,
  hasPrevious,
  hasNext,
  experimentValue,
  chart,
  onExperimentChange,
  onPrevious,
  onComplete,
  onNext,
}: LessonContentProps) => (
  <article className="min-w-0">
    <LessonHeader
      lesson={lesson}
      currentModule={currentModule}
      moduleIndex={moduleIndex}
      moduleCount={moduleCount}
      lessonIndex={lessonIndex}
    />
    <LessonTheory lesson={lesson} />
    <LessonExperiment
      lesson={lesson}
      value={experimentValue}
      chart={chart}
      onChange={onExperimentChange}
    />
    <div className="mt-8 flex min-h-[88px] flex-wrap items-center justify-between gap-4 rounded-xl bg-muted/50 p-5">
      <LessonNavigation
        description={getLessonDescription(lessonCompleted, hasNext)}
        lessonCompleted={lessonCompleted}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPrevious={onPrevious}
        onComplete={onComplete}
        onNext={onNext}
      />
    </div>
  </article>
);

export default LessonContent;
