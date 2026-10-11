# KFB · 3D-Styleguide und Designkonzept R1 (v0.1)

Stand 11.10.2026 · Synthese aus Register, Plan R1, Specs und Georgs Referenzbildern · **kein neuer Beschluss**.
Maßgeblich bleiben DECISIONS.md, Plan R1 und PROJECT_STATE (V-117). Bei Widerspruch gilt das Register.

**Lesehilfe**
- `[V-xxx]` = verbindliche Vorgabe aus dem Register (PASS, TUNE, FAIL oder RULE).
- „Bild“ = Stil-Richtung, keine Pixel-Vorgabe [V-013, V-148]. Je Bild steht dabei, was gilt und was nicht.
- Was die Quellen offen lassen oder wo sie sich widersprechen, steht in §10, nicht im Fließtext.

---

## 1 · Leitbild

KFB ist ein „chill & fun cosmic roadtrip“: Man fährt und läuft durch schwebende Inseln im Weltraum, und jede Insel ist eine Scholle der zersprengten Erde mit eigener Geschichte [V-015, V-128].
Alles sieht aus wie ein handgebautes Claymation-Diorama: wenige große, weiche Knetformen, keine harten Schnitte, sichtbare Handarbeit nur aus der Nähe [V-011, V-012, V-053].
Der Goldstandard für Strecke, Farben, Kamera und Cartoon-Gefühl ist Joyride J17, so wie es gebaut und abgenommen ist: schieferblaue Fahrbahn, dicke orange Knet-Banden, violette Tafeln, orange Tafeltürme, grüne Kugelbäume [V-010, V-102].
Das Spielgefühl ist Cartoon-Stunt-Race mit viel Fahrhilfe, nicht Simulation [V-151].
Georg gestaltet die Welt im Editor; dieser Guide beschreibt die Regeln, nach denen Werkzeuge, Bausteine und Referenzen gebaut werden [V-002].

---

## 2 · Formensprache

**Grundformen**
- Wenige große Formen statt vieler kleiner Teile. Bauarm, stilisiert, „Serviervorschlag“ statt Abbild [V-013].
- Jede Form braucht eine Geschichte (wer, was, warum). Was sich nicht erzählen lässt, wird nicht gebaut [V-015; QA_RULEBOOK_ENVIRONMENT §00].
- Weich, rund, knetig. Auch gebaute Teile (Bordstein, Portal, Mauerkopf) sind gerundete Knet-Bauteile [SPEC_EDGE_RUBBLE_GRAMMAR].

**Keine harten Schnitte** [V-011, V-168]
- Kein Übergang zeigt eine Messerkante, eine gerade Schnittlinie, einen Polygonrand oder einen Farbsprung an einer Linie.
- Jede Schnittfläche und jeder Mesh-Abschluss ist gerundet: Bandenenden, Strecken- und Gehweg-Enden, Insel-Anschnitte, Portale, Mauerenden [V-168].
- **Gebautes Ende:** gerundeter Kantenstein bzw. Bordsteinkopf, mit Rubble oder Knetfleck zur Umgebung.
- **Verfallenes Ende:** nur ganze große Platten; die letzten drei treten gestaffelt zurück; Rubble füllt die Stufen, unregelmäßig, in den Tönen der Platten.
- **Rubble nach Ursache**, nie gleichmäßig: außen am Kurvenausgang, an Tiefpunkten, an Bordsteinen in engen Innenkurven, am Fuß von Ruinen. Startwerte für freie Plattenränder: intakt 70 %, gelockert 15 %, gebrochen 10 %, fehlend 5 % [SPEC_EDGE_RUBBLE_GRAMMAR].

**Geschlossene Körper**
- Inseln sind ein geschlossenes Mesh, keine Block-Bauweise aus Einzelkörpern [V-136].
- Tunnel sind sauber ins Grundmesh einmodelliert: 0 offene Kanten, 0 nicht-mannigfaltige Kanten, kein aufgesetztes Portal, kein Stopfen, kein z-fighting [V-112, V-113, V-114].

