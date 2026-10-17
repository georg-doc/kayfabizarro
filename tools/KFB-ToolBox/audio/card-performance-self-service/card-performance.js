import {
  CARD_PERFORMANCE_SCHEMA,
  DRAFT_SCHEMA,
  validateDeck,
  parsePerformanceText,
  normalizeBridges,
  validateFeed,
  createDraft,
  buildSegments,
  csvForDraft,
  lyricsForDraft
} from './card-performance-core.mjs?v=0.6.0';

const REPO = 'georg-doc/kayfabizarro';
const PREVIEW_REF = 'planning/kfb-chatterbox-voice-layer-v1-2026-10-08';
const FEED_PATH = 'skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_AUDIO_SITE_CARD_PERFORMANCE_FEED_R1_2026-10-12.json';
const DRAFT_KEY = 'kfb.audio-site.card-performance-draft/1';
const CACHE_PREFIX = 'kfb.audio-site.github-cache/1:';
const DB_NAME = 'kfb-card-performance-assets';
const DB_STORE = 'assets';
const $ = selector => document.querySelector(selector);
const esc = (value = '') => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

let bundle = null;
let draft = null;
let activeCard = null;
let voices = [];
let playbackToken = 0;
let activeAudio = null;
let activeObjectUrl = null;

const cacheKey = (ref, path) => CACHE_PREFIX + ref + ':' + path;
const apiUrl = (ref, path) => `https://api.github.com/repos/${REPO}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(ref)}`;
const decodeBase64 = value => new TextDecoder().decode(Uint8Array.from(atob(String(value).replace(/\s/g, '')), char => char.charCodeAt(0)));
const status = (message, kind = '') => {
  const node = $('#cardLoadStatus');
  node.textContent = message;
  node.className = 'card-load-status' + (kind ? ' ' + kind : '');
};

function readCache(ref, path) {
  try { return JSON.parse(localStorage.getItem(cacheKey(ref, path)) || 'null'); } catch { return null; }
}

function writeCache(ref, path, value) {
  try { localStorage.setItem(cacheKey(ref, path), JSON.stringify(value)); } catch { /* last-known-good remains best effort */ }
}

