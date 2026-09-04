import React from 'react';
import { History, Home, Compass, User, Moon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AuraBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language: string;
}

export const AuraBottomNav: React.FC<AuraBottomNavProps> = ({
  currentPage,
  onNavigate,
  language,
}) => {
  const tabs = [
    {
      id: 'longevity',
      labelAr: 'النشاط الحيوي',
      labelEn: 'Activity',
      icon: History,
    },
    {
      id: 'home',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      icon: Home,
    },
    {
      id: 'sessions',
      labelAr: 'السكينة',
      labelEn: 'Mindfulness',
      icon: Moon,
    },
  ];

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center pointer-events-none z-30 px-6">
      <div className="pointer-events-auto flex items-center bg-[#1A1A1A] border border-[#262626] rounded-full px-6 py-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.85)] gap-7">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`relative p-2 transition-all duration-200 rounded-full cursor-pointer flex flex-col items-center justify-center ${
                isActive
                  ? 'text-[#E2C854]'
                  : 'text-[#737373] hover:text-[#EDEDED]'
              }`}
              title={language === 'ar' ? tab.labelAr : tab.labelEn}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#E2C854] shadow-[0_0_6px_#E2C854]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AuraBottomNav;

