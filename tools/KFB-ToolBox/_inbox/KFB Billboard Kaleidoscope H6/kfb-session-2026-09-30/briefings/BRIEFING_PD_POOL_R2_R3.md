# Briefing Web-Chat · PD-POOL-R2 + R3 · Pool für die Billboards befüllen

Stand 30.09.2026 · Auftraggeber Georg · aus Claude Design · ersetzt `BRIEFING_WEBCHAT_public-domain-fill.md` (26.09.)

## Ausgangslage (gelesen auf `main`, 30.09.2026)

- `media/public_domain/` hält das R1-Smoke-Set: 4 Objekte (Met 86434, AIC 24645, Commons `File:Silent film.svg`, IA `TheGeneral1926` Item Tile), Schema `kfb.public-domain-asset/0.2`, Persistenz-Commit `f3acaaeb98530dd9ffb7d200d61956891e738336`.
- `media/public_domain/README.md` sperrt einen blinden Massenimport und verlangt als Startpunkt eine exportierte Auswahlliste oder einen **separat geprüften Discovery-Brief**. Dieses Dokument ist dieser Brief.
- Die Collage-Engine (`collage-engine/kfb-collage-engine.js`, Claude Design) liest ab heute Manifest 0.2 mit Commit-Pin und lädt `localPath` über jsDelivr am selben Pin. 4 Objekte füllen das Gedächtnisfenster (12 Einstellungen) nicht, deshalb ergänzt die Engine per Live-Suche. Ziel von R3: Die Live-Suche wird überflüssig.

## Grundsatz

Keine Auswahl von Hand, keine Kuratier-Seite. Geprüft wird die **Quelle und die Regel**, nicht das einzelne Bild (Konzept vom 26.09.). Die Discovery-Liste entsteht maschinell aus `seeds.json`, wird als Datei committet und ist damit die prüfbare Auswahlliste, die das README verlangt. Georg nimmt die Liste in Summe ab (Zählung je Thema und Quelle, Stichprobe 20 Zeilen), nicht jede Zeile.

## Gate R2 (unverändert, zuerst)

Die 4 R1-Objekte im vorhandenen Asset Librarian registrieren, Auffindbarkeit und Provenienz prüfen. Kein neues Registry, keine Änderung an `registry/assets/v1` außer über den vorhandenen Bot-Workflow. Fertig, wenn alle 4 über den Librarian mit `sha256` und `sourcePage` auffindbar sind.

## Gate R3 · Discovery → Persistenz

### 1. Discovery-Liste erzeugen

`harvest.py` (liegt in `tools/KFB-ToolBox/_inbox/KFB Public Domain Pool - 02/tools/public_domain/`) nach `tools/public_domain/` übernehmen und so anpassen, dass es **direkt das Eingabeformat von `fetch_pool.py` auf main** schreibt (wie `pd01-smoke-manifest.jsonl`):

```json
{"id":"aic-24645-great-wave","provider":"aic","sourceId":24645,"sourcePage":"…","targetBase":"aic/<slug>","maxBytes":6000000,"tags":["cat:arthistory","print","1830s"]}
```

Pflicht: genau ein Tag `cat:<id>` je Zeile, `<id>` aus `seeds.json`. Die Engine ordnet danach die Themen zu. Ausgabe: `tools/public_domain/pd-r3-discovery.jsonl` (wird committet).

Lizenzfilter in der Discovery wie in `fetch_pool.py`: nur `free`. `fallback-attribution` bleibt in R3 draußen, damit `CREDITS.md` leer bleibt und keine Nennungspflicht auf Billboards entsteht.

### 2. Zielmengen

| | Wert |
|---|---|
| Bildthemen | alchemy, davinci, anatomy, science, maps, arthistory, photo, newspaper, propaganda, cartoon |
| Bilder je Thema | 24 bis 40 (Untergrenze: zwei volle Gedächtnisfenster) |
| Bilder gesamt | höchstens 400 |
| Bildgröße | Lieferformat mit langer Kante ≤ 2048 px, wo der Anbieter das anbietet (AIC IIIF `full/2048,`, Met `primaryImageSmall` bzw. Original ≤ 6 MB, Commons `thumburl` 2048). Die Engine rechnet ohnehin auf 1024 px herunter. |
| Clips | silentfilm, cartoon, propaganda, documentary: je höchstens 5, nur Commons-Transkodierung 360p WebM ≤ 25 MB oder IA-Derivat ≤ 25 MB. Größer: nicht ablegen. |
| Audio | nicht in R3 (Engine hat keinen Audio-Anschluss) |
| Ordner gesamt | ≤ 800 MB. Wird das überschritten, `perQuery` senken und neu laufen lassen, nicht einzeln aussortieren. |

### 3. Persistieren

```
python tools/public_domain/fetch_pool.py tools/public_domain/pd-r3-discovery.jsonl --report media/public_domain/PD_R3_TEST_REPORT.json
python tools/public_domain/fetch_pool.py tools/public_domain/pd-r3-discovery.jsonl --report /tmp/second.json   # Idempotenz
```

`fetch_pool.py` bleibt der einzige Rechte-Entscheider (Recheck je Objekt beim Abruf, Sidecar, SHA-256). `manifest.jsonl` wird aus den persistierten Sidecars neu erzeugt und enthält die R1-Zeilen weiterhin. `smoke-test`-Tags bleiben an den R1-Zeilen.

### 4. Grenzen (nicht verhandelbar)

- Nichts von Hand ergänzen oder entfernen. Was der Recheck verwirft, bleibt draußen.
- Kein Git LFS, keine Datei > 95 MB, kein zweites Registry.
- Billboard-Runtime und Collage-Engine werden im Repo nicht angefasst.
- Keine Stage- oder Live-Veröffentlichung.
- Bricht eine Quelle ab: einmal wiederholen, sonst ohne sie committen und im Bericht vermerken.

## Fertig, wenn

- `pd-r3-discovery.jsonl` ist committet; jede Zeile hat genau einen `cat:`-Tag.
- `manifest.jsonl`: jede Bildthema-Zeile ≥ 24 Einträge `free`, jede Zeile mit `localPath`, `sha256` und `rights`.
- Zweiter Lauf: 0 neu geladen, alle Dateien hash-identisch.
- `find media/public_domain -size +95M` ist leer; Ordnergröße steht im Bericht.
- Drei zufällige `localPath` sind über `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@<commit>/media/public_domain/<localPath>` mit HTTP 200 und passendem Content-Type erreichbar (Befehl und Ausgabe im Bericht).

## Rückgabe an Claude Design

Der **volle Commit-SHA** des Persistenz-Commits. Claude Design setzt ihn als `PD_PIN` in der Engine, senkt dann die Live-Suche auf „aus“ und prüft im Leitstand, ob alle Bilder aus dem Manifest kommen.

## Bericht

Getrennt nach `SOURCE | DECISION | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN`. Dazu: Commit-SHA, Zählung je Thema und Quelle (geplant / geladen / verworfen mit Grund), Ordnergröße, Ausgabe des zweiten Laufs. Nicht Gelaufenes heißt `NOT_TESTED`.
