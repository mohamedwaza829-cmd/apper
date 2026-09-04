import { SessionItem, BadgeItem } from '../types';

export const meditations: SessionItem[] = [
  {
    id: 'm1',
    title: 'تنفس الصباح الحيوي',
    titleEn: 'Morning Vitality Breath',
    durationMinutes: 5,
    category: 'focus',
    description: 'Start your day with diaphragmatic breathwork to awaken cellular vitality.'
  },
  {
    id: 'm2',
    title: 'استرخاء مسائي وهدوء عصبي',
    titleEn: 'Evening Neural Calm',
    durationMinutes: 10,
    category: 'relaxation',
    description: 'Soothe your vagus nerve and transition into a serene state of mind.'
  },
  {
    id: 'm3',
    title: 'نوم عميق وترميم الخلايا',
    titleEn: 'Deep Sleep & Cell Repair',
    durationMinutes: 20,
    category: 'sleep',
    description: 'Gentle delta-wave meditation to promote deep regenerative sleep cycles.'
  },
  {
    id: 'm4',
    title: 'تخفيف التوتر وخفض الكورتيزول',
    titleEn: 'Cortisol Reset & De-stress',
    durationMinutes: 10,
    category: 'stressRelief',
    description: 'A targeted somatic meditation to regulate stress hormones quickly.'
  },
  {
    id: 'm5',
    title: 'لحظة يقظة وتوازن حيوي',
    titleEn: 'Vital Equilibrium Moment',
    durationMinutes: 5,
    category: 'relaxation',
    description: 'Mid-day conscious reset to regain centered awareness and focus.'
  }
];

export const yogaSessions: SessionItem[] = [
  {
    id: 'y1',
    title: 'يوغا الصباح للمبتدئين',
    titleEn: 'Morning Yoga for Beginners',
    durationMinutes: 15,
    category: 'beginner',
    isYoga: true,
    description: 'Gentle spinal mobility and joint opening sequences for morning flow.'
  },
  {
    id: 'y2',
    title: 'تدفق الطاقة والحيوية',
    titleEn: 'Vital Energy Flow',
    durationMinutes: 25,
    category: 'intermediate',
    isYoga: true,
    description: 'Invigorating Vinyasa flow focusing on stamina, core, and posture.'
  },
  {
    id: 'y3',
    title: 'مرونة متقدمة وإطالة العضلات',
    titleEn: 'Bio-Flexibility & Range',
    durationMinutes: 40,
    category: 'advanced',
    isYoga: true,
    description: 'Deep fascia stretching and flexibility conditioning for longevity.'
  },
  {
    id: 'y4',
    title: 'يوغا الاسترخاء الليلي',
    titleEn: 'Nocturnal Restorative Flow',
    durationMinutes: 20,
    category: 'beginner',
    isYoga: true,
    description: 'Restorative Yin yoga asanas to unwind muscular tension before bed.'
  }
];

export const badges: BadgeItem[] = [
  { id: 'b1', title: 'المبتدئ الواعي', titleEn: 'Conscious Starter', description: 'أكمل جلستك الأولى', requiredSessions: 1, isUnlocked: true },
  { id: 'b2', title: 'رائد التنفس', titleEn: 'Breath Pioneer', description: 'أكمل 5 جلسات تنفس عميق', requiredSessions: 5, isUnlocked: true },
  { id: 'b3', title: 'نجم الاستمرارية', titleEn: 'Consistency Star', description: 'سلسلة أيام متتالية لمدة 7 أيام', requiredSessions: 7, isUnlocked: false },
  { id: 'b4', title: 'سيد الهدوء', titleEn: 'Master of Calm', description: 'أكمل 20 جلسة استرخاء وتأمل', requiredSessions: 20, isUnlocked: false },
  { id: 'b5', title: 'محارب اليوغا', titleEn: 'Yoga Warrior', description: 'أكمل 15 جلسة يوغا وحركة', requiredSessions: 15, isUnlocked: false }
];
