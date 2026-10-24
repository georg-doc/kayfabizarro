# Briefing für Claude Design · MiB-Turm (B40) · Design-Paket R1 · WS0 · 25.10.2026 (V-530, V-732, V-737, V-740)

Du bist Art Director für KFB (Kayfabizarro), ein cartoonig-surreales Open-World-Spiel in Claymation-Optik. Du gestaltest ein Ereignis von etwa 10 Sekunden: Den Turm der Blob Corp mit seinen Men in Black. Gebaut wird später in Blender nach deinen Bildern, die Bewegung ist schon da. Es geht um Design, nicht um Technik.

## Tier 0
1. **Ergebnis sind Bilder:**
   - 8 Style-Frames, je einer für die 8 Keyframes des Storyboards (`storyboard/`);
   - Keyframe 6 geteilt in 6a und 6b, also 9 Frames;
   - ein Moodboard;
   - eine Tafel Gestaltungssprache.

   Georg nimmt diese Bilder ab. Danach baut WSB nach ihnen, und der Vergleich mit deinen Frames ist das Gate.
2. **Georgs Wortlaut gilt wörtlich** (24.10., zu einem gescheiterten Stand): „Der soll materialisieren mit einer Josie-Animation. Wie das halt ein TARDIS, ein Science-Fiction-Objekt im Raum tun. Materialisieren und dann halt cartoonig auf dem Boden aufkommen. Mit einer entsprechenden Reaction. … nicht mit einer weißen Innenwand …, sondern da soll eine Tür sein, die aufgeht. Dann sollen die drei Kleinen und der große Large-Rick da rauskommen … plausibel durch die Tür passen als Large-Rick mit ein bisschen Platz.“
3. **Der Ist-Stand in `storyboard/` ist Ausgangspunkt, kein Ziel.** Kamera, Timing und Figuren-Positionen stimmen. Es fehlt Gestaltung: Gelände, Licht-Stimmung, Glühen, Silhouetten, Staub. Die Frames zeigen, wie es aussehen soll. Den Bau in Blender regelt später der 3D-Kanon; für dich gelten daraus nur die Bildregeln unten.

## Das Ereignis (8 Keyframes, Zeiten in Sekunden)
(Das Opfer ist der Lorekeeper, ein alter Mann mit Bart. Der große Türsteher bleibt neben der Tür stehen, die Türöffnung bleibt zu mindestens 85 % frei.)

1. **0,40 Materialisieren:** Der Turm erscheint pulsierend wie die TARDIS. Oben glüht das Turm-Auge als orange-gelbe Glühkugel.
2. **1,52 Aufsetzen:** Saftig cartoonig mit Stauchung und Nachschwingen, Knet-Staubkranz. Das Opfer zuckt zusammen.
3. **2,36 Tür geht auf:** Eine echte Tür mit Griff und Scharnier schwingt auf. Gleißendes Licht flutet heraus, der erste Agent tritt als dunkle Silhouette heraus.
4. **2,95 Ausschwärmen:** Drei Agenten und der große Türsteher (Large) aus dem Licht. Die Glühkugel glüht richtig.
5. **3,37 Scannen:** Das Auge ist ein weißer Augapfel mit kleiner schwarzer Pupille und schaut sich um.
6. **5,00 Alarm und Blitzdingsen:**
   - 6a: der Treffer. Weißer Blitzstrahl auf die Kopfmitte des Opfers, Comic-Ruf „Humbug?!“ gebogen ohne Sprechblase, Figuren mindestens ¼ der Bildhöhe;
   - 6b: das Alarm-Auge. Schwarzer Augapfel, rot glühende Pupille, schmaler roter Leuchtkegel zum Ziel wie ein Zielfernrohr.
7. **6,00 Starr-Modus:** Das Alarm-Auge nah, die dunklen Knet-Lider zusammengekniffen.
8. **9,58 Abgang:** Die Agenten sind eingestiegen, der Turm hebt pulsierend ab, das Opfer bleibt orientierungslos zurück.

