# WORLD-DRIVE-INTERACT-M2A · Changelog

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

## 2026-09-27 · R2 Render Budget

- Hardwarepfad explizit erfasst: ANGLE Metal auf Apple M1 Max.
- Geometriekosten nach sichtbaren Mesh-Ownern aufgeschlüsselt.
- Diagnosen für Originalmaterial, Stadt aus und Fassadendetails aus ergänzt.
- Einen sichtbaren Playable-Clay-Kandidaten gebaut: große Weltflächen nutzen eine dominante Reliefprojektion, Props weiter volle Knetqualität.
- Kandidat wegen fehlendem Performancegewinn gestoppt und nicht veröffentlicht.
- Nächsten Gate auf strukturelle `CITY SHELL LOD` begrenzt; kein weiterer pauschaler Qualitätsabbau.
