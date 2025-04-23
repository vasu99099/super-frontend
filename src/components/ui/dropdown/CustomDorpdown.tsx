import React, { useState, useRef, useEffect } from 'react';

interface DropdownButton {
  label: string;
  onClick: () => void;
}

interface CustomDropdownProps {
  buttons: DropdownButton[];
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ buttons }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100">
        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-9999 mt-2 w-48 bg-white border rounded shadow-lg dark:bg-gray-700">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">
              {button.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
