# Straßennetz R04 · Nachmessung nach WSA-Leistungsfix (PR142) · RETURN (WSB, 18.11.2026)

**Auftrag:** WS0 18.11. (1): M4-Startzeitvergleich erneut, gleiche Methode wie Rückgabe 64. Messvorgaben aus `docs/performance-r05/integration/M4_MEASURE.md` @ac781084 übernommen (rec=0 in allen drei, echte Bildzeiten).

## Stände, Gerät, Bauart
- **A = Stamm** `game/integration-r2` @379982b6 (aktueller Kopf; enthält die Basis 84ae5f0 aus der WSA-Übergabe, danach nur Gegner-Augen, Gegner-Blick und Beleg-Standard).
- **B = Kandidat ohne Schalter** `racer/roads-water-controls-r04` @ac781084 (Übergabe-Head, Laufzeit-Code = 915ae549). Danach liegt noch @29b1b883, ohne Änderung an `src`.
- **C = Kandidat mit `strassennetz=r1`**.
- **Gerät:** Mac mini M4, 16 GB, macOS 26.3. Chromium (Playwright) mit Metal, Fenster 640×480, ohne parallele GPU-Arbeit.
- **Bauart:** für alle gleich `KFB_SPLIT=1 npx vite build --base ./ --outDir dist_r05`; ausgeliefert mit `vite preview` (A Port 5301, B/C Port 5302, `Cache-Control: no-cache` + ETag).
- **Hash für alle:** `#m1,car=patch,world=endless,look=terrain3,sky=r1,debug,mute,fahrphysik=patch1,fahrprofil=r1,q=fast,vorlaufkappe=1,hour=15,tlapse=0,prefetch=0,ripple=0,loadprobe=r02,rec=0,racer=<Wagen>`; bei C zusätzlich `,strassennetz=r1`.
- **Ablauf:** beide Wagen, 3 Runden mit wechselnder Reihenfolge (ABC/BCA/CAB), je Stand ein verworfener Vorlauf. Je Lauf: kalt → 30 Spiel-s Fahrt → fern (x −1536) → 30 Spiel-s Fahrt → Rückkehr → warm.
- **Gemessen:** Spielzeit und Uhrzeit gemeinsam. Neu gegen R04 sind die echten Bildzeiten aus den requestAnimationFrame-Abständen, je Fahrt und in den ersten 10 s nach fahrbereit, sowie droppedSteps und JS-Heap.
- **Ergebnis des Laufs:** 18 Läufe, 0 Fehler. In allen drei Ständen gleich je zwei 404 (`@kfb-audio/soul/vehicle_soul_r1` und `genius_loci_cafe_r1/manifest.json`, private Audioquellen), ohne Einfluss auf den Vergleich.

## Ergebnis
**1. Fahrbereit (Median, s):**

| Wagen | kalt A / B / C | C−B | C−A | fern C−B | rück C−B | warm C−B |
|---|---|---|---|---|---|---|
| patch_vireo | 4,00 / 3,87 / 4,06 | +0,19 | +0,06 | −0,22 | −0,01 | +0,55 |
| crimson_flame_dragster | 3,99 / 3,88 / 4,06 | +0,18 | +0,07 | −0,27 | +0,03 | +0,76 |

- Der Startaufschlag von C liegt unter dem Ziel von 0,3 s (kalt +0,18/+0,19 s gegen B, +0,06/+0,07 s gegen A).
- **Warm ist C langsamer:** +0,55/+0,76 s gegen B, +0,14/+0,89 s gegen A. Die Zeitleiste zeigt dafür `requestToUserReadyMs` +0,45 s.
- Die Zeitleiste C−B kalt: +0,44/+0,55 s. Die meiste Zeit kostet das Modell-Laden (Median +0,09 bis +0,9 s, stark streuend).

**2. Der Hänger bei C ist noch da, etwas kleiner:**
- Ab Start ist in jedem C-Lauf ein einzelnes Bild 583–633 ms lang, 4,2–5,9 s nach fahrbereit, dazu ein zweites Bild > 100 ms.
- B und A haben an fast derselben Stelle ein Bild von 183–217 ms (3,7–4,5 s nach fahrbereit). Das ist neu gegen R04 und stammt aus dem Stamm (siehe 3).
- **Verlorene Uhrzeit in den ersten 5 Spiel-s der Fahrt:**
  - C 0,58–0,63 s (R04: 0,75–0,90),
  - B 0,07–0,10 s (R04: 0,22–0,26),
  - A 0,00–0,03 s.
