/* KFB Pet Studio v5 — Sitzungs- und Vertragsschicht.  ses-v1.0
 *
 * WARUM DIESES MODUL EXISTIERT (Befund 25.8., gemessen):
 * v4 baute den Contract-Export aus `this.contract` PLUS nur den in dieser Sitzung BERUEHRTEN Pets
 * (`_touchedPets`), und `mark()` feuerte nur auf den Tabs Koerper/Gesicht. Wer nicht angefasst
 * wurde, fiel heraus — mit hochgezaehlter Versionsnummer. Ergebnis in `kfb-pets.json` v1.2.6:
 * pig/beaver/bee ohne Mund-Block (40 -> 14 bzw. 37 -> 14 Blattfelder), penguin/monkey/hog mit
 * zurueckgesetztem Augen-Anker, `voice.speech.category` mit einem PET-Archetyp im GLOBALEN Block.
 *
 * DIE REGEL (Georgs Entscheidung): der reichere Stand gewinnt, Feld fuer Feld. Ein Feld, das es
 * gab, verschwindet nie still — ein Ausduennen wird GEMELDET. Deshalb kennt dieses Modul keinen
 * Beruehrt-Filter: es vereinigt Vertrag, Bibliothek und Entwuerfe und sagt dazu, was woher kam.
 */

export const version = 'ses-v1.0';
export const SESSION_KEY = 'kfb-pet-studio-v5';
export const CONTRACT_SEMVER = '1.3.0';   // Vertragsversion des Formats (meta.contract), nicht der Daten

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
export const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));

/* ── Vereinigung ─────────────────────────────────────────────────────────────────────────────── */
/**
 * `inc` gewinnt auf jedem Feld, das es DEFINIERT; alles, was nur `base` hat, bleibt stehen.
 * `report.kept` sammelt die Felder, die `inc` nicht mehr trug (= was ein naives Ueberschreiben
 * gekostet haette), `report.changed` die geaenderten Werte. Arrays sind Werte, nicht Behaelter:
 * eine Liste wird ersetzt, nicht elementweise gemischt — aber nur, wenn `inc` sie ueberhaupt hat.
 */
export function union(base, inc, report, path) {
  report = report || { kept: [], changed: [] };
  path = path || '';
  if (inc === undefined) return clone(base);
  if (!isObj(base) || !isObj(inc)) {
    if (base !== undefined && JSON.stringify(base) !== JSON.stringify(inc)) report.changed.push(path);
    return clone(inc);
  }
  const out = {};
  for (const k of Object.keys(base)) out[k] = clone(base[k]);
  for (const k of Object.keys(inc)) {
    const p = path ? path + '.' + k : k;
    if (inc[k] === undefined) continue;
    if (inc[k] === null && base[k] != null) { report.kept.push(p); continue; }   // null loescht nicht
    out[k] = union(base[k], inc[k], report, p);
  }
  for (const k of Object.keys(base)) {
    if (!(k in inc) && base[k] !== undefined) report.kept.push(path ? path + '.' + k : k);
  }
  return out;
}

/** Blattfelder zaehlen — das Mass, mit dem »reicher« nachweisbar ist. */
export function leafCount(o) {
  let n = 0;
  const walk = (v) => { if (isObj(v) || Array.isArray(v)) Object.values(v).forEach(walk); else n++; };
  walk(o == null ? {} : o);
  return n;
}

/** Pet-Listen vereinigen. Reihenfolge der Quellen: alt -> neu. Nichts fliegt heraus. */
export function unionPets(sources) {
  const by = new Map(); const notes = [];
  for (const src of sources) {
    if (!src || !Array.isArray(src.pets)) continue;
    for (const p of src.pets) {
      if (!p || !p.id) continue;
      const prev = by.get(p.id);
      if (!prev) { by.set(p.id, { pet: clone(p), from: [src.name] }); continue; }
      const rep = { kept: [], changed: [] };
      const merged = union(prev.pet, p, rep);
      if (rep.kept.length) notes.push({ id: p.id, from: src.name, kept: rep.kept.slice(0, 12), keptN: rep.kept.length, before: leafCount(prev.pet), after: leafCount(p) });
      by.set(p.id, { pet: merged, from: prev.from.concat(src.name) });
    }
  }
  return { pets: [...by.values()].map((e) => e.pet), origin: [...by.entries()].map(([id, e]) => ({ id, from: e.from })), thinned: notes };
}

/* ── Sitzung: Entwuerfe leben bis zum Export ─────────────────────────────────────────────────── */
export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return emptySession();
    const s = JSON.parse(raw);
    return { v: 5, activeId: s.activeId || null, drafts: s.drafts || {}, globals: s.globals || {}, petVersions: s.petVersions || {}, saved: s.saved || null };
  } catch (e) { return emptySession(); }
}
export function emptySession() { return { v: 5, activeId: null, drafts: {}, globals: {}, petVersions: {}, saved: null }; }
export function writeSession(s) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ ...s, saved: new Date().toISOString() })); return true; }
  catch (e) { return false; }
}
/** Ein bearbeitetes Pet ist ein ENTWURF. Wechsel = speichern, nicht verwerfen. */
export function putDraft(s, pet) {
  if (!pet || !pet.id) return s;
  s.drafts[pet.id] = { pet: clone(pet), dirty: true, touched: new Date().toISOString() };
  return s;
}
export function dropDraft(s, id) { delete s.drafts[id]; return s; }
export function draftIds(s) { return Object.keys(s.drafts || {}); }

