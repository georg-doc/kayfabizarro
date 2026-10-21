# Konzeptblatt · NPC Phase A (zwei Bewohner, eine Begegnung) · R1 · 2026-10-21 · WS0
Quelle: BRIEF_WS1_NPC_LIFE_R2 (V-585) Phase A; WS-NPC Bauplan Status 1 (ws-npc/status); Writers Room Export 2026-10-20c (Rollen). Felder vollständig in `concept.json`.

**Ein Satz:** Diese Szene zeigt zwei Bewohner, die ihren Tag leben und sich an der Wegkreuzung begegnen, weil ihre Pläne sich dort kreuzen, und der Spieler soll zuerst die Farmerin bei der Fluff-Ernte am Baum sehen.

**Geschichte:** Farmer B (farmer_harke) erntet morgens Fluff im Obstgarten und träumt davon, aus der Scheune eine Strohballen-Bühne zu machen. Der Lorekeeper liest an der Billboard-Karte, was neu in der Welt ist, und sucht jemanden, dem er eine Aufgabe geben kann. An der Kreuzung grüßen sie sich (oder schweigen, wenn einer beschäftigt ist) und gehen weiter. Fühlen soll man: Die Welt läuft auch ohne mich.

**Bildidee:** Die Farmerin hebt die Mistgabel zum Gruß, der Lorekeeper hebt das Buch, beide stehen mit 1,5 m Abstand auf der Kreuzung, der Weg führt in zwei Richtungen weiter.

**Fokus und Leserichtung:** Bewegung am Baum → Weg → zweite Figur → Begegnung.

**Raum:**
- Vorne: Weg-Rand mit Kontakt-Geometrie (Steinchen, Gras).
- Mitte: Kreuzung als Bühne der Begegnung, frei (Negativraum für die zwei Figuren + 1,5 m Aktionsraum).
- Hinten: Obstgarten-Bäume und Billboard als Ziele, Amphitheater-Rand als Landmarke.
- 70/20/10: 70 Gelände/Weg ruhig, 20 Bäume/Billboard Struktur, 10 Figuren + Fluff Bedeutung.

**Farbe und Licht:** Spielwelt und Spiel-Rig unverändert. Akzent ist nur der bunte Fluff am Baum. Verboten: neue Lichter, Spotlights, Glow, Blob-Schatten.

**Leben:** Tagesplan: Gehen mit Füßen am Boden (GaitAnimator), Ankunft abbremsen-drehen-Blick, Aktions-Clip as-is (Ernte bzw. Lesen), Gruß (kfb_wave_a) oder Schweigen; Unterbrechen beim Spieler und Fortsetzen.

**Beats:**
- morgens: Farmerin erntet, Lorekeeper liest
- Vormittag: beide auf dem Weg (je 2 Routen-Varianten)
- Kreuzung: bemerken → annähern → ausrichten → grüßen/schweigen → reagieren → trennen → weitermachen
- Spieler kommt: Blick + Gruß, danach Fortsetzen
- Spieler geht weg und kommt zurück: beide dort, wo der Plan sie sieht

**Besetzung:** `farmer_harke`, Lorekeeper (WSB K11). Technische Platzhalter (Spiel-Figuren mit KFB-Augen) nur für Tests hinter dem Debug-Hash; Abnahme-Clip und Georg nur mit den echten Figuren.

**Kontakt:** Jeder POI und die Kreuzung mit gebrochener Fuge Boden/Objekt (Steinchen, Gras-Büschel mit Ursache, Kanon Gebiet 4); keine neuen Assets außer vorhandenen Kanon-Teilen.

**Kameras:** 4 feste Kritiker-Kameras um die Kreuzung + Spielkamera (Third-Person).

**Prüffragen:**
- Erklärt der Tagesplan jede Bewegung?
- Ist der Gruß aus der Spielkamera lesbar?
- Stehen beide auf echtem Boden?
- Sind keine neuen Assets dazugekommen?
