# G0 · Quell-Isolation FrizzleBob v5 (V-236) · R1 · 14.10.2026

Auftrag: `replies/WS0_TO_WS1.md` 14.10. morgens. Vorgaben: Modell allein zeigen, Gesichts-Stapel mit Quelle und Werten pinnen, keine Rogue-Werte übernehmen, Fehlendes als `SOURCE_REQUIRED` melden, v5b nicht stillschweigend einsetzen.
Ergebnis in einem Satz: **Modell und Code-Stapel sind gepinnt und laufen; Georgs eigener FrizzleBob-Eintrag (die Werte für Augen, Lider, Brauen, Mund, Ohren) liegt nicht im Repo, sondern nur in seinem Browser → `SOURCE_REQUIRED`.**

## 1 · Modell allein
- **Datei:** `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb`, Commit `19088b14` (Branch `chat/fb-ear-rig-v5-2026-09-25` = PR #214). Heruntergeladen, **Blob `131d7c38` bestätigt**, SHA-256 in `SHA256SUMS`.
- **Bild:** `ws1/proofs/2026-10-14-fb-g0/fb_v5_model_alone.png`, geladen mit der three-Fassung des Spiels (0.186.1), ohne jedes Gesichts-Rig. Vorn, ¾, Seite, Gesicht.
- **Inventur** (`glb-inventory.json`):
  - 14 Meshes, 7 Materialien, 1 Textur, 1 Skin mit 47 Knochen (KayKit Rig_Medium), keine Clips, T-Pose;
  - Höhe 2,94 mit Ohren, Kopfknochen bei y 1,241.
- **Gesichtsteile im Modell, je eigener Knoten:**
  - gemalte Augen `FB_Eye_L/R` (Materialien Black, White, EyeColor);
  - Brauen `Carl_Brow_L/R`;
  - Nase `Carl_Nose`;
  - gemalter Mund `FB_Mouth_Smile` (Textur, BLEND).
- **Ohren:** `FB_Ear_L/R_v5` an `ear.l.1–3` / `ear.r.1–3` unter `head`.
- **Am Bild sichtbar:**
  - Der gemalte Mund steht in ¾ und von der Seite vor dem Gesicht. Das ist der bekannte offene Punkt aus RETURN r1 („sticks out past the cheek in ¾ view“).
  - Die drei Haarbüschel fehlen im GLB. Sie kommen erst im Spender dazu (`hair-tufts.v1` aus `FrizzleBob_Yellow.gltf` @eabc8725).

## 2 · Spender und Nachlauf
- **Spender:** KFB ToolBox Production-06, Session-Cut 30.09. r1 (main @ac9dbaed, `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/`). Das ist der Stand des 7/7-Belegs, mit `EAR.fig` = v5 @19088b14.
- **Lokal ausgeliefert:** alle 45 Prüfsummen OK. Der Spender läuft mit seinem eigenen three 0.160 (unpkg). Skript `ws1/kfb-planet/scripts/fb/donor-p06.mjs`.
- **Ohne gespeicherten Eintrag** (leeres localStorage):
  - alle Teile `original`, also gemalte Augen ohne Eye-Rig (`donor_p06_default_entry.json`);
  - Bild `fb_v5_donor_p06_no_saved_entry.png`.
- **Abnahme 1–7 (Socket + Hinge) erneut laufen lassen: 6/7** (`donor_p06_acceptance_rerun.json`).
  - **3 „closed means closed“: PASS**, 0 von 2836 Strahlen treffen Augenweiß oder Pupille. Die Ton-Lider decken die Pupille also ganz ab, anders als beim Rogue-Eye-Rig (F1, Naht `pupilHiddenWhenClosed` = TUNE).
  - **6 Spiegel: FAIL**, Normale Δ 0,127° (Grenze 0,1°), Augen 31,5° außen / 1,1° hoch.
  - Der Beleg vom 30.09. hat 28,8° / 11,5°. Der Unterschied kommt vom Anker: Ohne Georgs Eintrag nimmt face-mount den Standard (dx 0,568, dy −0,243, ring 0,243). Georg hatte laut Beleg-Bild 04 Abstand 0,455 und Höhe 0,210.
  - **Folge: Der 7/7-Beleg hängt an Georgs gespeichertem Eintrag.**

## 3 · Gesichts-Stapel (KFB_NATIVE, ein Besitzer: `face-mount.v1`)
Reihenfolge laut face-mount: facehost → EyeRig → Oval → Kopfzonen → Braue → Nase → Bart → Mund. Je Teil wählt der Eintrag `parts.<teil>` = `rig` | `original` | `off`.

| Teil | Code-Quelle (gepinnt) | Werte | Status |
|---|---|---|---|
| Sitz/Leser | `kfb-lib/face-mount.v1.js` (Cut r1, Blob 535b592a), `facehost.v1.js`, `eyeoval.v1.js`, `headzones.v1.js`, `partrig.v1.js` @PIN 8922d4b1 | Eintrag `kfb.pets/1` | Code PINNED · Werte SOURCE_REQUIRED |
| Augen | `pet-eye-rig.v6.js` @8922d4b1; Sitz `socketEyes('surface')` | Belegt: Abstand 0,455, Höhe 0,210, Matte cute, Lid-Grundfarbe #F2C93C (Bild 04, gespeichert 30.09. 04:18:08); Oval 1,06/1,04/0,98/−25°, splay 0, inset 0 (CURRENT_STATE r1). ring, track, Pupillengröße, gloss, lidFit: **SOURCE_REQUIRED** | V-214 verlangt das Rig, also `eyes: rig` |
| Lider | `kfb-lib/clay-lids.v1.js` (Blob 027d5af6) | Abnahme lief mit `hinge`. Georgs gespeicherter Eintrag war laut RETURN LIDS-02 „on: true · glide“ | **SOURCE_REQUIRED + WS0-Entscheid** (hinge = Beleg, glide = Georgs Speicherstand) |
| Brauen | Modell `Carl_Brow_L/R` oder `brow-rig.v2.js` @8922d4b1 | Auf Bild 04 sind die Modellbrauen zu sehen; `brow.turn`-Folge ist „Georg's call“ | Auswahl SOURCE_REQUIRED |
| Nase | Modell `Carl_Nose` oder `pet-nose.v2.js` | Bild 04: Modellnase | Auswahl SOURCE_REQUIRED |
| **Mund** | Modellmund `FB_Mouth_Smile` + 13 Laute-Decals aus `pet-mouth.v1.js` @8922d4b1 + `kfb-lib/lipsync-text.v1.js` (Text → Mundbild-Spur, Deutsch/Englisch) | Viseme/Laute vorhanden. Der Spender spricht über speechSynthesis; die Spur geht auch ohne Ton (= „mime“, V-Vorgabe Stimme). | **Mund vorhanden (kein SOURCE_REQUIRED).** Offen: Passform in ¾ (MOUTH-FIT-01 kam erst in der v5b-Linie) |
| Ohren | `ear-dangle.v1.js` @19088b14 (Blob 6bb4531a), `kfb-lib/ear-base.v1.js`, `rigs/fb-default.ear-rig.json` (Blob 5ab5e8bc) | Standard-Rig gepinnt. Georgs gespeicherte Ohren (laut FLOPPY-01: dangle 1,5 · stiff 1 · damp 0,8 · …) stammen aus der v5b-Linie | Werte SOURCE_REQUIRED |
| Haare | `kfb-lib/hair-tufts.v1.js` + `FrizzleBob_Yellow.gltf` @eabc8725 | drei Büschel | Code PINNED |
| Oberfläche | `body-surface.v2.js` + `clay/clay-material.v10.js` (K2), `contact-ao.v1.js` | im Eintrag (`surface`) | SOURCE_REQUIRED |
| Bewegung | `pose-rig.v1.js`, KayKit Rig_Medium General/MovementBasic/Advanced @b97b5ac5, Ruhe `Idle_A` | — | Code PINNED |

## 4 · Fallen (bitte beachten)
1. **Die Kennung `frizzlebob-earrig-v5` lädt ab Cut r2 die Figur v5b.**
   - FLOPPY-01 hat in P06 `EAR.figPin` auf `FB_TEMPLATE_LOOK_v5b.glb` @23615cff umgestellt. P08 (01.10.) pinnt `EAR_FIG` 23615cff. Joyride J17 nimmt v5b als Standardfigur.
   - Nur der r1-Beleg (30.09. 04:21) lief sicher auf v5. Georgs Eintrag unter dieser Kennung kann danach auf v5b nachgestellt worden sein.
2. **Georgs Eintrag liegt nur im Browser.** Er steht in Claude Design im localStorage, unter den Schlüsseln `kfb-toolbox-production-06` und ab 01.10. `kfb-toolbox-production-08`.
   - Joyride J17 bestätigt das („Georgs gespeicherter FB-Eintrag liegt nur in seinem Browser“) und hat deshalb eigene Werte fest eingesetzt. Diese übernimmt WS1 nicht.
3. **three-Fassung:** Der Spender läuft auf three 0.160, das Spiel auf 0.186.1. Die F1-Spender liefen auf 0.186 unverändert. Für face-mount, clay-lids und pet-mouth prüft WS1 das im Darsteller-Slot (Bildpaar Spender | R3F).

## 5 · Was gebraucht wird (ein Schritt)
**Georgs FrizzleBob-Eintrag als Datei ins Repo.**
- In der ToolBox: **Rigging › Import · Export › Export** auf der Seite, auf der Georg FrizzleBob v5 eingestellt hat.
- Das lädt ein `kfb.pets/1`-JSON herunter, mit eye, clayLids, brow, nose, mouth, ears, surface und emotes.
- WS0 entscheidet, welcher Stand gilt:
  - P06 mit dem Stand vom 30.09. 04:18 (Figur v5), oder
  - ein späterer Stand, dann mit Bestätigung, dass er auf v5 und nicht auf v5b eingestellt wurde.
- WS0 legt die Datei ab und meldet den Pfad.
- Danach baut WS1 den Darsteller-Slot mit genau diesem Eintrag. Abnahme: Bildpaar bzw. Clip Spender | R3F mit demselben Eintrag.

## 6 · Was WS1 bis dahin tut (ohne Werte zu erfinden)
- Der Darsteller-Vertrag für Nicht-KayKit-Figuren und `faceDriver` exklusiv kommen in den Code, der Diff geht in `WS1_STATUS`.
- face-mount und seine Module werden 1:1 eingebunden (Vite-Alias wie F1).
- **Code-Pfad-Parität** Spender | R3F läuft mit einem ausdrücklich markierten Prüf-Eintrag: dem Standard-Eintrag des Spenders plus `eyes: rig` und den Abnahmewerten des 30.09.
- Das ist nicht Georgs Look und geht nicht an Georg.
