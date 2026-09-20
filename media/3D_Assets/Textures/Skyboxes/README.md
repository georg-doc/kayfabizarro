# Skyboxes

Fünf Equirect-Himmel als **Vorlagen**, nicht als fertige Assets.

Deploy nach: `media/3D_Assets/Textures/Skyboxes/`

```
https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/Skyboxes/skybox-<name>.png
```

| Datei | Grösse | Was |
|---|---|---|
| `skybox-space.png` | 276 KB | fast flach, dunkelblau mit Sternen. **Der Nacht-Grund.** |
| `skybox-night.png` | 1.1 MB | dunkel, Mond, wenig Struktur |
| `skybox-morning.png` | 880 KB | warmer Verlauf, tiefe Sonne, Wolkenbänder |
| `skybox-day.png` | 1.1 MB | blau, Wolken, hohe Sonne |
| `skybox-alien.png` | 1.4 MB | violett, grosse Sonne, dramatisch |

Alle **4096 × 2048, PNG, equirect 2:1.** Genau das Format, das `skyWaterMat.map` erwartet
(`rollercoaster-ride.v4.js:612`, `SphereGeometry(700, 60, 40)`, `side: BackSide`).

**Drop-in. Keine Konvertierung.**

---

## Warum sie Vorlagen sind und keine Assets

**Der schwere Teil an einem Equirect ist nicht das Malen, sondern die Projektion.**

Die oberste und die unterste Pixelreihe laufen auf **je einen einzigen Punkt** zusammen. Wer auf ein leeres
4096 × 2048 malt, denkt in Rechtecken und bekommt an den Polen einen Wirbel. **Und sieht es erst, wenn es
auf der Kugel liegt.**

**Diese fünf haben die Projektion richtig.** Sonnenstand, wie Wolken zum Horizont hin flacher werden, wo
oben nichts sein darf. **Wer drübermalt, erbt die Verzerrung, die stimmt.**

### Fürs Übermalen

**Die Naht.** Linker und rechter Rand stossen aneinander. Was links steht, muss rechts weitergehen, sonst
ist ein Riss im Himmel. **Nicht beschneiden.**

**Die Pole.** Was in den obersten und untersten zwanzig Pixeln steht, wird zu einem Punkt zusammengezogen.
**Dort gehört Fläche hin, kein Motiv.**

---

## Lizenz

**CC0 1.0.** Kenney, www.kenney.nl. Keine Bedingungen, keine Namensnennung nötig, kommerziell frei.
`License.txt` liegt daneben.
