# KFB Island Universe · PROPOSAL

Stand 2026-10-07 · Georg · Markdown-Export des Claude-Docs (Live-Fassung zum gemeinsamen Bearbeiten: https://claude.ai/code/artifact/ef6e6ba7-9d1b-4ae1-bf6e-fa251da791c1). Bilder sind hier als Pfade angegeben, die zwei Zeichnungen als Text.

## Status und Spielregeln

Dies ist ein **PROPOSAL** für den Architecture Freeze, kein Beschluss und kein neuer Runtime-Owner. Eine Insel ist eine **Dokument- und Streaming-Grenze innerhalb des bestehenden WorldBuilder-Owners** (WB2, PR #348), nicht der Beginn eines weiteren Open-World-Systems.

- **Runtime-Owner bleibt WB2** (PR #348). Alles hier wird gegen diesen Stand geprüft, nicht daneben gebaut.
- **Neue Schemas** (`kfb.island/1`, `kfb.universe/1`, `kfb.world-object/1`, `kfb.resident-life/1`) sind Kandidaten: `PROPOSAL · candidate schema for Architecture Freeze`.
- **Bindende Persistenz-Kette:** Base Recipe → Canon / Authoring Override → Dynamic State → Player Overlay. Die Schemas setzen darauf auf.
- **Kein neuer Kanon:** Story-Quelle ist das Pilot-PDF „Cancel This Planet“. Das Hunky-Dory-Transcript ist Charakter- und Motiv-Donor, das Repo `hunky-dory` technischer Teil-Owner. Was hier darüber hinausgeht, ist als **Vorschlag** markiert.
- **Story- und Topologie-Vorschläge** in diesem Dokument: KFB-Town als Hub, Ur-Fluff-Baum als Genesis-Zentrum, Lebensbaum pro Insel.

## Zielbild

**Ein Deck ist eine Insel.** Auf ihr sind alle 56 Karten des Decks zu finden, sie hat einen Lebensbaum, 6 Landmarks mit Scenelets und Residents und ein großes Billboard. Andere Decks erreicht man über den kosmischen Joyride-Highway. Das verallgemeinert die schon geplante **Vier-Insel-Welt** des MVP (KFB Town als Hub, Utopia, Dystopia, Protopia aus den drei Ausstellungs-Decks) auf 130+ Decks.

Jede Ebene der Architektur ist eine Art von Closure (McCloud):

| Ebene | Raum | Closure |
| --- | --- | --- |
| Insel | Wege, Begegnungen, Billboard | innerhalb einer Welt, lesbar geführt |
| Highway | kosmische Strecke zwischen inkongruenten Welten | Sprung-Closure, die Verbindung entsteht im Kopf |
| Almanach | gesammelte Karten mit Herkunft | Bedeutungs-Closure, der Spieler baut Zusammenhang |
| Residents + Lean Memory | Behauptungen, Weltbilder, Gespräche | persönliche Closure, erinnert und zurückgespielt |

Die Karten konkurrieren nicht mit dem Gelände um den Boden. Sie sind Sammelobjekte, Gesprächsstoff und Billboard-Inhalt; die Insel ist der Schauplatz. Das entspricht der vorhandenen Kette `cardRef → Billboard → Resident-Triplet → Almanach` aus der Deck-World-Pipeline.

**Metanarrativ:** „Cancel This Planet“ (Fluff-Inzident, Hunky und Dory, Academy) ist der erzählerische Rahmen. Ein eigenes Deck dazu gibt es nicht; die Karten kamen später dazu.

## Topologie

**Begrenzte, flache Inseln im 3D-Raum statt einer endlosen Welt.** Jede Insel hat ihren eigenen Ursprung; das löst nebenbei die offene Rapier-Präzisionsabweichung bei großen Weltkoordinaten (WSA-Zwischenstand 07.10.).

- **Größe:** Deck-Insel etwa 1,0–1,2 km Durchmesser (zu Fuß 4–5 min, mit dem Auto etwa 40 s). KFB-Town 1,5–2 km.
- **Form:** flach mit Knet-Unterseite, keine Kugel und kein Würfel. Physik, Track Core und Character-Controller bleiben unverändert. Ein Planeten-Gefühl kommt optisch über einen Curved-World-Shader (Ferne biegt nach unten), nicht über Geometrie.
- **Universum:** freie Anordnung der Inseln mit Position und Höhe, gespeichert in `kfb.universe/1`.
- **KFB-Town als Hub (Vorschlag):** Marktplatz, Burg von King Kayfabian, Ur-Fluff-Baum als Genesis-Ort. Hauptstrecken laufen sternförmig von dort, dazu Ringverbindungen zwischen Nachbardecks. Die Deck-World-Pipeline führt Town bereits als historisch-aktuellen Hub, „nicht als viertes Zukunfts-Deck“.
- **Kosmischer Highway:** Track-Core-Routen zwischen den Häfen der Inseln, mit Stunt- und Chill-Abschnitten (siehe Straßen und Strecken).
- **Ferne Inseln:** vereinfachte, gebackene Silhouetten (Impostoren) im TinySkies-Stil. Volle Inseln werden erst beim Anflug geladen.

**Verworfen:** 56 Karten als gestapelte Ebenen pro Deck (zu komplex), Kugel- und Würfelwelten (Physik und Track-Core-Frames werden deutlich teurer), Dungeon-Ebenen-Logik.

## Anatomie einer Insel

Jede Insel folgt demselben Grundriss: Lebensbaum in der Mitte, ein Ring aus 6 Biom-Sektoren mit je einem Landmark, Ringstraße, Hafen mit Billboard am Rand.

*Zeichnung „Insel-Grundriss, schematisch“ (Draufsicht):* runde Insel; in der Mitte der Lebensbaum; 6 Biom-Sektoren im Ring mit je einem Landmark + Scenelet; Ringstraße (Track Core) verbindet alle Sektoren, drei Stichstraßen führen zum Lebensbaum, eine zum Hafen am Rand; der Fluss läuft vom Lebensbaum zum Rand und fällt dort als Wasserfall; am Hafen dockt der Highway zu den Nachbar-Inseln an.

| Teil | Was | Woher |
| --- | --- | --- |
| Lebensbaum (Mitte, Anhöhe) | Signature-Claymation-Baum, lässt Fluff-Kugeln wachsen und fallen; aus seinen Wurzeln kommt die Quelle des Flusses | Vorschlag; Fluff-Arbeit siehe Fluff-Mechanik |
| 6 Biom-Sektoren | weiche Gewichte, Joyride-Palette der Insel-Familie, Dot-Übergänge | Lab: Paletten-Abbildung, `kfbLayer` |
| 6 Landmarks | elastisch-groteske Knet-Großformen, je Sektor eines | Kartenmotive des Decks als Bezug |
| 6 Scenelets | je Sektor 1–2 Residents mit Daily Activities und Begegnungen | Resident-Life-Modell |
| Dorf + Hafen | Platz mit Hypernormalization-Billboard (Cover, gesammelte Karten), Andockpunkt des Highways | Billboard-Owner, Deck-World-Pipeline |
| Straßennetz | Ringstraße, Stichstraßen zur Mitte, ein Race-Abschnitt | Track Core |
| Fluss | Quelle am Lebensbaum, durch die Biome, Wasserfall über den Rand | R2D v0 Insel hatte Bach, Schlucht, Wasserfall |
| Unterseite | ausgerissener Wurzelballen: Erdlagen, hängende Wurzeln, schwebende Brocken | neu, eigenes Golden-Gate |

**Unterseite, damit sie diesmal gelingt:** Sie entsteht prozedural aus dem Insel-Umriss (eine weiche geschlossene Kurve, keine Hex-Kontur). Daraus wird ein nach unten zulaufender Erdkörper in 2–3 Knet-Lagen erzeugt; der Grasrand läuft im Dot-Muster in die Erde aus. Die Wurzeln sind gesweepte Knet-Röhren mit derselben Technik wie die Straßen. Man sieht die Unterseite fast nur vom Highway und vom Rand; sie braucht Silhouette und Material, keine Detailmodellierung.

**Themen-Inseln** nutzen dasselbe Rezept mit anderer Voreinstellung: Fahrschul-Insel, Regel-Insel, Dungeon-Insel mit **einem** Höhlenmodul unter dem Lebensbaum (keine Ebenen).

### Referenzen und Insel-Design-Leitlinien

**Die Referenzen zeigen, was eine Insel lesbar macht: eine klare Silhouette (breite Oberseite, kegelförmige Unterseite), ein deutlich abgesetzter Rand und eine Szene pro Ort.** Beide Quellen sind Stimmungsreferenzen, nicht zum Nachbauen: die Weltkarte ist eine fremde Illustration, die Diorama-Szenen stammen aus einem fremden Low-Poly-Paket.

Bilder: `Dropbox/CLAUDE/KFB Claymation Reference/FLOATING ISLANDS DESIGN.webp` (Weltkarte) und `DioramaScenes A–I` + `overview` im selben Ordner.

| Beobachtung | Quelle | Übersetzung in KFB-Knete |
| --- | --- | --- |
| Kegelförmige Unterseite mit Erdschichten, Farbe je Insel (orange, braun, rot, dunkel) | Dioramen A, C, F, I | Unterseite als weiche Knet-Lagen statt Facetten; Farbe als eigene Paletten-Rolle pro Biom-Familie |
| Dicker, klar abgesetzter Rand: Gras-Lippe, Sandband, Wasserring um die Insel | Dioramen A, F | Randprofil mit Gras-Wulst, Sandband im Dot-Muster, optional ein flacher Knet-Wasserring als Rand |
| Eine Szene je Ort: ein Hero-Bau, 2–3 Nebenbauten, Natur in Gruppen (Leuchtturm, Garten mit Torii, Mine mit Gleisen, Hütte mit Wasserturm) | Dioramen A, C, F, I | jeder der 6 Sektoren wird wie ein Diorama komponiert: Landmark + Scenelet + Rule of Three |
| Höhenstufen auf der Oberseite: Plateau, Klippe, Treppe | Diorama F, Karte | weiche Terrassen im Höhenfeld, Treppen als Modul bzw. Fußweg; keine Hex-Stufen |
| Schwebende Brocken unter der Insel, Wasserfälle über die Kante, Leitern und Treppen an Felswänden | Karte | Unterseiten-Dressing; Wasserfall aus dem Inselfluss; Treppe zu einem unteren Steg als mögliches Dungeon-Tor |
| Weltkarte mit Pins, gewundenen Pfaden, Brücken zwischen Inseln, Inseln auf verschiedenen Höhen, große zentrale Insel | Karte | Almanach- und HUD-Karte im selben Stil; Highway statt Stegen; KFB-Town als große zentrale Insel |
| Themeninseln: Schneeberg, Wüstenplateau, Kristallstadt auf violetter Insel | Karte | Biom-Familien je Deck; die violette Kristallstadt liest sich wie Dystopia (R2C-Palette) |
| Gewundene Pfade statt Raster | Karte, Dioramen | Track Core mit Mindestradius, Fußwege als schmales Profil derselben Familie |

**Leitlinie Silhouette:** Aus Highway-Distanz muss jede Insel an ihrer Form erkennbar sein: flache, breite Oberseite, Unterseite etwa halb so tief wie breit, Hero-Landmark und Lebensbaum überragen die Oberkante. Genau diese Silhouette ist auch der Impostor für ferne Inseln.

**Unterschied zum Referenz-Look:** Die Dioramen sind facettiertes Low-Poly. Wir übernehmen Komposition, Silhouette und Rand, nicht die Facetten: Oberflächen bleiben rund, weich und knetig (K2-Clay, Dot-Übergänge).

### Konstruktionsform: ausgerissene Erde

**Die Insel ist ein ausgerissenes Stück Erde in Knete: oben eine Grasdecke mit sichtbarer Dicke, darunter ein Erdballen.** Alles entsteht prozedural aus Umriss und Höhenfeld, nichts wird modelliert. Die Dioramen zeigen, dass so eine Unterseite ohne Modellierung überzeugend wirken kann; als Goldstandard taugen sie nicht.

1. **Umriss:** weiche geschlossene Kurve aus dem Insel-Rezept, keine Hex-Kontur.
2. **Deckschicht mit Schnittkante:** Am Rand ist die Oberseite wie ein angeschnittener Kuchen zu sehen: Grasdecke 1–2 m dick als Knet-Wulst, darunter Erde (Dioramen B, E, G).
3. **Erdballen:** nach unten zulaufender Körper aus 2–3 Lagen. Jede Lage ist der Umriss, nach innen versetzt und mit Rauschen verbeult; die Spitze sitzt außermittig, manchmal mit zwei oder drei Zapfen (Dioramen D, G). Weich und knetig statt facettiert.
4. **Dressing, erst nach dem Gate:** hängende Wurzeln als gesweepte Knet-Röhren. Sie sind optional und kommen erst, wenn die Grundform das Golden-Gate besteht, weil hier das Risiko liegt, dass es wieder schlecht aussieht.

**Bröselregen:** Unter jeder Insel fallen in ruhigem, gleichmäßigem Rhythmus Knetkügelchen ins Nichts. Technisch ist das eine instanzierte Kugelgruppe pro Insel: Startpunkte auf der Unterseite, Fallweg, Ausblenden, Takt aus dem Seed statt zufälligem Flackern. Das ist dieselbe Kugeltechnik wie das Fluff-Fallobst am Lebensbaum.

**Wasser am Rand:**

| Variante | Referenz | Aufwand | Risiko |
| --- | --- | --- | --- |
| Stehende Wasserfläche als Randschelf mit Schnittkante | Dioramen E, G | gering | gering, liest sich als Diorama |
| Fluss endet als Wasserfall ins Nichts: Wasserband über die Kante plus fallende Tropfen | Weltkarte, R2D v0 Insel | mittel | ein gerades Band sieht schnell billig aus (R2D-Befund) |

Vorschlag: Randschelf als Standard; der Wasserfall nur am Fluss des Lebensbaums, als Showpiece einer Insel. Der Wasser-Shader orientiert sich an TinySkies: Farbverlauf nach Tiefe, weicher Uferschaum, leichte Wellenbewegung; das Knet-Profil `water` bleibt.

**Polygon-Look als Rückfallebene:** Dieselbe Pipeline kann statt Knete ein facettiertes TinySkies-Material tragen: flache Facetten, Vertexfarben, Dot-Übergänge und Paletten bleiben. Ziel bleibt der Knet-Spielzeug-Look; ob die Rückfallebene nötig wird, entscheidet das Performance-Gate im vertikalen Schnitt. Das Material ist ein Parameter, keine zweite Geometrie.

### Claybound und KFB Style References

**Claybound zeigt den Knet-Look, den wir wollen, in einem lauffähigen Browser-Spiel, inklusive eines In-Game-Editors.** Quelle: Repo-Ordner `tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/` (14 Screenshots, Notizen; die vier NotebookLM-PDFs, darunter `Digital_Clay_Grammar.pdf`, sind ungelesen). Stimmungs- und Methodenreferenz, kein Nachbau.

| Beobachtung | Übersetzung für die Inseln |
| --- | --- |
| Gelände als weiche, runde Knetmassen mit flachen Fingerspuren (violette Hügel), Felsen als dicke Blöcke mit weichen Kanten und Rissen (oranger Canyon) | Terrain-Clay lite reicht für die Fläche; Felsen und Klippen als weiche Block-Module; Orange und Violett ist genau die Joyride-Canyon- bzw. Claybound-Palette |
| Schwebende Plattform: flache Oberseite, kurze runde Unterseite | dieselbe Bauform wie die Insel-Unterseite, nur klein: bestätigt die Konstruktionsform „ausgerissene Erde“ |
| Knetkrümel fliegen beim Laufen und Springen | gleiche Kugeltechnik wie Bröselregen und Fluff-Fallobst; als Lauf-VFX der Figuren |
| Bäume als große Kronen aus überlappenden, gedrückten Knet-Tupfen | Vorbild für prozedurale Knet-Bäume statt der kantigen KayKit-Kronen; passt zum Lebensbaum |
| Starke Luftperspektive: Hintergrund blass, entsättigt, in Ebenen gestaffelt | Fern-LOD als Gestaltungsmittel: ferne Inseln und Hintergrund im Nebel blass, das spart Detail und sieht besser aus |
| Props aus Holz, Seil, Münzen, Fahnen in einfacher Knet-Sprache | Props-Grammatik für Scenelets; Rule of Three |
| In-Game-Editor „The clay workshop“: Objekte wählen, Plattformtypen, Snap, Sprungbogen-Anzeige, „Test from this platform“ | UX-Vorbild für BUILD- und GOD-Modus: bauen, sofort testen, Physik sichtbar |

**Weitere Blätter im übergeordneten Ordner `KFB Style References/`:**
- `TRIPLANAR TEXTURE SEAMLESS 01`: die Derek-Technik („uses one texture“, RGB-Kachel als Farbwähler), Grundlage von `wd-look.js` aus dem WorldDesign Lab;
- `Georgs Designs Midjourney 01`: retro-futuristische Cartoon-Innen- und Außenwelten mit Violett, Türkis und Orange, schiefe Perspektiven. Gute Vorlage für elastisch-groteske Landmarks und für Hunky-und-Dory-Schauplatzideen;
- außerdem Card Zone Lab, Cologne Race Option C, Voxel Look und Wallace & Gromit als Stilreferenzen.

## Straßen und Strecken

**Alles aus einer Track-Core-Familie** — bindend laut Road/Track-Core-Kanon vom 07.10.: Der Planer liefert Route-Intent, Track Core baut, Joyride präsentiert, Surface Truth bleibt einziger Höhen-Owner. Dorfstraße, Landstraße, Brücke, Race, Stunt und kosmischer Highway sind Rezeptfamilien desselben Systems.

**Im Lab am 07.10. belegt:**
- je Graph-Kante eine CONNECT-Route, Kreuzungen als Track-Core-Kreisverkehre: 155 Kanten, 77 Knoten, kompiliert in etwa 1,3 s;
- Höhe aus der Surface Truth, entlang s geglättet und an Knotenhöhen gepinnt;
- Profil-Blend Land/Dorf/Race/Brücke mit gleicher Topologie, Kerbs wachsen am Ortseingang aus dem Bankett;
- Maßstab: Joyride-Einheiten (STANDARD 14,4 m) uniform × 0,375 auf Figur-Maßstab (5,4 m Fahrbahn).

**Fehlende Bauteile für Fahrschule und Stadt:**

| Bauteil | Wofür | Stand in Track Core v0.12 |
| --- | --- | --- |
| Einmündung / T, 4-armige Kreuzung, Y-Gabel, versetzte Kreuzung | Stadt, Landstraßen | fehlt; nur Kreisverkehr, der 60°-Arme verweigert |
| Spuren als Daten (Anzahl, Abbiegespur, Mittelinsel, Einbahn, Busspur) | Stadt, NPC-Verkehr | fehlt; nur Breite |
| Spurgraph für alle Knoten | NPC-Verkehr, Regelprüfung | nur im Kreisverkehr |
| Markierungsregelwerk (Pfeile, Zebra, Sperrflächen, Parkbuchten) | Stadt, Fahrschule | teils in road-markings.m2 |
| Stadt-Querschnitte (Absenkung, Parkstreifen, Baumscheibe, Haltebucht) | Stadt | fehlt |
| Block-Ableitung: Gehweg-Ringe und Parzellen aus Routen-Umrissen | Stadt | fehlt |
| Höhenfreie Kreuzung (Straße über Straße) | Stadt, Highway-Anschluss | fehlt |
| Practice-Pad-Module (Parklücke, Slalom, Anfahren am Berg) + Regelzonen | Fahrschule | Pads mit Stationen vorhanden |
| Schilder und Ampeln als Socket-Props | Stadt, Fahrschule | fehlt |
| Maßstabsfamilie Figur statt Auto | alle Inseln | fehlt; heute Faktor im Adapter |

**Highway-Dressing** für Tempogefühl, prozedural an die Track-Core-Samples gehängt und instanziert:
- Rhythmus-Elemente (Ringe, Portale, Pylonen, Lichtleisten, Knetbrocken), Abstand nach Fahrtempo für etwa 4–8 Hz Vorbeiflackern;
- Parallax-Ebenen: nahe Elemente, mittlere Strukturen, ferne Inseln und Knetwolken;
- vorhandene Pieces für Attraktionen: `KICKER` → `AIR` → `LANDING` (Skyjump, mit Push/Pull-Assist), `LOOP`, `SPIRAL`, `CREST`/`DIP`;
- `TRANSITION`-Zonen wechseln Palette und Audiobett zwischen Abfahrts- und Zielinsel.

## Persistenz und Schemas

**Eine Insel ist ein Dokument, kein Mesh.** Sie wird jederzeit aus Seed, Rezept und gespeicherten Abweichungen rekonstruiert, ähnlich wie die Deck-JSONs zu den PDFs. Alle vier Schemas sind `PROPOSAL · candidate schema for Architecture Freeze` und werden gegen PR #348 geprüft.

| Schicht (bindende Kette) | Inhalt auf einer Insel | Wer schreibt |
| --- | --- | --- |
| Base Recipe | Seed, Generator-Version, Deck-Bezug, Umriss-Regeln, Biome, Palette, Planer-Regeln | Generator |
| Canon / Authoring Override | im God-Mode finalisierte Abweichungen: Umriss, Sculpt-Deltas, Landmark-Slots, Straßen-Overrides, gesetzte Gebäude, Residents | Worldbuilder |
| Dynamic State | Gebäude-Zustände, Fluff-Bestände, Baumzustand, Resident-Zustände, Ereignisse | Spiel |
| Player Overlay | eigene Bauten und Abrisse, Insel-Erweiterungen, Lean-Memory-Spuren | Spieler |

**Generator-Version im Dokument:** Damit eine Insel bitgenau gleich rekonstruiert wird, steht die Generator-Version im Base Recipe. Wichtige Kanon-Daten (Umriss, Straßennetz, Landmark-Slots) werden beim Finalisieren explizit gespeichert, nicht nur abgeleitet. Sonst verändert jede Generator-Verbesserung alle 130+ Inseln rückwirkend.

**Die vier Entwürfe:**
- **`kfb.island/1`** — Base Recipe + Canon Overrides + Verweise auf WorldObjects. Setzt auf das vorhandene `kfb.world-recipe.v0` (mit `zones[]`) auf, statt daneben zu stehen. Felder: `islandId`, `deckId`, `generator`, `seed`, `outline`, `biomes`, `palette`, `planner`, `canon.{sculpt, roads, landmarks, objects, residents}`, `cardSpots[]`.
- **`kfb.universe/1`** — Insel-Platzierung (Position, Höhe, Ausrichtung), Häfen, Track-Core-Verbindungen als RouteRecipe-Referenzen, LOD- und Impostor-Metadaten.
- **`kfb.world-object/1`** — die vorhandenen Stable-Identity-Anforderungen (`WorldObjectId`, `sourceAssetId`, `recipeId`, `chunkId`, `semanticRole`, `transform`, `origin: procedural | authored`) plus **getrennte** Zustände für Transfer, Damage und Construction/Rebuild. Render-Batching darf die Identität nicht vernichten.
- **`kfb.resident-life/1`** — direkt aus dem Resident-Life-Modell abgeleitet: `ResidentProfile` (u. a. `homePoi`, `workPoi`), `AffectState`, `ActivityDefinition`/`ActivityInstance`, Encounter und Relationship Memory.

**Adressierung:** WorldObjectIds sind pro Insel eindeutig (`<islandId>/<objectId>`), damit Inseln einzeln geladen, gespeichert und geteilt werden können.

## Auf- und Abbau

**Drei getrennte Ebenen statt eines allgemeinen Voxel-Systems:** Gelände, Insel-Umriss und Gebäude bzw. Objekte. So bleibt die Surface Truth sauber und die Performance tragbar; Voxel nur lokal, z. B. als Krater-Modul.

| Ebene | Aufbau / Abbau | Gespeichert als |
| --- | --- | --- |
| Gelände | anheben, absenken, glätten | Sculpt-Delta auf dem Basisfeld |
| Insel-Umriss | „Insel verlängern“: Umriss-Kurve ausdehnen, Unterseite wird neu erzeugt | Umriss-Override (Kanon oder Player Overlay) |
| Gebäude und Objekte | modular: Fundament, Geschosse, Dach, Anbauten; Zustände pro WorldObjectId | `kfb.world-object/1`-Zustände |

**Zustände bleiben getrennt**, wie im UFO-Prep vorbereitet („Transfer state ≠ Damage state ≠ Construction/Rebuild state“), verbunden über stabile semantische IDs:
- **Construction:** geplant → im Bau → intakt → Wiederaufbau.
- **Damage:** vom Destruction-PoC übernommen als 2-bit-Schadenszustand pro Gebäude, `{buildingId, bits, collapsed, rubble}` mit stabilen Recipe-IDs. Destruction bleibt Modul und Donor, nicht World-Owner.
- **Transfer:** UFO-Traktorstrahl, abduct → hidden/transferred → return/rematerialize, laut UFO-Event-Contract und Handover an WSA.

**Folge für Residents und ChatterBox:** Jeder Zustandswechsel ist ein Weltereignis. Residents reagieren darauf (Encounter-Matrix), `repair.rebuild-section` ist eine vorhandene Activity. Der Auf- und Abbau ist damit auch ein Dialog-Generator.

## Fluff-Mechanik (Vorschlag)

**Fluff verbindet Auf- und Abbau, Residents, ChatterBox, UFO und Satire über eine einzige Ressource.** Erzählrahmen ist „Cancel This Planet“: der Fluff-Inzident, Fluff als kosmische Währung ähnlich dem Spice bei Dune, die Academy, Hunky und Dory als außerirdische Beobachter. Was hier über das Pilot-PDF hinausgeht, ist Vorschlag; Hunky, Dory und die Fluff-Harvest-Backstory behalten laut LIVING_KFB_TOWN ihren eigenen Authoring-Owner.

**Lebensbaum pro Insel**
- lässt bunte Knetkugeln wachsen, die wie Fallobst fallen: instanzierte, federnde Kugeln mit leichter Physik;
- Residents ernten sie (`fluff.harvest`, `fluff.transport` im Resident-Life-Modell) mit den Fluff-Work-Motions aus PR #356 (push, carry, ball-work);
- in KFB-Town steht der Ur-Fluff-Baum als Genesis-Ort (Vorschlag). Paradies, Baum des Lebens und Vertreibung schwingen mit, ohne zu predigen.

**Zwei Fluff-Arten, zwei Spielrollen**

| Art | Bedeutung im Metanarrativ | Rolle im Spiel |
| --- | --- | --- |
| Low-Vibrational | was geerntet werden soll und die kosmische Ressource verwertbar macht | erntbar, abholbar; UFO und Academy-Abholung sind ihr Abfluss (Transfer State) |
| High-Vibrational | menschlicher Überschuss, emergent, schwer zu kontrollieren | treibt Wachstum: Anbauten, surreale Auswüchse, Insel-Erweiterung |

**Insel-Zustand:** Der Baum hat einen Gesundheits- und Verdauungszustand (gesund → überreif → verdaut bzw. verdorben). Farbe ist dabei nur ein Parameter: Der OKLCH-Paletten-Generator erzeugt eine verdorbene Variante derselben Palette über Helligkeit, Buntheit und Tonverschiebung. Musik, Licht und Resident-Stimmung hängen am selben Zustand.

**Im Dokument:** Fluff-Bestände und Baumzustand sind Dynamic State der Insel; jedes Gebäude bekommt einen Fluff-Bezug neben seinen drei Zuständen. Ein eigenes Schema ist nicht nötig.

**Ton:** rund, knuffig, bouncy, mit dem weirden Charme einer Metaversums-Satire. Religionskritik und Satire bleiben lesbar und funktionieren trotzdem für alle Altersgruppen.

## Residents und ChatterBox

**Auf jeder Insel leben die Residents ihrer 6 Scenelets mit Daily Activities, Begegnungen und Erinnerung.** Alle Bausteine dazu liegen als Vorschläge oder Owner bereits vor; die Insel liefert ihnen POIs, WorldObjectIds und Weltereignisse.

| Baustein | Quelle | Rolle auf der Insel |
| --- | --- | --- |
| Resident-Life-Modell (Profile, Affect, Activity, Encounter/Relationship getrennt) | RESIDENT_LIFE_SEMANTIC_MODEL_PREP (Proposal) | wird zu `kfb.resident-life/1`; `homePoi`, `workPoi`, `socialPoi` zeigen auf Insel-POIs |
| Encounter-Matrix (22 Ereignisse, 7 Prioritätsbänder von `safety` bis `ambient`) | RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP | Weltzustand → Affect → Pose/Geste → Bubble/Audio/Chatter; Gedächtnis speichert Ereignisse, keine Animationen |
| Choreografie inkl. Fluff-Arbeit und Repair/Rebuild | BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY (07.10.) | Scenelets und Begegnungen zu zweit oder dritt |
| Fluff-Work-Motions (17 Medium-, 13 Large-Clips) | PR #356 | Ernte, Transport, Bauen |
| KayKit-native Motion | PR #344 | Idle/Walk/Run, Gesten |
| Deck → Card → Biome → Resident → Triplet | DECK_WORLD_SEED_CARD_PIPELINE | Residents referenzieren `primaryDeckId` und `signatureCardRefs[]`, keine Deck-Kopien |

**ChatterBox als Stimme der Welt:** Die Triplet-Logik (Subject → Connector → Reframe) speist sich aus der sichtbaren Karte, der lokalen Situation, den Signature-Karten, der Weltsicht des Decks und dem sozialen Gedächtnis. Insel-Ereignisse kommen dazu: Billboard, Kartenfortschritt, Bau und Abriss, UFO, Rennen, Wetter, Baumzustand. Der Spieler setzt die Closure, der Resident erklärt nicht zu Ende.

**Lean Memory:** Das Spiel merkt sich, wie der Spieler sammelt, verbindet und Bedeutung setzt, und spielt das als Personalisierung zurück. Gespeichert wird im Player Overlay, als Verweise auf Karten, Orte und Ereignisse.

## Insel-Design-System

**Eine Pipeline für surreale Alien-Welten genauso wie für einen Ehrenfeld- oder Hürth-Ausschnitt:** Nur der Planer-Eingang wechselt, Gelände, Track Core, Clay und Paletten bleiben gleich.

| Quelle | Gelände | Straßen | Gebäude |
| --- | --- | --- | --- |
| Prozedural (Deck-Seed) | Insel-Rezept | Planer → Track Core | Massen-Grammatik |
| OpenStreetMap-Ausschnitt | Höhenmodell, cartoonhaft überhöht | OSM-Straßengraph → Track Core | OSM-Grundrisse → Massen-Grammatik |

OSM ist ein zweiter Planer-Eingang, kein zweites System. Lizenz beachten: ODbL mit Namensnennung.

**Gebäude ohne „ausgestanzte SVG-Fenster“**
- **Masse:** runde, knuffige Grammatik aus weichen Grundkörpern (`clay-soften`). Das Dach setzt den Körper fort (Profil läuft über, Traufe als Wulst), kein aufgesetzter Deckel.
- **Fassade:** Relief-Module mit echter Tiefe in Knete (Fenster, Tür, Erker, Markise) auf einem weichen Fassadenraster, keine Decals.
- **Donor:** KayKit-City-Gebäude, nicht Medieval: in Module zerlegt, weich gemacht, geprüft nach dem FACADE-AB-01-Gate. Look-Maßstab ist die Fassaden-Deformation der Hirnwelt-Demo (Stirnstadt im H0-Referenzbild).
- **Image-to-3D** aus Fotos nur als Lieferant einzelner Module (eine Tür, ein Fenster), nicht ganzer Fassaden; sonst geht die Einheitlichkeit verloren.
- **Für die Welt** ist ein Gebäude eine WorldObjectId mit Massen-Rezept, Modulliste und Zuständen. Auf- und Abbau, UFO-Transfer und High-Fluff-Anbau funktionieren dann auf Modulebene.

**Look-Regeln (im Lab erprobt)**
- Paletten: R2C-Inselpaletten (Burg, Utopia, Dystopia, Protopia) in OKLCH auf Joyride gemappt: Farbton bleibt pro Biom, Helligkeit und Buntheit von Joyride. Die Familien Canyon, Bucht und O-Town aus track-look.v5 sind die nächsten Kandidaten.
- Umgebungs-Palette färbt nur eine explizite Klassenliste (`ENV_CLASS`): Boden, Wasser, Straßen, Markierungen, Himmel. Source-Assets behalten ihre Farben.
- Biom-Übergänge im Dot-Muster (`kfbLayer` aus R2D v0): große Flecken, mittlere und kleine Tropfen, kein Verlauf.
- Himmel und Licht nach dem Rig des Open-World-Styleguides vom 07.10.: Sonne `#fff4e6` 2,9, Hemi `#eef4fa`/`#9a8a78`, flacher Himmel `#96bede`.

## Performance und Clay nach Distanz

**Der Kostenblock ist der Clay-Shader, nicht die Geometrie.** Im Lab kostete das prozedurale Clay-Relief auf dem Terrain relativ etwa die Hälfte der Bildzeit; Gelände-Chunks mit rund 6.500 Vertices bauen in etwa 10 ms. Das deckt sich mit dem Styleguide („Knet-Shader ist der teuerste Posten“).

| Leitplanke (Styleguide 07.10.) | Ziel | Lab 07.10. |
| --- | --- | --- |
| Draw-Calls | ≤ 150 | etwa 210 |
| Dreiecke im Bild | ≤ 400k | etwa 1,2 M, größtenteils KayKit-Natur und Häuser als Einzelmeshes |
| Schattenkarte | 2048² (4096² nur Desktop) | 4096² |
| Materialien | 1 je Asset-Klasse | Terrain, Straße, Wasser je 1 |

**Clay nach Distanz** muss nach Kameraabstand und pro Asset-Klasse greifen. Das vorhandene Clay-LOD rechnet nach Pixelgröße und greift bei Terrain-Maßstab praktisch nie.

| Distanz | Terrain | Gebäude und Props |
| --- | --- | --- |
| nah | Clay lite: Handspurkarte, zwei Werkzeuge, Fingerabdrücke | volles K2/v10 |
| mittel | Handspurkarte | vereinfachte Knetoberfläche |
| fern | Palette und Silhouette | Impostor bzw. sehr billiges Material |

**Begrenzte Inseln helfen direkt:** fester Content-Umfang, Instancing für Natur und Props, „Rule of Three“ statt Streuung, Impostoren für ferne Inseln.

**Messen** nur auf der Ziel-GPU und ohne parallele Screenshot- oder Renderläufe. Am 07.10. hat paralleler GPU-Verkehr auf dem Rechner jede Headed-Messung verfälscht; selbst ohne Clay-Relief sank der Median von 59,9 auf 32 fps.

## Reihenfolge

**Erst Verträge und eine spielbare Insel mit Performance-Gate, dann Breite.** Weitere Decks, Combat und Spieler-Bauen kommen erst nach Schritt 6.

| Schritt | Inhalt | Gate |
| --- | --- | --- |
| 1 · Verträge | kfb.island/1, universe, world-object, resident-life gegen PR #348 | Freeze-Review mit WSA |
| 2 · Generator v1 | eine Insel aus einem Deck-JSON, inkl. prozeduraler Unterseite | Golden-Gate Unterseite |
| 3 · God-Mode → JSON → Rekonstruktion | finalisieren, speichern, frisch laden, identisch rekonstruieren | Save/Reload bitgenau |
| **4 · Vertikaler Schnitt: eine Insel** | Lebensbaum, 2 Zonen, Dorf + Billboard, Ringstraße + Race, 2 Residents | **Performance auf Ziel-GPU** |
| 5 · Universum | 2 Inseln + KFB-Town, Highway mit Skyjump und Autodrive | Fahrt zwischen Inseln spielbar |
| 6 · Zustände | ein Gebäudetyp: bauen, UFO-Transfer, Schaden, Wiederaufbau + Reaktion | Resident reagiert sichtbar |

Jeder Schritt endet an einem Gate; der vertikale Schnitt (Schritt 4) ist das entscheidende, weil dort Look und 60 fps zusammen nachgewiesen werden müssen.

## Offene Entscheidungen

**Die Topologie-Frage zuerst:** Sie sollte fallen, bevor WSA weiter in endloses Streaming und regionales Planen investiert.

| # | Frage | Wer | Vorschlag |
| --- | --- | --- | --- |
| 1 | Begrenzte Inseln als Dokument- und Streaming-Grenze in WB2 statt endloser Welt? | Georg + WSA | ja |
| 2 | KFB-Town als Hub und Ur-Fluff-Baum als Genesis-Zentrum in den Kanon? | Georg (Story-Owner) | als Vorschlag festziehen |
| 3 | `kfb.island/1` als Erweiterung von `kfb.world-recipe.v0`? | WSA / Architecture Freeze | ja, Felder gegen PR #348 prüfen |
| 4 | Inselgröße 1,0–1,2 km, KFB-Town 1,5–2 km? | Georg | vertikalen Schnitt messen, dann festlegen |
| 5 | Fehlende Track-Core-Bauteile (Einmündung, Spuren, Spurgraph, Figur-Maßstab) im Track-Core-Owner (PR #219) bauen? | Track-Core-Owner | ja, nicht im Insel-Code |
| 6 | Fluff-Mechanik (Low/High-Vibrational, Baumzustand) als Spielsystem? | Georg + Hunky-Dory-Authoring-Owner | als Vorschlag prüfen |
| 7 | Erster Deck für den vertikalen Schnitt? | Georg | eines der drei Ausstellungs-Decks (Utopia, Dystopia oder Protopia) |
| 8 | OSM-Insel als zweiter Test-Eingang (z. B. Ehrenfeld)? | Georg | nach dem ersten Deck |
| 9 | Unterseite: Referenzbild für das Golden-Gate? | Georg | vor dem ersten Generator-Lauf festlegen |

## Quellen

Repo `georg-doc/kayfabizarro`, main `76f2f021…`; Open-World-Integrator PR #348 auf `98b82377…`. Der Lese-Status steht in der letzten Spalte (Stand 07.10.).

| Thema | Quelle | Status |
| --- | --- | --- |
| Open World Owner | [PR #348](https://github.com/georg-doc/kayfabizarro/pull/348) | Receiving Owner |
| Aktueller Auftrag | `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/WORK_WSA_OPEN_WORLD_INTEGRATOR_ONE_SHOT_2026-10-07.md` (Branch `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`) | gelesen |
| Terrain / Object Identity | `skills/chat/KFB_OPEN_WORLD_POST_FREEZE_TERRAIN_OWNERSHIP_GUARD_2026-10-07.md` | bindend, gelesen |
| Roads + Race Tracks | `skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md` | bindend, gelesen |
| Track Core | [PR #219](https://github.com/georg-doc/kayfabizarro/pull/219) | Owner; Lab nutzt v0.12 aus dem Joyride-J16-Donor |
| Joyride Look | `tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/track-look.v5.js` | Donor |
| Deck → World | `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` | Planungsvertrag, gelesen |
| Destruction → Open World | `…/KFB Seed World Mech Destruction POC 01/…/seedworld/docs/INTEGRATION_OPEN_WORLD.md`, `MODULE_CONTRACTS.json` | Donor, gelesen |
| UFO Architektur | `skills/chat/UFO_HUNKY_DORY_WORLD_EVENT_PREP_2026-10-06.md` | Prep, gelesen |
| UFO Donor | `…/KFB UFO Tractor Beam Event Lab/…/ufo-event-lab/EVENT_CONTRACT.json`, `HANDOVER_WSA_2026-10-07.md` | Donor, gelesen |
| Resident Life | `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md` | Proposal, gelesen |
| Resident-Reaktionen | `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.json` | Proposal, gelesen |
| Choreografie | `skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_EXECUTION_2026-10-07.md` | Execution, überflogen |
| Fluff Work Motions | [PR #356](https://github.com/georg-doc/kayfabizarro/pull/356) | nächstes Gate: Runtime Consumer Proof |
| Motion | [PR #344](https://github.com/georg-doc/kayfabizarro/pull/344) | Owner |
| KFB Town / Hunky-Dory | `skills/chat/town/LIVING_KFB_TOWN.md`, [hunky-dory](https://github.com/georg-doc/hunky-dory) | eigener Authoring-Owner |
| Story | Dropbox: `Showrunner - Cancel this Planet!/Pilot - Cancel This Planet - Leaks 1-3.pdf` | Story-Quelle, noch nicht gelesen |
| Look-Werte | Dropbox: `KFB_OPEN_WORLD_STYLEGUIDE_2026-10-07` | gelesen |
| Lab-Befunde | Dropbox: `KFB Open World Visual Terrain Recovery Lab` | Spender-Material, 07.10. |


