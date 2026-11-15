Für Claude Design (Chat „Claymation Look & Animations“) · Korrektur: FB nur aus der SSOT, Augen fehlen im Bild „heute | Lichtkante“ · 15.11. (Georg, V-1743, V-1832)

**Befund (Georg 15.11.):** „Es gibt wieder FBs ohne SSOT.“ Im Vergleich „heute | Lichtkante“ fehlen FBs Augen ganz: Über der Nase sitzen nur die schwarzen Brauen, darunter keine weißen Augäpfel, keine Pupillen, keine Lider. Der Rest (Ohren, Nase, Knete) passt.

**So kommt FB in jedes Bild** (Repo `georg-doc/KFB-Stunt-Car-Race`):
- Figur: nur die Web-Datei aus der Figurendatei `src/data/characters/frizzlebob.character.json` (Stamm `game/integration-r2`), Feld `appearance.export.v`. Heute `web_agent_twin` = `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent_twin.r1h.glb` auf Zweig `assets/private` @72d3701c, Messblatt `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1h.md`. Laden mit GLTFLoader + MeshoptDecoder.
- Augen und Lider sind in dieser Datei eingebacken: Augen mit Blick-Knoten `FB_Auge_L_Blick` / `FB_Auge_R_Blick`, Lider als Morphs (Beschreibung `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1d.md`). Nichts davon ausblenden, ersetzen oder umfärben.
- Mund: 13 Knoten `FB_Mund_<schlüssel>`, Steuerung `50_BLENDER/FB_WEB_KANON_R1/web/fb_mund.v2.js`. Der heutige Mund in r1h ist noch der alte Satz; Georgs neuer Mund yellow_buck kommt mit r1i vom Mac mini, gleicher Aufbau.

**Für den Claymation-Look:** Die Knete-Oberfläche und die Lichtkante gelten nur für FBs Haut (Kopf, Körper, Ohren, Schwanz). Augen, Pupillen, Lider, Brauen, Nase und Mund behalten ihre Materialien aus der Datei. Wenn dein Look alle Materialien tauscht, verschwinden genau diese Teile. Ein Licht-Rig, keine eigenen Shader auf Augen und Mund (V-385).

**Kanon-Wache vor jedem FB-Bild oder -Video** (wie `fbKanonPruefen` im Spiel):
- beide Augen sichtbar: weißer Augapfel, schwarze Pupille, Lider in dunklerem Kopfton, nie dicke Kappen;
- schwarze Brauen über den Augen, rote Nase, Mund aus dem Satz der Datei;
- beide Ohren und der Schwanz da.
Fehlt etwas davon, das Bild nicht zeigen, sondern den Lade- oder Material-Schritt korrigieren.
