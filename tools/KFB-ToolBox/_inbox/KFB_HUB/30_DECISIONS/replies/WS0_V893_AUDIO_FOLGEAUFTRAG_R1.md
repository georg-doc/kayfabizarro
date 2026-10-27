# WS0 · Folgeauftrag zu V-893 · Audio-Anschlüsse, Auslieferung und Abnahme R1

Datum: 2026-10-27  
Status: **AUFTRAG VORBEREITET · UMSETZUNG NOCH NICHT FREIGEGEBEN**

Georgs aktuelle Anweisung: „Mach daraus bitte einen konkreten Folgeauftrag für WS0: vorhandene Töne anschließen, Ladezeit und Speicherverbrauch senken und die offenen Hör-/Timingprüfungen abschließen. Noch nichts am Spiel ändern.“

**Jetzt erlaubt ist die Auftragsvorbereitung. Dieses Dokument startet keinen ausführenden Chat und autorisiert weder Spiel-/Assetänderungen noch Veröffentlichung. Die nachstehenden Arbeiten beginnen erst nach ausdrücklicher Umsetzungsfreigabe.** Keine neue V-Nummer wird vorweggenommen.

## Ziel, Besitzer und Quellen

Spielaktionen bekommen ihren passenden vorhandenen Ton zur richtigen Zeit. Der erste Spielabschnitt lädt weniger Audio und hält deutlich weniger entpackte Audiodaten vor. Alle 72 Ereigniszeilen des Audits erhalten eine nachvollziehbare Abnahme statt bloßer Startsignale.