export async function fetchGithubFile(ref, path, expectedSha = null) {
  const cached = readCache(ref, path);
  if (expectedSha && cached?.sha === expectedSha && cached?.text) return { ...cached, cacheState: 'REVISION_CACHE' };
  const headers = { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' };
  if (cached?.etag) headers['if-none-match'] = cached.etag;
  let response;
  try {
    response = await fetch(apiUrl(ref, path), { cache: 'no-store', headers });
    if (response.status === 304 && cached?.text) return { ...cached, cacheState: 'ETAG_304' };
    if (!response.ok) throw new Error(`GitHub ${response.status} for ${path}`);
    const raw = await response.json();
    const entry = { path, ref, sha: raw.sha, etag: response.headers.get('etag'), text: decodeBase64(raw.content), fetchedAt: new Date().toISOString() };
    if (expectedSha && entry.sha !== expectedSha) throw new Error('Pinned source revision mismatch: ' + path);
    writeCache(ref, path, entry);
    return { ...entry, cacheState: 'NETWORK' };
  } catch (error) {
    if (cached?.text && (!expectedSha || cached.sha === expectedSha)) return { ...cached, cacheState: 'LAST_KNOWN_GOOD', warning: String(error.message || error) };
    throw error;
  }
}

const jsonFrom = (entry, label) => {
  try { return JSON.parse(entry.text); } catch (error) { throw new Error(`${label} JSON invalid: ${error.message}`); }
};

function validateTimedCues(value) {
  const profiles = Object.values(value?.profiles || {});
  if (profiles.some(profile => !Array.isArray(profile.cuesMs) || !profile.sha256 || !profile.cuesMs.length)) {
    throw new Error('Timed cues require a matching rendered clip SHA and nonempty cue list');
  }
  return value;
}

async function loadBundle() {
  status('Loading explicit PREVIEW content from Voice PR #379…');
  const feedEntry = await fetchGithubFile(PREVIEW_REF, FEED_PATH);
  const feed = validateFeed(jsonFrom(feedEntry, 'Card Performance feed'));
  const sourceRef = feed.sourceRef;
  const [deckEntry, performanceEntry, bridgesEntry, cuesEntry] = await Promise.all([
    fetchGithubFile(sourceRef, feed.source.deckPath, feed.source.deckRevision),
    fetchGithubFile(sourceRef, feed.source.performancePath, feed.source.performanceRevision),
    fetchGithubFile(sourceRef, feed.source.bridgesPath, feed.source.bridgesRevision),
    fetchGithubFile(sourceRef, feed.source.timedCuesPath, feed.source.timedCuesRevision)
  ]);
  const registryEntry=await fetchGithubFile(sourceRef,'media/kfb/index.json');
  const deckMeta=jsonFrom(registryEntry,'Deck registry').decks.find(d=>'media/kfb/'+d.data===feed.source.deckPath);
  if(!deckMeta)throw Error('Source deck absent from registry');
  const deck = validateDeck(jsonFrom(deckEntry, 'Source deck'),deckMeta);
  deck.deckId=deckMeta.packId;
  if(feed.performances.some(p=>p.selectedCardNumbers.some(n=>!deck.cards.some(c=>c.cardNumber===n))))throw Error('Selection outside actual source deck');
  const script = parsePerformanceText(performanceEntry.text,deck.cards.map(c=>c.cardNumber));
  const bridgesRaw = jsonFrom(bridgesEntry, 'Bridge sidecar');
  const bridges = normalizeBridges(bridgesRaw, feed.source.deckRevision,deck.deckId);
  const timedCues = validateTimedCues(jsonFrom(cuesEntry, 'Timed cue manifest'));
  bundle = { feed, feedEntry, deck, script, bridges, timedCues, entries: [feedEntry, deckEntry, performanceEntry, bridgesEntry, cuesEntry] };
  renderRevision();
  renderPresets();
  renderCardPicker();
  const saved = loadDraft();
  if (!saved) resetDraftFromSource();
  else {
    draft = saved;
    draft.cards = Object.fromEntries(deck.cards.map(card => [card.cardNumber, card]));
    activeCard = draft.selectedCardNumbers[0] || 1;
    renderDraft();
    status(`Reloaded ${feed.contentRevision} · local draft preserved · ${bundle.entries.map(entry => entry.cacheState).join(' / ')}`, 'ok');
  }
  return bundle;
}

function renderRevision() {
  const node = $('#cardContentRevision');
  const offline = bundle.entries.some(entry => entry.cacheState === 'LAST_KNOWN_GOOD');
  node.innerHTML = `<b>${esc(bundle.feed.status)} · ${esc(bundle.feed.contentRevision)}</b><span>content SHA ${esc(bundle.feedEntry.sha)} · source deck ${esc(bundle.feed.source.deckRevision.slice(0, 12))} · ${offline ? 'OFFLINE LAST-KNOWN-GOOD' : 'GitHub revision verified'}</span>`;
}

function renderPresets() {
  const select = $('#cardPerformancePreset');
  const current = select.value;
  select.innerHTML = bundle.feed.performances.map(item => `<option value="${esc(item.id)}">${esc(item.label || item.id)} · ${esc(item.status)}</option>`).join('');
  if (bundle.feed.performances.some(item => item.id === current)) select.value = current;
}

function renderCardPicker() {
  $('#cardSourcePicker').innerHTML = bundle.deck.cards.map(card => `<option value="${card.cardNumber}">${String(card.cardNumber).padStart(2, '0')} · ${esc(card.cardName)}</option>`).join('');
}

function loadDraft() {
  try {
    const value = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (!value || value.schema !== DRAFT_SCHEMA || value.deckId !== bundle.deck.deckId || !Array.isArray(value.selectedCardNumbers)) return null;
    return value;
  } catch { return null; }
}

function saveDraft() {
  if (!draft) return;
  const compact = { ...draft };
  delete compact.cards;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(compact));
}

