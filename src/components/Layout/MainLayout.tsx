import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header with proper z-index and no padding top needed since it's fixed */}
      <Header />
      
      {/* Main content area - no padding top since hero handles its own spacing */}
      <main className="flex-grow relative">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
