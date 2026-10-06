'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Volume2, Check, Sparkles } from 'lucide-react';
import { DuoMemoryCard } from '@/lib/duo-english-data';

interface DuoCardProps {
  card: DuoMemoryCard;
  onClick: (card: DuoMemoryCard) => void;
  onSpeak: (text: string, e: React.MouseEvent) => void;
  isProcessing: boolean;
  isPaused: boolean;
  isCompact?: boolean;
  isRevealedOverride?: boolean;
}

export const DuoCard: React.FC<DuoCardProps> = ({
  card,
  onClick,
  onSpeak,
  isProcessing,
  isPaused,
  isCompact = false,
  isRevealedOverride = false,
}) => {
  const isRevealed = card.isFlipped || card.isMatched || card.isPeeked || isRevealedOverride;

  const handleClick = () => {
    if (isProcessing || isPaused || card.isMatched) return;
    if (isRevealedOverride) {
      onSpeak(card.type === 'english' ? card.title : card.exampleEn, {} as React.MouseEvent);
    }
    if (!card.isFlipped) {
      onClick(card);
    }
  };

  const handleSpeakClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSpeak(card.type === 'english' ? card.title : card.exampleEn, e);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-full ${
        isCompact ? 'aspect-[3/3.7]' : 'aspect-[3/3.8]'
      } select-none cursor-pointer perspective-1000 ${
        card.isMatched ? 'cursor-default' : 'hover:scale-[1.02]'
      } transition-transform duration-150`}
    >
      <motion.div
        animate={{
          rotateY: isRevealed ? 180 : 0,
          scale: card.isWrong ? [1, 0.96, 1.04, 0.98, 1] : card.isMatched ? [1, 1.05, 1] : 1,
        }}
        transition={{
          rotateY: { duration: 0.35, ease: 'easeOut' },
          scale: { duration: 0.35 },
        }}
        className="w-full h-full relative preserve-3d"
      >
        {/* CARD BACK (Face Down) - Duolingo Styled */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl flex flex-col items-center justify-between ${
            isCompact ? 'p-1.5 sm:p-2.5' : 'p-2.5 sm:p-3'
          } border-2 border-b-4 transition-colors ${
            isRevealed ? 'pointer-events-none' : ''
          } bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-700/80 border-b-slate-800 hover:border-emerald-500/80 hover:border-b-emerald-600 shadow-md`}
        >
          {/* Card Back Header */}
          <div className="w-full flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span className="text-emerald-500">Duo</span>
            <span className="text-slate-600">EN ↔ PT</span>
          </div>

          {/* Central Duo Owl Icon / Question */}
          <div
            className={`${
              isCompact ? 'w-8 h-8 sm:w-10 sm:h-10 text-lg sm:text-xl' : 'w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl'
            } rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}
          >
            🦉
          </div>

          {/* Card Back Hint */}
          <div className="w-full text-center">
            <span className="text-[9px] sm:text-[10px] font-black tracking-wide text-slate-400 uppercase">
              Toque
            </span>
          </div>
        </div>

        {/* CARD FRONT (Face Up) - English or Portuguese */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl flex flex-col justify-between ${
            isCompact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-2.5'
          } border-2 border-b-4 shadow-xl overflow-hidden ${
            card.isMatched
              ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500 border-b-emerald-600 shadow-emerald-500/20'
              : card.isWrong
              ? 'bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-950 border-rose-500 border-b-rose-600 shadow-rose-500/20'
              : card.type === 'english'
              ? 'bg-gradient-to-br from-sky-950/80 via-slate-900 to-slate-950 border-sky-400 border-b-sky-500 shadow-sky-500/20'
              : 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border-amber-400 border-b-amber-500 shadow-amber-500/20'
          }`}
        >
          {/* Top Label & Audio speaker */}
          <div className="flex items-center justify-between gap-1">
            <span
              className={`text-[8px] sm:text-[9px] font-extrabold uppercase px-1 py-0.5 rounded-md border ${
                card.type === 'english'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {card.type === 'english' ? '🇺🇸 EN' : '🇧🇷 PT'}
            </span>

            {/* Pronunciation Speaker Button */}
            <button
              type="button"
              onClick={handleSpeakClick}
              className="p-0.5 sm:p-1 rounded-full bg-slate-800/80 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors border border-slate-700 shrink-0 cursor-pointer"
              title="Ouvir pronúncia em inglês 🔊"
              aria-label="Ouvir pronúncia"
            >
              <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          {/* Central Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-0.5 my-0.5">
            {/* Visual Icon / Emoji */}
            <div className={`${isCompact ? 'text-xl sm:text-2xl mb-0.5' : 'text-2xl sm:text-3xl mb-1'} filter drop-shadow`}>
              {card.emoji}
            </div>

            {/* Primary Word */}
            <h3
              className={`font-black ${
                isCompact ? 'text-[11px] sm:text-xs md:text-sm' : 'text-xs sm:text-sm md:text-base'
              } leading-tight break-words tracking-tight ${
                card.type === 'english' ? 'text-white' : 'text-amber-200'
              }`}
            >
              {card.title}
            </h3>

            {/* Secondary phonetic or category */}
            {card.subtitle && (
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                {card.subtitle}
              </span>
            )}
          </div>

          {/* Bottom Card Status / Sentence Hint */}
          <div className="w-full flex items-center justify-between text-[8px] sm:text-[9px] text-slate-400 border-t border-slate-800/70 pt-0.5">
            {card.isMatched ? (
              <div className="w-full flex items-center justify-center space-x-1 text-emerald-400 font-bold">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>Acertou!</span>
              </div>
            ) : (
              <span className="w-full text-center text-slate-400 font-medium truncate">
                {card.type === 'english' ? 'Pronuncie 🗣️' : card.category}
              </span>
            )}
          </div>

          {/* Match Sparkle overlay */}
          {card.isMatched && (
            <div className="absolute top-1 right-1 text-emerald-400 pointer-events-none">
              <Sparkles className="w-3 h-3 text-emerald-400" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
