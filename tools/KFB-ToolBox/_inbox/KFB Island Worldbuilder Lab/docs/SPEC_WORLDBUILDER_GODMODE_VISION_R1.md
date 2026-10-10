# Worldbuilder bzw. Gott-Modus · Perspektive R1

Stand: 2026-10-09 · Georg-Vision · **Perspektive nach dem MVP.** MVP-1 baut die Grundlage so, dass dieser Modus später darauf passt (§6).

## 1 · Idee in einem Satz

Inseln entstehen im Gott-Modus aus einem **Baukasten**:
1. Archetyp und Größe wählen;
2. Farbpalette würfeln oder aus Grundfarben ableiten;
3. Terrain formen und erweitern;
4. Gebäude und Bewohner setzen;
5. die Inseln im 3D-Raum platzieren und mit dem **Track-Editor** verbinden. Track Core berechnet die Anschlüsse selbst, auch durch einen Looping hindurch.

## 2 · Insel-Archetypen (aus der R2D-Basis)

Jeder Archetyp ist ein Rezept aus R2D-Bausteinen (Abstandsfeld, Höhe, Masken, Scholle v7, Wasser) und gibt es in **zwei Größen**: Hub-Größe ≈ 40 × 40 MC (wie Town) und Satelliten-Größe 20–28 MC.

| Archetyp | Bild | Besonderheit |
| --- | --- | --- |
| **See-Insel** | großer See in der Mitte, Ringstraße bzw. Racetrack als Kreisverkehr drumherum | Abfahrt vom Highway zu einem **Bootssteg**, dort in die Cartoon-Badewanne steigen und über den See fahren (Fahrzeugwechsel) |
| **Vulkan-Insel** | Kegel mit Krater | VFX aus **Tiny Skies** übernehmen (Vulkan-SVG bzw. Effekte, Georg: „total super“) |
| **Berg-Insel** | großer Berg, Schlucht, Lichtung, Plateau | wie Protopia im MVP, Tunnel bzw. Einschnitt für den Track |
| **Plateau- bzw. Stadt-Insel** | erhöhtes Plateau mit Treppe, Ring an der Kante | wie KFB Town |
| **Terrassen-Insel** | mehrere Stufen in MC-Höhen | Anbau nach oben bzw. unten |
| **Themen-Insel** | aus einem einzelnen Pack (Wüste, Boardgame-Bits, Voxel, Bäckerei) bzw. aus einer gekauften Demo-Insel | Quickstart, je Insel ein Deck |

## 2b · Formsprache: keine Einheits-Deckplatte (Georg 10.10.)

Inseln sollen sich in **Grundfläche und Gesamtform** deutlich unterscheiden. Nicht jede Insel ist eine abgeschnittene Platte mit gleich hoher Kante und gleichem Kegel darunter. Erst wird gestaltet, dann gerechnet: Jede Insel bekommt vor dem Bau ein kurzes Formblatt (Silhouette von vorn, Seite und oben, ein Satz Weltlogik: warum sieht sie so aus).

**Weltlogik dahinter:** Die Inseln sind aus der zersprengten Erde herausgebrochene Schollen (Masterplan §2). Deshalb gibt es zusätzlich `strata` (Erdschichten bzw. Querschnitt der Unterseite, Reste der alten Welt je nach Herkunft) und `breakAge` (frisch gesprengt bis verwittert bzw. bewachsen). Ziel: Jede Insel ist aus der Ferne an ihrer Silhouette erkennbar.

**Form-Modifikatoren** (kombinierbar, im Rezept unter `form`):

