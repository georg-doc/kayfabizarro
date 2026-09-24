// KFB Cologne Race · Option C · DOM LOOP
//
// Die Strecke ist von Grund auf fuer diese Geografie geschrieben. FILAMENT #02
// (KilledByAPixel/SP13KTRA @166ad838, All rights reserved) diente ausschliesslich
// als Massstab fuer Tempo und merkbare Taktschlaege — kein Code, keine Kurventabelle,
// keine Koordinate, kein Weltmassstab uebernommen (SOURCE_PINS.filamentReferenceOnly).
//
// Taktfolge, gegen die die Strecke geschrieben wurde:
//   Auftakt -> Verengung/Tunnel -> schnelle Oeffnung -> technische Passage
//   -> Dachueberraschung -> weiter Bogen mit Dom-Blick -> sauberer Rueckweg
//
// Rahmen: OSM local-ENU, x=Ost, y=oben, z=Nord, Meter.
// Anker gemessen aus tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json:
//   Dom            way/4532022        x -301,298  z  -75,744   Grundriss 146,0 x 86,8 m, Hoehe 157,38 m
//   Hauptbahnhof   node/2399559029    x -223,020  z   87,263
//   Hohenzollern   relation/5460390   x  211,812  z  -62,121
//   Philharmonie   node/633480737     x -100,024  z -154,088
//   Museum Ludwig  node/633480736     x -156,300  z -129,721
//   Rheinufertunnel way/23559378      x   16,832  z -296,032  (layer -2)
//   Rhein          relation/11280522:0  Band x 50..881
//
// Topologie-Vokabular nach Brief §4: SURFACE_BOUND | STRUCTURE | TUNNEL.
// Wo die Strecke den Boden verlaesst, traegt sie ein eigenes Bauwerk. Es wird
// KEIN Gelaende angehoben, um eine Bruecke zu stuetzen.

export const TRACK_WIDTH = { NARROW: 14.4, STANDARD: 18.0, WIDE: 21.6, HERO: 28.8 };

// Kontrollpunkte: [x, z, y, breitenFaktor, art, name]
export const CONTROL_POINTS = [
  [-360,   40,   0.0, 1.15, 'SURFACE_BOUND', 'Start · Domplatte Nord'],
  [-250,   52,   0.0, 1.15, 'SURFACE_BOUND', 'Auftakt · Dom rechts'],
  [-120,   40,   0.0, 1.05, 'SURFACE_BOUND', 'Bahnhofsvorplatz'],
  [ -30,   18,  -3.0, 0.80, 'SURFACE_BOUND', 'Verengung'],
  [  30,   -6,  -9.0, 0.72, 'TUNNEL',        'Tunnelmund'],
  [  75,  -26,  -6.0, 0.74, 'TUNNEL',        'Tunnelausfahrt'],
  // Gemessen: die Bruecke belegt bei z −77…−47 ueber x 62…362 einen Bogenraum bis
  // y 37. Die Rampe lag mit z −50 und y 8 mitten darin — und mein Freistellen haette
  // dafuer die Bruecke weggeworfen. Die Rampe geht stattdessen NOERDLICH vorbei.
  // Damit sieht man die Bruecke beim Oeffnen, statt durch sie hindurchzufliegen.
  [ 150,  -10,  26.0, 1.10, 'STRUCTURE',     'Rampe zum Strom'],
  // Gemessener Konflikt: die Hohenzollernbruecke steht auf ihrem echten OSM-Anker
  // (x 211,812 / z −62,121), ihre Fahrbahn liegt bei y 12 und ihre Boegen reichen
  // bis y 37. Das alte Rheindeck lag bei y 14–18 und lief mitten hindurch.
  // Nicht die Bruecke wird verschoben — OSM besitzt das WO. Die Strecke steigt.
  // Damit fliegt sie ueber die echte Bruecke: der beste Moment der Runde.
  // Und auf Deckhoehe, BEVOR der Bogen kommt: der Schwenk nach Sueden kreuzt das
  // Brueckenband bei z −60, und dort muss die Strecke schon ueber dem Scheitel
  // (y 37) liegen, nicht erst auf halbem Weg dorthin.
  [ 215,  -14,  46.0, 1.20, 'STRUCTURE',     'Hohenzollern-Oeffnung'],
  [ 250, -170,  46.0, 1.00, 'STRUCTURE',     'Rheindeck Nord'],
  [ 255, -300,  46.0, 1.00, 'STRUCTURE',     'Rheindeck Sued'],
  [ 225, -400,  26.0, 0.92, 'STRUCTURE',     'Abstieg'],
  [ 140, -455,   2.0, 0.74, 'SURFACE_BOUND', 'Technische Einfahrt'],
  [  40, -450,   1.0, 0.72, 'SURFACE_BOUND', 'Doppelscheitel A'],
  [ -40, -400,   1.0, 0.72, 'SURFACE_BOUND', 'Doppelscheitel B'],
  [ -95, -330,   2.0, 0.85, 'SURFACE_BOUND', 'Ausgang technisch'],
  [-150, -270,  14.0, 0.85, 'STRUCTURE',     'Dachrampe'],
  [-215, -225,  26.0, 0.88, 'STRUCTURE',     'Dachlauf'],
  [-290, -205,  26.0, 0.95, 'STRUCTURE',     'Dachkante Sued'],
  [-390, -175,  12.0, 1.15, 'STRUCTURE',     'Abstieg zum Dom'],
  [-455, -110,   3.0, 1.25, 'SURFACE_BOUND', 'Dom-Blick'],
  [-465,  -30,   0.0, 1.20, 'SURFACE_BOUND', 'Westbogen'],
  [-430,   30,   0.0, 1.15, 'SURFACE_BOUND', 'Rueckweg'],
  [-395,   45,   0.0, 1.15, 'SURFACE_BOUND', 'Anfahrt Start']
];

