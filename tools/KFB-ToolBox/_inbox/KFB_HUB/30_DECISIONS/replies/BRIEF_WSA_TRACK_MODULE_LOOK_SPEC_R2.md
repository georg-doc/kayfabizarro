# An WSA · Look-Spezifikation R2: alle Katalog-Blätter (11.10.2026, V-147/V-149/V-150)

R1 (9 Rundkurs-Module) ist abgenommen: sauber belegt, ehrliche „nicht gefunden in …“-Stellen, Nicht-übernehmen-Liste. Danke.

## Auftrag R2 (Recherche/Spezifikation, kein Bau, kein Lab-src)
Gleiches Verfahren wie R1, jetzt für die übrigen Module aus `replies/REFS_TRACK_DETAILS_2026-10-11/TD1–TD5` und `replies/REFS_CITY_STREETS_2026-10-11/CS1–CS3`. Grundlage für Modul-Status ist RKITs Abgleich `replies/RKIT_CATALOG_TD_R1.md`; Georgs Antworten auf die 21 Fragen gelten verbindlich: `replies/STEERING_ANSWERS_TD_R1.md` (V-150), Leitprinzip V-151 (chill & fun Assist).

**Reihenfolge:**
1. **town** (CS1 + TD2): Bord, Gehweg, Kantensteine, Ecke, T, Kreuzung, Zebra, Mittelinsel, Bordabsenkung, Sackgasse mit Wendeschleife, Straße → Platz mit Pollern. Bestand zuerst: RKIT Gehweg/Bord Lauf 03, `hex_b7.parts.glb`, J17 `roadStreet` + transition-profiles city.curb.
2. **Übergänge** (TD4): race ↔ town (J17 Variante B), Bord ↔ Leitplanke, Belag ↔ Schotter (~20 m, Kerb zuerst), Brückenkopf Geländer ↔ Bande.
3. **country** (CS2): COUNTRY-Familie im Core als Querschnitt-Bestand; Graben/Graskante, Leitplanke bzw. Zaun optional.
4. **dirt** (TD3/CS2): nur soweit Quellen es hergeben (J17 Biom canyon/nature Erdton, stream-to-three BIOME_PREVIEW Berm-Vorschau, S4-v2 Übergangsfamilie 3). Rest als „nicht gefunden in …“.
5. **cosmic** (CS3): nur Quellen-Liste (TinySkies, RollerCoaster v11, Joyride Glow/Emission, Lab sky), keine Look-Festlegung. Den Look entscheidet Georg.

**Für jede uneindeutige Bildstelle** (V-148): Liste mit Bild/Stelle/Frage, nicht erfinden.

## Ergebnis
`replies/WSA_TRACK_MODULE_LOOK_SPEC_R2.md` + Erweiterung `track-module-look.json` (gleiches Schema, Feld `skin`: race | town | country | dirt | cosmic). Bilder: nur vorhandene Originale verlinken; keine neuen PNG-Veröffentlichungen ohne Freigabe.

## Erweiterung (V-152)
Auch `replies/REFS_COUNTRY_TUNNEL_2026-10-11/CR1–CR4` (Berg-Schotter, Fußwege/Wanderpfade = Skin `trail`, Berginsel, Landstraße zweispurig). Für Tunnel: TC1-Cut (J15) stone_arch/stone_rect als Bestand; Stützmauern: Mauer-Baukasten V-105 + RKIT-Mauern; Brücken/Viadukte nur auf Inseln (V-120). Alle Autos fahren alle Skins (V-152).
