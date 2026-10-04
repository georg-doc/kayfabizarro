# KFB Card Zone Lab v2 — Voll-Export 1:1

**Stand 2026-09-22** · Export-Kandidat für WSA-Chat-Review · kein GitHub-Push

Dieser Ordner enthält die **unveränderte Codebasis** von `KFB Card Zone Lab v2`, nicht eine
Extraktion und nicht eine Nacherzählung. Jede Datei ist byteweise die Projektdatei. Es wurde
keine Zeile umgeschrieben, aufgeräumt, umbenannt oder "verbessert".

## Warum dieser Export existiert

Zwei Läufe Modul-Extraktion (ToolBox v1.0.0, v1.1.0) haben Code geliefert, der die Vorlage
beschrieb statt sie zu sein. Der zweite Fehler wurde am 2026-09-22 von Georg festgestellt.
Konsequenz: statt einer dritten Extraktionsrunde geht die **Quelle selbst** raus, mit beiden
Post Mortems daneben. Wer daraus Module schneidet, schneidet aus dem Original.

Siehe `docs/POSTMORTEM_2026-09-21_SHADER.md` und `docs/POSTMORTEM_2026-09-22_EXTRAKTION.md`.

## Start

```
python3 -m http.server 8000
# → http://localhost:8000/KFB%20Card%20Zone%20Lab%20v2.dc.html
```

Ein Webserver ist nötig: die Datei lädt ES-Module und JSON relativ (`file://` scheitert an CORS).
Internetzugang ist nötig: three.js kommt über unpkg, Texturen, Karten-Index und GLBs über
`raw.githubusercontent.com/georg-doc/kayfabizarro/main/`.

## Inhalt

| Pfad | Zeilen | Was |
|---|---|---|
| `KFB Card Zone Lab v2.dc.html` | 2586 | die Anwendung: Template + `class Component`, 143 Methoden |
| `support.js` | 1769 | DC-Laufzeit (Template-Parser, Renderer) — Umgebung, nicht Projektlogik |
| `kfb-box-material.js` | 372 | `makeVariedBoxMaterial`, `makeBoxGeometry`, `writeVariation` |
| `asset-index.js` | 146 | Manifest-Loader gegen `registry/assets/v1` |
| `asset-repo.json` | 335 KB | Registry-Spiegel (GLB-Auflösung für Projektor und Sockel) |
| `cardbuilder/kfb-card-builder.js` | 449 | Deck-Pool, Blattschnitt, Silhouette |
| `cardbuilder/kfb-ink-canon.js` | 360 | Tusche-Presets, Kontur, Maskenwachstum |
| `cardbuilder/kfb-card-format.js` | 68 | Seitenverhältnis, Zellanpassung |
| `terrain-v10/voxel-terrain.js` | 607 | Voxel-Terrain v10 |
| `terrain-v10/world-context.js` | 291 | Weltkontext |
| `terrain-v10/edge3.jpg` | — | lokale Kantentextur (Laufzeit lädt zusätzlich die Repo-Variante) |

`docs/` — Handover, Code-Map, Abhängigkeiten, Post Mortems, Bestandsdokumente
`evidence/` — Screenshots aus dem ToolBox-Lauf (Kontext zum Post Mortem, **nicht** Beleg dieses Exports)

## Was hier NICHT drin ist — mit Absicht

Modelle, Animationsbibliotheken, Fonts, Audio. Regel 1 des Projekts: Assets bleiben
GitHub-SourceRefs mit Commit-Pin. Der Export enthält Quellcode und Daten.
