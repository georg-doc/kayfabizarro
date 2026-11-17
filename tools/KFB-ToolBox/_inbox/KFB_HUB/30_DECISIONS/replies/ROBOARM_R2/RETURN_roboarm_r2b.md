# Roboterarm R2b · Aufsätze, Ellbogen-Manschette, Ich-Perspektive · RETURN (WSB, 17.11.2026)

**Auftrag:** WS0-Kanal 17.11. nachts, PRIO, Liste aus WS1 Q-153. Grundlage `waffen/kammer-r1` @364a4951 (Roboarm-Stand @2b625267).

**Prüfwege:**
- Halten, Längen und Ich-Perspektive auf der **Kampfbühne im Spiel**: `buehne=r1`, Kameras über `test/lib/buehne.mjs`, Vorlage WS1s `_waffenkammer-roboarm.mjs`.
- Modell-Look auf der **Proof-Stage v1.2.7**.

Beides nach Georgs Vorgabe über WS0. Meine angefangene eigene Probebühne (`scripts/buehne_r2.mjs`) ist abgebrochen und kein Beleg.

## 1 · Aufsätze (neu, eigene Modelle; Georg über WS0: „Modell und Design unfertig“)
`glb/KFB_Roboarm_<id>.r2b.glb`, je Aufsatz eine Datei, gebaut mit `scripts/aufsaetze_r2.py` (Blender, headless):

| Aufsatz | Form | Mündung ab Sockel | Dreiecke |
|---|---|---|---|
| pistol | schlanker Schlitten mit Griffrillen, Lauf, Griff, Kimme und Korn | 0,510 | 5 520 |
| blaster | Spulenkörper, drei Finnen, Emitter-Schale mit Kern | 0,400 | 3 392 |
| laser | Rohr mit vier Kühlringen, Emitter: drei Zinken um einen spitzen Kristall | 0,665 | 6 528 |
| rifle | Handschutz mit Schlitzen, Schiene, Lauf, Mündungsbremse | 0,725 | 4 172 |
| railgun | zwei Schienen, drei Spulen, Kern, Kappe | 0,715 | 5 348 |
| gatling | Nabe, vier Läufe, Klemme, Frontring | 0,605 | 6 064 |
| rocket | Rohr mit Bändern, Kragen, sichtbarer Sprengkopf, Visier | 0,625 | 5 096 |
| spreadshot | Trichter mit sechs Läufen um eine Mitte | 0,425 | 5 392 |
| flamethrower | Rohr mit Kühlrippen, schmal zulaufende Düse, Tank, Zündrohr mit Zündkappe unten | 0,585 | 8 640 |

- **Raum:**
  - Ursprung = Werkzeug-Sockel (`KFB_Roboarm_Socket`), lokal +Z = Schussrichtung, +Y = oben vor dem `mountRoll` (−132°) des Spiels.
  - Einheiten = Sockel-Einheiten (lowerarm.r; Welt × 0,617 an FB).
- **Fassung** bei allen gleich: Bajonett-Kragen r 0,135 (z −0,02 … 0,09) mit drei Riegeln und Akzentring. Sie sitzt vor dem ToolCoupler des Spiels.
- **Anker:** `KFB_Muzzle` bei allen (lokal +Z).
  - Gatling zusätzlich `KFB_Muzzle_0…3` (vier Läufe; `KFB_Muzzle` = Lauf 1).
  - Flammenwerfer zusätzlich `KFB_Pilot` (Zündflamme am Zündrohr, +Z). Das Feuer selbst kommt aus dem WSA-Baukasten.
- **Materialien:** `KFB_RA_Hardware`, `KFB_RA_Muendung`, `KFB_RA_Akzent_<id>` in der bisherigen Akzentfarbe aus `waffen.r1.json`, `KFB_RA_Kern_<id>`. Kein Emissive.
- **Proof-Stage v1.2.7**, `--type prop --pose float`: **10/10 PASS** (G1–G6, Clay-Modul aktiv; Kontaktbögen `belege_r2b/proof/`, Übersicht `belege_r2b/ROBOARM_R2B_proofstage.jpg`).
  - `--pose float` ist der vorhandene Schalter der Bühne für schwebende Teile. Ohne ihn meldet G3 „versinkt“, weil der Ursprung eines Aufsatzes am Sockel auf der Laufachse liegt.

## 2 · Schnittstelle (Lücke)
- **`glb/KFB_Roboarm_ElbowBoot.r2b.glb`:** geschlossener Faltenbalg im Raum von lowerarm.r (y = Knochenachse), y −0,135 … 0,125, sechs tiefe Falten (r 0,135 / 0,172) über die ganze Höhe, dicke Wand mit Öffnung r 0,088, oben ein Abschlussring. Er ersetzt den offenen Lathe-Ring `KFB_Roboarm_ElbowCoupler`.
- **Warum:**
  - Der alte Ring ist eine einzelne offene Fläche (y −0,093 … 0,092), man sieht von unten hinein.
  - Die Schnittkante des geschnittenen Arm-Netzes reicht laut meiner Vormessung bis y −0,104, also unter den Ring.
  - Alle 24 Kantenpunkte liegen innerhalb des Balgs.
  - Einschränkung: Diese Kantenmessung stammt noch aus der abgebrochenen eigenen Bühne. Auf der Kampfbühne ist der Balg nur eingesetzt und im Bild geprüft.