**Maßstab K2** [V-060; SCALE_CONTRACT_K2]
- Es gibt keine Meter. Maß ist die Medium-Figur **H = 3,64** Lab-Einheiten und die MacroCell **MC = 6,4** (= 1,76 H).
- **Figuren werden nie skaliert.** Die Welt passt sich an [V-060].
- Richtwerte: Tür 1,2 H · Stockwerk 1 MC · Gehweg ≥ 1,3 H · Bordstein ≈ 0,1 H · Wand bzw. Leitplanke ≈ 0,35 H · Durchfahrt in Tunnel und unter Brücken ≥ 1,6 H.
- Weltautos sind 6 lang (1,65 H). KayKit-Autos bekommen einen gemeinsamen Kit-Faktor, breiteste Breite ≤ 3,11 [V-153].
- Treppen und Trittsteine folgen der gemessenen Fortbewegung: Setzstufe 0,30, Tritt ≥ 1,3; Trittstein-Abstand nach Jog-Schritt [V-157, V-160].

**Bewegung als Form**
- Auto mit J17-Squash (.12 / .18 / .06) [V-103]. Natur mit Cartoon-Deformer: Biegen, Squash und Stretch mit Volumenerhalt, federndes Nachschwingen [SPEC_ENVIRONMENT_KIT §5].

---

## 3 · Material und Oberfläche

**Knete ist der Grundstoff**
- **Umgebung:** Clay-Kanon vom 07.10. mit **Nahband**. Das heißt: Werkzeugspuren und Fingerabdrücke sind nur im Nahbereich sichtbar, in der Ferne läuft eine leichte Fassung; Mikro-Detail blendet nach Pixelgröße aus [V-053; BASELINE_ACCEPTED_R1 Zeile 5].
- **Figuren:** dezentes Resident-Atlas-Profil `fine`. Die Knete darf das Gesicht nicht unruhig machen [V-053; BASELINE Zeile 3–4].
- **Natur:** Clay K2, Klasse `nature`; kleine Teile ohne eigenes Soften [SPEC_ENVIRONMENT_KIT §3].
- Leistung gehört zum Look: Nahband vor allen anderen Sparhebeln; Liefer-Schranke ≥ 30 fps [V-115].

**Oberflächen-Wechsel**
- Flächen wechseln über `kfbBlend`-Knetflecken in drei Größen bzw. das Sprenkel-Muster S1 [BASELINE Zeile 6].
- Verboten: Farbverläufe, Alpha-Überblendung, Rausch-Gesprenkel, Raster, gleichförmige Punkte [QA_RULEBOOK_ENVIRONMENT §01].

**Materialmix (Diorama)** [V-012]
- Erlaubt: Knete, Balsa, Pappe, Kork, Filz, Moos. Nie konstruiert, nie repetitiv.
- In den Quellen belegt: Holz bzw. Balsa für Minen-Portal, Zäune, Holzbrücken und Gerüste; Moos an Inselkanten und Mauerfüßen; heller Knetstein (Mauerwerk Familie A, vier Töne `#e6d5b7 → #b49d7e`) für Bord, Gehweg und Mauern [palettes.ts MASONRY_DEFAULT; BASELINE Zeile 15].
- Wo Filz, Kork und Pappe konkret eingesetzt werden, legen die Quellen nicht fest (§10).

**Was nicht Knete ist**
- **Wasser:** Claude-Design-Wasser F0–F2 mit Ufergelände und allen Fixes, „auf keinen Fall verlieren“ [V-052].
- **Glas** am Auto trägt keine Knete (im Lab-Stand als Fehler gefunden) [BASELINE Zeile 5].
- **Leuchten:** Lava, Fackeln, Tunnellampen und Cosmic-Kanten leuchten über Emission, nicht über Zusatzlampen [V-108, V-163].

**Aus den Bildern übernehmen bzw. nicht**
- Übernehmen: große weiche Erdloben, eingebettete Fels-Bänder, Moos, das wie Knetkugeln über die Kante quillt (IB1–IB3).
- Nicht übernehmen: feine Poren, Haarrisse und fotoreale Mikrotextur der generierten Blätter; glänzendes Spielzeug-Plastik und sichtbare Steckverbinder der Strecken-Blätter (TD1–TD5, CS1–CS3); metallische Sci-Fi-Architektur (CO1/CO2).

---

## 4 · Farbe und Licht

**Farbe läuft nur über Rollen**
- Farben werden nie gebacken, sondern über Rollen gesetzt (`ENV_ROLES`: ground, grass, stone, bark, leaf, bloom, water, accent, sand, paved, earth) [BASELINE Zeile 7].
- Ein Insel-Thema ist ein Generierungsschritt: Sechser-Palette + Licht + Klang + Biom + Story-Tint. Der Story-Tint färbt nur leicht über dem Grundthema, nie statt ihm [V-051; Plan R1 §2].
- Kit-Assets (KayKit, Tiny Treats, Quaternius) werden auf die Insel-Palette umgefärbt [SPEC_ENVIRONMENT_KIT §3].

