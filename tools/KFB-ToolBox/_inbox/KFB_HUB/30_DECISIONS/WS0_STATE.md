# WS0 · Arbeitsstand und Ablauf (lebendes Dokument)
Stand 24.10.2026, Register bis V-729. WS1-Status jetzt auf ws1/status. Nach jedem /compact und zu Beginn jeder Steuerrunde zuerst lesen. Wird von WS0 laufend gepflegt, nicht neu erfunden.

## 1 · Ablauf für jedes Briefing und jede Antwort an eine Sitzung
0. **Jede Frage an Georg** aus einem Status, RETURN oder Briefing kommt sofort als Karte in den Hub (`decisions`). Ausnahme: Abnahmen mit Bildern auf der WS1-Abnahme-Seite präsentiert WS1 selbst in seiner Sitzung (Georg kann die Seite nicht aus dem Hub öffnen); WS0 trägt die Urteile aus dem WS1-Status ins Register ein.
1. **Bereich bestimmen:** HUD, Figuren, Licht, Welt, Fahren, Kampf, Audio oder Spiel (siehe `tools/brief_domains.json`).
2. **Erst lesen, dann schreiben:** die Specs des Bereichs aus `brief_domains.json` und den Ist-Stand (Status der Sitzung, Abnahme-Seite, letzter RETURN). Für „wie sieht es gerade aus“ gilt nur der laufende Build bzw. die Sitzung, die ihn hat, keine Referenzordner.
3. **Briefing als Datei** schreiben, dann `python3 tools/brief_gate.py <datei>` ausführen. Exit 2 bedeutet: korrigieren.
4. **Frischer Prüf-Agent** (Modell sonnet, eine Runde) mit `tools/BRIEF_GATE_PROMPT.md` und dem Paket aus `GATE/`, nur für Briefings, die Design, Specs oder Architektur betreffen. Kurze Antworten und Bestätigungen laufen nur durch den mechanischen Schritt 3. WS0 setzt die Befunde um, eine zweite Runde nur bei strukturellem BLOCK.
5. **Erst danach** folgen Register (d() + WHY + CHANGELOG, `build_decisions.py` rc=0), Sync und Hub.

## 2 · Wo die Wahrheit liegt
| Was | Ort |
|---|---|
| Entscheidungen | `build_decisions.py` → `decisions.json`, `DECISIONS.md`, `CHANGELOG.md`; GitHub-Register-Branch über `sync_github.sh` |
| 3D-Kanon | `CANON_3D/CANON_3D_R1.md` |
| Licht | `replies/LIGHT_MODEL_R2.md`, Modul kfb-stage-light |
| HUD | `replies/HUD_R4_DESIGN/BRIEF_CLAUDE_DESIGN_HUD_R4.md` (Plan), `HUD_LAYOUT_R3.md`, `HUD_UX_STATES_R1.md`; Georg arbeitet das Design extern neu aus |
| Figuren | `CHARACTERS_R1/` (Register, 133 Figuren, `GAPS.md`); Figurenkarten kfb.figure/1; E2-Referenz `replies/E2_REFERENCE/` |
| Audio | `replies/CHATTERBOX_SPEC_R2.md`, `SONG_SPEC_R3.md`, Suno: `replies/SUNO_SSOT_R1.md`; Sets unter `40_AUDIO/elevenlabs_r1/<set>_lufs` |
| Abnahmen | Bilder über die Abnahme-Seite „KFB Abnahme“ (WS1) bzw. die Proof-Stage (WSB); Fragen im Hub (`decisions`) |
| Private Assets | Repo KFB-Stunt-Car-Race, Branch assets/private; `tools/push_private_assets.sh` + `private_assets_list.txt` |
| Hub | https://claude.ai/artifact/WxG16gvt7LNrBXxYkAhr9d (Stand, Fragen, Briefings, Plan); lokale Kopie im Scratchpad, sonst vor dem Publish neu lesen |

## 3 · Sitzungen und Kanäle
| Sitzung | Status lesen | An sie schreiben |
|---|---|---|
| WS1 (Lead + b–e) | `tools/status_latest.sh` (sucht alle Branches) | oben in `replies/WS0_TO_WS1.md` |
| WS-NPC, WS-Audio | dito | dito |
| WSB (Blender, Mac mini) | Cross-Session-Nachrichten, `50_BLENDER/<job>/RETURN.md` | SendMessage; sonst `50_BLENDER/ANTWORT_WS0_2026-10-21_FLUFFER.md` |
| WSA (ToolBox, Arena) | `replies/WSA_TO_WS0_*.md`, PRs KFB-Combat-Arena | unten in `replies/WS0_TO_WSA_COMBAT_ARENA_R2.md`; Georg reicht weiter |

