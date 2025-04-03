import React from 'react';

const Skeleton = ({
  height = '24px',
  width = '100%'
}: {
  height?: number | string;
  width?: number | string;
}) => {
  return (
    <div className="bg-gray-200 rounded-sm dark:bg-gray-700 mb-4" style={{ height, width }}></div>
  );
};

export default Skeleton;
