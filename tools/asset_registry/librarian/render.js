import { $, state, badge, formatBytes, showError } from './state.js';
import { ensureCatalog, ensureRigFacts, ensureProblems } from './registry.js';
import { renderPreview } from './preview.js';
import { toggleSelected } from './selection.js';
import { attach3DThumbnail } from './thumb3d.js';

const depBadge = (record) => {
  const status = record.dependencyStatus;
  if (!status || !['missing', 'unresolved'].includes(status)) return null;
  return badge(status, 'warn');
};
const rigBadge = (record) => record.rigFacts?.hasSkin ? badge(`rig ${record.rigFacts.jointCount || 0}j`, 'ok') : null;
const animationBadge = (record) => (record.rigFacts?.animationCount || 0) > 0 ? badge(`${record.rigFacts.animationCount} clips`, 'ok') : null;
const reviewBadge = (record) => {
  const count = (state.problemsByAsset.get(record.assetId) || []).length;
  return count ? badge(`${count} review`, 'problem') : null;
};

function setDrawer(open) {
  $('selectionTray').classList.remove('open');
  $('selectionTray').setAttribute('aria-hidden', 'true');
  $('selectionButton').setAttribute('aria-expanded', 'false');
  $('detailPanel').classList.toggle('open', open);
  $('detailPanel').setAttribute('aria-hidden', open ? 'false' : 'true');
  $('drawerBackdrop').hidden = !open;
}

export function closeDetail() { setDrawer(false); }

export function setResultView(mode) {
  state.viewMode = mode === 'list' ? 'list' : 'gallery';
  localStorage.setItem('kfb.asset-librarian.v1.2.view', state.viewMode);
  $('resultList').classList.toggle('gallery-view', state.viewMode === 'gallery');
  $('resultList').classList.toggle('list-view', state.viewMode === 'list');
  $('listViewButton').classList.toggle('active', state.viewMode === 'list');
  $('galleryViewButton').classList.toggle('active', state.viewMode === 'gallery');
  renderResults(state.lastResults);
}

function thumb(record, target) {
  target.replaceChildren();
  if (record.kind === 'image-2d') {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = '';
    img.src = record.source?.rawPinned || record.source?.rawLatest || '';
    target.append(img);
    return;
  }
  if (state.viewMode === 'gallery' && attach3DThumbnail(record, target)) return;
  const span = document.createElement('span');
  span.className = 'thumb-label';
  span.textContent = record.kind === 'model-3d' ? '3D' : record.kind === 'audio' ? 'AUDIO' : String(record.format || 'FILE').toUpperCase();
  target.append(span);
}

export function renderResults(records) {
  const list = $('resultList');
  const template = $('resultTemplate');
  list.replaceChildren();
  for (const record of records) {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.result-card');
    const checkbox = fragment.querySelector('.result-select');
    const badges = fragment.querySelector('.result-badges');
    card.dataset.assetId = record.assetId;
    fragment.querySelector('.result-title').textContent = record.name;
    fragment.querySelector('.result-subtitle').textContent = record.packId || record.collectionPath || 'unpacked';
    fragment.querySelector('.result-path').textContent = record.path;
    fragment.querySelector('.result-meta-line').textContent = `${record.collectionPath || '—'} · ${formatBytes(record.sizeBytes)}`;
    thumb(record, fragment.querySelector('.result-thumb'));
    badges.append(badge(record.format));
    for (const node of [rigBadge(record), animationBadge(record), depBadge(record), reviewBadge(record)]) if (node) badges.append(node);
    checkbox.checked = state.selected.has(record.assetId);
    checkbox.onchange = () => toggleSelected(record.assetId, checkbox.checked);
    fragment.querySelector('.result-open').onclick = () => showDetail(record.assetId).catch(showError);
    if (state.active === record.assetId) card.classList.add('active');
    list.append(fragment);
  }
}

const fact = (value, label) => {
  const div = document.createElement('div');
  div.className = 'fact';
  const strong = document.createElement('b');
  strong.textContent = value == null || value === '' ? '—' : String(value);
  const span = document.createElement('span');
  span.textContent = label;
  div.append(strong, span);
  return div;
};

