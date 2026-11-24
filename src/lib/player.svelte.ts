import type { Track } from "./types";
import { convertFileSrc } from "@tauri-apps/api/core";

type RepeatMode = "off" | "one" | "all";
type Status = "idle" | "scanning" | "playing" | "paused";

class Player {
  // --- state: things that change ---
  tracks = $state<Track[]>([]);
  index = $state(-1);
  time = $state(0);
  loadedDuration = $state(0);
  isPlaying = $state(false);
  scanning = $state(false);
  error = $state("");
  repeat = $state<RepeatMode>("all");
  volume = $state(1);

  #audio = new Audio();

  // --- derived: calculated from the state above ---
  current = $derived(this.tracks[this.index]);
  duration = $derived(this.loadedDuration || this.current?.duration || 0);
  status: Status = $derived(
    this.scanning
      ? "scanning"
      : !this.current
        ? "idle"
        : this.isPlaying
          ? "playing"
          : "paused",
  );
  constructor() {
    const a = this.#audio;
    a.volume = this.volume;
    a.onplay = () => (this.isPlaying = true);
    a.onpause = () => (this.isPlaying = false);
    a.ontimeupdate = () => (this.time = a.currentTime);
    a.onloadedmetadata = () => {
      if (Number.isFinite(a.duration)) this.loadedDuration = a.duration;
    };
    // 1. Update onended to call your new private method
    a.onended = () => this.#handleEnded();
    a.onerror = () => (this.error = "Could not load this file");
  }

  play(i: number) {
    if (i < 0 || i >= this.tracks.length) return;
    this.index = i;
    this.time = 0;
    this.loadedDuration = 0;
    this.error = "";
    this.#audio.src = convertFileSrc(this.tracks[i].src);
    this.#audio.play().catch(() => {
      this.error = "Playback failed";
    });
  }

  toggle() {
    if (this.index === -1) {
      this.play(0);
      return;
    }
    if (this.#audio.paused) {
      this.#audio.play().catch(() => {
        this.error = "Playback failed";
      });
    } else {
      this.#audio.pause();
    }
  }

  seek(t: number) {
    const max = this.duration || t;
    const clamped = Math.min(Math.max(t, 0), max);
    this.#audio.currentTime = clamped;
    this.time = clamped;
  }

  setVolume(v: number) {
    const clamped = Math.min(Math.max(v, 0), 1);
    this.volume = clamped;
    this.#audio.volume = clamped;
  }

  next() {
    if (this.tracks.length === 0) return;
    this.play(this.index + 1); //Play next
  }

  prev() {
    if (this.tracks.length === 0) return;
    if (this.time > 3 || this.index <= 0) {
      this.seek(0);
    } else {
      this.play(this.index - 1);
    }
  }

  cycleRepeat() {
    const order: RepeatMode[] = ["off", "all", "one"];
    this.repeat = order[(order.indexOf(this.repeat) + 1) % order.length];
  }

  #handleEnded() {
    if (this.tracks.length === 0) return;

    if (this.repeat === "one") {
      this.#audio.currentTime = 0;
      this.time = 0;
      this.#audio.play().catch(() => {
        this.error = "Playback failed";
      });
    } else if (this.repeat === "all") {
      const nextIndex = (this.index + 1) % this.tracks.length;
      this.play(nextIndex);
    } else if (this.repeat === "off") {
      this.next();
    }
  }
}

export const player = new Player();
