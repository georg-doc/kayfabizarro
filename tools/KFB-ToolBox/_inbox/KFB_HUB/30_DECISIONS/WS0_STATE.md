# WS0 · Arbeitsstand und Ablauf (lebendes Dokument)
Stand 22.10.2026, Register bis V-689. WS1-Status jetzt auf ws1/status. Nach jedem /compact und zu Beginn jeder Steuerrunde zuerst lesen. Wird von WS0 laufend gepflegt, nicht neu erfunden.

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

## 4 · Offen (Stand 22.10.)
- FrizzleBob: R2 und R3 sind FAIL, WSA ist pausiert, FB gesperrt (`50_BLENDER/FB/data/FB_CANON.json`). Weiter erst mit Referenzbild aus der ToolBox (P08) und Bildvergleich.
- Charakter-Register: Verbraucher anschließen (Spiel, WS-NPC, WS-Audio, ToolBox, Dramatis Personae nach `CHARACTERS_R1/DRAMATIS_PERSONAE_LINK.md`); Georg entscheidet doppelte Kit-Körper.
- HUD: 16 Ist-Bilder (A = Spiel, B = R5f) liegen auf der WS1-Abnahme-Seite; Georg gestaltet extern. WSB baut am HUD nichts.
- Hub: q168 beantwortet (V-684, Ink-Flüsse); q169 Ziel-Pfeil zurückgestellt bis WS1-Ist-Bilder hud=wood.
- WS1 §149: sechs Abnahmen warten auf Georg (Flamme v2, Scheinwerfer-Kegel, look-r2 1–7, Kit-Knete 0/1/2, Schattenseite, Startseite) plus Gold-Licht violett; Kritiker R4 danach.
- WSA: Inventur des Arbeitsordners (36 GB), Löschen nur nach Georgs Ja.
- Chatterbox: 156 Familien-Clips fertig; Suno-Solo-Tests erzeugt Georg; offen: Hub q177 (Clips-Go), q178 (Familien je Gruppe), q179 (Ducking); Register-Felder chatter.motif/grains bei nächster Erzeugung ergänzen; Ernte Surf + E-Funk fertig, Katalog 40_AUDIO/music_catalog_r1.json; Marsch-Test fehlt (V-688).

## 5 · Feste Grenzen
Keine Löschungen ohne Georgs Ja. Keine Merges. Keine Credits ohne Georgs Go im Chat. Private Assets nie öffentlich. Keine Freigaben an andere Sitzungen weiterreichen. Agenten laden nichts per git fetch in `~/KFB_GitHub_sync`. Cowork-Sitzungen werden nie gelöscht.
