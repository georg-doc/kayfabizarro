# Parität · Studio v18 → KFB ToolBox · Inventar
*26.09.2026 · Grundlage: `tools/KFB-ToolBox/stage-first/src/KFB FrankenStein Studio v18.dc.html` (V2CFG, gelesen) + `_handover/UI_CRITIQUE_REWORK_WS0_2026-09-15/STUDIO_V17_INVENTORY.md`.*
*Status gegen `KFB ToolBox Production-02.dc.html`.*

**Referenzdatei:** »KFB FrizzleBob Studio v13« liegt weder auf `main` noch in diesem Projekt. Die Linie ist belegt: v14 ist ein Fork von v13 mit zwei geänderten Zeilen (LIVING_frizzlegraft.md Z. 1810), danach FrankenStein v15 → v16 → v17 → v18. Deshalb ist **v18 die Referenz**. Falls in v13 etwas steckt, das später wieder rausflog: bitte die v13-Datei hochladen, dann ziehe ich den Diff.

Status: **HAVE** = in der ToolBox bedienbar · **PARTIAL** = teilweise · **MISSING** = Owner vorhanden, keine Bedienung · **OUT** = in v18 selbst nur Platzhalter.

## Face (v18 `gesicht` + `actor`) → Reiter **Rigging**
| v18 Abschnitt | Felder | ToolBox | Owner |
|---|---|---|---|
| Eyes | Pupil style · Spacing · Height · Eye size · Gaze drift · Pupil size · Gloss · Oval w/h/d/tilt · Lashes length/density/width | **HAVE** (+ Lid fit, Lidfarbe, Augapfel/Pupille aus v16 head zones) | EyeRig v6 · eyeoval.v1 · headzones.v1 |
| Original parts (v18) | Eyes / Brows / Nose / Mouth: Original ↔ Overlay | **HAVE** als »Source« je Teil (Rig · Painted · Off) + partrig-Platzierung der gemalten Braue/Nase/Mund | partrig.v1 |
| Brows | Form · Expression · symmetrisch · round · cap · lift · mask · thickness · length · taper · bend L/R · follow · height · x · y · tilt L/R · Tinte | **HAVE** (gezeichnet) · Carls gegraftete Braue am Driver: **MISSING** (Felder `brow.graft.*`) | brow-rig.v2 · facegraft.v1 |
| Nose | size · wide · tall · bulb · droop · height · depth · x · gloss · Farbe | **HAVE** · Carl-Nase am Driver: **MISSING** | pet-nose.v2 · facegraft.v1 |
| Moustache | Form · 14 Regler · Tinte | **HAVE** | pet-moustache.v1 |
| Mouth | Set · size · dy · dx · tilt · roll · width · lift · hug · bend · onTop | **HAVE** (+ Talk rate) · 26.09. auch auf Cube Pets gemountet (v18 `_mountMouth`) | pet-mouth.v1 |
| Visemes | 5 Formen + Zuordnung · 5 durchspielen · Default look · Grin/Pout · Ruhe-Mund (13 Decals) | **HAVE** (Rigging › Mouth; Face-Popover: Talk · Grin · Pout · 5 durchspielen) · Emote→Ruhe-Mund (`setRest`) kommt mit Emotes | pet-mouth.v1 |
| Eye turn (26.09., neu) | `eye.splay` −1…2 (innen … 45° außen … 90° seitlich) · `eye.inset` | **HAVE** · Werte außerhalb 0…1 liest nur face-mount; der gepinnte EyeRig klemmt sie beim Graft-Laden auf 0…1 | EyeRig v6 + face-mount |
| Lip-sync (26.09., neu) | Text → alle 13 Decals, DE/EN, ▶ All 13 | **HAVE** (über v18 hinaus; v18 hatte nur Talk-Shuffle + 5 Viseme) | lipsync-text.v1 + pet-mouth.v1 |
| Lids (26.09.) | Oberlid · Unterlid von unten · Slant · Δ links | **HAVE** als Schalen des EyeRig · Kapsel-Lider aus Blender: Briefing `handover/BLENDER_BRIEF_EYELIDS_HAIR.md` | EyeRig v6 emote |
| Hair (26.09., neu) | 3 Zacken · mit/ohne · Mitte/Seiten · 6 Regler · Farbe | **HAVE** auf FB Ear Rig v5 | hair-tufts.v1 ← FrizzleBob_Yellow.gltf |
| Eigene Augendrehung je Achse | Gegendrehen beim Wandern um den Kopf | **LATER** (Georg 26.09.) | EyeRig |
| Emotes | Expression-Chips · Gaze follows cursor | **MISSING** | EyeRig `applyEmote` · `setGazeFollow` |
| Asymmetry | Lid top/bottom · slant (Δ linkes Auge) | **MISSING** | EyeRig |
| Life | Idle life · drift · jitter | **MISSING** (läuft mit Vorgabe) | EyeRig `setLife` |
| Kinetics | Beschleunigung · Kurve · Fall | **MISSING** | EyeRig `setKinetics` |

