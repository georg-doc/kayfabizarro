# 2026-10-03 (18) · Knetwelt-Linie · Tunnelmündung, Session-ZIP

- Georg: Tunneleingang (Hohlvene, Bild) unsauber, Lücken. Ursache: Portal = erster Berührpunkt der Schnittröhre; beim schrägen Eintritt in ein Gefäßende liegt er am Rand, der Kragen wurde dort halb abgeschnitten (nur nahe der Organfläche) → gezackte Lippe, Spalt.
- Fix (v7, alle Organe) »Mündung«: an jedem Portal ein Knetzylinder (r = Röhre + Wand, flaches Ende) 0,8 r nach außen, weich mit dem Organ vereinigt; Schnitt läuft 2,8 r über das Portal hinaus, auch in die Nachbarstücke; Kragen sitzt am Mündungsende und richtet sich nach dem Feld mit Mündung. Farbe der Mündung = Region des Gefäßes, in das sie führt. Befunde unterwegs: Kapsel-Halbkugel verschloss die Mündung (→ Zylinder), Schnitt endete am Zugende (→ Nachbarstücke).
- [BEWEIS] Bilder entlang der Strecke vor jedem Portal, Hero und Light: C2 Hohlvene und Ausfahrt rechts, G2 Sehnerv-Einfahrt und Sehrinden-Ausfahrt, E2 Caecum und Anus — runde Mündung mit Kragen, keine Lücke. runChecks C2, G2, E2 ohne Fehler, Querschnitt-Treffer 0.
- Rest: an der Hohlvene rechts eine Stufe, wo das flache Mündungsende die Gefäßwand schneidet · Caecum-Mündung hell (Region des Dünndarms).
- Session-ZIP: `export/KFB_ORGAN_ATTRAKTIONEN_2026-10-03/` mit Seiten, Modulen, Bakes, Brief, Doku, Sprintplan, Onboarding.

# 2026-10-03 (17) · Knetwelt-Linie · freie Netzteile

- Prüfer: zwei frei schwebende Netzteile neben dem Herz (300 und 248 △, Truncus-Rest), eines 21 m über der Zufahrt zum linken Tunnel. Ursache: Grenze in `dropIslands` war max(200 △, 0,2 % des größten Teils) = 200 △. Fix (v7, alle Organe): 2 % des größten Teils. Herz Hero jetzt ein Teil (92 828 △), Bild aus der Prüfansicht: nichts schwebt über der Strecke.

# 2026-10-03 (16) · Knetwelt-Linie · Ursache der »Löcher« an Portalen: gedrehte Windung

- Prüfer: zwei himmelblaue Dreiecke an Portal 2 (Hero). Messung statt Vermutung: Strahl trifft dort die Organfläche (Farbe rot, Normalen in Ordnung), Wolken ausgeblendet ohne Wirkung, grüne Eigenleuchtfarbe am Organ färbt die Flecken nicht, magenta Hintergrund auch nicht. Override-Material über die ganze Szene: einseitig (FrontSide) → schwarze Dreiecke genau dort, beidseitig (DoubleSide) → keine. 
- Ursache: Surface Nets gibt an einzelligen Wänden (Portale, Vorzeichen-Sperre) Dreiecke mit umgekehrter Windung aus; sie werden als Rückseite verworfen, man sieht durch. (Die frühere Annahme »Lungengefäß-Ausschnitt« war falsch.)
- Fix (v7, alle Organe): Dreieck, dessen Flächennormale gegen seine Eckennormalen zeigt, wird umgedreht (nicht entfernt). Herz: Hero 360, Light 204 Dreiecke gedreht. Bild Hero und Light an Portal 2 geschlossen, Override einseitig ohne Lücke.
- [BEWEIS] C2: runChecks ohne Fehler, Querschnitt-Treffer 0, kleinster Organabstand 21 m.

# 2026-10-03 (15) · Knetwelt-Linie · C2 Herz: alle Checks grün

- Prüfer: Löcher an Portal 2, Light-Röhre schloss an den Banden, drei error-Checks.
- Fix Löcher (v7, alle Organe): Kneten darf das Vorzeichen nicht umdrehen — wo das ungeknetete Feld innen ist, bleibt der Knet innen (global). Light: Schnittkugeln nach dem Vergröbern erneut gesetzt (`carve`) → Banden laufen im SVC-Portal durch (Bild Light). Rückseiten-Lappen-Filter wieder aus (entfernte 223 Dreiecke ohne Befund).
- Fix Strecke: Kehre in der linken Kammer als Track-Core-`HAIRPIN_180` (r 20 m, Lage am Stützpunkt nächst dem gemessenen Kammerpunkt, Drehsinn zur Ausstromseite, Ende per Probe-Kompilat), Einlauf waagrecht. NAHT: Ein- und Ausstrom der linken Kammer liegen anatomisch nebeneinander; der Ausstrom bis zur Aortenwurzel wird geschnitten, trägt aber keine eigene Track-Core-Röhre (tunnel: null) — sonst tunnel_shell. Rückweg endet am Umfahrungskreis dort, wo die Tangente der Startkurs ist (Kreis Rb + 300 m), dann S-Kurve auf die Startlinie.
- [BEWEIS] C2: runChecks ohne Fehler, Querschnitt-Treffer 0, kleinster Organabstand außerhalb der Tunnel 21 m. Bilder: SVC-Portal Hero und Light geschlossen, Portal 4 sauber.
- Rest: an Portal 2 (Ausfahrt rechter Tunnel) zwei kleine himmelblaue Flecken oben links in der dunklen Gefäßwand — Lage bei den ausgeschnittenen Lungengefäßen (O1-Befund »Öffnungen vorn am Herz«), nicht vom Tunnel. Offen.

# 2026-10-03 (14) · Knetwelt-Linie · C2 SVC-Loch gefunden und geschlossen

- Prüfer: freies Dreieck am SVC-Portal (Hero). Gemessen per Strahl: kein Netzteil, sondern ein LOCH in der Portalwand — der Strahl trifft erst 126 m dahinter die beleuchtete Herzwand. Ursache: dünne Wand am Portal, beim Kneten (blur, Knetgrad 2) weggeschmolzen. Wasser, Netz-Inseln, Normalen, Rückseiten-Lappen geprüft und ausgeschlossen (Filter bleiben als Absicherung).
- Fix (v7, alle Organe): im Umkreis 2,6 Röhrenradien um Tunnel-Schnitte darf das Kneten keine Knete wegnehmen: GT = min(geknetet, ungeknetet). Bild Hero: SVC-Portal geschlossen. Portal-»Fenster« (Öffnen bei dünner Wand) nur noch am Hirn, am Herz öffneten sie selbst ein Loch.
- Restbefund: an Portal 2 und 4 einzelne kleine Himmelsflecken in dünnen Gefäßstümpfen außerhalb der Tunnel (gleiche Ursache, Kneten) — nicht behoben, Schutz gilt nur nahe der Tunnel.
- C2 Strecke unverändert: drei error-Checks (inner_edge_fold an der Kehre in der linken Kammer und am Einflug, curvature_step, tangent_kink). Nicht abnahmefähig.

# 2026-10-03 (13) · Knetwelt-Linie · Netz-Inseln, C2 Kammer-Kehre offen

- Befund Prüfer C2 Hero: freies Dreieck am SVC-Portal = abgetrenntes Netzteil. Fix (v7, alle Organe): `dropIslands` — Netzteile unter 200 Dreiecken bzw. 0,2 % des größten Teils fallen weg (Herz: Hero 8, Light 2 entfernt).
- C2 Strecke: Ausfahrt nach dem Aortenbogen zwischen Bogentangente und Linie Aortenwurzel → Bogen; Einflug zum Start über eine zweite Gerade (Y0), Drehsinn des Rückwegs aus der Zieltangente (Variante).
- Gemessen (neue Diagnose wpNear): die enge Stelle »tunnel_herz_l13« liegt 51 m neben dem Punkt der linken Kammer — die Kehre Einstrom → Ausstrom knickt an der Spitze mit r ≈ 5 m (Bahn braucht ≥ 12,1 m). Versuche: getrennte Ein-/Ausstrompunkte, Halbkreis-Kehre r 20–30 m in der Kammer, Einflugpunkt auf dem Umfahrungskreis → alle schlechter (tangent_kink bis 128 °/m, tunnel_shell). Zurück auf den besten Stand: inner_edge_fold 43 (−6,5 m), curvature_step 0,016, tangent_kink 0,89. Nicht abnahmefähig.
- Nächster Schritt (Vorschlag): Kehre in der linken Kammer als Track-Core-Stück HAIRPIN_180 (Radius gesetzt, Lage am Kammerpunkt gemessen) zwischen zwei Tunnel-CONNECT-Zügen statt als gezeichnete Linie.

# 2026-10-03 (12) · Knetwelt-Linie · C2 Herz: Truncus vor dem Bogen, Portalwand Light

- Georg: Tracks gut einbauen, ohne Lücken/Artefakte; rechter Tunnel endet vor dem Aortenbogen; Eingang/Wand am SVC (Bild) fixen.
- Befund Wand: im Light-Raster (3,2 mm × 3,6 m/mm = 11,5 m Zelle) war der 7-m-Wandmantel dünner als eine Zelle → Blattwand mit gerader Kante. Fix (v7, alle Organe): Mantel ≥ 1,6 Light-Zellen; Light-Feld in Organen mit Tunnel aus 50 % Minimum + 50 % Mittel statt Mittel (dünne Wände bleiben stehen). Bild Light: SVC-Portal massiv, keine Blattwand. Hero: ein einzelnes oranges Dreieck links im SVC-Eingang (offen).
- C2: rechter Tunnel verlässt das Herz im Ausflusstrakt der rechten Kammer (halbwegs zum Truncus), nach vorn; tunnel_shell und self_clearance gelöst durch Vorhofpunkt näher an der V. cava inferior (0,8). Maß 3,6 m/mm. Nur enge Stellen nachgeglättet (Umkreisradius < 34 m). Einflug-Gerade vor dem Start, Zwischenpunkt am Körperkreislauf.
- [STAND] C2: Querschnitt-Treffer 0, kleinster Organabstand außerhalb 4,7 m. Offen (error): inner_edge_fold an zwei Stellen (Aortenbogen-Ausfahrt tunnel_herz_l13, Einflug h_einflug, Rand −6,6 m), curvature_step 0,016 (Grenze 0,01), tangent_kink 0,88 (Grenze 0,5). Nicht abnahmefähig.
- Prüfansicht neu: `api.portalViews(dist)` + `api.look(p, t)` (Portale im Bild prüfen, Kamera bleibt stehen).

# 2026-10-03 (11) · Knetwelt-Linie · G2 Portal-Scherben, C2 Herz in Arbeit

- Georg: am Ausgang des Hirn-Tunnels deutliche Mesh-Bugs (Bild Light). Herz: Weg des Blutes freigegeben.
- Befund G2: (1) Wandmantel (7 m) wurde auch an Portal-Kugeln vereinigt, deren Mitte an der Hirnoberfläche lag → Wulst über der Fläche, nach dem Schnitt Splitter. (2) Streifender Austritt lässt eine dünne Wand über/neben der Röhre stehen; Light (halbes Raster) zerlegt sie in Scherben.
- Fix (v7): Mantel nur für Schnittkugeln tiefer als r/2 im Organ. Portal ohne Scherben: je Tunnel-Kugel 8 Richtungen quer zur Fahrt; bliebe jenseits der Röhre < 6 m Wand, wird die Röhre dorthin geöffnet (Einschnitt statt Splitterwand), geprüft am ummantelten Feld. Bildnachweis am Ausgang steht aus (freie Kamera wird vom Kamerasystem überschrieben).
- C2 Herz (`KFB Herz-Attraktion C2.dc.html`, IN ARBEIT, nicht abnahmefähig): `heartLine` misst Gefäßansätze (Zellen mit Nachbar Herzwand) für SVC, IVC, Truncus, Vv. pulmonales, Aorta; Herzspitze; Vorhof R/L, Kammer R/L ins Volumen gezogen, Septum-Abstand. Lage: Richtung oben mit kleinster Höchststeigung (SVC und Aorta ascendens stehen sonst senkrecht). Maß 3,0 m/mm. Zwei Tunnelzüge (rechts: SVC → RA → RV → Truncus; links: Vv. pulm. → LA → LV → Aorta → Bogen), dazwischen und danach außen.
- Befunde C2 (offen): tunnel_shell — Truncus pulmonalis läuft anatomisch unter dem Aortenbogen, die Röhren r 15 m überlappen bis 9,5 m (Bogen-Schwerpunkt lag in der Konkavität → jetzt Bogenscheitel, Ausfahrt vom Truncus weg; hilft nicht genug). Abstoßen der Linien (42–50 m) erzeugte Wellen → aus. inner_edge_fold in der Kammer-Kehre RV → Truncus und am Bogen. Querschnitt-Treffer 0. Nächster Schritt: Ausfahrt rechts vor dem Bogen (Truncus kurz) oder Röhre in der Kreuzung schmaler.

# 2026-10-03 (10) · Knetwelt-Linie · E2 Löcher, G2 neu (Spirale + Sehbahn-Tunnel)

- Georg: E2-Tunnel »sieht super aus«, Löcher im Tunnel/Mesh fixen. Hirn präzisiert: Spirale kreisförmig um die Hirnoberfläche + leicht gewundene Tunnelstrecke Frontalhirn → Sehrinde, metaphorisch entlang Chiasma und Sehbahn (in `BRIEF_ORGAN_ATTRAKTIONEN.md` nachgetragen).
- E2 Löcher: Wandmantel im Feld — um jede Tunnel-Schnittkugel im Organ erst eine Kugel r + 7 m vereinigen (weich), dann schneiden. Wo das Organ dick ist, ändert sich nichts; an dünner Darmwand bleibt ≥ 7 m Knete um die Röhre. Gilt für alle tunnel_-Stücke in v7.
- G2 Hirn neu: Tunnel Stirnpol → Chiasma (gemessen: Region 46, Mitte 0 / −23,5 / 26,9 mm; Röhre 13 mm darüber, bleibt in der Hirnbasis) → Tractus seitlich → Sehstrahlung → Sehrinde (Region 17, Mitte 20 / −23 / −75 mm) am Hinterhauptpol. Danach Spirale um die geglättete Hülle, 2,2 Runden von −7 auf 40 mm, als Hangstraße (hang_, Schnitt 2 Lagen), Abfahrt weit vor die Stirn und Bogen zurück in den Tunnel.
- Befunde G2: Abfahrt dicht vor dem Pol lief durch den Stirnlappen (139 Treffer) → Abgang aus der Hangstraße nach außen + Wendepunkt 160 mm vor dem Pol. Hangstraße wurde als Tunnelfutter dunkel gefärbt (dunkles Band) → Futterfarbe nur an Tunnel-Schnitten. Hangschnitt 3 → 2 Lagen (Abstand der Runden 21 mm ≈ 48 m).
- [BEWEIS] G2: runChecks ohne Fehler, Querschnitt-Treffer 0, kleinster Organabstand außerhalb Tunnel/Hang 15,7 m. Bild 3/4: Spirale liest um das Hirn. Offen: Wand über der Hangstraße liegt im Schatten der Runde darüber (Fahrt-Bild dunkel links) · Blaue Flecken auf dem Hirn sind die H0-Flüsse in den Furchen (Wasser), keine Löcher — bitte bestätigen.

