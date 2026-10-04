/* pet-mouth.v1.js — KFB TALKING MOUTHS v1 (2026-07-19).
   Character-Animator-Muender (12 transparente PNGs, GitHub-raw) als flache Plane auf dem
   Body — KEIN Lip-Sync: Visem-Shuffle im Silbentakt (offene Formen haeufig, M/F/W-oo als
   Closer, Mikro-Pausen auf neutral) liest sich als Sprechen. Ruhe-Mund haengt am Mienenspiel
   (PetFace.onSet -> setRest). Jeder Wechsel ploppt kurz (Snap statt Crossfade).
   Platzierung: Surface-Fit-Raycast wie EyeRig (Plane liegt AUF der Koerperflaeche unter der
   Augen-Mitte, folgt Clip + Squash als Body-Kind). Bunny: KISS unter der Schnauze (dy-Regler);
   Schnauzen-Chirurgie + Knubbelnase = Pet-Editor-Scope (stripSnout), nicht hier.
   VERTRAG: build() nach ch.load, refit() nach Pet-Wechsel, update(dt) pro Frame. */

export const MOUTH_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/FrizzelBob-Mouth_01/';
export const MOUTH_FILES = {
  smile:   'FrizzleBobMouth_01_0000s_0001s_0000_Smile.png',
  neutral: 'FrizzleBobMouth_01_0000s_0001s_0001_Neutral.png',
  m:       'FrizzleBobMouth_01_0000s_0001s_0002_M.png',
  d:       'FrizzleBobMouth_01_0000s_0001s_0003_D.png',
  s:       'FrizzleBobMouth_01_0000s_0001s_0004_S.png',
  ee:      'FrizzleBobMouth_01_0000s_0001s_0005_Ee.png',
  uh:      'FrizzleBobMouth_01_0000s_0001s_0006_Uh.png',
  ah:      'FrizzleBobMouth_01_0000s_0001s_0007_Ah.png',
  oh:      'FrizzleBobMouth_01_0000s_0001s_0008_Oh.png',
  r:       'FrizzleBobMouth_01_0000s_0001s_0009_R.png',
  f:       'FrizzleBobMouth_01_0000s_0001s_0010_F.png',
  woo:     'FrizzleBobMouth_01_0000s_0001s_0011_W-oo.png',
  l:       'FrizzleBobMouth_01_0000s_0001s_0012_L.png',
};
export const FEMALE_MOUTH_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/FrizzleBob-FemaleMouth_01/';
export const FEMALE_MOUTH_FILES = {   // anderer Ordner/Prefix/Mittelsegment + vertauschte Indizes bei R/Oh (Brief 2026-07-22)
  smile:   'FrizzleFemaleMouth_01_0000s_0000s_0000_Smile.png',
  neutral: 'FrizzleFemaleMouth_01_0000s_0000s_0001_Neutral.png',
  m:       'FrizzleFemaleMouth_01_0000s_0000s_0002_M.png',
  d:       'FrizzleFemaleMouth_01_0000s_0000s_0003_D.png',
  s:       'FrizzleFemaleMouth_01_0000s_0000s_0004_S.png',
  ee:      'FrizzleFemaleMouth_01_0000s_0000s_0005_Ee.png',
  uh:      'FrizzleFemaleMouth_01_0000s_0000s_0006_Uh.png',
  ah:      'FrizzleFemaleMouth_01_0000s_0000s_0007_Ah.png',
  r:       'FrizzleFemaleMouth_01_0000s_0000s_0008_R.png',
  oh:      'FrizzleFemaleMouth_01_0000s_0000s_0009_Oh.png',
  woo:     'FrizzleFemaleMouth_01_0000s_0000s_0010_W-oo.png',
  f:       'FrizzleFemaleMouth_01_0000s_0000s_0011_F.png',
  l:       'FrizzleFemaleMouth_01_0000s_0000s_0012_L.png',
};
export const RED_MOUTH_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/FrizzleBob-RedMouth_01/';
// Drittes Set (2026-08-04, Georg). 12 PNG a 274x169 mit Alpha — GLEICHE Leinwand wie male/female,
// darum tragen size/dy/sx/lift/wrap unveraendert durch (kein refit-Sonderweg). Drei Abweichungen,
// die ein Copy-Paste aus dem male-Block still 404en lassen: eigener Prefix, 'Aa' statt 'Ah',
// grosses O in 'W-Oo'. Index-Reihenfolge ist umgekehrt (L..Neutral) — egal, es wird nach
// SCHLUESSEL gemappt, nicht nach Nummer.
// LUECKE: kein 'smile' (12 statt 13). Bewusst NICHT ersatzweise auf 'ee' gemappt — das waere ein
// Grinsen mit Zaehnen. Stattdessen faengt _fileFor() den fehlenden Schluessel ab und faellt auf
// 'neutral' zurueck; das Laecheln tragen die Mundwinkel (restMap.happy bend +0.35, §2e).
export const RED_MOUTH_FILES = {
  neutral: 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0011_Neutral.png',
  m:       'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0003_M.png',
  d:       'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0006_D.png',
  s:       'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0005_S.png',
  ee:      'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0004_Ee.png',
  uh:      'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0010_Uh.png',
  ah:      'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0009_Aa.png',
  oh:      'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0008_Oh.png',
  r:       'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0007_R.png',
  f:       'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0002_F.png',
  woo:     'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0001_W-Oo.png',
  l:       'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0000_L.png',
};
// Set-Registry: male = bisheriger Look (MOUTH_BASE/MOUTH_FILES bleiben als Alias fuer die Flug-Engine).
// fallback = Schluessel, der einspringt wenn ein Set eine Form nicht hat (unvollstaendige Saetze
// sind erlaubt, aber nie ein Ladeversuch auf base+'undefined').
export const MOUTH_SETS = {
  male:   { base: MOUTH_BASE, files: MOUTH_FILES },
  female: { base: FEMALE_MOUTH_BASE, files: FEMALE_MOUTH_FILES },
  red:    { base: RED_MOUTH_BASE, files: RED_MOUTH_FILES, fallback: 'neutral' },
};
// --- VISEME-SCHICHT v4 (2026-07-29, Handover PetStudio v3->v4 §2a) ------------------------
// FUENF benannte Sprech-Formen, keine 50: der Rest der Rede wird ueber Ohren/Squash getragen
// (Prime Directive: der ganze Koerper spricht). Die Viseme sind KEIN neuer Mund, sondern
// umschaltbare ZUSTAENDE der bestehenden 13 Decals — pro Set (male/female) dieselben Namen.
// Additiv + reversibel: setTex/talk/setRest/express bleiben unveraendert; wer die Viseme nicht
// benutzt, merkt nichts. Die ZUORDNUNG (welches Decal traegt welches Visem) ist eine
// aesthetische Entscheidung -> ueberschreibbar via params.visemeMap, Look gehoert Georg.
export const VISEMES = [
  ['closed', 'Zu'],       // Lippen zusammen (M/B/P) — der Closer
  ['open',   'Offen'],    // Kiefer auf (A/I) — der Traeger
  ['wide',   'Breit'],    // quer gezogen (E) — Betonung
  ['round',  'Rund'],     // gerundet (O/U) — Frage/Staunen
  ['smile',  'Laecheln'], // Ruhe-Freude, kein Sprechlaut
];
export const VISEME_IDS = VISEMES.map((v) => v[0]);
export const VISEME_MAP_DEFAULT = { closed: 'm', open: 'ah', wide: 'ee', round: 'oh', smile: 'smile' };
const TALK_POOL = ['ah', 'ee', 'oh', 'uh', 'd', 's', 'l', 'r'];   // offen = haeufig
const CLOSERS = ['m', 'f', 'woo'];                                 // Konsonanten-Momente
export const MOUTH_DEFAULTS = {
  size: 0.44,        // relativ zu U (halbe Body-Hoehe)
  dy: -0.52,         // Anker unter der Body-Mitte (U-Einheiten); Bunny: unter die Schnauze
  sx: 1,             // Breite-Faktor (quer ziehen, v9-Wunsch "größer/breiter")
  dx: 0,             // seitlicher Versatz (U-Einheiten) — z.B. female leicht links
  tilt: 0,           // Neigung ° um die OBERE Kante (Mund folgt der abwaerts gewoelbten Koerperform)
  rot: 0,            // Kippung ° (schiefer Mund = Charakter; animierbar)
  bend: 0,           // Bogen −1..1: + = Mundwinkel hoch (Smile-Kurve), − = runter
  rate: 1,           // Sprech-Tempo (1 = ~8-11 Visem-Wechsel/s)
  restMap: {   // v4: Ruhe-FORM je Ausdruck — Decal + Mundwinkel. String bleibt erlaubt (rueckwaerts-
               // kompatibel); ein Objekt {tex,bend,rot} praegt die Miene zusaetzlich ueber den Bogen.
    neutral:   { tex: 'neutral', bend: 0 },
    happy:     { tex: 'smile',   bend: 0.35 },
    angry:     { tex: 's',       bend: -0.45 },
    sad:       { tex: 'm',       bend: -0.55 },
    surprised: { tex: 'oh',      bend: 0 },
    thinking:  { tex: 'woo',     bend: -0.15, rot: -3 },
  },
  set: 'male',        // Mund-Set (male | female); female = eigener Ordner/Prefix, gleiche 13 Keys
  visemeMap: VISEME_MAP_DEFAULT,   // v4: Visem-Name -> Decal-Key (Look, ueberschreibbar)
  lift: 0.03,        // v4: Abstand der Mundflaeche VOR der Koerperflaeche (U-Einheiten). War hart
                     // verdrahtet (U*0.03); jetzt ein Regler, weil jedes Pet eine andere Woelbung hat.
  wrap: 1,           // v4: Anschmiegen 0..1 — 1 = jeder Eckpunkt sitzt auf der abgetasteten
                     // Koerperflaeche (Shrinkwrap), 0 = flache Ebene wie vor v4 (Rueckweg).
  onTop: false,      // v4: true = alter Zustand (depthTest aus, Mund liegt VOR allem). Default false:
                     // der Mund wird von Geometrie DAVOR (Schnauze, Ohr, Arm) verdeckt.
  slope: 0.05,       // v4.1: max. Tiefen-Wanderung je Spalte beim Anschmiegen (Anteil von U).
                     // Bremst die harte Stufe an der Wangenkante bei grossen Muendern aus.
                     // Rueckweg: <= 0 schaltet die Bremse aus (Verhalten wie vor v4.1).
};
export const MOUTH_META = [   // [key,label,min,max,step] — Bench-Slider
  ['size', 'Mund-Größe', 0.15, 0.9, 0.01],
  ['dy', 'Höhe (± unter Mitte)', -1.0, 0.15, 0.01],
  ['sx', 'Breite ×', 0.5, 2, 0.02],
  ['lift', 'Abstand (Auflage)', 0, 0.12, 0.002],
  ['wrap', 'Anschmiegen', 0, 1, 0.02],
  ['rate', 'Sprech-Tempo', 0.4, 2.2, 0.05],
];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

