# Buchmaschine → WS0 · R1 · 22.11.2026

Absender: Modul-Session Buchmaschine („Build KFB book processor machine module“). WS0-Session war nicht erreichbar, deshalb hier im Hub.

## Stand
- Gate (a) PASS (Georg 22.11.): Orrery 06-orrery (Adam Chernick, MIT) mit unveränderter Mechanik in WebGL, alle 13 Paare greifen (meshError < 1e-12). Video `GATE_A_ORRERY_WEBGL_R1.mp4`, Quellen `src_gateA/`.
- Gate (b) läuft: ein Original-Paar (33/63) in drei Materialien über kfb-clay v1.2 (vendor byte-gleich) plus waffenLook.r1 `diesel`. Keine eigene Knete, kein eigener Rost.

## Georg 22.11. (Chat, neu, für dich zur Abstimmung)
1. **patch.gg-Effekte:** Geometry Painter (patch.gg/patch/geometry-painter) und die glühenden Risse, die wir schon übernommen haben, sollen die Funktionsphasen der Buchmaschine sichtbar machen: Aktivitätszentren, Prozesse, Verläufe, Schnittkanten an Buch und Seiten. Erst die Grundform bauen, Effekte konzeptionell je Phase choreografiert, so dass die Maschine auch als Bildschirmschoner laufen kann.
   - **Frage:** V-2041 nennt deinen WebGL-Port der drei Modi (Glowing reef, Molten cracks, Aurora silk) als „ein Effekt-Modul für alle“. Wo liegt er (Branch, Pfad, Schalter), oder ist er noch nicht gebaut? Ich nutze nur dieses eine Modul und baue keinen eigenen Port. Gibt es außerdem schon eine Naht für die glühenden Risse in 3D-Modellen (welche Datei)?
2. **Spielzeugteile:** Brettspiel-Witz (Schachfiguren, Aufsteller, Würfel) wie im Pendel-Scenelet (theater/bot-theatre-pendulum-r11) darf in die Maschine. **Frage:** Welche Teile/Dateien sind dort freigegeben?
3. **Ankündigung:** Die beiden Bots aus dem Pendel-Theater werden eventuell auch die **Bediener der Buchmaschine**: Sie malen nicht nur mit dem Pendel-Farbtopf, sie helfen auch beim Digitalisieren und dann beim Zerstören der Bücher, gezeigt an unserem Comic-Sachbuch. Ich plane sie im Storyboard (Gate c) als Bediener ein und baue nichts an ihren Rigs/Clips.

## Was ich brauche
Antwort hier im Ordner (`AN_BUCHMASCHINE_…md`) oder per Nachricht an diese Session: Port-Pfad Geometry Painter, Riss-Naht, Liste Spielzeugteile, Bot-Clips/Bibliothek, die ich im Storyboard nennen darf.

## Nachtrag 22.11. · Georg nach Gate (b) (Chat)
4. **Material:** Georg findet den Spielzeug-Teil (C) am passendsten, startet aber mit dem **Mix A+B+C** je Bauteil. Die Looks sollen **umschaltbar** sein wie die Waffen-Skins (Spielzeug ↔ realistisch): A, B, C, Mix und spätere weitere, je Spielkontext. Bedienung über den **szenenspezifischen Action-Button mit Flyout** des Scenelets. Das Modul nimmt den Look als Preset (`lookId`) entgegen und baut kein eigenes Menü. **Frage:** Welcher Baustein ist heute der Scenelet-Action-Button bzw. das Flyout (Datei/Schalter), damit ich nur die Optionen liefere?
5. **Sternzeichen:** Dasselbe Modul soll auch die Sternzeichen-Konstellationen zeigen können wie im Orrery-Original (dort `sky.tsx` / `signs.ts`, Linienfiguren aus d3-celestial, BSD-3). Passt zu V-2027 (Sternzeichen-Rätsel). Ich plane das als zweiten Modus des Uhrwerks ein.
6. **Infinite Rooms als Kammer (bitte mit dir abstimmen):** Georg möchte die Buchmaschine zusätzlich als Installation in einem großen **WSA Infinite Room** zeigen (voxelbasierter prozeduraler Dungeon, Karten an den Wänden, HyperNorm-Projektionen an Wänden/Decke/Boden). Spieler kommen über Dungeon-Wege in die riesige Kammer, in der das übergroße Buch gerade digitalisiert bzw. zerstört wird. Variante zu HyperNorm: Karten aus dem Deck „Hilfe, ich bin ein Mensch!“ an den Wänden. Greift der Spieler ein, spuckt die Maschine einzelne **KFB-Cards als gerettete Zeitkapseln** aus. Sie landen auf einem Stapel, die beiden Bots tragen sie herum oder geben sie in den Nachbarraum weiter. Das Pendel bleibt in der Open World, die Buchmaschine bekommt die Kammer als Hauptbühne, läuft aber auch als Open-World-Scenelet.
   - **Mein Vorschlag zur Naht:** Das Modul bleibt wirtsneutral (Licht/Material/Look vom Host wie createRide). Es meldet nur Ereignisse (`seiteEingezogen`, `schnitt`, `karteAusgeworfen {deck, nr}`, `phase`). Kartenstapel, Bot-Wege, Raumwechsel und Wandprojektion gehören dem Raum bzw. dem Host. **Frage:** Kannst du die Kammer im Infinite-Rooms-Modul vorbereiten (Größe, Lichtangebot, Anker für die Maschine) und sagen, welches Karten-Auswurf-/Stapel-Modul es schon gibt?

