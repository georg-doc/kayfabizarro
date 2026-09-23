/* FrizzleGraft v1 · cardrider.v1 — DIE ABGABE FÜR TRAVEL GLOBE.  13.09.2026
 *
 * QUELLE: »KFB Travel Globe · FrizzleBob Card Rider · Frankenstein Studio Briefing« (Georg, 13.09.).
 * Dieses Modul baut KEINE Flugphysik und keine Karte im Sinne von Travel. Es baut die
 * REFERENZGEOMETRIE der Karte (Briefing §5: »Card selbst nicht frei schönstellen. Sie ist
 * Referenzgeometrie.«), mißt den Actor dagegen und liefert die Felder aus §10.
 *
 * DIE MASSE SIND ZITIERT, NICHT GEMESSEN — und das steht hier, damit niemand sie für eine eigene
 * Messung hält. Briefing §3, Default vor Runtime-Skalierung:
 *     Breite 3,0 · Tiefe 3,0 × 447/800 = 1,67625 · Dicke 0,055 · Fläche 10 × 14 Segmente
 *
 * ⚠ DIE EINHEITENFRAGE, und sie entscheidet über die Brauchbarkeit der Abgabe: die Bühne des
 * Studios hat ihren eigenen Maßstab (die Figur steht dort bei ×0,42). Eine Zahl aus der Bühne wäre
 * in Travel bedeutungslos — dieselbe Falle wie `RACE.lift = −0,28` beim Wannen-Sitz. Deshalb ist
 * **die Karte der Maßstab**: sie wird in Bühnenmaßen so gebaut, daß sie relativ zur Figur stimmt,
 * und ALLE exportierten Zahlen stehen in **Card-Einheiten** (1 = Kartenbreite 3,0). `actorScale`
 * ist genau der Faktor, mit dem Travel die Figur auf seine echte Karte setzt.
 *
 * ⚠ `noMeasure` auf allem: die Platte darf den Boden, den Maßstab und die Blasengröße des Studios
 * nicht verschieben (Hausregel 7, hier schon zweimal bezahlt).
 */

export const SCHEMA = 'kfb.cardrider/0.1';

/* Zitat aus dem Briefing §3. */
export const CARD = { w: 3.0, d: 3.0 * 447 / 800, t: 0.055, segU: 10, segV: 14,
  source: 'Travel-Briefing §3 (travel/globe-v13/carpet.js, Default vor Runtime-Skalierung)' };
/* Das Kartenmotiv. Aus dem Repo kopiert (`media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png`),
   nicht verlinkt — ein Blatt, das aus dem Netz nachlädt, ist beim nächsten Ausfall ein leeres Blatt. */
export const CARD_ART = 'frizzlegraft-v1/kfb-card-backside.png';

/* Prüfzustände, Briefing §9. Winkel sind Prüfstellungen, keine Physik — Travel besitzt die Bewegung. */
export const STATES = {
  cruise:   { label: 'A · Cruise',     roll: 0,   pitch: 0 },
  bankL:    { label: 'B · Bank links', roll: 22,  pitch: 0 },
  bankR:    { label: 'C · Bank rechts',roll: -22, pitch: 0 },
  climb:    { label: 'D · Climb',      roll: 0,   pitch: 16 },
  descent:  { label: 'E · Descent',    roll: 0,   pitch: -16 },
  calm:     { label: 'G · Lesepult',   roll: 0,   pitch: 9 },
  combined: { label: 'H · Kombiniert', roll: 16,  pitch: 11 },
};

/* Briefing §7, WÖRTLICH übernommen — keine zweite Kurve. */
export const playerFacing = (speed01) => Math.max(0, Math.min(1, 1 - speed01 * 1.5));
export const FACING_PREVIEW = [
  { id: 'track',  label: 'TRACK',    speed01: 1.00 },
  { id: 'mix',    label: 'MIX 50 %', speed01: 0.33 },
  { id: 'player', label: 'PLAYER',   speed01: 0.00 },
];

