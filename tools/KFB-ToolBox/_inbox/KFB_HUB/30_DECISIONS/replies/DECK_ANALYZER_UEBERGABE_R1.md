# Übergabe Deck-Analyzer R1 an WS0 (27.10.2026)

Von: Sitzung „KFB Deck-Analyzer“ (Auftrag über WS1-Lead, Georg 24.10.). An: WS0, das den Prozess dauerhaft weiterführt.
Regel: **Das PDF führt immer, die JSONs werden nachgezogen** (Georg 23./24.10.).

## 1 · Was der Prozess tut

Ein Deck-PDF (nur Bilder, kein Textlayer) wird Seite für Seite angesehen. Jede Karte wird wörtlich abgeschrieben (Titel, Power, Lore, gedruckte Werte) und nach fünf Kriterien bewertet. Das Ergebnis wird ins Deck-JSON in `media/kfb/` eingetragen. Alte Werte bleiben als `jsonLegacy` bzw. `*Legacy` erhalten. Danach entstehen ein Bericht und eine Liste je Deck (geändert, hinzu, weg).

## 2 · Stand der Daten (wichtig)

- **main ist der alte Stand.** `media/kfb` auf main wurde seit 04.08. nicht geändert.
- Die Druckarbeit vom 14./15.10. liegt auf einer eigenen Linie und wurde **nie gemergt**:
  - `data/kfb-card-print-text-2026-10-14`: OCR-Audit `PRINT_TEXT_AUDIT_R1.md`
  - `data/kfb-card-text-canonical-2026-10-14`: 698 Karten auf Druck gesetzt, `CARD_TEXT_CANONICAL_R1.md`
  - `data/kfb-card-title-case-2026-10-15`: V-271, `cardNamePrint`, `CARD_TITLE_CASE_R1.md`
  - `52adc8f1`: Registry-Generator
  - `data/kfb-card-fixes-batch8-2026-10-16`
