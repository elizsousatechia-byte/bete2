'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Check, Volume2 } from 'lucide-react';
import { CardState, GameTheme } from '@/lib/game-data';
import { soundManager } from '@/lib/sound';

interface CardProps {
  card: CardState;
  onClick: (card: CardState) => void;
  disabled: boolean;
  density: 'compact' | 'standard' | 'cozy';
  theme?: GameTheme;
  isRevealedOverride?: boolean;
  textCase?: 'uppercase' | 'normal';
  showSyllables?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  onClick,
  disabled,
  density,
  theme = 'animals',
  isRevealedOverride = false,
  textCase = 'normal',
  showSyllables = false,
}) => {
  const IconComponent = card.icon;
  const isRevealed = card.isFlipped || card.isMatched || card.isPeeked || isRevealedOverride;
  const isMarioCard = theme === 'mario';
  const isAnimalCard = theme === 'animals';
  const isAnimalsHouseCard = theme === 'animals_house';
  const isHouseholdCard = theme === 'household';

  // Responsive padding and sizing according to density
  const sizeClasses = {
    compact: 'h-16 sm:h-18 md:h-20 lg:h-22 text-xs',
    standard: 'h-18 sm:h-22 md:h-24 lg:h-28 text-xs sm:text-sm',
    cozy: 'h-22 sm:h-26 md:h-30 lg:h-34 text-sm'
  }[density];

  const emojiSizes = {
    compact: 'text-xl sm:text-2xl md:text-3xl',
    standard: 'text-2xl sm:text-3xl md:text-4xl',
    cozy: 'text-3xl sm:text-4xl md:text-5xl'
  }[density];

  const iconSizes = {
    compact: 'w-6 h-6 sm:w-7 sm:h-7',
    standard: 'w-7 h-7 sm:w-9 sm:h-9',
    cozy: 'w-8 h-8 sm:w-11 sm:h-11'
  }[density];

  return (
    <div
      className={`relative select-none perspective-1000 ${sizeClasses} w-full cursor-pointer group`}
      onClick={() => {
        if (!disabled && !isRevealed) {
          onClick(card);
        }
      }}
      id={`memory-card-${card.instanceId}`}
      role="button"
      tabIndex={0}
      aria-label={isRevealed ? `${card.name} - ${card.category}` : 'Carta virada'}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isRevealed) {
          e.preventDefault();
          onClick(card);
        }
      }}
    >
      <motion.div
        className="w-full h-full relative transform-style-3d transition-all duration-300"
        animate={{
          rotateY: isRevealed ? 180 : 0,
          scale: card.isMatched ? 0.95 : card.isWrong ? [1, 1.05, 0.95, 1.02, 1] : 1,
        }}
        transition={{
          duration: 0.35,
          ease: 'easeOut',
        }}
      >
        {/* Back of Card (Face Down) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center shadow-md transition-all duration-200 ${
            isMarioCard
              ? 'group-hover:border-red-500/60 group-hover:shadow-red-500/20'
              : isHouseholdCard
              ? 'group-hover:border-amber-500/60 group-hover:shadow-amber-500/20'
              : isAnimalsHouseCard || isAnimalCard
              ? 'group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/20'
              : 'group-hover:border-indigo-500/60 group-hover:shadow-indigo-500/20'
          } group-hover:shadow-lg ${disabled ? 'cursor-default' : 'hover:-translate-y-0.5'}`}
        >
          {/* Card Back Insignia */}
          <div className="absolute inset-1.5 rounded-xl border border-slate-700/40 bg-slate-950/50 flex flex-col items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 opacity-10 ${
                isMarioCard
                  ? 'bg-[radial-gradient(#ef4444_1px,transparent_1px)]'
                  : isHouseholdCard
                  ? 'bg-[radial-gradient(#f59e0b_1px,transparent_1px)]'
                  : isAnimalsHouseCard || isAnimalCard
                  ? 'bg-[radial-gradient(#10b981_1px,transparent_1px)]'
                  : 'bg-[radial-gradient(#818cf8_1px,transparent_1px)]'
              } [background-size:10px_10px]`}
            />
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${
                isMarioCard
                  ? 'border-red-500/40 bg-red-950/40 text-red-400'
                  : isHouseholdCard
                  ? 'border-amber-500/40 bg-amber-950/40 text-amber-400'
                  : isAnimalsHouseCard || isAnimalCard
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400'
                  : 'border-indigo-500/40 bg-indigo-950/40 text-indigo-400'
              }`}
            >
              {isMarioCard ? (
                <span className="text-base select-none" role="img" aria-hidden="true">🍄</span>
              ) : isAnimalsHouseCard ? (
                <span className="text-xs select-none" role="img" aria-hidden="true">🐾🏠</span>
              ) : isHouseholdCard ? (
                <span className="text-base select-none" role="img" aria-hidden="true">🏠</span>
              ) : isAnimalCard ? (
                <span className="text-base select-none" role="img" aria-hidden="true">🐾</span>
              ) : (
                <span className="text-xs font-black select-none">?</span>
              )}
            </div>
          </div>
        </div>

        {/* Front of Card (Face Up / Revealed) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center p-1 sm:p-2 overflow-hidden shadow-lg ${
            card.isMatched
              ? 'bg-emerald-950/40 border-emerald-500/70 shadow-emerald-500/20'
              : card.isWrong
              ? 'bg-rose-950/40 border-rose-500/70 shadow-rose-500/25'
              : `bg-slate-900/95 border-slate-700/80 shadow-slate-900/50 bg-gradient-to-br ${card.bgGrad}`
          }`}
        >
          {/* Sound button on revealed card */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.speakPortuguese(card.name);
            }}
            className="absolute top-1 left-1 p-0.5 sm:p-1 rounded-full bg-slate-950/70 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors border border-slate-700/60 z-10 cursor-pointer"
            title={`Ouvir som: ${card.name}`}
          >
            <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>

          {/* Matched checkmark badge */}
          {card.isMatched && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md z-10"
            >
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
            </motion.div>
          )}

          {/* Category chip tag for cozy density */}
          {density === 'cozy' && (
            <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400/80 bg-slate-950/50 px-1.5 py-0.5 rounded">
              {card.category}
            </span>
          )}

          {/* Graphic: Emoji (Animals) OR Lucide Icon (Arcade/Fantasy) */}
          {card.emoji ? (
            <div
              className={`leading-none filter drop-shadow-md select-none transition-transform ${emojiSizes} ${
                card.isMatched ? 'opacity-85 scale-95' : 'scale-100 hover:scale-110'
              }`}
            >
              {card.emoji}
            </div>
          ) : IconComponent ? (
            <div
              className={`p-1.5 rounded-lg transition-transform ${
                card.isMatched ? 'opacity-70 scale-90' : 'scale-100'
              } ${card.color}`}
            >
              <IconComponent className={iconSizes} />
            </div>
          ) : null}

          {/* Name Label with Reading Enhancement */}
          <div className="w-full text-center px-0.5 mt-0.5 sm:mt-1">
            <span
              className={`font-black tracking-tight truncate block max-w-full leading-tight ${
                textCase === 'uppercase' ? 'tracking-wider uppercase' : ''
              } ${
                density === 'compact' ? 'text-[10px] sm:text-[11px]' : 'text-[11px] sm:text-xs'
              } ${
                card.isMatched
                  ? 'text-emerald-300'
                  : isAnimalCard
                  ? 'text-white'
                  : isHouseholdCard
                  ? 'text-amber-100'
                  : 'text-slate-100'
              }`}
            >
              {textCase === 'uppercase' ? card.name.toUpperCase() : card.name}
            </span>

            {/* Syllables display for reading practice */}
            {showSyllables && card.syllables && (
              <span className="text-[9px] font-mono font-bold text-amber-300 block truncate leading-none mt-0.5 bg-slate-950/60 rounded px-1 py-0.5 border border-amber-500/20">
                {card.syllables}
              </span>
            )}

            {/* Subtitle / curiosity in cozy density */}
            {!showSyllables && density === 'cozy' && card.subtitle && (
              <span className="text-[9px] text-slate-400 truncate block leading-tight">
                {card.subtitle}
              </span>
            )}
          </div>

          {/* Glow shimmer effect on matched cards */}
          {card.isMatched && (
            <div className="absolute inset-0 pointer-events-none opacity-25 bg-gradient-to-t from-emerald-500/20 to-transparent" />
          )}
        </div>
      </motion.div>
    </div>
  );
};
