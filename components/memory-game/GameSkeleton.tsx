import React from 'react';
import { Loader2 } from 'lucide-react';

export const GameSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header skeleton */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <span className="text-xl">🎮</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-white">ARENA JOGOS</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Jogos Interativos
                </span>
              </div>
              <p className="text-xs text-slate-400">Super Mario & Jogos da Memória</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
            <span>Carregando Jogos...</span>
          </div>
        </div>
      </header>

      {/* Main container skeleton */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4">
        {/* Games Selector Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="h-20 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
          <div className="h-20 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
          <div className="h-20 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
        </div>

        {/* Stats header placeholder */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 h-32 animate-pulse flex flex-col justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-800/50 rounded-xl" />
            ))}
          </div>
          <div className="h-2 bg-slate-800 rounded-full w-full" />
        </div>

        {/* Board skeleton */}
        <div className="relative flex-1 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4 sm:p-6 min-h-[460px] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-sm text-slate-400 font-medium">Carregando Arena de Jogos...</span>
          </div>
        </div>
      </main>
    </div>
  );
};
