/**
 * lab-v7/pose-store.v1.js · Gier-Schalter je Fixture, mit Gedächtnis.
 *
 * Flip (Blickrichtung) und Orient (Aufrichten) liegen in `fixture-adapters`. Das Gieren kam
 * später dazu und bekommt darum einen eigenen, kleinen Speicher statt einer vierten Fassung der
 * 500-Zeilen-Fixtureliste. Gleiche Regel wie dort: eine Korrektur, die Georg einmal gemacht hat,
 * bleibt gemacht.
 *
 * Vorgabe je Fixture kommt aus der Zeile (`yawDefault`), sonst 0.
 */
const YKEY = 'kfb-vehicle-yaw/1';

export function yawOf(id, row) {
  try { const m = JSON.parse(localStorage.getItem(YKEY) || '{}'); if (m[id] != null) return m[id]; } catch (e) {}
  return (row && row.yawDefault) || 0;
}
export function rememberYaw(id, steps) {
  try { const m = JSON.parse(localStorage.getItem(YKEY) || '{}'); m[id] = ((Math.round(steps) % 4) + 4) % 4; localStorage.setItem(YKEY, JSON.stringify(m)); } catch (e) {}
}
export function allYaw() {
  try { return JSON.parse(localStorage.getItem(YKEY) || '{}'); } catch (e) { return {}; }
}
