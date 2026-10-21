// Existing ToolBox / Asset Library shared proposal service. No credentials, HTTP proxy or renderer.
import { createHash } from 'node:crypto';
export const REPOSITORY = 'georg-doc/kayfabizarro';
export const REGISTER = 'docs/kfb-decisions-register-2026-10-11';
export const ROOT = 'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/FIGURES_R1';
const copy = x => structuredClone(x);
const fail = (code, message) => { throw Object.assign(new Error(message), { code }); };
const canonical = x => Array.isArray(x) ? x.map(canonical) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])) : x;
const digest = x => createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
const unsafe = new Set(['__proto__', 'prototype', 'constructor']);
function validJSON(x, depth = 0) {
  if (depth > 16) fail('INVALID_INPUT', 'Value nesting is too deep');
  if (typeof x === 'number' && !Number.isFinite(x)) fail('INVALID_INPUT', 'Non-finite number');
  if (x === undefined || typeof x === 'function' || typeof x === 'bigint') fail('INVALID_INPUT', 'Not JSON');
  if (x && typeof x === 'object') for (const k of Object.keys(x)) { if (unsafe.has(k)) fail('INVALID_INPUT', 'Unsafe key'); validJSON(x[k], depth + 1); }
}
function parts(path) {
  if (typeof path !== 'string' || !/^\/[A-Za-z0-9_/-]+$/.test(path)) fail('INVALID_PATH', 'Invalid field path');
  const p = path.slice(1).split('/'); if (p.some(k => !k || unsafe.has(k))) fail('INVALID_PATH', 'Unsafe field path'); return p;
}
function at(doc, path) { return parts(path).reduce((o, k) => o?.[k], doc); }
function set(doc, path, value) { const p = parts(path), key = p.pop(); let o = doc; for (const k of p) { if (!o || typeof o[k] !== 'object' || o[k] === null) fail('INVALID_PATH', 'Field parent missing'); o = o[k]; } o[key] = value; }
const characterPath = /^\/(identity\/(name|displayName|aliases)|story\/background|personality\/traits\/[A-Za-z0-9_]+|cards\/(signatureDeck|secondaryDecks|performanceDecks)|memory\/relationships|appearance\/renderStyle\/default)$/;
const figurePath = /^\/(eyeRig\/(settings\/(anchor\/(dx|dy|ring|track)|pupilSize|pupilStyle|gloss|lidFit|inset|converge|splay|turn|baseColor)|pupil\/(style|size|gloss)|anchors\/(L|R|C)\/(pos|scale))|mouth\/(set|rest|tint)|brows\/values\/[A-Za-z0-9_]+)$/;
function validateFigureValue(path, v, doc, catalog) {
  if (path.startsWith('/brows/')) {
    if (doc.brows.owner !== 'browrig-v2') fail('PROTECTED_FIELD','Unsupported brow owner');
    const k=parts(path).at(-1), bool=['enabled','symmetric','solid','even'], numeric=['mask','thickness','length','taper','height','follow','lift','round','cap'];
    if(bool.includes(k)){if(typeof v!=='boolean')fail('INVALID_INPUT','Brow boolean required');return;}
    if(numeric.includes(k)){if(typeof v!=='number'||!Number.isFinite(v))fail('INVALID_INPUT','Brow number required');return;}
    if(k==='color'){if(typeof v!=='string'||!/^#[\da-f]{6}$/i.test(v))fail('INVALID_INPUT','Brow colour required');return;}
    fail('PROTECTED_FIELD','Unknown brow field');
  }
  if (/\/(pos)$/.test(path)) { if (!Array.isArray(v) || v.length !== 3 || !v.every(Number.isFinite)) fail('INVALID_INPUT', 'Eye position needs 3 finite coordinates'); return; }
  if (/\/(set)$/.test(path)) { if (!catalog.mouthSets?.includes(v)) fail('INVALID_INPUT', 'Unknown mouth set'); return; }
  if (/\/(rest)$/.test(path)) { const setId = doc.mouth.set; if (!catalog.mouthShapes?.[setId]?.includes(v)) fail('INVALID_INPUT', 'Unknown rest shape for mouth set'); return; }
  if (/\/(baseColor|tint)$/.test(path)) { if (!(path === '/mouth/tint' && v === null) && (typeof v !== 'string' || !/^#[\da-f]{6}$/i.test(v))) fail('INVALID_INPUT', 'Invalid colour'); return; }
  if (/\/(pupilStyle|style)$/.test(path)) { if (!['matte-cute', 'glossy-googly'].includes(v)) fail('INVALID_INPUT', 'Unknown pupil style'); return; }
  const old = at(doc, path);
  if (typeof old === 'number' && (typeof v !== 'number' || !Number.isFinite(v))) fail('INVALID_INPUT', 'Expected a finite numeric value');
  if (/\/(size|pupilSize|gloss|lidFit|inset|converge)$/.test(path) && (v < 0 || v > 1)) fail('INVALID_INPUT', 'Value out of range');
  if (/\/scale$/.test(path) && v <= 0) fail('INVALID_INPUT', 'Eye scale must be positive');
}
function relationshipTemplates(value, doc, catalog) {
  const allowed=new Set(['with','type','sharedTrauma','triggers','dynamicAxes','baselineHeat','note']);
  const prior=doc.memory.relationships.v||[], str=x=>typeof x==='string'&&x.length<=4096, strings=x=>Array.isArray(x)&&x.length<=64&&x.every(str);
  if(!Array.isArray(value)||value.length>64)fail('INVALID_INPUT','Relationship template array required');
  for(const r of value){
    if(!r||typeof r!=='object'||Array.isArray(r)||Object.keys(r).some(k=>!allowed.has(k))||!str(r.with)||!str(r.type))fail('INVALID_INPUT','Relationship template fields invalid');
    if(r.with!=='player'&&!catalog.characterIds?.includes(r.with)&&!prior.some(p=>p.with===r.with))fail('INVALID_INPUT','Unknown relationship target');
    for(const k of ['sharedTrauma','note'])if(k in r&&!str(r[k]))fail('INVALID_INPUT','Relationship text required');
    if('dynamicAxes'in r&&!strings(r.dynamicAxes))fail('INVALID_INPUT','Relationship axes must be text');
    if('baselineHeat'in r&&(typeof r.baselineHeat!=='number'||!Number.isFinite(r.baselineHeat)||r.baselineHeat<0||r.baselineHeat>1))fail('INVALID_INPUT','Heat outside 0..1');
    if('triggers'in r){
      if(Array.isArray(r.triggers)){if(!strings(r.triggers))fail('INVALID_INPUT','Trigger strings required');}
      else{const keys=new Set(['mutual','player_to_npc','npc_to_player',...prior.flatMap(p=>p.triggers&&!Array.isArray(p.triggers)?Object.keys(p.triggers):[])]);
        if(!r.triggers||typeof r.triggers!=='object'||Object.entries(r.triggers).some(([k,v])=>!keys.has(k)||!strings(v)))fail('INVALID_INPUT','Relationship trigger template invalid');}
    }
  }
}
function guardSchema(kind, doc, id) {
  if (doc.id !== id || doc.schema !== `kfb.${kind}/1`) fail('INVALID_DOCUMENT', 'Wrong schema or id');
  if (kind === 'figure' && (!doc.eyeRig || !doc.material || doc.material.sheenMax > .05)) fail('INVALID_DOCUMENT', 'Figure card is incomplete');
}
export function applyEdits(doc, request, { now, actorId, catalog = {} }) {
  guardSchema(request.kind, doc, request.id);
  const next = copy(doc), changed = [], before = [];
  const seen = new Set();
  for (const edit of request.edits) {
    if (!edit || Object.keys(edit).some(k => !['path', 'value'].includes(k))) fail('INVALID_INPUT', 'Unknown edit field');
    parts(edit.path); validJSON(edit.value);
    if (seen.has(edit.path)) fail('INVALID_INPUT', 'Duplicate field'); seen.add(edit.path);
    if (request.kind === 'character') {
      if (!characterPath.test(edit.path)) fail('PROTECTED_FIELD', 'Field is not editable here');
      const old = at(doc, edit.path);
      if (!old || !Object.hasOwn(old, 'v') || typeof old.status !== 'string') fail('INVALID_PATH', 'Expected an existing sourced leaf');
      if (old.v !== null && (Array.isArray(old.v) !== Array.isArray(edit.value) || typeof old.v !== typeof edit.value)) fail('INVALID_INPUT', 'Value type changed');
      if (/\/(name|displayName)$/.test(edit.path) && (typeof edit.value !== 'string' || !edit.value.trim() || edit.value.length > 128)) fail('INVALID_INPUT', 'Invalid name');
      if (edit.path.endsWith('/aliases') && (!Array.isArray(edit.value) || edit.value.length > 64 || !edit.value.every(v=>typeof v==='string' && v.length<=128))) fail('INVALID_INPUT', 'Invalid aliases');
      if (edit.path.startsWith('/cards/')) { const ids=Array.isArray(edit.value)?edit.value:[edit.value]; if(!catalog.deckIds || !ids.every(v=>catalog.deckIds.includes(v))) fail('INVALID_INPUT','Deck is not in current catalog'); }
      if (edit.path === '/memory/relationships') relationshipTemplates(edit.value,doc,catalog);
      if (edit.path === '/appearance/renderStyle/default') {
        const alternatives = doc.appearance.renderStyle.alternatives?.v || [];
        if (edit.value !== 'clay' && !alternatives.some(x => (typeof x === 'string' ? x : x.id) === edit.value)) fail('INVALID_INPUT', 'Render style is not an explicit alternative');
      }
      if (JSON.stringify(old.v) === JSON.stringify(edit.value)) continue;
      set(next, edit.path, { ...old, v: copy(edit.value), status: 'GEORG', src: `Georg via ${request.surface} · ${now} · proposal ${request.requestId}` });
      before.push({ path: edit.path, prior: copy(old) });
    } else {
      if (!figurePath.test(edit.path)) fail('PROTECTED_FIELD', 'Body/source/rig ownership is protected');
      if (at(doc, edit.path) === undefined) fail('INVALID_PATH', 'Field missing in current card');
      if (edit.path.startsWith('/brows/') && doc.brows.owner === 'planned') fail('PROTECTED_FIELD', 'Brows are not delivered');
      validateFigureValue(edit.path, edit.value, next, catalog);
      if (JSON.stringify(at(doc, edit.path)) === JSON.stringify(edit.value)) continue;
      before.push({ path: edit.path, prior: copy(at(doc, edit.path)) });
      set(next, edit.path, copy(edit.value));
    }
    changed.push(edit.path);
  }
  if (!changed.length) fail('NO_CHANGES', 'No edited values');
  // Proposed GEORG values are not blanket figure approval; unresolved conflicts/todos survive exactly.
  next.provenance = [...(next.provenance || []), { what: 'Georg change proposal', by: 'GEORG', date: now, requestId: request.requestId, surface: request.surface, changed, before }];
  return { document: next, changed };
}
function validateRequest(r, auth, now) {
  if (!auth?.signedIn || !auth?.isOwner || !auth?.actorId) fail('AUTH_REQUIRED', 'Signed-in owner required');
  if (!auth.explicitWriteConsent) fail('CONSENT_REQUIRED', 'Explicit write consent required');
  if (auth.method !== 'POST' || !auth.origin || auth.origin !== auth.expectedOrigin) fail('ORIGIN_DENIED', 'Same-origin POST required');
  if (!r || !['figure', 'character'].includes(r.kind) || !/^[a-z][a-z0-9_]{0,63}$/.test(r.id)) fail('INVALID_INPUT', 'Invalid document target');
  if(Object.keys(r).some(k=>!['kind','id','surface','requestId','baseBlob','bodySha256','recipeSha256','edits'].includes(k))) fail('INVALID_INPUT','Unknown request field');
  if (!['ToolBox-Studio', 'Asset Library'].includes(r.surface)) fail('INVALID_INPUT', 'Unknown surface');
  if (r.kind === 'figure' && r.surface !== 'ToolBox-Studio') fail('PROTECTED_FIELD', 'Appearance belongs in ToolBox-Studio');
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(r.requestId)) fail('INVALID_INPUT', 'Invalid request id');
  if(auth.requestId!==r.requestId || !/^\d{4}-\d\d-\d\d$/.test(auth.proposalDate||'')) fail('AUTH_REQUIRED','Server-issued request ticket required');
  if (!/^[a-f0-9]{40}$/.test(r.baseBlob)) fail('INVALID_INPUT', 'Exact source blob required');
  if (!Array.isArray(r.edits) || !r.edits.length || r.edits.length > 64 || JSON.stringify(r).length > 65536) fail('INVALID_INPUT', 'Invalid proposal size');
  if (!/^\d{4}-\d\d-\d\dT/.test(now) || Number.isNaN(Date.parse(now))) fail('INVALID_INPUT', 'Trusted server timestamp required');
}
// Adapter is server-owned and typed. No client-selected repository, ref, connector/action or credentials.
// createBranch MUST atomically refuse an existing ref. Never implement it with force/update-ref.
export async function saveProposal(adapter, request, auth, { now = new Date().toISOString(), catalog = {} } = {}) {
  validateRequest(request, auth, now);
  if(adapter.capabilities?.atomicCreateBranch!==true) fail('ADAPTER_NOT_READY','Atomic create-only branch adapter is required');
  const documentPath = `${ROOT}/${request.kind === 'figure' ? 'figures' : 'characters'}/${request.id}.${request.kind}.json`;
  const receiptPath = `${ROOT}/proposals/${request.requestId}.json`;
  const branch = `characters/edit-${request.id}-${auth.proposalDate}-${request.requestId.replaceAll('-', '').slice(0, 12)}`;
  const actorKey=digest(auth.actorId), fingerprint = digest({ ...request, actorKey });
  async function existing() {
    const ref = await adapter.readRef(REPOSITORY, branch);
    if (!ref) return null;
    const receipt = await adapter.readFile(REPOSITORY, ref.sha, receiptPath);
    if (!receipt || receipt.json.fingerprint !== fingerprint || receipt.json.actorKey !== actorKey) fail('IDEMPOTENCY_CONFLICT', 'Request id already belongs to a different proposal');
    const written = await adapter.readFile(REPOSITORY, ref.sha, documentPath);
    if (!written || digest(written.json) !== receipt.json.documentDigest) fail('VERIFY_FAILED', 'Existing proposal file does not match receipt');
    const commitInfo=await adapter.readCommit(REPOSITORY,ref.sha);
    const expected=[documentPath,receiptPath].sort();
    if(commitInfo.parentSha!==receipt.json.baseCommit || JSON.stringify([...commitInfo.changedPaths].sort())!==JSON.stringify(expected)) fail('VERIFY_FAILED','Unexpected parent or changed-file scope');
    // Build the confirmation from immutable provider reads, including the base.
    // A receipt and document altered together must not certify a different edit.
    const original = await adapter.readFile(REPOSITORY, receipt.json.baseCommit, documentPath);
    if (!original || original.sha !== request.baseBlob || receipt.json.baseBlob !== request.baseBlob) fail('VERIFY_FAILED', 'Proposal base does not match the requested source');
    const reconstructed = applyEdits(original.json, request, { now: receipt.json.date, actorId: auth.actorId, catalog });
    if (digest(reconstructed.document) !== digest(written.json) || JSON.stringify(reconstructed.changed) !== JSON.stringify(receipt.json.changed)) fail('VERIFY_FAILED', 'Readback differs from the requested edits');
    const diff = reconstructed.changed.map(path => ({ path, before: copy(at(original.json, path)), after: copy(at(written.json, path)) }));
    const github = `https://github.com/${REPOSITORY}`;
    return { status: 'success', branch, commit: ref.sha, path: documentPath, existing: true, changed: reconstructed.changed, diff,
      githubUrl: `${github}/tree/${branch}`, commitUrl: `${github}/commit/${ref.sha}`,
      diffUrl: `${github}/compare/${receipt.json.baseCommit}...${ref.sha}` };
  }
  const replay = await existing(); if (replay) return replay;
  const base = await adapter.readRef(REPOSITORY, REGISTER);
  if (!base) fail('SOURCE_MISSING', 'Register ref missing');
  const current = await adapter.readFile(REPOSITORY, base.sha, documentPath);
  if (!current || current.sha !== request.baseBlob) fail('STALE_CARD', 'Card changed; reload and compare before saving');
  if (request.kind === 'figure' && (!request.bodySha256 || current.json.body.glb.sha256 !== request.bodySha256)) fail('STALE_BODY', 'Figure body changed');
  if(request.kind==='figure' && current.json.body.recipe?.sha256 && request.recipeSha256!==current.json.body.recipe.sha256) fail('STALE_RECIPE','Figure recipe changed');
  const edited = applyEdits(current.json, request, { now, actorId: auth.actorId, catalog });
  const receipt = { schema: 'kfb.character-change-proposal/1', requestId: request.requestId, fingerprint, actorKey, status: 'PROPOSAL', baseRef: REGISTER, baseCommit: base.sha, baseBlob: current.sha, documentDigest: digest(edited.document), changed: edited.changed, date: now };
  const tree = await adapter.createTree(REPOSITORY, base.sha, [
    { path: documentPath, content: JSON.stringify(edited.document, null, 2) + '\n' },
    { path: receiptPath, content: JSON.stringify(receipt, null, 2) + '\n' }
  ]);
  const commit = await adapter.createCommit(REPOSITORY, base.sha, tree.sha, `Georg proposal: ${request.id} (${request.kind})`);
  // An owner may publish a fixed body while a proposal is being prepared: recheck the exact card before exposing the branch.
  const latest = await adapter.readRef(REPOSITORY, REGISTER);
  const latestCard = await adapter.readFile(REPOSITORY, latest.sha, documentPath);
  if (!latestCard || latestCard.sha !== request.baseBlob) fail('STALE_CARD', 'Card changed during save; no proposal branch created');
  try { await adapter.createBranch(REPOSITORY, branch, commit.sha); }
  catch (error) { const recovered = await existing(); if (recovered) return recovered; fail('WRITE_UNKNOWN', 'Branch outcome unknown; inspect this request before retrying'); }
  const verified = await existing(); if (!verified || verified.commit !== commit.sha) fail('VERIFY_FAILED', 'Branch/file readback failed');
  return { ...verified, existing: false };
}
