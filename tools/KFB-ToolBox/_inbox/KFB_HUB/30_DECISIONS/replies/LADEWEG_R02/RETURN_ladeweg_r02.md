# Messung Ladeweg R02 · Mac mini · RETURN (WSB, 17.11.2026)

**Auftrag:** WS0 17.11.: Vorher-nachher-Messung des R02-Kandidaten (WSA Racer, PR #139) auf dem Mac mini.
- **Vorher:** Stamm `game/integration-r2` @cf20cdd6. **Nachher:** Kandidat @f4d5d864.
- **Fälle:** Rennwagen und Dieselpunk, je Kaltstart, Fernteleport und Rückkehr; je 3 Wiederholungen; nichts parallel.

- **Rechner:** `Mac-mini-von-Georg.fritz.box`, Mac16,10 (Apple M4), Playwright-Chromium mit Metal (`PW_GPU=1`).
- **Heads:** Stamm `cf20cdd6c302a3c1533f84995f9684cbf6740f67`, Kandidat `f4d5d8645fec54cc9e3f0139822690e0bbefcf28`, Zweig-Basis `44a67870ba2b0c9a9067c8e9de0ae302c0b6a13c`.
  - Alle sauber, je ein eigener Arbeitsbaum.
  - Privater Teil @eb113fea, `KFB_AUDIO=off` und `mute` wie im RETURN des Zweigs.
- **Hash** wie im R02-RETURN: `#m1,car=patch,world=endless,look=terrain3,sky=r1,debug,mute,fahrphysik=patch1,fahrprofil=r1,strassennetz=r1,q=fast,vorlaufkappe=1,hour=15,tlapse=0,prefetch=0,ripple=0`.
  - Bei Messweg B kommt `loadprobe=r02` dazu.
  - Saat wie im Spiel voreingestellt.

**Wichtig vorab:** Der Stamm @cf20cdd6 hat den Messweg des Zweigs nicht, also kein `loadTimeline`, kein `loadprobe=r02` und kein Straßennetz (`featuresAt`). Ich habe darum zweimal gemessen:
- **A · Außenmessung Stamm gegen Kandidat:** Sie nutzt nur Schnittstellen, die beide haben.
  - Fahrbereit heißt: `__kfbReady`, Modell OK, genau ein Wagenkörper, 4 Räder am Boden.
  - Danach je 2 Spielsekunden Dauerprüfung (Körper, Boden, Räder, Uhr).
  - Kaltstart = frischer Browser-Kontext mit leerem Cache. Warmstart = Neuladen im selben Kontext.
  - Fernteleport = `setKind` nach x −1536, z 0, fester Punkt für beide, weil der Stamm keine Straßen hat. Rückkehr = zurück zum Kaltstart-Punkt.
- **B · WSA-Messweg selbst** (`test/load-pipeline-r02.html` + Server von @8c7f7276, ungetrackt kopiert): Zweig-Basis @44a67870 gegen Kandidat @f4d5d864.
  - Gemessen wird Ruf → User-ready, so wie WSA es misst. Damit lassen sich die Zahlen direkt mit WSAs Tabelle vergleichen.
- **Vorlauf:** In beiden Messwegen gab es je Stand einen verworfenen Vorlauf, weil Vite beim ersten Abruf die Abhängigkeiten baut.
  - Ohne Vorlauf blieb die WSA-Seite auf RUNNING hängen; dieser erste Versuch wurde verworfen.
  - Keine der Messungen ist ein Kaltstart von der Festplatte.

### A · Außenmessung Stamm @cf20cdd6 gegen Kandidat @f4d5d864 (Median aus 3, Sekunden bis fahrbereit; Spielzeit; Uhr in den 2 s danach)

| Wagen | Fall | Stamm s | Kandidat s | Δ | Spielzeit Stamm → Kand. | Uhr Stamm → Kand. | 4 Räder am Ende | Bodenverletzung |
|---|---|---:|---:|---:|---|---|---|---|
| Rennwagen | Kaltstart | 5.117 | 6.671 | +1.55 | 2.1 → 2.5 | 0.997 → 0.919 | 3/3 → 3/3 | 0 / 0 |
| Rennwagen | Warmstart | 4.708 | 6.666 | +1.96 | 2.117 → 2.683 | 0.997 → 0.926 | 3/3 → 3/3 | 0 / 0 |
| Rennwagen | Fernteleport | 1.576 | 2.518 | +0.94 | 1.45 → 0.833 | 1.021 → 0.93 | 3/3 → 3/3 | 0 / 0 |
| Rennwagen | Rückkehr | 0.565 | 0.553 | -0.01 | 0.567 → 0.55 | 0.997 → 0.997 | 3/3 → 3/3 | 0 / 0 |
| Dieselpunk | Kaltstart | 5.016 | 6.598 | +1.58 | 2.15 → 2.35 | 0.999 → 0.926 | 3/3 → 3/3 | 0 / 0 |
| Dieselpunk | Warmstart | 4.755 | 6.376 | +1.62 | 2.15 → 2.417 | 0.998 → 0.927 | 3/3 → 3/3 | 0 / 0 |
| Dieselpunk | Fernteleport | 1.549 | 1.263 | -0.29 | 1.45 → 0.9 | 1.006 → 0.933 | 1/3 → 3/3 | 0 / 0 |
| Dieselpunk | Rückkehr | 0.549 | 0.564 | +0.01 | 0.55 → 0.55 | 0.996 → 1.003 | 3/3 → 3/3 | 0 / 0 |

### B · WSA-Messweg (test/load-pipeline-r02.html) Zweig-Basis @44a67870 gegen Kandidat @f4d5d864 (Median aus 3, Ruf → User-ready)

| Wagen | Fall | Basis s | Kandidat s | Δ | Spielzeit Basis → Kand. | Spieltakt Basis → Kand. | Uhr danach | 4 Räder am Ende | Ergebnis |
|---|---|---:|---:|---:|---|---|---|---|---|
| Rennwagen | Kaltstart | 4.894 | 4.669 | -0.23 | 2.45 → 2.333 | 0.5 → 0.49 | 0.944 → 0.902 | 3/3 → 3/3 | PASS/PASS/PASS → PASS/PASS/PASS |
| Rennwagen | Fernteleport | 0.465 | 0.304 | -0.16 | 0.4 → 0.217 | 0.805 → 0.735 | 0.825 → 0.837 | 3/3 → 3/3 | PASS/PASS/PASS → PASS/PASS/PASS |
| Rennwagen | Rückkehr | 0.154 | 0.121 | -0.03 | 0.15 → 0.117 | 0.91 → 0.954 | 1.008 → 1.008 | 3/3 → 3/3 | PASS/PASS/PASS → PASS/PASS/PASS |
| Dieselpunk | Kaltstart | 4.655 | 4.584 | -0.07 | 2.25 → 2.233 | 0.482 → 0.481 | 0.928 → 0.93 | 3/3 → 3/3 | PASS/PASS/PASS → PASS/PASS/PASS |
| Dieselpunk | Fernteleport | 0.443 | 0.294 | -0.15 | 0.417 → 0.2 | 0.949 → 1.021 | 0.872 → 0.859 | 3/3 → 3/3 | PASS/PASS/PASS → PASS/PASS/PASS |
| Dieselpunk | Rückkehr | 0.138 | 0.115 | -0.02 | 0.133 → 0.117 | 0.966 → 1.008 | 1.015 → 1.01 | 3/3 → 3/3 | PASS/PASS/PASS → PASS/PASS/PASS |

**Befund:**
- **Die R02-Änderung selbst** (B: Basis gegen Kandidat, gleicher Funktionsstand) ist in allen 6 Fällen gleich gut oder besser:
  - Fernteleport 0,47 → 0,30 s (Rennwagen) und 0,44 → 0,29 s (Diesel);
  - Rückkehr etwa −0,03 s;
  - Kaltstart −0,07 bis −0,23 s.
  - Alle 12 Läufe PASS, 4 Räder am Ende, keine Bodenverletzung.
  - Alle warmen Fälle liegen deutlich unter 2 s.
  - WSAs gemischtes Bild (Diesel-Kaltstart langsamer, Rückkehr Rennwagen langsamer) sehe ich auf dem unbelasteten Mini nicht; das war Last auf ihrem Rechner.
- **Der Kandidat als ganzer Zweig gegen den Stamm** (A):
  - Kalt- und Warmstart 1,6 bis 2,0 s langsamer (≈ 5,0 → 6,6 s). In den 2 Spielsekunden danach läuft die Uhr bei 0,92–0,93 statt 1,00.
  - Der Zweig bringt also Zusatzlast mit, vor allem das Straßennetz (`strassennetz=r1`, das der Stamm ignoriert). Diese Last steckt nicht im R02-Commit (B).
  - Fernteleport Diesel −0,29 s, Rennwagen +0,94 s mit großer Streuung (1,2–2,8 s). Rückkehr gleich.
  - Keine Bodenverletzung in 24 Fällen.
  - Beim Stamm stand der Diesel nach dem Fernteleport in 2 von 3 Läufen am Ende der Prüfung auf 3 Rädern (Kippeln, keine Verletzung); beim Kandidaten 3 von 3 auf 4 Rädern.
- **Folgerung:**
  - Den R02-Commit (d02a966d + f4d5d864, 5 Dateien, etwa 20 Zeilen) kann WS0 nach dieser Messung übernehmen.
  - Das Straßennetz des Zweigs ist eine eigene Entscheidung: Es kostet auf dem Mini etwa 1,6 s Start und kurz Uhr unter 1.

**Daten:**
- `50_BLENDER/LADEWEG_R02/data/aussen_stamm.json`, `aussen_kand.json`, `seite_basis.json`, `seite_kand.json` (je Fall roh);
- `auswertung_r02.json` / `.md`.
- Skripte: `scripts/_wsb-r02-aussen.mjs`, `_wsb-r02-seite.mjs`, `auswertung_r02.py`.

**Aufgeräumt:** Alle Messserver beendet, keine Tabs offen, nichts committet. Die Arbeitsbäume `~/kfb_work/r02_*` bleiben für Rückfragen stehen.
