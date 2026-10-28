# Recherche · Animations-Klassiker für FrizzleBobs Bewegung · WSB · 28.10.2026

**Anlass:** Georg 28.10. („recherchiert auch die animation classics und artists wie preston blair, disney & co.“) mit zwei Preston-Blair-Blättern (Gangarten-Tafel; „Difference between walk + run“ / „The walk“, Hase). Ergänzt den Skill `skills/kfb-cartoon-animation` (v2), ersetzt ihn nicht. Zusammengefasst in eigenen Worten.

## Quellen (Standardwerke)
- **Preston Blair**, *Cartoon Animation* (Walter Foster). Kapitel zu Gangarten, Lauf, Sprung und Gewicht. Dazu Georgs Blätter.
- **Frank Thomas & Ollie Johnston**, *The Illusion of Life: Disney Animation* (1981). Die 12 Grundsätze der Disney-Animation.
- **Richard Williams**, *The Animator's Survival Kit* (2001). Timing gegen Abstand; Gänge aus Kontakt, Tief, Durchgang und Hoch; Gewicht.
- **Warner-Schule** (Chuck Jones, Tex Avery). Starke Schlüsselposen, „Takes“, Wischbilder bei schnellen Bewegungen.
- **Super Mario 64** (Nintendo). Spielgefühl: Ausholen nur kurz, damit die Steuerung sofort reagiert; deutliches Stauchen bei der Landung.

## Was daraus für FrizzleBob gilt
| Grundsatz | Klassiker | Bei uns | Stand / nächster Schritt |
|---|---|---|---|
| **Gang = 4 Schlüsselstellungen je Schritt** | Blair (Hase 1–4: Fuß setzt auf → sinkt ein → Durchgang, anderer Fuß hebt sich → Hochpunkt); Williams gleich | Kontakt 0 → Tief 4 → Durchgang 8 → Hoch 11 (halbe Schleife 15 Bilder) | passt |
| **Das Tief kommt direkt nach dem Aufsetzen** und trägt das Gewicht | Blair Bild 2 „sinks into recoil“; Williams „down position“ | Tief mild (Georg q267), Schwerpunkt dort am tiefsten | passt |
| **Schrittdauer bestimmt den Charakter** | Williams: halbe Sekunde je Schritt = normaler Gang, schneller = eilig, langsamer = bummelnd | 15 Bilder bei 30/s = 0,5 s | passt; für Varianten Tempo ändern statt Posen |
| **Arme schwingen locker gegengleich, Ellbogen gebeugt, Hände eilen nach** | Blair: Arme gegen die Beine; Williams: Hand führt den Bogen zu Ende | Kritik R9: Arme sehr weit und fast gestreckt | **r6: Ellbogen stärker beugen, Ausschlag kleiner, Hand 1–2 Bilder Nachlauf** |
| **Kopf und Ohren schwingen nach** | Disney „follow-through / overlapping action“; Blair-Tafel: Kopflinie (gestrichelt) als weiche Welle | Kopf 2 Bilder hinter der Hüfte (r5); Ohren im Spiel (ear-dangle) | passt |
| **Lauf ≠ schneller Gang** | Blair: im Lauf vorgeneigter Körper, im Flug (Hochpunkt) gestreckt, Arme kräftig; beim Gang hält der hintere Fuß noch Kontakt | „Anlaufen“ liest sich als Ausfallschritt (Kritik R9) | **r6: Schub-Pose nach Blairs Lauf-Kontakt (Vorlage, hinterer Fuß schon gelöst, kurzer Flug)** |
| **Sprung: Ausholen → Strecken → Bogen → Strecken zur Landung → Stauchen → Erholen** | Blair-Tafel „Jump“; Disney Squash & Stretch | Ablauf vorhanden; Streckung am Absprung schwach (+3 %, Kritik R9) | **r6: Absprung länger gestreckt (Arme hoch, Körper lang, Zehen), vor der Landung kurz strecken** |
| **Langsam hinein, langsam heraus**; Bewegung auf **Bögen** | Disney „slow in / slow out“, „arcs“ | r5: weiche Übergänge (Hermite), Kurvenbild je Clip | passt; Bögen der Hände/Füße als Bewegungspfad prüfen (Blender Motion Paths) |
| **Bewegtes Halten statt Standbild** | Disney „moving hold“ | r5: Halten mit leichter Drift | passt |
| **Ausholen in Gegenrichtung** | Disney „anticipation“; Mario: kurz | Wende und Anlauf holen gegen die Richtung aus | passt; im Spiel kurz halten (Steuerung) |
| **Übertreiben mit Volumen** | Disney „exaggeration“, „squash & stretch“ (Volumen bleibt) | Quetschen ≤ 8 % (V-179), Kopf erbt es nicht | passt |
| **Charakter durch Gangart** | Blair-Tafel: Doppel-Wipp-Gang, Stolzieren, Schlurfen, Schleichen, Zehenspitzen, Hüpfen | – | **Vorschlag: für FrizzleBob (großer Kopf, kurze Beine) eignen sich Doppel-Wipp-Gang und Hüpfen besonders; als eigene Clips nach Georgs Wahl** |

## Mario als Spiel-Referenz (Georg 28.10.: Sprite-Tafel)
Georgs Tafel zeigt eine Mario-Figur als 2D-Sprites, 14 Reihen: Stand, Gehen, Laufen, Sprung, Drehen, Salti und Rollen. Was davon für uns gilt:
- **Wenige, starke Bilder je Bewegung.** Jede Pose liest sich auch winzig als Silhouette. Bei uns heißt das: die Schlüsselposen auch „von weitem“ prüfen (Prüfbühne-Ansicht `far`), nicht nur nah.
- **Lauf deutlich vorgeneigt, Gehen aufrecht**, wie bei Blair. Der Unterschied liegt in der Haltung, nicht nur im Tempo.
- **Sprung: eine gehaltene Flugpose**, Arme oben, Beine angezogen; Landung kurz gestaucht. Das entspricht unserem Hochsprung mit bewegtem Halten am Scheitel.
- **Drehungen und Salti** laufen als gleichmäßige Drehfolge, in jedem Bild ungefähr gleich weit. Bei uns: Wende mit gleichmäßiger Drehung (etwa 12° je Bild); ein späterer Salto oder eine Rolle für den Flugmodus nach demselben Muster.
- **Spielgefühl:** Die Figur reagiert sofort, ausgeholt wird nur kurz. Das passt zum Skill: Ausholen im Spiel zusammengedrückt, die Steuerung wartet nicht.

**Bereitstellung:** Georgs Bilder (Blair-Gangarten-Tafel, Blair „Walk + Run“, Mario-Sprite-Tafel) liegen WSB nur im Chat vor. WS0 legt sie ins private Repo; der Pfad kommt hier dazu.

## Für die Abnahme
- Jeden Clip zusätzlich an der Blair-Logik prüfen: Liegt das Tief direkt nach dem Aufsetzen? Bildet die Kopflinie eine weiche Welle ohne Knick? Laufen die Arme gegen die Beine, mit gebeugtem Ellbogen?
- Die Kurvenbilder (`out/abnahme_r10/kurven_*.png`) zeigen die Kopf- bzw. Hüftlinie wie Blairs gestrichelte Welle.
