import Link from "next/link";
import type { ChordProgression } from "@/types/chord";

export default function PresetCard({ preset }: { preset: ChordProgression }) {
  return (
    <Link
      href={`/progressions/${preset.id}`}
      className="block rounded-xl border border-neutral-800 bg-neutral-900 p-3.5 transition-transform active:scale-[0.98]"
    >
      <div className="flex justify-between">
        <div className="text-[15px] font-bold">{preset.title}</div>
        <div className="flex gap-1">
          <span className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px]">
            {preset.key}
          </span>
          <span className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px]">
            {preset.bpm}
          </span>
        </div>
      </div>
      <div className="mt-1 text-[11px] text-neutral-500">{preset.description}</div>
    </Link>
  );
}
