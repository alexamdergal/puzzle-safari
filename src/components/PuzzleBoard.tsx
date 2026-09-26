import React from 'react';
import { Eye, EyeOff, Hash, Sparkles, RefreshCw, Trophy, Clock } from 'lucide-react';
import { Animal, LevelConfig, PuzzlePiece } from '../types';
import { PieceRenderer } from './PieceRenderer';

interface PuzzleBoardProps {
  animal: Animal;
  levelConfig: LevelConfig;
  pieces: PuzzlePiece[];
  selectedPieceId: number | null;
  onSelectPiece: (pieceId: number | null) => void;
  onRotatePiece: (pieceId: number) => void;
  onSlotClick: (row: number, col: number) => void;
  onSlotDrop: (row: number, col: number, draggedPieceId: number) => void;
  showGhostGuide: boolean;
  onToggleGhostGuide: () => void;
  showNumbers: boolean;
  onToggleNumbers: () => void;
  onResetPuzzle: () => void;
  elapsedSeconds: number;
  placedCount: number;
  lastFeedback: { text: string; type: 'success' | 'warn' | 'info' } | null;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  animal,
  levelConfig,
  pieces,
  selectedPieceId,
  onSelectPiece,
  onRotatePiece,
  onSlotClick,
  onSlotDrop,
  showGhostGuide,
  onToggleGhostGuide,
  showNumbers,
  onToggleNumbers,
  onResetPuzzle,
  elapsedSeconds,
  placedCount,
  lastFeedback,
}) => {
  // Format elapsed time MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Helper to find piece placed at slot (row, col)
  const getPieceAtSlot = (row: number, col: number) => {
    return pieces.find(
      (p) => p.isPlaced && p.placedRow === row && p.placedCol === col
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    const pieceIdStr = e.dataTransfer.getData('text/plain');
    const pieceId = parseInt(pieceIdStr, 10);
    if (!isNaN(pieceId)) {
      onSlotDrop(row, col, pieceId);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Board Top Header / Controls bar */}
      <div className="w-full flex items-center justify-between gap-2 px-1 mb-3 text-xs sm:text-sm font-medium text-slate-600">
        <div className="flex items-center gap-2">
          {/* Pieces counter */}
          <span className="bg-amber-100/90 text-amber-900 px-2.5 py-1 rounded-full font-bold tabular-nums flex items-center gap-1 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{placedCount}/9 piezas</span>
          </span>

          {/* Timer if level has timer */}
          {levelConfig.hasTimer && (
            <span className="bg-white text-slate-700 px-2.5 py-1 rounded-full font-mono tabular-nums flex items-center gap-1 border border-slate-200 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </span>
          )}
        </div>

        {/* Toggles: Ghost Guide, Numbers, Reset */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleGhostGuide}
            className={`p-1.5 rounded-lg border transition-all ${
              showGhostGuide
                ? 'bg-amber-200 text-amber-900 border-amber-300'
                : 'bg-white text-slate-500 hover:text-slate-700 border-slate-200'
            }`}
            title={showGhostGuide ? 'Ocultar silueta guía' : 'Mostrar silueta guía'}
            aria-label="Alternar silueta guía"
          >
            {showGhostGuide ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleNumbers}
            className={`p-1.5 rounded-lg border transition-all ${
              showNumbers
                ? 'bg-amber-200 text-amber-900 border-amber-300'
                : 'bg-white text-slate-500 hover:text-slate-700 border-slate-200'
            }`}
            title="Alternar números guía"
            aria-label="Alternar números guía"
          >
            <Hash className="w-4 h-4" />
          </button>

          <button
            onClick={onResetPuzzle}
            className="p-1.5 rounded-lg bg-white text-slate-500 hover:text-rose-600 border border-slate-200 transition-all hover:bg-rose-50"
            title="Reiniciar este nivel"
            aria-label="Reiniciar este nivel"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3x3 Puzzle Target Frame */}
      <div className="relative p-3 bg-amber-100/70 border-4 border-amber-300/80 rounded-3xl shadow-xl backdrop-blur-xs select-none">
        {/* Subtle decorative animal paws in frame corner */}
        <div className="absolute top-1 left-2 text-xs opacity-40">🐾</div>
        <div className="absolute bottom-1 right-2 text-xs opacity-40">🐾</div>

        {/* 3x3 Grid Matrix */}
        <div
          className="relative grid grid-cols-3 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden bg-amber-50/80 border-2 border-amber-200/90 shadow-inner"
          style={{
            width: 'clamp(280px, 86vw, 360px)',
            height: 'clamp(280px, 86vw, 360px)',
          }}
        >
          {/* Ghost Guide Background Image (Visible if showGhostGuide is true) */}
          {showGhostGuide && (
            <div
              className="absolute inset-0 bg-center bg-cover opacity-35 pointer-events-none transition-opacity duration-300 filter saturate-125"
              style={{
                backgroundImage: `url(${animal.imageSrc})`,
              }}
            />
          )}

          {/* Level 5 Astral Mist Visual Effect if unfinished */}
          {levelConfig.levelNumber === 5 && placedCount < 9 && (
            <div
              className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-pink-400/10 to-indigo-500/15 pointer-events-none mix-blend-color-dodge transition-opacity duration-500"
              style={{
                opacity: 1 - placedCount / 9,
              }}
            />
          )}

          {/* 9 Grid Cells */}
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => {
              const slotIndex = row * 3 + col;
              const pieceInSlot = getPieceAtSlot(row, col);

              return (
                <div
                  key={`${row}-${col}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, row, col)}
                  onClick={() => onSlotClick(row, col)}
                  className={`relative flex items-center justify-center rounded-xl transition-all duration-200 overflow-hidden ${
                    pieceInSlot
                      ? ''
                      : selectedPieceId !== null
                      ? 'border-2 border-dashed border-amber-400 bg-amber-200/30 hover:bg-amber-300/40 cursor-pointer animate-pulse-subtle'
                      : 'border-2 border-dashed border-amber-200/80 bg-white/40 hover:bg-white/60'
                  }`}
                >
                  {/* Slot empty placeholder */}
                  {!pieceInSlot && (
                    <div className="flex flex-col items-center justify-center text-slate-400 select-none pointer-events-none">
                      {showNumbers ? (
                        <span className="font-bold text-base sm:text-lg text-amber-800/60 font-mono">
                          {slotIndex + 1}
                        </span>
                      ) : (
                        <span className="text-xl sm:text-2xl opacity-20">🧩</span>
                      )}
                    </div>
                  )}

                  {/* Render placed piece if present */}
                  {pieceInSlot && (
                    <div className="w-full h-full p-0.5">
                      <PieceRenderer
                        piece={pieceInSlot}
                        imageSrc={animal.imageSrc}
                        size={110} // Will fit container through CSS 100%
                        isLocked={pieceInSlot.isLocked}
                        isSelected={selectedPieceId === pieceInSlot.id}
                        showRotateControl={
                          levelConfig.hasRotation &&
                          !pieceInSlot.isLocked &&
                          selectedPieceId === pieceInSlot.id
                        }
                        onRotate={onRotatePiece}
                        onClick={() => {
                          if (!pieceInSlot.isLocked) {
                            onSelectPiece(
                              selectedPieceId === pieceInSlot.id ? null : pieceInSlot.id
                            );
                          }
                        }}
                        showNumber={showNumbers}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Helpful Interactive Feedback Banner */}
      <div className="w-full mt-3 min-h-[36px] flex items-center justify-center text-center px-3">
        {lastFeedback ? (
          <div
            className={`text-xs sm:text-sm font-medium py-1 px-3 rounded-full animate-fade-in transition-all flex items-center gap-1.5 shadow-2xs ${
              lastFeedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : lastFeedback.type === 'warn'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-sky-100 text-sky-800 border border-sky-300'
            }`}
          >
            <span>{lastFeedback.text}</span>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            {levelConfig.hasRotation
              ? '💡 Toca una pieza para rotarla y encajarla en su lugar correcto.'
              : '💡 Selecciona o arrastra una pieza hacia su casilla correspondiente.'}
          </p>
        )}
      </div>
    </div>
  );
};
