"use client";

import type { ChordProgression } from "@/types/chord";
import { NOTES, normalizeRoot } from "@/lib/notes";

interface Props {
  progression: ChordProgression;
  transposeSemitones: number;
  onChange: (semitones: number) => void;
}

export default function KeySelector({
  progression,
  transposeSemitones,
  onChange,
}: Props) {
  const baseKey = normalizeRoot(
    progression.isMinor ? progression.key.replace("m", "") : progression.key,
  );
  const baseIdx = NOTES.indexOf(baseKey as (typeof NOTES)[number]);
  const current = ((transposeSemitones % 12) + 12) % 12;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-md border border-neutral-700 bg-black px-2.5 py-1.5 pr-7 font-mono text-[13px] font-bold text-white focus:border-amber-400 focus:outline-none"
      >
        {NOTES.map((n, i) => {
          const semitones = (i - baseIdx + 12) % 12;
          const label = progression.isMinor ? `${n}m` : n;
          return (
            <option key={n} value={semitones}>
              {label}
            </option>
          );
        })}
      </select>
      <div className="inline-flex gap-1">
        <button
          type="button"
          onClick={() => onChange(((transposeSemitones - 1 + 144) % 12))}
          className="h-8 w-8 rounded-md bg-neutral-800 text-sm font-bold text-white active:bg-neutral-700"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onChange(((transposeSemitones + 1) % 12))}
          className="h-8 w-8 rounded-md bg-neutral-800 text-sm font-bold text-white active:bg-neutral-700"
        >
          ＋
        </button>
      </div>
      <button
        type="button"
        onClick={() => onChange(0)}
        className="h-8 rounded-md bg-neutral-800 px-2.5 text-[11px] text-amber-400"
      >
        原Keyに戻す
      </button>
    </div>
  );
}
