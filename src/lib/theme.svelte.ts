export const THEMES = [
  { id: 'vaporwave95', name: 'Vaporwave95' },
  { id: 'win95-blue', name: 'Win95 Blue' },
  { id: 'citypop', name: 'Citypop' },
  { id: 'win98', name : 'Win98'},
  { id: 'vaporwave95v2', name: 'VaporwaveV2'},
  { id: 'vaporwavev3', name: 'VaporwaveV3'}
] as const;

class Theme {
  id = $state<string>('vaporwave95');

  constructor() {
    let saved: string | null = null;
    try { saved = localStorage.getItem('theme'); } catch {}
    this.set(THEMES.some((t) => t.id === saved) ? saved! : 'vaporwave95');
  }

  get name() {
    return THEMES.find((t) => t.id === this.id)?.name ?? '';
  }

  set(id: string) {
    this.id = id;
    document.documentElement.dataset.theme = id;   // <html data-theme="...">
    try { localStorage.setItem('theme', id); } catch {}
  }

  next() {
    const i = THEMES.findIndex((t) => t.id === this.id);
    this.set(THEMES[(i + 1) % THEMES.length].id);
  }
}

export const theme = new Theme();