# KFB MVP-Slice „Drive Loop“ R1 · Plan

Status: **ABGELÖST durch `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` (2026-10-09)** · vorher: PLAN · Georg-Richtung 2026-10-08 (nachts) · Bau erst nach Georgs Session-Reset, Stufe für Stufe
Heimat: **KFB Island Worldbuilder Lab** (lokal). Zielplattform später eine GPT-Site, gebaut per Work-Job. GitHub bleibt SSOT-Hub.

## 1 · Ziel in einem Satz

Georg fährt mit einem Retro-Auto oder mit FrizzleBob im Cabrio auf einer Ringstraße um die große Insel **KFB Town**. Mindestens drei Bewohner der Zukunftswelten sprechen (Voice-Layer). Über Auf- und Abfahrten erreicht er drei Satelliten-Inseln, **Dystopia, Utopia und Protopia**, in unterschiedlichen Höhen. Die Verbindungsstrecken haben Rennstrecken-Stücke (Looping, Rampensprung), dazu läuft das volle Audio-Bett. Der Worldbuilder-Modus bleibt erhalten.

## 2 · Welt-Anordnung

| Teil | Inhalt | Geschichte (Quelle) |
| --- | --- | --- |
| **KFB Town** (größte Insel, Mitte) | Ein **leicht erhöhtes Plateau** mit **Ton-Treppe** in sichtbarer Knetstein-Mauerlogik, wie bei der Pyramide. Oben eine Burg oder ein **großer cartoonig deformierter Turm**, auf dem der helle Paladin mit Krone steht (King Kayfabian). Vor dem Tor hält der **Dark Knight** Wache, mit Schild und Schwert oder Breitschwert, Wach-Idle. Auf dem Marktplatz als Mittelpunkt der **jonglierende Clown**, ein Gemüsestand, an dem die Farmersfrau Möhren verkauft, ein bis zwei **Signature-Gebäude** neben der Landmarke als halb offene Raumszenen (aus Restaurant, Bakery, Cozy Living Room oder Dungeon-Teilen je nach Thema). Insgesamt **spärlich**: Zaunecken statt Umzäunung, Rule of Three, Comic-Closure. Dazu Driver mit Taxi. **Ringstraße außen an der Inselkante**, die die Stadt umrundet und nicht zerschneidet. Auffahrten zu den drei Satelliten. | `docs/story/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` §3: historischer Hub, sechs Biografie-Schritte, Fluff-Genesis |
| **Dystopia** | „Anatomy of a Trap“: dunkle zerklüftete Berge, Pentagramm, Demon Lord auf dem Thron, Performance-Welt | Recovery §4, Deck `docs/decks/ignore_dystopia.json` |
| **Utopia** | „Forget Utopia“: Industrial City mit Makerspace, Roboter, CEO-Situation, Terms & Conditions | Recovery §5, Deck `forget_utopia.json` |
| **Protopia** | „Protopia Sketchbook“: Reparatur, Farmer, Werkstatt, Alltag | Recovery §6, Deck `embrace_protopia.json` |
| **Zwischenräume** | **Mehr Rennstrecken-Stücke ausdrücklich erwünscht (Georg):** Looping, Rampensprung, Steilkurven, Tunnel und weitere Stunt-Teile aus dem Katalog zwischen den Inseln, als Test für Physik und Fahrgefühl | Track Core / RKIT-Katalog (RACE_W) |

