# KFB Playable MVP Masterplan · World first

Status: CURRENT PRODUCT FOCUS  
Date: 2026-09-27  
Owner: Georg / KFB · execution routing by WSA Work Lead

## Aktueller Produkt-Override · 2026-09-27

WORLD-M2A ist nach Georgs freiem Spieltest **nicht spielbar**. Der formale 34/34-Browserlauf bleibt technische Evidence, aber kein Produkt-PASS. Aktueller Work-Gate ist ausschließlich `WORLD-M2A-R1`: lückenloser Terrainkontakt auch abseits der Straße, korrektes Fahrzeug-Grounding und ein messbarer Performance-/Movement-Pass auf derselben Szene. Track, neue Inhalte, HUD und Schattenpolitur bleiben außerhalb dieses Gates.

## GitHub-Recon und nächste Sprints · 2026-09-27

Persistiert und nicht aus abgebrochenen Chats zu rekonstruieren:

- **Track / Bordstein / Clay:** PR #219 @ `e21d9835` enthält S4 Clay Track Design mit KFB-eigener Track-Geometrie, Edge/Runoff/Socket-Grammatik, variable Breiten und Patch-Scatter-Biomübergänge. S5 für OSM-/KayKit-/Kenney-Fassaden ist vorbereitet. Das ist der aktuelle Claude-Design-Auftrag; Race PR #42 @ `bcc422b0` bleibt nur Acceptance Fixture.
- **World/OSM Seam:** PR #257 @ `ac361b4f` enthält die wiederhergestellte exakte Köln-Crop-Semantik und mindestens einen vollständigen erfolgreichen Browserlauf. Ein späterer Lauf erreichte die feste 180-s-Harnessgrenze ohne Seiten-/Requestfehler; vor Verbrauch genügt ein CI-Harness-Margen-/Observability-Check, keine neue World-Architektur.
- **Clay Emanata:** PR #256 @ `0128e045` ist Konzept/Queue und bleibt hinter ToolBox RECOVERY-01; keine Runtime oder Stage.
- **Brick Fish / Red Herring Toss:** PR #254 @ `79d7c18a` ist als späterer Town-/World-Input gesichert; kein aktueller MVP-Blocker.
- **Public-Domain-Manifest:** PR #251 @ `262f04b2` bewahrt die historischen 84/6/40-Fakten; die ursprünglichen Objektidentitäten wurden in den verbundenen Quellen nicht gefunden und werden nicht synthetisiert.

Sprint-Reihenfolge:

1. **Work · Sol High:** WORLD-M2A-R1 auf derselben Szene: Terrainkontakt, Fahrzeug-Grounding, messbare Bewegung/Performance.
2. **Claude Design parallel:** Track S4 aus PR #219, source-first und ohne Runtime-/Physics-Ownership; Bordstein/Runoff/Connector/Clay-Übergänge als beurteilbare Golden Samples.
3. **Web/GitHub klein:** PR #257 Harness-Marge und korrekten `wi1Selftest`-Status einmal sauber schließen; danach Seam als technische World-Quelle verfügbar machen.
4. **Work/Codex Infrastruktur:** Resilient Production Flow R0: früher RUN_STATE-Checkpoint, idempotente Write-Receipts und ein asynchroner Publication-Dispatcher. Das verbessert Verlustsicherheit, blockiert aber Sprint 1 nicht.

## North Star

Die Welt ist ein Spielzeug, das reagiert, lebt, atmet und pulsiert.

Der nächste Fortschritt wird an **spielbaren Zuständen** gemessen, nicht an der Zahl von Briefings, Tabellen oder Human Gates.

## Aktueller Stand

### Erledigt · World/Clay C0

- Hürth-Welt und Clay-Richtung: **Georg PROCEED PASS**.
- Der gefaltete ST01-Dummy, der alte Dauer-`jump.air`-Flug und das damalige Ground-/Jump-Feel sind ausdrücklich keine Produktbasis.
- C0 bleibt technische Historie, nicht die neue Mobility-Baseline.

### Produktiver Kandidat · WORLD-MOBILITY-M1

**Executor:** Work · Sol High
**PR:** #249 · `work/world-mobility-m1-2026-09-27@40037597`

