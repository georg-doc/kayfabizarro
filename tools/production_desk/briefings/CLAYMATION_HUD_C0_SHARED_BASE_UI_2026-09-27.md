# Claymation HUD C0 · gemeinsame Base UI

Status: **NEXT PRODUCTIVE DESIGN SLICE · VISUAL SYSTEM FIRST**  
Datum: 2026-09-27  
Owner: bestehender Racer-HUD-Owner; World/Travel/Combat sind Konsumenten  
Arbeitsweg: Claude Design für die sichtbare Familie → Work erst für die spätere Runtime-Integration

## Ziel

Eine einzige KlayfaBizarro-HUD-Familie für WALK, DRIVE/RACE, FLIGHT und COMBAT. Die Modi teilen Form, Material, Typografie, Bewegung und Einstellungen; sichtbar ist jeweils nur, was der aktuelle Modus wirklich bereitstellt.

Der Slice baut keine zweite HUD-Runtime und ersetzt keine Telemetrie-, Combat-, Audio-, Inventar- oder Input-Owner.

## Zuerst echte Quellen zeigen

Vor dem Layout jeweils isoliert sichtbar machen:

1. den aktuellen akzeptierten Racer-HUD-Kandidaten und seine echten Instrumente;
2. reale KayKit-Backpacks aus dem Asset Librarian/Katalog;
3. den aktuellen Combat-HP-/Score-Pfad;
4. vorhandene Pop-Score-, Countdown-, Bangers-Zahlen- und Radio/Minimap-Donoren;
5. belegte 3D-Props für Inventar und Action-Slots.

Asset geladen heißt nicht Design übernommen. Keine generischen Kästen, Ersatzicons oder erfundenen Messwerte.

## Gemeinsame Base UI

- **Backpack:** ein zum gewählten echten Backpack passendes Clay-HUD-Objekt. Idle dezent; Hover/Focus, Press und Open sichtbar, aber kurz.
- **Inventar:** Overlay mit 20 Slots, responsiv als 5×4 beziehungsweise mobil passend umgebrochen. Leere Slots bleiben sichtbar leer. Testobjekte stammen aus echten Props/Gifts/Tools/Quest-Items.
- **Action Slots:** maximal sechs; unbelegte Slots sind vollständig unsichtbar. Belegte Slots zeigen echte 3D-Clay-Props oder freigegebene Skills/Weapons/Special-Moves.
- **Pop Score:** kleine 3D-Clay-Popcornbox vor der Zahl. Punktegewinn lässt wenige Popcorns kurz aufspringen; Zahl reagiert juicy, aber bleibt lesbar.
- **Combat HP:** Clay-Leiste mit klarer Füllung: unter 20 % rot, 20–80 % gelb, über 80 % grün. Test-Harness darf feste Werte zeigen; Runtime-Daten bleiben beim Combat-Owner.
- **Zahlen:** Bangers für kurze expressive Werte wie Score, Countdown, Rennzeit und Rundenakzent. Längere Texte nutzen eine gut lesbare Label-Schrift.

## Modus-Matrix

| Element | WALK | DRIVE/RACE | FLIGHT | COMBAT |
|---|---:|---:|---:|---:|
| Backpack / Inventar | ja | kompakt | kompakt | ja |
| Pop Score | wenn aktiv | wenn aktiv | wenn aktiv | wenn aktiv |
| bis zu 6 Action Slots | kontextuell | kontextuell | kontextuell | ja |
| Tacho / Rennzeit / Runde | nein | ja, nur echte Provider | nein | nein |
| Minimap / Navigation | nur echter Provider | ja, wenn vorhanden | 3D-Ziel/Heading, wenn vorhanden | Arena-/Zielinfo, wenn vorhanden |
| Radio / Musik | kompakt | ja | kompakt | nur wenn Modus erlaubt |
| HP | nur bei Gefahr | nur bei Gefahr | nur bei Gefahr | ja |

## Clay-Reaktivität

Alle HUD-Objekte dürfen dezent atmen/pulsieren und auf Hover, Focus, Press und Active reagieren. Zusätzlich:

- Race-Kinetik kann Elemente leicht stauchen/neigen;
- Musik/Sound kann eine geringe Pulsation treiben;
- wichtige Zustandswechsel bekommen einen kurzen Pop/Bounce;
- keine Dauerbewegung darf Information überlagern.

Einstellung pro Modus: **AUS / DEZENT / VOLL**. Standard ist **DEZENT**. Reduced-Motion respektieren.

## Startscreen und Controls

Buttons, Switches und Slider werden als dieselbe Clay-Familie gezeigt. Text liegt auf lesbaren Clay-Labels; nicht jede Beschriftung wird zu deformierter 3D-Typografie. Every letter/pixel pays rent.

## Getrennt lassen

- Sprech-/Denkblasen: eigener späterer Lesbarkeits-Slice. Zuerst Label-basierte, dynamisch skalierende Textflächen gegen volumetrische Clay-Bubbles vergleichen.
- Fell, Holz, Boardgame Bits und weitere DIY-Materialien: spätere Skins auf derselben UI-Struktur.
- Runtime-Integration, Persistenz, echtes Inventarsystem, Item-Drag/Drop und Combat-Balancing: nicht C0.
- Keine Reparatur von Race-, Flight- oder Combat-Logik in Claude Design.

## C0-Lieferung

1. Source-Proof-Seite der echten Donoren.
2. Eine gemeinsame Komponentenwand.
3. Vier kompakte Zustände: WALK, DRIVE/RACE, FLIGHT, COMBAT.
4. Backpack geschlossen/offen mit 20 Slots.
5. Action Slots 0 / 2 / 6 belegt.
6. HP bei 15 / 50 / 90 %.
7. Pop-Score-Gewinn und Countdown als kurze Bewegungsprobe.
8. Desktop, Split-Screen und schmales/mobile Layout.
9. Reaktivität AUS / DEZENT / VOLL.
10. vollständiger Session Cut mit SOURCE, Return, Changelog und Screenshots.

## Erfolg

Georg kann die gemeinsame Clay-HUD-Sprache, Lesbarkeit, Modusreduktion und Reaktivität beurteilen, bevor Work sie an die echten Runtime-Provider bindet.

## Genau ein Gate

**Georg: gemeinsame Clay-HUD-Richtung PASS / TUNE / REJECT.**
