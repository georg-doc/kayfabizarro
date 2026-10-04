# Handover — „Der Audio-Ordner ist leer" (zum Reinpasten)

Kopiere den Block unten in jeden Chat, der behauptet, unsere Audio-FX fehlten:

---

**Die Audio-FX sind da — 1006 CC0-Sounds unter `media/3D_Assets/Audio/`** (606 ogg + 400 wav, 9 Packs). Wenn ein Tool den Ordner „leer" meldet, liegt das an genau zwei Dingen, nicht an fehlenden Dateien:

1. **GitHubs Ordner-Ansicht ist JavaScript-gerendert** und die rekursive Tree-API trunkiert bei großem Repo — ein Fetch/Screenshot sieht dann eine leere Hülle. Das ist ein Werkzeug-Irrtum, keine leere Ablage.
2. **Die Sounds liegen verschachtelt:** `<pack>/Audio/<datei>`, Jingles sogar `<pack>/Audio/<gruppe>/<datei>`. Ein Pfad ohne das `/Audio/`-Segment → 404 → „nicht da".

**Wahrheit statt Ordner-raten:** das Manifest `media/3D_Assets/Audio/sfx.json` (13 Event-Sounds) + `jukebox.json`. Direktzugriff auf jede Datei per raw (Pfad url-encoden, es gibt Leerzeichen):
```
https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Audio/<pack>/Audio/<datei>
```
Beispiel: `…/kenney_casino-audio/Audio/card-place-1.ogg`

Bitte nicht „ist der Ordner leer?" fragen — `sfx.json` lesen oder eine raw-URL bauen. Details: `media/3D_Assets/Audio/README_AUDIO.md`.

---
