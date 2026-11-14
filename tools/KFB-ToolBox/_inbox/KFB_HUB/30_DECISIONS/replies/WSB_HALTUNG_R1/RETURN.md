# WSB_HALTUNG_R1 · Haltung & Mimik R1 (Georg 14.11., V-1727) · RETURN

WSB (Mac mini), 14.11.2026. Brief `30_DECISIONS/replies/WSB_HALTUNG_R1/BRIEF_WSB_HALTUNG_MIMIK_R1.md`, dazu WS0 14.11.: Weg 1 (gebacken, V-1065), offensive_idle-Vorschlag, KayKit-NPCs auf Rig_Medium.
Basis IDLE_R1 `assets/idle-fb-r1` @26e19652. Spielstand site/stage @84acfcd1 (Build 58b070e6, animtakt=1). Spielcode unverändert, nichts gepusht.
Daten: **`haltung-korrektur.r1.json`** (Format wie `clips.idle_r1.json`; sha256 in `SHA256SUMS.txt`).

## Teil A · Haltungen

### FB (im Spiel, vorher/nachher an gleicher Clip-Zeit und Kamera; Kanon-Wächter je Lauf PASS)
**Befund:**
- **Pistole und Blaster setzen keine Haltung.** Die Arme spielen den Ruhe-Pool: In standing_idle_03 steht die Pistole senkrecht neben dem Kopf, in happy/mutant und beim Gehen hängt sie am Oberschenkel (Georgs Beleg).
- **Arme im Rumpf** (gemessen wie im Spiel, three mit CPU-Skinning): Unterarm/Hand 1,4–7,6 cm in 11 von 22 ständig sichtbaren Clips. Die Achsel liegt bei FB immer 2–9 cm im Rumpf und ist aus der Spielkamera verdeckt.

**Korrektur:**
1. **Je Clip zusätzliche Abspreizung des Oberarms 4/8/12°** auf IDLE_R1 (kleinste Stufe mit ≤ 1,5 cm, höchstens 12°).
   - Beispiele: standing_idle_03 +8 (2,4 → 1,0 cm), happy +8 (3,5 → 1,1), Running_B +12 (3,6 → 1,5), Idle_A +4 (1,4 → 0,5), Ranged_1H_Aiming/Shoot +8 (2,8 → 1,2).
   - **Gebacken** in `clips_fb/` (6 Dateien, gleiche Namen wie IDLE_R1, mit `arm_korr.mjs` und derselben Achse). Neue IDLE_R1-Gewichte: `data/korrektur.h1.json`.
   - Prüfung: Die gebackenen Dateien messen wie die Laufzeit-Prüfhilfe (14/14 gleich). Im Spiel mit ausgetauschten Dateien entstehen dieselben Bilder (`fb/blaetter/A_fb_gegenprobe_gebacken.jpg`).
2. **Pistole und Blaster bekommen eine feste Haltung** wie Gatling und Action-Figur-Gewehr: `setWeaponHold`.
   - Quelle: Ranged_1H_Aiming bei 0 s, die vorhandene Tiefhaltung (Lauf vorn unten, Hand an der Hüfte). Nur der rechte Arm, idle Idle_A.
   - Die 8° stecken schon im gebackenen Clip. Specs in der JSON (`koerper.fb.haltungen`), Regel für Ziehen und Schuss in `laufzeit.haltung_pistole`.
3. **Zweihand-Clips ohne Abspreizung** (Ranged_2H_*, Running_HoldingRifle): Sie würden die Stützhand von der Waffe lösen.
4. **offensive_idle** steckt auch mit +12° noch 4,5 cm im Rumpf. Vorschlag: aus dem Pool nehmen, threat.base = kfb_idle_ninja_a (+8°: 0,8 cm), beats = taunt (`data/clips.idle_r1.h1.json`). Eine eigene FB-Fassung bräuchte neue Schlüssel.

**Nur Befund:**
- Action-Figur-Gewehr: sitzt an der Hüfte; der Kolben verdeckt den Bauch nur von der Seite.
- Gatling bleibt (Brief): linker Unterarm 5,5 cm im Rumpf.

Blätter: `fb/blaetter/A_fb_ruhe_gang.jpg`, `A_fb_pistole_blaster.jpg`, `A_fb_gewehr_gatling.jpg`.

### KayKit-Körper: NPCs und Spy (eine Korrektur je Clip, gebacken)
- **Gemessen:** Barbarian, Farmer_B, Lorekeeper, Skeleton_Warrior, Mage, GothGirl und Spy, über die Clips aus dem NPC-Code. Innen-Test über Strahlen-Parität, weil die KayKit-Rümpfe an Arm- und Halsöffnungen offen sind.
- **Stufen je Clip:**
  - Idle_A, Idle_B, Running_A, Running_B, Walking_C, happy_a: +12°
  - Hit_A, Interact, Walking_B: +8°
  - Walking_A, Sit_Floor_Idle, Waving: +4°
  - Cheering: keine Änderung (wird mit Abspreizen schlechter)
