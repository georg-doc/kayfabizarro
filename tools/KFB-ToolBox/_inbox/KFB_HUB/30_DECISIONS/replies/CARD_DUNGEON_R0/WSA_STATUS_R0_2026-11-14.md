# Card Dungeon R0 · Zwischenstand 14.11.2026

**WIP, nicht veröffentlicht, kein Merge.** Bestehende private InfiniteRooms-Site weiterhin auf Audio-R2 / Version 6 / Quellstand 4af4764bb92ded80a0f75382b7171a121aad0b26. Lokaler Arbeitszweig: wsa/card-dungeon-r0-20261114; Host-Pin 58b070e6f3c63a444841b5390ea3fac9e337247c.

## Georgs Entscheidung
Originale Cube-Augen für R0 ausdrücklich erlaubt. Der belegte Figurenkarten-Widerspruch betrifft Ghost. Bevorzugt werden Cactus/Chicken/Cyclops mit bereits vorhandenen K15-KFB-Augenankern. Keine neuen Augenanker modellieren, keine automatische Änderung der Figurenkarten. Ausnahme als R0-Entscheidung, nicht als neue allgemeine Kanonregel.

## Tatsächlich geprüft
- 65/65 Node-Tests grün; darunter Fortschrittslogik, zwei Zwölf-Raum-Graphen mit verbundenem Fünferpfad, erste Reservierung, Kill/Heal-Idempotenz, Truhen-Sperre, Sammeln und Wiederbetreten.
- Build erfolgreich. Hinweis des Bundlers: große JS-Chunks; kein Performance-PASS daraus ableiten.
- Browser: nativer FB-LocoActor OK, FB_CANON R8 A11 OK, linkes Ohr 17.556 Vertices, bestehendes Gesicht und Mund. Cactus und Chicken über npcFigure/Figurenkarten sichtbar und OK, native Mixer/Clips, rote Eye-Goo-Augen. Screenshot und sichtbare QA-Daten im Ordner.
- Flächenreparaturen lokal: keine auf einen Ecktexel kollabierten Laibungs-UVs, kein Paper-only-Frame auf sichtbaren Wandflächen; ebene Böden ohne Bevel-Fuge, bündige Höhen-Header; HyperNorm ein globales Feld statt Tür-Weichzeichnungsstreifen; Terrain3-Bandfilter und 1,5×-Bildmodus.
- Diese Prüfung ist keine vollständige Dungeon- oder Kanon-/Kritiker-Abnahme. Keine kontrollierte neue Gesamt-Performance-Messung.

## Noch zu verbinden und im Spiel zu prüfen
1. Native zwölf Räume mit fünf aktiven Begegnungsräumen an die bestehende begehbare Raumhaut anschließen, aktueller/nächster Raum aktiv.
2. Ein combatPlayer.r2 und flufferSim; Kampf und Heilung mit echten Treffer-/Abwurfmarkern. Bisher Figuren-Vorprüfung, noch kein kompletter Kampf.
3. cardCollection/cardRelief, cardEdge, Hero-Shot und HUD-Fächer. Erste Seite ausschließen, Reservierung erst beim ersten Eintritt. Native lose Karten sind Bodenkarten; für schwebende Belohnung dünner Adapter nötig, kein zweiter Kartenspeicher.
4. Native Truhe über popupClayCore und chest.open nach Freigabe, echte Slop2D-Atlanten für spätere Räume. Native Truhenbeute darf nicht zusätzlich zur Sammlung einen zweiten Kartenpfad auslösen.
5. Vollständiger Durchlauf, Tonvideo, zwei Saaten, Oberflächenvergleich, Gates und einmaliger Kritiker. Erst anschließend bestehende private InfiniteRooms-Site aktualisieren.

Keine neue Site, kein Stage-Eingriff, keine WebGPU-Übernahme. Freier Speicher nach Arbeit rund 28 GiB. Keine neuen Abhängigkeiten installiert.
