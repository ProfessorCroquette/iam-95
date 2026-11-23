export interface Track {
  title: string;
  artist: string;
  src: string;
  album?: string;
  duration?: number;    // seconds, like 225
  bitrate?: number;     // kbps, like 320
  sampleRate?: number;  // Hz, like 44100
}