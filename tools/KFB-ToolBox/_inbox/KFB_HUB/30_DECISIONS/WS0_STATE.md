# WS0 · Arbeitsstand und Ablauf (lebendes Dokument)
Stand 24.10.2026, Register bis V-729. WS1-Status jetzt auf ws1/status. Nach jedem /compact und zu Beginn jeder Steuerrunde zuerst lesen. Wird von WS0 laufend gepflegt, nicht neu erfunden.


## 0 · Stand 29.10. abends (Register bis V-1046) – zuerst lesen
- **Seit 31.10. (V-1059, V-1060):** Sechs Arbeiten parallel auf eigenen Branches (spike/viertel-r1, module/card-edge-r1, design/kartengebaeude-r1, cast/alle-figuren-r1, game/flight-mib-r1, WS1-Testlink N-004); WSB Rakete, dann K10, Badewanne/Cape; WS0 merged nach So 20 Uhr; Gap-Liste Perplexity `replies/PERPLEXITY_GAP_R1.md`.
- **Überholt durch V-1060:** Fokus bis So (V-1041): WS1-Integrationsblock hat Vorrang; keine neuen Nebenaufträge; Kleinkorrekturen genau eine Runde; Gate-Prüfer nach §1.4 (sonnet, eine Runde, nur Design/Specs/Architektur) – am 29.10. zu oft und zu breit eingesetzt.
- **Kanal WS1 (V-1024):** Branch `comms/ws0-ws1` im privaten Repo, Worktree `~/kfb-ws0/comms-wt`; nur auf Georgs Zuruf lesen, kein Polling. Stand: Q-001–Q-008 beantwortet bzw. zur Kenntnis, N-001–N-003 gesendet.
- **Stand 31.10. früh (Georg AFK):** Hub q323–q329 beantwortet (V-1089). Laufend: WS-Verteiler (Dichte, Mustergarten), WS-Himmel, WS-Weltwissen, Spiel-Sitzung (`game/ufo-licht-r1`, UFO-GLB, Icon), Kartenkante (Site-Bereitschaft), Figuren (OVERRIDE, Merge), Mess-Spike (Seite), WS1 (N-012, braucht Georgs „schau in den Kanal“). WSB wartet. Georg hat Kanal-Hinweis bekommen, ob erledigt unbekannt. Merge in `game/integration-r2` nur mit Georg (Rechteprüfung), Samstagabend. Nach Merge: Pop-up-Dioramen V-1085, federnde Props V-1086, Gilliam V-1087, Asset-Linie V-1088.
- **Aktueller Plan (V-1083):** `replies/AFK_PLAN_R1.md`. Stopp für neue Aufträge bei 70 % Wochenbudget.
- **Keine Termine (Georg 31.10., V-1077):** Keine Sonntags-Grenze mehr. game/integration-r2 ist der Stamm, jede Sitzung bringt ihren Branch nach Georgs KEEP selbst hinein, hinter Schalter, mit fester Testliste. Ältere Zeilen mit „nach So“ in diesem Dokument gelten nicht mehr.
- **Regel (Georg 31.10.):** „Offen bei Georg“ gilt nur mit Hub-Frage. Grenze Blender und Spiel: V-1065. Weltwissen-Entwurf: V-1066, Hub q313.
- **WSB (Mac mini, „Blender-Jobs für KFB“, Adresse per ListAgents holen):** Rakete r1e, Cape R1, MiB V1 geliefert (assets/private, V-1062). Läuft (V-1064): Flug-Clips für Rig_Large, Badewanne R6; Auswahl aller Flug-Clips liegt bei WSB. K10 auf Ansage bei Kampf-Slice. Kein Stopp wegen „nach So“: Die Grenze gilt nur für den Merge in die Integration.
- **Spielrichtung (V-1049, 30.10.):** Karten und Weltwissen zuerst, Fluff Nebensache, Leben und Fluff getrennt. Intake der übrigen Bausteine aus PR 460 nach So.
- **Offen bei Georg:** HUD-Prototyp b271 (Claude Design, Paket design/claude-design-r3/hud_r1) zum Durchklicken.
- **Wartet auf Rückgabe:** WSA Prop-Pool R2 (b264), WSA audio Songs/ASMR (b266), WSA Cascade R5 Folgeauftrag (Pappwand-Zielsequenz, schreibt WS0 nach So), WSA Site R5.2 (b260).
- **Nach So, Reihenfolge:** Architektur-Seite + Mess-Spike Stadt/Gelände/Zerstörung/Fluff/Rauch (V-1042/V-1043) → Figuren freischalten + Lückenliste (V-1027) → HUD-Einbau nach KEEP → Reise-Zubehör/Rauch (V-1030, V-1033) → MiB-Mannequin, Waffen-VFX (V-1044).

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
| 1 | Fahrphysik S1 (V-783) | Messfahrt: Landestoß, Festfahren, Kippen, Drehrate, Sprungbogen, Stand am Hang (Parkbremse). Fixes hinter Schalter in `src/m2/k2t.js`. Danach Kamera (Georg 25.10.): Folgekamera bei Drift, harten Kurven und Fassrollen träger nachziehen, sodass man den Wagen auch von der Seite sieht; zweite Spielkamera von weiter oben als Umschalter für Fahren, Flug und Gehen (Vorbild Dust-Racer-Demo, Reddit). Dann Fahrzeug-Tricks (Georg 25.10.): Fassrolle länger und mit größerem Drehradius, passende SFX; Tricks zusätzlich als Aktions-Knöpfe bzw. 3D-Icons im HUD (Interaktions-Platz V-674); Speedlines beim Fahren: gebaut, aber geparkt (Georg 25.10.: überlagern Frontansichten, sitzen nicht cartoonig hinten; nur speedlines=1). Dann Dieselpunk-Flug, Combat-Mech als Jetpack-Dummy, Drehung beim Gehen. Stand 25.10.: Fahrphysik-Fixes @baf786f, Messung alt gegen neu siehe Hub. | Vorher-nachher-Video + Messtabelle im Hub |
| 1b | Hero-Run-Teaser (Georg 25.10.) | Shot-Liste `replies/HERO_RUN_SHOTLIST_R1.md`, Skript `scripts/m2/hero-run.js` (Mitschnitt aus dem Canvas → `60_VIDEO/hero_run_r1/raw/`), Aufnahme nach Fassrolle, Speedlines, Motor-Audio; Schnitt in Video-Sitzung (Remotion), Track aus dem Pool (Vorschlag Surf & Rockabilly 150 BPM), Abspann Logo + Credits (Meshy-Urheber folgt) | Clip im Hub |
| 2 | Gameplay-Critic (R1 25.10.: 4/10, V-825) | blinder externer Prüf-Agent auf dem Stand nach Stufe 1 (Fahren, Gehen, Flug, Welt) | Bericht + Fix-Liste im Hub |
| 2b | Audio (Georg 25.10.) | Musik: Mindscape-Stems (S2, S3, S8, S13, S14, S15 in `KFB MusicalChatterbox/`) als ruhige Soundbeds statt der Radio-Tracks aus R3; Fahr-/Flug-Sound visceraler (Motor nach Drehzahl/Last, Schalten, V8-Blubbern, Boost, Wind) nach Recherche `replies/RESEARCH_VEHICLE_AUDIO_R1.md`; dazu (Georg 25.10.) ElevenLabs-SFX-Satz nach Ereignis-Audit (jedes Spiel-Ereignis: hat Ton? passt Timing?) für Motor-Ohne-Last, Turbo, Flug, Fassrolle, Bremsen, Drift, Banking, Kollision, Bumps, Abheben/Landen, Rauch, Fahrtwind, Racer-/Flug-/Destruction-Layer und Soundscape; Recherche + Kritiker vor der Generierung | Hörprobe im Hub |
| 2c | Fahrzeug-Seele (Georg 25.10., V-810) | KnuckleBob als Seele aller beseelten Fahrzeuge: HeyGen-Clips (Englisch, sarkastisch, Kayfabe) in einer abschaltbaren Vignette, Rahmen in der Fahrzeug-Grundfarbe; Pilot 6 Anlässe × 8 Sprüche `replies/VEHICLE_SOUL_PILOT_R1.md`; Bildpaket Vignette vor dem Bau | Hub-Karte Sprüche → Georg produziert in HeyGen → Einbau |
| 3 | Wasser | Seen und Ufer (kfbWater), Flüsse (kfb-hydro) in der endlosen Welt, Fluid-Farben aus dem Biom-Schema (V-750) | Bilder im Hub |
| 4 | Amphitheater | einpassen und farblich ins Biom integrieren (q225) | Bilder im Hub |
| 5 | Karten-Gelände | Verteilung nach Modell R3 (eine je Zone, Ortsbezug), Auto stößt Kugeln (q226) | Bilder im Hub |
| 5b | Endlos-Welt komplett (Georg 25.10., V-815) | world=endless und veg=cartoon als Standard (heute nur per Adresse aktiv; ohne Hash laufen Insel-Probe und alter endlessVeg); Bewuchs je Biom (placeVeg schickt dem Worker bisher fest biome 'moos', Befund Prüfpaket R2); Bühnen und Dioramen mit Terrain-Einbettung, Übergängen aus Steinen/Fragmenten und Dünen-Logik prozedural integriert (Georg, V-817); später Unity-Inseln als Baustein eingebettet, schwebend oder schwimmend (V-819); Wasser im Endlos-Gelände (aus 3); Orte, Bühnen, Dioramen und Karten je Zone prozedural und reproduzierbar verteilt (aus 5, auf alle Baukästen); Bewohner, Fluffer, Obstgärten, Fluff je Zelle mit festem Seed; Gedächtnis je Zelle (eingesammelt, gesprengt, erledigt); mitwandernder Weltursprung für große Entfernungen; Orientierung (Kompass/Minikarte, POI-Hinweise, später Fahrzeug-Seele) | Video einer langen Fahrt ohne Rand, mit Orten und Bewohnern, im Hub |
| 6 | Splat-Probe | kleinster Test nach SPLAT_EXAMPLES_R2 (V-733) | Bilder im Hub |
| danach | Combat, Destruction | V-782, V-767 | |

