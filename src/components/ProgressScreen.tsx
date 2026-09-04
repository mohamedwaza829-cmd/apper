import React from 'react';
import { Award, Lock, Share2 } from 'lucide-react';
import { UserProgress, BadgeItem } from '../types';

interface Props {
  isArabic: boolean;
  progress: UserProgress;
  badges: BadgeItem[];
}

export const ProgressScreen: React.FC<Props> = ({ isArabic, progress, badges }) => {
  const days = isArabic ? ['س', 'أ', 'ن', 'ث', 'ع', 'خ', 'ج'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleShare = () => {
    const text = isArabic
      ? `أكملت ${progress.sessionsCompleted} جلسة تأمل مع Evolum وسلسلة ${progress.streak} أيام من الحيوية واليقظة! 🌟`
      : `Completed ${progress.sessionsCompleted} sessions with Evolum and a ${progress.streak}-day streak! 🌟`;

    if (navigator.share) {
      navigator.share({ title: 'Evolum Wellness Progress', text });
    } else {
      navigator.clipboard.writeText(text);
      alert(isArabic ? 'تم نسخ الإنجاز إلى الحافظة!' : 'Copied progress to clipboard!');
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2">
      <div>
        <h1 className="text-xl font-bold text-[#E2C854]">
          {isArabic ? 'رحلة التقدم والإنجازات' : 'Progress & Milestones'}
        </h1>
        <p className="text-xs text-[#A3A3A3] mt-0.5">
          {isArabic ? 'متابعة ساعات التأمل والنشاط وشارات التميز' : 'Track session consistency, practice hours, and honors'}
        </p>
      </div>

      {/* 3 Summary Stats Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#181818] border border-[#262626] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#E2C854]">{progress.streak}</div>
          <div className="text-[10px] text-[#A3A3A3] mt-1">{isArabic ? 'أيام متتالية' : 'Day Streak'}</div>
        </div>
        <div className="bg-[#181818] border border-[#262626] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#E2C854]">{progress.sessionsCompleted}</div>
          <div className="text-[10px] text-[#A3A3A3] mt-1">{isArabic ? 'جلسة مكتملة' : 'Completed'}</div>
        </div>
        <div className="bg-[#181818] border border-[#262626] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#E2C854]">{progress.minutesMeditated}</div>
          <div className="text-[10px] text-[#A3A3A3] mt-1">{isArabic ? 'دقيقة تأمل' : 'Minutes'}</div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-[#181818] border border-[#262626] rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[#EDEDED]">
          {isArabic ? 'نشاط الأسبوع الحالي' : 'Weekly Practice Minutes'}
        </h3>
        <div className="flex justify-between items-end h-28 pt-4">
          {progress.weeklyActivity.map((mins, idx) => {
            const heightPercent = Math.min(Math.max((mins / 45) * 100, 15), 100);
            return (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-6 rounded-t-md transition-all ${
                    mins > 0 ? 'bg-[#E2C854]' : 'bg-[#0A0A0A] border border-[#262626]'
                  }`}
                />
                <span className="text-[10px] text-[#A3A3A3]">{days[idx]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Progress Button */}
      <button
        onClick={handleShare}
        className="w-full py-3 bg-[#181818] border border-[#262626] hover:border-[#E2C854]/50 rounded-full flex items-center justify-center space-x-2 space-x-reverse text-xs text-[#EDEDED] font-semibold transition-colors"
      >
        <Share2 size={16} className="text-[#E2C854]" />
        <span>{isArabic ? 'مشاركة الإنجاز' : 'Share Progress'}</span>
      </button>

      {/* Badges Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-[#EDEDED]">
          {isArabic ? 'شارات الإنجاز والجوائز' : 'Badges & Achievements'}
        </h3>
        <div className="space-y-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`bg-[#181818] border rounded-xl p-3.5 flex items-center justify-between ${
                badge.isUnlocked ? 'border-[#E2C854]/40' : 'border-[#262626]'
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    badge.isUnlocked ? 'bg-[#E2C854]/20 text-[#E2C854]' : 'bg-[#0A0A0A] text-[#A3A3A3]'
                  }`}
                >
                  {badge.isUnlocked ? <Award size={20} /> : <Lock size={18} />}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#EDEDED]">
                    {isArabic ? badge.title : badge.titleEn}
                  </h4>
                  <p className="text-[10px] text-[#A3A3A3] mt-0.5">{badge.description}</p>
                </div>
              </div>

              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                  badge.isUnlocked ? 'bg-[#E2C854] text-[#121212]' : 'bg-[#0A0A0A] text-[#A3A3A3]'
                }`}
              >
                {badge.isUnlocked
                  ? (isArabic ? 'مفتوحة' : 'Unlocked')
                  : (isArabic ? 'مقفلة' : 'Locked')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
