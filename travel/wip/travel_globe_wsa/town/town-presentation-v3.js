import { BAUM_WELT } from '../globe-v13/kit-massstab.js';

// v3 is deliberately a presentation correction on top of the tested v2 movement/grounding slice.
// It does NOT introduce another terrain, movement or camera solver.
// It removes flight-only presentation, recalibrates Town scale against Travel's existing world tree
// scale, and turns down the pet-only light treatment that overexposed the KayKit characters.

const V2_CHARACTER_HEIGHT = 0.15;
const TOWN_CHARACTER_HEIGHT = BAUM_WELT / 1.5; // one character ~= 2/3 of the canonical Travel tree height
const CASTLE_CHARACTER_HEIGHTS = 6.0;
const V2_CASTLE_HEIGHT = V2_CHARACTER_HEIGHT * 4.0;
const V2_FOREST_TREE_HEIGHT = V2_CHARACTER_HEIGHT * 2.0;

function waitForTown(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const tick = () => {
      if (window.__globe && window.__town && window.__town.player) return resolve({ g: window.__globe, town: window.__town });
      if (performance.now() - start > timeoutMs) return reject(new Error('Town v2 did not mount'));
      setTimeout(tick, 40);
    };
    tick();
  });
}

function scaleOnce(root, ratio, tag) {
  if (!root || !Number.isFinite(ratio) || ratio <= 0) return false;
  root.userData ||= {};
  if (root.userData.kfbTownV3Scale) return false;
  root.scale.multiplyScalar(ratio);
  root.userData.kfbTownV3Scale = { ratio, tag };
  root.updateMatrixWorld(true);
  return true;
}

async function main() {
  const { g, town } = await waitForTown();

  if (g.lines && g.lines.params) {
    g.lines.params.opacity = 0;
    g.lines.params.threshold = 999;
  }
  if (g.post && g.post.setParams) g.post.setParams({ eps: 999 });
  for (const name of ['trail', 'wake', 'rauch']) {
    const o = g[name];
    if (o && o.group) o.group.visible = false;
  }
  if (g.komposition && g.komposition.setEnabled) g.komposition.setEnabled(false);

  if (g.rig && g.rig.params) {
    Object.assign(g.rig.params, {
      distBoost: 0,
      heightBoost: 0,
      maxTilt: 0,
      fovBoost: 0,
      altShakeAmp: 0,
      baseFov: 34,
      lookAhead: 0.12,
      posSmooth: 15,
      lookSmooth: 15,
      lookBrake: 1,
      zoomSmooth: 20,
    });
    if (g.rig.setTrauma) g.rig.setTrauma(0);
    if (g.rig.setTraumaSource) g.rig.setTraumaSource(null);
  }
  if (g.setCamDist) g.setCamDist(0.42);
  if (g.look) { try { g.look.center(); g.look.setMode('look'); } catch (_) {} }

  if (g.lighting) {
    try { if (g.lighting.setEnv) g.lighting.setEnv(0); } catch (_) {}
    try { if (g.lighting.setTint) g.lighting.setTint(0xffffff, 0); } catch (_) {}
    try { if (g.lighting.setFill) g.lighting.setFill(0.12); } catch (_) {}
  }

  const characterRatio = TOWN_CHARACTER_HEIGHT / V2_CHARACTER_HEIGHT;
  const castleTarget = TOWN_CHARACTER_HEIGHT * CASTLE_CHARACTER_HEIGHTS;
  const medievalRatio = castleTarget / V2_CASTLE_HEIGHT;
  const forestRatio = BAUM_WELT / V2_FOREST_TREE_HEIGHT;

  scaleOnce(town.player.anchor, characterRatio, 'character');
  for (const npc of town.residents || []) scaleOnce(npc.anchor, characterRatio, 'character');
  if (town.places) {
    scaleOnce(town.places.castle, medievalRatio, 'medieval');
    scaleOnce(town.places.mine, medievalRatio, 'medieval');
  }

  const scene = g.scene;
  for (const name of ['Mine rock left-anchor', 'Mine rock back-anchor']) {
    scaleOnce(scene && scene.getObjectByName(name), forestRatio, 'forest');
  }
  for (const name of ['Campfire base-anchor', 'Campfire logs-anchor']) {
    scaleOnce(scene && scene.getObjectByName(name), characterRatio, 'character-prop');
  }

  if (g.carpet && g.carpet.params) {
    Object.assign(g.carpet.params, {
      maxSpeed: TOWN_CHARACTER_HEIGHT * 0.95,
      absMaxSpeed: TOWN_CHARACTER_HEIGHT * 1.05,
      accel: TOWN_CHARACTER_HEIGHT * 4.0,
      brakeDecel: TOWN_CHARACTER_HEIGHT * 8.0,
      coastDecel: TOWN_CHARACTER_HEIGHT * 5.5,
      maxBank: 0,
      driftMinSpeed: 99,
      driftTurnThreshold: 99,
      cliffMax: 0,
    });
    g.carpet.setSpeedFloor(0);
  }

  town.schema = 'kfb.town.founding.v3';
  town.presentation = {
    status: 'BROWSER_ACCEPTANCE_PENDING',
    characterHeight: +TOWN_CHARACTER_HEIGHT.toFixed(5),
    worldTreeHeight: +BAUM_WELT.toFixed(5),
    characterRatio: +characterRatio.toFixed(4),
    medievalRatio: +medievalRatio.toFixed(4),
    forestRatio: +forestRatio.toFixed(4),
    castleCharacterHeights: CASTLE_CHARACTER_HEIGHTS,
    flightFx: 'OFF',
    camera: 'Travel rig · ground-calibrated',
    lighting: 'pet env/tint off · reduced fill',
    rockCompositions: 'OFF',
  };

  const mode = document.querySelector('#kfb-town-hud .town-mode');
  const status = document.querySelector('#kfb-town-hud .town-status');
  const debug = document.querySelector('#kfb-town-hud .town-debug');
  if (mode) mode.textContent = 'KFB TOWN · GROUND PRESENTATION v3';
  if (status) status.textContent = 'Ground-only view · W/A/S/D · [I] interact · flight FX off';
  if (debug) debug.textContent = `figure ${TOWN_CHARACTER_HEIGHT.toFixed(3)}u · tree ${BAUM_WELT.toFixed(3)}u · castle ${CASTLE_CHARACTER_HEIGHTS.toFixed(1)}× figure`;

  console.info('[town] ground presentation v3 mounted', town.presentation);
}

main().catch((error) => console.error('[town] presentation v3 failed', error));
