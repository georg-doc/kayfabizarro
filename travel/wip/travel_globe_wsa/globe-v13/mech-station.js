// ============================================================================
// mech-station.js — v9 · Slice „Meckertronic" · Mech im Wirt (Station + Fahrt-Skin)
// ----------------------------------------------------------------------------
// **Was das ist:** der Beweis des LADEPFADS im echten Globus, nicht im Mech-Slice.
// `modules/kfb-mech-combat.js` kapselt die drei Recon-Fallen (frustumCulled bei
// boundingSphere r=0 · 100er-Bind nicht anfassen · Alias-Clips für den Robot); diese
// Station stellt EINEN Mech neben den Start, spielt Idle und MISST, dass er im
// Globus-Maßstab steht. Erst wenn dieses Tor grün ist, lohnt der nächste Schritt
// (Fahrzeug-Skin nach E-43 — Bewegung kommt NIE hier her, das ist eine Station).
//
// **Maßstab — GEMESSEN, nicht mehr geraten (Georg, 1.9.: „scheinen etwas zu groß").**
// v8 stellte `hoehe: 0.32` gegen die Figurhöhe „~0,15 u". Diese 0,15 ist eine MESSGRÖSSE aus
// `walk-messung.js` (Bodenfehler, Horizont) — sie ist NICHT das, was man sieht. Gezeichnet wird
// die Karte: `CARD_WELT = 0.075` u Breite (globe-poc.js, „Zielbreite wie der tinyskies-Teppich"),
// das Pet sitzt DARAUF. Der v8-Mech stand also auf 0,32 / 0,075 = **4,27 Kartenbreiten** — genau
// das Bild aus dem Screenshot: ein Turm neben einer Spielkarte, kein Fahrzeug.
// Also: `hoehe` ist ABGELEITET — `bezug` (die gezeichnete Kartenbreite, vom Wirt geliefert)
// × `faktor` (Georgs Regler). Voreinstellung 1,3× = 0,098 u. Die Entscheidung bleibt Georgs,
// aber der Regler steht jetzt in der Einheit, die er im Bild sieht: „mal Karte".
// Skaliert wird der WRAPPER, nie `mesh.scale` (Recon: scale=1 am Mesh verzerrt Clips).
//
// **Messregel der Recon gilt auch hier:** Höhe über BONE-Weltpositionen (ohne
// `PoleTarget*`), nie `Box3.setFromObject` (Bind-Space, Phantom-Höhe 217).
// ============================================================================
import MechCombat, { MECHS, FAHRZEUG_ENTWUERFE } from '../modules/kfb-mech-combat.js';
import { createBodenLesung } from './boden-lesung.js';   // v9 · EIN Eigentümer für die Bodenhöhe

