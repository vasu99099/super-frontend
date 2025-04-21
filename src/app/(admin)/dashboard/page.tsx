import React from 'react';
import type { Metadata } from 'next';
import { DashboardComponent } from '@/components/admin/dashboard';

export const metadata: Metadata = {
  title: 'Super Dashboard ',
  description: 'This is Next.js Home for TailAdmin Dashboard Template'
};

export default function Ecommerce() {
  return (
    <div>
      <DashboardComponent />
    </div>
  );
}
