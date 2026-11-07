# Slop-Motion-Lane R2 · Librarian-Quelle / Royal-first

06.11.2026. Neue Georg-Steuerung: registrierte freigestellte Librarian-Slops als Eingang verwenden; zuerst königlich/Elite/Veteranen lesbare Figuren, danach breiter werden. Diese visuelle Priorität setzt keine neue Kampfstufe oder Trefferzahl. Bildproduktion und Motion-Produktion erhalten getrennte Queues und Arbeitskontexte, aber dieselben Quell-Asset-IDs.

## Aufgelöste Eingangshürde

Der KFB Asset Librarian, Site `appgprj_6ac1afef08148191b62b95f184bf845e`, wurde in Version55 geöffnet. Direkte MCP-Abfrage ist nicht deklariert, D1-Tabellen sind nicht vorhanden; die Oberfläche und der dort verlinkte GitHub-Donor wurden read-only geprüft. Keine Site-Änderung/Neuveröffentlichung.

Konkreter Startdonor: **King Ultimately**, Librarian-ID `slop-source:WSA_PHILOSOPHY_DUNGEON_ACTOR_20261106_04`. Quelle `georg-doc/KFB-Stunt-Car-Race`, Ref `51fd8e457711f28ec877545289a45fe88180ac7f`, Datei `75_REFS/WSA_ASSET_INTAKE/EXPANSION_2026-11-06_R2/slops/png/WSA_PHILOSOPHY_DUNGEON_ACTOR_20261106_04.png`. UI: Gestaltung PASS, PNG geprüft, Golden Sample. Der Quell-Download wurde als Einzelobjekt gesehen und gehasht.

Motiv-Bounds451×511px, tatsächliche PNG455×515px mit je2px Rand, RGBA alpha0..255. SHA256 `aa5768edbfd7925c05fb2cc89bc49863fb3cb9eacd68ef0b4ad074cd4d0b0f1c`. Git-Blob `bee2e8d327a405c38b6428407235efe10d66b327`. Damit ist eine verifizierte registrierte Designquelle vorhanden. Die offene Runtime-/Roster-ID ist **kein Hindernis für Motion-Generierung**; sie wird erst für konkrete Game-Zuordnung benötigt. Der R1-Plan wird hier entsprechend präzisiert. Es ist nicht nötig, ein schon registriertes Motiv noch einmal neu zu zeichnen oder freizustellen.

Der König wurde hier nicht heruntergerechnet. Ein zukünftiger576×576-Animationsrahmen könnte die vorhandenen Motivpixel plus Sicherheitsrand aufnehmen. Daraus folgt keine Aussage, dass alle früheren Könige/Queens gleich groß waren oder alle Exportversionen dieselben Maße haben. Ihre konkrete Master-/Sprite-Version jeweils messen. Eine eindeutig zugeordnete Königin wurde in den zwei Namenssuchen queen/Königin mit Slopfilter noch nicht gefunden; keine beliebige Figur als ihre Identität ausgeben.

## Tatsächlicher Fähigkeits-Pilot dieses Chats

Ein nativer referenzgestützter Aufruf verlangte exakt diese Identität als transparenten6Frame-GIF-Blink mit220ms/Frame, festem Rahmen/Anker und geschützten Props. Ergebnis: **PNG,1254×1254,ein Frame**. Keine GIF-Datei und kein Motion-PASS. Keine Reparatur- oder Wiederholungsjobs. Diese Ausgabe wird nur lokal als nicht ausgewählter Fähigkeits-Test aufbewahrt; weder als neue Identität noch als animierte Variante registriert. Quelle blieb unverändert. Aufruf und Messung: `KING_GIF_PILOT_ARGS.json`, `KING_GIF_CAPABILITY_RESULT.json`.