function selectedPerformance() {
  return bundle.feed.performances.find(item => item.id === $('#cardPerformancePreset').value) || bundle.feed.performances[0];
}

function resetDraftFromSource() {
  const performance = selectedPerformance();
  draft = createDraft({ feed: bundle.feed, performance, deck: bundle.deck, script: bundle.script, bridges: bundle.bridges, contentSha: bundle.feedEntry.sha });
  activeCard = draft.selectedCardNumbers[0];
  saveDraft();
  renderDraft();
  status(`Loaded ${performance.id} from ${bundle.feed.contentRevision}. Draft is local and non-canon.`, 'ok');
}

function renderDraft() {
  if (!draft || !bundle) return;
  draft.cards = draft.cards || Object.fromEntries(bundle.deck.cards.map(card => [card.cardNumber, card]));
  const picker = $('#cardSourcePicker');
  [...picker.options].forEach(option => { option.selected = draft.selectedCardNumbers.includes(Number(option.value)); });
  $('#cardSelectionCount').textContent = `${draft.selectedCardNumbers.length} Card${draft.selectedCardNumbers.length === 1 ? '' : 's'} selected`;
  $('#cardSequence').innerHTML = draft.selectedCardNumbers.map((number, index) => `<div class="card-sequence-item ${number === activeCard ? 'active' : ''}" data-sequence-card="${number}"><button title="Edit Card ${number}"><b>${String(number).padStart(2, '0')}</b><span>${esc(draft.cards[number]?.cardName || 'Unknown')}</span></button><small>${esc((draft.lines[number] || '').slice(0, 72))}</small><div class="card-order-buttons"><button data-move="up" data-number="${number}" ${index === 0 ? 'disabled' : ''}>↑</button><button data-move="down" data-number="${number}" ${index === draft.selectedCardNumbers.length - 1 ? 'disabled' : ''}>↓</button></div></div>`).join('');
  $('[data-sequence-card]')?.scrollIntoView?.({ block: 'nearest' });
  document.querySelectorAll('[data-sequence-card]>button:first-child').forEach(button => button.onclick = () => { activeCard = Number(button.parentElement.dataset.sequenceCard); renderDraft(); });
  document.querySelectorAll('[data-move]').forEach(button => button.onclick = () => moveCard(Number(button.dataset.number), button.dataset.move));
  renderActiveCard();
  $('#cardSpeaker').value = draft.speaker?.id || 'lorekeeper';
  $('#cardStoryMode').value = draft.storyMode || 'comic';
  $('#cardDelivery').value = draft.delivery || 'measured';
  $('#cardBed').value = draft.bed || 'D';
  $('#cardRate').value = draft.rate || 0.92;
  $('#cardRateOut').textContent = Number(draft.rate || 0.92).toFixed(2) + '×';
  $('#cardPitch').value = draft.pitch || 0.86;
  $('#cardPitchOut').textContent = Number(draft.pitch || 0.86).toFixed(2);
  $('#cardIntro').value = draft.intro || '';
  $('#cardOutro').value = 'Stay Fluffy!';
  renderTimeline();
}

