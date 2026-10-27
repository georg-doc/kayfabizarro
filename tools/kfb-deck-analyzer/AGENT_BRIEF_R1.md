# Auftrag: ein KFB-Deck vom Druck transkribieren und bewerten (Deck-Analyzer R1)

Du liest EIN Kartendeck vom gerenderten Druck-PDF, schreibst die Karten wörtlich ab und bewertest jede Karte. Regel (Georg): **Das PDF führt immer, das JSON wird nachgezogen.**

## Eingaben (je Deck im Aufruf genannt)
- Aktuelles Karten-JSON (nur lesen): `~/kfb-ws1/deck-analyzer/media/kfb/<data>`
- Seitenbilder: `<render>/page/pNN.png` (ganze Seite, 1400 px breit) und `<render>/quad/pNN_TL|TR|BL|BR.png` (Viertel, doppelte Auflösung)
- Zuordnung laut Registry: Karte n liegt auf Seite `coverOffset + 1 + floor((n-1)/4)`, Viertel `(n-1) % 4` in Reihenfolge TL, TR, BL, BR. **Prüfe die Zuordnung am Titel.** Weicht sie ab (Extraseiten, andere Anordnung), gilt der Druck; notiere es.
- Bewertungsregeln: `~/kfb-ws1/research/audits/deck-analyzer/GRADING_R1.md` (zuerst lesen und genau anwenden)

## Arbeitsweise (sparsam)
1. Lies jede Seite zuerst als ganze Seite. Öffne ein Viertel nur, wenn Text klein, verdeckt oder unsicher ist.
2. Lies das JSON einmal zum Vergleich.
3. Ändere **keine** Dateien im Repo. Schreibe nur die Ausgabedatei.

## Abschreiben
- `cardNamePrint` = Titel genau wie gedruckt (Versalien bleiben Versalien, Zeilenumbruch = ein Leerzeichen). `cardName` = Titelschreibung nach V-271: jedes Wort groß, kleine Wörter klein außer am Anfang/nach Doppelpunkt/Gedankenstrich (a, an, the, of, and, or, in, on, at, to, for, by, with, vs, but, nor, as), Akronyme und römische Zahlen groß, Bindestrich-Teile groß, Anführungszeichen bleiben. Ist der Druck schon gemischt geschrieben, ist `cardName` = Druck und `cardNamePrint` entfällt.
- `power` = gedruckter Power-Text inkl. fettem Stichwort am Anfang, Satzzeichen wie gedruckt (z. B. „Prima Nocta: Take one card …“).
- `lore` = gedruckter Lore-/Flavor-Text.
- Gedruckte Werte wie `[R:5] [A:2] [F:6]` → `"stats": {"R": 5, "A": 2, "F": 6}`.
- Weglassen: Schrift-Etiketten (z. B. „Architects Daughter“, „Courier Prime“), Stempel/Randwörter (KayfaBINGO!, BLÖDSINN!), Signatur „Georg v. Westphalen“/GW-Logo, Symbole.
- Druck-/Glyphenfehler: eindeutiger Tippfehler → gemeintes Wort in den Text, Original in `printTypo` (kurzer Satz). Absichtlich wirkende Eigenheiten bleiben wörtlich (auch `printTypo`).
- Unlesbar (meist Textende unter dem GW-Logo) oder nichts gedruckt: lesbaren Teil abschreiben, Rest weglassen, `printOpen` = Grund. Nichts erfinden, nichts aus dem JSON ergänzen, was du im Druck nicht siehst.
- `textSource` = `{"source": "PDF <pdf-Dateiname> p<Seite> <Viertel>", "method": "visual-transcription", "checkedAt": "2026-10-27"}`.

## Bewerten
Nach GRADING_R1.md: je Karte `rating` mit `stars`, `scores` (pointe, power, lore, wissen, bild je 0–2), `reason` (1–2 Sätze, deutsch, Klartext). Erst alle Karten bewerten, dann die Verteilung prüfen (Inflationsbremse) und ggf. nachjustieren. Danach Deck: `deckRating`, `topCards` (5), `worstCards` (3), `viralScore` (1–10) + `viralReason`.

## Ausgabe
Datei `~/kfb-ws1/research/audits/deck-analyzer/pilot/<packId>.print.json`:
```json
{"packId": "…", "pdf": "…", "checkedAt": "2026-10-27", "pagesViewed": 15, "quadsViewed": 7,
 "mappingNote": "…oder null",
 "cards": [{"cardNumber": 1, "cardName": "…", "cardNamePrint": "…", "power": "…", "lore": "…", "stats": {…}, "printTypo": null, "printOpen": null,
            "textSource": {…}, "rating": {…}, "jsonDiff": "kurz: was weicht vom aktuellen JSON ab (Titel/Power/Lore/neu) oder 'gleich'"}],
 "deck": {"deckRating": {…}, "topCards": […], "worstCards": […], "viralScore": 0, "viralReason": "…"},
 "findings": ["Auffälligkeiten: Druckfehler, doppelte Karten, Layoutfehler, Karten im Druck, die im JSON fehlen, oder umgekehrt"]}
```
Kartennummer = Position im Druck nach Registry-Regel (bzw. die JSON-Nummer, wenn der Titel passt). Gibt es Karten im Druck, die das JSON nicht hat, oder umgekehrt: in `findings` und als eigene Einträge mit `jsonDiff: "neu"` bzw. Hinweis.

## Abschlussmeldung (kurz, deutsch)
Karten gesamt; Titel geändert / Power geändert / Lore geändert / neu / OPEN; Sterne-Verteilung; gesehene Seiten und Viertel; Auffälligkeiten.
