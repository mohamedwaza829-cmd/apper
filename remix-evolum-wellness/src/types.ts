export interface UserProgress {
  streak: number;
  sessionsCompleted: number;
  minutesMeditated: number;
  breathingCyclesCompleted: number;
  weeklyActivity: number[];
  breathingHistory: Array<{ date: string; cycles: number }>;
  lastSessionDate?: string;
  unfinishedSession?: {
    id: string;
    progress: number;
    timestamp: number;
  };
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  language: 'ar' | 'en';
  notifications: {
    water: boolean;
    meals: boolean;
    exercise: boolean;
  };
}

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  goal: string;
  favorites: string[];
  progress: UserProgress;
  settings: UserSettings;
}

export interface AuraMetrics {
  heartRate: number;
  metabolicAge: number;
  auraAge: number;
  chronologicalAge: number;
  paceOfAging: number;
  zone: string;
  lastSync: string;
  status: 'connected' | 'pairing' | 'idle';
}
