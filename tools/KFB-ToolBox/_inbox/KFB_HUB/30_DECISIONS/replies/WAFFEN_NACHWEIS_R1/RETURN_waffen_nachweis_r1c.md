# Waffen-Nachweis R1c · Kenney-Karten mit Halterung je Clip · RETURN (WSB, 17.11.2026)

**Auftrag:** WS0 nach dem R1b-Push: Kenney-Karten mit Halterung je Clip für a, e, i, n, o sowie Ruhe und Nachladen, bis die Roboterarm-Liste kommt.

**Ergebnis:** 18 Karten `karten/kenney/kfb_kenney_blaster_<a–r>_fb.weapon.json`, alle **CONTRACT_PASS** gegen `weapon-profile.v2` aus `waffen/kammer-r1`.

## Aufbau der Karten
- **Quelle:** `kenney/KFB_Kenney_blaster_<x>.r1b.glb` aus R1b (Kenney Blaster Kit 2.1, CC0, Geometrie unverändert, mit `KFB_Grip` und `KFB_Muzzle`). `origin: kit-original`, `source.private` wie bei den K10-CC0-Karten (Dropbox-Pfad und sha256).
- **Halterung:**
  - am Knochen `handslot.r`, Drehung V-581 + 180° = [0, −√½, 0, √½] (Kenney-Lauf −Z);
  - `mount.scale: 1.92` (Wert aus WS1 R0);
  - Grundlage = `KFB_Grip` auf dem Slot-Ursprung (`slotOffset.position` = −Drehung · 1,92 · Griff).
- **Halterung je Clip (V-582)** in `mount.families.perClip`, je Clip fest:
  - Grundlage plus kleinster Versatz ohne Durchstich an FB;
  - gesucht in 6 Richtungen im handslot-Raum, 3-cm-Schritte bis 24 cm (`scripts/halterung_r1.mjs`, SUCHE6);
  - Daten in `data/kenney_karten_fb/`.
- **Mündung:** `KFB_Muzzle` +Z mit den KayKit-Mündungsfeuer-Quellen wie bei allen K10-Karten. Abgang Ranged_1H_Shoot bzw. Ranged_2H_Shoot bei 0,2667 s.
- **Clips:** Handwaffen 1H, Gewehre und e/f 2H (Einstufung aus WS1 R0).

## Versatz je Clip (handslot-Raum; +z wie beim Ranger 0,12)

| Blaster | Typ | Aiming (Ruhe/Zielen) | Shoot | Shooting | Reload |
|---|---|---|---|---|---|
| a | gewehr | +z 12 cm | +z 12 cm | +z 6 cm | +z 9 cm |
| b | hand | +z 3 cm | +z 3 cm | 0 | +z 12 cm |
| c | hand | +z 6 cm | +z 6 cm | 0 | +z 12 cm |
| d | gewehr | +z 6 cm | +z 6 cm | +z 3 cm | +z 3 cm |
| e | schwer | +z 9 cm | +z 9 cm | y -6 cm | +z 3 cm |
| f | schwer | +z 3 cm | +z 9 cm | +z 6 cm | +z 3 cm |
| g | gewehr | +z 6 cm | +z 6 cm | 0 | 0 |
| h | hand | +z 6 cm | +z 6 cm | 0 | +z 15 cm |
| i | hand | +z 18 cm | +z 24 cm | +z 15 cm | ausgeschl. |
| j | hand | +z 9 cm | +z 9 cm | 0 | +z 15 cm |
| k | hand | +z 6 cm | +z 6 cm | 0 | +z 15 cm |
| l | hand | +z 3 cm | +z 3 cm | 0 | +z 12 cm |
| m | hand | +z 9 cm | +z 9 cm | 0 | +z 12 cm |
| n | hand | +z 12 cm | +z 12 cm | +z 12 cm | ausgeschl. |
| o | hand | +z 12 cm | +z 12 cm | x +3 cm | ausgeschl. |
| p | gewehr | +z 3 cm | +z 3 cm | 0 | y -21 cm |
| q | gewehr | +z 3 cm | +z 3 cm | 0 | 0 |
| r | hand | +z 6 cm | +z 6 cm | 0 | +z 12 cm |
- **Durchstich an FB in allen gewählten Clips: 0.** Einzige Ausnahme ist i im Schuss mit 1 Punkt 1,7 mm; das ist Berührung, die Karte nennt es in `clipMarkers`.
- **Ausgeschlossen** (`excludedClips`, begründet): `Ranged_1H_Reload` bei i, n und o. Dort bleiben 6,2 / 1,4 / 3,2 cm, auch bei 24 cm Versatz in jeder Richtung. i, n und o haben Schulterstützen; als Gewehr (2H) eingestuft wären sie vermutlich frei. Die Entscheidung liegt bei WS0/WS1.

## Sichtbeleg und Kritiker
- `belege/WAFFEN_NACHWEIS_R1c_kenney_halterung_fb.jpg`: alle 18 im Schuss und beim Nachladen; Einzelbilder in `belege/kenney/`.
- Blinder Kritiker (ein Lauf, nur Bild): **PASS mit Hinweisen.**
  - Alle 18 zeigen im Schuss nach vorn, keiner schwebt, keiner ist verkehrt herum.
  - Problemfälle laut Kritiker: n und o beim Nachladen. Genau diese Clips sind ausgeschlossen.
  - c und m beim Nachladen nennt er grenzwertig; gemessen sind beide frei.
  - Bei 2H sitzt die Stützhand nicht am Vorderschaft, und Nachladen sieht fast aus wie Schuss. Das kommt aus den unveränderten Kit-Clips; dicht wird es nur mit Arm-IK (Entscheidung WS0, wie beim Ranger).

## Für WS1
- Die Karten tragen `mount.scale` 1,92 als Zusatzfeld. Der Vertrag prüft es nicht; die Laufzeit muss die Größe setzen (GROESSE wie in R0).
- Die Halterung je Clip steht in `mount.families.perClip`, also im selben Schema wie bei `kfb_kit_gun_rifle_fb`.
