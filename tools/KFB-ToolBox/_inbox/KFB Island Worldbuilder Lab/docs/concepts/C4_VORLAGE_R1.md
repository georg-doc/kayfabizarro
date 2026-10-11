# C4 · Vorlage-Zeile R1 · Ausfahrt / Auffahrt und Hub-Zugang zu Fuß · 2026-10-11

Grundlage:
- Regeln: V-110 (M1), V-113 (Tunnel durch die Basis, Parkhaus-Logik), V-118 (Rampen = Track Core EXIT/ENTRY, DIVERGE/CONVERGE, Gore als Vorlage, kein Nachbau; Wendeschleife TBD, Besitzer Track Core), V-125 (automatische Runde inkl. Rampen, zwei Kritiker), V-127 (Organe sind Platzhalter).
- Steuerung: Hex-Zugang zu Fuß ist Pflicht.
- Recherche: read-only Such-Agent, Pfade unten.

## Was es schon gibt

| Baustein | Pfad | Stand | Bewertung |
|---|---|---|---|
| Track Core 0.16.1 | `~/Developer/rkit-r3/trackcore/track-core.mjs` (ES-Modul ohne three) | EXIT-/ENTRY-Makros Z.1065–1085, DIVERGE/CONVERGE Z.356–361, `entryTo()` Z.1278, Gore-Deck `compileGraph` Z.1127–1190, Graph-Export `kfb.track-core.graph/0.3`, Übergangs-Katalog B5 (Rampenfuß Bande → Stadtbord/Land, nur Rampen) und **B7 Haltebucht** `HIGHWAY|TOWN_BAY` (0.16.1, Bande endet im Kopf, Bucht, Bordstein 0,12, Gehfläche 6,4), Seiten-Kante je Stück `edge: {L, R}` (0.16) | Tests `test-v016.mjs` 116/0. Insel-Anbindung `assemblies/a1b_islands.mjs` = **Gate 1b FAIL** (Georg 08.10.) |
| Track Core im Lab | `src/world/organ/vendor/vendor-j15/lab-track/core/track-core.v012.mjs`, über den O1-Fork `organ-world.lab.js:67` | v0.12: kein EXIT/ENTRY/DIVERGE/CONVERGE, nur HAIRPIN_180, SPIRAL, ROUNDABOUT, FORK/JOIN, PIT_LANE, CONNECT | – |
| Hex-Hub | `organ-world.lab.js` | HUB Z.411; 7 KayKit-Hex-Kacheln `hubG` Z.594–598; Unterbau Z.599–618; Strecke `isle_HX` = STRAIGHT auf Kachelhöhe Z.625 mit Banden beidseitig | Spawn neben dem Auto **innerhalb der Banden**: Hex zu Fuß unerreichbar (`organ-world.ts:216` nennt das selbst „C4“) |
| Gehfläche | `organ-world.ts:204–210` | sucht `'hub-tiles'`. Den Namen setzt der Fork nirgends, deshalb greift immer der Ersatz (Gruppe an der Hub-Position) | Fehler, gehört zu C4a |
| Parkdeck J14 T4 (V-113) | `vendor-j15/lab-track/core/presets.v012.json` → `td03`: `park_in`, `helix` (SPIRAL −1080°, r 24,5, rise 15,3, Tag `parkdeck`), `atrium_up`, `roof_hairpin`, `plaza_hairpin`; begehbar nach `walkability.j14.js` | J14-T4-Pads PASS headless | Spindel durch eine Insel-Basis: nicht gefunden |
| Wendeschleife / Drehscheibe | – | in Track Core als Stück nicht gefunden (alle Versionen). Nächstes: `HAIRPIN_180`, `ROUNDABOUT` mit einem Arm (Code erlaubt das, ungetestet), J14-Pad „WENDESTELLE“ (`p1-recipes.js:54`), Travel-Core `turnarounds` (`travel-core.j17.js:22,125`) | Drehscheibe als Mechanik nicht gefunden |
| J17-Look für Zweige | `j17-track.lab.js` (prepJ17 / buildJ17Chunk / Lips / Markings) | rendert einen Strom. Gore-Flächen und Leitwand-Nase sind nicht im J17-Look | „v0.16 Strom → v5-Look ungetestet“ (`BACKBONE_EDITOR_DONORS_R1.md`) |

