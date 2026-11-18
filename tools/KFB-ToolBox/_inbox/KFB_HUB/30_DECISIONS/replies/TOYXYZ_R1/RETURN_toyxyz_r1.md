# Toyxyz-Retarget-Test R1 · FB mit KayKit-Clips · RETURN (WSB, 17.11.2026)

**Auftrag:** Issue KFB-Stunt-Car-Race#138 über WS0; Georgs Download-Ja am 17.11. im Chat.
- A = direktes FK, B = Toyxyz mit Bein-Reichweite und Bodenkontakt, C = Toyxyz „In Place“.
- Gemessen: Fußrutschen, Bodeneindringen, Knie-Sprünge, Schleifennaht.

## Add-on
- **Quelle:** offizielles Release `toyxyz/toyxyz-blender-retargeter` v0.4.30.
- **Datei:** `toyxyz-blender-retargeter-0.4.30.zip`, 134.272 Bytes, sha256 `fbfdd21f…298f`. Die Prüfsumme stimmt mit der GitHub-Angabe überein.
- **Installation:** nur in Blender 5.2.2 auf dem Mac mini (Erweiterung `toyxyz_live_retarget`), nie im Spiel. Die ZIP liegt in `~/.kfb_tmp/toyxyz_dl/`.

## Aufbau
- **Quelle:** `src/assets/actors/Rig_Medium_MovementBasic.glb` (Stamm @cf20cdd6), Clips Walking_B und Running_A.
- **Ziel:** FB `FB_TEMPLATE_LOOK_v5b.glb` mit seinem Rig.
- **Knochenliste** vom Add-on selbst gebaut („Bone lists ready“): Hüfte, 2 Wirbel, Kopf, Arme, Beine.
- **Varianten je Clip** (gebacken mit `Bake to Action`, jedes Bild):
  - A0 = Toyxyz Stärke 0 % (direktes FK);
  - B = 100 % „Scale to Proportions“;
  - C = 100 % „In Place“.
  - Dazu ORIG = KayKit-Clip direkt auf FB.
  - Bodenkontakt jeweils an, Marken automatisch.
- **Messung** an FBs gehäuteter Beingeometrie (fester Fersen- und Ballenpunkt je Fuß), Modellmaß × 0,616 = Meter im Spiel:
  - Die KayKit-Clips laufen auf der Stelle; Rutschen ist darum die Rest-Abweichung des Standfußes gegen ein gleichmäßiges Tempo, wie das Spiel es anlegt.
- **Skripte:** `scripts/toyxyz_r1.py` (Aufbau, Backen) und `scripts/messung_r1.py`.
- **Daten:** `data/messung_r1.json` (mit Kniekurven) und `data/bake_bericht_r1.json`.

| Clip | Variante | Eindringen min z | Rutschen max / mittel | Knie-Sprung max (°/Bild) | Naht (°) |
|---|---|---:|---:|---:|---:|
| Walking_B | ORIG | −0,0609 | 0,0338 / 0,0176 | 48,75 | 0 |
| Walking_B | A0 | −0,0609 | 0,0182 / 0,0122 | 48,75 | 0 |
| Walking_B | B | −0,0609 | 0,0182 / 0,0122 | 48,78 | 0 |
| Walking_B | C | −0,0609 | 0,0182 / 0,0122 | 48,78 | 0 |
| Running_A | ORIG | −0,0112 | 0,0098 / 0,0079 | 51,01 | 0 |
| Running_A | A0 | −0,0112 | 0,0099 / 0,0090 | 51,01 | 0 |
| Running_A | B | −0,0112 | 0,0099 / 0,0084 | 51,03 | 0 |
| Running_A | C | −0,0112 | 0,0099 / 0,0084 | 51,03 | 0 |

## Befund
- **Fast keine Änderung:** FB trägt genau das Rig_Medium-Skelett der KayKit-Clips; die Knochen-Inversen sind gleich. Toyxyz hat deshalb keine Längenunterschiede auszugleichen.
  - Die Kniekurven von A0, B und C liegen auf 0,1° genau auf dem Original.
  - Die großen Kniesprünge (48–51° je Bild) stecken schon im KayKit-Clip. Toyxyz erzeugt keine neuen und glättet die alten nicht.
- **Bodeneindringen unverändert:** −0,061 (≈ 3,8 cm) beim Gehen. Die automatischen Fersen- und Ballenmarken sitzen an FBs Fußknochen, nicht an seiner Sohle bzw. am Sneaker.
  - Im Spiel hebt `M1Player.lift()` die Figur ohnehin an, wenn die Sohle in den Boden geht.
- **Rutschen:** beim Gehen etwas kleiner (max 0,034 → 0,018 Modellmaß, etwa 2,1 → 1,1 cm), beim Rennen gleich.
- **B und C gleich:** Die KayKit-Clips haben keine Wurzelwanderung; „Scale to Proportions“ und „In Place“ ergeben dasselbe.
- **Kriterium aus #138** („KEEP nur bei deutlich weniger Rutschen/Eindringen, ohne neue Knie-Sprünge“): nicht erfüllt.
  - Die Original-KayKit-Clips, `kkClips` und `m1-gait` bleiben, wie sie sind; einen Spieltest der gebackenen Clips habe ich deshalb nicht gemacht.

## Wofür Toyxyz taugen würde
- Für Clips von einem **anderen Skelett** (Mixamo oder andere Proportionen), wo Längen und Schrittweite wirklich angepasst werden müssen.
- **Möglicher Folgeversuch (auf Zuruf):** Kontaktmarken von Hand an FBs Sneaker-Sohle setzen (Editor „Edit Contact Markers“). Erst dann könnte der Bodenkontakt etwas am Eindringen ändern.
