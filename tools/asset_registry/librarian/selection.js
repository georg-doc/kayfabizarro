import { $, state, persistSelection } from './state.js';
import { ensureCatalog, ensureRigFacts } from './registry.js';

export function toggleSelected(assetId, force = !state.selected.has(assetId)) {
  if (force) state.selected.add(assetId); else state.selected.delete(assetId);
  persistSelection();
  updateSelectionUI();
  document.querySelectorAll('.result-card').forEach((card) => {
    if (card.dataset.assetId === assetId) card.querySelector('.result-select').checked = state.selected.has(assetId);
  });
  if (state.active === assetId && $('toggleSelection')) $('toggleSelection').textContent = state.selected.has(assetId) ? 'Remove' : 'Add';
}

export function updateSelectionUI() {
  const count = state.selected.size;
  $('selectionCount').textContent = `${count} selected`;
  $('selectionDrawerCount').textContent = `${count} selected`;
  $('clearSelection').disabled = count === 0;
  $('copyHandoff').disabled = count === 0;
  $('downloadHandoff').disabled = count === 0;
  renderTray();
}

export function renderTray() {
  const target = $('trayItems');
  if (!target) return;
  target.replaceChildren();
  if (!state.selected.size) {
    const note = document.createElement('span');
    note.className = 'small-note';
    note.textContent = 'No assets selected.';
    target.append(note);
    return;
  }
  for (const id of [...state.selected].sort()) {
    const record = state.catalogById?.get(id);
    const chip = document.createElement('div');
    chip.className = 'tray-chip';
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'open-selected';
    open.textContent = record?.name || id;
    open.title = id;
    open.onclick = () => document.dispatchEvent(new CustomEvent('kfb-open-asset', { detail: id }));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.title = 'Remove from selection';
    remove.onclick = () => toggleSelected(id, false);
    chip.append(open, remove);
    target.append(chip);
  }
}

export function renderConsumerBoundary() {
  const profile = state.profiles[$('consumerSelect').value];
  const target = $('consumerBoundary');
  target.replaceChildren();
  if (!profile) return;
  const strong = document.createElement('strong');
  strong.textContent = profile.ownerBoundary || 'Receiving consumer owns suitability.';
  target.append(strong);
  if (profile.requiredDownstreamValidation?.length) {
    const ul = document.createElement('ul');
    for (const text of profile.requiredDownstreamValidation) {
      const li = document.createElement('li');
      li.textContent = text;
      ul.append(li);
    }
    target.append(ul);
  }
}

export async function buildHandoff() {
  await ensureCatalog();
  const consumerId = $('consumerSelect').value;
  const profile = state.profiles[consumerId] || {};
  const assets = [...state.selected].map((id) => state.catalogById.get(id)).filter(Boolean);
  if (assets.some((record) => record.kind === 'model-3d')) await ensureRigFacts();
  const allowed = new Set(profile.allowedKinds || []);
  return {
    schema: 'kfb.asset-handoff.v1',
    sourceRepo: state.manifest.sourceRepo,
    sourceCommit: state.manifest.sourceCommit,
    consumer: { consumerId, ...profile },
    selectionStatus: 'candidate-only',
    suitabilityDecision: 'owned-by-receiving-consumer',
    assets: assets.map((record) => ({
      assetId: record.assetId, name: record.name, path: record.path, kind: record.kind, format: record.format,
      sizeBytes: record.sizeBytes, packId: record.packId, collectionPath: record.collectionPath,
      dependencyStatus: record.dependencyStatus, source: record.source, relations: record.relations,
      rigFacts: state.rigById?.get(record.assetId) || record.rigFacts || null,
      consumerKindAllowed: allowed.size ? allowed.has(record.kind) : true,
    })),
  };
}

export function downloadJSON(name, value) {
  const blob = new Blob([JSON.stringify(value, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
  if (!text) return;
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement('textarea');
  area.value = text; area.style.position = 'fixed'; area.style.opacity = '0'; document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
}