# 2026-10-03 (9) · Knetwelt-Linie · Brief persistiert, E2 Darm, G2 Hirn in Arbeit

- [GATE] Brief jetzt als Datei: `BRIEF_ORGAN_ATTRAKTIONEN.md` (Darm: Fahrt durch den Dickdarm als Tunnel-Strecke · Hirn: Serpentinen entlang der Hirnrundungen und -windungen zur Oberseite · Herz: Fahrt durch die Herzkammern als Tunnel-Strecke · alles in die Strukturen modelliert, passend für KFB-Tracks · Assist/Booster später).
- [CHANGELOG] neu `organ-islands.v7.js` (v6 bleibt mit G1/C1/E1 = FAIL). Tunnel aus vielen Stücken: ein Ein-/Austritt je zusammenhängendem Zug. Präfix `hang_` = Hangstraße (Schnitt 3 Lagen statt 12).
- E2 Darm (`KFB Darm-Attraktion E2.dc.html`): Colon-Mittellinie gemessen (Region 4 nach Winkel in der Frontalebene ab Caecum, Rektum 5 nach Höhe, geglättet, auf die Mittelachse gezogen), 753 mm. Lage: im Kegel 35° um anterior die Richtung mit der kleinsten Höchststeigung (θ 25°, φ 240°, max. Steigung 1,52 — Flexuren und Sigmoid sind steil, Physik später). Maß 2,6 m/mm, damit das Lumen (r ≈ 13 mm) die Schnittröhre r 13 m trägt. Tunnel = CONNECT alle ~45 m mit Kurs/Steigung aus der Linie; Ein- und Ausfahrt laufen bis 30 m außerhalb des Pakets; Rückweg außen.
- Befunde E2: Einfahrt als Nicht-Tunnel traf 56× Dünndarm → Ein-/Ausfahrt sind Tunnel-Stücke. closure U 2e-4 → Start auf Gerade, letzte Verbindung bankDeg 0. Bei 2,0 m/mm 10 % Stützstellen < 6 m an der Wand → 2,6 m/mm: 58 von 1 246 Proben mit Schnittröhre ≤ 2 m an der Wand (mögliche Löcher, Ein-/Ausfahrt ausgenommen).
- [BEWEIS] E2: runChecks ohne Fehler, Querschnitt-Treffer 0, kleinster Organabstand außerhalb des Tunnels 73 m. Fahrt-Kamera zeigt die Fahrt in der Knetröhre.
- Befund Prüfer E2: Bandenstrang zerfiel in Stücke, Röhre zu dunkel. Fix: Schnittröhre CUT_R 13 → 15 m (Knetwand schnitt den Strang, Reichweite am Bandenkopf war 0,9 m), Strang im Tunnel aus jeder 2. Stützstelle, Tunnellicht bei Zügen > 600 m alle ~70 m (höchstens 28; v5: 8 im Kosmos). Bild Fahrt: Strang durchgehend, Röhre warm beleuchtet. Wandnähe jetzt 82/1 246 Proben (Röhre größer). Checks grün, Querschnitt 0.
- G2 Hirn (`KFB Hirn-Attraktion G2.dc.html`, IN ARBEIT, nicht abnahmefähig): Schläge auf Höhenlinien der geglätteten Hülle, HAIRPIN_180 einwärts, Querversatz der Kehre per Probe-Kompilat gemessen (r 16 → 32,8 m). Befund: die Hirnflanke ist so steil, dass 33 m Einwärtsversatz 51–90 m Höhe bedeuten → nur 2 Schläge, Kehre mit 90 m Hub, tangent_kink/inner_edge_fold. Entscheidung nötig (siehe Chat).
- C2 Herz: nicht begonnen. Befund vorab: das Bake hat nur eine Herzwand (Kammern geflutet, keine eigenen Netze); Kammerlage nur über Gefäßansätze (V. cava, Aa./Vv. pulmonales, Aorta) zu bestimmen.

# 2026-10-03 (8) · Knetwelt-Linie · Urteil G1/C1/E1

- Georg: G1, C1, E1 sind nach Briefing FAIL (nicht nach Sprintplan; Darm ohne anatomisches Konzept durchtunnelt statt Fahrt durch den Darm; keine Serpentinen auf der Hirnoberfläche; derselbe Spiralkreis unter jedem Organ). Ergebnisse gut genug, um sie mit Doku ins nächste Session-ZIP zu packen.
- Befund: das Briefing lag nicht im Projekt; gesucht in Projektdateien, uploads/, _handover/, Repo kayfabizarro@main. Gefunden nur GATE 03.10. und O1-v1-Notizen. Gebaut wurde nach der N1-Schablone (Tunnel/Schlucht → Sprung → Kehre → Spirale unter dem Organ → Rückweg), ohne nachzufragen.
- Regel: vor einer neuen Attraktion das Briefing als Datei lesen; liegt es nicht vor, fragen statt Schablone.

# 2026-10-03 (7) · Knetwelt-Linie · N1 Harnleiter-Durchstich, Attraktionen G1 Hirn, C1 Herz, E1 Darm

- Georg: Harnleiter sticht durch den Track (Bild an der Bumper-Spirale).
- Befund: die Durchdringungsprüfung v3–v5 maß nur die Mittellinie gegen das Organfeld mit 1,5 m; der Track ist mit Bande 23 m breit, die glatte Harnleiter-Röhre (v5, r 5,6 m) stand nicht im Feld. Die Zählung blieb 0, gemessen jetzt: n_bumper 24 Stützstellen im Harnleiter, tiefster Punkt 2,7 m in der Röhre.
- [CHANGELOG] neu `organ-islands.v6.js` (v5 bleibt). `crossHits`: je 2. Stützstelle 5 Punkte über Fahrbahn + Bande (Breite + SIDE_EXTENT 4,32 m) × Unterseite/Bandenkopf gegen Organfeld und Harnleiter-Röhre (Abstand zur Mittellinie − RT). N1: Varianten (Spiralradius, Höhe, Hub, Drehsinn) kompiliert und geprüft, gewählt Rs = rBlase + 100 m (v5: + 75). Harnleiter-Abstand jetzt 6,3 m, Organ 4,6 m, alle Checks grün.
- [CHANGELOG] Attraktionen je Organ, nur Track-Core-Stücke, `boot(canvas, { only })`: `KFB Hirn-Attraktion G1.dc.html` (Fissur-Schlucht, Gedankensprung, Hirnstamm-Spirale, Gedanken-Wendel), `KFB Herz-Attraktion C1.dc.html` (Kammer-Tunnel, EKG-Strecke aus CREST/DIP, Aorten-Looping, Herzspitzen-Wirbel, Katapult-Kehre), `KFB Darm-Attraktion E1.dc.html` (Verdauungs-Tunnel, Peristaltik-Slalom OFFSET_S, Darmsprung, Rektum-Spirale, Katapult-Kehre).
- Gemessen am Feld: Hirn Scheitel 63,8 mm, Schluchtdeck 19 mm darunter, Kleinhirn-Unterkante −70 mm, Medulla Achse z −17,3 mm r 10,1 mm; Herzspitze tiefster Wandpunkt; Rektum = Region 5. Drehsinn der Stücke aus einem Probe-Kompilat. Spiralen/Kehren haben Einlauf-Klothoiden → Mitte bis 27 m neben dem Idealkreis; ein Kompilat messen, Eintritt verschieben, neu kompilieren.
- Befunde im Bau: Wendel-Mitte zu nah an der Stirn (hinterster Kreispunkt im Stirnlappen) → Mitte = vorderster Hirnpunkt + RH + 15 m. closure »profile diff 1,6« nach Sprüngen → letzte Verbindung mit params thin. EKG: Tunnel-Preset vererbt sich ohne tunnel: null (tunnel_morph, tunnel_shell im Looping); tangent_kink ∝ Höhe/Länge² am Wellenende → Wellen ≤ 0,0014. Darm: O1-Luftlücke im Tunnel berührt mit dem Querschnitt das Paket → ein Tunnel-Stück, 25 m früher. Hirnwasser schwebte über der Schlucht → Wasser auch über Schlucht-Säulen entfernt.
- [BEWEIS] runChecks je Attraktion keine Fehler; Querschnitt-Treffer 0. Kleinster Organabstand außerhalb Tunnel/Schlucht: N1 4,6 m, G1 8,7 m, C1 1,4 m, E1 2,6 m. Hirnfeld ist radial (r − R(Richtung)) und überschätzt den Abstand an schrägen Flanken, deshalb dort 3 m statt 1 m Schwelle.
- Offen: O1-Ring auf v6 nicht umgestellt (neue Prüfung würde dort Treffer zeigen, nicht gezählt) · Portal-Kamera zeigt bei G1 die Stirn, nicht den Schluchteingang · Bildurteil Georg.

# 2026-10-03 (6) · Knetwelt-Linie · N1 Fahrt angesehen, Streifen-Flackern

- Georg: Querstreifen auf der Fahrbahn flackern.
- Befund: Markierungen liegen 3 cm über der Fahrbahn mit demselben Material; bei near 1 m reicht die Tiefenauflösung auf Distanz nicht (Tiefenkonflikt). Dazu rendert der Composer in ein Ziel ohne MSAA, antialias kam nie an.
- Fix (organ-islands.v4.js, v4d, Import ?r=11): Markierungen eigenes Material mit polygonOffset −2/−4, kein Eigenschatten; Composer-Ziel HalfFloat mit 4 Samples.
- Fahrt in Standbildern (Tab im Hintergrund, Schleife stand; Bilder ohne Nachbearbeitung): Sprung, Rinne, Spirale, Katapult, Schlucht und Rückweg tragen. Offen: Tunnelinneres wird blauschwarz (nur Himmelslicht), gelbe Randlinie kippt dort ins Grüne; Harnleiter-Silhouette zackig; grünlicher Ton am Hilus der rechten Niere; Katapult-Streifen auf Distanz sehr dicht (in Bewegung prüfen).

# 2026-10-03 (5) · Knetwelt-Linie · N1 Löcher, helle Flecken, Harnleiter-Abgang

- Loch neben dem Kragen: Portal saß am ersten Punkt IM Organ; bei schrägem Eintritt brach die Schnittröhre vorher schon durch die Wand. Jetzt Portal dort, wo die Röhre das Organ zuerst berührt (Abstand < 0,9 r), geschnitten wird nur zwischen den Portalen.
- Helle Flecken und heller Kragen: Region per Schwelle 0,8 mm fiel außerhalb des Bake-Feldes auf Harnleiter-Farbe. Jetzt nächstes Teilfeld (Niere, Blase, Harnleiter).
- Harnleiter-Abgang: Mittellinie geglättet (4 Durchgänge ±4), Hohlkehle 9 mm an der Niere. Abgang jetzt als Bogen.
- Nachprüfung: helle Rechtecke an der Schlucht = Harnleiter-Netz reicht ins Nierenbecken → im Nierenfeld nur Niere 1/2. Austrittskragen stand bei streifendem Austritt als Henkel über → Kragen nur bis 1,2 Röhrenradien von der Organwand.
- Tunnel unten offen unter dem Deck bleibt so (Straßenbett später).

# 2026-10-03 (4) · Knetwelt-Linie · N1 Portale im Feld

- Georg: Nieren-Textur war richtig (zurück), Fehler sind die großen hellen Kreise; Portale haben Spalten, Schatten- und Clipping-Ränder.
- Befund Kreise: die 7-Proben-Mischung (v3) las Proben eine Zelle außerhalb der Niere als Harnleiter-Farbe; die Schwelle auf dem Int8-Feld zeichnete Höhenlinien. Jetzt zählen nur Proben im Organ.
- Portale: Kragen als Torus-Abstandsfeld am gemessenen Ein-/Austritt, weich mit dem Organ vereinigt, vor dem Kneten → eine Fläche. Futter = Schnittwand, dunkler gefärbt. Torus- und Röhren-Netze entfernt. organQuiet entfernt.

# 2026-10-03 (3) · Knetwelt-Linie · N1 Tunnel-Ausbau

- Befund Bild Georg: gelbe Röhre aus buildTrack stand über (hat Vertexfarben, Ausblend-Bedingung griff nicht), Wulst schwebte 12 m vor dem Organ, Kreis-Artefakte auf den Nieren.
- [CHANGELOG] Röhre aus buildTrack nie gezeichnet. Neu (Naht): Knet-Futter r 12,2 m nur zwischen gemessenem Ein- und Austritt am ungeschnittenen Organfeld, Wulst bündig an beiden Stellen, Farbe Organ. Niere mit ruhigem Profil organQuiet (ohne Werkzeug-Relief).
- [BEWEIS] Bild Portal: Futter und Wulst sitzen in der Nierenwand, keine Röhre steht über.

# 2026-10-03 (2) · Knetwelt-Linie · N1 v4 Knet-Tunnel, Schlucht, Booster

- [CHANGELOG] neu `organ-islands.v4.js` (v3 bleibt), `KFB Organ-Inseln O1 v4.dc.html`; N1 zeigt auf v4. Tunnelröhre unsichtbar, Portal-Knetwulst, Schlucht-Schnitt, Tilt 95°, Booster/Assist/Bounce als Track-Core-Daten (drive, skin buoy, MAG).
- Befunde: inner_edge_fold und Kehre, weil die Blase nur 390 m von den Nieren liegt und der Spiralstart seitlich lag → Spirale beginnt am fernen Punkt der Blase quer zur Anfahrt; 23 Stützstellen am Organ bei Spiralradius rBlase + 45 → + 75.
- [BEWEIS] runChecks N1: keine Fehler, keine Warnung; Durchdringung außerhalb tunnel_/schlucht_: 0.

# 2026-10-03 · Knetwelt-Linie · O1 v3 + N1 Nieren-Attraktion

