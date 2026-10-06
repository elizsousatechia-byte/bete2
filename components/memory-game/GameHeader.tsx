'use client';

import React from 'react';
import {
  Timer,
  RotateCcw,
  Volume2,
  VolumeX,
  Eye,
  Pause,
  Play,
  Flame,
  Award,
  CheckCircle2,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

interface GameHeaderProps {
  seconds: number;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  combo: number;
  isPaused: boolean;
  hintsRemaining: number;
  isMuted: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  onUseHint: () => void;
  onToggleSound: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  seconds,
  moves,
  matchedPairs,
  totalPairs,
  combo,
  isPaused,
  hintsRemaining,
  isMuted,
  onTogglePause,
  onRestart,
  onUseHint,
  onToggleSound
}) => {
  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round((matchedPairs / totalPairs) * 100);
  const accuracy = moves > 0 ? Math.round((matchedPairs / moves) * 100) : 100;

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
      {/* Top row: Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mb-3">
        {/* Timer */}
        <div className="flex items-center space-x-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Tempo</div>
            <div className="text-base sm:text-lg font-mono font-bold text-slate-100">
              {formatTime(seconds)}
            </div>
          </div>
        </div>

        {/* Moves / Jogadas */}
        <div className="flex items-center space-x-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-2">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Jogadas</div>
            <div className="text-base sm:text-lg font-bold text-slate-100">
              {moves}
            </div>
          </div>
        </div>

        {/* Pares Encontrados */}
        <div className="flex items-center space-x-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
              <span>Pares</span>
              <span className="text-emerald-400 font-medium">{progressPercent}%</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-100 truncate">
              {matchedPairs} <span className="text-xs text-slate-400 font-normal">/ {totalPairs}</span>
            </div>
          </div>
        </div>

        {/* Precisão & Combo */}
        <div className="flex items-center space-x-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Precisão</div>
            <div className="text-base sm:text-lg font-bold text-slate-100">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Combo Streak pill */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-between sm:justify-center lg:justify-start space-x-2 bg-gradient-to-r from-amber-950/30 to-orange-950/20 border border-amber-500/30 rounded-xl px-3 py-2">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: combo > 1 ? [1, 1.25, 1] : 1 }}
              transition={{ repeat: combo > 1 ? Infinity : 0, duration: 1.2 }}
              className={`p-1.5 rounded-lg ${
                combo > 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Flame className="w-4 h-4" />
            </motion.div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-400/90 font-semibold">Combo</div>
              <div className="text-sm font-bold text-amber-300">
                {combo > 1 ? `${combo}x Seguidos!` : '1x Neutro'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 mb-3 overflow-hidden border border-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center space-x-2">
          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-700'
            }`}
            id="btn-pause-game"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Continuar' : 'Pausar'}</span>
          </button>

          {/* Hint / Espiar */}
          <button
            onClick={onUseHint}
            disabled={hintsRemaining <= 0 || isPaused}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              hintsRemaining > 0
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/30 cursor-pointer'
                : 'bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed'
            }`}
            id="btn-hint-game"
            title="Revela as cartas por 1 segundo (restante por partida)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Espiar ({hintsRemaining})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
              isMuted
                ? 'bg-slate-800/50 text-slate-500 border-slate-800'
                : 'bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700'
            }`}
            id="btn-toggle-sound"
            title={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
            id="btn-restart-game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
