import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Wind, 
  Settings, 
  Flame, 
  Sliders, 
  Moon, 
  Activity, 
  Clock, 
  Compass,
  Smile,
  Heart,
  Info,
  List,
  ChevronRight,
  Plus,
  Trash2,
  SkipForward,
  Timer
} from 'lucide-react';
import { globalMindfulnessSynth } from '../utils/audioManager';
import { YOGA_POSES, YogaPose } from '../data/yogaPoses';
import { mockData, SessionData } from '../data/sessions';

// Define localized items
const playerTranslations: Record<string, Record<string, string>> = {
  ar: {
    ambientSoundSettings: 'إعدادات ترددات الشفاء والأصوات ✦',
    ambientSoundSettingsDesc: 'قم بموازنة الأصوات والترددات المصاحبة للجلسة لخلق مساحتك الخاصة.',
    musicVol: 'موسـيقى التأمل والسكينة',
    beatsVol: 'ترددات الشفاء والثنائي (Binaural)',
    natureVol: 'محاكاة التنفس وأمواج الطبيعة',
    chimeVol: 'أجراس المعبد واليقظة الذهنية',
    headphonesRecom: 'ينصح بارتداء سماعات الأذن لتفعيل الترددات الثنائية (Binaural Beats)',
    activeFrequency: 'التردد النشط الحالي:',
    binauralTarget: 'الموجة الدماغية المستهدفة:',
    solfeggioBenefit: 'التأثير الروحي والجسماني:',
    inhaleExhaleGuide: 'تنفّس ببطء مع تموجات الشاشة ✦',
    sessionFinished: 'لقد أكملت الجلسة بنجاح! هنيئاً لك.',
    howTether: 'الارتباط العصبي',
    close: 'إغلاق الإعدادات',
    rest: 'استرخاء',
    focus: 'تركيز عميق',
    sleep: 'نوم هانئ',
    transformation: 'إعادة توازن وتجديد خلايا الجسد',
    releaseStress: 'التحرر من القلق والتوتر اليومي',
    unison: 'انسجام تام',
    activePosture: 'الوضعية الحالية ✦',
    alignmentGuide: 'دليل محاذاة الوضعية وكيفية التطبيق',
    postureSequence: 'تسلسل وضعيات الجلسة الحالية',
    nextUp: 'الوضعية القادمة:',
    noMorePoses: 'هذه هي الوضعية الأخيرة!',
    steps: 'خطوات المحاذاة:',
    benefits: 'الفوائد العصبية والجسدية:',
    closeGuide: 'إغلاق الدليل',
    chooseSolfeggioTitle: 'موجات تردد الشفاء الاهتزازي (سولفيجيو) ✦',
    dnaRepairSolfeggio: 'صمم مساحتك الصوتية لتصفية الذهن وزيادة الطاقة وترميم الـ DNA بذبذبات عميقة.',
    queueTitle: 'قائمة التشغيل المتتالية ✦',
    queueDesc: 'أضف جلسات متعددة للتشغيل المتتابع والمستمر وجرب تدفقاً مخصصاً يجمع بين التأمل واليوغا.',
    queueEmpty: 'قائمة التشغيل فارغة حالياً. أضف بعض الجلسات بالأسفل لبدء رحلتك المتكاملة!',
    addToQueue: 'إضافة للقائمة',
    addedToQueue: 'تمت الإضافة للقائمة!',
    alreadyInQueue: 'موجودة بالفعل بالقائمة',
    upcomingSessions: 'الجلسات اللاحقة المتتالية',
    exploreSessions: 'استكشف وأضف جلسات أخرى للقائمة',
    clearQueue: 'مسح قائمة التشغيل',
    closeQueue: 'إغلاق قائمة التشغيل',
    skipToNext: 'تخطي للجلسة التالية',
    meditationTab: 'جلسات التأمل والأنفاس',
    yogaTab: 'تتابعات اليوغا الجسدية',
    countdownTitle: 'مؤقت العد التنازلي للجلسة',
    countdownRemaining: 'الوقت المتبقي للجلسة'
  },
  en: {
    ambientSoundSettings: 'Healing Frequencies & Ambient Balance ✦',
    ambientSoundSettingsDesc: 'Balance the real-time synthesized frequencies to design your perfect meditation cocoon.',
    musicVol: 'Mindfulness Ambient Pad',
    beatsVol: 'Solfeggio & Binaural Wave',
    natureVol: 'Respiration & Nature Wave',
    chimeVol: 'Mindfulness Temple Chimes',
    headphonesRecom: 'Headphones recommended for full Solfeggio Binaural integration',
    activeFrequency: 'Current Active Frequency:',
    binauralTarget: 'Target Brainwave State:',
    solfeggioBenefit: 'Mind-Body Healing Target:',
    inhaleExhaleGuide: 'Breathe slowly in sync with the glowing waves ✦',
    sessionFinished: 'You have completed the session successfully! Peace be with you.',
    howTether: 'Neural Entrainment',
    close: 'Close Settings',
    rest: 'Relaxation & Ease',
    focus: 'Deep Focus & Clarity',
    sleep: 'Restful Sleep',
    transformation: 'Transformation & Cell Rejuvenation',
    releaseStress: 'Release Daily Anxiety & Fear',
    unison: 'Absolute Unison',
    activePosture: 'Active Posture ✦',
    alignmentGuide: 'Posture Alignment & Execution Guide',
    postureSequence: 'Current Session Pose Sequence',
    nextUp: 'Next Up:',
    noMorePoses: 'This is the final posture!',
    steps: 'Alignment Steps:',
    benefits: 'Body & Brain Benefits:',
    closeGuide: 'Close Guide',
    chooseSolfeggioTitle: 'Vibrational Solfeggio Frequency Waves ✦',
    dnaRepairSolfeggio: 'Curate your ambient frequency to cleanse your mind, repair cells, and boost vital organic energy.',
    queueTitle: 'Sequential Playback Queue ✦',
    queueDesc: 'Add multiple sessions to stream sequentially. Effortlessly chain yoga & meditation for an ultimate integrated flow.',
    queueEmpty: 'Your queue is empty. Choose some serene sessions below to build your customizable flow!',
    addToQueue: 'Add to Queue',
    addedToQueue: 'Added to Queue!',
    alreadyInQueue: 'Already in Queue',
    upcomingSessions: 'Upcoming Sequence List',
    exploreSessions: 'Explore & Add More Sessions',
    clearQueue: 'Clear Queue',
    closeQueue: 'Close Queue',
    skipToNext: 'Skip to Next Session',
    meditationTab: 'Meditation & Breathwork',
    yogaTab: 'Yoga Asana Practices',
    countdownTitle: 'Session Countdown Timer',
    countdownRemaining: 'Remaining Time'
  }
};