export const ANCHORS = {
  dom:            { x: -301.298, z:  -75.744, osm: 'way/4532022',       name: 'Kölner Dom' },
  hbf:            { x: -223.020, z:   87.263, osm: 'node/2399559029',   name: 'Köln Hauptbahnhof' },
  hohenzollern:   { x:  211.812, z:  -62.121, osm: 'relation/5460390',  name: 'Hohenzollernbrücke' },
  deutzer:        { x:  266.235, z: -622.379, osm: 'relation/3837695',  name: 'Deutzer Brücke' },
  philharmonie:   { x: -100.024, z: -154.088, osm: 'node/633480737',    name: 'Kölner Philharmonie' },
  museumLudwig:   { x: -156.300, z: -129.721, osm: 'node/633480736',    name: 'Museum Ludwig' },
  rheinufertunnel:{ x:   16.832, z: -296.032, osm: 'way/23559378',      name: 'Rheinufertunnel' }
};

const catmull = (p0, p1, p2, p3, t) => {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
};

// Baut den geschlossenen Streckenverlauf. samplesPerSpan bestimmt die Aufloesung.
export function buildRoute({ samplesPerSpan = 26, baseWidth = TRACK_WIDTH.STANDARD } = {}) {
  const cp = CONTROL_POINTS;
  const n = cp.length;
  const raw = [];

  for (let i = 0; i < n; i++) {
    const p0 = cp[(i - 1 + n) % n], p1 = cp[i], p2 = cp[(i + 1) % n], p3 = cp[(i + 2) % n];
    for (let s = 0; s < samplesPerSpan; s++) {
      const t = s / samplesPerSpan;
      raw.push({
        x: catmull(p0[0], p1[0], p2[0], p3[0], t),
        z: catmull(p0[1], p1[1], p2[1], p3[1], t),
        y: catmull(p0[2], p1[2], p2[2], p3[2], t),
        w: catmull(p0[3], p1[3], p2[3], p3[3], t) * baseWidth,
        kind: t < 0.5 ? p1[4] : p2[4],
        seg: i,
        name: p1[5]
      });
    }
  }

  // Bogenlaenge, Tangenten, Kruemmung, Ueberhoehung
  let total = 0;
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i], b = raw[(i + 1) % raw.length];
    a.ds = Math.hypot(b.x - a.x, b.z - a.z, b.y - a.y);
    a.s = total;
    total += a.ds;
  }

  for (let i = 0; i < raw.length; i++) {
    const p = raw[i], nx = raw[(i + 1) % raw.length], pv = raw[(i - 1 + raw.length) % raw.length];
    const tx = nx.x - pv.x, tz = nx.z - pv.z, ty = nx.y - pv.y;
    const tl = Math.hypot(tx, tz, ty) || 1;
    p.tx = tx / tl; p.tz = tz / tl; p.ty = ty / tl;
    // Rechte Normale in der Grundebene
    const hl = Math.hypot(p.tx, p.tz) || 1;
    p.nx = p.tz / hl; p.nz = -p.tx / hl;
    // Vorzeichenbehaftete Kruemmung aus dem Richtungswechsel
    const h1 = Math.atan2(nx.z - p.z, nx.x - p.x);
    const h0 = Math.atan2(p.z - pv.z, p.x - pv.x);
    let dh = h1 - h0;
    while (dh > Math.PI) dh -= 2 * Math.PI;
    while (dh < -Math.PI) dh += 2 * Math.PI;
    p.curv = dh / Math.max(0.5, p.ds);
  }

  // Kruemmung glaetten — Option C will fliessende Baender, kein Mikro-Zickzack (§7)
  const smooth = (key, passes, radius) => {
    for (let k = 0; k < passes; k++) {
      const copy = raw.map(p => p[key]);
      for (let i = 0; i < raw.length; i++) {
        let sum = 0, cnt = 0;
        for (let d = -radius; d <= radius; d++) { sum += copy[(i + d + raw.length) % raw.length]; cnt++; }
        raw[i][key] = sum / cnt;
      }
    }
  };
  smooth('curv', 3, 5);
  smooth('w', 2, 4);

  // Ueberhoehung: Cartoon-Banking, aus der geglaetteten Kruemmung, gedeckelt
  for (const p of raw) {
    p.bank = Math.max(-0.42, Math.min(0.42, -p.curv * 26));
  }
  smooth('bank', 2, 4);

  return {
    points: raw,
    length: total,
    baseWidth,
    sampleAt(s) {
      const u = ((s % total) + total) % total;
      let lo = 0, hi = raw.length - 1;
      while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (raw[mid].s <= u) lo = mid; else hi = mid - 1; }
      const a = raw[lo], b = raw[(lo + 1) % raw.length];
      const t = a.ds > 0 ? (u - a.s) / a.ds : 0;
      const mix = (k) => a[k] + (b[k] - a[k]) * t;
      return {
        x: mix('x'), y: mix('y'), z: mix('z'), w: mix('w'),
        tx: mix('tx'), ty: mix('ty'), tz: mix('tz'),
        nx: mix('nx'), nz: mix('nz'),
        bank: mix('bank'), curv: mix('curv'), kind: a.kind, name: a.name, index: lo
      };
    },
    // Naechster Streckenpunkt zu einer Weltposition — fuer Rundenlogik und Rueckhalt
    nearest(x, z, hint = 0) {
      let best = hint, bestD = Infinity;
      const span = 90;
      for (let d = -span; d <= span; d++) {
        const i = (hint + d + raw.length * 2) % raw.length;
        const p = raw[i];
        const dd = (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z);
        if (dd < bestD) { bestD = dd; best = i; }
      }
      return { index: best, point: raw[best], dist: Math.sqrt(bestD) };
    }
  };
}

