'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, Search, Play, Square, Sparkles, Volume1, MessageSquare } from 'lucide-react';
import { DuoWordItem, DUO_WORDS_DATABASE, DuoCategory, DUO_CATEGORIES_META } from '@/lib/duo-english-data';
import { soundManager } from '@/lib/sound';

interface DuoDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
  currentCategory: DuoCategory;
}

export const DuoDictionaryModal: React.FC<DuoDictionaryModalProps> = ({
  isOpen,
  onClose,
  onSpeak,
  currentCategory,
}) => {
  const [selectedCat, setSelectedCat] = useState<DuoCategory>(currentCategory);
  const [prevCategory, setPrevCategory] = useState<DuoCategory>(currentCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (currentCategory !== prevCategory) {
    setPrevCategory(currentCategory);
    setSelectedCat(currentCategory);
  }

  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const filteredWords = DUO_WORDS_DATABASE.filter((item) => {
    const matchesCat =
      selectedCat === 'all' ||
      item.category === selectedCat ||
      (selectedCat === 'animals_home' && (item.category === 'animals' || item.category === 'home'));
    const matchesSearch =
      item.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.portuguese.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Play all words sequentially
  const handlePlayAll = () => {
    if (isPlayingAll) {
      // Stop
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAll(false);
      setCurrentPlayingIndex(null);
      return;
    }

    if (filteredWords.length === 0) return;

    setIsPlayingAll(true);
    let index = 0;

    const playNext = () => {
      if (index >= filteredWords.length) {
        setIsPlayingAll(false);
        setCurrentPlayingIndex(null);
        return;
      }
      setCurrentPlayingIndex(index);
      const word = filteredWords[index];
      soundManager.speakEnglish(word.english, 0.9);

      index++;
      playTimeoutRef.current = setTimeout(playNext, 1800);
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
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/70 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-teal-500/30 border border-emerald-500/50 flex items-center justify-center text-2xl shadow-inner shrink-0">
              👁️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Visualizar Palavras & Som
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Áudio Nativo 🔊
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Veja a grafia, tradução e toque nos botões para ouvir a pronúncia em inglês ou português!
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

        {/* Filter & Action Controls Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/90 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar palavra por nome em inglês ou português..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Play All Sequence Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePlayAll}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer ${
                  isPlayingAll
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
                }`}
              >
                {isPlayingAll ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Parar Reprodução</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Ouvir Todas ({filteredWords.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Categories Pill Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {DUO_CATEGORIES_META.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  handleStopAll();
                  setSelectedCat(cat.id);
                }}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Words Grid List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Nenhuma palavra encontrada para &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredWords.map((item: DuoWordItem, idx: number) => {
              const isCurrentlyPlaying = currentPlayingIndex === idx;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                    isCurrentlyPlaying
                      ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/50 scale-[1.01]'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-start space-x-3.5 flex-1">
                    <div className="text-3xl shrink-0 pt-0.5 filter drop-shadow">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-black text-sm sm:text-base text-white">
                          {item.english}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          {item.phonetic}
                        </span>
                        <span className="text-xs text-slate-500">↔</span>
                        <span className="font-bold text-xs sm:text-sm text-amber-300">
                          {item.portuguese}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {item.categoryName}
                        </span>
                      </div>

                      {/* Example sentences */}
                      <p className="text-xs text-slate-300 mt-1 italic leading-relaxed">
                        &ldquo;{item.exampleSentenceEn}&rdquo;
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.exampleSentencePt}
                      </p>
                    </div>
                  </div>

                  {/* Sound Action Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Speak English */}
                    <button
                      type="button"
                      onClick={() => soundManager.speakEnglish(item.english)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-600 text-sky-300 hover:text-white transition-colors border border-sky-600/40 text-xs font-bold cursor-pointer"
                      title={`Ouvir "${item.english}" em inglês`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Inglês 🇺🇸</span>
                    </button>

                    {/* Speak Portuguese */}
                    <button
                      type="button"
                      onClick={() => soundManager.speakPortuguese(item.portuguese)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-600 text-amber-300 hover:text-white transition-colors border border-amber-600/40 text-xs font-bold cursor-pointer"
                      title={`Ouvir "${item.portuguese}" em português`}
                    >
                      <Volume1 className="w-3.5 h-3.5" />
                      <span>Português 🇧🇷</span>
                    </button>

                    {/* Speak Sentence */}
                    <button
                      type="button"
                      onClick={() => soundManager.speakEnglish(item.exampleSentenceEn)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                      title="Ouvir a frase completa em inglês"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredWords.length} palavras prontas com som</span>
          <button
            type="button"
            onClick={() => {
              handleStopAll();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
          >
            Fechar Visualizador
          </button>
        </div>
      </div>
    </div>
  );
};
