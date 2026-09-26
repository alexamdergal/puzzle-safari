import React from 'react';
import { RotateCw, Check, Sparkles } from 'lucide-react';
import { Animal, LevelConfig, PuzzlePiece } from '../types';
import { PieceRenderer } from './PieceRenderer';

interface PieceTrayProps {
  animal: Animal;
  levelConfig: LevelConfig;
  pieces: PuzzlePiece[];
  selectedPieceId: number | null;
  onSelectPiece: (pieceId: number | null) => void;
  onRotatePiece: (pieceId: number) => void;
  showNumbers: boolean;
}

export const PieceTray: React.FC<PieceTrayProps> = ({
  animal,
  levelConfig,
  pieces,
  selectedPieceId,
  onSelectPiece,
  onRotatePiece,
  showNumbers,
}) => {
  // Only display pieces that are not placed yet
  const unplacedPieces = pieces.filter((p) => !p.isPlaced);
  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-2">
      {/* Tray Container */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-amber-200/80 shadow-md">
        {/* Tray Header */}
        <div className="flex items-center justify-between gap-3 mb-3 border-b border-amber-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-display font-semibold text-amber-950 flex items-center gap-1.5">
              <span>Banco de Piezas</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                {unplacedPieces.length} restantes
              </span>
            </span>
          </div>

          {/* If a piece is selected and level has rotation, show prominent Rotate Button */}
          {selectedPiece && levelConfig.hasRotation && (
            <button
              onClick={() => onRotatePiece(selectedPiece.id)}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-amber-950 px-3 py-1.5 rounded-xl shadow-xs border border-amber-500/30 transition-all active:scale-95"
            >
              <RotateCw className="w-4 h-4 animate-spin-once" />
              <span>Girar 90°</span>
            </button>
          )}
        </div>

        {/* Pieces Grid in Tray */}
        {unplacedPieces.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2 min-h-[110px]">
            {unplacedPieces.map((piece) => {
              const isSelected = selectedPieceId === piece.id;

              return (
                <div key={piece.id} className="relative group">
                  <PieceRenderer
                    piece={piece}
                    imageSrc={animal.imageSrc}
                    size={84}
                    isSelected={isSelected}
                    isLocked={false}
                    showRotateControl={levelConfig.hasRotation}
                    onRotate={onRotatePiece}
                    onClick={() => {
                      onSelectPiece(isSelected ? null : piece.id);
                    }}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', piece.id.toString());
                      onSelectPiece(piece.id);
                    }}
                    showNumber={showNumbers}
                  />

                  {/* Visual tap indicator on selection */}
                  {isSelected && (
                    <div className="absolute -bottom-5 inset-x-0 flex justify-center pointer-events-none">
                      <span className="bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs whitespace-nowrap">
                        Seleccionada
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-emerald-600 font-medium flex flex-col items-center justify-center gap-1">
            <Check className="w-8 h-8 text-emerald-500 animate-bounce-short" />
            <p className="text-sm font-semibold text-emerald-700">
              ¡Todas las piezas están colocadas en el tablero!
            </p>
            <p className="text-xs text-slate-500">
              Si el puzzle no se completa, asegúrate de que todas las piezas estén en su posición y rotación correctas.
            </p>
          </div>
        )}

        {/* Helpful status instruction */}
        {selectedPiece && (
          <div className="mt-3 pt-2 text-center text-xs text-slate-600 border-t border-amber-100 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>
              Pieza #{selectedPiece.id + 1} lista:{' '}
              <strong>Toca cualquier casilla vacía del tablero</strong> para encajarla.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
