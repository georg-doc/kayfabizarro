// V-632 · Spiel-Anbindung von kfb-groundfx.v1: EIN Satz Plätze für alle Boden-Lichteffekte (Laternen, Scheinwerfer, später Disco und Boombox-Ringe).
// Empfänger schließt M1World.LightPools an (Gelände, Weg, Laternen, Obstgarten, Fundstücke – dieselben wie vorher beim Lichtpfützen-Kit V-572);
// Besitzer holen sich ihren Kanal: GFX.channel('headlights' | 'lanterns' | 'disco' | 'boombox', { priority }).set(list). Fokus = Kamera, jedes Bild.
import * as THREE from 'three'
import { createGroundFx } from './kfb-groundfx.v1.js'
import { K } from '../m1/m1Scale.js'
import { WORLD_K } from '../worldScale.js'

export const GFX = createGroundFx(THREE, { max: 16, gridSize: 128 * K / WORLD_K, gridCells: 64 })   // Gitter ≈ 128 m um die Kamera (J17-Meter), Zelle 2 m
// Vorrang bei mehr als 16 Einträgen: Scheinwerfer (Spieler-Wagen) vor Laternen und Disco, Boombox-Ringe zuletzt
export const GFX_PRIORITY = Object.freeze({ headlights: 3, lanterns: 2, disco: 2, boombox: 1 })
export const gfxChannel = (owner) => GFX.channel(owner, { priority: GFX_PRIORITY[owner] ?? 0 })