- [GATE] Auftrag: Meshes zu stark verformt (Herz, Harnleiter), Farbfehler; Genius Loci als anatomische Stunt-Parcours, Probe Niere (Sturz, Harnleiter, Bumper-Blase, Katapult).
- [CHANGELOG] neu: `organ-islands.v3.js` (v2 bleibt), `KFB Organ-Inseln O1 v3.dc.html`, `KFB Nieren-Attraktion N1.dc.html`. Harnleiter = Röhre r 3,5 mm um die Bake-Mittellinie, Harnröhre entfernt. Farbe 7 Proben. Schnitt nur an `tunnel_*`, Durchdringung ehrlich gezählt.
- [NAHT] wie v2 (Tunnelschnitt); Attraktion: Punkte am Organ gemessen, Stücke und Werte aus dem Baukasten (KICKER/AIR/LANDING, SPIRAL, CONNECT wie cosmos-route.v1).
- Befunde: landing_dip 3,1 m bei LANDING 60/20 und 100/60 nach 80 m Fall → 110/85. bank_rate 1,57 °/m im S zwischen versetzten Nierenachsen → eine Achse. closure 6e-5 m mit STRAIGHT am Ende → CONNECT exakt auf den Start (cosmos Z. 67).
- [BEWEIS] runChecks N1: keine Fehler, keine Warnung. Ring v3: error-Checks grün, Warnung jump_speed 32 m/s (Hero-Sprung wie HX1).

# 2026-10-02 (2) · Knetwelt-Linie · O1 v2 Organ-Inseln nach Georgs Urteil

- [GATE] Auftrag verbatim: »keine eigene strassen und tracks bauen/erfinden → das muss alles mit unseren KFB tracks, versatz-stücken und baukasten-logik gebaut werden«, »alle organe … ohne bodenfläche … frei schwebende organe«, UI-Overlays stören.
- [CHANGELOG] entfernt: Inselstraßen (H0-Bandprofil), Zubringer, Dock-Platten, Nierenplatte, Inselkarte und Werkzeugleiste. neu: Tunnelachse je Organ, Track-Core-Runde aus cosmos-route.v1-Stücken, Strang aus hex-island.v5, Tunnelschnitt. unverändert: Bakes, Felder, Surface Nets, Farbe, Wasser, Bewohner, Hex-Insel, SKY3.
- [NAHT] Schnitt des Organs entlang der kompilierten Stützstellen (13 m um 4 m über dem Deck); alles andere an der Strecke ist Kopie.
- [BEWEIS] runChecks: alle error-Checks grün, 10,54 km; Skydrive-Spirale, Looping und Hero-Sprung im Kosmos-Bild sichtbar wie in HX1.
- Bild: Track läuft durch die Hirnfront (Portal offen), quer durch die Herzkammern, durch beide Nieren; Harnleiter hängen frei zur Blase.

# 2026-10-02 · Knetwelt-Linie · O1 Organ-Inseln (WSA-Brief Hirnwelt Refresh + Organ-Island Preview Pack)

- Georgs Weichen: alle vier in einem Lauf · Hirn ohne Fels, Hirnstamm als Stiel · volle Track-Core-Runde zu einer Hex-Insel · BodyParts3D geknetet · Niere/Harnleiter/Blase · Hero + Light gemessen · Straßen, Bewohner, Wasser · SKY3 · eine Bühne mit Umschalter · UI Resident Atlas.
- Bake (`bake-organs.v1.js`): STL dicht abgetastet → Oberflächenzellen → Zuschnittkanten je Ebene in 2D verschlossen → Außenflutung → exakter Abstandstransform. Darm 2,2 mm, Niere 2,5 mm, Herz 1,6 mm.
- Befund Herz: ohne Lungengefäße lief die Flutung durch die Pulmonalklappe in die Kammern (Volumen 418 statt 821 ml). Lösung: Lungengefäße schließen die Wand und werden zur Laufzeit wieder ausgeschnitten.
- Befund Niere: Anker nach 3D-Richtung lagen alle nahe der Mitte (Runde 153 m), weil die Strahlen durch die dünne Platte nach oben austreten. Flache Inseln vergleichen jetzt waagrecht und ziehen zum Rand: 1 590 m.
- Befund Strecke: Hex-Insel in der Ringmitte → Runde kreuzt sich (self_clearance). Hex-Insel auf den Ring gesetzt; Dock-Tangente lief im Uhrzeigersinn gegen die Inselfolge → umgedreht. Danach 8,99 km, alle error-Checks grün.
- Befund Dock: Strahl nur in der Inselmitte → Strecke auf Kuppenhöhe. Jetzt Höhe als Anteil der Inselhöhe, Abstand = größte Ausdehnung über Dock und Anläufe.
- Messung Vorschau: Light = 27–30 % der Insel-Dreiecke; Szene 2,3 → 1,7 Mio △ (Kosmos), Bildzeit kaum verändert, weil die Strecke 578k △ trägt.

# 2026-10-01 · Knetwelt-Linie · I4 Insel-Grammatik nach Georgs Rebriefing

- Rebriefing 01.10.: I1–I3 lesen als runde Blobs mit Tellerplatte, Ringkante, Stufentorte, stumpfen Flüssen. Auftrag: eine Grammatik, drei Archetypen.
- `island-grammar.v4.js`: vier Ebenen als getrennte Netze (Fels, Platte, Formen, Wasser). Jede Ebene ein Abstandsfeld, Surface Nets + Projektion. Fels = Vielflach aus Ebenenringen mit log-sum-exp-Rundung.
- Archetypen A Fluss-Canyon (Wasserfall), B Alpin (Bergsee, Massiv aus dem Kern), C Lagune (Überlauf). Farbe aus Form: Erde nur auf steilen Flächen, Zone B aus Regel.
- Prüfungen am Netz im Panel (Wasser am Rand, Randring, Ebenen/Rundung, Tiefe/Breite, Siedlungskreis, Anschluss). Alle drei grün bei s0.
- Befunde im Bau: Erd-Schwelle bei Neigung 37° färbte die Kantenrundung → Ring in der Draufsicht; jetzt erst ab ~60°. Anschluss lag in der Randabsenkung (11,3°) → Regel »ebene Landung«, jetzt 0,0°. Alpin-Stein #bfc9c0 war vom Schnee nicht zu unterscheiden → WORLDS.canyon.kart.1.
- Grammatik: `lab-island-i0/GRAMMAR_I4.md`.

# 2026-09-28 (6) · Knetwelt-Linie · S1 Knet-Straße FAILED, Postmortem, Export, Handover WSA

- Georg 01:34: »Eindellungen sind okay. Der Rest ist ein Fail«, Sample (Knet-Altstadt) beigelegt. 01:38: Schatten-/Clipping-Bug zurück.
- `POSTMORTEM_S1_KNET_STRASSE.md`: neun Befunde (Bordstein als Wurst, Rinne als Loch, Kratzerteppich, Markierung als Stöcke/Haltelinie falsch, Palette ohne Werteleiter, Schatten, Möbel, kein Straßenraum, schwebende Markierungen durch normalBias 0,15 und fehlenden Kontaktschatten), fünf Wurzelursachen.
- Export `export/KFB_KNET_STRASSE_S1_FAIL_2026-09-28/` mit Handover an WSA.

# 2026-09-28 (5) · Knetwelt-Linie · S1 v3 Bordstein als Kante, T3 v3 Markierungen auf dem Stream

- Georg: Bordsteine draufgesetzt, am Zebra läuft der Bordstein weiter, Straßentextur fast weg, Linien-Artefakte.
- `road-scene.v3`: Rinne → Bordstein-Zug (Profil, Fugen als Kerben) → Gehweg bündig. Erster Versuch mit Einzelsteinen (ExtrudeGeometry je 1,5 m) hatte Spitzen durch gespiegelte Basis → verworfen, jetzt ein Zug entlang der Linie.
- Linien gemessen (Schalter einzeln): Falten der Facetten. Fahrbahn ohne Falten, kräftigere Werkzeug-Mischung.
- `track-look.v5` (T3 v3): Knetwurst-Markierungen auf TD03, je Welt und Zustand; Looping-Leitbänder; Magnet-Winkel an den Stream-Balken.
- K2 lädt jetzt `clay-relief.v5` (`?r=8`).

# 2026-09-28 (4) · Knetwelt-Linie · S1 v2 Knet-Straße nach Georgs Kritik

- Markierung als ein Prinzip (Knetwurst, drei Stärken, 1,5-m-Raster, Knubbel an Treffpunkten), Palette je Welt (`ROADPAL`), Stadtmöbel per Vertex-Atlasfarbe auf die Palette gezogen, Ampel-Blickrichtung aus Lampen-/Pfahlschwerpunkt gemessen, Bordsteinblöcke mit Fuge, Ecken ausgerundet (fillet).
- Naht auf der Fahrbahn gemessen am Screenshot: Nudelholz-Rechtecke (gerade Enden, scharfer Grat) → `clay-relief.v5` elliptisch, weicher Grat, keine Riefen.
- Erste v2-Ladung ohne Vertex-Atlas: Ampeln waren einfarbig hell (KayKit färbt über eine Atlas-Textur, nicht über Materialfarben).

# 2026-09-28 (3) · Knetwelt-Linie · S1 Knet-Straße (Markierungen, Verkehrsplatz, Stadtmöbel)

- Georg: Fahrbahn jetzt mit optimieren; Mittelstreifen je Track/Biom; übliche Verkehrssituationen (FS01 später); Looping-Streifen, Zebra, Parkzonen, Bürgersteige mit Bordstein, Ampeln (KayKit zuerst).
- `road-scene.v1.js`: zehn Markierungsstile als Daten, Verkehrsplatz, Musterstraße. `clay-toolmix.v2.js`: road, paint, pave, curb.
- KayKit City Builder im Registry gefunden (`registry/assets/v1/packs/kaykit-city-builder-bits-1-0-free.json`: trafficlight_A/B/C, streetlight, bench, firehydrant, trash_A/B, dumpster); geladen, alle ohne Fehler.
- Dateiname mit ß ließ sich per Skript nicht schreiben → `KFB Knet-Strasse S1.dc.html`.

# 2026-09-28 (2) · Knetwelt-Linie · K2 eingecheckt, Kreuzraster und Maserung gemessen, Mischungen, T3 v2

- Georg: »top! das ist super« · einchecken, ausbauen, optimieren.
- Kreuzraster: Fingerabdrücke aus / Feinkorn aus → bleibt; alle Werkzeuge aus → weg; nur Spachtelzug → da. Ursache: Querriefen des Spachtelzugs, gekreuzt durch überlappende Züge und die drei Kachel-Lesungen. `clay-relief.v4` ohne Querriefen, Nudelholz-Riefen auf ein Drittel.
- Maserung auf Hügeln, Querstreifen am Strang: Macro (v2-Karte, 1/7 Frequenz) aus → weg. `clay-material.v10`: Legacy je Material (`profile.legacy`), Macro folgt. v10 wurde vor dieser Änderung nur in K2 geladen und per `?r=2` neu geholt.
- `clay-toolmix.v1.js`: Mischungen für Türme, Strang, Gelände, Kronen, Stämme, Fels, Wolken, Karts. Zweite Runde nach Bildurteil (Kronen-Dellen lasen als Krater).
- T3 v2 (`track-look.v4.js`): T3 unverändert in Geometrie, Material K2, Fahrbahn legacy 1.

# 2026-09-28 (1) · Knetwelt-Linie · K2 Knet-Werkzeuge (clay-material.v9, clay-relief.v3)

- Georg 27.09.: mehr Variation, Stärken und Größen der Knetspuren; Übergänge »unsauber, hart geschnitten« (Screenshots O-Town-Turm).
- Gemessen in der Prüfansicht Facetten: v8 kippt jede Zelle ganz → harte Polygonkanten. v9 lässt die Kippung zur Grenze auslaufen. Kachelzellen breiter gemischt und nach einem Richtungsfeld gedreht.
- Neu: sechs Werkzeugkarten einzeln (zwei je RGBA), je Material Stärke/Größe/Abdeckung, Werkzeugzonen statt Gleichverteilung, v2-Handspurkarte abschaltbar.
- GitHub geprüft: Track Core auf georg-doc-patch-2 bis v0.10 (S10, S10b, S11: Boxengasse, WEICHE, Rampenenden, Deck-Schicht); TD03-Stream laut S11 unverändert. Georgs Entscheidung A+B (TRACK_LOOK_DECISION.v1) liegt vor T3 und ist durch T3 überholt. T2-FAIL- und T3-Export liegen im Repo unter tools/KFB-ToolBox/_inbox/ (T3 als »TUNE«).

# 2026-09-27 (10) · Knetwelt-Linie · T3 abgenommen als Basis, Export + Handover WSA

- Georg: »Top! wir haben endlich ein Design ;-) … sehr coole und ausbaufähige Basis«.
- Export `export/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/` mit START_HERE, HANDOVER_WSA, DESIGN_SPEC_T3, NEXT_CHAT, Belegen.

# 2026-09-27 (9) · Knetwelt-Linie · T3 Knetstrang (track-look.v3)

- Neue Bühne nach KONZEPT_S4_KNETSTRANG: Strang als ein Körper je Welt, Fahrbahn aus Stream-Slots road_L..road_R unverformt (Mitte gegen p gemessen), Straßenprofil wie T2 21:30.
- Stützen mit Cartoon-Anatomie (Lathe-Profil), Welt nach Rule of Three, Kugel-in-Kugel ohne Facetten (Ikosaeder verschweißt).
- Drei Welten als Farbsätze auf denselben Massen; Graustufen-Schalter für Bedingung 5 (Canyon-Fahrbahn danach abgedunkelt).

# 2026-09-27 (8) · Knetwelt-Linie · S4 Track-Look FAILED, Postmortem, Export, Handover WSA

- Georg: T1/T2 im Look vollständig verworfen (Design, Palette, Cartoon-/Knet-Anatomie, Schildchen, Stützen, schlampig). Gut nur die Fahrbahn-Texturen.
- **Neu:** `POSTMORTEM_S4_T1_T2_TRACK_LOOK.md` (12 Befunde mit Beleg, 6 Wurzelursachen, Nie-wieder-Liste).
- **Export:** `export/KFB_TRACK_LOOK_S4_T2_FAIL_2026-09-27/` mit HANDOVER_WSA (Re-Briefing Design- & Art-Guidelines), NEXT_CHAT, Belegen, Technikstand.
- Onboarding für frischen Chat aktualisiert: kein Bau vor dem Re-Briefing.
- **Fahrbahn-Relief wiederhergestellt** (Georg: im Export nicht mehr da): Abdruck-Kachel 4,5 × k, Druckwellen 0,5, Detailweite 0,6, Handspuren 0,7, Fahrbahn-Rollen ohne Überschreibung, Stand 21:30.
- **T2 lud im ersten Export nicht** (Streuung vor `ctr`): behoben, Export neu gepackt.

