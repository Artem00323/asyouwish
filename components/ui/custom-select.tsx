// CustomReactSelect.tsx
import React from 'react';
import Select, { StylesConfig, SingleValue } from 'react-select';

interface OptionType<T> {
  value: T;
  label: string;
}

interface CustomReactSelectProps<T> {
  options: OptionType<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  isSearchable?: boolean;
}

export function CustomReactSelect<T>({
  options,
  value,
  onChange,
  placeholder,
  className,
  isSearchable = true,
}: CustomReactSelectProps<T>) {
  const customStyles: StylesConfig<OptionType<T>, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'white',
      borderColor: '#D1D5DB', // Tailwind's gray-300
      color: 'black',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.5)' : provided.boxShadow,
      '&:hover': {
        borderColor: '#9CA3AF', // Tailwind's gray-400
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderColor: '#D1D5DB', // Tailwind's gray-300
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#E5E7EB' : 'white', // Tailwind's gray-200
      color: 'black',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#D1D5DB', // Tailwind's gray-300
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#6B7280', // Tailwind's gray-500
      '&:hover': {
        color: '#4B5563', // Tailwind's gray-600
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: '#D1D5DB', // Tailwind's gray-300
    }),
  };

  // Find the selected option based on the value prop
  const selectedOption = options.find((option) => option.value === value) || null;

  // Handle change event
  const handleChange = (selectedOption: SingleValue<OptionType<T>>) => {
    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleChange}
      styles={customStyles}
      placeholder={placeholder}
      className={className}
      isSearchable={isSearchable}
    />
  );
}
