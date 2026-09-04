import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Wind, 
  Play, 
  Flame, 
  Clock, 
  Search, 
  Filter,
  CheckCircle,
  Moon
} from 'lucide-react';
import { AuraStatusBar } from './AuraHeader';
import { mockData, SessionData } from '../data/sessions';
import BreathingTimer from './BreathingTimer';

interface MindfulnessScreenProps {
  initialTab?: 'meditation' | 'yoga' | 'breathing';
  onSelectSession: (session: any) => void;
  onCompleteBreathing: (cycles: number) => void;
  onOpenAICoach: () => void;
  user: any;
  language: string;
  t: (key: string) => string;
}

export const MindfulnessScreen: React.FC<MindfulnessScreenProps> = ({
  initialTab = 'meditation',
  onSelectSession,
  onCompleteBreathing,
  onOpenAICoach,
  user,
  language,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<'meditation' | 'yoga' | 'breathing'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'focus', labelAr: 'التركيز', labelEn: 'Focus' },
    { id: 'relaxation', labelAr: 'الاسترخاء', labelEn: 'Relaxation' },
    { id: 'sleep', labelAr: 'النوم العميق', labelEn: 'Deep Sleep' },
    { id: 'stressRelief', labelAr: 'تخفيف التوتر', labelEn: 'Stress Relief' },
  ];

  const currentSessions = activeTab === 'meditation' ? mockData.meditation : mockData.yoga;

  const filteredSessions = useMemo(() => {
    return currentSessions.filter((session) => {
      const matchCategory = activeCategory === 'all' || session.category === activeCategory;
      const title = language === 'ar' ? session.title : session.title_en;
      const matchSearch = searchQuery.trim() === '' || title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [currentSessions, activeCategory, searchQuery, language]);

  return (
    <div className="relative w-full h-full bg-[#0C0C0E] text-white flex flex-col overflow-y-auto scrollbar-none pb-28 select-none">
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/3 w-80 h-72 bg-[#E2C854]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status Bar */}
      <AuraStatusBar time="11:30" />

      {/* Header */}
      <div className="px-6 pt-2 pb-3 flex items-center justify-between z-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#EDEDED] flex items-center gap-2">
            <span>{language === 'ar' ? 'السكينة والتدفق' : 'Mindfulness & Flow'}</span>
            <Moon className="w-5 h-5 text-[#E2C854]" />
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            {language === 'ar' ? 'جلسات بيومترية لتهدئة الجهاز العصبي' : 'Biometric neural restoration sessions'}
          </p>
        </div>

        {/* AI Coach Quick Badge */}
        <button
          onClick={onOpenAICoach}
          className="w-10 h-10 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#E2C854] hover:border-[#E2C854]/40 hover:scale-105 transition-all cursor-pointer"
          title="AI Coach"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Sub-Tabs */}
      <div className="px-6 py-2 flex items-center gap-2 z-10">
        <button
          onClick={() => setActiveTab('meditation')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'meditation'
              ? 'bg-[#E2C854] text-[#121212] shadow-[0_2px_12px_rgba(226,200,84,0.3)]'
              : 'bg-[#181818] text-[#A3A3A3] hover:text-[#EDEDED] border border-[#262626]'
          }`}
        >
          {language === 'ar' ? 'التأمل الواعي' : 'Meditation'}
        </button>

        <button
          onClick={() => setActiveTab('yoga')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'yoga'
              ? 'bg-[#E2C854] text-[#121212] shadow-[0_2px_12px_rgba(226,200,84,0.3)]'
              : 'bg-[#181818] text-[#A3A3A3] hover:text-[#EDEDED] border border-[#262626]'
          }`}
        >
          {language === 'ar' ? 'اليوغا الحيوية' : 'Yoga'}
        </button>

        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'breathing'
              ? 'bg-[#E2C854] text-[#121212] shadow-[0_2px_12px_rgba(226,200,84,0.3)]'
              : 'bg-[#181818] text-[#A3A3A3] hover:text-[#EDEDED] border border-[#262626]'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'التنفس 4-7-8' : '4-7-8 Breath'}</span>
        </button>
      </div>

      {activeTab === 'breathing' ? (
        <div className="px-6 py-4 z-10">
          <BreathingTimer onComplete={onCompleteBreathing} user={user} />
        </div>
      ) : (
        <div className="px-6 space-y-4 z-10 mt-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute top-3 ltr:left-3.5 rtl:right-3.5 text-[#A3A3A3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث عن جلسة تأمل أو تدفق...' : 'Search meditation or flow...'}
              className="w-full bg-[#181818] border border-[#262626] rounded-2xl py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-xs text-[#EDEDED] placeholder-[#737373] focus:outline-none focus:border-[#E2C854]/60 transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E2C854]/15 text-[#E2C854] border border-[#E2C854]/40 font-semibold'
                      : 'bg-[#181818] text-[#A3A3A3] hover:text-[#EDEDED] border border-[#262626]'
                  }`}
                >
                  {language === 'ar' ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Session Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredSessions.map((session) => (
              <motion.div
                key={session.id}
                onClick={() => onSelectSession(session)}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#181818] border border-[#262626] hover:border-[#383838] rounded-[24px] p-4 shadow-sm cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#222222] flex items-center justify-center border border-[#2A2A2A] text-[#E2C854] flex-shrink-0">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-[#EDEDED] group-hover:text-[#E2C854] transition-colors line-clamp-1">
                      {language === 'ar' ? session.title : session.title_en}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#A3A3A3] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[#E2C854]" />
                        {session.duration} {language === 'ar' ? 'دقائق' : 'min'}
                      </span>
                      <span className="text-[10px] text-[#525252]">•</span>
                      <span className="text-[10px] text-[#E2C854] font-medium">
                        {session.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#222222] border border-[#2A2A2A] flex items-center justify-center text-[#A3A3A3] group-hover:text-[#EDEDED] group-hover:border-[#E2C854]/40 transition-all flex-shrink-0">
                  <Play className="w-3 h-3 fill-current" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MindfulnessScreen;
