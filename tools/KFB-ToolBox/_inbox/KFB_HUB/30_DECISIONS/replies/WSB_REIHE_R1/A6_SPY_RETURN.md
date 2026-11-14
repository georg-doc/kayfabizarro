# WSB_REIHE_R1 · Auftrag 6 · KayKit Spy und Marksman (V-1715, V-1716) · RETURN

WSB (Mac mini), 14.11.2026, Brief §6.

**Quellen** (lokal, `3D ASSETS/`):
- `Kaykit Spy/`: Spy.glb, spy_texture und spy_texture_B, Spy_Gun mit Silencer, Martini, Rig_Medium-Clips
- `KayKit_Mystery_Monthly_Series_6_(1.1)/10 - April 2026 - Marksman/` (Marksman_Rifle)
- KayKit Character Animations 1.1, Rig_Medium: General, MovementBasic, MovementAdvanced, CombatRanged

Nichts ins Spiel eingebaut, nichts gepusht.

## (a) Spy-Duo: `kaykit_spy_schwarz` und `kaykit_spy_weiss`
- **Karten:** `karten/kaykit_spy_<farbe>.figure.json` (Bühne) und `.character.json` (`kfb.character/2` mit appearance). Die Namen folgen von Georg.
- **Modell:**
  - Spy.glb plus `eye_anchor.l/.r` am Knochen `head`; Netze, Haut und Materialien gleich (`scripts/vergleich.mjs`).
  - Weiß = dieselbe Datei mit getauschter Textur `spy_texture_B` (weißer Anzug, dunklere Haut, schwarzes Haar, rotes Einstecktuch).
- **Augen:**
  - Die Original-Augen sind aufgemalte schwarze Ovale (±0,188 m, Höhe 1,577 m). Kein eigenes Netz, also überdeckt.
  - r = 0,092 = 0,08 · Kopfbreite 1,083 / 1,085 · augenR2-Größe 1,15; converge 0,12; Augen R2.
- **Lider E2** nach skinLidTone: schwarz #a87e63 (Haut #f5b993), weiß #834937 (Haut #92523e).
- **Mund:** Vorschlag Originalmund (aufgemalt). Georg entscheidet.
- **Proofs** `proof/spy/<farbe>/` (Clip Idle_A): vorn, seitlich, Gesicht nah offen/halb/zu. G1 PASS (seat eye-anchor, 2 Augen, 2 E2), alle Gates PASS.

## (b) FrizzleBob als „Kayfabe-Agent“
- **Körper** `glb/kfb_spy_fbagent.r3.glb`: Spy.glb, Fliege als eigenes geskinntes Teil `Spy_BowTie` mit Material `KFB_Fliege_rot`.
  - Die Fliege besteht aus den Dreiecken von Spy_Body im Atlas-Feld BOWTIE oberhalb der Knöpfe (206 Dreiecke).
  - Getrennt in der GLB mit gltf-transform; die übrigen Daten bleiben gleich.
- **Bindung wie im Spiel:** `fbAddons.attachFbAnzug` (garment-system.r1, V-1640/V-1641).
  - Rumpf, Arme und Beine des Spy an FBs Knochen nach Namen; Hände mit FB-Fell.
  - FB-Kopf, Ohren, Gesicht und Schwanz unverändert (FB_CANON).
- **Für WS0 im Spiel:** `FB_KOERPER.spy = { prefix: 'Spy_', extra: ['BowTie'], fell: true }` plus URL auf `kfb_spy_fbagent.r3.glb` in `garderobe.js`.
- **Proof** `proof/fb_agent/`: Bühne v1.3, FB_R8_probe_A11, Karte `karten/frizzlebob_kayfabe_agent.figure.json` mit `garment` (nicht kanonisch, nur Proof). G1–G6 PASS (G4 WARN: Kit-Inseln).
- **Hinweis:** Die Schild-Uhr bleibt beim FB-Agenten am Arm, sie ist Teil von Spy_ArmLeft.

