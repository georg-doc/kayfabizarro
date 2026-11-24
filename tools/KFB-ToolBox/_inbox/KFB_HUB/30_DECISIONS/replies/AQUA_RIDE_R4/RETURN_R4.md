# RETURN · Ride R4: HyperNorm-Röhre (Agent für WS0, 24.11.2026)

**Zweig:** `ws0/ride-r4-hypernorm` @ ea9d17a1 (ab Stamm `game/integration-r2` @b6d746fc), gepusht nach georg-doc/KFB-Stunt-Car-Race, **nicht gemergt**. Kein `src/private/` im Zweig (diff-tree geprüft).

**Absicht gespiegelt:** Der Fisch rast nach kurzem klarem Wasser durch eine Röhre, deren Hintergrund die echte HyperNorm-Engine ist: vorbeisausende Ebenen in zwei Tiefen und eine Schicht im Glas, gemischt mit Wasser und Blasen. Farbe und Stimmung wechseln je Songabschnitt auf dem Takt, drei ECHO-Monitore führen die Flucht weiter. Genre: Cartoon-Unterwasser-Rollercoaster.

**Ergebnis kurz:** Technisch fertig. Engine, Farbwechsel, Monitore, `echo`/`ducken`, Bildzeit +1,6/+1,7 ms, Tests grün, Build grün (mit `KFB_SPLIT=1`). Blind-Kritik **nicht bestanden**: bestes Mittel 6,75 in Runde 2 (PASS braucht ≥ 8 und keine Achse < 7). Die offenen Kritikpunkte liegen überwiegend in der R3-Fahrdynamik und im Host, siehe „Offene Punkte“.

## 0 · Bestand
- **1:1 übernommen:**
  - HN-Kern `engine/hypernorm` unverändert: `createFlaeche`, Shot-Ring `EBENEN`, Sender-Ebene für ECHO-Text und -Glitch.
  - Quellen wie `src/scenelets/hnKammer.js` (PD-Pool + Help-Deck), maxFps 24.
  - Mischung der HN-Kammer: helle Platten werden örtlich umgekehrt.
  - Feldlogik der Kartenhaus-Fassade (cascade/r4, V-1500/q532): je Feld eine Ring-Ebene, jedes sechste Feld live, eine Wiederholung zeigt einen anderen Ausschnitt.
  - Ride R3: Bahn, Blasen, Ringe, Fisch.
  - ECHO-Monitor aus Aqua (`js/monitor-tafel.js`, Rahmen `monitor_karte_03`), über eine Fabrik vom Host.
- **Neu:**
  - `src/ride/rideHn.js`: Schalen, Glas-Schicht, Abschnittsfarben.
  - `src/ride/rideEcho.js`: Monitore, `echo`, `ducken`.
  - Songkarten-Blöcke `hypernorm` und `echo`.
  - Stringtabelle `src/data/ride/ride.texte.en.json`.
  - Test `test/unit/rideR4.mjs`.
  - Beleg-Werkzeuge `test/_ride-r4-beleg.mjs`, `_ride-r4-overlay.sh`, `_ride-r4-hostpatch.py`, `_ride-r4-video.py`.

## 1 · Was gebaut ist
- **Röhre:**
  - Zwei Schalen um die Bahnachse in 2,7 m und 6,5 m Abstand, fest an der Strecke. Die Bilder sausen durch die Fahrt vorbei, die nahe Schale schneller als die ferne (Parallaxe).
  - Dazu eine schwache Engine-Schicht im Glas, die nur unter flachem Blickwinkel sichtbar wird.
  - Die ferne Schale wird in engen Biegungen zur Innenseite gestaucht und faltet sich nie.
- **Mischung mit Wasser:**
  - Licht, Dunst und Kaustik kommen aus `sea.material`.
  - Dunkle Bildteile lassen Wasser, Tang und Boden durch; oben und unten läuft das Bild ins Wasser aus.
  - In der Bildmitte um den Fisch tritt die Engine zurück.
  - Blasenfeld, Perlen und Blasenwolke sind unverändert.
