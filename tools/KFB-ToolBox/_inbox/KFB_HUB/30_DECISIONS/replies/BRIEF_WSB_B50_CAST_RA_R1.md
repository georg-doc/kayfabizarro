# BRIEF WSB · B50 · Besetzungsliste: RA-Darsteller einmal optimieren (Bühnen-Lieferung) · R1 · 2026-10-19 · WS0
**Register:** V-548/V-550 (RA → Scenelets), V-559 (Besetzungsliste), V-552 (Augen/Clay für alle Figuren). Spec: `replies/SPEC_SCENELET_R2.md`.
**Reihenfolge:** Lücken-Job wie B46, nach Bedarf zwischen den großen Aufträgen. Die feste Warteschlange bleibt (Band r1b → B45 → B47 → B48). Georg kann B50 vorziehen (Hub q119).

**Tier 0**
1. Die Besetzungsliste `KFB_HUB/60_CAST/cast.r1.json` hat 28 Darsteller. Alle mit `status: "pending"` werden **einmal** bühnenfertig gemacht: KFB-Augen + E2-Lider (Lid = gemessene Haut), Clay v1.1, Figurenkarte proof-r1 mit sha, Clip-Satz.
2. Lieferung je Darsteller: GLB + Base64 (privat bzw. öffentlich nach Lizenz) + Karte + Prüfbogen in Spiel- bzw. Arbeits-Pose. Danach setzt du in `cast.r1.json` den Status auf `ready` und trägst die Pfade ein.
3. Die Scenelet-Entwürfe liegen fertig in `KFB_HUB/65_SCENELETS/ra/` (Konverter `60_CAST/ra2scenelet.py`, WS0). Sie verweisen nur auf cast-IDs; sobald ein Darsteller `ready` ist, spielt die Bühne ihn ab.

## Block
**Priorität (nach Backlog P1/P2)**
1. **Kampf** (`ra_fight_01`): orc_raider, orc_brute. Kommen aus der Ork-Band r1b (Karten proof-r1). Dazu die Kampf-Clips aus `KFB_Motion_Library/fight/` als Clip-Bibliothek je Rig (GLB + Base64), Clown-Hammer als Requisite (`hand.r`).
2. **Duell** (`ra_duel_01`): hero_man (rot/blau als Rollen-Material-Varianten), Blaster nach V-536 (`lowerarm.r`, Lauf auf der Unterarmachse).
3. **Disco** (`ra_disco_01`): avian_swordsman, protagonist_a, toy_soldier (vorhanden), witch, black_knight (aus B45), demon_lord, skeleton_minion. Requisiten: Radio, Boxen, Drum Machine (siehe `resident-disco-01.json` props) als ein Requisiten-GLB je Teil.
4. **Friedhof** (`ra_graveyard_01`): skeleton_warrior/rogue/mage (+ minion). Dazu ein Friedhofs-Diorama aus KayKit Halloween Bits (CC0): Gräber, Zaun mit Tor, Krypta, Laternen, Bänke, Kerzen, Pfade. Die RA-Daten haben keine Platzierung; du baust nach Platzierungs-Grammatik R2 einen Tanzplatz in der Mitte (Radius ≈ 6 u) mit den Startpunkten der Skelette aus dem Scenelet.
5. **Sci-Fi** (`ra_scifi_01`): 4 Quaternius-Astronauten (V-552: Karte, KFB-Augen, Clay); Station, Bäume und Felsen als ein Diorama-GLB (Positionen stehen im Scenelet).

**Clip-Bibliothek**
- Die KFB Motion Library (Rig_Medium/Rig_Large, 33 Clips, darunter Tänze und `kfb_action_fireball_a`) als eigene Bühnen-Datei je Rig (GLB nur mit Armature + Clips, + Base64). Die Bühne hängt die Clips allen Darstellern mit gleichem Rig an (`clipLibrary` im Scenelet).
- Clip-Namen bleiben original; `kfb_*`-Aliase stehen in `60_CAST/clips.r1.json`.

**Abnahme**
- Je Darsteller Prüfbogen v1.2 in Spiel-Pose, QA V-520 (a)–(h).
- Je Szene ein Bühnen-Probelauf durch WS0 (Bühne v2, Welt + Zeitleiste), danach Hub.
