# BACKLOG · Resident-Atlas-Szenen → Scenelets (Bühne) · R1 · 2026-10-19 · WS0
**Register:** V-548/V-550. Quelle: RA S17 (`KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-10-04_r2`). Ziel: jede Szene als `kfb.scenelet/1` in der Bühne, im Welt-Kontext (Terrain, Skydome, Licht, Texturen), abgenommen über die Bühne.
Arbeitsteilung: **WS0** konvertiert die Daten und baut Bühne + Laufzeit. **WSB** optimiert die Assets (Augen/Lider, Clay, Achse V-536, Boden-Klemme, Lizenzen) und liefert Base64 + Scenelet-Ergänzungen. **WS1b** übernimmt fertige Scenelets ins Spiel.

| Prio | Szene (RA-Quelle) | Inhalt | Komplexität | WSB-Optimierung | WS0-Arbeit |
|---|---|---|---|---|---|
| **P1** | **Bewohner-Vignetten** (`cast.js` RESIDENTS, 30) | je 1 Bewohner + Habitat + Signatur-Prop + Auftritt | niedrig, viele | Augen/Lid/Clay je Figur prüfen, Props mit `KFB_Grip` | Batch-Konverter, Auswahl-Galerie |
| **P1** | **Mumie** (`#mummy`) | Sarkophag-Vignette („Scenelet-Grammatik“) | niedrig | Mumien mit Augen-Ankern, Lid = Binden-Ton | konvertieren; Kombi „Mumien vor dem PC“ als erstes Komponier-Beispiel |
| **P1** | **Sci-Fi-Außenposten** (`scifi-pack-01.json`) | Station, Bäume, Steine | niedrig, statisch | Knet-Look, Kit-Inseln | konvertieren, Biom-Palette |
| **P2** | **Ork-Band** (`resident-band-module-01.json`) | Leader, Gitarre, Drums, Trompete, Banner, Beat-Uhr | mittel | Instrumente als Halterungen (Griff/Achse), Augen aller 4 Orks, Rig_Legacy-Teile prüfen | Beat-Uhr (bpm) + Cues, Song-Anbindung (Suno-Track) |
| **P2** | **Friedhof-Tanz** (`graveyard-01.json`) | tanzende Skelette, Spuren, bpm | mittel | Skelette Augen bzw. Knochen-Look, Boden | Spuren + bpm |
| **P2** | **Disco** (`resident-disco-01.json`) | 9 Tänzer (inkl. Spielzeugsoldat), Discokugel, Phrasen/Cues | mittel | Paar-Clips, Discokugel-Material (kein Fake-Licht, V-385), Augen aller 9 | Cues je Takt, Playlist (fehlte im Export) |
| **P2** | **Gunfight-Duell** (`gunfight-duel-01.json`) | Hero Man, Spielzeugsoldat, Combat Mech; Blaster/Gewehr/Minigun/Würfel | mittel | V-536/V-540: Waffen auf Unterarmachse, KayKit-Kampfset statt Altclips | Duell-Skripte (hit/miss/dodge) + Abnahme je Beat |
| **P2** | **Clown jongliert vor dem Zirkuszelt** (neu, Georg) | Clown jongliert Keulen bzw. Bälle vor Zirkuszelt-Szenerie, Podest, Reifen, Ballontiere | mittel | Clown-Kit KayKit Mystery S4/11 (Keulen, Bälle, Ballons, Podest, Reifen; privat), Zirkuszelt aus Asset-Suche bzw. Meshy, Clown-Figur mit Augen | Jonglier-Bahnen als `path:arc`-Spuren im Takt + Wurf/Fang-Clip |
| **P2** | **King Kayfabian auf der KFB-Castle-Bühne** (neu, Georg, B45) | Verkündigung auf dem Turm, Dark-Knight-Torwächter mit Zweihänder am Treppenfuß, Kronen-Gag (King wird geboxt, Krone fliegt zum neuen King) | mittel–hoch | King (Paladin gold/rot, Hermelin-Umhang, Krone/Helm), Dark Knight (Large), Castle (Georg sucht Modell; Platzhalter), Hügel, Steintreppe, Holzgerüst | Gag-Zeitplan (punch, knock_off, crown_launch/apex/land), Kronen-Flugbahn |
| **P3** | **Faustkampf / Wrestling-Ring** (`fight-sandbox-02.json`) | Orc Raider vs. Orc Brute; Ring 9 m | hoch | **Ring neu mit Gummiseilen** (Seil-Rig: abfedern, zurückschleudern), Ringpfosten, Matte; Kontakt-Werte aus `KFB_Fight_Cartoon_Contact.json` holen | Kontakt- bzw. Treffer-Logik, Hit-Stop, Kamera |
| **P3** | **Ninja-Schwertkampf** (neu) | 2 Ninjas bzw. Ninja vs. Bewohner, Katana | hoch, neu | Ninja-Figur (KayKit Adventurers / Asset-Suche), Katana mit `KFB_Grip` (Achse!), Schwert-Clips (KayKit Melee 1H/2H) | Choreografie-Skript wie Duell |
| **P3** | **Men-in-Black-Einsatz** (B40, neu) | Turm materialisiert, Agenten, Humbug!, Opfer-Kette | hoch | fertig in B40/B41, nur Scenelet-Zeitplan | Event-Zeitplan, Flächenwirkung |
| **P3** | **Brick-Fish / Wurfwaffen-Duell** (B41, neu) | Wurf → Treffer bzw. Ausweichen, Krater | mittel | fertig in B41 | Flugbahn + Krater-Fade |
| **läuft** | **Fluff-Farm** (B44) | Farmer, Traktor, Cube Pets, Fallobst | mittel | B44 | erstes WSB-Scenelet einbinden |

**Vorschlag Reihenfolge:**
1. P1 komplett: schnelle Erfolge, testen Konverter und Galerie.
2. Ork-Band: Georgs Lieblingsszene, testet Beat-Uhr und Halterungen.
3. Gunfight-Duell (V-536/V-540).
4. Disco, Friedhof, Clown vor dem Zirkuszelt.
5. Wrestling-Ring mit Gummiseilen, Ninja.
6. MIB-Einsatz, Brick-Fish-Duell.

**Mac mini dauerhaft beschäftigt (WSB-Warteschlange):** B44 Fluff-Farm → Ork-Band-Assets → King Kayfabian + Dark Knight + Castle (B45) → Gunfight-Assets (Kampfset) → Disco-Assets → Clown + Zirkuszelt → Wrestling-Ring mit Gummiseilen → Ninja.
