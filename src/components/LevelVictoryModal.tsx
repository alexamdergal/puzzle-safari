import React from 'react';
import { Star, Trophy, Sparkles, Heart, ArrowRight, RotateCcw } from 'lucide-react';
import { Animal, LevelConfig } from '../types';

interface LevelVictoryModalProps {
  animal: Animal;
  levelConfig: LevelConfig;
  stars: number;
  timeSeconds: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onGoToSanctuary: () => void;
  onGoToAlbum: () => void;
}

export const LevelVictoryModal: React.FC<LevelVictoryModalProps> = ({
  animal,
  stars,
  timeSeconds,
  hasNextLevel,
  onNextLevel,
  onReplayLevel,
  onGoToSanctuary,
  onGoToAlbum,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 via-white to-pink-50 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl overflow-hidden text-center max-h-[90vh] overflow-y-auto">
        {/* Decorative corner sparkles */}
        <div className="absolute top-3 left-4 text-2xl animate-bounce-short">✨</div>
        <div className="absolute top-3 right-4 text-2xl animate-bounce-short">🎉</div>

        {/* Victory Header */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm rounded-full border border-amber-300 shadow-xs mb-3">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>¡ROMPECABEZAS RESUELTO!</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-950 mb-1">
          ¡Nivel {animal.level} Superado!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-4">
          Completado en <strong className="text-slate-800 font-mono">{formatTime(timeSeconds)}</strong>
        </p>

        {/* Stars earned display */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIndex) => (
            <div
              key={starIndex}
              className={`p-2 rounded-2xl transition-transform duration-300 ${
                starIndex <= stars
                  ? 'bg-amber-100 text-amber-500 scale-110 shadow-sm border border-amber-300'
                  : 'bg-slate-100 text-slate-300 scale-95'
              }`}
            >
              <Star
                className={`w-7 h-7 sm:w-8 sm:h-8 ${
                  starIndex <= stars ? 'fill-amber-400 stroke-amber-500' : 'fill-slate-200 stroke-slate-300'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Unlocked Animal Spotlight Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-pink-200 shadow-md mb-6 relative text-left">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-xs flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" />
            <span>¡NUEVO ANIMAL DESBLOQUEADO!</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            {/* Animal Picture with subtle float animation */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md relative group">
              <img
                src={animal.imageSrc}
                alt={animal.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-white/90 text-xs px-1.5 py-0.5 rounded-full shadow-xs font-bold text-amber-900">
                {animal.ambientEmoji}
              </div>
            </div>

            {/* Animal Lore and Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-xl font-display font-bold text-slate-900">
                  {animal.name}
                </h3>
                <span className="text-xs bg-pink-100 text-pink-800 font-semibold px-2 py-0.5 rounded-full">
                  {animal.species}
                </span>
              </div>
              <p className="text-xs font-medium text-amber-700 mb-2">
                {animal.title}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2 mb-2 italic">
                "{animal.quote}"
              </p>
              <div className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>Comida favorita: <strong>{animal.favoriteFood}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={onGoToAlbum}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-950 hover:bg-amber-900 text-amber-100 font-bold text-xs sm:text-sm border border-amber-600 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>📖 Ver en Álbum</span>
          </button>

          <button
            onClick={onGoToSanctuary}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-900 font-bold text-xs sm:text-sm border border-pink-300 transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>🐾 Santuario</span>
          </button>

          <button
            onClick={onReplayLevel}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm border border-slate-200 transition-all flex items-center justify-center gap-1.5"
            title="Repetir nivel"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Repetir</span>
          </button>

          {hasNextLevel && (
            <button
              onClick={onNextLevel}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm shadow-md border-b-2 border-amber-600 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
