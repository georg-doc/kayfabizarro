# WSA · J17-Look je Rundkurs-Modul R1 · 11.10.2026

**RESEARCH / SPEC · kein Bau, keine Geometrie, kein Lab-src.** Auftrag: BRIEF_WSA_TRACK_MODULE_LOOK_SPEC_R1.md, V-144/V-134. RK2_rundkurs_baukasten wurde tatsächlich betrachtet; seine Modul-Logik gilt, seine Farben nicht. Geometrie bleibt RKIT/Track Core, Look setzt das Lab um. JSON: [track-module-look.json](track-module-look.json), Schema-Vorschlag kfb.track-module-look/1. Die IDs benennen Look-Bausteine dieses Vorschlags, nicht erfundene Core-Katalog-IDs.

## Quellen und Maßvertrag
J17 ist ein Overlay auf J16-r2. Die 13 verwendeten geerbten Source-Dateien sind **13/13 bytegleich zum originalen J16-r2-ZIP**; J14/J15-Gleichheit separat dokumentiert. [SOURCE_MANIFEST.json](WSA_TRACK_MODULE_LOOK_SPEC_R1/SOURCE_MANIFEST.json) enthält relative Source-Pfade, SHA256 und Zeilenanzahl. Pfadkürzel unten beziehen sich auf J16-r2/lab-track, Clay auf J16-r2/lab-clay. J17_overlay ist das echte J17-HTML, nicht der Lab-Port. Keine neuen Laufzeit-/Fahr-/Parity-Abnahmen.

Maße: **Track-Meter → lab = ×1,46, einmal** (Brief + aktueller MODULES-Katalog). Richtungsvektoren T/U/R, Gewichte und normiertes u werden nicht wie Positionen skaliert. Quellradien, Linienbreiten und Streckenlängen sind Herkunftswerte; gewählte aktuelle Modul-/Family-Section bleibt im Core-Katalog. H3,64 und Figuren nie skalieren (V-060).

| STANDARD-Quellmaß | Track-m | lab | Herkunft |
|---|---:|---:|---|
| Fahrbreite |14,4|21,024|core/track-core.v012.mjs:14,62–69|
| Schulter |1,98|2,8908|ebenda:64|
| Schulter-Absenkung |0,28|0,4088|ebenda:64|
| Band-Abstand / Dicke / Höhe |0,72 /1,62 /1,35|1,0512 /2,3652 /1,971|ebenda:65|
| Decktiefe |2,25|3,285|ebenda:66|

Das sind keine neuen Mindestwerte für TOWN/COUNTRY/HIGHWAY oder aktuelle ENTRY/EXIT. Frames kommen aus dem Modul: native p/T/U/R bzw. route/socket/anchor nach MODULES. Keine selbst erfundenen Anschlusspositionen. slot6/7 bleibt die Fahrfläche; Seitenprofil besteht aus den nativen 14 Slots.

## Gemeinsame J17-Schichten / Farb-Rollen
track-look.v5.js:49,133–152: `roadTrack` = #3d4a60, `roadStreet` = #566680, `strang` = #ef5a22 (canyon, V-102). `markH`/`markS` beziehen `MR.colors.worlds.canyon.hell/signal`; Bord = TP.worldPresets.canyon.city.curb (transition-profiles.v1.json:54). Andere Insel-Themen bleiben beim vorhandenen Owner; keine zweite Farbtabelle.

Die Strecke ist ein durchgehender Knetstrang aus Kehle, gerollter Krone und Bauch, nicht eine Folge gelber Rails mit blauen Kästen. Material: clay-material.v10, Fahrbahn road/legacy1, Werkzeugmassen legacy0, Strang house-Profil plus TOOLMIX.strang. Quellen: track-look:103–122,133–152; clay-material.v10:1–16; clay-profiles.v2:15–19; clay-toolmix.v1:6. Fahrbahn bleibt unverformte Kontaktfläche. ROAD_APPLY mischt Skin-Rollen, patchify Strang/Bord/Natur über räumliche Knetflecken; keine harte Alpha-Überblendung oder neue Textur zum Kaschieren falscher Formen.