## Vorschlag in drei Schritten

**C4a · Hex-Zugang zu Fuß (Pflicht, zuerst)**
- 1:1: B7 Haltebucht aus Track Core 0.16.1, nur auf der Hex-Seite von `isle_HX` (`edge: { L|R: 'TOWN_BAY' }`). Die Bande endet im Kopf, Bucht, niedriger Bordstein, Gehfläche bis an die Kacheln.
- Das Auto parkt in der Bucht, die Figur steigt zur Hex-Seite aus und geht über den Bordstein auf die Kacheln.
- Neu ist nur der Anschluss: B7-Gehfläche ↔ KayKit-Kachelkante bündig (Q6), außerdem die Gehflächen-Suche reparieren (Kachel-Gruppe benennen).
- Prüfung: Fußtest Tür → Hex-Wegpunkte (6/6 erreicht, 0 unter der Fläche), parity, Q1/Q6.

**C4b · Track Core im Lab auf 0.16.1 heben, Ring unverändert**
- Der O1-Ring wird mit demselben Rezept durch 0.16.1 kompiliert statt v0.12.
- Prüfung vorab: Proben außerhalb neuer Stücke ≤ 1 mm gleich (p / T / U / R / Slots), Fahrtest-Runde unverändert.
- Erst danach kommen EXIT/ENTRY dazu. Wenn der Abgleich nicht hält: Stopp und Meldung.

**C4c · Erste Aus- und Auffahrt (V-110-Logik am Hex-Hub, da nur er einen Boden hat; Protopia ist Phase D)**
- 1:1: `EXIT` (taper 80) → Zweig-Route → Rampe B5 auf Hub-Bodenhöhe → Straße über den Platz → `ENTRY` zurück in den Ring.
- Gore-Flächen und Leitwand-Nase aus `compileGraph`.
- Jeder Zweig wird als eigener Strom im J17-Look gezeichnet.
- Neu: Die Gore- und Nasen-Flächen im J17-Look. In `j17-track.lab.js` gibt es dafür keinen Baustein; Vorschlag: Gore als Fahrbahn-Haut + Markierungen M2, Nase als Strang-Knete.
- Prüfung: V-125-Runde über Ring + Zweig, zwei Kritiker.

## Fragen an die Steuerung

1. Reihenfolge C4a → C4b → C4c ok?
2. Wendeschleife (V-110, Track Core TBD): für C4 weglassen oder `ROUNDABOUT` mit einem Arm testen (Track-Core-Code, ungetestet)? Eine Drehscheibe wäre neu.
3. Tunnel durch die Basis mit Parkdeck-Helix (V-113): erst Phase E/F, oder schon C4 am Hex-Hub?
4. Gate 1b (Insel-Anbindung mit Track Core 0.14, Blender-Strang) ist bei Georg FAIL (`rkit-r3/docs/RETURN_GATE1B.md`, 08.10.). Durchgefallen sind:
   - keine konsistenten Übergänge,
   - Gelände in der Fahrbahn, vor allem in Biegungen,
   - grüne Übergangsstücke in Kurven,
   - Wege bzw. Gehsteige nicht integriert,
   - Gehweg bzw. Bordstein ohne Clay-Look.

   Diese fünf Punkte nehme ich als harte Prüfpunkte für C4a und C4c:
   - Fahrbahn frei von Gelände bzw. Kacheln (Strahltest),
   - B7 bzw. B5 nicht in Kurven,
   - Bordstein und Gehfläche in J17-Knete (Strang- bzw. Fahrbahn-Material, kein Fremd-Look),
   - Gehfläche bündig an den Kacheln (Q6).
