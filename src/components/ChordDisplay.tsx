"use client";

import type { ChordSymbol } from "@/types/chord";
import { getChordSymbol } from "@/lib/chords";
import { getDisplayNotes } from "@/lib/fretboard";
import { ROLE_COLORS } from "@/lib/noteRoles";
import { SCALES } from "@/lib/scales";

interface Props {
  chord: ChordSymbol;
  scaleId: string;
  onPreview: () => void;
}

export default function ChordDisplay({ chord, scaleId, onPreview }: Props) {
  const tones = getDisplayNotes(chord, "arpeggio");
  const scaleName = SCALES[scaleId]?.name ?? "—";

  return (
    <div className="py-3 text-center">
      <div className="mb-3 text-[52px] font-bold leading-none tracking-tighter">
        {getChordSymbol(chord)}
      </div>
      <div className="mb-2.5 text-[13px] text-neutral-400">
        スケール: <span className="font-bold text-amber-400">{scaleName}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {tones.map((t, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-bold text-black"
              style={{ background: ROLE_COLORS[t.role] }}
            >
              {t.degreeLabel}
            </span>
            <span className="text-xs font-medium">{t.noteName}</span>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={onPreview}
          className="rounded-[18px] border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-blue-300"
        >
          🔊 このコードを試聴
        </button>
      </div>
    </div>
  );
}
