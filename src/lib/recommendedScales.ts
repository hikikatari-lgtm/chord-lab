import type { ChordQuality } from "@/types/chord";

export interface RecommendedScale {
  id: string;
  label: string;
}

// コードクオリティごとのおすすめスケール（先頭は必ず arpeggio、2番目が定番）
export const RECOMMENDED_SCALES: Partial<
  Record<ChordQuality, RecommendedScale[]>
> = {
  maj7: [
    { id: "arpeggio", label: "アルペジオ" },
    { id: "ionian", label: "アイオニアン (定番)" },
    { id: "lydian", label: "リディアン (#11)" },
    { id: "major-pentatonic", label: "メジャーペンタ" },
    { id: "lydian-aug", label: "リディアン♯5" },
  ],
  m7: [
    { id: "arpeggio", label: "アルペジオ" },
    { id: "dorian", label: "ドリアン (定番)" },
    { id: "aeolian", label: "エオリアン" },
    { id: "minor-pentatonic", label: "マイナーペンタ" },
    { id: "blues", label: "ブルース" },
    { id: "phrygian", label: "フリジアン" },
    { id: "melodic-minor", label: "メロディックマイナー" },
  ],
  "7": [
    { id: "arpeggio", label: "アルペジオ" },
    { id: "mixolydian", label: "ミクソリディアン (定番)" },
    { id: "altered", label: "オルタード ⭐" },
    { id: "lydian-dominant", label: "リディアン♭7" },
    { id: "phrygian-dominant", label: "フリジアンドミナント (HMP5↓)" },
    { id: "half-whole-dim", label: "コンディミ" },
    { id: "whole-tone", label: "ホールトーン" },
    { id: "blues", label: "ブルース" },
  ],
  m7b5: [
    { id: "arpeggio", label: "アルペジオ" },
    { id: "locrian", label: "ロクリアン (定番)" },
    { id: "locrian-nat2", label: "ロクリアン♮2 ⭐" },
    { id: "locrian-nat6", label: "ロクリアン♮6" },
  ],
  dim7: [
    { id: "arpeggio", label: "アルペジオ" },
    { id: "whole-half-dim", label: "ディミニッシュ (W-H) ⭐" },
    { id: "half-whole-dim", label: "コンディミ (H-W)" },
  ],
  maj: [
    { id: "arpeggio", label: "アルペジオ" },
    { id: "ionian", label: "アイオニアン" },
    { id: "lydian", label: "リディアン" },
    { id: "major-pentatonic", label: "メジャーペンタ" },
  ],
  m: [
    { id: "arpeggio", label: "アルペジオ" },
    { id: "aeolian", label: "エオリアン" },
    { id: "dorian", label: "ドリアン" },
    { id: "minor-pentatonic", label: "マイナーペンタ" },
    { id: "blues", label: "ブルース" },
    { id: "harmonic-minor", label: "ハーモニックマイナー" },
    { id: "melodic-minor", label: "メロディックマイナー" },
  ],
};

export function getRecommendedScales(quality: ChordQuality): RecommendedScale[] {
  return RECOMMENDED_SCALES[quality] ?? [{ id: "arpeggio", label: "アルペジオ" }];
}
