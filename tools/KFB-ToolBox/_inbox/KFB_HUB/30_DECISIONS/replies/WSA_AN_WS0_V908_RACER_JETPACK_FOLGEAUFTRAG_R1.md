# WSA → WS0 · V-908 Folgeauftrag · Zwei Fahrzeugstimmen + ein Jetpack · R1

Datum: 28.10.2026
Status: GRUNDKONZEPT UND SCHNITTWEISE DURCH GEORG FREIGEGEBEN · AUSFÜHRBARER INTEGRATIONSAUFTRAG
Dieser Stand enthält auch Georgs anschließende Jetpack-Ergänzung. „BS null“ wird im Zusammenhang als WS0 verstanden.

## 1. Entscheidung und Ergebnis

Georg hat die Hörproben positiv beurteilt und Grundkonzept sowie Schnittweise freigegeben. Keine erneute Einzelabnahme aller 46 Originale oder aller 21 Schnitte verlangen. Das ist keine Behauptung, jede bisher nur vermutete Rolle sei bereits korrekt identifiziert: Der ausführende Audio-Builder prüft die tatsächlich verwendeten Kandidaten auf Eignung. Unsichere Schalt-/Reifen-Kandidaten bleiben aus der ersten Integration draußen; dafür vorhandene bewährte Ereignisse verwenden. Der Vergleich OHNE den noch nicht vorhandenen Satz engine_georg_r1 (V-903) ist ausdrücklich freigegeben.

Ergebnis dieses Folgeauftrags:
1. Zwei bestehende, deutlich unterschiedliche Fahrzeuge mit eigener Dauerschichtung und separat ausgelösten Ereignissen IM SPIEL vergleichen.
2. Danach EINEN vorhandenen Jetpack-Typ als eigenständiges Klangprofil für einen Haupt-Locomotion-Modus abstimmen und im Spiel prüfen.
3. Erweiterte, anwendbare Recherche zu Racer-/Flug-Sounddesign liefert konkrete Kurven und Auslöser; kein bloßer Linkkatalog und kein neues Audio-System.

Dieser Auftrag ist auch hier in WSA/Codex ausführbar. In der vorliegenden Planungsrunde werden Auftrag/Freigabe gesichert, noch keine Spieländerungen oder ElevenLabs-Generierungen ausgeführt.

## 2. Owner, Ausführung und geschützte Grenzen

- Produkt-/Integrationsowner: WS0, georg-doc/KFB-Stunt-Car-Race, bestehender Spielstand game/proc-world-ws0.
- Audio-Assets und Sounddesign: bestehender KFB Audio/WSA-Owner; Assetbranch assets/kfb-audio-r1.
- Ausführungsvarianten: WS0 integriert direkt; alternativ kann dieser WSA-Chat den benannten Builder auf einem isolierten Review-Branch vom aktuellen WS0-Spielstand übernehmen. Vorgeschlagener Review-Branch: work/wsa-v908-racer-jetpack-r1. Vor Beginn aktuelle parallele WS0-Arbeit prüfen, ein benannter Produktionsschreiber pro Seam; keine konkurrierenden direkten Writes auf game/proc-world-ws0.
- WSA kann insbesondere die Recherche, Schichtzuordnung und Jetpack-Audioslice übernehmen. WS0 bleibt Owner der Spielzustände, Physik, Kontakte und finalen Übernahme.
- Bestehender AudioContext, Mixer, Busse, Ducking, Listener und Host-Takt bleiben erhalten. Keine zweite Engine, kein neuer Transport, keine parallele Fahrzeugphysik oder neue Spiel-/Audio-Site.
- Bestehenden Spiel-Testhost und seine aktuelle private Abnahmefläche vor Umsetzung aus WS0-Ownerstand bestimmen. Lokaler HTTP-Test ist Entwicklungsevidenz; nicht als öffentliche Abnahme ausgeben. Keine neue Stage-URL erfinden, keine Live-Promotion/kein Auto-Merge.
- Keine Rohdateien löschen, keine kostenpflichtige Bibliothek kaufen oder neue ElevenLabs-Aufrufe ohne entsprechende Ausführungserlaubnis. Bestehende Herkunfts-/Nutzungsnachweise beibehalten.

INDEPENDENT EXECUTION bei produktiver Ausführung: Builder/Integrator = benannter einziger Produktionsschreiber; Integration Tester = Messung/Regression; Independent Critic = unabhängige Beurteilung; Production Guard = Weiterarbeit/Reparatur/Quarantäne/Stop nach bestehendem KFB-Vertrag. Keine automatische Selbstabnahme durch den Builder. Georg entscheidet anschließend über das Fahr-/Fluggefühl, nicht über jede Datei. Referenz: skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md.