**Gestaltungs-Leitlinie (Georg):** wenig, aber stimmig, wie eine Filmszene, zu der man sofort eine emotionale Beziehung hat („Wie ist es dazu gekommen? Wer angelt da? Wer hat da gecampt?“). Jede Insel ist sofort als eigene Welt erkennbar, wie in den 8 Demo-Inseln (Benchmark), sogar etwas sparsamer als diese. Keine Detailkataloge. Bewohner wie die Hiker auch in freier Wildbahn. Sparsam ist zugleich gut für die Renderzeit.
**KFB-Mauerwerk-Familie A (Georg: YES):** Bordsteine, Mauern, Treppen, Plateau, Brücken und Pyramide teilen eine cartoonige Knetstein-Familie. Auch der **Brick-Fish** (Design, Blender MCP Mac mini) wird damit gestaltet, mit abgerundeten Flossenspitzen. **Besitzer: RKIT** (baut in Blender); das Lab und andere Slices setzen die Teile ein.

**Leitplanken aus der Recovery:**
- §3.2: Die Ringstraße darf die Stadt umrunden, aber nicht zerschneiden; keine Sackgassen ohne Grund.
- §3.5 / C4: Die Burg ist eine Landmarke. Die *ganze* Stadt aus KayKit-Medieval bzw. Hex zu bauen ist abgelehnt (R4). Die Formensprache der Stadt wählt Georg.
- C2: keine Einheitsformel je Insel; jede Geografie folgt ihrer Geschichte.

Die Inselformen kommen aus Deck + Vorlage: die 8 StreakByte-Demo-Szenen (`/demo-scenes.html`) bzw. die Lab-Beispielinseln.

## 3 · Fahren

- **Fahrzeuge:** Retro Cartoon Cars (Cicada, Cruiser, Carrier) und das **J17-Cabrio mit FrizzleBob**.
- **Bekannter Fehler:** FrizzleBob dreht sich im Cabrio um die eigene Achse. Ursache vermutlich die Sitz-Schicht bzw. der Elternbezug in J17 („Vehicle-Seat-Schicht“, Owner-Frage aus J17 START_HERE). Er muss vor Stufe 2 behoben sein, für FB und die anderen KayKit-Figuren.
- **Später:** Cartoon-Cabrios durch Dach-Wegschneiden an weiteren Modellen.
- **Maßstab K2:** Weltautos sind 6 lang. **RACE_W freigegeben (Georg, 2026-10-08):** Rennstrecken auf den Inseln mit Rennprofil × 1,46, damit dieselben Weltautos überall fahren. Joyride-RACE bleibt unverändert daneben.
- **Geschwindigkeitsgefühl (Georg, präzisiert):** nicht verkopft, sondern Pattern, die zum Track-Design passen.
  - Grundlage ist der Joyride-Look: rote Banden, orange Fahrbahn. Dieses Racetrack-Design ist durchgängig; Ränder und Banden passen sich der Palette des Bioms an.
  - Rand-Elemente: hohe, lange, säulenartige oder surreale Strukturen in Rhythmik, wie Leitpfosten an der Autobahn, aber ohne Beschriftung und enger gestaffelt.
  - Sie bauen sich weich auf und ab wie eine geschwungene Brücke, statt plötzlich als Stäbe dazustehen.
  - Dramaturgisch nur dort, wo sie wirken, nicht die ganze Strecke als Staccato.
  - Ein **Pattern-Baustein** wie die Stunt-Elemente, halbautomatisch gesetzt, mit austauschbarem Pfahl (Laterne, im Winter Zuckerstange). Erst einmal basic.
  - **Tunnel** wie in Joyride gehören dazu. **Im MVP mindestens ein befahrbarer Showcase-Tunnel:**
    - durch das Protopia-Gebirge, im Racetrack-Design oder aus Mauerwerk-Familie A, je nachdem, was besser passt;
    - in Dystopia eher als Dungeon-artiger Mauertunnel.
  - Besitzer: RKIT.
- **Protopia als Berg-Insel:** ein großer Berg ohne normale Anhöhe, mit einer Schlucht- und Lichtungssituation im Gebirge und einem erhöhten Plateau. Test, wie ein Anschlusstrack dort hineinkommt (Tunnel, Einschnitt).

## 3b · Kamera (Georg, 2026-10-09)

Drei Ebenen, ohne Nachlaufen und ohne ins Mesh zu laufen:

