import React, { useState } from 'react';
import { Heart, Sparkles, Lock, Star, Play, Award, Utensils } from 'lucide-react';
import { Animal, LevelStats } from '../types';
import { soundFx } from '../utils/soundEffects';

interface SanctuaryViewProps {
  animals: Animal[];
  levelStats: Record<number, LevelStats>;
  onPlayLevel: (levelNumber: number) => void;
}

export const SanctuaryView: React.FC<SanctuaryViewProps> = ({
  animals,
  levelStats,
  onPlayLevel,
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [petFeedback, setPetFeedback] = useState<{ id: string; text: string } | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Count total unlocked animals and total stars
  const unlockedAnimals = animals.filter(
    (a) => levelStats[a.level]?.completed || a.level === 1 && levelStats[1]?.completed
  );
  const totalStars = Object.values(levelStats).reduce((acc, curr) => acc + (curr.stars || 0), 0);

  const handlePetAnimal = (e: React.MouseEvent, animal: Animal) => {
    e.stopPropagation();
    soundFx.playPet(animal.soundType);

    // Spawn floating heart
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
    setHearts((prev) => [...prev.slice(-8), newHeart]);

    // Random cute feedback line
    const reactions = [
      '¡Ronroneos felices! 💖',
      '¡Gracias por el cariñito! ✨',
      '¡Le brillan los ojitos de alegría! 🌟',
      '¡Da saltitos de emoción! 🐾',
      '¡Qué suavecito y feliz está! 💕',
    ];
    const chosen = reactions[Math.floor(Math.random() * reactions.length)];
    setPetFeedback({ id: animal.id, text: chosen });

    setTimeout(() => {
      setPetFeedback((current) => (current?.id === animal.id ? null : current));
    }, 2500);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fade-in relative">
      {/* Floating Hearts Layer */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-50 text-rose-500 font-bold text-lg animate-float-up"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          ❤️
        </div>
      ))}

      {/* Sanctuary Header & Stats */}
      <div className="bg-gradient-to-r from-amber-100/90 via-pink-100/80 to-sky-100/90 rounded-3xl p-6 sm:p-8 border-2 border-amber-200/90 shadow-sm mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 text-pink-700 font-bold text-xs rounded-full border border-pink-200 mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EL REFUGIO CHIBI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-amber-950 mb-1">
            Santuario de Animalitos
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Todos los animales que rescatas al superar los niveles vienen a vivir aquí. ¡Haz clic en ellos para acariciarlos y conocer sus historias!
          </p>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 text-center border border-amber-200/80 shadow-xs min-w-[90px]">
            <span className="block text-2xl font-display font-bold text-pink-600 tabular-nums">
              {unlockedAnimals.length}/{animals.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Coleccionados</span>
          </div>

          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 text-center border border-amber-200/80 shadow-xs min-w-[90px]">
            <span className="block text-2xl font-display font-bold text-amber-500 tabular-nums flex items-center justify-center gap-0.5">
              <Star className="w-5 h-5 fill-amber-400 stroke-amber-500" />
              <span>{totalStars}</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500">Estrellas</span>
          </div>
        </div>
      </div>

      {/* Sanctuary Habitat Playground */}
      <div className="mb-10">
        <h2 className="text-lg font-display font-bold text-amber-950 mb-4 flex items-center gap-2">
          <span>🐾 Habitantes del Santuario</span>
          <span className="text-xs text-slate-500 font-normal">
            (Toca a un animalito para acariciarlo)
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {animals.map((animal) => {
            const isCompleted = levelStats[animal.level]?.completed;
            const stats = levelStats[animal.level];
            const isSelected = selectedAnimal?.id === animal.id;

            if (isCompleted) {
              return (
                <div
                  key={animal.id}
                  onClick={() => setSelectedAnimal(animal)}
                  className={`relative bg-white rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                    isSelected
                      ? 'border-pink-400 ring-4 ring-pink-100 shadow-md'
                      : 'border-amber-200/90 shadow-sm'
                  }`}
                >
                  {/* Pet speech bubble if petted */}
                  {petFeedback?.id === animal.id && (
                    <div className="absolute -top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-30 animate-bounce-short">
                      {petFeedback.text}
                    </div>
                  )}

                  {/* Animal Image with Pet Button Overlay */}
                  <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-amber-200 bg-amber-50 mb-3 group">
                    <img
                      src={animal.imageSrc}
                      alt={animal.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Quick Pet Floating Button */}
                    <button
                      onClick={(e) => handlePetAnimal(e, animal)}
                      className="absolute bottom-3 right-3 bg-white/95 hover:bg-rose-50 text-rose-600 p-2 rounded-2xl shadow-md border border-rose-200 transition-all hover:scale-110 active:scale-95 flex items-center gap-1 z-20"
                      title={`Acariciar a ${animal.name}`}
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span className="text-[11px] font-bold">Mimar</span>
                    </button>

                    {/* Level Badge in top corner */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      Nivel {animal.level}
                    </div>

                    {/* Ambient Emoji */}
                    <div className="absolute top-2 right-2 text-xl filter drop-shadow-md">
                      {animal.ambientEmoji}
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-1.5">
                        <span>{animal.name}</span>
                        <span className="text-xs text-slate-500 font-normal">
                          · {animal.species}
                        </span>
                      </h3>
                      <p className="text-xs text-amber-700 font-medium">
                        {animal.title}
                      </p>
                    </div>

                    {/* Stars Badge */}
                    <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      <span className="text-xs font-bold text-amber-800 tabular-nums">
                        {stats?.stars || 1}/3
                      </span>
                    </div>
                  </div>

                  {/* Quote preview */}
                  <p className="text-xs text-slate-600 italic line-clamp-2 mb-3">
                    "{animal.quote}"
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayLevel(animal.level);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-amber-800" />
                      <span>Volver a armar</span>
                    </button>

                    <button
                      onClick={() => setSelectedAnimal(animal)}
                      className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                    >
                      Detalles
                    </button>
                  </div>
                </div>
              );
            }

            // Locked Animal Silhouette Card
            return (
              <div
                key={animal.id}
                className="relative bg-slate-50/90 rounded-3xl p-5 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center group"
              >
                {/* Silhouette preview */}
                <div className="w-32 h-32 rounded-2xl bg-slate-200 flex flex-col items-center justify-center relative mb-4 overflow-hidden border border-slate-300">
                  <div className="w-16 h-16 rounded-full bg-slate-300/80 flex items-center justify-center mb-1 text-slate-400">
                    <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Misterioso</span>
                </div>

                <div className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full mb-2 border border-amber-200">
                  Nivel {animal.level}
                </div>

                <h3 className="font-display font-bold text-base text-slate-600 mb-1">
                  ¿Quién será este animalito?
                </h3>
                <p className="text-xs text-slate-500 mb-4 max-w-xs">
                  Resuelve el rompecabezas del Nivel {animal.level} para rescatarlo y sumarlo a tu santuario.
                </p>

                <button
                  onClick={() => onPlayLevel(animal.level)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-950" />
                  <span>Jugar Nivel {animal.level}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Animal Detail Modal */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border-4 border-amber-200 shadow-2xl text-left overflow-hidden">
            <button
              onClick={() => setSelectedAnimal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              aria-label="Cerrar detalles"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-300 shrink-0">
                <img
                  src={selectedAnimal.imageSrc}
                  alt={selectedAnimal.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  Nivel {selectedAnimal.level} · {selectedAnimal.species}
                </span>
                <h3 className="text-2xl font-display font-bold text-slate-900 mt-1">
                  {selectedAnimal.name}
                </h3>
                <p className="text-xs font-medium text-slate-600">
                  {selectedAnimal.title}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 mb-6 bg-amber-50/50 rounded-2xl p-4 border border-amber-100">
              <p className="leading-relaxed">{selectedAnimal.bio}</p>

              {/* Collector's fun fact highlight */}
              <div className="bg-amber-100/70 p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 font-medium">
                <strong>💡 Dato Curioso:</strong> {selectedAnimal.funFact}
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-amber-200/60">
                <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Comida Favorita:</strong> {selectedAnimal.favoriteFood}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-pink-600 shrink-0" />
                <span>
                  <strong>Personalidad:</strong> {selectedAnimal.personality}
                </span>
              </div>

              <div className="bg-white rounded-xl p-2.5 border border-pink-200 italic text-slate-600 flex items-center gap-2">
                <span className="text-base">{selectedAnimal.ambientEmoji}</span>
                <span>"{selectedAnimal.quote}"</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => handlePetAnimal(e, selectedAnimal)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Acariciar ({selectedAnimal.name})</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAnimal(null);
                  onPlayLevel(selectedAnimal.level);
                }}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-4 h-4 fill-amber-950" />
                <span>Jugar Puzzle</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
