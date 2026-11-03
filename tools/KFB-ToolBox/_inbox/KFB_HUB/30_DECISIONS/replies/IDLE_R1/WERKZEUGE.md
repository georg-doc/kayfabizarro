# IDLE_R1 · Werkzeuge für Idles, Lücken und Übergänge · WSB 04.11.2026

## WSB-Entscheid (Kurzfassung)
- **Bestand vor Eigenbau:**
  - Basis-Idle aus KayKit Idle_A/Idle_B und Motion Library `kfb_idle_breathing_*`.
  - Miniclips und Tanz aus der Motion Library und aus Mixamo (über die vorhandene Library-01-Pipeline), dazu CC0 (Quaternius UAL) und CMU-BVH mit Quellenangabe.
- **Weiche Übergänge macht die Laufzeit, nicht ein Generator:**
  - Miniclips beginnen und enden in der Basis-Pose.
  - Überblendung 0,2–0,4 s, Rückblende vor dem Clip-Ende.
  - Kein ML-Inbetweening nötig.
- **NVIDIA „Motion Boxes“ = sehr wahrscheinlich MotionBricks** (SIGGRAPH 2026). Es passt ins Konzept (Bausteine, Übergänge zwischen Schlüsselposen), läuft aber nur auf NVIDIA-GPU, kennt nur das SOMA-Skelett und exportiert kein BVH/FBX. → später.
  - Der brauchbarere NVIDIA-Weg für echte Lücken wäre Kimodo: Text plus Schlüsselposen, BVH-Export. Er braucht eine fremde NVIDIA-GPU und danach ein Retarget SOMA→KayKit. → später.
- **Arme im Körper (Messung WSB, FrizzleBob v5b):**
  - Ursache ist die Proportion, nicht ein falsches Retarget: FBs Rumpf ist breiter als der der Mocap- und KayKit-Darsteller.
  - Vorher steckten 18–90 % der Arm-Ecken im Rumpf (Motion Library), bei KayKit 8–17 %.
  - Korrektur: ein fester Abspreizwinkel von 18° für den Oberarm, im Raum des Brustknochens, in jedes Bild jedes Clips gebacken (`arm_korr.mjs`). Kein Keyframe von Hand.
- **Aufgabengrenze V-1065:** Die Korrektur liefert WSB als korrigierte Clip-Dateien je Figurengruppe. Die Variante „Quaternion nach dem Mixer“ (siehe §4) würde einen Knochen-Offset im Spielcode bedeuten; das bleibt nach V-1065 bei WSB, darum gebacken statt Laufzeit.
- **Offen bei festem Winkel:** Erhobene Arme (Tanz, Strecken beim Gähnen) und Hand-am-Kopf-Gesten werden mitgedreht. Für diese Clips gilt ein Gewicht je Clip in `clips.json`, sonst eine eigene Fassung.

---

---

## 0 · Kurzantwort „NVIDIA, Stichwort Motion Boxes“

**Wahrscheinlichster Treffer: NVIDIA MotionBricks** (SIGGRAPH 2026 / ACM TOG, arXiv 2604.24833; Presseberichte ab 15.06.2026). Name und Inhalt passen gut: „Bricks“ ≈ „Boxes“, und es geht ausdrücklich um Spiel-Animation, Echtzeit-Erzeugung und **Inbetweening zwischen Schlüsselposen** („Smart Primitives“ für Fortbewegung und Objekt-Interaktion, Demo in Unreal Engine 5).
Einen NVIDIA-Begriff „Motion Boxes“ habe ich **nicht** gefunden (eigene Suche nach der exakten Phrase ohne Treffer). Die Zuordnung ist also eine begründete Vermutung, kein Beleg.

Zwei weitere NVIDIA-Projekte aus demselben Team (2026) kommen als Erinnerung ebenfalls in Frage:
- **Kimodo** (16.03.2026): Text-zu-Bewegung mit Schlüsselposen-/Pfad-Vorgaben, **BVH-Export** (nur SOMA-Skelett).
- **ARDY** (Juli 2026, SIGGRAPH 2026): Echtzeit-Bewegung aus fortlaufendem Text plus Vorgaben (Pfad, Wegpunkte, Ganzkörper-Schlüsselposen).

