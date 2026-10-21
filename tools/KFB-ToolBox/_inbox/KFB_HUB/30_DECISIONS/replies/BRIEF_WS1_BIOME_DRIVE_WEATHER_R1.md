# BRIEF · Endlose Biom-Fahrt mit Wetter, Tageszeiten und Lichtstimmungen · R1 · 2026-10-21 · WS0 → WS1 (zweite Sitzung)
**Register:** V-619. Läuft parallel zum MVP-Zusammenführen (V-618) auf eigenem Branch `ws1/biome-drive-r1`. Eingebaut wird nach dem Zusammenführen über den Lead.

**Tier 0**
1. **Use what works:**
   - Gelände-Bake (`terrain/probe-world`);
   - die sechs Insel-Paletten (V-051, V-270);
   - Biom-Übergänge als organisches Sprenkel-Ineinandergreifen (V-403, ein Modul, nie Verlauf oder Linie);
   - TinySkies-Tageszeiten, Regen, Auroras und Blende (V-092);
   - geteilter Wind und Leitwind (V-605);
   - Töne `weather_time_r1`, `atmos_dioramas_r1`.
2. **Ein Licht-Rig (V-385):** Stimmungen sind Einstellungen dieses Rigs (Sonnenstand, Farbe, Nebel, Himmel). Keine Extra-Lichter, keine Tricks.
3. **Leistung:** Die Fahrt streamt endlos ohne Ruckler. ≥ 60 fps auf Georgs Rechner, Chunks laden im Hintergrund.

## Block
- **Endlos:**
  - Chunks um den Wagen, Biom je Region aus einem Seed (Paletten-Familie + Bewuchs).
  - Übergang nach V-403 über 30–80 m.
  - Keine Nähte, keine Höhensprünge an Chunk-Grenzen. Ein Test fährt 5 km geradeaus und 5 km im Zickzack.
- **Tageszeit:**
  - Ein Regler (0–24 h) plus Zeitraffer.
  - Das Rig folgt einer Kurve je Biom (Morgen, Mittag, Abend, Nacht).
  - Nachts Mond- und Sternenhimmel aus TinySkies.
- **Wetter:**
  - Klar, Wolken, Regen (mit Tropfen auf dem Bildschirm), Nebel, Wind.
  - Weiche Wechsel über 20–60 s. Der Ton zieht mit (`weather_time_r1`).
  - Wind treibt die Windgruppen (Gras, Bäume) über den geteilten Wind.
- **Lichtstimmungen:** 6 benannte Presets je Biom (z. B. „Goldene Stunde“, „Gewitter-Grün“, „Blaue Stunde“). Sie sind steuerbar für Georg und für Ereignisse (z. B. MIB-Einsatz verdunkelt).
- **Prüfbild:**
  - Kontaktbogen 6 Biome × 4 Tageszeiten aus der Spielkamera;
  - ein 60-s-Fahrclip mit Ton durch 3 Biome und einen Wetterwechsel;
  - fps-Tabelle.
- **Kritiker:** am Ende ein blinder Sub-Agent (CRITIC_3D_R1) auf Kontaktbogen und Clip.

**Grenzen:** Kanon unverändert. Keine neuen Assets ohne Liste an WS0. Kein Merge.

**Meldung:** `ws1/audits/BIOME_DRIVE_R1.md` + Kurzstatus an WS0.