| Modifikator | Bild | Weltlogik-Beispiel |
| --- | --- | --- |
| `rimProfile` | Kante nicht überall gleich hoch: Höhen-Wellen, Senken, Anstiege bis zur Kante | gewachsenes Land statt Tablett |
| `cliffs` | Abschnitte, an denen die Rundung zu einer Felswand wird (Abbruch), mit Rubbel bzw. Geröll darunter | Erosion, Steinbruch, Burgfels |
| `terraces` | Stufen in MC-Höhen, auch an der Kante sichtbar | angelegte Felder, Weinberg, Stadtterrassen |
| `crags` | zerklüftete Felsgrate bzw. Zacken, die aus der Oberseite brechen | Berg-Insel, Protopia |
| `split` | zerbrochene Insel: zwei bzw. drei Teile mit gezacktem Bruch und Spalt, verbunden über Brücke bzw. Steg oder getrennt | Katastrophe, Riss, Geschichte des Ortes |
| `fragments` | kleine abgebrochene Brocken, die neben der Insel schweben, mit Gras bzw. Busch | Folge von `split`, Sprungsteine, Landeplätze |
| `overhang` | Oberseite ragt über die Scholle hinaus, darunter Höhle bzw. Wurzeln | Wasserfall, Höhle, Unterseite mit Leben |
| `strata` | Schichten der Unterseite: Erde, Fels, Wurzeln, Kristalle bzw. Reste der alten Welt (Keller, Rohre, Tunnel) | Querschnitt durch die gesprengte Erde |
| `breakAge` | `fresh` / `old` / `overgrown`: wie gezackt bzw. verwittert die Bruchkanten sind | Alter der Sprengung |
| `undersideStyle` | `cone` (eine Spitze), `lobes` (2–3 Lappen), `broken` (gezackt), `roots` (Wurzeln hängen) | passend zur Geschichte der Insel |

Regeln: §01 gilt für jede Bruch- und Felskante (gerundete Knet-Kanten, Rubbel, keine glatten Schnittflächen). Jede Insel nutzt mindestens einen Modifikator, der sie von ihren Nachbarn unterscheidet. Die MVP-Inseln geben die Richtung vor: **Town** = Plateau mit Burgfels-Abbruch (`cliffs`) und Terrassen zur Stadtseite; **Protopia** = zerklüftete Berg-Insel (`crags`, `cliffs`) mit 1–2 schwebenden Brocken (`fragments`).

## 3 · Werkzeuge im Gott-Modus

1. **Form:** Umriss-Editor (vorhanden) plus Archetyp. **Erweitern** nach oben (Terrasse +1 MC), nach unten (Scholle tiefer bzw. Stalaktiten) und zur Seite (Ausbuchtung, Nachbarteil anschmelzen per weichem Abstandsfeld).
2. **Terrain-Transformer:** Pinsel für Heben, Senken, Ebnen (Bauplätze für Gebäude bzw. Residenzen), Bach bzw. See. Übergänge bleiben automatisch Sprenkel S1 und Viertelkreis-Kante (§01).
3. **Farbe:**
   - **Würfeln:** eine zufällige, harmonische Palette, z. B. Farbkreis-Schemata.
   - **Ableiten:** Georg setzt 1–3 Grundfarben, der Editor schlägt passende Akzente vor.
   - Ergebnis sind immer die Material-Rollen der Farb-Grammatik (`ENV_ROLES`: Boden, Gras, Stein, Rinde, Laub, Blüte, Wasser, Akzent), damit Natur, Gebäude, HUD und Billboards mitziehen.
4. **Setzen:** Gebäude aus dem K2-Katalog, Bewohner über ihre Figuren-Karte (mit Welt-Variante), Natur über die Erdungsregeln.
5. **Decks zuordnen** (Georg 09.10.): Eine Insel kann **kein, ein oder mehrere** KFB-Card-Decks enthalten bzw. mit ihnen verbunden sein, genauso wie Residenzen und Bewohner.
   - Quelle sind die Kanon-Decks in `media/kfb/`, je Deck die ID bzw. Datei.
   - Die Decks liefern Geschichte, Billboard-Zitate, Bildsprache, Bewohner-Sätze (über Quill bzw. den Triplet-Pool) und Kartenfunde auf der Insel.

## 4 · Track-Editor (Inseln verbinden)

1. Inseln im 3D-Raum platzieren (Höhe, Abstand).
2. Am Inselrand ein **Anschlussstück** wählen, z. B. Schlussstück A an einem Anker. Die Anker kommen aus `kfb.road-bed/1` (`anchors`, `rim`).
3. Stunt-Teile in den Zwischenraum setzen (Looping, Sprung, Steilkurve, Tunnel).
4. **Track Core berechnet den Rest:**
   - Verbindung mit `CONNECT` (quintischer Hermite, Krümmung 0 an den Enden);
   - aus der Looping-Ausfahrt heraus der Anschluss an den bestehenden Insel-Anker;
   - Prüfung von Steigung (≤ 8 % für Weltstraßen), Radien und Banking.
5. Das Lab schneidet das Gelände am neuen Straßenbett (analytisches Straßenbett, Schürze).

## 5 · Reisen ohne lange Fahrt

