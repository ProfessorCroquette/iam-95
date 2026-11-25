<script lang="ts">
  import { player } from "$lib/player.svelte";
  import { fmtTotal } from "$lib/fmt";
  import { theme } from "$lib/theme.svelte";

  const total = $derived(player.tracks.reduce((sum, t) => sum + (t.duration ?? 0), 0));
</script>

<div class="win-95-status">
  <span>{player.tracks.length} ｔｒａｃｋｓ</span>
  <span>{fmtTotal(total)}</span>
  <button class="win-95-btn" aria-label="Change theme" onclick={() => theme.next()}>
    {theme.name}
  </button>
</div>