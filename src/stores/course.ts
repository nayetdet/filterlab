import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

type CourseState = {
  activeLesson: LessonId;
  completedLessons: LessonId[];
  experimentValue: number;
  selectLesson: (lesson: LessonId) => void;
  completeLesson: () => void;
  setExperimentValue: (value: number) => void;
  resetProgress: () => void;
};

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      activeLesson: 'signals',
      completedLessons: [],
      experimentValue: 40,
      selectLesson: (activeLesson) => set({ activeLesson }),
      completeLesson: () =>
        set((state) => ({
          completedLessons: state.completedLessons.includes(state.activeLesson)
            ? state.completedLessons
            : [...state.completedLessons, state.activeLesson],
        })),
      setExperimentValue: (experimentValue) => set({ experimentValue }),
      resetProgress: () =>
        set({
          activeLesson: 'signals',
          completedLessons: [],
          experimentValue: 40,
        }),
    }),
    {
      name: 'filterlab-learning-progress',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
