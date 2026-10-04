/* mirror.v1.js — EIN Weg zu den Repo-Assets, an genau zwei Stellen umgeleitet.

   BEFUND (17.8., am Bedienweg gemessen, nicht behauptet):
     raw.githubusercontent .../GLB_cube-pets/animal-bunny.glb  -> 429 in 3154 ms, 199 B Fehlerseite
     jsdelivr @main/...                                        -> 404 "Failed to fetch … from GitHub"
     rawcdn.githack /main/...                                  -> 429 (proxyt raw, reicht sie weiter)
     kayfabizarro.pages.dev/media/3D_Assets/GLB_cube-pets/…    -> 200 in 271 ms, 131 568 B,
                                                                  content-type model/gltf-binary
   Das Repo ist privat, darum darf kein CDN spiegeln — die Cloudflare-Seite (Georgs Hinweis) hat
   denselben Baum unter derselben Pfadstruktur und ist NICHT gedrosselt. Sie ist ab jetzt der
   Hauptweg, raw bleibt der Rückweg.

   ZWEI Engpässe reichen für alles, was die App holt:
     1. `window.fetch`      — Library-JSON, Deck-Registry, PDFs, Persona-Blätter, Texte.
     2. THREE-LoadingManager `setURLModifier` — jeder THREE-Loader (GLB, Texturen) läuft über
        FileLoader/XMLHttpRequest, nicht über fetch. Ohne diesen zweiten Griff bliebe der ganze
        3D-Teil auf der gedrosselten Adresse.
   Die Umleitung ist REIN eine Adress-Umschrift: gleicher Pfad, anderer Wirt. Kein Pfad-Wissen,
   keine Sonderfälle pro Datei — was auf der Seite fehlt, fällt über den Rückweg auf raw zurück.

   RÜCKWEG: `installMirror(THREE, { off: true })` lässt alles unangetastet; `window.__kfbMirror.off()`
   schaltet zur Laufzeit zurück. Beides führt zum Verhalten von vorher (raw direkt).
*/

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const PAGES = 'https://kayfabizarro.pages.dev/';

/** Adress-Umschrift. Gibt null, wenn die Adresse nichts mit dem Repo zu tun hat. */
export function mirrorOf(url) {
  const s = String(url || '');
  return s.startsWith(RAW) ? PAGES + s.slice(RAW.length) : null;
}

export function installMirror(THREE, o) {
  const opt = o || {};
  if (opt.off || (typeof window !== 'undefined' && window.__kfbMirror)) return window.__kfbMirror || null;

  const stats = { hits: 0, falls: 0, xhr: 0 };
  const nativeFetch = window.fetch.bind(window);

  /* Warum ein Rückweg pro Anfrage: die Cloudflare-Seite ist ein SPA — was sie NICHT hat, liefert
     sie als 200 mit text/html (gemessen: eine falsche Adresse gab 333 293 B text/html). Ein
     stiller HTML-Treffer wäre schlimmer als ein 429, also gilt ein Treffer nur, wenn der
     content-type nicht nach HTML riecht. Sonst: raw. */
  const looksWrong = (r) => !r.ok || /text\/html/i.test(r.headers.get('content-type') || '');

  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url);
    const alt = mirrorOf(url);
    if (!alt) return nativeFetch(input, init);
    try {
      const r = await nativeFetch(alt, init);
      if (!looksWrong(r)) { stats.hits++; return r; }
    } catch (e) { /* Netz weg -> Rückweg */ }
    stats.falls++;
    return nativeFetch(input, init);
  };

  // THREE-Loader: synchron, darum ohne Rückweg-Kette. Ein Fehlschlag landet in der
  // Wiederholung des Aufrufers (kfb-pets.js `defaultLoadGltf`).
  const mgr = THREE && THREE.DefaultLoadingManager;
  if (mgr && mgr.setURLModifier) {
    mgr.setURLModifier((url) => { const alt = mirrorOf(url); if (alt) stats.xhr++; return alt || url; });
  }

  const api = {
    stats: () => ({ ...stats }),
    off: () => { window.fetch = nativeFetch; if (mgr && mgr.setURLModifier) mgr.setURLModifier(null); delete window.__kfbMirror; },
    host: PAGES,
  };
  window.__kfbMirror = api;
  return api;
}
