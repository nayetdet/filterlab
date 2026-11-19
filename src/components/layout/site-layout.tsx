import type { ReactNode } from 'react';
import '@fontsource-variable/inter';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { useLearningStore } from '@/stores/learning-store';

type SiteLayoutProps = { children: ReactNode };

export const SiteLayout = ({ children }: SiteLayoutProps) => (
  <div
    className="min-h-screen bg-background text-foreground"
    style={{ fontFamily: "'Inter Variable', sans-serif" }}
  >
    <Navbar onHome={useLearningStore.getState().openHome} />
    {children}
    <Footer />
  </div>
);

export default SiteLayout;