interface PlayerScreenProps {
  session: any;
  onBack: (progress?: number) => void;
  initialProgress?: number;
  toggleFavorite: (id: string) => void;
  isFavorite: boolean;
  onSessionComplete: (s: any) => void;
  language: string;
}

export interface SolfeggioFrequencyOption {
  value: number;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
  brainwave: string;
}

export const SOLFEGGIO_FREQUENCIES: SolfeggioFrequencyOption[] = [
  {
    value: 528,
    labelAr: 'ترميم الـ DNA وزيادة الطاقة النشطة (528 Hz)',
    labelEn: 'DNA Repair & Active Energy (528 Hz)',
    descAr: 'تردد المعجزات والتحول الإيجابي؛ يزيد طاقة الخلايا والوضوح ويحفز الاستشفاء الداخلي.',
    descEn: 'Miracle tone. Promotes tissue transformation, cellular repair, and triggers essential vital energy.',
    brainwave: 'Alpha-Theta (8.5Hz)'
  },
  {
    value: 432,
    labelAr: 'الانسجام الكوني وتصفية الذهن (432 Hz)',
    labelEn: 'Cosmic Tuning & Mind Clearing (432 Hz)',
    descAr: 'تردد النغمة الموسيقية الطبيعية الكونية، يخفض الضغوط وينظف الأفكار المزدحمة والتوتر.',
    descEn: 'Harmonic natural tuning. Lowers heart rate, promotes absolute tranquility and clears a noisy intellect.',
    brainwave: 'Alpha (10Hz)'
  },
  {
    value: 396,
    labelAr: 'التحرير من المخاوف والتوتر النفسي (396 Hz)',
    labelEn: 'Release Fear & Guilt (396 Hz)',
    descAr: 'يستهدف التحرر من عقد الذنب والخوف المتراكم في العقل الباطن لبناء ركيزة الأمان.',
    descEn: 'Cleanses accumulated subconscious stress, dissolves deep anxiety, and promotes solid inner peace.',
    brainwave: 'Deep Theta (5.5Hz)'
  },
  {
    value: 639,
    labelAr: 'تطوير العلاقات والتواصل الإيجابي (639 Hz)',
    labelEn: 'Relationships & Empathy (639 Hz)',
    descAr: 'يساهم في التقارب العاطفي، علاج التواصل الأسري والترابط، ومضاعفة التعاطف القلبي.',
    descEn: 'Heart chakra focus. Promotes deep communication and connection in personal relationships.',
    brainwave: 'Theta (4.5Hz)'
  },
  {
    value: 741,
    labelAr: 'تطهير الخلايا واليقظة الفكرية (741 Hz)',
    labelEn: 'Intuition & Cognitive Cleansing (741 Hz)',
    descAr: 'ينظف الجسم والذهن من الطاقة السلبية والأفكار السامة ويثير منبع الإبداع والحدس العالي.',
    descEn: 'Purification and intuitive awakening. Clearas mental fog to support confident creative solutions.',
    brainwave: 'Theta (4Hz)'
  },
  {
    value: 852,
    labelAr: 'الاستيقاظ الروحي والوعي الذاتي (852 Hz)',
    labelEn: 'Awakening & Spiritual Order (852 Hz)',
    descAr: 'يمر عبر الموانع الإدراكية ليتصل مباشرة مع البصيرة الذاتية النظيفة ويعزز السلام الكلي.',
    descEn: 'Dissolves cognitive barriers, opening intuition to higher spiritual order and absolute alignment.',
    brainwave: 'Alpha-Gamma (15Hz)'
  },
  {
    value: 963,
    labelAr: 'الصحوة والتنوير العالي المطلق (963 Hz)',
    labelEn: 'Crown Chakra & Cosmic Wisdom (963 Hz)',
    descAr: 'تردد الصحوة الإلهية الشاملة، ينشط الغدة الصنوبرية ويتصل بمصدر الضوء الحقيقي والنقاء.',
    descEn: 'Pure divine presence. Awakens the pineal gland, inviting supreme awareness and universal oneness.',
    brainwave: 'Beta-Gamma (22Hz)'
  },
  {
    value: 174,
    labelAr: 'تسكين الآلام الجسدية العميقة الطمأنينة (174 Hz)',
    labelEn: 'Pain Relief & Physical Comfort (174 Hz)',
    descAr: 'يعمل كمخفف ومسكن طبيعي وخافض للآثار السلبية في العضلات والمفاصل مع بث الأمان والهدوء.',
    descEn: 'Acts as biological anesthetic. Releases tension and deep muscular pressure, ensuring a grounded body.',
    brainwave: 'Sub-Delta (2.5Hz)'
  }
];

