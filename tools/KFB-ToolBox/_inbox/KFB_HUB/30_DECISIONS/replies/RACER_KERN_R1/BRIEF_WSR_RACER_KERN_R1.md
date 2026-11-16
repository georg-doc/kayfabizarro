# Für WS-Racer (WSR, neuer Claude-Code-Chat) · Racer-Kern R1: Best-of-Breed aus patch/car und apex-drift als Modul in beide Richtungen · 16.11.2026 (Georg, V-1871)

**Tier 0 (3 Zeilen):**
1. **Kein zweites Spiel neben KFB.** Du baust ein Racer-Modulpaket mit Einbau-Vertrag (wie Infinite Rooms R3: `src/modules/infiniteRooms/HOST_CONTRACT.md`). Dazu kommt ein schlanker eigener Gastgeber zum Testen und Spielen, später auch für DocTrack und CME-Szenarien.
2. **Bestand zuerst:** Gelände, Ton, Fahrzeugmodelle, Fahrton, Bodenhaftung, Drift und Sprung gibt es im KFB-Stamm schon (unten). Du nutzt sie über ihre Schnittstellen und baust sie nicht nach. Was du verbesserst, fließt als Änderung an genau dieser einen Stelle zurück.
3. **Georg sieht nur Geprüftes:** Fahrbelege laufen mit der Fahrkamera des Spiels auf freier Strecke. Fragen an Georg stellst du als Hub-Karte über WS0, mit Video. Vor dem ersten Bau liefert R0 die Bestandsaufnahme und den Modulschnitt, und Georg nickt das ab.

## Warum
Georg (16.11.): Das Fahrgefühl der Patch-Racer ist besser als unser altes (V-1860). Im KFB-Spiel fährt seit heute der Patch-Wagen mit Hanghilfe, Boost, Staub, Reifenspuren, gemischtem Fahrton, Bodenhaftung über Hügel, Sprung und Drift (V-1862 bis V-1867, Hub q727–q732 PASS).

Jetzt soll daraus eine eigenständige Racer-Ebene werden:
- als eigenes Spiel spielbar, auf unserem Gelände und mit ruhigeren Strecken;
- als Baustein in anderen Szenarien (DocTrack, CMEs) einsetzbar;
- ohne doppelten Bau.

Module sollen in beide Richtungen wandern: Racer → KFB-Spiel und KFB → Racer (Gelände, Ton- und Musikbett, Audio-Site, Fahrzeugmodelle).

## Quellen
- **patch/car:** patch.gg/patch/car. Im KFB-Stamm liegt es unverändert unter `src/vendor/patch-car/` (car.js, effects.js, sound.js, audio/, Commit 96d732c2).
- **apex-drift:** patch.gg/micha-ostrowski/apex-drift (Commit 224734fe), selbst auf patch/car gebaut. Neu dort:
  - Streckenbaukasten (`src/spline.js`, `track-model.js`) mit Gelände, Himmel und Szenerie;
  - Drift-Hilfe (`drift-assist.js`);
  - Spielmodi, Medaillen und Wertung als Datentabellen (`data/*.json` mit `npm run check`);
  - Boost-Felder (`pickups.js`), Fähigkeiten (`skills.js`), Bloom und Grade.
- **Remix:** Georg möchte beide als Remix auf Patch. Zuerst `https://patch.gg/llms.txt` lesen und `pch` einrichten. Dann `pch remix patch/car` und `pch remix micha-ostrowski/apex-drift` (oder das Werkzeug `fork_repo` von Patchs MCP). Danach Georg fragen, was er ändern möchte. Die Remixe sind Quelle und spätere Veröffentlichungshülle, nicht der Ort des Kerns.

## KFB-Bestand, den du nutzt
Stamm `georg-doc/KFB-Stunt-Car-Race`, Zweig `game/integration-r2`.

- **Fahren:**
  - `src/m2/M2Car.jsx`: PatchCar, die Fahrweise C hinter `fahrphysik=patch1`. Anschluss an Rapier im Welt-Schritt 1/60 s, Kamera, Rauchfahne über Signale, `M2STATE.drive` und `M2EVENTS`.
  - `src/m2/patchStunt.js`: Sprung (Leertaste) und Drift (Q/E) mit Handbremse und Mini-Turbo.
  - `src/m2/patchHaftung.js`: Schwerpunkt, Abtrieb, Kuppen-Zug und Fluglage, gemessen in `test/_patchhaft-probe.mjs`.
  - Unit-Test: `test/unit/patchStunt.mjs`.
- **Ton:**
  - `src/audio/kfbAudio.js`: ein AudioContext und ein Mischer (V-598). Darin `fahrtonHalt` und die Busse.
  - `src/audio/patchCarAudio.js`: Fahrton „Mischung“, also unser Motor mit echter Drehzahl und Gängen plus Patch-Reifen und Aufprall (q729).
  - Musik und Radio laufen über dieselbe Ton-Wurzel (`/@kfb-audio/`, auf der Website über jsDelivr).
