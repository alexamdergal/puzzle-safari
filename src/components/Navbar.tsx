import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy, Grid, BookOpen, BookMarked } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  unlockedCount: number;
  totalAnimals: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  unlockedCount,
  totalAnimals,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('puzzle')}
          className="text-left font-display font-bold text-xl sm:text-2xl text-amber-950 tracking-tight hover:opacity-85 transition-opacity flex items-center gap-1.5 focus-visible:outline-hidden"
        >
          <span className="text-pink-500">🐾</span>
          <span>Chibi Puzzle Safari</span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-4 md:gap-5 text-sm font-medium">
          <button
            onClick={() => onSelectTab('puzzle')}
            className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'puzzle'
                ? 'bg-amber-100 text-amber-950 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-amber-950 hover:bg-amber-50'
            }`}
          >
            <Grid className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Rompecabezas</span>
            <span className="sm:hidden">Puzzle</span>
          </button>

          <button
            onClick={() => onSelectTab('album')}
            className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'album'
                ? 'bg-amber-950 text-amber-50 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-amber-950 hover:bg-amber-50'
            }`}
          >
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span>Álbum ({unlockedCount}/{totalAnimals})</span>
          </button>

          <button
            onClick={() => onSelectTab('sanctuary')}
            className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'sanctuary'
                ? 'bg-pink-100 text-pink-950 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-pink-950 hover:bg-pink-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="hidden md:inline">Santuario</span>
          </button>

          <button
            onClick={() => onSelectTab('levels')}
            className={`hidden sm:flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'levels'
                ? 'bg-amber-100 text-amber-950 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-amber-950 hover:bg-amber-50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Niveles</span>
          </button>

          <button
            onClick={() => onSelectTab('how_to_play')}
            className={`hidden lg:flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'how_to_play'
                ? 'bg-amber-100 text-amber-950 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-amber-950 hover:bg-amber-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Instrucciones</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-2 text-slate-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all shadow-xs"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