- **Takt:** kleinster 5-s-Takt C 0,89 (unverändert), 30-s-Takt 0,98.
- **Ab Fernpunkt** überall 1,000, Bilder p99 16,8 ms, ohne Bild > 50 ms. C baut 42 bzw. 16 Straßenstücke, lateBuilds 0, maxPrepare ≤ 13,4 ms.
- **Bilder ab Start sonst ruhig:** p50/p95/p99 16,7/16,7/16,8 ms in allen drei Ständen; droppedSteps C 8–14.

**3. Ursache des Hängers (CPU-Mitschnitt C, kalt, `data/r05_haenger_profil_C.json`):**
- Das 600-ms-Bild ist ein GLTFLoader-Rückruf, der `prepareCraterGLB` aufruft (`src/world/craterR1.js:145`, aus `src/world/CraterMesh.jsx:29`). Er passt das Kratermodell auf das Gelände an, sobald das 6,4-MB-Kratermodell nach kfb:ready ankommt (Stamm @cb50ba69 „Ladeplan: Kratermodell erst nach kfb:ready“).
- Dabei fragt der Code `terrain.height(x, z)` je Ecke des Kratermodells ab, am Rand ein zweites Mal `gridHeight`.
- **Mit `strassennetz=r1`** führt jede Höhenabfrage zusätzlich durch den Straßen-Beitrag (Bündel `card_r3.plate`: nächste Straße, Kreuzungen, `surfaceHeight`).
  - Allein dieser Teil kostet im Bild ≈ 195 ms Eigenzeit.
  - Der Zwischenspeicher dort (16.384 Einträge, Schlüssel = exakte Koordinate) trifft bei Krater-Ecken nie.
  - Darum dauert das gleiche Anpassen bei C ≈ 600 ms statt ≈ 200 ms bei A/B.
- **Bezug:** Die Straßen selbst bauen sich dabei nicht (built 0 nach der ersten Fahrt bei C); der Hänger ist die Krater-Anpassung.
- **Ansatz für WSA (nur Hinweis, kein Eingriff):**
  - Die Grundhöhe liegt in `prepareCraterGLB` schon auf einem 1-m-Raster vor (`gb`). Die Ecken könnten daraus bilinear lesen statt `height()` je Ecke aufzurufen.
  - Alternativ die Anpassung über mehrere Bilder verteilen oder den Straßen-Beitrag im Kraterbereich überspringen.

**4. Aus-Parität B gegen A:**
- Kalt B ≈ A (−0,13/−0,11 s), fern −0,08/+0,03 s, rück ±0,01 s; warm −0,40/+0,13 s (warm streut bei allen).
- Takt 30 s und ab Fernpunkt gleich.
- Das 200-ms-Krater-Bild haben A und B gleich.
- Unterschied: B verliert in den ersten 5 Spiel-s 0,07–0,10 s, A 0,00–0,03 s.
- **Heap:** B 258–303 MB ≈ A 264–297 MB. C 524–687 MB, etwa doppelt so viel; das ist JS-Heap, nicht GPU-RAM.
- crimson ab Fernpunkt bei A endet 0/3 auf vier Rädern (wie in R04, Stamm-Eigenschaft an diesem Ort).

## Ziel ≤ 0,3 s plus Takt 1,0
- Startspanne ja (+0,18/+0,19 s gegen B).
- „Takt danach 1,0“ nein: Mit C verliert die erste Fahrt ≈ 0,6 s Uhrzeit durch die Krater-Anpassung mit Straßen-Höhen.
- Warmstart C +0,55/+0,76 s gegen B.
- Kein PASS.

## Dateien
- `scripts/_wsb-r05-start.mjs`: Messung, Kopie von `_wsb-r04-start.mjs` mit rec=0, Bildzeiten, droppedSteps, Heap und HTTP-Fehlerprotokoll.
- `scripts/auswertung_r05.mjs`: Auswertung.
- `scripts/_wsb-r05-haenger-profil.mjs`: CPU-Mitschnitt ab fahrbereit.
- `data/r05_start_roh.json`, `data/r05_start.log`: Rohdaten.
- `data/auswertung_r05.{json,md}`: alle Tabellen, mit Zeitleisten, Collider-Install und Straßenaufbau.
- `data/r05_haenger_profil_C.json`: Funktionen je langem Bild.

## Offen
- R03 (`water=1,racerwater=r03`) und `racercontrols=r04` gegen B: noch nicht gemessen. Ich hole das nach Ohren r1e und der Übergangsstudie nach, wenn WS0 es dann noch braucht (je ≈ 25 min).
