# Briefing für die externe Prüfung: KFB prozedurale Welt (Terrain und Cartoon-Environment)

Stand 25.10.2026 abends · Autor WS0 (Steuerung) für Georg von Westphalen · Paket `PROCEDURAL_WORLD_PAKET_R2` (ersetzt R1, Register bis V-815)

## 1 · Deine Rolle und der Auftrag

Du bist Prüfer und Berater für prozedurale Cartoon-Umgebungen. Du recherchierst, kritisierst und optimierst unser Konzept für eine prozedural erzeugte, endlose 3D-Spielwelt im Cartoon-Knet-Look. Teil 2 ist die konsolidierte Fassung (SSOT), Teil 3 enthält die Kanon-Quellen im Wortlaut, Teil 4 Regeln und Code.

**Was wir von dir wollen:**

1. **Recherche:** Wie lösen gute Vorbilder das? Gemeint sind Spiele, Werkzeuge, Papers und GDC-Vorträge mit prozeduraler Platzierung in stilisierten Welten. Beispiele: Townscaper, Tiny Glade, Islanders, Dorfromantik, A Short Hike, Zelda: Breath of the Wild und Tears of the Kingdom, Horizon Zero Dawn (GPU-Placement, GDC 2017), Ghost of Tsushima (Wind und Gras), Houdini-Scatter-Workflows, Wave Function Collapse (Gumin, Oskar Stålberg), Poisson-Disc, Ökosystem-Simulation.
   - Liefere konkrete Techniken mit Quelle.
   - Trenne klar: QUELLE (belegt) und INFERENZ (deine Übertragung).
2. **Kritik:** Wo ist das Modell falsch, widersprüchlich oder unvollständig? Und warum scheitern unsere Bilder trotz bestandener Gates (§4 und §5)?
3. **Optimierung:** Ein umsetzbares Zielmodell für die Platzierung, als Ebenen bzw. Pipeline mit Pseudocode und Zahlen. Es soll in einem Browser-Spiel (three.js, WebGL2, Worker, 64-m-Zellen) und in einer Blender-Kette laufen.
4. **Antworten auf die offenen Fragen in §3**, jeweils mit Empfehlung.
5. **Neu in R2:** die Endlos-Welt-Architektur (Teil 2 §3b) und den Weg zur „Endlos-Welt komplett“ (Teil 2 §8, V-815) prüfen, dazu den Farbweg für gemalte Meshy-Bühnen (Teil 2 §5b).

**Form der Antwort:**
- Deutsch.
- Erst eine Kurzfassung mit höchstens 10 Punkten, dann die Details.
- Pseudocode statt Prosa, wo es um Verfahren geht.
- Zahlen mit Herkunft.
- Keine Lizenz- oder Rechtshinweise.

## 1b · Was sich seit R1 geändert hat

Alle Einträge vom 25.10.2026. Fahren, Audio und Figuren stehen nur als Kontext hier; das Paket bleibt bei Terrain und Environment.

**Welt und Terrain**
- **Fließbänder wieder Standard** (V-797): Kontaktsteinchen, Fußsteinchen und Moosfugen als Objekte sind gestrichen. Neues Modell nach Kays Video und den Pack-Samples: Materialzonen im Boden, Waldmassen mit Saum, Fels nur als Formation an Geländekanten. KayKit heißt Zonen, nicht Clutter.
- **Bewuchs-Modi:** Stilbild `veg=mass` (V-798, Zonenfeld, Waldmassen) und Stilbild 2 `veg=cartoon` nach Modell R3 (V-799). Beide nicht abgenommen. Code: `src/world/placeVeg.js` + `placeWorker.js`.
- **Biom-Paletten aus dem Generator** (V-800, schon in R1).
- **J17-Bänder und zweifarbige Props** (V-801, Georg PASS q222): Die sechs Fließbänder kommen aus dem Biom-Schema mit Gegenfarbe in der Erde. Krone = Laub, Laub dunkel oder Blüte; Stamm = Laub-Farbton −105° und dunkler. Die Instanzfarbe greift jetzt im Fragment (USE_COLOR).
- **Biom-Übergang über die Fließbänder** (V-802, Georg PASS q222): An der Biomgrenze wechselt jedes Band als Ganzes die Palette. Keine Sprenkel, keine Tropfen, kein Saum. Ersetzt fürs Gelände das Sprenkel-Modul (V-403).
- **Farb-Logik ausrollen** (V-803): dieselbe Biom-Palette für Props, Gebäude, Dioramen, Mindscapes, Billboards und VFX (Rauch, Partikel). Keine Fremdfarben.
- **Endlos-Welt gebaut** (`world=endless`, `src/world/endlessTerrain.js`): Quadtree um den Spieler, Kacheln 64–512 m, kein Randwall, sechs Biome. Heute noch hinter einem Schalter; Standard ist die Insel-Probe mit Nebelrand.
- **KFB-Karte als Gelände** (q226): Das Relief einer Karte wird als Plateau ins Höhenfeld gestempelt (`CARD_STAMP`), darauf liegen 65 536 Knetkugeln mit GPU-Physik (`src/world/cardRelief.js`). Auto und Figur stoßen sie weg. Heute genau eine Karte im Ring um den Start.

