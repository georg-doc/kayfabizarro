# BRIEF WSB · B40 · Blob-Corp-Turm + Kayfabe Men in Black · R1 · 2026-10-18 · WS0
**Reihenfolge:** nach B39. Register: V-529, V-530.

**Tier 0**
1. Den Meshy Detector Tower machen wir zum Blob-Corp-Turm:
   - ohne Sockel;
   - mit ausblendbarer Tür und hellem Innenraum;
   - Schrift „BLOB CORP“.
2. Das Trio im Anzug baust du auf dem B12-Agenten (r4 PASS): Nr. 1 Glatzkopf, Nr. 2 und 3 mit Frisuren aus Assets. Dazu ein Large-Rig-Türsteher mit unbemaltem Ork-Kopf in Hautfarbe. Alle tragen schwarze Blaster.
3. Abnahme nur über den Prüfstand mit der QA-Liste V-520 (a–f). Georgs Vorgaben unten Punkt für Punkt abhaken.

## Block
**Quelle**
- Datei: `~/Dropbox/CLAUDE/MeshyModels/Meshy Community/Meshy Landmarks + Hats/towers + cat sphinx/Meshy_AI_Detector_Tower_1018152510_texture.glb`.
- Meshy-Community-Modell, CC0 laut Meshy-Seite (Georgs Screenshot). Trotzdem im Ordner `_privat_meshy`.
- Georgs Türmarkierung: `50_BLENDER/B40/georg_refs/GEORG_door_marking.webp` (Magenta-Rahmen).

**Turm**
- **Maßstab:**
  - Der Large Rig (2,85 m) geht bequem und mit Abstand oben durch die Tür: lichte Höhe ≥ 3,4 m, Breite ≥ 1,6 m.
  - Den Gesamtmaßstab leitest du aus der Tür ab.
  - Nachweisbild: Large Rig im Türrahmen.
- **Sockel:**
  - Die Kachelplatte entfernen, den Turm unten waagrecht abschneiden und mit einem Deckel schließen (0 offene Kanten).
  - Pivot auf Bodenhöhe.
  - Anker `KFB_SinkDepth` (≈ 0,4 m), damit der Turm leicht im Gelände versenkt materialisieren kann.
- **Tür:**
  - Die Fläche im Magenta-Rahmen wird ein eigenes Objekt `KFB_Door`, ausblendbar oder verschiebbar.
  - Dahinter ein geschlossener Schacht, Wände ohne Löcher.
  - Rückwand und Laibung mit Material `kfb_portal_light`, sehr hell, weiß bis warm. Das ist der Leuchtkörper der Tür.
  - Anker `KFB_Light_Interior` für das eine echte Licht (WS1; das ist Georgs ausdrücklicher Licht-Effekt, V-385 bleibt sonst gültig).
  - Dazu `KFB_DoorStep` als Austrittspunkt.
- **Schrift:**
  - Über das Schild „DETECTOR TOWER“ kommt eine neue dunkle Schildplatte mit erhabener Schrift „BLOB CORP“: creme-gelb, in Georgs Schrift Georg Comic Pro.
  - Nicht in den Meshy-Atlas malen. Reste der alten Buchstaben dürfen nicht durchscheinen.
