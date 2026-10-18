# WS0 → WS1 · Großer Block „Flug + Zerstörung R1“ (18.10.2026 · V-514, Georg: „ja“)

Ein langer Lauf. Prüfer urteilen nur (V-411). Abnahme durch Georg im Spiel (Vorschau-Link + kurze Videos). Erst nach R1a-Veröffentlichung und Status §93 starten.

## 0 · Leitlinien (verbindlich)
- **Bestand vor Neubau** (V-511): Elan/Skyriding-PoC (§88/§89), Antrieb R1a, Cartoon-Deformer, `kfb-flight-vfx.js` (V-357), Fluff-Saug-Modul (SPEC_FLUFF_SUCTION_R1), Seed-World-Module (MODULE_INVENTORY_R1 §5).
- **Ein Look** (V-355), **Knet**, **Cartoon-VFX-Formen** nach `replies/SPEC_CARTOON_VFX_SHAPES_R1.md` (V-499: eine Masse mit Ausbuchtungen, 2–3 Töne, Lebenszyklus, keine Wiederholung).
- **Ton** geschichtet: Anschlag + Körper + Ausklang/Trümmer (V-461).
- KISS/Low Effort–High Impact. Nichts davon blockiert das Grund-Spiel. Alles hinter Feature-Flags.

## 1 · Flugmodus
- **Auslöser:** Doppel-Leertaste mit 400-ms-Fenster für die zweite Leertaste (V-024, V-179). Gleiche Geste schaltet zurück. Landen über Bodenkontakt.
- **Eine Flugsteuerung, drei Körper:**
  - (a) Dieselpunk-Racer: Schub/Antigrav aus vorhandenen Ankern (`kfb-vehicle-rig.json`, V-481). Badewannen-Kart klappt die Räder (V-274).
  - (b) Jetpack an der Figur (Platzhalter aus Bestand).
  - (c) Kampf-Mech: vorerst Racer-Körper als Platzhalter, bis ein Mech-Asset da ist.
- **Gefühl:** Elan-Logik (Schwung, Steigen kostet Tempo, Sturz gibt Tempo). Cartoon-Deformer bei Schub/Steigen/Bremsen (§86). Tempo-Stufen nach V-481 (freie Fahrt ≤ 114 km/h).
- **Effekte:** `kfb-flight-vfx.js` (Düsen, Trails, Speedlines), Kompass/HUD wie V-333.

## 2 · Zerstörung (Destruction-Mech-POC angeschlossen)
- **Module:** `createWorld`, `createDestruct`, `createWeaponFX` aus dem Seed-World-POC (Pfad und Einstieg: MODULE_INVENTORY_R1 §5). `sw-mech`/`sw-app` bleiben draußen.
- **Neuer Auslöser** statt `sw-mech`:
  - Primär-/Sekundärfeuer des Arm-Aufsatzes (B31: `kfb_attach_muzzle`) bzw. der Fahrzeug-Waffe (`weapon`-Anker aus V-481).
  - Ein Ereignis `ShotEvent → HitEvent` (siehe §3).
- **Kreislauf:**
  - Zerstörte Zellen/Teile tragen `yields: fluff(color, count)`.
  - Bruch erzeugt Fluff-Kügelchen, die das fertige Saug-Modul einsammelt.
  - Darunter können Karten freiliegen (GAME_LOOP_R1).
- **Maßstab:** Köln-Bühne 1:1 beachten, Zellgröße danach (V-306).
- **Kollision:** POC-eigene Kollision zuerst. Rapier-Collider nur, wo begehbar nötig.

## 3 · Effekt-Kette (SpellSpill-Analyse)
- **Ereignis-Pipeline** nach `replies/SPELLSPILL_R2_REF/VFX_Referenzstrategie_v1.md` §A4 (Dusterheim-Muster):
  - Eingabe → `ShotEvent` → Raycast/Projektil → `HitEvent` (Material, Normale, Stärke);
  - Bild, Ton und Spur werden **getrennt** ausgelöst → Aufräumen mit fester Lebensdauer.
- **Schichten je Treffer:**
  1. Impact-Kugel / Puff (V-499-Form);
  2. Splitter/Chips;
  3. Trümmer;
  4. Rauch;
  5. bei Explosion ein Akzent (Sternform) über dem Rauch (Muster Boxel Blitz v5);
  6. Fluff-Kügelchen.
- **Budget** (aus `replies/SPELLSPILL_R2_REF/results.json`, 16/16 Tests am Original-POC):
  - höchstens **3** echte 3D-Rauchkörper nahe am Spieler;
  - dahinter höchstens **11** Atlas-Sprites;
  - gleiche Rauch-Positionen nie doppelt;
  - Ziel p95 ≤ 2 ms Update.
  - Offen geblieben und jetzt zu messen: Bildrate auf Georgs Mac, Clay-Abnahme, Dauerfeuer.
- **Pflicht-Testszenen** (aus der Referenzstrategie): Mündungsfeuer, Projektil im Flug, Treffer Stein/Holz/Fluff, Explosion, volle Schuss-Kette. Je ein Standbild-Bogen + 3-s-Video.

## 4 · Abnahmepaket
1. Vorschau-Link mit Flag-Schaltern (Flug, Zerstörung, Budget-Overlay).
2. Videos:
   - Racer heben ab, fliegen, landen;
   - Jetpack-Sprung;
   - 12 Raketen auf einen Block (wie der SpellSpill-Test) mit Fluff-Einsammeln.
3. Messwerte:
   - Update p50/p95/p99;
   - Effekt-Spitze;
   - Bildrate;
   - die Budget-Zahlen aus §3.
4. Kurzer Status mit „was fehlt“. Keine Merges ohne Georg.

## 5 · Nicht in diesem Block
World-Builder, Fluff-o-lect-Laufzeit (kommt nach WSA `kfb-bubbles.v1`), Hyper-Rush > 114 km/h.
