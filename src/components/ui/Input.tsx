import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id?: string;
}

export default function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
        >
          {label}
          {props.required && <span className="text-red-600 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600',
          'focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-1',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'transition-all duration-200',
          'placeholder:text-gray-400',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <p 
          id={errorId}
          className="mt-2 text-sm text-red-600 dark:text-red-400" 
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