**Farben auf Meshy-Bühnen (gemalte Texturen)**
- **V-806:** Rollen-Codes im Vertex-Kanal COLOR_1 je Teil, Tönung erst sanft (Zug 0,18), dann 0,35, dann 0,8 mit Deckel ΔE00 ≤ 18. Kritiker-Runden 1–3 REWORK.
- **V-808:** Codes je zusammenhängender Fläche (35°-Regel), genau ein Fokus-Teil mit Akzentfarbe `pad`.
- **V-809 (Georg q230):** „Rolle voll“: Zug 1,0 auf Farbton und Sättigung, Helligkeit und gemalte Zeichnung bleiben. Braun-graue Teile (C* < 15) über `gradient_map` (Helligkeit → Rollen-Farbton). Was sich nicht sauber einfärben lässt, bleibt vorerst aus dem Spiel.
- **V-812:** Codes je Bauteil aus Knickkanten (> 40°, Bauteil ≤ 15 % der Bühne, an Stein-IDs gerastet), Code aus der Geometrie, B9-Mehrheit nur als Rest.
- **V-814:** Kritiker-Runde 4 REWORK 22/22, Stopp-Regel. Neue Richtung als Probe auf drei Bühnen: Code je Bauteil nur aus Geometrie und Textur-Grundfarbe. Neun Bühnen gelten als nicht sauber einfärbbar.

**Plan**
- **Fahrplan verbindlich** (V-805): 1 Fahrphysik → 2 Gameplay-Critic → 3 Wasser in der endlosen Welt → 4 Amphitheater → 5 Karten-Gelände je Zone → 5b Endlos-Welt komplett → 6 Splat-Probe.
- **Stufe 5b „Endlos-Welt komplett“** (V-815): endlos als Standard, Wasser, Orte/Bühnen/Dioramen/Karten je Zone prozedural und reproduzierbar, Bewohner und Gedächtnis je Zelle, mitwandernder Weltursprung (gibt es noch nicht), Orientierung.

**Kontext (nicht Gegenstand der Prüfung)**
- Fahrphysik S1 erledigt (V-783): Landestoß, Festfahren, Kippen, Stand am Hang, Kameras, Fassrolle.
- Fahrgefühl-SFX eingebaut (V-807).
- Fahrzeug-Seele (V-810): KnuckleBob kommentiert selten in einer kleinen Vignette unten links.
- Mindscape-Klangbetten für Fahrt und Flug (V-811).

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

**Ergänzt in R2:**
- **J17-Logik für Gelände und Props (V-801):** Bänder mit Gegenfarbe in der Erde; Props zweifarbig (Krone aus der Laub-Leiter, Stamm Laub −105° und dunkler).
- **Biom-Übergang im Gelände nur über die Fließbänder (V-802):** Bänder wechseln als Ganzes. Keine Sprenkel, kein Saum, keine zweite Schicht.
- **Ein Farbsystem für alles im Bild, auch VFX (V-803).**
- **Meshy-Bühnen „Rolle voll“ (V-809):** Farbton und Sättigung aus der Rolle, Helligkeit und gemalte Zeichnung bleiben. Was sich nicht sauber einfärben lässt, kommt vorerst nicht ins Spiel.
- **Die Welt endet nie (V-815):** kein Rand, kein Nebelwall; alles je Zelle aus festem Seed reproduzierbar.
- **Keine Zahlen- oder Messfragen an Georg (V-804):** Er wählt zwischen Bildern.

