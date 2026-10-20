# V-572 · Inventur der Licht-Meshes · R1 · WS1 · 20.10.2026

**Umfang:** gelesen über `origin/main` (c746a95), den Register-Branch (fa7e146), `ws1/combo-r2` (15d6727) und `ws1/r3f-frame` (6e87202), dazu die lokalen `src`-Ordner (`kfb-planet`, `kfb-planet-test`, `kfb-planet-t439`). Nichts geändert.

## Muss umgestellt werden (Pfütze bzw. Kegel als Mesh mit harter Kante)

| Quelle | Stelle | Problem | Einsatz |
|---|---|---|---|
| `RESIDENT_ATLAS_S17_1to1/lib/disco-ball-core.js` (kanonisch, Register; 6 byte-gleiche Kopien, Blob c68ef58) | Beam 53–70, 143–157, 331–338; Pool 159–170, 339–346 (`_h.y = P.floorY + 0.006`); floorCatch 210–213; Sweeps 219–232 | `CircleGeometry`-Pfützen auf fester Höhe; Kegel bis `floorY` geschnitten | RA-Lab (`disco-ensemble.js`) |
| `ufo-event-lab/ufo-lab.js` (2 Kopien, Blob f87fd42) | Kegel 201–203; Pool 279–281 (`y = 0.04`) | flache Pfütze auf fester Höhe, Kegel ohne Tiefen-Fade | Lab |
| `src/vendor/gem/kfb-gem.v1.js` (t439, test, combo-r2; = `GEM_R1`) | 640–648 | Pfütze `PlaneGeometry` flach am Laternenfuß, folgt dem Gelände nicht | **Spiel**: `modules/gemLanterns.js:38` (`pool:true`), `m1/M1World.jsx` |
| `globe-v13/natur-marken.js` (Travel-Globe) | Kegel 443–448, 530–536; Bodenschein 573–578 | Kegel ohne Tiefen-Fade (Pfütze misst die Höhe bereits) | Travel-Prototyp |
| `tinyskies-reference.mjs` | 34–36 | Leuchtturm-Kegel ohne Pfütze, feste Position | Lab/Referenz |

## Nicht betroffen
- God-Rays in `sky-atmosphere.js`: kein Bodenkontakt.
- `SpotLight`s ohne Mesh: Stage-Light `figure-light`, Vorhang-Labs.
- Schubfahne in `vehicleRig.js`.
- Bühnenscheibe in `StageShow.jsx`.
- PointLight-Discos (HUD-Rig, Graveyard).

## Nächster Schritt (Plan)
`kfb-light-pool.v1` mit Ablage in `CANON_3D/lib/`:
- **Pfützen:** Uniform-Array mit höchstens 16 Einträgen (Mitte, Radius, Farbe, Stärke, weiche Kante), projiziert im Empfänger-Material. Ein `onBeforeCompile`-Injektor für Knete und Terrain (gleiche Methode wie die Erdung in der Gelände-Probe).
- **Kegel:** Tiefen-Fade bzw. Soft-Particle. Die Szenentiefe wird gelesen, ein Kontakt-Fade über ca. 0,5 m sorgt dafür, dass keine harte Schnittlinie entsteht.
- **Umstellung:** zuerst `kfb-gem` (im Spiel), dann `disco-ball-core` (RA 1:1, nur Darstellung), dann das UFO-Lab.
- **Nachweis:** Disco auf welligem Terrain, vorher/nachher, die 4 Diagnose-Ansichten, danach der Kritiker.
