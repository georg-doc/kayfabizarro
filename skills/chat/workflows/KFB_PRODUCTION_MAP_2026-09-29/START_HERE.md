# KFB · Produktionskarte 2026-09-29 · Claude Design zuerst

Status: **PLAN / AUSFÜHRBARE DESIGN-BRIEFS**, nicht Implementierungs-PASS. Owner: Georg. Branch: `codex/kfb-production-map-2026-09-29`. Die freigegebene KFB Production Control Site spiegelt diese Karte als Arbeitsoberfläche; dieser öffentliche GitHub-Text ist der für Claude Design abrufbare Handoff. Jede Ausführung prüft vorab den aktuellen GitHub-Stand nach `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` und `FRESH_CHAT_SLICE_PROTOCOL.md`. Kein automatischer Merge/Live.

## Verbindlicher Webchat-Modus · Site-first, keine Deploy-Schleife

Für ChatGPT-Webchats gilt ab 30.09. innerhalb dieser Produktionskarte:

1. Zu Beginn die KFB Production Control Site öffnen und **`kfb_web_read`** benutzen.
2. Im Chat beziehungsweise dessen eigener Preview arbeiten. Kein GitHub-Commit, PR, Cloudflare-Deploy, Hub-Update oder Stage-Routen-Test während der Arbeitsiteration.
3. Nach einem echten Ergebnis **`kfb_web_checkpoint`** benutzen. `kind` ist `WIP_CHECKPOINT`, `DECISION`, `TEST_RESULT` oder `READY_FOR_INTEGRATION`; `workflow` trägt die Slice-ID. Body/JSON enthalten Ergebnis, offene Punkte und genau den nächsten Schritt.
4. Dateien/ZIPs werden einmal in der Production Inbox hochgeladen und nur über Receipt/Metadaten referenziert; kein Base64- oder Datei-für-Datei-GitHub-Stunt.
5. Nur ein `READY_FOR_INTEGRATION`-Checkpoint beauftragt später Codex/Work mit **einem** gebündelten GitHub-Checkpoint. Stage/Cloudflare erst, wenn ein spielbarer integrierter Meilenstein ausdrücklich eine öffentliche Probe braucht.
6. Fehlt ein erwartetes Site-Tool, STOP mit `SITE_TOOL_MISSING`; nicht selbstständig auf GitHub/Cloudflare ausweichen.

Die Site ist Arbeits-/Zwischenspeicher. GitHub bleibt Code- und Archiv-SSOT **nach** dem Integrations-Gate. Claude Design kann die privaten Site-Werkzeuge weiterhin nicht vorausgesetzt bekommen und erhält deshalb die öffentliche GitHub-Briefingfassung oder einen hochgeladenen Session Cut.
## Wahrheit vor Planung

