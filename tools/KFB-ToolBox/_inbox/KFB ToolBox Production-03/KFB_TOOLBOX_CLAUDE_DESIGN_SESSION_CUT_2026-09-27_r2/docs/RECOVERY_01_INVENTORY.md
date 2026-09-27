# RECOVERY-01 · Vorgänger → ToolBox · Inventar und Lückenliste
*27.09.2026 · Stand geprüft gegen `KFB ToolBox Production-03.dc.html` (Kopie von 02 plus die Fixes unten).*
*Repo-Abgleich: `georg-doc/kayfabizarro@2be8d874` (main, 27.09. 16:27 UTC). Der Cut 27.09. r1 liegt dort unter `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-02-2/`, also eingecheckt.*

Status: **HAVE** gleichwertig · **MOVED** in einem anderen Reiter · **SCHWUND** schlechter als vorher · **MISSING** fehlt · **OUT** bewusst raus / auch vorher nur Platzhalter · **FIX 03** in Production-03 behoben.
Prio: **P0** blockiert die Arbeit · **P1** nächster Slice · **P2** später.

## Quellen (Zeilen = Datei im Projekt)
- Studio v18: `tools/KFB-ToolBox/stage-first/src/KFB FrankenStein Studio v18.dc.html` (V2CFG Z. 595–741, V2CFG_BIPED 560–594, V2BOTTOM 742). **Auf `main` nicht mehr vorhanden**, nur hier im Projekt.
- Animation Lab v3: `tools/KFB-ToolBox/stage-first/src/KFB Animation Lab v3.dc.html` (Kopfleiste Z. 55–88, Figurenliste 94–110, Ansichten 118–123, Inventar 127–150, Data/Vertrag 152–235, Transport 240–285). Auf `main` fehlt v3; dort liegt nur v2 standalone (`KFB ToolBox (studio v17 - rigging v1 - animation v2)/WSA_2026-09-13/`).
- Animation Lab v1: von Georg hochgeladen 27.09. → `uploads/KFB Animation Lab v1.dc.html` (982 Z.). Gemessen: jede Methode und jedes Label aus v1 steckt auch in v3; v3 hat 30 Methoden mehr (Vertrag, Inventar, FX, Waffe, Gesicht). Die v3-Tabelle unten deckt v1 damit ab. v1 »Work · Stage« (Z. 923) = ToolBox ▥ Inspektor ein/aus → MOVED.
- »Patch-Studio« = Pet Studio v12 (WS0) (Georg 27.09.): `skills/KFB PetStudio/KFB Pet Studio v12 (WS0)/session-export_petstudio-v12_2026-09-10/code/petstudio-v9/KFB Pet Studio v12.dc.html` @main. Gemessen: alle 31 Abschnitte (Z. 421–540) stehen gleichnamig in v18; v18 hat 8 mehr (Original parts, Material-/Kopf-/GothGirl-Zonen, Card Rider, Waffe, Sitzpose, Anim-Zählwerk). Die v18-Tabelle deckt v12 damit ab.
- ToolBox: `KFB ToolBox Production-03.dc.html` (RIG_PARTS Z. 748, `_padGroups` 2113, `_rigRows` 2349, Studio-Reiter 288–480, Anim-Dock 172–232).

