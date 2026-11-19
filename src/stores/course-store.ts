import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type LessonId =
  | 'signals'
  | 'sampling'
  | 'aliasing'
  | 'frequency'
  | 'spectrum'
  | 'lowpass'
  | 'highpass'
  | 'fir'
  | 'impulse'
  | 'convolution-discrete'
  | 'convolution-continuous'
  | 'windows'
  | 'iir'
  | 'phase';

type LearningState = {
  activeLesson: LessonId;
  completedLessons: LessonId[];
  experimentValue: number;
  selectLesson: (lesson: LessonId) => void;
  completeActivity: () => void;
  setExperimentValue: (value: number) => void;
  resetCourse: () => void;
};

export const useCourseStore = create<LearningState>()(
  persist(
    immer((set) => ({
      activeLesson: 'signals',
      completedLessons: [],
      experimentValue: 40,
      selectLesson: (lesson) =>
        set((state) => {
          state.activeLesson = lesson;
        }),
      completeActivity: () =>
        set((state) => {
          if (!state.completedLessons.includes(state.activeLesson)) {
            state.completedLessons.push(state.activeLesson);
          }
        }),
      setExperimentValue: (value) =>
        set((state) => {
          state.experimentValue = value;
        }),
      resetCourse: () =>
        set((state) => {
          state.activeLesson = 'signals';
          state.completedLessons = [];
          state.experimentValue = 40;
        }),
    })),
    {
      name: 'filterlab-learning-progress',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
