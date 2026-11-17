# Waffen-Nachweis R1b · Survivalist, Toy Soldier, Marksman + Kenney-Anker · RETURN (WSB, 17.11.2026)

**Auftrag:** WS0-Kanal 17.11. spät, Punkte 3 und 4 (nach R1a spygun/ranger, schon gepusht).

## 1 · Drei neue K10-Waffen (alle CONTRACT_PASS gegen `weapon-profile.v2` aus `waffen/kammer-r1`)

| Karte (`karten/`) | GLB | Mündung `KFB_Muzzle` | Griffversatz an FB (handslot +z, je Clip) |
|---|---|---|---|
| `kfb_kit_survivalist_shotgun_fb.weapon.json` | `_privat_kauf_asset/KFB_Survivalist_Shotgun.k10.glb` (neu) | (0; 0,251; 0,896) | Zielen, Schuss, Dauerfeuer 9 cm, Nachladen 0 |
| `kfb_kit_toysoldier_rifle_fb.weapon.json` | `K10/_privat_kauf_asset/KFB_ToySoldier_Rifle.k10.glb` (vorhanden) | (0; 0,219; 1,580), vor dem Bajonett (B50 r3c) | 3 cm, Nachladen 0 |
| `kfb_kit_marksman_rifle_fb.weapon.json` | `_privat_kauf_asset/KFB_Marksman_Rifle.k10.glb` (neu) | (0; 0,136; 1,686) | Zielen 24 cm, Schuss/Dauerfeuer 27 cm (Zielfernrohr vor FBs Kopf) |

- **GLB-Bau** mit `K10/scripts/k10_weapon_glb.py`: Kit as-is, nur `KFB_Muzzle` ergänzt. Accessors, Bilder, Materialien und Netze sind byte-gleich, Belege `*_anchor_receipt.json`.
- **Griffanker** braucht es bei Kit-Waffen nicht: Die Halterung ist der Kit-Slot `handslot.r` mit Ry +90° (V-574/V-581), wie bei allen K10-Kit-Waffen.
- **Halterung:** eine feste je Clip (V-582), Versatz nur bei Durchstich. Gefunden mit `scripts/halterung_r1.mjs` (Suche in 3-cm-Schritten). An FB Web-Kanon r1j mit den unveränderten Kit-Clips ist der Durchstich in Rumpf/Kopf 0 in allen gewählten Clips, auch mit Shirt (`data/mit_shirt/`).
- **Abgang:** Ranged_2H_Shoot 0,2667 s, derselbe Kit-Marker wie bei `kfb_kit_gun_rifle_fb` und dem Ranger. Gemessen ist der größte Rückweg der Mündung direkt nach Bild 9.
- **Laufwinkel** zusätzlich an der K10-Prüffigur Rogue gemessen (`data/*_rogue_ranged_measure.json`).
- **Marksman:** `Ranged_2H_Reload` ist ausgeschlossen (`excludedClips`). Der Schaft steckt beim Nachladen 7,7 cm in FBs Brust, und kein Versatz bis 30 cm löst das.
- **Sichtbelege:**
  - `belege/WAFFEN_NACHWEIS_R1b_halterung_fb.jpg`;
  - `belege/WAFFEN_NACHWEIS_R1b_gewehre_rechts.jpg`: von FBs rechter Seite ragen die Schäfte hinten heraus. Von links sind sie nur verdeckt.

## 2 · Kenney Blaster Kit 2.1 (CC0): Griff- und Mündungsanker für alle 18
- **Dateien:** `kenney/KFB_Kenney_blaster_<a–r>.r1b.glb`, Beleg `kenney/kenney_anker_r1b.json` mit sha256 von Quelle und Ergebnis, Lagen und Byte-Prüfung. Skript: `scripts/kenney_anker_r1.mjs`.
- **Geometrie** unverändert: Accessors als Menge byte-gleich zur Quelle (18/18). Die Größe ×1,92 setzt das Spiel; die Anker skalieren mit.
- **`KFB_Muzzle`:** Mitte der Stirnfläche am Lauf-Ende. Kenney-Lauf ist −Z bei allen 18; Anker-Drehung 180° um y, damit lokal +Z die Schussrichtung ist (V-579).
- **`KFB_Grip`:** auf der Laufachse über der Mitte des Pistolengriffs (B40-Vorbild).
  - Die automatische Schätzung über „tiefste Region“ landet bei Kenney oft über dem Magazin oder am Griff-Fuß. Deshalb ist die Griffmitte je Modell aus dem Sichtbeleg abgelesen (`data/kenney_griff_sicht.json`: Pixel → Modell-z über die bekannte Ortho-Kamera).
  - Kontrollbild: `belege/WAFFEN_NACHWEIS_R1b_kenney_anker_r1b.jpg` (rot Griff, blau Mündung).
