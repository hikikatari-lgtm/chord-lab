"use client";

import type { ChordQuality } from "@/types/chord";
import { getRecommendedScales } from "@/lib/recommendedScales";

interface Props {
  quality: ChordQuality;
  value: string;
  onChange: (scaleId: string) => void;
}

export default function ScaleSelector({ quality, value, onChange }: Props) {
  const options = getRecommendedScales(quality);
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-700 bg-black px-2.5 py-2 pr-7 text-[13px] text-white focus:border-amber-400 focus:outline-none"
      >
        {options.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <div className="mt-1.5 text-[10px] text-neutral-600">
        各コードで個別に切替可能。再生中も即座に切り替わります。
      </div>
    </div>
  );
}
