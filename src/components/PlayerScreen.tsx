import React from 'react';
import { X, Play, Pause, RotateCcw, RotateCw, Sparkles, Activity } from 'lucide-react';
import { SessionItem } from '../types';

interface Props {
  session: SessionItem;
  isArabic: boolean;
  isPlaying: boolean;
  playbackProgress: number;
  onTogglePlayPause: () => void;
  onSeek: (progress: number) => void;
  onClose: () => void;
}

export const PlayerScreen: React.FC<Props> = ({
  session,
  isArabic,
  isPlaying,
  playbackProgress,
  onTogglePlayPause,
  onSeek,
  onClose
}) => {
  const totalSecs = session.durationMinutes * 60;
  const currentSecs = Math.floor(totalSecs * playbackProgress);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#232014] via-[#121212] to-[#0D0D0F] max-w-md mx-auto p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={onClose}
          className="p-2.5 bg-[#181818] border border-[#262626] rounded-full text-[#EDEDED] hover:bg-[#222222] transition-colors"
        >
          <X size={20} />
        </button>
        <span className="px-3 py-1 bg-[#181818] border border-[#262626] rounded-full text-xs font-semibold text-[#E2C854]">
          {session.isYoga
            ? (isArabic ? 'يوغا وحركة' : 'Yoga Flow')
            : (isArabic ? 'تأمل موجه' : 'Guided Meditation')}
        </span>
      </div>

      {/* Center Visual Orb */}
      <div className="flex flex-col items-center my-6">
        <div className="relative w-56 h-56 rounded-full bg-[#E2C854]/20 border border-[#E2C854]/40 flex items-center justify-center shadow-2xl">
          <div className="w-36 h-36 rounded-full bg-[#0A0A0A] border border-[#262626] flex items-center justify-center text-[#E2C854]">
            {session.isYoga ? <Activity size={54} /> : <Sparkles size={54} />}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-[#EDEDED]">
          {isArabic ? session.title : session.titleEn}
        </h2>
        <p className="text-xs text-[#A3A3A3] max-w-xs mx-auto leading-relaxed">
          {session.description}
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={playbackProgress}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full accent-[#E2C854] bg-[#262626] h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#A3A3A3]">
            <span>{formatTime(currentSecs)}</span>
            <span>{formatTime(totalSecs)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6 space-x-reverse pt-2">
          <button
            onClick={() => onSeek(Math.max(0, playbackProgress - 0.05))}
            className="text-[#EDEDED] hover:text-[#E2C854] transition-colors"
          >
            <RotateCcw size={28} />
          </button>

          <button
            onClick={onTogglePlayPause}
            className="w-16 h-16 rounded-full bg-[#E2C854] text-[#121212] flex items-center justify-center hover:bg-[#d8bd48] transition-colors shadow-lg"
          >
            {isPlaying ? <Pause size={28} fill="#121212" /> : <Play size={28} fill="#121212" className="ml-1" />}
          </button>

          <button
            onClick={() => onSeek(Math.min(1, playbackProgress + 0.05))}
            className="text-[#EDEDED] hover:text-[#E2C854] transition-colors"
          >
            <RotateCw size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};
