'use client';
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics';
import { dispatch } from '@/store';
import { getDashboardData } from '@/store/slices/dashboardSlice';
import React, { useEffect } from 'react';

export const DashboardComponent = () => {
  useEffect(() => {
    dispatch(getDashboardData());
  }, []);
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
      </div>
    </div>
  );
};
