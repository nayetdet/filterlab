import { useNavigate } from 'react-router-dom';
import ChartPreviews from '@/components/charts/home/previews';
import CourseRoadmap from '@/components/home/course-roadmap';
import Hero from '@/components/home/hero';
import LearningSteps from '@/components/home/learning-steps';
import LearningOutcomes from '@/components/home/learning-outcomes';
import { useCourseStore } from '@/stores/course';

export const HomePage = () => {
  const completedLessons = useCourseStore((state) => state.completedLessons);
  const navigate = useNavigate();

  return (
    <main>
      <Hero
        completedCount={completedLessons.length}
        onContinue={() => navigate('/course')}
      />
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-16 px-5 py-16 sm:gap-20 sm:px-8 sm:py-20 lg:gap-24">
        <ChartPreviews />
        <LearningOutcomes />
        <LearningSteps />
        <CourseRoadmap />
      </div>
    </main>
  );
};

export default HomePage;
