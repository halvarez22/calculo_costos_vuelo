import React from 'react';

interface ResultCardProps {
  label: string;
  value: string;
  description: string;
  onClick?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, description, onClick }) => {
  const isClickable = !!onClick;
  return (
    <div 
      className={`bg-slate-800/50 border border-slate-700 p-6 rounded-lg text-center transition-all duration-300 ${isClickable ? 'cursor-pointer hover:bg-slate-700/50 hover:border-sky-500/50 transform hover:scale-105' : ''}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={e => isClickable && (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <p className="text-sm font-medium text-sky-400 uppercase tracking-wider">{label}</p>
      <p className="text-4xl font-bold text-white my-2">{value}</p>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
};