function renderDependencies(record) {
  const box = $('dependencyFacts');
  const deps = record.relations?.dependencies || [];
  if (!deps.length) {
    box.textContent = record.dependencyStatus ? `No explicit rows · ${record.dependencyStatus}` : 'No explicit dependency facts.';
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'dependency-list';
  for (const dep of deps) {
    const li = document.createElement('li');
    li.className = 'dependency-row';
    li.textContent = `${dep.role || 'dependency'} · ${dep.status || (dep.exists ? 'complete' : 'unknown')} · ${dep.path || dep.resolvedPath || dep.uri || 'unknown'}`;
    const target = dep.path || dep.resolvedPath;
    if (target && state.catalogById?.has(target)) {
      const button = document.createElement('button');
      button.textContent = 'Inspect';
      button.className = 'quiet small-button';
      button.onclick = () => showDetail(target).catch(showError);
      li.append(button);
    }
    ul.append(li);
  }
  box.replaceChildren(ul);
}

function renderRig(record) {
  const rig = record.rigFacts;
  const box = $('rigFacts');
  const warning = $('rigWarnings');
  warning.hidden = true;
  if (!rig) { box.textContent = 'Rig facts not loaded.'; return; }
  box.replaceChildren(
    fact(rig.parseStatus, 'parse status'),
    fact(rig.hasSkin, 'has skin'),
    fact(rig.jointCount || 0, 'joints'),
    fact(rig.animationCount || 0, 'animations'),
    fact((rig.animationClips || []).map((clip) => clip.name).filter(Boolean).join(', ') || 'none', 'clips'),
    fact((rig.skeletonSignatures || []).join(', ') || 'none', 'skeleton signature'),
  );
  if (rig.hasSkin || rig.skeletonSignatures?.length) {
    warning.hidden = false;
    warning.textContent = 'Skeleton signature is structural evidence only; not a retarget/gameplay compatibility guarantee.';
  }
}

function renderProblems(record) {
  const rows = state.problemsByAsset.get(record.assetId) || [];
  const box = $('problemFacts');
  if (!rows.length) { box.textContent = 'No current review item mapped to this asset.'; return; }
  const ul = document.createElement('ul');
  for (const problem of rows) {
    const li = document.createElement('li');
    li.className = 'problem-row';
    li.textContent = [problem.type, problem.target, problem.detail].filter(Boolean).join(' · ');
    ul.append(li);
  }
  box.replaceChildren(ul);
}

export async function showDetail(id) {
  await ensureCatalog();
  const record = state.catalogById.get(id);
  if (!record) throw new Error(`Unknown asset: ${id}`);
  setDrawer(true);
  $('emptyDetail').hidden = true;
  $('detailContent').hidden = false;
  state.active = id;

  $('detailKind').textContent = `${record.kind} · ${record.format}`;
  $('detailName').textContent = record.name;
  $('detailPath').textContent = record.path;
  $('detailBadges').replaceChildren();
  if (record.packId) $('detailBadges').append(badge(record.packId));
  if (record.collectionPath) $('detailBadges').append(badge(record.collectionPath));
  const dep = depBadge(record); if (dep) $('detailBadges').append(dep);

  $('openRaw').href = record.source?.rawPinned || '#';
  $('openLatestRaw').href = record.source?.rawLatest || '#';
  $('copyRaw').onclick = () => navigator.clipboard?.writeText(record.source?.rawPinned || '');
  $('copyPath').onclick = () => navigator.clipboard?.writeText(record.path);
  $('copyAssetId').onclick = () => navigator.clipboard?.writeText(record.assetId);
  $('toggleSelection').textContent = state.selected.has(id) ? 'Remove' : 'Add';
  $('toggleSelection').onclick = () => toggleSelected(id);

  $('identityFacts').replaceChildren(
    fact(record.assetId, 'asset ID'),
    fact(record.kind, 'kind'),
    fact(record.format, 'format'),
    fact(formatBytes(record.sizeBytes), 'size'),
    fact(record.packId || 'unknown', 'pack'),
    fact(record.collectionPath || '—', 'collection'),
  );

  await renderPreview(record);
  if (record.kind === 'model-3d') {
    await ensureRigFacts();
    record.rigFacts = state.rigById.get(id) || record.rigFacts;
  }
  await ensureProblems();
  const rig = rigBadge(record); if (rig) $('detailBadges').append(rig);
  const anim = animationBadge(record); if (anim) $('detailBadges').append(anim);
  const review = reviewBadge(record); if (review) $('detailBadges').append(review);
  renderRig(record);
  renderDependencies(record);
  renderProblems(record);
  const source = record.source || {};
  $('provenanceFacts').replaceChildren(
    fact(source.repo || state.manifest?.sourceRepo, 'source repo'),
    fact(source.commit || state.manifest?.sourceCommit, 'source commit'),
    fact(source.blobSha || 'unknown', 'blob SHA'),
    fact(record.license || record.sourceLicense || 'unknown', 'license/source metadata'),
  );
  renderResults(state.lastResults);
}
