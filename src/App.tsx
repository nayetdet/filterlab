import { TooltipProvider } from '@/components/ui/tooltip';
import AppRoutes from '@/routes';

export const App = () => (
  <TooltipProvider>
    <AppRoutes />
  </TooltipProvider>
);

export default App;