## (c) Schild-Uhr als Prop (V-1020, V-1028)
- `glb/KFB_SchildUhr_schwarz.glb` und `_weiss.glb`: die Dreiecke von Spy_ArmLeft in den Atlas-Feldern WATCH und WATCH FACE, als starres Prop (342 Dreiecke), mit Anker `KFB_Wrist`.
- **Sitz links** relativ zu `lowerarm.l`: `glb/KFB_SchildUhr.sitz.json`. Die Farben kommen aus der jeweiligen Anzug-Textur.
- Später auch als Spieler-Ausrüstung nutzbar.
- **Proof** `proof/uhr/`: weiß PASS. Schwarz allein auf dem Boden: G6 FAIL (Schattensaum in der Seitenansicht, offenes Armband). Getragen am Spy belegt, siehe `blaetter/A6_schilduhr.png`.

## (d) Kit-Waffen (V-574 unverändert, Anker ergänzt)

| Waffe | Datei | Typ · so hält man sie | Halterung | Mündung |
|---|---|---|---|---|
| Spy_Gun | `waffen/KFB_Spy_Gun_ohneSilencer.r1.glb` | Einhand-Pistole: rechte Faust um den Griff, Lauf in Unterarm-Verlängerung, linke Hand frei | handslot.r, slotOffset Ry +90° | KFB_Muzzle (0; 0,15; 0,511) +Z |
| Spy_Gun + Silencer | `waffen/KFB_Spy_Gun.r1.glb` | wie Pistole, Silencer verlängert den Lauf | wie oben | KFB_Muzzle_Silencer an der Silencer-Spitze (z 1,108), beim Aufsetzen umgeschaltet |
| Marksman-Gewehr | `waffen/KFB_Marksman_Rifle.r1.glb` | Zweihand: rechte Hand am Griff, Kolben an der Schulter, Stützhand vorn, Auge am Zielfernrohr | handslot.r, Ry +90° plus Familien V-582 | KFB_Muzzle (0; 0,151; 1,686) +Z |
| Martini | `waffen/KFB_Martini.r1.glb` | Prop | – | – |

**Halterungsdreh gemessen** (V-581): `data/muendung_ranged_*.json`.
- Laufrichtung im Zielen +1,06° (2H) bzw. +1,3° (1H). Die feste Drehung Ry +90° stimmt; kein Nachdrehen je Bild.
- Weapon-Specs nach K10-Muster: `waffen/*.weapon.json`.

**Zweihand-Gewehr, drei Clip-Familien (V-582):** `data/rifle_familien.json`, Messung `data/handslot_*.json`.
1. **Zielen, Schießen, Nachladen** (Ranged_2H_*): Halterung Ry +90°, die ganze Figur um −1,06° drehen (gemessene Laufabweichung); Stützhand aus dem Clip.
2. **Laufen, Strafe, Ruhe, kleiner Treffer:** je Clip eine feste natürliche Haltung (Gewehr waagrecht nach vorn, Zielfernrohr oben), aus der mittleren Lage von handslot.r berechnet.
   - Ohne sie hängt das Gewehr mit der Hand nach unten (Nick −74° bis −90°).
   - Belegt an Idle_A, Walking_B und Running_A (`blaetter/A6_gewehr_familie2.png`).
   - Empfehlung: Walking_B statt Walking_A (Streuung 8° statt 33°), Running_A statt Running_B (8° statt 41°).
3. **Ausweichen, großer Treffer** (Dodge_*, Hit_B): Beine aus dem Clip, Oberkörper und Gewehr aus Running_HoldingRifle (Upper-Body-Mask, Laufzeit). Die Lage je Clip ist gemessen und mitgeliefert.

**Nahbilder** Faust/Griff und Stützhand: `blaetter/A6_waffen.r2.png`. Vom Marksman ist nur das Gewehr geliefert; seine Karte kommt später (Brief).

