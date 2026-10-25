# KFB prozedurale Welt · Prüfpaket R2 (Briefing + SSOT + Kanon-Quellen)

Aufbau: Teil 1 Briefing · Teil 2 konsolidierte SSOT · Teil 3 Kanon-Quellen im Wortlaut · Teil 4 Regeln (JSON) und Löser (JS). Bilder liegen getrennt im Ordner refs/.


---

# TEIL 1

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


---

# TEIL 2

# KFB prozedurale Welt · konsolidierte SSOT R2 (Terrain, Cartoon-Environment, Platzierung/WFC, Endlos-Welt)

Stand 25.10.2026 abends, Register bis V-815, Spiel-Code `game/proc-world-ws0` @39a88fa. Diese Fassung fasst zusammen, was gilt und was gebaut ist. Bei Widerspruch gelten die Kanon-Quellen im Wortlaut (Teil 3) und Georgs Entscheidungen (V-Nummern). Neu gegenüber R1: §1 (Zeilen ab V-801), §3 (Bänder, Übergang), §3b, §4 (Stand), §5, §5b, §5c, §7, §8.

## 0 · Projekt in einem Absatz

KFB (Kayfabizarro) ist ein Browser-Spiel mit Fahren, Laufen, Fluff sammeln und Kampf, in einem Cartoon-Knet-Look („Claymation“).
- **Laufzeit:** three.js r186 und WebGL2, React; die Spielwelt ist eine endlose Fahrwelt aus 64-m-Zellen mit sechs Biomen.
  - *Stand R2:* Die endlose Welt läuft über den Schalter `world=endless`. Standard ist noch die Insel-Probe mit Nebelrand. Endlos als Standard ist geplant (V-815).
- **Assets:** Kit-Assets (KayKit, Quaternius, Tiny Treats, Kenney) und eigene Meshy-Modelle, alle mit einem Knet-Shader (`kfb-clay.v1.1`) überzogen.
- **Blender-Kette:** Parallel erzeugt eine Kette Abnahmebilder und Style-Frames aus demselben Löser-Rezept (`kfb_place_bpy`, Gate `kfb_env.py`, Kritiker CRITIC_3D_R1).
- **Owner:** Georg (Art Direction, Abnahme im Bild). WS0 (Steuerung, Kanon, Löser; baut die prozedurale Welt im Spiel selbst, V-746). WS1 (Spiel-Laufzeit, Shader). WSB (Blender). WSA (Mindscapes, Billboards).

## 1 · Bindende Entscheidungen (Auszug, V-Nummern im Register)

| Thema | Regel | Quelle |
|---|---|---|
| Gesamtlook | Joyride J17 ist Goldstandard (Strecke, Banden, Deformer, Kamera, Paletten) | V-010, V-102 |
| Paletten | Insel-/Biomthemen aus den Joyride-Paletten (canyon, bucht, otown und Ableitungen) mit Rollen für alle Teile. OKLCH-Harmonie-Regel: Boden trägt den Grundton, Blickfang gegenüber, Laub natürlich bzw. herbstlich. Prozedurale Biom-Platten (paletteGen) nur innerhalb dieser Harmonie | V-051, V-270, V-305, V-619 |
| Biom-Paletten | Je Biom eine zufällige, harmonische Palette aus dem V-305-Generator mit sechs Leitfarben (Boden, Strang, Wahrzeichen, Laub, Himmel, Rinde) plus Leitern, Anmutung wie die drei Golden Samples. Die Farben gelten für alles (Terrain, Fluids, Bewuchs, Steine, Gras, Gebäude, OSM, Dioramen, Mindscapes, Billboards), auch surreal (R8). Keine Dämpfung (calm 0) | V-800 |
| Farbfreiheit | Jede Farbe ist erlaubt, auch surreal (lila Gras), wenn der Materialcode die Logik trägt. Einzige Grenze: Chroma ≤ 0,195 | V-565 |
| Terrain-Malerei | terrain3-Fließfarben (organische Bänder, Domain Warping, lose an der Höhe) sind das Konzept und bleiben. Nicht dämpfen, nicht verflachen (Georg 25.10. nach Rücknahme). Terrain-Look-Stack: Form → 4 gebrochene Farbflächen als runde Blobs (nie Schwellwert-fbm) → Kantenakzente nur an Formbrüchen → Vordergrund-Tonmasse → echte Schatten | #439, V-570, V-797 |
| Übergänge | Zwischen Biomen bzw. Zonen nur Sprenkel in beide Richtungen. Nie Verlauf, Linie oder Alpha. **Für das Gelände ersetzt durch V-802** (Zeile „Biom-Übergang Gelände“) | V-403, V-011 |
| Ortsbiografie | Jede Szene erzählt Entstehen → Nutzen → Vergehen → Bewachsen. Verteilung von der Quelle weg. Größe wächst mit Zeit und Abstand: Moos in Fugen, Gras 0–2 m, Büsche 2–6 m, Bäume ab 6 m, rahmend | KONZEPT_ORTSBIOGRAFIE §2, V-341 |
| Materialcodes | Ein Materialcode je Schicht und Ort (z. B. Kalkstein + Moos + Lianenholz). Alles Dazugestellte trägt einen dieser Codes und eine Rolle (Boden, Stein, Rinde, Laub/Gras, Fluff) in den Rollentönen der Palette | KONZEPT_ORTSBIOGRAFIE §3, V-565 |
| Komposition | 70/20/10 (Ruhe/Struktur/Bedeutung); ungerade Gruppen; 1 : 0,6 : 0,35 : 0,15; Abstände ≥ 30 % verschieden; ≤ 2 auf einer Geraden; Konturen ≥ 15 % überlappt oder ≥ 25 % Luft; Negativraum ≥ 30 %; Landmarke am höchsten; ein Kit je Gruppe | ETHERINGTON_REGELN, V-566 |
| Erdung | Eingraben (Einsinken je Art), Kontakt (echter Schatten plus Kontaktton 8–12 L* unter dem Wurfschatten, auf der Lichtseite die halbe Stufe), Überlappen mit Ursache. Seit 25.10.: keine Kontaktsteinchen, Fußsteinchen oder Moosfugen als Objekte (Clutter); Kontakt ist Materialcode | V-565, V-570, V-797 |
| Licht | Ein Rig, ein Tonweg, eine Materialantwort. Keine privaten Lichter, keine Blob-Schatten | V-385, V-392, LIGHT_MODEL_R2 |
| Assets | Kit-Teile wie geliefert, nur gleichmäßig skaliert. Erst vorhandene Quellen bzw. Werkzeuge („use what works“), dann Eigenbau | V-574, V-506 |
| Abnahme | Visual first: Georg nimmt Bilder ab. Das Gate ist Untergrenze, nicht Beweis | V-561, V-740 |
| Benchmark | KayKit-Promos und Kays eigene Szenen; Cartoon-Hintergrundkunst (Herriman, Noble, Lozzi, Watterson) | V-797, V-799 (q217) |
| Varianz | Alle passenden Nature-/Environment-Assets (KayKit, Tiny Treats, Quaternius, Kenney) stehen für WFC bzw. Platzierung zur Verfügung | Georg 25.10. |
| **Neu in R2** | | |
| Bewuchs-Modell R2 | Materialzonen im Boden, Waldmassen mit Saum (eine Baumfamilie je Masse), Wiese fast leer, Fels nur als Formation bei Hang > 0,5; kein Kies, kein Kontakt, kein Streugras. KayKit = Zonen, nicht Clutter | V-797, V-798 |
| Gelände nach J17 | Sechs Fließbänder aus dem Biom-Schema mit Gegenfarbe in der Erde (wie die Inselseiten der Golden Samples; Canyon: Lila, Orange, Creme). Georg PASS q222 | V-801 |
| Props zweifarbig | Krone = Laub, Laub dunkel oder Blüte (leaf[0..2]); Stamm = Laub-Farbton −105° und dunkler (J17-Regel). Instanzfarbe über USE_COLOR ins Fragment | V-801 |
| Biom-Übergang Gelände | An der Biomgrenze wechselt jedes Band als Ganzes die Palette, je näher am Nachbarbiom desto mehr Bänder. Keine Sprenkel, keine Tropfen, kein dunkler Saum, keine zweite Schicht. Sprenkel nur noch zum Vergleich (`biot=speckle`). Georg PASS q222 | V-802 |
| Farb-Logik ausrollen | Dieselbe Biom-Palette färbt Props (Krone, Stamm), Gebäude, Dioramen, Mindscapes, Billboards, passend und surreal. VFX (Rauch, Partikel) nehmen die Gelände-, Fluid- und Prop-Farben des Ortes, keine Fremdfarben | V-803 |
| Fluids | Wasser, Kaugummi, Säure folgen derselben Farbharmonie; ein Fluid-Shader mit Art als Parameter; Rezepte je Biom in kfb_place | V-750 |
| Meshy-Bühnen | Rollen-Code je Bauteil im Kanal COLOR_1; Rollen-Teile „voll“ (Zug 1,0 auf Farbton und Sättigung, Helligkeit und Zeichnung bleiben); braun-graue Teile (C* < 15) über `gradient_map`; genau ein Fokus-Teil mit `pad`; nicht sauber Einfärbbares bleibt vorerst aus dem Spiel. Details §5b | V-806, V-808, V-809, V-812, V-814 |
| Abnahme durch Georg | Nur Bild-Auswahl, keine Höhen-, Zahlen- oder Messfragen | V-804 |
| Fahrplan | Fahrphysik → Gameplay-Critic → Wasser → Amphitheater → Karten-Gelände → Endlos-Welt komplett → Splat-Probe; jede Stufe endet mit Bildern bzw. Video | V-805, V-815 |

## 2 · Das Modell (R3, freigegeben 25.10., q217)

Aus Kanon plus Bildstudie (Herriman, Noble, Lozzi, KayKit):

1. **Ebenen statt Streuung.**
   - Wenige Bodenebenen: Vordergrund-Bank, Hügel im Mittelgrund, Grat/Berge, Himmel.
   - Jede Ebene hat eine Rollenfarbe und eine flache Schattenform.
   - Dinge sitzen an den Kanten der Ebenen (Bankkante, Grat, Ufer, Wegrand). Das Flächeninnere bleibt ruhig, mit sparsamem Bodenzeichen.
2. **Materialcode = festes Zeichen je Material, überall gleich.**
   - Fels: Facetten in 2–3 Tönen plus Schichtlinien (Noble); Spitzen tragen Streifen, Mesas Punkte (Herriman).
   - Rinde: Tupfen. Busch: dunkle Masse mit Kritzel. Boden: Punkte oder Striche.
   - Gras: Büschel-Zeichen nur am Fuß von Dingen.
   - In Knete: Formsprache plus drei Rollentöne.
3. **Wenig und groß.**
   - Je Blick 1 Hauptformation, 1–2 Nebenformationen, 0–3 Kleinteile.
   - ≥ 50 % Ruhe, Größensprünge ~1 : 0,4 : 0,1.
4. **Verfall hat einen Ort.** Bruchstücke nur am Fuß der Formation, hangab, 1–3, nach außen kleiner und seltener (Dichte ~e^(−λd)).
5. **Bewuchs ist Zeichen, nicht Masse.**
   - Vorn: Solitäre oder Dreiergruppen mit Größenfolge. Ein Haupt-Asset erhöht die Wahrscheinlichkeit kleiner Ableger um sich (Eltern-Kind).
   - Ferne: Silhouettenreihen auf Graten.
6. **Signatur-Motiv:** 1 Hero plus 2 Echos je Zone.
7. **Farbe trägt die Ebenen.** Komplementär-Spannung zwischen Formation und Grund; vorn warm und satt, hinten kühl und blass. Alle Töne aus den Joyride-Rollen.
8. **Surreal bleibt lesbar.** Horizont, Weg und Anker bleiben fest, Formationen und Palette wechseln.

Georgs Technik-Hinweise (q217):
- Rauschen durch Stufenfunktionen (smoothstep bzw. floor) für klare Zonen.
- Poisson-Disc für Mindestabstände (kein Clipping).
- Kompaktierung: Ein Haupt-Asset erhöht die Spawn-Wahrscheinlichkeit kleiner Ableger in den Nachbarradien.

*Stand R2:* Modell gilt unverändert. Im Spiel umgesetzt als Stilbild `veg=cartoon`, nicht abgenommen (Wiese zu gleichmäßig gefüllt).

## 3 · Terrain (gebaut, Spiel)

- **Höhenfeld:** `createEndlessHeight` (Sinus-/Rausch-Komposition je Biom, breite Höhengewichte gegen Stufen).
- **Netz:** Quadtree-Blätter (64 m fein, gröber in der Ferne), zeitgeteilt gebaut, Nähte genäht.
- **Biome:** sechs (moos, mesa, wueste, schnee, pastell, canyon).
  - Voronoi-Regionen mit verbogenen Rändern.
  - Je Punkt sechs Gewichte.
  - Übergänge über das Sprenkel-Modul (`kfb-speckle-transition.v1`). **Seit V-802 im Gelände über die Fließbänder** (Band für Band); Sprenkel nur mit `biot=speckle`.
- **Shader:**
  - `kfb-clay` (Knete) + terrain3 (Fließbänder: Domain Warping, 6 Bandrollen aus der Biom-Palette) + biomeTerrain (zwei stärkste Biome, Sprenkel-Auswahl, Palettenschatten V-564).
  - Kontaktton (contactDepthTint) ist im Terrain-Shader noch offen (WS1). WSB hat für Blender Werte je Material gemessen.
- **Maßstab:**
  - Hügel 10–40 m, Fahrgefühl mit Sprüngen.
  - KayKit-Bäume 3–6 m, Figur FrizzleBob 1,81 m.
  - Kritiker: Bäume 1/20–1/30 der Hügelhöhe. Offen, Georgs Frage q210.

**Farben im Gelände (Stand Code, `src/look/biomeTerrain.js`, V-800 bis V-802):**
- Biom-Paletten: `harmonyPalettes(seed)` aus `kfb-cartoon-palette.js` (`fromHue`). Boden-Farbtöne aus den Familien der Golden Samples und ihren Nachbarn: 299° (Canyon), 182° (O-Town), 88° (Bucht), 240°, 330°, 150°. Je Welt-Seed gemischt, ohne Wiederholung, je Biom ±10°.
- Bandrollen heute (@85c3bc1, „Bänder zeigen das ganze Schema“): `low` = Boden (`top`), `mid` = Hügel (`hill[1]`), `high` = Wahrzeichen (`tower[0]`), `peak` = Sand, `sand` = Erde (`under[1]`), Band 6 = Laub (`leaf[1]`); Schatten aus `cliff` (`under[3]`). Hinweis: Der Wortlaut von V-801 nennt noch Boden hell, Hügel dunkel, Hügel-Mitte, Erde 1, Sand; der Code ist danach weitergegangen.
- Prop-Rollen: Laub `leaf[1]`, Laub dunkel `leaf[0]`, Blüte `leaf[2]`, Stamm `trunk`, Stein `rock`, Gras `leaf[0]`.
- Übergang je Bildpunkt: zwei stärkste Biome (feste Reihenfolge), Anteil `wB` des zweiten; Auswahl `clamp(wB·1,3 − 0,15 + 0,12·snoise(xz/47), 0, 1)`; je Band harte Wahl (`step`) statt Verlauf. Dadurch kippen die Bänder einzeln.
- Die Bänder treiben mit dem geteilten Wind (Versatz, keine Scherung).
- Vergleichsschalter: `biot=speckle` (alter Sprenkel-Übergang), `ground=tone` (Ruhefläche aus V-788, zurückgenommen), `pal=gen`, `pal=island`, `palgen=0`, `palseed=<Zahl>`.

## 3b · Endlos-Welt-Architektur (Stand Code, belegt aus Teil 4)

**Module und Schalter**
- `src/world/EndlessDrive.jsx` hängt das Endlos-Gelände in die Laufwelt, nur mit Hash `world=endless`.
- Bewuchs: `veg=core|mass|cartoon` → `placeVeg.js`; ohne Schalter der alte Rasterbewuchs `endlessVeg.js`.
- Karte: `cardRelief.js`, Standard an, aus mit `cards=0`.

**Höhe** (`createEndlessHeight`, ohne three, auch in Node-Tests)
- Form aus der Gelände-Probe (`probeHeight.js`, Rezept „Sanfte Hügel“) mit `waterLevel: 0`, also **ohne Wasser und Flüsse**.
- Platz-Anker im Ursprung: Das Amphitheater steht fest, der Platz bleibt auf Bodenhöhe.
- Je Biom ein Höhenfaktor (moos 1,0 · mesa 1,2 · wueste 0,7 · schnee 1,45 · pastell 0,85 · canyon 1,3). Er streckt nur den Abstand zur Platzhöhe, über ein breites Höhengewicht (220 m), damit keine Stufen entstehen.
- Danach die Stempel (Karten-Gelände, unten).

**Biom-Feld** (`biomeField.js`, Daten `kfb-biome-drive.r1.json`)
- Voronoi-Zellen 460 m, Mittelpunkt je Zelle gewürfelt.
- Ränder verbogen (Warp 70 m auf 320 m).
- Nachbarzellen möglichst verschiedene Biome.
- Übergangsbreite 30–80 m, je Grenzstelle anders.
- Start-Biom mesa im Radius 150–240 m um den Platz. Seed 20261021.

**Kacheln** (`createEndlessTerrain`, Konstanten `ENDLESS`)
- Quadtree aus 512-m-Wurzeln im Sichtradius 820 m. Eine Kachel wird geteilt, solange ihr Abstand zum Fokus unter 0,85 × Kachelgröße liegt.
- Blätter 64–512 m mit je 32 × 32 Zellen (2–16 m).
- Bau als Generator, gibt nach jeder Zeile ab; Zeitscheibe 2,5 ms je Bild; neue Planung nach 6 m Fokusweg.
- Ein neuer Kachelsatz erscheint erst, wenn alle seine Kacheln fertig sind (keine Löcher).
- Normalen aus dem Höhenfeld mit einer Randreihe Überstand.
- Nähte: Kanten und Ecken zu gröberen Nachbarn werden auf deren Kante gelegt (Höhe und Normale linear wie das grobe Dreieck); Neuschreiben nur bei geänderter Nachbar-Signatur.
- Je Eckpunkt sechs Biom-Gewichte als Attribute (`aBioA`, `aBioB`).
- Cache: über 420 Blätter werden die ältesten unsichtbaren freigegeben, bis 360 bleiben.
- Kollider: Rapier-Trimesh aus genau den gezeigten Dreiecken der 64-m-Kacheln im Umkreis 70 m. Als Diff (`add`/`remove`); neu, wenn eine Kante neu angelegt wurde.
- `surfaceAt` liefert die Höhe der gezeigten Dreiecke.
- Fokus = Wagen bzw. Figur (`setFocus`), sonst die Kamera.
- **Kein Randwall:** Die Welt endet nie.
- **Kein mitwandernder Ursprung:** Alle Koordinaten sind absolute Weltkoordinaten.

**Karten-Stempel** (`CARD_STAMP = { halfW: 18, amp: 6, skirt: 7, ring: [70, 260], avoid: 48 }`)
- `cardSites`: sucht im Ring 70–260 m um den Start (Schritt 19 m, 24 Winkel) die ruhigste Fläche. Maß: Höhen-Spannweite über 5 × 5 Proben, dazu ein kleiner Abstandszuschlag. Abstand zum Platz mindestens 48 + 18 m.
- Ergebnis heute: **genau eine Karte** (`card_r3`), 36 m breit, Tiefe nach Seitenverhältnis.
- `stampHeight`: Die Höhenkarte der Karte (bilinear) wird als Plateau aufgetragen. Basis = höchster Punkt der Fläche, Amplitude 6 m, Saum 7 m (smoothstep). **Nur auftragen**, nie abtragen (V-716).
- Bewuchs, Kollider und Kugeln lesen dieselbe Höhe.

**Karten-Relief** (`cardRelief.js`, q226)
- 256 × 256 = 65 536 Knetkugeln auf dem Plateau.
- GPU-Physik (`GPUComputationRenderer`): Schwerkraft, Abprallen 0,45, Federrückkehr in die Ruhelage.
- Figur bzw. Auto stoßen die Kugeln weg (Radius 0,9 m plus Geschwindigkeit; `kick` für Stöße).
- Gerechnet wird nur in der Nähe (3 × halbe Breite) und 6 s danach.
- Farben: Helligkeit der Kartenpunkte über Quantile auf die sechs Bandrollen des Bioms am Ort. Dunkle Linien und Kartenrand in KFB-Tusche `#1f1a14`.
- Licht aus der Sonnenrichtung des einen Rigs. Freifläche für den Bewuchs: `KEEPOUT`-Rechteck mit 2,5 m Saum.

**Freiflächen** (`keepout.js`)
- Liste von Rechtecken `{ x, z, hw, hd, pad }`. Der Bewuchs filtert Instanzen darin heraus.

**Bewuchs-Zellen** (`placeVeg.js` + `placeWorker.js`)
- Je 64-m-Zelle ein Höhenraster mit 2 m Schritt (33 × 33), zeitgeteilt abgefragt.
- Danach rechnet der Worker das Rezept (Modi `place`, `mass`, `cartoon`; Löser `kfb-place-core.v1.mjs`). Instanzen landen in BatchedMesh je Materialgruppe: KayKit bis 14 000, Gras 9 000, Steinkit 12 000, Fluff als InstancedMesh bis 6 000.
- Nur auf den 64-m-Kacheln (Stufe 0); weiter draußen kein Bewuchs.
- Einblenden zeitgeteilt (je 40 Instanzen eine Pause), Budget 1,5 ms; nächste Zelle zuerst.
- Seed fest (`kfb-endless-r1`).
- Der Worker bekommt heute für jede Zelle `biome: 'moos'`. Die Farbe kommt aus der Palette des Bioms am Zellmittelpunkt.
- Fuß auf der tiefsten Stelle unter der Hülle, nie schwebend.
- Farbe:
  - Krone aus der Instanzfarbe;
  - Stamm aus der Atlas-Erkennung (rötlich = Holz) nach J17-Regel;
  - Steinkit über die Vertexfarbe;
  - Gras einfarbig in drei Stufen.
- Bei Palettenwechsel werden alle Zellen neu eingeblendet.

**Was für „Endlos-Welt komplett“ fehlt** (V-815, §8): Wasser im Endlos-Gelände; Orte, Bühnen, Dioramen und Karten je Zone (heute: ein Platz im Ursprung, eine Karte im Ring); Bewohner und Gedächtnis je Zelle; mitwandernder Ursprung; Orientierung; Bewuchs in der Ferne; Bewuchs je Biom.

## 4 · Platzierung (gebaut): Löser `kfb-place-core.v1.mjs` + Regeln `kfb_place.r1.json`

**Eine Wahrheit für Spiel und Blender:** Der Löser ist ein reines JS-Modul. Er läuft im Spiel-Worker je 64-m-Zelle bzw. 32-m-Zone und im CLI für Blender-Rezepte (golden hash).

Ablauf `placeChunk({cfg, seed, chunk, terrain, biome, masks, stamps, recipeList, cardTriplet})`:

1. **Stamps** (feste Landmarken, z. B. Stumpf): einbetten, Gebrauchsspuren, Holz-Echos (Goldwinkel, nie überkreuzt), Kontakt.
2. **Zonen-Keime:** 2–4 Gruppen je Zone (`rules.zone`), Mindestabstand, Negativraum. Seit V-788 gibt es eine Hain-Ebene (`grovePlan`): Hain- oder Wiesen-Zone aus Wertrauschen. **Laut Georg falsch als Ursache.**
3. **Gruppen je Rezept:**
   - `tree_group` (Anker-Baum mit Fluff-Ankern + 3 Stützen Baum/Baum/Busch + Akzent);
   - `bush_nest`;
   - `stone_nest_slope`.
   - Ablauf je Gruppe:
     - **`solveLocal` (WFC-artig):** Slot-Belegung aus Kachel-Domänen mit Größenleiter, `repeat_max`, Ü3 (Höhen), Ü4 (Stammdicken in Dicken-Reihenfolge), Radien-Leiter.
     - **`nestPositions`:** Überlappung ≤ 0,85 oder Luft ≥ 1,25 × Radiensumme, nie kollinear.
     - **`ruleReport`:** Prüfer wie das Gate.
4. **Fluff-Nester** (Spiel-Sammelobjekte): an gemessenen B2-Ankern der Krone (nur Lichtseite), Fokus/Echo, Fallobst hangab.
5. **Kontakt-Bögen** (Staffel L/M/S, 40–50 % Umfang). **Seit V-797 als Objekte gestrichen.**
6. **Steinspur** (path_trace): heiler Kern am Ziel, zum Rand Verfall nach SPEC_EDGE_RUBBLE (A „freies Ende“).
7. **Gras:**
   - Fuß-Büschel 3/5/7 auf einem Bogen (Licht- bzw. Hangfußseite, ≤ 50 %);
   - Felder als Fibonacci-Flecken auf Vogel-Spiralen;
   - Wind-Gruppen.
   - **Laut Georg: kein Streugras.**
8. **Oddity:** ein bewusster Regelbruch je Zelle mit Wahrscheinlichkeit nach Karten-Surrealismus.
9. **Nachlauf:** Ü3/Ü4 mit G1-Wache, Moos-Fugen (gestrichen), Kontakt unter Holz entfernt.

Weitere Teile:
- **Hüllen-Wahrheit:** 289 Kacheln tragen gemessene Gate-Hüllen (`gate_r_m`, `foot_r_m`).
- **Form-DNA-Ausschluss** (`rules.form_dna`): keine Prismen- und Würfelkronen, keine eckigen Platten.
- **Gate `kfb_env.py` r6** (Blender): G1 Gruppenregeln, Ü3/Ü4/Ü5 Lehne, Kontaktfenster, FLUFF-HALT, Palette, Einsinken.
- **Kritiker `CRITIC_3D_R1`:** K1–K10, Stopp-Regel nach zwei Reparaturen ohne Gewinn.

### Spiel-Stilbilder (Hash-Modi, Worker)

| Modus | Inhalt | Status |
|---|---|---|
| `veg=core` | Löser-Gruppen + Hain-Ebene | FAIL (q210/q211) |
| `veg=mass` | Waldmassen aus Zonenfeld, Waldboden-Zone im Shader (V-798: Raster 2,35 m, Krone an Krone, eine Baumfamilie je Masse, Saum mit runden Büschen) | Georg: Verteilungslogik und Materialcodes nicht verstanden |
| `veg=cartoon` | Modell R3: Grate tragen Baumreihen, Formationen an Hangbrüchen mit Bruchstücken hangab, Bewuchs nach außen, Solitäre mit Ablegern, Poisson-Abstände, Etherington-Gruppen | Wiese noch zu gleichmäßig voll. Rollenfarben greifen seit V-801. Nicht abgenommen; im Hub als Stilbild-Standard genutzt (Hash) |
| Standard (MVP) | `endlessVeg`: Rastersstreuung mit Palettenplatten (`plateTint`) | alter Stand; im Code weiter der Standard ohne Schalter |

## 5 · Farbe an Props (Soll und Ist)

- **Soll:** Die Kit-Textur gibt nur Hell/Dunkel, der Farbton kommt aus der Rollenfarbe der Palette: Bäume `low`, Büsche `mid`, Stein `sand`, Gras `low`. So macht es der MVP-Bewuchs (`plateTint`).
- **Ist im Löser-Bewuchs (R1):**
  - Der Knet-Shader zieht Farben mit `kfbPull` auf seine Grüntöne zurück.
  - Die Batch-Farbtextur entsteht erst beim ersten `setColorAt`, das Programm fehlt danach ohne Neubau.
  - Beides ist gefixt, die Wirkung im Bild ist aber noch nicht bestätigt.
- **Ist (R2, V-801, Georg PASS q222):**
  - Die Platte wird vor dem Knet-Block berechnet und danach wieder gesetzt, der Pull wirkt nicht mehr auf die Rolle.
  - KayKit und Gras bekommen ein weißes Vertex-Farb-Attribut, damit USE_COLOR im Fragment steht (die Batch-Instanzfarbe läuft in three r186 nur über `vColor`).
  - Rollen: Krone Laub, Laub dunkel oder Blüte (je Instanz gewürfelt); Busch Blüte oder `leaf[0]`; Stamm Laub −105°, Helligkeit × 0,62; Stein Rolle `rock`; Gras `leaf[0]` in drei Stufen.

## 5b · Farbe auf Meshy-Bühnen (V-806 bis V-814)

**Ausgangslage:** Die Bühnen und Dioramen sind Meshy-Modelle mit fertig gemalter Textur. V-286 sah dafür nur sanfte Tönung vor. V-803 verlangt, dass sie zur Biom-Palette des Ortes gehören. Rollen werden je Teil als Code im Vertex-Kanal COLOR_1 gespeichert (§5c); die Laufzeit färbt nach der Palette des Ortes.

**Geltende Regeln (Stand V-814):**
- **Tönung:** Meshy-Rollen-Teile Zug 1,0 auf Farbton und Sättigung; Helligkeit und gemalte Zeichnung bleiben (V-809). Kit-Teile 0,85 mit Deckel ΔE00 ≤ 18. Teile ohne Rolle (255) 0,18. Nur das Fokus-Teil zieht auch die Helligkeit (V-806).
- **Braun-graue Teile:** mittlere Albedo-Buntheit C* < 15 → `gradient_map` (Helligkeit der Textur → Farbton und Sättigung der Rolle), Option im Kanon-Modul `kfb_clay_bpy`, nicht in Textur oder COLOR_0 gebacken (V-809, V-812).
- **Code-Einheit:** je Bauteil des Spiel-Meshes. Verschweißt, Knickkanten über 40°, Bauteile über 15 % der Bühne nach Richtung geteilt, an Stein-IDs gerastet (V-406, R+G byte-gleich). Code aus der Geometrie: Oberseite `top`, steil `hill[0]`, steil und schlank `tower`. B9-Mehrheit nur als Rest (V-812, ersetzt die 35°-Flächenregel aus V-808).
- **Fokus:** genau ein Teil je Bühne trägt `pad`: ganzer Rahmen samt Bildschirmkante, ohne Rahmen das zentrale Wahrzeichen. Bildfläche ohne Rolle (V-808, V-329).
- **Ausnahmen (V-806):** Amphitheater-Bögen voll nach Rolle; schlanke Türme `tower`; grüner Bewuchs Laub; Steinkit-Teile in Dioramen behalten ihre Farbe in COLOR_0; Kayfabrick-Steine und Fluff ohne Rolle.
- **Neue Richtung in Probe (V-814):** Code je Bauteil nur aus Geometrie und Textur-Grundfarbe. Graue bzw. dunkle Teile `hill[0]` mit `gradient_map`, kein `rock`; Laub nur für Pflanzen. Fokus von WS0 benannt. Probe auf Theater, Utopia Stage, Nature Island. Gewinn, wenn das K2-Mittel der drei über 6,7 liegt; Mesa erst nach einem Kandidaten-Blatt.
- **Nicht sauber einfärbbar, vorerst nicht im Spiel (V-814):** Akasha-Bibliothek, Comic-Sender, Dystopie-Gasse, Goblin-Bank, Kayfabrick-Baustelle, Abenteuer-Lager, Retro-Spielhalle, UFO-Cockpit. Das Gefängnis darf dunkel-violett ins Spiel (q232). Giza liegt wieder beim Konzeptblatt (WS0).

**Chronik der Kritiker-Runden** (blinder Kritiker, nur K2 Farbe, PASS ab 8):

| Runde | Stand | Ergebnis | Kernbefund |
|---|---|---|---|
| 1 | V-803, sanft (Zug 0,18) | REWORK 21/21, bestes 7 | Tönung nicht ablesbar; kein `pad` am Fokus; Mauern in `rock`/`tower`; Bewuchs grün |
| 2 | V-806: Zug 0,8, Kit 0,5, Deckel ΔE00 ≤ 18 | REWORK 23/24, Atlantis PASS, meist 6,5–7 | Wand-Regel griff nur für Fels; Kit-Zug zu schwach |
| 3 | Wand-Regel auch für Türme, Kit 0,85 mit Deckel, Fokus mit Helligkeit | REWORK 23/24, Mittel 5,5, kein Gewinn | Codes folgen Texturflecken; „sanft“ und „erkennbar“ widersprechen sich |
| – | V-808 Flächen (35°), V-809 „voll“ + `gradient_map`, V-812 Bauteile (Proben ohne Kritiker) | Flächen: kaum Wirkung; voll: Palette lesbar; Bauteile: ruhiger | Rest-Flecken kommen aus den B9-Codes |
| 4 | V-812 gebaut (19 Meshy-Bühnen + 3 Kit-Dioramen), Gate 19/19 grün | REWORK 22/22, K2 4,5–7, Mittel 5,8 | Stopp-Regel; neue Richtung V-814 |

Quellen im Wortlaut: `FARBROLLEN_KONZEPTBLATT_WSB.md`, `VORSCHLAG_BAUTEILE_R1.md`, `kritik_runde4_farbe.md`, `COLOR_CONCEPT_R1.md` (Teil 3).

## 5c · Rollen-Codes im Kanal COLOR_1 (aus COLOR_CONCEPT_R1)

COLOR_1 RGBA8: R+G = Stein-ID (16 Bit), B = Rollen-Code, A = 255; COLOR_0 weiß. Die Laufzeit liest den Code flach bzw. als nächsten Code, nie interpoliert.

| Code | Rolle | Code | Rolle |
|---|---|---|---|
| 0 | Boden `top` | 9 | Stamm `trunk` |
| 1 | Türme/Bögen `tower` | 10 | Sand `sand` |
| 2 | Ränge/Stufen/Wand `hill[0]` | 11 | Erde/Sockel `under[1]` |
| 3 | Fels `rock` | 12 | Wolke/Fläche `cloud` |
| 4 | Rahmen `strang` | 13 | Wasser/Fluid `water` |
| 5 | Akzent `pad` (nur Fokus) | 14 | Weg `path` |
| 6 | Laub `leaf[0]` | 15 | Boden hell `top2` |
| 7 | Laub `leaf[1]` | 16 | Hügel dunkel `hill[1]` |
| 8 | Blüte `leaf[2]` | 255 | keine Rolle |

Farbskript für Dioramen (Konzeptblatt): 60 % Boden- und Wandrollen, 30 % Fels, Holz und Rahmen, 10 % Akzent nur am Fokus.

## 6 · Asset-Inventar (lokal vorhanden)

| Paket | Modelle (Dateien) | Heute im Löser |
|---|---|---|
| KayKit Forest Nature Pack 1.0 | 84 (Bäume 20, Büsche 22, Gras 20, Felsen 17, Steine L 5) | ja |
| KayKit Medieval Hexagon Pack 1.0 | ~926 Dateien (Kacheln, Natur, Gebäude) | nein |
| KayKit Medieval Builder Pack 1.0 | ~226 | nein |
| KayKit Medieval Snow Biome | ~78 | nein |
| Tiny Treats Pretty Park / Pleasant Picnic / Homely House | 28 / 41 / 27 | nein |
| Quaternius Ultimate Nature Pack | ~300 | Stumpf und Holz in Blender lokal |
| Quaternius Stylized Nature MegaKit | ~115 (Common/Birch/Pine/GiantPine/Twisted/Dead/CherryBlossom ×5, Busch, Farn, Klee, Blüten, Felsen, Pfadsteine) | nein |
| Kenney Nature Kit | ~987 Dateien | 3 Platzhalter |
| Steinkit v4 (KFB) | 170 Kacheln | ja |

**Anforderung:**
- Alle passenden Teile werden mit Rolle (Boden, Stein, Rinde, Laub, Akzent), Form-DNA-Klasse, Skalen-Normierung und Gate-Hülle registriert und stehen WFC und Platzierung zur Verfügung.
- Familien je Ort halten die Formensprache zusammen.

*Stand R2:* Register noch nicht gebaut. Dazu kommen die Meshy-Bühnen und Dioramen (22 im Farbdurchgang, davon 13 einfärbbar plus Gefängnis) als Orte für die Zonen-Verteilung (V-815).

## 7 · Werkzeuge und Pfade (für Rückfragen)

- **Kanon:** `KFB_HUB/30_DECISIONS/CANON_3D/` (CANON_3D_R1.md, EINARBEITUNG_WS1_R1/R2, CRITIC_3D_R1, lib/, sources/).
- **Löser:** `CANON_3D/lib/kfb-place-core.v1.mjs`, `kfb_place.r1.json`, CLI `kfb-place.mjs` (`--golden`).
- **Spiel:** Repo `KFB-Stunt-Car-Race`, Branch `game/proc-world-ws0`:
  - `src/world/placeWorker.js` (Modi place/mass/cartoon), `placeVeg.js`, `zoneField.js`, `endlessTerrain.js`, `biomeField.js`;
  - `src/look/terrain3.js`, `biomeTerrain.js`.
  - Neu: `src/world/cardRelief.js` (Karten-Relief), `keepout.js` (Freiflächen), `EndlessDrive.jsx` (Anschluss, Schalter), `src/assets/cards/card_r3.*` (Kartenpunkte und Höhenkarte), `src/data/worlds/kfb-biome-drive.r1.json` (Biom-Feld).
- **Blender:** `KFB_HUB/50_BLENDER/N40/` (lib: `kfb_env.py`, `kfb_place_bpy.py`, `kfb_erdkeil_bpy.py`, `kfb_contact_tint_bpy.py`).
  - Neu: `KFB_HUB/50_BLENDER/V803_FARBROLLEN/` (RETURN.md, Kritiken Runde 1–4, Skripte `b9_r812.py`, `v812_bauteile.py`, Bildpaare).
- **Farbe:** `30_DECISIONS/replies/COLOR_CONCEPT_R1.md` (Ausroll-Rollen, Rollen-Codes), `FARBROLLEN_KONZEPTBLATT_WSB.md`, Generator `kfb-cartoon-palette.js`.
- **Plan:** `30_DECISIONS/WS0_STATE.md` → „Fahrplan“; Register `decisions.json`.

## 8 · Fahrplan und Endlos-Welt komplett (V-805, V-815)

| # | Stufe | Inhalt | Stand 25.10. abends |
|---|---|---|---|
| 1 | Fahrphysik S1 (V-783) | Landestoß, Festfahren, Kippen, Drehrate, Sprungbogen, Stand am Hang; Kameras; Fassrolle | erledigt; offen: Tricks als HUD-Knöpfe, Dieselpunk-Flug, Mech, Drehung beim Gehen |
| 2 | Gameplay-Critic | blinder externer Prüf-Agent nach den Fixes | offen |
| 3 | Wasser | Seen und Ufer (`kfbWater`), Flüsse (`kfb-hydro`) in der endlosen Welt, Fluid-Farben aus dem Biom-Schema (V-750) | offen |
| 4 | Amphitheater | einpassen und farblich ins Biom integrieren (q225) | offen |
| 5 | Karten-Gelände | eine Karte je Zone, Ortsbezug, nach Modell R3; Auto stößt Kugeln (q226) | eine Karte im Ring gebaut |
| 5b | Endlos-Welt komplett (V-815) | `world=endless` als Standard; Wasser im Endlos-Gelände; Orte, Bühnen, Dioramen, Karten je Zone prozedural und reproduzierbar; Bewohner, Fluffer, Obstgärten, Fluff je Zelle mit festem Seed; Gedächtnis je Zelle (eingesammelt, gesprengt, erledigt); mitwandernder Weltursprung; Orientierung (Kompass/Minikarte, POI-Hinweise, Fahrzeug-Seele) | geplant; Abschluss: Video einer langen Fahrt ohne Rand, mit Orten und Bewohnern |
| 6 | Splat-Probe | kleinster Test (V-733) | offen |
| danach | Combat, Destruction | V-782, V-767 | |

**Kontext außerhalb des Prüfgegenstands:** Fahrgefühl-SFX (V-807), Fahrzeug-Seele KnuckleBob als seltene Vignette (V-810), Mindscape-Klangbetten für Fahrt und Flug (V-811), Genius Loci für Orte als spätere Idee (V-813).


---

# TEIL 3 · Kanon-Quellen im Wortlaut


---

## Quelle: CANON_3D_R1.md

# KFB 3D-Kanon · R1 · 2026-10-20 · WS0 (V-563)

**Diese Seite ist die einzige Quelle (SSOT) für alles Gestalterische in 3D.** Sie gilt für:
- jeden 3D-Job: Blender, Laufzeit, Meshy und Asset-Übernahme;
- jedes Scenelet, jede Demo und jede Abnahme;
- jede Spielszene: Residents und Dioramen.

**Grundsätze:**
- **Leitsatz (V-566):** Eine Szene ist erst fertig, wenn sie als **ein einziges handgemachtes Objekt** gelesen werden kann. Terrain, Requisiten, Figuren, Licht, Schatten, Farbe und Bewegung teilen dieselbe Erzählung, Formlogik, Wertstruktur und Gebrauchsgeschichte.
- Regeln hier sind **Pflicht, keine Tipps.**
- Was eine Lieferung bricht, ist FAIL, auch wenn alle Messwerte grün sind.
- **Zahlen (V-568):** Invarianten (z. B. keine Scheibe, kein Schweben, keine Blob-Schatten, Augen an jeder Figur) sind hartes FAIL. Prozentwerte und Anzahlen (Einsinken, Abstände, 70/20/10, Gruppengrößen) sind Startwerte; sie werden an einer freigegebenen Musterregion kalibriert und dann in `kfb_env.RULES`/`SINK` nachgetragen. Bis dahin gelten sie als Gate-Werte.
- **Rangfolge:** Georgs Wort > Register (`build_decisions.py`, V-Nummern) > diese Seite > die hier verlinkten Quellen > alles andere.

**Pfade:**
- relativ zu `KFB_HUB/30_DECISIONS/`;
- `S/` = `CANON_3D/sources/`: eingefrorene Kopien aus Lab und Spenderordnern, Herkunft und Prüfsumme in `S/MANIFEST.tsv`;
- die Originale dort zählen nicht mehr.

## 0 · Pflicht für jeden Job (Tier 0 jedes Briefs; diese drei Zeilen kopiert WS0 wörtlich in jeden 3D-Brief)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

## 1 · Fachgebiete
| # | Gebiet | Maßgebliche Quelle(n) | Kern (Auszug, Quelle gilt vollständig) | Mechanisch geprüft | Kritiker |
|---|---|---|---|---|---|
| 1 | **Weltlogik und Geschichte** | `S/QA_RULEBOOK_ENVIRONMENT_R1.md` §00 + §1; `S/ENV_ERZAEHLRASTER_R1.md`; V-015, V-561 | Pflichtfrage je Element: wer, womit, warum. Was sich nicht erzählen lässt, wird nicht gebaut. Messregeln sind die Untergrenze. Konzeptblatt vor dem Bau. | `kfb_env` K0 (Konzeptblatt), S1 (Geschichte je Objekt) | K1, K9 |
| 2 | **Komposition, Platzierung, Erdung** | `S/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` (R2-Stand); `replies/SPEC_PLACEMENT_GRAMMAR_R2.md` (Register-Fassung, die Kopie in `50_BLENDER/SPEC` ist abgelöst); `S/QA_RULEBOOK_ENVIRONMENT_R1.md` §2/§2b; `S/NOTEBOOKLM_P3_…`; `50_BLENDER/B2/R2/RESEARCH_SOURCES.md`; `S/QUATERNIUS_MEGAKIT_STUDY.md`; V-400, V-456, V-496 | Erdung: eingraben, Kontakt, überlappen, mit Ursache. **70/20/10 (V-566, ersetzt 70/30):** 70 % Ruhe (Terrain großflächig, darf Textur haben, aber keine Konkurrenz um Aufmerksamkeit), 20 % Struktur (Welt, Gruppen), 10 % Bedeutung (Fokus, Figuren, Ziel). Der stärkste Kontrast liegt in den 10 %. Einsinken je Objektart. Gruppen ungerade, 1 : 3 : Rest mit Größen 1 : 0,62 : 0,38, Abstände ≥ 30 % verschieden, ≤ 2 auf einer Geraden, Konturen ≥ 15 % überlappt oder ≥ 25 % Luft, Negativraum ≥ 30 %, Landmarke am höchsten, Staffel 1 : 3 : 9, ein Kit je Gruppe, keine Klone. **Nie Props auf einer Scheibe oder Platte.** | `kfb_env` B1/B2, E1/E2, G1/G2, H3/H5/H7/H9/H11, C1 (Kontakt-Geometrie) | K3, K4, K7 |
| 3 | **Ortsbiografie und Set-Dressing** | `../50_BLENDER/SPEC/KONZEPT_ORTSBIOGRAFIE_UND_BAUSATZ_R1.md`; `S/ENV_ERZAEHLRASTER_R1.md`; V-341, V-396 | Vier Schichten: Entstehen → Nutzen → Vergehen → Bewachsen. Moos in Fugen, Gras 0–2 m, Büsche 2–6 m, Bäume ab 6 m. Ein Materialcode je Schicht. Signatur: 1 Hero + 2 Echos. Requisiten in Funktionsgruppen. **Gebrauchsspuren (V-566):** Hero-Requisiten, Gebäude und Landmarken tragen ≥ 2 Spuren mit Ursache (Abnutzung, Reparatur, Fleck, Ersatzteil, Moos, Farbverlust). Bei RA-Quellen nur über Knet-Oberfläche und Terrain, die Silhouette bleibt 1:1. | `kfb_env` S3/S4 (Schichten), S5 (Signatur) | K5, K9 |
| 4 | **Übergänge, Kanten, Sprenkel, ABSCHLÜSSE** (Flächen- und Sprenkellogik: siehe Gebiet 17; **Abschluss-Grammatik V-577 = `S/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md` wörtlich, Werkzeug `kfb_edge`**) | `S/QA_RULEBOOK_ENVIRONMENT_R1.md` §01; `S/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`; `S/QA_RULEBOOK_TRANSITIONS_R1.md`; `replies/TRANSITION_INTENT_R1.md`; `S/NOTEBOOKLM_P1_…`; V-011, V-168, V-403 | Keine harten Schnitte, keine sichtbaren Kanten. Übergänge nur als Sprenkel in beide Richtungen, nie Verlauf, Alpha oder Linie. Freie Enden runden sich über Rubbel. **Abschluss-Grammatik (V-577, Georg 08./09.10., verbindlich, kein Neu-Erfinden):** Für jede Kante, an der etwas endet (Kachelfeld, Weg, Dungeon-Wand im Raum, Mauer, Bord), gilt genau eine der zwei Formen. (A) **Freies Ende durch Verfall (Georg 20.10. nach drei Probebildern, V-578; ersetzt „nur ganze große Platten“):** Ein Abstandsfeld zum äußeren Umriss (innere Fugen zählen nicht). Bis zu einer geschwungenen Isolinie bleibt die Fläche heil, danach wird sie in pfadartige Stücke aus demselben Material geschnitten, verwittert gerundet und von dicht nach locker verteilt wie KayKit path_A → path_D (Durchmesser ≈ 1,0 → 0,4 u, Fuge ≈ 3 → 31 cm), einzelne fehlen (Erde in der Lücke). Splitter gibt es nur ganz außen und in Gruppen. Nie gerade Plattenkanten gegen den Boden, nie eine Konfetti-Zone. (B) **Gebautes Ende:** gerundete Abschlusskappe aus der Abschlussstück-Familie (Kantenstein, Bordsteinkopf, Wandkopf, Mauerende), mit Rubbel bzw. Knetfleck zur Umgebung. Wandenden im Raum = Abschlusskappe oder Ruinen-Abschluss (abgebrochene Oberkante + Rubbel), nie Schnittkante. Werkzeug: `CANON_3D/lib/kfb_edge_bpy.py` + `kfb_edge_params.json` (WSB K8, Test `test/bpy_edge_cases.py` PASS; `free_end`, `built_end`, `ruin_end`, EdgeField mit earth()/ground_level() für Gelände und Shader) bzw. Laufzeit-Gegenstück (WS1); eigene Band-/Bruch-Lösungen je Szene sind verboten. **Kontakt-Geometrie ist Pflicht (V-565):** Jede Fuge zwischen Objekt und Boden wird physisch gebrochen, durch kleine Knet-Elemente (Steinchen, Moos, Erdkeil, Gras-Büschel) mit Ursache. Das gilt sofort und unabhängig vom Speckle-Modul. | **Lücke:** Speckle-Modul nicht im Hub (V-403), kein Blender-Gegenstück | K4, K6 |
| 5 | **Inselkörper, Terrain, Strecke** | `S/ISLAND_ANATOMY_RULES.md`; `S/SCALE_CONTRACT_K2.md`; `replies/WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1_2026-10-19.md` (#439); `S/NOTEBOOKLM_P2_…`; V-010, V-102, V-136, V-142, V-167, V-402 | Insel = ein geschlossener Körper, Mesa: Cap → Body → Skirt. J17-Goldstandard, Fahrbahn #3d4a60, Banden #ef5a22. Rampen ohne Stufen; Farbflächen unabhängig von der Höhe. **Terrain-Look-Stack (Web-Chat 19.10., `S/WEBCHAT_TERRAIN_LOOK_STACK_2026-10-19.md`):**
(1) Terrainform.
(2) Organische Farbflächen: **4** gebrochene Farben. Die Flächen sind geschlossene, gerundete Blobs, die per smooth-min weich verschmelzen, mit Größenhierarchie und Verschachtelung (Georg 20.10., V-570). **Nie Schwellwert-Rauschen (fbm + Warp) als Flächengenerator**, keine langgezogenen Zungen, dünnen Hälse oder Mäander, Seitenverhältnis ≤ 1,25 [Startwert]. Danach nur schwache Konturverzerrung. Optional editierbare Spline-Bahnen. Wände tragen dasselbe Feld, nur dunkler, ohne harten Wechsel an der Kante. Nie Höhen-Cutoffs, kein „Schnittkuchen“.
(3) Selektive Kantenakzente in dunklem Palettenton, nur an echten Formbrüchen; nie jede Farbgrenze und nie schwarze Tusche.
(4) Vordergrund-Tonmasse als Fläche, nicht als Verlauf.
(5) Echte Schatten.
**Abnahme-Test:** zwei Plateaus und ein Canyon; die Höhe eines Plateaus stark ändern, ohne das Farbfeld neu zu rechnen. Die Farben bleiben organisch und das Relief liest sich weiter als ein Cartoon-Bild. | Proof Stage G3 (Boden); Rest WS1-Tests | K6, K8 |
| 6 | **Farbe und Palette** | `replies/COLOR_CONCEPT_R1.md`; `replies/COLOR_HARMONY_R1/` (`kfb-cartoon-palette.js`); `replies/ISLAND_PALETTES_R1/`; V-286, V-292, V-305, V-396, V-402, V-406, V-441 | Eine Palette mit Rollen (`ENV_ROLES`, 3 Töne je Rolle), 60/30/10. Harmonie über das Material, nie über das Licht. Meshy nur leicht tönen. Kein Mittelgrau. **Jede Farbe ist erlaubt, auch surreal (z. B. lila Gras), wenn der Materialcode die Logik trägt (V-565).** Gras liest sich als Gras über Form, Verteilung und Bewegung: Büschel in Gruppen, Wind-Gruppen und Deformer (`S/SPEC_ENVIRONMENT_KIT_R1.md` §5–§8). Einzige Farbgrenze ist technisch: Chroma ≤ 0,195 gegen ACES-Ausbrennen (ISLAND_PALETTES). | `kfb_env` S2 (Rolle je Objekt); **Lücke:** Farbwerte gegen den Generator nicht geprüft | K2 |
| 7 | **Licht und Schatten** | `replies/LIGHT_MODEL_R2.md` (Regeln 1–11, Raster L-1…L-8); `replies/LIGHT_RESEARCH_AUDIT_R1.md`; `S/LESSONS_SHADOWS.md`; Modul `kfb-stage-light.v1.1.js`; V-385, V-386, V-387, V-392, V-429, V-440 | Ein Rig, ein Tonweg, eine Materialantwort. Keine privaten Lichter. Gegenlicht standardmäßig aus (V-392 gilt vor V-385 Regel 1). Alles wirft und empfängt vom einen Key. Keine Blob-Schatten. **Erdung/Kontakt (Georg 20.10., V-570):** Jedes Requisit und jedes Diorama trägt unten einen dunklen, nie schwarzen Kontaktton, ebenso Übergänge wie Baumkronen-Unterseiten. `contactDepthTint` liegt 8–12 L* unter dem Wurfschatten, als harte schmale Stufe, kein weicher Ring. **[Invariante]** Jeder Akteur wirft in Tag, Gold und Nacht einen echten Schatten; kein Kapsel-, Decal- oder Blob-Objekt. **Lichtpfützen und Strahlen (V-572):** Pfützen von Strahlern, Spots, Scheinwerfern und Discokugel werden auf den Empfänger projiziert (Modul `CANON_3D/lib/kfb-light-pool.v1.js`, WS1; Inventur `S/WS1_V572_INVENTUR_LICHT_MESHES_R1.md`), nie als flache Scheibe gezeichnet. Lichtkegel blenden am Kontakt weich aus, ohne harte Schnittlinie. Das Schatten-Quartett je Rolle (Licht, castShadowTint, contactDepthTint, edgeAccentTint) und seine Ableitung stehen in Anhang A Ü18–Ü20. **Schatten sind ein kontrollierter Teil der Palette, keine Beleuchtungsebene (V-564, präzisiert 20.10.):**
- Je Biom eine Schatten-Familie: `baseColors[3–4]`, `shadowColor` (Stufe A: Schlagschatten von Figur, Racer, Requisit, Fels), `deepShadowColor` (Stufe B: Kontakt, Überlagerung, Spalten; vorhandenes AO begrenzt, nie mehrfach multipliziert), `edgeAccentColor`.
- Höchstens zwei Schattenstufen, nie Schwarz oder Grau.
- Das echte Shadow-Map-Ergebnis bestimmt, wo der Schatten liegt; die Palette des Empfängers bestimmt die Farbe.
- Halbschatten moderat, optional eine zweistufige Toon-Quantisierung.
- Kantenakzent und Schatten sind getrennte Funktionen.
- Selbstschatten vereinfacht: Licht- und Schattenseite. | Proof Stage G6 (Schattensaum); `selfTest()`; Blender: `CANON_3D/lib/kfb_light_bpy.py` (WSB K3, angenommen 20.10.; Licht in Blender nur darüber) | K4, K6 |
| 8 | **Material, Knete, Textur** | `replies/CLAY_SSOT_R1/` (`kfb-clay.v1.1.js`, Golden-Tests); `S/HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`; `S/KLAYBOUND_CLAYBOUND_VISUAL_BENCHMARK_2026-09-26.md`; V-053, V-346, V-355, V-429, V-431 | Ein Knet-Modul überall (Profil je Klasse). Kneten, nicht modellieren. Sonne warm-weiß (sattes Licht färbt die Knete um). Meshy-Texturen entleuchtet. Abnahmebilder immer mit Knete. **Materialantwort (V-566):** Jedes `kfb-clay`-Profil dokumentiert Rauheitsbereich, Schattentönung, Kantenantwort (weich, kein CGI-Glanz), Abnutzung und Verformung. Alle Klassen antworten auf dasselbe eine Licht. | Proof Stage G2/G5; Clay-Golden G0–G5. Blender: `CANON_3D/lib/kfb_clay_bpy.py` (WSB K1, R1; `apply()` = Eingangsprüfung, `write_asset_pass()`); Emission der background/midground-Profile 1:1 wie im Web-SSOT. `kfb_env_bpy.place(ob, kind, support=)` setzt Teile mit SINK bzw. SINK_CAP auf den Grund oder auf Gebautes | K6 |
| 9 | **Figuren: Augen, Rig, Integrität, Maßstab** | `KFB_WORKING_RULES_R1.md`; `S/SCALE_CONTRACT_K2.md`; `replies/FIGURES_R1/`; `60_CAST/cast.r1.json`; V-060, V-061, V-090, V-214, V-348, V-391, V-420, V-422, V-518, V-541, V-562 | Keine geprüften KFB-Augen = FAIL, an **jeder** Variante. **Messen in Blender (WSB K9):** Ein Bone-Parent sitzt in Blender am Knochen-Ende und in der Knochenachse, nicht am glTF-Knoten. Waffen bzw. Anker deshalb im glTF-Raum vermessen, nie über Bone-Parent. E2-Lider, keine Schalen. Kein Schielen. Figuren nie skalieren. Anker KFB_Grip/KFB_Muzzle. **Kit-Waffen einpassen (V-574 + V-581):** Original am Kit-Slot, Kit-Clips unverändert. Passen die Achsen von Clip und Waffe nicht (Ranged-Clips +X vorn, Waffe +Z), gibt es genau eine feste, gemessene Halterungsdrehung je Waffe (slotOffset.rotation, Beleg). Nie Nachdrehen je Bild, nie Wurzeldrehung. KFB_Muzzle: +Z = Schuss (V-579). **Zweihand-Waffen (V-582, drei Clip-Familien):** (1) Zielen/Schießen/Nachladen mit Hand am Gewehr: eine feste Stützhand-Halterung, die ganze Figur samt Füßen um die gemessene Laufabweichung gedreht; (2) Laufen, Strafe, kleiner Treffer, Ruhe: je Clip eine feste natürliche Haltung, Gewehr etwa waagrecht, nie im Boden; (3) Ausweichen und großer Treffer: Beine aus dem Kit-Clip, Oberkörper und Gewehr aus Running_HoldingRifle (Upper-Body-Mask). Keine Arm-IK, kein Nachdrehen je Bild. | Proof Stage G1 (Augen, Lider). **Lücke:** Prüfer für Figurenkarte und Besetzung | K10 |
| 10 | **Bewegung und Choreografie** | `MOTION_GUIDE_R1.md`; `S/KFB Cartoon Motion Research v1.md`; `S/RESEARCH_LOCOMOTION_PRACTICE.md`; `S/CHOREO_RESEARCH_01.md`; V-177, V-179, V-180, V-186, V-555 | Reihenfolge Augen → Kopf → Körper, Kopf 2–4 Frames hinter den Augen. Squash ≤ 8 % (Stürze stärker). Tempo-Fenster ±15–20 %, Lücken mit Clip-Stufen füllen statt mit Multiplikator. | **Lücke:** kein Bewegungs-Gate | K10 |
| 11 | **VFX** | `replies/SPEC_CARTOON_VFX_SHAPES_R1.md`; V-357, V-499, V-560 | Eine Masse mit Beulen, nie Kugelstapel. Lobes überlappen 30–60 %. Lebenszyklus. 2–3 Tonstufen aus dem einen Licht, keine Emission. 15-Punkte-Liste. | **Lücke:** Checkliste nicht mechanisiert | K6 |
| 12 | **Kamera und Inszenierung** | **Lücke:** keine 3D-Recherche, siehe `RESEARCH_BACKLOG_R1.md` R1. Recherche R1 liegt vor: `S/WS1_R1_INSZENIERUNG_R1.md`, eingearbeitet als Anhang A Ü25–Ü28; Spielkamera V-025–V-027, V-088 | Je Kamera 1 Fokus und ≤ 2 Akzente. Fokusfläche 4–15 % (Übersicht) bzw. 2–10 % (Spiel) [Startwert], in der Safe-Zone, nie unter dem HUD. 3 Wertmassen. Tiefenstaffel. Freiraum um den Fokus. **[Invariante]** keine DOF, kein Tilt-Shift, keine Vignette, kein Screen-Gradient. | `kfb_view` (WS1, W5) | K1, K3 |
| 13 | **Scenelets, Bühne, Besetzung** | `replies/SPEC_SCENELET_R2.md`; `replies/SPEC_SCENE_PACK_R1.md`; V-548–V-559 | Eine Besetzungsliste. QA (a)–(h). **Die Umgebung jedes Scenelets fällt unter die Gebiete 1–8.** | **Lücke:** Scenelet-Validator | K1–K10 |
| 16 | **Bildanatomie: Werte, Fokus, Tiefe, Form, Leben** (V-566; füllt Gebiet 12 bis zur Recherche R1) | `S/PERPLEXITY_REVIEW_CANON_2026-10-20.md`; `S/GEMINI_REVIEW_CANON_2026-10-20.md`; `S/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` §4 | Vor dem Bau im Konzeptblatt festgelegt: (1) **Ein Satz:** „Diese Szene zeigt [Ereignis], weil [Ursache], und der Spieler soll zuerst [Fokus] sehen.“ (2) **Der Fokus gewinnt:** genau ein primärer Fokus, der über ≥ 2 Mittel gewinnt (Wert-, Farb-, Formkontrast, Isolation, Licht, Linie). Kein Deko-Objekt ist heller, bunter oder in der Silhouette aktiver als der Fokus. (3) **Wertstruktur vor Farbe:** Hell-, Mittel- und Dunkelzonen, wo der stärkste Wertkontrast liegt, welche Bereiche ruhig bleiben. (4) **Drei Tiefenebenen:** Vordergrund rahmt (wenige große, dunklere bzw. weichere Formen), Mittelgrund trägt die Handlung (höchste Klarheit, stärkster Kontrast), Hintergrund vereinfacht (weniger Detail, Sättigung und Kantenhärte). Das Terrain ist nie die lauteste Fläche. (5) **Farb-Skript je Szene:** Stimmung, Terrain, Sekundär, Akzent, Verbotenes, Lichtstimmung. **Die Akzentfarbe ist Bedeutung:** nur an Ziel, Gefahr, Interaktion, Figur oder Erzählkern, nie an Deko. (6) **Form-DNA** je Biom bzw. Bühne: 3 Grundformen, 2 Sekundärformen, 1 verbotene Formfamilie, Kantenrundung, Unregelmäßigkeit (kontrolliert, nie zufällig). KFB-Grund-DNA: runde Hügel, abgeflachte Kugeln, weiche Keile; verboten sind scharfe Prismen, exakte Zylinder und CAD-Booleans. (7) **Lebensanker:** mindestens ein Element mit Bewegung bzw. Reaktion (Wind-Gruppen, Rauch, Wasser, Fahne, Vögel, wippendes Requisit). **Silhouette-Rescue**, wenn der Silhouetten-Pass fällt: Boden hinter dem Objekt heller, Hintergrund dunkler, Form ändern, Kontakt-Geometrie, Wertverschiebung, Praktikal mit erzählerischer Ursache. Nie Rim- bzw. Gegenlicht (V-392). | `kfb_env` K0 (Pflichtfelder `one_sentence`, `color_script`, `form_dna`, `life_anchor`), M4 (Akzent nur mit Bedeutung), M5 (Asset-Pass) | K1, K2, K3, K7 + Pässe Silhouette, Graustufen, Thumbnail |
| 17 | **Flächengrammatik: Farb- und Materialflächen, Übergänge, Sprenkel** (V-568; Georg 20.10.: „organische Formen, die fließen, nicht Tarnfleck … wie Fahrflächen, die fließen, mit innerer Logik“) | `S/PERPLEXITY_FLAECHENGRAMMATIK_2026-10-20.md`; `S/WEBCHAT_TERRAIN_LOOK_STACK_2026-10-19.md`; `S/NOTEBOOKLM_P1_…`; V-403, V-564 | (1) **Jede größere Fläche hat eine Ursache oder eine kompositorische Aufgabe** (Talfläche, trockene Kuppe, Ufer, Fahrkorridor). Erst wird festgelegt, welche Flächen zusammengehören, wo sie sich berühren und warum es dort ausfranst; dann kommen die Werkzeuge. (2) **Drei Maßstabsebenen, unabhängig gesteuert:** Makro entscheidet, wo ein Material liegt. Meso formt Kontur und innere Gliederung (Erdinseln, Mooszungen). Mikro (Dellen, Körnung) darf die Lesbarkeit der beiden anderen nie verändern. Keine kleinen Flecken, die aus der Übersicht wie eigene Biome wirken. (3) **Konturen erst entwerfen, dann leicht verzerren:** Grundformen sind geschlossene, gerundete Blobs, asymmetrische Ovale, weiche Keile und zusammenfließende Lappen (smooth-min, Distanzfelder); keine langgezogenen Zungen (Georg 20.10., V-570). Danach schwaches Domain-Warping auf zwei Ebenen (Hauptkontur, schwächer der Rand), keine hochfrequenten Zacken. Ziel ist ein zusammengedrückter Knetlappen, kein Wolkenfoto, keine Küstenkarte, kein Tarnfleck. (4) **Übergang = eigene Zone** (Band |d| < w um die Grenzkurve) mit drei Bestandteilen: ruhige Hauptkontur, wenige rundliche Ausbuchtungen (keine Zungen), wenige Satelliten, die weich aus dem Band schrumpfen und nie abgeschnitten sind; nie überall gleich stark. **Gerichtet, nicht spiegelbildlich:** Gras wächst in Büscheln in die Erde, Erde liegt frei zwischen Grasgruppen, Feuchte bildet flache Lappen, Sand längliche Ablagerungen. (5) **Sprenkel (präzisiert V-403):** Ein Formalphabet aus gedrücktem Klecks, kurzem Oval, kleinem Keil, Doppelklecks und gerundetem Bruchstück, nie reine Kreise. Wahrscheinlichkeit = Basis × Übergangsmaske × Ursachenmaske × Ruhemaske. Sprenkel liegen überwiegend an Übergängen und Kontaktzonen und dekorieren nie gleichmäßig die Landschaft. In Clustern statt Konfetti, mit leeren Bereichen dazwischen, an der lokalen Grenze ausgerichtet; Poisson bzw. Blue Noise nur innerhalb einer komponierten Maske. Fahr- und Lesebereiche bleiben frei. (6) **Drei Arten von „Höhe“ trennen:** Geländehöhe nie für Farbe (V-564). Neigung darf ein Material plausibler machen (Fels an steilen Wänden), aber nicht jeden Hügel nach Schema bemalen. Material-Höhenblending ist erlaubt (Erde zwischen Moospolstern statt Braungrün-Verlauf), stilisiert und großformatig. (7) **Ufer-Grammatik:** Wasser → Kontaktkante → feuchtes Ufer → trockenes Gelände, jede Zone unabhängig steuerbar. Kein gleich breiter heller Saum bzw. Halo; wenige große Buchten; Steine und Büschel mit echtem Kontakt zur Wasserlinie. (8) **Farbe:** Die Variation innerhalb eines Materials ist schwächer als der Wechsel zwischen Materialien; der Materialwechsel ist deutlich, mit wenigen Flächen. Keine Schattierung in die Albedo malen (M2). (9) **Diagnose vor jeder Terrain-Überarbeitung (SOP)**, dieselbe Spielkamera in vier Ansichten: (a) unbeleuchtete Albedo ohne Schatten und AO, (b) einheitlich graues Material, (c) Material-ID, (d) final. So wird nie ein Schattenfehler mit Bodenfarbe korrigiert. (10) **Umbau in fünf Pässen:** 1 Entstören (Sprenkel aus, wenige Flächen, Halo aus), 2 Hauptformen (eine Testregion komponieren), 3 Übergänge, 4 Haptik und Distanz (Knete zurück, kein Flimmern, kein wanderndes Muster bei Kamerafahrt), 5 Vergleich A aktuell / B nur Flächen / C + Übergänge / D + Haptik. Ist D nicht klar besser lesbar als C, ist das Detail zu stark. (11) **Kalibrierung:** Prozedurale Regeln werden an einer freigegebenen Musterregion kalibriert, bevor sie auf die Welt ausgerollt werden. | Kritiker mit den 4 Diagnose-Ansichten + A/B/C/D-Vergleich; WS1-Laufzeit (#439, Paket E) | K2, K3, K4, K7 |
| 18 | **Himmel, Horizont, Ferne** (Ebene 0 hinter den Tiefenebenen von Gebiet 16; Georgs Befund „Nebelbalken“ 20.10.) | `S/WS1_R13_HIMMEL_HORIZONT_FERNE_R1.md`; `S/WS1_R12_…` §B5; Anhang B Ü31–Ü41; V-101, V-132, V-305, V-381, V-444 | Himmel = Farbsatz je Stimmung: 6 Farben, zwei Verläufe, der Horizont als hellste Linie, Rolle `horizon` farbig. **[I]** Unter dem Horizont nie eine konstante Fläche, sondern Bodendunst. **[I]** Luft = `skyColor(dir)` für Kuppel, Terrain, Wasser, Kulissen und Wolken; an der Kante f ≥ 0,98, kein Balken. Distanzluft erst hinter dem Mittelgrund. 2–3 weltfeste Kulissenringe. Wolken aus Knete (Gebiet 11), ≤ 2 Massen. **[I]** Die Sonne steht in Key-Richtung. ≤ 1 Signatur-Himmelskörper je Hälfte, ≤ 15 %. Nie: Bildschirm-Himmel, gemalte Strahlen, physikalischer Himmel. Ein RA-Himmel bleibt 1:1. | `kfb_env` Y1–Y4, K0; `kfb_view` P1–P10 | K3, K6, K7 + Horizont-Pass |
| 15 | **Einpassung ins Terrain = ein Gesamtbild** (Georg 20.10.: „liegen alle nur auf dem Terrain rum, andere Farben, Texturen, Licht, Geometrien“) | V-341, V-396, V-402, V-403, V-429, V-564; `../50_BLENDER/SPEC/KONZEPT_ORTSBIOGRAFIE_UND_BAUSATZ_R1.md`; `replies/SPEC_PLACEMENT_GRAMMAR_R2.md` §4; `S/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` §1 | Eine Szene wird **im** Terrain gebaut, nie daraufgelegt. (1) **Boden:** kein eigener Boden, keine Platte; das Terrain läuft hinein, Sockel sinkt ein bzw. das Gelände steigt an (Schürze, Erdkeil). (2) **Farbe:** alle Töne aus derselben Biom-/Bühnenpalette mit Rollen wie das Terrain ringsum; Meshy-/Kit-Farben werden auf die Rollen umgetönt. (3) **Textur und Material:** dasselbe Knet-Material (`kfb-clay.v1.1`), keine fremden Texturen, kein eingebackenes Licht, kein eingebackenes AO. (4) **Licht:** nur das eine Rig der Welt, keine Szenen-Lampen außer echten Praktikals (V-385). (5) **Geometrie:** Maßstab K2, runde Knet-Kanten wie das Terrain, keine glatten CAD-Flächen. Ränder laufen über Rubbel bzw. Steinbänder und Sprenkel in beide Richtungen aus (V-403). (6) **Abnahme:** immer im echten Terrain mit Spielkamera; ein Bild auf neutralem Boden zählt nicht. (7) **Eingangsprüfung + Asset-Pass (V-565/V-566):** Jedes importierte Asset bekommt einen Asset-Pass (`<asset>.asset_pass.json`: Ursprung und Lizenz, Knet-Profil, Rollenfarbe, Form-DNA, Gebrauchsspuren, Maßstab, erlaubte Platzierung); ohne Pass kein Szenenbau (Gate M5). kein Meshy- bzw. Kit-Asset roh. Jedes läuft vor dem Szenenbau durch Knet-Profil + Paletten-Filter (`kfb_clay_bpy.apply`); sonst FAIL (M1/M3). | `kfb_env` B1 (Platte), B2, E1/E2 (Grund = Terrain), M1 (Material = kfb-clay), M2 (kein eingebackenes Licht), M3 (Farbe außerhalb der Palette); WS1-Export misst im Spielterrain | K2, K4, K6 |
| 14 | **Abnahme** (Ablauf V-566: Konzeptblatt → Blockout (Massen, Terrain, Fokus, Wege, Tiefenebenen) → Value-Pass (Graustufen + Thumbnail) → Asset-Pass → Terrain-Pass → Licht-Pass → Life-Pass → Gate → Kritiker → Georg) | `replies/PROOF_STAGE_R1/README.md`; `CANON_3D/CRITIC_3D_R1.md`; `S/QA_CRITIC_PROTOCOL_R1.md`; V-431, V-520, V-561, V-563 | Erst das mechanische Gate, dann der blinde Kritiker. Phase 1: alles; Phase 2: nur Spielszenen. Stopp-Regel. Georg sieht nur Bestandenes. | `kfb_env.gate`, Proof Stage G1–G7 | – |

## 2 · Widersprüche (Stand 20.10.)
| Thema | Konflikt | Status |
|---|---|---|
| Gegenlicht | V-385 Regel 1 „immer an“ ↔ V-392 „standardmäßig aus“ | **entschieden:** V-392 / LIGHT_MODEL_R2 gilt (V-563) |
| Bodenfarbe | V-396 (größter edgePalette-Anteil) ↔ VORSCHLAG_BODENFARBE (kein sattes Grün) ↔ V-441 (aus der Stimmung) | **entschieden V-564/V-565:** Farbflächen aus der Stimmung (V-441); keine Farbsperre, der Materialcode trägt die Logik; edgePalette-Anteil nur für Schürze und Steine |
| Schatten | farbige Paletten-Schatten (Design 19.10., #439) ↔ eine Sonnenschatten-Regel (LIGHT_MODEL_R2) | **entschieden V-564:** echter Shadow-Map-Schatten aus dem einen Rig, getönt nach Empfänger-Palette |
| Style Guide | `STYLE_GUIDE_3D_R1` / `MOTION_GUIDE_R1` (11.10.) sind älter als V-305…V-561 | Diese Seite gilt vor ihnen; R2-Zusammenführung im Backlog |
| Platzierungs-Grammatik | Kopie in `50_BLENDER/SPEC` | abgelöst durch `replies/…R2` |

**Anhang B (verbindlich, V-575):** `CANON_3D/EINARBEITUNG_WS1_R2.md`: WS1-Recherchen R12 (Cartoon-Animation) und R13 (Himmel, Horizont, Ferne), Ü31–Ü47, Gebiet 18.

**Anhang A (verbindlich, V-570):** `CANON_3D/EINARBEITUNG_WS1_R1.md`, die Einarbeitung der WS1-Recherchen R1–R4, R10, R11 und der Flächengrammatik sowie Georgs Look-Feedback (Ü1–Ü30, Gate-Werte, Widersprüche, Nicht-Übernahmen).

**Externe Prüfungen:** `S/GEMINI_REVIEW_CANON_2026-10-20.md`, `S/PERPLEXITY_REVIEW_CANON_2026-10-20.md` (übernommen und nicht übernommen, mit Grund).

## 3 · Werkzeug-Lücken (Reihenfolge)
1. Blender-Knet- und Palettenmodul (`CANON_3D/lib/kfb_clay_bpy.py`): Rollenfarben aus `kfb-cartoon-palette`, Knet-Profil wie `kfb-clay.v1.1`.
2. Speckle-Modul `kfb-speckle-transition.v1` in den Hub, mit Blender-Gegenstück.
3. Validator für Scenelet, Figurenkarte und Besetzung (V-391: ohne `eyeRig` abgelehnt).
4. Bewegungs-Gate (Squash, Reihenfolge Augen → Kopf → Körper) und VFX-Checkliste als Prüfung.

## 4 · Recherche-Lücken
Siehe `CANON_3D/RESEARCH_BACKLOG_R1.md`. Fehlt Wissen, wird es recherchiert, als Regel in diese Seite gezogen und mit Gate und Kritiker-Kriterium versehen. Nichts bleibt optionaler Tipp.

## 5 · Pflege
- Nur WS0 schreibt diese Seite. Neue Regel = V-Nummer + Zeile hier + Prüfung (Gate oder Kritiker-Kriterium).
- Eine Quelle, die hier nicht steht, ist nicht verbindlich. Eine verbindliche Quelle, die hier fehlt, ist ein WS0-Fehler.


---

## Quelle: KONZEPT_ORTSBIOGRAFIE_UND_BAUSATZ_R1.md

# Konzept · Ortsbiografie, Szenen-Komposition und Worldbuilder-Bausatz · WSB · R1 · 2026-10-17

**Status: Vorschlag an WS0 (Georg 17.10. im WSB-Chat).** Ergänzt `SPEC_PLACEMENT_GRAMMAR_R2` und wiederholt keine Regel daraus.
- **Owner:** Laufzeit und Worldbuilder bei WS1/Lab, Blender-Bauteile bei WSB, Freigabe und Reihenfolge bei WS0.
- **Gilt zusammen mit:**
  - V-341 (Bühnen wachsen aus dem Boden);
  - V-396 (Schürze, Einsinken);
  - V-402 (Mesa-Grundrichtung, Bühnenpalette mit Rollen);
  - V-403 (gesprenkelte Übergänge, keine Verläufe);
  - V-404 (3D-Asset-Suche);
  - V-286 und V-305 (Meshy leicht tönen, Eigenbau volle Palette, OKLCH-Harmonie).

## 1 · Georgs Auftrag in einem Satz
Jede Szene erzählt, **wie der Ort entstanden ist, wie er genutzt wird, wie er verfällt und wie er bewachsen wird**. Das geschieht in cartooniger Sparsamkeit: wenige Materialcodes, wenige Signatur-Elemente, Rule of Three. Alles läuft über eine formale Verteilungslogik statt Handplatzierung.
- **Asset-Suche:** proaktiv nutzen, um Lücken und stimmige Ergänzungen vorwegzunehmen, z. B. die Palme etwas weiter weg oder den Übergang zwischen Biomen und Nutzungszonen.

## 2 · Ortsbiografie: vier Schichten, jede mit eigener Quelle und Richtung
Eine Szene wird in dieser Reihenfolge gedacht. Jede Schicht liest die vorige.

| Schicht | Frage | Quelle im Bild | Richtung der Verteilung | Bausteine |
|---|---|---|---|---|
| 1 · Entstehen (Geologie) | Woraus ist der Ort gemacht? | Grundgestein, Sockel, Mesa-Schichten (Cap → Body → Erosion Skirt, V-167) | von oben nach unten, schichtweise | Bühnen-Sockel, Felsen, Schichtkanten |
| 2 · Nutzen (Kultur) | Wer kommt hier wozu her? | Eingänge, Wege, Plätze | entlang der Wege, Abnutzung zur Mitte | Weg-Steine (dicht → Übergang → lose), Trittspuren, Requisiten |
| 3 · Vergehen (Verfall) | Was bröckelt ab, wohin rollt es? | Kanten, Ecken, Vorsprünge | hangabwärts, nach außen kleiner und seltener | Steinkit (Ringbänder §4), Ruinen-Passstücke |
| 4 · Bewachsen (Sukzession) | Was wächst wo zuerst? | Fugen, Schatten, Feuchte, Licht | aus Fugen nach außen: Moos → Gras → Büsche → Bäume weiter weg | Moos-Sprenkel, Gras-Büschel, Fluff-Träger, Palmen/Bäume als Rahmen |

**Regeln, die daraus folgen:**
- **Größe wächst mit der Zeit und dem Abstand.**
  - Moos sitzt in den Fugen der Bühne;
  - Gras im Band 0–2 m;
  - Büsche in 2–6 m;
  - Bäume und Palmen ab ≈ 6 m und nie direkt am Sockel. Sie rahmen die Bühne, statt sie zu verdecken.
- **Jede Schicht nutzt dieselben Operatoren** (`nest`, `stands`, `fall`, `relax`) und dieselben Zahlen: ungerade Mengen, Abstände um ≥ 30 % variiert, Negativraum ≥ 30 %.
- **Übergänge zwischen Biomen bzw. Nutzungszonen sind Sprenkel** (V-403), nie Linien oder Verläufe.
  - In beide Richtungen: Flecken von A wandern in B und umgekehrt.
  - Pflanzen dünnen in Gruppen aus, nicht in Reihen.

## 3 · Materialcodes und Signatur-Elemente (Sparsamkeit)
- **Ein Materialcode je Schicht und Ort:** z. B. Dschungel-Computer = heller Kalkstein + Moos + Lianenholz. Jedes Teil, das wir dazustellen, trägt einen dieser Codes, keinen neuen.
- **Signatur-Element:** pro Zone genau **eines**, höchstens dreimal sichtbar (1 Hero, 2 Echos). Abstände nach Rule of Three, z. B. der Steinstapel oder die Säulentrommel.
- **Farbe:**
  - Meshy-Dioramen werden nur leicht getönt (V-286);
  - alles Dazugestellte (Steine, Pflanzen, Requisiten, Weg-Steine) bekommt die **Bühnenpalette mit Rollen** (V-402):
    - Boden (Boden-Rolle);
    - Steine und Mauern (stone);
    - Holz (bark);
    - Pflanzen (grass/leaf);
    - Fluff (bloom/accent).
  - Die Töne kommen aus `ENV_ROLES` [hell, mitte, dunkel] bzw. `kfb-cartoon-palette.js fromColors(edgePalette)`.
  - Jedes Asset im Set hat dafür eine `role`.

## 4 · Szenen-Komposition mit der Asset-Suche (Ablauf je Diorama)
1. **Ortsbiografie lesen:** Material, Eingänge, Kanten, Licht- und Feuchteseite. Das kommt aus Bühnen-Deskriptor, `edgePalette`, `footprint`, `entrances[]` (vorgeschlagen).
2. **Lückenliste je Schicht:** was fehlt, was wäre die eine stimmige Ergänzung.
3. **Suche** (`3d-assets`):
   - nur Lizenzen mit kommerzieller Nutzung ohne Namensnennung, CC0 bevorzugt;
   - niedrige Polygonzahl bzw. stilisiert;
   - nie Kauf- oder PRO-Pakete in öffentlichen Dateien.
4. **Knete-Übertragung** in Blender: Voxel-Remesh + Glättung, Gruppen Stein für Stein. Dann normiert, Sohle, `role`, `weight`, Lizenzzeile.
5. **Set** je Diorama (`kfb.stage-set/1`, Vorschlag): Liste aus Steinkit-Auswahl + Pflanzen + Requisiten mit Rolle, Gewicht, Band, Signatur-Markierung.
6. **Probe** auf der Knete-Bühne (WSB, Skizze) → Abnahme im Spiel (WS1).
7. **Ablage:** gefundene Assets mit Lizenzangaben ins Repo, über WS0 (V-401: WS0 legt Merge-Anträge an). Kanonisch erst nach Aufnahme in die Asset-Bibliothek (V-404).

## 5 · Worldbuilder-Bausatz (perspektivisch, Georg: „im Worldbuilder haben“)
**Ziel:** Steinübergänge, Wände, Zellenstrukturen und Erhebungen direkt im Worldbuilder modellieren, mit Gizmo und skalierbar, ohne jedes Mal die Asset-Suche zu benutzen.

### 5.1 Stein-Pinsel
- **Werkzeug:** am Bühnenrand bzw. entlang einer Kante „malen“. Die Grammatik (Spec §4) setzt Gruppen aus dem Steinkit.
- **Schieber:** `density`, `spread`, `sinkBias`, `seed`, Band-Breite.
- **Weg-Pinsel** entlang einer Kurve: dicht gepflastert in der Mitte → Übergang → lose Streuung am Rand, aus den drei Quaternius-Gruppen.

### 5.2 Gizmo-Wände (`kfb.wall-kit/1`, Vorschlag)
- **Bauteile:**

  | Art | Teile |
  |---|---|
  | gerade | 1 m, 2 m |
  | Ecken | 90°, rund |
  | Enden | Endkappe, abgebrochen |
  | Sonstige | Pfeiler, Bogen, Treppe, Sockel |
  | Höhenstufen | 1, 2, 3 Lagen |

- **Skalierung:** Teile werden **wiederholt statt gestreckt**, wie ein 9-Slice in 3D. Die Ziegelgröße bleibt in jeder Länge gleich; Ecken und Enden sind feste Stücke.
- **Kanten:** rund und abgefast. Fugen als Mesh-Rillen, keine reine Textur, damit sie im Knete-Licht lesbar sind (wie die Mauerstücke im Steinkit).
- **Grundformen:**
  - CC0-Dungeon- und Burg-Bausätze als Ausgangsformen (Kenney Modular Dungeon/Castle Kit, KayKit Dungeon FREE; liegen im Repo);
  - in Blender in Knete übertragen, Ecken gerundet, dazu Verfalls-Varianten (abgebrochene Oberkante, fehlender Stein).
- **Verfall und Bewuchs:** dieselbe Grammatik. Abgebrochene Enden werfen Steinkit-Gruppen ab, in den Fugen sitzt Moos.
- **WSB baut die Teile** und das Datenblatt (Anschlusspunkte, Raster 0,5 m, Höhenstufen). **WS1/Lab baut das Gizmo.**

## 6 · Vorschlag Reihenfolge (WS0 entscheidet)
1. Steinkit v4 (Kiesel und Weg-Gruppen) fertig, Spec R2 → Register.
2. **Anschluss-Sets** für die bearbeiteten Dioramen: B7 + B8-Bühnen. Jeweils Recherche, Knete, Rolle, Probe.
3. B8 abschließen.
4. Wand-Bausatz R1 (Blender) + Datenblatt.
5. Spec R3 „Ortsbiografie-Schichten“ (formal, mit Zahlen je Schicht) nach Georgs Blick auf die Sets.


---

## Quelle: ETHERINGTON_REGELN_IN_ZAHLEN_R1.md

# Erdung und Komposition in Zahlen R2 · KFB-Arbeitsfassung nach Etherington Brothers

Stand: 2026-10-09 · Status: **R2 nach Recherche-Bericht P3** (`docs/research/NOTEBOOKLM_P3_ERDUNG_KOMPOSITION_METRIKEN_2026-10-09.md`). Übernommene Punkte sind mit **[P3]** markiert; die Zahlen des Berichts sind meist abgeleitet, nicht von Etherington, und gelten deshalb als Startwerte. Die Etherington-Brothers-Tutorials („How to Think When You Draw“) sind Bildtafeln. Dieses Dokument übersetzt die dort und in der Environment-Art-Praxis verbreiteten Prinzipien in überprüfbare Regeln mit Zahlenverhältnissen.

**Wie verbindlich ist was:**
- **[KFB]** sind Georgs Entscheidungen bzw. gemessene KFB-Werte; sie sind verbindlich.
- **[Prinzip]** sind allgemeine Kompositionsregeln, wie sie in Etherington-Tafeln und Environment-Art-Lehrmaterial vorkommen. Sie müssen gegen die Originale geprüft werden.
- **[Startwert]** sind vorgeschlagene Zahlen, die die Recherche bestätigen oder korrigieren soll.

**Wichtigster Satz [KFB]:** Zahlen sind die Untergrenze, nicht die Lösung. Zuerst kommt die Geschichte des Objekts (§00), dann die Physik, dann die Zahl. Eine Regel nur zu erfüllen gilt als Behelfslösung und ist ein FAIL.

---

## 1 · Die drei Erdungstechniken

| Technik | Was sie leistet | Umsetzung in KFB |
| --- | --- | --- |
| **Eingraben** | Das Objekt steckt im Boden statt darauf zu stehen | Fuß unter der Bodenlinie, Boden läuft an das Objekt heran (Erdkeil, Anlauf) |
| **Kontakt** | Objekt und Boden teilen Licht und Farbe | echter Schatten plus Sprenkel-Übergang am Fuß über Gewichte. **[KFB] Keine dunklen Ringe, Scheiben oder Verläufe** |
| **Überlappen** | Kleine Elemente brechen die Fußlinie | Gras, Krümel und Rubbel **mit Ursache**: Windschatten, Tropfkante, Abrollen. **[KFB] Keine Blümchenkränze** |

## 2 · Erdung nach Objektart

| Objektart | Geschichte bzw. Physik [KFB] | Einsinken [Startwert] | Boden am Fuß | Überlappen |
| --- | --- | --- | --- | --- |
| **Großer Fels / Findling** | schwer, liegt seit langem, auf seiner breitesten Seite zur Ruhe gekommen; Hauptachse folgt dem Hang, Schichtung entlang einer Bruchlinie **[P3]** | **25–45 % der Höhe** (P3: 20–35 %; KFB bleibt tiefer, Georg: „tief im Gelände“), bergseitig tiefer; Neigung zur Hangnormale ≤ 30° **[P3]** | Erdkeil bergauf (Boden staut sich an), Halde bzw. Geröll bergab | abgeplatzte Bröckel bergab, Gras im Windschatten; Größe ≤ 12 % des Felses |
| **Randfels (Inselkante)** | Teil des Inselkörpers, nie aufgesetzt | wächst aus dem Felsband, kein sichtbarer Fuß | Band rollt flach aus, Gelände läuft an | – |
| **Felsgruppe / Mesa** | Erosion: ein großer Block, Bruchstücke daneben, alle im gleichen Gesteinsverband ausgerichtet **[P3]** | 20–35 % (Mittelblöcke 15–25 % **[P3]**) | gemeinsamer Hügel | Bruchstücke in absteigender Größe |
| **Baum** | gewachsen: Wurzelanlauf | Stamm 5–10 % | Wurzelhügel mit Radius **1,3–1,6 × Stammradius**, Erde dunkler unter der Krone über Sprenkel | Gras auf der Schattenseite unter der Tropfkante; Fallobst bzw. Fluff bergab in Mulden |
| **Busch** | wächst aus dem Boden, Zweige hängen bis zur Erde | 5–12 % | Zweige berühren den Boden; feuchte, dunklere Erde darunter über Sprenkel | Gras schiebt sich unter dem Rand hervor |
| **Grasbüschel** | wächst in Gruppen, nicht einzeln | Basis vollständig im Boden | – | Gruppen von 3–7, Größen gestaffelt |
| **Gebäude** | gebaut: Fundament bzw. Sockel | Sockel sichtbar, 0,05–0,15 H hoch | Trampelpfad und abgenutzter Boden vor Türen über Sprenkel | Kisten, Fässer und Zaunecken mit Funktion |
| **Requisit** (Fass, Kiste) | abgestellt, benutzt | 2–5 % | – | in Funktionsgruppen (Markt, Werkstatt) |
| **Weg / Platz** | getreten bzw. gebaut | – | Sprenkelübergang; freie Enden durch Verfall gerundet | Rubbel aus dem Wegmaterial |
| **Wasserufer** | Wasser formt das Ufer | – | Sand- bzw. Kiesband über Sprenkel, Uferabstand 0,6–3,4 (R2D, × Maßstab) | Kiesel, Schilf an ruhigen Stellen |

## 3 · Gruppierung und Größen

| Regel | Zahl | Herkunft |
| --- | --- | --- |
| Ungerade Gruppen | 3, 5 oder 7 Elemente; nie 2 gleich große nebeneinander | [Prinzip] |
| Groß, mittel, klein, mikro | Verhältnis etwa **1 : 0,6 : 0,35 : 0,15**; die Mikro-Ebene ist Rubbel, Kiesel, Fallobst mit Ursache **[P3]** | [Prinzip, Startwert] |
| Rule of Three (KFB) | Anker 1,2–1,4 × Rollenhöhe, drei Stützen 0,7–0,9, Füller, ein Akzent | [KFB] |
| Abstände | nie gleichmäßig; benachbarte Abstände unterscheiden sich um ≥ 30 % | [Prinzip, Startwert] |
| Kein Raster, keine Reihe | ≤ 2 Elemente auf einer Geraden | [Prinzip] |
| Varianz in der Platzierung | Drehung frei, Skalierung ± 15 % innerhalb der Rolle | [KFB] |
| Freifläche | ≥ 30 % jeder Insel bleibt frei (Negativraum) | [KFB] |
| Landmarke | immer das höchste Element; Bäume im Blickkegel ≤ 60 % ihrer Höhe | [KFB] |
| Kits | nie zwei Kits in einer Gruppe | [KFB] |

## 4 · Silhouette und Lesbarkeit

| Regel | Zahl | Herkunft |
| --- | --- | --- |
| **Tangenten vermeiden** | Konturen berühren sich nicht genau. Entweder überlappen sie deutlich (≥ 15 % der kleineren Form) oder sie haben Luft (≥ 25 %). Im Bildraum der Prüfkameras: Abstand zweier Umrisse nie zwischen 0 und **5 px** **[P3]** | [Prinzip, Startwert] |
| Überlappen für Tiefe | vorne, mitte und hinten je Szene; jede Gruppe überlappt mindestens eine andere | [Prinzip] |
| Silhouette | jedes Objekt ist als Schattenriss erkennbar; keine gleich hohen Kanten nebeneinander | [Prinzip] |
| Formwiederholung | gleiche Form höchstens 3 × im selben Bildausschnitt ohne Variation | [Prinzip, Startwert] |
| Wertkontrast | Landmarke und Hauptfigur heben sich am stärksten ab; Füller sind ruhig | [Prinzip] |
| Bildung von Ecken | Stellen, an denen Elemente zusammenstoßen, brauchen Überdeckung oder Rubbel, nie eine bloße Linie | [KFB §01] |

## 5 · Environmental Storytelling

- **„Was ist hier passiert?“** Jede Gruppe erzählt eine kleine Geschichte: Wer war hier, was ist übrig geblieben? Beispiele aus Georgs Vorgaben: Wer angelt da, wer hat da gecampt, warum steht der Limonadenstand an der Oase?
- **Ursache vor Ort:** Fallobst liegt unter und bergab vom Baum, Rubbel liegt vor der Ruine, Trampelpfade führen zu Türen, Schnee liegt im Schatten und in Mulden.
- **Comic-Closure (McCloud):** Andeuten statt ausbuchstabieren. Eine Zaunecke statt eines ganzen Zauns, ein halb offener Raum statt eines ganzen Hauses.
- **Sparsamkeit:** lieber eine starke Szene als ein Katalog.

## 5b · Platzierung nach Ursache [P3]

| Ursache | Regel | Umsetzung |
| --- | --- | --- |
| Schwerkraft | Fallobst, Fluff, Geröll wandern vom Mutterobjekt hangabwärts und bleiben in flachen Stellen liegen | Drift entlang −∇h, Halt bei kleinem Gefälle; Dichte fällt mit e^(−λd) vom Ursprung |
| Mulden | Schnee, Laub, Wasserpflanzen sammeln sich in Senken | Dichte nach Geländekrümmung (Mulde > 0) |
| Gruppen | Anker zuerst, Begleiter im Ring um ihn, Mikro-Details zuletzt | Parent-Child mit Poisson-Disk (Mindestabstand je Kategorie), Begleiter gaußförmig ausgedünnt |
| Komposition | Vorlage (Demo-Szene bzw. Story-Stamp) setzt die Szene, Streuung bricht nur die Außenkanten | Stamps an Ankerpunkten, danach Poisson-Streuung |

## 5c · Bewusst nicht übernommen aus P3

- Übergänge Fels ↔ Boden per Alpha-Verlauf oder Decal (verstößt gegen §01; bei uns `kfbLayer`-Sprenkel).
- Grasring um jeden Busch (das ist der abgelehnte „Blümchenkranz“).
- Meterangaben für Sockel, Korridore, Abstände (K2 kennt keine Meter; Umrechnung nur über H und MC).
- Stamm-Torsion und Wurzel-Zusatzmeshes (Kit-Modelle werden nicht verformt, „kein Kneten“).

## 6 · Prüfung

**Automatisch** (Tests siehe `QA_RULEBOOK_ENVIRONMENT_R1.md` §2b):
- kein Fuß über dem Boden;
- Einsinken je Objektart im Band;
- keine zwei gleich großen Nachbarn;
- Abstandsvarianz ≥ 30 %;
- Tangenten-Check im Bildraum aus den Prüfkameras;
- Freifläche ≥ 30 %;
- Landmarke ist das höchste Element.

**Kritiker:**
- Erdung (K4);
- Weltlogik (K9 ≥ 7);
- aus drei Kameras: Auge in 1 H vom Hang abwärts, Fuß nah, 45° von oben.

**Georg:** PASS, TUNE oder FAIL.

## 7 · Offene Fragen für die Recherche

1. Stimmen die Startwerte mit den Etherington-Tafeln überein, besonders Größenverhältnis, Einsinktiefe, Tangenten und Gruppengrößen?
2. Welche weiteren Etherington-Regeln für Felsen, Bäume und Wasser fehlen hier, etwa Bruchkanten, Schichtung oder Wurzeln?
3. Wie setzen stilisierte Spiele das prozedural um, ohne dass es nach Streuung aussieht? Gesucht sind Poisson-Disk mit Gruppenregeln, Platzierung nach Ursache und Hand-Authoring mit Vorlagen.


---

## Quelle: MENTALES_MODELL_WELT_R3.md

# Mentales Modell Welt R3: cartoonige Verteilungslogik und Materialcodes (Georg 25.10.)

Grundlage, diesmal angesehen bzw. gelesen:
- **Kanon:** KONZEPT_ORTSBIOGRAFIE_UND_BAUSATZ_R1 §2–§3; CANON_3D Gebiete 3 und 6; V-565.
- **Farben:** die eingelockten Joyride-Paletten mit Rollen (canyon, bucht, otown; V-051, V-270, COLOR_HARMONY_R1 / V-305).
- **Krazy Kat (Herriman):**
  - 10 gemeinfreie Seiten, 1916–1941 (Wikimedia Commons);
  - Watterson über Herriman (Paris Review 2022).
- **Looney Tunes (Maurice Noble, Layout; Hintergrundmalerei DeGuard):**
  - Road-Runner-Hintergründe (richardnilsen.com, 11/2023);
  - Noble im Animato-Interview 1991 (harrymccracken.com);
  - 99% Invisible, Folge 85.
- **Art Lozzi (Hanna-Barbera):** 7 Hintergründe und Pans (Yowp-Blog), darunter „Wooin' Bruin“.
- **Calvin & Hobbes:** Die Spiff-Seiten im Fandom-Wiki liegen nur als Vorschaubilder vor, die Originale sperrt Cloudflare. Ich habe sie nicht in brauchbarer Größe gesehen. Sie fehlen hier, bis Georg Seiten bereitlegt.

## Was die Bilder zeigen

**1. Ebenen statt Streuung (Lozzi, Noble).**
- Die Welt besteht aus wenigen, sich überlappenden Bodenebenen: Vordergrund-Bank, Hügel im Mittelgrund, Berge hinten, Himmel.
- Jede Ebene hat eine flache Farbe aus ihrer Rolle und eine dunklere, flache Schattenform.
- **Elemente sitzen an den Kanten der Ebenen**: Blumen an der Bankkante, Tannen als Silhouettenreihe auf dem Grat, Bäume als Rahmen am Bildrand.
- Das Innere einer Fläche bleibt ruhig und trägt nur ein sparsames Bodenzeichen: Gänseblümchen-Tupfen, Striche, Punkte.

**2. Materialcode = festes Zeichen je Material, überall gleich.**
- **Fels (Noble):** facettierte Flächen in 2–3 flachen Tönen plus feine Schichtlinien in dunklerem Ton.
- **Fels (Herriman, laut Watterson):** Berge tragen Streifen, Mesas Punkte.
- **Rinde (Lozzi):** Tupfen. **Busch:** dunkle Masse mit Kritzellinie. **Felsblock:** Sprenkel.
- **Boden:** sparsame Punkte oder Striche.
- **Gras:** kleine Büschel-Zeichen, nur am Fuß von Dingen und Figuren (Herriman). Es gibt keine Grasfelder aus Einzelhalmen.
- Ins Knet-3D übersetzt, ist der Code die Formsprache des Materials (Facette, Schichtwulst, Tupfen-Relief) plus seine drei Rollentöne aus der Palette.

**3. Wenige Dinge, große Sprünge, viel Leere.**
- Je Blick 1 Hauptformation, 1–2 Nebenformationen, 0–3 Kleinteile.
- Mindestens 50 % bleiben ruhiger Boden und Himmel. Noble: „create the spaces by shapes … not clutter“.
- Größensprünge etwa 1 : 0,4 : 0,1, nie gleich große Nachbarn.

**4. Verfall hat einen Ort.** Bruchstücke liegen nur am Fuß ihrer Formation, auf der Überhang- bzw. Hangseite, in Gruppen von 1–3, groß nach klein. Nie verstreut auf der freien Fläche (Noble: Road Runner 13).

**5. Bewuchs ist Zeichen, nicht Masse.**
- Vorn stehen einzelne ikonische Pflanzen oder Dreiergruppen mit Größenfolge: ein Baum, ein Busch, ein Kaktus.
- In der Ferne wird Bewuchs zur Silhouettenreihe auf der Gratlinie.
- Dichte Wälder gibt es bei Herriman und Noble nicht. Bei Lozzi ist Wald eine Silhouettenreihe auf der hinteren Ebene.

**6. Signatur-Motive kehren wieder.** Bei Herriman der Baum im Mustertopf, der Mond und das Gefängnis; bei Noble die Straße, die Klippe, der Kaktus. Das deckt sich mit unserer Ortsbiografie: 1 Hero plus 2 Echos je Zone.

**7. Farbe trägt die Ebenen.**
- Komplementär-Spannung zwischen Formation und Grund: Rot gegen Cyan, Gelb gegen Blau.
- Warm und satt vorn, kühl und blass hinten.
- Bei uns kommen alle Töne aus den Joyride-Paletten mit Rollen: Boden, Stein, Rinde, Laub, Akzent.

**8. Surreal bleibt lesbar.** Horizont, Weg und Anker bleiben fest. Formationen und Palette dürfen von Ort zu Ort wechseln: „the formula never changed, but the desert did“.

## Zusammen mit der Ortsbiografie (Kanon)

Der Ort entsteht aus Quellen, und jede Schicht liest die vorige:
1. **Entstehen:** Formationen an Geländebrüchen, mit Felscode.
2. **Nutzen:** Weg oder Platz als Bodenfarbe, Abnutzung zur Mitte.
3. **Vergehen:** Bruchstücke am Fuß, hangab, nach außen kleiner.
4. **Bewachsen:** aus Fugen und Kanten nach außen: Moos, dann Gras (0–2 m), dann Büsche (2–6 m), dann Bäume (ab 6 m, rahmend). In der Ferne stehen sie als Gratreihe.

Alles trägt einen der 2–3 Materialcodes des Ortes, in den Rollentönen der Joyride-Palette.

## Was das für unser Stilbild heißt

- Die Waldmassen aus dem Rauschfeld sind falsch.
- **Bewuchs:**
  - vorn als Zeichen an Kanten;
  - Wald nur als Silhouettenreihe auf Graten und Ebenenkanten;
  - Größenfolge vom Ursprung weg.
- **Boden:**
  - Ebenen und Flächen in Rollenfarben, die Fließbänder bleiben die Bodenmalerei;
  - Flächeninneres ruhig, nur ein sparsames Bodenzeichen.
- **Fels:** wenige Formationen mit festem Code (Facette plus Schichtlinie), Bruchstücke nur am Fuß.
- **Props:** Rollentöne aus der Joyride-Palette, keine Kit-Farben.


---

## Quelle: EINARBEITUNG_WS1_R1.md

# Einarbeitung WS1-Recherchen in den 3D-Kanon · R1 · 2026-10-20 · Vorlage für WS0

**Status: VERBINDLICH als Kanon-Anhang A (V-570, WS0 20.10.).** Jede Zeile Ü1–Ü30, Abschnitt 2 (Gate-Werte), 4 (Georgs Feedback) und 6 (Nicht übernehmen) gilt.

**WS0-Abweichungen:**
- **Abschnitt 4 Nr. 14 („Banden“) gilt NICHT.** Es gilt V-569: #439 ohne Banden- und Rampen-Geometrie. „Banden“ im Kanon meint nur die bestehenden J17-Streckenbanden (V-102); neue Geometrie gibt es nur nach Georgs Bild.
- **Abschnitt 5:** `value_plan`, `surface_plan`, `stamps`, `foreground_mass`, `edge_accents`, `color_key` und `interaction_points` sind Pflicht ab der nächsten Runde der Konzeptblätter (R2); in R1 empfohlen.
- **W12:** Kiesel `stone_S` dürfen bis 35° kippen; Anker und Stützen bleiben bei ≤ 12° (Grammatik R2 §4.4 eingeschränkt).
**Quellen** (`S/WS1_…`):
- R1 Inszenierung, R2 Etherington-Abgleich, R3 Set-Dressing, R4 Farbtheorie;
- R10 Cartoon-Hintergründe, R11 3D-Farbe/Licht, FG Flächengrammatik;
- **GF** = Georgs Look-Feedback 20.10., bindend.

**Zeichen:**
- [S] Startwert, kalibriert an der Musterregion (V-568).
- [I] Invariante, Verstoß = FAIL.
- TUNE = Befund ohne FAIL.

**Werkzeug:** R1, R4, R10 und R11 schlagen jeweils eigene Bild-Gates vor. Daraus wird **ein** Modul `lib/kfb_view.py`:
- Es misst auf den Renders von Spielkamera und Kritiker-Kameras, mit ID-, Tiefen- und Normalenpuffer, Schatten- und Linienmaske.
- Datenprüfungen bleiben in `kfb_env`.
- Jede [S]-Grenze ist TUNE, bis sie an 10 PASS- und 10 FAIL-Bildern geeicht ist (V-411).

## 1 · Übernehmen

| # | Geb. | Kanon-Wortlaut (Vorschlag) | Quelle | Prüfung |
|---|---|---|---|---|
| Ü1 | 2 präzisiert | Felsgruppe: eine gemeinsame Lehnrichtung (±15° [S]) mit genau 1 Ausnahme (25–45°). Ein eiförmiger Stein liegt auf dem breiten Ende, größter Querschnitt in den unteren 40 % [S]. | R2 N1/N2 | Gate G3 (Export `lean_az`); Mesh-Profil `kfb_env_bpy` |
| Ü2 | 2 | ≥ 20 % der `stone_S` stehen schräg (> 15°) oder hochkant [S]. ≤ 1 Schlüsselstein je Steingruppe. | R2 N6 | Gate G4; K4 |
| Ü3 | 2 | ≤ 3 Primärformen je Gruppe (Primärform = ≥ 10 % der Silhouette). Keine zwei Elemente innerhalb ±10 % Höhe [S]. Jede Gruppe hat eine eigene kleine Staffel aus Vorder-, Mittel- und Hinterteil. | R2 N5/N12, R10-12 | Gate G5/G8; K3 |
| Ü4 | 2 | Hangbäume lehnen sich mit 20–40 % des Winkels zur Hangnormale [S], Nachbarstämme sind ≥ 20 % verschieden dick. Knet-Bäume zeigen 3–5 Hauptwurzeln, die einem Fels folgen. Kit-Bäume werden nur gedreht. | R2 N7/N8 | Gate G6; K4 |
| Ü5 | 2 präzisiert (Kranz) | Gras zeichnet die Form am Fuß nach. Es deckt ≤ 50 % des Fußumfangs, die längste Lücke ist ≥ 25 % [S]. Büschel sind nach Wind oder Hang gerichtet. | R2 N9 | Gate G7 (Skizze) |
| Ü6 | 2/12 | **Freiraum um den Fokus:** Im Ring 0,5 × r(Landmarke) steht ≤ 1 Objekt der Klasse M oder größer. Interaktionspunkte haben 1 H frei. Die freien Teilflächen sind ungleich, die größte ≥ 2 × die zweitgrößte. Im Bildring 0,25 × Fokus-Diagonale bleibt jedes Element unter 50 % des Fokuskontrasts [S]. | R2 N10, R1-14, R3-12 | Gate H12 (Skizze); View |
| Ü7 | 2 | Eine Tangente ist nur erlaubt, wenn `focal.tangent` sie benennt; höchstens 1 je Szene. | R2 R4 | Ausnahme im Tangententest |
| Ü8 | 2/5 | **Streckenrand:** Elemente neigen 5–20° mit Ursache. Gleichartige passieren höchstens 6 × pro Sekunde [S], die Wiederholperiode ist ≥ 3 Bildbreiten. ≥ 60 % des Detail-Budgets liegen dort, wo die Kamera unter 50 % ihrer Höchstgeschwindigkeit fährt. | R10-15/29/30 | Strecken-Export; Spieltempo-Pass |
| Ü9 | 3 | **Story-Stamp:** Kette aus 2–4 Ereignissen, jedes Requisit gehört zu genau einem Glied. 3–7 Requisiten, keine Füller. 1 Schlüsselrequisit. Ein Glied fehlt sichtbar, der Akt selbst wird nicht gezeigt. Dazu `premise_ref` und ≥ 1 `requires`, höchstens 1 × je Insel, gleiche Mikro-Stamps ≥ 2 MC auseinander. Nichts, was die Welt nicht kann. | R3-02…07, -16…18 | Gate S6/S7; K9 |
| Ü10 | 3 präzisiert (Signatur) | **Gesetz der Drei:** Die Kernaussage steht in ≥ 3 Trägern **verschiedener** Typen: Requisit, Bodenspur, Bauzustand, Bewuchs, Figur, Praktikal. | R3-06 | S5 + `carrier_type` |
| Ü11 | 3 | **Funktionsgruppe:** 1 Anker + 2–4 Werkzeuge oder Behälter + 1–3 Spuren, ≥ 70 % aus einer Materialfamilie [S]. Gerichtete Requisiten zeigen zu Arbeitspunkt, Weg oder Aussicht, nie in Wand oder Hang. | R3-10/11 | Gate S8 |
| Ü12 | 3 präzisiert | **Verfall folgt der Physik:** ≥ 70 % des Bewuchses liegen auf der Schatten- bzw. Wetterseite oder in Fugen [S]. Wasserschaden nur bis 0,3 H oder unter Tropfkanten. Je Pflanzengruppe ≥ 1 Element „Vergehen“. Spurenkette mit ≥ 3 Gliedern, fallenden Abständen, das letzte ≤ 2 H vor dem Ziel. Das Signatur-Requisit eines Residents kehrt in ≥ 2 Szenen wieder. | R3-13…15, R2 N13 | S4 erweitert; K1 |
| Ü13 | 3/K1 | Ort und Funktion sind in ≤ 15 s lesbar. ≥ 4 von 6 Story-Fragen sind sichtbar beantwortet. Stamps mit Spielbezug sind eindeutig (3/3 Läufe). Das Schlüsselrequisit ist ≥ 20 px@1080 groß, ΔL\* ≥ 15 [S]. | R3-01/08/09/21 | K1; View |
| Ü14 | 5 präzisiert | **Felsen** (GF §2): Formationen verjüngen sich nach oben, Basis ≥ 1,2 × Spitze [S]. Schichten wechseln Dicke (≥ 30 %) und Winkel (3–10°). Aufbau: Grundkörper + 2–4 Lappen, die sich 30–60 % überlappen, Rundung nach Form-DNA. Nur die Landmarken-Mesa darf kopflastig sein: Cap ≥ 1,2 × schmalste Stelle, Hals ≤ 0,6 × Cap [S], höchstens 1 Wackelstein je 3 Mesas, nie über der Fahrbahn. | R2 N3/N4, R10-10/14 | Mesh-Profil; K7 |
| Ü15 | 5/17 präzisiert | **Wertordnung nach Neigung:** Himmel > waagrecht > geneigt > senkrecht, ≥ 6 L\* je Stufe [S]. Die Wand trägt dasselbe Farbfeld wie die Fläche, nur dunkler, ohne harten Wechsel (GF §1). | R1-07 | View (Normalen) |
| Ü16 | 6 | Die 3 Töne einer Rolle liegen ≥ 10 L\* auseinander. **Gamut-Maske** = konvexe OKLab-Hülle der Zonenrollen; ≥ 95 % der bunten Pixel liegen in Hülle + 10 % [S]. Das ist Palettentreue, keine Sperre. Mittelgrau (C < 0,02, 0,45 < L < 0,65) ≤ 5 % des Bildes, ausgenommen die Fahrbahn. | R10-17, R4-08/13 | M3 Daten + View; schließt Lücke Gebiet 6 |
| Ü17 | 6 | Gemessen wird an Daten **und** Render. Weicht eine Rolle um > 5 L\* oder > 0,03 C ab, ist das ein Tonweg-Befund. Je Route ein Colour-Script-Streifen. Je Kamera bzw. Zone ein Farbkey im Engine-Render, abgenommen **vor** dem Asset-Pass. | R4-09/15, R10-18/32 | View; K0; K2 |
| Ü18 | 7 präzisiert (V-564) | Jede Rolle hat ein **Quartett**: Licht, `castShadowTint`, `contactDepthTint`, `edgeAccentTint`. Abgeleitet aus dem Empfänger: ΔL\* bei Figur −12…−18, Terrain −18…−24, Fels −22…−28 [S]; \|Δh\| ≤ 20° zur Schattenrolle; C 0,8–1,15 × (nie unter 0,3 ×). Gleiches Licht-L\* ergibt gleichen Schattensprung (±5). | R11-01…03/25 | Daten T1 (fehlende Rolle = FAIL), T7 |
| Ü19 | 7 präzisiert | Schatten: Tag L\* ≥ 15, Nacht L-6. Überlappung über `max` (±3 L\*). [I] kein Schatten mit C < 0,02 bei L\* < 20. ≤ 2 Töne je Material + 1 Kontaktstufe. Terminator ≤ 2 px, Wurfkante ≤ 3 px@1080 [S]. Keine Schatteninseln < 0,5 %. Gesichter mit geglätteten Normalen. | R4-11, R11-05/11/15…17 | View; Proof G6 |
| Ü20 | 7 | [I] Jeder Akteur wirft in Tag, Gold und Nacht einen echten Schatten; im Szenengraph kein Kapsel-, Decal- oder Blob-Objekt. Praktikals in 2–3 Ringstufen. Bounce nur im Schattenton (Hemi-Boden = `edgePalette`). Für alle Klassen eine Toon-Antwort. | R11-13/19/24/29 | Szenengraph; K6 |
| Ü21 | 5 (3) präzisiert | **Kantenakzent (Color Hold).** Nur an vier Kantenarten: Silhouette gegen die Ferne, Überdeckung, Schattenseite, echter Bruch (Dieder ≥ 40° [S]). Nie an Farbgrenzen, Fugen oder im Hintergrund. Auf der Lichtseite ≤ 20 % der Akzentlänge. Insgesamt ≤ 25 % der Kandidatenkanten und ≤ 1,5 % der Pixel. Farbe: dunklere Schwester der Fläche, \|Δh\| ≤ 15°, ΔL\* 20–35, C 0,6–1,0 ×, L\* ≥ 15 [S]. Breite 1–3 px@1080, schwankend, spitz auslaufend, Lücken auf der Lichtseite. Ab 3 × Fokusabstand ausgeblendet. Flackern ≤ ±20 %. Umsetzung als `kfb-clay`-Rolle, kein Inverted Hull. Knet-Figuren ohne Umriss. | R10-05…08, R11-06…10/21 | View; [I] schwarzer oder grauer Akzent |
| Ü22 | 8 | **Ein Fingerspur-Maßstab:** Die Textur-Wellenlänge aller Profile bleibt innerhalb von Faktor 2 zu H [I]; Hauptkorn 0,01–0,03 H [S]. Alle Profile tragen denselben Signatur-Layer, auch VFX. | R10-35/36 | Profil-Daten |
| Ü23 | 8 | **Material-Mix nur als Knet-Profile:** ≤ 4 Profile mit je ≥ 3 % Fläche, das dominante ≥ 50 % [S]. 3–5 Textursignaturen. Kritiker-Checkliste: Detailstufe, Maßstab, Lichtantwort, Grund; Prüffrage „auf dem Basteltisch knetbar?“ | R10-24/33/34/37/39 | Material-ID; K6 |
| Ü24 | 8/17 | **Textur ändert den Wert nicht:** Marken liegen ΔL\* ≤ 8 vom Grund, heller und dunkler gemischt, Deckung 15–45 %. Der Grundton bleibt auf ≥ 50 % sichtbar, im 3-Werte-Bild liegen ≥ 85 % in einem Cluster. Marken ≥ 2 px. Detail sitzt im Terminator-Band. Ruhige Fläche neben aktiver (≥ 2 ×). | R10-25…28, R11-18 | View |
| Ü25 | 12 (füllt Lücke) | Je Kamera 1 Fokus und ≤ 2 Akzente. Kompositionstyp aus einer Liste; die Spielkamera nutzt „Mittelgrund-Fokus“. Fokusfläche 4–15 % (Übersicht) bzw. 2–10 % (Spiel) [S]. Fokus in der Safe-Zone (3,5 %), nie unter dem HUD. Drittel und Leitlinien bewertet nur der Kritiker. | R1-01…04/10/11 | View; K3 |
| Ü26 | 12/16 präzisiert | **Wertmassen:** 3 Gruppen, Zentren ≥ 15 L\* auseinander, eine > 50 %, keine < 8 %. Fokus-Kontrast ≥ 1,5 × Median (ein Gate für R1 und R4). Fokus-Umriss zu ≥ 30 % mit ΔL\* ≥ 20 [S]. | R1-05/06/12, R4-01/02/04 | View |
| Ü27 | 12/16 präzisiert | **Tiefe:** Vordergrund ≤ 15 % der Fläche, an ≤ 2 Rändern, verdeckt ≤ 10 % des Fokus. Hintergrund ≤ 60 % Kontrast und ≤ 50 % Kanten des Mittelgrunds. Nachbarebenen ≥ 10 L\* auseinander oder anders in Form bzw. Textur. Himmel L\* 70–90, Spanne ≤ 15, ≤ 2 Wolken, Anteil 10–35 %. Nur über Rollen, Detail und echten Schatten. | R1-08/09/15/24, R4-03, R10-13/22 | View |
| Ü28 | 12 | Landmarke aus ≥ 3 von 4 Kameras sichtbar und einzigartig (Masken-IoU < 0,6). Spielflächen sind am ruhigsten (Kanten ≤ 0,5 × Ring). [I] keine DOF, kein Tilt-Shift, keine Vignette, kein Screen-Gradient. Kritiker-Kamera 1 auf 35° statt 45°. | R1-13/16/17, R10-16 | View; CRITIC |
| Ü29 | 15 präzisiert | **Terrain reagiert:** Die Streudichte im Ring 0,5–1,5 H nimmt in Stufen und mit Ursache ab, nie als Kranz. Vor Türen bleiben ≥ 0,3 H frei. Kantendichte der Szene 0,7–1,5 × Terrain [S]. Bauen in der Reihenfolge Sockel → Einsinken → Übergang → Streuung → Story. | R1-20…22 | View; Ringdichte |
| Ü30 | 16 präzisiert | Je fester Kamera ≥ 1 Lebensanker mit Zyklus ≥ 2 s. K2-Haltung nach Mary Blair: Kühne Farbe ist erlaubt, wenn der Wert trägt. Neue Fragen K2a–f (R4). | R10-31, R4-14 | Export; K2 |

**Gate-Skizzen (`kfb_env.gate`):**
```python
# G7 Graskranz (N9): Winkellücken der Grasbüschel um den Fuß
a = sorted(math.degrees(math.atan2(q['c'][1]-o['c'][1], q['c'][0]-o['c'][0])) % 360
           for q in objs if 'grass' in (q.get('kind'), q.get('what')) and _d2(q['c'], o['c']) <= 1.3*o['r'])
if a and max(b-x for x, b in zip(a, a[1:]+[a[0]+360])) < 90: find.append(f"G7 {o['id']}: Graskranz")
# H12 Freiraum um den Fokus
M = 0.35*max(o.get('h', 0) for o in env)
if sum(1 for o in env if o is not lm and o.get('h', 0) >= M and _d2(o['c'], lm['c']) <= 1.5*lm['r']) > 1: F('H12', 'Freiraum um Fokus')
# S6 Stamp
for s in scene.get('stamps', []):
    p = s.get('props', [])
    if not (2 <= len(s.get('chain', [])) <= 4 and 3 <= len(p) <= 7 and sum(bool(x.get('key')) for x in p) == 1
            and all(x.get('chain_step') for x in p) and s.get('requires') and s.get('premise_ref')): F('S6', s.get('stamp_id'))
```

## 2 · Gate-Werte

**R2-Grundbefund:** Etherington nennt keine Prozente. Belegt sind nur:
- Abstand 2 : 1;
- 3 Größen;
- ≤ 3 Primärformen;
- 5 Tiefenstufen;
- 8 Landmarken-Typen.

Alle `SINK`/`RULES`-Prozente sind deshalb KFB-Startwerte und werden so etikettiert. „Ungerade Gruppen“ ist ein allgemeines Prinzip, keine Etherington-Regel.

| Schlüssel | alt → neu | Grund |
|---|---|---|
| `SINK['stone_L']` | 0,45–0,60 → **0,40–0,50** | Georg stimmt zu (GF §2). Über 0,50 kehrt sich der umgekehrte Eisberg um. |
| `SINK['rock']` | 0,25–0,45 → **0,40–0,50** | GF: „Findling 40–50 %“; `rock` ist laut R2 der Findling. |
| `SINK_CAP` neu | **0,50** [I] für `rock`, `rockgroup`, `stone_*` | Kappe ≤ 50 % (GF). |
| `RULES['size_tol']` | 0,10 → **0,20** [S] | Eine halbe Größenstufe; 10 % sieht aus der Spielkamera gleich aus. Gleichzeitig in `grammar.js` ändern. |
| `RULES['spread']` | FAIL bleibt bei 0,30; neu TUNE `spread_tune` 0,45, Ziel `spread_target` 0,50 | 2 : 1 ist die einzige belegte Zahl. `nest()`-Test: Mittel über 50 Seeds ≥ 0,45. |
| neue Schlüssel | `lean_tol` 15, `lean_exc` (25, 45), `pebble_tilt` (15°, 0,20), `grass_gap` 0,25, `primary_max` 3, `height_tol` 0,10, `focal_ring` 0,5, `interact_free_H` 1,0, `tree_lean` (0,2, 0,4) | Ü1–Ü7 |
| unverändert | übrige `RULES`, `NEST`, übrige `SINK` | kein Widerspruch in der Quelle |

**Abgelöst:** Grammatik R1 §4 („5–15 % für alles“, dunkler Ring am Fuß).
**Landmarke:** „höchstes Element“ bleibt Default. Die 8 Typen (`landmark_type`) kommen nur nach Georgs Entscheid.

## 3 · Widersprüche (Georg und Register gelten)

| # | Konflikt | Empfehlung |
|---|---|---|
| W1 | Rim-/Gegenlicht, Figuren-Rim, Lichtvektor je Figur (R11-26/28/30) ↔ V-392, V-564 | Nicht übernehmen. Stattdessen Silhouette-Rescue, Wertabstand und dunkler Color-Hold-Akzent. |
| W2 | Blau/Grün-Sperre (R10-37), harte Sättigungsgrenze (R4-05), ≤ 3 Farbfamilien (R4-07, R10-19), Laub in „bucht“ dämpfen ↔ V-565 (einzige Grenze Chroma ≤ 0,195), J17 Gold (V-174) | Nur als Kritikerfrage bzw. TUNE, nie FAIL. Lila Gras bleibt erlaubt, „bucht“ bleibt. |
| W3 | Kühle Schatten (R4-11), Gooch warm/kalt ↔ V-564 Empfänger-Tönung | Nur „nie schwarz“ übernehmen. |
| W4 | Erfundene bzw. gemalte Schatten und Licht, Kapsel- und Decal-Schatten (R10-04, R11-04/13/27) ↔ V-564 echte Schatten | Nicht übernehmen. Erfunden werden darf nur die Ursache. |
| W5 | Vordergrund-Tonmasse in der Albedo (FG-9, R10-01) ↔ M2, V-564 (Höhe nie Farbe) | Palettenrolle `foregroundValue`: weltfest, nur feste Kameras, höhenunabhängig, in der Albedo-Ansicht erklärt. Ein Schatten darauf dunkelt höchstens 8 L\* nach, Ergebnis L\* ≥ 15. M2 bekommt diese Ausnahme ausdrücklich. |
| W6 | Mesa, Stamps, Komposition, Akzente, Palette ↔ RA 1:1 (K8) | Bei RA-Quellen nur über Terrain, Knet-Oberfläche und Kamera; das Original bleibt 1:1. |
| W7 | Dunkler Fußkontakt (GF, R11-11) ↔ contactAO „ohne dunkle Ringe“ (LIGHT_MODEL_R2, V-011) | Georg gilt: schmale, harte Stufe, kein weicher Ring. |
| W8 | Nachts L\* ≥ 15 (R4-11, R11-11) ↔ L-6 (L ≥ 8) | Register gilt: am Tag 15, nachts L-6. |
| W9 | Tiefennebel und X-Toon-Rampe (R4-03, R11-20/22) ↔ ein Tonweg (V-385); V-444 nur am Horizont | Nebel nur am Horizont in der `sky`-Farbe. Die Rampe nur nach A/B vor Georg. |
| W10 | Kanon 5 (2) „Domain-Warping-Feld“, 17 (3) und V-568 „Zungen“ ↔ GF §1 | Kanon korrigieren (4.1). |
| W11 | Spielbrett mit `edge3.jpg` (GF §4) ↔ Kanon 15 (3) fremde Textur | Als markiertes A/B-Experiment erlaubt, erst wenn die Übergänge sauber sind. Kein Kanon ohne Georg. |
| W12 | Kiesel bis 35° (R2 N6) ↔ Grammatik R2 §4.4 ≤ 12° | WS0-Spec, kein Georg-Wort: §4.4 per V-Nummer auf Anker und Stützen beschränken. |
| W13 | `contactAO` als Schwellenversatz (R11-12) ↔ Clay-Golden | Nur mit Nachweis der Gleichwertigkeit (WS1). |

## 4 · Georgs Feedback als Kanonregeln

1. **Gebiete 17 (3) und 5 (2), korrigiert:**
   - Farbflächen sind geschlossene, gerundete Blobs. Sie verschmelzen per smooth-min, mit Größenhierarchie und Verschachtelung.
   - **Nie** Schwellwert-Rauschen (fbm + Warp) als Flächengenerator.
   - Keine langgezogenen Zungen, keine dünnen Hälse, kein Mäander; Seitenverhältnis ≤ 1,25 [S].
   - Danach nur schwache Konturverzerrung (≈ 6 m Hauptkontur, ≈ 1,5 m Rand) [S].
   - „Zungen“ wird gestrichen.
   - *Prüfung:* Laufzeit-Test auf Seitenverhältnis und Halsbreite; Kritiker.
2. **Gebiete 4/17 [I]:** keine Schnittkanten, keine Vektorpfad-Bugs. Gegeninseln schrumpfen weich aus dem Übergangsband, nie abgeschnitten. *Prüfung:* V-403-Test.
3. **Gebiet 17 bestätigt:** Übergänge fließen cartoonig ineinander. Dots und Sprenkel variieren natürlich und liegen in Nestern.
4. **Gebiet 5:** Wand = Feld des Plateaus, nur dunkler, ohne harten Wechsel an der Kante (Ü15).
5. **Gebiet 5:** keine zackigen Berge. Es gelten die Etherington-Steinregeln (Ü1, Ü14); Felsen sind Knet-Blöcke mit weichen Kanten.
6. **Gebiet 2:** Steine tiefer, Findling 40–50 %, Kappe 50 % (Abschnitt 2).
7. **Gebiet 4:** Kontakt-Brocken (V-565) bestätigt, C1 bleibt.
8. **Gebiete 7 + 4, Erdung/Kontakt:**
   - Jedes Requisit und jedes Diorama trägt unten einen **dunklen, nicht schwarzen** Kontaktton, ebenso Übergänge wie Baumkronen-Unterseiten.
   - `contactDepthTint` liegt 8–12 L\* unter dem Wurfschatten, harte Stufe, ≤ 0,15 × Aufstandsradius [S].
   - *Prüfung:* Die dunkelsten 5 % des Fußrings liegen in dieser Zone; K4.
9. **Gebiet 7:** Echte 3D-Schatten sind Pflicht (60 fps gemessen). Der p95-Nachweis gegen V-370 bleibt.
10. **Gebiete 5 (4) und 16 (4), Vordergrund-Tonmasse wie bei Road Runner:**
    - Dunklere, ruhige Fläche unten, kein Gradient.
    - Höhe 6–12 %, Breite ≥ 60 %, ΔL\* 15–25 unter dem Mittelgrund, L\* ≥ 15 [S].
    - Oberkante gebrochen (kein gerades Stück > 25 %, 1–3 Silhouetten ragen hinein).
    - Ohne Akzent und Fokus, mit Ursache.
    - Nur feste Kameras; nicht in der Verfolger- und nicht in der freien Übersicht.
    - *Prüfung:* View + Kritikerfrage „Standfläche oder Vignette?“
11. **Gebiet 5 (3):** Farbige Outlines nur an bestimmten Kanten (Ü21). Standardmäßig aus, bis Color Hold steht; die Gratkanten erzeugten Keile.
12. **Gebiet 7, präzisiert:** je Biom **4** Flächenfarben (bisher „3–4“), dazu `shadow`, `deepShadow` (nur bei Überlagerung oder engem Kontakt) und `edgeAccent`; ≤ 2 Stufen, keine Multiply-Kaskade.
13. **Backlog:** Die Stil-Recherche (R10/R11) ist eingearbeitet, das Spielbrett steht unter W11.
14. **Gebiet 5, Begriff:**
    - „Banden“ heißt nur J17-Streckenbanden (`src/m2/k2t.js`, #ef5a22, V-102).
    - Georgs „Höhen-/Farbbänder“ heißen im Kanon Farbbänder.
    - Herkunft „Banden und Rampen“ in #439: Gespräch „Funktionsvergleich Roadster KFB“ vom 19.10. Basis ist der Bestand in combo/r2 (`BRIEF_WS1_TERRAIN_439_R1`).
    - WS0 bestätigt das WS1. Neue Geometrie entsteht nur nach Georgs Bild.
15. **Pflege:** `WS1_*` fehlt in `S/MANIFEST.tsv` (0 Einträge). WS0 trägt es nach.

## 5 · Konzeptblatt

| Feld | Änderung |
|---|---|
| `cameras` | je Kamera `composition_type`, Fokus-Zielgröße, Lebensanker (Ü25, Ü30) |
| `value_plan` (neu) | dominante Wertgruppe, Staffel normal oder umgekehrt, Tiefenband-Schwellen (Ü26/27) |
| `foreground_mass` (neu) | je feste Kamera: ja/nein, Ursache; Verfolgerkamera immer nein (GF 10) |
| `surface_plan` (neu) | Makroflächen mit Ursache, Blob-Formen, Übergangsbreite w (Gebiet 17 (1), GF 1) |
| `palette_roles` | Quartett je Rolle, L\*-Index, Rolle `foregroundValue`, 4 Flächenfarben (Ü16/18, GF 12) |
| `edge_accents` (neu) | Kantenarten und Objekte (Ü21) |
| `color_key` (neu) | Farbkey-Render je Kamera bzw. Zone vor dem Asset-Pass; Colour-Script-Streifen (Ü17) |
| `stamps` (neu) | `stamp_id, premise_ref, questions, chain, key_prop, props, carriers, requires, gameplay, facing` (Ü9–Ü11) |
| `interaction_points` (neu) | id, Position, Objekt (Ü6) |
| `focal` | optional `tangent`; `landmark_type` erst nach Georgs Entscheid |
| `material_codes` | Profil je Code, ≤ 4 Profile (Ü23) |

Erweiterung: `CONCEPT_FIELDS += ('value_plan', 'surface_plan', 'cameras')`. Pflicht für diorama, resident, scenelet und island; `stamps` ist Pflicht, sobald Requisitengruppen vorkommen.

## 6 · Nicht übernehmen

| Punkt | Grund |
|---|---|
| Rim, Gegenlicht, Figuren-Lichtvektor (R11-26/28/30) | V-392, eine Sonne |
| Farbsperren, harte Sättigungs- bzw. Familiengrenzen (R10-37, R4-05/07, R10-19) | V-565 |
| Kühle Schatten, Gooch (R4-11, R11-02) | V-564 |
| Gemalte bzw. erfundene Schatten und Licht, Kapsel-, Decal- und Blob-Schatten, Decal-Lichter (R10-04, R11-04/13/19/27) | V-564, Kanon 15 (3) |
| Schwarze HB-Linien, Inverted Hull, Kontaktlinie (R10-07/08, R11-14) | Kanon 4/6/8 |
| Versatz Linie/Fläche (R10-09) | wirkt in 3D als Fehler; nur die Unregelmäßigkeit bleibt |
| Spitze Noble-Zacken (R10-10) | Form-DNA, GF §2 |
| Tilt-Shift, Sättigungs-Pass, Farbversatz statt DOF (R1-17, R11-23) | Kanon 6/7, Erdung verdeckt, fremde Marke |
| Kulissen je Kamera (R1-18) | QA §00; nur die Ferne darf Kulisse sein |
| Curved-World-Shader (R1-24) | Inselunterseite, K2; nur der Himmelsanteil bleibt |
| Vordergrund ≥ 60 % in der Spielkamera (R1-02) | Die Figur muss frei bleiben |
| Dual-Grid-Übergangskacheln (R1-19) | erkennbares Konstruktionsmuster (V-403); erst nach dem Speckle-Modul |
| Bodenflickenteppich aus 3–5 Belägen (R2 N14) | Gebiet 17 (2)/(8), Georgs „kein Tarnfleck“ |
| HHA-Füllboni, Müll-Abzug (R3-10/11) | belohnen Fülle; Verfall gehört zur Biografie |
| Wasser-Fließrichtung, Spiegelung (R2 N11); Spuren bleiben liegen (R3-19) | erst mit Wasser-Shader bzw. Kostenmessung |
| Getöntes Neutral als Trennband als Gate (R10-20) | verdeckte Farbregel; nur Kritikerfrage |
| Figuren-Umriss (R11 F3), Terminator-Farbband (F6) | Standard nein; nur nach Georg bzw. A/B |


---

## Quelle: EINARBEITUNG_WS1_R2.md

# Einarbeitung WS1-Recherchen R12 + R13 in den 3D-Kanon · R2 · 2026-10-20 · Vorlage für WS0

**Status: VERBINDLICH als Kanon-Anhang B (V-575, WS0 20.10.).** Es gelten Ü31–Ü47, die Gate-Werte, die Widersprüche W14–W25 und die Nicht-Übernahmen.

**WS0-Abweichungen:**
- **W23 TinySkies:** Georg nutzt TinySkies seit V-092/V-093/V-096 bewusst. WS0 meldet die Lizenzlage einmal an Georg und blockiert nicht. Eigenbau nur, wenn Georg das will.
- **Abschnitt 2 Steinwerte:** Der Kommentar-Bug ist behoben (SINK stone_L/M/S wieder aktiv, Regressionstest ergänzt).
- **`sky_plan` und die übrigen Felder in Abschnitt 4:** Pflicht ab Konzeptblatt-Runde R2.

**Status:** Vorschlag an WS0, noch nicht verbindlich. Mit V-Nummer wird er Kanon-Anhang B. Anhang A (`EINARBEITUNG_WS1_R1.md`, Ü1–Ü30) gilt unverändert und wird hier nicht wiederholt.

**Quellen** (`S/WS1_…`):
- **R12:** Abgleich von Georgs „cartoon animation.md“; die Zahlen dort sind unbelegt.
- **R13:** Himmel, Horizont, Ferne (H1–H23, P1–P11, F1–F8).

**Anlass:** der Nebelbalken am Horizont, den Georg in der Probe gefunden hat. Ursachen nach R13 Teil 0:
- ein einziger Nebelton;
- die Kuppel ist unter dem Horizont konstant;
- der Nebel ist schon vor der Geländekante voll.

**Zeichen** wie in Anhang A: [S] Startwert, [I] Invariante, TUNE.

**Werkzeug:**
- Bildtests gehen in `kfb_view` (WS1 W5; das Modul ist noch nicht im Hub).
- Datentests gehen in `kfb_env` (§2).

## 1 · Übernehmen

| # | Geb. | Kanon-Wortlaut (Vorschlag) | Quelle | Prüfung |
|---|---|---|---|---|
| Ü31 | 18 (16 (4) präzisiert) | **Ebene 0 = Ferne:** Himmel, Kulissen und Horizont liegen hinter den drei Tiefenebenen. Die Ferne hat den niedrigsten Detailgrad und trägt keinen Fokus und keinen Akzent; einzige Ausnahme ist Ü40. | R12-B5 | K0 (`sky_plan`); K3 |
| Ü32 | 18 | **Der Himmel ist ein Farbsatz je Stimmung, keine Physik.** Er hat 6 Farben: Zenit, Mitte, Horizont, Bodendunst, Sonne, Gegenseite. Stopps bei 0/3/12/35/90° [S], alle Übergänge mit `smoothstep`. Vertikal fällt ΔL\* über die Kuppel um 15–30 [S]. Am Horizont ist die Sonnenseite ≥ 5 L\* heller als die Gegenseite [S]. Die hellste Linie ist der Horizont-Halo (±2–3°). Stimmungswechsel überblenden den ganzen Satz (V-101). | H1, H2, H4 | View P2, P4 |
| Ü33 | 6/18 | Neue Rolle **`horizon`** neben `sky`. Tag: C ≥ 0,05, Farbton ≥ 20° gegen den Zenit, zur warmen Seite [S, TUNE]. `sky` bleibt V-305; Chroma ≤ 0,195 gilt weiter. | H3, F6 | View P6 |
| Ü34 | 18 | **[I] Unter dem Horizont liegt nie eine konstante Fläche.** Bodendunst von 0° bis −10°: ΔL\* −4…−8, C +0,01…0,02, Farbton 10–30° zum Bodenton [S]. Am Horizont stetig [I]. | H5 | View P1, P2 |
| Ü35 | 18 | **[I] Die Luft hat die Himmelsfarbe in Blickrichtung.** Eine Funktion `skyColor(dir)` mit einem Uniform-Satz gilt für Kuppel, Terrain, Wasser, Kulissen und Wolken; es gibt keine eigene Nebelfarbe. **[I]** An der Geländekante ist f ≥ 0,98. ΔE zwischen Kante und Himmel ≤ 0,01. Balken ≤ 0,5° (10 px@1080) in jeder Kamera, Höhe und Überblendung [S]. | H6, H13 | View P1, P3, P7, P8; Gate Y1 |
| Ü36 | 7/18 | **Distanzluft exponentiell:** `f = 1 − exp(−d·ln2/d50)`. Sie wirkt erst hinter dem Mittelgrund: d50 ≥ 2 × Spielfeldradius [S, WS0]. Die Wertmassen aus Ü26 halten auch mit Luft. Einziger Schreiber ist das Stimmungsmodul (V-132). | H7 | Gate Y2; View |
| Ü37 | 18 | **Kulissen:** 2–3 weltfeste Silhouettenringe, nie am Bildschirm fixiert. Mischung zum Himmel k = 0,45/0,65/0,82; Oberkante +5/+3/+1,5°; Nachbarn ≥ 5 L\* auseinander [S]. Ruhige Oberkante, ≤ 3 Werte, ≤ ¼ Detailfrequenz [S]. Unten laufen sie in den Dunst aus. Farbe aus `cliff`/`mid`, also Material der Ferne. Am Tag nie heller als der Himmel darüber. Der äußerste Ring darf ein prozeduraler Zylinder sein. | H10, H12, H14, H15, F4 | View P5; Gate Y3 |
| Ü38 | 11 präzisiert | **Wolken = opake Knete** mit Stufenlicht aus dem einen Rig. Eine Masse mit Lappen (V-499), flache Basis, gewölbte Kuppe; die Lappen werden nach außen kleiner und flacher. 4 Töne, der Himmel ist einer davon; Licht/Schatten ΔL\* 10–18 [S]. Schichten: gemalt hoch auf der Kuppel; mittel aus Knet-Geometrie, ≤ 2 Massen; Horizontbank als Kulissenring. Parallaxe 1 : 0,5 : 0,2, Wolken ≤ 35 % des Himmels [S]. | H16–H18, F3 | View P10; VFX-Liste; K6 |
| Ü39 | 7/18 | **Sonne:** Scheibe + Hof + Horizont-Halo im Farbsatz. **[I]** Sonne bzw. Mond auf der Kuppel stehen in Key-Richtung des einen Rigs (±5° [S]). | H19 | Gate Y4 |
| Ü40 | 18 | **Surreale Himmelskörper** (V-132). Je Himmelshälfte höchstens 1 großes Signatur-Element, zusammen ≤ 15 % des Bildes. Größen: Riesenkörper 10–25°, Schwebendes ≥ 2°, Inseln ≥ 3° [S]. Die unteren 20–35 % stehen im Dunst. Der Randton kommt aus der Luftmischung, nie aus Rim-Licht (V-392). Knete, weltfest, Verhalten nur mit Ursache in `story`. Knet-Mond (A) und Kulissen-Inseln (B) sind beide zulässig. | H21, F5 | View P10; K7 |
| Ü41 | 14/18 | **Horizont-Pass:** Übersicht aus 50/200/600 m, 4 Kritiker-Kameras und Fahrkamera, je Tag, Gold und Nacht, in 8 Richtungen. Schnelltest: Bild auf 25 % verkleinern und um 90° drehen; ein einfarbiger Streifen ist FAIL. Den Blindtest (P11) macht der Kritiker, nicht Georg. | P1–P11 | CRITIC Kamera 10; K3, K6 |
| Ü42 | 2/3 | **Landmark-Pass** je Landmarke: Funktion, Sichtbarkeit, Silhouette, Material, Farbrolle, Geschichte, ≥ 2 Spuren, Bewegung. `landmark_type` bleibt bei Georg. | R12-B4 | Gate M6; K7 |
| Ü43 | 16 (5) präzisiert | Neue Felder im Farb-Skript: **Wertverlauf** und **Lichtquelle**. Die Lichtquelle ist die Stimmung des Rigs plus benannte Praktikals, kein Zusatzlicht. | R12-A | K0 |
| Ü44 | 14 präzisiert (Ü17) | **Golden Frames:** Der Farbkey aus Ü17 besteht aus drei Bildern (weit, mittel, nah) aus den Kritiker-Kameras 1–3, vor dem Bau. | R12-B8 | K0; K2 |
| Ü45 | 8 präzisiert (Ü23) | Jedes Knet-Profil hat eine Rolle. Haben zwei Profile dieselbe Rolle, fällt eines weg. | R12-B3 (Teil) | K6 |
| Ü46 | 1 | **Das Vertraute trägt das Surreale:** überwiegend vertraute Funktionsformen; Verdrehung und Signatur sind in der Minderheit (Richtwert 60/25/15). Bis Georg entscheidet (R12 E3), ist das nur eine Kritikerfrage. | R12-B2 | K1, K9 |
| Ü47 | 2/3 | **Prop-Budget:** 1 Hero, 2–3 Story, 3–5 Funktion, 5–8 Atmosphäre [S, TUNE, unbelegt]. | R12-B7 | Gate S9 (Befund) |

## 2 · Gate-Werte

| Schlüssel | alt → neu | Grund |
|---|---|---|
| **Fehler `SINK['stone_L/M/S']`** | Seit V-571 stehen die Einträge im Kommentar von Zeile 23 und fehlen deshalb im Dict. Steine werden nur gegen `SINK_CAP` geprüft. → Wiederherstellen (0,40–0,50 / 0,35–0,50 / 0,30–0,40), dazu ein Test in `test_kfb_env.py`. | Regression V-570 |
| `CONCEPT_FIELDS` | Die Felder aus Anhang A §5 fehlen noch. → `value_plan`, `surface_plan`, `cameras` und `sky_plan` ab Konzeptblatt R2. | Anhang A §5 |
| `SKY` neu | alle [S] außer `edge_fog` [I] | Ü32–Ü40 |

```python
SKY = dict(stops_deg=(0, 3, 12, 35, 90), haze_dL=(-8, -4), zen_hz_dL=(15, 30), sun_anti_dL=5, horizon_C=0.05,
           hue_shift=20, edge_fog=0.98, edge_dE=0.01, bar_deg=0.5, d50_min_R=2.0, backdrop_k=(0.45, 0.65, 0.82),
           backdrop_deg=(5, 3, 1.5), backdrop_n=(2, 3), cloud_masses=2, cloud_share=0.35, sig_share=0.15,
           float_deg=2.0, body_deg=(10, 25), sun_key_tol=5)
sp = (scene.get('concept') or {}).get('sky_plan')
if sp:  # Y1: 1 − 2^(−R/d50) ≥ 0,98 ⇔ R_edge ≥ log2(50)·d50 ≈ 5,64·d50, sonst Kanten-Rampe
    if not sp.get('edge_ramp') and sp['edge_r'] < math.log2(50) * sp['d50']: F('Y1', 'Kante nicht voll vernebelt')
    if sp['d50'] < SKY['d50_min_R'] * sp['play_r']: find.append('Y2 Luft im Spielfeld (TUNE)')
    if not 2 <= len(sp.get('backdrops', [])) <= 3: find.append('Y3 Kulissenringe ≠ 2–3')
    if abs((sp['sun_az'] - sp['key_az'] + 180) % 360 - 180) > SKY['sun_key_tol']: F('Y4', 'Sonne ≠ Key-Richtung')
```

## 3 · Widersprüche (Georg und Register gelten)

| # | Konflikt | Empfehlung |
|---|---|---|
| W14 | Tiefen- und Höhennebel (H7/H8, F1) ↔ ein Tonweg (V-385); Anhang A W9 (Nebel nur am Horizont); V-444 (Georg will Distanznebel zum Skydome) | Distanzluft nur als Übergang zur Ferne (Ü36). Höhennebel nur an den Kulissen. Talnebel im Spielfeld erst nach A/B vor Georg. |
| W15 | V-444 „kein Shader-Trick“ ↔ `skyColor` in allen Materialien | Die gemeinsame Funktion ist die saubere Lösung. Verboten bleiben Kaschierungen (Nebelband, Sprite) und Bildschirm-Effekte (Kanon 12 [I]). |
| W16 | Farbige Distanzrampe (H9, F2) ↔ Gebiet 6 „Harmonie über das Material, nie über das Licht“ | Kulissentöne aus den Zonenrollen zählen als Material. Eine Luftrampe auf dem Gelände nur nach A/B vor Georg. |
| W17 | Kuppel und Kulissen unbeleuchtet ↔ Gebiet 7 „alles empfängt vom einen Key“ | Die Ferne ist Himmels-Material, kein Akteur, und braucht keinen Schatten. Die Stimmung kommt aus dem Farbsatz des Rigs (Ü39). |
| W18 | Ü27: Himmelsspanne ≤ 15 L\* ↔ H1: 15–30 | Ü27 misst im Bild, Ü32 über die ganze Kuppel. Beide gelten. |
| W19 | Wolken aus Kugeln (tinyskies) ↔ V-499 „nie Kugelstapel“ | Nur die Silhouettenlogik übernehmen, gebaut wird eine Masse mit Lappen. |
| W20 | Drei Wolkenschichten ↔ ≤ 2 Massen (Ü27) | Die Bank zählt als Kulisse, die hohen Wolken als Kuppelbild. ≤ 2 Massen gilt für die Mittelschicht. |
| W21 | Gemalte Sonnenstrahlen (H20) ↔ V-564, Anhang A W4, V-385 (keine Tricks) | Nicht übernehmen. |
| W22 | Karton und Candy-Glanz (R12-B3) ↔ Gebiet 8 (ein Knet-Modul, kein CGI-Glanz) | Gebiet 8 bleibt. Ein Profil `paper` nur nach Georgs Ja (R12 E1). |
| W23 | tinyskies hat keine Lizenz ↔ V-092 „SKY3 vendored“ | WS0 prüft die Herkunft von SKY3; stammt es von dort, folgt ein Eigenbau. Erlaubt sind nur Ideen; kein Rim und kein Lens-Flare (W1). |
| W24 | Horizont-Chroma ≥ 0,05 ↔ V-565 (keine Farbsperre) | Nur TUNE, nie FAIL. Hart bleibt „kein Mittelgrau“. |
| W25 | RA 1:1, Kit as-is (V-573/574) | Ein RA-Himmel bleibt 1:1. Kit-Inseln und Kulissen werden nicht gestaucht. |

## 4 · Konzeptblatt

| Feld | Änderung |
|---|---|
| `sky_plan` (neu, Pflicht ab R2) | Farbsatz je Stimmung; `sun_az` = `key_az`; `d50`, `edge_r`, `play_r`, `edge_ramp`; Kulissen (Radius, k, Rolle); Wolkenschichten; Signatur-Himmelskörper mit Ursache; Himmelsanteil je Kamera |
| `palette_roles` | + `horizon`, `ground_haze`, `sun`, `anti` |
| `color_script` | + `value_arc`, `light_source` (Ü43) |
| `color_key` | drei Golden Frames (Ü44) |
| `landmark_pass` (neu) | je Landmarke (Ü42) |
| `space` | Ebene 0 (Ü31) |
| `prop_budget` | optional (Ü47) |
| `comedy_contract` | empfohlen; Pflicht erst nach Georgs Ja (R12 E2) |

## 5 · Nicht übernehmen

| Punkt | Grund |
|---|---|
| H11: mehr Luft auf Schattenseiten | zweite Lichtantwort (Kanon 7) |
| H20: gemalte Strahlen | W21 |
| H22: Musterhimmel | Georg-Entscheid; Farbversatz ist schon in Anhang A abgelehnt |
| H23: Bildschirm-Himmel | Kanon 12 [I] |
| Preetham-Himmel, Atmosphäre, volumetrische Wolken | V-381 |
| aus tinyskies: Code, Assets, Glaswolken, linearer Nebel, Rim, Flare | Lizenz, V-499, Ü35, V-392 |
| Talnebel im Spielfeld | W14 |
| R12-B6: Biom-Blatt | durch `form_dna`, `color_script` und `material_codes` abgedeckt (V-411) |
| R12-B3: Karton/Candy | W22 |
| R12: neue Begriffe „World Rig“ usw. | Die Regel steht schon in den Gebieten 7 und 12. |
| R13 F7/F8: PDFs | erst als R13 R2, falls P1–P10 an der Probe nicht reichen |

**Pflege:** R12 und R13 fehlen in `S/MANIFEST.tsv`, R13 fehlt im `RESEARCH_BACKLOG_R1.md`.

## 6 · Kanon-Gebiet

**Empfehlung: neues Gebiet 18.** Das Thema hat einen eigenen Baustein (`skyColor`), eigene Tests (P, Y) und einen eigenen Fehlertyp (Balken). Verteilt auf die Gebiete 5, 6, 7, 11, 12 und 16 hätte es keinen Besitzer (V-411). Die Gebiete 6, 7, 11 und 16 (4) bekommen je eine Verweiszeile.

**Zeile, nach Gebiet 17 einzufügen:**

| 18 | **Himmel, Horizont, Ferne** (Ebene 0 hinter den Tiefenebenen von Gebiet 16; Georgs Befund „Nebelbalken“ 20.10.) | `S/WS1_R13_HIMMEL_HORIZONT_FERNE_R1.md`; `S/WS1_R12_…` §B5; Anhang B Ü31–Ü41; V-101, V-132, V-305, V-381, V-444 | Himmel = Farbsatz je Stimmung: 6 Farben, zwei Verläufe, der Horizont als hellste Linie, Rolle `horizon` farbig. **[I]** Unter dem Horizont nie eine konstante Fläche, sondern Bodendunst. **[I]** Luft = `skyColor(dir)` für Kuppel, Terrain, Wasser, Kulissen und Wolken; an der Kante f ≥ 0,98, kein Balken. Distanzluft erst hinter dem Mittelgrund. 2–3 weltfeste Kulissenringe. Wolken aus Knete (Gebiet 11), ≤ 2 Massen. **[I]** Die Sonne steht in Key-Richtung. ≤ 1 Signatur-Himmelskörper je Hälfte, ≤ 15 %. Nie: Bildschirm-Himmel, gemalte Strahlen, physikalischer Himmel. Ein RA-Himmel bleibt 1:1. | `kfb_env` Y1–Y4, K0; `kfb_view` P1–P10 | K3, K6, K7 + Horizont-Pass |


---

## Quelle: COLOR_HARMONY_R1_README.md

# KFB · Farbharmonie-Modell R1 (aus Joyride J17 abgeleitet)

Stand 15.10.2026 · WS0 · Register V-293 (Auftrag), V-292 (Story-Mode-Farben), V-102/V-174 (Fahrbahn, Bande).
Quelle der Messung: Lab `src/world/organ/vendor/j17/lab-track/track-look.v5.js` `WORLDS` und Lab `src/palettes.ts` `PALETTES` (canyon, bucht, otown). Spender für die Rechenart: Cologne Race `cologne-palette.v1.js` (OKLCH, Gamut-Rücknahme, Schemata; Repo main, Blob `38246785`).

## 1 · Das Modell in Kürze

Eine J17-Welt hat **drei tragende Farbtöne**: den **Boden** g (die Fläche, rund 60 % des Bildes), den **Strang** (Bande, Rahmen), der um etwa **90° vom Boden** steht und **immer warm** ist (Orange, Koralle, Senf), und das **Wahrzeichen** (Türme), das etwa **gegenüber dem Boden (180°)** steht und ins **Bonbon-Band** Violett–Magenta–Rot gezogen wird. Kommt es dabei dem Strang zu nah, wird es **einfarbig mit dem Strang** (Canyon: orange Türme). Alles andere hängt daran: **Laub** ist Naturgrün, außer der Boden ist selbst grün oder türkis, dann **Herbst-Orange** (O-Town). Der **Himmel** liegt **90° neben dem Laub** (grünes Laub → Blau, oranges Laub → Mint). **Stamm und Erde** liegen **105° auf der anderen Seite des Laubs** (Braun bzw. Lila). **Pad** ist immer Gelb, **Fahrbahn** immer Schiefer.

**Helligkeit folgt dem Farbton, aber gestaucht.** Jeder Farbton hat eine natürliche Helligkeit, bei der er am buntesten sein kann (Gelb hell, Violett/Blau tief). J17 nimmt diese Helligkeit nur zur Hälfte mit und zieht den Rest zur Mitte (Pop-L = 0,37 + 0,5 · Cusp-L). Darum sind Gelb und Orange hell, Violett und Magenta mittel, aber nichts ist dunkel. **Buntheit hat vier Stufen mit Deckel:** Pop (Strang, Pad, Türme, Laub) bis 0,195, Fläche (Boden, Hügel) bis 0,14, Ruhe (Himmel, Wasser, Fahrbahn) um 0,07, Neutral (Wolke, Weg, Sand) um 0,03. Das „Cartoon“ entsteht genau hier: kräftige Farben bei mittlerer bis heller Helligkeit, wenige klare Stufen, warm gegen kühl, und nie Neon, weil der Deckel auch dann gilt, wenn der Bildschirm mehr Buntheit hergeben würde.

## 2 · Gemessen (OKLCH; L Helligkeit 0–1, C Buntheit, h Farbton in Grad, Δh zum Boden)

| Rolle | Canyon | Bucht | O-Town | Regel |
|---|---|---|---|---|
| Boden | L 0,59 · C 0,143 · 299° | L 0,87 · C 0,107 · 88° | L 0,66 · C 0,099 · 182° | Tisch L ≈ 0,55 + 0,12·Cusp-L, C ≤ 0,14 (warm ≤ 0,11); Strand (Gelb 65–110°) L 0,87 |
| Hügel hell / dunkel | +0,08 / −0,04 L, gleicher Ton | Aqua 192–200° (kühler Partner) | +0,05 / −0,07 L | Tisch: Boden ±0,06 L; Strand: Hügel = Himmel −30° |
| Strang | L 0,66 · C 0,195 · 39° (Δh +100) | L 0,71 · C 0,161 · 10° (−78) | L 0,80 · C 0,145 · 84° (−98) | g ± 90°, die wärmere Seite, 30 % zur Orange-Mitte 45° |
| Wahrzeichen | = Strang (monochrom) | L 0,63 · C 0,147 · 303° (−145) | L 0,61 · C 0,167 · 351° (+169) | g + 180°, 40 % zum Bonbon-Zentrum 350°; < 35° am Strang → monochrom |
| Laub | Grün 148–150°, L 0,51–0,56 | Grün 131–140°, L 0,70–0,78 | Orange 58–75°, L 0,73–0,80 | Grün 143°; Boden grün/türkis (105–215°) → Herbst 66°; grünes Laub ≤ Boden-L − 0,06 |
| Blüte | Limette 105°, L 0,81 | Rosa 354°, L 0,80 | = Wahrzeichen | hell, 75 % vom Wahrzeichen zum Strang; Herbst → Wahrzeichen; monochrom → Limette |
| Himmel | L 0,78 · 243° | L 0,84 · 219° | L 0,84 · 156° | Laub + 90°, L ≈ 0,82, C 0,068 |
| Stamm / Erde | Braun 54° / Orange 38–45° | Ocker 47–56° | Lila 304–307°, L 0,35–0,47 | Laub − 105°; L 0,68/0,61/0,52; Herbst 0,47/0,42/0,35 (dunkles Gegengewicht zur hellen Krone) |
| Pad | 82°, L 0,81 | 94°, L 0,87 | 103°, L 0,94 | Gelb 92°, ≥ 20° vom Strang, an der Cusp |
| Wolke · Weg · Sand | Creme 70–87°, L 0,87–0,97, C 0,03–0,04 | | | fest Creme 80–84°, L 0,93 |
| Wasser | 249° L 0,60 | Lagune 207° L 0,76 | 244° L 0,58 | Tisch Taubenblau 247°; Strand im Ton der Dünen |
| Fahrbahn | 261° L 0,41 C 0,04 | 249° L 0,47 | 280° L 0,43 | fest `#3d4a60` (V-102/V-174), Straße +0,10 L |

**Helligkeits-Leiter:** Creme 0,87–0,97 · Himmel/Blüte 0,78–0,84 · Pop 0,61–0,85 (Gelb oben, Violett unten) · Boden 0,59–0,66 (Strand 0,87) · Erde/Stamm 0,47–0,68 · Fahrbahn 0,41.

## 3 · Generator-Regeln (`kfb-cartoon-palette.js`)

1. **Eingabe:** ein Boden-Farbton (`fromHue(h, seed, scheme)`), ein Story-Mode (`fromStoryMode(id, seed)`), 1–3 Vorgabefarben (`fromColors([...])`) oder nur ein Seed (`random(seed)`). `seed = 0` heißt reine Regel ohne Würfel-Rauschen.
2. **Farbtöne** nach §2. Schemata bestimmen nur die Winkel von Strang und Wahrzeichen: `joyride` (90°/180°, gemessen), `komplementaer` (180°/150°), `split` (150°/210°), `triade` (120°/240°), `analog` (40°/−40°). Die J17-Leitplanken gelten in jedem Schema: Strang warm, Wahrzeichen Richtung Bonbon, Laub/Himmel/Stamm/Pad nach Regel.
3. **Helligkeit und Buntheit** je Rolle aus der Tabelle `MODEL.L` / `MODEL.C` (an Cusp-L des Farbtons gebunden, Buntheit gedeckelt absolut und relativ zum Möglichen).
4. **Gamut:** OKLCH → sRGB; wenn nicht darstellbar, sinkt nur die Buntheit (L und Farbton bleiben).
5. **Würfel** (seed ≠ 0): Schema gewichtet (Joyride 4, Komplementär 2, Split 2, Triade 2, Analog 1), Farbtöne ±6°, Stimmung einmal je Palette L ±0,02 und C ×0,92–1,08.
6. **Vorgaben** (`fromColors`): Jede Farbe wird der passendsten Rolle zugeordnet (Boden, Strang, Wahrzeichen, Laub), bleibt exakt, der Rest folgt der Regel. Beispiel in `results.json` `fromColorsDemo`: O-Town aus `#3aa596` + `#e9b53b` ergibt Wahrzeichen `#d7568b`, Laub `#ed9c3e`, Himmel `#a7d8b8`.
7. **Story-Mode:** der Farbton der Website-Farbe (V-292, Mittel aus dunkel und satt) wird **Boden-Farbton**; Helligkeit kommt aus der J17-Leiter, nicht aus der dunklen Website-Farbe (Website L 0,43–0,67 → Spiel-Boden L 0,62–0,87). Die Website-Farben bleiben im Ergebnis (`source.storyDunkel`, `source.storySatt`) für Schrift und Linien.
8. **Ausgabe:** `roles` (J17-/`palettes.ts`-Form: sky, top, top2, hill[2], sand, rim, under[4], rock, tower[2], leaf[3], trunk, cloud, water, path, roadStreet, roadTrack, strang, pad), `envRoles` (ENV_ROLES-Form, je drei Töne hell/mitte/dunkel, plus asphalt, landmark, sky), `variants` (je Akzent `dunkel` / `mitte` / `satt`), `hues`, `mode`.
9. **Leitern und Varianten:** hell = +0,07 L (C ×0,95), dunkel = −0,09 L. Variante **dunkel** = −0,17 L, C ×0,85 (Linie, Schrift auf hell). Variante **satt** = +0,06 L (+0,06 mehr bei Gelb), C ×1,15. Das entspricht dem Muster der Website-Paare: dort ist „satt“ vor allem heller (+0,04 bis +0,15 L) und etwas bunter (×1,07–1,21), bei gleichem Farbton.

## 4 · Nachweis

**J17-Nachbau aus nur dem Boden-Farbton** (ΔE in OKLab: 0,02 kaum sichtbar, 0,05 deutlich, 0,10 eine andere Farbe; 25 Rollen je Welt):

| Welt | Eingabe | mittleres ΔE | ohne Fahrbahn | größtes ΔE | Rollen < 0,05 |
|---|---|---|---|---|---|
| Canyon | 299° | 0,024 | 0,027 | 0,063 (Wolke) | 23 / 25 |
| Bucht | 88° | 0,027 | 0,023 | 0,077 (Straße) | 22 / 25 |
| O-Town | 182° | 0,023 | 0,021 | 0,058 (Pad) | 24 / 25 |

Die größten Abweichungen sind die Fahrbahn (J17 tönt sie je Welt; KFB hat sie mit V-174 auf `#3d4a60` festgelegt), das Pad-Gelb (±10°) und die Creme-Töne. Je Rolle mit Hex-Werten: `results.json` → `j17.<welt>.perRole`.

**Ehrlich dazu:** Die Konstanten sind an genau diesen drei Welten gemessen (rund 30 Zahlen für 75 Farbwerte), der Nachbau ist also eine Erklärung, kein unabhängiger Test. Drei Regeln haben eine Fallunterscheidung, die je an einer Welt hängt: Strand-Boden (Bucht), monochromes Wahrzeichen (Canyon), Herbstlaub mit dunklem Stamm (O-Town). Grenze: eine natürliche grüne Wiese (z. B. `kfb_town`) bekommt nach der Regel Herbstlaub; dafür gibt man das Laub als Vorgabe mit (`fromColors`).

Bilder (`bilder/`, alle selbst gesichtet):
- `01_j17_<welt>_original_vs_regel.png` – je Welt links Original, rechts Nachbau mit ΔE je Rolle.
- `02_storymodes_1_tragic_comic_absurd.png`, `02_storymodes_2_heroic_mystical_forbidden.png` – Story-Mode-Paletten mit Website-Farben, Spiel-Helligkeit und Varianten dunkel/mitte/satt.
- `03_zufall_1..4_*.png` – Seeds 1–12 ungeschönt.
- `04_szene_1_otown_original.png`, `04_szene_2_otown_regel.png`, `04_szene_3_storymode_mystical.png`, `04_szene_4_zufall_seed_9.png` – Knet-Testszene (three.js 0.186, WS1-Bühnenlicht: Hemisphäre 0xfff4e0/0x3a3226 · 1,25, Sonne 0xffffff · 1,8 bei (6, 11, 7), fov 38, keine Tonabbildung, sRGB): Boden, Hügel, Fels, Turm, Baum mit Blüten, Himmel, Display-Rahmen, Fluff-Kugel, Fahrbahn mit Strang und Pad.

Fluff in der Szene = Blüte, Variante „satt“ (Arbeitsstand; ein Fluff-Farbschema ist weiter offen, COLOR_CONCEPT_R1 G-1).

## 5 · Dateien und Aufruf

- `kfb-cartoon-palette.js` – Modul (ES, ohne Abhängigkeiten): `fromHue`, `fromColors`, `fromStoryMode`, `random`, `analyse`, dazu `MODEL`, `SCHEMES`, `STORY_MODES`, `deltaE`, `hexToOklch`, `oklchToHex`, `ladderOf`, `variantsOf`.
- `j17-reference.js` – die drei J17-Paletten als Referenz.
- `kfb-harmony-run.mjs` – `node kfb-harmony-run.mjs` → Nachbau + ΔE, Story-Modes, 12 Zufallspaletten → `results.json`.
- `kfb-harmony-render.mjs` – `node kfb-harmony-render.mjs [filter]` → Bilder in `bilder/` (headless Chrome über playwright-core und three aus dem Lab-`node_modules`, nur gelesen; kein Server, kein Port).
- `results.json` – alle Paletten, ΔE je Rolle, Analyse der Originale.


---

## Quelle: CRITIC_3D_R1.md

# Kritiker 3D · R1 · 2026-10-20 · WS0 (V-563)

**Wer:** ein frischer, blinder Kritiker (neuer Kontext, Subagent). Er sieht **nur**:
- die Bilder aus den festen Kameras;
- das Konzeptblatt der Szene;
- diese Datei und den Kanon `CANON_3D_R1.md`.

Erklärungen, Code und Absichten der Bauenden sieht er nicht. Er schlägt keinen Code vor.

**Wann:**
- **Phase 1 (bis es läuft, Georg 20.10.):** jede 3D-Lieferung, also Abnahmen, Proofs, Scenelets, Demos, Residents und Dioramen.
- **Phase 2 (später, Tokens sparen):** nur produktive Spielszenen, also Residents und Dioramen im Spiel. Abnahmen laufen dann nur über das Gate.
- **Den Wechsel** zu Phase 2 entscheidet Georg.

**Vorher:** Das mechanische Gate ist grün:
- `lib/kfb_env.py` bzw. `kfb_env_bpy.run()` für die Umgebung;
- `PROOF_STAGE_R1` G1–G7 für Figuren, Material, Licht und Boden.

Ein roter Gate-Lauf geht nie an den Kritiker, sondern zurück an den Bau.

## Feste Kameras (je Szene)
1. Übersicht schräg von oben, 35° (V-570).
2. Augenhöhe Figur (1 H über Boden) vom Hauptweg auf den Fokus.
3. Nahaufnahme Fuß einer Ankergruppe (Erdung).
4. Seitenansicht Rand (Silhouette).
5. Nur bei Figuren: Gesicht nah (Augen, Lider), Proof-Stage-Preset `near_face`.
6. **Drei Pflicht-Pässe (V-565/V-566)** aus Spielkamera und in echter Bildschirmgröße:
   - a) **Silhouette:** alles schwarz vor Grau, liest sich die Geometrie?
   - b) **Graustufen:** ohne Farbe; gibt es klare Hell-, Mittel- und Dunkelmassen, und liegt der stärkste Kontrast auf dem Fokus?
   - c) **Thumbnail:** stark verkleinert und leicht unscharf; bleiben Fokus, Weg, Spielfläche und Tiefe lesbar?
8. **Terrain-Lieferungen (V-568):** zusätzlich die 4 Diagnose-Ansichten aus derselben Spielkamera (Albedo unbeleuchtet, Grau-Material, Material-ID, final) und der Vergleich A/B/C/D. Befunde: Tarnfleck bzw. Konfetti, Halo am Ufer, Flecken, die wie eigene Biome wirken, Variation innerhalb eines Materials stärker als zwischen Materialien, Flimmern bzw. wanderndes Muster bei Kamerafahrt.
9. **Spielgeschwindigkeit (V-568):** mindestens ein Pass bei bewegter Spielkamera in Spieltempo, nicht nur im Standbild.
7. **Kontakt-Schatten:** Der Schatten berührt die Basis, folgt der Silhouette, ist kein Blob und wird vom Terrain empfangen.

Alter Silhouetten-Pass (V-565): Kamera 2, alle Objekte schwarz vor Grau. Lies ab, was dort steht: Fokus, Gruppen, Figuren. Verschmilzt etwas mit dem Terrain oder mit dem Nachbarn, ist das ein Befund für K3/K7.

## Bewertung 0–10 je Kriterium
Herkunft: QA_RULEBOOK_ENVIRONMENT_R1 §3, ergänzt um den Kanon.

| Nr. | Kriterium | 10 = | 0 = |
|---|---|---|---|
| K1 | **Geschichte lesbar** | Ohne Text erkennbar, was hier los ist; der Ein-Satz des Konzeptblatts ist sichtbar eingelöst; die Szene liest sich als ein handgemachtes Objekt | zufällige Deko |
| K2 | **Farbkonzept** | Farb-Skript der Szene eingelöst; Palettenrollen V-402 und 60/30/10; Akzentfarbe nur mit Bedeutung; Terrain nie die lauteste Fläche | bunt ohne Rolle, grelles Grün, Mittelgrau |
| K3 | **Komposition und Bildanatomie** | Der Fokus gewinnt über ≥ 2 Mittel; drei Tiefenebenen lesbar; Gruppen 1 : 3 : Rest; Negativraum atmet; keine Reihe, kein Teppich, keine Scheibe; Graustufen- und Thumbnail-Pass bestanden | hingewürfelt, Props auf einem Teller |
| K4 | **Erdung (Etherington)** | Eingraben, Kontakt und Überlappen mit Ursache an jedem Objekt; Kontakt-Geometrie bricht jede Fuge; Speckle-Übergang statt Verlauf | aufgeklebt, schwebend, harte Fußkante, Blob-Schatten |
| K5 | **Modell-Verständnis** | Jedes Element steht, wo es nach Ortsbiografie hingehört (Entstehen, Nutzen, Vergehen, Bewachsen) | Arten und Props ohne Standortlogik |
| K6 | **Eine Welt** | ein Licht-Rig, ein Knet-Material, eine Palette; Kits lesen sich zusammen | Stilbruch, fremdes Licht, fremdes Material |
| K7 | **Vielfalt ohne Rauschen** | 70/20/10: Ruhe, Struktur, Bedeutung; Form-DNA einheitlich; Lebensanker sichtbar; Abwechslung in Größe, Drehung und Art; Signatur 1 Hero + ≤ 2 Echos; Silhouette lesbar | monoton oder wirr |
| K8 | **Referenz-Nähe** | Hält den Vergleich mit Georgs Referenz bzw. dem RA-Original 1:1 aus | kein Bezug, Quelle „verbessert“ |
| K9 | **Innerweltliche Logik** | Jedes Element hat erkennbar Herkunft und Grund; die Szene trägt aus jedem Winkel | nur für einen Winkel arrangiert |
| K10 | **Figuren** (nur wenn vorhanden) | KFB-Augen und E2-Lider an jeder Variante, Blick lesbar, Pose und Kontakt glaubwürdig, Knete sichtbar | Augen fehlen, Schielen, Gleiten, Puppenpose |

**Bestanden:**
- Gate grün;
- Mittelwert ≥ 8;
- kein Kriterium unter 6;
- K9 ≥ 7;
- K10 ≥ 7, wenn Figuren vorhanden sind.

## Figurenabnahme (einzelne Figur im Proof Stage, keine Szene)
Kalibriert nach dem ersten Lauf am 20.10. (Spielzeugsoldat).

**Es zählen nur:**
- K4: Füße bzw. Kontakt, Schatten folgt der Silhouette, kein Blob;
- K6: Knete sichtbar, ein Licht;
- K10.

K1–K3, K5 und K7–K9 sind n/a.

**Keine Befunde in der Figurenabnahme:**
- Kontakt-Geometrie bzw. Terrain am Fuß. Der Proof Stage ist der Standardboden; Gebiet 4/15 gilt erst in der Szene.
- Kit-Facetten an KayKit-Figuren: Kit-Modelle werden nicht geknetet (QA_RULEBOOK §0b), die Knete kommt aus dem Material.
- Schattenrichtung zwischen verschiedenen Kameras. Der Proof Stage hat ein festes Licht, die Kameras stehen in verschiedenen Azimuten; vergleiche nur innerhalb eines Bildes.
- Einwärts konvergierende Pupillen beim Zielen bzw. Fokussieren auf Nahes. V-518 verbietet nur das Auswärts-Schielen.
- Ein gewollter Ausdruck (z. B. zusammengekniffene Augen beim Zielen), solange beide Augen symmetrisch arbeiten.
- Fäustlings- bzw. Kugelhände von Kit-Figuren (KayKit): Es gibt keine Finger zum Umgreifen. Den Griff liest man an der Lage der Hand am Griffstück.
- Pupillen, die im exakten Profil (90°) nicht sichtbar sind: Bei einem kugeligen Auge mit Blick nach vorn steht die Pupille dort auf Kante.
- Teile, die zur Figur gehören (z. B. der Aufziehschlüssel des Spielzeugsoldaten), sind kein Fremdteil.

**Immer ein Befund:**
- Abschluss nicht nach V-577: lange Kleinteil-Zone statt gestaffelter ganzer Platten, aufgereihtes Rubbel, roh geschnittenes Ende, Wandende ohne Kappe oder Ruinen-Abschluss;
- verformte bzw. gestauchte Kit-Teile, die ein anderes Objekt vortäuschen sollen (V-573);
- fehlende Augen bzw. Lider an irgendeiner Variante;
- Waffe oder Requisit im Gesicht bzw. Körper (Durchdringung);
- Waffe nicht auf der Unterarmachse (V-536, Ausnahme Hiebwaffen q136);
- schwebende Füße;
- fremdes Material ohne Knete.

## Ausgabe des Kritikers
1. Punkte K1–K10.
2. Mängelliste: was, wo (Kamera und Bildbereich), welche Regel (Kanon-Abschnitt bzw. V-Nummer).
3. Gesamturteil PASS oder REWORK.

Keine Adjektive, kein Lob, keine Code-Vorschläge.

## Stopp-Regel
Herkunft: QA_RULEBOOK_ENVIRONMENT_R1 §5.
- **Zwei Reparaturen ohne Punktgewinn** am selben Kriterium: Stopp. Bericht an WS0 mit Bildern, Punkten und vermuteter Ursache.
- **Ein Kriterium unter 4** nach der ersten Runde: Das Konzept ist falsch, zurück zum Konzeptblatt.

Georg sieht nur Szenen, die bestanden haben, oder einen Stopp-Bericht.

## Auftrag an den Kritiker (zum Kopieren in den Subagent-Prompt)
> Du bist der blinde 3D-Kritiker für KFB. Lies `CANON_3D/CRITIC_3D_R1.md` und `CANON_3D/CANON_3D_R1.md` und das Konzeptblatt `<pfad>`. Sieh dir die Bilder `<pfade>` an. Bewerte K1–K10 nach der Tabelle, liste Mängel mit Kamera, Bildbereich und Regel. Urteil PASS oder REWORK nach der Bestanden-Regel. Keine Code-Vorschläge, keine Adjektive.


---

## Quelle: ENV_ERZAEHLRASTER_R1.md

# Environment · Erzählraster R1 · je Insel vor jeder Platzierung

Status: **ENTWURF, kein Code.** Vorbereitung für die neue Inselgrundlage (R2D v0 + Scholle v7, Besitzer: Lab-Steuer-Sitzung, Entscheidung 2026-10-08).
Grundlage:
- `donors/kfb-island-kit-r2-2026-10-08/BAUANLEITUNG.md` §10 und `KFB_Island_Kit_R1/KONZEPT_R2.md` §4 mit Georgs D4;
- `docs/QA_RULEBOOK_ENVIRONMENT_R1.md` §00 und §0b;
- `docs/biome-sheets/Bauweise_Erdung.jpg` (Georg PASS).

Pyramide: Geschichte nach Georgs Entscheidung D4. Canyon, Bucht, O-Town: **Vorschläge, von Georg zu entscheiden.**

## 0 · Was aus der Geschichte folgt

Das Raster wird **vor** der Platzierung ausgefüllt:

| Feld | Frage |
| --- | --- |
| Ursprung | Warum gibt es diesen Ort? |
| Lebensader | Wasser, Weg, Handel? |
| Landmarke | Was ist das Ziel des Blicks? |
| Arbeit / Leben | Was tun die Bewohner hier? |
| Spuren | Welche Wege, Abnutzung, Werkzeuge? |
| Natur nach Gelände | Was wächst wo, und warum dort? |

Jedes platzierte Element verweist auf eines dieser Felder. Was keinem Feld zugeordnet werden kann, wird nicht gebaut (§00).

## 1 · Pyramiden-Insel · Geschichte nach D4 (entschieden)

| Feld | Inhalt |
| --- | --- |
| Ursprung | Eine Oase in der Wüste. Um sie herum liegt die Baustelle einer Pyramide, die nie fertig wurde. Die Gegend ist okkult und altägyptisch, mit Lovecraft-Ton. |
| Lebensader | Die Oase (Quelle, Palmenhain). Ein Pfad führt von dort zum Steinbruch und zur Baurampe. |
| Landmarke | Die unvollendete Pyramide (Großes Siegel, 13 Lagen, flache quadratische Plattform). Darauf das Auge oder der Vogelgott, an der Flanke der Dungeon-Eingang. |
| Arbeit | Ein Steinbruch an der Inselkante, ein Schlitten mit Quader, das Zeltlager der Bauleute, Wasserkrüge. Die Mumien sind die Bauleute, die nie aufgehört haben. |
| Spuren | Schleifspuren im Sand vom Steinbruch zur Rampe. Abgeschlagene Kanten an den Quadern. Ein Trampelpfad von der Oase zum Lager. |
| Natur nach Gelände | Palmen und Schilf nur an der Oase. Sonst Dünen, Steine und vereinzelte Dornbüsche im Windschatten. Totes Holz nur dort, wo die Oase früher reichte. |

**Folgen für Natur und Saum:**
- **Palmenhain** (Rule of Three: Anker, 2 Begleiter, Akzent Schilf) nur am Oasenufer. Die Palmen neigen sich zum Wasser.
- **Steine** sind Bruchstücke aus dem Steinbruch: Sandstein-Ocker, kantig gebrochen.
  - Am Steinbruch liegen sie gehäuft, entlang der Schleifspur vereinzelt, an der Rampe in Lagen.
  - Keine Felsbrocken als Deko ohne Herkunft.
- **Saum an Steinen:** Sand ist angeweht, auf der Leeseite höher. Kein Gras; höchstens ein Dornbusch im Windschatten.
- **Fluff:** nur an den Palmen der Oase, Farbe aus `ENV_ROLES.wueste` (Akzent). Fallobst liegt am Ufer und im Lager, weil die Bauleute es sammeln.

## 2 · Canyon · Vorschlag

| Feld | Inhalt |
| --- | --- |
| Ursprung | Ein Bach hat aus dem Canyonfels ein Tal gegraben. Ein Müller hat sich am Mühlteich angesiedelt. |
| Lebensader | Bach und Mühlteich. Der Weg kommt über den Hügel zur Mühle. |
| Landmarke | Die Wassermühle. |
| Arbeit | Mahlen und Holz schlagen im alten Kugelwald. |
| Spuren | Baumstümpfe am Waldrand, ein Holzstapel an der Mühle, ein ausgetretener Weg. |
| Natur nach Gelände | Kugelwald hinter der Mühle. Jungwald, wo gefällt wurde. Weiden am Wasser. Kiefern auf dem mageren Hügel. Orange Canyonfelsen dort, wo der Bach den Fels freigelegt hat. |

**Folgen:**
- Felsen gibt es nur, wo das Wasser den Inselfels freigelegt hat: an Bachrinne, Hang und Kante. Am Fuß liegt Schutt, bergab gehäuft.
- Stümpfe stehen am Waldrand zur Mühle hin. Jungbäume wachsen daneben.
- Fluff wächst an den Kugelbäumen. Der Müller erntet ihn, deshalb steht ein Korb an der Mühle.

## 3 · Bikini-Bucht · Vorschlag

| Feld | Inhalt |
| --- | --- |
| Ursprung | Eine Lagune, die das Meer zurückgelassen hat, ein Unterwasser-Strand. |
| Lebensader | Die Lagune und der Steg im Süden. |
| Landmarke | Die Strandtaverne. |
| Arbeit | Bewirten, Fischen, Tang sammeln. |
| Spuren | Ein Pfad vom Steg zur Taverne, Fußspuren im Sand, Liegen und Fässer. |
| Natur nach Gelände | Tangbäume mit rosa Blüten am Lagunenufer, aus angespültem Tang gewachsen. Palmen hat der Wirt vor der Taverne gepflanzt. Dünengras auf den Dünen. Lebende Korallen (violett) nur im flachen Wasser am Rand. |

**Folgen:**
- Strandsteine sind rund geschliffen und liegen an der Flutkante, nie mitten auf der Düne.
- Korallen-Violett gibt es nur im Wasser. Felsen sind ocker (Farb-Grammatik).

## 4 · O-Town · Vorschlag

| Feld | Inhalt |
| --- | --- |
| Ursprung | Eine Vorstadt, auf ebenem Grund gebaut. |
| Lebensader | Die Straße (RKIT) und der Parkplatz. |
| Landmarke | Das Stadthaus. |
| Arbeit / Leben | Wohnen, Parken, Gärtnern. |
| Spuren | Ein Trampelpfad quer über den Rasen (Abkürzung), Pfähle an Jungbäumen, ein Beetrand. |
| Natur nach Gelände | Alles ist gepflanzt: Straßenbäume in Reihe am Weg, ein Herbstpark hinter dem Haus, ein Blumenbeet am Haus, geschnittene Hecken. Schieferbrocken liegen nur am Rand, aus der Baugrube übrig. |

**Folgen:**
- Hier ist Ordnung die Geschichte. Straßenbäume stehen in gleichem Abstand. Das ist kein Verstoß gegen „häufen statt verteilen“, denn die Ursache ist die Stadtplanung.
- Fluff wächst an den Parkbäumen. Fallobst liegt auf dem Rasen und wird von Anwohnern gesammelt.

## 5 · Fluff rundum (Korrektur nach Georgs Befund)

- Fluff wächst **rundum** an der Krone und an Sträuchern. Jeder Kronenbereich trägt welchen; eine leere Seite gibt es nicht.
- Auf der Lichtseite wachsen etwas mehr und größere (reife) Kugeln, etwa 60 : 40.
- Kugeln sitzen in kleinen Gruppen zu 2–3 an Zweigenden: fraktal, ein großes Büschel, zwei mittlere, mehrere einzelne.
- **Fallobst:** liegt rund um den Baum unter der Krone, bergab etwas mehr, und rollt in die nächste Mulde. Wo Bewohner ernten, liegt keins: Dort steht ein Korb oder eine Kiste.
- **Größe:** reife Kugeln etwa 0,25 H, junge kleiner. Farbe aus der Biom-Zeile (Akzent der Farb-Grammatik). Keine Verläufe.

## 6 · Saum aus der Geschichte statt aus der Zählung

- Jedes Saum-Element beantwortet: **Wer oder was hat es dorthin gebracht?**
  - Wasser: Kehle, Senke, Ufer.
  - Schwerkraft: abgeplatzt, bergab.
  - Wind: Lee, angewehter Sand.
  - Menschen: Spuren, Lager, Ernte.
  - Wachstum: von einer Quelle aus.
- Die Menge folgt aus der Ursache. Wo keine Ursache wirkt, liegt nichts. „3–8 Überlappungen je Objekt“ ist keine Regel mehr (H8 neu).
- **Übergänge** am Fuß (Erde, Sand, Fels) sind Gewichte an die Masken (`aTW`) und werden als `kfbLayer` gesprenkelt.
  - Kein Farbverlauf, kein Alpha, keine Abdunklungs-Scheibe (Bauanleitung §11).
  - Dunkelheit am Fuß entsteht durch Eingraben, Schatten und AO.

## 7 · Biom-Zeile (für `BIOMES` in island.js)

Vorschlag für die Felder, die die Environment-Seite beiträgt, zusätzlich zu `pal`, `sky`, `terr`, `under`, `lmk`, `house`:

```js
wueste: {
  // … R2D-Felder (pal, sky, terr, under, lmk, house)
  roles: 'wueste',              // ENV_ROLES: Boden, Gras, Stein, Rinde, Laub, Blüte, Wasser, Akzent (je hell/mittel/dunkel)
  story: { ursprung, lebensader, landmarke, arbeit, spuren, natur },   // das Raster oben, als Text
  nature: {                     // Arten nach Set-Hierarchie (primär KayKit, Tiny Treats, Kenney Nature; Ergänzung Quaternius)
    anchor: ['q:PalmTree_2'], companion: ['q:PalmTree_1'], accent: ['tt:grass_A'],
    stone: ['kk:Rock_3_A', 'kk:Rock_3_H'], shrub: ['kk:Bush_3_C'], dead: ['kk:Tree_Bare_2_A'],
  },
  saum: { stone: 'sand-lee', palm: 'shore-reed' },   // Saum-Rezepte nach Ursache (§6), aus dem Bauweise-Blatt
  fluff: { on: ['anchor'], colour: 'accent', harvest: 'lager' },
}
```

Masken, Höhe und Gewichte bleiben beim Lab. Die Environment-Seite liefert je Objekt nur:
- Fußlinie;
- Einbettung (sink, rise, falloff, downhill);
- Gewichte (Fels, Erde, Sand) für die Sprenkel.

Sie färbt das Gelände nicht selbst.

## 8 · Übergangsarten je Material und Lesart (Georg 2026-10-08)

Übergänge sind nie Verlauf, Alpha, gerade Linie oder Rausch-Gesprenkel, und nichts wirkt abgeschnitten (QA §01, `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`). Welche Art sie haben, hängt vom Material und von der Cartoon-Lesart des Bioms ab. Sie ist ein Feld in der Biom-Zeile.

| Art | Wofür | Bauweise |
| --- | --- | --- |
| **Sprenkel** (`kfbLayer`) | Erde, Sand, Pflaster, Fels am Fuß, Gras → Erde unter der Kante | Gewichte je Vertex (`aTW`); große Knetflecken, mittlere und kleine Tropfen nach außen, Rücktropfen (Bauanleitung §4) |
| **Zackenkappe** | Schnee- und Frostkappen auf Kuppen, Bergen und Felsen, cartoonig (Referenz: `docs/style-references/georg_2026-10-08_schneekuppen_zacken.png`) | Unregelmäßige Säge aus **Knetzungen**, nicht aus Schnitten. Die Zähne sind verschieden breit und lang, zeigen bergab und sind stellenweise leicht versetzt wie zwei Lagen. Spitzen und Kehlen sind gerundet wie gedrückte Knete. Hart ist nur der Knetrand, wie bei `kfbBlend`, nie eine gerade Linie. An den Zungenspitzen lösen sich einzelne kleine Knetflecken (`kfbBlend`, kleine Größe) wie Tropfen. Die Grundlinie ist großräumig gewellt. Mehr Schnee liegt auf der Schattenseite und in Mulden. Kein Verlauf, kein Weichzeichner (§01). |
| **Flocken** (`kfbLayer` mit Schnee) | Schnee im Cozy- oder Weihnachts-Kontext | Wie Sprenkel, das Gewicht kommt aus Höhe und Exposition; Schneetupfen zerfallen nach unten in Flocken. |

Biom-Zeile: `transitions: { ground: 'sprenkel', snow: 'zacken' | 'flocken' | null }`. Schnee-Biom „cartoon“ nimmt `zacken`, ein Festtags- oder Cozy-Biom `flocken`.

## 9 · Inselböschung (Georg 2026-10-08)

- **Form:** Die Oberseite geht mit einer natürlichen Rundung in den Erdfels der Unterseite über (Viertelkreis-Schulter, Bauanleitung §5). Keine Schnittkante, kein Wulst.
- **Übergang:** Standard ist das organische Dot-Muster (`kfbLayer`). Er sitzt entweder noch auf der Oberseite oder auf dem Weg nach unten über die Rundung.
  - **Gras-Biome:** Das Gras wächst ein Stück über die Böschung. Grasflecken und -tropfen werden nach unten kleiner und gehen in die Erde über; Erdtropfen reichen zurück ins Gras.
  - **Schnee-Biom:** Am Rand ist der Schnee abgetaut und geht über Tropfen in die Erde über (Lesart „getaut“, nicht „abgeschnitten“).
- **Vorerst nicht:** zusätzliche modellierte Unebenheiten in der Böschung. Erst die Grundlagen sauber, später nachrüsten.


---

## Quelle: ISLAND_ANATOMY_RULES.md

# Insel-Anatomie · gemessen an den StreakByte-Basis-Modellen (2026-10-08)

Gemessen in `/originals.html` mit `__kfb.analyze(id)` an acht Basis-Modellen (Hafen, Fluss, Garten, Strand, Höhle, Eis, Teich, Wald). Alle auf 60 m Breite (W) normiert. Rohdaten: `tools/out/measure.json`.

## Messwerte

| Insel | Platte / W | Tiefe unter der Platte / W | Zapfenspitzen | mittlere Kantenlänge / W | Dreiecke |
| --- | --- | --- | --- | --- | --- |
| Hafen | 0,026 | 0,43 | 6 | 0,068 | 1.585 |
| Fluss | 0,013 | 0,44 | 2 | 0,068 | 1.156 |
| Garten | 0,037 | 0,51 | 22 | 0,087 | 700 |
| Strand | 0,041 | 0,51 | 3 | 0,053 | 3.001 |
| Höhle | 0,023 | 0,43 | 5 | 0,064 | 1.615 |
| Eis | 0,019 | 0,46 | 13 | 0,031 | 9.991 |
| Teich | ~0 | 0,52 | 27 | 0,050 | 2.402 |
| Wald | 0,037 | 0,51 | 34 | 0,107 | 576 |

Breite der Unterseite (Anteil des Inselradius) bei 0 / 10 / 20 / … / 100 % der Tiefe, Mittel aus Hafen, Strand, Höhle, Eis, Teich, Wald:

`1,0 · 0,9 · 0,82 · 0,74 · 0,67 · 0,59 · 0,53 · 0,44 · 0,37 · 0,27 · 0,17`

## Die Bauregel

1. **Dünne Platte.** Grasnarbe 2–4 % von W, darunter sofort Erde. Keine dicke Plattenwand.
2. **Tiefe Masse.** Die Unterseite ist fast **halb so tief wie die Insel breit** (0,43–0,52 W). Meine Versuche waren mit 0,3 W viel zu flach.
3. **Gleichmäßige Verjüngung.** Die Breite nimmt fast linear ab, etwa 7–8 % des Radius pro Zehntel Tiefe. Die Flanken sind gerade bis leicht gewölbt, nie ein Teller mit Spitze.
4. **Tropfsteinfeld statt Spitze.** Die Oberfläche der Masse bricht in viele hängende Zapfen auf: 5–35 lokale Tiefpunkte, verteilt über 10–90 % des Radius, auf Tiefen zwischen 25 und 100 % (die meisten zwischen 50 und 100 %). Der tiefste Punkt liegt außermittig (7–56 % des Radius).
5. **Große Facetten.** Mittlere Kantenlänge 3–11 % von W, 600–3.000 Dreiecke pro Insel. Flache Schattierung.
6. **Ein geschlossenes Mesh.** Keine angehängten Einzelteile, keine Lücken.

## Wie der Generator das baut

- Grundkörper: Ringe vom Umriss nach unten, Breite nach der gemessenen Kurve.
- Tropfsteinfeld: Die untere Fläche wird in Zellen geteilt (Voronoi). Jede Zelle bekommt einen eigenen Tiefpunkt in zufälliger Tiefe nach der gemessenen Verteilung. Die Fläche wird dorthin gezogen, sodass viele unterschiedlich lange Zapfen entstehen, alles in einem Mesh.
- Prüfung: dieselbe Messfunktion auf die generierten Inseln, Abweichung zu den Originalwerten als Zahl.


---

## Quelle: KONZEPTBLATT_KFB_PLACE_R1.md

# Konzeptblatt · kfb-place R1 · Kern-Modul für Umgebung, Props und Natur · WS0 · 25.10.2026 (V-748, V-749)

**In einem Satz:** Ein Regelwerk mit Kachel-Datei und einem Löser legt jede Zelle der prozeduralen Welt nach unseren Regeln an. Proof-Bild und Spiel zeigen deshalb bei gleichem Seed dasselbe Bild.

**Grundlage:**
- Prüfbericht `replies/AUDIT_PLACEMENT_CORE_R1.md`;
- Kanon Gebiete 2, 3, 4, 15, 16, 17;
- Entscheide V-749 zu den Widersprüchen;
- Auftrag Prozedurale Welt (Hub b223, V-746).

## 1 · Was das Modul ist
| Teil | Datei | Aufgabe |
|---|---|---|
| Regelwerk | `CANON_3D/lib/kfb_place.r1.json` (`kfb.place/1`) | Die einzige Zahlenquelle: Einheiten (Meter), Einsinken je Objektart, Gruppen, Nester, Kontakt, gebaute Ordnung, Dichte-Bänder, Masken, Einbettung (aus N36), Abschlüsse (aus `kfb_edge`), Fluff (aus `grammar.js`), Rezepte, Biome, Kompatibilität, Kacheln mit Sockets |
| Löser | `kfb-place-core.v1.mjs` + CLI | Rein und deterministisch über den Seed, ohne three.js und ohne bpy: `placeChunk`, `solveLocal` (lokales WFC), `embedStamp` (nur auftragen) |
| Rezept | `kfb.place-recipe/1` | Die Ausgabe je Zelle: Instanzen, Gruppen, Rollen, Einsinken, Stamps, Höhen-Deltas, Regel-Bericht |
| Blender-Adapter | `kfb_place_bpy.py` | Rezept → Import → Knete → `kfb_env_bpy.place` → Proof-Stage |
| Laufzeit-Adapter | im Spiel, ersetzt `placeCell` in `endlessVeg.js` | Rezept → BatchedMesh in 64-m-Zellen, Wind je Gruppe, hinter `veg=core` |
| Gate | `kfb_env.gate` liest dieselbe JSON | prüft das Rezept: ENV-Gruppe, ENV-Kontakt, ENV-Einsinken, ENV-Ordnung, Ü1–Ü7, Ursache E7 |

## 2 · Wie eine Zelle entsteht (vier Ebenen)
1. **Zone (Makro):** 2–4 Gruppenkeime auf der Maske. Negativraum ≥ 30 %, der Fokusplatz bleibt frei, die Landmarke ist am höchsten.
2. **Gruppe (Meso):**
   - Ein Rezept wählen, zum Beispiel Baumgruppe: Anker + 3 Stützen + Akzent.
   - `solveLocal` belegt die Plätze mit Kacheln: ein Kit je Gruppe, Größen 1 : 0,62 : 0,38 (Toleranz 0,20), keine Klone, Wiederholung ≤ 3.
   - Danach Nest-Prüfung (≤ 0,85 × oder ≥ 1,25 ×), Lehnregeln, Einsinken nach Objektart und Hang.
3. **Mikro:**
   - Kontakt-Geometrie mit Ursache auf 40–50 % des Umfangs, Lücke ≥ 25 %, keine Kränze.
   - Kiesel und Fallobst hangabwärts, Fluff an den Ankern.
4. **Ränder:**
   - Am Biom-Rand werden Übergangs-Familien gewählt (Ausdünnen der Arten, Steinband). Der Boden selbst bleibt Sprenkel.
   - An Bauten kommt die Abschluss-Form aus `kfb_edge` (freies oder gebautes Ende).

**WFC darf:** Plätze in Gruppen belegen, Raster-Module mit Sockets legen (B29-Mauern, Hex-Straße, Küste und Fluss, Zäune, Hecken) und Übergangs-Familien wählen.

**WFC darf nie:**
- Landmarken, OSM-Gebäude, Straßennetz oder Geländehöhe anfassen;
- ein globales Natur-Raster legen;
- Kit-Teile verformen.

Landmarken und Dioramen sind feste Stamps, um sie herum läuft nur die Einbettung (V-716).

## 2b · Fluff und Fundstücke (Georg 25.10.)
**Fluff an Bäumen und Sträuchern** wird mit platziert, nach der abgenommenen Bauweise und der B2-R2-Grammatik:
- Am Baum sitzt der Fluff in der Krone an der Lichtseite: ein Hero-Nest plus 0–2 Neben-Nester. Am Strauch greifen 1–2 Nester unter den Rand.
- Kahle Bäume tragen keinen Fluff.
- Je Nest 5–7 Kugeln (1 groß, 3 mittel, 1–3 klein; B2-R2 Variante A als Startwert, Georg wählt am P0-Bild). Je Nest eine Farbe aus dem Candy-Band gegenüber dem Laub (V-305), nie Oliv auf Grün. Keine Zufallsfarbe je Kugel. Die Zonenmischung (V-368) kommt erst nach P0.
- **Ernte basic:** gestaffelt nach V-423 (im Schnitt 3 Schläge, 2 Schüsse oder 1 Explosion leeren einen Baum; Abwurf 1–2, dann 3–4, dann alle). Es springt 2–3-mal, rollt hangabwärts und wird bei Kontakt aufgesammelt und im Gesamt-Fluff gezählt.
- „Kein Fluff ohne Herkunft.“

**Fundstücke** (optional, höchstens eins je Zelle):
- Darstellung nach V-450/V-453: 15 cm über dem Boden, langsam drehend, sanft auf und ab, längliche Teile schräg 35°. Aufnehmen bei Kontakt. Nur Paket-Varianten (V-434), für P0 eine Axt oder eine Brotzeit.
- Platz nur mit Ursache aus der Ortsbiografie, also am Stumpf, unter dem Baum oder am Wegrand.

Beides steht im Regelwerk und im Rezept. Jede Instanz trägt ihre Rolle (`fluff_nest`, `find`), damit Blender und Spiel sie gleich zeigen.

## 2c · Farbharmonie für Gelände, Fluff und Fluids (Georg 25.10.)
- **Eine Farbregel für alles:** COLOR_HARMONY_R1 (V-305). Der Boden trägt den Grundton jedes Bioms, daraus folgen Strecke, Blickfang, Laub, Himmel, Fluff und Fluids. Das Regelwerk nennt die Regel einmal, Gelände-Shader, Fluff und Fluids lesen dieselben Rollen.
- **Fluids als Rezepte:** Der Gelände-Shader kennt schon Wasser, Kaugummi und Säure. Jedes Biom wählt seine Fluid-Art, die Farbe kommt aus der Harmonie:
  - Wasser: nasser Saum, Tiefenstufen;
  - Kaugummi-See im Candy-Band: rosa Schlieren, zähe Wellen, langsam platzende Blasen;
  - blubbernde Säure im Gegenton zum Boden: Ufer verätzt.
- Es gibt einen Fluid-Shader, die Art ist ein Parameter. Owner ist WS1c, das Licht kommt aus dem einen Rig.

## 2d · Einbettung als Pflicht-SOP (Georg 25.10., V-753)
Jedes Prop, Diorama, jede Landmarke und jede andere Terrain-Einbettung läuft durch dieselben Schritte, so wie wir sie in den Blender-Dioramen erarbeitet haben (N36, Steinkit, K8, B29):
1. Fußabdruck und Maske aus der Kachel.
2. Düne bzw. Schürze nur auftragen, Profil Anschluss → Düne → Auslauf, Lee-Seite länger. Flanke ≤ 22°.
3. Sockel zu 15–25 % vom Gelände bedeckt, keine Stufe über 2 cm an der Kontaktlinie.
4. Eingänge frei, Rampe ≤ 15°.
5. Steinbänder in drei Ringen aus dem Steinkit, gerundet und eingesunken.
6. Abschluss je Kante: freies Ende durch Verfall oder gebautes Ende. Harte Kanten (Dungeon-Generator, Kachelfelder, Mauern, Plinthen) werden organisch abgerundet, dazu kleine gerundete Rubble- bzw. Ruinensteine und Staub als sauberer Übergang, nur wo nötig (V-754).
7. Kontakt-Geometrie mit Ursache.
8. Bodenübergang als Sprenkel.
9. Gate auf dem Rezept.

Sand-Dünen als Geländeform in Wüsten-Biomen gehören dem einen Höhen-Owner (WS1b). kfb-place setzt Rezepte und Einbettung darauf.

## 2e · Lückenfelder (Georg 25.10., V-755)
- Die Lücken zwischen Straßen, Modellen und Gelände werden über Voronoi-Felder gefüllt. Straßenkanten, Fußabdrücke und Stamps sind die Keime, die Zellen sind die Lückenflächen.
- Jede Zelle bekommt ein Füll-Rezept nach Ursache: Schatten gibt Moos, Abfluss gibt Kies, Sonne gibt Blüten und Gras, der Hangfuß gibt Rubble.
- Das Zellmuster ist nie sichtbar: keine Linien an den Grenzen, die Grenzen sind Sprenkel. Voronoi ordnet nur, was wohin gehört.
- Stand: Konzept, im Löser ab v2.

## 3 · Erste Probe P0 (eine Zelle)
- **In einem Satz:** „Diese Lichtung zeigt einen alten Waldrand am Hang, weil der Wind das Laub hangabwärts treibt, und der Spieler sieht zuerst den Baumstumpf mit Fluff.“
- **Ort:** 64-m-Zelle im Biom `moos`, fester Seed. Ein Kit je Gruppe: Bäume und Büsche aus KayKit Forest, Stumpf und Holzstücke aus Quaternius Ultimate Nature (`TreeStump` mit heller Schnittfläche, `WoodLog`/`WoodLog_Moss`; V-775, Kenney nicht mehr); Steinnest und Wegspur aus Steinkit v4. Das Busch-Nest liegt 4,5 m neben dem Stumpf zur Sonnenseite.
- **Gruppen:**
  - Baumgruppe (1 Baum, 3 Büsche, 1 Akzentstein);
  - Busch-Nest;
  - Steinkit-Nest am Hang.
- **Fester Stamp:** ein Baumstumpf als Mini-Landmarke; er darf nicht umgeordnet werden. Das Fundstück entfällt in P0 (keine Kachel, V-775).
- **Fluff:** Baumgruppe und Busch-Nest tragen farbige Fluff-Nester, ein Schlag löst Fallobst, das sich aufsammeln lässt.
- **Ortsbiografie (alle vier Schichten als Instanz):**
  - Entstehen: der alte Waldrand-Baum (Anker der Baumgruppe);
  - Nutzen: Abfuhrweg als Steinspur vom Rand zum Stumpf. Steine und Fragmente sind organisch verteilt nach V-578: heiler Kern, dann verwittert gerundete Stücke dicht → locker, einzelne fehlen, Erde in der Lücke, keine Reihe (Georg-TUNE q201). Übergang als Sprenkel;
  - Vergehen: der gefällte Stamm wird zum Stumpf. Er ist die Signatur, dazu zwei Echos (Holzstücke desselben Stamms). Am Stumpf mindestens zwei Gebrauchsspuren: Sägeschnitt (die flache Schnittfläche des Kits), Moos auf der Schnittfläche (Knet-Element aus dem Löser), dazu die zwei Holzstücke; eine Axtkerbe bringt das Kit nicht mit und wird nicht modelliert;
  - Bewachsen: Moos und Büsche in den Fugen, Busch-Nest.
- **Bilder:** Blender-Proof und Spiel hinter `veg=core`, gleiche Kamera, A/B gegen die heutige Vegetation. Echtes Terrain, sobald der Höhenfeld-Export greift, sonst als Platzhalter markiert.
- **Style-Frames (V-740, V-752, V-775):** WSB baut die vier Frames aus dem Rezept mit Adapter und Gate (N40): Lichtung am Hang, Stumpf mit Fluff im Busch daneben, Fallobst rollt hangabwärts, Steinnest. Georg nimmt sie ab; danach folgt der Laufzeit-Einbau. Bodenübergänge fehlen in diesen Frames bewusst, bis es ein Blender-Gegenstück zum Sprenkel-Modul gibt (V-403, V-749 Nr. 11); der Kritiker wertet K4 dafür als offen, nicht als FAIL.
- **Gate:** Das Rezept läuft durch `kfb_env.gate`, dann urteilt der blinde Kritiker nach CRITIC_3D_R1 gegen dieses Konzeptblatt und die Bild-Vorlagen (Bauweise-Tafel, Etherington-Probe, B2-Bäume, Friedhof r24). Danach gehen die Frames an Georg; mit seiner Abnahme ist P0 die Vorlage.
- **P1:** dieselbe Zelle mit Biom-Rand `moos` → `wueste` und einem B29-Mauerstück mit freiem Ende.

### P0 · Konzeptfelder (Vorlage KONZEPTBLATT_R1)
| Feld | P0 |
|---|---|
| `focal` | Stumpf mit Moos auf dem Schnitt, daneben das Busch-Nest mit dem Fokus-Fluff; gewinnt über Form (einziger Schnitt im Bild, hellster Wert) und Akzentfarbe des Fluffs (eine Farbe, Heroic). Leserichtung: Steinspur → Stumpf → alter Baum |
| `space` | Vorne Wegspur und Kiesel, Mitte Stumpf und Busch-Nest, hinten Baumgruppe und Steinnest am Hang. Negativraum ist die freie Lichtung. Ruhe/Struktur/Bedeutung 70/20/10, stärkster Kontrast am Stumpf |
| `palette_roles` | Boden-Grundton Biom `moos` nach COLOR_HARMONY_R1; Laub natürlich; Stein und Rinde aus der Insel-Palette; Fluff im Candy-Band als Akzent (eine Farbe je Nest, ohne Karten-Dreier Heroic) |
| `color_script` | ruhige Mittagsstimmung, ein Licht-Rig; verboten: Neon-Flächen, zweite Lampe, Zufallsfarben |
| `form_dna` | runde Kronen, gerundete Steine, Kugel-Fluff; sekundär Schnittfläche und Wegspur; verboten: harte Kanten, Kachelmuster |
| `life_anchor` | Fluff wiegt im Wind je Gruppe; zwei Fallobst-Kugeln aus dem Hero-Nest sind hangab gerollt und liegen in der Mulde bzw. am Stein |
| `material_codes` | Moos in Fugen (Dreiergruppen), Steinkit-Kiesel hangabwärts, KayKit-Rinde mit Knete |
| `story_beat` | eingefrorener Moment kurz nach dem Holzfällen: Stamm weg, Fluff wächst nach |
| `cameras` | die vier festen Kritiker-Kameras plus Spielkamera |
| `reference` | Bauweise-Tafel, Etherington-Probe, Farbgrammatik (Prinzip), B2-Bäume (Georg-getunt), Steinkit v4, Friedhof r24 |

## 4 · Wer was macht
| Teil | Owner | Erste Lieferung |
|---|---|---|
| `kfb_place.r1.json`: Zahlen nach V-749, Rezepte und Story-Vorlagen für P0 | WS0 | R1 aus `kfb_env`, `n36_rules`, `kfb_edge_params`, `GRAMMAR`, Biom-Liste |
| Kacheln messen (Hülle, Höhe, Ruhelage, Einsinken, Anker, Sockets) und Asset-Pass je Teil | WSB | KayKit Forest 84, Steinkit 82, B29 28 |
| Löser + CLI + Golden-Test (gleicher Seed = gleicher Rezept-Hash) | WS1b | Natur ohne Sockets |
| Blender-Adapter + Gate-Erweiterung (ENV-Präfix mit Zuordnungstabelle alt → neu, gebaute Ordnung, Kontaktfenster; `kfb_env` liest RULES, NEST, SINK aus der Regeldatei) | WSB | P0-Proof |
| Laufzeit-Adapter `veg=core` (Standard bleibt bytegleich) | WS1b | P0 im Spiel |
| Höhen-Delta, Sprenkel, Laufzeit-Abschlüsse | WS1 Lead | nach P0 |

## 5 · Referenzbilder (Bild-Paket, Hub)
- Georg-getunte KayKit-Baumgruppen aus B2 (organische Grüppchen, nichts piekt durch);
- Steinkit v4 (Steine) und das freie Ende nach V-578 als Verteilung; Georg-TUNE q201: Steine und organischer verteilte Fragmente, kein Holz;
- B29-Mauer r4 (abgenommen q32).

Das Zielbild ist ein einziges handgemachtes Objekt (Kanon Gebiet 16), keine Streuung.


---

## Quelle: LIGHT_MODEL_R2.md

# Licht-Modell R2 · ein Licht für alle Stimmungen (V-382, V-385) · 17.10.2026

Georg 17.10.: V-346-Licht auf der Staging-Seite = FAIL bzw. großes TUNE, auch konzeptionell. Grundlage dieser Fassung: WS0-Sichtprüfung (Tag/Gold/Nacht) + **Audit aller Licht-Recherche** `LIGHT_RESEARCH_AUDIT_R1.md` (28 Quellen, 21-Zeilen-Matrix, KayKit-Vorgehen).

## Ehrlicher Befund
WS1 hat die gemessenen Werte unserer Recherche übernommen (J17-Tageslicht, Sonnenrichtung, E50-Goldstunde, Texel-Schatten), aber die **Prinzipien** gingen verloren. **Drei der fünf Fehler hat WS0 selbst bestellt**: Randlicht (L2 Schritt 1), Gesichts-Selbstleuchten (V-346 Punkt 1), getrenntes Tonemapping `toneSplit` (V-346 Punkt 3, V-378) und die unbeleuchtete Karte (WS0_TO_WS1 „Kartenfläche bleibt toneMapped:false“, Prüfung G3). WS1 muss nichts „reparieren“, was es auf Auftrag gebaut hat – R2 ersetzt diese Aufträge.

| Fehler | Ursache (Audit-Beleg) |
|---|---|
| Saum um FrizzleBob | drei helle Terme auf der Silhouette: Fresnel-Randlicht `actorRim.js` (#ffb066, 0,55) + Clay-**Sheen** 0,18 (nur GothGirl auf 0,06 gesenkt) + Look-B-violettes Gegenlicht |
| Karte nachts taghell | `MeshBasicMaterial`, `toneMapped:false` (`billboard.js:60`, `meshyStage.js:51`) – von WS0 so verlangt |
| Rahmen nachts weg | keine Praktischen am Amphitheater; gelieferte Goblin-/Atlantis-Praktische nicht eingebaut (`practicals: []`); Himmel/Nebel nachts 35 % Helligkeit, dunkler Rahmen verschmilzt |
| Gold ≈ Tag | E50 ist Mittelwert Abend/Tag; Look B wärmt schon den Tag; kühler Gegenakzent sitzt am Gegenlicht statt an der Füllung; Himmelshelligkeit unverändert |
| Figuren aufgeklebt | eigenes Randlicht + `faceFill` konstant über die Tageszeit; `toneSplit` = andere Tonkurve als die Bühne; Hemi-Boden konstant statt `edgePalette`; vier Materialklassen reagieren verschieden; nur Kontakt-Klecks, kein AO |

**KayKit-Vorgehen (unsere Tutorial-Lektion A):** eine Umgebung für die ganze Szene, Nacht = dieselbe Szene dunkler; „Characters consume that scene light; they do not carry a second private world-light rig“; ein Schatten-Hauptlicht von oben, Fackeln nur als Akzent, matte Materialien (Rauheit ≈ 0,95), Kontaktschatten unter jedem Teil, Leuchten über Emissive-Material, nicht Lampe je Teil.

## Grundsatz
**Eine Szene, ein Licht-Rig, ein Ton-Pfad, eine Material-Antwort.** Stimmungen sind Einstellungen dieses Rigs. Keine Karte und kein Boden hat ein privates Licht; Figuren haben genau ein echtes, warmes Figurenlicht als Teil des Rigs (Regel 11), keine Tricks.

### Die zehn Regeln
1. **Silhouette:** Fresnel-Randlicht entfernen **und** Figuren-Sheen ≤ 0,05 im selben Schritt (mit Schaltern belegt). **Korrektur 17.10. (V-392, Beleg WSB):** auch das J17-Gegenlicht (#ffe6d6 0,6 von hinten) malt den Saum an die Schattenseite – **standardmäßig aus**; Trennung über warmes Figurenlicht von der Kameraseite (Regel 11) und Kontakt-AO. Ein Gegenlicht nur als bewusste Lichtregie-Ausnahme (Teil B), nie Standard.
2. **Gold** = tiefe, warme Sonne **plus kühlere Füllung**; Himmelshelligkeit ändert sich mit. Füllung nicht wärmer und nicht dunkler machen (sonst Wiederholung von V-050 „zu orange und zu dunkel“).
3. **Look-B-Sättigung im Licht streichen:** Wärme kommt nur aus Himmelstönung, Boden-Rückstrahlung und Hauptlicht.
4. **Hemi-Boden = `edgePalette` der Bühne** (V-355); ersetzt `faceFill` als Aufhellung von unten (Kinn, Mund).
5. **Ein Tonemapping für alle Schichten**, gewählt per Test bei **fester Belichtung**: ACES vs. Neutral (Lab) vs. AgX (ClayBound-Recherche). `toneSplit` entfällt.
6. **Nacht nach KayKit:** Mond + Hemisphere tragen die Lesbarkeit; Praktische sind **Licht-Inseln** (≥ 2 je Nachtbild), keine Belichtungsanhebung. Zuerst die gelieferten Praktischen (Goblin 12, Atlantis 11) einbauen.
7. **Billboard-Lampen** aus den Lampenarmen des Highway-Spenders: Emissive-Köpfe folgen dem Nachtgewicht, plus ein Pool-Licht auf Rahmen und Karte. Neue Messgröße: Rahmen-zu-Hintergrund-Kontrast.
8. **Karte = beleuchtetes, mattes Papier.** Neue Prüfung G3: Druckfarbton und Chroma bleiben, Helligkeit darf der Stimmung folgen.
9. **Gleicher Licht- und Ton-Pfad für jede Materialklasse** (Clay, Karte, Meshy, Fahrzeug; Metall mit PMREM nach V-370). AO-Probe im Budget V-370.
10. **Raster vollständig:** V-355-Messung je Schicht, Clipping < 0,1 %, G2/G4, 16:9 **und** 9:16, erster Durchgang mit fester Belichtung. Lichter-Budget = V-329-Pool (4–6) + fps-Budget V-370.

### Regel 11 · Figurenlicht wie im Cartoon (Georg 17.10., V-386)
Figuren bekommen ein **eigenes, warmes Figurenlicht**, damit Gesicht, Augen, Brauen und Mund (Eyes/Brows/Mouth as Actors) in jeder Stimmung gut lesbar und knuffig ausgeleuchtet sind – nie im Halbschatten, nie überstrahlt. Das ist kein Widerspruch zu „ein Rig“, wenn es **richtig gebaut** ist; gescheitert ist nur die falsche Bauweise (Fresnel-Saum, Selbstleuchten, eigene Tonkurve).
- **Echtes Licht, kein Trick:** ein weiches, schattenloses Licht (Spot/Rect mit weicher Kante) von vorn-oben auf Kamera-Seite, auf die sprechende Figur bzw. Dialog-Gruppe gerichtet; Farbe warm (≈ 3200–4000 K). Kein Fresnel, kein Emissive, gleiche Tonkurve wie die Szene.
- **Stimmungsabhängig:** tags kaum sichtbar (Gesicht folgt der Sonne), Gold mittel, nachts stärkster Anteil – Gesichter bleiben lesbar, auch wenn die Bühne dunkel ist (Cartoon-Konvention).
- **Gehört zur Szene:** fällt mit Abfall auch leicht auf den Boden direkt um die Figur (kein Ausschluss per Licht-Layer), dadurch kein „aufgeklebt“. Motivierbar durch Billboard-, Laternen- oder Mondlicht.
- **Augenlicht:** kleines Glanzlicht in den Augen (Catchlight) aus demselben Licht, für lebendige Augen.
- **Budget:** ein Figurenlicht pro Dialog-Gruppe, zählt im V-329-Pool.
- **Messung (L-9):** Gesichts-Helligkeit in jeder Stimmung im Zielband (nicht unter Bühnen-Mittel × 0,9, Clipping im Gesicht < 0,1 %); Mundzone vs. Stirn ≥ 0,85 (kein Halbschatten über dem Mund); Farbtemperatur im Gesicht warm; Saum weiterhin ≤ 2 px.

### Stimmungen = Rig-Einstellungen
| Stimmung | Hauptlicht | Füllung (Hemi) | Gegenlicht | Praktische | Himmel |
|---|---|---|---|---|---|
| Tag | J17-Werte (#fff4e6 / 2,9) | J17 Himmel #eef4fa, Boden = edgePalette | aus (V-392) | Emissive aus | J17, nur getönt |
| Gold | tief, warm-orange | **kühler** als Tag | aus | schwach (Emissive) | dunkler, wärmer |
| Nacht | Mond, kühl, schwach | dunkelblau, Schatten lesbar | aus (Figurenlicht trägt) | Inseln an (Billboard + Bühnen-Praktische) | dunkel, Rahmen hebt sich ab |
| Story-Modes (später) | nur Tönung von Boden (V-305/V-331) und Praktischen | | | | |

### Ausdrücklich geändert (Register)
- V-378 Satz „Tonemapping bleibt ACES im Renderer (toneSplit)“ → ersetzt durch Regel 5.
- G3 „Kartenpixel unverändert“ → ersetzt durch Regel 8.
- BILLBOARD_STANDARD_R2 „keine Zusatzteile“ → Ausnahme: Lampenarme/Leuchtköpfe nach Regel 7.
- L-7 „≤ 2 echte Lichter“ (R2-Entwurf) → V-329-Pool + V-370-Budget.
- Gegenlicht: standardmäßig aus (V-392, WSB-Beleg Saum), nur als Lichtregie-Ausnahme.

## Abnahme-Raster
| ID | Prüfung | Schwelle |
|---|---|---|
| L-1 | Rahmen lesbar in jeder Stimmung | Rahmen ≥ 25 % der Kartenhelligkeit; Rahmen-zu-Hintergrund-Kontrast ≥ 1,5 : 1 |
| L-2 | Karte nie heller als ihr Licht | nachts Karte ≤ 1,5 × Rahmen; Druckfarbton/Chroma ΔE ≤ 5 zur Tagfassung |
| L-3 | kein Saum | ≤ 2 px bei 1080p an allen Figuren, alle Stimmungen |
| L-4 | Stimmungen unterscheidbar | Bildmittel Tag↔Gold ΔE ≥ 8, Gold↔Nacht ≥ 12 |
| L-5 | Figuren gehören zur Bühne | Gesicht ↔ Boden daneben 0,8–1,6; V-355 je Schicht Helligkeit/Sättigung ≤ 15 % Abstand |
| L-6 | Schatten/Clipping | Schattenkontrast tags ≥ 25 %, nachts Schatten L ≥ 8; Clipping < 0,1 % |
| L-7 | Nacht-Inseln | ≥ 2 Licht-Inseln je Nachtbild |
| L-9 | Figurenlicht | Gesicht ≥ 0,9 × Bühnen-Mittel, Clipping Gesicht < 0,1 %, Mund/Stirn ≥ 0,85, warm |
| L-8 | Budget | V-329-Pool, p95 ≥ 30 fps Zielgerät, ≤ 300 Draw Calls |
Beweis: 3 Stimmungen × (Totale, Nah FB, Nah Karte) × 16:9 + 9:16, mit Clay, **ohne Overlays** (V-383); erster Durchgang mit fester Belichtung.

---
# Part B · Light direction as staging (V-387, Georg 17.10.) — after L3 PASS
Once the rig is clean (part A), light becomes part of the staging, the way it is in cartoons. The **character light (rule 11)** can be set per moment and per story mode, not just made brighter or darker. Light cues belong to choreography, like dance and mouth.

## B1 · Character light per story mode (direction + colour, not only colour)
| Story mode | Character light | Effect |
|---|---|---|
| Comic | flat, bright, frontal, warm | cheerful, readable |
| Heroic | warm key at 3/4 from slightly below, strong silhouette, back light warm | larger than life |
| Tragic | cool top light, eyes slightly in shadow (mouth still readable) | heavy, lonely |
| Absurd | hard coloured spot from the side, ochre/gold accent | crooked, comic |
| Mystical | violet from below or the side, soft halo of the room (not of the figure) | strange, magical |
| Forbidden | **light from below**, wine red, low face light | spooky, uncanny |
The V-292 colours tint the light. Measurement L-9 (mouth readable, nothing blown out) applies in every mode.

## B2 · Performance light in front of the billboard
- **"Spot on":** when a figure steps up, a spotlight appears in the cartoon way: it pops in with an elastic scale on the cone and a visible soft light cone (additive mesh, no fog volume). It switches on **ahead of time**, half a beat before the entrance.
- **Follow spot** on the lead during their passage. It gets brighter and narrower when the voice gets louder or stands out (from the stem level in `kfb.performance/1`).
- **Disco ball as the climax:** when a deck song is unlocked or the finale is reached, a disco ball appears with light dots wandering over the stage and figures, and the colours change on the beat. Donor candidates: the Resident dance scene, and the birthday start screen (branch `alignment/a0-travel-race-2026-09-17`, `kfb-hub/index.html`); WS1/WSB locate the exact file.
- **Budget:** at most one real spot plus the character light; disco dots as a projected texture or decals, not real lights.

## B3 · Light cues in the data
`kfb.performance/1` gets a `lights[]` track: `{t, type: spot_on|spot_off|follow|disco_on|disco_off|mode, target, storyMode, intensity}`, snapped to beats, with spot_on lead time of −½ beat. The camera has base positions (wide, medium, close) and the light presets are tuned so they work from those positions.

## Ein Modul für alle Bühnen (V-392)
Das Rig dieses Dokuments wird **ein Modul** `kfb-stage-light.v1.js`, Pflicht-Import für jede Spiel- und Beweisbühne (WS1, WSB, ToolBox, Claude-Design-Bühne): Rig (Sonne, Hemi, Figurenlicht, kein Rand-/Gegenlicht), `fitShadow(box)` (Frustum auf Inhalt, Texel-Einrasten, enger Tiefenbereich, normalBias = 1,5 × Texel, bias abgeleitet, PCFSoft), `contactAO(receivers, occluders)` (generisch aus `kfb-lib/contact-ao.v1.js`, Kugeln analytisch, Fuß↔Boden, Prop↔Boden, ohne dunkle Ringe), Selbsttest mit Pixelmessung des Spalts (Fuß/Boden, Kugel/Krone, Kugel/Kugel = 0). Besitzer: WS1 als Teil von L3; WSB nutzt bis dahin seine Fluff-Bühne und stellt dann um.


---

## Quelle: MENTALES_MODELL_WELT_R2.md

# Mentales Modell Welt R2: so baut KayKit (Georg 25.10.: q210/q211 FAIL, „schaut euch die Creator-Videos an“)

Quellen, diesmal wirklich angesehen:
- Kay Lousberg, „Basic Environment and Lighting Setup in Godot“ (YouTube Vfr3n4WKsc0): Bilder bei 5:00, 10:00, 16:40.
- KayKit Medieval Hexagon Pack: Samples/sample1–2.
- KayKit Medieval Builder Pack: Samples/sampleA–E.
- Georgs Farmer-Promo.
- Kays Live-Shows 1 und 9: nur Prop-Modellieren, kein Szenenbau; für das Modell ohne Belang.

## Was dort zu sehen ist

1. **Boden = Materialzonen.**
   - Gras, Feld, Weg, Sand, Wasser und Fels sind Flächen in einer flachen Farbe mit klarer Kante.
   - Ein Weg ist eine Bodenfarbe, gesäumt von einer Mauer, und keine Kette aus Steinen.
   - Erdung macht das Material: Kontaktschatten unter dem Teil, Farbe am Fuß. Steinchen-Geometrie gibt es nicht.
2. **Bewuchs = Massen.**
   - Wald ist eine dichte Masse aus Bäumen, Schulter an Schulter, die eine ganze Zone füllt.
   - Am Rand stehen wenige Einzelgänger. Dazwischen liegt freie Fläche.
   - Kleine Gruppen mit Stützen, Kieseln und Fußgras gibt es nirgends.
3. **Steine = Formationen.**
   - Große, gestapelte Fels- und Klippenblöcke, dazu selten ein einzelner Brocken.
   - Kein Streukies, kein Nest um jede Gruppe.
4. **Wenige, große Teile.**
   - Jedes Teil ist im Bild gut lesbar. Haus, Baum und Fels haben ähnliche Größenordnungen.
   - Im Godot-Bild sind die Bäume fast so hoch wie das Haus.
5. **Gelände.**
   - Weich und hügelig, eine Grundfarbe. Licht und Nebel machen die Tiefe.
   - Die Fließfarben bleiben bei uns, wie Georg es will. Sie sind unser Bodenmaterial, und die Zonen liegen darauf.

## Was wir falsch gemacht haben

Wir haben Mikro-Grammatik gebaut: Anker, Stützen, Kiesel, Kontaktsteinchen, Fußgras, Moosfugen. Jede Gruppe wurde zu einer kleinen Insel und mit Regeln poliert. Das ist „gebastelt“ und Clutter, kein natürliches Verteilungsmuster.

## Neues Modell (zur Freigabe)

- **Ebene 1, Zonen:** Ein Feld aus Rauschen und Ursache (Höhe, Hang, Wasser, Weg) teilt den Boden in Materialzonen: Wiese, Waldboden, Weg/Erde, Fels, Wasserrand.
  - Die Zonen werden in den Boden gemalt (Materialcode).
  - Die Fließbänder bleiben die Wiesen-Textur.
- **Ebene 2, Massen:** In Waldzonen füllt ein Poisson-Feld mit hoher Dichte die Fläche mit Bäumen, Kronen dicht an dicht.
  - Zum Zonenrand nimmt die Dichte ab, dort stehen wenige Einzelbäume und Büsche als Saum.
  - In Wiesenzonen steht fast nichts: selten ein Solitärbaum oder Busch.
- **Ebene 3, Formationen:** Fels nur dort, wo das Gelände bricht (Hangkante, Ufer), als große Formation aus 1 bis 5 großen Blöcken.
- **Ebene 4, Akzente:** Stumpf, Fluff, Fundstück: wenige, gezielt, an der Story.
- **Gestrichen:**
  - Kontaktsteinchen, Fußsteinchen, Moosfugen als Objekte.
  - Grasbüschel als Streu: Gras ist Bodenmaterial, Büschel nur als Saum an Zonenkanten.
  - Kiesel-Nester.

Nächster Schritt nach Georgs Ja: ein Stilbild im Spiel (Zonen + Waldmassen + Wiese) und erst dann Regeln und Löser.


---

## Quelle: QA_RULEBOOK_ENVIRONMENT_R1.md

# QA-Regelwerk Environment R1 · Biome, Natur, Platzierung

Status: **VERBINDLICH für Bau und Kritik** · 2026-10-08 · Georg: „Konzeptlos, belanglos, lieblos hingewürfelt. Die Modelle sind nicht verstanden, es gibt kein Storytelling und kein Farbkonzept.“
Gilt für die Environment-Sitzung (Bauende) **und** den blinden Kritiker. Beide lesen nur diese Datei und die hier genannten Quellen. Georg wiederholt keine Regel mehr.

## 00 · Weltlogik zuerst (Georg, 2026-10-08, gilt vor allem anderen)

> „Es wird keinerlei Storytelling betrieben. Ihr baut es auf die billigste Art, die innerhalb der Anforderungen eine Lösung sein könnte, so dass es von einem Winkel gut aussieht. Ihr habt kein mentales Modell davon, was das innerweltlich ist. Jedes Element erzählt eine eigene Geschichte, genauso wie jede Insel und jede Residency ihre eigene Geschichte erzählt.“

**Pflichtfrage je Element, bevor es gebaut wird:** *Wer hat es gebaut oder wachsen lassen, womit, warum, und was erzählt es?*
- Gilt für jeden Baum, jede Gruppe, jeden Fels, jeden Weg und jedes Requisit, ebenso für die Insel als Ganzes.
- Die Antwort ist ein Satz im Biom-Blatt bzw. Bauweise-Blatt.
- Die Form, der Ort, die Farbe und die Erdung folgen aus diesem Satz, nicht aus der billigsten Lösung, die die Messregeln erfüllt.
- **Ein Element, dessen Geschichte nicht erzählt werden kann, wird nicht gebaut.**
- Messregeln sind die Untergrenze, keine Lösung. Wer nur die Messregeln erfüllt, hat noch nichts geliefert.
- Prüfen aus mehreren Winkeln: Was nur aus einem Winkel funktioniert, ist eine Kulisse ohne Welt.

## 01 · Keine harten Schnitte, keine sichtbaren Kanten (Georg, 2026-10-09, gilt grundsätzlich)

> „Wichtig als Regel scheint mir, dass es da keine harten Schnitte und keine sichtbaren Kanten gibt bei den ganzen Übergängen und dass das alles organisch mit Cartoon-Logik und entsprechendem Knetgummi-Design plausibel erscheint und nicht einfach so abgeschnitten wirkt.“

- **Gilt für jeden Übergang in der KFB-Welt:** Straße, Gehweg, Gelände, Natur, Inselrand, Brücke, Tunnelportal, freistehende Räume, Fluff-An- und Abbau, HUD- und Bühnen-Bauteile.
- **Nichts wirkt abgeschnitten.** Keine Messerkante, keine gerade Schnittlinie, kein Polygonrand, kein Farbsprung an einer Linie, kein Rausch-Gesprenkel, kein Farbverlauf.
- **Gebaute Enden sind Knet-Bauteile:** Kantenstein, Bordsteinkopf, Wandkopf und Portal sind gerundet und weich modelliert und sitzen mit Rubbel bzw. Knetfleck in ihrer Umgebung. Sie haben nie eine rasierte Kante.
- **Freie Enden runden sich durch Wachstum oder Verfall:** Bei erodierten Steinen kippen die Teile, die Ecken runden sich, sie brechen und laufen über Rubbel in einzelne Knetsteinchen aus. Flächen wechseln über `kfbBlend`-Knetflecken in drei Größen.
- **Prüfung:** Kein Kriterium ist erfüllt, wenn aus irgendeiner Prüfkamera eine harte Schnittkante oder eine helle Kante ohne Übergang zu sehen ist. Diese Kanten markiert der Kritiker als Befund (Teil von K9 bzw. U8).
- Details: `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`.

## 0 · Quellen (Wahrheit in dieser Reihenfolge)

1. Dieses Regelwerk.
2. `docs/SPEC_PLACEMENT_GRAMMAR_R1.md`: Zonen, Rule of Three, Erdung, Wasser.
3. `docs/SPEC_ENVIRONMENT_KIT_R1.md`: Kits, Zielhöhen pro Rolle, Instanzierung, Budget.
4. `docs/SCALE_CONTRACT_K2.md`: H = 3,64, MacroCell = 6,4, keine Meter.
5. **Referenzbilder:**
   - `~/Dropbox/CLAUDE/KFB Claymation Reference/` (DioramaScenes A–I, FLOATING ISLANDS DESIGN);
   - Joyride `track-look.v5.js` (Paletten Canyon, Bikini-Bucht, O-Town; Kronen, Kissentürme);
   - `georg-doc/kayfabizarro` Branch `planning/style-reference-library-r1-2026-10-05` (Style-Reference-Library).
6. Paletten: `src/palettes.ts`.

## 0b · Georgs Entscheidungen 2026-10-08 (abends)

1. **Kein Kneten:** Die Kit-Modelle werden nicht rund geknetet, sondern richtig eingesetzt. Die „harten Kanten“ waren ein falsches Bauteil: ein Anschluss- bzw. Kachelstück am Rand statt einer Felsformation.
2. **Set-Hierarchie pro Insel** (korrigiert nach R2-Urteil): primär **Kenney Nature Kit zusammen mit Tiny Treats und KayKit**. Die Kenney-Mesa- und Felsstrukturen „funktionieren gut“. Quaternius und andere ergänzen *innerhalb* eines Bioms, mit einheitlichem Look. Mischen ist erlaubt, ohne Kneten.
3. **Keine Kachel- oder Anschlussstücke** (Kenney `cliff_*`, `ground_*`, `path_*`, `bridge_*`, Tile- und Connector-Teile) als Natur oder Felsen. Nur freistehende Einzelobjekte.
4. **Farbe semantisch statt willkürlich:** Farben leiten sich von natürlichen Farbschattierungen des Bioms ab und dürfen surreal verschoben sein, aber nicht willkürlich.
   - Stein kommt aus Boden und Fels der Insel: Wüste = Sandstein-Ocker, kein Lila.
   - Laub, Rinde, Blüte und Wasser haben je eine begründete Farbfamilie.
   - Die Joyride-Paletten sind Stimmungen und Harmonien; ihr Mapping auf Material-Rollen wird geprüft (Farb-Grammatik, §1).
6. **R2-Urteil (Georg, 2026-10-08):**
   - Farb-Grammatik passt („könnte funktionieren“), die Größen passen.
   - **Etherington-Probe FAIL, Konzept falsch:** Ein Fels liegt anders in der Landschaft als ein Strauch oder ein Ball. Er steckt tief im Gelände und wirkt schwer, als läge er lange dort. „Ein paar Blümchen am Rand“ sind Behelf, und ein falscher Schatten verrät falsches Liegen.
   - **Randblöcke**, die halb abgeschnitten sind oder von der Insel fallen müssten: verboten.
5. **Erdung zuerst beweisen:** Vor jeder Insel-Platzierung kommt eine Etherington-Probe. Ein Baum, ein Busch und ein Fels zeigen Eingraben, Kontakt und Überlappen, als Nahaufnahme. Erst nach Georgs PASS wird die Insel platziert.

## 1 · Konzept-Gate: vor jedem Platzierungs-Code

Ohne ein von Georg bestätigtes **Biom-Blatt** wird nichts platziert. Ein Blatt pro Insel bzw. Biom, eine Seite, Bilder statt Prosa.

| Feld | Inhalt | Prüffrage |
| --- | --- | --- |
| Geschichte | 2–3 Sätze: Wer lebt hier, was ist passiert, was soll man fühlen? Bezug zur Landmarke und zu den Bewohnern. | Erklärt sie, *warum* hier welche Pflanze steht? |
| Farbkonzept | **Farb-Grammatik:** je Material-Rolle (Boden, Fels/Stein, Rinde, Laub, Blüte, Wasser, Requisit) eine Farbfamilie, abgeleitet aus natürlicher Schattierung, surreal verschoben über die Palette. Begründung in einem Satz je Rolle. Dazu Haupt-, Neben- und Akzentfarbe aus der Insel-Palette. Verhältnis etwa 60/30/10. Welche Rolle trägt welche Farbe (Laub, Stamm, Blüte, Stein, Boden)? Hell-Dunkel-Staffel zur Landmarke hin. | Ist auf einen Blick klar, wohin das Auge geht? |
| Artenliste | 2–3 Baumarten, 1–2 Büsche, Steine, Gras, Akzent. **Jede Art mit Bild aus der Aufreihung** (`lineup.html`) und Zielhöhe in H. | Wurde jedes Modell einzeln angesehen, und passt es zur Geschichte? |
| Kit-Zuordnung | Primär KayKit + Tiny Treats; Kenney und Quaternius ergänzen innerhalb des Bioms. Nur freistehende Einzelobjekte, keine Kachel- oder Anschlussstücke. Kein Kneten. Umfärbung pro Material-Rolle nach Farb-Grammatik. | Liest es sich wie *eine* Welt, ohne Kneten? |
| Gruppen-Rezepte | 2–4 Rule-of-Three-Gruppen mit Anker, Stützen und Akzent, je mit Ort-Begründung: Wasser, Hang, Rand, Weg, Landmarke. | Hat jede Gruppe einen Grund, genau dort zu stehen? |
| Blickachsen | Von welchen 3 Kameras soll die Insel wirken? Was rahmt die Landmarke, was bleibt frei? | Bleiben Freifläche und Blick auf die Landmarke frei? |
| Referenz | 2–3 Bilder aus den Quellen, die die Stimmung zeigen. | Ist das Ergebnis mit der Referenz vergleichbar? |

Georg prüft das Blatt mit einem Blick (PASS/FAIL), bevor Code entsteht.

## 2 · Harte Regeln (automatisch messbar, jede Verletzung = FAIL)

| Nr. | Regel | Messung |
| --- | --- | --- |
| H1 | **Erdung je Objektart, aus Physik und Geschichte**, nicht eine Zahl für alles:<br>Fels und Findling liegen tief eingebettet (ein großer Teil im Boden), das Gelände zieht am Fels hoch.<br>Ein Strauch wächst heraus, ein Baum hat einen Wurzelanlauf.<br>Ein Requisit liegt auf (Kontakt ohne Einsinken).<br>Ein Randfels ist Teil des Inselkörpers oder steht vollständig auf.<br>**Das Gelände selbst wird verformt**, keine Erdhügel-Aufkleber. Nichts schwebt (Fuß ≤ 0 über Boden). | `__kfb.envCheck()` je Objekt + Bauweise-Blatt „Wie liegt was in der Landschaft“ |
| H2 | Nichts im Wegbett, im Wasser (außer Wasserpflanzen) oder in `field.isClear` | Zählung = 0 |
| H3 | Freifläche ≥ 30 % der Inselfläche | Flächenanteil |
| H4 | 2–4 Gruppen erkannt, keine Einzelgänger im Kern | Cluster-Analyse (Abstand 2–6 innen, ≥ 12 zwischen Gruppen) |
| H5 | Landmarke ist das höchste Element im Blickfeld; kein Baum vor ihr über 60 % ihrer Höhe | Höhenvergleich |
| H6 | Zielhöhen pro Rolle in H eingehalten (Environment-Spec §2) | `__kfb.sizes()` |
| H7 | Größenstaffel: wenige große, mehr mittlere, viele kleine Objekte (Anteile etwa 1 : 3 : 9) | Histogramm |
| H8 | Überlappungen (Gras, Kiesel, Krümel) nur, wo die Geschichte sie begründet. Als Zählregel ist das kein Ersatz für ein Erdungskonzept | Bauweise-Blatt, Kritiker K4 |
| H12 | Kein Randblock, der halb über den Rand ragt oder fallen müsste. Randfelsen sind Teil des Inselkörpers oder stehen vollständig auf | Überstand über `poly` = 0 |
| H9 | Ein Kit pro Gruppe; Kit-Mix auf der Insel nur, wenn das Biom-Blatt ihn erlaubt | Kit-Tags je Instanz |
| H10 | Budget: Natur ≤ 120 k Dreiecke und ≤ 16 Draw Calls pro Pass (4 Inseln) | `__kfb.profile()` |
| H11 | Keine geklonten Nachbarn: zwei gleiche Varianten mit gleicher Drehung im Abstand < 6 sind verboten | Zählung = 0 |

## 2b · Automatische Kompositions-Tests (nach Recherche P3, 2026-10-09)

Laufen aus den festen Kameras von §4 und auf den Platzierungsdaten. Jede Verletzung ist ein Befund für den Kritiker; E1–E3 sind FAIL.

| Test | Messung | Grenze |
| --- | --- | --- |
| E1 Schweben | Strahl nach unten von den unteren Ecken jeder Instanz | kein Fußpunkt > 0,003 H über dem Boden |
| E2 Einsinken | (Bodenhöhe − Mesh-Unterkante) / Mesh-Höhe | im Band der Objektart (`ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` §2), weder zu flach noch zu tief |
| E3 Tangenten | kleinster Abstand zweier Silhouetten im Bild | nicht zwischen 0 und 5 px (Überlappung oder Luft sind gültig) |
| E4 Gruppengröße | Cluster je Kategorie (Radius ≈ 0,4 H) | Anzahl 3, 5 oder 7; gerade Gruppen ≥ 2 sind ein Befund |
| E5 Symmetrie | Streuung der Positionen um die Gruppenachse, Kollinearität | keine Reihe aus ≥ 3, keine Spiegelsymmetrie |
| E6 Größenhierarchie | Volumen je Klasse groß, mittel, klein | Abweichung von 1 : 0,6 : 0,35 ≤ 0,15 (sonst „überladen“ oder „Sekundärformen fehlen“) |
| E7 Ursache | Fallobst, Fluff, Geröll | liegen unter bzw. hangabwärts ihres Ursprungs, nie verstreut |

## 3 · Bewertung (Kritiker, 0–10 je Kriterium)

Der Kritiker sieht **nur** Screenshots aus den Kameras in §4, dieses Regelwerk und das Biom-Blatt. Erklärungen, Code und Absichten der Bauenden sieht er nicht.

| Nr. | Kriterium | 10 = | 0 = |
| --- | --- | --- | --- |
| K1 | **Geschichte lesbar** | Ohne Text erkennbar, was hier los ist; das Biom-Blatt wird sichtbar eingelöst | Zufällige Deko ohne Bezug |
| K2 | **Farbkonzept** | 60/30/10 hält; Akzente führen zur Landmarke; Palette der Insel klar | Bunt durcheinander, Farben ohne Rolle |
| K3 | **Komposition** | Klare Gruppen mit Anker, Stützen und Akzent, Silhouette gebrochen am Rand, Freifläche atmet | Gleichmäßige Streuung, „hingewürfelt“ |
| K4 | **Erdung (Etherington)** | Eingraben, Kontakt (AO, Bodenfarbe) und Überlappen sichtbar an jedem Objekt | Aufgeklebt, schwebend, harte Fußkante |
| K5 | **Modell-Verständnis** | Jede Art steht dort, wo sie hingehört: Tanne am Hang, Weide am Wasser, Palme am Strand; Varianten (Herbst, Schnee, tot) passen zum Biom | Arten ohne Standortlogik |
| K6 | **Eine Welt** | Kits, Clay K2 und Palette lesen sich zusammen; nichts wirkt fremd | Stilbruch sichtbar |
| K7 | **Vielfalt ohne Rauschen** | Abwechslung in Größe, Drehung und Art, trotzdem ruhig | Monoton **oder** wirr |
| K8 | **Referenz-Nähe** | Hält den Vergleich mit den Referenzbildern aus dem Biom-Blatt aus | Kein Bezug zur Referenz |

| K9 | **Innerweltliche Logik / Storytelling** | Jedes Element hat erkennbar Herkunft und Grund (gepflanzt, gewachsen, abgelagert, gebaut, benutzt); die Insel erzählt ihre Geschichte aus jedem Winkel | Elemente ohne Grund, nur für einen Kamerawinkel arrangiert |

**Bestanden:** alle harten Regeln erfüllt **und** Mittelwert ≥ 8 **und** kein Kriterium unter 6 **und** K9 ≥ 7.

## 4 · Feste Kameras (pro Insel)

1. Übersicht schräg von oben (Preset `<islandId>`).
2. Augenhöhe Figur (1 H über Boden) vom Hauptweg auf die Landmarke.
3. Nahaufnahme Fuß einer Ankergruppe (Erdung).
4. Seitenansicht Rand (Silhouette).

Ausgabe: `node tools/shoot.mjs … --presets` mit diesen vier Kameras. Die Bilder gehen ohne Begleittext an den Kritiker.

## 5 · Ablauf und Stopp-Regel

1. Biom-Blatt → Georg PASS.
2. Bau.
3. Harte Regeln automatisch prüfen. Verletzung = sofort reparieren, ohne Kritiker.
4. Screenshots → blinder Kritiker (frischer Kontext) → Punkte und Mängelliste (Was? Wo? Welche Regel?). Der Kritiker schlägt keinen Code vor.
5. Reparatur gezielt nach Mängelliste → erneut 3–4.
6. **Stopp:**
   - Nach 2 Reparaturen ohne Punktgewinn am selben Kriterium hört die Sitzung auf und meldet Georg: Bilder, Punkte, vermutete Ursache.
   - Ein Kriterium unter 4 nach der ersten Runde heißt: Das Konzept ist falsch, zurück zu Schritt 1. Nicht weiterreparieren.
7. Georg sieht nur Inseln, die bestanden haben, oder einen Stopp-Bericht.

## 6 · Verboten

- Gleichmäßige Zufallsstreuung, Poisson-Teppiche, „ein bisschen von allem“.
- Arten ohne Standortlogik, Kit-Mix in einer Gruppe, Grundkörper-Pflanzen.
- Selbstlob im Bericht. Der Bericht nennt Messwerte und Punkte des Kritikers, keine Adjektive.


---

## Quelle: QA_RULEBOOK_TRANSITIONS_R1.md

# QA-Regelwerk Übergänge R1 · Straßen, Brücken, Gelände-Naht (RKIT)

Status: **VERBINDLICH für Bau und Kritik** · 2026-10-08 · Georg: „An den Übergängen wird nur gebastelt; die Probleme liegen auf der Hand.“
Gilt für die RKIT-Sitzung (Bauende), das Lab (Gelände-Naht) **und** den blinden Kritiker. Grundlage ist das von Georg freigegebene **RKIT-R3-Übergangs-Konzept v3** (Artifact `claude.ai/artifact/4Raze6mZEtHSYCkneTSkbb`, Abschnitte 3, 6, 7, 8, 9). Dieses Regelwerk macht daraus messbare Regeln und Punkte.

## 00 · Weltlogik zuerst (Georg, 2026-10-08, gilt vor allem anderen)

> „Es wird keinerlei Storytelling betrieben. Ihr baut es auf die billigste Art, die innerhalb der Anforderungen eine Lösung sein könnte, so dass es von einem Winkel gut aussieht. Ihr habt kein mentales Modell davon, was das innerweltlich ist. Jedes Element erzählt eine eigene Geschichte, genauso wie jede Insel und jede Residency ihre eigene Geschichte erzählt.“

**Pflichtfrage je Element, bevor es gebaut wird:** *Wer hat es gebaut oder wachsen lassen, womit, warum, und was erzählt es?*
- Gilt für jeden Katalog-Eintrag, jeden Bordstein- und Plattenverband, jede Brücke und jeden Anschluss.
- Die Antwort ist ein Satz im Bauweise-Blatt (Baugeschichte: wer baut das in der Welt, mit welchem Material, in welcher Reihenfolge). Beispiele: Ein Straßenbauer schneidet Passsteine, statt Lücken zu lassen; ein Inselvolk verankert eine Brücke im Fels, statt Platten anzuklipsen; ein Ortseingang ist ein gebautes Ende, kein Farbverlauf.
- Die Form, der Ort, die Farbe und die Erdung folgen aus diesem Satz, nicht aus der billigsten Lösung, die die Messregeln erfüllt.
- **Ein Element, dessen Geschichte nicht erzählt werden kann, wird nicht gebaut.**
- Messregeln sind die Untergrenze, keine Lösung. Wer nur die Messregeln erfüllt, hat noch nichts geliefert.
- Prüfen aus mehreren Winkeln: Was nur aus einem Winkel funktioniert, ist eine Kulisse ohne Welt.

## 01 · Keine harten Schnitte, keine sichtbaren Kanten (Georg, 2026-10-09, gilt grundsätzlich)

> „Wichtig als Regel scheint mir, dass es da keine harten Schnitte und keine sichtbaren Kanten gibt bei den ganzen Übergängen und dass das alles organisch mit Cartoon-Logik und entsprechendem Knetgummi-Design plausibel erscheint und nicht einfach so abgeschnitten wirkt.“

- **Gilt für jeden Übergang in der KFB-Welt:** Straße, Gehweg, Gelände, Natur, Inselrand, Brücke, Tunnelportal, freistehende Räume, Fluff-An- und Abbau, HUD- und Bühnen-Bauteile.
- **Nichts wirkt abgeschnitten.** Keine Messerkante, keine gerade Schnittlinie, kein Polygonrand, kein Farbsprung an einer Linie, kein Rausch-Gesprenkel, kein Farbverlauf.
- **Gebaute Enden sind Knet-Bauteile:** Kantenstein, Bordsteinkopf, Wandkopf und Portal sind gerundet und weich modelliert und sitzen mit Rubbel bzw. Knetfleck in ihrer Umgebung. Sie haben nie eine rasierte Kante.
- **Freie Enden runden sich durch Wachstum oder Verfall:** Bei erodierten Steinen kippen die Teile, die Ecken runden sich, sie brechen und laufen über Rubbel in einzelne Knetsteinchen aus. Flächen wechseln über `kfbBlend`-Knetflecken in drei Größen.
- **Prüfung:** Kein Kriterium ist erfüllt, wenn aus irgendeiner Prüfkamera eine harte Schnittkante oder eine helle Kante ohne Übergang zu sehen ist. Diese Kanten markiert der Kritiker als Befund (Teil von K9 bzw. U8).
- Details: `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`.

## 0 · Quellen (Wahrheit in dieser Reihenfolge)

1. Dieses Regelwerk.
2. Konzept v3: Übergangs-Katalog A–G, Gelände-Naht §7, Look §8, Prüfungen §9, Entscheidungen §11.
3. Joyride **J17** (`georg-doc/kayfabizarro` · `tools/KFB-ToolBox/_inbox/KFB Joyride J17 · FB Cabrio/`) als Look-Vorlage, dazu die Joyride-Rückblicke T3/T4/S1:
   - wenige große Massen;
   - eine vorhersagbare Übergangsregel;
   - „Wulst wird Bordstein“, abtauchende Segmente;
   - nichts schmaler als ein Daumen, nichts aufgeklebt.
4. `docs/SCALE_CONTRACT_K2.md` mit den Werten für Track Core v0.14/0.15: Gehweg 5,2, Bordstein 0,35, Wand 1,3, Durchfahrt ≥ 5,8.
5. Vertrag `kfb.road-bed/1` (Lab ↔ RKIT; `public/roadbeds/`).

## 1 · Konzept-Gate: Übergangs-Atlas vor jeder Insel-Anlage

Jeder benötigte Katalog-Eintrag (A1 … F2) wird einzeln als Prüfstück gezeigt, als **Bildpaar**:

- links die J17-Vorlage bzw. ein Referenzbild;
- rechts das eigene Prüfstück, aus denselben 3 Kameras (§4).

Erst nach Georgs PASS am Atlas wird eine Insel-Anlage gebaut, und zwar nur aus Katalog-Übergängen.

**Darstellung (Georg 2026-10-09):** Ein Bauweise- oder Atlas-Blatt zeigt jedes 3D-Bauteil als echtes 3D-Bild in Knet-Material (Blender- oder three.js-Render) mit Querschnitt durch das Profil. Flache, abstrakte 2D-Skizzen reichen nur als Lageplan daneben. Am Straßenrand gibt es nur zwei Familien: **Bordstein** (Stadt) und **Joyride-Bande** (rot, gerundet, cartoonig). Ein drittes Randelement braucht eine eigene Baugeschichte und ein eigenes Design. Ohne beides wird es nicht gezeigt.

## 2 · Harte Regeln (automatisch messbar, jede Verletzung = FAIL)

| Nr. | Regel | Messung |
| --- | --- | --- |
| T1 | **Kein Gelände über der Straße:** 0 Gelände-Dreiecke über Fahrbahn, Bordstein oder Gehweg, auch an Kurven-Innenseiten | `__kfb.measureRoadBed(id)` am fertig geschnittenen Inselnetz |
| T2 | **Naht dicht:** gemeinsame Kanten ≤ 0,2 mm, kein Spalt Straße ↔ Gelände ↔ Rand | dito |
| T3 | **Jeder Wechsel ist ein Katalog-Körper:** Signaturwechsel ohne Katalog-Eintrag = Bau-Fehler, nicht still überblenden | Track-Core-Validator |
| T4 | **Ein Verlauf:** Alle Kanten eines Übergangs folgen einer gemeinsamen stetigen Kurve (C2), ohne Stufe, Endstück oder versetzt startende Teile | Kanten-Ableitungen je Übergang |
| T5 | **Material nur an Bandgrenzen** oder in einer weichen Clay-Mischzone. Keine „grünen Stücke“ auf Bordstein oder Wand | Material-ID je Dreieck gegen Bandrolle |
| T6 | **Highway nie direkt in Stadt oder Land** (B4), nur über Anschlussstelle oder Kartenrand | Graph-Prüfung |
| T7 | **Maße K2:** Gehweg ≥ 1,3 H, Bordstein ≈ 0,35, Wand ≈ 1,3, Durchfahrt ≥ 5,8, Spur 3,75 / 4,0 / 4,5; Stadtstraßen auf MC-Vielfachen | Profilwerte |
| T8 | **Querneigung:** Welt ≤ 4°, Kurven-Innenseite nie höher (Anti-Cologne) | Profil je Station |
| T9 | **Muster:** Platten 1,6 × 1,6 im Weltraster, Fugen durchgehend, Keilplatten ≥ 0,6, Bordsteine kürzen statt biegen | Muster-Prüfung |
| T10 | **Brücken (C1, C2, C4):** ein Körper, wächst aus dem Inselfels (gemeinsame Kontur, Spalt 0), freitragend mit leichter Kuppe; Pfeiler nur über Gelände und dann als Clay-Beine | Kontur-Abstand, Stützen-Zählung |
| T11 | **Seitliche Anschlüsse:** Jeder Inselweg endet an einem `anchor` (D2), kein Gehweg endet stumpf in der Wiese (F2), Furten mit Absenkungen (D6) | Zählung offener Enden = 0 |
| T12 | **Regression:** Joyride-RACE und S13 bleiben byte-gleich | Hash-Vergleich |

## 3 · Bewertung (Kritiker, 0–10 je Kriterium)

Der Kritiker sieht nur die Screenshots aus §4, dieses Regelwerk und die J17-Vorlagenbilder. Text der Bauenden sieht er nicht.

| Nr. | Kriterium | 10 = | 0 = |
| --- | --- | --- | --- |
| U1 | **Gebaut, nicht gebastelt** | Jeder Übergang wirkt wie ein bewusst geformtes Bauteil | Verformte Querschnitte, Keile, Flickwerk |
| U2 | **Vorhersagbarkeit** | Nach einmal Sehen weiß man, wie der nächste Übergang aussieht | Jeder Übergang anders, Rauschen |
| U3 | **Gelände-Anschluss** | Gelände läuft weich an die Böschung, Rand und Brückenwurzel teilen eine Form | Durchstoß, Spalt, Klotz auf dem Gelände |
| U4 | **J17-Look** | Große runde helle Bordsteine, große unregelmäßige Clay-Platten in Reihen, Knet-Fahrbahn, dicke runde Banden | Rollenfarben, dünne Bänder, scharfe Kanten |
| U5 | **Massen statt Bänder** | Wenige große Körper, nichts schmaler als ein Daumen | Viele dünne Streifen |
| U6 | **Brücke** | Wächst sichtbar aus der Insel, leichte Kuppe, liest sich als ein Körper | Deckplatte auf Klötzen, gerade Platte |
| U7 | **Lesbarkeit für Figur und Auto** | Gehweg, Fahrbahn, Furt und Einmündung sind in Figurmaßstab (H) sofort lesbar | Maßstab unklar |

| U8 | **Innerweltliche Baulogik** | Man sieht, wer es wie gebaut hat: Verlegeplan, Passsteine, Übergangssteine, Tragwerk und Verankerung sind lesbar, auch in Cartoon-Logik | Gepinselt, überlagert, angeklipst, ohne Bauweise |

**Bestanden:** alle harten Regeln erfüllt **und** Mittelwert ≥ 8 **und** kein Kriterium unter 6 **und** U8 ≥ 7.

## 4 · Feste Kameras (pro Prüfstück bzw. Anschluss)

1. Schräg von oben auf den Übergang (Ganzansicht).
2. Augenhöhe Figur (1 H) vom Gehweg aus, Blick entlang des Übergangs.
3. Bodennah quer zur Naht: Kurven-Innenseite bzw. Brückenwurzel von unten.

## 5 · Ablauf und Stopp-Regel

1. Atlas-Bildpaare → Georg PASS.
2. Bau.
3. Harte Regeln automatisch prüfen. Verletzung = sofort reparieren, ohne Kritiker.
4. Screenshots → blinder Kritiker (frischer Kontext) → Punkte und Mängelliste mit Katalog-ID und Regel-Nr.
5. Reparatur gezielt nach Mängelliste → erneut 3–4.
6. **Stopp:**
   - Nach 2 Reparaturen ohne Punktgewinn am selben Kriterium: Bericht an Georg mit Bildern, Punkten und vermuteter Ursache.
   - Ein Kriterium unter 4 nach der ersten Runde heißt: zurück an den Katalog-Eintrag oder das Konzept, nicht weiterflicken.
7. Georg sieht nur Bestandenes oder einen Stopp-Bericht.

## 6 · Zuständigkeiten

- **RKIT:** Track Core, Katalog-Körper, Atlas, `roadbed.json` und GLB.
- **Lab (Steuer-Sitzung):** Gelände-Naht (`applyRoadBed`), Rand-Aussparung, Weg-Anschluss an `anchors`, Messung `measureRoadBed`.
- **Environment:** hält `field.isClear` frei.
- **Kritiker:** eigene frische Sitzung, keine Schreibrechte am Code.

## 7 · Verboten

- Einen Querschnitt linear verformen statt einen Übergangskörper zu bauen.
- Fehlende Katalog-Einträge still überblenden.
- Gelände-„Vorschau“ statt Messung am echten Netz.
- Selbstlob im Bericht, nur Messwerte und Kritiker-Punkte.


---

## Quelle: SPEC_EDGE_RUBBLE_GRAMMAR_R1.md

# KFB Kanten-, Übergangs- und Rubbel-Grammatik R1 · ein Prinzip für alle Slices

Status: **GRUNDSATZ · Georg 2026-10-08** · noch kein Bauauftrag
Bezug:
- Zellen-Grammatik `planning/kfb-cell-metric-voxel-world-grammar-2026-10-07`: Open Stage, Edge Completion, Ruin Completion, Fluff-Bau;
- RKIT-Bauweise-Blatt v2;
- Environment-Bauweise „Wie liegt was in der Landschaft“;
- `src/clay/kfb-blend.ts`.

**Nachtrag 20.10. (V-578, Georg):** Das freie Ende durch Verfall gilt jetzt als Pfadstein-Auflösung (heiler Rest bis zur geschwungenen Isolinie, dann pfadartige Stücke dicht → locker wie KayKit path_A → path_D). Das ersetzt „nur ganze große Platten / letzte 3 gestaffelt“. Werkzeug: `CANON_3D/lib/kfb_edge_bpy.py`.

## Grundsatz

Überall, wo in der KFB-Welt etwas endet, wechselt oder abbricht, gilt **dieselbe Sprache**.

**Oberste Regel (Georg 2026-10-09, gilt grundsätzlich):** Es gibt keine harten Schnitte und keine sichtbaren Kanten. Jeder Übergang erscheint organisch, folgt der Cartoon-Logik und ist plausibel aus Knetgummi geformt. Nichts wirkt einfach abgeschnitten. Auch gebaute Enden wie Kantenstein, Bordsteinkopf oder Portal sind gerundete Knet-Bauteile. Verankert ist die Regel in beiden QA-Regelwerken unter §01.

1. **Organischer Oberflächen-Wechsel:** `kfbBlend`-Knetflecken in drei Größen mit hartem Knetrand. Keine Raster, keine Verläufe, keine uniformen Punkte.
2. **Abschlussstück mit Abrundung:** Jede freie Kante endet in einem gerundeten Knet-Abschluss, nie roh geschnitten.
   - **Gebaute Kante** (jemand hat bis hier gebaut, z. B. Bord, Grenze der Bauherren): Zuschnitt + Kantenstein bzw. Bordsteinkopf, beide gerundet und knetig, mit Rubbel bzw. Knetfleck zur Umgebung, nie eine rasierte Linie.
   - **Freies Ende, durch Verfall gerundet** (Georg 2026-10-09, präzisiert): kurz und einfach. Nur ganze große Platten, die letzten drei Platten treten gestaffelt zurück und bilden so einen gerundeten Abschluss. Rubbel füllt die Stufen dazwischen und schließt ab, unregelmäßig gehäuft und nie aufgereiht. Keine lange Zone mit kleinen Zwischenstücken. Das Rubbel hat dieselben Töne wie die Platten. Nie eine helle Kante ohne Rubbel davor, nie ein Spray aus Pünktchen statt eines Endstücks.
3. **Knet-Rubbel und Knetsteinchen:** gestreut an Nähten, Kanten und Füßen, dichter zur Kante hin. Sie erzählen „hier wurde gebaut, abgetragen, ist etwas zerfallen“ (Ruinen-Logik).
   - **Nach Ursache, nie gleichmäßig** (Recherche P2, 2026-10-09):
     - am Kurvenausgang außen, wo gedriftet wird;
     - vor Abläufen und an Tiefpunkten, wo Wasser Krümel sammelt;
     - Abplatzungen an Bordsteinen in engen Innenkurven;
     - am Fuß von Ruinen und Abrisskanten.
   - **Verfallsstufen für Platten an freien Rändern** (Startwert):
     - intakt ≈ 70 %;
     - gelockert ≈ 15 % (angehoben, gekippt, Gras in der Fuge);
     - gebrochen ≈ 10 % (Scherben aus derselben Platte);
     - fehlend ≈ 5 % (Erde bzw. Fugenbett in der Lücke, ohne Verlauf).
4. **Weltlogik (§00):** Jedes Ende hat eine Geschichte. Gebaut, abgebrochen, verwittert oder noch im Bau?

## Wo es gilt

| Bereich | Anwendung | Owner |
| --- | --- | --- |
| Straßen und Übergänge (RKIT) | Belagswechsel als Knetflecken, Kantenstein und Bordsteinkopf als gebaute Enden, Rubbel in Nähten | RKIT |
| Natur und Erdung (Environment) | Erdkeil, Geröllkegel, Krümel am Fuß nach Ursache | Environment + Lab (`addEmbed`) |
| **Freistehende Räume (Open Stage, SceneCell)** | Teilwände enden in Abschlussstücken mit Abrundung, davor Knet-Rubbel, Ruinen-Logik statt Schnittkante | später, Lab bzw. Bau-Owner |
| **An- und Abbau mit Fluff** (Gebäude, Requisiten, Strukturen) | Bauen = Abschluss weicht, Modul setzt an, Naht heilt, neue Kante bekommt Abschluss. Abriss = Ruinen-Abschluss + Rubbel; Rubbel wird zu Fluff bzw. Rohstoff | später (Zellen-Grammatik, NPC-Activities) |

## Ein Baukasten statt vier

Damit nicht jeder Slice seine eigene Lösung baut, gibt es später drei gemeinsame Bausteine:

1. **`kfbBlend`:** Oberflächen-Wechsel. Statisch gebacken, live nur, wo sich etwas ändert (Performance-Regel).
2. **Rubbel-Streuung:** eine instanzierte Streuung aus Knetsteinchen, Dichte nach Abstand zur Kante, feste Seeds, Farbe aus der Farb-Grammatik der Insel.
3. **Abschlussstück-Familie:** gerundete Kappen für Wand-, Boden-, Bordstein- und Mauerenden in MacroCell-Maßen (K2). Sie können zurückweichen, wenn angebaut wird.

## Nächster Schritt (nach Georgs Reset)

Ein Proof „Freistehender Raum“ auf der Testinsel:
- 2 × 1 MacroCell mit zwei Teilwänden aus Tiny-Treats- bzw. KayKit-Modulen;
- Abschlussstücke an den freien Wandenden;
- Rubbel davor, Bodenwechsel per `kfbBlend`;
- dazu ein Anbau-Schritt (+1 Zelle: Abschluss weicht, Naht heilt).

Abnahme nach den Regelwerken: Weltlogik §00, harte Regeln, blinder Kritiker.


---

## Quelle: SPEC_ENVIRONMENT_KIT_R1.md

# KFB Environment Kit R1 · Natur aus fertigen Kits, instanziert und lebendig

Status: **SPEC · Entscheidung Georg 2026-10-08**
Prüfstand: KFB Island Worldbuilder Lab (`http://127.0.0.1:5192`), Code unter `src/environment/`.
Ersetzt Teil A (Vegetation und Steine) aus `BRIEF_CLAUDE_DESIGN_NATURE_WATER_LANDMARK_KIT_R1.md`. Claude Design behält B (Pyramide), C (Wasser), D (Unterseite).
Regeln für Zonen, Gruppen und Erdung: `SPEC_PLACEMENT_GRAMMAR_R1.md`. Diese Spec regelt **Assets, Technik, Bewegung, Prüfung**.

## Warum

- Die selbstgebauten Kugelbäume sehen nicht gut aus.
- Sie machen 60 % aller Dreiecke aus: 289 k von 483 k pro Pass, 50 Draw Calls (Inspector Proof 01, `docs/PROJECT_STATE.md`).
- Fertige Kits sind schöner, sauber modelliert und CC0.

## 1 · Quellen

| Kit | Lizenz | Inhalt | Rolle |
| --- | --- | --- | --- |
| KayKit Forest Nature Pack 1.0 | CC0 | 84 Modelle: Bäume, Büsche, Steine, Gras einseitig | Haupt-Kit Wald, Wiese, Herbst |
| Kenney Nature Kit | CC0 | 329 Modelle: Bäume, Felsen, Klippen, Ufer, Pflanzen, Stege | Ergänzung: Ufer, Klippen, Pflanzen |
| Tiny Treats Pretty Park 1.0 (Isa Lousberg) | CC0 | Bäume, Büsche, Blumen, Gras, Vogel | Akzente, Blumen, Grasbüschel |
| KayKit Medieval Snow Biome | CC0 | Schnee-Bäume, Steine | Schnee-Biom (liegt schon im Lab) |
| **Quaternius Ultimate Nature Pack** | CC0 | 150 Modelle (FBX/OBJ): Laub-, Nadel-, Birken-, Weidenbäume, Palmen, Kakteen, Büsche, Steine, Stümpfe, Gras, Blumen, Getreide; fast alles in Varianten Sommer, Herbst, Schnee, tot | **Haupt-Kit Wald, Herbst, Schnee, Wüste** (Georg 2026-10-08: große Bandbreite, Tannen passen) |
| Quaternius Stylized Nature MegaKit | Standard (gekauft) | Palmen, Kakteen, Pflanzen | Strand, Wüste; nur im Lab, nicht roh in öffentliche Repos |

Fundort: `Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/`.
- Quaternius Ultimate Nature ist entpackt unter `~/KFB-AssetCache/quaternius/UltimateNature/` (FBX, OBJ, License; ohne .blend).
- Dieselbe ZIP liegt auf GitHub: `main` · `media/3D_Assets/Ultimate Nature Pack by Quaternius(1).zip`, 22,9 MB, identisch.
- 14 Proben liegen unter `public/assets/env/quaternius/`, 6 KayKit-Forest-Proben unter `public/assets/env/kaykit-forest/`.

**Gemessen (Aufreihung `lineup.html?tt=1.6&q=0.044`, Zeile „Natur“):**
- **Quaternius-FBX sind in Zentimetern:** CommonTree 248, Pine 270, Palm 447. Der Kit-Faktor 0,044 bringt die Bäume auf 3–4,3 H, ähnlich den KayKit-Bäumen (1,8–3 H).
- **Gras und Büsche** sind bei Quaternius relativ zu den Bäumen groß (Gras 1,2 H, Beerenbusch 1,5 H). Deshalb gilt für Natur keine Kit-Faktor-Regel, sondern **Zielhöhen pro Rolle in H** (§2).
- **Farben:** Quaternius-FBX speichern Blenders lineare Diffusfarbe, und FBXLoader dunkelt sie ein zweites Mal ab. Einmal `convertLinearToSRGB()` stellt sie her. Im Spiel färbt ohnehin die Palette um (§3).
- **Stil:** Quaternius ist facettiert-low-poly mit naturnahen Silhouetten, KayKit und Tiny Treats sind weich, satt und klobig. Ob Palette + Clay K2 + Soften beide zusammenbringen, zeigt E1.
  - Wenn nicht: Quaternius für Wald-, Herbst-, Schnee- und Wüsten-Inseln, KayKit und Tiny Treats für Stadt-, Park- und Strand-Inseln.
  - **Nie zwei Kits in derselben Rule-of-Three-Gruppe.**

Übernahme: Nur die tatsächlich genutzten Dateien kommen nach `public/assets/env/<kit>/`, mit Lizenzdatei. Das ist dieselbe Regel wie beim Unity-Intake.

## 2 · Maßstab (Kontrakt K1)

Kontrakt **K2** (`docs/SCALE_CONTRACT_K2.md`): keine Meter. H = Medium-Figur = 3,64 Lab-Einheiten.
Für Natur gilt statt eines Kit-Faktors eine **Zielhöhe pro Rolle in H**. Jede Art wird einmal auf die Mitte ihres Bands normiert:

| Rolle | Zielhöhe |
| --- | --- |
| Grasbüschel | 0,1–0,25 H |
| Blume | 0,15–0,35 H |
| Busch | 0,4–0,8 H |
| kleiner Baum, Kaktus | 1,5–2,5 H |
| großer Baum, Palme (Anker) | 2,5–4 H |
| Stein, Akzent | 0,15–0,7 H |
| Stein, Fels am Rand | 0,7–2 H |

Varianz kommt danach nur aus der Platzierung (Rule-of-Three-Skalen 0,7–1,4).

## 3 · Look

- **Palette:** Die Kit-Farben werden auf die Insel-Palette umgefärbt. Erst wird der Farbatlas des Kits auf Paletten-Slots abgebildet (Laub, Stamm, Stein, Blüte). Dann färbt der Shader nach Slot um. Die Kit-Texturen bleiben unverändert.
- **Clay:** Clay K2, Klasse `nature` (`clay-material v10`); kleine Teile ohne eigenes Soften.

## 4 · Instanzierung

- Pro Art und Variante ein `InstancedMesh` je Insel, alternativ `BatchedMesh` für alle Arten einer Insel.
- Pro Instanz: Transform, Gruppen-ID, Phase, Biegesteifigkeit, Paletten-Slot.
- **Schatten:** Nur Anker und große Steine werfen Schatten. Gras, Blumen und kleine Büsche empfangen nur.
- **Budget** für 4 Inseln, Natur inklusive Gras, gemessen mit `__kfb.profile()`:
  - höchstens 120 k Dreiecke und 16 Draw Calls pro Pass (heute 289 k und 50);
  - Gras über Distanz-LOD ausdünnen.

## 5 · Cartoon-Deformer

Vertex-Shader in der Clay-Kette (onBeforeCompile), gewichtet nach normalisierter Höhe im Modell: Der Fuß bleibt fest, damit die Erdung erhalten bleibt.

- **Biegen:** Krone neigt sich in Windrichtung, quadratisch über die Höhe.
- **Squash und Stretch:** Volumen bleibt erhalten (y × s, xz / √s).
- **Wobble:** Kronen schwingen nach, gedämpft und federnd, cartoonig statt realistisch.
- Pro Instanz-Attribut steuerbar; jede Art bekommt Standardwerte (Palme biegt weich, Busch kaum, Gras stark).

## 6 · Wind-Gruppen

- Jede Instanz gehört zu einer **Gruppe**. Eine Rule-of-Three-Gruppe bewegt sich gemeinsam: gleiche Grundphase, kleiner Versatz je Mitglied.
- **Windfeld:** globale Richtung und Stärke, dazu Böen als Wellen, die über die Insel laufen. Die Gruppenphase folgt der Position im Feld.
- Gruppenwerte liegen in einem kleinen Uniform-Array oder einer Daten-Textur (bis 64 Gruppen je Insel). So lässt sich eine Gruppe einzeln anstoßen, etwa wenn eine Figur vorbeigeht oder ein Auto vorbeifährt.
- **Offen:** Georg hat auf ein Konzept aus einem Web-Chat verwiesen. Es wird eingearbeitet, sobald es vorliegt.

## 7 · Musik-Visualizer

- Dieselben Gruppen-Uniforms werden aus Audio gespeist, über WebAudio `AnalyserNode` mit 3–5 Bändern:
  - **Bass** lässt die Anker hüpfen (Squash);
  - **Mitten** wiegen die Stützen;
  - **Höhen** lassen Akzente und Blumen zucken und das Gras schimmern.
- Modi: Wind, Musik, beides gemischt. Testmusik: `Cartoonish Music Pack` aus dem Asset-Ordner.
- Schnittstelle offen für Beat-Events aus anderen KFB-Systemen.

## 8 · Gras

- Gras steht in **Büscheln**, nie als einzelne Halme verstreut. Quellen: Tiny Treats `grass_A`, KayKit `Grass_1/2 Singlesided`.
- Büschel bilden Felder nach Rauschen und Zonen (Grammatik §1): dicht in Senken und am Ufer, frei auf Wegen, Vorplatz und Freifläche, hier höchstens kurz.
- **Etherington-Überlappung:** 3–8 kleine Büschel am Fuß jedes Objekts (Grammatik §4.3).
- Ein Draw Call pro Insel und Grasart; Wind wie §6 mit starker Biegung.

## 9 · Rule of Three

Cluster-Rezepte mit Anker, Stützen und Akzent nach Grammatik §3. Zusätzlich je Biom eine Tabelle, welche Kit-Arten welche Rolle füllen dürfen, etwa:

- **Wüste:** Palme als Anker, Dattelbusch als Stütze, Kaktus oder Stein als Akzent.
- **Wald:** großer Laubbaum als Anker, kleiner Baum oder Busch als Stütze, Pilz oder Stein als Akzent.

## 10 · Etherington: Best Practices und Q&A

- **Referenzblatt** `docs/ETHERINGTON_GROUNDING_R1.md` mit den drei Techniken Eingraben, Kontakt und Überlappen. Je Technik ein Gut-Schlecht-Paar als Screenshot aus dem Lab. Quelle im KFB-Style-Reference-Pool verifizieren.
- **Automatische Prüfungen** (`__kfb.measure(id)` erweitern):
  - kein Fuß über dem Boden;
  - Einsinktiefe 5–15 % der Objekthöhe;
  - Überlappungen pro Objekt ≥ 3;
  - nichts im Wegbett oder im Wasser;
  - Anteil Freifläche ≥ 30 %;
  - Landmarke ist das höchste Element.
- **Georg-Blick:** feste Kamera-Presets je Insel (oben, Augenhöhe Figur, Nahaufnahme Fuß); PASS oder FAIL.

## 11 · Schnittstelle

```ts
buildEnvironment({ field, palette, biome, seed, recipe }) → {
  object: THREE.Object3D,            // Instanzen je Art
  groups: EnvGroup[],                // id, role, center, members
  update(t: number, drive: { wind?: { dir, strength, gust }, audio?: { bands: number[] } }): void,
}
```

Das Rezept ist Seed + Regeln + Georgs Overrides, wie Grammatik §7. Der Editor kann Gruppen verschieben, löschen und neu würfeln.

## 12 · Gates

| Gate | Inhalt | Nachweis |
| --- | --- | --- |
| E1 | Intake, Maßstab K1, Umfärben, Clay | Screenshot je Biom, Größenliste aus `__kfb.sizes()` |
| E2 | Instanzierung, Schattenregel, Budget | `__kfb.profile()` vorher/nachher |
| E3 | Deformer + Wind-Gruppen | kurzes Video, eine Gruppe einzeln angestoßen |
| E4 | Grasbüschel + Überlappung am Fuß | Nahaufnahme Fuß je Objektart |
| E5 | Musik-Visualizer | Video mit Testmusik |
| E6 | Etherington-Referenzblatt + automatische Prüfungen | Prüfbericht je Insel, Georg PASS/FAIL |

## Nicht machen

- Keine Grundkörper-Bäume mehr, keine einzelnen Halme, keine eigenen Skalenfaktoren pro Modell.
- Keine Kit-Rohdateien in öffentliche Repos, wenn die Lizenz nicht CC0 ist.
- Bewohner, Wege und Gebäude nicht anfassen: Die gibt es schon.

## 13 · Fluff-Ernte (Georg, 2026-10-08) · Idee, noch nicht im Bau

- **Wachsen:** Bunte Fluff-Kugeln in der Biom-Farbe (Farb-Grammatik, Rolle Blüte bzw. Akzent) wachsen an Bäumen und Sträuchern. Farmen ernten sie.
- **Fallen:** Reife Kugeln fallen als Fallobst, springen, rollen bergab und bleiben in Mulden liegen. Das ist Georgs „unebener Boden“, und hier hat er eine Aufgabe.
- **Aufsammeln:** durch Drüberlaufen, für Spieler und NPCs.
- **Bezug zur Zellen-Grammatik** (`planning/kfb-cell-metric-voxel-world-grammar-2026-10-07`): Fluff ist dort Rohmasse für Bau und Reparatur (`HARVEST/GATHER → AGGREGATE → ROUGH_MASS → SCULPT → RESOLVE`). Die Ernte ist also der Anfang der Bau-Kette: Natur → Fluff → Bau.
- **Zuständig:**
  - Environment: wo Fluff wächst, je Art und Biom, Wachstumsstellen am Modell.
  - Lab: Mulden im Gelände, Roll-Physik (einfach: bergab bis zur nächsten Mulde).
  - Blender-Coworker: NPC-Activities (ernten, tragen, sammeln).
- **Weltlogik (§00):** Wer hat den Baum gepflanzt, wer erntet, wohin bringt er die Kugeln? Jede Fluff-Stelle braucht diese Antwort.


---

## Quelle: SPEC_PLACEMENT_GRAMMAR_R2.md

# SPEC · Platzierungs-Grammatik R2 · Fluff und Übergangssteine · WSB · 2026-10-17

**Status: R2 draft (V-400) · WS0 decisions 18.10. (answer to WS1 §78):** contour rule between fluff balls on the same plant, relax ≤ 0.85× or ≥ 1.25× (never 0.92×); odd numbers for hanging balls per plant; bare trees carry no fluff; 1 KayKit unit = 0.616 m (M_PER_RIG); 6 spots per tree OK.

**Original status line:** R2 draft (V-400). Geschrieben von WSB, Code-Owner WS1 (`src/world/grammar.js`, `fluff.js`). Liegt in `50_BLENDER/SPEC/`, WS0 verschiebt ihn ins Register (`30_DECISIONS/replies/`).

**Grundlage:**
- **Fluff:** Konzept `50_BLENDER/B2/R2/CONCEPT_B2R2_FLUFF_GRAMMAR.md` und die Proof-Seite `B2/R2/proof/fluff_stage.html`, Muster „gewachsen“ (Georg 17.10.: „Verteilungsmuster jetzt auch gut“, „mehr Luft als Default“).
- **Steine:** neu für V-341/V-396.

Ersetzt nichts aus R1 (`LAB/docs/SPEC_PLACEMENT_GRAMMAR_R1.md`), sondern verlängert die Ebenen nach unten.

## 0 · Grundsatz
**Eine Grammatik, dieselben Operatoren auf allen Ebenen.** Fluff am Busch und Geröll an der Bühne sind derselbe Vorgang: Etwas entsteht an einer Quelle, gruppiert sich nach 1 : 3 : Rest und wandert abwärts. Es gibt keine zweite Regel für Steine.

**Zahlen-Regeln für alle Ebenen** (aus `ETHERINGTON_REGELN_IN_ZAHLEN_R1.md`):
- ungerade Mengen (3/5/7);
- nie zwei gleich große nebeneinander;
- die Abstände zu den Nachbarn unterscheiden sich um ≥ 30 %;
- höchstens 2 auf einer Geraden;
- Konturen entweder ≥ 15 % überlappt oder ≥ 25 % Luft, nie ein Fast-Berühren;
- Negativraum ≥ 30 %.

**Verboten:**
- Poisson- oder Gitter-Teppiche (QA §6);
- Reihen und Ketten (die Lichterketten-Optik);
- „Nachbar andersfarbig“ auf Kugel- oder Stein-Ebene;
- Objekte, die obenauf liegen statt einzusinken.

## 1 · Ebenen
| Ebene | Anker | Stützen | Rest | Quelle |
|---|---|---|---|---|
| Zone | 2–4 Gruppen | – | Negativraum ≥ 30 % | R1 |
| Gruppe (Pflanzen) | 1 Anker 1,2–1,4 | 2–3 Stützen 0,7–0,9 | 1 Akzent | Bauweise Regel 4 |
| Träger (eine Pflanze) | Fruchtstände je nach Größe: Baum 7, großer Busch 4, Busch 3, Kaktus 2 | – | 1–2 Fallobst | B2-R2 „gewachsen“ |
| Bühnenrand (neu) | Ringband 0 / 1 / 2 | Gruppen je Band | Kies | dieses Dokument §4 |
| Nest / Steingruppe | 1 groß | ~3 mittel | 1–5 klein | `nest()`: 1 : 3 : Rest, Größe 1 : 0,62 : 0,38 |

## 2 · Operatoren (Signaturen für WS1)
Alle sind deterministisch über `seed`; Zufall nur über `rng(seed)`.

- **`candidates(surface, n = 220)`:** Richtungen auf einer Fibonacci-Kugel (Schritt 2,39996 rad), per Raycast auf die Oberfläche projiziert.
  - Behalten werden Treffer mit `n·d ≥ 0,45` und Höhenanteil `hs ≥ 0,18` (Kaktus `≥ 0,55`).
- **`score(c)`:** Rangfolge der Kandidaten.
  - Formel: `rng·0,6 + max(0, n·sun)·0,5 + n·cam·0,3`, mit `cam = normalize(0,25, 0, 1)` (Lese- bzw. Kameraseite).
- **`stands(cands, G, minDist)`:**
  1. Bei allem außer kleinen Büschen zuerst einen Stand an der Spitze setzen (`hs > 0,86`), Georg: „auch oben Früchte“.
  2. Danach nach Score auffüllen bis `G` Stände, Mindestabstand `minDist = 0,62 × Kronenradius` (Kaktus 0,4).
- **`ripeness(c)`:** `clamp(0,22 + 0,62·(1 − hs) + 0,32·sun ± 0,09, 0,12, 1)`.
  - Unten und auf der Sonnenseite reif, oben jung.
  - Bei Reife < 0,5 wird der dunkle Ton der Sorte genommen (V-292 dunkel).
- **`stand(c, rip)`:** 1 / 2 / 3 Früchte bei Reife ≤ 0,36 / ≤ 0,62 / darüber.
  - **Größen:** `R0·(0,42 + 0,62·rip)·[1; 0,74; 0,56]`.
  - **Abstand der Folgefrüchte:** `(r_prev + r)·(1,15 … 1,5)`, nur manchmal berühren (Georg: mehr Luft).
  - **Seitlich versetzt** um ±0,7 rad zur Hängerichtung.
  - **Reife Früchte hängen tiefer:** `−0,14·r·rip` in y.
- **`embed(ball)`:** Mittelpunkt `0,45 r` vor der Oberfläche (`EMB`); gut die Hälfte steckt im Laub, „wie Äpfel“.
- **`nest(p, dir, count, scale)`:** 1 groß, 3 mittlere bei ±1,2 / 0,1 / 1,3 rad um die Hängerichtung, kleine außen.
  - **Abstand:** `(R + r)·0,86·spread`, mit `spread = 1,75` als Default „mehr Luft“.
- **`relax(items, k = 6)`:** schiebt Überlappungen auseinander, bis `d ≥ 0,92·(r_a + r_b)`.
  - Gilt für Kugeln, für Steine mit dem Hüllradius.
- **`fall(src, n)` / `rollToRest`:**
  - **Fallobst:** Der reifste Stand wirft 1–2 Früchte ab (Baum 2). Sie landen hangabwärts mit `0,25 + 0,3·i` Kronenradius Versatz.
  - **Steine:** Kleine Steine einer Gruppe wandern hangabwärts (§4).

## 3 · Farbe
- Ein Nest ist einfarbig. Eine Pflanze hat eine Leitfarbe und höchstens einen Akzent: beim Baum die Stände 1 und 4, sonst der letzte Stand.
- Die Zone mischt über die Pflanzen: Hauptsorte ~40 %, jede andere ≥ 8 % (V-368).
- **Comic-Oliv:** auf Nicht-Grün-Trägern; auf Grün nur die hellere V-292-Stufe (V-400). Kein Kontrastlicht.
- **Steine:** Farbe aus der `edgePalette` der Bühne, nie aus der Zonenfarbe allein (§4.5).

## 4 · Übergangssteine am Bühnenrand (neu, V-341 / V-396)
**Story:** Die Bühne ist das älteste Stück des Ortes. Steine und Erde aus ihrem Sockel sind über die Zeit abgebröckelt und nach außen gerollt. Deshalb gilt:
- nahe an der Bühne liegen sie groß und tief, außen klein und selten;
- an der Hangseite liegen mehr als an der Bergseite.

### 4.1 Quelle und Ringbänder
- **Quelle:** das `footprint`-Polygon aus `kfb.stage-edges/1`.
- **Bodenhöhe:** Das Gelände trifft die Bühne auf `groundY_u`, z. B. B7 0,0238 u = 0,10 m, gemessen.
- **Ausgespart:** Eingänge, Treppenfüße und Wege (V-396: „Schürze ohne Überbrücken von Eingängen“). Freiraum je Eingang ≥ 1,2 m breit, ≥ 2 m tief.
- **Drei Bänder** mit Abstand `s` zum Polygon (Schürze 4 m / 3 Ringe):

| Band | Abstand s | Gruppen je 10 m Rand | Größenklassen | Einsinken |
|---|---|---|---|---|
| 0 | −0,1–0,7 m (bis 0,15 m in die Hülle, weil die Hülle breiter ist als der echte Sockel) | 2,0 | L (Anker), M, S | L 45–60 %, M 35–50 % |
| 1 | 0,9–3 m | 0,9 | M (Anker), S | 35–50 % |
| 2 | 3–6 m | 0,3 | S, Kies | 30–40 % |

### 4.2 Wo die Gruppen sitzen
- **Thomas-/Matérn-Prozess** statt Poisson: Gruppenkeime entlang des Randes.
- **Benachbarte Keime:** Abstand zum vorigen um ≥ 30 % variiert.
- **Je Band ungerade Zahl** an Gruppen.
- **Gewichtung:**
  - ×1,6 an Ecken bzw. Vorsprüngen (Kanten bröckeln zuerst);
  - ×1,4 auf der Hangseite (Gefälle des Höhenfelds);
  - ×0,5 hinter der Bühne, aus der Kamerasicht.
- **Lücken:** ≥ 30 % der Randlänge bleiben frei. Längste Lücke ≥ 15 % des Umfangs, damit kein Kranz entsteht.

### 4.3 Eine Gruppe = `nest()`
- **Pool (Steinkit v3, Georg 17.10.):** Grundformen aus KayKit Forest FREE und Quaternius (Ultimate Nature, MegaKit FREE), alle CC0, in Knete übertragen. Dazu die eigenen Ruinen-Passstücke (Mauer, Trommel, Platte, Keil, Kiesel-Nest).
  - Gezogen wird nach `weight` aus `kfb.stone-kit/1`: runde Findlinge 1,0, Kiesel-Nester 0,8–1,0, flache Platten 0,6, Pflaster-Reste 0,4, Ruinen-Passstücke 0,3–0,5, KayKit-Blöcke 0,2, Steinstapel 0,05 (nur Band-0-Anker).
  - Ergebnis: ≈ 85 % Grundformen, ≈ 15 % Passstücke. Die Passstücke geben die Ruinen-Geschichte, die Findlinge die Natürlichkeit.
- **Aufbau:** 1 Anker, ~3 Stützen, 1–5 Kiesel. Größen 1 : 0,62 : 0,38 der Ankergröße.
- **Ankergröße:**
  - Band 0: 0,5–0,9 m;
  - Band 1: 0,25–0,45 m;
  - Band 2: 0,10–0,20 m.
- **Lage:** Die Stützen lehnen am Anker; Konturen ≥ 15 % überlappt, also ineinander gesunken, oder ≥ 25 % Luft.
- **Kiesel:**
  - wandern hangabwärts, Versatz `(0,3 … 0,8) × Ankergröße` in Fallrichtung;
  - liegen an der Hangseite häufiger.
- **Nie** zwei gleich große nebeneinander, **nie** drei auf einer Geraden.

### 4.4 Sitz im Boden
- **Einsinktiefe:** Einsinken = Anteil der Steinhöhe unter `terrainY(x, z)`, Bereich je Stein aus dem Kit (`sinkMin/Max`).
  - Größere Steine sinken tiefer ein.
  - Jeder Stein berührt den Boden, keiner balanciert.
- **Ausrichtung:**
  - `upAxis` des Steins = Mittel aus Geländenormale und Welt-oben (50/50);
  - zusätzliche Neigung ≤ 12°, Drehung um oben zufällig.
- **Flache Platten:** liegen hangparallel. Mauerbrocken stehen mit der Bruchkante zur Bühne.
- **Tropfkante:** Unter dem Anker in Band 0 wird der Boden 10 % dunkler, Radius 1,3 × Ankergröße (Bauweise-Erdung).

### 4.5 Farbe
- **Grundfarbe:** Die Kit-Albedo ist hell-neutral, die Tönung kommt zur Laufzeit.
  - Der größte Anteil der `edgePalette` ist schon der Boden (V-396). Die Steine nehmen deshalb **die übrigen Anteile**, sonst verschwinden sie im Boden.
  - Anker = hellster der übrigen Anteile;
  - Stützen = Anker oder zweithellster;
  - Kiesel = dunkelster.
  - Beispiel B7: Anker `#c09b72`, Stützen `#977943`, Kiesel `#72601e`.
  - Jitter ±4 % L, Farbton unverändert.
- **Übergang ins Gelände als Sprenkel, nicht als Verlauf (V-403):** Kein Stein wird stufenlos zur Bodenfarbe gemischt.
  - Jeder Stein wählt **diskret** zwischen Sockel-Tönen und dem Stein-Ton der Bodenrolle (`ENV_ROLES.stone` der Zonenpalette).
  - Wahrscheinlichkeit für den Boden-Stein: Band 0 ≈ 10 %, Band 1 ≈ 35 %, Band 2 ≈ 65 %.
  - Damit wandern einzelne Sockelsteine weit hinaus und einzelne Geländesteine bis an die Bühne, in beide Richtungen.
  - Die Proof-Skizze mischt noch stufenlos; das wird bei WS1 durch diese Regel ersetzt.
- **Kein Konfetti:** eine Gruppe ist ein Farbton, höchstens zwei.

### 4.6 Was nicht passieren darf
- eiförmige oder kugelige Steine (das Kit liefert keine);
- Reihen;
- gleichmäßiger Kranz um die Bühne;
- Steine auf Wegen oder in Eingängen;
- Steine, die in die Bühne hineinstechen (Abstand ≥ 0 zum Footprint, Band 0 darf bis 0,1 m überlappen, wenn sie dort einsinken);
- Steine, die schweben: Unterkante über dem Gelände.

## 5 · Abnahme (WS1 im Spiel, gleiche Kamera-Marken)
1. **Messungen:** pro Bühne
   - Anteil freier Randlänge ≥ 30 %;
   - keine drei Steine auf einer Geraden (Toleranz 5 % der Gruppengröße);
   - Größenabfall von Band 0 zu Band 2 ≥ Faktor 3;
   - 0 schwebende Steine (Unterkante − Gelände ≤ 0);
   - 0 Steine in Eingangs-Freiräumen.
2. **Sichtprüfung:** Vorher/nachher im Spiel, Georg-Frage „wächst die Bühne aus dem Boden?“.
3. **Fluff:** die Messwerte aus dem B2-R2-Proof als Referenz. Mehr Luft als die erste Fassung, Spitzen-Stand vorhanden, Fallobst hangabwärts.

## 6 · Offene Punkte
- **Startwerte aus der Proof-Skizze** (`50_BLENDER/STEINKIT/proof/stonekit.html`, B7, 23 m Umfang): 9 Gruppen, 62 Steine; die Vordertreppe bleibt frei. Bilder: `STEINKIT/renders/`.
- **Bodenfarbe nach V-396 (an WS0/WS1):** Bei B7 ist der größte Rand-Anteil Moos (`#5a610d`, die Pflanzen auf dem Sockel). Als Boden wird das unter ACES ein grelles Limettengrün (`STEINKIT/renders/Steinkit_4_Boden_nach_V396_moosgruen.png`). Vorschlag: Für den Boden gesättigte Grüntöne (Pflanzen) überspringen bzw. die Sättigung begrenzen und den nächsten Erd-Anteil nehmen. Mit Erdboden wirkt dieselbe Szene ruhig (`Steinkit_2_…Erdboden.png`).
- **Eingänge:** Freiräume müssen pro Bühne als Daten kommen (Vorschlag: `entrances[]` im Bühnen-Deskriptor mit Mitte, Richtung, Halbbreite). Die Skizze hat die B7-Treppe fest eingetragen.
- **Startwerte bestätigen:** Gruppen je 10 m und Bandbreiten sind Startwerte. Georg oder WS1 tunen sie im Spiel (God-Mode-Schieber: `density`, `spread`, `sinkBias`).
- **Footprint-Methode:** Die Hüllen-Näherung (WSB) und WS0s Methode (Bodenplatten-Schnitt) unterscheiden sich. Für Steine zählt die Grenze, an der die Bühne den Boden trifft.
- **Etherington-Originale:** noch nicht gegengelesen (siehe Konzept, offene Frage 4).


---

## Quelle: WEBCHAT_TERRAIN_LOOK_STACK_2026-10-19.md

Benutzeranhang  
Das finde ich sehr gut, das würde ich gern so machen. Bei den Höhenbändern würde ich noch gucken, dass sie jetzt nicht strikt an der Höhe orientiert sind, sonst sieht das schnell aus wie so ein Schnittkuchen, sondern dass wir die möglichst organisch übers Terrain laufen lassen, also ein bisschen wie bei Roadrunner tatsächlich, wo es halt auch, sage ich mal, eher die Fläche ist, die dann halt eine zusätzliche Ebene darstellt und das Ganze dann schon in den Bändern auch farbkoliert ist, wie auf dem Bild, aber halt nicht so klar von den Höhenlinien abhängig. Das fände ich gut, wenn es dann noch ein bisschen organischer wäre und wir die Farbflächen dann anders verteilen könnten und das Terrain dann quasi für sich spricht in den entsprechenden Deformierungen, die man dann an den Bandenkanten erkennen kann. Dazu würde ich noch eine spärliche Outline, wie du das bei der Option zwei, glaube ich, skizziert hattest. Ohne schwarze Tusche-Outline, sondern mit einer entsprechend farblich passenden dunklen Kantenbetonung. Was denkst du dazu?

Worked for 52s

Ja, danke, das Bild gibt das sehr gut wieder, aber ich wollte jetzt eigentlich keine Bildgenerierung von dir, sondern überlegen, wie wir diese Art von Farbigkeit, vor allem mit den Höhenbanden, ohne Höhe. Also wie wir quasi diese flächigen Farbbänder abbilden können, ohne halt die Höhenparameter zu nutzen.  
Genau. Der entscheidende Punkt ist, dass wir Geländegeometrie und Farbverteilung vollständig voneinander entkoppeln. Das Terrain kann weiterhin höhenbasiert entstehen, aber die Farbflächen folgen einer eigenständigen, organischen Logik. Damit vermeiden wir diesen geologischen Schnittkuchen-Effekt.

Ich würde das als Procedural Color Fields konzipieren: zusammenhängende, unregelmäßige Farbflächen, die über das Terrain verlaufen, ohne an bestimmte Höhenstufen gebunden zu sein.

1\. Die Farbflächen bekommen ihre eigene Geometrie  
Statt einer Regel wie „ab 20 Metern Höhe wird die Fläche orange“ erzeugen wir eine zweite, unsichtbare Karte, die ausschließlich die Farbverteilung beschreibt.

Höhenabhängige Bänder

Horizontale Grenzen erzeugen den Schichtkuchen.

Unabhängige Farbflächen

Farbgrenzen verlaufen frei durch die Geländeform.  
Vereinfachtes Prinzip: identische Geländeform, unterschiedliche Farbverteilung.  
2\. Wie erzeugen wir solche organischen Farbflächen?  
Ich würde drei Verfahren kombinieren.

A. Große, zusammenhängende Farbfelder

Ein langsam variierendes 2D-Noise-Feld auf den Weltkoordinaten X/Z erzeugt die grundlegende Farbverteilung. Anders als die Höhenfunktion hat es keine direkte Beziehung zur Geländehöhe.

Wir verwenden sehr große Strukturen mit nur drei bis vier Farbfamilien. Das erzeugt breite Flecken und Zonen statt kleinteiliger Texturstörungen.

B. Fließende Bänder mittels Domain Warping

Das ist der interessantere Teil: Wir erzeugen zunächst breite, gerichtete Farbbahnen und verbiegen deren Koordinaten durch ein zweites, niedrigfrequentes Noise-Feld.

So entstehen Farbbänder, die sich verzweigen, verbreitern, verengen und umeinanderfließen. Sie können über ein Plateau verlaufen, um eine Kuppe herumziehen und in andere Farbflächen übergehen.

Wichtig: Das Warping verändert die Grenzen der Farbflächen, nicht die Terrain-Geometrie.

C. Gezielte Farbflächen durch Splines oder Masken

Das würde ich für KFB unbedingt ergänzen. Denn vollständig zufällige Felder können schnell nach Camouflage aussehen.

Wir könnten größere Farbbahnen durch unsichtbare, prozedural erzeugte Kurven definieren. Über Kontrollpunkte ließen sie sich später auch manuell verschieben.

Das ist für unseren vorgesehenen Editor interessant: Du könntest nicht nur Hügel und Wände ziehen, sondern auch Farbflächen direkt auf dem Terrain gestalten.

3\. Was passiert an steilen Felsen und Canyonwänden?  
Hier gibt es eine Besonderheit: Eine reine X/Z-Farbkarte funktioniert hervorragend auf horizontalen und geneigten Flächen. An einer senkrechten Canyonwand würde sie aber kaum vertikale Variation zeigen.

Dafür würde ich einen zweiten Projektionsmodus verwenden:

Oberflächentyp

Farbverteilung

Ebene, Hügel, Plateau

Organisches X/Z-Farbfeld

Steile Wand, Canyon

Eigenes, entlang der Wand verlaufendes Farbfeld

Übergangsbereiche

Weiche Überblendung der beiden Projektionen

Felskanten und Terrassen

Gezielte dunklere Akzentfarbe

Technisch wäre das mit einer triplanaren Projektion oder mit lokalen Oberflächenkoordinaten möglich.

Die Farben bleiben dabei höhenunabhängig. Die Ausrichtung an der Wand bestimmt nur, wie wir die Farbmuster sinnvoll auf die Oberfläche projizieren.

4\. Die Outlines würde ich separat behandeln  
Das Referenzbild hat eine wichtige Eigenschaft: Nicht jede Farbgrenze ist automatisch eine dunkle Linie.

Ich würde deshalb zwei Dinge unterscheiden:

Farbflächengrenzen: weitgehend ohne Kontur; unterschiedliche Ocker-, Orange- oder Brauntöne grenzen unmittelbar aneinander.

Geometrische Kanten: einzelne Felsvorsprünge, Plateauabbrüche und markante Bruchstellen erhalten eine dünne, dunklere, farblich passende Kantenbetonung.

Zum Beispiel:

Illustrative Ockerpalette mit zwei dunkleren Tönen für Schatten und ausgewählte Kanten.  
Keine globale schwarze Kontur und kein dauerndes Nachzeichnen aller Mesh-Dreiecke. Das würde zu technisch und unruhig wirken.

5\. Wie teuer wäre das?  
Erfreulicherweise wäre diese Methode relativ günstig.

Für einen ersten KFB-Prototyp würde ich die Farbmasken einmal pro Terrain-Chunk generieren, beispielsweise als kleine RGBA-Textur. Der Shader wählt daraus die vier Palettenfarben. Die Farbflächen müssen dann nicht ständig neu berechnet werden.

Beim Sculpting des Geländes bleibt das Farbfeld grundsätzlich erhalten. So verändert sich die Form, während die Farbverteilung an ihrer Weltposition bleibt. Optional könnte man Farbflächen später bewusst mitziehen.

Das ist auch für unsere bereits vorhandene Surface Truth / Terrain-Editor-Architektur geeignet: Die neue Farblogik wäre ausschließlich eine Darstellungsschicht und keine neue Gelände- oder Kollisionsinstanz.

Mein favorisiertes KFB-Konzept  
Ich würde es als Organic Palette Fields formulieren:

Terrain Geometry

Bestehende Höhenfunktion, Sculpting und Kollision bleiben maßgeblich.

Organic Color Field

Vier gebrochene Farben, breite zusammenhängende Flächen, unabhängig von Höhenstufen.

Selective Edge Accents

Wenige farblich abgestimmte Linien an tatsächlichen geometrischen Brüchen.

Der wichtigste Test wäre für mich ein Terrain mit zwei unterschiedlich hohen Plateaus und einem Canyon. Wir verändern anschließend die Höhe des einen Plateaus erheblich, ohne die Farbflächen neu zu berechnen. Wenn die Farben organisch erhalten bleiben und die Landschaft trotzdem weiterhin wie ein zusammenhängendes, gestaltetes Cartoon-Relief wirkt, haben wir die richtige Trennung erreicht.

Und das Schöne daran: Wir könnten später denselben Mechanismus mit anderen Paletten für KFB Town, Protopia oder Dystopia verwenden – ohne jedes Mal ein neues Terrainsystem zu bauen.

In PDF konvertieren  
Benutzeranhang  
super, gefällt mir\!

in cartoons nutzt man eigentlich wenig gradienten; aber für den unteren/vorderen bildbereich könnten wir eine art schatten/dunklere farbe zeigen wie in dem screenshot   
… was denkst du?  
Ja — das finde ich sehr sinnvoll.  
Und ich glaube, du triffst da genau den richtigen Punkt:

Nicht viele echte Gradienten,  
aber eine größere, zusammenhängende dunklere Schatten-/Vordergrundform im unteren Bildbereich, damit das Bild Bühne, Tiefe und Ruhe bekommt.

Das ist ein wichtiger Unterschied.

Mein Kurzfazit  
Ich würde für uns sagen:

keine weich verlaufenden Airbrush-Gradienten als Standard  
stattdessen große, flächige Tonzonen  
besonders im unteren / vorderen Bildbereich  
mit einer etwas dunkleren, wärmeren oder kühleren Schattenfarbe  
eher als zusätzliche Farbfläche als als “Lichtverlauf”  
Also nicht:

“der Boden wird nach vorne hin per Gradient dunkler”

sondern eher:

“im Vordergrund liegt eine große Schatten- oder Tonform”

Das ist viel cartooniger.

Warum das gut funktioniert  
Im Cartoon- und Background-Bereich arbeitet man oft mit:

klaren Flächen  
wenigen Werten  
großen Schattenmassen  
Tiefe durch Staffelung statt durch Rendering  
Diese dunklere Zone vorne macht gleich mehrere Dinge:

sie erdet das Bild,  
sie gibt dem Vordergrund mehr Gewicht,  
sie lenkt den Blick nach innen,  
sie schafft Trennung zwischen Vordergrund und Mittelgrund,  
und sie verhindert, dass alles gleich hell und “offen” wirkt.  
Gerade bei Wüste / Canyon / offener Fläche ist das sehr hilfreich.

Was ich daran mag  
Im Screenshot ist unten/vorne die Fläche nicht einfach nur “dieselbe Bodenfarbe”.  
Sie wirkt eher wie:

eine ruhigere Vordergrundbühne  
mit etwas dunklerem Wert  
und dadurch wie eine Art Spiel- oder Aktionsfläche  
Das ist für uns super interessant, weil wir im Spiel ja oft genau so etwas brauchen:  
eine Fläche, auf der Figuren, Fahrzeuge oder Objekte gut lesbar sind.

Wie ich das für unseren Stil aufbauen würde  
1\. Keine echten Gradienten, sondern Tonflächen  
Ich würde den Vordergrund nicht mit einem weichen Verlauf abdunkeln, sondern mit einer zusätzlichen Farbmaske.

Zum Beispiel:

Grundboden: warmes Ocker  
Vordergrund-Schattenfläche: etwas dunkleres, satteres Orangebraun  
Übergang: leicht unregelmäßig, aber nicht airbrushig  
Also eher:

Shape  
nicht Gradient  
2\. Die dunklere Zone sollte aus der Palette selbst kommen  
Ganz wichtig: nicht schwarz oder grau drüberlegen.

Sondern:

bei gelb/ocker Terrain:  
Vordergrundschatten \= dunkleres Rostocker / Zimtbraun / warmes Umbra  
bei grünem Terrain:  
Vordergrundschatten \= gedecktes Oliv / Moosgrün / erdiges Grünbraun  
bei rotem Terrain:  
Vordergrundschatten \= verbranntes Siena / Rotbraun / dunkles Terracotta  
Dadurch bleibt es illustrativ und integriert.

3\. Die Form sollte grafisch ruhig sein  
Ich würde die Schattenfläche unten nicht zu fleckig machen.

Besser:

groß  
lesbar  
sanft gebrochen  
vielleicht leicht organisch geschwungen  
aber nicht chaotisch  
Also eher wie eine Bühnenfläche oder ein ruhiger Bodenkeil.

Für unser Terrain-System wäre das sehr gut  
Wir hatten ja gerade davon gesprochen, dass die Farbflächen nicht von der Höhe abhängen sollen.

Diese Vordergrundabdunklung würde ich daher als zusätzliche unabhängige Bild-/Raumlogik behandeln.

Also neben:

Terrainform  
organischen Farbflächen  
Kantenbetonung  
kommt noch:

Foreground Value Mass  
dazu.

Technisch könnten wir das auf drei Arten machen  
Option A – kamerabasierte Vordergrundmaske  
Das ist wahrscheinlich die einfachste und stärkste Lösung.

Eine Maske dunkelt den Boden im nahen Kamerabereich ab, aber nicht linear wie ein Gradient, sondern als große stilisierte Fläche.

Das heißt:

abhängig von Distanz zur Kamera  
aber mit organischer Form  
leicht durch Noise oder Warping aufgebrochen  
Vorteil:  
sehr kontrollierbar, gute Lesbarkeit für Gameplay.

Nachteil:  
kann zu “UI-artig” wirken, wenn es zu offensichtlich kameraabhängig ist.

Option B – bildkompositorische Schattenzone  
Hier definierst du pro Chunk / pro Szene / pro Raum eine Schatten- oder Tonzone im Vordergrund.

Also mehr wie ein gemalter Hintergrund:

vorne dunkler  
Mitte offener  
Ferne heller und bläulicher  
Vorteil:  
sehr schön und klassisch-cartoonig.

Nachteil:  
weniger universell, eher szenisch komponiert.

Option C – Kombination aus Vordergrundton \+ echten Schlagschatten  
Das wäre mein Favorit.

Also:

1\. großer ruhiger Vordergrundton  
für die Gesamtkomposition

2\. dazu lokale Schlagschatten  
von Felsen, Kakteen, Props, Kanten, Hügeln

Dann bekommt man:

die ruhige große Massenwirkung  
plus kleine glaubwürdige Akzente  
Was ich dabei vermeiden würde  
1\. Weiche 3D-Gradienten überall  
Sonst verliert es schnell den Cartoon-Charakter.

2\. Vordergrund einfach nur dunkler machen  
Wenn einfach alles unten dunkler wird, wirkt es wie ein billiger Vignette-Trick.

3\. Schwarz als Schattenfarbe  
Zu hart. Besser immer eine dunklere Palettenfarbe.

4\. Zu viel Kleinmuster im Schatten  
Wenn der Vordergrund gleichzeitig dunkel und stark fleckig wird, wird die Szene unruhig.

Meine stilistische Empfehlung für KFB  
Ich würde für uns mit 3 Wertebenen arbeiten:

A. Lichtfläche  
helle Hauptflächen, gut lesbar

B. Mittlere Flächen  
die eigentlichen Farbflächen / Bänder / Terrains

C. Schattenmasse  
große, ruhigere dunklere Form im Vordergrund oder an bestimmten Terrassenzonen

Das ist viel näher an klassischer Cartoon-Background-Logik als ein shaderiger Vollverlauf.

Auf unser Canyon-/Roadrunner-artiges Terrain bezogen  
Da würde ich konkret sagen:

ferne Flächen: heller, etwas luftiger, weniger Kontrast  
mittlere Flächen: die eigentlichen Ocker-/Orange-Bänder  
vorderer Boden: eine zusammenhängende dunklere Fläche  
Kanten: sparsame dunklere Linien oder dunkle Facetten  
Schlagschatten: klar, aber grafisch vereinfacht  
Dann wirkt es gleichzeitig:

stilisiert  
räumlich  
ruhig  
spielbar  
Meine Lieblingsformulierung dafür  
Nicht „Gradient“, sondern:

foreground shadow plane  
oder  
value mass in the foreground

Das trifft besser, was wir wollen.

Mein konkreter Vorschlag für uns  
Ich würde unser Terrain-Konzept jetzt so erweitern:

Terrain Look Stack  
Terrain geometry  
organische Farbflächen  
selektive Kantenbetonung  
große Vordergrund-Schattenmasse  
kleine lokale Schlagschatten  
Das ist aus meiner Sicht die beste Mischung aus:

cartoonig  
kostengünstig  
gut steuerbar  
gameplaytauglich  
Wenn du willst, kann ich dir als Nächstes daraus direkt ein konkretes Shader-/Systemkonzept machen, also z. B.:

welche Masken wir brauchen,  
wie die Vordergrund-Schattenmasse berechnet werden könnte,  
wie wir sie ohne Gradientenlook hinbekommen,  
und wie das mit den organischen Farbflächen zusammenspielt.

In PDF konvertieren  
Ja, sehr gut. Diese vordere Schattenmasse, die sollte sich wahrscheinlich dann an der entsprechenden Farbigkeit orientieren. Und auch für die Schlagschatten beziehungsweise die Schatten von Figuren und auch dem Racer würde ich halt dann auch nicht schwarz nehmen, sondern die entsprechenden Brauntöne oder wie es halt zu den jeweiligen Biomen oder Terrain-Palette passt. sodass du dann eigentlich jetzt in unserem Beispiel so eine Art dunklen Braunton für die Schatten zum Beispiel nehmen und die halt auch relativ einfach und simpel gestalten, inklusive der Überlagerung und so.  
Ja — genau so würde ich es machen.  
Das ist aus meiner Sicht der richtige Schritt, damit der Look wirklich cartoonig und geschlossen wirkt.

Kurz gesagt  
Die Schatten sollten bei uns nicht als neutrales Schwarz/Grau gedacht werden, sondern als Teil der Biom-Palette.

Also nicht:

Bodenfarbe  
plus schwarzer Schatten  
sondern eher:

Bodenfarbe  
plus dunklere Schattenvariante derselben Farbfamilie  
In eurem Canyon-/Roadrunner-Beispiel also tatsächlich:

Sand / Ocker / Orange als Grundflächen  
dunkles Braun / Rotbraun / warmes Umbra für Schatten  
eventuell noch ein zweiter, tieferer Braunton für Überlagerung oder Occlusion  
Das ergibt einen viel harmonischeren Look.

Warum das so gut funktioniert  
Wenn man in stilisierten Cartoons schwarze Schatten nimmt, passiert oft Folgendes:

der Schatten wirkt wie ein fremder Layer,  
das Bild wird härter und technischer,  
Figuren und Fahrzeuge “kleben” weniger in der Welt,  
die Farbpalette zerfällt.  
Wenn stattdessen der Schatten aus der Palette selbst abgeleitet wird, bekommt man:

mehr Zusammenhalt,  
weichere, aber trotzdem klare Stilwirkung,  
biomabhängige Atmosphäre,  
und eine bessere Integration von Figur, Racer und Terrain.  
Ich würde die Schatten in drei Klassen aufteilen  
1\. Große Vordergrund-Schattenmasse  
Das ist die große ruhige dunklere Form unten/vorne im Bild.

Eigenschaften:

große zusammenhängende Fläche  
aus der Terrain-Farbigkeit abgeleitet  
keine schwarze Vignette  
keine weichen Airbrush-Verläufe  
eher wie eine zusätzliche Farbform  
Im Canyon-Beispiel:

Grundfläche: helles Ocker / Sandgelb  
Vordergrundmasse: dunkles warmes Braunocker oder Rotbraun  
Das ist keine “Beleuchtungsphysik”, sondern Komposition.

2\. Schlagschatten von Objekten, Figuren, Racer  
Die würde ich ebenfalls sehr einfach und flächig halten.

Also:

klare Form  
wenig Binnenstruktur  
kaum oder keine Gradienten  
farblich passender Schatten-Ton  
eher grafisch stilisiert als physikalisch simuliert  
Für den Racer oder eine Figur wäre das z. B.:

flacher, leicht verzerrter Schatten auf dem Boden  
abhängig von Lichtwinkel  
aber bewusst vereinfacht  
in dunklem Braun statt Schwarz  
Gerade für Fahrzeuge ist das super, weil so der Racer sofort “sitzt”, ohne realistisch rendern zu müssen.

3\. Kontakt- und Occlusion-Schatten  
Das sind die kleineren dunklen Stellen:

unter Felsen  
an Bodenkontakten  
in Spalten  
unter dem Racer  
unter Füßen  
an Kanten, wo Formen aufeinandertreffen  
Die würde ich noch etwas dunkler ansetzen als die normalen Schlagschatten — aber immer noch innerhalb derselben Farbfamilie.

Also zum Beispiel:

Schlagschatten \= Braunton A  
Occlusion \= Braunton B, etwas tiefer und satter  
So bekommt man Tiefe, ohne ins Schwarz zu kippen.

Mein Lieblingsmodell: Schatten als Palettenfamilie  
Ich würde pro Biom nicht nur Base Colors definieren, sondern gleich eine kleine Schattenfamilie.

Beispiel Canyon / Warm Dry Hills  
Basisflächen  
Sandgelb  
Ocker  
Orangeocker  
Terracotta  
Schattenfarben  
Shadow 1: warmes Rotbraun  
Shadow 2: dunkles Umbra-Braun  
Kantenakzent  
etwas trockener, dunkler Braunton  
für Cliff-Edges, Terrassenbrüche, Kantenbetonung  
Dann können wir überall dieselbe Logik anwenden:

Terrain-Schatten  
Figurenschatten  
Racer-Schatten  
Prop-Schatten  
Occlusion  
Alles kommt aus derselben Familie.

So würde ich die Überlagerung behandeln  
Das ist wichtig, weil du es ja angesprochen hast.

Ich würde keine realistische Shadow-Multiply-Kaskade machen, wo sich fünf Schattenebenen immer weiter verdunkeln.  
Das sieht schnell technisch oder schlammig aus.

Stattdessen eher ein begrenztes Schattenstufensystem.

Vorschlag: maximal zwei Schattenstufen  
Stufe A – normaler Schlagschatten  
Standard für Figuren, Racer, Objekte  
Stufe B – tiefer Schatten / Überlagerung / Occlusion  
nur wenn zwei Dinge zusammenkommen  
oder an sehr engem Kontakt  
oder in Spalten / unter Felskanten  
Das reicht meistens völlig.

So bleibt die Lesbarkeit hoch.

Was das für Figuren und Racer bedeutet  
Für Figuren  
Schatten sehr simpel:

flache Form auf dem Boden  
leicht elliptisch oder perspektivisch verzogen  
kein schwarzer Blob  
Biom-Schattenfarbe  
Wenn die Figur springt:

Schatten etwas getrennt vom Körper  
aber gleiches Schattenvokabular  
Für den Racer  
Das ist besonders wichtig.

Ich würde beim Racer zwei Schattenformen kombinieren:

1\. Boden-Schlagschatten  
einfache stylisierte Bodenform  
relativ ruhig  
an Fahrtrichtung/Licht angepasst  
2\. Kontakt-/Unterbodenschatten  
kleine dunklere Masse direkt unterm Fahrzeug  
gibt Gewicht und Erdung  
So hat der Racer sofort mehr Präsenz.

Ich würde auch Selbstschatten vereinfachen  
Nicht nur Bodenschatten — auch auf Felsen, Figuren, Props.

Aber ebenfalls nicht mit “physically based shading”, sondern eher mit:

klaren Schattenflächen  
vereinfachten Schattenblöcken  
wenigen Tonstufen  
Gerade für unsere Terrains und Props würde ich sagen:

Lichtseite  
Schattenseite  
vielleicht noch kleiner Akzent / Kantenlicht  
fertig  
Das passt viel besser zu der flächigen Ästhetik.

Praktisch würde ich das als kleines System formulieren  
Pro Biom / Terrainprofil:  
baseColors\[\]  
shadowColor  
deepShadowColor  
edgeAccentColor  
Zum Beispiel:

baseColors \= 4 Flächenfarben  
shadowColor \= Standard-Schatten  
deepShadowColor \= Kontakt/Überlagerung  
edgeAccentColor \= sparsame Kantenbetonung  
Damit hätten wir eine einheitliche Look-Logik.

Mein wichtigster Stil-Hinweis  
Die Schatten sollten klar und einfach sein, aber nicht überall gleich dick oder gleich dominant.

Also:

große Vordergrundmasse \= ruhig und breit  
Objekt-/Figurenschatten \= klar, lesbar, simpel  
Occlusion \= gezielt und sparsam  
Kantenbetonung \= selektiv  
Nicht alles gleichzeitig überall.

Meine klare Empfehlung für unser Beispiel  
Für das warm-ockerne Canyon-Biom:

Schatten-Setup  
Große Vordergrundmasse: dunkles Ockerbraun / Rotbraun  
Schlagschatten von Figuren/Racer: etwas klareres warmes Braun  
Kontakt-/Tiefe-Schatten: dunkles Umbra  
Kantenbetonung: trockener dunkler Braunton, leicht entsättigt  
Keine schwarzen Schatten.  
Keine grauen Neutral-Schatten.  
Keine komplizierten Überlagerungen.

So wirkt alles wie aus einem Guss.

Wenn ich das in einem Satz bündeln müsste  
Die Schatten sind bei uns keine Beleuchtungsebene, sondern ein kontrollierter Teil der Farbpalette.

Das ist, glaube ich, die entscheidende Haltung.

Wenn du willst, kann ich dir als Nächstes daraus direkt ein kleines KFB-Terrain-Look-Schema machen, also z. B.:

Palette-Struktur pro Biom  
Flächenfarben \+ Schattenfarben \+ Kantenfarben  
Regeln für Figuren- und Racer-Schatten  
Regeln für Überlagerung / Deep Shadow  
einen kleinen praktischen Implementierungsplan für Shader und Rendering.

In PDF konvertieren  
Ja, sehr gut, gefällt mir, machen wir so, aber eine wichtige Ergänzung: Also diese gebastelten runden Schatten, das waren immer totale Fails, also das hat nie funktioniert. Insofern würde ich schon sagen, wir müssen da den 3D-Schatten nehmen und den entsprechend farbig und von der Schattenlogik behandeln.  
Ja — wichtige Korrektur, und ich stimme dir zu.

Diese gebastelten, ovalen „Blob Shadows“ oder runden Bodenschatten sind fast immer ein Fail, sobald:

die Figur nicht ganz simpel ist,  
das Terrain Höhenunterschiede hat,  
der Racer kippt, springt oder driftet,  
oder die Szene räumlich etwas komplexer wird.  
Dann wirken sie sofort wie ein aufgeklebter Trick.

Also: ja, wir sollten echte 3D-Schatten nehmen  
Aber mit zwei klaren Anpassungen:

echte 3D-Schattenprojektion / Shadow Mapping  
stilisierte Schattenfarbe und vereinfachte Schattenlogik  
Also nicht Fake-Blob, sondern:

echter räumlicher Schattenwurf,  
aber in unserer cartoonigen Farb- und Wertelogik interpretiert.

Was das konkret heißt  
Beibehalten:  
Schatten kommen wirklich von:  
Figuren  
Racer  
Props  
Felsen  
Kanten  
Schatten liegen korrekt auf:  
unebenem Terrain  
Wänden  
Hügeln  
Rampen  
Canyonkanten  
Das ist der große Vorteil.

Verändern:  
Schattenfarbe ist nicht schwarz  
Schatten sind nicht physikalisch weich-realistisch  
Schatten werden palettenbasiert  
Schattenintensität und Stufung werden stilisiert begrenzt  
Ich würde das System jetzt so formulieren  
1\. Echte Shadow Maps als räumliche Wahrheit  
Die Engine berechnet ganz normal den Schattenwurf.

Also:

Lichtquelle  
Shadow map  
Shadow receiver  
Schattenwurf von Racer, Figuren, Props etc.  
Damit bekommen wir:

korrekte Perspektive  
korrekten Kontakt zum Boden  
korrekte Projektion über Unebenheiten  
korrekte Veränderung bei Sprüngen, Drifts, Schräglagen  
Das ist genau der Teil, den die Blob-Shadows nie sauber leisten.

2\. Schattenfarbe wird remapped  
Der Schattenwert aus dem Rendering wird nicht einfach als Schwarz-Multiplikation benutzt, sondern auf eine biomspezifische Schattenfarbe gemappt.

Zum Beispiel im Canyon-Biom:

lit color \= Bodenpalette  
shadow tint \= dunkles Braun / Rotbraun  
deep shadow \= dunkleres Umbra  
Das heißt:  
Der Shadow-Faktor bestimmt wie stark der Schatten ist,  
aber die Farbe kommt aus unserer Palette.

3\. Schatten sollten vereinfacht werden  
Auch wenn sie technisch aus echtem 3D kommen, würde ich sie stilistisch vereinfachen.

Also nicht:

superweiche penumbra  
realistische Streuung  
viele feine Halbschatten  
sondern eher:

klarer Schatten  
begrenzte Weichheit  
vielleicht sogar leicht quantisiert  
ruhiger Gesamteindruck  
Damit bleibt der Cartoon-Look erhalten.

Mein bevorzugtes Modell  
„Real geometry, stylized shadow response“  
Das heißt:

Geometrisch echt:  
echter Shadow Caster  
echter Receiver  
echte Projektion  
Visuell stilisiert:  
farbig  
nicht schwarz  
mit nur 1–2 Schattenstufen  
eventuell leicht geglättet oder leicht gehärtet  
in Biom-Palette eingebettet  
Zwei gute Umsetzungsvarianten  
Option A – Echte Shadow Maps \+ Farb-Remap im Material  
Das wäre vermutlich unser Standard.

Ablauf:

Shadow map liefert Wert shadow  
Material/Shader mischt:  
Lichtfarbe / Base Color  
Biom-Shadow-Color  
Also ungefähr logisch:

0 \= voll beleuchtet  
1 \= voll im Schatten  
Und statt Schwarz zu mischen, mischen wir zu:

shadowColor  
Das ist wahrscheinlich die sauberste Route.

Vorteil  
robust  
einfach mit Terrain, Racer, Figuren kombinierbar  
überall konsistent  
Option B – Echte Shadow Maps \+ toonartige Stufung  
Hier wird der Shadow-Wert noch zusätzlich stilisiert.

Zum Beispiel:

beleuchtet  
normaler Schatten  
tiefer Schatten  
Also quasi 2 oder 3 klare Stufen.

Das wäre besonders schön, wenn wir einen noch grafischeren Look wollen.

Vorteil  
sehr cartoonig  
sehr kontrollierbar  
kein matschiger Halbschatten  
Nachteil  
kann bei falscher Einstellung etwas zu hart oder flackerig werden  
Ich würde das als optionale Veredelung sehen.

Für die große vordere Schattenmasse gilt dasselbe Prinzip  
Da würde ich jetzt leicht umdenken:

Vorher hatten wir sie eher als kompositorische Zusatzfläche beschrieben.  
Jetzt, mit deiner Ergänzung, würde ich sagen:

Die Vordergrund-Schattenmasse kann aus zwei Quellen kommen:  
A. Kompositorische Tonfläche  
große ruhige zusätzliche dunklere Wertmasse  
unabhängig vom direkten Schattenwurf  
B. Echte 3D-Schatten  
von Geländeformen, Felsen, Props etc.  
Und ich glaube, für uns ist die beste Lösung:

beides kombiniert, aber die echte 3D-Schattenlogik bleibt die Basis.

Das heißt:

kein runder Bodenfleck  
keine künstliche Schattenellipse  
sondern echter Schattenwurf  
plus bei Bedarf zusätzliche ruhige Vordergrund-Tonmassen als Gestaltungsschicht  
Wichtig für Racer und Figuren  
Gerade beim Racer ist das Gold wert.

Warum?

Weil der Racer:

schräg liegen kann,  
springen kann,  
über Kuppen fährt,  
an Rampen kippt,  
nahe an Felswänden fährt.  
Ein echter 3D-Schatten zeigt das alles sofort glaubwürdig.

Ein Fake-Schatten macht genau da schlapp.

Für Figuren gilt dasselbe:

Beine  
Sprung  
Kontakt zum Boden  
Staffelung mit Terrain  
Alles profitiert davon.

Wie ich die Schatten stilistisch behandeln würde  
Nicht schwarz  
sondern:

shadowColor aus Biom-Palette  
Nicht zu weich  
sondern:

moderat weich oder leicht gehärtet  
Nicht zu viele Werte  
sondern:

1 normale Schattenstufe  
optional 1 Deep-Shadow-Stufe  
Nicht neutral  
sondern:

warm/kalt passend zum Biom  
Beispiel Canyon-Biom  
Terrainfarben  
Sand  
Ocker  
Orange  
Terracotta  
Schattenfarben  
Shadow: warmes Braunocker  
Deep Shadow: dunkles Rotbraun / Umbra  
Anwendung  
Figur wirft echten Schatten auf den Boden  
Racer wirft echten Schatten auf Boden und Wand  
Felsen werfen echte Schatten auf Terrain  
Schatten werden nicht schwarz, sondern braun interpretiert  
Das ergibt genau diesen integrierten Look.

Ein wichtiger Zusatz: Schatten und Kantenbetonung trennen  
Die Schatten dürfen nicht dieselbe Funktion übernehmen wie die Kantenakzente.

Also:

Schatten  
\= Licht-/Raumlogik

Kantenbetonung  
\= grafische Struktur / Formlesbarkeit

Beide können ähnlich farblich sein, aber sie sind nicht dasselbe.

Sonst wird es schnell zu dick oder zu unruhig.

Mein technischer Favorit für uns  
Ich würde das KFB-seitig jetzt so festziehen:

Schattenmodell  
echte 3D-Schatten als Basis  
Shadow color override / palette remap pro Biom  
vereinfachte Shadow Response  
optional zweistufige Toon-Schatten  
kein Blob-Shadow-System  
Zusätzliche Gestaltung  
ruhige Vordergrund-Tonmassen optional  
aber nicht als Ersatz für echten Schattenwurf  
Klare Arbeitsregel  
Wenn ich das als Stilregel formuliere:

Keine Fake-Blob-Schatten. Schatten kommen aus echter 3D-Projektion.  
Ihre Darstellung wird jedoch farblich und wertmäßig stilisiert und an die Biom-Palette angepasst.

Das ist, glaube ich, genau die saubere Linie.

Wenn du willst, kann ich dir als Nächstes direkt das daraus ableiten:

ein kleines Shadow-System-Schema für KFB  
Palette-Regeln für Schatten / Deep Shadow / Edge Accent  
konkrete Shader-Logik für Terrain \+ Figuren \+ Racer  
eine kleine MVP-Reihenfolge: erst was bauen, dann was tunen.

In PDF konvertieren  
Ja gerne weiter und check bitte den aktuellen Stand bei GitHub ein, dass WS0 und Cloud Code das dann lesen und aufnehmen können und dann gerne weiter bitte.

8m 29s nachgedacht  
KFB Cartoon Terrain – der verbindliche Gestaltungsansatz  
Der GitHub-Abgleich zeigt: WS0 hat bereits einen Terrain-Gesamtauftrag unter Issue \#439 erfasst. Er umfasst Banden, Rampen, Geländeform, Farbflächen und echte farbige 3D-Schatten. Ich ergänze diesen bestehenden Auftrag um unsere detaillierte technische und gestalterische Ausarbeitung, statt einen konkurrierenden Plan anzulegen.

Unser gemeinsamer Ansatz besteht aus fünf zusammenwirkenden Ebenen:

Terrainform: Hügel, Plateaus, Canyons und organische Übergänge.

Organische Farbflächen: drei bis vier gebrochene Farben, deren Grenzen ausdrücklich nicht den Höhenlinien folgen.

Selektive Kantenbetonung: dunklere, zur jeweiligen Palette passende Konturen an tatsächlichen Formbrüchen.

Vordergrund-Tonmasse: eine große, ruhige dunklere Farbfläche statt eines künstlichen Verlaufs.

Echte 3D-Schatten: von Figuren, Racer, Felsen und Bauten – räumlich korrekt projiziert, aber mit der Farbigkeit und reduzierten Tonstufung des jeweiligen Bioms.

Die wichtigste feste Regel: keine runden Fake-/Blob-Shadows, auch nicht als vermeintlich günstiger Ersatz.

GitHub-Check-in abgeschlossen  
Gespeichert und rückgelesen – WS0-Register

Cartoon Terrain – vollständige Design- und Shader-Spezifikation

Technisches Konzept, Palettenrollen, Shadow-Remapping, Masken, Umsetzungsstrategie und Prüfanforderungen.

WS0-Auftrag \#439 – Gesamt-Terrainkonzept

Mit der neuen Spezifikation verknüpft. Banden und Rampen bleiben ausdrücklich im Gesamtumfang.

Quellen- und Prüfbericht

Nachweis

Ergebnis

Repository

georg-doc/kayfabizarro

Branch

docs/kfb-decisions-register-2026-10-11

Exakter Head

1af1abff4e662bc7f807fb20db9ec596c908e0df

Dateien

2 neu, 1 additiv aktualisiert

Prüfungen

12/12 Inhaltschecks, 3/3 Datei-Rücklesungen

Runtime-/Browser-Tests

0

Veröffentlichung

Keine

Wie ich die technische Umsetzung konkret angehen würde  
Der Kern sollte ein kleiner Zusatz zum vorhandenen WS1-Materialsystem sein, kein eigenständiger neuer Terrain-Renderer.

Das Material benötigt ein organisches Farbrollenfeld und einen bereits von der vorhandenen Lichtpipeline berechneten Schattenwert. Die vereinfachte Logik wäre:

// Konzept-Pseudocode – keine bestehende KFB-API

const region \= organicColorField(surfaceCoordinates, seed);  
const baseColor \= biomePalette.surfaces\[region\];

const visibility \= existing3DShadowMap.sample(surfacePoint);  
const shadowColor \= biomePalette.shadowFor(baseColor);

const result \= cartoonShadowResponse(  
  baseColor,  
  shadowColor,  
  visibility  
);

Der entscheidende Unterschied zur üblichen Beleuchtung: Der Schattenwert steuert, wo die Fläche dunkler wird. Die jeweilige Material- und Biompalette entscheidet, welche Farbe diese Fläche erhält.

Die übrige Architektur würde ich so halten:

Bestandteil

Technischer Ansatz

Organische Farbflächen

Große, verzerrte Region-Masken ohne Höhen-Cutoffs

Vordergrund-Tonmasse

Separate, räumlich verankerte Farbmaske

Figur-/Racer-Schatten

Vorhandene echte Shadow Maps

Farbige Schatten

Materialseitige Palettenzuordnung pro Empfängerfläche

Tiefere Kontaktschatten

Vorhandenes AO, begrenzt statt mehrfach multipliziert

Kantenbetonung

Seltene geometriegebundene dunklere Farbakzente

Für die endgültige Shader-Technik muss Claude Code zuerst die tatsächliche WS1-Material- und Shadow-Pipeline untersuchen. Insbesondere sollte der bestehende Licht-Owner erhalten bleiben.

Mein bevorzugter erster visueller Test  
Ich würde die bestehende Mesa-/Canyon-Welt verwenden: ein echtes Gelände, eine vorhandene Figur, ein Racer und ein Banden-/Rampenanschluss.

Darin können wir direkt beurteilen, ob das Terrain seine organische Farbigkeit behält, die Schatten über unebene Flächen korrekt wandern und Vordergrund-Tonmassen die Komposition verbessern, ohne die Fahrfläche zu verdecken.

Ein noch offener Punkt: WS0s bestehender Auftrag verweist auf einen früheren WS1-GitHub-POC für die gesamte Banden-/Rampen-/Terrainlösung. Dessen exakte Quelle ist noch nicht eindeutig gepinnt. Ich habe die fehlenden Geometriedetails deshalb nicht erfunden.

Der nächste Gate bleibt: WS0 identifiziert den vollständigen ursprünglichen Terrain-POC und lässt WS1b das zusammenhängende Konzept als reversible Variante im bestehenden MVP erproben. Claude Code kann die jetzt gesicherte Spezifikation dabei als technischen Arbeitsauftrag verwenden, sobald WS0 die Umsetzung zuweist.

In PDF konvertieren  


---

## Quelle: WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1.md

# WS0 → WS1b / Claude Code · KFB Cartoon Relief: Organic Color Fields + real palette shadows · DESIGN R1

**Datum:** 19.10.2026 · **Quelle:** Georgs laufende Terrain-/Cartoon-Look-Diskussion mit Roadrunner/Canyon-Referenzbildern und expliziten Korrekturen bis „echte 3D-Schatten, keine runden gebastelten Schatten“.  
**Status:** GEORG DESIGN DIRECTION / ausführliche PLANUNG. **Nicht implementiert, nicht gerendert, kein humaner Screenshot-/Runtime-PASS.**  
**Einzelner bestehender Steuerungsowner:** WS0 / `KFB_HUB/30_DECISIONS` auf Register-Branch `docs/kfb-decisions-register-2026-10-11`. **Einziger produktiver Spiel-Owner:** WS1b / bestehender `kfb-planet`-R3F-Runtime, kein zweiter Renderer, Terrain- oder Material-Owner. Claude Code ist ein möglicher ausführender Agent **im vom Owner vergebenen Slice**, kein zweiter Runtime-Owner.  
**Bestehender Parent-Auftrag:** [Issue #439](https://github.com/georg-doc/kayfabizarro/issues/439), [WS0 Gesamtterrain Intake R1.2](WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md). Dieses Dokument präzisiert **Farbflächen/Schatten/Outlines innerhalb dieses Gesamtauftrags**, nicht nur einen Shadow-only-Prototyp. Seine noch nicht eindeutig gepinnten ursprünglichen Banden-/Rampen-POC-Details werden NICHT erfunden.

## 0 · Was Georg festgelegt und was er verworfen hat

### Beibehalten
1. Geländeform darf weiter durch ein vorhandenes Heightfield / WS1-Terrain entstehen, aber **Farbflächen folgen NICHT den Höhenstufen**. Grobe, zusammenhängende Flächen / geschwungene und lokal verformte Farbbahnen wie in klassischen Cartoon-Backgrounds.
2. **3–4 gebrochene Farben** einer Zone, breit und klar lesbar statt texturiertem Kleinteil-Rauschen. Organic Color Fields, nicht geologische Schnittkuchen-Horizontallagen.
3. Sparsame **farblich passende dunklere Kantenbetonung** an ausgewählten echten Landform-Brüchen/Kämmen/Terrassenkanten, **keine schwarze Gesamt-Tuscheoutline**.
4. Vorderer/unterer Bildbereich kann eine **große ruhige dunklere Farb-/Tonmasse** tragen – als grafische Kompositionsebene, nicht als pauschaler vertikaler Shader-Gradient, schwarze Vignette oder Fake-Schlagschatten.
5. **Alle Figuren, Racer, Props und Gelände werfen echte aus 3D-Geometrie/Beleuchtung berechnete Shadow-Map-Schatten**. Sie bewegen sich mit Animation, Fahr- und Flugzustand und folgen realen Empfängerflächen, auch bei Hang, Böschung, Rampe oder Felswand.
6. Der Schatten wird **auf die Palette des tatsächlichen empfangenden Materials/Bioms** abgebildet: im Canyon warmes Ocker-/Rost-/Umbra-Braun; andere Biome bekommen ihre eigenen Schatten-/Kontakt-/Kantenrollen. Lesbare, einfache, überwiegend harte flächige Cartoon-Schatten statt komplexer weich-verlaufender PBR-Penumbra.
7. Überlagerung/AO/Kontakt **gedeckelt und vereinfacht**; Schatten-Vervielfachung darf nicht zum schwarzen Schlamm werden. Bewahre Quellenasset-Knetform, Material Golden, Fahrgefühl und Lesbarkeit.

### Explizit ausgeschlossen
- Stufen-/Contour-Height-Banding wie ein Schichtkuchen als dominantes Farbschema.
- Gebastelte runde Ellipsen, Blob Shadows, transparente Shadow Discs, Bodenkleckse, projected circle decals und ähnliche Ersatzschatten **für Racer/Residents**, auch dann nicht, wenn sie günstig wären.
- Schwarze/graue Standardmultiply-Schatten als fertiger Stil, schwarze Toon-Outlines um jede Kante, globales Kantendetektieren aller Mesh-Dreiecke, Airbrush-/Vignette-Gradienten, Kameraklebe-Schattentexturen.
- Neue zweite World-/Camera-/Shadow-/Lighting-Engine, Copy/Paste einer fremden Cartoon-Marke oder Austausch von Joyride-/Clay-Golden ohne Gleichwertigkeitsbeweis.
- Umdeutung des gesamten #439-Auftrags zu einer Schatten-Einzelprobe. **Banden, nicht-höhenstufige Rampen, Terrainkörper und Fahrkontakt bleiben Teil des Parent-Gates.**

## 1 · Rendering-Schichten / Autoritätsgrenzen

| Schicht | Autoritative Quelle | Was neu hinzukäme |
|---|---|---|
| Geländehöhe, Kollisionssupport, Wege, nicht-stufige Rampen, Banden | bestehender WS1-World/Terrain/Track-Owner; Road/Track Core gemäß `skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md` für deren Streckengeometrie | **keine neue Mesh-/Support-Wahrheit** |
| Grobe Oberflächen-Farbfelder | KFB Bühnen-/Biome-Palettenrollen, vorhandener V-305-Farbharmonie-Generator und WS1 Stage/World-Material-Schnitt | reine *Color Field*-Auswahlmasken, ohne neue Palette-Datenbank |
| vorhandener Clay-Materialaufbau | K1/H0 visual Golden; K2/v10 nur bei Parität; `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` | zusätzlicher Oberflächen-Farbrollen-Input nur in legaler Material-Naht |
| Licht/Shadowmap & echte Sender/Empfänger | vorhandener WS1 L3/L1 `createStageLight` / Schattenkugel/Sun, Shadow Bias, AO aus gleicher Stage; siehe aktuelle WS1-Quellen | Farbinterpretation/optionale Toon-Schwelle der **bestehenden** Shadow Visibility, kein weiterer Shadow-Caster oder Licht-Loop |
| Selektive Formkanten | bestehende Terrain-/Track-Geometrie + visueller Material-Owner | seltene Ridge-/Ledge-Akzente aus lokal tatsächlich sichtbaren Formbrüchen |
| Vordergrund-Tonmasse | szenen-/kamerakontrollierte **grafische Kompositionsrolle** (nicht physikalischer Schatten) | organische Farbmaske, deren Position bewusst vom Level/Art-Design kontrolliert wird, keine an Kamera festgeklebte Ovalmaske |
| Avatar, Racer, Props, Animation | WS1 Actor/Racer, ToolBox/Resident source donor | echte Shadow-Caster-Geometrie mit Pose und Drive-State; nicht zweite Pose/Physics |

**Wichtige Quellenregeln:** 
- WS0 `STYLE_GUIDE_3D_R1.md` fordert ruhige große Knetformen und untersagt generische Farbverläufe, Alpha-Überblendungen und Rausch-Sprenkel als Oberflächenübergang; `kfbBlend`/S1 bzw. akzeptierte gestalterische Unregelmäßigkeiten bleiben Quelle für endgültige Look-Entscheidungen.
- `BRIEF_WS1_LOOK_RUN_L2.md` nennt einen vorhandenen Bühnenpaletten-Generator, `edgePalette`, L1/L3 und echten Übergang zwischen Bühne/Boden. **Das neue Farbfeld darf bestehende Donor-Farbbindung nicht ersetzen.**
- `WS1_STATUS.md` §§72–75 nennt Mesa-Look, `stageGround.js`, `kfb-stage-light.v1`, Kontaktschatten/AO und Vorbereitungen für Rampen; §94 ff. hat spätere Fahr-/Flug-Integration. Diese Quellen sind **bereits vorhandene Arbeit**, nicht unsere neu getesteten Resultate.
- `BRIEF_WS1_LOOK_RUN_L2.md`: ein Licht-/Schattenautor, Sun = einziger Shadow-Caster, charakterabhängige Rim-/Fill-Identität datengetrieben; **Gesichter lesbar** (historisch „faces never receive shadows“), nicht durch neue Shadow-Tint verdunkeln. `WS1_STATUS` V-429 Figurenwurf/-empfang als neuerer Owner-Entscheid – WS0 muss Gesichts-Ausnahme und aktuelle Materialschnittstelle präzise abgleichen.

## 2 · Organic Color Fields: breite Flächen ohne Höhen-Cutoff

### A. Grundidee
Terrain-Geometrie `H(x,z)` wird **nur für Form/Support** ausgewertet. Ein unabhängiges, deterministisches Feld `F(u,v,seed,biomeId)` bestimmt den **Farbrollenindex**, niemals direkt `step(height)`:

```text
worldXZ / authored UV chart
  → low-frequency coherent field + low-frequency domain warp
  → broad stripe/region masks, optional curated spline guides
  → discrete region/material-role ID (3–4 harmonised colour roles)
  → terrain clay surface response
```

**Nicht:** vier starre Farbbänder von y=0–25–50–75.  
**Nicht:** sichtbares per-pixel Noise- oder Zellmuster.  
**Sondern:** wenige breite, lesbare organische *Flächen*; das Noise ist ausschließlich ein unsichtbares **Formgebungsmittel der Maskengrenzen**.

### B. Vorschlag zur parametrischen Ableitung (DESIGN Pseudocode, keine bestehende KFB-API)

```text
p = stable world XZ or zone-local UV, scaled to large landscape wavelength
warp = (lowFreqNoise2(p + seedA), lowFreqNoise2(p + seedB))
q = p + warpStrength * warp
flow = largeScaleDirectionalField(q, authoredPaths?)
region = chooseRegion(flow, warpedPatchMasks(q), sparseControlSplines)
baseRole = biomePalette.getSurfaceRole(region)
```

`warpedPatchMasks` müssen **niedrige Ortsfrequenz** haben und als große geschlossene Flächen ausgegeben werden. Noisy dithering zur Darstellung verboten. Domain Warp nur am Grenzverlauf, nicht am eigentlichen Terrainmesh. Auf Strecke und Bühnenfußpunkten Material-/Palette-Override der bestehenden Owner respektieren.

### C. Steile Wände und Canyons
Eine XZ-Abbildung sieht auf vertikalen Wänden entlang Y langweilig/gestrichen aus. Statt `height` als Farbindikator zu verwenden, wird eine **orientierungsabhängige Projektion** gewählt:

- Flache/leicht geneigte Oberflächen: stabiler XZ-Farbfeld-Chart.
- Steile Wand: lokale Tangentialkoordinaten entlang der **Wandfläche** (z. B. Cliff-Surface-UV oder bereits vorhandenes geometrisches Mapping) – organische Muster können vertikal und diagonal laufen, **nicht** als globale Höhe kodiert.
- Übergänge an Kliff-Schultern: projektionstechnisch stabiler Übergang bzw. robuste lokale Surface-ID, keine sichtbaren Nahtsprünge/ungewollte alpha-blended Gradient-Kacheln. Nicht automatisch 3 vollständige Materialmaps pro Pixel erzwingen.
- Cliff-/Boden-Flächen dürfen verschiedene Pattern-Rollen haben, bleiben aber an **dieselbe Biome-Palette** gebunden.
- Weltposition/surface-local Chart bleibt beim Sculpting stabil; **bewusster** „Paint moves with terrain“-Modus ist ein späterer Editor-Vorschlag, kein zusätzlicher Position-Owner.

### D. Günstiger Produktionsweg
- Für erste Probe: **per-Chunk deterministisch erzeugte kleine ID-/RGBA-Maske** oder bestehende Material-Uniform/Vertex-Color-Naht, je nach tatsächlichem WS1 Shader. Farbfeld bei Änderung der Terrainform **nicht** neu auf Höhe anwenden.
- ID-/Palettenrollen über nearest/analytische Schwellen; ein Pixel Anti-Aliasing an Graphikkanten ist zulässig, kein großflächiger unscharfer Verlauf. Kuratierte handwerkliche Knetflecken/Versatz statt sichtbarer noise/dither-Textur.
- Bei mehreren Flächen/Überlappungen stabile Prioritäten: `authoredOverride > sourcePalette/stageFootprint > broadRegion > fallbackRegion`. Fallback bleibt sichtbarer KFB-Wert, keine neue generische Außenwelt.
- Farbwelt hängt an akzeptierter `edgePalette` / V-305-Stammpalette. **Keine fest verdrahteten 4 biomweiten Hexwerte** außerhalb vorhandener Rollen-Quelle. Die folgenden Ocker-Töne sind reine Konzeptbeispiele.

## 3 · Palette Shadow Roles – echter Schattenwurf, stylisierte Antwort

### Rollen (Vorschlag, bewusst keine neue globale Palette-SSOT)

| Rolle | Bedeutung | Canyon-Beispiel, illustrativ |
|---|---|---|
| `surface0..3` | 3–4 unabhängige, organische Flächen | Sandgelb, Ocker, Terrakotta, gedämpftes Orange |
| `foregroundValue` | große dunklere **grafische** Vordergrundfläche | braunocker / rostocker |
| `castShadowTint` | normaler echter 3D-Schlagschatten auf dieser Receiver-Fläche | mittleres warmes Rot-/Ockerbraun |
| `contactDepthTint` | lokale optische Tiefe an echtem Kontakt/Enge, **kein Fake-Schatten** | gesättigtes dunkleres Umbra |
| `edgeAccentTint` | seltene markante Cliff-/Ridge-Kante | entsättigtes Dunkelbraun |

**Palette liest der Receiver**, nicht das werfende Objekt. Ein Racer-Schatten auf Canyon-Ocker wird braun, derselbe Racer auf grünem Boden erhält ein dunkles Oliv; bei der Kante verschiedener Empfängerfarben gilt der jeweilige Material-/Biome-Kontext. Die Schattenfärbung ist **kein per-Actor Highlight** und darf nicht mit dessen Body-/Face-Farben verwechselt werden.

### Shader-/Render-Pipeline (technisch präzisieren; keine ungeprüfte Three.js-API versprechen)

```text
authoritative sun/light + actual posed 3D caster geometry
  → EXISTING shadow map: per receiver fragment visibility V∈[0..1]
  → optional compact toon response T(V) with filtered threshold / bounded edge softness
  → material-stage shadow colour response:
       lit = receiver's authored clay/albedo surface colour
       shaded = paletteDerivedShadow(lit, receiverPalette.castShadowTint)
       output = mix(shaded, lit, T(V))          // conceptual, not code drop-in
  → combine with EXISTING bounded local AO/contact, preserve highlight/detail readability
```

Wichtig: Three.js Standard-Lighting kann Schatten typischerweise über den Lichtbeitrag dimmen. Für **wirklich farbiges Shadow-Remapping ohne schwarzen Multiply** muss der *bereits vorhandene* Material-/Lighting-Shader an der legalen Shadow-Sampling-Naht beteiligt sein. Eine beliebige neue `THREE.ShadowMaterial`-Ellipse oder globales `scene.background`-Tönungs-Overlay erfüllt den Auftrag nicht. Die konkrete Shader-API ist **SOURCE_REQUIRED** beim WS1-Material-Owner.

- Eine Hauptschattenstufe plus nur bei bestätigtem Kontakt eine tiefere Stufe, **kein additiver dunkler Mehrfach-Multiply pro Überlappung**.
- **Occlusion and contact:** lieber den bereits vorhandenen L3-`createContactAO`-Term/berechnete Geometrie nutzen, semantisch saturieren/`max` statt unbeschränkt aufsummieren. Kein neues generisches AO-System; realer Felsspalt kann dunkler sein, aber nicht weil drei Schatten-Quads übereinanderliegen.
- Look: klare Shape, gezähmte schmale Softness. Harte abrupt zitternde PCF-Schwellen sind unerwünscht; bestehende Shadowmap-Auflösung, Bias/Frustum (V-440/V-447) und zeitliche Stabilität bleiben Prüfpflicht. Keine unbegründete FPS-Aussage.
- Spielerfigur/Racer in Bewegung: jede Shadowmap verwendet tatsächliche aktuelle Meshpose/Transform. Keine gelockte Default-Ellipse unter Sprung oder Auto. Boden, schräge Rampe, Streckenbande und Canyonwand müssen als echte Receiver evaluiert werden, soweit der vorhandene Renderer sie rechtmäßig schattenempfangen lässt.
- Schatten von Gesichtern dürfen keine Gesichtsinformation eliminieren; bestehende Face-/Mouth-/EyeRig-Beleuchtungsregeln prüfen, nicht pauschal überschreiben.

## 4 · Vordergrund-Tonmasse: grafische Komposition ≠ Shadow Map

Georgs Roadrunner-Referenz besitzt vorne eine große ruhigere/dunklere Ebene. Sie ist **eine aus der Biompalette gewählte zusammenhängende Surface-Farbfläche**, kein geworfener Schatten, kein per-pixel-screen Vignette-Gradient und **kein runder Bodenklecks**.

Empfohlene Priorität:
1. **World-/Region-local authored tone field** im Geländematerial als grobe, unregelmäßig geschlossene Grafikfläche. Kamerawinkel kann bei Levelkomposition berücksichtigt werden, soll aber bei Bewegung nicht ständig sichtbar mitwandern.
2. **Viewer-/Camera-orientierte Komposition** nur für gesonderte, bewusst kuratierte filmische Bildmodi; ansonsten würde die Dunkelzone am unteren Bildschirmrand „mitkleben“. Sie darf nicht als universaler Car-/Avatar-Schatten missbraucht werden.
3. Echte Sun-Cast-Schatten werden **zusätzlich** über dieselbe farbharmonische Palette gerechnet. Auf der bereits abgedunkelten Tonfläche werden Shadow-Strength und Deep/AO-Tint gedeckelt, damit keine schwarze Senke entsteht.

Daher zwei logisch unabhängige Maskentypen: `graphicToneField` vs `shadowVisibility`. Nie versuchen, das eine durch das andere zu ersetzen.

## 5 · Sparse Edge Accents (ohne Ink-Volloutline)

- Herkunft: **echte** markante Profiländerung, gebrochene geometrische Kante, kuratierter Canyon-Grat/Ridge, Bandenkopf. Nicht automatisch aus allen Farbpatch-Grenzen, nicht nach Dreiecks-Tessellation, nicht globaler Post-Process-Comic-Rand.
- Grafik: an die Receiver-Palette gebundener trockener dunkler Braun-/Biom-Ton, kurze zusammenhängende lokale Akzente, selten; keine schwarze Silhouette.
- Technische Kandidaten: lokales Facetten-/Krümmungs-Signal aus vorhandener Terrain-Geometrie; wenige marker-/splinegeführte Linien mit fester Oberflächenbindung; materialbasierte Kantenmaske, falls die Engine das bereits unterstützt. **Kein** ohne Kontrolle über die Szene gelegtes LineSegments-Drahtgitter.
- Vermeide Z-Fighting, gebrochene Linien auf LOD-Wechsel, sichtbare UV-/Chunk-Nähte und breites Pixel-Flimmern. Nur source-isolierte, tatsächlich sichtbare Vergleiche legitimieren Adoption.

## 6 · Banden/Rampen und Style-Goldens bleiben integraler Teil

Der Parent-R1.2-Auftrag spricht ausdrücklich von **Banden** und einer **nicht höhenstufenartig auszuführenden Rampenform**. Deren konkrete ursprüngliche Geometrie/Maße sind in diesem jetzigen Detailgespräch nicht vollständig rekonstruierbar und müssen von WS0 gegen echten WS1-GitHub-POC und Ursprungsentwurf gepinnt werden. Bis dahin:
- keine generischen regelmäßigen Terrassen/Rampenreihen erfinden;
- Track Core / Joyride J17 (Look V-010, Fahrbahn V-102) und akzeptierte Kamera/Fahrbasis erhalten;
- neue Farbflächen sollen sich harmonisch über vorhandene Terrain-/Track-/Bandenanschlüsse legen, aber keine Straßen-/Streifen-/Kurbrollen „umfärben“, die eine separate Präsentationsquelle haben;
- Übergänge echte unregelmäßige Knet-/Speckle-Donors, keine abgelösten Höhenlinien/Übergangsgradienten.

**Bezug zur World-Recovery:** gestoppter WB2 Island R4 `NO MVP / F-R39 FAIL` bleibt gestoppt; keine implizite R5-Umsetzung. Dies ist eine WS0→WS1b-Designinstruktion innerhalb des bereits bestehenden #439-Vorhabens, nicht ein WORLD R4 Neustart.

## 7 · Bounded Integration Experiment – Vorschlag an WS0, nicht selbständig starten

### Fixture (eine reale existierende Produktstelle)
Ein **echter** vorhandener WS1b-Szenenausschnitt mit normaler befahrbarer Fläche, kleinem Terrainhang/Plateau, wirklichem Banden-/Rampenanschluss und einer vorhandenen Figur sowie einem vorhandenen Racer. Szene und vorhandene Module **in Isolation zeigen**, bevor die neue Material/Shadow Response den Vergleich beeinflusst. Gleiche Uhrzeit, Licht, Kamera und Ausgangsassets für A/B.

### Probe 1: Farbfeld unabhängig von Höhe
- Geometry/Height identisch, Vergleich **alte Oberfläche** vs **3–4 unabhängige organische Farbfelder**. Sicherstellen, dass sie nicht um die Welt als horizontale y-Ringe gehen, keine Camouflage-Noise-Sprenkel, keine sichtbaren gerade gleichförmigen Kanten.
- Heightfield ändern (Hügel/Plateau erhöhen), ColorField-Seed/Chart beibehalten: Farbflächengrenzen bleiben bei ihrer unabhängigen Raum-/Oberflächenparametrisierung statt auf neuen absoluten y-Cutoffs neu ausgerichtet zu werden.
- Eine Cliff-Wand aus schrägem Blick: Farbe verläuft auch vertikal diagonal organisch, ohne XZ-Kompressionsflecken oder horizontale Kuchenbänder.
- Kontrollieren, dass Bühne/Track/Actor-Materialrollen unberührt bleiben.

### Probe 2: reale Shadowmap im gleichen Fixture
- Sonne schräg, Original vs palettengefärbte Shadow Visibility; Stand, Jog, Jump, Racer idle/Drift/Jump/Banking (wo im aktuellen Fixture vorhanden). Schatten bewegt sich real mit; in einer perspektivisch schrägen Bewegung prüfbar; 0 erstellte runde Proxy-Blobs.
- Licht bewegt sich (Tag/Gold), die Form und Projektion verändern sich entsprechend; Farbton bleibt rollen-/biomgesteuert, keine schwarze Patch-Überlagerung. Empfänger überhang/hügel, Banden/Wände wenn Renderer supports.
- Selbst-/Kontaktschatten nicht doppeln, Face-Augen/Expressions lesbar; kein shadow acne, flying gaps, harsh zitternde Schattenränder.

### Probe 3: vordere Tonmasse und Kanten
- Großer, stiller, palettengebundener Farbwertbereich vorne, nicht Screen-Vignette. Kamera vor/zurück bewegen: Feld klebt im Weltraum/Authoring-Profil, nicht am Bildschirmrand.
- An denselben echten Cliff-/Banden-Silhouetten wenige entsprechend getönte Kanten, bewusst keine Volloutline.
- Nichts aus bestehenden Jo​​yride/K1/H0/Stage-Paletten verlieren.

### Mindestbeweise / reale Gate-Kriterien
- A/B gleiche Source-/Kamera-/Sun-Time/Seed/Surface + Vorher/Nachher Standbilder; erster Quell-Golden einzeln; dann ein kleines **wirklich durchgehendes** gemeinsames Banden-/Rampen-/Terrain-/Farb-/Schatten-Produktstück.
- Automatische Regression: Identity/Selected Asset/1 movement- & camera-writer/Save-Fresh-Reload/terrain support not broken; gleiche Strecke sprunghaft/rollend, kein Shadow-Blob und keine doppelte Shadowmap/AudioContext.
- Gezielt Screenshots nah, traversal, fern, Cliff-Unterseite, Bandenkante, Räder/Füße/Shadow-Kontakt; kurzer Fahrt-/Sprungclip wenn zur Beweisführung nötig. FPS/Shadowmap-Resolution/GPU-Metriken **am echten Zielgerät**, nicht aus headless SwiftShader ableiten; bestehende Leistungsgrenzen bleiben.
- Wenn die bestehende Shader-Pipeline keinen sicheren Shadow Visibility-Remap zulässt: **nur diese kleine Seam als SOURCE_REQUIRED/QUARANTINE** markieren, nicht neue Material-Runtime bauen und nicht eine Blob-Scheinalternative erzeugen.

## 8 · Aufgabenreihenfolge und exakter next gate

**WS0** (Steuerung/Source) liest zuerst Register V-Nummern, #439, aktuellen `WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md`, die vorliegende Ergänzung, WS1 `WS1_STATUS.md`, `WS1_HANDOVER.md`, aktuellen R3F-Branch und `ws1/combo-r2`. Dann identifiziert und pinnt WS1s tatsächlichen Terrain/Banden/Rampen-POC und vollständigen ursprünglichen Terrain-Quellstand. Die aktuelle Palette-, Licht-, Shadow-, Track- und Clay-Kanons behalten ihre Owners. **Claude Code** darf danach nur auf einem von WS0 zugewiesenen **bestehenden** Game-/Material-Build-Slice als Builder arbeiten; WS1b bleibt der einzige produktive Writer/Integrator, Reviewer und Guard bleiben unabhängig nach Produktionscontract.

**GENAU EIN NÄCHSTER GATE:** **WS0 vervollständigt die Quellpins für den Gesamt-Terrainauftrag #439 (besonders Banden-/Rampen-POC) und führt dieses dokumentierte Farb-/Schatten-Design in den einen reversiblen WS1b-MVP-A/B-Auftrag über.** Kein eigener Shadow-Demo-, Render- oder Deployment-Slice. WS1b führt erst nach genehmigtem Workload aus.

### Quellen / Provenienz
- Parent: [Issue #439](https://github.com/georg-doc/kayfabizarro/issues/439), `replies/WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md` R1.2.
- Register: `30_DECISIONS/DECISIONS.md` (V-010/102/305/403/429/440/447), `ARCHITECTURE_R1.md`, `STYLE_GUIDE_3D_R1.md`, `replies/BRIEF_WS1_LOOK_RUN_L2.md`, `replies/BRIEF_WS1B_TAKEOVER_R1.md`.
- KFB Clay: `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`, K1/H0 Golden, K2/v10 material in actual owning packages.
- WS1 `ws1/r3f-frame`: `WS1_STATUS.md` and `WS1_HANDOVER.md`. **No live Browser acceptance reproduced in this planning pass.**
- User's own Roadrunner reference images in current discussion are **visual intentions**, not an external asset licence or an exact pixel/mesh target. No images generated or imported by this spec.


---

## Quelle: WS1_FLAECHENGRAMMATIK_R1.md

# Flächengrammatik für Cartoon-Gelände · R1 · WS1 · 20.10.2026

**Quelle:**
- Georgs Look-Feedback vom 20.10.;
- ein externes Feedback aus Georgs Perplexity-Chat zu einem Screenshot der Gelände-Probe; WS1 fasst es in eigenen Worten zusammen;
- WS1-Befunde aus den Prüfansichten der Probe.

Die genannten Industrie-Bezüge stammen aus dem externen Feedback und sind von WS1 nicht selbst geprüft:
- Epic, „Stylized Rendering Landscape“ (UE 4.27): Materialwechsel und Farbflecken als getrennte Funktionen;
- Frostbite, „Terrain Rendering“ (Andersson): grobe Maske plus materialabhängige Detailmaske;
- NVIDIA GPU Gems 1, Kapitel 20 „Texture Bombing“.

**Status:** Vorschlag. Die Übernahme in den Kanon macht WS0. Zahlen sind an der Probe kalibriert und keine Branchennorm.

## Invarianten
- **FG-1 · Aufgabe:** Jede größere Materialfläche hat eine Ursache oder eine kompositorische Aufgabe, zum Beispiel trockene Kuppe, Ufer oder Fahrkorridor.
- **FG-2 · Drei Ebenen, getrennt gesteuert:**
  - Makro legt fest, WO ein Material liegt.
  - Meso formt Kontur, Übergang und die schwache Tonvariation innerhalb eines Materials.
  - Mikro (Knete, Körnung) ändert die Lesbarkeit der beiden anderen Ebenen nicht.
- **FG-3 · Formen vor Rauschen:** Konturen bestehen aus gerichteten Grundformen (Ovale, Lappen, Keile), die per smooth-min verschmelzen. Danach folgt nur schwache Verzerrung: Hauptkontur ca. 6 m, Rand ca. 1,5 m. Keine Fläche entsteht als Rausch-Schwelle. Zum Vergleich K-F1 (WS1 §104): Seitenverhältnis ≤ 1,25, keine Zungen und keine dünnen Hälse.
- **FG-4 · Übergang = eigene Zone:**
  - Um die Grenze liegt ein Band |d| < w (Probe: w = 10 m).
  - Nur dort gibt es Gegeninseln des Nachbarmaterials.
  - Die Inseln schrumpfen weich aus dem Band heraus: Der Radius nimmt mit dem Abstand ab, statt abgeschnitten zu werden. Dadurch entstehen keine Schnittkanten.
- **FG-5 · Sprenkel mit Ursache:**
  - Wahrscheinlichkeit = Basis × Übergangsmaske × Ursachenmaske × Ruhemaske.
  - Sprenkel stehen in Nestern mit leeren Bereichen dazwischen, nicht als Konfetti und nicht gleichmäßig verteilt.
  - Formenalphabet statt reiner Kreise; das ist noch offen.
- **FG-6 · Variation < Wechsel:** Innerhalb eines Materials nur schwache Tonvariation (Probe: +7 % Helligkeit, gleicher Farbton). Zwischen Materialien ein deutlicher Unterschied bei wenigen Flächen.
- **FG-7 · Ufer mit eigener Grammatik:** Wasser → Kontaktkante → feuchte Abschnitte (nur stellenweise) → trockenes Gelände. Kein gleich breiter heller Saum (Halo).
- **FG-8 · Neigung macht plausibler, malt aber nicht schematisch:** Ein Hangwechsel läuft nur über Wert und Farbton, nie über eine Kante (siehe §104).
- **FG-9 · Kein Licht in die Albedo:** Dunkle Schattierung gehört in Licht und Schatten. Ausnahme: die bewusst komponierte Vordergrund-Tonmasse (R10); sie ist in der Grundfarbe-Ansicht als solche sichtbar und erklärt.
- **FG-10 · Abnahme-SOP:** Dieselbe Spielkamera in vier Ansichten (Endbild, nur Grundfarbe, graue Form, Material-Masken) und der Vergleich A/B/C/D:
  - A = bisher;
  - B = nur Makro;
  - C = + Übergänge;
  - D = + Sprenkel und Haptik.
  - Ist D nicht klar lesbarer als C, ist die Detailstufe zu stark.
- **FG-11 · Kalibrieren vor Ausrollen:** Prozedurale Regeln werden an einer freigegebenen Musterregion kalibriert, bevor sie auf die ganze Welt gehen.

## WS1-Befunde aus den Prüfansichten (20.10.)
- Die scharfkantigen dunklen Keile kamen von den **farbigen Gratkanten**: Die Krümmungsschwelle wurde auf Dreiecksflächen interpoliert. Die Kanten sind jetzt weicher und standardmäßig aus. Eine richtige Linien-Lösung (R11: Color Hold, nie an Farbfeldgrenzen) steht noch aus.
- Die große dunkle Fläche liegt in der **Albedo**: Es ist die Vordergrund-Tonmasse, jetzt auf ca. 15–20 L\* abgeschwächt. In der freien Übersicht wirkt sie wie ein Fleck. Sie gehört an feste Kameras (R10).
- Kantige Low-Poly-Felsen und Knet-Gelände sprachen unterschiedliche Sprachen. Die Felsen sind jetzt Knet-Blöcke: große Flächen, weiche Kanten.


---

## Quelle: COLOR_CONCEPT_R1.md

# KFB · Farbkonzept R1 (Konsolidierung aller Farbquellen)

Stand 15.10.2026 · WS0 · Datei mit den Werten: `replies/kfb-color-concept.r1.json` (schema `kfb.color-concept/1`).
Register: V-010, V-011, V-051, V-102, V-174, V-245, V-270, **V-286**. Keine Farbe in diesem Dokument ist erfunden. Wo eine Zahl aus einer Formel der Quelle gerechnet ist, steht das dabei. Wo WS0 nur beschreibt, was in den Daten steckt, steht **abgeleitet (WS0)**.

---

## 1 · Das Konzept in einem Absatz

Jede Welt bzw. Kartenzone hat **eine Welt-Palette**: die Joyride-Paletten aus J17 (`canyon`, `bucht`, `otown`) und ihre Ableitungen (`wueste`, `kfb_town`, `protopia`). Eine Palette ist kein Stimmungston, sondern ein Harmonie-System mit mindestens sechs Farben, und **jede Farbe hat eine Rolle**: Boden, Hügel, Wahrzeichen/Türme, Strang bzw. Rahmen, Laub, Stamm, Fels, Wolke, Himmel, Pad, Fahrbahn. Für unsere eigenen Bauteile gilt die Farb-Grammatik `ENV_ROLES`: je Rolle drei Töne (hell, mitte, dunkel). Über der Welt-Palette liegt der **Story-Mode der Karte** als leichte Tönung (sechs Modi, je `base`, `accent` und daraus `deep`, `light`, `line`), nie statt der Palette. **Wo welche Farbe wirkt (V-286):** gemalte Meshy-Texturen werden nur sanft getönt, alles, was wir selbst bauen, trägt die volle Palette mit Rollen. Drei Teile fehlen im Bestand und sind offene Fragen an Georg (§6): ein Fluff-Farbschema nach Story-Modes mit Werten, eine Regel für „dunkle und sattere Variante“ und ein gebauter Paletten-Würfel.

---

## 2 · Die Schichten

### 2.1 · Wo welche Farbe wirkt (V-286, Georg 15.10.)

| Träger | Was wirkt | Wie stark |
|---|---|---|
| **Meshy-Bühnen mit fertig gemalter Textur** (Amphitheater, Theater, Dom, Pyramide, Library, Mesa, Nature/Snow, Dystopia-Gasse) | Welt-Palette bzw. Story-Mode als **sanfte Färbung** | Textur bleibt lesbar. Keine Rollen-Umfärbung der Meshy-Textur (V-286 ersetzt V-270 an dieser Stelle). |
| **Alles, was wir selbst bauen**: Rahmen und Displays (Billboard, `kfb_screen_slot`-Rahmen), Requisiten, Fluff, Himmel, Licht, Figuren-Akzente | **volle Palette**: sechs harmonische Farben mit Rollen, dazu dunkle und sattere Variante | Rollen nach §2.2.3; Story-Tint darüber nach §2.3. |
| **Strecke** (Rennen) | J17 fest: Fahrbahn `#3d4a60`, Banden/Strang `#ef5a22` | V-102, V-174. Rot-Weiß nur für Kerbs. |
| **Licht** (Sonne, Gischt, Glanz) | Lichtfarbe kommt von der Lichtquelle, nicht von der Marke | Regel aus Travel globe-v13 `sky-presets.js` (Georg 30.8., „gelbe Wellen stören“): Material harmonisieren (Farbton KFB, Sättigung und Helligkeit aus der Quelle), Licht nicht. Story-Mode darf das Licht tönen (Tint), nicht ersetzen. |

Hinweis zur sanften Färbung: Der einzige Zahlenwert im Bestand ist WS1s Story-Tint **12 %** gerade sRGB-Mischung zum `accent` des Modus (Grenze „höchstens ~15 %“, WS0-Vorgabe an WS1, WS1_STATUS §34.1). Für die Welt-Palette auf Meshy-Texturen gibt es noch keinen Zahlenwert → Frage G-6 in §6.

---

### 2.2 · Schicht 1 · Welt-Palette (sechs harmonische Farben + Rollen)

#### 2.2.1 Die Joyride-Welten (Goldstandard, kanonisch)

Quelle: `track-look.v5.js` `WORLDS` (Lab-Vendor `src/world/organ/vendor/j17/lab-track/track-look.v5.js`, Git-Blob `7c0d2483…` = Repo main, J14-Schnitt; `WORLDS` ist in allen drei Repo-Fassungen gleich; J17 `JOYRIDE_J17_2026-10-01` bietet genau diese drei Welten an).

| Rolle (J17) | canyon · A Claybound-Canyon | bucht · B Bikini-Bucht | otown · C O-Town |
|---|---|---|---|
| table (Boden) | `#8b68c7` | `#f0cf7e` | `#3aa596` |
| hill [hell/dunkel] | `#a582d9` / `#7b5bb8` | `#5cc3bf` / `#46adb2` | `#2f8f83` / `#4cb5a5` |
| strang (Rahmen/Bande) | `#ef5a22` | `#f2708a` | `#e9b53b` |
| tower (Wahrzeichen) | `#ef5a22` / `#e8743a` | `#9a6fd0` / `#b08ae0` | `#c9508f` / `#e0679f` |
| leaf [0, 1, Akzent] | `#1f7a3e` `#2f8a45` `#cdc666` | `#8fcf45` `#5fb84a` `#f7a1c4` | `#f08a2c` `#f5b041` `#c9508f` |
| trunk | `#8a5a3a` | `#c9895a` | `#6b4a8a` |
| rock | `#e2d0bc` | `#9a6fd0` | `#e0679f` |
| cloud | `#e2d0bc` | `#fff4e2` | `#f3ead8` |
| sky | `#96bede` | `#8fd6ec` | `#a8d8b9` |
| pad (Boost) | `#f2b632` | `#f7d23c` | `#fff06a` |
| roadStreet / roadTrack | `#566680` / `#3d4a60` | `#5f7f9a` / `#3e5d7c` | `#6a6e8f` / `#4a4d6e` |
| kart [3] | `#f2b632` `#5983ac` `#e2d0bc` | `#f7d23c` `#9a6fd0` `#fff4e2` | `#fff06a` `#6b4a8a` `#f08a2c` |

Für das Rennen gilt unabhängig von der Welt: Fahrbahn `#3d4a60`, Banden `#ef5a22` (V-102, V-174).

#### 2.2.2 Die Insel-Paletten (Lab `src/palettes.ts` `PALETTES`)

`canyon`, `bucht`, `otown` = Joyride 1:1 auf Inselteile gelegt (sky, top/top2, hill[2], sand, rim, under[4], rock, tower[2], leaf[3], trunk, cloud, water, path, roadStreet, roadTrack, strang). Abgeleitet: `wueste` (aus Canyon-Orange + Bucht-Sand), `kfb_town` und `protopia` (aus R2C `hex-archipel.r2c.js` PAL burg/protopia). Alle Werte stehen in der JSON (`layer1_worldPalettes.islandPalettes`).

Die Sechser-Kombination laut Schema `kfb.island-theme/1` (`public/themes/island-themes.json`, Auszug aus WORLDS): **sky, ground, hill, accent, road, strang** + cloud.

| | sky | ground | hill | accent | road | strang | cloud |
|---|---|---|---|---|---|---|---|
| canyon | `#96bede` | `#8b68c7` | `#a582d9` | `#ef5a22` | `#3d4a60` | `#ef5a22` | `#e2d0bc` |
| bucht | `#8fd6ec` | `#f0cf7e` | `#5cc3bf` | `#9a6fd0` | `#3e5d7c` | `#f2708a` | `#fff4e2` |
| otown | `#a8d8b9` | `#3aa596` | `#2f8f83` | `#c9508f` | `#4a4d6e` | `#e9b53b` | `#f3ead8` |

#### 2.2.3 Farb-Grammatik `ENV_ROLES` (Rollen für alles, was wir bauen)

Quelle: Lab `src/palettes.ts` `ENV_ROLES` (lokal, nach V-174). Je Palette elf Rollen mit drei Tönen **[hell, mitte, dunkel]** und einer Begründung (`why`): `ground, grass, stone, bark, leaf, bloom, water, accent, sand, paved, earth`, dazu inselübergreifend `ASPHALT_DEFAULT ['#4a5770','#3d4a60','#323d50']`, `MASONRY_DEFAULT ['#e6d5b7','#dccdb9','#d2bc9a','#b49d7e']`, `BANDE_DEFAULT #ef5a22`. Regeln: Farbe nie backen, nur über Rollen (STYLE_GUIDE §4); Stein aus Boden und Fels der Insel, nie Turmfarbe; Gras aus der Bodenfamilie, nie Laubfarbe; 60/30/10 (Haupt-, Neben-, Akzentfarbe), Akzente führen zur Landmarke (QA_RULEBOOK_ENVIRONMENT_R1 §0b Punkt 4, Kriterium K2).

Akzent-Familie je Palette (Rahmen, Requisiten, Wahrzeichen-Führung):

| Palette | accent [hell, mitte, dunkel] | Herkunft (`why`) |
|---|---|---|
| canyon | `#f2b632` `#ef5a22` `#c4441a` | Strang-Orange |
| bucht | `#b08ae0` `#9a6fd0` `#7a52b0` | Korallen-Violett |
| otown | `#f08ab8` `#e0679f` `#c9508f` | Magenta der Wackeltürme |
| wueste | `#f8dc98` `#ef7a4f` `#c95a35` | Pyramidenspitze + Koralle |
| kfb_town | `#f2b632` `#ef5a22` `#c4441a` | Burg-Rot aus dem Strang |
| protopia | `#f5a050` `#e8742a` `#c05a1c` | Werkstatt-Orange |

**Rollen für eigene Bauteile (V-286).** Belegt ist: Joyride legt jede Rolle auf eine eigene Objektklasse (table, hill, tower, leaf, trunk, rock, cloud, strang, pad, sky; WS1_STATUS §36.2). Daraus folgt für Bühnenteile WS1s Vorschlag „Variante B“ (WS1_STATUS §36.3): Torbögen/Mauerkrone `tower`, Sitzreihen `hill[0]/hill[1]`, Bühnenboden `top`/`sand`, Gelände `hill[1]`, Billboard-Rahmen `strang`, Pfosten `trunk`, Leiste `pad`/`rock`, Himmel `sky → cloud`. **Achtung V-286:** Torbögen, Sitzreihen und Bühnenboden sind beim Amphitheater Meshy-Textur, dort also nur sanfte Tönung; volle Rollen nur für Rahmen, Pfosten, Leiste, Requisiten, Himmel, Fluff, Licht, Figuren-Akzente. Die Tabelle wartet auf Georgs Urteil (G-5).

---

### 2.3 · Schicht 2 · Story-Mode-Tönung

#### 2.3.1 Kanonisch für den Tint: `storymode.v4.js`

Quelle: `KFB_HUB/30_DECISIONS/replies/donors/storymode.v4.js` (Blob `58a79133…`; Original `KFB FrankenStein Lab + Models/KFB Shader Duo Tone v1/kfb-bg-shader-kit_2026-09-02/`; alle zwölf Kopien in Dropbox md5-gleich; WS1 hat denselben Blob). Laut Dateikopf ist `base` die Kachelfläche und `accent` der Modusname, **pixelweise gemessen an der Story-Mode-Tabelle auf kayfabizarro.pages.dev** (gedruckt vorhanden).

Formeln der Quelle (sRGB, gerade Mischung): `deep = mix(base, accent, 0.62)`, `light = mix(base, accent, 0.14)`, `line = mix(accent, #000, 0.42)`. Übergang 1,4 s, weich.

| Modus (Würfel) | base | accent | deep | light | line | Regel (Website-Wortlaut) |
|---|---|---|---|---|---|---|
| Tragic (1) | `#dadacb` | `#34566b` | `#73888f` | `#c3c8be` | `#1e323e` | Loss is real. Push forward anyway. |
| Comic (2) | `#e3dfc2` | `#5d7033` | `#909a69` | `#d0cfae` | `#36411e` | Things go wrong. It's your fault. Play the gap. |
| Absurd (3) | `#f5e6be` | `#b8901d` | `#cfb15a` | `#ecdaa7` | `#6b5411` | The impossible is normal. Don't explain it. |
| Heroic (4) | `#f1ddc0` | `#b25e23` | `#ca8e5f` | `#e8cbaa` | `#673714` | Your Actor is right for this moment. Play the peak. |
| Mystical (5) | `#e1d6ca` | `#5c4470` | `#8f7b92` | `#cec2bd` | `#352741` | Something's happening beneath the surface. |
| Forbidden (6) | `#e9d5c7` | `#8e3a60` | `#b17587` | `#dcbfb9` | `#522238` | Cross the line the story's been avoiding. Sell it. |

(deep, light, line mit `paletteOf()` der Quelle gerechnet.)

#### 2.3.2 Wie stark, wo

- **Regel:** leichte Einfärbung über dem Grundthema, nie statt ihm (V-051, Plan R1 §2, STYLE_GUIDE §4).
- **Zahl im Bestand:** WS1 mischt 12 % zum `accent` (gerade sRGB), Prüfung „höchstens 15 %“ (WS1 `stagePalette.js` `TINT_K = 0.12`).
- **Wo:** alle eigenen Bauteile und Himmel (V-270, V-286); Meshy-Texturen nur sanft (V-286).
- **Georg 15.10. (WS1_STATUS §36.1):** Die Story-Modes bringen eine Tönung „mit einer differenzierten Palette“ mit. Eine Sechs-Farben-Palette je Story-Mode **gibt es im Bestand nicht** (siehe §2.3.3, G-8).

#### 2.3.3 Konkurrierender Satz: „Rules Print v4“ in `world-context.js`

Quelle: Repo `travel/KFB Travel Combat v25/terrain-v25/world-context.js` (main, Blob `478e8cb4…`, auch bei WS1 vendored, dort nur für die Moduswahl der Karte benutzt). Laut Kommentar „KFB Rules Print v4 canon (09_MODE_COLORS_canonical, 1:1 with rollercoaster-ride MODES)“. Dazu je Modus eine Drei-Stufen-Palette (dunkel → mitte → Glut) „SSOT mirror of MOOD_SKY / FRACTAL_PALETTES“, also die einzige Story-Mode-Palette mit mehr als zwei Farben.

| Modus | ink | panel | glowOf(ink) | STORY_PALETTES (dunkel / mitte / Glut) |
|---|---|---|---|---|
| tragic | `#3e6a83` | `#dbe4e9` | `#90c9e9` | `#0f1a29` / `#3d6b8c` / `#9ebdd1` |
| comic | `#5e6f33` | `#e3e9d3` | `#cce983` | `#242e0f` / `#85a833` / `#f0eb9e` |
| absurd | `#9a4f86` | `#efe0ec` | `#e694d0` | `#291a05` / `#d9339e` / `#29b8a8` |
| heroic | `#b5642a` | `#f0e2d2` | `#ffb27a` | `#240d05` / `#db6b1f` / `#ffdb85` |
| mystical | `#6b4f9c` | `#e6dff0` | `#b193e6` | `#140a24` / `#855cb8` / `#d6c7f0` |
| forbidden | `#8f3a5f` | `#efdbe2` | `#f089b6` | `#1a030d` / `#b81433` / `#f03d85` |

(glowOf mit der Formel der Quelle gerechnet.)

---

### 2.4 · Schicht 3 · Fluff-Farben nach Story-Mode

**Ergebnis:** Ein Farbschema, das die Fluff-Sorten nach Story-Modes auf Farben legt, **mit Werten in keiner gefundenen Quelle** (Suche nicht vollständig abgeschlossen, siehe G-1). Gefunden sind nur Regeltexte, und die widersprechen sich:

| Quelle | Was dort steht |
|---|---|
| Lab Plan R1 §2 | storyTint je Story-Mode „(High- bzw. Low-Vibrational-Fluff)“, leicht über dem Grundthema |
| Register V-270 | Story-Modes als Tint, „definiert über das Fluff-Farbschema (V-051 storyTint)“ |
| Lab Plan R1 §2b | Fluff im Baum zuerst als **bunte Mischung**, bewusst auffällig, auch außerhalb der Insel-Palette; Farbwirkung/Alchemie später |
| Lab SPEC_ENVIRONMENT_KIT §13, ENV_ERZAEHLRASTER | Fluff-Kugeln in der **Biom-Farbe**: Rolle Blüte bzw. Akzent der Farb-Grammatik, keine Verläufe (`fluff: { colour: 'accent' }`) |
| Lab `docs/story/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` | High-/Low-Vibrational-Fluff als Story-Sprache (Low = erntbar, Academy-UFO-Abfluss; High = Wachstum, Bau), **keine Farben** |
| WS1_STATUS §28.2 | „Quelle fehlt: Das Fluff-Farbschema steht nicht im Lab-Schnappschuss.“ |

**Arbeitsstand bis zur Klärung (aus Lab-Spec, nicht vom Register bestätigt):** Fluff-Kugel = `ENV_ROLES[palette].accent` (Werte §2.2.3). Der WS1-Kommentar „Story-Tint aus dem Fluff-Farbschema (storymode.v4.js)“ setzt Fluff-Schema und storymode.v4 gleich; dafür gibt es keine Quelle.

---

### 2.5 · Schicht 4 · Dunkle und sattere Variante

**Ergebnis der Suche:** Eine Regel „je Palettenfarbe eine dunkle und eine sattere Variante“ steht **in keiner Quelle**. Vorhanden sind diese Formeln und Daten (Werte und Pfade in der JSON, `layer4_variants`):

| Was | Quelle | dunkel | satter |
|---|---|---|---|
| `ENV_ROLES` [hell, mitte, dunkel] | Lab `palettes.ts` | ja, als handgesetzte Daten je Rolle. **Abgeleitet (WS0):** dunkel ≈ mitte −0,09 OKLCH-Helligkeit (0,04–0,12), gleicher Farbton (±9°), Buntheit etwa gleich | nein |
| Fahrbahn | Lab `palettes.ts` | hell/dunkel ±12 % um `#3d4a60` | nein |
| Story-Mode | `storymode.v4.js` | `line = mix(accent, #000, 0.42)`; `deep = mix(base, accent, 0.62)` | nein |
| Story-Mode-Glut | `world-context.js` `glowOf` | nein | **ja:** HSL `s' = min(1, s·1,55 + 0,12)`, `l' = min(0,74, l·1,3 + 0,3)` („ink lifted into a legible neon“) |
| Bühnen-Rollen | Clay Stage R2 `palette-roles.js` | Mischung im linearen Raum zur dunklen Stufe bzw. zu `#1f1a14` / `#2b2018` (0,3–0,62) | nein |
| Cologne-Generator | `cologne-palette.v1.js` | `lightMood` ±0,035 L für die ganze Palette | `chromaMood` ×0,84–1,24 Buntheit für die ganze Palette (OKLCH) |
| Cel-Konzept (historisch, Juli) | RollerCoaster v8 `04_CEL_SHADING_shadow_lighting.md` | Schatten nicht schwarz: dunklere Grundfarbe + Hauch Story-Mode-Ink; Rim-Licht = Mode-Ink | nein |

Was davon gilt, ist offen (G-2). Zwei Leitplanken aus dem Register stehen fest: J17 bleibt Maßstab für Licht und Sättigung (V-174 (4)); Dunkelheit am Fuß entsteht durch Eingraben, Schatten und AO, nicht durch Abdunkel-Scheiben oder Verläufe (ENV_ERZAEHLRASTER, V-011).

---

### 2.6 · Paletten würfeln (Generator)

**Regel:** V-051 und Plan R1 §2: Generator „zufällig harmonisch oder aus 2–3 vorgegebenen Farben die passenden Cartoon-Farben ergänzen (Harmonie-Regeln aus den Joyride-Kombinationen ableiten)“. God-Mode-Vision §3.3: „Würfeln“ (Farbkreis-Schemata) und „Ableiten“ (1–3 Grundfarben); Ergebnis sind immer die Rollen von `ENV_ROLES`. Georg 15.10.: jede Kartenzone bzw. Welt hat ihre Palette, und eine Palette lässt sich würfeln, um eine ganze Zone samt Requisiten, Signatur-Elementen und Wahrzeichen umzufärben.

**Was es gibt:**
- **Lab:** nichts gebaut. `src/theme/island-theme.ts`: „palette 6-combo + storyTint follow in Phase F“; `island-themes.json`: „Generator for new palettes: Phase F“.
- **Travel v25 `world-palettes.js`:** kein Würfel, acht feste Drei-Stufen-Paletten (cubescape … ember) plus `from_cards` (`paletteFromVector` in `world-context.js`: Farbton je Karten-Dimension, Chaos spreizt den Akzent-Winkel, HSL).
- **Clay Stage R2 `palette-roles.js`:** kein Würfel, leitet Bühnen-Rollen aus drei Stufen + Akzent ab.
- **Cologne Race `cologne-palette.v1.js`:** **der einzige gebaute Paletten-Würfel** (`makePalette(seed)`, Schema `kfb-palette/v1`, OKLCH). Er dreht die Farbfamilien (Zonen) auf ein Harmonie-Schema und behält Helligkeit und Buntheit der gemessenen Anker-Palette: Schemata in Grad zum Grundton `analog [0,26,−32,54]`, `komplementaer [0,176,22,−158]`, `triade [0,118,−124,34]`, `split [0,152,−148,26]`, `tetrade [0,88,178,−92]`; innerhalb einer Familie bleibt der Winkelabstand (×0,8); `chromaMood`/`lightMood` einmal je Palette; Markierungen bleiben im Band Gelb–Orange; Lesbarkeitsboden Markierung über Fahrbahn ΔL ≥ 0,28; Export/Import als JSON, reproduzierbar per Seed.

**Was die Joyride-Kombinationen als Harmonie-Regeln hergeben (abgeleitet (WS0), OKLCH-Messung der drei WORLDS, kein Register-Wert):**
1. **Boden ist eine Familie:** table und beide hills haben denselben Farbton (±3°); hill = heller bzw. dunkler Ton des Bodens.
2. **Strang/Rahmen ≈ Vierteldrehung vom Boden:** canyon +100°, bucht −78°, otown −98°; immer der bunteste Ton der Welt.
3. **Wahrzeichen (tower):** entweder Strangfarbe (canyon) oder etwa Gegenfarbe zum Boden (bucht −145°, otown +169°).
4. **Pad/Boost immer Gelb** (82–103°), sehr hell.
5. **Fahrbahn immer gedämpftes Schieferblau** (249–280°, wenig bunt), unabhängig von der Welt.
6. **Himmel hell und wenig bunt.**
7. **Laub folgt keiner festen Regel** (canyon Gegenfarbe, bucht +43°, otown −124°); `leaf[2]` ist der Blüten- bzw. Akzentton.

**Vorschlag (nicht gebaut, nicht entschieden, G-4):** Würfel = Cologne-Methode (OKLCH-Drehung, L und C aus der Anker-Palette) mit einer Joyride-Palette als Anker statt der Köln-Messung; Zonen = Joyride-Rollen: Boden-Familie (table, hill), Strang/Rahmen, Wahrzeichen, Laub, Himmel; fest bleiben Fahrbahn (V-102), Pad-Gelb, Banden (V-174). Ausgabe immer als `ENV_ROLES`-Satz (drei Töne je Rolle). **Wirkung des gewürfelten Satzes (V-286):** voll auf Rahmen/Displays (`strang`/`accent`), Requisiten (`accent`, `bark`, `stone`), Wahrzeichen und Signatur-Elemente (`tower`/`accent`), Fluff (siehe §2.4), Himmel (`sky → cloud`), Licht-Tönung und Figuren-Akzente; auf Meshy-Bühnen nur als sanfte Tönung. Story-Mode bleibt Tint darüber.

---

## 3 · Quellen

Repo `georg-doc/kayfabizarro`, lokale Kopie `~/KFB_GitHub_sync` (nur `git show`/`git ls-tree`). main = `e082405ee`, `ws1/r3f-frame` = `980467bf5` (15.10. 11:26).

| # | Quelle (Pfad · Commit/Blob) | Inhalt | Status |
|---|---|---|---|
| 1 | Lab `src/world/organ/vendor/j17/lab-track/track-look.v5.js` · Blob `7c0d2483` = main `…KFB_JOYRIDE_J14_…/lab-track/track-look.v5.js` | `WORLDS` canyon/bucht/otown (J17) | **kanonisch** (V-010, V-102) |
| 2 | Lab `src/palettes.ts` (lokal, git-hash `44d9f5f9`, nach V-174) | `PALETTES` (6), `ENV_ROLES` (6×11 Rollen ×3 Töne), ASPHALT/MASONRY/BANDE | **kanonisch** |
| 3 | Repo `gh/sync/lab-snapshot-2026-10-11` @`64ae61fe7` `…/KFB Island Worldbuilder Lab/src/palettes.ts` · Blob `f8f57d76` | Stand 11.10. vor V-174 (ASPHALT `#545e7a`, BANDE rot/weiß) | **veraltet** in ASPHALT/BANDE, sonst gleich |
| 4 | Lab `public/themes/island-themes.json` · `kfb.island-theme/1` · git-hash `659fb62c` | Sechser-Kombination je Joyride-Welt, `skyHueShift`, Insel→Palette | abgeleitet aus 1; Generator/storyTint „Phase F“ |
| 5 | Lab `docs/KFB_WORLDBUILDER_PLAN_R1.md` §2, §2b | Schema-Regel, Generator, storyTint, Fluff „bunte Mischung“ | Regel (V-051) |
| 6 | Lab `docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md` §3.3 | Würfeln / Ableiten → `ENV_ROLES` | Regel-Entwurf |
| 7 | Lab `docs/QA_RULEBOOK_ENVIRONMENT_R1.md` §0b Punkt 4, K2 | Farb-Grammatik, 60/30/10 | Regel |
| 8 | Lab `docs/SPEC_ENVIRONMENT_KIT_R1.md` §3, §13; `docs/ENV_ERZAEHLRASTER_R1.md` | Kit-Umfärbung je Rolle; Fluff-Farbe = Biom-Akzent | Regel bzw. Idee |
| 9 | `KFB_HUB/30_DECISIONS/STYLE_GUIDE_3D_R1.md` §4 | Rollen, J17-Grundpalette, Story-Tint leicht | Regel (Zusammenfassung) |
| 10 | `KFB_HUB/30_DECISIONS/DECISIONS.md` | V-010, V-011, V-051, V-102, V-174, V-245, V-270, V-286 | Register |
| 11 | `KFB_HUB/30_DECISIONS/replies/donors/storymode.v4.js` · Blob `58a79133` (Original FrankenStein Lab Duo Tone v1) | 6 Modi base/accent + Formeln | **kanonisch für Tint** |
| 12 | Repo main `travel/KFB Travel Combat v25/terrain-v25/world-context.js` · @`7d6a8496e` · Blob `478e8cb4` | Modi ink/panel („Rules Print v4“), `STORY_PALETTES`, `glowOf`, `paletteFromVector` | konkurrierend (ABSURD) |
| 13 | Repo main `travel/KFB Travel Combat v25/terrain-v25/world-palettes.js` · Blob `f6121ae4` (= travel-v16) | 8 Stimmungs-Paletten (3 Stufen) | **abgelöst als Bühnenquelle** durch V-270 |
| 14 | Repo main `tools/KFB-ToolBox/_inbox/KFB Clay Stage + Curtain R2 …/KFB_Clay_Stage_R2/palette-roles.js` · Blob `fd13480d` (R1: `a3e31bf3`) | Bühnen-Rollen aus 3 Stufen + Akzent | **abgelöst als Farbquelle** (V-270); Formel-Vorlage Lichter |
| 15 | Repo main `tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-palette.v1.js` · Blob `38246785` | OKLCH-Paletten-Würfel `kfb-palette/v1` | Spender für Generator (nicht im Register) |
| 16 | Repo `ws1/r3f-frame` `ws1/kfb-planet/src/stagePalette.js` · Blob `4cfb5123`; `src/vendor/palette/*`, `SOURCE.md` | WS1-Umsetzung V-270 | Ist-Stand WS1 |
| 17 | Repo `ws1/r3f-frame` `WS1_STATUS.md` §28.2, §34, §36 | WS1-Bericht, Georgs Urteil, Fragen an WS0 | Bericht |
| 18 | Lab `src/sky/vendor/travel/globe-v13/sky-presets.js` | Material harmonisieren, Licht nicht (Georg 30.8.) | Regel (Spender) |
| 19 | RollerCoaster v8 `v6/docs/deep_specs/04_CEL_SHADING_shadow_lighting.md` (Frizzlebob fractal almanac BRIEFING anchor v2) | Cel-Bänder, Schatten getönt, Rim = Mode-Ink | historisch (Juli), nicht Register |
| 20 | Lab `docs/story/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` | High-/Low-Vibrational-Fluff als Story-Sprache, ohne Farben | Kontext, keine Werte |

---

## 4 · Widersprüche und wer gewinnt

| # | Widerspruch | Gewinner laut Register |
|---|---|---|
| K1 | **Story-Mode ABSURD:** `storymode.v4.js` Ocker (`#f5e6be` / `#b8901d`, gemessen an der Website) gegen `world-context.js` Magenta (`#9a4f86` / `#efe0ec`, „Rules Print v4“). Die anderen fünf Modi liegen im Farbton nahe beieinander (z. B. Tragic `#34566b` / `#3e6a83`). | **Kein Register-Eintrag.** Arbeitsstand: `storymode.v4.js` (von WS0 an WS1 gegeben, V-270-Umsetzung). Entscheidung Georg (G-3). |
| K2 | WS1 hat `palettes.ts` vom 11.10. vendored: ASPHALT `#545e7a`, BANDE rot `#d73d30` / weiß `#eee9dc`. | **V-174 / V-102:** Fahrbahn `#3d4a60` (±12 %), Bande `#ef5a22`. WS1 muss nachziehen, sobald Strecke/Banden in WS1 sichtbar werden. |
| K3 | V-245 (Stimmungs-Paletten `world-palettes.js` + `palette-roles.js`) gegen V-270 (Joyride-Paletten mit Rollen). | **V-270** (Paletten sind Harmonie-Systeme). |
| K4 | V-270 (Rollen auf das Amphitheater) gegen V-286 (Meshy-Textur nur sanft tönen). | **V-286** ersetzt V-270 an dieser Stelle. |
| K5 | V-010 Wortlaut „rote Banden, orange Fahrbahn“ gegen J17-Bau. | **V-102** (schieferblau + orange Banden). |
| K6 | Fluff-Farbe: Plan R1 §2b „bunte Mischung, auch außerhalb der Insel-Palette“ gegen SPEC_ENVIRONMENT_KIT §13 / ENV_ERZAEHLRASTER „Biom-Farbe, Akzent der Farb-Grammatik“ gegen Plan R1 §2 / V-270 „Story-Tint nach Fluff-Farbschema“. | Kein Register-Wert für Fluff-Farben (V-082 TBD). Offen (G-1). |
| K7 | canyon und kfb_town haben dieselbe Akzent-Familie (`#f2b632/#ef5a22/#c4441a`). | Datenlage, kein Widerspruch zu einer Regel; Georg entscheidet, ob getrennt (G-7). |
| K8 | Cel-Shading-Konzept (Juli, harte Bänder) gegen J17-Knete (V-010). | **V-010** (J17-Look); Cel-Text nur als Ideenquelle für Schatten-Ton. |

---

## 5 · WS1 heute und was fehlt

**WS1 heute** (`ws1/r3f-frame` @`980467bf5`, `stagePalette.js`):
- Karte → Deck-Genre → eine der sechs Insel-Paletten (Tabelle `stage-palette.genre.json`, Vorschlag WS1, Rückfall `kfb_town`).
- Rollen: Billboard Rahmen `accent[0]`, Leiste `accent[2]`, Pfosten `bark[1]`; Amphitheater senkrecht `stone`, waagrecht `paved` (Anteil 0,85 über der Meshy-Textur); Himmel `sky → cloud`, Nebel `cloud`.
- Story-Modus der Karte über `world-context.js` (Kartenvektor → stärkste Dimension → Modus), Tint 12 % zum `accent` aus `storymode.v4.js`, gerade sRGB.
- Wechsel weich 1,2 s (V-011). Test `palette` 13/13 PASS.
- Georgs Urteil (§36): „eine Tönung, keine Palette“. WS1 baut Variante B (Rolle je Bühnenteil wie Joyride), ohne Tint.

**Was fehlt bzw. falsch ist:**
1. Volle Rollenvielfalt fehlt: sichtbar sind zwei bis drei Töne plus Tint statt acht und mehr wie in Joyride (WS1 §36.2).
2. V-286 noch nicht umgesetzt: Rollen liegen mit 0,85 auf der Meshy-Textur des Amphitheaters; richtig ist sanfte Tönung dort, volle Palette auf Rahmen, Requisiten, Himmel, Licht, Fluff, Figuren-Akzente.
3. Veraltete ASPHALT/BANDE-Werte (K2).
4. Kein Licht-Anteil: Sonne/Hemisphäre/Rim tragen weder Palette noch Story-Mode.
5. Keine dunkle/sattere Variante (es gibt keine Regel, G-2).
6. Kein Fluff-Farbschema (G-1); der Code-Kommentar „Story-Tint aus dem Fluff-Farbschema (storymode.v4.js)“ ist eine Gleichsetzung ohne Quelle.
7. Kein Würfel (Generator) und keine Palette je Kartenzone, nur je Deck-Genre (G-4).
8. `world-palettes.js` und `palette-roles.js` liegen weiter im Vendor-Ordner, sind aber nicht mehr Farbquelle; `palette-roles.mix` mischt linear (stärker als der Tint).

---

## 6 · Offene Lücken (keine Quelle vorhanden) · Fragen an Georg

- **G-1 Fluff-Farben nach Story-Mode:** Kein Farbschema „Fluff-Sorte × Story-Mode“ mit Werten gefunden. Wo liegt es (Datei, Chat, Bild, Website, Druck)? **Nicht fertig durchsucht** (Suche auf Anweisung abgebrochen): ganz `~/Dropbox/Mac/Documents/Codex/*/kayfabizarro-*`, die Branches `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`, `canon`, `wso/card-text-canonical` per `git grep`, der NIE-Ordner im KFB_HUB, SPinBall Wizard und die Frizzlebob-Almanach-Briefings auf „fluff colo*/Fluff-Farbe“, sowie die Herkunft von „09_MODE_COLORS_canonical“, MOOD_SKY und FRACTAL_PALETTES (RollerCoaster-Ride) und eine lokale Kopie der Story-Mode-Tabelle von kayfabizarro.pages.dev. Bis dahin: Fluff = Akzent-Rolle der Insel oder bunte Mischung (Plan §2b)?
- **G-2 Dunkle und sattere Variante:** Keine Quelle definiert sie je Palettenfarbe. Vorhanden: `ENV_ROLES`-Dunkelton (Daten), `line` aus storymode.v4, `glowOf` (satter), Cologne `chromaMood`. Welche Formel soll gelten (oder gibt es eine Datei, die WS0 nicht gefunden hat)?
- **G-3 Story-Mode ABSURD:** Ocker (Website-Messung, storymode.v4) oder Magenta („Rules Print v4“, world-context)? Am besten ein Foto der gedruckten Tabelle.
- **G-4 Würfel:** Darf der Cologne-Würfel (OKLCH-Drehung) mit Joyride-Ankern die Grundlage sein? Welche Rollen bleiben fest (Vorschlag: Fahrbahn, Pad-Gelb, Banden)?
- **G-5 Rollen je Bühnenteil:** Passt WS1s Variante B (§2.2.3) mit der V-286-Einschränkung?
- **G-6 Stärke der sanften Tönung auf Meshy-Texturen:** Gibt es einen Wert? Im Bestand steht nur der Story-Tint 12 % (Grenze ~15 %).
- **G-7 Joyride-Farbvariationen:** J17 hat genau drei Welten (canyon, bucht, otown); weitere Varianten je Palette gibt es im Bestand nicht. Sind die Lab-Ableitungen (wueste, kfb_town, protopia) gemeint, oder sollen Varianten gewürfelt werden? Sollen canyon und kfb_town eigene Akzente bekommen?
- **G-8 Story-Mode-Palette mit sechs Farben:** Es gibt je Modus nur base/accent (+ deep/light/line) bzw. drei `STORY_PALETTES`-Stufen. Wie soll der Story-Mode „differenziert“ wirken: Tönung je Rolle (z. B. Akzent stärker, Boden schwächer) oder eigene Rollen?


## Nachtrag 15.10. · Story-Mode-Farben von der Website (Georg: „hier die story modes“)
Quelle: https://kayfabizarro.pages.dev/#kfb, CSS-Variablen der Seite. Je Modus gibt es dort eine **dunkle** Farbe (Text, `--m-N`) und eine **satte** Farbe (`--w-*`). Das ist für die Story-Modes die gesuchte dunkle und sattere Variante.

| Modus | dunkel | satt |
|---|---|---|
| Tragic | #34576b | #3e6a83 |
| Comic | #5e6f33 | #7a8d4a |
| Absurd | #b8901c | #e9c14a |
| Heroic | #b35e22 | #d97c3a |
| Mystical | #5b4470 | #6b4e7d |
| Forbidden | #8f3a60 | #a64670 |

- **G-3 gelöst:** Absurd ist Ocker bzw. Gold, nicht Magenta. `world-context.js` („Rules Print v4“) ist hier überholt.
- **G-2 teilweise gelöst:** Für die Story-Modes ist die dunkle und die satte Variante damit gegeben. Für die Insel-Paletten bleibt die Frage offen. Vorschlag: dasselbe Verhältnis wie auf der Website anwenden, also aus der Palettenfarbe eine dunkle Textstufe und eine satte Leuchtstufe ableiten.
- **Fluff-Farben (G-1):** stehen nicht auf der Website. Naheliegend wäre, dass die Fluff-Sorte den Story-Mode trägt (satte Farbe für das Fell, dunkle für die Kontur). Das ist ein Vorschlag und braucht Georgs Bestätigung.


## Nachtrag 15.10. · Fluff-Farben gefunden (Planungs-Branch)
**Quelle:** `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`, `skills/chat/KFB_FLUFF_CRAFTING_ALMANAC_LAYER_CONCEPT_V0_3_2026-10-09.md` (Blob 950f11df), übernommen in der Lab-Review `docs/REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md` („Entschieden: Fluff-Farben = D6-Farben als Akzent-Rollen in ENV_ROLES, keine zweite Palette“).

- **12 Fluff-Sorten:** 6 Story-Modes (D6) × High/Low-Vibrational, dabei 6 Grundfarben, nämlich die Story-Mode-Farben.
- **High:** springiger, lebendiger, heller und glatter. **Low:** sichtbar dichter, dunkler und stärker geknetet. Lesbar auch über D6-Symbol und +/− Form, nicht nur über Farbe.
- **Alchemie:** High und Low desselben Modus ergeben eine neutrale Rohmasse. Das ist ein Zwischenprodukt, keine siebte Farbe. Kein offener 12×12-Umwandlungsgraph, dafür 6 Farb-Trichter in der Mini-Fabrik.
- **Gleiche Warnung wie bei uns:** Absurd in Magenta (Travel world-context) ist eine Abweichung, die Regel-Website gilt.

**Vorschlag WS0 (Georg bestätigt):** Die dunkle und die sattere Variante sind genau die Fluff-Polarität.
- **High-Fluff** = satte Farbe des Modus (Website `--w-*`).
- **Low-Fluff** = dunkle Farbe des Modus (Website `--m-*` bzw. Druck-Tinte).
- **Neutrale Rohmasse:** helles Papier bzw. Panel-Ton.

**Noch zu klären:** Drei Quellen nennen leicht verschiedene „kanonische“ Tinten:
- Druck v4: Tragic `#3e6a83`, Absurd `#8a6d12`, Mystical `#6b4e7d`;
- Website: `#34576b`, `#b8901c` bzw. Ziffer `#8a6a16`, `#5b4470`.

Die Website-Satt-Werte entsprechen teils den Druck-Tinten (zum Beispiel Tragic `#3e6a83`). WS0-Vorschlag: Website als Referenz (V-292), Druck v4 als Panel-Ton.

## Nachtrag 25.10. · Ausroll-Rollen für alles im Bild (V-801, V-802, V-803)

**Quelle der Farben:** die Biom-Palette des Ortes aus dem eingelockten Generator `kfb-cartoon-palette.js` (V-305/V-800). Im Spiel liefert `harmonyPalettes(seed)` in `src/look/biomeTerrain.js` je Biom die Rollen; `roles` sind die J17-Rollen, `envRoles` je Rolle drei Töne (hell, mitte, dunkel). Jedes Teil nimmt die Palette des Bioms, in dem es steht. Wo zwei Biome sich treffen, nimmt ein Teil die Palette des stärkeren.

**Passend und surreal:** Jede Zeile nennt die Standardrolle. Surreal heißt: Ein Teil darf eine andere Rolle derselben Palette nehmen, etwa einen Stamm in Wahrzeichenfarbe. Eine Farbe außerhalb der Palette ist dagegen nie erlaubt. Gemalte Meshy-Texturen werden weiter nur sanft getönt (V-286).

| Teil | Standardrolle (J17) | Hinweis |
|---|---|---|
| Gelände, sechs Fließbänder | `top`, `top2`, `hill[1]`, Mitte `hill`, `under[1]` (Erde 1), `sand` | V-801; Biom-Übergang Band für Band, keine Sprenkel (V-802) |
| Baumkrone | `leaf[0]`, `leaf[1]`, Blüte `leaf[2]` | je Baum eine; Blüte selten |
| Baumstamm | Laub-Rolle −105° und dunkler (J17-Regel) oder `trunk` | zwei Farben je Baum |
| Busch | Blüte `leaf[2]` oder `leaf[0]` | |
| Grasblatt-Gruppe, Pflanze | `leaf[0]`, Akzent `leaf[2]` | |
| Stein, Fels, Formation | `rock`; Schichtlinie dunkler Ton der Rolle | Materialcode V-799 |
| Wasser, Fluids | `water`; Kaugummi im Candy-Band, Säure im Gegenton (V-750) | ein Fluid-Shader, Rezepte je Biom in kfb_place, Owner WS1c |
| Gebäude | Wand `hill[0]` oder `sand`, Dach `tower[0]`, Rahmen/Fenster `strang`, Sockel `under[1]`, Leiste `rock` | gemalte Meshy-Texturen nur sanft getönt (V-286) |
| Diorama, Amphitheater | Boden `top`/`sand`, Ränge `hill`, Torbögen/Krone `tower`, Rahmen `strang`, Pfosten `trunk` | Amphitheater: Bögen nach Rollen umgefärbt (V-402, Ausnahme von V-286); Sprengsel steinweise über COLOR_1-Stein-IDs (V-406) |
| Billboard | Rahmen `strang`, Pfosten `trunk`, Fläche `cloud`, Akzent `pad` | die Karte selbst wird nie umgefärbt (V-329) |
| Mindscape | dieselben Rollen wie die Welt; Himmel `sky`, Wolken `cloud`, Wahrzeichen `tower` | Palette aus demselben Generator wie das Biom (V-800) |
| OSM-Gebäude und Straßen | Gebäude wie oben; Straße `path` bzw. Fahrbahn fest (V-102) | |
| Rauch, Dampf | hellster Ton der Rolle `cloud`, unten getönt mit der Quelle (Sud, Fluid, Boden darunter) | Form nach SPEC_CARTOON_VFX_SHAPES_R1 §2.1 |
| Staub, Erdbrocken | `sand` bzw. `under[1]` des Bodens an der Stelle | |
| Spritzer, Tropfen | `water` bzw. Fluid-Rolle der Quelle | |
| Blätter, Blüten im Wind | Laub- und Blütenrollen der Bäume am Ort | |
| Funken, Treffer, Pickup-Glanz | `pad`, `strang` | kein Emissive-Glühen (V-385) |

**Ausnahmen (bleiben wie sie sind):** Fluff in den Story-Mode-Farben (V-305), Racer: Grund- und Nebenfarben auf die Biom-Rollen umgetönt, 1–2 Identitätsfarben bleiben (V-662), Schachfiguren in Edelstein-Material (V-460), die Karte (V-329), von Black Fluffern übernommene Häuser grau, bis sie befreit sind (V-625, V-629).

**Owner:** WS0 Spiel-Welt (Gelände, Bewuchs, Steine); WS1 Laufzeit, Gebäude, Dioramen, VFX; WSB Blender-Bauteile (Vertex-Farbe nur als Rollen-Maske, Ton zur Laufzeit); WSA Mindscapes, Billboards.

### Rollen-Codes im COLOR_1-Kanal (V-406-Format, Erweiterung 25.10.)
COLOR_1 RGBA8: R+G = Stein-ID (16 Bit), **B = Rollen-Code**, A = 255; COLOR_0 weiß. Die Codes 0–5 sind die von B9 und bleiben unverändert.

| Code | Rolle | | Code | Rolle |
|---|---|---|---|---|
| 0 | Boden `top` | | 9 | Stamm `trunk` (Laufzeit darf die J17-Stammregel nehmen) |
| 1 | Türme/Bögen `tower` | | 10 | Sand `sand` |
| 2 | Ränge/Stufen/Wand `hill[0]` | | 11 | Erde/Sockel `under[1]` |
| 3 | Fels `rock` | | 12 | Wolke/Fläche `cloud` |
| 4 | Rahmen `strang` | | 13 | Wasser/Fluid `water` |
| 5 | Akzent `pad` | | 14 | Weg `path` |
| 6 | Laub `leaf[0]` | | 15 | Boden hell `top2` |
| 7 | Laub `leaf[1]` | | 16 | Hügel dunkel `hill[1]` |
| 8 | Blüte `leaf[2]` | | 255 | keine Rolle (Teil bleibt, wie es ist) |

Die Laufzeit liest den Code flach bzw. als nächsten Code, nie interpoliert: An Teilegrenzen mischen sonst zwei Codes (WSB B9: bis 0,27 % der Dreiecke).

**Nachtrag V-808 (WS0, 25.10.):** Auf Meshy-Bühnen trägt genau ein Fokus-Teil `pad`: der ganze Bühnen- bzw. Billboard-Rahmen mit Einfassung der Bildschirmkante (Bildfläche selbst ohne Rolle, V-329), ohne Rahmen das zentrale Wahrzeichen. Dort ist der Rahmen nicht `strang`. Für selbst gebaute Rahmen außerhalb der Meshy-Bühnen gelten die Tabellen oben unverändert.


---

## Quelle: FARBROLLEN_KONZEPTBLATT_WSB.md

# Konzeptblatt · Farbrollen V-803 · WSB · WS0 · 25.10.2026

Vorlage `CANON_3D/KONZEPTBLATT_R1.md`; bei diesem Job geht es um Farbrollen statt einer Szene. Szenenfelder (Geschichte, Gruppen, Besetzung) bleiben bei den einzelnen Dioramen, wie sie abgenommen sind.

| Feld | Inhalt |
|---|---|
| `one_sentence` | Jedes Bauteil trägt nur noch Rollen statt fertiger Farben, damit die Laufzeit es in der Biom-Palette des Ortes färbt und es zu Gelände, Bäumen und Fluids passt. |
| `palette_roles` | Rollen und Codes nur aus `replies/COLOR_CONCEPT_R1.md` → „Nachtrag 25.10. · Ausroll-Rollen“ und „Rollen-Codes im COLOR_1-Kanal“. Die Codes 0–5 von B9 bleiben; neu sind 6–16 und 255 = keine Rolle. COLOR_1 trägt die Standardrolle; die surreale Umbelegung macht WS1 zur Laufzeit. |
| `color_script` | Grundton 60 % Boden-/Wandrollen, 30 % Fels, Holz und Rahmen (`strang`, Code 4, ist die Rahmenrolle laut Tabelle), 10 % Akzent nur `pad` (Code 5) am Fokus des Dioramas; Bögen und Krone `tower` (1), Laub 6–8, Fläche `cloud` (12), Wasser (13) nach Tabelle. Lichtstimmung: das eine Rig, unverändert. Verboten: fremde Farben, eingebackene Schatten oder Verläufe in COLOR_0. |
| `form_dna` | unverändert; es wird keine Form angefasst. |
| `life_anchor` | unverändert (bei den Dioramen, wie abgenommen). |
| `cameras` | Proof-Stage mit `kfb_clay_bpy`: die 4 Kritiker-Kameras; Bildpaare mit Canyon-Palette und einer gewürfelten Palette aus `kfb-cartoon-palette.js` `random(seed)` (Seed im Dateinamen, kein eigener Zufall in Blender); Licht über `kfb_light_bpy`. Die Bildpaare im Spiel macht WS1. |
| `reference` | Hub q222 (Gelände) und q220 (Bäume zweifarbig); Golden Samples `replies/COLOR_HARMONY_R1/bilder/01_j17_*`. |

**Antworten auf deine fünf Fragen**
1. **Code-Tabelle:** steht jetzt in `COLOR_CONCEPT_R1.md` (siehe oben). Ein Teil ohne Rolle bekommt 255.
2. **Gehaltene Teile und Kostümteile** (K10, B16, die Wurfwaffen aus B41, B23): in diesem Job keine Rollen, sie bleiben vorerst wie geliefert. V-803 nennt sie nicht; ob sie später umgetönt werden, ist ein offener Georg-Entscheid (V-286 nennt Requisiten). Die Explosionen und Krater aus B41 bekommen Rollen (VFX).
3. **Fassungen:** neue Fassungen neben die alten in die Quellordner (`*_r803`), dazu ein neues Übergabe-Paket `HANDOFF_R2`; der Asset-Pass jedes Teils bekommt das Feld Rollenfarbe aktualisiert (Gate M5). HANDOFF_R1 bleibt unverändert, bis WS1 umstellt.
4. **Meshy-Texturen** (V-286): COLOR_1 markiert die Tönungsbereiche, die Laufzeit tönt dort nur sanft. Ausnahme Amphitheater: Die Bögen werden nach Rollen umgefärbt (V-402).
5. **Bildpaare:** ja, Proof-Stage mit `kfb_clay_bpy`, Canyon-Palette und eine gewürfelte Palette.

**Reihenfolge:** B9 (Codes nur abbilden) → B3, B20, B48, B51 → die Dioramen aus Liste 2 → VFX B19 und B41 (nur Explosionen und Krater). Abgabe je Gruppe: Gate grün, blinder Kritiker, dann Georg.

**Prüffragen vor dem Bau:**
- Trägt jedes Teil genau einen Code?
- Ist COLOR_0 weiß?
- Bleiben STEINKIT, Figuren (auch Figuren-Akzente, eigener späterer Job), Waffen und Fluff unberührt?

**Nachtrag V-808 (WS0, 25.10.):** Codes gelten je zusammenhängender Fläche (Mehrheit der Textur-Codes; Ausnahmen aus V-806 gehen vor). Genau ein Fokus-Teil je Bühne trägt `pad`: der ganze Rahmen samt Bildschirmkante, ohne Rahmen das zentrale Wahrzeichen. Der Rahmen ist damit nicht mehr `strang` (Code 4).

**Nachtrag V-809 (WS0, 25.10., Georg q230):** Auf Meshy-Bühnen gilt für Rollen-Teile „voll“: Zug 1,0 auf Farbton und Sättigung, Helligkeit und gemalte Zeichnung bleiben. Der Satz „die Laufzeit tönt dort nur sanft“ gilt für Meshy-Rollen-Teile nicht mehr; Deckel ΔE00 ≤ 18 und das Maß sanft 8–18 entfallen für sie. Teile mit wenig Sättigung (braun-grau) bekommen eine Verlaufs-Abbildung Helligkeit → Rollen-Farbton als Option in `kfb_clay_bpy` (Kanon-Vorschlag r809, nicht in COLOR_0 oder in die Textur gebacken). Vergleichsblätter: je Bühne vorher/nachher, eine Palette (Canyon), Beschriftung ohne Fachbegriffe.

**Nachtrag V-812 (WS0, 25.10.):** Codes je Bauteil: Spiel-Mesh an Knickkanten über 40° getrennt, große Bauteile (über 15 %) nach Richtung geteilt, an die Stein-IDs gerastet (V-406 bleibt). Code aus der Geometrie (Oberseite top, steil hill[0], schlank tower), B9-Mehrheit nur als Rest; Ausnahmen V-806 und ein Fokus (V-808) gelten. Ersetzt die 35°-Zeile aus V-808.

**Nachtrag V-814 (WS0, 25.10.):** Nach Runde 4 (Stopp-Regel) Probe einer neuen Richtung auf Theater, Utopia Stage und Nature Island: Code je Bauteil nur aus Geometrie und Textur-Grundfarbe, ohne B9-Mehrheit; Fokus von WS0 benannt (ganzer Ornamentrahmen samt Bildschirmkante; Mesa erst nach Kandidaten-Blatt). Neun nicht sauber einfärbbare Bühnen vorerst nicht im Spiel, außer dem Gefängnis (Georg q232).


---

## Quelle: VORSCHLAG_BAUTEILE_R1.md

# Vorschlag · Codes je Bauteil statt je Fläche (V-809 Teil 2) · WSB · 2026-10-25
Nur Vorschlag, nichts gebaut. Probe: `vorschlag_bauteile/` (Skripte `scripts/bauteile_probe.py`, `scripts/bauteile_render.py`), Blatt `vorschlag_bauteile/PROBE_bauteile_theater_mesa.jpg`. Ob gebaut wird, entscheidet WS0.

## Warum
Die B9-Teile sind Texturflecken: Fugen, gemalte dunkle Linien und die Voronoi-Ersatzteilung großer glatter Flächen. Eine Flächen-Regel über diesen Teilen (V-808, r808b) zerlegt gekrümmte glatte Flächen in viele Stücke, deshalb bleiben die Flecken (Bühnenlippe, Sockel, Mesa-Felskörper). Der Vorschlag teilt deshalb nach der Geometrie des Spiel-Meshes.

## Wie die Bauteile entstehen
1. **Verschweißen:** Ecken des Spiel-Meshes nach Lage verschweißen (Raster 1e-5 der Bühnendiagonale). Zwei Dreiecke sind Nachbarn, wenn sie eine Kante teilen.
2. **Knick:** Eine Kante ist Knick, wenn die Dreiecksnormalen um mehr als **40°** abweichen. Bauteil = zusammenhängende Dreiecke ohne Knick.
   - Glatte, gekrümmte Flächen ohne Knick (Bühnenlippe, Sockelrund, Felskörper) bleiben ein Bauteil. Genau das soll die Flecken beseitigen.
3. **Fehlform „schluckt zu viel“** (Mesa-Wahrzeichen 46 % in der Knick-Probe): Ein Bauteil über **15 % der Bühnenfläche** wird nach vorherrschender Richtung (oben, unten, ±x, ±z) geteilt und neu zusammengesetzt.
   - Probe: größtes Bauteil Theater 9,6 %, Mesa 10,9 %.
4. **An die Stein-IDs rasten:** Jeder B9-Stein (V-406, COLOR_1.RG) gehört ganz zu dem Bauteil, das den größten Teil seiner Fläche hat. Ein Bauteil ist damit eine Gruppe von Steinen.
   - Es gibt keine neue Eckentrennung; „ein Code je Stein“ bleibt wahr.

## Code je Bauteil
- Flächengewichtete Mehrheit der Stein-Codes nach den V-806-Regeln (Wand und Turm, Oberseite, Laub).
- Die V-806-Ausnahmen gehen vor und behalten ihren Code: Boden 0, Laub 6/7/8, schlanke Türme und Amphitheater-Bögen 1, ohne Rolle 255.
- Fokus bleibt genau ein Teil (V-808): ganzer Rahmen bzw. Wahrzeichen-Fläche, Code 5; Bildschirmfläche 255 (V-329).
- **Abgelöst würde die V-808-Zeile:** „Ein Code gilt je zusammenhängender Fläche: Flächen, die über Kanten verbunden sind und deren Normalen höchstens 35° vom Mittel der Fläche abweichen …“. An ihre Stelle träte: „Ein Code gilt je Bauteil des Spiel-Meshes (Knickkanten > 40°, Bauteil ≤ 15 % der Bühne, an Stein-IDs gerastet)“. Ausnahmen und Fokus aus V-806/V-808 bleiben.

## Stein-IDs (V-406)
- R+G (Stein-ID) bleibt Byte für Byte, das Sprengsel-Modul sieht dieselben Steine. Nur B (Rolle) wird je Bauteil gesetzt.
- Weil Bauteile Steingruppen sind, bleibt „ein Code je Stein“ wahr. Steine eines Bauteils tragen denselben Code, ihre IDs unterscheiden sie für die Sprengsel weiter.
- Für WS1 kann die Zuordnung Stein → Bauteil als GLB-Extra (`kfb_r803.bauteile`) mitgehen. Nötig ist sie für die Laufzeit nicht.

## Was unverändert bleibt
„Bauteil“ ist nur die Einteilung für den Code in COLOR_1. Mesh, Normalen, UV, COLOR_0, Materialien, Bilder und die Browser-Fassung bleiben byte-gleich (V-136). Das Hash-Gate prüft das wie bei r808b.

## Gate-Prüfung
Die Bauteile mit demselben Skript und denselben Parametern neu berechnen; die Teilung ist deterministisch. Dann prüfen:
- je Bauteil genau ein Code, außer bei Ausnahme-Steinen;
- je Stein genau ein Code;
- Code 5 nur am Fokus, Bildschirm 255;
- kein Bauteil über 15 %;
- R+G, A, COLOR_0 und alle übrigen Kanäle byte-gleich zur Quelle;
- Asset-Pass vollständig (M5).

## Probe (Diagnose, ohne Kritiker)
| Bühne | Dreiecke | Roh-Bauteile | nach Rasten | geteilt (> 15 %) | größtes | Steine umgesetzt |
|---|---|---|---|---|---|---|
| Theater | 435 484 | 26 024 | 1385 | 1 | 9,6 % | 731 von 7976 |
| Mesa | 199 742 | 16 021 | 1074 | 1 | 10,9 % | 283 von 2833 |

- **Theater:** Die Bauteile folgen den Bauteilen des Modells (Säulen, Gesimse, Vorhänge, Felder). Die Säulen werden `tower`, der Korpus `hill[0]`, viel ruhiger als das Stein-Mosaik. An der linken Seitenwand bleiben einzelne `tower`-Flecken: Steine, die zwei Bauteile überspannen.
- **Mesa:** Die Gesteinsschichten werden zu vielen Blöcken, der Code ist weithin einheitlich `hill[0]`. Auf der Kappe bleiben einzelne `rock`-Flecken.
- Die Probebilder sind enger gerahmt als die ungetönte Spalte (eigene Kamera der Vorschau).

## Offene Punkte
- Meshy-Oberflächen sind uneben, deshalb gibt es 16 000–26 000 Roh-Bauteile. Erst das Rasten an die Steine macht daraus 1000–1400 brauchbare Bauteile. Ein höherer Knickwinkel (50–60°) wäre zu prüfen.
- Die restlichen Flecken kommen aus den B9-Codes selbst, weil die Mehrheit mit den heuristischen Codes zählt. Bessere Ruhe brächte ein Code je Bauteil aus der Geometrie: Richtung (Oberseite → top, steil → hill[0], schlank → tower). Das wäre eine weitere Regeländerung.
- Aufwand für den Bau aller 21 B9-Dateien: Skript steht als Probe. Bau, Gate-Erweiterung und Bildpaare kosten etwa einen halben Tag.


---

## Quelle: kritik_runde4_farbe.md

# Kritik Runde 4 · Farbrollen V-803 · nur Farbe (K2) · 25.10.2026

Blinder Kritiker nach `CANON_3D/CRITIC_3D_R1.md`. Grundlage: Kanon `CANON_3D_R1.md` Gebiet 6/15/16, Konzeptblatt `FARBROLLEN_KONZEPTBLATT_WSB.md` mit V-808, V-809, V-812, `COLOR_CONCEPT_R1.md` (Ausroll-Rollen, Rollen-Codes), DECISIONS V-806/V-808/V-809/V-812, `paletten.json`.
Gesehen: 22 Blätter `bildpaare_runde4/*/*_blatt.jpg`, dazu Einzelbilder (960×540) bei Bedarf. Gate `farbrollen_gate_v812.json`: grün (19/19 Meshy).

**Umfang:** nur K2. K1, K3–K10 = n/a (Form, Platzierung, Licht, Geometrie zählen nicht). Bestanden-Regel damit: Gate grün und K2 ≥ 8.
**Maßstab:** Rolle in der Palette erkennbar (keine fremden Farben) · ruhige Flächen (ein Bauteil eine Farbe, keine Flecken quer über Flächen) · gemalte Zeichnung erhalten · `pad` am Fokus und nur dort · 60/30/10.
**Spalte „einfärbbar“ (V-809, Georg q230):** ja = das Diorama nimmt beide Paletten auf seinen Hauptflächen an; nein = Hauptflächen bleiben dunkel bzw. grau-braun oder erreichen die Rolle in einer Palette nicht. Flecken und `pad` gehen in K2, nicht in diese Spalte.
Kamera 1 Übersicht · 2 Augenhöhe · 3 Fuß · 4 Seite; Zeile C = nachher Canyon, Zeile R = nachher random(803).

## Gesamturteil: **REWORK** (0 PASS, 22 REWORK)

**Stopp-Regel (CRITIC_3D_R1):** K2 liegt in dieser Runde bei 4,5–7 (Mittel 5,8). DECISIONS vermerkt nach Runde 2 „meist 6,5–7“ und nach Runde 3 „kein Gewinn“ (V-806, V-808). Runde 4 bringt keinen Punktgewinn. Damit gibt es die zweite Reparatur ohne Gewinn am selben Kriterium: **Stopp, Bericht an WS0**. Kein Wert liegt unter 4.

| # | Diorama | K2 | Urteil | einfärbbar | Hauptgrund |
|---|---|---|---|---|---|
| 1 | AkashicLibrary_A_screen | 5,5 | REWORK | nein: Felsunterseite und Mauer bleiben dunkel (Indigo bzw. Dunkeloliv) | rote bzw. violette Einzelsteine quer über der Mauer |
| 2 | AlienWorkshop_A_screen | 6,5 | REWORK | ja | Flecken auf Rück- und Außenwand; Teleporter in Laub-Rolle |
| 3 | Amphitheater_A | 5,5 | REWORK | ja | zweifarbige Dreiecks-Facetten am Sockelring; Bogensteine in drei Rollen |
| 4 | ComicBroadcast_A_screen | 5,5 | REWORK | nein: Außenwand bleibt schwarz, Sockelblöcke oliv-grau | Rolle auf Außenwand nicht ablesbar; fremdes Oliv (C) |
| 5 | DystopiaAlley_A_screen_shutter | 4,5 | REWORK | nein: Wände und Boden bleiben dunkel | Rolle nur am Rahmen ablesbar |
| 6 | GoblinBank_A_screen.v2 | 5,5 | REWORK | nein: Sockel in C oliv-grau, Außenwand dunkel | Flecken auf der Tresortür; grüner Treppenläufer (R fremd) |
| 7 | KFB_Imbiss_Ruine.r1 | 7 | REWORK | ja | Vitrine in beiden Paletten gleich lila; kein `pad` |
| 8 | KFB_Kayfabrick_Baustelle_ohne_Stationen.r1 | 6,5 | REWORK | nein: Bodenscheibe erreicht in C die Rolle nicht (rosa-beige) | Rolle Boden in C nicht ablesbar; kein `pad` |
| 9 | KFB_RPG_Camp.r1c | 5 | REWORK | nein: Boden in C grau-grün; Felswand bleibt braun (V-788) | Mittelgrau-Grün als größte Fläche; kein `pad` |
| 10 | MarbleTerraces_A_screen | 4,5 | REWORK | ja | Dreiecks-Flecken über Sockel und Wasserzone; Laub-Rechtecke am Sockel |
| 11 | MesaIsland_A_faithful | 6 | REWORK | ja | `pad` an der Unterseitenspitze statt am Fokus; orange Einzelblöcke in Schichten |
| 12 | NatureIsland_A_screen | 6,5 | REWORK | ja | Steilwand im Wechsel violett/orange in Streifen |
| 13 | PortalRuin_A_screen | 6 | REWORK | ja | beige bzw. magenta Flecken über Treppenplatten und Felsblöcken |
| 14 | PortalRuin_B | 5,5 | REWORK | ja | `pad` am Sockelrand statt am Portal; Flecken wie PortalRuin_A |
| 15 | PrisonPanopticon_A_screen.v2 | 4,5 | REWORK | nein: Innenhof und Außenwand bleiben dunkel | Rolle nicht ablesbar außer Rahmen und Schildern |
| 16 | RetroArcadeCasino_A_screen.v3 | 5 | REWORK | nein: Sockeltruhe und Seitenwand bleiben dunkel | Rolle nicht ablesbar; Flecken auf Seitenwand (R) |
| 17 | SnowIsland_A_screen | 6,5 | REWORK | ja | Eiszapfen gleicher Art in zwei Rollen; Unterseite dunkel mit roten Stücken |
| 18 | TheaterStage_A_screen | 6,5 | REWORK | ja | Farbsprung mitten auf der Bühnenschürze; `pad` nur an der Innenkante |
| 19 | UtopiaLibrary_A_screen | 6,5 | REWORK | ja | rote bzw. violette Einzelsteine quer über der Mauer |
| 20 | UtopiaStage_A_screen.v2 | 7 | REWORK | ja | Flecken auf Treppenläufer und Wandrahmen (R) |
| 21 | VerdantRuins_A_screen | 6 | REWORK | ja | beige bzw. violette Flecken über der Felswand |
| 22 | ufo_cockpit_A_faithful | 5 | REWORK | nein: Hülle bleibt in C grau-braun | Bildschirm trägt Rolle; Einzelplatten in zweiter Rolle; `pad` nicht sichtbar |

**PASS:** keine.

## Querbefunde (wiederkehrend)
1. **Einzelsteine bzw. -bauteile in zweiter Rolle innerhalb einer Wand oder Felsmasse.** Das liest sich als Flecken quer über die Fläche. Betroffen sind 1, 2, 3, 11, 13, 14, 19, 21. Regel: V-812 (Code aus der Geometrie, steil = `hill[0]`), V-806 Wand-Regel (je zusammenhängender Wand ein Code).
2. **Zweifarbige Dreiecks-Facetten innerhalb eines Bauteils** (Marble K3, Amphitheater K3). Regel: V-812 „ein Code je Bauteil“, ruhige Fläche; Gebiet 17 (8).
3. **Sichtbare Richtungs-Teilung** als harter Farbsprung auf einer durchgehenden Fläche (Theater K3, Nature K1). Regel: V-812 (Teilung über 15 %); Maßstab ruhige Fläche.
4. **Dunkle Meshy-Texturen:** Die Rolle ist nur als dunkler Farbstich da (4, 5, 15, 16, Teile von 1 und 6). Regel: V-809 (Verlaufs-Abbildung für braun-graue Teile; nicht einfärbbar = vorerst aus dem Spiel).
5. **`rock` in Canyon (#e2d0bc) auf dunkler bzw. grauer Textur** ergibt Oliv-Grau (4 Sockel, 6 Sockel, 22 Hülle). In Canyon gibt es kein Oliv. Regel: K2-Nullanker „Mittelgrau“; Ausroll-Rollen „Farbe außerhalb der Palette nie erlaubt“.
6. **`pad`:**
   - nicht am Fokus: 11 (Unterseite), 14 (Sockelrand);
   - nicht sichtbar: 22;
   - nur Innenkante statt ganzer Rahmen: 18;
   - in den drei Kit-Dioramen kein `pad`, die 10 % fehlen.
   Regel: V-808, Konzeptblatt `color_script`.
7. **Kit-Deckel:** Die Rolle wird in Canyon nicht erreicht (8 Boden, 9 Boden, 7 Vitrine). Regel: V-806 (Kit 0,85 mit Deckel); K2.

Die gemalte Zeichnung (Schilder, Ornamente, Holzmaserung, Teppichmuster) ist auf allen 19 Meshy-Bühnen erhalten. Die Ausnahme ist das Amphitheater, das nach V-402 voll umgefärbt wird.

## Mängel je Diorama

### 1 AkashicLibrary_A_screen · K2 5,5 · REWORK
- K4 C: rote Einzelsteine über der Mauer (Mitte und rechts) → V-812 / V-806 Wand-Regel.
- K4 R: dieselbe Mauer oliv mit violetten Einzelsteinen → V-812.
- K2 C: Felsbrocken oben violett und unten beige innerhalb einer Masse (Mitte links); unter dem Schild „All stories connect“ ein roter Block → V-812.
- K2/K3 C+R: hängende Felsunterseite dunkel, Rolle nicht ablesbar → V-809.
- K4 C: Mauer-Violett liest sich als dunkles Indigo, nicht als `hill[0]` #a582d9 → V-809.
- `pad` am Rahmen: ja.

### 2 AlienWorkshop_A_screen · K2 6,5 · REWORK
- K2 C: grüne Flecken auf der violetten Rückwand (Mitte oben, Mitte) → V-812.
- K4 C: Außenwand violett mit roten Flecken; K4 R: grün mit violetten Flecken → V-812 / V-806 Wand-Regel.
- K1 C: linke Außenwand orange mit violetten Stücken (links) → V-812.
- K1/K2: Teleporter (Mitte) ist in C grün und in R orange, also in Laub-Rolle an einem Nicht-Pflanzen-Teil → Rollentabelle (Laub nur Bewuchs, V-806).
- `pad` am Rahmen (K2 oben rechts): ja. Banner und Schilder lesbar.

### 3 Amphitheater_A · K2 5,5 · REWORK
- K3 C: Sockelring mit violett/beigen Dreiecks-Facetten in einzelnen Steinen (untere Bildhälfte); K3 R: violett/olive → V-812, Gebiet 17 (8).
- K3 C: Torbögen mit Bogensteinen in drei Rollen (orange, violett, beige) → V-806/V-402 (Bögen `tower`).
- K4 C: rote Stücke in der Felsmasse (rechts unten); K4 R: Wand olive mit Magenta-Flecken über die ganze Länge → V-812.
- `pad` auf der Arena (Fokus): ja.

### 4 ComicBroadcast_A_screen · K2 5,5 · REWORK
- K4 C+R: Außenwand bleibt schwarz, Rolle nicht ablesbar; in C rote Punkte, in R violette Flecken → V-809.
- K2 C: Sockelblöcke links und rechts oliv-grau. Oliv ist keine Canyon-Farbe → Ausroll-Rollen (keine Farbe außerhalb der Palette), K2 „Mittelgrau“.
- K2 C: Mittelstufen violett, Seitenblöcke oliv-grau, also zwei Rollen am selben Sockel → V-806 Wand-Regel.
- `pad` am Rahmen: ja. Wandbild-Zeichnung erhalten.

### 5 DystopiaAlley_A_screen_shutter · K2 4,5 · REWORK
- K1/K4 C+R: Gebäude, Wände und Boden bleiben dunkel; die Rolle ist nur als Farbstich da → V-809.
- K3 C+R: Sockelsteine dunkel, kaum getönt → V-809.
- K2: Billboard-Bild umgetönt (C rosa-violett, R oliv) → V-329 (die Karte bzw. das Bild wird nie umgefärbt), prüfen.
- `pad` am unteren Bildschirm-Rahmen: ja. Liegt der Fokus am Billboard oder am Bildschirm? Ein Fokus nach V-808.

### 6 GoblinBank_A_screen.v2 · K2 5,5 · REWORK
- K2 C: Tresortür und Rad rot mit violetten Flecken (Mitte rechts) → V-812.
- K2 C: Goblin-Statue mit roten Punkten (oben rechts) → V-812.
- K3 C: Sockelsteine oliv-grau (`rock` auf dunkler Textur), Rolle nicht ablesbar; in R violett → Ausroll-Rollen, K2 „Mittelgrau“.
- K2 C+R: grüner Treppenläufer (Mitte links) bleibt grün; in R ist Grün keine Palettenfarbe → Teil ohne Rolle liest sich als fremde Farbe (Konzeptblatt „Verboten: fremde Farben“).
- K1: gelbes Treppengeländer (links) liest sich als zweiter Akzent neben dem Rahmen → Gebiet 16 (5), 60/30/10.
- K4 C: Außenwand dunkel → V-809.

### 7 KFB_Imbiss_Ruine.r1 (Kit) · K2 7 · REWORK
- K2/K3: Kühlvitrine in C und R gleich lila, die Rolle folgt der Palette nicht → V-806 Kit-Deckel, Rolle erkennbar.
- K1–K4: kein `pad` sichtbar, die 10 % fehlen → Konzeptblatt `color_script`.
- Bodenplatte (C rosa-beige, R creme), Markise und Holz (orange bzw. orange-rot) ruhig, je Bauteil eine Farbe. Steinkit-Wand bleibt (V-788).

### 8 KFB_Kayfabrick_Baustelle_ohne_Stationen.r1 (Kit) · K2 6,5 · REWORK
- K1–K4 C: Bodenscheibe rosa-beige; R erreicht Oliv (`top`). In C ist die Boden-Rolle nicht ablesbar → V-806 Kit-Deckel.
- K2 C+R: Rampe in beiden Paletten rotbraun bzw. mauve, kaum unterscheidbar → Rolle erkennbar.
- kein `pad` → Konzeptblatt `color_script`. Kayfabrick-Steine bleiben (V-806).

### 9 KFB_RPG_Camp.r1c (Kit) · K2 5 · REWORK
- K1–K4 C: Bodenscheibe grau-grün, die größte Fläche ist ein Mittelton ohne Rolle → K2-Nullanker „Mittelgrau“, V-806 Kit-Deckel.
- Felswand (Steinkit) und Zelte bleiben in beiden Paletten braun bzw. gelb-orange. Das ist nach V-788 regelkonform. Damit nimmt die größte Masse die Palette nicht an.
- kein `pad` → Konzeptblatt `color_script`. Bäume: C grün, R orange (Laub-Rolle ablesbar).

### 10 MarbleTerraces_A_screen · K2 4,5 · REWORK
- K3 C+R: Sockelwand mit violett/beigen (C) bzw. olive/magenta (R) Dreiecks-Flecken über die ganze Fläche → V-812, Gebiet 17 (8).
- K2/K3 C: grüne Rechtecke auf Sockel und Wasserzone (rechts); in R orange, also Laub-Rolle am Sockel → Rollentabelle.
- K2 C: Wasserzone vorn violett mit beigen Dreiecken; die `water`-Rolle (#5983ac) ist nicht ablesbar → Rollentabelle Code 13.
- Säulen orange (`tower`), `pad` am Rahmen: ja.

### 11 MesaIsland_A_faithful · K2 6 · REWORK
- K4 C: gelbes `pad` an der Unterseitenspitze (unten Mitte rechts), K1 C ebenso unten links; der Fokus ist nicht dort → V-808.
- K1/K4 C: orange-rote Einzelblöcke in den violetten Schichtbändern → V-812.
- K2/K3 C: hängender Körper senkrecht halb violett, halb orange → V-806 Wand-Regel.
- Oberseite violett (C) bzw. olive (R): `top` ablesbar.

### 12 NatureIsland_A_screen · K2 6,5 · REWORK
- K1/K4 C: Steilwand in senkrechten Streifen im Wechsel violett/orange-rot, R magenta/olive → V-812 (steil = `hill[0]`), V-806 Wand-Regel.
- K1 C: beige Felsbrocken über die Oberseite verteilt → Gebiet 17 (5) (Cluster statt Konfetti).
- `pad` am Rahmen: ja.

### 13 PortalRuin_A_screen · K2 6 · REWORK
- K2/K3 C: Treppenplatten und Felsblöcke violett mit beigen Flecken innerhalb einzelner Platten; R olive mit Magenta-Flecken → V-812.
- K2: cyanfarbener Glimmrand am Portal (keine Rolle) konkurriert mit `pad` → Gebiet 16 (5).
- `pad` am Rahmen, Säulen `tower`: ja.

### 14 PortalRuin_B · K2 5,5 · REWORK
- K4 C+R: gelbes `pad` am Sockelrand (untere Kante), das Portal trägt kein `pad` → V-808 (ein Fokus, zentrales Wahrzeichen).
- K2/K3 C+R: Flecken über Treppenplatten und Felsblöcken wie bei PortalRuin_A → V-812.
- K2: der Portalring liest sich über das Cyan (ohne Rolle), nicht über `pad` → Gebiet 16 (5).

### 15 PrisonPanopticon_A_screen.v2 · K2 4,5 · REWORK
- K1/K2/K4 C+R: Innenhof, Ränge und Außenwand bleiben dunkel; die Rolle ist nur als Farbstich da → V-809.
- K3 R: Sockel olive mit violetten Flecken → V-812.
- `pad` am Rahmen: ja. Schilder lesbar.

### 16 RetroArcadeCasino_A_screen.v3 · K2 5 · REWORK
- K3/K4 C: Sockeltruhe und Seitenwand bleiben dunkel → V-809.
- K3 R: Truhe links magenta, rechts olive mit Magenta-Flecken → V-812.
- K4 R: Seitenwand olive mit violetten Flecken → V-812.
- `pad` am Rahmen: ja. Boden-Sternmuster erhalten.

### 17 SnowIsland_A_screen · K2 6,5 · REWORK
- K2 C: Eiszapfen gleicher Art teils violett, teils beige; R olive bzw. pink → V-806 (gleiche Art eine Rolle), V-812.
- K4 C: Unterseite dunkel mit roten Stücken → V-812, V-809.
- K2/K3 C: zentrale Spitze voll orange-rot; als größte Einzelfarbe am Körper liest sie sich lauter als die Oberseite → Gebiet 16 (2).
- Oberseite `top` ablesbar, `pad` am Rahmen: ja.

### 18 TheaterStage_A_screen · K2 6,5 · REWORK
- K3 C: Bühnenschürze vorn mit hartem Farbsprung lila/orange mitten auf der durchgehenden Fläche; R olive/magenta → V-812 (Teilung über 15 %), ruhige Fläche.
- K2 C: orange Flecken an den Schürzenseiten links und rechts → V-812.
- K1: `pad` nur an der dünnen Innenkante; der Ornamentrahmen ober- und unterhalb ist lila → V-808 (ganzer Rahmen samt Bildschirmkante).
- Ornamente, Holzmaserung und Vorhangfalten erhalten.

### 19 UtopiaLibrary_A_screen · K2 6,5 · REWORK
- K4 C: violette Mauer mit roten Einzelsteinen; R olive mit violetten Einzelsteinen → V-812 / V-806 Wand-Regel.
- K3 C+R: Stufen und Sockelsteine im Wechsel violett/beige bzw. magenta/olive je Stein → V-806 Wand-Regel.
- Efeu C grün, R orange (Laub-Rolle ablesbar); Teppichmuster erhalten; `pad` am Rahmen: ja.

### 20 UtopiaStage_A_screen.v2 · K2 7 · REWORK
- K4 R: Treppenläufer magenta mit olive Flecken (Mitte rechts) → V-812.
- K4 R: Rundfenster-Rahmen oben olive mit violetten Flecken → V-812.
- K4 R: Sockelring mit einzelnen Magenta-Steinen zwischen olive → V-806 Wand-Regel.
- K2 C: ruhig, je Bauteil eine Farbe. `pad` am Rahmen: ja.

### 21 VerdantRuins_A_screen · K2 6 · REWORK
- K2 C: Felswand violett mit beigen Flecken (rechts); R olive mit violetten Flecken (links unten) → V-812.
- K4 C+R: Gebäude und Seite dunkel, Rolle kaum ablesbar → V-809.
- Moos C grün (Laub), Säulen `tower`, `pad` am Rahmen: ja.

### 22 ufo_cockpit_A_faithful · K2 5 · REWORK
- K1 C+R: Cockpit-Bildschirm umgetönt (C lila mit oranger Form, R hellgelb) → V-812 (Bildschirmfläche ohne Rolle), V-329.
- K1/K2 C: Hülle bleibt grau-braun, `rock` beige ist auf der grauen Textur nicht ablesbar; R magenta → Ausroll-Rollen, K2 „Mittelgrau“.
- K2 C: eine rote und eine lila Hüllenplatte im Ring gleicher Platten (rechts bzw. oben Mitte); K1 einzelne lila Platten am Vorderring → V-812.
- K1–K4: `pad` nicht sichtbar (Gate: 0,4 % Fläche) → V-808.

## Rohdaten-Abgleich (nur Information)
Nach `de00_runde4.json` haben die Dioramen mit „einfärbbar: nein“ den niedrigsten Mittel-ΔE00 bzw. eine dunkle Vorlage:
- Dystopia 7,0 / 8,2 (L 11,9);
- Prison 9,0 / 9,4 (L 13,5);
- RetroArcade 10,3 / 11,8 (L 14,8);
- UFO Canyon 6,8;
- RPG Camp 7,2 / 7,5.

Die Rohdaten decken sich mit dem Bildbefund.


---

# TEIL 4 · Regeln und Löser


## kfb_place.r1.rules.json

```json
{
 "schema": "kfb.place/1",
 "version": "r1",
 "by": "WS0",
 "date": "2026-10-25",
 "note": "Einzige Zahlenquelle für Umgebung, Props, Natur, Fluff und Fundstücke (V-748, Entscheide V-749). Aus kfb_env.py (RULES, SINK, NEST), n36_rules.r1.json, kfb_edge_params.json, grammar.js GRAMMAR und B2-R2 Fluff-Grammatik zusammengeführt. Werte mit tune sind Startwerte nach V-568 und werden an P0 kalibriert. kfb_env liest künftig RULES, NEST, SINK aus dieser Datei (WSB-Auftrag).",
 "units": {
  "base": "m",
  "m_per_kaykit_u": 0.616381,
  "m_per_H": 2.24362684,
  "note": "H = Lab-Einheit K2 (3,64 u)"
 },
 "rules": {
  "sink": {
   "rock": [
    0.4,
    0.5
   ],
   "rockgroup": [
    0.2,
    0.35
   ],
   "tree": [
    0.05,
    0.1
   ],
   "bush": [
    0.05,
    0.12
   ],
   "building": [
    0.0,
    0.15
   ],
   "prop": [
    0.02,
    0.05
   ],
   "prop_buried": [
    0.4,
    0.95
   ],
   "stone_L": [
    0.4,
    0.5
   ],
   "stone_M": [
    0.35,
    0.5
   ],
   "stone_S": [
    0.3,
    0.4
   ],
   "grass": [
    0.0,
    1.0
   ],
   "fluff": [
    0.0,
    1.0
   ],
   "contact": [
    0.25,
    1.0
   ],
   "character": [
    0.0,
    0.03
   ],
   "vehicle": [
    0.0,
    0.03
   ],
   "path_stone": [
    0.1,
    0.25
   ],
   "water_plant": [
    0.0,
    1.0
   ],
   "rubble": [
    0.3,
    0.5
   ],
   "dust": [
    0.0,
    1.0
   ],
   "stump": [
    0.05,
    0.15
   ],
   "log": [
    0.1,
    0.25
   ]
  },
  "sink_cap": 0.5,
  "group": {
   "odd": true,
   "sizes": [
    1.0,
    0.62,
    0.38
   ],
   "size_tol": 0.2,
   "spread_pair_min": 0.3,
   "line_max": 2,
   "line_tol": 0.05,
   "overlap_max": 0.85,
   "air_min": 1.25,
   "repeat_max": 3,
   "no_clones": true,
   "one_kit_per_group": true,
   "spread_tune": 0.45,
   "spread_target": 0.5,
   "neighbour_r": 4.5,
   "clone_dist_H": 1.6484,
   "float_tol_H": 0.003,
   "band_margin": 0.08,
   "note_v790": "G1 misst mit Kachel gate_r_m (größte Gate-Hülle über alle Drehungen, WSB N40) am Rezept-Ursprung; Gate r5 misst gleich",
   "note_v791": "gate_r_m für alle Kacheln aus WSB gate_hull_all.json (292 gemessen); Nachlauf Ü4/Ü3 prüft G1 nach jeder Änderung",
   "tree_overlap_p": 0.85
  },
  "nest": {
   "sizes": [
    1.0,
    0.62,
    0.38
   ],
   "counts": [
    1,
    3,
    [
     1,
     5
    ]
   ],
   "relax_out": [
    0.85,
    1.25
   ],
   "note": "V-749: 0,92 entfällt",
   "med": [
    -1.2,
    0.1,
    1.3
   ],
   "small": [
    -0.6,
    0.7,
    -2.0,
    2.05,
    3.1
   ],
   "k": 0.86,
   "spread": 1.75
  },
  "zone": {
   "groups": [
    2,
    4
   ],
   "neg_space_min": 0.3,
   "ratio_LMS": [
    1,
    3,
    9
   ],
   "landmark_front": 0.6,
   "rest_struct_meaning": [
    0.7,
    0.2,
    0.1
   ]
  },
  "contact": {
   "required": true,
   "cause_required": true,
   "perimeter": [
    0.4,
    0.5
   ],
   "gap_min": 0.25,
   "count_rule": null,
   "wreath": false,
   "tone": "hard_step",
   "tone_step_Lstar": [
    8,
    12
   ],
   "applies_to": "Anker und frei stehende Objekte; Stützen im Nest teilen den Kontakt des Ankers (V-763)",
   "tree_foot_ratio": 0.12,
   "tree_foot_min": 0.34,
   "note_v784": "Baum: Kontakt am Stammfuß (Kronen-Hüllradius × 0,12, mindestens 0,22 m); Stücke paarweise ungleich groß, radial ±12 % versetzt",
   "staffel": [
    1,
    0.62,
    0.38
   ],
   "piece_max_m": 0.22,
   "piece_ratio": 0.32,
   "note_v787": "Staffel L/M/S, Häufung hangab ≈ 65 % plus Nebenbogen ≈ 35 %, großes Stück in der Mitte (WSB N40 r7)",
   "note_v790": "Bäume: Kontakt um den gemessenen Stammfuß (Kachel foot_r_m, foot_off_m aus WSB gate_hull_p0, N40); Formel tree_foot_ratio/min nur ohne Messung",
   "piece_min_m": 0.06
  },
  "ordered": {
   "note": "Gebaute Ordnung (V-749 Nr. 6, V-512): Reihen erlaubt nach abgenommener Vorlage",
   "checks": [
    "penetration_0",
    "contact",
    "sink",
    "gap_min_m",
    "no_equal_neighbours"
   ],
   "gap_min_m": 1.2,
   "skip": [
    "odd",
    "collinear"
   ]
  },
  "gates_prefix": {
   "env": "ENV-",
   "proof_stage": "PS-"
  },
  "lean": {
   "lean_tol": 15,
   "lean_exc": [
    25,
    45
   ],
   "pebble_tilt": [
    15,
    0.2
   ],
   "grass_gap": 0.25,
   "primary_max": 3,
   "height_tol": 0.1,
   "focal_ring": 0.5,
   "interact_free_H": 1.0,
   "tree_lean": [
    0.2,
    0.4
   ],
   "ref": "CANON_3D/EINARBEITUNG_WS1_R1.md Ü1–Ü7"
  },
  "biography": {
   "layers_required": [
    1,
    2,
    3,
    4
   ],
   "signature": "1 Hero + 2 Echos",
   "wear_marks_min": 2
  },
  "grass": {
   "source": "SPEC_ENVIRONMENT_KIT_R1 §5/§6/§8; KayKit Forest Samples (Büschel zu 1–3 am Fuß von Stein, Baum, Busch)",
   "tiles": "kaykit_forest:Grass_*_Singlesided (Büschel, nie Einzelhalme)",
   "foot": {
    "count": {
     "anchor": 5,
     "landmark": 5,
     "focus": 5,
     "support": 3
    },
    "ratio": [
     1,
     0.62,
     0.38
    ],
    "ring_r": [
     0.8,
     1.1
    ],
    "side": "Licht- bzw. Hangfußseite, ein Bogen ≤ 50 %",
    "roles": [
     "anchor",
     "support",
     "landmark",
     "focus"
    ]
   },
   "field": {
    "noise_m": 16,
    "thresh": 0.6,
    "hollow_bonus": 0.15,
    "path_clear_m": 1.0,
    "neg_space_short": 0.6,
    "cause": "Sonne gibt Gras, Schatten gibt Moos (Konzeptblatt 2d)",
    "edge_soft": 0.12,
    "note": "Felder = zusammenhängende Flecken (Rauschen grob), innen dicht, zum Rand hin Sprenkel (V-403), außerhalb kein Gras",
    "patch_clusters": [
     3,
     5
    ],
    "cluster_tufts": {
     "core": 5,
     "edge": 3
    },
    "cluster_spacing_m": 0.9,
    "tuft_spacing_m": 0.22,
    "edge_spread": 1.6,
    "edge_short": 0.8,
    "fibonacci": "Feld 3 oder 5 Flecken; Fleck 3 Gruppen (5+5+3 = 13) oder 5 Gruppen (5+5+5+3+3 = 21); Gruppe 5 Kern bzw. 3 Rand; Fuß 5 am Anker, 3 an der Stütze. Alle Zahlen ungerade und Fibonacci (V-770)",
    "layout": "Vogel-Spirale (137,5°, Abstand ∝ √k) auf drei Ebenen: Flecken im Feld, Gruppen im Fleck, Büschel in der Gruppe",
    "field_grid_m": 16,
    "field_patches": [
     3,
     5
    ],
    "patch_spacing_m": 2.4
   },
   "wind": {
    "grid_m": 8,
    "max_groups": 64,
    "bend": {
     "grass": 1.0,
     "fluff": 0.5,
     "bush": 0.15,
     "tree": 0.35
    },
    "phase_jitter": 0.12,
    "note": "eine Gruppe = gleiche Grundphase, kleiner Versatz; Phase folgt der Position im Feld; Gruppe einzeln anstoßbar (Auto, Figur)"
   },
   "color": {
    "role": "grass",
    "steps": 3,
    "note": "Grundton aus dem Biom (Harmonie-Modell), je Büschel-Gruppe eine Stufe, je Büschel ±1 Stufe; flach cartoonig, kein Rausch-Verlauf"
   },
   "lean_max_deg": 14,
   "bauweise": {
    "source": "KFB Island Worldbuilder Lab/docs/biome-sheets/Bauweise_Erdung.jpg (Regel 3) + R2_etherington.jpg",
    "foot_side": {
     "stone": "Kehle bergauf, Bogen 30–50 %",
     "bush": "Sonnenseite unter der Kante",
     "tree": "Tropfkante 1,6–2,2 Kronenradien, unter der Krone dünn (75 % ausgelassen)",
     "other": "hangabwärts"
    },
    "lean": "vom Objekt weg und hangabwärts, 6–14°",
    "length": "Senke/Kehle lang (bis 1,3×), Kuppe kurz (bis 0,7×)"
   }
  },
  "oddity": {
   "source": "Etherington 70/20/10: die eine Bedeutung je Zelle; Georg 25.10. (V-770)",
   "max_per_cell": 1,
   "p_from": "params.surrealism (nur mit Karten-Dreier)",
   "place": "Rand des Negativraums (0,2–0,3 Zellgrößen von der Mitte, weg von den Gruppen), nie auf Weg oder in einer Gruppe",
   "kinds": {
    "stone_on_tip": "ein Stein balanciert auf der Spitze (rotX ≈ 1,1 rad), Kiesel am Fuß: wer hat den hingestellt?",
    "witch_ring": "13 Gras-Büschel als genauer Kreis (r 1,6 m), innen kahl: Hexenring",
    "cairn": "Steinmännchen aus 3 Steinkit-Steinen in der Leiter 1 : 0,62 : 0,38"
   },
   "path_clear_m": 3
  },
  "grove": {
   "mask_m": 110,
   "threshold": 0.53,
   "grove": {
    "groups": 4,
    "span": [
     0.33,
     0.67
    ],
    "minD": 0.16,
    "recipes": [
     [
      "tree_group"
     ],
     [
      "tree_group"
     ],
     [
      "tree_group",
      "bush_nest"
     ],
     [
      "bush_nest"
     ]
    ]
   },
   "meadow": {
    "group_p": 0.2,
    "recipes": [
     "stone_nest_slope",
     "bush_nest"
    ]
   },
   "note": "V-788 (Critic R1 Welt): Haine statt Konfetti. Zone 32 m: über der Schwelle ein Hain aus 3 Gruppen in der Zonenmitte (≈ 10–15 Bäume auf 15–20 m, Haine 30–40 m auseinander), sonst Wiese mit 20 % Chance auf ein Nest. Anteil Hain ≈ 35 %. V-791 (Critic R2): 4 Gruppen enger (Kronen überlappen), eine davon Busch-Nest als Unterwuchs; Fluff nur an ≈ 35 % der Gruppen."
  },
  "form_dna": {
   "exclude": [
    "Tree_3_",
    "Tree_4_",
    "Bush_4_",
    "rockpath_square",
    "pebble_square",
    "WoodLog_Moss"
   ],
   "note": "V-794 (WSB-Kritiker N40 Nr. 24/6): Konzeptblatt form_dna verbietet harte Kanten – keine Prismen-Nadelbäume, Würfelkronen, Würfelbüsche, eckigen Wegplatten"
  }
 },
 "bands": [
  {
   "band": 0,
   "s_m": [
    -0.1,
    0.7
   ],
   "groups_per_10m": 2.0,
   "anchor_size_m": [
    0.5,
    0.9
   ],
   "count": [
    5,
    7
   ],
   "terrain_stone_prob": 0.1
  },
  {
   "band": 1,
   "s_m": [
    0.9,
    3.0
   ],
   "groups_per_10m": 0.6,
   "anchor_size_m": [
    0.25,
    0.45
   ],
   "count": [
    3,
    5
   ],
   "terrain_stone_prob": 0.35
  },
  {
   "band": 2,
   "s_m": [
    3.0,
    6.0
   ],
   "groups_per_10m": 0.15,
   "anchor_size_m": [
    0.1,
    0.2
   ],
   "count": [
    3,
    3
   ],
   "terrain_stone_prob": 0.65,
   "downhill_only": true
  }
 ],
 "bands_tune_note": "N36-Startwerte (V-749 Nr. 8)",
 "embed": {
  "ref": "50_BLENDER/N36/data/n36_rules.r1.json",
  "schema": "kfb.embed-rules/1",
  "only_add": true,
  "rule": "V-716",
  "sop": {
   "note": "Georg 25.10. (V-753): Dünen-Logik und alles aus den Blender-Dioramen (Steine, Übergänge, Abschlüsse, Kontakt) ist Pflicht-SOP für jedes Prop, Diorama, jede Landmarke und jede andere Terrain-Einbettung",
   "steps": [
    "1 Fußabdruck und Maske aus der Kachel (hull, Eingänge)",
    "2 Düne/Schürze: nur auftragen, Profil Anschluss → Düne → Auslauf, Lee länger (Wind), Auslauf L = max(4–6 m, 3,75 × Auftragshöhe), Flanke ≤ 22° (n36 apron)",
    "3 Sockel 15–25 % vom Gelände bedeckt (V-396), keine Stufe > 2 cm an der Kontaktlinie (V-716)",
    "4 Eingänge frei: Rampe ≤ 15°, Breite ≥ 1,2 m (n36 entrance)",
    "5 Steinbänder in drei Ringen (n36 bands, Dichte nach V-749 Nr. 8), Steinkit v4, gerundet, Einsinken nach rules.sink",
    "6 Abschluss je Kante: freies Ende durch Verfall (V-578) oder gebautes Ende (kfb_edge); harte Kanten (Dungeon-Generator, Kachelfelder, Mauern, Plinthen) organisch abrunden (Knet-Rundung am Modell), dazu kleine Rubble- bzw. Ruinensteine mit Knet-Rundung wie Pfadsteine und Staub als sauberer Übergang, nur wo nötig (V-754)",
    "7 Kontakt-Geometrie mit Ursache (rules.contact), Moos/Kiesel/Erdkeil",
    "8 Bodenübergang als Sprenkel (V-403), nie Verlauf oder Linie",
    "9 Gate ENV-* auf dem Rezept"
   ],
   "sources": [
    "50_BLENDER/N36/data/n36_rules.r1.json",
    "CANON_3D/lib/kfb_edge_params.json",
    "50_BLENDER/STEINKIT",
    "50_BLENDER/K8",
    "50_BLENDER/B29"
   ]
  }
 },
 "edge": {
  "ref": "CANON_3D/lib/kfb_edge_params.json",
  "forms": [
   "free_end",
   "built_end",
   "ruin_end"
  ],
  "rule": "V-577",
  "rounding": {
   "note": "V-754: harte Kanten organisch abrunden, Rubble/Ruinensteine klein und gerundet, Staub als Übergang, nur wo nötig",
   "rubble_kind": "rubble",
   "dust_kind": "dust",
   "ref": "K8 offen: Ruinen-Brocken mit Knet-Rundung wie Pfadsteine"
  }
 },
 "wfc": {
  "allowed": [
   "slot_fill",
   "socket_modules",
   "transition_families",
   "corridor_gaps"
  ],
  "never": [
   "landmarks",
   "osm_buildings",
   "road_graph",
   "terrain_height",
   "global_nature_grid",
   "deform_kit_parts"
  ],
  "ground_transitions": "speckle (V-403)",
  "tries": 16,
  "fallback": "authored"
 },
 "fluff": {
  "ref": "50_BLENDER/B2/R2/CONCEPT_B2R2_FLUFF_GRAMMAR.md",
  "anchors_ref": "50_BLENDER/B2/kaykit-tree-fluff-anchors.v1.json",
  "levels": {
   "plant": {
    "hero_nest": 1,
    "side_nests": [
     0,
     2
    ],
    "side": "light_or_camera",
    "min_crown_h": 0.4
   },
   "nest": {
    "sizes": [
     1.0,
     0.62,
     0.38
    ],
    "counts": [
     1,
     3,
     [
      1,
      3
     ]
    ]
   }
  },
  "carriers": {
   "tree": "Krone, Lichtseite: 1 Hero-Nest + 0–2 Neben-Nester; je Nest 5–7 Kugeln (1 groß, 3 mittel, 1–3 klein; Bauweise 3–6 je Anker als Untergrenze)",
   "bush": "1–2 Nester, greifen unter den Rand",
   "bare_tree": null
  },
  "color": {
   "source": "sechs Story-Mode-Farben, satte Variante (V-292): Tragic #3e6a83, Comic #7a8d4a, Absurd #e9c14a, Heroic #d97c3a, Mystical #6b4e7d, Forbidden #a64670; auf grünem Laub nie Comic oder Tragic",
   "rule": "eine Farbe je Nest, Kontrast zum Träger, keine Zufallsfarbe je Kugel",
   "contrast_on_green": "Fluff aus dem Candy-Band gegenüber dem Laub (V-305), nie Oliv auf Grün",
   "zone_mix": {
    "main": 0.4,
    "other_min": 0.08,
    "status": "V-368 TBD, nicht P0"
   }
  },
  "harvest": {
   "basic": "gestaffelt nach V-423: im Schnitt 3 Schläge, 2 Schüsse oder 1 Explosion leeren einen Baum; Abwurf 1–2, dann 3–4, dann alle",
   "fall": "springt 2–3-mal, rollt hangabwärts (rollToRest)",
   "pickup": "bei Kontakt, Gesamt-Fluff im Spielstand",
   "cause_required": true
  },
  "variant": "B2-R2 Variante A als Startwert (TUNE an P0; Georg wählt am Bild)",
  "default_mode": "heroic",
  "default_mode_note": "ohne Karten-Dreier eine Farbe für alle Nester (P0-Brief: Heroic #d97c3a satt); eine Farbe je Nest, keine Zufallsfarbe je Kugel",
  "fallobst": {
   "balls": 2,
   "only": "Hero-Nest des ersten Baums",
   "rule": "rollToRest: hangabwärts in 0,3-m-Schritten bis Steigung < 1,5 % oder Hindernis (B2-R2-Grammatik)",
   "roll_steps": 8
  },
  "ring_tree": 0.35,
  "group_share": 0.35,
  "echo_dim": {
   "chroma": 0.9,
   "L": -0.1,
   "size": 0.75,
   "note": "V-795: Echo = gleicher Ton, dunkler und kleiner (kein zweiter Pfirsich-Ton); in P0 tragen nur die Anker Fluff"
  }
 },
 "finds": {
  "optional": true,
  "display": "15 cm über dem Boden, langsam drehend, sanftes Auf-und-ab; längliche Teile und Werkzeuge mit Stiel schräg 35° (V-450, V-453)",
  "pickup": "bei Kontakt",
  "placement": "nur mit Ursache aus der Ortsbiografie (Nutzen oder Vergehen), z. B. am Stumpf, unter dem Baum, am Wegrand",
  "per_cell_max": 1,
  "source": "Paket-Varianten, keine Eigenbauten (V-434, V-450): KayKit Restaurant/Resource Bits, Tiny Treats, KayKit RPG Tools; P0-Kandidat Axt (RPG Tools) oder Brotzeit (Tiny Treats Picnic)"
 },
 "recipes": [
  {
   "id": "tree_group",
   "biomes": [
    "moos"
   ],
   "slots": [
    {
     "role": "anchor",
     "kinds": [
      "tree"
     ],
     "h_rel": [
      1.2,
      1.4
     ],
     "layer": 1,
     "note": "alter Waldrand-Baum (Entstehen)"
    },
    {
     "role": "support",
     "kinds": [
      "tree",
      "tree",
      "bush"
     ],
     "count": 3,
     "h_rel": [
      0.7,
      0.9
     ],
     "note": "V-784: Stützen meist kleinere Bäume derselben Familie (Leiter 1 : 0,62 : 0,38), ein Busch; sonst liest sich der Waldrand als Einzelbaum"
    },
    {
     "role": "accent",
     "kinds": [
      "grass"
     ],
     "note": "KayKit Forest hat keinen mittleren Stein; Akzent als Gras-Büschel (ein Kit je Gruppe)"
    }
   ],
   "story_template": "Waldrand: der älteste Baum steht, die Büsche drängen ins Licht",
   "layer": 4,
   "fluff": true,
   "kit": "KayKit Forest"
  },
  {
   "id": "bush_nest",
   "biomes": [
    "moos"
   ],
   "slots": [
    {
     "role": "anchor",
     "kinds": [
      "bush"
     ]
    },
    {
     "role": "support",
     "kinds": [
      "bush"
     ],
     "count": 3,
     "note_v794": "kein Gras im Busch-Nest (piekt durch, B2)"
    },
    {
     "role": "pebble",
     "kinds": [
      "stone_S"
     ],
     "count": [
      1,
      3,
      5
     ]
    }
   ],
   "story_template": "Busch-Nest im Windschatten",
   "layer": 4,
   "fluff": true,
   "kit": "KayKit Forest",
   "odd_total": true
  },
  {
   "id": "stone_nest_slope",
   "biomes": [
    "moos"
   ],
   "slots": [
    {
     "role": "anchor",
     "kinds": [
      "stone_L"
     ]
    },
    {
     "role": "support",
     "kinds": [
      "stone_M"
     ],
     "count": 3
    },
    {
     "role": "pebble",
     "kinds": [
      "stone_S"
     ],
     "count": [
      1,
      5
     ]
    }
   ],
   "story_template": "Steine vom Hang gerollt, Moos in den Fugen",
   "layer": 3,
   "fluff": false,
   "kit": "Steinkit v4"
  },
  {
   "id": "stump_stamp",
   "biomes": [
    "moos"
   ],
   "fixed": true,
   "slots": [
    {
     "role": "focus",
     "kinds": [
      "stump"
     ]
    },
    {
     "role": "echo",
     "kinds": [
      "log"
     ],
     "count": 2,
     "s": 0.6,
     "note_v796": "Echo-Holz ≤ 60 % (Signatur: Stumpf ist Hero), kein bemooster Hohlstamm"
    }
   ],
   "story_template": "gefällter Stamm wird zum Stumpf, Moos wächst auf dem Schnitt, Fluff im Busch daneben",
   "layer": 3,
   "finds": false,
   "kit": "Quaternius Ultimate Nature (TreeStump, WoodLog, WoodLog_Moss; V-775) – Kenney nicht mehr",
   "echoes": "2 Holzstücke desselben Stamms in Wurfweite",
   "wear_marks": [
    "Sägeschnitt (flache Schnittfläche des Kits)",
    "Moos auf der Schnittfläche (Knet-Element)",
    "zwei Holzstücke desselben Stamms in Wurfweite"
   ],
   "cut_moss": true,
   "note_finds": "Fundstück entfällt in P0 (keine Kachel, kein eigener Slot außerhalb der Stumpf-Gruppe; V-775)"
  },
  {
   "id": "path_trace",
   "biomes": [
    "moos"
   ],
   "kit": "Steinkit v4 + KayKit path_A–path_D",
   "slots": [
    {
     "role": "path",
     "kinds": [
      "path_stone"
     ],
     "layout": "Spur vom Rand zum Stumpf"
    }
   ],
   "story_template": "Abfuhrweg: hier wurde der Stamm weggezogen, die Steine liegen verstreut",
   "layer": 2,
   "contact": true,
   "transition": "Sprenkel",
   "distribution": "V-578: heiler Kern bis zu einer geschwungenen Isolinie, dann verwittert gerundete Stücke dicht → locker (≈ 1,0 → 0,4 u, Fuge 3 → 31 cm), einzelne fehlen, Erde in der Lücke; organisch, keine Reihe",
   "tune": "Georg q201: Steine und organischer verteilte Kacheln bzw. Fragmente, kein Holz"
  }
 ],
 "biomes": {
  "moos": {
   "recipes": {
    "tree_group": 1.0,
    "bush_nest": 0.8,
    "stone_nest_slope": 0.6,
    "path_trace": 1.0
   },
   "kit": {
    "tree_group": "KayKit Forest",
    "bush_nest": "KayKit Forest",
    "stone_nest_slope": "Steinkit v4",
    "stump_stamp": "Quaternius Ultimate Nature",
    "path_trace": "Steinkit v4 + KayKit path_A–path_D"
   },
   "note": "P0; weitere Biome aus der Biom-Fahrt folgen mit P1",
   "fluid": "water",
   "zone_m": 32,
   "zone_note": "Laufzeit: eine Zone (2–4 Gruppen, rules.zone) misst 32 m; vier Zonen je 64-m-Zelle (V-784). P0 im CLI bleibt eine 64-m-Zelle."
  }
 },
 "adjacency": [],
 "palette": {
  "rule": "COLOR_HARMONY_R1 (V-305): eine OKLCH-Regel, der Boden trägt den Grundton; Strecke +90° warm, Blickfang gegenüber im Candy-Band, Laub natürlich bzw. herbstlich, Himmel = Laub +90°",
  "ref": "replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js",
  "input": "Boden-Farbton je Biom",
  "roles": [
   "ground",
   "track",
   "focus",
   "foliage",
   "sky",
   "stone",
   "fluff",
   "fluid",
   "fluid_foam"
  ],
  "applies_to": [
   "terrain (look=terrain3)",
   "fluff",
   "fluid",
   "props tint"
  ]
 },
 "fluids": {
  "note": "Georg 25.10. (V-750): Wasser bzw. Fluids gehören mit Gelände und Shader in dieselbe Farbharmonie; vorhandene Arten im Gelände-Shader (terrain3: Wasser, Kaugummi, Säure) als Rezepte",
  "kinds": {
   "water": {
    "tone": "fluid aus der Harmonie",
    "behaviour": "nasser Saum, Tiefenstufen"
   },
   "bubblegum": {
    "tone": "Candy-Band (rosa Schlieren)",
    "behaviour": "zähe Wellen, Blasen platzen langsam"
   },
   "acid": {
    "tone": "Gegenton zum Boden, giftig",
    "behaviour": "blubbert, Ufer verätzt"
   }
  },
  "owner": "WS1c",
  "shader": "ein Fluid-Shader, Art als Parameter, Licht aus dem einen Rig"
 },
 "gate_map_note": "Zuordnung alter kfb_env-Codes (G1, E2, C1, S4 …) zu ENV-* liefert WSB mit der Gate-Erweiterung (V-749 Nr. 9)",
 "terrain_dunes": {
  "note": "Sand-Dünen als Geländeform in Wüsten-Biomen gehören dem einen Höhen-Owner (WS1b, Biom-Fahrt); kfb-place liefert nur Rezepte und Einbettung darauf",
  "owner": "WS1b"
 },
 "masks": {
  "gaps": {
   "note": "Georg 25.10. (V-755): Lücken zwischen Straßen, Modellen und Gelände werden über Voronoi-Felder gefüllt",
   "method": "Voronoi über die Kanten von Straßen, Fußabdrücken und Stamps als Keime → Zellen = Lückenflächen mit Abstand zum nächsten Objekt (Distanzfeld/Mittelachse)",
   "use": [
    "je Zelle ein Füll-Rezept nach Ursache (Schatten → Moos, Abfluss → Kies, Sonne → Blüten/Gras, Hangfuß → Rubble)",
    "Dichte fällt zur Zellmitte bzw. steigt zur Kante je nach Ursache",
    "Platz für Kontakt-Geometrie und Kiesel"
   ],
   "never": [
    "sichtbares Zellmuster oder Linien an den Zellgrenzen",
    "Kachelmuster"
   ],
   "borders": "Sprenkel (V-403)",
   "status": "Konzept; Löser v2"
  }
 },
 "cards": {
  "source": "kfb-world-context.v1.mjs (1:1 aus Card Zone Lab terrain-v10/world-context.js): Karten-Dreier → 8-Achsen-Vektor (60/28/12) → Biom, Story-Mode, params.surrealism (V-770)",
  "biome_map": {
   "meadow": "moos",
   "plateau": "moos",
   "luminous": "moos",
   "tidal": "moos",
   "fractured": "moos",
   "scorched": "moos",
   "note": "bis weitere kfb-place-Biome existieren, landet alles auf moos; card_biome steht im Bericht"
  },
  "mode_from_dim": {
   "melancholy": "tragic",
   "humor": "comic",
   "chaos": "absurd",
   "power": "heroic",
   "wonder": "mystical",
   "threat": "forbidden"
  },
  "fluff_modes_on_green": [
   "forbidden",
   "heroic",
   "mystical",
   "absurd"
  ],
  "recipe_bias": {
   "tree_group": {
    "lore": 0.6,
    "melancholy": 0.4
   },
   "bush_nest": {
    "humor": 0.6,
    "wonder": 0.4
   },
   "stone_nest_slope": {
    "power": 0.5,
    "threat": 0.5
   }
  },
  "grass_density": {
   "base": 0.6,
   "wonder": 0.5,
   "humor": 0.5,
   "melancholy": 0.3,
   "threat": -0.4,
   "clamp": [
    0.4,
    1.6
   ]
  },
  "mode_rank": {
   "note": "Story-Mode kommt im Spiel aus dem Spielstand (Würfel bzw. Einstellung). Nur ohne Vorgabe wird er abgeleitet: Rang nach dem Wort-Anteil je Achse (Grundanteile aus cardSemanticVector abgezogen), sonst gewinnt Heroic fast immer über die Kartenstufe.",
   "lex": {
    "chaos": [
     0.08,
     0.82
    ],
    "wonder": [
     0.08,
     0.82
    ],
    "threat": [
     0.06,
     0.84
    ],
    "humor": [
     0.06,
     0.84
    ],
    "melancholy": [
     0.08,
     0.8
    ]
   },
   "power": {
    "base": 0.15,
    "grade": 0.55,
    "coef": 0.3
   },
   "triplet_w": [
    0.6,
    0.28,
    0.12
   ]
  }
 },
 "p0": {
  "bush_next_to_stamp": 1.8,
  "note": "P0-Konzept: Stumpf und Busch-Nest in der Mitte; Busch-Gruppe 4,5 m zur Sonnenseite des Stumpfs (V-777); Baumgruppe 18 m hangaufwärts vom Stumpf (V-778); V-787: Baumgruppe 9 m hangaufwärts (Hintergrund im Spielbild 35°/9,5 m), Steinnest 10 m hangab; V-789: Busch 0,9 rad seitlich zur Sonne, Baumgruppe gegengedreht (Dreieck), Weg vom Hangfuß an den Gruppen vorbei; V-794: Steinnest = Lesesteine 2,4 m neben der Spur bei 45 % vom Stumpf; V-795: Busch-Nest 1,8 m am Stumpf (ein Fokus), Fallobst aus dem Fokus-Nest, Lesesteine am steilsten Spurrand",
  "tree_uphill": 9,
  "triangle_turn": 0.9,
  "stone_nest_path": {
   "t": 0.45,
   "side_m": 2.4
  }
 },
 "light": {
  "sun_az": 2.498,
  "note": "Richtung zur Sonne in Rezept-Koordinaten (x,z), passend zu kfb_light_bpy mood day (az −53,13°): (−0,80 | +0,60). Löser (Busch-Sonnenseite, Fluff-Lichtseite, Gras) und Blender-Rig nutzen dieselbe Sonne (V-778)."
 },
 "_tiles_note": "289 Kacheln weggelassen (Liste im Repo); Beispiel siehe tiles_sample",
 "tiles_sample": [
  {
   "id": "kaykit_forest:Bush_1_A",
   "pack": "KayKit Forest Nature Pack 1.0 FREE",
   "path": "media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Bush_1_A_Color1.gltf",
   "kit": "KayKit Forest",
   "kind": "bush",
   "role": "support",
   "size_class": "M",
   "h_m": 0.1397,
   "h_H": 0.0623,
   "hull_r_m": 0.0823,
   "hull_r_H": 0.0367,
   "rest": "flat",
   "up": "+Y",
   "sink": [
    0.05,
    0.12
   ],
   "anchors": [],
   "fluff": "unter den Rand",
   "contact_family": "moss_grass",
   "biomes": [
    "moos"
   ],
   "asset_pass": {
    "clay": "kfb-clay.v1.1/midground",
    "eyes": "keine (keine Figur)",
    "licence": "CC0 (KayKit)",
    "deform": "nein (V-574)"
   },
   "tris": 72,
   "variant_note": null,
   "gate_r_m": 0.082
  },
  {
   "id": "kaykit_forest:Bush_1_B",
   "pack": "KayKit Forest Nature Pack 1.0 FREE",
   "path": "media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Bush_1_B_Color1.gltf",
   "kit": "KayKit Forest",
   "kind": "bush",
   "role": "support",
   "size_class": "M",
   "h_m": 0.2984,
   "h_H": 0.133,
   "hull_r_m": 0.2226,
   "hull_r_H": 0.0992,
   "rest": "flat",
   "up": "+Y",
   "sink": [
    0.05,
    0.12
   ],
   "anchors": [],
   "fluff": "unter den Rand",
   "contact_family": "moss_grass",
   "biomes": [
    "moos"
   ],
   "asset_pass": {
    "clay": "kfb-clay.v1.1/midground",
    "eyes": "keine (keine Figur)",
    "licence": "CC0 (KayKit)",
    "deform": "nein (V-574)"
   },
   "tris": 168,
   "variant_note": null,
   "gate_r_m": 0.223
  },
  {
   "id": "kaykit_forest:Bush_1_C",
   "pack": "KayKit Forest Nature Pack 1.0 FREE",
   "path": "media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Bush_1_C_Color1.gltf",
   "kit": "KayKit Forest",
   "kind": "bush",
   "role": "support",
   "size_class": "M",
   "h_m": 0.4977,
   "h_H": 0.2218,
   "hull_r_m": 0.3711,
   "hull_r_H": 0.1654,
   "rest": "flat",
   "up": "+Y",
   "sink": [
    0.05,
    0.12
   ],
   "anchors": [],
   "fluff": "unter den Rand",
   "contact_family": "moss_grass",
   "biomes": [
    "moos"
   ],
   "asset_pass": {
    "clay": "kfb-clay.v1.1/midground",
    "eyes": "keine (keine Figur)",
    "licence": "CC0 (KayKit)",
    "deform": "nein (V-574)"
   },
   "tris": 168,
   "variant_note": null,
   "gate_r_m": 0.371
  },
  {
   "id": "kaykit_forest:Bush_1_D",
   "pack": "KayKit Forest Nature Pack 1.0 FREE",
   "path": "media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Bush_1_D_Color1.gltf",
   "kit": "KayKit Forest",
   "kind": "bush",
   "role": "support",
   "size_class": "M",
   "h_m": 0.6125,
   "h_H": 0.273,
   "hull_r_m": 0.4829,
   "hull_r_H": 0.2152,
   "rest": "flat",
   "up": "+Y",
   "sink": [
    0.05,
    0.12
   ],
   "anchors": [],
   "fluff": "unter den Rand",
   "contact_family": "moss_grass",
   "biomes": [
    "moos"
   ],
   "asset_pass": {
    "clay": "kfb-clay.v1.1/midground",
    "eyes": "keine (keine Figur)",
    "licence": "CC0 (KayKit)",
    "deform": "nein (V-574)"
   },
   "tris": 168,
   "variant_note": null,
   "gate_r_m": 0.483
  },
  {
   "id": "kaykit_forest:Bush_1_E",
   "pack": "KayKit Forest Nature Pack 1.0 FREE",
   "path": "media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Bush_1_E_Color1.gltf",
   "kit": "KayKit Forest",
   "kind": "bush",
   "role": "support",
   "size_class": "M",
   "h_m": 0.4983,
   "h_H": 0.2221,
   "hull_r_m": 0.5642,
   "hull_r_H": 0.2515,
   "rest": "flat",
   "up": "+Y",
   "sink": [
    0.05,
    0.12
   ],
   "anchors": [],
   "fluff": "unter den Rand",
   "contact_family": "moss_grass",
   "biomes": [
    "moos"
   ],
   "asset_pass": {
    "clay": "kfb-clay.v1.1/midground",
    "eyes": "keine (keine Figur)",
    "licence": "CC0 (KayKit)",
    "deform": "nein (V-574)"
   },
   "tris": 552,
   "variant_note": null,
   "gate_r_m": 0.495
  },
  {
   "id": "kaykit_forest:Bush_1_F",
   "pack": "KayKit Forest Nature Pack 1.0 FREE",
   "path": "media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Bush_1_F_Color1.gltf",
   "kit": "KayKit Forest",
   "kind": "bush",
   "role": "support",
   "size_class": "M",
   "h_m": 0.6125,
   "h_H": 0.273,
   "hull_r_m": 0.8167,
   "hull_r_H": 0.364,
   "rest": "flat",
   "up": "+Y",
   "sink": [
    0.05,
    0.12
   ],
   "anchors": [],
   "fluff": "unter den Rand",
   "contact_family": "moss_grass",
   "biomes": [
    "moos"
   ],
   "asset_pass": {
    "clay": "kfb-clay.v1.1/midground",
    "eyes": "keine (keine Figur)",
    "licence": "CC0 (KayKit)",
    "deform": "nein (V-574)"
   },
   "tris": 576,
   "variant_note": null,
   "gate_r_m": 0.722
  }
 ]
}
```


## kfb-place-core.v1.mjs

```js
// kfb-place-core v1 · Löser des Kern-Moduls kfb-place (V-748, Regeln V-749, SOP V-753) · WS0 25.10.2026
// Rein und deterministisch über den Seed: kein three.js, kein bpy. Liest kfb_place.r1.json (kfb.place/1), gibt ein Rezept kfb.place-recipe/1 aus.
// Blender-Adapter (WSB) und Laufzeit-Adapter (WS1b, veg=core) instanziieren nur; kfb_env.gate prüft dasselbe Rezept.
// Grenzen (V-708, V-749 Nr. 5): WFC nur lokal für die Slot-Belegung (solveLocal); nie Landmarken, Gelände oder ein globales Natur-Raster.

// ── Zufall: mulberry32 über einen Hash aus Seed + Zelle (gleicher Seed = gleiches Rezept) ──
import { makeWorldContext } from './kfb-world-context.v1.mjs'

const hash32 = (s) => { let h = 2166136261 >>> 0; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0 } return h }
export function rng(seed) {
  let a = hash32(seed)
  const next = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  return { next, range: (lo, hi) => lo + (hi - lo) * next(), int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)), pick: (arr) => arr[Math.floor(next() * arr.length)],
    weighted: (obj) => { const e = Object.entries(obj); const tot = e.reduce((s, [, w]) => s + w, 0); let r = next() * tot; for (const [k, w] of e) { if ((r -= w) <= 0) return k } return e[e.length - 1][0] } }
}

// ── Kacheln: gemessene Teile aus rules.tiles; solange WSB nicht gemessen hat, Platzhalter je Art (als solche markiert) ──
const PLACEHOLDER = { tree: { h: 4.2, r: 1.6 }, bush: { h: 1.1, r: 0.8 }, grass: { h: 0.35, r: 0.25 }, stone_L: { h: 1.0, r: 0.9 }, stone_M: { h: 0.55, r: 0.5 },
  stone_S: { h: 0.22, r: 0.2 }, path_stone: { h: 0.12, r: 0.45 }, prop: { h: 0.8, r: 0.7 }, contact: { h: 0.15, r: 0.15 } }
function tilesFor(cfg, kind, kit) {
  const FX = cfg.rules?.form_dna?.exclude || [], t = (cfg.tiles || []).filter((x) => x.kind === kind && (!kit || !x.kit || kit.startsWith(x.kit)) && !FX.some((q) => x.id.includes(q)))   // V-794: Form-DNA (keine Prismen, Würfel, Platten)
  if (t.length) return t.map((x) => ({ id: x.id, kind, h: x.h_m ?? x.h_H * cfg.units.m_per_H, r: x.gate_r_m ?? x.hull_r_m ?? x.hull_r_H * cfg.units.m_per_H, footR: x.foot_r_m, footOff: x.foot_off_m, anchors: x.anchors || [],   /* V-790: gemessene Gate-Hülle zuerst */ placeholder: false }))
  const p = PLACEHOLDER[kind] || PLACEHOLDER.prop
  return [0, 1, 2].map((i) => ({ id: `placeholder:${kind}:${i}`, kind, h: p.h * (1 - 0.12 * i), r: p.r * (1 - 0.1 * i), anchors: kind === 'tree' ? [{ p: [0, 0.8, 0], n: [0, 1, 0] }] : [], placeholder: true }))
}

// ── Gelände: h(x,z) kommt vom Höhen-Owner (Spiel bzw. Höhenfeld-Export); Hang und Gefälle numerisch ──
const grad = (terrain, x, z, e = 0.5) => [(terrain.h(x + e, z) - terrain.h(x - e, z)) / (2 * e), (terrain.h(x, z + e) - terrain.h(x, z - e)) / (2 * e)]

// ── solveLocal: lokales WFC für die Slots einer Gruppe ──
// Domänen = passende Kacheln je Slot; Constraints: Größenstaffel 1 : 0,62 : 0,38 (± size_tol), keine Klone, Wiederholung ≤ repeat_max.
// Belegt den Slot mit der kleinsten Domäne zuerst (niedrigste Entropie), bei Widerspruch Neuversuch (tries), sonst Autoren-Rückfall.
export function solveLocal(slots, R, rules, tries = 16) {
  const sizes = rules.group.sizes, tol = rules.group.size_tol
  for (let t = 0; t < tries; t++) {
    const used = {}, out = new Array(slots.length)
    const order = slots.map((s, i) => i).sort((a, b) => slots[a].domain.length - slots[b].domain.length || a - b)
    let ok = true
    for (const i of order) {
      const s = slots[i], target = sizes[Math.min(s.tier, sizes.length - 1)]
      const cand = s.domain.filter((d) => (used[d.id] || 0) < rules.group.repeat_max)
      if (!cand.length) { ok = false; break }
      const d = R.pick(cand); used[d.id] = (used[d.id] || 0) + 1
      const scale = Math.max(1 - 0.15, Math.min(1 + 0.15, target * (1 + R.range(-tol, tol)) * (s.baseH / d.h)))   // Kit-Teil nie verformen: nur ±15 % Gleichmaß
      out[i] = { tile: d, s: +scale.toFixed(3) }
    }
    if (ok) { const ht = rules.lean?.height_tol ?? 0.1, H = (f) => f.tile.h * f.s   // Ü3: benachbarte Höhen um ≥ height_tol verschieden (nur Gleichmaß ±15 %)
      const idx = out.map((f, i) => i).filter((i) => slots[i].role === 'support' || slots[i].role === 'accent').sort((a, b) => H(out[a]) - H(out[b]))
      for (let k = 1; k < idx.length; k++) { const lo = out[idx[k - 1]], hi = out[idx[k]], need = H(lo) / (1 - ht) * 1.01; if (H(hi) < need) hi.s = +Math.min(1.15, need / hi.tile.h).toFixed(3) }   /* V-763: Maß wie das Gate */
      // V-768: Radien-Leiter je Rolle (Stützen, Kiesel): Nachbarn im Nest um ≥ 22 % verschieden (Gate sameSizeAdjacent < 20 %); erst Gleichmaß (±15 %),
      // dann eine größere Kachel derselben Domäne, zuletzt die kleinere verkleinern
      for (const role of ['support', 'pebble']) { const ix = out.map((f, i) => i).filter((i) => slots[i].role === role).sort((a, b) => out[a].tile.r * out[a].s - out[b].tile.r * out[b].s)
        for (let k = 1; k < ix.length; k++) { const lo = out[ix[k - 1]], hi = out[ix[k]], need = lo.tile.r * lo.s * 1.22
          if (hi.tile.r * hi.s >= need) continue
          if (hi.tile.r * 1.15 >= need) { hi.s = +Math.max(hi.s, need / hi.tile.r).toFixed(3); continue }
          const big = slots[ix[k]].domain.filter((d) => d.r * 0.85 >= need).sort((x, y) => x.r - y.r)[0]; if (big) { hi.tile = big; hi.s = +Math.max(0.85, need / big.r).toFixed(3); continue }
          lo.s = +Math.max(0.85, (hi.tile.r * hi.s) / 1.22 / lo.tile.r).toFixed(3) } }
      // V-792 · Ü4 wie das Gate: Stämme der Gruppe in Dicken-Reihenfolge, (b − a) / b ≥ 0,22 wie das Gate (foot_r × s); erst Gleichmaß, dann eine dickere Kachel derselben Domäne
      const tr = out.map((f, i) => i).filter((i) => slots[i].kind === 'tree' && out[i].tile.footR).sort((a, b) => out[a].tile.footR * out[a].s - out[b].tile.footR * out[b].s)
      for (let k = 1; k < tr.length; k++) { const lo = out[tr[k - 1]], hi = out[tr[k]], need = lo.tile.footR * lo.s * 1.28   // Gate-Maß (b − a) / b ≥ 0,2, Rand 0,22 → b ≥ a / 0,78
        if (hi.tile.footR * hi.s >= need) continue
        if (hi.tile.footR * 1.15 >= need) { hi.s = +Math.max(hi.s, need / hi.tile.footR).toFixed(3); continue }
        const big = slots[tr[k]].domain.filter((d) => d.footR && d.footR * 0.85 >= need).sort((x, y) => x.footR - y.footR)[0]; if (big) { hi.tile = big; hi.s = +Math.max(0.85, need / big.footR).toFixed(3); continue }
        lo.s = +Math.max(0.85, (hi.tile.footR * hi.s) / 1.28 / lo.tile.footR).toFixed(3) }
      // V-793 · Ü4 und Ü3 der Bäume (und Ü3 der Büsche) gemeinsam (die Leiter allein schob Höhen gleich bzw. stieß an ±15 %): passt die Gruppe nicht, Kachel und Gleichmaß der
      // Baum-Slots neu würfeln, bis Stämme in Dicken-Reihenfolge (b − a) / b ≥ 0,22, Höhen paarweise ≥ 11 % verschieden und der Anker der höchste ist
      for (const pk of ['tree', 'bush']) {   // V-793: Bäume (mit Stamm-Leiter) und Büsche (nur Höhen) je für sich
        const ti = out.map((f, i) => i).filter((i) => slots[i].kind === pk && (pk !== 'tree' || out[i].tile.footR))
        const plantsOk = () => { const hs = ti.map((i) => out[i].tile.h * out[i].s)
          if (pk === 'tree') { const fr = ti.map((i) => out[i].tile.footR * out[i].s).sort((a, b) => a - b); for (let k = 1; k < fr.length; k++) if ((fr[k] - fr[k - 1]) / fr[k] < 0.22) return false }
          for (let a = 0; a < hs.length; a++) for (let b = a + 1; b < hs.length; b++) if (Math.min(hs[a], hs[b]) / Math.max(hs[a], hs[b]) > 0.89) return false
          const ai = ti.find((i) => slots[i].role === 'anchor'); return ai == null || ti.every((i) => i === ai || out[i].tile.h * out[i].s < out[ai].tile.h * out[ai].s) }
        if (ti.length > 1 && !plantsOk()) { const keep = ti.map((i) => out[i]); let found = false
          for (let a = 0; a < 400 && !found; a++) { for (const i of ti) { const dom = slots[i].domain.filter((d) => pk !== 'tree' || d.footR); if (dom.length) out[i] = { tile: R.pick(dom), s: +R.range(0.85, 1.15).toFixed(3) } } found = plantsOk() }
          if (!found) ti.forEach((i, k) => { out[i] = keep[k] }) } }
      return { fill: out, tries: t + 1, fallback: false } }
  }
  return { fill: slots.map((s) => ({ tile: s.domain[0], s: 1 })), tries, fallback: true }
}

// ── Nest: Stützen und Kiesel eng um den Anker (V-749 Nr. 7): Abstand je Paar entweder überlappt (≤ 0,85 × Radiensumme) oder mit Luft (≥ 1,25 ×),
// nie dazwischen; Stützen im Fächer, Kiesel hangabwärts; Nachbarabstände paarweise ≥ 30 % verschieden. Positionen relativ zum Anker.
function nestPositions(R, radii, rules, slopeDir, pOver = 0.55) {
  const mg = rules.group.band_margin ?? 0, ov = rules.group.overlap_max * (1 - mg), air = rules.group.air_min * (1 + mg), out = [[0, 0]], hosted = new Set()   // V-789: Rand gegen ±8 % Hüllen-Unterschied Löser/Gate
  const okAt = (p, i) => { let nj = -1, nd = Infinity
    for (let j = 0; j < out.length; j++) { const dd = Math.hypot(p[0] - out[j][0], p[1] - out[j][1]), s = radii[j] + radii[i]; if (dd < 0.5 * s || (dd > ov * s && dd < air * s)) return false; if (dd < nd) { nd = dd; nj = j } }
    return nj < 0 || Math.abs(radii[nj] - radii[i]) / Math.max(radii[nj], radii[i]) >= (rules.group.size_tol ?? 0.2) * (1 + 2 * mg) }   /* V-787 (WSB N40 r7 2): nächster Nachbar nie gleich groß */
  const colinear = (p) => { for (let a = 0; a < out.length; a++) for (let b = a + 1; b < out.length; b++) { const [ax, az] = out[a], [bx, bz] = out[b], acx = bx - ax, acz = bz - az, L2 = acx * acx + acz * acz; if (!L2) continue
      for (const [m, c, d] of [[p, out[a], out[b]], [out[a], p, out[b]], [out[b], p, out[a]]]) { const ux = d[0] - c[0], uz = d[1] - c[1], l2 = ux * ux + uz * uz; if (!l2) continue; const vx = m[0] - c[0], vz = m[1] - c[1], tt = (vx * ux + vz * uz) / l2
        if (tt > 0 && tt < 1 && Math.hypot(vx - ux * tt, vz - uz * tt) <= (rules.group.line_tol ?? 0.05) * Math.sqrt(l2) * 1.5) return true } } return false }
  for (let i = 1; i < radii.length; i++) {
    const pebble = radii[i] < radii[0] * 0.3
    // Kiesel (V-768): an einen größeren, noch freien Wirt gelehnt (überlappt ≤ 0,85), hangabwärts – so ist der nächste Nachbar nie ein gleich großer Kiesel
    const hosts = out.map((q, j) => j).filter((j) => radii[j] > radii[i] * 1.6), freeHosts = hosts.filter((j) => !hosted.has(j))
    let best = null
    for (let k = 0; k < 80 && !best; k++) {
      const host = pebble ? R.pick(freeHosts.length ? freeHosts : hosts.length ? hosts : [0]) : (R.next() < 0.7 ? 0 : R.int(0, out.length - 1))
      const rs = radii[host] + radii[i], f = pebble ? R.range(0.62, ov) : (R.next() < pOver ? R.range(0.62, ov) : R.range(air, air + 0.35))
      const a = pebble ? slopeDir + R.range(-1.1, 1.1) : R.range(0, Math.PI * 2), p = [out[host][0] + Math.cos(a) * f * rs, out[host][1] + Math.sin(a) * f * rs]
      if (okAt(p, i) && !colinear(p)) { best = p; if (pebble) hosted.add(host) }
    }
    // Rückfall: spiralförmig nach außen, bis Abstand und Gerade stimmen (nie zwei Glieder auf denselben Punkt)
    for (let k = 0; !best && k < 400; k++) { const a = k * 2.399 + R.next() * 0.3, dist = (radii[0] + radii[i]) * (air + 0.02 * k), p = [Math.cos(a) * dist, Math.sin(a) * dist]; if (okAt(p, i) && !colinear(p)) best = p }
    out.push(best || [(radii[0] + radii[i]) * (air + 2), i])
  }
  return out
}

// ── Gruppen-Prüfer wie das Gate (kfb_env.rule_report r3): odd, sameSizeAdjacent, neighbourSpread (ab n = 3), collinear, nearTouch ──
export function ruleReport(P, r, R) {
  const n = P.length, d = (a, b) => Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1]), nn = [], nnd = []
  for (let i = 0; i < n; i++) { let bj = -1, bd = Infinity; for (let j = 0; j < n; j++) if (j !== i && d(i, j) < bd) { bd = d(i, j); bj = j } nn.push(bj); nnd.push(bd) }
  let same = 0; const seen = new Set()
  for (let i = 0; i < n; i++) { const j = nn[i]; if (j < 0) continue; const k = Math.min(i, j) + ':' + Math.max(i, j); if (seen.has(k)) continue; seen.add(k); if (Math.abs(r[i] - r[j]) / Math.max(r[i], r[j]) < R.size_tol) same++ }
  const fin = nnd.filter(Number.isFinite), mx = fin.length ? Math.max(...fin) : 0, spread = fin.length >= 3 && mx > 0 ? (mx - Math.min(...fin)) / mx : 1
  const near = (a, b) => d(a, b) <= (R.neighbour_r ?? 4.5) * (r[a] + r[b]) / 2; let lines = 0
  for (let m = 0; m < n; m++) for (let a = 0; a < n; a++) { if (a === m || !near(a, m)) continue; for (let c = a + 1; c < n; c++) { if (c === m || !near(c, m)) continue
    const acx = P[c][0] - P[a][0], acy = P[c][1] - P[a][1], L2 = acx * acx + acy * acy; if (L2 <= 0) continue; const amx = P[m][0] - P[a][0], amy = P[m][1] - P[a][1], t = (amx * acx + amy * acy) / L2
    if (t > 0 && t < 1 && Math.hypot(amx - acx * t, amy - acy * t) <= (R.line_tol ?? 0.05) * Math.sqrt(L2)) lines++ } }
  let touch = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const q = d(i, j) / (r[i] + r[j]); if (q > R.overlap_max && q < R.air_min) touch++ }
  const failed = [['odd', n % 2 === 0], ['sameSizeAdjacent', same > 0], ['neighbourSpread', spread < (R.spread_pair_min ?? 0.3)], ['collinear', lines > 0], ['nearTouch', touch > 0]].filter((x) => x[1]).map((x) => x[0])
  return { n, same, spread: +spread.toFixed(3), lines, touch, ok: !failed.length, failed, score: same + lines + touch + (spread < (R.spread_pair_min ?? 0.3) ? 1 : 0) + (n % 2 === 0 ? 5 : 0) }
}

// ── Zone: 2–4 Gruppenkeime auf der Maske, Mindestabstand, Negativraum bleibt frei ──
function zoneSeeds(R, chunk, rules, masks) {
  const [gMin, gMax] = rules.zone.groups, n = masks.groups ?? R.int(gMin, gMax), out = [], minD = chunk.size * (masks.minD ?? 0.28), [s0, s1] = masks.span ?? [0.12, 0.88]   // V-788: Hain = enge Keime
  for (let k = 0; out.length < n && k < 200; k++) {
    const p = [chunk.x0 + R.range(s0, s1) * chunk.size, chunk.z0 + R.range(s0, s1) * chunk.size]
    if (masks?.blocked?.(p[0], p[1])) continue
    if (out.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < minD)) continue
    out.push(p)
  }
  return out
}

const sinkFor = (rules, kind, slope = 0) => { const s = rules.sink[kind] || [0, 0.05]; return Math.min(rules.sink_cap, s[0] + (s[1] - s[0]) * Math.min(1, slope * 2)) }

// Karten-Kontext (V-770): Vektor aus kfb-world-context; Story-Mode aus der stärksten Achse, falls nicht gesetzt; Fluff auf grünem Laub nie Comic/Tragic
function cardContext(C, cardTriplet, storyMode, seed) {
  const pre = makeWorldContext({ cardTriplet, seeds: [seed] }), v = pre.vector
  const MR = C.mode_rank, tri = [cardTriplet.current, cardTriplet.next || cardTriplet.current, cardTriplet.nextNext || cardTriplet.next || cardTriplet.current]
  const gp = tri.reduce((s, c, k) => s + MR.triplet_w[k] * (1 - (Math.max(1, Math.min(3, +(c?.grade) || 2)) - 1) / 2), 0)
  const share = (d) => (d === 'power' ? (v.power - MR.power.base - MR.power.grade * gp) / MR.power.coef : (v[d] - MR.lex[d][0]) / MR.lex[d][1])   // Wort-Anteil je Achse
  const ranked = Object.entries(C.mode_from_dim).map(([dim, m]) => [m, share(dim)]).sort((a, b) => b[1] - a[1])
  const mode = storyMode || ranked[0][0], wc = makeWorldContext({ cardTriplet, storyMode: mode, seeds: [seed] })
  const fluffMode = C.fluff_modes_on_green.includes(mode) ? mode : ranked.find(([m]) => C.fluff_modes_on_green.includes(m))[0]
  const gd = C.grass_density, grassDensity = Math.min(gd.clamp[1], Math.max(gd.clamp[0], gd.base + Object.entries(gd).filter(([k]) => k in v).reduce((s, [k, c]) => s + c * v[k], 0)))
  const bias = (rid) => 0.5 + Object.entries(C.recipe_bias[rid] || {}).reduce((s, [k, c]) => s + c * (v[k] ?? 0), 0)
  return { wc, mode, fluffMode, grassDensity, bias }
}

// ── Hauptfunktion: eine Zelle ──
// ── V-788 Hain-Ebene über den Zonen (Critic R1 Welt: „Konfetti statt Haine“): ein Wert-Rauschen im Maßstab rules.grove.mask_m entscheidet je Zone
// Hain (über der Schwelle: nur Baumgruppen und Busch-Nest, enge Keime, eine Lichtung dazwischen) oder Wiese (meist leer, selten ein Nest). Rein aus Seed und Ort.
export function grovePlan(cfg, seed, x, z) {
  const G = cfg.rules.grove; if (!G) return null
  const s = G.mask_m, sm = (t) => t * t * (3 - 2 * t), v = (a, b) => (hash32(`${seed}|grove|${a}|${b}`) % 10007) / 10007
  const oct = (m) => { const ix = Math.floor(x / m), iz = Math.floor(z / m), fx = sm(x / m - ix), fz = sm(z / m - iz), a = v(ix, iz), b = v(ix + 1, iz), c = v(ix, iz + 1), e = v(ix + 1, iz + 1); return a + (b - a) * fx + (c - a) * fz + (a - b - c + e) * fx * fz }
  const g = 0.7 * oct(s) + 0.3 * oct(s * 0.43), R = rng(`${seed}|zone|${Math.round(x)}|${Math.round(z)}`)
  if (g > G.threshold) return { kind: 'grove', masks: { groups: G.grove.groups, span: G.grove.span, minD: G.grove.minD }, recipeList: G.grove.recipes.map((l) => R.pick(l)) }
  if (R.next() < G.meadow.group_p) return { kind: 'meadow', masks: { groups: 1 }, recipeList: [R.pick(G.meadow.recipes)] }
  return { kind: 'meadow', masks: { groups: 0 }, recipeList: [] }
}

export function placeChunk({ cfg, seed, chunk, terrain, biome = 'moos', masks = {}, stamps = [], recipeList = null, cardTriplet = null, storyMode = null }) {   // recipeList: feste Gruppenfolge (P0), sonst nach Biom-Gewicht
  // Karten-Seed (V-770): Dreier → Vektor → Biom, Story-Mode, Dichte, Regelbruch (kfb-world-context 1:1 aus dem Card Zone Lab)
  const C = cfg.cards, card = cardTriplet && C ? cardContext(C, cardTriplet, storyMode, seed) : null
  if (card) biome = C.biome_map[card.wc.biome] || biome
  const rules = cfg.rules, B = cfg.biomes[biome], R = rng(`${seed}|${chunk.x0}|${chunk.z0}|${biome}${card ? '|' + card.wc.seed : ''}`)
  const recipes = Object.fromEntries(cfg.recipes.map((r) => [r.id, r])), inst = [], report = [], layers = new Set()
  const push = (o) => { inst.push(o); if (o.layer) layers.add(o.layer); return o }
  let fallen = false
  const put = (tile, x, z, extra) => { const [gx, gz] = grad(terrain, x, z); const slope = Math.hypot(gx, gz)
    return push({ tile: tile.id, kind: tile.kind, placeholder: tile.placeholder, p: [+x.toFixed(3), +terrain.h(x, z).toFixed(3), +z.toFixed(3)], rotY: +R.range(0, Math.PI * 2).toFixed(3), sink: +sinkFor(rules, tile.kind, slope).toFixed(3), ...extra }) }

  // Kontakt-Bögen mit Ursache an einem Objekt (V-749 Nr. 3, V-763): zwei Bögen auf 40–50 % des Umfangs, Lücke ≥ 25 %; gilt für Anker und frei stehende Objekte (auch Stamps, V-777)
  const contactArcs = (anc, objR, grp, down, cause) => { if (!anc) return 0
    // V-791 (WSB N40 r11): längliche Kacheln (kind log oder Kachel long_axis) bekommen den Kontakt als zwei kleine Häufchen L/M/S an den Stirnenden, hangab versetzt –
    // ein Bogen um die runde Hülle läge entlang der Längskante als Perlenschnur. Längsachse aus Kachel long_axis (Standard x), gedreht wie die Instanz.
    { const tt = (cfg.tiles || []).find((t) => t.id === anc.tile), hh = tt?.h_m ?? 0, ST = rules.contact.staffel ?? [1, 0.62, 0.38]
      if (anc.kind === 'log' || tt?.long_axis) {   /* V-792: flache Steine (h < r) sind kein Holz */ const ry = anc.rotY || 0, ax = tt?.long_axis === 'z' ? [Math.sin(ry), Math.cos(ry)] : [Math.cos(ry), -Math.sin(ry)],   /* Kachel-Feld long_axis 'x' | 'z' (Quaternius-Holz: z) */ hl = objR * 0.85, rL = Math.min(rules.contact.piece_max_m ?? 0.22, Math.max(0.06, (hh || 0.4) * 0.3)), dv = [Math.cos(down), Math.sin(down)]
        for (const e of [1, -1]) { const ex = anc.p[0] + ax[0] * hl * e, ez = anc.p[2] + ax[1] * hl * e
          ST.forEach((f, k) => { const a = down + (k - 1) * 0.9 + R.range(-0.2, 0.2), d = (hh || 0.4) * 0.45 + rL * f
            push({ tile: 'contact:moss_pebble', kind: 'contact', r: +(rL * f * R.range(0.9, 1.1)).toFixed(3), p: [ex + Math.cos(a) * d + dv[0] * 0.05, anc.p[1], ez + Math.sin(a) * d + dv[1] * 0.05], rotY: R.range(0, 6.28), sink: rules.sink.contact[0], group: grp, role: 'contact', cause, layer: 4 }) }) }
        return 0 } }
    let cx = anc.p[0], cz = anc.p[2]
    if (anc.kind === 'tree') { const ft = (cfg.tiles || []).find((t) => t.id === anc.tile), sc = anc.s ?? 1
      if (ft?.foot_r_m) { objR = ft.foot_r_m * sc; const [ox, oz] = ft.foot_off_m || [0, 0], ry = anc.rotY || 0; cx += (ox * Math.cos(ry) + oz * Math.sin(ry)) * sc; cz += (-ox * Math.sin(ry) + oz * Math.cos(ry)) * sc }   /* V-790: gemessener Stammfuß (WSB-Tabelle), Bogen um dessen Mitte */
      else objR = Math.max(rules.contact.tree_foot_min ?? 0.22, objR * (rules.contact.tree_foot_ratio ?? 0.12)) }   /* V-784: ohne Messung Formel am Stammfuß */
    // V-787 (WSB N40 r7 B): Staffel L/M/S statt Perlen, Häufung hangab (≈ 65 %) plus kleiner Nebenbogen seitlich (≈ 35 %); je Bogen das große Stück
    // in der Mitte, zu den Enden kleiner. Abdeckung = Summe der Winkelbreiten (Gate-Maß) in rules.contact.perimeter, größte Lücke ≥ gap_min.
    const [p0, p1] = rules.contact.perimeter, cov = R.range(p0 + 0.025, p1 - 0.035), Rr = objR * 1.02, ST = rules.contact.staffel ?? [1, 0.62, 0.38]   // V-792: Rand zur Gate-Grenze
    const rL = Math.max(rules.contact.piece_min_m ?? 0.06, Math.min(rules.contact.piece_max_m ?? 0.22, Rr * (rules.contact.piece_ratio ?? 0.32))),   /* V-795: am dünnen Stamm sichtbar */ wOf = (r) => 2 * Math.asin(Math.min(0.99, r / Rr))
    const side = down + (R.next() < 0.5 ? 1 : -1) * R.range(1.9, 2.4), bows = [[0.65, down + R.range(-0.2, 0.2), []], [0.35, side, []]]
    for (const [share, , list] of bows) { const target = cov * Math.PI * 2 * share; let acc = 0
      for (let k = 0; acc < target * 0.97; k++) { const r = Math.max((rules.contact.piece_min_m ?? 0.06) * 0.7, rL * ST[k === 0 ? 0 : k < 3 ? 1 : 2] * R.range(0.9, 1.1)); if (list.length && acc + wOf(r) > target * 1.06) break; list.push(r); acc += wOf(r) } }   // V-796b: Stückgröße nach unten begrenzt
    const covNow = () => bows.reduce((t, b) => t + b[2].reduce((u, r) => u + wOf(r), 0), 0) / (Math.PI * 2)
    const cap = p1 - 0.02; while (covNow() > cap) { const b = bows[1][2].length > 1 ? bows[1][2] : bows[0][2].length > 1 ? bows[0][2] : null; if (!b) break; b.splice(b.indexOf(Math.min(...b)), 1) }   // V-796c: nie über p1 − 0,02 (Mindeststücke am dünnen Stamm, WSB r30: 53 %)
    for (let it = 0; covNow() > cap && it < 30; it++) for (const b of bows) b[2].forEach((r, k, arr) => { arr[k] = r * 0.95 })   // bleibt es darüber (nur je ein Stück pro Bogen), Stücke gleichmäßig verkleinern
    for (let it = 0; covNow() < p0 && it < 6; it++) { const need = (p0 + 0.01 - covNow()) * Math.PI * 2, room = (cap - covNow()) * Math.PI * 2, w = Math.min(room, Math.max(need, Math.min(room, wOf((rules.contact.piece_min_m ?? 0.06) * 0.7)))); bows[0][2].push(Rr * Math.sin(Math.max(0.02, w) / 2)) }   // V-796c: Auffüllen nur so groß, dass die Obergrenze hält
    for (const [, centre, list] of bows) { const ws = list.map(wOf), total = ws.reduce((a, b) => a + b, 0), order = []
      list.forEach((r, k) => (k % 2 ? order.push(k) : order.unshift(k)))   // groß in der Mitte, abwechselnd links/rechts kleiner
      let ang = centre - total / 2
      for (const k of order) { const a = ang + ws[k] / 2; ang += ws[k]; const rj = Rr;   /* V-792: auf dem Messkreis, sonst deckt ein weiter außen liegendes Stück im Gate weniger Winkel */
        push({ tile: 'contact:moss_pebble', kind: 'contact', r: +list[k].toFixed(3), p: [cx + Math.cos(a) * rj, anc.p[1], cz + Math.sin(a) * rj], rotY: R.range(0, 6.28), sink: rules.sink.contact[0], group: grp, role: 'contact', cause, layer: 4 }) } }
    return Math.min(1, covNow()) }

  // 1 · feste Stamps (Landmarken, Dioramen, Stumpf): nicht umordnen, nur einbetten (V-716, embed.sop)
  const stampOut = stamps.map((s, i) => {
    const rec = recipes[s.recipe] || {}, tile = tilesFor(cfg, rec.slots?.[0]?.kinds?.[0] || 'prop', B.kit?.[s.recipe])[0]
    const o = put(tile, s.x, s.z, { group: `stamp${i}`, role: rec.slots?.[0]?.role || 'landmark', layer: rec.layer, fixed: true, story: rec.story_template })
    const [sgx, sgz] = grad(terrain, s.x, s.z), sdown = Math.atan2(-sgz, -sgx)
    const sdown0 = (() => { const [gx0, gz0] = grad(terrain, s.x, s.z); return Math.atan2(-gz0, -gx0) })()   // V-786: Moos am Schnittrand hangab, der Schnitt bleibt hell
    if (rec.wear_marks) o.wear = rec.wear_marks   /* Gebrauchsspuren mit Ursache (rules.biography.wear_marks_min) */
    if (rec.cut_moss) push({ tile: 'contact:moss_cut', kind: 'contact', r: +(tile.r * 0.16).toFixed(3), p: [o.p[0] + Math.cos(sdown0) * tile.r * 0.18, +(o.p[1] + tile.h * (1 - (o.sink || 0))).toFixed(3), o.p[2] + Math.sin(sdown0) * tile.r * 0.18], rotY: R.range(0, 6.28), sink: 0, group: `stamp${i}`, role: 'wear', cause: 'Moos auf der Schnittfläche', layer: 4 })
    contactArcs(o, tile.r, `stamp${i}`, sdown, 'Erde und Moos am Fuß, hangabwärts')
    let la0 = R.range(0, Math.PI * 2), lj = 0; const logs = []   /* V-787 (WSB N40 r7 A): ein Goldwinkel-Zähler über alle Slots, Mitten ≥ Summe der Halblängen → nie ein X */
    for (const sl of (rec.slots || []).slice(1)) { const cnt = sl.count ?? 1, tl = tilesFor(cfg, sl.kinds[0], B.kit?.[s.recipe])
      for (let k = 0; k < cnt; k++) { const ls = sl.s ?? 1, lr = tl[k % tl.length].r * ls; let a = 0, d = 0   /* V-796: Echo-Holz kürzer als der Stumpf (Slot s) */
        for (let t = 0; t < 24; t++) { a = la0 + (lj++) * 2.39996; d = tile.r + lr * R.range(1.05, 1.4); const lx = s.x + Math.cos(a) * d, lz = s.z + Math.sin(a) * d; const bushA = cfg.p0 ? (cfg.light?.sun_az ?? -0.6) + (cfg.p0.triangle_turn ?? 0) : null, dA = bushA == null ? 9 : Math.abs(Math.atan2(Math.sin(a - bushA), Math.cos(a - bushA)))   /* V-795: Holz nie auf der Busch-Seite (Busch-Nest steht 1,8 m am Stumpf) */
          if (dA > 1.5 && !logs.some((q) => Math.hypot(q[0] - lx, q[1] - lz) < q[2] + lr)) break }
        logs.push([s.x + Math.cos(a) * d, s.z + Math.sin(a) * d, lr]);   /* V-778: Abstand Stumpf-Radius + halbe Holzlänge, keine Durchdringung bei jeder Drehung */ put(tl[k % tl.length], s.x + Math.cos(a) * d, s.z + Math.sin(a) * d, { s: ls, group: `stamp${i}`, role: sl.role, layer: rec.layer, story: 'Holzstück desselben Stamms' }); contactArcs(inst[inst.length - 1], lr, `stamp${i}`, sdown, 'liegt im Laub, hangabwärts angespült') } }
    if (rec.finds && cfg.finds) push({ tile: 'find:catalog', kind: 'find', p: [o.p[0] + 0.6, o.p[1] + 1.0, o.p[2]], rotY: 0, sink: 0, group: o.group, role: 'find', layer: 2, story: 'Fundstück am Stumpf (V-437)' })
    return { id: s.id || `stamp${i}`, footprint_r: tile.r * 1.4, fixed: true, embed: { only_add: true, sop: 'embed.sop' } }
  })

  // 2 · Gruppen: Rezept je Keim, Slots über solveLocal, Nest-Positionen, Einsinken nach Art und Hang
  const seeds = zoneSeeds(R, chunk, rules, recipeList ? { ...masks, groups: recipeList.length } : masks); let p0PathFrom = null, stoneStory = null
  if (recipeList && stamps[0] && cfg.p0?.bush_next_to_stamp) { const bi = recipeList.indexOf('bush_nest'), sun = cfg.light?.sun_az ?? -0.6, d = cfg.p0.bush_next_to_stamp   /* P0-Konzept: Stumpf und Busch-Nest in der Mitte, Fokus-Fluff im Busch direkt am Stumpf */
    const turn = cfg.p0.triangle_turn ?? 0, ba = sun + turn   /* V-789: Busch seitlich zur Sonne gedreht, Baumgruppe gegengedreht → Dreieck statt Diagonale (WSB r8 f1) */
    if (bi >= 0) seeds[bi] = [stamps[0].x + Math.cos(ba) * d, stamps[0].z + Math.sin(ba) * d]
    const ti = recipeList.indexOf('tree_group'), tu = cfg.p0.tree_uphill   /* P0-Konzept: Baumgruppe mit dem alten Baum hinten, hangaufwärts vom Stumpf (V-778) */
    if (ti >= 0 && tu) { const [ux, uz] = grad(terrain, stamps[0].x, stamps[0].z), ua = Math.atan2(uz, ux) - turn * 0.6, cx = Math.cos(ua), cz = Math.sin(ua); seeds[ti] = [Math.min(chunk.x0 + chunk.size - 6, Math.max(chunk.x0 + 6, stamps[0].x + cx * tu)), Math.min(chunk.z0 + chunk.size - 6, Math.max(chunk.z0 + 6, stamps[0].z + cz * tu))] }
    // V-794: Weg-Start am Hangfuß schon hier wählen (größter Abstand der Spur zu Busch- und Baum-Keim), das Steinnest liegt als Lesesteine neben der Spur
    // (vom Weg geräumt, Ursache sichtbar), auf der vom Busch abgewandten Seite
    { const zL = terrain.h(chunk.x0 + chunk.size / 2, chunk.z0 + 1) <= terrain.h(chunk.x0 + chunk.size / 2, chunk.z0 + chunk.size - 1) ? chunk.z0 + 1 : chunk.z0 + chunk.size - 1, st0 = stamps[0], keep = [bi, ti].filter((k) => k >= 0).map((k) => seeds[k])
      const segD = (fx, q) => { const ax = st0.x - fx, az = st0.z - zL, L2 = ax * ax + az * az, t = Math.max(0, Math.min(1, ((q[0] - fx) * ax + (q[1] - zL) * az) / L2)); return Math.hypot(q[0] - fx - ax * t, q[1] - zL - az * t) }
      let best = null; for (let k = 0; k < 9; k++) { const fx = chunk.x0 + (0.1 + 0.1 * k) * chunk.size, m = keep.length ? Math.min(...keep.map((q) => segD(fx, q))) : 99; if (!best || m > best[1]) best = [fx, m] }
      p0PathFrom = [best[0], zL]
      const sp = cfg.p0.stone_nest_path, si = recipeList.indexOf('stone_nest_slope')
      if (si >= 0 && sp) { const dx = st0.x - best[0], dz = st0.z - zL, L = Math.hypot(dx, dz) || 1, nx = -dz / L, nz = dx / L, bs = seeds[bi] || [st0.x, st0.z], cl = (v, a0) => Math.min(a0 + chunk.size - 6, Math.max(a0 + 6, v))
        let pick = null; for (const tt of [0.3, 0.4, 0.5, 0.6, 0.7]) for (const sg of [1, -1]) { const px = st0.x - dx * tt, pz = st0.z - dz * tt, cx = cl(px + nx * sp.side_m * sg, chunk.x0), cz = cl(pz + nz * sp.side_m * sg, chunk.z0)
          if (Math.hypot(cx - bs[0], cz - bs[1]) < 6) continue; const [gx, gz] = grad(terrain, cx, cz), sl = Math.hypot(gx, gz); if (!pick || sl > pick[2]) pick = [cx, cz, sl] }   /* V-795: Lesesteine am steilsten Spurrand (Kritiker R2 Nr. 12: Sockel am Hang) */
        seeds[si] = pick ? [pick[0], pick[1]] : seeds[si]; stoneStory = 'Lesesteine, vom Weg geräumt und am Rand gestapelt' } } }
  for (const [gi, c] of seeds.entries()) {
    let contactCov = 0
    const rid = recipeList?.[gi] ?? R.weighted(Object.fromEntries(Object.entries(B.recipes).filter(([k]) => recipes[k] && !recipes[k].fixed && k !== 'path_trace').map(([k, w]) => [k, card ? w * card.bias(k) : w])))
    const rec = recipes[rid], kit = B.kit?.[rid], slots = [], fluffOn = stamps.length > 0 || rng(`${seed}|fluff|${gi}|${chunk.x0}|${chunk.z0}`).next() < (cfg.fluff?.group_share ?? 1)   // V-791: Fluff als Akzent, nicht an jeder Gruppe (Critic R2: ≤ 1 von 3); P0 behält es
    rec.slots.forEach((sl, si) => { const cnt = Array.isArray(sl.count) ? R.pick(sl.count) : sl.count ?? 1
      for (let k = 0; k < cnt; k++) { const kind = R.pick(sl.kinds); let dom = tilesFor(cfg, kind, kit); if (sl.role === 'pebble' && dom[0]?.placeholder) dom = tilesFor(cfg, kind, 'Steinkit v4');   /* V-763: Kiesel sind Mikro-Ebene, Steinkit erlaubt */ if (sl.role === 'anchor' && kind === 'tree') { const wa = dom.filter((d) => d.anchors?.length); if (wa.length) dom = wa } if (sl.role === 'anchor' && kind === 'bush') { const wb = dom.filter((d) => d.h >= (cfg.fluff?.levels?.plant?.min_crown_h ?? 0.4)); if (wb.length) dom = wb }   /* Anker-Busch groß genug fürs Nest */   /* V-793: Anker-Baum trägt das Hero-Nest und das Fallobst, nie ein kahler Baum ohne gemessene Anker (WSB N40 r14 Frame 3) */ slots.push({ role: sl.role, kind, tier: Math.min(si, 2), domain: dom, baseH: dom[0].h, layer: sl.layer ?? rec.layer }) } })
    if (rec.odd_total && slots.length % 2 === 0) slots.pop()
    const [gx, gz] = grad(terrain, c[0], c[1]), down = Math.atan2(-gz, -gx)
    let sol = null, radii = null, pos = null, rep = null
    for (let roll = 0; roll < 8 && !rep?.ok; roll++) {   /* V-770: findet das Layout keine Lösung, neu würfeln statt den Rest-Befund durchzureichen */
      const s2 = solveLocal(slots, R, rules, cfg.wfc?.tries ?? 16), r2 = s2.fill.map((f) => f.tile.r * f.s)
      for (let tries = 0; tries < 160; tries++) { const cand = nestPositions(R, r2, rules, down, rid === 'tree_group' ? (rules.group.tree_overlap_p ?? 0.85) : 0.55), rr = ruleReport(cand, r2, rules.group)   /* V-763/V-768: Abnahme mit dem Gate-Maß */
        if (!rep || rr.score < rep.score) { sol = s2; radii = r2; pos = cand; rep = rr } if (rr.ok) break } }
    const anchorR = (sol.fill[0].tile.r * sol.fill[0].s) || 1
    const tiltShare = (rules.lean?.pebble_tilt ?? [15, 0.2])[1], tiltDeg = 18   /* V-763: > 15° auch nach rotZ */, pebIdx = slots.map((s, i) => (s.role === 'pebble' ? i : -1)).filter((i) => i >= 0), nTilt = Math.ceil(pebIdx.length * tiltShare)
    const tilted = new Set(pebIdx.slice(0, nTilt))
    slots.forEach((s, i) => { const f = sol.fill[i]; const tilt = tilted.has(i) ? { rotX: +((tiltDeg * Math.PI) / 180 * (R.next() < 0.5 ? 1 : -1)).toFixed(3), rotZ: +R.range(-0.08, 0.08).toFixed(3) } : {}
      const o = put(f.tile, c[0] + pos[i][0], c[1] + pos[i][1], { s: f.s, group: `g${gi}`, role: s.role, layer: s.layer, story: rid === 'stone_nest_slope' && stoneStory ? stoneStory : rec.story_template, ...tilt })
      // Fluff-Nester an Bäumen und Büschen (B2-R2 Variante A, V-750 Farbe aus der Harmonie)
      if (rec.fluff && fluffOn && (s.kind === 'tree' || s.kind === 'bush')) {
        let nests = s.kind === 'tree' ? 1 + R.int(0, 2) : R.int(1, 2); const sun = cfg.light?.sun_az ?? -0.6
        if (stamps.length && s.role !== 'anchor') nests = 0   // V-795 (WSB-Kritiker R2 Nr. 1–3): in P0 tragen nur die Anker Fluff, ein Fokus, ein Echo
        // V-786: Nest-Mitte auf der Trägerhaut. Bäume mit gemessenen B2-Ankern (Kachel-anchors, glTF-Lokal in m): die zur Sonne zeigenden Anker, gedreht und skaliert wie die
        // Instanz; Büsche ohne Anker: Punkt auf der Kuppel-Hülle (d = 0,7 r → y = 0,71 h). So sitzen die Kugeln 5–60 % im Träger (Gate r4 ENV-FLUFF-HALT).
        const ry = o.rotY || 0, cy = Math.cos(ry), sy = Math.sin(ry), rot = (v) => [v[0] * cy + v[2] * sy, v[1], -v[0] * sy + v[2] * cy]
        const sunV = [Math.cos(sun), Math.sin(sun)], anc = (f.tile.anchors || []).filter((q) => q.p && q.n).map((q) => { const n = rot(q.n); return { q, n, sc: n[0] * sunV[0] + n[2] * sunV[1] + 0.3 * n[1] } }).filter((q) => q.sc > 0).sort((a, b) => b.sc - a.sc)   // V-794: nur Lichtseite (Konzeptblatt §2b)
        // V-787 (WSB N40 r7 1a/1b/C): kahle Bäume ohne Anker tragen kein Nest (der Kuppelpunkt läge in der Luft); Bäume höchstens so viele Nester wie Anker;
        // Büsche erst ab fluff.levels.plant.min_crown_h; Ring höchstens 0,5 × Trägerradius (ring_r_max, Adapter nimmt min(Busch-Regel, ring_r_max))
        if (s.kind === 'tree') nests = Math.min(nests, anc.length); else if (f.tile.h * f.s < (cfg.fluff?.levels?.plant?.min_crown_h ?? 0.4)) nests = 0
        for (let n = 0; n < nests; n++) { const balls = 1 + 3 + R.int(1, 3), a = sun + R.range(-0.5, 0.5) + n * 1.1
          let np, nn = null
          if (s.kind === 'tree' && anc[n]) { const pp = rot(anc[n].q.p); np = [o.p[0] + pp[0] * f.s, o.p[1] + pp[1] * f.s, o.p[2] + pp[2] * f.s]; nn = anc[n].n.map((v) => +v.toFixed(3)) }
          else { const d = 0.7 * f.tile.r * f.s; np = [o.p[0] + Math.cos(a) * d, o.p[1] + f.tile.h * f.s * 0.71, o.p[2] + Math.sin(a) * d]; nn = [+(Math.cos(a) * 0.7).toFixed(3), 0.71, +(Math.sin(a) * 0.7).toFixed(3)] }
          push({ tile: 'fluff:nest', kind: 'fluff', p: np.map((v) => +v.toFixed(3)), n: nn, support: o.tile,
            rotY: 0, sink: 0, group: o.group, role: n === 0 ? 'fluff_hero' : 'fluff_side', balls, accent: stamps.length && rid === 'bush_nest' && s.role === 'anchor' && n === 0 ? 'focus' : 'echo', cr: +(f.tile.r * f.s).toFixed(3), ring_r_max: +((s.kind === 'tree' ? (cfg.fluff?.ring_tree ?? 0.5) : 0.5) * f.tile.r * f.s).toFixed(3), color_role: 'fluff', fluff_mode: card ? card.fluffMode : (cfg.fluff?.default_mode || 'heroic'), harvest: true, layer: 4 })
          if (n === 0 && s.role === 'anchor' && (stamps.length ? rid === 'bush_nest' : s.kind === 'tree') && !fallen) {   /* V-795: in P0 aus dem Fokus-Nest am Stumpf (Konzeptblatt life_anchor) */ fallen = true; const nest = inst[inst.length - 1]
            for (let fb = 0; fb < (cfg.fluff?.fallobst?.balls ?? 2); fb++) { let x = nest.p[0] + R.range(-0.4, 0.4), z = nest.p[2] + R.range(-0.4, 0.4)   /* rollToRest: hangabwärts bis Mulde oder Hindernis (B2-R2) */
              for (let st = 0; st < (cfg.fluff?.fallobst?.roll_steps ?? 8); st++) { const [fx, fz] = grad(terrain, x, z), sl = Math.hypot(fx, fz); if (sl < 0.015) break   /* V-794: höchstens 2,4 m, liegt am nächsten Hindernis */
                const nx = x - (fx / sl) * 0.3, nz = z - (fz / sl) * 0.3; if (nx < chunk.x0 + 1 || nz < chunk.z0 + 1 || nx > chunk.x0 + chunk.size - 1 || nz > chunk.z0 + chunk.size - 1) break; if (inst.some((q) => ['anchor', 'support', 'pebble', 'focus', 'landmark'].includes(q.role) && q.kind !== 'tree' && Math.hypot(q.p[0] - nx, q.p[2] - nz) < 0.45 + (q.r || 0.3))) break; x = nx; z = nz }
              push({ tile: 'fluff:fallen', kind: 'fluff', p: [+x.toFixed(3), +terrain.h(x, z).toFixed(3), +z.toFixed(3)], rotY: 0, sink: 0.15, group: o.group, role: 'fallobst', balls: 1, color_role: 'fluff', fluff_mode: nest.fluff_mode, harvest: true, layer: 4, story: 'Fallobst aus dem Hero-Nest, hangab gerollt' }) } } }
      }
    })
    // Kontakt-Geometrie mit Ursache am Anker (V-749 Nr. 3): Bögen auf 40–50 % des Umfangs, Lücke ≥ 25 %, Stücke so gesetzt, dass ihre Winkelbreiten
    // zusammen genau die gewählte Abdeckung ergeben (das Gate misst die Abdeckung über die Winkelbreiten); keine Zählregel, kein Kranz.
    contactCov = contactArcs(inst.find((x) => x.group === `g${gi}` && x.role === 'anchor'), anchorR, `g${gi}`, down, 'hangabwärts gespült')
    report.push({ group: `g${gi}`, recipe: rid, slots: slots.length, odd: slots.length % 2 === 1, wfc_tries: sol.tries, fallback: sol.fallback, contact_cov: +contactCov.toFixed(3), g1: rep.ok ? 'ok' : rep.failed.join(',') })
  }

  // 3 · Steinspur (path_trace, V-752/V-578): Band 1,6 m breit vom Zellrand zum ersten Stamp. Heiler Kern bis zu einer geschwungenen Isolinie, dann
  // verwittert gerundete Fragmente dicht → locker (≈ 1,0 → 0,4 u), Fugen wachsen, einzelne fehlen (Erde), keine Reihe.
  if (B.recipes.path_trace && stamps[0]) {
    const s = stamps[0], zLow = terrain.h(chunk.x0 + chunk.size / 2, chunk.z0 + 1) <= terrain.h(chunk.x0 + chunk.size / 2, chunk.z0 + chunk.size - 1) ? chunk.z0 + 1 : chunk.z0 + chunk.size - 1, from = p0PathFrom || (() => { const sol = inst.filter((q) => ['anchor', 'support'].includes(q.role)), segD = (fx, q) => { const ax = s.x - fx, az = s.z - zLow, L2 = ax * ax + az * az, t = Math.max(0, Math.min(1, ((q.p[0] - fx) * ax + (q.p[2] - zLow) * az) / L2)); return Math.hypot(q.p[0] - fx - ax * t, q.p[2] - zLow - az * t) }
      let best = null; for (let k = 0; k < 9; k++) { const fx = chunk.x0 + (0.1 + 0.1 * k) * chunk.size, m = sol.length ? Math.min(...sol.map((q) => segD(fx, q))) : 99; if (!best || m > best[1]) best = [fx, m] } return [best[0], zLow] })(),   /* Steinspur kommt vom Hangfuß (V-778) */ tile = tilesFor(cfg, 'path_stone', B.kit?.path_trace), u = cfg.units.m_per_kaykit_u
    const L = Math.hypot(s.x - from[0], s.z - from[1]), dir = [(s.x - from[0]) / L, (s.z - from[1]) / L], nrm = [-dir[1], dir[0]], iso = R.range(0.55, 0.7), bend = R.range(2.5, 4)
    let along = 0
    while (along < L - 1.2) {
      const t = along / L, wob = Math.sin(t * Math.PI * 2 + 0.4) * bend * (1 - 0.8 * t), decay = Math.max(0, ((1 - t) - iso - 0.06 * Math.sin(along * 0.9)) / (1 - iso))   /* V-794: heiler Kern am Stumpf (Ziel), zum Hangfuß locker; S-Schwung, der am Stumpf ausläuft */
      const size = (1.0 - 0.6 * decay) * u * 0.5, gap = 0.03 + 0.28 * decay, step = 2 * size + gap
      for (let w = -0.8; w <= 0.8; w += step) {
        if (decay > 0 && R.next() < decay * 0.3) continue   /* V-795: Spur liest sich als Weg, nicht als Inseln */
        const jitter = (0.15 + decay * 0.6), off = w + R.range(-jitter, jitter) * size, adv = R.range(-0.4, 0.4) * step
        const x = from[0] + dir[0] * (along + adv) + nrm[0] * (off + wob), z = from[1] + dir[1] * (along + adv) + nrm[1] * (off + wob)
        if (inst.some((q) => ['anchor', 'support', 'pebble', 'focus', 'echo', 'landmark'].includes(q.role) && Math.hypot(q.p[0] - x, q.p[2] - z) < (tilesFor(cfg, q.kind)[0]?.r || 0.5) * (q.s || 1) + size)) continue   /* V-789 */
        const tl = R.pick(tile); put(tl, x, z, { s: +((size * 2) / (tl.r * 2)).toFixed(3), group: 'path', role: 'path', layer: 2, decay: +decay.toFixed(2), story: recipes.path_trace.story_template })
      }
      along += step * R.range(0.85, 1.15)
    }
  }

  // 4 · Gras-Büschel (SPEC_ENVIRONMENT_KIT_R1 §8, V-769): nie Einzelhalme. a) Fuß-Büschel 3/5/7 an Ankern und Stützen auf einem Bogen der Licht- bzw.
  // Hangfußseite, Größen 1 : 0,62 : 0,38; b) Felder nach Rauschen und Ursache (Sonne → Gras), dichter in Senken, Wege frei, Freifläche nur kurz.
  const G = rules.grass, grass = { foot: 0, field: 0, clusters: 0 }
  if (G) {
    const gt = cfg.tiles.filter((t) => t.kind === 'grass' && /Singlesided$/i.test(t.id)).map((t) => ({ id: t.id, kind: 'grass', h: t.h_m, r: t.hull_r_m }))
    const tuftTiles = gt.length ? gt : [{ id: 'placeholder:grass', kind: 'grass', placeholder: true, ...PLACEHOLDER.grass }]
    const vn = (x, z) => { const s = G.field.noise_m, ix = Math.floor(x / s), iz = Math.floor(z / s), fx = x / s - ix, fz = z / s - iz, sm = (t) => t * t * (3 - 2 * t)
      const v = (a, b) => (hash32(`${seed}|gn|${a}|${b}`) % 1000) / 1000, a = v(ix, iz), b = v(ix + 1, iz), c = v(ix, iz + 1), e = v(ix + 1, iz + 1)
      return a + (b - a) * sm(fx) + (c - a) * sm(fz) + (a - b - c + e) * sm(fx) * sm(fz) }
    const hollow = (x, z) => (terrain.h(x + 2, z) + terrain.h(x - 2, z) + terrain.h(x, z + 2) + terrain.h(x, z - 2)) / 4 - terrain.h(x, z)
    const pathPts = inst.filter((x) => x.role === 'path').map((x) => x.p), solid = inst.filter((x) => ['anchor', 'support', 'landmark', 'focus'].includes(x.role))
    const nearPath = (x, z) => pathPts.some((p) => (p[0] - x) ** 2 + (p[2] - z) ** 2 < G.field.path_clear_m ** 2)
    const inSolid = (x, z) => solid.some((o) => (o.p[0] - x) ** 2 + (o.p[2] - z) ** 2 < (0.6 * (o.s || 1) + 0.3) ** 2)
    const TBF = new Map(cfg.tiles.map((t) => [t.id, t])), footR = (o) => ((TBF.get(o.tile)?.gate_r_m ?? TBF.get(o.tile)?.hull_r_m) || tilesFor(cfg, o.kind)[0]?.r || 0.6) * (o.s || 1) * 1.3 + 0.2 * (cfg.units?.m_per_H || 2.24)   // V-792: Ü5-Kreis der echten Kachel   // Ü5-Messkreis des Gates
    const inFoot = (x, z) => solid.some((o) => /stone|rock|tree/.test(o.kind) && (o.p[0] - x) ** 2 + (o.p[2] - z) ** 2 < footR(o) ** 2)   // V-786: Feldgras lässt den Fuß von Steinen und Bäumen frei, dort nur Fuß-Büschel (≤ 50 % Umfang)
    // Bauweise-Tafel Regel 3 (Lab biome-sheets/Bauweise_Erdung.jpg): Büschel lehnen vom Objekt weg und hangabwärts, lang in der Kehle bzw. Senke, kurz auf der Kuppe
    const crowns = inst.filter((o) => o.kind === 'tree').map((o) => [o.p[0], o.p[2], (o.s || 1) * (tilesFor(cfg, 'tree')[0]?.r || 1.6)])
    const tuft = (x, z, sc, grp, src, step, from = null) => { if (masks?.blocked?.(x, z)) return
      const [gx, gz] = grad(terrain, x, z), hv = hollow(x, z), len = Math.max(0.7, Math.min(1.3, 1 + hv * 3))
      let lx = -gx * 4, lz = -gz * 4; if (from) { const dx = x - from[0], dz = z - from[1], l = Math.hypot(dx, dz) || 1; lx += dx / l; lz += dz / l }
      const ll = Math.hypot(lx, lz), lean = ll > 0.05 ? Math.min(G.lean_max_deg ?? 14, 6 + ll * 6) : 0, la = Math.atan2(lz, lx)
      put(R.pick(tuftTiles), x, z, { s: +(sc * len).toFixed(3), group: grp, role: 'grass', layer: 4, src, tint_step: Math.max(0, Math.min(G.color.steps - 1, step + R.int(-1, 1))), color_role: G.color.role,
        ...(lean ? { rotX: +((Math.sin(la) * lean * Math.PI) / 180).toFixed(3), rotZ: +((-Math.cos(la) * lean * Math.PI) / 180).toFixed(3) } : {}) }); grass[src]++ }
    // a) Fuß-Büschel
    for (const o of solid) { const n = typeof G.foot.count === 'object' && !Array.isArray(G.foot.count) ? (G.foot.count[o.role] ?? 3) : R.pick(G.foot.count),   /* V-770: 5 am Anker, 3 an der Stütze */ ro = (o.s || 1) * (tilesFor(cfg, o.kind)[0]?.r || 0.6), [gx, gz] = grad(terrain, o.p[0], o.p[2])
      const downA = Math.hypot(gx, gz) > 0.02 ? Math.atan2(-gz, -gx) : (cfg.light?.sun_az ?? -0.6), sun = cfg.light?.sun_az ?? -0.6
      /* Bauweise: Fels → Grasnest in der Kehle bergauf; Strauch → Sonnenseite unter der Kante; Baum → an der Tropfkante; sonst hangabwärts */
      const isStone = /stone|rock|boulder/.test(o.kind), side = isStone ? downA + Math.PI : o.kind === 'bush' ? sun : downA, arc = Math.PI * (isStone ? R.range(0.2, 0.32) : R.range(0.4, 0.6))   /* Ü5: ≤ 50 % des Fußes inkl. Büschelbreite */, step = R.int(0, G.color.steps - 1)
      const ring = o.kind === 'tree' ? [1.6, 2.2] : G.foot.ring_r
      for (let k = 0; k < n; k++) { const a = side - arc / 2 + arc * ((k + R.range(0.2, 0.8)) / n), d = ro * R.range(...ring), tx = o.p[0] + Math.cos(a) * d, tz = o.p[2] + Math.sin(a) * d
        if (solid.some((q) => q !== o && /stone|rock|tree/.test(q.kind) && (q.p[0] - tx) ** 2 + (q.p[2] - tz) ** 2 < footR(q) ** 2)) continue   /* V-789 (WSB r8 Ü5 94 %): Stützen-Büschel nicht in den Fuß des Ankers */
        tuft(o.p[0] + Math.cos(a) * d, o.p[2] + Math.sin(a) * d, G.foot.ratio[Math.min(2, k === 0 ? 0 : k < 4 ? 1 : 2)] * R.range(0.9, 1.1), o.group, 'foot', step, [o.p[0], o.p[2]]) } }
    // b) Felder als Flecken (V-770): Fleck-Keime im 8-m-Raster nach Rauschen und Senke; je Fleck 3 oder 5 Büschel-Gruppen auf einer Vogel-Spirale
    //    (5+5+3 = 13 bzw. 5+5+5+3+3 = 21, Fibonacci), je Gruppe 5 Kern- bzw. 3 Rand-Büschel wieder als Vogel-Spirale; Randgruppen lockerer und kürzer (Sprenkel).
    const F = G.field, gs = F.field_grid_m, negC = [chunk.x0 + chunk.size / 2, chunk.z0 + chunk.size / 2], dens = card ? card.grassDensity : 1, GA = 2.39996
    grass.patches = []; grass.fields = 0
    for (let gx0 = chunk.x0 + gs / 2; gx0 < chunk.x0 + chunk.size; gx0 += gs) for (let gz0 = chunk.z0 + gs / 2; gz0 < chunk.z0 + chunk.size; gz0 += gs) {
      // Feld-Ebene: je 16-m-Feld ein Keim; über der Schwelle 3 oder 5 Flecken auf einer Vogel-Spirale um den Keim
      const fx = gx0 + R.range(-0.3, 0.3) * gs, fz = gz0 + R.range(-0.3, 0.3) * gs, fscore = vn(fx, fz) + Math.max(0, Math.min(F.hollow_bonus, hollow(fx, fz) * 2))
      if (fscore < F.thresh || R.next() > Math.min(1, dens * (fscore - F.thresh) / (F.edge_soft || 0.1))) continue
      const np = R.pick(F.field_patches), frot = R.range(0, Math.PI * 2); grass.fields++
      for (let pi = 0; pi < np; pi++) {
      const pd = F.patch_spacing_m * Math.sqrt(pi + (pi ? 0.5 : 0)) * R.range(0.85, 1.15), x = fx + Math.cos(frot + pi * GA) * pd, z = fz + Math.sin(frot + pi * GA) * pd
      const underCrown = crowns.some((c) => (c[0] - x) ** 2 + (c[1] - z) ** 2 < (c[2] * 1.3) ** 2); if (underCrown && R.next() < 0.75) continue
      if (nearPath(x, z) || inSolid(x, z) || x < chunk.x0 || z < chunk.z0 || x > chunk.x0 + chunk.size || z > chunk.z0 + chunk.size) continue
      const nc = R.pick(F.patch_clusters), nCore = Math.ceil(nc / 2), short = Math.hypot(x - negC[0], z - negC[1]) < chunk.size * 0.18 ? F.neg_space_short : 1
      const grp = `gp${grass.patches.length}`, rot = R.range(0, Math.PI * 2), plan = []; let placed = 0
      for (let c = 0; c < nc; c++) { const edge = c >= nCore, nt = edge ? F.cluster_tufts.edge : F.cluster_tufts.core, step = R.int(0, G.color.steps - 1); plan.push(nt)
        const ca = rot + c * GA, cd = F.cluster_spacing_m * Math.sqrt(c + (c ? 0.5 : 0)) * R.range(0.9, 1.1), cx = x + Math.cos(ca) * cd, cz = z + Math.sin(ca) * cd
        for (let k = 0; k < nt; k++) { const ta = R.range(0, 6.28) + k * GA, td = F.tuft_spacing_m * Math.sqrt(k) * (edge ? F.edge_spread : 1), tx = cx + Math.cos(ta) * td, tz = cz + Math.sin(ta) * td
          if (nearPath(tx, tz) || inSolid(tx, tz) || inFoot(tx, tz)) continue
          const before = grass.field; tuft(tx, tz, G.foot.ratio[k === 0 ? 0 : k < 4 ? 1 : 2] * short * (edge ? F.edge_short : 1) * R.range(0.9, 1.1), grp, 'field', step); placed += grass.field - before } }
      grass.clusters += nc; grass.patches.push({ id: grp, clusters: nc, planned: plan.reduce((a, b) => a + b, 0), placed }) } }
    // c) Die eine Bedeutung je Zelle (V-770, Etherington 70/20/10): höchstens ein bewusster Regelbruch, Wahrscheinlichkeit = surrealism des Karten-Dreiers
    if (card && rules.oddity && R.next() < card.wc.params.surrealism) {
      const cen = solid.length ? solid.reduce((m, o) => [m[0] + o.p[0] / solid.length, m[1] + o.p[2] / solid.length], [0, 0]) : negC, away = Math.atan2(negC[1] - cen[1], negC[0] - cen[0]) + R.range(-0.6, 0.6)
      let ox = 0, oz = 0, ok = false
      for (let t = 0; t < 24 && !ok; t++) { const d = chunk.size * R.range(0.2, 0.3), a2 = away + t * GA; ox = negC[0] + Math.cos(a2) * d; oz = negC[1] + Math.sin(a2) * d
        ok = !pathPts.some((p) => (p[0] - ox) ** 2 + (p[2] - oz) ** 2 < (rules.oddity.path_clear_m ?? 3) ** 2) && !solid.some((o) => (o.p[0] - ox) ** 2 + (o.p[2] - oz) ** 2 < 9) && !masks?.blocked?.(ox, oz) }
      if (ok) { const kind = R.pick(Object.keys(rules.oddity.kinds)), story = rules.oddity.kinds[kind], st = tilesFor(cfg, 'stone_M', 'Steinkit v4'), od = { group: 'oddity', layer: 3, oddity: kind, story }
        if (kind === 'stone_on_tip') { put(R.pick(st), ox, oz, { ...od, role: 'oddity', s: 1, rotX: 1.1, rotZ: +R.range(-0.2, 0.2).toFixed(3), sink: 0.05 })
          for (let k = 0; k < 3; k++) { const a3 = k * GA; put(R.pick(tilesFor(cfg, 'stone_S', 'Steinkit v4')), ox + Math.cos(a3) * 0.7, oz + Math.sin(a3) * 0.7, { ...od, role: 'pebble' }) } }
        else if (kind === 'cairn') { let top = 0; [1, 0.62, 0.38].forEach((sc, k) => { const t0 = R.pick(st), h = (t0.h || 0.5) * sc, o2 = put(t0, ox, oz, { ...od, role: 'oddity', s: sc, sink: k ? 0 : 0.15 })   /* Fuß 15 % im Boden, jeder Stein sitzt 10 % in der Mulde des unteren: nichts schwebt */
          const y = k ? top - 0.1 * h : -0.15 * h; o2.p[1] = +(o2.p[1] + y + (k ? 0 : 0.15 * h)).toFixed(3); top = (k ? top - 0.1 * h : 0) + h * (k ? 1 : 0.85) }) }
        else { for (let k = 0; k < 13; k++) { const a3 = (k / 13) * Math.PI * 2; tuft(ox + Math.cos(a3) * 1.6, oz + Math.sin(a3) * 1.6, G.foot.ratio[1], 'oddity', 'foot', 1) }
          inst.filter((o) => o.group === 'oddity').forEach((o) => Object.assign(o, od, { role: 'oddity' })) }
        grass.oddity = kind }
    }
    // Wind-Gruppen (§6): eine Gruppe teilt Grundphase; Gruppen-ID nach Position des Gruppen-Mittels im 8-m-Raster (≤ 64 je Zelle), Biegung je Art
    const W = G.wind, cen = {}
    for (const o of inst) { const c = (cen[o.group] ||= [0, 0, 0]); c[0] += o.p[0]; c[1] += o.p[2]; c[2]++ }
    const nW = Math.max(1, Math.round(chunk.size / W.grid_m))
    for (const o of inst) { const c = cen[o.group], wx = Math.min(nW - 1, Math.max(0, Math.floor((c[0] / c[2] - chunk.x0) / W.grid_m))), wz = Math.min(nW - 1, Math.max(0, Math.floor((c[1] / c[2] - chunk.z0) / W.grid_m)))
      o.wind_group = Math.min(W.max_groups - 1, wz * nW + wx); o.wind_bend = W.bend[o.kind] ?? 0; o.wind_phase = +((hash32(`${seed}|wp|${o.group}`) % 628) / 100 + R.range(-W.phase_jitter, W.phase_jitter)).toFixed(3) }
  }

  // 5 · Regel-Bericht für das Gate (Zone und Biografie)
  const occ = inst.filter((x) => x.role === 'anchor' || x.role === 'support').reduce((s, x) => s + Math.PI * 2.2 ** 2, 0)
  const zoneReport = { groups: report.length, neg_space_est: +(1 - Math.min(1, occ / chunk.size ** 2)).toFixed(3), layers: [...layers].sort(), layers_ok: (rules.biography?.layers_required || []).every((l) => layers.has(l)),
    placeholders: inst.some((x) => x.placeholder), grass: { ...grass, fib_ok: (grass.patches || []).every((p) => [13, 21].includes(p.planned)), on_path: inst.filter((g) => g.src === 'field' && inst.some((p) => p.role === 'path' && (p.p[0] - g.p[0]) ** 2 + (p.p[2] - g.p[2]) ** 2 < (rules.grass?.field.path_clear_m ?? 1) ** 2)).length, wind_groups: new Set(inst.map((x) => x.wind_group)).size } }
  // V-787/V-791 · Nachlauf je Gruppe im Gate-Maß: Ü3 benachbarte gleichartige Höhen ≥ height_tol (Ü4 steht in solveLocal, hier nur als Wache)
  // verschieden. Jede Änderung gilt nur, wenn G1 (Überlappung/Luft mit band_margin, gate_r_m × s) zu allen Gruppen-Gliedern hält, sonst die andere Richtung,
  // sonst bleibt es (WSB N40 r11: Gras-Kürzung schob ein Paar ins nearTouch-Band). Gras frei, Kit-Teile gleichmäßig ±15 % vom Ausgangsmaß (V-574).
  { const TB = new Map(cfg.tiles.map((t) => [t.id, t])), ht = rules.lean?.height_tol ?? 0.1, nr = rules.group.neighbour_r ?? 4.5, mg = rules.group.band_margin ?? 0
    const ov = rules.group.overlap_max * (1 - mg), air = rules.group.air_min * (1 + mg), S0 = new Map(inst.map((o) => [o, o.s ?? 1]))
    const hOf = (o) => (TB.get(o.tile)?.h_m ?? TB.get(o.tile)?.h ?? 0) * (o.s ?? 1), rOf = (o) => { const t = TB.get(o.tile); return ((t?.gate_r_m ?? t?.hull_r_m) || 0) * (o.s ?? 1) }, fOf = (o) => (TB.get(o.tile)?.foot_r_m ?? 0) * (o.s ?? 1)
    const G1R = ['anchor', 'support', 'accent', 'pebble'], members = new Map()
    for (const o of inst) if (o.group && G1R.includes(o.role) && TB.get(o.tile)) { if (!members.has(o.group)) members.set(o.group, []); members.get(o.group).push(o) }
    const okG1 = (o) => !G1R.includes(o.role) || (members.get(o.group) || []).every((q) => { if (q === o) return true; const v = Math.hypot(o.p[0] - q.p[0], o.p[2] - q.p[2]) / (rOf(o) + rOf(q) || 1); return !(v > ov && v < air) })
    const lim = (o, sc) => (o.kind === 'grass' ? sc : Math.min(S0.get(o) * 1.15, Math.max(S0.get(o) * 0.85, sc)))
    const u4Bad = (g) => { const t = inst.filter((q) => q.group === g && q.kind === 'tree' && fOf(q)).map(fOf).sort((a, b) => a - b); let n = 0; for (let k = 1; k < t.length; k++) if ((t[k] - t[k - 1]) / t[k] < 0.2) n++; return n }   // Ü4 wie das Gate: Dicken-Reihenfolge
    const trySet = (o, sc) => { const old = o.s, u0 = o.kind === 'tree' ? u4Bad(o.group) : 0; o.s = +lim(o, sc).toFixed(3); if (okG1(o) && (o.kind !== 'tree' || u4Bad(o.group) <= u0)) return true; o.s = old; return false }
    const tryAny = (lo, hi, h0, h1) => [0.97, 0.88, 0.76, 0.64].some((f) => trySet(lo, (lo.s ?? 1) * h1 * (1 - ht) * f / h0)) || [1.03, 1.12, 1.25].some((f) => trySet(hi, (hi.s ?? 1) * h0 / (1 - ht) * f / h1))   // V-792: mehrere Stufen, bevor die G1-Wache aufgibt
    const near = (A, Bq) => Math.hypot(A.p[0] - Bq.p[0], A.p[2] - Bq.p[2]) <= nr * ((rOf(A) + rOf(Bq)) / 2 || 1)
    const cls = (o) => (o.kind === 'grass' ? 'grass' : /stone|rock/.test(o.kind) ? 'stone' : o.kind === 'tree' || o.kind === 'bush' ? 'plant' : null)
    const byG = new Map(); for (const o of inst) { if (!o.group || !cls(o) || !hOf(o)) continue; const k = o.group + '|' + cls(o); if (!byG.has(k)) byG.set(k, []); byG.get(k).push(o) }
    for (const list of byG.values()) for (let pass = 0; pass < 4; pass++) { let fixed = 0
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) { const A = list[i], Bq = list[j]; if (A.kind === 'grass' && Bq.kind === 'grass' && !G1R.includes(A.role) && !near(A, Bq)) continue   // V-792: Slot-Glieder paarweise in der ganzen Gruppe, Feld-/Fuß-Gras nur Nachbarn
        const lo = hOf(A) <= hOf(Bq) ? A : Bq, hi = lo === A ? Bq : A   // Ü3 Höhen
        if (hOf(lo) >= hOf(hi) * (1 - ht)) { fixed++; tryAny(lo, hi, hOf(lo), hOf(hi)) } }
      if (!fixed) break } }
  // V-795 · Kontaktstücke und Kiesel nie unter einem Holzstück (Kritiker R2 Nr. 13: Holz lag auf der Kieselreihe)
  { const TL = new Map(cfg.tiles.map((t) => [t.id, t])), logs = inst.filter((o) => o.kind === 'log' || TL.get(o.tile)?.long_axis)
    if (logs.length) { const under = (q) => logs.some((L) => { const t = TL.get(L.tile), hl = ((t?.gate_r_m ?? t?.hull_r_m) || 1.3) * (L.s ?? 1), w = ((t?.h_m) || 0.5) * 0.6 * (L.s ?? 1), ry = L.rotY || 0, ax = t?.long_axis === 'z' ? [Math.sin(ry), Math.cos(ry)] : [Math.cos(ry), -Math.sin(ry)]
        const vx = q.p[0] - L.p[0], vz = q.p[2] - L.p[2], al = vx * ax[0] + vz * ax[1], pr = Math.abs(vx * -ax[1] + vz * ax[0]); return Math.abs(al) < hl && pr < w + (q.r || 0) })
      for (let k = inst.length - 1; k >= 0; k--) { const q = inst[k]; if ((q.role === 'contact' && !logs.includes(q)) || q.role === 'path') { if (under(q)) inst.splice(k, 1) } } } }
  // V-796 · Fuß-Steinchen an allen frei stehenden Gliedern ohne eigenen Kontakt (Stützen, Echos; Kritiker K4 Erdung): 2–3 Stück L/M/S hangab am Fuß,
  // role foot (Mikro-Ebene, zählt nicht zum Kontaktfenster des Ankers)
  { const TF = new Map(cfg.tiles.map((t) => [t.id, t])), ST = rules.contact.staffel ?? [1, 0.62, 0.38]
    for (const o of inst.filter((q) => ['support', 'echo'].includes(q.role) && /tree|bush|stone|rock/.test(q.kind) && TF.get(q.tile))) { const t = TF.get(o.tile), sc = o.s ?? 1
      const fr = (o.kind === 'tree' && t.foot_r_m ? t.foot_r_m : ((t.gate_r_m ?? t.hull_r_m) || 0.3) * (o.kind === 'bush' ? 0.85 : 1)) * sc, [gx, gz] = grad(terrain, o.p[0], o.p[2]), dn = Math.hypot(gx, gz) > 0.02 ? Math.atan2(-gz, -gx) : (cfg.light?.sun_az ?? -0.6)
      const n = 2 + (R.next() < 0.5 ? 1 : 0), pm = rules.contact.piece_min_m ?? 0.06, rL = Math.max(pm / ST[2] * 0.85, Math.min(0.2, fr * 0.5))   // V-796b: auch das S-Stück ≥ ≈ 0,05 m (WSB r29: 13 von 26 zu klein)
      for (let k = 0; k < n; k++) { const a = dn + (k - (n - 1) / 2) * 0.55 + R.range(-0.15, 0.15), d = fr + rL * ST[k] * 0.6
        push({ tile: 'contact:moss_pebble', kind: 'contact', r: +(rL * ST[k] * R.range(0.9, 1.1)).toFixed(3), p: [+(o.p[0] + Math.cos(a) * d).toFixed(3), o.p[1], +(o.p[2] + Math.sin(a) * d).toFixed(3)], rotY: R.range(0, 6.28), sink: rules.sink.contact[0], group: o.group, role: 'foot', cause: 'Erde und Kiesel am Fuß, hangab', layer: 4 }) } } }
  // V-794 · Moos in den Fugen (material_codes): wo zwei Steine bzw. Stein/Holz einer Gruppe überlappen, ein Moos-Lappen in der Fuge, hangab versetzt
  { const TJ = new Map(cfg.tiles.map((t) => [t.id, t])), rJ = (o) => (((TJ.get(o.tile)?.gate_r_m ?? TJ.get(o.tile)?.hull_r_m) || 0) * (o.s ?? 1)), hard = inst.filter((o) => o.group && /stone|log|stump/.test(o.kind) && ['anchor', 'support', 'pebble', 'focus', 'echo'].includes(o.role) && rJ(o))
    for (let i = 0; i < hard.length; i++) for (let j = i + 1; j < hard.length; j++) { const A = hard[i], Bq = hard[j]; if (A.group !== Bq.group) continue; const d = Math.hypot(A.p[0] - Bq.p[0], A.p[2] - Bq.p[2]), ra = rJ(A), rb = rJ(Bq)
      if (d > (ra + rb) * (rules.group.overlap_max ?? 0.85) || d < 1e-3) continue; const f = ra / (ra + rb), mx = A.p[0] + (Bq.p[0] - A.p[0]) * f, mz = A.p[2] + (Bq.p[2] - A.p[2]) * f, [gx, gz] = grad(terrain, mx, mz), gl = Math.hypot(gx, gz) || 1
      push({ tile: 'moss:joint', kind: 'moss', r: +(Math.min(ra, rb) * 0.35).toFixed(3), p: [+(mx - gx / gl * 0.05).toFixed(3), +terrain.h(mx, mz).toFixed(3), +(mz - gz / gl * 0.05).toFixed(3)], rotY: R.range(0, 6.28), sink: rules.sink.contact[0], group: A.group, role: 'joint', cause: 'Moos in der Fuge', layer: 4 }) } }   // Moos-Fuge: Materialcode Moos, zählt nicht zum Kontaktfenster
  return { schema: 'kfb.place-recipe/1', seed, biome, chunk, instances: inst, stamps: stampOut, deltas: stampOut.map((s) => ({ stamp: s.id, schema: 'kfb.terrain-delta/1', only_add: true })), report: { groups: report, zone: zoneReport, ...(card ? { card: { biome_card: card.wc.biome, biome, story_mode: card.mode, fluff_mode: card.fluffMode, surrealism: +card.wc.params.surrealism.toFixed(3), grass_density: +card.grassDensity.toFixed(3) } } : {}) } }
}

// Rezept-Hash für den Golden-Test (gleicher Seed = gleicher Hash)
export const recipeHash = (recipe) => hash32(JSON.stringify(recipe.instances)).toString(16)

```


## placeWorker.js

```js
// V-782 · kfb-place im Spiel: Rezept je 64-m-Zelle im Worker (Löser kostet 10–80 ms, das Bild nicht). Höhen kommen als Raster vom Hauptfaden
// (Gelände bleibt eine Wahrheit, V-563), hier nur bilinear abgefragt. Löser und Regeln byte-gleich aus CANON_3D/lib (vendor/place).
import { placeChunk, grovePlan } from '../vendor/place/kfb-place-core.v1.mjs'
import CFG from '../vendor/place/kfb_place.r1.slim.json'
import { ZONE, zoneN, speciesN } from './zoneField.js'

// V-797 · Stilbild nach KayKit (Georg q213): Bewuchs als Massen statt Mikro-Gruppen. Waldzone (Zonenfeld) wird dicht gefüllt, Krone an Krone,
// eine Baumfamilie je Masse; am Saum lichter mit runden Büschen; Wiese fast leer (seltene Solitäre); Fels nur als große Formation am steilen Hang.
// Kein Kies, keine Kontakt-/Fußsteinchen, kein Streugras (Boden ist Material).
const KK = CFG.tiles.filter((t) => t.kit === 'KayKit Forest'), byFam = (re) => KK.filter((t) => re.test(t.id))
const FAMS = [byFam(/:Tree_1_/), byFam(/:Tree_2_/), byFam(/:Tree_3_/)], BUSH = byFam(/:Bush_(1|3)_/), SOLO = byFam(/:Tree_(1|2)_/)
const STL = CFG.tiles.filter((t) => t.kind === 'stone_L' && t.kit === 'Steinkit v4'), STM = CFG.tiles.filter((t) => t.kind === 'stone_M' && t.kit === 'Steinkit v4')
// V-799 · Stilbild 2 nach Modell R3 (Georg q217: Herriman/Noble/Lozzi + Ortsbiografie; Tipps: Stufen statt Verläufe, Poisson-Abstände, Haupt-Asset mit Ablegern).
// Quellen statt Rauschfeld: (1) Grate tragen Baumreihen als Silhouette, (2) Hangbrüche tragen wenige große Fels-Formationen, Bruchstücke nur am Fuß hangab,
// darum Bewuchs nach außen (Büschel am Fuß → Büsche 2–6 m → Bäume ab 6 m), (3) Wiese ruhig mit seltenen Solitären samt Ablegern. Alles mit Mindestabstand.
function cartoonChunk({ x0, z0, size, h, seed }) {
  let a = 2166136261 >>> 0; for (const c of `${seed}|cartoon|${x0}|${z0}`) { a ^= c.charCodeAt(0); a = Math.imul(a, 16777619) >>> 0 }
  const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)], out = [], taken = []
  const free = (x, z, r) => taken.every((q) => (q[0] - x) ** 2 + (q[1] - z) ** 2 >= ((q[2] + r) * 1.25) ** 2)   // Poisson-Abstand mit Luft ≥ 25 % (Etherington: keine Tangenten)
  const put = (t, x, z, s, role, r, child = false) => { if (!t || (!child && !free(x, z, r))) return false;   // Begleiter einer Gruppe (child) überlappen bewusst, Fremde halten Luft
    taken.push([x, z, r]); out.push({ t: t.id, k: t.kind, r: role, p: [x, h(x, z), z], ry: rnd() * 6.283, rx: 0, rz: 0, s, sk: t.kind === 'tree' ? 0.05 : t.kind === 'bush' ? 0.08 : t.kind === 'grass' ? 0.1 : 0.3, cr: 0, cc: 0 }); return true }
  const slope = (x, z) => Math.hypot(h(x + 1, z) - h(x - 1, z), h(x, z + 1) - h(x, z - 1)) / 2
  const fam = (x, z) => FAMS[Math.min(2, Math.floor(speciesN(x, z) * 3))], GRASS = KK.filter((t) => t.kind === 'grass' && /Singlesided$/i.test(t.id))
  const inCell = (x, z) => x >= x0 && z >= z0 && x < x0 + size && z < z0 + size
  // (2) Formationen an Hangbrüchen: 1 groß + 1–2 mittel, Bruchstücke 1–3 hangab am Fuß, Bewuchs nach außen
  for (let k = 0; k < 10; k++) { const x = x0 + 6 + rnd() * (size - 12), z = z0 + 6 + rnd() * (size - 12), sl = slope(x, z); if (sl < 0.4 || rnd() > 0.5) continue
    const L = pick(STL), sL = 4 + rnd() * 2, rL = ((L.gate_r_m || L.hull_r_m || 0.4)) * sL; if (!put(L, x, z, sL, 'formation', rL * 0.9)) continue
    const gx = h(x + 1, z) - h(x - 1, z), gz = h(x, z + 1) - h(x, z - 1), dn = Math.atan2(-gz, -gx)
    for (let m = 0; m < 2; m++) { const M = pick(STM), sM = sL * (m ? 0.35 : 0.6), an = dn + Math.PI + (m ? 1.1 : -0.7) + (rnd() - 0.5) * 0.4, d = rL * (0.8 + m * 0.25); put(M, x + Math.cos(an) * d, z + Math.sin(an) * d, sM, 'formation', (M.gate_r_m || 0.2) * sM * 0.8, true) }   // 1 : 0,6 : 0,35, drei Teile
    for (let m = 0, n = rnd() < 0.5 ? 1 : 3; m < n; m++) { const S = pick(STM), sS = sL * (0.15 - m * 0.03), an = dn + (rnd() - 0.5) * 0.9, d = rL * (1.15 + m * (0.4 + rnd() * 0.3)); put(S, x + Math.cos(an) * d, z + Math.sin(an) * d, sS, 'rubble', (S.gate_r_m || 0.2) * sS, true) }   // Schwerkraft: hangab, nach außen kleiner, Abstände ungleich
    for (let m = 0, n = rnd() < 0.5 ? 3 : 5; m < n; m++) { const an = dn + Math.PI + (m / (n - 1) - 0.5) * 1.6 + (rnd() - 0.5) * 0.25, d = rL * (1.02 + rnd() * 0.15); put(pick(GRASS), x + Math.cos(an) * d, z + Math.sin(an) * d, [1.2, 0.75, 0.45, 0.9, 0.6][m], 'foot', 0.15, true) }   // Büschel 3–5 gestaffelt in der Kehle bergauf
    const sunA = 2.5, ba = sunA + (rnd() - 0.5) * 1.2, bd = rL + 2 + rnd() * 2.5; let bOk = false; [1, 0.62, 0.38].forEach((f, m) => { const an = ba + [0, 0.45, -0.38][m], d = bd + [0, 0.7, 1.15][m]; const ok = put(pick(BUSH), x + Math.cos(an) * d, z + Math.sin(an) * d, 0.8 + f * 0.6, 'seam', 0.6 * f + 0.3, m > 0 && bOk); if (m === 0) bOk = ok })   // Busch-Dreier 1 : 0,62 : 0,38, nicht auf einer Linie
    for (let m = 0, n = rnd() < 0.6 ? 1 : 3; m < n; m++) { const an = dn + Math.PI + (rnd() - 0.5) * 2.4, d = rL + 6 + rnd() * 4; put(pick(fam(x, z)), x + Math.cos(an) * d, z + Math.sin(an) * d, [1.15, 0.9, 0.7][m], 'frame', 1.6) } }   // rahmende Bäume ab 6 m, 1 oder 3
  // (1) Grate: Baumreihen als Silhouette (Lozzi), Abstand nach Kronen
  for (let gz = z0 + 1.5; gz < z0 + size; gz += 3) for (let gx = x0 + 1.5; gx < x0 + size; gx += 3) {
    const c = h(gx, gz), cv = (d) => Math.max(c - (h(gx - d, gz) + h(gx + d, gz)) / 2, c - (h(gx, gz - d) + h(gx, gz + d)) / 2), conv = cv(7), conv2 = cv(16)
    if (conv > 0.8 && conv2 > 1.6 && slope(gx, gz) < 0.4 && rnd() < 0.7) { const x = gx + (rnd() - 0.5) * 2.8, z = gz + (rnd() - 0.5) * 2.8; put(pick(fam(x, z)), x, z, 0.95 + rnd() * 0.3, 'ridge', 1.45) } }   // Silhouettenreihe, aber Abstände ungleich und nie drei auf einer Linie im Raster   // nur echte Grate (zwei Maßstäbe), nicht jede Kuppe
  // (3) Wiese: seltene Solitäre mit Ablegern (Haupt-Asset erhöht die Wahrscheinlichkeit kleiner Nachbarn)
  for (let k = 0; k < 6; k++) { const x = x0 + rnd() * size, z = z0 + rnd() * size; if (slope(x, z) > 0.3 || rnd() > 0.35) continue
    if (!put(pick(SOLO), x, z, 1.15 + rnd() * 0.3, 'solitaire', 3.5)) continue
    const an0 = rnd() * 6.283; for (let m = 0, n = rnd() < 0.6 ? 2 : 4; m < n; m++) { const an = an0 + m * 2.4, d = 2.0 + m * (0.7 + rnd() * 0.5); put(pick(BUSH), x + Math.cos(an) * d, z + Math.sin(an) * d, [0.95, 0.6, 0.45, 0.35][m], 'offspring', 0.5, true) }   // Haupt-Asset + Ableger: Gruppe 3 oder 5, Größen gestaffelt
    for (let m = 0; m < 3; m++) { const an = an0 + Math.PI + (m - 1) * 0.5 + (rnd() - 0.5) * 0.3, d = 1.2 + rnd() * 0.4; put(pick(GRASS), x + Math.cos(an) * d, z + Math.sin(an) * d, [1.1, 0.7, 0.45][m], 'foot', 0.15, true) } }   // Büschel unter der Tropfkante, Schattenseite
  return out.filter((o) => inCell(o.p[0], o.p[2]))
}
function massChunk({ x0, z0, size, h, seed }) {
  let a = 2166136261 >>> 0; for (const c of `${seed}|mass|${x0}|${z0}`) { a ^= c.charCodeAt(0); a = Math.imul(a, 16777619) >>> 0 }
  const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)], out = [], G = 2.35   // Kronen schließen sich (KayKit-Masse)
  const put = (t, x, z, s, role) => out.push({ t: t.id, k: t.kind, r: role, p: [x, h(x, z), z], ry: rnd() * 6.283, rx: 0, rz: 0, s, sk: t.kind === 'tree' ? 0.05 : t.kind === 'bush' ? 0.08 : 0.35, cr: 0, cc: 0 })
  for (let gz = z0 + G / 2; gz < z0 + size; gz += G) for (let gx = x0 + G / 2; gx < x0 + size; gx += G) {
    const x = gx + (rnd() - 0.5) * G * 0.8, z = gz + (rnd() - 0.5) * G * 0.8, zn = zoneN(x, z), f = ZONE.forest, e = ZONE.edge
    const sl = Math.hypot(h(x + 1, z) - h(x - 1, z), h(x, z + 1) - h(x, z - 1)) / 2
    if (sl > 0.5 && rnd() < 0.025 && STL.length) { const L = pick(STL); put(L, x, z, 0.9 + rnd() * 0.5, 'formation'); const n = Math.floor(rnd() * 3)
      for (let k = 0; k < n; k++) { const an = rnd() * 6.283, d = 0.9 + rnd() * 0.5; put(pick(STM), x + Math.cos(an) * d, z + Math.sin(an) * d, 0.9 + rnd() * 0.4, 'formation') } continue }
    if (zn >= f) { const dens = Math.min(1, (zn - f) / 0.04 * 0.9 + 0.1); if (rnd() < dens) { const fam = FAMS[Math.min(2, Math.floor(speciesN(x, z) * 3))]; put(pick(fam), x, z, 0.95 + rnd() * 0.4, 'mass') } }
    else if (zn >= f - e) { const t = (zn - (f - e)) / e; if (rnd() < 0.35 * t) put(pick(BUSH), x, z, 0.9 + rnd() * 0.4, 'seam'); else if (rnd() < 0.12 * t) put(pick(FAMS[Math.min(2, Math.floor(speciesN(x, z) * 3))]), x, z, 0.8 + rnd() * 0.3, 'outlier') }
    else if (rnd() < 0.0025) put(pick(SOLO), x, z, 1.0 + rnd() * 0.3, 'solitaire')
  }
  return out
}

self.onmessage = (e) => {
  const { id, x0, z0, size, step, n, grid, seed, biome, mode } = e.data
  const h = (x, z) => {   // bilinear im Raster (n × n Punkte, Abstand step, Ursprung x0/z0), außen geklemmt
    const fx = Math.min(n - 1.001, Math.max(0, (x - x0) / step)), fz = Math.min(n - 1.001, Math.max(0, (z - z0) / step)), i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j
    const a = grid[j * n + i], b = grid[j * n + i + 1], c = grid[(j + 1) * n + i], d = grid[(j + 1) * n + i + 1]
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v }
  let out
  if (mode === 'cartoon') { try { out = { id, ok: true, instances: cartoonChunk({ x0, z0, size, h, seed }), report: { groups: [], grass: [] } } } catch (err) { out = { id, ok: false, error: String(err?.message || err) } } self.postMessage(out); return }
  if (mode === 'mass') { try { out = { id, ok: true, instances: massChunk({ x0, z0, size, h, seed }), report: { groups: [], grass: [] } } } catch (err) { out = { id, ok: false, error: String(err?.message || err) } } self.postMessage(out); return }
  try {
    // Zonengröße je Biom (V-784): eine Zone = 2–4 Gruppen (rules.zone); am Waldrand 32 m, also vier Zonen je 64-m-Zelle
    const zm = CFG.biomes[biome]?.zone_m || size, parts = []
    for (let zz = z0; zz < z0 + size; zz += zm) for (let xx = x0; xx < x0 + size; xx += zm) { const gp = grovePlan(CFG, seed, xx + zm / 2, zz + zm / 2)   // V-788 Hain-Ebene: Hain (enge Baumgruppen) oder Wiese je Zone
      parts.push(placeChunk({ cfg: CFG, seed, chunk: { x0: xx, z0: zz, size: zm }, terrain: { h }, biome, ...(gp ? { masks: gp.masks, recipeList: gp.recipeList } : {}) })) }
    const r = { instances: parts.flatMap((q, qi) => q.instances.map((o) => (o.group ? { ...o, group: qi + ':' + o.group } : o))), report: { groups: parts.flatMap((q) => q.report.groups), zone: { grass: parts.map((q) => q.report.zone.grass) } } }
    out = { id, ok: true, instances: r.instances.map((o) => ({ t: o.tile, k: o.kind, r: o.role, p: o.p, ry: o.rotY || 0, rx: o.rotX || 0, rz: o.rotZ || 0, s: o.s ?? 1, sk: o.sink || 0, cr: o.r, cc: o.cr, b: o.balls, fm: o.fluff_mode, ts: o.tint_step, wg: o.wind_group, wb: o.wind_bend, wp: o.wind_phase, ac: o.accent })),
      report: { groups: r.report.groups.map((g) => ({ recipe: g.recipe, g1: g.g1 })), grass: r.report.zone.grass } }
  } catch (err) { out = { id, ok: false, error: String(err?.message || err) } }
  self.postMessage(out)
}

```


## zoneField.js

```js
// V-797 · Materialzonen nach KayKit (Georg q213): ein Zonenfeld, gleich in JS (Bewuchs im Worker) und GLSL (Waldboden im Gelände-Shader).
// Wertrauschen mit ganzzahligem Hash (gleiche Bits in JS und WebGL2), zwei Oktaven. zoneN(x, z) ∈ [0, 1]; über ZONE.forest ist Waldzone.
export const ZONE = { scale: 120, forest: 0.56, edge: 0.06, seed: 1103 }

const hash = (ix, iz, s) => { let h = (Math.imul(ix, 73856093) ^ Math.imul(iz, 19349663) ^ s) >>> 0; h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995) >>> 0; h ^= h >>> 15; return (h & 0xffffff) / 16777216 }
const sm = (t) => t * t * (3 - 2 * t)
function vnoise(x, z, s) { const ix = Math.floor(x), iz = Math.floor(z), fx = sm(x - ix), fz = sm(z - iz)
  const a = hash(ix, iz, s), b = hash(ix + 1, iz, s), c = hash(ix, iz + 1, s), d = hash(ix + 1, iz + 1, s)
  return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz }
export const zoneN = (x, z) => 0.7 * vnoise(x / ZONE.scale, z / ZONE.scale, ZONE.seed) + 0.3 * vnoise(x / (ZONE.scale * 0.43), z / (ZONE.scale * 0.43), ZONE.seed + 7)
// Art je Waldmasse (ein Wald = eine Baumfamilie, wie in den KayKit-Samples): sehr grobes Feld
export const speciesN = (x, z) => vnoise(x / 420, z / 420, ZONE.seed + 31)

export const ZONE_GLSL = `
uint kfbZH(int ix, int iz, int s){ uint h = (uint(ix) * 73856093u) ^ (uint(iz) * 19349663u) ^ uint(s); h ^= h >> 13u; h *= 0x5bd1e995u; h ^= h >> 15u; return h & 0xffffffu; }
float kfbZV(vec2 p, int s){ vec2 i = floor(p), f = p - i; f = f * f * (3.0 - 2.0 * f); int x = int(i.x), z = int(i.y);
  float a = float(kfbZH(x, z, s)) / 16777216.0, b = float(kfbZH(x + 1, z, s)) / 16777216.0, c = float(kfbZH(x, z + 1, s)) / 16777216.0, d = float(kfbZH(x + 1, z + 1, s)) / 16777216.0;
  return a + (b - a) * f.x + (c - a) * f.y + (a - b - c + d) * f.x * f.y; }
float kfbZone(vec2 xz){ return 0.7 * kfbZV(xz / ${ZONE.scale.toFixed(1)}, ${ZONE.seed}) + 0.3 * kfbZV(xz / ${(ZONE.scale * 0.43).toFixed(2)}, ${ZONE.seed + 7}); }
`

```


## endlessTerrain.js

```js
// V-619 · Endloses Gelände um den Wagen (world=endless), Modul nach Host-Vertrag R1.2 §2: create(options) -> { object3d, update, dispose } plus die
// Gelände-Schnittstelle von m1-terrain (height, surfaceAt, info, colliderData) und Streams für Kollider und Bewuchs.
// Form: Höhe der Gelände-Probe (probeHeight.js, erzeugt aus der Probe, Rezept „Sanfte Hügel“, ohne Wasser/Flüsse), Platz-Anker im Ursprung wie
// world=probe (Amphitheater steht unverändert), je Biom ein Höhenfaktor über ein breites Band (biomeField). Kein Randwall: die Welt endet nie.
// Kacheln: Quadtree aus 512-m-Wurzeln, Blätter 64…512 m mit je 32 × 32 Zellen (2…16 m), fein am Wagen, grob in der Ferne. Gebaut wird zeitgeteilt
// (je Bild höchstens budgetMs) im Hintergrund der Bildschleife; ein neuer Kachelsatz erscheint erst, wenn alle seine Kacheln fertig sind (keine Löcher).
// Keine Nähte, keine Höhensprünge: Kanten zu gröberen Nachbarn werden auf deren Kante gelegt (Höhe UND Normale linear wie das grobe Dreieck),
// Normalen aus dem Höhenfeld mit einer Randreihe Überstand (gleiche Nachbarn = gleiche Normale). Kollider (Rapier-Trimesh) = genau die gezeigten
// Dreiecke der 64-m-Kacheln nahe am Wagen.
import * as THREE from 'three'
import { makeClayFamily } from '../vendor/billboard/billboard-clay.js'
import { K } from '../m1/m1Scale.js'
import { applyTerrain3 } from '../look/terrain3.js'
import { applyBiomeTerrain } from '../look/biomeTerrain.js'
import { createProbeHeight } from './probeHeight.js'
import PROBE_RECIPE from '../data/worlds/kfb-world-probe.r1.json' with { type: 'json' }
import { createBiomeField, NB } from './biomeField.js'
import { GROUND_Y, TERRAIN, terrainActive } from '../modules/m1-terrain.js'
import { CARD_HM, CARD_HM_META } from '../assets/cards/card_r3.hm.js'

export const ENDLESS = Object.freeze({ root: 512, leaf: 64, seg: 32, split: 0.85, view: 820, collR: 70, budgetMs: 2.5, replanM: 6 })
export const endlessLog = { create: 0, update: 0, dispose: 0, built: 0, swaps: 0, stitched: 0, buildMs: 0, maxSliceMs: 0 }
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

export const CARD_STAMP = Object.freeze({ halfW: 18, amp: 6, skirt: 7, ring: [70, 260], avoid: 48 })
function cardSites(h) {
  const S = CARD_STAMP.halfW, W = 2 * S, D = W * CARD_HM_META.aspect
  const stats = (cx, cz) => { let lo = 1e9, hi = -1e9; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { const v = h(cx - S + (i / 4) * W, cz - D / 2 + (j / 4) * D); lo = Math.min(lo, v); hi = Math.max(hi, v) } return { lo, hi } }
  let best = null
  for (let r = CARD_STAMP.ring[0]; r <= CARD_STAMP.ring[1]; r += 19) for (let a = 0; a < 24; a++) { const t = (a / 24) * Math.PI * 2 + r * 0.013, x = Math.cos(t) * r, z = Math.sin(t) * r
    if (Math.hypot(x, z) < CARD_STAMP.avoid + S) continue; const st = stats(x, z), sc = st.hi - st.lo + r * 0.004; if (!best || sc < best.sc) best = { x, z, sc, top: st.hi } }
  return best ? [{ kind: 'card', id: 'card_r3', x: best.x, z: best.z, hw: S, hd: D / 2, base: best.top, amp: CARD_STAMP.amp, skirt: CARD_STAMP.skirt }] : []
}
function stampHeight(stamps, x, z, h) {
  for (const st of stamps) {
    const dx = Math.abs(x - st.x) - st.hw, dz = Math.abs(z - st.z) - st.hd, out = Math.max(dx, dz, 0)
    if (out >= st.skirt) continue
    const hw = CARD_HM_META.hw, hh = CARD_HM_META.hh, u = Math.min(1, Math.max(0, (x - st.x + st.hw) / (2 * st.hw))), v = Math.min(1, Math.max(0, (z - st.z + st.hd) / (2 * st.hd)))
    const fx = u * (hw - 1), fz = v * (hh - 1), i0 = Math.floor(fx), j0 = Math.floor(fz), i1 = Math.min(hw - 1, i0 + 1), j1 = Math.min(hh - 1, j0 + 1), tx = fx - i0, tz = fz - j0
    const r = (CARD_HM[j0 * hw + i0] * (1 - tx) + CARD_HM[j0 * hw + i1] * tx) * (1 - tz) + (CARD_HM[j1 * hw + i0] * (1 - tx) + CARD_HM[j1 * hw + i1] * tx) * tz
    const top = st.base + (r - CARD_HM_META.edge) * st.amp, k = 1 - sstep(0, st.skirt, out)
    h = Math.max(h, h + (top - h) * k)   // nur auftragen
  }
  return h
}

// Höhe der endlosen Welt (ohne three; Node-Tests rechnen dieselbe Zahl)
export function createEndlessHeight(opts = {}) {
  const T = TERRAIN, field = opts.field || createBiomeField(opts.biome || {})
  const P = createProbeHeight({ ...PROBE_RECIPE, stylize: { ...PROBE_RECIPE.stylize, waterLevel: 0 } })
  const plaza = { kind: 'plaza', x: 0, z: 0, R: T.flatR, y: 0, on: false, bh: 0, bw: 0.1, open: 0, hx: 0, hz: 0, rot: 0, blend: T.blendR - T.flatR }
  plaza.y = P.ringY(plaza); plaza.on = true; P.anchors.push(plaza)
  const dy = GROUND_Y - plaza.y
  const base = (x, z) => P.height(x, z) + dy
  // Platz bleibt auf GROUND_Y: der Biom-Faktor streckt nur den Abstand zur Platzhöhe
  const h0 = (x, z, w = null) => { const m = field.sample(x, z, w); return GROUND_Y + (base(x, z) - GROUND_Y) * m }
  // Karten-Gelände (Georg q226: „aus der Karte ein Terrain geformt“, wie Probe R3): das Relief der Karte wird als Plateau aufgetragen (nur auftragen, V-716),
  // Rand fällt über einen Saum aufs Gelände. Ort: ruhigste Fläche im Ring um den Start. Bewuchs, Kollider und Kugeln lesen dieselbe Höhe.
  const stamps = opts.cards === false ? [] : cardSites(h0)
  const height = stamps.length ? (x, z, w = null) => stampHeight(stamps, x, z, h0(x, z, w)) : h0
  return { height, base, field, plazaY: plaza.y, shift: dy, stamps }
}

// Index für ein 32 × 32-Blatt (einmal für alle); Teilung wie three PlaneGeometry (a-b-d / b-c-d)
function leafIndex(seg) {
  const n = seg + 1, idx = new Uint32Array(seg * seg * 6); let k = 0
  for (let j = 0; j < seg; j++) for (let i = 0; i < seg; i++) { const a = j * n + i, b = (j + 1) * n + i, c = (j + 1) * n + i + 1, d = j * n + i + 1; idx[k++] = a; idx[k++] = b; idx[k++] = d; idx[k++] = b; idx[k++] = c; idx[k++] = d }
  return idx
}

export function createEndlessTerrain(options = {}) {
  endlessLog.create++
  const E = { ...ENDLESS, ...(options.endless || {}) }, SEG = E.seg, N = SEG + 1, NP = N + 2
  const W = createEndlessHeight(options), H = W.height, field = W.field
  const root = new THREE.Group(); root.name = 'endless-terrain'
  // Material wie m1-terrain (Knete) + terrain3-Fließfarben + Biom-Paletten mit Sprenkel-Übergang (biomeTerrain)
  const fam = makeClayFamily('G', { uClayNear: { value: 30 * K }, uClayFar: { value: 90 * K }, uClayScale: { value: 1.4 * K }, uClayAmt: { value: 0.25 } }, { oct: 2, near: true, stick: false })
  const mat = fam.std(options.biome?.top || '#9aab62', 0.95)
  const t3 = applyTerrain3(mat, { palette: 'mesa', hMin: GROUND_Y - 12, hMax: GROUND_Y + 34 })
  const bio = applyBiomeTerrain(mat, options.look || {})
  const INDEX = new THREE.BufferAttribute(leafIndex(SEG), 1)
  const leaves = new Map()        // key → Blatt (gebaut, ggf. versteckt; LRU-Cache)
  let shown = new Map()           // key → Blatt (aktueller Satz)
  let plan = null, job = null, focus = { x: 0, z: 0 }, lastPlanAt = null, frame = 0, extFocus = false, spd = 0
  const keyOf = (L, i, j) => L + ':' + i + ':' + j
  const sizeOf = (L) => E.leaf * 2 ** L, LROOT = Math.round(Math.log2(E.root / E.leaf))

  // gewünschter Blatt-Satz: Wurzeln im Sichtradius, teilen solange Kachel näher als split × Größe
  function desired(fx, fz) {
    const out = [], R = E.view, r0 = E.root
    const boxD = (x0, z0, s) => Math.hypot(Math.max(x0 - fx, 0, fx - (x0 + s)), Math.max(z0 - fz, 0, fz - (z0 + s)))
    const rec = (L, i, j) => { const s = sizeOf(L), x0 = i * s, z0 = j * s
      if (L > 0 && boxD(x0, z0, s) < s * E.split) { for (let b = 0; b < 2; b++) for (let a = 0; a < 2; a++) rec(L - 1, i * 2 + a, j * 2 + b) } else out.push({ L, i, j, key: keyOf(L, i, j) }) }
    for (let j = Math.floor((fz - R) / r0); j <= Math.floor((fz + R) / r0); j++) for (let i = Math.floor((fx - R) / r0); i <= Math.floor((fx + R) / r0); i++)
      if (boxD(i * r0, j * r0, r0) < R) rec(LROOT, i, j)
    return out
  }

  // Blatt bauen (Generator: gibt nach jeder Zeile ab, damit die Zeitscheibe hält). Rohhöhen mit Randreihe → Normalen; Biom-Gewichte je Eckpunkt
  function* buildLeaf(d) {
    const s = sizeOf(d.L), c = s / SEG, x0 = d.i * s, z0 = d.j * s, hp = new Float32Array(NP * NP), w6 = new Float32Array(NB), bw = new Float32Array(N * N * NB)
    for (let j = 0; j < NP; j++) { for (let i = 0; i < NP; i++) { const inner = i > 0 && j > 0 && i < NP - 1 && j < NP - 1
        hp[j * NP + i] = H(x0 + (i - 1) * c, z0 + (j - 1) * c, inner ? w6 : null)
        if (inner) bw.set(w6, ((j - 1) * N + (i - 1)) * NB) }
      yield }
    const h = new Float32Array(N * N), nrm = new Float32Array(N * N * 3)
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const p = (j + 1) * NP + i + 1; h[j * N + i] = hp[p]
      const gx = (hp[p + 1] - hp[p - 1]) / (2 * c), gz = (hp[p + NP] - hp[p - NP]) / (2 * c), l = Math.hypot(gx, 1, gz), k = (j * N + i) * 3
      nrm[k] = -gx / l; nrm[k + 1] = 1 / l; nrm[k + 2] = -gz / l }
    const pos = new Float32Array(N * N * 3), A = new Float32Array(N * N * 3), B = new Float32Array(N * N * 3)
    let lo = Infinity, hi = -Infinity
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const v = j * N + i; pos[v * 3] = x0 + i * c; pos[v * 3 + 1] = h[v]; pos[v * 3 + 2] = z0 + j * c; lo = Math.min(lo, h[v]); hi = Math.max(hi, h[v])
      for (let b = 0; b < 3; b++) { A[v * 3 + b] = bw[v * NB + b]; B[v * 3 + b] = bw[v * NB + 3 + b] } }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nrm.slice(), 3))
    geo.setAttribute('aBioA', new THREE.BufferAttribute(A, 3)); geo.setAttribute('aBioB', new THREE.BufferAttribute(B, 3)); geo.setIndex(INDEX)
    geo.boundingBox = new THREE.Box3(new THREE.Vector3(x0, lo - 2, z0), new THREE.Vector3(x0 + s, hi + 2, z0 + s)); geo.boundingSphere = geo.boundingBox.getBoundingSphere(new THREE.Sphere())
    const mesh = new THREE.Mesh(geo, mat); mesh.name = 'endless:' + d.key; mesh.receiveShadow = true; mesh.matrixAutoUpdate = false; mesh.visible = false
    root.add(mesh); endlessLog.built++
    return { ...d, s, c, x0, z0, h, nrm, bw, mesh, geo, sig: '', used: frame, coll: null }
  }

  // Blatt, das den Punkt (x, z) im aktuellen Satz enthält (fein → grob)
  const leafAt = (x, z, set = shown) => { for (let L = 0; L <= LROOT; L++) { const s = sizeOf(L), b = set.get(keyOf(L, Math.floor(x / s), Math.floor(z / s))); if (b) return b } return null }
  // Höhe/Normale eines Blatts auf seiner Kante bei (x, z) (linear zwischen den Kanten-Eckpunkten = das gezeigte Dreieck auf dieser Kante)
  function edgeSample(b, x, z, out) {
    const u = (x - b.x0) / b.c, v = (z - b.z0) / b.c, i = Math.min(SEG, Math.max(0, u)), j = Math.min(SEG, Math.max(0, v))
    const onX = Math.abs(j - Math.round(j)) < 1e-4 // Kante entlang x (j fest)
    const t = onX ? i : j, a = Math.min(SEG - 1, Math.floor(t)), f = t - a
    const ia = onX ? Math.round(j) * N + a : a * N + Math.round(i), ib = onX ? ia + 1 : ia + N
    out[0] = b.h[ia] + (b.h[ib] - b.h[ia]) * f
    for (let k = 0; k < 3; k++) out[1 + k] = b.nrm[ia * 3 + k] + (b.nrm[ib * 3 + k] - b.nrm[ia * 3 + k]) * f
  }
  // Kanten an gröbere Nachbarn anlegen; Signatur = Größen der Nachbarn je Kante (nur bei Änderung neu schreiben)
  const _e = new Float32Array(4)
  function stitch(b, set) {
    const eps = b.c * 0.25, sides = [[0, -1], [1, 0], [0, 1], [-1, 0]], nb = sides.map(([dx, dz]) => { const q = leafAt(b.x0 + b.s / 2 + dx * (b.s / 2 + eps), b.z0 + b.s / 2 + dz * (b.s / 2 + eps), set); return q && q.L > b.L ? q : null })
    // Ecken: trifft dort eine gröbere Kachel (auch nur über Eck), gilt deren Normale (sonst sähen drei feine und eine grobe Kachel am selben Punkt verschieden aus)
    const corners = [[0, 0], [SEG, 0], [SEG, SEG], [0, SEG]].map(([i, j]) => { const x = b.x0 + i * b.c, z = b.z0 + j * b.c; let best = null
      for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const q = leafAt(x + dx * eps, z + dz * eps, set); if (q && q.L > b.L && (!best || q.L > best.L)) best = q }
      return best && { q: best, i, j, x, z } })
    const sig = nb.map((q) => (q ? q.key : '-')).join('|') + '#' + corners.map((c) => (c ? c.q.key : '-')).join('|'); if (sig === b.sig) return false
    b.sig = sig; const pos = b.geo.attributes.position.array, nr = b.geo.attributes.normal.array
    for (let v = 0; v < N * N; v++) pos[v * 3 + 1] = b.h[v]; nr.set(b.nrm)
    const put = (v) => { pos[v * 3 + 1] = _e[0]; const l = Math.hypot(_e[1], _e[2], _e[3]) || 1; nr[v * 3] = _e[1] / l; nr[v * 3 + 1] = _e[2] / l; nr[v * 3 + 2] = _e[3] / l }
    nb.forEach((q, s) => { if (!q) return
      for (let t = 0; t < N; t++) { const i = s === 0 ? t : s === 1 ? SEG : s === 2 ? t : 0, j = s === 0 ? 0 : s === 1 ? t : s === 2 ? SEG : t
        edgeSample(q, b.x0 + i * b.c, b.z0 + j * b.c, _e); put(j * N + i) } })   // Punkt auf der gemeinsamen Kante: Höhe und Normale wie das grobe Dreieck
    for (const c of corners) if (c) { edgeSample(c.q, c.x, c.z, _e); put(c.j * N + c.i) }
    b.geo.attributes.position.needsUpdate = true; b.geo.attributes.normal.needsUpdate = true; endlessLog.stitched++
    return true
  }

  // Zeitscheibe: Plan → fehlende Blätter bauen → Satz tauschen
  function replan(fx, fz) {
    const want = desired(fx, fz), missing = want.filter((d) => !leaves.has(d.key))
    plan = { want, missing, at: { x: fx, z: fz } }; job = null
  }
  function work(budget) {
    if (!plan) return
    const t0 = performance.now()
    while (performance.now() - t0 < budget) {
      if (!job) { const d = plan.missing.shift(); if (!d) break; if (leaves.has(d.key)) continue; job = { d, it: buildLeaf(d) } }
      const r = job.it.next(); if (r.done) { leaves.set(job.d.key, r.value); job = null }
    }
    if (!job && !plan.missing.length) { const ts = performance.now(); swap(); endlessLog.maxSwapMs = Math.max(endlessLog.maxSwapMs || 0, performance.now() - ts) }
    const ms = performance.now() - t0; endlessLog.buildMs += ms; endlessLog.maxSliceMs = Math.max(endlessLog.maxSliceMs, ms)
  }
  function swap() {
    const next = new Map(); for (const d of plan.want) { const b = leaves.get(d.key); if (b) { b.used = frame; next.set(d.key, b) } }
    for (const [k, b] of shown) if (!next.has(k)) b.mesh.visible = false
    for (const b of next.values()) { b.mesh.visible = true }
    for (const b of next.values()) stitch(b, next)
    shown = next; plan = null; endlessLog.swaps++
    // Cache begrenzen (älteste unsichtbare Blätter freigeben)
    if (leaves.size > 420) { const old = [...leaves.values()].filter((b) => !shown.has(b.key)).sort((a, b) => a.used - b.used); for (const b of old.slice(0, leaves.size - 360)) { root.remove(b.mesh); b.geo.dispose(); leaves.delete(b.key) } }
    for (const fn of listeners) fn(shown)
  }
  const listeners = new Set()

  // Start: ersten Satz um den Ursprung (bzw. options.focus) sofort ganz bauen
  { const f = options.focus || { x: 0, z: 0 }; focus = { ...f }; replan(f.x, f.z); lastPlanAt = { ...f }; work(1e9) }

  // Oberfläche der gezeigten Dreiecke (wie m1-terrain.surfaceAt): Teilung a-b-d / b-c-d
  function surfaceAt(x, z, b = leafAt(x, z)) {
    if (!b) return H(x, z)
    const pos = b.geo.attributes.position.array, u0 = (x - b.x0) / b.c, v0 = (z - b.z0) / b.c, i = Math.min(SEG - 1, Math.max(0, Math.floor(u0))), j = Math.min(SEG - 1, Math.max(0, Math.floor(v0))), u = u0 - i, v = v0 - j
    const Y = (ii, jj) => pos[((jj * N) + ii) * 3 + 1], ha = Y(i, j), hb = Y(i, j + 1), hc = Y(i + 1, j + 1), hd = Y(i + 1, j)
    return u + v <= 1 ? ha + (hd - ha) * u + (hb - ha) * v : hc + (hb - hc) * (1 - u) + (hd - hc) * (1 - v)
  }
  const height = (x, z) => H(x, z)
  terrainActive.height = height; terrainActive.minY = GROUND_Y - 40

  // Kollider: 64-m-Blätter im Umkreis collR um den Fokus (Daten = gezeigte Dreiecke). collider(world) liefert Diff { add: [{ key, vertices, indices }], remove: [key] }
  const collOn = new Map()
  function colliderDiff() {
    const add = [], remove = [], want = new Set()
    for (const b of shown.values()) { if (b.L !== 0) continue; const dx = Math.max(b.x0 - focus.x, 0, focus.x - (b.x0 + b.s)), dz = Math.max(b.z0 - focus.z, 0, focus.z - (b.z0 + b.s)); if (Math.hypot(dx, dz) > E.collR) continue
      want.add(b.key); if (collOn.get(b.key) === b.sig) continue
      if (collOn.has(b.key)) remove.push(b.key)   // Kante neu angelegt: Kollider ersetzen
      collOn.set(b.key, b.sig); add.push({ key: b.key, vertices: new Float32Array(b.geo.attributes.position.array), indices: INDEX.array }) }
    for (const k of [...collOn.keys()]) if (!want.has(k)) { remove.push(k); collOn.delete(k) }
    return { add, remove }
  }

  const info = () => ({ world: 'endless', leaves: shown.size, cached: leaves.size, tris: shown.size * SEG * SEG * 2, built: endlessLog.built, swaps: endlessLog.swaps, stitched: endlessLog.stitched, maxSliceMs: +endlessLog.maxSliceMs.toFixed(2), maxSwapMs: +(endlessLog.maxSwapMs || 0).toFixed(2), pending: plan ? plan.missing.length + (job ? 1 : 0) : 0, focus: [+focus.x.toFixed(1), +focus.z.toFixed(1)], flatR: TERRAIN.flatR, groundY: GROUND_Y, cell: E.leaf / SEG })
  return {
    object3d: root,
    height, surfaceAt, info, field, stamps: W.stamps,
    resetStats() { endlessLog.maxSliceMs = 0; endlessLog.maxSwapMs = 0 },
    leaves: () => shown, leafAt: (x, z) => leafAt(x, z), onSwap: (fn) => { listeners.add(fn); fn(shown); return () => listeners.delete(fn) }, colliderDiff,
    biomeAt: (x, z, out) => field.weights(x, z, out),
    colliderData: () => null,   // Kollider streamt der Host (EndlessDrive) über colliderDiff
    // Fokus (Wagen bzw. Figur) setzt der Host je Bild; ohne Fokus folgt das Gelände der Kamera
    setFocus(x, z, speed = 0) { focus.x = x; focus.z = z; extFocus = true; spd = speed },
    flush() { if (!plan) replan(focus.x, focus.z); work(1e9) },
    material: mat, biomeLook: bio,
    update(dt = 1 / 60, ctx) { endlessLog.update++; frame++
      if (!extFocus && ctx?.camera) { focus.x = ctx.camera.position.x; focus.z = ctx.camera.position.z }
      if (!plan && Math.hypot(focus.x - lastPlanAt.x, focus.z - lastPlanAt.z) > E.replanM) { replan(focus.x, focus.z); lastPlanAt = { ...focus } }
      work(E.budgetMs); t3.update(dt, spd); bio.update?.(dt) },
    dispose() { endlessLog.dispose++; if (terrainActive.height === height) { terrainActive.height = null; terrainActive.minY = null } for (const b of leaves.values()) b.geo.dispose(); mat.dispose(); root.clear(); listeners.clear() },
  }
}

```


## keepout.js

```js
// Freiflächen für Module, die selbst Boden zeigen (z. B. das Karten-Relief): der Bewuchs lässt diese Rechtecke frei.
// Einträge { x, z, hw, hd, pad }; hw/hd = halbe Breite/Tiefe in m, pad = Saum ohne Bewuchs.
export const KEEPOUT = []
export const inKeepout = (x, z) => KEEPOUT.some((r) => Math.abs(x - r.x) < r.hw + (r.pad || 0) && Math.abs(z - r.z) < r.hd + (r.pad || 0))

```


## cardRelief.js

```js
// Karten-Relief im wabernden Gelände (Georg 25.10., V-751/V-735, Probe R3 q197): eine KFB-Karte liegt als Knetkugel-Relief im Boden der endlosen Welt.
// Farben aus dem Schema des Bioms an der Stelle (dieselben sechs Bandrollen wie das Gelände), dunkle Linien und Kartenrand als KFB-Tusche #1f1a14.
// GPU-Partikel wie Probe R3 (GPUComputationRenderer, WebGL): Schwerkraft, Abprallen, Rückkehr ins Relief; die Figur stößt die Kugeln weg.
// Ort und Relief: das Karten-Gelände der endlosen Welt (terrain.stamps, endlessTerrain cardSites/stampHeight); die Kugeln liegen auf dieser Höhe, gelaufen und gefahren wird auf dem Gelände.
// Modul nach Host-Vertrag R1: create(options) → { object3d, update(dt, ctx), dispose(), info() }. options: { terrain, gl, palettes (BIOME_PALETTES, live), palState (PAL_STATE mit listeners), pick? }
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import PTS_URL from '../assets/cards/card_r3.pts.bin?url'
import HM_URL from '../assets/cards/card_r3.hm.bin?url'
import META from '../assets/cards/card_r3.meta.json' with { type: 'json' }
import { KEEPOUT } from './keepout.js'

export const CARD = Object.freeze({ side: 256, halfW: 18, amp: 3.2, ring: [70, 260], avoid: 48, ink: '#1f1a14', inkLuma: 0.2, border: 0.012 })
const BAND_ROLES = ['peak', 'sand', 'low', 'mid', 'high', 'band6']   // dieselben Rollen wie die sechs Fließbänder (biomeTerrain)
const lum = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b

export function createCardRelief({ terrain: T, gl, palettes, palState = null, pick = null } = {}) {
  const root = new THREE.Group(); root.name = 'card-relief'
  const S = CARD.halfW, AMP = CARD.amp, W = 2 * S, D = 2 * S * META.aspect, SIDE = CARD.side, N = SIDE * SIDE
  const st = { ready: false, err: null, site: null, biome: -1, sim: false, t: 0, last: null }
  let gpu = null, velVar = null, posVar = null, mat = null, home = null, SU = null, pts = null, raw = null

  // Ort: flachste Kartenfläche im Ring um den Start (Höhen-Spannweite über 5 × 5 Proben)
  const span = (cx, cz) => { let lo = 1e9, hi = -1e9; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { const h = T.height(cx - S + (i / 4) * W, cz - D / 2 + (j / 4) * D); lo = Math.min(lo, h); hi = Math.max(hi, h) } return hi - lo }
  const findSite = () => { let best = null; for (let r = CARD.ring[0]; r <= CARD.ring[1]; r += 19) for (let a = 0; a < 24; a++) { const t = (a / 24) * Math.PI * 2 + r * 0.013, x = Math.cos(t) * r, z = Math.sin(t) * r
    if (Math.hypot(x, z) < CARD.avoid + S) continue; const s = span(x, z) + r * 0.004; if (!best || s < best.s) best = { x, z, s } } return best }

  // Farben: Punkt-Helligkeit → nächste der sechs Bandrollen (nach Helligkeit sortiert); dunkle Linien und Rand als Tusche
  const col = new Float32Array(N * 3), size = new Float32Array(N), ref = new Float32Array(N * 2)
  const recolor = () => { if (!raw || !st.site) return; const P = palettes[st.biome] || palettes[0]; if (!P) return
    const ramp = BAND_ROLES.map((r) => new THREE.Color(P[r] || P.mid)).sort((a, b) => lum(a) - lum(b)), ink = new THREE.Color(CARD.ink)
    // Helligkeit über Quantile auf die sechs Rollen verteilen (die Karte ist hell; sonst landet fast alles in der hellsten Rolle)
    const L = new Float32Array(N); for (let i = 0; i < N; i++) L[i] = 0.299 * raw[i * 7 + 3] + 0.587 * raw[i * 7 + 4] + 0.114 * raw[i * 7 + 5]
    const srt = Array.from(L).filter((l) => l >= CARD.inkLuma).sort((a, b) => a - b), q = [1, 2, 3, 4, 5].map((k) => srt[Math.floor((k / 6) * (srt.length - 1))] ?? 1)
    for (let i = 0; i < N; i++) { const x = raw[i * 7], y = raw[i * 7 + 1], l = L[i]
      const edge = 1 - Math.abs(x) < CARD.border * 2 || META.aspect - Math.abs(y) < CARD.border * 2
      let k = 0; while (k < 5 && l > q[k]) k++
      const c = l < CARD.inkLuma || edge ? ink : ramp[k]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b }
    pts?.geometry.attributes.col && (pts.geometry.attributes.col.needsUpdate = true) }

  // Ort sofort (vor dem Laden), damit der Bewuchs die Kartenfläche von Anfang an frei lässt
  const stamp = T.stamps?.find((x) => x.kind === 'card'); st.site = pick ? pick() : stamp ? { x: stamp.x, z: stamp.z } : findSite(); const keep = st.site ? { x: st.site.x, z: st.site.z, hw: S, hd: D / 2, pad: 2.5 } : null; if (keep) KEEPOUT.push(keep)
  const build = (HM) => {
    const site = st.site; if (!site) { st.err = 'kein Ort'; return }
    { const w6 = new Float32Array(6); T.biomeAt?.(site.x, site.z, w6); let bi = 0; for (let k = 1; k < 6; k++) if (w6[k] > w6[bi]) bi = k; st.biome = bi }
    // Boden-Textur über der Karte: Gelände + Relief (Höhe der Kugel-Ruhelage), Rand läuft auf das Gelände aus
    const hw = META.hw, hh = META.hh, G = new Float32Array(hw * hh), x0 = site.x - S, z0 = site.z - D / 2
    for (let j = 0; j < hh; j++) for (let i = 0; i < hw; i++) { const u = (i + 0.5) / hw, v = (j + 0.5) / hh, x = x0 + u * W, z = z0 + v * D
      // mit Karten-Gelände (stamp) trägt das Gelände selbst das Relief; sonst legt das Modul es wie Probe R3 obenauf
      const fade = Math.min(1, Math.min(u, 1 - u, v, 1 - v) / 0.04); G[j * hw + i] = T.height(x, z) + (stamp ? 0 : (HM[j * hw + i] - META.edge) * AMP * fade) + 0.08 }
    const gTex = new THREE.DataTexture(G, hw, hh, THREE.RedFormat, THREE.FloatType); gTex.magFilter = gTex.minFilter = THREE.LinearFilter; gTex.needsUpdate = true
    const gAt = (x, z) => { const u = Math.min(hw - 1, Math.max(0, Math.floor(((x - x0) / W) * hw))), v = Math.min(hh - 1, Math.max(0, Math.floor(((z - z0) / D) * hh))); return G[v * hw + u] }
    gpu = new GPUComputationRenderer(SIDE, SIDE, gl)
    const pos0 = gpu.createTexture(), vel0 = gpu.createTexture(); home = gpu.createTexture()
    for (let i = 0; i < N; i++) { const x = site.x + raw[i * 7] * S, z = site.z - raw[i * 7 + 1] * S, y = gAt(x, z) + 0.05
      home.image.data.set([x, y, z, 1], i * 4); pos0.image.data.set([x, y, z, 1], i * 4); size[i] = raw[i * 7 + 6]
      ref[i * 2] = ((i % SIDE) + 0.5) / SIDE; ref[i * 2 + 1] = (Math.floor(i / SIDE) + 0.5) / SIDE }
    const common = `
  uniform sampler2D tHome, tGround; uniform float uDt, uBounce, uReturn, uKick; uniform vec4 uP; uniform vec3 uPV, uKickPos;
  float ground(vec2 xz){ vec2 uv=(xz-vec2(${x0.toFixed(3)},${z0.toFixed(3)}))/vec2(${W.toFixed(3)},${D.toFixed(3)}); return texture2D(tGround, clamp(uv, 0.0, 1.0)).r; }`
    velVar = gpu.addVariable('tVel', common + `
  void main(){ vec2 uv=gl_FragCoord.xy/resolution.xy; vec3 p=texture2D(tPos,uv).xyz, v=texture2D(tVel,uv).xyz, h=texture2D(tHome,uv).xyz;
    vec3 toH=h-p; float spd=length(v), kk=uReturn*4.0, cc=2.0*sqrt(max(kk,1e-4)), air=step(ground(p.xz)+0.02,p.y);
    v.y-=9.8*uDt*air; v+=(toH*kk - v*cc*(0.35+0.65*(1.-air)))*uDt; if(length(toH)<0.03 && spd<0.25) v*=0.5;
    { vec3 d=p-uP.xyz; float L=length(d); if(L<uP.w){ vec3 n=d/max(L,1e-3); n.y=abs(n.y)+0.35; n=normalize(n); v+=n*(uP.w-L)*14.+uPV*0.55; } }
    if(uKick>0.){ vec3 d=p-uKickPos; float L=length(d); if(L<6.) v+=normalize(d+vec3(0.,1.2,0.))*uKick*(1.-L/6.)*(0.6+fract(sin(dot(uv,vec2(12.9,78.2)))*437.)*0.8); }
    float g=ground(p.xz); if(p.y+v.y*uDt<g){ if(v.y<0.) v.y=-v.y*uBounce; v.xz*=1.-1.8*uDt; }
    gl_FragColor=vec4(v,1.); }`, vel0)
    posVar = gpu.addVariable('tPos', common + `
  void main(){ vec2 uv=gl_FragCoord.xy/resolution.xy; vec3 p=texture2D(tPos,uv).xyz, v=texture2D(tVel,uv).xyz; p+=v*uDt; float g=ground(p.xz); if(p.y<g) p.y=g; gl_FragColor=vec4(p,1.); }`, pos0)
    gpu.setVariableDependencies(velVar, [posVar, velVar]); gpu.setVariableDependencies(posVar, [posVar, velVar])
    SU = { tHome: { value: home }, tGround: { value: gTex }, uDt: { value: 0.016 }, uBounce: { value: 0.45 }, uReturn: { value: 0.6 }, uKick: { value: 0 },
      uP: { value: new THREE.Vector4(0, -999, 0, 0.9) }, uPV: { value: new THREE.Vector3() }, uKickPos: { value: new THREE.Vector3() } }
    for (const vv of [velVar, posVar]) Object.assign(vv.material.uniforms, SU)
    const e = gpu.init(); if (e) { st.err = e; return }
    recolor()
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); g.setAttribute('ref', new THREE.BufferAttribute(ref, 2)); g.setAttribute('col', new THREE.BufferAttribute(col, 3)); g.setAttribute('psize', new THREE.BufferAttribute(size, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(site.x, gAt(site.x, site.z), site.z), S * 1.3)
    // Darstellung: Knetkugel-Sprites, Licht aus der Sonnenrichtung des einen Rigs (uSun, vom Host gesetzt), weich wie Knete, kein Glanz
    mat = new THREE.ShaderMaterial({ uniforms: { tPos: { value: null }, uPix: { value: gl.getPixelRatio() }, uSun: { value: new THREE.Vector3(-0.4, 0.7, 0.6).normalize() }, uFog: { value: new THREE.Color('#cfe0ea') }, uFogR: { value: new THREE.Vector2(120, 420) } },
      vertexShader: `attribute vec2 ref; attribute vec3 col; attribute float psize; uniform sampler2D tPos; uniform float uPix; varying vec3 vC; varying float vD;
  void main(){ vec3 p=texture2D(tPos,ref).xyz; vC=col; vec4 mv=modelViewMatrix*vec4(p,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; gl_PointSize=psize*uPix*${(80 * S / 10).toFixed(1)}/-mv.z; }`,
      fragmentShader: `uniform vec3 uSun, uFog; uniform vec2 uFogR; varying vec3 vC; varying float vD;
  void main(){ vec2 c=gl_PointCoord*2.-1.; float r2=dot(c,c); if(r2>1.) discard; vec3 n=normalize(vec3(c.x,-c.y,sqrt(1.-r2)));
    vec3 l=normalize((viewMatrix*vec4(uSun,0.)).xyz); float sh=.62+.38*max(dot(n,l),0.); vec3 o=vC*sh;
    o=mix(o, uFog, smoothstep(uFogR.x, uFogR.y, vD)); gl_FragColor=vec4(o,1.); }` })
    pts = new THREE.Points(g, mat); pts.name = 'card-relief-points'; root.add(pts)
    // eine Rechnung zum Start, damit die Kugeln sofort liegen
    gpu.compute(); mat.uniforms.tPos.value = gpu.getCurrentRenderTarget(posVar).texture
    st.ready = true
  }

  Promise.all([fetch(PTS_URL).then((r) => r.arrayBuffer()), fetch(HM_URL).then((r) => r.arrayBuffer())])
    .then(([a, b]) => { raw = new Float32Array(a); build(new Float32Array(b)) }).catch((e) => { st.err = String(e) })
  const onPal = () => recolor(); palState?.listeners?.add?.(onPal)

  return {
    object3d: root,
    update(dt, ctx) {
      if (!st.ready) return
      const pl = ctx?.player, near = pl && st.site ? Math.hypot(pl.x - st.site.x, pl.z - st.site.z) < S * 3 : false
      if (pl) { if (st.last && dt > 0) SU.uPV.value.set((pl.x - st.last.x) / dt, (pl.y - st.last.y) / dt, (pl.z - st.last.z) / dt).clampLength(0, 20); st.last = { x: pl.x, y: pl.y, z: pl.z }; SU.uP.value.set(pl.x, pl.y + 0.4, pl.z, 0.9) }
      st.t += dt; if (near) st.until = st.t + 6   // nach Stoß oder Besuch 6 s weiterrechnen, bis die Kugeln wieder liegen
      st.sim = near || st.t < (st.until || 0)
      if (!st.sim) return
      SU.uDt.value = Math.min(dt, 1 / 30); gpu.compute(); mat.uniforms.tPos.value = gpu.getCurrentRenderTarget(posVar).texture
      SU.uKick.value = Math.max(0, SU.uKick.value - dt * 40)
    },
    kick(x, y, z, k = 14) { if (!SU) return; SU.uKickPos.value.set(x, y, z); SU.uKick.value = k; st.until = st.t + 6 },
    setSun(dir) { mat?.uniforms.uSun.value.copy(dir).normalize() },
    info: () => ({ ready: st.ready, err: st.err, site: st.site, biome: st.biome, sim: st.sim, n: N }),
    dispose() { palState?.listeners?.delete?.(onPal); if (keep) KEEPOUT.splice(KEEPOUT.indexOf(keep), 1); gpu?.dispose?.(); pts?.geometry.dispose(); mat?.dispose() },
  }
}

```


## placeVeg.js

```js
// V-782 · kfb-place im Spiel (Schalter veg=core): ersetzt die Rasterstreuung von endlessVeg durch das Rezept des Kern-Moduls (Regeln V-749 ff.,
// Löser CANON_3D/lib/kfb-place-core.v1.mjs, gleiche Daten wie der Blender-Adapter). Gleiche Schnittstelle wie createEndlessVeg (Host-Vertrag R1.2 §2).
// Je 64-m-Zelle: Höhenraster vom Gelände (zeitgeteilt) → Worker rechnet das Rezept → Instanzen in BatchedMesh je Materialgruppe.
// Kit-Teile unverändert (V-574): KayKit Forest (gleicher Pin wie orchard3d) und Steinkit v4; Knete über kfb-clay v1.1 (V-429); Kontaktstücke aus dem
// Steinkit wie im Blender-Adapter (deterministisch je Instanz, Größe aus dem Radius des Lösers); Fluff als Knet-Kugeln je Nest (Größen 1 : 0,62 : 0,38).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { BIOMES, NB } from './biomeField.js'
import { BIOME_PALETTES, PAL_STATE } from '../look/biomeTerrain.js'
import { sway } from './kfbWind.js'
import { M_PER_RIG } from '../worldScale.js'
import { TERRAIN } from '../modules/m1-terrain.js'
import { applyClay } from '../vendor/clay/kfb-clay.v1.1.js'
import CFG from '../vendor/place/kfb_place.r1.slim.json'
import STEIN_URL from '../assets/place/kfb_stone_kit.v4.glb?url'
import { KEEPOUT, inKeepout } from './keepout.js'   // Freiflächen (Karten-Relief)
import FOREST_URL from '../assets/place/kaykit_forest_kfb.glb?url'   // V-788: alle genutzten KayKit-Forest-Kacheln in einer Datei (scripts/place/pack-kaykit-forest.mjs)

const CELL = 64, STEP = 2, NG = CELL / STEP + 1
const TILES = new Map(CFG.tiles.map((t) => [t.id, t]))
const SMALLS = CFG.tiles.filter((t) => t.kind === 'stone_S')
const FLUFF = { heroic: '#d97c3a', forbidden: '#a64670', mystical: '#6b4e7d', absurd: '#e9c14a' }   // satte Story-Mode-Töne (V-292, V-305, V-770)
// Materialgruppen: Kit, Schattenwurf, Knet-Profil, Bezugsgröße (lokale Kit-Einheiten), Wind
const GROUPS = {
  kk: { cast: true, ref: 5, k: 0.006, cap: 14000 },   // Waldmassen (V-797) brauchen mehr als Mikro-Gruppen          // KayKit Bäume, Büsche, Felsen
  grass: { cast: false, ref: 0.6, k: 0.16, cap: 9000 },    // KayKit Gras-Büschel (V-769)
  stone: { cast: true, ref: 1, k: 0, cap: 12000 },         // Steinkit v4 (Steine, Kiesel, Kontaktstücke)
}
const groupOf = (t) => (t.kit === 'Steinkit v4' ? 'stone' : t.kind === 'grass' ? 'grass' : 'kk')
// Farbplatten wie im MVP-Bewuchs (endlessVeg, Georg: Props in den Cartoon-Biom-Platten): die Kit-Textur liefert nur Hell/Dunkel, der Farbton kommt aus der Palette
function plateTint(mat, twoTone = false) {
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); sh.uniforms.uKfbTwoTone = { value: twoTone ? 1 : 0 }; sh.fragmentShader = 'uniform float uKfbTwoTone;\n' + sh.fragmentShader
    // Platte vor dem Knet-Block berechnen und danach wieder setzen: der Knet-Pull (kfbPull) zöge die Rollenfarbe sonst zurück auf seine Grüntöne
    sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', `vec3 kfbPlateC = diffuseColor.rgb;
#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
  { vec3 tx = diffuseColor.rgb; float lumT = dot(tx, vec3(0.2126, 0.7152, 0.0722));
    // Kit-Atlas: Laub grünlich, Stamm/Holz bräunlich → Krone nimmt die Instanzfarbe, Stamm die J17-Regel (Laub − 105°, dunkler), zwei Farben je Baum
    float woody = smoothstep(0.0, 0.08, tx.r - tx.g);
    vec3 c = vColor.rgb; vec4 k4 = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0); vec4 pp = mix(vec4(c.bg, k4.wz), vec4(c.gb, k4.xy), step(c.b, c.g)); vec4 q = mix(vec4(pp.xyw, c.r), vec4(c.r, pp.yzx), step(pp.x, c.r));
    float d = q.x - min(q.w, q.y); vec3 hsv = vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 1e-10)), d / (q.x + 1e-10), q.x); hsv.x = fract(hsv.x - 105.0 / 360.0); hsv.z *= 0.62;
    vec3 bark = hsv.z * mix(vec3(1.0), clamp(abs(mod(hsv.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0), hsv.y);
    kfbPlateC = mix(c, bark, woody * uKfbTwoTone) * mix(0.55, 1.15, smoothstep(0.02, 0.3, lumT)); }
#endif
diffuseColor.rgb = kfbPlateC;`).replace('diffuseColor.rgb = kfbPull( diffuseColor.rgb );', 'diffuseColor.rgb = kfbPull( diffuseColor.rgb ); diffuseColor.rgb = kfbPlateC;') }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|plateTint' + (twoTone ? '2' : ''); mat.needsUpdate = true
}
export const MASS = typeof location !== 'undefined' && /(^|[#,])veg=mass(,|$)/.test(location.hash)
export const CARTOON = typeof location !== 'undefined' && /(^|[#,])veg=cartoon(,|$)/.test(location.hash)   // V-799 Stilbild 2 (Modell R3)   // V-797 Stilbild: Zonen + Massen (Georg q213)
export const placeLog = { create: 0, cells: 0, instances: 0, fails: 0, lastError: null, maxMs: 0, workerMs: 0 }

export function createPlaceVeg(options = {}) {
  placeLog.create++
  const T = options.terrain, H = (x, z) => T.height(x, z), BUDGET = options.budgetMs ?? 1.5, SEED = options.seed || 'kfb-endless-r1'
  const root = new THREE.Group(); root.name = 'place-veg'
  const geos = new Map(), batches = {}; let ready = false, alive = true
  // Laden: alle KayKit-Kacheln einzeln, Steinkit als eine Datei mit Knoten
  const loader = new GLTFLoader(), kayTiles = CFG.tiles.filter((t) => t.kit === 'KayKit Forest'); let pending = 2
  const take = (id, mesh, grp) => { mesh.updateMatrixWorld(true); const g0 = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld), g = new THREE.BufferGeometry()
    for (const a of ['position', 'normal', 'uv', 'color']) if (g0.attributes[a]) g.setAttribute(a, g0.attributes[a])
    g.setIndex(g0.index ? g0.index : [...Array(g0.attributes.position.count).keys()]); geos.set(id, { grp, geo: g, mat: mesh.material }) }
  const done = () => { if (--pending === 0 && alive) build() }
  loader.load(FOREST_URL, (g) => { g.scene.updateMatrixWorld(true); const byName = new Map()
    for (const n of g.scene.children) { let m = n.isMesh ? n : null; if (!m) n.traverse((o) => { if (o.isMesh && !m) m = o }); if (m) byName.set(n.name, m) }
    for (const t of kayTiles) { const m = byName.get(t.path.split('/').pop().replace(/\.gltf$/, '')); if (m) take(t.id, m, groupOf(t)); else placeLog.lastError = 'kaykit fehlt: ' + t.path }
    done() }, undefined, (e) => { placeLog.lastError = 'kaykit: ' + (e?.message || e); done() })
  loader.load(STEIN_URL, (g) => { g.scene.updateMatrixWorld(true); const byName = new Map(); g.scene.traverse((o) => { if (o.isMesh) byName.set(o.name, o); else if (o.children?.[0]?.isMesh) byName.set(o.name, o.children[0]) })
    for (const t of CFG.tiles) if (t.kit === 'Steinkit v4') { const m = byName.get(t.path.split('#')[1]); if (m && !geos.has('n:' + t.path)) take('n:' + t.path, m, 'stone') }
    done() }, undefined, done)
  const geoKey = (t) => (t.kit === 'Steinkit v4' ? 'n:' + t.path : t.id)
  function build() {
    for (const [name, G] of Object.entries(GROUPS)) { const list = [...geos].filter(([, v]) => v.grp === name); if (!list.length) continue
      let nv = 0, ni = 0; for (const [, v] of list) { nv += v.geo.attributes.position.count; ni += v.geo.index.count }
      // Vertex-Farben (Steinkit COLOR_0) nur, wenn alle Teile sie haben; sonst weg, sonst liest das Material Schwarz (Critic R1: schwarze Steine)
      const vc = name === 'stone' && list.every(([, v]) => v.geo.attributes.color); if (!vc) for (const [, v] of list) v.geo.deleteAttribute('color')
      // KayKit/Gras: weißes Vertex-Farb-Attribut, damit USE_COLOR auch im Fragment-Shader steht (die Batch-Instanzfarbe läuft in three r186 nur über vColor)
      if (!vc) for (const [, v] of list) v.geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(v.geo.attributes.position.count * 3).fill(1), 3))   // KayKit färbt über die Atlas-Textur, nur Steinkit über COLOR_0
      // Material von einer Kachel mit Textur: die Ladereihenfolge ist zufällig, eine Kachel ohne map als erste machte die ganze Gruppe weiß
      const mat = (list.find(([, v]) => v.mat.map) || list[0])[1].mat.clone(); mat.vertexColors = true
      const mesh = new THREE.BatchedMesh(G.cap, nv, ni, mat); mesh.name = 'place:' + name; mesh.castShadow = G.cast; mesh.receiveShadow = true; mesh.frustumCulled = false; mesh.perObjectFrustumCulled = true; mesh.sortObjects = false
      const ids = new Map(); for (const [k, v] of list) ids.set(k, mesh.addGeometry(v.geo))
      try { applyClay(mesh, THREE, { profile: 'midground', seed: 'place:' + name, scaleRef: G.ref }) } catch (e) { placeLog.lastError = 'clay: ' + e.message }
      if (G.k) sway(mesh.material, { k: G.k })
      if (name !== 'stone') plateTint(mesh.material, name === 'kk')   // KayKit zweifarbig (Krone/Stamm), Gras einfarbig; Steinkit über COLOR_0 + Ton
      root.add(mesh); batches[name] = { mesh, ids } }
    const sg = new THREE.IcosahedronGeometry(1, 3), sm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 })
    const fm = new THREE.InstancedMesh(sg, sm, 6000); fm.name = 'place:fluff'; fm.count = 0; fm.castShadow = true; fm.receiveShadow = true; fm.frustumCulled = false
    try { applyClay(fm, THREE, { profile: 'midground', seed: 'place:fluff', scaleRef: 2 }) } catch { }
    sway(fm.material, { k: 0.01 }); root.add(fm); batches.fluff = { mesh: fm, free: [], top: 0 }
    ready = true
  }
  // Farben: Biom-Palette am Zellmittelpunkt (Kit-Textur bleibt, nur ein leichter Ton; Laub natürlich, V-305)
  const white = new THREE.Color(1, 1, 1), tmp = new THREE.Color(), w6 = new Float32Array(NB), MOSS = new THREE.Color('#7f9a4a'), GRASS = new THREE.Color('#9cc35a'), STONE = new THREE.Color('#d8d2c4')
  const biomeAt = (x, z) => { T.field.weights(x, z, w6); let bi = 0; for (let k = 1; k < NB; k++) if (w6[k] > w6[bi]) bi = k; return bi }
  const tintFor = (grp, kind, bi, step, vr) => { const P = BIOME_PALETTES[bi]
    if (kind === 'contact') return tmp.copy(MOSS).lerp(new THREE.Color(P.low), 0.25)   // Moos mit Biom-Anteil, nicht der dunkle Boden-Grundton
    if (grp === 'stone') return P.stone ? tmp.set(P.stone) : tmp.copy(STONE).lerp(new THREE.Color(P.sand), 0.35)   // Insel-Rolle stone (V-800), sonst heller Knet-Stein
    if (grp === 'grass') return tmp.set(P.grass || P.low).multiplyScalar(0.92 + 0.06 * (step ?? 1))   // Rolle grass bzw. Platte low, drei flache Stufen
    const v = vr ?? 0.5   // Varianz je Instanz (R8: jede Rolle darf eine andere Farbe derselben Palette nehmen)
    if (kind === 'tree') return tmp.set(v < 0.18 && P.bloom ? P.bloom : v < 0.45 && P.leafAlt ? P.leafAlt : (P.leaf || P.low))   // J17: Laub, dunkleres Laub, Blüten-Krone
    return tmp.set(v < 0.5 && P.bloom ? P.bloom : (P.grass || P.mid)) }   // Busch: Blüte oder helles Laub (J17-Busch)
  // Zellen
  const worker = new Worker(new URL('./placeWorker.js', import.meta.url), { type: 'module' }); let wid = 0; const waiting = new Map()
  worker.onmessage = (e) => { const job = waiting.get(e.data.id); waiting.delete(e.data.id); if (!job) return
    if (!e.data.ok) { placeLog.fails++; placeLog.lastError = e.data.error; job.cell.items = []; return }
    placeLog.workerMs = Math.max(placeLog.workerMs, performance.now() - job.t0); job.cell.items = KEEPOUT.length ? e.data.instances.filter((it) => !inKeepout(it.p[0], it.p[2])) : e.data.instances; job.cell.report = e.data.report; placeLog.cells++; showQ.add(job.cell) }
  const cells = new Map(), queue = [], showQ = new Set(), pendingShow = []; let heightJob = null, showJob = null, focus = { x: 0, z: 0 }, tick = 0
  const R0 = TERRAIN.blendR + 6
  function* heights(cell) { const g = new Float32Array(NG * NG), x0 = cell.ci * CELL, z0 = cell.cj * CELL
    for (let j = 0; j < NG; j++) { for (let i = 0; i < NG; i++) g[j * NG + i] = H(x0 + i * STEP, z0 + j * STEP); yield }
    return g }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), sc = new THREE.Vector3(), p3 = new THREE.Vector3()
  function* showGen(cell) {   // zeitgeteilt: je Scheibe ein paar Dutzend Instanzen (sonst Spitzen > 200 ms beim Einblenden)
    const bi = biomeAt((cell.ci + 0.5) * CELL, (cell.cj + 0.5) * CELL), shown = []; let kc = 0, k = 0
    cell.shown = shown; cell.biome = bi
    for (const it of cell.items) { if (++k % 40 === 0) yield
      const [x, y0, z] = it.p; if (Math.hypot(x, z) < R0) continue
      if (it.k === 'fluff') { addFluff(it, shown); continue }
      if (it.k === 'find') continue
      let t = TILES.get(it.t); if (it.k === 'contact' && SMALLS.length) t = SMALLS[(cell.ci * 7 + cell.cj * 13 + kc++) % SMALLS.length]
      if (!t) continue
      const grp = groupOf(t), B = batches[grp], gid = B?.ids.get(geoKey(t)); if (gid === undefined) continue
      const base = t.scale_m ? (t.scale_m[0] + t.scale_m[1]) / 2 : t.import_scale || M_PER_RIG
      let s = it.s * base; if (it.k === 'contact' && it.cr && t.hull_r_m) s = base * it.cr / t.hull_r_m
      const hgt = t.h_m * (s / base), rr = (t.hull_r_m || 0.2) * (s / base) * 0.7
      const yMin = Math.min(H(x, z), H(x + rr, z), H(x - rr, z), H(x, z + rr), H(x, z - rr))   // am Hang auf die tiefste Fußstelle, nie schwebend
      const y = yMin - it.sk * hgt
      let id; try { id = B.mesh.addInstance(gid) } catch { break }
      m4.compose(p3.set(x, y, z), q.setFromEuler(e3.set(it.rx, it.ry, it.rz, 'XYZ')), sc.set(s, s, s)); B.mesh.setMatrixAt(id, m4); B.mesh.setColorAt(id, tintFor(grp, it.k, bi, it.ts, (Math.abs(Math.sin(x * 12.9898 + z * 78.233)) * 43758.5453) % 1)); if (!B.colorInit) { B.colorInit = true; B.mesh.material.needsUpdate = true }   // Farbtextur entsteht erst beim ersten setColorAt: Programm neu bauen, sonst fehlt USE_BATCHING_COLOR
      shown.push([grp, id]); placeLog.instances++ }
  }
  function show(cell) {   // Stufe wechselt → sofort ausblenden; Einblenden über showJob in work()
    if (!ready || !cell.items) return
    if (cell.level !== 0) { if (showJob?.c === cell) showJob = null; hide(cell); return }
    if (!cell.shown && !(showJob?.c === cell)) pendingShow.push(cell)
  }
  function addFluff(it, shown) {   // Nest = 1 große, 3 mittlere, Rest kleine Kugeln (rules.nest), eine Farbe je Nest; Fallobst = eine Kugel
    const F = batches.fluff, col = new THREE.Color(FLUFF[it.fm] || FLUFF.heroic); if (it.ac !== 'focus') { const hsl = {}; col.getHSL(hsl); col.setHSL(hsl.h, hsl.s * (CFG.fluff?.echo_dim?.chroma ?? 0.55), Math.min(1, hsl.l + (CFG.fluff?.echo_dim?.L ?? 0.06))) }   // V-794: nur das Fokus-Nest in vollem Ton
    const n = it.r === 'fallobst' ? 1 : Math.max(5, it.b || 5), r0 = it.r === 'fallobst' ? 0.14 : Math.min(it.r === 'fluff_hero' ? 0.24 : 0.18, Math.max(0.05, 0.22 * (it.cc || 0.8))) * (it.ac !== 'focus' && it.r !== 'fallobst' ? (CFG.fluff?.echo_dim?.size ?? 1) : 1)   // Kugeln im Maß des Trägers (V-784), Echo kleiner (V-795)
    for (let k = 0; k < n; k++) { const r = r0 * (k === 0 ? 1 : k < 4 ? 0.62 : 0.38), a = k * 2.39996, d = k === 0 ? 0 : (r0 + r) * 0.78, id = F.free.length ? F.free.pop() : F.top++; if (id >= 6000) break
      m4.compose(p3.set(it.p[0] + Math.cos(a) * d, it.p[1] + (it.r === 'fallobst' ? r * 0.7 : (k === 0 ? 0 : -0.25 * r)), it.p[2] + Math.sin(a) * d), q.identity(), sc.set(r, r, r)); F.mesh.setMatrixAt(id, m4); F.mesh.setColorAt(id, col)
      shown.push(['fluff', id]) }
    F.mesh.count = Math.max(F.mesh.count, F.top); F.mesh.instanceMatrix.needsUpdate = true; if (F.mesh.instanceColor) F.mesh.instanceColor.needsUpdate = true }
  function hide(cell) { if (!cell.shown) return
    for (const [grp, id] of cell.shown) { if (grp === 'fluff') { const F = batches.fluff; m4.makeScale(0, 0, 0); F.mesh.setMatrixAt(id, m4); F.free.push(id); F.mesh.instanceMatrix.needsUpdate = true } else batches[grp].mesh.deleteInstance(id); placeLog.instances-- }
    cell.shown = null }
  const off = T.onSwap((shownTiles) => {   // nur auf feinen Kacheln (64 m) zeigen: Stufe 0; weiter draußen aus (Silhouetten macht später die Ferne)
    const lv = new Map()
    for (const b of shownTiles.values()) { if (b.L > 0) continue; const n = b.s / CELL; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) lv.set((b.i * n + i) + ':' + (b.j * n + j), 0) }
    for (const [k, c] of cells) if (!lv.has(k) && c.level !== -1) { c.level = -1; showQ.add(c) }
    for (const k of lv.keys()) { let c = cells.get(k)
      if (!c) { const [ci, cj] = k.split(':').map(Number); c = { ci, cj, items: null, level: 0, shown: null }; cells.set(k, c); queue.push(c) }
      else if (c.level !== 0) { c.level = 0; showQ.add(c) } }
  })
  function work() {
    const t0 = performance.now(); if (!ready) return
    if (++tick % 4 === 0) for (const c of showQ) { if (performance.now() - t0 > BUDGET) break; showQ.delete(c); show(c); if (c.level === -1 && !c.shown) cells.delete(c.ci + ':' + c.cj) }
    while (performance.now() - t0 < BUDGET) {   // Einblenden zuerst (nächste Zelle zuerst), dann Höhenraster
      if (!showJob && pendingShow.length) { pendingShow.sort((a, b) => Math.hypot((a.ci + 0.5) * CELL - focus.x, (a.cj + 0.5) * CELL - focus.z) - Math.hypot((b.ci + 0.5) * CELL - focus.x, (b.cj + 0.5) * CELL - focus.z)); const c = pendingShow.shift(); if (c.level === 0 && c.items && !c.shown) showJob = { c, it: showGen(c) } }
      if (showJob) { if (showJob.it.next().done) showJob = null; continue }
      if (!heightJob) { queue.sort((a, b) => Math.hypot((a.ci + 0.5) * CELL - focus.x, (a.cj + 0.5) * CELL - focus.z) - Math.hypot((b.ci + 0.5) * CELL - focus.x, (b.cj + 0.5) * CELL - focus.z))
        const c = queue.shift(); if (!c) break; if (c.items || c.level !== 0) continue; heightJob = { c, it: heights(c) } }
      const r = heightJob.it.next()
      if (r.done) { const c = heightJob.c, id = ++wid; heightJob = null; waiting.set(id, { cell: c, t0: performance.now() })
        worker.postMessage({ id, x0: c.ci * CELL, z0: c.cj * CELL, size: CELL, step: STEP, n: NG, grid: r.value, seed: SEED, biome: 'moos', mode: CARTOON ? 'cartoon' : MASS ? 'mass' : 'place' }, [r.value.buffer]) }
    }
    placeLog.maxMs = Math.max(placeLog.maxMs, performance.now() - t0)
  }
  const onPal = () => { for (const c of cells.values()) if (c.shown) { hide(c); showQ.add(c) } }; PAL_STATE.listeners.add(onPal)
  return {
    object3d: root,
    setFocus(x, z) { focus.x = x; focus.z = z },
    info: () => ({ mode: 'veg=core', ready, models: geos.size, cells: cells.size, queued: queue.length, waiting: waiting.size, instances: placeLog.instances, fails: placeLog.fails, lastError: placeLog.lastError, maxMs: +placeLog.maxMs.toFixed(2), workerMs: +placeLog.workerMs.toFixed(1) }),
    instancesNear: (x, z, r) => { const out = []; for (const c of cells.values()) if (c.items && c.shown) for (const it of c.items) if (Math.hypot(it.p[0] - x, it.p[2] - z) < r) out.push({ name: it.t, cat: it.k, x: it.p[0], y: it.p[1], z: it.p[2] }); return out },
    reports: () => [...cells.values()].filter((c) => c.report).map((c) => ({ cell: c.ci + ':' + c.cj, ...c.report })),
    resetStats() { placeLog.maxMs = 0; placeLog.workerMs = 0 },
    debug: () => ({ biomes: BIOMES.length, groups: Object.fromEntries(Object.entries(batches).map(([k, B]) => [k, B.mesh.isBatchedMesh ? B.mesh._instanceInfo.filter((i) => i.active).length : B.top])) }),
    update() { work() },
    dispose() { alive = false; off(); worker.terminate(); PAL_STATE.listeners.delete(onPal); for (const B of Object.values(batches)) { B.mesh.dispose?.(); B.mesh.material.dispose() } for (const g of geos.values()) g.geo.dispose(); root.clear() },
  }
}

```


## biomeTerrain.js

```js
// V-619 · Biom-Paletten auf dem terrain3-Gelände der endlosen Fahrt. Hängt sich NACH applyTerrain3 an dasselbe Material (onBeforeCompile verkettet).
// Je Eckpunkt sechs Biom-Gewichte (aBioA, aBioB aus biomeField). Je Bildpunkt: die zwei stärksten Biome (feste Reihenfolge nach Index, damit an der
// Grenze nichts kippt), Anteil w des zweiten. Welche Palette ein Bildpunkt bekommt, entscheidet das EINE Sprenkel-Modul (kfb-speckle-transition.v1,
// zweiseitige Ebene mit Formverzerrung, Look 'intent'): kein Verlauf, keine Linie (V-403, V-011). Die Fließfarben der Probe bleiben (gleiche Bänder),
// nur ihre Farben kommen aus der Palette des gewählten Bioms; Palettenschatten (V-564) ebenso je Biom.
// Paletten 1–5 aus kfb-terrain3.r1.json (erzeugt aus der Probe), Palette 6 Claybound-Canyon aus kfb-biome-drive.r1.json.
import * as THREE from 'three'
import T3 from '../data/looks/kfb-terrain3.r1.json' with { type: 'json' }
import BD from '../data/worlds/kfb-biome-drive.r1.json' with { type: 'json' }
import IP from '../data/looks/kfb-island-palettes.r1.json' with { type: 'json' }
import { fromHue as cartoonFromHue, mulberry32 as mulberry } from '../vendor/palette/kfb-cartoon-palette.js'
import { generatePalette } from './paletteGen.js'
import { ZONE, ZONE_GLSL } from '../world/zoneField.js'
import { SPECKLE_GLSL_NOSIN, WARP_GLSL, WS1_SHAPE_GLSL, WS1_BI_GLSL, ws1LayerGLSL, speckleK, speckleBiK, zoneSeed } from '../vendor/speckle/kfb-speckle-transition.v1.js'

const ROLES = ['water', 'sand', 'low', 'mid', 'high', 'peak', 'cliff']
export const paletteOf = (key) => T3.palettes[key] || BD.palettes[key]
// Biom-Paletten: Standard prozedural (paletteGen, Georg 22.10.); Hash palgen=0 = die handgemachten Paletten, palseed=<Zahl> = andere Ausprägung.
// BIOME_PALETTES ist ein lebendes Feld (setBiomePalettes tauscht den Inhalt; Gelände, Bewuchs und Himmel lesen es)
const HASH = typeof location !== 'undefined' ? location.hash : ''
// Ruhefläche (V-788) ist zurückgenommen (Georg q210: Farbbänder fast weg): Standard sind wieder die vollen Fließfarben;
// Hash ground=tone[:k] zeigt die Tonstufen-Variante zum Vergleich
const GT = /(^|[#,])ground=tone(?::([\d.]+))?(,|$)/.exec(HASH)
export const GROUND_TONE = GT ? (GT[2] != null ? +GT[2] : 0.2) : 0   // Georg q210 (25.10.): Fließbänder zurück als Standard, ground=tone nur noch als Vergleich
const MASS_ZONES = /(^|[#,])veg=mass(,|$)/.test(HASH)   // V-797 Stilbild: Waldboden als Materialzone unter den Waldmassen
const BIO_SPECKLE = /(^|[#,])biot=speckle(,|$)/.test(HASH)   // Georg q220: Biom-Übergang über die Fließbänder (ganze Bänder wechseln die Palette); biot=speckle = altes Sprenkel-Modul
export const PALGEN = !/(^|[#,])palgen=0(,|$)/.test(HASH)
export const handPalettes = () => BD.order.map((b) => paletteOf(BD.biomes[b].palette))
export const genPalettes = (seed) => BD.order.map((b) => generatePalette({ ...BD.paletteGen.families[b], key: b }, seed))
export const PAL_STATE = { seed: +(/[#,]palseed=(\d+)/.exec(HASH)?.[1] ?? BD.paletteGen.seed), gen: PALGEN, listeners: new Set() }
// V-800 · Cartoon-Paletten je Biom aus dem eingelockten V-305-Generator (kfb-cartoon-palette.js, abgeleitet aus Joyride/Bucht, Canyon, O-Town):
// je Biom eine zufällige, harmonische, bunte Palette (random(seed)), sechs Leitfarben (Boden, Strang, Wahrzeichen, Laub, Himmel, Rinde) plus Leitern.
// Standard. Hash pal=gen = alte paletteGen-Platten, pal=island = die acht Insel-Paletten, palgen=0 = Handpaletten.
export const ISLAND_PAL = /(^|[#,])pal=island(,|$)/.test(HASH)
export const HARMONY_PAL = !ISLAND_PAL && !/(^|[#,])pal=gen(,|$)/.test(HASH) && PALGEN
// Anmutung wie die drei Golden Samples (Georg q219): Boden-Farbton aus den Familien der Golden Samples (Canyon 299°, O-Town 182°, Bucht 88°) und ihren
// Nachbarn (Taubenblau 240°, Bonbon 330°, Mint 150°), je Welt-Seed gewürfelt ±14°; Gelände nur aus Boden/Hügel-Leiter wie in J17 (keine Creme-Bänder),
// Props aus den J17-Rollen (Laub, Stamm, Blüte, Fels, Turm)
const GOLD_HUES = [299, 182, 88, 240, 330, 150]
// je Biom eine eigene Farbfamilie (gemischte Reihenfolge je Seed, keine Wiederholung): sonst stehen lila Biome neben lila Biomen (Georg 25.10.)
const hueOrder = (seed) => { const r = mulberry((seed | 0) * 2654435761 + 99), o = GOLD_HUES.slice(); for (let k = o.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [o[k], o[j]] = [o[j], o[k]] } return o }
export const harmonyPalettes = (seed) => { const HO = hueOrder(seed); return BD.order.map((b, i) => { const rr = mulberry((seed | 0) * 7919 + i * 104729 + 17), h0 = HO[i % HO.length] + (rr() - 0.5) * 20
  const p = cartoonFromHue(h0, (seed | 0) * 31 + i + 1), E = p.envRoles, R = p.roles, g = genPalettes(seed)[i]
  return { ...g, name: 'harmony:' + p.scheme, family: b, scheme: p.scheme, water: R.water, sand: R.under[1], low: R.top, mid: R.hill[1], high: R.tower[0], peak: R.sand, cliff: R.under[3], band6: R.leaf[1],
    sky: R.sky, leaf: R.leaf[1], leafAlt: R.leaf[0], bloom: R.leaf[2], bark: R.trunk, stone: R.rock, grass: R.leaf[0], accent: R.strang, landmark: R.tower[0], earth: R.under[2], ground: R.top,   // Bänder zeigen das ganze Schema (Georg 25.10.): Boden, Hügel, Erde, Sand, Wahrzeichen, Laub – je ein Band, wie die Insel-Seiten der Golden Samples
    six: [E.ground[1], E.accent[1], E.landmark[1], E.leaf[1], E.sky[1], E.bark[1]] } }) }
export const islandPalettes = () => BD.order.map((b) => { const isl = IP.islands[IP.biomeMap[b]], g = genPalettes(PAL_STATE.seed)[BD.order.indexOf(b)], P = { ...g, name: IP.biomeMap[b], family: b }
  for (const [band, role] of Object.entries(IP.bandMap)) P[band] = isl.roles[role][1]
  for (const r of ['leaf', 'bark', 'stone', 'grass', 'accent', 'bloom', 'earth', 'ground']) P[r] = isl.roles[r][1]
  return P })
export const BIOME_PALETTES = ISLAND_PAL ? islandPalettes() : HARMONY_PAL ? harmonyPalettes(PAL_STATE.seed) : PALGEN ? genPalettes(PAL_STATE.seed) : handPalettes()
export function setBiomePalettes(seed) { PAL_STATE.seed = seed; PAL_STATE.gen = true; BIOME_PALETTES.splice(0, BIOME_PALETTES.length, ...(HARMONY_PAL ? harmonyPalettes(seed) : genPalettes(seed))); for (const fn of PAL_STATE.listeners) fn(BIOME_PALETTES); return BIOME_PALETTES }
const shadowOf = (P) => new THREE.Color(P.cliff).lerp(new THREE.Color('#5a6f9a'), 0.45).multiplyScalar(0.7)

// opts: { cell_m = 3.4 (Grundzelle der großen Sprenkel, Übergänge 30–80 m), mix = 0.3 (Menge kleiner Tropfen), rim = 0.08 }
export function applyBiomeTerrain(mat, { cell_m = 3.4, mix = 0.3, rim = 0.08, seed = 'biome-drive' } = {}) {
  const pal = Array.from({ length: 54 }, () => new THREE.Color())
  const fill = (list) => { list.forEach((P, b) => { ROLES.forEach((r, i) => pal[b * 9 + i].set(P[r])); pal[b * 9 + 7].copy(shadowOf(P)); pal[b * 9 + 8].set(P.band6 || P.mid) }) }   // 6 × 9 Farben (Slot 8: sechstes Fließband)
  fill(BIOME_PALETTES); PAL_STATE.listeners.add(fill)
  const z = zoneSeed(seed, cell_m)
  const U = { uBioPal: { value: pal }, uSpeckleK: { value: speckleK() }, uSpBiK: { value: speckleBiK() }, uSpMix: { value: mix }, uBioCell: { value: z.cell }, uBioOff: { value: new THREE.Vector2(z.off.x, z.off.z) }, uBioRim: { value: rim }, uWindFlow: { value: new THREE.Vector2() }, uWindFlowCalm: { value: new THREE.Vector2() }, uFlowCalm: { value: new THREE.Vector4(0, 0, 0, 0) }, uGroundTone: { value: GROUND_TONE } }
  const lib = SPECKLE_GLSL_NOSIN + WARP_GLSL + WS1_SHAPE_GLSL + WS1_BI_GLSL + ws1LayerGLSL('kfbBioLayer', true, true) + '\n'
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r)
    Object.assign(sh.uniforms, U)
    sh.vertexShader = 'attribute vec3 aBioA; attribute vec3 aBioB; varying vec3 vBioA; varying vec3 vBioB;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vBioA = aBioA; vBioB = aBioB;')
    let f = sh.fragmentShader
    const uA = /uniform vec3 uA_water[^;]*;/, uB = /uniform vec3 uB_water[^;]*;/, tb = /float tb=uMix>0\.5 \?[^;]*;/
    if (!uA.test(f) || !uB.test(f) || !tb.test(f) || !f.includes('diffuseColor.rgb = flowBands(')) throw new Error('[biomeTerrain] terrain3-Shader nicht gefunden (applyTerrain3 zuerst)')
    f = f.replace(uA, (m) => m.replace('uniform ', '')).replace(uB, (m) => m.replace('uniform ', '')).replace(tb, 'float tb=gBioSel;')
    f = f.replace(/mix\(uA_mid,uA_high,0\.5\)/g, 'uA_b6').replace(/mix\(uB_mid,uB_high,0\.5\)/g, 'uB_b6')   // sechstes Band: eigene Rolle des Schemas statt Mischton
    if (!BIO_SPECKLE) f = f.replace(/smoothstep\(h([AB])\*0\.8, h\1\*0\.8\+0\.2, tb\)/g, (m, k) => `step(h${k}*0.8+0.1, tb)`)   // je Band harte Palettenwahl (kein Verlauf im Band)   // Palettenfarben je Bildpunkt statt Uniforms
    if (MASS_ZONES) f = ZONE_GLSL + f
    f = 'uniform vec3 uBioPal[54]; vec3 uA_b6, uB_b6; uniform float uBioCell, uBioRim; uniform vec2 uBioOff, uWindFlow, uWindFlowCalm; uniform vec4 uFlowCalm; uniform float uGroundTone; varying vec3 vBioA; varying vec3 vBioB; float gBioSel = 0.0; vec3 gBioShadow = vec3(0.0); float gBioRim = 0.0;\n' + lib + f
    f = f.replace('  diffuseColor.rgb = flowBands(', `  { // V-619: zwei stärkste Biome (feste Reihenfolge), Anteil des zweiten → Sprenkel-Auswahl (kfb-speckle-transition.v1)
    float bw[6]; bw[0]=vBioA.x; bw[1]=vBioA.y; bw[2]=vBioA.z; bw[3]=vBioB.x; bw[4]=vBioB.y; bw[5]=vBioB.z;
    int i1 = 0; for (int k = 1; k < 6; k++) if (bw[k] > bw[i1]) i1 = k;
    int i2 = i1; float w2 = 0.0; for (int k = 0; k < 6; k++) if (k != i1 && bw[k] > w2) { w2 = bw[k]; i2 = k; }
    int iA = min(i1, i2), iB = max(i1, i2); float wB = w2 < 0.002 ? 0.0 : bw[iB] / max(bw[iA] + bw[iB], 1e-5); if (iA == iB) wB = 0.0;
    // Sprenkel nur im Übergangsband rechnen (mitten im Biom ist wB = 0 → Auswahl 0); fwidth der Bandkante vor der Verzweigung (Donor-Regel)
    float wEdge = fwidth(wB);
    ${BIO_SPECKLE ? `if (wB > 0.0005 || wEdge > 0.0) { vec2 q = vT3W.xz + uBioOff; vec2 wq = kfbWarpV2(q, uBioCell) + kfbWs1Shape2(q, uBioCell);
      float rimB; gBioSel = kfbBioLayer(q + 31.7 + wq, uBioCell, wB, rimB); gBioRim = rimB; }` : `gBioSel = clamp(wB * 1.3 - 0.15 + 0.12 * snoise(vT3W.xz / 47.0 + 11.3), 0.0, 1.0);`}
    int a = iA * 9, b = iB * 9; uA_b6 = uBioPal[a+8]; uB_b6 = uBioPal[b+8];
    uA_water = uBioPal[a]; uA_sand = uBioPal[a+1]; uA_low = uBioPal[a+2]; uA_mid = uBioPal[a+3]; uA_high = uBioPal[a+4]; uA_peak = uBioPal[a+5]; uA_cliff = uBioPal[a+6];
    uB_water = uBioPal[b]; uB_sand = uBioPal[b+1]; uB_low = uBioPal[b+2]; uB_mid = uBioPal[b+3]; uB_high = uBioPal[b+4]; uB_peak = uBioPal[b+5]; uB_cliff = uBioPal[b+6];
    gBioShadow = mix(uBioPal[a+7], uBioPal[b+7], gBioSel); }
  diffuseColor.rgb = flowBands(`)
    // Farbfluss mit dem geteilten Wind (Georg 22.10.): ein Versatz (keine Scherung); nahe der Figur (uFlowCalm: Mitte, Radius) gedämpfter Bandkontrast
    const call = /diffuseColor\.rgb = flowBands\(vT3W\.xz \* uT3S, (clamp\(\(vT3W\.y - uT3H\.x\)[^;]*\))\);/
    if (!call.test(f)) throw new Error('[biomeTerrain] flowBands-Aufruf nicht gefunden')
    f = f.replace(call, (m, hn) => `{ float hnB = ${hn}; vec2 fpB = vT3W.xz;
    diffuseColor.rgb = flowBands((fpB - uWindFlow) * uT3S, hnB);
    // nahe der Figur ruhiger (Lead 22.10., Variante „Bandkontrast weicher“): gleiche Bänder, Kontrast zur Plattenmitte gedämpft, keine zweite Rechnung
    float calmK = uFlowCalm.w > 0.5 ? 1.0 - smoothstep(uFlowCalm.z, uFlowCalm.z * 2.3, length(fpB - uFlowCalm.xy)) : 0.0;
    diffuseColor.rgb = mix(diffuseColor.rgb, mix(uA_low, uA_mid, 0.5), calmK * 0.35);
    // Ruhefläche (Critic R1): gleiche Bänder, aber nur als Helligkeitsstufe der Grundfarbe des gewählten Bioms (kein Sand-/Gipfelton im Wiesenboden)
    if (uGroundTone > 0.0) { vec3 gBase = mix(mix(uA_low, uA_mid, 0.5), mix(uB_low, uB_mid, 0.5), gBioSel), gL = vec3(0.2126, 0.7152, 0.0722);
      float gR = dot(diffuseColor.rgb, gL) / max(dot(gBase, gL), 1e-4); diffuseColor.rgb = gBase * mix(1.0, clamp(gR, 0.55, 1.45), uGroundTone); }
    ${MASS_ZONES ? `{ // V-797: Waldboden als Materialzone (KayKit: flache Farbfläche, klare Kante), Lage aus demselben Zonenfeld wie die Waldmassen
      float zn = kfbZone(fpB) + 0.008 * snoise(fpB * 0.35); float fe = ${(ZONE.forest - ZONE.edge * 0.35).toFixed(3)};
      vec3 floorC = mix(mix(uA_mid, uA_high, 0.45), mix(uB_mid, uB_high, 0.45), gBioSel) * 0.78;
      diffuseColor.rgb = mix(diffuseColor.rgb, floorC, smoothstep(fe - 0.0025, fe + 0.0025, zn)); }` : ''} }
  diffuseColor.rgb *= 1.0 - uBioRim * gBioRim;`)
    f = f.replace('mix(diffuseColor.rgb * uT3Keep, uT3Shadow, uT3Mix)', 'mix(diffuseColor.rgb * uT3Keep, gBioShadow, uT3Mix)')
    sh.fragmentShader = f
  }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|biome-drive' + (BIO_SPECKLE ? '|spk' : '|bands')
  mat.needsUpdate = true
  // Farbfluss mit Wind (Georg 22.10., V-605): die Fließfarben treiben mit dem geteilten Wind (Richtung, Stärke, Böen kurz schneller). k = Regler 0..1.
  const flow = { k: 0.35, speed: 2.4, calmK: 0, calmR: 12 }   // calmK 0: um die Figur das ruhende Muster (Lead 22.10.), gesprenkelt gewählt statt überblendet (V-403)
  return { uniforms: U, palettes: BIOME_PALETTES, flow, setMix(v) { U.uSpMix.value = v }, setCell(v) { U.uBioCell.value = v },
    windFlow(dt, dir, strength, gust01 = 0, focus = null) { const v = flow.speed * flow.k * strength * (1 + 0.8 * gust01), vc = flow.speed * flow.k * strength * flow.calmK
      U.uWindFlow.value.x += dir.x * v * dt; U.uWindFlow.value.y += dir.y * v * dt; U.uWindFlowCalm.value.x += dir.x * vc * dt; U.uWindFlowCalm.value.y += dir.y * vc * dt
      if (focus) U.uFlowCalm.value.set(focus.x, focus.z, flow.calmR, flow.k > 0.001 ? 1 : 0) } }
}

```