- **K1/H0 ist das visuelle Gold**, nicht R0A. Erst echter KayKit-Donor, dann pro Haus `clayify` + `clay-soften.v1`, Material/K2-Oberfläche, Fußkontakt, erst danach freigegebene Biegung. Quelle: [K1/H0-Router](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/docs/CLAYMATION_K1_H0_REFERENCE.md); [Façade-Gold-Kandidat PR #295](https://github.com/georg-doc/kayfabizarro/pull/295). PR #295 ist **nicht abgenommen**: integrierter Schatten-Browsernachweis fehlgeschlagen. Kein globaler Schatten-PASS.
- **Motion:** [v5-Katalog auf georg-doc-patch-3](https://github.com/georg-doc/kayfabizarro/blob/georg-doc-patch-3/media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json) enthält 345 Clips für Medium/Large und sieben Locomotion-Sets. PR #275 trägt noch einen veralteten v4-Titel; den Katalog lesen, nicht den Titel.
- **Ground:** [Profil-Router PR #294](https://github.com/georg-doc/kayfabizarro/blob/chatgpt-web/kfb-ground-locomotion-profile-consumer-01-2026-09-29/tools/KFB-ToolBox/docs/MOTION_PROFILE_ROUTER.md) ist SOURCE PASS, öffentliche freie Spielprobe offen. `walk-controller` bleibt einziger Ground-Positionsschreiber. KayKit-Creator-Recherche/KCL-M1: [PR #107](https://github.com/georg-doc/kayfabizarro/pull/107) und [Living Research](https://github.com/georg-doc/kayfabizarro/blob/chatgpt-web/kaykit-creator-learning-2026-09-19/tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_LIVING.md). Kontakt/Cadence/Phasen-Sync messen; `Running_B` ist für den konkreten ActionFigure keine automatische Sprint-Wahl.
- **Track:** Joyride Parcours P1 läuft bereits im Claude-Design-Projekt. Das lokale `START_PARCOURS_P1.md` wird durch Brief C unten vollständig wiedergegeben; nicht einen zweiten Track-Owner eröffnen.
- **MapLibre:** [Travel PR #42](https://github.com/georg-doc/KFB-Travel-Globe/pull/42) ist ein Draft-Spike für Karte, DEM-Terrain, Kamera und Tile-Streaming. Die nominelle [Prüfroute](https://kayfabizarro.pages.dev/kfb-hub/stage/maplibre-world-owner-spike-01/) fällt beim Live-Aufruf auf die KayfaBizarro-Startseite zurück (29.09.); sie ist **kein funktionierender Testlink**. Erst echte Prüfseite herstellen, dann Browser-Gate; kein World-Owner-Wechsel.
- **Performance:** World R0A meldete ca. 1,47 Mio. Dreiecke und ca. 6 fps im Design-Preview. Clay City meldete 213–240 Tsd. Dreiecke und 45–68 % weniger Draw Calls gegenüber R6; echte FPS/Ladezeit dort nicht sauber belegt. Das sind verschiedene Szenen/Geräte, kein direkter Siegervergleich.

## Arbeitsreihenfolge und Gate

1. **Jetzt fortsetzen:** Parcours P1 im bestehenden World/Track-Design-Chat: zuerst Inventar und Draufsicht zur Entscheidung. Keine parallele neue Strecke.
2. **Parallel nur in bestehenden getrennten Projekten:** Resident Atlas erhält Brief A-R; ToolBox Production-05 erhält Brief A-T. Beide teilen den K1/H0-Look, nicht die UI/Runtime.
3. **Danach:** Brief B Travel-Mode-Design/State-Proof auf echten Clips/Profilen. Runtime-Adoption bleibt Ground/Race/Travel-Ownern.
4. **Vor mehr Weltvolumen:** Brief D als Design-/Performance-Entscheidung mit realen Vergleichsszenen.
5. **MapLibre Gate:** Brief E nur als A/B-Donor gegen denselben Parcours/Actor; erst nach bestandener Kontakt/Kamera/Performance-Probe darf MapLibre als World-Owner vorgeschlagen werden.
6. Jeder fertige Slice liefert Session Cut/Return mit tatsächlichem Stand, Screenshots, Quellen, offenen Punkten und genau einem nächsten Gate. Ein Design-Preview ist kein spielbarer World-PASS.

## Brief A-R · Resident Atlas · Clay Characters / Diorama (laufenden Chat fortsetzen)

**Ausführer:** bestehender KayKit Resident Atlas S12 Claude Design Desktop Chat, High. **Nicht** ToolBox Production-05.

Lies den K1/H0-Router und dessen exaktes Code-/Bildpaket; verwende echte Figuren/Props und K2-Oberfläche als getrennte Schicht. Übertrage den Knet-Look auf Residents, Props, Weg/Boden und Szene: weiche Silhouette, differenzierte Materialität, sichtbare aber kontrollierte Handarbeit, korrekter Fuß-/Objektkontakt. Behalte vorhandene Graveyard/Dancing-Skeletons-Szenen und Animationen; keine Ersatzfiguren oder flachen Farbfilter. Ein gemeinsamer vollständiger Inline-Editor (Mini-Menü am Objekt, **ein** klappbarer Inspektor, Snap Raster/Anschluss/Halterung) statt doppelter Paletten. Nutze Motion v5 nur für ausgewählte Szenenclips; baue **nicht** die 345-Clip-Library hier. Skydome Basic/TinySkies als schaltbare Vorschau. Der Schattenfix ist offen: zeige Schatten+AO/AO-only/Schatten-only an Boden/Füßen, Props, Bäumen und unter Überhängen; keine Behauptung „global gefixt“ ohne integrierten Beleg. Liefere Vorher/Nachher-Bilder aus identischer Kamera, editierbare Quelle, Session Cut und offene Defekte. Nach zwei Fehlpässen einfrieren/exportieren.

## Brief A-T · ToolBox Production-05 · Clay Character / Animation Studio

**Ausführer:** bestehendes KFB ToolBox Production-05 Claude Design Desktop Projekt, High. **Nicht** Resident Atlas.

Behalte die angenommene Production-05-Shell. Lies K1/H0 und die exakten donor-basierten Character-/Clay-Profile, den v5-Katalog (345 Clips, zwei Rigs, sieben Sets), Motion-Profile-Router und KCL-M1. Eine Mixamo-artige Library mit Such-/Tag-/Set-Filter, animierten Karten und großem Preview; keine großen Statuslabels im 3D-FOV, nur diskrete Statuszeichen. Vollständiger Standard-Inline-Editor statt reduzierter Neu-Erfindung; Editierbarkeit von Namen/Zuordnungen, JSON-Export, FBX/GLB-Drop-Probe mit klar markiertem Konvertierungsstatus. Studio-neutral und echte Clay-Terrain-/Skydome-Vorschau als zwei Ansichten; Charakter, Requisiten, Bodenkontakt und Schatten im selben Knet-Canon. Zeige Walking, Running, Turn, Jump und einen Carry-Set-Übergang mit Fußkontakt/Phasen-Sync; bekannte problematische Clips nicht stillschweigend als PASS markieren. Exportiere Motion-/Choreo-Rezepte für Resident als Datenvertrag; keine Resident-Atlas-UI nachbauen. Liefere Session Cut, getestete Clips/Modelle, Screenshots und offene Fälle.

## Brief B · Travel Modes / States · Design- und Bewegungsproof

**Ausführer:** Claude Design Desktop im bestehenden KFB World/Joyride-Projekt, High; **nach** dem P1-Draufsicht-Gate. Kein neuer Runtime-Owner.

### Verbindliche Klärung 29.09 · Race v0.8, k2/k3 und Actor

- **„Race v0.8“ ist hier keine zusätzliche vierte Physikdatei.** Gemeint sind die übernommenen FLOW-/FEEL-Werte aus KFB Stunt Car Race · Cologne Option C-3. Im Joyride werden sie durch `lab-drive/kfb-drive.k2.js` benutzt. `k2` ergänzt Streckenrahmen, Spurhilfe, Knetbande, Absprung und Landehilfe. Referenz für diesen Proof ist daher **gepinntes k2 mit unveränderten Race-v0.8-FLOW/FEEL-Werten**.
- **`k3` ist ein ungeprüfter J13-Fork** mit verändertem Verhalten an Sprungkanten. J13 bleibt eingefroren; k3 darf nur separat als Kandidat verglichen werden und ersetzt k2 nicht still.
- **Auto ist im P1/J14 ein Track-/Parcours-Modus.** k2 ist streckenparametrisch und kein freier Open-World-Autocontroller. Echtes freies Wenden/Einparken wird hier nicht vorgetäuscht. Für die Fahrschule sind Wendestelle und Parktaschen als Track-Core-Bausteine zulässig; geführte Manöver werden als solche bezeichnet. Eine spätere freie Stadtfahrt braucht einen eigenen, ausdrücklich gerouteten Integrationsentscheid.
- **ActionFigure ist der Mess-/Proof-Actor**, nicht automatisch der endgültige Hero. Vor Auto-PASS Sitzhöhe, Kopf-/Lenkradfreiheit und Maßstab messen.
- **Ein-/Aussteigen:** Cartoon-Schnitt/Clay-Squash verwenden; keine Stuhl-Clips als angeblich echtes Einsteigen. Als ADAPTABLE/PROCEDURAL kennzeichnen.
- **Laufen:** nur auf vom Track Core als begehbar gemeldeten Straßen, Rampen und Plätzen. Looping und Skydrive sind Auto-only. Brücke/Tunnel brauchen getrennte Surface-IDs; kein einfaches Höhenfeld darf die Ebenen verwechseln.
- **Modus-Gates:** Aussteigen nur geparkt, unter 0,5 m/s und auf begehbarer Fläche. Landen nur auf begehbarer Fläche. Ablehnung kurz am Actor anzeigen. Kameraübergabe als eigener State dokumentieren.
- **Flug:** Für `carpet.js` liegt im Designprojekt derzeit kein verifizierter Pfad/Pin vor. Deshalb **keinen Kugel→Ebene-Adapter erfinden**. Für J14 darf der vorhandene Joyride-Q/E-Flug nur als lokaler DESIGN-CANDIDATE die State-/Kameraübergabe zeigen; er wird nicht zum neuen Flight-Owner. Endgültige Travel-Adoption bleibt HOLD, bis der gepinnte Donor vorliegt.
- **Sprint:** 1,3× bleibt Kandidat, bis Tempo, Schrittlänge und Fußkontakt seitlich an der ActionFigure gemessen sind. Andernfalls `UNPROVEN`.

Baue darauf einen kleinen Mode-Switch-Proof auf derselben Strecke: zu Fuß (idle/walk/run/sprint/back/strafe/turn/jump/land), Auto (direkter Mode-Button, Cartoon-Enter/Exit, seated/steer/brake/airborne/land) und lokaler Flug-Candidate (direkter Button, Start/Steigen/Sinken/Landen). Ground-`walk-controller` schreibt ausschließlich Ground-Weltposition. Animiere nach den gemessenen KayKit-/v5-Profilen; Clip-Tempo, Weltgeschwindigkeit und Schrittlänge dürfen nicht auseinanderlaufen. `Running_B` nur bei konkreter Rig-Prüfung. Kein Root-Motion-Doppeltransport.

**Beleg:** Zustandsspuren als JSON pro Probe (Modus, Zustand, Clip, Cliptempo, Weltgeschwindigkeit, Fußrutschen, Surface-/Kontakt-Ereignisse), Bildfolgen vorne/seitlich/3⁄4 und drei 20-Sekunden-Proben. Status maximal **DESIGN PROOF · CANDIDATE**. Die vollständige P1-Runde wird vorher einmal gefahren. Runtime-Promotion in Ground/Race/Travel ist ein späterer separater Integrations-Gate.

## Brief C · Track-Baukasten / Joyride Parcours P1 · laufenden Job präzisieren

**Ausführer:** frischer oder laufender KFB World Design / Joyride Claude Design Chat laut lokalem `START_PARCOURS_P1.md`, High. Nicht neu starten, falls Inventar/Plan bereits läuft.

Aktueller TD03 in `KFB Joyride J05 · Knet-Racer.dc.html` wird zum großen **einen** Straßen-/Race-Parcours: Auf-/Abfahrten, Uni-Center, Tunnel, Fahrschule, Rampen, Hero Jump, Skydrive. Vorher Generator hinter `lab-track/data/td03.stream.json` und `lab-track/stream-to-three.mjs` finden; neuer Stream kommt aus **demselben** Track Core/Generator. `track-look.v5.js`, M2-Markierungen und Übergangsatlas bleiben, ebenso Fahrphysik `lab-drive/kfb-drive.k2.js`, Kameras, VFX und Leicht-Pass. Fassaden und Schatten sind **außer Scope**; ihre bekannten Defekte nicht als gelöst zeigen. Reihenfolge strikt: (1) Baustein-Inventar mit Quelle/Parametern, (2) Draufsicht-Plan zur Wahl, (3) Stream über bestehenden Generator, (4) echte Fahrprobe inkl. Tunnel/Looping/Skydrive. Screenshots vor jeder Übergabe; zwei Fehlpässe = Stop/A-B; keine geratenen Werte. Für den Test genügen vorhandene Joyride-Q/E/Flug-Funktionen; vollständige Travel-Mode-Adoption aus Brief B nicht künstlich als Vorbedingung erfinden.

## Brief D · Performance-Entscheidungsblatt für Georg

**Ausführer:** Claude Design als visuelle Vergleichs-/Budgetstudie, High; keine neue Runtime. Die bestehende [Performance-Seite](https://kfb-production-control.frizzlebob.chatgpt.site/performance) ist nur eine Arbeitshilfe, nicht der Mess-SSOT.

Erstelle **keine Datenkolonnen**. Gleiche Kamera/Route/Actor und drei Ansichten: Design-nah, Normal, älteres Gerät. Variiere jeweils nur einen Kostenblock und notiere Bildgewinn, Laufzeit/Draw Calls/Dreiecke/Startzeit wo tatsächlich messbar, sonst „unbelegt“: (a) OSM Straßenskelett vs volle Gebäude, (b) Terrain grob/fein + Hügel, (c) echte instanzierte KayKit/Kenney/Tiny-Treats-Gruppen mit K1/H0-Look vs viele Einzelobjekte, (d) K2-Nahtextur/Mid/Far, (e) Skydome Basic/TinySkies/Universe, (f) Resident-Loops/Interaktion, (g) statische Card-Billboards vs aktivierte Medien, (h) Partikel/Schatten. Priorität: Fahrbarkeit, Kontakt und erkennbare Weltidentität. Keine generischen Würfel-Häuser als angebliche Lösung. Empfiehl pro Block **behalten / staffeln / nur bei Bedarf / weglassen** samt Low-Device-Fallback, aber nur nach A/B-Beweis. Der Generator muss viele Deck-Welten aus Regeln/Seeds erzeugen; nicht 130 Welten einzeln kuratieren.

## Brief E · MapLibre als möglicher World-Donor, noch kein Wechsel

**Ausführer:** Claude Design für visuelle A/B-Prüfung, High, danach technischer Owner-Review in Travel/World. Ausgang: Travel PR #42. Die nominelle Prüfroute oben ist derzeit kaputt (Router-Fallback), nicht als Probe verwenden.

Zuerst eine tatsächliche öffentliche Prüfseite aus dem Spike herstellen und dann in Isolation testen: lädt der echte ActionFigure, DEM-Boden, stabile Kamera/Depth, WASD/Shift, Kontakt? Den aktuellen Public-Status nicht als PASS ausgeben. Dann dieselbe kurze Route/Actor/geringe Kit-Dichte in zwei Varianten gegenüberstellen: bestehender World/Joyride-Owner und MapLibre als Terrain/Koordinaten/Tile-Streamer. K1/H0/K2-Clay darf als Präsentationsschicht **erst danach** hinzu; ein hübscher Shader beweist keine funktionierende Mobilität. Pro Variante: Startzeit, Frame-Pacing, Draw Calls/Dreiecke, Terrain-Kontakt, Straßeneinpassung, Nah-/Fernbild, Offline-/Tile-Ausfall, ältere Geräte, Lizenz-/Dienstabhängigkeit. Stop, wenn MapLibre den existing Track Core, Race- oder Flight-Movement-Owner verdoppeln müsste. Ergebnis ist eine Entscheidungsnotiz: World-Donor übernehmen / nur Karten- und DEM-Daten nutzen / verwerfen – mit Beleg, kein stiller Owner-Swap.

## Brief F · Combat Arena Clay · spielbar zuerst, Open World danach

**Ausführer:** Claude Design für den visuellen Pass auf der bestehenden Combat Arena; technische Integration anschließend im Owner-Repo `georg-doc/KFB-Combat-Arena`. High. Kein neuer Combat- oder World-Owner.

### Phase F1 · bestehende Arena spielbar im Clay-Look

Arbeite auf dem aktuellen spielbaren Ranged-Loop. Erhalte die bestehenden Besitzer unverändert: Player/Locomotion, Gunfight/Projectile, MobBrain, Damage, Enemy Lifecycle, Rewards und RunFlow. Das Ziel ist kein Combat-Neubau, sondern ein Presentation-Adapter:

- K1/H0-Formensprache und K2-Material-/Reliefprofil auf Actor, Arena, Props und Gegner;
- gemeinsamer Skydome-, Licht- und Schattenvertrag; kein lokaler Schatten-Sonderfix;
- gepoolte, seedbare Knet-Partikel für `muzzle`, `projectile_trail`, `hit`, `land`, `ko/kill`, `reward`, `prop_break` und `explosion`;
- vorhandene Comic-Sterne, Impact-Blasen, Rauch und sonstige Combat-VFX bleiben eine additive zweite Spur statt ersetzt zu werden;
- Normal-, Low- und Legacy-Fallback: weniger Partikel, kürzere Lebenszeit, vereinfachtes Material, reduzierte Schatten – Gameplay und Trefferlesbarkeit bleiben identisch.

**Beleg:** derselbe 60-Sekunden-Loop vor/nach Adapter (Move → Aim → Shoot → Hit → Kill → Reward), identische Treffer-/Reward-Zählung, sichtbare VFX-Events, keine neuen Gameplay-Owner, sowie echte Frame-/Draw-/Geometrie-Messung oder ausdrücklich `UNBELEGT`. Ergebnis maximal `DESIGN CANDIDATE` bis zur Integration im Combat-Repo.

### Phase F2 · Combat-Vertrag in die Open World übernehmen

Nach F1 wird nicht die Arena-Runtime kopiert. Exportiere einen kleinen Adaptervertrag:

- **World besitzt:** Platzierung, Terrain-/Bodenkontakt, Navigation, Streaming, Spawn-Zonen und Weltkamera.
- **Combat besitzt:** Targeting, Projectile beziehungsweise AttackLedger, Trefferfenster, Schaden, Gegner-Lifecycle, Rewards und Combat-Events.
- **Shared Presentation konsumiert:** Actor-/Motion-Profile, Prop-Sockets, Clay-Material und VFX-Rezepte; sie schreibt keine Bewegung und keinen Schaden.

Erster Open-World-Proof bleibt Ranged: ein Spieler, ein Gegner-Cluster, ein Reward, ein klar begrenzter Encounter-Bereich. Melee folgt später. Blender `CHOREO_LAB_01` und Combat PR #7 liefern Choreografie-/Kontaktkandidaten, sind aber ohne Arena-/Runtime-Abnahme kein stiller Melee-PASS.
