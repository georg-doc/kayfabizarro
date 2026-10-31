# Lichtkegel, UFO, großer Wannen-Fahrer · Rückgabe an WS0 · 31.10.2026 (AFK-Plan V-1083)
Branch `game/ufo-licht-r1` von `game/integration-r2` @a119e385. Merge mit Georg. Schalter: `ufo=1`, `ufoauto=<s>`, `lightcone=1`, `tub=1`.

**Bestand Lichtkegel:**
| Nutzer | Vorher | Jetzt |
|---|---|---|
| Scheinwerfer | kfb-headbeam + groundfx beam2 | unverändert, schon dieselben zwei Bausteine |
| Laternen | groundfx cone | unverändert |
| Disco | eigener makeBeam-Kegel + groundfx cone | mit `lightcone=1` Volumen aus dem Modul |
| MiB-Tür | echte SpotLight + flacher Teppich | mit `lightcone=1` Projektion aufs Gelände, keine Lampe |
| MiB-Zielstrahl | headbeam ohne Bodenfleck | mit `lightcone=1` übers Modul, mit Fleck |
| UFO-Strahl | neu | immer übers Modul |
Modul: `src/look/lightCone.js`. Startvorhang und Laternen-Practicals behalten echte Lichter, sie waren nicht Teil des Auftrags.

**UFO:** `src/npc/ufoEvent.js`. Phasen, Bewegung, Zahlen aus dem Lab r2, Ende „keep“: erntet Fluff über fluffSuck. Regeln V-637 über `src/npc/worldEventGate.js`, gilt auch für MiB. Modell B34 r4 wie N38; Modul-Spitze 1,0 ms. Einfacher Kegel statt Lab-Shader mit Bändern, weil alles über ein Modul läuft.

**Große Fahrer:** verdrahtet, Clip je Rig, Lenkrad, Wanne 1,04. Nicht im Spiel getestet: Im Register ist keine große Figur spielbar.

**Offen:** Wannen-Einstieg r7c/r7d von WSB noch nicht eingebaut (kein Auftrag). Disco nur als Standbild geprüft. Hunky und Dory fehlen im UFO noch. Das UFO-Modell ist 15 MB groß.

## Wanne, Zusatz · Aufnahmen `Wanne_Sprung.mp4`, `Wanne_Sprung_Nahbilder.jpg`, `Wanne_im_Faecher.jpg`
Wanne steht im Fächer und in der V-Taste, ohne Schalter, solange die Datei da ist. Düse und Fahne über vehicleRig und dustTrail wie alle Wagen. Sprung hinein und heraus r7c/r7d, Zeitplan für Ohren und Ton.
Offen: Fächer-Icon fehlt (zeigt „BK“ wie der Mech). Fahrzeug-Stauchen beim Landen (`vehicle_squash`) nicht verdrahtet, das Dach kennt es im Spiel auch nicht. Large im Spiel nicht getestet.

## UFO HD R1 · @b7b0c994 · Aufnahmen `UFO_Ereignis.mp4`, `UFO_Ablauf.jpg`, `UFO_Spielkamera.jpg`, `UFO_von_oben.jpg`, `UFO_Hunky_Dory_Nah.jpg`, `UFO_Strahl.jpg`
Stand: `game/integration-r2` @3cb168d6 eingemischt. Schalter weiter `ufo=1`, `lightcone=1`, `ufoauto=<s>`.
**Fertig:** Modell `KFB_UFO_HD.r1.glb` (sha 82a2f91c passt), Kuppel mit Schnittebene aus dem Vertrag, Ursprung Bodenplatte. Lage, Neigung, Strahl und alle Figuren-Clips aus `ufo_event_pet_keep.motion.json`, keine Clips fehlen. Hunky und Dory auf ihren Standpunkten, geknetet. Strahl über das Kegel-Modul mit neuer Option `bands`, Scheinwerfer unverändert.
**Laden:** Im Site-Build eigene Datei, nicht in `index.html` und nicht vorgeladen; statisch geprüft, nicht im Netzwerk gemessen. Status vor dem Ereignis IDLE, Modell nicht in der Szene.

