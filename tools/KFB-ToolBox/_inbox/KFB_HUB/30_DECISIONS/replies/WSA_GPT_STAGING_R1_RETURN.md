# WSA GPT Staging R1 Return

17.10.2026 · V-356 · ChatGPT Work/WSA → WS0 / Georg

**Private Staging-URL:** https://kfb-ws1-staging.frizzlebob.chatgpt.site

**Stand: DEPLOYED PRIVATE · TECHNICAL EVIDENCE RECORDED · GEORG BROWSER ACCEPTANCE PENDING.** Dies ist die beauftragte Testoberfläche. Die Live-Spielseite wurde nicht umgeschaltet; Cloudflare ws1-preview bleibt bis zur Abnahme Rückfall. WS0 entscheidet danach über seine Entfernung aus dem Produktionsprozess.

## 1 Plattformprüfung

**Zugriff.** Die neue Site ist privat, ausschließlich Georgs Besitzerkonto ist zugelassen; keine externen Besucher oder weiteren Editoren. Browserbesucher melden sich mit ChatGPT an. Claude-Sitzungen haben keinen automatischen Zugriff: sie können die öffentlichen GitHub-Quellen lesen, benötigen für die private Site aber separat autorisierten Servicezugriff. Sites stellt dafür einen Bearer-Header bereit; kein Token wurde in Quellcode, Return oder Browser-URL gespeichert. Der hiesige Prüfbrowser erreichte den Anmeldeschirm, nicht die authentifizierte Site. Georg wurde zur Anmeldung aufgefordert.

**Größe.** Das echte 18.100.265-Byte-Einzeldatei-Bündel wurde auf der GPT-Site aus R2 mit HTTP200 ausgeliefert. Der aktuelle R1-Adapter begrenzt Dateien auf 25 MiB, Bündel auf 100 MiB und dist auf 250 Dateien; dies sind eigene Schutzgrenzen, keine behaupteten Sites-Plattformmaxima. Die verfügbaren Sites-Unterlagen nennen keine belastbare maximale Gesamtprojektgröße. Sites-Server laufen intern auf Workers mit 128 MB Isolate-Speicher; es gibt keinen neuen eigenen Cloudflare-Pages-Veröffentlichungsschritt. Mehrteilige dist-Bündel werden vor Freigabe vollständig archiviert; synthetisch geprüft, noch nicht mit realem WS1-dist geliefert.

**Externe Abrufe.** Die vom tatsächlichen WS1-Bündel verwendete raw.githubusercontent.com-Modelladresse und api.github.com-Dialog-Pool-Adresse antworten jeweils HTTP200 mit Access-Control-Allow-Origin: *. Die gehostete HTML-Antwort enthält keinen CSP-Header. Das lokale Originalbündel zeigte echte Modelle/Kartenbilder im Browser. Die authentifizierte Browserprüfung auf der gehosteten Origin ist noch offen; deshalb kein pauschaler vollständiger Laufzeit-PASS. GitHub-API-Limits gelten weiter. Bei künftig gesperrten Abrufen wären die realen Modelle, Texturen, Kartenbilder/PDFs und der feste Dialog-Pool samt PDF.js-/Draco-Abhängigkeiten in das WS1-Bündel aufzunehmen. Kein Asset-Ersatz wurde gebaut.

**Persistenz.** Sites unterstützt D1 für strukturierte Daten und R2 für JSON/Dateien; serverseitige Benutzerzuordnung über die stabile Sites-Benutzer-ID ist vorgesehen. R1 benutzt R2 für das Build-Archiv. Eine vorgefertigte kfb.world/1-Spielstand-API ist nicht nachgewiesen und wurde nicht erfunden. WS1 muss Spielstand-/Konfigurationsspeicherung als eigenes versioniertes, authentifiziertes API-Schema anbinden. Vorhandenes WS1-localStorage bleibt unverändert und gerätelokal; ein eigener Origin bedeutet keine automatische Übernahme alter Cloudflare-localStorage-Daten.

## 2 Auslieferung und Besitzgrenze

Vorlage: georg-doc/kayfabizarro, ws1/preview, echter SHA **8c5bd157c6c17d44b323453e97671aeec3251187**, Buildlabel `kfb-planet main@8ce5ac5 (V-346 Look-TUNE)`. 1:1 übernommen: komplettes HTML-Bündel. Neu: schmaler Metadaten-/Archiv-/Auslieferungsadapter. WS1 bleibt alleiniger Besitzer von Spiel, Kamera, Szene und Modulen.

Beim Öffnen und anschließend alle 15 Sekunden liest die Site build.json. Nur vollständig bestandene positive Testmengen werden zugelassen: passed/total-Objekt, explizite Ergebnis-Arrays, Summen-Arrays sowie der vereinbarte alte String. Bei Manifeständerung wird der echte GitHub-Head aufgelöst und das ganze Bündel unter diesem SHA gespeichert. Erst danach wird der Katalog per bedingtem R2-ETag aktualisiert. Laufende Spiele bleiben geöffnet. Die Standardauswahl folgt dem neuesten Stand; ausdrücklich ausgewählte Archivstände bleiben ausgewählt.

Die letzten fünf qualifizierten Stände sind auswählbar. Initial werden vorhandene build.json-Revisionen nachgezogen; aktuell existieren **zwei**, nicht fünf künstliche Stände. Alte unveränderliche R2-Objekte bleiben für bereits offene Spieltabs erhalten; physische Bereinigung ist noch nicht implementiert. Quellseitige externe Assets gehören nicht automatisch zum Bündelarchiv. Aktualisierung erfolgt beim Besuch bzw. während die Site offen ist, ohne manuelles Site-Publishing pro WS1-Push; keine Hintergrund-Webhook- oder Zeitplaninfrastruktur wurde eingerichtet.