**Nicht übernehmen:** core/stream-to-three.v5.mjs:3–6,154 enthält ausdrücklich Vorschau-Farben für Deck/Gore. Ein dortiges beige/orange Material oder die RK2-Farben sind keine J17-Abnahme. Scenery-PLACEHOLDER aus stream-to-three:332–338 wird kein Vulkan-Donor.

## 1 · Gerade → Kreisel / Abzweig
Quelle: core/track-core.v012.mjs:889–907; stream-to-three.v5.mjs:332–356; native J17-Seitenform track-look:196–220. Alt-Core enthält ROUNDABOUT mit Fillets, Splittern, Arm-Sockets, Node-Marking und NPC-Pfaden. Somit **keine pauschale Fehlt-Meldung** für Kreisel.

Quellbeispiele: armLength30m→43,8lab, fillet14m→20,44lab, flare18m→26,28lab. Für heutige Module gelten V-143 und gewählte Katalogmaße, nicht diese historischen Defaults. Innen/Außen-Bande folgt dem tatsächlichen Core-Kerblauf bis zum tangentialen Anschluss; keine gelöschten Banden am Mund. Vulkan = echte Szenerie am Mittel-Anker.

1:1 verfügbar sind native Stream-Schnittstellen und J17-Strang/Material. Der untersuchte J17 track-look.v5.js zeigt keinen dedizierten Verbraucher der vierarmigen Node-Decks. Der Alt-Core-Loader besitzt einen Preview-Node-Verbraucher, das belegt noch keinen fertigen J17-Clay-Kreisel. Look-Abgleich ist daher beim Lab erforderlich. [Ausschnitt Außenstrang](https://github.com/georg-doc/kayfabizarro/blob/dccf75cabd222d951380693d84ab88053ee7e519/tools/KFB-ToolBox/_inbox/KFB%20Joyride%20J17%20%C2%B7%20FB%20Cabrio/JOYRIDE_J17_2026-10-01/pictures/chase-curve.jpg) belegt nur J17-Masse/Farbe, keinen Kreisel.

## 2 · Geführte ENTRY
Quelle: Alt-Core MERGE_HALF core/track-core.v012.mjs:245–256; interne Seitenabschlüsse stream-to-three:56–82; J17-Strang track-look:196–220. Der aktuelle geometrische Donor ist **ENTRY/CONVERGE ab0.14 nach V-118**, nicht ein Nachbau von MERGE_HALF.

Historische MERGE_HALF-Logik: laterale Achse/Offset mit smootherstep, inneres side-Gewicht1→0, inneres barrierVis1−smoothstep(u/barrierTo), Quell-default barrierTo0,7. Das ist normiertes u, keine 0,7-m-Länge. Genaues aktuelles ENTRY-Maß/Frame aus MODULES; hier kein Maß geraten. Native Knetkrone und road/strang-Rollen auf dem vorhandenen Bauteil erhalten. Öffnung konstruiert schließen, nicht eine volle Querschnittskappe quer über den Zufluss ziehen.

Markierung: M2-Block-/Leitlinien-Vertrag, konkretes Einfädel-Ereignis beim Core/Lab. Im geprüften J17-Bildsatz keine genaue ENTRY-Mund-Ansicht gefunden; Außenstrang-Crop ist nur Look-Vergleich, kein Modulbeweis.

## 3 · Geführte EXIT, Gore, Leitwand-Nase
Quellen: core/track-core.v012.mjs:232–245,727–755; stream-to-three:199–218. Donor heute: **EXIT/DIVERGE ab0.14 V-118**. Der alte Split hebt die innere Bande verzögert (barrierFrom0,3, normiertes u), trennt die Seiten mit tatsächlicher Gore-Fläche und führt eine reale Deck-/Wandmasse.

Maßherkunft getrennt halten: alter SPLIT_HALF-Gore-default1m→1,46lab; PIT.gore5m→7,3lab, PIT.wall1m→1,46lab, wallH1,2m→1,752lab sind PIT-Beispiele, **keine heutigen EXIT-Defaults**. Gore aus dem Core übernehmen; keine darüberliegende Ersatzplatte. Wand/Nase bekommt vorhandene strang-Knetrolle; Sperrflächenmarkierung bekommt M2-Rollen. Preview-Hexwerte aus DECK_COLOUR nicht übernehmen.

Nicht gefunden im untersuchten J17-Renderer/Bildsatz: ein vollständig bebildertes J17-EXIT-Modul mit Gore und fertiger Leitwand-Nase. Geometrische Donoren sind vorhanden; das ist keine Forderung nach neuem Entwurf. Markierungsdefinition allein beweist keinen Renderer-Verbraucher.

## 4 · Innerer Banden-Übergang
track-look.v5.js:190–214: signierte Kurvenkrümmung; innen bei ks×side>0. `inner=sstep(.008,.022,ks×side)×(1−bt)`; Schwellen sind Quellkrümmungen, keine Meterlängen. RIB3,5m→5,11lab; Kehlen-Lift-Term0,26m→0,3796lab, multipliziert mit inner/Rippengewicht. Lokales R und Kurvenzeichen entscheiden, nicht immer Welt-links.

Gerolltes Profil 1:1 erhalten: Radius clamp(.55×(Hx+drop),.14,1.25), Krone entlang240° mit14 Abschnitten, Handwelle mit Quell-s-Koordinate. Nicht auf glatte Kastenschiene/Bevel reduzieren. [Echter J17-Innenausschnitt](https://github.com/georg-doc/kayfabizarro/blob/dccf75cabd222d951380693d84ab88053ee7e519/tools/KFB-ToolBox/_inbox/KFB%20Joyride%20J17%20%C2%B7%20FB%20Cabrio/JOYRIDE_J17_2026-10-01/pictures/chase-curve.jpg) zeigt Kehle/Krone; kein isolierter Modul-Neubau.

## 5 · Äußerer Banden-Übergang
track-look:200–218: `outer=sstep(.014,.04,−ks×side)×(1−bt)`; Radius wird ×(1+.32×outer), Krone um0,3m×outer erhöht und seitlich um0,12m×outer versetzt (lab-Koeffizienten0,438 /0,1752). Bauch/Unterseite bleiben Teil des Strangs.

Das sind gewichtete Quellterme, keine pauschal höhere Wand für jedes Modul. Rolle strang und ursprüngliche Werkzeugspuren erhalten; nicht RK2-Baukästen/gelbe Rails kopieren. M2-Rand folgt der echten road_L/R-Kante. Außen-Crop zeigt durchgehende J17-Randmasse, nicht einen gemessenen modularen Krümmungsübergang.

## 6 · Bord-/Schulter-Verjüngung
Quellen: native profile defaults Core:62–70 und side/barrier weights:232–256; Atlas:65–70; J17 sideProfile:200–218. City-Morph auf niedrige Lippe Hx0,32m→0,4672lab, Natur auf0,5m→0,73lab plus Breitenfaktor1+.9×bt. Ursprungsschulter1,98m, drop0,28m; tatsächlicher Modul-Querschnitt bleibt Core.

`groundK=1−sstep(1.2,4.0,height)`, `curbK=1−sstep(3,8,height)`: Stadt-Strang nur am Boden abbauen; auf erhöhtem Deck Sicherheitsband erhalten. Natur und Stadt sind verschiedene Zielmassen. In voller Topologie muss auch eine abtauchernde Seite konstruiert sein; barrierVis0 ist kein Freibrief, ein Ende ungelöst abzuschneiden.

Taper-Länge aus aktuellem Anschluss-Modul, nicht ROUND_END16m zweckentfremden. Straße-Crop zeigt fertige Gehweg-/Straßenrolle, keine Taper-Freigabe. M2 Stärkewechsel B→S im eigenen20m-Fenster.

## 7 · Markierung / Vorfahrt / Pfeile
M2 JSON:14–81,183–268,305–317; M2 JS:58–108; Atlas:185–189. **M2 ersetzt M1** (anderer Rhythmus, gerade Enden), M1 bleibt Farbe/Material-/Runout-Donor. Nicht M1-Tropfenrhythmus und M2-Streifenmaße ungeprüft mischen.

| M2-Quelle | Track-m | lab |
|---|---:|---:|
| S / B / Q |0,3 /0,6 /1,2|0,438 /0,876 /1,752|
| Leitlinie Strich/Lücke |6 /12|8,76 /17,52|
| Knoten-Leitlinie / Blocklinie |3 /3|4,38 /4,38|
| Warnlinie |6 /3|8,76 /4,38|
| Wartelinie Strich/Lücke |1,2 /0,6|1,752 /0,876|
| Richtungspfeil Länge / Schaft |10 /0,6|14,6 /0,876|
| Stärke-Keil B→S |20|29,2|

M2-Rand bündig road_L/R, matte flach gewölbte Knetlinie; Profil lift.008, maxh.055 Quell-m, gerade Enden, corner.075. bio−1 Strecke: keine Mittelstreifen/Zebra. bio0 Stadt: passende Mitte/Zebra; bio1 Natur: mark_track-Präsenz; MAG signal3/3-Blöcke. Markierungsformen müssen Zweck tragen, nicht alle Straßen wie Rennbahnen beschriften.

**Drei Grenzen:** (a) M2 JS rendert im untersuchten Stand Rand/MAG/Mitte/Zebra; generische Pfeil-/Vorfahrt-/Schraffur-Definitionen im JSON sind noch kein dortiger Verbraucher. (b) Alt-Core-Kreisel liefert eigene yield(.4/.9/.55), TRACK edge(.30,inset.25), die nicht M2 Q/flush entsprechen; separat als Alt-Core kennzeichnen. (c) lokaler MODULES-Katalog bezeichnet B0,6 als lab; J17-Quelle ist0,6 Track-m→0,876lab. Einheitenbezeichnung vom Lab klären, kein stiller WSA-Patch. [Straßen-Crop](https://github.com/georg-doc/kayfabizarro/blob/dccf75cabd222d951380693d84ab88053ee7e519/tools/KFB-ToolBox/_inbox/KFB%20Joyride%20J17%20%C2%B7%20FB%20Cabrio/JOYRIDE_J17_2026-10-01/pictures/chase-straight.jpg) belegt nur das sichtbare fertige J17-Straßenbild.

## 8 · Endkappen / Bandenköpfe
ROUND_END / END_TAPER: Core:173–195; individuelle Seitenkappen:773–781 und stream-to-three:212–215; J17-Fix:track-look:235–268 + echtes J17_overlay:24–28.

ROUND_END.len16m→23,36lab, nose9m→13,14lab, vis1. Viertel-Ellipsen-Nase verändert Seiten-/Deckumfang; Fahrfläche bleibt bis zur Lippe voll breit. END_TAPER ist Alias, kein konkurrierender keilförmiger Design-Vertrag. noMark gilt d<1m.

Unterscheiden: vollständiges offenes Streckenende; individueller Bandenkopf; interne Topologie-Naht; geschlossener Ring. Historische Seitenkappe r=barrierT/2=.81m→1,1826lab und h=barrierH+drop=1,63m→2,3798lab folgt realem T/U-Frame. Die volle J17-Streckenlippe als capsule r.48m→.7008lab ist **kein** Ersatz für den Bandenkopf an ENTRY/EXIT.

J17 aktiviert strangCap: echte Profilpolygon-Kappe im R/U-Schnitt statt Fächer über die Fahrbahn. Geschlossener Stream verbindet Anfang/Ende ohne Kappen/Lippen. Interner brk schließt nur die sich ändernde Seite. Aktueller Lab-Port ist ein getrennter Prüfort, seine mögliche Fallback-Kappe nicht automatisch als dieser J17-Fix deklarieren. Keine eindeutige Bandenkopf-Nahaufnahme im geprüften J17-Bildsatz; hier Codebeleg, keine generierte Illustration.

## 9 · Strecke → Straße / ZA / B
J14/J17 T4: transition-profiles:26–58, Atlas:50–70, track-look:138–152,223–230. ZA s1470–1570 ist100m Quellzone→146lab und bodennah; ZC s560–650 ist erhöhtes Parkdeck. ROAD_APPLY / roadTrack ersetzt die alte24m-Skinfuge. Native Strang/Bord/Gehweg-/Fahrbahn-Rollen bleiben vorhanden.

V-104/V-139: Variante B nutzen, **kein neuer Entwurf**. C0-B-Fixture curb[.18,.63], barrier[.46,.85]: Überlappung(.63−.46)×100=17m→24,82lab im illustrativen100m-Vergleich. Keine17m-Pflicht für jedes Core-Modul. Bei C0 an ZA sind die city→track-Fenster umgekehrt angewendet, einschließlich from/to, damit die Stadt danach Stadt bleibt (C0_REPORT:10–25).

B ist Arbeitshypothese; mark_track-Verbraucher ist für City im geprüften M2 noch nicht über dieses Fenster gesteuert. Auch Collider/Fahrraum/echte Kappen sind kein Resultat der alten Fixture. Nicht aus einem schwach unterscheidbaren Chase-Bild eine vollständige Naht-Abnahme ableiten. Vorhandenen Verbraucher präzise anbinden, Source-Wirkung daneben prüfen; keine zweite Weg-Geometrie.

## Such-Protokoll / offene Empfangsprüfung
[SEARCH_PROTOCOL_V140.json](WSA_TRACK_MODULE_LOOK_SPEC_R1/SEARCH_PROTOCOL_V140.json): Routing/Acceptance-Dateien, J14/J15-TC1/J16/J17, O1-v4–v7, Rollercoaster-v11, Stunt Car Race und frühere Phase-Lieferungen tatsächlich durchsucht. Dateitypen/Größen-/Medien-Ausschlüsse und Trefferzahlen angegeben. Entdeckungssuche ist keine Sicht-/Detailprüfung jedes Treffers. Negative Aussagen oben gelten nur für ausdrücklich benannte Renderer/Bildsatz, **keine globale „fehlt“-Meldung**. Aktuelle ENTRY/EXIT>=.14 bleibt V-118; historische v.012-Defaults widerlegen sie nicht.

Empfangs-Gate: RKIT/Lab ordnen diese Look-IDs realen MODULES-Zeilen zu, klären Einheiten/Markierungs-Verbraucher und behalten vorhandene Vorlagen. Module in gleicher Kamera neben J17 zeigen, dann Core-Naht-/Fahrprüfungen und Lab-Parity durch ihre Owner. Diese Lieferung enthält keine neuen Implementierungs-/Fahr-/Render-/Golden-Abnahmen und keine Lab-src-Änderungen.

## Bildlieferung
Drei reine Pixel-Crops wurden lokal erstellt, betrachtet und 3/3 auf Pixelgleichheit geprüft. PNGs bleiben lokal; automatische Freigabeprüfung hat deren GitHub-Veröffentlichung wegen fehlender ausdrücklicher Bilddaten-Freigabe abgelehnt. Die Links oben führen stattdessen zu den bereits veröffentlichten Original-J17-Bildern; IMAGE_EVIDENCE.json nennt die exakten Ausschnittsrechtecke. Keine neuen Bilder generiert.
