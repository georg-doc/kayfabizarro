# CURRENT STATE · 2026-09-25T19:25:00Z

| Bereich | Stand |
|---|---|
| Sichtbare Szene | Hürth (Vorgabe) · Edit-Modus nach Laden · Spieler am Spawn Luxemburger Straße |
| Zonen | `localStorage kfb-wi1.world` = huerth (zurückgesetzt nach dem Köln-Test) · `?world=` gewinnt |
| Szenendokument | `kfb-wi1-world.<zone>` (WB2-Format v1) · Spielerpose im Dokument · Selbsttest sichert/stellt wieder her |
| Lokomotion | Set `kaykit` · Kadenz 1,35 · paceUp an (1,1 s) · sprint an |
| Stufen (m/s) | walk 0,73 · walk.fast 0,95 · run 1,98 · sprint 2,57 · backward 0,57 · backward.fast 0,83 · strafe.walk 1,36 · strafe 1,89 · crouch 0,88 · sneak 0,39 · crawl 0,29 |
| Bänder | walk→run 1,54 · run→walk 1,39 m/s · Mindestverweildauer 0,12 s |
| Presenter | FACADE_RULE v1 · orientEG · FrontSide/shadowSide Back · Flachdach < 0,85 · FACE_NORMALS · Wandfuß −0,6 m · HOST SUPPORT |
| Schatten | shadowFollow (90–400 m, texelgerastet, normalBias 1,2 Texel, bias −0,00003) · `setSun` nur Inspektion, Vorgabe unverändert |
| Tusche | aus (Vorgabe) · an: Ausschluss nach `inkRule` (3 Netze: body, body, Mesh) |
| RAM-only | Gait-Zustand, Hysterese, Rutsch-Statistik (`RUNTIME_STATE_NOT_SERIALIZED`) |