- Integrator und einziger Produktionsschreiber: **WS0** im privaten Repo `georg-doc/KFB-Stunt-Car-Race`.
- Bestehender Quell-/Integrationsbranch: `game/proc-world-ws0`. Beim Vorbereiten gelesen: `177ec66c5ae5135b570a66a249c689ddf8354628`. Vor Ausführung erneut lesen; nicht auf einen alten Auditstand zurücksetzen.
- Geplanter Arbeitsbranch nach Freigabe: `fix/ws0-audio-v893-r1`, vom dann aktuellen WS0-Stand. Noch nicht angelegt.
- [Maßgeblicher Audit mit allen 72 Ereignissen und 349 Cues](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/f752c31279af2d8ff9297af15b0c36b32848b036/audit/TON_PRUEFUNG_R1.md).
- Audit-Messquelle: `ceb1584db457171379bc914541fb84e9e0a52fb1`; Audio-Pin `c37138a97c166d0790757ec3a888f2401c7ad5d9`. Diese Werte sind historische Baseline, keine Zusicherung über den inzwischen fortgeschrittenen Branch.
- [Aktueller Audio-Vertrag](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/AUDIO_ROUTING_R1.md).
- [WSA-Return](https://github.com/georg-doc/kayfabizarro/blob/dde95bc1c0448e6054fda234c6eaec5323bb697b/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WSA_TO_WS0_V893_TON_PRUEFUNG_R1.md).

Vor Beginn START_HERE, CHAT_GITHUB_KFB_STAGE_WORKFLOW, FRESH_CHAT_SLICE_PROTOCOL sowie aktuellen WS0-Return lesen. Delta seit Audit für jeden Befund prüfen: bereits behobene Anschlüsse nicht erneut bauen.

Bestehender Audiobesitzer bleibt kfbAudio mit einem AudioContext und den vorhandenen Bussen. Stimme/Ducking, Stumm-/Lautstärkeregler und Priorität Song-Video > Zonenmusik > globales Bett bleiben erhalten. Keine Änderung an Bewegung, Kamera, Weltgestaltung oder Spielfunktionen nur zur Erzeugung eines Testereignisses.

## Arbeitspaket 1 · Vorhandene Töne anschließen

Zuerst die betroffenen Aufnahmen einzeln hören, dann mit dem echten Spielereignis verbinden. Keine zweite Ereignis- oder Audioverwaltung. Reihenfolge:

| Vorgang | Vorhandenes Material / konkrete Aufgabe | Nachweis |
|---|---|---|
| Truhe/Rucksack öffnen | interactions_r1/I01_chest_open a/b/c; vorhandene normalisierte Dateien in den regulären Auslieferungsweg aufnehmen | ein Ton beim tatsächlichen Öffnungsbeginn; kein doppelter Ton durch Taste plus HUD |
| Truhe schließen | I01 zunächst auf Eignung prüfen; geeignete vorhandene Aufnahme wiederverwenden | Schließbewegung und Ton zusammen; keine ungeprüfte Öffnungsaufnahme als angeblich passender Schluss |
| HUD-Knopf/Auswahl | interactions_r1/I04_button_press a/b/c | nur bestätigte Aktion, kein dauerndes Geräusch bei Hover oder gehaltenem Knopf |
| Einstieg/Dachfahrer und Ausstieg | vorhandene foot.step/foot.land bzw. passende Kontaktaufnahme vergleichen | Kontakt an tatsächlich sichtbarer Phase; Ausstieg muss nachweislich den Fahrmodus verlassen |
| Wagen aus Fluff bauen/auflösen | vorhandene S01–S06 aus dem Saug-Satz; travelFluff-Ereignisse an bestehenden Besitzer weiterleiten | Klang folgt Aufbau/Abbau; keine vervielfachten Einzelkugelgeräusche |
| Absturz | fly.crash → debris_crash_r1/K04_jetpack_tumble a/b/c | nur echter passender Absturz, keine zweite normale Landung |
| Spielende / Tank voll | vorhandenes ui.gameOver bzw. S07_tank_full | nur anschließen, falls der aktuelle Spielstand diese Zustände tatsächlich besitzt; andernfalls begründet NICHT ANWENDBAR, keine neue Spielmechanik |

Dateiformat und genaue Katalogpfade aus dem aktuellen Bestand übernehmen, nicht aus Kurzbezeichnungen erraten. Vorhandene Interaktionsaufnahmen gegebenenfalls durch den bestehenden Asset-Publishing-Prozess aufnehmen und Pin nachvollziehbar aktualisieren; keine unkontrollierte Änderung der gemeinsamen Audiobibliothek.

NPC-/schwere Schritte sind bereits produziert. Wetter, Tageszeiten und Bewohner nicht anhand alter gap-Metadaten neu bauen. Kazoo und gestopfte Trompete bleiben **separater Inhaltsbedarf, außerhalb dieses Umsetzungsauftrags**: keine ElevenLabs-Erzeugung, keine Credits, keine erfundenen Ersatzstimmen. Vorhandenen Rückfall dokumentieren; fehlende Wunschklangfarben nicht als behoben markieren.

Erste Aktionen unmittelbar nach Freischaltung besonders prüfen. Kernereignisse sollen hörbereit sein, wenn sie ausführbar werden. Veraltete Ereignisse nicht Sekunden später nachspielen. Falls eine kurze Warteschlange nötig ist, Frischegrenze pro Ereignis begründen und testen; keine pauschale Blockade der Spielfigur bis zur gesamten Audio-Bank.

## Arbeitspaket 2 · Ladezeit und Speicher senken

In dieser Reihenfolge innerhalb der vorhandenen Module:

1. **Kleine Startmenge:** benötigte Schritte, erste Fahr-/Landungs-/Interaktionstöne und aktuelles Klangbett priorisieren. Übrige Varianten, Biome und lange Betten bedarfsweise laden. Nicht alle 66 Ambience-Dateien direkt vorbereiten. Veraltete Ladeaufträge begrenzen/abbrechen; nicht mehr benötigte Buffer nach einer begrenzten Haltezeit freigeben, ohne aktive Töne abzuschneiden.
2. **Wiederverwendung und Cache:** gleiche Datei innerhalb einer Sitzung einmal laden/dekodieren; mehrfaches Halten desselben Buffers vermeiden. Gepinnte Antworten und Browsercache prüfen. Servercache, Browsercache und dekodierte Buffer getrennt messen. Kein großer persistenter PCM-Cache als Ersatz für begrenzten Speicher.
3. **Verlässliche Fehlerwege:** Site-Umschreibung darf den Ersatzhost nicht unbemerkt auf denselben ausgefallenen Raw-Weg zurückführen. Reale Hostwahl, Indexwechsel, Dateifehler, Decode-Fehler, verworfene Ereignisse und Bereitschaft korrekt zählen; endliche Timeouts. Kein ok für einen unvollständigen notwendigen Startsatz.

Keine Klangverschlechterung durch pauschales Mono, reduzierte Qualität, entfernte Tonfamilien oder stumme Szenen. Solche Änderungen wären ein eigener Vorschlag.

### Vorgeschlagene technische Abnahmeschwellen für die spätere Freigabe

Diese Werte sind neue Zielvorgaben dieses Auftragsentwurfs, keine bereits von Georg bestätigten Messwerte oder garantierten Einsparungen.

| Größe | Historischer Befund | Ziel im vergleichbaren neuen Test |
|---|---|---|
| Startsatz bereit ab erster freischaltender Eingabe | ready ca. 11,50 s frei / 28,84 s Fast 4G; bisherige ready-Messdefinition beachten | Median höchstens 5 s frei / 10 s Fast 4G; Startsatz vollständig definiert, kein Schönrechnen durch Weglassen nötiger Töne |
| Erste Musik ab Eingabe bis playing | 7,91 s frei / 5,40 s Fast 4G in Einzelproben mit verschiedenen Titeln | Median höchstens 3 s frei / 5 s Fast 4G bei gleichem festem Titel; zusätzlich hörbaren Beginn prüfen |
| Dekodiertes gehaltenes PCM | 677,27 MiB Fahrt; 683,59 MiB nach weiteren Aktionen | höchstens 350 MiB nach 60 s Standardfahrt und höchstens 450 MiB Spitze der vollständigen Prüfrunde |
| Audio-Transfer erste 60 s | etwa 30,4–34,6 MiB vollständiger Antworten | mindestens 30 % weniger als frisch erhobene Baseline bei identischem Ablauf/Titel; Teiltransfers und Gesamtrequests mitführen |
| Audio-Hauptthread | p95 0,4–0,5 ms, Spitze 9,7 ms; unvollständige CPU-Abdeckung | bestehendes Ziel <=1 ms je gemessenem Audio-Frame bleibt bestehen; Decode-/Fetch-Callbacks zusätzlich im Profil ausweisen |

Zielverfehlung mit Zahlen und Ursache berichten, nicht still den Maßstab ändern oder PASS erklären. Einzelne Ausreißer, Mediane und Maxima sichtbar lassen.

## Arbeitspaket 3 · Hör- und Timingprüfung abschließen

Die 72 Auditzeilen vollständig übernehmen. Jede Zeile erhält: aktueller Auslöser Datei:Zeile, konkrete Aufnahme, Bus, spielt ja/nein, Timing ok/zu früh/zu spät, Prüfschritte, Aufnahme mit Zeitmarke, Prüfer und Ergebnis.

- Fahrtest: Stand/Gas/Gänge/Lastwechsel, Boost/Drift, Abheben/Landen, Rolle/Zweirad/Kippen, Anstoß/Kollision, Herbeirufen/Dacheinstieg/Ausstieg.
- Figurenflug sowie Gehen/Rennen/Waten/Sprung/Landung; erfolgreich erreichten Modus jeweils nachweisen.
- Kampf einschließlich bestätigter Treffer, Ernte mit erreichbarem Ziel, Fundsachen, Truhe/HUD, Dialog/Fahrzeugstimme.
- Wasser, Biomwechsel, Tag/Nacht, Regen und Blitz/Donner sowie Zonen-/Titelwechsel.
- Start direkt nach frischem Laden und Wiederholung nach vollständiger Bereitschaft; schnelle Wiederholung, Abbruch und Moduswechsel prüfen.
- Stumm, Lautstärke und Ducking sowie Musikprioritäten als Regression testen.

Synchrone Bild-/Tonaufnahme verwenden. Erfasster Bufferstart allein reicht nicht. Hörprüfung durch benannten menschlichen Prüfer; unabhängiger Tester ordnet Aufnahmen und Ereignisse zu. Festgelegte Verzögerungen (u. a. Boost 120 ms, Staub 40 ms, Roll-Landung 30 ms) am Bild bewerten, nicht pauschal auf null setzen.

Für unmittelbare Kontakt-/UI-Ereignisse: gemessene Abweichung in ms berichten, Richtwert höchstens zwei Frames beim tatsächlichen Testtempo. Gestaltete Anläufe, Entfernung beim Donner und bewusst spätere Nachklänge separat begründen und hören. Timing ohne Aufnahme bleibt OFFEN. Nicht aktive Produktzustände dürfen nur mit Quellbeleg NICHT ANWENDBAR heißen; das ersetzt keinen fehlgeschlagenen Test.

## Mess- und Reviewplan

Nach Ausführungsfreigabe zuerst Baseline des aktuellen WS0-Heads, danach Kandidat unter denselben Bedingungen: identischer Seed, Route, Startposition, feste Musik, Gerät/GPU, Browser und Audioausgabe. Mindestens drei Läufe je Kombination frei/Fast 4G × kalt/warm; Rohwerte und Median, nicht nur bester Lauf. Fast 4G: 9 Mbit/s abwärts, 1,5 Mbit/s aufwärts, 60 ms Zusatzlatenz. Fokus sichtbar, keine konkurrierende GPU-Last.

Anforderung/Transfer im exakt abgegrenzten 60-s-Fenster, vollständiges Requestprotokoll mit tatsächlichem Host und Cachequelle; PCM nach Dekodierung, gehaltene Buffer, Spitze und Wert nach fünf Minuten einschließlich mehrerer Biomwechsel. Kein stetiges Wachstum bei wiederholtem identischem Rundgang. Zusätzlich Primärhost blockiert, beide Hosts blockiert, langsame Antwort und Decode-Fehler testen. Fehler müssen erkennbar bleiben, das Spiel steuerbar.

Integration Tester, unabhängiger Critic und Production Guard werden vor Umsetzung namentlich benannt; WS0 bleibt alleiniger Produktionsschreiber und darf die eigenen Änderungen nicht allein abnehmen. Guard bewertet nach zwei erfolglosen Reparaturen die kleinste betroffene Stelle; offene notwendige Hörprüfung bleibt Abschlussblocker dieses Audioauftrags, nicht pauschal des ganzen Spiels. Kein Agent wird mit diesem Vorbereitungsdokument gestartet.

## Lieferung und Abschluss

Nach späterer Freigabe: reviewbarer Kandidat/PR im Spielrepo, aktualisierter Eigentümer-Return und `audit/TON_PRUEFUNG_R2.md` mit:

- exaktem Basis- und Kandidaten-Head, Audio-Pin, geänderten Dateien und Rückbauweg;
- Vorher/Nachher-Werten und Rohprotokollen;
- allen 72 Ereigniszeilen mit Hör-/Timingbelegen;
- getrennten Status für Anschlüsse, Auslieferung, CPU und Hörabnahme;
- offenen Inhaltslücken (Kazoo/Trompete), echten Nicht-anwendbar-Fällen und verbleibenden Fehlern;
- Link-Rückmeldung im WS0-Register.

Persistieren nach zusammenhängendem Umsetzungsschritt, belastbarer Testphase und finalem Return; nach jedem GitHub-Schreiben exakten Branch-Head und Datei zurücklesen. Kein automatischer Merge, keine Live-Promotion, keine neue Hub-/Cloudflare-Route. Bestehende benannte Spiel-Abnahmefläche verwenden; ein lokaler Test darf nicht als veröffentlichte Site-Abnahme ausgegeben werden.

**Jetzt einziges nächstes Gate: ausdrückliche Freigabe zur Umsetzung dieses vorbereiteten Folgeauftrags. Bis dahin bleiben Spiel, Audio-Dateien, Pins und Deployments unverändert.**
