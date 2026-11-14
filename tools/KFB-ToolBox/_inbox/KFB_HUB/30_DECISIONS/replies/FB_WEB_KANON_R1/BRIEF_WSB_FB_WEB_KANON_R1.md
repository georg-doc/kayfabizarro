# Für WSB (Mac mini) · FB Web-Kanon R1: ein einziger web-fertiger FrizzleBob-Export für alle Seiten außerhalb des Spiels · 14.11. (Georg, V-1743)

**Anlass (Georg 14.11.):** Claude Design hat für die Website einen alten Roh-FB geladen (ohne Knete, ohne KFB-Augen und E2-Lider, ohne Hasenschwanz, alter Zahnmund, T-Pose) – „fucking claude design hat den ultra-flaschen FB!?“. Ursache: FB entsteht nur im Spiel zur Laufzeit aus Teilen; eine fertige Kanon-Datei gibt es nicht, also greift jeder zum falschen GLB.

**Ziel:** eine Datei `FB_WEB_KANON.r1.glb`, die überall gleich aussieht wie FB im Spiel und ohne unseren Spiel-Code lädt (three.js GLTFLoader).

**Inhalt (Kanon wie im Spiel, nichts neu gestalten):**
- Maßstab wie im Spiel: FB steht 1,81 m hoch in Metern, Ursprung zwischen den Füßen, Blick nach +Z, im Export nichts nachskaliert.
- Körper FB_TEMPLATE_LOOK_v5b mit dem linken Ohr aus R8-A11 (graftCanonEar, beide Ohren, V-658, V-969), Hasenschwanz (attachFbTail), T-Shirt R2.
- Gesicht nach der Figurendatei `src/data/characters/frizzlebob.character.json` (Repo `georg-doc/KFB-Stunt-Car-Race`, `game/integration-r2`): KFB-Augen (EyeRig v6), dünne E2-Lider in FB-Lidfarbe, Brauen, Nase, Mund Satz A `gpt_a_r2` mit Ruhe „oh“ und den Werten size 0,5 / dy −0,58 (V-1731).
- Knete-Look als gebackene Farbe/Normal (kfb-clay v1.1), damit er ohne unsere Shader nach Knete aussieht.
- Skelett Rig_Medium mit den FB-Clips aus `50_BLENDER/WSB_HALTUNG_R1/clips_fb` (Idle-Pool, Gehen, Laufen, Winken; Flug = die im Spiel genutzten Flug-Clips aus `src/modules/m1-locoActor.js` FLY_CLIPS mit Quelle, keine neuen, V-956, V-1065) – Arme frei wie im Spiel (V-1733); Augen-/Lid-Knochen bzw. Morphs so, dass Blinzeln und Blick in three.js steuerbar bleiben (kurze Liste der Knoten-Namen beilegen). Dazu ein Gesichts-Leerlauf-Clip (Blinzeln, Blickwechsel, Lider in Blickrichtung, Mund-Einschübe smile/d/oh) als Knochen- oder Morph-Spur in derselben Datei, sodass FB im reinen three.js mit AnimationMixer lebt (V-214, V-1735); Augen R2 (V-1412), E2-Lidhaut mit FB-Grundstellung 0,08.
- Varianten als eigene Dateien: Kayfabe-Agent (Spy-Körper aus Reihe R1 Auftrag 6, die in `50_BLENDER/WSB_REIHE_R1/6_SPY/RETURN.md` als gültig genannte Fassung; Entwurf bis zur Hub-Abnahme) und mit Jetpack Twin (Lage A nach q667, Anker-Namen aus `jetpack.contract.twin.r1b.json`).

**Prüfung:** FB-Kanon-Wächter (beide Ohren, linkes aus A11, Schwanz; V-1608); Bildpaar „Spiel“ gegen „Web-Export in reinem three.js“ von vorn und seitlich; Größe der Datei (Ziel unter 8 MB je Variante; das A11-Ohr allein hat etwa 6 MB – Clips auf den genannten Satz begrenzen, Kompression nur mit den Standard-Decodern von three.js).

**Folgeauftrag:** danach derselbe Web-Build für alle Dramatis Personae mit demselben Back-Skript (V-1743).

**Rückgabe** wie Reihe R1 (Bundle, Bilder, RETURN.md in `replies/FB_WEB_KANON_R1/`). WS0 trägt die Datei danach in der Figurendatei ein (`appearance.export.web`), damit alle Seiten (Website, WSA Patch, Claude Design) nur noch sie laden (V-1743).