/* ── Der Startzustand: drei Quellen, eine Regel ──────────────────────────────────────────────── */
/**
 * Reihenfolge alt -> neu: Repo (canonical) -> lokale Datei -> Entwuerfe der Sitzung.
 * Rueckgabe: der vereinigte Contract, plus ein BERICHT, der jede Ausduennung benennt. Die
 * Versionsnummer entscheidet NICHT mehr allein — v1.2.6 war hoeher und aermer.
 */
export function boot({ canonical, local, session }) {
  const srcs = [];
  if (canonical) srcs.push({ name: 'repo v' + (canonical.version || '?'), pets: canonical.pets, doc: canonical });
  if (local) srcs.push({ name: 'lokal v' + (local.version || '?'), pets: local.pets, doc: local });
  const drafts = session ? Object.values(session.drafts || {}).map((d) => d.pet) : [];
  if (drafts.length) srcs.push({ name: 'Entwuerfe (' + drafts.length + ')', pets: drafts });

  let doc = null;
  for (const s of srcs) if (s.doc) doc = doc ? union(doc, s.doc) : clone(s.doc);
  if (!doc) doc = { $schema: 'kfb.pets/1', version: '0.0.0', pets: [] };

  const u = unionPets(srcs);
  doc.pets = u.pets;
  if (session && session.globals) {
    for (const k of Object.keys(session.globals)) doc[k] = union(doc[k], session.globals[k]);
  }
  return {
    contract: doc,
    report: {
      sources: srcs.map((s) => s.name),
      pets: u.pets.length,
      drafts: drafts.length,
      thinned: u.thinned,
      origin: u.origin,
    },
  };
}

/* ── Export: 1 Pet · Auswahl · Vollbestand ───────────────────────────────────────────────────── */
/**
 * `ids` = wer mitkommt. `meta` traegt die Herkunft, damit eine Datei spaeter zuordenbar ist —
 * und `petVersions` je Pet, damit »ist DIESER Pinguin neuer?« eine Zahl ist und kein Raetsel.
 * Der Zaehler steigt nur fuer Pets, die seit dem letzten Export einen Entwurf haben.
 */
export function buildExport({ contract, pets, ids, petVersions, bump, source, label }) {
  const out = clone(contract) || {};
  const all = (pets || []).filter((p) => p && p.id);
  const take = ids && ids.length ? all.filter((p) => ids.indexOf(p.id) >= 0) : all;
  out.pets = take.map(clone);
  const pv = { ...(petVersions || {}) };
  for (const p of out.pets) {
    const cur = pv[p.id] || 1;
    pv[p.id] = (bump && bump.indexOf(p.id) >= 0) ? cur + 1 : cur;
  }
  out.meta = {
    contract: CONTRACT_SEMVER,
    updated: new Date().toISOString().slice(0, 10),
    source: source || 'KFB Pet Studio v5',
    label: label || (out.pets.length === 1 ? 'single' : (ids && ids.length ? 'selection' : 'full')),
    count: out.pets.length,
    ids: out.pets.map((p) => p.id),
    petVersions: Object.fromEntries(out.pets.map((p) => [p.id, pv[p.id]])),
    leafCounts: Object.fromEntries(out.pets.map((p) => [p.id, leafCount(p)])),
  };
  out.version = bumpPatch(out.version);
  out.updated = out.meta.updated;
  return { doc: out, petVersions: pv };
}
export function bumpPatch(v) {
  const a = String(v || '0.0.0').split('.').map((n) => parseInt(n, 10) || 0);
  while (a.length < 3) a.push(0);
  a[2] += 1; return a.join('.');
}
export function fileName(doc) {
  const m = doc.meta || {};
  if (m.count === 1) return 'kfb-pet-' + m.ids[0] + '.json';
  if (m.label === 'selection') return 'kfb-pets-' + m.count + 'of24.json';
  return 'kfb-pets.json';
}

/* ── Import: pro Pet entscheidbar ────────────────────────────────────────────────────────────── */
/**
 * Der Plan sagt VOR dem Schreiben, was passieren wuerde: `status` je Pet und die Zahl der Felder,
 * die dabei verschwinden wuerden. »older« ist eine Warnung, kein Verbot — aber sie steht da.
 */
