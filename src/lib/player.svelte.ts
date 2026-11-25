import type { Track } from "./types";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { scanFolder } from "./scan";
import { save, load } from "./storage";

type RepeatMode = "off" | "one" | "all";
type Status = "idle" | "scanning" | "playing" | "paused";

// saved data can be old or damaged, so check it before trusting it
function isTrack(x: unknown): x is Track {
  if (typeof x !== "object" || x === null) return false;
  const t = x as Record<string, unknown>;
  return (
    typeof t.title === "string" &&
    typeof t.artist === "string" &&
    typeof t.src === "string"
  );
}

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
  scanDone = $state(0);
  scanTotal = $state(0);

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
    // 1. restore what was saved last time
    const savedVolume = load("volume");
    if (typeof savedVolume === "number" && savedVolume >= 0 && savedVolume <= 1) {
      this.volume = savedVolume;
    }

    const savedRepeat = load("repeat");
    if (savedRepeat === "off" || savedRepeat === "one" || savedRepeat === "all") {
      this.repeat = savedRepeat;
    }

    const savedTracks = load("tracks");
    if (Array.isArray(savedTracks)) {
      this.tracks = savedTracks.filter(isTrack);
    }

    const savedIndex = load("index");
    if (typeof savedIndex === "number" && savedIndex >= 0 && savedIndex < this.tracks.length) {
      this.index = savedIndex;
    }

    // 2. connect the audio element
    const a = this.#audio;
    a.volume = this.volume;
    a.onplay = () => (this.isPlaying = true);
    a.onpause = () => (this.isPlaying = false);
    a.ontimeupdate = () => (this.time = a.currentTime);
    a.onloadedmetadata = () => {
      if (Number.isFinite(a.duration)) this.loadedDuration = a.duration;
    };
    a.onended = () => this.#handleEnded();
    a.onerror = () => (this.error = "Could not load this file");

    // 3. get the restored song ready, but do not play it
    if (this.index !== -1) {
      a.src = convertFileSrc(this.tracks[this.index].src);
    }
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
    save("index", i);
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

  async addFolder() {
    const dir = await open({ directory: true });
    if (!dir) return;

    this.scanning = true;
    this.scanDone = 0;
    this.scanTotal = 0;
    this.error = "";

    try {
      const found = await scanFolder(dir, (done, total) => {
        this.scanDone = done;
        this.scanTotal = total;
      });
      if (found.length === 0) {
        this.error = "404 NOT FOUND";
        return;
      }
      this.tracks = found;
      save("tracks", found);
      this.play(0);
    } catch {
      this.error = "SOMETHING WICKED HAPPENING";
    } finally {
      this.scanning = false;
    }
  }

  setVolume(v: number) {
    const clamped = Math.min(Math.max(v, 0), 1);
    this.volume = clamped;
    this.#audio.volume = clamped;
    save("volume", clamped);
  }

  next() {
    if (this.tracks.length === 0) return;
    this.play(this.index + 1);
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
    save("repeat", this.repeat);
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

  destroy() {
    this.#audio.pause();
    this.#audio.removeAttribute("src");
    this.#audio.load();
  }
}

export const player = new Player();

// dev only: when this file is hot-replaced, silence the old player
if (import.meta.hot) {
  import.meta.hot.dispose(() => player.destroy());
}