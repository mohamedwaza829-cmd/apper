export interface SessionData {
  id: string;
  title: string;
  title_en: string;
  duration: number;
  category: string;
  color: string;
}

export const mockData = {
  meditation: [
    { id: 'm1', title: 'تنفس الصباح الحيوي', title_en: 'Morning Vitality Breath', duration: 5, category: 'focus', color: 'from-[#E2C854]/20 to-emerald-900/30' },
    { id: 'm2', title: 'استرخاء مسائي وهدوء عصبي', title_en: 'Evening Neural Calm', duration: 10, category: 'relaxation', color: 'from-emerald-950/40 to-[#E2C854]/10' },
    { id: 'm3', title: 'نوم عميق وترميم الخلايا', title_en: 'Deep Sleep & Cell Repair', duration: 20, category: 'sleep', color: 'from-slate-900/70 to-[#8E927C]/20' },
    { id: 'm4', title: 'تخفيف التوتر وخفض الكورتيزول', title_en: 'Cortisol Reset & De-stress', duration: 10, category: 'stressRelief', color: 'from-[#E2C854]/15 to-teal-950/40' },
    { id: 'm5', title: 'لحظة يقظة وتوازن حيوي', title_en: 'Vital Equilibrium Moment', duration: 5, category: 'relaxation', color: 'from-zinc-900/80 to-[#E2C854]/20' },
  ] as SessionData[],
  yoga: [
    { id: 'y1', title: 'يوغا الصباح للمبتدئين', title_en: 'Morning Yoga for Beginners', duration: 15, category: 'beginner', color: 'from-[#E2C854]/20 to-lime-950/40' },
    { id: 'y2', title: 'تدفق الطاقة والحيوية', title_en: 'Vital Energy Flow', duration: 25, category: 'intermediate', color: 'from-emerald-900/30 to-[#E2C854]/20' },
    { id: 'y3', title: 'مرونة متقدمة وإطالة العضلات', title_en: 'Bio-Flexibility & Range', duration: 40, category: 'advanced', color: 'from-[#8E927C]/30 to-[#0C0C0E]' },
    { id: 'y4', title: 'يوغا الاسترخاء الليلي', title_en: 'Nocturnal Restorative Flow', duration: 20, category: 'beginner', color: 'from-[#E2C854]/10 to-zinc-900/60' },
  ] as SessionData[],
};
