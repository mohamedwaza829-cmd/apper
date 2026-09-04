import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ChevronDown, ChevronRight, X, Sparkles, RefreshCw } from 'lucide-react';
import { AuraStatusBar } from './AuraHeader';

interface AuraOnboardingProps {
  onComplete: () => void;
  language: string;
}

export const AuraOnboarding: React.FC<AuraOnboardingProps> = ({
  onComplete,
  language,
}) => {
  const [step, setStep] = useState<number>(2);
  const [isPairing, setIsPairing] = useState<boolean>(false);
  const [syncTime, setSyncTime] = useState<string>('7:15 am');

  const stepsData = [
    {
      step: 1,
      title: language === 'ar' ? 'البحث عن المستشعر' : 'Discovering Sensor',
      sub: language === 'ar' ? 'الارتباط البيومتري قيد التهيئة' : 'Biometric Link Initializing',
      status: language === 'ar' ? 'جاري الفحص...' : 'Scanning...',
    },
    {
      step: 2,
      title: language === 'ar' ? 'Aura متصل بالكامل' : 'Aura Connected',
      sub: language === 'ar' ? 'مزامنة الترددات الحيوية نشطة' : 'Bio-Frequency Sync Active',
      status: language === 'ar' ? 'متصل ومستقر' : 'Connected',
    },
    {
      step: 3,
      title: language === 'ar' ? 'جاهز للبدء' : 'Vitality Ready',
      sub: language === 'ar' ? 'تحليل معدل التقدم ومؤشر العمر' : 'Analyzing Biological Rhythm',
      status: language === 'ar' ? 'جاهز' : 'Calibrated',
    },
  ];

  const currentStepData = stepsData[step - 1] || stepsData[1];

  const handleTogglePairing = () => {
    setIsPairing(true);
    setTimeout(() => {
      setIsPairing(false);
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setSyncTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    }, 1200);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#121212] text-[#EDEDED] flex flex-col justify-between overflow-hidden select-none">
      {/* Subtle warm gold ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E2C854]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status Bar */}
      <AuraStatusBar time="11:30" />

      {/* Top Header Pill & Close Button */}
      <div className="px-6 py-2 flex items-center justify-between z-20">
        <div className="px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#262626] text-xs font-medium text-[#EDEDED]">
          {language === 'ar' ? 'مرحباً بك في Evolum Aura' : 'Welcome to Aura'}
        </div>

        <button
          onClick={onComplete}
          className="w-9 h-9 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-[#EDEDED] transition-colors cursor-pointer"
          title="Close / Skip"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Middle Biometric Circular Radar / Compass Dial */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        {/* Orbital Circular Rings Container */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Outermost Dashed Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#E2C854]/30 animate-spin-slow" />

          {/* Solid Arc Highlight Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-45" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#E2C854"
              strokeWidth="1.2"
              strokeDasharray="90 200"
              strokeLinecap="round"
            />
          </svg>

          {/* Inner Dashed Ring */}
          <div className="absolute w-52 h-52 rounded-full border border-dashed border-[#262626]" />

          {/* Floating Orbit Node */}
          <div className="absolute top-4 right-10 w-2.5 h-2.5 rounded-full bg-[#E2C854] shadow-[0_0_12px_#E2C854] animate-ping opacity-75" />

          {/* Central Floating Card */}
          <motion.div
            key={step}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 w-56 bg-[#181818] border border-[#262626] rounded-[24px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-center"
          >
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#E2C854]/15 border border-[#E2C854]/30 text-[10px] font-mono font-bold text-[#E2C854] mb-2 uppercase tracking-wider">
              {language === 'ar' ? `المرحلة ${currentStepData.step}` : `STEP ${currentStepData.step}`}
            </div>

            <h3 className="text-base font-medium text-[#EDEDED] tracking-tight mb-1">
              {currentStepData.title}
            </h3>

            <p className="text-[11px] text-[#A3A3A3] leading-tight">
              {currentStepData.sub}
            </p>

            <div className="mt-3 pt-3 border-t border-[#262626] flex flex-col items-center">
              <span className="text-[10px] text-[#A3A3A3] uppercase tracking-wider">
                {language === 'ar' ? 'آخر مزامنة' : 'Last Sync'}
              </span>
              <span className="text-xs font-mono font-medium text-[#EDEDED]">
                {syncTime}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Pairing Mode Pill Chip */}
        <button
          onClick={handleTogglePairing}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181818] border border-[#262626] hover:border-[#E2C854]/40 text-xs font-medium text-[#EDEDED] shadow-md transition-all cursor-pointer group active:scale-95"
        >
          <span className={`w-2 h-2 rounded-full bg-[#E2C854] ${isPairing ? 'animate-ping' : 'shadow-[0_0_8px_#E2C854]'}`} />
          <span>
            {isPairing
              ? (language === 'ar' ? 'جاري الاقتران...' : 'Pairing...')
              : (language === 'ar' ? 'فحص وضع الاقتران' : 'Check for Pairing Mode')}
          </span>
          {isPairing && <RefreshCw className="w-3 h-3 text-[#E2C854] animate-spin ml-1" />}
        </button>
      </div>

      {/* Bottom Control Bar */}
      <div className="px-8 pb-10 pt-4 flex items-center justify-between z-20">
        {/* Back Circle Button */}
        <button
          onClick={handlePrev}
          disabled={step <= 1}
          className="w-12 h-12 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-[#EDEDED] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        {/* Primary Active Gold Pill Button (matching Confirm Transfer button in Neuform Screen 3) */}
        <button
          onClick={handleNext}
          className="flex-1 max-w-[160px] mx-3 h-12 rounded-full bg-[#E2C854] hover:bg-[#ebd775] active:scale-95 text-[#121212] font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(226,200,84,0.3)] transition-all cursor-pointer"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span className="font-mono text-base tracking-tighter">»</span>
        </button>

        {/* Down Chevron Circle Button */}
        <button
          onClick={onComplete}
          className="w-12 h-12 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-[#EDEDED] transition-colors cursor-pointer"
          title="Continue to Dashboard"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AuraOnboarding;
