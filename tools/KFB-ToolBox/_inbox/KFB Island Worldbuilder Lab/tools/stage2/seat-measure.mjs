// Stufe 2 · sichtbarer Fahrer: driving pose measured on the figure's own rig → the figure card's `seat` (kfb.character-card/1,
// SPEC_CHARACTER_INTEGRITY_R1 §2; values in H, scale-free). Writes public/cards/<id>.card.json (seat part only; the card is
// the single source the Lab reads: eyes / props stay open until the Resident Atlas slice).  node tools/stage2/seat-measure.mjs
import fs from 'node:fs';
import { openLab } from '../stage1/browser.mjs';
const H = 3.64, r4 = (v) => +v.toFixed(4);
const { page, close } = await openLab('shot=1&hub=1&bg=b0c6d8&play=travel&island=rkit_hub&road=0&seat=measure');
await page.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 });
const p = await page.evaluate(async () => (await window.__kfb.travel().seatInfo()).pose);
await close();
const card = {
  schema: 'kfb.character-card/1', id: 'farmer_a', displayName: 'Farmer A',
  rig: { base: 'KayKit Rig_Medium', asset: 'figures/Farmer_A_NoEyes.glb', scaleH: 1.0 },
  seat: {
    clip: 'kfb_interaction_driving_a', clipSource: 'KFB Motion Library v6 · Rig_Medium · KFB_Motion_interaction_i06.glb (md5 182072a066ff9dc5ffb4da05f043ff5f)', clipTime: 0.5,
    hipOffset: [r4(p.hips[0] / H), r4(p.hipsAboveSeat / H), r4(p.hips[2] / H)],
    hipOffsetNote: 'hips bone relative to the seat contact (lowest pelvis / thigh vertex) in the figure frame (x left, y up, z forward), H',
    shoulderAboveSeatH: r4(p.shoulderAboveSeat / H), headAboveSeatH: r4(p.headAboveSeat / H), feetBelowSeatH: r4(p.feetBelowSeat / H), kneeFwdH: r4(p.kneeFwd / H), halfWidthH: r4(p.halfWidth / H),
    measured: { date: new Date().toISOString().slice(0, 10), tool: 'tools/stage2/seat-measure.mjs' },
  },
  approved: null, note: 'Erste Lab-Karte: nur der Sitz (Steuerung 10.10., sichtbarer Fahrer). Augen, Props, Varianten folgen mit der Resident-Atlas-Slice.',
};
fs.mkdirSync('public/cards', { recursive: true });
fs.writeFileSync('public/cards/farmer_a.card.json', JSON.stringify(card, null, 1));
console.log(JSON.stringify(card.seat));