/**
 * Die Referenzkarte bauen. `unit` = Bühnenmaße je Card-Einheit (1 Card-Einheit = 1,0 der
 * Briefing-Zahlen). Rückgabe enthält `setState`, `setUnit` und `dispose`.
 */
export function buildCard({ THREE, root, unit = 1, art = null, log = () => {} }) {
  const T = THREE, g = new T.Group();
  g.name = 'kfb-card';
  /* Die Fläche trägt das Motiv, die Kanten bleiben Papier. Reihenfolge der Box-Seiten in three.js:
     +x −x +y −y +z −z — das Motiv gehört auf +y (oben) und −y (unten), nicht auf die Schnittkanten. */
  const edge = new T.MeshStandardMaterial({ color: 0xe8e2d2, roughness: 0.85, metalness: 0 });
  const faceMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0 });
  const deck = new T.Mesh(
    new T.BoxGeometry(CARD.w, CARD.t, CARD.d, CARD.segU, 1, CARD.segV),
    [edge, edge, faceMat, faceMat, edge, edge]);
  deck.name = 'kfb-card-deck';
  let artStatus = 'ohne Motiv';
  if (art) {
    const tx = new T.TextureLoader().load(art,
      () => { faceMat.needsUpdate = true; log('Kartenmotiv geladen · ' + art); },
      undefined,
      () => { faceMat.color.setHex(0xb8361f); faceMat.map = null; faceMat.needsUpdate = true; log('⚠ Kartenmotiv nicht ladbar: ' + art); });
    if ('colorSpace' in tx) tx.colorSpace = T.SRGBColorSpace;
    /* ⚠ Korrektur 13.09. (Georg, am Bild): die alte Begründung hier war eine Annahme, keine
       Messung — »447 × 800 im Briefing« wurde als hochkant gelesen und um 90° gedreht. Die
       kopierte Datei ist aber 800 × 447, also schon QUER, genau wie die Karte selbst
       (w 3,0 > d 1,676) — keine Drehung nötig, sonst läuft die Schrift über Eck, sobald FB
       zur Kamera zeigt. Bleibt der Fall offen: -Math.PI/2 ist der einzige andere Kandidat,
       geprüft am Bild, nicht gerechnet. */
    tx.center.set(0.5, 0.5); tx.rotation = 0;
    faceMat.map = tx;
    artStatus = art;
  } else { faceMat.color.setHex(0xb8361f); }
  /* Ein schmaler Papierrand: die Silhouette der Karte soll im Bild ablesbar sein (Briefing §6
     »Silhouette aus Third-Person-Kamera sofort lesbar«), ohne die Fläche zu verändern. */
  const rim = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(CARD.w, CARD.t, CARD.d)),
    new T.LineBasicMaterial({ color: 0x2a2622, transparent: true, opacity: 0.5 }));
  rim.name = 'kfb-card-rim';
  /* Die Nase markieren — ohne sie ist »vorn« eine Behauptung. */
  const nose = new T.Mesh(new T.BoxGeometry(CARD.w * 0.18, CARD.t * 1.4, CARD.d * 0.06),
    new T.MeshStandardMaterial({ color: 0xf6efd9, roughness: 0.8 }));
  nose.position.set(0, CARD.t * 0.3, CARD.d * 0.46);
  nose.name = 'kfb-card-nose';
  g.add(deck, rim, nose);
  g.traverse((o) => { o.userData.noMeasure = true; o.userData.petOverlay = true; o.castShadow = false; o.receiveShadow = false; });
  root.add(g);

  const api = {
    group: g, deck, unit, art: artStatus,
    state: 'cruise',
    setUnit(u) { api.unit = +u || 1; g.scale.setScalar(api.unit); return api.unit; },
    /** Die Karte kippen — Prüfstellung, keine Physik. Der Actor hängt NICHT daran (Travel besitzt ihn). */
    setState(k) {
      const s = STATES[k] || STATES.cruise;
      api.state = STATES[k] ? k : 'cruise';
      g.rotation.set(s.pitch * Math.PI / 180, 0, s.roll * Math.PI / 180);
      return { ...s, id: api.state };
    },
    /** Die Oberkante der Karte an einer Stelle (Card-Einheiten, vor der Kippung). */
    topY() { return CARD.t / 2; },
    dispose() { root.remove(g); g.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach((m) => m.dispose()); }); },
  };
  api.setUnit(unit);
  api.setState('cruise');
  log('Referenzkarte gebaut · ' + CARD.w + ' × ' + CARD.d.toFixed(3) + ' × ' + CARD.t
    + ' Card-Einheiten · Bühnenmaß je Einheit ' + api.unit.toFixed(4));
  return api;
}

