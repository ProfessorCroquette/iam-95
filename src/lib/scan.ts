import { readDir, readFile } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import { parseBuffer } from 'music-metadata';
import type { Track } from './types';

const AUDIO_EXTENSIONS = ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'opus'];
const SCAN_DELAY_MS = 40;

function extensionOf(name: string): string {
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex === -1 || dotIndex === name.length - 1) return '';
  return name.slice(dotIndex + 1).toLowerCase();
}

function titleFromName(name: string): string {
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex <= 0) return name;
  return name.slice(0, dotIndex);
}

function fileNameOf(path: string): string {
  const lastBackslash = path.lastIndexOf('\\');
  const lastSlash = path.lastIndexOf('/');
  const cut = Math.max(lastBackslash, lastSlash);
  return path.slice(cut + 1);
}

async function readTrack(path: string): Promise<Track> {
  const fallback: Track = {
    title: titleFromName(fileNameOf(path)),
    artist: 'WinErr: 404',
    src: path,
  };

  try {
    const bytes = await readFile(path);
    const meta = await parseBuffer(bytes);
    return {
      title: meta.common.title ?? fallback.title,
      artist: meta.common.artist ?? fallback.artist,
      album: meta.common.album,
      duration: meta.format.duration,
      bitrate:
        meta.format.bitrate === undefined
          ? undefined
          : Math.round(meta.format.bitrate / 1000),
      sampleRate: meta.format.sampleRate,
      src: path,
    };
  } catch (err) {
    console.warn('Could not read tags', path, err);
    return fallback;
  }
}

async function listAudioFiles(dir: string): Promise<string[]> {
  const entries = await readDir(dir);
  return entries
    .filter((e) => e.isFile && AUDIO_EXTENSIONS.includes(extensionOf(e.name)))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export async function scanFolder(
  dir: string,
  onProgress?: (done: number, total: number, name: string) => void
): Promise<Track[]> {
  const names = await listAudioFiles(dir);
  const tracks: Track[] = [];

  for (const name of names) {
    const path = await join(dir, name);
    tracks.push(await readTrack(path));
    onProgress?.(tracks.length, names.length, name);
    await new Promise((resolve) => setTimeout(resolve, SCAN_DELAY_MS));
  }

  return tracks;
}