## Body (v18 `koerper` + `pad`) → Reiter **Studio**
| v18 Abschnitt | ToolBox | Notiz |
|---|---|---|
| Material · Light · Color · Body contract · Ground plane (Cube-Pet) | **MISSING** | Pets laufen, aber ohne Look-Regler |
| Ground floor | **PARTIAL** | Stage-Presets, WorldBuilder-Himmel/-Licht |
| Biped · variant · weapon | **MISSING** Bedienung | Waffe hängt über graft-mount |
| Material zones (v16) | **MISSING** Bedienung | matzones.v1 läuft in der Graft-Kette |
| Head zones (v16) | **PARTIAL** | Augapfel/Pupille in Rigging; Gesicht/Kopf-Ton fehlt |
| GothGirl zones (v18) | **OUT** hier | GothGirl nicht im Roster |
| Card Rider (v16) | **PARTIAL** | Fit › CARD_SURF-Naht |
| Weapon · Handbetrieb | **MISSING** Bedienung | — |
| Seat · sitting pose | **HAVE** | Pose + IK auf der Bühne |
| Pad: anchors · base · audio · roll | **MISSING** | Klo-Rolli nicht im Roster |

## Motion (v18 `motion` + `anim`) → **Animation Lab**
| v18 Abschnitt | ToolBox |
|---|---|
| Clips · own clips · Abspielen | **HAVE** |
| Zuordnung 24 Zustände | **PARTIAL** (Rollen + 14 gemessene Locomotion-Rollen) |
| Sitzprobe · Badewanne | **MISSING** |
| Zählwerk · Datei-Export | **MISSING** |
| Driver contract §2b | **MISSING** |
| Motion tuning | **OUT** (auch in v18 Platzhalter) |

Georgs Ziel für diesen Reiter (UI und Ansicht aus Animation Lab v1): eigener Slice, hier nicht angefasst.

## Voice (v18 `voice` + `bubbles`)
| Abschnitt | ToolBox |
|---|---|
| Shaper · Tail · Shape bank | **MISSING** |
| Voice-Quelle | **OUT** (auch in v18 Platzhalter) |

**Georg 26.09.:** Die Sprechblasen brauchen ein Rework, mit und ohne KFB-Outline, damit sie zu den 3D-Figuren passen. Das ist ein Design-Slice und keine 1:1-Übernahme.

## Shell
| v18 | ToolBox |
|---|---|
| Messen-Reiter | **PARTIAL** (»…«-Panel: Quellen + Selbsttest) |
| Fußleiste »ohne Klick da« (Emotes · Viseme · Anim) | **MISSING** |
| File › Export dieses Pet · Auswahl · ganzer Satz · Laden | **PARTIAL** (Rigging › Export je Figur + Import) |
| Roster: Cube 24 · Graft · Carl · Klo-Rolli · Recherchi | Cube 24 + Graft **HAVE** · FB Ear Rig v5 **NEU** · Carl/Rolli/Recherchi **MISSING** |

## Vorgeschlagene Reihenfolge
1. **FACE-RIG-02**: Emotes, Asymmetry, Life und Kinetics, visemeMap, die Carl-Graft-Felder am Driver, Cube-Pets im Rigging-Reiter.
2. **FACE-RIG-03**: Rigging-Schnellweg (Georgs Idee für den dritten Reiter): ein beliebiges Asset wählen, dann Facehost, dann Augenrig setzen, dann Export.
3. **BODY-01**: Materialzonen, Kopfzonen-Töne, Variante und Waffe im Studio › Body.
4. **TB-PRODUCTION-04**: FrizzleBob-Kopf auf KayKit-Körpern.
5. **VOICE-01**: Blasen-Rework mit und ohne KFB-Outline.
6. **LAB-V1**: UI und Ansicht aus Animation Lab v1 im zweiten Reiter.