# 2026-09-27 (7) · Knetwelt-Linie · T2 verworfen, Konzept »Knetstrang« zur Freigabe

- Georg: Design, Farben, Cartoon- und Knet-Look von T2 »totaler Fail«, Palette schlecht, wirkt wie Drahtgitter, schlampig; Banden-Schildchen »AI-Slop«. Gut: nur die Fahrbahn-Texturen.
- Sofort: Tafeln entfernt, Fahrbahn wieder mit vollem Straßenprofil, Kerb-Streifen beginnen auf Streifengrenzen, Richtung CB (Claybound-Palette), Streuung nach Rule of Three.
- **Konzept** `lab-track/KONZEPT_S4_KNETSTRANG.md`: drei Massen/Farben + ein Akzent, dick statt dünn, Bedeutung durch Form (Rippen, Prallwulst, Pfeilkerben), eine Handgröße, Welt statt leerer Tisch. Bau erst nach Freigabe (T3).

# 2026-09-27 (6) · Knetwelt-Linie · S4 Produktionspass AB (T2)

- **Rand neu: »Ein Guss«** (Georg: Banden kleinteilig, helle Kappe, Bauch-Verformung, riesige Knet-Artefakte verworfen). Hohlkehle + Randwulst + glatte Außenwand, zwei Farben je Welt, Kerb-Farbe nur innen in Kurven, Warntafeln außen, Cartoon-Stützen. Fahrflächen ohne Abdrücke/Druckstellen.

- **Nachtrag Georg:** doppelte rot-weiße Bande (Kerb + Wand nebeneinander) verworfen. Jetzt eine Bande je Stelle aus der Krümmung: Kerb-Streifen innen (R < 60 m), Warnblöcke außen (R < 35 m), sonst ruhig. Alle Meshes in Knete, auch Tunnel-Lichter; Detail trägt weiter.

- Georg: K7 als Checkpoint akzeptiert, keine weitere Politur und Bereinigung. Richtung AB: A Material/Licht/Knete, B Streckensprache, C Preset.
- **Neu:** `KFB Knet-Strecke T2.dc.html` → `lab-track/track-look.v2.js` + `track-kit.v2.js`. Szenen TD03, TN02 (Gotthard), Kanten-Atlas (18 Zeilen, Knetstärke-Vergleich).
- Übergänge als deterministische Knetflecken im Shader über (s, u); Reihen an Ereigniswechseln doppelt, damit nichts verwischt. Nahtansicht binär.
- TN02 aus `georg-doc-patch-2` geholt (`S9_RESPONSIVE_2026-09-27/tn02.graph.stream.json.gz`). Röhre aus `tunnelRings`, Beule ≤ 0,7 m, Hülle gemessen.
- **Befunde:** Bahn-Schulter effektiv 0,59–0,69 m (`sideL` 0,30–0,35) → Auslauf nur als Core-Wunsch zeigbar · Kappe 0,30 m am Kicker im Ist-Zustand · Stirnflächen als Fächer deckten den U-Querschnitt zu → echte Triangulation · FS01 SOURCE_REQUIRED · Profil-Nachrechnung: Seitenfaktor auch auf `shoulderDrop` (Prüfer), `barrierVis` < 1 nicht nachgebildet und so ausgewiesen.

# 2026-09-27 (5) · Knetwelt-Linie · K7 eingecheckt, S4 Track-Look gestartet (T1)

- **K7 Knet-HUD** von Georg abgenommen (»top!«), Session-Export `export/KFB_CLAYMATION_K7_KNET_HUD_2026-09-27/` mit K7, K1 und den Modulen. K1 läuft auf `clay-catalog.v5.js` (Namen unter dem Zeiger, »Alle Namen«).
- **S4 v2 Brief** (Track Core → Claude Design) angenommen. Streams nach `lab-track/data/` kopiert (TD03, Split-Seed), Referenz-Loader unverändert daneben.
- **Neu:** `KFB Knet-Strecke T1.dc.html` → `lab-track/track-look.v1.js`, Skin-Satz `lab-track/track-skins.v0.1.json` (`kfb.track-skins/0.1`, Optionen A/B/C, je Rolle Farbe + Knet-Rolle + Maßstab).
- Querschnitt je Fläche unterteilt: Kappe als Wulst (≤ 0,30 m), Rolle `kerb` auf der Schulter außerhalb road_L..road_R, Wandblöcke mit Fuge (B). Fugen gestaffelt nach b13 (Kappe −16…+2 m, Fahrbahn −3…+16 m).
- Knet-Geometrie in Stream-Koordinaten: Beulen außen 0,35 m, innen 0,12 m, unten 0,30 m, Daumendellen 8 cm, Absacken 35 % — jeweils × Stärke. Fahrbahn unverformt; Mittellinie gegen `p` wird gemessen.
- **Befunde:** `tn02.graph.stream.json.gz` und `fs01.graph.stream.json.gz` fehlen im ZIP (Tunnel- und Pad-Bilder blockiert) · kleinste Kappe 0,30 m am Kicker (i 2864, `barrierVis` 0,22).

# 2026-09-27 (4) · Knetwelt-Linie · Knet-HUD K7, Material v8

- **Neu:** `KFB Knet-HUD K7.dc.html` → `lab-clay/clay-hud.v1.js`. Schrift als Relief (Canvas → Höhenfeld), Platten mit Tuschrand, Federn für Sichtbarkeit/Hover/Druck/Stoß, Reaktion je Modus in `localStorage` `kfb-hud-k7`.
- Modelle per Byte-Abfrage geprüft (25 Pfade, alle 206): Rucksäcke Orc, Hoarder, Survivalist, Tiefling, Space-Ranger-Jetpack; Inventar aus KayKit, Kenney Holiday/Toy-Car, Platformer Kit, KFB-Krone. Donut und Popcorn-Box prozedural (kein Spender).
- **Material v8:** Handmaß (`uClayHand`) für Handspuren, Feinkorn, Abdrücke; Druckstellen/Kerben größer als eine Fingerkuppe werden flacher. K1 → `clay-catalog.v5.js` (Blasen als Platte mit gezielter Spitze/Perlen, Namen nur unter dem Zeiger), H0 → `brain-world.v8.js`.

# 2026-09-27 (3) · Knetwelt-Linie · Knet-Katalog K1

- **Neu:** `KFB Knet-Katalog K1.dc.html` → `lab-clay/clay-catalog.v3.js`. 20 Muster (Gelände, Tafelberg, Fahrbahn, Teich, 2 Häuser, Baum, Busch, Felsen, Laterne, Ampel, Hydrant, Bank, Wolke, Black Knight (Large), Farmer A (Medium), Taxi, Polizei, Sprech- und Denkblase) in Weltmaß.
- Blasen: Kugel-in-Kugel, kein Schatten, Tuschrand als umgedrehte Hülle, drehen sich zur Kamera, atmen.
- **Befunde (Pixel):** Druckstellen im Profil »Gelände Hintergrund« lesen auf dem flachen Tisch als Mondkrater → Tisch eigenes Profil, Tiefe nach Handmaß als K2 · Blasen waren doppelt so groß wie die Figur → 0,55 · Kamera auf die hintere Reihe verdeckt von Häusern → fester Blick von vorn.
- 36 fps in der Preview, 0,5 Mio. Dreiecke.

# 2026-09-27 (2) · Knetwelt-Linie · Clay Look Kit K1: Material v7 + Profile je Asset-Klasse

Georg: Knet-Mapping je Asset-Typ und Größe, Detail nach Entfernung, keine Wiederholung, mehr Kerben und Leben;
Klassen zuerst Gelände Vordergrund, Natur, Häuser, Straße; Spuren Kerben, Haarrisse, Druckstellen; Zoom bis Figur nah; 30 fps Laptop; Prüfung direkt in H0/D1.
Danach: Entwicklung primär in WorldBuilder, Racer, ToolBox → `PLAN_KFB_CLAY_LOOK_KIT.md`.

- **Neu:** `lab-clay/clay-material.v7.js`, `lab-clay/clay-profiles.v2.js` (10 Klassen). H0 → `brain-world.v7.js`, Regler Kerben, Haarrisse, Druckstellen, Farbunruhe, Bänderansicht.
- **Fingerprints 01:** cgbookcase CC0. Die `.meta` im joebinns-Repo sind nur Unity-Importeinstellungen.
- **Befunde (Pixel):** v5 kompilierte nicht (`patch` ist in GLSL ES 3 reserviert) → v6. Band »nah« nie erreicht → ×2,5 (v7). Risse lasen als Netz, Druckstellen zu dicht → Profile v2.
- **Offen:** Fingerabdrücke nach Handmaß (K2), D1 und M0 noch auf v4, Wasserkante zackig, Bildrate auf Laptop nicht gemessen.

# 2026-09-27 · Knetwelt-Linie · H0 Hirnwelt (lab-brain, neu) + How-to + Session-Export

Georgs Auftrag (eingesprochen): anatomisch korrektes Hirn als kleine Weltkugel im Knet-Look, Straßen,
Gebäude, Landmarken, KayKit-Medium- und -Large-Figuren, Wolken als Kugel-in-Kugel, Natur und Zivilisation
aus den anatomischen Strukturen. Georg: »begeistert … großartig«.

- **Gelände:** BodyParts3D 3.0 (DBCLS, CC BY-SA 2.1 JP), 44 STL-Netze, auf eine Würfelkugel gebacken
  (6 × 161², äußerster Strahltreffer, 98,9 % getroffen) → `lab-brain/brain-world.v1.bin/.json`.
- **Bühne:** `lab-brain/brain-world.v4.js` (v1–v3 gelöscht, kein Importer). Wasser als Schale unter der Hüllfläche,
  Straße per A* über die Grate, Brücken aus der Hüllkurve, Profil mit Knetwülsten.
- **Orte** nach Funktion: Stirnstadt, Motorik-Ring, Zentralfurche, Scheitelfelder, Sternwarte, Hörbühne,
  Mandelkern, Gedächtnisarchiv, Insel, Lebensbaum-Wald, Brückenlager, Balkenbrücke.
- **Figuren** nach Resident Atlas: 4 × Rig_Large, 10 × Rig_Medium, ein Maßstab 0,47. 8 KayKit-Autos.
- **Befunde:** Insula (FMA72977/8) erreicht die Oberfläche nicht, frei liegt Region 34/35 · leerer Anker → NaN-Kamera
  (abgefangen) · Gelände stieß durchs Band, jetzt über die ganze Breite geprüft · BodyParts3D hat keinen
  Gyrus frontalis inferior (Broca).
- **Neu:** `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`, `ONBOARDING_frischer_chat_claymation.md`,
  `HANDOVER_WSA_claymation.md`. `LIVING_CLAY.md` neu gefasst mit Pflege-Regel (≤ 120 Zeilen).
- **Export:** `export/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/` + ZIP.

# 2026-09-26 · Knetwelt-Linie · D1 v5: ein Relief-Weg für alles, Steuerung im Hub-Stil

- Georg zu v3: »die texturen auf den großen steinen war vorher besser«. → v4: Kissenziegel zurück auf
  den Modelle-Weg (Stempelkarte, Druckfacetten, Falten, Fingerabdrücke).
- Georg: »bitte alles mit passender, variabler clay-texture, also auch den lila blob, wolken, mesas«. → v5:
  `clay-probe.v5.js` + `clay-material.v4.js`. Alle Objekte auf dem Modelle-Weg. Neu: `scale` je Material
  (Deckel 1,4 · Würste 0,45 · Knetmasse 0,9 · Wolke 0,75 · Tafelberge 3,2), dazu Streuung ±20 % je Objekt
  über `claySeed`. Der prozedurale Flächen-Weg (`CLAY_PROC`) bleibt im Material, wird nicht mehr benutzt.
- Panel: Flächen-Regler entfernt. Stil nach `kfb-hub/index.html` (Karte weiß, Radius 18, Akzent #5d4cff,
  Systemschrift), per Icon oben links ein-/ausblendbar, Zustand in localStorage `kfb-clay-panel`.
- Superseded: `clay-probe.v3.js`, `clay-probe.v4.js`, `clay-material.v3.js` (kein Importer).

# 2026-09-26 · Knetwelt-Linie · Claybound-Recherche und D1 Knet-Probe (lab-clay, neu)

Georgs Auftrag: Claymation-Look für Race Track, Welt und Kid-Figuren; Vorlage Claybound (Three.js).

- **Konzept** `KFB Knetwelt Look-Konzept.dc.html`: Quelle belegt (dermosef91/claybound, README/PR-Texte;
  Repo über unseren Zugang 404), 14 Referenzen unter `ref/claybound/`, Palette gemessen, Kernfrage
  beantwortet (Relief = Licht + Textur, Silhouette = Geometrie), Entscheidungen, CC0-Kandidaten,
  Richtung »KlayfaBizarro« (Gummi federt, Knete bleibt verformt).
- **D1** `KFB Knet-Probe D1.dc.html` → `lab-clay/clay-probe.v3.js`, `clay-material.v3.js`,
  `clay-relief.v2.js`, `clay-soften.v1.js`. Georg: »top! guter erster POC«.
- v1 → v2: Saat je Objekt (Wiederholung kam aus dem Objektraum), Druckfacetten nach joebinns/clay
  (Verfahren, kein Code), Fingerabdrücke cgbookcase via joebinns/clay.
- v2 → v3: Georg »Texturen viel zu unnatürlich und repetitiv … für Carl & Modelle passt es«. Flächen
  ohne Quellmaterial vollprozedural; verworfen: Höhenlinien (Holzmaserung), dichte Züge (Cord).
- Stand-Dokument `LIVING_CLAY.md`.

# 2026-09-19 · Antriebs-Mods · rotierender Propeller als Modul (lab-v9, additiv)

Georgs Auftrag: den Propeller passend zu Flugmodus und Geschwindigkeit drehen — und denselben
rotierenden Propeller als **Mod** benutzen, um Fahrzeug-Rigs wie die Badewanne mit
Cartoon-Logik-Antrieben zu bestücken.

**Der Befund hat die Aufgabe zusammengezogen: KEIN Flugmodell hat einen Propeller.** Gemessen
über `KFB Antrieb Probe.dc.html` an allen zehn Flug-Fixtures — jedes Teilnetz mit Namen, Hüllmaß
und Mitte, roh aus der Datei:

