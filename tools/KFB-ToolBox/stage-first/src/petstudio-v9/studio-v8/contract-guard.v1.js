/* KFB Pet Studio v8 — DER WÄCHTER AM VERTRAG.  guard-v1.0
 *
 * BEFUND, DER DIESES MODUL AUSGELÖST HAT (26.8., am laufenden Stand gemessen):
 * v8 lädt den Vertrag kanonisch aus dem Repo (v1.2.8) — und der Pinguin stand trotzdem mit den
 * alten Zahlen da:
 *
 *   Repo:     eye.anchor.ring 0,245  ·  mouth.size 0,78  ·  mouth.sx 1,10
 *   im Bild:  eye.anchor.ring 0,300  ·  mouth.size 0,80  ·  mouth.sx 1,00
 *
 * Ursache war NICHT die lokale Kopie (die ist als Quelle abgeschaltet), sondern ein ENTWURF aus
 * einer alten Sitzung im Browserspeicher. Die Ladereihenfolge ist Repo → lokal → Entwürfe, und
 * Entwürfe stehen zuletzt, weil sie unexportierte Arbeit sind. Das ist richtig und bleibt so.
 *
 * FALSCH war nur, dass es STILL passiert. Georgs Regel heißt: der reichere Stand gewinnt, Feld für
 * Feld, und ein Ausdünnen wird GEMELDET. Hier dünnt nichts aus — hier ÜBERSTIMMT ein alter Entwurf
 * eine neuere Quelle, was dasselbe Ergebnis hat: Arbeit, die im Repo steht, ist im Bild nicht zu
 * sehen, und niemand erfährt es. Also wird es gemeldet, mit Feldnamen und beiden Zahlen.
 *
 * DIESES MODUL ENTSCHEIDET NICHTS. Es zählt und benennt; die Entscheidung je Pet trifft Georg
 * (Entwurf behalten / Repo nehmen). Ein Modul, das stillschweigend Entwürfe wegwirft, hat genau den
 * Schaden angerichtet, gegen den es gebaut wurde.
 */

export const version = 'guard-v1.0';

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Flach machen, damit ein Vergleich Feldnamen liefert und nicht ein Bauchgefühl. */
export function flatten(o, pre, out) {
  out = out || {}; pre = pre || '';
  if (!isObj(o)) { out[pre] = JSON.stringify(o); return out; }
  for (const k of Object.keys(o)) flatten(o[k], pre ? pre + '.' + k : k, out);
  return out;
}

/* Felder, die der Studio-Lauf selbst schreibt. Sie stehen im Entwurf, weil GEMESSEN wurde, nicht
   weil jemand etwas entschieden hat — sie als Konflikt zu melden wäre Rauschen bei jedem Start. */
const MEASURED = /^(body\.(cubeH|radius|totalH|facePitch|faceDir|measured|hit)|ground\.(foot|coverage|measured))/;

/**
 * Jedes Feld, in dem ein Entwurf von der kanonischen Quelle ABWEICHT.
 * `overrides`   = das Repo hat einen Wert, der Entwurf einen anderen (der Entwurf gewinnt heute).
 * `onlyInDraft` = der Entwurf hat ein Feld, das die Quelle nicht kennt (echte neue Arbeit).
 */
export function conflicts(canonical, session, opts) {
  const o = opts || {};
  const src = new Map(((canonical && canonical.pets) || []).map((p) => [p.id, p]));
  const drafts = (session && session.drafts) || {};
  const rows = [];
  for (const id of Object.keys(drafts)) {
    const d = drafts[id] && drafts[id].pet;
    const s = src.get(id);
    if (!d || !s) continue;
    const fd = flatten(d), fs = flatten(s);
    const over = [], only = [];
    for (const k of Object.keys(fd)) {
      if (MEASURED.test(k)) continue;
      if (!(k in fs)) { only.push(k); continue; }
      if (fd[k] !== fs[k]) over.push({ field: k, repo: fs[k], draft: fd[k] });
    }
    if (over.length || only.length) rows.push({ id, overrides: over, onlyInDraft: only, touched: drafts[id].touched || null });
  }
  const line = rows.length
    ? '[GUARD] ' + rows.length + ' Entwurf/Entwuerfe ueberstimmen das Repo: '
      + rows.map((r) => r.id + ' (' + r.overrides.length + ' Feld(er)' + (r.onlyInDraft.length ? ' + ' + r.onlyInDraft.length + ' nur im Entwurf' : '') + ')').join(', ')
    : '[GUARD] kein Entwurf ueberstimmt das Repo';
  if (o.quiet !== true) {
    if (rows.length) console.warn(line, rows);
    else console.log(line);
  }
  return { rows, line, count: rows.length };
}

/** Den Entwurf eines Pets fallen lassen — das ist die Entscheidung »Repo nehmen«. Sie wird
 *  PROTOKOLLIERT, weil ein weggeworfener Entwurf nirgends sonst auftaucht. */
export function dropDraft(session, id) {
  if (!session || !session.drafts || !session.drafts[id]) return null;
  const gone = session.drafts[id];
  delete session.drafts[id];
  const rec = { id, dropped: new Date().toISOString(), was: gone.touched || null };
  console.warn('[GUARD] Entwurf verworfen (Repo gewinnt): ' + id + (rec.was ? ' · Entwurf vom ' + rec.was : ''));
  return rec;
}
