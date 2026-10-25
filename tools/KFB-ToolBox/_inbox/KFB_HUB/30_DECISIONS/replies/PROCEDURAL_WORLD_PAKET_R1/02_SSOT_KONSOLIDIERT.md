# KFB prozedurale Welt · konsolidierte SSOT R1 (Terrain, Cartoon-Environment, Platzierung/WFC)

Stand 25.10.2026. Diese Fassung fasst zusammen, was gilt und was gebaut ist. Bei Widerspruch gelten die Kanon-Quellen im Wortlaut (Teil 3) und Georgs Entscheidungen (V-Nummern).

## 0 · Projekt in einem Absatz

KFB (Kayfabizarro) ist ein Browser-Spiel mit Fahren, Laufen, Fluff sammeln und Kampf, in einem Cartoon-Knet-Look („Claymation“).
- **Laufzeit:** three.js r186 und WebGL2, React; die Spielwelt ist eine endlose Fahrwelt aus 64-m-Zellen mit sechs Biomen.
- **Assets:** Kit-Assets (KayKit, Quaternius, Tiny Treats, Kenney) und eigene Meshy-Modelle, alle mit einem Knet-Shader (`kfb-clay.v1.1`) überzogen.
- **Blender-Kette:** Parallel erzeugt eine Kette Abnahmebilder und Style-Frames aus demselben Löser-Rezept (`kfb_place_bpy`, Gate `kfb_env.py`, Kritiker CRITIC_3D_R1).
- **Owner:** Georg (Art Direction, Abnahme im Bild). WS0 (Steuerung, Kanon, Löser). WS1 (Spiel-Laufzeit, Shader). WSB (Blender).

## 1 · Bindende Entscheidungen (Auszug, V-Nummern im Register)

| Thema | Regel | Quelle |
|---|---|---|
| Gesamtlook | Joyride J17 ist Goldstandard (Strecke, Banden, Deformer, Kamera, Paletten) | V-010, V-102 |
| Paletten | Insel-/Biomthemen aus den Joyride-Paletten (canyon, bucht, otown und Ableitungen) mit Rollen für alle Teile. OKLCH-Harmonie-Regel: Boden trägt den Grundton, Blickfang gegenüber, Laub natürlich bzw. herbstlich. Prozedurale Biom-Platten (paletteGen) nur innerhalb dieser Harmonie | V-051, V-270, V-305, V-619 |
| Biom-Paletten | Je Biom eine zufällige, harmonische Palette aus dem V-305-Generator mit sechs Leitfarben (Boden, Strang, Wahrzeichen, Laub, Himmel, Rinde) plus Leitern, Anmutung wie die drei Golden Samples. Die Farben gelten für alles (Terrain, Fluids, Bewuchs, Steine, Gras, Gebäude, OSM, Dioramen, Mindscapes, Billboards), auch surreal (R8). Keine Dämpfung (calm 0) | V-800 |
| Farbfreiheit | Jede Farbe ist erlaubt, auch surreal (lila Gras), wenn der Materialcode die Logik trägt. Einzige Grenze: Chroma ≤ 0,195 | V-565 |
| Terrain-Malerei | terrain3-Fließfarben (organische Bänder, Domain Warping, lose an der Höhe) sind das Konzept und bleiben. Nicht dämpfen, nicht verflachen (Georg 25.10. nach Rücknahme). Terrain-Look-Stack: Form → 4 gebrochene Farbflächen als runde Blobs (nie Schwellwert-fbm) → Kantenakzente nur an Formbrüchen → Vordergrund-Tonmasse → echte Schatten | #439, V-570, V-797 |
| Übergänge | Zwischen Biomen bzw. Zonen nur Sprenkel in beide Richtungen. Nie Verlauf, Linie oder Alpha | V-403, V-011 |
| Ortsbiografie | Jede Szene erzählt Entstehen → Nutzen → Vergehen → Bewachsen. Verteilung von der Quelle weg. Größe wächst mit Zeit und Abstand: Moos in Fugen, Gras 0–2 m, Büsche 2–6 m, Bäume ab 6 m, rahmend | KONZEPT_ORTSBIOGRAFIE §2, V-341 |
| Materialcodes | Ein Materialcode je Schicht und Ort (z. B. Kalkstein + Moos + Lianenholz). Alles Dazugestellte trägt einen dieser Codes und eine Rolle (Boden, Stein, Rinde, Laub/Gras, Fluff) in den Rollentönen der Palette | KONZEPT_ORTSBIOGRAFIE §3, V-565 |
| Komposition | 70/20/10 (Ruhe/Struktur/Bedeutung); ungerade Gruppen; 1 : 0,6 : 0,35 : 0,15; Abstände ≥ 30 % verschieden; ≤ 2 auf einer Geraden; Konturen ≥ 15 % überlappt oder ≥ 25 % Luft; Negativraum ≥ 30 %; Landmarke am höchsten; ein Kit je Gruppe | ETHERINGTON_REGELN, V-566 |
| Erdung | Eingraben (Einsinken je Art), Kontakt (echter Schatten plus Kontaktton 8–12 L* unter dem Wurfschatten, auf der Lichtseite die halbe Stufe), Überlappen mit Ursache. Seit 25.10.: keine Kontaktsteinchen, Fußsteinchen oder Moosfugen als Objekte (Clutter); Kontakt ist Materialcode | V-565, V-570, V-797 |
| Licht | Ein Rig, ein Tonweg, eine Materialantwort. Keine privaten Lichter, keine Blob-Schatten | V-385, V-392, LIGHT_MODEL_R2 |
| Assets | Kit-Teile wie geliefert, nur gleichmäßig skaliert. Erst vorhandene Quellen bzw. Werkzeuge („use what works“), dann Eigenbau | V-574, V-506 |
| Abnahme | Visual first: Georg nimmt Bilder ab. Das Gate ist Untergrenze, nicht Beweis | V-561, V-740 |
| Benchmark | KayKit-Promos und Kays eigene Szenen; Cartoon-Hintergrundkunst (Herriman, Noble, Lozzi, Watterson) | V-797, V-799 (q217) |
| Varianz | Alle passenden Nature-/Environment-Assets (KayKit, Tiny Treats, Quaternius, Kenney) stehen für WFC bzw. Platzierung zur Verfügung | Georg 25.10. |

