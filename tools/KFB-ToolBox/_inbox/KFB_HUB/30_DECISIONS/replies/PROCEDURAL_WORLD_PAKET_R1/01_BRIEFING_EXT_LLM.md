# Briefing für die externe Prüfung: KFB prozedurale Welt (Terrain und Cartoon-Environment)

Stand 25.10.2026 · Autor WS0 (Steuerung) für Georg von Westphalen · Paket `PROCEDURAL_WORLD_PAKET_R1`

## 1 · Deine Rolle und der Auftrag

Du bist Prüfer und Berater für prozedurale Cartoon-Umgebungen. Du recherchierst, kritisierst und optimierst unser Konzept für eine prozedural erzeugte, endlose 3D-Spielwelt im Cartoon-Knet-Look. Teil 2 ist die konsolidierte Fassung (SSOT), Teil 3 enthält die Kanon-Quellen im Wortlaut.

**Was wir von dir wollen:**

1. **Recherche:** Wie lösen gute Vorbilder das? Gemeint sind Spiele, Werkzeuge, Papers und GDC-Vorträge mit prozeduraler Platzierung in stilisierten Welten. Beispiele: Townscaper, Tiny Glade, Islanders, Dorfromantik, A Short Hike, Zelda: Breath of the Wild und Tears of the Kingdom, Horizon Zero Dawn (GPU-Placement, GDC 2017), Ghost of Tsushima (Wind und Gras), Houdini-Scatter-Workflows, Wave Function Collapse (Gumin, Oskar Stålberg), Poisson-Disc, Ökosystem-Simulation.
   - Liefere konkrete Techniken mit Quelle.
   - Trenne klar: QUELLE (belegt) und INFERENZ (deine Übertragung).
2. **Kritik:** Wo ist das Modell falsch, widersprüchlich oder unvollständig? Und warum scheitern unsere Bilder trotz bestandener Gates (§4 und §5)?
3. **Optimierung:** Ein umsetzbares Zielmodell für die Platzierung, als Ebenen bzw. Pipeline mit Pseudocode und Zahlen. Es soll in einem Browser-Spiel (three.js, WebGL2, Worker, 64-m-Zellen) und in einer Blender-Kette laufen.
4. **Antworten auf die offenen Fragen in §3**, jeweils mit Empfehlung.

**Form der Antwort:**
- Deutsch.
- Erst eine Kurzfassung mit höchstens 10 Punkten, dann die Details.
- Pseudocode statt Prosa, wo es um Verfahren geht.
- Zahlen mit Herkunft.
- Keine Lizenz- oder Rechtshinweise.

## 2 · Was nicht verhandelbar ist (Georgs Entscheidungen)

- **Benchmark-Look:** KayKit-Promobilder plus klassische Cartoon-Hintergrundkunst: Herriman (Krazy Kat), Maurice Noble (Looney Tunes, Road Runner), Art Lozzi (Hanna-Barbera), Watterson (Calvin & Hobbes, Sonntagsseiten).
- **Terrain-Malerei:** Die „Fließfarben“ (terrain3: organische Farbbänder und fließende Formen) bleiben. Sie werden nicht gedämpft und nicht verflacht.
- **Farben (V-800):**
  - Joyride/Bucht, Canyon und O-Town (J17-Goldstandard) sind nur die Basis.
  - Nach ihrer Logik erzeugt unser OKLCH-Generator (V-305) je Biom eine zufällige, harmonische, bunte Palette mit sechs Leitfarben: Boden, Strang, Wahrzeichen, Laub, Himmel, Rinde, je mit Leiter. Die Gesamtanmutung entspricht den drei Golden Samples.
  - Dieselben Farben färben passend und auch surreal: Terrain, Fluids, Bäume, Sträucher, Steine, Grasblatt-Gruppen, Pflanzen, Gebäude, OSM, Dioramen, Mindscapes, Billboards. Kit-Farben werden nicht verwendet.
- **Materialcodes und Ortsbiografie** (Kanon-Konzept, Teil 3) gelten:
  - wenige Materialien je Ort;
  - Verteilung aus Ursachen: Entstehen → Nutzen → Vergehen → Bewachsen.
- **Kein Clutter:**
  - keine Kiesel-Nester;
  - keine Kontakt- oder Fußsteinchen als Objekte;
  - kein Streugras aus Einzelhalmen.
