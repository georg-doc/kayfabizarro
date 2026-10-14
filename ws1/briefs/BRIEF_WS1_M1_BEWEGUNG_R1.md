# Briefing WS1 · Slice M1 „Bewegung“ mit FrizzleBob v5b (R1, 14.10.2026)

Autor: Web-Chat (Planung), im Auftrag von Georg.
Weg: Georg gibt dieses Briefing an WS0. WS0 vergibt eine V-Nummer, legt es in den Register-Branch und beauftragt WS1 (V-213).
Gilt zusammen mit: Host-Vertrag R1.2 (V-215), `KFB_WORKING_RULES_R1.md`, V-206, V-214, V-216, V-227, V-230, V-240.

## Ziel
Georg steuert **FrizzleBob v5b** auf seinem Mac durch eine offene Welt:
- laufen, rennen, springen;
- abheben, fliegen, landen;
- vom Amphitheater weg und wieder zurück.

Bewegung, Blick und Augen wirken wie aus einem Guss. Damit wird aus der Bühne ein Spielraum.

## Festgelegt (ohne Rückfrage umsetzen)
1. **Figur = FrizzleBob v5b nach V-240:**
   - Export `replies/actors/frizzlebob.georg-2026-10-14.kfb-pets.json` (kfb.pets/1);
   - GLB `FB_TEMPLATE_LOOK_v5b.glb` @23615cff (Blob 24134a51);
   - Eye-Rig-Lider, Knet-Lider aus (`clayLids.on false`).
   - Derselbe Darsteller-Slot und derselbe Code-Pfad wie auf der Bühne (G2, `actorSlot.js`). Kein zweiter Ladeweg (V-206).
2. **Steuerung = ecctrl 2.0.2** wie im Spike:
   - `setMovement()` pro Frame aus `hostKeys`;
   - Flug mit F;
   - Landen per Strahl;
   - R setzt zurück.
   - Der KayKit-Barbar (`hero.glb`) und alle Hex-Bezüge fliegen aus dem Spielpfad (V-216).
3. **Laufen phasengleich (LOCO-Regel):**
   - ecctrl liefert Zustand und Tempo;
   - `ActorAnimator` / `locoWeights` aus `anim.mjs` (Branch `cloudflare-live` @e21e4904) mischt die Clips über denselben Code-Pfad.
   - ecctrl-Überblenden nur für Sprung, Landung und Emotes.
4. **Blick führt:**
   - Reihenfolge Augen → Kopf → Körper;
   - Blickziel = Bewegungsrichtung bzw. Kamera-Ziel, im Flug der Horizont;
   - Blinzeln und Lider laufen weiter;
   - Schnittstellen `applyEmote()`, `setKinetics()`, `setLife()`. Keine neue Augen-Logik.
5. **Welt:**
   - Amphitheater (V-230, Browser-Fassung v1) steht in offenem Knet-Gelände;
   - Himmel = Skydome 4a (SKY3 `createSkydome`), Host besitzt Licht, Nebel und Himmel (Vertrag §1);
   - Weltgröße mindestens 400 m Durchmesser;
   - Gelände als Rapier-Kollision, Amphitheater begehbar (Ränge, Bühne).
   - Kein Hex, kein Racetrack (V-210 ruht: Fliegen ersetzt ihn).
6. **Kamera = EcctrlCameraControls**, folgt beim Laufen und Fliegen. Steht Georg auf der Bühne und startet den Dialog, übernimmt die Bühnenkamera (Two-Shot), danach geht es zurück zur Folgekamera.
7. Jeder Teil ist ein Modul nach `create/update/dispose`, eingehängt über `ModuleHost`, mit Vertragstest.

## G0 · Prüfen vor dem Bau (Ergebnis in `WS1_STATUS.md`)
- Welches Skelett hat v5b, und welche Lauf-, Renn-, Sprung- und Flug-Clips passen dazu?
  - Liegen die LOCO-Clips (Rig_Medium) nicht direkt an, Retarget über `SkeletonUtils.retargetClip`.
  - Erst ein Bildpaar und ein Fußtest, dann bauen.
  - Ist v5b gar nicht retargetbar, **stoppen und an WS0 melden**, nicht improvisieren.
- Gibt es einen Flug-Clip? Falls nicht: Vorschlag an WS0 (z. B. `Jump_Idle` plus Neigung). Georg entscheidet nach Bild.
- Kinetik bei Bewegung: Ist `setKinetics()` im Studio für v5b aus, bleibt es aus (wie F1). Nur melden.

## Abnahme (Georgs Mac)
| # | Prüfpunkt | Wie geprüft |
|---|---|---|
| 1 | Laufen, rennen, springen: Füße rutschen nicht | Fußtest nach LOCO-Handover §6, deterministisches Replay |
| 2 | Abheben, fliegen, landen ohne Durchfallen | Replay mit festem dt, Landepunkt auf Gelände und Rängen |
| 3 | Augen führen den Blick, Blinzeln und Lider aktiv | bewegtes Bildpaar gegen Studio (V-214) |
| 4 | Bühne betreten → Dialog D1 startet → zurück ins Freie | Szenen-Test |
| 5 | 60 fps mit Theater, Gelände, Himmel und Figur | Messung auf dem M4 |
| 6 | eine three-Instanz, Host besitzt Licht, Nebel und Himmel | `npm ls three`, Vertragstest |

Vor der Meldung an Georg:
- blinder Prüfer;
- Bildpaar;
- alle Tests grün.

Georg bekommt **eine** Datei bzw. URL zum Ausprobieren, mit der Tastenliste.

## Nicht in M1
- Kampf (S6) und Lügen-Stadt (S7);
- Clay auf dem Gelände (S2, folgt);
- Racetrack;
- weitere Figuren;
- Triplet-Inhalte (bleiben bei WS0 und im Pool).

## Claude Design (optional, parallel)
Nur eine Look-Referenz für Gelände, Himmel und Palette rund um das Amphitheater, als Bild. Kein Code (V-228). WS1 vergleicht sein Gelände per Bildpaar damit.
