import React from 'react';
import { Languages, Play, Wind, ChevronRight } from 'lucide-react';
import { SessionItem, AuraMetrics, UserProgress } from '../types';

interface Props {
  isArabic: boolean;
  metrics: AuraMetrics;
  progress: UserProgress;
  meditations: SessionItem[];
  yogaSessions: SessionItem[];
  onSelectSession: (session: SessionItem) => void;
  onStartBreathing: () => void;
  onToggleLanguage: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  isArabic,
  metrics,
  progress,
  meditations,
  yogaSessions,
  onSelectSession,
  onStartBreathing,
  onToggleLanguage
}) => {
  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <p className="text-[#A3A3A3] text-xs font-medium">
            {isArabic ? 'مرحباً بعودتك' : 'Welcome back'}
          </p>
          <h1 className="text-2xl font-bold text-[#EDEDED]">
            {isArabic ? 'الحيوية واليقظة' : 'Vitality & Calm'}
          </h1>
        </div>
        <button
          onClick={onToggleLanguage}
          className="p-2.5 bg-[#181818] border border-[#262626] rounded-full text-[#E2C854] hover:bg-[#222222] transition-colors"
          title="Switch Language"
        >
          <Languages size={18} />
        </button>
      </div>

      {/* Longevity Biometric Quick Card */}
      <div className="bg-[#181818] border border-[#262626] rounded-2xl p-4 flex justify-between items-center shadow-lg">
        <div>
          <p className="text-[#A3A3A3] text-xs">
            {isArabic ? 'مؤشر الحيوية والعمر الأيضي' : 'Vitality Longevity Index'}
          </p>
          <div className="flex items-baseline space-x-2 space-x-reverse mt-1">
            <span className="text-3xl font-extrabold text-[#E2C854]">
              {metrics.auraAge}
            </span>
            <span className="text-xs text-[#34D399] font-semibold">
              {isArabic ? 'سنة بيولوجية (-4)' : 'Bio-years (-4)'}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-[#262626] flex items-center justify-center">
          <span className="text-[#E2C854] font-bold text-sm">{progress.streak}d</span>
        </div>
      </div>

      {/* Resonant Breathing Action Hero */}
      <button
        onClick={onStartBreathing}
        className="w-full text-left bg-gradient-to-r from-[#2E2A14] to-[#181818] border border-[#E2C854]/40 rounded-2xl p-5 flex justify-between items-center hover:border-[#E2C854] transition-all shadow-md group"
      >
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-[#E2C854] flex items-center gap-1.5">
            <Wind size={18} />
            {isArabic ? 'تمرين التنفس الرنان (4-4-4)' : 'Resonant Breathing (4-4-4)'}
          </h2>
          <p className="text-xs text-[#A3A3A3]">
            {isArabic ? 'أعد ضبط نبضك واستعد التوازن في 3 دقائق' : 'Reset autonomic balance in 3 minutes'}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#E2C854] text-[#121212] flex items-center justify-center group-hover:scale-105 transition-transform">
          <Play size={18} fill="#121212" />
        </div>
      </button>

      {/* Recommended Meditations */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-[#EDEDED]">
          {isArabic ? 'جلسات التأمل الموصى بها' : 'Recommended Meditations'}
        </h2>
        <div className="flex space-x-3 space-x-reverse overflow-x-auto pb-2 scrollbar-none">
          {meditations.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectSession(item)}
              className="min-w-[200px] bg-[#181818] border border-[#262626] rounded-xl p-4 cursor-pointer hover:border-[#E2C854]/50 transition-colors flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#E2C854]">
                  {item.durationMinutes} {isArabic ? 'د' : 'min'}
                </span>
                <div className="w-7 h-7 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#EDEDED]">
                  <Play size={12} fill="#EDEDED" />
                </div>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#EDEDED] line-clamp-2">
                {isArabic ? item.title : item.titleEn}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Yoga & Movement Flows */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-[#EDEDED]">
          {isArabic ? 'حركات اليوغا وتدفق الطاقة' : 'Yoga & Movement Flows'}
        </h2>
        <div className="space-y-2">
          {yogaSessions.map((yoga) => (
            <div
              key={yoga.id}
              onClick={() => onSelectSession(yoga)}
              className="bg-[#181818] border border-[#262626] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-[#E2C854]/50 transition-colors"
            >
              <div>
                <h3 className="text-sm font-semibold text-[#EDEDED]">
                  {isArabic ? yoga.title : yoga.titleEn}
                </h3>
                <p className="text-xs text-[#A3A3A3] mt-0.5">
                  {yoga.durationMinutes} {isArabic ? 'دقيقة' : 'min'} • {yoga.category}
                </p>
              </div>
              <div className="text-[#E2C854]">
                <ChevronRight size={20} className={isArabic ? 'rotate-180' : ''} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
