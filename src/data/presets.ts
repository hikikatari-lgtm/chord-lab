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
      { root: "D", quality: "m7", beats: 4, defaultScale: "arpeggio" },
      { root: "G", quality: "7", beats: 4, defaultScale: "arpeggio" },
      { root: "C", quality: "maj7", beats: 8, defaultScale: "arpeggio" },
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
      { root: "B", quality: "m7b5", beats: 4, defaultScale: "arpeggio" },
      { root: "E", quality: "7", beats: 4, defaultScale: "arpeggio" },
      { root: "A", quality: "m7", beats: 8, defaultScale: "arpeggio" },
    ],
    description: "マイナーキー定番。E7にHMP5↓を使うのが伝統。",
    tip: "Bm7♭5にはロクリアン♮2、E7にはフリジアンドミナントが鉄板。",
  },
  {
    id: "blues-12bar-a",
    title: "12小節ブルース (A)",
    key: "A",
    bpm: 78,
    category: "blues",
    isMinor: false,
    difficulty: "intermediate",
    // クイックチェンジ版（2小節目が IV=D7）。1小節 = 1コード（4拍）
    chords: [
      { root: "A", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 1
      { root: "D", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 2
      { root: "A", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 3
      { root: "A", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 4
      { root: "D", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 5
      { root: "D", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 6
      { root: "A", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 7
      { root: "A", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 8
      { root: "E", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 9
      { root: "D", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 10
      { root: "A", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 11
      { root: "E", quality: "7", beats: 4, defaultScale: "arpeggio" }, // 12 ターンアラウンド
    ],
    chordChart: {
      repeat: true,
      rows: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
      ],
    },
    audio: {
      url: "/audio/a-blues.mp3",
      countInBars: 1,
    },
    description: "ブルースの基本「I-IV-V」12小節進行（クイックチェンジ）。",
    tip: "ターンアラウンド(12小節目)のE7でオルタードに切り替えるとジャズブルース風。",
  },
];

export function getProgression(id: string): ChordProgression | undefined {
  return PRESETS.find((p) => p.id === id);
}
