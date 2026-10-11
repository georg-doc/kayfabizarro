# Post-Mortem R1 · Warum Joyride als Goldstandard verloren ging (10.10.2026)

Verfasst von der Steuer-Sitzung (Claude Code). Anlass: Georg am 10.10.: „Joyride war von Gesamtdesign, Gesamtkonzeption und Cartoon-Deformern absoluter Goldstandard … gesetzt … ein völlig inakzeptabler Regress.“

## 1 · Was feststand

Der Masterplan R2 enthält es schwarz auf weiß:
- **§0, Grundsätze:** „Joyride als Fahr- und Banden-Look“.
- **§3, Look:** „Joyride-Racetrack durchgängig, rote Banden und orange Fahrbahn. Rand und Banden nehmen die Palette des Bioms auf.“
- **§3, Maßstab:** „die Joyride-Strecke bleibt unverändert daneben.“
- **§3b, Kamera:** „Vorbild ist der Joyride-Kamera-Abstand nach Fahrzeuglänge.“

Die Farbpaletten sind aus Joyride `track-look.v5` WORLDS abgeleitet (Lab `PALETTES`, ENV_ROLES für Biome und Story-Modes). Die Vorlagen-Karte sagt zum Fahren: „Joyride ist der Look“.

## 2 · Was gebaut wurde

- Die Fahrbahn im Lab ist dunkelblauer Asphalt in schlichtem Material, dazu beige Gehwege und RKIT-Bordsteine aus Blender. Joyride-Strecke, orange Fahrbahn, Kurvenneigung und Höhenwechsel fehlen.
- Aus Joyride übernommen ist nur die **Fahrphysik** (k2b, bytegleich), dazu Sitz bzw. Hop, die Kamera-Werte und einzelne Bande-Rollen.
- Die Cartoon-Deformer (Fahrzeug-Deformer, Squash beim Aufprall) sind nur indirekt über k2b dabei, nicht als gesetzter Look.
- Die Inseln stammen aus dem R2D-Port bzw. von Claude Design, nicht aus dem Joyride-Weltbild.

## 3 · Ursachen (ehrlich, Steuerung zuerst)

1. **Falsch eng gestellte Frage.** Am 09.10. habe ich als Entscheidung festgehalten: „Joyride bleibt Donor für die Fahrphysik“ (Masterplan §7). Diese Formulierung hat Joyride vom Goldstandard zum Physik-Spender degradiert. Danach galt „Joyride = Physik“, alles andere war frei.
2. **Besitzer-Tabelle schlägt Look-Satz.** In §4 steht „Straßen, Übergänge, Brücken, Rennstücke → RKIT“. RKIT hat konsequent seinen Blender-Baukasten gebaut (Bord, Gehweg, Bande als Profile). Der Look-Satz in §3 („Joyride-Racetrack durchgängig“) hatte keinen Besitzer und keinen Test.
3. **„Zwei Familien“ falsch verallgemeinert.** Georgs Regel (Bord in der Stadt, Joyride-Bande am Ring) habe ich als „RKIT baut beides“ gelesen, statt „der Ring ist die Joyride-Strecke, 1:1 übernommen“.
4. **Kein Bild-Vergleich gegen Joyride.** Kritiker-Referenzen und Golden-Bilder kamen aus R2D, Scholle v7 und den Webchat-Blättern, nie aus J17. Kein Lab-Bild wurde je neben `chase-curve.jpg` gelegt. Deshalb fiel der Unterschied nicht auf.
5. **Jede Sitzung baute ihre Welt.** Lab-Inseln, RKIT-Straßen und Claude-Design-Massen wurden parallel neu erfunden, statt die Joyride-Welt als gemeinsame Bühne zu übernehmen.
6. **Keine Bestandsliste.** Bis heute gab es keine verbindliche Liste „abgenommen, mit Werten“. Ohne sie gibt es auch keinen Alarm bei Drift.

## 4 · Was sich ändert (gilt ab sofort)

1. **Joyride J17 wird Goldstandard für den Gesamt-Look:** Strecke, Banden, orange Fahrbahn, Deformer, Kamera und Paletten. Eingetragen als eigener Baustein in `baseline.accepted.json` mit Gleichstand-Test: gleiche Kamera wie J17 `chase-curve.jpg` bzw. `chase-straight.jpg`, Lab und J17 nebeneinander, vor jeder Lieferung.
2. **Rückgrat zuerst:** Die Joyride-Welt bzw. der Track Core wird 1:1 übernommen. Die Inseln werden im Raum angeordnet und mit der Joyride-Strecke verbunden (Auf- und Abfahrten). RKIT-Bordsteine kommen nur noch innerhalb von Georgs eigener Town.
3. **Look-Sätze bekommen Besitzer und Test.** Jeder Satz im Masterplan, der einen Look festlegt, braucht einen Besitzer, eine Referenz und einen automatischen Vergleich. Sonst gilt er als nicht umgesetzt.
4. **Keine eng gestellten Entscheidungsfragen mehr.** Wenn Georg etwas als Standard setzt, frage ich nicht „nur für X?“, sondern halte es wörtlich als Goldstandard fest.
5. **Kritiker-Referenzen:** J17-Bilder kommen in `REFS.md` jedes Fahr- und Strecken-Laufs.
