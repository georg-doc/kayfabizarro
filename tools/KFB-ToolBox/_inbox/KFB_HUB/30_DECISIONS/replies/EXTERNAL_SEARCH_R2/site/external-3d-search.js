import { createSearchPager } from './external-search-paging.js';
const API_BASE = 'https://3d.shep.bot';
const CACHE_PREFIX = 'kfb.external-3d-search.cache.v1:';
const CACHE_TTL_MS = 5 * 60 * 1000;
const INTAKE_KEY = 'kfb.external-asset-intake.v1.site';
const CANDIDATE_STATUS = 'EXTERNAL_DISCOVERY_CANDIDATE';

function safeURL(value) {
  try {
    const url = new URL(String(value || ''));
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function formatNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString() : '—';
}

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (!bytes) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(3, Math.floor(Math.log(bytes) / Math.log(1024)));
  const n = bytes / (1024 ** i);
  return `${n >= 10 || i === 0 ? n.toFixed(0) : n.toFixed(1)} ${units[i]}`;
}

function claim(value, yes = 'Yes', no = 'No') {
  return value === true ? yes : value === false ? no : 'Unknown';
}

export function createExternalSearchController({ $, escapeHTML, toast }) {
  const state = {
    providers: [], results: [], details: new Map(), activeId: null, compare: new Set(),
    intake: loadIntake(), loading: false, lastQuery: '', requestToken: 0,
  };

  function loadIntake() {
    try {
      const rows = JSON.parse(localStorage.getItem(INTAKE_KEY) || '[]');
      return Array.isArray(rows) ? rows : [];
    } catch { return []; }
  }

  function persistIntake() {
    localStorage.setItem(INTAKE_KEY, JSON.stringify(state.intake));
    updateBadge();
  }

  function updateBadge() {
    if ($('setCount')) $('setCount').textContent = state.intake.length;
  }

  function readCache(key) {
    try {
      const row = JSON.parse(sessionStorage.getItem(CACHE_PREFIX + key) || 'null');
      if (row && Date.now() - row.savedAt < CACHE_TTL_MS) return row.value;
    } catch {}
    return null;
  }

  function writeCache(key, value) {
    try { sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ savedAt: Date.now(), value })); } catch {}
  }

  async function api(path, params = {}, signal) {
    const url = new URL(path, API_BASE);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) url.searchParams.set(key, value);
    });
    const key = url.href;
    const cached = readCache(key);
    if (cached) return cached;
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(25000)]) : AbortSignal.timeout(25000) });
    if (!response.ok) throw new Error(response.status === 429 ? 'External search is rate-limited. Please retry shortly.' : `External search returned ${response.status}.`);
    const value = await response.json();
    if (!(value.providers || []).some(p => ['error', 'timeout'].includes(p.status))) writeCache(key, value);
    return value;
  }

  function normalize(asset) {
    return {
      ...asset,
      status: CANDIDATE_STATUS,
      sourcePage: safeURL(asset.url),
      thumbnailUrl: safeURL(asset.thumbnailUrl),
      formats: Array.isArray(asset.formats) ? asset.formats : [],
      resolutions: Array.isArray(asset.resolutions) ? asset.resolutions : [],
      tags: Array.isArray(asset.tags) ? asset.tags : [],
      files: Array.isArray(asset.files) ? asset.files.map((file) => ({ ...file, url: safeURL(file.url) })).filter((file) => file.url) : [],
    };
  }

  async function loadProviders() {
    if (state.providers.length) return;
    try {
      const payload = await api('/v1/providers');
      state.providers = Array.isArray(payload) ? payload : (payload.providers || []);
      const enabled = state.providers.filter((provider) => provider.enabled !== false && provider.assetTypes?.includes('model'));
      $('externalProvider').replaceChildren(
        new Option(`All providers · ${enabled.length}`, ''),
        ...enabled.map((provider) => new Option(provider.name || provider.id, provider.id)),
      );
      $('externalProviderMeta').textContent = `${enabled.length} current providers`;
    } catch (error) {
      $('externalProviderMeta').textContent = 'Provider list unavailable';
      showError(error.message);
    }
  }

  function showError(message) {
    $('externalError').hidden = false;
    $('externalError').textContent = message;
  }

  function clearError() { $('externalError').hidden = true; $('externalError').textContent = ''; }

  function licenseLabel(asset) { return asset.license?.name || 'License not reported'; }
  function priceLabel(asset) { return asset.price?.free === true ? 'Free claim' : asset.price?.free === false ? (asset.price?.amount || 'Paid') : 'Price unknown'; }
  function accessLabel(asset) { return asset.downloadable ? 'Downloadable' : 'Link only'; }

  const pager = createSearchPager({
    request: (params, signal) => api('/v1/search', { ...params, type: 'model', free: params.free ? 'true' : '', downloadable: params.downloadable ? 'true' : '' }, signal),
    onChange: (page) => {
      state.results = page.results.map(normalize); state.loading = page.loading;
      if (!state.activeId && state.results.length) { state.activeId = state.results[0].id; renderDetail(); }
      renderResults();
    },
  });

  async function search() {
    const query = $('externalSearchInput').value.trim().replace(/\s+/g, ' ');
    if (!query) return $('externalSearchInput').focus();
    const token = ++state.requestToken;
    clearError(); state.lastQuery = query; state.activeId = null; state.compare.clear();
    // Cancel obsolete work immediately, including while provider discovery waits.
    await pager.reset({ q: query }, []);
    renderDetail(); renderCompare();
    await loadProviders();
    if (token !== state.requestToken) return;
    if (!state.providers.length) return showError('Sources unavailable. Please retry Search.');
    const config = { q: query, free: $('externalFreeOnly').checked, downloadable: $('externalDownloadableOnly').checked };
    const selected = $('externalProvider').value;
    const sources = state.providers.filter(p => p.enabled !== false && p.assetTypes?.includes('model') && (!selected || p.id === selected) && (!config.downloadable || p.supportsDownload) && (!config.free || p.pricing !== 'paid'));
    await pager.reset(config, sources);
    if (token === state.requestToken) { renderDetail(); renderCompare(); ensureDetail(state.activeId); }
  }

  function renderSources() {
    const rows = pager.state.sources;
    const labels = { waiting: 'waiting', loading: 'searching…', ok: 'searched', error: 'retry available', timeout: 'timed out · retry available', skipped: 'not searched', link: 'open source search' };
    const failures = rows.filter(s => ['error','timeout'].includes(s.status)).length;
    $('externalSourceReport').innerHTML = rows.length ? `<summary>Sources · ${rows.filter(s => !['waiting','loading'].includes(s.status)).length}/${rows.length} checked${failures ? ` · ${failures} need retry` : ''}</summary><p>Total matching results across all sources is unknown. Counts below are source claims and may include other types or unfiltered entries.</p><ul>${rows.map(s => {
      const link = safeURL(s.searchUrl);
      return `<li><b>${escapeHTML(s.name || s.id)}</b> · ${escapeHTML(labels[s.status] || s.status)}${Number.isFinite(s.total) ? ` · source reports ${formatNumber(s.total)}` : ''}${s.error ? ` · ${escapeHTML(s.error)}` : ''}${s.bound || s.note ? ` · ${escapeHTML(s.bound || s.note)}` : ''}${link ? ` · <a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">Search on source ↗</a>` : ''}</li>`;
    }).join('')}</ul>` : '';
  }

  function renderResults() {
    const visible = state.results.slice(0, pager.state.visible);
    $('externalResults').innerHTML = visible.length ? visible.map(renderCard).join('') : `<div class="external-empty"><span class="empty-eyebrow">EXTERNAL DISCOVERY</span><h2>${state.loading ? 'Searching sources…' : state.lastQuery ? 'No candidates in the fetched batches' : 'Search beyond the Registry'}</h2><p>Try short, concrete terms such as “pine tree” or “market stall”. English terms usually match the source catalogues best.</p><div><button type="button" data-external-preset="pine tree">pine tree</button><button type="button" data-external-preset="market stall">market stall</button><button type="button" data-external-preset="stylized rock">stylized rock</button></div></div>`;
    $('externalResultMeta').textContent = state.lastQuery ? `${visible.length} shown · ${state.results.length} unique candidates loaded${state.loading ? ' · searching…' : ''} · “${state.lastQuery}”` : 'Ready · Registry remains canonical';
    const more = $('externalLoadMore');
    more.hidden = !state.lastQuery || (!pager.canFetch() && pager.state.visible >= state.results.length);
    more.disabled = state.loading;
    more.textContent = state.loading ? 'Loading sources…' : pager.state.visible < state.results.length ? 'Show more results' : 'Search deeper / retry sources';
    $('externalPagingNote').textContent = state.lastQuery ? 'No reliable global total. Duplicate assets are counted once. Open Sources for search limits, failures and source links.' : '';
    $('externalResults').setAttribute('aria-busy', String(state.loading));
    renderSources();
  }

  function renderCard(asset) {
    const selected = state.compare.has(asset.id);
    const thumb = asset.thumbnailUrl
      ? `<img src="${escapeHTML(asset.thumbnailUrl)}" alt="" loading="lazy">`
      : '<span aria-hidden="true">◈</span>';
    return `<article class="external-card ${state.activeId === asset.id ? 'active' : ''}" data-external-open="${escapeHTML(asset.id)}" tabindex="0">
      <div class="external-thumb">${thumb}<span>${escapeHTML(asset.provider || 'source')}</span></div>
      <div class="external-card-copy">
        <p>${escapeHTML(asset.provider || 'Provider')} · ${escapeHTML(priceLabel(asset))}</p>
        <h3>${escapeHTML(asset.title || asset.id)}</h3>
        <small>${escapeHTML(asset.author || 'Creator not reported')}</small>
        <div class="external-pills"><i>${escapeHTML(licenseLabel(asset))}</i><i>${escapeHTML(accessLabel(asset))}</i>${asset.formats.slice(0, 2).map((value) => `<i>${escapeHTML(value.toUpperCase())}</i>`).join('')}</div>
      </div>
      <button class="external-compare-toggle ${selected ? 'selected' : ''}" type="button" data-external-compare="${escapeHTML(asset.id)}" aria-pressed="${selected}">${selected ? '✓ Compare' : '+ Compare'}</button>
    </article>`;
  }

  function activeAsset() {
    return state.details.get(state.activeId) || state.results.find((row) => row.id === state.activeId) || null;
  }

  function facts(asset) {
    return [
      ['License claim', licenseLabel(asset)], ['Price', priceLabel(asset)], ['Access', accessLabel(asset)],
      ['Formats', asset.formats.join(', ') || '—'], ['Resolutions', asset.resolutions.join(', ') || '—'],
      ['Polycount', formatNumber(asset.polyCount)], ['Rigged', claim(asset.rigged)], ['Animated', claim(asset.animated)],
    ];
  }

  function renderDetail() {
    const target = $('externalDetail');
    const asset = activeAsset();
    if (!asset) {
      target.innerHTML = '<div class="external-detail-empty"><b>Inspect a candidate</b><p>Source facts appear here. Nothing is added to the Registry automatically.</p></div>';
      return;
    }
    const source = safeURL(asset.sourcePage || asset.url);
    const previewable = (asset.files || []).find((file) => ['glb', 'gltf'].includes(String(file.format || '').toLowerCase()));
    target.innerHTML = `<div class="external-detail-head">
      <p>${escapeHTML(asset.provider || 'External provider')} · ${escapeHTML(CANDIDATE_STATUS)}</p>
      <h2>${escapeHTML(asset.title || asset.id)}</h2>
      <small>${escapeHTML(asset.author || 'Creator not reported')}</small>
    </div>
    <div class="external-preview" id="externalPreview">${asset.thumbnailUrl ? `<img src="${escapeHTML(asset.thumbnailUrl)}" alt="Preview of ${escapeHTML(asset.title || 'external asset')}">` : '<span>◈</span>'}</div>
    <div class="external-detail-actions">
      ${source ? `<a class="primary" href="${escapeHTML(source)}" target="_blank" rel="noopener noreferrer">Inspect source ↗</a>` : '<button class="primary" disabled>Source unavailable</button>'}
      <button class="secondary" type="button" data-external-add-intake>Add to Intake</button>
      ${previewable ? '<button class="secondary" type="button" data-external-preview>Load 3D preview</button>' : ''}
    </div>
    <div class="external-fact-grid">${facts(asset).map(([key, value]) => `<div><span>${escapeHTML(key)}</span><b>${escapeHTML(value)}</b></div>`).join('')}</div>
    <label class="external-field"><span>Measured height <small>optional · trusted 3D check</small></span><input id="externalMeasuredHeight" inputmode="decimal" type="number" min="0" step="any" placeholder="e.g. 3.4"></label>
    <label class="external-field"><span>Scale hint <small>optional</small></span><input id="externalScaleHint" type="text" placeholder="e.g. tall background pine"></label>
    <p class="external-boundary-note">Provider metadata only. KFB compatibility, scale, quality and suitability are not verified here.</p>
    <details><summary>Provider detail</summary><dl>${[['External ID', asset.id], ['Native ID', asset.nativeId], ['Tags', asset.tags.join(', ') || '—'], ['Reported file', previewable ? `${previewable.filename || previewable.format} · ${formatBytes(previewable.sizeBytes)}` : '—']].map(([key, value]) => `<dt>${escapeHTML(key)}</dt><dd>${escapeHTML(value)}</dd>`).join('')}</dl></details>`;
  }

  function renderCompare() {
    const rows = [...state.compare].map((id) => state.details.get(id) || state.results.find((row) => row.id === id)).filter(Boolean);
    $('externalCompareCount').textContent = `${rows.length}/4`;
    const target = $('externalCompare');
    if (!rows.length) {
      target.innerHTML = '<p>Select up to four candidates to compare provider claims side by side.</p>';
      return;
    }
    target.innerHTML = `<div class="external-compare-grid">${rows.map((asset) => `<section><button type="button" data-external-compare="${escapeHTML(asset.id)}" aria-label="Remove ${escapeHTML(asset.title || asset.id)}">×</button><b>${escapeHTML(asset.title || asset.id)}</b><small>${escapeHTML(asset.provider || 'Provider')}</small>${facts(asset).map(([key, value]) => `<p><span>${escapeHTML(key)}</span>${escapeHTML(value)}</p>`).join('')}</section>`).join('')}</div>`;
  }

  function renderQueue() {
    const target = $('externalIntakeQueue');
    $('externalIntakeCount').textContent = state.intake.length;
    target.innerHTML = state.intake.length ? state.intake.map((item) => `<div class="external-intake-row"><div><b>${escapeHTML(item.source.title)}</b><small>${escapeHTML(item.source.provider)} · metadata only</small></div><button type="button" data-external-copy-intake="${escapeHTML(item.source.externalId)}">Copy</button><button type="button" data-external-download-intake="${escapeHTML(item.source.externalId)}">JSON</button><button type="button" data-external-remove-intake="${escapeHTML(item.source.externalId)}" aria-label="Remove">×</button></div>`).join('') : '<p class="external-queue-empty">No prepared intake candidates yet.</p>';
  }

  function render() {
    renderResults(); renderDetail(); renderCompare(); renderQueue(); updateBadge();
  }

  async function ensureDetail(id) {
    if (!id || state.details.has(id)) return;
    const token = state.requestToken;
    try {
      const payload = normalize(await api(`/v1/assets/${encodeURIComponent(id)}`));
      if (token !== state.requestToken) return;
      state.details.set(id, payload);
      if (state.activeId === id) renderDetail();
      if (state.compare.has(id)) renderCompare();
    } catch (error) {
      if (token === state.requestToken) showError(`Candidate detail unavailable: ${error.message}`);
    }
  }

  function toggleCompare(id) {
    if (state.compare.has(id)) state.compare.delete(id);
    else if (state.compare.size >= 4) return toast('Compare holds up to 4 candidates');
    else state.compare.add(id);
    ensureDetail(id);
    renderResults(); renderCompare();
  }

  async function addToIntake() {
    const id = state.activeId;
    if (!id) return;
    const measured = Number($('externalMeasuredHeight')?.value || 0) || null;
    const scaleHint = $('externalScaleHint')?.value.trim() || null;
    await ensureDetail(id);
    const asset = state.details.get(id) || activeAsset();
    const requestedFile = (asset.files || []).find((file) => ['glb', 'gltf'].includes(String(file.format || '').toLowerCase())) || (asset.files || [])[0] || null;
    const packet = {
      schema: 'kfb.external-asset-intake/1', status: CANDIDATE_STATUS, preparedAt: new Date().toISOString(),
      source: { externalId: asset.id, provider: asset.provider, nativeId: asset.nativeId, title: asset.title, author: asset.author || null, pageUrl: asset.sourcePage || asset.url },
      providerClaims: { license: asset.license || null, price: asset.price || null, downloadable: Boolean(asset.downloadable), formats: asset.formats, resolutions: asset.resolutions, polyCount: asset.polyCount ?? null, rigged: asset.rigged ?? null, animated: asset.animated ?? null },
      requestedFile: requestedFile ? { url: requestedFile.url, filename: requestedFile.filename, format: requestedFile.format, group: requestedFile.group || null, sizeBytes: requestedFile.sizeBytes ?? null } : null,
      k2Measurement: { measuredHeight: measured, scaleHint }, notes: null,
      nextGate: 'trusted-download-hash-source-isolation-3d-proof-registry-build',
      boundaries: { bytesDownloaded: false, registered: false, compatibilityVerified: false, licenseStatus: 'provider-claim-only' },
    };
    const index = state.intake.findIndex((row) => row.source.externalId === id);
    if (index >= 0) state.intake[index] = packet; else state.intake.unshift(packet);
    persistIntake(); renderQueue(); toast('Intake metadata prepared');
  }

  function copyPacket(id) {
    const packet = state.intake.find((row) => row.source.externalId === id);
    if (!packet) return;
    navigator.clipboard.writeText(JSON.stringify(packet, null, 2)); toast('Intake JSON copied');
  }

  function downloadPacket(id) {
    const packet = state.intake.find((row) => row.source.externalId === id);
    if (!packet) return;
    const blob = new Blob([JSON.stringify(packet, null, 2) + '\n'], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = `${String(packet.source.provider || 'external')}-${String(packet.source.nativeId || 'candidate').replace(/[^a-z0-9._-]+/gi, '-')}-intake.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function loadPreview() {
    const asset = activeAsset();
    const file = (asset?.files || []).find((row) => ['glb', 'gltf'].includes(String(row.format || '').toLowerCase()));
    if (!file?.url) return;
    const target = $('externalPreview');
    target.innerHTML = '';
    const viewer = document.createElement('model-viewer');
    viewer.src = file.url; viewer.alt = `3D preview of ${asset.title || 'external asset'}`;
    viewer.setAttribute('camera-controls', ''); viewer.setAttribute('auto-rotate', ''); viewer.setAttribute('shadow-intensity', '1'); viewer.setAttribute('environment-image', 'neutral');
    target.append(viewer);
  }

  function handleClick(event) {
    const preset = event.target.closest('[data-external-preset]');
    if (preset) { $('externalSearchInput').value = preset.dataset.externalPreset; return search(); }
    const compare = event.target.closest('[data-external-compare]');
    if (compare) { event.stopPropagation(); return toggleCompare(compare.dataset.externalCompare); }
    const card = event.target.closest('[data-external-open]');
    if (card) {
      state.activeId = card.dataset.externalOpen; renderResults(); renderDetail();
      if (window.innerWidth <= 850) window.setTimeout(() => $('externalDetail').scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
      return ensureDetail(state.activeId);
    }
    if (event.target.closest('[data-external-add-intake]')) return addToIntake();
    if (event.target.closest('[data-external-preview]')) return loadPreview();
    const copy = event.target.closest('[data-external-copy-intake]'); if (copy) return copyPacket(copy.dataset.externalCopyIntake);
    const download = event.target.closest('[data-external-download-intake]'); if (download) return downloadPacket(download.dataset.externalDownloadIntake);
    const remove = event.target.closest('[data-external-remove-intake]');
    if (remove) { state.intake = state.intake.filter((row) => row.source.externalId !== remove.dataset.externalRemoveIntake); persistIntake(); renderQueue(); }
  }

  function bind() {
    $('externalLoadMore').addEventListener('click', () => pager.more());
    for (const id of ['externalProvider', 'externalFreeOnly', 'externalDownloadableOnly']) $(id).addEventListener('change', () => { if ($('externalSearchInput').value.trim()) search(); });
    $('externalSearchForm').addEventListener('submit', (event) => { event.preventDefault(); search(); });
    $('externalBrowser').addEventListener('click', handleClick);
    $('externalBrowser').addEventListener('keydown', (event) => {
      if (event.target.closest('button, a, input, select')) return;
      const card = event.target.closest('[data-external-open]');
      if (card && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); state.activeId = card.dataset.externalOpen; render(); if (window.innerWidth <= 850) window.setTimeout(() => $('externalDetail').scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); ensureDetail(state.activeId); }
    });
    render();
  }

  function activate() { loadProviders(); render(); }
  function openQueue() { $('externalIntakePanel').open = true; $('externalIntakePanel').scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  return { bind, activate, render, updateBadge, openQueue, getIntake: () => [...state.intake], search };
}
