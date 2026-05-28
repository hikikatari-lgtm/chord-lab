import PresetCard from "@/components/PresetCard";
import { PRESETS } from "@/data/presets";

const CATEGORIES: { id: "jazz" | "pop" | "blues"; label: string; emoji: string }[] = [
  { id: "jazz", label: "Jazz", emoji: "🎷" },
  { id: "pop", label: "Pop", emoji: "🎤" },
  { id: "blues", label: "Blues", emoji: "🎸" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-5">
      <h1 className="text-2xl font-bold text-amber-400">🎸 Chord Lab</h1>
      <div className="mb-1.5 text-[13px] text-neutral-400">
        プロの頭の中を視覚化する
      </div>
      <p className="mb-6 text-[11px] leading-relaxed text-neutral-600">
        コード進行に合わせて、各コードで使うスケールをフレットボード上に表示。
        リアルなピアノ音源でコードの響きと一緒に体感できます。
      </p>

      {CATEGORIES.map((cat) => {
        const items = PRESETS.filter((p) => p.category === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} className="mb-5">
            <h2 className="mb-3 text-sm font-bold text-amber-400">
              {cat.emoji} {cat.label}
            </h2>
            <div className="space-y-2">
              {items.map((p) => (
                <PresetCard key={p.id} preset={p} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-6 text-center text-[10px] text-neutral-700">
        Chord Lab · with Piano Sound
      </div>
    </div>
  );
}
