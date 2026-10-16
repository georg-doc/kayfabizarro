# KFB ToolBox · V-332 · additives Change Log · 16.10.2026

Status: **WIP / nicht publizieren**  
Arbeitsbranch: `feat/headpart-v332-acceptance-2026-10-16`  
Ausgangspunkt Site: `7b546e5c`  
Letzter abgeschlossener lokaler Slice: `2683c6b`  
Alien-Quelle: `assets/kfb-alien-figures-toolbox-2026-10-15 @ 9b1917ad04ed4af883f31d491759a73473cbfdae`  
Mouth-Manifest: `assets/kfb-mouth-sets-r3-2026-10-16 @ eb1100f9`

Dieses Protokoll ist additiv. Frühere Entscheidungen werden nicht umgeschrieben.

## 1 · Implementiert und beibehalten

- Lord Hunky und Lady Dory sind als fertige `headpart`-Figuren auf `Rig_Medium` integriert.
- Die beiden Rezepte wurden erneut aus dem V-332-Quellstand `9b1917ad` übernommen.
- Stock-Clips und `Idle_A` werden wie beim FrizzleBob-Rig verwendet.
- Die Slider für Kopfgröße, Kopfposition, `neckTaper` und Dangle-Stiffness schreiben in die vorhandenen `kfb.pets/1`-Felder zurück.
- Dangle liest `dangle.parts[].side` aus dem Rezept. Die Seite wird nicht mehr aus einem durch three.js bereinigten Knotennamen geraten.
- Die Restquaternion jedes Dangle-Teils wird vor dem ersten Dangle-Step und vor Clip-Einfluss erfasst.
- Für Headpart-Figuren werden keine ToolBox-Lid-Flaps und keine Clay-Lids erzeugt. Die gebackene Socket-Schale bleibt Eigentum des GLB; EyeRig-v6-Lids laufen darunter.
- Der Headpart-EyeRig übernimmt vom Anker nur die Position. Seine Ausgangsorientierung bleibt frontal im Headpart-Raum; damit wird Lady Dorys Auge nicht mehr durch die seitliche Ankerrotation verdreht.
- GPT-Mund B ist Lord Hunkys Default, GPT-Mund A Lady Dorys Default. Restform ist `closed`, Emotes und Talk lesen die Rezept-Mappings.
- Das gemeinsame Mundmenü liest acht Einträge aus `mouth_sets.manifest.json`; `clay_neutral_r3` unterstützt Tint und speichert `mouth.set` sowie `mouth.tint`.

## 2 · Präzisierung des Figurenvertrags

- **KFB-/Cartoon-Augen sind der allgemeine Figurenstandard.**
- **Ein zusätzlicher Decal-/Cartoon-Mund ist optional.** Er wird nur bei ausdrücklich ausgewählten Figuren montiert, deren Gesicht eine freie, freigegebene Fläche oder ein dafür vorbereitetes Mesh besitzt.
- Figuren dürfen ihren im Mesh gebauten Mund behalten oder ohne zusätzlichen Mund bleiben.
- Der Orc Brute behält seinen Mesh-Mund, seine Zähne und seine übrigen authored Gesichtsteile. Er bekommt keinen Decal-Mund und keine FrizzleBob-Haare.

## 3 · Versuche, Befunde und vollständige Rücknahme

Folgende Versuche dienten nur der Diagnose und wurden aus dem Lieferstand entfernt:

- Lady Dorys dunkles Gesichtsoval durch Material-, Emissive-, Depth- oder Normalenänderungen zu kaschieren;
- die separate Gesichtsfläche zur Laufzeit auszublenden oder ihre Z-Koordinaten zu verändern;
- Geometrie zur Laufzeit abzuflachen;
- beim Orc Brute per generischem Connected-Component-/Island-Detektor vermeintliche Spenderaugen aus dem Index zu entfernen;
- den gemeinsamen FrizzleBob-Face-Mount unverändert auf den Orc zu übertragen.

Der Orc-Versuch zeigte zwei konkrete Fehlwirkungen: FrizzleBob-Haar wurde mitmontiert und der generische Insel-Detektor entfernte bzw. beeinträchtigte die Zähne, während die gewünschte Augenersetzung nicht belastbar war. Dieser Weg ist verworfen.

## 4 · Aktuelle Asset-Blocker

### Lady Dory

`LadyDory_Mund_Clay` ist keine kleine, saubere Mundträgerfläche, sondern eine große, gezackte, separate Gesichtsfläche. Ausblenden öffnet ein Loch; Überdecken erzeugt das von Georg abgelehnte massive dunkle Oval. Die Kopfgrundform muss im GLB als sauberes geschlossenes Oval repariert werden.

Der zentrale Eye-Socket/Anker muss im DCC-Quellasset frontal und koaxial geprüft werden. Runtime-Gegenrotation ist keine finale Asset-Reparatur.

### Orc Brute

Der in der ToolBox geladene Orc-Asset-Pin und der gemessene Eye-Atlas stammen nicht aus derselben Asset-Revision. Eine generische Dreiecks-Insel-Auswahl ist deshalb nicht freigabefähig. Die Originalaugen müssen im GLB eindeutig separiert oder entfernt werden, ohne Mund, Zähne, Brauen oder Kopfmesh zu verändern.

## 5 · Veröffentlichungsstatus

- Keine Live-Promotion.
- Keine Zusammenführung in `main`.
- Die Live-Site bleibt auf dem letzten veröffentlichten Stand.
- Wiederaufnahme erst nach einem neuen, visuell und strukturell geprüften GLB-Commit.

## 6 · Nächste Abnahme

1. Blender-MCP-Export nach dem zugehörigen Handoff erzeugen.
2. Neue GLBs bytegenau aus dem genannten Branch/Commit übernehmen; keine Laufzeitkorrektur ergänzen.
3. Diff-only Self-Test.
4. Ein kurzer Browserlauf mit Front-/Dreiviertelbildern und den V-332-Gates.
5. Erst danach Site-Version sichern und live abnehmen lassen.
