# BRIEF · NPC-Alltag: Routinen, POIs, Eigenleben · R1 · 2026-10-20 · WS0
**Register:** V-580, baut auf V-464 und `SPEC_NPC_PATROL_R1.md` auf. Dazu V-426/V-463 (Bots, Arbeits-Animationen), V-496 (≥ 1,5 m Aktionsraum je POI), V-559 (eine Besetzungsliste), V-563 (3D-Kanon).
**Owner:** eine neue, parallele Claude-Code-Sitzung „WS-NPC“ im WS1-Umfeld (Georg 20.10.). Sie integriert sich in das Spiel von WS1; Merge nur mit Georg.

**Tier 0**
1. Figuren bekommen ein Eigenleben: Tagesroutinen, die über POIs laufen, mit Aktivitäts-Clips und einfacher Reaktion auf den Spieler. Simuliert wird nur in der Blase um den Spieler; außerhalb berechnet ein Zeitplan, wo sie sind, und sie tauchen ohne Pop-in auf.
2. Grundlage ist `SPEC_NPC_PATROL_R1` (Routen, Fahrplan statt Simulation, Begegnungstabellen, POIs, Verhaltensautomat, Gruppen mit Rollen). Neu hinzu kommt der **Tagesplan** (Uhrzeit → Route bzw. POI-Aktivität).
3. **Gate R1:**
   - eine Zone, zwei Routen, eine Begegnungstabelle;
   - Spielzeugsoldaten 1–6 als Gruppe, drei Bots an einem POI, ein Resident mit Tagesplan (z. B. ein Ork aus der Band: morgens Markt, abends Bühne);
   - Spieler geht weg und kommt zurück → alle sind dort, wo der Plan sie sieht;
   - kein Pop-in im Sichtfeld, ≥ 55 fps.


## Schritt 0 · Inventur vor dem Bau (Georg 20.10.: „alles dabei haben, was wir aus AI-Town und den anderen Recherche-Slices gelernt bzw. konzeptionell skizziert hatten“)
Zuerst alle vorhandenen NPC-Recherchen und -Konzepte sichten und in `30_DECISIONS/CANON_3D/sources/WS_NPC_INVENTUR_R1.md` zusammenfassen: je Quelle die Kernideen, „übernommen“ bzw. „nicht übernommen, weil“ und die Lücken. Bekannte Quellen:
- `30_DECISIONS/replies/SPEC_NPC_PATROL_R1.md` und `replies/NPC_PERFORMANCE_PROOF_R1/`;
- `KFB Island Worldbuilder Lab/docs/KFB_LEBENSSCHICHT_PLAN_R1.md` (Lebensschicht);
- `KFB Stunt Car Race/ChatGPT_web/…/02_NEW_SLICES/P19_BUDDY_NPCS/KFB_P19_BUDDY_NPCS_SOCIAL_TOY_WORLD_v0_1.md`;
- `KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24/docs/` (NPC-Karten-Spec);
- Register: V-319 (Leben um die Dioramen), V-426/V-463 (Bots), V-449 (Umgebungsleben), V-464, V-496;
- **AI-Town-Recherche** (Georg erwähnt sie; WS0 hat sie weder auf der Platte noch auf den Standard-Branches gefunden): auf GitHub in allen Branches von georg-doc suchen, sonst Georg nach dem Ort fragen. Kernfragen: Gedächtnis bzw. Tagesplan der Agenten, Planung, Reflexion, soziale Begegnungen; was davon KISS-tauglich für KFB ist (Fahrplan statt LLM-Agenten pro Figur).

Erst nach der Inventur wird gebaut; die Inventur zählt als Teil der Abgabe.

## Block
**Daten:**
- `kfb.npc-route/1` und `kfb.encounter-table/1` laut Spec.
- Neu: `kfb.npc-day/1` je Figur bzw. Gruppe: Zeitslots → Route, POI, Aktivität, Stimmung.
- Figuren nur aus `60_CAST/cast.r1.json`, und nur mit `ready` und KFB-Augen.
- Clips nur aus `60_CAST/clips.r1.json` bzw. Motion Library; Kit-Clips as-is (V-574).

**POIs:**
- Bank, Stand, Kneipe, Baustelle, Ernte-Baum, Bühne (Ork-Band und Disco als Abend-POI aus den Konzeptblättern in `65_SCENELETS/`).
- Jeder POI hat ≥ 1,5 m Aktionsraum (V-496) und Andockpunkte mit Blickrichtung.
- POIs liegen im Terrain nach Kanon (Gebiet 15); Requisiten nur aus den Kanon-Teilen von WSB.

**Verhalten:**
- Automat `idle → patrol → notice → alert → return`. Aggro und Kampf folgen erst mit dem Combat-Slice.
- Gruppen in Formation mit Versatz (Dalton-Gag).
- Befehls-Triplets bei Automaten-Ereignissen (Dialog-Pool, nur gelesen).

**Grenzen:**
- Keine neue Figur, kein neues Asset; fehlende Clips kommen als Liste an WS0 (WSB baut sie).
- Keine eigenen Licht-, Schatten- oder Material-Lösungen (Kanon).
- Laufzeit-Code nur über WS1-Branches (`ws-npc/*`), Push nach WS0-Go, Deploy-Key nur mit Georgs direkter Bestätigung.

**Meldung:** Status in `WS1_STATUS` (eigener Abschnitt WS-NPC), Clip aus der Spielkamera; Gate-Werte (Pop-in, fps, Plan-Treue) gemessen.