// Heldenkameras (CCTV) — Positionen aus der Streckengeometrie abgeleitet,
// nicht gestreut. Kriterium je Kamera ist benannt (§19).
export function heroCameras(route) {
  const pick = (frac, criterion, side, height, back, fov, shotType) => {
    const p = route.sampleAt(route.length * frac);
    return {
      cameraId: 'cctv-' + criterion.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      routeS: +(route.length * frac).toFixed(1),
      criterion, shotType, fov,
      position: {
        x: p.x + p.nx * side - p.tx * back,
        y: p.y + height,
        z: p.z + p.nz * side - p.tz * back
      },
      lookAt: { x: p.x, y: p.y + 2, z: p.z },
      triggerRadius: 46,
      heroPriority: 1
    };
  };
  return [
    // Gemessen und korrigiert: die erste Aufstellung stand SÜDLICH der Startgeraden
    // und blickte vom Dom weg. Der Dom liegt bei x −301 / z −76, die Gerade bei z ≈ +45.
    // Also nach Norden versetzen, höher hängen und nach Süden blicken — dann steht der
    // Dom hinter dem Fahrzeug im Bild.
    pick(0.075, 'Dom reveal opening', -44, 31, -66, 54, 'LANDMARK_REVEAL'),
    pick(0.245, 'Tunnel exit', -20, 9, 34, 38, 'TUNNEL_EXIT'),
    pick(0.415, 'Rhine bridge sweep', 30, 22, -18, 46, 'BRIDGE_SWEEP')
  ];
}