| Fixture | Netze | Antriebsknoten |
|---|---|---|
| Airplane A | 1 (`PUSHILIN_Plane_Circle000`) | keiner |
| Airplane B | 3 (`Torus001_1 … _2`, nach MATERIAL geteilt) | keiner |
| Low poly Fighter | 1 (`Node`) | keiner |
| Paper Plane | 1 | keiner |
| Spaceship A–B, Barbara, Fernando, Finn, Rae | je 1 | keiner |

Damit ist »den Propeller drehen« nicht machbar und »einen Propeller anbauen« die einzige
ehrliche Fassung — also ist der rotierende Propeller von vornherein ein Mod. Georgs zwei Punkte
sind ein Bau.

## Gebaut

| Datei | Rolle |
|---|---|
| `lab-v9/drive-mods.v1.js` | Trägerrahmen, EINE Drehmaschine, drei Mods, Flug→Schub-Naht |
| `lab-v9/mod-store.v1.js` | Anker, Größe, Drehsinn je Träger und Mod — mit Gedächtnis |
| `lab-v9/mod-carriers.v1.js` | Badewanne als Träger, dazu der Weg für »bring your own model« |
| `KFB Antriebs-Mods Werkbank v1.dc.html` | Die Werkbank |
| `KFB Antrieb Probe.dc.html` | Die Knotenprobe, auf der der Befund oben steht |

## M1 · Wagenrad und Blur sind DIESELBE Zahl

Beide kommen aus dem Blattwinkel je Blendenbild, Δ = omega / shutterHz, gegen den Blattschritt
2π/Blattzahl. Ab Δ > Blattschritt/2 ist die Drehrichtung mehrdeutig (Abtasttheorem) — das ist der
Wagenradeffekt, und die scheinbare Drehzahl ist der auf ±Blattschritt/2 gefaltete Rest. Ab
Δ > 1,4 × Blattschritt blendet die Scheibe auf. Die Schwelle ist damit ABGELEITET und verschiebt
sich von selbst, wenn Blattzahl oder Blende sich ändern. Gemessen an airplane-a, 4 Blätter,
Blende 24 Hz:

| Schub | U/min | scheinbar | Δ / Blattschritt | Blur |
|---|---|---|---|---|
| 0 (Ruhe) | 0 | 0 | 0 / 1,571 | 0 |
| 1 nach 200 ms | 144 | 144 | 0,63 | 0 |
| 1 nach 1 s | 399 | **39** | 1,74 | 0,70 |
| 1 voll | 544 | **−176** | 2,37 | 1,00 |

Die Zeile bei 1 s ist der Beweis: 399 echte gegen 39 scheinbare Umdrehungen, und bei Vollgas
läuft die scheinbare Drehung rückwärts. Nichts davon ist eingestellt.

## M2 · Ruhe muss exakt Ruhe sein

Erste Fassung ließ den Propeller nach elf Sekunden noch mit **22 U/min** tuckern — eine
Exponentialkurve erreicht die Null nie. Ein Standbild wäre damit nicht reproduzierbar (V8 der
Fahrzeuglinie). Jetzt schnappt die Drehzahl unter einem Viertelprozent der Höchstdrehzahl auf
exakt 0, und der Winkel mit ihr. Nachgemessen: `ruhe_nach_14s` = 0,000.

## M3 · Fahrtwind ist nicht der Gashebel

Die Windmühle (Propeller dreht ohne Schub, weil Luft durchgeht) hing am selben Regler wie der
Schub. Folge, gemessen: bei **gesperrtem Anwerf-Gate** drehte der Propeller mit 57 U/min — er
hielt sich am eigenen Schub fest. Jetzt kommt Fahrtwind ausschließlich aus dem Flugzustand;
im Reglerbetrieb ist er null und die Werkbank schreibt das hin.

## M4 · Ein Gate, das nicht schließen kann, ist keins

Das Anwerf-Gate setzte nur `requireCrank`, ließ den Zustand aber auf »läuft« — der Gashebel wirkte
weiter (gemessen: 278 U/min ohne jeden Ruck). Das Gate einzuschalten heißt jetzt: der Motor ist
AUS. Nachgemessen: ohne Ruck 0 U/min, nach dem Ruck fängt er und steht bei 316 U/min.

## M5 · Eine skalierte Gruppe ist kein Anschlusspunkt

Das Propeller-Asset ist 66,74 Einheiten groß und wird mit Faktor 0,0074 auf die Wanne skaliert.
Die Blur-Scheibe hing zuerst unter dieser Gruppe — und schrumpfte mit. Jeder Mod hat jetzt eine
äußere, unskalierte Gruppe als Anschluss und eine innere als Dreher. Dieselbe Falle wie bei der
Nabe: die wandert über eine eigene Gruppe in den Ursprung, nicht über die Position des
Asset-Wurzelknotens, sonst löscht man stillschweigend dessen eigenen Versatz.

## M6 · Zwei Betriebsarten, und die Grenze steht im Bild

**zeigen** (Vorgabe): der Mod liest Schub und Fahrt und schreibt ausschließlich in eigene
Präsentationsknoten. **treiben**: der Mod BIETET Schub und Auftrieb an (`offer()`), die Werkbank
wendet sie auf einem **Laufband** an — das Raster läuft, der Träger bleibt im Bild. Ein Mod bewegt
nie selbst ein Fahrzeug, und die Kopfzeile sagt jederzeit, welche Art gerade läuft.

## Gemessene Anbauten (Badewanne, Schub 0,80)

```
Trägerrahmen   Spannweite 2,000 · Länge 3,000 · Höhe 1,608 · Mitte y 0,804
Propeller      Anker Nase (0 / 0,804 / 1,500) · Asset 66,74 × 6,52 × 55,86 · Achse y
               Nabe (1,225 / 2,405 / −1,908) · 8,54 von der Boxmitte entfernt · 4 Blätter
               Maßstab 0,00743 · 708 U/min · Blur 1,00
Anti-Grav      Anker Bauch, hängt R × 0,38 darunter · Ringe 1,687 breit · 416 U/min · Auftrieb 0,77
Schubdüse      Anker Heck (0 / 0,804 / −1,500) · 2,463 lang mit Flamme · 864 U/min · Schub 0,80
```

Der Abstand Nabe zu Boxmitte (8,54 bei Radius 37,7) ist der Grund für die Regel: eine Hüllbox
hätte den Propeller exzentrisch laufen lassen.

## Offen

- **Außenbordmotor und Schaufelrad** sind nicht gebaut — Georg hat drei von sechs Mods gewählt.
- **Kein Ton, kein VFX.** Blasen an der Wanne, Hitzeflimmern hinter der Düse, Kondensstreifen am
  Propeller: Skill §15 verlangt erst die Choreografie. Die Flamme ist bereits ein Kegel mit
  additiver Mischung, also schon ein Effekt — mehr nicht.
- **Die Charakterwerte sind gesetzt, nicht gemessen.** Blattspitzentempo, Anlauf- und
  Auslaufzeit, Tuckerstärke sind der Charakter der Bewegung und gehören Georg. Regler stehen.
- **Abnahme an sechs Trägern fehlt** (V13). Gemessen sind bisher airplane-a und die Wanne.
- **Die Blickrichtung der Wanne ist ein Schalter.** Der Propeller sitzt am Fußende, nicht am
  Hahn — wenn das falsch herum ist, ist es ein Klick auf Flip und bleibt gemerkt.

# 2026-09-19 · Weiche Schicht · segmentierte Cartoon-Verformung (v4, additiv)

**Rückweg ist eine Zahl, kein Ausbau:** `softMix(0)` ist exakt das Verhalten von vorher.
Kein Modul aus `lab-v7/` geändert.

Neu: `lab-v8/cartoon-deform-segmented.v1.js`. Verformt segmentweise entlang der gemessenen
Längsachse im Vertex-Shader, Mathematik aus dem Spender `KFB-Travel-Globe travel/kfb-cartoon-deform.js`
(Bogen-Basis, Volumenerhalt über 1/sqrt, numerische Normalen). Damit sind 15 % möglich, wo die
Gruppenfassung bei 3 % aufhört.

Gemessen vor dem Bauen — die Frage, an der die Architektur hing:

| Fixture | Länge | Netze | Dreiecke | Ringe z | biegbar |
|---|---|---|---|---|---|
| car_hatchback | 0,806 | 1 | 618 | 44 | ja |
| driver-car | 4,870 | 9 | 3393 | 52 | ja |
| tractor-poly | 14,519 | 19 | 2446 | 31 | ja |
| kfb-tourbus | 13,550 | 107 | 15518 | 19 | ja |
| airplane-a | 2,427 | 28 | 1410 | 34 | ja |
| airplane-b | 190,659 | 33 | 4572 | 17 | ja |
| paper-plane | 0,116 | 1 | 16 | 9 | ja |
| fighter-lowpoly | 2,190 | 2 | 124 | 16 | ja |

Alle acht über der Schwelle des Spenders (≥ 4 Ringe). **Keine Tessellierung nötig** — das war
das größte Risiko und es ist keins.

Was die Schicht kann:
- **Bogen** in der Kurve über die mittelwertfreie Basis (s² − 1/3) — krümmt, ohne zu versetzen.
- **Twist** Bug gegen Heck, linear in s.
- **Nachlauf** über acht Bänder mit eigener Verzögerungsleitung, ebenfalls mittelwertfrei.
- **Squash/Stretch** volumenerhaltend, am Aufstandspunkt verankert, Obergrenze 15 %.
- **Hitstop** 70 ms bei vollem Einschlag (Skill §11.4).
- **Anticipation** als eigener Aufruf mit Vorlauf — geplante Ereignisse ja, reaktive nein.
- **Anbauteile gehen gedämpft mit** (`attachmentMix` 0,35), nicht planiert wie in v2.
- **Masse gemessen** aus Länge, Höhe/Länge und Radradius/Höhe; im Profil überschreibbar.

Drei Zusätze über den Spender hinaus:
1. **Schattenwurf verformt mit.** Der Spender hängt nur am Sichtmaterial; der Schatten kommt aus
   einem eigenen Tiefenmaterial. Jedes Netz bekommt jetzt ein `customDepthMaterial` mit
   demselben Vertex-Code — sonst steht unter einem krummen Auto ein gerader Schatten.
2. **Nachlauf je Segment** statt einer globalen Verzögerung.
3. **Netzgüte wird gemeldet**: Ringzahl UND größte Dreiecksspanne. Ein Dreieck über die halbe
   Länge schert mit, egal wie viele Ringe daneben liegen.

Zwei gemessene Fehler auf dem Weg:
- Der Nachlauf verschob im eingeschwungenen Zustand das ganze Fahrzeug seitlich (alle acht
  Bänder auf −2,29 %, Bug wie Heck). Acht gleiche Querversätze sind keine Verformung, sondern
  eine Translation — und Bewegung gehört Race und Travel. Jetzt mittelwertfrei.
- Die feste Kamera zielte nach einem Fixture-Wechsel auf die Hüllenmitte des VORIGEN Modells
  (`this.state.frame` eine Runde zu spät). Jetzt `this._frame`.

Belegt an `car_hatchback` bei lateral 1,0 / drift 0,8: Bogen −3,20 % der Länge, Twist 7,2°,
Squash 4,9 %; nach »Ruhezustand« alle Werte exakt 0,00. Bilder: `screenshots/v5-*.png`.

# 2026-09-19 · KFB Vehicle Lab v4 · Flight Deformer v1 (Travel Consumer Proof)

**Additiv.** Kein Modul aus `lab-v7/` wurde geändert; die Liste der absichtlich geänderten
v2/v3-Dateien ist LEER. `KFB Cartoon Vehicle Deformer Lab v3.dc.html` bleibt unverändert liegen.

Neu:
- `lab-v8/vendor-travel/` — 7 Travel-Dateien byteweise unverändert (carpet, flight-controls,
  spherical-math, terrain-surface, globe-field, globe-biome, simplex-noise). Nie bearbeiten.
- `lab-v8/travel-flight-seam.v1.js` — EINE Naht, `SEAM_FIELDS` mit TRAVEL/DERIVED/UNAVAILABLE je
  Feld, laufender Travel-Flug, Tastenspur (dispatcht echte KeyboardEvents an Travels Leser).
- `lab-v8/flight-frame.v1.js` — Spannweite, Rumpflänge, Flügelebene (64 y-Schichten),
  Hüllenmitte (Volumenmittel der Teilnetze), Schubachse (Schalter), Flügelteil-Erkennung.
- `lab-v8/flight-deformer.v1.js` — Lage um Hüllenmitte (Nicken/Gieren) und Flügelebene (Rollen);
  Böe, Einschlag, Abfangen, Aufsetzen, Schub und Steigflanke als Impulse, nicht als Posen.
- `lab-v8/spring.v1.js`, `lab-v8/flight-profiles.json`, `lab-v8/FLIGHT_SEQUENCES.json`.
- `KFB Vehicle Lab v4.dc.html` — Motion-Strip als scrollbare Bodenleiste, Messwerte und
  Metadaten einklappbar (Vorgabe: zu), feste Kamera für Beweisbilder.

Messungen, Befunde und die drei behobenen Fehler: `RETURN_flight_deformer_v1.md`.

# CHANGELOG · KFB Animation Lab

**Additiv.** Neue Einträge kommen oben dazu. Nichts wird überschrieben, nichts gelöscht.
Ein überholter Eintrag bekommt `NACHTRAG` und bleibt stehen — wer nur den aktuellen Stand
sieht, kann nicht erkennen, welche Wege schon verworfen wurden, und geht sie wieder.

Stand-Dokumente: `LIVING_RIGGING.md` (Carl/Gesicht), `LIVING_VEHICLES.md` (Fahrzeuge).
Dieser Changelog ist die Zeitachse, die Stand-Dokumente sind die Begründung.

---

## 19.09.2026 · Runde 7 · carrig v3, Gier-Schalter, Bewegungsleiste

**Rad-Paar-Regel zog in sich zurück (S3).** v2 wich bei jedem Prüfschritt auf die ungeprüfte Menge
aus (`pool = paired.length >= 2 ? paired : candidates`, `kept = sized.length >= 2 ? sized : grounded`).
`lab-v7/carrig.v3.js` bildet erst Achsen (Cluster nach z), verlangt je Achse ein Paar links/rechts
mit Radien ±25 %, behält von mehreren Paaren derselben Achse das äußere und prüft die Größe
INNERHALB der Achse statt gegen einen Gesamtmedian. Was bleibt, ist immer gerade.
Gemessen nach dem Umbau: `rover-round` 1 → **0** (ein Kandidat ohne Gegenstück, verworfen statt
gemeldet), `car_hatchback` 4 (2 Achsen), `raceCarRed` 4 (2 Achsen) — beide unverändert.
`tractor-poly` und `truck-armored` bleiben bei **2 auf einer Achse** (Radstand 0,000): die zweite
Achse fällt nicht am Median, sondern schon an der Formprüfung. Der Bericht sagt das jetzt mit
`axles: 1` statt es zu verstecken.

