// ============================================================================
// academy-live.js — KFB Travel · Slice S31 · Die Demo läuft AUF der Karte
// ----------------------------------------------------------------------------
// Kein Overlay, kein iframe, kein zweiter Renderer: **Render-to-Texture im
// selben WebGL-Kontext.** Der vorhandene Renderer zeichnet die Lektions-Szene in
// ein `WebGLRenderTarget`, dessen `.texture` die `map` des Kartenfensters wird.
// Das Repo macht diese Familie schon (Terrain + HUD-Würfel in einem Renderer,
// `autoClear = false`) — hier kommt nur ein Ziel dazu, kein Kontext.
//
// DREI REGELN, DIE IN DIESEM PROJEKT TEUER GELERNT WURDEN:
//  1. **Reihenfolge:** der RTT-Pass läuft VOR dem Post-Pass. Sonst zeichnet man
//     in einen Puffer, der gerade auf den Schirm kopiert wird.
//  2. **Messen:** `renderer.info.render` zeigt nur den LETZTEN Pass. Die
//     Draw-Calls der Lektion werden deshalb direkt nach ihrem Pass gelesen und
//     hier gemerkt — nach dem Post-Pass misst man den Bildschirm-Quad.
//  3. **Gepacet und mit Rückweg:** ein teurer Job zur Zeit, nur wenn das Bild
//     flott läuft (`dt < 40 ms`), nie wenn `document.hidden`. Ein Auftrag, der
//     nie zurückkommt, ist der Standardfehler — also wird eine Lektion, deren
//     `initLesson` wirft, EINMAL gemeldet und dann nie wieder versucht.
//
//   const live = createAcademyLive({ THREE, renderer });
//   live.want(card);            // Wunsch — der Pacer entscheidet, wann
//   live.render(dt);            // pro Frame, VOR dem Post-Pass
//   live.pointer(u, v, 'down'); // synthetischer Zeiger aus dem UV-Treffer
// ============================================================================

import { initLesson, hasLesson } from './academy-lessons.js';
import { SHEET_AR } from './academy-deck.js';

export function createAcademyLive(opts = {}) {
  const THREE = opts.THREE;
  const renderer = opts.renderer;
  const P = Object.assign({
    size: 896,          // Kartenbreite in Pixeln (Höhe folgt dem Kartenformat)
    // 896 statt 640, weil die Karte in der Detailansicht (S32c) den ganzen Schirm füllt.
    // Bewusst FEST: `setSize` baut die Lektion neu auf, und beim Landen den Zustand einer
    // Demo wegzuwerfen (verschobene Körper, Kamerawinkel) wäre der falsche Moment.
    ar: SHEET_AR,
    enabled: true,
    settle: 0.35,       // s, die die Karte ruhig stehen muss, bevor der Job startet
    fpsCap: 0,          // 0 = jeden Frame; >0 = Lektion mit begrenzter Rate updaten
  }, opts.params || {});

  const api = { onStart: null, onError: null };
  let rt = null, lesson = null, card = null, want = null, wantT = 0;
  let calls = 0, tris = 0, frames = 0, secs = 0, fps = 0, err = null;
  const broken = new Set();
  const progressFn = opts.progress || null;

  function makeRT() {
    const w = Math.round(P.size), h = Math.round(P.size / P.ar);
    const o = { depthBuffer: true, stencilBuffer: false };
    if (renderer.capabilities.isWebGL2) o.samples = 4;   // MSAA im Puffer, sonst treppt die Demo
    const t = new THREE.WebGLRenderTarget(w, h, o);
    t.texture.colorSpace = THREE.SRGBColorSpace;   // sonst sieht die Demo auf dem Blatt fahl aus
    t.texture.anisotropy = 4;
    t.texture.minFilter = THREE.LinearFilter;
    t.texture.generateMipmaps = false;
    return t;
  }

  function teardown() {
    if (lesson) { try { lesson.dispose && lesson.dispose(); } catch (e) {} }
    lesson = null; card = null;
  }

  function start(c) {
    const ex = c && c.data && c.data.example;
    if (!ex || !hasLesson(ex) || broken.has(ex)) return false;
    teardown();
    if (!rt) rt = makeRT();
    const w = rt.width, h = rt.height;
    try {
      lesson = initLesson(THREE, ex, {
        width: w, height: h, data: c.data,
        progress: progressFn || (() => ({ flags: [] })),
      });
    } catch (e) {
      broken.add(ex); err = e; lesson = null;
      console.warn('[academy-live] Lektion fällt aus, Blatt bleibt stehen:', ex, e);
      if (api.onError) api.onError(ex, e);
      return false;
    }
    if (!lesson) { broken.add(ex); return false; }
    card = c; frames = 0; secs = 0;
    if (api.onStart) { try { api.onStart(c, rt.texture); } catch (e) {} }
    return true;
  }

  // Pro Frame: erst den Pacer, dann Update + RTT-Pass. `dt` ist der echte
  // Frame-Abstand des Runners — er IST das Gate.
  function render(dt) {
    if (!P.enabled || document.hidden) return false;
    if (want && want !== card) {
      wantT += dt;
      // Nur starten, wenn das Bild flott läuft UND der Wunsch kurz stabil war
      // (sonst startet und stirbt eine Lektion beim Vorbeiflug an drei Karten).
      if (dt < 0.04 && wantT >= P.settle) { wantT = 0; if (!start(want)) want = card; }
    } else wantT = 0;
    if (!lesson || !card) return false;

    try { lesson.update(dt); } catch (e) { console.warn('[academy-live] update-Fehler', e); teardown(); return false; }

    const prevTarget = renderer.getRenderTarget();
    const prevAuto = renderer.autoClear;
    renderer.autoClear = true;
    renderer.setRenderTarget(rt);
    renderer.render(lesson.scene, lesson.camera);
    // Messregel 2: JETZT lesen, nicht nach dem Post-Pass.
    calls = renderer.info.render.calls; tris = renderer.info.render.triangles;
    renderer.setRenderTarget(prevTarget);
    renderer.autoClear = prevAuto;

    frames++; secs += dt;
    if (secs >= 0.5) { fps = frames / secs; frames = 0; secs = 0; }
    return true;
  }

  return {
    name: 'academy-live', render,
    get texture() { return rt ? rt.texture : null; },
    get card() { return card; },
    get example() { return card && card.data ? card.data.example : null; },
    get live() { return !!lesson; },
    // Wunsch, nicht Befehl: der Pacer startet erst, wenn es billig ist.
    want(c) { want = c || null; if (!c) { want = null; teardown(); } },
    release() { want = null; teardown(); },
    pointer(u, v, type) {
      if (!lesson || !lesson.onPointer) return false;
      try { lesson.onPointer(u, v, type); } catch (e) { console.warn('[academy-live] onPointer-Fehler', e); }
      return true;
    },
    setEnabled(on) { P.enabled = !!on; if (!on) { want = null; teardown(); } },
    get enabled() { return P.enabled; },
    setSize(px) {
      P.size = px;
      const c = card;
      teardown();
      if (rt) { rt.dispose(); rt = null; }
      if (c) want = c;
    },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    get stats() { return { calls, tris, fps, size: rt ? rt.width + '×' + rt.height : '—', broken: broken.size }; },
    get lastError() { return err; },
    canRun(example) { return hasLesson(example) && !broken.has(example); },
    dispose() { teardown(); if (rt) rt.dispose(); rt = null; },
  };
}
