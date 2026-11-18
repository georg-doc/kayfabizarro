# KFB Bots · Face-mount-GLB, ToolBox-Start-Einträge, Animationsbibliothek · RETURN (WSB, 18.11.2026)

**Auftrag:** WS0 an WSB (92/93). Für den ToolBox-Weg je Bot ein Face-mount-GLB und ein Start-Eintrag. Dazu die Bibliothek als Animations-GLB, weil WS1 kein Dropbox hat. Den Rest übernimmt WS1 (Georg).
**Stand Spiel:** Stamm @3c5cd21e (game/integration-r2). Keine Spieldatei geändert, Prüfung nur per Routing und Testmodul.

## 1 · Face-mount-GLB je Bot
`_privat_kauf_asset/KFB_q_xbot_facemount.r1c.glb` (Alpha) und `KFB_q_ybot_facemount.r1c.glb` (Beta).
- **Inhalt:**
  - Körper ohne eingebranntes Gesicht, Skelett `mixamorig`.
  - Clips `Idle_A` (Breathing Idle, Georg q775 A) und `Walking_B` (Walking (17), In Place).
  - Anker `KFB_Eye_L/R_anchor`, `KFB_Mouth_anchor` und `KFB_Brow_L/R_anchor` am Kopfknochen (+Z nach außen, +Y oben) als Lagehilfe.
- **Zwei Änderungen am Skelett-Objekt,** sonst greift face-mount falsch:
  1. **Maßstab 1:** Mixamo legt die Armature im Maßstab 0,01 mit Knochen in cm an. facehost.v1 misst den Kopf in der Bindepose dann 100-fach zu klein (Kopfbox 0,002 statt 0,16 m; Augen winzig, Kopfzonen verzerrt).
  2. **Drehung angewendet:** Die Armature trägt aus dem FBX-Import 90° um X. facehost misst die Bindepose ohne diese Drehung; Höhe und Tiefe waren vertauscht, der Mund saß auf der Stirn.
- **Was gleich bleibt:**
  - Gewichte, Netz und Knochennamen bleiben gleich, die Höhe auch (1,80/1,81 m).
  - Die Drehungen in den Clips bleiben unverändert. Wege (location) sind mit umgerechnet (cm → m).
  - Skript: `scripts/bot_facemount.py`, Berichte `data/q_*_facemount.r1c.json`.
- **Blickrichtung:** facehost sucht Knochen namens toes/foot. Die Mixamo-Namen (`LeftToeBase`) erkennt es nicht und nimmt +Z an. Gemessen schaut der Bot nach +Z (Zehen 0,998), das passt.

## 2 · Start-Einträge für die ToolBox
`toolbox/q_xbot.kfb-pets.json` und `toolbox/q_ybot.kfb-pets.json`, Format `kfb.pets/1` wie Georgs FB-Export (Production-02 · Rigging).
- **Augen:**
  - `eye.anchor.dx/dy` sind aus den KFB-Ankern im Raum der facehost-Box gemessen (dx ×1,15).
  - `ring` = Augenradius ×1,45, nach Georg „zu klein“.
  - `inset` 0,4, nach Georg „nicht tief genug“.
  - matte-cute, converge 0,12.
- **Brauen:** Balken über brow-rig.v2: taper 0, Dicke 2,6, Länge 0,55, Farbe Körper ×0,3.
- **Nase:** aus (`parts.nose: off`).
- **Mund:** R4 als decal-set (X `r4_buck_grin`, Y `r4_full_soft`, bis q774), 0,05 U höher als der Anker, Größe 0,5. Der Satz muss vor mountFace über `mundSaetze.registriereMundSatz` bekannt sein.
- **Geprüft im Spiel-Look** (`scripts/_wsb-bots-fm.mjs` + `scripts/fm_seite.js`): mountFace auf dem Bot, 77 Felder übernommen, 0 abgelehnt.
  - Augen 6,5–7 cm vor dem Kopfknochen, Gesicht vorn.
  - Belege: `belege/fm_r1/BOTS_facemount_gesicht_0.jpg`, Einzelbilder gesicht 0/35, figur 0. Der 35°-Blick zeigt die Köpfe im Profil, weil die Kamera auf FBs Richtung steht.
- **ToolBox-Oberfläche:** nicht geprüft. Die Seite ist privat (WSA Works). Damit sie den Bot laden kann, braucht sie:
  1. Laden eines beliebigen GLB statt des FB-Rezepts, ohne Ohren-, Haar- und Hasen-Teile.
  2. `registriereMundSatz` für R4 vor mountFace.
  3. Die GLB-Fassung r1c (Maßstab 1, ohne Objektdrehung). Ältere Bot-GLBs (r1i) setzen das Gesicht falsch.
  4. Clips nach Namen `Idle_A`/`Walking_B`; die Bibliothek bindet direkt.

## 3 · Animationsbibliothek
`bibliothek/` mit 76 GLB (11 MB) und `README.md` (Tabelle Datei → Spiel-Rolle → Mixamo-Quelle → Dauer → Hüftweg).
- **Umfang:** die 69 neuen Clips, dazu Breathing Idle, Walking (17), aus dem Locomotion Pack jump und Drehen 90° links/rechts, Shove Reaction und Ascending Stairs.
- **Form:** nur Animation, kein Netz, Skelett wie die Face-mount-GLBs. Benannt nach Spiel-Rolle (Idle_A … kfb_dance_*) bzw. sprechend (Emote_Wave, Melee_Punch_Hook, Push_Heavy …). Skript `scripts/bibliothek_export.py`, Namen `scripts/bibliothek_namen.json`.
- **Geprüft mit three.js:**
  - Alle Spuren aller 76 Clips treffen Knochen des Bot-GLB.
  - Die Hüfte steht in Metern (≈ 1 m).
  - Idle_A aus der Bibliothek weicht von der Bot-Fassung höchstens 0,05° ab; Walking_B auf dem Y Bot 1,1° (Daumen).
- **FBX** nicht im Repo.

## Offen und Übergabe an WS1
- Georgs Feinabstimmung in der ToolBox (Augen, Mund-Sitz, Brauen), danach Abstimmung → Vorschlag → Karten-Commit wie bei Hunky/Dory.
- **Einbau im Spiel:**
  - KFB_NATIVE-Darsteller für Bots (faceMountActor ist FB-spezifisch: Rezept, Ohren, Haar);
  - `mixamorigRightHand` in HAND_BONES;
  - Bibliothek in den Mixer.
- Interaktions-Clips (Tragen, Schieben, Klettern, zu zweit tragen) als Suchauftrag, siehe `BIBLIOTHEK_STAND_R1.md`.
- Die Karten `karten/q_*bot.figure.json` zeigen noch auf die Testfassung r1i (Augen-Adapter-Weg). Für den Face-mount-Weg gelten GLB r1c und der Start-Eintrag.