## Regressen, analysiert
| Befund | Ursache (gemessen) | Stand |
|---|---|---|
| Viseme fehlen (Rigging › Mouth) | FB Ear Rig v5 startet mit Source »Model mesh«. Der ganze Visem-Block hing an `mode === 'rig'` (02 Z. 2416), sichtbar war nur ein Erklärtext. | **FIX 03**: Viseme · Form je Visem · Play all 5 · Default look · Grin/Pout auch bei Model mesh; Rest-Decals bleiben beim gemalten Rig. Selbsttest 21c. |
| Palette überdeckt die Bühne | Dock und Inspektor lagen `position:absolute` über `#kfb-stage` (inset 0). Die Figur stand unter dem Dock. | **FIX 03**: Bühne endet links vom Inspektor und über dem Dock (gemessen alle 10 Frames), Kamera rahmt neu. Anim-Reiter rahmt beim Betreten die ganze Figur. |
| Zu viel Metatext | Notizen, Owner-Pfade, Roadmap standen immer da. | **FIX 03**: Schalter **Notes** (aus als Vorgabe, gemerkt). Aus = Notizen über 60 Zeichen, Owner-Zeile, »Studio owners« und Face-Fußzeile weg. Status-Zeilen (✓/✕) bleiben. |
| **»Zu« lässt den Mund verschwinden** | Zu → `visemeMap.closed = 'm'` (pet-mouth.v1 Z. 89). Das M-Decal ist hautfarbene geschlossene Lippe mit dünner Falte ohne Tuschelinie (274×169 px, nur 113 px mit Alpha > 160). Bei Model mesh wird beim Sprechen der Modellmund versteckt und das Decal gezeigt; auf Bühnenabstand ist die Falte ≈ 1 px → liest sich als »kein Mund«. Nahaufnahme zeigt die Lippe korrekt (`export/_tmp/01-zu-mouthcam.jpg`). Code arbeitet wie v18 (gleiche Zuordnung, gleiches Decal). | **FIX 03** (Georg 27.09.: Zu → Neutral): ToolBox-Look `TB_VISEME_LOOK = { closed: 'neutral' }`; nur die unberührte Owner-Vorgabe `m` wird umgestellt, eigene Wahl in »Shape for Zu« bleibt. Default look = Owner-Map + diese Zeile. Selbsttest 21d. |
| Clay-Lider Test 27 | Zwei Ursachen. (1) Test: suchte das Volumen UNTER `_lids`; clay-lids.v1 Z. 156 hängt `kfb-lid-fit › kfb-lid-tilt` NEBEN die Lid-Gruppe. (2) Echter Befund: `clay.sync` lief VOR `rig.update` (Vertrag Z. 183 sagt danach) → im Selbsttest-Takt zeigte EyeRig die alten Schalen wieder. | **FIX 03**: sync nach rig.update + sauberem Slant (`_postRig`), Test prüft den richtigen Träger. 33/33 |
| Mundregler ≈ 120 ms | Gemessen: `wrapMouthToSkin` 67 ms (52 Strahlen gegen den ganzen gebackenen Kopf, 12 544 Dreiecke), refit 11 ms. | **FIX 03** (face-mount.v1): Strahlen testen nur ein Hautstück um den Mund (3 738 Dreiecke, Weltmaß aus den echten Mund-Ecken, Neubau beim Verschieben/Wachsen, < 90 % Treffer → voller Kopf). wrap 12 ms, Regler 14–29 ms statt 105–130 ms, 52/52 Treffer. |

**Zu:** entschieden auf (b) Neutral. Verworfen: Shader-Kontrast und beleuchtetes Material (verfälschen die übrigen 12 Formen), Modellmund (Zahngrinsen, nicht geschlossen).

## Studio (v18 `koerper` · `gesicht` · `actor` · `pad`) → ToolBox Studio / Rigging
| v18 (Zeile) | ToolBox 03 | Status | Prio |
|---|---|---|---|
| Eyes, alle Regler (631) | Rigging › Eyes | HAVE (+ splay, Lid fit) | — |
| Original parts (651) | Source je Teil | HAVE | — |
| Brows (652) · Nose (654) · Moustache (656) | Rigging | HAVE · **FIX 03**: lange Labels gekürzt (voller Text als Tooltip, mit Notes ausgeschrieben) | — |
| Emotes · Gaze follows (657) | Rigging › Eyes + Dock | HAVE | — |
| Emote-Werte je Ausdruck speichern | Rigging › Eyes › Emotes: »Save lids as X« · »Back to contract« · ★ markiert, Export/Import `emotes` | **FIX 03** · Selbsttest 26b | — |
| Mouth, 11 Regler (660) | Rigging › Mouth | HAVE | — |
| Visemes 5 + Zuordnung (685, `_visemeRows` 5432) | Rigging › Mouth, jetzt auch Model mesh | **FIX 03** | — |
| Visemes im Studio › Face | 5 Knöpfe + »Shape for X« (13 Decals) + Sets + Grin/Pout/Play 5 | **FIX 03** | — |
| Asymmetry (688) · Life (692) · Kinetics (696) | Rigging › Eyes | HAVE | — |
| Skeptisch-Preset | — | MISSING | P2 |
| Abschnitte aufklappbar, Kopf klebt (V2OPEN0 751) | Rigging: Köpfe klappen, kleben oben, »Fold all / Open all«, gemerkt je Teil | **FIX 03** | — |
| Erklärtexte-Schalter (4183) | Notes-Schalter | **FIX 03** | — |
| Untere Leiste ohne Klick (742) | Dock Emotes · Viseme · Anim | HAVE | — |
| Material Kenney/Clay/Cel (606) · Color (618) | — | MISSING | P1 (BODY-02) |
| Light Mood/Azimut/Höhe/Rim (582) | Stage-Presets, Sonne fest | SCHWUND | P1 |
| Body contract (624) · Ground plane (627) · Boden (587) | Body-Fakten, Schatten-Rezept | SCHWUND | P2 |
| Material zones (564) · Head zones (568) | Graft-Kette ohne Bedienung · Teilfarben | MISSING / SCHWUND | P1 |
| Card Rider (575) | Studio › Fit | HAVE | — |
| Weapon (578) | Legacy held item | SCHWUND | P2 |
| Seat pose (581) | Studio › Pose + IK | HAVE (besser) | — |
| Pad (720) · Klo-Rolli | — | MISSING | P2 |
| File-Menü: Satz / Auswahl exportieren | eine Figur | SCHWUND | P2 |
| Voice / Bubbles (712–719) | — | MISSING (Rework = eigener Design-Slice) | P2 |
| Messen-Reiter | »…«-Panel | MOVED | — |

