# WhackMan v1 — Changelog 2026-09-22

## Additiv seit 2026-09-21
- Dots: Feder-Aufzug ersetzt durch Ballistik (Impuls-Event, Schwerkraft, Squash&Stretch beim Absprung/Aufprall, abklingende Nachhüpfer). Einsammeln = Flugbogen mit Shrink im Scheitel.
- Licht: Tageslicht-Setup ersetzt durch Dämmerung — Himmelsquelle kalt/schwach von oben, max. 6 Fackeln im Pool (decay 2, zwei Sinus-Flacker-Frequenzen), sichtbare Glut per Material-Emission, Exp2-Nachtnebel als Sichtgrenze.
- Animation an Bewegungstempo gekoppelt (vorher feste Clip-Rate); Walk/Run getrennt; Lauftempo von 2,7 auf 1,45 Zellen/s korrigiert.
- UI: Meta-Kontrollen hinter Icon oben rechts (Tab/Esc); HUD unten links + Hint-Zeile (5 s Fade).
- Schattenkamera folgt Akteur (Radius 28 statt 53 Grundriss-weit); Pixeldichte auf 1,5 gedeckelt (Performance).

## Bekannte offene Punkte (nicht in diesem Stand behoben)
- **Kollision Dots**: Pickup-Trefferfenster prüft nur Bodenkontakt — Ghost kann während der Flugphase durchlaufen und den Dot beim Herunterfallen "stehlen". Braucht Trefferprüfung über die gesamte Flugkurve.
- **Kollision Wände**: keine Wand-Kollision für Spieler/Pursuer implementiert.
- **Kontakt-Feedback**: nur einfache Quadrat-Sprites bei Kontakt; keine Charakter-Reaktion (Squash, Knockback).
- **Zufällige Idle-Animationen**: schieben Figuren seitlich in Wände (fehlende Kollisionsabsicherung) — sollten entfernt werden, bis eine sichere Alternative existiert.
- **Licht**: Dämmerung wird Standard-Richtung, ist aber aktuell zu dunkel (Ambient/Hemisphere-Intensität zu niedrig).
- **Material**: Boden (Gras) und Wände wirken spiegelnd/plastikhaft statt matt — Roughness/Metalness-Pass für Maze- und Terrain-Materialien fehlt.
- **Sounddesign/Mix**: Platzhalter-Niveau, Überarbeitung für später vorgemerkt.

## Für den nächsten Chat
1. Wand-Kollision (Spieler + Pursuer, Maze-Grid-basiert)
2. Dot-Pickup-Trefferfenster über gesamte Flugkurve
3. Zufällige Idle-Animationen entfernen (wm-pursuers.js / wm-motor.js)
4. Echtes Kontakt-Feedback (Squash/Knockback statt Quadrat-Sprite)
5. Dämmerungslicht heller ziehen
6. Material-Pass Roughness/Metalness (Boden + Wände matt)
7. Später: Sound/Mix-Überarbeitung