## 3. Read first und vorhandene Grundlage

Aktuelle GitHub-Versionen von START_HERE, CHAT_GITHUB_KFB_STAGE_WORKFLOW, FRESH_CHAT_SLICE_PROTOCOL lesen; anschließend aktiven WS0-Auftrag/Return, tatsächlichen Branch-Head und betroffene Module. Die historischen Root-Pfade MASTERPLAN.md und RECOVERY.md lieferten auf game/proc-world-ws0 beim Briefing 404; nicht als vorhandene SSOT behaupten. README.md ist vorhanden; aktuelle WS0-Owner-/Recovery-Angaben im Register ermitteln.

- V-908-Paket: media/kfb-audio/r1/el/drive_georg_r2/ auf assets/kfb-audio-r1; RETURN.md, manifest.json, source_inventory.json, drive_georg_r2.mapping.json, validation.json.
- Audio-Commit der 21 Kandidaten: f38d7e382fed488ebf9ba802f49b81645f39921c; spätere Freigabe ohne V-903: c01ead2b8660602d856bcb2dae023b657711b1b9. Vor Umsetzung aktuelle Heads lesen.
- Dropbox: ~/Dropbox/CLAUDE/KFB_HUB/40_AUDIO/elevenlabs_r1/drive_georg_r2/HOERPROBEN.html.
- Spiel: src/audio/engineVoice.js, engineLayers.js, cueMap.js, kfbAudio.js und tatsächliche Fahrzeug-/Jetpack-Telemetrie.
- Bestand: engine_r2, engine_v8_r2, vehicle_feel_r1, vorhandene Drift-/Oberflächenklänge und bestehender Racer/Flight-Consumer. V-893-Lade-/Cache-Fixes erhalten.
- Recherchevorarbeit: PR #457, research/kfb-racer-dieselpunk-spatial-audio-r1-2026-10-28, tools/KFB-Audio-Site/research/INTEGRATION_BRIEF_R1.md und Begleitdateien. Vorhandenes Flight-Profil jetpack zuerst prüfen; kein Neubau ohne belegte Lücke.

## 4. Etappe A · zwei Fahrzeuge, gleicher nachvollziehbarer Vergleich

Startauswahl aus vorhandener ENGINE_PRESETS/VEHICLE_SOUND-Zuordnung:
- crimson_flame_dragster → dragster: tiefer, körperlicher, unregelmäßiger Motorcharakter.
- iron_phantom_hovercar → hover: leichterer mechanischer Kern mit Turbinen-/Schwebeschicht, keine erfundene Reifenreibung.
Aktuelle Spawn-/Spielverfügbarkeit prüfen. Wenn ein Modell nicht erreichbar ist, ein tatsächlich vorhandenes Fahrzeug desselben kontrastierenden Presets nehmen und begründen; kein neues Fahrzeugmodell bauen.

Je Fahrzeug zunächst 2–3 gleichzeitig aktive Hauptschichten, maximal sechs neue Loops inklusive Übergängen: Körper, Last/Biss und eine charakteristische Zusatzschicht. Varianten auswählen, nicht alle gleichzeitig stapeln. Derselbe Motorkern bleibt über Manöver erkennbar. Drehzahl steuert behutsam Tonhöhe/Überblendung, Last steuert Intensität und Klangfarbe; Geschwindigkeit ist kein Ersatz für RPM. Vorhandene R2-Gitter und deren Schalt-RPM-Verlauf erhalten. Cockpit ist eine Perspektive desselben Fahrzeugs, keine zweite voll laute Engine.

Ereignisse getrennt vom Dauermotor:
- Gangwechsel nur bei realem Gangwechsel des entsprechenden Fahrzeugs, exakt einmal; kurzer Lastabfall plus Schaltakzent. Keine Zahnräder für einen gearlosen Hover-/Flugantrieb erfinden.
- Reifenansatz bei Überschreiten der bestätigten Schlupfschwelle; Schleife nur bei Bodenkontakt und tatsächlich vorhandenen Reifen. Driftwinkel, Längsschlupf, Geschwindigkeit und Untergrund getrennt betrachten. Hover benutzt vorhandene Boden-/Luftinteraktion.
- Gaswegnehmen/Fehlzündung nur aus passendem Lastwechsel-/Motorzustand. Kein Zufalls-Knall bei jedem Frame.
- Anschlag/Körper/Ausklang nur trennen, wenn die Quelle dies hergibt. Zusammengeschnittene Mischklänge nicht als sauber isolierte Komponenten ausgeben.

