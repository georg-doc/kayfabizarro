# WSA · Track-Modul-Look R2 · 11.10.2026

> R2 abgenommen. Die damalige Fragenliste bleibt als Recherche-Snapshot unverändert; aktuelle Antworten siehe [V-154 / Steering-Antworten](STEERING_ANSWERS_TD_R2.md) und [Zuordnung der Steuerung](STEERING_REPLY_WSA_R2.md).

**RESEARCH / SOURCE-SPEC, kein Bau, kein Lab-src, keine neue Skin-Look-Abnahme.** R1 ist laut R2-Brief abgenommen. Seine drei freigegebenen J17-Pixel-Crops sind veröffentlicht und verknüpft. R2 erweitert [track-module-look.json](track-module-look.json) im gleichen Schema `kfb.track-module-look/1` um `skin`: race, town, country, dirt, trail, cosmic. V-146–V-152 sowie V-118/V-120/V-134 gelten.

## Umfang / Quellen
Alle 12 vorhandenen Blätter TD1–TD5, CS1–CS3, CR1–CR4 tatsächlich betrachtet; lokale Bytes **12/12 gegen aktuelle GitHub-Original-Blobs bestätigt**. Nur Originale werden verlinkt, keine neuen R2-PNGs veröffentlicht. [Referenzblatt-Verzeichnis](WSA_TRACK_MODULE_LOOK_SPEC_R2/REFERENCE_BOARDS.json) enthält Originalpfade und Hashes.

175 neue nummerierte Look-Einträge + 9 akzeptierte R1-Source-Einträge = **184 Datensätze**, mit **194 Bildstellen-/Hero-/Seitenprofil-Zuordnungen** in [BOARD_COVERAGE.json](WSA_TRACK_MODULE_LOOK_SPEC_R2/BOARD_COVERAGE.json). Root-Felder colorRoles/referenceSection enthalten weiterhin den akzeptierten R1-Race-Quellenwortschatz; sie sind keine globale Palette oder STANDARD-Section für town/country/dirt/trail/cosmic. Maßgeblich für R2 ist der jeweilige Skin-Eintrag, Cosmic hat keine festgelegten Rollen.

Wiederkehrende Gerade/Kurve/T/Kreisel werden ausdrücklich über ihren Skin und Source-Bestand beschrieben; sie sind keine 175 neuen Geometrie-Module. Quellenpfade, Zeilen und Maßherkunft stehen pro Datensatz. Fehlende Maße bleiben unbekannt statt geschätzt.

Reihenfolge der Recherche: town → Übergänge → country → dirt/trail → cosmic; verbleibende TD1/TD5-Bauformen über bestehende Race-Quellen. R1-Caps/ENTRY/EXIT/Seitenform werden wiederverwendet. `catalogueModuleId:null` bedeutet keine erfundene Core-ID. `family:null` bei unbestätigten DIRT/TRAIL-Bindungen verhindert eine erdachte Familie; gewünschter Skin und Source-Status bleiben lesbar.

[14 zusätzliche Source-Snapshots](WSA_TRACK_MODULE_LOOK_SPEC_R2/SOURCE_MANIFEST_R2.json): aktueller öffentlicher RKIT-TD-Katalog, Steering-Antworten, Skin-Schritte1/2/4, DIRT-Vorlagen-Zeile, Lauf03-Bericht, tatsächliche B7/Town-Teilemetadaten, Kanten-/Rubbel-Grammatik, S4-v2-Brief, RollerCoaster-v11, Lab-Sky-Host und Presets. Die unveränderten J17/J16-Quellen bleiben im R1-Manifest. Source-Dateien privat/lokal gesichert, keine gekauften Modelle oder private Core-Implementierung veröffentlicht.

## 1 · town (CS1, TD2)

