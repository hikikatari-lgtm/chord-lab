export type ChordQuality =
  | "maj"
  | "m"
  | "dim"
  | "aug"
  | "maj7"
  | "m7"
  | "7"
  | "m7b5"
  | "dim7"
  | "mMaj7"
  | "6"
  | "m6"
  | "sus4"
  | "7sus4"
  | "maj9"
  | "m9"
  | "9"
  | "13";

export interface ChordSymbol {
  root: string; // 'C', 'C#', 'D' ... (内部は#表記に正規化)
  quality: ChordQuality;
  beats: number; // このコードの長さ(拍数)
  defaultScale: string; // デフォルトで表示するスケールID
}

export interface ChordProgression {
  id: string;
  title: string;
  key: string; // "C" or "Am"
  bpm: number;
  isMinor: boolean; // マイナーキーか(移調時のキー名表示に使用)
  chords: ChordSymbol[];
  category: "jazz" | "blues";
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  tip?: string;
  // コード譜（小節グリッド）。各セルは chords[] のインデックスを参照。
  // 再生中の現在コードと連動してハイライトされる。
  chordChart?: {
    repeat?: boolean; // ||:  :|| を表示
    rows: number[][]; // 行 × 小節（chords[] のインデックス）
  };
  // 実音源（バッキングトラック）。指定するとシンセ再生の代わりに
  // この音源を再生し、ハイライトを currentTime から同期する。
  audio?: {
    url: string; // public/ からのパス
    countInBars?: number; // 1小節目が始まる前のカウントイン小節数
  };
}
