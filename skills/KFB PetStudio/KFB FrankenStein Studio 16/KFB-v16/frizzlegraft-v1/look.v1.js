/* KFB · DER LOOK EINES EINTRAGS AUF EINEN GRAFT  ·  look-v1  ·  12.09.2026
 *
 * WOFÜR (Georg 12.09.): »ein Charakter, den ich im Studio konfiguriert habe, soll hier im Rig
 * korrekt dargestellt werden — dieselbe JSON-Konfiguration, 1:1 in allen Apps.«
 *
 * WARUM EIN EIGENES MODUL: die Farbentscheidungen eines Pets liegen in FÜNF Feldern und werden von
 * DREI Wegen gesetzt (Hautschnitt · Mesh-Rollen · Augen-Rig). Jede App, die das nachbaut, ist die
 * nächste zweite Wahrheit. Hier steht der Weg einmal.
 *
 * DIE FELDER, alle aus `pet.graft` (Studio v15, Export `kfb.pets/1`):
 *   hands  'skin' | 'gloves'   was am Handknochen hängt (sonst gilt die Wirtsvorgabe)
 *   skin   'skin' | 'all' | 'off'  wie weit die Kopffarbe reicht
 *   tone   null | 'face' | 0xRRGGBB  Handton (null = gemessener Kopfton)
 *   zones  { face, faceHex, bodyHex, sat }  die Zonen des KOPFES (Materialnamen des Spenders)
 *   roles  { cloth, accent, eyes }  die Rollen des WIRTS (Mesh-Regeln) + Lidfarbe
 */

export const SCHEMA = 'kfb.look/0.1';
export const SESSION_KEY = 'kfb-pet-studio-v5';
export const CANONICAL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kfb-pets.json';

/** Alle bekannten Stände eines Pets, alt → neu. Reihenfolge wie im Studio: Repo, dann Sitzung. */
export async function loadPet(id, { canonical = CANONICAL, session = true } = {}) {
  const found = [];
  if (canonical) {
    try {
      const doc = await (await fetch(canonical, { cache: 'no-cache' })).json();
      const p = (doc.pets || []).find((q) => q && q.id === id);
      if (p) found.push({ from: 'Repo v' + (doc.version || '?'), pet: p });
    } catch (e) { /* Repo nicht erreichbar — der Sitzungsstand kann trotzdem gelten */ }
  }
  if (session) {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
      const d = (s.drafts || {})[id];
      if (d && d.pet) found.push({ from: 'Sitzung (Entwurf)', pet: d.pet });
    } catch (e) {}
  }
  if (!found.length) return { status: 'NICHTS', id, pet: null, from: [] };
  /* Der SPÄTERE Stand gewinnt Feld für Feld — dieselbe Regel wie `pet-session.union`, hier flach
     auf `graft` und `color` beschränkt, weil nur der Look gebraucht wird. */
  const out = {};
  for (const f of found) {
    const p = f.pet;
    if (p.color) out.color = p.color;
    if (p.graft) out.graft = Object.assign({}, out.graft || {}, p.graft,
      { zones: Object.assign({}, (out.graft || {}).zones || {}, p.graft.zones || {}),
        roles: Object.assign({}, (out.graft || {}).roles || {}, p.graft.roles || {}) });
  }
  return { status: 'OK', id, pet: out, from: found.map((f) => f.from) };
}

/**
 * Den Look anlegen. `B` ist der Graft (graft-biped), `rig` das Augen-Rig (optional).
 * Rückgabe ist ein BERICHT, keine Behauptung: was gesetzt wurde und mit welchem Wert.
 */
export function applyLook({ B, rig, pet, hexInt = null }) {
  if (!B || !B.built) return { status: 'KEIN_GRAFT' };
  const g = (pet && pet.graft) || {};
  const rows = [];
  const toInt = hexInt || ((h) => (typeof h === 'string' ? parseInt(h.replace('#', ''), 16) : h));

  if (g.hands) { B.handsAre = g.hands; rows.push('Hände ' + g.hands); }
  /* Reihenfolge zählt: erst der Hautmodus, dann der Ton, dann die Zonen (das Gesicht braucht den
     gemessenen Handton, den der Hautschnitt erst erzeugt), zuletzt die Rollen. */
  if (g.skin) { B.skinMode = g.skin; rows.push('Haut-Trennung ' + g.skin); }
  if (g.tone !== undefined && g.tone !== 'face') {
    B.skinColor = g.tone == null ? null : toInt(g.tone);
    rows.push('Handton ' + (g.tone == null ? 'gemessen' : '#' + toInt(g.tone).toString(16).padStart(6, '0')));
  }
  let zoneRep = null;
  if (B.applyZones) {
    const z = g.zones || {};
    const mode = z.face || 'hand', hand = B.handTone;
    let faceTone = null, lightMix = 0.4;
    if (z.faceHex != null) faceTone = toInt(z.faceHex);
    else if (mode === 'hand' && hand != null) faceTone = hand;
    else if (mode === 'off') lightMix = 0;
    zoneRep = B.applyZones({ faceTone, bodyTone: z.bodyHex != null ? toInt(z.bodyHex) : null,
      lightMix, sat: z.sat != null ? z.sat : 1,
      roots: [B._graft && B._graft.group].filter(Boolean) });
    rows.push('Kopfzonen ' + (zoneRep ? (zoneRep.face + ' / ' + zoneRep.body) : '—'));
    if (g.tone === 'face' && zoneRep && zoneRep.face) {
      try { B.setSkinColor(parseInt(zoneRep.face.slice(1), 16)); rows.push('Hände wie Gesicht'); } catch (e) {}
    }
  }
  let roleRep = null;
  if (B.setRoles) {
    const r = g.roles || {};
    roleRep = B.setRoles({ cloth: r.cloth == null ? null : toInt(r.cloth), accent: r.accent == null ? null : toInt(r.accent) });
    rows.push('Rollen Kleidung ' + (roleRep && roleRep.hex ? roleRep.hex.cloth : '—') + ' · Akzent ' + (roleRep && roleRep.hex ? roleRep.hex.accent : '—'));
  }
  if (rig && rig.setBaseColor) {
    const r = g.roles || {};
    const base = r.eyes != null ? toInt(r.eyes) : (pet && pet.color ? toInt(pet.color) : 0xf2c93c);
    try { rig.setBaseColor(base); rows.push('Augen #' + base.toString(16).padStart(6, '0')); } catch (e) {}
  }
  return { status: 'OK', rows, zoneRep, roleRep };
}

export default { SCHEMA, loadPet, applyLook };
