# Fable-Review R1 · Offene Punkte, To-dos, Sprintplan für den 13.10.2026

Stand: 12.10.2026 spät · Fable-5.1-Sitzung (Mac mini) · Branch `planning/fable-review-r1-lebensschicht-2026-10-12` (von `docs/kfb-decisions-register-2026-10-11`). Lesereihenfolge: `START_HERE_STEERING.md` → `replies/FABLE_REVIEW_R1_2026-10-12.md` → `lab-docs/KFB_LEBENSSCHICHT_PLAN_R1.md` → diese Datei.

## 1 · Was auf dem Branch liegt

| Datei | Inhalt | Status |
| --- | --- | --- |
| `replies/FABLE_REVIEW_R1_2026-10-12.md` | Antwort an die Steuerung: geprüfter Stand, Ergebnis, Mängelliste (Vorschlag fürs Register), drei Dinge die bleiben, nächste Schritte | fertig |
| `replies/FABLE_REVIEW_R1_2026-10-12/report.md` | Vollbericht Prüfer A (Technik) und Prüfer B (blinde Art Direction) | fertig |
| `replies/FABLE_REVIEW_R1_2026-10-12/blindtests.md` | Blindlese 24 px, blinder Paarvergleich gegen Kartenbild | fertig |
| `replies/FABLE_REVIEW_R1_2026-10-12/measurements.json` | Kalibrierung, Tor 1/2, Mobil, Determinismus, Bodenkontakt, Materialwechsel, 404-Maskierung | fertig |
| `lab-docs/KFB_LEBENSSCHICHT_PLAN_R1.md` | Phasen I bis K (Bewohner leben, sprechen, erinnern) als Anhang zu Plan R1, One-Shot-Format, Blindspots | Vorschlag |
| `lab-docs/PROJECT_STATE_FABLE_ENTRY_2026-10-12.md` | Projektstand-Eintrag zum Einfügen durch die Steuerung (V-117) | zum Einfügen |
| diese Datei | offene Punkte, To-dos, Sprint 13.10. | fertig |

Nicht auf GitHub: 74 Bilder (PNG) und die Prüfwerkzeuge (Kalibrierseite, Pixel-Diff, Verkleinerung). Sie liegen auf dem Mac mini unter `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/docs/critic/lab-mvp-slice/2026-10-11_review01/`.

## 2 · Offene Punkte, die Georg entscheidet (PASS / TUNE / FAIL / RULE / TBD)

| Nr | Frage | Vorschlag der Review-Sitzung | Wirkung |
| --- | --- | --- | --- |
| O1 | Lebensschicht-Plan R1 als Phasen I bis K an Plan R1 anhängen? | ja, als Vorschlag mit Zulieferungen ab sofort, Bau erst nach Phase F | ohne Entscheidung gibt es keine Bewohner-Schicht im Plan |
| O2 | Mobil als Qualitätsboden (Briefing) oder Desktop-only für MVP-1? | Desktop-only bis MVP-1, dann Mobil-Profil als eigene Phase; aber ab jetzt einen Mobil-Lauf je Lieferung im Parity mitschreiben (Calls, dpr, Schatten) | spart jetzt, verhindert späteres Umbauen |
| O3 | Tusche (Konturpass) als Post-Pass mit Schalter? | ja, aber erst ein Bildpaar mit und ohne Linie im Spiel, dann entscheiden; Ink-Kanon des Deck Viewers importieren, nicht nachbauen | beide Blindtests sagen heute „nicht dasselbe Universum wie die Karte“ |
| O4 | Kanon-Blätter für Prison Island, Toy Soldiers, Brick-Fish, Kayfabulieren (wer, was, warum, Rolle im Vier-Welten-Spiegel)? | je ein Blatt von Georg, sonst Platzhalter-Knoten ohne Inhalt | ohne Weltlogik (V-015) wird nichts davon gebaut |
| O5 | Zwei Dropbox-Stände: Dropbox-Kopie des Mac mini endet vor dem 10.10. mittags | Regel zu V-117: Dropbox-Kopie gilt nur, wenn Kopf-Datum des Projektstands gleich GitHub; sonst GitHub-Branch | verhindert Reviews und Bauten auf altem Stand |
| O6 | Prüfer-A-Zeilen „P1 (prüfen)“: Kamerasatz, sechs Renderer, 158 Calls alt | Steuerung prüft gegen Schnappschuss 11.10., je eine Zeile; nur was bleibt, bekommt eine V-Nummer | hält das Register sauber |

## 3 · To-dos je Besitzer

**Steuerung (Claude Code, Hauptrechner)**
- [ ] Branch lesen, Projektstand-Eintrag einfügen (`PROJECT_STATE_FABLE_ENTRY_2026-10-12.md`), CHANGELOG-Zeile „Fable-Review R1 eingetroffen“ (V-009).
- [ ] O6: sechs Zeilen Abgleich gegen `sync/lab-snapshot-2026-10-11` (Kamerasatz, Renderer, Calls, `setTime`, Probe-Seiten, `speckle.html`).
- [ ] Register-Einträge vorschlagen für die strukturellen Befunde: Fußpunkt eine Funktion, 404-Middleware, Zierschicht-Seed, Mobil-Lauf im Parity, Tusche-Bildpaar.
- [ ] O1 bis O5 als TBD mit V-Nummern anlegen, an Georg zur Entscheidung.
- [ ] ChatterBox-Pool-Export je MVP-Bewohner mit Zählung beauftragen (Zulieferung für Phase J; unter 20 Zeilen je Figur = Platzhalter).
- [ ] Hub-Zeiger `10_SSOT/README.md` auf GitHub-Pfade umstellen, solange die Dropbox-Kopien auseinanderlaufen (O5).

