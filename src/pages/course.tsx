import { useRef } from 'react';
import LessonContent from '@/components/course/lesson/content';
import CourseMap from '@/components/course/navigation/course-map';
import { createCourseChart } from '@/charts/course';
import { courseLessons, courseModules } from '@/data/course';
import { useCourseStore } from '@/stores/course';
import { useMapHeight } from '@/hooks/use-map-height';

export const CoursePage = () => {
  const {
    activeLesson,
    completedLessons,
    experimentValue,
    selectLesson,
    completeLesson,
    setExperimentValue,
  } = useCourseStore();
  const courseMapRef = useRef<HTMLElement>(null);
  const lessonContentRef = useRef<HTMLElement>(null);
  const lessonConclusionRef = useRef<HTMLDivElement>(null);
  const lesson =
    courseLessons.find((item) => item.id === activeLesson) ?? courseLessons[0];
  if (!lesson) {
    throw new Error('The course has no lessons.');
  }
  const lessonIndex = courseLessons.indexOf(lesson);
  const currentModule = courseModules.find((module) =>
    module.lessons.includes(lesson),
  );
  if (!currentModule) {
    throw new Error('The lesson is not assigned to a course module.');
  }
  const moduleIndex = courseModules.indexOf(currentModule);
  const moduleLessonIndex = currentModule.lessons.indexOf(lesson);
  const previousLesson = courseLessons[lessonIndex - 1];
  const nextLesson = courseLessons[lessonIndex + 1];
  const lessonCompleted = completedLessons.includes(lesson.id);
  const chart = createCourseChart(lesson, experimentValue);
  const completeAndAdvance = () => {
    completeLesson();
    if (nextLesson) {
      selectLesson(nextLesson.id);
    }
  };

  useMapHeight(courseMapRef, lessonContentRef, lessonConclusionRef);

  return (
    <main className="mx-auto grid w-full max-w-[1240px] gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-10">
      <CourseMap
        mapRef={courseMapRef}
        activeLesson={activeLesson}
        currentModuleIndex={moduleIndex}
        onSelectLesson={selectLesson}
      />
      <LessonContent
        articleRef={lessonContentRef}
        conclusionRef={lessonConclusionRef}
        lesson={lesson}
        currentModule={currentModule}
        moduleIndex={moduleIndex}
        moduleCount={courseModules.length}
        lessonIndex={moduleLessonIndex}
        lessonCompleted={lessonCompleted}
        hasPrevious={Boolean(previousLesson)}
        hasNext={Boolean(nextLesson)}
        experimentValue={experimentValue}
        chart={chart}
        onExperimentChange={setExperimentValue}
        onPrevious={() => previousLesson && selectLesson(previousLesson.id)}
        onComplete={completeAndAdvance}
        onNext={() => nextLesson && selectLesson(nextLesson.id)}
      />
    </main>
  );
};

export default CoursePage;
