'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DuoCategory,
  DuoMemoryCard,
  DUO_CATEGORIES_META,
  generateDuoDeck,
  DUO_MASCOT_QUOTES,
} from '@/lib/duo-english-data';
import { soundManager } from '@/lib/sound';
import { DuoOwlMascot, DuoMood } from '@/components/duo-english/DuoOwlMascot';
import { DuoCard } from '@/components/duo-english/DuoCard';
import { DuoStatsBar } from '@/components/duo-english/DuoStatsBar';
import { DuoDictionaryModal } from '@/components/duo-english/DuoDictionaryModal';
import { DuoVictoryModal } from '@/components/duo-english/DuoVictoryModal';
import { Volume2, Sparkles, BookOpen, Layers, Award, Play, Eye, EyeOff } from 'lucide-react';

export const DuoEnglishMemoryGame: React.FC = () => {
  // Category & Difficulty (Defaulting to 32 pairs: Animals & Household Objects)
  const [category, setCategory] = useState<DuoCategory>('animals_home');
  const [pairCount, setPairCount] = useState<number>(32); // 32, 16, 12, 8

  // Game Board State
  const [cards, setCards] = useState<DuoMemoryCard[]>(() => generateDuoDeck(32, 'animals_home'));
  const [flippedCards, setFlippedCards] = useState<DuoMemoryCard[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [showWordsOnBoard, setShowWordsOnBoard] = useState<boolean>(false);

  // Duolingo Gamification Stats
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(5);
  const maxHearts = 5;
  const [hintsRemaining, setHintsRemaining] = useState<number>(2);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arena_sound_muted') === 'true';
    }
    return false;
  });

  // Persistent XP and Gems
  const [xp, setXp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_duo_xp');
      return saved ? Number(saved) : 100;
    }
    return 100;
  });

  const [gems, setGems] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_duo_gems');
      return saved ? Number(saved) : 25;
    }
    return 25;
  });

  // Mascot dynamic state
  const [mascotMood, setMascotMood] = useState<DuoMood>('idle');
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Desafio 32 Pares: Animais & Objetos de Casa! Encontre os pares em inglês e português!'
  );
  const [mascotSub, setMascotSub] = useState<string>(
    'Toque na carta para ouvir a pronúncia nativa em inglês!'
  );

  // Floating XP indicator animation
  const [floatingXp, setFloatingXp] = useState<{ id: number; text: string } | null>(null);

  // Modals
  const [isDictionaryOpen, setIsDictionaryOpen] = useState<boolean>(false);

  // Counters and Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const xpCounterRef = useRef<number>(0);
  const quoteIndexRef = useRef<number>(0);

  // Initialize/Reset game
  const initGame = useCallback(
    (count: number = pairCount, cat: DuoCategory = category) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const newDeck = generateDuoDeck(count, cat);
      setCards(newDeck);
      setFlippedCards([]);
      setIsProcessing(false);
      setMoves(0);
      setMatchedPairs(0);
      setSeconds(0);
      setHasStarted(false);
      setIsPaused(false);
      setIsVictory(false);
      setStreak(0);
      setMaxStreak(0);
      setHearts(5);
      setHintsRemaining(2);
      setMascotMood('idle');
      if (cat === 'animals_home') {
        setMascotSpeech(`Desafio ${count} Pares: Animais & Objetos de Casa!`);
        setMascotSub('Ouça a pronúncia nativa e associe com a imagem!');
      } else if (cat === 'animals') {
        setMascotSpeech(`Reino Animal (${count} Pares): Pronuncie em voz alta!`);
        setMascotSub('Ouça o som de cada animal em inglês.');
      } else if (cat === 'home') {
        setMascotSpeech(`Objetos da Casa (${count} Pares): Memorize os nomes!`);
        setMascotSub('Cada objeto do lar tem áudio de pronúncia nativo.');
      } else {
        setMascotSpeech('Novo desafio de vocabulário pronto! Boa sorte!');
        setMascotSub('Toque nas cartas para ouvir e memorizar.');
      }
    },
    [pairCount, category]
  );

  // Timer loop
  useEffect(() => {
    if (hasStarted && !isPaused && !isVictory) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, isPaused, isVictory]);

  // Card click handler
  const handleCardClick = (clickedCard: DuoMemoryCard) => {
    if (isProcessing || isPaused || isVictory) return;
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    if (!hasStarted) {
      setHasStarted(true);
    }

    soundManager.playFlip();

    // Pronounce sound immediately on tap
    if (clickedCard.type === 'english') {
      soundManager.speakEnglish(clickedCard.title, speechRate);
    } else {
      const enPartner = cards.find((c) => c.pairId === clickedCard.pairId && c.type === 'english');
      if (enPartner) {
        soundManager.speakEnglish(enPartner.title, speechRate);
      } else {
        soundManager.speakPortuguese(clickedCard.title);
      }
    }

    // Flip card
    const updatedCards = cards.map((c) =>
      c.instanceId === clickedCard.instanceId ? { ...c, isFlipped: true, isWrong: false } : c
    );
    setCards(updatedCards);

    const nextFlipped = [...flippedCards, { ...clickedCard, isFlipped: true }];
    setFlippedCards(nextFlipped);

    // If 2 cards flipped, check pair
    if (nextFlipped.length === 2) {
      setIsProcessing(true);
      setMoves((prev) => prev + 1);

      const [first, second] = nextFlipped;

      if (first.pairId === second.pairId) {
        // MATCH!
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        if (nextStreak > maxStreak) setMaxStreak(nextStreak);

        // Calculate XP gain (15 base + streak bonus)
        const xpGain = 15 + nextStreak * 5;
        const newXp = xp + xpGain;
        setXp(newXp);
        localStorage.setItem('arena_duo_xp', String(newXp));

        // Floating XP feedback
        xpCounterRef.current += 1;
        setFloatingXp({ id: xpCounterRef.current, text: `+${xpGain} XP` });
        setTimeout(() => setFloatingXp(null), 1200);

        soundManager.playDuoCorrect();

        // Speak the English word again with phrase for retention
        const englishItem = first.type === 'english' ? first : second;
        soundManager.speakEnglish(englishItem.title, speechRate);

        // Mascot feedback
        setMascotMood(nextStreak >= 3 ? 'celebrating' : 'happy');
        quoteIndexRef.current = (quoteIndexRef.current + 1) % DUO_MASCOT_QUOTES.length;
        const quote = DUO_MASCOT_QUOTES[quoteIndexRef.current];
        setMascotSpeech(`${quote.en} ("${englishItem.title}" = "${first.type === 'portuguese' ? first.title : second.title}")`);
        setMascotSub(quote.pt);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);

          const newMatched = matchedPairs + 1;
          setMatchedPairs(newMatched);

          if (newMatched === pairCount) {
            handleVictory();
          }
        }, 400);
      } else {
        // MISMATCH!
        setStreak(0);
        soundManager.playDuoWrong();
        setMascotMood('wrong');
        setMascotSpeech('Oops! Não foi dessa vez, tente novamente!');
        setMascotSub('Dica: Memorize as posições para combinar depois.');

        // Reduce hearts if not in free practice
        setHearts((prev) => Math.max(0, prev - 1));

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.instanceId === first.instanceId || c.instanceId === second.instanceId
                ? { ...c, isWrong: true }
                : c
            )
          );
        }, 300);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.instanceId === first.instanceId || c.instanceId === second.instanceId
                ? { ...c, isFlipped: false, isWrong: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
          setMascotMood('idle');
        }, 950);
      }
    }
  };

  // Victory Handler
  const handleVictory = () => {
    setIsVictory(true);
    if (timerRef.current) clearInterval(timerRef.current);

    soundManager.playDuoLevelComplete();
    soundManager.playDuoGem();

    // Bonus XP and Gems
    const bonusXp = 50;
    const bonusGems = 5;
    const finalXp = xp + bonusXp;
    const finalGems = gems + bonusGems;

    setXp(finalXp);
    setGems(finalGems);
    localStorage.setItem('arena_duo_xp', String(finalXp));
    localStorage.setItem('arena_duo_gems', String(finalGems));

    setMascotMood('victory');
    setMascotSpeech('Incrível! Você concluiu a lição de vocabulário!');
    setMascotSub('Ganhou +50 XP bônus e 5 Lingots 💎!');
  };

  // Audio helper
  const handleSpeak = (text: string) => {
    soundManager.speakEnglish(text, speechRate);
  };

  // Toggle audio speech speed (Normal 0.95 vs Turtle 0.7)
  const handleToggleSpeechRate = () => {
    setSpeechRate((prev) => (prev < 0.9 ? 0.95 : 0.7));
  };

  // Mute audio
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Tactical Hint: Peeks non-matched cards for 1.2s
  const handleUseHint = () => {
    if (hintsRemaining <= 0 || isProcessing || isPaused || isVictory) return;
    setHintsRemaining((prev) => prev - 1);
    soundManager.playHint();
    setMascotSpeech('Dica do Duo: Olhe com atenção as cartas!');

    setCards((prev) =>
      prev.map((c) => (!c.isMatched ? { ...c, isPeeked: true } : c))
    );

    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => ({ ...c, isPeeked: false }))
      );
    }, 1200);
  };

  // Change Category
  const handleCategorySelect = (newCat: DuoCategory) => {
    setCategory(newCat);
    initGame(pairCount, newCat);
  };

  // Change Pair Count
  const handlePairCountChange = (newCount: number) => {
    setPairCount(newCount);
    initGame(newCount, category);
  };

  // Dynamic grid cols based on pair count
  const getGridCols = () => {
    if (pairCount === 32) {
      return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8';
    }
    if (pairCount === 16) {
      return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8';
    }
    if (pairCount === 12) {
      return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-6';
    }
    return 'grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4';
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* DUOLINGO HERO BANNER & MASCOT DIALOG */}
      <div className="w-full bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-2 border-emerald-500/50 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Animated Duo Owl Mascot with Dynamic Speech Bubble */}
          <div className="flex-1">
            <DuoOwlMascot
              mood={mascotMood}
              speechText={mascotSpeech}
              subText={mascotSub}
              streakCount={streak}
              onTapOwl={() => {
                quoteIndexRef.current = (quoteIndexRef.current + 1) % DUO_MASCOT_QUOTES.length;
                const quote = DUO_MASCOT_QUOTES[quoteIndexRef.current];
                setMascotSpeech(quote.en);
                setMascotSub(quote.pt);
                soundManager.speakEnglish(quote.en, speechRate);
              }}
            />
          </div>

          {/* Quick study & listening badge */}
          <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
            <button
              type="button"
              onClick={() => {
                const nextState = !showWordsOnBoard;
                setShowWordsOnBoard(nextState);
                if (nextState) {
                  soundManager.playHint();
                  setMascotMood('happy');
                  setMascotSpeech('Modo Visualizar Palavras & Som ativado! Toque em qualquer carta para ouvir a pronúncia!');
                  setMascotSub('Todas as palavras e sons estão revelados no tabuleiro para estudo.');
                } else {
                  setMascotSpeech('Modo Jogo da Memória! Encontre os pares escondidos!');
                  setMascotSub('Toque nas cartas para memorizar.');
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer ${
                showWordsOnBoard
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {showWordsOnBoard ? (
                <>
                  <EyeOff className="w-4 h-4 text-slate-950" />
                  <span>Ocultar Palavras</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>👁️ Ver Palavras no Tabuleiro</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsDictionaryOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Visualizar Palavras & Som 🔊</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATS BAR (Hearts, Streak, XP, Gems, Turtle rate, Hint) */}
      <DuoStatsBar
        xp={xp}
        streak={streak}
        gems={gems}
        hearts={hearts}
        maxHearts={maxHearts}
        speechRate={speechRate}
        isMuted={isMuted}
        hintsRemaining={hintsRemaining}
        matchedPairs={matchedPairs}
        totalPairs={pairCount}
        onToggleSpeechRate={handleToggleSpeechRate}
        onToggleMute={handleToggleMute}
        onUseHint={handleUseHint}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onRestartGame={() => initGame(pairCount, category)}
      />

      {/* CATEGORY & DIFFICULTY SELECTOR BAR */}
      <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Tema:
          </span>
          {DUO_CATEGORIES_META.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Difficulty (Number of Pairs) */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Tamanho:
          </span>
          {[
            { count: 32, label: '32 Pares (64 cartas) 🔥' },
            { count: 16, label: '16 Pares (32 cartas)' },
            { count: 12, label: '12 Pares (24 cartas)' },
            { count: 8, label: '8 Pares (16 cartas)' },
          ].map((mode) => (
            <button
              key={mode.count}
              type="button"
              onClick={() => handlePairCountChange(mode.count)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                pairCount === mode.count
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.count} Pares
            </button>
          ))}
        </div>
      </div>

      {/* GAME BOARD CONTAINER */}
      <div className="relative w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-3 sm:p-5 shadow-2xl overflow-hidden min-h-[440px] flex flex-col justify-center">
        {/* Floating XP Indicator */}
        <AnimatePresence>
          {floatingXp && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -40, scale: 1.2 }}
              exit={{ opacity: 0, y: -70 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-xl px-4 py-2 rounded-2xl shadow-xl border-2 border-yellow-200"
            >
              ⚡ {floatingXp.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Board Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Word Preview Mode Banner */}
        {showWordsOnBoard && (
          <div className="w-full bg-amber-500/15 border border-amber-500/40 rounded-2xl px-4 py-2.5 mb-3 flex items-center justify-between text-xs text-amber-200 shadow-md">
            <div className="flex items-center space-x-2">
              <span className="text-base">👁️</span>
              <span>
                <strong>Modo Visualizar Palavras & Som Ativo:</strong> Todas as cartas e pronúncias de som estão visíveis! Toque em qualquer carta para ouvir a pronúncia.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowWordsOnBoard(false)}
              className="text-[11px] font-bold text-amber-300 hover:text-white underline cursor-pointer shrink-0 ml-3"
            >
              Ocultar Cartas
            </button>
          </div>
        )}

        {/* Cards Grid */}
        <div
          className={`grid ${getGridCols()} gap-2 sm:gap-2.5 md:gap-3 w-full max-w-6xl mx-auto transition-opacity duration-300 ${
            isPaused ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'
          }`}
          id="duo-cards-grid"
        >
          {cards.map((card) => (
            <DuoCard
              key={card.instanceId}
              card={card}
              onClick={handleCardClick}
              onSpeak={handleSpeak}
              isProcessing={isProcessing}
              isPaused={isPaused}
              isCompact={pairCount >= 20}
              isRevealedOverride={showWordsOnBoard}
            />
          ))}
        </div>
      </div>

      {/* FOOTER TIP & LEARNING METHOD */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="text-base">💡</span>
          <span>
            <strong>Método Duolingo:</strong> Ao virar cada carta, repita a palavra em voz alta para memorizar a pronúncia!
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-500 shrink-0">
          <span>Áudio Nativo en-US</span>
          <span>•</span>
          <span>Vocabulário Básico e Intermediário</span>
        </div>
      </div>

      {/* Dictionary Modal */}
      <DuoDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        onSpeak={handleSpeak}
        currentCategory={category}
      />

      {/* Victory Celebration Modal */}
      <DuoVictoryModal
        isOpen={isVictory}
        xpEarned={50 + matchedPairs * 15}
        gemsEarned={5}
        maxStreak={maxStreak}
        totalMoves={moves}
        totalSeconds={seconds}
        totalPairs={pairCount}
        onPlayAgain={() => initGame(pairCount, category)}
        onOpenDictionary={() => {
          setIsVictory(false);
          setIsDictionaryOpen(true);
        }}
      />
    </div>
  );
};