**Bestand zuerst:** RKIT Gehweg/Bord Lauf03 und `hex_b7.parts.glb` mit tatsächlichen Knoten BORD, PLATTE, KANTE_QUER/KANTE, KOPF_KNET. Descriptoren/GLB-Knoten gelesen; bestehende Bord- und Kantenstein-Aufnahmen betrachtet. Quelle `Town_Run03:5–19,32–48`; `B7_parts_metadata`; `Town_parts_metadata`. GLBs sind **lab-Einheiten** und werden nicht nochmals ×1,46 skaliert. Keine Source-Teilzahl des alten Berichts als heutige unveränderte Modellzahl behaupten.

Schichtung: J17-roadStreet auf realem Fahrbahnkörper → gebettete starre Bordblöcke → Gehwegplatten → eine Kantensteinreihe → geerdete Graskante. Starre Steine kürzen, nicht verbiegen; Rinne/Ablauf und Taschenfuß behalten. Eine Plain-Road-Kachel bekommt keinen heimlichen Bord/Gehweg. Einseitigkeit kommt aus `edge L/R`; B7 rechts ist Source, keine Wahl der Zielseite. Farben bleiben Rollen stone[], paved[], grass[] aus ENV_ROLES, keine CS1/TD2-Pixelfarb-Palette.

**Source-Differenz:** aktuelle Parts-Metadaten nennen road_j17 als fixed #545e7a, J17-roadStreet ist #566680. Das ist ein nachprüfbarer Quellenunterschied, kein neuer WSA-Farbbeschluss. Georg bestimmt den endgültigen Town-Look im Lab. Lauf03 ist ein Strecken-/Bucht-Donor; seine Aufnahmen belegen keine fertig gebauten T-/Kreisel-Gehwege.

Knoten: Skin-S1 bestätigt Familie/Section der Welt-Kreisel-Arme, S2 node.skin-Bindung. `q.skin` ist Palette, `node.skin` ist Modulebene: nicht gleichsetzen. S4 liefert inzwischen **Kappen-Daten** und erhabenen Town-Splitter; die ältere „fehlt“-Liste ist dort überholt. Splitter auf source-TOWN-Bordhöhe0,35 Track-m→0,511lab, gerundete Nase; zusätzliche Breite nach V-150 #5, keine Spurverengung. Das beweist noch keinen beliebigen alleinstehenden Median oder fertig gerenderten Stein-Look.