- 25.10. spät nachts: V-830 externe Prüfung R2 umgesetzt (V-831 Zellgrenzen q240), V-832 Rollentabellen (WSB Schritt 2 läuft), V-833 Zoom Ich-Sicht↔Drohne, V-834 Karten über die Welt (q241: welche Karten?), V-835 Mindscape-Sphäre in der Welt (q242). Als Nächstes: Café; offen KB-Clip „Nope…“, Schwimm-Clips, Claude-Design-Feinschliff Sphäre.
- 25.10. nachts: Critic-Fixes V-826 Bänder gröber, V-827 Durchblick-Portal, V-828 Geländeschatten kräftiger (q238). V-829 Bühnenfarben: 7/21 fertig (q239), WSB Runde 2 r829 als letzte Farbrunde für 12, Grüne Ruinen wie geliefert. Offen: Café ins Spiel, Critic R2, Trick-Knöpfe (b240), Café-Zeile ankunft 4 „mon ami“.
- 25.10. spät abends: V-818 Fahrzeug-Seele im Spiel (q234 A Plakette unten rechts, KB-Knopf); V-817 Georg Utopia r814 PASS → Ausrollen bei WSB; V-815 Fahrplan 5b; Prüfpaket R2 (b234).
- 25.10. abends: V-807 Fahrgefühl-SFX eingebaut (q228 PASS); Teaser v1 passt, Tuning vor dem Posten (q229); V-809 Meshy-Bühnen voll (q230); V-810 Fahrzeug-Seele Pilot freigegeben, Sprüche PASS (q231), HeyGen-Skript b238 bei Georg; V-811 Mindscape-Betten für Fahrt/Flug im Spiel.
- 25.10. spät: Stufe 1 Fahren erledigt (V-783 Fixes, Kameras, Fassrolle länger/höher, Motor-Audio ±28 %/Last/Live-Auto/langer 5. Gang). Hero-Run: 22 Clips in 60_VIDEO/hero_run_r1/raw (Flammen-Dragster, Parade 14 Racer, Bullet-Time S05, Spiel-Ton), Schnitt läuft in WSV-Agent nach BRIEF_WSV_HERO_RUN_CUT_R1. Offen in Stufe 1: Tricks als HUD-Knöpfe, Dieselpunk-Flug, Mech, Drehung beim Gehen; dann Gameplay-Critic.

