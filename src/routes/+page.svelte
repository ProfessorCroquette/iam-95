<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import TitleBar from "../lib/components/TitleBar.svelte";
  import AppWindow from "../lib/components/AppWindow.svelte";
  import Crt from "$lib/components/Crt.svelte";

  const appWindow = getCurrentWindow();
</script>

<AppWindow>
  <TitleBar
    title="ＩＡＭ９５．ｅｘｅ//アイ アム エクス"
    onminimize={() => appWindow.minimize()}
    onclose={() => appWindow.close()}
  />
  <Crt />
</AppWindow>
