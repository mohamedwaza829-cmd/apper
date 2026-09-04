import React, { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles as SparklesIcon, Quote, RefreshCw, Award, Trophy, Shield, Zap, Lock, X, ArrowLeft, Heart, Moon, LayoutGrid } from 'lucide-react';
import BreathingTimer from './components/BreathingTimer';
import AICoachScreen from './components/AICoachScreen';
import PlayerScreen from './components/PlayerScreen';
import SessionDetailsScreen from './components/SessionDetailsScreen';
import AuraOnboarding from './components/AuraOnboarding';
import VitalityDashboard from './components/VitalityDashboard';
import LongevityScoreScreen from './components/LongevityScoreScreen';
import MindfulnessScreen from './components/MindfulnessScreen';
import AuraBottomNav from './components/AuraBottomNav';
import { mockData } from './data/sessions';

// --- TRANSLATIONS & LOCALIZATION SETUP ---

const translations = {
  ar: {
    // General
    minutes: 'دقيقة',
    // Nav
    navHome: 'الرئيسية',
    navMeditation: 'التأمل',
    navYoga: 'اليوغا',
    navProgress: 'التقدم',
    navProfile: 'الملف',
    // Splash
    appName: 'Evolum',
    loadingCalm: 'جاري تحميل هدوئك...',
    // Onboarding
    onboarding1Title: 'ابحث عن هدوئك الداخلي',
    onboarding1Text: 'جلسات تأمل ويوغا مصممة لراحتك النفسية والجسدية.',
    onboarding2Title: 'تتبع تقدمك بسهولة',
    onboarding2Text: 'راقب رحلتك نحو حياة أكثر توازنًا وسعادة.',
    onboarding3Title: 'انضم إلى مجتمعنا',
    onboarding3Text: 'ابدأ رحلتك الآن وكن جزءًا من عائلة Evolum.',
    next: 'التالي',
    getStarted: 'ابدأ الآن',
    skip: 'تخطي',
    // Home
    homeTitle: 'الرئيسية',
    welcomeBack: 'مرحباً بعودتك!',
    suggestedForYou: 'مقترح لك',
    beginnerYoga: 'يوغا للمبتدئين',
    continueWhereLeftOff: 'تابع من حيث توقفت',
    remainingPercent: 'متبقي {percent}%',
    continueSessionBtn: 'استكمال الجلسة',
    // Meditation & Yoga Screens
    meditationTitle: 'التأمل',
    yogaTitle: 'اليوغا',
    all: 'الكل',
    focus: 'التركيز',
    relaxation: 'الاسترخاء',
    sleep: 'النوم',
    stressRelief: 'تقليل التوتر',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
    // Progress
    progressTitle: 'التقدم',
    streak: 'أيام متتالية',
    sessionsCompleted: 'جلسات مكتملة',
    hoursMeditated: 'دقائق التأمل',
    breathingCyclesCompleted: 'دورات التنفس',
    weeklyActivity: 'نشاط الأسبوع',
    days: ['س', 'أ', 'ن', 'ث', 'ع', 'خ', 'ج'],
    breathingHistoryTitle: 'سجل التنفس الأسبوعي (آخر ٣٠ يوماً)',
    completedCycles: 'الدورات المكتملة',
    weekLabel: 'الأسبوع',
    // Profile
    username: 'اسم المستخدم',
    freeMember: 'عضوية مجانية',
    upgradeToPro: 'الترقية إلى Pro',
    settings: 'الإعدادات',
    favorites: 'المفضلة',
    reminders: 'تذكيرات',
    logout: 'تسجيل الخروج',
    badgesTitle: 'شارات الإنجاز والجوائز',
    badgesSubtitle: 'أكمل الجلسات لفتح شارات وميزات حصرية!',
    unlockedStatus: 'تم الفتح 🎉',
    lockedStatus: 'مقفلة',
    badgeProgress: 'جلسات مكتملة: {current} من {required}',
    badgeDetailTitle: 'تفاصيل الشارة',
    badgeRequiredSessions: 'يتطلب إكمال {required} من الجلسات',
    closeBtn: 'إغلاق',
    shareBadge: 'مشاركة الإنجاز 🔗',
    // Session Details
    favorite: 'المفضلة',
    download: 'تحميل',
    // Settings
    profile: 'الملف الشخصي',
    goals: 'الأهداف',
    name: 'الاسم',
    age: 'العمر',
    gender: 'الجنس',
    height: 'الطول',
    weight: 'الوزن',
    goal: 'الهدف',
    appearance: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    system: 'تلقائي',
    notifications: 'الإشعارات',
    waterReminder: 'تذكير شرب الماء',
    mealsReminder: 'تذكير الوجبات',
    exerciseReminder: 'تذكير التمارين',
    language: 'اللغة',
    subscriptions: 'الاشتراكات',
    premiumTitle: 'Evolum Premium',
    premiumText: 'استمتع بوصول غير محدود لكل الجلسات والميزات.',
    manageSubscription: 'إدارة الاشتراك',
    notificationEnabled: 'تم تفعيل الإشعار بنجاح!',
    notificationDisabled: 'تم إلغاء تفعيل الإشعار.',
    // Search
    searchPlaceholder: 'ابحث عن جلسة...',
    noResults: 'لا توجد نتائج',
    // Favorites
    favoritesTitle: 'المفضلة',
    noFavorites: 'لم تقم بإضافة أي جلسات للمفضلة بعد.',
    // Session Complete
    sessionCompleteTitle: 'أحسنت!',
    sessionCompleteText: 'لقد أكملت جلسة اليوم بنجاح.',
    backToHome: 'العودة للرئيسية',
    breathing: 'التنفس',
    inhale: 'شهيق',
    hold: 'حبس النفس',
    exhale: 'زفير',
    startBreathing: 'ابدأ التمرين',
    stopBreathing: 'إيقاف',
    breathingGoal: 'هدف التنفس اليومي',
    cycles: 'دورات',
    dailyGoalMet: 'تم تحقيق الهدف اليومي!',
    dailyGoalMetDesc: 'يا لك من بطل! لقد أكملت هدفك اليومي للتنفس لموازنة جهازك العصبي.',
    // AI Wellness Coach
    aiCoach: 'المرشد الذكي ✦',
    aiCoachNav: 'المرشد الذكي',
    aiCoachDesc: 'احصل على تمارين وتأملات مخصصة لحالتك النفسية والجسدية باستخدام الذكاء الاصطناعي.',
    aiCoachGreeting: 'أهلاً بك في ركن المرشد الذكي',
    feelQuestion: 'كيف تشعر اليوم؟',
    feelingStressed: 'مضغوط / متوتر',
    feelingAnxious: 'قلق',
    feelingTired: 'متعب / مجهد',
    feelingSad: 'حزين',
    feelingAngry: 'غاضب',
    feelingNormal: 'عادي / مستقر',
    goalQuestion: 'ما هو هدفك الأساسي الآن؟',
    goalRelax: 'الاسترخاء التام وتصفية الذهن',
    goalEnergy: 'شحن الطاقة والنشاط',
    goalFocus: 'زيادة التركيز والانتباه',
    goalSleep: 'تأفيل العقل والجسم للنوم المريح',
    generateWisdom: 'توليد نصيحة وحكمة تذكيرية',
    generateExercise: 'توليد تمرين تنفس مخصص لي',
    loadingAI: 'جاري استشارة الذكاء الاصطناعي لتهيئة جلسة خاصة بك...',
    aiResponseTitle: 'جلستك المخصصة من Gemini',
    aiQuoteTitle: 'حكمتك اليومية',
    practiceNow: 'ابدأ التطبيق الآن',
    stepsToFollow: 'الخطوات المقترحة لتطبيق الجلسة:',
    coachTip: 'نصيحة مرشدك:',
    tryAnother: 'توليد تمرين جديد',
    back: 'السابق',
    // Daily Affirmation
    dailyAffirmation: 'توكيد اليوم الإيجابي',
    refreshAffirmation: 'تحديث التوكيد',
    loadingAffirmation: 'جاري تلقي التوكيد الباعث على السكينة...',
    affirmationError: 'لم نتمكن من جلب التوكيد حالياً. اضغط لإعادة المحاولة.',
    catGratitude: 'الامتنان',
    catSelfLove: 'حب الذات',
    catResilience: 'الصمود والمرونة',
    catGeneral: 'عام',
  },
  en: {
    // General
    minutes: 'minutes',
    // Nav
    navHome: 'Home',
    navMeditation: 'Meditation',
    navYoga: 'Yoga',
    navProgress: 'Progress',
    navProfile: 'Profile',
    // Splash
    appName: 'Evolum',
    loadingCalm: 'Loading your calm...',
    // Onboarding
    onboarding1Title: 'Find Your Inner Peace',
    onboarding1Text: 'Meditation and yoga sessions designed for your mental and physical well-being.',
    onboarding2Title: 'Track Your Progress Easily',
    onboarding2Text: 'Monitor your journey towards a more balanced and happy life.',
    onboarding3Title: 'Join Our Community',
    onboarding3Text: 'Start your journey now and become part of the Evolum family.',
    next: 'Next',
    getStarted: 'Get Started',
    skip: 'Skip',
    // Home
    homeTitle: 'Home',
    welcomeBack: 'Welcome back!',
    suggestedForYou: 'Suggested for You',
    beginnerYoga: 'Yoga for Beginners',
    continueWhereLeftOff: 'Continue Where You Left Off',
    remainingPercent: '{percent}% remaining',
    continueSessionBtn: 'Continue',
    // Meditation & Yoga Screens
    meditationTitle: 'Meditation',
    yogaTitle: 'Yoga',
    all: 'All',
    focus: 'Focus',
    relaxation: 'Relaxation',
    sleep: 'Sleep',
    stressRelief: 'Stress Relief',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    // Progress
    progressTitle: 'Progress',
    streak: 'Day Streak',
    sessionsCompleted: 'Sessions Completed',
    hoursMeditated: 'Minutes Meditated',
    breathingCyclesCompleted: 'Breathing Cycles',
    weeklyActivity: 'Weekly Activity',
    days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    breathingHistoryTitle: 'Weekly Breathing Trend (Last 30 Days)',
    completedCycles: 'Completed Cycles',
    weekLabel: 'Week',
    // Profile
    username: 'Username',
    freeMember: 'Free Member',
    upgradeToPro: 'Upgrade to Pro',
    settings: 'Settings',
    favorites: 'Favorites',
    reminders: 'Reminders',
    logout: 'Log Out',
    badgesTitle: 'Achievement Badges',
    badgesSubtitle: 'Complete sessions to unlock exclusive rewards and milestones!',
    unlockedStatus: 'Unlocked 🎉',
    lockedStatus: 'Locked',
    badgeProgress: 'Completed: {current}/{required} sessions',
    badgeDetailTitle: 'Badge Details',
    badgeRequiredSessions: 'Requires {required} completed sessions',
    closeBtn: 'Close',
    shareBadge: 'Share Achievement 🔗',
    // Session Details
    favorite: 'Favorite',
    download: 'Download',
    // Settings
    profile: 'Profile',
    goals: 'Goals',
    name: 'Name',
    age: 'Age',
    gender: 'Gender',
    height: 'Height',
    weight: 'Weight',
    goal: 'Goal',
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    notifications: 'Notifications',
    waterReminder: 'Water Reminder',
    mealsReminder: 'Meals Reminder',
    exerciseReminder: 'Exercise Reminder',
    language: 'Language',
    subscriptions: 'Subscriptions',
    premiumTitle: 'Evolum Premium',
    premiumText: 'Enjoy unlimited access to all sessions and features.',
    manageSubscription: 'Manage Subscription',
    notificationEnabled: 'Notification enabled successfully!',
    notificationDisabled: 'Notification disabled.',
    // Search
    searchPlaceholder: 'Search for a session...',
    noResults: 'No results found',
    // Favorites
    favoritesTitle: 'Favorites',
    noFavorites: 'You haven\'t added any favorite sessions yet.',
    // Session Complete
    sessionCompleteTitle: 'Well Done!',
    sessionCompleteText: 'You have successfully completed today\'s session.',
    backToHome: 'Back to Home',
    breathing: 'Breathing',
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    startBreathing: 'Start Exercise',
    stopBreathing: 'Stop',
    breathingGoal: 'Daily Breathing Goal',
    cycles: 'Cycles',
    dailyGoalMet: 'Daily Goal Met!',
    dailyGoalMetDesc: 'Amazing! You have fully completed your daily breathing cycles target today.',
    // AI Wellness Coach
    aiCoach: 'AI Coach ✦',
    aiCoachNav: 'AI Coach',
    aiCoachDesc: 'Get custom exercises and reflections tailored to your mood and physical states powered by AI.',
    aiCoachGreeting: 'Welcome to your AI Wellness Guide',
    feelQuestion: 'How do you feel today?',
    feelingStressed: 'Stressed / Overwhelmed',
    feelingAnxious: 'Anxious',
    feelingTired: 'Tired / Exhausted',
    feelingSad: 'Sad',
    feelingAngry: 'Angry',
    feelingNormal: 'Neutral / Stable',
    goalQuestion: 'What is your primary goal right now?',
    goalRelax: 'Deep relaxation and mind clearing',
    goalEnergy: 'Energy boost and revitalizing',
    goalFocus: 'Enhance focus and mental clarity',
    goalSleep: 'Prepare mind and body for sleep',
    generateWisdom: 'Generate Tailored Mindfulness Wisdom',
    generateExercise: 'Generate Personalized Breathing Work',
    loadingAI: 'Consulting Gemini AI to prepare your custom session...',
    aiResponseTitle: 'Your Custom Gemini Session',
    aiQuoteTitle: 'Your Daily Wisdom',
    practiceNow: 'Start Practice Now',
    stepsToFollow: 'Suggested Steps to Follow:',
    coachTip: 'Your Guide\'s Tip:',
    tryAnother: 'Try Another Generation',
    back: 'Back',
    // Daily Affirmation
    dailyAffirmation: 'Daily Affirmation',
    refreshAffirmation: 'Refresh Affirmation',
    loadingAffirmation: 'Receiving your serene perspective...',
    affirmationError: 'Could not fetch affirmation. Tap to retry.',
    catGratitude: 'Gratitude',
    catSelfLove: 'Self-Love',
    catResilience: 'Resilience',
    catGeneral: 'General',
  }
};

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('ar');

  const t = useCallback((key: string) => {
    return (translations as any)[language]?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

// Helper for Tailwind CSS class names
const classNames = (...classes: any[]) => classes.filter(Boolean).join(' ');

// --- ICONS (Inline SVGs for simplicity) ---
// Onboarding SVGs
const OnboardingSlide1SVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="ob1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c4b5fd"/>
        <stop offset="100%" stopColor="#a78bfa"/>
      </linearGradient>
      <linearGradient id="ob1CircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5f3ff"/>
        <stop offset="100%" stopColor="#e0e7ff"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#ob1CircleGrad)" />
    <path fill="url(#ob1Grad)" d="M100 135c-11.046 0-20-8.954-20-20s8.954-20 20-20 20 8.954 20 20-8.954 20-20 20zm-20-30c-11.046 0-20-8.954-20-20s8.954-20 20-20 20 8.954 20 20-8.954 20-20 20zm40 0c-11.046 0-20-8.954-20-20s8.954-20 20-20 20 8.954 20 20-8.954 20-20 20zm-20 30c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z" opacity="0.1">
      <animate attributeName="opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite" />
    </path>
    <path fill="#a78bfa" d="M100 85c-5.523 0-10 4.477-10 10v20c0 5.523 4.477 10 10 10s10-4.477 10-10v-20c0-5.523-4.477-10-10-10zm-20 10c-5.523 0-10 4.477-10 10v10c0 5.523 4.477 10 10 10s10-4.477 10-10v-10c0-5.523-4.477-10-10-10zm40 0c-5.523 0-10 4.477-10 10v10c0 5.523 4.477 10 10 10s10-4.477 10-10v-10c0-5.523-4.477-10-10-10z" />
  </svg>
);

const OnboardingSlide2SVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="ob2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9"/>
        <stop offset="100%" stopColor="#06b6d4"/>
      </linearGradient>
       <linearGradient id="ob2CircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f9ff"/>
        <stop offset="100%" stopColor="#e0f2fe"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#ob2CircleGrad)" />
    <g fill="url(#ob2Grad)">
      <rect x="60" y="110" width="20" height="40" rx="5">
        <animate attributeName="height" values="40;60;40" dur="2s" repeatCount="indefinite" begin="0s"/>
      </rect>
      <rect x="90" y="90" width="20" height="60" rx="5">
        <animate attributeName="height" values="60;40;60" dur="2s" repeatCount="indefinite" begin="0.5s"/>
      </rect>
      <rect x="120" y="70" width="20" height="80" rx="5">
         <animate attributeName="height" values="80;50;80" dur="2s" repeatCount="indefinite" begin="1s"/>
      </rect>
      <path d="M50 150 h100" stroke="#06b6d4" strokeWidth="4" />
      <path d="M50 50 v100" stroke="#06b6d4" strokeWidth="4" />
    </g>
  </svg>
);

