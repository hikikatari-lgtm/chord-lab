import type { ChordProgression } from "@/types/chord";

export const PRESETS: ChordProgression[] = [
  {
    id: "jazz-major-251",
    title: "メジャー II-V-I",
    key: "C",
    bpm: 70,
    category: "jazz",
    isMinor: false,
    difficulty: "beginner",
    chords: [
      { root: "D", quality: "m7", beats: 4, defaultScale: "dorian" },
      { root: "G", quality: "7", beats: 4, defaultScale: "mixolydian" },
      { root: "C", quality: "maj7", beats: 8, defaultScale: "ionian" },
    ],
    description:
      "ジャズで最頻出のツーファイブワン。スケールを切り替えて語彙を広げよう。",
    tip: "G7でオルタードを試すと一気にジャズっぽくなる。",
  },
  {
    id: "jazz-minor-251",
    title: "マイナー II-V-I",
    key: "Am",
    bpm: 65,
    category: "jazz",
    isMinor: true,
    difficulty: "intermediate",
    chords: [
      { root: "B", quality: "m7b5", beats: 4, defaultScale: "locrian-nat2" },
      { root: "E", quality: "7", beats: 4, defaultScale: "phrygian-dominant" },
      { root: "A", quality: "m7", beats: 8, defaultScale: "harmonic-minor" },
    ],
    description: "マイナーキー定番。E7にHMP5↓を使うのが伝統。",
    tip: "Bm7♭5にはロクリアン♮2、E7にはフリジアンドミナントが鉄板。",
  },
  {
    id: "pop-komuro",
    title: "小室進行",
    key: "Am",
    bpm: 90,
    category: "pop",
    isMinor: true,
    difficulty: "beginner",
    chords: [
      { root: "A", quality: "m", beats: 4, defaultScale: "aeolian" },
      { root: "F", quality: "maj", beats: 4, defaultScale: "lydian" },
      { root: "G", quality: "maj", beats: 4, defaultScale: "ionian" },
      { root: "C", quality: "maj", beats: 4, defaultScale: "ionian" },
    ],
    description: "VIm-IV-V-I「小室進行」。J-POP定番。",
    tip: "まずトライアド(R-3-5)だけで弾いてみよう。",
  },
  {
    id: "pop-canon",
    title: "カノン進行",
    key: "C",
    bpm: 85,
    category: "pop",
    isMinor: false,
    difficulty: "beginner",
    chords: [
      { root: "C", quality: "maj", beats: 4, defaultScale: "ionian" },
      { root: "G", quality: "maj", beats: 4, defaultScale: "ionian" },
      { root: "A", quality: "m", beats: 4, defaultScale: "aeolian" },
      { root: "E", quality: "m", beats: 4, defaultScale: "phrygian" },
      { root: "F", quality: "maj", beats: 4, defaultScale: "ionian" },
      { root: "C", quality: "maj", beats: 4, defaultScale: "ionian" },
      { root: "F", quality: "maj", beats: 4, defaultScale: "ionian" },
      { root: "G", quality: "maj", beats: 4, defaultScale: "ionian" },
    ],
    description: "パッヘルベルのカノン。J-POPでも頻出のド定番。",
    tip: "3和音中心。トライアドだけで進行を体感しよう。",
  },
  {
    id: "blues-12bar-a",
    title: "12小節ブルース (A)",
    key: "A",
    bpm: 80,
    category: "blues",
    isMinor: false,
    difficulty: "intermediate",
    chords: [
      { root: "A", quality: "7", beats: 16, defaultScale: "blues" },
      { root: "D", quality: "7", beats: 8, defaultScale: "mixolydian" },
      { root: "A", quality: "7", beats: 8, defaultScale: "blues" },
      { root: "E", quality: "7", beats: 4, defaultScale: "mixolydian" },
      { root: "D", quality: "7", beats: 4, defaultScale: "mixolydian" },
      { root: "A", quality: "7", beats: 4, defaultScale: "blues" },
      { root: "E", quality: "7", beats: 4, defaultScale: "altered" },
    ],
    description: "ブルースの基本「I-IV-V」12小節進行。",
    tip: "ターンアラウンドのE7でオルタードに切り替えるとジャズブルース風。",
  },
];

export function getProgression(id: string): ChordProgression | undefined {
  return PRESETS.find((p) => p.id === id);
}
