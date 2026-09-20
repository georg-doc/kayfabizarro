// ============================================================================
// globe-zones.js — KFB Travel Globe v3 · S3a · Standorte und Bauplätze
// ----------------------------------------------------------------------------
// Zwei Aufgaben, die zusammengehören und deshalb in EINER Datei stehen:
//
//   1. **Standorte planen** (`planSites`) — deterministisch, VOR dem Bake des Globus.
//      Das ist die Umsetzung von Entscheidung (2) aus `terrain-v17/prop-scatter.js`:
//      *„Die Standorte gehören dem Terrain, nicht diesem Modul. Wer den Boden zweimal
//      rechnet, hat zwei Höhen."* Bisher wählte der Streuer seine Orte selbst und ASYNCHRON
//      (nach dem Laden des Asset-Index) — dann ist der Globus längst gebacken und eine Zone
//      käme zu spät.
//   2. **Bauplätze planen** (`planZones`) — je Standort eine Zone im Höhenfeld: Zielhöhe aus
//      der MITTLEREN Höhe der Fläche, dazu eine leichte Neigung aus kleinsten Quadraten.
//      Eingetragen wird sie über `setTerrainZones` in `terrain-surface.js`, also in die EINE
//      Funktion, die Mesh, Flugphysik, Props und Schatten lesen.
//
// **Warum die mittlere Höhe und nicht die Höhe des Mittelpunkts:** ein Punkt kann auf einer
// Facettenkante liegen. Der Mittelwert über 17 Proben ist die Fläche, auf der das Gebäude
// wirklich steht — und die Neigung dazu hält die Zone im Gelände statt als Tischplatte darin.
//
// **Warum die Neigung geklemmt wird:** ein Sockel auf 25° liest als umgestürzt. 10° ist die
// Grenze, bei der ein Kenney-Turm noch „steht" — Georgs „leicht schräg ist ok".
// ============================================================================

import { rawDisplacementAt, setTerrainZones } from './terrain-surface.js';
import { nachruecken } from './verteilung.js';
import { isLand } from './globe-field.js';
import { seededRandom } from './spherical-math.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/**
 * Fibonacci-Gitter mit Seed-Drehung. Wasser und zu steile Stellen fallen heraus; gezählt wird,
 * was BLEIBT (das Gitter läuft über ein Vielfaches der Zielzahl).
 *
 * @returns [{ n, alt, yaw, sc, pick, slope }]
 */
/** ⚠ v9 · Nachrücken statt Wegwerfen — die Streuungsschicht (`verteilung.js`, Befund dort im Kopf).
 *  `nachruecken: false` gibt das v8-Verhalten zurück (Rückweisung), damit der Unterschied MESSBAR
 *  bleibt und nicht behauptet werden muss. */
