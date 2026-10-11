# RKIT · Vorlagen-Zeile Skin `dirt` (V-147 / V-150 / V-151) · Vorschlag, kein Bau (R1)

Stand 2026-10-11 · Grundlage:
- Georgs Antworten in STEERING_ANSWERS_TD_R1 (#10–#13, #11 Übergang);
- TD3 und CS2;
- S4 v2 Übergangsfamilie 3 „Race track ↔ Dirt track“ (`:318`);
- Track Core COUNTRY als nächster Bestand.

## Vorlagen-Zeile

| Feld | Vorschlag |
|---|---|
| **Logik** | neue Profil-Familie `DIRT` im Core; `NODE_SKINS.dirt.families = ['DIRT']`; Schlüssel `dirt` wird freigeschaltet (`open` entfällt) |
| **Maßstab** | keine Spuren, keine Markierung (`NONE`). **V-152 (Antwort A):** alle Autos fahren alle Skins, keine Fahrzeugbindung. Knoten-Abstand nach Skin-Logik wie bei den übrigen Familien: DIRT bekommt ein eigenes `vehicleW` = das breiteste Fahrzeug, das es befahren kann (Renn-Hülle 4,1 → 2,05), weil Rennautos auf Schotter fahren |
| **Breite** | `NARROW` 10,8 als Vorgabe (schmaler als Rennen 14,4, #13); `WIDTH_STEP` wie überall |
| **Querschnitt** (14 SLOTS, Rollen) | shoulder = Kies-Kante 1,0 (Rolle `gravel`, Absenkung 0,05, wie COUNTRY); barrier = Graslippe 1,5 (Rolle `grass_lip`, Höhe +0,15, außen −0,2); underside = Damm (Rolle `embankment`, Tiefe 0,8). Bande **aus** als Vorgabe; nur an Gefahrenstellen per `edge: {L, R}: 'bande'` (#13) |
| **Berm-Kurve** (#10, V-151) | Makro `BERM_CURVE` = CURVE_EASE + Querneigung nach der Bank-Regel aus REF_ANALYSIS (ideal atan(v²/(g·R))), gedeckelt auf einen Assist-Grenzwert (Vorschlag 35°), dazu die äußere Lippe als befahrbare Wand: shoulder steigt außen um 0,6–1,0 an. Wandfahrt bzw. Sandkurve = Teil der Fahrfläche (`surface` 1), nicht Kante. Grenzen je Modus später (V-151) |
| **Übergang Belag ↔ Schotter** (#11) | Katalog-Einträge `COUNTRY\|DIRT`, `TOWN\|DIRT` (Welt ↔ Schotter) und `RACE\|DIRT`: Länge 20 m; Fenster: Kerb bzw. Bande endet zuerst [0, 0,3], Belag franst in Knetklecksen aus [0,3, 1] (Fransen = Lab-Look über `q.skin`-Blende; Core liefert nur Fenster) |
| **Ende** (#12) | nie offen: Kappen-Daten am Routen-Ende `cap: meadow · yard · gate` (Core = Rahmen + Art; Lab baut Wiese, Hof, Gatter) |
| **Palette** | `SKINS.dirt` Platzhalter (road Lehm, shoulder Kies, barrier_cap Gras, underside Erde); Farben macht das Lab (V-147: Farben in den Bildern zählen nicht) |
| **Checks** | bestehende Strom-Checks; neu: `berm_bank` (Querneigung ≤ Assist-Grenze, Lippe stetig), Übergangsfenster wie B1/B5 |
| **Tests** | `test-dirt.mjs`: Querschnitt (Slots, Rollen), Berm unter Assist-Grenze, Übergänge 20 m mit Fenstern, Ende ohne offenen Rand, Knoten mit `skin: 'dirt'` (Kreisel, Kreuzung); Teil 0 und alle Suiten bitgleich |
| **Owner** | Core: Familie, Querschnitt, Berm-Makro, Katalog, Kappen-Daten. Lab bzw. RKIT: Rillen, Kiesel-Rubbel, Graslippe-Look, Gatter |
| **Aufwand** | L (2–3 Tage inkl. Tests) |

## Fragen vor dem Bau (V-148)

| | Frage |
|---|---|
| A | **beantwortet (V-152):** alle Autos auf allen Skins. Daraus folgt Knoten-Abstand 2,05 (breiteste Hülle), Breite NARROW 10,8. |
| B | Assist-Grenze für die Berm-Querneigung: 35° als Startwert in Ordnung? |
| C | Schotter in Kreuzungen und Kreiseln: Soll es eigene Schotter-Knoten geben, oder nur Schotter-Arme an Straßen-Knoten (#14: Ring = Skin der Hauptstrecke)? |
