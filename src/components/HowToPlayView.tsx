import React from 'react';
import { Play, Sparkles, RotateCw, Grid, Trophy, Heart } from 'lucide-react';

interface HowToPlayViewProps {
  onStartPlaying: () => void;
}

export const HowToPlayView: React.FC<HowToPlayViewProps> = ({ onStartPlaying }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>GUÍA DEL AVENTURERO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-amber-950 mb-1">
          ¿Cómo Jugar Chibi Puzzle Safari?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Aprende las mecánicas del rompecabezas de 9 piezas y cómo rescatar a todos los animalitos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs flex flex-col gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg border border-amber-300">
            <Grid className="w-5 h-5 text-amber-700" />
          </div>
          <h2 className="font-display font-bold text-base text-slate-900">
            1. El Tablero de 9 Piezas (3x3)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cada rompecabezas consta de una cuadrícula de 3 filas por 3 columnas. Puedes <strong>tocar una pieza</strong> en el banco para seleccionarla y luego tocar la casilla donde deseas encajarla, o bien <strong>arrastrarla directamente</strong> con el ratón o tu dedo.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs flex flex-col gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg border border-amber-300">
            <RotateCw className="w-5 h-5 text-amber-700" />
          </div>
          <h2 className="font-display font-bold text-base text-slate-900">
            2. Mecánica de Rotación (Nivel 3+)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            A partir del Nivel 3, las piezas estarán giradas a 90°, 180° o 270°. Haz clic sobre el botón circular de giro o pulsa la pieza para rotarla hasta que quede en la orientación correcta antes de encajarla en el tablero.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs flex flex-col gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-900 text-amber-100 flex items-center justify-center font-bold text-lg border border-amber-600">
            <span className="text-base">📖</span>
          </div>
          <h2 className="font-display font-bold text-base text-slate-900">
            3. Álbum del Coleccionista Oficial
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cada animal que desbloqueas añade su ilustración única a tu <strong>Álbum de Coleccionista</strong> con su estampa numerada, rareza (Común, Raro, Místico, Legendario) y un fascinante <strong>dato curioso</strong> o dato científico divertido.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs flex flex-col gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg border border-amber-300">
            <Trophy className="w-5 h-5 text-amber-700" />
          </div>
          <h2 className="font-display font-bold text-base text-slate-900">
            4. Estrellas de Maestría
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Si completas el nivel en tiempo récord, obtendrás hasta 3 estrellas de oro. Además, dispones de herramientas de ayuda como la <strong>Silueta Guía</strong> y los <strong>Números Guía</strong> si deseas un juego más relajante.
          </p>
        </div>
      </div>

      {/* Big Play CTA */}
      <div className="text-center">
        <button
          onClick={onStartPlaying}
          className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-display font-bold text-base shadow-md border-b-4 border-amber-600 transition-all active:scale-95 inline-flex items-center gap-2"
        >
          <Play className="w-5 h-5 fill-amber-950" />
          <span>¡Comenzar a Jugar!</span>
        </button>
      </div>
    </div>
  );
};