Cloudflare-Startlinks werden auf dieselben Hash-Ziele im GPT-Site-Bündel abgebildet. Bühne, M1 und Lineup sind vorhanden. Im aktuellen Stand ist `car: null`; Fahrprobe bleibt gemäß WS0-Nachricht deaktiviert mit **„Noch nicht verfügbar“**, bis WS1 ein eigenes M2-Kombi-Ziel liefert. Ein historischer Archivstand besitzt bereits sein damaliges car-Ziel; das macht die aktuelle Fahrprobe nicht verfügbar.

**Transportbefund:** Lokal sind Original und Auslieferung bytegleich, SHA256 `b216ffd2d3e8afcda718cda35a308bb8470ac08c98f613e0297f010930e71d11`. Gehostet fügt Sites-Infrastruktur ein 938-Byte-Cloudflare-JS-Challenge-Skript hinzu (`/cdn-cgi/challenge-platform/scripts/jsd/main.js`). Entfernen ausschließlich dieser Einfügung stellt das gesamte Original exakt wieder her. WSA änderte keinen WS1-Code; die endgültige HTTP-Antwort ist wegen der Plattform-Einfügung nicht bytegleich.

## 3 Tatsächliche Prüfung

- 16/16 Vertragsprüfungen PASS; 22/22 synthetische Archiv-Integrationstests PASS, einschließlich neuer geprüfter Revision, Fehler-Rückfall, fünf Einträge, dist, altem geöffnetem Bündel und mehrerer nach Browserpause verpasster Stände. Die Historienabfrage ist an den erfassten GitHub-SHA gebunden.
- Sites-Produktionsbuild PASS; private Veröffentlichung v3 erfolgreich.
- Gehosteter Kaltabruf: Oberfläche200 0,394 s; neuester Stand200 3,938 s; Historie200 3,810 s; Originalbündel200 3,964 s. Warmer Statusabruf0,524 s. Das belegt den technischen Abruf unter 30 s, noch nicht Georgs kompletten Szenenstart nach Login.
- Lokaler Browser: schmale und breite Darstellung, Stand/Datum/Notiz/23 von23 Tests; Bühne und M1 starten über die richtigen GPT-relativen Ziele; echte Bühne/Figuren/Karte sichtbar. Keine erneute Annahme des WS1-Looks oder der Spielphysik.
- Separater schreibgeschützter Kritiker `/root/staging_critic`: zunächst REPAIR; nach Metadaten-, Katalog-, Altstand- und Auswahlkorrekturen CONTINUE zum gehosteten Nachweis. Kein Georg-PASS ersetzt.
- Noch nicht beobachtet: nächster echter WS1-Push; authentifizierter gehosteter Browser; fünf reale qualifizierte Revisionen; echtes WS1-dist; Spielstand-API. WS1s gemeldete 23/23 Tests wurden von WSA nicht als neue Spieltests ausgegeben.

## 4 Quellen und Wiederaufnahme

Repository: **georg-doc/kayfabizarro**. Register-Branch: **docs/kfb-decisions-register-2026-10-11**. Kein neuer PR.

Implementierungscheckpoint **08f22dddb35163f335c2ea82e843a28e6517a9b7**; Materialnachweischeckpoint **a7e432717f134d9a60b5fbf09fb96944683b6713**. Beide Branch-Refs und alle beabsichtigten Dateien exakt zurückgelesen. Erster Returnabschluss 3c13530e1038b91ea3e936c4dfc073abb21d4e5c. Die abschließende Korrektur für lückenloses Nachziehen nach Browserpause aktualisiert Quellstand, Tests, Return und additiven Changelog auf demselben Branch; deren SHA wird aus dem abschließenden Ref-Readback gemeldet.

Geänderte Dateien: `replies/WSA_GPT_STAGING_R1_SOURCE/` mit app/page.tsx, globals.css, layout.tsx, API-/Bündelroute, lib/links.ts, lib/staging.ts, .openai/hosting.json, README, zwei Testdateien, TEST_REPORT und zwei JSON-Nachweisen; dazu dieser Return und der additive 30_DECISIONS/CHANGELOG.md. Der vollständige Build-/Framework-Unterbau bleibt zusätzlich im Sites-Quellrepository.

Sites-Projekt **appgprj_6ad2ac305b788191af0bdfc68823a300**. Veröffentlichtes Sites-Quellcommit **25b1b1e90e12ece4703960f5a1570f79f13db649**. Version **appgprj_6ad2ac305b788191af0bdfc68823a300~appgver_428d7cb68df08191b0b60add450f4f56**, Deployment **appgdep_6ad2af5dc5b88191b8e6d17a6b6a7736**. Site-Status DEPLOYED PRIVATE, nicht PUBLIC_VERIFIED oder HUMAN_ACCEPTED. Lokaler Screenshot: `evidence/local-m1.jpg` im Arbeitsstand; HTTP-/Transform-Nachweis und reproduzierbare Tests im Register.

**Genau ein nächstes Tor:** Georg prüft die private GPT-Staging-Site nach Anmeldung einschließlich der automatischen Übernahme des nächsten echten WS1-Vorschau-Pushs. Erst nach Georgs Abnahme darf WS0 den Cloudflare-Rückfall aus dem Prozess nehmen. Die aktuelle M2-Fahrprobe bleibt bis zur WS1-Lieferung ausdrücklich ausgenommen.
