# RKIT · Vorlagen-Zeile Poller (Town-Ausstattung, V-150 #8) · Vorschlag, kein Bau (R1)

Stand 2026-10-11 · Bestand-Suche (V-140): MVP-Sitzung + Steuerung extern CC0 → nichts Passendes. Daher RKIT-Bau im Stil von Lauf 03 bzw. Masonry A.

## Maße: gemessen bzw. abgeleitet, nicht geschätzt

| Größe | Wert (lab) | Herkunft |
|---|---|---|
| Figurhöhe H | 3,64 | K2 |
| Hüfthöhe Medium-Rig | **≈ 1,50** | Farmer-A-Modell: Hüftknochen bei 41,2 % der Modellhöhe (1,406 / 3,411) × H. Bitte im Spiel bestätigen (Frage A). |
| Figuren-Durchgang | ≥ 1,48 | Walker-Radius 0,59 × 2 (gait_v157 `step.radius`) + 2 × 0,15 Marge (V-032) |
| Schmalstes registriertes Auto | 2,76 | Retro Carrier (RKIT_CAR_WIDTHS_R1); KayKit mit gemeinsamem Faktor 2,80 |
| Auto darf nicht durch | lichte Weite ≤ 2,26 | 2,76 − 2 × 0,25 Sicherheitsmarge |

## Vorlagen-Zeile

| Feld | Vorschlag |
|---|---|
| **Weltlogik (§00)** | Die Stadt schützt ihren Platz vor Autos (V-150 #8: Platz nicht befahrbar, bündig). Gesetzt von denselben Steinmetzen wie Bord und Kantensteine. |
| **Form** | gedrungener Knet-Steinpfosten: Fuß-Kragen (wie Kantenstein, gerundet), leicht konischer Schaft, gewölbter Kopf. Keine harte Kante (Regel „keine harten Schnitte“), runde Knet-Form, kein Metall. |
| **Maße** | Höhe über Platz **1,50** (Hüfte); Schaft-Ø 0,60 unten → 0,52 oben (wie Kantenstein-Breite 0,6); Kopf-Wölbung 0,18; Kragen Ø 0,72, Höhe 0,22; 0,30 im Boden eingelassen (geschlossener Körper bis −0,30) |
| **Material / Rolle** | `stone` (Masonry-Familie A, Ton wie BORD / KANTE, `ENV_ROLES[island].stone`), Kragen Ton 1, Schaft Ton 0, Kopf Ton 2; Knet-Flecken wie Lauf 03 |
| **Anker-Regel** | Reihe entlang der Platzkante: **lichte Weite 1,80** (Mitte zwischen 1,48 und 2,26, ≈ ½ H) → Mittenabstand **2,40** bei Ø 0,60. Die Pfostenmitte liegt **0,60** innerhalb der Platzkante. Die Enden sitzen je 0,40 vor dem Kanten-Ende. Durchgänge für Pfade brauchen keine Lücke, weil Figuren überall durchpassen. An Fahrzufahrten (Lieferung o. ä.) bleibt die Reihe geschlossen, außer das Layout setzt dort ausdrücklich `gate`. |
| **Lieferung** | `public/roadbeds/rkit_poller.parts.glb` (ein Pfosten, Ursprung = Bodenmitte auf Platzniveau, y nach oben) + `rkit_poller.parts.json` (Maße, Anker-Regel als Daten {clear 1,8, pitch 2,4, inset 0,6, endGap 0,4}, Q-Werte, Rollen) |
| **Prüfung** | Q1–Q9 (Q1 Boden, Q2 geschlossen, Q5 keine scharfe Kante …), Renders in Augenhöhe und mit Figur bzw. Auto als Maßstab, Lab-Parität |
| **Aufwand** | S |

## Fragen vor dem Bau

| | Frage |
|---|---|
| A | Hüfthöhe im Spiel: Ist ≈ 1,50 lab richtig (Farmer A, FIG_SCALE)? Die MVP-Sitzung kann sie wie das gait messen. |
| B | Lichte Weite 1,80 (Mitte) in Ordnung, oder enger an die Auto-Grenze (2,2), damit weniger Pfosten nötig sind? |
