import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Square, RotateCcw, Info, Sparkles, Wind, Volume2, VolumeX, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../App';

// Simple classNames helper if not importing
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

type Phase = 'idle' | 'prepare' | 'inhale' | 'hold' | 'exhale' | 'completed';

interface BreathingTechnique {
  id: string;
  nameAr: string;
  nameEn: string;
  subAr: string;
  subEn: string;
  descAr: string;
  descEn: string;
  originAr: string;
  originEn: string;
  inhaleMs: number;
  holdMs: number;
  exhaleMs: number;
  colorTheme: string;
  bgGlow: string;
  progressColor: string;
  colorClass: string;
  emoji: string;
}

const TECHNIQUES: BreathingTechnique[] = [
  {
    id: 'relax478',
    nameAr: 'استرخاء 4-7-8 الكلاسيكي',
    nameEn: 'Classic 4-7-8 Relax',
    subAr: 'طبي عصبي عصري',
    subEn: 'Modern Neurological',
    descAr: 'النمط العلمي الشهير لتشغيل الخلايا الهادئة وتثبيط القلق العصبي في ثوانٍ.',
    descEn: 'The world-famous evidence-based pattern to trigger the vagus nerve and calm anxiety instantly.',
    originAr: 'الطب العصبي والفسيولوجي الحديث 🧠',
    originEn: 'Modern Neuroscience & Physiology 🧠',
    inhaleMs: 4000,
    holdMs: 7000,
    exhaleMs: 8000,
    colorTheme: 'from-violet-400/40 to-purple-500/30',
    bgGlow: 'bg-violet-400/30 dark:bg-violet-500/10',
    progressColor: 'stroke-violet-500',
    colorClass: 'text-violet-500 dark:text-violet-400',
    emoji: '🧠'
  },
  {
    id: 'kokyuho',
    nameAr: 'كوكيو-هو الياباني 🇯🇵',
    nameEn: 'Japanese Kokyu-ho 🇯🇵',
    subAr: 'الاستقرار في مركز طاقة الزن',
    subEn: 'Zen Inner Peace & Grounding',
    descAr: 'تمرين تنفس تقليدي مبني على توجيه الهواء نحو نقطة طاقة "التاندين" أسفل السُّرة لجلب السكينة واليقظة القصوى.',
    descEn: 'Traditional Zen breathing that roots your awareness into the "Tanden" (dantian) below the navel for pure calm and clarity.',
    originAr: 'مدرسة زن والطب الشرقي الياباني 🇯🇵',
    originEn: 'Zen Buddhism & Eastern Japanese Practice 🇯🇵',
    inhaleMs: 5000,
    holdMs: 2000,
    exhaleMs: 8000,
    colorTheme: 'from-sky-400/40 to-blue-500/30',
    bgGlow: 'bg-sky-400/30 dark:bg-sky-500/10',
    progressColor: 'stroke-sky-500',
    colorClass: 'text-sky-500 dark:text-sky-400',
    emoji: '🧘'
  },
  {
    id: 'ibuki',
    nameAr: 'إيبوكي الساموراي ⚔️',
    nameEn: 'Samurai Ibuki Warrior ⚔️',
    subAr: 'تطهير الجسد وقمع المخاوف',
    subEn: 'Strength & Purifying Breath',
    descAr: 'تنفس تكتيكي حاد يُستخدم لتجهيز الرئة وتنقية مسار الدم وزيادة التركيز الحركي للقلب وبناء الروح الحربية غير المهتزة.',
    descEn: 'Tactical sharp breath used by warriors to oxygenate blood, harden core muscles, and build unshakeable focus.',
    originAr: 'محاربو الساموراي وممارسو البودو ⚔️',
    originEn: 'Traditional Samurais & Budo Practitioners ⚔️',
    inhaleMs: 4000,
    holdMs: 4000,
    exhaleMs: 6000,
    colorTheme: 'from-rose-400/40 to-orange-500/30',
    bgGlow: 'bg-rose-400/30 dark:bg-rose-500/10',
    progressColor: 'stroke-rose-500',
    colorClass: 'text-rose-500 dark:text-rose-400',
    emoji: '⚔️'
  },
  {
    id: 'chakra',
    nameAr: 'موازنة الشاكرات الهرمونية 🕉️',
    nameEn: 'Chakra Balance Flow 🕉️',
    subAr: 'تثبيت طاقة مراكز الجسد السبعة',
    subEn: 'Harmonize Seven Energy Centers',
    descAr: 'توجيه طاقة متوازنة الشهيق والزفير لإيقاظ بوابات الوعي السبعة بطول العمود الفقري واستعادة الاتصال بالكون.',
    descEn: 'Symmetrical respiratory timing aimed at activating and balancing the body’s seven focal energy channels.',
    originAr: 'الفلسفة الفيدية واليوغا الباطنية القديمة 🕉️',
    originEn: 'Ancient Vedic Philosophy & Pranic Systems 🕉️',
    inhaleMs: 5000,
    holdMs: 5000,
    exhaleMs: 5000,
    colorTheme: 'from-emerald-400/40 to-teal-500/30',
    bgGlow: 'bg-emerald-400/30 dark:bg-emerald-500/10',
    progressColor: 'stroke-emerald-500',
    colorClass: 'text-emerald-500 dark:text-emerald-400',
    emoji: '🕉️'
  },
  {
    id: 'pranayama',
    nameAr: 'براناياما الهندية القديمة 🇮🇳',
    nameEn: 'Vedic Pranayama Power 🇮🇳',
    subAr: 'التحكم الفسيولوجي بالروح والحيوية',
    subEn: 'Conquer the Universal Life Force',
    descAr: 'تعديل تزويد الأوكسجين بخطوات محسوبة دقيقة لخلق قلوية دموية ممتازة وإرخاء المفاصل الضاغطة العميقة.',
    descEn: 'Precise pranic retention pattern designed to oxygenate physical tissue, alkalize blood chemistry, and unlock cell dynamics.',
    originAr: 'ممر يوغا بهاسكارا والهند القديمة 🇮🇳',
    originEn: 'Veda Traditions & Hatha Yoga Masters 🇮🇳',
    inhaleMs: 4000,
    holdMs: 8000,
    exhaleMs: 8000,
    colorTheme: 'from-amber-400/45 to-orange-500/35',
    bgGlow: 'bg-amber-400/30 dark:bg-amber-500/10',
    progressColor: 'stroke-amber-500',
    colorClass: 'text-amber-500 dark:text-amber-400',
    emoji: '🧘‍♂️'
  },
  {
    id: 'qigong',
    nameAr: 'طاقة التشي-غونغ التاوية 🇨🇳',
    nameEn: 'Taoist Qigong Circulation 🇨🇳',
    subAr: 'طول العمر والشفاء الذاتي المستمر',
    subEn: 'Cultivate and circulate Vitality',
    descAr: 'محاكاة الأمواج الصينية اللينة لتدوير طاقة (التشي) في المدار الصغير لاستعادة مرونة الشرايين ومقاومة الخلايا المرضية.',
    descEn: 'A soft, circular wave-form cycle of breath to store and navigate "Qi" via the microscopic orbit to prompt systemic healing.',
    originAr: 'الطب الصيني التقليدي وجبال فودانغ 🇨🇳',
    originEn: 'Traditional Chinese Medicine & Wudang Taoism 🇨🇳',
    inhaleMs: 6000,
    holdMs: 3000,
    exhaleMs: 6000,
    colorTheme: 'from-teal-400/40 to-cyan-500/30',
    bgGlow: 'bg-teal-400/30 dark:bg-teal-500/10',
    progressColor: 'stroke-teal-500',
    colorClass: 'text-teal-500 dark:text-teal-400',
    emoji: '☯️'
  }
];

