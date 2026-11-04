# WS0 · Clay Chest PNG / Sprite-Sheet Export & QA · v1.0

Ziel: **2 echte 3×2-Sheets**, **12 separate Sprite-PNGs** mit **echter Transparenz**, reproducible Reihenfolge/Metadaten und **sichtbarer Lesbarkeit bei 96px**. Dies ist eine **Authoring-/Exportanleitung**, keine Zusage, dass ein Rohbild auf Anhieb eine gültige PNG-Alpha-Datei ist.

## 1 · Eingangsprüfung vor Freistellung

1. **Geometrie prüfen**: pro Bild **3 Spalten × 2 Zeilen = genau 6** Chests; für zwei Jobs zusammen 12 **verschiedene**. Keine 4×3-, 2×6- oder unregelmäßige Reihenanordnung durch simples Umbenennen zum Sheet erklären.
2. **Quelle einzeln zeigen**: ein tatsächlich verwendetes, akzeptiertes Chest-PNG isoliert auf neutralem Hell-/Dunkelgrund ansehen; GitHub-Link oder Dateiname allein ist keine Donor-Abnahme. Ohne echten Source-Asset-Import `SOURCE_NOT_ARCHIVED`.
3. **Ganzes Objekt** in jeder Zelle: Deckel, Flügel, Schnorchel, Pilz, Antenne, Krone und Tentakel dürfen die Zellgrenze **nicht berühren**. Sicherheitsabstand ideal 6–10 % Zellweite, größere Extras explizit prüfen.
4. **Keine überlappenden Silhouetten**: Wenn eine Figur in die benachbarte Zelle reicht, ist Auto-Slice **INVALID**; nicht nur die Fremdpixel wegmaskieren, sondern kleiner/abständiger neu generieren.
5. **Referenz/Style**: visuell matte, händisch geknetete Chest-Familie, nicht glatte generische 3D-Robots; mindestens sichtbarer Deckel-/Spalt-/Augen- und Verschlusskomplex.

## 2 · Transparenz ist ein Pixeltest

Rohbilder können einen echten Alpha-Kanal, eine **Schachbrettmuster-Bitmap** oder einen gradientenartigen Background haben. Die Prompt-Anweisung „transparent background“ und das sichtbare Schachbrett **beweisen keine Transparenz**.

**Pflichtchecks pro exportierter PNG-Datei:**
- `mode == RGBA`; echte Alpha-Information, `alpha_min == 0`, `alpha_max > 0`.
- Außenecken wirklich transparent; möglichst transparente Sicherheitsränder, keine eckige Backgroundfläche.
- Das Motiv bleibt auf hellgrau **und** dunkel ohne harte Farbsäume, gebrochene Lid-/Eye-Konturen, Reste eines Checkerboards oder dunkle Halos lesbar.
- `alpha=0` **nicht** allein ausreichend: prüfen, ob vormals kariertes/weißes/RGB-Hintergrundmuster noch als semitransparente Flecken durchscheint. Keine unkontrollierte aggressive White-Key-Maske, die helle Augen/Zähne/Kristalle entfernt.
- **Kein Boden, keine Boden-/Wurfschatten, keine zusätzliche Landschaft**. Innerhalb der eigenen Knetform sind Schatten/Occlusion natürlich erwünscht.

Minimaler tatsächlicher Dateitest (Pillow, statt optischer PNG-Behauptung):

~~~python
from PIL import Image
from pathlib import Path
def inspect(path):
    im = Image.open(path)
    assert im.mode == "RGBA", (path, im.mode)
    lo, hi = im.getchannel("A").getextrema()
    assert lo == 0 and hi > 0, (path, lo, hi)
    assert im.getpixel((0, 0))[3] == 0, path
    return (path, im.size, lo, hi)
for p in sorted(Path("EXPORT").glob("*.png")):
    print(inspect(p))
~~~