Gemeinsam: Alle drei laufen auf NVIDIA-GPUs (MotionBricks ausdrücklich TensorRT → **NVIDIA-GPU Pflicht**), Skelett ist NVIDIAs **SOMA** (77 Gelenke) bzw. Unitree G1, nicht KayKit. Auf dem Mac mini **nicht lokal lauffähig**. Nutzbar wären sie nur über einen Umweg: auf fremder GPU erzeugen → SOMA-BVH → in Blender auf KayKit retargeten.

---

## 1 · Mixamo (Adobe)

| Feld | Inhalt |
|---|---|
| Was | Online-Bibliothek mit tausenden Mocap-Clips + Auto-Rigger, kostenlos mit Adobe-ID |
| Link | https://www.mixamo.com · FAQ (Adobe-Community-Abschrift): https://community.adobe.com/t5/mixamo-discussions/mixamo-faq-licensing-royalties-ownership-eula-and-tos/td-p/13234775 |
| Lizenz | Laut FAQ lizenz- und gebührenfrei für persönliche **und kommerzielle** Projekte, ausdrücklich auch Videospiele/DLC; keine Namensnennung nötig. **Verboten:** rohe Charakter-/Animationsdateien weitergeben (Asset-Packs, Stock, Weitergabe an Nicht-Team), **Training von ML-Modellen**. Kommerziell: **ja**, eingebettet im Spiel. |
| Graubereich | Web-Spiel: die GLB-Dateien sind im Browser abrufbar. Üblich gilt das als „im Spiel eingebettet“, nicht als Weitergabe; nie als eigenes Animationspaket veröffentlichen. Herkunft der Library-01-FBX (welches Konto, wann) sollte dokumentiert sein. Adobe pflegt Mixamo kaum noch (Login-Störungen 2025 gemeldet), kein Abschaltdatum bekannt. |
| Ein-/Ausgabe | Download FBX (Binary/ASCII) oder DAE, 30/60 fps, „In Place“-Option; Upload FBX/OBJ zum Auto-Riggen. Skelett immer Mixamo-Rig (65 Knochen inkl. Finger). |
| Idle-Bestand | Belegt: **Breathing Idle**. Aus dem Katalog bekannt (vor Nutzung im Katalog per Suche „idle“ bestätigen): Happy Idle, Bored, Looking Around, Weight Shift, Yawn, Sad Idle, Standing Idle-Varianten, Head Scratch o. ä.; viele Tänze (Hip Hop, Samba, Silly Dancing, Chicken Dance, Twist …). Laut MOTION_GUIDE sind Mixamo-Tänze schon in `DL`. |
| Retarget auf KayKit | Mixamo selbst kann nicht auf fremde Skelette retargeten. Weg: Clip „ohne Skin“ laden → in Blender auf Rig_Medium/Large übertragen (so ist Library 01 entstanden). Ohren: nirgends Mocap – immer prozedural oder von Hand. |
| Passt für | Lücken-Clips ✓✓ · Idle-Variation ✓✓ · Tanz ✓✓ · Übergänge – · Arm-Korrektur – |
| Aufwand | klein (Pipeline steht schon) |
| Urteil | **nutzen** – erste Quelle für Miniclips und Tanz |

Ergänzende freie Quellen mit Idles (gleiche Retarget-Pipeline):

| Name | Was | Link | Lizenz | Format | Urteil |
|---|---|---|---|---|---|
| Quaternius Universal Animation Library 1/2 | 120+ Spiel-Clips (Fortbewegung, Emotes, Sitzen …), freie Standard-Version 45 Clips | https://quaternius.com/packs/universalanimationlibrary.html | **CC0** (kommerziell ja) | FBX, glTF, .blend (Source) | **nutzen** (CC0 passt zum KayKit-Bestand; Idle-Umfang im Pack prüfen) |
| Rokoko „10 free everyday idle animations“ | 10 Alltags-Idles, Ganzkörper, 30 fps | https://www.rokoko.com/resources/rokoko-mocap-10-free-everyday-idle-animations | kommerziell ja („passion project to commercial use“); Weitergabe nicht geregelt | FBX, **Mixamo-Skelett** | **später** – Download nur über Registrierungsformular (Marketing-Einwilligung) → Georgs Entscheidung |
| KayKit Character Animations 1.1 / 1.2 legacy | Eigenbestand: Idle_A/Idle_B (Medium + Large), Dance nur im Legacy-Rig 1.2 | https://kaylousberg.itch.io/kaykit-character-animations | CC0 | GLB/FBX | **nutzen** als Basis-Idle-Start; Legacy-Dance probeweise cross-rig |

