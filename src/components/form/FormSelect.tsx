'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false });

interface SelectComponentProps {
  options: { value: string | number; label: string }[] | object[];
  defaultValue?: { value: string | number; label: string } | object | string | number | undefined;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isRtl?: boolean;
  isSearchable?: boolean;
  name: string;
  onChange?: (selectedOption: any) => void;
  error?: boolean;
  labelKey?: string;
  ValueKey?: string;
  isAsync?: boolean;
  onLoadOption?: (input: string) => Promise<any[]>;
}
const customStyles = (error = false) => {
  return {
    control: (provided: any, state: any) => ({
      ...provided,
      padding: '3px',
      borderColor: error ? 'red' : state.isFocused ? '#4CAF50' : '#ccc',
      boxShadow: 'none',
      borderWidth: '1px',
      '&:hover': {
        borderColor: error ? 'red' : state.isFocused ? '#4CAF50' : '#888'
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
  onChange,
  error,
  labelKey,
  ValueKey,
  onLoadOption,
  isAsync = false
}) => {
  const getOptionLabel = (option: any) => {
    return labelKey && option[labelKey] ? option[labelKey] : option?.label ?? String(option);
  };

  const getOptionValue = (option: any) => {
    return ValueKey && option[ValueKey] ? option[ValueKey] : option?.value ?? String(option);
  };
  console.log(
    'defaultValue && ty',
    name,
    defaultValue && typeof defaultValue !== 'object'
      ? options.find((opt) => getOptionValue(opt).toString() === defaultValue.toString())
      : undefined
  );

  return isAsync ? (
    <AsyncSelect
      // cacheOptions
      loadOptions={onLoadOption}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      placeholder="-- Select --"
      className="basic-single "
      classNamePrefix="select"
      defaultValue={
        defaultValue && typeof defaultValue !== 'object'
          ? options.find((opt) => getOptionValue(opt).toString() === defaultValue.toString())
          : defaultValue ?? undefined
      }
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      name={name}
      defaultOptions={options}
      onChange={onChange}
      styles={customStyles(error)}
      value={
        defaultValue && typeof defaultValue !== 'object'
          ? options.find((opt) => getOptionValue(opt).toString() === defaultValue.toString())
          : defaultValue ?? undefined
      }
    />
  ) : (
    <Select
      value={
        defaultValue && typeof defaultValue !== 'object'
          ? options.find((opt) => getOptionValue(opt).toString() === defaultValue.toString())
          : defaultValue ?? undefined
      }
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      placeholder="-- Select --"
      className="basic-single "
      classNamePrefix="select"
      defaultValue={
        defaultValue && typeof defaultValue !== 'object'
          ? options.find((opt) => getOptionValue(opt).toString() === defaultValue.toString())
          : defaultValue ?? undefined
      }
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      name={name}
      options={options}
      onChange={onChange}
      styles={customStyles(error)}
    />
  );
};

export default SelectComponent;