- Das Spiel nutzt `ws1/karten-druck-spiel` (= 52adc8f1 + Mission Control, Ego Mania, Brain Flipper #59).
- **Arbeitszweig:** `data/kfb-deck-analyzer-r1`. Er enthält Spielstand + batch8 + Pilot (3 Decks) + Werkzeuge. Ein späterer main-Merge muss von diesem Zweig ausgehen, nicht von `ws1/karten-druck` (der baut auf main auf und ist überholt). **Merge nur nach Georgs Ja.**
- Inhaltsstand je Deck: siehe `DECK_ABGLEICH_R1.md` (alle 130 Decks).
  - 59 Decks am 14.10. gesichtet (A)
  - 17 Decks ausgelassen (C), davon 3 jetzt im Pilot erledigt
  - 2 Decks am 23.10. neu erfasst (D)
  - 52 MedKayfab-Decks nie geprüft (E)
  - Neu mit vollem Sichtlauf und R1-Bewertung: `the_uruk_rumble`, `anti_rules_toolkit`, `geopolitical_thrillers_conspiracy_theories`

## 3 · Werkzeuge (`tools/kfb-deck-analyzer/` im Arbeitszweig)

| Datei | Zweck |
|---|---|
| `deck_abgleich_r1.py` | Abgleich zweier Stände über alle Decks, nur git, kein PDF (Titel/Power/Lore/Kartenzahl). Refs stehen oben im Skript. |
| `render_pages.swift` | PDF-Seiten als PNG (macOS PDFKit). `swift render_pages.swift <pdf> <out> 1400 all` für Seiten, `… 2800 all quad` für Viertel. |
| `AGENT_BRIEF_R1.md` | Arbeitsanweisung für **eine Teilsitzung je Deck** (Abschreiben, Bewerten, Ausgabe `pilot/<packId>.print.json`). |
| `GRADING_R1.md` | Bewertungsregeln (Georg 27.10.). |
| `apply_print.py` | Trägt `pilot/<packId>.print.json` ins Deck-JSON ein. `--dry` zeigt nur die Änderungen. Schreibt das Änderungsprotokoll auf stdout (→ `logs/<packId>.apply.json`). |
| `make_report.py` | Berichtsteil je Deck aus Transkription und Protokoll. |
| `pilot/`, `logs/` | Rohtranskriptionen und Änderungsprotokolle des Piloten |

**Ablauf je Deck:**
1. `git fetch`, Arbeitszweig aktuell. Im Worktree muss `media/kfb` ausgecheckt sein (Sparse Checkout: `git sparse-checkout add media/kfb`).
2. Seiten und Viertel rendern (Scratchpad, nicht ins Repo).
3. Teilsitzung starten: „Lies AGENT_BRIEF_R1.md, Deck X, Pfade …“. So ist der Token-Verbrauch je Deck exakt messbar.
4. Stichprobe am Bild: mindestens eine Seite selbst lesen und mit der Transkription vergleichen.
5. `apply_print.py --dry`, dann echt. JSON parsen, Kartenzahl prüfen.
6. Bericht ergänzen, committen, pushen (nur additiv auf den Arbeitszweig).

## 4 · Datenformat (Karte)

- Das Bestandsformat bleibt, auch `num`/`name` in älteren Decks.
- Neu bzw. geändert:
  - `cardName`: Titelschreibung, gerade Apostrophe
  - `cardNamePrint`: Druckform, wenn sie abweicht
  - `power`, `lore`
  - `stats` {R, A, F}, wenn gedruckt; `statsAlt`, `statsMarks` (Sonderfälle)
  - `printTypo`, `printOpen` (unlesbar bzw. nicht gedruckt)
  - `source: "print"`
  - `textSource` {source: "PDF <datei> p<Seite> <Viertel>", method: "visual-transcription", checkedAt}
  - `rating` {stars, scores, reason, version, ratedAt}
  - `jsonLegacy` (alte Werte, nur wenn noch keins da ist)
- `grade` (1–3) bleibt unverändert. Das Spiel liest es (`world-context.js` begrenzt auf 1–3) und der Viewer auch.
- Deck: `deckRating` neu. `topCards`, `worstCards` und `viralScore` werden neu gesetzt, die alten Werte stehen in `*Legacy`. Dazu kommen `viralReason` und `printSync`.

## 5 · Bewertung

`GRADING_R1.md`: fünf Kriterien (pointe, power, lore, wissen, bild) je 0–2 Punkte, daraus 1–5 Sterne.

**Inflationsbremse:** 5★ höchstens etwa 10 %, 4★ und 5★ zusammen höchstens 30 %, sonst nachprüfen und begründen (`ratingNote`).

Pilot-Verteilungen:

| Deck | Ø Punkte | Sterne Deck | 4★ + 5★ |
|---|---:|---:|---:|
| Uruk Rumble | 6,4 | 3 | 30 % |
| Anti-Rules | 5,6 | 3 | 25 % |
| Geopolitical Thrillers | 6,1 | 3 | 32 %, mit Begründung |

Zum Vergleich der Altbestand: 56 % der Karten mit Bestnote, kein Deck unter 8/10.

## 6 · Kosten (gemessen im Pilot, Details in `PILOT_R1.md`)

- Je Deck (≈ 55 Karten): ≈ 3 Mio. verarbeitete Tokens, davon ≈ 90 % Cache-Lesezugriffe. ≈ 50.000 Ausgabe-Tokens, ≈ 8,5 Minuten.
- Plan-Kontingent: höchstens ≈ 0,7 % der Woche bzw. ≈ 4 % des 5-Stunden-Fensters je Deck (Obergrenze, andere Sitzungen liefen parallel).
- Drei Decks parallel liefen problemlos.

## 7 · Lessons Learned

1. **Erst die Richtung prüfen** (`git merge-base --is-ancestor`), bevor man „main gegen X“ vergleicht. Der Auftrag nahm an, main sei neuer; es war umgekehrt.
2. **Teilsitzung je Deck:** Das macht die Token-Messung exakt und hält die steuernde Sitzung klein.
3. **Formate normalisieren** beim Eintragen, nicht in der Teilsitzung. Teilsitzungen liefern leicht andere Formen, z. B. `topCards` als Objekte oder typografische Apostrophe im Titel.
4. **Titel nie nur wegen Typografie ändern.** Spiel, Triplets und Tratsch ordnen über den Titel zu.
5. **Altes `grade` nicht umdeuten.** Neue Bewertung in eigenem Feld.
6. **Kosten treiben die Schritte, nicht die Bilder.** Jede Seite einzeln zu lesen heißt: Der Verlauf wird 25–45-mal neu gelesen. Mehrere Seiten je Schritt und die Ausgabe in einem Zug sparen geschätzt 30–50 %.
7. Der Sync vom 23.10. (Ego Mania, Mission Control) hat bei den Druckkarten `grade`, `gradeReason` und `artworkPrompt` nicht mitgenommen. Für diese Decks fehlt die Bewertung ganz.
8. Druck-Eigenheiten wiederholen sich: GW-Logo verdeckt das Lore-Ende unten rechts; Schreibmaschinenschrift mit Glyphenfehlern; mitgedruckte Schrift-Etiketten; doppelte Werteblöcke.

## 8 · Offene Punkte

- **Georg:**
  - Uruk: doppelte Werteblöcke, welcher Satz gilt?
  - Geopolitical: Inhaltsrisiko #3, #26, #28, #31, #35 (Marketing/Site)
  - Anti-Rules: Briefing-Notizen als Lore
  - Umfang der nächsten Runde
- **Weitere MVP-Decks:** forget_utopia, ignore_dystopia, embrace_protopia sowie die SIM-Decks bards, sonic_warfare_01, money_trail, symphonic, shadow_politics, biology_of_rebellion, cinematic_2. Diese Decks sind textlich am 14.10. teilgeprüft, haben aber noch keine R1-Bewertung. Mission Control und Ego Mania sind nach Druck erfasst, haben aber keine Bewertung.
- 14 weitere C-Decks (Zuordnung unsicher) und 52 MedKayfab-Decks wurden nie gegen den Druck geprüft.
- 19 OPEN-Karten vom 14.10. (Text unter dem GW-Logo) brauchen ein PDF ohne Logo oder die Entscheidung des Autors.
- Glyphen-Artefakte im JSON (z. B. `reality_redrawn` #5, #7, `cosmic_grift`) brauchen einen eigenen Durchgang.
- Bei Karten „ohne Befund“ vom 14.10. fehlt `textSource`.
- Marketingtexte (`marketingText`, `blurb`, `hashtags`) wurden im Pilot bewusst nicht neu geschrieben (Georg 27.10.: nur Top/Flop und Viral-Score).
- `media/kfb/kfb-index.json` (alte 4-Deck-Liste) ist veraltet.
