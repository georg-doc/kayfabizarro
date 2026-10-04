#!/usr/bin/env node
/* check-loadpath.mjs — prüft den Ladeweg eines KFB-Sitzungsschnitts.
 *
 * Warum das Skript existiert: beim Re-Home v9 nach WS0 (28.08.2026) fehlte am Zielort eine Datei,
 * die im Paket UND im Repo lag — `studio-v3/PET_EDITOR/pet-LIBRARY.json`. Sie lag eine Ebene
 * tiefer als die Verzeichnisabfrage reichte. Eine Ordneransicht mit Tiefenbegrenzung ist keine
 * Vollständigkeitsprüfung; ein aufgelöster Pfad ist eine.
 *
 * Aufruf im Paketordner (Node ≥ 18, keine Abhängigkeiten):
 *   node tools/check-loadpath.mjs            → prüft und schreibt einen Bericht
 *   node tools/check-loadpath.mjs --write    → schreibt LADEWEG.tsv als Sollstand
 *   node tools/check-loadpath.mjs --verbose  → listet jede aufgelöste Adresse
 *
 * Exit-Code 0 = vollständig, 1 = etwas fehlt oder weicht ab. Damit taugt es für einen Haken.
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname, relative, join, sep } from 'node:path';

const ROOT = resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '.');
const WRITE = process.argv.includes('--write');
const VERBOSE = process.argv.includes('--verbose');
const SOLL = join(ROOT, 'LADEWEG.tsv');

const SCAN = /\.(js|mjs|html|json)$/i;
const SKIP = /(standalone|node_modules|LADEWEG)/i;
/* Relative Adressen in Anführungszeichen. Absolute URLs bleiben draußen: die kommen zur Laufzeit
   aus dem Repo und sind nicht Sache dieses Pakets. */
const REF = /['"`](\.{1,2}\/[^'"`\n\r]+?\.(?:js|mjs|json|otf|ttf|woff2?|png|jpe?g|webp|glb|mp3|wav|ogg|css))['"`]/g;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!/^(node_modules|\.git)$/.test(e.name)) out.push(...await walk(p)); }
    else out.push(p);
  }
  return out;
}
const norm = (p) => relative(ROOT, p).split(sep).join('/');

async function sha(p) {
  return createHash('sha256').update(await readFile(p)).digest('hex').slice(0, 16);
}

const all = await walk(ROOT);
const sources = all.filter((p) => SCAN.test(p) && !SKIP.test(norm(p)));

const refs = [];          // {von, adresse, ziel}
const missing = [];
for (const src of sources) {
  const text = await readFile(src, 'utf8');
  let m;
  while ((m = REF.exec(text))) {
    const ziel = resolve(dirname(src), m[1]);
    const row = { von: norm(src), adresse: m[1], ziel: norm(ziel) };
    refs.push(row);
    try { await stat(ziel); } catch { missing.push(row); }
  }
}

/* Jede Datei im Paket, die von niemandem adressiert wird — kein Fehler, aber der Ort, an dem
   verwaiste Masse und vergessene Beilagen sichtbar werden. */
const adressiert = new Set(refs.map((r) => r.ziel));
const unadressiert = all.map(norm).filter((p) => !adressiert.has(p) && !/\.md$/i.test(p));

const dateien = [];
for (const p of all) dateien.push({ pfad: norm(p), bytes: (await stat(p)).size, sha: await sha(p) });
dateien.sort((a, b) => a.pfad.localeCompare(b.pfad));

if (WRITE) {
  const tsv = ['# LADEWEG.tsv — Sollstand, erzeugt von tools/check-loadpath.mjs',
    '# pfad\tbytes\tsha256-16']
    .concat(dateien.map((d) => `${d.pfad}\t${d.bytes}\t${d.sha}`)).join('\n') + '\n';
  await writeFile(SOLL, tsv);
  console.log(`LADEWEG.tsv geschrieben · ${dateien.length} Dateien`);
}

let abweichend = [], fehlend = [];
try {
  const soll = (await readFile(SOLL, 'utf8')).split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => { const [pfad, bytes, s] = l.split('\t'); return { pfad, bytes: +bytes, sha: s }; });
  const ist = new Map(dateien.map((d) => [d.pfad, d]));
  for (const s of soll) {
    const i = ist.get(s.pfad);
    if (!i) fehlend.push(s.pfad);
    else if (i.sha !== s.sha) abweichend.push(`${s.pfad} (soll ${s.bytes} B/${s.sha} · ist ${i.bytes} B/${i.sha})`);
  }
} catch { /* kein Sollstand vorhanden — dann prüfen wir nur den Ladeweg */ }

console.log(`\nOrdner:        ${ROOT}`);
console.log(`Dateien:       ${dateien.length}`);
console.log(`Quelldateien:  ${sources.length}`);
console.log(`Referenzen:    ${refs.length}`);
console.log(`fehlend:       ${missing.length}`);
if (missing.length) for (const r of missing) console.log(`   ✗ ${r.ziel}   ← ${r.von}  ("${r.adresse}")`);
if (fehlend.length) { console.log(`\nIm Sollstand, aber nicht im Ordner: ${fehlend.length}`); for (const p of fehlend) console.log(`   ✗ ${p}`); }
if (abweichend.length) { console.log(`\nInhaltlich abweichend: ${abweichend.length}`); for (const p of abweichend) console.log(`   ≠ ${p}`); }
if (unadressiert.length) { console.log(`\nVon keiner Datei adressiert (${unadressiert.length}) — kein Fehler, nur zur Kenntnis:`); for (const p of unadressiert) console.log(`   · ${p}`); }
if (VERBOSE) { console.log('\nAlle Referenzen:'); for (const r of refs) console.log(`   ${r.von} → ${r.ziel}`); }

const ok = !missing.length && !fehlend.length && !abweichend.length;
console.log(`\n${ok ? '✓ Ladeweg vollständig' : '✗ Ladeweg unvollständig'}`);
process.exit(ok ? 0 : 1);
