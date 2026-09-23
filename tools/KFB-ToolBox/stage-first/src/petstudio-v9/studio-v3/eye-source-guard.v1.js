/* kfb.eye-source-guard/1 — EINE Augenquelle pro Figur, nachweisbar.
 *
 * WARUM DAS EXISTIERT (Georg, 17.09.2026, am Bild gemessen: »kitten hat doppeltes augen-rig«):
 * Ein Cube-Pet kann sein Gesicht aus DREI unabhängigen Quellen bekommen. Sie sehen einzeln richtig
 * aus, zusammen ergeben sie doppelte Augen — und sie mischen sich still, ohne Fehlermeldung:
 *
 *   1 · `kenney`  — Kenneys aufgebackene Augen-Schalen IM body-Mesh (Geometrie, keine Textur).
 *                   Verschwinden nur, wenn `Character.load({face})` sie löscht (face.stripEyes).
 *   2 · `googly`  — der Mod `MODS.googly` aus `studio-v3/pet-library.v6.js` (flache Cel-Scheiben,
 *                   eigener Anker, eigenes Blinzeln). Bis 17.09.2026 hing er sich SELBST an, weil
 *                   `SETS.animals.mods = ['googly','emotes']` die Vorgabe des Sets war: wer
 *                   `load()` ohne `mods: []` aufrief, bekam ihn, ohne ihn zu bestellen.
 *                   SEIT §4: die Set-Vorgabe ist `['emotes']`, googly kommt nur auf ausdrückliche
 *                   Bestellung (`face.pupil.form === 'googly'` oder `opts.mods`). Der Wächter
 *                   prüft beides — die Vorgabe (`assertEmbedEyePolicy`) und das Ergebnis.
 *   3 · `eyerig`  — `studio-v12/pet-eye-rig.v6.js#EyeRig`: unsere Kugelaugen mit Lidern, Blinzeln,
 *                   Wimpern, Emotes. Das ist der Default der ToolBox.
 *
 * Der Vertrag sagt es bereits (kfb-pets.json `embed.verbote`): »Keine Zone schreibt eine eigene
 * Augen-Implementierung. Wer googly braucht, setzt face.pupil.form = "googly".« Diese Datei macht
 * daraus eine PRÜFUNG statt einer Bitte: `loadOpts()` liefert die einzige erlaubte Aufrufform,
 * `auditEyeSources()` zählt nach, was tatsächlich am Kopf hängt, `assertSingleEyeSource()` bricht
 * ab, bevor ein gemischtes Gesicht auf die Bühne kommt.
 *
 * Der Prüfstand nutzt das Modul; der Embed, den wir herausgeben, MUSS es ebenso nutzen (genau eine
 * Zeile nach dem Aufbau des Gesichts). Ohne Prüfung ist die Regel eine Fußnote, und die Fußnote
 * war der Dauerfehler.
 *
 * STAND 17.09.2026 · PROMOTED: diese Datei liegt jetzt IM Quellbaum (studio-v3/), nicht mehr nur
 * in der Übergabe. Die Kopie in `_handover/.../qa/` bleibt als Prüfstands-Beleg liegen; der
 * Quellbaum ist ab jetzt die Wahrheit. Drei Pflichten (EYE_SOURCE_RULE.md §4):
 *   1 · jeder Pfad, der ein Gesicht baut, ruft `assertSingleEyeSource` — Cube-Pet wirft,
 *       Zweibeiner/Requisite melden (noch nicht an allen Bewohnern gemessen).
 *   2 · `SETS.animals.mods` führt KEINE Augenquelle mehr.
 *   3 · `assertEmbedEyePolicy(SETS)` ist Abnahmebedingung: eine Augenquelle in einer Set-Vorgabe
 *       = kein Build. Ein Fehlschlag ist kein Hinweis, sondern ein Halt.
 */

export const SCHEMA = 'kfb.eye-source-guard/1';

export const SOURCES = {
  kenney: 'Kenneys aufgebackene Augen-Schalen im body-Mesh (nicht gelöscht)',
  googly: 'MODS.googly aus pet-library.v6.js (Set-Vorgabe SETS.animals.mods)',
  eyerig: 'EyeRig v6 (studio-v12/pet-eye-rig.v6.js) — Default der ToolBox',
};

