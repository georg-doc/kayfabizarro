# Dungeon Track POC R1 · V-182 Schritt 1 (Blockout, fahrbar)

Stand 12.10.2026 · `~/Developer/kfb-dungeon-poc` (Branch `poc/dungeon-track-r1`, nur lokal) · three 0.186.1, Port 5194. Abgelegt von der Steuerung aus dem Agentenbericht.

**Ergebnis: Es fährt.** Eine geschlossene Runde mit echter k2b-Physik, Cicada und J17-Verfolgerkamera, alles aus dem Lab nur gelesen importiert.

## Starten
`cd ~/Developer/kfb-dungeon-poc && npm start`, dann http://127.0.0.1:5194/.
- Fahren: WASD, Shift = Boost, Q/E = Drift.
- P = Autopilot, T = Draufsicht, C = Decke, H = HUD.
- `npm run check` für die Prüfungen, `npm run stills` für die Standbilder.

## Standbilder
- S1 Fackelgang im Labyrinth;
- S2 Fuß der 8-%-Rampe;
- S3 Draufsicht mit Mittellinie;
- S4 Haarnadel um ein freies Wandende.

## Übernommen
- **Aus dem Lab:** `drive.ts` (createStreamDrive mit k2b, Cicada, J17-Schienenkamera), `clay/index.ts`, `drive-test.ts` (V-125-Test unverändert).
- **Aus WhackMan v1:** `wm-recipe.js` (Zeilen 9–13) und `wm-kit.js` (26/26 Teile).
- **Weitere Quellen:** `dungeon-grid.js` → `layout()`, `kit-lab.js`, `dungeon-light.js`, KayKit Dungeon Pack 1.1.

**Neu:**
- Adapter (1 Zelle = 3 × 3 Module);
- Fugenmodell je Wandlage;
- Mittellinien-Stream;
- Rampendeck mit geschlossenen Füllkeilen;
- Fackel-Montage, Lichtpool, Prüfungen.

## Messwerte (lab)
- Gang 17,6 breit. Wände 12,8 hoch, in Rampenhallen 25,6. Etage 12,8.
- Kleinste lichte Höhe 12,24, damit ist V-185 (≥ 9,0) erfüllt.
- Rampe 184 lang, Maximalsteigung 8,00 %.
- 10 Ecken, eckige Innenecke mit Radius 8,8.
- Runde 1153,6 lab (790,1 TC-m).
- Kamera 5,1–6,56 über dem Boden, mindestens 5,86 unter der Decke.

## Prüfungen
- **Konsole:** 0 Fehler.
- **V-125-Test** mit festem Schritt 1/60, Assist 0,8 und 0: underRoad 0, stuck 0, tunnelling 0.
- **Drei Echtzeit-Runden:** Auto nie in einer Wand, immer ≥ 0,10 über dem Boden. Kamera nie in Wand oder Decke.
- **Bildrate:** Median 59,9 fps, Minimum 48,8 in 1 von 2031 Frames.
- **Gegenprobe der Kollisionsprüfung:** 38/38 erkannt.
- **Eigene Meshes:** 0 offene Kanten.

## Probleme
1. Zwei gerade Rampen statt einer Spindel.
2. Haarnadeln mit Radius 8,8 sind zu scharf (bis 3,4 g). Gerundete Innenecken fehlen.
3. Durchlaufendes Sims auf 6,4 Höhe durch den Kopfabschluss der gestapelten Wand.
4. Zwei freie Wandenden ohne Endkappe; kleine Kerbe an den Stürzen.
5. Die Kamera schneidet die Haarnadel, bleibt aber nie in der Wand.
6. Das Licht ist noch zu hell und gleichmäßig.
7. Track Core nicht benutzt (kein runChecks).

## Für Schritt 2
- Track-Core-Route mit runChecks;
- gerundete Innenecke als Knetteil (RKIT oder Blender), dann eckig gegen rund vergleichen;
- Spindelraum 11 × 11 Module;
- Wand ohne Kopfabschluss, Endkappen;
- Licht-Rig, TC1-Portal, Dungeon-Skin im Track Core.

Kamera für V-185: Gemessen wurde hier die J17-Schienenkamera. Im Lab gilt die Federkamera; die Freiraum-Regel richtet sich nach der Kamera des jeweiligen Modus.
