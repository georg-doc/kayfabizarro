export const VFX_SCHEMA = 'kfb.vfx-katalog/1';
export const VFX_LIVE_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/tools/asset_registry/librarian/live/vfx-katalog.r1.json';
const SNAPSHOT_URL = new URL('./live/vfx-katalog.r1.json', import.meta.url).href;
const SNAPSHOT_KEY = 'kfb.asset-librarian.vfx-r1.snapshot';
const PRIVATE_KEYS = new Set(['inboxfileid','inboxrecordid','fileid','recordid','privatepath','downloadpath','downloadurl','storagekey','objectkey','downloadtoken','accesstoken','apikey','authorization','cookie','credential','secret']);

export function publicVfxURL(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    if (/dropbox|production-inbox|private|localhost/i.test(url.hostname)) return null;
    if (/\/(?:api\/intake|intake\/files|private)\//i.test(url.pathname)) return null;
    if ([...url.searchParams.keys()].some(key => /token|secret|credential|signature|authorization|api.?key|x-amz-|x-goog-/i.test(key))) return null;
    return url.href;
  } catch { return null; }
}

export function vfxPreviewURL(value) {
  const safe = publicVfxURL(value);
  if (!safe) return null;
  const url = new URL(safe);
  if (url.search || url.hash) return null;
  if (url.hostname === 'git.patch.gg' && /^\/[^/]+\/[^/]+\/raw\/[a-f0-9]{40}\/.+\.webp$/i.test(url.pathname)) return safe;
  if (url.hostname === 'cdn.patch.gg' && /^\/media\/(?:levels|sha256)\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]{64}(?:\/\d+\.webp)?$/i.test(url.pathname)) return safe;
  return null;
}

function assertPublic(value) {
  if (!value || typeof value !== 'object') {
    if (typeof value === 'string' && /^https?:\/\//i.test(value) && !publicVfxURL(value)) throw new Error('Private URL in VFX catalogue');
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (PRIVATE_KEYS.has(key.toLowerCase().replace(/[^a-z]/g, ''))) throw new Error('Private field in VFX catalogue');
    assertPublic(child);
  }
}

export function validateVfxCatalog(doc) {
  if (doc?.schema !== VFX_SCHEMA || !Array.isArray(doc.spender) || !doc.zahlen?.nach_status) throw new Error('Invalid VFX catalogue');
  assertPublic(doc);
  const donors = new Set(), effects = new Set(), counts = {};
  for (const donor of doc.spender) {
    if (typeof donor.id !== 'string' || !donor.id || typeof donor.name !== 'string' || !Array.isArray(donor.effekte) || donors.has(donor.id)) throw new Error('Invalid VFX donor');
    for (const key of ['caveats','globale_parameter','api']) if (donor[key] !== undefined && !Array.isArray(donor[key])) throw new Error('Invalid VFX donor list');
    donors.add(donor.id);
    for (const effect of donor.effekte) {
      if (typeof effect.id !== 'string' || !effect.id || typeof effect.name !== 'string' || !effect.name || typeof effect.status !== 'string' || effects.has(effect.id)) throw new Error('Invalid VFX effect');
      for (const key of ['parameter','presets','kfb_presets','use_cases','caveats']) if (effect[key] !== undefined && !Array.isArray(effect[key])) throw new Error('Invalid VFX effect list');
      effects.add(effect.id);
      counts[effect.status] = (counts[effect.status] || 0) + 1;
    }
  }
  if (doc.zahlen.spender !== donors.size || doc.zahlen.effekte !== effects.size) throw new Error('VFX totals do not match');
  const statuses = new Set([...Object.keys(counts), ...Object.keys(doc.zahlen.nach_status)]);
  if ([...statuses].some(status => (counts[status] || 0) !== (doc.zahlen.nach_status[status] || 0))) throw new Error('VFX status counts do not match');
  return doc;
}

async function readCatalog(url) {
  const response = await fetch(url, {cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error('VFX source unavailable');
  return validateVfxCatalog(await response.json());
}

export async function loadVfxCatalog() {
  // Only a browser snapshot of the same owner document is retained, never a second registry.
  let snapshot = null;
  try { snapshot = validateVfxCatalog(JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || 'null')); } catch {}
  if (!snapshot) {
    try { snapshot = await readCatalog(SNAPSHOT_URL); } catch {}
  }
  try {
    const document = await readCatalog(VFX_LIVE_URL);
    try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(document)); } catch {}
    return {document, source: 'main'};
  } catch {
    return {document: snapshot, source: snapshot ? 'snapshot' : 'unavailable'};
  }
}

