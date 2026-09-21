// ============================================================================
// flora.js — v11 · KayKit-Flora (+ Kenney-Kleinzeug) als Reiter auf der Streuungsschicht
// ----------------------------------------------------------------------------
// Anlass (Georg, Formular 2.9.): „KayKit Bäume · Büsche · Gras/Stümpfe · Pilze/Blumen" in die
// Streuung — mit korrekten Skalierungen, Einzel- und Gruppenformationen, Screenshot-Beweis vor
// dem Einbau (`KFB Flora-Prüfstand v11.dc.html` lädt DIESE Datei, nicht eine Kopie).
//
// **Befund vorab, gemessen am Live-Baum:** das KayKit-Forest-FREE-Pack hat keine Stümpfe, Pilze
// oder Blumen (105 Modelle: Tree 17 · Bush 22 · Grass 20 · Rock 46). Diese drei Familien kommen
// aus `kenney_nature-kit` — kit-treu über `kit-massstab.js`, also im Verhältnis zu den KayKit-
// Bäumen so, wie beide Designer sie gebaut haben (Baum = Baum in jedem Kit, BAUM_WELT).
//
// **Was dieses Modul NICHT tut:** eigenen Zufall würfeln (Orte kommen aus `streuen()`), eine
// eigene Triaden-Geometrie führen (`formation.js`, geteilt mit den Felsen), den Boden rechnen
// (`bodenRadius` aus boden-lesung.js), Höhen von Hand setzen (kein `h:` — nur Kit-Faktor).
//
// **Sieben Familien, jede ein Reiter mit Prädikat und Bauart** (flora-auswahl.json):
//   baum       Triade (Baum groß · Baum mittel · Busch klein) + 0–2 Details (Gras/Pilz) — oder einzeln
//   baum_kahl  einzeln, Hochland (Höhe ≥ `kahlAb`)
//   busch      Haufen 1–3
//   gras       Büschel 3–5, flach
//   stumpf     einzeln + 1–3 Pilze als Detail (ohne Sichtbarkeitsboden — sie sollen darunter liegen)
//   pilz       Familie 2–4
//   blume      Büschel 3–6, flach
// Der Sichtbarkeitsboden (`BODEN.mindestHoehe`) gilt für einzeln GESTREUTE Stücke (Regel v10);
// in Kompositionen hält die Leiter ihr Verhältnis (`ohneBoden`). Das Tor zählt beides getrennt.
// ============================================================================
import { streuen } from './verteilung.js';
import { isLand } from './globe-field.js';
import { weltHoehe, BODEN, BAUM_WELT } from './kit-massstab.js';
import { surfaceAltitudeAt } from './terrain-surface.js';
import { triadeSuchen, detailPlaetze, bueschel, kleinsterWinkel, MIN_WINKEL } from './formation.js';

function seededRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/**
 * Ein Modell laden und auf Weltmaß backen — EIN Weg für Prüfstand und Welt.
 * @returns { geo:[{g, mat, side, triDatei, triGebacken}], hW, rGrund, name, weg, faktor, roh } | null
 */
