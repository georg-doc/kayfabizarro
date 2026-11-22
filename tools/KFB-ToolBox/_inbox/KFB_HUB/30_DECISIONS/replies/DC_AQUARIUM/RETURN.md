# DC Aquarium · Feinschliff-Chat → WS0 (neueste oben)

## R-029 · 22.11.2026 · Becken-Monitor größer, zweite Tafel, HyperNorm in der Claude-App geprüft · Artefakt v38

- **Zweite Tafel:** Sie war der alte Platzhalter-Bildschirm aus dem Kern. Das Belegbild `hypernorm_monitor_r1.png` stammte noch von vor dem Ausbau (R-028). Auf dem neuen Beleg `becken_monitor_r2.png` ist nur noch der Monitor an der Luke zu sehen.
- **Monitor:** 1,3-fach größer (Breite 3,65 statt 2,8) und etwas näher zur Kamera.
- **HyperNorm in der Claude-App, drei Ursachen behoben:**
  1. Der abgeschottete Rahmen hat eine eigene Herkunft, der Kern lädt nur freigegebene Herkünfte.
  2. Der Bildabruf im Worker scheiterte dort; das Material wird jetzt im Hauptfaden geladen und dem Worker fertig übergeben (vom Kern so vorgesehen).
  3. Der Kern holt Bilder mit `credentials: 'omit'`, das private Artefakt liefert dann 403. Für die eigene Herkunft gehen die Cookies jetzt mit.
  - Der Stamm bleibt unverändert.
- **Ergebnis in der App (Chrome, Version 38):** „HN worker · Pool 22 · Schriften 9 · Bilder 235 · 25 ms“. Der Worker läuft, der Hauptfaden bleibt frei. Beleg: `hypernorm_claude_app_r1.jpg`.
- **Prüfanzeige:** `#hninfo` an den Artefakt-Link hängen; unten links stehen dann Modus, Pool, Bilder und ein kurzer Abruftest.
- **Für WS1 und den Stamm:** Wer HyperNorm in einem Claude-Artefakt nutzt, braucht dieselben drei Anpassungen. Im Stamm wäre `credentials` als Option von `loadMaterial` die saubere Lösung.
## R-028 · 22.11.2026 · HyperNorm-Monitore, Glitch-Loop, Rahmenwechsel, Billboards im Meer · Artefakt v33

**HyperNorm:** Der Stamm-Kern `engine/hypernorm` liegt unverändert in `kfb-stamm-kopie/engine/hypernorm` (Stand @e3552a67, `HERKUNFT.txt`).
- Eine Fläche rechnet im Worker (gemessen etwa 12 ms je Bild, Hauptfaden frei) und malt in eine stabile Textur, die alle Monitore teilen.
- Palette und Seed je Station (Becken, Tang, Riff, Augenfeld, Schlucht, Blut). Beim Stationswechsel kommt eine neue Fläche, das Material bleibt geladen.
- Bubble FM treibt die Farbe (Bass/Beat → `setFarbe`). Die Fläche läuft nur, solange ein Monitor zu sehen ist, sonst ist sie pausiert.
- Material: Auszug von 22 Bildern aus dem HyperNorm-Pool (Kosmos, Holzschnitt, Karten, Plakate, Jugendstil; keine Anatomie) in `media/hypernorm/pool`.

**Monitore:**
- HyperNorm liegt unter dem Text. Echo in Bernstein glitcht über den Loop rein (RGB-Versatz und Zeilenriss), steht klar auf dunkler Unterlage, glitcht raus, dann bleibt kurz nur HyperNorm.
- Jede neue Echo-Nachricht bekommt einen anderen Rahmen der Serie „breit“, nie zweimal denselben hintereinander.
- Der alte Platzhalter-Bildschirm im Becken ist raus; Echo läuft im Becken nur noch auf dem Monitor an der Luke.

