# Laufstufen R1 · RETURN (WSB, 17.11.2026)

**Auftrag:** WS0, 17.11., nach meinem Clip-Befund (Siebenmeilenstiefel R1). Gebaut ist ein Laufstufen-Paket wie die Jetpack-Clips r2c:
- Turbo und Roadrunner;
- Start mit kurzem Zurücklehnen;
- Bremse mit Rutschen;
- dazu Ohren-Folgebewegung und Cartoon-Deformer.

Gehen, Laufen und Sprint bleiben KayKit; die Kurvenlage macht WS0 im Code.

**Prüfweg nach V-1887:** Alles ist auf der Kampfbühne im Spiel geprüft (`buehne=r1`, FB als Spielfigur). Die Kameras `fb_seite` und `fb_dreiviertel` (dazu `fahrkamera` beim Lauf) kommen aus `test/lib/buehne.mjs` des Stamms @1bfb5d6b. Eine eigene Bühne gibt es nicht.

## 1 · Clips (`_privat_kauf_asset/KFB_Laufstufen.r1b.Rig{Medium,Large}.glb`)
- **Behälter:** `KFB_Flight.r1h.Rig<Medium|Large>.glb` (Kit-Skelett + Puppe), wie bei den Jetpack-Clips. Die alten Clips sind entfernt.
- **Skript:** `scripts/laufen_r1.mjs`, nach dem Muster von `flug_r2.mjs`. Daten je Clip stehen in `data/clips.r1b.Rig*.json`.

| Clip | Art | Dauer | Inhalt | Dehnung (spine) |
|---|---|---|---|---|
| `kfb_lauf_turbo` | Schleife, 2 Schritte | 0,30 s (30 Hz) | Sprint gestreckt: Rumpf 39° vor, Oberschenkel ±68°, Knie im Vorschwung hoch, Arme pumpen gegengleich (90°-Ellbogen), Flugphase | 1,00–1,10 je Schritt |
| `kfb_lauf_roadrunner` | Schleife, 2 Schritte | 0,25 s (60 Hz) | Wirbelbeine: Fuß läuft auf einem Rad vor dem Körper, Rumpf starr 58° vor, Kopf vorgereckt, Arme hinten und flatternd | 1,09–1,12 |
| `kfb_lauf_start` | einmal, hält letztes Bild | 0,60 s | Stand → Ausholen bei 0,18 s (zurückgelehnt, Hocke, Fäuste vor dem Bauch, Stauchung 0,84) → Antritt bei 0,40 s (Abdruck, Knie hoch, Dehnung 1,15) → Turbo-Pose | 0,84–1,15 |
| `kfb_lauf_bremse` | einmal, hält letztes Bild | 0,90 s | aus dem Turbo: Stemmen bei 0,14 s (Rücklage 60°, Kopf zurück, vorderes Bein steif, Ferse voran, Arme nach vorn gerissen) → Rutschen bei 0,30 s (Arme rudern) → Abfangen bei 0,68 s → Stand | 0,86–1,06 |

- **Cartoon-Deformer:** wie bei den Jetpack-Clips über die Skalierung von `spine` (y = s, x/z = 1/√s, Volumen bleibt); der Kopf ist gegenskaliert. Das wirkt im Spiel, es ist eine Knochen-Skalierungsspur im Clip.
- **Wurzel still:** Die Vorwärtsbewegung macht das Spiel. Nur `hips` verschiebt sich (Wippen und Bodenhub).
- **Schleifen** bestehen aus ganzzahligen Harmonischen, die Naht ist exakt. Das Skript bricht ab, wenn eine Schleifendauer kein ganzes Vielfaches der Bildrate ist.
- **Übergänge:**
  - `kfb_lauf_start` endet in der Turbo-Pose bei 0,225 s (Phase 0,75). Dort schließt `kfb_lauf_turbo` ohne Sprung an.
  - `kfb_lauf_bremse` beginnt in der Turbo-Pose bei 0 s und endet im Stand.
