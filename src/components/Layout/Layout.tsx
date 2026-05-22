import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  onAdminClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onAdminClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-primary-900 to-slate-950">
      <Navbar onAdminClick={onAdminClick} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