- **Etherington-Regeln in Zahlen** gelten:
  - ungerade Gruppen;
  - 1 : 0,6 : 0,35 : 0,15;
  - Abstände ≥ 30 % verschieden;
  - keine Tangenten;
  - ≥ 30 % Negativraum.
- **Assets wie geliefert:** Kit-Teile werden nicht verformt, nur gleichmäßig skaliert. „Use what works“: erst vorhandene Quellen und Werkzeuge, dann Eigenbau.
- **Ein Licht-Rig** für alles, keine Tricks. Erdung kommt aus Material und Schatten (Kontaktton), nicht aus Blob-Schatten.
- **Visual first:** Georg nimmt Bilder ab, keine Messwerte. Ein grünes Gate beweist den Look nicht.
- **Varianz (neu, 25.10.):** Alle passenden Nature- und Environment-Assets sollen für WFC und Platzierung zur Verfügung stehen und genutzt werden: KayKit, Tiny Treats, Quaternius Ultimate Nature und Stylized Nature MegaKit, dazu Kenney Nature. Bisher wird nur KayKit Forest (84 Modelle) plus ein Steinkit genutzt. Inventar: Teil 2 §6.

## 3 · Offene Fragen (bitte jeweils mit Empfehlung)

1. **Ebenenmodell:** Wie leiten wir Lozzis „Ebenen“ aus einem endlosen Höhenfeld ab: Bank, Hügel, Grat, Ferne? Damit Bewuchs an Ebenenkanten sitzt und nicht verstreut. Grat-/Kantenerkennung, Krümmung, Sichtbarkeit aus der Spielkamera? Welche Maße funktionieren in Echtzeit?
2. **Ursachenfelder:** Wie sieht eine robuste, billige Feldkette für die Ortsbiografie aus, und in welcher Reihenfolge? Gemeint sind Hangbruch, Mulde, Feuchte, Weg, Schatten, Wind. Mit welchen Schwellen bzw. Stufenfunktionen bekommt man Cartoon-Zonen mit klaren Kanten statt Rauschen?
3. **WFC oder Regeln:** Wo bringt Wave Function Collapse echten Nutzen, und wo reichen Poisson-Disc, Eltern-Kind-Streuung und Stamps? Heute nutzt WFC nur die Slot-Belegung einer Gruppe (`solveLocal`). Lohnt sich WFC für Zonen- oder Kachel-Nachbarschaften (Ufer, Wegkanten, Waldrand)?
4. **Materialcode in 3D-Knete:** Wie übersetzt man Herriman- und Noble-Codes in 3D? Gemeint sind Fels mit Streifen/Schichtlinien, Mesa mit Punkten, Rinde mit Tupfen. Shader (triplanar, Detail-Normal), Geometrie oder Decals? Was ist mit Kit-Assets, deren Geometrie wir nicht ändern dürfen?
5. **Varianz ohne Chaos:** Wie mischen wir fünf Asset-Familien (KayKit, Tiny Treats, Quaternius ×2, Kenney) mit unterschiedlicher Formensprache und Skala? Kandidaten: Familien je Ort, Form-DNA-Klassen, Skalen-Normierung, Rolle je Asset.
6. **Maßstab:** Bäume sind 1/20 bis 1/30 der Hügelhöhe; die Kritiker monieren das. Relief senken, Assets skalieren oder Kamera und Brennweite ändern? Und wie bleibt das Fahrgefühl erhalten?
7. **Ferne:** Bewuchs steht nur auf den nahen 64-m-Kacheln, deshalb endet der Wald hart. Welche Technik passt für Silhouetten und Impostor in der Ferne im Cartoon-Look?
8. **Abnahme:** Welche automatisch messbaren Proxys korrelieren tatsächlich mit „sieht aus wie KayKit / Noble / Lozzi“? Unsere Gates messen Gruppenregeln, und die Bilder fallen trotzdem durch.
9. **Gras:** Gras ist Material. Wie sieht ein Cartoon-Grasansatz aus, der nicht „Streu“ ist? Kandidaten: Bodenzeichen im Shader, Büschel nur an Kanten und Füßen, Fell-/Shell-Gras, Karten.
10. **Fluff (Spiel-Sammelobjekt, orange Kugelnester):** Wie viel davon und wo, ohne dass es den Look dominiert?

## 4 · Wiederkehrende Probleme

