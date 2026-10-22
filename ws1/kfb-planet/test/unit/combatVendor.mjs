// Kampf-Module aus PR #25 (WSA, cb0d93c) im Spiel: portierter Vertragstest (tests/open-world-contracts.test.js, ohne Roster) mit three 0.186
import { readFileSync } from 'fs'
import * as T from 'three'
import { auditWeaponProfile } from '../../src/vendor/combat/weapon-profile.v1.mjs'
import { muzzleSourceFields } from '../../src/vendor/combat/muzzle-sources.v1.mjs'
import { create, readMuzzlePose } from '../../src/vendor/combat/muzzle-fx.v1.mjs'
import { createHitStop, HIT_STOP_DEFAULT_MS } from '../../src/vendor/combat/hit-stop.v1.mjs'
import { report } from '../_page.mjs'
const card = (f) => JSON.parse(readFileSync(new URL('../../src/data/combat/k10/' + f, import.meta.url)))
const c = {}
const pistol = card('kfb_kit_gun_pistol_prototype.weapon.json'), blaster = card('kfb_kit_heroman_blaster.weapon.json')
c.pistolPass = auditWeaponProfile(pistol).status === 'CONTRACT_PASS'
c.blasterPass = auditWeaponProfile(blaster).status === 'CONTRACT_PASS'
{ const p = JSON.parse(JSON.stringify(pistol)); p.mount.slotOffset.rotation = [0, 0, 0, 0]; c.rejectsBadRotation = auditWeaponProfile(p).status === 'CONTRACT_FAIL' }
{ const anchor = new T.Group(); anchor.name = 'KFB_Muzzle'; anchor.position.set(2, 1, 3); const src = new T.Group(); src.add(new T.Mesh(new T.BoxGeometry(), new T.MeshBasicMaterial({ color: 0xffcc00 })))
  const muzzle = { node: 'KFB_Muzzle', forwardLocal: [0, 0, 1], ...muzzleSourceFields() }, assets = { [muzzle.primary.ref]: src, [muzzle.secondary.ref]: src }, fx = create({ anchor, assets, muzzle })
  const pose = readMuzzlePose(anchor, new T.Vector3(), new T.Vector3())
  fx.fire(); const on = anchor.children.filter((n) => n.visible).length; fx.update(0.07); const off = anchor.children.filter((n) => n.visible).length; fx.dispose()
  c.muzzleFlash = pose.position.toArray().join() === '2,1,3' && pose.direction.toArray().join() === '0,0,1' && on === 1 && off === 0 && anchor.children.length === 0 }
c.hitStopBudget = [20, 60, 120].every((hz) => { const h = createHitStop(); h.trigger({ eventId: 'impact', participants: ['a', 'b'], hitStop: { strength: 0.7 } }); let a = 0, w = 0
  for (let i = 0; i < hz; i++) { const f = h.step(1 / hz); a += f.for('a'); w += f.for('bystander') } return Math.abs(a - (1 - HIT_STOP_DEFAULT_MS / 1000)) < 1e-10 && Math.abs(w - 1) < 1e-10 })
{ const h = createHitStop({ cameraKick: true }); let frozen = 0; h.trigger({ eventId: '1', participants: ['a'], hitStop: { durationMs: 500, dir: [2, 0, 0] } })
  const dup = h.trigger({ eventId: '1', participants: ['other'] }).accepted
  for (let i = 0; i < 10; i++) { if (i < 7) h.trigger({ eventId: String(i + 2), participants: ['a'], hitStop: { durationMs: 80 } }); const f = h.step(0.02); frozen += 0.02 - f.for('a') }
  c.hitStopCap150 = dup === false && Math.abs(frozen - 0.15) < 1e-10 }
process.exit(report('combat vendor (PR #25 cb0d93c)', c))