export function createMechStation({ THREE, seed, terrainType, surfaceAltitudeAt, radius,
                                    gltfLoader, richtung, bodenMesh = null, params = {} }) {
  const P = Object.assign({ on: true, mech: 'flamingo', bezug: 0.075, faktor: 1.3, hoehe: 0, yaw: 2.4,
    // Fahrt-Skin (E-43): der Mech reitet auf dem UNSICHTBAREN Fahrzeug. Vorwärtsachse der
    // Mechs ist +Z (Recon: Startyaw PI, sonst blickt er in die Kamera) — fahrYaw dreht den
    // Wrapper relativ zur Carrier-Lage. schrittLaenge = Weltmeter je Walk-Zyklus bei
    // timeScale 1; timeScale = tempo / schrittLaenge (fahrzeug-vertrag ENTWURF_LAEUFER).
    fahrYaw: Math.PI, schrittLaenge: 0.2, laufAb: 0.32,
    // v9 · Fußlesung am GEBACKENEN Netz statt an `surfaceAltitudeAt`.
    // Begründung ist eine Messung, keine Vorliebe: Messung 1 (walk-messung.js) hat für die
    // Höhenfunktion bis 17,5 % Einsinken der Figurhöhe gemessen. Gelesen wird die Fläche, die
    // man SIEHT — O(1) über das Kugelgitter, mit einem Kontrollstrahl im Tor (Details unten).
    boden: true, bodenLuft: 0.0,
  }, params);
  // Eine Wahrheit, zwei Lesarten: wer `hoehe` absolut setzt, setzt damit den Faktor mit.
  if (params.hoehe) P.faktor = P.hoehe / P.bezug; else P.hoehe = P.bezug * P.faktor;
  const group = new THREE.Group();
  group.name = 'mech-station';
  const combat = new MechCombat();
  let bereit = false, laden = null, aktuell = null, mixer = null, wrapper = null;
  let fahren = false, acts = null, aktClip = '';
  let natHoehe = 3.0;          // Bone-Box-Höhe des GELADENEN Mechs (Recon-Maß, nie Box3)
  let befund = { text: 'idle · not loaded yet' };
  const _up = new THREE.Vector3(), _y = new THREE.Vector3(0, 1, 0), _b = new THREE.Vector3();
  // ── v9 · Fußlesung am GEBACKENEN Netz ─────────────────────────────────────────────────────
  // **Erst gebaut, dann gemessen, dann umgebaut — und die Messung bleibt stehen.**
  // Fassung 1 war ein Raycaster gegen die Kugel: korrekt, aber **8–21 ms je Strahl** (130 560
  // Dreiecke, kein BVH) — bei einem Strahl je drei Bilder rund 2,7 ms auf JEDES Bild, plus
  // Spitzenbild. Für eine Höhe. Das ist kein Preis, das ist eine Rechnung, die man nicht macht.
  // Fassung 2 liest dieselbe Fläche OHNE Suche: `SphereGeometry` ist ein regelmäßiges Gitter
  // ((W+1)×(H+1) Vertices), also ist die Zelle unter `up` **berechenbar** statt findbar —
  // Zeile/Spalte aus den Kugelwinkeln, dann bilinear zwischen vier Vertex-Radien. Das ist die
  // „baryzentrische Lesung", die `kfb-mech-combat.js` im Docblock neben dem Raycast nennt.
  // Kosten: das Tor druckt **0,1 ms je Bild** — und das ist der Auflösungsboden von
  // `performance.now()` in diesem Browser, also die OBERGRENZE, nicht der Wert. (Georgs Regel
  // „Instrumente lügen nicht" gilt auch für meine eigene Kostenangabe: erst stand hier
  // „unter 0,01 ms", das war eine Schätzung neben einem Instrument, das 0,1 anzeigt.)
  // Ohne Glättung, ohne Takt, jedes Bild.
  // Der Strahl bleibt — als KONTROLLE im Tor: der billige Leser wird vom teuren geprüft, nicht
  // von meinem Kommentar. (Regel des Hauses: Instrumente lügen nicht.)
  // ⚠⚠ **Und dann stand die Rechnung ZWEIMAL da — genau der Fehler, den das Modul beheben sollte.**
  // Die Abnahme hat es gefunden: diese Datei hat `createBodenLesung` importiert und nie gerufen,
  // während ihre eigene Kopie weiterlief. Damit hatte „wie hoch ist der gezeichnete Boden" wieder
  // zwei Implementierungen, und drei Texte behaupteten eine — der Kopf von `boden-lesung.js`,
  // HOUSEKEEPING §13 und mein Bericht. *Ein Import ohne Aufruf ist eine Absichtserklärung, keine
  // Zusammenlegung.* Die Kopie ist gelöscht; ab hier fragt der Mech dasselbe Modul wie Türme,
  // Leuchttürme und Bodenschein. Die Geschichte der Rechnung (Raycast → bilinear → Dreiecksebene,
  // mit den Messwerten) steht dort im Kopf, an EINER Stelle.
  const leser = bodenMesh
    ? createBodenLesung({ THREE, mesh: bodenMesh, radius, surfaceAltitudeAt, seed, terrainType })
    : null;
  let bodenR = 0;

  /** Der Wert, den die Lage benutzt. */
  function bodenLesen(up) {
    if (!P.boden || !leser) return null;
    const r = leser.radiusAt(up);
    if (r == null) return null;
    bodenR = r;
    return r + P.bodenLuft;
  }

  /** Der Rückfall, wenn die Netzlesung AUS ist (Panel-Schalter) oder kein Netz übergeben wurde.
   *  ⚠ Er kommt aus DEMSELBEN Modul (`vergleich().funktion`), damit auch der Rückfall keinen
   *  zweiten Rechner hat — und weil die letzte Runde genau hier zerbrochen ist: mit der gelöschten
   *  Kopie verschwand `altRadius`, während `stellen()` es auf dem AUS-Pfad weiter rief. Ein Klick
   *  im Panel („Read feet off the baked mesh" aus) warf einen ReferenceError.
   *  *Wer eine Funktion löscht, muss ihre Aufrufer zählen — nicht ihre Definition.*
   *  Und: ein Tor, das nur den EIN-Pfad liest, prüft den AUS-Pfad nie. */
  function altRadius(up) {
    if (leser) {
      const f = leser.vergleich(up).funktion;
      if (f != null) return f;
    }
    return radius + Math.max(0, surfaceAltitudeAt(seed, terrainType, up.x, up.y, up.z));
  }

  /** Der EINE Ort, an dem der Wrapper-Maßstab entsteht. Ziel-Höhe / natürliche Bone-Höhe. */
  function skalieren() {
    if (wrapper) wrapper.scale.setScalar(P.hoehe / natHoehe);
  }

  function stellen() {
    if (!wrapper) return;
    _up.copy(richtung).normalize();
    const gemessen = bodenLesen(_up);
    group.position.copy(_up).multiplyScalar(gemessen != null ? gemessen : altRadius(_up));
    group.quaternion.setFromUnitVectors(_y, _up);
    wrapper.rotation.y = P.yaw;   // Vorwärtsachse der Mechs ist +Z (Recon) — yaw dreht die Blickrichtung
  }

  /** Bone-Box-Höhe in WELT-u, gemessen an der gebauten Szene (ohne PoleTarget*). */
  function boneHoeheWelt(root) {
    let min = Infinity, max = -Infinity, n = 0;
    _up.copy(richtung).normalize();
    root.updateWorldMatrix(true, true);
    root.traverse((o) => {
      if (!o.isBone || /PoleTarget/i.test(o.name)) return;
      o.getWorldPosition(_b); const h = _b.dot(_up); n++;
      if (h < min) min = h; if (h > max) max = h;
    });
    return n ? { hoehe: max - min, bones: n } : null;
  }

  async function lade(id) {
    const M = MECHS.find((m) => m.id === id) || MECHS[0];
    P.mech = M.id;
    laden = (async () => {
      if (wrapper) { group.remove(wrapper); wrapper = null; mixer = null; }
      const mech = await combat.loadMech(M.id);
      const E = FAHRZEUG_ENTWUERFE.find((f) => f.id === 'mech-' + M.id);
      const nat = (E && E.rumpf.hoehe) || 3.0;             // Bone-Box der Recon, nie Box3
      natHoehe = nat;
      wrapper = new THREE.Group();
      skalieren();
      wrapper.add(mech.root);
      group.add(wrapper);
      mixer = new THREE.AnimationMixer(mech.root);
      const idle = mech.pick('Idle');
      acts = {}; aktClip = idle ? 'Idle' : '';
      for (const k of ['Idle', 'Walk', 'Run']) { const c = mech.pick(k); if (c) acts[k] = mixer.clipAction(c); }
      if (idle) mixer.clipAction(idle).play();
      if (fahren) wrapper.rotation.y = P.fahrYaw;
      mixer.update(0.05);                                   // eine Pose, damit die Messung nicht T-Pose misst
      stellen();
      // Befund an der GEBAUTEN Szene (Lehre 1.9.: nie material/Deklaration lesen, wo man bauen kann)
      let culled = 0, skinned = 0;
      mech.root.traverse((o) => { if (o.isSkinnedMesh) { skinned++; if (o.frustumCulled) culled++; } });
      const bb = boneHoeheWelt(mech.root);
      const clipsGeb = ['Idle', 'Walk', 'Shoot_Small', 'Shoot_Big'].filter((k) => mech.pick(k)).length;
      const ok = skinned > 0 && culled === 0 && !!idle && bb && Math.abs(bb.hoehe - P.hoehe) / P.hoehe < 0.25;
      befund = { ok, hidden: document.hidden,
        text: (ok ? '✓ ' : '✗ ') + M.name + ' · ' + skinned + ' skinned (culling off on all), '
          + clipsGeb + '/4 clips via alias' + (idle ? '' : ' — ⚠ NO idle')
          + (bb ? ' · bone height ' + bb.hoehe.toFixed(3) + ' u vs target ' + P.hoehe.toFixed(2)
                  + ' (' + bb.bones + ' bones, natural ' + nat + ' m)' : ' · ⚠ no bones found')
          + ' · size = ' + P.faktor.toFixed(2) + '× the drawn card (' + P.bezug.toFixed(3)
          + ' u) — v8 stood at 4.27×, which is what looked wrong' };
      aktuell = mech; bereit = true;
    })().catch((e) => { befund = { ok: false, text: '✗ load failed: ' + e.message }; });
    return laden;
  }

  combat.init({ three: THREE, gltfLoader }).then(() => { if (P.on) lade(P.mech); });

  /** Clip-Wechsel mit Crossfade — eine Feder, kein Schnitt. */
  function _clip(name, fade) {
    if (!acts || !acts[name] || aktClip === name) return;
    const von = acts[aktClip];
    acts[name].reset().fadeIn(fade || 0.2).play();
    if (von) von.fadeOut(fade || 0.2);
    aktClip = name;
  }

  return {
    name: 'mech-station', group, params: P,
    update(dt) { if (mixer && !fahren) mixer.update(dt); },
    /** · Fahrt-Skin (E-43) · der Wirt schaltet um; die Station bewegt NICHTS selbst. */
    get faehrt() { return fahren; },
    aufsitzen() { fahren = true; if (wrapper) wrapper.rotation.y = P.fahrYaw; },
    absitzen() {
      fahren = false;
      if (wrapper) wrapper.rotation.y = P.yaw;
      stellen(); _clip('Idle', 0.2);
    },
    /** Je Bild in Fahrt: Lage vom Carrier-Zustand, Clip vom Tempo. Kein eigener Rechner. */
    sync(state, dt) {
      if (!fahren || !wrapper) return;
      // ⚠ Zwei Fragen, zwei Eigentümer — und das ist Absicht: WOHIN kommt weiter vom Carrier
      // (`carpet.js` bleibt der eine Bewegungsrechner, E-43), WIE HOCH kommt ab v9 vom Strahl.
      // Der Carrier rechnet seine Höhe aus `surfaceAltitudeAt`; genau die sinkt ein. Die Richtung
      // bleibt unangetastet, also ändert sich die Fahrphysik nicht — nur die Füße stehen richtig.
      group.position.copy(state.position);
      _up.copy(state.position).normalize();
      const gemessen = bodenLesen(_up);
      if (gemessen != null) group.position.copy(_up).multiplyScalar(gemessen);
      group.quaternion.copy(state.quaternion);
      const tempo = state.speed || 0;
      if (tempo < 0.02) _clip('Idle', 0.18);
      else {
        const name = (tempo > P.laufAb && acts && acts.Run) ? 'Run' : (acts && acts.Walk ? 'Walk' : 'Idle');
        _clip(name, 0.18);
        if (mixer) mixer.timeScale = Math.max(0.4, Math.min(3.2, tempo / P.schrittLaenge));
      }
      if (mixer) { mixer.update(dt); if (tempo < 0.02) mixer.timeScale = 1; }
    },
    /** Nächster Mech im Roster — Panel-Knopf. */
    naechster() {
      const i = MECHS.findIndex((m) => m.id === P.mech);
      return lade(MECHS[(i + 1) % MECHS.length].id);
    },
    /** Absolut in Welt-u — für Messungen und Bestandscode. Setzt den Faktor mit. */
    setHoehe(v) {
      P.hoehe = Math.max(0.02, Math.min(0.8, v));
      P.faktor = P.hoehe / P.bezug;
      skalieren();
      return P.hoehe;
    },
    /** Georgs Regler: Vielfaches der GEZEICHNETEN Kartenbreite. */
    setFaktor(v) {
      P.faktor = Math.max(0.3, Math.min(6, v));
      P.hoehe = P.bezug * P.faktor;
      skalieren();
      return P.faktor;
    },
    tor() { return befund; },
    /** ⚠ **Die Schuld aus v8, jetzt bezahlt und GEMESSEN.** v8 hat im Panel notiert: „Füße waten
     *  auf manchem Gelände (17,5 % aus Messung 1)". Dieses Tor stellt beide Leser nebeneinander —
     *  Strahl gegen Höhenfunktion, am LAUFENDEN Bild und an der Stelle, wo der Mech gerade steht. */
    bodenTor() {
      if (!leser) return { ok: false, text: '✗ no ground mesh handed in — reading is the height function' };
      if (!P.boden) return { ok: false, text: '— mesh reading off: standing on surfaceAltitudeAt (Measurement 1: sinks up to 17.5 % of figure height)' };
      // Beide Leser plus die Höhenfunktion kommen aus DEMSELBEN Modul (`boden-lesung.vergleich`) —
      // das Tor rechnet nichts nach, es stellt nebeneinander.
      const v = leser.vergleich(_up);
      const gitter = v.gitter != null ? v.gitter : bodenR;
      const s = v.strahl, alt = v.funktion;
      const dFunk = alt != null ? gitter - alt : 0;
      const dStrahl = s == null ? null : gitter - s;
      const anteil = P.hoehe > 0 ? Math.abs(dFunk) / P.hoehe * 100 : 0;
      const ok = gitter > 0 && s != null && Math.abs(dStrahl) < 0.002;
      return { ok, gitter: +gitter.toFixed(4), strahl: s == null ? null : +s.toFixed(4),
        funktion: alt == null ? null : +alt.toFixed(4), differenz: +dFunk.toFixed(4),
        anteilProzent: +anteil.toFixed(1),
        gitterMs: +v.gitterMs.toFixed(3), strahlMs: +v.strahlMs.toFixed(2),
        text: (ok ? '✓' : '✗') + ' ' + (v.dreieck ? 'triangle-plane' : '⚠ bilinear fallback')
          + ' read ' + gitter.toFixed(4)
          + ' vs control ray ' + (s == null ? 'MISS' : s.toFixed(4))
          + (dStrahl == null ? '' : ' (Δ ' + (dStrahl >= 0 ? '+' : '') + dStrahl.toFixed(5) + ' u)')
          + ' · one shared reader (boden-lesung.js) for mech, towers and glows'
          + ' · grid ' + v.gitterMs.toFixed(1) + ' ms per frame (= performance.now() resolution floor,'
          + ' so an upper bound) vs ' + v.strahlMs.toFixed(1) + ' ms for this control ray'
          + (alt == null ? '' : ' · height function says ' + alt.toFixed(4) + ' → '
            + (dFunk >= 0 ? '+' : '') + dFunk.toFixed(4) + ' u = ' + anteil.toFixed(1) + ' % of mech height'
            + (dFunk < 0 ? ' (the function held the mech ABOVE the mesh here)' : ' (the function let it WADE here)'))
          + (ok ? '' : ' — ⚠ grid and ray disagree, the cheap reader is not the mesh') };
    },
    setBoden(on) { P.boden = !!on; if (!fahren) stellen(); return P.boden; },
    /** Georg, 1.9.: „mit den Zahlen kann ich nichts entscheiden." Ein Knopf, vier Größen, im Bild. */
    groesseWeiter() {
      const stufen = [1.0, 1.3, 1.8, 2.5];
      const i = stufen.findIndex((s) => Math.abs(s - P.faktor) < 0.06);
      const next = stufen[(i + 1) % stufen.length];
      P.faktor = next; P.hoehe = P.bezug * next; skalieren();
      if (!fahren) stellen();
      return next;
    },
  };
}
