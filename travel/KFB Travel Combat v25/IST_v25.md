# IST · KFB Travel Combat v25 (living document)

Zweck: **eine** Seite, die sagt, was gerade wahr ist. Kein Verlauf (der steht im Changelog), keine
Absicht (die steht im Sprint). Wenn hier etwas nicht mehr stimmt, wird es hier geändert.

Stand: **2026-09-09**, Version **v25.2s**.

---

## 1 · Zustand je Artefakt

**AKTIV** = wird bearbeitet · **FROZEN** = läuft, wird nicht angefasst · **SUPERSEDED** = abgelöst

| Artefakt | Zustand | Anmerkung |
|---|---|---|
| `KFB Travel Combat v25.dc.html` | **AKTIV** | Wirt. Einstiegspunkt. |
| `terrain-v25/` (69 Dateien) | **AKTIV** | 13 davon in v25 geändert, siehe §2 |
| `terrain-v24/` + `KFB Travel Combat v24.dc.html` | **FROZEN** | Vergleichsmaßstab. Nicht anfassen. |
| `docs/travel-v25/SPRINT_v25.md` | **FROZEN** | Sprint abgeschlossen. Enthält Clean-Run §4. |
| `docs/travel-v25/CHANGELOG_v25.md` | **AKTIV** | Additiv nach oben, jede Änderung mit Zahl. |
| `docs/travel-v25/PLAN_einbau-v11-in-travel-combat-v24.md` | **SUPERSEDED** | Der Einbau ist erfolgt. Historie. |
| `SPRINT_v26.md` | **AKTIV** | Planung, kein Code. |
| `ONBOARDING_v26_frischer-Chat.md` | **AKTIV** | Einstieg für neue Sitzungen. |
| `kfb-asset-library.json` (4,3 MB) | **FROZEN, extern** | Laufzeit per RAW-URL, nie im Bündel. |
| `uploads/kfb-asset-library (N).json` | **löschbar** | Alte Kopien, sobald die Repo-Fassung steht. |

---

## 2 · In v25 geändert (13 Dateien, Nähte 167–179)

Ermittelt über die Versionsmarker `v25.2a` … `v25.2s` im Quelltext. Die Zahl in Klammern ist die
Anzahl der Marker in der Datei, also grob die Anzahl der Eingriffe.

`travel-poc.js` (31) · `combat-host.js` (12) · `pet-kinetics.js` (11) · `slot-dice.js` (4) ·
`voxel-terrain.js` (4) · `walk-controller.js` (4) · `settings-schema.js` (3) · `combat-hud.js` (2) ·
`combat-shots.js` · `pet-lighting.js` · `settings-overlay.js` · `travel-stage.js` ·
`voxel-glyphs.js` · `hud-cube.js`

**`ground-shadow.js`** (Naht 170) trägt keinen Marker — dort sucht man nach dem Dateinamen.

Die übrigen ~55 Dateien in `terrain-v25/` sind seit dem Fork aus v24 unverändert. Sie gehören in
jeden Export (das Spiel braucht sie), aber nicht in eine Änderungsliste.

---

## 3 · Zahlen, die gelten

| Größe | Wert | Herkunft |
|---|---|---|
| Pet-Höhe am Boden | 3,2 u | Maßstabs-Entscheidung v25.2d |
| Mob-Skalierung | `K.h × 1,6` | `sky-mobs` |
| Rakete | 34 u/s · 3,2 s Leben · **109 u** Reichweite | `speed × leben` |
| Würfel | 30 u/s (war 22) | v25, Wirt-Wert |
| Mündungsversatz | `rad × 0,9 + 0,18` vor der Silhouette | `rad` = gemessener Körperradius |
| Knockback | 0,9 (war 0,55) | Naht S1, **Urteil offen** |
| Renn-Bob | Amplitude 0,055 · Stauchung 0,075 | Naht 179, **Urteil offen** |
| Kadenz Gehen/Sprint | 2,00 / 2,01 Zyklen/s | gemessen — identisch, das war der Fehler |
| Schuss-Pool | 48 Schüsse · 64 Sprites | `combat-shots.js` |
| Kreise je Wurf | **10,6** = `0,28 × 34 / 0,9` | nicht gerundet |
| Schrittmaß-Kandidaten | 2,70 vs. 0,3731 (Faktor 7,24) | `schrittmass.json`, 41 Messungen |
| Draw-Calls | 57 | Grundlage für die fps-Probe |

---

## 4 · Bekannte offene Punkte

**Braucht Georgs Auge:** Renn-Bob · Trefferreaktion · Schrittmaß · Asset-Maße.
**Braucht ein fokussiertes Fenster:** `fpsprobe(5)` · `poolprobe(6)`.
**Braucht eine Entscheidung:** Sky-Karten-Deck (§0 in `SPRINT_v26.md`).
**Rückstand v24:** Terrain-Eigenschatten · Terrain-Karten · Balancing Hornet/Bog · Tanz-Abgriff ·
Library abspecken.

Details und Aufwand: `SPRINT_v26.md`.

---

## 5 · Assets und Pfade

Schwere Dinge (GLBs, Skydome, Texturen, Asset-Library) laufen **per RAW-URL** aus
`georg-doc/kayfabizarro`. Nichts davon gehört in ein Bündel.

**`edge3.jpg` — am 09.09. korrigiert.** Der kanonische Pfad zeigte auf
`media/3D_Assets/Textures/edge3.jpg` und antwortete mit 404; die Datei liegt in Wahrheit unter
`travel/travel-v16/terrain-v16/edge3.jpg` (2543 B). Drei Module luden sie:

| Modul | vorher | jetzt |
|---|---|---|
| `voxel-terrain.js` | lokal, Rückfall 404 | lokal, Rückfall **gültig** |
| `hud-cube.js` | lokal, Rückfall 404 | lokal, Rückfall **gültig** |
| `voxel-glyphs.js` | **nur lokal** | lokal, Rückfall **gültig** |

`voxel-glyphs.js` war der eigentliche Standalone-Fehler: ohne `terrain-v25/` daneben blieben die
Voxel-Glyphen texturlos, ohne dass irgendetwas im Log stand.

Reihenfolge bleibt **lokal zuerst, RAW als Rückfall** — in der Vorschau spart das den Netzweg, im
Standalone greift der Rückfall. Wenn `edge3.jpg` einmal an einen kanonischeren Ort im Repo wandert,
ist das eine Änderung an **drei** Stellen, nicht an einer.

---

## 6 · Wie man prüft, dass alles steht

1. DC öffnen, Konsole gegen `SPRINT_v25.md` §4 (Clean-Run) halten.
2. `petKin.bobReport()` — antwortet das Modul?
3. `await __travelPOC.fpsprobe(5)` im **fokussierten** Fenster.
4. `__travelPOC.setMode('fly')`, dann `combat.poolprobe(6)`.

Eine Probe, die sich verweigert, ist kein Fehler, sondern die Probe, die ihre Arbeit tut: sie hatte
zu wenig Daten. Eine Probe, die im Hintergrundfenster läuft, misst nichts — `requestAnimationFrame`
liefert dort null Frames.
