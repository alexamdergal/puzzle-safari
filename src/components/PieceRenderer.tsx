import React from 'react';
import { RotateCw, CheckCircle2 } from 'lucide-react';
import { PuzzlePiece } from '../types';

interface PieceRendererProps {
  piece: PuzzlePiece;
  imageSrc: string;
  size: number; // width and height of the tile in px
  isSelected?: boolean;
  isLocked?: boolean;
  showRotateControl?: boolean;
  onRotate?: (pieceId: number) => void;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  showNumber?: boolean;
}

export const PieceRenderer: React.FC<PieceRendererProps> = ({
  piece,
  imageSrc,
  size,
  isSelected = false,
  isLocked = false,
  showRotateControl = false,
  onRotate,
  onClick,
  onDragStart,
  showNumber = false,
}) => {
  // 3x3 grid: column 0, 1, 2 and row 0, 1, 2
  // We compute background-position percentage:
  // col 0 = 0%, col 1 = 50%, col 2 = 100%
  // row 0 = 0%, row 1 = 50%, row 2 = 100%
  const bgPosX = piece.col * 50;
  const bgPosY = piece.row * 50;

  return (
    <div
      className={`relative select-none transition-all duration-200 group ${
        isLocked
          ? 'cursor-default'
          : 'cursor-pointer hover:scale-102 active:scale-98'
      } ${
        isSelected
          ? 'ring-4 ring-pink-400 ring-offset-2 scale-104 shadow-lg z-20'
          : 'shadow-md'
      }`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={onClick}
      draggable={!isLocked}
      onDragStart={onDragStart}
    >
      {/* Visual Piece Container with rounded corners and bevel effect */}
      <div
        className="w-full h-full rounded-2xl overflow-hidden relative border-2 border-white/90 shadow-inner bg-slate-100 transition-transform duration-300"
        style={{
          transform: `rotate(${piece.currentRotation}deg)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Background Image Slice */}
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: '300% 300%',
            backgroundPosition: `${bgPosX}% ${bgPosY}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Number Badge Helper if enabled */}
        {showNumber && (
          <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full z-10 pointer-events-none">
            {piece.id + 1}
          </div>
        )}

        {/* Locked Checkmark Badge */}
        {isLocked && (
          <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 text-emerald-600 rounded-full p-1 shadow-md animate-bounce-short">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Gloss highlight on top edge */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-xl" />
      </div>

      {/* Floating Quick Rotate Button for Selected / Tray Piece */}
      {showRotateControl && !isLocked && onRotate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRotate(piece.id);
          }}
          title="Rotar pieza 90°"
          aria-label="Rotar pieza"
          className="absolute -top-2 -right-2 bg-amber-400 hover:bg-amber-300 text-amber-950 p-1.5 rounded-full shadow-md border-2 border-white transition-transform active:rotate-90 z-30 flex items-center justify-center"
        >
          <RotateCw className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};
