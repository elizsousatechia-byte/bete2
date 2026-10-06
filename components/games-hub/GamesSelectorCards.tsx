'use client';

import React from 'react';
import { Trophy, ArrowRight, CheckCircle2, Sparkles, Gamepad2 } from 'lucide-react';

export type ActiveGameType = 'duo-english' | 'tarzan-game' | 'mario-platformer' | 'memory-animals' | 'memory-classic' | 'memory-mario';

interface GamesSelectorCardsProps {
  activeGame: ActiveGameType;
  onSelectGame: (game: ActiveGameType) => void;
  animalsRecord: { time: number | null; moves: number | null };
  classicRecord: { time: number | null; moves: number | null };
  marioRecord: { time: number | null; moves: number | null };
  marioHighScore: number;
  tarzanHighScore: number;
  duoXp?: number;
}

export const GamesSelectorCards: React.FC<GamesSelectorCardsProps> = ({
  activeGame,
  onSelectGame,
  animalsRecord,
  classicRecord,
  marioRecord,
  marioHighScore,
  tarzanHighScore,
  duoXp = 100,
}) => {
  const formatTime = (secs: number | null) => {
    if (secs === null) return '--';
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Arena Jogos: Selecione seu Jogo
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Jogos Interativos & Idiomas
          </span>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Todos os jogos preservados e prontos para jogar
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {/* GAME: Duo Inglês (NOVO! Aprenda Inglês com Jogo da Memória) */}
        <div
          onClick={() => onSelectGame('duo-english')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectGame('duo-english');
          }}
          className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left overflow-hidden ${
            activeGame === 'duo-english'
              ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900/90'
          }`}
          id="select-game-duo-english"
        >
          {activeGame === 'duo-english' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          )}

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-lime-500 to-emerald-400 flex items-center justify-center text-2xl shadow-md shrink-0">
                🦉
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight">
                    Duo Inglês
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    32 Pares 🔥
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                  Memória estilo Duolingo: 32 pares com Animais e Objetos de Casa, pronúncia e XP!
                </p>
                <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-400">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>
                    Progresso:{' '}
                    <strong className="text-emerald-300">
                      {duoXp > 0 ? `${duoXp} XP` : 'Iniciante'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-0.5">
              {activeGame === 'duo-english' ? (
                <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold bg-emerald-500/20 px-2 py-1 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Jogando</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-xl transition-colors font-medium"
                >
                  <span>Jogar</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* GAME 0: Tarzan na Floresta (PRESERVADO) */}
        <div
          onClick={() => onSelectGame('tarzan-game')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectGame('tarzan-game');
          }}
          className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left overflow-hidden ${
            activeGame === 'tarzan-game'
              ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/80 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-emerald-700/60 hover:bg-slate-900/90'
          }`}
          id="select-game-tarzan"
        >
          {activeGame === 'tarzan-game' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          )}

          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center text-2xl shadow-md shrink-0">
                🌴
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight">
                    Tarzan na Floresta
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    Novo!
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-1">
                  Balance em cipós, atire cocos, dê o grito da selva e vença os crocodilos!
                </p>
                <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-400">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>
                    Recorde:{' '}
                    <strong className="text-slate-200">
                      {tarzanHighScore > 0 ? `${tarzanHighScore} pts` : '--'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-0.5">
              {activeGame === 'tarzan-game' ? (
                <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold bg-emerald-500/20 px-2 py-1 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Jogando</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-xl transition-colors font-medium"
                >
                  <span>Jogar</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* GAME 1: Super Mario Plataforma 2D */}
        <div
          onClick={() => onSelectGame('mario-platformer')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectGame('mario-platformer');
          }}
          className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left overflow-hidden ${
            activeGame === 'mario-platformer'
              ? 'bg-gradient-to-br from-red-950/70 via-slate-900 to-slate-950 border-red-500/80 shadow-lg shadow-red-500/20 ring-2 ring-red-500/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
          }`}
          id="select-game-mario-platformer"
        >
          {activeGame === 'mario-platformer' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/15 rounded-full blur-2xl pointer-events-none" />
          )}

          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-2xl shadow-md shrink-0">
                🍄
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight">
                    Super Mario Bros
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                    Plataforma 2D
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-1">
                  Corra, pule em blocos ?, pegue moedas, derrote Goombas e chegue à bandeira!
                </p>
                <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-400">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>
                    Recorde:{' '}
                    <strong className="text-slate-200">
                      {marioHighScore > 0 ? `${marioHighScore} pts` : '--'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-0.5">
              {activeGame === 'mario-platformer' ? (
                <div className="flex items-center space-x-1 text-red-400 text-xs font-bold bg-red-500/20 px-2 py-1 rounded-xl border border-red-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Jogando</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-xl transition-colors font-medium"
                >
                  <span>Jogar</span>
                  <ArrowRight className="w-3 h-3 text-red-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* GAME 2: Reino Animal (Memória 32 Pares) */}
        <div
          onClick={() => onSelectGame('memory-animals')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectGame('memory-animals');
          }}
          className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left overflow-hidden ${
            activeGame === 'memory-animals'
              ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500/80 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
          }`}
          id="select-game-animals"
        >
          {activeGame === 'memory-animals' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          )}

          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center text-xl shadow-md shrink-0">
                🐾🏠
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight">
                    Memória 32 Pares
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    Ler & Estudar 📖
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-1">
                  32 pares de Animais & Objetos de Casa com palavras para ler, sílabas e som!
                </p>
                <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-400">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>
                    Recorde:{' '}
                    <strong className="text-slate-200">
                      {formatTime(animalsRecord.time)}
                    </strong>{' '}
                    {animalsRecord.moves ? `(${animalsRecord.moves}m)` : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-0.5">
              {activeGame === 'memory-animals' ? (
                <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold bg-emerald-500/20 px-2 py-1 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Jogando</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-xl transition-colors font-medium"
                >
                  <span>Jogar</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* GAME 3: Aventura & Arcade Fantástico (Memória 32 Pares) */}
        <div
          onClick={() => onSelectGame('memory-classic')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectGame('memory-classic');
          }}
          className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left overflow-hidden ${
            activeGame === 'memory-classic'
              ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border-indigo-500/80 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
          }`}
          id="select-game-classic"
        >
          {activeGame === 'memory-classic' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
          )}

          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-sky-400 flex items-center justify-center text-2xl shadow-md shrink-0">
                💎
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight">
                    Memória Arcade
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    32 Pares
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-1">
                  Coroas reais, diamantes, espadas mágicas, foguetes e relíquias clássicas.
                </p>
                <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-400">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>
                    Recorde:{' '}
                    <strong className="text-slate-200">
                      {formatTime(classicRecord.time)}
                    </strong>{' '}
                    {classicRecord.moves ? `(${classicRecord.moves}m)` : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-0.5">
              {activeGame === 'memory-classic' ? (
                <div className="flex items-center space-x-1 text-indigo-400 text-xs font-bold bg-indigo-500/20 px-2 py-1 rounded-xl border border-indigo-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Jogando</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-xl transition-colors font-medium"
                >
                  <span>Jogar</span>
                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