/** Die EINZIGE erlaubte Aufrufform von `Character.load` in der ToolBox.
 *  `mods: []` ist der Punkt: sonst zieht das Set seinen googly-Mod mit.
 *  (Dieselbe Form benutzt Studio v17/v18 in `loadPet`.) */
export function loadOpts(face, extra = {}) {
  return { recolor: null, ...extra, face: face || {}, mods: [] };   // mods zuletzt: nicht überschreibbar
}

/** Zählt die tatsächlich wirksamen Augenquellen an einem Cube-Pet-Host.
 *  ch  = studio-v3/pet-library.v6.js#Character (geladen)
 *  rig = EyeRig-Instanz oder null
 *  Rückgabe: { schema, ok, sources[], detail{} } — `ok` heißt: GENAU EINE Quelle. */
export function auditEyeSources(ch, opts = {}) {
  const rig = opts.rig || null;
  const sources = [];
  const detail = {};

  const body = (ch && ch._body) || null;
  const orig = body && body.userData && body.userData._faceOrigGeo;
  const strippedGeo = !!(body && orig && body.geometry !== orig);
  const kenney = !!body && !strippedGeo;
  detail.kenney = {
    active: kenney,
    bodyMesh: body ? (body.name || '(unbenannt)') : null,
    faceApplied: !!orig,
    geometryReplaced: strippedGeo,
    why: !body ? 'kein body-Mesh gefunden'
      : strippedGeo ? 'Augen-Schalen gelöscht (Character.load({face}) hat die Geometrie ersetzt)'
      : orig ? 'face-Block lief, hat aber nichts gelöscht (stripEyes aus, oder kein gespiegeltes Schalenpaar gefunden)'
      : 'kein face-Block übergeben — das GLB liegt roh auf der Bühne',
  };
  if (kenney) sources.push('kenney');

  const mods = (ch && ch._mods) || [];
  const googly = mods.indexOf('googly') >= 0 || !!(ch && (ch._eyes || ch._eyeRig));
  detail.googly = {
    active: googly, mods: mods.slice(),
    modRig: !!(ch && ch._eyeRig), modEyes: !!(ch && ch._eyes),
    why: googly ? 'Mod hängt am body-Mesh — load() wurde ohne mods: [] aufgerufen (oder googly ausdrücklich bestellt)' : 'nicht angesteckt',
  };
  if (googly) sources.push('googly');

  const eyerig = !!(rig && rig.eyes && rig.eyes.length);
  detail.eyerig = { active: eyerig, eyes: eyerig ? rig.eyes.length : 0, gen: (rig && rig.gen) || null, pupilStyle: (rig && rig.pupilStyle) || null };
  if (eyerig) sources.push('eyerig');

  return { schema: SCHEMA, ok: sources.length === 1, sources, expected: opts.expected || 'eyerig', detail };
}

/** Wie `auditEyeSources`, bricht aber ab, wenn nicht genau eine Quelle wirkt (oder die falsche).
 *  Aufrufen, BEVOR die Figur gezeigt wird. */
export function assertSingleEyeSource(ch, opts = {}) {
  const a = auditEyeSources(ch, opts);
  const want = a.expected;
  if (!a.ok || (want && a.sources[0] !== want)) {
    const e = new Error(
      `[eye-source-guard] ${a.sources.length} Augenquelle(n) aktiv: ${a.sources.join(' + ') || 'keine'} — erwartet: ${want}. `
      + Object.keys(SOURCES).filter((k) => a.detail[k] && a.detail[k].active).map((k) => `${k}: ${a.detail[k].why || SOURCES[k]}`).join(' | ')
      + ` Abhilfe: Character.load(set, id, loadOpts(lib.face)) — mods: [] erzwingen, face-Block mitgeben, EyeRig danach bauen.`);
    e.audit = a;
    throw e;
  }
  return a;
}

/** Graft-Pfad (FrizzleBob auf KayKit): der Spenderkopf bringt eigene Augen mit.
 *  `graft-mount.v1.js` entfernt sie über `donoreyes.v1.js` — hier wird nachgezählt, nicht vertraut. */
