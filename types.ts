
export enum GameStatus {
  IDLE = 'IDLE',
  SHUFFLING = 'SHUFFLING',
  GUESSING = 'GUESSING',
  REVEALED = 'REVEALED'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXTREME = 'EXTREME'
}

export interface CupProps {
  id: number;
  slotIndex: number; // The visual position (0, 1, 2)
  hasBall: boolean;
  isLifted: boolean;
  isCorrect?: boolean; // For showing green/red ring
  isWrong?: boolean;
  onClick: () => void;
  disabled: boolean;
  totalSlots: number;
  transitionDuration?: number; // Controls the speed of movement
  depth?: number; // -1: Back (Far), 0: Middle, 1: Front (Close)
}
