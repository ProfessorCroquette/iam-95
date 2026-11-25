export function fmt(seconds?: number): string {
  if (seconds === undefined || !Number.isFinite(seconds)) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function fmtBitrate(kbps?: number): string {
  if (kbps === undefined || !Number.isFinite(kbps)) return 'WinErr: 404';
  return `${Math.round(kbps)} kbps`;
}

export function fmtSampleRate(Hz?: number): string {
    if (Hz === undefined || !Number.isFinite(Hz)) return 'WinErr: 404';
    return `${(Hz / 1000)} kHz`;
}