## 3 · Längen-Gate (Kampfbühne, `scripts/_wsb-roboarm-r2.mjs`, Daten `data/kampfbuehne_messung.json`)
- **Ablauf:**
  - Der Arm kommt über den Spielweg: `setArmWanted(true)`, Loadout `roboarm`, `roboAssign`, Funde wie in der WS1-Vorlage.
  - Danach setze ich meine Teile im Testbrowser ein, ohne Spielcode-Änderung: Balg statt ElbowCoupler, Aufsatz am Sockel mit Roll −132°, Spiel-Aufsatz und Trichter ausgeblendet.
- **Ergebnis:** Kein Aufsatz steckt in FBs Rumpf/Kopf/Shirt (0 Punkte bei allen neun). Tiefster Punkt 0,49–0,71 m über dem Platz, Mündung 0,59–0,80 m (Werte schwanken mit der Ruhe-Animation). Die Laufrichtung ist gleich der Blickrichtung (Abweichung ≤ 0,5°).
- **Bilder:** `belege_r2b/buehne/buehne_<id>.png`, Übersicht `belege_r2b/ROBOARM_R2B_kampfbuehne.jpg`. WS1s Seitenkamera schneidet lange Mündungen am rechten Rand an; das ist deren Kameravorgabe, ich habe keine eigene Kamera gebaut.
- **Offen:**
  - Gemessen ist der Stand auf der Bühne mit Arm im Anschlag. Laufen kann die Kampfbühne über `__kfbBuehne` nicht; der rechte Arm bleibt im Spiel ohnehin in der Haltung `roboarm.aim`.
  - Schuss- und Saug-Clips habe ich nicht eigens geprüft.

## 4 · Ich-Perspektive (Vorschlag, `belege_r2b/ROBOARM_R2B_ego_A_B_C.jpg`, Einzelbilder `belege_r2b/ego/`)
- **A** (WS1-Entwurf, Kamera 35 cm hinter dem Kopf): Der Armrücken verdeckt den Aufsatz, wie WS1 berichtet.
- **B** (Kamera in Augenhöhe am Kopf, 12 cm vor dem Kopfknochen, 6 cm höher, Blick etwa 8,5° nach unten; Kopf, Ohren und Gesicht ausgeblendet): Der Aufsatz steht klar unten rechts und zeigt ins Bild. **Empfehlung: B.** Ein eigenes Armdesign braucht es dafür nicht.
- **C** (B plus gedrehter Arm): Der Arm rutscht aus dem Bild. Verworfen.

## Blinder Kritiker (ein Lauf auf dem Stand r2, nur Bilder)
Urteil **PASS mit Hinweisen**:
- Alle Aufsätze sitzen vorn am Arm und zeigen nach vorn; keiner steckt in FB, keiner schwebt; keine Lücke zwischen Arm und Manschette.
- Für die Ich-Perspektive ist B klar am besten.

Umgesetzt in r2b:
- Die Pistole las sich als Kamera; jetzt schlanker Schlitten mit Griff.
- Laser und Flammenwerfer hatten die Trichtermündung von Blaster und Rakete; jetzt Emitter mit Zinken und Kristall bzw. schmale Düse mit Zündkappe.
- Der Balg las sich als Topf; jetzt tiefe Falten über die ganze Höhe und ein Abschlussring.

Geprüft auf der Proof-Stage (Bilder r2b) und erneut auf der Kampfbühne.

**Kamera-Wünsche an WS0** (laut Kritiker, keine eigenen Kameras gebaut):
- WS1s Seitenkamera schneidet lange Mündungen ab.
- Die zweite Ansicht „vorn“ steht hinter FB, ist also eine Dreiviertel-Rückansicht. Eine echte Dreiviertel-Vorderansicht von FBs rechter Vorderseite wäre für Aufsätze besser.

Beides als Eintrag in `BUEHNE_KAMERAS`, wenn du zustimmst.

## Für WS1/WS0 (Einbau ist Code, gehört nicht WSB)
1. **Aufsätze:** in `roboarm.r1.js` statt `frontPiece`/`rocketTube` die GLB `KFB_Roboarm_<id>.r2b.glb` laden. Die Wurzel `KFB_Roboarm_<id>` kommt unverändert in den Mount mit `mountRoll`; die Mündung ist `KFB_Muzzle`. Die Teile haben mehrere Materialien; `finishRoboarmPart` erwartet eines und ist für diese Teile nicht nötig.
2. **Gatling:** Die vier Läufe stehen als `KFB_Muzzle_0…3`, damit muss die Port-Suche über die Geometrie nicht mehr laufen.
3. **Ellbogen:** `KFB_Roboarm_ElbowBoot` an lowerarm.r an die Stelle von `cuff` setzen (gleiche Lage).
4. **Ich-Perspektive:** Kamera B (Werte oben). Kopf, Ohren und Gesicht in der Ego-Ansicht ausblenden.
5. **Flammenwerfer:** neue Zeile in `waffen.r1.json` (Träger roboarm). Zündflamme an `KFB_Pilot`, Strahl an `KFB_Muzzle`.
6. **Funnel:** bleibt der B31-Trichter (unverändert).
