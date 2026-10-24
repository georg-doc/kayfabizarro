# Übergabe MVP WS1 → WS0 · R1 · Stand 24.10.2026 (Ziel Do 29.10.)
Was WS0 braucht, um das MVP ohne WS1-Chatverlauf weiterzuführen. Logbuch: `WS1_STATUS.md` (neueste oben). Übernahmekarten: `sessions/*.md`.

## 1 · Wo was liegt
- **Arbeitsstand:** `kfb-planet` Zweig `ws1/mvp-r1` (Worktree `~/kfb-ws1/kfb-planet-mvp`). Merges aus den Teilsitzungen nur über den Lead. Nach `main` nur mit Georg.
- **Site-Stand:** `KFB-Stunt-Car-Race` `game/mvp-r1` (siehe `sessions/site.md`).
- **Öffentlicher Spiegel:** kayfabizarro `ws1/mvp-r1`.
- **Abnahme-Seite für Georg:** https://claude.ai/artifact/HVwr3YSWy1MFfSEyLCrFi6 (nur Live-Stand, A/B startet auf NEU).
- **Sitzungen:** `sessions/lead.md`, `ws1b`, `ws1c`, `ws1d`, `ws1e`, `ws-npc`, `ws-audio`, `deck-songs`, `site` (Deck-Analyzer folgt).

## 2 · Was im Spiel Standard ist (Georg-Urteile)
- Gelände-Look R3 (`look=terrain3` im Site-Hash), Welt `world=probe`, Fallobst/Ernte (`harvest`).
- Knet-HUD (`hud=clay`); das neue HUD 3D nur hinter `hud=3d` (Richtung abgenommen 24.10., Nacharbeit bei WS1e).
- Racer: Originaltexturen, Knet-Zusätze; Scheinwerfer als langer Kegel (`hlt=cone`); Leucht-Flamme (die gezähmte nur `glow=v2`); Racer-Schatten als vereinfachter Proxy (`rshadow=full` = voller Schatten); Schattenschnitt an (`scull=0` aus).
- Staubfahne neu (`dust3=0` = alt); Figuren nachts heller mit Mondschatten (`figamb=0` = alt).
- Sprechblasen nach SSOT mit mehr Luft (`lines=alt` und `bubblepad=old` = alt); Tratsch-Trio nur `lines=tr1` (Urteil offen).
- Ruf-Skala V-712 in Tratsch und Spieler-Zurufen; Disco-MC Talkbox.
- Gesamt-Fluff im Spielstand (`fluffTotal`, nie kleiner als die Kugeln).
- Geparkt: Umriss (`outline=1`). Alte Startseite nur `start`.

## 3 · Prüfen
- `npm run build`, dann die Reihe: `npm test` plus floatingProps, ssotStage, combat, audio, audio-remote, greet, band, chatter, hud-3d, hud-clay, `vehicles-r1 data|start` (alle mit `PW_GPU=1`, Test-Slot `~/kfb-ws1/bin/kfb-slot`). NPC-Reihe: `test/npc-suite.sh`.
- Letzter Stand: 75 PASS (mvp 2e299e1). Bekannte Altfehler: `c2` (pupilZeroWhenClosed), `c3g` (Laternen), `orbit` gelegentlich (Nachlauf grün), `drift` braucht eine lokale Ausgabe.
- `contract-static`: Eine Datei mit `object3d` + `dispose(` zählt als Modul.

## 4 · Offen bei Georg (Stand 24.10.)
- Ebene-Relief für Stadtzonen bei der Weltgenerierung (Konzept R1.5 §5.10; Lead empfiehlt ja).
- Tratsch-Trio `lines=tr1` als Standard?
- Neue Satz-Opener (Deck-Songs).
- Kit-Knete Stufe 0/1/2 (WS-NPC); Wasser R2 ja/nein (WS1c); Käfer-Scheinwerfer 40-%-Option (WS1d).

## 5 · Laufend bei Übergabe
- **WS-Audio + WS-NPC:** Chatter-Silben R1 (Georg-GO 24.10.: Silben-Laute aus vorhandenen Clips, Satzmelodie aus dem Satzzeichen, Blase zu jedem Laut), hinter `chat=syl`.
- **WS1e:** HUD-Nacharbeit (Ton-Knopf ohne Tangente, Flucht, Icons wie die Blase, Truhe größer, Info ins Zahnrad, Tempo-Leiste), danach Paket 4 (Flyouts, `goals()`/`setGoal()`).
- **WS1b:** Konzept Prozedurale Welt R1.6 (Stadt-Baukasten, Höhenmuster) bis Mi.
- **Deck-Analyzer:** Pilot und Übernahmekarte.
- **WSB über WS0:** Kassette r5 und `controlTheme` nach `assets/private` (fehlt, §165); HUD-Fassung der Kassette.