Erst vorhandene sichere Events nutzen, neue Kandidaten gezielt ergänzen oder ersetzen. Bei gleicher Funktion alter ODER neuer Sound; keine unbemerkte Doppelwiedergabe. Mapping pro Fahrzeug mit konkreten Dateien, Gains, Kurven, Bedingungen und ersetzten Bestandsquellen aktualisieren.

## 5. Timing-/Trigger-Vertrag

Die folgenden Zahlen sind Startwerte zum Testen, keine gemessenen Wahrnehmungsgrenzen oder pauschal freigegebenen Endwerte:
- Laufende Parameter geglättet: Last ca. 50–100 ms, RPM ca. 80–150 ms; Schubaufbau kann träge, Schubabbruch deutlich schneller sein. Bei setTargetAtTime ist die Zeitkonstante nicht die gesamte Übergangsdauer.
- Loop-/Moduswechsel typischerweise 100–250 ms überblenden; Leistungssumme und korrelierte Quellen auf Pegelanstieg/Phasenauslöschung prüfen.
- Drift-Hysterese z. B. Einsatz >8°, Ende <5° bei >4 m/s als Ausgangspunkt für das passende Radfahrzeug. Einheit/echte Physikdaten prüfen, Grenzen im Spiel abstimmen; keine erfundenen Host-Fakten.
- Ein Ereignis pro Zustandskante/Event-ID; Varianten ohne unmittelbare Wiederholung, kleine begrenzte Tonhöhen-/Lautheitsvariation. Cooldown dient nur gegen Duplikate und darf echte schnelle Gangwechsel nicht verschlucken.
- Tatsächlichen Ereigniszeitpunkt auf den vorhandenen AudioContext beziehen; start(when) und AudioParam-Automation benutzen. Keine ungebremsten setTimeout-Ketten oder Musikbeat-Quantisierung für Fahrmanöver.
- Kurze Manöver nicht lange vorplanen. Stop/Pause/Fahrzeugwechsel/Respawn müssen alte geplante Events und Stimmen abbrechen. Kalte/verspätete Ereignisse nach bestehender Freshness-Regel verwerfen, nicht Sekunden später nachspielen.
- Formatgrenze schließen: aktueller set.ext-Lader unterstützt nur eine Endung pro Satz. Zwölf FLAC-Loops und neun MP3-Events haben explizite reale Pfade; pro-Clip-Endung rückwärtskompatibel oder separater homogener Ereignissatz. Alte Satz-URLs und Pegel erhalten. Keine doppelte −16-LUFS-Korrektur.

## 6. Etappe B · EIN Jetpack als Haupt-Locomotion-Modus

Jetpack als eigenes Klangprofil behandeln, nicht als beliebiges Auto mit Reifen stummgeschaltet. Wichtig für Flug/Manöver über OSM-Maps im Distraction-Slice. Der erste vorhandene und spielbare Jetpack-Typ bekommt eine bewusste Identität; weitere Typen bleiben Erweiterungspunkte. Wenn OSM dort noch nicht verfügbar ist: am vorhandenen Host prüfen und OSM-Nachweis offen benennen, keine neue Kartenintegration in diesen Audioauftrag ziehen.

Dauerschichten: mechanischer/energetischer Kern, Schub-/Düsenkörper, geschwindigkeitsabhängige Luftströmung. Passende bereits erzeugte Engine-/Flugquellen wiederverwenden; keinen schweren V8 unpassend erzwingen. Bodengeräusche/Reifen vollständig aus dem Luftpfad herausnehmen.

Zustände und Ereignisse aus echten Host-Fakten:
- aktivieren/abschalten, Schubbeginn, anhaltender Schub, Schubwegnehmen;
- Start/Abheben und Landen anhand tatsächlichem Kontakt, keine Landung beim bloßen Schubreduzieren;
- Steigen, Sinkflug, schnelle Richtungswechsel/Banking, Gleitflug: Luftstrom bleibt bei Bewegung auch ohne Motorschub;
- Boost/Overdrive: Eintritt, gehaltene Phase, Austritt; hörbarer Übergang, kein lauter Dauerzustand;
- Überlastung/Treibstoffwarnung nur, wenn solche Zustände bereits existieren; keine neuen Spielregeln erfinden.