## 2 · Das Modell (R3, freigegeben 25.10., q217)

Aus Kanon plus Bildstudie (Herriman, Noble, Lozzi, KayKit):

1. **Ebenen statt Streuung.**
   - Wenige Bodenebenen: Vordergrund-Bank, Hügel im Mittelgrund, Grat/Berge, Himmel.
   - Jede Ebene hat eine Rollenfarbe und eine flache Schattenform.
   - Dinge sitzen an den Kanten der Ebenen (Bankkante, Grat, Ufer, Wegrand). Das Flächeninnere bleibt ruhig, mit sparsamem Bodenzeichen.
2. **Materialcode = festes Zeichen je Material, überall gleich.**
   - Fels: Facetten in 2–3 Tönen plus Schichtlinien (Noble); Spitzen tragen Streifen, Mesas Punkte (Herriman).
   - Rinde: Tupfen. Busch: dunkle Masse mit Kritzel. Boden: Punkte oder Striche.
   - Gras: Büschel-Zeichen nur am Fuß von Dingen.
   - In Knete: Formsprache plus drei Rollentöne.
3. **Wenig und groß.**
   - Je Blick 1 Hauptformation, 1–2 Nebenformationen, 0–3 Kleinteile.
   - ≥ 50 % Ruhe, Größensprünge ~1 : 0,4 : 0,1.
4. **Verfall hat einen Ort.** Bruchstücke nur am Fuß der Formation, hangab, 1–3, nach außen kleiner und seltener (Dichte ~e^(−λd)).
5. **Bewuchs ist Zeichen, nicht Masse.**
   - Vorn: Solitäre oder Dreiergruppen mit Größenfolge. Ein Haupt-Asset erhöht die Wahrscheinlichkeit kleiner Ableger um sich (Eltern-Kind).
   - Ferne: Silhouettenreihen auf Graten.
6. **Signatur-Motiv:** 1 Hero plus 2 Echos je Zone.
7. **Farbe trägt die Ebenen.** Komplementär-Spannung zwischen Formation und Grund; vorn warm und satt, hinten kühl und blass. Alle Töne aus den Joyride-Rollen.
8. **Surreal bleibt lesbar.** Horizont, Weg und Anker bleiben fest, Formationen und Palette wechseln.

Georgs Technik-Hinweise (q217):
- Rauschen durch Stufenfunktionen (smoothstep bzw. floor) für klare Zonen.
- Poisson-Disc für Mindestabstände (kein Clipping).
- Kompaktierung: Ein Haupt-Asset erhöht die Spawn-Wahrscheinlichkeit kleiner Ableger in den Nachbarradien.

## 3 · Terrain (gebaut, Spiel)

