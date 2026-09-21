// ============================================================================
// combat-host.js — KFB Travel Combat v25 · Der EINE Kampf-Eingang im Wirt
// ----------------------------------------------------------------------------
// Vertrag (EINBAU §3): travel-poc.js berührt den Kampf an VIER Stellen — Import, Anmelden (nach
// audio + blobShadow), Takten (vor den Ereignissen), Treffer melden. Alles andere steht hier.
// `?combat=0` → dieses Modul wird nie gebaut; kein Rest im Bild, kein Rest im Log.
//
// Eigentum (WIRT_v13 §2 — EIN Eigentümer je Zahl):
//   Bewegung/Höhe/Kamera        flight-controller · card-carrier · camera-rig (unangetastet)
//   Ruhelage der Gegner         sky-mobs (`e.ruhe`) — sichtbare Position = ruhe + knock, HIER addiert
//   Knockback-Versatz           kfb-hit-response (`knockOf`), nie die Position selbst
//   Ton                         audio.sfx über kfb-combat-cues (Debounce, ≤ 3 Beats) — kein zweiter Mischer
//   Spieler-HP, Pop, Burnout    dieses Modul
//   Zufall                      mulberry32(sessionSeed) — gesät, nie Math.random
//
// Georgs Steuerung (04.09.): Linksklick = Signaturwaffe (halten = Dauerfeuer), Rechtsklick =
// Sekundär (Rakete), Klick AUF einen Gegner wählt ihn, Tab = Ziel-Cycle (WoW), sonst Lock auf den
// nächsten im Blick. Space bleibt Boost, X landen, F Modus — nichts davon wird hier belegt.
// ============================================================================

import { createHitResponse } from '../modules/kfb-hit-response.js';
import { createCombatCues } from '../modules/kfb-combat-cues.js';
import { createCombatSeam } from '../modules/kfb-combat-travel-adapter.js';
import { WEAPONS, ENERGY, resolveImpact, enemyShot, GOLD, RED } from '../modules/kfb-combat-def.js';
/* v25/S5 · Die Augapfel-Waffe wohnt bei ihrem Geschoss, nicht in `kfb-combat-def` — das Datenmodul
   ist geteiltes Gut (v8 liest es), und eine Waffe, die in v8 nie im Bild war, gehört nicht in v8s
   Waffenraum. **Der Wirt mischt die Räume:** `WAFFEN` ist die eine Nachschlagetabelle dieses Wirts.
   Harte Abhängigkeit: `studio-v3/pet-eye-rig.v5.js` (Rezept für Augapfel und Pupille). Fehlt sie,
   fällt der Import aus — dann sagt die Bootzeile es, und der Kampf läuft ohne diese Waffe weiter. */
import { createEyeballAmmo, WEAPONS as EYE_WEAPONS } from '../modules/kfb-weapon-eyeball.js';
/* v25/S6 · Der Würfelwurf, dieselbe Naht — nur weniger Last (ein Geschoss, kein Spurenwerk).
   Er braucht `prepare()`, weil er ein GLB lädt; ohne Datei greift sein eigener Ersatzwürfel. */
import { createDiceAmmo, WEAPONS as DICE_WEAPONS } from '../modules/kfb-weapon-dice.js';
// v25.2 · Die Action-Slots SIND Würfel (Georgs Idee, 05.09.) — ein Renderer für die ganze Reihe.
import { createSlotDice } from './slot-dice.js';
import { createMechAvatar, MECHS, loadGLTF } from './mech-avatar.js';
import { createSkyMobs } from './sky-mobs.js';
import { createCombatShots } from './combat-shots.js';
import { createCombatHud } from './combat-hud.js';
import { mulberry32, joinSeeds } from './world-context.js';

export const AVATARE = [{ id: 'random', name: 'Mech · zufällig (Start)' }, { id: 'pet', name: 'Cube-Pet (Karte)' }]
  .concat(MECHS.map((m) => ({ id: m.id, name: m.name + ' · ' + WEAPONS[m.sig].name })));

/** Die Waffen dieses Wirts: der geteilte Raum plus die Waffen, die bei ihrem Geschoss wohnen. */
export const WAFFEN = Object.assign({}, WEAPONS, EYE_WEAPONS, DICE_WEAPONS);
/* ═══ v25/S5 · EIN WIRT-WERT, KEINE ZWEITE FASSUNG IM MODUL ═══════════════════════════
   Das Tempo 24 u/s ist im Waffenmodul GERECHNET — für die Schussbahn, wo das Ziel bei 22 u steht.
   In diesem Wirt stimmt es nicht, und das ist eine Messung: ein Bogenwurf trägt höchstens `v²/g`
   weit, bei 24 u/s und g = 22 also **26,2 u**. Der Aggro-Slot von `sky-mobs` liegt bei 26 u, die
   Feuergrenze bei 30 u — der Wurf war damit dauerhaft an seiner absoluten Grenze, und dort ist die
   ballistische Lösung der 45°-Scheitelwurf: extrem empfindlich gegen jede Bewegung des Ziels.
   GEMESSEN am 05.09.: Kapselprobe **1 von 10** auf 24 u, bei sauber greifender Hitbox.
   34 u/s ergeben 52,5 u Reichweite — die 30-u-Feuergrenze mit Luft, der Bogen bleibt sichtbar, und
   die Waffe bleibt langsamer als jede andere. Der Wert steht HIER, weil die Schussbahn recht hat
   und dieser Wirt auch: dieselbe Waffe, zwei Entfernungen, zwei richtige Zahlen (PLAN §2 — „dann
   gehört ein `params`-Wert in den Wirt, nicht eine zweite Fassung ins Modul"). */
WAFFEN.eyeball = Object.assign({}, EYE_WEAPONS.eyeball, { speed: 34 });
/* Dieselbe Rechnung für den Würfel: 22 u/s bei g = 22 tragen `v²/g` = **22 u** — noch knapper als
   der Augapfel, und die Feuergrenze liegt bei 30 u. 30 u/s ergeben 40,9 u Reichweite. Der Bogen
   bleibt sichtbar (er ist mit 1,0 flacher als der des Augapfels), die Waffe bleibt eine Wurfwaffe.
   Auch hier: die Schussbahn wirft auf 12 u und hat mit 22 u/s recht. */
WAFFEN.dice = Object.assign({}, DICE_WEAPONS.dice, { speed: 30 });
export const SEKUNDAER = [
  { id: 'rocket', name: 'Rakete · ' + WEAPONS.rocket.name },
  { id: 'eyeball', name: 'Augapfel · ' + EYE_WEAPONS.eyeball.note },
  { id: 'dice', name: 'Würfelwurf · ' + DICE_WEAPONS.dice.note },
];

