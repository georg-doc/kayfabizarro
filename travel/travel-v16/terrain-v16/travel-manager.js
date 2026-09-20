// ============================================================================
// travel-manager.js — KFB Travel · Slice S44 (V9-C) · Lebenszyklus + Pipeline
// ----------------------------------------------------------------------------
// Auftrag aus `docs/INTERMISSION_reviews_v8.md` §V9-C. Alle fünf Audits fordern
// einen Orchestrator; drei fordern zusätzlich eine „feste, dokumentierte
// Frame-Reihenfolge". Die gab es hier — als Kommentar über einer 250-zeiligen
// Schleife. Ein Kommentar ist keine Reihenfolge, er ist eine Behauptung.
//
// **Die Reihenfolge ist jetzt eine LISTE.** Der Manager kennt nur sie:
//
//     [['attach', fn], ['fade', fn], ['vehicle', fn], ['world', fn], ['render', fn]]
//
// Damit ist sie ausdruckbar (`mgr.order`), messbar (`mgr.timing` — Millisekunden
// pro Schritt) und veränderbar, ohne eine Schleife umzubauen. Genau das war der
// Punkt: S33b hing daran, dass „Motor → Kinetik → Facing" stimmt, und das ließ
// sich vorher nur durch Lesen prüfen.
//
// **Die Schritt-Funktionen bleiben Closures im Runner.** Sie hierher zu ziehen
// hätte 50 Abhängigkeiten durch ein `ctx`-Objekt geschleift — dieselbe Kopplung,
// nur mit mehr Zeilen. Der Manager besitzt die ORDNUNG, nicht die Arbeit.
//
// Zwei Dinge, die eine Liste kann und eine Schleife nicht:
//  · **Fehler-Isolation pro Schritt.** Vorher hat EIN Fehler den ganzen Frame
//    gefressen (ein try/catch um alles) — inklusive Render, also stand das Bild.
//    Jetzt meldet der kaputte Schritt sich EINMAL, und der Rest läuft weiter.
//  · **Abbruch als Rückgabewert.** Ein Schritt, der `false` liefert, beendet den
//    Frame (der Modus-Wechsel braucht das: nach `enter` ist der halbe Frame-Zustand
//    von gestern). Vorher war das ein `return` mitten in der Schleife.
//
//   const mgr = createTravelManager({ renderer, steps: [...] });
//   mgr.start();
// ============================================================================

export function createTravelManager(opts = {}) {
  const renderer = opts.renderer;
  const steps = (opts.steps || []).filter((s) => s && typeof s[1] === 'function');
  const maxDt = opts.maxDt != null ? opts.maxDt : 0.05;
  const onError = opts.onError || null;

  const timing = steps.map((s) => ({ name: s[0], ms: 0, avg: 0, calls: 0, broke: false }));
  let last = performance.now(), frames = 0, dtLast = 0, running = false, abortedAt = null;

  function frame() {
    const now = performance.now();
    const dt = Math.min(maxDt, (now - last) / 1000);
    last = now; frames++; dtLast = dt; abortedAt = null;
    for (let i = 0; i < steps.length; i++) {
      const rec = timing[i];
      const t0 = performance.now();
      let out;
      try {
        out = steps[i][1](dt);
      } catch (e) {
        // Einmal melden, nicht jeden Frame — ein Fehler soll die Konsole nicht zumüllen,
        // und ein defekter Schritt darf das Bild nicht anhalten.
        if (!rec.broke) {
          rec.broke = true;
          window.__loopErr = true;
          console.error('[travel-manager] Schritt „' + rec.name + '" wirft', e);
          if (onError) { try { onError(rec.name, e); } catch (e2) {} }
        }
      }
      const ms = performance.now() - t0;
      rec.ms = ms; rec.calls++;
      rec.avg += (ms - rec.avg) * 0.05;
      if (out === false) { abortedAt = rec.name; break; }
    }
  }

  return {
    name: 'travel-manager',
    start() { if (running) return; running = true; last = performance.now(); renderer.setAnimationLoop(frame); },
    stop() { running = false; renderer.setAnimationLoop(null); },
    get running() { return running; },
    // Die Reihenfolge als Text — das ist die „dokumentierte Pipeline" der Audits,
    // nur dass sie diesmal aus dem Code kommt und nicht aus einem Kommentar.
    get order() { return steps.map((s) => s[0]); },
    // Einen einzelnen Schritt von Hand fahren. Klingt nach Test-Zubehör, ist aber die natürliche
    // Folge davon, dass die Pipeline **Daten** ist: ohne sichtbaren Frame läuft kein rAF, und dann
    // lässt sich sonst kein Schritt prüfen (genau daran scheiterte die Abnahme von S51).
    runStep(name, dt) {
      const s = steps.find((x) => x[0] === name);
      if (!s) return false;
      try { s[1](dt || 1 / 60); return true; } catch (e) { console.error('[manager] Schritt', name, e); return false; }
    },
    get timing() { return timing.map((t) => ({ name: t.name, ms: +t.ms.toFixed(2), avg: +t.avg.toFixed(2), broke: t.broke })); },
    get frames() { return frames; },
    get dt() { return dtLast; },
    get abortedAt() { return abortedAt; },
    get broken() { return timing.filter((t) => t.broke).map((t) => t.name); },
  };
}
