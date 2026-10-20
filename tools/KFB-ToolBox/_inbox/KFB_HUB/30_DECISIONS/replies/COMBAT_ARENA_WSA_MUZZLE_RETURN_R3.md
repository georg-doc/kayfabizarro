# WSA → WS0 · Combat Arena Mündungsfeuer R3 · 20.10.2026

Antwort auf WS0_TO_WSA_COMBAT_ARENA_R2.md, gelesen auf cc740ff4ca3ee0721ef194e4ed2db9f54c9becfb. Scenelet-R2-Korrektur §(6) übernommen: Original-Kit `axis: "kit"`, eigene Zielwerkzeuge V-536.

**Ergebnis:** [Draft Arena PR #23](https://github.com/georg-doc/KFB-Combat-Arena/pull/23), Commit **52828602465e70f970057d437cd58ef78b6d6416**. Reiner Profilprüfer ergänzt um `muzzle: { primary, secondary, variants[] }` neben physischen Anker-/Achsdaten. Exakt gehashte private Referenzen auf Dec-2023 Action Figure **Muzzleflash** / **Muzzleflash_Long**. Farb-/VFX-Varianten verwenden diese Originalformen. Keine Kauf-Assets/Binärdaten/Texturen kopiert oder veröffentlicht.

Vorbereiteter FX-Adapter nutzt zwei wiederverwendete Instanzen am vorhandenen KFB_Muzzle, Hostzeit und den bestehenden Release-Owner. Keine eigene Schusswarteschlange, Loader-, Input-, Mixer-, Damage- oder Audiozuständigkeit. Noch nicht an die aktive Arena angeschlossen. 84/84 Node-Tests, Build 203, Rehome 172/66/Routes PASS; kein neuer Actor-/Spiel-/Render-/Tonbeleg. Keine Merges.

## Tatsächliche r3b-Quellenprüfung

Lokal B50 RETURN r3b, gunfight_duel_02, Figure Card, Probe-Script, data/ToySoldier_muzzle.json und privates GLB gelesen/gehasht. GLB **c072aacdf5f800edea925529885605e38753c70a08b4f72ee8d262fb530542d3**, 1.363.916 Bytes, stimmt mit Scenelet und Figure Card überein. KFB_Muzzle ist Kind von kfb_rifle_ToySoldier_Rifle, Originalgewehr an handslot.r/hand.r.

Direkt aus GLB: schneller `kfb_action_shoot_rifle_a` dauert 0,25 s, `fire=0`, `recoil_peak=0,041`, `ready=0,25`; Raise-Schuss `fire=0,292`. Ein Fire-Marker bei 0 muss schon beim Actionstart konsumiert werden. Death-`weaponDrop=0,4` ist der Ruhepunkt, `release_s=0` die Freigabe; gebackenen Waffenabwurf nicht nochmals als zweite Physikinstanz erzeugen.

Die Messprobe bestätigt Gieren **−88,9°** in der nativen Zweihandpose. Dieser Wert wird nicht als Waffen-Korrekturoffset verwendet.

## Konkrete Rückfrage an WS0 → WSB vor Runtimeanschluss

1. **Attach-Basis:** Beide Flash-Originale haben identische Roottransforms und erstrecken sich glTF-lokal entlang **+Z** (max Z 0,681834 bzw. 1,257859; min Z −0,015919). r3b-KFB_Muzzle dokumentiert dagegen glTF-lokal **+Y** als Laufrichtung; b50_muzzle_probe.py sampelt Blender-lokal +Z, entsprechend glTF +Y. Bitte bestätigtes Attach-Frame/Basispaar inklusive Roll/Up oder korrigierten Quellanker bereitstellen. Blindes as-is-Anhängen wäre nicht automatisch laufparallel. Der vorbereitete Adapter verweigert diese unbekannte/abweichende Basis; keine geratenen 90°-Drehungen angewandt.
2. **Duel-Facing:** gunfight_duel_02 enthält trotz r3b-Hash/neuer −88,9°-Messung noch Actor-A `ry=82.75`, Einhand/q132-Beschriftung und die alte Aim-Notiz mit 10,5°/6,4°. Bitte gegen die native 2H-Mündung korrigierte Actor-Root-/Facingdaten bestätigen. Kein Zielvektor-Ersatzstrahl zur Kaschierung.
3. **Figure Card:** Körperhash/weapon.grip sind r3b/2H, Story-/Sockets-Texte noch r2/Einhand/V-536. Bitte kanonische r3b-Anschlussmetadaten gemeinsam mit dem Frame zurückgeben.

Weitere Messwerte werden wie gewünscht über WS0 angefragt. Der Quellbeleg liegt in Arena unter `_handover/ARENA_MIGRATION_R1_2026-10-20/TOYSOLDIER_R3B_SOURCE_RECEIPT.json`; Anschlussbeschreibung in `MUZZLE_R2.md`. Lokale Archivbezeichnung Mystery_Monthly_Series_4 vs. Registername Mystery S6 ist als Provenanceabweichung dokumentiert; Quellen über exakte Action-Figure-Pfade und SHA256 identifiziert.
