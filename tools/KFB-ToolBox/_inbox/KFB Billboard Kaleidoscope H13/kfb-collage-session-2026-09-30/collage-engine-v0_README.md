# KFB Collage Engine v0

Stand 27.09.2026 · Schema `kfb.collage-engine.v0` · Kandidat, nicht Stage, nicht Live.
Repo-Ziel (Vorschlag): `tools/collage_engine/` — Claude Design pusht nicht, Integration macht der Web Lead.

## Was sie tut

Seed + Regelwerk + Pool ergeben eine endlose Folge von Einstellungen. Jede Einstellung ist eine
Collage aus bis zu drei Bildebenen und einer Textebene, mit Kamerafahrt, Effekten, Mischmodi,
Masken und einem Übergang in die nächste. Gerendert wird in ein beliebiges Canvas in jedem
Seitenverhältnis. Erster Einsatz: Anzeigemodus für Billboards neben YouTube, KFB Cards und
Three.js-Embeds.

Ein WebGL-Kontext je Canvas, ein Takt, ein Planer. Dateien:

- `kfb-collage-engine.js` — Engine, ohne Abhängigkeiten, `window.KFBCollage`
- `../KFB Collage Engine.dc.html` — Leitstand und Billboard-Ansicht (`?display=billboard`)
- `evidence/` — Belegbilder dieses Laufs

## Einbinden

```js
const eng = KFBCollage.create(canvas, {
  seed: 'kfb-01', preset: 'werbeblock', aspect: '3:1', lang: 'en',
  mode: 'endless',            // oder 'loop' mit loopShots: 8 (nahtlos, nach dem ersten Durchlauf eingefroren)
  guard: true, text: true, led: 0,
  themes: ['alchemy', 'maps', 'propaganda'],
  manifestUrl: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/public_domain/manifest.jsonl',
  seedsUrl: 'tools/public_domain/seeds.json'
});
eng.on('shot', ({ plan, next }) => {});   // neue Einstellung
eng.on('measure', m => {});                // Lesbarkeitsmessung je Text
eng.on('frame', () => {});                 // z. B. texture.needsUpdate = true
```

Three.js: `new THREE.CanvasTexture(eng.canvas)` und im `frame`-Ereignis `needsUpdate = true`.
Mit `autoplay: false` treibt der Gastgeber den Takt selbst: `eng.tick(dtSekunden)`.

Billboard-Link: `KFB Collage Engine.dc.html?display=billboard&seed=kfb-01&preset=subversiv&aspect=3:1&lang=de&loop=8&led=4`

## Pool

1. `media/public_domain/manifest.jsonl` über raw mit Commit-Pin (`PD_PIN`, derzeit
   `f3acaaeb…`, PD-POOL-R1). Gelesen werden `kfb.public-domain-asset/0.2` (fetch_pool.py auf
   main) und das ältere `kfb.pd-item.v1`. Medien kommen über jsDelivr am selben Pin
   (`localPath`), weil raw SVG und Video als text/plain liefert. Thema: `category` >
   Tag `cat:<id>` > Tag gleich Themen-ID > Tag-Tabelle > Anbieter. Manifest-Assets stehen
   vorn in der Ladeschlange. Zeilen mit `stored: false` werden übersprungen.
2. Live-Suche ergänzt, solange das Manifest weniger als `minManifest` (24) Bilder liefert:
   Commons (nur PD/CC0) und Art Institute of Chicago, Suchbegriffe aus
   `tools/public_domain/seeds.json`. Clips aus Commons für Stummfilm, Cartoons, Propaganda,
   Dokus. `live: false` schaltet sie ab.

Befüllung des Manifests: `../export_public_domain/BRIEFING_PD_POOL_R2_R3.md`. Stand 30.09.:
4 Objekte auf main, die Live-Suche ist deshalb noch aktiv.

Bilder unter `minEdge` (640 px lange Kante) werden verworfen, z. B. das IA Item Tile aus R1
(30.09.: als Held hochgezogen wurde es zu Pixelbrei, Regress durch den Manifest-Pfad).
Bilder werden außerhalb des Hauptfadens dekodiert und auf 1024 px Kante verkleinert.
Namensnennung: Fallback-Assets (`tier: fallback-attribution`, nur aus dem Manifest möglich)
landen automatisch im Abspann, der alle `credits.every` Einstellungen läuft.

## Regelwerk (kfb.collage-rules.v0)

Fünf Vorgaben: Werbeblock · Subversiv · Hypnose · Wochenschau · Fiebertraum. Jede überschreibt
Teile von `BASE`: Einstellungsdauer, Übergangsdauer, Ebenenzahl, Aufwandsbudget, Gewichte für
Effekte, Linsen, Mischmodi, Masken, Übergänge, Kamerafahrten, Paletten, Textstimmungen und
Textmodi, Gedächtnisfenster, Lesbarkeitsziel, Nachbearbeitung, Clipanteil, Abspann.