## 3 · Offene Fragen (bitte jeweils mit Empfehlung)

**Stand der Fragen aus R1:** Keine der zehn Fragen ist beantwortet; alle bleiben offen. Erledigt sind seit R1 nur Punkte aus §4 und §5, die keine Antwort mehr brauchen:
- ~~Rollenfarben greifen an Props technisch nicht~~ **erledigt (V-801):** Batch-Instanzfarbe über USE_COLOR im Fragment, Georg PASS q222.
- ~~Paletten fast monochrom~~ **erledigt (V-801):** Gegenfarbe in der Erde, sechs Bänder aus dem ganzen Schema.
- ~~Biom-Übergang im Gelände (Sprenkel kleinteilig)~~ **erledigt (V-802):** Übergang Band für Band.

1. **Ebenenmodell:** Wie leiten wir Lozzis „Ebenen“ aus einem endlosen Höhenfeld ab: Bank, Hügel, Grat, Ferne? Damit Bewuchs an Ebenenkanten sitzt und nicht verstreut. Grat-/Kantenerkennung, Krümmung, Sichtbarkeit aus der Spielkamera? Welche Maße funktionieren in Echtzeit? *Stand R2: offen. Im aktuellen Bild (refs, `aktuell_endlos_gelaende_…`) stehen die Bäume weiter gleichmäßig auf der Wiese.*
2. **Ursachenfelder:** Wie sieht eine robuste, billige Feldkette für die Ortsbiografie aus, und in welcher Reihenfolge? Gemeint sind Hangbruch, Mulde, Feuchte, Weg, Schatten, Wind. Mit welchen Schwellen bzw. Stufenfunktionen bekommt man Cartoon-Zonen mit klaren Kanten statt Rauschen? *Stand R2: offen; Feuchte hängt jetzt an Frage 14 (Wasser).*
3. **WFC oder Regeln:** Wo bringt Wave Function Collapse echten Nutzen, und wo reichen Poisson-Disc, Eltern-Kind-Streuung und Stamps? Heute nutzt WFC nur die Slot-Belegung einer Gruppe (`solveLocal`). Lohnt sich WFC für Zonen- oder Kachel-Nachbarschaften (Ufer, Wegkanten, Waldrand)? *Stand R2: offen.*
4. **Materialcode in 3D-Knete:** Wie übersetzt man Herriman- und Noble-Codes in 3D? Gemeint sind Fels mit Streifen/Schichtlinien, Mesa mit Punkten, Rinde mit Tupfen. Shader (triplanar, Detail-Normal), Geometrie oder Decals? Was ist mit Kit-Assets, deren Geometrie wir nicht ändern dürfen? *Stand R2: offen. Der Farbteil ist gelöst (V-801: Krone/Stamm aus der Palette), das Zeichen je Material nicht.*
5. **Varianz ohne Chaos:** Wie mischen wir fünf Asset-Familien (KayKit, Tiny Treats, Quaternius ×2, Kenney) mit unterschiedlicher Formensprache und Skala? Kandidaten: Familien je Ort, Form-DNA-Klassen, Skalen-Normierung, Rolle je Asset. *Stand R2: offen, Register noch nicht gebaut.*
6. **Maßstab:** Bäume sind 1/20 bis 1/30 der Hügelhöhe; die Kritiker monieren das. Relief senken, Assets skalieren oder Kamera und Brennweite ändern? Und wie bleibt das Fahrgefühl erhalten? *Stand R2: offen. Die Kameras sind seit V-783 neu (träger nachziehend, zweite Kamera von oben).*
7. **Ferne:** Bewuchs steht nur auf den nahen 64-m-Kacheln, deshalb endet der Wald hart. Welche Technik passt für Silhouetten und Impostor in der Ferne im Cartoon-Look? *Stand R2: offen, im Code unverändert (placeVeg zeigt nur Stufe 0).*
8. **Abnahme:** Welche automatisch messbaren Proxys korrelieren tatsächlich mit „sieht aus wie KayKit / Noble / Lozzi“? Unsere Gates messen Gruppenregeln, und die Bilder fallen trotzdem durch. *Stand R2: offen und verschärft. Bei den Meshy-Farben war das Gate 19/19 grün, der Kritiker sagte 22/22 REWORK (§5).*
9. **Gras:** Gras ist Material. Wie sieht ein Cartoon-Grasansatz aus, der nicht „Streu“ ist? Kandidaten: Bodenzeichen im Shader, Büschel nur an Kanten und Füßen, Fell-/Shell-Gras, Karten. *Stand R2: offen.*
10. **Fluff (Spiel-Sammelobjekt, orange Kugelnester):** Wie viel davon und wo, ohne dass es den Look dominiert? *Stand R2: offen; jetzt Teil von Frage 12 (Fluff je Zelle mit festem Seed).*

