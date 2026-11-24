<script lang="ts">
    import { player } from "$lib/player.svelte";
    
    const hasTrack = $derived(player.index !== -1);
    const volPct = $derived(player.volume * 100);
  const repeatIcon = $derived(player.repeat === 'one' ? '⟳' : '↻');
  let dragging = $state(false);
  let dragValue = $state(0);
  const shown = $derived(dragging ? dragValue : player.time);
  const pct = $derived(player.duration ? (shown / player.duration) * 100 : 0);

  // scrolling title: slide only when the text is wider than its box
  let boxW = $state(0);
  let textW = $state(0);
  const shift = $derived(Math.min(0, boxW - textW));
  const label = $derived(player.error || player.isPlaying);


</script>


 <input
    class="win-95-slider"
    type="range"
    min="0"
    max={player.duration}
    step="0.1"
    value={shown}
    disabled={!player.duration}
    aria-label="Seek"
    style="--pct: {pct}%"
    oninput={(e) => {
      dragging = true;
      dragValue = +e.currentTarget.value;
    }}
    onchange={(e) => {
      player.seek(+e.currentTarget.value);
      dragging = false;
    }}
  />
<div class="win-95-transport">
  <button class="win-95-btn" onclick={() => player.addFolder()} disabled={player.scanning} aria-label="Add folder">
    {player.scanning ? '…' : '⏏'}
  </button>
  <button class="win-95-btn" onclick={() => player.prev()} disabled={!hasTrack} aria-label="Previous">◀◀</button>
  <button class="win-95-btn" onclick={() => player.toggle()} aria-label={player.isPlaying ? 'Pause' : 'Play'}>
    {player.isPlaying ? '❚❚' : '▶'}
  </button>
  <button class="win-95-btn" onclick={() => player.next()} disabled={!hasTrack} aria-label="Next">▶▶</button>
  <button
    class="win-95-btn"
    onclick={() => player.cycleRepeat()}
    aria-pressed={player.repeat !== 'off'}
    aria-label="Repeat: {player.repeat}"
  >{repeatIcon}</button>

  <input
    class="win-95-slider win-95-volume"
    type="range" min="0" max="1" step="0.01"
    value={player.volume}
    style="--pct: {volPct}%"
    oninput={(e) => player.setVolume(+e.currentTarget.value)}
    aria-label="Volume"
  />

  
</div>

<style>
  .win-95-slider:not(.win-95-volume) {
    display: block;
    width: 65%;        /* Adjust width (e.g., 65% or 160px) */
    margin: 0 auto;    /* Centers the slider horizontally */
  }
</style>


