'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Clock, RotateCcw, Share2, Flame, Target, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VictoryModalProps {
  isOpen: boolean;
  seconds: number;
  moves: number;
  totalPairs: number;
  maxCombo: number;
  isNewRecord: boolean;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  seconds,
  moves,
  totalPairs,
  maxCombo,
  isNewRecord,
  onPlayAgain
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst!
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format time
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const timeFormatted = `${mins}m ${remainingSecs}s`;

  // Calculate rating stars (for 32 pairs: theoretical min moves is 32, excellent < 55 moves)
  const accuracy = Math.round((totalPairs / Math.max(moves, totalPairs)) * 100);
  let stars = 1;
  if (moves <= totalPairs * 1.5) {
    stars = 3;
  } else if (moves <= totalPairs * 2.2) {
    stars = 2;
  }

  const handleShare = () => {
    const text = `🏆 Venci o Desafio da Memória de ${totalPairs} pares (${totalPairs * 2} cartas) na Arena Jogos em ${timeFormatted} com ${moves} jogadas! ⭐⭐⭐ Você consegue bater meu recorde?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center"
          id="victory-modal"
        >
          {/* Glowing background halo */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy Badge */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30 mb-4">
            <Trophy className="w-10 h-10 stroke-[2.2]" />
            {isNewRecord && (
              <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white border-2 border-slate-900 shadow">
                Novo Recorde!
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mb-1">
            Parabéns, Campeão!
          </h2>
          <p className="text-sm text-slate-400 mb-5">
            Você memorizou e completou todos os <span className="text-indigo-400 font-bold">{totalPairs} pares ({totalPairs * 2} cartas)</span>!
          </p>

          {/* Stars */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            {[1, 2, 3].map((starIdx) => (
              <motion.div
                key={starIdx}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + starIdx * 0.1, type: 'spring' }}
              >
                <Star
                  className={`w-8 h-8 ${
                    starIdx <= stars
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                      : 'text-slate-700'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tempo Total</span>
              </div>
              <div className="text-lg font-mono font-bold text-slate-100">{timeFormatted}</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>Jogadas</span>
              </div>
              <div className="text-lg font-bold text-slate-100">{moves} tentativas</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Precisão</span>
              </div>
              <div className="text-lg font-bold text-slate-100">{accuracy}%</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Maior Combo</span>
              </div>
              <div className="text-lg font-bold text-slate-100">{maxCombo}x seguidos</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleShare}
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
              id="btn-share-result"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar</span>
                </>
              )}
            </button>

            <button
              onClick={onPlayAgain}
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all"
              id="btn-play-again"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jogar Novamente</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
