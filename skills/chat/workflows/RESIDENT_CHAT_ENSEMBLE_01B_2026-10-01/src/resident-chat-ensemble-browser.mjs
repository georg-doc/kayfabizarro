// RESIDENT-CHAT-ENSEMBLE-01B · thin browser integration over the existing S15 Atlas owner.
import {
  RESIDENT_IDS,
  MAX_VISIBLE_BUBBLES,
  buildProofConversation,
  buildPlayerTurn
} from './resident-chat-ensemble-dialogue.mjs';

const DONOR_BASE = '/tools/KFB-ToolBox/_inbox/KFB%20Resident%20Card%20Speculation%20Scene/npc-card-spec-01_2026-09-24/npc-card-spec-01/';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findBubbleHost(member) {
  const actor = member.nodes.get(member.recipe.actor.id);
  if (!actor) throw new Error('Missing source actor ' + member.recipe.actor.id);
  let host = actor.getObjectByName && actor.getObjectByName('body');
  if (host && !host.geometry) host = null;
  if (!host) {
    actor.traverse((node) => {
      if (!host && node.isMesh && node.geometry) host = node;
    });
  }
  if (!host) throw new Error('No source mesh bubble anchor for ' + member.recipe.residentId);
  return host;
}

export async function mountResidentChatEnsemble({ atlas, stage } = {}) {
  if (!atlas || typeof atlas.showEnsembleSubset !== 'function') {
    throw new Error('Resident Chat requires the existing S15 showEnsembleSubset seam');
  }
  if (!stage) throw new Error('Resident Chat requires the existing S15 #stage');

  const [donor, shapesResponse] = await Promise.all([
    import(DONOR_BASE + 'resident-scene.mjs'),
    fetch(DONOR_BASE + 'donor/podcast-v5/bubble-shapes.json')
  ]);
  if (!shapesResponse.ok) throw new Error('Bubble shapes HTTP ' + shapesResponse.status);
  const shapes = await shapesResponse.json();
  if (typeof donor.createBubbles !== 'function') throw new Error('Existing bubble donor is not exported');

  const cur = await atlas.showEnsembleSubset(RESIDENT_IDS);
  if (!cur || !cur.ensemble || cur.members.length !== RESIDENT_IDS.length) {
    throw new Error('S15 did not mount the four-Resident source ensemble');
  }

  const overlay = document.createElement('div');
  overlay.id = 'resident-chat-overlay';
  overlay.dataset.owner = 'NPC-CARD-SPEC-01 createBubbles';
  overlay.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:6';
  stage.appendChild(overlay);

  const bubbles = donor.createBubbles({ overlay, shapes });
  const actors = new Map();
  cur.members.forEach((member, index) => {
    actors.set(member.recipe.residentId, {
      slot: index < 2 ? 'A' : 'B',
      host: findBubbleHost(member),
      member
    });
  });

  const runtime = {
    ready: false,
    owner: 'S15 Atlas renderer/camera + tested Resident Chatter kernel + NPC-CARD-SPEC-01 bubble donor',
    members: RESIDENT_IDS.slice(),
    proofTurns: [],
    playerTurns: [],
    proofRunning: false,
    proofDone: false,
    maxObservedBubbles: 0,
    errors: [],
    sourceCapabilities: {
      sourceAnimation: true,
      mouth: false,
      gaze: false,
      bubble: 'NPC-CARD-SPEC-01 createBubbles',
      note: 'No new mouth/gaze owner is fabricated for S15 actors.'
    }
  };

  let clock = 0;
  let last = performance.now();
  let raf = 0;
  const visibleCount = () => overlay.querySelectorAll('canvas').length;
  const sampleBubbleCount = () => {
    runtime.maxObservedBubbles = Math.max(runtime.maxObservedBubbles, visibleCount());
    if (runtime.maxObservedBubbles > MAX_VISIBLE_BUBBLES) {
      runtime.errors.push('bubble budget exceeded: ' + runtime.maxObservedBubbles);
    }
  };

  function frame(nowMs) {
    const dt = Math.min(0.1, Math.max(0, (nowMs - last) / 1000));
    last = nowMs;
    clock += dt;
    bubbles.update({
      now: clock,
      camera: atlas.V.camera,
      vw: stage.clientWidth,
      vh: stage.clientHeight,
      THREE: atlas.V.THREE || window.THREE,
      cardRect: null
    });
    sampleBubbleCount();
    raf = requestAnimationFrame(frame);
  }

  // V does not expose THREE as a named field in every Atlas build; the existing mesh objects do.
  const anyHost = actors.values().next().value.host;
  const THREE = anyHost.position && anyHost.position.constructor
    ? await import('three')
    : null;

  function showTurn(turn, hold = 3.6) {
    const actor = actors.get(turn.speakerId);
    if (!actor) throw new Error('No mounted actor for ' + turn.speakerId);
    bubbles.show({
      actor,
      text: turn.utterance,
      voice: 'mid',
      until: clock + hold,
      seed: 100 + runtime.proofTurns.length + runtime.playerTurns.length,
      now: clock
    });
    sampleBubbleCount();
  }

  async function proof() {
    if (runtime.proofRunning) return runtime.proofTurns.slice();
    runtime.proofRunning = true;
    runtime.proofDone = false;
    runtime.proofTurns.length = 0;
    bubbles.clear();
    try {
      const turns = buildProofConversation();
      runtime.proofTurns.push(turns[0]);
      showTurn(turns[0], 3.6);
      await sleep(2200);
      runtime.proofTurns.push(turns[1]);
      showTurn(turns[1], 3.6);
      await sleep(2800);
      runtime.proofDone = true;
      return turns;
    } catch (error) {
      runtime.errors.push(String(error?.message || error));
      throw error;
    } finally {
      runtime.proofRunning = false;
    }
  }

  async function interact(residentId = 'clown', options = {}) {
    const turn = buildPlayerTurn(residentId, options);
    runtime.playerTurns.push(turn);
    showTurn(turn, 4.0);
    return turn;
  }

  const onInteract = (event) => {
    const detail = event && event.detail || {};
    interact(detail.residentId || 'clown', detail).catch((error) => {
      runtime.errors.push(String(error?.message || error));
    });
  };
  stage.addEventListener('kfb:resident-interact', onInteract);

  raf = requestAnimationFrame((now) => {
    last = now;
    // Use the canonical Three module already selected by S15 import map.
    const update = bubbles.update.bind(bubbles);
    bubbles.update = (args) => update({ ...args, THREE });
    frame(now);
  });

  runtime.ready = true;
  const api = {
    ready: true,
    proof,
    interact,
    state: () => ({
      ...runtime,
      proofTurns: runtime.proofTurns.map((turn) => ({ ...turn })),
      playerTurns: runtime.playerTurns.map((turn) => ({ ...turn })),
      activeBubbleCount: visibleCount()
    }),
    dispose() {
      cancelAnimationFrame(raf);
      stage.removeEventListener('kfb:resident-interact', onInteract);
      bubbles.clear();
      overlay.remove();
    }
  };

  // One bounded 2-turn review conversation. This is presentation proof, not a production WHEN loop.
  setTimeout(() => proof().catch(() => {}), 650);
  return api;
}
