import type { ReactNode } from 'react';
import '@fontsource-variable/inter';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

type SiteLayoutProps = { children: ReactNode };

export const SiteLayout = ({ children }: SiteLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Inter Variable', sans-serif" }}
    >
      <Navbar onHome={() => navigate('/')} />
      {children}
      <Footer />
    </div>
  );
};

export default SiteLayout;
