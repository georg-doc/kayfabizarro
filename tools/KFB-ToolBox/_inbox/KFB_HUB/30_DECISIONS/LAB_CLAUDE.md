# KFB Island Worldbuilder Lab · Pflichtregeln für jede Sitzung

1. **Entscheidungen zuerst lesen:** `~/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/DECISIONS.md` (Georgs PASS / TUNE / FAIL / RULE / TBD, Nummern V-…). Was dort steht, gilt. Nichts davon still ändern.
2. **Plan:** `docs/KFB_WORLDBUILDER_PLAN_R1.md`. Arbeite nur an freigegebenen Teilen.
3. **Vorlage zuerst:** Vor jedem neuen Teil schickst du der Steuer-Sitzung eine Zeile: was es schon gibt (Pfad, three-Version), was 1:1 übernommen wird, was neu ist und warum. Nachbau ohne Freigabe = nicht bestanden.
4. **Goldstandard:** Joyride J17 für Strecke, Banden, Fahrbahn, Deformer, Kamera und Paletten (V-010). HUD = Claude-Design-HUD R3 komplett (V-040).
5. **Prüfung vor jeder Lieferung:** `tools/parity` laufen lassen. Fällt ein Test zu einem PASS-Eintrag durch, ist die Lieferung ungültig. Der Bericht listet die betroffenen V-Nummern und die noch ungeprüften.
6. **Use what works (V-140):** „Fehlt“, „gibt es nicht“ oder „braucht Georgs Entwurf“ nur mit Such-Protokoll: Donor-Karten (`PHASE_C_DONORS_R1.md`, `MVP1_DONOR_AND_MODEL_MAP_R1.md`), `ACCEPTANCE_INDEX.md`, Joyride-Cuts J14/J15 (TC1)/J16/J17, Organ-Inseln v4–v7, RollerCoaster v11, Stunt Car Race, frühere Lieferungen. Ohne Protokoll ist die Meldung ungültig.
7. **Recherche:** zuerst `docs/ACCEPTANCE_INDEX.md` (Skript `tools/acceptance/build_index.py`) und die PASS/TUNE/FAIL-Spalten in STATUS- bzw. RETURN-Dateien. „Nicht gefunden in …“ statt „gibt es nicht“.
8. **Lizenzen:** Gekaufte bzw. private Assets (StreakByte, Unity, Cozy Tunes, private Audio-Dateien, Deck-PDFs) nie in ein öffentliches Repo (V-071). Figuren nie skalieren (V-060).
9. **Port 5180** gehört einer anderen Sitzung: nie benutzen. `~/Dropbox/CLAUDE/KFB Open World/` nicht verändern.