export class PetMouth {
  constructor(ch, opts = {}) {
    this.ch = ch; this.THREE = ch.THREE;
    this.p = Object.assign({}, MOUTH_DEFAULTS, opts.params || {});
    this.p.restMap = Object.assign({}, MOUTH_DEFAULTS.restMap, (opts.params && opts.params.restMap) || {});
    // wie restMap: teilweise gelieferte Maps ergaenzen den Default, statt ihn zu ersetzen
    this.p.visemeMap = Object.assign({}, VISEME_MAP_DEFAULT, (opts.params && opts.params.visemeMap) || {});
    this.viseme = null;   // aktuell gesetztes Visem (null = kein Visem im Spiel, Ruhe/Talk regiert)
    const setId = opts.set || (opts.params && opts.params.set) || 'male';
    this._setId = MOUTH_SETS[setId] ? setId : 'male';
    this._base = MOUTH_SETS[this._setId].base; this._files = MOUTH_SETS[this._setId].files;
    this._fb = MOUTH_SETS[this._setId].fallback || null;
    this.tex = {}; this.cur = 'neutral'; this.rest = 'neutral';
    this.enabled = true;
    this._talk = false; this._t = 0; this._next = 0; this._pop = 1;
    this._asp = 1.5; this._baseS = 0.2;
    this._cb = 0; this._cr = 0; this._ex = null;   // weiche Ist-Werte fuer bend/rot + Express-Override
    this._restForm = null;                          // v4: Ruhe-Form des aktuellen Ausdrucks
    this.mesh = null;
  }
  // Ein Set darf Formen fehlen (red hat kein 'smile'). _key loest den angefragten Namen auf den
  // Schluessel auf, der im aktuellen Set WIRKLICH eine Datei hat — sonst auf den Set-Fallback,
  // sonst null. Ohne das lief ein fehlender Schluessel in einen Ladeversuch auf base+'undefined'.
  _key(name) {
    if (name && this._files[name]) return name;
    if (this._fb && this._files[this._fb]) return this._fb;
    return null;
  }
  has(name) { return !!(name && this._files[name]); }
  get setId() { return this._setId; }
  _loadTex(name) {
    name = this._key(name);
    if (!name) return null;
    if (this.tex[name]) return this.tex[name];
    const T = this.THREE;
    if (!this._loader) { this._loader = new T.TextureLoader(); this._loader.setCrossOrigin('anonymous'); }
    const t = this._loader.load(this._base + this._files[name], (tx) => {
      tx.colorSpace = T.SRGBColorSpace;
      if (name === 'neutral' && tx.image && tx.image.height) { this._asp = tx.image.width / tx.image.height; this._applyScale(); }
    });
    t.anisotropy = 4;
    this.tex[name] = t;
    return t;
  }
  build() {
    const T = this.THREE;
    this.dispose();
    const mat = new T.MeshBasicMaterial({
      map: this._loadTex('neutral'), transparent: true, depthWrite: false, toneMapped: false,
      // v4: depthTest AN (ausser onTop) — der Mund gehoert IN den Koerper, nicht auf eine Glasscheibe
      // davor. polygonOffset haelt ihn trotz Tiefentest ueber der Flaeche (kein Z-Fighting bei
      // kleinem lift).
      depthTest: !this.p.onTop, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    });
    this.mesh = new T.Mesh(new T.PlaneGeometry(1, 1, 12, 3), mat);   // Segmente fuer den Bogen (Mundwinkel)
    this._basePos = this.mesh.geometry.attributes.position.clone();
    this._lastBend = 0;
    this.mesh.userData.petOverlay = true;
    this.mesh.raycast = () => {};
    this.mesh.renderOrder = 3;
    this.mesh.castShadow = false; this.mesh.frustumCulled = false;
    // alle Viseme warm laden (kleine PNGs) — kein weisses Aufblitzen beim ersten Talk
    for (const k in this._files) this._loadTex(k);
    this.refit();
  }
  // Surface-Fit wie EyeRig: geometrie-lokale BBox (pose-invariant), Raycast von vorn
  refit() {
    const T = this.THREE, ch = this.ch;
    if (!this.mesh || !ch.inner) return;
    const meshes = [];
    ch.inner.traverse((n) => { if (n.isMesh && !n.userData.petOverlay) meshes.push(n); });
    const body = meshes.find((m) => m.name && m.name.toLowerCase() === 'body') || meshes[0];
    if (!body) return;
    if (!body.geometry.boundingBox) body.geometry.computeBoundingBox();
    const bb = body.geometry.boundingBox;
    const sz = bb.getSize(new T.Vector3());
    const lc = bb.getCenter(new T.Vector3());
    const U = this._U = sz.y / 2;
    const mx = lc.x + U * (this.p.dx || 0), my = lc.y + U * this.p.dy;
    const ray = new T.Raycaster(); ray.layers.enableAll();
    body.updateMatrixWorld(true);
    const oW = body.localToWorld(new T.Vector3(mx, my, U * 3.5));
    const dW = new T.Vector3(0, 0, -1).transformDirection(body.matrixWorld).normalize();
    ray.set(oW, dW);
    const hit = ray.intersectObject(body, false)[0];
    const z = hit ? body.worldToLocal(hit.point.clone()).z : lc.z + U * 0.7;
    if (this.mesh.parent !== body) body.add(this.mesh);
    this.mesh.position.set(mx, my, z);   // v4: der Abstand sitzt jetzt pro Eckpunkt (lift), nicht in der Position
    this._baseS = U * this.p.size;
    this._applyScale();
    // Neigung um die OBERE Kante: der Fuss kippt nach hinten in den Koerper -> folgt der abwaerts gewoelbten Flaeche
    const ta = (this.p.tilt || 0) * Math.PI / 180;
    if (ta) { const h = this._baseS; this.mesh.position.y += (h / 2) * (1 - Math.cos(ta)); this.mesh.position.z -= (h / 2) * Math.sin(ta); }
    this.mesh.rotation.x = ta;
    this._shrinkwrap(body);
  }
  // v4: Anschmiegen. Statt EINER flachen Ebene tangential an EINEM Punkt wird jeder der 52 Eckpunkte
  // einzeln auf die Koerperflaeche abgetastet (Raycast entlang derselben Achse wie der Fit) und um
  // `lift` davor gesetzt. Warum: die flache Ebene stand an der gerundeten Wange ueber die Silhouette
  // hinaus — der Mund sah aus, als schwebte er vor dem Modell. Einmal pro refit, 52 Strahlen.
  // Eckpunkte, die den Koerper VERFEHLEN (Mund breiter als das Pet), erben die Tiefe ihres inneren
  // Nachbarn: die Flaeche flacht nach hinten ab statt vorzustehen. Viele Fehlschuesse = `sx` zu gross,
  // das melde ich in der Konsole — Anschmiegen kann keinen Koerper erfinden, der nicht da ist.
  _shrinkwrap(body) {
    const T = this.THREE, m = this.mesh;
    if (!m || !body) return;
    const base = this._basePos, pos = m.geometry.attributes.position;
    const liftL = this._U * (this.p.lift != null ? this.p.lift : 0.03);
    const w = this.p.wrap != null ? this.p.wrap : 1;
    this._wrapMiss = 0; this._wrapSpan = 0;
    if (!(w > 0)) {   // Rueckweg: flache Ebene, nur der Abstand
      for (let i = 0; i < pos.count; i++) pos.setZ(i, liftL);
      pos.needsUpdate = true; return;
    }
    body.updateMatrixWorld(true); m.updateMatrix(); m.updateWorldMatrix(true, false);
    const ray = new T.Raycaster(); ray.layers.enableAll();
    const dW = new T.Vector3(0, 0, -1).transformDirection(m.matrixWorld).normalize();
    const COLS = 13, tmp = new T.Vector3();
    const zs = new Array(pos.count).fill(null);
    for (let i = 0; i < pos.count; i++) {
      ray.set(m.localToWorld(tmp.set(base.getX(i), base.getY(i), 3)), dW);
      const hit = ray.intersectObject(body, false)[0];
      if (hit) zs[i] = m.worldToLocal(hit.point.clone()).z;
      else this._wrapMiss++;
    }
    // Fehlschuesse von innen nach aussen auffuellen (Zeile fuer Zeile, beide Richtungen)
    for (let r = 0; r * COLS < pos.count; r++) {
      const o = r * COLS, mid = o + ((COLS - 1) >> 1);
      for (let c = mid + 1; c < o + COLS && c < pos.count; c++) if (zs[c] == null) zs[c] = zs[c - 1];
      for (let c = mid - 1; c >= o; c--) if (zs[c] == null) zs[c] = zs[c + 1];
    }
    // v4.1 KNICK-BREMSE (Befund 2026-08-04 bei size 0.71 x sx 1.54, rote Lippen): ein Eckpunkt, der
    // um die Wangenkante herum eine ZURUECKWEICHENDE Flaeche traf — oder die Tiefe eines inneren
    // Nachbarn erbte — sprang in EINEM Schritt nach hinten. Ergebnis war eine harte Stufe/Falte in
    // der Lippe, die wie ein Render-Fehler aussieht. Jetzt darf die Tiefe von Spalte zu Spalte nur
    // um `slope` wandern (Anteil von U): aus der Stufe wird ein Auslauf. Das ERFINDET keinen Koerper
    // — zu breit bleibt zu breit und wird unten gemeldet —, aber die Flaeche liest sich als Lippe,
    // die um die Wange biegt, statt als Bruch. Rueckweg: slope <= 0 schaltet die Bremse aus.
    const maxStep = this._U * (this.p.slope != null ? this.p.slope : 0.05);
    if (maxStep > 0) {
      for (let r = 0; r * COLS < pos.count; r++) {
        const o = r * COLS, mid = o + ((COLS - 1) >> 1);
        for (let c = mid + 1; c < o + COLS && c < pos.count; c++) {
          if (zs[c] == null || zs[c - 1] == null) continue;
          const d = zs[c] - zs[c - 1];
          if (Math.abs(d) > maxStep) zs[c] = zs[c - 1] + Math.sign(d) * maxStep;
        }
        for (let c = mid - 1; c >= o; c--) {
          if (zs[c] == null || zs[c + 1] == null) continue;
          const d = zs[c] - zs[c + 1];
          if (Math.abs(d) > maxStep) zs[c] = zs[c + 1] + Math.sign(d) * maxStep;
        }
      }
    }
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      const z = (zs[i] != null ? zs[i] : 0) * w;   // w blendet zwischen flach (0) und angeschmiegt (1)
      if (z < lo) lo = z; if (z > hi) hi = z;
      pos.setZ(i, z + liftL);
    }
    this._wrapSpan = (hi - lo) / (this._U || 1);   // Woelbungstiefe in U — die Zahl fuers Changelog
    pos.needsUpdate = true;
    if (this._wrapMiss > pos.count * 0.25) console.warn('[PetMouth] Anschmiegen: ' + this._wrapMiss + '/' + pos.count + ' Eckpunkte treffen den Koerper nicht — sx/size zu gross? (Knick-Bremse slope=' + (this.p.slope != null ? this.p.slope : 0.05) + ' haelt die Flaeche glatt, kann den Koerper aber nicht verbreitern)');
  }
  _applyScale() { if (this.mesh) this.mesh.scale.set(this._baseS * this._asp * this._pop * (this.p.sx || 1), this._baseS * this._pop, 1); }
  setParams(p) {
    Object.assign(this.p, p || {});
    if (p && 'set' in p) this.setSet(p.set);
    if (p && p.visemeMap) this.setVisemeMap(p.visemeMap);
    if (p && 'onTop' in p && this.mesh) { this.mesh.material.depthTest = !this.p.onTop; this.mesh.material.needsUpdate = true; }
    // sx/lift/wrap aendern die Auflage -> neu abtasten (sonst schmiegt sich der alte Umriss)
    if (p && ('size' in p || 'dy' in p || 'dx' in p || 'tilt' in p || 'sx' in p || 'lift' in p || 'wrap' in p)) this.refit();
    else if (p && 'sx' in p) this._applyScale();
  }
  // v4 §2a: ein Visem setzen. Nur der MUND wechselt — Augen/Koerper bleiben unberuehrt (ein
  // Eigentuemer je Kanal). Wechsel = Material-Map-Tausch im selben Frame (kein Rebuild, keine
  // Geometrie-Aenderung). o.pop=true fuegt den Sprech-Plopp hinzu (Standard AUS, damit man beim
  // Abnehmen die Formen ohne Skalen-Zucken vergleichen kann). Rueckgabe: benutzter Decal-Key.
  setViseme(id, o = {}) {
    const key = this.p.visemeMap[id];
    if (!this._key(key)) { console.warn('[PetMouth] unbekanntes Visem:', id); return null; }
    if (!this.has(key)) console.info('[PetMouth] Set "' + this._setId + '" hat keine Form "' + key + '" — Visem "' + id + '" laeuft auf "' + this._fb + '" (Form traegt der Mundwinkel).');
    this.viseme = id;
    this.setTex(key, !!o.pop);
    if (o.rest !== false) this.rest = key;   // haelt das Visem gegen setRest/talk(false)
    return key;
  }
  // Look-Zuordnung aendern (Georgs Abnahme). Teil-Map erlaubt; das laufende Visem zieht mit.
  setVisemeMap(m) {
    if (!m) return;
    Object.assign(this.p.visemeMap, m);
    if (this.viseme && this.p.visemeMap[this.viseme]) this.setViseme(this.viseme);
  }
  get visemeKey() { return this.viseme ? this.p.visemeMap[this.viseme] : null; }
  // Laufzeit-Wechsel male<->female: Cache leeren, Set umstellen, Texturen neu warm laden, aktuelles Visem neu setzen.
  setSet(id) {
    id = MOUTH_SETS[id] ? id : 'male';
    if (id === this._setId) return;
    this._setId = id; this._base = MOUTH_SETS[id].base; this._files = MOUTH_SETS[id].files;
    this._fb = MOUTH_SETS[id].fallback || null;
    for (const k in this.tex) { const t = this.tex[k]; if (t && t.dispose) t.dispose(); }
    this.tex = {};
    if (this.mesh) {
      const cur = this._key(this.cur) || 'neutral';
      this.mesh.material.map = this._loadTex(cur); this.mesh.material.needsUpdate = true; this.cur = cur;
      for (const k in this._files) this._loadTex(k);
    }
  }
  get set() { return this._setId; }
  // pop=false: reiner Map-Tausch ohne Skalen-Plopp (v4 — gezielte Visem-Wechsel sollen die Form
  // zeigen, nicht die Skala; der Sprech-Shuffle behaelt den Plopp per Default).
  setTex(name, pop = true) {
    if (!this.mesh || !this._key(name)) return;
    this.mesh.material.map = this._loadTex(name);
    this.mesh.material.needsUpdate = true;
    if (pop && name !== this.cur) this._pop = 1.12;   // Snap-Pop bei jedem Wechsel
    this.cur = name;
  }
  // Ruhe-Mund folgt dem Mienenspiel (PetFace.onSet -> setRest(emoteId)). v4: der Eintrag darf eine
  // FORM sein ({tex,bend,rot}) statt nur eines Decals — damit praegt happy/sad/angry den Mund auch
  // ueber die Mundwinkel, nicht nur ueber das Bild. Waehrend des Sprechens tragen die Viseme die Form,
  // deshalb wirkt _restForm nur im Ruhezustand.
  setRest(emoteId) {
    this.viseme = null;
    const e = this.p.restMap[emoteId];
    if (e && typeof e === 'object') { this.rest = this._key(e.tex) || 'neutral'; this._restForm = e; }
    else { this.rest = this._key(e) || 'neutral'; this._restForm = null; }
    if (!this._talk) this.setTex(this.rest);
  }
  /** Ruhe-Form pro Ausdruck setzen/aendern (Look-Griff). Teil-Map erlaubt. */
  setRestMap(m) { if (!m) return; Object.assign(this.p.restMap, m); }
  talk(on) { this._talk = !!on; this._t = 0; this._next = 0; if (on) this.viseme = null; else this.setTex(this.rest); }
  get talking() { return this._talk; }
  talkBurst(dur = 1.6) { this.talk(true); clearTimeout(this._bt); this._bt = setTimeout(() => this.talk(false), dur * 1000); }
  // Bogen: Plane entlang X kruemmen — + hebt die Mundwinkel (Smile), − senkt sie (Frown)
  _applyBend(v) {
    if (!this.mesh || Math.abs(v - this._lastBend) < 0.001) return;
    this._lastBend = v;
    const pos = this.mesh.geometry.attributes.position, base = this._basePos;
    for (let i = 0; i < pos.count; i++) {
      const x = base.getX(i);
      pos.setY(i, base.getY(i) + v * 0.3 * (4 * x * x - 0.5));
    }
    pos.needsUpdate = true;
  }
  // Temporaerer Ausdrucks-Override (fuer Combos/FX): express({bend:0.8, rot:-8}, 1.2)
  // — faehrt weich hin und nach hold s weich auf die pet-Defaults zurueck.
  express(p, hold = 0.8) { this._ex = { p: p || {}, t: hold }; }
  update(dt, cam) {
    if (!this.mesh) return;
    this.mesh.visible = this.enabled;
    if (this._talk && this.enabled) {
      this._t += dt;
      if (this._t >= this._next) {
        this._t = 0;
        this._next = (0.07 + Math.random() * 0.09) / Math.max(0.1, this.p.rate);
        const r = Math.random(); let n;
        if (r < 0.62) n = pick(TALK_POOL);
        else if (r < 0.86) n = pick(CLOSERS);
        else { n = 'neutral'; this._next *= 1.7; }   // Mikro-Pause (Atem)
        if (n === this.cur) n = pick(TALK_POOL);
        this.setTex(n);
      }
    }
    this._pop += (1 - this._pop) * Math.min(1, dt * 14);
    this._applyScale();
    const ex = (this._ex && this._ex.t > 0) ? this._ex.p : null;
    if (this._ex) { this._ex.t -= dt; if (this._ex.t <= 0) this._ex = null; }
    // Ruhe-Form (Ausdruck) gilt nur im Ruhezustand — sprechend tragen die Viseme die Form.
    const rf = (!this._talk && !this.viseme) ? this._restForm : null;
    const tb = ex && ex.bend != null ? ex.bend : (rf && rf.bend != null ? rf.bend : (this.p.bend || 0));
    const tr = ex && ex.rot != null ? ex.rot : (rf && rf.rot != null ? rf.rot : (this.p.rot || 0));
    this._cb += (tb - this._cb) * Math.min(1, dt * 10);
    this._cr += (tr - this._cr) * Math.min(1, dt * 10);
    this._applyBend(this._cb);
    this.mesh.rotation.z = this._cr * Math.PI / 180;
    // View-Facing-Fade: der flache Mund blendet aus, sobald seine Frontnormale von der Kamera wegdreht
    // -> kein Ueberstand ueber die Body-Silhouette an schraegen Winkeln (kein "Floaten" vor dem Modell).
    if (cam && this.enabled) {
      const T = this.THREE;
      this.mesh.updateWorldMatrix(true, false);
      const n = new T.Vector3(0, 0, 1).transformDirection(this.mesh.matrixWorld).normalize();
      const wp = new T.Vector3().setFromMatrixPosition(this.mesh.matrixWorld);
      const vd = new T.Vector3().subVectors(cam.position, wp).normalize();
      const a = Math.max(0, Math.min(1, (n.dot(vd) - 0.12) / 0.33));
      this.mesh.material.opacity = a;
      this.mesh.visible = a > 0.02;
    }
  }
  dispose() {
    if (this.mesh && this.mesh.parent) this.mesh.parent.remove(this.mesh);
    if (this.mesh) { this.mesh.geometry.dispose(); this.mesh.material.dispose(); }
    this.mesh = null;
    clearTimeout(this._bt);
  }
}
try { if (typeof window !== 'undefined') window.PetMouth = PetMouth; } catch (e) {}
