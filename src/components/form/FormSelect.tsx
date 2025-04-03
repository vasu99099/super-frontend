'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });

interface SelectComponentProps {
  options: { value: string | number; label: string }[];
  defaultValue?: { value: string | number; label: string } | undefined;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isRtl?: boolean;
  isSearchable?: boolean;
  name: string;
  onChange?: (selectedOption: any) => void;
}
const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: state.isFocused ? '#4CAF50' : '#ccc',
    boxShadow: 'none',
    borderWidth: '1px',
    '&:hover': {
      borderColor: state.isFocused ? '#4CAF50' : '#888'
    }
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#333'
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#f0f0f0' : 'white',
    color: state.isSelected ? 'white' : '#333',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f0f0f0'
    }
  })
};

const SelectComponent: React.FC<SelectComponentProps> = ({
  options,
  defaultValue,
  isDisabled,
  isLoading,
  isClearable,
  isRtl,
  isSearchable,
  name,
  onChange
}) => {
  return (
    <Select
      placeholder="-- Select --"
      className="basic-single"
      classNamePrefix="select"
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isRtl={isRtl}
      isSearchable={isSearchable}
      name={name}
      options={options}
      onChange={onChange}
      styles={customStyles}
    />
  );
};

export default SelectComponent;
