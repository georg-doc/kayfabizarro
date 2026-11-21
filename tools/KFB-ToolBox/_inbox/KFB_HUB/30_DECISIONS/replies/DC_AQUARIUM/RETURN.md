# DC Aquarium · Feinschliff-Chat → WS0 (neueste oben)

## R-012 · 21.11.2026 · Rollen geklärt (WS0 zu R-011)

- B1/B2 baut der Aquarium-Chat (A-239 F2); ich baue nichts an seaGame, seaLevels und der Spiel-Logik in index.html. Meine Rolle: Seite (Radio, hudReakt, suchLicht, Musik-Skript), neue Stände des Aquarium-Chats auf dem Zweig einpflegen und lauffähig halten, Veröffentlichung vorbereiten (erst nach Georgs Ja).
- Hinweis für den Aquarium-Chat: In @8713c6b stecken schon zwei kleine Eingriffe in seinen Dateien, bitte beim nächsten Stand erhalten: `seaGame.js` Option `licht` (Scheinwerfer mieten Licht aus dem suchLicht-Vorrat, ohne Vorrat alles wie vorher) und `dcTank.js` `lampe()`; in `index.html` die Blöcke Radio/hudReakt/Licht (hudTick, schleusenLicht, taucherLampe, Ecke mit `#radioSlot`).

## R-011 · 21.11.2026 · Licht über suchLicht (R-010 a) gepusht; Radio ohne Musik im Git; Frage B1/B2

- `dc/aquarium-standalone` @21f16bb Radio (ohne `radio/music`, `.gitignore`; `radio/scripts/musik.mjs` füllt die Titel: Pin bzw. Hub-Mix nach Rezept, gemessen −18,06/−18,05 LUFS).
- @8713c6b Licht: `kfb-stamm-kopie/src/look/suchLicht.js` + `kfb-headbeam.v1.js` unverändert; seaLit mit 4 Spot-Slots, `sea.setSpots(vorrat.lights(), k)` im Vor-Bild-Haken nach `zuteilen`; Suchscheinwerfer mieten je ein Licht (kein gemalter Fleck, Kegel und Lampe bleiben); Taucherlampe und Schleusen-Licht über denselben Vorrat; `setLamp` ungenutzt. Geprüft: Vorrat Welt 3 aktiv (Taucherlampe + 2 Scheinwerfer, Uniforms gefüllt), Becken 1 (Schleuse), keine Konsolenfehler. Radio auf dem Handy unter Ente/Zahnrad.
- Rebase nötig: WS1 hatte parallel r9 (HUD-Fix B12, Doku A-239) auf denselben Zweig gepusht; ohne Konflikt draufgesetzt, Seite danach geprüft.
- **Frage vor B1/B2:** Laut A-239 F2 (BACKLOG, FRAGEN_WS0) baut der Aquarium-Chat B1–B4 selbst („hier“), WS0 nur die Stamm-Anbindung der B2-Explosion; der Aquarium-Chat schreibt gerade aktiv in denselben Zweig (r9 um 11:11). Wer baut B1/B2 jetzt: ich oder der Aquarium-Chat? Sonst entstehen zwei Fassungen in `seaGame.js`/`seaLevels.js`/`index.html`. Ich warte mit B1/B2 auf diese Antwort.

## R-010 · 21.11.2026 · Seite läuft, Radio + hudReakt eingebaut; suchLicht blockiert (Shader ohne Lichter)

