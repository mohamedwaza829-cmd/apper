import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowLeft, Play, Download, Sparkles, Clock, Compass, Eye, Wind, Smile, Activity, HelpCircle } from 'lucide-react';
import { YOGA_POSES, YogaPose } from '../data/yogaPoses';

const CardBackground = ({ category, id }: { category: string; id: string }) => {
  const SvgPattern = () => {
    switch (category) {
      case 'focus':
      case 'stressRelief':
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id={`gradFocus-det-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
              <filter id={`blur-det-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill={`url(#gradFocus-det-${id})`} />
            <g filter={`url(#blur-det-${id})`} opacity="0.6">
              <circle cx="30%" cy="40%" r="40" fill="#a78bfa">
                <animate attributeName="cx" values="30%;70%;30%" dur="15s" repeatCount="indefinite" />
              </circle>
              <circle cx="70%" cy="60%" r="50" fill="#818cf8">
                 <animate attributeName="cy" values="60%;30%;60%" dur="18s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        );
      case 'relaxation':
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id={`gradRelax-det-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="100%" stopColor="#67e8f9" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill={`url(#gradRelax-det-${id})`} />
            <g opacity="0.2" stroke="#0e7490" strokeWidth="4" fill="none">
              <path d="M-100,50 Q-50,150 0,50 T100,50 T200,50 T300,50">
                  <animateTransform attributeName="transform" type="translate" values="0 0; 0 20; 0 0" dur="8s" repeatCount="indefinite"/>
              </path>
               <path d="M-100,100 Q-50,0 0,100 T100,100 T200,100 T300,100">
                  <animateTransform attributeName="transform" type="translate" values="0 0; 0 -20; 0 0" dur="10s" repeatCount="indefinite"/>
              </path>
            </g>
          </svg>
        );
      case 'sleep':
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
              <radialGradient id={`gradSleep-det-${id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#312e81" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill={`url(#gradSleep-det-${id})`} />
            {Array.from({ length: 30 }).map((_, i) => (
              <circle key={i} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} r={Math.random() * 1.5} fill="white" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.1;0.8" dur={`${Math.random() * 4 + 3}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>
        );
      default: // Yoga and others
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id={`gradYoga-det-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dcfce7" />
                <stop offset="100%" stopColor="#fecdd3" />
              </linearGradient>
               <filter id={`blurYoga-det-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill={`url(#gradYoga-det-${id})`} />
            <g opacity="0.4" filter={`url(#blurYoga-det-${id})`}>
              <path d="M 0 100 C 50 150, 100 0, 150 50 S 200 150, 250 100" stroke="#fb7185" fill="transparent" strokeWidth="20" />
              <path d="M 0 50 C 50 0, 100 150, 150 100 S 200 0, 250 50" stroke="#4ade80" fill="transparent" strokeWidth="20" />
            </g>
          </svg>
        );
    }
  };
  return <div className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"><SvgPattern /></div>;
};

interface SessionDetailsScreenProps {
  session: any;
  onBack: () => void;
  onPlay: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: boolean;
  language: string;
}

export default function SessionDetailsScreen({
  session,
  onBack,
  onPlay,
  toggleFavorite,
  isFavorite,
  language
}: SessionDetailsScreenProps) {
  const title = language === 'ar' ? session.title : session.title_en;
  
  // Localized guides drawer state
  const [showYogaGuide, setShowYogaGuide] = useState<boolean>(false);
  const [activeFocusPose, setActiveFocusPose] = useState<YogaPose | null>(null);

  // Solfeggio descriptors for detail page
  const getSolfeggioTitle = () => {
    const id = session.id;
    if (id === 'm1' || id === 'breathing' || session.title.includes('تنفس') || session.title.includes('Breath')) {
      return { freq: '432Hz', label: language === 'ar' ? 'التركيز والوضوح الذهني' : 'Clarity & Pure Intention' };
    } else if (id === 'm2' || id === 'relaxation' || session.title.includes('استرخاء مسائي') || session.title.includes('Evening')) {
      return { freq: '396Hz', label: language === 'ar' ? 'التحرر من القلق والضغوط' : 'Stress Release & Grounding' };
    } else if (id === 'm3' || session.title.includes('نوم') || session.title.includes('Sleep')) {
      return { freq: '174Hz', label: language === 'ar' ? 'الهدوء الجسدي والنوم العميق' : 'Physical Ease & Rejuvenation' };
    } else if (id === 'm4' || session.title.includes('توتر') || session.title.includes('Stress')) {
      return { freq: '741Hz', label: language === 'ar' ? 'تحرير العقل وصفاء التفكير' : 'Purification & Mental Calm' };
    } else if (id === 'y1' || session.title.includes('يوغا الصباح') || session.title.includes('Morning Yoga')) {
      return { freq: '528Hz', label: language === 'ar' ? 'تجدد الطاقة والحيوية الصباحية' : 'Vitality & Renewal Frequency' };
    } else if (id === 'y2' || session.title.includes('تدفق') || session.title.includes('Energy')) {
      return { freq: '528Hz', label: language === 'ar' ? 'تدفق طاقة الحياة الإيجابية' : 'Divine Energy Flow' };
    } else if (id === 'y3' || session.title.includes('مرونة') || session.title.includes('Flexibility')) {
      return { freq: '639Hz', label: language === 'ar' ? 'الانسجام الجسدي والمرونة العالية' : 'Deep Connection & Integration' };
    }
    return { freq: '432Hz', label: language === 'ar' ? 'الاسترخاء والتردد الطبيعي' : 'Natural Harmonic Resonance' };
  };

  const solinfo = getSolfeggioTitle();

  // Retrieve matching yoga poses guide if it exists for this session
  const posesGuide: YogaPose[] | undefined = YOGA_POSES[session.id];

  return (
    <div className="relative h-full w-full text-white overflow-hidden bg-[#121212] select-none">
      {/* Background card image rendering */}
      <div className="absolute inset-0 w-full h-full opacity-60">
        <CardBackground category={session.category} id={session.id} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/60 via-[#121212]/80 to-[#121212]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#E2C854]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Core Viewport */}
      <div className="relative h-full flex flex-col justify-between p-6 z-10 overflow-y-auto">
        
        {/* Back and Bookmark Buttons */}
        <header className="flex justify-between items-center w-full">
          <button 
            onClick={onBack} 
            className="p-3 bg-[#181818]/80 backdrop-blur-md rounded-full border border-white/10 hover:border-[#E2C854] hover:bg-[#181818] transition active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-white rtl:-scale-x-100" />
          </button>

          <button 
            onClick={() => toggleFavorite(session.id)} 
            className="p-3 bg-[#181818]/80 backdrop-blur-md rounded-full border border-white/10 hover:border-white/20 transition active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-rose-500 fill-current' : 'text-white'}`} />
          </button>
        </header>

        {/* Center Details Display Card */}
        <div className="text-center flex-1 flex flex-col items-center justify-center px-4 max-w-sm mx-auto my-4 w-full">
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="p-5 rounded-3xl bg-[#181818]/90 backdrop-blur-2xl border border-white/10 space-y-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] w-full"
          >
            {/* Category / Icon Element */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#E2C854] font-black uppercase tracking-wider bg-[#E2C854]/10 px-3 py-1 rounded-full border border-[#E2C854]/25 w-fit mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#E2C854]" />
              <span>{language === 'ar' ? (session.category === 'beginner' ? 'مبتدئ' : session.category === 'intermediate' ? 'متوسط' : 'متقدم') : session.category}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {title}
            </h1>

            {/* Time / Mode Specs */}
            <div className="flex justify-center items-center gap-3 text-xs text-[#A3A3A3] font-semibold">
              <span className="flex items-center gap-1 text-white">
                <Clock className="w-3.5 h-3.5 text-[#E2C854]" />
                {session.duration} {language === 'ar' ? 'دقيقة' : 'minutes'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#A3A3A3]">
                <Compass className="w-3.5 h-3.5 text-[#E2C854]" />
                {language === 'ar' ? 'صوت عالي الدقة' : 'Solfeggio HD Synth'}
              </span>
            </div>
            
            {/* Expanded Solfeggio & sound specifications for this specific session */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1 text-center">
              <p className="text-[10px] font-black uppercase text-[#E2C854] tracking-wider">
                {language === 'ar' ? '✧ تردد الاستشفاء المصاحب ✧' : '✧ EMBEDDED HEALING RESONANCE ✧'}
              </p>
              <p className="text-sm font-black text-white leading-snug">
                Solfeggio {solinfo.freq}
              </p>
              <p className="text-[11px] text-[#A3A3A3] font-medium leading-normal">
                {solinfo.label}
              </p>
            </div>

            {/* Visual Guides Action Button rendered for Yoga Classes! */}
            {posesGuide && (
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowYogaGuide(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#E2C854]/15 hover:bg-[#E2C854]/25 border border-[#E2C854]/40 text-[#E2C854] text-xs font-black cursor-pointer shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4 text-[#E2C854] animate-pulse" />
                <span>
                  {language === 'ar' ? 'شرح مرئي لحركات الأيقونية اليوغا 🧘' : 'View Visual Poses Guide 🧘'}
                </span>
              </motion.button>
            )}
          </motion.div>

          {/* Large Glorious Interactive Floating Play Button in Electric Lime */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlay} 
            className="mt-6 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] w-18 h-18 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(226,200,84,0.45)] active:scale-95 transition-all outline-none cursor-pointer"
          >
            <Play className="w-7 h-7 text-[#121212] fill-current ltr:ml-1 rtl:mr-1" />
          </motion.button>
        </div>

        {/* Lower decorative indicators */}
        <div className="flex justify-between items-center text-[10px] text-[#A3A3A3] uppercase tracking-widest pt-2 px-1 border-t border-white/10">
          <span>{language === 'ar' ? 'استمع الآن بجودة فائقة' : 'High Fidelity Sound Wave'}</span>
          <button 
            type="button" 
            className="flex items-center gap-1 text-[#E2C854] font-black hover:text-white transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'دون اتصال' : 'Offline'}</span>
          </button>
        </div>
      </div>

      {/* ==================== IMMERSIVE COGNITIVE YOGA POSES VISUAL GUIDE SCREEN ==================== */}
      <AnimatePresence>
        {showYogaGuide && posesGuide && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-0 bg-[#121212] z-50 overflow-hidden flex flex-col justify-between"
          >
            {/* Header Area */}
            <header className="px-6 py-5 bg-[#181818] border-b border-white/10 flex items-center justify-between">
              <button 
                onClick={() => setShowYogaGuide(false)}
                className="p-2.5 bg-white/5 hover:bg-white/10 active:scale-95 transition rounded-full border border-white/10 flex items-center justify-center cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300 rtl:-scale-x-100" />
              </button>

              <div className="text-center">
                <p className="text-[10px] font-black tracking-widest text-[#E2C854] uppercase">
                  {language === 'ar' ? 'الشرح المرئي للأوضاع الجسدية' : 'POSES VISUAL ENHANCED GUIDE'}
                </p>
                <h2 className="text-sm font-black text-white max-w-[200px] truncate block">
                  {title}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#E2C854]/15 border border-[#E2C854]/30 flex items-center justify-center">
                <Smile className="w-5 h-5 text-[#E2C854]" />
              </div>
            </header>

            {/* Main Poses List Area */}
            <main className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="p-4 bg-[#E2C854]/10 border border-[#E2C854]/25 text-center rounded-2xl text-[11px] text-[#E2C854] leading-relaxed font-bold">
                💡 {language === 'ar' 
                  ? 'اضغط على أي وضعية لممارسة التنفس الموجه الحركي معها في المساحة الكونية!' 
                  : 'Click any pose card below to start guided breathing practice specifically mapped for that pose!'}
              </div>

              <div className="grid grid-cols-1 gap-4 pb-4">
                {posesGuide.map((pose, idx) => (
                  <motion.div
                    key={pose.id}
                    onClick={() => setActiveFocusPose(pose)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="p-4.5 bg-slate-900/80 border border-white/5 hover:border-emerald-500/30 rounded-2xl flex items-center gap-4 cursor-pointer transition shadow-xl relative overflow-hidden group"
                  >
                    {/* Glowing Accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500" />

                    {/* Left static/animated Lineart SVG */}
                    <div className="w-24 h-24 rounded-xl bg-slate-950 border border-white/5 p-1.5 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-900 transition relative overflow-hidden">
                      <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent opacity-40 pointer-events-none" />
                      {pose.svg()}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-emerald-400 font-mono font-black uppercase">
                          {language === 'ar' ? `الوضعية ${idx + 1}` : `Pose ${idx + 1}`}
                        </span>
                        <div className="bg-white/5 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1 text-[10px] text-gray-350">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>{language === 'ar' ? pose.duration : pose.durationEn}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-black text-white truncate">
                        {language === 'ar' ? pose.nameAr : pose.nameEn}
                      </h3>

                      <p className="text-[11px] text-[#a5b4fc] font-bold leading-normal">
                        ✦ {language === 'ar' ? pose.benefitAr : pose.benefitEn}
                      </p>

                      <p className="text-[11px] text-gray-400 leading-relaxed truncate group-hover:text-gray-300 transition-colors">
                        {language === 'ar' ? pose.descAr : pose.descEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </main>

            {/* Bottom confirmation close */}
            <footer className="p-5 bg-slate-900 border-t border-white/5 flex gap-3">
              <button
                onClick={() => setShowYogaGuide(false)}
                className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-105 rounded-xl text-xs font-black tracking-wide cursor-pointer text-white active:scale-95 transition text-center shadow-lg"
              >
                {language === 'ar' ? 'فهمت، العودة للجلسة 🧘' : "Got it, Return to Session 🧘"}
              </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== INTERACTIVE RESPIRATION FOCUS PRACTICE LIGHT MODAL ==================== */}
      <AnimatePresence>
        {activeFocusPose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 z-55 p-6 flex flex-col justify-between overflow-hidden select-none"
          >
            {/* Top Close */}
            <header className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  {language === 'ar' ? 'جلسة تنفس دقيقة للوضعية' : 'ACTIVE POSE BREATHE PRACTICE'}
                </span>
              </div>
              <button 
                onClick={() => setActiveFocusPose(null)}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xs font-black rounded-lg border border-white/10"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </header>

            {/* Center Animated Respiration Wave with Custom Line-art SVG */}
            <main className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto space-y-8">
              
              <div className="text-center space-y-1.5">
                <p className="text-xs text-indigo-300 font-mono font-bold uppercase tracking-wider">
                  {language === 'ar' ? 'الوضعية المستهدفة' : 'TARGET POSTURE'}
                </p>
                <h3 className="text-xl font-black text-white leading-tight">
                  {language === 'ar' ? activeFocusPose.nameAr : activeFocusPose.nameEn}
                </h3>
              </div>

              {/* Glowing breathing rings framing the pose */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                
                {/* Breathe expanding ring (Inhale / Exhale looping) */}
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.15, 0.5, 0.15]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl"
                />

                <motion.div
                  animate={{
                    scale: [0.95, 1.15, 0.95],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-4 rounded-full border border-emerald-500/20 bg-slate-900 flex items-center justify-center shadow-2xl relative overflow-hidden"
                >
                  {/* Procedural Visual SVG */}
                  <div className="transform scale-[1.3] z-10">
                    {activeFocusPose.svg()}
                  </div>
                </motion.div>

                {/* Concentric rotating outline dials */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 border border-white/5 border-dashed rounded-full"
                />
              </div>

              {/* Live Breathing Indicator Text */}
              <div className="text-center space-y-4">
                <motion.p
                  animate={{ 
                    opacity: [0.4, 1.0, 0.4],
                    scale: [0.96, 1.04, 0.96] 
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-xs md:text-sm text-indigo-200 font-bold bg-white/5 px-4.5 py-2.5 rounded-2xl border border-white/5"
                >
                  🧘 {language === 'ar' 
                    ? 'شهيق ببطء... ازفر برفق... تمدد بالجسد مع المسار' 
                    : 'Inhale deeply... Exhale slowly... Feel the alignment'}
                </motion.p>
              </div>

            </main>

            {/* Instruction description card */}
            <footer className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[8px] uppercase tracking-wider font-extrabold text-blue-400 block mb-1">
                {language === 'ar' ? 'إرشاد التموضع الكامل ✦' : 'ALIGNMENT DIRECTIVES ✦'}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                {language === 'ar' ? activeFocusPose.descAr : activeFocusPose.descEn}
              </p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