---

## 2 · NVIDIA (Kandidaten zu „Motion Boxes“)

| Name | Was | Link | Lizenz (kommerziell?) | Eingabe/Ausgabe, Rig | Passt für | Aufwand | Urteil |
|---|---|---|---|---|---|---|---|
| **MotionBricks** (SIGGRAPH 2026, Juni 2026) | Ein neuronales Modell für Echtzeit-Bewegung (Bericht: 15 000 fps, 2 ms), trainiert auf ~350 000 Clips (BONES-SEED, ~700 h); „Smart Primitives“: Fortbewegung über Tempo/Richtung/Stil, Objekt-Interaktion über Schlüsselposen, Modell füllt dazwischen. Demos: **Inbetweener** (Posen setzen → Bewegung durch alle), Szenen-Editor. | Projekt: https://nvlabs.github.io/motionbricks/ · Code: https://github.com/NVlabs/motionbricks · Paper: https://arxiv.org/abs/2604.24833 | Code **Apache-2.0**, Modelle **NVIDIA Open Model Agreement** (kommerziell **ja**, NVIDIA beansprucht keine Ausgaben; Rechte erlöschen bei Umgehen von Schutzmechanismen), Beispiel-Bewegungen nur Evaluation-Lizenz | Laufzeit Python + Warp/Newton/**TensorRT → NVIDIA-GPU nötig** (getestet RTX 4090, Windows/Linux). Skelett **SOMA** oder Unitree G1. Modelle als ONNX/SafeTensors. **Kein BVH/FBX/glTF-Export** im README; eigene Rigs nicht vorgesehen. | Übergänge ✓✓ · Lücken-Clips ✓ · Idle-Variation (✓) · Arm-Korrektur – | groß | **später** (kein Mac, kein Export, SOMA-only) |
| **Kimodo** (16.03.2026; Modell-Updates bis 15.10.2026) | Kinematisches Bewegungs-Diffusionsmodell: Text + Vorgaben (Ganzkörper-Schlüsselposen, Hand/Fuß-Ziele, 2D-Pfad, Wegpunkte); Timeline-Editor im Browser, CLI für Stapel | Code: https://github.com/nv-tlabs/kimodo · Doku Formate: https://research.nvidia.com/labs/sil/projects/kimodo/docs/user_guide/output_formats.html · Modell: https://huggingface.co/nvidia/Kimodo-SOMA-RP-v1 | Code Apache-2.0; SOMA-Modelle **NVIDIA Open Model License** (kommerziell ja, „ready for commercial use“); SMPL-X-Modell nur **R&D-Lizenz** (nicht kommerziell) | Ausgabe NPZ, **BVH (nur SOMA, 77 Gelenke, cm, ZYX)** per `--bvh`, G1-CSV, AMASS-NPZ. ~17 GB VRAM (Text-Encoder auf CPU: < 3 GB, langsamer). Getestet RTX 3090/4090/A100, Linux; **Mac nicht erwähnt**. | Lücken-Clips ✓✓ (z. B. „scratches head, yawns“) · Übergänge ✓ (Schlüsselposen-Vorgaben) · Idle-Variation ✓ · Arm-Korrektur – | mittel–groß (fremde GPU + SOMA→KayKit-Retarget) | **später** – der realistischste NVIDIA-Weg, falls Mixamo-/CC0-Bestand Lücken lässt |
| **ARDY** (Juli 2026, SIGGRAPH 2026) | Autoregressive Diffusion, Echtzeit (~33 ms) aus fortlaufendem Text + Pfad/Wegpunkten/Schlüsselposen; Ziel: Spielfiguren-Steuerung, Robotik | https://research.nvidia.com/labs/sil/projects/ardy/ · https://github.com/nv-tlabs/ardy | Checkpoints öffentlich (u. a. G1); Lizenz im Detail **nicht geprüft** | SOMA/G1, NVIDIA-GPU | Übergänge (✓) | groß | **nicht** (Forschung, Laufzeitmodell, kein Mac) |
| BONES-SEED (Datensatz hinter Kimodo/MotionBricks) | ~350 000 Mocap-Clips, BVH, SOMA-Skelett | https://huggingface.co/datasets/bones-studio/seed | **unklar** – Zugriff nur nach Anmeldung/Zustimmung; Anbieter verkauft größere Sätze kommerziell | BVH (SOMA), USD | Lücken-Clips (✓) | mittel | **nicht** ohne Klärung (Anmeldung + Lizenz) |
| ProtoMotions / SOMA Retargeter / GR00T-WBC | Physik-Simulation/RL für Humanoide; SOMA→Roboter-Retarget | github.com/NVlabs (ProtoMotions, GR00T-WholeBodyControl) | offen (Apache) | Isaac/Newton, Roboter-CSV | – | groß | **nicht** (Robotik) |
| Audio2Face | Gesichtsanimation aus Audio (Blendshapes) | NVIDIA ACE | – | braucht Blendshapes | – | – | **nicht** (KFB-Figuren haben keine Blendshapes; Sprechen = Nicken + Mund-Tausch) |

