# Handover an WS0 · H15 Mindscape (25.10.2026)

## Ziel des Re-Homes
H15 kommt als eigener Kandidat neben H13/H14 ins Repo. H13 ist Referenz, H14 ist der Bake-Stand. Beide bleiben unberührt (Regel 8).

Vorschlag für den Zielordner (Entscheidung bei WS0): `tools/KFB-ToolBox/_inbox/KFB_Billboard_Kaleidoscope_H15_Mindscape_2026-10-25/`.

## Schritte
1. Ordner 1:1 übernehmen. `support.js` muss neben der `.dc.html` liegen.
2. **Pfad `hypernorm_r3/`:** Die Datei lädt relativ:
   - `hypernorm_r3/texte/*.json`;
   - `hypernorm_r3/pd_audio/manifest.json`;
   - `hypernorm_r3/pd_pool/manifest.json` plus `hypernorm_r3/pd_pool/<datei>`.

   Die 481 Bilder liegen nur im privaten Repo `KFB-Stunt-Car-Race` @ `design/claude-design-r3`. Raw liefert aus einem privaten Repo nichts. Dafür gibt es zwei Wege:
   - a) `hypernorm_r3/pd_pool/` in den Zielordner im öffentlichen Repo legen. Das ist eine Asset-Kopie, braucht also Georgs Freigabe nach Regel 1.
   - b) Den Bildpfad in `loadWs0()` (Zeile mit `im.src = 'hypernorm_r3/pd_pool/' + e.datei`) auf jsDelivr am Pin eines öffentlichen Ortes umstellen. Bilder über jsDelivr, Manifest über raw.
3. `data/h6-card-crops.json` bleibt relativ, liegt bei.
4. Nichts umbauen, was H14 teilt (Planung, Songform, Bake, `BAKE_SRC`).

## Externe Abhängigkeiten zur Laufzeit
| Was | Woher | Hinweis |
|---|---|---|
| three.js 0.160.0 | jsDelivr npm | ESM, nicht über raw (Regel 2) |
| PD-Manifest + Medien | raw/jsDelivr @ `f3acaaeb98530dd9ffb7d200d61956891e738336` | wie H14 |
| KFBCorpus (Deck Viewer v4) | jsDelivr @ gleichem Pin | wie H6 |
| Karten, Filme | Wikimedia Commons API | `origin=*` |
| Gedichte | Wikisource API en/de | Fehlanzeigen sind echt, siehe RETURN_M2 |
| Schellack | archive.org metadata + Stream | CORS je Titel ungeprüft |
| Schriften | Google Fonts | wie H8/H14 |

## Code-Karte (Logikklasse in der .dc.html)
| Bereich | Methoden |
|---|---|
| Sphäre | `msInit(el)`, `msRender(now)`, `msDispose()`, Shader `MS_VS`/`MS_FS` |
| Gedichtband | `loadTexts()`, `PoemBand` (poems.js), Zeichnen in `msRender` |
| Soundbed | `sbEnsure()`/`sbToggle()`, `createSoundbed` (soundbed.js) |
| Pools | `loadMaps()`, `loadWs0()`, `addLive()` |
| Engine | wie H14: `tick()`, `step()`, Planung, Bake |

## Prüfliste nach dem Re-Home
- [ ] Seite lädt ohne Konsolenfehler, die Statuszeile zeigt „3D … fps (gemessen)“.
- [ ] Pool: Karten n/20, WS0 481/481. Steht WS0 auf 0, ist Schritt 2 offen.
- [ ] Gedichte: Statuszeile nennt 7 gefunden (± Wikisource), 320 Zitate.
- [ ] Soundbed an: Schellack-Titel läuft, kein „ohne Analyse“.
- [ ] Naht: Autopilot 2 min laufen lassen, keine senkrechte Spiegelachse in der Bildmitte.
- [ ] fps auf Mittelklasse-Laptop und einem Handy eintragen (Formular in OFFEN_UND_FRAGEN).

## Ehrlichkeitsformat
| | |
|---|---|
| SOURCE | H14 im Projekt; hypernorm_r3 aus KFB-Stunt-Car-Race @ design/claude-design-r3 (kopiert 24.10.) |
| DECISION | Sphäre statt Fläche; Wand + 2 Schalen + Band; Naht über Versatz-Überblender statt Spiegelung |
| IMPLEMENTATION | M1 Sphäre · M2 Soundbed, Gedichte, Karten, WS0 · M3 Naht |
| TESTED RESULT | Preview: läuft, Werte siehe DOKU. M3 visuell NOT_TESTED |
| EXPORT | dieses Paket |
| PUBLIC DEPLOYMENT | keins |
| GEORG ACCEPTANCE | M1 „top“ (25.10., bis auf die Naht); formal offen |
| OPEN | siehe OFFEN_UND_FRAGEN.md |
