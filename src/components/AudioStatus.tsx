"use client";

import type { SamplerStatus } from "@/hooks/usePianoSampler";

interface Props {
  status: SamplerStatus;
  error: string | null;
  onLoad: () => void;
}

export default function AudioStatus({ status, error, onLoad }: Props) {
  let text: string;
  let cls: string;
  if (status === "error") {
    text = `⚠️ 音源読み込みエラー: ${error ?? ""}（クリック音で再生できます）`;
    cls = "border-red-500/30 bg-red-500/10 text-red-300";
  } else if (status === "loading") {
    text = "🎹 ピアノ音源を読み込み中... (初回のみ・数秒かかります)";
    cls = "border-amber-400/30 bg-amber-400/10 text-amber-200";
  } else if (status === "ready") {
    text = "🎹 ピアノ音源 準備完了 - 再生ボタンを押してください";
    cls = "border-green-500/30 bg-green-500/10 text-green-300";
  } else {
    text = "🎹 「音源を読み込む」ボタンを押してください (Wi-Fi推奨)";
    cls = "border-blue-500/30 bg-blue-500/10 text-blue-300";
  }

  return (
    <div className="mb-3">
      <div className={`rounded-lg border px-3 py-2.5 text-center text-[11px] ${cls}`}>
        {text}
      </div>
      {status === "idle" ? (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={onLoad}
            className="rounded-[18px] border border-slate-700 bg-slate-800 px-5 py-2.5 text-[13px] text-blue-300"
          >
            🎹 音源を読み込む
          </button>
        </div>
      ) : null}
    </div>
  );
}