export async function ladeModell({ THREE, loader, eintrag }) {
  // Immer KIT-TREU (kein Einzel-Boden): der Sichtbarkeitsboden wird je FAMILIE angelegt
  // (`familienBoden`), damit die Größenleiter einer Familie erhalten bleibt — siehe Befund unten.
  const ohneBoden = true;
  let gltf;
  try { gltf = await loader.loadAsync(eintrag.ghUrl); }
  catch (e) { return null; }
  const root = gltf.scene; root.updateWorldMatrix(true, true);
  const bb = new THREE.Box3().setFromObject(root), size = bb.getSize(new THREE.Vector3());
  const flach = Math.max(size.x, size.z) / Math.max(1e-4, size.y);
  const bezug = flach > 1.8 ? Math.max(size.x, size.z) : size.y;
  const wh = weltHoehe({}, eintrag.pack, bezug, { ohneBoden });
  const norm = wh.h / Math.max(1e-4, bezug);
  const mitte = bb.getCenter(new THREE.Vector3());
  const M = new THREE.Matrix4().makeTranslation(-mitte.x * norm, -bb.min.y * norm, -mitte.z * norm)
    .multiply(new THREE.Matrix4().makeScale(norm, norm, norm));
  const geo = [];
  root.traverse((c) => {
    if (!c.isMesh) return;
    const g = c.geometry.clone(); g.applyMatrix4(new THREE.Matrix4().copy(M).multiply(c.matrixWorld));
    const src = Array.isArray(c.material) ? c.material[0] : c.material;
    // ⚠ BUG-08-Lehre: Blattwerk ist bei KayKit und Kenney EINE Fläche je Blatt. `FrontSide` macht
    // es von unten unsichtbar — und die Kamera fliegt UNTER den Kronen (0,03 u über Grund, Baum
    // 0,058). Laub bekommt deshalb DoubleSide; das Tor nennt, wie viele Teile umgestellt wurden.
    const side = THREE.DoubleSide;
    const mat = new THREE.MeshLambertMaterial({ color: src && src.color ? src.color.clone() : new THREE.Color(0xffffff),
      map: src && src.map ? src.map : null, vertexColors: !!(g.attributes && g.attributes.color), side });
    const tri = (g.index ? g.index.count : g.attributes.position.count) / 3;
    geo.push({ g, mat, side, quellSeite: src ? src.side : null, tri });
  });
  return { geo, hW: size.y * norm, rGrund: Math.max(size.x, size.z) * norm * 0.5, name: eintrag.name,
           pack: eintrag.pack, weg: wh.weg, faktor: wh.faktor, familienFaktor: 1, roh: [size.x, size.y, size.z], hRoh: size.y,
           tri: geo.reduce((s, e) => s + e.tri, 0) };
}

/**
 * ⚠ **Der Sichtbarkeitsboden je FAMILIE, nicht je Modell** (Prüfstand 2.9., Familie busch):
 * kit-treu sind KayKit-Büsche 0,0024–0,0139 u (0,23–1,32 m) — aus Reiseflughöhe unsichtbar. Der
 * Einzel-Boden aus v10 hob 9 von 10 auf genau 0,024 und machte damit aus einer Größenleiter
 * (Faktor 5,7 zwischen kleinstem und größtem) EINE Höhe. Der Designer hat die Leiter gebaut; ein
 * Boden, der sie plättet, ist kein Boden, sondern ein zweiter Maßstab.
 * Jetzt: EIN Faktor je Familie = Boden ÷ Median der Familie, gedeckelt (max 4), Verhältnisse bleiben.
 * Das ist eine deklarierte Ausnahme vom Kit-Maßstab — mit Grund, und das Tor nennt den Faktor.
 * ⚠ Und die Gegenprobe (Prüfstand, Familie stumpf): ×2,65 hob `stump_oldTall` (0,67 m) auf 0,0775 u =
 * 1,33 Bäume — ein Stumpf über dem Baum. Deshalb ein DECKEL: kein Stück einer Kleinfamilie wird höher
 * als `maxHoehe` (0,6 Bäume). Beißt der Deckel, steht es im Rückgabewert (`gedeckelt`), und das Tor
 * nennt es. (stump_oldTall ist zusätzlich aus der Familie genommen — Ausreißer, siehe flora-auswahl.)
 */
export function familienBoden({ THREE, modelle, boden = BODEN.mindestHoehe, max = 4, maxHoehe = 0.6 * BAUM_WELT }) {
  const hs = modelle.map((m) => m.hW).sort((a, b) => a - b);
  if (!hs.length) return { f: 1, median: 0, gedeckelt: false };
  const median = hs[Math.floor(hs.length / 2)], hMax = hs[hs.length - 1];
  let f = Math.min(max, Math.max(1, boden / Math.max(1e-6, median)));
  const fDeckel = Math.max(1, maxHoehe / Math.max(1e-6, hMax));
  const gedeckelt = f > fDeckel;
  if (gedeckelt) f = fDeckel;
  if (f > 1.001) {
    const S = new THREE.Matrix4().makeScale(f, f, f);
    for (const m of modelle) {
      if (m.familienFaktor !== 1) continue;   // nie zweimal skalieren (Cache)
      for (const t of m.geo) { t.g.applyMatrix4(S); t.g.computeBoundingSphere(); }
      m.hW *= f; m.rGrund *= f; m.familienFaktor = f;
      m.weg = 'kit×' + f.toFixed(2) + ' (family floor, ratios kept)';
    }
  }
  return { f, median, gedeckelt, hMax: hMax * f };
}

