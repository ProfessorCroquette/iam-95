<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import TitleBar from "../lib/components/TitleBar.svelte";
  import AppWindow from "../lib/components/AppWindow.svelte";
  import Crt from "$lib/components/Crt.svelte";
  import { player } from "$lib/player.svelte";
  import Transport from "$lib/components/Transport.svelte";
  import Playlist from "$lib/components/Playlist.svelte";
  import StatuBar from "$lib/components/StatuBar.svelte";

  const appWindow = getCurrentWindow();
  
</script>

<AppWindow>
<div class = "win-95-body">
  <TitleBar
    title="Ｉam９５．ｅｘｅ"
    onminimize={() => appWindow.minimize()}
    onclose={() => appWindow.close()}
  />

  
 
  <Crt />
  <Transport />
  <Playlist />
  <StatuBar />
  </div>
</AppWindow>
