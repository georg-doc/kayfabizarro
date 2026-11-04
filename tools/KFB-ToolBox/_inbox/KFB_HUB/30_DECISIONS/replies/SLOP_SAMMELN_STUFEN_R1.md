# Slops sammeln: Absurditäts-Leiter, sechs Stufen, Wanted-Liste · R1 · 04.11.2026 · WS0 (Georg q525 PASS)

Baut auf V-1387 (Neuheits-Gewicht 1/(1+1,6·Treffen), Album `kfb.slop-album/1`), V-1416 (Kontroll-Eskalation), V-1417 (Slop-Roster SSOT) und SLOP_METANARRATIV_R1.md. Nichts davon wird ersetzt; das hier verlängert es.

## 1 · Absurditäts-Leiter (Spawn)
- Jeder Slop-Typ bekommt `absurd` 1–6: 1 = gewöhnlicher Hausbewohner (Büro, Oma, Pub), 6 = surreal und absurd. Feld im Roster-Block `karte` als `{ v, src, status }`; Erstwert Verteiler (Familie und Bild, status GEN), Writer's Room setzt DESIGN, Georg GEORG.
- **Fenster:** Mitte `c` startet bei 1. Gewicht je Typ = Neuheits-Gewicht (V-1387) × exp(−(absurd − c)² / (2·0,8²)).
- **Steigen:** Hat der Spieler ≥ 60 % der Typen mit absurd ≤ c im Album, steigt c um 1 (bis 6).
- **Abkühlen:** Das Treffer-Gedächtnis vergisst mit Halbwertszeit 10 min Spielzeit. Ist im Fenster kaum noch Unbekanntes (Summe der Neuheits-Gewichte unter einer Schwelle), sinkt c langsam Richtung 1,5. Bekannte werden so wieder wahrscheinlich; Rhythmus vertraut → seltsam → absurd → vertraut.
- **Fraktal auch je Bresche:** Die ersten Slops aus einem Haus sind seine Bewohner (`rolle.bewohner` passt zur Gebäudeklasse, absurd ≤ c), die späteren derselben Bresche liegen am oberen Fensterrand.
- **Fenster je Stufe (WS0 04.11.):** Absurdität und Stufe sind zwei Achsen. Der Stufen-Mix kommt aus der Eskalation (V-1416); innerhalb jeder Stufe wählt das Fenster relativ zum Bereich der Stufe (absurd_rel = absurd − min der Stufe + 1). So kommen Tintenmonster-Trash (wild, fuzzy, glu; Familienwert 4–5) trotzdem von Anfang an. Daten: src/data/mobs2d/slop-sammeln.r1.json `fenster_je_stufe`, Verteiler @4f1a92eb.
- Bestehende Regeln bleiben: Platz behält Gruppe, Zweitfamilie bei 1,5× mehr Neuem, 2 weiblich gelesene je 6er-Satz.

## 2 · Sechs Gegnerstufen
| Stufe | Name | Treffer | Wer |
|---|---|---|---|
| 1 | Trash | 1 | bestehend |
| 2 | Common | 2 | bestehend |
| 3 | Elite | 3 | bestehend (16 Typen) |
| 4 | Anführer | 4 | 1–2 je Familie, +10 % Größe, führt eine Gruppe |
| 5 | Wanted-Boss | 6 | einer je Familie, mit Namen und Steckbrief, +20 % Größe |
| 6 | Viertel-Endboss | 10 | einer je Viertel (Viertel-Generator), +25 % Größe |
- Danach greift die Eskalation über die Slops hinaus (V-1416): Toy Soldiers → Men in Black → Hunky & Dory.
- Stufen 4–6 sind Rollen, die bestehenden Typen zugewiesen werden (bevorzugt Golden Samples), keine neuen Bilder. Feld `stufe` 1–6 plus `wanted { name, steckbrief, delikt }` bei Stufe 5–6.

## 3 · Wanted-Liste und Album
- Ein Steckbrief-Blatt im Almanach-Stapel (bestehender Stapel, nichts verschiebt sich): Bild, Name, Delikt, „gesehen in“, Status gefasst/offen.
- Satire: Die Men in Black kleben selbst „Most Wanted“-Plakate an die HyperNorm-Fassaden, darauf dissonante Karten. Die Liste des Spielers ist die Gegenliste mit ihren Boss-Slops. Plakate laufen über das bestehende Aufkleber-System von WS-Design.
- Album (Spielstand `kfb.slop-album/1`): je Typ gesehen/besiegt, Fundort, Absurdität; Trophäen-Einträge bei vollen Familien und gefassten Wanted-Bossen.

## 4 · Wer was, wann
- **Verteiler, sofort:** Roster-Felder `absurd`, `stufe` 1–6, `wanted`; Erstwerte GEN; Test slopRoster grün; Spawn-Parameter als Daten (Fensterbreite, 60 %, Halbwertszeit, Treffer je Stufe).
- **Writer's Room (WSA, Nachtrag zu b330):** `absurd` je Typ (DESIGN), Vorschlag Anführer und Wanted-Boss je Familie, Steckbrief je Boss (Name, Delikt im Schwarz-Weiß-Denken, eine Zeile).
- **Rakete/Flug, nach Testlauf 5:** Fenster-Spawn in mobs2d bzw. Ausbruch, Treffer und Größe je Stufe.
- **Kartenkante, nach Testlauf 5:** Steckbrief-Blatt im Almanach.
- **WS-Design, nach Testlauf 5:** MiB-„Most Wanted“-Plakate als Aufkleber-Art.
- **WS1:** Viertel-Endboss im Viertel-Generator, Ereignis `slop.gefasst` über cueBus, Album-Anzeige.
