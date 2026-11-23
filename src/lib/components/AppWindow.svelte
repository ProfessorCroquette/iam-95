<script lang="ts">
    import type { Snippet } from "svelte";
    let { children }: {children: Snippet} = $props();
</script>

<div class="win-95-window">
  {@render children()}
</div>