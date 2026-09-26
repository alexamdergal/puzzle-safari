import React from 'react';
import { Star, Lock, Play, Clock, Sparkles } from 'lucide-react';
import { Animal, LevelConfig, LevelStats } from '../types';

interface LevelSelectViewProps {
  animals: Animal[];
  levelConfigs: LevelConfig[];
  levelStats: Record<number, LevelStats>;
  onSelectLevel: (levelNumber: number) => void;
}

export const LevelSelectView: React.FC<LevelSelectViewProps> = ({
  animals,
  levelConfigs,
  levelStats,
  onSelectLevel,
}) => {
  const formatTime = (secs: number | null) => {
    if (secs === null) return '--:--';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>MAPA DE NIVELES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-amber-950 mb-1">
          Dificultad Gradual & Rescate
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Cada nivel introduce nuevas mecánicas de dificultad y desbloquea un compañero chibi diferente para tu santuario.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {levelConfigs.map((config) => {
          const animal = animals.find((a) => a.id === config.animalId);
          if (!animal) return null;

          const stats = levelStats[config.levelNumber] || {
            unlocked: config.levelNumber === 1,
            completed: false,
            stars: 0,
            bestTimeSeconds: null,
            attempts: 0,
          };

          const isUnlocked = stats.unlocked;

          return (
            <div
              key={config.levelNumber}
              className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-amber-200/90 shadow-sm hover:shadow-md hover:border-amber-300'
                  : 'bg-slate-50/80 border-dashed border-slate-300 opacity-80'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        isUnlocked
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      Nivel {config.levelNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {config.difficultyTitle}
                    </span>
                  </div>

                  {/* Stars display */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx <= stats.stars
                            ? 'fill-amber-400 stroke-amber-500'
                            : 'fill-slate-100 stroke-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content with Animal Preview */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-200 shrink-0 relative bg-slate-100">
                    {isUnlocked ? (
                      <img
                        src={animal.imageSrc}
                        alt={animal.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-400">
                        <Lock className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-slate-900 truncate flex items-center gap-1.5">
                      <span>{isUnlocked ? animal.name : '??? Bloqueado'}</span>
                      {isUnlocked && (
                        <span className="text-xs font-normal text-slate-500">
                          ({animal.species})
                        </span>
                      )}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 mb-1.5">
                      {config.difficultyDescription}
                    </p>

                    {stats.bestTimeSeconds !== null && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Mejor tiempo: <strong>{formatTime(stats.bestTimeSeconds)}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-amber-700 font-medium">
                  {stats.completed ? '✅ Desbloqueado en Santuario' : isUnlocked ? '🐾 Listo para jugar' : '🔒 Requiere nivel anterior'}
                </span>

                <button
                  disabled={!isUnlocked}
                  onClick={() => onSelectLevel(config.levelNumber)}
                  className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    isUnlocked
                      ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-xs active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{stats.completed ? 'Volver a Jugar' : 'Jugar Nivel'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
