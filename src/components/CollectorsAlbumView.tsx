import React, { useState } from 'react';
import { Animal, LevelStats } from '../types';
import { soundFx } from '../utils/soundEffects';
import { 
  BookMarked, 
  Sparkles, 
  Lock, 
  Star, 
  Heart, 
  Play, 
  CheckCircle2, 
  Search, 
  Compass, 
  Award, 
  Lightbulb, 
  MapPin, 
  Share2 
} from 'lucide-react';

interface CollectorsAlbumViewProps {
  animals: Animal[];
  levelStats: Record<number, LevelStats>;
  onPlayLevel: (levelNumber: number) => void;
}

export const CollectorsAlbumView: React.FC<CollectorsAlbumViewProps> = ({
  animals,
  levelStats,
  onPlayLevel,
}) => {
  const [filterRarity, setFilterRarity] = useState<'Todos' | 'Común' | 'Raro' | 'Místico' | 'Legendario'>('Todos');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Compute unlock metrics
  const unlockedAnimals = animals.filter(
    (a) => levelStats[a.level]?.completed
  );
  const completionPercentage = Math.round((unlockedAnimals.length / animals.length) * 100);

  const filteredAnimals = animals.filter((animal) => {
    if (filterRarity === 'Todos') return true;
    return animal.rarity === filterRarity;
  });

  const getRarityBadge = (rarity: Animal['rarity']) => {
    switch (rarity) {
      case 'Legendario':
        return 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs';
      case 'Místico':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'Raro':
        return 'bg-sky-100 text-sky-800 border border-sky-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    }
  };

  const handleShareCard = (animal: Animal) => {
    const text = `¡Descubrí a ${animal.name} (${animal.species}) en Chibi Puzzle Safari! 🐾 "${animal.quote}"`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(`¡Ficha de ${animal.name} copiada al portapapeles! ✨`);
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fade-in relative">
      {/* Toast notification */}
      {copiedNotification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-2xl shadow-xl border border-slate-700 animate-bounce-short flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Album Grand Header (Styled like a luxury collector's leather-bound album) */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-amber-50 rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-500/60 mb-8 relative overflow-hidden">
        {/* Subtle decorative gold foil corners */}
        <div className="absolute top-2 left-3 text-amber-400/40 text-lg select-none">⚜️</div>
        <div className="absolute top-2 right-3 text-amber-400/40 text-lg select-none">⚜️</div>
        <div className="absolute bottom-2 left-3 text-amber-400/40 text-lg select-none">⚜️</div>
        <div className="absolute bottom-2 right-3 text-amber-400/40 text-lg select-none">⚜️</div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-400/30 mb-2">
              <BookMarked className="w-3.5 h-3.5 text-amber-400" />
              <span>EDICIÓN ILUSTRADA OFICIAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide flex items-center gap-2">
              <span>Álbum del Coleccionista Chibi</span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/80 max-w-lg mt-1">
              Guarda tus ilustraciones exclusivas, curiosidades científicas y datos divertidos de cada animalito que rescatas armando los rompecabezas.
            </p>
          </div>

          {/* Album Progress Stamp Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-amber-400/30 min-w-[200px] text-center shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-200 mb-1.5">
              <span>Estampas Desbloqueadas</span>
              <span className="font-mono text-amber-300 font-bold">{unlockedAnimals.length} / {animals.length}</span>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full bg-black/40 rounded-full h-3 p-0.5 border border-amber-400/30 overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-amber-400 via-pink-400 to-rose-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-amber-300/80">
              <span>Completado: <strong>{completionPercentage}%</strong></span>
              {completionPercentage === 100 ? (
                <span className="text-emerald-400 font-bold">¡Colección Completa! 🏆</span>
              ) : (
                <span>Faltan {animals.length - unlockedAnimals.length}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Rarity */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs font-medium">
          {(['Todos', 'Común', 'Raro', 'Místico', 'Legendario'] as const).map((rarity) => (
            <button
              key={rarity}
              onClick={() => setFilterRarity(rarity)}
              className={`py-1.5 px-3.5 rounded-xl transition-all whitespace-nowrap ${
                filterRarity === rarity
                  ? 'bg-amber-950 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-amber-100/70 text-slate-700 border border-amber-200/80'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>Toca una tarjeta para abrir su ficha ilustrada completa.</span>
        </div>
      </div>

      {/* Grid of Collector Album Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAnimals.map((animal) => {
          const stats = levelStats[animal.level];
          const isUnlocked = Boolean(stats?.completed);

          return (
            <div
              key={animal.id}
              onClick={() => isUnlocked && setSelectedAnimal(animal)}
              className={`group relative rounded-3xl p-5 border-2 transition-all duration-200 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-amber-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                  : 'bg-slate-100/70 border-dashed border-slate-300 select-none'
              }`}
            >
              {/* Card Top: Sticker Number & Rarity */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-amber-900/60 bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-200">
                    #{animal.stickerNumber.toString().padStart(2, '0')}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRarityBadge(animal.rarity)}`}>
                    {animal.rarity}
                  </span>
                </div>

                {isUnlocked ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Desbloqueado</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Bloqueado (Nivel {animal.level})</span>
                  </span>
                )}
              </div>

              {/* Unique Illustration Box */}
              <div className="relative rounded-2xl overflow-hidden aspect-square mb-3 border-2 border-amber-200 bg-slate-100 group">
                {isUnlocked ? (
                  <>
                    <img
                      src={animal.imageSrc}
                      alt={animal.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Ambient Emoji */}
                    <div className="absolute top-2.5 right-2.5 text-xl filter drop-shadow-md">
                      {animal.ambientEmoji}
                    </div>

                    {/* Magnify hover icon */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                      <Search className="w-4 h-4" />
                      <span>Ver Ficha Completa</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200/70 p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-300/80 flex items-center justify-center text-slate-400 mb-2">
                      <Lock className="w-7 h-7" />
                    </div>
                    <p className="text-xs font-bold text-slate-500">
                      Silueta Secreta
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Arma el rompecabezas del Nivel {animal.level} para revelar esta ilustración.
                    </p>
                  </div>
                )}
              </div>

              {/* Title & Lore */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      {isUnlocked ? animal.name : '??? Desconocido'}
                    </h3>
                    {isUnlocked && (
                      <span className="text-xs font-semibold text-slate-500">
                        {animal.species}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-amber-800 font-medium mb-2">
                    {isUnlocked ? animal.title : `Desafío del Nivel ${animal.level}`}
                  </p>

                  {/* Fun Fact Callout Box (Primary feature requested) */}
                  {isUnlocked ? (
                    <div className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-200/70 text-xs text-slate-700 mb-3">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Dato Curioso:</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                        {animal.funFact}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-100 rounded-xl p-2.5 border border-slate-200 text-xs text-slate-400 mb-3 italic">
                      "Completa el rompecabezas de 9 piezas para descubrir el dato curioso de este animalito."
                    </div>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  {isUnlocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareCard(animal);
                      }}
                      className="text-slate-500 hover:text-amber-800 p-1.5 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-1"
                      title="Compartir ficha"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Compartir</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      🔒 No descubierto
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayLevel(animal.level);
                    }}
                    className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                      isUnlocked
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                        : 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-xs'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isUnlocked ? 'Repetir Nivel' : 'Jugar Nivel'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Collector Card Modal */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 via-white to-pink-50 rounded-3xl p-6 sm:p-7 border-4 border-amber-300 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAnimal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-colors"
              aria-label="Cerrar ficha"
            >
              ✕
            </button>

            {/* Sticker Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-xl border border-amber-300">
                Estampa #{selectedAnimal.stickerNumber.toString().padStart(2, '0')}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${getRarityBadge(selectedAnimal.rarity)}`}>
                {selectedAnimal.rarity}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                Nivel {selectedAnimal.level}
              </span>
            </div>

            {/* Full Illustration Showcase */}
            <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-amber-300 shadow-md mb-4 bg-amber-50">
              <img
                src={selectedAnimal.imageSrc}
                alt={selectedAnimal.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold shadow-xs text-amber-950 flex items-center gap-1">
                <span>{selectedAnimal.ambientEmoji}</span>
                <span>{selectedAnimal.species}</span>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                <span>{selectedAnimal.name}</span>
                <span className="text-sm font-normal text-slate-500 font-sans">
                  ({selectedAnimal.species})
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-medium text-amber-700">
                {selectedAnimal.title}
              </p>
            </div>

            {/* Fun Fact Feature Section */}
            <div className="bg-amber-100/70 border-2 border-amber-300/80 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>¿Sabías que...? (Dato Curioso)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {selectedAnimal.funFact}
              </p>
            </div>

            {/* Scientific Habitat & Biology */}
            <div className="space-y-2 text-xs text-slate-600 bg-white rounded-2xl p-4 border border-slate-200 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span><strong>Hábitat Natural:</strong> {selectedAnimal.habitat}</span>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong>Comida Favorita:</strong> {selectedAnimal.favoriteFood}</span>
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
                <span><strong>Personalidad:</strong> {selectedAnimal.personality}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-slate-600 italic">
                "{selectedAnimal.quote}"
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  soundFx.playPet(selectedAnimal.soundType);
                  handleShareCard(selectedAnimal);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-pink-300"
              >
                <Share2 className="w-4 h-4 text-pink-600" />
                <span>Compartir Ficha</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAnimal(null);
                  onPlayLevel(selectedAnimal.level);
                }}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Play className="w-4 h-4 fill-amber-950" />
                <span>Armar Puzzle</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
