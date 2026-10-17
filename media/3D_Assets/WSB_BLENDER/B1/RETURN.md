# RETURN · B1 · Motion Library auf den KayKit-Mumien · WSB · 2026-10-17

**Status: DONE · PASS WITH NOTES · Georg-Video PASS (17.10.)** (alle 5 Clips binden sauber auf Mummy_A und Mummy_B, keine gebrochenen Glieder). Offen sind Durchdringungen, Fußrutschen und Toe-Dips (siehe unten). Die Tempo-Faktoren für 118 BPM liegen in `tempo.json`. **Wartet auf WS0-Review und Georgs Blick aufs Video.**

## Abschnitt 0 (Arbeitsplatz)
- Blender 5.2.2 LTS + MCP verbunden (Standardszene). Es laufen 2 blender-mcp-Serverprozesse, vermutlich doppelt registriert.
- Dropbox synchron: `DECISIONS.md` 17.10. 02:07.
- Platte 55 GB frei. Swap nach dem Schließen von Programmen 0,5 / 2 GB. **RAM gesamt 16 GB** → Watchdog-Grenze 8 GB (siehe STATUS).
- Kein Klon `~/Developer/kayfabizarro-publish`. Quellen sind gepinnt, siehe unten.

## Quellen (Git-Blob-SHA = GitHub `main` @904f0e9, byte-gleich)
| Datei | Repo-Pfad | Blob |
|---|---|---|
| `_src/KFB_Motion_Library_Rig_Medium.glb` | `media/3D_Assets/Animations/KFB_Motion_Library/` | 45e12910 |
| `_src/Mummy_A.glb` | `media/3D_Assets/KayKit_Mystery_Series6/KayKit Mummy/characters/` | f844b3da |
| `_src/Mummy_B.glb` | dito | 539552ec |

Beat-Raster: `KFB_HUB/40_AUDIO/pharaoh_piledriver__suno_01a/beats.json` (118,000 BPM Stems, Mix 117,748 BPM). Song: `30_PACKAGES/deck_song_pharaoh_stage/.../pharaoh_piledriver__suno_01a.mp3`.

## Methode
- **Runtime-Pfad wie Blender-Lauf R1/R2:** three.js r180 + GLTFLoader, Bibliothek per AnimationMixer direkt auf die Mumien-Szene gebunden (gleiche Knochennamen). Ton: K1 `clay-material.v8` + `clay-profiles.v2` (byte-gleich mit `replies/CLAUDE_DESIGN_STAGE_LIVE_R1/vendor/k1/`), Profil `figure`, Handmaß ×1/0,47, Licht wie `proof_r2.html`. Proofs 1920 px ohne Overlays.
- **Messung:** jeder Frame bei 30 fps, skinned Vertices in Weltkoordinaten (`b1.html?mode=measure`). Auswertung mit `scripts/b1_analyse.py`.
  - *Gebrochene Glieder:* lokale Knochen-Offsets und Skalierung gegenüber Rest.
  - *Durchdringung:* Ray-Parity-Test, ob jeder 6. Hand- oder Unterarm-Vertex in der skinned Body- oder Head-Schale liegt. Ein Frame zählt, wenn ≥ 10 % der Stichprobe drin sind. Bei „Unterarm im Körper“ ist die Idle-Grundlage abgezogen, weil die KayKit-Armschalen auch im Idle im Torso stecken.
  - *Fuß:* gilt als aufgesetzt bei tiefstem Fuß-Vertex < 1,5 cm. Als Rutschen zählt eine horizontale Geschwindigkeit des Fußknochens > 0,25 m/s, während der Fuß aufgesetzt ist.
  - *Tempo:* Autokorrelation von Hüfthöhe und Bewegungsenergie (Hände, Füße, Kopf, Hüfte, Brust), gefaltet auf 80–160 BPM, quantisiert auf ganze Schläge pro Loop. Die Beat-Phase ist der tiefste Hüftpunkt.

