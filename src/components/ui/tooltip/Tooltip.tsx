import React, { ReactNode, useState } from 'react';

type TooltipProps = {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'bottom',
  maxWidth = '200px'
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}>
      {children}

      {visible && (
        <div
          className={`absolute z-99 px-3 py-2 text-xs text-white bg-gray-800 rounded shadow-md transition-opacity duration-200 ${
            position === 'top'
              ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
              : position === 'bottom'
              ? 'top-full left-1/2 transform -translate-x-1/2 mt-2'
              : position === 'left'
              ? 'right-full top-1/2 transform -translate-y-1/2 mr-2'
              : 'left-full top-1/2 transform -translate-y-1/2 ml-2'
          }`}
          style={{
            maxWidth,
            minWidth: '300px',
            wordWrap: 'break-word', // Ensures words break properly
            whiteSpace: 'normal' // Allows multi-line wrapping
          }}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