Ein gespawnter Agent erbt nicht automatisch eine andere Generierungsfähigkeit. Für den weiterlaufenden Batch deshalb einen tatsächlich GIF-fähigen Web-Chat oder einen eingerichteten, explizit gewählten Image-API/CLI-Adapter verwenden. Die [offizielle GIF-Dokumentation](https://developers.openai.com/api/docs/guides/image-generation#generate-animated-gif-output) ist eine Schnittstellenreferenz, kein Nachweis, dass dieser native PNG-Toolpfad GIFs liefert. Es wurde kein API-Key gelesen/angefordert und kein CLI-/API-Generierungslauf begonnen. Der CLI-Weg setzt eingerichteten `OPENAI_API_KEY` voraus und wird nicht stillschweigend als Fallback gestartet.

## Vorhandenen Piraten-Pilot wiederverwenden

Race-Zweig `assets/slop-anim-pilot-r1`, Head `3746e3563ec326989c8da64e5b989a4d427bf163` enthält:

- `slop_anim_r1/pilot/pirat_bruellen_loop.gif`
- `slop_anim_r1/pilot/pirat_bruellen.atlas.json`
- `slop_anim_r1/pilot/pirat_bruellen.atlas.png`
- `slop_anim_r1/pilot/pirat_bruellen.sdf.png`

Das GIF ist bytegleich mit beiden lokalen Piraten-GIFs:560629Bytes, SHA256 `acbaa492cc350ec893f133949cce22c45959a38590d2f96d0f02940324ef687a`, Git-Blob `12b7bddeadd9c56699ed3a8d638eb069ded13037`. Manifest `kfb.slop-anim/1`:6Frames,4.17fps,3×2Atlas1461×1006, Zellen487×503, `sdf_max=12`. Das Manifest enthält noch keine Librarian-/Roster-ID. GIF→Pilot ist bewiesen; GIF→konkretes registriertes Einzelmotiv weiterhin zuzuordnen. Bestehenden Piloten prüfen/ergänzen, keinen konkurrierenden Animationsrenderer anfangen.

## Outline, weiße Ränder und Master

Der read-only Prüf-Agent hat den vorhandenen Mechanismus belegt: Race `fx/inkline2d-atlas-r1`, Head `38da5bc68eb37cf7372e591b12f9daa3e90a2881`, `src/modules/bildparallel.js`. SDF = Signed Distance Field; `fwidth` hält die Kontur in Bildschirm-Pixeln adaptiv. Das ist nicht bloß ein fester Abstandsfaktor. `test/slopSdfBacken.mjs` kann separate SDF-Texturen vorbereiten; keine schwarze Kontur muss in die Farbquelle gebrannt werden.

Weiße Randlichter und kontaminierte Pixel sind getrennt: `mobs2d.js` schaltet den künstlichen Light-wrap aus. Ein neuerer `kfbInsert.js`-Pfad mit `wrap:false` besitzt zusätzliche helle-Rand-Heuristiken, wird im geprüften Slopmaterial aber nicht so aufgerufen. Keine pauschale Behauptung, dass alle weißen Pixel automatisch entfernt werden. Weiß der Augen, Zähne, Buchseiten, Edelsteine und Bandagen schützen. Details und exakte Parameter stehen im beigefügten `OUTLINE_SOURCE_AUDIT_R1.md`.

Saubere RGBA-Frames bleiben Quelle; passender SDF-Atlas separat und mit identischen Frame-Rechtecken. Im Spiel vorhandenen Outline-/Instancing-Pfad weiterverwenden. Für einen GIF-Review darf eine eigens bezeichnete Kontur-Vorschau entstehen; Licht/Noise-Phase/Exportgröße dann fixieren und ausreichend Rand lassen. Diese Ableitung ersetzt den sauberen Master nicht. Spiel-Bounce und expressive Mimik nicht doppelt als Körperwippen aufaddieren.

## Registrierung der Animation

Vorschlagsvertrag, auf die vorhandene Registry-/Variantenstruktur abzubilden: `parent_asset_id` exakt die registrierte Slop-ID, `relation=animated_variant_of`, Quell-PNG-Hash, Motion-ID/Version, Intent, GIF-Hash/Frames/Timing, optional Frame-/SDF-Atlas samt Rechtecken, gemeinsamer Root-Anker. Georgs Motion-PASS, technischer QA-Status und Runtime-Status getrennt. Vorhandene Standbild-Identität und Backstory behalten; keine neue Person und kein voreiliger Boss-Tier.

Nach tatsächlicher Loop-Abnahme die neue Darstellung über den bestehenden Registry-Writer/Librarian-Export eintragen und die veröffentlichte Variante prüfen. Direkte Schreibregistrierung über die Site wurde in diesem Chat nicht entdeckt und wird nicht behauptet. Ein Quell-PR allein ist keine sichtbare Librarian-Animation.

## Auftragsteilung ohne Unterbrechung der Bildlinie

Dieser Chat bleibt visuelle Art-Direction und Quelle neuer Slops. Ein eigener dauerhafter Motion-Work-Chat ist für Batch-Fortschritt, Kandidatenabnahme, Registration und WS1-Rückmeldung sinnvoll; kleine Prüf-/Aufbereitungs-Agenten können hier zugespawnt werden. Ein solcher read-only Prüf-Agent wurde bereits eingesetzt. Es wurde kein separater nutzereigener Work-Chat angelegt und kein unbeaufsichtigter GIF-Generator gestartet.

Der Motion-Worker liest `ANIMATION_QUEUE_R2.json`, beginnt mit dem verifizierten King Ultimately und weist den GIF-fähigen Kanal an einem einzigen Loop nach. Danach Königin identifizieren und gemischt sechs Royal/Elite/Veteranen-Designs prüfen. Nur aus tatsächlich vorhandenen IDs auswählen. Weitere Serien folgen nach Motion-Abnahme; Fehler proJob parken, nicht die neue Bildlinie stoppen. Ein Integrator schreibt Register/Quellen; keine konkurrierenden Site-Publishes.

Nächster Übergang: Ausführung des bereitliegenden König-Jobs in einem nachweislich GIF-fähigen Kanal, anschließend QA/Motion-Abnahme und Rückregistrierung unter derselben Asset-ID. Kein weiteres Warten auf die bereits vorhandene Librarian-Identität.
