# RKIT R3 · Return · Gate 1b · Reparatur Insel-Übergänge + Anti-Cologne + K2-Maßstab

Datum 2026-10-08 · Produktions-Sitzung Claude Code (Blender 5.2.2, Track Core v0.14) · **Status: ZUR ABNAHME, nicht abgenommen. Stopp für Georgs PASS/FAIL.**

## Georgs Urteil zu Gate 1 und was daraus wurde

| Punkt (Georg) | Ergebnis Gate 1b | Beleg |
|---|---|---|
| **FAIL Insel-Übergänge:** stumpfes Endstück, Lücken, Unterbau passt nicht | **Keine Endstücke mehr.** Straßen laufen *durch* die Inseln und liegen dort auf (Gelände-Fit ≤ 1,09), Widerlager-Klotz entfernt. Zuläufe außerhalb laufen aus dem Bild. Test „keine stumpfen Enden“: 0. Lückenläufe (≥ 6 knapp neben einem Rand): 0. | `a1b.checks.json`, `blender_tests_a1b.json` |
| Teilweise aufliegen + **Auf- und Abfahrten** | **A (große Insel):** Highway 2+2 liegt 44 auf dem Testinsel-Rand auf, **Ausfahrt → Kreuzung → Inselstraße zum Platz → Einfahrt**. **B (kleine Insel otown):** Stadtstraße landet am Südrand, quert die Insel mit T-Kreuzung (Stich zur Stadt), verlässt sie am Nordrand und wird über dem Abgrund zum Highway. | Lab-Bilder `lab_a1b/` |
| **Kurveninnenseite angehoben** (Cologne) | Im neuen Core nie: 0 von 650 Kurven-Samples in A1, 0 in allen Familien. Jetzt **Dauertest** (`anti-Cologne`). | `report-v014.txt`, `report-audit-cologne-a1.json` |
| **Wellige/gefaltete Banden und Flächen** | 0 Wellen (Kante relativ zur Mitte, Auf-Ab-Auf < 30). **Gegenzeuge**: eine absichtlich wellige Strecke wird erkannt (7 Wellen). Dabei gefunden: Die alte Abzweig-Technik (Fahrbahn per Versatz neben einer geraden Linie) hätte nach dem Abbiegen genau diese Faltung erzeugt → ersetzt durch echt ausschwenkende Mittellinie (`DIVERGE`/`CONVERGE`). | `report-v014.txt` |
| **Stützen/Säulen** schlecht konstruiert, nicht höhenvariabel | Cologne-Stützen als Donor **REJECTED**. A1b braucht keine (schwebende Inseln, Brücken frei). Neue höhenvariable Stützenfamilie ist **P2**, nicht gebaut. | Census |

## Maßstab K2 (Korrektur aus der Steuer-Sitzung, eingearbeitet)

Figur 1 H = 3,64 (nicht 1,9), Einheiten H/MC statt Meter. TOWN 1+1 = **19,2 (3 MC)**, TOWN 2+2 = **32,0 (5 MC)**, DRIVING_SCHOOL = **12,8 (2 MC)**, Gehweg 5,2, Bordstein 0,35, Highway-Wand und Geländer 1,3. Spurbreiten unverändert. Details und der **Vorschlag Rennen = Weltmaßstab (`RACE_W` = Rennprofil × 1,46, nicht umgesetzt, wartet auf dich)**: `KFB_PROFILE_FAMILIES_v014_K2.md`.

## Core v0.14 (neu seit Gate 1)

- `EXIT` / `ENTRY` für Weltstraßen: Hauptstrecke behält Linie und Spuren, Rampe erbt Familie (Einbahn, n Spuren), startet/endet bündig an der Fahrbahnkante, Sperrfläche (Gore) mit Deck der Hauptstrecke, Leitwand-Nase, Anpralldämpfer an der Ausfahrt.
- `DIVERGE` / `CONVERGE`: seitlich ausschwenkende Mittellinie, C2, eben.
- `world_overlap`: zwei Weltstraßen dürfen sich nur in Knoten/Modulzonen berühren (Überführung mit Durchfahrtshöhe erlaubt). **Gefunden, weil** `cross_clearance` alle Verbindungsstücke ausblendet und dadurch zwei sich kreuzende Rampen durchgingen.
- `node_finite`: alle Kreuzungs-Koordinaten endlich (eine NaN-Haltelinie an einem Einbahn-Ausfahrtsarm war durchgerutscht).
- Ein `to`, das keine Einfahrt findet, ist jetzt ein harter Fehler (vorher endete die Rampe still stumpf – genau ein Gate-1-Fail-Muster).
- Kreuzungsarme eben gepinnt; Weltstraßen-Querneigung ≤ 4°; MC-Fang über den Mittelstreifen.

