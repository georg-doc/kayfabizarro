// Insel-Thema (kfb.island-theme/1, Steuerung 10.10. spät): ONE data file per world, public/themes/island-themes.json, ONE
// owner (this module). An island's biome, sound and (from slice 8) light hang here as data, never hard in the code; the
// palette 6-combo + storyTint follow in Phase F. Lookup: island id → entry, else the file's default.
export interface ThemeSoundRef { id: string; gain: number }
export interface ThemeSprinkle extends ThemeSoundRef { every: [number, number] }
export interface IslandTheme {
  biome: string;
  sound: { bed: ThemeSoundRef[]; sprinkles: ThemeSprinkle[]; cozy: string[]; heuristic: boolean; why: string };
  light: unknown;
}
export interface PinnedFile { path: string; commit: string; gitBlob: string }
export interface ThemeFile {
  schema: 'kfb.island-theme/1';
  repo: string;
  sounds: Record<string, PinnedFile & { use: 'loop' | 'oneshot' }>;
  /** `local`: path under public/ of the private local copy (V-073) — preferred over the pinned repo file */
  cozy: Record<string, PinnedFile & { title: string; artist: string; local?: string }>;
  trackBlobs: Record<string, string>;
  /** per-playlist music level (station · cozy · tape · own) */
  musicGain?: Record<string, number>;
  default: string;
  islands: Record<string, IslandTheme>;
}

let file: ThemeFile | null = null;
export async function loadThemes(url = '/themes/island-themes.json'): Promise<ThemeFile> {
  if (!file) file = await fetch(url, { cache: 'no-store' }).then((r) => { if (!r.ok) throw new Error('island-themes HTTP ' + r.status); return r.json(); });
  return file!;
}
export const themeFor = (f: ThemeFile, islandId: string): IslandTheme & { id: string } => {
  const id = f.islands[islandId] ? islandId : f.default;
  return { id, ...f.islands[id] };
};
/** raw GitHub URL, commit-pinned (the same scheme as HUD R3 rawUrl / song-transport) */
export const rawUrl = (repo: string, f: { commit: string; path: string }) => `https://raw.githubusercontent.com/${repo}/${f.commit}/${f.path.split('/').map(encodeURIComponent).join('/')}`;
