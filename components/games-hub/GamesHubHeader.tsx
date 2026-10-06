'use client';

import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  HelpCircle,
  X,
  CheckCircle2,
  Grid
} from 'lucide-react';
import { ActiveGameType } from '@/components/games-hub/GamesSelectorCards';

interface GamesHubHeaderProps {
  activeGame: ActiveGameType;
  onSelectGame: (game: ActiveGameType) => void;
  bestTime: number | null;
  bestMoves: number | null;
  marioHighScore: number;
  tarzanHighScore: number;
}

export const GamesHubHeader: React.FC<GamesHubHeaderProps> = ({
  activeGame,
  onSelectGame,
  bestTime,
  bestMoves,
  marioHighScore,
  tarzanHighScore,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <>
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
            {/* Brand / Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-amber-500 to-red-500 p-0.5 shadow-md shadow-emerald-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                      ARENA JOGOS
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Jogos Interativos
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Help Button */}
              <button
                onClick={() => setShowHowToPlay(true)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
                id="btn-help-mobile"
                aria-label="Como jogar"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Games Navigation Bar: Fast Switcher Between All Games */}
            <div className="flex items-center justify-between sm:justify-start gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
                {/* Game: Duo Inglês (NOVO!) */}
                <button
                  onClick={() => onSelectGame('duo-english')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeGame === 'duo-english'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  id="tab-game-duo"
                >
                  <span className="text-sm">🦉</span>
                  <span>Duo Inglês</span>
                  {activeGame === 'duo-english' ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                  ) : (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1 rounded">
                      NOVO
                    </span>
                  )}
                </button>

                {/* Game 0: Tarzan na Floresta */}
                <button
                  onClick={() => onSelectGame('tarzan-game')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeGame === 'tarzan-game'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  id="tab-game-tarzan"
                >
                  <span className="text-sm">🌴</span>
                  <span>Tarzan na Floresta</span>
                  {activeGame === 'tarzan-game' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                  )}
                </button>

                {/* Game 1: Super Mario Platformer */}
                <button
                  onClick={() => onSelectGame('mario-platformer')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeGame === 'mario-platformer'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  id="tab-game-mario"
                >
                  <span className="text-sm">🍄</span>
                  <span>Super Mario Bros</span>
                  {activeGame === 'mario-platformer' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-200 animate-pulse" />
                  )}
                </button>

                {/* Game 2: Reino Animal */}
                <button
                  onClick={() => onSelectGame('memory-animals')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeGame === 'memory-animals'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  id="tab-game-animals"
                >
                  <span className="text-sm">🦁</span>
                  <span>Reino Animal (32P)</span>
                  {activeGame === 'memory-animals' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                  )}
                </button>

                {/* Game 3: Aventura & Arcade */}
                <button
                  onClick={() => onSelectGame('memory-classic')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeGame === 'memory-classic'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  id="tab-game-classic"
                >
                  <span className="text-sm">💎</span>
                  <span>Aventura & Arcade (32P)</span>
                  {activeGame === 'memory-classic' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-pulse" />
                  )}
                </button>
              </div>

              {/* Best Record display */}
              {activeGame === 'tarzan-game' ? (
                tarzanHighScore > 0 && (
                  <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium whitespace-nowrap">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Recorde Tarzan: {tarzanHighScore} pts</span>
                  </div>
                )
              ) : activeGame === 'mario-platformer' ? (
                marioHighScore > 0 && (
                  <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium whitespace-nowrap">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Recorde Mario: {marioHighScore} pts</span>
                  </div>
                )
              ) : (
                bestTime !== null && bestMoves !== null && (
                  <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium whitespace-nowrap">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Recorde: {formatTime(bestTime)} ({bestMoves} movs)
                    </span>
                  </div>
                )
              )}

              {/* Help button desktop */}
              <button
                onClick={() => setShowHowToPlay(true)}
                className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
                id="btn-help-desktop"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Instruções</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 text-lg">
                  🎮
                </div>
                <h3 className="font-bold text-lg text-slate-100">
                  Como Jogar na Arena Jogos
                </h3>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                id="btn-close-help"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm text-slate-300">
              {/* Duo English instructions */}
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-emerald-500/40">
                <div className="text-xl shrink-0">🦉</div>
                <div>
                  <h4 className="font-semibold text-emerald-300 text-xs uppercase tracking-wider mb-0.5">
                    Duo Inglês (Memória com Áudio e Vocabulário)
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Associe palavras em inglês com sua tradução em português. Ao virar a carta, ouça a <strong className="text-slate-200">pronúncia nativa em inglês</strong> com voz real! Ganhe <strong className="text-yellow-400">XP</strong>, mantenha seu <strong className="text-amber-400">Streak 🔥</strong> de acertos e consulte o Dicionário completo.
                  </p>
                </div>
              </div>

              {/* Tarzan instructions */}
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-emerald-900/60">
                <div className="text-xl shrink-0">🌴</div>
                <div>
                  <h4 className="font-semibold text-emerald-300 text-xs uppercase tracking-wider mb-0.5">
                    Tarzan na Floresta (Aventura de Cipós)
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Balance em cipós pelo ar, aperte <strong className="text-slate-200">Espaço/W</strong> no ponto alto para se lançar sobre desfiladeiros e rios com crocodilos. Use <strong className="text-amber-300">X</strong> para atirar cocos contra onças e <strong className="text-emerald-300">Z</strong> para soltar o Grito da Selva!
                  </p>
                </div>
              </div>

              {/* Mario instructions */}
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xl shrink-0">🍄</div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-xs uppercase tracking-wider mb-0.5">
                    Super Mario Bros (Plataforma 2D)
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Controles: Setas / <strong className="text-slate-200">A & D</strong> para mover, <strong className="text-slate-200">Barra de Espaço / W</strong> para pular (ou botões táteis no celular). Pule nos blocos <strong className="text-amber-300">[?]</strong> para moedas, esmague Goombas por cima e alcance a bandeira final!
                  </p>
                </div>
              </div>

              {/* Memory Animals */}
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xl shrink-0">🦁</div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-xs uppercase tracking-wider mb-0.5">
                    Jogo da Memória: Reino Animal (32 Pares)
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Encontre os 32 pares de animais selvagens (Leão, Elefante, Urso Panda, Golfinho, Águia). Acertos seguidos geram combos de pontuação!
                  </p>
                </div>
              </div>

              {/* Memory Classic */}
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xl shrink-0">💎</div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-xs uppercase tracking-wider mb-0.5">
                    Jogo da Memória: Aventura & Arcade (32 Pares)
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Coroas reais, diamantes míticos, espadas lendárias e foguetes espaciais em até 64 cartas épicas com recordes próprios.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-red-600/25"
                id="btn-understand-help"
              >
                Entendi, vamos jogar!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
