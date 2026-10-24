# Briefing für Claude Design · kfb-place P0 „Lichtung am Waldrand“ · 4 Style-Frames · WS0 · 25.10.2026 (V-740, V-748, V-750, V-752)

Du bist Art Director für KFB (Kayfabizarro), ein cartoonig-surreales Open-World-Spiel in Claymation-Optik. Gebaut wird später nach deinen Bildern: als Proof in Blender und als Zelle der prozeduralen Spielwelt. Beide nutzen dasselbe Regelwerk (`konzept/kfb_place.r1.json`). Es geht um Design, nicht um Technik.

## Tier 0
1. **Ergebnis sind 4 Style-Frames** einer einzigen Lichtung am Waldrand: PNG, mindestens 1920 × 1080, 16:9, Endqualität des Looks, keine Skizze. Georg nimmt sie ab, danach ist der Bildvergleich gegen deine Frames das Gate.
2. **Die Szene in einem Satz:** „Diese Lichtung zeigt einen alten Waldrand am Hang, weil der Wind das Laub hangabwärts treibt, und der Spieler sieht zuerst den Baumstumpf mit Fluff.“ Lies dazu `konzept/KONZEPTBLATT_KFB_PLACE_R1.md`, Abschnitte 2b, 2c, 2d und 3 (P0-Konzeptfelder).
3. **Ein handgemachtes Objekt, keine Streuung, keine Figuren:**
   - Dreier-Gruppen (1 groß, 3 mittel, Rest klein), Größen 1 : 0,62 : 0,38.
   - Alles sitzt mit Kontakt im Boden, nichts schwebt außer dem Fundstück, nichts piekt durch.
   - In P0 gibt es keine Figuren.

## Die vier Frames und ihre Kameras
1. **Lichtung am Hang (Spielkamera: Dritte Person, etwa 35° Neigung, 8–10 m Abstand):**
   - Vorn die Steinspur, in der Mitte der Stumpf und das Busch-Nest, hinten die Baumgruppe mit dem alten Baum und das Steinnest am Hang. Die freie Lichtung ist der Negativraum.
   - Leserichtung: Steinspur → Stumpf → alter Baum. Der Vordergrund nimmt höchstens 15 % der Fläche ein.
   - Der Fokus (Stumpf mit Fluff) belegt 2–10 % des Bildes und liegt nicht im unteren Rand, wo im Spiel das HUD sitzt.
2. **Stumpf mit Fluff und Fundstück (Augenhöhe, etwa 1,5 m, vom Weg auf den Stumpf):**
   - Am Stumpf: Sägeschnitt, Axtkerbe, Moos auf der Schnittfläche. Zwei Holzstücke desselben Stamms liegen in Wurfweite.
   - Das Fokus-Fluff sitzt im Busch-Nest direkt am Stumpf oder in der Krone des alten Baums dahinter. Der Stumpf selbst trägt keinen Fluff.
   - Ein Fundstück (Axt oder Brotzeit) schwebt 15 cm über dem Boden neben dem Stumpf, langsam drehend; eine Axt schräg 35°.
3. **Fallobst rollt hangabwärts (frei gewählte Kamera, halbnah):**
   - Fluff-Kugeln haben sich aus der Krone des alten Baums gelöst, die Krone ist im Bild. Der Schlag selbst ist nicht zu sehen.
   - Die Kugeln hüpfen und rollen hangab und bleiben an Steinen und Mulden liegen.
4. **Steinnest am Hang (nah, Kamera am Fuß der Gruppe):**
   - Ein großer Stein, drei mittlere, wenige Kiesel. Große und mittlere Steine stecken zu 40–50 % im Boden, Kiesel zu 30–40 %.
   - Alle gerundet, Moos in den Fugen, die Kiesel liegen hangabwärts.

**Lebensanker:** Fluff wiegt im Wind je Gruppe, das Fundstück dreht sich. Das darf im Standbild angedeutet sein.

## Gestaltungsregeln
- **Fluff:**
  - Je Baum ein Hero-Nest an der Lichtseite der Krone, dazu 0–2 kleinere. Je Nest 5–7 Kugeln (1 groß, 3 mittel, 1–3 klein).
  - Je Nest genau eine Farbe aus den sechs Story-Mode-Farben (satte Variante): Forbidden #a64670, Heroic #d97c3a, Mystical #6b4e7d oder Absurd #e9c14a. Auf grünem Laub nie Comic #7a8d4a oder Tragic #3e6a83.
  - In Frame 1 haben Baum- und Busch-Nester dieselbe Farbe. Höchstens zwei Akzentfarben im Bild (Fluff und Fundstück), die stärkste Sättigung nur am Fokus.
  - Keine verstreuten Einzelkugeln: `referenzen/01_…_IST_fluff_R1` zeigt genau, was wir NICHT wollen.
- **Steinspur:**
  - Kein Holz. Steine und Fragmente in den Formen des Steinkits (`03–04`), organisch verteilt.
  - Aus `05` nur den Dichteverlauf übernehmen: heiler Kern, dann verwittert gerundete Stücke dicht → locker, einzelne fehlen, Erde in der Lücke, keine Reihe. Von dort keine Scheiben, keine Platte, kein Konfetti, keine Farbe.
- **Kontakt und Übergänge:**
  - Jedes Objekt hat am Fuß kleine Knet-Elemente mit Ursache (Moos, Kiesel, Erdkeil) auf 40–50 % des Umfangs, mit Lücke, kein Kranz.
  - Der Kontaktton ist eine harte schmale dunkle Stufe, kein Verlauf. Bodenübergänge nur als Sprenkel, nie Linie oder Verlauf.
- **Farbe:**
  - Eine Regel, das Farbharmonie-Modell (`konzept/COLOR_HARMONY_R1_README.md`, Bilder `06_…`). Der Boden trägt den Grundton des Bioms „moos“ (moosiges Grün), das Laub ist natürlich grün (Vorgabe nach README), der Himmel ist Laub +90°.
  - Stein- und Rindenfarbe kommen aus der Insel-Palette, nicht aus den sandfarbenen Steinen in `03–04`.
- **Licht:** Ein Licht, ruhige Mittagssonne hoch von links vorn, echte Schatten. Kein Rand- oder Gegenlicht, kein Neon, keine zweite Lampe.
- **Bildaufbau:**
  - Ein Fokus. Drei Tiefenebenen, drei Wertmassen, Ruhe/Struktur/Bedeutung 70/20/10. Der stärkste Hell-Dunkel-Kontrast liegt am Stumpf (Graustufen-Check).
  - Keine Tiefenunschärfe, kein Tilt-Shift, keine Vignette, kein Bildschirm-Verlauf, sonst ist es nicht nachbaubar.
- **Formen** (keine neuen erfinden), alles mit Knet-Oberfläche:
  - Bäume: nur die runden Kronen aus `07_kaykit_forest_uebersicht` bzw. `01` oben links (Bäume 1–3) und `02`. Keine würfeligen und keine Schirm-Kronen.
  - Büsche: aus `07` (runde Büsche).
  - Stumpf und Holzstücke: `08_kenney_…`.
  - Steine: `03–04`.

## Was du lieferst
- Die 4 Frames als PNG.
- Je Frame eine Zeile: Kamera (Höhe, Neigung, Abstand), welche Gruppe, welche Rolle (Anker, Stütze, Akzent), welcher Farbton (Rolle der Harmonie-Regel bzw. Story-Mode-Farbe).
- Eine kurze Übersicht als Markdown-Datei. Georg legt alles in den Hub.
