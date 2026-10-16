# Blender MCP Handoff · Alien Headparts + Orc Eye Ownership · V-332

Datum: 16.10.2026  
Status: **Asset-Reparatur erforderlich / keine Runtime-Reparatur zulässig**

## Quellen

Alien-Branch: `assets/kfb-alien-figures-toolbox-2026-10-15`  
Eingangsrevision: `9b1917ad04ed4af883f31d491759a73473cbfdae`  
Ordner: `media/3D_Assets/MeshyModels/alien_figures_toolbox_r1/`

Dateien:

- `LadyDory_RigMedium.toolbox.glb`
- `LordHunky_RigMedium.toolbox.glb`
- `ladydory-headpart-r1.ws0-2026-10-15.kfb-pets.json`
- `lordhunky-headpart-r1.ws0-2026-10-15.kfb-pets.json`
- `reference/`
- `_work/proof.html`

Orc-Quelle:

- `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb`
- Aktuellen ToolBox-Pin und den tatsächlich verwendeten Asset-Commit vor Bearbeitung explizit angleichen.
- Der vorhandene Atlas-Eintrag nennt eine andere Revision; seine generische Insel-Selektion darf nicht ungeprüft übernommen werden.

## A · Lady Dory · verpflichtende Reparatur

1. `LadyDory_Head_mesh` als saubere, geschlossene ovale Kopfgrundform herstellen.
2. Die große gezackte separate Fläche `LadyDory_Mund_Clay` nicht als Overlay belassen. Sauber in die Kopfoberfläche integrieren/retopologisieren oder durch eine durchgehende Head-Surface ersetzen.
3. Keine Löcher, Überlappungen, Selbstüberschneidungen, Z-Fighting-Flächen oder sichtbaren Materialnähte.
4. Glatte, konsistente Normalen und Tangenten; die einfache Ovalform muss im Front- und 3/4-Licht sauber lesen.
5. Die gebackene Eye-Socket-Schale erhalten: Radius 1,10 R, Frontöffnung 58°, gerollter Rand 0,075 R.
6. Socket und `KFB_Eye_C_anchor` koaxial und frontal in Headpart-Lokalraum ausrichten. Vorne ist +Z. Die Ankerposition nicht willkürlich verändern; Position gegen die Referenzen messen.
7. `KFB_Mouth_anchor` erhalten und auf der finalen sauberen Oberfläche prüfen.
8. Hierarchie erhalten: `head → LadyDory_Head → head_part → eyestalk.c` sowie `antenna.l/r`.
9. Skinning, Restpose und Morph Target `neckTaper` unverändert erhalten.

## B · Lord Hunky · Kontroll- und Korrekturpass

1. Gegen `reference/LordHunky_04_Gesicht_nah.png` und `*_08_Ausdruecke.png` prüfen.
2. Beide Eye-Sockets sichtbar und frei von zusätzlicher Flap-/Lid-Geometrie halten.
3. `KFB_Eye_L_anchor` und `KFB_Eye_R_anchor` frontal/koaxial in den jeweiligen Sockeln prüfen.
4. Stalk-Restpose links/rechts spiegelgleich prüfen; keine Rotation in das Mesh einbacken, die Dangle später kompensieren müsste.
5. Hierarchie, Bone-Namen, Skinning, Restpose, `KFB_Mouth_anchor` und `neckTaper` erhalten.

## C · Orc Brute · Eye-Owner sauber vorbereiten

1. Mesh-Mund, Zähne, Brauen, Kopf, Haare des Originalmodells und sämtliche Körperteile unverändert erhalten.
2. Keine FrizzleBob-Haare hinzufügen. Keine Decal-Mundfläche hinzufügen.
3. Die beiden ursprünglichen Orc-Augen exakt identifizieren und entweder:
   - aus dem Produktionsmesh entfernen und die entstehenden Flächen sauber schließen, oder
   - als zwei eindeutig benannte, separat schaltbare Nodes/Primitives exportieren.
4. Keine automatische Wahl über „vorderstes symmetrisches Inselpaar“ verwenden.
5. Für die KFB-Augen einen eindeutigen, frontal ausgerichteten Host/Ankervertrag liefern. Vorne ist +Z.
6. Rig_Large-Hierarchie, Skinning, Animationstauglichkeit, Mund, Zähne und Restpose dürfen sich nicht ändern.

Empfohlene semantische Namen bei separatem Export:

- `KFB_OriginalEye_L`
- `KFB_OriginalEye_R`
- optional `KFB_Eye_L_anchor`, `KFB_Eye_R_anchor`

## Unveränderlich

- Keine Clips hinzufügen oder bestehende Clips verändern.
- Keine globalen Körpertransforms ändern.
- Bone-Namen und Restpose nicht verändern.
- Keine Runtime-Kaschierung als Teil der Abgabe vorschlagen.
- Keine Lid-Flaps oder zusätzliche Lid-Geometrie auf die Alien-Sockets setzen.

## Abgabe

Neuer Branch, kein Merge. Liefern:

1. korrigierte GLBs;
2. Branch, vollständige Commit-SHA und genaue Pfade;
3. kurzer Änderungsbericht pro Mesh/Node;
4. Strukturprüfung der Hierarchie/Bones/Morph Targets;
5. Front- und 3/4-Proofbilder.

Lady Dory Proofs:

- ohne Mouth-Decal direkt nach Load und nach zwei Sekunden;
- mit GPT A `closed`;
- Auge offen, halb und geschlossen;
- Front und 3/4, Socketrand vollständig sichtbar.

Lord Hunky Proofs:

- Augen offen, halb und geschlossen;
- Front und 3/4;
- beide Stalks im Rest und ein Frame nach Kopfturn.

Orc Proofs:

- Front und 3/4 mit Originalmund und vollständigen Zähnen;
- keine Originalaugen bzw. separat schaltbare Originalaugen;
- Test mit KFB EyeRig, ohne Haare und ohne Decal-Mund.

## ToolBox-Abnahme nach Rückgabe

- Neue Assets ohne Mesh-Manipulation laden.
- V-332 G1–G6 erneut prüfen.
- Orc zusätzlich: Zähne/Mesh-Mund unverändert, keine Haare, ausschließlich freigegebene KFB-Augen.
- Diff-only Self-Test und ein kurzer Browserlauf.
- Erst nach Georgs visueller Abnahme publizieren.
