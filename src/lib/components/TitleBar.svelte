<script lang="ts">
  let { title, onminimize, onclose }: {
    title: string;
    onminimize: () => void;
    onclose: () => void;
  } = $props();
</script>

<div class="win-95-titlebar">
  <div class="win-95-title-drag" data-tauri-drag-region>
    <span data-tauri-drag-region>{title}</span>
  </div>
  <div class="win-95-titlebtns">
    <button class="win-95-titlebtn is-min" aria-label="Minimize" onclick={onminimize}>_</button>
    <button class="win-95-titlebtn" aria-label="Close" onclick={onclose}>×</button>
  </div>
</div>