export function planImport(file, { pets, petVersions }) {
  const mine = new Map((pets || []).map((p) => [p.id, p]));
  const fv = (file.meta && file.meta.petVersions) || {};
  const rows = (file.pets || []).filter((p) => p && p.id).map((p) => {
    const cur = mine.get(p.id);
    const vTheirs = fv[p.id] || null, vMine = (petVersions || {})[p.id] || null;
    const rep = { kept: [], changed: [] };
    union(cur || {}, p, rep);
    const status = !cur ? 'new'
      : (JSON.stringify(cur) === JSON.stringify(p) ? 'same'
      : (vTheirs != null && vMine != null ? (vTheirs > vMine ? 'newer' : (vTheirs < vMine ? 'older' : 'diff')) : 'diff'));
    return {
      id: p.id, status, pet: p,
      vTheirs, vMine,
      leafTheirs: leafCount(p), leafMine: cur ? leafCount(cur) : 0,
      loses: rep.kept.length,               // Felder, die nur ICH habe -> ein Ersetzen wuerde sie kosten
      changes: rep.changed.length,
      decision: status === 'same' ? 'skip' : (status === 'older' ? 'skip' : 'take'),
    };
  });
  return {
    file: { version: file.version || null, meta: file.meta || null, count: rows.length },
    rows,
    warn: rows.filter((r) => r.status === 'older').map((r) => r.id),
  };
}
/** Entscheidungen anwenden. `take` = vereinigen (nie ersetzen), `copy` = neue id, `skip` = nichts. */
export function applyImport(plan, pets) {
  const list = (pets || []).map(clone);
  const by = new Map(list.map((p) => [p.id, p]));
  const log = [];
  for (const r of plan.rows) {
    if (r.decision === 'skip') { log.push(r.id + ': skipped'); continue; }
    if (r.decision === 'copy') {
      let n = 2, id = r.id + '~2';
      while (by.has(id)) { n++; id = r.id + '~' + n; }
      const c = clone(r.pet); c.id = id; c.name = (c.name || r.id) + ' (copy ' + n + ')';
      list.push(c); by.set(id, c); log.push(r.id + ' → ' + id);
      continue;
    }
    const cur = by.get(r.id);
    if (!cur) { list.push(clone(r.pet)); by.set(r.id, r.pet); log.push(r.id + ': new'); continue; }
    const rep = { kept: [], changed: [] };
    const merged = union(cur, r.pet, rep);
    Object.keys(cur).forEach((k) => delete cur[k]);
    Object.assign(cur, merged);
    log.push(r.id + ': merged (' + rep.changed.length + ' changed, ' + rep.kept.length + ' kept)');
  }
  return { pets: list, log };
}

/* ── Abnahme: die vier Prueffragen des Handovers, im Code ────────────────────────────────────── */
export function selfTest({ contract, pets, petVersions }) {
  const out = [];
  const one = pets[0] ? pets[0].id : null;
  if (one) {
    const e = buildExport({ contract, pets, ids: [one], petVersions, bump: [] });
    const rt = planImport(e.doc, { pets, petVersions });
    out.push({ t: 'Export 1 pet → import → identical', ok: e.doc.meta.count === 1 && rt.rows.length === 1 && rt.rows[0].status === 'same', got: e.doc.meta.count + ' pet, status ' + (rt.rows[0] && rt.rows[0].status) });
  }
  const three = pets.slice(0, 3).map((p) => p.id);
  if (three.length === 3) {
    const e = buildExport({ contract, pets, ids: three, petVersions, bump: [] });
    const into = planImport(e.doc, { pets: [], petVersions: {} });
    out.push({ t: 'Export 3 of 24 → empty library → exactly 3', ok: e.doc.meta.count === 3 && into.rows.length === 3 && into.rows.every((r) => r.status === 'new'), got: e.doc.meta.count + ' / ' + into.rows.length });
  }
  const full = buildExport({ contract, pets, ids: null, petVersions, bump: [] });
  out.push({ t: 'Full set: count · ids · petVersions', ok: full.doc.meta.count === pets.length && full.doc.meta.ids.length === pets.length && Object.keys(full.doc.meta.petVersions).length === pets.length, got: full.doc.meta.count + ' / ' + full.doc.meta.ids.length + ' / ' + Object.keys(full.doc.meta.petVersions).length });
  // Aeltere Datei ueber eine neuere: muss gewarnt werden, nicht still uebernommen
  if (one) {
    const older = clone(full.doc);
    older.meta.petVersions[one] = 1;
    const pv = { ...petVersions, [one]: 7 };
    const pl = planImport(older, { pets, petVersions: pv });
    const row = pl.rows.find((r) => r.id === one);
    out.push({ t: 'Older file over newer → warning, not silent overwrite', ok: !!row && (row.status === 'older' || row.status === 'same') && row.decision === 'skip', got: row ? row.status + ' / ' + row.decision : '—' });
  }
  // Kein Feldverlust bei Voll-Export
  const lost = pets.filter((p) => leafCount(p) > leafCount((full.doc.pets || []).find((q) => q.id === p.id) || {}));
  out.push({ t: 'Export loses no field', ok: lost.length === 0, got: lost.length ? lost.map((p) => p.id).join(', ') : '0 pets poorer' });
  return out;
}
