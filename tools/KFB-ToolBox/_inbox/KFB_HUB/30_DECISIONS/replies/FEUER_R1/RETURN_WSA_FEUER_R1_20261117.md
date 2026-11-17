# RETURN · WSA Feuer R1 · V-1884 · 17.11.2026

**Status: Modulkandidat geliefert; echter Spieleinbau und Kampfbühnen-Abnahme offen.**

Privates Stamm-Repo: `georg-doc/KFB-Stunt-Car-Race`.
Lieferzweig: `game/feuer-r1-wsa-20261117`.
Verifizierter Liefercommit: `e2f4db907205440e84e6046bf1f88723a48e8b43`.
[Quellen und Einbau-Vertrag](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/game/feuer-r1-wsa-20261117/src/modules/feuer).
Basis: `game/integration-r2@2bd2a1b427208e75eca78cc35e86ab1cf3bb71eb`.
Dateihashes und bestehende Schnittstellen: `src/modules/feuer/SOURCE_LOCK.json`.

## Gebaut

- Eine Datenfamilie für Kerze, Fackel, Lagerfeuer, Feuerschale, Kamin, großes Feuer, Wand/Kante, Front, Feuerball, Brandtreffer, Zündflamme und Flammenwerfer.
- Unveränderte MIT-Ausbreitungsquelle aus `blendi/touch-grass@3bd4f39d9185689efad9dc1c9d4d1f5a89ac708b`, vier Originaldateien unter `src/vendor/touch-grass/`; byteweise gegen den Clone verglichen. Zuerst `patch.gg/llms.txt` gelesen, danach die Originalquellen geholt. Keine neue Patch-Anmeldung oder Remix-Veröffentlichung nötig.
- **WebGL2 passt:** CPU-Ausbreitung, vorhandener GLSL-FireLayer; keine WebGPU-Pflicht. Kein Gras-Zeichner oder Gras-Asset übernommen. Nur der geerbte Zustandspuffer bleibt als technische Abhängigkeit bestehen.
- Brennstoffe Stoff, Holz, Papier und Karton; Stein/Metall/Knete/unbekannt inert. Feuchte hemmt Zündung. Flächen auf Boden und Wand, Windprojektion, bleibende Brandspuren und brennende Zellen je Bild.
- Flächenschaden durch `combatTargets.blastTargets`, stärkste Überlappung je Box; Gegner- und Ende-Kaskaden-Besitzer bleiben zuständig. Gleiches Schadensergebnis bei 30/60/120 Anzeige-Hz.
- Feuerball/Brandkontakt und gerichteter Flammenwerfer mit blauer Zündflamme, warmem Hauptstrahl, Puls-/Haltebetrieb, Kontaktzündung. Eigener Quelladapter für ausgerichtetes Raymarching auf geklonten Materialien, derselbe FireLayer; Herstellerdateien unverändert.
- Tonadapter für vorhandene `atmo.campfire`- und `jet.tank.hiss`-Cues, Bodenkanal mit Priorität 1. Keine Lampen, kein AudioContext, kein neuer Mischer.
- Eigenes Infinite-Rooms-Feuerprofil: Voxel-Hitze, überlappende Dosis gebündelt, Änderungen erst vor dem vorhandenen Physikschritt, gemeinsamer Render-/Kollider-Neuaufbau als erforderlicher Hostanschluss.
- Bühnen-Fixture plus vorbereitetes Prüfskript auf Grundlage von `test/lib/buehne.mjs`.

## Tatsächlich geprüft

`node test/feuer-r1.unit.mjs`: **16/16 PASS**. Material, Feuchte, Wind, Ausbreitung/Brandspur, Wandkoordinaten, feste Zeitschritte, Überlappung/Schaden, einmaliger Tod beim Test-Zielbesitzer, Pilot/Puls/Halten/Stop, Feuerballkontakt, Voxel-Dosis/Kollider-Neuaufbau-Anschluss, Ressourcen- und Ton-Lebenszyklus, begrenzte Dirty-Puffer.

