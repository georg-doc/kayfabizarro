// V-202 (Steuerung 13.10., „erste Spielszene“, ?islands=1): two residents per play-scene island, they talk when the player arrives.
// Template first (V-140), nothing invented:
//   · figures   the ORIGINAL KayKit Mystery GLBs (own eyes, no eye rig; Steuerung: „Original-Figur, kein Remodel“), already in the Lab
//               under public/assets/organ-o1/raw/…/KayKit_Mystery_Series6; built by figure-b2 buildPlayable (clay, FIG_SCALE, Rig_Medium)
//   · lines     ChatterBox kernel prepareResidentTurn (PR #305) over RUNTIME_POOL (PR #310), vendored 1:1 from the ChatterBox Studio v2
//               session cut (src/chatter/vendor, SOURCE.md); pool only, English as in the pool, silence = thought bubble „…“
//   · bubble    format contract HANDOVER_WSA_CHATTERBOX_TRIPLET §3: ONE speech bubble, three blocks (subject · connector · reframe),
//               block gap 0.5 × font, outline from all three parts before the reveal, flip-stagger 520 ms (rotateX −86° → 0°, 300 ms);
//               shapes / layout = chatterbox-core.js (cbs-core 0.1); look V-204: plain „Clay pur“ face, no ink, one shape + soft shadow
//   · anchor    head height over the figure root (idle / nodding never moves the bubble), camera moves pass through at once
//   · gaze      on arrival both turn to the player and look up (head bone, clamped); the partner looks at the speaker
//   · contact   V-203: feet on the walk surface, soft clay blob contact shadow (car-hop.ts donor, same texture / colour / opacity)
// Trigger: the player gets out of the car within 12 lab of a resident, or walks up to 4.5 lab (cooldown 25 s). Opening by the nearer
// resident (no operator), the partner answers with the prior semantic (Studio order). Seed per turn (seed·7919 + turn·104729) >>> 0.
import * as THREE from 'three';
import { loadFigureCatalog, buildPlayable, type PlayableFigure } from '../../residents/figure-b2';
import type { PlacedIsland } from './islands-v202';
import { contactBlob } from '../../play/contact-blob';
// @ts-ignore – ChatterBox Studio v2 donor (IIFE, sets window.KFB_CB), vendored unchanged
import '../../chatter/vendor/chatterbox-core.js';
// @ts-ignore – PR #305 kernel, vendored unchanged
import { prepareResidentTurn } from '../../chatter/vendor/resident-chatter-adapter.v0.1.mjs';
// @ts-ignore – PR #310 pool + profiles, vendored unchanged
import { RUNTIME_POOL, RESIDENT_PROFILES } from '../../chatter/vendor/resident-chat-ensemble-data.mjs';

const RAW = 'organ-o1/raw/2ff8b350beefe02912bbff6eeeead3882e583d08/media/3D_Assets/KayKit_Mystery_Series6/';
const ORIGINAL: Record<string, { glb: string; profile: string; name: string; color: string }> = {
  clown: { glb: RAW + '11 - May 2024 - Clown/characters/Clown.glb', profile: 'clown', name: 'Clown', color: '#3cc0dc' },
  witch: { glb: RAW + '5 - November 2024 - Witch/characters/Witch.glb', profile: 'witch', name: 'Witch', color: '#e6b53a' },
  gothgirl: { glb: RAW + 'GothGirl/characters/GothGirl.glb', profile: 'goth-girl', name: 'Goth Girl', color: '#9a7cc4' },
  lorekeeper: { glb: RAW + '1 - July 2025 - Lorekeeper/Lorekeeper.glb', profile: 'lorekeeper', name: 'Lorekeeper', color: '#8f8473' },
};
const STAGGER = 520, R_EXIT = 12, R_WALK = 4.5, COOLDOWN = 25, BUBBLE_LIFE = 7.5;
const INK = '#1f1a14';
const mix = (a: string, b: string, t: number) => { const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v * (1 - t) + B[i] * t).toString(16).padStart(2, '0')).join(''); };

