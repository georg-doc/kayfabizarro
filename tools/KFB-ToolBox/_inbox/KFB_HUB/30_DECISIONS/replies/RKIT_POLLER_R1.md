# RKIT · Poller geliefert (V-150 #8, Vorlage RKIT_POLLER_VORLAGE_R1, Steuerung 11.10. Variante A) (R1)

Stand 2026-10-11 · Lieferung: `Lab/public/roadbeds/rkit_poller.parts.glb` (sha 38456d6258c1) + `rkit_poller.parts.json` · Builder privat `~/Developer/rkit-r3/blender/rkit_r3_poller.py`, `run_poller.py`

## Maße (lab)

| | Wert | Herkunft |
|---|---|---|
| Höhe über Platz | **0,85** | Hüfte im Bild: Farmer A (Lab-Datei `public/assets/kaykit/figures/Farmer_A_NoEyes.glb`) Beinansatz 0,519 × FIG_SCALE 1,6 = 0,83 |
| Schaft Ø | 0,50 → 0,44 (leicht konisch) | |
| Kragen | Ø 0,60 × 0,16, Rundung 0,03, Kehle 0,02 | wie Kantenstein, ohne harte Kante |
| Kopf | gewölbt, 0,14 hoch | |
| eingelassen | 0,30 unter Platz (geschlossener Körper) | |
| Töne | Kragen stone[1], Schaft stone[0], Kopf stone[2] (Masonry A) | ROLE_MAP / startTones in parts.json |

## Anker-Regel (in `parts.json` → `anchorRule`)

- Pfosten entlang der Platzkante, Mittellinie **0,60** innerhalb der Kante.
- **Lichte Weite 1,80, Mittenabstand 2,30.** Erster und letzter Pfosten **0,40** + d/2 vor den Kanten-Enden.
- An Zufahrten bleibt die Reihe geschlossen, außer das Layout setzt ausdrücklich `gate`.
- **Warum diese Werte:**
  - Figur: Walker-Radius 0,59 × 2 + 2 × 0,15 = 1,48 ≤ 1,80.
  - Auto: schmalstes registriertes Auto 2,76 (Retro Carrier; KayKit mit gemeinsamem Faktor 2,80) − 2 × 0,25 = 2,26 ≥ 1,80.

## Prüfung

- **Q1–Q9 PASS** (dev04): nichts schwebt, keine Durchdringung, **keine scharfe Kante** (Q5 = 0), Kopf vorhanden.
- **Renders selbst angesehen**, mit Figur (FIG_SCALE 1,6) und KayKit-Sedan (6,28 lang, 2,80 breit) als Maßstab, abgelegt in `~/Developer/rkit-r3/evidence/poller/dev04/`:
  - Reihe in Augenhöhe;
  - Pfosten nah;
  - Kopf und Kragen;
  - Auto vor der Reihe;
  - Draufsicht auf die Lücke.

  Ergebnis: Die Oberkante liegt auf Hüfte bzw. Bauchunterkante der Figur. Die Lücke ist sichtbar schmaler als das Auto, die Figur steht frei darin.
- **Lab-Parität:** **nicht gelaufen**. `tools/parity/parity.mjs` bricht im aktuellen Lab-Stand beim Laden der Spiel-Seite mit Timeout ab (180 s). Das Lab bindet `rkit_poller` noch nirgends ein, die neue Datei kann das nicht verursachen. Bitte die MVP-Sitzung, die Parität beim Einbau laufen zu lassen; ich wiederhole sie, sobald die Seite wieder lädt.

## Korrektur der Messung (Icosphere)

**Erster Versuch:** Ich hatte die Höhe zunächst mit 1,50 angegeben. Die Bounding-Box schloss eine „Icosphere“ ein, die 1,0 unter die Füße reicht.

**Nachgeprüft:** Die Lab-Datei enthält diese Kugel **nicht**; sie hat 7 Meshes, wie die MVP-Sitzung sagt. Der **Blender-glTF-Import** legt sie selbst an, als Knochen-Darstellung (custom shape für 23 Knochen). Es gibt also keine falsche Datei.

**Regel für Messungen in Blender:** importierte Objekte namens `Icosphere`, also Knochenformen, ausschließen.

**Folge für die Höhe:** 0,85 ist mit der Lab-Datei gemessen und gilt.