`node test/feuer-r1.webgl.mjs`: **PASS, 0 Browserfehler**, alle drei Testflächen gezündet, tatsächliche 1/5/20 Feuer im FireLayer geprüft, Bilder visuell gelesen. Das ist die isolierte WebGL-Probe, **keine echte Kampfbühnen- oder Gegner-Abnahme**.

Gerät: Apple M1 Max, MacBookPro18,2, 32 GB, macOS 27.0.1. Chromium 156.0.8078.4, WebGL2/ANGLE Metal, 1280×720, DPR 1. Aufnahme 2026-11-17T03:22:52.824Z.

| Feuer | Bildsamples | RAF-Bildabstand Median ms | CPU-Einreichung Median ms | Vollbild inkl. Readback Median / p95 ms |
|---|---:|---:|---:|---:|
| 1 | 210 | 16.7 | 0.30 | 6.6 / 11.2 |
| 5 | 211 | 16.7 | 0.30 | 8.6 / 18.0 |
| 20 | 210 | 16.7 | 0.40 | 11.5 / 17.8 |

Messung nach 1,5 s Warm-up, 3,5 s RAF-Samples, danach 20 gesonderte Vollbilder mit `readPixels`/`finish`. Readback-Werte enthalten Synchronisation und die kleine Hostszene; **keine reine GPU-Zeit und keine isolierten Mehrkosten des Feuers**. Der RAF-Abstand ist durch die 60-Hz-Ausgabe begrenzt. Die Reihe beweist keine 60 FPS im echten Spiel. Das Darstellungsbudget bleibt deshalb 20 Feuer; Ausbreitung und Schaden sind davon unabhängig.

Rohwerte und Bilder: `docs/feuer-r1/evidence/` (family, fronts, pulsed, held, count-1/5/20, webgl.json, unit.json).

## Noch von WS0 / WSA Patch zu verbinden

1. Vorhandene Lagerfeuer/Fackeln/Amphitheater auf die gemeinsame Tabelle umstellen und Doppelhalter entfernen; Welt-Takt/Abbau genau einmal anschließen.
2. Brennflächen und Rohmaterial aus ihrem tatsächlichen Besitzer liefern; bei Flächenrevision entfernen/erneuern. Separate Flächen teilen noch kein automatisches Kanten-Streaming.
3. Waffen-Kontakte an Feuerball/Brandzündung anbinden; WS1 liefert den echten Roboterarm-Düsenpunkt und den Arm-Slot. Kein behaupteter fertiger Armaufsatz im Spiel.
4. Infinite Rooms: vorhandenes Volume/Frame/Rebuild im inneren Level-Besitzer anbinden, Abfrage-Sperre bis zum Physikschritt beibehalten. Die aktuelle öffentliche R3-API bietet diesen Zugriff noch nicht.
5. Echte `buehne=r1`-Prüfung mit Soldat/Kreatur und Ende-Kaskade ausführen; Feuer-Familie, Boden, Stoff, Wand, Puls-/Haltebetrieb aufnehmen. Dafür `KFB_URL=... node test/feuer-r1.buehne.mjs` verwenden. **Hier NOT_RUN:** kein vollständiger privater Source-Checkout mit Git-Zugang; Connector-Dateizugriff und isolierte Modulprobe vorhanden. Der mitgelieferte Host-Prüflauf ist nur syntaktisch geprüft.
6. Ton im echten Mischer hören und gegen Musik/Schüsse beurteilen. Hier nur Adapter-Lebenszyklus geprüft, keine Hörabnahme.
7. Danach Hub-Karte für Georg. Kein Georg-PASS, kein Gesamtspiel-PASS, kein Merge und keine Stage-/Live-Veröffentlichung durch diese Lieferung.

Ein Schmelzrezept ist optional und noch nicht registriert; bestehende Ende-Kaskaden bleiben erhalten. Bestehende Welt-/Waffen-Einstiege wurden in diesem modularen Lieferzweig nicht still umgestellt.
