import React from 'react';
import ReduxProvider from './ReduxProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';

const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <ReduxProvider>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </ReduxProvider>
    </div>
  );
};

export default Provider;
