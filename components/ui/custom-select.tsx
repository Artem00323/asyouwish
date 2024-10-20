// CustomReactSelect.tsx
import React from 'react';
import Select, { StylesConfig, SingleValue } from 'react-select';
import { useTheme } from '@/components/theme-provider';

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
  const { theme } = useTheme();

  const customStyles: StylesConfig<OptionType<T>, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? 'hsl(var(--background))' : 'white',
      borderColor: theme === 'dark' ? 'hsl(var(--border))' : '#D1D5DB',
      color: theme === 'dark' ? 'hsl(var(--foreground))' : 'black',
      boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : provided.boxShadow,
      '&:hover': {
        borderColor: theme === 'dark' ? 'hsl(var(--input))' : '#9CA3AF',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? 'hsl(var(--background))' : 'white',
      borderColor: theme === 'dark' ? 'hsl(var(--border))' : '#D1D5DB',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? theme === 'dark'
          ? 'hsl(var(--accent))'
          : '#E5E7EB'
        : theme === 'dark'
        ? 'hsl(var(--background))'
        : 'white',
      color: theme === 'dark' ? 'hsl(var(--foreground))' : 'black',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: theme === 'dark' ? 'hsl(var(--accent))' : '#D1D5DB',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === 'dark' ? 'hsl(var(--foreground))' : 'black',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: theme === 'dark' ? 'hsl(var(--muted-foreground))' : '#6B7280',
      '&:hover': {
        color: theme === 'dark' ? 'hsl(var(--foreground))' : '#4B5563',
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? 'hsl(var(--border))' : '#D1D5DB',
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