- **Keine Ausnahme für dicke Körper:** Der Barbar liegt im Bereich von Bäuerin und Magier.
- **Dateien:** `clips_kaykit/` (4 .kk.glb, Quellen-sha256 in `QUELLEN_SHA256.txt`). Die Motion-Library-v1-Datei liegt im Spiel hinter einer ML-URL; wo die gebackene Fassung hinkommt, entscheidet WS0.
- **Offen:** NPC-Clips aus den v2-Paketen (talking, read_page_turn, strut, clapping) sind ungemessen, weil die Originale nicht auf dem Mac mini liegen.
- **Blätter:** `npc/blaetter/A_npc_vorher_nachher.r2.jpg`, `spy/A_spy_ruhe_gang.r2.jpg` (nachher mit den gebackenen Clips).
  - **Ungültig:** `spy/A_spy_ruhe_gang.jpg`. Meine Bühnenhülle reichte die Korrektur dort nicht weiter, nachher = vorher.

### Soldaten
Keine Korrektur. Die Hände liegen am Gewehr vor der Brust (Zweihand-Clips), Abspreizen würde sie lösen. Messwerte in der JSON. Blatt: `soldat/A_soldat_befund.jpg`.

## Teil A2 · Übergänge und Ruhe-Schleifen
Messung im Prüftakt (replay), Drehgeschwindigkeit je Bild (`data/a2/a2_messung_vorher.json`):
- **Stehen → Gehen:** Der Gang übernimmt in 2 Bildern, Oberarm bis 1590°/s. Ursache: `gaitWeights` hängt nur am momentanen Tempo.
- **Laufen → Gehen:** harter Schnitt in 1 Bild (Hüfte 837°/s). Ursache: Der Spieler kappt das Tempo hart auf Gehtempo.
- **Schuss:** setzt sofort mit Gewicht 1 ein, Rückblende 0,09 s.
- **Waffenhaltung:** setzt sofort ein, ohne Einblenden.
- **Ruhe-Pool:** ohne Spitzen. Nur der erste Einschub kommt schon 1,5–2,3 s nach dem Stehenbleiben.

**Vorschlag (Werte in `a2`):**
- Gang-Gewichte glätten: 0,25 s (Stehen ↔ Gang, Gang ↔ Gang), 0,3 s zum Stehen.
- Schuss: 0,1 s einblenden, 0,25 s zurück.
- Waffenhaltung: 0,2 s ein- und ausblenden.
- Erster Einschub frühestens 4 s nach Bewegung.

Video `a2/A2_fb_uebergaenge_vorher_nachher.r2.mp4` (seitlich, SMOOTH-Aufnahme, feste 60 fps). Streifen in `a2/streifen/*.r2.jpg`.

## Teil B · FB-Gesichts-Idle
- **Heute** (`b/B_fb_gesicht_heute_spiel.mp4`, Spiel, Kamera am Kopf, 60 fps): In 14 s Ruhe ist die Mimik-Schicht still; es gibt nur Blinzeln und Blickziele. Brauen, Lider und Mund bleiben unverändert. Beim Schuss läuft 0,45 s „grimmig“.
- **Vorschlag** mit den Feldnamen aus `GESICHT` (`b.vorschlag.GESICHT`):
  - ruhiger: verweilen 2,5–5,5 s
  - Kombinationen aus dem Bestand: entdecken = Brauen both + Mund oh; Kamera = eine Braue + Lächeln; warten = Lider halb; gelangweilt = Lider tiefer + sad
  - neue Einschübe: Mund-Einschub und Nachblick
- **Video** `b/B_fb_gesicht_vorschlag_buehne.mp4`: Bühne v1.3, FB A11 mit Hasenschwanz wie `attachFbTail`, E2-Lider, Mund-Satz gpt_a, 20 s, 60 fps.
- **Blätter:** `b/B_fb_gesicht_heute_vorschlag.r2.jpg`, Kanon `b/B_fb_kanon_buehne_ohren_schwanz.jpg`.

## Kritiker (blind, nur Befundliste)
- **Behoben:** Im A2-Nachher-Video blitzte nach dem Schuss die alte Ruhehaltung auf. Jetzt greift die Haltung sofort beim Ziehen und nach dem Schuss-Ende (r2).
- **Offen** (Einschätzung je Punkt in `kritiker.befunde_offen`):
  - Boxer-Ruhehaltung: Fäuste vor Brust und Kinn, Clip-Inhalt.
  - Schussposen unverändert (mb1: 0 cm).
  - Action-Figur-Gewehr im Schuss: Lauf schräg, an WS0.
  - Gatling: Befund.
  - Arme beim Laufen recht weit außen; bei Bedarf 8°.
  - Mund-Einschub „m“ kaum sichtbar, jetzt „d“.
  - Mimik bisher nur frontal belegt.

## Bühne
Eigene Kopie `stage/` (aus WSB_REIHE_R1/stage, N35 unverändert). Opt-in-Zusätze:
- `--poseKorr`
- `--gesicht` (gesichtBild: Lider, Blick, Brauen-Versatz, Mund-Bild)
- `--fbTail`

Die Hülle reicht diese Parameter jetzt weiter.

## Dateien
`haltung-korrektur.r1.json` · `clips_fb/` · `clips_kaykit/` · `data/` (h1-Dateien, Messungen) · `fb/` · `spy/` · `npc/` · `soldat/` · `a2/` · `b/` · `scripts/` · `stage/`
