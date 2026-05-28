"use client";

import type { ChordSymbol } from "@/types/chord";
import { getChordSymbol } from "@/lib/chords";

interface Props {
  rows: number[][]; // 各セルは chords[] のインデックス
  repeat?: boolean;
  chords: ChordSymbol[]; // 移調済みコード配列
  currentIndex: number;
  onJump: (index: number) => void;
}

export default function ChordChart({
  rows,
  repeat,
  chords,
  currentIndex,
  onJump,
}: Props) {
  return (
    <div className="space-y-1.5">
      {rows.map((row, ri) => {
        const isFirst = ri === 0;
        const isLast = ri === rows.length - 1;
        return (
          <div key={ri} className="flex items-stretch gap-1">
            {/* 左端の小節線 / リピート開始 */}
            <div className="flex w-4 items-center justify-center font-mono text-base text-neutral-500">
              {repeat && isFirst ? "‖:" : "|"}
            </div>
            {row.map((chordIdx, ci) => {
              const chord = chords[chordIdx];
              const current = chordIdx === currentIndex;
              return (
                <div key={ci} className="flex flex-1 items-stretch gap-1">
                  <button
                    type="button"
                    onClick={() => onJump(chordIdx)}
                    className={`flex-1 rounded-md py-3 text-center text-sm font-bold transition-all ${
                      current
                        ? "bg-amber-400 text-black shadow-[0_2px_10px_rgba(251,191,36,0.4)]"
                        : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                    }`}
                  >
                    {chord ? getChordSymbol(chord) : ""}
                  </button>
                  {/* 小節線 / リピート終了 */}
                  <div className="flex w-4 items-center justify-center font-mono text-base text-neutral-500">
                    {repeat && isLast && ci === row.length - 1 ? ":‖" : "|"}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
