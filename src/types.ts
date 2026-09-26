export interface Animal {
  id: string;
  level: number;
  name: string;
  species: string;
  title: string;
  imageSrc: string;
  bio: string;
  favoriteFood: string;
  personality: string;
  quote: string;
  soundType: 'kitten' | 'panda' | 'penguin' | 'corgi' | 'axolotl' | 'koala' | 'fox';
  accentColor: string; // Tailwind color class or hex
  badgeColor: string;
  ambientEmoji: string;
  funFact: string; // Short fun fact for Collector's Album
  habitat: string; // Habitat description
  rarity: 'Común' | 'Raro' | 'Místico' | 'Legendario';
  stickerNumber: number; // Album sticker number (#01, #02, etc.)
}

export interface PuzzlePiece {
  id: number; // 0..8
  row: number; // 0..2
  col: number; // 0..2
  currentRotation: number; // 0, 90, 180, 270
  targetRotation: 0;
  isPlaced: boolean;
  placedRow?: number;
  placedCol?: number;
  isLocked: boolean; // true if placed in correct row & col with correct rotation
}

export interface LevelConfig {
  levelNumber: number;
  animalId: string;
  hasRotation: boolean;
  hasTimer: boolean;
  targetSecondsFor3Stars: number;
  targetSecondsFor2Stars: number;
  hasGhostGuideDefault: boolean;
  difficultyTitle: string;
  difficultyDescription: string;
}

export interface LevelStats {
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0..3
  bestTimeSeconds: number | null;
  attempts: number;
}

export type ActiveTab = 'puzzle' | 'album' | 'sanctuary' | 'levels' | 'how_to_play';
