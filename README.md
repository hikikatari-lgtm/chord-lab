# 🎸 Chord Lab

「プロの頭の中を視覚化する」ギター学習アプリ。
コード進行を再生すると、各コードに応じてフレットボード上のアルペジオ/スケール構成音が自動で切り替わり、音の役割を色分け表示。Tone.js のピアノ音源でコードの響きと一緒に体感できます。

## 主な機能

- コード進行追従表示（再生に合わせてフレットボードが自動更新）
- コードごとのスケール切替（モード／HM・MM系／ペンタ／シンメトリック／アルペジオ）
- キー移調（全12キー / 半音± / 原Keyリセット）
- テンション役割の色分け＋凡例、音名/度数トグル
- ピアノ音源（Tone.js Sampler）⟷ クリック音、単発試聴

## 開発

```bash
npm install
npm run dev
```

http://localhost:3000

## デプロイ

`main` ブランチに push すると Vercel が自動デプロイ。

## 関連プロジェクト

- [Fret Lab](https://fret-lab.vercel.app) — バッキング＋スケール（デザイン踏襲元）
- [Key Lab](https://key-lab-kappa.vercel.app) — ピアノ版
- [Song Master](https://song-master-mu.vercel.app) — 楽器別の楽曲教材
