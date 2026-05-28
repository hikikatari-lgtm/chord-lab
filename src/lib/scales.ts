import type { ScaleDef } from "@/types/scale";

export const SCALES: Record<string, ScaleDef> = {
  // メジャースケール7モード
  ionian: { name: "アイオニアン (メジャー)", intervals: [0, 2, 4, 5, 7, 9, 11], category: "major-modes" },
  dorian: { name: "ドリアン", intervals: [0, 2, 3, 5, 7, 9, 10], category: "major-modes" },
  phrygian: { name: "フリジアン", intervals: [0, 1, 3, 5, 7, 8, 10], category: "major-modes" },
  lydian: { name: "リディアン", intervals: [0, 2, 4, 6, 7, 9, 11], category: "major-modes" },
  mixolydian: { name: "ミクソリディアン", intervals: [0, 2, 4, 5, 7, 9, 10], category: "major-modes" },
  aeolian: { name: "エオリアン (ナチュラルマイナー)", intervals: [0, 2, 3, 5, 7, 8, 10], category: "major-modes" },
  locrian: { name: "ロクリアン", intervals: [0, 1, 3, 5, 6, 8, 10], category: "major-modes" },
  // ハーモニックマイナーとモード
  "harmonic-minor": { name: "ハーモニックマイナー", intervals: [0, 2, 3, 5, 7, 8, 11], category: "harmonic-minor" },
  "locrian-nat6": { name: "ロクリアン♮6", intervals: [0, 1, 3, 5, 6, 9, 10], category: "harmonic-minor" },
  "ionian-aug": { name: "アイオニアン♯5", intervals: [0, 2, 4, 5, 8, 9, 11], category: "harmonic-minor" },
  "dorian-sharp4": { name: "ドリアン♯4", intervals: [0, 2, 3, 6, 7, 9, 10], category: "harmonic-minor" },
  "phrygian-dominant": { name: "フリジアンドミナント (HMP5↓)", intervals: [0, 1, 4, 5, 7, 8, 10], category: "harmonic-minor" },
  "lydian-sharp2": { name: "リディアン♯2", intervals: [0, 3, 4, 6, 7, 9, 11], category: "harmonic-minor" },
  "super-locrian-bb7": { name: "スーパーロクリアン♭♭7", intervals: [0, 1, 3, 4, 6, 8, 9], category: "harmonic-minor" },
  // メロディックマイナーとモード
  "melodic-minor": { name: "メロディックマイナー", intervals: [0, 2, 3, 5, 7, 9, 11], category: "melodic-minor" },
  "dorian-b2": { name: "ドリアン♭2", intervals: [0, 1, 3, 5, 7, 9, 10], category: "melodic-minor" },
  "lydian-aug": { name: "リディアン♯5", intervals: [0, 2, 4, 6, 8, 9, 11], category: "melodic-minor" },
  "lydian-dominant": { name: "リディアン♭7", intervals: [0, 2, 4, 6, 7, 9, 10], category: "melodic-minor" },
  "mixolydian-b6": { name: "ミクソリディアン♭6", intervals: [0, 2, 4, 5, 7, 8, 10], category: "melodic-minor" },
  "locrian-nat2": { name: "ロクリアン♮2", intervals: [0, 2, 3, 5, 6, 8, 10], category: "melodic-minor" },
  altered: { name: "オルタード (スーパーロクリアン)", intervals: [0, 1, 3, 4, 6, 8, 10], category: "melodic-minor" },
  // ペンタ・ブルース
  "minor-pentatonic": { name: "マイナーペンタトニック", intervals: [0, 3, 5, 7, 10], category: "pentatonic" },
  "major-pentatonic": { name: "メジャーペンタトニック", intervals: [0, 2, 4, 7, 9], category: "pentatonic" },
  blues: { name: "ブルーススケール", intervals: [0, 3, 5, 6, 7, 10], category: "pentatonic" },
  // シンメトリック
  "whole-tone": { name: "ホールトーン", intervals: [0, 2, 4, 6, 8, 10], category: "symmetric" },
  "half-whole-dim": { name: "コンディミ (H-W)", intervals: [0, 1, 3, 4, 6, 7, 9, 10], category: "symmetric" },
  "whole-half-dim": { name: "ディミニッシュ (W-H)", intervals: [0, 2, 3, 5, 6, 8, 9, 11], category: "symmetric" },
  // アルペジオ
  arpeggio: { name: "アルペジオ (コードトーン)", intervals: null, category: "arpeggio" },
};
