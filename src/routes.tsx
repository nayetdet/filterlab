import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/layout';
import CoursePage from '@/pages/course';
import HomePage from '@/pages/home';

export const AppRoutes = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default AppRoutes;
