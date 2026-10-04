# SESSION CUT · RESIDENT-FIGHT-SANDBOX-02 · Cartoon-Kontakt · Resident Atlas S15 · 2026-09-30

Status: **DESIGN CANDIDATE**. Abnahme 1–6 ✓, Punkt 3 erst nach einer Reparatur. Kein fps-Nachweis auf dem M1.
Datei: `KFB_Resident_Atlas_S15.html#__fight` ist eine Kopie von S14, nur der Fight-Teil ist neu. S14, S13 und `lib/fight-sandbox.js` sind unverändert.
Geparkt, weil vor diesem Lauf offen: die S14-Knetform-Punkte in `docs/RESIDENT_CLAY_AR_01/OPEN_LATER.md`.

## 1 · Fehler zuerst

1. **Abnahme 3 fiel im ersten Lauf, 0/16.** Die Reaktionsclips setzen die Hüfte direkt nach dem Hit-Stop zuerst 8–63 mm auf den Angreifer zu. `taking_punch` wandert über die 15 Bilder sogar netto hin (Raider −27 mm, Brute −69 mm): Seine Rückstoßrichtung ist am Kopf gemessen, die Hüfte läuft gegen.
   Reparatur: die **Rückstoß-Sperre**. Eine Ratsche an der Verankerung, 15 Bilder lang, danach bleibt der Versatz stehen. Maximal 134 mm (Brute, Kopfstoß). Ergebnis 16/16, abschaltbar. Der Clip bleibt unberührt.
2. **Der Schulterwurf widerspricht Regel 3.** Die Kapseln überlappen um 9,4 cm, deshalb schiebt die Trennung das Opfer 3,53 m weg, und der Griff löst sich. Mit dem Schalter „Trennung“ aus sieht man den Wurf wie authored. Das entscheidet Georg.
3. **Den Knet-Staub des Racers habe ich nicht gefunden** (begrenzte Suche). Puff und Wolke sind neue Knet-Klumpen aus dieser Session.
4. **Puff-Größe = Radius.** Mit 0,25 m Durchmesser verschwand der Puff ganz zwischen den Raider-Köpfen. Auch jetzt liegt er bei Raider vs Raider seitlich halb hinter den Köpfen.
5. **Drahtgitter verdeckten den Puff.** Die Debug-Formen sind deshalb jetzt Linienringe: drei Großkreise je Kugel, dazu die Kapselkanten.
6. In den Vorschau-Screenshots zeigt das Szenen-Menü „Goth Girl“, obwohl `who.value` = `__fight` ist. Das ist ein Darstellungsfehler der Aufnahme und keine Szenen-Verwechslung.

## 2 · Gebaut

- `lib/fight-sandbox-02.js`: Staging nach `runtimeRules`, Trennung in jedem Bild, Hit-Stop, Squash um die Hüfte, Knet-Puff, Rückstoß um die Hüfte, Folgeclips ohne Rücksprung. Dazu Staubwolke, Schulterwurf (nur Brute vs Brute), Messung (`measureAll`, `testFx`) und Urteile v2.
- `data/fight-sandbox-02.json`: 33 Clips, Figuren, Ring, Hammer. Keine Kampfwerte.
- Panel: Beweis-Set oder Frei · Ampel für visualGap · Regler (Hit-Stop, Squash breit/hoch/Dauer, Puff) · Kamera-Stupser · Debug · Sperre · Trennung · Live-Abstand, Schub und Sperre · Urteil und Export · Abnahme.
- Befund zu den Daten: Kopfkugel-Offset in Bone-Achsen direkt, Höhe exakt (1,429 / 2,945 m). Kontaktbild, Hüfte und Glied stimmen auf ≤ 1 mm. Bild/30 gilt weiter.

## 3 · Abnahme

1 ✓ 17 / 9 / 68 / 6 · 2 ✓ 21/21, knappster Abstand 0,050 m · 3 ✓ 16/16 (roh 0/16) · 4 ✓ 16/16, Fehler 0 · 5 ✓ · 6 ✓ `kfb.fight-sandbox-verdicts/0.2`.
Bilder: `screenshots/s15_fight02/`.

## 4 · Offen

- Georgs Urteil über das Beweis-Set, besonders Brute → Raider hoch (Fehlschlag sichtbar gelassen) und die geschätzten Richtungen `reaction_a` / `standing_react_small_from_right`.
- Schulterwurf: Trennung an oder Ausnahme (Fehler 2).
- Racer-Knet-Staub als echte Quelle nachreichen, falls es ihn gibt.
- fps auf dem M1 für S15 (Fight) und S14 (Friedhof, siehe OPEN_LATER).
- Pin per Branch statt per sha.

## 5 · Nächstes Gate

**Georg spielt in S15 das Beweis-Set und exportiert seine Urteile.** Erst danach wird entschieden, welche Bewegungen neue Clips bekommen (Schubsen, Tackle, Body Slam) und welche Combos der Blender-MCP-Chat überarbeitet.
