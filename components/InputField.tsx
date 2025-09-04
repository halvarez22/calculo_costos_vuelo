
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
      />
    </div>
  );
};
