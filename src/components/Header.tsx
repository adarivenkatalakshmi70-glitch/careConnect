import React from 'react';

interface HeaderProps {
  onBack?: () => void;
  onHelp?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onBack, onHelp, title }) => {
  return (
    <header className="bg-white dark:bg-[#2f3133] border-b-2 border-[#c3c6d6] w-full sticky top-0 z-40">
      <div className="flex justify-between items-center h-16 px-6 max-w-[800px] mx-auto">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#eeeef0] active:bg-[#e2e2e5] transition-colors disabled:opacity-30"
          disabled={!onBack}
        >
          <span className="material-symbols-outlined text-[#0040a1] font-bold">arrow_back</span>
        </button>
        
        <h1 className="text-2xl font-bold text-[#0040a1] tracking-tight flex flex-col items-center">
          <span>CareConnect</span>
          {title && <span className="text-xs font-semibold text-[#424654] uppercase tracking-wider">{title}</span>}
        </h1>

        <button
          onClick={onHelp}
          aria-label="Get Help Documentation"
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#eeeef0] active:bg-[#e2e2e5] transition-colors"
        >
          <span className="material-symbols-outlined text-[#0040a1] font-bold">help</span>
        </button>
      </div>
    </header>
  );
};
