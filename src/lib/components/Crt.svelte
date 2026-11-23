<script lang="ts">
  import type { Track } from '$lib/types';
  import { fmt, fmtBitrate, fmtSampleRate } from '$lib/fmt';

  let {
    track = null,
    isPlaying = false,
    currentTime = 0
  }: {
    track?: Track | null;
    isPlaying?: boolean;
    currentTime?: number;
  } = $props();
</script>

<div class="win-95-display">
  <div class="win-95-display-row">
    <p class="win-95-display-label">{isPlaying ? 'ＮＯＷ　ＰＬＡＹＩＮＧ' : 'ＩＮＳＥＲＴ　ＤＩＳＣ'}</p>
    <p class="win-95-display-time">{fmt(currentTime)} ／ {track ? fmt(track.duration) : '00:00'}</p>
  </div>
  {#if track}
    <div class="win-95-display-main">
      <div class="win-95-display-text">
        <p class="win-95-display-track">{track.title}</p>
        <p class="win-95-display-info">{track.artist}　・　{track.album ?? 'ＳＩＮＧＬＥ'}</p>
        <p class="win-95-display-info">{fmtBitrate(track.bitrate)}　・　{fmtSampleRate(track.sampleRate)}</p>
      </div>
    </div>
  {/if}
</div>
