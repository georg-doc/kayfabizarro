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