const OnboardingSlide3SVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="ob3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fca5a5"/>
        <stop offset="100%" stopColor="#ef4444"/>
      </linearGradient>
      <linearGradient id="ob3CircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff1f2"/>
        <stop offset="100%" stopColor="#ffe4e6"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#ob3CircleGrad)" />
    <path fill="url(#ob3Grad)" d="M100 180c-16.568 0-30-13.432-30-30 0-16.568 13.432-30 30-30s30 13.432 30 30c0 16.568-13.432 30-30 30zm-40-20c-16.568 0-30-13.432-30-30s13.432-30 30-30 30 13.432 30 30-13.432 30-30 30zm80 0c-16.568 0-30-13.432-30-30s13.432-30 30-30 30 13.432 30 30-13.432 30-30 30z" opacity="0.1" />
    <path d="M100 68.3c-17.67 0-32 14.33-32 32 0 17.67 14.33 32 32 32s32-14.33 32-32c0-17.67-14.33-32-32-32z" fill="url(#ob3Grad)">
      <animateTransform attributeName="transform" type="scale" values="1; 1.1; 1" dur="2.5s" repeatCount="indefinite" />
    </path>
    <path d="M70 58.3c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24z" fill="url(#ob3Grad)" opacity="0.7">
       <animateTransform attributeName="transform" type="scale" values="1; 1.05; 1" dur="3s" repeatCount="indefinite" begin="0.5s"/>
    </path>
    <path d="M130 58.3c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24z" fill="url(#ob3Grad)" opacity="0.7">
       <animateTransform attributeName="transform" type="scale" values="1; 1.05; 1" dur="3s" repeatCount="indefinite" begin="1s"/>
    </path>
  </svg>
);


const EvolumLogoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" /> 
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path 
      fill="url(#logoGradient)"
      d="M50,10 C50,10 65,35 65,50 C65,65 50,90 50,90 C50,90 35,65 35,50 C35,35 50,10 50,10 Z"
      transform="rotate(180 50 50)"
    >
      <animate 
        attributeName="d" 
        values="M50,10 C50,10 65,35 65,50 C65,65 50,90 50,90 C50,90 35,65 35,50 C35,35 50,10 50,10 Z; 
                M50,0 C50,0 70,30 70,50 C70,70 50,100 50,100 C50,100 30,70 30,50 C30,30 50,0 50,0 Z; 
                M50,10 C50,10 65,35 65,50 C65,65 50,90 50,90 C50,90 35,65 35,50 C35,35 50,10 50,10 Z"
        dur="3s"
        repeatCount="indefinite"
        begin="0.2s"
      />
    </path>
    <path 
      fill="url(#logoGradient)"
      opacity="0.6"
      d="M50,25 C50,25 58,42 58,50 C58,58 50,75 50,75 C50,75 42,58 42,50 C42,42 50,25 50,25 Z"
      transform="rotate(180 50 50)"
    >
        <animate 
        attributeName="d" 
        values="M50,25 C50,25 58,42 58,50 C58,58 50,75 50,75 C50,75 42,58 42,50 C42,42 50,25 50,25 Z;
                M50,20 C50,20 60,40 60,50 C60,60 50,80 50,80 C50,80 40,60 40,50 C40,40 50,20 50,20 Z; 
                M50,25 C50,25 58,42 58,50 C58,58 50,75 50,75 C50,75 42,58 42,50 C42,42 50,25 50,25 Z"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);
const HomeIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const MeditationIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2.83 2.83 0 0 1 2.83 2.83L12 22a2.83 2.83 0 0 1-2.83-2.83L12 2zM2 12h20" /><path d="M5 12a2.83 2.83 0 0 1 2.83-2.83L12 22a2.83 2.83 0 0 1-2.83 2.83L5 12z" /><path d="M19 12a2.83 2.83 0 0 0-2.83-2.83L12 22a2.83 2.83 0 0 0 2.83 2.83L19 12z"/></svg>;
const YogaIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><circle cx="12" cy="12" r="3"/><path d="M15.5 15.5l-1.5-1.5"/><path d="M8.5 8.5l1.5 1.5"/><path d="M15.5 8.5l-1.5 1.5"/><path d="M8.5 15.5l1.5-1.5"/><path d="M12 4v2"/><path d="M12 18v2"/><path d="M4 12h2"/><path d="M18 12h2"/></svg>;
const ProgressIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8a6 6 0 0 0-8.4 0L3 15.6" /><path d="M12 18v-6" /><path d="M7 18v-1" /></svg>;
const ProfileIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const SearchIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const HeartIcon = ({ className, isFilled }: { className?: string, isFilled?: boolean }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const DownloadIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const PlayIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const PauseIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>;
const ReplayIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>;
const SunIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const ArrowIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const SettingsIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const BellIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const LogoutIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const FireIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 9.5c.3-.8.5-1.7.5-2.5 0-2.8-2.2-5-5-5-2.8 0-5 2.2-5 5 0 .8.2 1.7.5 2.5"></path><path d="M12 15s2 2 5 2c5 0 5-10-5-10s-5 10-5 10c3 0 5-2 5-2"></path><path d="M12 22v-7"></path></svg>;
const CheckCircleIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ClockIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const DropletIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>;
const UtensilsIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"></path></svg>;
const DumbbellIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6"></path><path d="M18.657 21.314a2 2 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.828l3.535-3.535a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828z"></path><path d="m21.5 21.5-1.4-1.4"></path><path d="M5.343 2.686a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828l-3.535 3.535a2 2 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.828z"></path><path d="m2.5 2.5 1.4 1.4"></path></svg>;
const LanguageIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>;
const CrownIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"></path><path d="M5 22h14"></path></svg>;
const PaletteIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>;
const WindIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2"></path><path d="M12.59 19.41A2 2 0 1 0 14 16H2"></path><path d="M12 12H2"></path></svg>;

// --- ABSTRACT SVG BACKGROUNDS FOR CARDS (PERFORMANCE OPTIMIZED & UNIQUE IDs) ---
const CardBackground = ({ category, id }: { category: string; id: string }) => {
  const SvgPattern = () => {
    switch (category) {
      case 'focus':
      case 'stressRelief':
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id={`gradFocus-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
              <filter id={`blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill={`url(#gradFocus-${id})`} />
            <g filter={`url(#blur-${id})`} opacity="0.6">
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
              <linearGradient id={`gradRelax-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="100%" stopColor="#67e8f9" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill={`url(#gradRelax-${id})`} />
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
              <radialGradient id={`gradSleep-${id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#312e81" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill={`url(#gradSleep-${id})`} />
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
              <linearGradient id={`gradYoga-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dcfce7" />
                <stop offset="100%" stopColor="#fecdd3" />
              </linearGradient>
               <filter id={`blurYoga-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill={`url(#gradYoga-${id})`} />
            <g opacity="0.4" filter={`url(#blurYoga-${id})`}>
              <path d="M 0 100 C 50 150, 100 0, 150 50 S 200 150, 250 100" stroke="#fb7185" fill="transparent" strokeWidth="20" />
              <path d="M 0 50 C 50 0, 100 150, 150 100 S 200 0, 250 50" stroke="#4ade80" fill="transparent" strokeWidth="20" />
            </g>
          </svg>
        );
    }
  };
  return <div className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"><SvgPattern /></div>;
};


// --- MOCK DATA IMPORTED FROM SESSIONS DATABASE ---

// --- REUSABLE COMPONENTS ---
const SessionCard: React.FC<{ session: any; onSelect: (s: any) => void }> = ({ session, onSelect }) => {
  const { language, t } = useLanguage();
  const title = language === 'ar' ? session.title : session.title_en;
  return (
      <motion.div 
          onClick={() => onSelect(session)} 
          className="flex-shrink-0 w-40 md:w-48 cursor-pointer group"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
      >
          <div className="relative overflow-hidden rounded-2xl shadow-md aspect-square">
              <CardBackground category={session.category} id={session.id} />
              <div className={`absolute inset-0 bg-gradient-to-t ${session.color}`}></div>
          </div>
          <div className="mt-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-500 transition-colors duration-200">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{session.duration} {t('minutes')}</p>
          </div>
      </motion.div>
  );
};

const CategoryTab: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className={classNames(
      'px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap focus:outline-none cursor-pointer',
      isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
    )}
  >
    {label}
  </motion.button>
);

const ToggleSwitch = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (b: boolean) => void }) => (
    <button
        className={classNames(
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border border-[#262626] transition-colors duration-200 ease-in-out focus:outline-none',
            enabled ? 'bg-[#E2C854]' : 'bg-[#262626]'
        )}
        onClick={() => setEnabled(!enabled)}
    >
        <span
            className={classNames(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out',
                enabled ? 'translate-x-5 rtl:-translate-x-5 bg-[#121212]' : 'translate-x-0 bg-[#A3A3A3]'
            )}
        />
    </button>
);

const ProfileInput = ({ label, value, field, setData }: { label: string; value: string; field: string; setData: React.Dispatch<React.SetStateAction<any>> }) => (
    <div className="flex items-center justify-between">
        <label className="text-[#A3A3A3] text-sm">{label}</label>
        <input
            type="text"
            value={value || ''}
            onChange={(e) => setData((p: any) => ({ ...p, [field]: e.target.value }))}
            className="w-1/2 text-left rtl:text-right bg-[#121212] border border-[#262626] text-[#EDEDED] rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-[#E2C854]"
        />
    </div>
);


// --- SCREEN COMPONENTS ---
const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();

  const slides = [
    { 
      svg: <OnboardingSlide1SVG />, 
      title: t('onboarding1Title'), 
      text: t('onboarding1Text') 
    },
    { 
      svg: <OnboardingSlide2SVG />, 
      title: t('onboarding2Title'), 
      text: t('onboarding2Text') 
    },
    { 
      svg: <OnboardingSlide3SVG />, 
      title: t('onboarding3Title'), 
      text: t('onboarding3Text') 
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-8 text-center bg-white dark:bg-gray-900 overflow-hidden">
      {/* Skip Button */}
      <div className="absolute top-6 ltr:right-6 rtl:left-6">
        <button onClick={onComplete} className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
          {t('skip')}
        </button>
      </div>

      {/* Slides Container */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-full h-64 mb-8">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={classNames(
                'absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out',
                index === step ? 'opacity-100' : 'opacity-0',
                index > step ? 'ltr:translate-x-full rtl:-translate-x-full' : '',
                index < step ? 'ltr:-translate-x-full rtl:translate-x-full' : ''
              )}
            >
              <div className="w-56 h-56">
                {slide.svg}
              </div>
            </div>
          ))}
        </div>
        
        {/* Text container with fixed height to prevent layout shift */}
        <div className="h-40 relative w-full">
           {slides.map((slide, index) => (
             <div 
                key={index}
                className={classNames(
                    "transition-opacity duration-300 w-full left-0 top-0",
                    index === step ? "opacity-100 relative" : "opacity-0 absolute"
                )}
             >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{slide.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto">{slide.text}</p>
              </div>
           ))}
        </div>
      </div>

      {/* Controls */}
      <div>
        <div className="flex justify-center space-x-2 rtl:space-x-reverse mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={classNames(
                'w-2 h-2 rounded-full transition-all duration-300',
                i === step ? 'bg-blue-500 w-6' : 'bg-gray-300 dark:bg-gray-600'
              )}
            ></div>
          ))}
        </div>
        
        {step < slides.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 cursor-pointer"
          >
            {t('next')}
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="w-full bg-emerald-500 text-white py-3 rounded-full font-semibold shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 cursor-pointer"
          >
            {t('getStarted')}
          </button>
        )}
      </div>
    </div>
  );
};

const SplashScreen = () => { 
  const { t, language } = useLanguage(); 
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0C0C0E] text-white z-50 select-none overflow-hidden animate-fade-out" style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}>
      {/* Background ambient radial glow */}
      <div className="absolute w-96 h-96 bg-[#E2C854]/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      
      {/* Aura Concentric Orbital Logo Ring */}
      <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-dashed border-[#E2C854]/40 animate-spin-slow" />
        <div className="absolute w-20 h-20 rounded-full border border-white/10" />
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#131417] to-[#1f2216] border border-[#E2C854]/50 flex items-center justify-center shadow-[0_0_30px_rgba(226,200,84,0.35)] animate-fade-in">
          <div className="w-5 h-5 rounded-full bg-[#E2C854] shadow-[0_0_15px_#E2C854]" />
        </div>
      </div>
      
      {/* Title */}
      <h1 
        className="text-3xl font-extrabold tracking-tight text-white animate-fade-in" 
        style={{ animationDuration: '0.8s', animationDelay: '0.3s', animationFillMode: 'backwards' }}
      >
        Evolum <span className="text-[#E2C854]">Aura</span>
      </h1>
      
      {/* Subtitle */}
      <p 
        className="text-xs text-[#8E927C] tracking-wide mt-2 font-medium animate-fade-in" 
        style={{ animationDuration: '0.8s', animationDelay: '0.6s', animationFillMode: 'backwards' }}
      >
        {language === 'ar' ? 'نظام الحيوية والعمر الحيوي المتكامل' : 'Vitality & Longevity System'}
      </p>
    </div>
  ); 
};

