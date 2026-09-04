export interface SessionItem {
  id: string;
  title: string;
  titleEn: string;
  durationMinutes: number;
  category: string;
  isYoga?: boolean;
  description: string;
  audioUrl?: string;
}

export type BreathingPhase = 'INHALE' | 'HOLD' | 'EXHALE';

export interface AuraMetrics {
  heartRate: number;
  metabolicAge: number;
  auraAge: number;
  chronologicalAge: number;
  paceOfAging: number;
  zone: string;
  lastSync: string;
  status: string;
}

export interface UserProgress {
  streak: number;
  sessionsCompleted: number;
  minutesMeditated: number;
  breathingCyclesCompleted: number;
  weeklyActivity: number[];
}

export interface BadgeItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  requiredSessions: number;
  isUnlocked: boolean;
}

export interface AICoachMessage {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: number;
}