- **Höhenfeld:** `createEndlessHeight` (Sinus-/Rausch-Komposition je Biom, breite Höhengewichte gegen Stufen).
- **Netz:** Quadtree-Blätter (64 m fein, gröber in der Ferne), zeitgeteilt gebaut, Nähte genäht.
- **Biome:** sechs (moos, mesa, wueste, schnee, pastell, canyon).
  - Voronoi-Regionen mit verbogenen Rändern.
  - Je Punkt sechs Gewichte.
  - Übergänge über das Sprenkel-Modul (`kfb-speckle-transition.v1`).
- **Shader:**
  - `kfb-clay` (Knete) + terrain3 (Fließbänder: Domain Warping, 6 Bandrollen aus der Biom-Palette) + biomeTerrain (zwei stärkste Biome, Sprenkel-Auswahl, Palettenschatten V-564).
  - Kontaktton (contactDepthTint) ist im Terrain-Shader noch offen (WS1). WSB hat für Blender Werte je Material gemessen.
- **Maßstab:**
  - Hügel 10–40 m, Fahrgefühl mit Sprüngen.
  - KayKit-Bäume 3–6 m, Figur FrizzleBob 1,81 m.
  - Kritiker: Bäume 1/20–1/30 der Hügelhöhe. Offen, Georgs Frage q210.

## 4 · Platzierung (gebaut): Löser `kfb-place-core.v1.mjs` + Regeln `kfb_place.r1.json`

**Eine Wahrheit für Spiel und Blender:** Der Löser ist ein reines JS-Modul. Er läuft im Spiel-Worker je 64-m-Zelle bzw. 32-m-Zone und im CLI für Blender-Rezepte (golden hash).

Ablauf `placeChunk({cfg, seed, chunk, terrain, biome, masks, stamps, recipeList, cardTriplet})`:

1. **Stamps** (feste Landmarken, z. B. Stumpf): einbetten, Gebrauchsspuren, Holz-Echos (Goldwinkel, nie überkreuzt), Kontakt.
2. **Zonen-Keime:** 2–4 Gruppen je Zone (`rules.zone`), Mindestabstand, Negativraum. Seit V-788 gibt es eine Hain-Ebene (`grovePlan`): Hain- oder Wiesen-Zone aus Wertrauschen. **Laut Georg falsch als Ursache.**
3. **Gruppen je Rezept:**
   - `tree_group` (Anker-Baum mit Fluff-Ankern + 3 Stützen Baum/Baum/Busch + Akzent);
   - `bush_nest`;
   - `stone_nest_slope`.
   - Ablauf je Gruppe:
     - **`solveLocal` (WFC-artig):** Slot-Belegung aus Kachel-Domänen mit Größenleiter, `repeat_max`, Ü3 (Höhen), Ü4 (Stammdicken in Dicken-Reihenfolge), Radien-Leiter.
     - **`nestPositions`:** Überlappung ≤ 0,85 oder Luft ≥ 1,25 × Radiensumme, nie kollinear.
     - **`ruleReport`:** Prüfer wie das Gate.
4. **Fluff-Nester** (Spiel-Sammelobjekte): an gemessenen B2-Ankern der Krone (nur Lichtseite), Fokus/Echo, Fallobst hangab.
5. **Kontakt-Bögen** (Staffel L/M/S, 40–50 % Umfang). **Seit V-797 als Objekte gestrichen.**
6. **Steinspur** (path_trace): heiler Kern am Ziel, zum Rand Verfall nach SPEC_EDGE_RUBBLE (A „freies Ende“).
7. **Gras:**
   - Fuß-Büschel 3/5/7 auf einem Bogen (Licht- bzw. Hangfußseite, ≤ 50 %);
   - Felder als Fibonacci-Flecken auf Vogel-Spiralen;
   - Wind-Gruppen.
   - **Laut Georg: kein Streugras.**
8. **Oddity:** ein bewusster Regelbruch je Zelle mit Wahrscheinlichkeit nach Karten-Surrealismus.
9. **Nachlauf:** Ü3/Ü4 mit G1-Wache, Moos-Fugen (gestrichen), Kontakt unter Holz entfernt.

Weitere Teile:
- **Hüllen-Wahrheit:** 289 Kacheln tragen gemessene Gate-Hüllen (`gate_r_m`, `foot_r_m`).
- **Form-DNA-Ausschluss** (`rules.form_dna`): keine Prismen- und Würfelkronen, keine eckigen Platten.
- **Gate `kfb_env.py` r6** (Blender): G1 Gruppenregeln, Ü3/Ü4/Ü5 Lehne, Kontaktfenster, FLUFF-HALT, Palette, Einsinken.
- **Kritiker `CRITIC_3D_R1`:** K1–K10, Stopp-Regel nach zwei Reparaturen ohne Gewinn.

