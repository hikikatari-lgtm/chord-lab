"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ChordProgression } from "@/types/chord";
import type { DisplayMode } from "@/types/scale";
import { useProgressionPlayback } from "@/hooks/useProgressionPlayback";
import { transposeNote } from "@/lib/notes";
import AudioStatus from "@/components/AudioStatus";
import ProgressionBar from "@/components/ProgressionBar";
import ChordChart from "@/components/ChordChart";
import ChordDisplay from "@/components/ChordDisplay";
import ChordFretboard from "@/components/ChordFretboard";
import FretboardLegend from "@/components/FretboardLegend";
import KeySelector from "@/components/KeySelector";
import ScaleSelector from "@/components/ScaleSelector";
import PlaybackControls from "@/components/PlaybackControls";

function getTransposedKey(p: ChordProgression, semitones: number): string {
  if (semitones === 0) return p.key;
  const base = p.isMinor ? p.key.replace("m", "") : p.key;
  const t = transposeNote(base, semitones);
  return p.isMinor ? `${t}m` : t;
}

export default function ProgressionView({
  progression,
}: {
  progression: ChordProgression;
}) {
  const {
    sampler,
    currentIndex,
    isPlaying,
    bpm,
    transposeSemitones,
    useSampler,
    transposedChords,
    setBpm,
    setTransposeSemitones,
    setUseSampler,
    togglePlay,
    reset,
    jumpTo,
    previewCurrent,
  } = useProgressionPlayback({ progression });

  const [displayMode, setDisplayMode] = useState<DisplayMode>("name");
  // 各コードのスケール上書き（キー: 元のコードindex）
  const [scaleOverrides, setScaleOverrides] = useState<Record<number, string>>(
    {},
  );

  const currentChord = transposedChords[currentIndex];
  const currentScaleId =
    scaleOverrides[currentIndex] ??
    progression.chords[currentIndex]?.defaultScale ??
    "arpeggio";

  const transposedKey = useMemo(
    () => getTransposedKey(progression, transposeSemitones),
    [progression, transposeSemitones],
  );

  // マウント時にピアノ音源を先読み（再生ボタン押下時に即鳴るように）
  useEffect(() => {
    sampler.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 再生ボタンは常に押下可能。ピアノ未ロードなら押下時に読み込んでから再生する
  const canPlay = true;

  const handleChangeScale = (scaleId: string) => {
    setScaleOverrides((prev) => ({ ...prev, [currentIndex]: scaleId }));
  };

  const handleChangeKey = (semitones: number) => {
    setTransposeSemitones(((semitones % 12) + 12) % 12);
    reset();
  };

  const handleChangeSampler = (next: boolean) => {
    setUseSampler(next);
    if (next && sampler.status === "idle") sampler.init();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4">
      <Link href="/" className="mb-3 inline-block text-[13px] text-amber-400">
        ← 一覧に戻る
      </Link>

      <div className="text-[22px] font-bold">{progression.title}</div>
      <div className="mb-2.5 mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-neutral-800 px-2 py-0.5 font-mono text-[11px]">
          原Key {progression.key}
        </span>
        {transposeSemitones !== 0 ? (
          <span className="rounded-md bg-green-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-green-400">
            → {transposedKey}
          </span>
        ) : null}
        <span className="rounded-md bg-neutral-800 px-2 py-0.5 font-mono text-[11px]">
          BPM {bpm}
        </span>
        <span className="rounded-md bg-amber-400/20 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-amber-400">
          {progression.category}
        </span>
      </div>
      <div className="mb-2 text-xs leading-relaxed text-neutral-400">
        {progression.description}
      </div>
      {progression.tip ? (
        <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/[0.08] px-2.5 py-2.5 text-[11px] leading-relaxed text-amber-200">
          💡 {progression.tip}
        </div>
      ) : null}

      <AudioStatus
        status={sampler.status}
        error={sampler.error}
        onLoad={sampler.init}
      />

      <section className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3.5">
        <div className="mb-2 text-[11px] text-neutral-400">🎹 キー</div>
        <KeySelector
          progression={progression}
          transposeSemitones={transposeSemitones}
          onChange={handleChangeKey}
        />
      </section>

      <section className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3.5">
        <div className="mb-2 text-[11px] text-neutral-400">
          🎼 コード進行 <span className="text-neutral-600">- タップでジャンプ</span>
        </div>
        <ProgressionBar
          chords={transposedChords}
          currentIndex={currentIndex}
          onJump={jumpTo}
        />
      </section>

      {progression.chordChart ? (
        <section className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3.5">
          <div className="mb-2 text-[11px] text-neutral-400">
            🎼 コード譜{" "}
            <span className="text-neutral-600">- タップでジャンプ</span>
          </div>
          <ChordChart
            rows={progression.chordChart.rows}
            repeat={progression.chordChart.repeat}
            chords={transposedChords}
            currentIndex={currentIndex}
            onJump={jumpTo}
          />
        </section>
      ) : null}

      <section className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3.5">
        <ChordDisplay
          chord={currentChord}
          scaleId={currentScaleId}
          onPreview={previewCurrent}
        />
      </section>

      <section className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3.5">
        <div className="mb-2 text-[11px] text-neutral-400">
          🎼 このコードで使うスケール
        </div>
        <ScaleSelector
          quality={currentChord.quality}
          value={currentScaleId}
          onChange={handleChangeScale}
        />
      </section>

      <section className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3.5">
        <PlaybackControls
          isPlaying={isPlaying}
          canPlay={canPlay}
          bpm={bpm}
          useSampler={useSampler}
          displayMode={displayMode}
          onTogglePlay={togglePlay}
          onReset={reset}
          onChangeBpm={setBpm}
          onChangeSampler={handleChangeSampler}
          onChangeDisplayMode={setDisplayMode}
        />
      </section>

      <section className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3.5">
        <div className="mb-2 text-[11px] text-neutral-400">
          🎸 フレットボード{" "}
          <span className="text-neutral-600">- 横スクロール可</span>
        </div>
        <ChordFretboard
          chord={currentChord}
          scaleId={currentScaleId}
          displayMode={displayMode}
        />
        <FretboardLegend />
      </section>
    </div>
  );
}
