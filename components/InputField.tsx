
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full bg-primary-700 border border-primary-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-accent focus:border-accent transition"
      />
    </div>
  );
};
