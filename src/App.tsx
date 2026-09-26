/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ANIMALS, LEVEL_CONFIGS } from './data/animals';
import { ActiveTab, LevelStats, PuzzlePiece } from './types';
import { soundFx } from './utils/soundEffects';
import { Navbar } from './components/Navbar';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PieceTray } from './components/PieceTray';
import { SanctuaryView } from './components/SanctuaryView';
import { LevelSelectView } from './components/LevelSelectView';
import { HowToPlayView } from './components/HowToPlayView';
import { CollectorsAlbumView } from './components/CollectorsAlbumView';
import { LevelVictoryModal } from './components/LevelVictoryModal';
import { Sparkles, Trophy, ChevronRight, Image as ImageIcon, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'chibi_puzzle_progress_v3';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('puzzle');
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());
  const [showModelPreview, setShowModelPreview] = useState<boolean>(false);

  // Level statistics and unlocked status
  const [levelStats, setLevelStats] = useState<Record<number, LevelStats>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Default: level 1 unlocked, 2..7 locked
    return {
      1: { unlocked: true, completed: false, stars: 0, bestTimeSeconds: null, attempts: 0 },
      2: { unlocked: false, completed: false, stars: 0, bestTimeSeconds: null, attempts: 0 },
      3: { unlocked: false, completed: false, stars: 0, bestTimeSeconds: null, attempts: 0 },
      4: { unlocked: false, completed: false, stars: 0, bestTimeSeconds: null, attempts: 0 },
      5: { unlocked: false, completed: false, stars: 0, bestTimeSeconds: null, attempts: 0 },
      6: { unlocked: false, completed: false, stars: 0, bestTimeSeconds: null, attempts: 0 },
      7: { unlocked: false, completed: false, stars: 0, bestTimeSeconds: null, attempts: 0 },
    };
  });

  // Current animal & level config
  const currentLevelConfig = LEVEL_CONFIGS.find((l) => l.levelNumber === currentLevelNumber) || LEVEL_CONFIGS[0];
  const currentAnimal = ANIMALS.find((a) => a.id === currentLevelConfig.animalId) || ANIMALS[0];

  // Puzzle State
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [showGhostGuide, setShowGhostGuide] = useState<boolean>(currentLevelConfig.hasGhostGuideDefault);
  const [showNumbers, setShowNumbers] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isLevelWon, setIsLevelWon] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Save levelStats to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(levelStats));
    } catch {
      // storage error
    }
  }, [levelStats]);

  // Initialize a puzzle level
  const initLevel = useCallback((levelNum: number) => {
    const config = LEVEL_CONFIGS.find((l) => l.levelNumber === levelNum) || LEVEL_CONFIGS[0];
    setShowGhostGuide(config.hasGhostGuideDefault);
    setSelectedPieceId(null);
    setElapsedSeconds(0);
    setIsLevelWon(false);
    setLastFeedback({
      text: config.hasRotation
        ? '¡Nivel con rotación! Toca una pieza para girarla 90°.'
        : '¡Selecciona una pieza y colócala en el tablero!',
      type: 'info',
    });

    // Create 9 pieces
    const newPieces: PuzzlePiece[] = [];
    const rotations = [90, 180, 270];

    for (let id = 0; id < 9; id++) {
      const row = Math.floor(id / 3);
      const col = id % 3;
      let initRotation: number = 0;

      if (config.hasRotation) {
        // In rotation levels, give most pieces a non-zero rotation
        initRotation = rotations[Math.floor(Math.random() * rotations.length)];
      }

      newPieces.push({
        id,
        row,
        col,
        currentRotation: initRotation,
        targetRotation: 0,
        isPlaced: false,
        isLocked: false,
      });
    }

    // Shuffle piece order in dock for variety (Fisher-Yates)
    const shuffled = [...newPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, []);

  // When level number changes, reinit level
  useEffect(() => {
    initLevel(currentLevelNumber);
  }, [currentLevelNumber, initLevel]);

  // Timer loop
  useEffect(() => {
    if (currentTab === 'puzzle' && !isLevelWon) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentTab, isLevelWon]);

  // Count placed pieces
  const placedCount = pieces.filter((p) => p.isLocked).length;

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Handle Piece Rotation
  const handleRotatePiece = (pieceId: number) => {
    soundFx.playRotate();
    setPieces((prev) =>
      prev.map((p) => {
        if (p.id === pieceId) {
          const nextRot = (p.currentRotation + 90) % 360;
          return { ...p, currentRotation: nextRot };
        }
        return p;
      })
    );
  };

  // Check if puzzle is solved
  const checkVictory = (updatedPieces: PuzzlePiece[]) => {
    const allLocked = updatedPieces.every((p) => p.isLocked);
    if (allLocked) {
      setIsLevelWon(true);
      soundFx.playVictory();

      // Calculate Stars
      let starsEarned = 1;
      if (elapsedSeconds <= currentLevelConfig.targetSecondsFor3Stars) {
        starsEarned = 3;
      } else if (elapsedSeconds <= currentLevelConfig.targetSecondsFor2Stars) {
        starsEarned = 2;
      }

      // Update stats
      setLevelStats((prev) => {
        const current = prev[currentLevelNumber] || {
          unlocked: true,
          completed: false,
          stars: 0,
          bestTimeSeconds: null,
          attempts: 0,
        };

        const newBestTime =
          current.bestTimeSeconds === null
            ? elapsedSeconds
            : Math.min(current.bestTimeSeconds, elapsedSeconds);

        const newStars = Math.max(current.stars, starsEarned);

        const nextLevelNum = currentLevelNumber + 1;
        const nextLevelExists = LEVEL_CONFIGS.some((l) => l.levelNumber === nextLevelNum);

        const updated = {
          ...prev,
          [currentLevelNumber]: {
            ...current,
            completed: true,
            stars: newStars,
            bestTimeSeconds: newBestTime,
            attempts: current.attempts + 1,
          },
        };

        // Unlock next level if exists
        if (nextLevelExists && updated[nextLevelNum]) {
          updated[nextLevelNum] = {
            ...updated[nextLevelNum],
            unlocked: true,
          };
        }

        return updated;
      });
    }
  };

  // Try placing a piece at slot (row, col)
  const placePieceAtSlot = (targetRow: number, targetCol: number, pieceId: number) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;

    // Check if slot already has a locked piece
    const existing = pieces.find(
      (p) => p.isPlaced && p.placedRow === targetRow && p.placedCol === targetCol && p.isLocked
    );
    if (existing) {
      setLastFeedback({
        text: '¡Esta casilla ya está ocupada por su pieza correspondiente!',
        type: 'warn',
      });
      return;
    }

    // Match check: does this piece belong to (targetRow, targetCol)?
    const isMatchingSlot = piece.row === targetRow && piece.col === targetCol;

    if (isMatchingSlot) {
      if (piece.currentRotation === 0) {
        // SNAP! Perfect fit
        const newPieces = pieces.map((p) => {
          if (p.id === pieceId) {
            return {
              ...p,
              isPlaced: true,
              placedRow: targetRow,
              placedCol: targetCol,
              isLocked: true,
            };
          }
          return p;
        });

        const newCount = newPieces.filter((p) => p.isLocked).length;
        soundFx.playSnap(newCount);
        setPieces(newPieces);
        setSelectedPieceId(null);
        setLastFeedback({
          text: `¡Excelente! Casilla (${targetRow + 1}, ${targetCol + 1}) completada. ✨`,
          type: 'success',
        });

        checkVictory(newPieces);
      } else {
        // Right slot, but rotated!
        soundFx.playWrong();
        setLastFeedback({
          text: '¡Posición correcta, pero la pieza está girada! Toca la pieza para alinearla 🔄',
          type: 'warn',
        });
      }
    } else {
      // Wrong slot
      soundFx.playWrong();
      setLastFeedback({
        text: '¡Esta pieza no corresponde a esa casilla! Intenta con otra.',
        type: 'warn',
      });
    }
  };

  // Slot click handler
  const handleSlotClick = (row: number, col: number) => {
    if (selectedPieceId !== null) {
      placePieceAtSlot(row, col, selectedPieceId);
    } else {
      // Check if there is an unlocked piece placed at this slot
      const pieceAtSlot = pieces.find(
        (p) => p.isPlaced && p.placedRow === row && p.placedCol === col
      );
      if (pieceAtSlot && !pieceAtSlot.isLocked) {
        setSelectedPieceId(pieceAtSlot.id);
      } else {
        setLastFeedback({
          text: 'Primero selecciona una pieza del banco inferior.',
          type: 'info',
        });
      }
    }
  };

  // Drag and drop onto slot
  const handleSlotDrop = (row: number, col: number, draggedPieceId: number) => {
    placePieceAtSlot(row, col, draggedPieceId);
  };

  // Next level navigation
  const handleNextLevel = () => {
    const nextLevel = currentLevelNumber + 1;
    if (LEVEL_CONFIGS.some((l) => l.levelNumber === nextLevel)) {
      setCurrentLevelNumber(nextLevel);
      setCurrentTab('puzzle');
    }
  };

  const handleReplayLevel = () => {
    initLevel(currentLevelNumber);
  };

  const handleSelectLevel = (levelNum: number) => {
    setCurrentLevelNumber(levelNum);
    setCurrentTab('puzzle');
  };

  const unlockedCount = ANIMALS.filter((a) => levelStats[a.level]?.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50/40 to-amber-100/60 text-slate-800 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        unlockedCount={unlockedCount}
        totalAnimals={ANIMALS.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 sm:py-6">
        {currentTab === 'puzzle' && (
          <div className="animate-fade-in flex flex-col items-center">
            {/* Level Banner / Info Strip */}
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border-2 border-amber-200/80 shadow-xs mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {/* Animal Avatar Thumbnail with Click to Preview */}
                <button
                  onClick={() => setShowModelPreview(true)}
                  className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-sm shrink-0 group hover:scale-105 transition-transform"
                  title="Toca para ver el modelo completo"
                >
                  <img
                    src={currentAnimal.imageSrc}
                    alt={currentAnimal.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Nivel {currentLevelConfig.levelNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {currentAnimal.species}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-amber-950">
                    {currentAnimal.name}
                  </h1>
                  <p className="text-xs text-amber-800/80 font-medium">
                    {currentLevelConfig.difficultyTitle}
                  </p>
                </div>
              </div>

              {/* Quick actions: See Full Model & Change Level */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowModelPreview(true)}
                  className="py-1.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs border border-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Ver Modelo</span>
                </button>

                <button
                  onClick={() => setCurrentTab('levels')}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <span>Niveles</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3x3 Puzzle Board */}
            <PuzzleBoard
              animal={currentAnimal}
              levelConfig={currentLevelConfig}
              pieces={pieces}
              selectedPieceId={selectedPieceId}
              onSelectPiece={setSelectedPieceId}
              onRotatePiece={handleRotatePiece}
              onSlotClick={handleSlotClick}
              onSlotDrop={handleSlotDrop}
              showGhostGuide={showGhostGuide}
              onToggleGhostGuide={() => setShowGhostGuide(!showGhostGuide)}
              showNumbers={showNumbers}
              onToggleNumbers={() => setShowNumbers(!showNumbers)}
              onResetPuzzle={handleReplayLevel}
              elapsedSeconds={elapsedSeconds}
              placedCount={placedCount}
              lastFeedback={lastFeedback}
            />

            {/* Piece Dock / Tray */}
            <PieceTray
              animal={currentAnimal}
              levelConfig={currentLevelConfig}
              pieces={pieces}
              selectedPieceId={selectedPieceId}
              onSelectPiece={setSelectedPieceId}
              onRotatePiece={handleRotatePiece}
              showNumbers={showNumbers}
            />
          </div>
        )}

        {currentTab === 'album' && (
          <CollectorsAlbumView
            animals={ANIMALS}
            levelStats={levelStats}
            onPlayLevel={handleSelectLevel}
          />
        )}

        {currentTab === 'sanctuary' && (
          <SanctuaryView
            animals={ANIMALS}
            levelStats={levelStats}
            onPlayLevel={handleSelectLevel}
          />
        )}

        {currentTab === 'levels' && (
          <LevelSelectView
            animals={ANIMALS}
            levelConfigs={LEVEL_CONFIGS}
            levelStats={levelStats}
            onSelectLevel={handleSelectLevel}
          />
        )}

        {currentTab === 'how_to_play' && (
          <HowToPlayView onStartPlaying={() => setCurrentTab('puzzle')} />
        )}
      </main>

      {/* Full Animal Model Preview Modal */}
      {showModelPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 border-4 border-amber-300 shadow-2xl text-center">
            <button
              onClick={() => setShowModelPreview(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 font-bold text-lg w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              aria-label="Cerrar vista previa"
            >
              ✕
            </button>

            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200 mb-2 inline-block">
              Modelo a Armar (Nivel {currentAnimal.level})
            </span>

            <h3 className="text-xl font-display font-bold text-slate-900 mb-3">
              {currentAnimal.name} ({currentAnimal.species})
            </h3>

            <div className="rounded-2xl overflow-hidden border-2 border-amber-200 aspect-square shadow-md mb-4">
              <img
                src={currentAnimal.imageSrc}
                alt={currentAnimal.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-slate-600 italic mb-4">
              "{currentAnimal.quote}"
            </p>

            <button
              onClick={() => setShowModelPreview(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm shadow-xs transition-colors"
            >
              ¡Continuar Armando!
            </button>
          </div>
        </div>
      )}

      {/* Level Victory Celebration Modal */}
      {isLevelWon && (
        <LevelVictoryModal
          animal={currentAnimal}
          levelConfig={currentLevelConfig}
          stars={
            elapsedSeconds <= currentLevelConfig.targetSecondsFor3Stars
              ? 3
              : elapsedSeconds <= currentLevelConfig.targetSecondsFor2Stars
              ? 2
              : 1
          }
          timeSeconds={elapsedSeconds}
          hasNextLevel={currentLevelNumber < LEVEL_CONFIGS.length}
          onNextLevel={handleNextLevel}
          onReplayLevel={handleReplayLevel}
          onGoToSanctuary={() => setCurrentTab('sanctuary')}
          onGoToAlbum={() => setCurrentTab('album')}
        />
      )}

      {/* Quiet Footer */}
      <footer className="mt-auto py-4 border-t border-amber-200/60 bg-amber-50/80 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🐾 Chibi Puzzle Safari · Rompecabezas de 9 piezas coleccionables</span>
          <span>Desbloquea los 5 animalitos para completar el santuario</span>
        </div>
      </footer>
    </div>
  );
}
