import React from 'react';

type TimelineProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
};

const Timeline = <T,>({ items, renderItem }: TimelineProps<T>) => {
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700">
      {items.map((item, index) => (
        <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
      ))}
    </ol>
  );
};

export default Timeline;