- `dc/aquarium-standalone` @a9dd36a7 in `~/kfb-ws0/dc-aquarium-site` (eigener Ordner, nicht Dropbox). Lokal gestartet (launch `dc-site`, Port 5263), Startbild an Georg (`seite_r0_start.png`). TITLE_GTA bleibt true (intern).
- Radio eingebaut (`radio/`, gebaut mit `build-radio.mjs --seite`): oben rechts zwischen Zurück und Ente (Ecke als Raster „back radio duck gear“), auf dem Handy per zoom 0,62/0,54. Spielt über `audio.bus().music` der Seite (Unterwasser-Tiefpass, Puls), solange es läuft schweigt der Score; Ton aus hält das Radio an. Puls-Kopie entfällt: `radio/vendor/kfb-mixer.js` reicht nur `js/kfb-pulse.js` durch.
- hudReakt eingebaut (gleich dc/hudreakt-r1): Radio (jukebox), Ente, Zahnrad, Zähler, Sonar (leicht). Puls = `audio.frame()` der Seite (Score und Radio), motion aus dem Schwimmen (Beschleunigung in Bildschirmrichtung, Schräglage aus swimDrive, Tempo), im Menü abklingend.
- Beleg: `seite_radio_r1.mp4` (headless, Startbild → Spiel mit W/A/D/Shift). Keine Konsolenfehler.
- **suchLicht blockiert:** Alle Welt-Materialien der Seite sind eigene ShaderMaterials (`sea.material`, seaLit, kein `lights: true`). Echte three.js-SpotLights beleuchten dort nichts; nur der Schaft aus kfb-headbeam wäre sichtbar, und der Lichtfleck am Grund fiele weg. Die Scheinwerfer selbst liegen in `sea-escape/core/seaGame.js` (Kegel + Bodenfleck `spot` + Lampe), also im Kern = Stamm r7. Optionen für WS0: (a) seaLit um N Spot-Uniforms erweitern (wie `setLamp`), gespeist aus dem suchLicht-Vorrat (ein Owner der Zuteilung, Shader als Empfänger); (b) Scheinwerfer bleiben bis zum Shader-Umbau wie sie sind. Nichts gebaut.
- Nicht committet/gepusht: `index.html` geändert, `radio/` neu (78 MB, davon 68 MB Musik intern). Frage an WS0: Push auf `dc/aquarium-standalone` mit oder ohne `radio/music` (Musik nur im Veröffentlichungs-Build)?

## R-009 · 21.11.2026 · Zweig dc/hudreakt-r1 @12e09fcd (WS0-Auftrag)

- Basis Stamm @5d2f1099 (game/integration-r2), genau drei neue Dateien: `src/hud/hudReakt.js`, `src/data/hud/dc-radio.r1.json`, `test/unit/hudReakt.mjs`. Nichts sonst geändert, kein vendored mixer/hudMotion im Stamm.
- Eingang wie abgesprochen: `update(dt, { pulse: musicPulse(), motion: motionSignal() })`, motion = { ax, ay, bank, speed }. Keine Imports, kein rAF, Werte nur aus dem Skin.
- Test `node test/unit/hudReakt.mjs` PASS (in Repo-Anordnung geprüft): Trägheit, schwer hängt länger nach, Ruhelage, Kippen, Farbe über die Phrase, Glow nur hörbar, Knete nur bei Drama, Skin-Tausch, Reduce motion, Neutralität.
- Änderung gegenüber dem Video: Knete-Stoß kräftiger (Spitze ≈ knete.max bei vollem Bass), vorher nur ein Drittel davon sichtbar.
- A-228/N-263 zur Kenntnis: Waisen-Zweig `dc/aquarium-standalone`, bis dahin nichts nachbauen.

## R-008 · 21.11.2026 · WS1 fertig, Seitenpaket wartet auf den Weg (Q-228 §2)

- Kanal gelesen (Georg: „WS1 ist fertig“): Q-237, alles vom Aquarium-Chat ist gepusht (r7 @81ec7ef2, A-233 Stamm @5d2f1099). Die DocCheck-Seite liegt fertig in `CLAUDE/DC Aquarium/uebergabe/site/` (OneDrive, 154 Dateien, 20 MB). Auf diesem Rechner ist sie nicht, und `dc/aquarium-standalone` gibt es auf dem Remote nicht.
- Offen bei WS0: Q-228 §2, auf welchem Weg das Paket kommt (Zweig im Spiel-Repo oder anders). Nach deiner Nachricht veröffentliche ich, nicht WSA, also braucht das Paket einen Weg zu mir.
- Stand-Seite mit dem Radio-Video aktualisiert (Version 2).

## R-007 · 21.11.2026 · Radio r2: Jukebox-Puls, Display-Lauftext, träges HUD (Georg)

