"use client";

import { useCallback, useRef, useState } from "react";
import * as Tone from "tone";

export type SamplerStatus = "idle" | "loading" | "ready" | "error";

export function usePianoSampler() {
  const samplerRef = useRef<Tone.Sampler | null>(null);
  const fallbackCtxRef = useRef<AudioContext | null>(null);
  const [status, setStatus] = useState<SamplerStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const init = useCallback(async () => {
    if (samplerRef.current || status === "loading") return;
    setStatus("loading");
    setError(null);
    try {
      await Tone.start();
      await new Promise<void>((resolve, reject) => {
        const sampler = new Tone.Sampler({
          urls: {
            A0: "A0.mp3",
            C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3", A1: "A1.mp3",
            C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3", A2: "A2.mp3",
            C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3", A3: "A3.mp3",
            C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", A4: "A4.mp3",
            C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3", A5: "A5.mp3",
          },
          release: 1.5,
          baseUrl: "https://tonejs.github.io/audio/salamander/",
          onload: () => resolve(),
          onerror: (e) => reject(e),
        }).toDestination();
        sampler.volume.value = -8;
        samplerRef.current = sampler;
      });
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "音源の読み込みに失敗しました");
      setStatus("error");
    }
  }, [status]);

  const playChord = useCallback((notes: string[], duration = 0.95) => {
    const sampler = samplerRef.current;
    if (!sampler) return;
    try {
      sampler.triggerAttackRelease(notes, duration);
    } catch {
      /* noop */
    }
  }, []);

  const releaseAll = useCallback(() => {
    try {
      samplerRef.current?.releaseAll();
    } catch {
      /* noop */
    }
  }, []);

  // クリック音フォールバック（音源ロード前/失敗時）
  const playClick = useCallback((accent: boolean) => {
    try {
      if (!fallbackCtxRef.current) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        fallbackCtxRef.current = new Ctor();
      }
      const ctx = fallbackCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = accent ? 1500 : 1000;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      /* noop */
    }
  }, []);

  return { status, error, init, playChord, releaseAll, playClick };
}
