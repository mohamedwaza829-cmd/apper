import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Info, X, CheckCircle, Zap, Shield, Flame } from 'lucide-react';
import { AuraStatusBar } from './AuraHeader';
import { ParticleSphere } from './ParticleSphere';

interface LongevityScoreScreenProps {
  onBack: () => void;
  user: any;
  language: string;
}

export const LongevityScoreScreen: React.FC<LongevityScoreScreenProps> = ({
  onBack,
  user,
  language,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'prev' | 'today' | 'next'>('today');
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const streak = user?.progress?.streak || 4;
  const sessions = user?.progress?.sessionsCompleted || 12;
  const cycles = user?.progress?.breathingCyclesCompleted || 18;

  return (
    <div className="relative w-full h-full bg-[#121212] text-[#EDEDED] flex flex-col overflow-y-auto scrollbar-none pb-28 select-none">
      {/* Top ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E2C854]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status Bar */}
      <AuraStatusBar time="11:30" />

      {/* Header Bar */}
      <div className="px-6 py-2 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-[#EDEDED] transition-colors cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-base font-medium tracking-tight text-[#EDEDED]">
          {language === 'ar' ? 'مؤشر العمر الحيوي' : 'Longevity Score'}
        </h1>

        <button
          onClick={() => setShowInfoModal(true)}
          className="w-10 h-10 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-[#EDEDED] transition-colors cursor-pointer"
          title="Information"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Date Switcher Tabs (Matches Screen 3 in image) */}
      <div className="flex items-center justify-center gap-6 py-2 text-xs font-medium text-[#A3A3A3] z-10">
        <button
          onClick={() => setSelectedPeriod('prev')}
          className={`transition-colors cursor-pointer ${
            selectedPeriod === 'prev' ? 'text-[#EDEDED]' : 'hover:text-[#EDEDED]'
          }`}
        >
          ← {language === 'ar' ? '١٩ أغسطس' : 'Aug 19'}
        </button>

        <button
          onClick={() => setSelectedPeriod('today')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedPeriod === 'today'
              ? 'text-[#EDEDED] border-b-2 border-[#E2C854]'
              : 'hover:text-[#EDEDED]'
          }`}
        >
          {language === 'ar' ? 'اليوم' : 'Today'}
        </button>

        <button
          onClick={() => setSelectedPeriod('next')}
          className={`transition-colors cursor-pointer ${
            selectedPeriod === 'next' ? 'text-[#EDEDED]' : 'hover:text-[#EDEDED]'
          }`}
        >
          {language === 'ar' ? '٢٦ أغسطس' : 'Aug 26'} →
        </button>
      </div>

      {/* 3D Particle Nebula Sphere (Screen 3) */}
      <div className="py-2 flex justify-center items-center z-10">
        <ParticleSphere
          score="26.4"
          label={language === 'ar' ? 'عمرك في Aura' : 'Aura Age'}
          sublabel={language === 'ar' ? 'أصغر بـ ٥.١ سنوات' : '5.1 years younger'}
        />
      </div>

      <div className="px-5 space-y-4 z-10">
        {/* Pace of Aging Section with Calibrated Ruler Slider (Screen 3) */}
        <div className="bg-[#181818] border border-[#262626] rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#E2C854]" />
            <span className="text-xs font-medium text-[#EDEDED]">
              {language === 'ar' ? 'وتيرة التقدم بالعمر' : 'Pace of Aging'}
            </span>
          </div>

          <div className="text-center py-1">
            <span className="text-3xl font-medium font-mono tracking-tight text-[#EDEDED]">
              0.7x
            </span>
          </div>

          {/* Calibrated Ruler Component */}
          <div className="pt-3 pb-1">
            <div className="flex justify-between text-[11px] text-[#A3A3A3] mb-1.5 font-medium">
              <span>{language === 'ar' ? 'بطيء ومثالي' : 'Slow'}</span>
              <span>{language === 'ar' ? 'سريع' : 'Fast'}</span>
            </div>

            {/* Precision Ruler Ticks */}
            <div className="relative w-full h-8 flex items-center justify-between px-1">
              {/* Ticks representation */}
              {Array.from({ length: 29 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-[1.5px] rounded-full transition-all ${
                    i === 11
                      ? 'h-6 bg-[#E2C854] shadow-[0_0_8px_#E2C854]'
                      : i % 7 === 0
                      ? 'h-4 bg-[#EDEDED]/40'
                      : 'h-2 bg-[#EDEDED]/15'
                  }`}
                />
              ))}

              {/* Active Indicator Pin */}
              <div 
                className="absolute top-0 flex flex-col items-center -translate-x-1/2"
                style={{ left: '40%' }}
              >
                <span className="text-[10px] font-mono font-bold text-[#E2C854] bg-[#181818] px-1 rounded-sm border border-[#E2C854]/30">
                  0.7
                </span>
                <div className="w-1.5 h-1.5 rotate-45 bg-[#E2C854] shadow-[0_0_6px_#E2C854] -mt-0.5" />
              </div>
            </div>

            {/* Calibration Values */}
            <div className="flex justify-between text-[10px] font-mono text-[#A3A3A3] mt-1">
              <span>-1.8x</span>
              <span>1.0x</span>
              <span>3.0x</span>
            </div>
          </div>
        </div>

        {/* Steady and Healthy Assessment Card (Screen 3) */}
        <div className="bg-[#181818] border border-[#262626] rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-base font-medium text-[#EDEDED] mb-1.5">
            {language === 'ar' ? 'مستقر وصحي للغاية' : 'Steady and Healthy'}
          </h3>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            {language === 'ar'
              ? 'عمرك البيولوجي في Aura أصغر من عمرك الزمني، ووتيرة التقدم لديك بطيئة وممتازة بفضل التزامك بجلسات التنفس واليوغا ونمط حياتك النشط خلال الشهر المنصرم.'
              : 'Your Aura Age is younger and your Pace of Aging is slow, thanks to your consistent routine and active lifestyle over the past month.'}
          </p>
        </div>

        {/* Vital Stats Mini Bento */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#181818] border border-[#262626] rounded-[20px] p-3 text-center">
            <Flame className="w-4 h-4 text-[#E2C854] mx-auto mb-1" />
            <div className="text-lg font-medium font-mono text-[#EDEDED]">{streak}</div>
            <div className="text-[10px] text-[#A3A3A3]">{language === 'ar' ? 'أيام متتالية' : 'Streak'}</div>
          </div>

          <div className="bg-[#181818] border border-[#262626] rounded-[20px] p-3 text-center">
            <CheckCircle className="w-4 h-4 text-[#E2C854] mx-auto mb-1" />
            <div className="text-lg font-medium font-mono text-[#EDEDED]">{sessions}</div>
            <div className="text-[10px] text-[#A3A3A3]">{language === 'ar' ? 'جلسة مكتملة' : 'Sessions'}</div>
          </div>

          <div className="bg-[#181818] border border-[#262626] rounded-[20px] p-3 text-center">
            <Zap className="w-4 h-4 text-[#E2C854] mx-auto mb-1" />
            <div className="text-lg font-medium font-mono text-[#EDEDED]">{cycles}</div>
            <div className="text-[10px] text-[#A3A3A3]">{language === 'ar' ? 'دورة تنفس' : 'Cycles'}</div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#181818] border border-[#262626] rounded-[24px] p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowInfoModal(false)}
                className="absolute top-4 ltr:right-4 rtl:left-4 w-8 h-8 rounded-full bg-[#222222] border border-[#2A2A2A] flex items-center justify-center text-[#A3A3A3] hover:text-[#EDEDED]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-medium text-[#EDEDED] mb-3">
                {language === 'ar' ? 'كيف يُحسب مؤشر Aura؟' : 'Understanding Aura Longevity'}
              </h3>

              <div className="space-y-2.5 text-xs text-[#A3A3A3] leading-relaxed">
                <p>
                  {language === 'ar'
                    ? 'يعتمد مؤشر Aura على دمج قراءات تقلب معدل ضربات القلب (HRV)، والتنفس المنتظم 4-7-8، وجودة النوم العميق لحساب العمر الخلوي الحيوي.'
                    : 'The Aura Longevity score combines Heart Rate Variability (HRV), 4-7-8 autonomic breath pacing, and cellular recovery metrics to estimate your true biological age.'}
                </p>
                <p>
                  {language === 'ar'
                    ? 'الوتيرة 0.7x تعني أن جسمك يشيخ بنسبة 30% أبطأ من المعدل الزمني الطبيعي.'
                    : 'A pace of 0.7x indicates your biological systems age 30% slower than chronological time.'}
                </p>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full mt-5 py-3 rounded-full bg-[#E2C854] text-[#121212] font-semibold text-xs hover:bg-[#ebd775] transition cursor-pointer"
              >
                {language === 'ar' ? 'فهمت ذلك' : 'Got it'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LongevityScoreScreen;
