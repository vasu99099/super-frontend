import React from 'react';

const Text = ({
  content,
  className = '',
  ...others
}: {
  content: string | undefined;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <span className={`text-gray-500 text-start dark:text-gray-400 ${className}`} {...others}>
      {content ?? ''}
    </span>
  );
};

export default Text;
