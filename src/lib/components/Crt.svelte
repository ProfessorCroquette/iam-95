<script lang="ts">
  import { fmt, fmtBitrate, fmtSampleRate } from '$lib/fmt';
  import { player } from '$lib/player.svelte';

  const LABELS = {
    idle: 'ＩＤＬＥ',
    scanning: 'ＳＣＡＮＮＩＮＧ　ＦＩＬＥＳ...',
    playing: '▶ ＮＯＷ　ＰＬＡＹＩＮＧ',
    paused: '⏸ ＰＡＵＳＥＤ'
  };

  const label = $derived(
    player.status === 'scanning'
      ? `ＳＣＡＮＮＩＮＧ ${player.scanDone}／${player.scanTotal}`
      : LABELS[player.status]
  );

  // Only flicker while scanning
  const isFlickering = $derived(player.status === 'scanning');

  const REPEATS = {
    off: '',
    one: 'ＲＥＰＥＡＴ　ＯＮＣＥ',
    all: 'ＲＥＰＥＡＴ　ＡＬＬ'
  };
</script>


<div class="win-95-display">
  <div class="win-95-display-row">
    <p class="win-95-display-label" class:flicker={isFlickering}>
      {label}
    </p>
    <p class="win-95-display-info" style="font-size: 0.50rem;">{REPEATS[player.repeat]}</p>
    <p class="win-95-display-time">{fmt(player.time)} ／ {fmt(player.duration)}</p>
  </div>

  <div class="win-95-display-main">
    <div class="win-95-display-text">
      {#if player.current}
        <p class="win-95-display-track">
          {player.current.title} - {player.current.artist}
        </p>
        <p class="win-95-display-info">{player.current.album ?? 'ＳＩＮＧＬＥ'}</p>
        <p class="win-95-display-info">
          {fmtBitrate(player.current.bitrate)} ・ {fmtSampleRate(player.current.sampleRate)}
        </p>
      {:else}
        <p class="win-95-display-track">
          ɪɴꜱᴇʀᴛ ᴅɪꜱᴄ<span class="dots" aria-hidden="true"><span>  ．</span><span>．</span><span>．</span></span>
        </p>
      {/if}
    </div>
  </div>
</div>

<style>
  .flicker {
  animation: crt-flicker 2.8s infinite;
  text-shadow:
    0.6px 0 0 rgba(255, 0, 60, 0.45),
    -0.6px 0 0 rgba(0, 255, 255, 0.45),
    0 0 6px currentColor;
}

@keyframes crt-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    opacity: 1;
    transform: translate(0, 0);
    text-shadow:
      0.6px 0 0 rgba(255, 0, 60, 0.45),
      -0.6px 0 0 rgba(0, 255, 255, 0.45),
      0 0 6px currentColor;
  }

  /* Quick double voltage dip */
  20%, 24% {
    opacity: 0.35;
    transform: translate(-0.5px, 0);
    text-shadow: none;
  }

  /* Slight brightness surge */
  22% {
    opacity: 1;
    transform: translate(0.5px, 0);
    text-shadow:
      1.2px 0 0 rgba(255, 0, 60, 0.7),
      -1.2px 0 0 rgba(0, 255, 255, 0.7),
      0 0 10px currentColor;
  }

  /* Brief mid-cycle flutter */
  55% {
    opacity: 0.2;
    transform: translate(0, 0.4px);
    text-shadow: none;
  }
}

</style>