- Georg: Icons mittig im Glas, Ton-Knopf ganz rechts, Lauftext mit Radio-Display-Logik, Jukebox-Visualizer (Farben, Glow, VFX im Takt, Knete-Stauchung bei dramatischen Titeln), alle HUD-Teile reagieren leicht auf Musik, alle Panels/HUD/Ente hängen träge nach bei Bewegung, Schräglage, Tempo. „Wird auch KFB-Standard.“
- Bestand genutzt: Puls = `createPulseTracker` aus `src/audio/mixer.js` (kfb.audio-presentation-pulse/1, V-1790), Deformer = `src/hud/hudMotion.js` + `hud-motion.r1.json`, beide unverändert unter `vendor/` (Herkunft im README).
- Neu (neutral, Vorschlag für KFB): `hudReakt.js` (`add(el, { art, masse })`, `update(dt, { pulse, motion })`, kein eigenes rAF, Werte nur aus dem Skin) und `skins/dc.radio.json`. In KFB: `pulse = musicPulse()`, `motion` aus Fahr-/Schwimmzustand. Frage an WS0: Wo kommt `motion` im Stamm her (Beschleunigung, Schräglage, Tempo des Spielers), und soll `hudReakt` nach `src/hud/`?
- Leiste nicht mehr gestreckt (feste Seitenverhältnisse); die Kante in Georgs Bild war die offene Liste im Ausschnitt.
- Beleg: `radio_jukebox_r1.mp4` (headless, mit Ton aus der Datei). Prüfstand in `~/kfb-ws0/dc-aquarium-radio`.

## R-006 · 21.11.2026 · Suchscheinwerfer über suchLicht.js (WS0-Nachtrag)

- Angenommen: Hai-Szene, Taucherlampe und Schleusen-Licht laufen über `src/look/suchLicht.js` (ws0/tanz-r1 @8467539), ein fester Vorrat je Szene, farbig nach Szene, kein eigenes SpotLight, keine gemalten Flecken. Herkunft kommt ins README der DC-Seite.
- Befund: `lightCone.js` ist nicht neutral. Es importiert `kfb-headbeam.v1.js` (neutral) und `groundFx.js` → `kfb-groundfx.v1.js`, `../m1/m1Scale.js`, `../worldScale.js`. Ohne Stamm bräuchte die DC-Seite diese Kette mit, oder `groundFx` wird in lightCone optional (Frage an WS0).
- Einbau erst, wenn `dc/aquarium-standalone` da ist (weiter nicht auf dem Remote).
- Nachtrag: WS0 hat suchLicht.js neutral gemacht (@1a64b14). Geprüft: Imports nur noch three und `kfb-headbeam.v1.js` (ohne Imports). Für die DC-Seite reichen diese zwei Dateien plus Herkunft im README.

## R-005 · 21.11.2026 · Radio-Knöpfe frei im Glas, Stand-Seite für Georg

- Georg: Knöpfe dürfen den Rand der Leiste nicht überlagern. Leiste jetzt 88 px hoch, Knöpfe 26 px mittig im Glas (Maße aus leiste.png). dist-intern/dist-public aktualisiert. Beleg: `radio_r2_beleg.png`.
- `dc/aquarium-standalone` weiter nicht auf dem Remote (ls-remote 21.11.); neu sind nur `ws1/sea-escape-r6/r7` (Doku: BACKLOG, UI_HUD, Pause-Übergabe an WS0).
- God-Mode-Ente ist laut UI_HUD.md schon in der Seite (`#corner` → `#duck`); Radio kommt links daneben.
- Stand-Seite für Georg (Artefakt, privat): https://claude.ai/artifact/JksyWPufctzG9mUGA7kQXE

## R-004 · 21.11.2026 · Radio-Teil neutral fertig (nach WS0-Antwort)

- WS0-Antwort angenommen: erst eigene GPT-Seite, KFB-Seite später hinter Schalter, nichts am Startbildschirm vorgebaut.
- Radio liegt in `~/kfb-ws0/dc-aquarium-radio/` (README dort): Manifest `dc.radio/1` mit Freigabe je Titel, Modul `radio.js`, Build public/intern.
- Public-Build: 2 Titel (Submarine Chase, Underwater Heist), beide −18,1 LUFS. Intern-Build: 20 Titel (KFB-Radio-Titel aus songsR2.js ohne Arena).
- Lokal im Browser geprüft: Play/Pause, Skip, Liste, Ton an/aus; Public zeigt nur die 2 Titel. Beleg: `radio_r1_beleg.png` hier im Ordner.
- Wartet weiter auf `dc/aquarium-standalone` für den Einbau neben der Ente.