**J17-Grundpalette (Welt `canyon`, Goldstandard)** [V-102; track-look.v5.js]

| Rolle | Farbe | Hinweis |
| --- | --- | --- |
| Fahrbahn Rennen | `#3d4a60` | schieferblau [V-102] |
| Fahrbahn Straße | `#566680` | etwas heller |
| Banden bzw. Strang | `#ef5a22` | orange-rote Knete [V-102] |
| Tafel bzw. Boden | `#8b68c7` · Hügel `#a582d9` / `#7b5bb8` | violett |
| Tafeltürme | `#ef5a22` / `#e8743a` | orange |
| Laub | `#1f7a3e` · `#2f8a45` · Akzent `#cdc666` | Kugelkronen |
| Stamm | `#8a5a3a` | |
| Fels, Wolken | `#e2d0bc` | hell, warm |
| Boost-Pfeile | `#f2b632` | gelb |
| Himmel | `#96bede` | |

- Die beiden Nebenwelten aus J17: **bucht** (korallenroter Strang `#f2708a` auf Sand, Aqua-Dünen, violette Korallentürme) und **otown** (senfgelber Strang `#e9b53b` auf Petrol, magenta Wackeltürme, orange Kronen auf lila Stämmen) [track-look.v5.js].
- Tunnel `race_tube`: rot-weiße Ringe mit gelben Kanten, helle Lampenpunkte (chase-tunnel.jpg, tc1-looks.v3).
- Auf der Strecke liest man: blaue Fahrbahn gegen orange Bande gegen violetten bzw. grünen Boden. Dieser Dreiklang trägt die Lesbarkeit (§8).

**Insel-Paletten im Bestand** [palettes.ts ENV_ROLES]
- **wueste:** Sand `#f1d08c`, Sandstein-Ocker, Oasentürkis, Koralle als Akzent.
- **canyon:** violetter Tisch, oranger Canyonfels `#e8743a`, schieferblaues Wasser.
- **bucht:** Sand, Lagune Aqua, Korallen-Violett nur als Akzent.
- **otown:** Petrol `#3aa596`, Lila-Grau-Schiefer, Herbstkronen Orange, Magenta-Akzent.
- **kfb_town:** Wiese `#7cba48`, heller Kalkstein, Burg-Rot aus dem Strang.
- **protopia:** Bergwiese `#6aae3a`, grauer Bergfels `#857d73`, Werkstatt-Orange `#e8742a`.

**Licht**
- Profile Tag, Abend, Nacht, Innen aus SKY3; **Abend ist TUNE: zu orange und zu dunkel** [V-050].
- Der Tag-Nacht-Lauf wechselt den Himmel per Überblendung zweier Dome-Ebenen, nie hart [V-101].
- Nachts: Lichtkreis um die Figur (WhackMan-Fog-of-War 1:1, Standard 60 %, kein Ring, keine Vignette); Aurora im oberen Bilddrittel [V-096, V-097].
- TinySkies-Effekte stehen bereit: Regen mit Tropfen auf dem Bildschirm, Aurora, Lens-Flare; noch nicht alle verdrahtet [V-092].
- Strecken-Welt bekommt Weltraum-Himmel: KFB-Wolken, ferne Inseln, surreale Planeten, Knet-Asteroiden; später Käse-Mond. Day-Night bleibt der einzige Licht- und Nebel-Schreiber [V-132].
- **Tunnel:** Licht je Look (Lampenschild, Laternen, Deckenlampen), Innenschale je Look [V-112, V-130].
- **Glut-Licht:** Emission (Lava, Fackeln); nachts rotes Rim-Licht vom Mond (Dystopia) [V-108].
- Technische Kanon-Werte für Golden-Vergleiche (K1-Licht: Sonne 2,9 bei 32°, ACES, GTAO) haben keine Georg-Abnahme [BASELINE §4].

---

## 5 · Inselkörper

**Weltlogik:** Eine Insel ist eine Scholle der zersprengten Erde, kein Sockel mit Deko [V-015, V-106].