export function auditGraftEyes(handle) {
  const donorStripped = !!(handle && handle.donorEyes && handle.donorEyes.status === 'OK');
  const eyerig = !!(handle && handle.rig && handle.rig.eyes && handle.rig.eyes.length);
  const sources = [];
  if (!donorStripped) sources.push('donor');
  if (eyerig) sources.push('eyerig');
  return {
    schema: SCHEMA, ok: sources.length === 1 && sources[0] === 'eyerig', sources,
    detail: { donorStripped, donorReport: (handle && handle.donorEyes) ? (handle.donorEyes.status || null) : null, eyes: eyerig ? handle.rig.eyes.length : 0 },
  };
}

/* ══ §4 · ABNAHMEBEDINGUNG DES EMBEDS ════════════════════════════════════════════════════════
   Die Laufzeitprüfung oben fängt den Fehler, wenn er passiert. Diese Prüfung fängt ihn, BEVOR
   jemand ihn machen kann: keine Set-Vorgabe darf eine Augenquelle enthalten. Solange
   `SETS.animals.mods = ['googly','emotes']` hieß, war jeder neue Aufrufer einen Tippfehler von
   doppelten Augen entfernt — deshalb ist die Vorgabe selbst der Prüfgegenstand, nicht nur ihr
   Ergebnis. Aufrufen: im Bundle-Schritt und beim Start jeder Zone, die Pets baut.
   `SETS` = das Export-Objekt aus `studio-v3/pet-library.v6.js`. */
export const EYE_SOURCE_MODS = ['googly'];

export function auditEmbedEyePolicy(SETS) {
  const offenders = [];
  for (const [id, set] of Object.entries(SETS || {})) {
    const bad = ((set && set.mods) || []).filter((m) => EYE_SOURCE_MODS.indexOf(m) >= 0);
    if (bad.length) offenders.push({ set: id, mods: bad });
  }
  return {
    schema: SCHEMA, ok: offenders.length === 0, offenders,
    checked: Object.keys(SETS || {}),
    rule: 'Kein Character-Set führt eine Augenquelle als Vorgabe. Wer googly braucht, bestellt ihn: face.pupil.form = "googly".',
  };
}

export function assertEmbedEyePolicy(SETS) {
  const a = auditEmbedEyePolicy(SETS);
  if (!a.ok) {
    const e = new Error('[eye-source-guard] Set-Vorgabe enthält eine Augenquelle: '
      + a.offenders.map((o) => o.set + ' -> [' + o.mods.join(', ') + ']').join(' · ')
      + '. ' + a.rule + ' Abhilfe: in pet-library.v6.js aus SETS.<set>.mods entfernen — der Mod bleibt bestellbar.');
    e.audit = a;
    throw e;
  }
  return a;
}

/* ══ VIERTE QUELLE · DIE ORIGINALAUGEN EINES KAYKIT-WIRTS ════════════════════════════════════
   `auditEyeSources` oben ist am CUBE-PET gemessen und kennt deshalb drei Quellen. Ein KayKit-Wirt
   (FrizzleBob · Graft · GothGirl · Carl) bringt eine vierte mit, und sie sieht anders aus:

   · als eigene NETZE am Kopfknoten, erkennbar am Materialnamen — gemessen 09.09. an FrizzleBob:
     Iris `EyeColor` (60 Dreiecke) · Sklera `White` (20) · Augenringe `Black` (112). `_loadBiped`
     stellt sie auf `visible = false`; unsichtbar heißt hier »entfernt«, es sind eigene Netze.
   · als GEOMETRIE-INSELN im Kopfnetz — gemessen an GothGirl (`goth-biped.v1.js`: Inseln 6 und 7).
     Diese Zählung macht das jeweilige Modul selbst und meldet sie in seinem Report.

   Deshalb zählt `auditHostEyes` beides: was an Netzen SICHTBAR ist (das kann diese Datei selbst
   messen) und was das Modul über seine Inseln meldet (das kann nur das Modul). Was hier NICHT
   passiert: eine Insel-Suche auf einem fremden Kopf — die ist pro Modell geprüft und gehört dorthin,
   wo sie gemessen wurde. Ein Wächter, der rät, ist kein Wächter.

   `figure` = das Wirtsnetz (`b.figure` / `handle.figure`), `rig` = EyeRig-Instanz,
   `islandEyes` = was das Modul über seine Original-Augen-Inseln sagt (Zahl, Array oder null). */