- **Dramaturgie (Songkarte):**
  - Klares Wasser bis Takt 13 (erster Tempoanstieg nach dem Einsaugen), dann blendet die Engine über 2 Takte ein.
  - Je Abschnitt ein Farbton (luminanzerhaltende Mischung) und eine Helligkeit, Übergang auf dem ersten Schlag über einen Takt.
  - Energie-Bogen aus `karte.energie`, Akzent auf jedem 4. Takt.
  - Die Engine-Uhr läuft taktgleich mit dem Song (bpm 127,2).
  - 0,8 s vor dem Ausstieg blendet die Engine auf klares Wasser aus.
- **ECHO:**
  - Takt 18 rechts „Free at last!“, Takt 71,25 links „But they're watching…“ (Zeitlupe vor der Jagd, nicht auf dem Einsatz 73), Takt 103 rechts „Be careful, little fish…“.
  - Monitor in der Röhre, gut 1 m neben der Blickachse im äußeren Drittel. Er schwingt herein (Ease mit Überschwingen), hängt mit Fliehkraft und Ruck nach und fliegt wieder hinaus.
  - Text und Glitch kommen aus der Sender-Ebene einer eigenen kleinen Engine-Fläche, so wie im Aqua-Becken.
- **Aus der Kritik zusätzlich in R3-Teilen:**
  - Beim Kamerawechsel hinten/vorn schwenkt die Kamera in 0,6 s seitlich um den Fisch, statt umzuklappen.
  - Fassungen dicht an der Kamera blenden weich aus (Stroboskop-Befund R1).

## 2 · Schnittstellen-Änderungen für den Aqua-Host
`createRide` ist kompatibel. Ohne neue Felder läuft der Ride wie R3 plus Engine (Kopfzeile in `createRide.js`).

**Neue Eingänge (alle optional):**

| Feld | Bedeutung |
|---|---|
| `renderer` | WebGLRenderer. Damit ist der Shot-Ring sofort aktiv und wird vorgefüllt. Ohne ihn startet die Engine erst beim ersten Bild der Ride-Szene (`scene.onBeforeRender`). |
| `hn` | `{ quellen \| material, worker }`. Standard sind die Quellen der HN-Kammer relativ zum Modul (`site-extra/h15/hypernorm_r3/pd_pool/manifest.json` + `engine/hypernorm/test/daten/help-deck.hn-media.json`). **Aqua:** Diese Dateien liegen nicht in `kfb-stamm-kopie`. Entweder mitkopieren oder `hn: { material: hnMaterial() }` (eigener Pool, 22 Bilder) übergeben. `hn: false` = Röhre wie R3. |
| `texte` | Stringtabelle `{ 'echo.free': …, … }`. Standard ist `src/data/ride/ride.texte.en.json` (per fetch relativ zum Modul). |
| `monitor` | `({ THREE, hn, sender, breite }) → Tafel`. Der ECHO-Monitor des Hosts. Ohne ihn erscheinen keine Monitore, die Meldungen kommen trotzdem. |
| `echoDauer` | `(text) → s`. Sprechdauer. Ohne sie gelten 0,42 s je Wort, mindestens 1,2 s. |

**Neue Felder im Stand:**

| Feld | Bedeutung |
|---|---|
| `echo` | `{ id, text, t, dauer, seite }`, nur im Bild, in dem die Stimme beginnen soll. Der Monitor glitcht 0,5 s vorher herein. |
| `ducken` | 0…1. Hüllkurve: 0,3 s Anlauf vor der Stimme, hält bis zum Satzende, 0,8 s Ausklang. |
| `hn` | `{ mix, abschnitt, wechsel }`. `wechsel` steht im Bild, in dem ein Farbwechsel beginnt. |

