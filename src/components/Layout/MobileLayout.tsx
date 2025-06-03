'use client';

import React, { ReactNode } from 'react';
import { useMobileDetect } from '@/hooks/useMobileDetect';

interface MobileLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ header, footer, children }) => {
  const isMobile = useMobileDetect();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {header && (
        <div className="sticky top-0 z-10 p-4 m-3 border border-[var(--border)] bg-[var(--card)] shadow-sm rounded-[var(--global-radius)]">
          {header}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto pb-32">
        {children}
      </div>
      
      {footer && (
        <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t border-[var(--border)] bg-[var(--card)] shadow-sm">
          {footer}
        </div>
      )}
    </div>
  );
};

export default MobileLayout;