const HomeScreen = ({ 
  user, 
  onSelectSession, 
  onShowSearch, 
  onNavigate,
  onResumeSession
}: { 
  user: any;
  onSelectSession: (s: any) => void; 
  onShowSearch: () => void; 
  onNavigate: (page: string) => void;
  onResumeSession: (session: any, progress: number) => void;
}) => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [affirmation, setAffirmation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const allSessions = useMemo(() => [...mockData.meditation, ...mockData.yoga], []);
  const unfinishedSession = user?.progress?.unfinishedSession;
  const unfinishedSessionData = useMemo(() => {
    if (!unfinishedSession?.id) return null;
    return allSessions.find(s => s.id === unfinishedSession.id) || null;
  }, [unfinishedSession, allSessions]);

  const fetchAffirmation = useCallback(async (categoryKey: string, force: boolean = false) => {
    setLoading(true);
    setError(false);
    try {
      const today = new Date().toDateString();
      const cacheKey = `evolum_daily_affirmation_${language}_${categoryKey}`;
      const cacheDateKey = `evolum_daily_affirmation_date_${language}_${categoryKey}`;
      
      if (!force) {
        const cached = localStorage.getItem(cacheKey);
        const cachedDate = localStorage.getItem(cacheDateKey);
        if (cached && cachedDate === today) {
          setAffirmation(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/generate-wellness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          option: 'quote',
          feeling: 'normal',
          goal: 'relax',
          language,
          category: categoryKey !== 'general' ? categoryKey : undefined,
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setAffirmation(resJson.data);
        localStorage.setItem(cacheKey, JSON.stringify(resJson.data));
        localStorage.setItem(cacheDateKey, today);
      } else {
        throw new Error('Fallback to local');
      }
    } catch (err) {
      console.warn("AI Affirmation service unavailable. Using beautiful local fallback:", err);
      // Beautiful local fallback list so the page remains highly polished
      let fallback = { title: "", content: "", tip: "" };
      if (language === 'ar') {
        if (categoryKey === 'gratitude') {
          fallback = {
            title: "توكيد الامتنان والرضا",
            content: "أنا ممتن للغاية لكل نعم حياتي الصغيرة والكبيرة، وأرى الجمال والرحمة في كل تفصيل يحيط بي اليوم.",
            tip: "امضِ دقيقة للتفكير في ثلاثة أشياء تشعر بامتنان حقيقي لوجودها الآن."
          };
        } else if (categoryKey === 'self-love') {
          fallback = {
            title: "توكيد حب وقبول الذات",
            content: "أنا أتقبل نفسي تماماً كما أنا بكل مراحل قوتي وضعفي، وأستحق كل اللطف والراحة والسلام النفسي.",
            tip: "انظر لنفسك بلطف اليوم، فأنت تبذل قصارى جهدك وهذا كافٍ تماماً."
          };
        } else if (categoryKey === 'resilience') {
          fallback = {
            title: "توكيد القوة والصمود الداخلي",
            content: "أمتلك القوة الكافية لتجاوز كل التحديات بيسر وسهولة، وكل عقبة هي باب لنمو روحي وعقلي أعمق.",
            tip: "تنفس بعمق وذكّر نفسك بمدى صلابتك في مواجهة الصعاب السابقة."
          };
        } else {
          fallback = {
            title: "تنفس بعمق وجدد نشاطك",
            content: "كل زفير يحمل معه ثقلاً، وكل شهيق يأتي بفرصة جديدة للبدء من جديد بكامل السلام والاطمئنان الداخلي.",
            tip: "ابدأ خمس دقائق من تمارين التنفس لموازنة قوتك العاطفية."
          };
        }
      } else {
        if (categoryKey === 'gratitude') {
          fallback = {
            title: "Affirmation of Gratitude",
            content: "I am deeply grateful for every abundance in my life, finding beauty and peace in the simplest of moments today.",
            tip: "Take a moment to write down or think of three things you appreciate right now."
          };
        } else if (categoryKey === 'self-love') {
          fallback = {
            title: "Affirmation of Self-Compassion",
            content: "I accept myself unconditionally, embracing my imperfections and honoring my need for patience and rest.",
            tip: "Treat yourself with gentle care today; you are worthy of your own love."
          };
        } else if (categoryKey === 'resilience') {
          fallback = {
            title: "Affirmation of Strength & Resilience",
            content: "I am fully capable of navigating life's challenges with absolute grace, growing stronger with every step I take.",
            tip: "Take a deep breath and remind yourself of all the times you have overcome in the past."
          };
        } else {
          fallback = {
            title: "Breathe Deep and Renew",
            content: "Every exhale carries away a weight, and every inhale brings a fresh opportunity to start anew with peaceful presence.",
            tip: "Practice 5 minutes of deep breathing to reset your nervous system."
          };
        }
      }
      setAffirmation(fallback);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchAffirmation(selectedCategory, false);
  }, [fetchAffirmation, selectedCategory]);

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('homeTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('welcomeBack')}</p>
        </div>
        <button onClick={onShowSearch} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <SearchIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </header>

      {/* Daily Affirmation Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-amber-50/50 via-orange-50/40 to-yellow-50/30 dark:from-amber-950/20 dark:to-slate-900/40 border border-amber-200/40 dark:border-amber-900/30 rounded-3xl p-5 shadow-sm relative overflow-hidden group"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Quote className="w-4 h-4 fill-current opacity-75" />
            </div>
            <span className="text-xs font-bold text-amber-800/90 dark:text-amber-400 uppercase tracking-widest">
              {t('dailyAffirmation')}
            </span>
          </div>
          <button 
            disabled={loading}
            onClick={() => fetchAffirmation(selectedCategory, true)}
            className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-950 text-amber-700/80 dark:text-amber-400 hover:text-amber-900 transition-all cursor-pointer flex items-center justify-center disabled:opacity-40"
            title={t('refreshAffirmation')}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'hover:rotate-45 duration-300'}`} />
          </button>
        </div>

        {/* Category Filter Pills Container */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-3.5 scrollbar-none items-center">
          {[
            { id: 'general', key: 'catGeneral' },
            { id: 'gratitude', key: 'catGratitude' },
            { id: 'self-love', key: 'catSelfLove' },
            { id: 'resilience', key: 'catResilience' }
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                }}
                disabled={loading}
                className={classNames(
                  "px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border",
                  isSelected
                    ? "bg-amber-500/15 text-amber-850 dark:text-amber-300 border-amber-500/30 font-bold scale-[1.02]"
                    : "bg-white/40 dark:bg-slate-800/40 text-gray-500 dark:text-gray-400 border-gray-100/60 dark:border-gray-800/40 hover:bg-white/60 dark:hover:bg-slate-800"
                )}
              >
                {t(cat.key)}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-5 flex flex-col items-center justify-center text-center">
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2.5" />
            <p className="text-xs text-amber-700/70 dark:text-amber-400/80 animate-pulse font-medium">{t('loadingAffirmation')}</p>
          </div>
        ) : error ? (
          <button 
            onClick={() => fetchAffirmation(selectedCategory, true)} 
            className="w-full py-4 text-center cursor-pointer hover:bg-black/5 rounded-2xl active:scale-[0.99] transition-all"
          >
            <p className="text-xs text-red-500 font-semibold">{t('affirmationError')}</p>
          </button>
        ) : affirmation ? (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-2.5 text-left ltr:text-left rtl:text-right"
          >
            <h3 className="text-sm font-bold text-gray-800 dark:text-amber-200/95 leading-tight">
              {affirmation.title}
            </h3>
            <p className="text-[13px] md:text-sm text-gray-650 dark:text-gray-300/90 italic leading-relaxed font-medium">
              "{affirmation.content}"
            </p>
            {affirmation.tip && (
              <p className="text-[11px] text-amber-850 dark:text-amber-400/80 font-semibold flex items-center gap-1 mt-1 opacity-90">
                <span>✦</span>
                <span>{affirmation.tip}</span>
              </p>
            )}
          </motion.div>
        ) : null}
      </motion.div>

      {/* AI Guided Assistant - Powered by Gemini */}
      <motion.div 
        onClick={() => onNavigate('ai-coach')} 
        whileHover={{ scale: 1.015, y: -2 }}
        whileTap={{ scale: 0.985 }}
        className="relative bg-gradient-to-br from-indigo-600 via-indigo-750 to-blue-700 text-white rounded-3xl p-6 shadow-xl shadow-indigo-500/10 overflow-hidden cursor-pointer group border border-indigo-500/15"
      >
        <div className="absolute top-0 right-0 ltr:right-0 rtl:left-0 p-4 opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
          <SparklesIcon className="w-28 h-28 text-white" />
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-1.5 bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3 backdrop-blur-md">
              <SparklesIcon className="w-3 h-3 text-amber-200 animate-pulse" />
              <span>{t('aiCoachNav')}</span>
            </div>
            <h2 className="text-xl font-bold pr-12 ltr:pr-12 ltr:text-left rtl:pl-12 rtl:text-right leading-tight mb-2">
              {useLanguage().language === 'ar' ? 'تمارين وتأملات مخصصة لواقعك النفسي ✦' : 'Personalized sessions and reflections ✦'}
            </h2>
            <p className="text-xs text-indigo-50/90 leading-relaxed max-w-[90%] ltr:text-left rtl:text-right">
              {t('aiCoachDesc')}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 font-bold text-xs text-amber-200 hover:text-white transition-colors duration-200">
            <span>{useLanguage().language === 'ar' ? 'ابدأ الاستشارة الآن ←' : 'Start your guide consultation ←'}</span>
          </div>
        </div>
      </motion.div>

      {/* Continue where you left off section */}
      {unfinishedSessionData && (
        <section className="space-y-3.5">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            {t('continueWhereLeftOff')}
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -1 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800/85 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4 overflow-hidden relative"
          >
            {/* Ambient category colored shape backdrop */}
            <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-tr ${unfinishedSessionData.color} blur-xl opacity-15`} />
            
            <div className="flex-1 min-w-0 z-10 text-left rtl:text-right">
              {/* Category Tag */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[9px] uppercase font-black tracking-widest bg-blue-500/10 dark:bg-slate-800 text-blue-600 dark:text-gray-300 px-2 py-0.5 rounded-md">
                  {language === 'ar' ? (unfinishedSessionData.category === 'beginner' || unfinishedSessionData.category === 'intermediate' || unfinishedSessionData.category === 'advanced' ? 'يوغا' : 'تأمل') : unfinishedSessionData.category}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold font-mono">
                  {t('remainingPercent').replace('{percent}', String(Math.ceil(100 - (unfinishedSession?.progress || 0))))}
                </span>
              </div>
              
              <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white truncate">
                {language === 'ar' ? unfinishedSessionData.title : unfinishedSessionData.title_en}
              </h3>
              
              {/* Progress Bar */}
              <div className="mt-3.5 w-full bg-gray-100 dark:bg-gray-850 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${unfinishedSession?.progress || 0}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${unfinishedSessionData.color || 'from-blue-500 to-indigo-500'}`}
                />
              </div>
            </div>

            <button
              onClick={() => onResumeSession(unfinishedSessionData, unfinishedSession.progress)}
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-2xl px-4 py-2.5 text-xs font-black shadow-lg shadow-blue-500/10 active:scale-95 transition-all z-10"
            >
              {t('continueSessionBtn')}
            </button>
          </motion.div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{t('suggestedForYou')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {mockData.meditation.slice(0, 3).map(session => (
            <SessionCard key={session.id} session={session} onSelect={onSelectSession} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{t('beginnerYoga')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {mockData.yoga.filter(s => s.category === 'beginner').map(session => (
            <SessionCard key={session.id} session={session} onSelect={onSelectSession} />
          ))}
        </div>
      </section>
    </div>
  );
};
const MeditationScreen = ({ onSelectSession, onCompleteBreathing, user }: { onSelectSession: (s: any) => void; onCompleteBreathing: (cycles: number) => void; user?: any }) => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = ['all', 'focus', 'relaxation', 'sleep', 'stressRelief', 'breathing'];

  const filteredSessions = useMemo(() => {
    return activeCategory === 'all' 
      ? mockData.meditation 
      : mockData.meditation.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {t('meditationTitle')}
      </h1>
      
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-6 px-6">
        {categories.map(cat => (
          <CategoryTab 
            key={cat} 
            label={t(cat)} 
            isActive={activeCategory === cat} 
            onClick={() => setActiveCategory(cat)} 
          />
        ))}
      </div>

      {activeCategory === 'breathing' ? (
        <BreathingTimer onComplete={onCompleteBreathing} user={user} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredSessions.map(session => (
            <div key={session.id} onClick={() => onSelectSession(session)} className="cursor-pointer group">
              <div className="relative overflow-hidden rounded-2xl shadow-md aspect-square">
                <CardBackground category={session.category} id={session.id} />
                <div className={`absolute inset-0 bg-gradient-to-t ${session.color}`}></div>
              </div>
              <div className="mt-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {language === 'ar' ? session.title : session.title_en}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {session.duration} {t('minutes')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const YogaScreen = ({ onSelectSession }: { onSelectSession: (s: any) => void }) => { const { t, language } = useLanguage(); const [activeCategory, setActiveCategory] = useState('all'); const categories = ['all', 'beginner', 'intermediate', 'advanced']; const filteredSessions = useMemo(() => activeCategory === 'all' ? mockData.yoga : mockData.yoga.filter(s => s.category === activeCategory), [activeCategory]); return (<div className="p-6"><h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('yogaTitle')}</h1><div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-6 px-6">{categories.map(cat => (<CategoryTab key={cat} label={t(cat)} isActive={activeCategory === cat} onClick={() => setActiveCategory(cat)} />))}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{filteredSessions.map(session => (<div key={session.id} onClick={() => onSelectSession(session)} className="cursor-pointer group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex items-center gap-4 p-4"><div className="w-24 h-24 rounded-lg flex-shrink-0 relative overflow-hidden"><CardBackground category={session.category} id={session.id} /></div><div className="flex-grow"><h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{language === 'ar' ? session.title : session.title_en}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{session.duration} {t('minutes')}</p><p className="text-xs text-blue-500 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 rounded-full px-2 py-1 inline-block mt-2">{t(session.category)}</p></div></div>))}</div></div>); };
const ProgressScreen = ({ userProgress }: { userProgress: any }) => {
  const { t, language } = useLanguage();
  const stats = [
    { label: t('streak'), value: userProgress.streak, Icon: FireIcon, color: 'text-amber-500' },
    { label: t('sessionsCompleted'), value: userProgress.sessionsCompleted, Icon: CheckCircleIcon, color: 'text-emerald-500' },
    { label: t('hoursMeditated'), value: userProgress.minutesMeditated, Icon: ClockIcon, color: 'text-blue-500' },
    { label: t('breathingCyclesCompleted'), value: userProgress.breathingCyclesCompleted || 0, Icon: WindIcon, color: 'text-violet-500' },
  ];

  const breathingCycles = userProgress.breathingCyclesCompleted || 0;

  const consistencyLevel = useMemo(() => {
    if (breathingCycles === 0) {
      return {
        level: language === 'ar' ? 'البداية' : 'Initiate',
        desc: language === 'ar' ? 'ابدأ دورتك الأولى اليوم لتقليل مستويات التوتر على الفور وتدريب رئتيك.' : 'Start your first cycle today to lower stress levels instantly and train your lungs.',
        progressMax: 10,
        color: 'bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/20 dark:to-gray-800/10'
      };
    } else if (breathingCycles < 12) {
      return {
        level: language === 'ar' ? 'منتسب هادئ' : 'Calm Novice',
        desc: language === 'ar' ? 'بداية رائعة! ممارسة 4 دورات يومية تمنحك استرخاءً سريعاً وتحكماً أفضل في الأجواء المتوترة.' : 'Great start! Practice 4 daily cycles to receive instant relaxation and clear anxiety.',
        progressMax: 12,
        color: 'bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10'
      };
    } else if (breathingCycles < 32) {
      return {
        level: language === 'ar' ? 'متنفس واعٍ' : 'Mindful Breather',
        desc: language === 'ar' ? 'ممتاز! لقد طورت اتساقاً رائعاً وبدأت في ترويض جهازك العصبي وزيادة استيعاب الرئتين.' : 'Resilient! You are building deep nervous system resilience and lung stamina.',
        progressMax: 32,
        color: 'bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10'
      };
    } else {
      return {
        level: language === 'ar' ? 'خبير التنفس' : 'Zen Breathmaster',
        desc: language === 'ar' ? 'تنفس مذهل! أنت الآن تتحكم في مسارات هدوئك وصحتك الداخلية بدقة متناهية.' : 'Incredible control! You have established optimal parasympathetic harmony and consistency.',
        progressMax: 100,
        color: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10'
      };
    }
  }, [breathingCycles, language]);

  const weeklyBreathingTrend = useMemo(() => {
    const history = userProgress.breathingHistory || [];
    const today = new Date();
    
    const getIntervalSum = (startOffsetDays: number, endOffsetDays: number) => {
      const start = new Date();
      start.setDate(today.getDate() - startOffsetDays);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date();
      end.setDate(today.getDate() - endOffsetDays);
      end.setHours(23, 59, 59, 999);
      
      return history.reduce((sum: number, item: { date: string; cycles: number }) => {
        const itemDate = new Date(item.date);
        if (itemDate >= start && itemDate <= end) {
          return sum + item.cycles;
        }
        return sum;
      }, 0);
    };

    const w1 = getIntervalSum(27, 21);
    const w2 = getIntervalSum(20, 14);
    const w3 = getIntervalSum(13, 7);
    const w4 = getIntervalSum(6, 0);

    return [
      { name: language === 'ar' ? 'الأسبوع ١' : 'Week 1', cycles: w1 },
      { name: language === 'ar' ? 'الأسبوع ٢' : 'Week 2', cycles: w2 },
      { name: language === 'ar' ? 'الأسبوع ٣' : 'Week 3', cycles: w3 },
      { name: language === 'ar' ? 'الحالي' : 'This Week', cycles: w4 },
    ];
  }, [userProgress.breathingHistory, language]);

  const weekData = useMemo(() => {
    const daysRaw = t('days');
    const daysArray = Array.isArray(daysRaw)
      ? daysRaw
      : (typeof daysRaw === 'string' ? daysRaw.split(',') : ['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    return daysArray.map((day: string, i: number) => ({
      day,
      progress: userProgress.weeklyActivity[i] || 0
    }));
  }, [t, userProgress.weeklyActivity]);

  const streakTrendData = useMemo(() => {
    const data = [];
    for (let i = 1; i <= 30; i++) {
      let currentVal = 0;
      if (i <= 8) {
        currentVal = i;
      } else if (i <= 12) {
        currentVal = Math.max(0, i - 8);
      } else if (i <= 26) {
        currentVal = Math.min(14, i - 12);
      } else {
        const targetStreak = userProgress.streak || 4;
        const offset = i - 26;
        currentVal = Math.min(targetStreak, offset);
      }
      
      let prevVal = 0;
      if (i <= 9) {
        prevVal = i;
      } else if (i <= 17) {
        prevVal = i - 9;
      } else if (i <= 24) {
        prevVal = i - 17;
      } else {
        prevVal = (i - 24);
      }

      data.push({
        day: i,
        name: language === 'ar' ? `يوم ${i}` : `Day ${i}`,
        current: currentVal,
        previous: prevVal
      });
    }
    return data;
  }, [userProgress.streak, language]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('progressTitle')}</h1>
      
      {/* 2x2 Stats Grid representing metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md text-center flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700/50 transition duration-300 transform hover:scale-[1.02]">
            <stat.Icon className={`w-8 h-8 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Dynamic 4-7-8 Breathing consistency card */}
      <div className={`p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6 flex flex-col gap-3 ${consistencyLevel.color}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <WindIcon className="w-5 h-5 text-violet-500 animate-pulse" />
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
              {language === 'ar' ? 'تحليل اتساق التنفس 4-7-8' : '4-7-8 Breathing Consistency'}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-200">
            {consistencyLevel.level}
          </span>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          {consistencyLevel.desc}
        </p>

        {/* Dynamic milestone Progress bar */}
        <div className="space-y-1.5 mt-1">
          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            <span>
              {language === 'ar' 
                ? `أكملت ${breathingCycles} دورات` 
                : `${breathingCycles} cycles completed`}
            </span>
            <span>
              {language === 'ar' 
                ? `المستهدف التالي: ${consistencyLevel.progressMax}` 
                : `Next target: ${consistencyLevel.progressMax}`}
            </span>
          </div>
          <div className="w-full bg-gray-200/60 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (breathingCycles / consistencyLevel.progressMax) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Historical 30-day Breathing cycles trend chart using AreaChart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 mb-6">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <WindIcon className="w-5 h-5 text-violet-500" />
          {t('breathingHistoryTitle')}
        </h2>
        <div className="h-60 w-full text-xs font-serif">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyBreathingTrend} margin={{ top: 10, right: 10, left: -22, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCycles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" className="dark:stroke-gray-700/20" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#f3f4f6',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#a78bfa' }}
              />
              <Area 
                type="monotone" 
                dataKey="cycles" 
                stroke="#8b5cf6" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorCycles)" 
                name={t('completedCycles')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Streak Comparison line chart comparing last 30 days vs previous 30 days */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 mb-6">
        <div className="flex flex-col mb-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 text-base">
            <FireIcon className="w-5 h-5 text-amber-500" />
            {language === 'ar' ? 'مقارنة استمرارية الأيام المتتالية (آخر ٣٠ يوماً)' : 'Daily Streak Comparison (Last 30 Days)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {language === 'ar' 
              ? 'مقارنة الحفاظ على عادتك اليومية مع الشهر الماضي للبقاء متحمساً.' 
              : 'Track your streak resilience compared to the previous month\'s performance.'}
          </p>
        </div>

        <div className="h-64 w-full text-xs font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={streakTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" className="dark:stroke-gray-700/20" />
              <XAxis 
                dataKey="day" 
                stroke="#9ca3af" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(tick) => {
                  if (tick === 1 || tick % 5 === 0) {
                    return language === 'ar' ? `يوم ${tick}` : `Day ${tick}`;
                  }
                  return '';
                }}
              />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#f3f4f6',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelFormatter={(value) => language === 'ar' ? `اليوم ${value}` : `Day ${value}`}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                dot={{ r: 2, stroke: '#f59e0b', strokeWidth: 1, fill: '#fff' }}
                activeDot={{ r: 5 }}
                name={language === 'ar' ? 'الشهر الحالي' : 'Current Month'} 
              />
              <Line 
                type="monotone" 
                dataKey="previous" 
                stroke="#9ca3af" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={false}
                name={language === 'ar' ? 'الشهر السابق' : 'Previous Month'} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Motivate card bottom section */}
        <div className="mt-4 p-3.5 bg-amber-500/10 dark:bg-amber-500/5 rounded-xl border border-amber-500/20 flex items-start gap-2.5 text-left rtl:text-right">
          <span className="text-base select-none leading-none">⚡</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-400">
              {language === 'ar' ? 'نصيحة الاستمرارية والاتساق' : 'Consistency Smart Tip'}
            </p>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-normal mt-0.5">
              {language === 'ar'
                ? 'الحفاظ على عادة يومية بسيطة مدة 5 دقائق أكثر فعالية بكثير من ممارسة ساعات طويلة بشكل متقطع. تطلع لتجاوز قمم الشهر السابق!'
                : 'Maintaining a brief 5-minute daily practice generates much more nervous system resilience than sporadic longer efforts. Aim to peak beyond last month\'s line!'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">{t('weeklyActivity')}</h2>
        <div className="flex justify-between items-end h-40">
          {weekData.map((item: { day: string; progress: number }, index: number) => (
            <div key={`${item.day}-${index}`} className="flex flex-col items-center w-1/12 h-full justify-end">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-24 flex items-end">
                <div className="bg-blue-500 rounded-full w-full" style={{ height: `${item.progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.day}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const ProfileScreen = ({ onNavigate, onBack, user }: { onNavigate: (page: string) => void; onBack?: () => void; user: any }) => {
  const { t, language } = useLanguage();
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  const sessionsCompleted = user?.progress?.sessionsCompleted || 0;

  const badges = useMemo(() => [
    {
      id: 'first_step',
      required: 1,
      icon: Zap,
      title: language === 'ar' ? 'خطوة البداية' : 'First Step',
      desc: language === 'ar' ? 'أكمل جلستك الأولى لفتح خطوة البداية.' : 'Complete your first session to unlock.',
      colorClass: 'from-amber-400 to-orange-500',
      shadowClass: 'shadow-amber-500/10 dark:shadow-amber-500/5',
      glowClass: 'bg-amber-500/10 text-amber-500 border-amber-500/30 dark:bg-amber-500/5',
      accentColor: '#f59e0b',
    },
    {
      id: 'mindfulness_novice',
      required: 5,
      icon: Award,
      title: language === 'ar' ? 'مبتدئ اليقظة' : 'Mindfulness Novice',
      desc: language === 'ar' ? 'ابنِ عادتك اليومية. أكمل ٥ جلسات تمرين.' : 'Build your daily habit. Complete 5 sessions.',
      colorClass: 'from-blue-400 to-indigo-600',
      shadowClass: 'shadow-blue-500/10 dark:shadow-blue-500/5',
      glowClass: 'bg-blue-500/10 text-blue-500 border-blue-500/30 dark:bg-blue-500/5',
      accentColor: '#3b82f6',
    },
    {
      id: 'zen_seeker',
      required: 10,
      icon: Shield,
      title: language === 'ar' ? 'ساعي الزن' : 'Zen Seeker',
      desc: language === 'ar' ? 'ابحث عن التوازن العميق والداخلي بـ ١٠ جلسات.' : 'Find deep inner alignment. Complete 10 sessions.',
      colorClass: 'from-emerald-400 to-teal-600',
      shadowClass: 'shadow-emerald-500/10 dark:shadow-emerald-500/5',
      glowClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 dark:bg-emerald-500/5',
      accentColor: '#10b981',
    },
    {
      id: 'master_of_calm',
      required: 25,
      icon: Trophy,
      title: language === 'ar' ? 'سيد الهدوء' : 'Master of Calm',
      desc: language === 'ar' ? 'حقق السكون والسكينة التامة بـ ٢٥ جلسة.' : 'Achieve profound focus and silence. Complete 25 sessions.',
      colorClass: 'from-purple-500 to-pink-600',
      shadowClass: 'shadow-purple-500/10 dark:shadow-purple-500/5',
      glowClass: 'bg-purple-500/10 text-purple-500 border-purple-500/30 dark:bg-purple-500/5',
      accentColor: '#a855f7',
    }
  ], [language]);

  const menuItems = [
    { label: t('settings'), icon: SettingsIcon, action: () => onNavigate('settings') },
    { label: t('favorites'), icon: HeartIcon, action: () => onNavigate('favorites') },
    { label: t('reminders'), icon: BellIcon, action: () => {} },
    { label: t('logout'), icon: LogoutIcon, action: () => {}, isDestructive: true },
  ];

  const handleShare = (badge: any) => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  return (
    <div className="p-6 max-w-md mx-auto w-full pb-24 text-center bg-[#121212] text-[#EDEDED] h-full overflow-y-auto scrollbar-none">
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between mb-4 relative">
        <button
          onClick={onBack || (() => onNavigate('home'))}
          className="p-2 rounded-full bg-[#181818] border border-[#262626] hover:border-[#E2C854]/40 text-[#A3A3A3] hover:text-[#EDEDED] transition cursor-pointer"
          title={language === 'ar' ? 'رجوع' : 'Back'}
        >
          <ArrowIcon className="w-5 h-5 rtl:-scale-x-100" />
        </button>
        <h2 className="text-base font-bold text-[#EDEDED] mx-auto">{t('profile')}</h2>
        <div className="w-9" />
      </div>

      {/* Profile Header */}
      <div className="mb-6">
        <div className="relative inline-block">
          <img 
            src="https://placehold.co/128x128/181818/E2C854?text=👤" 
            alt="Profile" 
            className="w-28 h-28 rounded-full mx-auto mb-3 border-2 border-[#262626] shadow-xl object-cover" 
          />
          <div className="absolute bottom-1 right-1 bg-[#E2C854] p-1.5 rounded-full border-2 border-[#121212] shadow-md">
            <SparklesIcon className="w-4 h-4 text-[#121212]" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-[#EDEDED]">{user.name}</h1>
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <span className="bg-[#181818] text-[#E2C854] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#262626]">
            {t('freeMember')}
          </span>
          <span className="bg-[#181818] text-[#A3A3A3] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#262626]">
            🏁 {sessionsCompleted} {language === 'ar' ? 'جلسات' : 'sessions'}
          </span>
        </div>
      </div>

      {/* Upgrade Call to Action */}
      <button className="w-full bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] py-3 px-6 rounded-2xl font-black text-sm shadow-md active:scale-98 transition flex items-center justify-center gap-2 mb-8 cursor-pointer">
        <CrownIcon className="w-4 h-4 text-[#121212]" /> {t('upgradeToPro')}
      </button>

      {/* Milestone Badges System Block */}
      <div className="text-left rtl:text-right mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base font-extrabold text-[#EDEDED]">
              {t('badgesTitle')}
            </h2>
            <p className="text-[11px] text-[#A3A3A3] leading-normal">
              {t('badgesSubtitle')}
            </p>
          </div>
          <Award className="w-5 h-5 text-[#E2C854]" />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {badges.map((badge) => {
            const isUnlocked = sessionsCompleted >= badge.required;
            const IconComponent = badge.icon;
            
            return (
              <motion.div
                key={badge.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBadge(badge)}
                className={classNames(
                  "p-4 rounded-3xl border text-center cursor-pointer relative overflow-hidden transition-all duration-350 flex flex-col items-center justify-between min-h-[145px]",
                  isUnlocked 
                    ? "bg-[#181818] border-[#262626] hover:border-[#E2C854]/40 shadow-md"
                    : "bg-[#181818]/60 border-dashed border-[#262626] opacity-60 hover:opacity-80"
                )}
              >
                {/* Badge Icon container */}
                <div className="relative mb-2">
                  <div className={classNames(
                    "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300",
                    isUnlocked 
                      ? "bg-gradient-to-tr " + badge.colorClass + " text-white border-transparent"
                      : "bg-[#262626] text-[#A3A3A3] border-transparent"
                  )}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  {/* Status overlay icon */}
                  <div className="absolute -bottom-1 -right-1 rounded-full p-1 border border-[#262626] bg-[#121212] shadow-sm">
                    {isUnlocked ? (
                      <div className="bg-[#E2C854] text-[#121212] rounded-full p-0.5">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    ) : (
                      <div className="bg-[#262626] text-[#A3A3A3] rounded-full p-0.5">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge title & mini progress */}
                <div className="w-full">
                  <h3 className="text-xs font-black text-[#EDEDED] line-clamp-1 mb-1">
                    {badge.title}
                  </h3>
                  
                  {isUnlocked ? (
                    <span className="text-[9px] font-extrabold text-[#E2C854] bg-[#E2C854]/10 px-2 py-0.5 rounded-full inline-block">
                      {t('unlockedStatus')}
                    </span>
                  ) : (
                    <div className="w-full mt-1.5">
                      <div className="flex justify-between items-center text-[8px] text-[#A3A3A3] font-bold mb-1 font-mono">
                        <span>{Math.min(badge.required, sessionsCompleted)}/{badge.required}</span>
                        <span>{Math.round((Math.min(badge.required, sessionsCompleted) / badge.required) * 100)}%</span>
                      </div>
                      <div className="w-full bg-[#262626] h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#E2C854]"
                          style={{ width: `${(Math.min(badge.required, sessionsCompleted) / badge.required) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Profile menu items */}
      <div className="max-w-sm mx-auto space-y-2.5">
        {menuItems.map(item => (
          <button 
            key={item.label} 
            onClick={item.action} 
            className={classNames(
              "w-full p-4 bg-[#181818] rounded-3xl shadow-sm border border-[#262626] hover:border-[#E2C854]/40 flex justify-between items-center active:scale-99 transition cursor-pointer", 
              item.isDestructive ? 'text-red-400 border-red-500/20 bg-red-950/10' : 'text-[#EDEDED]'
            )}
          >
            <div className="flex items-center gap-3.5">
              <item.icon className={classNames("w-5 h-5", item.isDestructive ? 'text-red-400' : 'text-[#E2C854]')} />
              <span className="text-sm font-bold">{item.label}</span>
            </div>
            <ArrowIcon className={classNames("w-5 h-5", item.isDestructive ? 'text-red-400' : 'text-[#A3A3A3]', "rtl:-scale-x-100")} />
          </button>
        ))}
      </div>

      {/* Badge Detail Modal popup */}
      {selectedBadge && (() => {
        const isUnlocked = sessionsCompleted >= selectedBadge.required;
        const BadgeIcon = selectedBadge.icon;
        
        return (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative bg-[#181818] rounded-3xl p-6 max-w-sm w-full border border-[#262626] shadow-2xl text-center"
            >
              {/* Close Button top corner */}
              <button 
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-1.5 rounded-full bg-[#121212] border border-[#262626] text-[#A3A3A3] hover:text-[#EDEDED] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center mt-2.5">
                {/* Big decorative badge frame with ambient colored blur shadow */}
                <div className="relative mb-5">
                  {isUnlocked && (
                    <div className={classNames(
                      "absolute inset-0 rounded-full bg-gradient-to-tr blur-xl opacity-35 scale-125",
                      selectedBadge.colorClass
                    )} />
                  )}
                  
                  <div className={classNames(
                    "w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 shadow-lg",
                    isUnlocked 
                      ? "bg-gradient-to-tr " + selectedBadge.colorClass + " text-white border-transparent"
                      : "bg-[#121212] text-[#A3A3A3] border-dashed border-[#262626]"
                  )}>
                    <BadgeIcon className="w-9 h-9" />
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E2C854] font-mono mb-1">
                  {t('badgeDetailTitle')}
                </span>
                
                <h3 className="text-xl font-extrabold text-[#EDEDED] mb-2">
                  {selectedBadge.title}
                </h3>
                
                <p className="text-xs text-[#A3A3A3] px-2 leading-relaxed mb-5">
                  {selectedBadge.desc}
                </p>

                {/* Progress bar inside modal */}
                <div className="w-full bg-[#121212] p-4 rounded-2xl border border-[#262626] mb-5">
                  <p className="text-xs text-[#A3A3A3] font-bold mb-2">
                    {t('badgeProgress')
                      .replace('{current}', String(Math.min(selectedBadge.required, sessionsCompleted)))
                      .replace('{required}', String(selectedBadge.required))
                    }
                  </p>
                  
                  <div className="w-full bg-[#262626] h-2 rounded-full overflow-hidden">
                    <div 
                      className={classNames(
                        "h-full rounded-full transition-all duration-500",
                        isUnlocked ? "bg-gradient-to-r " + selectedBadge.colorClass : "bg-[#E2C854]"
                      )}
                      style={{ width: `${Math.min(100, (sessionsCompleted / selectedBadge.required) * 100)}%` }}
                    />
                  </div>
                  
                  <p className="text-[10px] text-[#A3A3A3] font-medium mt-2">
                    {t('badgeRequiredSessions').replace('{required}', String(selectedBadge.required))}
                  </p>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex gap-2.5 w-full">
                  {isUnlocked && (
                    <button 
                      onClick={() => handleShare(selectedBadge)}
                      className="flex-1 bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-2xl py-2.5 text-xs font-black shadow-md active:scale-97 transition cursor-pointer"
                    >
                      {language === 'ar' ? 'مشاركة الإنجاز 🔗' : 'Share Achievement 🔗'}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setSelectedBadge(null)}
                    className={classNames(
                      "rounded-2xl py-2.5 text-xs font-black active:scale-97 transition cursor-pointer",
                      isUnlocked 
                        ? "flex-1 bg-[#121212] border border-[#262626] hover:border-[#E2C854]/40 text-[#EDEDED]"
                        : "w-full bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] shadow-md"
                    )}
                  >
                    {t('closeBtn')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}

      {/* Share copied indicator Toast */}
      {showShareToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 animate-bounce flex items-center gap-1.5 font-sans">
          <span>✨</span>
          <span>
            {language === 'ar' ? 'تم نسخ رابط الإنجاز لشارتك!' : 'Achievement link copied to clipboard!'}
          </span>
        </div>
      )}
    </div>
  );
};
const SettingsScreen = ({ onBack, user, setUser, showNotification }: { onBack: () => void; user: any; setUser: React.Dispatch<React.SetStateAction<any>>; showNotification: (s: string) => void }) => {
  const { t, language, setLanguage } = useLanguage();
  const [profileData, setProfileData] = useState(user);

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const handleProfileChange = () => {
    setUser((prev: any) => ({ ...prev, ...profileData }));
    showNotification("Profile Updated!");
  };

  const SettingsSection = ({ title, icon: Icon, children }: any) => (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-3">
        <Icon className="w-5 h-5 text-[#E2C854]" />
        <h2 className="text-base font-semibold text-[#EDEDED]">{title}</h2>
      </div>
      <div className="bg-[#181818] border border-[#262626] rounded-2xl p-4 space-y-4 shadow-sm">{children}</div>
    </div>
  );

  const NotificationItem = ({ label, icon: Icon, enabled, setEnabled }: any) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-[#A3A3A3]" />
        <label className="text-[#EDEDED] text-sm">{label}</label>
      </div>
      <ToggleSwitch
        enabled={enabled}
        setEnabled={(val) => {
          setEnabled(val);
          showNotification(val ? t('notificationEnabled') : t('notificationDisabled'));
        }}
      />
    </div>
  );

  return (
    <div className="p-6 h-full overflow-y-auto scrollbar-none pb-24 bg-[#121212] text-[#EDEDED]">
      <header className="flex items-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 rtl:right-0 rtl:left-auto p-2 rounded-full bg-[#181818] border border-[#262626] hover:border-[#E2C854]/40 text-[#A3A3A3] hover:text-[#EDEDED] cursor-pointer">
          <ArrowIcon className="w-5 h-5 rtl:-scale-x-100" />
        </button>
        <h1 className="text-xl font-bold text-[#EDEDED] mx-auto">{t('settings')}</h1>
      </header>

      <SettingsSection title={t('appearance')} icon={PaletteIcon}>
        <div className="flex justify-around bg-[#121212] border border-[#262626] rounded-xl p-1 gap-1">
          <button
            onClick={() => {
              setUser((u: any) => ({ ...u, settings: { ...u.settings, theme: 'light' } }));
              showNotification(language === 'ar' ? 'تم اختيار الوضع النهاري' : 'Light mode selected');
            }}
            className={classNames('w-full py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition text-xs font-semibold', user.settings.theme === 'light' ? 'bg-[#E2C854] text-[#121212] shadow' : 'text-[#A3A3A3] hover:text-[#EDEDED]')}
          >
            <SunIcon className="w-4 h-4" /> {t('light')}
          </button>
          <button
            onClick={() => {
              setUser((u: any) => ({ ...u, settings: { ...u.settings, theme: 'dark' } }));
              showNotification(language === 'ar' ? 'تم تفعيل الوضع الداكن والمظلم 🌙' : 'Dark mode activated 🌙');
            }}
            className={classNames('w-full py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition text-xs font-semibold', user.settings.theme === 'dark' ? 'bg-[#E2C854] text-[#121212] shadow' : 'text-[#A3A3A3] hover:text-[#EDEDED]')}
          >
            <MoonIcon className="w-4 h-4" /> {t('dark')}
          </button>
          <button
            onClick={() => {
              setUser((u: any) => ({ ...u, settings: { ...u.settings, theme: 'system' } }));
              showNotification(language === 'ar' ? 'تم اختيار مظهر النظام' : 'System theme selected');
            }}
            className={classNames('w-full py-2 rounded-lg cursor-pointer transition text-xs font-semibold', user.settings.theme === 'system' ? 'bg-[#E2C854] text-[#121212] shadow' : 'text-[#A3A3A3] hover:text-[#EDEDED]')}
          >
            {t('system')}
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title={t('profile')} icon={ProfileIcon}>
        <ProfileInput label={t('name')} value={profileData.name} field="name" setData={setProfileData} />
        <ProfileInput label={t('age')} value={profileData.age} field="age" setData={setProfileData} />
        <ProfileInput label={t('gender')} value={profileData.gender} field="gender" setData={setProfileData} />
        <ProfileInput label={t('height')} value={profileData.height} field="height" setData={setProfileData} />
        <ProfileInput label={t('weight')} value={profileData.weight} field="weight" setData={setProfileData} />
        <ProfileInput label={t('goal')} value={profileData.goal} field="goal" setData={setProfileData} />
        <button onClick={handleProfileChange} className="w-full bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] rounded-xl py-2.5 font-bold text-sm transition mt-2 cursor-pointer">{language === 'ar' ? 'حفظ الملف الشخصي' : 'Save Profile'}</button>
      </SettingsSection>

      <SettingsSection title={t('goals')} icon={WindIcon}>
        <div className="flex items-center justify-between py-1">
          <div className="flex flex-col">
            <span className="text-[#EDEDED] font-medium text-sm">{t('breathingGoal')}</span>
            <span className="text-xs text-[#A3A3A3]">
              {language === 'ar' ? 'حدد عدد دورات التنفس المستهدفة يومياً.' : 'Set your daily breathing target cycles.'}
            </span>
          </div>
          <select
            value={user.settings?.breathingDailyGoal || 8}
            onChange={(e) => {
              const val = Number(e.target.value);
              setUser((u: any) => ({
                ...u,
                settings: {
                  ...u.settings,
                  breathingDailyGoal: val
                }
              }));
              showNotification(language === 'ar' ? `تم تحديث الهدف اليومي إلى ${val} دورة` : `Daily goal updated to ${val} cycles`);
            }}
            className="p-2 border border-[#262626] bg-[#121212] text-[#EDEDED] rounded-xl text-sm focus:outline-none focus:border-[#E2C854]"
          >
            <option value="4">4 {t('cycles')}</option>
            <option value="8">8 {t('cycles')}</option>
            <option value="12">12 {t('cycles')}</option>
            <option value="16">16 {t('cycles')}</option>
            <option value="20">20 {t('cycles')}</option>
          </select>
        </div>
      </SettingsSection>

      <SettingsSection title={t('notifications')} icon={BellIcon}>
        <NotificationItem
          label={t('waterReminder')}
          icon={DropletIcon}
          enabled={user.settings.notifications.water}
          setEnabled={(val: boolean) => setUser((u: any) => ({ ...u, settings: { ...u.settings, notifications: { ...u.settings.notifications, water: val } } }))}
        />
        <NotificationItem
          label={t('mealsReminder')}
          icon={UtensilsIcon}
          enabled={user.settings.notifications.meals}
          setEnabled={(val: boolean) => setUser((u: any) => ({ ...u, settings: { ...u.settings, notifications: { ...u.settings.notifications, meals: val } } }))}
        />
        <NotificationItem
          label={t('exerciseReminder')}
          icon={DumbbellIcon}
          enabled={user.settings.notifications.exercise}
          setEnabled={(val: boolean) => setUser((u: any) => ({ ...u, settings: { ...u.settings, notifications: { ...u.settings.notifications, exercise: val } } }))}
        />
      </SettingsSection>

      <SettingsSection title={t('language')} icon={LanguageIcon}>
        <div className="flex justify-around bg-[#121212] border border-[#262626] rounded-xl p-1 gap-1">
          <button onClick={() => setLanguage('ar')} className={classNames('w-full py-2 rounded-lg cursor-pointer transition text-xs font-semibold', language === 'ar' ? 'bg-[#E2C854] text-[#121212] shadow' : 'text-[#A3A3A3] hover:text-[#EDEDED]')}>العربية</button>
          <button onClick={() => setLanguage('en')} className={classNames('w-full py-2 rounded-lg cursor-pointer transition text-xs font-semibold', language === 'en' ? 'bg-[#E2C854] text-[#121212] shadow' : 'text-[#A3A3A3] hover:text-[#EDEDED]')}>English</button>
        </div>
      </SettingsSection>

      <SettingsSection title={t('subscriptions')} icon={CrownIcon}>
        <div className="bg-[#181818] border border-[#E2C854]/40 text-[#EDEDED] p-4 rounded-xl">
          <h3 className="font-bold text-base text-[#E2C854] mb-1">{t('premiumTitle')}</h3>
          <p className="text-xs text-[#A3A3A3] mb-4">{t('premiumText')}</p>
          <button className="bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer">{t('manageSubscription')}</button>
        </div>
      </SettingsSection>
    </div>
  );
};
const FavoritesScreen = ({ onBack, favorites, allSessions, onSelectSession }: { onBack: () => void, favorites: string[], allSessions: any[], onSelectSession: (s: any) => void }) => { 
  const { t } = useLanguage(); 
  const favoriteSessions = useMemo(() => allSessions.filter(s => favorites.includes(s.id)), [favorites, allSessions]); 
  return (
    <div className="p-6 h-full overflow-y-auto scrollbar-none pb-24 bg-[#121212] text-[#EDEDED]">
      <header className="flex items-center mb-8 relative">
        <button onClick={onBack} className="absolute left-0 rtl:right-0 rtl:left-auto p-2.5 rounded-full bg-[#181818] border border-[#262626] text-[#A3A3A3] hover:text-[#EDEDED] cursor-pointer">
          <ArrowIcon className="w-5 h-5 rtl:-scale-x-100" />
        </button>
        <h1 className="text-xl font-bold text-[#EDEDED] mx-auto">{t('favoritesTitle')}</h1>
      </header>
      {favoriteSessions.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {favoriteSessions.map(session => (
            <div key={session.id} onClick={() => onSelectSession(session)} className="cursor-pointer group bg-[#181818] border border-[#262626] rounded-2xl p-2.5 hover:border-[#E2C854]/40 transition">
              <div className="relative overflow-hidden rounded-xl shadow-md aspect-square">
                <CardBackground category={session.category} id={session.id} />
                <div className={`absolute inset-0 bg-gradient-to-t ${session.color}`}></div>
              </div>
              <div className="mt-2">
                <h3 className="font-semibold text-[#EDEDED] text-xs truncate">{useLanguage().language === 'ar' ? session.title : session.title_en}</h3>
                <p className="text-[11px] text-[#A3A3A3]">{session.duration} {t('minutes')}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-[#A3A3A3] mt-20">
          <p>{t('noFavorites')}</p>
        </div>
      )}
    </div>
  ); 
};
const SearchScreen = ({ onBack, allSessions, onSelectSession }: { onBack: () => void, allSessions: any[], onSelectSession: (s: any) => void }) => { 
  const { t, language } = useLanguage(); 
  const [query, setQuery] = useState(''); 
  const searchResults = useMemo(() => { 
    if (!query) return []; 
    return allSessions.filter(s => (s.title.toLowerCase().includes(query.toLowerCase()) || s.title_en.toLowerCase().includes(query.toLowerCase()))); 
  }, [query, allSessions]); 
  return (
    <div className="absolute inset-0 bg-[#121212] text-[#EDEDED] z-40 p-6 flex flex-col">
      <header className="flex items-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 rtl:right-0 rtl:left-auto p-2.5 rounded-full bg-[#181818] border border-[#262626] text-[#A3A3A3] hover:text-[#EDEDED] cursor-pointer">
          <ArrowIcon className="w-5 h-5 rtl:-scale-x-100" />
        </button>
        <h1 className="text-xl font-bold text-[#EDEDED] mx-auto">{t('searchPlaceholder')}</h1>
      </header>
      <div className="relative">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder={t('searchPlaceholder')} 
          className="w-full p-3 pl-10 rtl:pr-10 bg-[#181818] border border-[#262626] text-[#EDEDED] rounded-full shadow-sm focus:outline-none focus:border-[#E2C854] text-sm" 
        />
        <SearchIcon className="w-5 h-5 text-[#A3A3A3] absolute top-1/2 left-4 rtl:right-4 rtl:left-auto transform -translate-y-1/2" />
      </div>
      <div className="mt-6 flex-1 overflow-y-auto scrollbar-none pb-12">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {searchResults.map(session => (
              <div key={session.id} onClick={() => onSelectSession(session)} className="cursor-pointer group bg-[#181818] border border-[#262626] rounded-2xl p-2.5 hover:border-[#E2C854]/40 transition">
                <div className="relative overflow-hidden rounded-xl shadow-md aspect-square">
                  <CardBackground category={session.category} id={session.id} />
                  <div className={`absolute inset-0 bg-gradient-to-t ${session.color}`}></div>
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold text-[#EDEDED] text-xs truncate">{language === 'ar' ? session.title : session.title_en}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : query && (
          <div className="text-center text-[#A3A3A3] mt-20">
            <p>{t('noResults')}</p>
          </div>
        )}
      </div>
    </div>
  ); 
};
const NotificationToast = ({ message, show }: { message: string, show: boolean }) => (<div className={classNames('fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#181818] border border-[#262626] text-[#E2C854] font-semibold text-xs px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300', show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5', 'z-50')}>{message}</div>);
const SessionCompleteScreen = ({ onBack }: { onBack: () => void }) => { 
  const { t } = useLanguage(); 
  return (
    <div className="absolute inset-0 bg-[#121212] text-[#EDEDED] z-30 p-8 flex flex-col items-center justify-center text-center">
      <div className="text-7xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-[#EDEDED] mb-3">{t('sessionCompleteTitle')}</h1>
      <p className="text-sm text-[#A3A3A3] mb-8 max-w-xs">{t('sessionCompleteText')}</p>
      <button onClick={onBack} className="bg-[#E2C854] hover:bg-[#ebd775] text-[#121212] py-3 px-8 rounded-full font-bold shadow-lg transition cursor-pointer active:scale-98">
        {t('backToHome')}
      </button>
    </div>
  ); 
};

const generateMockBreathingHistory = () => {
    const history = [];
    const today = new Date();
    for (let i = 28; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const daySeed = (i * 7 + 3) % 10;
        if (daySeed < 7) { // 70% active days
            const cycles = 4 + (daySeed * 2);
            history.push({ date: dateStr, cycles });
        }
    }
    return history;
};

const AppContent = () => {
    const { language, t, setLanguage } = useLanguage();
    const [appState, setAppState] = useState(() => {
        try {
            const onboarded = localStorage.getItem('aura_onboarding_completed');
            return onboarded ? 'main' : 'loading';
        } catch (e) {
            return 'loading';
        }
    });

    useEffect(() => {
        if (appState === 'loading') {
            const splashTimer = setTimeout(() => {
                setAppState('onboarding');
            }, 1800);
            return () => clearTimeout(splashTimer);
        }
    }, [appState]);
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [isPlayerVisible, setPlayerVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '' });
    const [resumeProgress, setResumeProgress] = useState<number | undefined>(undefined);

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('meditation_user_progress');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.progress) {
                    if (!parsed.progress.breathingHistory) {
                        parsed.progress.breathingHistory = generateMockBreathingHistory();
                    }
                    if (parsed.progress.breathingCyclesCompleted === undefined || parsed.progress.breathingCyclesCompleted === 0) {
                        parsed.progress.breathingCyclesCompleted = parsed.progress.breathingHistory.reduce((s: number, item: any) => s + item.cycles, 0);
                    }
                }
                if (!parsed.settings) {
                    parsed.settings = {};
                }
                if (!parsed.settings.theme) {
                    parsed.settings.theme = 'dark';
                }
                if (parsed.settings.breathingDailyGoal === undefined) {
                    parsed.settings.breathingDailyGoal = 8;
                }
                return parsed;
            } catch (e) {
                // fallback
            }
        }
        const defaultHist = generateMockBreathingHistory();
        const defaultCyclesSum = defaultHist.reduce((s, item) => s + item.cycles, 0);
        return {
            name: 'اسم المستخدم',
            age: '28',
            gender: 'أنثى',
            height: '165 سم',
            weight: '60 كجم',
            goal: 'الاسترخاء',
            progress: {
                sessionsCompleted: 14,
                minutesMeditated: 120,
                streak: 4,
                lastSessionDate: new Date().toISOString().split('T')[0],
                weeklyActivity: [40, 20, 60, 50, 80, 40, 30], // Sun-Sat
                breathingCyclesCompleted: defaultCyclesSum,
                breathingHistory: defaultHist,
            },
            favorites: [] as string[],
            settings: {
                theme: 'dark',
                notifications: { water: true, meals: false, exercise: true },
                breathingDailyGoal: 8,
            },
        };
    });

    useEffect(() => {
        localStorage.setItem('meditation_user_progress', JSON.stringify(user));
    }, [user]);

    const allSessions = useMemo(() => [...mockData.meditation, ...mockData.yoga], []);

    const showNotification = useCallback((message: string) => {
        setNotification({ show: true, message });
        setTimeout(() => {
            setNotification({ show: false, message: '' });
        }, 2000);
    }, []);

    const toggleFavorite = useCallback((sessionId: string) => {
        setUser(prevUser => {
            const newFavorites = prevUser.favorites.includes(sessionId)
                ? prevUser.favorites.filter(id => id !== sessionId)
                : [...prevUser.favorites, sessionId];
            return { ...prevUser, favorites: newFavorites };
        });
    }, []);
    
    const handleSessionComplete = useCallback((session: any) => {
        setUser(prevUser => {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            let newStreak = prevUser.progress.streak;
            if (prevUser.progress.lastSessionDate !== todayStr) {
                 if (prevUser.progress.lastSessionDate === yesterdayStr) {
                    newStreak++;
                } else {
                    newStreak = 1;
                }
            }

            const dayOfWeek = today.getDay(); // Sunday = 0
            const newWeeklyActivity = [...prevUser.progress.weeklyActivity];
            newWeeklyActivity[dayOfWeek] = Math.min(100, (newWeeklyActivity[dayOfWeek] || 0) + (session.duration / 60) * 100);


            return {
                ...prevUser,
                progress: {
                    ...prevUser.progress,
                    sessionsCompleted: prevUser.progress.sessionsCompleted + 1,
                    minutesMeditated: prevUser.progress.minutesMeditated + session.duration,
                    streak: newStreak,
                    lastSessionDate: todayStr as any,
                    weeklyActivity: newWeeklyActivity,
                }
            };
        });
        setPlayerVisible(false);
        setIsSessionComplete(true);
    }, []);

    const handleBreathingComplete = useCallback((cycles: number) => {
        setUser(prevUser => {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            let newStreak = prevUser.progress.streak;
            if (prevUser.progress.lastSessionDate !== todayStr) {
                 if (prevUser.progress.lastSessionDate === yesterdayStr) {
                     newStreak++;
                 } else {
                     newStreak = 1;
                 }
            }

            const dayOfWeek = today.getDay(); // Sunday = 0
            const newWeeklyActivity = [...prevUser.progress.weeklyActivity];
            newWeeklyActivity[dayOfWeek] = Math.min(100, (newWeeklyActivity[dayOfWeek] || 0) + 15);

            const currentHistory = prevUser.progress.breathingHistory ? [...prevUser.progress.breathingHistory] : [];
            const existingDayIndex = currentHistory.findIndex((h: any) => h.date === todayStr);
            if (existingDayIndex >= 0) {
                currentHistory[existingDayIndex] = {
                    ...currentHistory[existingDayIndex],
                    cycles: currentHistory[existingDayIndex].cycles + cycles
                };
            } else {
                currentHistory.push({ date: todayStr, cycles });
            }

            return {
                ...prevUser,
                progress: {
                    ...prevUser.progress,
                    sessionsCompleted: prevUser.progress.sessionsCompleted + 1,
                    minutesMeditated: prevUser.progress.minutesMeditated + Math.ceil((cycles * 19) / 60),
                    streak: newStreak,
                    lastSessionDate: todayStr as any,
                    weeklyActivity: newWeeklyActivity,
                    breathingCyclesCompleted: (prevUser.progress.breathingCyclesCompleted || 0) + cycles,
                    breathingHistory: currentHistory,
                }
            };
        });
        showNotification(language === 'ar' ? `رائع! تم تسجيل ${cycles} دورة تنفس بنجاح` : `Splendid! Logged ${cycles} breathing cycles successfully`);
    }, [language, showNotification]);

    const [history, setHistory] = useState<string[]>(['home']);

    useEffect(() => {
        const theme = user.settings?.theme || 'dark';
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    }, [user.settings?.theme]);

    const mainContainerRef = useRef<HTMLElement>(null);

    // Robust scroll-reset logic across window, document, and scrollable container/children
    const resetScrollPosition = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
        }
        if (mainContainerRef.current) {
            mainContainerRef.current.scrollTop = 0;
            mainContainerRef.current.scrollLeft = 0;
            const scrollableElements = mainContainerRef.current.querySelectorAll('.overflow-y-auto, .overflow-auto, [data-scrollable="true"]');
            scrollableElements.forEach((el) => {
                el.scrollTop = 0;
                el.scrollLeft = 0;
            });
        }
    }, []);

    // Dismisses any open overlays, modals, and player states to prevent lingering state
    const clearAllOverlays = useCallback(() => {
        setSelectedSession(null);
        setPlayerVisible(false);
        setIsSearchVisible(false);
        setIsSessionComplete(false);
        setResumeProgress(undefined);
    }, []);

    // Automatically reset scroll position whenever currentPage changes
    useEffect(() => {
        resetScrollPosition();
        const rafId = requestAnimationFrame(() => {
            resetScrollPosition();
        });
        return () => cancelAnimationFrame(rafId);
    }, [currentPage, resetScrollPosition]);

    const handleNavigate = useCallback((page: string) => {
        if (page === 'search') {
            setSelectedSession(null);
            setPlayerVisible(false);
            setIsSessionComplete(false);
            setResumeProgress(undefined);
            setIsSearchVisible(true);
            return;
        }

        // Switching views: always clear all modals/overlays and reset scroll
        clearAllOverlays();
        resetScrollPosition();

        setCurrentPage(prev => {
            if (prev !== page) {
                setHistory(h => [...h, page]);
            }
            return page;
        });
    }, [clearAllOverlays, resetScrollPosition]);

    const handleBack = useCallback(() => {
        clearAllOverlays();
        resetScrollPosition();
    }, [clearAllOverlays, resetScrollPosition]);

    const handlePlayerBack = useCallback((progressPercentage?: number) => {
        if (selectedSession && progressPercentage !== undefined && progressPercentage > 0 && progressPercentage < 99.9) {
            setUser(prevUser => ({
                ...prevUser,
                progress: {
                    ...prevUser.progress,
                    unfinishedSession: {
                        id: selectedSession.id,
                        progress: progressPercentage,
                        timestamp: Date.now()
                    }
                }
            }));
        }
        clearAllOverlays();
        resetScrollPosition();
    }, [selectedSession, clearAllOverlays, resetScrollPosition]);

    const handleGoBack = useCallback(() => {
        // If an overlay/modal is currently open, dismiss that overlay first
        if (isPlayerVisible) {
            handlePlayerBack();
            return;
        }
        if (isSearchVisible) {
            setIsSearchVisible(false);
            return;
        }
        if (selectedSession) {
            handleBack();
            return;
        }
        if (isSessionComplete) {
            handleBack();
            return;
        }

        // No active overlay: proceed with historical page popping
        clearAllOverlays();
        resetScrollPosition();

        setHistory(prev => {
            if (prev.length <= 1) {
                setCurrentPage('home');
                return ['home'];
            }
            const newHistory = prev.slice(0, -1);
            const prevPage = newHistory[newHistory.length - 1];
            setCurrentPage(prevPage);
            return newHistory;
        });
    }, [isPlayerVisible, isSearchVisible, selectedSession, isSessionComplete, handlePlayerBack, handleBack, clearAllOverlays, resetScrollPosition]);

    // Hardware and browser popstate listener for back navigation
    useEffect(() => {
        const handlePopState = () => {
            handleGoBack();
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [handleGoBack]);

    const handleSelectSession = useCallback((session: any) => {
        clearAllOverlays();
        setSelectedSession(session);
    }, [clearAllOverlays]);

    const handlePlaySession = useCallback(() => {
        if (selectedSession) {
            setResumeProgress(undefined);
            setPlayerVisible(true);
        }
    }, [selectedSession]);

    const handleResumeSession = useCallback((session: any, progress: number) => {
        clearAllOverlays();
        setResumeProgress(progress);
        setSelectedSession(session);
        setPlayerVisible(true);
    }, [clearAllOverlays]);
    
    const handleOnboardingComplete = useCallback(() => {
        try {
            localStorage.setItem('aura_onboarding_completed', 'true');
        } catch (e) {
            // ignore localStorage quota/privacy errors
        }
        setAppState('main');
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'home': 
                return (
                    <VitalityDashboard 
                        user={user} 
                        setUser={setUser}
                        onSelectSession={handleSelectSession} 
                        onNavigate={handleNavigate} 
                        language={language} 
                        setLanguage={setLanguage} 
                        t={t} 
                    />
                );
            case 'sessions':
            case 'meditation':
            case 'yoga':
            case 'breathing':
                return (
                    <MindfulnessScreen 
                        initialTab={currentPage === 'yoga' ? 'yoga' : (currentPage === 'breathing' ? 'breathing' : 'meditation')}
                        onSelectSession={handleSelectSession} 
                        onCompleteBreathing={handleBreathingComplete} 
                        onOpenAICoach={() => handleNavigate('ai-coach')} 
                        user={user} 
                        language={language} 
                        t={t} 
                    />
                );
            case 'longevity':
            case 'progress':
                return (
                    <LongevityScoreScreen 
                        onBack={handleGoBack} 
                        user={user} 
                        language={language} 
                    />
                );
            case 'profile': 
                return <ProfileScreen onBack={handleGoBack} onNavigate={handleNavigate} user={user} />;
            case 'settings': 
                return <SettingsScreen onBack={handleGoBack} user={user} setUser={setUser} showNotification={showNotification} />;
            case 'favorites': 
                return <FavoritesScreen onBack={handleGoBack} favorites={user.favorites} allSessions={allSessions} onSelectSession={handleSelectSession} />;
            case 'ai-coach': 
                return <AICoachScreen onBack={handleGoBack} language={language} t={t} onSelectSession={handleSelectSession} onNavigate={handleNavigate} />;
            default: 
                return (
                    <VitalityDashboard 
                        user={user} 
                        setUser={setUser}
                        onSelectSession={handleSelectSession} 
                        onNavigate={handleNavigate} 
                        language={language} 
                        setLanguage={setLanguage} 
                        t={t} 
                    />
                );
        }
    };

    return (
        <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="h-screen w-full bg-[#121212] text-[#EDEDED] font-sans flex items-center justify-center select-none overflow-hidden antialiased">
            {/* Ambient Lighting Backdrop */}
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E2C854]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Global Styles for Animations */}
            <style>{`
                @keyframes fade-out {
                  from { opacity: 1; }
                  to { opacity: 0; }
                }
                .animate-fade-out {
                  animation: fade-out 0.5s ease-out;
                }
                
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                  animation: fade-in forwards;
                }
            `}</style>
            
            <div className="relative w-full max-w-[420px] h-full md:h-[92vh] md:max-h-[860px] bg-[#121212] border border-[#262626] md:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
                {appState === 'loading' && <SplashScreen />}
                {appState === 'onboarding' && <AuraOnboarding onComplete={handleOnboardingComplete} language={language} />}
                {appState === 'main' && (
                    <>
                        <main ref={mainContainerRef} className="h-full w-full overflow-hidden relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPage}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                    className="h-full w-full overflow-hidden"
                                >
                                    {renderPage()}
                                </motion.div>
                            </AnimatePresence>
                        </main>
                        
                        {/* 3-Button Aura Bottom Navigation Pill Dock */}
                        <AnimatePresence>
                            {!isPlayerVisible && !selectedSession && !isSearchVisible && !isSessionComplete &&
                            ['home', 'sessions', 'meditation', 'yoga', 'breathing', 'longevity', 'progress'].includes(currentPage) && (
                                <motion.div
                                    key="aura-bottom-dock"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 24 }}
                                    transition={{ duration: 0.2 }}
                                    className="pointer-events-none"
                                >
                                    <AuraBottomNav 
                                        currentPage={['meditation', 'yoga', 'breathing'].includes(currentPage) ? 'sessions' : (currentPage === 'progress' ? 'longevity' : currentPage)} 
                                        onNavigate={handleNavigate} 
                                        language={language} 
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Smooth Animated Session Details Screen */}
                        <AnimatePresence>
                            {selectedSession && !isPlayerVisible && (
                                <motion.div
                                    key="session-details-screen"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                    className="absolute inset-0 z-40 bg-[#121212] overflow-hidden"
                                >
                                    <SessionDetailsScreen 
                                        session={selectedSession} 
                                        onBack={handleBack} 
                                        onPlay={handlePlaySession} 
                                        toggleFavorite={toggleFavorite} 
                                        isFavorite={user.favorites.includes(selectedSession.id)} 
                                        language={language} 
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Smooth Animated Player Screen */}
                        <AnimatePresence>
                            {selectedSession && isPlayerVisible && (
                                <motion.div
                                    key="player-screen-modal"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                    className="absolute inset-0 z-50 bg-[#121212] overflow-hidden"
                                >
                                    <PlayerScreen 
                                        session={selectedSession} 
                                        onBack={handlePlayerBack} 
                                        initialProgress={resumeProgress} 
                                        toggleFavorite={toggleFavorite} 
                                        isFavorite={user.favorites.includes(selectedSession.id)} 
                                        onSessionComplete={handleSessionComplete} 
                                        language={language} 
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Smooth Animated Search Screen */}
                        <AnimatePresence>
                            {isSearchVisible && (
                                <motion.div
                                    key="search-screen-modal"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 z-50 bg-[#121212]"
                                >
                                    <SearchScreen 
                                        onBack={() => setIsSearchVisible(false)} 
                                        allSessions={allSessions} 
                                        onSelectSession={handleSelectSession} 
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Smooth Animated Session Complete Screen */}
                        <AnimatePresence>
                            {isSessionComplete && (
                                <motion.div
                                    key="session-complete-screen-modal"
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.92 }}
                                    transition={{ duration: 0.25 }}
                                    className="absolute inset-0 z-50 bg-[#121212]"
                                >
                                    <SessionCompleteScreen onBack={() => {
                                        clearAllOverlays();
                                        handleNavigate('home');
                                    }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
                <NotificationToast message={notification.message} show={notification.show} />
            </div>
        </div>
    );
}

const BottomNav = ({ currentPage, onNavigate }: { currentPage: string, onNavigate: (p: string) => void }) => { 
  const { language } = useLanguage();
  return <AuraBottomNav currentPage={currentPage} onNavigate={onNavigate} language={language} />;
};

// --- MAIN APP WRAPPER ---
export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
