'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Zap, Gem, Flame, RotateCcw, BookOpen, Star, CheckCircle } from 'lucide-react';
import { DuoOwlMascot } from '@/components/duo-english/DuoOwlMascot';

interface DuoVictoryModalProps {
  isOpen: boolean;
  xpEarned: number;
  gemsEarned: number;
  maxStreak: number;
  totalMoves: number;
  totalSeconds: number;
  totalPairs: number;
  onPlayAgain: () => void;
  onOpenDictionary: () => void;
}

export const DuoVictoryModal: React.FC<DuoVictoryModalProps> = ({
  isOpen,
  xpEarned,
  gemsEarned,
  maxStreak,
  totalMoves,
  totalSeconds,
  totalPairs,
  onPlayAgain,
  onOpenDictionary,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Launch celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#58CC02', '#FFC800', '#FF4B4B', '#1CB0F6', '#2B70C9'],
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 sm:p-6 shadow-2xl text-center overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot Centerpiece */}
        <div className="flex justify-center mb-3">
          <DuoOwlMascot
            mood="victory"
            speechText="Fantastic! Lesson Complete!"
            subText="Você praticou e aprendeu novas palavras em inglês!"
            streakCount={maxStreak}
          />
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
          Lição de Inglês Concluída! 🎓
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Parabéns! Você associou todos os <strong>{totalPairs} pares</strong> de palavras em inglês e português.
        </p>

        {/* Rewards Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          {/* XP */}
          <div className="bg-slate-950/80 border border-yellow-500/40 rounded-2xl p-3 flex flex-col items-center">
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 mb-1" />
            <span className="text-lg font-black text-yellow-400">+{xpEarned}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">XP Total</span>
          </div>

          {/* Gems */}
          <div className="bg-slate-950/80 border border-cyan-500/40 rounded-2xl p-3 flex flex-col items-center">
            <Gem className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-lg font-black text-cyan-300">+{gemsEarned}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Lingots</span>
          </div>

          {/* Max Streak */}
          <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-3 flex flex-col items-center">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 mb-1" />
            <span className="text-lg font-black text-amber-400">{maxStreak}x</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Max Streak</span>
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex items-center justify-around bg-slate-950/50 rounded-xl py-2 px-3 text-xs text-slate-400 mb-5 border border-slate-800">
          <div>
            Tempo: <strong className="text-slate-200">{formatTime(totalSeconds)}</strong>
          </div>
          <div>•</div>
          <div>
            Tentativas: <strong className="text-slate-200">{totalMoves}</strong>
          </div>
          <div>•</div>
          <div>
            Precisão:{' '}
            <strong className="text-emerald-400">
              {Math.max(20, Math.round((totalPairs / Math.max(1, totalMoves)) * 100))}%
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar Novamente</span>
          </button>

          <button
            type="button"
            onClick={onOpenDictionary}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Revisar Vocabulário</span>
          </button>
        </div>
      </div>
    </div>
  );
};
