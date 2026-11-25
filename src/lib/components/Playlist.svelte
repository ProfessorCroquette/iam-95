<script lang="ts">
  import { player } from "$lib/player.svelte";
  import { fmt } from "$lib/fmt";

  function scrollOnActive(node: HTMLElement, isActive: boolean) {
    if (isActive) node.scrollIntoView({ behavior: "smooth", block: "nearest" });

    return {
      update(nowActive: boolean) {
        if (nowActive) {
          node.scrollIntoView({ behavior: "auto", block: "nearest" });
        }
      }
    };
  }
</script>

<div class="win-95-list">
  <ul>
    {#each player.tracks as t, i (t.src)}
      <li
        use:scrollOnActive={i === player.index}
        class="win-95-list-row"
        class:is-active={i === player.index}
        role="button"
        tabindex="0"
        ondblclick={() => player.play(i)}
        onkeydown={(e) => e.key === "Enter" && player.play(i)}
      >
        <span>{i + 1}.</span>
        <span>{t.artist} - {t.title}</span>
        <span>{fmt(t.duration)}</span>
      </li>
    {:else}
      <li class="win-95-list-empty">Click ⏏ to add a music folder…</li>
    {/each}
  </ul>
</div>
