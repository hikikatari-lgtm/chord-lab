import type { ChordQuality, ChordSymbol } from "@/types/chord";
import { NOTES, normalizeRoot } from "./notes";

export const CHORD_INTERVALS: Record<ChordQuality, number[]> = {
  maj: [0, 4, 7],
  m: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  "7": [0, 4, 7, 10],
  m7b5: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9],
  mMaj7: [0, 3, 7, 11],
  "6": [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  sus4: [0, 5, 7],
  "7sus4": [0, 5, 7, 10],
  maj9: [0, 4, 7, 11, 14],
  m9: [0, 3, 7, 10, 14],
  "9": [0, 4, 7, 10, 14],
  "13": [0, 4, 7, 10, 14, 21],
};

export const QUALITY_LABELS: Record<ChordQuality, string> = {
  maj: "",
  m: "m",
  dim: "dim",
  aug: "aug",
  maj7: "maj7",
  m7: "m7",
  "7": "7",
  m7b5: "m7♭5",
  dim7: "dim7",
  mMaj7: "mMaj7",
  "6": "6",
  m6: "m6",
  sus4: "sus4",
  "7sus4": "7sus4",
  maj9: "maj9",
  m9: "m9",
  "9": "9",
  "13": "13",
};

export function getChordSymbol(chord: ChordSymbol): string {
  return `${chord.root}${QUALITY_LABELS[chord.quality]}`;
}

export function transposeChord(
  chord: ChordSymbol,
  semitones: number,
): ChordSymbol {
  const idx = NOTES.indexOf(
    normalizeRoot(chord.root) as (typeof NOTES)[number],
  );
  const root = idx === -1 ? chord.root : NOTES[(idx + semitones + 144) % 12];
  return { ...chord, root };
}
