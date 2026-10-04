# Briefing Web-Chat · `media/public_domain` befüllen

Stand 26.09.2026 · Auftraggeber Georg · Paket aus Claude Design (`export_public_domain/`)

## Ziel

Den ersten Bestand des freien Asset-Pools nach `georg-doc/kayfabizarro` → `media/public_domain/`
bringen, damit Claude Design daraus Billboards und andere Flächen bauen kann. Claude Design
kann nicht ins Repo schreiben, das ist der einzige Grund für diesen Auftrag.

Konzept und Freigabe: `docs/KONZEPT_PUBLIC_DOMAIN_POOL.md` (Georg, 26.09.2026). Kurz:
geprüft wird die Quelle, nicht das einzelne Bild. Die Skripte übernehmen nur, was die Quelle
selbst als CC0 / Public Domain (free) oder CC BY (Fallback mit Nennung) ausweist.

## Paketinhalt → Zielpfade im Repo

| Paket | Repo |
|---|---|
| `tools/public_domain/harvest.py` | `tools/public_domain/harvest.py` |
| `tools/public_domain/fetch_pool.py` | `tools/public_domain/fetch_pool.py` |
| `tools/public_domain/seeds.json` | `tools/public_domain/seeds.json` |
| `media/public_domain/README.md` | `media/public_domain/README.md` |

## Schritte

1. Branch `chatgpt-web/public-domain-pool-2026-09-26` von `main`.
2. Paketdateien an die Zielpfade kopieren, unverändert.
3. In der Repo-Wurzel, Python 3.9+, nur Standardbibliothek:
   ```
   python tools/public_domain/harvest.py tools/public_domain/seeds.json > pool-manifest.jsonl
   python tools/public_domain/fetch_pool.py pool-manifest.jsonl
   ```
   `harvest.py` schreibt am Ende eine Zählzeile nach stderr, `fetch_pool.py` eine
   Zählzeile plus Liste der verworfenen IDs mit Grund. Beide Ausgaben wörtlich in den
   PR-Text.
4. `pool-manifest.jsonl` nicht committen (Zwischenstand). Committen: die vier Paketdateien,
   alles unter `media/public_domain/` inklusive `manifest.jsonl` und `CREDITS.md`.
5. PR gegen `main`, Titel `media/public_domain: freier Asset-Pool, Startbestand`.

## Grenzen (nicht verhandelbar)

- **Nichts von Hand ergänzen.** Keine Dateien aus anderen Quellen, keine Lizenz „nach
  Augenschein". Was die Skripte verwerfen, bleibt draußen.
- **Keine Datei über 100 MB.** `fetch_pool.py` legt Filme über 80 MB, Bilder über 15 MB,
  Audio über 25 MB nicht ab, sondern schreibt nur den Beleg `<id>.ref.license.json` mit
  Quell-URL. Das ist gewollt.
- **Gesamtgröße:** Übersteigt `media/public_domain/` nach dem Lauf 1,5 GB, `perQuery` in
  `seeds.json` von 6 auf 3 senken, Ordner leeren, neu laufen lassen. Nicht einzeln
  aussortieren.
- **Kein Git LFS, keine neue Registry, keine Änderung an `registry/assets/v1`.** Das
  Registry erzeugt der Bot-Workflow.
- Bricht eine Quelle ab (Meldung `QUELLE NICHT ERREICHBAR`), einmal wiederholen. Bleibt
  sie weg: so committen und im PR vermerken.

## Optional, getrennter Commit

`tools/asset_registry/build.py` (bzw. dessen Konfiguration) um die Wurzel
`media/public_domain` ergänzen, neben `media/2D_Assets` und `media/3D_Assets`. Nur wenn das
eine reine Konfigurationsänderung ist. Lizenzableitung bleibt draußen, die steht in den
`.license.json`.

## Fertig, wenn

- `media/public_domain/manifest.jsonl` existiert, jede Zeile ist gültiges JSON mit
  `license.asReturned` und `rechecked`.
- Jede abgelegte Datei hat daneben eine `.license.json`; Anzahl Dateien = Anzahl Belege mit
  `"stored": true`.
- `CREDITS.md` enthält beide Abschnitte.
- Keine Datei > 100 MB (`find media/public_domain -size +95M` leer).

## Bericht (im PR-Text und an Georg)

Getrennt nach `SOURCE | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT |
GEORG ACCEPTANCE | OPEN`. Dazu: Commit-SHA, Zählzeilen beider Skripte, Gesamtgröße des
Ordners, Anzahl `stored: false`, verworfene IDs. Nicht Gelaufenes heißt `NOT_TESTED`.

Beide Skripte sind in Claude Design **nicht** gelaufen (kein Python dort). Die
Such- und Lizenzlogik ist dieselbe wie in `KFB Public Domain Pool.dc.html`; dort sind alle
vier Quellen am 26.09.2026 erreichbar gewesen. Fehler in den Skripten bitte beheben und im
Bericht benennen, nicht umgehen.
