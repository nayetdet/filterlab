import { courseModules } from '@/data/course-content';
import type { LessonId } from '@/stores/course-store';

type ProgressSegment = { key: string; fill: number; current: boolean };

export const getCourseProgressSegments = (
  completedLessons: LessonId[],
  currentModuleIndex: number,
): ProgressSegment[] =>
  courseModules.map((module, index) => ({
    key: module.title,
    fill:
      (module.lessons.filter((lesson) => completedLessons.includes(lesson.id))
        .length /
        module.lessons.length) *
      100,
    current: index === currentModuleIndex,
  }));