**Neu in R2:**

11. **Orte je Zone im endlosen Raster:** Wie verteilen wir Orte, Bühnen, Dioramen und Karten prozedural und reproduzierbar je Zone, ohne globale Vorberechnung?
    - Heute: ein Amphitheater fest im Ursprung, genau eine Karte auf der ruhigsten Fläche im Ring 70–260 m um den Start (`cardSites`).
    - Gesucht: Raster-Hierarchie (Region → Zone → Zelle), Seed je Ebene, Mindestabstände, Ortsbezug (Bühne passt zu Biom und Gelände), Vorrang bei Konflikten.
    - Stempel ändern die Höhe (Karte: nur auftragen, Saum 7 m). Wie bleibt die Reihenfolge Höhe → Stempel → Bewuchs deterministisch, wenn Kacheln in beliebiger Reihenfolge gestreamt werden?
    - Wie halten wir Freiflächen (heute `KEEPOUT`-Rechtecke) und Zufahrten frei?
12. **Bewohner und Zustand je Zelle:** Wie erzeugen wir Bewohner, Fluffer, Obstgärten und Fluff je Zelle mit festem Seed, und wie speichern wir, was der Spieler verändert hat (eingesammelt, gesprengt, erledigt)?
    - Format: Delta gegen den Seed? Granularität (64-m-Zelle, Zone)? Speichergröße, Lade- und Entladezeitpunkt?
    - Was passiert mit Bewohnern, die Zellgrenzen überschreiten oder in entladene Zellen laufen?
13. **Mitwandernder Weltursprung (three.js + Rapier):** Wie verschieben wir den Ursprung ohne sichtbaren Sprung, Physik-Ruck oder Musterwechsel?
    - Betroffen: Rapier-Körper und Trimesh-Kollider, Kamera, Schatten-Kaskade, GPU-Partikel (Karten-Kugeln), Instanz-Matrizen im BatchedMesh.
    - Heikel: Unsere Shader rechnen mit Weltkoordinaten (Fließbänder `vT3W.xz`, Wind-Versatz, Zonenfeld im GLSL, Sprenkel). Wie bleiben die Muster bei großen Koordinaten stabil (Float32), z. B. mit geteiltem Versatz-Uniform?
    - Ab welcher Entfernung ist es nötig, mit welcher Schwelle und welchem Ablauf?
14. **Wasser und Flüsse im endlosen Höhenfeld:** Heute rechnet das Endlos-Gelände ohne Wasser (Probe-Rezept mit `waterLevel: 0`). Für die endliche Insel gibt es Seen und Ufer (`kfbWater`) und Flüsse (`kfb-hydro`).
    - Wie entstehen Flüsse und Seen lokal und deterministisch, ohne globale Abfluss-Simulation (z. B. Flussnetz aus einem groben Raster, Einschneiden ins Höhenfeld, Seen in Mulden)?
    - Wie fließen Ufer in die Fließbänder ein, und wie passt das zu V-750 (Fluid-Arten Wasser, Kaugummi, Säure je Biom aus derselben Palette)?
    - Wie bleiben Flüsse an Kachel- und Biomgrenzen stetig?
