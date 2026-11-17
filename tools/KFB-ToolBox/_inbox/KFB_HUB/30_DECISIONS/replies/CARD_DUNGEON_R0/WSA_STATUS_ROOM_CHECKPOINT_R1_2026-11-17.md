# WSA Patch · InfiniteRooms Raum-Checkpoint R1

17.11.2026 · Roadmap-Zwischenschritt 2a · privat, kein Merge.

Site-Quelle (Cloudflare-Artefaktquelle, kein Game-GitHub-Head): `351da2f4f6cf162f998d15e41b8eccb0ae19ea8f`; Basis `cf401df9bbc939902bedca20bdad2664ab92a7cd`.
Private Veröffentlichung erfolgreich: `appgdep_6afc8fd36cdc8191a80bd8aaba26a910`.
Gespeicherte Version: `appgprj_6af7435fa7b48191a1739992fa8ffed7~appgver_2ad2a20645cc81919c0d7be562051981`.
Prüfstand: https://kfb-infiniterooms.frizzlebob.chatgpt.site/blaster-lab/

## Umgesetzt

- Echte Zustandswiederherstellung: native Trefferhistorie, Solid-/Air-Feld, bereits abgelöste Spalten und bereits erzeugte Bruchflächen, Raumidentität, Kartenfunde/Abschluss, Dissolve und Audio-Rezept. Keine zweite Treffer- oder VFX-Instanz.
- Native Felder werden ohne Waffen-VFX aus bestätigter Historie rekonstruiert. Checkpoint enthält Algorithmus-Revision und Integritätsprüfung. Versionswechsel ist keine automatische Migration.
- UI: „Raumstand merken“ / „Zum Eingang & Wiederherstellen“. Wiederherstellung am bestehenden sicheren Eingangs-Steg, laufende Treffer/Worker/Aufnahmen sperren sie. Ein Sitzungs-Checkpoint, keine Persistenz nach Browser-Neustart.
- Kurzlebige Trümmer werden beim Laden entfernt und nicht erneut ausgespielt. Fehlendes Wand-/Boden-/Deckenmaterial bleibt erhalten. Alte Bruchflächen werden auch beim nächsten Treffer nicht erneut als Trümmer abgespielt.
- Begrenzter, injizierter Residency-Besitzer. Fünf Testadressen, jeweils ein echter geladener Geometriebesitzer; vollständiges Entladen und Wiederkehr geprüft. Speicherbudget hält bei Überschreitung den bestehenden Raum statt Zerstörungszustände still zu verwerfen.

## Belege

51/51 gezielte Tests und Produktions-Build bestanden. Vollständiges Dispose / neue Besitzer im echten Rapier-World; exakte Bits und native Rasterfelder, Kollisionsöffnung, Folge-Treffer gegen ursprünglichen weitergelaufenen Besitzer, Reset, falsche Identität, beschädigte Daten und Budget geprüft. Nach Dispose keine Collider/Bodies des Raums übrig.

Browserfunktion lokal geprüft: 36 entfernte Voxel + 50 % Karten/HyperNorm merken → Reset mit 0 / Karten → Wiederherstellung mit 36 / 50 %, keine wiederholten Trümmer. Danach echter weiterer Blaster-Treffer: 54 entfernte Voxel. Checkpoint etwa 175 KB. Keine kontrollierte Performance-Abnahme unter paralleler Rechnerlast.

Belege in der Site-Quelle: `docs/handoffs/room-checkpoint-r1/RETURN.md`, `tests.txt`, `build.txt`, `live-proof.json`.
Module: `probes/patch-transfer-r1/streaming/checkpoint.mjs`, `residency.mjs`, vorhandene Geometrie-/Bruchbesitzer und gemeinsamer Raumzustand.

## Noch offen — kein fertiger Zwei-Deck-Dungeon

Residency ist noch nicht in die kontinuierliche Navigation integriert. Die fünf Testadressen sind keine fünf bereits verbundenen Spielräume. Im Site-Paket ist nur `forget_utopia` verifiziert; ein zweiter echter Decksatz braucht sein Quellenmanifest. Es fehlen weiterhin stabile Generator-Adressen, transformierte Raum-/Fragment-Kollisionen, kontinuierliche Anschlüsse, Vorladen nach Sicht/Geschwindigkeit, Entfernungshysterese und ein gemeinsamer GPU-/Texturhaushalt samt Live-Rückweg/Guide.

Die Animationstakt-Phase von HyperNorm/Farbbändern wird nicht gespeichert; die räumliche Dissolve-Maske schon. Räumliche Audio-Wiedergabe und Shepard-Synth bleiben beim vorhandenen Mixer gesonderte Schritte. Kontrollierter Performance-Nachtest bleibt offen. Den Einbau in den Game-Stamm macht WS0 nach Georgs PASS.

Roadmap im selben Ordner: `WSA_ROADMAP_ENDLESS_DUNGEON_SURFACE_STATE_R1_2026-11-17.md`.
