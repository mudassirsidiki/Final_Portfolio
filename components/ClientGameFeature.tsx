'use client';  // This marks it as a Client Component

import dynamic from 'next/dynamic';

const GameFeature = dynamic(() => import("@/components/game-feature"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="text-purple-300/70 animate-pulse">Loading interactive experience...</div>
    </div>
  )
});

export default function ClientGameFeature() {
  return <GameFeature />;
}