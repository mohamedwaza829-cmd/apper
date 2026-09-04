import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Smile, 
  Frown, 
  Flame, 
  Zap, 
  Brain, 
  Moon, 
  Hourglass, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Compass, 
  Sparkle,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Wind,
  Headphones,
  Info,
  Clock,
  Send,
  MessageSquare,
  Activity,
  Mic,
  MicOff,
  Radio
} from 'lucide-react';
import { mockData } from '../data/sessions';

interface AICoachScreenProps {
  onBack: () => void;
  language: string;
  t: (key: string) => string;
  onSelectSession: (session: any) => void;
  onNavigate: (page: string) => void;
}

export default function AICoachScreen({ onBack, language, t, onSelectSession, onNavigate }: AICoachScreenProps) {
  // Navigation Tabs: 'chat' (AI Coach Chat & Mood) | 'text' (AI Advisor) | 'audio' (AI Audio Session)
  const [activeTab, setActiveTab] = useState<'chat' | 'text' | 'audio'>('chat');

  // AI Conversational Chat States
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: language === 'ar' 
        ? 'مرحباً بك في ركن الدعم الذكي الخاص بك. أنا مستشارك ومرشدك الصحي الواعي. كيف تشعر الآن؟ صف لي حالتك النفسية أو الجسدية وسأقوم بتحليل مزاجك وتقديم توصيات مخصصة للتحسن فوراً دون كثرة أسئلة مكررة.'
        : "Hello and welcome to your personalized coaching sanctuary. I am your mindful wellness advisor. How are you feeling right now? Describe your mental or physical state, and I will analyze your mood to recommend tailored actions instantly, without unnecessary questions.",
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, chatLoading, activeTab]);

  const handleSendChatMessage = async (textToSend?: string) => {
    const rawText = textToSend || chatInput;
    if (!rawText.trim() || chatLoading) return;

    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      content: rawText,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat-wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          language,
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const { reply, detectedMood, recommendedSessionIds, shouldTriggerBreathing } = resJson.data;
        
        // Lookup session objects
        const recommendedSessions = (recommendedSessionIds || []).map((id: string) => {
          return mockData.meditation.find(s => s.id === id) || mockData.yoga.find(s => s.id === id);
        }).filter(Boolean);

        const aiMsg = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: reply,
          detectedMood,
          recommendedSessions,
          shouldTriggerBreathing,
        };

        if (detectedMood && detectedMood !== 'UNKNOWN') {
          setCurrentMood(detectedMood);
        }

        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error(resJson.error || 'Server returned invalid response');
      }
    } catch (err: any) {
      console.error("Chat generation service error:", err);
      const fallbackMsg = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: language === 'ar' 
          ? 'أشعر بك وبأهمية موازنة خطوط طاقتك الآن. أنصحك بالبدء فوراً بتمارين التنفس العميق، أو تشغيل إحدى جلسات الاسترخاء الإيجابية التي تمنحك وعياً تاماً وحضوراً هادئاً.'
          : 'I feel you and understand how crucial it is to restore your equilibrium. I suggest launching one of our relaxation sessions or diving into our deep breathing exercises immediately.',
        detectedMood: 'STRESSED',
        recommendedSessions: [mockData.meditation[3]], // m4 Stress relief as default fallback
        shouldTriggerBreathing: true
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const getMoodConfig = (mood: string) => {
    switch (mood) {
      case 'STRESSED':
        return {
          labelAr: 'حالة التوتر والمجهد النفسي 😰',
          labelEn: 'Feeling Stressed 😰',
          bg: 'bg-[#181818] border-rose-500/40 text-rose-400',
        };
      case 'ANXIOUS':
        return {
          labelAr: 'قلق وتشتت فكري 😟',
          labelEn: 'Anxious / Multi-thinking 😟',
          bg: 'bg-[#181818] border-amber-500/40 text-amber-400',
        };
      case 'TIRED':
        return {
          labelAr: 'استنزاف جسدي وخمول 😴',
          labelEn: 'Exhausted & Tired 😴',
          bg: 'bg-[#181818] border-sky-500/40 text-sky-400',
        };
      case 'SAD':
        return {
          labelAr: 'حزن وغياب الطاقة المعنوية 😢',
          labelEn: 'Sad & Blue 😢',
          bg: 'bg-[#181818] border-purple-500/40 text-purple-400',
        };
      case 'ANGRY':
        return {
          labelAr: 'انفعال وغضب متراكم 😡',
          labelEn: 'Angry & Agitated 😡',
          bg: 'bg-[#181818] border-red-500/40 text-red-400',
        };
      case 'CALM':
        return {
          labelAr: 'مزاج متزن وهادئ 😌',
          labelEn: 'Perfect Peace & Calm 😌',
          bg: 'bg-[#181818] border-emerald-500/40 text-emerald-400',
        };
      case 'ENERGETIC':
        return {
          labelAr: 'نشاط وحيوية عالية ⚡',
          labelEn: 'Fully Charged & Energetic ⚡',
          bg: 'bg-[#181818] border-[#E2C854]/40 text-[#E2C854]',
        };
      default:
        return null;
    }
  };

  const quickReplies = language === 'ar' ? [
    { text: 'أشعر بالضغط العصبي وضيق في التنفس 😰', raw: 'مضغوط وعندي ضيق تنفس وأحتاج لتهدئة أعصابي' },
    { text: 'عندي قلق مستمر وأفرط في التفكير 😟', raw: 'قلق ومشتت وأفرط في التفكير طول الوقت' },
    { text: 'أعاني من الأرق وأريد النوم بسلام 😴', raw: 'أواجه صعوبة في النوم وأحتاج لمساعدتي على الاسترخاء والنوم' },
    { text: 'طاقتي منخفضة وأريد التنشيط بجلسة يوغا ⚡', raw: 'أشعر بالخمول وضعف الطاقة وأحتاج جلسة يوغا تنشيطية' }
  ] : [
    { text: 'I am highly stressed and out of breath 😰', raw: 'I am extremely stressed and can\'t catch my breath, help me relax' },
    { text: 'Suffering from constant overthinking 😟', raw: 'I am overthinking too much and feeling anxious' },
    { text: 'Struggling to fall asleep tonight 😴', raw: 'I am having bad insomnia and can\'t sleep help me wind down' },
    { text: 'Low energy & need a yoga recharge ⚡', raw: 'I feel super lazy and low on energy, suggest a rejuvenating yoga or breath session' }
  ];

  const startRecommendedSession = (session: any) => {
    onSelectSession(session);
  };

  const startBreathingExercise = () => {
    onNavigate('meditation');
  };

  // Text Model States
  const [selectedFeeling, setSelectedFeeling] = useState<string>('stressed');
  const [selectedGoal, setSelectedGoal] = useState<string>('relax');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiData, setAIData] = useState<any>(null);
  const [generatedType, setGeneratedType] = useState<'quote' | 'exercise' | null>(null);

  // Audio Creator States
  const [audioCategory, setAudioCategory] = useState<string>('relaxation');
  const [selectedVoice, setSelectedVoice] = useState<string>('Kore');
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [generatedAudioData, setGeneratedAudioData] = useState<any>(null);

  // Live Voice Interactivity States
  const [isLiveVoiceMode, setIsLiveVoiceMode] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveQueryText, setLiveQueryText] = useState<string>('');

  // Audio Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLocalSynthMode, setIsLocalSynthMode] = useState<boolean>(false);

  // Audio and Speech Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<any>(null);

  // Lists definitions
  const feelings = [
    { id: 'stressed', label: t('feelingStressed'), icon: Frown, color: 'from-amber-500 to-orange-600', textAr: 'مضغوط / متوتر', textEn: 'Stressed' },
    { id: 'anxious', label: t('feelingAnxious'), icon: AlertCircle, color: 'from-yellow-400 to-amber-500', textAr: 'قلق', textEn: 'Anxious' },
    { id: 'tired', label: t('feelingTired'), icon: Hourglass, color: 'from-blue-400 to-indigo-500', textAr: 'متعب / مجهد', textEn: 'Tired' },
    { id: 'sad', label: t('feelingSad'), icon: Frown, color: 'from-purple-400 to-indigo-600', textAr: 'حزين', textEn: 'Sad' },
    { id: 'angry', label: t('feelingAngry'), icon: Flame, color: 'from-red-500 to-rose-600', textAr: 'غاضب', textEn: 'Angry' },
    { id: 'normal', label: t('feelingNormal'), icon: Smile, color: 'from-emerald-400 to-teal-600', textAr: 'عادي / مستقر', textEn: 'Normal' },
  ];

  const goals = [
    { id: 'relax', label: t('goalRelax'), icon: Compass, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40' },
    { id: 'energy', label: t('goalEnergy'), icon: Zap, color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900/40' },
    { id: 'focus', label: t('goalFocus'), icon: Brain, color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100 dark:border-blue-900/40' },
    { id: 'sleep', label: t('goalSleep'), icon: Moon, color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-100 dark:border-purple-900/40' },
  ];

  const audioCategories = [
    { id: 'focus', labelAr: 'التركيز الذهني', labelEn: 'Focus Concentration', icon: Brain, color: 'from-blue-500/10 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-200/40 dark:border-blue-900/30' },
    { id: 'relaxation', labelAr: 'الاسترخاء والهدوء', labelEn: 'Deep Relaxation', icon: Smile, color: 'from-emerald-500/10 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-900/30' },
    { id: 'sleep', labelAr: 'النوم المريح', labelEn: 'Sweet Sleep', icon: Moon, color: 'from-purple-500/10 to-indigo-600/20 text-purple-600 dark:text-purple-400 border-purple-200/40 dark:border-purple-900/30' },
    { id: 'stressRelief', labelAr: 'تقليل التوتر والعصبية', labelEn: 'Stress Reduction', icon: AlertCircle, color: 'from-amber-500/10 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30' },
    { id: 'breathing', labelAr: 'تمارين التنفس العميق', labelEn: 'Breathing Exercises', icon: Wind, color: 'from-sky-500/10 to-cyan-500/20 text-sky-600 dark:text-sky-450 border-sky-200/40 dark:border-sky-900/30' }
  ];

  const guides = [
    { id: 'Kore', nameAr: 'كوري (صوت نسائي دافئ)', nameEn: 'Kore (Calming Female)', descAr: 'نبرة صوت مهدئة تدعوك لراحة الفكر وحضور اللحظة', descEn: 'Delicate, slow cadence for deep presence' },
    { id: 'Zephyr', nameAr: 'زيفير (صوت ذكوري لطيف)', nameEn: 'Zephyr (Soothing Male)', descAr: 'صوت ذو موجة منتظمة يدق ناقوس السكينة والطمأنينة', descEn: 'Grounding rhythm for deep meditation' },
    { id: 'Puck', nameAr: 'باك (صوت ودي ومبهج)', nameEn: 'Puck (Friendly voice)', descAr: 'نبرة دافئة وودودة ومثالية لاستعادة النشاط والانتباه', descEn: 'Warm and comforting tone for daily restart' },
    { id: 'Fenrir', nameAr: 'فينرير (صوت عميق ورصين)', nameEn: 'Fenrir (Deep voice)', descAr: 'صوت رخيم وعميق يزيل ضجيج العقل ويمدك بالثقة', descEn: 'A resonant, deep anchor for absolute relaxation' }
  ];

  // Clean elements on unmount or tab switch
  useEffect(() => {
    return () => {
      cleanupPlayback();
    };
  }, []);

  const cleanupPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // React to generated audio object and attach event listeners
  useEffect(() => {
    if (generatedAudioData && generatedAudioData.audioBase64 && !isLocalSynthMode) {
      cleanupPlayback();

      const audioUrl = `data:${generatedAudioData.mimeType || 'audio/wav'};base64,${generatedAudioData.audioBase64}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 30);
      };
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      const handlePlaybackError = (err: any) => {
        console.warn("Audio playback source error, adapting via native local synth engine.", err);
        setIsLocalSynthMode(true);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handlePlaybackError);

      // Trigger duration if load occurs quickly
      if (audio.duration) {
        setDuration(audio.duration);
      }

      // Autoplay the voice-response instantly
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((playErr) => {
        console.warn("Autoplay was prevented by browser security rules until next user gesture.", playErr);
      });

      return () => {
        audio.pause();
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handlePlaybackError);
      };
    }
  }, [generatedAudioData, isLocalSynthMode]);

  // Handler for text generation
  const handleGenerateText = async (option: 'quote' | 'exercise') => {
    setLoading(true);
    setError(null);
    setAIData(null);
    setGeneratedType(option);

    try {
      const response = await fetch('/api/generate-wellness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          option,
          feeling: selectedFeeling,
          goal: selectedGoal,
          language,
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setAIData(resJson.data);
      } else {
        throw new Error(resJson.error || 'Failed to generate tailored advice');
      }
    } catch (err: any) {
      console.error(err);
      setError(language === 'ar' ? 'حدث خطأ أثناء تحميل محتوى الذكاء الاصطناعي. يرجى المحاولة لاحقاً.' : 'An error occurred while generating AI content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for AI Audio Content Generation
  const handleGenerateAudio = async () => {
    setAudioLoading(true);
    setAudioError(null);
    setGeneratedAudioData(null);
    cleanupPlayback();

    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: audioCategory,
          voice: selectedVoice,
          language
        })
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setGeneratedAudioData(resJson.data);
        // If server failed indeed to return audio bytes, toggle local reading voice automatically
        if (!resJson.data.audioBase64) {
          setIsLocalSynthMode(true);
        } else {
          setIsLocalSynthMode(false);
        }
      } else {
        throw new Error(resJson.error || 'Speech synthesis failed to launch');
      }
    } catch (err: any) {
      console.error("Audio generation service error:", err);
      setAudioError(
        language === 'ar' 
          ? 'تعذر الاتصال بالخادم الصوتي. اضغط للاعتماد الكلي على المعالج الصوتي المدمج بالهاتف.'
          : 'Could not connect to the cloud voice processor. Click to fall back to your native device synthesis engines.'
      );
    } finally {
      setAudioLoading(false);
    }
  };

  // Trigger Live Dual Voice-to-Voice Translate Chat
  const triggerLiveVoiceChat = async (userText: string) => {
    setAudioLoading(true);
    setAudioError(null);
    setGeneratedAudioData(null);
    cleanupPlayback();

    try {
      const response = await fetch('/api/voice-chat-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          voice: selectedVoice,
          language
        })
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setGeneratedAudioData({
          title: language === 'ar' ? 'جلسة مذكرات حية' : 'Live Dialogue Utterance',
          subTitle: language === 'ar' ? 'البث المباشر ثنائي اللغة' : 'Simultaneous live-translation stream',
          script: resJson.data.reply,
          translation: resJson.data.translation,
          audioBase64: resJson.data.audioBase64,
          mimeType: resJson.data.mimeType || 'audio/mp3'
        });
        setIsLocalSynthMode(!resJson.data.audioBase64);
      } else {
        throw new Error(resJson.error || 'Live communication failed');
      }
    } catch (err: any) {
      console.error("Live vocal chat failure:", err);
      setAudioError(language === 'ar' ? 'عفواً، لم نتمكن من الاتصال بـ Gemini Live. يرجى المحاولة ثانية.' : 'Could not reach Gemini Live Translate channels. Please speak again.');
    } finally {
      setAudioLoading(false);
    }
  };

  const startMicRecording = () => {
    if (isRecording) {
      stopMicRecording();
      return;
    }
    
    setIsRecording(true);
    setLiveQueryText('');
    cleanupPlayback();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ar' ? 'ar-EG' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setLiveQueryText(text);
          triggerLiveVoiceChat(text);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setAudioError(language === 'ar' 
            ? 'تم حظر صلاحية الميكروفون بواسطة المتصفح داخل الإطار المعاين. يرجى تفعيل السماح للميكروفون أو فتح التطبيق في علامة تبويب مستقلة لاستعمال المحادثة الصوتية الكاملة، وبإمكانك استخدام أزرار الفضفضة الفورية المجهزة بالأسفل فوراً!'
            : 'Microphone permission blocked by browser iframe constraints. Please click "Open in browser tab", grant mic permission, or instantly click any of our beautiful query shortcuts below to get an immersive session!');
        } else {
          setAudioError(language === 'ar' 
            ? `خطأ أثناء الاتصال الصوتي: ${event.error}` 
            : `Voice communication issue: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      (window as any).activeRecognition = recognition;
    } else {
      setTimeout(() => {
        const fallbackText = language === 'ar' 
          ? "أحتاج إلى بعض الهدوء والسكينة وتقليل التوتر العالي" 
          : "I need simple peace, deep focus and instant relief";
        setLiveQueryText(fallbackText);
        triggerLiveVoiceChat(fallbackText);
        setIsRecording(false);
      }, 2500);
    }
  };

  const stopMicRecording = () => {
    if ((window as any).activeRecognition) {
      try {
        ((window as any).activeRecognition as any).stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  // Playback Control Toggle
  const togglePlay = () => {
    if (!generatedAudioData) return;

    if (isLocalSynthMode) {
      // Browser SpeechSynthesis Implementation
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
        if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      } else {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setIsPlaying(true);
          startSynthTimer();
        } else {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(generatedAudioData.script);
          
          if (language === 'ar') {
            utterance.lang = 'ar-EG';
            const voices = window.speechSynthesis.getVoices();
            const arVoice = voices.find(v => v.lang.startsWith('ar'));
            if (arVoice) utterance.voice = arVoice;
          } else {
            utterance.lang = 'en-US';
          }
          
          utterance.rate = 0.8; // beautiful slow meditation pace

          utterance.onstart = () => {
            setIsPlaying(true);
            setCurrentTime(0);
            const words = generatedAudioData.script.split(/\s+/).length;
            const approxDuration = Math.max(15, Math.ceil(words * 0.95));
            setDuration(approxDuration);
            startSynthTimer(approxDuration);
          };

          utterance.onend = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (synthTimerRef.current) clearInterval(synthTimerRef.current);
          };

          utterance.onerror = () => {
            setIsPlaying(false);
            if (synthTimerRef.current) clearInterval(synthTimerRef.current);
          };

          window.speechSynthesis.speak(utterance);
        }
      }
    } else {
      // HTML5 Audios Base64 Implementation
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch((err) => {
            console.error("Playback error:", err);
            // fallback to local synth automatically
            setIsLocalSynthMode(true);
          });
        }
      }
    }
  };

  const startSynthTimer = (fixedDuration?: number) => {
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    const limit = fixedDuration || duration;
    synthTimerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= limit) {
          clearInterval(synthTimerRef.current);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Replay Session Audio
  const handleReplay = () => {
    cleanupPlayback();
    setTimeout(() => {
      togglePlay();
    }, 100);
  };

  // Format seconds to text
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col justify-between select-none animate-fade-in bg-[#121212] text-[#EDEDED] overflow-hidden">
      {/* Organized Top Header */}
      <header className="flex items-center justify-between mb-3.5 flex-shrink-0">
        <button 
          onClick={onBack} 
          className="p-2.5 rounded-2xl bg-[#181818] border border-[#262626] text-[#A3A3A3] hover:text-[#EDEDED] hover:border-[#E2C854]/40 transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4.5 h-4.5 rtl:-scale-x-100" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#E2C854]" />
            <h1 className="text-sm md:text-base font-bold text-[#EDEDED] tracking-tight">
              {language === 'ar' ? 'المرشد والمدرب الذكي' : 'Mindful AI Coach'}
            </h1>
          </div>
          <span className="text-[10px] text-[#A3A3A3] font-medium">
            {language === 'ar' ? 'تحليل الحالة، استشارات وتوجيه صوتي' : 'Mood analysis, guidance & voice'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#181818] px-3 py-1.5 rounded-full border border-[#262626]">
          <span className="w-2 h-2 rounded-full bg-[#E2C854] animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-[#E2C854] tracking-wider">AI</span>
        </div>
      </header>

      {/* Segmented Top Navigation Tabs */}
      <div className="grid grid-cols-3 bg-[#181818] p-1.5 rounded-2xl border border-[#262626] mb-3.5 gap-1 shadow-sm select-none flex-shrink-0">
        <button
          onClick={() => {
            cleanupPlayback();
            setActiveTab('chat');
          }}
          className={`py-2 px-1.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'chat' 
              ? 'bg-[#E2C854] text-[#121212] font-bold shadow-sm' 
              : 'text-[#A3A3A3] hover:text-[#EDEDED]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="truncate">{language === 'ar' ? 'محادثة فورية' : 'AI Chat'}</span>
        </button>
        
        <button
          onClick={() => {
            cleanupPlayback();
            setActiveTab('text');
          }}
          className={`py-2 px-1.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'text' 
              ? 'bg-[#E2C854] text-[#121212] font-bold shadow-sm' 
              : 'text-[#A3A3A3] hover:text-[#EDEDED]'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span className="truncate">{language === 'ar' ? 'استشارة واعية' : 'Advisor'}</span>
        </button>
        
        <button
          onClick={() => {
            cleanupPlayback();
            setActiveTab('audio');
          }}
          className={`py-2 px-1.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'audio' 
              ? 'bg-[#E2C854] text-[#121212] font-bold shadow-sm' 
              : 'text-[#A3A3A3] hover:text-[#EDEDED]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="truncate">{language === 'ar' ? 'جلسات صوتية' : 'AI Voice'}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ==================== TAB 1: AI MIND & MOOD CONVERSATIONAL CHAT ==================== */}
        {activeTab === 'chat' && (
          <motion.div
            key="chat-tab-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex-1 flex flex-col justify-between overflow-hidden pb-20"
          >
            {/* Detected Mood Indicator Header */}
            {currentMood && (
              <div className="mb-2.5 flex-shrink-0">
                <div className="flex items-center justify-between p-3 rounded-2xl border bg-[#181818] border-[#262626] shadow-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#E2C854] animate-pulse" />
                    <span className="text-xs font-bold text-[#A3A3A3]">
                      {language === 'ar' ? 'الحالة المزاجية الحالية:' : 'Current Mood State:'}
                    </span>
                  </div>
                  {getMoodConfig(currentMood) && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide ${getMoodConfig(currentMood)?.bg}`}>
                      {language === 'ar' ? getMoodConfig(currentMood)?.labelAr : getMoodConfig(currentMood)?.labelEn}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Messages Log Panel */}
            <div className="flex-1 overflow-y-auto mb-3 pr-1 space-y-3.5 border border-[#262626] p-3.5 rounded-3xl bg-[#181818]/60">
              {messages.map((m) => {
                const isAssistant = m.role === 'assistant';
                const moodData = m.detectedMood ? getMoodConfig(m.detectedMood) : null;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[92%] p-3.5 rounded-3xl text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-[#181818] border border-[#262626] text-[#EDEDED] shadow-sm'
                          : 'bg-[#E2C854] text-[#121212] font-bold shadow-sm'
                      }`}
                    >
                      {/* Optional Assistant Mood Badge inside message bubble */}
                      {isAssistant && moodData && (
                        <div className="mb-2 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-[#E2C854] uppercase tracking-wider">{language === 'ar' ? 'تشخيص المزاج:' : 'MOOD DETECTED:'}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${moodData.bg}`}>
                            {language === 'ar' ? moodData.labelAr : moodData.labelEn}
                          </span>
                        </div>
                      )}

                      <p className="whitespace-pre-line text-xs md:text-sm font-semibold">
                        {m.content}
                      </p>

                      {/* Interactive Session recommendation execution triggers */}
                      {isAssistant && m.recommendedSessions && m.recommendedSessions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#262626] space-y-2">
                          <p className="text-[11px] font-bold text-[#E2C854] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#E2C854] animate-spin" style={{ animationDuration: '4s' }} />
                            <span>
                              {language === 'ar' 
                                ? 'جلسات موصى بها لك مباشرة:' 
                                : 'Recommended Sessions (Click to Play):'}
                            </span>
                          </p>

                          {m.recommendedSessions.map((session: any) => (
                            <button
                              key={session.id}
                              onClick={() => startRecommendedSession(session)}
                              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#121212] border border-[#262626] hover:border-[#E2C854]/40 text-[#EDEDED] transition-all cursor-pointer text-left rtl:text-right group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#E2C854]" />
                                <div className="text-left rtl:text-right">
                                  <p className="text-xs font-bold text-[#EDEDED]">
                                    {language === 'ar' ? session.title : session.title_en}
                                  </p>
                                  <p className="text-[10px] text-[#A3A3A3] font-medium mt-0.5">
                                    {session.duration} {t('minutes')} • {t(session.category || 'relaxation')}
                                  </p>
                                </div>
                              </div>
                              <span className="px-3 py-1.5 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-xl text-[10px] font-bold group-hover:scale-105 transition-all">
                                {language === 'ar' ? 'ابدأ كلياً ➔' : 'Start ➔'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Deep physical breathing exercise trigger */}
                      {isAssistant && m.shouldTriggerBreathing && (
                        <div className="mt-3 pt-3 border-t border-[#262626]">
                          <button
                            onClick={startBreathingExercise}
                            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#121212] border border-[#262626] hover:border-[#E2C854]/40 text-[#EDEDED] transition-all cursor-pointer text-left rtl:text-right group"
                          >
                            <div className="flex items-center gap-2.5">
                              <Wind className="w-4 h-4 text-[#E2C854] animate-pulse" />
                              <div className="text-left rtl:text-right">
                                <p className="text-xs font-bold text-[#EDEDED]">
                                  {language === 'ar' ? 'تمرين الرئة والجهاز العصبي' : 'Breathing Balance Cycle'}
                                </p>
                                <p className="text-[10px] text-[#A3A3A3] font-medium mt-0.5">
                                  {language === 'ar' ? 'معدلات تنفس منخفضة لضبط نبض القلب' : 'Calm pacing to restore composure'}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1.5 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-xl text-[10px] font-bold group-hover:scale-105 transition-all">
                              {language === 'ar' ? 'ابدأ الرئة ➔' : 'Start ➔'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Chat Loading bubble */}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="p-3.5 rounded-2xl bg-[#181818] border border-[#262626] text-[#A3A3A3] flex items-center gap-2.5 max-w-[85%] shadow-sm">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E2C854] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E2C854]"></span>
                    </span>
                    <span className="text-xs font-bold leading-none animate-pulse text-[#EDEDED]">
                      {language === 'ar' ? 'مستشارك يحلل كلامك ويجهز التوصيات...' : 'Analyzing conversation & setting custom actions...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies suggestion panel */}
            {messages.length === 1 && !chatLoading && (
              <div className="mb-3 px-0.5 flex-shrink-0">
                <span className="text-[10px] font-bold text-[#E2C854] uppercase tracking-wider block mb-2">
                  {language === 'ar' ? 'انقر للبدء الفوري والحصول على تمرين مخصص لشدتك:' : 'Click to instantly declare your emotional state:'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChatMessage(reply.raw)}
                      className="p-2.5 text-left rtl:text-right rounded-2xl bg-[#181818] border border-[#262626] hover:border-[#E2C854]/60 text-xs text-[#EDEDED] font-semibold cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat form Input Panel */}
            <div className="border border-[#262626] p-1.5 rounded-2xl bg-[#181818] flex items-center gap-2 shadow-sm flex-shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                disabled={chatLoading}
                placeholder={
                  language === 'ar' 
                    ? 'صف حالتك النفسية أو العاطفية هنا بالتفصيل...' 
                    : 'Describe your current emotional or physical state here...'
                }
                className="flex-1 px-3 py-2 text-xs md:text-sm bg-transparent border-0 outline-none text-[#EDEDED] placeholder-[#737373] font-semibold"
              />
              <button
                onClick={() => handleSendChatMessage()}
                disabled={chatLoading || !chatInput.trim()}
                className={`p-2.5 rounded-xl transition ${
                  chatInput.trim() && !chatLoading 
                    ? 'bg-[#E2C854] text-[#121212] cursor-pointer hover:bg-[#ebd775] active:scale-95 font-bold' 
                    : 'bg-[#262626] text-[#737373] cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================== TAB 2: TEXT ADVISOR CONFIGURATION ==================== */}
        {activeTab === 'text' && !loading && !aiData && (
          <motion.div
            key="text-config"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex flex-col justify-between overflow-hidden pb-20"
          >
            <div className="flex-1 overflow-y-auto pr-0.5 space-y-4 mb-3">
              {/* Header Title */}
              <div className="text-center mb-1">
                <h2 className="text-base md:text-lg font-bold text-[#EDEDED] mb-1">
                  {language === 'ar' ? 'المرشد السلوكي والواعي' : 'Mindful Behavioral Advisor'}
                </h2>
                <p className="text-xs text-[#A3A3A3] px-2 leading-relaxed">
                  {language === 'ar' 
                    ? 'حدد حالتك الشعورية وهدفك لنبتكر لك توجيهاً وتدريباً مخصصاً' 
                    : 'Choose your feeling and focus to craft a personalized mindfulness exercise'}
                </p>
              </div>

              {/* Feelings Selector */}
              <div className="bg-[#181818] border border-[#262626] p-4 rounded-3xl">
                <h3 className="text-xs font-bold text-[#A3A3A3] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <Smile className="w-3.5 h-3.5 text-[#E2C854]" />
                  <span>{language === 'ar' ? '١. بماذا تشعر في هذه اللحظة؟' : '1. What are you feeling right now?'}</span>
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {feelings.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = selectedFeeling === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedFeeling(item.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left rtl:text-right transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'bg-[#121212] border-[#E2C854] shadow-sm ring-1 ring-[#E2C854]/40' 
                            : 'bg-[#121212]/60 hover:bg-[#121212] border-[#262626]'
                        }`}
                      >
                        <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-[#E2C854] text-[#121212]' : 'bg-[#262626] text-[#E2C854]'}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-[#EDEDED]' : 'text-[#A3A3A3]'}`}>
                          {language === 'ar' ? item.textAr : item.textEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal Selector */}
              <div className="bg-[#181818] border border-[#262626] p-4 rounded-3xl">
                <h3 className="text-xs font-bold text-[#A3A3A3] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#E2C854]" />
                  <span>{language === 'ar' ? '٢. ما هو الهدف الذي ترغب في تحقيقه؟' : '2. What outcome do you seek?'}</span>
                </h3>
                <div className="space-y-2">
                  {goals.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = selectedGoal === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedGoal(item.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#121212] border-[#E2C854] ring-1 ring-[#E2C854]/40 text-[#EDEDED]'
                            : 'bg-[#121212]/60 hover:bg-[#121212] border-[#262626] text-[#A3A3A3]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-[#E2C854] text-[#121212]' : 'bg-[#262626] text-[#E2C854]'}`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold">{item.label}</span>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#E2C854]' : 'border-[#262626]'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#E2C854]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-400 text-center bg-rose-950/20 p-2.5 rounded-xl border border-rose-900/40 font-bold">
                  {error}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2 flex-shrink-0">
              <button
                onClick={() => handleGenerateText('exercise')}
                className="w-full py-3.5 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-2xl text-xs md:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'ابتكار تمرين مخصص للحالة' : 'Craft Personalized Exercise'}</span>
              </button>

              <button
                onClick={() => handleGenerateText('quote')}
                className="w-full py-3 bg-[#181818] border border-[#262626] text-[#EDEDED] hover:border-[#E2C854]/50 rounded-2xl text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>{language === 'ar' ? 'طلب حكمة وتوجيه معرفي' : 'Request Mindful Wisdom'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================== TAB 3: AI AUDIO & VOICE GENERATOR ==================== */}
        {activeTab === 'audio' && !audioLoading && !generatedAudioData && (
          <motion.div
            key="audio-config"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex flex-col justify-between overflow-hidden pb-20"
          >
            {/* Seamless Segmented Mode Switcher */}
            <div className="flex bg-[#181818] p-1.5 rounded-2xl mb-3.5 border border-[#262626] flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  cleanupPlayback();
                  setIsLiveVoiceMode(true);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  isLiveVoiceMode 
                    ? 'bg-[#E2C854] text-[#121212] font-bold shadow-sm' 
                    : 'text-[#A3A3A3] hover:text-[#EDEDED]'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isLiveVoiceMode ? 'animate-pulse text-[#121212]' : ''}`} />
                <span>{language === 'ar' ? 'محادثة صوتية مباشرة' : 'Live Voice Chat'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  cleanupPlayback();
                  setIsLiveVoiceMode(false);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  !isLiveVoiceMode 
                    ? 'bg-[#E2C854] text-[#121212] font-bold shadow-sm' 
                    : 'text-[#A3A3A3] hover:text-[#EDEDED]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'صانع جلسات التأمل' : 'Custom Meditations'}</span>
              </button>
            </div>

            {/* SUB-VIEW 1: LIVE VOICE CHAT DIRECT DIALOGUE */}
            {isLiveVoiceMode ? (
              <div className="flex-1 overflow-y-auto pr-0.5 space-y-4">
                {/* Voice Status Indicator */}
                <div className="bg-[#181818] border border-[#262626] rounded-2xl p-3.5 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E2C854]/10 border border-[#E2C854]/25 text-[10px] font-mono font-bold text-[#E2C854] tracking-wider uppercase mb-1.5 animate-pulse">
                    🟢 Gemini 3.5 Live & 3.1 TTS
                  </span>
                  <p className="text-xs font-bold text-[#EDEDED] leading-relaxed">
                    {isRecording 
                      ? (language === 'ar' ? 'استمع إليك الآن... واصل التحدث بكل راحة' : 'Listening to you... speak freely with an open heart')
                      : (language === 'ar' ? 'اضغط على الميكروفون وابدأ بالحديث الصوتي فوراً' : 'Tap the microphone below to begin instant vocal dialog')}
                  </p>
                </div>

                {/* Main Interactive Pulsing Record Trigger */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Ring 1 */}
                    <motion.div
                      animate={isRecording ? {
                        scale: [1, 1.45, 1],
                        opacity: [0.15, 0.45, 0.15]
                      } : { scale: 1, opacity: 0.1 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-[#E2C854]/20 rounded-full blur-xl"
                    />

                    {/* Ring 2 */}
                    <motion.div
                      animate={isRecording ? {
                        scale: [1, 1.25, 1],
                        opacity: [0.2, 0.6, 0.2]
                      } : { scale: 1, opacity: 0.15 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                      className="absolute w-28 h-28 bg-[#E2C854]/10 rounded-full"
                    />

                    {/* Central Recording Core Button */}
                    <button
                      type="button"
                      onClick={startMicRecording}
                      className={`relative w-22 h-22 rounded-full shadow-2xl flex flex-col items-center justify-center border-4 border-[#121212] transition-all duration-300 cursor-pointer active:scale-95 ${
                        isRecording 
                          ? 'bg-rose-600 ring-4 ring-rose-500/30 text-white' 
                          : 'bg-[#E2C854] text-[#121212] ring-4 ring-[#E2C854]/20'
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="w-7 h-7 animate-bounce" />
                      ) : (
                        <Mic className="w-7 h-7" />
                      )}
                      <span className="text-[8px] font-bold uppercase tracking-wider mt-1">
                        {isRecording ? 'STOP' : 'SPEAK'}
                      </span>
                    </button>
                  </div>

                  {/* Pulsing Mic Equalizer */}
                  {isRecording && (
                    <div className="flex items-center gap-1 h-4 mt-3">
                      {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                        <motion.div
                          key={bar}
                          animate={{ height: [4, Math.random() * 16 + 5, 4] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: bar * 0.08 }}
                          className="w-1 bg-[#E2C854] rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Instant Tap Option Shortcuts */}
                <div className="bg-[#181818] border border-[#262626] p-4 rounded-3xl">
                  <h3 className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E2C854]" />
                    <span>{language === 'ar' ? 'أو اختر موضوعاً للمحادثة بنقرة واحدة:' : 'Or tap a conversation shortcut:'}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { 
                        labelAr: 'أريد التخلص من القلق الفوري 🧘', 
                        labelEn: 'Instant Relief from High Anxiety 🧘',
                        raw: language === 'ar' ? 'أشعر ببعض الضغط والتوتر وأريد السكينة والهدوء الفوري' : 'I feel overwhelmed and need calm comfort immediately'
                      },
                      { 
                        labelAr: 'أشعر بالتشتت وأرغب بالتركيز والوضوح 🧠', 
                        labelEn: 'Boost Focus & Mental Clarity 🧠',
                        raw: language === 'ar' ? 'أحتاج للتركيز وتصفية ذهني تماماً للعمل بنشاط' : 'Help me filter out distractions and find clear presence'
                      },
                      { 
                        labelAr: 'أعاني من صعوبة في النوم وأفكار متسارعة 😴', 
                        labelEn: 'Struggling with overthinking, wind down 😴',
                        raw: language === 'ar' ? 'عقلي لا يتوقف عن التفكير وأحتاج للنوم المريح الآن' : 'Help me quiet down my thoughts and fall asleep gracefully'
                      },
                      { 
                        labelAr: 'تمارين النفس العميق السريع لاستعادة الطاقة ⚡', 
                        labelEn: 'Deep Breathing to Restore High Energy ⚡',
                        raw: language === 'ar' ? 'أشعر بخمول شديد وأحتاج لجلسة تنفس تزيد طاقتي' : 'Guide me through refreshing oxygen flows to fuel my engine'
                      }
                    ].map((shortcut, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setLiveQueryText(language === 'ar' ? shortcut.labelAr : shortcut.labelEn);
                          triggerLiveVoiceChat(shortcut.raw);
                        }}
                        className="bg-[#121212] hover:bg-[#121212] border border-[#262626] hover:border-[#E2C854]/40 text-left rtl:text-right p-3 rounded-2xl transition text-xs font-semibold text-[#EDEDED] cursor-pointer flex justify-between items-center"
                      >
                        <span>{language === 'ar' ? shortcut.labelAr : shortcut.labelEn}</span>
                        <Sparkles className="w-3.5 h-3.5 text-[#E2C854]" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice guide config */}
                <div className="bg-[#181818] border border-[#262626] p-4 rounded-3xl">
                  <h3 className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#E2C854]" />
                    <span>{language === 'ar' ? 'نبرة صوت المرشد المفضل لـ Gemini:' : 'Select Gemini Live Vocal Profile:'}</span>
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {guides.map((g) => {
                      const isSelected = selectedVoice === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => setSelectedVoice(g.id)}
                          className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                            isSelected 
                              ? 'bg-[#E2C854] border-[#E2C854] text-[#121212] font-bold shadow-sm'
                              : 'bg-[#121212] border-[#262626] text-[#A3A3A3] text-xs'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase font-bold tracking-tight">{g.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* SUB-VIEW 2: STANDARD AUDIO CUSTOM MEDITATION CREATOR */
              <div className="flex-1 overflow-y-auto pr-0.5 space-y-4">
                {/* Audio Theme Option Selection */}
                <div className="bg-[#181818] border border-[#262626] p-4 rounded-3xl">
                  <h3 className="text-xs font-bold text-[#A3A3A3] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <Headphones className="w-3.5 h-3.5 text-[#E2C854]" />
                    <span>{language === 'ar' ? '١. اختر المجال الصوتي المطلوب:' : '1. Choose Sound & Mindfulness Domain:'}</span>
                  </h3>

                  <div className="space-y-2">
                    {audioCategories.map((cat) => {
                      const IconComp = cat.icon;
                      const isSelected = audioCategory === cat.id;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => setAudioCategory(cat.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'bg-[#121212] border-[#E2C854] text-[#EDEDED] ring-1 ring-[#E2C854]/40 font-bold' 
                              : 'bg-[#121212]/60 hover:bg-[#121212] border-[#262626] text-[#A3A3A3]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#E2C854] text-[#121212]' : 'bg-[#262626] text-[#E2C854]'}`}>
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold">
                              {language === 'ar' ? cat.labelAr : cat.labelEn}
                            </span>
                          </div>
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#E2C854]' : 'border-[#262626]'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#E2C854]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Vocal Guide Selector */}
                <div className="bg-[#181818] border border-[#262626] p-4 rounded-3xl">
                  <h3 className="text-xs font-bold text-[#A3A3A3] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <Volume2 className="w-3.5 h-3.5 text-[#E2C854]" />
                    <span>{language === 'ar' ? '٢. اختر صوت المرشد المفضل:' : '2. Select Guiding Voice:'}</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    {guides.map((g) => {
                      const isSelected = selectedVoice === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => setSelectedVoice(g.id)}
                          className={`text-left rtl:text-right p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#121212] border-[#E2C854] text-[#EDEDED] font-bold ring-1 ring-[#E2C854]/40'
                              : 'bg-[#121212]/60 hover:bg-[#121212] border-[#262626] text-[#A3A3A3]'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full mb-1">
                            <span className="text-[10px] font-mono font-bold text-[#E2C854] uppercase">
                              {g.id}
                            </span>
                            <div className={`p-1 rounded-full ${isSelected ? 'bg-[#E2C854] text-[#121212]' : 'bg-[#262626] text-[#A3A3A3]'}`}>
                              <Volume2 className="w-3 h-3" />
                            </div>
                          </div>
                          <p className="text-xs font-bold text-[#EDEDED] mb-0.5">
                            {language === 'ar' ? g.nameAr : g.nameEn}
                          </p>
                          <p className="text-[9px] text-[#A3A3A3] leading-normal font-medium">
                            {language === 'ar' ? g.descAr : g.descEn}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Launch audio generation button */}
                <div className="pt-1">
                  <button
                    onClick={handleGenerateAudio}
                    className="w-full py-3.5 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-2xl text-xs md:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>
                      {language === 'ar' ? 'ابتكار وتوليد الجلسة الصوتية' : 'Synthesize Custom Audio Session'}
                    </span>
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Error Notifications & Device Fallbacks */}
            {audioError && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#181818] border border-amber-500/30 text-center flex flex-col gap-2 flex-shrink-0">
                <p className="text-xs font-bold text-amber-400">
                  {audioError}
                </p>
                <button 
                  onClick={() => {
                    setAudioError(null);
                    setIsLocalSynthMode(true);
                    setGeneratedAudioData({
                      title: language === 'ar' ? 'جلسة تنفس محلية' : 'Local Breathing Guidance',
                      subTitle: language === 'ar' ? 'معالج السكينة الداخلي' : 'Soothing Native Engine',
                      script: language === 'ar' 
                        ? 'تنفس بعمق الآن. خذ شهيقاً عميقاً يملأ وجدانك، ثم احبس نفسك قليلاً، واطرد كل التوتر والشد العصبي مع زفير بطيء وهادئ.' 
                        : 'Breathe deep now. Inhale quiet energy, pause for a moment of quiet reflection, and slowly release all tension with a smooth, warming exhale.',
                      translation: language === 'ar'
                        ? 'Breathe deep now. Inhale calm, exhale all tension.'
                        : 'تنفس بعمق الآن وهدئ جوارحك وبث الطمأنينة.'
                    });
                  }}
                  className="mx-auto px-4 py-1.5 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  {language === 'ar' ? 'استخدام المشغل الصوتي البديل' : 'Use Native Player Fallback'}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ==================== ACTIVE GENERATION LOADING VIEWS ==================== */}
        {(loading || audioLoading) && (
          <motion.div
            key="general-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-6 pb-20"
          >
            {/* Pulsing Breathing Sphere */}
            <div className="relative flex items-center justify-center mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.45, 1],
                  opacity: [0.15, 0.4, 0.15],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-40 h-40 bg-[#E2C854]/20 rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-24 h-24 bg-[#E2C854] text-[#121212] rounded-full shadow-2xl flex items-center justify-center border-4 border-[#121212]"
              >
                <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '5s' }} />
              </motion.div>
            </div>

            <h3 className="text-base md:text-lg font-bold text-[#EDEDED] mb-2">
              {language === 'ar' ? 'الذكاء الاصطناعي يبني جلستك...' : 'Creating your calm space...'}
            </h3>
            <p className="text-xs text-[#A3A3A3] max-w-xs leading-relaxed font-semibold">
              {audioLoading 
                ? (language === 'ar' ? 'جاري تحرير الجمل الصوتية ودمجها مع النبرة المناسبة لمرشدك...' : 'Formulating the perfect peaceful meditation text and syncing vocals...')
                : t('loadingAI')
              }
            </p>
          </motion.div>
        )}

        {/* ==================== DISPLAY TEXT COACH RESPONSE ==================== */}
        {!loading && aiData && activeTab === 'text' && (
          <motion.div
            key="text-result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex flex-col justify-between overflow-hidden pb-20"
          >
            <div className="flex-1 overflow-y-auto pr-0.5 space-y-4 mb-3">
              <div className="bg-[#181818] border border-[#262626] p-5 rounded-3xl relative overflow-hidden text-[#EDEDED]">
                <div className="absolute top-0 right-0 ltr:right-0 rtl:left-0 p-3 bg-[#E2C854]/10 text-[#E2C854] rounded-bl-3xl">
                  <Sparkles className="w-4 h-4" />
                </div>

                <span className="text-[10px] font-mono font-bold tracking-wider text-[#E2C854] uppercase block mb-1">
                  {generatedType === 'exercise' ? t('aiResponseTitle') : t('aiQuoteTitle')}
                </span>
                <h2 className="text-lg font-bold text-[#EDEDED] mb-3 pr-6 ltr:pr-6 rtl:pl-6 leading-tight">
                  {aiData.title}
                </h2>

                <p className="text-xs md:text-sm text-[#A3A3A3] leading-relaxed mb-5">
                  {aiData.content}
                </p>

                {/* Steps Component */}
                {aiData.steps && aiData.steps.length > 0 && (
                  <div className="border-t border-[#262626] pt-4 mb-4">
                    <h4 className="text-xs font-bold text-[#EDEDED] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-[#E2C854]" />
                      <span>{t('stepsToFollow')}</span>
                    </h4>
                    <div className="space-y-3">
                      {aiData.steps.map((step: string, index: number) => (
                        <div key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-5 h-5 bg-[#E2C854] text-[#121212] rounded-full flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <p className="text-xs md:text-sm text-[#EDEDED] leading-normal font-medium">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Quote Card */}
                {aiData.tip && (
                  <div className="p-3.5 rounded-2xl bg-[#121212] border border-[#262626] text-center">
                    <p className="text-[10px] font-mono font-bold text-[#E2C854] uppercase tracking-wider mb-1">
                      {t('coachTip')}
                    </p>
                    <p className="text-xs font-semibold text-[#EDEDED] italic leading-relaxed">
                      "{aiData.tip}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 flex-shrink-0">
              <button
                onClick={() => handleGenerateText(generatedType || 'exercise')}
                className="w-full py-3.5 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-2xl font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('tryAnother')}</span>
              </button>

              <button
                onClick={() => {
                  setAIData(null);
                  setGeneratedType(null);
                }}
                className="w-full py-2.5 bg-[#181818] border border-[#262626] text-[#EDEDED] hover:border-[#E2C854]/50 rounded-2xl text-xs font-semibold transition cursor-pointer active:scale-95"
              >
                {t('back')}
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================== GUIDED AUDIO SESSION PLAYER ==================== */}
        {generatedAudioData && activeTab === 'audio' && (
          <motion.div
            key="audio-player-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex flex-col justify-between overflow-hidden pb-20"
          >
            <div className="flex-1 overflow-y-auto pr-0.5 space-y-4 mb-3">
              {/* Main Player Display Card */}
              <div className="bg-[#181818] rounded-3xl border border-[#262626] p-5 shadow-2xl relative overflow-hidden text-center text-[#EDEDED] flex flex-col justify-between">
                <div className="flex justify-between items-center pb-3 border-b border-[#262626]">
                  <div className="flex items-center gap-1.5">
                    <Headphones className="w-4 h-4 text-[#E2C854] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-wider text-[#E2C854] uppercase">
                      {isLocalSynthMode ? 'GEMINI LIVE TRANSLATE PREVIEW' : 'GEMINI LIVE VOICE'}
                    </span>
                  </div>
                  
                  {/* Mode Selector Tag */}
                  <button
                    type="button"
                    onClick={() => {
                      cleanupPlayback();
                      setIsLocalSynthMode(!isLocalSynthMode);
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#121212] text-[9px] font-bold border border-[#262626] hover:border-[#E2C854]/40 text-[#A3A3A3] hover:text-[#EDEDED] transition cursor-pointer"
                  >
                    {isLocalSynthMode ? 'HD Voice' : 'Local Synth'}
                  </button>
                </div>

                {/* Pulsing visual breathing anchor */}
                <div className="flex flex-col items-center justify-center my-6">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Outer Ring */}
                    <motion.div
                      animate={isPlaying ? {
                        scale: [1, 1.4, 1],
                        opacity: [0.1, 0.4, 0.1]
                      } : { scale: 1, opacity: 0.1 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-[#E2C854]/20 rounded-full blur-xl"
                    />

                    {/* Mid Ring */}
                    <motion.div
                      animate={isPlaying ? {
                        scale: [1, 1.25, 1],
                        opacity: [0.15, 0.35, 0.15]
                      } : { scale: 1, opacity: 0.15 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute w-24 h-24 bg-[#E2C854]/10 rounded-full"
                    />

                    {/* Central Play/Pause Trigger */}
                    <motion.div
                      animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-20 h-20 bg-[#E2C854] text-[#121212] rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-[#121212] cursor-pointer"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="w-7 h-7 fill-current animate-pulse" />
                      ) : (
                        <Play className="w-7 h-7 fill-current ml-0.5" />
                      )}
                    </motion.div>
                  </div>

                  {/* Equalizer bars */}
                  <div className="flex items-center gap-1.5 h-5 mt-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
                      <motion.div
                        key={bar}
                        animate={isPlaying ? {
                          height: [4, Math.random() * 16 + 5, 4]
                        } : { height: 4 }}
                        transition={{
                          duration: 0.7 + bar * 0.08,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-1 bg-[#E2C854] rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* Title & metadata */}
                <div className="mb-3">
                  <h3 className="text-sm md:text-base font-bold text-[#EDEDED] leading-snug">
                    {generatedAudioData.title}
                  </h3>
                  <p className="text-[11px] text-[#A3A3A3] mt-0.5 font-medium">
                    {generatedAudioData.subTitle || 'Custom guided mindfulness session'}
                  </p>
                </div>

                {/* Media Progress Controls */}
                <div className="space-y-2 px-1">
                  <div className="flex items-center justify-between text-[10px] text-[#A3A3A3] font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  {/* Progress bar slider timeline */}
                  <div 
                    className="w-full bg-[#121212] border border-[#262626] h-2 rounded-full overflow-hidden cursor-pointer relative"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percent = clickX / rect.width;
                      const nextTime = percent * duration;
                      
                      if (!isLocalSynthMode && audioRef.current) {
                        audioRef.current.currentTime = nextTime;
                        setCurrentTime(nextTime);
                      } else {
                        setCurrentTime(Math.floor(nextTime));
                      }
                    }}
                  >
                    <div 
                      className="bg-[#E2C854] h-full transition-all duration-150"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Play controls cluster */}
                  <div className="flex items-center justify-center gap-5 pt-2">
                    <button
                      onClick={handleReplay}
                      className="p-2 text-[#A3A3A3] hover:text-[#EDEDED] hover:bg-[#121212] rounded-full transition-all"
                      title="Restart Audio"
                    >
                      <RotateCcw className="w-4.5 h-4.5" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="p-3 bg-[#E2C854] text-[#121212] hover:bg-[#ebd775] rounded-full transition-all active:scale-95 flex items-center justify-center shadow-lg font-bold"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    <button
                      onClick={() => {
                        if (!isLocalSynthMode && audioRef.current) {
                          audioRef.current.muted = !audioRef.current.muted;
                          setCurrentTime(audioRef.current.currentTime);
                        }
                      }}
                      className="p-2 text-[#A3A3A3] hover:text-[#EDEDED] hover:bg-[#121212] rounded-full transition-all"
                    >
                      <Volume2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Transcription & Translation Card */}
              <div className="bg-[#181818] rounded-3xl border border-[#262626] p-4 text-left rtl:text-right text-[#EDEDED]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#262626]">
                  <span className="text-[10px] font-bold text-[#E2C854] tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-[#E2C854]" style={{ animationDuration: '3s' }} />
                    <span>Gemini 3.5 Live Translate</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E2C854]/10 text-[#E2C854] text-[9px] font-bold border border-[#E2C854]/20">
                    {language === 'ar' ? 'ترجمة متزامنة' : 'Simultaneous Translate'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Channel 1 */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#A3A3A3] uppercase tracking-wider block">
                      {language === 'ar' ? '🔊 الصوت المنطوق (العربية)' : '🔊 Spoken Audio (English)'}
                    </span>
                    <p className="text-xs text-[#EDEDED] italic leading-relaxed font-semibold">
                      "{generatedAudioData.script}"
                    </p>
                  </div>

                  {/* Channel 2 */}
                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#262626] pt-2 md:pt-0 md:pl-3">
                    <span className="text-[9px] font-bold text-[#E2C854] uppercase tracking-wider block">
                      {language === 'ar' ? '🌐 الترجمة المتزامنة (English)' : '🌐 Live Translation (العربية)'}
                    </span>
                    <p className="text-xs text-[#A3A3A3] italic leading-relaxed font-medium">
                      "{generatedAudioData.translation || (language === 'ar' ? 'Mindfulness breathing in deep sync.' : 'هدوء تام وحضور واعي بمستويات التنفس الطبيعي.')}"
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-[#262626] flex justify-between items-center text-[10px] text-[#A3A3A3]">
                  <span className="font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E2C854]" />
                    <span>{language === 'ar' ? 'المدة:' : 'Duration:'} {formatTime(duration)}</span>
                  </span>
                  <span className="text-[#E2C854] font-semibold">
                    {language === 'ar' ? '✦ ذكاء صناعي متكامل' : '✦ High-fidelity translate'}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2 flex-shrink-0">
              <button
                onClick={handleGenerateAudio}
                className="w-full py-3.5 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-2xl text-xs md:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'توليد جلسة صوتية جديدة' : 'Generate Another Audio Session'}</span>
              </button>

              <button
                onClick={() => {
                  cleanupPlayback();
                  setGeneratedAudioData(null);
                }}
                className="w-full py-2.5 bg-[#181818] border border-[#262626] text-[#EDEDED] hover:border-[#E2C854]/50 rounded-2xl text-xs font-semibold transition cursor-pointer active:scale-95"
              >
                {t('back')}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