### Spiel-Stilbilder (Hash-Modi, Worker)

| Modus | Inhalt | Status |
|---|---|---|
| `veg=core` | Löser-Gruppen + Hain-Ebene | FAIL (q210/q211) |
| `veg=mass` | Waldmassen aus Zonenfeld, Waldboden-Zone im Shader | Georg: Verteilungslogik und Materialcodes nicht verstanden |
| `veg=cartoon` | Modell R3: Grate tragen Baumreihen, Formationen an Hangbrüchen mit Bruchstücken hangab, Bewuchs nach außen, Solitäre mit Ablegern, Poisson-Abstände, Etherington-Gruppen | Wiese noch zu gleichmäßig voll, Rollenfarben greifen technisch noch nicht. Nicht abgenommen |
| Standard (MVP) | `endlessVeg`: Rastersstreuung mit Palettenplatten (`plateTint`) | alter Stand |

## 5 · Farbe an Props (Soll und Ist)

- **Soll:** Die Kit-Textur gibt nur Hell/Dunkel, der Farbton kommt aus der Rollenfarbe der Palette: Bäume `low`, Büsche `mid`, Stein `sand`, Gras `low`. So macht es der MVP-Bewuchs (`plateTint`).
- **Ist im Löser-Bewuchs:**
  - Der Knet-Shader zieht Farben mit `kfbPull` auf seine Grüntöne zurück.
  - Die Batch-Farbtextur entsteht erst beim ersten `setColorAt`, das Programm fehlt danach ohne Neubau.
  - Beides ist gefixt, die Wirkung im Bild ist aber noch nicht bestätigt.

## 6 · Asset-Inventar (lokal vorhanden)

| Paket | Modelle (Dateien) | Heute im Löser |
|---|---|---|
| KayKit Forest Nature Pack 1.0 | 84 (Bäume 20, Büsche 22, Gras 20, Felsen 17, Steine L 5) | ja |
| KayKit Medieval Hexagon Pack 1.0 | ~926 Dateien (Kacheln, Natur, Gebäude) | nein |
| KayKit Medieval Builder Pack 1.0 | ~226 | nein |
| KayKit Medieval Snow Biome | ~78 | nein |
| Tiny Treats Pretty Park / Pleasant Picnic / Homely House | 28 / 41 / 27 | nein |
| Quaternius Ultimate Nature Pack | ~300 | Stumpf und Holz in Blender lokal |
| Quaternius Stylized Nature MegaKit | ~115 (Common/Birch/Pine/GiantPine/Twisted/Dead/CherryBlossom ×5, Busch, Farn, Klee, Blüten, Felsen, Pfadsteine) | nein |
| Kenney Nature Kit | ~987 Dateien | 3 Platzhalter |
| Steinkit v4 (KFB) | 170 Kacheln | ja |

**Anforderung:**
- Alle passenden Teile werden mit Rolle (Boden, Stein, Rinde, Laub, Akzent), Form-DNA-Klasse, Skalen-Normierung und Gate-Hülle registriert und stehen WFC und Platzierung zur Verfügung.
- Familien je Ort halten die Formensprache zusammen.

## 7 · Werkzeuge und Pfade (für Rückfragen)

- **Kanon:** `KFB_HUB/30_DECISIONS/CANON_3D/` (CANON_3D_R1.md, EINARBEITUNG_WS1_R1/R2, CRITIC_3D_R1, lib/, sources/).
- **Löser:** `CANON_3D/lib/kfb-place-core.v1.mjs`, `kfb_place.r1.json`, CLI `kfb-place.mjs` (`--golden`).
- **Spiel:** Repo `KFB-Stunt-Car-Race`, Branch `game/proc-world-ws0`:
  - `src/world/placeWorker.js` (Modi place/mass/cartoon), `placeVeg.js`, `zoneField.js`, `endlessTerrain.js`, `biomeField.js`;
  - `src/look/terrain3.js`, `biomeTerrain.js`.
- **Blender:** `KFB_HUB/50_BLENDER/N40/` (lib: `kfb_env.py`, `kfb_place_bpy.py`, `kfb_erdkeil_bpy.py`, `kfb_contact_tint_bpy.py`).