- **Probe an FB** mit ×1,92, `KFB_Grip` auf `handslot.r` und V-581 + 180°: Handwaffen mit den 1H-Clips, Gewehre und e/f mit den 2H-Clips (`data/kenney_fb_uebersicht.json`, Einzeldaten `data/kenney_fb*/`, Bilder `belege/kenney/`).

| Blaster | Typ (WS1 R0) | Länge ×1,92 (m) | Durchstich beim Abgang | Dauerfeuer | tiefster Clip |
|---|---|---|---|---|---|
| a | gewehr | 1,54 | 2,7 cm | 2,9 cm | 5,9 cm (2H_Shoot) |
| b | hand | 0,81 | frei | frei | 5,7 cm (1H_Reload) |
| c | hand | 0,91 | frei | frei | 5,4 cm (1H_Reload) |
| d | gewehr | 1,74 | frei | 0,1 cm | 1,6 cm (2H_Reload) |
| e | schwer | 2,67 | 1,7 cm | 2,0 cm | 2,9 cm (2H_Aiming) |
| f | schwer | 2,52 | frei | 1,6 cm | 2,6 cm (2H_Shoot) |
| g | gewehr | 1,51 | frei | frei | 1,8 cm (2H_Aiming) |
| h | hand | 1,24 | frei | frei | 6,8 cm (1H_Reload) |
| i | hand | 1,00 | 4,1 cm | 4,7 cm | 6,7 cm (1H_Reload) |
| j | hand | 1,17 | frei | frei | 7,5 cm (1H_Reload) |
| k | hand | 0,88 | frei | frei | 7,0 cm (1H_Reload) |
| l | hand | 1,06 | frei | frei | 5,3 cm (1H_Reload) |
| m | hand | 1,19 | frei | frei | 6,9 cm (1H_Reload) |
| n | hand | 1,23 | 4,0 cm | 4,1 cm | 6,1 cm (1H_Aiming) |
| o | hand | 0,92 | 1,7 cm | 0,7 cm | 7,8 cm (1H_Reload) |
| p | gewehr | 1,66 | frei | frei | 3,7 cm (2H_Reload) |
| q | gewehr | 1,36 | frei | frei | 1,4 cm (2H_Shoot) |
| r | hand | 1,31 | frei | frei | 7,2 cm (1H_Reload) |

Ergebnis:
- **Beim Abgang sind 14 von 18 frei.** Darunter sind alle fünf, die in WS1 R0 ohne Griffanker im Körper steckten (c, h, j, k, l).
- **Rest beim Abgang:** a, e, i, n, o. Bei ihnen ragt der Schaft in Brust bzw. Schulter. i, n und o haben Schulterstützen; ich schlage vor, sie als Gewehr (2H) einzustufen statt als Handwaffe.
- **Ruhebild und Nachladen:** Fast alle tauchen hier 1,4–7,8 cm ein. Die langen Kenney-Läufe zeigen dabei in Hüfte bzw. Bauch, anders als die kurze Kit-Pistole. Das gehört in die Kenney-Karten als Halterung je Clip (wie K10 V-582). Die Karten waren nicht Teil dieses Auftrags und folgen auf Zuruf.

## 3 · Blinder Kritiker (ein Lauf, nur Bilder)
Urteil: **PASS mit Hinweisen.**

Meine Prüfung der Punkte:
- **„Schäfte von Toy Soldier und Marksman verschwinden im Torso“:** Gegenprobe von rechts zeigt Verdeckung, keinen Durchstich (Messung 0 auch mit Shirt).
- **„Marksman-Zielfernrohr unter Augenhöhe“:** Das ist der Kit-Clip `Ranged_2H_Aiming`, er hält das Gewehr vor der Brust (bekannt aus WSB_REIHE_R1/6_SPY). Lösung wäre Arm-IK, das entscheidet WS0.
- **„Hautfarbenes Stück am Marksman“:** gehört zum Kit-Modell (Band am Schaft), unverändert.
- **Kenney:**
  - Grenzfälle sind k (Griff 3–4 cm hinter der Griffmitte), q (Mündung schwebt knapp vor der Stirnfläche) und r (Mündung an der Oberkante der Öffnung). Nicht nachgezogen; Korrektur in der Karten-Runde.
  - Blaster a bzw. i: Schaft in Bauch bzw. Schulter, siehe Tabelle.

## Löschliste (wartet auf Georgs Ja)
Erster Kenney-Lauf r1, falsch verankerte Toy-Soldier-Kopie, Messung ohne Marker und Sichtbogen mit 36 Kacheln. Alles eingetragen in `BLINDE_KRITIK_R1/LOESCHLISTE.md`.