**Host-Patch (Referenz, so im Beleg gelaufen: `test/_ride-r4-hostpatch.py`):**
```js
// Monitor wie im Becken
let rideMonitorBild = null, rideMonitorInnen = null
async function rideMonitorLaden() { const j = await (await fetch('./tex/monitor/monitore.json')).json(); const r = j.rahmen.find((q) => q.datei === 'monitor_karte_03.webp') || j.rahmen[0]; rideMonitorInnen = r.innen; rideMonitorBild = await loaders.tex.loadAsync('./tex/monitor/' + r.datei) }
const rideMonitor = ({ THREE, hn, sender, breite }) => createMonitorTafel({ THREE, bild: rideMonitorBild, innen: rideMonitorInnen, breite, drehen: false, hn, sender, schriftWelt: 0.2 })
// in rideVorbereiten vor createRide: await rideMonitorLaden()
ride = await createRide({ THREE, camera, sea: seaWorld, karte: rideKarte, ringBilder: rideRinge, renderer, monitor: rideMonitor, echoDauer })
// in rideFrame nach ride.update:
if (o.echo) speak(o.echo.text)
if (radioBus && soundOn) radioBus.gain.setTargetAtTime(RADIO_PEGEL * duck * radioBlende.k * (1 - 0.35 * (o.ducken || 0)), radioBus.context.currentTime, 0.05)
```
- Die drei Sätze haben noch keine Stimmdatei im Aqua-Sprite. Für die Belege erzeugt: Kokoro, Stimme a (bm_george), Filter wie `echo_stimmen.py`, in `_privat/stimme/`. Aqua erzeugt sie mit `echo_stimmen.py` neu.

## 3 · Bildzeit (Readback, gleiche Kamera, Takt 15–30, 30 fps im Echtzeit-Takt)
- **Gerät:** MacBook Pro M1 Max. Ein Mittelklasse-Laptop stand nicht zur Verfügung.
- **Last:** Parallel liefen andere Agenten auf derselben GPU und CPU. Deshalb gepaart im Wechsel gemessen (R4/R3/R4/R3).

| Stand | Lauf | R3 p50 | R4 p50 | Δ p50 | Δ Mittel |
|---|---|---|---|---|---|
| vor Optimierung | 1 | 19,9 | 24,4 | +4,5 | +6,5 |
| vor Optimierung | 2 | 20,8 | 24,1 | +3,3 | +3,7 |
| **final** | 1 | 19,0 | 20,6 | **+1,6** | +1,8 |
| **final** | 2 | 23,0 | 24,7 | **+1,7** | +1,5 |

- **Ziel ≤ +3 ms:** erreicht. Optimiert wurden die Abgriffe der Kammer-Mischung (3 statt 9) und die Glas-Schicht (ein Abgriff).
- **p90 (R3 und R4 gleich hoch, 45–53 ms):** Diese Spitzen hat schon R3. Sie stammen vom Host bzw. von der Last, nicht von R4.
- **Engine:** im Worker, 40–120 ms je Engine-Bild unter Last. Das ergibt real eher 8–15 Engine-Bilder/s. Das ist der Stand des Kerns, wie in der Kammer.
- **Messdaten:** `_privat/messung/bildzeit_*.jsonl`.

## 4 · CI und Build
- `node scripts/ci/run.mjs`: 233 Tests, 228 grün, 2 bekannt rot.
  - `test/unit/ride.mjs` und `rideR4.mjs` grün.
  - Drei Rückfälle, alle ohne Bezug zum Ride:
    - `bombVariantsR1` und `clownBombReferenceR1`: fehlende `src/private-gen`-GLBs, lokale Umgebung.
    - `begegnungTakt`: Zeitlimit unter Last; einzeln grün (8,5 min Laufzeit unter Last).
- `npx vite build`:
  - Einzeldatei-Build bricht mit `Failed to convert rust &str into napi string` ab. Das ist die bekannte Grenze mit vollem Private-Bestand; der Ride ist nicht im Spiel-Bundle.
  - `KFB_SPLIT=1 npx vite build` ist grün. Gebaut in einen Scratch-Ordner, danach gelöscht.
- Rauchtest: Ride im Aqua-Host (Overlay) ganz durchgefahren, 0 Seitenfehler, Engine im Worker.
- Die beim CI-Lauf erzeugten `test/evidence`-Änderungen wurden verworfen, nicht committet.

## 5 · Belege (`replies/AQUA_RIDE_R4/_privat/`)
- `belege_r{1..4}/ride_r4.mp4`: ganzer Ride mit Song, ECHO-Stimme und Ducking, 1280 × 720, 30 fps.
  - Ab R2 mit Einsaugen am Anfang.
  - Ab R3 mit 4 s Ankunft.
  - In R4 Ton nach dem Ausstieg wie im Host (Song klingt aus, Heist-Titel setzt ein).
