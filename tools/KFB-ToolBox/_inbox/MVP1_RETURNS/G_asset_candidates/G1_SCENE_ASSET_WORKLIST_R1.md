# KFB MVP-1 · Szenen- und Asset-Arbeitsliste (G1 Koordination)

Stand: 2026-10-10 · Quelle: [Briefing R1](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/deliveries/BRIEF_WEBCHAT_ASSET_CANDIDATES_R1.md). **Nur Bildserie/Assetsuche, keine WorldBuilder-Runtime-Freigabe.**

## Stand & Verantwortung
- **7 Assemblierungs-/Review-Szenen**, **6 Eigentümergruppen**, **40 Einzelmotive** als genau abgegrenzte Render-/Asset-Picks. Die Szenen sind Präsentationskontexte aus dem Briefing, keine neuen fertigen Spielwelten.
- Aktuelle drei Bildgenerierungen in Chat: Town erster Entwurf; Town cartoonigeres Clay-Tuning (Georg: „sieht cool aus! aber der look könnte noch cartooniger, stilisiert und weniger realistisch sein, denke ich….“; danach „super!“); Protopia erstes Motiv (Georg: „super!“). **Keine** original-FBX-Source-Isolation, K2-Native-BBox oder Golden/Pick dadurch erreicht.
- **G1 ist nur Redaktions-/Koordinationsfläche für diese Gesamtliste. G2–G6 behalten ihre eigenen Autor- und Auswahlzuständigkeiten.** Nie andere Gruppen-JSON ungefragt überschreiben.
- Auswahlverfahren: Originalpaket-Kandidat → echte Source-Einzelansicht → 3/4 Cartoon-Clay-Konzept → Georg TUNE/PICK oder weiter suchen → Ansichten Front/Seite/Unterseite → Quellenbezug/Metadaten. Keine generischen Render-Platzhalter als donorgetreue Wahrheit.

## Szenen / Reihenfolge
| Nr. | Szene / Motivkorridor | Gruppe | Priorität | Aktueller Stand |
|---|---|---|---|---|
| S01 | Town: breites Inselplateau | G1 | P0 | 2 Konzeptbilder erstellt, originaltreu ungeprüft |
| S02 | Protopia: schmalere höhere Scholle | G1 | P0 | 1 Konzeptbild erstellt, originaltreu ungeprüft |
| S03 | Town-Straße: Fahrbahn/Bord/Gehweg/Anschluss | G2 | P0 | noch ohne Bilder |
| S04 | Ringstraße / Joyride-Racetrack | G3 | P1 | noch ohne Bilder |
| S05 | Steinbogenbrücke und Burgaufstieg | G4 | P0 | 2 Konzeptversuche FEHLGESCHLAGEN/QUARANTÄNE – beschriftete Mehrbildblätter statt Einzelobjekt; kein akzeptiertes Bild |
| S06 | Markt und Burgumfeld | G5 | P1 | noch ohne Bilder |
| S07 | Protopia-Farmerland / Bergaufstieg / Eremit | G6 | P1 | noch ohne Bilder |

## G1 · Inselkörper und Fels · P0
*S01 · Town-Plateaubasis und S02 · Protopia-Bergscholle* · Quellen zuerst: StreakByte Low Poly Floating Islands → eigene Registry Kenney/Quaternius/Platformer

