'use client';

import React from 'react';
import { GameTheme } from '@/lib/game-data';
import { Volume2, Eye, EyeOff, BookOpen } from 'lucide-react';

interface GameSettingsBarProps {
  density: 'compact' | 'standard' | 'cozy';
  onDensityChange: (d: 'compact' | 'standard' | 'cozy') => void;
  pairCount: number;
  onPairCountChange: (count: number) => void;
  theme: GameTheme;
  onThemeChange: (theme: GameTheme) => void;
  hideMatched: boolean;
  onToggleHideMatched: () => void;
  onOpenWordsSoundModal?: () => void;
  onOpenStudyModal?: () => void;
  showWordsOnBoard?: boolean;
  onToggleShowWords?: () => void;
  textCase?: 'uppercase' | 'normal';
  onToggleTextCase?: () => void;
  showSyllables?: boolean;
  onToggleSyllables?: () => void;
}

export const GameSettingsBar: React.FC<GameSettingsBarProps> = ({
  density,
  onDensityChange,
  pairCount,
  onPairCountChange,
  theme,
  onThemeChange,
  hideMatched,
  onToggleHideMatched,
  onOpenWordsSoundModal,
  onOpenStudyModal,
  showWordsOnBoard = false,
  onToggleShowWords,
  textCase = 'normal',
  onToggleTextCase,
  showSyllables = false,
  onToggleSyllables,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl px-3 sm:px-4 py-2.5 text-xs text-slate-300">
      {/* Theme and Mode controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Theme Selector */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 font-medium text-[11px] sm:text-xs">Tema:</span>
          <div className="inline-flex rounded-xl bg-slate-950/70 p-0.5 border border-slate-800 flex-wrap gap-0.5">
            <button
              onClick={() => onThemeChange('animals_house')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-colors text-[11px] sm:text-xs cursor-pointer ${
                theme === 'animals_house'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="theme-animals-house"
            >
              <span>🐾🏠</span>
              <span>Animais & Casa</span>
            </button>
            <button
              onClick={() => onThemeChange('animals')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-colors text-[11px] sm:text-xs cursor-pointer ${
                theme === 'animals'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="theme-animals"
            >
              <span>🐾</span>
              <span>Animais (32P)</span>
            </button>
            <button
              onClick={() => onThemeChange('household')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-colors text-[11px] sm:text-xs cursor-pointer ${
                theme === 'household'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="theme-household"
            >
              <span>🏠</span>
              <span>Objetos Casa (32P)</span>
            </button>
            <button
              onClick={() => onThemeChange('mario')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1 transition-colors text-[11px] sm:text-xs cursor-pointer ${
                theme === 'mario'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="theme-mario"
            >
              <span>🍄</span>
              <span>Mario (32P)</span>
            </button>
            <button
              onClick={() => onThemeChange('classic')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1 transition-colors text-[11px] sm:text-xs cursor-pointer ${
                theme === 'classic'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="theme-classic"
            >
              <span>⚔️</span>
              <span>Clássico</span>
            </button>
          </div>
        </div>

        {/* Mode / Pair count options */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 font-medium text-[11px] sm:text-xs">Modo:</span>
          <div className="inline-flex rounded-xl bg-slate-950/70 p-0.5 border border-slate-800">
            <button
              onClick={() => onPairCountChange(32)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors text-[11px] sm:text-xs ${
                pairCount === 32
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="mode-32-pairs"
            >
              32 Pares (64 Cartas) 🔥
            </button>
            <button
              onClick={() => onPairCountChange(20)}
              className={`px-2 py-1 rounded-lg font-medium transition-colors text-[11px] sm:text-xs ${
                pairCount === 20
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="mode-20-pairs"
            >
              20 Pares
            </button>
            <button
              onClick={() => onPairCountChange(12)}
              className={`px-2 py-1 rounded-lg font-medium transition-colors text-[11px] sm:text-xs ${
                pairCount === 12
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="mode-12-pairs"
            >
              12 Pares
            </button>
          </div>
        </div>
        {/* Read & Study Master Button */}
        {onOpenStudyModal && (
          <button
            type="button"
            onClick={onOpenStudyModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/30 text-[11px] sm:text-xs cursor-pointer ring-1 ring-white/20"
            id="btn-open-study-reading"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Ler & Estudar Palavras</span>
          </button>
        )}

        {/* Words & Sound Visualizer Buttons */}
        {onOpenWordsSoundModal && (
          <button
            type="button"
            onClick={onOpenWordsSoundModal}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center space-x-1.5 transition-all text-[11px] sm:text-xs cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ouvir Sons 🔊</span>
          </button>
        )}

        {/* Text Format Toggle (ABC / Abc) */}
        {onToggleTextCase && (
          <button
            type="button"
            onClick={onToggleTextCase}
            title={textCase === 'uppercase' ? 'Mudar para letra minúscula' : 'Mudar para letra bastão (caixa alta)'}
            className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-[11px] cursor-pointer"
          >
            {textCase === 'uppercase' ? '🔤 ABC (Bastão)' : '🔤 Abc (Normal)'}
          </button>
        )}

        {/* Syllables Toggle */}
        {onToggleSyllables && (
          <button
            type="button"
            onClick={onToggleSyllables}
            title="Mostrar ou ocultar separação de sílabas nas cartas"
            className={`px-2 py-1 rounded-xl font-bold text-[11px] transition-colors cursor-pointer ${
              showSyllables
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            <span>{showSyllables ? 'Sílabas: ON' : 'Sílabas: OFF'}</span>
          </button>
        )}

        {onToggleShowWords && (
          <button
            type="button"
            onClick={onToggleShowWords}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1.5 transition-all text-[11px] sm:text-xs cursor-pointer ${
              showWordsOnBoard
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {showWordsOnBoard ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ocultar Cartas</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver Cartas no Tabuleiro</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Grid Zoom / Density Controls & Hide Matched toggle */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 ml-auto">
        {/* Hide/Fade Matched */}
        <label className="flex items-center space-x-1.5 cursor-pointer text-slate-400 hover:text-slate-200 select-none text-[11px] sm:text-xs">
          <input
            type="checkbox"
            checked={hideMatched}
            onChange={onToggleHideMatched}
            className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0 focus:ring-offset-0"
            id="toggle-hide-matched"
          />
          <span className="hidden sm:inline">Esmaecer pares achados</span>
          <span className="sm:hidden">Esmaecer</span>
        </label>

        {/* Size / Density selector */}
        <div className="flex items-center space-x-1">
          <span className="text-slate-500 text-[11px] hidden md:inline">Tamanho:</span>
          <div className="inline-flex rounded-lg bg-slate-950/70 p-0.5 border border-slate-800">
            <button
              onClick={() => onDensityChange('compact')}
              title="Cartas Compactas"
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                density === 'compact'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="density-compact"
            >
              P
            </button>
            <button
              onClick={() => onDensityChange('standard')}
              title="Tamanho Padrão"
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                density === 'standard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="density-standard"
            >
              M
            </button>
            <button
              onClick={() => onDensityChange('cozy')}
              title="Cartas com Curiosidades"
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                density === 'cozy'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="density-cozy"
            >
              G
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
