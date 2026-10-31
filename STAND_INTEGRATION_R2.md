# Stand · Integration R2 (Stamm `game/integration-r2`) · WS1-Lead → WS0

Laufender Stand statt Übergabe (N-009). Stand Sa 31.10.2026 abends. Kanal `comms/ws0-ws1` bis Q-020. Georgs Abnahme-Seite: Artefakt „Integration R2 Abnahme“, Version 13 (https://claude.ai/artifact/DzND8ywKn539BQnRcU758D).

## 1 · Standard (ohne Schalter)
| Bereich | Inhalt | Rückweg |
|---|---|---|
| HUD v6 | Neues Design (Paket `KFB_HUD_v5_WS0`): Almanach mit Deck-Viewer (KFB Card Viewer auf dem Deck-PDF der Registry), 3D-Zielpfeil, Leben, Fluff, Radio, Zahnrad, Tempo, feste Aktionsleiste (3 Fächer für Fundsachen), Reise-Auswahl ohne Neuladen. Fenster (L3) im v6-Rahmen, HUD-Größe 80–110 %, Schriften im Spiel. Code `src/hud/hudV6.js`. | `hud=3d` |
| Startzeit R1 | Erstes Bild 1,3–2 s, spielbar 9–11 s. Amphitheater, Billboard und Partner kommen verzögert (`stage=now` sofort). | – |
| Themenwelt, Zielpfeil | Standard seit Georg 31.10. | `theme=0`, `goal=0` |
| Karten | Echte Karte je Platz, als Gelände (Relief aus dem Motiv, Bild darunter) und eingesammelt (flach). | `cardart=0` |
| Belegungsregel | `src/world/occupancy.js`; die neue Schicht `water` (bei `water=1`) liegt nach den Oasen. | – |
| Steine Wüste R1 | Kiesel in Flecken (Georg: „so lassen“); WFC-Anordnung bei `world/verteiler-r1`. | `stones=v904` |

## 2 · Hinter Schaltern (wartet auf Georg)
- `water=1`: Wasser F1/F2 Runde 1. Siehe §3.
- `baellebad=1` (zusammen mit `water=1`): Bällebad-Probe, eine Wanne aus Kugeln im nächsten See.
- `encounters=1`, `start=card` (Testhilfe).
- Verworfen: `lakes=1`, `rivers=1`. Sie werden entfernt, sobald Georg F1 abnimmt (N-010).

## 3 · Wasser F1/F2 R1 (`water=1`, N-010/N-012)
- **Bestand:** `kfb-hydro.v1` und `kfbWater` aus der Gelände-Probe, unverändert bis auf zwei Parameter mit Probe-Standard: `lakeDepth` (Probe 3,5 m, endlos 40 m) und `endFromTerrain` (Probe aus, endlos an).
  - Grund für die Parameter: Der Seezulauf übernahm den Pegel des randvoll gedachten Beckens. Der See wird danach aber auf einen Teich gekürzt, und in den großen Mulden der Endlos-Welt standen Flüsse dadurch bis zu 11 m über dem Gelände. Das betrifft auch die Probe-Quelle (`probe/gelaende-probe.html`); bitte an deren Owner melden.
- **Fenster** (`src/world/hydroEndless.js`):
  - Kern 1024 m, Rand 512 m, Raster 4 m.
  - Das Raster entsteht in Zeitscheiben (≤ 6 ms), die Hydrologie läuft im Worker `hydroWorker.js` (0,4–0,9 s je Fenster).
  - Die Ausgabe ist auf den Kern beschnitten. Ist ein Fenster fertig, werden Gelände und Bewuchs dort neu gebaut.
  - Belegtes (Start, Krater, Orte, Karten, Tafeln, Oasen) wird ausgespart: dort kein Bett und kein Spiegel, Rand 12 m. Ein erster Versuch mit Erhebungen im Raster erzeugte künstliche Senken und wurde verworfen.
- **Darstellung** (`hydroWater.js`): `createWater` je Fenster mit einem 2-m-Höhenraster (Zeitscheiben). Unterwasser und Blasen kommen aus kfbWater; Wagen schwimmen über `waterActive.level`.
- **Gischt** (`hydroSpray.js`): Kugel-Kern `wake` am Wagen im Wasser, Kugel-Kern `impact` an Uferpunkten. Fluidfarbe aufgehellt.
- **Bällebad** (`ballPit.js`, `baellebad=1`): Kugel-Kern `relief`, 128² Kugeln auf 32 × 32 m Wasserfläche. Wagen und Figur schieben die Kugeln weg, sie kehren zurück.
- **Messung** (`scripts/ir2/water-debug.mjs`, Nahtprüfung nach Konzept §4): An den Kerngrenzen liegen passende Läufe bis 8,6 m auseinander, mit Pegelsprung bis 2 m und Breitensprung bis 3 m. Damit ist das Prüfkriterium „stetig über 5 Feldgrenzen“ **nicht erfüllt**; R2 braucht die Kanten-Übergabe aus Konzept §3.2.
- **Offen:**
  - Kanten-Übergabe.
  - Gelände-Neubau eines Fensters dauert 10–20 s (sichtbar, wenn man hinsieht).
  - F3 (Fälle) läuft nur über den Bestand; Meer und Küste (F4) später; Tauchen nach F4.

## 4 · Tests (Stamm @22d98ca)
- **Pflicht** (`scripts/ir2/pflicht.sh`, @93b71d6, 31.10. 07:06–08:04): rot 0.
  - PASS: host, j7-roof (13 Racer), fb-shoulder-shadow, closing-build, terrain-seams, hud-3d, **hud-v6 (neu, 16 Prüfungen)**, fb-canon, feature-check (Audio ohne Fehler).
- **npc-suite:**
  - Altfehler: c2, c3 (treesTextured), c3g (`noGlowByDay` widerspricht Georgs Laternen-Wunsch).
  - Auf diesem Mac auch am Startstand rot (Umgebung): talk und m1-ground.
  - Unter Last rot: orbit.
  - Neu waren contract-static (eigener Tasten-Listener des Deck-Viewers) und deps (Schriftpakete ohne feste Version). Beide sind auf @22d98ca behoben und einzeln PASS, ebenso hud-v6.
- **Wasser:**
  - `scripts/ir2/water-shot.mjs` (Bilder, Seen-Prüfung) und `water-debug.mjs` (Höhenvergleich, Nahtprüfung) laufen.
  - `scripts/ir2/pit-shot.mjs`: Bällebad 15 145 Kugeln, Ufer-Gischt 87 Auslösungen in ~30 s, ohne Seitenfehler.
  - Einen festen Test `water` gibt es noch nicht (Vorschlag für R2).

## 5 · Bekannte Fehler und offene Punkte
- **HUD v6:** Die Feder-Animation fehlt. Die Tusche-Kante im Deck-Viewer wartet auf `module/card-edge-r1`. Der Rucksack ist die Truhe im v6-Rahmen, eine eigene `ov=bag`-Ansicht gibt es nicht. Das Gespräch kommt von `game/weltwissen-r1`.
- **Startzeit:** Die Augen-Rig-Montage braucht 2 s je Figur (Q-019).
- **Fahrzeugwechsel:** funktioniert ohne Neuladen; das Ziel < 1 s steht noch aus. Nach N-012 folgt er auf Wasser F0–F2.
- **Krater-Erdlippe (V-906):** fehlerhaft, Georg: nur dokumentieren.
- **Tusche und Kartenbild:** keine gemeinsame Quelle (`docs/BEFUND_INK_UND_KARTENBILD_R1.md`, A-010).

## 6 · Nächste Slices (WS1-Lead)
1. Wasser R2: Kanten-Übergabe, schnellerer Gelände-Neubau (nur betroffene Blätter), F3 prüfen. Danach `rivers`/`lakes` entfernen.
2. Fahrzeugwechsel < 1 s.
3. HUD v6: Federn und `ov=bag`.
