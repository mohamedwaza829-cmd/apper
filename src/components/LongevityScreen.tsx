import React from 'react';
import { Heart, Activity, Moon, Zap } from 'lucide-react';
import { AuraMetrics } from '../types';

interface Props {
  isArabic: boolean;
  metrics: AuraMetrics;
}

export const LongevityScreen: React.FC<Props> = ({ isArabic, metrics }) => {
  return (
    <div className="space-y-4 pb-24 pt-2">
      <div>
        <h1 className="text-xl font-bold text-[#E2C854]">
          {isArabic ? 'مؤشرات طول العمر والحيوية الأيضية' : 'Longevity & Metabolic Biomarkers'}
        </h1>
        <p className="text-xs text-[#A3A3A3] mt-0.5">
          {isArabic ? 'تتبع العمر البيولوجي وسرعة الشيخوخة ونشاط القلب' : 'Track biological age, aging rate, and restorative physiology'}
        </p>
      </div>

      {/* Hero Longevity Card */}
      <div className="bg-[#181818] border border-[#E2C854]/40 rounded-2xl p-5 shadow-xl space-y-3">
        <p className="text-xs text-[#A3A3A3]">
          {isArabic ? 'العمر البيولوجي المقدر' : 'Calculated Biological Age'}
        </p>
        <div className="flex justify-between items-end">
          <div className="flex items-baseline space-x-1 space-x-reverse">
            <span className="text-5xl font-extrabold text-[#E2C854]">{metrics.auraAge}</span>
            <span className="text-sm font-semibold text-[#EDEDED]">{isArabic ? 'سنة' : 'yrs'}</span>
          </div>
          <span className="bg-[#064E3B] text-[#34D399] px-3 py-1 rounded-xl text-xs font-semibold">
            -{metrics.chronologicalAge - metrics.auraAge} {isArabic ? 'سنوات شباب' : 'years younger'}
          </span>
        </div>
        <p className="text-xs text-[#A3A3A3] border-t border-[#262626] pt-3">
          {isArabic
            ? `عمرك الزمني: ${metrics.chronologicalAge} سنة | وتيرة الشيخوخة: ${metrics.paceOfAging}x سنوياً`
            : `Chronological: ${metrics.chronologicalAge} yrs | Pace of aging: ${metrics.paceOfAging}x/yr`}
        </p>
      </div>

      {/* 4 Biometrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#181818] border border-[#262626] rounded-xl p-3.5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#E2C854]">
            <Heart size={16} />
          </div>
          <div>
            <p className="text-[11px] text-[#A3A3A3]">{isArabic ? 'نبض الراحة' : 'Resting HR'}</p>
            <p className="text-lg font-bold text-[#EDEDED]">{metrics.heartRate} bpm</p>
            <p className="text-[10px] text-[#34D399]">{isArabic ? 'ممتاز' : 'Optimal'}</p>
          </div>
        </div>

        <div className="bg-[#181818] border border-[#262626] rounded-xl p-3.5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#E2C854]">
            <Zap size={16} />
          </div>
          <div>
            <p className="text-[11px] text-[#A3A3A3]">{isArabic ? 'وتيرة الشيخوخة' : 'Aging Pace'}</p>
            <p className="text-lg font-bold text-[#EDEDED]">{metrics.paceOfAging}x</p>
            <p className="text-[10px] text-[#34D399]">{isArabic ? 'متباطئة (-12%)' : 'Slowed (-12%)'}</p>
          </div>
        </div>

        <div className="bg-[#181818] border border-[#262626] rounded-xl p-3.5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#E2C854]">
            <Activity size={16} />
          </div>
          <div>
            <p className="text-[11px] text-[#A3A3A3]">{isArabic ? 'معدل تقلب النبض' : 'HRV Index'}</p>
            <p className="text-lg font-bold text-[#EDEDED]">68 ms</p>
            <p className="text-[10px] text-[#34D399]">{isArabic ? 'تعافي مرتفع' : 'High Recovery'}</p>
          </div>
        </div>

        <div className="bg-[#181818] border border-[#262626] rounded-xl p-3.5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#E2C854]">
            <Moon size={16} />
          </div>
          <div>
            <p className="text-[11px] text-[#A3A3A3]">{isArabic ? 'نوم ترميم الخلايا' : 'Cellular Sleep'}</p>
            <p className="text-lg font-bold text-[#EDEDED]">2h 15m</p>
            <p className="text-[10px] text-[#34D399]">{isArabic ? 'نوم عميق' : 'Deep Stage'}</p>
          </div>
        </div>
      </div>

      {/* Protocol Card */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-semibold text-[#E2C854]">
          {isArabic ? 'بروتوكول اليوم لطول العمر' : "Today's Longevity Protocol"}
        </h3>
        <ul className="text-xs text-[#EDEDED] space-y-1.5 leading-relaxed">
          <li>{isArabic ? '• 15 دقيقة يوغا لتحسين مرونة الشرايين وتصريف السوائل اللمفاوية' : '• 15 min morning yoga flow for arterial elasticity & lymph drainage'}</li>
          <li>{isArabic ? '• 5 دقائق تنفس رنان لخفض ضغط الدم الموضعي' : '• 5 min resonant breathwork for autonomic vagal balance'}</li>
          <li>{isArabic ? '• الامتناع عن الشاشات الزرقاء قبل 45 دقيقة من النوم' : '• Digital blue light sunset 45 mins before sleep'}</li>
        </ul>
      </div>
    </div>
  );
};
