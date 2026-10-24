# An WS0 · Top 5 von Claude Design für den Mindscape

Fünf Ideen, an die wir bisher nicht gedacht haben. Jede passt zum Grundsatz „Pools, Gewichte, Seed, keine Kuratierung“ und nutzt, was schon läuft. Reihenfolge nach Nutzen pro Aufwand.

## 1 · Der Bake wird ein 360°-Film (Technik + Reichweite)
Die Engine-Fläche ist schon 2:1, also genau das Seitenverhältnis eines Equirect-Bildes. Fehlt nur ein Schritt: Wand, Schalen und Band einmal je Frame mit einer Würfelkamera (`CubeCamera`) aufnehmen, nach Equirect umrechnen und durch die H14-Bake-Pipeline schicken.
- Ergebnis: ein deterministischer 360°-Film je Seed, mit Spatial-Media-Metadaten.
- Abspielbar in jedem 360°-Player, auf YouTube VR und auf Headsets.
- Löst nebenbei die schwache Leistung auf Mobilgeräten: Wer live nicht kann, bekommt den Film.
- Zusatz: `renderer.xr.enabled = true` gibt einen WebXR-Modus für Quest-Browser fast ohne Mehrarbeit.

## 2 · Klang kommt von dort, wo der Text steht (Raumklang)
Gedichtzeilen und Schellack-Titel bekommen je einen `PannerNode` mit HRTF, an der Position ihrer Zeile auf dem Band bzw. an einem Seed-Ort auf der Wand. Die Blickrichtung steuert die Mischung: Was man ansieht, wird lauter und trockener, was hinter einem liegt, leiser und halliger.
- Passt zum Kopfhörer-Setting der Binaural-Schwebung.
- Ein AudioContext, kein neuer Besitzer (Regel 5).
- Macht Umsehen hörbar.

## 3 · Blick als Gewicht, Pfad als Seed (Interaktion ohne Kuratierung)
Die Verweildauer des Blicks auf einer Richtung wird gezählt. Sie fließt im nächsten Zyklus als Gewichtsmultiplikator in die Pools: Bildart, Kontext und Palette dessen, was man angesehen hat.
- Die Auswahl bleibt prozedural: Der Betrachter kuratiert nicht, er wichtet nur.
- Seed plus Blickprotokoll ergibt einen reproduzierbaren persönlichen Mindscape.
- Der Pfad lässt sich teilen und erneut abspielen, auch als Bake (siehe 1).

## 4 · Übergang durch die eigene Schale (Rabbit-Hole aus Bestand)
Für „Betreten/Umstülpen“ braucht es keine neue Szene. Die Kamera fliegt durch Schale B (r 4,2). Während des Flugs wächst B auf den Wandradius, die alte Wand schrumpft zur neuen innersten Schale, und der nächste Seed übernimmt.
- Das ist Droste in 3D: Sphäre in Sphäre, endlos.
- Ein Renderer, eine Geometrie, drei Radien-Tweens.
- Der Übergang kann auf den DROP fallen, wie die Engine schon Schnitte setzt.

## 5 · Engine-Fläche im Worker, Qualitätsregler im Takt (Leistung)
Die 2D-Engine zeichnet in ein `OffscreenCanvas` in einem Web Worker. Der Hauptthread hat dann nur noch WebGL und Audio. Dazu kommt ein Regler, der gemessene fps in Stufen umsetzt:
- DPR 2 → 1,5 → 1;
- Schalen 2 → 1 → 0;
- Gedichtband jedes 2. → 3. Frame;
- Hall aus.

Er schaltet nur auf Taktgrenzen um, damit kein Sprung mitten in der Phrase sichtbar wird. Die Stufe steht im UI (Regel 3). Das zielt direkt auf die 6–11 fps im DROP und auf Mobilgeräte.

— Claude Design, 25.10.2026