- **Rig_Large:** gleiche Posen. Der Bodenhub ist mit der Rig-Hüfthöhe skaliert. Auf der Bühne ist nichts gemessen: Das Spiel nimmt eigene Clips über `prepareSourceAction` nur für Rig_Medium mit Kanon an, also für FB.

## 2 · Messung im Spiel (`data/messung_kampfbuehne.r1b.json`)
Die Clips sind im Testbrowser über den Spielzugang eingehängt: `prepareSourceAction({ sourceClip, alias })` und `playAction`, als Overlay des Gang-Mischers wie Sprung und Landung. Spielcode ist nicht geändert.

**Sohlen (Ferse/Ballen aus `player.soles()`, Höhe über der Figurwurzel, je Bild bei 60 Hz):**
- Der Bodenhub kommt aus der Bühnenmessung: `scripts/boden_r1.mjs` → `data/boden.r1.json`. Er hebt die Hüfte je Phase so weit, dass keine Sohle unter den Boden taucht.
- So bleibt der Bodenangleich des Spiels (`M1Player` lift, gedämpft) auf 0. Vorher tauchte der Turbo bis 6,5 cm ein, und das Spiel hob die ganze Figur verzögert nach.

| Clip | tiefste Sohle | höchste tiefste Sohle (Flug) |
|---|---|---|
| Turbo | +5 mm | 11 cm |
| Roadrunner | −4 mm | 13 cm |
| Start | +3 mm | 10 cm (Antritt) |
| Bremse | −4 mm | 1 cm (Füße bleiben am Boden, Rutschen) |
| KayKit Running_B (Vergleich, gleiche Messung) | −19 mm | 7 cm |

**Eigentempo (für die Abspielrate im Code):**
- Gemessen ist der Median der Rückwärtsgeschwindigkeit des Standfußes an FB. Umgerechnet ist über KayKit Running_B in derselben Messung: 2,30 m/s gemessen entsprechen dem Spielwert 5,364 Rig/s.

| Clip | Eigentempo (Rig/s, wie `GAITS`) | × Running_B | sauberer Bereich ×0,8–1,25 |
|---|---|---|---|
| Turbo | ≈ 8,5 | 1,6 | 6,8–10,6 |
| Roadrunner | ≈ 11,8 | 2,2 | 9,4–14,7 |

- **Unsicherheit** etwa ±15 %, weil nur wenige Bilder Bodenkontakt haben (Turbo 6, Roadrunner 5). Quartile: Turbo 2,67–3,65 m/s, Roadrunner 4,72–5,48 m/s gemessen.
- Turbo schließt damit an den Sprint an (Running_B bis ×1,25 = 6,7). Roadrunner liegt darüber.

## 3 · Ohren-Folgebewegung (Laufzeit-Federn, keine Ohren-Spuren)
Gemessen ist die Neigung der Ohrkette (`ear?base` → `ear?3`) gegen den Kopf, in Grad; + heißt Spitze nach hinten.
- **Ruhe:** 2…14°.
- **Auf der Stelle** (nur Kopfbewegung, kein Fahrtwind): Turbo −22…30°, Roadrunner −30…31°, KayKit Running_B −15…23°. Die Ohren schwingen also kräftig mit dem Clip.
- **Im Lauf mit Spiel-Eingabe** (Sprint, Start → Turbo → Bremse):
  - Beim Antritt gehen die Ohren nach hinten, bis 40°.
  - Im Turbo liegen sie bei etwa 30° hinten.
  - Beim Bremsen schwingen sie nach vorn bis −26° und pendeln danach aus.