15. **Gemalte Meshy-Bühnen in Biom-Farben, ohne heuristische Texturflecken-Codes:** Stand V-812/V-814 (§5).
    - Vier Kritiker-Runden ohne PASS. Die Codes kamen aus einer Heuristik über Texturflecken (B9); Bauteile aus Knickkanten halfen nur teilweise.
    - Jetzt in Probe: Code je Bauteil nur aus Geometrie und Textur-Grundfarbe. Dunkle Texturen bleiben auch mit vollem Farbton dunkel (Gefängnis, Dystopie-Gasse).
    - Gesucht: erprobte Verfahren zur Segmentierung (Mesh-Segmentierung, Segmentierung aus gerenderten Ansichten mit Rückprojektion), zum Umfärben (palettenbasiert, helligkeitserhaltend, Verlaufs-Abbildung) und zum Umgang mit dunklen Vorlagen. Und ein Abnahme-Proxy, der mit dem Kritiker übereinstimmt.
16. **Bewuchs je Biom und am Biomrand:** Der Bewuchs liest die Palette am Zellmittelpunkt; der Worker rechnet für alle Biome mit dem Regelsatz `moos`. Wie wechseln Arten, Dichte und Formensprache an Biomgrenzen, passend zum Band-Übergang im Gelände (V-802)?
17. **Orientierung in einer endlosen Welt:** Kompass, Minikarte, POI-Hinweise. Was trägt in einer Welt ohne Rand, und was davon kann die Welt selbst leisten (Landmarken, Sichtachsen, Fernsilhouetten) statt das HUD?

## 4 · Wiederkehrende Probleme

- **Mikro-Grammatik statt Bild:** Wir haben stundenlang Regeln auf Gruppenebene poliert (Anker, Stützen, Kiesel, Kontaktsteinchen, Fußgras, Moosfugen, Hüllen-Tabellen, Kontaktfenster). Das Gate wurde grün, der Kritiker sagte REWORK, Georg sagte FAIL. Das Bild war „gebastelt“.
- **Falsches Vorbild-Verständnis:** Die KayKit-Videos und -Beispielbilder waren nie angesehen worden; in den alten Notizen steht „0 Videobilder gesehen“. Kritiker-Vorschläge haben Georgs Konzept überschrieben: Fließbänder gedämpft, Palette verflacht.
- **Rauschen als Verteilung:** Haine bzw. Waldmassen aus einem Rauschfeld gibt es ohne Ursache. Gleichmäßige Streuung ergibt „Konfetti“.
- **Maßstab:** Props sind zu klein gegen das Relief der Fahrwelt.
- **Eigenbau statt Vorlage:** Ohr-Nachbildungen, eigene Maße und Glättungen, obwohl Originale vorliegen (FrizzleBob-Fall, gleiches Muster).
- **Biom-Paletten:** Lange liefen sie über einen Nebengenerator mit gedämpften Bändern (Kontrast −40 %, Sättigung −35 %, Kritiker-Folge). Das Terrain wirkte wie realistische Erde und Grasland statt Cartoon-Palette. Seit V-800 ist das behoben.
- **Technik-Fehler in Serie:**
  - Kit-Farben überschreiben die Rollenfarben: Der Knet-Shader-Pull zieht die Palette zurück, die Batch-Farbtextur fehlt im Programm. *(Seit V-801 behoben.)*
  - Vertex-Farben verloren (schwarze Steine).
  - Zufällige Ladereihenfolge: weißes Laub.
- **Prozess:** Viele kleine Iterationen mit dem Blender-Team gegen das Gate statt eines Bildes für Georg. Die Stopp-Regel griff erst nach drei Kritiker-Runden.

**Neu seit R1:**
- **Heuristik als Grundlage, dann Feinschliff daran:** Bei den Meshy-Farben kamen die Rollen-Codes aus einer Heuristik über Texturflecken (B9). Drei Runden wurde am Zug, am Deckel und an Flächen-Regeln gedreht. Der Fehler lag in den Codes selbst (V-814: „Der Hebel liegt in den heuristischen B9-Codes, nicht im Zug“).
- **Zwei Ziele, die sich widersprechen:** „sanft tönen“ (V-286, Deckel ΔE00 ≤ 18) und „Rolle erkennbar“ (Kritiker K2) gehen auf gemalten Texturen nicht zusammen. Das wurde erst nach Runde 3 erkannt und Georg zur Wahl gegeben (V-808/V-809).
- **Helligkeit bleibt, also bleiben dunkle Vorlagen dunkel:** Volle Tönung von Farbton und Sättigung reicht bei dunklen Texturen nicht. Ergebnis: neun von 22 Bühnen nicht sauber einfärbbar.
- **Gate grün, Kritiker REWORK, wieder:** Runde 4 Gate 19/19 grün, Kritiker 22/22 REWORK.
- **Neues hinter Schaltern:** `world=endless`, `veg=cartoon` und die Karte sind im Code nur per Hash-Schalter aktiv. Ohne Schalter laufen die Insel-Probe und der alte Rasterbewuchs. Stilbilder und Standard laufen auseinander.

