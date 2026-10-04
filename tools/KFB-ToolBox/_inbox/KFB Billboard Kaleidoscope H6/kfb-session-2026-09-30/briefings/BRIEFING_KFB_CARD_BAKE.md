# Briefing Web-Chat · KFB-Karten als Bilder rendern und ablegen (Bake)

Stand 30.09.2026 · Auftraggeber Georg · **ENTWURF**: Motivrahmen aus Slice A liegen in `data/h6-card-crops.json` (Status geschätzt, Georgs Blick auf H6 steht aus). Nicht vor Georgs Freigabe ausführen.

## Warum

Die Billboard-Collage (H5/H6) braucht Karten und enge Motiv-Crops als Bildmaterial. Live über pdf.js kostet jede Seite 94–279 ms im Hauptfaden (Messung Combat Arena, 06.09.2026) und ruckelt neben einem Compositor mit ~29 fps; mehrere Tafeln in einer Szene vervielfachen das. Vorab gerenderte Bilder laden wie jede andere Platte über jsDelivr am Commit-Pin.

## Ausgangslage (gelesen auf main, 30.09.2026)

- `media/kfb/index.json`, Schema `kfb-deck-registry/v2`, ~120 Decks, meist 48–68 Karten. PDF-Seite 745,091 × 415,636 pt, 2×2 Raster, Seite = `coverOffset + 1 + floor((n−1)/4)`, Quadrant `(n−1) % 4` (TL·TR·BL·BR).
- `cardGrid` laut `skills/SSOT_KFB_CardBuilder_PDF.md` §4 nur für `forget_utopia`, `ignore_dystopia`, `embrace_protopia` gemessen. **In `index.json` auf main nicht vorhanden.** Erster Schritt: klären, wo die Werte liegen, und sie nach `index.json` bringen (SSOT: „Zahlen NUR in `index.json`“).
- Sollformat `CARD_AR = 1.74`, `artFit: 'fit'` (`skills/kfb-card-format.js`).

## Umfang

Phase 1: nur das Exhibition-Trio (168 Karten). Weitere Decks erst nach Georgs Blick auf Phase 1.

## Ablage

```
media/kfb/renders/<packId>/card-<nn>.webp        # ganze Karte, Sollformat, lange Kante 1024 px
media/kfb/renders/<packId>/motif-<nn>.webp       # enger Motiv-Crop, lange Kante 1024 px
media/kfb/renders/manifest.jsonl                 # je Zeile ein Bild
```

Manifestzeile (Vorschlag, Schema `kfb.card-render/0.1`):

```json
{"id":"forget_utopia-07-motif","packId":"forget_utopia","n":7,"kind":"motif","localPath":"forget_utopia/motif-07.webp","w":1024,"h":640,"sha256":"…","pdf":"Deck_A_UTOPIA_-_Forget_Utopia web H.pdf","pdfSha256":"…","page":3,"quadrant":"BL","cardGrid":{…},"motifBox":{…},"cardName":"…","renderer":"pdfjs 4.7.76","renderedAt":"…"}
```

## Rendern

- Seiten mit `pdftoppm` oder pdf.js; das Werkzeug im Bericht nennen. Achtung: Deck Viewer v4 nutzt pdf.js 3.11.174 mit Eval, der CardBuilder 4.7.76 mit `isEvalSupported:false`. Die Quellbilder sind ~1553 px breite JPEGs je Seite (`kfb-corpus.js`), mehr Auflösung gibt es nicht. Seite so groß rendern, dass die Zelle ≥ 1024 px breit ist.
- Zelle nach `cardGrid` inkl. `gapX/gapY` schneiden (Formel SSOT §4), `fit` ins Sollformat.
- Motiv-Crop nach `motifBox` (relativ zur Zelle, 0..1) je Layout-Familie. Die Werte liefert Slice A; sie gehören nach `index.json` neben `cardGrid`, nicht ins Skript.
- Keine Tuschekante einbrennen. Die Kante ist Sache der Szene (`kfb-ink-canon.js`).

## Grenzen

- Kein neues Registry. Die Renders sind abgeleitete Daten unter `media/kfb/`; eine Registrierung läuft, wenn überhaupt, über den vorhandenen Asset Librarian.
- Kein Git LFS. Phase 1 rechnerisch ≤ 40 MB (336 Bilder à ~100 KB WebP); im Bericht die echte Größe.
- Karten, deren Zelle leer oder abgeschnitten ist, nicht still auslassen, sondern im Bericht auflisten.
- Zweiter Lauf idempotent (gleiche SHA-256).

## Fertig, wenn

- `cardGrid` und `motifBox` der drei Decks stehen in `index.json`.
- 168 × 2 Bilder + `manifest.jsonl` liegen unter `media/kfb/renders/`; Anzahl Zeilen = Anzahl Dateien.
- Stichprobe 12 Bilder (4 je Deck) als Kontaktbogen im PR.
- Zwei zufällige Pfade über `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@<commit>/media/kfb/renders/…` mit HTTP 200 und `image/webp`.

## Rückgabe an Claude Design

Voller Commit-SHA. Claude Design tauscht in H6 den Live-PDF-Weg gegen das Render-Manifest am Pin.

## Bericht

`SOURCE | DECISION | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN`. Nicht Gelaufenes heißt `NOT_TESTED`.
