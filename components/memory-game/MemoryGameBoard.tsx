'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CardState, GameTheme, generateDeck } from '@/lib/game-data';
import { soundManager } from '@/lib/sound';
import { Card } from '@/components/memory-game/Card';
import { GameHeader } from '@/components/memory-game/GameHeader';
import { GameSettingsBar } from '@/components/memory-game/GameSettingsBar';
import { VictoryModal } from '@/components/memory-game/VictoryModal';
import { GamesHubHeader } from '@/components/games-hub/GamesHubHeader';
import { GamesSelectorCards, ActiveGameType } from '@/components/games-hub/GamesSelectorCards';
import { MarioPlatformer } from '@/components/mario-game/MarioPlatformer';
import { TarzanGame } from '@/components/tarzan-game/TarzanGame';
import { DuoEnglishMemoryGame } from '@/components/duo-english/DuoEnglishMemoryGame';
import { WordsSoundModal } from '@/components/memory-game/WordsSoundModal';
import { StudyReadingModal } from '@/components/memory-game/StudyReadingModal';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';

export default function MemoryGameBoard() {
  const [activeGame, setActiveGame] = useState<ActiveGameType>('memory-animals');
  const [theme, setTheme] = useState<GameTheme>('animals_house');
  const [pairCount, setPairCount] = useState<number>(32);
  const [cards, setCards] = useState<CardState[]>(() => generateDeck(32, 'animals_house'));
  const [flippedCards, setFlippedCards] = useState<CardState[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [showWordsOnBoard, setShowWordsOnBoard] = useState<boolean>(false);
  const [isWordsSoundModalOpen, setIsWordsSoundModalOpen] = useState<boolean>(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState<boolean>(false);
  const [textCase, setTextCase] = useState<'uppercase' | 'normal'>('uppercase');
  const [showSyllables, setShowSyllables] = useState<boolean>(true);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [hintsRemaining, setHintsRemaining] = useState<number>(2);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arena_sound_muted') === 'true';
    }
    return false;
  });
  const [density, setDensity] = useState<'compact' | 'standard' | 'cozy'>('standard');
  const [hideMatched, setHideMatched] = useState<boolean>(false);

  // Stored records for all games
  const [animalsRecord, setAnimalsRecord] = useState<{ time: number | null; moves: number | null }>(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('arena_best_time_animals_32');
      const m = localStorage.getItem('arena_best_moves_animals_32');
      return { time: t ? Number(t) : null, moves: m ? Number(m) : null };
    }
    return { time: null, moves: null };
  });

  const [classicRecord, setClassicRecord] = useState<{ time: number | null; moves: number | null }>(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('arena_best_time_classic_32');
      const m = localStorage.getItem('arena_best_moves_classic_32');
      return { time: t ? Number(t) : null, moves: m ? Number(m) : null };
    }
    return { time: null, moves: null };
  });

  const [marioRecord, setMarioRecord] = useState<{ time: number | null; moves: number | null }>(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('arena_best_time_mario_32');
      const m = localStorage.getItem('arena_best_moves_mario_32');
      return { time: t ? Number(t) : null, moves: m ? Number(m) : null };
    }
    return { time: null, moves: null };
  });

  const [marioHighScore, setMarioHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_mario_highscore');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  const [tarzanHighScore, setTarzanHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_tarzan_highscore');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  const [duoXp, setDuoXp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_duo_xp');
      return saved ? Number(saved) : 100;
    }
    return 100;
  });

  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active game best record for memory modes
  const currentRecord =
    theme === 'animals' ? animalsRecord : theme === 'classic' ? classicRecord : marioRecord;

  // Initialize memory game
  const initGame = useCallback((count: number = pairCount, activeTheme: GameTheme = theme) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newDeck = generateDeck(count, activeTheme);
    setCards(newDeck);
    setFlippedCards([]);
    setIsProcessing(false);
    setMoves(0);
    setMatchedPairs(0);
    setSeconds(0);
    setHasStarted(false);
    setIsPaused(false);
    setIsVictory(false);
    setCombo(1);
    setMaxCombo(1);
    setHintsRemaining(2);
    setIsNewRecord(false);
  }, [pairCount, theme]);

  // Timer loop for memory game
  useEffect(() => {
    if (
      activeGame !== 'mario-platformer' &&
      activeGame !== 'tarzan-game' &&
      activeGame !== 'duo-english' &&
      hasStarted &&
      !isPaused &&
      !isVictory
    ) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeGame, hasStarted, isPaused, isVictory]);

  // Card click handler for memory game
  const handleCardClick = (clickedCard: CardState) => {
    if (isProcessing || isPaused || isVictory) return;
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    if (!hasStarted) {
      setHasStarted(true);
    }

    soundManager.playFlip();
    soundManager.speakPortuguese(clickedCard.name);

    const updatedCards = cards.map((c) =>
      c.instanceId === clickedCard.instanceId ? { ...c, isFlipped: true, isWrong: false } : c
    );
    setCards(updatedCards);

    const nextFlipped = [...flippedCards, { ...clickedCard, isFlipped: true }];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length === 2) {
      setIsProcessing(true);
      setMoves((prev) => prev + 1);

      const [first, second] = nextFlipped;

      if (first.pairId === second.pairId) {
        // MATCH!
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > maxCombo) {
          setMaxCombo(nextCombo);
        }
        soundManager.playMatch(nextCombo);
        setTimeout(() => {
          soundManager.speakPortuguese(`${first.name}! Acertou!`);
        }, 200);

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
        }, 350);
      } else {
        // MISMATCH!
        setCombo(1);
        soundManager.playMismatch();

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
        }, 950);
      }
    }
  };

  // Victory celebration & High score check for memory game
  const handleVictory = () => {
    setIsVictory(true);
    if (timerRef.current) clearInterval(timerRef.current);
    soundManager.playVictory();

    try {
      const prevBest = currentRecord.time;
      const prevMoves = currentRecord.moves;
      const isBetter =
        prevBest === null ||
        seconds < prevBest ||
        (seconds === prevBest && (prevMoves === null || moves < prevMoves));

      if (isBetter) {
        setIsNewRecord(true);
        if (theme === 'animals') {
          setAnimalsRecord({ time: seconds, moves });
        } else if (theme === 'classic') {
          setClassicRecord({ time: seconds, moves });
        } else {
          setMarioRecord({ time: seconds, moves });
        }
        localStorage.setItem(`arena_best_time_${theme}_${pairCount}`, String(seconds));
        localStorage.setItem(`arena_best_moves_${theme}_${pairCount}`, String(moves));
      }
    } catch {
      // Ignore storage errors
    }
  };

  // Tactical Hint: Peek at non-matched cards for 1 second
  const handleUseHint = () => {
    if (hintsRemaining <= 0 || isProcessing || isPaused || isVictory) return;
    setHintsRemaining((prev) => prev - 1);
    soundManager.playHint();

    setCards((prev) =>
      prev.map((c) => (!c.isMatched ? { ...c, isPeeked: true } : c))
    );

    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => ({ ...c, isPeeked: false }))
      );
    }, 1100);
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleModeChange = (newCount: number) => {
    setPairCount(newCount);
    initGame(newCount, theme);
  };

  const handleThemeChange = (newTheme: GameTheme) => {
    setTheme(newTheme);
    if (newTheme === 'animals' || newTheme === 'animals_house' || newTheme === 'household') {
      setActiveGame('memory-animals');
    } else if (newTheme === 'classic') {
      setActiveGame('memory-classic');
    } else if (newTheme === 'mario') {
      setActiveGame('memory-mario');
    }
    initGame(pairCount, newTheme);
  };

  const handleSelectGame = (game: ActiveGameType) => {
    setActiveGame(game);
    if (game === 'memory-animals') {
      setTheme('animals_house');
      initGame(pairCount, 'animals_house');
    } else if (game === 'memory-classic') {
      setTheme('classic');
      initGame(pairCount, 'classic');
    } else if (game === 'memory-mario') {
      setTheme('mario');
      initGame(pairCount, 'mario');
    }
  };

  // Determine grid columns dynamically based on pair count
  const getGridColsClass = () => {
    if (pairCount === 32) {
      return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8';
    }
    if (pairCount === 20) {
      return 'grid-cols-4 sm:grid-cols-5 md:grid-cols-8';
    }
    return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-6';
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col bg-slate-950 transition-colors duration-500">
      {/* Interactive Portal Header with Navigation between all games */}
      <GamesHubHeader
        activeGame={activeGame}
        onSelectGame={handleSelectGame}
        bestTime={currentRecord.time}
        bestMoves={currentRecord.moves}
        marioHighScore={marioHighScore}
        tarzanHighScore={tarzanHighScore}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4">
        {/* Prominent Games Catalog Selector: All Games Present & Preserved */}
        <GamesSelectorCards
          activeGame={activeGame}
          onSelectGame={handleSelectGame}
          animalsRecord={animalsRecord}
          classicRecord={classicRecord}
          marioRecord={marioRecord}
          marioHighScore={marioHighScore}
          tarzanHighScore={tarzanHighScore}
          duoXp={duoXp}
        />

        {/* --- VIEW: DUO INGLÊS (NOVO! JOGO DA MEMÓRIA DUOLINGO) --- */}
        {activeGame === 'duo-english' && (
          <div className="w-full flex flex-col items-center">
            <DuoEnglishMemoryGame />
          </div>
        )}

        {/* --- VIEW 0: TARZAN NA FLORESTA --- */}
        {activeGame === 'tarzan-game' && (
          <div className="w-full flex flex-col items-center">
            <TarzanGame />
          </div>
        )}

        {/* --- VIEW 1: SUPER MARIO 2D PLATFORMER ADVENTURE --- */}
        {activeGame === 'mario-platformer' && (
          <div className="w-full flex flex-col items-center">
            <MarioPlatformer />
          </div>
        )}

        {/* --- VIEW 2: JOGO DA MEMÓRIA CLÁSSICO (Reino Animal, Arcade & Mario) --- */}
        {activeGame !== 'mario-platformer' &&
          activeGame !== 'tarzan-game' &&
          activeGame !== 'duo-english' && (
          <>
            {/* Game Stats & Action Header */}
            <GameHeader
              seconds={seconds}
              moves={moves}
              matchedPairs={matchedPairs}
              totalPairs={pairCount}
              combo={combo}
              isPaused={isPaused}
              hintsRemaining={hintsRemaining}
              isMuted={isMuted}
              onTogglePause={handleTogglePause}
              onRestart={() => initGame(pairCount, theme)}
              onUseHint={handleUseHint}
              onToggleSound={handleToggleSound}
            />

            {/* Game Settings, Theme & Density Bar */}
            <GameSettingsBar
              density={density}
              onDensityChange={setDensity}
              pairCount={pairCount}
              onPairCountChange={handleModeChange}
              theme={theme}
              onThemeChange={handleThemeChange}
              hideMatched={hideMatched}
              onToggleHideMatched={() => setHideMatched((prev) => !prev)}
              onOpenWordsSoundModal={() => setIsWordsSoundModalOpen(true)}
              onOpenStudyModal={() => setIsStudyModalOpen(true)}
              showWordsOnBoard={showWordsOnBoard}
              onToggleShowWords={() => setShowWordsOnBoard((prev) => !prev)}
              textCase={textCase}
              onToggleTextCase={() => setTextCase((prev) => (prev === 'uppercase' ? 'normal' : 'uppercase'))}
              showSyllables={showSyllables}
              onToggleSyllables={() => setShowSyllables((prev) => !prev)}
            />

            {/* Board Arena */}
            <div className="relative flex-1 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-3 sm:p-5 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-center">
              {/* Background glow matching active theme */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
                  theme === 'animals' || theme === 'animals_house'
                    ? 'bg-emerald-600/10'
                    : theme === 'mario'
                    ? 'bg-red-600/10'
                    : 'bg-indigo-600/10'
                }`}
              />

              {/* Preview mode alert banner */}
              {showWordsOnBoard && (
                <div className="w-full bg-amber-500/15 border border-amber-500/40 rounded-2xl px-4 py-2.5 mb-3 flex items-center justify-between text-xs text-amber-200 shadow-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">👁️</span>
                    <span>
                      <strong>Modo Visualizar Palavras & Som Ativo:</strong> Todas as cartas e pronúncias de som estão visíveis! Toque em qualquer carta para ouvir.
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
                className={`grid ${getGridColsClass()} gap-2 sm:gap-2.5 md:gap-3 w-full max-w-6xl mx-auto transition-opacity duration-300 ${
                  isPaused ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'
                }`}
                id="cards-grid"
              >
                {cards.map((card) => {
                  const shouldFade = hideMatched && card.isMatched;
                  return (
                    <div
                      key={card.instanceId}
                      className={`transition-opacity duration-300 ${
                        shouldFade ? 'opacity-15 pointer-events-none' : 'opacity-100'
                      }`}
                    >
                      <Card
                        card={card}
                        onClick={handleCardClick}
                        disabled={isProcessing || isPaused || isVictory}
                        density={density}
                        theme={theme}
                        isRevealedOverride={showWordsOnBoard}
                        textCase={textCase}
                        showSyllables={showSyllables}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Pause Screen Overlay */}
              {isPaused && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-1">Jogo Pausado</h3>
                    <p className="text-xs text-slate-400 mb-5">
                      O cronômetro está parado. Clique abaixo para retomar o desafio.
                    </p>
                    <button
                      onClick={handleTogglePause}
                      className={`w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-colors ${
                        theme === 'animals'
                          ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                          : theme === 'mario'
                          ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                      }`}
                      id="btn-resume-modal"
                    >
                      Retomar Jogo
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer info & interactive portal status */}
        <footer className="w-full text-center py-2 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900 pt-3">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                activeGame === 'duo-english'
                  ? 'bg-lime-400 animate-pulse'
                  : activeGame === 'tarzan-game'
                  ? 'bg-emerald-400'
                  : activeGame === 'mario-platformer'
                  ? 'bg-red-500'
                  : theme === 'animals'
                  ? 'bg-emerald-500'
                  : 'bg-indigo-500'
              }`}
            />
            <span>
              {activeGame === 'duo-english'
                ? 'Duo Inglês: Jogo da Memória com Vocabulário, Áudio Nativo e XP estilo Duolingo'
                : activeGame === 'tarzan-game'
                ? 'Tarzan na Floresta: Aventura de Cipós, Crocodilos e Templo Perdido'
                : activeGame === 'mario-platformer'
                ? 'Super Mario Bros: Aventura de Plataforma 2D'
                : theme === 'animals'
                ? `Jogo da Memória: Reino Animal (${pairCount} Pares - ${pairCount * 2} Cartas)`
                : theme === 'mario'
                ? `Jogo da Memória: Super Mario (${pairCount} Pares - ${pairCount * 2} Cartas)`
                : `Jogo da Memória: Aventura & Arcade (${pairCount} Pares - ${pairCount * 2} Cartas)`}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span>Jogos Interativos Preservados</span>
            <span>•</span>
            <span>Áudio Sintetizado 8-bit</span>
            <span>•</span>
            <span>Recordes Salvos</span>
          </div>
        </footer>
      </main>

      {/* Victory Celebration Modal for Memory Game */}
      <VictoryModal
        isOpen={isVictory}
        seconds={seconds}
        moves={moves}
        totalPairs={pairCount}
        maxCombo={maxCombo}
        isNewRecord={isNewRecord}
        onPlayAgain={() => initGame(pairCount, theme)}
      />

      {/* Words and Sound Visualizer Modal */}
      <WordsSoundModal
        isOpen={isWordsSoundModalOpen}
        onClose={() => setIsWordsSoundModalOpen(false)}
        theme={theme}
      />

      {/* Complete Reading & Study Center Modal */}
      <StudyReadingModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        theme={theme}
      />
    </div>
  );
}
