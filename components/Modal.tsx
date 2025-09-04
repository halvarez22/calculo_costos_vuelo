
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-primary-700 w-full max-w-lg rounded-2xl shadow-2xl border border-primary-600 relative flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-primary-600">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button 
            onClick={onClose} 
            aria-label="Cerrar modal" 
            className="p-2 rounded-full hover:bg-primary-600 transition-colors"
          >
            <CloseIcon className="w-6 h-6 text-gray-400" />
          </button>
        </header>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