**Das ist nur ein Alpha-/Format-Smoke-Test**. Er ersetzt **nicht** das Sichtprüfen echter Background-Reste oder die Prüfung, ob Teile fehlen.

## 3 · Standard Layout + Export

- **Sheet 1:** 1536 × 1024 px = 3 Spalten × 2 Zeilen mit 512×512 Zellen; Indizes 01–06.
- **Sheet 2:** 1536 × 1024 px, identisches Raster; Indizes 07–12.
- **Einzelbilder:** zwölf **512×512-RGBA-PNGs**, anti-aliased, vollständig isoliert, transparent gepolstert, **kein** aufgeblasenes/gestauchtes Motiv. Bewahre die ursprüngliche 3/4-Perspektive.
- **Koordinaten** je Sheet mit 0-basiertem col/row: `x = col*512`, `y = row*512`, `w=512`, `h=512`; Slots in Lesereihenfolge links→rechts, oben→unten.
- **Proportionen** dürfen sich zwischen Figuren unterscheiden. `fit=contain` mit Beibehaltung des Aspekts, keine Zwangsquadrate/Körperkorrektur.
- **Game-Größe 96px**: aus jeder Einzelgrafik eine QA-Vorschau auf 96×96 (mit transparenter Padding-Fläche) erstellen. Augen, dunkler Lid-Spalt, Öffnungslogik und Thema müssen visuell noch zu unterscheiden sein.
- **ZIP:** zwölf einzelne PNGs + zwei Sheets + `manifest.json` + optional `contact_96px.png`, `qa_dark.png`, `qa_light.png`; ZIP-Einträge prüfen, keine leeren Bild-Dateien.

Empfohlene Dateinamen:
~~~text
kfb-chests-[series-id]-s01-3x2.png
kfb-chests-[series-id]-s02-3x2.png
kfb-chests-[series-id]-01-[slug].png
...
kfb-chests-[series-id]-12-[slug].png
kfb-chests-[series-id]-manifest.json
kfb-chests-[series-id]-12-RGBA.zip
~~~

## 4 · Maschinenlesbares Manifest / Schema (Beispiel, **nicht** Ergebnisbehauptung)

~~~json
{
  "schema": "kfb.ws0.clay-chest-series/1",
  "owner": "WS0",
  "seriesId": "EXAMPLE-ONLY",
  "family": "living-clay-chest",
  "humanReview": "PENDING",
  "sourceStatus": "NOT_ARCHIVED",
  "sheets": [
    {"index": 1, "filename": "example-s01.png", "cols": 3, "rows": 2, "cellW": 512, "cellH": 512, "width": 1536, "height": 1024},
    {"index": 2, "filename": "example-s02.png", "cols": 3, "rows": 2, "cellW": 512, "cellH": 512, "width": 1536, "height": 1024}
  ],
  "sprites": [
    {"slot": 1, "sheet": 1, "col": 0, "row": 0, "rect": [0,0,512,512],
     "filename": "example-01.png", "name": "example",
     "shape": "squat", "gaze": "left", "expression": "suspicious",
     "clasp": "off-center", "surprise": "describe",
     "alphaChecked": false, "readable96px": false, "sha256": null}
  ],
  "qa": {"format": "NOT_TESTED", "alpha": "NOT_TESTED", "noCrop": "NOT_TESTED", "noOverlap": "NOT_TESTED", "visual96px": "NOT_TESTED"},
  "generatedWith": {"engine": null, "model": null, "seed": null, "promptSource": null}
}
~~~

**Manifest wird für reale Dateien um alle 12 Sprites mit berechneten Checksums ergänzt.** Kein `true` oder `PASS` allein, weil die Person das Wort „transparent“ im Prompt geschrieben hat. `seed=null` solange nicht tatsächlich aufgezeichnet.

## 5 · Gesicht, Körper und Charakter: 96px visual critic

