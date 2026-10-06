'use client';

import React from 'react';
import { motion } from 'motion/react';

export type DuoMood = 'idle' | 'happy' | 'celebrating' | 'wrong' | 'victory';

interface DuoOwlMascotProps {
  mood?: DuoMood;
  speechText?: string;
  subText?: string;
  streakCount?: number;
  onTapOwl?: () => void;
}

export const DuoOwlMascot: React.FC<DuoOwlMascotProps> = ({
  mood = 'idle',
  speechText = 'Match the English word with Portuguese!',
  subText,
  streakCount = 0,
  onTapOwl,
}) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 select-none">
      {/* Interactive Animated SVG Duo Owl */}
      <motion.button
        type="button"
        onClick={onTapOwl}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="relative shrink-0 focus:outline-none cursor-pointer group"
        title="Duo, sua coruja amiga! Clique para ouvir uma dica!"
      >
        {/* Glow behind Duo */}
        <div
          className={`absolute -inset-1 rounded-full blur-md opacity-60 transition-colors ${
            mood === 'celebrating' || streakCount >= 3
              ? 'bg-amber-400'
              : mood === 'happy' || mood === 'victory'
              ? 'bg-lime-400'
              : mood === 'wrong'
              ? 'bg-rose-500'
              : 'bg-emerald-500/40'
          }`}
        />

        {/* Duo Mascot SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg relative z-10"
        >
          {/* Feet */}
          <ellipse cx="38" cy="92" rx="7" ry="4" fill="#E57A00" />
          <ellipse cx="62" cy="92" rx="7" ry="4" fill="#E57A00" />

          {/* Main Body (Duo Green) */}
          <motion.rect
            x="20"
            y="22"
            width="60"
            height="68"
            rx="28"
            fill={mood === 'wrong' ? '#4AA72C' : '#58CC02'}
            stroke="#46A302"
            strokeWidth="3"
            animate={
              mood === 'celebrating' || mood === 'happy' || mood === 'victory'
                ? { y: [22, 17, 22] }
                : { y: 22 }
            }
            transition={{ repeat: mood === 'celebrating' ? Infinity : 0, duration: 0.6 }}
          />

          {/* Belly Patch (Lighter Green) */}
          <ellipse cx="50" cy="65" rx="20" ry="18" fill="#78C800" opacity="0.65" />
          {/* Feather flecks */}
          <path d="M 44 60 Q 50 63 56 60" stroke="#46A302" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 46 67 Q 50 70 54 67" stroke="#46A302" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Wings */}
          {mood === 'celebrating' || mood === 'victory' ? (
            // Cheering wings up
            <>
              <motion.path
                d="M 22 45 Q 8 26 12 18 Q 20 28 24 38 Z"
                fill="#46A302"
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
              />
              <motion.path
                d="M 78 45 Q 92 26 88 18 Q 80 28 76 38 Z"
                fill="#46A302"
                animate={{ rotate: [8, -8, 8] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
              />
            </>
          ) : (
            // Normal resting wings
            <>
              <ellipse cx="18" cy="54" rx="6" ry="16" fill="#46A302" />
              <ellipse cx="82" cy="54" rx="6" ry="16" fill="#46A302" />
            </>
          )}

          {/* Eye Sockets (Dark Green/Shadow) */}
          <circle cx="36" cy="40" r="14" fill="#3D8B02" />
          <circle cx="64" cy="40" r="14" fill="#3D8B02" />

          {/* Eye Whites */}
          <circle cx="36" cy="40" r="11" fill="#FFFFFF" />
          <circle cx="64" cy="40" r="11" fill="#FFFFFF" />

          {/* Pupils */}
          {mood === 'happy' || mood === 'celebrating' || mood === 'victory' ? (
            // Smiling arched happy eyes
            <>
              <path
                d="M 29 40 Q 36 32 43 40"
                stroke="#1B4D00"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 57 40 Q 64 32 71 40"
                stroke="#1B4D00"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : mood === 'wrong' ? (
            // Dizzy/concerned eyes
            <>
              <circle cx="37" cy="43" r="5" fill="#333333" />
              <circle cx="63" cy="43" r="5" fill="#333333" />
              <circle cx="38" cy="41" r="1.5" fill="#FFFFFF" />
              <circle cx="64" cy="41" r="1.5" fill="#FFFFFF" />
            </>
          ) : (
            // Big curious wide eyes with reflection
            <>
              <circle cx="37" cy="40" r="6" fill="#2E2B2A" />
              <circle cx="63" cy="40" r="6" fill="#2E2B2A" />
              <circle cx="35" cy="38" r="2.2" fill="#FFFFFF" />
              <circle cx="61" cy="38" r="2.2" fill="#FFFFFF" />
            </>
          )}

          {/* Beak (Orange) */}
          <polygon
            points="44,45 56,45 50,56"
            fill="#FF9600"
            stroke="#E57A00"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Victory Cap or Streak Fire */}
          {(mood === 'celebrating' || streakCount >= 3) && (
            <motion.text
              x="50"
              y="16"
              textAnchor="middle"
              fontSize="16"
              animate={{ scale: [1, 1.25, 1], rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              🔥
            </motion.text>
          )}
          {mood === 'victory' && (
            <text x="50" y="16" textAnchor="middle" fontSize="16">
              👑
            </text>
          )}
        </svg>

        {/* Mascot Level / Streak Indicator Tag */}
        {streakCount > 1 && (
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full border border-amber-300 shadow-md">
            {streakCount}x 🔥
          </span>
        )}
      </motion.button>

      {/* Duolingo Mascot Speech Bubble */}
      <div className="relative bg-slate-900 border-2 border-emerald-500/60 rounded-2xl px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-md flex-1 max-w-xl text-left">
        {/* Speech Bubble Pointer */}
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-emerald-500/60" />
        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-y-7 border-y-transparent border-r-7 border-r-slate-900" />

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm font-black text-slate-100 leading-tight">
            {speechText}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0 border border-emerald-500/30">
            Duo Dica
          </span>
        </div>
        {subText && (
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-1">
            {subText}
          </p>
        )}
      </div>
    </div>
  );
};
