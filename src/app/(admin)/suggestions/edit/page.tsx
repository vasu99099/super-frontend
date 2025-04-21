import React from 'react';
import type { Metadata } from 'next';
import AddEditSuggestions from '@/components/admin/customer/suggestions/AddEditSuggestions';

export const metadata: Metadata = {
  title: 'Suggestions ',
  description: 'This is Next.js Home for TailAdmin Dashboard Template'
};

export default function suggestion() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Suggestion
        </h3>
        <div className="space-y-6">
          <AddEditSuggestions isEdit />
        </div>
      </div>
    </div>
  );
}