## Stand 27.10. (nach V-872, Konsolidierung)
- **Spiel:** `game/proc-world-ws0` @51c9cbe = gemeinsamer Stand WS0 + WS1 (`game/mvp-r1` @9a95ea9). S1 hat zwei Wege: `mount=live`/`CAR_LIVE` (Basis) und `travel=1` (WS1, hinter Schalter); summon/dismount setzen `TRAVEL.car`, damit `carLive()` überall stimmt.
- **Tests:** `bash test/npc-suite.sh` nach `npx vite build` (75/80; c2/c3g Altfehler, stage/cast/drift brauchen ~/kfb-ws1). Stumme WS0-Prüfung: `node scripts/ws0/feature-check.mjs` gegen Site-Build (`node scripts/site/build-site.mjs`, Server kfb-mvp-local 5250).
- **Site:** Paket R4 `site/mvp-r3-dist` @ec7b057, Übergabe WSA Hub b244.
- **Sync:** nur `zsh sync_github.sh` im Vordergrund aus `30_DECISIONS` (V-871).
- **Offen:** eyeoval-Vereinheitlichung mit Sichtprüfung (V-870); q249/q253/q254 im Hub; Krater geparkt (V-863); Einbettung (V-864) geparkt.

## Stand 27.10. abends (nach V-876)
- V-873 Deck-Analyzer übernommen; V-875 Bewertung Mission Control + Ego Mania eingetragen (kayfabizarro data/kfb-deck-analyzer-r1 @6773f20). q256 Bildvergleich Uruk/Anti-Rules offen bei Georg.
- V-874 P3 Höhenmuster: Brief an WS1 (Gate PASS), b245 wartet auf Weitergabe.
- V-876 im Arbeitsbaum ~/kfb-ws0/kfb-mvp (noch nicht committet): Schatten und Bänder Standard wie vorher, Portal queres Oval mit organischem Rand; Prüfbild mit scripts/look/portal-shot.mjs ausstehend.
- Übersetzung restlicher Spieltexte (Dialog, hudL3, Hud, HudClay, M1World-Ziele …) im Arbeitsbaum, noch nicht gebaut/getestet. Danach: vite build, npm test, feature-check, Portal-Bild, Commit + Push game/proc-world-ws0.

