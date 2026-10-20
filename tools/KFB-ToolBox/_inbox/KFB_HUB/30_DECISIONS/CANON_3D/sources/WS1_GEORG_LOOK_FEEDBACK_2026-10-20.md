# Georgs Look-Feedback an WS1 · 20.10.2026 (Gelände-Probe, #439)

**Quelle:** Georg direkt im WS1-Chat am 20.10., mit Screenshots aus der Gelände-Probe (https://ws1-preview.kayfabizarro.pages.dev/gelaende-probe) und dem Spiel (`look=terrain2`). WS1 schreibt mit, damit nichts über Umwege läuft. Georgs Wortlaut ist sinngemäß, Kernsätze stehen in Anführungszeichen. **Status:** Georg-Entscheide bzw. -Korrekturen; die Übernahme in den Kanon macht WS0.

## 1 · Farbflächen-Formen (Ebene 2 „organische Farbflächen“)
- „Das sind alles keine organischen, fließenden Formen, wie sie ein Cartoon-/Comiczeichner verwenden würde.“
- **Keine sichtbaren Schnittkanten.** Davor schon: „Die Übergänge zeigen die typischen Vektorpfad-Bugs; da dürfen keine harten Schnittkanten zu sehen sein.“
- **Keine schlecht designten, langgezogenen Zungen.**
- Übergänge sollen „organische Formen sein, die cartoonig ineinanderfließen“, dazu „Dots und Sprenkel mit natürlicher Variation und Verteilungsmustern“.
- **Folgerung WS1:** Schwellwert-Rauschen (fbm + Domain Warp) erzeugt Mäander, dünne Hälse und Zungen und taugt dafür nicht. Stattdessen kommen geschlossene, gerundete Blob-Formen mit weicher Vereinigung (smooth-min), Größenhierarchie und Verschachtelung. Wände bekommen dasselbe Feld, nur im Wert dunkler, ohne harten Wechsel an der Hangkante.

## 2 · Berge und Felsen
- „Die unnatürlich zackigen Berge müssen wir vermeiden bzw. anders lösen und dabei die Etherington-Stone-Konzepte anwenden.“
- **Steine tiefer:** Georg stimmt dem Vorschlag aus R2 zu (Findling als umgekehrter Eisberg, 40–50 % eingesunken, Kappe ≤ 50 %).
- **Kontakt-Brocken** (V-565) einbauen, von Georg bestätigt.

## 3 · Erdung, Schatten, Komposition
- Alle Props und Dioramen brauchen „den dunklen (nicht schwarzen) Bodenkontakt am unteren Rand“, ebenso Übergänge wie Baumkronen-Unterseiten. Begriff: **Erdung / Kontakt**.
- **Echte 3D-Schatten** erwünscht, „falls nicht zu teuer“. In der Probe gemessen: 60 fps auf Georgs Mac.
- Wichtig (aus Georgs Web-Chat 19.10., von WS0 nur teilweise übernommen):
  - **Vordergrund-Tonmasse:** eine große dunklere Fläche unten im Bild, „wie bei Roadrunner“, kein Gradient.
  - **Farbige Outlines** nur an bestimmten Kanten.
  - **Schattenfamilie je Biom:** 4 Flächenfarben, shadow, deepShadow (nur bei Überlagerung oder engem Kontakt), edgeAccent; höchstens 2 Schattenstufen, keine Multiply-Kaskade.
  - Diese Punkte fehlen bisher in `CANON_3D_R1`.

## 4 · Stil-Referenzen (Recherche-Auftrag Georg)
- 2.5D/3D-Animation (Road Runner/Looney Tunes, Pixar, Disney, Animaniacs, Rick and Morty), Klassiker (Art Lozzi/Hanna-Barbera), **Material-Mix als Stil**, Farb- und Lichtdesign.
- **Ergebnisse:** `WS1_R10_CARTOON_HINTERGRUND_KLASSIKER_R1.md`, `WS1_R11_3D_ANIMATION_FARBE_LICHT_R1.md`.
- **Experiment:** Stilbruch „Spielbrett (Schachbrett mit `edge3.jpg`-Kacheln) + Knet-Inseln“ als möglicher eigener Look, wenn die Übergänge sauber sind.

## 5 · „Banden“ in #439
- Georg weiß nicht, was mit „Banden“ gemeint ist. Seine Vermutung: die Joyride-Race-Track-Banden oder das Fahren an Wänden.
- In seinem Web-Chat vom 19.10. stehen „Höhenbänder“, „Farbbänder“ und „Bandenkanten“; das spricht für Farb**bänder**.
- **Bitte WS0:** Quelle von „Banden und Rampen“ in #439 selbst klären. Bis dahin baut WS1 keine Banden- oder Rampen-Geometrie.

## 6 · Abstimmung
- Georg 20.10.: „alle Regeln und Updates hier an WS0 bei GitHub – stimmt euch ab“.
- WS1 legt die Recherchen R1–R4, R10 und R11 als `WS1_*` in `CANON_3D/sources/` ab. Nur neue Dateien; `MANIFEST.tsv` und `CANON_3D_R1.md` pflegt WS0.