## 5 · Fails im Verlauf (Kurzchronik)

- **Endlose Welt, Kritiker R1:** 3,1 REWORK. Konfetti statt Haine, Maßstab, Marmor-Boden, schwarze Steine.
- **R2:** 3,9 REWORK, nach Bodenberuhigung, Haine und Palette. Georg danach FAIL (q210): „Terrain undeutlicher, Farbbänder fast weg, Verteilungsmuster falsch, keine natürlichen Verteilungsmuster.“
- **Blender-Szene P0** („Lichtung am Waldrand“), Gate grün, Kritiker 5,2 / 4,6 / 5,7 REWORK. Stopp nach drei Runden. Georg FAIL (q211): „schlampig gebastelt, unzählige kleine Steine → Materialcodes, kein Clutter; falsche mentale Modelle; sieht nicht aus wie die KayKit-Promobilder.“
- **Stilbild „Waldmassen“** nach KayKit-Analyse (Zonenfeld, dichte Masse, Waldboden-Zone): schöne Waldflächen, aber laut Georg „die cartoonige Verteilungslogik und Materialcodes nicht verstanden“.
- **Stilbild 2** nach Modell R3 (Grate mit Baumreihen, Formationen an Hangbrüchen, Solitäre mit Ablegern): Auf der Wiese stehen wieder zu viele gleichmäßig verteilte Bäume. Die Rollenfarben greifen technisch noch nicht. Nicht abgenommen.

**Neu seit R1 · Welt**
- **Paletten und Props** (q219/q220 TUNE → V-801): Paletten waren fast monochrom, Props nicht eingefärbt. Nach J17-Bändern und zweifarbigen Props Georg PASS (q222).
- **Biom-Übergang** (q220 → V-802): Sprenkel wirkten kleinteilig und unruhig, „eher eine alte Übergangslogik“. Übergang über die Bänder: PASS (q222).
- **Aktuelles Endlos-Gelände** (refs `aktuell_endlos_…`): Farben und Bänder tragen; die Verteilung des Bewuchses ist weiter gleichmäßig und nicht abgenommen (Frage 1).

**Neu seit R1 · Farbrunden auf Meshy-Bühnen** (Blender-Kette, blinder Kritiker nur K2 Farbe, PASS ab 8)
- **Runde 1** (V-803, sanft, Zug 0,18): REWORK 21/21, bestes 7, 16 Bühnen unter 6. Tönung nicht ablesbar, kein Akzent am Fokus, Mauern in Fels- bzw. Turm-Rolle, Bewuchs bleibt grün.
- **Runde 2** (V-806: Zug 0,8, Kit 0,5, Deckel ΔE00 ≤ 18): REWORK 23/24, nur Atlantis PASS (8). Meist 6,5–7.
- **Runde 3** (Wand-Regel auch für Türme, Kit 0,85 mit Deckel, Fokus zieht Helligkeit): REWORK 23/24, Mittel 5,5, kein Gewinn. Befund: Codes folgen Texturflecken; „sanft“ und „erkennbar“ widersprechen sich. Giza zurück aufs Konzeptblatt.
- **Zwischenschritte ohne Kritiker:**
  - V-808 Flächen-Codes (35°): Bild kaum verändert, gekrümmte Flächen zerfallen in Tausende Stücke.
  - V-809 Georg wählt „Rolle voll“ plus `gradient_map` für braun-graue Teile (Probe Theater klar in der Palette, Gefängnis violett, aber dunkel).
  - V-812 Bauteile aus Knickkanten (Probe Theater, Mesa deutlich ruhiger).
