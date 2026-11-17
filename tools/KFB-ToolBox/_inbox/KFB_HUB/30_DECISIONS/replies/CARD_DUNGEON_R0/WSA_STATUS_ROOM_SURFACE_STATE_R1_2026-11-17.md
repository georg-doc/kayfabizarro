# WSA Patch → WS0 · InfiniteRooms Raumzustand / Dissolve R1

17.11.2026 · Funktionsstand privat veröffentlicht · kein Game-Merge, keine Merge-Freigabe.

## Stand und Belege

- Private Site: https://kfb-infiniterooms.frizzlebob.chatgpt.site/blaster-lab/
- Geprüfter Site-Quell-Head: `cf401df9bbc939902bedca20bdad2664ab92a7cd`, Ausgang `49ee3c84db867c1084fa9a2b38bd81605fc89f5e`.
- Sites-Projekt: `appgprj_6af7435fa7b48191a1739992fa8ffed7`; gespeicherte Version: `appgprj_6af7435fa7b48191a1739992fa8ffed7~appgver_c4759afafba4819183873ea5629154b2`; Deployment `appgdep_6afc894857a08191aba55a1eede928d8`, erfolgreich.
- Dieser Head gehört zum privaten Sites-Quellrepository, nicht zum Game-GitHub-Stamm. Die Codeübernahme in den Stamm bleibt ein separater Schritt durch WS0 nach Georgs PASS.
- Lokaler Checkout: `/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6977ebcd1c148191bf212fdabaa38ffe/sites/kfb-infiniterooms`.
- Rückgabe/Belege darin: `docs/handoffs/room-surface-state-r1/RETURN.md`, `tests.txt`, `live-proof.json`, `destruction-dissolve.webm`, `fragment-video-frame.jpg`, `cards-bands-half.jpg`.
- Deployment-Archiv: `/private/tmp/infiniterooms-room-surface-state-r1.tar.gz` (Build, kein vollständiges Game-Quellpaket).

## Implementiert

1. `kfb.room-state/1`: Raum-/Inhaltsidentität, getrennte Entdeckung/Abschluss, Oberflächenpaar samt Fortschritt/Ziel/Seed/Musterparametern und Geometrie-Metadaten. Die Geometrie bleibt bei ihrem bestehenden Besitzer; ein Zustands-Restore behauptet keine Wiederherstellung zerstörter Geometrie.
2. Paarweise Karten ↔ HyperNorm, Karten ↔ Farbbänder und HyperNorm ↔ Farbbänder. Rücklauf mit derselben räumlich festen Maske; saubere Endpunkte und keine dreifache Mischung. Drittes Ziel während eines Übergangs wird sequenziell erreicht.
3. Vorhandener kanonischer HyperNorm-Kern und originale Terrain3/Farbbänder, vorhandenes Licht und Clay. Ein Materialdurchlauf, keine neuen Collider durch Oberflächenwechsel. HyperNorm ruht, wenn es nicht sichtbar ist.
4. Große und kleine Karten-Bruchstücke übernehmen den Zustand; ihre Musterkoordinaten bleiben beim Bewegen erhalten. Erfolgreicher geschützter Reset stellt Kartenansicht, Geometrie und Kollision wieder her.
5. Datenanschluss `kfb.room-audio-recipe/1`: Katalogreferenzen, Host-/Radio-Politik, `tension01`; abgeleitetes `visual.hypernorm01`. Es wird kein zusätzlicher Player oder Synth gestartet. Vorhandene Musik-/Ambient-Pulse werden nur gelesen.

## Prüfung

47 gezielte automatisierte Prüfungen bestanden. Alle sechs gerichteten Übergänge im Browser bestätigt; dabei null durch Darstellung entfernte Voxel und keine neuen Physikkörper. Eingefrorener Mustervergleich 50 → 80 → 50 Prozent kehrt in einem festen Wandbereich pixelidentisch zurück. Echte Blaster-Schnittfolge während 50-Prozent-Dissolve: 45 bestätigte Kontakte, eine 1,46875-m²-Scholle mit neun Quader-Collidern; freies Ablösen und Landen sichtbar. Danach Reset: null entfernte Voxel, null aktive Schollen, Kartenansicht bei 0 Prozent.

Dies sind Funktionsbelege. Der kontrollierte Performance-Nachtest unter geringer Rechnerlast ist weiterhin offen; keine Performance-Abnahme behauptet.

## Anschluss für WS0

`probes/patch-transfer-r1/room-state/state.mjs`, `material.mjs`, `presentation.mjs`; `blaster-lab/geometry-owner.mjs` nimmt den Zustand und eine injizierte Darstellung entgegen. Host ruft `update(dt)` einmal pro Bild; Audio-Objekt wird hineingereicht. Keine Änderung an CombatPlayer oder zweiter Treffer-/FX-/Ton-Besitzer.

Offen: Root-Dungeon-Reveal auf denselben Vertrag umstellen; Mob-/Fluff-Kuben-/Boss-Verträge am aktuellen Stamm prüfen; vollständige Zerstörungs-Deltas und Streaming; explizite Transformationsrahmen für gedrehte/gestreamte Räume. Lokale Rahmenverankerung ist keine Gebäudestatik; Schutt-Folgeschäden/erneutes Zerbrechen gelöster Teile bleiben offen.

## Planung

- [Roadmap Endlos-Dungeon / Raumzustand](WSA_ROADMAP_ENDLESS_DUNGEON_SURFACE_STATE_R1_2026-11-17.md): Stufe 1 im privaten Prüfstand umgesetzt; als Nächstes begrenzter Zwei-Deck-Streaming-Proof, danach Katalog-/Raumrezepte und sechs Richtungen/Escher.
- [Audio-Slice mit Georgs Ergänzungen](WSA_AUDIO_SLICE_INFINITEROOMS_R1_2026-11-17.md): räumliche Nachbarraum-Vorschau, Charakter-/Deck-/Biom-Zuordnung, Radio-Kontinuität, Shepard-/Drone-Spannung und kontrollierte Verdrängung/Verfärbung der Musik. Daten vorbereitet; räumliche Wiedergabe und Synth/Mix noch geplant. Ein vorhandener AudioContext/Mixer, keine neue Audio-Uhr.

Für die Audio-Stufe zuerst Katalog-/Mixer-/Bus-Verträge mit WS0 abstimmen. Die Roadmap ist Arbeitsliste/Status, keine automatische Freigabe zum Einbau oder zur Veröffentlichung des Games.
