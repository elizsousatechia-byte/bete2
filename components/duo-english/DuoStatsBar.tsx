'use client';

import React from 'react';
import {
  Flame,
  Zap,
  Gem,
  Heart,
  Volume2,
  BookOpen,
  RotateCcw,
  Lightbulb,
  VolumeX,
} from 'lucide-react';

interface DuoStatsBarProps {
  xp: number;
  streak: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  speechRate: number;
  isMuted: boolean;
  hintsRemaining: number;
  matchedPairs: number;
  totalPairs: number;
  onToggleSpeechRate: () => void;
  onToggleMute: () => void;
  onUseHint: () => void;
  onOpenDictionary: () => void;
  onRestartGame: () => void;
}

export const DuoStatsBar: React.FC<DuoStatsBarProps> = ({
  xp,
  streak,
  gems,
  hearts,
  maxHearts,
  speechRate,
  isMuted,
  hintsRemaining,
  matchedPairs,
  totalPairs,
  onToggleSpeechRate,
  onToggleMute,
  onUseHint,
  onOpenDictionary,
  onRestartGame,
}) => {
  const progressPercent = Math.round((matchedPairs / totalPairs) * 100);

  return (
    <div className="w-full bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-2.5 sm:p-3 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* DUOLINGO STATS BADGES */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Hearts / Vidas */}
          <div
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-rose-500/30 text-xs font-bold"
            title="Vidas restantes"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-rose-300">
              {hearts > 0 ? `${hearts}/${maxHearts}` : 'Prática'}
            </span>
          </div>

          {/* Streak 🔥 */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border text-xs font-bold transition-colors ${
              streak >= 3
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 shadow-sm shadow-amber-500/20'
                : 'border-slate-800 text-slate-300'
            }`}
            title="Sequência de acertos seguidos"
          >
            <Flame
              className={`w-4 h-4 ${
                streak >= 3 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-500'
              }`}
            />
            <span>{streak} Streak</span>
          </div>

          {/* XP ⚡ */}
          <div
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-yellow-500/30 text-xs font-bold text-yellow-300"
            title="Pontos de Experiência Duolingo"
          >
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{xp} XP</span>
          </div>

          {/* Gems 💎 */}
          <div
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs font-bold text-cyan-300"
            title="Gemas / Lingots acumulados"
          >
            <Gem className="w-4 h-4 text-cyan-400" />
            <span>{gems}</span>
          </div>
        </div>

        {/* CONTROLS & UTILITIES */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio Speech Speed Toggle (Normal 1.0x vs Turtle 0.75x) */}
          <button
            type="button"
            onClick={onToggleSpeechRate}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
            title="Velocidade da pronúncia em inglês (Normal ou Tartaruga/Lento)"
          >
            <span>{speechRate < 1 ? '🐢 0.75x' : '🐰 1.0x'}</span>
          </button>

          {/* Dictionary Study Button */}
          <button
            type="button"
            onClick={onOpenDictionary}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors"
            title="Dicionário de Vocabulário do Nível"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vocabulário</span>
          </button>

          {/* Tactical Hint Button */}
          <button
            type="button"
            onClick={onUseHint}
            disabled={hintsRemaining <= 0}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors ${
              hintsRemaining > 0
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 cursor-pointer'
                : 'bg-slate-800 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
            title="Dica: Revela cartas brevemente"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{hintsRemaining}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title={isMuted ? 'Desmutar áudio' : 'Mutar áudio'}
            aria-label="Controle de som"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={onRestartGame}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Reiniciar jogo com novo baralho"
            aria-label="Reiniciar jogo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar (Duolingo Style Green Bar) */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-3">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">
          Progresso: {matchedPairs}/{totalPairs} pares
        </span>
        <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[11px] font-black text-emerald-400 shrink-0">
          {progressPercent}%
        </span>
      </div>
    </div>
  );
};