## Nachtrag 22.11. · Storyboard Gate (c) und zweiter Spender
7. **Storyboard R1** veröffentlicht: claude.ai/artifact/KQSXVfSGKp4ct2fs8x7Cgr (Datei `GATE_C_STORYBOARD_R1.html` hier im Ordner). Zwölf Bilder als Endlosschleife: Ruhe → Ankurbeln → Aufschlagen → Einzug → Scannen → Ritzen → Schälen → Blödsinn! (rückwärts) → Leimen → Auswurf → Lesen → Weitergeben. Jedes Bild hängt an einer echten Karte aus dem Deck „Hilfe, ich bin ein Mensch!“ (u. a. Bullshit Jobs, The Filter Bubble, The Scissors, Veneer Theory, Blödsinn!, The Glue Stick, Resonance, Hope). Effekt-Modell: Kraft = Glowing reef, Zerstörung = Molten cracks, Bedeutung = Aurora silk. Wartet auf Georgs PASS/TUNE/FAIL.
8. **Zweiter Spender (Georg 22.11.):** Codevember 09-membrane (gleiches Repo acher249/codevember-2026, MIT). Trick: Jede Schicht ist schon mit der nächsten bedruckt, eine abgeschälte Kachel wird zur Schicht darunter. Für uns ist das die Schälwalze: Jede abgeschälte Buchseite trägt darunter die nächste Seite, so läuft die Zerstörung endlos und bleibt logisch. Der Spender ist WebGPU/TSL, das Einrollen ist aber reine Vertex-Rechnung. Ich portiere es nach WebGL innerhalb des Moduls, wie das Orrery. **Frage:** Gibt es dagegen etwas, oder soll das ein gemeinsames Effekt-Modul werden (wie der Geometry-Painter-Port)?

## Nachtrag 22.11. · Georg: nichts selbst bauen
9. Georg will keine Eigenbauten der Modul-Session. Bauweise: Rahmen = WSB-Gerüst-Baukasten r1–r3 (Einrüsten um die Maschine, Häute im Mix/Spielzeugfarben), Antrieb = Orrery-Teile, Signature-Parts aus Bestand, freien Modellen oder Georgs Meshy. Stückliste: `STUECKLISTE_BUCHMASCHINE_R1_2026-11-22.md` (hier im Ordner).
   - **Für WSB (bitte weiterleiten, wenn du einverstanden bist):** Pivots/Achsen für Georgs Meshy-Signature-Parts setzen und die fertige Maschine mit `geruest_einruesten.py` einrüsten (Modus absurd, Häute gemischt). Ich instanziere dann aus dem Layout.

## Nachtrag 22.11. · Kurswechsel (Georg: „zwei Schritte zurück“)
10. Keine Fließband-Fabrik und keine Stückliste mehr. Das Orrery bleibt, wie es ist; das Buch ersetzt die Sonne; die Seiten schälen sich mit der Membran-Logik ab, solange die Kurbel läuft. Unter jeder Seite liegt die nächste Doppelseite (Leseprobe, 8 Doppelseiten). Stückliste, Meshy-Liste und die Bitte an WSB (Punkt 9) ruhen damit.
    - Beleg: `BUCHMASCHINE_R1_ORRERY_BUCH_SCHAELEN.mp4`, Quellen `src_r1/` (schaelen.js = WebGL-Port von 09-membrane, flacher Fall).
    - Georg hat ein Meshy-Buch in aufgeklappter Form erzeugt; es ersetzt den Platzhalter, sobald es auf der Platte liegt.

## Nachtrag 22.11. · Buch-Auftrag an WSB (Georg: „über WS0 als Auftrag an WSB“)
11. Bitte `AUFTRAG_WSB_BUCH_R1_2026-11-22.md` (hier im Ordner) in den WSB-Kanal geben. Georg hat WSB parallel schon direkt gefragt; der Auftrag ergänzt die Technik (Klappenbroschur aus dem Umschlag-PDF 549 × 230 mm, offen mit Wölbung, Blattkanten, schlankes Rig fürs weiche Nachfedern, eigenes Netz für die Doppelseite).
12. Georg zur Animation: Buch auf einer drehenden Scheibe oben (von unten verschraubt), weich und cartoonig nachfedernd; Schälen erst in einer hängenden Lage; Tesla-Bögen (energy-arc VOLTAGE_FILAMENT, Plasmakugel) und Geometry Painter um Planeten und Buch; Look einheitlich Rost wie die Seemine (Aqua, rost_diff/nor/arm) im Dieselpunk-Stil mit abgeplatztem Lack und Chrom, Planeten farbig; dazu goldgelbes Maschinenöl (Inkwave) und Farbspritzer. Ich baue das in der Probebühne.
