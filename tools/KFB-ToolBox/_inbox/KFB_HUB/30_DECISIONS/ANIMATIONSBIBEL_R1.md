# KFB-Animationsbibel · R1 · SSOT für Figuren-Animation (V-919, aus WSB-Entwurf 28.10.2026)

**Auftrag Georg 28.10.:** „die Basics umsetzen für Medium- und Large-Rigs, später Double-Bounce-Walk und die anderen Feature-Walks … mit den Cartoon- und Animation-Skills und der Recherche … als Standard-Animationsbibel, zentrales SSOT im weitesten Sinne.“
**Stellung:** Diese Bibel ist das SSOT für Figuren-Animation (Georg 28.10.); sie fasst zusammen und verweist. Methoden-Eigner bleibt `skills/kfb-cartoon-animation/` (Georg nennt auch die v2: `references/legacy-v2-full.md`). Projekt-SSOTs (Bewegung, Physik, Kamera = Spielcode) bleiben, wie sie sind. Ort: `30_DECISIONS/ANIMATIONSBIBEL_R1.md` (V-919); Recherche: `replies/RECHERCHE_ANIMATION_KLASSIKER_R1.md`.

## 1 · Grundsätze (Kurzfassung; Quellen: Skill v2, Recherche `replies/RECHERCHE_ANIMATION_KLASSIKER_R1.md`)
1. **Bewegung ist Bedeutung in der Zeit:** Ursache → Ausholen → Aktion → Kontakt/Aufprall → Nachschwingen → Erholen (Skill §2.1). Jede Phase bekommt eigene, ausreichende Zeit (Georg q275).
2. **Timing ≠ Abstand:** Die Dauer sagt wenig. Erst der Abstand der Bilder macht Gewicht, Beschleunigung und Federn (Williams; Skill §2.2). Langsam hinein, langsam heraus, auf Bögen (Disney).
3. **Gang nach Blair und Williams:** je Schritt Kontakt → Tief (direkt nach dem Aufsetzen) → Durchgang (Arme neben dem Körper) → Hoch. Arme gegengleich, Ellbogen gebeugt. Die Kopflinie ist eine weiche Welle.
4. **Überlappen:** Brust 1, Kopf 2, Arme 3 Bilder hinter der Hüfte (30/s). Ohren schwingen im Spiel nach (ear-dangle).
5. **Quetschen und Strecken mit Volumen,** höchstens 8 % (V-179). Der Kopf erbt es nicht. Die stärkste Stauchung liegt in der Sprung-Landung, nicht im Gehen (Georg q267).
6. **Bewegtes Halten statt Standbild** (Disney „moving hold“).
7. **Spielgefühl wie Mario:** sofortige Antwort, Ausholen nur kurz. Starke Silhouetten auch von weitem. Drehungen laufen gleichmäßig.

## 2 · Technischer Standard (wie bei V-891 r4–r6 gebaut und gemessen)
| Regel | Wert |
|---|---|
| Bildrate | 30 Bilder/s, alle Knochen je Bild geschlüsselt |
| Wurzel | `root` steht still (in place). Bewegung, Physik und Flugbahn gehören dem Spielcode. |
| Füße | Fußplan je Bild: Laufband beim Gehen (Geschwindigkeit in `clips.json`), fester Stand, Drehen um den Ballen. Zwei-Knochen-IK geschlossen gerechnet. Knie zeigt in Fußrichtung. Boden ±1 cm (G3). |
| Übergänge | Hermite-Kurve durch die Schlüsselposen; Fußwerte (Hub, Ferse, Ausrichtung) formtreu; kein Knick am Wegpunkt |
| Schleifen | Bild N = Bild 0; Start- und Stopp-Clip enden bzw. beginnen genau in einem Schleifenbild (samt Überlappen) |
| Metadaten | `clips.json` je Clip: Rolle (Schleife/einmalig), Phasen (Bildnummern), Laufband, Ende gedreht ja/nein, je Bild Hüfthöhe, Drehung, Fußplan |
| Ende einmaliger Clips | `LoopOnce` + `clampWhenFinished`; genau am Clip-Ende nicht abtasten (three.js springt auf Bild 0) |

## 3 · Abnahme
- Prüfbühne N35 v1.3 für **jedes Bild** (FB_CANON bzw. die Zielfigur; Augen baked-rig).
- **Heute/neu:** Bildstreifen und GIF (gleicher Maßstab, gemeinsame Bodenlinie).
- **Kurvenbild je Clip:** Hüfthöhe, Hüftdrehung, „Ruck“ (harte Stellen als Spitzen).
- **Blinder Kritiker** (K4/K6/K10), dazu die Blair-Prüffragen: Tief nach dem Aufsetzen? Kopfwelle ohne Knick? Arme gegengleich und gebeugt?
- **Erst danach Georg.** Er nimmt Bilder ab, nie Zahlen allein.

## 4 · Basis-Satz (zuerst, für Rig_Medium **und** Rig_Large)
| Clip | Stand | Medium | Large |
|---|---|---|---|
| Stand (Idle mit Atmen, bewegtes Halten) | offen | – | – |
| Gehen-Schleife + Anfangen + Anhalten | V-891 r6 (Kritik läuft) | ✓ | offen |
| Laufen-Schleife + Anlaufen + Abbremsen | offen (heute: Anlauf/Bremsen ohne Laufzyklus) | – | – |
| Hochsprung aus dem Stand | V-891 r6 | ✓ | offen |
| Sprung aus dem Lauf, Fallen, Landen | offen | – | – |
| Wende 180° / Drehen am Ort | V-891 r6 (Wende mit Hüpfer) | ✓ | offen |
| Fahren im Dach / Cockpit (J-7) | V-912 r3 | ✓ | offen |
| Jetpack-Flug (V-910): Start, Schweben, vorwärts, Kurve L/R, Landung | geplant | – | – |

**Für Rig_Large nötig (Frage an WS0):** die Quelle Rig_Large-Bewegungsclips (KayKit-Pfad) und eine Abnahmefigur mit KFB-Augen. Das Verfahren ist dasselbe; die Posen werden auf die Knochenlängen des Large-Rigs umgerechnet (Fußplan, Laufband und Hüfthöhen skalieren mit der Beinlänge).

## 5 · Später: Charakter-Gänge (nach Georgs Wahl)
Doppel-Wipp-Gang, Stolzieren, Schlurfen, Schleichen, Zehenspitzen, Hüpfen (Blair-Tafel), dazu Salto oder Rolle (Mario-Tafel). Jeder als eigener Clip auf dem Basis-Verfahren; Posen neu, Technik gleich.