## Ergebnis Checks (Mummy_A = Mummy_B bis auf Kopf-Kleinigkeiten, gleiches Skelett)
| Clip | Glieder | Hand im Körper | Hand/Unterarm im Kopf | Fuß rutscht (aufgesetzt) | tiefster Toe-Dip | Urteil |
|---|---|---|---|---|---|---|
| `kfb_idle_happy_a` | starr | 0 % | 0 % | 2–7 % | 4,9 cm | **PASS** |
| `kfb_dance_hip_hop_a` | starr | 20 % | 2 % / 1 % | 49–58 % | 10,2 cm @ 2,0 s | PASS WITH NOTES |
| `kfb_dance_wave_hip_hop_a` | starr | **62 %** (Worst: Hände ganz im Bauch @ 16,2 s) | 6 % / 0 % | 35 % | 9,9 cm | PASS WITH NOTES |
| `kfb_dance_slide_hip_hop_a` | starr | **90 %** (verschränkte Arme in der Brust) | 3 % / 1 % | 50–55 % (Slide ist Absicht) | 12,6 cm | PASS WITH NOTES |
| `kfb_dance_house_a` | starr | 33 % | **26 % / 18 %** (starke Vorlage, großer Kopf) | 41–45 % | **14,4 cm** @ 10,8 s | PASS WITH NOTES |

- **Gebrochene Glieder: keine.** Knochen-Offset und Skalierung sind in allen Clips auf beiden Mumien exakt 0 (`data/bone_check.json`), die Bibliothek rotiert nur. Die gemessene Kantendehnung bis ~2,2× kommt von den Kanten über hart gewichteten KayKit-Gelenken. Die Schalen überlappen dort, sichtbar ist nichts. Sie ist nur als Info in `checks.json` vermerkt.
- **Ursache der Durchdringungen:** Die Mixamo-Armbahnen stammen vom schlanken Orc. Auf dem Chibi-Bauch und dem großen Kopf der Mumie gehen die Hände hinein. Gut zu sehen in `renders/B1_check_hiphop_hands_f184.png`.
- **Boden:** Im Median stehen die Füße nur 0,2–1,6 cm zu tief. Die großen Werte sind kurze Toe-Taps, bei denen die Fußspitze durch den Boden geht (`renders/B1_check_house_foot_f324_seeground.png`, halbtransparenter Boden). Hände und Kopf kommen nie unter den Boden. Es gibt keine Frames in der Luft.

## Tempo → 118 BPM (`tempo.json`)
| Clip | natürlich | Loop-quantisiert | Sicherheit | **Faktor 118** | Faktor Mix 117,748 | Beat-Phase | Loop bei 118 |
|---|---|---|---|---|---|---|---|
| `kfb_dance_house_a` | 94,5 | 93,78 (31 Schläge) | hoch | **1,2582** | 1,2556 | 0,520 s | 15,76 s |
| `kfb_dance_wave_hip_hop_a` | 122,7 | 124,51 (35) | mittel | **0,9477** | 0,9457 | 0,452 s | 17,80 s |
| `kfb_dance_slide_hip_hop_a` | 141,9 | 141,92 (41) | mittel (Alternative 114,3) | **0,8314** | 0,8297 | 0,114 s | 20,85 s |
| `kfb_dance_hip_hop_a` | 102,8 | 100,98 (23) | **niedrig** (106,1 / 131,5 möglich) | **1,1686** | 1,1661 | 0,334 s | 11,70 s |
| `kfb_idle_happy_a` | 141,5 | 141,57 (7) | hoch | 0,8335 | 0,8317 | 0,150 s | 3,56 s |

- **Verwendung:** `action.timeScale = playback_factor_118` bei Stems bzw. dem 118,000-Raster, `playback_factor_mix_117_748` bei Georgs Mix-mp3. Den Clip so starten, dass die Clipzeit `beat_phase_s` auf einen Schlag fällt.
- `alt_whole_bar_factor_118` gibt eine Alternative an: Der Loop wird dann genau n Takte lang, dafür ignoriert er den eigenen Beat des Clips.
- Tempo nur aus Bewegung ist bei Oktaven mehrdeutig. Für hip_hop und slide gibt es deshalb Alternativen, und das Video ist der eigentliche Ohr-und-Augen-Test.