- **Im Bild:** Zeile `lauf_live_bremse_1…4` im Bogen. Ohren −34° → +20° → −17° in 1,2 s nach dem Bremsbeginn.
- **Ergebnis:** Die Folgebewegung kommt aus `ear-dangle.v1` (Fahrtwind + Trägheit) und braucht keine Spuren im Clip, wie bei den Jetpack-Clips.
- **Für WS0 (Code, optional):** Wenn Turbo und Roadrunner die Ohren noch flacher legen sollen, ginge ein Windfaktor je Stufe über `earEnv.scale`, wie `FLUG_OHREN` beim Jetpack. Das habe ich nicht gemessen.

## 4 · Belege
- **Bogen:** `belege_r1b/LAUFSTUFEN_R1B_kampfbuehne.jpg`.
  - Je Clip vier Zeitpunkte (Schleifen: Viertel der Zykluszeit; Start und Bremse: Extreme), jeweils `fb_seite` und `fb_dreiviertel`.
  - Dazu eine Zeile mit den Ohren bei laufendem Clip und eine Zeile im Lauf (`fahrkamera` + `fb_seite`).
- **Einzelbilder** in `belege_r1b/kampfbuehne/`, darunter KayKit Running_B zum Vergleich.
- **Bühnentest:** `scripts/_wsb-lauf-r1.mjs` (Kopie im Spiel-Arbeitsbaum unter `test/`, nicht committet). Aufruf: `PW_GPU=1 node test/_wsb-lauf-r1.mjs <clips.glb> <out> src/assets/actors/Rig_Medium_MovementBasic.glb`.

## 5 · Blinder Kritiker (ein Lauf, nur Bilder, Stand vor den Korrekturen)
Urteil: **PASS mit Hinweisen.**
- **Turbo:** „schneller, springender Sprint, klar“.
- **Roadrunner:** „Cartoon-Panik-Sprint, klar“.
- **Start:** „aus dem Stand, Ausholen, tiefer Ausfall, klar“.
- **Bremse:** „Bremsen, meist klar“.
- Keine gebrochenen Posen und keine Glieder im Körper.

Nachgezogen und von mir auf der Kampfbühne nachgeprüft (Bogen r1b):
- **Roadrunner-Arme standen still** („Hände hoch“): Sie flattern jetzt gegengleich.
- **Bremse:** Die Rücklage war zu flach, und die offene Hand las sich als Winken. Jetzt Rücklage 60°, die Arme sind gestreckt nach vorn gerissen und rudern.
- **Ausholen:** Hand am Gesicht las sich als Schreck. Jetzt Fäuste tief vor dem Bauch.
- **„Ohren steif“:** In Standbildern stehen die Federn still. Die Zeile mit laufendem Clip und die Messung oben zeigen die Folgebewegung.

Offen als Hinweis: In der Seitenansicht verschwinden die kurzen Arme teils hinter dem Rumpf. Das liegt an FBs Proportionen.

## Für WS0 (Einbau ist Code)
- **Einhängen:** wie im Bühnentest.
  - Clips aus dem GLB lesen.
  - `player.prepareSourceAction({ sourceClip, alias })` aufrufen.
  - Turbo und Roadrunner mit `playAction(name, { mode: 'loop', timeScale: Tempo / Eigentempo })` spielen.
  - Start und Bremse mit `mode: 'once'` spielen.
  - Alternativ als weitere Stufen in `GAITS` mit den Eigentempi oben.
- **Ablauf:** Start (0,6 s), dann Turbo ab Clip-Zeit 0,225 s. Bremse (0,9 s) hält zum Schluss den Stand; danach Überblendung in Idle.
- **Kurvenlage:** im Code (Neigung um die Hüfte). Die Clips haben keine Seitenneigung.
- **Staub und Wirbel-VFX** an den Füßen (Bremsspur, Roadrunner-Rad) sind nicht Teil dieses Pakets.

## Löschliste
Der erste Stand r1 (GLBs, Bilder, Messung), die Probeläufe und die Zwischenstände des Bühnentests im Arbeitsbaum stehen in `BLINDE_KRITIK_R1/LOESCHLISTE.md` und warten auf Georgs Ja.