export function vfxRows(document) {
  return document ? document.spender.flatMap(donor => donor.effekte.map(effect => ({vfxEffect: effect, vfxDonor: donor}))) : [];
}

export function vfxSearchText(row) {
  const effect = row.vfxEffect, donor = row.vfxDonor;
  return JSON.stringify(effect ? [effect.name, effect.id, donor.name, effect.use_cases, effect.caveats, donor.caveats, effect.schalter]
    : [donor.name, donor.id, donor.caveats, donor.globale_parameter, donor.api]).toLowerCase();
}

export function vfxReference(row, preset) {
  const effect = row.vfxEffect;
  const parameter = preset ? preset.werte : Object.fromEntries((effect.parameter || []).map(value => [value.name, value.standard]));
  return {katalog: VFX_SCHEMA, id: effect.id, einbauweg: row.vfxDonor.einbauweg, parameter};
}

export const vfxText = value => value === undefined ? '—' : typeof value === 'string' ? value : JSON.stringify(value);
const node = (tag, text, cls) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = vfxText(text); if (cls) el.className = cls; return el; };
function section(title) { const el = node('section', undefined, 'vfx-section'); el.append(node('h3', title)); return el; }
function pairs(entries) {
  const dl = node('dl', undefined, 'vfx-facts');
  for (const [key, value] of entries) dl.append(node('dt', key), node('dd', value));
  return dl;
}
function extras(object, keys) { return pairs(Object.entries(object).filter(([key]) => !keys.includes(key))); }
function listSection(title, values) {
  const el = section(title), list = node('ul');
  for (const value of values || []) list.append(node('li', value));
  if (!list.children.length) el.append(node('p', '—', 'small-note')); else el.append(list);
  return el;
}
function parameterSection(title, parameters) {
  const el = section(title), wrap = node('div', undefined, 'vfx-table-wrap'), table = node('table'), head = node('thead'), tr = node('tr'), body = node('tbody');
  for (const key of ['name', 'bereich', 'standard', 'wirkung']) tr.append(node('th', key));
  head.append(tr);
  for (const parameter of parameters || []) {
    const row = node('tr');
    for (const key of ['name', 'bereich', 'standard', 'wirkung']) row.append(node('td', parameter[key]));
    body.append(row);
    const additional = Object.entries(parameter).filter(([key]) => !['name','bereich','standard','wirkung'].includes(key));
    if (additional.length) { const more = node('tr'), cell = node('td'); cell.colSpan = 4; cell.append(pairs(additional)); more.append(cell); body.append(more); }
  }
  table.append(head, body); wrap.append(table);
  el.append(parameters?.length ? wrap : node('p', '—', 'small-note'));
  return el;
}
function presetsSection(title, presets) {
  const el = section(title);
  if (!presets?.length) el.append(node('p', '—', 'small-note'));
  for (const preset of presets || []) el.append(pairs([['Name', preset.name], ['Werte', preset.werte]]), extras(preset, ['name','werte']));
  return el;
}

