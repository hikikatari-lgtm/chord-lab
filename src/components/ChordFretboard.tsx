"use client";

import type { ChordSymbol } from "@/types/chord";
import type { DisplayMode } from "@/types/scale";
import { getFretboardPositions } from "@/lib/fretboard";
import { ROLE_COLORS, ROLE_SIZE, ROLE_DRAW_ORDER } from "@/lib/noteRoles";

interface Props {
  chord: ChordSymbol;
  scaleId: string;
  displayMode: DisplayMode;
}

const NUM_FRETS = 12;
const NUM_STRINGS = 6;
const FRET_WIDTH = 38;
const STRING_SPACING = 28;
const PADDING = 24;

export default function ChordFretboard({ chord, scaleId, displayMode }: Props) {
  const positions = getFretboardPositions(chord, scaleId, NUM_FRETS);
  const width = PADDING * 2 + FRET_WIDTH * NUM_FRETS + 40;
  const height = PADDING * 2 + STRING_SPACING * (NUM_STRINGS - 1) + 30;

  const stringY = (i: number) => PADDING + i * STRING_SPACING;
  const fretX = (i: number) => PADDING + 30 + i * FRET_WIDTH;

  const drawOrder = [...positions].sort(
    (a, b) => ROLE_DRAW_ORDER[a.note.role] - ROLE_DRAW_ORDER[b.note.role],
  );

  return (
    <div className="fretboard-wrap overflow-x-auto">
      <svg width={width} height={height} style={{ display: "block" }}>
        {/* インレイ */}
        {[3, 5, 7, 9].map((f) => (
          <circle
            key={`inlay-${f}`}
            cx={fretX(f) - FRET_WIDTH / 2}
            cy={PADDING + STRING_SPACING * 2.5}
            r={4}
            fill="#3a3a3a"
          />
        ))}
        <circle cx={fretX(12) - FRET_WIDTH / 2} cy={stringY(1)} r={4} fill="#3a3a3a" />
        <circle cx={fretX(12) - FRET_WIDTH / 2} cy={stringY(3)} r={4} fill="#3a3a3a" />

        {/* 弦 */}
        {Array.from({ length: NUM_STRINGS }, (_, i) => (
          <line
            key={`s-${i}`}
            x1={PADDING}
            y1={stringY(i)}
            x2={width - PADDING}
            y2={stringY(i)}
            stroke="#666"
            strokeWidth={i < 3 ? 1.5 : 1}
          />
        ))}

        {/* ナット */}
        <line
          x1={PADDING + 30}
          y1={stringY(0)}
          x2={PADDING + 30}
          y2={stringY(NUM_STRINGS - 1)}
          stroke="#ddd"
          strokeWidth={4}
        />

        {/* フレット */}
        {Array.from({ length: NUM_FRETS }, (_, i) => (
          <line
            key={`f-${i}`}
            x1={fretX(i + 1)}
            y1={stringY(0)}
            x2={fretX(i + 1)}
            y2={stringY(NUM_STRINGS - 1)}
            stroke="#444"
            strokeWidth={1}
          />
        ))}

        {/* ノート */}
        {drawOrder.map((pos, i) => {
          const visualString = NUM_STRINGS - 1 - pos.string;
          const cy = stringY(visualString);
          const cx =
            pos.fret === 0 ? PADDING + 15 : fretX(pos.fret) - FRET_WIDTH / 2;
          const color = ROLE_COLORS[pos.note.role];
          const size = ROLE_SIZE[pos.note.role];
          const label =
            displayMode === "name" ? pos.note.noteName : pos.note.degreeLabel;
          const isRoot = pos.note.role === "root";
          const isGuide =
            pos.note.role === "guide-3rd" || pos.note.role === "guide-7th";
          const fontSize = size >= 11 ? 10 : 8;
          const textColor =
            pos.note.role === "passing" || pos.note.role === "avoid"
              ? "#fff"
              : "#000";
          return (
            <g key={`n-${i}`}>
              <circle
                cx={cx}
                cy={cy}
                r={size}
                fill={color}
                stroke={isRoot ? "#fff" : isGuide ? "#fff" : undefined}
                strokeWidth={isRoot ? 2 : isGuide ? 1 : undefined}
              />
              {size >= 9 ? (
                <text
                  x={cx}
                  y={cy + (fontSize === 10 ? 3.5 : 2.8)}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fontWeight="bold"
                  fill={textColor}
                >
                  {label}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* フレット番号 */}
        {[3, 5, 7, 9, 12].map((f) => (
          <text
            key={`fn-${f}`}
            x={fretX(f) - FRET_WIDTH / 2}
            y={height - 6}
            textAnchor="middle"
            fontSize={10}
            fill="#888"
          >
            {f}
          </text>
        ))}
      </svg>
    </div>
  );
}
