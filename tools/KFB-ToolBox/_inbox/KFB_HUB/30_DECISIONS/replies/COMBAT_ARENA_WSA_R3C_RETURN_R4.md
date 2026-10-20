# WSA → WS0 · Soldat r3c / V-579 · Return R4 · 20.10.2026

**Die drei Quellnähte aus MUZZLE R3 sind geschlossen.** r3c liegt lokal vor und wurde unabhängig an der Datei geprüft. Register gelesen auf 15de6b475f1ee7f43f807da3bb8f478ae1eff945; V-579 und Nachtrag in WS0_TO_WSA_COMBAT_ARENA_R2.md übernommen.

[Draft Arena PR #23](https://github.com/georg-doc/KFB-Combat-Arena/pull/23), aktueller Commit **cc262867e1a40b4e19721cca4e6e12afbcee891f**.

## Tatsächlicher Nachweis

- r3c-GLB SHA256 **8ff9685f4ba6e435298239ec21afd20fabbe2042ea2fd37fed9656d7c83dbccb**, 1.364.264 Bytes, stimmt mit Scenelet und Figure Card überein.
- Gegenüber r3b: Binärpuffer byte-gleich, alle JSON-Sektionen außerhalb nodes identisch, genau vier geänderte Knoten: KFB_Muzzle, KFB_Grip, KFB_Grip_L, KFB_Bayonet_Tip. Keine Geometrie-/Skin-/Bild-/Clipänderung.
- Echter GLTFLoader + ein Testmixer, vier Posen (shoot 0, aim 0,5, raise_shoot 0,292, shooting 0,2): Anker +Z und beide unveränderten Originalblitze **0° zum Lauf**. Keine Adapterdrehung.
- Scenelet Actor A ry=178,9°; mit tatsächlich ausgewerteter Mündung max. **0,03746° horizontaler Zielwinkelfehler**. Source-origin bleibt die physische Mündung. Gewehr am Kit-Slot, bereinigte 2H-Figure-Card-Texte bestätigt.
- GLTFLoader bereinigt handslot.r zu handslotr; Originalname ist userData.name. Importdetail, kein fehlender Slot.

## WSA-Delta

V-579 verlangt im Profil KFB_Muzzle lokal +Z **auch bei eigenen Zielwerkzeugen**. V-536 behält Unterarm-/Actor-IK-Verantwortung, aber die alte +Y-Ankerprüfung darf nicht bleiben. Erstes konkretes privates SHA256-Profil TOYSOLDIER_R3C_PROFILE.json. readMuzzlePose liest Position und +Z-Weltrichtung aus dem aktuell ausgewerteten Anker in Hostvektoren; keine Target-Fallbackbahn.

Reproduzierbarer privater CPU-Quell-/FX-Lauf: tools/probe_muzzle_r3c.mjs. Ergebnis TOYSOLDIER_R3C_RUNTIME_RECEIPT.json; Beschreibung MUZZLE_R3C.md im Arena-Paket _handover/ARENA_MIGRATION_R1_2026-10-20/.

**Frisch:** 87/87 Node-Tests, zusätzlich vier echte Source-Posen × zwei Originalblitze PASS, Build 203, Rehome 172 Runtime/66 Donoren/Routes PASS. Keine Kauf-Assetdateien kopiert/veröffentlicht.

**Grenze des Nachweises:** Bilddecodierung im CPU-Test absichtlich gestubbt. Kein neuer visueller EyeRig-/Clay-/Lid-/Actorbeleg, kein Browser-Spieltest, keine Hörabnahme. Die aktive Arena enthält weiter keinen r3c-Soldatenplatz; dieser Quell-/Adaptertest ist kein fertiger Actor-Graft. Nächster Produktschritt bleibt Actor-/Clip-/Face-Anschluss auf der gewählten Gameplay-Linie und reale Eingabe-/Bild-/Tonabnahme. Keine Source-Rückfrage zu den drei nun gelösten Nähten mehr nötig.

Keine Merges, kein Main-/Site-Deploy.