V-150-Autorität:
- Bordabsenkung nur mit Haus/Hof/Garage als Ziel (#6), Länge/Resthöhe nicht erfinden.
- Sackgasse immer Wendeschleife (#7); nackte Kappe nur Baustelle. S4-Kappe nicht an belegten Ein-/Ausfahrt-Sockets und nicht an der 1-Arm-Wende.
- Platz nicht befahrbar, bündig mit Pollern (#8); Straße über Platz bleibt Straße mit Platzrand. Pollerabstände/Form noch keine neue WSA-Vorgabe.
- Zebra an Armen mit Gehweg zu Gebäuden/Platz (#9); nicht pauschal jeder Arm.

CS1-Haifischzähne sind nicht automatisch die M2/Alt-Core-Strich-Wartelinie. V-150 bestätigt deren Form nicht. Frage mit Bild/Stelle bleibt in V-148-Liste.

## 2 · Übergänge (TD4, TD5, CS2)

**race ↔ town:** V-150 #15 bestätigt jetzt **J17 Variante B,17m** (24,82lab); das präzisiert R1s historische Fixture-Herkunft. Atlas/ROAD_APPLY und gebaute Bord-/Strang-Überlappung bleiben Donor. Bilder teilen das nur als Modulgliederung auf; keine zweite Platte/Naht-Geometrie. V-150 #21: Bande endet vor Urban-Übergang, danach Street mit zweckbezogenem Zebra. Der bekannte mark_track-Verbraucher-/Core-Typwechsel-Abgleich aus R1 bleibt Empfangsprüfung, kein WSA-Fix.

**Bord ↔ Leitplanke:** V-150 #16 erlaubt es auch auf freier Strecke, nach Rampenfuß-Vorlage. Keine unbestätigte feste Länge und keinen neuen Leitplankenquerschnitt aus Pixeln ableiten. S4-v2 nennt Armco/Guardrail-Language; das ist kein fertiges Knet-Modul.

**Belag ↔ Schotter:** V-150 #11: ungefähr20m→ungefähr29,2lab, Kerb zuerst weg, Belag franst in Knetklecksen aus. DIRT-Vorlage schlägt [0,.3] / [.3,1] vor; Fenster sind weiterhin Vorschlag, nicht aus „passt soweit“ für alle späteren Tuningwerte freigegeben. Source-Familien S4-v2:2 Street/path↔Dirt und3 Race↔Dirt; derselbe Slot-/Socket-Owner. Kein generischer Gradient oder Schotter-Overlay als Ersatz für Profil-/Kontaktwechsel.

**Brückenkopf:** V-150 #17: Geländer statt Bande auf Brücke, Wechsel am Kopf. Pfeiler/Viadukte nur auf Inseln (V-120); interinsular schwebende Trasse. C1/C2 im RKIT-Katalog sind Bestand; konkrete Geländerform/-höhe und Wechsel-Länge bleiben Empfänger-Vorlage, keine WSA-Konstruktion.

**Gemischter Knoten:** Hauptstrecken-Skin bestimmt Ring (#14), Ecke ist echtes Übergangsstück. Nicht durch bloße q.skin-Palette einen neuen Knotenquerschnitt erzeugen. Gemischte Eckverbinder im Kurvenfenster bleiben zu prüfen, nicht von geraden20m-Fenstern automatisch abgeleitet.

## 3 · country (CS2, CR4)

COUNTRY-Section ist Bestand, nicht neuer J17-Race-Querschnitt: gravel/shoulder, verge_lip, verge, ditch, embankment. S1/S2 benennen MOUNTAIN/HIGHWAY als verwandte Familien; HIGHWAY-Zuordnung zu country bleibt ausdrücklich vorläufig. Country-Gerade/kurz/Kurve/Haarnadel/S, T/4-Wege, Kreisel/Wende und Breitenwechsel nutzen echte Core-Module. Nicht überall den orangefarbenen Race-Wulst oder einen Town-Gehweg nachbilden.

Graben und Graskante sind geformte Source-Schichten, keine Textur auf flacher Schulter. Kiesel/Rubbel entsteht ursächlich an Außenkurven, Abläufen, Abplatzungen, Ruinenfuß; Quelle `Edge_Rubble:19–33`. Keine gleichmäßige Steinchenreihe. Leitplanke/Zaun optional je Abschnitt; genaue Gefahr-/Hang-Regel und Ausstattung gehören zur offenen Wahl, nicht zu einer Pflicht aus CS2-Hero.

CR4 ergänzt Tunnelzufahrt/-stück/-ausfahrt, Brückenkopf/Viadukt, Haltebucht, Stützung und End-/Platzanschluss. Keine neue Straßenbreite aus dem Bild geschätzt. Auto-/Skin-Unabhängigkeit V-152 bedeutet keine ungeprüfte Passage durch beliebig enge Geometrie.

## 4 · dirt / Bergschotter / trail (TD3, CS2, CR1–CR3)

**Quellenreichweite dirt:** J17/Atlas nature.path/Erdton und Strang→Wiesenlippe sind Farbe-/Schicht-Bezüge; stream-to-three:245–281 BIOME_PREVIEW canyon/nature ist ausdrücklich **Preview**. S4-v2:245ff/317–318 benennt Schulter, Berm, Kies/Sand, Graslippe, Graben, Fels-/Holz-/Seilrand. Ein finaler Rillen-/Berm-/DIRT-Look ist in diesen geprüften Renderquellen nicht belegt; keine globale Fehlt-Meldung.

**DIRT-RKIT-Vorlage bleibt Vorschlag:** NARROW10,8, shoulder1,0, grass_lip1,5, bank35° etc werden nicht als genehmigte Look-/Physikwerte übernommen. Georgs bindende Vorgaben sind schmaler als Rennen, Band nur an Gefahrenstellen, Berm/Wandfahrt/Sandkurve tatsächlich fahrbar sowie chill&fun Assist als Standard (V-150/V-151). Assist-Parameter stehen hier auf unbekannt; keine echte Fahrprüfung durchgeführt. Alle Autos unabhängig vom Skin (V-152), kein Racing-Car-Verbot auf dirt.

CR1: Serpentinen, Haarnadel/Berm, T/4-Wege, Wende, Damm/Graben, Schotter→Belag/Pfad und Ruinen-Rand werden den vorhandenen Form-/Schichtquellen zugeordnet. Enden sind Wiese/Hof/Gatter (#12), keine unexplained offene Kappe.

**trail:** eigener Geh-Netz-Skin V-152. CR2 enthält18 Module plus Erde/Kies/Stein/Fels/Schnee-Varianten. Die Quellen liefern Material-/Endsprache und Übergangslogik, aber keine durchgemessenen finalen Treppen-, Trittstein-, Holzbrücken- oder Aussichtsplattform-Adapter. Keine fiktiven Kits, Maßwerte oder Car-Freiräume aus dem Bild. Trail-Routing und enge Steps vs skin-unabhängige Fahrzeuge bleiben ausdrücklich zu klären.

**TC1-Tunnel:** J15/J16 `tunnel-clay.tc1.js:13–16` liefert stone_arch und stone_rect, Portalsteine und gerippten Innenraum. Tatsächliches vorhandenes TC1-v3-Blatt betrachtet. Historische Innenmodul-Cadence8m→11,68lab ist Source, nicht Portallänge für jede CR-Szene. Materialrollen wall/stone=rock, rib=tower1, key=tower0, head=hill1, mound=hill0; Ring/Form aus Stream. Profil und Look sind unabhängig, Georg wählt sie im Lab. Keine Gehweg-Passage aus einem Road-Ring-Freiraum-PASS erfinden.

Stützmauern: V-105-Mauerfamilie/RKIT-Mauern, MOUNTAIN retaining-Rolle; tatsächlich vorhandene KayKit-wall/fence Descriptoren als **Kandidaten** in [WALL_FENCE_SOURCE_CANDIDATES.json](WSA_TRACK_MODULE_LOOK_SPEC_R2/WALL_FENCE_SOURCE_CANDIDATES.json). Keine Source-Isolation/Abmessungs-/Grounding-Abnahme behauptet. CR3-Inselboden bleibt eine zusammenhängende Erdmasse, keine angeklebten Felskugeln; V-152 ist Formregel, kein WSA-Neubau.

## 5 · cosmic (CS3) — nur Quellenliste

| Vorhandene Quelle | Belegt | Nicht daraus entschieden |
|---|---|---|
| RKIT-S2 COSMIC | mag-Palette/Familie und reservierter node.skin, nach Katalog | finaler Cosmic-Look, Energie-Kantenform |
| Lab Sky_Host:22–46 | TinySkies/Travel/Spindle im vorhandenen Environment-Owner | zweiter Sky-Owner, Cosmic-Palette |
| RollerCoaster-v11 glowOf:73, energy-conduit comments:758 | Source-Neon/Glow-Möglichkeiten | kopierte Intensitäten/Schienenlook/Stützen |
| Joyride TC1:74,124–125 | Emissionslampen/-bänder im Source-Tunnel | Energie-Wand am Straßenrand |
| bestehende Sky_Presets | vorliegende Tages-/Nachtprofile | neue Cosmic-Lichtabnahme |

Für alle16 CS3-Module + Beispiele: gleiche Source-Inventarliste, **colorRoles/materialLayers leer, Status SOURCE_INVENTORY_ONLY**. Georg bestimmt Look. Keine Cosmic-Stützen, Anti-Grav-Nasen oder Ersatz-Glow-Geometrie hergestellt.

## Weitere TD1/TD5-Module
Geraden Standard/breit/kurz,45°/90°,S/Haarnadel/Schikane: native J17-Seitenform auf tatsächlichem Core-Modul; keine Rasterlänge/Radius geraten. Kurven-Kerb innen am engen Scheitel, Radius-Vorschlag RKIT; V-150 #4 Bandenoperation innen/außen bleibt offen, R1-Krümmungslook ist keine Freigabe dieser Operation.

Arrows nur ENTRY/EXIT/FORK/JOIN bzw. Kreisel-Ausfahrt, race ohne Fahrspuren (#1). Offenes Ende nur Startaufstellung/Baustelle, runder Source-Bandenkopf (#2). Boxengasse aus PIT-LANE/Source-Wand/Gore, nicht gebastelte Zweitstraße. Mini-Kleeblatt2 Ebenen, kreuzungsfrei, Radius≥8 (#18), Phase E. Versetzte Kreuzung≥Autolänge+Warteraum, RKIT misst (#19); Multilevel mehrere vorhandene Knoten (#20). Keine Macro-Eigengeometrie.

## Unklarheiten / Prüfung / Übergabe
[19 Bild-/Stellen-Fragen](WSA_TRACK_MODULE_LOOK_SPEC_R2/AMBIGUITIES_V148.json), einschließlich weiterhin offener #4, Haifischzähne, gemischter Kurvenverbinder, Leitplanke/Zaun, Berm35°-Vorschlag, trail-Adapter, Cosmic-Energie/Stützen. V-150-Beantwortetes wird nicht nochmals ungeklärt gemacht: Fragen kennzeichnen nur zusätzliche Form-/Maß-/Source-Details. Positionen über Bild-ID + nummerierte Kachel/benannten Hero-Bereich, keine neuen PNGs.

[VALIDATION_R2.json](WSA_TRACK_MODULE_LOOK_SPEC_R2/VALIDATION_R2.json): Schema, eindeutige IDs, vollständige nummerierte Blattzuordnung, Source-Zeilen/Hashes, Maßumrechnung und Cosmic-Nichtfestlegung. [SEARCH_PROTOCOL_R2.json](WSA_TRACK_MODULE_LOOK_SPEC_R2/SEARCH_PROTOCOL_R2.json) baut auf dem R1-V140-Protokoll auf und dokumentiert zusätzlich aktuelle RKIT-Reports/Lauf03/B7/S4/Sky-Quellen. RKIT-Core-Tests sind nur gemeldeter Bestand, nicht von WSA erneut ausgeführt. Lab-src-Schreibvorgänge0, keine Parity/Fahr-/Render-Abnahme in dieser Recherche.

Nächster Gate: Steuerung prüft R2 und beantwortet/verteilt V-148-Liste; RKIT/Lab binden Source-Look an tatsächliche MODULES-Schnitte und bauen nach ihrem Plan. Kein Golden oder Merge.

## Vorhandene Originalblätter (keine neuen R2-Bilder)

- [TD1](REFS_TRACK_DETAILS_2026-10-11/TD1_race_kit_kernmodule.png)
- [TD2](REFS_TRACK_DETAILS_2026-10-11/TD2_street_kit.png)
- [TD3](REFS_TRACK_DETAILS_2026-10-11/TD3_dirt_offroad_kit.png)
- [TD4](REFS_TRACK_DETAILS_2026-10-11/TD4_uebergaenge_rampen.png)
- [TD5](REFS_TRACK_DETAILS_2026-10-11/TD5_fortgeschritten.png)
- [CS1](REFS_CITY_STREETS_2026-10-11/CS1_inselstrassen_bord_gehweg.png)
- [CS2](REFS_CITY_STREETS_2026-10-11/CS2_landstrasse_schotter.png)
- [CS3](REFS_CITY_STREETS_2026-10-11/CS3_cosmic_highway.png)
- [CR1](REFS_COUNTRY_TUNNEL_2026-10-11/CR1_bergschotter.png)
- [CR2](REFS_COUNTRY_TUNNEL_2026-10-11/CR2_fusswege_wanderpfade.png)
- [CR3](REFS_COUNTRY_TUNNEL_2026-10-11/CR3_berginsel_gesamt.png)
- [CR4](REFS_COUNTRY_TUNNEL_2026-10-11/CR4_landstrasse_kit.png)