export function planSites(o = {}) {
  const THREE = o.THREE, R = o.radius, seed = o.seed, type = o.terrainType;
  const ziel = o.count, salt = o.salt || 0;
  const maxSlope = o.maxSlope != null ? o.maxSlope : 0.45;
  const jitter = o.jitter != null ? o.jitter : 0.55;
  const over = o.overdraw != null ? o.overdraw : 6;
  const scaleVar = o.scaleVar != null ? o.scaleVar : 0.28;

  const rnd = seededRandom((seed | 0) + salt);
  const ga = Math.PI * (3 - Math.sqrt(5));
  const dreh = rnd() * Math.PI * 2;
  const kandidaten = Math.max(ziel, Math.round(ziel * over));
  const _t1 = new THREE.Vector3(), _t2 = new THREE.Vector3(), _p = new THREE.Vector3();
  const _Y = new THREE.Vector3(0, 1, 0), _X = new THREE.Vector3(1, 0, 0);
  const out = [];
  let imWasser = 0, zuSteil = 0, nachgerueckt = 0;
  const nachAn = o.nachruecken !== false;
  const nachRad = o.nachRadius != null ? o.nachRadius : 0.09;
  // Mindestabstand der SITZE, in Radiant. Voreinstellung 55 % des Idealabstands für die Zielzahl —
  // dieselbe Regel wie in `verteilung.streuen`, nur hier angewandt (eine Regel, zwei Aufrufer).
  const idealSep = 2 * Math.asin(Math.min(1, Math.sqrt(1 / Math.max(1, ziel))));
  const minSep = o.minSep != null ? o.minSep : idealSep * 0.55;

  const altOf = o.altFn ? ((v) => o.altFn(v.x, v.y, v.z))
                        : ((v) => rawDisplacementAt(seed, type, v.x, v.y, v.z));

  // Neigung: vier Nachbarproben im Tangentialrahmen. eps = 0,02 rad ≈ 0,1 Welteinheiten, also
  // die Kantenlänge EINER Facette (Umfang 31,4 / 256 Segmente = 0,12). Feiner gemessen liest man
  // die glatte Rauschfunktion INNERHALB einer Facette, nicht die Stufe, auf der der Sockel steht.
  function slopeAt(n, alt) {
    _t1.crossVectors(n, Math.abs(n.y) > 0.9 ? _X : _Y).normalize();
    _t2.crossVectors(n, _t1).normalize();
    const eps = 0.02;
    let max = 0;
    for (const [ax, s] of [[_t1, 1], [_t1, -1], [_t2, 1], [_t2, -1]]) {
      _p.copy(n).addScaledVector(ax, eps * s).normalize();
      max = Math.max(max, Math.abs(altOf(_p) - alt) / (eps * R));
    }
    return max;
  }

  /** Land + Neigung — der Platz selbst. Der Mindestabstand gehört NICHT hierher: er ist eine
   *  Beziehung zwischen Sitzen und wird im zweiten Durchgang geprüft (sonst hinge die Gültigkeit
   *  eines Platzes davon ab, in welcher Reihenfolge man ihn ansieht). */
  function landOk(n) {
    if (!isLand(seed, type, n.x, n.y, n.z)) return false;
    if (slopeAt(n, altOf(n)) > maxSlope) return false;
    return true;
  }
  // ⚠⚠ **Und hier saß der echte Fehler, gefunden von der neuen Streuungsmessung, nicht von mir.**
  // Die Schleife lief `while (out.length < ziel)` über eine Fibonacci-Spirale — und die ist nach
  // BREITE geordnet (y läuft monoton von +1 nach −1). Sobald die Zielzahl voll war, brach sie ab:
  // bei 26 Sitzen aus 1040 Kandidaten nach etwa Index 213, also **im ersten Fünftel der Spirale**.
  // Alle Sitze lagen damit in einer NORDKAPPE. Die Nachbarabstände sahen dabei tadellos aus (innerhalb
  // des Bandes gleichmäßig, Median 13,3° gegen Ideal 9,4°) — der Fehler war für jede
  // Nachbarschaftskennzahl unsichtbar und wurde erst von der Flächendeckung gemeldet (73 % der
  // Landfläche weiter als 1,5 Ideale von jedem Sitz).
  // *Eine Auswahl, die nach dem Erreichen einer Anzahl abbricht, erbt die Ordnung ihrer Quelle.*
  // Reparatur in zwei Durchgängen: erst die GANZE Spirale prüfen, dann aus den gültigen Plätzen
  // gleichmäßig über den Spiralindex ziehen — dieselbe Zahl Sitze, aber über alle Breiten.
  const frei = [];
  for (let i = 0; i < kandidaten; i++) {
    const y = 1 - (2 * (i + 0.5)) / kandidaten;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = ga * i + dreh + (rnd() - 0.5) * jitter * 0.12;
    let n = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).normalize();
    if (!landOk(n)) {
      const neu = nachAn ? nachruecken({ THREE, n, gueltig: landOk, maxRad: nachRad }) : null;
      if (!neu) {
        if (!isLand(seed, type, n.x, n.y, n.z)) imWasser++; else zuSteil++;
        continue;
      }
      n = neu; nachgerueckt++;
    }
    frei.push(n);
  }
  // Gleichmäßig über den Spiralindex greifen; wer den Mindestabstand verletzt, weicht auf den
  // nächsten freien Platz aus (kein Wegwerfen — dieselbe Regel wie beim Nachrücken).
  const stride = frei.length > 0 ? frei.length / ziel : 0;
  const genommen = new Uint8Array(frei.length);
  for (let k = 0; k < ziel && frei.length; k++) {
    const start = Math.min(frei.length - 1, Math.floor(k * stride));
    let gewaehlt = -1;
    for (let d = 0; d < frei.length; d++) {
      const idx = (start + (d % 2 ? -Math.ceil(d / 2) : Math.ceil(d / 2)) + frei.length) % frei.length;
      if (genommen[idx]) continue;
      const n = frei[idx];
      let nah = false;
      if (minSep > 0) for (const s of out) if (n.angleTo(s.n) < minSep) { nah = true; break; }
      if (nah) continue;
      gewaehlt = idx; break;
    }
    if (gewaehlt < 0) break;
    genommen[gewaehlt] = 1;
    const n = frei[gewaehlt];
    const alt = altOf(n);
    out.push({ n, alt, slope: slopeAt(n, alt), yaw: rnd() * Math.PI * 2,
               sc: 1 + (rnd() - 0.5) * 2 * scaleVar, pick: rnd() });
  }
  out.stats = { imWasser, zuSteil, kandidaten, gesetzt: out.length, nachgerueckt,
                gueltigePlaetze: frei.length,
                minSepGrad: +(minSep * 180 / Math.PI).toFixed(2), nachAn };
  return out;
}

