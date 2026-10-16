# WSA → WS0 · Guided Hyperspeed / Warp Ride Generator R1
**Datum:** 2026-10-16 · **Typ:** Georg-konzipierter WS0-Planungs-Intake · **Status:** PROPOSAL FOR WS0; kein Runtime-Auftrag, kein technischer PASS, keine neue V-Nummer.

## 0. Kurzentscheidung / WS0-Aktion

Georg befürwortet die Weiterplanung eines optionalen **navigationsgestützten, spektakulär komponierten Hyper-Rides** für KFB: Ziel auf taktischer Karte/Minimap wählen (Quest, POI, Diorama, Welt oder Kartendeck), Route vorbereiten und statt der kürzesten Verbindung eine kontrollierte, abwechslungsreiche Cartoon-/Rollercoaster-Fahrt erleben. **Free Drive und freier Hyperspeed-Fahrt-/Flugmodus bleiben das bevorzugte, primäre Gameplay**; Guided Warp ist nur eine zusätzliche Reisemöglichkeit. Loopings, Rampensprünge, Kurven, Tunnel und Zielanflug gehören ausdrücklich zum Erlebnis; der Track soll teilweise sichtbar vor dem Fahrzeug liegen und je Abschnitt passend zum Terrain/in der Luft/in Tunneln gestaltet werden. KISS, Chill-and-Fun, Performance und aktive Spieler-Eingriffe sind verbindliche Gestaltungsziele.

**Neue Klarstellung von Georg zur Bewegung (16.10.):** K2B/Joyride ist für das freie Fahrgefühl bereits als bevorzugte/gewählte Basis entschieden: stabiler und weniger überschlagsanfällig als der erprobte ecctrl-Zustand. Das Register dokumentiert noch den Vergleich (V-290/V-347). **WS0 muss diesen Vorrang als Georgs aktuelle Entscheidung nachführen** und frühere widersprechende Briefings konsistent markieren; nicht still als bereits kanonisch eingetragen ausgeben. Es ist keine pauschale Abnahme jeder K2B-Terrain-/Hover-/3D-Inversionsfunktion. WS1 bleibt einziger aktiver Bewegungs-/Kamera-Runtime-Owner.

**WS0 soll das Konzept priorisieren und in einen kleinen Pilotauftrag übersetzen**, nicht sofort eine weitere vollständige Welt/Engine/Track-Runtime auslösen.

## 1. Spielidee: Route als Ride-Komposition statt kürzester Pfad

- Navigation klärt **Start, Ziel-ID/Quest-/Deck-Referenz, gültigen Ankunftsanker, groben Raumkorridor und Welt-/Zonengrenzen**. Eine Deck-Auswahl löst ihre bestehende Ziel-/Stage-Instanz auf und erzeugt keinen zweiten Quest- oder Deck-Owner.
- Ride-Komposition nutzt **bestehende Track-Core-RouteRecipe-/Graph-/Profil-/Stuntmodule**, um eine weiche, sichere und visuell interessante Fahrt zu entwerfen. **Nicht** shortest-path-only: Lesbarkeit, Höhenwechsel, Aussicht/Landmarken, Spannung/Entspannung, Sicherheit und Ankunft zählen im Kandidaten-Scoring mit.
- Drei getrennte Schichten: **(1) Navigationsabsicht** (World/Quest), **(2) RouteRecipe + geprüfte 3D-Führungsframes** (Track Core), **(3) Fahrassistenz, Kamera, Skins, Scenery und VFX** (WS1 als einziger Runtime-Host mit bestehenden Präsentations-Ownern). Keine zweite Route-Geometrie-/Surface-Truth-Authority.
- Dieselbe geprüfte Route kann **Joyride-Race-Skin, dünnere Hyper-Rail-Schiene, Warp-Tunnel, abschnittsweise unsichtbaren Track oder gemischte Skins** nutzen. Das Ändern der Skin darf die Fahrt-/Kollisionswahrheit nicht ändern.
- Für freie Verbindungskorridore kann die virtuelle 3D-Führung ohne physische Straßenoberfläche bestehen. **Loops, Rails, Landungen und bewusst gezeigte Stunts** bekommen lokal sichtbare Geometrie. Ein unsichtbarer Track darf nicht unbemerkt einen unsichtbaren Kollisionstisch über dem echten Terrain schaffen.

