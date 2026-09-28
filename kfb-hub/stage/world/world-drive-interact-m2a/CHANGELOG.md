# WORLD-DRIVE-INTERACT-M2A · Changelog

## 2026-09-28 · WORLD-M2A-R6

- Georgs Freeplay überschreibt den früheren R5-Produkt-PASS: Ground ruckelt, Walk-Clip falsch, City-LOD und Straßenkante visuell unbrauchbar.
- Drive/Flight-Fokus an tatsächliche Position gebunden; City-LOD bleibt nicht mehr am Fußgänger-Spawn hängen.
- Adaptive Auflösung auf lesbare 0,80/0,95 (Desktop) und 0,72/0,82 (schmal) angehoben.
- Auto-Button als direkter Playtest-Shortcut; `E` bleibt die In-World-Interaktion.
- 30/30 Paket, 44/44 Browser und Lauf/Sprint/Offroad lokal PASS; Rasterstraße bleibt Blocker. Keine Veröffentlichung.
- `SKY-CORE-01` als separater gemeinsamer Sky-Owner/Performance-Gate für World und Resident vorgemerkt.

## 2026-09-27 · R1 Playability/Performance

- Reproduzierbaren Performance-Probe für Idle, Walk und Offroad-Drive ergänzt.
- Kontaktfläche vom kleinen Edit-Tile auf die vollständige sichtbare World-Zone erweitert.
- Geparktes Fahrzeug simuliert jetzt bis zum echten Bodenkontakt statt schwebend auf den Einstieg zu warten.
- Messbaren Fahrzeug-Ground-Gap und vollständige Kontaktgrenzen ergänzt.
- Walk-Antritt, Beschleunigung und Abbremsen reaktionsfreudiger gesetzt.
- Runtime-Profil: DPR 1,25; 2048er Boden-/Schattenkarten; 192 Terrain-Segmente.
- Unnötiges permanentes Neu-Grounding des Player-Modells während des aktiven Play-Modus beendet.
- Performance-/Spielwert-Matrix ergänzt.
- R1 nach zwei Kandidaten als `PARTIAL` gestoppt; nicht auf die feste Stage veröffentlicht.

## 2026-09-27 · R5 Playability repair

- Fahrzeug vor dem ersten sichtbaren Bild bis zum realen Vier-Rad-Kontakt gesetzt.
- Zu-Fuß-Antritt, Pace-up und Bremsen reaktionsfreudiger abgestimmt, ohne den bestehenden Motion-Owner zu ersetzen.
- Eigenen Browserbeweis für Gehen, Sprint, Erstkontakt und Offroad-Fahrt ergänzt.
- 30-fps-Prüfer gegen die dokumentierte 0,1-ms-Timerauflösung robust gemacht.
- Paket 27/27, Browser 38/38 und Playability-Proof lokal bestanden; keine Stage-Promotion.
# 2026-09-28 · Architecture decision after R6

- Keep OSM as the road/landmark skeleton, not the visible building runtime.
- Next productive gate remains the terrain-conforming geometric Clay-road/curb seam on one bounded tile.
- Follow with a deterministic instanced district from verified KayKit/Kenney/Tiny Treats donors; render and collision share one recipe.
- Record `SKY-CORE-01` as the shared measured environment-sky owner for World and Resident after the road tile is stable.
- Full brief: `skills/chat/workflows/KFB_WORLD_CLAY_CITY_SKY_CORE_2026-09-28/START_HERE.md`.