Für jedes **einzelne** Chest bei 96 px:
- Ich sehe **Kiste**, nicht nur ein Buch, Organ, Gerät oder einen Kopf.
- Ich sehe die **Augen und ihren Blick**; Pupillenstellung variiert über die Familie.
- Ich sehe den **Lid-Spalt**, eine glaubwürdige Deckelöffnung oder Scharnierlinie und den **Clasp/Lock**.
- Ich erkenne den **überraschenden Themenaspekt** ohne jeden Detailtext.
- Ich sehe keine abgeschnittenen Antennen/Tentakel/Flügel.
- Die Form hat Knetgewicht, Oberflächenrelief, aber keine massenproduzierte glatte CGI-Fläche.
- Keine unbeabsichtigte Text-/UI-/Fremdmarke.

**Serienkritik**, zusätzlich zu Einzelkritik: zwölf verschiedene Charaktere; Mix breit/quadratisch/hoch; über die Serie mind. 5 unterschiedliche Blicktendenzen; Schloss-Verteilung; keine serienweiten seltsamen Pupillen-/Keyhole-/Proportions-Copy-Paste-Fehler.

## 6 · Umgang mit vorliegenden Tools

Der bestehende `media/2D_Assets/sprite-sheet-builder.html` kann Einzel-Frames laden, Blätter erzeugen und JSON exportieren. **Unverifizierte Kompatibilität** mit diesem Chest-Raster: Default 7×5 / 192px / Fußlinie / White-Key / Schatten. Für Chest-Produktion zuerst bewusst 3×2 / 512 px setzen, **White-Key deaktivieren**, **Schatten entfernen**, Autofit/Footline nur nach Sichtvergleich nutzen. Eine Umstellung ist noch **kein bewiesener Run**, und der Builder selbst wird durch dieses Dokument nicht verändert.

Wenn ein neues Processing-Skript eingesetzt wird, muss es **echte Alpha-Kompositierung** erhalten, nicht nur Farbschlüsselung; eine Dummy-Transparenz darf nicht als „PNG transparent“ ausgegeben werden.

## 7 · PASS-Ebenen sauber trennen

| Gate | Anforderung | Wer/Beleg |
|---|---|---|
| DESIGN PASS | Georg gefällt die Figur/Serie | Georg im Chat |
| FORMAT PASS | 2× 3×2, 12 Einzelbilder, ZIP-Inhalt | Paketprüfung |
| ALPHA PASS | echte Transparenz, keine Reste | Pixeltest + dunkle/helle Sichtprobe |
| GAME READ PASS | Chest-Gesicht/Idee bei 96px | Kontaktblatt/Review |
| SOURCE ARCHIVED | echte Bildbytes, Hash, dauerhafter Asset-Pfad | WS0/Asset Librarian |
| WORLD/ENGINE ACCEPTED | tatsächlich vom jeweiligen Game-Owner integriert | eigener späterer Gate |

Bisherige historische Georg-PASS-Runden sind **DESIGN PASS**, solange weitere Gates nicht am konkreten Datei-Stand separat belegt sind.

## 8 · Fail-Fast

- **Hintergrund fake/rauschig:** echtes Alpha herstellen und dunkel/hell vergleichen; wenn Motive am Background verschmelzen, neu generieren.
- **Schlecht gerastert/angeschnitten:** neue **separate** 6er-Ausgabe mit Sicherheitsabständen; **kein** reparierter 4×3-Auto-Crop als fertiges 3×2.
- **Zu gleiche Blickrichtungen/Locks:** 12-Slot-Plan gezielt neu gewichten, nur eine Serie tunen statt komplette globale Stilidentität ändern.
- **Zu hohe, dünne Truhen:** Pflichtmix aus squat/square/tall und gemeinsamer 96px-Readability zurücksetzen.
- **Nach zwei nicht verbessernden Reparaturen:** kleinste fehlerhafte Serie einfrieren, Donor und QA exportieren, Rest der Pipeline fortsetzen, sofern kein zwingender Liefergate betroffen ist.

