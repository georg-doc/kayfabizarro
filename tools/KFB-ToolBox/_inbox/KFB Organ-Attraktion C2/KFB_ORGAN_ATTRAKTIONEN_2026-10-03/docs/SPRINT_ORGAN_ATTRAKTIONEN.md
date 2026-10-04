# Sprintplan · Organ-Attraktionen (Knetwelt-Linie)

Stand 2026-10-03 nachts. Brief: `BRIEF_ORGAN_ATTRAKTIONEN.md`. Stand-Dokument: `LIVING_CLAY.md`. Verlauf: `CHANGELOG.md` (Einträge 03.10. (7)–(18)).

## Erledigt (READY_FOR_DECISION)

| Scheibe | Seite | Modul | Inhalt |
|---|---|---|---|
| N1 Niere | `KFB Nieren-Attraktion N1.dc.html` | `organ-islands.v6.js` | Sturz, Rinne, Blasen-Bumper, Katapult, Schlucht; Harnleiter-Durchstich behoben |
| E2 Darm | `KFB Darm-Attraktion E2.dc.html` | `organ-islands.v7.js` | Tunnel entlang der Colon-Mittellinie, Caecum → Anus |
| G2 Hirn | `KFB Hirn-Attraktion G2.dc.html` | `organ-islands.v7.js` | Sehbahn-Tunnel Stirn → Chiasma → Sehrinde, Spirale um die Hirnoberfläche |
| C2 Herz | `KFB Herz-Attraktion C2.dc.html` | `organ-islands.v7.js` | Weg des Blutes durch beide Herzhälften |

FAIL nach Brief, bleiben als Stand: G1, C1, E1 (`organ-islands.v6.js`).

## Sprint A · Abnahme und Feinschliff (nächster Chat, klein)

1. Georgs Bildurteil zu E2, G2, C2 einholen (Fahrt-Kamera, Portale, 3/4).
2. Stufe an der Hohlvenen-Mündung (flaches Mündungsende schneidet die Gefäßwand): Mündungslänge je Portal aus dem Austrittswinkel.
3. Mündungsfarbe am Caecum (liest Dünndarm-Region) → Region entlang der Röhre statt am Portal.
4. Hirn-Hangstraße: Wand über der Straße im Schatten der Runde darüber (Licht oder Hangtiefe).
Gate: Georg nimmt die drei Attraktionen ab.

## Sprint B · Fahrphysik (erst nach Abnahme, Brief: »später, falls die Physik nicht passt«)

1. Steigungen messen und gegen PHYS (g 15, vMax 27) prüfen: E2 bis 1,52, C2 bis 1,21 (Flexuren, Gefäße).
2. Drive-Assist und Booster-Zonen nur als Track-Core-Daten (drive/markings), wo die Messung es verlangt.
Gate: Fahrt ohne Abheben/Stehenbleiben in der Laufzeit.

## Sprint C · O1-Ring auf v7

1. `KFB Organ-Inseln O1` auf `organ-islands.v7.js`, Ring mit den vier Attraktionen als Abschnitten (Rezepte aus N1/E2/G2/C2 verketten).
2. Querschnitt-Prüfung und Mündungen gelten dann auch im Ring.
Gate: Ring runChecks ohne Fehler, Querschnitt 0.

## Regeln (gelernt in dieser Session)

- Brief als Datei lesen; fehlt er, fragen statt Schablone (G1/C1/E1-FAIL).
- Prüfung über den ganzen Querschnitt (`crossHits`), nicht nur die Mittellinie (N1-Harnleiter).
- Spiralen/Kehren mit Klothoide: ein Kompilat messen, Eintritt verschieben, neu kompilieren.
- Artefakte an Portalen erst messen (Strahl, Override-Material ein-/beidseitig), dann fixen.
- Neue Fassung = neue Datei `.vN.js`, Import mit `?r=`.
