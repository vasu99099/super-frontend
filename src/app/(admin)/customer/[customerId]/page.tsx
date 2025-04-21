import Customer from '@/components/admin/customer';
import CustomerDetailsIndex from '@/components/admin/customer/details';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Customers',
  description:
    'This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template'
};

export default async function CustomerDetails() {
  return (
    <>
      <CustomerDetailsIndex />
    </>
  );
}