**Flugzeuge standen quer.** Kein Fehler der Längsachsenregel — die Poly-Flugzeuge haben die Nase
NATIV auf +x. Eine Hüllbox kann das nicht entscheiden, also ist es ein Schalter mit Gedächtnis:
`lab-v7/pose-store.v1.js` (Gier in 90°-Schritten, je Fixture gemerkt), Knopf »Gier« in der
Werkbank, `yawDefault` in der Fixturezeile. Am Bild abgelesen (Blick +x+z, Blickrichtung +z):
`airplane-a`, `airplane-b`, `fighter-lowpoly` → 270°; `paper-plane` steht nativ richtig.
Die sechs Raumschiffe sind nicht beurteilt und stehen auf 0.
Zusätzlich nimmt `analyse` `yawFix: 'off'` entgegen: die Regel »x größer als z → einmal 90°« gilt
nur am Boden, ein Flügel ist legitim breiter als der Rumpf lang.

**Oberfläche: Bewegungsleiste statt Messleiste.** Die 23 Sequenzen liegen nicht mehr in einem
Auswahlfeld, sondern als Knöpfe in einer scrollbaren Leiste unten, geclustert nach Familie —
Tempo & Last, Kurve, Drift, Einschlag, Aufsetzen, Schlingern, Zwei Räder, Manöver, Fassrolle,
davor Profil, Fahrweise und Akzente. Die Cluster werden AUS DEN SCHRITTEN abgeleitet (Ereignis,
sonst benutzte Signale), nicht getippt — ein neuer Eintrag in `TEST_SEQUENCES.json` landet von
allein richtig. Transport (Pause, Spulen, erwarteter Read) sitzt in derselben Leiste.
Messwerte, Herkunft und Live-Zahlen sind aus Vorgabe ZU und liegen hinter einem Knopf: zum Testen
zählt das Bild.

Dateien: `KFB Cartoon Vehicle Deformer Lab v3.dc.html`, `lab-v7/carrig.v3.js`,
`lab-v7/pose-store.v1.js`, `lab-v7/fixture-adapters.v3.js` (yawDefault).
Beweisbilder: `screenshots/v3-airplane-a.png` (vorher), `screenshots/v3-airplane-a-yaw270.png`.

## 2026-09-18 · Fehlende Fahrzeuge aufgenommen, Oberflaeche auf Atlas-Schnitt · `fixture-adapters.v3.js`, `KFB Cartoon Vehicle Deformer Lab v2.dc.html`

**Gemessen zuerst:** Georgs neuer Asset-Handoff (`kfb.asset-handoff.v1`, consumer `animation-lab`,
sourceCommit `29aac1061bdd`, 141 Assets) gegen `fixture-adapters.v2.js` gerechnet — **112 Assets
waren nicht referenziert.** Davon sind rund zwanzig Fahrzeuge; der Rest sind Figuren, Planeten,
Zahlen, Zaeune, Pickups und einzelne RAEDER (`wheel-*.glb`) — Bauteile, keine Fahrzeuge.

**Fuenfzehn Bodenfixtures dazu, 46 → 61.** Driver Car (Georgs Beispiel), Tractor by Poly, KFB
Tourbus/WaterBowser, Truck Armored, Rover 1/2/Round, vier Rollstuehle plus Kenney-Rollstuhl, drei
Schubkarren. `v3` importiert `v2` und haengt an — die alte Liste bleibt unberuehrt, jede neue
Zeile ist AUS dem Handoff generiert, nicht getippt.

**Alle vierzehn neu im Browser geladen und vermessen** (nicht nur deklariert):

| Fixture | Raeder | Radradius | Spur | Radstand |
|---|---|---|---|---|
| driver-car | 4 (node) | 0,395 | 2,088 | 3,094 |
| kfb-tourbus | 4 (island) | 0,375 | 4,190 | 6,984 |
| rover-1 | 4 (node) | 0,683 | 3,592 | 3,793 |
| tractor-poly | **2 (island)** | 1,936 | 5,241 | 0,000 |
| truck-armored | **2 (node)** | 0,439 | 1,879 | 0,000 |
| rover-round | **1 (island)** | 1,071 | 3,169 | 0,000 |
| wheelchair | 2 (island) | 0,145 | 0,450 | 0,000 |
| wheelchair-kenney · Schubkarren ×3 | **0 (none)** | — | — | — |

Die Nullen und Zweien sind **Befunde, keine Fehler**: die Rad-Paar-Regel (V9) verlangt ein
Gegenstueck auf derselben Hoehe mit gleichem Radius (±25 %) und gleicher Groesse (±35 % um den
Median). Ein Traktor hat vorn kleine und hinten grosse Raeder, eine Schubkarre hat genau eins,
ein Rollstuhl hat zwei grosse und zwei kleine. Erfunden wird nichts.
**NEU OFFEN:** `rover-round` meldet **1** Rad. Eine Eins verletzt die Paar-Regel und ist damit
ein Verdacht auf eine Luecke im Insel-Weg, nicht ein Messwert. Braucht eine Sichtpruefung.

**Zehn Flug-Fixtures deklariert, kein Deformer.** `FLIGHT_GROUPS` in v3: Airplane A/B, Low poly
Fighter, Paper Plane, Spaceship A/B, die vier Charakter-Schiffe. Alle geladen, alle **0 Raeder** —
genau darum haengt der Flug-Tab beim Laden keine Bodenfamilie an. Plan: `PLAN_flight_deformer.md`.
Der Papierflieger steht nicht im Handoff; sein Pfad wurde byteweise geprueft (3216 B @ 29aac106).

**Oberflaeche v2 im Schnitt des Resident Atlas S6** (`tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`
gelesen, Palette und Raster uebernommen): warm-dunkle Buehne statt weisser DocCheck-Rahmen, ein
Auswahlfeld fuer die Fixture und eines fuer die Bewegung im Kopf statt vierzig Knoepfen unter der
Buehne, Zeitleiste im Dock, 380-px-Leiste rechts, QA-Marke oben links, Live-Telemetrie oben rechts.
Georgs Grund dafuer: **cleanere Views mit Fokus auf die Modelle.** v1 bleibt unveraendert liegen.

**Das Spulen rechnet neu, statt rueckwaerts zu laufen.** Springs haben ein Gedaechtnis; eine
Sequenz laeuft beim Scrubben von null in 1/60-Schritten bis zur Zielzeit. Dieselbe Zeit liefert
damit dasselbe Bild (V8) — und der Regler haelt die Fixture an, statt sie weiterlaufen zu lassen.

---

## 2026-09-18 · Motion-Familie »Fassrolle« · `lab-v7/vehicle-tumble.v1.js`

Der Read: **das Fahrzeug überschlägt sich seitlich und fängt sich auf den Rädern wieder.** Der
ganze Witz liegt im letzten Teil. Eine Fassrolle, die auf dem Dach endet, ist ein Unfall und ein
anderer Read.

**Darum wird die Umdrehungszahl gerundet und die Drehrate danach nachgerechnet, nicht umgekehrt.**
Flugzeit aus Stärke und Profil, gewollte Rate aus dem Tempo, dann `turns = round(Flugzeit × Rate)`
und `rate = turns / Flugzeit`. Damit landet das Fahrzeug bei jedem Tempo exakt auf 360° × n.
Gemessen an car_hatchback:

| Stärke | Tempo | Flugzeit | Rate gewollt | Rate gerundet | Umdrehungen | Gipfel |
|---|---|---|---|---|---|---|
| 0,2 | 0,2 | 490 ms | 0,84 Hz | 2,04 Hz | 1 | 0,132 u |
| 0,55 | 0,6 | 735 ms | 1,42 Hz | 1,36 Hz | 1 | 0,194 u |
| 1,0 | 1,0 | 1050 ms | 2,00 Hz | 1,91 Hz | **2** | 0,274 u |
| 1,0 | 0,2 | 1050 ms | 0,84 Hz | 0,95 Hz | 1 | 0,274 u |
| 0,2 | 1,0 | 490 ms | 2,00 Hz | 2,04 Hz | 1 | 0,132 u |

Die Zahl springt stufig, nicht stetig — richtig so: eine halbe Umdrehung mehr ist sichtbar, eine
Zehntel nicht. Endwinkel gemessen 719,8° gegen Soll 720° (Restbetrag aus dem Abtastpunkt 2 ms vor
Schluss), Gipfel gemessen 0,2741 u gegen geplant 0,2741 u.

**Die Drehachse wandert, und das ist der Unterschied zum Späß.** Absprung auf der Aufstandslinie
(am Boden kippt ein Fahrzeug über seine Kante), Flug um den gemessenen Schwerpunkt (ein freier
Körper dreht um seinen Schwerpunkt — alles andere sieht nach Puppenspiel aus), Landung zurück auf
die Kante, damit die Räder zuerst kommen. Anteile 0,16 der Flugzeit hinein, 0,14 heraus.

**Drei Beats, nacheinander:** Überschlag (Hauptread) → Aufsetzen mit einem Lautwort und EINEM
Nachfedern (Akzent) → Schlingern (Erholung). Die Fassrolle LÖST das Schlingern aus und besitzt es
nicht: sie meldet `event: 'recover'`, der Aufrufer gibt es weiter. Ebenso `event: 'touchdown'` mit
der Stärke aus der Fallgeschwindigkeit — die Vertikalstauchung gehört dem Deformer, eine Feder,
nicht zwei.

**Lautwort und Ton**, erstmals über null im Ereignisbudget: EIN Lautwort (»WUMM«, unter Stärke 0,5
»WUPP«) und es sitzt auf dem Aufsetzen, nicht auf dem Absprung — der Einschlag ist der laute
Moment. Zwei Töne, beide synthetisiert statt geladen: aufsteigender Whoosh beim Absprung,
Rauschstoß plus tiefer Puls beim Aufsetzen. **Aus Vorgabe stumm**, Schalter in der Kopfzeile —
Ton, der ungefragt losgeht, ist ein Fehler. VFX bleibt bei null, bis der Rauch-Pack angebunden ist.

**Derselbe Vorzeichenfehler, zweimal in einer Stunde.** Der Gegenroll der Anticipation drehte um
die Radkante der falschen Seite und zog deren Räder 0,0432 u unter den Boden — exakt die
Vorhersage 2 × contactX × sin 6°. Erst beim Übernehmen des Musters aus `vehicle-twowheel.v1.js`
mitgekommen, dann beim Beheben nur für EINE Drehrichtung behoben, weil der Fix die Seite statt den
WINKEL befragte (in dieser Datei steckt `side` schon im Winkel). Jetzt entscheidet allein das
Vorzeichen des Winkels. Nachgemessen im 10-ms-Raster über den ganzen Verlauf, fünf Kombinationen
aus Stärke, Tempo und Drehrichtung: **tiefste Radunterkante exakt 0,0000**, Endwinkel exakt
±n × 360°. Lehre: ein Vorzeichen, das an zwei Stellen gebraucht wird, wird EINMAL abgeleitet.

Belege: `screenshots/0*-tumble.png` (Absprung, Vierteldrehung in der Luft, Gipfel — dort steht der
Wagen bei zwei Umdrehungen genau wieder aufrecht — und Landung).

**NACHTRAG (18.09., aus der Abnahme).** Die Fassrolle war nur an car_hatchback gemessen, das
Modul ist aber für alle 46 Fixtures verdrahtet. An anderen Fahrzeugen zog sie die Räder unter den
Boden: `race` (Spur 1,0 u) −0,0422 u mitten im Flug, `vehicle-monster-truck` −0,0284 u im Frame
VOR dem Aufsetzen. Ursache war kein Vorzeichen, sondern ein Verhältnis: der Hub war eine reine
Wurfparabel, während die Drehachse beim Abheben und Aufsetzen wandert — der Hub ist dort noch
klein, der Drehradius aber schon voll wirksam. Bei breiter Spur reicht die Parabel dann nicht, um
den eigenen Drehradius freizuräumen.

Behoben in zwei Schritten, und beide machen nebenbei den richtigen Read:
- **Der Boden ist eine Untergrenze unter der Parabel.** Je Frame wird der tiefste Punkt der
  gedrehten Hülle um die aktuelle Achse analytisch bestimmt und `h = max(Parabel, nötiger Hub)`
  gesetzt. Die Hülle ist Karosserie VEREINT mit Radspur — die Karosserie kann schmaler sein als
  die Räder (Monster-Truck) und umgekehrt.
- **Die Gipfelhöhe hat eine gemessene Untergrenze:** der weiteste Punkt der Hülle vom Schwerpunkt
  minus die Schwerpunkthöhe. Darunter kann sich ein Fahrzeug überhaupt nicht frei überschlagen.
  Ein breiter Wagen MUSS höher springen. Gemessen: `race` 0,356 u Untergrenze, `truck` 0,318 u,
  car_hatchback nur 0,090 u.

Dazu ein dritter Befund aus derselben Messreihe: **`vehicle-drag-racer` hat vorn schmale und
hinten breite Räder**, und `contactX` rechnete mit Spurweite plus der Breite des ERSTEN Rades —
der Drehpunkt fiel 1,6 mm zu weit innen aus. Jetzt wird die äußerste Laufflaechenkante über ALLE
Räder gemessen (`max(|x| + Breite/2)`). Derselbe Denkfehler stand in `vehicle-twowheel.v1.js` und
ist dort mitkorrigiert; contactX des Drag-Racers 0,2781 → 0,2938 u.

Außerdem: der Absprungton wurde in `trigger()` in den Readout geschrieben, und `update()` löschte
ihn in seiner ersten Zeile — von zwei deklarierten Audio-Cues kam nur einer heraus. In der
Werkbank war das unsichtbar, weil die Ereignisverteilung den Ton direkt anstößt; eine Laufzeit,
die das Modul allein über seinen Readout fährt, hätte ihn verloren. Jetzt gepuffert.

Nachgemessen im 5-ms-Raster über den ganzen Verlauf, **sechs Fahrzeuge** (car-hatchback,
monster-truck, race, drag-racer, truck, kart-oobi) × vier Kombinationen aus Stärke, Tempo und
Drehrichtung, Fassrolle UND Zwei-Rad: tiefste Radunterkante **exakt 0,0000**, Endwinkel exakt
±n × 360°. Lehre, die über diese Familie hinausgeht: **eine Abnahme an einem Fahrzeug ist keine
Abnahme.** Die Ableitung ist fahrzeugunabhängig, die Zahlen sind es nicht — und genau an den
Verhältnissen (breite Spur gegen kleinen Hub) bricht sie.

