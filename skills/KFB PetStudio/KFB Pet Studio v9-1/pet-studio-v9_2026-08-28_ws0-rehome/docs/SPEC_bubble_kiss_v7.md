# SPEC — Die Blasenschicht v7 (`kss-v1.0`)

Vertrag für `studio-v7/bubble-kiss.v1.js`. Er ersetzt §2 aus `INTEGRATION.md` des WS0-Exports vom
25.8. (dort wird die Schriftgröße je Bild aus der Pet-Höhe gemessen — genau der v6-Fehler,
Begründung in `ABGLEICH` §3c).

---

## 1 · Das Prinzip

```
1. Die Blase wird EINMAL gezeichnet, in einer festen Entwurfsgroesse (REF.font 34).
2. Auf die Buehne kommt sie nur als transform: scale(k) — k stetig aus der Kachel.
3. Neu gezeichnet wird nur bei neuem TEXT, neuer ART oder neuer ZIPFELRICHTUNG.
```

Deshalb *kann* die Größe nicht springen: es gibt keinen Neubau, der springen könnte. Neu gezeichnet
wird, wenn jemand etwas anderes sagt — also mit dem Satz, nicht mit der Kamera.

Was sich bewegt, liegt woanders: die **Verbindung zum Kopf** (Dreieck bei Sprache, drei atmende
Kreise beim Gedanken, nichts beim Schrei) wird jedes Bild neu gemalt, in Bühnenkoordinaten, in einer
eigenen Lage über der Bühne. Damit zeigt sie immer auf den Kopf, ohne dass die Blase angefasst wird.

---

## 2 · Die Entwurfsgröße (`REF`)

| Feld | Wert | Bedeutung |
|---|---|---|
| `font` | 34 | Entwurfs-Schriftgröße. Bei ihr sieht die Linie richtig aus. |
| `pen` | 3,4 | Linienbreite bei Entwurfsgröße; skaliert mit `k`. |
| `padX` / `padY` | 20 / 15 | Innenabstand. **Einmal** angewandt — der Zeichner zieht ihn ab. |
| `radius` | 20 | Ecken der Sprechblase. |
| `tail` / `foot` | 46 / 30 | Zipfellänge / Fußbreite. Ringsum als Leinwandreserve. |
| `shadow` | [5, 6] | Versatz unten rechts, **hart**, kein Blur. Licht oben links. |
| `ink` / `shade` | `#1f1a14` / `rgba(31,26,20,.22)` | Tusche und ihr Schatten. |
| `letterShare` | **0,061** | Letteringhöhe als Anteil der Kachel. **Der eine Griff für alle vier Arten.** |
| `tile` | 557 | abgeleitet: `font / letterShare`. Kachelbreite, bei der `k = 1`. |
| `min` / `max` | 0,22 / 2,60 | Grenzen von `k`. |

**Die Kanon-Tusche ist für Blasen ausgesetzt** (Georgs Freigabe 25.8.: »von mir aus auch deadlines
mit shadow«). Hier läuft eine gleichmäßige Linie plus harter Schatten — dieselbe Lichtlogik wie
Karte und Bodenschatten, nur ohne die Modulation, die bei kleinen Formen die Linie auffrisst. Für
Karten, Figuren, Bodenschatten und Tipp-Punkte gilt die Kanon-Feder **unverändert weiter**
(`docs/SOP_kfb_ink_v1.md`).

---

## 3 · Der Einbau, vier Zeilen

```js
import * as KISS from './studio-v7/bubble-kiss.v1.js';
await KISS.ready();                      // Schriften laden, BEVOR gemessen wird

// einmal je Satz:
const b = KISS.render({ kind: 'speech', text, paper: '#fdf7e6',
                        tail: { dx, dy, len: 46, foot: 30 } });
stageLayer.appendChild(b.cv);

// jedes Bild:
const k = KISS.scaleFor(gnd.screenTile(cam, cvW, cvH, 2.0, footWorld), userScale);
b.cv.style.transform = `translate(${x - b.cx * k}px, ${y - b.cy * k}px) scale(${k})`;
KISS.connector(overlayCtx, { from:{x,y}, to: face, rx: b.reach.x*k, ry: b.reach.y*k,
                             k, kind: 'speech', paper: '#fdf7e6', phase });
```

Drei Regeln zum Einbau, jede einmal teuer bezahlt:

- **`ready()` vor der ersten Messung.** Sonst misst die Leinwand still die Ausweichschrift.
- **Der Kopfort kommt aus der stillstehenden Wurzel**, nicht aus dem Hüllkasten der animierten
  Hülle (Ruhe-Clip: 7,0 px beim Hasen, 3,4 beim Pinguin — ein Pendel).
- **Das Gesicht liegt bei `body.facePitch`** (Anteil der Höhe unter dem Scheitel), nicht am Scheitel.
  Gesprochen wird im Gesicht.

---

## 4 · Die vier Arten

| Art | Silhouette | Schrift | Verbindung |
|---|---|---|---|
| `speech` | Rechteck mit Radien, **Zipfel im Pfad** | Shantell Sans 600 | Dreieck |
| `thought` | Randbehandlung `circles` (Wolke) | Shantell Sans 600 | drei atmende Kreise, abnehmend |
| `whisper` | wie `speech`, Linie gepunktet | Shantell Sans italic 400 | Dreieck |
| `scream` | Randbehandlung `spikes` (Zacken) | Bangers 400/40, ALLCAPS | **keine** |

**Der Schrei hat keinen Zipfel** (`tailAng: null`) — ein Schrei hat Zacken, keine Pfeilspitze.
**Flüstern strichelt in Anteilen der Entwurfsschrift**, also in jeder Skalierung derselbe Rhythmus.
Wolke und Stern kommen aus `edge-treatment.v1.js`: Grundform plus überlappende Kreise bzw. Zacken,
wechselnde Größen in einem stetigen Bereich, alle zum Zentrum orientiert, Grundform bleibt lesbar.

**Der Zipfel: zwei Fälle, nicht vier.** Der Fuß sitzt auf der **Unterkante**, die Spitze zeigt nach
unten und **lehnt** zum Sprecher (`lean = dx × 1,7`, geklemmt). Oben nur, wenn die Blase unter dem
Gesicht sitzt. Vorher entschied die Geometrie, welche Kante zum Gesicht schaut — bei einer Blase
seitlich über dem Kopf war das die Seitenkante, und ein waagerechter Zipfel liest sich als Lappen.

---

## 5 · Abnahmeblatt

Läuft als `KFB Bubble Proof v7.dc.html` (vier Arten nebeneinander, Zoom-Regler, Zähler).

- [ ] Zoom-Regler von Anschlag zu Anschlag: Blasenbreite **monoton**, keine Stufe > die
      Kamerabewegung selbst (v7 gemessen: 8,6 %).
- [ ] Zähler der Neuzeichnungen bleibt bei Kamerabewegung **auf demselben Wert**.
- [ ] 150 Bilder Ruhe, nichts angefasst: Kachel · Maßstab · Blasenbreite · Lage · Zipfelrichtung je
      **ein** Wert. (Standardzustand prüfen, nicht den angeklickten — v5-Post-mortem, Muster 5.)
- [ ] Satz mittig in der **Grundform**, aus dem Zeichner gemessen (`body`, `text.w`), nie per Auge.
- [ ] Zipfel zeigt zum Gesicht, in beiden Lagen, und hat im Fuß **keine** Linie.
- [ ] Schrei: Zacken, kein Zipfel. Flüstern: gepunktet, in jeder Größe gleicher Rhythmus.
- [ ] Denkblase: drei Kreise atmen, **wandern nicht**.
- [ ] Frisch geladen, nichts angeklickt: `k` im Bereich, Feder aus der Entwurfsgröße.

---

## 6 · Was hier absichtlich fehlt

- **Regler für Linienbreite, Schriftgröße und Zipfellänge.** Sie gehören der Entwurfsgröße; wären
  sie bedienbar, gäbe es wieder mehrere Wahrheiten über dieselbe Blase. Der einzige Griff nach außen
  ist `letterShare` (alle Blasen gleichmäßig) und der Regler `Balloon scale` (die Bühne).
- **Sieben Stimmen.** v5/v6 hatten sie; v7 hat vier Arten. Eine Stimme, die nur eine andere Schrift
  ist, ist keine Art — sie ist ein Textstil und kann später als Feld dazukommen.
- **Textfelder auf der Bühne.** Der Satz steht auf der Leinwand (Falle 2 im HANDOVER).
- **Mehrzeiliger Umbruch.** Bewusst offen: er braucht eine Entscheidung über die maximale Blasenbreite
  im Spielmaßstab, und die hängt an WS0s Antwort auf `ABGLEICH` §5.3.
