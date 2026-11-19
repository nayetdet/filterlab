import type { ReactNode } from 'react';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import type { SiteSection } from '@/types/navigation';

type SiteLayoutProps = {
  section: SiteSection;
  onSectionChange: (section: SiteSection) => void;
  children: ReactNode;
};

export const SiteLayout = ({
  section,
  onSectionChange,
  children,
}: SiteLayoutProps) => (
  <div
    className="min-h-screen bg-background text-foreground"
    style={{ fontFamily: "'Inter Variable', sans-serif" }}
  >
    <Navbar section={section} onSectionChange={onSectionChange} />
    {children}
    <Footer onSectionChange={onSectionChange} />
  </div>
);

export default SiteLayout;