/**
 * Den Actor gegen die Karte messen. Alle Rückgaben in **Card-Einheiten**.
 * `unit` = Bühnenmaße je Card-Einheit (aus `buildCard`).
 */
export function measureActor({ THREE, figure, pose, unit, log = () => {} }) {
  const T = THREE, v = new T.Vector3();
  /* Blickrichtung und Querachse kommen aus dem Pose-Rig, wenn es steht — es hat sie GEMESSEN
     (Zehen bzw. Kopf-Host). Ohne Rig: +z, und das steht im Bericht. */
  const fwd = pose && pose.fwd ? pose.fwd.clone() : new T.Vector3(0, 0, 1);
  const side = pose && pose.side ? pose.side.clone() : new T.Vector3(1, 0, 0);
  const fsrc = pose && pose.fwd ? 'Pose-Rig (gemessen)' : 'Vorgabe +z';

  /* Fußpunkte: was an den Fußknochen hängt. Die Bounding-Box der ganzen Figur wäre die falsche
     Antwort — sie enthält Ohren, Arme und die Waffe (»Die Box ist nicht die Silhouette«). */
  const footBones = new Set();
  figure.traverse((n) => { if (n.isBone && /^foot|toe/i.test(n.name)) footBones.add(n); });
  const feet = { l: [], r: [] };
  let lowest = Infinity, allLow = Infinity;
  figure.traverse((m) => {
    if (!m.isSkinnedMesh || m.userData.noMeasure) return;
    const g2 = m.geometry, si = g2.attributes.skinIndex, sw = g2.attributes.skinWeight, bones = m.skeleton && m.skeleton.bones;
    if (!si || !bones) return;
    for (let i = 0; i < g2.attributes.position.count; i++) {
      let b = 0, bw = -1;
      for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; b = si.getComponent(i, j); } }
      const bone = bones[b];
      m.getVertexPosition(i, v); m.localToWorld(v);
      if (v.y < allLow) allLow = v.y;
      if (!bone || !footBones.has(bone)) continue;
      if (v.y < lowest) lowest = v.y;
      (/l$|left/i.test(bone.name) ? feet.l : feet.r).push(v.clone());
    }
  });
  const pts = feet.l.concat(feet.r);
  if (!pts.length) return { status: 'KEINE_FUESSE', bones: [...footBones].map((b) => b.name) };

  const ctr = pts.reduce((a, p) => a.add(p), new T.Vector3()).multiplyScalar(1 / pts.length);
  const along = pts.map((p) => v.copy(p).sub(ctr).dot(fwd));
  const across = pts.map((p) => v.copy(p).sub(ctr).dot(side));
  const span = (a) => Math.max(...a) - Math.min(...a);
  const mean = (list, axis) => list.length ? list.reduce((a, p) => a + v.copy(p).sub(ctr).dot(axis), 0) / list.length : 0;

  /* Figurenhöhe über die Knochenspanne wäre zu kurz (die Ohren tragen die Silhouette) — hier zählt
     der KONTAKT, also die Höhe über dem tiefsten Punkt der ganzen Figur. */
  const box = new T.Box3().setFromObject(figure);
  const height = box.max.y - allLow;
  const k = 1 / (unit || 1);   // Bühnenmaß → Card-Einheiten

  const front = Math.max(...along), rear = Math.min(...along);
  const rep = {
    status: 'OK', facing: fsrc, unit,
    footprintWidth: +(span(across) * k).toFixed(4),
    footprintDepth: +(span(along) * k).toFixed(4),
    frontFoot: +(front * k).toFixed(4),
    rearFoot: +(rear * k).toFixed(4),
    stagger: +((mean(feet.l, fwd) - mean(feet.r, fwd)) * k).toFixed(4),
    contactLowestY: +(lowest * k).toFixed(4),
    actorHeight: +(height * k).toFixed(4),
    points: pts.length,
    /* Die zwei Zahlen, an denen die Pose bestanden hat oder nicht: der Fußabdruck muß IN der Karte
       liegen. Verhältnis, nicht Absolutzahl (Hausregel). */
    fillWidth: +(span(across) * k / CARD.w).toFixed(3),
    fillDepth: +(span(along) * k / CARD.d).toFixed(3),
  };
  rep.insideCard = rep.fillWidth <= 1 && rep.fillDepth <= 1;
  log('Actor auf der Karte · Abdruck ' + rep.footprintWidth.toFixed(3) + ' × ' + rep.footprintDepth.toFixed(3)
    + ' Card-Einheiten (' + Math.round(rep.fillWidth * 100) + ' % der Breite, ' + Math.round(rep.fillDepth * 100)
    + ' % der Tiefe) · Höhe ' + rep.actorHeight.toFixed(3) + ' · Blick über ' + fsrc);
  return rep;
}