- **Gelände:**
  - `src/world/endlessTerrain.js` mit `height`, `surfaceAt`, Kollider-Streaming und `reserveOpening` (Muster für eine künftige Straßen-Schneise, `gelaendeOeffnung.js`).
  - Zufahrt zu den Kartenvierteln: `src/world/viertelZufahrt.js`, eine Fahrbahn bündig im Gelände mit Sprenkelrand.
- **Fahrzeuge:** Racer-Modelle und Antriebs-Rig (`src/m2/racerRig.js`, `look/vehicleLook.js`). Der Patch-Wagen fährt mit unseren Racer-Modellen; die Vireo-Modelle aus patch/car kommen als Grundmodelle dazu.
- **Welt-Begegnungen:** Verteiler (Pop-ups, Viertel). Die Soldaten-Puppen werden beim Umfahren umgeworfen (V-1868/1869).

## Was du machst

**R0 (nur lesen und planen, kein Bau):**
1. Beide Remixe und den KFB-Bestand lesen.
2. Tabelle „Best of Breed“ je Baustein: Physik, Drift-Hilfe, Kamera, Strecke und Straße, Modi und Wertung, Boost-Felder, Ton, Effekte, Licht und Grade, Menüs. Je Baustein: welche Quelle, warum, und wem er gehört (Racer-Kern oder KFB-Besitzer).
3. Modulschnitt und Entwurf des Einbau-Vertrags `src/modules/racer/HOST_CONTRACT.md`. Der Gastgeber stellt Szene, Rapier-Welt, Uhr, Gelände-Adapter (`height`, `surfaceAt`, Schneise reservieren), Ton-Busse, Fahrzeug-Darstellung und Ereignis-Bus. Der Kern bringt keinen eigenen Renderer, keinen AudioContext und keinen Welt-Schritt mit.
4. Austauschweg festlegen, Vorschlag:
   - Eine Wahrheit: Der Kern liegt im KFB-Stamm unter `src/modules/racer/`.
   - Der eigene Gastgeber ist ein zweiter Vite-Einstieg im selben Repo (`src/racer-host/`, wie die Referenzseiten ohne Spiel-Vertrag).
   - Die Patch-Remix-Hülle bekommt den Kern über ein Exportskript (gebauter Paketordner, angeheftet an einen Stamm-Commit). Änderungen fließen nur als Zweig `racer/*` zurück.
5. RETURN `RETURN_R0.md` in diesem Ordner. Georg nickt über eine Hub-Karte von WS0 ab.

**R1 (nach Abnicken):**
- Racer-Kern mit Patch-Physik und unseren Hilfen (Sprung, Drift, Haftung, Fahrton). M2Car wechselt auf den Kern, sodass nichts doppelt existiert. Diesen Teil baut WS0 ein; du lieferst den Kern mit Vertrag.
- Eine Strecke aus dem apex-Baukasten auf unserem Gelände: Spline folgt dem Gelände, Schneise glätten, Fahrbahn-Skin ohne Banden, Untergrund Asphalt für Haftung und Straßenton. Das ist zugleich der Anfang von Georgs Straßennetz-Idee (16.11.: ruhigere Fahrstrecken mit Kreuzungen, endlos, Begegnungen am Rand). Gelände-Eingriffe stimmst du mit WS0 ab.
- Freie Fahrt im eigenen Gastgeber mit KFB-Ton.

**R2:** Modi und Wertung als Datentabellen (zuerst Freie Fahrt, Zeitfahren, Drift-Wertung), Boost-Felder, Beispiel-Gastgeber für DocTrack und CME.

## Regeln
- Keine Zugangsdaten in Code, Log oder Chat. Private KFB-Dateien (`assets/private`, `src/private`, Ton) bleiben aus allem Öffentlichen.
- Belege: Fahrbelege mit der Fahrkamera, freie Strecke ohne Platzkanten und Kisten (Lehre aus q730). Vergleiche als Video, gleiche Eingaben, Ton nur gleich laut.
- Stamm-Regeln, wenn du dort arbeitest:
  - Smoke-Test und `node scripts/ci/run.mjs` vor jedem Push;
  - Kommentare auf eigener Zeile;
  - `src/m1/M1World.jsx` nie anfassen (WS1).

## Rückgabe
Zweig `racer/kern-r0` bzw. `racer/kern-r1` im Stamm-Repo (privat), RETURN in `KFB_HUB/30_DECISIONS/replies/RACER_KERN_R1/`. WS0 prüft, baut ein und legt Georg die Hub-Karte vor.
