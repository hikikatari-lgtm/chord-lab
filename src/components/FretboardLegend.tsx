import { ROLE_COLORS } from "@/lib/noteRoles";

const ITEMS: { role: keyof typeof ROLE_COLORS; label: string; size: number; border?: string }[] = [
  { role: "root", label: "R (ルート)", size: 8, border: "2px solid #fff" },
  { role: "guide-3rd", label: "3度(ガイド)", size: 8, border: "1px solid #fff" },
  { role: "guide-7th", label: "7度(ガイド)", size: 8, border: "1px solid #fff" },
  { role: "5th", label: "5度", size: 10 },
  { role: "natural-tension", label: "ナチュラルテンション", size: 8 },
  { role: "altered-tension", label: "アルタードテンション", size: 8 },
  { role: "passing", label: "経過音", size: 6 },
];

export default function FretboardLegend() {
  return (
    <div className="mt-3">
      <div className="mb-1.5 text-[10px] uppercase tracking-wide text-neutral-600">
        凡例 - 音の役割
      </div>
      <div className="flex flex-wrap gap-2.5">
        {ITEMS.map((it) => (
          <div key={it.role} className="flex items-center gap-1 text-[10px] text-neutral-400">
            <span
              className="inline-block shrink-0 rounded-full"
              style={{
                width: it.size,
                height: it.size,
                background: ROLE_COLORS[it.role],
                border: it.border,
              }}
            />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
