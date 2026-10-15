// M1 · Himmel = Skydome 4a als Modul nach Host-Vertrag R1.2 §2: create(options) -> { object3d, update(dt, ctx), dispose() }.
// Spender 1:1 (Modul-Inventur 4a): SKY3-Cut `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js` @90132835 (Blob 919ed27b),
// unverändert unter src/vendor/sky3/. Hülle laut Inventur: object3d = group, update mit follow(camera), dispose() ohne scene.
// Prozedurale Variante (Standard 'S', Modus 3 des Spenders): kein Netz-Laden. Die Kuppel hat fog:false und schreibt weder Nebel noch Licht;
// Licht, Nebel und Hintergrund besitzt der Host (Vertrag §1).
import * as THREE from 'three'
import { createSkydome } from '../vendor/sky3/skydome-shader.js'

export const skyLog = { create: 0, update: 0, dispose: 0 }

// options: { variant = 'S', mode = 3, radius = 1400, worldMix?, exposure? } – ohne Angabe gelten die Vorgaben des Spenders
export function createSky(options = {}) {
  skyLog.create++
  const { variant = 'S', mode = 3, radius = 1400, worldMix, exposure } = options
  const dome = createSkydome({ THREE, radius, variant, mode, worldMix, exposure })
  dome.group.name = 'm1-sky'
  return {
    object3d: dome.group,
    dome,
    update(dt, ctx) { skyLog.update++; dome.update(dt); if (ctx?.camera) dome.follow(ctx.camera) },
    horizonColor: () => dome.horizonColor(),
    info: () => ({ variant: dome.getVariant(), radius, exposure: dome.exposure }),
    dispose() { skyLog.dispose++; dome.dispose() },
  }
}
