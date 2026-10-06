'use client';

import dynamic from 'next/dynamic';
import { GameSkeleton } from '@/components/memory-game/GameSkeleton';

// Dynamically import the interactive MemoryGameBoard client-side only
// to avoid SSR hydration mismatches with random card deck shuffling & localStorage
const MemoryGameBoard = dynamic(
  () => import('@/components/memory-game/MemoryGameBoard'),
  {
    ssr: false,
    loading: () => <GameSkeleton />,
  }
);

export default function Page() {
  return <MemoryGameBoard />;
}
