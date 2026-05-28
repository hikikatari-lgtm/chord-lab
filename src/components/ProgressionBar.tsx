"use client";

import type { ChordSymbol } from "@/types/chord";
import { getChordSymbol } from "@/lib/chords";

interface Props {
  chords: ChordSymbol[];
  currentIndex: number;
  onJump: (index: number) => void;
}

export default function ProgressionBar({ chords, currentIndex, onJump }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {chords.map((c, i) => {
        const current = i === currentIndex;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            className={`min-w-[50px] shrink-0 rounded-lg px-3 py-2 text-center text-[13px] font-bold transition-all ${
              current
                ? "scale-110 bg-amber-400 text-black shadow-[0_4px_12px_rgba(251,191,36,0.4)]"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {getChordSymbol(c)}
          </button>
        );
      })}
    </div>
  );
}
