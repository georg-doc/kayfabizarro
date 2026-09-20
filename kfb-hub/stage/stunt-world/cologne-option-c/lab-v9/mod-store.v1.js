/**
 * lab-v9/mod-store.v1.js · Anker, Groesse, Drehsinn und Bestueckung je Traeger — mit Gedaechtnis.
 *
 * Gleiche Regel wie bei Flip, Orient und Gier (`lab-v7/pose-store.v1.js`): eine Korrektur, die
 * Georg einmal gemacht hat, bleibt gemacht. Der gemessene Anker ist ein VORSCHLAG; was hier
 * liegt, ist die Abweichung davon — in Traegereinheiten, nicht in Weltmass, damit dieselbe
 * Korrektur auch nach einem Massstabswechsel des Assets noch stimmt.
 *
 * ═══ ZWEI DINGE, ZWEI FELDER ════════════════════════════════════════════════════════════════
 * Befund aus der Abnahme am 19.09.: »Zurueck auf den Vorschlag« schaltete den Mod heimlich AUS.
 * Ursache war, dass Bestueckung (`on`) und Geometrie (Anker, Groesse, Drehsinn) in EINEM Satz
 * lagen und das Zuruecksetzen den ganzen Satz loeschte — der Vorgabewert von `on` ist falsch,
 * war aber der Vorgabewert von allem. Seitdem sind es zwei getrennte Felder:
 *
 *   geomOf / rememberGeom / forgetGeom   Anker, Groesse, Drehsinn — zuruecksetzbar
 *   onOf   / rememberOn                  Bestueckung — bleibt vom Zuruecksetzen unberuehrt
 *
 * `onOf` gibt ABSICHTLICH `undefined` zurueck, wenn nichts eingetragen ist: »nicht entschieden«
 * ist nicht dasselbe wie »aus«. Ein Teileintrag darf nicht alle anderen Mods ausschalten
 * (zweiter Befund derselben Abnahme).
 *
 * Schluesselfassung /2: die /1-Ablage enthielt Klickspuren aus dem Bau-Lauf. Sie wird nicht
 * geloescht — sie wird nicht mehr gelesen.
 */
const KEY = 'kfb-drive-mods/2';

export const DEFAULT_GEOM = { dx: 0, dy: 0, dz: 0, sizeK: 1, flip: false };

function readAll() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
function writeAll(m) { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {} }
function slot(m, carrierId, modId) {
  m[carrierId] = m[carrierId] || {};
  m[carrierId][modId] = m[carrierId][modId] || {};
  return m[carrierId][modId];
}

export function geomOf(carrierId, modId) {
  const c = readAll()[carrierId] || {};
  return Object.assign({}, DEFAULT_GEOM, (c[modId] || {}).geom || {});
}
export function rememberGeom(carrierId, modId, patch) {
  const m = readAll(), s = slot(m, carrierId, modId);
  s.geom = Object.assign({}, DEFAULT_GEOM, s.geom || {}, patch || {});
  writeAll(m);
  return s.geom;
}
/** Nur die Geometrie. Die Bestueckung bleibt stehen — sonst verschwindet der Mod beim Laden. */
export function forgetGeom(carrierId, modId) {
  const m = readAll(), c = m[carrierId];
  if (c && c[modId]) { delete c[modId].geom; writeAll(m); }
  return Object.assign({}, DEFAULT_GEOM);
}

/** `undefined` = fuer diesen Traeger nie entschieden. NICHT `false`. */
export function onOf(carrierId, modId) {
  const c = readAll()[carrierId] || {};
  const e = c[modId];
  return e && typeof e.on === 'boolean' ? e.on : undefined;
}
export function rememberOn(carrierId, modId, on) {
  const m = readAll(); slot(m, carrierId, modId).on = !!on; writeAll(m);
  return !!on;
}

export function all() { return readAll(); }
