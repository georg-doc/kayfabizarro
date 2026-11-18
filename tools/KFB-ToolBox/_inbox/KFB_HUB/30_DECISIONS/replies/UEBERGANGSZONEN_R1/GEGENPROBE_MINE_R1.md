# Gegenprobe Übergangslogik R1 · Meshy „Mine Entrance with Ore“ (WSB, 18.11.2026)

**Auftrag:** WS0 18.11. Die fünf SOP-Ergänzungen aus `UEBERGANGSLOGIK_R1.md` (Oasis) sollen an einem zweiten Modell geprüft werden, bevor sie in `kfb_place` übernommen werden. Nur Analyse.
**Modell:** `CLAUDE/MeshyModels/Meshy Mixed 01/Meshy_AI_Mine_Entrance_with_Or_1115200437_texture.glb`.
- Ein Netz, 363.000 Ecken, 1,85 × 1,90 × 0,81 Einheiten.
- Aufbau: Hügel aus großen Brocken mit Holz-/Stahlportal, auf einer Erdplatte mit Schienen und Lore.
- Gewählt statt „Rocky Mine Entrance“, weil das zweite Modell keine Bodenplatte hat (nur Felshaufen, siehe `belege/roh/rocky_*`).
**Einheit:** W wie bei der Oasis 4,2 % der Modellbreite = 0,08 (56 px in der Draufsicht, 1400 px auf 2,0 Einheiten).
**Methode:** Draufsicht und Schrägansichten (Workbench, Textur), orthografische Ausschnitte von Portal, Fuß und Plattenrand. Maße am Bild abgelesen (±30 %).
- Die automatische Höhenmessung (`scripts/mine_messung.py`) ist verworfen: Im Raster fehlte das Lochfüllen, Lücken zählten als Rand. Die Ergebnisse sind nicht verwendet und nicht im Bündel.

## Ergebnis je SOP-Ergänzung
| # | Ergänzung (Oasis) | Mine | Befund |
|---|---|---|---|
| 1 | Brocken-Kranz am Wandfuß, Wechsel Brocken – Büschel | **teilweise** | Brocken lehnen direkt am Bauteil: an beiden Portalpfosten ein Haufen, 1,5–3 W große Brocken. Büschel gibt es keine (keine Pflanzen), der Wechsel ist also nicht prüfbar. Die Größe hängt vom Bauteil ab; die Oasis-Zahl 0,5–0,8 W gilt hier nicht. |
| 2 | Ausreißer 1–2,5 W vor der Kante | **bestätigt** | Einzelne lose Steine (0,3–0,7 W) liegen 1–4 W vor den Haufen, die meisten vor dem Portal bzw. dem rechten Seitenhaufen, wenige weiter draußen (einer ≈ 4 W). Die Spanne reicht weiter als bei der Oasis: 1–4 W. |
| 3 | Kleinere Nester [1; 1–2; 0–2] | **bestätigt** | An Fußbrocken sitzen 1–3 kleine Steine, viele Brocken haben keine; am rechten Haufenfuß häufen sich ≈ 10 S innerhalb von 2 W. Eher [1; 1–3; 0–2] als SOP [1; 3; 1–5]. |
| 4 | Tor stärker eingebettet | **deutlich bestätigt** | Die Seitenhaufen ragen 4,5–5 W über die Portallinie vor. Die Erdplatte springt vor dem Portal ≈ 10 W vor, ringsum sonst nur 0,5–2 W. Die meisten losen Steine liegen in diesem Vorfeld, dazu Lore und Schienen. |
| 5 | Harte Wasserkante ohne Streu | **nicht prüfbar** | kein Wasser |

## Was nicht übereinstimmt (wichtig für die Übernahme)
- **Rand der Platte:** glatt und sauber geschwungen mit einer weichen Lippe (≈ 0,2 W), ohne Brösel und ohne Ausfransen.
  - Die Oasis endete ausgefranst (Sprenkel, SOP Schritt 8). Die Mine ist ein Sockel-Diorama mit Platte; das passt zu SOP Schritt 6 („harte Kanten organisch abrunden“), nicht zu Schritt 8.
  - **Folgerung:** Die Sprenkel-Regel gilt für den Übergang ins Gelände, nicht für eine gewollte Plattenkante. In KFB ist das Diorama im Gelände eingebettet, also gilt dort Sprenkel.
- **Größenverlauf am Hügel:** Im Inneren und oben liegen die größten Brocken (2,7–4 W), am Fuß kleinere (1–2 W), dazwischen kleine Keile (0,3–0,7 W).
  - Bei der Oasis lagen die großen Brocken am Fuß einer gebauten Wand.
  - **Regel für aufgeschüttete Haufen/Hänge:** außen und unten kleiner, innen und oben größer, Keile am Fuß.
- **Größenleiter:** Fußbrocken zu Keil ≈ 0,3–0,4, Keil zu losem Stein ≈ 0,7–1. Das sind andere Stufen als bei der Oasis (≈ 0,5). Der Faktor je Stufe schwankt also zwischen etwa 0,3 und 0,6. Als Regel taugt „0,3–0,6, im Mittel 0,5“.

## Empfehlung für die Übernahme in `kfb_place`
- **Übernehmen:**
  - 2 Ausreißer (mit der Spanne 1–4 W).
  - 3 kleinere Nester ([1; 1–3; 0–2]).
  - 4 Tor stärker eingebettet: Seitenhaufen bis ≈ 5 W vor der Torlinie, Vorfeld mit Streu.
- **Übernehmen mit Einschränkung:** 1 als „Brocken lehnen am Bauteil“, Größe relativ zum Bauteil (nicht fest 0,5–0,8 W). Den Wechsel mit Büscheln nur, wo das Biom Pflanzen hat.
- **Offen lassen:** 5 (Wasserkante), bis ein Modell mit Wasserkante geprüft ist.
- **Klarstellen:** Sprenkel (SOP 8) nur am Übergang ins Gelände, Plattenkanten nach SOP 6. Neue Regel: Haufen außen und unten kleiner.

## Dateien
- **Bildbelege:**
  - `belege/GEGENPROBE_MINE_draufsicht.b.jpg` (Draufsicht mit Maßen),
  - `belege/GEGENPROBE_MINE_raender.jpg` (Portal, Fuß, Platte),
  - Einzelbilder in `belege/roh/` (beide Kandidaten) und `belege/roh2/`.
- **Skripte:** `scripts/modell_ansichten.py`, `scripts/mine_ausschnitte.py`.