**ZWEITER NACHTRAG (18.09., aus der Abnahme).** Die Landestärke war ein FESTWERT, obwohl der
Kommentar im Modul das Gegenteil behauptete. Gemessen lag `strength` in 16 von 16 Fällen auf
exakt 0,35 — also auf ihrer eigenen Untergrenze, über alle Stärken und alle Fahrzeuge. Ein
flacher und ein dreifacher Überschlag setzten sichtbar gleich auf; der Akzent-Beat war tot.

Zwei Ursachen, und die zweite ist die interessante:
- *Der Nenner war etwa dreimal zu groß*, das rohe Verhältnis lag durchweg unter der Untergrenze.
- *Die Größe selbst war degeneriert.* Gipfel UND Flugzeit standen unabhängig an der Stärke, und
  beide wuchsen fast gleich schnell (×2,08 gegen ×2,14). In der Aufsetzgeschwindigkeit
  4·Gipfel/Flugzeit kürzte sich das weg — gemessen 1,074 → 1,044, also FALLEND bei steigender
  Stärke. Die Bahn war auch keine Wurfparabel: dort gilt Gipfel = g·t²/8 und damit t ∝ √Gipfel;
  hier war t ∝ Gipfel, die wirksame Schwerkraft sank mit der Stärke.

Behoben: **eine Schwerkraftkonstante je Fahrzeug**, verankert am Bezugspunkt Stärke 1 (dort bleibt
die Flugzeit, wie sie war). Daraus folgt alles andere ballistisch — Flugzeit 2·√(2·Gipfel/g),
Aufsetzgeschwindigkeit √(2·g·Gipfel) — und die Stärke wird zwischen Stärke 0 und Stärke 1
DESSELBEN Fahrzeugs gespannt, damit der Bereich 0–1 wirklich ausfährt.

Gemessen, vier Stärken × sechs Fahrzeuge, Plan und echter Lauf identisch:

| Fahrzeug | g | Flugzeit 0,2 → 1,0 | Stärke 0,2 / 0,5 / 0,8 / 1,0 |
|---|---|---|---|
| car-hatchback | 1,99 | 727 → 1050 ms | 0,248 / 0,563 / 0,835 / 1,000 |
| kart-oobi | 3,52 | 727 → 1050 ms | 0,248 / 0,563 / 0,835 / 1,000 |
| firetruck | 3,36 | 1149 → 1658 ms | 0,248 / 0,563 / 0,835 / 1,000 |
| monster-truck | 0,87 | 1149 → 1658 ms | 0,248 / 0,563 / 0,835 / 1,000 |
| race | 6,32 | 727 → 1050 ms | 0,150 / 0,488 / 0,807 / 1,000 |
| raceCarRed | 3,32 | 727 → 1050 ms | 0,150 / 0,455 / 0,795 / 1,000 |

Bei `race` und `raceCarRed` bindet die Gipfel-Untergrenze schon bei Stärke 0,2 — dort fängt die
Stärke auf 0,15 an, statt weiter zu fallen. Das ist richtig: ein Fahrzeug, das seinen Drehradius
freiräumen muss, kann nicht flacher springen. Bodenkontakt in allen Läufen weiter exakt 0,0000.

Dass `g` je Fahrzeug verschieden ist (0,87 bis 6,32), ist Absicht und keine Physik: der
Bezugspunkt ist die gewollte Flugzeit bei Stärke 1, und die hängt am Profil, nicht am Gramm.
Innerhalb eines Fahrzeugs ist die Bahn dann durchgängig ballistisch — das ist, was man sieht.

## 2026-09-18 · Zwei Motion-Familien · »Manöver« und »Zwei-Rad-Schräglage«

Georgs Nachtrag: Rückwärtsfahren, Wenden und Einparken für die drei Ride-Modes, dazu die
seitlich gekippte Stunt-Fahrt an einer Bande. Zwei neue Dateien, `lab-v7/vehicle-manoeuvre.v1.js`
und `lab-v7/vehicle-twowheel.v1.js`. Die Fassrolle bleibt der nächste Schnitt.

**Schichtung.** Von innen nach außen: Deformer (Pose) → Schlingern (Gier um die Vorderachse) →
Zwei-Rad (Kippen um die Aufstandslinie) → Manöver (Weg über den Boden). Jede Schicht besitzt
genau eine Gruppe. Deshalb kann das Fahrzeug an der Bande entlangFAHREN und dabei gekippt stehen,
ohne dass eine der beiden Bewegungen von der anderen weiß.

**Das Manöver erfindet keine Deformation.** Es erzeugt die Signale, die der Deformer schon frisst
(`speed`, `longAccel`, `lateral`) — aus einem kinematischen Einspurmodell auf dem GEMESSENEN
Radstand, Drehpunkt gemessene Hinterachse. `longAccel` wird DIFFERENZIERT statt geschrieben, und
darum taucht die Nase beim Anfahren im Rückwärtsgang nach vorn: die Trägheit weiß nichts vom Gang.
Beide Signale werden auf ihr Maximum im Plan normiert; kein gesetzter Faktor.

**Wie viele Züge eine Wende braucht, wird ausgerechnet.** Der Löser fährt bei Vollausschlag, bis
eine gemessene Fahrzeugecke aus der Gasse läuft, wechselt Gang UND Einschlag und zählt weiter.
Gemessen an car_hatchback (Radstand 0,502 u, R 0,744 u, Länge 0,806 u):

| Gasse × Länge | Züge |
|---|---|
| ≤ 1,25 | erreicht 180° gar nicht (77–117° bei sieben Zügen) |
| 1,30–1,35 | 7 |
| 1,40–1,50 | 5 |
| 1,55 | 4 |
| **1,60–2,00** | **3** |
| ≥ 2,05 | 2 — dann ist es keine Wende, sondern eine Kehre |

Vorgabe jetzt 1,60, der schmalste Wert mit Drei-Punkt-Read. Eine reale Wohnstraße liegt bei 1,33;
dort braucht ein echtes Auto tatsächlich fünf bis sieben Züge, und genau das gibt der Löser aus.

**Einparken ist exakt gelöst, nicht geraten.** Zwei gleich große Bögen versetzen das Fahrzeug um
2R(1 − cos θ) und geben ihm den Kurs zurück, also θ = arccos(1 − d/2R) = **51,71°** für 0,5656 u
Seitenversatz. Nachgefahren kamen **0,5752 u** heraus (1,7 % über Soll, aus dem
Integrationsschritt), Endgierwinkel exakt 0,00°, benötigte Lücke 1,981 u.

**Vier Fehler auf dem Weg, alle gemessen gefunden:**
- *Die Wende fing in der Gassenmitte an.* Sieben Züge, und nach 74,7° war Schluss. Ein Fahrer
  fährt vor dem Wenden an den Rand — damit verdoppelt sich der Weg quer. Die Gasse liegt jetzt
  asymmetrisch an der Flanke, kein Sprung im Bild, drei Züge.
- *Das Manövertempo war zu träge.* 0,55 Fahrzeuglängen je Sekunde ergaben 6,4 s für ein
  Rückwärtsstück von 1,8 u. Jetzt 0,95 — Rückwärts 3,05 s, Wenden 5,10 s, Einparken 5,46 s.
- *Die Lenkung sprang beim Einparken in einem Frame von −34° auf +34°.* 68° auf einen Schlag, und
  das sieht man. Jetzt liegt eine kurze Standzeit zwischen den Bögen, in der der Fahrer im Stand
  umdreht — die einzige Art, wie das überhaupt geht.
- *Das Bild schnitt die Wende ab.* Der Kameraabstand kam aus Radius × 2,3. Das Blickfeld ist
  VERTIKAL 30°, und die 2,05 u Weglaenge fallen genau auf diese Achse (sichtbare Höhe bei 3,46 u
  Abstand: 1,85 u). Jetzt r / sin(fov/2) aus der Umkugel der überstrichenen Fläche.

**Zwei-Rad: der Kippwinkel ist gerechnet, nicht gesetzt.** φ_tip = atan(Hebel / Schwerpunkthöhe),
Schwerpunkt als gemessener Mittelpunkt der Karosseriehülle (0,1999 u — geometrisch, nicht
Massenschwerpunkt, und so steht es im Bericht). Daraus **45,94°**. Frei gehalten wird bei 0,92
davon (**42,27°**), an der Bande darüber (**65,77°**), weil die Wand trägt; die nötige
Wandentfernung wird an der gedrehten Karosseriehülle gemessen (**0,3375 u**) und die Bande genau
dort gezeichnet. Die Haltephase ist der Kern der Bewegung: zwei nicht ganzzahlig verwandte
Balanceraten, damit es nicht als Schleife liest.

**Der Fehler, der zweimal in denselben Irrtum lief — `frame.contactY`.**
`carrig` MISST `contactY` VOR dem Einbacken und verschiebt danach die ganze Geometrie um
−contactY. Im Rig-Raum liegt der Boden also auf genau 0, und `frame.contactY` ist der alte
Modellwert (bei car_hatchback −0,15 u) — während `frame.height` im SELBEN Objekt nach dem Backen
steht. Beide Kipp-Familien nahmen `contactY` als Höhe der Drehachse:
- Zwei-Rad kippte um eine Achse unter dem Asphalt; gemessen sanken die unteren Räder 0,031 u
  (frei) und 0,059 u (Bande) in den Boden.
- Schlingern hatte denselben Fehler, nur unsichtbar: der Gegenroll geht bis 1,3°, und
  0,15 × (1 − cos 1,3°) sind 4 × 10⁻⁵ u. Nach der Korrektur wurde die Messreihe gegengeprüft und
  ist zeichengleich (−4,73 / +2,28 / −1,10 / +0,53) — der Gierwinkel hängt nicht an der Höhe des
  Drehpunkts.

**Und der Rest der Senkung war eine Rechnung, keine Toleranz.** Nach der Korrektur auf y = 0 blieb
−0,0186 u bei 37,3° und −0,027 u bei 62,1°. Beide ergeben −sinφ × (Radbreite/2) und damit zweimal
unabhängig **0,061 u Radbreite** — nachgemessen am Rig: **0,0612 u**. Ein gerolltes Rad steht auf
seiner KANTE, nicht auf seiner Mittelebene. Kippachse jetzt (Spurweite + Radbreite)/2, und damit
ist auch der Hebel gegen das Umfallen größer als die halbe Spurweite. **Bodenkontakt seitdem
exakt 0,0000 in allen vier Phasen** (peak, settled, holdMid, touchdown), beide Varianten.

**Drei Fahrweisen**, ausdrücklich Gestaltung und keine Messung: chill / city / freeroam mit
Tempo ×0,62 / ×1,00 / ×1,38 und Standzeit beim Gangwechsel 430 / 260 / 145 ms. Die Standzeit
unterscheidet sie deutlicher als das Tempo. Ein Wechsel mitten im Manöver lässt die Geometrie
stehen und skaliert nur die restliche Zeit.

**Zwei Werkzeugbefunde, die Zeit gekostet haben und bleiben:**
- *Der Zwischenspeicher.* Nach einem Reload meldete der Plan weiter die alte Gassenkonstante 1,45
  statt 1,60 — genau die Falle aus `CLAUDE.md`. Die beiden neuen Module werden jetzt mit
  Abrufstempel importiert (`?r=N`), der bei jeder inhaltlichen Änderung hochgezählt wird.
- *`requestAnimationFrame` steht in einem unsichtbaren Rahmen.* Drei Runden gingen auf die Suche
  nach einem Fehler, den es nicht gab: `ticks()` blieb bei 8, die Sequenz war gesetzt, aber kein
  Frame verarbeitete sie — `document.visibilityState` war `hidden`. Neu in `window.__cvd`:
  `paint()` zeichnet einen Frame unabhängig von der Schleife, `stepMs(ms)` treibt die Uhr um einen
  genauen Betrag weiter, `ticks()` / `seqState()` / `camState()` machen den Zustand abfragbar.
  Damit ist ein Beweisbild auch dann reproduzierbar, wenn die Seite nicht im Vordergrund liegt.
  Nachtrag: ein leeres Bild direkt nach dem Ein- oder Ausblenden der Seitenleiste ist KEIN Fehler —
  die Größenänderung leert die Leinwand, und bei angehaltener Schleife malt niemand nach.

**NACHTRAG Oberfläche (18.09. spät).** Lautwort und Ton saßen zuerst als zwei weitere Knöpfe in
der Kopfzeile. Gemessen bei 924 px Fensterbreite brach die Reihe damit um: fünf von sechs
Knöpfen zweizeilig in einem Kasten mit festen 28 px Höhe, je 4 px Text unter der Unterkante, und
der Untertitel auf zwei Zeilen in einer 52-px-Kopfzeile. Ursache war nicht der neue Knopf allein,
sondern dass ALLE Kopfzeilen-Kinder `flex-shrink: 1` und `white-space: normal` hatten — bei
Überbreite stauchen sie unter ihre Inhaltsbreite, und weil die Knöpfe eine feste Höhe haben,
spillt die zweite Zeile heraus statt den Knopf zu vergrößern.

Behoben nicht durch Zurechtbiegen, sondern durch Umziehen: **die beiden Schalter wohnen jetzt in
der Seitenleiste unter »Optionale Schicht«**, wo Profil und Fahrweise ohnehin stehen. Die
Kopfzeile behält vier Knöpfe mit `white-space: nowrap` und `flex: 0 0 auto`; das nachgebende
Element ist der Untertitel (Auslassungspunkte). Nachgemessen: Kopfreihe 283 px in 884 px, kein
`scrollWidth`- oder `scrollHeight`-Überhang an irgendeinem Knopf, Untertitel eine Zeile.

**Sechs neue Knöpfe:** RÜCKWÄRTS, RÜCKWÄRTS ECKE, WENDEN, EINPARKEN, 2 RÄDER FREI, BANDE. Dergefahrene Weg, die Gasse und die benötigte Lücke werden gezeichnet; die Seitenleiste zeigt alle
vorausgerechneten Zahlen. Bei einem Wallride setzt sich die Kamera auf die OFFENE Seite — sonst
steht die Bande im Bild und verdeckt alles.

Belege: `screenshots/0*-manoeuvre.png` (Wenden Zug 1 und 2, Rückwärts um die Ecke) und
`screenshots/0*-stunt.png` (Rückwärts Ecke, Einparken zweiter Bogen, zwei Räder frei, Bande).

**Offen:** Fassrolle (Drehachse, Umdrehungen bis zum Ausrollen, Tempoabhängigkeit, Landung mit
einmaligem Hochfedern, Lautwort und Ton) und die unsichtbare Kupplung als Kette beliebiger Länge.

