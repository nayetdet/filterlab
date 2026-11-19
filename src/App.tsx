import { TooltipProvider } from '@/components/ui/tooltip';
import SiteLayout from '@/components/layout/site-layout';
import LearningCourse from '@/features/learning-course';
import HomePage from '@/features/home-page';
import { useLearningStore } from '@/stores/learning-store';

export const App = () => {
  const currentView = useLearningStore((state) => state.currentView);
  return (
    <TooltipProvider>
      <SiteLayout>
        {currentView === 'home' ? <HomePage /> : <LearningCourse />}
      </SiteLayout>
    </TooltipProvider>
  );
};

export default App;