type Npc = { id: string; isl: PlacedIsland; P: PlayableFigure; head: THREE.Object3D | null; baseYaw: number; yaw: number; headH: number; look: THREE.Vector3 | null; lookW: number; blob: THREE.Mesh; interact: THREE.AnimationAction | null; idle: THREE.AnimationAction | null };
type Bubble = { el: HTMLDivElement; npc: Npc; w: number; h: number; t: number; tri: boolean };


export async function createIslandNpcs(o: { scene: THREE.Scene; camera: THREE.Camera; islands: PlacedIsland[]; surfaceAt: (x: number, z: number) => any; seed?: number }) {
  const C: any = (window as any).KFB_CB, cat = await loadFigureCatalog(), npcs: Npc[] = [], info: any[] = [];
  if (!document.querySelector('link[data-kfb-shantell]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@400;700&display=swap'; l.dataset.kfbShantell = '1'; document.head.appendChild(l); }
  // ---- placement: from the island centre towards its road leg to the road edge, then back inland onto clear ground
  const gnd = (x: number, z: number) => { const s = o.surfaceAt(x, z); return s && s.role === 'ground' && !s.wall ? s.y : null; };
  const clear = (x: number, z: number, y: number) => { for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2, g = gnd(x + Math.cos(a) * 0.9, z + Math.sin(a) * 0.9); if (g == null || Math.abs(g - y) > 0.3) return false; } return true; };
  for (const isl of o.islands) {
    const u = isl.roadSide.clone().sub(isl.centre).setY(0).normalize(), v = new THREE.Vector3(-u.z, 0, u.x);
    let edge = isl.roadSide.clone(); for (let d = 0; d < 40; d += 0.25) { const p = isl.centre.clone().addScaledVector(u, d), s = o.surfaceAt(p.x, p.z); if (s && /^fahrbahn/.test(s.role)) { edge = p; break; } }
    const spots: THREE.Vector3[] = [];
    // reachable on foot: the straight walk from the road edge to the spot crosses only ground (no fence, bench, rock or tree on the way)
    const reach = (p: THREE.Vector3) => { const a = edge.clone().addScaledVector(v, v.dot(p.clone().sub(edge))); for (let f = 0.1; f <= 1; f += 0.05) { const q = a.clone().lerp(p, f); if (gnd(q.x, q.z) == null) return false; } return true; };
    for (const side of [-1, 1]) for (let k = 2.5; k < 14 && spots.length < (side < 0 ? 1 : 2); k += 0.25) { const p = edge.clone().addScaledVector(u, -k).addScaledVector(v, side * 1.7), y = gnd(p.x, p.z); if (y != null && clear(p.x, p.z, y) && reach(p)) { p.y = y; spots.push(p); } }
    if (spots.length < 2) console.warn('[v202] residents: only', spots.length, 'reachable spots on', isl.name);
    for (let i = 0; i < isl.npcs.length && i < spots.length; i++) {
      const id = isl.npcs[i], src = ORIGINAL[id], e = cat.find((f) => f.id === id); if (!src || !e) continue;
      const P = await buildPlayable({ ...e, glb: src.glb, eyes: { mode: 'original', source: 'V-202 · Original-GLB mit Augen (KayKit Mystery)' }, variants: [], bindTexture: false });
      const p = spots[i], other = spots[1 - i] ?? edge, toRoad = Math.atan2(u.x, u.z), toOther = Math.atan2(other.x - p.x, other.z - p.z);
      // facing the road, turned a little towards the partner
      const baseYaw = toRoad + 0.35 * Math.atan2(Math.sin(toOther - toRoad), Math.cos(toOther - toRoad));
      P.obj.position.copy(p); P.obj.rotation.set(0, baseYaw, 0); o.scene.add(P.obj); P.obj.updateMatrixWorld(true);
      const head = P.obj.getObjectByName('head') ?? null, headH = head ? head.getWorldPosition(new THREE.Vector3()).y - p.y : 2.4;
      P.mixer.setTime(Math.random() * 3);
      const blob = contactBlob(1.15); blob.position.set(p.x, p.y + 0.03, p.z); o.scene.add(blob);
      const ic = P.clips.find((c) => c.name === 'Interact'), idleC = P.clips.find((c) => c.name === 'Idle_A');
      const interact = ic ? P.mixer.clipAction(ic) : null; if (interact) { interact.setLoop(THREE.LoopOnce, 1); interact.clampWhenFinished = true; }
      npcs.push({ id, isl, P, head, baseYaw, yaw: baseYaw, headH, look: null, lookW: 0, blob, interact, idle: idleC ? P.mixer.clipAction(idleC) : null });
      info.push({ id, island: isl.id, pos: p.toArray().map((x) => +x.toFixed(2)), headH: +headH.toFixed(2), clips: P.clips.length });
    }
  }
  // ---- bubbles (DOM overlay)
  const host = document.createElement('div'); host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:6;overflow:hidden'; document.body.appendChild(host);
  host.innerHTML = '<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="kfbWallShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#1a0f05" stop-opacity=".32"/></linearGradient><filter id="kfbSoftShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter><pattern id="kfbDotsWarm" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.3" fill="#b38a55"/></pattern><linearGradient id="kfbFaceShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".34"/><stop offset=".48" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#2a1a0c" stop-opacity=".14"/></linearGradient><radialGradient id="kfbFade" cx="0.8" cy="0.86" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#000000"/></radialGradient><mask id="kfbCornerMask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#kfbFade)"/></mask></defs></svg>';
  const bubbles: Bubble[] = [];
  let uid = 0;
  const layoutTri = (parts: string[], kind: 'speech' | 'thought') => {
    const base = Math.round(Math.max(15, Math.min(20, innerHeight / 42))), Ls = parts.map((p) => C.layout(p, kind, { basePx: base, maxPx: Math.min(420, innerWidth * 0.42) })), L0 = Ls[0], fs = L0.fontPx, lh = L0.lh, gap = Math.round(fs * 0.5);
    const inner = Math.max(...Ls.map((l: any) => l.w - 2 * l.padX)); let n = 0; const lines: { text: string; mt: number; part: number }[] = [];
    Ls.forEach((l: any, pi: number) => l.lines.forEach((toks: any[], li: number) => { lines.push({ text: toks.map((t) => t.text).join(''), mt: pi > 0 && li === 0 ? gap : 0, part: pi }); n++; }));
    return { w: Math.round(inner + 2 * L0.padX), h: Math.round(n * fs * lh + gap * (Ls.length - 1) + 2 * L0.padY), padX: L0.padX, padY: L0.padY, fs, lh, lines };
  };
  const say = (npc: Npc, parts: string[], kind: 'speech' | 'thought') => {
    for (const b of bubbles) if (b.npc === npc) b.t = Math.max(b.t, BUBBLE_LIFE - 0.2);
    const L = layoutTri(parts, kind), M = 34, col = ORIGINAL[npc.id].color, el = document.createElement('div');
    el.style.cssText = `position:absolute;left:0;top:0;width:${L.w + 2 * M}px;height:${L.h + 2 * M}px;transition:opacity .18s;will-change:transform`;
    el.dataset.kind = kind; el.dataset.speaker = npc.id; el.dataset.text = parts.join(' / ');
    host.appendChild(el); const b: Bubble = { el, npc, w: L.w, h: L.h, t: 0, tri: kind === 'speech' }; bubbles.push(b); draw(b, L, M, col, kind, ++uid);
  };
  const draw = (b: Bubble, L: ReturnType<typeof layoutTri>, M: number, col: string, kind: string, id: number, hl?: [number, number]) => {
    const w = L.w, h = L.h, seed = C.hash(b.el.dataset.text + kind) % 9999, hlx = hl ? hl[0] : M + w / 2, hly = hl ? hl[1] : M + h + 30;
    // V-204 (Steuerung 13.10.): the plain bubble = the Studio's rim „Clay pur“ (clayonly: roundRectPath, face mix('#fbf2df', colour, .2) +
    // clayFront shade, no ink) WITHOUT its rim wall layers (offset copies of the outline = a second tail): ONE shape, ONE tail, one soft shadow
    let d: string, dots = ''; if (kind === 'thought') { d = C.thoughtPath(M, w, h, seed); dots = C.thinkDots(M, w, h, hlx, hly, seed); } else d = C.roundRectPath(M, w, h, Math.min(14, Math.round(h * 0.3)), seed, hlx, hly, 16, 12);
    const full = dots ? d + ' ' + dots : d, face = mix('#fbf2df', col, 0.2), layers: any[] = [{ d: full, fill: face }, ...C.clayFront(full)];
    const svg = layers.map((l) => `<path d="${l.d}" fill="${l.fill ?? 'none'}"${l.stroke ? ` stroke="${l.stroke}" stroke-width="${l.sw}" stroke-linejoin="round" stroke-miterlimit="6" stroke-linecap="round"` : ''}${l.tf ? ` transform="${l.tf}"` : ''}${l.op != null ? ` opacity="${l.op}"` : ''}${l.filter ? ` filter="${l.filter}"` : ''}${l.mask ? ` mask="${l.mask}"` : ''}/>`).join('');
    const txt = L.lines.map((ln) => `<div data-part="${ln.part}" style="white-space:pre;text-align:center;margin-top:${ln.mt}px;transform-origin:50% 0">${ln.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div>`).join('');
    if (hl) { b.el.querySelector('svg')!.innerHTML = svg; (b as any).hl = [hlx, hly]; return; }
    b.el.innerHTML = `<div style="position:absolute;inset:0;transform-origin:${Math.round(hlx)}px ${Math.round(hly)}px;filter:drop-shadow(0 3px 5px rgba(42,26,12,.28))"><svg width="${w + 2 * M}" height="${h + 2 * M}" style="position:absolute;left:0;top:0;overflow:visible">${svg}</svg><div style="position:absolute;left:${M}px;top:${M}px;width:${w}px;height:${h}px;padding:${L.padY}px ${L.padX}px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:'Shantell Sans','Comic Sans MS',cursive;font-size:${L.fs}px;line-height:${L.lh};color:${INK}">${txt}</div></div>`;
    b.el.firstElementChild!.animate([{ transform: 'scale(.82)', opacity: 0 }, { transform: 'scale(1.04)', opacity: 1, offset: 0.65 }, { transform: 'scale(1)', opacity: 1 }], { duration: 170, easing: 'cubic-bezier(.3,1.3,.5,1)' });
    if (kind === 'speech') b.el.querySelectorAll<HTMLDivElement>('[data-part]').forEach((ln) => ln.animate([{ opacity: 0, transform: 'perspective(520px) rotateX(-86deg)' }, { opacity: 1, transform: 'perspective(520px) rotateX(0deg)' }], { duration: 300, delay: Number(ln.dataset.part) * STAGGER, fill: 'backwards', easing: 'cubic-bezier(.2,.9,.3,1.12)' }));
    (b as any).L = L; (b as any).M = M; (b as any).col = col; (b as any).kind = kind; (b as any).id = id; (b as any).hl = [hlx, hly];
  };
  // ---- conversation
  const mul = (a: number) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const seed = o.seed ?? 1105, mem = new Map<string, { recent: string[]; turn: number; last: number }>(), log: any[] = [];
  let clock = 0; const timers: { at: number; fn: () => void }[] = [];
  // Interact clip once (Rig_Medium General), cross-faded in and back to Idle_A before its end
  const gesture = (n: Npc) => { const I = n.interact, D = n.idle; if (!I || !D) return; I.reset().play(); D.crossFadeTo(I, 0.2, false); timers.push({ at: clock + Math.max(0.4, I.getClip().duration - 0.3), fn: () => { D.reset().play(); I.crossFadeTo(D, 0.3, false); } }); };
  const turn = (sp: Npc, ad: Npc, prior: any) => {
    const m = mem.get(sp.isl.id)!, prof = ORIGINAL[sp.id].profile, ap = ORIGINAL[ad.id].profile;
    const out: any = prepareResidentTurn({ speakerId: prof, residentProfile: RESIDENT_PROFILES[prof], socialOperator: null, priorSemantic: prior, pool: RUNTIME_POOL, event: { cardRef: null, witnessIds: [prof, ap], tags: [] }, recentTripletIds: m.recent, rng: mul((seed * 7919 + m.turn * 104729) >>> 0), addresseeId: ap });
    m.turn++;
    if (out.kind === 'turn') { m.recent = m.recent.concat(out.tripletId).slice(-4); say(sp, [out.semantic.subject, out.semantic.connector, out.semantic.reframe], 'speech'); gesture(sp); }
    else say(sp, ['…'], 'thought');
    log.push({ t: +clock.toFixed(2), island: sp.isl.id, speaker: prof, kind: out.kind, tripletId: out.tripletId ?? null, reason: out.reason ?? null, text: out.kind === 'turn' ? out.utterance : '…' });
    return out;
  };
  const converse = (isl: PlacedIsland, from: THREE.Vector3, why: string) => {
    const pair = npcs.filter((n) => n.isl === isl); if (pair.length < 2) return false;
    const m = mem.get(isl.id) ?? { recent: [], turn: 0, last: -1e9 }; mem.set(isl.id, m); m.last = clock;
    pair.sort((a, b) => a.P.obj.position.distanceTo(from) - b.P.obj.position.distanceTo(from)); const [a, b] = pair;
    log.push({ t: +clock.toFixed(2), island: isl.id, trigger: why });
    const first = turn(a, b, null); b.look = a.P.obj.position.clone().setY(a.P.obj.position.y + a.headH);
    timers.push({ at: clock + (first.kind === 'turn' ? (STAGGER * 2 + 700) / 1000 : 0.9), fn: () => { turn(b, a, first.kind === 'turn' ? first.semantic : null); a.look = b.P.obj.position.clone().setY(b.P.obj.position.y + b.headH); b.look = null; } });
    return true;
  };
  // ---- per frame
  const V = new THREE.Vector3(), Q = new THREE.Quaternion(), Qp = new THREE.Quaternion(), F = new THREE.Vector3(), T = new THREE.Vector3(), RQ = new THREE.Quaternion();
  let prevMode = '', talking = false;
  const update = (dt: number, s: { mode: string; player: THREE.Vector3; playerHead: number }) => {
    clock += dt;
    for (let i = timers.length - 1; i >= 0; i--) if (timers[i].at <= clock) { const f = timers[i].fn; timers.splice(i, 1); f(); }
    // trigger: out of the car near a resident, or walking up to one (cooldown per island)
    if (s.mode === 'WALK') for (const isl of o.islands) {
      const pair = npcs.filter((n) => n.isl === isl); if (!pair.length) continue; const d = Math.min(...pair.map((n) => Math.hypot(n.P.obj.position.x - s.player.x, n.P.obj.position.z - s.player.z))), m = mem.get(isl.id);
      if (prevMode === 'AUTO' && d < R_EXIT) converse(isl, s.player, 'exit');
      else if (d < R_WALK && (!m || clock - m.last > COOLDOWN)) converse(isl, s.player, 'walk');
    }
    prevMode = s.mode;
    talking = bubbles.length > 0;
    const head = V.copy(s.player).setY(s.player.y + s.playerHead);
    for (const n of npcs) {
      const R = n.P.obj, dp = Math.hypot(R.position.x - s.player.x, R.position.z - s.player.z), m = mem.get(n.isl.id), engaged = !!m && clock - m.last < 14 && dp < 18;
      // body: towards the player while engaged (eased), else back to the rest yaw
      const want = engaged ? Math.atan2(s.player.x - R.position.x, s.player.z - R.position.z) : n.baseYaw, dy = Math.atan2(Math.sin(want - n.yaw), Math.cos(want - n.yaw));
      n.yaw += dy * Math.min(1, dt * 3.2); R.rotation.y = n.yaw;
      n.P.update(dt); R.updateMatrixWorld(true);
      // head: look up at the player (or the speaker), clamped 60° yaw / 35° pitch, eased weight
      const tgt = n.look ?? (engaged ? head : null); n.lookW += ((tgt ? 1 : 0) - n.lookW) * Math.min(1, dt * 4);
      if (n.head && n.lookW > 0.01 && (tgt || n.lookW > 0.01)) {
        const hw = n.head.getWorldPosition(T), dir = (tgt ?? head).clone().sub(hw).normalize(), fwd = F.set(Math.sin(n.yaw), 0, Math.cos(n.yaw));
        let yaw = Math.atan2(dir.x, dir.z) - n.yaw; yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw)); yaw = THREE.MathUtils.clamp(yaw, -1.05, 1.05);
        const pitch = THREE.MathUtils.clamp(Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1)), -0.35, 0.6);
        const aim = new THREE.Vector3(Math.sin(n.yaw + yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(n.yaw + yaw) * Math.cos(pitch));
        RQ.setFromUnitVectors(fwd, aim); Q.identity().slerp(RQ, n.lookW);
        n.head.getWorldQuaternion(Qp); Qp.premultiply(Q); const pq = n.head.parent!.getWorldQuaternion(new THREE.Quaternion()).invert(); n.head.quaternion.copy(pq.multiply(Qp)); n.head.updateMatrixWorld(true);
      }
      n.blob.position.set(R.position.x, R.position.y + 0.03, R.position.z);
    }
    // bubbles: anchored over the head height of the root (idle never moves them), placed above, clamped to the screen
    const W = innerWidth, H = innerHeight, placed: { x: number; y: number; w: number; h: number; hx: number }[] = [];
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]; b.t += dt; if (b.t > BUBBLE_LIFE) { b.el.style.opacity = '0'; if (b.t > BUBBLE_LIFE + 0.25) { b.el.remove(); bubbles.splice(i, 1); } continue; }
      const R = b.npc.P.obj, a = V.set(R.position.x, R.position.y + b.npc.headH + 0.55, R.position.z).project(o.camera as THREE.PerspectiveCamera);
      if (a.z > 1 || a.z < -1) { b.el.style.display = 'none'; continue; } b.el.style.display = '';
      const hx = (a.x * 0.5 + 0.5) * W, hy = (-a.y * 0.5 + 0.5) * H, M = (b as any).M, pad = 12, gap = 26;
      let bx = Math.max(pad, Math.min(W - pad - b.w, hx - b.w / 2)), by = hy - gap - b.h; if (by < pad) by = pad;
      // the pair's bubbles never overlap (Studio place(): own side first): the speaker further left moves left, the other right; else above
      for (const o2 of placed) { const hit = () => bx < o2.x + o2.w + 8 && bx + b.w + 8 > o2.x && by < o2.y + o2.h + 8 && by + b.h + 8 > o2.y; if (!hit()) continue;
        const nx = hx < o2.hx ? o2.x - b.w - 8 : o2.x + o2.w + 8; if (nx >= pad && nx + b.w <= W - pad) bx = nx; else by = Math.max(pad, o2.y - b.h - 8); if (hit()) by = o2.y + o2.h + 8; }
      placed.push({ x: bx, y: by, w: b.w, h: b.h, hx });
      const last = (b as any).at as number[] | undefined; if (last && Math.abs(last[0] - bx) < 0.5 && Math.abs(last[1] - by) < 0.5) continue; (b as any).at = [bx, by];
      b.el.style.transform = `translate(${Math.round(bx - M)}px,${Math.round(by - M)}px)`;
      const hl: [number, number] = [Math.round(hx - (bx - M)), Math.round(Math.min(hy, by + b.h + 60) - (by - M))], ph = (b as any).hl;
      if (Math.abs(ph[0] - hl[0]) > 6 || Math.abs(ph[1] - hl[1]) > 6) draw(b, (b as any).L, M, (b as any).col, (b as any).kind, (b as any).id, hl);
    }
  };
  return {
    npcs, info, update, log, bubbles: () => bubbles.map((b) => ({ speaker: b.npc.id, text: b.el.dataset.text, kind: b.el.dataset.kind, t: +b.t.toFixed(2), rect: b.el.getBoundingClientRect().toJSON() })),
    /** probes: start a conversation on an island as if the player had arrived at `from` */
    converse: (id: string, from?: THREE.Vector3) => { const isl = o.islands.find((i) => i.id === id); return isl ? converse(isl, from ?? isl.roadSide, 'probe') : false; },
    talking: () => talking,
    dispose() { host.remove(); for (const n of npcs) { n.P.dispose(); n.blob.removeFromParent(); } },
  };
}
export type IslandNpcs = Awaited<ReturnType<typeof createIslandNpcs>>;
