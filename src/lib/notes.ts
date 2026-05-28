export const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type NoteName = (typeof NOTES)[number];

const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

export function normalizeRoot(root: string): string {
  return FLAT_TO_SHARP[root] ?? root;
}

export function transposeNote(root: string, semitones: number): string {
  const idx = NOTES.indexOf(normalizeRoot(root) as NoteName);
  if (idx === -1) return root;
  return NOTES[(idx + semitones + 144) % 12];
}
