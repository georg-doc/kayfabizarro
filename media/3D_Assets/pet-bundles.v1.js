/* pet-bundles.v1.js — KFB Pet State-Bundles v1 (2026-07-22)
 *
 * Kuratierte Ereignis-Kombis über dem fertigen `pet` aus kfb-pets.js (makePet).
 * Jedes Bundle ist ein DÜNNER Wrapper über die echte Motor-API (pet.face / pet.motion / pet.rig)
 * mit der richtigen Reihenfolge (Augen vor Körper) schon drin. KEINE Motor-Änderung, reine
 * App-Schicht — genau die Kombis, die wir selbst benutzen.
 *
 * PRIME DIRECTIVE: `attend` ist der EINZIGE Dauerzustand; alles andere ist Interpunktion und
 * settlet dorthin zurück. Höchstens EIN „lautes" Bundle gleichzeitig; `sleep` gewinnt gegen alles.
 *
 * WICHTIG (gemessen am Motor, 2026-07-22): Wenn PetFace läuft (Standard aus makePet), besitzt es
 * die Augen und schreibt Lider+Blick JEDEN Frame. Deshalb ist das Idle-Umschauen `face.setDrift`,
 * NICHT `rig.setLife` (das wirkt nur ohne PetFace). Blink bleibt separat und wirkt auch mit Face.
 *
 * Import:  import { PetBundles } from './pet-bundles.v1.js';
 *   oder:  import { PetBundles } from
 *          'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/pet-bundles.v1.js';
 */

export const PetBundles = {
  // ── Dauerzustand: lebendig. Einmal aufrufen; gibt eine Cleanup-Funktion zurück. ──
  attend(pet, canvasEl) {
    if (pet.face) pet.face.setDrift(true);              // Ausdruck wandert neutral↔thinking (Idle-Umschauen)
    if (pet.rig) pet.rig.setBlink({ minGap: 2.2, maxGap: 6.5, dur: 0.13 });
    if (!canvasEl) return () => {};
    const onMove = (e) => {
      if (!pet.face) return;
      const r = canvasEl.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pet.face.setCursor(-nx, ny);                      // x NEGIEREN; löst sich nach 2.4 s in den Drift auf
    };
    canvasEl.addEventListener('pointermove', onMove);
    return () => canvasEl.removeEventListener('pointermove', onMove);
  },

  // ── Interpunktion: feuern einmal, settlen zurück in attend ──
  greet(pet)     { if (pet.face) { pet.face.set('happy', { hard: true, hold: 1.6 }); pet.face.eyePop(0.5); } return pet.motion.hop(); },
  notice(pet)    { return pet.motion.combo('doubleTake'); },
  agree(pet)     { return pet.motion.react('positive'); },
  disagree(pet)  { return pet.motion.react('negative'); },
  celebrate(pet) { return pet.motion.combo('tada'); },
  startle(pet)   { return pet.motion.trigger('drop'); },
  shiver(pet)    { return pet.motion.combo('shiver'); },

  // ── Zustände mit Ein/Aus ──
  think(pet)     { if (pet.face) pet.face.set('thinking', { hold: 999 }); pet.motion.loop('loading', true); },
  thinkStop(pet) { pet.motion.loop('loading', false); if (pet.face) pet.face.set('neutral', { hold: 0.4 }); },

  sleep(pet) {
    if (pet.face) pet.face.enabled = false;             // Face gibt die Lider frei
    if (pet.rig) pet.rig.applyEmote({ lidUpper: 1, lidLower: 0.55, slant: 0, pupil: 'normal', gaze: 'front' });
    pet.motion.setParams({ idle: { breathe: 0.015, period: 4.2, sway: 0.022 } });
    pet.motion.loop('idle', true);
    pet.object3D.rotation.x = 0.06;                      // leichte Vorneigung
  },
  wake(pet) {
    pet.object3D.rotation.x = 0;
    pet.motion.setParams({ idle: { breathe: 0.03, period: 2.8, sway: 0.01 } });
    if (pet.face) { pet.face.enabled = true; pet.face.set('happy', { hard: true, hold: 1.4 }); }
    const p = pet.motion.celebrate();
    Promise.resolve(p).then(() => pet.motion.loop('idle', true));   // Idle-Atmung wieder aufnehmen
    return p;
  },

  // ── Sprechen: Visem-Shuffle im Silbentakt (kein echter Lip-Sync; Stimme-Takt: EMBED §7b) ──
  talk(pet, on) { pet.talk(on !== false); return pet; },

  // ── Stimmung → passendes Bundle in einer Zeile ──
  byMood(pet, mood) {
    const map = { positive: 'celebrate', negative: 'disagree', neutral: 'notice' };
    return this[map[mood] || 'notice'].call(this, pet);
  },
};

export default PetBundles;
try { if (typeof window !== 'undefined') window.PetBundles = PetBundles; } catch (e) {}