## 4 · Offen (Stand 24.10.)
- Übergabe-Tag ist heute (Georg zurück): WS1-Unterlagen auf ws1/status (UEBERGABE_MVP_R1.md, sessions/*.md), empfohlener Site-Stand game/mvp-r1 @188e4f7 (76 PASS). Site KFB · WS1 Staging steht hinter ChatGPT-Login; ob WSA den Stand veröffentlicht hat, ist unbestätigt (kein WSA-Return seit b203). Danach führt WS0 die Stränge zusammen.
- HeyGen: Georg produziert drei POCs von Hand (Hub b204–b206, Skripte replies/HEYGEN_POC_SKRIPTE_R1.md). Freier API-Test erst, wenn der Schlüssel im Anmelde-Schlüsselbund liegt. Offen q180 (Fantasiesprache, Ausnahme zu V-492).
- WSB: N38 Landung fertig (V-729), N36 ruht bis zum WS1-Terrain-Export, MiB-Turm (V-530) als Vorschlag ohne Bau. Konzeptblatt schreibt WS0 vor jedem Szenen-Bau.
- Figuren-Register, nächste Erzeugung: kind locus bzw. vehicle (V-714), Signatur-Deck und Tratsch-Typ (V-698), Weltwissen und Haltung (V-702), chatter.motif und chatter.grains (V-688).
- Audio: SUNO_SSOT §8 (ElevenLabs-Weg). Mindspace-Schichten liegen bereit, Mischung bei WS-Audio. S2b-Fundament nur mit Georgs Suno-Go.
- Wiedervorlage Georg: Skill kfb-deep-research installieren (Hub b211, Datei KFB_HUB/80_SKILLS/kfb-deep-research.skill). Hub q185 Splats offen (nach MVP messen?). HeyGen b204–b210 bei Georg.
- Für die Übergabe 25.10. (Georg-Backlog 24.10., zur Diskussion): Boids für HyperNorm und Mindspaces (Text aus Schwärmen, Knetkugel-Boids, Basis three.js GPGPU-Birds); Claybound-Lücken-Liste (Recherche liegt, kaum umgesetzt); prozedurale Landschaft (Erosion, Straßen mit Steigungskosten, SDF-Kreuzungen als Knet-Bänder, Voronoi-Felder, Hecken, L-System-Wälder) als Vorlage für WS1b.
- WSV: Test mit 69 BNWN-Clips, wenn Georg startet (V-723).
- Karten-JSON für den Druck: ws1/karten-druck erst nach Anpassung aller Decks durch WS1 und Georgs Ja.
- FrizzleBob: weiter gesperrt (FB_CANON), erst mit Referenzbild aus der ToolBox.
- WSA: Inventur des Arbeitsordners; Löschen nur nach Georgs Ja.

## 5 · Feste Grenzen
Keine Löschungen ohne Georgs Ja. Keine Merges. Keine Credits ohne Georgs Go im Chat. Private Assets nie öffentlich. Keine Freigaben an andere Sitzungen weiterreichen. Agenten laden nichts per git fetch in `~/KFB_GitHub_sync`. Cowork-Sitzungen werden nie gelöscht.

**Übernahmekarten (V-713):** je laufender Sitzung `sessions/<kürzel>.md` auf `ws1/status`, dazu `sessions/site.md`. WSB: `50_BLENDER/STATUS.md` + RETURN. Bei Übernahme einer Sitzung zuerst diese Karte lesen.

## Stand 25.10. abends (nach V-756)
- **WS0 baut die prozedurale MVP-Welt selbst** (V-746, V-756): Zweig `game/proc-world-ws0` im privaten Repo KFB-Stunt-Car-Race, lokal `~/kfb-ws0/kfb-mvp` (src/private und node_modules liegen dort, Platte 98 % voll). Push mit Deploy-Key `kfb_private_assets_deploy`. Site-Pakete als `site/mvp-rN-dist` für WSA (b214, R2 @e76c26a). Lokaler Test: Startkonfiguration `kfb-mvp-local` (Port 5250, /raw-Proxy).
- **kfb-place** (V-748–V-755): Regeldatei `CANON_3D/lib/kfb_place.r1.json`, Löser `CANON_3D/lib/kfb-place-core.v1.mjs` + CLI `kfb-place.mjs` (Golden-Test), Konzeptblatt `replies/KONZEPTBLATT_KFB_PLACE_R1.md`. WSB Nachtrag 36 (N39) nach N35 D. P0-Frames bei Claude Design (b224).
- **Claude-Design-Material immer über GitHub** `design/claude-design-r3/<ordner>` (hypernorm_r3, mib_turm_r1, kfb_place_p0), nie ZIPs.
- Offen bei Georg zum Rausgeben: b214 (WSA), b222 + b224 (Claude Design), b223 (WS1 nur Schritt 0).

## Stand 25.10. spät (V-797 … V-803)
- **Welt-Farben:** V-800 Biom-Paletten aus dem Generator; V-801 J17-Bänder (Boden + Erde 1 + Sand) und zweifarbige Props; V-802 Biom-Übergang Band für Band, Sprenkel nur noch mit `biot=speckle`. Spiel @3512531, Standard `veg=cartoon`.
- **V-803 Ausrollen:** Rollentabelle in `replies/COLOR_CONCEPT_R1.md` → „Nachtrag 25.10. · Ausroll-Rollen“; Brief `replies/BRIEF_FARBROLLEN_AUSROLL_R1.md` an WS1, WSA, WSB.
- **FrizzleBob:** R7 abgelehnt (q221: zwei Bisse, Ohren klobiger als v5). WSB baut R8 mit Probe A (v5-Ohren + Biss links) und Probe B (Meshy unangebissen gespiegelt + Biss links), Brief `replies/BRIEF_WSB_FB_R8_OHREN_R1.md`. Vor dem Weitergeben: Biss je Ansicht zählen. FB-Lock bleibt.
- **Offen im Stilbild:** Wiese zu gleichmäßig gefüllt (Modell R3: Ebenen und Kanten, wenig und groß); Asset-Register aller Nature-Kits für WFC.

## Fahrplan (V-805, verbindlich, Stand 25.10. spät)
| # | Stufe | Inhalt | Abschluss |
|---|---|---|---|
| 1 | Fahrphysik S1 (V-783) | Messfahrt: Landestoß, Festfahren, Kippen, Drehrate, Sprungbogen, Stand am Hang (Parkbremse). Fixes hinter Schalter in `src/m2/k2t.js`. Danach Kamera (Georg 25.10.): Folgekamera bei Drift, harten Kurven und Fassrollen träger nachziehen, sodass man den Wagen auch von der Seite sieht; zweite Spielkamera von weiter oben als Umschalter für Fahren, Flug und Gehen (Vorbild Dust-Racer-Demo, Reddit). Dann Fahrzeug-Tricks (Georg 25.10.): Fassrolle länger und mit größerem Drehradius, passende SFX; Tricks zusätzlich als Aktions-Knöpfe bzw. 3D-Icons im HUD (Interaktions-Platz V-674); Speedlines aus kfb-flight-vfx (Port Tiny Skies, heute nur im Flug) sauber ans Fahren anbinden, wenn die Bildrate es trägt. Dann Dieselpunk-Flug, Combat-Mech als Jetpack-Dummy, Drehung beim Gehen. Stand 25.10.: Fahrphysik-Fixes @baf786f, Messung alt gegen neu siehe Hub. | Vorher-nachher-Video + Messtabelle im Hub |
| 2 | Gameplay-Critic | blinder externer Prüf-Agent auf dem Stand nach Stufe 1 (Fahren, Gehen, Flug, Welt) | Bericht + Fix-Liste im Hub |
| 2b | Audio (Georg 25.10.) | Musik: Mindscape-Stems (S2, S3, S8, S13, S14, S15 in `KFB MusicalChatterbox/`) als ruhige Soundbeds statt der Radio-Tracks aus R3; Fahr-/Flug-Sound visceraler (Motor nach Drehzahl/Last, Schalten, V8-Blubbern, Boost, Wind) nach Recherche `replies/RESEARCH_VEHICLE_AUDIO_R1.md` | Hörprobe im Hub |
| 3 | Wasser | Seen und Ufer (kfbWater), Flüsse (kfb-hydro) in der endlosen Welt, Fluid-Farben aus dem Biom-Schema (V-750) | Bilder im Hub |
| 4 | Amphitheater | einpassen und farblich ins Biom integrieren (q225) | Bilder im Hub |
| 5 | Karten-Gelände | Verteilung nach Modell R3 (eine je Zone, Ortsbezug), Auto stößt Kugeln (q226) | Bilder im Hub |
| 6 | Splat-Probe | kleinster Test nach SPLAT_EXAMPLES_R2 (V-733) | Bilder im Hub |
| danach | Combat, Destruction | V-782, V-767 | |