## Stand 27.10. spät
- Erledigt: V-884 Portal waberend + Dach-Fahrer Lenkrad/Ohren (q260 PASS), V-885 Props 30° gekippt (Icons R2 + schwebende Fundsachen), V-886 WSB-Auftrag Käfer-Dach (b247, Gate PASS), V-887 Blasen nie über Köpfen + Pfeil zur Kopfmitte (global). Spiel game/proc-world-ws0 @31c8ea8.
- Offen bei Georg: q261 Portal, q262 Icons R2, q263 Blasen; Briefings b244–b247.
- HUD-Design läuft in einer anderen Sitzung weiter (design/hud-icons-r1: Gemini-Vorlagen R3, R4-Entscheidungen). WS0 liefert nur Objekt-Renders (renders_r2).
- Nächster WS0-Schritt: Cartoon-Locomotion V-880, Gate SOURCE_ISOLATION_01; danach Dach-Anker für die übrigen Racer.
- 27.10. nachts: WSB arbeitet V-886 → V-891 → V-890 (Quellen/Konzeptblätter in 50_BLENDER/V886_KAEFER, CARTOON_LOCO, J7; WSB pusht nicht, WS0 bringt Stände auf Branches, Abnahme-Blätter aus <Job>/out/abnahme/ in Hub). Cartoon-Loco Gate 01 erledigt (V-889). Offen bei Georg: q264 Portal-Rasterpunkte; WS1-Paket „Bewuchs je Biom“ wartet auf Georgs Ja; b245 wartet auf Weitergabe. Bei J-7 R2: roofDriver.js auf Vertrag r2 + Clip-Datei r2 erweitern.