## Was du lieferst
1. **Moodboard (eine Tafel):** TARDIS-Materialisierung, Cartoon-Squash-and-Stretch, Men in Black, Figuren als dunkle Silhouette vor gleißendem Türlicht, Claymation-Staub, KFB-Welt-Looks aus `welt/`. Je Referenz eine Zeile, was wir nehmen und was nicht.
2. **Gestaltungssprache (eine Tafel):**
   - Turm in Anthrazit (wie im Ist-Stand), Ruf Violett #9a5cf0, Alarm-Rot #e8180e;
   - Glühkugel orange-gelb mit Hof;
   - Licht: Die Tür ist die eine Licht-Ausnahme des Ereignisses, Emission plus ein Pool-Licht, nur während des Ereignisses (V-733). Glühkugel, rote Pupille und Zielstrahl leuchten nur als Emission bzw. Bloom und werfen kein weiteres Licht auf die Szene. Sonst gilt das eine Licht-Rig der Welt (`konzept/LIGHT_MODEL_R2.md`);
   - Silhouetten im Gleißen: dunkel, nicht grau, allein durch das Türlicht. Kein Randlicht, kein Saum, kein Heiligenschein an Figuren;
   - Stimmung: kühl-komische Dämmerung wie im Ist-Stand, Turm dunkel. Keine Neon-Flächen, kein eingebackenes Licht, keine zweite Lampe;
   - Ruf „Humbug?!“: Knet-Lettering, gebogen, ohne Sprechblase, Violett, im Standbild in der Pose des Auftauchens (pop);
   - Staub und Puls als Knete;
   - Gelände: wie der Turm im Boden sitzt (Kontakt, Bodendunst, Vordergrund, eine kleine Ortsgeschichte), nach `konzept/CANON_3D_R1.md`.
3. **9 Style-Frames:** 16:9, Kamera wie im jeweiligen Keyframe, in Endqualität des Looks (Claymation, KFB-Augen, Knete-Oberflächen), nicht als Skizze. Zu jedem Frame eine Zeile, was sich gegenüber dem Ist-Stand ändert.
   - Bildaufbau nach `CANON_3D_R1.md` Gebiet 12 und 16: ein Fokus, drei Tiefenebenen, Ruhe/Struktur/Bedeutung 70/20/10. Keine Tiefenunschärfe, kein Tilt-Shift, keine Vignette, kein Bildschirm-Verlauf (sonst nicht nachbaubar). Staub und Effekte ohne eigenes Leuchten.
   - In den Frames 3, 4, 5 und 6a sind die Figuren mindestens ¼ der Bildhöhe groß.
   - Bewegung liegt im Daumenkino vor; Ton und SFX sind nicht Teil dieses Pakets.

## Material in diesem Paket
- `storyboard/`:
  - `B40_storyboard_r1.png` (Bogen) und `STORYBOARD.md` (Kamera, Augenzustand, offene Punkte je Keyframe);
  - die 8 Keyframes einzeln als JPG: 1 `B40_r6C_1_wide`, 2 `B40_r6C_2_wide`, 3 `B40_r6C_3_door`, 4 `B40_r6C_4_swarm`, 5 `B40_r6C_5_scan`, 6 `B40_r6C_6_alarm`, 7 Starr-Modus `B40_r6C_8_orb`, 8 Abgang `B40_r6C_7_wide` (in `STORYBOARD.md` stehen sie als PNG-Pfade im Blender-Ordner);
  - `B40_r6C_daumenkino.mp4` (die ganzen 10 s).
- `konzept/`:
  - `KONZEPTBLATT_MIB_TURM_R2.md`: Daraus gelten nur Ablauf und Maße (Tür = Höhe des Large-Agenten / 0,87). Überholt sind die Abschnitte zur Orb-Helligkeit (70-%-Grenze entfällt, die Glühkugel glüht richtig), zur Bilderliste und zu den gemessenen Gates (V-737, V-740). Ob die Tür das hellste Feld bleibt, entscheidet das Bild;
  - `REGISTER_AUSZUG_B40.md` (Georgs Entscheidungen im Wortlaut; für das Ereignis zählen V-530, V-732, V-733, V-737, dazu Licht V-385 und Arbeitsweise V-740/V-741);
  - `CANON_3D_R1.md` (verbindliche 3D-Regeln);
  - `LIGHT_MODEL_R2.md` (ein Licht-Rig).
- `figuren/`:
  - Agenten-Trio mit Frisuren, Sonnenbrillen, Augen und Lidern;
  - Opfer-Streifen (Sturz, Zucken, Aufrappeln);
  - Georgs Tür-Markierung (am unbearbeiteten Ursprungsmodell, nur zur Lage der Tür);
  - frühere Orb- und Augen-Varianten (überholt durch V-737, nur zur Form).
- `welt/`: Farbregel-Tafeln für Canyon, Bucht und O-Town, eine O-Town-Szene nach der Regel und ein Relief-Test (Karte als Knetkugel-Gelände). Für den Boden unter dem Turm gibt es kein fertiges Vorbild: führe ihn über die Palette und eine kleine Ortsgeschichte.

## Grenzen
- **KFB-Augen:** cartoonig, große Pupille, dunkle Knet-Lider. Keine realistischen Augen.
- **Turm und Figuren:** Turm-Form und Figuren bleiben wie im Ist-Stand. Du gestaltest Licht, Farbe, Gelände, Effekte und Bildaufbau, keine neuen Figuren.
- **Keine Sci-Fi-Kitsch-Hologramme,** kein Effekt ohne Bildidee.
- **Rückgabe:** Bilder plus eine kurze Übersicht als Datei. Georg legt sie in den Hub.