function renderActiveCard() {
  if (!activeCard || !draft.selectedCardNumbers.includes(activeCard)) activeCard = draft.selectedCardNumbers[0] || null;
  const card = activeCard ? draft.cards[activeCard] : null;
  const sentence = $('#cardSentence'), bridge = $('#cardBridge'), bridgeMeta = $('#cardBridgeMeta');
  if (!card) {
    $('#cardSourceDetail').innerHTML = '<span class="tiny">Select at least one validated source Card.</span>';
    sentence.value = bridge.value = '';
    sentence.disabled = bridge.disabled = true;
    bridgeMeta.textContent = '';
    return;
  }
  sentence.disabled = false;
  sentence.value = draft.lines[activeCard] || '';
  $('#cardSourceDetail').innerHTML = `<div class="eyebrow">SOURCE CARD · READ ONLY · ${String(activeCard).padStart(2, '0')}/${bundle.deck.cards.length}</div><h4>${esc(card.cardName)}</h4><dl><div><dt>POWER</dt><dd>${esc(card.power)}</dd></div><div><dt>LORE</dt><dd>${esc(card.lore)}</dd></div><div><dt>VISUAL</dt><dd>${esc(card.artworkPrompt || 'No source artwork prompt')}</dd></div></dl>`;
  const index = draft.selectedCardNumbers.indexOf(activeCard), previous = draft.selectedCardNumbers[index - 1];
  const edge = previous ? draft.bridgeDrafts[`${previous}>${activeCard}`] : null;
  bridge.disabled = !previous;
  bridge.value = edge?.text || '';
  bridgeMeta.textContent = previous ? `${edge?.editorialStatus || 'LOCAL_DRAFT_NO_EDGE'} · ${edge?.relation || 'NO_EDGE'} · ${edge?.provenance || 'NO_SOURCE_COMPATIBLE_EDGE'}` : 'First Card: no incoming Bridge.';
}

function moveCard(number, direction) {
  const index = draft.selectedCardNumbers.indexOf(number), target = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= draft.selectedCardNumbers.length) return;
  [draft.selectedCardNumbers[index], draft.selectedCardNumbers[target]] = [draft.selectedCardNumbers[target], draft.selectedCardNumbers[index]];
  rebuildBridgeDrafts(); saveDraft(); renderDraft();
}

function rebuildBridgeDrafts() {
  const old = draft.bridgeDrafts || {}, next = {};
  for (let index = 1; index < draft.selectedCardNumbers.length; index++) {
    const from = draft.selectedCardNumbers[index - 1], to = draft.selectedCardNumbers[index], key = `${from}>${to}`;
    const source = bundle.bridges.find(edge => edge.fromCardId === from && edge.toCardId === to);
    next[key] = old[key] || source || { id: null, fromCardId: from, toCardId: to, relation: 'NO_EDGE', text: '', cost: null, callback: null, sourceRefs: [{ deckId: draft.deckId, cardNumber: from, sourceRevision: draft.sourceRevision }, { deckId: draft.deckId, cardNumber: to, sourceRevision: draft.sourceRevision }], editorialStatus: 'LOCAL_DRAFT_NO_EDGE', provenance: 'NO_SOURCE_COMPATIBLE_EDGE' };
  }
  draft.bridgeDrafts = next;
}

function setCards(numbers) {
  const unique = [...new Set(numbers.map(Number).filter(number => number >= 1 && bundle.deck.cards.some(c=>c.cardNumber===number)))];
  draft.selectedCardNumbers = unique;
  for (const number of unique) if (!draft.lines[number]) draft.lines[number] = bundle.script.cardLines[number];
  rebuildBridgeDrafts(); activeCard = unique[0] || null; saveDraft(); renderDraft();
}

function renderTimeline(activeCueId = null) {
  if (!draft) return;
  let segments = [];
  try { segments = buildSegments(draft); } catch { /* invalid draft stays visible, not playable */ }
  $('#cardTimeline').innerHTML = segments.map(segment => `<div class="card-cue ${segment.kind} ${segment.cueId === activeCueId ? 'active' : ''}" data-cue="${esc(segment.cueId)}"><b>${esc(segment.cueId)}</b><span>${esc(segment.text)}</span></div>`).join('');
  if (activeCueId) document.querySelector(`[data-cue="${CSS.escape(activeCueId)}"]`)?.scrollIntoView?.({ block: 'nearest', inline: 'center' });
}

function populateVoices() {
  voices = window.speechSynthesis?.getVoices?.().filter(voice => /^en(?:-|_)/i.test(voice.lang)) || [];
  const current = $('#cardVoice').value;
  $('#cardVoice').innerHTML = '<option value="">Browser default English voice</option>' + voices.map(voice => `<option value="${esc(voice.voiceURI)}">${esc(voice.name)} · ${esc(voice.lang)}${voice.localService ? ' · local' : ''}</option>`).join('');
  if (voices.some(voice => voice.voiceURI === current)) $('#cardVoice').value = current;
}