## Video (Bonus, Georgs Blick)
`renders/B1_mummy_duet_pharaoh_chorus1.mp4`: 1920×1080, 30 fps, 15,04 s, H.264 + AAC. Inhalt ist Refrain 1 („Pharaoh, Pharaoh, Piledriver! Wrestle like a mummy master!“), Mix 81,91–96,94 s.
- Takte 1–4: beide `house_a` synchron.
- Ab Takt 5: A `wave_hip_hop_a`, B `hip_hop_a`, mit 0,25 s Blend auf dem Downbeat.

Alle Clips laufen mit den Faktoren aus `tempo.json` und sind per Beat-Phase auf den Downbeat gelegt. Der Ton-Offset ist per Hüllkurven-Korrelation geprüft: 81,90 s statt 81,91 s erwartet, r = 0,977. Das Muxen lief in Blender headless (VSE) unter dem Watchdog: Spitze 4,2 GB RSS, 10 s.

## Dateien
- `tempo.json`
- `data/`: `checks.json`, `measure.json` (Rohdaten pro Frame), `bone_check.json`, `inspect.json`, `sheets.json` (Zeiten der 4 Panels), `video_plan.json`
- `renders/`
  - `B1_sheet_<clip>.png` (5×, 2×2 Panels, A links, B rechts, Panel 4 = schlimmster gemessener Frame)
  - 3 Check-Frames
  - Video
- `proof/b1.html` + `proof/vendor/` (K1-Kopien)
- `scripts/wsb_proof_server.py`, `b1_analyse.py`, `b1_video_mux.py`
- `../_tools/wsb_watchdog.sh`
- `_src/` (gepinnte Quellen)

Die 451 Video-Einzelbilder (68 MB) liegen nur im Scratchpad, nicht in Dropbox.

## Infrastruktur-Hinweise für WS0
- Auf dem Mac mini gibt es kein node, kein ffmpeg und kein Playwright. Proofs laufen im eingebauten Browser von Claude Code. Der Proof-Server muss aus einem Scratch-Spiegel liefern, weil macOS dem Preview-Python den Dropbox-Ordner sperrt.
- Neuer Eintrag `wsb-b1-proof` (Port 5241) in `~/Dropbox/CLAUDE/.claude/launch.json`, additiv. 5180 und 5192 sind unberührt.
- Blender 5.x: Video-Ausgabe braucht `image_settings.media_type = 'VIDEO'`.

## NOT_RUN / offen
- **Keine Prüfung im Blender-Rig.** Gemessen wurde bewusst im three.js-Runtime-Pfad, wie bei R1. Blender MCP wurde nur für Abschnitt 0 benutzt.
- KFB-EyeRig nicht aufgesetzt: Die Mumien zeigen ihre Original-Texturaugen.
- Kein 9:16. Keine Performance-Messung.
- **Fixes nicht gebaut:**
  - Hand- und Arm-Korrektur für Chibi-Proportionen (z. B. additive Arm-Spreizung oder Hand-Offset-Layer).
  - Fuß-Lock bzw. Toe-IK.
  - Root-Lift ~1 cm.
- Tempo hip_hop mit niedriger Sicherheit, siehe oben.
- Georg-Review: offen.

## Georg-Review (Chat, 2026-10-17)
- Video: **PASS** („gefällt mir tatsächlich sehr gut … sehr, sehr cool“).
- Hände im Bauch / im Chibi-Kopf: tritt häufig auf, ist cartoonig genug und verzeihlich. Entweder in Kauf nehmen oder später ein **globaler Fix für Selbstkollision**.
- Neue Idee (→ B1b-Vorschlag an WS0): Momente mit energetischer oder dramaturgisch wichtiger Voice-Performance finden. Die singende Figur wechselt dann mit sauberem Übergang aus dem Tanzloop in eine Sing-/Belt-Pose.

## Nächstes Gate (eins)
~~Georg-Blick aufs Video~~ → **PASS** erhalten. Nächstes Gate: **WS0 vergibt B1b (Voice-Performance-Choreografie)** und entscheidet, ob der globale Selbstkollisions-Fix ein eigener Job wird.
