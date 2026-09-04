import React from 'react';
import { Home, Sparkles, Wind, Heart, Bot, BarChart3 } from 'lucide-react';

interface Props {
  currentTab: string;
  isArabic: boolean;
  onTabSelected: (tab: string) => void;
}

export const AuraBottomNav: React.FC<Props> = ({ currentTab, isArabic, onTabSelected }) => {
  const items = [
    { route: 'home', labelEn: 'Home', labelAr: 'الرئيسية', icon: Home },
    { route: 'meditation', labelEn: 'Meditation', labelAr: 'التأمل', icon: Sparkles },
    { route: 'breathing', labelEn: 'Breathing', labelAr: 'التنفس', icon: Wind },
    { route: 'longevity', labelEn: 'Vitality', labelAr: 'الحيوية', icon: Heart },
    { route: 'ai_coach', labelEn: 'AI Coach', labelAr: 'المرشد', icon: Bot },
    { route: 'progress', labelEn: 'Progress', labelAr: 'التقدم', icon: BarChart3 }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#262626] px-2 py-2 z-40">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isSelected = currentTab === item.route;
          return (
            <button
              key={item.route}
              onClick={() => onTabSelected(item.route)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isSelected ? 'text-[#E2C854] bg-[#181818]' : 'text-[#A3A3A3] hover:text-[#EDEDED]'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-[10px] font-medium tracking-tight">
                {isArabic ? item.labelAr : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