- `belege_r*/stills/`: Abschnitte B1…D und die drei Monitore.
- `belege_r*/protokoll.json`: Engine ein/voll/aus, alle Farbwechsel und Monitore mit Songzeit, Takt und Videozeit.
- **Erfasst** in einem Overlay der Aqua-Seite: Alles ist verlinkt, nur `index.html` hat den Host-Patch, der Ride kommt aus diesem Zweig. Feste Zeitschritte (virtuelles rAF), der Song folgt der Ride-Uhr. Aqua-Dateien sind unangetastet.

**Protokoll Runde 4** (`belege_r4/protokoll.json`; Video 189,5 s, Ride ab Video 0,9 s nach dem Einsaugen):

| Ereignis | Songzeit | Takt | Video |
|---|---|---|---|
| Engine blendet ein | 22,87 s | 13,05 | 8,5 s |
| Engine voll | 26,50 s | 14,97 | 12,1 s |
| Farbwechsel B2a / B2b / B3 | 41,67 / 53,00 / 73,73 s | 23,01 / 29,02 / 40,01 | 27,3 / 38,6 / 59,4 s |
| Farbwechsel C / C2 / B4 | 109,60 / 132,23 / 136,00 s | 59,01 / 71,01 / 73,01 | 95,2 / 117,9 / 121,6 s |
| Farbwechsel B4h / B4a / D | 169,97 / 177,50 / 196,37 s | 91,01 / 95,00 / 105,00 | 155,6 / 163,1 / 182,0 s |
| ECHO „Free at last!“ (rechts) | 32,22 s | 18,01 | 17,9 s |
| ECHO „But they're watching…“ (links) | 132,69 s | 71,26 | 118,3 s |
| ECHO „Be careful, little fish…“ (rechts) | 192,59 s | 103,00 | 178,2 s |
| Ausstieg, klares Wasser (mix 0) | 199,90 s | 106,87 | 185,5 s |

## 6 · Blind-Kritik (frischer Kritiker je Runde, nur ABSICHT, GENRE, Belege, Prompt und Matrix; Paarvergleich gegen `DC_AQUARIUM/r61/ride_r61.mp4`)

| Runde | A | B | C | D | E | F | G | H | Mittel | Urteil |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 7 | 7 | 6 | 6 | 6 | 7 | 7 | 6 | 6,50 | FAIL |
| 2 | 8 | 7 | 6 | 7 | 6 | 7 | 7 | 6 | **6,75** | FAIL |
| 3 | 6 | 6 | 5 | 5 | 7 | 5 | 6 | 5 | 5,63 | FAIL |
| 4 | 8 | 7 | 6 | 7 | 5 | 7 | 6 | 5 | 6,38 | FAIL |

**Paarvergleich gegen R3:** In allen Runden ist R4 bei Absicht, Ziel-Treue, Bewegung und Ton besser. Der Kritiker bestätigt jedes Mal, dass sich die Engine nicht wiederholt, die Farbwechsel auf den Takten liegen und die Stimme hörbar über der Musik sitzt (+4–7 dB).

**Was je Runde umgesetzt wurde:**
- **Nach R1:**
  - Ring-Stroboskop: Fassungen nahe der Kamera blenden aus.
  - Umklappen beim Kamerawechsel: jetzt ein Schwenk.
  - Energie-Bogen der Engine.
  - Ruhige Mitte um den Fisch.
  - Erfassung mit Einsaugen und Ankunft.
- **Nach R2:**
  - Schwenk weiter außen am Fisch vorbei.
  - Engine satter: weniger Wasserschleier, stärkerer Abschnittston.
  - Höhepunkt gedeckelt.
  - Phrasen-Akzente.
  - Audio-Länge in der Erfassung korrigiert.
- **Nach R3:**
  - Engine in den Zeitlupen sichtbar.
  - Schwenk ruhiger (0,6 s).
  - Ton nach dem Ausstieg wie im Host.

- **Nach R4 (ohne neue Kritik, Stamm §5):** Der Monitor setzte beim Tippen neu an. Behoben: Die Monitorfläche wird 3 s vorher angelegt, der Satz läuft als ein Segment wie im Becken. Mit Stills geprüft, das Tippen läuft jetzt in einem Zug durch. Steckt in Commit ea9d17a1, nicht im Video `belege_r4`.

**Stopp nach Regel:** Runde 3 und 4 haben das beste Mittel (R2, 6,75) nicht übertroffen. Ohne Zielbild schwanken die absoluten Werte der Kritiker stark (5,6–6,75 bei sehr ähnlichem Stand).

