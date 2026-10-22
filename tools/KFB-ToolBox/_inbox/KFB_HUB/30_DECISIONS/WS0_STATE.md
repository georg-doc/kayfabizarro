# WS0 · Arbeitsstand und Ablauf (lebendes Dokument)
Stand 22.10.2026, Register bis V-683. Nach jedem /compact und zu Beginn jeder Steuerrunde zuerst lesen. Wird von WS0 laufend gepflegt, nicht neu erfunden.

## 1 · Ablauf für jedes Briefing und jede Antwort an eine Sitzung
1. **Bereich bestimmen:** HUD, Figuren, Licht, Welt, Fahren, Kampf, Audio oder Spiel (siehe `tools/brief_domains.json`).
2. **Erst lesen, dann schreiben:** die Specs des Bereichs aus `brief_domains.json` und den Ist-Stand (Status der Sitzung, Abnahme-Seite, letzter RETURN). Für „wie sieht es gerade aus“ gilt nur der laufende Build bzw. die Sitzung, die ihn hat, keine Referenzordner.
3. **Briefing als Datei** schreiben, dann `python3 tools/brief_gate.py <datei>` ausführen. Exit 2 bedeutet: korrigieren.
4. **Frischer Prüf-Agent** mit `tools/BRIEF_GATE_PROMPT.md` und dem Paket aus `GATE/`. Nur bei PASS geht das Briefing raus. Bei „unklar“ wird der Punkt Georg vorgelegt.
5. **Erst danach** folgen Register (d() + WHY + CHANGELOG, `build_decisions.py` rc=0), Sync und Hub.

## 2 · Wo die Wahrheit liegt
| Was | Ort |
|---|---|
| Entscheidungen | `build_decisions.py` → `decisions.json`, `DECISIONS.md`, `CHANGELOG.md`; GitHub-Register-Branch über `sync_github.sh` |
| 3D-Kanon | `CANON_3D/CANON_3D_R1.md` |
| Licht | `replies/LIGHT_MODEL_R2.md`, Modul kfb-stage-light |
| HUD | `replies/HUD_R4_DESIGN/BRIEF_CLAUDE_DESIGN_HUD_R4.md` (Plan), `HUD_LAYOUT_R3.md`, `HUD_UX_STATES_R1.md`; Georg arbeitet das Design extern neu aus |
| Figuren | `CHARACTERS_R1/` (Register, 133 Figuren, `GAPS.md`); Figurenkarten kfb.figure/1; E2-Referenz `replies/E2_REFERENCE/` |
| Audio | `replies/CHATTERBOX_SPEC_R2.md`, `SONG_SPEC_R3.md`; Sets unter `40_AUDIO/elevenlabs_r1/<set>_lufs` |
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
- HUD: WS1 liefert den Ist-Stand `hud=wood` als Einzelbilder (Almanach zu und offen). Georg gestaltet extern. WSB baut am HUD nichts.
- Hub-Fragen offen: q168 (K14 r4 Ink-Variante), q169 (Ziel-Pfeil Welt oder Kompass).
- WS1: Schattenseiten-Regel A/B (V-683), Bäume und Terrain-Blobs A/B (V-676), Kritiker R4.
- WSA: Inventur des Arbeitsordners (36 GB), Löschen nur nach Georgs Ja.
- Chatterbox: 156 Familien-Clips fertig; die Suno-Solo-Tests erzeugt Georg.

## 5 · Feste Grenzen
Keine Löschungen ohne Georgs Ja. Keine Merges. Keine Credits ohne Georgs Go im Chat. Private Assets nie öffentlich. Keine Freigaben an andere Sitzungen weiterreichen. Agenten laden nichts per git fetch in `~/KFB_GitHub_sync`. Cowork-Sitzungen werden nie gelöscht.
