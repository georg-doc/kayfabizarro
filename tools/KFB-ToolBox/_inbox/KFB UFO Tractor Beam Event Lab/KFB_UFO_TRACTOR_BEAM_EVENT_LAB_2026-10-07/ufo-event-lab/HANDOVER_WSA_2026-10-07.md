# HANDOVER · WSA · KFB UFO Tractor Beam Event Lab · 2026-10-07

**Für:** Work/WSA Architecture Freeze
**Von:** Claude Design (isoliertes Event Lab, r2)
**Status:** isolierter Beweis, nicht integriert. Keine Open-World-Writes, keine Persistenz, kein Merge, keine Live-Promotion. PR #348 unberührt.

## 1 · Was das ist
Ein eigenständiges Lab, das ein UFO-Abduction-Event in drei Zielgrößen vollständig abspielt: Prop, Resident/Cube-Pet, Burg. Ablauf: Anflug → Schweben → Lock → Aufladen → Knet-Dematerialisierung → Partikelsog ins UFO → Schlucken → optional Rückgabe → Abflug. Dazu kommen neun semantische Hooks mit Audio-Vorschlag.
Das Event ist eine reine Funktion der Zeit `t`. Es lässt sich frei scrubben, ist geseedet und hat kein Zufallsflimmern pro Frame. Damit ist es deterministisch und netzwerk- bzw. replay-tauglich, sobald der Runtime-Owner die Uhr hält.

## 2 · Was in die Runtime übernommen werden soll und was nicht
| Übernehmen (Vertrag) | Ersetzbar (Darstellung) |
|---|---|
| Phasen, Dauern, Hooks, Event-Namen → `EVENT_CONTRACT.json` | three.js-Szene, Kamera, Licht, Boden |
| Zielklassen-Zahlen `CLS` (Dd, Ft, Partikel, Lift, Drall, Schwebehöhe) | Clay-Proxies (Pet/Burg/Prop sind Platzhalter) |
| Beam-Geometrie-Regel (Emitter am Rumpf, Fuß aus Zielgröße + Länge) | Beam-Shader, Glow-Sprite, Pfütze |
| Grammatik: Schwellwert-Front von oben/außen, Partikel-Trichter mit Drall, Rückgabe = Umkehrung | Preview-AudioContext (`ufo-audio.js`) |
| UFO-Rig-Hierarchie root → body → spin → model, Modell austauschbar | Lab-UI (Panel, Timeline, Audio-Inspektor) |

## 3 · Code-Karte
```
KFB UFO Tractor Beam Event Lab.dc.html   UI-Shell: Panel, Timeline, Audio-Inspektor, Tweaks (beamTint, density, seed, startTarget)
                                         lädt ufo-lab.js per dynamic import, three@0.170.0 per Import Map (CDN)
ufo-event-lab/ufo-lab.js                 Szene + Event. Datei-Header = Modulkarte. Öffentliche API: mount(host, opts) → api
ufo-event-lab/ufo-audio.js               nur Vorschau-Audio: Shortlist-Pool (55 Dateien @ Pin), Messung, Event-Map, JSON-Export
support.js                               Design-Component-Runtime (nur für das Lab, nicht für die Runtime)
```
API (`window.__ufoLab` im Lab): `play · pause · toggle · restart · seek(t) · seekFrac(f) · setSpeed · setTarget(prop|pet|castle) · setEnding(return|keep) · setBeam(shader|kenney) · setUfo(rick|ka|kb|kc|kd) · setView(event|sources) · reframe · setTint · setDensity · setSeed · setAudio · audio.exportMap() · dispose`

## 4 · Quellen (alle gepinnt, Laufzeitladung, keine Kopien)
- Rick's UFO (primär, Georg): `media/3D_Assets/KFB/ricks ufo by eeee - q6vNUoHZXr.glb` @ `276728f3f82f729cd1656b61e81d278856d736bb`
- Kenney Tower Defense UFO A–D + beam + beam-burst @ `378b209355b13304e3cff656ec0806ca5b89df28`
- Audio-Shortlist @ `d04e0b8f2c2c34e9176f7eb75a77f19487d17698`
- Laden über jsDelivr, Fallback raw.githubusercontent. **Das Lab braucht Netz.**

## 5 · Stand r2 (07.10.2026)
Der Beam ist überarbeitet: echter Kegel, Emitter im Rumpf, folgt Neigung und Stauchung. Bodenring, innerer Beam und Torus-Puff sind entfernt. Kenney-Beam hat nur noch eine Hülle. Details stehen in `CHANGELOG.md`, Belege in `screens/r2/`.
Georgs Reaktion auf r2: „top!“. Ein formales PASS/TUNE/FAIL für das Gesamt-Event steht noch aus.

## 6 · Offen
**Vor dem Freeze (Georg)**
1. PASS / TUNE / FAIL für r2.
2. Audio per Gehör abnehmen (Pet + Burg mit Ton) und die Event-Map als JSON exportieren. Bisher ist alles nur Vorschlag, nichts ist gehört.

**Entscheidungen für den Freeze (WSA)**
3. Owner der Event-Uhr: World-Event-System oder UFO-Actor.
4. Zielzustände und Eignung: nicht verfügbar / gelockt / transferiert / zurückgegeben. Transfer ≠ Zerstörung.
5. Verbleib des Objekts bei „Mitnehmen“ (Inventar, Registry, Despawn).
6. Audio-Routing über den KFB-Audio-Owner. Die Hooks sind stabil, die Dateiwahl ist offen.
7. Gemeinsamer Beam Emitter für Tractor / Destruction / Terraform (Vorschlag in `BRIEF.md` · Ausblick).

**Vor der Integration (Technik)**
8. Echte Assets für Resident/Cube-Pet und Burg, mit Source-Isolation-Gate vorher.
9. Rick's UFO: 32 Materialien = 32 Draw Calls. Zusammenführen bzw. Atlas.
10. Lizenz und Herkunft von „ricks ufo by eeee“ prüfen.
11. fps in einem sichtbaren Top-Level-Tab messen (Burg: bis zu 3.400 Instanzen, 2 Draw Calls).
12. Clay-Material: Der K2-Owner `clay-material.v10.js` ist nicht konsumiert, im Lab ist es ein Stand-in.
13. Bei Kenney-Modellen kann der Emitter-Raycast eine andere Höhe treffen. Visuell prüfen, wenn ein neues UFO-Modell dazukommt.

**Später**
14. Destruction / Terraforming Beam auf derselben Rig-/Beam-Schicht, mit Seed-World-Destruction-Logik.
15. Abwurf absurder Fracht (V2, `spaceTrash*` reserviert).

## 7 · Nächstes Gate
Georg: PASS r2 + exportierte Audio-Map → Coworker exact RETURN → **Work/WSA Architecture Freeze** (Punkte 3–7) → expliziter UFO-Integrations-Slice.
