// ============================================================================
// mech-avatar.js — KFB Travel Combat v25 · S1 · Der Mech als AVATAR
// ----------------------------------------------------------------------------
// Georgs Entscheidung (04.09.): „Ersetzt Karte + Pet, fliegt selbst (Jet-Mech)."
//
// Was das hier IST: eine HAUT über dem Fahrzeug. Bewegung, Höhe, Bank, Kufe, Kamera bleiben bei
// `flight-controller` + `card-carrier` (E-43, VERBOTENE_FELDER). Der Mech sitzt in `rig.seat`,
// genau dort, wo das Pet sitzt — nur die drei Teppich-Meshes (`rig.padParts`) werden unsichtbar.
// Damit erbt er Bank, Kippung und Barrel-Roll aus `rig.lean`, ohne dass eine zweite Flugphysik
// entsteht. Wer den Mech „fliegen" sieht, sieht das Fahrzeug von v20 ohne Karte.
//
// Vertrag (WIRT_v13 §1): Fabrik, kein Import-Nebeneffekt · EIN Knoten (`object3D`) · `update(dt)`
// bekommt dt herein · keine Position wird geschrieben (der Sitz gehört dem Rig).
//
// Quelle der Modelle und Clips: `KFB Mech Slice v8.dc.html` (#324 MECHS, #855 _loadMech).
// Die Signatur-Waffen sind Zeilen in `kfb-combat-def.js` (WEAPONS), nicht hier.
// ============================================================================

export const MECHS = [
  /* v25.2 · `farbe` ist DEKLARIERT, und zwar aus einem gemessenen Grund: die Space-Kit-Mechs tragen
     ihre Farbe in einer TEXTUR, nicht im Material. Die erste Fassung von `grundfarbe` wählte das
     gesättigteste Material und bekam **#ffffff** — richtig gerechnet, falsche Quelle. Ein
     Pixel-Abgriff auf dem Atlas wäre möglich, aber er hängt an CORS und an einem Bild, das beim
     ersten Bild noch nicht dekodiert ist; vier Zahlen mit ihrer Herkunft sind hier ehrlicher als
     eine Sonde, die manchmal antwortet. Die Werte sind am Modell abgelesen (Fernando pink, Barbara
     Bienengelb, Rae Rotbraun, Finn Froschgrün). Findet `grundfarbe` doch ein gesättigtes Material,
     gewinnt die MESSUNG — die Deklaration ist der Rückweg, nicht die Wahrheit. */
  { id: 'flamingo', file: 'Mech_FernandoTheFlamingo.gltf', name: 'Fernando · Flamingo', sig: 'stinger', farbe: 0xef5a9c },
  { id: 'bee',      file: 'Mech_BarbaraTheBee.gltf',       name: 'Barbara · Bee',       sig: 'hornet',  farbe: 0xf2c327 },
  { id: 'panda',    file: 'Mech_RaeTheRedPanda.gltf',      name: 'Rae · Red Panda',     sig: 'railgun', farbe: 0xc0532c },
  { id: 'frog',     file: 'Mech_FinnTheFrog.gltf',         name: 'Finn · Frog',         sig: 'acid',    farbe: 0x6cbf4a },
];
export const SPACE = 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Characters/GLTF/';
/* Zwei Hosts, jsDelivr zuerst. Beide antworten ehrlich mit 404 (v8-Befund: Cloudflare Pages
   liefert auf fehlende Pfade 200 + index.html). */
export const HOSTS = [
  'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/',
  'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/',
];
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
export async function loadGLTF(loader, path) {
  let err = null;
  for (const h of HOSTS) {
    try { return await loader.loadAsync(h + enc(path)); } catch (e) { err = e; }
  }
  throw err || new Error('GLTF nicht ladbar: ' + path);
}