**Bau-Sitzung (Lab, MVP-1)**
- [ ] Kleiner Patch vor jeder weiteren Lieferung: Vite-404 für `/assets/*` und `/roadbeds/*` (heute 200 + HTML für fehlende Dateien); danach Konsolen-Null-Prüfung wiederholen.
- [ ] Fußpunkt prüfen: gibt es im Stand 11.10. noch mehr als eine Definition (`placeBuilding` 0,07-Konstante, `place.ts put()`, `NatureBuilder`, `syncResidents`)? Wenn ja, eine Funktion auf `grounding.ts footPolygon`, Q1 als Parity.
- [ ] Zierschicht deterministisch: `rng(seed)` mit Bewohner-ID statt `Math.random` in `resident.ts` und `pet-eye-rig.v6.js`; Lint-Regel (passt zu V-171 Punkt 6).
- [ ] Retro-Cars: PSD-Verweise in den FBX entfernen oder JPG als Ersatz eintragen; Chrom und Glas auf Knet-Profile (V-053).
- [ ] Mobil-Lauf als Zeile im Parity-Bericht (375 × 812, Calls, Dreiecke, dpr, Schattenkarte), ohne Umbau.

**WSA**
- [ ] Clip-Katalog R1 (läuft, `BRIEF_WSA_CLIP_CATALOG_R1.md`): Zuordnung zu Kulturmechaniken V-181 und Survival Kit; Lücken als „nicht gefunden in …“.

**Blender-Coworker**
- [ ] Erst nach dem Clip-Katalog: nur die Lücken bauen (Tanz, Debatte als Wechselrede, Lesen mit Prop, Patrouille mit Haltepunkten), nach Tag-Schema Leitfaden §1d. Keine Laufzeit.

**Georg**
- [ ] O1 bis O5 entscheiden (sechs Zeilen reichen).
- [ ] Kanon-Blätter O4, wenn die Inhalte ins MVP sollen.
- [ ] Mac mini: Dropbox-Ordner `KFB Island Worldbuilder Lab` und `KFB_HUB` auf Sync prüfen (lokal `KFB_HUB/30_DECISIONS` ist leer, auf GitHub voll).

## 4 · Sprintplan 13.10.2026 (Vorschlag, höchstens zwei Baustellen, V-005)

| Block | Wer | Inhalt | Ergebnis am Abend |
| --- | --- | --- | --- |
| Vormittag 1 | Steuerung | Fable-Review einsortieren: Projektstand-Eintrag, CHANGELOG, O6-Abgleich gegen Schnappschuss, TBD-Nummern für O1 bis O5 | Register mit neuen V-Nummern, GitHub mitgeschoben (V-117) |
| Vormittag 2 | Bau-Sitzung | Baustelle 1 weiter: C4c Standard, Flackern, Ladezeit (V-171 Punkte 1 bis 3, laut START_HERE); davor der 404-Patch (15 Minuten) | Parity grün, Standardansicht geprüfter Stand (V-166) |
| Mittag | Georg | O1 bis O5 entscheiden; Spiel-URL der Bau-Sitzung ansehen (Standbilder statt Video, V-008) | sechs Entscheidungen im Register |
| Nachmittag 1 | Bau-Sitzung | Baustelle 2 nur wenn O1 ja: Vorlage-zuerst-Zeilen für Phase I (Figuren-Karte als Laufzeit-Datum, Aktivitätsgraph über `nodes[]`, Beat-Bus) an die Steuerung, kein Code | sechs Zeilen Vorlage-zuerst, von der Steuerung freigegeben oder zurückgewiesen |
| Nachmittag 2 | Steuerung | Zulieferungen anstoßen: ChatterBox-Pool-Export, Kanon-Blätter anfragen (O4), WSA-Clip-Katalog nachfragen | drei Aufträge im Hub mit Rückgabepfad |
| Abend | Steuerung | Projektstand „Stand 13.10.“, Register mitschieben, nächsten Sprint eine Zeile | GitHub = lokal (Kopf-V-Nummer gleich) |

Nicht im Sprint: Mobil-Umbau, Tusche-Umbau, Inselkörper (wartet auf Blender R3/R4), Prison Island als Inhalt (wartet auf O4).

## 5 · Stopp-Regeln für morgen

- Keine dritte Baustelle, auch nicht „kurz“.
- Jede „fehlt“-Meldung nur mit Such-Protokoll (V-140).
- Kein Bild an Georg ohne Parity-Bericht mit V-Nummern (V-003).
- Unklare Bildstellen melden, nicht ausdenken (V-148).
- Nach zwei Reparaturrunden je Befund Stopp und Bericht.

---

*Review-Sitzung beendet 12.10. spät. Vite-Dev-Server auf dem Mac mini läuft bis zum Ausschalten; keine Codeänderung am Lab.*