export function createFlora({ THREE, radius, seed, terrainType, bodenRadius, salt = 9137, params = {},
                              auswahlUrl = './globe-v13/flora-auswahl.json', frei = null }) {
  const P = Object.assign({
    on: true,
    // Standorte je Familie — Ziel-Zahlen, die `streuen()` gegen das Prädikat setzt.
    anzahl: { baum: 48, baum_kahl: 10, busch: 36, gras: 60, stumpf: 14, pilz: 18, blume: 30 },
    einzelAnteilBaum: 0.4,    // so viele Baum-Standorte bleiben ein einzelner Baum statt Triade
    sink: { baum: 0.04, baum_kahl: 0.04, busch: 0.08, gras: 0.10, stumpf: 0.08, pilz: 0.06, blume: 0.10 },
    steilMax: { baum: 0.9, baum_kahl: 1.4, busch: 0.9, gras: 0.6, stumpf: 0.8, pilz: 0.8, blume: 0.5 },
    kahlAb: 0.22,             // Welthöhe über Meer, ab der ein Ort „Hochland" für kahle Bäume ist
    detailMax: 2,
  }, params);
  const group = new THREE.Group(); group.name = 'flora'; group.visible = !!P.on;
  const R = radius;
  const rnd = seededRandom((seed | 0) + salt);
  let stand = 'lädt Auswahl …', auswahl = null;
  const protokoll = { familien: {}, geladen: 0, gescheitert: [], stuecke: 0, minWinkel: [], zuSteil: 0,
                      angehoben: 0, kitTreu: 0, ohneKit: [], drawCalls: 0, faktoren: {} };
  const modelle = new Map();     // ghUrl → Modell
  const instanzen = new Map();   // Modell → Matrix4[]
  const orteListe = [];          // { familie, n, r } — für das Familien-Abstand-Tor (Slice Streuung)

  const _q = new THREE.Vector3(), _Y = new THREE.Vector3(0, 1, 0);
  const _qq = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
  function versetztKlein(n, a, bogen, out) {
    const h = Math.abs(n.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const t1 = new THREE.Vector3().crossVectors(h, n).normalize(), t2 = new THREE.Vector3().crossVectors(n, t1).normalize();
    return out.copy(n).addScaledVector(t1, Math.cos(a) * Math.tan(bogen)).addScaledVector(t2, Math.sin(a) * Math.tan(bogen)).normalize();
  }
  function steil(n, weite) {
    if (!bodenRadius) return 0;
    const mitte = bodenRadius(n); let max = 0;
    for (let i = 0; i < 6; i++) {
      const r = bodenRadius(versetztKlein(n, (i / 6) * Math.PI * 2, weite / R, _q));
      if (r != null && mitte != null) max = Math.max(max, Math.abs(r - mitte));
    }
    return max / weite;
  }
  const land = (n) => isLand(seed, terrainType, n.x, n.y, n.z);
  const hoehe = (n) => surfaceAltitudeAt(seed, terrainType, n.x, n.y, n.z);
  // v11 · `frei` = die Belegung der Welt: Bäume/Büsche/Stümpfe (r ≈ 0,05) nicht auf Karten, Wegweisern,
  // Portalen, Landmarken. Gras/Pilze/Blumen (r 0,012) dürfen näher — sie sind Bodendetail.
  const FREI_R = { baum: 0.05, baum_kahl: 0.04, busch: 0.03, stumpf: 0.03, gras: 0.012, pilz: 0.012, blume: 0.012 };
  function praedikat(fam) {
    const sm = P.steilMax[fam] != null ? P.steilMax[fam] : 0.9;
    const fr = frei ? (n) => frei(n, FREI_R[fam] != null ? FREI_R[fam] : 0.03) : () => true;
    if (fam === 'baum_kahl') return (n) => land(n) && hoehe(n) >= P.kahlAb && steil(n, 0.05) < sm && fr(n);
    return (n) => land(n) && steil(n, 0.05) < sm && fr(n);
  }

  function setze(m, n, fam) {
    const rB = bodenRadius ? bodenRadius(n) : R;
    if (rB == null) return false;
    _qq.setFromUnitVectors(_Y, n); _q2.setFromAxisAngle(n, rnd() * Math.PI * 2); _qq.premultiply(_q2);
    _p.copy(n).multiplyScalar(rB - m.hW * (P.sink[fam] != null ? P.sink[fam] : 0.08)); _s.setScalar(1);
    if (!instanzen.has(m)) instanzen.set(m, []);
    instanzen.get(m).push(new THREE.Matrix4().compose(_p, _qq, _s));
    protokoll.stuecke++;
    orteListe.push({ familie: fam, n: n.clone(), r: m.rGrund, modell: m.name });
    return true;
  }
  const wahl = (liste) => liste[Math.floor(rnd() * liste.length)];

  async function ladeFamilie(fam, loader, detail) {
    const out = [];
    for (const e of auswahl.familien[fam].namen) {
      const key = e.ghUrl + (detail ? '#detail' : '');
      let m = modelle.get(key);
      if (m === undefined) {
        m = await ladeModell({ THREE, loader, eintrag: e });
        modelle.set(key, m);
        if (m) { protokoll.geladen++; if (m.weg === 'ohne-kit') protokoll.ohneKit.push(e.pack); }
        else protokoll.gescheitert.push(e.name);
      }
      if (m) out.push(m);
    }
    // Detail-Stücke (unter dem Fokus) bleiben kit-treu; gestreute Familien bekommen den Familien-Boden.
    if (!detail && out.length) {
      const fb = familienBoden({ THREE, modelle: out });
      protokoll.faktoren[fam] = +fb.f.toFixed(2) + (fb.gedeckelt ? ' (capped at 0.6 trees)' : '');
      if (fb.f > 1.001) protokoll.angehoben += out.length; else protokoll.kitTreu += out.length;
    } else protokoll.kitTreu += out.length;
    return out;
  }

  async function bauen() {
    try {
      const r = await fetch(auswahlUrl);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      auswahl = await r.json();
    } catch (e) { stand = 'flora-auswahl.json nicht lesbar: ' + (e.message || e); return; }
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();
    const M = {};
    for (const fam of Object.keys(auswahl.familien)) M[fam] = await ladeFamilie(fam, loader, false);
    // Detail-Fassungen OHNE Boden (liegen unter dem Fokus, halten ihr Verhältnis):
    M.pilzDetail = await ladeFamilie('pilz', loader, true);
    M.grasDetail = await ladeFamilie('gras', loader, true);

    const fams = Object.keys(auswahl.familien);
    let famSalt = 0;
    for (const fam of fams) {
      const anz = P.anzahl[fam] || 0; famSalt += 101;
      const pr = praedikat(fam);
      const orte = anz ? streuen({ THREE, count: anz, seed, salt: salt + famSalt, gueltig: pr, minSep: null }) : [];
      const prot = protokoll.familien[fam] = { gesucht: anz, standorte: orte.length, gebaut: 0, stuecke0: protokoll.stuecke,
                                              triaden: 0, einzel: 0, bueschel: 0 };
      const liste = M[fam];
      if (!liste || !liste.length) { prot.fehlt = true; continue; }
      const sorted = liste.slice().sort((a, b) => a.rGrund - b.rGrund);
      for (const n of orte) {
        if (fam === 'baum') {
          if (rnd() < P.einzelAnteilBaum || sorted.length < 2 || !M.busch.length) {
            if (setze(wahl(sorted), n, fam)) { prot.gebaut++; prot.einzel++; }
            continue;
          }
          const G = wahl(sorted.slice(Math.floor(sorted.length / 2)));
          const Mi = wahl(sorted.slice(0, Math.max(1, Math.floor(sorted.length / 2))));
          const K = wahl(M.busch);
          const tri3 = triadeSuchen({ THREE, n, rG: G.rGrund, rM: Mi.rGrund, rK: K.rGrund, R, gueltig: pr, rnd });
          if (!tri3) { protokoll.zuSteil++; if (setze(G, n, fam)) { prot.gebaut++; prot.einzel++; } continue; }
          setze(G, n, fam); setze(Mi, tri3.pM, fam); setze(K, tri3.pK, 'busch');
          prot.gebaut++; prot.triaden++;
          protokoll.minWinkel.push(kleinsterWinkel(THREE, n, tri3.pM, tri3.pK));
          const nD = Math.floor(rnd() * (P.detailMax + 1));
          const detailPool = M.pilzDetail.concat(M.grasDetail);
          if (nD && detailPool.length) for (const pD of detailPlaetze({ THREE, n, rG: G.rGrund, R, anzahl: nD, gueltig: pr, rnd }))
            setze(wahl(detailPool), pD, 'detail');
        } else if (fam === 'stumpf') {
          const S = wahl(sorted);
          if (!setze(S, n, fam)) continue;
          prot.gebaut++; prot.einzel++;
          const nD = 1 + Math.floor(rnd() * 3);
          if (M.pilzDetail.length) for (const pD of detailPlaetze({ THREE, n, rG: S.rGrund, R, anzahl: nD, gueltig: pr, rnd, deckel: 2.2 }))
            setze(wahl(M.pilzDetail), pD, 'detail');
        } else if (fam === 'baum_kahl') {
          if (setze(wahl(sorted), n, fam)) { prot.gebaut++; prot.einzel++; }
        } else {
          const span = auswahl.familien[fam].anzahlJe || [1, 1];
          const k = span[0] + Math.floor(rnd() * (span[1] - span[0] + 1));
          const L = wahl(sorted);
          const pl = bueschel({ THREE, n, r: L.rGrund, R, anzahl: k, gueltig: pr, rnd });
          let z = 0;
          for (const p of pl) if (setze(fam === 'busch' && z ? wahl(sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.6)))) : (z ? wahl(sorted) : L), p, fam)) z++;
          if (z) { prot.gebaut++; prot.bueschel++; }
        }
      }
      prot.stuecke = protokoll.stuecke - prot.stuecke0;
    }
    for (const [m, mats] of instanzen) {
      for (const { g, mat } of m.geo) {
        const inst = new THREE.InstancedMesh(g, mat, mats.length);
        for (let i = 0; i < mats.length; i++) inst.setMatrixAt(i, mats[i]);
        inst.instanceMatrix.needsUpdate = true; inst.name = 'flora-' + m.name; inst.frustumCulled = false;
        inst.castShadow = true; inst.receiveShadow = false;
        group.add(inst); protokoll.drawCalls++;
      }
    }
    stand = 'gebaut';
  }
  bauen().catch((e) => { stand = 'Fehler: ' + (e && e.message || e); console.warn('[flora]', e); });

  return {
    name: 'flora', group, params: P,
    get enabled() { return P.on; },
    setEnabled(on) { P.on = !!on; group.visible = !!on; },
    get status() { return stand; },
    /** Für das Familien-Abstand-Tor: alle gesetzten Stücke mit Familie, Richtung, Grundradius. */
    orte() { return orteListe; },
    tor() {
      const p = protokoll;
      if (stand !== 'gebaut') return { ok: false, text: '— ' + stand };
      const teile = Object.entries(p.familien).map(([f, x]) => f + ' ' + x.gebaut + '/' + x.gesucht
        + (x.triaden ? ' (' + x.triaden + ' triads)' : '') + (x.fehlt ? ' ⚠ no models' : ''));
      const mw = p.minWinkel.length ? Math.min.apply(null, p.minWinkel) : null;
      const linie = p.minWinkel.filter((w) => w < MIN_WINKEL).length;
      const fehl = Object.values(p.familien).filter((x) => x.gebaut < x.gesucht * 0.9).length;
      const ok = !p.gescheitert.length && !p.ohneKit.length && linie === 0 && fehl === 0;
      return { ok, ...p, kleinsterWinkel: mw,
        text: (ok ? '✓' : '⚠') + ' flora: ' + p.stuecke + ' pieces · ' + p.geladen + ' models · ' + p.drawCalls + ' draw calls · '
          + teile.join(' · ')
          + ' · scale: ' + p.kitTreu + ' kit-true, ' + p.angehoben + ' in families lifted as a whole (floor ' + BODEN.mindestHoehe.toFixed(3) + ' on the family median, ratios kept): '
          + Object.entries(p.faktoren).filter(([, f]) => parseFloat(f) > 1).map(([k, f]) => k + ' ×' + f).join(', ')
          + (p.ohneKit.length ? ' · ⚠ WITHOUT kit factor: ' + Array.from(new Set(p.ohneKit)).join(', ') : '')
          + (p.gescheitert.length ? ' · ⚠ failed: ' + p.gescheitert.join(', ') : '')
          + (mw != null ? ' · smallest triangle angle ' + mw.toFixed(0) + '°' + (linie ? ' · ⚠ ' + linie + ' near a line' : '') : '')
          + (p.zuSteil ? ' · ' + p.zuSteil + ' tree sites without room → single tree' : '') };
    },
  };
}