**Billboards im Meer:** Die Bildwände der Stationen sind jetzt Monitore der Serie „karte“ mit den acht Teaser-Karten (randlos, 1,74 : 1 mittig).
- Bei den breiteren Rahmen 01/02/05 laufen in den Seitenstreifen HyperNorm.
- Sie treiben sanft im Strom und drehen sich zur Kamera. Spricht Echo, glitcht der Satz über die Karte.
- Der Kern bekommt sie über eine Monitor-Fabrik (`createGame({ monitor })`), ohne Fabrik bleibt die schlichte Bildwand.
- Karten nur aus `teaser_karten_r1`, nichts aus Decks gezogen.

**Dateigrenze:** Die 122 Echo-Sprachdateien sind jetzt zwei, je Stimme eine (`audio/echo/<stimme>_alle.mp4`, Startzeiten im Manifest, Wiedergabe über WebAudio auf dem Spiel-Bus).
- Erzeugt mit dem neuen Skript `scripts/dc_aquarium/echo_sprite.py` nach `echo_stimmen.py`. Die Einzeldateien liegen als Quelle in `audio/echo_quelle`, außerhalb des Artefakts.
- Das Artefakt hat jetzt 423 Dateien statt 490, trotz Engine, Pool und Karten.

**Geprüft:** Intro (529×815), Reel, Game Over, Startbild, Billboards (Station 1) und Echo-Sprites, alle Konsolen ohne Fehler. Die Kern-Tests sind 10/10.
- **Nicht geprüft:** ob der HyperNorm-Worker in der Claude-App startet. Fällt er aus, rechnet der Kern selbst im Hauptfaden weiter (langsamer).

**Belege:** `hypernorm_monitor_r1.png` (Becken: Text, nur HyperNorm, neuer Rahmen), `billboards_meer_r1.png`.
## R-027 · 22.11.2026 · Leben als Seitenansicht des Fisches (WS0-Korrektur) · Artefakt v32
- Die Leben zeigen jetzt die Seitenansicht des gerade gespielten Fisches: einmal je Fischart aus dem echten Modell gerendert, Profil von der Seite mit KFB-Auge, Kopf nach rechts, eng zugeschnitten.
- Verlorene Leben sind eine dunkle Silhouette derselben Form.
- Beim Kapern wechselt die Form auf den neuen Fisch, der Lebensstand bleibt.
- Kein gemaltes Symbol mehr; die Umfärbung des Clownfisch-Symbols ist raus.
- Beleg: `leben_fisch_profile_r2.png` (alle sieben Fische, je mit einem verlorenen Leben ab dem dritten Fisch).
- Die übrigen Punkte aus WS0s Nachricht (Auge, Fisch-Akten R2, Hai, Ringe, Silber) stehen schon in R-026.
## R-026 · 22.11.2026 · Georgs Hub-Liste (q827–q835) + Parcours-Runde + Modi · Artefakt v31

Je Punkt ein Beleg in diesem Ordner.

1. **Startbild (q832/q833):** Die Illustrationen rotieren bildfüllend wie vorher, das Becken liegt davor.
   - Vorn stehen echte Riesentang-Pflanzen aus `kelp-forest` an den Rändern und wiegen sich im Strom.
   - Die Seite sucht sich dafür zwei vorhandene Pflanzen und stellt den Blick so, dass Mitte, Logo und Becken frei bleiben. Gezeichnet wird nur der Tang, kein Boden.
   - Der leere Echo-Monitor ist im Startbild ausgeblendet.
   - Beleg: `startbild_tang_ecken_r1.png` (529×815, 1280×720, 844×390).
