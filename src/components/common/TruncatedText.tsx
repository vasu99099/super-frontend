import React from 'react';
import Tooltip from '../ui/tooltip/Tooltip';
import { InfoIcon } from '@/icons/components/InfoIcon';

type TruncatedTextProps = {
  text: string;
  maxLength?: number;
};

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxLength = 20 }) => {
  if (!text) {
    return '';
  }
  const isTruncated = text.length > maxLength;
  const displayedText = isTruncated ? text.slice(0, maxLength) + '...' : text;

  return (
    <div className="flex items-center gap-1">
      <span className="truncate">{displayedText}</span>

      {isTruncated && (
        <Tooltip content={text} position="top">
          <InfoIcon className=" text-gray-500 cursor-pointer hover:text-gray-700" />
        </Tooltip>
      )}
    </div>
  );
};

export default TruncatedText;
