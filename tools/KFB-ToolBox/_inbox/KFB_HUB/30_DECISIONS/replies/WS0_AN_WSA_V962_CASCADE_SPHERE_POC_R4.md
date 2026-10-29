# WS0 → WSA work · Cascade Sphere R4: Karten-Gebäude mit HyperNorm-Hülle in der Gutter-Stadt (V-962, V-968, V-988, V-995) · 29.10.2026

**Tier 0**
1. **Gleiche Architektur, eigener Branch:** weiter auf `poc/cascade-sphere-r0` im privaten Repo georg-doc/KFB-Stunt-Car-Race. Module mit dem Host-Vertrag R1.2 nach `replies/KFB_HOST_CONTRACT_R3F_R1.md` (R1.3 ist zurückgezogen), Ziel ist eine eigene geschützte Site wie unsere Stage. Kein Commit in `game/proc-world-ws0`.
2. **Bestand vor Neubau (V-956, V-574):** HyperNorm-Engine, Karten, Kugeln, Fluff-Sog, Seed-World-Zerstörung, Maze, HUD und Sprechblasen kommen aus dem Bestand. Keine neuen Animationen, keine SVG-Bastelei.
3. **Ein kleiner Golden zuerst (V-740):** Das Designpaket ist dein R1-Paket mit Georgs Design-Ja vom 29.10. plus der Web-Chat-Stand R13. Erst ein Clip des Goldens an WS0, Georg nimmt ab, dann Ausbau. Höchstens zwei Runden je Schritt, am Ende ein unabhängiger blinder Kritiker nach `CANON_3D/CRITIC_3D_R1.md` statt Kritiker-Schleifen.

**Warum:** Georg 29.10.: Nach mehreren Design-Fehlversuchen (OSM als Spielpfad, Platformer-Verteilung, Knetklumpen auf Dächern) ist das tragende Bild klar: Ein Gebäude ist ein räumlicher Kartenbehälter. Zerschießen öffnet die Hülle, legt die Karte frei und setzt farbige Kugeln bzw. Fluff frei; Reparatur schließt sie wieder. Damit hat Zerstörung eine Funktion, und Karten, HyperNorm, Fluff und Goo werden eine Mechanik.

**Verbindlich lesen:**
- Konzept `replies/KONZEPT_CASCADE_SPHERE_GAME_IN_GAME_R1.md` §4d (neu), dazu §3 (Third-Person-Kamera), §4a (Maze statt OSM), §4b (HUD), §4c (Sprechblasen), §6 (Bestand), §6b (fx-burst).
- Web-Chat-Stand R13 im kayfabizarro-Branch `planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19` (PR 435, Head 21e82e17), Konzept-Ordner KFB_GAME_FEEL_COMIC_MOTION_R1: CASCADE_SPHERE_R13_HYPERNORM_CARD_BUILDINGS_GUTTER_CITY_CONCEPT, das Szenen- und Ereignis-Rezept (JSON) und der Quellenabgleich.
- **HyperNorm-Engine, aktueller Stand H15 Mindscape** (Claude Design, Export 25.10.):
  - Im Spiel-Repo `game/proc-world-ws0`: `site-extra/h15/` mit `00_START_HERE.md`, `DOKU.md`, `HANDOVER_WS0.md`, Engine-Datei, `support.js`, `KFB_H15_Mindscape/`, `data/h6-card-crops.json`, `hypernorm_r3/`.
  - Einbindung im Spiel: `src/world/MindSphere.jsx`. Die Engine läuft unverändert als H15-Seite in einem versteckten Rahmen. Ihre 2:1-Fläche (1024 × 512) wird je Bild in eine eigene Leinwand kopiert und als Textur genutzt, mit Naht-Überblendung an der senkrechten Kante (`seamless()`).
  - Die Kuppel wird hier zum Quader.
- Register (Branch docs/kfb-decisions-register-2026-10-11): V-248, V-259, V-265, V-403, V-532, V-574, V-609, V-625, V-660, V-677, V-740, V-956, V-962, V-968, V-987, V-988, V-995.

**Auftrag (Golden, in dieser Reihenfolge):**
1. **Gutter-Stadt aus dem Maze:** Die Maze-Gänge (V-988) werden Straßen mit Knete-Bürgersteigen, Bordsteinen und wenigen Stadtmöbeln (Bürgersteine aus dem Joyride-Bestand). Die Gänge bleiben die Spiellogik (Fluff-Fluss, Graph).
2. **Vier Karten-Gebäude** in Maze-Zellen um einen Hauptort, unterschiedlich hoch, je mit vier Schichten:
   - **HyperNorm-Hülle als Quader:** eine gemeinsame Bildquelle für alle Gebäude, keine Engine je Würfel. Die Seiten lesen die 2:1-Fläche über die Richtung vom Quader-Mittelpunkt (Würfel-Projektion der äquirektangulären Fläche). So laufen Farbe und Muster ohne harte Naht über die Kanten. Wo Kartenmotive an Kanten brechen, sind Knete-Kanten bzw. Comic-Falze erlaubt.
   - **Kartenkern:** das echte Kartenbild (H6-Crops bzw. Kartenbestand) innen, zuerst als geschützte Bildfläche im Kartenformat 1,79:1 (V-259, V-265).
   - **Kugelfüllung:** 200–600 sichtbare Kugeln als ein InstancedMesh in den Farben der Karte, Kugeln aus dem Bestand (B17-Fluff-Bälle, Kugel-Kern `game/balls-probe-r1`; V-660 „Kugeln später“ ist damit überholt). Nur wenige haben echte Kontakte, der Rest folgt Gefälle und Gutter-Kurven. Die Mengen sind Messversuche, keine Grenzen.
   - **Zerstörbare Wandsektion:** eine je Gebäude. Eine Maske macht das sichtbare Loch. Die Kollision verschwindet erst mit dem bestätigten Schadensereignis aus `cascade-core`. Die Kugeln treten genau dort aus. Reparatur schließt Loch, Maske und Kollision zusammen.
3. **Befall und Heilung nach entschiedenem Look:** Befallene Gebäude zeigen die HyperNorm-Hülle in Graustufen (Farbe gestohlen, V-625) mit herabfließendem Goo und Ink-Flüssen (V-677). Heilung durch Fluff bringt die Farbe der Karte zurück (V-609, V-532), Übergang als organisches Sprenkelband (V-403).
4. **FrizzleBob** (FB_CANON aus dem Hauptspiel, mit Jetpack) schießt, sammelt, leitet um und repariert einmal vollständig. Das muss aus Straßen- und aus Flugperspektive überzeugen.
5. **Offen lassen, nicht entscheiden:** ob Kugeln als Fluff-Ressource eingesammelt werden oder Goo neutralisieren (Regel kommt von Georg), alle 56 Karten, Card-Zone-Betreten.

**Rückgabe:** Branch und Commit, ein kurzer Clip des Goldens (Third-Person, Spiel-Look), Messwerte (Bildzeiten mit Kugeln und Schaden), offene Fragen an Georg nur dort, wo er entscheiden muss.
