# kfb-tod-bloedsinn.v1 · Baustein „eigener Tod“

Von Prüfer D für den WS1-Lead, Stand 21.10.2026.

**Georgs Urteil:** PASS mit TUNE. Pflicht sind D1 (keine Kugeln an den Tropfen; ist in diesem Baustein schon umgesetzt) und D5 (Claymation-Lettering, steht noch aus). Kreuz-Pupillen beim Tod sind **freigegeben**.

## Was er tut
1. **Tusche:** Kanon-Tusche `#1f1a14` sammelt sich oben mit gewellter Kante und läuft in zähen Läufern herab.
   - Front stumpf und rund in Körperbreite, keine Kugelköpfe.
   - Die Breite schwillt an und ab.
   - 3 lange Hauptläufer an den Seiten, sonst kurze Läufer; die Bildmitte bleibt frei.
   - Ein Glanzstreifen gibt den zweiten Ton.
2. **„Blödsinn!“** in `--kfb-blodsinn` `#b8361f`, Buchstaben gestaffelt mit Pop und Stauchen/Strecken, danach leichtes Wackeln. In v1 ein 2D-Knet-Platzhalter.
3. **Rückrufe:** Ton, Augen und Zoom schickt der Baustein an den Host. Eigene Klänge, Augen oder Kameras hat er nicht.

## Einbau
```js
import { createTodScreen } from './kfb-tod-bloedsinn.v1.mjs'
const tod = createTodScreen({
  onCue: (name) => kfbAudio.play('tod.' + name),     // 'fall' 0 s · 'die' 0,42 s · 'word' 0,75 s (nur WS-Audio-Pfad, V-598)
  onEyes: (style) => eyeRig?.setPupil?.(style),       // 'kreuz' beim Tod, 'normal' beim Aufstehen (Augen-Rig v6 braucht pupil 'kreuz')
  onZoom: (e) => cameraZoomToCorpse(e),               // 0 → 1 in 1,2 s; der Host bewegt seine eigene Kamera
  onWordSettled: () => showDeathMenu(),               // D2: das spieleigene Tod-Menü erst jetzt zeigen, sonst steht das Wort doppelt
})
// beim Wechsel in die Niederlage:
tod.play()
// bei Neustart/Aufstehen (blendet 0,3 s aus):
tod.stop()
```

**Optionen** (`TOD_DEFAULTS`):

| Gruppe | Optionen |
|---|---|
| Text | `word` |
| Farben | `ink`, `inkHi`, `red`, `redHi`, `redLo`, `saum` |
| Läufer | `runners`, `mainRunners` |
| Zeiten | `dieAtS`, `wordAtS`, `zoomS`, `fadeS` |
| Sonstiges | `seed` (deterministisch), `zIndex`, `reducedMotion` |

**Schrift:** Bangers muss auf der Seite geladen sein. Der Baustein lädt sie vor und zeichnet das Wort erst danach, höchstens 0,5 s später.

## Pflicht-TUNE D5: Claymation-Lettering
Georg: „Blödsinn muss als Claymation-Modell gebaut werden, aus comicmäßig gebogenem und typografisch sauber gestaltetem Lettering.“

Der Baustein nimmt einen eigenen Wort-Renderer an:
```js
createTodScreen({ wordRenderer: ({ word, P, R, parent }) => ({ el, settleS }) })
```
- `el` ist ein DOM-Element, zum Beispiel eine kleine three-Canvas mit dem 3D-Knet-Wort.
- `settleS` ist die Zeit, bis das Wort steht. Danach kommt `onWordSettled`.

Vorschlag für die Umsetzung:
- gezeichnetes Lettering mit eigenen Buchstabenformen, Grundlinie im Bogen, einheitlicher Strichstärke, sauberer Laufweite und gesetztem ö
- daraus extrudierte Knet-Körper mit gerundeten Kanten, Fingerabdruck-Normalen, zwei Tönen und Saum
- je Buchstabe animiert: Pop, Stauchen, Nachwippen

## Dateien
| Datei | Inhalt |
|---|---|
| `kfb-tod-bloedsinn.v1.mjs` | der Baustein, ohne Abhängigkeiten |
| `demo.html` | eigenständige Demo, braucht einen lokalen Server wegen des ES-Moduls: `python3 -m http.server`, dann `/demo.html` |

Belegbilder: `../../img/combat-34-baustein-tod-1s.png`, `../../img/combat-35-baustein-tod-36s.png`

## Offene Bitten (an WS0 weitergegeben)
- L15 `bloedsinn_stinger` (Ton zum Wort)
- L8 `player_hurt`
- Augen-Rig v6: `pupil: 'kreuz'`
