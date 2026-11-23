# Leitplanken für Zielbilder · R1 · Quelle KFB_SOP_R1.md@R2, KFB_SOP_AESTE_R1.md@R1, KFB_REFERENZEN_R1.md@R1, ANTI_SAMPLES_R1 (23.11.2026)

Diese Datei reist mit jedem Paket (Upload-Ordner); maßgeblich ist die Fassung im Upload, `start` prüft ihre Prüfsumme. Zählt die SOP hoch, baut WS0 kein Paket, bis diese Leitplanke nachgezogen ist.

## 1 · Rangfolge
1. Georgs Worte in diesem Chat.
2. Diese Leitplanke (hart: §2, §3).
3. Das Paket: Absicht, Befund, Referenzen.
Wenn etwas fehlt: nicht raten, Befund als „nicht_malbar“ mit Grund zurückgeben.

## 2 · Kanon (gilt in jedem Bild)
- **Look:** Clay im Vordergrund, realistischer Hintergrund. Knet-Material mit Daumenspuren, weiche Lichtkanten (Referenz Claybound, wenn im Paket).
- **Licht:** ein Licht-Rig wie im Original, gleiche Richtung, gleiche Farbe. Keine gemalten Glanzpunkte, kein Sonderlicht, kein neuer Glow.
- **Figuren:** nicht umdesignen. Form, Farbe, Augen, Lider, Blick und Gesicht wie im Original. Keine Gliedmaßen im Körper.
- **HUD:** Positionen bleiben. Teile kommen aus dem vorhandenen Kit (Material und Rahmen wie die anderen Kit-Teile im Bild), unverzerrt, nie größer als im Original. Kein leerer Rahmen, kein Symbol in fremder Fassung.
- **Text:** keine neuen Wörter, Buchstaben, Zahlen oder Etiketten. Bestehende Texte bleiben wörtlich. Alles im Spiel ist Englisch.
- **Inszenieren statt beschriften:** Bedeutung kommt aus Bühne, Licht, Bewegung, nie aus einem Wort im Bild.
- **Effekte:** nur wo sich etwas berührt; Ursache und Richtung lesbar; der Effekt fliegt mit der Kraft; eine physikalische Vorstellung, daraus 2–3 Lagen am selben Ort. Cartoon-Wrestling-Wucht, kein erzwungenes Papier oder Tusche.
- **Bewegung:** Zielbilder auf Extremposen, Ausholung und Aufprall, nie mitten in der Bewegung. Antizipation und Hold (Looney Tunes), keine Pixar-Glätte.
- **Szene:** Jedes Objekt hat eine Geschichte. Dinge sitzen auf dem Boden, sinken nicht ein. Steine und Streugut folgen der Kontur, nie radial wie ein Stern. Kits als Zonen, nicht als Streugut.

## 3 · Baubar im Echtzeit-Browser (three.js)
- Nur, was ein Browser-Spiel in Echtzeit auf Desktop und Handy zeigt: Mesh aus dem Kit, Material, Decal, Partikel, Shader, Kamera-Preset, Ein-/Ausblenden.
- Kein Bokeh- oder Filmlicht, keine volumetrischen Spezialeffekte, keine Detailmenge, die nur ein Standbild trägt.
- Komposition, Kamera und Bildausschnitt bleiben, außer der Befund betrifft genau sie.
- Format: Bearbeite die hochgeladene `…__edit.png`. Ihr grauer Rand bringt den Screenshot aufs Format des Bildmodells und bleibt grau. Das Ergebnis darf im Format der Datei oder des Originals sein; WS0 entfernt den Rand. Andere Formate lehnt das Werkzeug ab.

## 4 · Edit-Prompt (Englisch, je Bild)
```
Edit this exact game screenshot. The flat grey bars at the top and bottom are padding: keep them flat grey.
Keep the camera, framing, composition, all characters
(shape, colours, eyes, eyelids, faces), all existing UI elements and all existing text exactly as they are.
Change only: <eine konkrete Änderung aus dem Befund, in Bildsprache>.
Look: <"nimm" der Referenz(en) in konkreten Worten: Material, Licht, Form; Frames nicht mitschicken>.
Rules: matte clay in the foreground, one light direction as in the original, no new highlights or glints,
no new text, letters, numbers, labels or frames, same aspect ratio and resolution.
It must be buildable in a real-time browser 3D game (three.js).
```
Bei TUNE: „Edit the previous result. Keep everything else. Change only: <Georgs Wunsch>.“

## 5 · Selbstprüfung vor dem Zeigen (jeder Punkt Ja)
1. Gleicher Bildausschnitt wie das Original, grauer Rand unverändert.
2. Kamera und Komposition gleich (Horizont, Figurenpositionen, HUD-Positionen).
3. Figuren identisch, besonders Augen und Lider.
4. Kein neues Zeichen im Bild, alte Texte unverändert lesbar.
5. Ein Licht, keine neuen Glanzpunkte.
6. Die Änderung löst den Befund sichtbar, auch klein auf dem Handy.
7. Baubar: du kannst die Technik in einem Halbsatz nennen (z. B. „Partikel-Ring am Kiefer“, „Kit-Rahmen statt CSS-Panel“).
8. „Nimm“ der Referenz ist sichtbar, „nicht“ ist nicht im Bild.
9. Kein Anti-Muster aus §7.

## 6 · Baubarkeit (Felder der Rückgabe)
`echtzeit_threejs`, `ein_licht_rig`, `keine_glanzpunkte`, `kein_neuer_text`, `figuren_unveraendert`, `komposition_gleich`, `seitenverhaeltnis_gleich`: je true/false nach §2–§5. `hud_aus_kit`: true/false, null wenn kein HUD betroffen. `neue_assets`: Teile, die im Bild neu sind und im Spiel wohl fehlen (z. B. „Kit-Rahmen für Fisch-Karte“). `hinweis`: die Technik aus §5 Punkt 7, plus „Georg-Vorgabe“, falls Georg eine Leitplanke bewusst übergangen hat.

## 7 · Anti-Muster (so nie)
- Fantasiebild ohne Bezug zu den echten Figuren und Props (abgebrochener Bild-Chat 29.10.).
- Stilwort-Salat statt echter Spiel-Assets und Referenz-Frames (Anti-Sample 2).
- Etikett statt Inszenierung, z. B. ein Stempelwort, das die Szene erklärt (Anti-Sample 3).
- Pseudo-Collage aus KI-Bildern.
- Radiale Sternlinien beim Einbetten; Schmelzen aus Würfeln.
- Varianten-Reihen und Suchbilder: ein Zielbild je Rolle, der Unterschied muss auf einen Blick sichtbar sein.

## 8 · Familien-Regeln
- Ein Chat = eine Szenenfamilie. Stil bleibt nur innerhalb eines Chats stabil.
- Das erste freigegebene Zielbild ist der Stil-Anker der Familie.
- Driftet der Stil (Material, Licht, Farbe weichen vom Anker ab), sag es Georg in einem Satz und empfiehl einen neuen Chat mit dem Anker-Bild (Lauf +1).