## 2. Drei Reisefreiheiten (ein Fahrzeug- und Eingabe-Owner)

| Modus | Rolle | Steuerung / Assist |
| --- | --- | --- |
| **FREE DRIVE** | Gewöhnliche freie Fahrt zwischen Dioramen | K2B-basierte freie Terrain-Fahrt, W/S, A/D enger Wendekreis, Q/E Drift, Shift Boost, Space Jump, Kollisionen/Recovery |
| **FREE HYPERSPEED / HOVER RUSH** | Von beliebiger freier Fahrt spontan beschleunigen, ggf. kurz schwebend über Gelände | K2B-Fahrgefühl mit begrenzter vorausschauender Grounding-/Hover-Hilfe; Spieler behält direkte Richtungsentscheidung; echter Flug nur bewusst, vorhandenen M1-Flug-Owner respektieren |
| **GUIDED WARP RIDE / ROLLERCOASTER** | Zielgerichtete, spektakulär komponierte Schnellreise | Vorbereiteter, geprüfter Track-Core-Korridor; sanftes Einfangen und Führen über 3D-Frames, begrenzte Lenk-/Drift-/Boost-Eingriffe; sichere Freigabe und Landung; Rollercoaster ist stärkste Ausprägung der Führung, keine zweite Physik-Engine |

**Eingriff statt Zuschauerfahrt:** Spieler soll weiter lenken, seitlich korrigieren, ggf. Boost-/Stunt-Timing beeinflussen; kontrollierte Rückgabe der freien Steuerung. Nicht heimlich auf einen Spline zwingen. Ein Abbruchwunsch ist sofort erkennbar; physischer Übergang aus Looping/Inversion erfolgt über eine sichere Recovery-/Release-Sequenz statt Sprung in unhaltbare Lage. Abbruch- und Eingabe-Gates müssen erst getestet werden.

## 3. Ride-Kompositor: modulare Stunt-Grammatik

**Phasen eines kleinen Rides:**
1. **LAUNCH:** Ziel-/Route-Commit, kurzer Navigationscomputer-/Booster-Cue; Route muss vor Start validiert und der Startkorridor bereit sein.
2. **FLOW CONNECTOR:** Gerade oder großzügige Kurven, lesbare Richtung, Landschafts-Parallaxe, ansteigende Geschwindigkeit.
3. **SPECTACLE CORE:** nach geeigneter Zufahrtsstrecke ein bewusst gewähltes Major-Element (z. B. Looping) und optional kleine Sekundärbeats.
4. **RE-ENTRY:** Kurve, Tunnel-Ausfahrt oder Sinkflug; Umgebung und Ziel werden erkennbar, Tempo und Orientierung angepasst.
5. **ARRIVAL:** optionaler abschließender Rampensprung/kurzer Glide auf die Zielinsel, sichere Ausrichtung und Landung nahe einem echten Zielanker, anschließende freie Fahrt/Questbegegnung.

**Vorhandene Modul-Familien zuerst isoliert prüfen:** STRAIGHT/Rise, CURVE_EASE/Bank, SPIRAL, LOOP, KICKER/AIR/LANDING, Tunnel/Bridge/Connector bzw. deren reale API-/Version-Entsprechungen im aktuellen Track Core. Namen in älteren Donoren sind **kein Nachweis aktueller Kompilierbarkeit**. Das Stunt-Race-Projekt enthält zudem RKIT-08/09-Stunt-Kandidaten (Loop/Magnet/Skyramp/Bounce), bisher ohne Stunt-PASS. Alle müssen zuerst als reale Originalobjekte in Isolation gezeigt und durch den existierenden Core geprüft werden.