## 6 · Schalter (aus dem Code gezogen, `src/` ohne vendor)
Kommentar = Text am Schalter im Code; wo keiner steht, ist es markiert. Testschalter (`norender`, `nodraw`, `nobar`, `perf`, `clean`, `debug`) dienen nur den Prüfungen.

| Schalter | Fundstelle | Kommentar im Code (gekürzt) |
|---|---|---|
| `amph=full` | m1/M1World.jsx:153 | Vergleich mit dem Original (349 k Dreiecke) |
| `assist=off` | m2/M2Car.jsx:111 | Fahrhilfe M3 aus (V-379) |
| `band` | m1/M1World.jsx:177 | Verweis auf ~/kfb-ws1/private-assets, flacher Klon von assets/private); sonst Platzhalter. Nichts davon gehört ins Repo. |
| `bubblepad=old` | bubbleLayer.js:32 | alter Blasen-Abstand (vor mvp 9ed1ab6) |
| `calm=` | look/terrain3.js:14 | Hash calm=0 = ungedämpft wie die Probe (Vergleich für Georg), calm=0.5 halb. |
| `cas=old/new` | HudClay.jsx:53 | HUD 3D: Kassette alt/neu (A/B) |
| `clay=0` | Stage.jsx:189 (+1) | Knet: mit L1 Standard für alle Figuren (V-346), clay=1 nur KayKit, clay=0 aus. Figuren-Samt ≤ 0,05 (Regel 1, gegen den hellen Saum) |
| `clay=0/1` | Stage.jsx:190 | – (kein Kommentar im Code) |
| `clay=1/all` | Stage.jsx:189 | Knet: mit L1 Standard für alle Figuren (V-346), clay=1 nur KayKit, clay=0 aus. Figuren-Samt ≤ 0,05 (Regel 1, gegen den hellen Saum) |
| `clay=all` | Stage.jsx:190 | – (kein Kommentar im Code) |
| `clean` | debug.js:7 | Importe sehen den neuen Wert sofort; wer Text schon gezeichnet hat, hört auf onDevUi. Wert = „clean“ ? immer aus : gespeicherte Wahl ?? Testmodus. |
| `comfort` | m1/M1Player.jsx:59 | – (kein Kommentar im Code) |
| `ctl=auto/day/night` | HudClay.jsx:206 | HUD 3D: Tastenfarbe der Kassette nach Tageszeit bzw. fest |
| `disco` | m1/M1World.jsx:185 | Ort: ohne discoat die flachste freie Stelle 22–70 m um die Band (abseits Band und Platzmitte), Publikum zur Platzmitte. |
| `drivepanel=0` | world/EndlessDrive.jsx:30 | – (kein Kommentar im Code) |
| `dust2=1` | modules/vehicleRig.js:135 | r3: Pool 320, Ausstoß × 2 (× 2 belegt ≤ 233 von 320; × 2,5 überschrieb lebende), junge Tupfer bis 40 CSS-px // inherit: Anteil der Wagengeschwindigkeit – 0,65 v |
| `dust3=0` | modules/dustTrail.js:14 | Standard seit Georgs Übernahme (23.10., puffs2); dust3=0 = alter Staub |
| `figamb=0` | look/figureAmbient.js:6 | Georg 23.10.: Standard; figamb=0 = alter Stand |
| `figlight=1` | look/figureLights.js:7 | A/B für Georg; Standard erst nach seiner Wahl |
| `flame=glow/clay` | m2/M2Car.jsx:138 | der Lüfter bleibt ein Knet-Zusatz über vclay (parts/body: Knete, vclay=0: Leuchtscheibe), die Funken folgen der Flamme |
| `flight=elan` | m1/M1Player.jsx:59 | Schwungflug (Elan S1) |
| `fluffer` | m1/M1World.jsx:164 | WS-NPC Phase C P1 (V-583, Georg 21.10.: Ghost, Heil-Waffe Gun_Pistol) hinter dem Hash fluffer (braucht harvest: Baum, Schuss, Fluff); fluffert=<s> Startzeit |
| `found=rest` | modules/foundItems3d.js:20 | – (kein Kommentar im Code) |
| `fps=30` | m1/m1Clock.js:20 | ohne den langsamen Software-Renderer); fps=30 (nur mit debug): nur jedes zweite Bildschirm-Bild wird verarbeitet (gedrosselt) |
| `gift` | m1/M1World.jsx:197 (+1) | Bots B17 privat (PROOF), sonst Platzhalter |
| `glow=v2` | modules/vehicleRig.js:18 (+1) | Georg 23.10.: die gezähmte Leucht-Flamme (weiche Diamanten, Nacht-Begrenzung) war schlechter als vorher – Standard ist wieder die Leucht-Flamme wie abgenommen,  |
| `ground=0` | m1/M1World.jsx:217 | Geländematerial), Kontakt-Steinchen in ungeraden Gruppen; Amphitheater-Eingang (Rampe, +z) bleibt frei. ground=0 schaltet aus (Vorher-Bild). |
| `harvest` | m1/M1World.jsx:125 (+1) | Tasten (Platzhalter bis Georgs HUD-ZIP): V Faust (Schlagring), B Schuss (Projektil), N Explosion, T Saugarm (V-487 Stufe 2); Aufsammeln bei Kontakt (zu Fuß, im  |
| `hero=0` | look/vehicleLook.js:99 | – (kein Kommentar im Code) |
| `hero=1` | look/vehicleLook.js:98 | – (kein Kommentar im Code) |
| `hl=0` | look/headlights.js:28 | Scheinwerfer aus |
| `hlt=0/v2/v3/cone` | look/headlights.js:25 | HEADLIGHTS.rebuild() baut die Scheinwerfer des aktuellen Wagens mit HEADLIGHT_TUNE.mode neu (Prüfbilder). |
| `hud=clay/wood/3d` | m1/M1World.jsx:269 | Georg 22.10.: Knet-HUD ist Standard, hud=wood = Holz-HUD |
| `hudpal=otown/bucht` | hud/hudPalette.js:28 | Hash-Schalter hudpal=otown/bucht (Prüfung gegen die N29-Bögen), sonst null |
| `kitclay=0` | m1/M1World.jsx:238 | Georg 22.10.: Kit-Knete ist Standard, kitclay=0 = ohne |
| `kitclay=1` | m1/M1World.jsx:241 | exakt wie abgenommen (Fix ändert das Bild erst nach Georgs neuer Abnahme): eyeActor-Figuren faktisch ohne Knete, Band wie bisher. |
| `kitclay=2` | m1/M1World.jsx:241 | exakt wie abgenommen (Fix ändert das Bild erst nach Georgs neuer Abnahme): eyeActor-Figuren faktisch ohne Knete, Band wie bisher. |
| `lanterns=0` | m1/M1World.jsx:214 | Kamera), Lichtfleck am Boden für alle (gem pool). Stärke = Stimmungs-glow (Tag 0, Gold 0,35, Nacht 1). lanterns=0 schaltet aus. |
| `light=l1` | Stage.jsx:79 (+2) | look=legacy zeigt den alten Stand (Palette nach Kartengenre, 18 %). palette=<id> bleibt als Vergleich vorrangig. |
| `lines=alt` | dialog/ssotLines.js:8 | Georg 24.10.: Standard („schön so“); lines=alt = alte Blasen (Titel/Power, nur für die Alt-Tests d1stage/preview); ohne Browser (Node-Tests) alter Weg |
| `lines=tr1` | dialog/ssotLines.js:50 | die das Triplet nicht enthält (TRIPLET_SSOT: nie derselbe Text zweimal). Opener vor ganzen Sätzen nur clause_ok bzw. own_clause (S8). |
| `lineup=1` | Stage.jsx:65 | L2 Schritt 3 (V-340): lineup=1 = Aufstellung aller 14 Fahrzeuge + Figuren auf eigener Fläche statt Amphitheater/Billboard |
| `look=terrain2` | look/terrain2.js:12 | älterer Gelände-Look |
| `look=terrain3` | look/terrain3.js:9 | Gelände-Look R3 (Site-Standard-Hash) |
| `mute` | m1/M1World.jsx:331 (+2) | R1a Ton (propulsion_r1) |
| `nobar` | compareBar.js:36 | – (kein Kommentar im Code) |
| `nodraw` | m1/m1Clock.js:20 | ohne den langsamen Software-Renderer); fps=30 (nur mit debug): nur jedes zweite Bildschirm-Bild wird verarbeitet (gedrosselt) |
| `nofence` | m1/M1World.jsx:479 | – (kein Kommentar im Code) |
| `norender` | m1/m1Clock.js:20 | ohne den langsamen Software-Renderer); fps=30 (nur mit debug): nur jedes zweite Bildschirm-Bild wird verarbeitet (gedrosselt) |
| `npc` | m1/M1World.jsx:161 | npct=<s> setzt die Startzeit im Tag (Standard 0,27 Tag: das erste Treffen am Wiesenrand folgt nach ≈ 20 s). Nur im J17-Maßstab (nicht wscale=legacy). |
| `npcfresh` | m1/M1World.jsx:209 | – (kein Kommentar im Code) |
| `npcmem=0` | m1/M1World.jsx:209 | – (kein Kommentar im Code) |
| `nsh=0` | m1/M1World.jsx:369 | Schattenstärke nach glow bis 1,0 – Mondschatten unter den Figuren lesbar wie bei Gold. Nur Stimmungswerte und Schattenstärke, kein neues Licht. |
| `outline=1` | App.jsx:46 (+1) | Umriss um Figuren (geparkt, Georg 24.10.) |
| `palgen=0` | look/biomeTerrain.js:18 | – (kein Kommentar im Code) |
| `patrol` | m1/M1World.jsx:173 | WS-NPC Phase D (Georg 21.10. Go, SPEC_NPC_PATROL_R1): Gruppen auf Fahrplan hinter dem Hash patrol (heute: Skelett-Patrouille westlich des Theaters) |
| `perf` | Stage.jsx:224 | F1 · Leistungsanzeige (V-370-Budget, perfBudget.js): Hash perf → Zeile unten am Rand mit p95, fps, Draw Calls, Dreiecken; kein finales HUD (§44.3) |
| `prefetch=0` | m2/M2Car.jsx:170 | Speicher: höchstens MODEL_KEEP Racer bleiben geladen; ältere (nicht der aktuelle, nicht die Nachbarn) geben Geometrie und Texturen frei. prefetch=0 schaltet ab. |
| `preview=g4` | dialogText.js:11 | Vorschau-Text (F-3a): nur mit ausdrücklichem Schalter #…,preview=g4; sonst nie (kein Standard, nicht ACCEPTED) |
| `q=fast/standard/sharp` | start/quality.js:6 | – (kein Kommentar im Code) |
| `racer=w` | start/startCurtain.js:24 (+2) | Racer wählen (racer=<id>) |
| `rshadow=full` | look/shadowProxy.js:9 | Georg 24.10.: Standard; rshadow=full = voller Schatten |
| `scull=0` | look/shadowCull.js:6 | Schattenschnitt aus (Standard: an) |
| `shade=1` | look/shadeFloor.js:9 | A/B für Georg; Standard erst nach seiner Wahl |
| `shadow=vsm` | m1/M1World.jsx:478 | shadow=vsm (debug) = der alte weiche Schatten zum Vergleich |
| `start` | main.jsx:7 | alte Startseite mit Vorhang (seit 23.10. nur Schalter) |
| `uncarded=1` | Stage.jsx:102 | Kandidaten ohne Karte (cast=<KayKit-id>) nur im Casting-Vergleich mit uncarded=1. |
| `vclay=0` | m2/M2Car.jsx:134 | vmatte=1 (vehicleLook) = Karosserie leicht matter, Farbe unangetastet |
| `vclay=body` | m2/M2Car.jsx:134 | vmatte=1 (vehicleLook) = Karosserie leicht matter, Farbe unangetastet |
| `vlook=0` | m2/M2Car.jsx:156 | – (kein Kommentar im Code) |
| `vmatte=1` | look/vehicleLook.js:13 | 22.10.: erste Werte (0,43/1,36/0,69) waren im A/B kaum sichtbar (Lead) |
| `weapon=pistol/blaster` | m1/M1World.jsx:228 | aktiver K10-Waffe (ohne bleibt der alte Schuss). weapon=pistol/blaster setzt die Startwaffe. Figur dreht über M1Player.face (Controller besitzt die Blickrichtun |
| `world=endless` | world/EndlessDrive.jsx:27 (+1) | endlose Biom-Fahrt (WS1b) |
| `world=probe` | m1/M1World.jsx:150 (+1) | #439 world=probe (Georg 21.10.): Geländeform der Gelände-Probe als zweite Welt, kombinierbar mit look=terrain3 (nicht mit terrain2: dort wählt world die Palette |
| `wscale=legacy` | worldScale.js:12 | Hash: wscale=legacy zeigt die alte, 1,54-fach große Bühne (nur zum Vergleich im Bildpaar) |