async function ensureDbed() {
  await window.KFBAudioSite?.resume?.();
  window.KFBAudioSite?.musicContext?.setState?.('D', { source: 'card-performance-editor', reason: 'audition-over-conversation-bed' });
  const snapshot = window.KFBAudioSite?.adaptiveMusic?.getSnapshot?.();
  if (snapshot?.deckId !== 'D') await window.KFBAudioSite?.adaptiveMusic?.startDeck?.('D');
}

function setFocus(active, source = 'card-performance-editor') {
  window.KFBAudioSite?.musicContext?.setVoiceActive?.(active, { source });
  dispatchEvent(new CustomEvent('kfb:voice-focus', { detail: { active, source } }));
}

function stopPlayback(message = 'Stopped · voice focus released') {
  playbackToken += 1;
  window.speechSynthesis?.cancel?.();
  if (activeAudio) { activeAudio.pause(); activeAudio.currentTime = 0; activeAudio = null; }
  if (activeObjectUrl) { URL.revokeObjectURL(activeObjectUrl); activeObjectUrl = null; }
  setFocus(false, 'card-performance-stop');
  window.KFBAudioSite?.setAuditionDry?.(false);
  renderTimeline();
  $('#cardPlaybackStatus').textContent = message;
}

async function playBrowserPerformance(request) {
  const audition = request?.segments ? { ...draft, ...request } : draft;
  stopPlayback('Preparing browser performance…');
  const token = playbackToken;
  let segments;
  try { segments = request?.segments || buildSegments(draft); } catch (error) { $('#cardPlaybackStatus').textContent = error.message; return; }
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { $('#cardPlaybackStatus').textContent = 'Browser voice unavailable. Import an authorized clip for exact audio A/B.'; return; }
  if(audition.bed==='DRY')await window.KFBAudioSite?.setAuditionDry?.(true,()=>token===playbackToken);
  if (audition.bed === 'D') await ensureDbed().catch(error => { $('#cardPlaybackStatus').textContent = 'D bed unavailable · ' + error.message; });
  if(token!==playbackToken)return;
  const voice = voices.find(item => item.voiceURI === (audition.voiceURI || $('#cardVoice').value));
  let index = 0;
  const next = () => {
    if (token !== playbackToken) return;
    if (index >= segments.length) { stopPlayback('Complete · local draft remains non-canon'); return; }
    const segment = segments[index++];
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.lang = 'en-US'; utterance.rate = Number(audition.rate); utterance.pitch = Number(audition.pitch); if (voice) utterance.voice = voice;
    utterance.onstart = () => {
      if (token !== playbackToken) return;
      if (audition.bed === 'D') setFocus(true, 'card-performance-browser');
      renderTimeline(segment.cueId);
      $('#cardPlaybackStatus').textContent = `${segment.cueId} · ${audition.bed === 'D' ? 'D bed + Speech Focus' : 'DRY'} · Browser boundary events only when emitted`;
      dispatchEvent(new CustomEvent('kfb:card-performance-cue', { detail: { ...segment, deckId: audition.deckId, sourceRevision: audition.sourceRevision, contentRevision: audition.contentRevision, route: 'browser' } }));
    };
    utterance.onboundary = event => dispatchEvent(new CustomEvent('kfb:voice-beat', { detail: { cueId: segment.cueId, charIndex: event.charIndex, cardNumber: segment.cardNumber || null, sourceRevision: audition.sourceRevision, route: 'browser' } }));
    utterance.onend = () => { if (audition.bed === 'D') setFocus(false, 'card-performance-browser-gap'); setTimeout(next,Math.max(0,Math.min(5000,Number(segment.pauseAfterMs)||0))); };
    utterance.onerror = event => stopPlayback('Browser speech error · ' + event.error);
    window.speechSynthesis.speak(utterance);
  };
  next();
}

