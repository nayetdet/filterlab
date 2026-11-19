import type { ReactNode } from 'react';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

type LayoutProps = { children: ReactNode };

export const Layout = ({ children }: LayoutProps) => (
  <div
    className="min-h-screen bg-background text-foreground"
    style={{ fontFamily: "'Inter Variable', sans-serif" }}
  >
    <Navbar />
    {children}
    <Footer />
  </div>
);

export default Layout;
