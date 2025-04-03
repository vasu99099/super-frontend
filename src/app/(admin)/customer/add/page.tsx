import CustomerAddEdit from '@/components/admin/customer/CustomerAddEdit';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Customers',
  description:
    'This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template'
};

export default async function CustomerPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6" x-text="pageName">
        Customers
      </h2>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <CustomerAddEdit isEdit={false} />
        </div>
      </div>
    </div>
  );
}