## Tests (echte Zahlen)

| Ebene | Ergebnis |
|---|---|
| v0.12-Regression | **329/329**, Bericht byte-identisch zu S13 |
| v0.13-Suite | **60/60** (K2-Erwartungen) |
| v0.14-Suite | **15/15** (Aus-/Einfahrt, Familienerbe, bündige Kanten, Gore/Nasen, Überlappung + Überführung, Anti-Cologne in 5 Familien + Gegenzeuge, harter Fehler bei fehlender Einfahrt) |
| A1b im Core | 9 Routen, 2 Kreuzungen, 2 Module · **0 Fehler** · Graph/Knoten/Module 87/88 (1 Warnung: engster Abbiegeradius an der Inselkreuzung) · Routenwarnung Breitenübergang Stadt→Highway 1:11 statt 1:25 |
| A1b-Inselfit | aufliegend 44 · Lückenläufe 0 (21 Annäherungspunkte < 6 beim schrägen Überqueren eines Randes) · Cut/Fill max **1,09** (3 Punkte über 1,0) · Gebäudeabstand ≥ 1,6 · keine fremde Insel berührt |
| Blender A1b | **8/8**: alle Mündungsnähte ≤ 0,2 mm, beide Endkappen exakt, Aus-/Einfahrt auf der Highway-Kante ≤ 1 mm, keine stumpfen Enden, 0 degenerierte Flächen, alle Teile geschlossen, Ampeln ≥ 4,7 von jeder Spur |
| GLB-Re-Import | **3/3** (A1b 65 Objekte, Teile, Profile; Bounds/Socket-Matrizen 0 Abweichung) |
| Lab | GLB + Testinsel zur Laufzeit, 0 Seitenfehler, Lab-Welt unverändert (4 Inseln gespeichert). Gelände-Vorschau: otown 1874 Vertices (Cut ≤ 0,91 / Fill ≤ 0,67), Testinsel 4888 (Cut ≤ 1,40 / Fill ≤ 1,25) |

## Ehrliche Mängel

1. **Pyramiden-Insel hat keinen Platz für eine Anschlussstelle** (Pyramide ~62 von 93 Breite). A ist deshalb auf einer **Laufzeit-Testinsel** gezeigt (25 × 19 MC, nichts gespeichert). Für echte Inseln: in MC planen (K2).
2. **Gelände-Vorschau** zeigt in einem ~1 breiten Spalt zwischen Highway und Ausfahrt noch Grasspitzen (Inselnetz gröber als der Spalt). Die echte Lösung ist ein Gelände-Schnitt im Insel-/Surface-Owner → `a1b.terrain_request.json` (Querschnitte, Platten, Gore, 4er-Übergang).
3. Vegetation auf der Fahrbahn wird nicht entfernt (Lab-Natur ist zusammengeführt; 0 Dreiecke lagen komplett im Korridor). Freiräumen gehört zum Environment-Owner.
4. Look weiterhin Platzhalter (Rollenfarben), kein KFB-Clay. Familienübergang Highway→Stadt auf der Rampe zeigt kurz Grünstreifen-Farbe (Materialwahl im Übergang).
5. Breitenübergang Stadt→Highway (1:11) ist steiler als die Core-Regel 1:25 (Warnung): auf otowns Nordseite fehlt Platz.
6. Inselkreuzung: engster Abbiegeradius < 8 (Warnung) für die Einbahnrampen.
7. Kein unabhängiger Kritiker; ich habe mein Ergebnis selbst geprüft.

## Ein nächstes Gate (nach deinem PASS)

`RKIT_R3_P2_NETWORK_FAMILIES_AND_STRUCTURES` – höhenvariable Stützenfamilie (ersetzt Cologne-Säulen), Brückenrollen + Geländer an erhöhten Knoten, Familien-Kreisverkehr, Fahrschul-Platz, Bergstraße mit Serpentine + Tunnelportal, `RACE_W` falls freigegeben, unabhängiger Kritiker-Pass.