**Offen:**
1. **Hänger beim ersten Ereignis je Sitzung:** 1,5 bis 2,8 s mit warmem Browser-Speicher, 6,4 s kalt nach frischem Build (Einzeldatei-Build, Testrechner). Shader und Texturen werden schon vorbereitet, das reicht nicht. Größte Posten: Textur-Upload, Blob-Erzeugung der GLB-Bilder, Lidhaut und Normalen der zwei Figuren. Nicht gelöst.
2. **Hunky und Dory aus der Spielkamera:** vom Boden nicht lesbar, der Rumpf verdeckt sie. Lesbar nur von oben oder aus der Nähe (`UFO_von_oben.jpg` ist eine Prüfkamera, keine Spielkamera). Aus Flughöhe im Spiel nicht aufgenommen.
3. **Mund fehlt:** Beide Köpfe ohne Mund, `headpartActor` hat den Mund-Schritt noch nicht (Karte: mouth decal-set). Augen da.
4. **Kosten:** Ereignis im Mittel 4,5 ms je Bild, Spitzen 28 bis 62 ms (MiB: 3,1 ms). Gesichter werden ab 14 m nur jedes vierte Bild aktualisiert.
5. **Bänder** sind schwach sichtbar, Formel wie im Lab, Stärke leicht erhöht.
6. **Build in anderen Worktrees:** `@fontsource/bangers` und `fredoka` (HUD v6 R3) fehlen im gemeinsamen `kfb-mvp/node_modules`. Ich habe sie nur in `flight-wt` gelegt; alle anderen Worktrees brechen nach dem Merge beim Build ab.
Icon `bathtub_kart` von WSB noch nicht eingebaut (läuft über WS0).

Tests: `terrain-seams` PASS, `fb-canon` PASS, `hud-3d` FAIL an bekannter Stelle (test/hud-3d.mjs:46, auch auf sauberem Stand).

## Nachtrag Wanne und Flug-Rücken · Aufnahmen `Wanne_Ausstieg_Bremsen.mp4`, `Wanne_Icon_Faecher_HUD3D.jpg`, `Wanne_Icon_Faecher_HUDv6.jpg`, `Flug_SpaceRanger.mp4`, `Flug_MechWings.mp4`, `Flug_Ruecken_am_Boden.jpg`, `Flug_Ruecken_im_Flug.jpg`
**Ausstieg:** Die Wanne bremst ohne Eingabe bis zum Stand, dann springt FrizzleBob; spätestens nach 2,5 s auch in der Luft oder am Hang. In der Aufnahme von 114 km/h auf 0.
**Icon:** `TUB_R6/out/icon_r1b/bathtub_kart.png` in HUD 3D und HUD v6. In v6 zeigte der Fächer nur sechs Plätze, jetzt sieben.
**Flug-Rücken:** `jetvar=spaceranger`, `jetvar=mechwings`, Sitz und Anker aus Vertrag r2, Flamme und Rauch wie die Rakete. `flight_roll_reaction` wird in keiner Variante abgespielt, roll läuft über `flight_cruise`. Bei den Flügeln verschmelzen die beiden Flammen zu einer breiten hellen Form mit runden Enden.
**Befund Licht:** FrizzleBob wirkt dunkel oliv, wenn die Kamera auf die sonnenabgewandte Seite schaut. Das ist kein Wannen-Fehler: Abschalten der Schatten ändert nichts, zu Fuß ist es genauso (`FB_Gegenlicht_zu_Fuss.jpg`). In den Wannen- und Flugaufnahmen fällt es auf. Licht nicht angefasst.

## Nachtrag Hänger und Mund · `UFO_Ereignis.mp4` und `UFO_Ablauf.jpg` neu (Aufnahme beginnt vor dem Vorlauf)
**Hänger behoben (Punkt 1 oben ist erledigt):** Das Ereignis startet erst, wenn Modell und Shader fertig sind. Figuren, Knete, Texturen, Shader, Geometrie und Schatten kommen einzeln über mehrere Bilder, unsichtbar im Bildtakt. Der Platz vor dem Spieler wird erst danach gewählt. Längster Aussetzer jetzt 0,25 bis 0,28 s statt bis 6,4 s, auch im ersten Lauf nach frischem Build; dieser eine Rest ist das Auspacken der Datei im Einzeldatei-Build, nicht im Site-Build gemessen. Sonst bleibt alles unter 0,2 s. Vorlauf 5 bis 9 s auf dem Testrechner. Normaler Auslöser `ufoauto` läuft bis zum Ende.
Während des Ereignisses unverändert: im Mittel 4,4 ms je Bild, Spitzen bis 69 ms.

**Mund: Lücke, nicht eingebaut.** Die Karten verlangen die von Georg freigegebenen Mund-Sets (Hunky A, Dory B, Anker `KFB_Mouth_anchor`). `headpartActor` hat dafür keinen Weg, die Bilder liegen nicht im Spiel-Repo, und der vorhandene Mund-Code hängt am FrizzleBob-Gesicht. Das wäre ein eigener Baustein mit Abnahme und betrifft Hunky und Dory überall im Spiel.