- **Orb (Georg-Nachtrag):**
  - Die orange Kugel im Ring wird ein eigenes Objekt `KFB_Orb`, Pivot in der Mitte, geschlossen.
  - Sie ist Teil der Materialisieren- und Verschwinden-Animation, zum Beispiel erscheint sie als Letztes und verschwindet als Erstes.
  - Sie wabert und pulsiert bedrohlich: Material `kfb_orb_pulse` mit Emission, die WS1 animiert; dazu ein leichtes Wabern der Form (Shape Key `wobble`).
  - Variante „Auge“: Skin mit KFB-Cartoon-Auge (Sklera = Orb, Iris/Pupille, E2-Lider), Anker `KFB_EyeAim`. Damit schaut sich der Orb um und scannt die Umgebung (Blick-Logik WS1, Augen-Modul `kfb-proof-eyes`).
  - Lider (Georg): Claymation-E2-Lider in Anthrazit (≈ #34363a, `eyeRig.lid.colour`).
    - Sie blinzeln.
    - Modus „Starren“: zusammengekniffenes Auge (Ober- und Unterlid halb zu), das Spieler/Kamera bedrohlich anstarrt.
    - Prüfstand: offen / blinzelnd / zusammengekniffen.
  - Beide Varianten auf dem Prüfstand zeigen.
- **Rest:**
  - Knet-Material KFB, keine neuen Formen außer Schild und Deckel.
- **Taktische Ankunftspunkte:**
  - `KFB_Spawn_1..3` im Halbkreis vor der Vorderseite (Spielerseite), 3–5 m vor der Tür, links / Mitte / rechts.
  - Large-Rig-Punkt `KFB_Spawn_L` direkt neben der Tür.

**Agenten**
- **Basis:** B12-Agent r4 mit Anzug-Baukasten (V-413/V-428), KFB-Augen, Sonnenbrille als Variante. Mit Brille sind die Augen ausgeblendet, nichts sticht durch.
- **Trio und Türsteher:**
  - AG1: Glatzkopf.
  - AG2 und AG3: Frisuren aus der 3D-Asset-Suche, CC0 bevorzugt, Lizenz im RETURN.
  - AGL: KayKit Rig_Large im gleichen Outfit, Ork-Kopf aus `50_BLENDER/ORC` unbemalt in Hautfarbe.
- **Ernte-Variante (V-531):**
  - Jeder Agent hat optional einen Roboter-Unterarm mit schwarzem Trichter.
  - Logik wie beim Spieler-Arm V-510: Der Robo-Unterarm ersetzt Unterarm und Hand ganz, keine Manschette. Basis ist der Bot-Arm B31, Trichter schwarz statt bunt.
  - Anker `KFB_Nozzle` für das Saug-Modul.
  - Prüfstand: AG1 mit Arm.
- **Waffen-Halterung (V-536):** Blaster und Trichter sitzen als Verlängerung des Unterarms in der Faustkugel (`KFB_Grip`), Mündungsachse = Unterarmachse.
- **Blaster:**
  - Schwarzer Cartoon-Blaster aus der Asset-Suche (CC0), kein Eigenbau.
  - Anker `KFB_Muzzle` und Griff in der rechten Hand.
- **Clips** (Mixamo, privat, aus `~/Dropbox/Mac/Downloads/`): auf die Rigs retargeten.
  - Agenten: Drawing Gun, Shooting Gun, Pistol To Idle.
  - Opfer: Falling Back Death oder Knocked Out (Rückstoß-Fall), Getting Up, Dizzy Idle, Drunk Walk (orientierungslos).
  - Das Zucken am Boden macht später WS1 additiv; du lieferst die Liegepose als Endbild.

**Abnahme-Bilder (Prüfstand)**
1. Turm: Tür zu, Tür weg mit Licht, Schild nah, Schnitt unten, Orb normal und als Auge (Blick links / Mitte / rechts).
2. Large Rig im Türrahmen (Abstand sichtbar).
3. Line-up AG1–3 + AGL mit Blastern, Augen offen, halb, zu.
4. Je ein Standbild Schuss-Pose und Opfer liegend.

**Für WS1 (später, nicht WSB)**
Ablauf eines Einsatzes:
1. Paranormales Ereignis.
2. Turm wächst aus dem Boden (Speckle V-403 + SFX).
3. Tür blendet aus, helles Licht.
4. Agenten ploppen nacheinander im Licht auf und laufen zu Spawn 1–3, der Türsteher an die Tür.
5. Sie suchen die Umgebung ab und befragen.
6. Im Triplet-Dialog vor Reveal oder Closure: Ruf „Humbug!“ als Comic-Wort, gebogen, ohne Blase. Dann ein weißer Blitzstrahl auf die Kopfmitte von NPC oder Spieler.
7. Das Opfer fällt mit Rückstoß und liegt zuckend am Boden, rappelt sich langsam auf und läuft orientierungslos herum.
8. Dann geht es normal weiter. Die Agenten steigen ein, der Turm dematerialisiert.

SFX `40_AUDIO/elevenlabs_r1/blobcorp_mib_r1` macht WS0.
