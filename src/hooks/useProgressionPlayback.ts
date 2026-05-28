"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import type { ChordProgression } from "@/types/chord";
import { transposeChord } from "@/lib/chords";
import { getChordVoicing } from "@/lib/voicing";
import { usePianoSampler } from "./usePianoSampler";

interface Options {
  progression: ChordProgression;
}

export function useProgressionPlayback({ progression }: Options) {
  const sampler = usePianoSampler();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(progression.bpm);
  const [transposeSemitones, setTransposeSemitones] = useState(0);
  const [useSampler, setUseSampler] = useState(true);
  // カウントイン中に表示する拍数（1〜4）。再生中/停止中は null
  const [countIn, setCountIn] = useState<number | null>(null);

  const beatCountRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countInRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countingInRef = useRef(false);
  // 再生ループから最新の状態を参照するための ref（描画後に同期し、
  // 描画中の ref 書き込みを避ける）
  const stateRef = useRef({ currentIndex, bpm, transposeSemitones, useSampler });
  const samplerRef = useRef(sampler);
  const progRef = useRef(progression);
  useEffect(() => {
    stateRef.current = { currentIndex, bpm, transposeSemitones, useSampler };
    samplerRef.current = sampler;
    progRef.current = progression;
  });

  const transposedChords = progression.chords.map((c) =>
    transposeChord(c, transposeSemitones),
  );

  const soundChord = useCallback(
    (index: number, beatDurationMs: number) => {
      const s = samplerRef.current;
      const prog = progRef.current;
      const chord = transposeChord(
        prog.chords[index],
        stateRef.current.transposeSemitones,
      );
      if (stateRef.current.useSampler && s.isReady()) {
        const beats = chord.beats || 4;
        const dur = ((beats * beatDurationMs) / 1000) * 0.95;
        const { bass, upper } = getChordVoicing(chord);
        s.playChord([bass, ...upper], dur);
      } else {
        s.playClick(true);
      }
    },
    [],
  );

  const clearLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearCountIn = useCallback(() => {
    if (countInRef.current) {
      clearTimeout(countInRef.current);
      countInRef.current = null;
    }
    countingInRef.current = false;
    setCountIn(null);
  }, []);

  // 再生前に4拍のカウントイン（クリック音、1拍目アクセント）を鳴らし、
  // 鳴らし終えたら onDone を実行する
  const runCountIn = useCallback(
    (onDone: () => void) => {
      clearCountIn();
      countingInRef.current = true;
      const beatDurationMs = 60000 / stateRef.current.bpm;
      let beat = 1;
      setCountIn(beat);
      samplerRef.current.playClick(true);
      const tick = () => {
        beat++;
        if (beat > 4) {
          countingInRef.current = false;
          setCountIn(null);
          onDone();
          return;
        }
        setCountIn(beat);
        samplerRef.current.playClick(false);
        countInRef.current = setTimeout(tick, beatDurationMs);
      };
      countInRef.current = setTimeout(tick, beatDurationMs);
    },
    [clearCountIn],
  );

  const startLoop = useCallback(() => {
    clearLoop();
    beatCountRef.current = 0;
    const beatDurationMs = 60000 / stateRef.current.bpm;
    // 先頭コードを即発音
    soundChord(stateRef.current.currentIndex, beatDurationMs);

    intervalRef.current = setInterval(() => {
      const prog = progRef.current;
      const idx = stateRef.current.currentIndex;
      const chordBeats = prog.chords[idx].beats || 4;
      beatCountRef.current++;

      if (beatCountRef.current >= chordBeats) {
        beatCountRef.current = 0;
        const next = (idx + 1) % prog.chords.length;
        setCurrentIndex(next);
        soundChord(next, beatDurationMs);
      } else if (!stateRef.current.useSampler) {
        samplerRef.current.playClick(false);
      }
    }, beatDurationMs);
  }, [clearLoop, soundChord]);

  const stop = useCallback(() => {
    clearLoop();
    clearCountIn();
    setIsPlaying(false);
    samplerRef.current.releaseAll();
  }, [clearLoop, clearCountIn]);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      stop();
      return;
    }
    // ユーザー操作起点で音声コンテキストを解錠（iOS対策）
    try {
      await Tone.start();
    } catch {
      /* noop */
    }
    // ピアノ選択時、未ロードなら読み込み完了まで待ってから再生
    if (useSampler && !sampler.isReady()) {
      await sampler.init();
    }
    setIsPlaying(true);
    runCountIn(() => startLoop());
  }, [isPlaying, useSampler, sampler, stop, startLoop, runCountIn]);

  const reset = useCallback(() => {
    clearLoop();
    clearCountIn();
    setIsPlaying(false);
    setCurrentIndex(0);
    beatCountRef.current = 0;
  }, [clearLoop, clearCountIn]);

  const jumpTo = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      beatCountRef.current = 0;
      // 単発試聴
      if (samplerRef.current.isReady() && stateRef.current.useSampler) {
        const chord = transposeChord(
          progRef.current.chords[index],
          stateRef.current.transposeSemitones,
        );
        const { bass, upper } = getChordVoicing(chord);
        samplerRef.current.playChord([bass, ...upper], 1.5);
      }
    },
    [],
  );

  const previewCurrent = useCallback(async () => {
    try {
      await Tone.start();
    } catch {
      /* noop */
    }
    if (!sampler.isReady()) await sampler.init();
    const chord = transposeChord(
      progRef.current.chords[stateRef.current.currentIndex],
      stateRef.current.transposeSemitones,
    );
    const { bass, upper } = getChordVoicing(chord);
    samplerRef.current.playChord([bass, ...upper], 2);
  }, [sampler]);

  // BPM / 移調が変わったら再生中はループ再構築（カウントイン中は除く）
  useEffect(() => {
    if (isPlaying && !countingInRef.current) startLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, transposeSemitones]);

  // アンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      clearLoop();
      if (countInRef.current) clearTimeout(countInRef.current);
      samplerRef.current.releaseAll();
    };
  }, [clearLoop]);

  // 進行の切り替えは page 側で key={progression.id} により再マウントされ、
  // useState の初期値で自然にリセットされる（アンマウント時に loop も停止）。

  return {
    sampler,
    currentIndex,
    isPlaying,
    countIn,
    bpm,
    transposeSemitones,
    useSampler,
    transposedChords,
    setBpm,
    setTransposeSemitones,
    setUseSampler,
    togglePlay,
    stop,
    reset,
    jumpTo,
    previewCurrent,
  };
}