**So sieht die Basis aus** [V-142, V-152 CR3; Plan R1 §2f]
- Eine zusammenhängende Erdmasse mit weichen Loben nach unten.
- Fels ist Teil der Masse: eingebettete, verschmolzene graue Felsbrocken bzw. ein Felsband. Nie einzelne aufgesetzte Felskugeln.
- Moos quillt über die Kante.
- Wenige dünne Wurzeln an der Wand; weiche Höhlen erlaubt.
- Ein geschlossenes Mesh [V-136].
- Messwerte aus den StreakByte-Inseln: dünne Grasnarbe (2–4 % der Breite), tiefe Masse (0,43–0,52 × Breite), gleichmäßige Verjüngung, viele Zapfen statt einer Spitze, tiefster Punkt außermittig [ISLAND_ANATOMY_RULES].

**Oberseite**
- Mauern und Bauten stehen auf einem Moos- bzw. Erdsaum, nie mit hartem Kontakt (prison-maze README).
- Strecke ist ins Gelände eingebettet, keine Pfeiler auf der Insel, wo es nicht nötig ist (CC2); zwischen Inseln schwebt die J17-Strecke mit Ein- und Ausfahrt an der Inselkante [V-120a].

**Was gescheitert ist und warum**

| Nr. | Was | Warum |
| --- | --- | --- |
| R2D v2–v6 | Unterseite FAIL | Knubbel an der Spitze, „Würste“, grauer Kantenring, Körper stößt an der Straße durch (Register Teil B) |
| V-106 | Unterseite der Maze-Blätter, TUNE | Fels- und Erdklumpen angeklebt statt Scholle |
| V-123 | Island Form Kit 01, FAIL | flache grüne Platte auf glattem Kegel, ausgefranste Öffnungen, Wurzeln wie Stoßzähne; aus Text generiert statt aus Vorbildern |
| V-135 | Blender-Basis aus M1, TUNE | Bildblatt verleitete zu Beton- bzw. Steinklötzen als Inselkörper |
| V-156 | Tunnel-Berg, TUNE | Prüfhügel schlecht und unpassend modelliert |
| V-162 | Bank B, TUNE 5–6/10 | Felswände ohne Volumen, Unterseite und Terrain „lazy und lieblos draufgelegt“, Strecke wenig organisch |

Gemeinsame Ursache: Form aus Text bzw. Regeln generiert statt nach echten Vorbildern modelliert. Darum modelliert jetzt Blender die Inselkörper nach Georgs Referenzen, das Lab setzt Strecke und Tunnel ein [V-167].

**Positive Beispiele**
- **Mesa / Coconino** [V-164, V-167]: geschichtete Sandsteinmasse als ein Körper; Aufbau Cap → Main Body → Erosion Skirt / Talus; Track eingebettet, keine Pfeiler. Gute Basis-Referenz.
- **IB1 und IB3:** Felsband in der Erdmasse, Moos über der Kante, dünne Wurzeln. **Nicht** aus IB2: die runden Felskugeln, die wie eingesteckt wirken (widerspricht CR3 „nie einzelne Felskugeln“).

---

## 6 · Strecken-Baukasten

**Ein System** [V-134, V-145, V-146, V-152]
- Logik (Wege-Graph, Knoten, Anker, Prüfungen) im Track Core; Skin (Querschnitt, Kanten, Markierung, Kappen, Palette) je Familie; Look im Lab.
- Alle Autos fahren alle Skins [V-152]. Chill & fun Assist als Standard [V-151].
- Pfeiler und Brücken nur auf Inseln; im All schwebt die Strecke ohne Stützen [V-120, V-147, V-154].
- Die Strecken-Blätter gelten für Logik und Modul-Katalog, **nicht für Farben** [V-144, V-147].

**Skins**