export function vfxPreview(preview, label) {
  const host = node('div', undefined, 'vfx-preview'), placeholder = node('span', preview?.datei ?? 'Keine Bildvorschau', 'vfx-placeholder');
  const url = vfxPreviewURL(preview?.url);
  host.append(placeholder);
  if (url) {
    placeholder.textContent = 'Bild wird geladen…';
    const image = node('img'); image.alt = label; image.loading = 'lazy'; image.referrerPolicy = 'no-referrer';
    image.addEventListener('load', () => { placeholder.hidden = true; }, {once: true});
    image.addEventListener('error', () => { image.remove(); placeholder.textContent = preview?.datei ?? 'Keine Bildvorschau'; placeholder.hidden = false; }, {once: true});
    image.src = url; host.prepend(image);
  }
  return host;
}

export function renderVfxDetail(row, host, actions) {
  const effect = row.vfxEffect, donor = row.vfxDonor;
  const header = section(effect ? 'Effekt' : 'Spender');
  const source = publicVfxURL(donor.quelle_url);
  if (source) { const link = node('a', donor.name); link.href = source; link.target = '_blank'; link.rel = 'noopener noreferrer'; header.append(link); }
  header.append(pairs([['id', effect?.id ?? donor.id], ['Spender', donor.name], ['lizenz', donor.lizenz], ['einbauweg', donor.einbauweg], ['im_stamm', donor.im_stamm], ['schalter', effect ? effect.schalter : donor.im_stamm?.schalter], ['version', donor.version], ['renderer', donor.renderer]]));
  host.replaceChildren(header, vfxPreview(effect?.vorschau ?? donor.vorschau, effect?.name ?? donor.name));
  if (effect) {
    const presetRows = [...(effect.presets || []).map(preset => ({label: 'Preset · ' + preset.name, preset})), ...(effect.kfb_presets || []).map(preset => ({label: 'KFB · ' + preset.name, preset}))];
    const label = node('label', 'Parameter-Werte'), select = node('select'); select.id = 'vfxReferencePreset';
    select.append(new Option('Standardwerte', ''), ...presetRows.map((entry, index) => new Option(entry.label, String(index)))); label.append(select);
    const copy = node('button', 'Referenz kopieren', 'primary'), feedback = node('span', 'Kandidat', 'small-note'); copy.type = 'button'; copy.id = 'copyVfxReference'; feedback.setAttribute('role', 'status');
    copy.onclick = async () => {
      try { await navigator.clipboard.writeText(JSON.stringify(vfxReference(row, select.value === '' ? null : presetRows[Number(select.value)].preset), null, 2)); feedback.textContent = 'Kandidat · Referenz kopiert'; }
      catch { feedback.textContent = 'Zwischenablage nicht verfügbar'; }
    };
    actions.append(label, copy, feedback);
    host.append(parameterSection('parameter', effect.parameter), presetsSection('presets', effect.presets), presetsSection('kfb_presets', effect.kfb_presets),
      pairs([['dauer_s', effect.dauer_s], ...(Object.hasOwn(effect, 'phasen_s') ? [['phasen_s', effect.phasen_s]] : []), ['kosten', effect.kosten]]),
      listSection('use_cases', effect.use_cases), listSection('caveats · Effekt', effect.caveats));
    host.append(extras(effect, ['id','name','art','parameter','presets','kfb_presets','dauer_s','phasen_s','kosten','use_cases','caveats','status','schalter','vorschau']));
    host.append(extras(effect.vorschau || {}, ['url']));
  }
  const donorDetails = node('details', undefined, 'vfx-donor-details'); donorDetails.open = !effect; donorDetails.append(node('summary', 'Spender · ' + donor.name),
    listSection('caveats · Spender', donor.caveats), parameterSection('globale_parameter', donor.globale_parameter), listSection('api', donor.api),
    extras(donor, ['id','name','quelle_url','lizenz','einbauweg','im_stamm','version','renderer','vorschau','caveats','globale_parameter','api','effekte']), extras(donor.vorschau || {}, ['url']));
  host.append(donorDetails);
}
