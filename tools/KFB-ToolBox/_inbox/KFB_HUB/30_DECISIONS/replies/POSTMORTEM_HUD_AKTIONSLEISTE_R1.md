# Postmortem · HUD-Aktionsleiste: fest verdrahtete weiße Kreise · 05.11.2026 · WS0

## Was passiert ist
- Georg hatte die Aktionsleiste längst definiert. V-670/671, nochmals bei q524/q526 am 04.11.:
  - eine skinbare Plakette;
  - darauf flache, leicht abgerundete **Rechteck**-Flächen ohne Einzelrahmen und ohne Mulde;
  - darauf die 3D-Pop-Icons mit dezentem Schatten.
- Gebaut und durchgewinkt wurden stattdessen **cremeweiße Kreise**, fest im Code (`module/hud-clay-r1`, R3e → R11), auch im Hover- und Druckzustand. Nur die Ablage darunter lud den Skin. Damit sahen alle sechs Skins in der Leiste gleich aus, und die Kreise lasen sich wieder als Einzelrahmen.
- WS0 hat das zweimal in den Hub gegeben: q528 („Konzept passt, Design folgt“) und q533. Erst Georg (q533 TUNE) und der WSA-HUD-Chat haben die Ursache im Code benannt.
- Dazu fehlte das Grundprinzip des HUD ganz: Seit Beginn ist es als **diegetisches 3D-Cartoon-Interface** vereinbart, „die Welt als Spielzeug“ (V-333). Alles reagiert, mindestens mit den Zuständen **Active, Hover und Click** und Cartoon-Deformer (Squash & Stretch, Nachfedern). Die Kreise hatten nur Aufhellen und Abdunkeln.

## Ursachen
1. **Wort statt Bild:** WS0 hat „flach, abgerundet“ als „rund“ weitergegeben und nicht gegen das Bild der Definition geprüft (dunkelbraune Plakette mit Rechteck-Kissen).
2. **Prüfung nur am Beispiel:** Ich habe die Folien angesehen, aber nicht gefragt, *woher* jede Form kommt: Skin-Asset oder Code-Konstante. Feste Farben und Formen im Code stehen gegen das Skin-System (HUD-Master-Kit: Overlays nur aus gelieferten Knet-Teilen).
3. **Kritiker ohne Maßstab:** Der Kritiker prüfte Nähte und Lesbarkeit, nicht die Definition und nicht das Interaktionsprinzip.
4. **Übergabe ohne Abgleich:** Der WSA-HUD-Chat und Kartenkante haben die Übergabe nicht gegen den Code geprüft. WS0 hat nicht danach gefragt.
5. **Kein Designer-Blick:** Ränder, Abstände und Einfassung des Gesamt-HUD hat nie jemand mit Art-Direction-Auftrag geprüft.

## Regeln ab jetzt (bindend)
1. **Jede HUD-Form kommt aus dem Skin-Kit**, nie als Code-Konstante: Fläche, Rand, Farbe, Zustände. Vor jeder Hub-Frage gibt es eine Liste „Teil → Quelle (Skin-Datei bzw. Code)“. Eine feste Farbe oder Form im Code ist FAIL.
2. **Diegetisch und reaktiv:** Jedes bedienbare HUD-Teil hat mindestens die Zustände Active, Hover und Click mit Cartoon-Deformer (Squash & Stretch, Nachfedern, kurze Antizipation; Skill cartoon-motion). Belege zeigen alle drei Zustände als **Bewegung**, nicht als Standbild.
3. **Definition im Bild neben jedem Beleg:** Die Folie zeigt links die Definition (Georgs Bild bzw. das freigegebene alte HUD), rechts das Neue. Weicht die Form ab, geht nichts in den Hub.
4. **Designer-Blick vor dem Hub:** Gesamt-HUD-Belege laufen vorher durch die Art Direction (WSV): Raster, gleiche Randabstände, einheitliche Einfassung.
5. **Übergaben mit Code-Abgleich:** Wer Bilder liefert (WSA-HUD-Chat), bekommt den Code-Pfad, der sie lädt, und prüft, dass nichts fest verdrahtet überschreibt.

## Sofortmaßnahmen
- Georg legt mit dem WSA-HUD-Chat die Korrektur verbindlich fest: leicht abgerundete Rechtecke im Design des jeweiligen Skins, ohne Einzelrahmen, gemeinsame freigestellte Icons.
- Kartenkante baut **keine eigenen Flächen** mehr, sondern lädt die Skin-Flächen des HUD-Chats und baut Active/Hover/Click mit Cartoon-Deformer.
- WSV liefert das Layout-Raster.
- Register V-1519, Gedächtnis `kfb-hud-diegetic-skin-sourced`.