## R-003 · 21.11.2026 · Georgs Vorgaben Radio/Schleusen/Startscreen + FRAGE AN WS0

**Frage an WS0 (Georg bittet um Abstimmung):** Soll das Aquarium-Spiel zusätzlich per Schalter in der normalen KFB-Spielseite/Bühne laufen (statt oder neben der eigenen GPT-Seite)? Bitte Antwort hier oder im Kanal; ich baue bis dahin die eigene Seite weiter vor.

**Georg (21.11.), festgehalten für den Bau:**
1. **Radio:** oben rechts neben der Ente (God-Mode). Panel-Leiste + 4 Icons: Play/Pause (Umschalter), Skip, Playlist, Ton an/aus (Umschalter).
2. **Erste KFB-GPT-Fassung:** Radio spielt wie das normale globale/Biom-Seed/kontextuelle Klangbett der KFB-Seite, mit allen KFB-Titeln (intern).
3. **Public-Titel:** Submarine Chase (Titel 1) und **Underwater Heist** (Titel 2, ruhiger, länger) – beide von Georg als `public` freigegeben. Stems: `40_AUDIO/chatterbox_r1/suno_tests/underwater_heist/` bzw. `submarine_chase/`.
4. **Neue Bilder** (transparente PNGs): `KFB Claymation Reference/KFB Claymation Scenes + HUD/GTA aquarium escape HUD + Startscreen/DC KFB GTA HUD icons + schleusen/` – Panels/Leisten, Radio-Icons, Schmuck-Buchstaben (A–Z, Umlaute, ß), Ziffern + Zeichen, 6 Schleusen-Varianten mit Hack-Pads.
5. **Startscreen/Aquarium:** zunächst 3 Ringe/Schleusen (links, rechts, hinten wie heute, neues Design):
   - A (aktiver Ring): Code-Glitch-Typo-Animation („Security breach detected…“, „Cooking php2shell fish…“, satirische Hack-Sätze)
   - B links: „Krazy KayfaBizzarro (Secret Beta)“
   - C rechts: „Fishy Flexikon (Coming Soon…)“
6. **Weitere Fluchtwege** (Flexikon, KFB, MED rules …): unregelmäßig an den Seiten (nicht vorne) verteilen, mit „Comic Soon…“-Unterzeile, dezent animiert im Stil der Erzähler-Tafeln.

Weiter blockiert: `dc/aquarium-standalone` fehlt noch (Seite, Startscreen, HUD).

## R-002 · 21.11.2026 · Freigabe Georg: „Submarine Chase“ = public

- Georg im Chat (21.11.): „Ja, public“ – Submarine Chase (Stems in `40_AUDIO/chatterbox_r1/suno_tests/submarine_chase/`) bekommt im Radio-Manifest `freigabe: "public"`.
- Alle anderen KFB-Titel bleiben `intern`, bis Georg einzeln freigibt.

## R-001 · 21.11.2026 · Status: WARTET auf dc/aquarium-standalone

- `dc/aquarium-standalone` existiert noch nicht (ls-remote). Keine Antwort von WS1 auf N-261/N-262 in `WS1_AN_WS0.md`.
- Vorhanden: `ws1/sea-escape-r0…r4`. r4 = nur core/, kfb/, test/ – ohne Seite, ohne marke/, ohne Startbildschirm/HUD. Lokal nicht startbar.
- Prüfstand-Artefakt aus CHANGELOG (claude.ai/artifact/7YugRwJLzE531W7WnLV1rb) für Georgs Konto nicht lesbar (nicht gefunden / nicht geteilt).
- Teilklon liegt in `~/kfb-ws0/dc-aquarium` (blob:none, sparse auf ws1/demos/sea-escape).
- Nichts nachgebaut. Nächster Schritt, sobald der Zweig da ist: lokal starten, Screenshot an Georg, dann Radio + Manifest (`freigabe: intern|public`).
