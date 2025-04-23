'use client';

import React, { useEffect } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';

import { useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/layoutes/AppHeader';
import AppSidebar from '@/layoutes/AppSidebar';
import Backdrop from '@/layoutes/Backdrop';

import { dispatch, useSelector } from '@/store';
import { fetchUserDetails } from '@/store/slices/authSlice';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const user = useSelector((state) => state.auth.user);
  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
    ? 'lg:ml-[290px]'
    : 'lg:ml-[90px]';

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserDetails());
    }
  }, [user]);

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}>
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    </div>
  );
}
