# CURRENT STATE · 2026-09-25T15:40:00Z

| Bereich | Stand |
|---|---|
| Welt im WorldBuilder | AKTIV · Hürth 700/700 Gebäude, 19 Straßen, 15 Eckmasten, Spawn Luxemburger Straße |
| Edit-Tile | 192 m @ 0,5 m (384² Segmente), Bodenkarte 4,7 cm/px; außerhalb Zonenkarte 17 cm/px (Kante sichtbar, benannt) |
| Terrain Raise/Lower, Radius, Space-Orbit, 1/2/3, Undo/Clear | unverändert WB2 |
| Objekt-Edit | unverändert edit-layer.js (Move/Rotate/Scale/Drop) |
| Save/Reload | WB2-Dokument, eigener Key `kfb-wi1-world.huerth`, Spielerpose im Dokument; Seite lädt gespeicherte Welt |
| Play | FrizzleBob-Graft 1,85 m · Walker v25 unverändert · Walk 0,54×1,35 m/s · Run ~2,0–2,5 m/s (je Set gemessen) · Sprung-Apex 0,97 m |
| Motion-Sets | KayKit A (Vorgabe) · B · C · KFB Motion Library (+KayKit walk/jump) |
| Clip-Bindung | Lab-Regel: 25/69 Spuren (Rotation überall, Position nur root/hips, keine Skalierung), Hüftfaktor je Rig aus Idle |
| Sprung | Lab-Kette Jump_Start → Jump_Idle → Jump_Land, kein Walker-Windup (Doppelsprung behoben) |
| Kamera | Orbit ohne Grenzen + Zoom zum Cursor (Edit), freie Follow-Kamera (Play) |
| Himmel | Travel v25 skydome-shader (Aquarell 1 Vorgabe), TinySkies-Fognfarbe |
| Schatten | WB-D1 shadowFollow (90–400 m, texel-gerastet) |
| Tusche | aus (Vorgabe), an: unsichtbare Gesichtsboxen ausgeschlossen |
| UI in der Welt | Actor/Prop/Scene-Review ausgeblendet, Statuszeile nur Fehler |