## Bühne
Erweitert in der Kopie `50_BLENDER/WSB_REIHE_R1/stage/` (N35 unverändert):
- v1.3 mit `card.garment` (Logik 1:1 aus attachFbAnzug)
- v1.2 mit `--mess` (Knotenlage je Clip-Bild für Mündung und handslot)

## Kritiker (CRITIC_3D_R1, Figurenabnahme) · STOPP-BERICHT
| Runde | K4 | K6 | K10 | Mittel | Urteil |
|---|---|---|---|---|---|
| R1 (`blaetter/`) | 9 | 6 | 5 | 6,7 | REWORK |
| R2 (`r2/blaetter/`) | 9 | 8 | 5 | 7,3 | REWORK → Stopp (zweimal K10 ohne Punktgewinn) |

**R1 → R2 behoben:**
- Gewehr: Versatz (0,1; 0; 0,12) wie beim abgenommenen K10-Scharfschützengewehr. Familie 2 je Clip um 0,35 entlang der Figur nach vorn, `r2/data/rifle_familien.r2.json` (Drehung und Versatz). Der Kolben steckt nicht mehr in Hüfte oder Rumpf.
- FB-Agent in Clip Idle_A mit Lidern offen, halb und zu.
- Uhr-Bild zeigt den getragenen Sitz.

**Ohne Befund in R2:** Spy-Duo (Augen, Lider, Kontakt), Pistole und Pistole mit Silencer (Unterarmachse V-536, Hand am Griffstück), Uhr links (kein Schweben, keine Durchdringung), Gewehr in Idle_A und Walking_B (waagrecht vor dem Körper).

**Offen, zur Entscheidung durch WS0:**
1. **FB-Agent: spitze hautfarbene Dreiecke zwischen Ärmel und Hand.**
   - Ursache in der Spiel-Logik `attachFbAnzug` → `handFell`. Sie teilt Dreiecke nur dann FB-Fell zu, wenn ≥ 2 Ecken überwiegend an Hand-Knochen hängen.
   - Die Handgelenk-Dreiecke des Spy fallen knapp darunter und behalten die Spy-Haut. Im Spiel wäre das genauso.
   - Vorschlag: Schwelle für den Spy-Körper lockern (Dreieck = Hand, wenn eine Ecke > 0,5 an hand*). Das ist eine Änderung der Spiel-Logik, deshalb an WS0.
2. **Gewehr im Zielen (Familie 1): Stützhand und Zielfernrohr.**
   - Im KayKit-Clip Ranged_2H_Aiming liegt die Stützhand vor der Brust, nicht am Vorderschaft. Das Marksman-Gewehr ist länger als die Kit-Gewehre, für die der Clip gebaut ist.
   - Mit festem Halterungsdreh plus Versatz und ohne Arm-IK (V-582) liegen Stützhand und Vorderschaft nicht zusammen.
   - Wege: anderer Halterungsversatz nur für Familie 1 (Zielfernrohr ans Auge, dann Kolben näher an die Schulter), oder ein kürzeres Kit-Gewehr. Entscheidung WS0 bzw. Georg.
3. **Running_A: Zielfernrohr auf Kinnhöhe.** Familie 2 braucht beim Laufen eine tiefere Haltung (Versatz nach unten) oder den Clip Running_HoldingRifle (Referenz gemessen).

**Gültiger Stand:** Spy, Uhr und Pistolen wie oben. Gewehr mit `r2/`-Werten (`r2/waffen/proof_spy_rifle_*_r2.glb`, `r2/data/rifle_familien.r2.json`). FB-Agent `r2/proof/fb`. Blätter `r2/blaetter/`.

## Dateien
- `glb/`, `waffen/`, `karten/`, `proof/`, `blaetter/`, `data/`
- `scripts/`: `spy_mess.py`, `anker6.mjs`, `tex6.mjs`, `karten6.py`, `fliege.mjs`, `uhr.py`, `waffen.mjs`, `fam2.mjs`
- Asset-Pässe neben jeder neuen GLB (`*.asset_pass.json`, alle vollständig)
