# WSA Patch · InfiniteRooms Kartenreise R1

17.11.2026 · privat, kein Merge.

Site-Artefaktquelle: `f206cb848106e48573e88e4397d8b0b218a7f7dc` (kein Game-GitHub-Head). Ausgangsstand `351da2f4f6cf162f998d15e41b8eccb0ae19ea8f`.
Private Veröffentlichung erfolgreich: `appgdep_6afc9cce798c81919ccf314af2c0c9bf`.
Gespeicherte Version: `appgprj_6af7435fa7b48191a1739992fa8ffed7~appgver_60930d596a3c8191b121bf481ce6ab46`.
Ansicht: https://kfb-infiniterooms.frizzlebob.chatgpt.site/stream-lab/
Bestehender Blaster-/Oberflächenprüfstand: https://kfb-infiniterooms.frizzlebob.chatgpt.site/blaster-lab/

## Umgesetzt

- Fünf physisch verbundene Kartenräume, echte tiefe Durchgänge, kein Portal. Erkundung, Scroll-/Ziel-Guide und Übersicht verwenden denselben Plan; beide Reiserichtungen funktionieren.
- Ein verifiziertes Deck, `forget_utopia`; sechs unterschiedliche Karten je Raum. Raumadresse, Inhalts-Seed und Bruch-Seed sind stabil und nicht von der Besuchsreihenfolge abhängig. Layout ist hier eine feste gerade Modulfolge, noch kein Anschluss des nativen prozeduralen Dungeon-Generators.
- Höchstens drei native Raumbesitzer: aktueller Raum und direkte Nachbarn. Entladen speichert bestätigte Bruchdaten und Solid-/Air-Feld. Wiederkehr stellt Löcher und Ablösungen wieder her, ohne alte Trümmer erneut auszuspielen.
- Gemeinsamer Karten-Texturpool mit Referenzzählung und Freigabe beim letzten Besitzer; Budget 128 MiB geschätzte Texeldaten. Snapshot-Budget 32 MiB. Das Kartenbudget umfasst nicht automatisch die bestehenden Figuren-/Waffen-Texturen.
- Ein 1,5 m breiter Bodenstreifen bleibt tragfähig. Wände, Decke und übriger Boden nutzen nativen Bruchgraphen, dieselben Bits für Geometrie und Rapier, begrenzte physikalische Trümmer und Reset. Notfall-Rückkehr bei einem Sturz unter den Raum oder über „Zur sicheren Spur“; Ziel liegt immer in einem bereits geladenen Raum.
- Echte Verschiebung aller Raum-Collider und kleiner/großer Bruchstücke; Karten an den Laibungen nach innen geführt. Noch keine Drehung/Gravitationserweiterung.
- Optionaler echter HeroMan-Blaster über den bestehenden Dungeon-Blaster-Host mit Klick-Zielen. Ein CombatPlayer, eine InfiniteRooms-Quelle, bestehende VFX-/Audio-Besitzer. Ein bestätigter Kontakt wird dem tatsächlichen lokalen Wandrahmen zugeordnet, auch knapp vor einer gerundeten Slot-Grenze; kein zweiter Strahl und kein zweiter Schaden.
- Grafikstart: asynchrone Shader-Vorbereitungsphasen warten höchstens 15 Sekunden, anschließend kontrollierte Freigabe und vorhandene Wiederanlauf-Oberfläche. „Sparsam“ wird im Blaster-Prüfstand tatsächlich an Kontextwahl/Schatten weitergegeben. Der neue Pfad startet standardmäßig sparsam. Ein synchron blockierender Treiber kann JavaScript weiterhin blockieren.

## Belege

59/59 gezielte Tests bestanden. Nach dem Start-Cleanup 15/15 relevante Regressionstests, nach den Kontakt-/Rückkehrabsicherungen 7/7 gezielte Pfadtests bestanden. Produktions-Build erfolgreich.

Reale Rapier-Kapsel durch alle fünf Räume und zurück, höchstens drei Besitzer, exakte zerstörte Bits nach Wiederkehr; verschobene sichtbare Splitter stimmen mit ihren Physikkörpern überein. Textur-Leases, Budgetüberschreitung und Freigabe bei fehlgeschlagenem Aufbau geprüft.

Lokal im Browser: Guide 1→5→1→5. In Raum 5 ein echter Schuss, ein bestätigter Kontakt, 36 entfernte Voxel. Nach Entladen und Rückkehr erneut dieselben 36 entfernten Voxel; keine wiederholten Trümmer. Fünf besuchte Räume, höchstens drei geladene Besitzer.

Die gehostete Kartenreise startet mit `ready=true`, Grafikprofil `safe`; beobachtete Vorbereitungszeit rund 3,7 s. Auch der gehostete bisherige Blaster-Prüfstand startet mit `ready=true`, Profil `normal`, allen vier Shader-Phasen beendet; ein beobachteter Start benötigte rund 9,8 s Vorbereitung. Diese einzelnen Beobachtungen sind keine kontrollierte Performance-Abnahme. Lokale dynamische Modulabruf-Fehler sind im RETURN dokumentiert und haben sich bei dieser Hosting-Prüfung nicht als genereller Hosting-Fehler reproduziert.

Belege in der Site-Quelle: `docs/handoffs/stream-route-r1/RETURN.md`, `tests.txt`, `route-tests.txt`, `startup-regression-tests.txt`, `build.txt`, `live-route-proof.json`, `hosted-start-proof.json`, `hosted-blaster-start-proof.json`.

## Noch offen

- Zweiter echter Decksatz mit Quellenmanifest; Integration des nativen Generators für prozedurale Raum-/Verbindungsanordnung.
- Vorladen nach Sicht/Geschwindigkeit und Hysterese. Der Prüfstand lädt direkte Nachbarn und hält während des Aufbaus kurz sicher an; noch keine abgenommene cinematische Website-Reise.
- HN-/Farbbänder-Dissolve über mehrere geladene Räume: im bisherigen Blaster-Prüfstand vorhanden, im neuen Streaming-Pfad zunächst Originalkarten. Gemeinsamer HN-Besitzer und räumliche Audio-Nachbarschaft folgen separat.
- Neue Streaming-Ansicht vorerst FPS-Blaster; FPS/TPS-Vergleich bleibt im bisherigen Prüfstand. Finale Ego-Arm-/Mündungsintegration bleibt WS0.
- Gedrehte Räume, sechs Richtungen/Escher, globale Modell-/GPU-Budgets, kontrollierte Performance-/Langzeit-Plateau-Prüfung und dauerhafte Browser-/Server-Persistenz.

Kein Game-Merge. Den Einbau in den Stamm macht WS0 nach Georgs PASS. Roadmap im selben Ordner: `WSA_ROADMAP_ENDLESS_DUNGEON_SURFACE_STATE_R1_2026-11-17.md`.