- gefalteter Track-Dummy entfernt;
- bestehende World-r2-Bewegung und Bodenlogik bleiben Ground-Owner;
- erster Space = bestehender World-Sprung;
- zweiter frischer Space innerhalb von 400 ms = Flight;
- echter Travel-Card-Carrier statt Ersatz-Flugobjekt;
- ein Movement-/Camera-Owner pro Modus;
- Original/Knete reversibel;
- akzeptierter Hirnwelt-H0-Look auf Terrain, Straße, Gehweg, Dächern und Fassaden in drei Reliefmaßstäben;
- keine Laufzeit-Weichzeichnung und kein Clay-Preprocessing auf Figuren;
- Paket **43/43**, lokaler Browser Desktop+schmal **40/40 PASS**.

Der exakte Kandidat wurde unter `cloudflare-live@e10745de` verpackt. Die feste Stage-Route liefert jedoch weiterhin die allgemeine KayfaBizarro-Website statt M1. Das ist ein **Publication-/Routing-Fehler**, kein Produkt-Gate und keine neue Aufgabe für Georg. Bis zur einmaligen Reparatur gilt ausdrücklich nicht `PUBLIC_VERIFIED`.

## Genau ein nächster World-Slice

### WORLD-TRACK-DRIVE-CLAY-M2 · echter Track + drei Reisemodi

**Executor:** Work · Sol High
**Brief:** `tools/production_desk/briefings/WORLD_TRACK_CORE_M2_2026-09-27.md`

Ziel:

- den tatsächlichen Race Track Core als bestehenden Owner konsumieren;
- genau ein echtes Track-Rezept in Hürth platzieren;
- Ground/Flight und Original/Clay aus M1 beibehalten;
- den bereits integrierten Hirnwelt-H0-Look beibehalten und nicht erneut bauen;
- KayKit-Häuser unverändert als Quellen behalten und ihre weichen/eingedellten Fassaden durch Vorstufe + Relief erzeugen;
- drei Materialmaßstäbe verwenden: grob für Häuser, mittel für Gelände/Straße/Gehweg, fein für kleine Props/Figuren;
- eine komplette Stadtzelle aus Knet-Fahrbahn, hellem Fugen-Bordstein, Gehweg, Grünübergang, Hauseingängen und Zebrastreifen bauen;
- wiederverwendete Geometrie offline/cached vorbereiten statt H0s rund 40 Sekunden Laufzeit-Vorstufe zu übernehmen;
- OSM als grobe Stadt-/Anschlussarchitektur verwenden;
- Chill-&-Fun-, Stunt- und Fahrfluss höher gewichten als sklavische Kartentreue;
- die bestehende Race-/Free-Roam-Fahrphysik und den vorhandenen Vehicle Deformer konsumieren;
- mit einem bewiesenen Fahrzeug den Kernloop **Walk → Drive → Track → Walk → Flight → Walk** spielen;
- `E` als einheitliche Kontextaktion für Fahrzeuge, Residents, Props und Portale verwenden;
- ohne erfundene Türen cartoonig ein-/aussteigen: Figur hüpft, Fahrzeug duckt sich, beim Ausstieg wird die Figur auf sicheren Boden „ausgespuckt“;
- eine reale Auf-/Abfahrt zwischen Freiraum und Strecke bereitstellen;
- als erstes lebendes Umweltmodul eine vorhandene Billboard-Fläche einsetzen: B2a-Körper + H4-Kompositionsengine + nur die vier bereits öffentlich verifizierten Public-Domain-Pool-Objekte;
- keine Ersatzstrecke, keine neue Fahrphysik und kein Fahrzeugkatalog als MVP-Pflicht.

Damit sind **Ground, Flight und Drive** der erste gemeinsame Travel-MVP. Water bleibt bewusst später. Ein fehlerhaftes Fahrzeug wird quarantiniert; ein bewiesenes Fahrzeug trägt den MVP.

Der Interaktionsvertrag liegt in `tools/production_desk/briefings/WORLD_INTERACTION_E_V1_2026-09-27.md`.

Die Clay-Speech-/Thought-Bubbles sind ein paralleler, nicht blockierender Design-Sidecar. Sie ersetzen nur die Darstellung der vorhandenen ChatterBox und niemals Gespräch, Memory oder Resident-Ownership. Brief: `tools/production_desk/briefings/CLAY_CHATTERBOX_PRESENTATION_D0_2026-09-27.md`.

Billboard/Public Domain wird ebenfalls nicht neu erfunden: B2a bleibt 3D-Körper, H4 liefert die akzeptierte Kompositionslogik, Asset Librarian/PD-POOL-R3 liefert Medien und Rechtebelege. Die 33 H4-LoC-Prototypplatten bleiben gesperrt, bis sie einzeln geprüft sind. Brief: `tools/production_desk/briefings/WORLD_BILLBOARD_PUBLIC_DOMAIN_W1_2026-09-27.md`.

