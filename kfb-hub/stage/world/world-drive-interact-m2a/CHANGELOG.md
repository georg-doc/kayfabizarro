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

## 2026-09-27 · R5 Playability repair

- Fahrzeug vor dem ersten sichtbaren Bild bis zum realen Vier-Rad-Kontakt gesetzt.
- Zu-Fuß-Antritt, Pace-up und Bremsen reaktionsfreudiger abgestimmt, ohne den bestehenden Motion-Owner zu ersetzen.
- Eigenen Browserbeweis für Gehen, Sprint, Erstkontakt und Offroad-Fahrt ergänzt.
- 30-fps-Prüfer gegen die dokumentierte 0,1-ms-Timerauflösung robust gemacht.
- Paket 27/27, Browser 38/38 und Playability-Proof lokal bestanden; keine Stage-Promotion.

## 2026-09-28 · Render R0

- Gemeinsames, wiederverwendbares KFB-Renderpreset für Kontaktschatten und Clay-Detail ergänzt.
- World-Schattenprojektion auf den aktiven Gameplay-Korridor begrenzt und metrischen Normal-Offset hart gedeckelt.
- Hero-, World-, Far- und Moving-Detailstufen für die bestehende H0-Knetoberfläche ergänzt.
- Far Terrain wie entfernte Stadtgeometrie vom vollständigen Relief-Shader entlastet.
- Desktop-/Narrow-Browserproof, fokussierten Lichtwinkelbeweis und bestehende Performance-/Playability-Regressionsläufe erweitert.
- Kandidat bleibt auf Draft PR #273; keine feste Stage oder Live-Promotion vor menschlicher Sichtprüfung.
