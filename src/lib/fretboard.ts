import type { ChordSymbol } from "@/types/chord";
import type { DisplayNote } from "@/types/scale";
import { NOTES, normalizeRoot } from "./notes";
import { CHORD_INTERVALS } from "./chords";
import { SCALES } from "./scales";
import { getNoteRole, getDegreeLabel } from "./noteRoles";

export const TUNING = ["E", "A", "D", "G", "B", "E"]; // 6弦→1弦

export interface FretPosition {
  string: number; // 0=6弦(最低音) ... 5=1弦(最高音)
  fret: number; // 0-maxFret
  note: DisplayNote;
}

export function getDisplayNotes(
  chord: ChordSymbol,
  scaleId: string,
): DisplayNote[] {
  const rootIdx = NOTES.indexOf(
    normalizeRoot(chord.root) as (typeof NOTES)[number],
  );
  const scale = SCALES[scaleId];
  let intervals: number[];
  if (scaleId === "arpeggio" || !scale || !scale.intervals) {
    intervals = CHORD_INTERVALS[chord.quality] || [];
  } else {
    intervals = scale.intervals;
  }
  return intervals.map((iv) => ({
    noteName: NOTES[(rootIdx + iv) % 12],
    semitones: iv % 12,
    role: getNoteRole(iv % 12, chord.quality),
    degreeLabel: getDegreeLabel(iv % 12, chord.quality),
  }));
}

export function getFretboardPositions(
  chord: ChordSymbol,
  scaleId: string,
  maxFret = 12,
): FretPosition[] {
  const displayNotes = getDisplayNotes(chord, scaleId);
  const positions: FretPosition[] = [];
  TUNING.forEach((openNote, stringIdx) => {
    const openIdx = NOTES.indexOf(
      normalizeRoot(openNote) as (typeof NOTES)[number],
    );
    for (let fret = 0; fret <= maxFret; fret++) {
      const noteName = NOTES[(openIdx + fret) % 12];
      const matched = displayNotes.find((n) => n.noteName === noteName);
      if (matched) positions.push({ string: stringIdx, fret, note: matched });
    }
  });
  return positions;
}