/** Die Abgabe nach Briefing §10. Was nicht gemessen ist, steht als `null` drin — nie geraten. */
export function exportCardRider({ measure, actor, pose, basePose, basePoseMatches, look, weapon, sources }) {
  const m = measure || {};
  return {
    $schema: SCHEMA,
    unit: 'card units (1 = card width ' + CARD.w + ', depth ' + +CARD.d.toFixed(5) + ')',
    card: { ...CARD },
    actorScale: actor && actor.scale != null ? actor.scale : null,
    actorOffsetX: actor && actor.x != null ? actor.x : 0,
    actorOffsetY: actor && actor.y != null ? actor.y : 0,
    actorOffsetZ: actor && actor.z != null ? actor.z : 0,
    actorYawOffset: actor && actor.yaw != null ? actor.yaw : 0,
    footprintWidth: m.footprintWidth ?? null,
    footprintDepth: m.footprintDepth ?? null,
    frontFoot: m.frontFoot ?? null,
    rearFoot: m.rearFoot ?? null,
    seatLift: actor && actor.seatLift != null ? actor.seatLift : (m.contactLowestY != null ? +(CARD.t / 2 - m.contactLowestY).toFixed(4) : null),
    contactLowestY: m.contactLowestY ?? null,
    actorHeight: m.actorHeight ?? null,
    fillWidth: m.fillWidth ?? null,
    fillDepth: m.fillDepth ?? null,
    insideCard: m.insideCard ?? null,
    basePose: basePose || 'CARD_SURF_BASE',
    basePoseMatches: basePoseMatches !== undefined ? !!basePoseMatches : null,
    pose: pose || null,
    rootForwardAxis: '+z (Wurzel des Actors)',
    faceForwardAxis: m.facing || null,
    facing: { rule: 'playerFacing = clamp(1 - speed01 * 1.5, 0, 1)', source: 'Travel-Briefing §7 — wörtlich, keine zweite Kurve' },
    look: look || null,
    /* v16-S5 · dieselben sechs Achsen wie `kfb.weapon-handoff.v1` (Animation Lab v4), benannt
       `euler`/`offset`/`scale` — das Lab liest sie als `manual`-Override, ohne Übersetzungsschicht. */
    weapon: weapon || null,
    sources: sources || null,
    generated: new Date().toISOString(),
  };
}

export default { SCHEMA, CARD, STATES, FACING_PREVIEW, playerFacing, buildCard, measureActor, exportCardRider };