export const DONOR_EYE_MATS = /^(EyeColor|White|Black)$/;

export function auditDonorMeshes(figure) {
  const visible = [], hidden = [];
  if (figure && figure.traverse) figure.traverse((o) => {
    if (!o.isMesh && !o.isSkinnedMesh) return;
    const mats = [].concat(o.material || []).filter(Boolean);
    if (!mats.some((m) => DONOR_EYE_MATS.test(m.name || ''))) return;
    let head = false, p = o.parent;
    while (p) { if (/^Head/i.test(p.name || '')) { head = true; break; } p = p.parent; }
    if (!head) return;
    const row = { mesh: o.name || '(unbenannt)', mats: mats.map((m) => m.name), visible: o.visible !== false };
    (row.visible ? visible : hidden).push(row);
  });
  return { visible, hidden, ok: visible.length === 0 };
}

export function auditHostEyes(ctx, opts = {}) {
  const rig = opts.rig || null;
  const figure = opts.figure || null;
  const sources = [], detail = {};

  const donor = auditDonorMeshes(figure);
  detail.donor = { ...donor, why: donor.visible.length
    ? donor.visible.length + ' Originalaugen-Netz(e) SICHTBAR: ' + donor.visible.map((r) => r.mesh + ' [' + r.mats.join(',') + ']').join(' · ')
    : (donor.hidden.length ? donor.hidden.length + ' Originalaugen-Netz(e) gefunden und unsichtbar gestellt' : 'keine Netze mit EyeColor/White/Black unter einem Head-Knoten gefunden') };
  if (donor.visible.length) sources.push('donor');

  const isl = opts.islandEyes;
  const islN = Array.isArray(isl) ? isl.length : (typeof isl === 'number' ? isl : null);
  detail.islands = { reported: isl == null ? null : isl, count: islN,
    why: isl == null ? 'das Modul meldet keine Original-Augen-Inseln (dann gibt es entweder keine, oder es sagt es nicht)'
      : islN ? islN + ' Insel(n) im Kopfnetz gemeldet — das Modul ist dafür zuständig, sie zu entfernen; hier wird nur mitgeschrieben'
      : 'keine Inseln' };

  const mods = (ctx && ctx._mods) || [];
  const googly = mods.indexOf('googly') >= 0 || !!(ctx && (ctx._eyes || ctx._eyeRig));
  detail.googly = { active: googly, mods: mods.slice(), why: googly ? 'googly-Mod hängt am Wirt' : 'nicht angesteckt' };
  if (googly) sources.push('googly');

  const eyerig = !!(rig && rig.eyes && rig.eyes.length);
  detail.eyerig = { active: eyerig, eyes: eyerig ? rig.eyes.length : 0, pupilStyle: (rig && rig.pupilStyle) || null,
    why: eyerig ? 'EyeRig gebaut (Default der ToolBox)' : 'kein Rig gebaut' };
  if (eyerig) sources.push('eyerig');

  return { schema: SCHEMA, ok: sources.length === 1, sources, expected: opts.expected || 'eyerig', host: opts.host || null, detail };
}

export function assertSingleHostEyeSource(ctx, opts = {}) {
  const a = auditHostEyes(ctx, opts);
  if (!a.ok || (a.expected && a.sources[0] !== a.expected)) {
    const e = new Error('[eye-source-guard] ' + (a.host || 'Wirt') + ': ' + a.sources.length + ' Augenquelle(n) aktiv: '
      + (a.sources.join(' + ') || 'keine') + ' — erwartet: ' + a.expected + '. '
      + ['donor', 'googly', 'eyerig'].filter((k) => a.detail[k] && a.detail[k].active).map((k) => k + ': ' + a.detail[k].why).join(' | '));
    e.audit = a;
    throw e;
  }
  return a;
}
