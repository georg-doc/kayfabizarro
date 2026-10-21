# BRIEF · WS-NPC: Bewohner-Leben, Begegnung, Gedächtnis, Dark Fluffer · R2 · 2026-10-21 · WS0
**Register:** V-585. Ersetzt das Gate von R1 (V-580). Schließt V-583 (Dark Fluffer) als Phase C ein.
**Owner:** **eine** neue, parallele Claude-Code-Sitzung „WS-NPC“. Der WS1-Lead startet sie mit diesem Brief (Georg 21.10.: „die gesamte NPC-Slice aus dem Web-Chat“). Sie integriert sich in das Spiel von WS1; Merge nur mit Georg.

**Quellpaket (alles lesen, bevor gebaut wird):**
- Repo `georg-doc/kayfabizarro`, Branch `recovery/kfb-minigames-fluff-source-bridge-2026-10-15` (Draft-PR #400), Ordner `skills/chat/recovery/`:
  - Resident Life R0.6 (POI, Tagesablauf, Aggro, Gedächtnis);
  - R0.7 (Choreografie mit KayKit);
  - **R0.8 AI-Town-Rekonstruktion** (das ist die AI-Town-Recherche, nach der R1 gesucht hat);
  - R1-Quell-Audit;
  - **`WS1_EMERGENT_RESIDENT_LIFE_SOCIAL_MEMORY_WORKSHOP_R1_2026-10-21.md`**: Ausführungs-Brief mit M0–M5, Abnahmematrix und Return-Vertrag. **Der gilt**, mit den WS0-Entscheidungen unten.
  - Dark-Fluffer-Konzept + WS1-Follow-on;
  - Card Ink Defense R0.5.
- **Google-Doc (Recherche-SSOT):** https://docs.google.com/document/d/1Y0oezF8qRhGfB0aeCMbjy3fZYjkalxQAiXSyoR6iOy8/edit. Es enthält die Reiter 01–07, die Deep-Research-Briefs von Perplexity, Gemini und Grok, das TypeScript-Schema von Perplexity und NotebookLM.
- KFB-Spender: PR #210 `EncounterBeatBus`, PR #272 AIDA/POI-Semantik.
- **Dramatis Personae und Writer's Room (Georg 20.10., Branch `ws-song/workshop-r1`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/`):**
  - Figurenbögen `FIGURES_R1/characters/*.character.json` (`kfb.character/1`);
  - Georgs neue Fakten in `SONGS_WORKSHOP_R1/personae/PERSONAE_PATCH_R1.json` (4GTN, 4GTN Forgotten, Lord Hunky, Norman) und die Vorschläge Goth Girl, Caveman, Combat Mech, FrizzleBob (als Standard-Spielfigur);
  - `RESIDENT_DP_ALIGNMENT_R1.md`;
  - der gültige Bewohner-Stand `WRITERS_ROOM_R1/export_2026-10-20c` (Bewohner je Deck mit Rolle, Zuhause und Meta).
  - **Neu von Georg (21.10.):** Die beiden Hexen (KayKit Witch, Textur A und B; im Cast `witch`) sind **Fluff-Alchemistinnen**. Sie veredeln Fluff in ihrer Kräuter- bzw. Trankküche. Das ist ihr Arbeits-POI. In Phase C (Dark Fluffer) sind sie die ersten Kandidatinnen für „Heilen im Team“, z. B. mit einem Trank aus buntem Fluff. WS0 entscheidet das nach der Inventur.
  - Nutzung: Ziele, Tagesablauf und Begegnungen kommen aus Rolle und Bogen. Das „Zuhause“ eines Bewohners ist ein POI-Kandidat. `BESTÄTIGT` ist bindend, `VORSCHLAG` nur Richtung. WS-NPC ändert keinen Bogen; Lücken meldet es an WS0.
- Im Hub: `replies/SPEC_NPC_PATROL_R1.md` (Fahrplan statt Simulation) und `replies/BRIEF_WS1_DARK_FLUFFER_R1.md`.

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` und die Zeilen deines Fachgebiets. Vor dem Bau liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung über `CANON_3D/lib/kfb_env.py`; Figuren, Material und Licht über die Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün, dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`. Georg sieht nur Bestandenes.

**Kern:** Bewohner haben eigene Ziele, einen Tagesablauf und begrenztes Wissen. Was passiert, hat im Spiel eine sichtbare Ursache. **Ohne LLM als Grundlage**; Fahrplan statt Simulation außerhalb der Spielerblase.

## Block
**WS0-ACK zu `WS0_RESIDENT_LIFE_ESCALATION_R0_6_INTAKE` (die sieben Fragen):**

| # | Entscheid |
|---|---|
| 1 Kapazität | **ACK** als eigene Sitzung. Die Jobs 1–4 des WS1-Leads (Leistung, AD-Audit, Dioramen) bleiben unberührt und haben Vorrang beim Merge. |
| 2 Figuren | Nur aus `60_CAST/cast.r1.json` (V-559), `ready`, mit KFB-Augen. Rollen und Charakter kommen aus den Dramatis Personae (siehe unten). **Farmer B** = KayKit Mystery S6 „Farmers“, Textur B (laut Writer's Room die Bäuerin und Theaterdirektorin mit Scheune und Strohballen-Bühne); Im Cast ist das `farmer_harke` (Farmerin mit Mistgabel, ready; WSB 21.10.). **Lorekeeper** = KayKit Mystery S6 „1 – Lorekeeper“ (Guide, Mentor, Questgeber für FrizzleBob bzw. den Spieler; Hüter der Theorien, Bibliothek). Er ist noch nicht in der Besetzungsliste. WSB nimmt ihn in K11 auf und baut dabei auf `B31/…/Lorekeeper_work.r1.glb` mit Augen-Ankern auf; es fehlen Mund, Clips und der Cast-Eintrag. Bis dahin baut WS-NPC Inventur, Farmer B und Wege. Clips nur aus `60_CAST/clips.r1.json` und der Motion Library, Kit-Clips as-is (V-574); jeder Clip wird isoliert nachgewiesen. |
| 3 Spender | **ACK:** #210 `EncounterBeatBus` wiederverwenden und um Abbruch/Neuplanung erweitern. #272 nur die Semantik (AIDA-Zustände, POI-Arten). Keine alten Laufzeiten, kein zweiter ConversationDirector. |
| 4 Speicher | Den Owner von `kfb.world-save/1` benennt der WS1-Lead. Bis dahin gibt es keine dauerhaften NPC-Schreibvorgänge, nur flüchtigen Zustand. `kfb.save/1` (Spieler) ist nicht der NPC-Speicher. |
| 5 LLM | Grundlage ohne LLM. M4 (LLM-Vergleich) erst nach A–B, nur mit Georgs Go und ohne Schlüssel im Client. |
| 6 Umfang | **A → C → B → D** (unten). D wird nicht automatisch fällig. |
| 7 Quest/Karten | **ACK:** Bewohner zerstören oder entsperren nichts selbst; Pflichtkarten haben immer einen sicheren Rückfall. |

**Phasen:**
- **A (= M0–M2):** Inventur, zwei Bewohner mit Tagesplan (`kfb.npc-day/1`: Zeit → POI, Aktivität), Arbeits- und Sozial-POIs mit ≥ 1,5 m Aktionsraum (V-496), zwei Routen-Varianten, eine echte gegenseitige Begegnung über die Begegnungs-Grammatik (bemerken → annähern → ausrichten → grüßen oder schweigen → reagieren → trennen → weitermachen), Unterbrechen und Fortsetzen. Spieler geht weg und kommt zurück: beide sind dort, wo der Plan sie sieht, ohne Pop-in.
- **C (Dark Fluffer, V-583):** nach `BRIEF_WS1_DARK_FLUFFER_R1.md`. Ein Cube, ein Patch, ein Baum; ein Bewohner aus A weicht aus und warnt; dann heilen (weiße Augen, kein Goo, einmal bunter Fluff über `fluff.js`). Keine Blumen, kein zweites System.
- **B (= M3):** erst wenn der Speicher-Owner steht. Ein Ereignis-Beleg je bedeutendem Erlebnis (gesehen / beteiligt / erzählt), eine veränderte nächste Begrüßung, kein allwissendes Wissen.
- **D (später, eigenes Go):** Spielzeugsoldaten-Gruppe, Bots am POI, Ork-Band mit Tagesplan (morgens Markt, abends Bühne), Skelett-Patrouille, Aggro, Cartoon-KO, Gerüchte.

**Messlatte:** ≥ 55 fps aus der Spielkamera auf Georgs Mac; zuerst 2 Figuren, Stresstest erst danach. PASS, FAIL und NOT RUN je Zeile der Abnahmematrix getrennt; nie „MVP PASS“ aus einer unvollständigen Matrix.

**Grenzen:**
- Keine neue Figur und kein neues Asset; fehlende Clips gehen als Liste an WS0, WSB baut sie.
- Keine eigenen Licht-, Schatten- oder Material-Lösungen.
- Ton und Stimme liefert WS0; bis dahin stumm bzw. Text.
- Laufzeit-Code nur auf `ws-npc/*`. Push nach WS0-Go; den Deploy-Key nur mit Georgs direkter Bestätigung in deiner Sitzung.

**Meldung:** Abschnitt WS-NPC in `WS1_STATUS` mit der Inventur (`CANON_3D/sources/WS_NPC_INVENTUR_R1.md`, je Quelle übernommen / nicht übernommen / Lücke), einem Clip aus der Spielkamera, der fps-Messung und dem nächsten Gate.
