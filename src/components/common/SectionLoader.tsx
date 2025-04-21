import Loader from '@/icons/components/Loader';
import React from 'react';

const SectionLoader = ({
  isLoading = false,
  children
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default SectionLoader;