export default function PlayerScreen({ 
  session, 
  onBack, 
  initialProgress,
  toggleFavorite, 
  isFavorite, 
  onSessionComplete,
  language 
}: PlayerScreenProps) {
  const tLocal = (key: string) => {
    return playerTranslations[language]?.[key] || playerTranslations['en']?.[key] || key;
  };

    const [currentSession, setCurrentSession] = useState<any>(session);
  const [playbackQueue, setPlaybackQueue] = useState<any[]>([]);
  const [showQueue, setShowQueue] = useState<boolean>(false);
  const [queueTab, setQueueTab] = useState<'meditation' | 'yoga'>('meditation');
  const [isCountdownMinimized, setIsCountdownMinimized] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(() => initialProgress !== undefined ? initialProgress : 0);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [showAlignInstructions, setShowAlignInstructions] = useState<boolean>(false);

  const getInitialFrequencyForSession = (s: any) => {
    const id = s.id;
    if (id === 'm1' || id === 'breathing' || s.title.includes('تنفس') || s.title.includes('Breath')) {
      return 432;
    } else if (id === 'm2' || id === 'relaxation' || s.title.includes('استرخاء مسائي') || s.title.includes('Evening')) {
      return 396;
    } else if (id === 'm3' || s.title.includes('نوم') || s.title.includes('Sleep')) {
      return 174;
    } else if (id === 'm4' || s.title.includes('توتر') || s.title.includes('Stress')) {
      return 741;
    } else if (id === 'y1' || s.title.includes('يوغا الصباح') || s.title.includes('Morning Yoga')) {
      return 528;
    } else if (id === 'y2' || s.title.includes('تدفق') || s.title.includes('Energy')) {
      return 528;
    } else if (id === 'y3' || s.title.includes('مرونة') || s.title.includes('Flexibility')) {
      return 639;
    }
    return 432;
  };

  const [activeFrequency, setActiveFrequency] = useState<number>(() => getInitialFrequencyForSession(session));

  useEffect(() => {
    setCurrentSession(session);
    setProgress(initialProgress !== undefined ? initialProgress : 0);
    setIsPlaying(true);
    setActiveFrequency(getInitialFrequencyForSession(session));
  }, [session, initialProgress]);

  const handleSessionCompleteAndNext = () => {
    // 1. Log completion of current session
    onSessionComplete(currentSession);
    
    // 2. Check queue
    if (playbackQueue.length > 0) {
      const nextSession = playbackQueue[0];
      const updatedQueue = playbackQueue.slice(1);
      
      setPlaybackQueue(updatedQueue);
      setCurrentSession(nextSession);
      setProgress(0);
      setIsPlaying(true);
      
      // Update active frequency
      const newFreq = getInitialFrequencyForSession(nextSession);
      setActiveFrequency(newFreq);
    } else {
      // End playback and stop
      setIsPlaying(false);
      globalMindfulnessSynth.stop();
    }
  };

  // Skip manually
  const handleSkipNext = () => {
    if (playbackQueue.length > 0) {
      handleSessionCompleteAndNext();
    }
  };

  // Add session to queue helper
  const addToQueue = (s: any) => {
    if (playbackQueue.some((item) => item.id === s.id) || currentSession.id === s.id) {
      return; // Already in queue or playing
    }
    setPlaybackQueue((prev) => [...prev, s]);
  };

  // Remove from queue
  const removeFromQueue = (id: string) => {
    setPlaybackQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear queue
  const clearQueue = () => {
    setPlaybackQueue([]);
  };

  // Calculate the active pose in the session
  const getActivePose = () => {
    const poses = YOGA_POSES[currentSession.id] || [];
    if (poses.length === 0) return null;
    
    // Calculate total seconds elapsed
    const totalSecondsElapsed = (progress / 100) * (currentSession.duration * 60);
    
    let accumulatedSeconds = 0;
    for (const pose of poses) {
      const minsMatch = pose.durationEn.match(/\d+/);
      const mins = minsMatch ? parseInt(minsMatch[0], 10) : 5;
      const poseSeconds = mins * 60;
      
      if (totalSecondsElapsed >= accumulatedSeconds && totalSecondsElapsed < accumulatedSeconds + poseSeconds) {
        return { 
          pose, 
          relativeElapsed: totalSecondsElapsed - accumulatedSeconds, 
          durationSec: poseSeconds 
        };
      }
      accumulatedSeconds += poseSeconds;
    }
    
    // Fallback to last's pose if at 100% or slightly beyond
    return { 
      pose: poses[poses.length - 1], 
      relativeElapsed: 0, 
      durationSec: 300 
    };
  };

  const activePoseData = getActivePose();

  const getFrequencyVisualProps = () => {
    switch (activeFrequency) {
      case 174:
        return {
          glowColor: 'from-red-500/25 via-rose-500/15 to-indigo-950/5',
          waveCount: 3,
          speed: 7.0,
          colorText: 'text-rose-400',
          pulseScale: [1, 1.25, 1],
          label: language === 'ar' ? 'موجة تسكين وتأريض ✦' : 'Safe Soothing Pain Wave ✦'
        };
      case 396:
        return {
          glowColor: 'from-orange-500/25 via-red-500/15 to-purple-950/5',
          waveCount: 3,
          speed: 6.0,
          colorText: 'text-orange-400',
          pulseScale: [1, 1.28, 1],
          label: language === 'ar' ? 'بناء الثقة والأمان النفسي ✦' : 'Grounding & Fear Dissolver ✦'
        };
      case 432:
        return {
          glowColor: 'from-emerald-400/20 via-teal-500/15 to-slate-950/5',
          waveCount: 4,
          speed: 5.0,
          colorText: 'text-emerald-400',
          pulseScale: [1, 1.32, 1],
          label: language === 'ar' ? 'ضبط الذبذبات الكونية ✦' : 'Harmonized Cosmic Wave ✦'
        };
      case 528:
        return {
          glowColor: 'from-yellow-400/25 via-amber-550/20 to-purple-950/10',
          waveCount: 5,
          speed: 4.2,
          colorText: 'text-amber-400',
          pulseScale: [1, 1.36, 1],
          label: language === 'ar' ? 'ترميم خلايا الـ DNA وتحفيز المعجزات ✦' : 'Cellular Transformation & DNA Repair ✦'
        };
      case 639:
        return {
          glowColor: 'from-pink-500/25 via-teal-400/20 to-purple-950/10',
          waveCount: 4,
          speed: 4.8,
          colorText: 'text-pink-400',
          pulseScale: [1, 1.34, 1],
          label: language === 'ar' ? 'ترميم روابط التواصل والتعاطف ✦' : 'Harmonic Relationship Frequency ✦'
        };
      case 741:
        return {
          glowColor: 'from-cyan-400/25 via-sky-500/15 to-slate-950/5',
          waveCount: 4,
          speed: 3.6,
          colorText: 'text-cyan-400',
          pulseScale: [1, 1.38, 1],
          label: language === 'ar' ? 'تطهير العقل من السموم الفكرية ✦' : 'Deep Intuitive Cleansing Filter ✦'
        };
      case 852:
        return {
          glowColor: 'from-indigo-500/25 via-purple-600/15 to-blue-950/5',
          waveCount: 5,
          speed: 3.0,
          colorText: 'text-indigo-400',
          pulseScale: [1, 1.4, 1],
          label: language === 'ar' ? 'الصحوة الباطنية والحدس الشديد ✦' : 'Higher Astral Resonance & Vision ✦'
        };
      case 963:
        return {
          glowColor: 'from-fuchsia-500/25 via-purple-500/15 to-white/5',
          waveCount: 6,
          speed: 2.2,
          colorText: 'text-fuchsia-400',
          pulseScale: [1, 1.44, 1],
          label: language === 'ar' ? 'الاتصال مع الضوء المطلق والنقاء ✦' : 'Supreme Universal Oneness light ✦'
        };
      default:
        return {
          glowColor: 'from-blue-500/20 via-indigo-500/15 to-purple-500/10',
          waveCount: 4,
          speed: 4.5,
          colorText: 'text-blue-400',
          pulseScale: [1, 1.3, 1],
          label: language === 'ar' ? 'تصفية وتأمل ✦' : 'Solfeggio Balancing ✦'
        };
    }
  };

  const visualProps = getFrequencyVisualProps();

  // Get the next yoga posture in the track
  const getNextPose = () => {
    const poses = YOGA_POSES[currentSession.id] || [];
    if (poses.length === 0 || !activePoseData) return null;
    
    const activeIndex = poses.findIndex(p => p.id === activePoseData.pose.id);
    if (activeIndex !== -1 && activeIndex < poses.length - 1) {
      return poses[activeIndex + 1];
    }
    return null;
  };

  const nextPose = getNextPose();

  // Core volumes (saved in component state to reflect Slider changes)
  const [musicVol, setMusicVol] = useState<number>(60);
  const [beatsVol, setBeatsVol] = useState<number>(35);
  const [natureVol, setNatureVol] = useState<number>(40);
  const [chimeVol, setChimeVol] = useState<number>(50);

  const title = language === 'ar' ? currentSession.title : currentSession.title_en;

  // Track session details for visual descriptors
  const getFrequencyMetadata = () => {
    const opt = SOLFEGGIO_FREQUENCIES.find(f => f.value === activeFrequency);
    if (opt) {
      return {
        freq: `${opt.value} Hz`,
        brainwave: opt.brainwave,
        benefit: language === 'ar' ? opt.descAr : opt.descEn
      };
    }
    return { freq: '432 Hz', brainwave: 'Theta (6Hz)', benefit: tLocal('rest') };
  };

  const metadata = getFrequencyMetadata();

  // Primary effect: drives duration progress bar
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99.9) {
            clearInterval(timer);
            setIsPlaying(false);
            globalMindfulnessSynth.stop();
            handleSessionCompleteAndNext();
            return 100;
          }
          // Increment progress strictly matching the duration
          return prev + (100 / (currentSession.duration * 60));
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentSession, playbackQueue]);

  // Secondary effect: Synchronizes real-time audio playback to playback Toggle
  useEffect(() => {
    if (isPlaying) {
      // Boot the Web Audio Synth smoothly
      globalMindfulnessSynth.start({
        sessionId: currentSession.id,
        category: currentSession.category,
        title: title,
        duration: currentSession.duration
      }, activeFrequency);

      // Update sound volumes immediately
      globalMindfulnessSynth.updateVolumes(
        musicVol / 100,
        beatsVol / 100,
        natureVol / 100,
        chimeVol / 100
      );
    } else {
      globalMindfulnessSynth.stop();
    }

    return () => {
      globalMindfulnessSynth.stop();
    };
  }, [isPlaying, currentSession.id, activeFrequency]);

  // Adjust volumes in real-time as user drags slider controls
  const handleVolumeChange = (type: 'music' | 'beats' | 'nature' | 'chime', val: number) => {
    if (type === 'music') {
      setMusicVol(val);
      globalMindfulnessSynth.updateVolumes(val / 100, beatsVol / 100, natureVol / 100, chimeVol / 100);
    } else if (type === 'beats') {
      setBeatsVol(val);
      globalMindfulnessSynth.updateVolumes(musicVol / 100, val / 100, natureVol / 100, chimeVol / 100);
    } else if (type === 'nature') {
      setNatureVol(val);
      globalMindfulnessSynth.updateVolumes(musicVol / 100, beatsVol / 100, val / 100, chimeVol / 100);
    } else if (type === 'chime') {
      setChimeVol(val);
      globalMindfulnessSynth.updateVolumes(musicVol / 100, beatsVol / 100, natureVol / 100, val / 100);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const elapsedTime = formatTime(progress / 100 * (currentSession.duration * 60));
  const totalTime = formatTime(currentSession.duration * 60);

  // Calculate breathing phase scale (1.0 to 1.35) for live screen pumping animation to help user breathe
  const breathPulseSpeed = currentSession.id === 'm1' || currentSession.id === 'y2' ? '4s' : '6s';

  return (
    <div className="relative h-full w-full text-white flex flex-col justify-between p-7 select-none overflow-hidden bg-[#121212]">
      
      {/* Immersive Pulsating Background Sphere based on session's color theme */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Glowing breathing auroras */}
        <motion.div
          animate={isPlaying ? {
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.45, 0.25],
          } : { scale: 1, opacity: 0.2 }}
          transition={{
            duration: currentSession.id === 'm1' || currentSession.id === 'y2' ? 4 : 6, // breathing duration
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-12 -left-12 w-96 h-96 bg-[#E2C854]/20 rounded-full blur-3xl opacity-30"
        />

        <motion.div
          animate={isPlaying ? {
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.35, 0.15],
          } : { scale: 1.1, opacity: 0.18 }}
          transition={{
            duration: currentSession.id === 'm1' || currentSession.id === 'y2' ? 4 : 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-24 -right-12 w-[420px] h-[420px] bg-[#E2C854]/10 rounded-full blur-3xl"
        />

        {/* Live background equalizer lines representing Solfeggio sound oscillation */}
        <div className="absolute bottom-32 inset-x-0 h-40 opacity-15 flex items-end justify-center gap-1">
          {Array.from({ length: 45 }).map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? {
                height: [15, Math.sin(i * 0.4) * 120 + 130, 15],
              } : { height: 10 }}
              transition={{
                duration: Math.max(0.6, (1.8 + (i % 5) * 0.3) * (visualProps.speed / 5.2)),
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-[3px] bg-[#E2C854] rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Header Panel */}
      <header className="relative z-10 flex items-center justify-between">
        <button 
          onClick={() => {
            globalMindfulnessSynth.stop();
            onBack(progress);
          }} 
          className="p-3 bg-[#181818]/80 backdrop-blur-md rounded-full border border-white/10 hover:border-[#E2C854] active:scale-95 transition"
        >
          <svg className="w-5 h-5 text-white ltr:rotate-180 rtl:rotate-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Dynamic active status label */}
        <div className="bg-[#181818]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E2C854]/30 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#E2C854] animate-pulse" />
          <span className="text-[10px] font-black tracking-wider uppercase text-white">
            {metadata.freq} ✧ <span className="text-[#E2C854]">{metadata.brainwave}</span>
          </span>
        </div>

        {/* Ambient Settings Drawer Icon */}
        <button 
          onClick={() => setShowConfig(true)}
          className="p-3 bg-[#181818]/80 hover:bg-[#181818] hover:border-[#E2C854]/40 active:scale-95 transition rounded-full border border-white/10 flex items-center justify-center cursor-pointer"
          title="Adjust Custom Frequencies"
        >
          <Sliders className="w-5 h-5 text-[#E2C854]" />
        </button>
      </header>

      {/* Sessions Countdown Timer Overlay */}
      <div className="relative z-20 flex justify-center mt-3 mb-1">
        <motion.div
          layout
          onClick={() => setIsCountdownMinimized(!isCountdownMinimized)}
          className="cursor-pointer select-none bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-white/20 active:scale-95 transition-all text-white rounded-2xl p-2.5 shadow-2xl flex items-center gap-3 max-w-xs ring-1 ring-white/5"
        >
          <div className="p-2 bg-indigo-500/25 rounded-md flex items-center justify-center animate-pulse shrink-0">
            <Timer className="w-4 h-4 text-indigo-300" />
          </div>

          {!isCountdownMinimized ? (
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              className="text-left rtl:text-right pr-2 min-w-[124px]"
            >
              <p className="text-[8px] uppercase tracking-wider text-indigo-200/80 font-black leading-none">
                {tLocal('countdownRemaining')}
              </p>
              <p className="text-xs font-black font-mono text-white mt-1.5 leading-none flex items-center gap-1.5">
                {(() => {
                  const totalSec = currentSession.duration * 60;
                  const elapsedSec = (progress / 100) * totalSec;
                  const remainingSec = Math.max(0, Math.ceil(totalSec - elapsedSec));
                  const rm = Math.floor(remainingSec / 60);
                  const rs = Math.floor(remainingSec % 60);
                  return `${String(rm).padStart(2, '0')}:${String(rs).padStart(2, '0')}`;
                })()}
                <span className="text-[8px] text-[#34d399] font-black tracking-normal uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded-md leading-none animate-pulse">
                  {language === 'ar' ? 'نشط' : 'LIVE'}
                </span>
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 pr-1 font-mono text-xs font-black text-indigo-200/95"
            >
              <span>
                {(() => {
                  const totalSec = currentSession.duration * 60;
                  const elapsedSec = (progress / 100) * totalSec;
                  const remainingSec = Math.max(0, Math.ceil(totalSec - elapsedSec));
                  const rm = Math.floor(remainingSec / 60);
                  const rs = Math.floor(remainingSec % 60);
                  return `${String(rm).padStart(2, '0')}:${String(rs).padStart(2, '0')}`;
                })()}
              </span>
            </motion.div>
          )}

          {/* Interactive Collapse/Expand toggle icon */}
          <div className="text-[8px] text-gray-400 font-bold px-1 select-none pointer-events-none hover:text-white transition">
            {isCountdownMinimized ? '＋' : '✕'}
          </div>
        </motion.div>
      </div>

      {/* Main Body - Breathing Circle Visualizer OR Pose Sequence Visual Guide */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-3 max-w-sm mx-auto w-full">
        {currentSession.category === 'yoga' && activePoseData ? (
          /* Render Yoga Posture Sequence Overlay card */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col items-center relative overflow-hidden"
          >
            {/* Soft decorative light ring */}
            <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-tr ${currentSession.color} blur-2xl opacity-30`} />

            {/* Active Posture Tag */}
            <div className="flex items-center gap-2 mb-4 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] text-indigo-200 uppercase font-black tracking-wider w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>{tLocal('activePosture')}</span>
            </div>

            {/* Heart Active Posture Render with Breathe Animation */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Dynamic, Frequency-Synchronized Harmonic Wave Ripples for Yoga Posture */}
              {isPlaying && Array.from({ length: Math.min(4, visualProps.waveCount) }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{
                    scale: [0.95, 1.5 + (idx * 0.12)],
                    opacity: [0.4, 0.08, 0]
                  }}
                  transition={{
                    duration: visualProps.speed,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: idx * (visualProps.speed / Math.min(4, visualProps.waveCount))
                  }}
                  className={`absolute inset-0 rounded-full bg-gradient-to-tr ${visualProps.glowColor} pointer-events-none blur-sm`}
                />
              ))}

              {/* Outer pulsing ring */}
              <motion.div
                animate={isPlaying ? {
                  scale: [1, 1.15, 1],
                  opacity: [0.1, 0.25, 0.1]
                } : { scale: 1, opacity: 0.08 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-white/5 rounded-full"
              />
              <motion.div
                animate={isPlaying ? {
                  scale: [1, 1.05, 1]
                } : { scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-3 bg-white/5 border border-white/15 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
              />

              {/* The actual postural SVG drawing */}
              <motion.div
                animate={isPlaying ? {
                  y: [0, -4, 0],
                  scale: [1, 1.02, 1]
                } : { y: 0, scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 scale-125 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
              >
                {activePoseData.pose.svg()}
              </motion.div>

              {/* Small floating play/pause hub overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute bottom-1 right-1 w-9 h-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center border border-white/20 shadow-md transform hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                {isPlaying ? (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <rect x="5" y="3" width="4" height="18" rx="1" />
                    <rect x="15" y="3" width="4" height="18" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
            </div>

            {/* Posture Descriptors */}
            <div className="mt-4 text-center w-full px-2">
              <h3 className="text-lg font-black text-white leading-tight">
                {language === 'ar' ? activePoseData.pose.nameAr : activePoseData.pose.nameEn}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                {language === 'ar' ? activePoseData.pose.nameEn : activePoseData.pose.nameAr}
              </p>

              {/* Remaining active posture time */}
              {(() => {
                const remainingSec = Math.max(0, activePoseData.durationSec - activePoseData.relativeElapsed);
                const remMins = Math.floor(remainingSec / 60);
                const remSecs = Math.floor(remainingSec % 60);
                const formattedRemaining = `${remMins}:${String(remSecs).padStart(2, '0')}`;
                
                return (
                  <div className="mt-2 text-xs font-mono font-black text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3.5 py-0.5 w-fit mx-auto flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>
                      {language === 'ar' ? `${formattedRemaining} متبقي` : `${formattedRemaining} remaining`}
                    </span>
                  </div>
                );
              })()}

              <p className="text-[11px] text-gray-300 font-medium leading-relaxed mt-3 max-h-[52px] overflow-y-auto px-1 border-t border-white/5 pt-2">
                {language === 'ar' ? activePoseData.pose.benefitAr : activePoseData.pose.benefitEn}
              </p>
            </div>

            {/* Action Buttons: Alignment and Sequence list trackers */}
            <div className="mt-4 pt-3 border-t border-white/5 w-full flex justify-between gap-2.5">
              <button
                onClick={() => setShowAlignInstructions(true)}
                className="flex-1 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-[9px] uppercase font-black text-indigo-300 border border-indigo-500/25 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? '📖 دليل التطبيق' : '📖 Align Guide'}</span>
              </button>

              {nextPose && (
                <div className="flex-1 py-1.5 bg-white/5 border border-white/10 text-[9px] font-bold text-gray-300 rounded-xl flex items-center justify-center gap-1 truncate max-w-[50%]">
                  <span className="text-gray-400 shrink-0 font-extrabold">{tLocal('nextUp')}</span>
                  <span className="truncate text-indigo-200">
                    {language === 'ar' ? nextPose.nameAr : nextPose.nameEn}
                  </span>
                </div>
              )}
            </div>

          </motion.div>
        ) : (
          /* Render Breathing Circle Visualizer Helper with Frequency-Synchronized Harmonic Waves */
          <div className="relative w-64 h-64 flex items-center justify-center">

            {/* Dynamic, Frequency-Synchronized Harmonic Wave Rings */}
            {isPlaying && Array.from({ length: visualProps.waveCount }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{
                  scale: [0.95, 1.6 + (idx * 0.14)],
                  opacity: [0.45, 0.12, 0]
                }}
                transition={{
                  duration: visualProps.speed,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: idx * (visualProps.speed / visualProps.waveCount)
                }}
                className={`absolute inset-0 rounded-full bg-gradient-to-tr ${visualProps.glowColor} pointer-events-none blur-sm`}
              />
            ))}

            {/* Glowing Aura 1 */}
            <div className="absolute inset-0 bg-white/5 rounded-full border border-white/5" />

            {/* Inhale/Exhale wave helper mapping to visual state */}
            <motion.div
              animate={isPlaying ? {
                scale: [1, 1.35, 1],
                opacity: [0.15, 0.45, 0.15]
              } : { scale: 1, opacity: 0.12 }}
              transition={{
                duration: currentSession.id === 'm1' || currentSession.id === 'y2' ? 4 : 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute inset-2 bg-gradient-to-tr ${visualProps.glowColor} rounded-full blur-2xl opacity-20`}
            />

            <motion.div
              animate={isPlaying ? {
                scale: [1, 1.18, 1],
              } : { scale: 1 }}
              transition={{
                duration: currentSession.id === 'm1' || currentSession.id === 'y2' ? 4 : 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-8 bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex flex-col items-center justify-center shadow-xl"
            />

            {/* Glowing central sphere containing play control */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative w-28 h-28 rounded-full bg-[#E2C854] hover:bg-[#ebd775] transition-all text-[#121212] flex items-center justify-center shadow-[0_0_40px_rgba(226,200,84,0.45)] border-4 border-[#121212] cursor-pointer"
            >
              {isPlaying ? (
                <motion.div animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 2.5 }} className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-[#121212] fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span className="text-[8px] font-black uppercase mt-1 tracking-widest text-[#121212]">
                    {language === 'ar' ? 'استرخاء' : 'BREATHE'}
                  </span>
                </motion.div>
              ) : (
                <svg className="w-9 h-9 text-[#121212] fill-current ltr:ml-1 rtl:mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </motion.button>
          </div>
        )}

        {/* Breathing textual guidance helper */}
        {currentSession.category !== 'yoga' && (
          <div className="mt-6 text-center">
            <motion.p 
              animate={isPlaying ? {
                opacity: [0.5, 1.0, 0.5],
                scale: [0.97, 1.02, 0.97]
              } : { opacity: 0.8 }}
              transition={{
                duration: currentSession.id === 'm1' || currentSession.id === 'y2' ? 4 : 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-xs md:text-sm text-[#E2C854] font-black bg-[#181818]/90 px-5 py-2.5 rounded-2xl border border-[#E2C854]/25 shadow-lg"
            >
              {tLocal('inhaleExhaleGuide')}
            </motion.p>
          </div>
        )}
      </main>

      {/* Detail Panel & Duration Timer */}
      <footer className="relative z-10 space-y-5">
        <div className="text-center px-4">
          <h1 className="text-2xl font-black text-white leading-tight">{title}</h1>
          
          <div className="mt-2.5 flex items-center justify-center gap-2 text-xs text-[#A3A3A3] font-semibold">
            <span className="px-2.5 py-1 bg-[#181818] border border-white/10 text-white rounded-full">
              {language === 'ar' ? 'سولفيجيو ' : 'Solfeggio '}<span className="text-[#E2C854] font-black">{metadata.freq}</span>
            </span>
            <span>•</span>
            <span className="text-[#E2C854] font-bold">{metadata.benefit}</span>
          </div>
        </div>

        {/* Live Audio progress tracker */}
        <div className="space-y-2">
          {/* Progress Timeline slider */}
          <div 
            className="relative w-full h-2 bg-white/10 hover:h-2.5 transition-all duration-200 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percent = clickX / rect.width;
              setProgress(percent * 100);
            }}
          >
            <div 
              className="h-full bg-[#E2C854] shadow-[0_0_12px_rgba(226,200,84,0.7)] text-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-[#A3A3A3] font-mono tracking-wider">
            <span>{elapsedTime}</span>
            <div className="flex gap-1.5 items-center bg-[#181818] px-2 py-0.5 rounded-lg border border-white/10 text-[10px] text-white">
              <Clock className="w-3 h-3 text-[#E2C854]" />
              <span>{currentSession.duration}m</span>
            </div>
            <span>{totalTime}</span>
          </div>
        </div>

        {/* Bottom utility tray */}
        <div className="flex justify-between items-center bg-[#181818]/90 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 gap-2">
          {/* Reset Progress Button */}
          <button 
            type="button"
            onClick={() => {
              setProgress(0);
              setIsPlaying(true);
            }}
            className="p-3 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 active:scale-90 transition flex flex-col items-center justify-center cursor-pointer"
            title="Restart Session"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </button>

          {/* Queue List Trigger Button with dynamic badge */}
          <button
            type="button"
            onClick={() => setShowQueue(true)}
            className="relative p-3 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 active:scale-90 transition flex flex-col items-center justify-center cursor-pointer"
            title="Open Queue"
          >
            <List className="w-5 h-5 text-[#E2C854] pointer-events-none" />
            {playbackQueue.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#E2C854] text-[#121212] font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                {playbackQueue.length}
              </span>
            )}
          </button>

          {/* Solfeggio brainwave indicator */}
          <div className="text-center flex-1">
            <p className="text-[7px] uppercase text-[#A3A3A3] font-black tracking-widest leading-none">
              {tLocal('binauralTarget')}
            </p>
            <p className="text-[11px] font-black text-[#E2C854] mt-1 flex items-center justify-center gap-1 leading-none">
              <Sparkles className="w-3.5 h-3.5 text-[#E2C854] animate-pulse" />
              {metadata.brainwave}
            </p>
          </div>

          {/* Skip Forward Button (Visible only when items exist in queue) */}
          {playbackQueue.length > 0 && (
            <button
              type="button"
              onClick={handleSkipNext}
              className="p-3 text-[#E2C854] hover:text-[#ebd775] rounded-xl hover:bg-white/5 active:scale-90 transition flex flex-col items-center justify-center animate-pulse animate-duration-1000 cursor-pointer"
              title={tLocal('skipToNext')}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          )}

          {/* Favorite toggle */}
          <button 
            onClick={() => toggleFavorite(currentSession.id)} 
            className="p-3 rounded-xl hover:bg-white/5 active:scale-90 transition flex flex-col items-center justify-center cursor-pointer"
            title="Toggle Favorite"
          >
            <Heart className={`w-5 h-5 leading-none ${isFavorite ? "text-rose-500 fill-current" : "text-gray-400"}`} />
          </button>
        </div>
      </footer>

      {/* ==================== Ambient Sound & Frequency Balancing Overlay Drawer ==================== */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            className="absolute inset-0 bg-[#121212]/98 z-30 p-6 flex flex-col justify-between overflow-y-auto"
          >
            
            {/* Drawer Header */}
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-[#E2C854]">
                  <Sliders className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-wider text-white">
                    {tLocal('ambientSoundSettings')}
                  </span>
                </div>
                <button 
                  onClick={() => setShowConfig(false)}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-black rounded-xl border border-white/10 text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-[#A3A3A3] leading-relaxed mb-6 font-medium">
                {tLocal('ambientSoundSettingsDesc')}
              </p>

              {/* Slider 1: Ambient Music Vol */}
              <div className="space-y-2.5 mb-4 bg-[#181818] p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#E2C854]" />
                    <span className="text-xs font-black text-white">{tLocal('musicVol')}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E2C854]">{musicVol}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={musicVol}
                  onChange={(e) => handleVolumeChange('music', Number(e.target.value))}
                  className="w-full accent-[#E2C854] cursor-pointer h-1.5 rounded-full outline-none bg-white/10"
                />
              </div>

              {/* Slider 2: Solfeggio & Brainwave Beats Vol */}
              <div className="space-y-2.5 mb-4 bg-[#181818] p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#E2C854]" />
                    <span className="text-xs font-black text-white">{tLocal('beatsVol')}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E2C854]">{beatsVol}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={beatsVol}
                  onChange={(e) => handleVolumeChange('beats', Number(e.target.value))}
                  className="w-full accent-[#E2C854] cursor-pointer h-1.5 rounded-full outline-none bg-white/10"
                />
              </div>

              {/* Slider 3: Nature noise ocean flow */}
              <div className="space-y-2.5 mb-4 bg-[#181818] p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#E2C854]" />
                    <span className="text-xs font-black text-white">{tLocal('natureVol')}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E2C854]">{natureVol}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={natureVol}
                  onChange={(e) => handleVolumeChange('nature', Number(e.target.value))}
                  className="w-full accent-[#E2C854] cursor-pointer h-1.5 rounded-full outline-none bg-white/10"
                />
              </div>

              {/* Slider 4: Ancient chimes Vol */}
              <div className="space-y-2.5 mb-6 bg-[#181818] p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E2C854]" />
                    <span className="text-xs font-black text-white">{tLocal('chimeVol')}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E2C854]">{chimeVol}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={chimeVol}
                  onChange={(e) => handleVolumeChange('chime', Number(e.target.value))}
                  className="w-full accent-[#E2C854] cursor-pointer h-1.5 rounded-full outline-none bg-white/10"
                />
              </div>

              {/* Vibrational Solfeggio Frequency Waves Selector */}
              <div className="space-y-3 mb-6 bg-[#181818] p-5 rounded-2xl border border-white/10">
                <div className="flex flex-col gap-1 text-left rtl:text-right">
                  <h3 className="text-xs font-black text-[#E2C854] flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-[#E2C854] animate-pulse" />
                    <span>{tLocal('chooseSolfeggioTitle')}</span>
                  </h3>
                  <p className="text-[10px] text-[#A3A3A3] leading-normal font-medium">
                    {tLocal('dnaRepairSolfeggio')}
                  </p>
                </div>

                {/* Selectable grid items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                  {SOLFEGGIO_FREQUENCIES.map((opt) => {
                    const isSelected = activeFrequency === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setActiveFrequency(opt.value);
                          globalMindfulnessSynth.updateFrequency(opt.value);
                        }}
                        className={`flex flex-col p-3 rounded-xl border text-left rtl:text-right transition duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#E2C854]/15 border-[#E2C854] shadow-[0_0_15px_rgba(226,200,84,0.25)] ring-1 ring-[#E2C854]/30 text-white'
                            : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-[11px] font-black tracking-tight ${isSelected ? 'text-[#E2C854]' : 'text-white'}`}>
                            {language === 'ar' ? opt.labelAr : opt.labelEn}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#E2C854] animate-ping" />
                          )}
                        </div>
                        <p className="text-[9px] text-[#A3A3A3] leading-snug font-medium">
                          {language === 'ar' ? opt.descAr : opt.descEn}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-[8px] font-mono text-gray-400 uppercase font-black">
                          <span>{language === 'ar' ? 'الموجة المستهدفة:' : 'Brainwave:'} <span className="text-[#E2C854]">{opt.brainwave}</span></span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical indicators / Neural Entrainment stats */}
              <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 space-y-2 text-xs text-gray-300 font-semibold">
                <p className="text-[9px] uppercase tracking-wider font-extrabold text-[#E2C854]">
                  {tLocal('howTether')}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] leading-relaxed pt-1.5 border-t border-white/10">
                  <div>
                    <span className="text-[#A3A3A3] block">{tLocal('activeFrequency')}</span>
                    <span className="font-extrabold text-white">{metadata.freq}</span>
                  </div>
                  <div>
                    <span className="text-[#A3A3A3] block">{tLocal('binauralTarget')}</span>
                    <span className="font-extrabold text-white">{metadata.brainwave}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-white/10">
                    <span className="text-[#A3A3A3] block">{tLocal('solfeggioBenefit')}</span>
                    <span className="font-extrabold text-[#E2C854] leading-tight block">{metadata.benefit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom confirmation close */}
            <div className="mt-8">
              <div className="p-3 bg-[#E2C854]/10 border border-[#E2C854]/25 text-center rounded-xl text-[10px] text-[#E2C854] font-bold mb-3">
                🎧 {tLocal('headphonesRecom')}
              </div>
              <button
                onClick={() => setShowConfig(false)}
                className="w-full py-3.5 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-2xl text-xs font-black tracking-wide cursor-pointer active:scale-95 transition"
              >
                {tLocal('close')}
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== Yoga Posture Alignment Guide & Sequence Drawer ==================== */}
      <AnimatePresence>
        {showAlignInstructions && activePoseData && (
          <motion.div
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 120 }}
            className="absolute inset-0 bg-slate-950/98 z-40 p-6 flex flex-col justify-between overflow-y-auto"
          >
            {/* Scrollable Container */}
            <div className="flex-1 space-y-6">
              {/* Drawer Title Header */}
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Info className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-wider">
                    {tLocal('alignmentGuide')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAlignInstructions(false)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 active:scale-95 transition text-[10px] uppercase font-black tracking-wider text-gray-300 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Large Active Posture Visual Representation */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-2 left-2 text-[9px] font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/10">
                  {language === 'ar' ? 'الرسم التوضيحي' : 'ILLUSTRATION'}
                </div>
                <div className="w-32 h-32 flex items-center justify-center scale-125 pt-2">
                  {activePoseData.pose.svg()}
                </div>
                <h4 className="text-base font-black text-white text-center mt-4">
                  {language === 'ar' ? activePoseData.pose.nameAr : activePoseData.pose.nameEn}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold tracking-tight uppercase text-center mt-0.5">
                  {language === 'ar' ? activePoseData.pose.nameEn : activePoseData.pose.nameAr}
                </p>
              </div>

              {/* Step by step Alignment details */}
              <div className="space-y-3.5 bg-white/3 border border-white/5 rounded-2xl p-4.5">
                <div>
                  <h5 className="text-[11px] font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5 text-left rtl:text-right">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>{tLocal('steps')}</span>
                  </h5>
                  <p className="text-xs text-gray-200 mt-2 leading-relaxed text-left rtl:text-right">
                    {language === 'ar' ? activePoseData.pose.descAr : activePoseData.pose.descEn}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <h5 className="text-[11px] font-black uppercase text-emerald-300 tracking-wider flex items-center gap-1.5 text-left rtl:text-right">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>{tLocal('benefits')}</span>
                  </h5>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed text-left rtl:text-right">
                    {language === 'ar' ? activePoseData.pose.benefitAr : activePoseData.pose.benefitEn}
                  </p>
                </div>
              </div>

              {/* Complete sequence summary of current yoga session */}
              <div className="space-y-3">
                <h5 className="text-[11px] font-black uppercase text-blue-300 tracking-wider flex items-center gap-1.5 text-left rtl:text-right">
                  <List className="w-4 h-4 text-blue-400" />
                  <span>{tLocal('postureSequence')}</span>
                </h5>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {(YOGA_POSES[currentSession.id] || []).map((pose, idx) => {
                    const isActive = pose.id === activePoseData.pose.id;
                    return (
                      <div
                        key={pose.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition ${
                          isActive
                            ? 'bg-indigo-500/10 border-indigo-500/30'
                            : 'bg-black/20 border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-mono font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                            isActive ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="text-left rtl:text-right">
                            <p className="text-xs font-black text-white">
                              {language === 'ar' ? pose.nameAr : pose.nameEn}
                            </p>
                            <p className="text-[9px] text-gray-400 leading-none mt-1">
                              {language === 'ar' ? pose.nameEn : pose.nameAr}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-400 font-bold bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 shrink-0">
                          {language === 'ar' ? pose.duration : pose.durationEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom button callback */}
            <div className="pt-4 mt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowAlignInstructions(false)}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-wide cursor-pointer active:scale-95 transition"
              >
                {tLocal('closeGuide')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== Sequential Playback Queue Drawer Overlay ==================== */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            className="absolute inset-0 bg-slate-950/98 z-30 p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-indigo-300">
                  <List className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-black uppercase tracking-wider text-white">
                    {tLocal('queueTitle')}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowQueue(false)}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-black rounded-xl border border-white/15 text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed mb-5 text-left rtl:text-right">
                {tLocal('queueDesc')}
              </p>

              {/* SECTION 1: Current Session & Upcoming Queue */}
              <div className="space-y-3 mb-6">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex justify-between items-center">
                  <span>{tLocal('upcomingSessions')}</span>
                  {playbackQueue.length > 0 && (
                    <button 
                      type="button" 
                      onClick={clearQueue}
                      className="text-[10px] text-red-400 font-bold hover:text-red-300 transition-colors cursor-pointer lg:text-xs"
                    >
                      {tLocal('clearQueue')}
                    </button>
                  )}
                </h3>

                {/* Currently playing card */}
                <div className="flex items-center justify-between p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl shadow-inner">
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] tracking-wider uppercase font-black bg-indigo-500 text-white px-2 py-0.5 rounded-md animate-pulse">
                      {language === 'ar' ? 'يعمل الآن' : 'PLAYING'}
                    </span>
                    <div className="text-left rtl:text-right">
                      <p className="text-xs font-black text-white">
                        {language === 'ar' ? currentSession.title : currentSession.title_en}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5 font-bold">
                        {currentSession.duration}m • {language === 'ar' ? (currentSession.category === 'beginner' || currentSession.category === 'intermediate' || currentSession.category === 'advanced' ? 'يوغا' : 'تأمل') : currentSession.category}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Queue list elements */}
                {playbackQueue.length === 0 ? (
                  <div className="p-5 text-center bg-white/3 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {tLocal('queueEmpty')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {playbackQueue.map((item, idx) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl transition hover:border-white/10 text-left rtl:text-right text-white"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono font-bold text-gray-400 w-5 h-5 flex items-center justify-center bg-white/5 rounded-full">
                            {idx + 1}
                          </span>
                          <div className="text-left rtl:text-right">
                            <p className="text-xs font-black text-white">
                              {language === 'ar' ? item.title : item.title_en}
                            </p>
                            <p className="text-[9px] text-gray-400 font-mono mt-0.5 font-bold">
                              {item.duration}m • {language === 'ar' ? (item.category === 'beginner' || item.category === 'intermediate' || item.category === 'advanced' ? 'يوغا' : 'تأمل') : item.category}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromQueue(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg active:scale-95 transition-all cursor-pointer"
                          title="Remove from queue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 2: Browse & Add sessions grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider text-left rtl:text-right">
                  {tLocal('exploreSessions')}
                </h3>

                {/* Category filters inside Queue list */}
                <div className="flex gap-2 mb-3 bg-white/5 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQueueTab('meditation')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      queueTab === 'meditation' 
                        ? 'bg-indigo-650 text-white border border-indigo-500/30 font-extrabold bg-indigo-550' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tLocal('meditationTab')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQueueTab('yoga')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      queueTab === 'yoga' 
                        ? 'bg-indigo-650 text-white border border-indigo-500/30 font-extrabold bg-indigo-550' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tLocal('yogaTab')}
                  </button>
                </div>

                <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                  {(queueTab === 'meditation' ? mockData.meditation : mockData.yoga)
                    .filter((item) => item.id !== currentSession.id)
                    .map((item) => {
                      const isQueued = playbackQueue.some((q) => q.id === item.id);
                      return (
                        <div 
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left rtl:text-right ${
                            isQueued 
                              ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70' 
                              : 'bg-black/20 border-white/5 hover:bg-black/40'
                          }`}
                        >
                          <div className="text-left rtl:text-right">
                            <p className="text-xs font-black text-white text-left rtl:text-right">
                              {language === 'ar' ? item.title : item.title_en}
                            </p>
                            <p className="text-[9px] text-indigo-300 font-bold mt-0.5 text-left rtl:text-right">
                              {item.duration}m • {language === 'ar' ? (item.category === 'beginner' || item.category === 'intermediate' || item.category === 'advanced' ? 'يوغا' : 'تأمل') : item.category}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={isQueued}
                            onClick={() => addToQueue(item)}
                            className={`p-1.5 rounded-lg active:scale-95 transition flex items-center justify-center gap-1 cursor-pointer ${
                              isQueued
                                ? 'text-emerald-400 font-bold text-[9px]'
                                : 'bg-indigo-600/35 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/50'
                            }`}
                          >
                            {isQueued ? (
                              <span>✓</span>
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Close Queue Drawer */}
            <div className="pt-4 mt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowQueue(false)}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-wide cursor-pointer active:scale-95 transition"
              >
                {tLocal('closeQueue')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