export default function BreathingTimer({ onComplete, user }: { onComplete?: (cycles: number) => void; user?: any }) {
  const { t, language } = useLanguage();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const completedToday = useMemo(() => {
    if (!user?.progress?.breathingHistory) return 0;
    return user.progress.breathingHistory
      .filter((h: any) => h.date === todayStr)
      .reduce((sum: number, h: any) => sum + h.cycles, 0);
  }, [user?.progress?.breathingHistory, todayStr]);

  const breathingDailyGoal = user?.settings?.breathingDailyGoal || 8;
  const isGoalMet = completedToday >= breathingDailyGoal;
  
  const [selectedTechniqueId, setSelectedTechniqueId] = useState('relax478');
  const selectedTechnique = useMemo(() => {
    return TECHNIQUES.find(t => t.id === selectedTechniqueId) || TECHNIQUES[0];
  }, [selectedTechniqueId]);

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(4); // 4 cycles is standard for 4-7-8
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  // Time left in current phase in milliseconds for high precision
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [phaseDurationMs, setPhaseDurationMs] = useState(0);

  // Keep refs for interval and audio
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize soft, elegant tones using Web Audio API
  const playSound = (type: 'inhale' | 'hold' | 'exhale' | 'prep' | 'complete') => {
    if (!soundEnabled) return;
    try {
      // Lazy load AudioContext
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'prep') {
        // Soft click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'inhale') {
        // Soft ascending chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.exponentialRampToValueAtTime(440.00, now + 1.5); // A4
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        osc.start(now);
        osc.stop(now + 1.5);
      } else if (type === 'hold') {
        // Soft deep calming hum
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220.00, now); // A3
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.3);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 1.7);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
        osc.start(now);
        osc.stop(now + 2.0);
      } else if (type === 'exhale') {
        // Smooth descending breath whooshing chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392.00, now); // G4
        osc.frequency.exponentialRampToValueAtTime(261.63, now + 2.0); // C4
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.18, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
        osc.start(now);
        osc.stop(now + 2.5);
      } else if (type === 'complete') {
        // Beautiful harmony chime (two notes in succession)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440.00, now);
        osc.frequency.setValueAtTime(554.37, now + 0.2); // C#5
        osc.frequency.setValueAtTime(659.25, now + 0.4); // E5
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.25, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
        osc.start(now);
        osc.stop(now + 2.0);
      }
    } catch {
      // Audio fallback if blocked
    }
  };

  // Setup loop
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const startPhase = (nextPhase: Phase, cycleNum: number) => {
      setPhase(nextPhase);
      let duration = 0;
      if (nextPhase === 'prepare') {
        duration = 3000;
        playSound('prep');
      } else if (nextPhase === 'inhale') {
        duration = selectedTechnique.inhaleMs;
        playSound('inhale');
      } else if (nextPhase === 'hold') {
        duration = selectedTechnique.holdMs;
        playSound('hold');
      } else if (nextPhase === 'exhale') {
        duration = selectedTechnique.exhaleMs;
        playSound('exhale');
      }
      
      setTimeLeftMs(duration);
      setPhaseDurationMs(duration);
    };

    // Initial transition to 'prepare'
    if (phase === 'idle') {
      setCurrentCycle(1);
      startPhase('prepare', 1);
    }

    const intervalMs = 100;
    timerRef.current = setInterval(() => {
      setTimeLeftMs((prev) => {
        if (prev <= intervalMs) {
          // Transition to next phase
          if (phase === 'prepare') {
            startPhase('inhale', currentCycle);
          } else if (phase === 'inhale') {
            startPhase('hold', currentCycle);
          } else if (phase === 'hold') {
            startPhase('exhale', currentCycle);
          } else if (phase === 'exhale') {
            if (currentCycle >= totalCycles) {
              setPhase('completed');
              setIsActive(false);
              playSound('complete');
              if (onComplete) {
                onComplete(totalCycles);
              }
              if (timerRef.current) clearInterval(timerRef.current);
              return 0;
            } else {
              const nextC = currentCycle + 1;
              setCurrentCycle(nextC);
              startPhase('inhale', nextC);
            }
          }
          return 0;
        }
        return prev - intervalMs;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, currentCycle, totalCycles, soundEnabled, selectedTechnique]);

  const handleStartStop = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('idle');
      setTimeLeftMs(0);
    } else {
      setPhase('idle');
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('idle');
    setCurrentCycle(1);
    setTimeLeftMs(0);
  };

  // Calculate dynamic colors/descriptions for current phase
  const phaseDetails = useMemo(() => {
    switch (phase) {
      case 'prepare':
        return {
          title: language === 'ar' ? 'استعد' : 'Prepare',
          desc: language === 'ar' ? 'خذ وضعية مريحة واستعد للتنفس' : 'Get into a comfortable position',
          colorClass: 'text-amber-500 dark:text-amber-400',
          bgGlow: 'bg-amber-400/20 dark:bg-amber-400/10',
          bubbleScale: 0.85,
          colorTheme: 'from-amber-400/35 to-orange-500/25',
          progressColor: 'stroke-amber-500'
        };
      case 'inhale':
        return {
          title: language === 'ar' ? 'شهيق' : 'Inhale',
          desc: selectedTechnique.id === 'ibuki' 
            ? (language === 'ar' ? 'اسحب الهواء بقوة ونقاء متدرج (روح مقاتلة)' : 'Pull air inside with intense core strength and determination')
            : (language === 'ar' ? 'تنفس من الأنف ببطء وعمق لتمتلئ بالسلام' : 'Breathe in slowly and focus your energy flow'),
          colorClass: selectedTechnique.colorClass,
          bgGlow: selectedTechnique.bgGlow,
          bubbleScale: 1.45,
          colorTheme: selectedTechnique.colorTheme,
          progressColor: selectedTechnique.progressColor
        };
      case 'hold':
        return {
          title: language === 'ar' ? 'احبس نفسك' : 'Hold',
          desc: selectedTechnique.id === 'ibuki'
            ? (language === 'ar' ? 'ثبّت قوتك واستشعر شجاعتك دون خوف' : 'Anchor your warrior spirit in deep abdominal consolidation')
            : (selectedTechnique.id === 'kokyuho'
              ? (language === 'ar' ? 'ثبّت وعيك في التاندين (طاقة أسفل السرة)' : 'Settle breathing into your tanden (lower navel core)')
              : (language === 'ar' ? 'أبقِ الهواء في رئتيك واسترخِ بعمق' : 'Hold your breath and absorb the healing energy')),
          colorClass: 'text-emerald-500 dark:text-emerald-400',
          bgGlow: 'bg-emerald-400/30 dark:bg-emerald-500/10 border-dashed border-emerald-500/40 border-2 animate-pulse',
          bubbleScale: 1.45,
          colorTheme: 'from-emerald-400/40 to-teal-500/30',
          progressColor: 'stroke-emerald-500'
        };
      case 'exhale':
        return {
          title: language === 'ar' ? 'زفير' : 'Exhale',
          desc: selectedTechnique.id === 'ibuki'
            ? (language === 'ar' ? 'أطلق زفيراً قوياً ونقياً بتطهير دافع' : 'Expel all waste air completely and powerfully')
            : (selectedTechnique.id === 'kokyuho'
              ? (language === 'ar' ? 'أطلق الهواء بتمهل خارق متدرج وبطء' : 'Exhale extremely slowly to release every bit of fatigue')
              : (language === 'ar' ? 'اطلق الهواء من فمك براحة وارتياح' : 'Exhale completely through your mouth and relax')),
          colorClass: selectedTechnique.colorClass,
          bgGlow: selectedTechnique.bgGlow,
          bubbleScale: 0.85,
          colorTheme: selectedTechnique.colorTheme,
          progressColor: selectedTechnique.progressColor
        };
      case 'completed':
        return {
          title: language === 'ar' ? 'أحسنت!' : 'Splendid!',
          desc: language === 'ar' 
            ? `لقد أتممت تمرين ${selectedTechnique.nameAr} بنجاح!` 
            : `You have successfully completed ${selectedTechnique.nameEn}!`,
          colorClass: 'text-teal-605 dark:text-teal-400',
          bgGlow: 'bg-teal-400/20',
          bubbleScale: 1.0,
          colorTheme: 'from-teal-400/30 to-blue-500/20',
          progressColor: 'stroke-teal-500'
        };
      default:
        return {
          title: language === 'ar' ? 'تمارين التنفس' : 'Breath Work',
          desc: language === 'ar' 
            ? `تمرين ${selectedTechnique.nameAr} - نمط حكيم وتاريخي لتجديد الحيوية.` 
            : `${selectedTechnique.nameEn} - A traditional time-honored rhythm to renew your energy.`,
          colorClass: 'text-gray-600 dark:text-gray-300',
          bgGlow: 'bg-gray-400/10 dark:bg-gray-800/20',
          bubbleScale: 1.0,
          colorTheme: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
          progressColor: 'stroke-blue-500'
        };
    }
  }, [phase, language, selectedTechnique]);

  // Handle circular progress calculation
  const circleRadius = 110;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = useMemo(() => {
    if (phase === 'idle' || phase === 'completed' || phaseDurationMs === 0) return 0;
    const progress = timeLeftMs / phaseDurationMs; // 1.0 down to 0
    return circumference * (1 - progress);
  }, [timeLeftMs, phaseDurationMs, phase, circumference]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[500px] w-full p-4 animate-fade-in text-white select-none">
      
      {/* Daily Breathing Goal Progress Status Bar - Aura Glass */}
      <div className="w-full bg-[#131417] p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3 mb-4 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "p-2 rounded-xl transition-all duration-350 flex items-center justify-center",
            isGoalMet 
              ? "bg-[#E2C854]/20 text-[#E2C854]" 
              : "bg-white/5 text-[#8E927C]"
          )}>
            <Wind className={cn("w-5 h-5", isGoalMet && "text-[#E2C854] animate-pulse")} />
          </div>
          <div className="text-left ltr:text-left rtl:text-right">
            <p className="text-xs font-semibold text-white">
              {t('breathingGoal')}
            </p>
            <p className="text-[11px] text-[#8E927C] font-mono">
              {completedToday} / {breathingDailyGoal} {t('cycles')}
            </p>
          </div>
        </div>
        <div>
          {isGoalMet ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E2C854]/20 text-[#E2C854] border border-[#E2C854]/40 shadow-[0_0_15px_rgba(226,200,84,0.3)] text-xs font-bold leading-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E2C854] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E2C854]"></span>
              </span>
              <span>{t('dailyGoalMet')}</span>
            </div>
          ) : (
            <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="bg-[#E2C854] h-full transition-all duration-500 shadow-[0_0_10px_#E2C854]" 
                style={{ width: `${Math.min(100, (completedToday / breathingDailyGoal) * 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Header Info Buttons */}
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={cn(
            "p-2.5 rounded-full transition-all flex items-center justify-center border",
            showInfo 
              ? "bg-[#E2C854]/20 text-[#E2C854] border-[#E2C854]/40 shadow-[0_0_12px_rgba(226,200,84,0.3)]" 
              : "bg-[#181818] text-[#A3A3A3] border-[#262626] hover:text-[#EDEDED]"
          )}
          aria-label="Info"
        >
          <Info className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {isActive && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E2C854]/15 text-[#E2C854] border border-[#E2C854]/30 animate-pulse">
              {language === 'ar' ? `الدورة ${currentCycle} / ${totalCycles}` : `Cycle ${currentCycle} / ${totalCycles}`}
            </span>
          )}
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              "p-2.5 rounded-full transition-all flex items-center justify-center border",
              soundEnabled
                ? "bg-[#E2C854]/20 text-[#E2C854] border-[#E2C854]/40 shadow-[0_0_12px_rgba(226,200,84,0.3)]"
                : "bg-[#181818] text-[#A3A3A3] border-[#262626] hover:text-[#EDEDED]"
            )}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

       {/* Info View */}
      {showInfo && (
        <div className="w-full bg-[#181818] border border-[#262626] rounded-[24px] p-4 text-sm text-[#EDEDED] mb-6 space-y-2.5 leading-relaxed shadow-xl animate-fade-in">
          <p className="font-semibold text-[#EDEDED] flex items-center gap-2">
            <span className="text-xl">{selectedTechnique.emoji}</span>
            <span>{language === 'ar' ? selectedTechnique.nameAr : selectedTechnique.nameEn}</span>
          </p>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#E2C854] px-2 py-0.5 rounded-md bg-[#E2C854]/10 border border-[#E2C854]/20 w-fit">
            📍 {language === 'ar' ? `المصدر: ${selectedTechnique.originAr}` : `Origin: ${selectedTechnique.originEn}`}
          </div>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            {language === 'ar' ? selectedTechnique.descAr : selectedTechnique.descEn}
          </p>
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-medium">
            <div className="p-2 bg-[#121212] border border-[#262626] rounded-xl">
              <p className="font-bold text-[#E2C854]">{selectedTechnique.inhaleMs / 1000}s</p>
              <p className="text-[#A3A3A3] text-[10px]">{language === 'ar' ? 'شهيق (أنف)' : 'Inhale (Nose)'}</p>
            </div>
            <div className="p-2 bg-[#121212] border border-[#262626] rounded-xl">
              <p className="font-bold text-[#E2C854]">{selectedTechnique.holdMs / 1000}s</p>
              <p className="text-[#A3A3A3] text-[10px]">{language === 'ar' ? 'حبس النفس' : 'Hold Breath'}</p>
            </div>
            <div className="p-2 bg-[#121212] border border-[#262626] rounded-xl">
              <p className="font-bold text-[#E2C854]">{selectedTechnique.exhaleMs / 1000}s</p>
              <p className="text-[#A3A3A3] text-[10px]">{language === 'ar' ? 'زفير (فم)' : 'Exhale (Mouth)'}</p>
            </div>
          </div>
        </div>
      )}

      {phase === 'idle' && (
        <div className="w-full mt-2 mb-4 space-y-3 p-3 rounded-[24px] bg-[#181818] border border-[#262626] animate-fade-in shadow-xl">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium uppercase tracking-wider text-[#EDEDED] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#E2C854] animate-spin-slow" />
              {language === 'ar' ? 'نمط التنفس الثقافي التقليدي' : 'Traditional Breath Work School'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2C854]/15 text-[#E2C854] border border-[#E2C854]/30">
              {TECHNIQUES.length} {language === 'ar' ? 'أنماط' : 'Schools'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1 pb-1 scrollbar-thin scrollbar-thumb-[#262626]">
            {TECHNIQUES.map((tech) => {
              const active = tech.id === selectedTechniqueId;
              return (
                <button
                  key={tech.id}
                  onClick={() => {
                    setSelectedTechniqueId(tech.id);
                    playSound('prep');
                  }}
                  className={cn(
                    "p-3 rounded-2xl border text-left rtl:text-right transition-all flex flex-col justify-between h-[100px] cursor-pointer relative overflow-hidden group",
                    active 
                      ? "bg-[#222222] border-[#E2C854] text-[#EDEDED] shadow-[0_0_15px_rgba(226,200,84,0.15)] ring-1 ring-[#E2C854]" 
                      : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:bg-[#1a1a1a] hover:border-[#383838]"
                  )}
                >
                  {/* Subtle gold glow */}
                  {active && (
                    <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-[#E2C854]/15 blur-xl transition-all" />
                  )}

                  <div className="flex items-start justify-between w-full">
                    <span className="text-xl filter drop-shadow-sm">{tech.emoji}</span>
                    <span className={cn(
                      "text-[9px] font-mono tracking-tighter px-1.5 py-0.5 rounded-md",
                      active ? "bg-[#E2C854] text-[#121212] font-semibold" : "bg-[#262626] text-[#A3A3A3]"
                    )}>
                      {tech.inhaleMs / 1000}-{tech.holdMs / 1000}-{tech.exhaleMs / 1000}s
                    </span>
                  </div>

                  <div className="space-y-0.5 mt-1">
                    <h4 className="text-[11px] font-medium truncate leading-tight w-full text-[#EDEDED]">
                      {language === 'ar' ? tech.nameAr : tech.nameEn}
                    </h4>
                    <p className={cn(
                      "text-[9px] truncate w-full font-medium",
                      active ? "text-[#E2C854]" : "text-[#A3A3A3]"
                    )}>
                      {language === 'ar' ? tech.subAr : tech.subEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Container - The Breathing Bubble with Aura Concentric Orbits */}
      <div className="relative flex items-center justify-center w-72 h-72 my-4 select-none">
        
        {/* Radar-like Dashed Concentric Orbit (matching Screen 1) */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#E2C854]/20 pointer-events-none animate-spin-slow" />
        <div className="absolute w-60 h-60 rounded-full border border-[#262626] pointer-events-none" />

        {/* Extra Deep Pulsing Halo Ripple */}
        <AnimatePresence mode="popLayout">
          {isActive && (phase === 'inhale' || phase === 'hold') && (
            <motion.div
              key={`ripple-outer-${phase}`}
              className="absolute rounded-full pointer-events-none blur-3xl bg-[#E2C854]/15"
              initial={{ scale: 0.8, opacity: 0.05 }}
              animate={phase === 'inhale' ? {
                scale: [0.8, 1.7, 1.55],
                opacity: [0.05, 0.35, 0.25]
              } : {
                scale: [1.55, 1.62, 1.55],
                opacity: [0.25, 0.40, 0.25]
              }}
              exit={{ scale: 0.8, opacity: 0, transition: { duration: 1.2 } }}
              transition={phase === 'hold' ? {
                scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                opacity: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
              } : {
                duration: phaseDurationMs / 1000,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              style={{
                width: '260px',
                height: '260px',
              }}
            />
          )}
        </AnimatePresence>

        {/* Dynamic Bubble Glow */}
        <motion.div 
          key={`glow-${phase}`}
          className="absolute rounded-full flex items-center justify-center pointer-events-none blur-2xl bg-[#E2C854]/20"
          initial={{ scale: phase === 'inhale' ? 0.85 : phaseDetails.bubbleScale }}
          animate={phase === 'hold' ? {
            scale: [1.45, 1.52, 1.45],
            opacity: [0.25, 0.45, 0.25]
          } : phase === 'idle' ? {
            scale: [0.93, 1.05, 0.93],
            opacity: [0.15, 0.25, 0.15]
          } : {
            scale: phaseDetails.bubbleScale,
            opacity: phase === 'exhale' ? 0.15 : 0.35
          }}
          transition={ (phase === 'hold' || phase === 'idle') ? {
            scale: { repeat: Infinity, duration: phase === 'hold' ? 2.5 : 4.5, ease: "easeInOut" },
            opacity: { repeat: Infinity, duration: phase === 'hold' ? 2.5 : 4.5, ease: "easeInOut" }
          } : {
            duration: phaseDurationMs / 1000,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          style={{
            width: '240px',
            height: '240px',
          }}
        />

        {/* Central Dark Aura Core Bubble */}
        <motion.div
          key={`bubble-${phase}`}
          className="absolute w-44 h-44 rounded-full bg-[#181818] shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center z-10 border border-[#262626]"
          initial={{ scale: phase === 'inhale' ? 0.85 : phaseDetails.bubbleScale }}
          animate={phase === 'hold' ? {
            scale: [1.45, 1.49, 1.45],
            boxShadow: [
              "0 0 30px rgba(226, 200, 84, 0.2)",
              "0 0 50px rgba(226, 200, 84, 0.35)",
              "0 0 30px rgba(226, 200, 84, 0.2)"
            ]
          } : phase === 'idle' ? {
            scale: [0.94, 1.04, 0.94],
            boxShadow: [
              "0 0 20px rgba(226, 200, 84, 0.1)",
              "0 0 35px rgba(226, 200, 84, 0.2)",
              "0 0 20px rgba(226, 200, 84, 0.1)"
            ]
          } : {
            scale: phaseDetails.bubbleScale,
            boxShadow: "0 0 30px rgba(226, 200, 84, 0.2)"
          }}
          transition={ (phase === 'hold' || phase === 'idle') ? {
            scale: { repeat: Infinity, duration: phase === 'hold' ? 2.5 : 4.5, ease: "easeInOut" },
            boxShadow: { repeat: Infinity, duration: phase === 'hold' ? 2.5 : 4.5, ease: "easeInOut" }
          } : {
            duration: phaseDurationMs / 1000,
            ease: [0.4, 0.0, 0.2, 1]
          }}
        >
          {phase === 'idle' && (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <Wind className="w-12 h-12 text-[#E2C854] opacity-90 filter drop-shadow-[0_0_12px_#E2C854]" />
              <span className="text-[10px] text-[#A3A3A3] font-medium mt-1">AURA BREATH</span>
            </motion.div>
          )}

          {phase !== 'idle' && phase !== 'completed' && (
            <div className="flex flex-col items-center justify-center text-[#EDEDED] select-none">
              <motion.span 
                key={timeLeftMs}
                initial={{ opacity: 0, y: -4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="text-4xl font-medium tracking-tight font-mono text-[#E2C854] drop-shadow-[0_0_15px_rgba(226,200,84,0.5)]"
              >
                {Math.ceil(timeLeftMs / 1000)}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0.7 }}
                animate={phase === 'inhale' ? { scale: [0.95, 1.03, 0.95] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[11px] uppercase tracking-widest mt-1 text-[#EDEDED] font-medium"
              >
                {timeLeftMs > 0 && phaseDetails.title}
              </motion.span>
            </div>
          )}

          {phase === 'completed' && (
            <div className="flex flex-col items-center justify-center text-[#E2C854] p-2">
              <motion.span 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-3xl font-medium"
              >
                ✨
              </motion.span>
              <span className="text-[11px] font-medium mt-1.5 uppercase tracking-wider text-center">{t('sessionCompleteTitle')}</span>
              {isGoalMet && (
                <span className="text-[9px] text-[#121212] font-semibold px-2 py-0.5 mt-1.5 bg-[#E2C854] rounded-full text-center leading-auto">
                  🏆 {t('dailyGoalMet')}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Circular SVG Progress Ring with Gold Styling */}
        <svg className="absolute w-64 h-64 -rotate-90 pointer-events-none">
          <circle
            cx="128"
            cy="128"
            r={circleRadius}
            fill="none"
            className="stroke-[#262626] transition-colors"
            strokeWidth={strokeWidth}
          />
          {isActive && (
            <circle
              cx="128"
              cy="128"
              r={circleRadius}
              fill="none"
              className="transition-all duration-100 stroke-[#E2C854]"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 10px #E2C854)'
              }}
            />
          )}
        </svg>
      </div>

      {/* Action / State Description Text */}
      <div className="text-center px-6 max-w-sm h-16 flex flex-col justify-center">
        <h3 className="text-xl font-medium tracking-tight mb-1 text-[#E2C854] transition-colors duration-500">
          {phaseDetails.title}
        </h3>
        <p className="text-xs text-[#A3A3A3] transition-all leading-normal">
          {phaseDetails.desc}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="w-full max-w-xs mt-4 flex gap-3 items-center justify-center">
        
        {/* Reset button shown if paused/completed */}
        {(phase !== 'idle' && !isActive) && (
          <button
            onClick={handleReset}
            className="p-4 bg-[#181818] border border-[#262626] text-[#EDEDED] rounded-full shadow-lg hover:border-[#E2C854]/50 transition transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5 text-[#A3A3A3]" />
          </button>
        )}

        {/* Primary Start / Stop Button - Glowing Gold Pill */}
        <button
          onClick={handleStartStop}
          className={cn(
            "flex-grow py-4 px-6 rounded-full font-semibold text-sm tracking-wide shadow-xl transition-all duration-300 transform active:scale-95 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer",
            isActive
              ? "bg-rose-500/90 hover:bg-rose-600 text-white shadow-[0_4px_20px_rgba(244,63,94,0.4)]"
              : phase === 'completed'
                ? "bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] shadow-[0_4px_20px_rgba(226,200,84,0.35)]"
                : "bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] shadow-[0_4px_20px_rgba(226,200,84,0.35)]"
          )}
        >
          {isActive ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>{t('stopBreathing')}</span>
            </>
          ) : phase === 'completed' ? (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ar' ? 'إعادة المحاولة' : 'Start Again'}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{t('startBreathing')}</span>
            </>
          )}
        </button>

        {/* Choose Cycle limit if idle */}
        {phase === 'idle' && (
          <select
            value={totalCycles}
            onChange={(e) => setTotalCycles(Number(e.target.value))}
            className="p-3.5 bg-[#181818] text-[#EDEDED] rounded-full border border-[#262626] text-xs font-medium focus:outline-none focus:border-[#E2C854]/60 shadow-lg cursor-pointer"
            title="Choose number of cycles"
          >
            <option value="2">2 {language === 'ar' ? 'دورات' : 'Cycles'}</option>
            <option value="4">4 {language === 'ar' ? 'دورات (قياسي)' : 'Cycles (Std)'}</option>
            <option value="8">8 {language === 'ar' ? 'دورات' : 'Cycles'}</option>
            <option value="12">12 {language === 'ar' ? 'دورة' : 'Cycles'}</option>
          </select>
        )}
      </div>

    </div>
  );
}
