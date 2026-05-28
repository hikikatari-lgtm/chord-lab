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
  // 実音源モード用
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioSyncRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCountRef = useRef<number | null>(null);
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

  const isAudioMode = !!progression.audio;

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

  // 実音源の currentTime から現在の小節（コード）とカウントイン拍を同期する
  const audioTick = useCallback(() => {
    const el = audioElRef.current;
    const prog = progRef.current;
    if (!el || !prog.audio) return;
    if (el.ended) {
      if (audioSyncRef.current) clearInterval(audioSyncRef.current);
      audioSyncRef.current = null;
      lastCountRef.current = null;
      setCountIn(null);
      setIsPlaying(false);
      setCurrentIndex(0);
      return;
    }
    const beatDurSec = 60 / prog.bpm;
    const countInBeats = (prog.audio.countInBars ?? 0) * 4;
    const countInSec = countInBeats * beatDurSec;
    const t = el.currentTime;
    if (t < countInSec) {
      const beat = Math.min(countInBeats, Math.floor(t / beatDurSec) + 1);
      if (lastCountRef.current !== beat) {
        lastCountRef.current = beat;
        setCountIn(beat);
      }
      if (stateRef.current.currentIndex !== 0) setCurrentIndex(0);
    } else {
      if (lastCountRef.current !== null) {
        lastCountRef.current = null;
        setCountIn(null);
      }
      const totalBeats = prog.chords.reduce((s, c) => s + (c.beats || 4), 0);
      let b = ((t - countInSec) / beatDurSec) % totalBeats;
      let idx = prog.chords.length - 1;
      for (let i = 0; i < prog.chords.length; i++) {
        const cb = prog.chords[i].beats || 4;
        if (b < cb) {
          idx = i;
          break;
        }
        b -= cb;
      }
      if (stateRef.current.currentIndex !== idx) setCurrentIndex(idx);
    }
  }, []);

  const ensureAudioEl = useCallback(() => {
    if (!audioElRef.current && progRef.current.audio) {
      const a = new Audio(progRef.current.audio.url);
      a.preload = "auto";
      audioElRef.current = a;
    }
    return audioElRef.current;
  }, []);

  const playAudio = useCallback(async () => {
    const el = ensureAudioEl();
    if (!el) return;
    try {
      el.currentTime = 0;
      await el.play();
    } catch {
      /* noop */
    }
    lastCountRef.current = null;
    setIsPlaying(true);
    if (audioSyncRef.current) clearInterval(audioSyncRef.current);
    audioSyncRef.current = setInterval(audioTick, 80);
  }, [audioTick, ensureAudioEl]);

  const stopAudio = useCallback(() => {
    if (audioSyncRef.current) {
      clearInterval(audioSyncRef.current);
      audioSyncRef.current = null;
    }
    const el = audioElRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    lastCountRef.current = null;
  }, []);

  const stop = useCallback(() => {
    clearLoop();
    clearCountIn();
    stopAudio();
    setIsPlaying(false);
    samplerRef.current.releaseAll();
  }, [clearLoop, clearCountIn, stopAudio]);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      stop();
      return;
    }
    // 実音源モード：バッキングトラックを再生し、ハイライトは currentTime に同期
    if (progRef.current.audio) {
      await playAudio();
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
  }, [isPlaying, useSampler, sampler, stop, startLoop, runCountIn, playAudio]);

  const reset = useCallback(() => {
    clearLoop();
    clearCountIn();
    stopAudio();
    setIsPlaying(false);
    setCurrentIndex(0);
    beatCountRef.current = 0;
  }, [clearLoop, clearCountIn, stopAudio]);

  const jumpTo = useCallback(
    (index: number) => {
      // 実音源モード：その小節の頭へシーク
      if (progRef.current.audio) {
        const prog = progRef.current;
        const beatDurSec = 60 / prog.bpm;
        const countInSec = (prog.audio?.countInBars ?? 0) * 4 * beatDurSec;
        let beatsBefore = 0;
        for (let i = 0; i < index; i++) beatsBefore += prog.chords[i].beats || 4;
        const el = audioElRef.current;
        if (el) el.currentTime = countInSec + beatsBefore * beatDurSec;
        setCurrentIndex(index);
        return;
      }
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

  // BPM / 移調が変わったら再生中はループ再構築（カウントイン中・実音源モードは除く）
  useEffect(() => {
    if (isPlaying && !countingInRef.current && !progRef.current.audio) {
      startLoop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, transposeSemitones]);

  // アンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      clearLoop();
      if (countInRef.current) clearTimeout(countInRef.current);
      if (audioSyncRef.current) clearInterval(audioSyncRef.current);
      if (audioElRef.current) audioElRef.current.pause();
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
    isAudioMode,
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
