# WORLD-TRACK-DRIVE-CLAY-M2 · echte Strecke + drei Reisemodi

## Executor

**Work · Sol High**. Astra nur, falls nach einem eng begrenzten Sol-Pass ein echter Cross-Repo-Owner-Konflikt übrig bleibt.

## Eingänge

- World Mobility M1: PR `#249`, Head `40037597485436e185f129091be908786925341d`
- Hirnwelt-H0 Runtime-Integration: `52027a5d4701e284b49e5b9b106ce18596050de8` · 43/43 Paket + 40/40 Browser PASS
- M1 publication evidence: `cloudflare-live@e10745def24c1dde96ef36b474cea0b90dc1b237`; die feste Route fällt derzeit auf die allgemeine Website zurück und ist **kein** akzeptierter Testlink
- World r2 Runtime: `58028b07d7618926c40ffaec3bd4053dc88c0efd`
- Travel Modes 01 Runtime: `f5ea32f817403cda0e30a426e70f37db8ce03d66`
- Race/Track-Owner: aktueller GitHub-Stand von `georg-doc/KFB-Stunt-Car-Race`
- Track-Core-Akzeptanzszene: Race PR `#42`, `chat/rkit-11-rhein-run-2026-09-26@bcc422b00fc4629ac113f086cddcea3b2b107f2a` — eingefrorene Acceptance Scene, nicht selbst der neue Runtime-Owner
- bewiesener Drive-/Deformer-Donor: Race PR `#10`, `wsa/osm-city-drive-c1-deformer-2026-09-19@406cd26f44f22811fe3b3a58776839be7ffb7b2c`
- Vehicle-Deformer-Quelle: `tools/KFB-ToolBox/_inbox/KFB Cartoon Vehicle Deformer Lab v2/WSA_Vehicles_v2_2026-09-18/lab-v7/vehicle-cartoon-deformer.v2.js`
- Interaction-Vertrag: `tools/production_desk/briefings/WORLD_INTERACTION_E_V1_2026-09-27.md`
- Clay-ChatterBox-Sidecar: `tools/production_desk/briefings/CLAY_CHATTERBOX_PRESENTATION_D0_2026-09-27.md`
- Billboard-/Public-Domain-Modul: `tools/production_desk/briefings/WORLD_BILLBOARD_PUBLIC_DOMAIN_W1_2026-09-27.md`
- Credits-/Creator-System: `tools/production_desk/briefings/KFB_CREDITS_ATTRIBUTION_EXPERIENCE_V1_2026-09-27.md`
- Track-Core-W0-Brief: `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/WEBCHAT_TRACK_CORE_0_CENSUS_CONTRACT_BRIEF.md`
- akzeptierter Style-Donor: `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
- Style-Module: `lab-clay/clay-soften.v1.js`, `clay-material.v4.js`, `clay-relief.v2.js`
- Style-Anleitung: `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`

GitHub-Stand unmittelbar vor dem Bau erneut prüfen. Der Race-Owner darf nicht durch eine WorldBuilder-Ersatzstrecke ersetzt werden.

## Ziel

In derselben Hürth-/Clay-Welt eine echte, vom Race Track Core gelieferte Strecke und eine zusammenhängende **KlayfaBizarro-Stadtzelle** laden. Die Welt ist danach in drei Reisemodi wirklich spielbar: **zu Fuß, im freien Flug und mit einem bewiesenen Fahrzeug**. Wasser bleibt ausdrücklich außerhalb dieses MVPs. OSM liefert grobe Architektur und Anschlusspunkte; ein guter Chill-&-Fun-/Stunt-Verlauf ist wichtiger als sklavische Kartentreue.

H0 ist Georgs akzeptierter Look-Donor und in M1 bereits als echtes Material/Relief integriert. Nicht neu nachbauen und nicht durch ein anderes Clay-System ersetzen. KayKit-Häuser bleiben Quellmodelle; die noch fehlende physische Fassaden-/Straßenform entsteht offline oder einmalig gecacht, nicht in einer 40-Sekunden-Laufzeit-Vorstufe.

## Kleinstes spielbares Ergebnis

- M1 Ground/Flight und den integrierten Hirnwelt-H0-Look unverändert weiterverwenden;
- genau ein echtes Track-Rezept über dessen Source-/Runtime-Vertrag laden;
- genau ein bewiesenes Fahrzeug aus dem vorhandenen Race-/Free-Roam-Pfad anschließen; weitere Modelle sind additive Testkandidaten und blockieren den Kernloop nicht;
- World bleibt Boden-/Kontakt-Owner, Race/Free Roam bleibt Fahrphysik-Owner, Vehicle Deformer bleibt reine Darstellung;
- `E` ist die einzige semantische Kontextaktion: zu Fuß fokussiertes Fahrzeug betreten, im Fahrzeug aussteigen, beim Resident ChatterBox öffnen, bei Props/Portalen deren vorhandene Aktion auslösen;
- die sichtbare `E`-Einladung nennt immer das konkrete Ziel; keine unsichtbare globale Prioritätsliste entscheidet zwischen dicht beieinanderstehenden Residents, Autos und Props;
- Einstieg: Figur hüpft kurz zum Fahrzeug, Fahrzeug duckt/squasht cartoonig, danach übernimmt Drive; Ausstieg: Fahrzeug duckt sich und spuckt die Figur auf einen vom World-Owner bestätigten sicheren Bodenpunkt aus;
- der Übergang besitzt keine erfundene Tür und keine neue Physik. Während der kurzen Übergabe sind Bewegung und erneute Interaktion gesperrt; bei Abbruch wird der letzte gültige Zustand wiederhergestellt;
- vom Freiraum über eine echte Auf-/Abfahrt auf die Strecke fahren und wieder in die Stadt zurückkehren;
- mindestens eine echte Billboard-/Monitor-Fläche in der Stadtzelle montieren: akzeptierter B2a-Körper, extrahierte H4-Kompositionsengine und ausschließlich die vier bereits verifizierten Public-Domain-Pool-Objekte als erster sicherer Medienbestand;
- dieselbe Fläche kann einen `CREATOR_KUDOS`-Modus zeigen; ein verwendetes besonderes Landmark darf daneben eine kleine, mit `E` lesbare Ausstellungstafel erhalten. Beide Ansichten stammen aus demselben Credit-Manifest und formulieren keine Lizenzangaben von Hand;
- mehrere bereits definierte Track-Breiten sichtbar behalten;
- Track-Anfang, Track-Ende und spätere Anschlussstellen explizit markieren;
- unterschiedliche Gebäudehöhen bleiben erhalten;
- eine gebundene Stadtzelle enthält Fahrbahn, helle Knet-Bordsteine mit rhythmischen Fugen, einen abgesetzten Gehweg und den Übergang zu Grün/Hauseingängen;
- Zebrastreifen und Straßenmarkierungen nutzen dieselbe Knet-Materialfamilie, nicht flache fremde Decals;
- KayKit-Gebäude zeigen die H0-Fassadenwirkung mit integrierten, leicht verformten Fenstern und Türen;
- drei Reliefmaßstäbe: grob/kerbig für Häuser und große Flächen, mittel für Terrain/Straße/Gehweg, fein für kleine Props und Figurenmaterialien;
- vom Flug aus Strecke, Gebäude, Fahrzeug und Terrain gemeinsam beurteilen;
- zu Fuß starten → mit `E` ins Auto → frei fahren → Rampe auf den Track → Track verlassen → mit `E` aussteigen → weiterlaufen → per Doppeldruck in Flight → sauber auf Ground zurückkehren;
- zu Fuß keine gefalteten, schwebenden oder unpassierbaren Track-Flächen;
- keine Fahrzeugphysik neu erfinden: Drive wird ausschließlich über den echten Vehicle-/Track-Owner aktiviert.

## Nicht erlaubt

- kein schwarzer/faltbarer Proxy;
- keine handgebaute Ersatzschleife nur für einen Screenshot;
- kein zweiter Kamera-, World-, Track- oder Fahrphysik-Owner;
- kein Fahrzeugauswahlzwang für alle 61 Modelle im MVP und kein einzelnes fehlerhaftes Fahrzeug als Blocker;
- keine Türanimation oder fingierte Tür-Geometrie;
- kein zweites Interaktionssystem neben der semantischen `INTERACT`-Aktion;
- keine der 33 ungeprüften H4-LoC-Platten in einer öffentlichen Runtime und kein iframe als vermeintliche CanvasTexture-Integration;
- `E` ersetzt weder Springen noch den vorhandenen Ground↔Flight-Intent;
- kein neues Test-Dashboard im Sichtfeld;
- kein Georg-Gate auf technische Tabellen oder unfertige Maßstabsobjekte.
- keine 40-Sekunden-Laufzeit-Vorstufe als Produktionsweg: wiederverwendete Haus-/Straßengeometrie offline oder einmalig cachen/baken;
- keine Geometrie-Vorstufe auf SkinnedMesh-Figuren;
- keine Holzmaserungs-Höhenlinien, Cord-Fingerzüge oder vollprozeduralen Großflächen, die im H0-How-to ausdrücklich verworfen sind.

## Prüfung

- Owner-/Quellenprüfung;
- Desktop + schmale Ansicht;
- Ground → Flight → Ground;
- Ground → `E` Enter → Drive → Rampe/Track → Freiraum → `E` Exit → Ground;
- Interaktionsfokus mit dichtem Resident/Fahrzeug/Prop-Aufbau: sichtbares Ziel und ausgeführte Aktion müssen übereinstimmen;
- Ein-/Ausstieg mehrfach wiederholen: keine doppelte Figur, kein doppeltes Fahrzeug, keine verlorene Kamera und kein falscher Bodenpunkt;
- Original ↔ Clay;
- Track-Geometrie finite, begeh-/überfliegbar und ohne grobe Gebäude-/Bodenüberschneidungen;
- Pixelbelege Totale, Straßenhöhe und Flugansicht; Materialmaßstab muss in allen drei Entfernungen lesbar bleiben;
- Ladezeit und Bildrate vor/nach Offline-/Cache-Pfad dokumentieren;
- 0 Seitenfehler, 0 fehlgeschlagene Runtime-Assets;
- direkte Stage erst nach echtem Browser-PASS.

## Stop

Stop bei einem spielbaren Track-in-World-Kandidaten mit einer glaubwürdigen KlayfaBizarro-Stadtzelle und dem vollständigen kleinsten Reise-Loop **Walk → Drive → Track → Walk → Flight → Walk**. Reaktive Knetwelt, Wasser, Fahrzeugkatalog, OSM-Korridor Hürth→Köln und Track-Editor bleiben additive Nachfolger.

## Nicht blockierender Design-Sidecar

Das neue Clay-Speech-/Thought-Bubble-Design darf parallel als isolierter visueller Donor entstehen. Es ersetzt nur die Darstellung der vorhandenen ChatterBox, niemals Dialogzustand, Memory, Resident-Owner oder Interaktionslogik. Sein Fehlen blockiert den Travel-MVP nicht; bis zur visuellen Abnahme bleibt die vorhandene ChatterBox-Darstellung aktiv.

Auch das Billboard-/Pool-Modul läuft als klar quarantinierbarer Umweltbaustein innerhalb desselben Produktionsslices. Es soll in der Welt sichtbar funktionieren, darf aber bei einem isolierten Medien-/CORS-/Performance-Fehler nicht den Travel-Kernloop blockieren.