Ebenenrollen: **grund** (vollflächig, z 3) · **held** (Maske an Kompositionsplatz, z 1,5) ·
**akzent** (klein, Mischmodus, z 0,8) · **text**. Die Kamerafahrt wirkt je Ebene mit Parallaxe
1,5/z; der Text steht still.

Kompositionsplätze hängen vom Seitenverhältnis ab: breit (≥ 1,6) Held links oder rechts, Text
gegenüber; hoch (≤ 0,8) Held oben, Text unten; dazwischen Held mittig versetzt, Text als Band.

## Leitplanken für Lesbarkeit

- G1 genau ein Held je Einstellung, nur Effekte, die Umriss tragen (none, duotone, engrave,
  halftone, dither; Zelle ≤ 9), keine Linse; der Akzent liegt nicht auf dem Helden
- G2 Aufwandsbudget je Einstellung (Effekt 0–2, Linse 1, Mischmodus 0–2, Text 1)
- G3 Grundplatte unter Held und Text abgedunkelt (0,42–0,62) und entsättigt (0,55)
- G4 Text steht still, blendet erst nach dem Übergang ein und vor dem nächsten aus. Kontrast
  wird gemessen: Einstellung ohne Text auf 96 px verkleinert, Textfeld ausgelesen, WCAG-Kontrast
  gegen das 10. und 90. Perzentil. Reicht er nicht oder ist das Feld unruhig, kommt Schleier
  oder Band
- G5 Wechselschrift nur bis 14 Zeichen
- G6 Gedächtnis: kein Bild, Effekt, Übergang, keine Palette und kein Text im Fenster doppelt;
  ist der Pool kleiner als das Fenster, kommt das am längsten nicht gezeigte Bild

`guard: false` schaltet G1–G4 ab (zum Vergleich im Leitstand).

## Tests dieses Laufs (27.09.2026, Claude-Design-Vorschau, verdeckter Rahmen, Software-GL)

TESTED RESULT:
- Effekt-Labor, Kamerafahrt: alle sechs Fahrten rendern (Kippen, Ranfahrt, Dolly-Zoom,
  Umkreisen, Kartenflug, Schweben). Kartenflug mit nur einer Karte fällt wie gebaut auf die
  Ranfahrt zurück. Mit Zusatzkarten: NOT_TESTED.
- Pool live: 35 Bilder aus 11 Themen, 71 nicht freie Treffer verworfen, 1 nicht ladbar.
- Planer, 300 Einstellungen, Seed `kfb-01`, Werbeblock, 35 Bilder, 23,6 min: 0 gleiche
  Übergänge, Paletten oder Heldeneffekte hintereinander · gleiches Bild frühestens nach
  12 Einstellungen (Median 14) · 0 über Budget · 289 von 300 Kombinationen Held·Effekt·
  Übergang·Palette einmalig · 240 von 266 Texten einmalig (Wiederholung erst außerhalb des
  40er-Fensters).
- Loop 6: nach dem ersten Durchlauf eingefroren, Länge 27,367 s, der Sprung von Ende auf
  Anfang ist der Übergang von Einstellung 5 in 0 (push), also nahtlos.
- Bilder in 16:9, 21:9, 3:1, 9:16 angesehen; Übergänge glitch und push mitten im Verlauf
  angesehen; Schutz an/aus am selben Seed verglichen; Messzeile im Leitstand zeigt z. B.
  „Kontrast 9.2:1 (ohne Schutz 1.9:1) · Behandlung schleier“.
- Zwei Fehler im Bild gefunden und behoben: Heldeneffekt „lines“ machte den Helden
  unkenntlich (G1 jetzt Positivliste); Akzent lag auf dem Kopf des Helden (Platzwahl jetzt
  außerhalb der Heldenfläche). Ein Fehler in der Zahl gefunden und behoben: gleiches Bild in
  aufeinanderfolgenden Einstellungen, weil das Gedächtnisfenster größer als der Pool war.

30.09.2026: Manifest-0.2-Pfad eingebaut. NOT_TESTED: Laden der 4 R1-Objekte über
jsDelivr am Pin, SVG als Ebene, Anzeige „aus Manifest“ im Leitstand (zur Prüfung raus).

NOT_TESTED: echte Bildrate auf GPU (die Vorschau lief verdeckt mit Software-GL, gemessene
Zeiten dort 3–900 ms je Frame sind nicht aussagekräftig) · Clips als Ebene · Manifest-Pfad ·
Abspann · WebM-Aufnahme · Mobil · Three.js-Einbindung.

## OPEN

- Mehrere Billboards in einer Szene brauchen EINE Engine mit mehreren Ausgaben statt je einen
  Kontext (Projektregel 5; Browser erlauben etwa 16 Kontexte).
- Effekt-Shader und Paletten stehen jetzt im Labor und hier. Das Labor soll von hier lesen.
- Seed bestimmt Plan, Effekte, Texte und Kamera. Welches Bild kommt, hängt bei Live-Suche von
  der Ladereihenfolge ab; mit Manifest und gleichem Stand ist es reproduzierbar.
- Audio aus dem Pool ist nicht angebunden.
