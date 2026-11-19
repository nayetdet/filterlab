import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from '@/components/layout/site-layout';
import CoursePage from '@/pages/course-page';
import HomePage from '@/pages/home-page';

export const AppRoutes = () => (
  <BrowserRouter>
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  </BrowserRouter>
);

export default AppRoutes;