1. **Spiel-Kamera (Third Person):**
   - Folgt der Figur bzw. dem Fahrzeug. Frei drehen und zoomen, auch um die Figur herum, um sie von vorne zu sehen, **ohne** dass sich die Figur mitdreht.
   - Umschaltbar auf „gesperrt“: Die Kamera folgt fest hinter der Figur.
   - Vorbild ist Joyride (Kamera-Abstand nach Fahrzeuglänge, J09/J10).
2. **God Mode / freie Orbit-Kamera:**
   - Jederzeit wählbar, Zoom zum Cursor (in eine Szene gezielt hineinzoomen), kurze Dämpfung ohne Nachlaufen.
   - Im Lab schon umgesetzt: `zoomToCursor`, `dampingFactor` 0,25.
3. **Verdeckung (Blocking), wenn etwas zwischen Kamera und Figur steht:**
   - Der Kamera-Arm verkürzt sich bei Verdeckung, nie unter 70 %, er hebt die Kamera nicht an (Regel aus dem Seed-World-POC).
   - Was danach noch verdeckt, wird als **Sicht-Loch** ausgeschnitten: ein Portal-Look um die Figur, Dither bzw. Screen-Space-Kreis im Shader, mit weichem Knetrand passend zu `kfbBlend`.
   - Die Kamera darf nie in ein Mesh fahren (Kollisions-Kugel um die Kamera).
   - Der Ansatz aus dem letzten MVP-Fail (R4) war richtig, aber verbuggt (Kamera lief ins Mesh, Kritiker-Score blieb ungenügend). Vor dem Bau dessen Return lesen und die Fehler als Negativ-Vorlage nehmen.

Harte Regeln in Stufe 2: 0 Frames mit Kamera im Mesh (Test-Fahrt und Test-Lauf), Figur immer sichtbar (Sicht-Loch oder Arm), kein Nachlaufen > 0,15 s nach Loslassen, Figur dreht sich bei freiem Kamera-Orbit nicht mit.

## 4 · Architektur und Besitzer (keine zweite Wahrheit)