## Animation Lab v3 → ToolBox Animation Studio
| Lab v3 (Zeile) | ToolBox 03 | Status | Prio |
|---|---|---|---|
| Bühne frei, Leisten darunter (Layout 90–285) | Bühne über dem Dock | **FIX 03** | — |
| Ansichten Front · Side · ¾ · Back · Reframe · Grid (118, 1378) | alle sechs im Anim-Reiter | **FIX 03** | — |
| Transport Restart · ±1/30 s · Play · Tempo · Loop (1384–1389) | ⏮ · Play · ±Frame · Loop · Speed | **FIX 03** | — |
| Scrub (254) | Spur mit Fußkontakt-Bändern | HAVE (besser) | — |
| Clip-Leiste immer sichtbar + Familienfilter (260–285) | Leiste + Filter im Dock, Popover mit Suche bleibt | **FIX 03** | — |
| Inventar · animierter Kontaktbogen aller Clips (127–150) | **Sheet**: Clips der Dock-Gruppe (max. 48), je 4 Frames als Loop, Klick spielt | **FIX 03** | — |
| Move · Locomotion fahren: Chain · Full · Trail · Follow · Reset (1396–1400) | Lab › Loco: Idle→Sprint→Idle · Jump chain · Jump full · Trail · Stop (= Reset), Kamera folgt | **FIX 03** (kein freies Steuern per Taste, wie v3 auch nicht) | — |
| Strip · 8-Frame-Beleg (76) | Clip › Strip · 8 frames, auf die Figur zugeschnitten, PNG-Download | **FIX 03** | — |
| Batch · Audit (77–78) | Quellen-Panel zählt | SCHWUND | P2 |
| M+L Cross-Rig-Proben · FIT (62–63) | — | MISSING | P2 |
| Waffe · FX Mündung/Spur/Treffer (65, 84) | — | MISSING | P2 (VFX-Slice) |
| Talk · Blick · Emotes (79–83) | Dock | HAVE | — |
| Data · Messwerte (152–180) | Clip-Details | HAVE | — |
| Vertrag: Pet-ID, Clip-Overrides, Locomotion-Parameter, Sync → Studio, Export/Import, Test (181–235) | Rollen + Motion Profile · Export · **Import** · Zustands-Overrides (States › »Use … for X«, ★) | **FIX 03** · Selbsttest 21f | — |
| Zählwerk · 24 Zustände (v18 598–604) | Lab › **States**: Owner `kfb-lib/anim-map.v1.js` (1:1 aus FrankenStein v16), zählt die echten Clips je KayKit-Set, Klick spielt, Export Map JSON + MISSING.md. FB Ear Rig v5: ✓ 10 · ≈ 8 · ƒ 5 · ✗ 1 (Dance) | **FIX 03** · Selbsttest 21e | — |
| Dunkles Thema | Paper | OUT | — |

## Nachzieh-Reihenfolge
1. ~~LAB-R1 (P0)~~ erledigt in 03.
2. ~~UI-R1~~ erledigt in 03.
3. ~~LAB-R2~~ erledigt in 03 (Strip · 24 Zustände · Motion Export/Import · Overrides · Sheet · Trail · Jump chain/full · Grid).
4. ~~FACE-R1~~ erledigt in 03 (Emote-Werte · Clay-Test 27 · Mundregler-Latenz).
5. **BODY-02 (P1):** Material/Color/Light-Mood · Material- und Kopfzonen.
6. P2: Pad/Rolli · Satz-Export · Voice/Bubbles · Cross-Rig · Waffe/FX.

## Webcheck
Beides gemacht: Repo gelesen (oben) und im Browser geprüft: Zu/Offen/Talk auf FB Ear Rig v5 mit Probe (`export/_tmp/probe-zu*.jpg`, `zu-mouthcam`), Rigging › Mouth und Anim-Reiter in 03 (`export/_tmp/0?-p03-a.jpg`). Die übrigen HAVE-Zeilen sind aus dem Code belegt, nicht einzeln geklickt.