- [ ] **01. Breites ruhiges Town-Plateau** (`town_plateau`) — Konzept gerendert · **keine Quellenfreigabe**; Town R1 und cartoonigeres R2 in diesem Chat erzeugt; kein isolierter StreakByte-Quellenbeweis
- [ ] **02. Schmale, hohe Protopia-Berginsel** (`protopia_mountain_island`) — Konzept gerendert · **keine Quellenfreigabe**; Protopia R1 erzeugt; eher hohe Felsstufe, keine verifizierte StreakByte-Silhouette
- [ ] **03. Kleine Felsbrocken / Brückenauflager** (`bridge_rock_piers`) — Quellenkandidaten gefunden · Render offen; StreakByte / Kenney: Verbaukontakt prüfen
- [ ] **04. Abbruchkante, Felswand / Schollenseiten** (`cliff_rupture`) — Quellenkandidaten gefunden · Render offen; Kenney cliff und StreakByte Cave
- [ ] **05. Große Solitärfelsen** (`large_boulders`) — **Kenney Nature rock_largeA exakt als GLB-Quellmesh geprüft** ([4 isolierte Quellansichten](refs/source-isolation/G1_kenney_rock_largeA_source_4view.svg), [Source-Proof und Maße](G1_ROCK_LARGEA_SOURCE_EVIDENCE_R1.md)); cartooniges G1-Zielbild noch offen, kein Pick/Golden.
- [ ] **06. Felsgrate / Bergsporne** (`rock_ridges`) — Quellenkandidaten gefunden · Render offen; StreakByte Mountain und KayKit/Platformer als Formdonor

## G2 · Stadtstraße · P0
*S03 · Town-Straße mit sinnvollem Anschluss* · Quellen zuerst: Kenney city-kit-roads → gekauftes Toon City → bestehender RKIT/Track Core

- [ ] **07. Fahrbahn / Straßenbett** (`road_surface`) — offen; bestehenden Track Core als Besitzer wahren
- [ ] **08. Hoher Bordstein** (`raised_curb`) — offen; weicher Übergang zur Straße
- [ ] **09. Abgesenkter Bordstein** (`dropped_curb`) — offen; rollbarer Straßenanschluss
- [ ] **10. Plattengehweg** (`pavement`) — offen; verbundene Oberfläche, kein CAD-Raster
- [ ] **11. Rinne** (`gutter`) — offen; physikalischer Randanschluss
- [ ] **12. Straßenablauf** (`drain`) — offen; Rinne + Ablauf zeigen
- [ ] **13. Kreuzung / Einmündung** (`junction`) — offen; echte sinnvolle Verzweigung, keine dead-end-Graphik
- [ ] **14. Straßenende / Übergang in Gras** (`road_end`) — offen; kein harten Sockel, keine funktionslose Sackgasse

## G3 · Ringstraße außen · P1
*S04 · Joyride-Ringstrecke am Stadtrand* · Quellen zuerst: gekauftes Cartoon Race Track Oval → Kenney racing → Joyride/Track Core

- [ ] **15. Rennstrecken-Bande rot oder rot-weiß** (`race_barrier`) — offen; dicke runde Kante
- [ ] **16. Bandenkopf / Endstück** (`barrier_cap`) — offen; geschlossenes Ende statt Schnitt
- [ ] **17. Reifenstapel** (`tire_stack`) — offen; wenige großzügige Formen
- [ ] **18. Bankett / Asphalt-Gras-Übergang** (`verge`) — offen; Terrain-Kontakt
- [ ] **19. Startlicht** (`start_light`) — offen; aus eigenem Bestand vor Textgeometrie
- [ ] **20. Rennstrecken-Banner** (`race_banner`) — offen; KFB-Branding aus bestehenden Assets, keine Ersatzlogos

## G4 · Brücke und Treppe · P0
*S05 · Burgaufstieg und Brückenanschluss* · Quellen zuerst: Kenney castle-kit / KayKit Medieval Builder / StreakByte / gekauft Medieval Castle Modular; img2threejs Steinbogen als Richtungsdonor

- [ ] **21. Steinbogenbrücke (optional mehrere Felder)** (`stone_arch_bridge`) — **2 Renderfehler / QUARANTÄNE**; [vollständige Recovery](G1_G4_BRIDGE_VISUAL_FAILURE_RECOVERY_R1.md); beide Bilder nicht als G4-Asset übernehmen. Freigestellte Originalquelle vor Integration, Bogen wächst aus Fels
- [ ] **22. Brückenkopf / Widerlager** (`bridge_abutment`) — offen; in Scholle verankert
- [ ] **23. Brüstung** (`bridge_parapet`) — offen; breit und gerundet
- [ ] **24. Brückenpfeiler** (`bridge_support`) — offen; Kontakt und Schwerkraft
- [ ] **25. Steintreppe mit Wangenmauern** (`castle_steps`) — offen; keine schwebenden Stufen
- [ ] **26. Rampe** (`access_ramp`) — offen; begehbar / befahrbar nach Rolle