2. **KFB-Auge (q829/q834):** Ursache war der Klarlack-Glanz der Augäpfel über der Bloom-Schwelle; außerdem spiegelte die schwarze Pupille die roten Scheinwerfer und das Truhenlicht.
   - Die Seite zähmt den Glanz nach dem Einsetzen: wenig Klarlack, matte Pupille, schwache Umgebungsspiegelung, kein Leuchten. Der Stamm bleibt unverändert.
   - Weil die Augen teils erst nach dem Aufbau kommen, läuft das alle 1,5 s nach.
   - Nahaufnahme an der Truhe: überstrahlte Pixel am Auge von bis zu 62 auf 0.
   - Beleg: `auge_glanz_r1.png` (vorher/jetzt). Vergleich mit dem alten Glanz über `?glanz=1`.
3. **Fisch-Akten R2 (q830):** `FISCH_AKTEN_R2.md` als Heist-Crew mit Wheelman, Cat Burglar, Hacker (Prof. MaBi), Con Artist, Muscle, Smuggler, Informant und Getaway-Sub.
   - Je Fisch genau eine Stärke (auch aus der Parcours-Runde). Alles Englisch, kein Medizin- und kein DocCheck-Witz.
   - Ein blinder Gegenleser, danach eine Überarbeitung: Ladebildschirm-Sprüche um konkrete absurde Fakten statt Schablonen gebaut.
   - „Kühlwasser“ heißt jetzt „The Coolant Line“ (Radio-Manifest, Metadaten, Radio-Quelle).
4. **Hai (q827):** WSBs reparierter `KFB_Shark_white.kfb.r1.glb` (assets/private, Standard-PBR, KFB-Augen-Anker) privat in `models/privat/hai/`.
   - Die alte Kopie lief auf Specular-Glossiness und bleibt nur als öffentlicher Rückfall.
   - Beleg: `hai_repariert_r1.png`.
5. **Röhre (q827):** Georgs 12 Ringe aus der Alpha-Kontur extrudiert (neues gemeinsames Modul `js/bild-koerper.js`, auch für die Monitore). Leuchtend, Blau 1–6 zu Beginn, Gold 7–12 zum Ende, je Abschnitt (4 Ringe) ein Typ, wiederholt.
   - Beleg: `roehre_ringe_r1.png`.
6. **U-Boot (q835):** Silber ist Standard, Rauchglas ist raus (Datei, Schalter, Artefakt).
7. **Modi:** chill / trouble / gangster (alte Speicherstände werden umgeschrieben).
   - chill: 3 Leben je Station, beim Stationswechsel wieder voll mit kurzem Aufleuchten.
   - trouble: 3 Leben für den Lauf, Extraleben möglich.
   - gangster: 3 Leben für den Lauf, kein Extraleben, Gefahren wie bisher hard.
   - In der Modus-Wahl steht je Modus eine Zeile: „3 lives per station“ / „3 lives, that's it“ / „3 lives. No refunds.“
   - Game Over: in trouble/gangster neuer Lauf ab Becken, in chill zurück an den Stationsanfang.
   - Level-Daten und Tests umgestellt, 10/10 grün.
8. **Truhen-Boni:** Turbo und Tarnung bleiben. Neu, mit Banner und Symbol mit ablaufendem Ring aus vorhandenen HUD-Teilen:
   - Magnet (10 s, Muscheln kommen zum Fisch);
   - Extraleben (nicht in gangster, höchstens +2);
   - Kombo-Verdoppler „Double or Nothing“ (20 s doppelt; der erste Treffer beendet ihn und nimmt den Verdoppler-Gewinn wieder weg).
9. **Statistik:** Je Lauf ein Datensatz `kfb.aqua-lauf/1` mit Muscheln (Punktzahl), Zeit, Ringen, unentdeckten Stationen, übrigen Leben, Toden nach Ursache, Modus und Fisch. Vorerst im Browser des Spielers gespeichert, letzte 50 Läufe, als Vorbereitung für die Hall of Bubble Fame.
   - Tafel aus `panel_tall` und HUD-Symbolen nach Game Over („Rap Sheet“) und am Ende („Heist Report“).
   - Beleg: `game_over_statistik_r1(_schmal).png`.