| Baustein | Besitzer | Quelle |
| --- | --- | --- |
| Inselgelände (Höhe, Masken, `kfbLayer`, Viertelkreis-Kante, Scholle v7) | Lab | Claude Design Island Kit R2 · BAUANLEITUNG |
| Wasser | Lab (fluid.js) | Island Kit R2, F0–F2 PASS |
| Straßen, Übergänge, Brücken, Rennstücke | RKIT / Track Core | Konzept v3, Bauweise-Blatt, `kfb.road-bed/1` |
| Fahren, Kamera, Sitz | Joyride (Donor) + gemeinsames Orbit-Kamera-Modul | J17 / J10, Seed-World-Kamera-Regel, R4-Return als Negativ-Vorlage |
| Natur, Erdung | Environment | Regelwerk Environment, Bauweise Erdung |
| Gebäude, Landmarken | Lab-Katalog (K2) | Maßstab-Audit, Tür-Regel |
| Billboards | Billboard-Modul (bestehende Branches) | ein Billboard je Insel, zuerst statisch, später Hypernormalization-Loops |
| Audio-Bett | bestehender KFB-Audio-Owner | Cozy Tunes (`media/3D_Assets/Sounds/…`), Motor, Umgebung |
| Bewohner | **jetzt Teil des MVP** (wegen Voice) | Resident Atlas + Eye-Rig, Motion Forge (Tisch-Activities #376). Blender MCP: Clown-Jonglage neu (Keulen gehen heute durch den Körper, Arme bewegen sich nicht), Wach-Idle Dark Knight, Verkaufs-Idle Farmersfrau |
| HUD | Racer-HUD als Donor, umgebaut im Claymation-Standard-Stil; Design vorab durch Claude Design (`deliveries/BRIEF_CLAUDE_DESIGN_HUD_FLIGHT_R1.md`) | je Reisemodus: Tacho beim Fahren, Flug-Anzeige (Geschwindigkeit, Höhe, Schub) im Flugmodus, beim Gehen kein Tacho; Radio diegetisch (eigene Songs über Radio-Knöpfe, wie im Racer); **Fluff-Score** dezent als Währung und Score (Aufsammeln von Fluff-Kügelchen) |
| Curtain | bestehendes Curtain-Modul (`KFB_THEATRE_CURTAIN_RECOVERY_CLAUDE_DESIGN_2026-10-07`, Modul-Vertrag) | **im MVP so, wie es ist** (Character Select bzw. Übergang); Claymation-Restyle später durch Claude Design (`deliveries/BRIEF_CLAUDE_DESIGN_CURTAIN_CLAY_R1.md`), nur Stilwechsel |
| Voice | ChatterBox Voice Layer (PR #379, S0 18/18, S1 13/13, 166 Voice-Records) | `skills/chat/KFB_NEXT_RUNTIME_MVP_VOICE_ACCEPTANCE_2026-10-08.md` auf `main` |

## 5 · Stufen und Abnahmen

Jede Stufe hat dieselbe Abnahme: harte Regeln automatisch → blinder Kritiker (inklusive Weltlogik) → erst dann Georg. Stopp nach 2 erfolglosen Reparaturen; ein Kriterium unter 4 heißt zurück zum Konzept.

| Stufe | Ergebnis | Harte Regeln (Auszug) | Georg sieht |
| --- | --- | --- | --- |
| **1 Grundlage** | R2D-Basis im Lab: eine Insel mit Viertelkreis-Kante, Knetflecken, Scholle v7, Maßstab K2, Gebäude-Katalog umgestellt | keine Farbverläufe; Tür ≥ 1,15 H; Budget laut Profiler | eine Insel aus 4 Kameras |
| **2 Ring** | KFB Town in K2-Größe mit Ringstraße an der Kante und einer Auffahrt zu einem Satelliten (Steinbogen-Brücke). Fahren mit Retro-Auto **und** Cabrio-FB, ohne Drehfehler | T1/T2 neu (Schürze), Steigung ≤ 8 %, kein Gelände auf der Straße | eine Runde um Town + Auffahrt, Video |
| **3 Loop** | Drei Satelliten nach Deck und Vorlage, Verbindungen mit Rennstücken (Looping, Sprung), Rand-Rhythmus, Landmarken + Billboard je Insel | Katalog vollständig, kein direkter Highway-Stadt-Wechsel, Erdung je Objektart | komplette Fahrt durch alle 4 Inseln |
| **4 Klang, Stimmen, Gefühl** | Audio-Bett, **HUD** (Fahren: Radio, Fluff-Score, Tacho; Fliegen: Flug-Anzeige; dezent, Claymation-Stil), **Flugmodus** (Doppel-Leertaste, wenn ein Jetpack geschenkt wurde, mit Speedlines und Wind-VFX aus Travel Globe bzw. Tiny Skies und Schub-Effekt am Jetpack), **Voice:** mindestens 3 sprechende Bewohner (Dystopia: Demon Lord, Utopia: Robot One, Protopia: Farmer A bzw. Farmer-Duo, optional Lorekeeper), ein Golden-Journey-Social-Call mit kuratiertem Voice-Asset (BONGO beim Utopia-CEO, BINGO bei den Farmers, optional BOGGLE beim Lorekeeper). Licht und Himmel, Performance, Worldbuilder-Modus intakt | Bubble und Text funktionieren auch stumm; Stille bleibt gültig; Ducking im KFB-Audio; Whole bzw. Fragment und Browser-Fallback nachweisbar; kein zweiter AudioContext, Mixer oder Dialog-Owner; Frame-Budget | Gesamterlebnis |

## 6 · Vorlagen je Stufe (statt halbgarer Briefings)

Jeder Bauauftrag zeigt nur auf diese Dateien und sagt, was zusammengesetzt und woran gemessen wird:

- **Grundlage:**
  - `donors/kfb-island-kit-r2-2026-10-08/BAUANLEITUNG.md`
  - `docs/SCALE_CONTRACT_K2.md`
  - `docs/SCALE_AUDIT_R1.md`
- **Regeln:**
  - `docs/QA_RULEBOOK_ENVIRONMENT_R1.md`
  - `docs/QA_RULEBOOK_TRANSITIONS_R1.md` (beide mit §00 Weltlogik)
  - `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`
- **Straße:** RKIT-Konzept v3 + Bauweise-Blatt v2 (Artifacts) und `kfb.road-bed/1` (`public/roadbeds/`).
- **Natur:**
  - `docs/SPEC_ENVIRONMENT_KIT_R1.md`
  - `docs/SPEC_PLACEMENT_GRAMMAR_R1.md`
  - Bauweise Erdung, Farb-Grammatik (`ENV_ROLES`)
- **Geschichte:**
  - `docs/story/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`
  - `docs/decks/*.json`
  - `docs/ENV_ERZAEHLRASTER_R1.md`
- **Vorlagen:** `/demo-scenes.html` (8 StreakByte-Szenen) und `KFB Claymation Reference/`.

## 6a · Backlog (nicht MVP, aber festgehalten)

- **Backpack:** Geschenk eines NPC (z. B. Combat Mech), mit BINGO angenommen und per Animation in den Backpack-Slot gelegt.
  - Skins: Teenie-Backpack (Protagonist A/B), Survivalist-Backpack, Gimmick-Säckchen.
  - 20 Slots als Overlay (Design offen) für Props, Songs und Dance-Moves; gespeichert im fraktalen Almanach / Memory.
  - Musiksammlung als **Tape-Deck** in einem Slot statt eines Slots je Song, Steuerung über die diegetischen Radio-Knöpfe. Beispiel: Song gesammelt, weil man der Orc-Band in Dystopia zugehört hat.
- **Reisemodi ausbauen:** Der Flugmodus ist jetzt im MVP (Basis). Später kommen ausgefeilte Schub- und Flug-Animationen am Combat-Mech-Jetpack (Blender MCP), weitere Antriebe und ein Cockpit-artiges HUD in voller Ausbaustufe.
- **Brick-Fish** in Mauerwerk-Familie A (Blender MCP).

## 6b · Reihenfolge mit den laufenden Slices

- **Four-Island A/B** (visuell, Claude Design): Georg wählt A oder B. Die Satelliten in Stufe 3 folgen dieser Wahl.
- **Voice:** Georgs Hörentscheid (2026-10-08): **alle Stimmen KEEP**, den Figuren zuordnen. Danach werden kanonische Zeilen gerendert; der Runtime-Consumer folgt in Stufe 4.

## 7 · Offene Entscheidungen (Georg)

1. **Landmarke von KFB Town:** Burg (Hex-Burg eher schwach) oder großer cartoonig deformierter Turm mit Paladin oben. Signature-Gebäude als halb offene Räume aus Restaurant-, Bakery-, Living-Room- bzw. Dungeon-Teilen; keine generische Mittelalterstadt.
2. **Inselgrößen in MacroCells:** Vorschlag Town etwa 40 × 40 MC (≈ 256), Satelliten 20–28 MC, weil Ringstraße und Auffahrten Platz brauchen.
3. ~~RACE_W~~ freigegeben.
4. **Sitz-Schicht** (J17-Frage): Owner ToolBox oder Joyride.
5. **Privates GitHub-Repo** für Assets mit eingeschränkter Lizenz (Cozy Tunes, StreakByte usw.), mit Zugriff für Coworker und Claude Design. Hintergrund, nicht MVP-kritisch.