| Skin | Look | Kanten und Module | Markierung | Enden |
| --- | --- | --- | --- | --- |
| **race** | J17: schieferblau, orange Knet-Bande [V-102] | Bande innen/außen mit Übergang ≥ 8 m nach J17-Schwellen; Kerb nur innen am Scheitel enger Kurven [V-150, V-154] | keine Spuren; Pfeile nur an EXIT/ENTRY/FORK/JOIN [V-150] | runder J17-Bandenkopf; offenes Ende nur Start oder Baustelle |
| **town** | Asphalt, gemauerter Bord, Gehwegplatten, Graskante (CS1) | Ecke, T, Kreuzung, Kreisel, Mittelinsel ≥ 2 m, Bordabsenkung nur vor Haus oder Hof [V-150, V-154] | Haifischzähne; Zebra nur an Armen mit Gehweg, eine Autolänge vor der Wartelinie | Sackgasse immer mit Wendeschleife; Platz bündig mit Pollern |
| **country** | Landstraße zweispurig; HIGHWAY = country [V-154] | Leitplanke optional, Standard an Kurven und Hängen; Zaun an Weiden; Haltebucht bündig mit Kies; Haarnadel R ≥ 8; Serpentinen ≤ 8 % | Strichlinie; kein Zebra außerorts | Kappen `bande_head` |
| **dirt** | Schotter, schmaler als Rennen | Bande nur an Gefahrenstellen; Berm ≤ 35°, befahrbar; zuerst nur Schotter-Arme [V-150, V-154] | keine | Wiese, Hof oder Gatter, nie offen |
| **trail** | Erde, Kies, Stein, Fels; Schnee gehört zur Insel | Geh-Netz ohne Autos; Pfad 1 bzw. 2 MC; ≤ 12 % sonst Treppe mit Podest; Trittsteine im Jog-Schritt [V-154, V-157, V-158] | keine | natürlich; Netz gehört dem Lab-Layout [V-155] |
| **cosmic** | Neon-Vibe aus CO1/CO2, Basis bleibt Knete/K2 [V-163] | die Bande selbst leuchtet; keine Stützen im All, nur auf Asteroiden-Inseln [V-154] | wie race | Stärke des Leuchtens offen (§10) |
| rail / coaster | später | gleiche Knoten-Logik [V-145] | – | – |