10. **Blutbahn:** Der Hauptpfad endet mit dem Hai-Angriff, der Lauf zählt dort als geschafft. Die Blutbahn läuft danach als „Bonus round“, keine Pflicht.

**Noch offen:** HyperNorm auf den Monitoren; Billboards im Meer; die eine Stärke je Fisch im Spiel (nach Georgs Abnahme von R2); Ride mit „Exit Now!“ baut WS0, die Röhre mit den Ringen bleibt bis dahin.
## R-025 · 22.11.2026 · Flexa im Arch-Rahmen, Monitor-Modul, Echo-Monitor im Becken, Game Over neu, Fisch-Leben · Artefakt v30

**Flexa (WS0-Punkt 1):**
- `tex/hud/frame_arch.webp` direkt unter dem Radio, kein weißer Grund mehr, die Szene bleibt sichtbar.
- Video im Querformat neu geschnitten (Intro und alle 52 Clips aus den 1080p-Quellen), auf die Öffnung zugeschnitten, ohne Rundmaske. Die drei Lampen leuchten, solange sie spricht.
- Rahmen austauschbar über `FLEXA_RAHMEN` (Bild, Öffnung, Lampen in Anteilen).
- Intro-Sätze laufen rot (#d8002f) synchron auf dem Monitor. Während des Intros schwebt der Monitor direkt unter Flexa (in jeder Fenstergröße im Blick) und gleitet danach neben die Luke. Dort folgt Echo in Bernstein, erst dann läuft die Trübungsuhr. Überspringen bleibt.
- Reel-Clips nutzen denselben Rahmen. Alle 52 Clips liegen jetzt in einer Datei (`reel_alle.mp4` + Startzeiten), das spart 51 Dateien im Artefakt.

**Monitor-Modul `js/monitor-tafel.js`:**
- Rahmen aus der Alpha-Kontur extrudiert, 7 % der Breite tief, Seitenwand in der Randfarbe.
- Schwarze Innenfläche leicht zurückgesetzt, unbeleuchtet (kein Nebel, kein Wasser-Shader). Rückseite gespiegelt mit eigener Fläche.
- Text in Share Tech Mono (Rückfall IBM Plex Mono), Echo #FFB000, Flexa #d8002f, 2 px Schein, 1,3 Zeilenabstand, Tipp-Animation mit Cursor.
- Option `drehen` (zum Spieler), sanftes Schweben. Rahmen-Daten: `tex/monitor/monitore.json` (alle 12 Rahmen als WebP 1024).
- Im Becken: `monitor_breit_02` (Kuppel, passt zum U-Boot-Design) neben der Luke, alle Echo-Sätze im Becken laufen dort.

**Game Over (Punkt 2):**
- Fisch sinkt weg, Kamera bleibt stehen, das Bild dunkelt nach unten ab, die Welt bleibt schwach sichtbar, Blasen steigen.
- Das Schild schwimmt als Objekt in der Szene von links unten herein, treibt mittig unter Flexas Rahmen und kippt leicht, Blasen am Rand.
- Auswahl: Haken → 02, Mine → 04, sonst zufällig 01/03/05/06, nie zweimal dasselbe.
- „Play again“ im CTA-Stil genau an der Stelle von „Escape Now!“ (gemessen beim Start), darunter klein „One more heist“.
- Im Meer greift es jetzt beim letzten Leben, statt wortlos zum Levelanfang zu springen. Play again startet dort am Levelanfang, im Becken neu.

**Leben (Punkt 3):** `fish_full`/`fish_empty` statt Herzen, eingefärbt (Farbton der kräftigsten Fischfarbe, Helligkeit des Symbols bleibt). Beim Kapern wechselt die Farbe, der Stand bleibt.

**Geprüft:** 1280×720, 529×815 (Georgs Fenster), 390×844, 844×390. Tests pruef-flexa, pruef-reel, pruef-gameover, pruef-leben, alle ohne Fehler. Tablet-Größen nur über die gleichen Regeln, nicht eigens fotografiert.

**Belege:** flexa_intro_arch_r2(_schmal).png, echo_monitor_becken_r1.png, game_over_schild_r1(_schmal).png, leben_fische_r1.png, flexa_reel_truhe_r2.png.

**Offen:** HyperNorm auf den Monitoren und schwebende Billboards im Meer. Das Modul ist dafür vorbereitet (eigene Innenfläche).
## R-024 · 22.11.2026 · Startbild-Fix (Georg direkt) + Flexa-Reel im Spiel · Artefakt v29

**Startbild (Georg: „bitte endlich fixen“, Illustrationen fehlten):**
- Die neun Hintergrund-Illustrationen laufen wieder bildfüllend durch (Diashow wie vorher). Die Kelp-Startwelt gibt es nur noch auf Wunsch (`?bg=kelp` oder `?bg=b`).
- Becken im schmalen Fenster: neben dem Logo nur noch mit Rand fürs Schwenken; hochkant steht es unter dem Knopf, ganz sichtbar. Unten bleibt Rand frei, weil das App-Fenster dort bis 90 px abschneidet.
- Beleg: `startbild_illustrationen_r2.png` (529×815, oben 725 sichtbar wie in Georgs Fenster). Geprüft auch 390×844, 600×800, 844×390, 1280×720.

**Flexa-Reel (52 Clips):**
- Kleines Bullauge fährt unter dem Radio aus, Satz darunter rot auf Weiß. Nie zwei Clips zugleich, mindestens 20 s dazwischen, je Gruppe eigene Abklingzeit, Leerlauf erst nach 30 s ohne Ereignis.
- Wartet, solange ein Banner steht oder ein ECHO-Rätselhinweis läuft (Tastenfeld, Trübung); Hinweise brechen einen laufenden Clip ab.
- Ohne Ton oder bei stummem Radio läuft der Clip stumm mit Untertitel.
- Zuordnung: Truhe (mit Perk: Turbo/Tarnung), Licht entdeckt, Haken nah/Biss, Haken entkommen + Licht knapp vorbei = knapp, Mine, Augen (Griff = augen.03), Hai (Auftritt, gefressen), Tod (Haken, zu spät), Game Over, Level geschafft, U-Boot einsteigen, Kapern, 7er-Kombo, Leerlauf (leer.06 bei der Trübung).
- Modul `js/flexa-reel.js`, Test `dc-aquarium-radio/scripts/pruef-reel.mjs` (alle Sperren grün). Beleg: `flexa_reel_truhe_r1.png`.

**Nächster Schritt:** Monitore mit HyperNorm, dann schwebende Billboards.
## R-015 · 22.11.2026 · Critic-Reihe 1–6 (Georg q822 über WS0)

- Gepusht @c75ca2a, Artefakt v14, Details sea-escape/CHANGELOG.md r15.
- Hai-Shot-Liste, Röhre mit Schnitten + Ruck je Ring, Ankunft-Reveal + Titel 48 px auf Band, Kapern als Moment, HUD-Anker + größere Herzen/Muscheln, Radio als kompakte Pille.
- Belege: hai_shotliste_r1.mp4, roehre_schnitte_r1.mp4, ankunft_reveal_r1.png.
- Offen: Kran-Blick bei der Ankunft noch im Tang; „I take over“-Pille noch statt Glanzlicht; ECHO-Tafeln teils als Spiegelschrift vor der Kamera.

## R-014 · 22.11.2026 · Augenfeld (Schalter), Radio Stopp/Ton global, Beta-Höhe

- Gepusht auf `dc/aquarium-standalone` @f06a687, Artefakt v13. Details in sea-escape/CHANGELOG.md r14.
- Augenfeld: core/eyeField.js (Stamm-Augen + eye-goo + Effekseer Herald unverändert), nur hinter Schalter (God-Panel „Eye field“ / `#augen`); Ort entscheidet Georg.
- Radio: Stopp = Stille, Ton aus = alle Spielgeräusche + ECHO stumm.
- Beleg: `augenfeld_r1.mp4`. Offen: Herald im echten Artefakt ungeprüft; Prüfserver fällt ab und zu aus.
- Als Nächstes (Georg): Suchscheinwerfer als rote Shader-Kegel mit Bodenzone; Startbild-Aquarium als Musik-Visualizer mit Blasen und Algen im Vordergrund.

## R-013 · 21.11.2026 · B1 Angelhaken, B2 Minen/Kugelfische, B6 Gefahren-Takt gebaut (Georg: „Du, hier“)

- Georg hat im Chat entschieden, dass der Feinschliff-Chat B1/B2/B6 baut (statt Aqua-Chat). Gepusht auf `dc/aquarium-standalone` @e917c14 (kein paralleler Stand auf dem Zweig).
- **B1** `sea-escape/core/fishingHook.js`: Schnur mit Durchhang, Köder Wurm/Blinker, Sog im Radius, Biss-Uhr ganz nah (Normal 1,4 s / Chill 2,5 s / Hard 0,9 s), Losreißen mit Boost/Kick/Gegenlenken, Biss = Ruck nach oben + Zeitlupe (Host) + `caughtPenalty()`, Chill = Fangen und Freilassen. `MODES[m].hook`, Level `hooks: [...]` mit Prüfung.
- **B2** `sea-escape/core/seaHazards.js`: Ketten-Minen in der Strömung, Kugelfisch (cartoonFish 'puffer' mit KFB-Augen) bläht sich auf (Stacheln, Zittern) und platzt; Druckwelle schiebt Spieler, `kelp-fish.scare` für Schwärme, `knock` für Voxel-Teile; Normal/Hard ein Leben, Chill nur Rückstoß. Gemeinsame Schnittstelle `hazard.nah` mit B1. Rauch: `WATER_INK` über Stamm `src/modules/dustTrail.js` (`createWaterTrail`/`spray`, Kopie @baaa1b4 unverändert in `kfb-stamm-kopie/`).
- **B6** Level 1–3 mit Gefahren getaktet (L1 lehrt, L2 Minen-Tor vor dem Tunnel, L3 alles vor dem Hai, Blutbahn ohne; Hard je ein Köder mehr).
- **Tests:** `sea-escape/test/gefahren.test.mjs` 10/10 grün (Level-Daten + Prüfung, Takt, Modus-Werte, Biss-Fenster, Losreißen < 1,4 s, Mine Normal/Chill, Kugelfisch). Seite im unsichtbaren Chrome: Konsole sauber (nur bekannte GLTF-Warnung des Hais), Belege `gefahr_r10_haken/mine/kugelfisch/explosion/biss.png`.
- **So sieht man es:** Zahnrad → God-Modus → Sprung „Riff“ (Level 2): Köder vor dem Tunnel, Minen-Tor, Kugelfisch; „Schlucht“ (Level 3) alles zusammen.
- **Nicht gemacht / offen:** Schwärme über `src/look/skyFlock.js` – das Modul kennt nur Himmels-Silhouetten (Möwen-Geometrie, Anker um die Kamera), keine Fische; braucht eine Fisch-Art im Modul. Voxel über `glyphVolume.mjs` = Umzug von voxelGlyphs (T3), noch nicht. `bildUebergang.js` nicht umgestellt. Eigene Klänge (Rolle, Schnurriss, Detonation) fehlen. Muschel-Linien und Ringe unverändert. AQUA_R1-Modelle nicht eingebaut.
- Kleiner Fix nebenbei: Paletten-Warnung beim Laden (God-Panel vor seiner Anlage aufgerufen) abgefangen.

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
