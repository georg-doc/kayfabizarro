# BRIEF WSB · B48 · Rollenspiel-Gruppe im Lager vor dem Dungeon-Portal (Meta-RPG-Hub) · R1 · 2026-10-19 · WS0
**Register:** V-556 (Hub + Zwei-Schritt Lager → Platons Höhle), V-557 (Zauber Primär/Sekundär). Baut auf V-536 (Werkzeug in der Faust), V-511 (Assets vor Eigenbau), V-520 (QA), V-548 (Scenelet).
**Reihenfolge:** Ork-Band r1b → B45 King → B47 Labyrinth → **B48** → Gunfight → Disco → Clown → Wrestling → Ninja. Georg kann umsortieren (Hub q119).

**Tier 0**
1. **Gruppe:** KayKit Adventurers (Barbar, Ritter, Magierin, Schurkin, Schurke mit Kapuze, Ranger falls vorhanden) + Kleriker mit Brunnen und Buch (aus dem Resident Atlas) + Horter mit großem Rucksack (2 Varianten). Dazu große Gäste (Large Rig): Barbar, Todesritter, Skelett, falls lokal vorhanden. Alle mit KFB-Augen, Lid = Haut, Clay, Figurenkarte.
2. **Lager vor einem Dungeon-Portal:** gemauerte Dungeon-Tür bzw. Portal im Fels (halb offen, dunkles Inneres, leichter Lichtschimmer innen für später); großes Lagerfeuer in der Mitte, alte Zelte (RPG-Bits; sonst die Hiker-Zelte), Karte auf Kiste oder Fels, Werkzeuge, Schleifstein, Kochtopf, halbvolle Schatztruhe, Münzhaufen.
3. **Alltag statt Heldentat:** Jede Figur geht einer kleinen Lagertätigkeit nach (Waffe schleifen, kochen, Geld zählen, Karte studieren, beten, Rucksack umpacken, dösen). Die Gruppe wartet seit Langem: zwei bis drei **leere Plätze** (Hocker, Schlafsack) für Mitglieder, die nicht kommen. Der Witz kommt aus Requisiten aus Assets (z. B. Pizzakarton, Zettel), nicht aus neu erfundenen Formen (V-506).

## Block
**Inventur zuerst (melden, bevor gebaut wird)**
- Suche lokal in `3D ASSETS/`: KayKit Adventurers (itch.io, CC0), KayKit RPG Tools/Bits (Karte, Werkzeuge, Schleifstein, Truhe, Münzen), KayKit Dungeon Remastered (Portal, Tür, Fackeln), Hiker-/Camping-Zelte, Large-Rig Barbar/Todesritter/Skelett, Kleriker + Brunnen + Buch, Horter (2 Varianten).
- Liste je Teil: vorhanden (Pfad, Lizenz) / fehlt. Was fehlt, lädt **Georg selbst** von seinem Patreon bzw. itch.io (Downloads nur durch Georg). Kauf- bzw. Patreon-Assets nur privat (V-538), CC0 öffentlich.

**Figuren**
- Alle auf Rig_Medium bzw. Rig_Large, KFB-Augen (EyeRig v6 + E2), Lid = gemessene Haut, Clay v1.1, Figurenkarte proof-r1 mit passendem sha.
- Signature-Waffe bzw. -Accessoire je Figur in der Faust (`KFB_Grip`, Unterarmachse, V-536). Ausnahme: reine Trage-Posen (Waffe am Rücken bzw. Gürtel beim Lagern ist erlaubt und erwünscht).
- Lager-Clips (Loop, 4–8 s): schleifen (Schleifstein, Funken nur als Platzhalter-Marke), umrühren, Münzen zählen, Karte zeigen bzw. tippen, beten am Brunnen, Rucksack umpacken, dösen bzw. gähnen, ungeduldig auf die Uhr bzw. den Weg schauen. Marken in `extras.kfb.markers`.

**Zauber-Clips für die Magierin (V-557, nur Clips + Anker, VFX später zur Laufzeit)**
- **Primär:** Frostblitz aus dem Zauberstab (kurz, schnell, Stab in der Faust, Spitze = `KFB_Muzzle` auf der Unterarmachse).
- **Sekundär:** Feuerball als geworfener Zauber aus der Hand: zweihändiges Formen, dann Wurf. Der Stab wird dafür kurz verstaut (Gürtel bzw. Rücken, Marke `stow`/`draw`), klassische Cartoon-Logik.
- Marken: `charge`, `release`, `recover`. Der Feuerball nutzt dieselbe Kette wie die SpellSpill-Effekte (V-499/V-514); daraus folgt später der Flammenwerfer: derselbe Clip mit Trichter, Blaster oder Stab als Werkzeug.
- Dieselben Zauber-Clips sollen auch für unsere Hexen passen (gleiches Rig).

**Diorama**
- Felswand mit gemauertem Portal (KayKit Dungeon bzw. Fels-Kit), Boden mit Pfad, Lagerplatz-Ring um das Feuer; Platzierungs-Grammatik R2, Bodenklemme, Dreier-Regel bei Steinen.
- Feuer: Glut als Material-Emission (Laufzeit, sonst 0, V-385). Echtes Licht macht die Laufzeit (eine warme Figurenlicht-Quelle je Gruppe, V-386).
- Das Portal ist innen halb offen und so gebaut, dass Schritt 2 (Platons Höhle als Innenraum mit Schattenspiel-Kino, V-556) daran anschließt. Schritt 2 ist **nicht** Teil von B48.

**Scenelet**
- `rpg_camp_01.scenelet.json`: Darsteller, Plätze (inkl. leerer Plätze als benannte Slots `seat_empty_*`, damit später NPCs bzw. Spieler einrücken), Lagerfeuer-Anker, Portal-Anker, Kamera-Vorschläge (Totale, Feuerkreis, Portal).
- Modular: dieselbe Gruppe mit 2, 3 oder 6 Figuren, damit sie in andere Biome (z. B. Eis-Dungeon) bzw. als größere Raid-Gruppe einsetzbar ist.

**Abnahme / Lieferung**
- Prüfbogen je Figur in **Spiel- bzw. Lager-Pose** mit Accessoire (keine T-Pose als Hauptbild), Augen Ruhe/halb/zu.
- Streifen je Lager-Clip und je Zauber-Clip.
- Diorama-Totale + Feuerkreis-Nahbild.
- QA V-520 (a)–(h), besonders (g) Material folgt Flächen und (h) „Werkzeug wird wirklich benutzt“ (Hand am Schleifstein, Löffel im Topf, Stab-Spitze auf der Achse). Lizenzen im RETURN.