async function playExactAudio(source, withBed, label) {
  stopPlayback(`Preparing ${label}…`);
  const token = playbackToken;
  if(!withBed)await window.KFBAudioSite?.setAuditionDry?.(true,()=>token===playbackToken);
  if (withBed) await ensureDbed().catch(error => { $('#cardPlaybackStatus').textContent = 'D bed unavailable · ' + error.message; });
  if(token!==playbackToken)return;
  const audio = source instanceof Blob ? new Audio(activeObjectUrl = URL.createObjectURL(source)) : new Audio(source);
  activeAudio = audio;
  audio.preload = 'auto';
  audio.onplaying = () => {
    if (token !== playbackToken) return;
    if (withBed) setFocus(true, 'card-performance-exact-audio');
    $('#cardPlaybackStatus').textContent = `${label} · exact same audio source · ${withBed ? 'D bed + Speech Focus' : 'DRY'}`;
  };
  audio.onended = () => stopPlayback(`${label} complete · same-source A/B ready`);
  audio.onerror = () => stopPlayback(`${label} failed safely`);
  audio.play().catch(error => stopPlayback('Playback blocked · ' + error.message));
}

function downloadText(text, name, type) {
  const url = URL.createObjectURL(new Blob([text], { type })), anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportValue() {
  const value = { ...draft, cards: draft.selectedCardNumbers.map(number => draft.cards[number]), exportedAt: new Date().toISOString(), exportStatus: 'LOCAL_DRAFT_FOR_WEB_CHAT_GITHUB_REVIEW', canonicalPromotion: false };
  return value;
}

function applyImportedValue(value) {
  if (value?.schema === DRAFT_SCHEMA) {
    const allowed = ['draftStatus', 'sourceRepo', 'sourceRef', 'sourceRevision', 'contentRevision', 'fetchedContentSha', 'performanceId', 'performanceStatus', 'deckId', 'speaker', 'storyMode', 'seed', 'selectedCardNumbers', 'lines', 'bridgeDrafts', 'intro', 'bed', 'delivery', 'rate', 'pitch'];
    const imported = Object.fromEntries(allowed.filter(key => key in value).map(key => [key, value[key]]));
    if (imported.deckId !== bundle.deck.deckId || !Array.isArray(imported.selectedCardNumbers)) throw new Error('Imported draft does not match loaded source Deck');
    draft = { ...draft, ...imported, outro: 'Stay Fluffy!', cards: Object.fromEntries(bundle.deck.cards.map(card => [card.cardNumber, card])), draftStatus: 'LOCAL_EDITORIAL_DRAFT' };
    activeCard = draft.selectedCardNumbers[0]; rebuildBridgeDrafts(); saveDraft(); renderDraft(); return;
  }
  throw new Error('Only provenance-tagged Card Performance draft JSON can replace the structured draft');
}

function applyPastedText(text) {
  const trimmed = text.trim(); if (!trimmed) return;
  if (trimmed.startsWith('{')) return applyImportedValue(JSON.parse(trimmed));
  const lines = trimmed.split(/\r?\n/).map(line => line.trim()).filter(Boolean).filter(line => !/^\d\d:\d\d/.test(line) && !/^\d+$/.test(line) && !/^\d\d:\d\d:\d\d/.test(line));
  const useful = lines.filter(line => !/^\[(?:Spoken Word|End)\]$/i.test(line) && line !== 'Stay Fluffy!');
  draft.selectedCardNumbers.forEach((number, index) => { if (useful[index]) draft.lines[number] = useful[index].replace(/^"|"$/g, ''); });
  saveDraft(); renderDraft(); status(`Applied ${Math.min(useful.length, draft.selectedCardNumbers.length)} pasted lines to local draft only.`, 'ok');
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.objectStoreNames.contains(DB_STORE) || request.result.createObjectStore(DB_STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
}

async function putAsset(asset) {
  const db = await openDb();
  await new Promise((resolve, reject) => { const transaction = db.transaction(DB_STORE, 'readwrite'); transaction.objectStore(DB_STORE).put(asset); transaction.oncomplete = resolve; transaction.onerror = () => reject(transaction.error); });
  db.close();
}

async function listAssets() {
  const db = await openDb();
  const rows = await new Promise((resolve, reject) => { const request = db.transaction(DB_STORE).objectStore(DB_STORE).getAll(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
  db.close(); return rows;
}

async function ingestFiles(files) {
  for (const file of [...files]) {
    if (file.type.startsWith('audio/')) {
      const sha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', await file.arrayBuffer()))].map(byte => byte.toString(16).padStart(2, '0')).join('');
      const matchedProfile = Object.entries(bundle?.timedCues?.profiles||{}).find(([, profile]) => profile.sha256 === sha256)?.[0] || null;
      await putAsset({ id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, sha256, matchedCueProfile: matchedProfile, status: matchedProfile ? 'EXACT_R2_RENDITION_WITH_50_MATCHING_CUES' : 'LOCAL_AUTHORIZED_CLIP_TIMING_MUST_BE_CLIP_SPECIFIC', createdAt: new Date().toISOString(), blob: file });
      continue;
    }
    const text = await file.text();
    if (file.name.endsWith('.json')) applyImportedValue(JSON.parse(text)); else applyPastedText(text);
  }
  await renderAssets();
}

async function renderAssets() {
  const assets = await listAssets();
  $('#cardLocalAssets').innerHTML = assets.length ? assets.map(asset => `<div class="voice-clip"><div><b>${esc(asset.name)}</b><small>${esc(asset.status)} · ${asset.matchedCueProfile ? '50 exact rendition cues' : 'duration-derived cue timing on playback'}</small><code>sha256 ${esc(asset.sha256)}</code></div><div><button data-asset-dry="${asset.id}">Play dry</button><button data-asset-bed="${asset.id}">Play D</button></div></div>`).join('') : 'No local performance audio.';
  document.querySelectorAll('[data-asset-dry]').forEach(button => button.onclick = async () => { const item = assets.find(asset => asset.id === button.dataset.assetDry); if (item) playExactAudio(item.blob, false, item.name); });
  document.querySelectorAll('[data-asset-bed]').forEach(button => button.onclick = async () => { const item = assets.find(asset => asset.id === button.dataset.assetBed); if (item) playExactAudio(item.blob, true, item.name); });
}

function bind() {
  $('#cardReload').onclick = () => loadBundle().catch(error => status(`Reload failed safely · ${error.message} · previous validated draft/source retained`, 'fail'));
  $('#cardUseSource').onclick = resetDraftFromSource;
  $('#cardPerformancePreset').onchange = () => status('Preset selected. Choose “Reset draft from selected source” to replace the local draft.', '');
  $('#cardSourcePicker').onchange = event => setCards([...event.target.selectedOptions].map(option => Number(option.value)));
  document.querySelectorAll('[data-card-set]').forEach(button => button.onclick = () => {
    const map = { one: [1], three: [1, 2, 3], four: [1, 2, 3, 4], full: Array.from({ length: bundle.deck.cards.length }, (_, index) => index + 1) };
    setCards(map[button.dataset.cardSet]);
  });
  $('#cardSentence').oninput = event => { if (!activeCard) return; draft.lines[activeCard] = event.target.value; draft.draftStatus = 'LOCAL_EDITORIAL_DRAFT'; saveDraft(); renderTimeline(); };
  $('#cardBridge').oninput = event => { const index = draft.selectedCardNumbers.indexOf(activeCard), previous = draft.selectedCardNumbers[index - 1]; if (!previous) return; const key = `${previous}>${activeCard}`; draft.bridgeDrafts[key] = { ...draft.bridgeDrafts[key], text: event.target.value, editorialStatus: 'LOCAL_EDITORIAL_CANDIDATE', provenance: 'LOCAL_DRAFT_NOT_SOURCE_RULE' }; saveDraft(); $('#cardBridgeMeta').textContent = 'LOCAL_EDITORIAL_CANDIDATE · explicit local bridge · not canon'; renderTimeline(); };
  $('#cardSpeaker').onchange = event => { draft.speaker = { id: event.target.value, label: event.target.selectedOptions[0].textContent }; saveDraft(); };
  $('#cardStoryMode').onchange = event => { draft.storyMode = event.target.value; saveDraft(); };
  $('#cardDelivery').oninput = event => { draft.delivery = event.target.value; saveDraft(); };
  $('#cardBed').onchange = event => { draft.bed = event.target.value; saveDraft(); };
  $('#cardRate').oninput = event => { draft.rate = Number(event.target.value); $('#cardRateOut').textContent = draft.rate.toFixed(2) + '×'; saveDraft(); };
  $('#cardPitch').oninput = event => { draft.pitch = Number(event.target.value); $('#cardPitchOut').textContent = draft.pitch.toFixed(2); saveDraft(); };
  $('#cardIntro').oninput = event => { draft.intro = event.target.value; saveDraft(); renderTimeline(); };
  $('#cardPlay').onclick = playBrowserPerformance;
  $('#cardStop').onclick = () => stopPlayback();
  $('#cardExactDry').onclick = () => playExactAudio('./voice-assets/triplet-core-frame-01/demon-lord/whole.wav', false, 'Identity-matched control vocal');
  $('#cardExactBed').onclick = () => playExactAudio('./voice-assets/triplet-core-frame-01/demon-lord/whole.wav', true, 'Identity-matched control vocal');
  $('#cardApplyPaste').onclick = () => { try { applyPastedText($('#cardPaste').value); } catch (error) { status('Import rejected safely · ' + error.message, 'fail'); } };
  $('#cardExportJson').onclick = () => downloadText(JSON.stringify(exportValue(), null, 2), 'kfb-card-performance-draft.json', 'application/json');
  $('#cardExportCsv').onclick = () => downloadText(csvForDraft(draft), 'kfb-card-performance-cues.csv', 'text/csv');
  $('#cardExportLyrics').onclick = () => downloadText(lyricsForDraft(draft), 'kfb-card-performance-lyrics.txt', 'text/plain');
  $('#cardCopyJson').onclick = async () => { await navigator.clipboard?.writeText(JSON.stringify(exportValue(), null, 2)); status('Copied provenance JSON for ordinary Web Chat → GitHub review. No canonical save occurred.', 'ok'); };
  const files = $('#cardFiles'), drop = document.querySelector('.card-drop');
  drop.onclick = () => files.click(); files.onchange = event => ingestFiles(event.target.files).catch(error => status('Import rejected safely · ' + error.message, 'fail'));
  drop.ondragover = event => { event.preventDefault(); drop.classList.add('drag'); }; drop.ondragleave = () => drop.classList.remove('drag');
  drop.ondrop = event => { event.preventDefault(); drop.classList.remove('drag'); ingestFiles(event.dataTransfer.files).catch(error => status('Import rejected safely · ' + error.message, 'fail')); };
  window.speechSynthesis?.addEventListener?.('voiceschanged', populateVoices);
}

window.KFBCardAudition = { play: playBrowserPerformance, stop: stopPlayback, exact: playExactAudio };

async function init() {
  bind(); populateVoices(); await renderAssets();
  await loadBundle();
  window.KFBCardPerformance = {
    version: '0.6.0',
    getBundle: () => bundle ? { feed: structuredClone(bundle.feed), contentSha: bundle.feedEntry.sha, sourceStates: bundle.entries.map(entry => ({ path: entry.path, sha: entry.sha, cacheState: entry.cacheState })) } : null,
    getDraft: () => draft ? structuredClone(exportValue()) : null,
    reload: loadBundle,
    play: playBrowserPerformance,
    stop: stopPlayback,
    schemas: { feed: CARD_PERFORMANCE_SCHEMA, draft: DRAFT_SCHEMA }
  };
}

init().catch(error => status(`Source unavailable · ${error.message} · safe silence`, 'fail'));
