import React from 'react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'Meds', label: 'Meds', icon: 'medication' },
    { id: 'Booking', label: 'Booking', icon: 'calendar_month' },
    { id: 'Help', label: 'Help', icon: 'handshake' },
    { id: 'Subsidies', label: 'Subsidies', icon: 'local_pharmacy' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#ffffff] dark:bg-[#2f3133] border-t-2 border-[#c3c6d6] shadow-xl">
      <div className="flex justify-around items-center w-full px-2 pb-2 h-16 max-w-[800px] mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-95 flex-1 min-w-[64px] ${
                isActive
                  ? 'bg-[#a0f2af] text-[#1e713b] font-bold shadow-sm'
                  : 'text-[#42464e] dark:text-[#f0f0f3] hover:bg-[#eeeef0] dark:hover:bg-[#424654]'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[28px] leading-none"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="text-xs font-semibold tracking-wide block mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