Warp-/Slingshot-/Steampunk-Flugfarben als zweite Sounddesign-Ebene: mechanische Spannung, Druck-/Ventilanteil, Energieaufbau und Entladung aus passenden Aufnahmen. An echte vorhandene Fähigkeiten binden. Gibt es noch keine Warp-/Slingshot-Fähigkeit, nur Mapping/isolierte Hörstudie liefern, nicht einen neuen Bewegungsmodus oder unsichtbare Gameplay-Zustände hinzufügen.

Fehlende Sounds: WSA erstellt nach Bestandsprüfung eine kurze GAP-Tabelle für WS0, je Eintrag Funktion/Auslöser, Loop oder One-shot, Dauer, Start/Ende, benötigte Varianten, Innen-/Außenperspektive, Frequenz-/Maskierungsziel und kopierfertiger ElevenLabs-Prompt. WS0 kann die gezielten Lücken per ElevenLabs erzeugen. Kein weiterer 46-Dateien-Vorrat ohne benannten Bedarf; nicht fehlende Quellen durch unpassende Reifen-/Schaltgeräusche ersetzen.

## 7. Recherche · unmittelbar für die Umsetzung

Vor Integration eine kompakte Entscheidungsmatrix aus Primärquellen anlegen: Quelle + Datum/Version/Commit, konkret geprüfter Mechanismus, Demo/Code/Hörnachweis, Nutzbarkeit/Lizenz, KFB-Übernahme oder begründetes Nein. Dokumentation lesen ist kein Demo-/Hörtest. Zunächst diese geprüften Einstiegspunkte verwenden und gezielt um passende Primärquellen ergänzen:

1. Aaron Cendan, RX-7 Sim: https://www.aaroncendan.me/rx7sim ; Repo https://github.com/acendan/rx7sim ; Demo https://acendan.github.io/rx7sim/ . Reales aufgenommenes Fahrzeugmaterial in Three.js/Web Audio; nützlich für laufende Fahrzeugstimme und Perspektive. Repo nennt CC BY-NC-SA 4.0: zunächst Referenz, keine automatische Code-/Audioübernahme.
2. FMOD-Antwort zum Engine Designer: https://qa.fmod.com/t/about-the-engine-designer-and-its-parameters/15907 . Audition-Modell und echte Spielparameter unterscheiden; keine Middleware-Migration daraus ableiten.
3. MDN, AudioBufferSourceNode.start: https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start ; AudioParam.setTargetAtTime: https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime . Konkrete Grundlage für gemeinsame Audiozeit, Startzeit und Glättung.
4. Tone.js, Accurate Timing: https://github.com/Tonejs/Tone.js/wiki/Accurate-Timing ; Performance: https://github.com/Tonejs/Tone.js/wiki/Performance . Scheduling-Zeit weiterreichen, CPU/Decode/Timing unterscheiden. Bibliotheksreferenz; kein zusätzlicher Transport oder AudioContext. Native bestehende Lösung bevorzugen.
5. Ruslan Nesteruk/Gleb Bondarenko, eigener Spaceship-Design-Workflow: https://www.asoundeffect.com/stellar-spaceship-sound-effects/ . Zustände, Innenraum und Schubschichten als Designreferenz; vorhandene KFB-Aufnahmen zuerst.
6. Marshall McGee / Pro Sound Effects: https://blog.prosoundeffects.com/how-to-sound-design-sci-fi-spaceship-sound-effects-video . Engine-Schicht ab 01:00 als Tutorial-Einstieg; genauer gehörte/gesehene Abschnitte beim Ausführen dokumentieren. Keine Film-/Tutorial-Tonspur als KFB-Asset übernehmen.
7. Optionaler technischer Vergleich: https://github.com/YigitSalihEmecen/Engine_Sim . README beschreibt prozeduralen Browser-Motor und Drivetrain. Bislang nur Dokumentationssicht; Lizenz/Commit/Verhalten vor jeder Übernahme prüfen. Kein Ersatz unserer aufgenommenen Engine-Schichten durch ungeprüfte Synthese.

Ergebnis höchstens drei konkrete Übernahmeentscheidungen für diesen Slice: (a) RPM/Last-Kurven und Perspektive, (b) Ereigniskanten/Glättung, (c) Jetpack-Schub/Gleiten/Boost. Weitere Libraries nur prüfen, wenn die vorhandenen Module eine nachweisbare Lücke haben. Kein pauschaler Einkauf, kein Nachbau von Star-Wars-Tonspuren. Recherche soll die zwei Fahrzeuge und den Jetpack besser machen, sie nicht verzögern.

