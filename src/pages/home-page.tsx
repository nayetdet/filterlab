import { useNavigate } from 'react-router-dom';
import HomeChartPreviews from '@/components/home/charts/home-chart-previews';
import HomeCourseRoadmap from '@/components/home/sections/home-course-roadmap';
import HomeHero from '@/components/home/sections/home-hero';
import HomeLearningSteps from '@/components/home/sections/home-learning-steps';
import HomeOutcomes from '@/components/home/sections/home-outcomes';
import { useCourseStore } from '@/stores/course-store';

export const HomePage = () => {
  const completedLessons = useCourseStore((state) => state.completedLessons);
  const navigate = useNavigate();

  return (
    <main>
      <HomeHero
        hasProgress={completedLessons.length > 0}
        completedCount={completedLessons.length}
        onContinue={() => navigate('/course')}
      />
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <HomeOutcomes />
        <HomeChartPreviews />
        <HomeLearningSteps />
        <HomeCourseRoadmap />
      </div>
    </main>
  );
};

export default HomePage;