Credits werden aus denselben Registry-/Lizenzbelegen erzeugt und als KFB-Erlebnis sichtbar: `E`-Infotafeln bei ausgewählten Landmarken, satirische Creator-Kudos auf Billboards und ein Showreel-Abspann mit repräsentativen verwendeten Assets. Pflichtangaben bleiben unverändert; freiwillige CC0-/Public-Domain-Würdigung darf charmant und überdreht sein. Brief: `tools/production_desk/briefings/KFB_CREDITS_ATTRIBUTION_EXPERIENCE_V1_2026-09-27.md`.

Mit dieser Entscheidung ist im H0-Export **D2** gewählt. H1 Hirnwelt-Kreuzungen und M1 Knet-Medizin bleiben Sidequests und blockieren die World-Produktion nicht.

## Parallel, aber getrennt

### ToolBox Production-02 · RECOVERY-01

**Executor:** Work · Sol High

Der Session-Cut vom 27.09. ist der Recovery-Startpunkt. Erst wird Feature-Parität zu den alten produktiven Studios hergestellt; danach wird jeweils eine verlorene Funktion source-getreu zurückgebracht. Kein neues Interface, kein Nachbau von Animation Lab v1 aus dem Gedächtnis.

### Rollercoaster v11 · Blender-Donor

**Executor:** Blender MCP

Nur Bewegungs-, Connector- und Kurvenlogik vermessen. Kein zweiter Runtime-Owner.

### Look-/Materialziele

**Executor:** Claude Design

Nur isolierte, visuell beurteilbare Ziele für Clay-Straße, Bürgersteig, Bordstein, Gebäude und spätere Reaktionen. Keine Bewegung, Physik, Kamera oder Integration besitzen.

Zusätzlich: isolierte Clay-Speech-/Thought-Bubble-Golden-Samples auf Basis der bestehenden ChatterBox. Keine zweite Dialogoberfläche.

## Danach

### REACTIVE-CLAY-WORLD-R0

- eine temporäre Reifenspur/Delle;
- ein Prop-/Gebäude-Squash-and-Bounce mit Rückkehr zum Authoring-Transform;
- ein sehr leichter, phasenversetzter Gebäude-Idle;
- instancing-freundlich und event-getrieben, keine globale Soft-Body-Simulation.

### COMBAT-FREEPLAY-C0

- FrizzleBob Driver;
- ein bewiesener Skeleton Warrior;
- Aim → Shoot → Hit → Kill → Reward → Run Clear → Respawn;
- keine blockierende Testoberfläche;
- Mage, Legacy, Melee und weitere KayKit-Figuren additiv, nie Kernloop-Blocker.

## Aufgabenverteilung

| Arbeit | Richtiger Executor |
|---|---|
| World + Travel + Track + OSM Runtime-Integration | Work · Sol High |
| schwieriger echter Cross-Repo-Owner-Konflikt nach einem Sol-Pass | Work · Astra |
| visuelle Clay-/HUD-/Prop-Grammatik | Claude Design, isoliert |
| Track-Geometrie, Rollercoaster-v11-Vermessung, Blender-Exporte | Blender MCP |
| kleine Source-Locks, Inventare, vierteilige Smoke-Tests | Web Chat |
| Produkt-/Look-/Spielurteil | Georg, erst auf echter nutzbarer Oberfläche |

## Harte Regeln

- wiederverwenden, was nachweislich funktioniert;
- keine zweite World-, Camera-, Movement-, Track- oder ToolBox-Ownership;
- keine Low-Fidelity-Proxies als Georg-Gate;
- keine technischen Tabellen als angebliche Produktabnahme;
- ein einzelner Actor-/Asset-Bug wird quarantiniert, wenn der MVP-Kernloop mit einem bewiesenen Set läuft;
- Stage erst bei einem sinnvollen spielbaren Meilenstein;
- Cloudflare-Timeout = UNKNOWN, nicht neuer Rebuild;
- kein neuer Hub und keine neue ToolBox-Shell.

## Georgs aktuelle Aufgabe

**Keine.** World M1, Track M2 und ToolBox Recovery sind Produktionsjobs. Der nächste sinnvolle Georg-Gate entsteht erst auf einer echten spielbaren Track-in-World-Stage oder einer tatsächlich wiederhergestellten Studio-Funktion.