export function createMechAvatar(o) {
  const THREE = o.THREE;
  const loader = () => o.loader;   // lazy: der GLTFLoader kommt aus einem dynamischen Import
  const QUELLE = {
    /* Zielhöhe im Sitz. Das Pet steht mit 1,15× bei ~1,1 u. Gemessen im Bild (04.09., 920×540, Follow-
       Kamera): 1,55 u füllten ~6 % der Bildhöhe und lasen als Spielfigur zu klein; 2,0 u ≈ 8 %, immer
       noch unter der 3,0-u-Karte, die der Mech ersetzt. Regler „Mech-Größe“ im Panel (lädt neu).

       v25 · 5.9. · **GEGEN DIE GEGNER GERECHNET, nicht geschätzt.** Georg: „player avatar/mech wirkt
       zu klein verglichen mit enemy units…?" — und er hatte recht, in Zahlen: `sky-mobs` skaliert
       jeden Gegner auf `K.h × scale` mit scale 1,6. Der Flieger steht damit bei 1,70 × 1,6 = **2,72 u**,
       die 17 Monster bei 1,60 × 1,6 = **2,56 u**, die KayKit-Körper bei 2,96 u. Der Mech stand bei
       2,00 u — also 26 % UNTER dem größten Flieger und 32 % unter dem größten Gegner überhaupt. Der
       Spieler war die kleinste Figur im Bild, und das war kein Eindruck, sondern der Roster.
       3,20 u legt ihn 18 % über den größten Flieger und auf die Höhe der 3,0-u-Karte, die er ersetzt.
       Die Zahl steht nicht allein da: `combat.tor()` rechnet sie JE MESSUNG gegen den geladenen Pool
       nach (Zeile „Größenverhältnis"). Dreht jemand den Gegner-Regler hoch, fällt das Tor durch,
       statt still falsch zu werden. */
    hoehe: 3.2,
    vorne: Math.PI,   // Space-Kit-Mechs schauen nach +Z; die Fahrtrichtung im Sitz ist −Z (wie das Pet)
    /* ═══ MÜNDUNGSVERSATZ (v25/S2 · PLAN §5, „kleinster Eingriff mit dem sichtbarsten Ergebnis") ══
       Georgs Befund: „weiße Kreise auf der Rückseite beim Abschuss". Ursache gemessen: `muendung`
       gab den Brust-BONE heraus — der liegt IM Körper. Additive Sprites mit `depthWrite: false`
       sind von hinten sichtbar, also sah man die hintere Hälfte des Blitzes durch das Modell.
       Die Lösung ist eine Länge, und sie kommt aus dem GEMESSENEN Körperradius (halbe größere
       Grundfläche × Einpass-Maßstab), nicht aus einem Bruchteil der Höhe: `rad × 0,9` bringt den
       Knoten an die Silhouette, `+ 0,18` eine Handbreit davor. Ein Bruchteil der Höhe wäre bei
       einem flachen Mech zu weit und bei einem hohen zu kurz — der Radius ist die Zahl, die die
       Silhouette wirklich beschreibt. Die RICHTUNG kennt der Mech nicht; sie kommt vom Wirt. */
    muendVor: 0.9, muendHand: 0.18,
    /* ═══ v25.1c · WIE TIEF DER MECH IM SITZ STECKT ═════════════════════════════════════════
       Georg, 05.09.: „er verdeckt die Karte zu stark, könnte auch tiefer floaten, die Mech-Beine
       müssen ja nicht sichtbar sein." Beides hängt an derselben Zahl. Der Mech ist seit v25 3,2 u
       hoch (gegen den Gegner-Roster gerechnet) — im Lesebild ist er damit die halbe Bildhälfte.
       `sitz` senkt ihn dauerhaft: bei −0,55 verschwindet das untere Sechstel (die Beine) unter der
       Kartenkante, der Rumpf bleibt ganz da. Er wird dadurch NICHT kleiner — seine Silhouette im
       Kampf bleibt die gerechnete, nur der Teil ohne Aussage geht.
       `tauchDock` senkt zusätzlich, während die Ankunftsregie führt: 1,1 u weiter, also gut ein
       Drittel des Körpers. Der Wirt multipliziert das mit dem Fortschritt, den er schon hat
       (`arrival.dockK`) — keine zweite Uhr, kein zweiter Zustand. */
    sitz: -0.55, tauchDock: 1.1,
  };
  const P = Object.assign({}, QUELLE, o.params || {});
  let cur = null;
  const _v = new THREE.Vector3();

  async function load(id) {
    const M = MECHS.find((m) => m.id === id) || MECHS[0];
    const g = await loadGLTF(loader(), SPACE + M.file);
    const root = g.scene;
    root.traverse((n) => { if (n.isSkinnedMesh) n.frustumCulled = false; if (n.isMesh) n.castShadow = true; });
    root.updateMatrixWorld(true);
    const bb = new THREE.Box3().setFromObject(root), size = bb.getSize(new THREE.Vector3());
    const sc = size.y > 0.01 ? P.hoehe / size.y : 1;
    // Körperradius im Weltmaß: halbe größere Grundfläche, mit dem Einpass-Maßstab. Grundlage des
    // Mündungsversatzes — gemessen am Modell, nicht aus der Höhe geschätzt.
    const rad = Math.max(size.x, size.z) * 0.5 * sc;
    const muendOff = rad * P.muendVor + P.muendHand;
    const object3D = new THREE.Group(); object3D.name = 'mech-avatar';
    root.scale.setScalar(sc); root.position.y = -bb.min.y * sc; root.rotation.y = P.vorne;
    object3D.add(root);
    const clips = {}; (g.animations || []).forEach((c) => { clips[c.name.split('|').pop()] = c; });
    const mixer = new THREE.AnimationMixer(root);
    const once = ['Shoot_Small', 'Shoot_Big', 'HitRecieve_1', 'HitRecieve_2', 'Death', 'Jump', 'Jump_Landing'];
    const act = {};
    for (const k of ['Idle', 'Walk', 'Run'].concat(once)) {
      const c = clips[k]; if (!c) continue;
      const a = mixer.clipAction(c);
      if (once.includes(k)) { a.loop = THREE.LoopOnce; a.clampWhenFinished = true; }
      act[k] = a;
    }
    // v8-Regel: Einmal-Clips werden gestoppt, sonst normiert der Mixer das Idle auf halbes Gewicht.
    mixer.addEventListener('finished', (e) => { if (e.action !== act.Death) e.action.stop(); });
    if (act.Idle) act.Idle.play();
    const mats = [];
    root.traverse((n) => {
      if (!n.isMesh || !n.material) return;
      for (const m of (Array.isArray(n.material) ? n.material : [n.material]))
        if (m.color) mats.push({ m, base: m.color.clone(), emis: m.emissive ? m.emissive.clone() : null });
    });
    const bones = {}; root.traverse((n) => { if (n.isBone) bones[n.name] = n; });
    const chest = bones.Chest || bones.Torso || bones.Spine || bones.Body || null;
    const ink = new THREE.Color(0x1f1a14);
    if (cur) cur.dispose();
    cur = {
      id: M.id, name: M.name, sig: M.sig, object3D, root, mixer, act, anims: g.animations || [], mats,
      hoehe: P.hoehe, sc, rad, muendOff, clips: Object.keys(clips),
      /* v25.2 · Die GRUNDFARBE des Avatars — die Slot-Würfel tragen sie (Georg: „Farbe der Dice
         entspricht der Base Color des Pets/Mechs"). Gewählt wird das gesättigteste Material, nicht
         das erste: die Space-Kit-Mechs haben mehrere graue Panels und EINE Signaturfarbe, und die
         graue hätte gewonnen, wäre sie zufällig vorn im Array. Gemessen statt geraten. */
      grundfarbe: (() => {
        const hsl = {}; let best = null, bs = 0.12;   // Schwelle: darunter ist es Grau, kein Signaturton
        for (const r of mats) { r.base.getHSL(hsl); const k = hsl.s * (0.35 + hsl.l); if (k > bs) { bs = k; best = r.base; } }
        return best ? best.getHex() : (M.farbe != null ? M.farbe : 0xf3ead3);
      })(),
      update(dt) { mixer.update(dt); },
      play(k) { const a = act[k]; if (!a) return false; a.reset().play(); return true; },
      /* Mündung: Brusthöhe des Rigs in Weltkoordinaten. Die Richtung kommt vom Wirt (Ziel oder
         Fahrtrichtung) — der Mech kennt kein Ziel.
         v25/S2 · **Mit `dir` wandert der Knoten VOR die Silhouette** (`rad × 0,9 + 0,18`, Herleitung
         an `muendVor`). OHNE `dir` bleibt es der Brust-Bone — und das ist richtig so: der
         Burnout-Rauch soll aus dem Körper kommen, nicht aus der Luft davor. */
      muendung(out, dir) {
        if (chest) chest.getWorldPosition(out); else { object3D.getWorldPosition(out); out.y += P.hoehe * 0.6; }
        if (dir) out.addScaledVector(dir, muendOff);
        return out;
      },
      // Burnout-Verkohlung 0…1 (v8 _stepBurnout) — der Wirt gibt den Fortschritt herein.
      burn(k) { for (const r of mats) { r.m.color.copy(r.base).lerp(ink, k); if (r.emis && r.m.emissive) r.m.emissive.copy(r.emis).lerp(ink, k); } },
      heal() { for (const r of mats) { r.m.color.copy(r.base); if (r.emis && r.m.emissive) r.m.emissive.copy(r.emis); } },
      dispose() { try { mixer.stopAllAction(); } catch (e) {} object3D.removeFromParent(); },
    };
    console.info('[avatar] ' + M.name + ' · ' + cur.clips.length + ' Clips · roh ' + size.y.toFixed(2) + ' u → ' + P.hoehe + ' u (sc ' + sc.toFixed(3) + ')'
      + (chest ? ' · Mündung an ' + chest.name : ' · Mündung geschätzt')
      + ' · Radius ' + rad.toFixed(2) + ' u → Versatz +' + muendOff.toFixed(2) + ' u vor die Silhouette'
      + ' · Grundfarbe #' + cur.grundfarbe.toString(16).padStart(6, '0'));
    return cur;
  }
  return { name: 'mech-avatar', MECHS, params: P, quelle: QUELLE, load, get current() { return cur; },
    abweichungen() { const out = []; for (const k in QUELLE) if (QUELLE[k] !== P[k]) out.push({ feld: k, quelle: String(QUELLE[k]), ist: String(P[k]) }); return out; },
    zeile() { return 'mech-avatar · ' + (cur ? cur.name + ' · ' + cur.hoehe.toFixed(2) + ' u · Mündung +' + cur.muendOff.toFixed(2) + ' u · ' + cur.clips.length + ' Clips' : 'kein Mech geladen'); } };
}
