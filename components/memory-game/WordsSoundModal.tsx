'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, Search, Play, Square, Sparkles } from 'lucide-react';
import { CardDefinition, ANIMALS_DATABASE, HOUSEHOLD_DATABASE, ANIMALS_AND_HOUSE_DATABASE, MARIO_DATABASE, CLASSIC_DATABASE, GameTheme, STUDY_READING_DATA } from '@/lib/game-data';
import { soundManager } from '@/lib/sound';

interface WordsSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: GameTheme;
}

export const WordsSoundModal: React.FC<WordsSoundModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<GameTheme>(theme);
  const [prevTheme, setPrevTheme] = useState<GameTheme>(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (theme !== prevTheme) {
    setPrevTheme(theme);
    setSelectedTheme(theme);
  }

  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    };
  }, []);

  if (!isOpen) return null;

  let currentDatabase: CardDefinition[] = ANIMALS_AND_HOUSE_DATABASE;
  if (selectedTheme === 'animals') currentDatabase = ANIMALS_DATABASE;
  else if (selectedTheme === 'household') currentDatabase = HOUSEHOLD_DATABASE;
  else if (selectedTheme === 'animals_house') currentDatabase = ANIMALS_AND_HOUSE_DATABASE;
  else if (selectedTheme === 'mario') currentDatabase = MARIO_DATABASE;
  else if (selectedTheme === 'classic') currentDatabase = CLASSIC_DATABASE;

  const filteredItems = currentDatabase.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const handlePlayAll = () => {
    if (isPlayingAll) {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAll(false);
      setCurrentPlayingIndex(null);
      return;
    }

    if (filteredItems.length === 0) return;

    setIsPlayingAll(true);
    let index = 0;

    const playNext = () => {
      if (index >= filteredItems.length) {
        setIsPlayingAll(false);
        setCurrentPlayingIndex(null);
        return;
      }
      setCurrentPlayingIndex(index);
      const item = filteredItems[index];
      soundManager.speakPortuguese(item.name, 1.0);

      index++;
      playTimeoutRef.current = setTimeout(playNext, 1600);
    };

    playNext();
  };

  const handleStopAll = () => {
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAll(false);
    setCurrentPlayingIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-indigo-500/70 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 border border-indigo-500/50 flex items-center justify-center text-2xl shadow-inner shrink-0">
              👁️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Visualizar Palavras & Som da Memória
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  Voz e Áudio 🔊
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Veja todas as 32 cartas e toque no alto-falante 🔊 para ouvir a pronúncia de cada item!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              handleStopAll();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Controls Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/90 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por animal ou objeto..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Play All Sequence Button */}
            <button
              type="button"
              onClick={handlePlayAll}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer shrink-0 ${
                isPlayingAll
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isPlayingAll ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Parar Áudio</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ouvir Todos ({filteredItems.length})</span>
                </>
              )}
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'animals_house' as GameTheme, label: '🐾🏠 Animais & Casa (32P)' },
              { id: 'animals' as GameTheme, label: '🐾 Reino Animal (32P)' },
              { id: 'household' as GameTheme, label: '🏠 Objetos Casa (32P)' },
              { id: 'mario' as GameTheme, label: '🍄 Super Mario (32P)' },
              { id: 'classic' as GameTheme, label: '⚔️ Clássico (32P)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  handleStopAll();
                  setSelectedTheme(t.id);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTheme === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Word Items Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredItems.map((item, idx) => {
            const isPlaying = currentPlayingIndex === idx;
            return (
              <div
                key={item.pairId}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isPlaying
                    ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/50 scale-[1.02]'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="text-3xl shrink-0 filter drop-shadow">
                    {item.emoji || '⭐'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span className="font-extrabold text-sm sm:text-base text-white truncate">
                        {item.name}
                      </span>
                      {STUDY_READING_DATA[item.pairId]?.syllables && (
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          {STUDY_READING_DATA[item.pairId].syllables}
                        </span>
                      )}
                      <span className="text-[10px] text-indigo-300 font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/20 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    {STUDY_READING_DATA[item.pairId]?.readingSentence ? (
                      <p className="text-xs text-slate-300 truncate mt-0.5 italic">
                        &ldquo;{STUDY_READING_DATA[item.pairId].readingSentence}&rdquo;
                      </p>
                    ) : item.subtitle ? (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => soundManager.speakPortuguese(item.name, 1.0)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors border border-slate-700 shrink-0 cursor-pointer"
                    title={`Ouvir pronúncia normal de "${item.name}"`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => soundManager.speakSlow(item.name)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition-colors border border-slate-700 shrink-0 cursor-pointer"
                    title={`Ouvir pronúncia lenta (alfabetização) de "${item.name}"`}
                  >
                    <span className="text-xs">🐢</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredItems.length} cartas com áudio de pronúncia</span>
          <button
            type="button"
            onClick={() => {
              handleStopAll();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
