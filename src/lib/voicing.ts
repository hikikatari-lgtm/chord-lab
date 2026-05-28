import type { ChordSymbol } from "@/types/chord";
import { NOTES, normalizeRoot } from "./notes";
import { CHORD_INTERVALS } from "./chords";

// ピアノ発音用のボイシング
// ベース音: ルートをオクターブ2、上部: コードトーンをオクターブ4中心に。
// テンション(9th以上)は1オクターブ上げて自然に。4〜5音に収める。
export function getChordVoicing(chord: ChordSymbol): {
  bass: string;
  upper: string[];
} {
  const rootIdx = NOTES.indexOf(
    normalizeRoot(chord.root) as (typeof NOTES)[number],
  );
  const intervals = CHORD_INTERVALS[chord.quality] || [];

  const bass = `${NOTES[rootIdx]}2`;

  const upper = intervals.slice(0, 5).map((iv) => {
    const noteIdx = (rootIdx + iv) % 12;
    // ベース基準オクターブ4。1オクターブ(12)を超えるテンションは更に上へ。
    const octave = 4 + Math.floor(iv / 12);
    return `${NOTES[noteIdx]}${octave}`;
  });

  return { bass, upper };
}
