import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  ArrowLeftRight,
  Bell, 
  Settings, 
  Heart, 
  Sparkles, 
  Play, 
  Wind,
  Globe,
  SlidersHorizontal,
  Activity,
  Check,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { AuraStatusBar } from './AuraHeader';
import { mockData, SessionData } from '../data/sessions';

interface VitalityDashboardProps {
  user: any;
  setUser?: React.Dispatch<React.SetStateAction<any>>;
  onSelectSession: (session: any) => void;
  onNavigate: (page: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

export const VitalityDashboard: React.FC<VitalityDashboardProps> = ({
  user,
  setUser,
  onSelectSession,
  onNavigate,
  language,
  setLanguage,
  t,
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(108);

  // Heart rate subtle variation
  useEffect(() => {
    const interval = setInterval(() => {
      setBpm(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = prev + delta;
        return next >= 104 && next <= 112 ? next : 108;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#121212] text-[#EDEDED] flex flex-col overflow-y-auto scrollbar-none pb-28 select-none">
      {/* Top Status Bar */}
      <AuraStatusBar time="11:30" />

      {/* Header Bar matching Neuform Screen 1: System ID + Notification + Settings */}
      <div className="px-5 pt-2 pb-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#1C1C1C] border border-[#262626] overflow-hidden flex items-center justify-center text-xs font-semibold text-[#E2C854]">
            <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#262626] to-[#161616]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-[#EDEDED] flex items-center gap-1">
              {language === 'ar' ? `المعرف: ${user?.name || 'Alex'}` : `System ID: ${user?.name || 'Alex'}`}
            </span>
            <span className="text-[10px] text-[#A3A3A3] block uppercase tracking-wider">
              {language === 'ar' ? 'متصل بالمستشعر' : 'Aura Bio-Link'}
            </span>
          </div>
        </div>

        {/* Right utility buttons: Theme toggle + Language toggle + Notifications + Settings */}
        <div className="flex items-center gap-2">
          {/* Quick Dark Mode / Light Mode Toggle */}
          <button
            onClick={() => {
              if (setUser) {
                const nextTheme = user?.settings?.theme === 'dark' ? 'light' : 'dark';
                setUser((u: any) => ({
                  ...u,
                  settings: { ...u.settings, theme: nextTheme }
                }));
              }
            }}
            className="w-9 h-9 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#E2C854] hover:text-white hover:border-[#E2C854]/40 transition-colors cursor-pointer"
            title={user?.settings?.theme === 'dark' ? (language === 'ar' ? 'الوضع الداكن مفعّل (انقر للتغيير)' : 'Dark Mode Active (Click to switch)') : (language === 'ar' ? 'الوضع النهاري' : 'Light Mode')}
          >
            {user?.settings?.theme === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#E2C854]" />}
          </button>

          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="w-9 h-9 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-[#EDEDED] hover:border-[#E2C854]/40 transition-colors cursor-pointer text-[11px] font-mono"
            title="Toggle Language"
          >
            {language === 'ar' ? 'EN' : 'ع'}
          </button>

          <button
            onClick={() => onNavigate('longevity')}
            className="w-9 h-9 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-[#EDEDED] hover:border-[#E2C854]/40 transition-colors cursor-pointer"
            title="Activity / Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-9 h-9 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-[#EDEDED] hover:border-[#E2C854]/40 transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="mx-5 mb-3 bg-[#181818] border border-[#262626] rounded-2xl p-3 shadow-2xl z-30">
          <div className="flex items-center justify-between py-1.5 text-xs">
            <span className="text-[#A3A3A3] flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[#E2C854]" />
              {language === 'ar' ? 'الوضع الداكن والمظلم' : 'Dark Mode Theme'}
            </span>
            <button
              onClick={() => {
                if (setUser) {
                  setUser((u: any) => ({
                    ...u,
                    settings: { ...u.settings, theme: user?.settings?.theme === 'dark' ? 'light' : 'dark' }
                  }));
                }
              }}
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#E2C854] text-[#121212] cursor-pointer hover:bg-[#ebd775] transition"
            >
              {user?.settings?.theme === 'dark' ? (language === 'ar' ? 'مفعّل 🌙' : 'Active 🌙') : (language === 'ar' ? 'تفعيل' : 'Activate')}
            </button>
          </div>
          <div className="flex items-center justify-between py-1 text-xs border-t border-[#262626] mt-1 pt-1">
            <span className="text-[#A3A3A3]">{language === 'ar' ? 'المرشد الذكي' : 'AI Wellness Coach'}</span>
            <button
              onClick={() => { setShowSettings(false); onNavigate('ai-coach'); }}
              className="text-[#E2C854] font-medium text-xs hover:underline cursor-pointer"
            >
              {language === 'ar' ? 'فتح' : 'Open'}
            </button>
          </div>
          <div className="flex items-center justify-between py-1 text-xs border-t border-[#262626] mt-1 pt-1">
            <span className="text-[#A3A3A3]">{language === 'ar' ? 'مؤشر العمر الحيوي' : 'Longevity Details'}</span>
            <button
              onClick={() => { setShowSettings(false); onNavigate('longevity'); }}
              className="text-[#E2C854] font-medium text-xs hover:underline cursor-pointer"
            >
              {language === 'ar' ? 'عرض' : 'View'}
            </button>
          </div>
          <div className="flex items-center justify-between py-1 text-xs border-t border-[#262626] mt-1 pt-1">
            <span className="text-[#A3A3A3]">{language === 'ar' ? 'الملف الشخصي والجوائز' : 'Profile & Badges'}</span>
            <button
              onClick={() => { setShowSettings(false); onNavigate('profile'); }}
              className="text-[#E2C854] font-medium text-xs hover:underline cursor-pointer"
            >
              {language === 'ar' ? 'عرض' : 'View'}
            </button>
          </div>
          <div className="flex items-center justify-between py-1 text-xs border-t border-[#262626] mt-1 pt-1">
            <span className="text-[#A3A3A3]">{language === 'ar' ? 'الإعدادات الكاملة' : 'Full Settings'}</span>
            <button
              onClick={() => { setShowSettings(false); onNavigate('settings'); }}
              className="text-[#E2C854] font-medium text-xs hover:underline cursor-pointer"
            >
              {language === 'ar' ? 'فتح' : 'Open'}
            </button>
          </div>
        </div>
      )}

      <div className="px-5 space-y-4 z-10">
        {/* HERO METRIC CARD matching Neuform Screen 1: TOTAL VALUE with wave line & badge */}
        <div className="bg-[#181818] border border-[#262626] rounded-[24px] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#A3A3A3] font-normal uppercase tracking-[0.05em]">
              {language === 'ar' ? 'مؤشر الحيوية الكلي' : 'TOTAL VITALITY'}
            </span>
            <span className="inline-flex items-center gap-1 bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/20 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              +1.54%
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-medium tracking-tight text-[#EDEDED]">
                {bpm} <span className="text-sm font-normal text-[#A3A3A3]">bpm</span>
              </span>
            </div>
            <span className="text-xs font-medium text-[#A3A3A3]">
              {language === 'ar' ? 'العمر الأيضي: 23.8' : 'Metabolic: 23.8'}
            </span>
          </div>

          {/* Smooth wave chart across the card matching the Neuform finance hero */}
          <div className="relative w-full h-16 mt-1">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 320 60"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d="M 0 45 Q 40 45, 70 38 T 140 32 T 210 40 T 260 22 T 320 30 L 320 60 L 0 60 Z"
                fill="url(#waveFill)"
              />
              <path
                d="M 0 45 Q 40 45, 70 38 T 140 32 T 210 40 T 260 22 T 320 30"
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* THREE ACTION CIRCLES matching Neuform Screen 1: SEND, MOVE, RECV */}
        <div className="flex items-center justify-around py-1">
          {/* Action 1: Breathe (Send style) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => onNavigate('sessions')}
              className="w-13 h-13 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#EDEDED] hover:border-[#E2C854] hover:text-[#E2C854] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowUpRight className="w-5 h-5 rtl:-scale-x-100" />
            </button>
            <span className="text-[10px] text-[#A3A3A3] font-normal uppercase tracking-[0.05em]">
              {language === 'ar' ? 'تنفس' : 'BREATHE'}
            </span>
          </div>

          {/* Action 2: Move / Sessions */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => onNavigate('sessions')}
              className="w-13 h-13 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#EDEDED] hover:border-[#E2C854] hover:text-[#E2C854] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
            <span className="text-[10px] text-[#A3A3A3] font-normal uppercase tracking-[0.05em]">
              {language === 'ar' ? 'جلسات' : 'SESSIONS'}
            </span>
          </div>

          {/* Action 3: AI Coach (Recv style) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => onNavigate('ai-coach')}
              className="w-13 h-13 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#EDEDED] hover:border-[#E2C854] hover:text-[#E2C854] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowDownLeft className="w-5 h-5 rtl:-scale-x-100" />
            </button>
            <span className="text-[10px] text-[#A3A3A3] font-normal uppercase tracking-[0.05em]">
              {language === 'ar' ? 'المرشد' : 'COACH'}
            </span>
          </div>
        </div>

        {/* RECENT SESSIONS SECTION matching Neuform Screen 1 */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-medium text-[#EDEDED]">
              {language === 'ar' ? 'أحدث الجلسات' : 'Recent'}
            </span>
            <button
              onClick={() => onNavigate('sessions')}
              className="text-[10px] text-[#A3A3A3] uppercase tracking-wider hover:text-[#E2C854] transition-colors cursor-pointer font-medium"
            >
              {language === 'ar' ? 'الكل' : 'ALL'}
            </button>
          </div>

          <div className="space-y-2">
            {mockData.meditation.slice(0, 2).map((session, index) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session)}
                className="bg-[#181818] border border-[#262626] hover:border-[#383838] rounded-[20px] p-3.5 flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#202020] border border-[#2A2A2A] flex items-center justify-center text-[#E2C854]">
                    {index === 0 ? <Moon className="w-4 h-4" /> : <Wind className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-[#EDEDED] group-hover:text-[#E2C854] transition-colors line-clamp-1">
                      {language === 'ar' ? session.title : session.title_en}
                    </h4>
                    <span className="text-[10px] text-[#A3A3A3]">
                      {session.duration} {language === 'ar' ? 'دقائق • Solfeggio' : 'min • Solfeggio'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-medium text-[#EDEDED]">
                  +{session.duration}m
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ASSETS / BIO-METRIC PILLARS matching Neuform Screen 1 */}
        <div>
          <div className="mb-2">
            <span className="text-sm font-medium text-[#EDEDED]">
              {language === 'ar' ? 'المؤشرات الحيوية' : 'Assets'}
            </span>
          </div>

          <div className="flex gap-3">
            {/* Asset 1: Biological Age */}
            <div 
              onClick={() => onNavigate('longevity')}
              className="bg-[#181818] border border-[#262626] rounded-[20px] p-3.5 flex-1 cursor-pointer hover:border-[#383838] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#222222] border border-[#2A2A2A] flex items-center justify-center text-[11px] text-[#E2C854] font-semibold mb-2">
                A
              </div>
              <span className="text-[10px] uppercase text-[#A3A3A3] block tracking-wider">
                {language === 'ar' ? 'عمر Aura' : 'AURA AGE'}
              </span>
              <span className="text-sm font-semibold text-[#EDEDED]">
                26.4
              </span>
            </div>

            {/* Asset 2: Longevity Pace */}
            <div 
              onClick={() => onNavigate('longevity')}
              className="bg-[#181818] border border-[#262626] rounded-[20px] p-3.5 flex-1 cursor-pointer hover:border-[#383838] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#222222] border border-[#2A2A2A] flex items-center justify-center text-[11px] text-[#4ADE80] font-semibold mb-2">
                ✓
              </div>
              <span className="text-[10px] uppercase text-[#A3A3A3] block tracking-wider">
                {language === 'ar' ? 'وتيرة التقدم' : 'PACE'}
              </span>
              <span className="text-sm font-semibold text-[#EDEDED]">
                0.7x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalityDashboard;