## Stand 28.10. spät (nach V-980) · Sparmodus bis So 22 Uhr
- **Budget:** WS0 hat gut 40 % des Wochenvolumens verbraucht, Reset So 22 Uhr. WS0 schreibt bis So keinen Spielcode, steuert nur (Hub, Register, Merges). Reserve Sa/So tagsüber für Merge-Hilfe.
- **Spiel:** `game/proc-world-ws0` @9fc8d09 (privates Repo). Pflicht-Tests: host, j7-roof (13 + Wechsel), closing-build, fb-shoulder-shadow, `node test/fb-canon.mjs`, dazu feature-check gegen Site-Build (lokal mit /raw-Proxy, Skript im Scratchpad rawproxy.py-Muster).
- **Site:** Paket R5 `site/mvp-r5-dist` @891a81a, Hub b257 an WSA. R6 nach WS1-Übergabe So.
- **WS1:** Integrations-Block V-963 (b256, Brief `replies/BRIEF_WS1_INTEGRATION_SLICES_R2.md`), Zweig `game/integration-r2`, Übergabe So 20 Uhr auf ws1/status (UEBERGABE_INTEGRATION_R2.md, ein Commit).
- **WSA:** Cascade Sphere (b248; Brief `replies/WS0_AN_WSA_V962_CASCADE_SPHERE_POC_R2.md`, Konzept `replies/KONZEPT_CASCADE_SPHERE_GAME_IN_GAME_R1.md`), zuerst Quellen-Gate + Designpaket an WS0. Danach P2: b254 Prop-Pool, b255 Resident Atlas.
- **WSB:** ruht. Werkzeuge camLock, lieferung.py, groessen.py (WSB_TOOLS). Offener Wunsch: A11 sauber als Template exportieren, dann ganzer FB-Tausch statt Ohr-Graft.
- **Offen bei Georg:** q312 ASMR (übernommen), VFX-01-Auswahl (Review Bank), itch.io-Explosions-Flipbooks nur nach Ja, Push-Schlüssel für WSB (Vorschlag 5).
- **Regel neu:** Abnahme-Clips immer im Spiel-Look (`look=terrain3`), nie in der Testwelt (grüner Boden, orange Kuppel).
- **Nach dem Reset (So):** erster WS0-Slice KFB Random Maze (V-984), Design zuerst; Quellen in `replies/GIZMO_MAZE_RECOVERY_R1.md`.
- **Danach (V-985):** Tunnel (4 Skins aus Joyride/Orgel-Attraktionen), Berge/Schluchten (mit WS1 b245), Mine und Untergrund-Ebenen bzw. Rabbit Holes unter Karten-Geländen.
- **Site:** R5.1 `site/mvp-r51-dist` @b3b8ae8 (b258). Cascade Sphere: Quellen-Gate HOLD bei WSA (V-986).
- **Leitidee nach dem Golden (V-1002):** Kartenviertel als Hauptachse der Karten-Platzierung, `replies/KONZEPT_KARTENVIERTEL_R1.md`; zuerst Module aus der Cascade Sphere ins Hauptspiel übernehmen.
- **Verteiler (V-1007):** `replies/KONZEPT_KFB_VERTEILER_R1.md` – nach dem Reset Himmel und Planeten (N Körper, verteilt) als WS0-Slice.
- **29.10. nachts:** WS1-Start Fr 30.10. früh ab @72fbb25 (b256 aktualisiert). Site R5.2 bei WSA (b260). WSA-Golden R4 läuft; Gesamtupdate Gutter-Spec + Treffer-Löcher (V-1000/V-1001) noch nicht an WSA, wird nachgebrieft. Offene Kleinigkeiten: inneres Portal Mindscape, steile Kamera vor der Kuppel, „CM“-Icon, fb-shoulder-shadow endless_gold_hals.

## 29.10. vormittags
- V-1009: WSA-Golden R4 mit Bürgersteig + Treffer-Löchern zurück, Mechanik PASS, Kritik REWORK 7,1; Golden-Entscheidung bei Georg. b248 done.
- V-1010: Web-Chat-Gewichte R1 (PR 459) als optionale I2-Startwerte in WS0_TO_WS1 + b256.
- V-1011: Golden-Feedback Georg (Loch≠Treffer, Bänder grau) → Ausbau-Vorschlag Treffer-Grammatik R17, Bänder farbig, Heilstrahl=Bau/Heil-Werkzeug. WS1 gestartet (b256 done).
- V-1014 Gatling-Seitenhaltung nachgetragen; WSA-Brief R5 (V-1011) Gate PASS nach 5 Runden, Konzeptblatt KONZEPTBLATT_CASCADE_R5_TREFFER_R1; WSB K10 R2 in Prüfung.
- WSB K10 R2 Schusswaffen Gate PASS (8 Runden), Hub b262. Schilde (Survivalist, Monstrosity u. a.) als Ergänzung vorgeschlagen, wartet auf Georg.
- V-1018 Paket-Check; MiB-Turm-Paket R2 (design/claude-design-r3) Gate PASS, Hub b222 v5. V-1019/1020 Energieschild-Tune + MiB-Sphäre. Offen: Georg zu 3D-Werkbank Energieschild und UFO-Lab-Bausteinen.
- V-1022 FAIL MiB-Paket bei Claude Design (keine Bildgenerierung); RECEIVER_CAPABILITIES_R1 + Guard im brief_gate; b222 done(FAIL). Memory kfb-claude-design-capabilities.