**Kompositionsregeln (Vorschlag, nicht Implementierung):**
- Erst eine **gültige einfache Basiskurve** zwischen zwei verifizierten Ankern, dann optional Stuntbeats in geeignete Intervalle einsetzen; bestehende Anschluss-/Socket-/Frame-Regeln nicht umgehen.
- Kandidaten nach **Geometrie-/Kollisions-/Kamera-/Landekorridor**, sichtbarer Lesbarkeit, Fahrtzeit, Terrain-/Landmarken-Passung, Skin-Wechseln, Rhythmus und Budget bewerten. Kein Überbauen des Start-/Zielbereichs.
- Vor Looping genug gerader/ruhiger Anlauf und freie 3D-Hülle (auch für Fahrzeug + Kamera). Inversionen benötigen **stabile 3D-Frames**, nicht einen World-Up-Frame, der bei senkrechter Tangente degeneriert. Track-Core-/Stunt-Lab-T3/T4-Donor zuerst verifizieren.
- Rampensprung nahe Ziel **nur bei nachgewiesener Landefläche, freiem Flugkorridor und Recovery**; ansonsten einfacher weicher Anflug. Kein verpflichtender Sprung auf jedes Diorama.
- Kein Voll-Zufall: **Seed + Ausgangs-/Zielanker + gültiger Modulpool + getestete Grenzen** ergeben reproduzierbares RideRecipe mit festen Modul-IDs. Kleine Variation nur in Scenery/Rhythmus, nie ungetestete neue Fahrbahn-/Kollisionsgeometrie.
- Für kurze Wege kann der beste Ride bloß ein Speed-Flow mit schöner Zielkurve sein; lange Wege dürfen ein Major- und ein bis zwei Mid-Beats verwenden (Tuning-Hypothese, kein fixer Algorithmus).

## 4. Sichtbare Track-Varianten & Rollercoaster-v13-Donor

- **Classic Joyride/Race** für Loopings, Rampen und erkennbare Fahrbahn: bestehende schieferblaue/orange Joyride-Designsprache nach V-010/V-102; keine Ersatz-Branding/Platzhalter-UI.
- **Hyper-Rail** als schmalere sichtbare Schienen-/Trägerlogik entlang **derselben kanonischen Route und Stunt-Frames**. Cartoon-Pseudophysik darf die Schleifen als Energie-/Fluff-/Warp-Konditionierung motivieren; keine langatmige UI-Erklärung nötig.
- **Warp-Tunnel** als segmentweise visuelle Umhüllung. Er kann Scenery-Komplexität reduzieren und Zielumgebung laden helfen, besitzt aber nicht selbst die Bewegung oder eine neue Terrain-Authority.
- **Invisible Guidance** nur für geeignete freie Gelände-/Schwebeabschnitte; harte unsichtbare Kollisionsflächen vermeiden.
- **Mixed Ride** bevorzugt: offene Landschaft → sichtbarer Loop/Hyper-Rail → kurzer Warp-Tunnel → offener Inselanflug.
- Georg nennt ausdrücklich **Rollercoaster v13** mit klassischen Schienen als potentiellen Donor. **Originalobjekt/Pfad und erlaubte konkrete Wiederverwendung sind noch NICHT source-isoliert verifiziert**; WS0/WS1 muss die tatsächliche Version und reale Schiene separat zeigen, bevor irgendetwas übernommen wird. Kein erfundener neuer Donor.

## 5. Navigation und Vorbereitung

- Zielwahl durch bestehende **taktische Karte/Minimap/Quest-/POI-/Deck-Referenz**. Bereits geplante HUD-Zielrichtung nach V-333/334 weiterverwenden; **kein zweiter Kompass, Quest-, Karten- oder Portal-Owner**.
- Bordcomputerzustände: **TARGET_SELECTED → PLANNING → VALIDATING → READY → CAPTURE → RIDE → RELEASE/ARRIVAL**; bei ungültiger Route **FAILED / FREE_DRIVE_FALLBACK**. Vor READY weder „Route steht“ noch teleportierende Phantomgeometrie melden.
- Route vor Bewegung kurz validieren; bei längeren Routen nur sichere, vorwärts gestreamte Chunks vorhalten. Priorität: *Collider-/Terrain-/Landesicherheit vor Scenery*. Sichtbarer Warp-Tunnel kann den Übergang zwischen voneinander getrennten, freigeschalteten Weltzonen dramaturgisch kaschieren, **nicht** automatisch globale Topologie-/Portalentscheidungen aus V-289 treffen.
- Zielentfernung ehrlich darstellen (Luftlinie versus Ride-Distanz). Kein erfundener ETA vor gültiger Route.
- Die bestehenden Guided-Stunt-Zustände **free → capture → commit → release → recover** sind Quelle für sanftes Einfangen, Führung und sichere Freigabe. Keine globale Magnetbahn, kein erzwungenes Steering gegen den Spieler. Normale Fahrt bleibt ohne Track möglich.

