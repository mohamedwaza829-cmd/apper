import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { BreathingScreen } from './components/BreathingScreen';
import { LongevityScreen } from './components/LongevityScreen';
import { AICoachScreen } from './components/AICoachScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { PlayerScreen } from './components/PlayerScreen';
import { AuraBottomNav } from './components/AuraBottomNav';
import { meditations, yogaSessions, badges as initialBadges } from './data/sessions';
import { SessionItem, BreathingPhase, AuraMetrics, UserProgress, AICoachMessage } from './types';
import { GoogleGenAI } from '@google/genai';

export function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isArabic, setIsArabic] = useState(true);

  // Active Session & Player State
  const [activeSession, setActiveSession] = useState<SessionItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Metrics & Progress State
  const [metrics] = useState<AuraMetrics>({
    heartRate: 64,
    metabolicAge: 27,
    auraAge: 26,
    chronologicalAge: 30,
    paceOfAging: 0.88,
    zone: 'Optimal Longevity',
    lastSync: 'Just now',
    status: 'connected'
  });

  const [progress, setProgress] = useState<UserProgress>({
    streak: 5,
    sessionsCompleted: 12,
    minutesMeditated: 145,
    breathingCyclesCompleted: 38,
    weeklyActivity: [20, 15, 30, 0, 25, 40, 15]
  });

  // Resonant Breathing State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [currentBreathingPhase, setCurrentBreathingPhase] = useState<BreathingPhase>('INHALE');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // AI Coach Chat State
  const [aiMessages, setAiMessages] = useState<AICoachMessage[]>([
    {
      id: 'm0',
      isUser: false,
      text: 'أهلاً بك! أنا مرشدك الصحي بالذكاء الاصطناعي. كيف تشعر اليوم وما هي أهدافك للسكينة والحيوية؟',
      timestamp: Date.now()
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Breathing timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setPhaseSecondsLeft((prevSec) => {
          if (prevSec > 1) {
            return prevSec - 1;
          } else {
            // Transition phase
            setCurrentBreathingPhase((phase) => {
              if (phase === 'INHALE') return 'HOLD';
              if (phase === 'HOLD') return 'EXHALE';
              // EXHALE -> INHALE
              setCompletedCycles((c) => c + 1);
              setProgress((p) => ({
                ...p,
                breathingCyclesCompleted: p.breathingCyclesCompleted + 1
              }));
              return 'INHALE';
            });
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  // Audio Playback progress timer simulation
  useEffect(() => {
    let playTimer: NodeJS.Timeout;
    if (isPlaying && activeSession) {
      playTimer = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            setProgress((p) => ({
              ...p,
              sessionsCompleted: p.sessionsCompleted + 1,
              minutesMeditated: p.minutesMeditated + activeSession.durationMinutes
            }));
            return 0;
          }
          return prev + 0.005;
        });
      }, 500);
    }
    return () => clearInterval(playTimer);
  }, [isPlaying, activeSession]);

  const handleToggleLanguage = () => {
    setIsArabic(!isArabic);
    document.documentElement.dir = !isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = !isArabic ? 'ar' : 'en';
  };

  const handleStartBreathing = () => {
    setIsBreathingActive(true);
    setCurrentBreathingPhase('INHALE');
    setPhaseSecondsLeft(4);
  };

  const handleStopBreathing = () => {
    setIsBreathingActive(false);
  };

  // AI Coach Prompt Submission
  const handleSendAiMessage = async (userInput: string) => {
    const userMsg: AICoachMessage = {
      id: Date.now().toString(),
      isUser: true,
      text: userInput,
      timestamp: Date.now()
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are a warm, wise, and empathetic AI wellness, meditation, and longevity coach named Evolum. The user language is ${isArabic ? 'Arabic' : 'English'}. Respond concisely with actionable somatic guidance, breathwork advice, or posture suggestions based on their input: "${userInput}"`
        });
        const replyText = response.text || (isArabic ? 'شكراً لمشاركتك. دعنا نسترخي معاً في جلسة تنفس عميق.' : 'Thank you for sharing. Let us center ourselves with a breathwork session.');
        setAiMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), isUser: false, text: replyText, timestamp: Date.now() }
        ]);
      } else {
        throw new Error('No API key');
      }
    } catch {
      // Fallback
      setTimeout(() => {
        const botResponse = isArabic
          ? 'بناءً على شعورك، يُنصح بجلسة تنفس الحجاب الحاجز 4-4-4 لمدة 5 دقائق لخفض إفراز الكورتيزول وتنشيط الجهاز العصبي اللاودي.'
          : 'Based on your input, a 5-minute 4-4-4 resonant breathwork session will activate your parasympathetic system and restore clarity.';
        setAiMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), isUser: false, text: botResponse, timestamp: Date.now() }
        ]);
      }, 1000);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#EDEDED] flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen bg-[#121212] border-x border-[#262626]/40 px-4 relative flex flex-col justify-between">
        <main className="pt-3">
          {(currentTab === 'home' || currentTab === 'meditation') && (
            <HomeScreen
              isArabic={isArabic}
              metrics={metrics}
              progress={progress}
              meditations={meditations}
              yogaSessions={yogaSessions}
              onSelectSession={(s) => {
                setActiveSession(s);
                setIsPlaying(true);
                setPlaybackProgress(0);
              }}
              onStartBreathing={() => setCurrentTab('breathing')}
              onToggleLanguage={handleToggleLanguage}
            />
          )}

          {currentTab === 'breathing' && (
            <BreathingScreen
              isArabic={isArabic}
              isActive={isBreathingActive}
              currentPhase={currentBreathingPhase}
              secondsLeft={phaseSecondsLeft}
              completedCycles={completedCycles}
              onStart={handleStartBreathing}
              onStop={handleStopBreathing}
            />
          )}

          {currentTab === 'longevity' && (
            <LongevityScreen isArabic={isArabic} metrics={metrics} />
          )}

          {currentTab === 'ai_coach' && (
            <AICoachScreen
              isArabic={isArabic}
              messages={aiMessages}
              isLoading={isAiLoading}
              onSendMessage={handleSendAiMessage}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressScreen isArabic={isArabic} progress={progress} badges={initialBadges} />
          )}
        </main>

        {/* Bottom Navigation */}
        <AuraBottomNav
          currentTab={currentTab}
          isArabic={isArabic}
          onTabSelected={(tab) => setCurrentTab(tab)}
        />

        {/* Fullscreen Player Modal */}
        {activeSession && (
          <PlayerScreen
            session={activeSession}
            isArabic={isArabic}
            isPlaying={isPlaying}
            playbackProgress={playbackProgress}
            onTogglePlayPause={() => setIsPlaying(!isPlaying)}
            onSeek={(val) => setPlaybackProgress(val)}
            onClose={() => {
              setActiveSession(null);
              setIsPlaying(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