**Kleinster Blocker als Karte:** Die Fahrdynamik von R3 (Bahn und Kamera wirken trotz Loopings starr, der Fisch spielt nicht mit) und Aquas Bildüberlagerung (Bloom, Aberration, „Exit Now“ mittig). Vorschlag für die Hub-Karte: R4-Video gegen R3 als Paar zeigen, mit der Frage „Rausch-Richtung PASS, Fahrgefühl als eigener Schritt R5?“. Alternativ Zielbilder per Webchat für den Engine-Look in der Röhre.

## 7 · Abweichungen vom Brief und Registerregeln
- **Register/SOP (Ast 8, Georg 23.11.):** „Texte aus Stringtabelle, kein Text fest im Code“. Georgs drei Zeilen stehen deshalb wörtlich in `ride.texte.en.json`, nicht im Modul.
- **Monitor-Look:** Den Monitor-Look gibt es nur in Aqua. Er kommt deshalb über eine Fabrik vom Host; das Modul gestaltet nichts Eigenes. „Nur Import tauschen“ reicht für Monitore und Shot-Ring daher nicht ganz: Der Host ergänzt `renderer` und `monitor` (Abschnitt 2).
- **Engine-Einstellungen:**
  - Unverändert bis auf Helligkeit und Mischung.
  - Die Uhr läuft auf Song-bpm statt 112, damit die Engine-Schnitte auf den Takten liegen.
  - **Befund HN-Kammer:** `hnKammer.js` reicht seine Paletten in 0…255 durch, die Engine erwartet 0…1 (`hex01`). In der Kammer wird die Palette dadurch weiß. Im Ride werden dieselben Paletten korrekt in 0…1 übergeben. `hnKammer.js` ist nicht geändert; Hinweis an den Besitzer.
- **„Kurz klares Wasser“:** Aqua startet den Ride auf Takt 9. Die Engine kommt mit dem ersten Tempoanstieg auf Takt 13, also gut 7 s klares Wasser nach dem Einsaugen.
- **Zweiter Kommentar:** liegt auf Takt 71,25 in der Zeitlupe vor der Jagd. Ein Kritiker schlug Takt 73 vor; das ist ein Einsatz (Drop) und damit laut Brief ausgeschlossen.

## 8 · Offene Punkte
1. **Fahrdynamik R3 (Kritik R3, D/B):** Bahn und Kamera wirken trotz Loopings starr, und der Fisch spielt nicht mit (keine Pose oder Reaktion auf Kurven und Tempo). Das betrifft die von Georg abgenommene R3-Bahn (q845) und die Fisch-Animation des Hosts, nicht diesen Brief. Vorschlag: eigener Brief „Ride R5 Fahrgefühl“ (Kamera-Roll/Neigung je Abschnitt, Fisch-Clips je Abschnitt).
2. **Ton-Dynamik:** Der Song-Mix ist flach (LRA 0,9 LU), die Abschnittswechsel sind kaum hörbar. Das ist Host bzw. Song; der Ride liefert dafür `hn.wechsel`, `ducken` und `musik`.
3. **Host-Look:** Im Licht und Bloom wird der Fisch grau, in C kommt die chromatische Aberration aus Aquas `fx` (`warp`). Beides gehört dem Aqua-Host.
4. **Einsaugen/Ankunft:** Wolkenfetzen und harter Schnitt gehören dem Host (Phantasm und Feder-Flipbook), unverändert gegenüber R3.
5. **Handy-Messung** fehlt. Es stand kein Gerät zur Verfügung.
6. **Engine-Inhalt:** Ein Motiv aus dem Pool taucht in mehreren Abschnitten wieder auf. Das ist Pool bzw. Ring des Kerns; Ausschluss je Fahrt wäre Kern-Arbeit (WSV).
7. **Monitor-Ausklang:** Nach dem Satz zeigt der Schirm bis zum Ausflug wieder die Engine. Ein Kritiker las ein gedrehtes Plakat („Panta rhei“) als Fehler; das ist Engine-Inhalt der Sender-Ebene. „Exit Now“ steht mittig unten (Aqua-HUD).
8. **Für Aqua:** Pool-Quellen mitkopieren oder `hn.material` übergeben, Host-Patch einbauen, Stimmdateien für die drei Sätze erzeugen.