**NACHTRAG (18.09., aus der Abnahme).** Der Drehpunkt des Zwei-Rad-Stunts stand fest auf
`side × contactX`. In den beiden Phasen mit NEGATIVEM Rollwinkel — dem Gegenroll der Anticipation
und dem einmaligen Rückfedern nach dem Aufsetzen — drehte die Karosserie damit über die
Laufflaechenkante der anderen Seite hinweg und zog deren Räder unter die Ebene. Gemessen
2 × contactX × sin|φ|: an der Bande **−0,0483 u** im Landeframe, also zwei Drittel des Radradius
im Asphalt — im meistbeachteten Bild des ganzen Stunts, und spiegelbildlich gleich für `side −1`.

Die Abnahme oben hat das übersehen, weil sie an den Marken `peak / settled / holdMid / touchdown`
abgetastet hat — genau die Stellen mit nicht-negativem Winkel. **Regel daraus: einen Verlauf
abtastet man über seine ganze Länge, nicht an seinen Marken.** Die Marken sind dafür da, ein
Beweisbild zu setzen, nicht dafür, einen Verlauf zu prüfen.

Behoben: der Drehpunkt folgt dem Vorzeichen des Winkels. Das ist auch der richtige Read — wer
sich zum Aufschwingen belädt, kippt kurz auf die Räder der Gegenseite. Nachgemessen im 10-ms-Raster
über den ganzen Verlauf (0–2530 ms), beide Varianten, beide Seiten: tiefste Radunterkante **exakt
0,0000**. Gegenroll bei −6,58° hebt die Gegenseite 0,0403 u, Rückfedern bei −6,73° hebt sie
0,0413 u, am Ende stehen alle vier Räder auf 0. `wallGeometry` war nicht betroffen: sie rechnet
mit dem positiven Haltewinkel.

## 2026-09-18 · Motion-Familie »Schlingern« · `lab-v7/vehicle-fishtail.v1.js`

Georgs Reihenfolge: Schlingern zuerst als eigene Familie, danach als Erholungsphase in den
Überschlag. Also nur das Schlingern — kein Flug, kein Lautwort, kein Ton, keine Kamera.

**Der Read.** Das Heck pendelt aus, die Nase bleibt auf Kurs. Dafür dreht das Fahrzeug um die
**Vorderachse**, nicht um seine Mitte — sonst wandert die Nase mit und das Bild liest als Drift.
Der Drehpunkt ist gemessen: Mittelpunkt der Vorderräder aus dem Rig, Höhe auf `frame.contactY`,
damit der Gegenroll um die Bodenlinie kippt und die Räder aufstehen bleiben.

**Schichtung.** Primär die Gierauslenkung. Sekundär Gegenroll (nachlaufend) und Gegenlenkung der
Vorderräder (aus dem Gierwinkel abgeleitet). Tertiär nichts.

**Additiv.** Eigene Gruppe *über* `rig.group`. Der Deformer besitzt weiter `responseRoot` und
`shellRoot`; diese Datei fasst beide nicht an. Die Gegenlenkung wird zum Lenkwinkel addiert,
nicht gesetzt.

**Abgeleitet statt erfunden.** Genau ein freier Faktor (`HZ_OF_SPRING = 0,42`), alles andere aus
den schon deklarierten Profilwerten. Gemessen an CAR_CHILL_LIGHT: 1,26 Hz, 396,8 ms je Schwinger,
Verhältnis 0,483, vier Schwinger, 1587 ms.

**Gemessen im Browser** (Haltezustand, feste Kamera, car_hatchback):

| t | Schwinger | Gier | Roll |
|---|---|---|---|
| 198 ms | 1 | −4,73° | 1,20° |
| 230 ms | 1 | −4,32° | **1,28°** (Rollspitze, 32 ms nachlaufend) |
| 595 ms | 2 | +2,28° | −0,58° |
| 992 ms | 3 | −1,10° | 0,28° |
| 1389 ms | 4 | +0,53° | −0,14° |

Abklingen je Schwinger gemessen 0,474 / 0,483 / 0,495 gegen deklariert 0,483. Rückkehr auf
exakt 0 bestätigt.

Profilstreuung, abgeleitet: BOARD_RIDER_LIGHT 1,76 Hz und sechs Schwinger, HEAVY_FUTURE 0,80 Hz
und 2506 ms, TRAILER_TOWED nur 1,74° erste Spitze — ein Anhänger schlingert flach, das fällt
aus der Ableitung heraus und musste nicht gesetzt werden.

**Zwei Fehler auf dem Weg, beide gemessen gefunden:**
- Der Gegenroll lief eine Vierteldrehung nach. Das ergibt auf jeder Gierspitze genau 0,00° Roll
  und umgekehrt — Gegenphase, nicht Follow-through, beide Bewegungen nie zusammen sichtbar.
  Nachlauf jetzt 0,18 einer halben Schwingerzeit, bei CAR_CHILL_LIGHT 71 ms, im Bereich von
  Motion-Skill §2.5 (35–85 ms).
- Die Aufnahme rannte der Bewegung nach: Ziel 170 ms, Bild 418 ms, also eine Pose, die niemand
  gemeint hat. Neu: `poseAt(ms)` hält einen Frame fest, `peakMs(k)` gibt die Umkehrpunkte —
  sie liegen auf (k + 0,5) × halber Schwingerzeit, nicht auf ganzen Schwingern.

**Ehrlichkeitskorrektur.** `yawDeg` ist die Amplitude bei t = 0, wo der Sinus null ist. Der erste
*sichtbare* Ausschlag ist `yawDeg × √ratio` — 6,80° deklariert, 4,73° gesehen. Beide Zahlen
stehen jetzt im Readout.

**Offen:** Überschlag (Fassrolle um die Längsachse, tempoabhängig bis zum Ausrollen, Landung auf
den Rädern mit einem Nachfedern, Lautwort und ein Ton) und die unsichtbare Kupplung als Kette
beliebiger Länge. Beides von Georg entschieden, noch nicht gebaut.

## 2026-09-18 · Space Base Bits aufgenommen · drei Fahrzeuge, zwei Profile

- **Befund B2 erledigt.** Das Pack liegt jetzt in `kayfabizarro/media/3D_Assets` und im
  Registry-Pack `kaykit-space-base-bits-1-0-free`. Byteweise geprüft: drei glTF, drei `.bin`,
  eine Textur, alle im selben Ordner. Pin `eb48f50489b9`. Kein `.glb`-Umbau nötig.
- Neue Fixture-Gruppe `spacebits` in `lab-v7/fixture-adapters.v2.js`: **Spacetruck**,
  **Spacetruck Large**, **Spacetruck Trailer**. Damit 46 Fixtures statt 43.
- Geometrie aus den glTF gelesen, nicht geschätzt: vier benannte Radknoten je Fahrzeug,
  Radachse auf x, Y-up, achsenparallel (`orientDefault: 0`). Radradius 0,0877 / 0,1140 / 0,0877 u,
  Radstand ±0,2136 / ±0,2136 / ±0,2636, Aufstandsebene y −0,0779 / −0,1335 / −0,1431.
- **Blickrichtung erstmals nicht geraten.** Bei allen anderen Fixtures ist `facing` eine Annahme.
  Hier benennt das Asset selbst `wheel_front_*` bei z +0,2136 — `facing: 1` ist damit abgelesen.
- Zwei Profile in `deformer-profiles.json`: `SPACE_HAULER` (kurzer Radstand, hoher Aufbau) und
  `TRAILER_TOWED` (`stretchAmount: 0` — ein Anhänger zieht nicht). Beide **nicht abgestimmt**,
  Struktur wie HEAVY_FUTURE deklariert.
- Offen geblieben: der Nachlauf des Trailers braucht eine Kopplung an das Zugfahrzeug. Ein
  Anhängepunkt ist im Asset nicht autoriert; die vordere Kante liegt bei z +0,5000. Ob der
  Nachlauf zum Zugfahrzeug gehört oder ein eigener Actor ist, entscheidet Georg.
- **`lab-v7/carrig.v2.js`.** Spacetruck Large fiel mit **0 Rädern** durch die Formprüfung:
  Radbreite 0,1620 u gegen Durchmesser 0,2280 u, Verhältnis 1,407 — unter der Schwelle 1,5 aus
  v1. Vier benannte, gespiegelte, bodenberührende Radknoten verworfen, weil die Räder dick sind.
  v2 trennt die Schwelle nach Weg: 1,3 im Knoten-Weg (der Autor hat benannt, die vier bestätigen
  sich gegenseitig), 1,5 im Insel-Weg (dort spricht nur die Form). Sonst zeichengleich mit v1,
  neue Datei statt Überschreiben wegen des Zwischenspeichers.
- Nachgemessen nach der Umstellung: Spacetruck 4, Large 4, Trailer 4, Hatchback 4,
  raceCarRed 4 (die »12 Räder« aus der ersten Fassung kommen nicht zurück), Monster-Truck 4,
  Skateboard weiterhin 0. Deformer antwortet auf beiden neuen Profilen, `stretch` beim Trailer
  bleibt 0.
- Der Aufbau des Spacetruck Large steht 0,0579 u nach hinten über — die Nickachse liegt nicht in
  der Mitte der Karosserie. Am Deformer noch nicht nachgezogen.

## 2026-09-18 · Session-Cut · Fahrzeug-Linie, dritte Runde abgeschlossen

**Gebaut**
- `KFB Cartoon Vehicle Deformer Lab.dc.html` — Werkbank mit elf Briefing-Knöpfen plus
  `RAIL HOLD` und `NEUTRAL`, vier Profilen, Signal-Reglern, `Flip` und `Orient` mit
  Gedächtnis je Fixture.
- `lab-v7/vehicle-cartoon-deformer.v2.js` — gruppenbasierter Deformer: nested Groups,
  bounded non-uniform scale, gedämpfte Springs. Kein Shader, kein Softbody.
- `lab-v7/fixture-adapters.v2.js` — 43 Fixtures, generiert aus Handoff (25) und
  Registry (18), Herkunft je Zeile.
- `lab-v7/deformer-profiles.json`, `lab-v7/TEST_SEQUENCES.json`.

**Sieben Befunde aus Georgs Sichtprüfung behoben**
- Rad-Regel um drei gemessene Bedingungen erweitert (Gegenstück, Bodenkontakt, Größen-Median).
  Police Car 15 → 4, Wagon 10 → 4. Vorher rotierte beim Police Car die **Tür** bei ACCEL mit.
- Kamera folgt nicht mehr der Blickrichtung (z-Lage war mit `facing` multipliziert).
- Near/Far aus der Modellhülle statt fest 0,01/200.
- Orient-Schalter auf sechs achsenparallele Lagen statt vier.
- Abgelesen und eingetragen: `Kart by Ben`, `vehicle-monster-truck`, `vehicle-truck` auf −z;
  `Wagon` auf X−90°.

**Kontakt-Latch statt Cooldown** — `railImpact()` darf je Frame gerufen werden; Aufrufe
innerhalb `retriggerMs` sind derselbe Kontakt. Drei Anläufe, zwei falsch gebaut, einer falsch
gemeldet (600 ms Wandkontakt ergaben gemessene fünf Einschläge, berichtet war einer).

**Überholt, bleibt liegen**
- `lab-v7/cardeform.v1.js` — Shader-Fassung. Briefing verlangt ausdrücklich keinen
  Vertex-Overkill. Preis: die Bananen-Biegung ist entfallen.
- `lab-v7/fixtures.v1.js` — Keyframe-Fixtures, ersetzt durch signalgetriebene Sequenzen.
- `KFB Vehicle Lab v1.dc.html` — erste Werkbank.

**Offen geblieben** — Go-Kart nicht achsenparallel, Rollerskate/Skateboard-Rollen
Einzelnetz, Space Base Bits nicht ladbar, ActionFigure fehlt, keine Zahl abgenommen,
kein Ton/VFX/Kamera. Vollständig in `RETURN_cartoon_vehicle_deformer.md` (OPEN) und
`HANDOVER_RACE_2026-09-18.md`.

---

## 2026-09-17 · Fahrzeug-Linie `lab-v7` angelegt

- Auftrag: KayKit Space Base Bits aufnehmen, Fahrzeuge mit Cartoon-Deformern für
  Speed-Race-Tracks vorbereiten. Track baut Georg selbst (`kfb-hub/stunt-race/track-lab-v062`).
- **Befund B1:** das Pack hat genau drei Fahrzeuge, nicht 57. Die übrigen glTF sind Basismodule.
- **Befund B2:** Space Base Bits liegt nicht im Registry und ist im Browser nicht ladbar.
- **Befund B3:** die Registry-Fahrzeuge sind die tragfähige Quelle (22 aus drei Packs).
- **NACHTRAG (17.09. abends):** der Asset-Handoff `kfb.asset-handoff.v1` @ `10a7fdce6b` ist
  ab jetzt die Quelle, nicht das Registry. Beide bleiben, getrennt gekennzeichnet.
- Stand-Dokument `LIVING_VEHICLES.md` angelegt.

---

## 2026-09-12 · Animation Lab v1.1 · Cross-Rig abgenommen

- Cross-Rig (`M+L`) mit `FIT`/`RAW`: fremde Clips füllen nur Lücken, das gemessene Rig
  hat Vorrang. Sechs Versuche eingetragen, Urteil vom Bediener.
- **Befund Large-Lücke:** Orc Brute mit `Jump_Start` aus Rig Medium bindet 23/23 und faltet
  roh zusammen; ohne Positionsspuren hält er. Urteil *limited*.
  **Produktionsfolge: Custom-Sprungclips für Rig Large entfallen.**
- Quellen gepinnt auf `b97b5ac55df2724fae623992433685583eece51e`, 94 Pfade vorher geprüft.
- `export/AnimationMap.v0.json` und `MISSING_ANIMATIONS.md` aus den echten Inventaren erzeugt.
- Evidence-Batch: Georgs Vollauf 48/48 Zellen gegengeprüft.
- Details in `HOUSEKEEPING.md` und `LAB_QA.md`.

---

## 2026-09-09 bis 09-11 · Clip-Schau und Asset-Aufnahme

- `KFB Clip-Schau v1.dc.html` als Evidence-Viewer, nach Sprint 1 eingefroren.
- Asset-Bibliothek von Georg aufgenommen, Pfade und doppelte Pack-Kopien in `SOURCE_PATHS.md`.
- Rigging-Linie (Carl/Gesicht) in `LIVING_RIGGING.md`; `16B-FAILED.md` und
  `POSTMORTEM_carlrig_v4_16B.md` sind das bezahlte Lehrgeld.
