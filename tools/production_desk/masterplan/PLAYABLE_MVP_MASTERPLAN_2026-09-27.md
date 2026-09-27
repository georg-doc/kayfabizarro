# KFB Playable MVP Masterplan · World first

Status: CURRENT PRODUCT FOCUS  
Date: 2026-09-27  
Owner: Georg / KFB · execution routing by WSA Work Lead

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

### WORLD-TRACK-CLAY-M2 · echter Track + KlayfaBizarro-Stadtzelle

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
- keine Ersatzstrecke und keine neue Fahrphysik.

Drive folgt erst, wenn Track- und Vehicle-Owner wirklich angeschlossen sind.

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
