export const REGISTRY_BASE = '../../../registry/assets/v1';
export const PROFILES_URL = '../consumer_profiles.json';
export const RESULT_LIMIT = 120;
export const STORAGE_SELECTION = 'kfb.asset-librarian.v1.2.selection';
export const STORAGE_VIEW = 'kfb.asset-librarian.v1.2.view';
export const $ = (id) => document.getElementById(id);

function storedSelection() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_SELECTION) || '[]');
    return Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
  } catch { return []; }
}

export const state = {
  manifest: null, packs: [], profiles: {}, rigSummary: null,
  catalog: null, catalogById: null, rigById: null,
  problems: null, problemsByAsset: new Map(),
  selected: new Set(storedSelection()), active: null, lastResults: [],
  viewMode: localStorage.getItem(STORAGE_VIEW) === 'gallery' ? 'gallery' : 'list',
};

export function persistSelection() {
  localStorage.setItem(STORAGE_SELECTION, JSON.stringify([...state.selected].sort()));
}
export async function fetchJSON(url, optional = false) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    if (optional) return null;
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}
export async function fetchJSONL(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const text = await response.text();
  return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}
export function option(value, text) {
  const node = document.createElement('option'); node.value = value; node.textContent = text; return node;
}
export function badge(text, cls = '') {
  const node = document.createElement('span'); node.className = `badge ${cls}`.trim(); node.textContent = text; return node;
}
export function formatBytes(value) {
  const bytes = Number(value || 0); if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B','KB','MB','GB']; const i = Math.min(3, Math.floor(Math.log(bytes) / Math.log(1024)));
  const number = bytes / (1024 ** i); return `${number >= 10 || i === 0 ? number.toFixed(0) : number.toFixed(1)} ${units[i]}`;
}
export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return 'duration unknown';
  return `${Math.floor(seconds / 60)}:${Math.round(seconds % 60).toString().padStart(2,'0')}`;
}
export function setBusy(busy, text = '') {
  document.body.classList.toggle('loading', busy);
  if (text) $('registryStatus').textContent = text;
  else if (state.manifest) $('registryStatus').textContent = 'Registry ready';
}
export function showError(error) {
  $('resultMeta').textContent = error.message; $('resultMeta').classList.add('error'); document.body.classList.remove('loading');
}