## G5 · Burgumfeld und Markt · P1
*S06 · Town-Markt / Burgsockel als belebte Szene* · Quellen zuerst: KayKit / Tiny Treats / Kenney / Big Castle (gekauft, privat)

- [ ] **27. Burgsockel / Burghügel** (`castle_hill`) — offen; Gebäude-Standfläche erdverbunden
- [ ] **28. Marktstände** (`market_stalls`) — offen; Marktnutzung lesbar
- [ ] **29. Clown-Bühne / Podest** (`clown_stage`) — offen; juggler als bestehender Resident-Donor, nicht neu modellieren
- [ ] **30. Brunnen** (`fountain`) — offen; räumliche Funktion am Markt
- [ ] **31. Bänke / Sitzgelegenheiten** (`benches`) — offen; sozialer Ort statt Deko
- [ ] **32. Laternen** (`lanterns`) — offen; Weg und Nutzung
- [ ] **33. Billboard-Standorte / Aufsteller** (`billboard_places`) — offen; bestehende Billboard-/Quote-Owner beachten

## G6 · Protopia-Gelände · P1
*S07 · Protopia-Aufstieg, Teich, Farmer und Eremit* · Quellen zuerst: StreakByte / KayKit Nature / Kenney / Quaternius / Tiny Treats zuerst

- [ ] **34. Bergweg / Serpentinen** (`serpentine_path`) — offen; Hangkontakt, lesbare Route
- [ ] **35. Hangtreppen** (`hillside_steps`) — offen; begehbar, Teil des Weges
- [ ] **36. Teich mit weichem Ufer** (`pond_bank`) — offen; keine harte Ringlippe
- [ ] **37. Bach / Uferlauf** (`stream`) — offen; Wasserquelle und logischer Abfluss
- [ ] **38. Tunnelportal** (`tunnel_portal`) — offen; Durchfahrt auch für Auto
- [ ] **39. Eremitenhügel / Schreibpult / Hütte** (`hermit_hill`) — offen; reales Ziel der Route
- [ ] **40. Farmer-Felder** (`farm_fields`) — offen; sichtbare Aktivität / Ernte

## Einheitlicher Render-Vertrag
Ein Objekt pro Bild, gleiche neutrale Studioumgebung, 3/4 zuerst; Front, Seite und Unterseite nach Bildentscheidung bei Schollen/Brücken. Gerundete Knetformen und kontrollierter Materialmix; keine fotorealistischen Oberflächen, keine CAD-Schnitte, keine gleichmäßig wiederholten Module. Kein zusätzliches Set-Dressing, Figuren, Tiere, Autos, Texte oder Logos im isolierten Asset-Render. K2: 1 MC = 1,76 H, Town ≈40 MC, Protopia 20–28 MC. Keine fiktiven Maße. Baseline-Quelle bleibt der aktuelle Lab-/Asset-Librarian-Bestand, nicht die Bildgen-Komposition. Bilder separat als 'CONCEPT / STYLE PROPOSAL' kennzeichnen, bis der tatsächliche Donor einzeln visuell bestätigt ist.

## Nächste einzelne Bildentscheidung
**G4-Steinbogen ist nach 2 nicht verbesserten Einzelobjekt-Renders eingefroren**; siehe [Fehlerexport/Recovery](G1_G4_BRIDGE_VISUAL_FAILURE_RECOVERY_R1.md). Das aktuelle G1-Gate ist zunächst das **hochaufgelöste PNG-Upload-Finish**, bevor weitere Bilder eingecheckt werden. Danach kann G1 einen neuen Fels-/Schollen-Donor isoliert darstellen; G4 erst mit tatsächlicher Quelle und eigenem qualitätsgesichertem Einzelbild-Gate.
