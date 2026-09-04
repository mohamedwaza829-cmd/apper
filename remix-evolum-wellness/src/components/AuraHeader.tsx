import React from 'react';
import { Wifi, BatteryMedium, Sparkles, Moon, Sun, Globe } from 'lucide-react';

interface AuraStatusBarProps {
  time?: string;
  className?: string;
}

export const AuraStatusBar: React.FC<AuraStatusBarProps> = ({
  time = "11:30",
  className = "",
}) => {
  return (
    <div className={`w-full px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-white/80 select-none z-30 ${className}`}>
      <span className="font-mono tracking-tight text-[13px]">{time}</span>
      <div className="flex items-center gap-2 text-white/70">
        {/* Signal dots */}
        <div className="flex items-end gap-0.5 h-2.5">
          <div className="w-0.5 h-1 bg-white/70 rounded-full" />
          <div className="w-0.5 h-1.5 bg-white/70 rounded-full" />
          <div className="w-0.5 h-2 bg-white/70 rounded-full" />
          <div className="w-0.5 h-2.5 bg-white rounded-full" />
        </div>
        <Wifi className="w-3.5 h-3.5 text-white/80" />
        <div className="flex items-center gap-1">
          <div className="w-5 h-2.5 rounded-sm border border-white/70 p-0.5 flex items-center">
            <div className="h-full w-3.5 bg-[#E2C854] rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
