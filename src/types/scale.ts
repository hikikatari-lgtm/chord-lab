export type DisplayMode = "name" | "degree";

export type ScaleCategory =
  | "major-modes"
  | "harmonic-minor"
  | "melodic-minor"
  | "pentatonic"
  | "symmetric"
  | "arpeggio";

export interface ScaleDef {
  name: string; // 表示名(日本語)
  intervals: number[] | null; // ルートからの半音間隔。null = アルペジオ(コードトーン)
  category: ScaleCategory;
}

// 音の役割
export type NoteRole =
  | "root"
  | "guide-3rd"
  | "guide-7th"
  | "5th"
  | "chord-tone"
  | "natural-tension"
  | "altered-tension"
  | "avoid"
  | "passing";

export interface DisplayNote {
  noteName: string;
  semitones: number;
  role: NoteRole;
  degreeLabel: string;
}
