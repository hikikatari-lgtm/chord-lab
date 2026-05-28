# Chord Lab

「プロの頭の中を視覚化する」ギター学習アプリ。
コード進行を再生すると、各コードに応じてフレットボード上のアルペジオ/スケール構成音が自動で切り替わる。音の役割（ルート/ガイドトーン/テンション/経過音）を色分けし、Tone.js のピアノ音源でコードの響きと一緒に体感できる。

## 技術スタック
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Tone.js（npm版・Salamander Grand Piano サンプラー）
- Vercel デプロイ（GitHub連携、mainにpushで自動デプロイ）

## プロジェクト構成
```
src/
  app/
    layout.tsx
    page.tsx                       # トップ（プリセット一覧）
    progressions/[id]/
      page.tsx                     # 進行詳細（Server Component）
      ProgressionView.tsx          # 詳細のClient部分（全状態を集約）
  components/
    PresetCard / ProgressionBar / ChordDisplay / ChordFretboard
    FretboardLegend / KeySelector / ScaleSelector / PlaybackControls / AudioStatus
  hooks/
    usePianoSampler.ts             # Tone.js Sampler管理（lazy init / フォールバック）
    useProgressionPlayback.ts      # 再生ロジック（setInterval, コード追従）
  lib/
    notes / chords / scales / recommendedScales / noteRoles / fretboard / voicing
  types/
    chord.ts / scale.ts
  data/
    presets.ts                     # コード進行プリセット（ここに追記）
```

## コンセプト
- コード進行追従表示（再生に合わせて現在コードがハイライト、フレットボード自動更新）
- 各コードで使うスケールを個別に切替（scaleOverrides）
- キー移調（12キー / 半音± / 原Keyリセット）
- テンション役割の色分け（ルート=黄・3度=赤・7度=緑・5度=青・テンション=シアン/紫・経過音=グレー）
- 音名/度数トグル、ピアノ⟷クリック音切替、試聴

## 重要な実装方針
- Tone.js は npm 版を `import * as Tone from "tone"`（CDNエラー回避）
- 音源ロードはユーザー操作起点で `Tone.start()` → Sampler 初期化（iOS Safari対策）
- ロード失敗時はクリック音にフォールバック

## プリセット追加
`src/data/presets.ts` の `PRESETS` に `ChordProgression` を追加。各コードに `defaultScale` を設定。

## デプロイ
git push origin main で Vercel が自動デプロイ。

## 関連プロジェクト
- Fret Lab: https://fret-lab.vercel.app （バッキング＋スケール／デザイン踏襲元）
- Key Lab: https://key-lab-kappa.vercel.app （ピアノ版）
- Song Master: https://song-master-mu.vercel.app

@AGENTS.md
