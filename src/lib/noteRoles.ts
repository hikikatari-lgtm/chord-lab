import type { ChordQuality } from "@/types/chord";
import type { NoteRole } from "@/types/scale";
import { CHORD_INTERVALS } from "./chords";

export function getNoteRole(
  intervalSemitones: number,
  chordQuality: ChordQuality,
): NoteRole {
  const intervals = CHORD_INTERVALS[chordQuality] || [];
  if (intervals.includes(intervalSemitones)) {
    if (intervalSemitones === 0) return "root";
    if (intervalSemitones === 3 || intervalSemitones === 4) return "guide-3rd";
    if (
      intervalSemitones === 10 ||
      intervalSemitones === 11 ||
      intervalSemitones === 9
    )
      return "guide-7th";
    if (
      intervalSemitones === 6 ||
      intervalSemitones === 7 ||
      intervalSemitones === 8
    )
      return "5th";
    return "chord-tone";
  }
  if (intervalSemitones === 2) return "natural-tension";
  if (intervalSemitones === 5 && !intervals.includes(5))
    return "natural-tension";
  if (intervalSemitones === 9 && !intervals.includes(9))
    return "natural-tension";
  if (intervalSemitones === 1) return "altered-tension";
  if (intervalSemitones === 3 && !intervals.includes(3))
    return "altered-tension";
  if (intervalSemitones === 6 && !intervals.includes(6))
    return "altered-tension";
  if (intervalSemitones === 8 && !intervals.includes(8))
    return "altered-tension";
  if (intervalSemitones === 5 && intervals.includes(4)) return "avoid";
  return "passing";
}

export function getDegreeLabel(
  intervalSemitones: number,
  chordQuality: ChordQuality,
): string {
  const intervals = CHORD_INTERVALS[chordQuality] || [];
  if (intervals.includes(intervalSemitones)) {
    if (intervalSemitones === 0) return "R";
    if (intervalSemitones === 3) return "♭3";
    if (intervalSemitones === 4) return "3";
    if (intervalSemitones === 6) return "♭5";
    if (intervalSemitones === 7) return "5";
    if (intervalSemitones === 8) return "♯5";
    if (intervalSemitones === 9 && chordQuality === "dim7") return "𝄫7";
    if (intervalSemitones === 10) return "♭7";
    if (intervalSemitones === 11) return "7";
  }
  if (intervalSemitones === 1) return "♭9";
  if (intervalSemitones === 2) return "9";
  if (intervalSemitones === 3) return "♯9";
  if (intervalSemitones === 5) return "11";
  if (intervalSemitones === 6) return "♯11";
  if (intervalSemitones === 8) return "♭13";
  if (intervalSemitones === 9) return "13";
  return `${intervalSemitones}`;
}

export const ROLE_COLORS: Record<NoteRole, string> = {
  root: "#fbbf24",
  "guide-3rd": "#ef4444",
  "guide-7th": "#22c55e",
  "5th": "#3b82f6",
  "chord-tone": "#3b82f6",
  "natural-tension": "#06b6d4",
  "altered-tension": "#a855f7",
  avoid: "#6b7280",
  passing: "#525252",
};

export const ROLE_SIZE: Record<NoteRole, number> = {
  root: 12,
  "guide-3rd": 12,
  "guide-7th": 12,
  "5th": 11,
  "chord-tone": 11,
  "natural-tension": 9,
  "altered-tension": 9,
  avoid: 7,
  passing: 7,
};

// 重ね順（後のものが前面）
export const ROLE_DRAW_ORDER: Record<NoteRole, number> = {
  passing: 0,
  avoid: 1,
  "altered-tension": 2,
  "natural-tension": 3,
  "5th": 4,
  "chord-tone": 5,
  "guide-7th": 6,
  "guide-3rd": 7,
  root: 8,
};
