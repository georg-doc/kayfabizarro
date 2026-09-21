/* Quellen. Jede URL ist ein GitHub-SourceRef mit Pin — der POC kopiert keine Modelle.
   Die Pins stehen in data/actors.json; hier nur die Umrechnung Pfad → URL. */

export const REPO = 'georg-doc/kayfabizarro';

/* Module über jsDelivr, Daten über raw — Regel aus EMBED_KFB_RIGS_v3.md §1:
   raw liefert JS als text/plain, als Modul geladen ergibt das einen schwarzen Bildschirm. */
export const EMBED_BASE = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/kfb-rigs-embed-v3/';

export const raw = (commit, path) =>
  `https://raw.githubusercontent.com/${REPO}/${commit}/${path.split('/').map(encodeURIComponent).join('/')}`;

export const PACK_ROOT = 'media/3D_Assets/Platformer Game Kit - Dec 2021/';

/* Belegte Ladevorgänge — Grundlage des EXPORT_MANIFEST-Feldes "loaded". */
export const loadLog = new Map(); // path -> { ok, ms, bytesUnknown:true, error }