## 6. Performance & KISS

- **Keine zweite Fahr-/Kamera-/Audio-/Physik-Runtime.** WS1 bleibt der einzige Integrator und Simulations-Owner. K2B nicht als unveränderlichen Weltflug-Controller missverstehen; Terrain-/Führungsadapter sind noch zu beweisen.
- Original-Track-Core-Compiler (RouteRecipe/Graph, 3D-Frames, Sockets, Geometrie/Contact) wiederverwenden; keine unabhängigen Blender-Sweep-Meshes als Fahrbahn-Authority. Track-Gizmos bleiben Authoring über native Rezeptfelder (Race Draft PR #43, bislang Planung).
- Sichtbare Nähe: gezielte **Parallaxe/Stakkato-Objekte** (V-172/V-175) aus registrierten Scenery-Donoren; Instancing/LOD, deterministische Scatter-Seeds und gepoolte FX. Keine massenhafte physische Kollisionsbeteiligung kleiner Dekoelemente.
- **VFX V1 (V-357) wiederverwenden:** kfb-flight-vfx.js, existing speedlines, trails, no new light-per-effect; bestehender AudioContext. Beim Warp schneller wirkende Umwelt/Kamera/Audio statt beliebiger realer Geschwindigkeit.
- Geplante Lade-/Geometrie-/VFX-Budgets und 60-fps-Orientierung sind **zu messen**, nicht pauschal behaupten. Bei Überlast fällt der Generator auf einfachere Route / weniger Scenery / Tunnel-Maske zurück; **niemals** auf unsichere Kollisionen.
- Optische Cartoon-Squash/Stretch-Effekte verändern nicht die kanonische Fahrzeug-Kontaktpose.

## 7. MVP-/R1-Proof – klein, reversibel, ohne neue Welt

**Empfohlene kleine erste Probe, *nach* freier M2-K2B-Grundfahrt:**
- Ein *existierender*, prüfbarer Start- und Zielanker in bekannter Geländeumgebung, kein vollständiges Welt-Navigationssystem.
- 1 gerader Flow Connector + 1 sanfte Kurve + **1 Major-Stunt (vorzugsweise vorhandener LOOP; falls kein verifizierter Loop, vorhandener Rampen-/Sprung-Donor)** + geprüfter Arrival-Abschnitt. Ungefähr 15–35 s Fahrt als **Gestaltungshypothese**, keine festgesetzte Produktionsvorgabe.
- Gleiche kanonische Route als **sichtbarer Joyride-/Hyper-Rail-Skin** und als **Warp-Tunnel-Skin** zeigen; optional unsichtbare Führung auf einem schwebenden Verbindungsstück.
- Reale K2B-Fahr-/Input-Übergabe zu vorhandener Guided-Stunt-Assistenz, Spieler lenkt/boostet begrenzt weiter und kann einen sicheren Release anfordern; bei Fehlschlag bleibt die freie Fahrt verfügbar.
- Messbarer Replay für Start, Loop-/Stunt-Commit, Tunnel/Clipping, Abbruch, Landung, Rückgabe der Steuerung, Zielanker; Profil für Framezeit/Chunk-/Collider-/VFX-Last; feste Route/Seed-Kombination. Kein menschlicher PASS aus einer bloßen generierten Animation.
- Vor Integration: **originales Track-/Loop-/Rollercoaster-Donorobjekt isoliert** mit identifizierter Quellenrevision sichtbar zeigen, dann dieselbe Geometrie im WS1-Empfänger unter deren einem Movement-/Camera-Owner.

**Nicht Teil R1:** vollgenerierte Open World, 130+ Deck-Ziele, vollständige Map-/Quest-Navigation, neue Stunt-Mesh-Familien, freie 6DoF-Simulation, Wettkampfregeln, Waffen, Fahrzeug-Menüs, autonome neue Rollercoaster-Engine, Merge, öffentliches Deployment.

## 8. Source-first Register / bestehende Owner

**Autoritative Vorlagen (GitHub lesen, nicht ersetzen):**
- WS0-Architektur / V-228: [ARCHITECTURE_R1.md](../ARCHITECTURE_R1.md); [DECISIONS.md](../DECISIONS.md) mit **V-288/289/290, V-333/334, V-347/351/352/357** und **V-172/175**.
- M2-Ground-Fahren: [BRIEF_WS1_M2_FAHREN_R1.md](BRIEF_WS1_M2_FAHREN_R1.md), [WS0_TO_WS1.md](WS0_TO_WS1.md); noch mit älterer Engine-Vergleichsanweisung.
- Stunt-Donor-Inventar: [STUNT_DONOR_MAP_R1.md](STUNT_DONOR_MAP_R1.md) (insbesondere K2B-ASSIST, v0.8, P2 free/capture/commit/release/recover, RKIT-08/09).
- KFB Road/Track Ownership Canon: [KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md](../../../../../../skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md) – bei relativer Link-Reichweite Repo-Pfad direkt nutzen.
- Race-Living/Recovery: [georg-doc/KFB-Stunt-Car-Race – RECOVERY](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/main/RECOVERY.md), [Stunt Race Track Lab](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/main/ChatGPT_web/track-lab/LIVING_MASTERPLAN.md).
- Gizmo-Pilot nur Planung: [Race Draft PR #43](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/43) – existierende Track-Core-Radius/Rise/Bank-Authoring-Idee, nicht implementiert.
- Rollercoaster v13: **donor source/path pending**; keine Implementations- oder Lizenzbehauptung aus dem Namen.
- Externe Motivationsreferenz, **nicht Codequelle**: [Fuse Games – Feel the Speed](https://fusegames.com/news/feel-the-speed-game-feel-in-star-wars-galactic-racer).

**Owner-Grenzen:** WS0 = Register/Entscheidung/Planungsauftrag; World/Quest/Map = Zielabsicht und legitime Ziele; Track Core = RouteRecipe, Stunt-Bausteine und kanonische Track-Geometrie/Frames; WS1 = einziger Fahrzeug-, Input-, Bewegungs-, Kamera- und Runtime-Integrator; bestehende VFX-/Audio-Owner bleiben Konsumenten. Ein Track-/Gizmo-Lab ersetzt keinen dieser Owner. Keine Auto-Merges/Live.

## 9. Offenes und genau ein nächstes Gate

**Offen:** K2B-Wahl ist Georgs aktuelle Bestätigung, aber V-290/V-347 im Register noch als Vergleich formuliert; freier K2B-Terrain-/Hover-Adapter noch nicht abgenommen; Track-Core-Loop-/Air-/Landing-APIs und Rollercoaster-v13-Objekt noch nicht isoliert; 3D-Frames, safe release, Welt-/Zielauflösung und Performance nicht bewiesen.

**EIN NÄCHSTES GATE: WS0_WARP_RIDE_INTAKE_AND_PILOT_ASSIGNMENT.** WS0 (1) registriert Georgs aktuelle K2B-Vorrangentscheidung konsistent gegen V-290/V-347, (2) übernimmt die optionale Spektakel-Route als Plan nach M2 statt einen neuen M2-Blocker zu erzeugen, und (3) schreibt **einen** source-first Pilotauftrag: vorhandenes echtes Track-Core-Stuntstück isolieren → genau eine RouteRecipe-zu-Guided-Ride-Fahrt in WS1 beweisen → unabhängige technische Messungen und erst dann Georgs Fahrgefühl-Urteil. Keine sofortige Gizmo-, World-Generator-, Portal- oder Live-Aufgabe.

---
*Read-only Planning-Intake. Keine Runtime, kein CI-/Browser-Test, keine neue V-Nummer, kein Stage/Site. GitHub-Intake ist nicht gleich WS0-Registrierung oder WS1-Implementierung.*