- **Mikro-Grammatik statt Bild:** Wir haben stundenlang Regeln auf Gruppenebene poliert (Anker, Stützen, Kiesel, Kontaktsteinchen, Fußgras, Moosfugen, Hüllen-Tabellen, Kontaktfenster). Das Gate wurde grün, der Kritiker sagte REWORK, Georg sagte FAIL. Das Bild war „gebastelt“.
- **Falsches Vorbild-Verständnis:** Die KayKit-Videos und -Beispielbilder waren nie angesehen worden; in den alten Notizen steht „0 Videobilder gesehen“. Kritiker-Vorschläge haben Georgs Konzept überschrieben: Fließbänder gedämpft, Palette verflacht.
- **Rauschen als Verteilung:** Haine bzw. Waldmassen aus einem Rauschfeld gibt es ohne Ursache. Gleichmäßige Streuung ergibt „Konfetti“.
- **Maßstab:** Props sind zu klein gegen das Relief der Fahrwelt.
- **Eigenbau statt Vorlage:** Ohr-Nachbildungen, eigene Maße und Glättungen, obwohl Originale vorliegen (FrizzleBob-Fall, gleiches Muster).
- **Biom-Paletten:** Lange liefen sie über einen Nebengenerator mit gedämpften Bändern (Kontrast −40 %, Sättigung −35 %, Kritiker-Folge). Das Terrain wirkte wie realistische Erde und Grasland statt Cartoon-Palette. Seit V-800 ist das behoben.
- **Technik-Fehler in Serie:**
  - Kit-Farben überschreiben die Rollenfarben: Der Knet-Shader-Pull zieht die Palette zurück, die Batch-Farbtextur fehlt im Programm.
  - Vertex-Farben verloren (schwarze Steine).
  - Zufällige Ladereihenfolge: weißes Laub.
- **Prozess:** Viele kleine Iterationen mit dem Blender-Team gegen das Gate statt eines Bildes für Georg. Die Stopp-Regel griff erst nach drei Kritiker-Runden.

## 5 · Fails im Verlauf (Kurzchronik)

- **Endlose Welt, Kritiker R1:** 3,1 REWORK. Konfetti statt Haine, Maßstab, Marmor-Boden, schwarze Steine.
- **R2:** 3,9 REWORK, nach Bodenberuhigung, Haine und Palette. Georg danach FAIL (q210): „Terrain undeutlicher, Farbbänder fast weg, Verteilungsmuster falsch, keine natürlichen Verteilungsmuster.“
- **Blender-Szene P0** („Lichtung am Waldrand“), Gate grün, Kritiker 5,2 / 4,6 / 5,7 REWORK. Stopp nach drei Runden. Georg FAIL (q211): „schlampig gebastelt, unzählige kleine Steine → Materialcodes, kein Clutter; falsche mentale Modelle; sieht nicht aus wie die KayKit-Promobilder.“
- **Stilbild „Waldmassen“** nach KayKit-Analyse (Zonenfeld, dichte Masse, Waldboden-Zone): schöne Waldflächen, aber laut Georg „die cartoonige Verteilungslogik und Materialcodes nicht verstanden“.
- **Stilbild 2** nach Modell R3 (Grate mit Baumreihen, Formationen an Hangbrüchen, Solitäre mit Ablegern): Auf der Wiese stehen wieder zu viele gleichmäßig verteilte Bäume. Die Rollenfarben greifen technisch noch nicht. Nicht abgenommen.

## 6 · Bewertungsmaßstab für deine Vorschläge

- Muss in einem Browser-Spiel laufen: Worker, ≤ 8 ms je Frame-Scheibe, ≤ 15k Instanzen, BatchedMesh.
- Muss als Regel-Datei (JSON) plus Löser (JS-Modul) für Spiel und Blender gleich laufen. Eine Wahrheit, zwei Laufzeiten.
- Muss Georgs Abnahme im Bild bestehen, nicht nur Messwerte.
- Weniger ist mehr: Eine starke Szene ist besser als ein Katalog.

## 7 · Bilder und Referenzen im Paket

`refs/`:
- KayKit-Beispielbilder (Hexagon, Builder);
- Kays Godot-Szene (Video Vfr3n4WKsc0);
- Cartoon-Tafel (Herriman, Noble, Lozzi);
- unsere Stilbilder und Fails (endlose Welt A/B/C, Waldmassen, Stilbild 2, P0-Tafel r28).
