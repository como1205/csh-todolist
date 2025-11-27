import React, { forwardRef } from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    // 고유 ID 생성
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    // 베이스 스타일
    const baseStyles = 'w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-2 focus:ring-primary-500 transition-colors duration-200';

    // Disabled 스타일
    const disabledStyles = props.disabled
      ? 'cursor-not-allowed opacity-50'
      : 'cursor-pointer';

    const combinedClassName = `
      ${baseStyles}
      ${disabledStyles}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    if (label) {
      return (
        <label
          htmlFor={checkboxId}
          className={`flex items-center space-x-3 group ${props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={combinedClassName}
            {...props}
          />
          <span className={`text-gray-700 group-hover:text-gray-900 ${props.disabled ? 'opacity-50' : ''}`}>
            {label}
          </span>
        </label>
      );
    }

    return (
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        className={combinedClassName}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
