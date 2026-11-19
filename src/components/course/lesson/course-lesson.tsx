import type { Ref } from 'react';
import type { CourseModule, Lesson } from '@/data/course-content';
import type { CourseChartSample } from '@/data/course-chart';
import CourseNavigation from '@/components/course/navigation/course-navigation';
import LessonExperiment from '@/components/course/lesson/lesson-experiment';
import LessonHeader from '@/components/course/lesson/lesson-header';
import LessonTheory from '@/components/course/lesson/lesson-theory';

type CourseLessonProps = {
  articleRef: Ref<HTMLElement>;
  conclusionRef: Ref<HTMLDivElement>;
  lesson: Lesson;
  currentModule: CourseModule;
  moduleIndex: number;
  moduleCount: number;
  lessonIndex: number;
  lessonCompleted: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  experimentValue: number;
  chartData: CourseChartSample[];
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

export const CourseLesson = ({
  articleRef,
  conclusionRef,
  lesson,
  currentModule,
  moduleIndex,
  moduleCount,
  lessonIndex,
  lessonCompleted,
  hasPrevious,
  hasNext,
  experimentValue,
  chartData,
  onExperimentChange,
  onPrevious,
  onComplete,
  onNext,
}: CourseLessonProps) => (
  <article ref={articleRef} className="min-w-0">
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
      data={chartData}
      onChange={onExperimentChange}
    />
    <div
      ref={conclusionRef}
      className="mt-8 flex min-h-[88px] flex-wrap items-center justify-between gap-4 rounded-xl bg-muted/50 p-5"
    >
      <CourseNavigation
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

export default CourseLesson;
