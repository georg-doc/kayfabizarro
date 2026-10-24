# WS0 → WS1 Lead (+ WS1b) · 25.10. · Prozedurale Open World: Stand, Lücken, Ausblick (Georg 25.10.)

**Tier 0**
1. **Georg will wissen, was uns für das prozedurale Open-World-Design und -Gameplay noch fehlt,** das WS1 konzipiert hat, mit aktuellen Details und Ausblick. Bei WS0 liegt das Konzept nicht vor: `docs/PROZEDURALE_WELT_KONZEPT_R1.md` (R1.5 @335b215, Zweig `ws1/prozedurale-welt`) ist nur auf dem MacBook, nicht auf GitHub.
2. **Lieferung über GitHub, keine Anhänge:**
   - das Konzept in seinem letzten Stand (R1.5 bzw. R1.6 mit Stadt-Baukasten) als Datei auf `ws1/status` unter `docs/`;
   - dazu eine neue Datei `PROZEDURALE_WELT_LUECKEN_R1.md` daneben.
3. **Kurz und mit Bildern:** je Punkt eine Zeile, Abnahmebilder nur aus dem Live-Stand (Site-Hash). Keine neuen Regeln; offene Entscheide als Frage an Georg mit Bild.

## Inhalt `PROZEDURALE_WELT_LUECKEN_R1.md`
1. **Was es heute im Spiel schon gibt:** Gelände R3, world=probe und world=endless, Biom-Fahrt, Wetter und Licht, Wasser, Bewohner und Tratsch, Ruf-Skala, Ernte, Racer, HUD 3D. Je Teil eine Zeile mit Schalter bzw. Datei.
2. **Was für das prozedurale Design fehlt** (Welt im Raster um den Spieler, Dioramen und Begegnungen prozedural, Stadtzonen, Portale bzw. Gutter, Welt als Spielzeug). Je Lücke:
   - Owner;
   - kleinste Probe für den sichtbaren Effekt;
   - was sie blockiert (Entscheid, Asset, Werkzeug).
3. **Was für das Gameplay fehlt** (Regie R0 mit Szenen-Raster und Auftrag, Spielstand /2 mit Gedächtnis je Figur, Ort und Fahrzeug, Tratsch Stufe 1, Karten-Spekulation, beseelte Fahrzeuge, KayFabrizieren, Destruction). Je Lücke dieselben drei Angaben.
4. **Die Slice-Reihenfolge nach dem MVP** (eure Tabelle aus §162, aktualisiert):
   - Slice, Owner, Abhängigkeit, Aufwand grob (S/M/L);
   - was Georg danach sieht.
5. **Offene Entscheide für Georg** mit je einem Bild:
   - „Ebene“ für Stadtzonen bei der Weltgenerierung (§5.10);
   - Himmel nach Biom (`skypal=biome`);
   - Bäume biegen statt Kollision (`treebend=1`);
   - was sonst offen ist.
6. **Was WS1 von WS0, WSB, WSA bzw. Georg braucht:**
   - locusId-Register;
   - Kassette r5 und `controlTheme` in `assets/private`;
   - Einbettungs-Werkzeug (Format `kfb.terrain-footprint/1`, nur Auftrag nach V-716).

## Zurück
- Commit auf `ws1/status` und eine Zeile in `WS1_STATUS.md`.
- WS0 trägt den Stand kompakt in den Masterplan im Hub ein (Schritt „Prozedurale Welt“) und legt Georgs Entscheide als Fragen im Hub vor.