Unsicherheit: Ob Georg MotionBricks, Kimodo oder etwas aus Omniverse meint, ist nicht eindeutig. Für „Boxes/Bausteine + Übergänge“ spricht am meisten **MotionBricks**; für „Clips erzeugen, die ich exportieren kann“ wäre **Kimodo** das brauchbarere Werkzeug.

---

## 3 · Offene Motion-Generatoren, Übergänge, Datensätze, Blender, Cascadeur

### 3a · Generatoren (Text-zu-Bewegung)

Grundproblem fast aller: trainiert auf **HumanML3D/KIT**, abgeleitet aus **AMASS**. AMASS-Lizenz: nur nicht-kommerziell, und ausdrücklich verboten, damit Netze für kommerzielle Nutzung zu trainieren (https://amass.is.tue.mpg.de/license.html). Code-Lizenz MIT/Apache heißt also **nicht**, dass die Ausgaben fürs Spiel sauber sind. Dazu SMPL-Körpermodell (eigene, nicht-kommerzielle Lizenz).

| Name | Was | Link | Lizenz (kommerziell?) | Ein/Aus, Rig | Passt für | Aufwand | Urteil |
|---|---|---|---|---|---|---|---|
| MDM – Motion Diffusion Model (2022, letzte News 02/2025) | Text-zu-Bewegung, Editieren (in_between, upper_body) | https://github.com/GuyTevet/motion-diffusion-model | Code MIT; Daten/SMPL nicht-kommerziell → **nein** | Ausgabe xyz-Positionen/SMPL (.npy, .obj); CUDA-GPU nötig | Lücken-Clips, Übergänge (Forschung) | groß | **nicht** |
| MoMask (CVPR 2024) | Maskierter Transformer, Text-zu-Bewegung, „Temporal Inpainting“ | https://github.com/EricGuo5513/momask-codes | Code MIT; HumanML3D → **nein** | **BVH-Export** (22 Gelenke), WebUI läuft auf CPU | Lücken-Clips, Inpainting | mittel | **nicht** (Lizenz der Ausgaben); höchstens Ideen-Skizzen |
| T2M-GPT (2023) | VQ-VAE + GPT, Text-zu-Bewegung | https://github.com/Mael-zys/T2M-GPT | Code Apache-2.0 (nicht einzeln geprüft); HumanML3D → **nein** | Joints/SMPL | Lücken-Clips | mittel | **nicht** |
| MotionGPT (2023) | Bewegung als „Sprache“ für LLM | https://github.com/OpenMotionLab/MotionGPT | Code MIT (nicht einzeln geprüft); HumanML3D → **nein** | SMPL | Lücken-Clips | mittel | **nicht** |
| HY-Motion 1.0 (Tencent, 30.12.2025) | 1-Mrd.-Parameter Flow-Matching, Text-zu-Bewegung | https://github.com/Tencent-Hunyuan/HY-Motion-1.0 · Lizenz: https://huggingface.co/tencent/HY-Motion-1.0/raw/main/LICENSE.txt | „Tencent HY-Motion 1.0 Community License“: **Gebiet schließt EU, UK und Südkorea aus**; Ausgaben dürfen außerhalb des Gebiets nicht genutzt werden; > 1 Mio. MAU Extra-Lizenz | 24–26 GB VRAM | Lücken-Clips | groß | **nicht** (in der EU nicht lizenziert) |
| Kimodo (s. §2) | – | – | SOMA-Modelle kommerziell ja (NVIDIA-Daten, kein AMASS) | BVH SOMA | – | – | einziger Generator mit sauberer Spiel-Lizenz → **später** |

### 3b · Übergänge / Inbetweening / Motion Matching

| Name | Was | Link | Lizenz | Ein/Aus | Passt für | Aufwand | Urteil |
|---|---|---|---|---|---|---|---|
| Robust Motion In-betweening (Ubisoft, 2020) – Nachbauten | Übergänge aus Kontext- und Zielpose | Nachbau u. a. https://github.com/jihoonerd/Conditional-Motion-In-Betweening | trainiert auf LAFAN1 → **nicht kommerziell** | BVH (LAFAN1-Skelett), Python/PyTorch alt | Übergänge | groß | **nicht** |
| Two-Stage Transformers (Qin et al., TOG 2022) | Offizieller Code + vortrainierte Modelle | https://github.com/victorqin/motion_inbetweening | Code s. Repo; Modelle auf LAFAN1 → **nein** | BVH | Übergänge | groß | **nicht** |
| orangeduck/Motion-Matching (Holden) | Lehrreiche Motion-Matching- und Learned-MM-Umsetzung, C++/raylib, auch WebAssembly | https://github.com/orangeduck/Motion-Matching | Code **MIT**, Daten LAFAN1 (nicht kommerziell) | eigene Datenbank aus BVH | Übergänge (Fortbewegung) | groß | **nicht** für Idle (Motion Matching lohnt erst bei viel Fortbewegungs-Mocap); als Lesestoff gut |
| Unity/Godot-MM (MIT) | z. B. MotionMatchingUnity, godot_motion_matching | github.com/unitycoder/MotionMatchingUnity, github.com/v-sekai/godot_motion_matching | MIT | Engine-gebunden | – | groß | **nicht** |

Fazit Übergänge: Für Idle-Miniclips braucht man **kein** ML-Inbetweening. Weiche Übergänge entstehen zuverlässig durch (1) Miniclips, die in der Basis-Idle-Pose beginnen und enden, und (2) Crossfade 0,2–0,4 s in three.js. ML lohnt erst bei vielen Fortbewegungs-Übergängen.

### 3c · Datensätze

| Name | Lizenz | Kommerziell | Format | Urteil |
|---|---|---|---|---|
| CMU Graphics Lab Mocap (+ cgspeed-BVH-Umwandlung) | laut CMU/cgspeed frei für Forschung **und** kommerzielle Projekte, Bitte um Quellenangabe (mocap.cs.cmu.edu); eine HF-Kopie markiert CC-BY-4.0 → Quellenangabe als sichere Wahl | **ja** (mit Nennung) | BVH | **nutzen** als Reserve (viel Alltagsbewegung, Qualität schwankt, Fingerlos – passt zu KayKit) |
| LAFAN1 (Ubisoft La Forge) | **CC BY-NC-ND 4.0** (+ „All Rights Reserved“-Vermerk) | **nein**, auch keine Ableitungen | BVH | **nicht** |
| AMASS | nur nicht-kommerzielle Forschung; Training kommerzieller Netze verboten | **nein** | SMPL | **nicht** |
| HumanML3D / KIT-ML | abgeleitet aus AMASS bzw. eigenen Bedingungen | **nein** | Features/SMPL | **nicht** |
| BONES-SEED | Anmeldung + eigene Lizenz, ungeklärt | ? | BVH (SOMA) | **nicht** ohne Klärung |

### 3d · Blender-Retargeting

Wichtig: Blender 5.0 hat die alte Action-API (`action.fcurves`, `action.groups`) entfernt (Action-Slots seit 4.4). **Retarget-Addons/Skripte von vor 4.4 laufen nicht mehr** – Versionsstand jedes Addons vor Einsatz prüfen. Blender hat weiterhin **kein eingebautes Retargeting** (laut Sekundärquellen; offizielle Release Notes nicht geprüft).

| Name | Was | Link | Lizenz/Preis | Ein/Aus | Passt für | Aufwand | Urteil |
|---|---|---|---|---|---|---|---|
| **Retarget** (KBS-DEV) | Retarget mit vielen Presets (Mixamo, Unreal, VRoid, MMD, Daz, ARP), eigene Presets, „Apply As Rest Pose“ | https://extensions.blender.org/add-ons/retarget/ | **GPL-3.0**, über offizielle Blender-Extensions-Plattform, Version 5.2.0 (23.08.2026), braucht Blender ≥ 5.0 | alles, was Blender importiert (FBX/BVH/glTF) | Lücken-Clips ✓ · Arm-Korrektur ✓ (Ruhepose angleichen) | klein | **nutzen** (aktuell gepflegt, kein Konto) |
| Auto-Rig Pro – Remap | Bewährter Remapper für beliebige Armaturen, Bone-Mapping, Versätze | Superhive (Blender Market) | kostenpflichtig (Full ~50 $, Lite ~25 $ laut Sekundärquellen; Remap nur in Full) | FBX/glTF-Export inklusive | Lücken-Clips ✓ · Arm-Korrektur ✓ | klein–mittel | **später** (wenn Retarget-Addon nicht reicht; Kauf = Georg) |
| Rokoko Retargeting | Kostenloses Retarget-Addon | rokoko.com | kostenlos, **Rokoko-Konto nötig**; Blender-5-Kompatibilität unbelegt | – | Lücken-Clips | klein | **nicht** (Konto, Stand unklar) |
| Expy Kit | Rig-Werkzeuge: Binding an andere Armatur, Namens-Konvertierung (Rigify/UE → Mixamo), Bake, Hips→Root-Motion | https://github.com/pKrime/Expy-Kit | Lizenz im README nicht genannt (Blender-Addons i. d. R. GPL); Release-/Versionsstand unklar | – | Hilfswerkzeug | klein | **später** |
| Humanoid Remap Studio | Humanoid-Retarget | https://extensions.blender.org/add-ons/humanoid-remap-studio/ | Extensions-Plattform, Blender ≥ 5.1 | – | Lücken-Clips | klein | **später** (nicht geprüft) |

### 3e · Cascadeur

| Feld | Inhalt |
|---|---|
| Was | Keyframe-Animation mit KI-Autoposing, **AI-Inbetweening**, AutoPhysics (physikalisch plausible Schwerpunkt-/Gewichtsverläufe), Retargeting (Pro) |
| Link | https://cascadeur.com/plans · Lizenz-FAQ: https://cascadeur.com/blog/general/cascadeurs-new-licensing-structure-comprehensive-faq |
| Lizenz | **Free**: nur nicht-kommerziell, Export nur .casc, 300 Bilder/120 Gelenke · **Indie**: €19/Monat oder €8/Monat jährlich, kommerziell bis 100 000 $ Umsatz/Finanzierung pro Jahr, Export FBX/DAE/USD/**glTF** · **Pro** €49/€33: unbegrenzt kommerziell, Retargeting, AutoPhysics mit Umgebung |
| Mac | **Apple Silicon (M1+) ab macOS 13.3 unterstützt** |
| Passt für | Idle-Variation ✓✓ (von Hand posen, Physik macht Gewicht glaubwürdig) · Übergänge ✓ (Inbetweening) · Arm-Korrektur ✓ (Clip nachbearbeiten) · Ohren ✓ (eigene Knochen keyframen) |
| Aufwand | mittel (neues Programm, Rig-Import KayKit testen) |
| Urteil | **später** – bester Kandidat für handgemachte Cartoon-Miniclips (Ohrenwackeln, Kratzen), sobald Mixamo/CC0 ausgeschöpft sind; Indie-Kauf = Georgs Entscheidung |

---

## 4 · three.js-Laufzeit (r184 im Projekt)

| Baustein | API (Doku threejs.org) | Rolle im Idle-System | Urteil |
|---|---|---|---|
| Crossfade | `action.crossFadeTo(next, dauer, warp)` / `crossFadeFrom(…)`, `fadeIn/fadeOut(dauer)`, `setEffectiveWeight(w)` | Basis-Idle ↔ Miniclip ↔ Tanz, 0,2–0,4 s | **nutzen** |
| Einmal-Clips | `setLoop(THREE.LoopOnce, 1)`, `clampWhenFinished = true`, Mixer-Event `'finished'` | Miniclip zu Ende → zurückblenden. Bibel §2: nicht genau am Clip-Ende abtasten (Sprung auf Bild 0) → Rückblende **vor** dem Ende starten (z. B. bei `duration − fade`). | **nutzen** |
| Additive Clips | `THREE.AnimationUtils.makeClipAdditive(clip, referenzBild = 0, referenzClip = clip, fps = 30)`; Action mit `blendMode = THREE.AdditiveAnimationBlendMode` | **Atmen** (Brust/Schultern, 3–4 s Schleife) und **Gewicht** (Hüfte seitlich) als eigene Schicht über jedem Grundclip – auch über Miniclips und Tanz (dort Gewicht senken). Vorbild: three.js-Beispiel `webgl_animation_skinning_additive_blending`. | **nutzen** |
| Teilclip | `AnimationUtils.subclip(clip, name, start, ende, fps)` | lange Mixamo-Idles in kurze Miniclips schneiden | **nutzen** |
| Pose-Korrektur | Variante A: additiver Ein-Pose-Clip (Korrekturpose gegen Ruhepose, Referenz = Ruhepose). Variante B: nach `mixer.update()` je Bild Quaternion auf `upperarm.l/.r` vormultiplizieren (wie `setGaze` in `stage3d.js`, „nach dem Mixer“). | Arme aus dem Körper | **nutzen** (B ist am einfachsten und wirkt auf alle Clips; A, wenn die Korrektur je Clip blendbar sein soll) |
| Zufall ohne Wiederholung | eigene Logik (Shuffle-Bag oder „nicht gleich dem letzten“), Pause 4–10 s Basis-Idle zwischen Miniclips, Langeweile-Zähler → Tanz nach z. B. 30–60 s, jede Eingabe setzt zurück | – | klein, eigener Code (kein Werkzeug nötig) |

Hinweise zur Arm-Korrektur (passt zum vorhandenen `arm_korr.mjs`, das einen festen Abspreizwinkel in alle Spuren backt):
- Ursache ist meist nicht „falsch retargetet“, sondern **Proportion**: Mocap-Darsteller sind schmal, KayKit-Torsos breit und kurzarmig. Gleicher Gelenkwinkel → Arm im Bauch. Ein fester Versatz ist das übliche Mittel (auch Retarget-Addons bieten Ruhepose-Angleichung bzw. Versatz je Knochen).
- Grenze des festen Versatzes: Clips mit erhobenen Armen (Cheering, Tanz, Gähnen mit Strecken) werden mit überdreht. Verfeinerung: Korrektur nur dort, wo der Arm nahe am Rumpf ist (Mindestwinkel zwischen Oberarm und Rumpfachse; darunter wird hochgeklemmt, darüber bleibt der Clip unverändert). Das ist eine kleine Funktion nach dem Mixer, kein neues Werkzeug.
- Unterarm/Hände beim Kratzen und Gähnen: Hand soll Kopf erreichen; nach Abspreizen Ziel ggf. verfehlt → bei diesen Clips Korrektur abschwächen (Gewicht je Clip in `clips.json`).
- Ohrenwackeln: In keinem Mocap-Bestand (Ohrknochen gibt es nur bei FrizzleBob) → als additive Schicht von Hand (Blender/Cascadeur) oder prozedural (Feder/„ear-dangle“, schon im Spiel vorhanden).

---

## 5 · Empfehlung (kleines Team, Blender, Mac mini ohne NVIDIA-GPU)

1. **Bestand vor Erzeugung:** Basis-Idle aus KayKit Idle_A/Idle_B; Miniclips (umschauen, kratzen, gähnen, Gewicht verlagern) und Tanz aus Mixamo (Library-01-Pipeline) plus **CC0-Quellen** (Quaternius UAL, CMU-BVH mit Quellenangabe). Herkunft der Mixamo-Dateien im Projekt festhalten; Mixamo-Dateien nie als Paket weitergeben.
2. **three.js macht die Weichheit:** Atmen + Gewicht als additive Schicht (`makeClipAdditive`), Miniclips `LoopOnce` mit Crossfade 0,2–0,4 s, die Rückblende vor dem Clip-Ende starten, Shuffle-Bag gegen Wiederholung, Langeweile-Timer → Tanz. Miniclips so schneiden (`subclip` bzw. in Blender), dass sie nahe der Basis-Pose beginnen und enden – das ersetzt jedes ML-Inbetweening.
3. **Arme einmal zentral korrigieren:** fester Abspreiz-Versatz (wie `arm_korr.mjs`) als Startwert, dann als Laufzeit-Schicht nach dem Mixer mit Mindestabstand-Klemme und Gewicht je Clip, damit erhobene Arme und Hand-an-Kopf-Gesten nicht leiden. Für neue Retargets in Blender das gepflegte **Retarget-Addon (KBS-DEV, GPL, Blender ≥ 5.0)** mit Ruhepose-Angleichung nutzen; ältere Addons (vor Blender 4.4) meiden.
4. **Ohren und Cartoon-Gesten von Hand:** Ohrenwackeln prozedural (vorhandenes ear-dangle) oder als kurze additive Blender-Clips. Wenn mehr handgemachte Miniclips nötig werden: **Cascadeur Indie** (Apple Silicon, glTF-Export, AI-Inbetweening, kommerziell bis 100 k$) – Kauf und Lizenz = Georgs Entscheidung.
5. **NVIDIA (MotionBricks/Kimodo) und Text-zu-Bewegung parken:** MotionBricks braucht NVIDIA-GPU/TensorRT, exportiert kein BVH/FBX und kennt nur SOMA/G1. Kimodo ist der einzige Generator mit sauberer kommerzieller Modell-Lizenz und BVH-Export, läuft aber nicht auf dem Mac mini (fremde NVIDIA-GPU + SOMA→KayKit-Retarget nötig) → später, nur für echte Lücken. MDM/MoMask/T2M-GPT/MotionGPT (AMASS/HumanML3D) und HY-Motion (EU ausgeschlossen) **nicht** für das Spiel verwenden.

---

## Quellen (Auswahl, Primärquellen fett)
- **https://nvlabs.github.io/motionbricks/** · **https://github.com/NVlabs/motionbricks** · https://arxiv.org/abs/2604.24833 · https://www.gigazine.net/gsc_news/en/20260615-nvidia-motionbricks/
- **https://github.com/nv-tlabs/kimodo** · **https://research.nvidia.com/labs/sil/projects/kimodo/docs/user_guide/output_formats.html** · **https://huggingface.co/nvidia/Kimodo-SOMA-RP-v1**
- **https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-open-model-license/**
- **https://research.nvidia.com/labs/sil/projects/ardy/** · https://github.com/nv-tlabs/ardy
- https://huggingface.co/datasets/bones-studio/seed
- https://community.adobe.com/t5/mixamo-discussions/mixamo-faq-licensing-royalties-ownership-eula-and-tos/td-p/13234775 (helpx-FAQ selbst lieferte 403)
- **https://amass.is.tue.mpg.de/license.html** · **https://github.com/ubisoft/ubisoft-laforge-animation-dataset**
- **https://github.com/GuyTevet/motion-diffusion-model** · **https://github.com/EricGuo5513/momask-codes** · **https://github.com/Tencent-Hunyuan/HY-Motion-1.0** · **https://huggingface.co/tencent/HY-Motion-1.0/raw/main/LICENSE.txt**
- **https://github.com/orangeduck/Motion-Matching** · https://github.com/victorqin/motion_inbetweening · https://github.com/jihoonerd/Conditional-Motion-In-Betweening
- https://groups.google.com/g/cgspeed/c/DSAjQI2iqWM (CMU/cgspeed-Lizenzaussage)
- **https://extensions.blender.org/add-ons/retarget/** · https://github.com/pKrime/Expy-Kit · https://www.blendernation.com/2021/12/23/retargeting-using-rokoko-complete-guide/
- **https://cascadeur.com/plans**
- **https://quaternius.com/packs/universalanimationlibrary.html** · https://www.rokoko.com/resources/rokoko-mocap-10-free-everyday-idle-animations
- **https://threejs.org/docs/pages/AnimationUtils.html** · **https://threejs.org/docs/pages/AnimationAction.html**

Nicht geprüft bzw. nur Sekundärquelle: Mixamo-Idle-Namen außer „Breathing Idle“; Auto-Rig-Pro-Preis; T2M-GPT-/MotionGPT-Code-Lizenz; ARDY-Lizenz; Blender ohne eingebautes Retargeting; BONES-SEED-Lizenztext.