/**
 * Je Standort eine Zone. `radiusOf(site)` liefert den WELT-Radius der Fläche, die das Modell
 * braucht (Grundfläche × Sicherheit); daraus wird der Winkelradius.
 *
 * @returns { zonen, count } — und die Zonen sind bereits in `terrain-surface` eingetragen.
 */
export function planZones(o = {}) {
  const THREE = o.THREE, R = o.radius, seed = o.seed, type = o.terrainType;
  const sites = o.sites || [];
  const radiusOf = o.radiusOf || (() => 0.12);
  const maxTilt = o.maxTilt != null ? o.maxTilt : 0.18;   // ≈ 10°
  const rampFactor = o.rampFactor != null ? o.rampFactor : 0.9;
  const minHeight = o.minHeight != null ? o.minHeight : 0.021;   // knapp über LAND_HEIGHT

  const _Y = new THREE.Vector3(0, 1, 0), _X = new THREE.Vector3(1, 0, 0);
  const _p = new THREE.Vector3();
  const zonen = [];

  for (const s of sites) {
    const rWelt = radiusOf(s);
    const rAng = rWelt / R;                       // Winkelradius (kleiner Winkel: r/R)
    const ex = new THREE.Vector3().crossVectors(s.n, Math.abs(s.n.y) > 0.9 ? _X : _Y).normalize();
    const ev = new THREE.Vector3().crossVectors(s.n, ex).normalize();

    // 17 Proben: Mitte plus zwei Ringe. Genug für Mittelwert und Neigung, wenig genug, dass
    // 26 Zonen zusammen unter 500 Rauschabfragen bleiben (der Bake macht 260 000).
    let sumH = 0, n = 0, sxx = 0, sxh = 0, syy = 0, syh = 0;
    const proben = [];
    proben.push({ u: 0, v: 0 });
    for (const ring of [0.66, 1.0]) {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        proben.push({ u: Math.cos(a) * ring, v: Math.sin(a) * ring });
      }
    }
    for (const pr of proben) {
      _p.copy(s.n).addScaledVector(ex, pr.u * rAng).addScaledVector(ev, pr.v * rAng).normalize();
      const h = rawDisplacementAt(seed, type, _p.x, _p.y, _p.z);
      const x = pr.u * rWelt, y = pr.v * rWelt;    // in WELT-Einheiten, damit die Neigung eine Steigung ist
      sumH += h; n++;
      sxx += x * x; sxh += x * h;
      syy += y * y; syh += y * h;
    }
    const h0 = sumH / Math.max(1, n);
    // Kleinste Quadrate um den Schwerpunkt: die Ringe sind symmetrisch, also fällt der
    // Kreuzterm heraus und die zwei Steigungen sind unabhängig.
    const a = sxx > 1e-9 ? clamp(sxh / sxx, -maxTilt, maxTilt) : 0;
    const b = syy > 1e-9 ? clamp(syh / syy, -maxTilt, maxTilt) : 0;

    s.zone = {
      n: s.n, radius: rAng, ramp: rAng * rampFactor,
      height: Math.max(minHeight, h0),
      // tilt gilt gegen `u = n·ex`, und u ≈ (Weltabstand)/R — deshalb Steigung × R.
      tiltU: a * R, tiltV: b * R, ex, ev,
    };
    // Der Standort steht ab jetzt auf der ZONE, nicht auf dem Rauschen.
    s.alt = s.zone.height;
    s.slopeZone = Math.hypot(a, b);
    zonen.push(s.zone);
  }

  const count = setTerrainZones(zonen);
  return { zonen, count };
}
