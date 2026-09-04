import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { BreathingPhase } from '../types';

interface Props {
  isArabic: boolean;
  isActive: boolean;
  currentPhase: BreathingPhase;
  secondsLeft: number;
  completedCycles: number;
  onStart: () => void;
  onStop: () => void;
}

export const BreathingScreen: React.FC<Props> = ({
  isArabic,
  isActive,
  currentPhase,
  secondsLeft,
  completedCycles,
  onStart,
  onStop
}) => {
  const getPhaseLabel = (phase: BreathingPhase) => {
    switch (phase) {
      case 'INHALE':
        return isArabic ? 'شهيق' : 'Inhale';
      case 'HOLD':
        return isArabic ? 'حبس النفس' : 'Hold';
      case 'EXHALE':
        return isArabic ? 'زفير' : 'Exhale';
    }
  };

  // Pulse animation scale calculation
  const getScale = () => {
    if (!isActive) return 'scale-100';
    if (currentPhase === 'INHALE' || currentPhase === 'HOLD') return 'scale-125';
    return 'scale-90'; // EXHALE
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] px-4 py-4 pb-24 text-center">
      {/* Top Titles */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#E2C854]">
          {isArabic ? 'تنفس التوازن الحيوي (4-4-4)' : 'Resonant Breathwork (4-4-4)'}
        </h1>
        <p className="text-xs text-[#A3A3A3]">
          {isArabic ? 'مزامنة موجات الدماغ وتنظيم ضربات القلب' : 'Synchronize HRV & vagal nerve tone'}
        </p>
      </div>

      {/* Center Pulsing Animated Orb */}
      <div className="relative my-8 flex items-center justify-center w-64 h-64">
        {/* Glow Ring */}
        <div
          className={`absolute inset-0 rounded-full bg-[#E2C854]/20 transition-transform duration-[3800ms] ease-in-out ${getScale()}`}
        />
        {/* Middle Orb */}
        <div
          className={`relative w-48 h-48 rounded-full bg-[#181818] border-2 border-[#E2C854]/80 flex flex-col items-center justify-center transition-transform duration-[3800ms] ease-in-out shadow-2xl ${getScale()}`}
        >
          <span className="text-2xl font-bold text-[#E2C854]">
            {!isActive ? (isArabic ? 'جاهز؟' : 'Ready?') : getPhaseLabel(currentPhase)}
          </span>
          {isActive && (
            <span className="text-4xl font-black text-[#EDEDED] mt-2">
              {secondsLeft}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Stats & Controls */}
      <div className="w-full space-y-4">
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 flex justify-around items-center">
          <div>
            <div className="text-xl font-bold text-[#E2C854]">{completedCycles}</div>
            <div className="text-xs text-[#A3A3A3]">
              {isArabic ? 'دورات مكتملة' : 'Completed Cycles'}
            </div>
          </div>
          <div className="w-px h-8 bg-[#262626]" />
          <div>
            <div className="text-xl font-bold text-[#EDEDED]">{completedCycles * 12}s</div>
            <div className="text-xs text-[#A3A3A3]">
              {isArabic ? 'المدة الإجمالية' : 'Total Time'}
            </div>
          </div>
        </div>

        <button
          onClick={isActive ? onStop : onStart}
          className={`w-full py-3.5 rounded-full font-bold flex items-center justify-center space-x-2 space-x-reverse transition-all shadow-lg ${
            isActive
              ? 'bg-[#EF4444] text-[#EDEDED] hover:bg-red-600'
              : 'bg-[#E2C854] text-[#121212] hover:bg-[#d8bd48]'
          }`}
        >
          {isActive ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          <span>
            {isActive
              ? (isArabic ? 'إيقاف الجلسة' : 'Stop Session')
              : (isArabic ? 'ابدأ تمرين التنفس' : 'Start Breathing')}
          </span>
        </button>
      </div>
    </div>
  );
};
