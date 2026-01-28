export interface HistoryEntry {
  tabla: number;
  op: string;
  tiempo: string; // Time spent as a string, e.g., "3.45"
  acierto: 0 | 1; // 1 for correct, 0 for wrong
  fecha: string; // Date string, e.g., "1/1/2023"
}

export interface Player {
  name: string;
  avatar: string;
  unlocked: number; // Max table unlocked
  coins: number;
  lives: number;
  history: HistoryEntry[];
  highScore: number;
  unlockedAvatars?: string[]; // New: List of avatar emojis unlocked by the player
}

export interface Session {
  table: number;
  step: number;
  maxSteps: number;
  correct: number;
  ans: number;
  // In a browser environment, setTimeout returns a number, not NodeJS.Timeout.
  timer: number | null;
  timeVal: number;
  startTime: number;
  diff: number; // difficulty based on table, affects timer
}

export interface FeedbackOption {
  audio: string;
  msg: string;
}

export interface AvatarStoreItem {
  emoji: string;
  name: string;
  cost: number;
}