'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  Search,
  Play,
  Square,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  HelpCircle,
  Award,
  Layers,
  Flame,
  Star,
  RefreshCw,
} from 'lucide-react';
import {
  CardDefinition,
  ANIMALS_DATABASE,
  HOUSEHOLD_DATABASE,
  ANIMALS_AND_HOUSE_DATABASE,
  MARIO_DATABASE,
  CLASSIC_DATABASE,
  GameTheme,
  STUDY_READING_DATA,
} from '@/lib/game-data';
import { soundManager } from '@/lib/sound';

interface StudyReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: GameTheme;
}

type StudyTab = 'flashcards' | 'dictionary' | 'quiz';

export const StudyReadingModal: React.FC<StudyReadingModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<StudyTab>('flashcards');
  const [selectedTheme, setSelectedTheme] = useState<GameTheme>(theme);
  const [prevTheme, setPrevTheme] = useState<GameTheme>(theme);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isUppercase, setIsUppercase] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [studiedWords, setStudiedWords] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arena_studied_words');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  // Karaokê auto-reader state
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz state
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);

  if (theme !== prevTheme) {
    setPrevTheme(theme);
    setSelectedTheme(theme);
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    };
  }, []);

  // Save studied words to localStorage
  const toggleWordStudied = (pairId: string) => {
    setStudiedWords((prev) => {
      const next = { ...prev, [pairId]: !prev[pairId] };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('arena_studied_words', JSON.stringify(next));
        } catch {
          // Ignore
        }
      }
      return next;
    });
    soundManager.playMatch(1);
  };

  // Get current active database
  let rawDatabase: CardDefinition[] = ANIMALS_AND_HOUSE_DATABASE;
  if (selectedTheme === 'animals') rawDatabase = ANIMALS_DATABASE;
  else if (selectedTheme === 'household') rawDatabase = HOUSEHOLD_DATABASE;
  else if (selectedTheme === 'animals_house') rawDatabase = ANIMALS_AND_HOUSE_DATABASE;
  else if (selectedTheme === 'mario') rawDatabase = MARIO_DATABASE;
  else if (selectedTheme === 'classic') rawDatabase = CLASSIC_DATABASE;

  // Augment database with study info if missing
  const currentDatabase: CardDefinition[] = rawDatabase.map((item) => {
    const info = STUDY_READING_DATA[item.pairId];
    return {
      ...item,
      syllables: item.syllables || info?.syllables || item.name.toUpperCase(),
      readingSentence: item.readingSentence || info?.readingSentence || `${item.name} para ler e memorizar.`,
      curiosity: item.curiosity || info?.curiosity || item.subtitle,
    };
  });

  const filteredItems = currentDatabase.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.syllables && item.syllables.toLowerCase().includes(q)) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Current flashcard item
  const safeCurrentIndex = Math.min(Math.max(currentIndex, 0), currentDatabase.length - 1);
  const currentCard = currentDatabase[safeCurrentIndex] || currentDatabase[0];

  // Quiz target and deterministic options using React.useMemo
  const targetQuizItem =
    currentDatabase.length > 0 ? currentDatabase[quizCurrentIndex % currentDatabase.length] : null;

  const quizOptions = React.useMemo(() => {
    if (!targetQuizItem || currentDatabase.length === 0) return [];
    const pool = currentDatabase.filter((c) => c.pairId !== targetQuizItem.pairId);
    const startIdx = (quizCurrentIndex * 3) % Math.max(1, pool.length - 3);
    const wrongOptions = pool.slice(startIdx, startIdx + 3).map((c) => c.name);
    const combined = [targetQuizItem.name, ...wrongOptions];
    return Array.from(new Set(combined)).sort((a, b) => {
      const hashA = (a.charCodeAt(0) * 17 + quizCurrentIndex * 31) % 97;
      const hashB = (b.charCodeAt(0) * 17 + quizCurrentIndex * 31) % 97;
      return hashA - hashB;
    });
  }, [targetQuizItem, currentDatabase, quizCurrentIndex]);

  const advanceQuiz = () => {
    setQuizFeedback(null);
    setQuizSelectedOption(null);
    setQuizCurrentIndex((prev) => prev + 1);
  };

  const handleQuizAnswer = (chosenName: string) => {
    if (quizFeedback !== null || !targetQuizItem) return;
    setQuizSelectedOption(chosenName);
    if (chosenName === targetQuizItem.name) {
      setQuizFeedback('correct');
      setQuizScore((prev) => prev + 10);
      soundManager.playMatch(2);
      soundManager.speakPortuguese(`Muito bem! Você leu: ${targetQuizItem.name}!`);
      setTimeout(() => {
        advanceQuiz();
      }, 1500);
    } else {
      setQuizFeedback('wrong');
      soundManager.playMismatch();
      soundManager.speakPortuguese(`Tente novamente! Esta palavra é: ${chosenName}`);
    }
  };

  // Karaokê Play All
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
      soundManager.speakPortuguese(item.name, 0.9);

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

  if (!isOpen) return null;

  const totalStudiedCount = Object.values(studiedWords).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-indigo-500/70 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-2xl shadow-lg shrink-0 border border-indigo-400/40">
              📖
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Ler & Estudar Palavras
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  Alfabetização & Leitura 🔊
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-emerald-400" />
                  {totalStudiedCount} Estudadas
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Leia as palavras dos 32 pares de Animais e Objetos da Casa com sílabas, frases e som lento!
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
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS & THEME CONTROLS */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          {/* Main 3 Activity Tabs */}
          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                handleStopAll();
                setActiveTab('flashcards');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📇</span>
              <span>Cartões de Estudo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleStopAll();
                setActiveTab('dictionary');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'dictionary'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📚</span>
              <span>Mural de Leitura</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleStopAll();
                setActiveTab('quiz');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎯</span>
              <span>Treino de Leitura</span>
            </button>
          </div>

          {/* Theme Selector Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {[
              { id: 'animals_house' as GameTheme, label: '🐾🏠 Animais & Casa (32P)' },
              { id: 'animals' as GameTheme, label: '🐾 Animais (32P)' },
              { id: 'household' as GameTheme, label: '🏠 Objetos da Casa (32P)' },
              { id: 'mario' as GameTheme, label: '🍄 Super Mario (32P)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  handleStopAll();
                  setSelectedTheme(t.id);
                  setCurrentIndex(0);
                  setQuizCurrentIndex(0);
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

        {/* TAB 1: CARTÕES DE ESTUDO (FLASHCARDS PARA LER) */}
        {activeTab === 'flashcards' && currentCard && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-between gap-4">
            {/* Top Toolbar: Font Case Switcher + Studied Badge */}
            <div className="w-full max-w-xl flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="font-bold">Formato da Letra:</span>
                <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUppercase(true)}
                    className={`px-2 py-0.5 rounded text-[11px] font-black cursor-pointer ${
                      isUppercase ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    ABC (CAIXA ALTA)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUppercase(false)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                      !isUppercase ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Abc (Normal)
                  </button>
                </div>
              </div>

              {/* Mark as studied */}
              <button
                type="button"
                onClick={() => toggleWordStudied(currentCard.pairId)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  studiedWords[currentCard.pairId]
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {studiedWords[currentCard.pairId] ? 'Estudada! ✅' : 'Marcar como Estudada'}
                </span>
              </button>
            </div>

            {/* Interactive Flashcard */}
            <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
              {/* Category Pill */}
              <div className="absolute top-4 left-4 text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                {currentCard.category}
              </div>

              {/* Progress Count */}
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-500">
                {safeCurrentIndex + 1} / {currentDatabase.length}
              </div>

              {/* Emoji Graphic */}
              <div className="text-6xl sm:text-7xl my-3 filter drop-shadow-lg select-none hover:scale-110 transition-transform">
                {currentCard.emoji || '⭐'}
              </div>

              {/* Big Word to Read */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-1 mb-2">
                {isUppercase ? currentCard.name.toUpperCase() : currentCard.name}
              </h1>

              {/* Syllables Bubble */}
              {currentCard.syllables && (
                <div className="flex items-center justify-center flex-wrap gap-1.5 my-2">
                  {currentCard.syllables.split('•').map((syl, i) => (
                    <span
                      key={i}
                      onClick={() => soundManager.speakPortuguese(syl.trim())}
                      className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 font-mono font-black text-sm sm:text-base hover:bg-amber-500/40 cursor-pointer shadow-sm transition-transform hover:scale-105"
                      title="Toque para ouvir a sílaba"
                    >
                      {syl.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Reading Example Sentence */}
              {currentCard.readingSentence && (
                <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 mt-3 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Frase para Praticar Leitura:
                    </span>
                    <button
                      type="button"
                      onClick={() => soundManager.speakPortuguese(currentCard.readingSentence!)}
                      className="text-[11px] font-bold text-indigo-300 hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ouvir Frase</span>
                    </button>
                  </div>
                  <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed italic">
                    &ldquo;{currentCard.readingSentence}&rdquo;
                  </p>
                </div>
              )}

              {/* Educational Fact / Curiosity */}
              {currentCard.curiosity && (
                <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-md">
                  💡 <strong className="text-slate-300">Curiosidade:</strong> {currentCard.curiosity}
                </p>
              )}

              {/* Pronunciation Sound Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => soundManager.speakPortuguese(currentCard.name)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Ouvir Normal 🔊</span>
                </button>

                <button
                  type="button"
                  onClick={() => soundManager.speakSlow(currentCard.name)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  title="Pronúncia pausada ideal para aprender a ler"
                >
                  <span>🐢</span>
                  <span>Ouvir Lento (Sílaba por Sílaba)</span>
                </button>

                {currentCard.syllables && (
                  <button
                    type="button"
                    onClick={() => soundManager.speakSyllables(currentCard.syllables!)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>🔤</span>
                    <span>Soletrar Sílabas</span>
                  </button>
                )}
              </div>
            </div>

            {/* Flashcard Navigation Controls */}
            <div className="w-full max-w-xl flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const prev = safeCurrentIndex > 0 ? safeCurrentIndex - 1 : currentDatabase.length - 1;
                  setCurrentIndex(prev);
                }}
                className="flex items-center space-x-1 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Palavra Anterior</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const rnd = Math.floor(Math.random() * currentDatabase.length);
                  setCurrentIndex(rnd);
                }}
                className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Palavra Aleatória"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = (safeCurrentIndex + 1) % currentDatabase.length;
                  setCurrentIndex(next);
                }}
                className="flex items-center space-x-1 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition-colors cursor-pointer"
              >
                <span>Próxima Palavra</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MURAL DE LEITURA (TODAS AS PALAVRAS EM LISTA) */}
        {activeTab === 'dictionary' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Search & Play All Toolbar */}
            <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar palavra por nome ou sílaba..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Play All Sequence Button */}
              <button
                type="button"
                onClick={handlePlayAll}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer shrink-0 ${
                  isPlayingAll
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
                }`}
              >
                {isPlayingAll ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Parar Leitura Guiada</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>▶️ Ouvir Todos em Sequência ({filteredItems.length})</span>
                  </>
                )}
              </button>
            </div>

            {/* Words Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map((item, idx) => {
                const isPlaying = currentPlayingIndex === idx;
                const isStudied = studiedWords[item.pairId];
                return (
                  <div
                    key={item.pairId}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                      isPlaying
                        ? 'bg-indigo-950 border-indigo-400 ring-2 ring-indigo-500/50 scale-[1.01]'
                        : 'bg-slate-950/80 border-slate-800/80 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 min-w-0">
                        <div className="text-3xl shrink-0 filter drop-shadow">
                          {item.emoji || '⭐'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span className="font-black text-base text-white">
                              {item.name}
                            </span>
                            {item.syllables && (
                              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded">
                                {item.syllables}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                              {item.category}
                            </span>
                          </div>

                          {item.readingSentence && (
                            <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
                              &ldquo;{item.readingSentence}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Sound & Study Check Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => soundManager.speakPortuguese(item.name)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                          title={`Ouvir pronúncia de ${item.name}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => soundManager.speakSlow(item.name)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                          title={`Ouvir pronúncia lenta de ${item.name}`}
                        >
                          <span className="text-xs">🐢</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWordStudied(item.pairId)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            isStudied
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                          title="Marcar como estudada"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TREINO DE LEITURA (QUIZ / DESAFIO DO LEITOR) */}
        {activeTab === 'quiz' && currentDatabase.length > 0 && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-between gap-4">
            <div className="w-full max-w-lg flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold flex items-center gap-1.5 text-indigo-400">
                <Award className="w-4 h-4" />
                Desafio do Leitor • Questão {quizCurrentIndex + 1}
              </span>
              <span className="font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                ⭐ {quizScore} Pontos
              </span>
            </div>

            {/* Quiz Target Card */}
            {(() => {
              const target = currentDatabase[quizCurrentIndex % currentDatabase.length];
              return (
                <div className="w-full max-w-lg bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl">
                  <div className="text-6xl sm:text-7xl mb-3 filter drop-shadow">
                    {target.emoji || '⭐'}
                  </div>

                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
                    Leia as opções abaixo e escolha a palavra certa:
                  </p>
                  <p className="text-base sm:text-lg font-black text-white">
                    Qual é o nome correto desta imagem?
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-5">
                    {quizOptions.map((opt) => {
                      const isTarget = opt === target.name;
                      const isSelected = opt === quizSelectedOption;

                      let btnStyle =
                        'bg-slate-950 border-slate-800 hover:border-indigo-500/70 hover:bg-slate-900 text-slate-100';

                      if (quizFeedback !== null) {
                        if (isTarget) {
                          btnStyle =
                            'bg-emerald-600/90 border-emerald-400 text-white ring-2 ring-emerald-500/60 font-black';
                        } else if (isSelected) {
                          btnStyle =
                            'bg-rose-600/90 border-rose-400 text-white ring-2 ring-rose-500/60';
                        } else {
                          btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleQuizAnswer(opt)}
                          className={`p-3.5 rounded-2xl border text-sm sm:text-base font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-2 ${btnStyle}`}
                        >
                          <span>{opt.toUpperCase()}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Audio Clue Button */}
                  <button
                    type="button"
                    onClick={() => soundManager.speakPortuguese(target.name)}
                    className="mt-5 text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ouvir dica de som 🔊</span>
                  </button>
                </div>
              );
            })()}

            {/* Next Quiz button */}
            <div className="w-full max-w-lg flex items-center justify-between text-xs text-slate-500">
              <span>Leia em voz alta cada palavra antes de clicar!</span>
              <button
                type="button"
                onClick={() => setQuizCurrentIndex((prev) => prev + 1)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Pular Questão →
              </button>
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>{currentDatabase.length} palavras com divisão de sílabas e frases de estudo</span>
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