- **Portale** zwischen Inseln, Vorbild **Tiny Skies**.
- **Taschenportal im Rucksack:** springt nach World-of-Warcraft-Logik zu bekannten Orten, an denen man schon war bzw. deren Karte man gesammelt hat. Verknüpfung mit Backpack und Kartensammlung (Backlog).

## 6 · Was MVP-1 dafür schon richtig machen muss

- **Inseln als Rezept bzw. Insel-Konfiguration speichern, nicht als fertiges Mesh:** Archetyp, Größe, Seed, Umriss, Palette (Rollen), Terrain-Edits (Pinselstriche), Anker, **Gebäude bzw. Residenzen, Bewohner (Figuren-Karten-IDs mit Welt-Variante) und Decks (0…n Deck-IDs)**. Alles zusammen ist der gemeinsame Seed der Insel, speicher- und editierbar. Die Insel-Konfiguration ist das **WorldRecipe einer Insel** im Sinne von `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE` (Academy-Foundry, Hologramm-Miniatur und Gott-Modus lesen dasselbe Rezept, nur mit anderer Ansicht).
  ```json
  { "schema": "kfb.island-config/1", "worldId": "protopia", "archetype": "mountain", "size": "satellite",
    "seed": 42, "outline": [], "form": { "undersideStyle": "lobes", "crags": 3, "cliffs": [], "fragments": 2 }, "palette": { "roles": "ENV_ROLES.protopia" }, "edits": [],
    "anchors": [{ "id": "protopia.rim.a", "kind": "road" }],
    "nodes": [],
    "buildings": [], "residents": [{ "id": "r-lorekeeper-1", "card": "lorekeeper", "variant": "protopia" }],
    "decks": [{ "deckId": "embrace_protopia", "role": "primary" }] }
  ```
  Das passt zu `planFromSpec` im Bauplan Stufe 1 (§2) und zu `kfb.r2d.island-recipe/0` aus R2D. **Regeln der Felder** (Architektur-Review R1, `REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md`):
  - `worldId` ist ein fester Slug und wird nie neu erzeugt (auch nicht beim Kopieren oder Umbenennen; eine Kopie bekommt eine neue ID).
  - `decks[].deckId` ist die Registry-ID aus `registry/assets/v1/decks/*.json` (z. B. `embrace_protopia`), **nicht** der PDF-Dateiname. `role` ist `primary` oder `linked`; höchstens ein `primary`. Die IDs sind die `packId`s aus `media/kfb/index.json` (gleicher Namensraum wie `registry/assets/v1/decks/`). Town: `{ "deckId": "frizzlebob_s_mission_control", "role": "primary" }` (Georg 09.10.).
  - `residents[]`: `id` ist die Instanz in dieser Insel, `card` die Figuren-Karte (`kfb.character-card/1`), `variant` die Welt-Variante. Dieselbe Figur kann auf mehreren Inseln stehen.
  - `anchors[]`: stabile `id` plus `kind` (`road`, `dock`, `portal`, `threshold`, `stair`). Daran docken später Track-Editor, Portale und Gatekeeper an.
  - `nodes[]`: im MVP leer. Später Interaktions-Punkte mit stabiler ID (`resource`, `water`, `farm`, `craft`, `stage`), z. B. Mine, Obstgarten, Angelstelle, Werkbank.
  - **Nie im Rezept:** Spielerzustand (Karten-Sammlung, Wallet, Reputation, Zugangsrechte, Begegnungen). Das gehört in `PLAYER_SAVE` bzw. das Ereignis-Ledger.
- **Anker am Inselrand** als Datenpunkte, damit der Track-Editor später andocken kann.
- **Farbe nur über Rollen** (eine Farbquelle `ENV_ROLES`), nie fest im Modell.
- **Größenstufen in MC** (40 × 40 bzw. 20–28).

## 7 · Quellen

- Tiny Skies (Vulkan-VFX, Portale): Branches `img2threejs/tinyskies-*`, `stage/tinyskies-*` auf `georg-doc/kayfabizarro`.
- Vorhandener Lab-Editor: Umriss-Handles, Inseln bewegen bzw. skalieren, Gebäude setzen, JSON speichern.
- Track Core v0.13: `CONNECT`, `SPIRAL`, `LOOP`, `KICKER`/`AIR`/`LANDING`, Tunnel.
- Kanten-Grammatik, QA §01, Farb-Grammatik.