**Übergänge**
- Rennstrecke ↔ Straße: J17-Vorlage 1:1, Variante B, Bord und Bande laufen rund 17 m nebeneinander und blenden weich über [V-104, V-139].
- Rennstrecke in die Stadt: Bande endet vor dem Übergang, danach Stadtstraße mit Zebra [V-150 #21].
- Belag → Schotter: nur auf Geraden, rund 20 m; Kerb endet zuerst; Belag franst in Knetklecksen aus [V-150, V-154].
- Bord → Leitplanke auf freier Strecke wie am Rampenfuß; auf Brücken Geländer statt Bande, Wechsel am Brückenkopf [V-150].
- Kreisel: Ring im Skin der Hauptstrecke, Ecken mit Übergangsstück Bande ↔ Bord [V-150].
- EXIT/ENTRY: Seitenlage entscheidet die Spur, Pfeile vor der Gore, keine Taste [V-161].

**Tunnel** [V-100, V-112, V-130]
- Vier TC1-Looks 1:1, je Tunnel wählbar, Portal an beiden Enden:
  - `stone_arch`: Bogensteine um das Portal, Bogenprofil.
  - `stone_rect`: Stein-Sturz, innen rechteckig.
  - `race_tube`: rot-weißer Rand, Lampenschild, innen rot-weiße Ringe (Standard).
  - `mine`: Holzportal mit Laternen, innen Rechteckrahmen.
- Profil (Bogen oder Rechteck) ist eine eigene Eigenschaft, getrennt vom Look [V-130].
- Tunnel führen durch echte Berge bzw. Inselkörper, nicht durch Platzhalter-Hügel [V-156]. Gemauertes Portal geht in Fels über (CR3) [V-152].
- Durch die Insel-Basis mit Parkhaus-Rampen nach Vorlage J14 T4 [V-113]. Im Straßentunnel ein erhöhter Gehweg mit Geländer [V-154].

**Aus den Strecken-Blättern nicht übernehmen**
- Knallblaue Fahrbahn, gelb-blaue Plastik-Leitplanken, sichtbare Steckverbinder und Kachelfugen (TD1–TD5, RK2).
- Steinbogen-Brücken zwischen Inseln (M0); gemauerte Brücke zwischen Inseln ist FAIL [V-120a]. Viadukte erst für Antike-Inseln [V-165].
- Strecken, die an der Inselkante einfach abbrechen (RK1, ME2) [V-168].
- Graue Fahrbahn mit nur rot-weißem Kerb als „Joyride v17“ (CC2): Der J17-Look ist schieferblau mit oranger Bande [V-102]; siehe §10.

---

## 7 · Biome und Themen-Inseln

Alle Karten: Inselbasis nach §5; Bilder nur Stil-Richtung; Inselboden der Blätter nie übernehmen [V-106, V-135].

**Protopia / Farm** [V-110, V-120b]
- Formen: Bauernhaus, Gewächshaus, Beete, Windrad, Wasserrad, Teich mit Wasserfall über die Kante (M1).
- Palette: `protopia` (Bergwiese, grauer Bergfels, Ocker-Gelb, Werkstatt-Orange).
- Landmarke: Windrad bzw. Wasserrad mit Wasserfall.
- Do: Fluff-Ernte als Geschichte (Bäume, Farm, Fallobst). Don't: zusammengewürfelte Asset-Sammlung ohne Architektur und Übergänge [V-124].

**Maker Space** [V-110, V-120b]
- Eigene Insel mit direkter Auf- bzw. Abfahrt, getrennt von der Farm.
- Formen: Baugerüste, Kran mit Greifer, Werkbänke, Sonnensegel, bunte Bauklötze, Wimpel; Strecke durch den Platz, Rampe auf eine Ebene, Wendeschleife um Drehscheibe (Anker `turntable`) [V-143].
- Palette: keine eigene Rolle im Bestand (§10).
- Don't: Beton- bzw. Steinklötze als Inselkörper [V-135].

**Dystopia / Vulkan** [V-108]
- Formen: wenige große Basaltnadeln in Gruppen mit glühenden Lavarissen, Bühne, Thron auf Treppe, Ring mit Pentagramm, Fackel-Pfeiler mit Ketten.
- Palette (geschätzt aus D1/D2): Basalt `#3a2f2c`, Rostbraun-Boden `#8a5a3c`, Stein `#8c7a6e`, Lava `#ff6a1a`, Banner-Rot `#b8261e`, Nachthimmel `#2a1420`, Blutmond `#d8463a`.
- Landmarke: Vulkanarena, nachts unter Blutmond.
- Do: Licht über Emission; Mauer- und Treppenteile als Dystopia-Skin des Mauer-Baukastens. Don't: Stier-Figur auf dem Thron (keine KFB-Figur), angeklebte Unterseite.

**Gefängnis / Maze** [V-105, V-120c, V-121]
- Formen: konzentrischer oder rechtwinkliger Maze; Mauer-Baukasten (gerade, Ecken, T, Kreuz, Endkappe, Tor mit Fallgitter, kaputt, Brüstung, Pfeiler, Treppe, Schwelle, Wachturm-Module).
- Standardmauer 1,6 m plus höhere Zellenmodule; Umrechnung in K2 vor Lab-Einsatz [V-120c]. Greybox erst nach MVP-1 [V-121].
- Skin A Stein (heller Knetstein), Skin B Sci-Fi später.
- Landmarke: Wachturm mit Scheinwerfer bzw. Horn, Fallgrube in der Mitte.
- Do: Pfeiler an jeder Fuge, wenige große Steinblöcke, ungerade Requisiten-Gruppen, Mauerfuß im Moos. Don't: Unterseite der Blätter.

**Mesa / Coconino** [V-164, V-167]
- Formen: M01 Flat Cap, M02 Needle Butte, M03 Stepped Mesa; Cap → Body → Talus; Kakteen; Serpentinen.
- Palette: Welt `canyon`; Sandstein Rot-Orange (ME1) bzw. Violett (ME2).
- Landmarke: Needle Butte am Pass.
- Do: Inselkörper und Mesas modelliert Blender, Lab setzt Track ein; Track ins Gelände eingebettet, keine Pfeiler. Don't: Strecke an der Kante abbrechen lassen.

**Cosmic** [V-132, V-154, V-163]
- Formen: violetter Weltraum, Planeten mit Ringen, Knet-Asteroiden, Kristalle, Pilzbäume, leuchtende Kanten in Orange, Türkis und Gelb.
- Landmarke: offen; Vulkan mit Hub-Ring ist im Bild, aber nicht beschlossen.
- Do: Stil, Farben und Stimmung aus CO1/CO2; Basis Knete/K2; Stützen nur auf Asteroiden-Inseln. Don't: halluzinierte Raumstationen, Glaskuppeln, Verkehr aus vielen Autos, metallische Viadukte.

**Organe → MED-Welten (später)** [V-111, V-127]
- Im MVP nur Platzhalter-Körper für Ring, Tunnel und Anschlüsse. Keine Form-Arbeit; später medizinisch-cartoonig plausibel neu modellieren.

**Antike (später)** [V-165]
- Steinbrücken und -viadukte gehören hierher. Jetzt kein Steinbogen-Builder.

**KFB Town**
- Baut Georg selbst im Editor; RKIT-Bord und -Gehweg nur in Town [V-080, V-118].

---

## 8 · Kamera und Lesbarkeit

**Kamera**
- Fahren: J17-Schienen-Verfolgerkamera nur im Fahrmodus [V-103]. J17-Werte als Vorlage: Boom 9, Höhe 3,5, seitlich 2,4, FOV 58, FOV wächst mit Tempo [PHASE_C_DONORS_R1].
- Zu Fuß: WoW-Schema mit den gemessenen B0-Werten; Kamera nie unter Füße + 0,25 H [V-022, V-025, V-088].
- Verdeckung: automatisch 35 % Dither [V-027].

**Spiralen** [V-169]
- Steighöhe je Umlauf ≥ Kamerahöhe über Fahrbahn + Fahrzeughülle + Marge. Die Kamera darf nie „eine Etage höher“ hängen und das Auto verdecken. Prüfung im Core und Kamera-Test im Lab.

**Lesbarkeit aus der Spielkamera**
- Reihenfolge: Silhouette und Pose → Ausrichtung → große Geste → Gesicht [BASELINE Zeile 3].
- Große Formen und klare Farbrollen statt Detail: Fahrbahn, Bande und Boden müssen sich in Ton und Helligkeit trennen (J17-Dreiklang, §4).
- Markierungen nur dort, wo eine Entscheidung fällt (Pfeile vor der Gore) [V-150, V-161].
- Keine Messwerte oder Debug-Anzeigen im Spiel [V-041].
- Prüfung immer als Standbild neben J17 `chase-curve`, `chase-straight`, `chase-tunnel` [V-010, V-102].
- Abnahme-Bilder nur aus Läufen mit ≥ 50 fps; Standardansicht zeigt nur den letzten geprüften Stand [V-159, V-166].

---

## 9 · Do / Don't

| | Regel | V |
| --- | --- | --- |
| Do | J17 so, wie es gebaut ist: schieferblau, orange Bande | V-010, V-102 |
| Do | Jede Form hat eine Geschichte (wer, was, warum) | V-015 |
| Do | Alle Enden gerundet, bei Bedarf mit Rubble | V-011, V-168 |
| Do | Inseln und Tunnel als ein geschlossenes Mesh | V-136, V-112 |
| Do | Inselbasis = eine Erdmasse, Fels darin, Moos über der Kante, dünne Wurzeln | V-142, V-152 |
| Do | Maße in H und MC; Figuren nie skalieren | V-060 |
| Do | Vorlage zuerst; „fehlt“ nur mit Such-Protokoll | V-001, V-140 |
| Do | Bild-Logik prüfen, Unklares bei Georg erfragen | V-148 |
| Do | Farbe nur über Rollen und Insel-Thema | V-051 |
| Don't | Inselboden aus generierten Blättern übernehmen | V-106, V-135 |
| Don't | Felskugeln, Würste oder Klumpen an die Unterseite kleben | V-106, V-123, V-152 |
| Don't | Asset-Sammlung ohne Architektur und Übergänge | V-124 |
| Don't | Gemauerte Brücken oder Pfeiler zwischen Inseln | V-120, V-154 |
| Don't | Farben der Strecken-Blätter (Blau-Gelb-Plastik) | V-144, V-147 |
| Don't | RKIT-Test-Hub-Optik in Vorschauen | V-014 |

---

## 10 · Offen / Optionen für Georg

1. **Banden-Farbe im Code:** Das Lab hat `BANDE_DEFAULT` rot `#d73d30` / weiß und `ASPHALT` `#545e7a`; das Register sagt Bande `#ef5a22`, Fahrbahn `#3d4a60` [V-102]. Sollen die Lab-Konstanten auf J17 gezogen werden, oder ist Rot-Weiß eine eigene Rolle (z. B. für Kerbs und town)?
2. **Mesa-Strecke:** ME1/ME2 und CC2 zeigen graue Fahrbahn mit rot-weißem Kerb, V-164 nennt „Serpentinen mit rot-weißem Kerb“. Gilt dort der race-Skin (J17, orange Bande), oder ist das ein eigener Look (z. B. country mit Kerb)?
3. **Cosmic-Intensität:** Wie stark leuchtet die Bande, und wie viel Neon verträgt die Knete? Option A: nur Kantenleuchten auf J17-Basis. Option B: ganzer Neon-Skin wie CO1/CO2 [V-154 CS3-11, V-163].
4. **Abendlicht:** V-050 sagt „zu orange und zu dunkel“, ME1/ME2 sind aber sehr orange. Gelten ME1/ME2 als Ziel für Abend, oder nur als Insel-Stimmung für Mesa?
5. **Sättigung:** Die generierten Blätter sind wärmer, satter und studio-beleuchtet; J17 ist kühler und flacher. Richtwert J17, oder etwas Richtung Blätter?
6. **Inselgrößen-Klassen:** Plan R1 nennt „Tunnel-Berge mindestens L“, aber keine Klassen sind definiert (S/M/L/XL in H oder MC). Soll es feste Klassen geben?
7. **Tiefe der Inselbasis:** Die Anatomie-Messung verlangt 0,43–0,52 × Breite und „flache Schattierung“; die Strecken-Blätter zeigen deutlich flachere Unterseiten, IB1–IB3 weiche Knet-Schattierung. Was gilt für Tiefe und Schattierung?
8. **Materialmix konkret:** Wo kommen Filz, Kork und Pappe hin (z. B. Filz = Moos bzw. Wiese, Pappe = Kulissen)? Bisher nur „erlaubt“ [V-012].
9. **Maker-Space-Palette:** Es gibt keine eigene Rolle. Ableiten aus protopia (Werkstatt-Orange) oder eigenes Thema mit den bunten Bauklötzen aus M1?
10. **Mauerhöhe Maze:** 1,6 m stammt aus Metern; in K2 wäre das rund 0,7–0,75 H. Ist das gemeint, oder soll die Standardmauer höher als die Figur sein?
11. **Steinviadukt auf Inseln:** Weiter offen laut V-154; V-165 verschiebt Steinbögen auf Antike. Gilt das auch für Viadukte auf Berginseln (CR4)?
12. **Cosmic-Landmarke:** Vulkan mit Hub-Ring aus CO1/CO2 übernehmen oder eigene Landmarke?

---

## 11 · Quellen

**Register und Plan**
- `KFB_HUB/30_DECISIONS/DECISIONS.md` (V-001 … V-169, Teil B)
- `KFB Island Worldbuilder Lab/docs/KFB_WORLDBUILDER_PLAN_R1.md` (§0, §1, §2, §2d–§2g, §3)
- `KFB_HUB/30_DECISIONS/replies/STEERING_ANSWERS_TD_R1.md` (V-150), `STEERING_ANSWERS_TD_R2.md` (V-154)
- `replies/BRIEF_WSA_TRACK_MODULE_LOOK_SPEC_R1.md` / `R2.md` (nur Aufträge). Die WSA-Antworten `WSA_TRACK_MODULE_LOOK_SPEC_R1/R2.md` wurden nicht gefunden in `replies/`.

**Specs im Lab (`docs/`)**
- `SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`, `SPEC_ENVIRONMENT_KIT_R1.md`, `ISLAND_ANATOMY_RULES.md`, `SCALE_CONTRACT_K2.md`, `QA_RULEBOOK_ENVIRONMENT_R1.md`, `BASELINE_ACCEPTED_R1.md`, `PHASE_C_DONORS_R1.md`
- `src/palettes.ts` (ENV_ROLES, MASONRY_DEFAULT, BANDE_DEFAULT)
- `KFB Open World Visual Terrain Recovery Lab/donors/lab-track/track-look.v5.js` (J17 WORLDS)

**Bilder**
- Goldstandard: `KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/pictures/chase-curve.jpg`, `chase-straight.jpg`, `chase-tunnel.jpg`; `KFB_JOYRIDE_J15_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/evidence/tc1-looks.v3.jpg`
- `replies/REFS_INSELBODEN_2026-10-11/` IB1–IB3 · `REFS_RUNDKURS_2026-10-11/` RK1–RK2 · `REFS_TRACK_DETAILS_2026-10-11/` TD1–TD5 · `REFS_CITY_STREETS_2026-10-11/` CS1–CS3 · `REFS_COUNTRY_TUNNEL_2026-10-11/` CR1–CR4 · `REFS_COSMIC_MESA_2026-10-11/` CO1–CO2, ME1–ME2 · `REFS_COCONINO_2026-10-11/` CC1–CC2
- `KFB Island Worldbuilder Lab/docs/golden/candidates/` prison-maze (P1–P3), dystopia-vulkan (D1–D2), protopia-makerspace (M0–M1), je mit README