- **Runde 4** (V-812 gebaut, 19 Meshy-Bühnen + 3 Kit-Dioramen): Gate 19/19 grün, Kritiker **REWORK 22/22**, K2 4,5–7, Mittel 5,8. Querbefunde: Einzelsteine in zweiter Rolle, Dreiecks-Facetten, Teilnaht mitten auf Flächen, dunkle Texturen nur als Farbstich, Fels-Rolle auf Grau wird oliv-grau, Akzent am falschen Ort.
- **Stopp-Regel** (V-814): zweite Reparatur ohne Gewinn, kein weiterer Dreh am B9-Weg. Probe der neuen Richtung auf Theater, Utopia Stage, Nature Island; Gewinn, wenn das K2-Mittel der drei über 6,7 liegt. Nicht sauber einfärbbar und vorerst nicht im Spiel: Akasha-Bibliothek, Comic-Sender, Dystopie-Gasse, Goblin-Bank, Kayfabrick-Baustelle, Abenteuer-Lager, Retro-Spielhalle, UFO-Cockpit. Das Gefängnis darf dunkel-violett ins Spiel (q232).

## 6 · Bewertungsmaßstab für deine Vorschläge

- Muss in einem Browser-Spiel laufen: Worker, ≤ 8 ms je Frame-Scheibe, ≤ 15k Instanzen, BatchedMesh.
- Muss als Regel-Datei (JSON) plus Löser (JS-Modul) für Spiel und Blender gleich laufen. Eine Wahrheit, zwei Laufzeiten.
- Muss Georgs Abnahme im Bild bestehen, nicht nur Messwerte.
- Weniger ist mehr: Eine starke Szene ist besser als ein Katalog.
- **Neu:** Muss in der endlosen Welt laufen: nur aus Seed und Zellkoordinate, ohne globale Vorberechnung, zeitgeteilt im Streaming (Gelände heute 2,5 ms je Bild, Bewuchs 1,5 ms).
- **Neu:** Muss mit einem mitwandernden Weltursprung verträglich sein (keine Annahme fester Weltkoordinaten in Daten und Shadern).

## 7 · Bilder und Referenzen im Paket

`refs/` (aus R1):
- `kaykit_hexagon_sample1.jpg`, `kaykit_modell_tafel.jpg`: KayKit-Beispielbilder (Hexagon, Builder);
- `kay_godot_szene.jpg`: Kays Godot-Szene (Video Vfr3n4WKsc0);
- `cartoon_tafel_herriman_noble_lozzi.jpg`: Cartoon-Tafel (Herriman, Noble, Lozzi);
- `fail_welt_vergleich_luft.jpg`, `fail_welt_vergleich_auge.jpg`: endlose Welt A/B/C;
- `fail_stilbild_waldmassen_luft.jpg`, `fail_stilbild_waldmassen_rand.jpg`: Stilbild Waldmassen;
- `fail_stilbild2_cartoon_luft.jpg`, `fail_stilbild2_cartoon_auge.jpg`: Stilbild 2 (Modell R3);
- `fail_p0_blender_r28_tafel.jpg`: P0-Tafel r28.

`refs/` (neu in R2, Präfix `aktuell_`):
- `aktuell_endlos_gelaende_fahrt_mit_vignetten_entwurf.jpg`: aktuelles Endlos-Gelände aus der Fahrt (J17-Bänder, zweifarbige Bäume, Biom-Paletten). Die runde Vignette unten links ist ein Entwurf für die Fahrzeug-Seele (V-810) und nicht Gegenstand der Prüfung. Gut sichtbar: Bäume gleichmäßig über die Wiese verteilt.
- `aktuell_endlos_hero_run_standbilder.jpg`: Standbild-Blatt des Hero-Run-Teasers aus dem Spiel (Luftbild, Tiefflug, Sprung, Parade); zeigt Bänder, Biom-Paletten und Bewuchs aus verschiedenen Höhen.
- `aktuell_meshy_buehnen_runde3_gegen_rolle_voll.jpg`: Entscheidungsblatt nach Runde 3 (Theater, Gefängnis, Giza): vorher · Runde 3 · „Rolle voll“.
- `aktuell_meshy_buehnen_rolle_voll_probe_v809.jpg`: Probe V-809 (Theater, Gefängnis), vorher/nachher in Canyon, Übersicht und Augenhöhe.
- `aktuell_meshy_buehnen_bauteile_probe_theater_mesa.jpg`: Probe Bauteile aus Knickkanten (Theater, Mesa), Grundlage für V-812.