export function createCombatHost(o) {
  const THREE = o.THREE, scene = o.scene, camera = o.camera, renderer = o.renderer, audio = o.audio;
  const groundHeightAt = o.groundHeightAt, rig = o.rig, flight = o.flight, lighting = o.lighting;
  const petOf = o.pet || (() => null), isWalk = o.isWalk || (() => false), note = o.note || (() => {});
  const QUELLE = {
    hp: 100,
    burnout: 2.4,       // s · v8 `_deadT`
    recovery: 1.2,      // s · Georg: „kurze recovery in place, dann 100 % HP"
    welleSperre: 0.45,  // s · Mindestabstand zweier Farbwellen aus Fehlschüssen (8 Wellenplätze, 9 Schuss/s)
    lockRad: 0.6,       // rad · Zielhilfe-Kegel (sky-enemies v13: 11° war zu eng für 60-u-Distanzen; 0,6 ≈ 34° deckt das FOV)
    secondary: 'rocket',
    streakFenster: 6,   // s · drei Abschüsse eines Mobs innerhalb → MOB-Bonus
    mobBonus: 3,
    /* ═══ v25.1d · SELBSTHEILUNG ══════════════════════════════════════════════
       Georg, 05.09.: „HP recovery/self-heal als (default für testing) Modus ergänzen."
       **Vorgabe AN, und das ist ausdrücklich eine Test-Entscheidung, keine Spielbalance.** Der Grund
       steht hier, damit sie nicht eines Tages als Design gelesen wird: wer eine Waffe, eine
       Trefferreaktion oder ein Größenverhältnis ansehen will, darf nicht alle zwei Minuten im
       Burnout stehen. Ein Prototyp, der den Prüfer tötet, wird seltener geprüft.
       `regenDelay` ist der Teil, der es trotzdem zu einem Spielwert macht: die Heilung setzt erst
       nach einer ruhigen Sekunde ein, also heilt niemand IM Feuer. Damit bleibt ein Kampf ein
       Kampf, und die Erholung liegt in der Pause danach — dieselbe Grammatik wie die HP-Leiste, die
       mit dem Kampf erscheint und nach ihm geht.
       12 HP/s: die 100 HP sind in gut 8 s zurück. Ein Gegnerschuss macht 4–11 Schaden bei einer
       Feuerrate um 6 s je Körper — drei aggro Körper liegen also knapp über der Heilung, und der
       Kampf bleibt verlierbar. Wer das ausschaltet, dreht `regen` auf 0. */
    regen: 12,          // HP/s · 0 = aus
    regenDelay: 1.6,    // s Ruhe nach dem letzten Treffer, bevor geheilt wird
  };
  const P = Object.assign({}, QUELLE, o.params || {});
  const seed = joinSeeds('kfb-v24-combat', o.sessionSeed || 'x');
  const rng = mulberry32(seed);
  const zaehler = { schuesse: 0, treffer: 0, kills: 0, mobKills: 0, spielerTreffer: 0, tode: 0, knockMax: 0, knockAngewandt: 0, dt: 0, probeWuerfe: 0, probeTreffer: 0, geheilt: 0,
    /* v25.2c · Schüsse, deren gelöste Flugzeit über der Lebensdauer des Geschosses liegt — die
       können nicht ankommen, ganz gleich wie gut gezielt ist. Eine Zahl statt eines Verdachts. */
    zuWeit: 0, letzterVorhalt: 0, wellen: 0 };
  let wellenSperre = 0;   // v25.2c · Sperre zwischen zwei Farbwellen aus Fehlschüssen
  const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _m = new THREE.Vector3(), _ndc = new THREE.Vector3();
  const _rel = new THREE.Vector3();   // v25.2c · Zielbewegung im Schützenrahmen (Abfangaufgabe)
  /* v25.2 · Die Fahrt des Schützen, je Bild aus `flight.state` gelesen (vDir × speed). Sie ist das
     ERBE jedes eigenen Geschosses und gleichzeitig der Bezugsrahmen für den Vorhalt — beides
     dieselbe Zahl, damit sie nicht auseinanderlaufen kann. */
  const spielerVel = new THREE.Vector3();

  // ── Naht zu den Kit-Modulen (EINBAU §3 B) — Ring über unseren Sprite-Pool
  const shots = createCombatShots({ THREE, scene, rng: mulberry32(seed ^ 0x5bd1e995) });
  scene.add(shots.group);
  const combat = createCombatSeam({
    THREE, hitResponse: createHitResponse, combatCues: createCombatCues,
    audio, camera, scene, groundHeightAt, blobShadow: o.blobShadow,
    soundOn: o.soundOn || (() => false), realtime: () => true,
    rng: mulberry32(seed ^ 0x27d4eb2f),
    emit: (zelle, pos, op) => shots.emit(zelle, pos, op),
  });
  // Loader/SkeletonUtils kommen aus dynamischen Imports; die Fabriken lesen sie LAZY aus diesen Optionsobjekten.
  const mobsOpts = { THREE, loader: null, skinClone: null, groundHeightAt, rng: mulberry32(seed ^ 0x165667b1),
    register: (vis) => { if (lighting && lighting.register) lighting.register(vis); } };
  const mobs = createSkyMobs(mobsOpts);
  scene.add(mobs.group);
  const slotDice = createSlotDice({ THREE, loadGLTF: (p) => loadGLTF(mobsOpts.loader, p),
    // v25.2f · Farbpipeline des Wirts, damit derselbe Hexwert dasselbe Gelb ergibt (§ dort).
    toneMapping: renderer.toneMapping, exposure: renderer.toneMappingExposure, colorSpace: renderer.outputColorSpace });
  const hud = createCombatHud({ stage: o.stage, dice: slotDice, onSlot: (id) => slotAus(id) });
  const avatarOpts = { THREE, loader: null };
  const avatar = createMechAvatar(avatarOpts);

  /* ═══ v25/S5 · AUGAPFEL ══════════════════════════════════════════════════════
     **Die Spur ist GEDROSSELT eingebaut** (PLAN §3): dieser Wirt hält 64 Sprite-Plätze,
     ausdrücklich klein und ausdrücklich kein Nachbau von `kfb-fx-sprites`.

     ERSTE Drosselung war die aus dem Plan (0,35 u, popRegen 5). **Gemessen am 05.09. reichte sie
     nicht:** 10 Würfe → 1718 Spurpuffe, Pool 905× voll, Spitze 64/64. Der Plan hatte mit der
     Schussbahn gerechnet (12 u Bahn, 0,62 s Flugzeit); in diesem Wirt lebt ein Geschoss 3,2 s und
     die Spur läuft über Aufsetzer und Ausrollen weiter. Also nachgerechnet, mit der Zahl, die
     zählt — wie viele Kreise GLEICHZEITIG leben:
         gleichzeitig = Lebensdauer × Tempo / Abstand = 0,36 s × 34 u/s / Abstand
     Bei 0,35 u sind das 35 Kreise plus ein Drittel Begleiter ≈ 47 — für EINEN Wurf, und bei
     Feuerrate 1,1 s liegen zwei in der Luft. Bei **0,9 u** sind es 14 + 5 = 19 je Wurf, also 38
     für zwei überlappende Würfe: das passt in 64 und lässt der Signaturwaffe ihren Platz.
     (Gemessen nach der Umstellung: Spitze 53 von 64, 0 Ausfälle.)
     NACHSCHLAG, und er kommt auch aus einer Messung: mit 34 u/s stieg die Spitze auf 64/64 und
     EIN Ereignis fiel aus. Der Hebel dafür ist die LEBENSDAUER, nicht der Abstand — größerer
     Abstand reißt die Spur in Punkte auseinander (das Geschoss ist nur 0,42 u dick), kürzeres
     Leben macht sie nur KÜRZER und hält sie dicht: 0,28 s × 34 / 0,9 = 11 Kreise + 4 Begleiter.
     Dazu misst die Kapselprobe jetzt im TAKT DER WAFFE (1,1 s) statt schneller — eine Probe, die
     dichter feuert als die Waffe kann, misst einen Fall, den es im Spiel nicht gibt.
     Dazu ein DECKEL von 48 Kreisen je Wurf als Sicherung — er greift erst, wenn ein Augapfel
     länger unterwegs ist als seine Reichweite (Aufsetzer, Ausrollen). `tor()` fällt durch,
     wenn der Pool überhaupt einmal voll war; der Pool wird NICHT vergrößert, bevor diese Zahl es
     verlangt. */
  const vec = (p) => new THREE.Vector3(p.x, p.y, p.z);
  const vecv = (x, y, z) => new THREE.Vector3(x, y, z);
  const EYE_SPUR_MAX = 48;
  let eye = null, eyeFehler = null;
  try {
    eye = createEyeballAmmo({ THREE, params: { kreisAbstand: 0.9, kreisLeben: 0.28, popRegen: 5 } });
  } catch (e) { eyeFehler = (e && e.message) || String(e); console.warn('[combat-v25] Augapfel nicht verfügbar:', eyeFehler); }
  // Der Würfel lädt sein GLB in `boot()` nach (siehe dort) — hier nur die Fabrik.
  let dice = null, diceFehler = null;
  try {
    dice = createDiceAmmo({ THREE, loadGLTF: (p) => loadGLTF(mobsOpts.loader, p) });
  } catch (e) { diceFehler = (e && e.message) || String(e); console.warn('[combat-v25] Würfel nicht verfügbar:', diceFehler); }
  /* Den Untergrund kennt nur der Wirt (Doktrin aus `kfb-fx-flame.js`: „die Farbe kommt vom Wirt,
     weil nur er seinen Untergrund kennt"). Der mittlere Paletten-Stop ist die Farbe, auf der die
     Wurfbahn tatsächlich liegt. Ohne Meldung bleibt das Farb-Tor der Waffe „nicht messbar". */
  const grundHex = () => {
    const g = o.grundFarbe && o.grundFarbe();
    if (!g) return null;
    return Array.isArray(g) ? new THREE.Color(g[0], g[1], g[2]).getHex() : g;
  };

  // ── Zustand
  let mech = null, avatarId = 'random', primary = 'stinger', target = null, ready = false, bootLine = 'lade …';
  const hold = { p: false, s: false };
  let cool = { p: 0, s: 0 }, burst = 0, burstT = 0;
  let hp = P.hp, dead = 0, recover = 0, burnBeat = 0, smokeT = 0, ruheT = 0;
  let pop = 0; const streak = new Map();   // mob.id → { n, t }
  let probeErgebnis = null, poolErgebnis = null;
  /** Größenverhältnis Spieler ↔ größter geladener Gegner. Lokal, damit `tor()` und `zeile()` sie
   *  auch dann lesen können, wenn jemand die Methode ablöst (`const f = combat.zeile`). */
  function groessenNow() {
    let max = 0, wer = '—';
    for (const k of mobs.kinds) { const h = k.hWant || k.h * mobs.params.scale; if (h > max) { max = h; wer = k.name; } }
    const mh = mech ? mech.hoehe : 0;
    return { mech: +mh.toFixed(2), gegner: +max.toFixed(2), wer: wer, faktor: max > 0 ? +(mh / max).toFixed(2) : 0 };
  }

  // ── Laden (asynchron; die Reise läuft ohne den Kampf weiter, bis er da ist)
  async function boot() {
    const [{ GLTFLoader }, SU] = await Promise.all([import('three/addons/loaders/GLTFLoader.js'), import('three/addons/utils/SkeletonUtils.js')]);
    const loader = new GLTFLoader();
    mobsOpts.loader = loader; mobsOpts.skinClone = SU.clone; avatarOpts.loader = loader;
    const n = await mobs.load();
    try { avatarId = localStorage.getItem('kfb-v24-avatar') || 'random'; } catch (e) {}
    await mountAvatar(avatarId, true);
    // v25/S6 · Der Würfel misst sein eigenes Modell (zwei Pfadkandidaten, dann Ersatzwürfel).
    // Nicht blockierend für den Rest des Boots — wer nicht da ist, wird beim Feuern übersprungen.
    if (dice) { try { await dice.prepare(); } catch (e) { diceFehler = String(e && e.message); } }
    // v25.2 · Die Slot-Würfel: dasselbe GLB, eigener kleiner Renderer. Nach dem Laden wird die
    // HUD-Signatur verworfen, sonst bliebe die Reihe leer — sie war beim ersten Aufbau noch ohne
    // Geometrie, und `setSlots` baut nur bei Änderung.
    try { await slotDice.laden(); hud.entwerten(); } catch (e) { console.warn('[slot-dice]', e && e.message); }
    // Ton-Namen als Datenzeilen in das Manifest des Wirts (EINBAU §4) — falls der Wirt es kann
    let namen = 0;
    if (audio && audio.addSfx) {
      try {
        const j = await (await fetch(new URL('../modules/kfb-combat-sfx.v2.json', import.meta.url))).json();
        const rows = {};
        for (const k of Object.keys(j.cues || {})) { const L = (j.cues[k].layers || [])[0]; if (L && L.files && L.files.length) rows[k] = { variants: L.files, gain: L.gain == null ? 0.5 : L.gain, rate: L.rate || 1 }; }
        namen = await audio.addSfx(rows);
      } catch (e) { console.warn('[combat] Ton-Manifest nicht ladbar → Synthese', e); }
    }
    ready = true;
    bootLine = '[combat-v25] ' + n + ' Gegnerarten · Avatar ' + (mech ? mech.name : 'Pet') + ' · ' + namen + ' Ton-Namen angemeldet'
      + ' · Augapfel ' + (eye ? 'bereit (Spur je ' + eye.params.kreisAbstand + ' u)' : 'AUS: ' + (eyeFehler || 'Studio-Rezept fehlt'))
      + ' · Würfel ' + (dice ? dice.kind() : 'AUS: ' + (diceFehler || '—'))
      + ' · Seed ' + seed;
    console.info(bootLine);
  }
  function setPad(on) { if (rig.padParts) for (const m of rig.padParts) m.visible = on; }
  async function mountAvatar(id, still) {
    avatarId = id;
    try { localStorage.setItem('kfb-v24-avatar', id); } catch (e) {}
    let pick = id;
    if (pick === 'random') pick = MECHS[Math.floor(rng() * MECHS.length)].id;
    if (pick === 'pet') {
      if (mech) { mech.dispose(); mech = null; }
      setPad(true); primary = 'stinger';
      slotDice.faerben(avatarFarbe()); farbeLetzt = avatarFarbe();   // v25.2e · sonst bleibt die Mech-Farbe stehen
      if (!still) note('Avatar: Cube-Pet · Waffe ' + WEAPONS[primary].name, 4);
      return;
    }
    const m = await avatar.load(pick);
    mech = m; m.object3D.position.set(0, avatar.params.sitz, 0); rig.seat.add(m.object3D);
    // v24 · 5.9. · OHNE Story-Tint. Der Tint ist für das PET gedacht — es soll zur Welt gehören.
    // Ein Fahrzeug hat dagegen eine Signaturfarbe: der pinke Mech ist pink, in jeder Welt. Mit Tint
    // sah er „leicht farb-verschoben" aus (Georg), und zwar in jeder Welt anders — ein Avatar, der
    // seine Farbe wechselt, ist nicht wiedererkennbar. Env und Schatten gelten weiter.
    if (lighting && lighting.register) lighting.register(m.object3D, { tint: false });
    try { renderer.compile(scene, camera); } catch (e) {}
    setPad(false); primary = m.sig;
    slotDice.faerben(avatarFarbe()); farbeLetzt = avatarFarbe();   // v25.2 · die Würfel nehmen die Farbe des neuen Avatars an
    if (!still) note('Avatar: ' + m.name + ' · Waffe ' + WEAPONS[primary].name, 4);
  }

  // ── Eingabe
  const ray = new THREE.Raycaster();
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    _ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1), 0.5);
    ray.setFromCamera(_ndc, camera);
    const hits = ray.intersectObjects(mobs.hitboxes(), false);
    return hits.length ? hits[0].object.userData.enemy : null;
  }
  const el = renderer.domElement;
  el.addEventListener('pointerdown', (e) => {
    if (e.__hudClaimed || isWalk()) return;
    /* ═══ v25.1 · DIE KARTE SCHLUCKT DEN SCHUSS ═══════════════════════════════════
       Georgs Entscheidung (05.09.), und sie löst den Konflikt, den er benannt hat: Doppelklick auf
       eine Sky-Karte gegen Linksklick = Feuer. Liegt der Cursor ÜBER einer Karte, feuert dieser
       Klick nicht — er gehört der Karte. Warum diese Richtung die richtige ist: eine Karte ist ein
       KLEINES, bewusst angesteuertes Ziel, ein Gegner ein großes bewegliches. Wer auf eine Karte
       zeigt, meint die Karte; wer feuern will, hat 99 % des Bildes dafür. Und die Waffe hat
       seit v25.1 einen zweiten Weg (Slot 1 / Taste 1), der Karten gar nicht kennt — der Verzicht
       kostet also nicht einmal einen Schuss.
       Der Wirt liefert die Prüfung (`kartePick`), weil nur er seine Karten kennt. */
    if (o.kartePick && o.kartePick(e)) return;
    const t = pick(e); if (t && !t.dead) target = t;
    if (e.button === 0) hold.p = true; else if (e.button === 2) hold.s = true;
  });
  const release = (e) => { if (e.button === 0) hold.p = false; else if (e.button === 2) hold.s = false; if (e.type === 'pointercancel') hold.p = hold.s = false; };
  el.addEventListener('pointerup', release); el.addEventListener('pointercancel', release);
  addEventListener('blur', () => { hold.p = hold.s = false; });

  function cycleTarget() {
    const t = mobs.cycle(camera, target);
    if (!t) return false;
    target = t; return true;
  }

  /* ═══ v25.1 · DIE ACTION-LEISTE ═════════════════════════════════════════════════════════════
     Slot 1 und 2 sind die Waffen und sind VOLLWERTIGE Eingabe (Georgs Entscheidung): Klick auf den
     Slot und Taste 1/2 feuern genauso wie die Maus. Sie spiegeln nicht nur einen Zustand — sie sind
     der zweite Weg für jemanden, der mit Tasten fliegt und die Maus nicht am Abzug hat.
     **Keine leeren Slots.** Ein leerer Slot ist ein Versprechen; die Leiste wächst mit den
     Funktionen, die es gibt (Kontext-Slot Karte, später Pickups). Deshalb ist die Liste GERECHNET
     und nicht geschrieben — und deshalb bleibt die HP-Leiste darunter fest breit, sonst atmet der
     Bildrand bei jedem Slot mit.
     Das Zeichen je Waffe ist EIN Buchstabe: ein Wort im Slot wäre die Textzeile, die aus der
     Zielmarke gerade entfernt wurde. */
  /* Die Grundfarbe des Avatars trägt die Slot-Würfel (Georg: „Farbe der Dice entspricht der Base
     Color des Pets/Mechs"). Ohne Mech ist es das Kartenpapier — das Cube-Pet hat viele Farben und
     keine, die für es steht. */
  /* ═══ v25.2e · AUCH DAS PET HAT EINE GRUNDFARBE ══════════════════════════════════════
     Georgs Befund (06.09.): „gelbes Bunny mit rosa Würfeln". Zwei Fehler in einer Zeile:
       1 · Ohne Mech gab diese Funktion das KARTENPAPIER zurück (0xf3ead3) — die Begründung
           („das Cube-Pet hat viele Farben und keine, die für es steht") war schlicht falsch:
           jedes Pet trägt seine Signaturfarbe in `cfg.color`, dieselbe Zahl, mit der der Wirt
           es umfärbt. Ein gelbes Bunny hat eine Grundfarbe, und zwar Gelb.
       2 · Der Pet-Zweig von `avatar()` rief `faerben` gar nicht — die Würfel behielten die
           Farbe des vorigen MECHS. Deshalb rosa: das war der Mech davor.
     Beides behoben, und der Abgleich läuft zusätzlich im Bildtakt (ein Zahlenvergleich): das Pet
     kann auch ohne Avatar-Wechsel getauscht werden, und dann muß die Leiste mitgehen, ohne daß
     jemand daran denkt. */
  const petFarbe = () => {
    const p = petOf();
    const c = p && p.cfg ? p.cfg.color : null;
    if (c == null) return null;
    return typeof c === 'string' ? new THREE.Color(c).getHex() : c;
  };
  /* ═══ v25.2j · DIE WÜRFEL TRAGEN DIE BASISFARBE, NICHT DIE GETÖNTE ═══════════════════
     v25.2f mischte den Story-Tint auf die Würfelfarbe, weil das Pet ihn auch trägt. Gemessen in
     Georgs Sitzung war das der Fehler: Pet-Basis **#d3a244**, Tint **#8f3a5f** bei 0,18 — die
     Mischung ergibt **#c28b3c**, ein sichtbar dunkleres, rötlicheres Gelb als das Tier. Georgs
     Satz „Würfelfarbe ist nicht Pet/Avatar BASE color" ist also wörtlich der Vertrag: die Leiste
     zeigt die Signaturfarbe, nicht die Welttönung.
     Und das ist auch die richtige Regel, nicht nur die gewünschte: die Würfel-Leinwand hat ihre
     eigenen zwei Lampen, ausdrücklich damit „3D sichtbar" nicht von der Weltbeleuchtung abhängt
     (§ slot-dice). Ein Weltlicht-Effekt auf einem Körper, der bewußt außerhalb des Weltlichts
     steht, ist eine halbe Kopie — und eine halbe Kopie ist immer falsch. */
  /* ═══ v25.2k · DIE FARBE FOLGT DEM SICHTBAREN KÖRPER, NICHT DEM VORHANDENEN ═════════
     Vom Verifier gefangen, und es erklärt Georgs Bild endgültig: seine Würfel waren **rot**, und
     rot ist weder die Pet-Basis (#d3a244) noch die getönte Fassung (#c28b3c) — es ist eine
     MECH-Signaturfarbe aus dem Roster. Die Kette: der Standard-Avatar ist `random`, der beim
     Start einen Mech lädt; nur `avatar('pet')` entsorgt ihn wieder. Der Wechsel in den
     Bodenmodus tut das nicht — `mech` bleibt also liegen, und diese Zeile gewinnt, sobald er
     nur EXISTIERT. Auf dem Bild läuft dann das Pet, in der Leiste liegt der Mech.
     Die Regel, welcher Körper zu sehen ist, gibt es schon eine Zeile weiter unten:
     `pet.object3D.visible = isWalk() || !mech`. Sie steht ab jetzt EINMAL da und wird von beiden
     gelesen — zwei Fassungen derselben Regel wären genau der Grund, warum dieser Fehler zweimal
     auftrat (v25.2e über den Pet-Zweig, jetzt über den Mech-Zweig). */
  const petSichtbar = () => (isWalk() || !mech);
  const avatarFarbe = () => (!petSichtbar() && mech && mech.grundfarbe != null ? mech.grundfarbe
    : (petFarbe() != null ? petFarbe() : 0xf3ead3));
  let farbeLetzt = -1;
  let kartenSlotAn = false;
  function slotListe() {
    const l = [];
    const w1 = WAFFEN[primary], w2 = WAFFEN[P.secondary];
    const f = avatarFarbe();
    if (w1) l.push({ id: 'w1', key: '1', name: w1.name + ' · Primär (auch Linksklick)', farbe: f });
    if (w2) l.push({ id: 'w2', key: '2', name: w2.name + ' · Sekundär (auch Rechtsklick)', farbe: f });
    // Kontext-Slot: erst wenn der Autopilot angekommen IST (Georgs Wahl) — der Wirt sagt es.
    if (kartenSlotAn) l.push({ id: 'karte', key: '3', name: 'Karte ansprechen', farbe: avatarFarbe() });
    return l;
  }
  function slotAus(id) {
    if (id === 'karte') { if (o.onKarte) o.onKarte(); return; }
    if (dead > 0 || recover > 0 || isWalk()) return;
    if (id === 'w1' && cool.p <= 0) { const w = WAFFEN[primary]; cool.p = w.rate; feuern(primary); if (w.burst) { burst = w.burst - 1; burstT = w.burstGap || 0.07; } }
    else if (id === 'w2' && cool.s <= 0) { cool.s = WAFFEN[P.secondary].rate; feuern(P.secondary); }
  }
  // Zifferntasten. Sie leben HIER und nicht in `travel-input`, weil die Leiste dem Kampf gehört —
  // und ein Tastendruck in einem Eingabefeld ist keine Waffe (INPUT/TEXTAREA/editierbar ausgenommen).
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    const n = /^Digit([1-6])$/.exec(e.code); if (!n) return;
    const s = slotListe()[+n[1] - 1]; if (!s) return;
    e.preventDefault(); slotAus(s.id);
  });

  // ── Schuss des Spielers
  function feuern(wid, probe) {
    const B = WAFFEN[wid]; if (!B || !mech && !petOf()) return null;
    /* Die Kapselprobe wirft mit SCHADEN NULL. Sonst fällt der Mob nach dem dritten Wurf, die
       restlichen sieben haben kein Ziel und fliegen in den Kamerablick — das Ergebnis wäre dann
       eine Aussage über den Tod des Ziels und keine über die Hitbox. */
    const w = probe ? Object.assign({}, B, { dmg: 0 }) : B;
    const from = mech ? mech.muendung(_m) : rig.seat.getWorldPosition(_m).setY(rig.seat.getWorldPosition(_v).y + 0.7);
    // Richtung: Ziel mit Vorhalt, sonst Kamerablick
    const dir = new THREE.Vector3();
    let frei = false;   // v25.2c · Schuss ohne angewähltes Ziel (siehe Welle unten)
    if (target && !target.dead) {
      mobs.mitte(target, _v);
      /* v25.2 · **Der Vorhalt rechnet RELATIV zum Schützen.** `w.speed` ist die Geschwindigkeit
         des Geschosses gegenüber dem eigenen Fahrzeug (seit das Erbe dazukommt), also muß auch die
         Zielbewegung in diesem Rahmen stehen. Vorher stand hier die Weltgeschwindigkeit des Mobs —
         und weil Aggro-Mobs MIT dem Spieler fliegen, war das fast seine eigene Fahrt: der Vorhalt
         zeigte 30 u vor den Mob, während die Rakete ihn im Weltrahmen ohnehin nicht einholte.
         Zwei Fehler, die sich verstärkt haben; das Erbe behebt den einen, dieser Rahmen den anderen. */
      /* ═══ v25.2c · DER VORHALT WIRD GELÖST, NICHT GESCHÄTZT ═══════════════════════════
         Georgs Befund (05.09.): „in der Distanz verfehlen alle Nest-Rocket-Schüsse das Ziel." Zwei
         Fehler, beide entfernungsabhängig — deshalb saß es nah und verfehlte fern:
           1 · **Der Deckel.** `Math.min(1.2, t)` schnitt den Vorhalt bei 1,2 s ab. Bei 80 u und
               34 u/s Relativtempo dauert der Flug 2,35 s; vorgehalten wurde die Hälfte. Der Fehler
               WÄCHST mit der Entfernung — ab etwa 41 u (1,2 s × 34) ist jeder Schuss zu kurz
               vorgehalten, und bei 80 u liegt der Einschlag rund 30 u hinter dem Ziel.
           2 · **Die Flugzeit war die Anfangsdistanz durch das Tempo.** Das gilt nur für ein
               stehendes Ziel. Ein Ziel, das wegfliegt, braucht länger; eines, das entgegenkommt,
               kürzer. Nah ist der Unterschied Zentimeter, fern Meter.
         Richtig ist die Abfangaufgabe im Schützenrahmen — |Δp + Δv·t| = v·t, quadratisch in t:
           (Δv² − v²) t² + 2(Δp·Δv) t + Δp² = 0
         Die kleinste positive Wurzel ist der früheste Treffer. Gibt es keine, ist das Ziel im
         eigenen Rahmen schneller als das Geschoss — dann kann kein Vorhalt helfen (das war der
         alte v25.1-Fehler, den das Erbe behoben hat), und wir zielen auf die Momentanposition.
         Gedeckelt wird nur noch bei der LEBENSDAUER des Geschosses: länger vorhalten als fliegen
         ist sinnlos, und ein Schuss über `speed × leben` (Rakete: 34 × 3,2 = 109 u) kommt gar
         nicht an. Das wird gezählt, statt es zu verschweigen. */
      _w.copy(_v).sub(from);                                    // Δp
      _rel.set(0, 0, 0);
      if (target.__vel) _rel.copy(target.__vel).sub(spielerVel); // Δv (Schützenrahmen)
      const vs = Math.max(1, w.speed);
      const qa = _rel.lengthSq() - vs * vs, qb = 2 * _w.dot(_rel), qc = _w.lengthSq();
      let tf = Math.sqrt(qc) / vs;                              // Startwert: stehendes Ziel
      if (Math.abs(qa) > 1e-6) {
        const disc = qb * qb - 4 * qa * qc;
        if (disc >= 0) {
          const s2 = Math.sqrt(disc), r1 = (-qb + s2) / (2 * qa), r2 = (-qb - s2) / (2 * qa);
          const gut = (r1 > 1e-3 ? r1 : Infinity), gut2 = (r2 > 1e-3 ? r2 : Infinity);
          const tm = Math.min(gut, gut2);
          if (isFinite(tm)) tf = tm;
        }
      } else if (Math.abs(qb) > 1e-6) { const tl = -qc / qb; if (tl > 1e-3) tf = tl; }
      const tMax = shots.params.leben;
      if (tf > tMax) zaehler.zuWeit++;
      _v.addScaledVector(_rel, Math.min(tf, tMax));
      zaehler.letzterVorhalt = +tf.toFixed(2);
      dir.copy(_v).sub(from);
      frei = false;
    } else { dir.set(0, 0, -1).applyQuaternion(camera.quaternion); frei = true; }
    dir.normalize();
    if (w.spreadA) { dir.x += (rng() - 0.5) * w.spreadA * 2; dir.y += (rng() - 0.5) * w.spreadA * 2; dir.z += (rng() - 0.5) * w.spreadA * 2; dir.normalize(); }
    if (w.arc) {
      // Ballistik statt Schätzung: Abwurfwinkel für (v, g, dx, dy), flache Lösung; außer Reichweite → 45°.
      const g = shots.params.grav, v = w.speed;
      _w.copy(target && !target.dead ? _v : _m.clone().addScaledVector(dir, 30)).sub(from);
      const dy = _w.y, dx = Math.hypot(_w.x, _w.z);
      const disc = v * v * v * v - g * (g * dx * dx + 2 * dy * v * v);
      const tan = disc >= 0 ? (v * v - Math.sqrt(disc)) / (g * dx) : 1;
      const el = Math.atan(tan), hor = Math.cos(el);
      dir.set(_w.x / dx * hor, Math.sin(el), _w.z / dx * hor).normalize();
    }
    /* v25/S2 · **Die Mündung wandert VOR die Silhouette**, und zwar erst HIER: `dir` liegt jetzt
       vor (Ziel mit Vorhalt oder Kamerablick, bei Bogenwaffen die ballistische Lösung), der Mech
       kennt seine Richtung nicht. Der Versatz ist der gemessene Körperradius (mech-avatar
       `muendVor`), nicht die alten 0,9 u für alle — die waren beim 3,2-u-Mech zu kurz. Ohne Mech
       (Cube-Pet) bleibt es bei 0,9 u: dessen Silhouette ist die Karte, und die ist flach. */
    if (mech) mech.muendung(from, dir); else from.addScaledVector(dir, 0.9);
    // Augapfel: Körper, Spur, Platzer und Aufsetzer kommen aus dem Waffenmodul — dieser Wirt
    // liefert nur Emitter, Vektorfabriken und die Untergrundfarbe (§ oben).
    /* ZWEI KONVENTIONEN, EINE HÜLLE (Verifier-Fund 05.09.). Das Modul baut sein Geschoss für einen
       Wirt, der **−X** in die Flugrichtung dreht (`_poseAmmo`, Kommentar dort: „X folgt der
       Flugrichtung") und setzt die Pupille entsprechend auf `rotation.y = −π/2`. `combat-shots.fire`
       dreht dagegen **−Z** nach vorn (`lookAt(from − dir)`). Gemessen am gebauten Geschoss: die
       Pupillenachse lag bei (−1,0,0), also **90° neben der Flugrichtung** — und weil der Wirt um
       die Flugachse rollt, kreiste sie seitlich um die Bahn und lag nie vorn. Aus dem Augapfel
       wurde eine weiße Kugel mit einem Fleck an der Seite, und das ist die halbe Pointe der Waffe.
       Umgerechnet wird im WIRT, denn das Modul hat für seinen Wirt recht. Und in einer HÜLLE, weil
       `fire()` das Quaternion der übergebenen Group per `lookAt` überschreibt — eine Drehung direkt
       auf dem Modulkörper wäre einen Frame später weg. Y-Drehung um −90° bildet (−1,0,0) auf
       (0,0,−1) ab.
       Der Körper wird ERST GEBAUT, wenn im Geschosspool noch Platz ist: `eye.mesh()` klont je
       Geschoss zwei Materialien, und ein Wurf, den `fire()` wegen `maxSchuss` verwirft, hätte sie
       gebaut, nie in die Szene gehängt und nie freigegeben. */
    let augapfel = null;
    if (w.ammo === 'die' && dice && shots.anzahl < shots.params.maxSchuss) {
      /* Der Würfel taumelt (`tumble`) — er hat kein Triebwerk und keine Spur, seine ganze
         Bewegung IST die Drehung. Keine Konventions-Umrechnung nötig: eine Würfelform hat keine
         Vorderseite, die auf die Flugrichtung zeigen müsste. */
      const k = dice.mesh(w);
      if (k) augapfel = { mesh: k, roll: true };
    } else if (w.eyes && eye && shots.anzahl < shots.params.maxSchuss) {
      const koerper = eye.mesh(w);
      koerper.rotation.y = -Math.PI / 2;
      const huelle = new THREE.Group(); huelle.name = 'augapfel'; huelle.add(koerper);
      augapfel = {
        mesh: huelle, roll: true,
        spur: { schritt: eye.params.kreisAbstand, max: EYE_SPUR_MAX, mal: (at, i, d) => eye.trail(shots.emit, at, { i, dir: d, rng, vec, vecv, grund: grundHex() }) },
        huepfer: { n: w.bounce, keep: w.bounceKeep, fadeMs: w.fadeMs, auf: (at, nrm, i) => eye.hop(shots.emit, at, nrm, i, rng, vecv) },
      };
    }
    const s = shots.fire(Object.assign({ from, dir, w, mine: true, frei, seed: Math.floor(rng() * 1e9), e: target, probe: !!probe,
                                          erbe: spielerVel.lengthSq() > 1e-4 ? spielerVel : null }, augapfel));
    if (!s) return null;
    zaehler.letzter = { y: +from.y.toFixed(2), boden: +groundHeightAt(from.x, from.z).toFixed(2), ziel: target ? +mobs.mitte(target, _v).distanceTo(from).toFixed(1) : null, dirY: +dir.y.toFixed(2) };
    shots.muendung(from, dir, w);
    combat.schuss({ weapon: wid, seed: s.seed, at: from });   // → 'launch.<waffe>' (Namensmuster der Cues)
    if (mech) mech.play(w.clip || 'Shoot_Small');
    zaehler.schuesse++;
    // v25.1 · Der eigene Schuss ist der zweite Auslöser für die HP-Leiste (Georgs Wahl: „erster
    // Aggro ODER eigener Schuss") — nicht der erste Schaden. Sonst lernt man, dass es eine Leiste
    // gibt, in dem Moment, in dem sie schon zählt.
    hud.kampfPuls();
    return s;
  }

  // ── Treffer am Gegner (EINBAU §3 D — der Wirt schreibt die Position: in sky-mobs.update via knockOf)
  function trefferAmGegner(h, w, splash) {
    const e = h.e; if (!e || e.dead) return;
    const heavy = (w.heft || 0) >= 0.6;
    const zelle = resolveImpact(w.energy, e.surface, heavy), E = ENERGY[w.energy] || ENERGY.kinetic;
    combat.treffer({ vis: e.vis, mix: e.mix, anims: e.anims, punkt: h.punkt, richtung: h.richtung, energie: w.energy, oberflaeche: e.surface,
                     schwer: heavy, wucht: zelle.knock, stop: zelle.stop, seed: h.shot ? h.shot.seed : 0, farbe: E.hot, groesse: zelle.size });
    shots.einschlag(h.punkt, h.richtung, zelle, E, splash ? 0.7 : 1);
    // v25/S5 · Der Augapfel zerplatzt: Weiß spritzt, Pupille zerfällt, Regenbogen darüber. Das
    // Zellprofil darüber bleibt — zwei Signale, nicht ein Ersatz.
    if (w.eyes && eye) eye.pop(shots.emit, h.punkt, _v.copy(h.richtung).negate(), 1.6, rng, vecv);
    zaehler.treffer++;
    if (h.shot && h.shot.probe) zaehler.probeTreffer++;
    const res = mobs.hurt(e, splash ? w.dmg * 0.7 : w.dmg, h.richtung);
    if (res === 'tot') abschuss(e, h.punkt);
  }
  function abschuss(e, at) {
    zaehler.kills++; pop += 1;
    _v.copy(at).project(camera);
    hud.setPop(pop, 1, { x: (_v.x + 1) * 50, y: (1 - _v.y) * 50 });
    combat.schuss({ sfx: 'aftermath.kill.air', seed: Math.floor(rng() * 1e9), at });
    shots.scatter(at, 8, { color: GOLD, dir: new THREE.Vector3(0, 1, 0), spread: 1.4, speed: 9, size: 0.3, life: 0.6, grav: 16, drag: 0.7 });
    // Mob-Streak: drei Abschüsse eines Mobs im Fenster → Bonus + Ripple in der Grundfarbe (S3-light)
    const s = streak.get(e.mob.id) || { n: 0, t: 0 }; s.n++; s.t = 0; streak.set(e.mob.id, s);
    if (s.n >= (e.mob.e.length || 3)) {
      zaehler.mobKills++; pop += P.mobBonus; hud.setPop(pop, P.mobBonus, { x: 50, y: 34, text: 'MOB!' });
      if (o.terrain && o.terrain.spawnRipple) {
        const c = new THREE.Color(e.bolt);
        o.terrain.spawnRipple(at.x, at.z, [c.r, c.g, c.b], { life: 4.2, alpha: 0.9 });
      }
    }
    if (target === e) target = null;
  }

  // ── Spieler getroffen / Burnout / Recovery
  function spielerTreffer(h) {
    if (dead > 0 || recover > 0) return;
    const w = h.shot.w; hp -= w.dmg; zaehler.spielerTreffer++;
    ruheT = 0;   // v25.1d · jeder Treffer setzt die Ruhephase zurück: niemand heilt IM Feuer
    hud.hit(); hud.setHp(hp, P.hp); hud.kampfPuls(6);
    combat.schuss({ sfx: 'locomotion.hurt', seed: 1, at: h.punkt });
    shots.einschlag(h.punkt, h.richtung, resolveImpact('electric', 'metal', false), ENERGY.electric, 0.8);
    if (mech) { mech.play('HitRecieve_1'); combat.treffer({ vis: mech.root, mix: null, anims: null, punkt: h.punkt, richtung: h.richtung, energie: 'electric', oberflaeche: 'metal', schwer: false, wucht: 0.2, stop: 0.02, seed: 2, farbe: 0xd8f6ff }); }
    if (hp <= 0) { hp = 0; dead = P.burnout; burnBeat = 0; zaehler.tode++; hud.burnout(true, 'BURNOUT'); combat.schuss({ sfx: 'locomotion.die', seed: 3 }); if (mech) mech.play('Death'); if (audio && audio.duck) audio.duck(true, 0.5); }
  }
  function stepBurnout(dt) {
    const at = mech ? mech.muendung(_m) : rig.seat.getWorldPosition(_m);
    if (dead > 0) {
      dead -= dt; const t = Math.max(0, Math.min(1, 1 - dead / P.burnout));
      if (mech) mech.burn(Math.min(1, t * 2.4) * 0.72);
      smokeT -= dt;
      if (smokeT <= 0) { smokeT = 0.05 + t * 0.09; shots.emit('punkt', _v.copy(at).add(_w.set((rng() - 0.5) * 0.7, rng() * 0.4, (rng() - 0.5) * 0.7)), { color: 0x3a332a, add: false, size: 0.8 + rng() * 0.6, size1: 2.2, life: 1.1 + rng() * 0.5, op: 0.5, vel: new THREE.Vector3((rng() - 0.5) * 0.7, 1.5 + rng() * 0.7, (rng() - 0.5) * 0.7), drag: 0.55 }); }
      if (t >= 0.30 && burnBeat < 1) { burnBeat = 1; shots.scatter(at, 12, { color: GOLD, dir: new THREE.Vector3(0, 1, 0), spread: 1.5, speed: 9, size: 0.28, life: 0.55, grav: 16, drag: 0.8 }); shots.emit('punkt', at, { color: RED, size: 1.6, size1: 4.2, life: 0.3, op: 0.9 }); combat.schuss({ sfx: 'aftermath.boom', seed: 4, at }); }
      if (t >= 0.55 && burnBeat < 2) { burnBeat = 2; shots.emit('ring', at, { color: 0xffd27a, size: 1.2, size1: 6, life: 0.45, op: 0.8 }); if (o.terrain && o.terrain.spawnRipple) o.terrain.spawnRipple(at.x, at.z, [0.72, 0.21, 0.12], { life: 3.4, alpha: 0.85 }); }
      if (dead <= 0) { dead = 0; recover = P.recovery; hud.burnout(false); hud.say('RECOVERY', P.recovery); if (audio && audio.duck) audio.duck(false); }
    } else if (recover > 0) {
      recover -= dt; const k = 1 - Math.max(0, recover) / P.recovery;
      hp = Math.round(P.hp * k); hud.setHp(hp, P.hp);
      if (mech) { mech.burn(0.72 * (1 - k)); if (recover <= 0.6 && !mech.act.Idle.isRunning()) { mech.act.Death.stop(); mech.act.Idle.reset().play(); } }
      if (recover <= 0) { recover = 0; hp = P.hp; hud.setHp(hp, P.hp); if (mech) mech.heal(); }
    }
  }

  hud.setHp(hp, P.hp);
  boot().catch((e) => { console.error('[combat-v24] Boot fehlgeschlagen', e); bootLine = '[combat-v24] Boot fehlgeschlagen: ' + (e && e.message); });

  return {
    name: 'combat-host', params: P, quelle: QUELLE, seam: combat, mobs, shots, hud, avatar, zaehler, AVATARE, SEKUNDAER, WAFFEN, hold,
    get eye() { return eye; }, get eyeFehler() { return eyeFehler; },
    get slotDice() { return slotDice; },
    get dice() { return dice; }, get diceFehler() { return diceFehler; },
    get ready() { return ready; }, get target() { return target; }, get hp() { return hp; }, get pop() { return pop; },
    get avatarId() { return avatarId; }, get mech() { return mech; }, get primary() { return primary; }, get bootLine() { return bootLine; },
    mountAvatar, cycleTarget,
    /** v25.1 · Kontext-Slot „Karte ansprechen". Der WIRT entscheidet, wann — Georgs Wahl: erst wenn
     *  der Autopilot angekommen ist. Der Kampf kennt keine Karten. */
    setKartenSlot(on) { kartenSlotAn = !!on; },
    get kartenSlot() { return kartenSlotAn; },
    slots: slotListe, slotAus,
    /** Sekundärwaffe (Rechtsklick) umstellen — Rakete oder Augapfel. */
    setSekundaer(id) { if (!WAFFEN[id]) return false; if (id === 'eyeball' && !eye) { note('Augapfel nicht verfügbar: ' + (eyeFehler || 'Studio-Rezept fehlt'), 5); return false; } P.secondary = id; note('Sekundär: ' + WAFFEN[id].name, 4); return true; },
    /** Größenverhältnis Spieler ↔ größter geladener Gegner — die Zahl hinter Georgs Befund. */
    groessen: groessenNow,
    /** ═══ KAPSELPROBE (v25/S4 · PLAN §6.4) ══════════════════════════════════════════
     *  `combat-shots` prüft Segment gegen Kugel — richtig für schnelle, gerade Geschosse. Vor einer
     *  BOGENWAFFE (Augapfel, 24 u/s mit Bogen) muss die Zahl auf dem Tisch liegen: in der Schussbahn
     *  waren es vor der Reparatur **0 von 10**. Also zählen, nicht vermuten.
     *
     *  **Und die Probe nennt die REICHWEITE mit**, sonst wird ihr Ergebnis falsch gelesen. Beim
     *  ersten Lauf am 05.09. kamen 0/10 heraus — aber nicht, weil die Hitbox nicht greift, sondern
     *  weil ein Wurf mit 24 u/s bei g = 22 höchstens `v²/g = 26 u` weit fliegt und das Ziel 148 u
     *  entfernt stand (sky-mobs spawnen bei 110–190 u). Eine Null, die zwei Ursachen haben kann,
     *  ist keine Messung. Also steht beides im Ergebnis, und die Probe sagt selbst, was der Fall war. */
    kapselprobe(n, wid) {
      const N = n || 10, id = wid || P.secondary;
      if (!WAFFEN[id]) return null;
      /* v25.2r · Am Boden ist die Probe wertlos, und sie war es STILL: `feuern()` geht direkt und
         umgeht `kannJetzt`, aber `update` taktet die Schüsse dort nicht (siehe oben). Das Ergebnis
         war zehnmal 0/10 mit dem Befund „die Hitbox greift nicht" — eine Aussage über einen
         Ausstieg, nicht über eine Kapsel. Eine Probe, die nicht messen kann, sagt das jetzt. */
      if (isWalk()) { note('Kapselprobe: nur im Flug — am Boden fliegen die Geschosse nicht', 5); return null; }
      const t = (target && !target.dead) ? target : mobs.naechster(camera, 1.2);
      if (!t) { note('Kapselprobe: kein Ziel im Blick — erst anwählen (Tab)', 5); return null; }
      target = t;
      const vorW = zaehler.probeWuerfe, vorT = zaehler.probeTreffer;
      const W = WAFFEN[id];
      // Reichweite der Bahn: Bogenwaffe = v²/g (flacher Wurf, 45°), flache Waffe = v × Lebensdauer.
      const reich = W.arc ? (W.speed * W.speed) / shots.params.grav : W.speed * shots.params.leben;
      const dist0 = mobs.mitte(t, _v).distanceTo(mech ? mech.muendung(_m) : rig.seat.getWorldPosition(_m));
      let k = 0;
      // Im Takt der Waffe, nicht schneller (Herleitung oben am Augapfel-Block).
      const takt = setInterval(() => {
        if (k >= N) { clearInterval(takt); return; }
        k++;
        if (feuern(id, true)) zaehler.probeWuerfe++;
      }, Math.max(700, Math.round((W.rate || 0.7) * 1000)));
      setTimeout(() => {
        const w = zaehler.probeWuerfe - vorW, tr = zaehler.probeTreffer - vorT;
        const dist1 = t.gone ? dist0 : mobs.mitte(t, _v).distanceTo(mech ? mech.muendung(_m) : rig.seat.getWorldPosition(_m));
        const drin = Math.min(dist0, dist1) <= reich;
        const befund = tr > 0 ? 'die Kapselprüfung greift'
          : (drin ? 'NULL BEI ZIEL IN REICHWEITE — die Kugel-Hitbox greift bei dieser Bahn nicht'
                  : 'null, aber AUSSER REICHWEITE (' + reich.toFixed(0) + ' u) — keine Aussage über die Hitbox');
        probeErgebnis = { waffe: id, wuerfe: w, treffer: tr, quote: w ? +(tr / w).toFixed(2) : 0,
                          reichweite: +reich.toFixed(1), distanz: +Math.min(dist0, dist1).toFixed(1), inReichweite: drin, befund };
        const txt = 'Kapselprobe ' + W.name + ': ' + tr + '/' + w + ' auf ' + probeErgebnis.distanz + ' u (Reichweite ' + probeErgebnis.reichweite + ' u)';
        console.info('[combat-v25] ' + txt + ' · ' + W.speed + ' u/s' + (W.arc ? ', Bogen' : ', flach')
          + ' · Kugel-Hitbox r ' + (t.hr || 0).toFixed(2) + ' u · ' + befund);
        note(txt, 7);
      }, N * Math.max(700, Math.round((W.rate || 0.7) * 1000)) + 3800);
      return { laeuft: N, waffe: id, ziel: t.K.name, distanz: +dist0.toFixed(1), reichweite: +reich.toFixed(1) };
    },
    /** ═══ POOLPROBE (v25.2r · SPRINT §6.3) ══════════════════════════════════════════
     *  Die offene Zahl aus v25: `kreisLeben` steht auf 0,28 s, aber der Wert war GERECHNET
     *  (0,28 × 34 / 0,9 = 11 Kreise je Wurf) und nie gemessen. Die Kapselprobe kann das nicht
     *  beantworten — sie zählt Treffer, und ihr Ergebnis wäre auch bei einem übergelaufenen
     *  Pool dasselbe. Also eine eigene Probe, die genau eine Frage stellt: wie viele Sprites
     *  leben GLEICHZEITIG, und fällt etwas aus?
     *
     *  Gemessen wird der ZUSTAND (`shots.belegt`) je Bild, nicht der Zähler `emitsMax` — ein
     *  Zähler überlebt ein Nullen nicht, der Pool schon.
     *
     *  **Und die Probe sagt, wenn sie nichts gesehen hat.** Ohne Fokus liefert der Browser
     *  keine Bilder; ein eingefrorenes Bild sieht dann aus wie ein perfekt ruhiger Pool. Steht
     *  `bilder` bei annähernd null, ist das Ergebnis KEINE Aussage — genau der Fehler, der die
     *  erste Messung am 08.09. gekostet hat. */
    poolprobe(n, wid) {
      const N = n || 6, id = wid || 'eyeball';
      const W = WAFFEN[id]; if (!W) return null;
      if (isWalk()) { note('Poolprobe: nur im Flug — am Boden fliegen die Geschosse nicht', 5); return null; }
      const z = shots.zaehler;
      const vor = { spur: z.spur, poolVoll: z.poolVoll, emits: z.emits, gefeuert: z.gefeuert, huepfer: z.huepfer };
      let spitze = 0, bilder = 0, laeuft = true, k = 0;
      const takt = W.rate || 0.7;
      const iv = setInterval(() => { if (!laeuft || k >= N) { clearInterval(iv); return; } k++; feuern(id, true); }, Math.max(300, Math.round(takt * 1000)));
      const beob = () => { if (!laeuft) return; bilder++; const b = shots.belegt; if (b > spitze) spitze = b; requestAnimationFrame(beob); };
      requestAnimationFrame(beob);
      const dauer = N * takt + shots.params.leben + 1.2;
      setTimeout(() => {
        laeuft = false; clearInterval(iv);
        const d = (f) => z[f] - vor[f];
        const kreise = d('gefeuert') ? +(d('spur') / d('gefeuert')).toFixed(1) : 0;
        const soll = +((eye ? eye.params.kreisLeben : 0.28) * W.speed / (eye ? eye.params.kreisAbstand : 0.9)).toFixed(1);
        const stumm = bilder < dauer * 10;   // < 10 fps über die ganze Probe = kein laufendes Bild
        poolErgebnis = {
          waffe: id, wuerfe: d('gefeuert'), bilder,
          spitze, von: shots.params.sprites, ausfaelle: d('poolVoll'),
          kreiseJeWurf: kreise, gerechnet: soll, deckel: EYE_SPUR_MAX,
          befund: stumm ? 'KEINE AUSSAGE — nur ' + bilder + ' Bilder in ' + dauer.toFixed(1) + ' s (Fenster ohne Fokus?)'
            : d('poolVoll') > 0 ? 'Pool läuft über: ' + d('poolVoll') + ' Ereignisse fielen aus — kreisLeben senken oder Pool vergrößern'
              : spitze >= shots.params.sprites ? 'Pool genau am Anschlag (' + spitze + '/' + shots.params.sprites + ') — kein Ausfall, aber keine Reserve'
                : 'Pool trägt die Last: Spitze ' + spitze + '/' + shots.params.sprites + ', ' + (shots.params.sprites - spitze) + ' frei',
        };
        console.info('[combat-v25] Poolprobe ' + W.name + ': Spitze ' + spitze + '/' + shots.params.sprites
          + ' · ' + kreise + ' Kreise je Wurf (gerechnet ' + soll + ', Deckel ' + EYE_SPUR_MAX + ')'
          + ' · ' + d('poolVoll') + ' Ausfälle · ' + bilder + ' Bilder · ' + poolErgebnis.befund);
        note('Poolprobe: Spitze ' + spitze + '/' + shots.params.sprites + ' · ' + d('poolVoll') + ' Ausfälle', 6);
      }, Math.round(dauer * 1000));
      return { laeuft: N, waffe: id, dauer: +dauer.toFixed(1), hinweis: 'Ergebnis in ' + dauer.toFixed(1) + ' s in combat.poolErgebnis' };
    },
    get poolErgebnis() { return poolErgebnis; },
    get probeErgebnis() { return probeErgebnis; },
    /** Prüfstand: Schaden ohne Gegner (Burnout-Test). Derselbe Pfad wie ein Treffer, nur die Kugel fehlt. */
    schaden(n) { const at = mech ? mech.muendung(_m.clone()) : rig.seat.getWorldPosition(_m.clone()); spielerTreffer({ shot: { w: { dmg: n || 10 } }, punkt: at, richtung: new THREE.Vector3(0, 0, 1) }); },
    get tot() { return dead > 0; }, get erholt() { return recover > 0; },
    get mechActive() { return !!mech; },

    /** Je Bild, in `stepWorld` VOR den Ereignissen (EINBAU §3 C). st = flight.state (einmal gelesen). */
    update(dt, st) {
      zaehler.dt++;
      /* v25.1 · Die Leiste je Bild abgleichen. `setSlots` baut nur neu, wenn sich die SIGNATUR
         ändert (IDs + Zeichen + Taste) — also beim Waffenwechsel und beim Kontext-Slot, nicht 60×
         pro Sekunde. Der Zustand (Abklingzeit) geht jedes Bild durch, er kostet zwei Zuweisungen. */
      hud.setSlots(slotListe());
      // v25.2e · Farbabgleich im Takt: ein Zahlenvergleich, und er fängt den Pet-Tausch mit.
      { const f = avatarFarbe(); if (f !== farbeLetzt) { farbeLetzt = f; slotDice.faerben(f); } }
      const wp = WAFFEN[primary], ws = WAFFEN[P.secondary];
      const kannJetzt = dead <= 0 && recover <= 0 && !isWalk();
      hud.setSlotState('w1', { cool: wp ? cool.p / Math.max(0.05, wp.rate) : 0, bereit: kannJetzt && cool.p <= 0, aktiv: hold.p });
      hud.setSlotState('w2', { cool: ws ? cool.s / Math.max(0.05, ws.rate) : 0, bereit: kannJetzt && cool.s <= 0, aktiv: hold.s });
      // Pet/Teppich-Sichtbarkeit: der Modus-Wechsel setzt `pet.visible = true` — hier gilt der Avatar
      const pet = petOf();
      if (pet && pet.object3D) pet.object3D.visible = petSichtbar();   // v25.2k · EINE Regel (§ avatarFarbe)
      if (mech) setPad(false);
      // 1 · Naht takten: Kontaktschatten für alle lebenden Gegner
      const alive = mobs.alive();
      combat.update(dt, alive.map((e) => ({ ziel: e, vis: e.g, breite: e.hr * 1.6 })));
      if (mech) mech.update(dt);
      for (const [id, s] of streak) { s.t += dt; if (s.t > P.streakFenster) streak.delete(id); }
      /* ═══ v25.2r · AM BODEN WIRD NICHT GEFEUERT — ABER ES WIRD LEERGEFLOGEN ══════════════
         Der Ausstieg hier lag bis heute VOR `shots.update` (Zeile ~690). Am Boden nicht zu
         kämpfen ist Absicht (`kannJetzt` prüft `!isWalk()`); Geschosse einzufrieren war keine.
         Das ist eine CODE-TATSACHE, keine Zeitmessung: der `return` steht vor dem einzigen
         Aufruf von `shots.update`, also wird im Bodenmodus kein Geschoss getaktet — es fliegt
         nicht, es trifft nicht, es verfällt nicht. (Der Versuch, das am 08.09. auch zu MESSEN,
         ist gescheitert: im Vorschaurahmen ohne Fokus liefert `requestAnimationFrame` keine
         Bilder, und ein Standbild sieht genauso aus wie ein Leck. Deshalb steht hier die
         Ableitung und nicht eine Zahl — und deshalb gibt es `poolprobe`, die selbst sagt, ob
         sie überhaupt Bilder gesehen hat.)
         Die Folge: wer mitten im Gefecht landet, nimmt seine fliegenden Schüsse mit in den
         Bodenmodus, und dort bleiben sie stehen — sie belegen den Schuss-Pool (48) und den
         Sprite-Pool (64) auch nach dem Zurückwechseln in den Flug, und ab da fällt jeder Puff
         aus. Das ist keine Frage der Drosselung, sondern ein Leck.

         Also: getaktet wird immer, aber am Boden OHNE Trefferwelt — keine Hitboxen, kein
         Spielerziel. Die Geschosse fliegen ihre Bahn aus, setzen auf und verfallen; treffen kann
         am Boden nichts, was der Absicht entspricht. `shots.update` räumt selbst auf (`kill`),
         der Rückgabewert wird deshalb bewusst verworfen. */
      if (isWalk()) shots.update(dt, { hitboxes: [], spieler: null, groundHeightAt });
      if (!ready || isWalk()) { hud.setTarget(null); hud.update(dt); return; }
      const S = st.position, fwd = st.forward;
      // Erbe und Vorhalt-Rahmen aus DERSELBEN Quelle (siehe `spielerVel`).
      if (st.vDir && typeof st.speed === 'number') spielerVel.copy(st.vDir).multiplyScalar(st.speed);
      // 2 · Gegner: Ruhelage wandert, Position = Ruhelage + Knock (der Wirt schreibt)
      let kmax = 0;
      const ev = mobs.update(dt, { spieler: S, forward: fwd, camera, spielerTot: dead > 0 || recover > 0,
        knockOf: (vis) => { const k = combat.knockOf(vis); const l = k.length(); if (l > kmax) kmax = l; if (l > 1e-4) zaehler.knockAngewandt++; return k; } });
      // Erster Auslöser der HP-Leiste: irgendein Mob ist scharf. Solange das gilt, läuft die
      // Restzeit nicht ab — die Leiste steht durch den ganzen Kampf und geht danach.
      if (mobs.mobs.some((m) => m.aggro && m.e.some((x) => !x.dead))) hud.kampfPuls(4.5);
      if (kmax > zaehler.knockMax) zaehler.knockMax = kmax;
      // Geschwindigkeit der Gegner für den Vorhalt: aus zwei Bildern, nicht aus einer Absicht
      for (const e of alive) {
        if (!e.__prev) { e.__prev = e.ruhe.clone(); e.__vel = new THREE.Vector3(); continue; }
        /* v25.2c · 0,15 statt 0,3: die Zielgeschwindigkeit wird jetzt mit bis zu 3,2 s multipliziert
           (gelöste Flugzeit statt 1,2-s-Deckel). Bei 0,3 wandert der Zielpunkt bei 40 u/s Zielfahrt
           um mehrere Meter je Bild — geglättet steht er. */
        _v.copy(e.ruhe).sub(e.__prev).divideScalar(Math.max(dt, 1e-3)); e.__vel.lerp(_v, 0.15); e.__prev.copy(e.ruhe);
      }
      // Gegnerschüsse: Energiekugel aus dem Roster (kfb-combat-def enemyShot)
      for (const f of ev.feuer) {
        const w = enemyShot(f.e.K);
        shots.fire({ from: f.from, dir: f.dir, w, mine: false, bs: f.e.bs, seed: Math.floor(rng() * 1e9) });
        shots.emit('punkt', f.from, { color: f.e.bolt, size: 0.85 * f.e.bs, size1: 1.3 * f.e.bs, life: 0.075, op: 0.95 });
        combat.schuss({ sfx: 'launch.enemy', seed: 5, at: f.from });
      }
      for (const a of ev.aufschlag) {
        const zelle = resolveImpact('hot', 'earth', true);
        shots.einschlag(a.at, new THREE.Vector3(0, -1, 0), zelle, ENERGY.hot, 1.6);
        combat.schuss({ sfx: 'impact.hot.earth', seed: 6, at: a.at });
        if (o.terrain && o.terrain.spawnRipple) { const c = new THREE.Color(a.e.bolt); o.terrain.spawnRipple(a.at.x, a.at.z, [c.r, c.g, c.b], { life: 2.4, alpha: 0.6 }); }
      }
      // 3 · Geschosse fliegen, treffen
      const spielerPos = (dead > 0 || recover > 0) ? null : _w.copy(S).setY(S.y + 0.6);
      const hits = shots.update(dt, { hitboxes: mobs.hitboxes(), spieler: spielerPos, groundHeightAt });
      for (const h of hits.treffer) {
        trefferAmGegner(h, h.shot.w, false);
        if (h.shot.splash) for (const e of alive) if (e !== h.e && !e.dead && mobs.mitte(e, _v).distanceTo(h.punkt) < h.shot.splash) trefferAmGegner({ e, punkt: _v.clone(), richtung: h.richtung, shot: h.shot }, h.shot.w, true);
      }
      for (const h of hits.spieler) spielerTreffer(h);
      for (const h of hits.boden) {
        const w = h.shot.w, zelle = resolveImpact(w.energy, 'earth', (w.heft || 0) >= 0.6);
        shots.einschlag(h.punkt, h.richtung, zelle, ENERGY[w.energy] || ENERGY.kinetic, h.shot.mine ? 1 : 0.7);
        if (h.shot.mine) combat.module.cues.impact({ energy: w.energy, surface: 'earth', heavy: (w.heft || 0) >= 0.6, at: h.punkt, seed: h.shot.seed });
        /* ═══ v25.2c · DER SCHUSS INS LEERE MACHT FARBE ══════════════════════════════════
           Georgs Vorschlag (05.09.): „Schüsse ohne Target könnten eine zufällige Farbwelle
           auslösen." Er trifft die Regel dieses Projekts, statt sie zu brechen: die Wellen sind
           ausdrücklich **Ereignisse, kein Metronom** (travel-poc § Auslöser) — Aufsetzen,
           Grenzübertritt, Karte durchflogen. Ein Schuss, der KEIN Ziel hatte, ist genau so ein
           Ereignis, und die Welle gibt ihm die Folge, die der Treffer nicht hatte.
           Zwei Bedingungen, damit es Ursache bleibt und nicht Deko wird:
             · nur beim EIGENEN Schuss ohne Ziel (`mine` und `frei`), am Einschlagpunkt — nicht
               unter dem Spieler, sonst wäre die Welle über das Ziel gelogen;
             · eine Sperre von 0,45 s. Dauerfeuer läuft mit 9 Schuss/s, und es gibt acht
               Wellenplätze (voxel-terrain): ohne Sperre überschriebe eine Salve alle acht und
               keine einzige wäre zu Ende gelaufen. */
        if (h.shot.mine && h.shot.frei && o.welle && wellenSperre <= 0) { wellenSperre = P.welleSperre; zaehler.wellen++; o.welle(h.punkt, w); }
        if (h.shot.splash && h.shot.mine) for (const e of alive) if (!e.dead && mobs.mitte(e, _v).distanceTo(h.punkt) < h.shot.splash) trefferAmGegner({ e, punkt: _v.clone(), richtung: h.richtung, shot: h.shot }, w, true);
      }
      // 4 · Ziel: Lock auf den nächsten im Blick, solange kein gewähltes Ziel lebt
      if (target && (target.dead || target.gone)) target = null;
      if (!target) target = mobs.naechster(camera, P.lockRad);
      if (target) { mobs.mitte(target, _v).project(camera); const r = renderer.domElement.getBoundingClientRect(); hud.setTarget(_v, target.K.name + ' ' + Math.max(0, Math.round(target.hp)) + '/' + target.hp0 + (target.mob.aggro ? ' · AGGRO' : ''), r.width, r.height); }
      else hud.setTarget(null);
      // 5 · Feuern (halten = Dauerfeuer). Hornet: 3er-Salve mit Lücke (burstGap).
      const kann = dead <= 0 && recover <= 0;
      cool.p = Math.max(0, cool.p - dt); cool.s = Math.max(0, cool.s - dt);
      wellenSperre = Math.max(0, wellenSperre - dt);
      const w = WAFFEN[primary];
      if (kann && hold.p && cool.p <= 0) { cool.p = w.rate; feuern(primary); if (w.burst) { burst = w.burst - 1; burstT = w.burstGap || 0.07; } }
      if (burst > 0) { burstT -= dt; if (burstT <= 0) { burst--; burstT = w.burstGap || 0.07; if (kann) feuern(primary); } }
      if (kann && hold.s && cool.s <= 0) { cool.s = WAFFEN[P.secondary].rate; feuern(P.secondary); }
      // 6 · Burnout / Recovery
      stepBurnout(dt);
      // 7 · Selbstheilung (v25.1d). NUR bei Ruhe, nie im Burnout oder in der Erholung — die
      // besitzen `hp` schon (ein zweiter Schreiber auf derselben Zahl wäre genau der Fehler, den
      // dieses Projekt öfter gemacht hat als jeden anderen).
      if (P.regen > 0 && dead <= 0 && recover <= 0) {
        ruheT += dt;
        if (ruheT > P.regenDelay && hp < P.hp) {
          hp = Math.min(P.hp, hp + P.regen * dt);
          zaehler.geheilt += P.regen * dt;
          hud.setHp(hp, P.hp);
        }
      }
      hud.update(dt);
    },

    zeile() {
      const G = groessenNow();
      return 'combat-host · ' + zaehler.schuesse + ' Schüsse · ' + zaehler.treffer + ' Treffer · ' + zaehler.kills + ' Kills (' + zaehler.mobKills + ' Mobs) · Pop ' + pop
        + ' · HP ' + Math.round(hp) + ' · ' + zaehler.tode + ' Burnouts'
        + (P.regen > 0 ? ' · Selbstheilung ' + P.regen + '/s (' + Math.round(zaehler.geheilt) + ' HP)' : ' · Selbstheilung aus')
        + ' · Mech ' + G.mech + ' u / Gegner ' + G.gegner + ' u = ×' + G.faktor
        + ' · Sekundär ' + WAFFEN[P.secondary].name
        + ' · Vorhalt ' + zaehler.letzterVorhalt.toFixed(2) + ' s' + (zaehler.wellen ? ' · ' + zaehler.wellen + ' Wellen aus Fehlschüssen' : '') + (zaehler.zuWeit ? ' · ' + zaehler.zuWeit + '× außer Reichweite' : '')
        + ' · Knock max ' + zaehler.knockMax.toFixed(3) + ' u (' + zaehler.knockAngewandt + '× geschrieben) · ' + combat.zeile()
        + (eye ? ' · ' + eye.zeile() : '')
        + (dice ? ' · ' + dice.zeile() : '');
    },
    abweichungen() { const out = []; for (const k in QUELLE) if (QUELLE[k] !== P[k]) out.push({ feld: k, quelle: String(QUELLE[k]), ist: String(P[k]) }); return out; },
    /** Tor 2 · Naht (5 Nähte aus dem Adapter) + die Böden dieses Wirts, alle als ZAHL. */
    tor() {
      const t = combat.tor();
      const z = t.zeilen.slice(); let ok = t.bestanden, von = t.von, nm = t.nichtMessbar;
      const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
      const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };
      pruef(ready, 'Kampf geladen: ' + mobs.kinds.length + ' Gegnerarten, Avatar ' + (mech ? mech.name : 'Pet'), 'Kampf nicht geladen');
      // v25/S3 · **Das Größenverhältnis ist eine Zahl.** Georgs Befund („player avatar wirkt zu klein
      // verglichen mit enemy units") war in v24 richtig: 2,00 u gegen 2,72 u. Wer den Gegner-Regler
      // hochdreht, dreht ihn hier wieder falsch — und erfährt es an dieser Zeile statt im Bild.
      if (!mech || !mobs.kinds.length) offen('Größenverhältnis: ' + (mech ? 'kein Gegner geladen' : 'Cube-Pet als Avatar'));
      else {
        const G = groessenNow();
        pruef(G.faktor >= 1.05,
          'Größenverhältnis: Mech ' + G.mech + ' u gegen ' + G.gegner + ' u (' + G.wer + ') = ×' + G.faktor + ' — der Spieler ist die größere Figur',
          'Größenverhältnis: Mech ' + G.mech + ' u gegen ' + G.gegner + ' u (' + G.wer + ') = ×' + G.faktor + ' — der Spieler ist zu klein (Grenze ×1,05)');
      }
      // v25/S5 · Der Sprite-Pool ist der Engpass der Augapfel-Spur. Nicht vergrößern, bevor DIESE
      // Zahl es verlangt — die Drosselung (Kreisabstand 0,35 u, popRegen 5) steht oben mit Rechnung.
      pruef(shots.zaehler.poolVoll === 0,
        'Sprite-Pool trägt die Last: Spitze ' + shots.zaehler.emitsMax + ' von ' + shots.params.sprites + ' belegt, 0 Ausfälle',
        'Sprite-Pool war ' + shots.zaehler.poolVoll + '× voll (Spitze ' + shots.zaehler.emitsMax + '/' + shots.params.sprites + ') — Ereignisse fielen aus');
      if (!probeErgebnis) offen('Kapselprobe: nie gelaufen (combat.kapselprobe(10))');
      else if (!probeErgebnis.inReichweite && probeErgebnis.treffer === 0)
        offen('Kapselprobe ' + probeErgebnis.waffe + ': 0/' + probeErgebnis.wuerfe + ' auf ' + probeErgebnis.distanz
          + ' u bei ' + probeErgebnis.reichweite + ' u Reichweite — außerhalb, also keine Aussage über die Hitbox');
      else pruef(probeErgebnis.treffer > 0,
        'Kapselprobe ' + probeErgebnis.waffe + ': ' + probeErgebnis.treffer + '/' + probeErgebnis.wuerfe + ' auf ' + probeErgebnis.distanz + ' u (Reichweite ' + probeErgebnis.reichweite + ' u)',
        'Kapselprobe ' + probeErgebnis.waffe + ': 0 von ' + probeErgebnis.wuerfe + ' auf ' + probeErgebnis.distanz + ' u — in Reichweite und trotzdem nichts: die Kugel-Hitbox greift bei dieser Bahn nicht');
      if (!zaehler.treffer) offen('Knockback am Mesh: noch kein Treffer');
      else pruef(zaehler.knockMax > 0.01 && zaehler.knockAngewandt > 0, 'Knockback erreicht das Mesh: max ' + zaehler.knockMax.toFixed(3) + ' u, ' + zaehler.knockAngewandt + '× vom Wirt geschrieben', 'Knockback max ' + zaehler.knockMax.toFixed(3) + ' u bei ' + zaehler.treffer + ' Treffern \u2014 der Versatz kommt nicht am Mesh an');
      const feuerbar = combat.module.cues.namen(['kinetic', 'hot', 'wet', 'electric'], ['earth', 'metal', 'stone', 'wood', 'air', 'water'], Object.keys(WAFFEN));
      const bekannt = audio && audio.hasSfx ? feuerbar.filter((n) => audio.hasSfx(n)).length : null;
      if (bekannt == null) offen('Ton-Namen: Wirt kann sein Manifest nicht befragen');
      else pruef(bekannt > 0, bekannt + ' von ' + feuerbar.length + ' feuerbaren Namen im Manifest (Rest: Synthese, hörbar)', '0 von ' + feuerbar.length + ' Namen im Manifest');
      z.push('\u00b7 dt-Rufe Wirt ' + zaehler.dt + ' · Schüsse ' + zaehler.schuesse + ' · Treffer ' + zaehler.treffer + ' · Kills ' + zaehler.kills + ' · Pop ' + pop);
      // Das Tor der zugezogenen Waffe redet in diesem Wirt MIT (PLAN §6, Regel für jeden Schritt).
      if (eye) { const t2 = eye.tor(); ok += t2.bestanden; von += t2.von; nm += t2.nichtMessbar; z.push('— ' + t2.text); for (const l of t2.zeilen) z.push('  ' + l); }
      else z.push('– Augapfel: nicht geladen' + (eyeFehler ? ' (' + eyeFehler + ')' : '') + ' (nicht messbar)');
      if (dice) { const t3 = dice.tor(); ok += t3.bestanden; von += t3.von; nm += t3.nichtMessbar; z.push('— ' + t3.text); for (const l of t3.zeilen) z.push('  ' + l); }
      else z.push('– Würfel: nicht geladen' + (diceFehler ? ' (' + diceFehler + ')' : '') + ' (nicht messbar)');
      return { ok: ok === von, bestanden: ok, von, nichtMessbar: nm, zeilen: z, text: 'combat-v25: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
    },
  };
}
