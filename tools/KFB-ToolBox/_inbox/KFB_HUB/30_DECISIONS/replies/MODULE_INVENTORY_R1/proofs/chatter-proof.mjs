const V = process.env.HOME + '/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/src/chatter/vendor/';
globalThis.window = globalThis;
await import(V + 'chatterbox-core.js');
const C = globalThis.KFB_CB; console.log('KFB_CB', C.version, 'keys', Object.keys(C).length);
const d = C.roundRectPath(34, 220, 80, 14, 123, 144, 144, 16, 12); console.log('roundRectPath', d.slice(0, 70) + '…', 'len', d.length);
console.log('clayFront layers', JSON.stringify(C.clayFront('M0 0 Z')));
try { const L = C.layout('This is *fine*, says the Lorekeeper.', 'speech', { basePx: 18, maxPx: 420 }); console.log('layout', L.w, L.h, L.lines.length, 'lines'); } catch (e) { console.log('layout ERR (needs DOM canvas):', e.message); }
const A = await import(V + 'resident-chatter-adapter.v0.1.mjs'); const D = await import(V + 'resident-chat-ensemble-data.mjs');
let a = 1105; const rng = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const prof = 'lorekeeper';
const out = A.prepareResidentTurn({ speakerId: prof, residentProfile: D.RESIDENT_PROFILES[prof], socialOperator: null, priorSemantic: null, pool: D.RUNTIME_POOL, event: { cardRef: null, witnessIds: [prof, 'clown'], tags: [] }, recentTripletIds: [], rng });
console.log('prepareResidentTurn', out.kind, out.tripletId, JSON.stringify(out.semantic ?? out.reason));