## 8. Spielprüfung und Abnahme

A/B im selben echten Spielhost: bisheriger Bestand ohne V-903 gegen neue Mischung; gleiche Route, Eingaben, Kameraperspektive, Musik-/TTS-Situation und möglichst vergleichbare Ausgangslautheit. Kein Vorteil nur durch mehr Pegel.

Fahrzeuge: jeweils Leerlauf, Anfahren, Lastwechsel, Beschleunigen, echte Schaltungen soweit vorhanden, passende Kurve/Drift bzw. Hover-Manöver, Gas weg, Stop und Fahrzeugwechsel. Jetpack: Aktivieren, Abheben, Steigen, schnelle Kurve, Schub weg/Gleiten, erneuter Schub, Boost soweit vorhanden und Landung. Mindestens je eine kurze Video-/Tonaufnahme mit eindeutigem A/B- und Fahrzeug-/Jetpack-Namen.

Messungen: genaue Source-Heads, Warm-/Kaltstart, Event-Fakt→geplanter Audiostart (p50/p95/max), verworfene/duplizierte Events, gehaltene Stimmen, dekodierte PCM-Bytes, Netzwerkbytes, Framezeiten und Spitzenpegel. Software-Zeitmessung nicht als Lautsprecherlatenz ausgeben. Erst eine fokussierte Spielinstanz; Vergleichsbedingungen protokollieren. Startziel für warme Ereignisse: Zuordnung innerhalb eines Host-Ticks, keine absichtliche zusätzliche Warteschlange; Istwerte ausweisen.

Pflichtprüfungen: keine Reifen in der Luft/bei Hover; keine erfundenen Gänge; keine doppelten Schalt-/Kontakt-Events; kein hörbarer Neustart der Dauerschicht bei jedem Gaswechsel; Luftstrom beim Gleiten erhalten; keine alten Events nach Stop/Wechsel; kein hörbares Clippen; Sprache verständlich und bestehendes Ducking unverändert. Pause/Resume und mindestens zehn Fahrzeug-/Moduswechsel auf wachsende Stimmen-/Speicherzahlen prüfen.

Begrenzte Zusatzlast: aktive Varianten statt gesamten Katalog vorladen, höchstens sechs neue Loops und zwei gleichzeitige neue Ereignisstimmen als Startbudget. Bestehende Cache-Grenzen erhalten. Regressionsmessung gegen Baseline; Zielwerte und gemessene Ergebnisse unterscheiden.

Georg bekommt eine Gesamtentscheidung zu zwei Fahrzeugen und einem Jetpack: glaubwürdige unterschiedliche Identität, unmittelbare Reaktion, angenehme Dauerwirkung und verständliche Manöver. Keine erneute Dateifreigabe-Liste. Nicht selbst hörbare Befunde ausdrücklich offen lassen; die bereits erteilte Konzeptfreigabe trotzdem nicht erneut blockieren.

## 9. Rückgabe

Ein kompakter Return im bestehenden Owner: Repo/Branch/PR/exakte Heads; Quellen-/Rechercheentscheidungen; verwendete Assets und Änderungen an Kurven/Triggern; Tests/Messwerte; Spielaufnahmen und tatsächliche Abnahme-URL nur wenn verifiziert; gezielte ElevenLabs-Lücken; ein nächster produktiver Schritt. An Phasengrenzen persistieren und Writes nachlesen. Kein Hub-/Cloudflare-Umbau für Routine-Fortschritt.

## 10. Separate Konzeptnotiz für WS0 · Greifhaken/Gripping (SPÄTER)

Georg erwägt einen Greifhaken-Schuss, der an einer realen Struktur einrastet und den Spieler mit erhöhter Geschwindigkeit zum Anker zieht, gegebenenfalls später mit Schwung/Slingshot. Relevant als Ergänzung zum Jetpack über OSM-Strukturen.

Nur Konzept, keine Implementierung in diesem Auftrag. Später zu klären: gültige Anker/Kollision, Reichweite/Sichtlinie, Seilspannung und maximaler Zug, Abbruch/Lösen/Verfehlen, Kamera und kontrollierbares Abbremsen; Schwungmechanik vs. direktes Heranziehen ausdrücklich unterscheiden. Audio-Ereignisse wären Schuss → bestätigtes Einrasten → Zug/Spannung → Lösen/Fehlschuss; Luftstrom folgt tatsächlicher Geschwindigkeit. Keine Einrast-Geräusche ohne bestätigten Treffer. Sounddesign folgt später der beschlossenen Mechanik.
