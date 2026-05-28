"use client";

import type { DisplayMode } from "@/types/scale";

interface Props {
  isPlaying: boolean;
  canPlay: boolean;
  bpm: number;
  useSampler: boolean;
  displayMode: DisplayMode;
  audioMode?: boolean; // 実音源モード：音源切替・テンポは固定なので非表示
  onTogglePlay: () => void;
  onReset: () => void;
  onChangeBpm: (bpm: number) => void;
  onChangeSampler: (useSampler: boolean) => void;
  onChangeDisplayMode: (mode: DisplayMode) => void;
}

export default function PlaybackControls({
  isPlaying,
  canPlay,
  bpm,
  useSampler,
  displayMode,
  audioMode = false,
  onTogglePlay,
  onReset,
  onChangeBpm,
  onChangeSampler,
  onChangeDisplayMode,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onTogglePlay}
          disabled={!canPlay}
          className="inline-flex items-center gap-1.5 rounded-3xl bg-amber-400 px-5 py-3 text-[13px] font-bold text-black transition-transform active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
        >
          {isPlaying ? "⏸ 停止" : "▶ 再生"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-3xl bg-neutral-800 px-5 py-3 text-[13px] font-bold text-white transition-transform active:scale-95"
        >
          ↺ リセット
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {!audioMode ? (
          <>
            <span className="text-[11px] text-neutral-400">音源</span>
            <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900 p-[3px]">
              <button
                type="button"
                onClick={() => onChangeSampler(true)}
                className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
                  useSampler ? "bg-amber-400 text-black" : "text-neutral-400"
                }`}
              >
                🎹 ピアノ
              </button>
              <button
                type="button"
                onClick={() => onChangeSampler(false)}
                className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
                  !useSampler ? "bg-amber-400 text-black" : "text-neutral-400"
                }`}
              >
                🥁 クリック
              </button>
            </div>
          </>
        ) : null}

        <span className="ml-2 text-[11px] text-neutral-400">表示</span>
        <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900 p-[3px]">
          <button
            type="button"
            onClick={() => onChangeDisplayMode("degree")}
            className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
              displayMode === "degree" ? "bg-amber-400 text-black" : "text-neutral-400"
            }`}
          >
            度数
          </button>
          <button
            type="button"
            onClick={() => onChangeDisplayMode("name")}
            className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
              displayMode === "name" ? "bg-amber-400 text-black" : "text-neutral-400"
            }`}
          >
            音名
          </button>
        </div>
      </div>

      {!audioMode ? (
        <div>
          <div className="mb-1.5 flex justify-between text-[11px]">
            <span>テンポ</span>
            <span className="font-mono">{bpm} BPM</span>
          </div>
          <input
            type="range"
            min={40}
            max={200}
            value={bpm}
            onChange={(e) => onChangeBpm(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
      ) : (
        <div className="text-[11px] text-neutral-500">
          🎵 実音源（{bpm} BPM 固定）に合わせて再生・ハイライトします。
        </div>
      )}
    </div>
  );
}
