# KFB ToolBox · additives Changelog

Alte Einträge bleiben unverändert. Korrekturen als neue CORRECTION/SUPERSEDES-Einträge mit Bezug ergänzen. Aktuelle Momentaufnahme im MASTERPLAN/Return, Geschichte hier.

## 2026-09-14 · T1-Onboarding

### DECISION
Ein ToolBox-Arbeitsbereich für Studio v17, Rigging v1 und Animation v2 WIP; getrennte Übergaben, Eingänge und Archive. Runtime-Owner der Spiele bleiben unverändert.

### IMPLEMENTATION · Dokumentation
START_HERE, lokaler Masterplan, Arbeitsregeln, Specs, Contracts, Deliverables, Workflows, Font-Inventar, Quellen-/Modulverzeichnis, frischer Chat-Auftrag und Return-/Job-Templates angelegt. Keine Tool-Runtime, kein Default-Preset, keine Fontdatei verändert oder veröffentlicht.

### SOURCE FACT
Der gepinnte Eingang enthält 14 Dateien (3 HTML, 5 Markdown, 6 JSON). Separater Modulbaum und exportierte Build-Anleitung fehlen in diesem Ordner; eingebettete Ressourcen wurden nicht vollständig extrahiert.

### DECISION · UI
Lesbarkeit zuerst. Normale Webfont/System-Fallback für UI; kein Special Elite oder Brandfont in Controls. Fonteys PRO und weitere Art-Fonts sind kein Startblocker.

### UNRESOLVED
17 fehlende lokale Fontreferenzen laut Autoren-Housekeeping; genaue Dateiliste/Verwendungsstellen noch zu liefern. Lab-Graft-Default muss gegen tatsächliches Bundle geprüft werden. Kein Browser-/Integrations-/Roundtrip-PASS durch diesen Dokumentationsstand.

### CLARIFICATION
`kfb.pets/1` bleibt der Input/Output-Vertrag. Logische Actor-/Role-/Fit-Trennung rechtfertigt keinen stillen Schemawechsel. Alle gelieferten Farb-/Mod-/Rig-Snapshots bleiben WIP bis expliziter Abnahme.

## 2026-09-14 · T1-Produktionschat (Claude Design)

### SOURCE FACT · Bundles
Die drei Standalone-HTMLs sind byte-identisch zu den Manifest-Pins (Git-Blob-SHA nachgerechnet). Sie bündeln nur support.js, DC-Skripte und woff2-Fonts; lokale Module werden zur Laufzeit relativ nachgeladen. Kaltstart aller drei: Shell rendert, dann Modulfehler (Studio: petstudio-v9/studio-v7/pet-session.v1.js; Rigging: ./lab-v2/sources.js; Lab: lab/assets.js). Details und Dateilisten: docs/MISSING_MODULES.md, docs/BUNDLE_RELATIVE_REFS.json. Belege: _handover/TOOLBOX_V1_2026-09-14/evidence/.

### SOURCE FACT · Modulbaum
Der 13.09.-Modulbaum liegt weder in kayfabizarro@6ea5d439 noch in KFB-Stunt-Car-Race / KFB-Combat-Arena noch in den lokalen Exportkopien. Lokal vorhanden ist ein älterer Workspace-Stand (CLAUDE/KFB FrankenStein Lab + Models/KFB Rigging Lab v1/) ohne die neun am 13.09. angelegten Dateien. Kein gemischter Modulbaum aus zwei Ständen gebaut.

### CORRECTION · FONT_INVENTORY
Die 17 vom Autor gemeldeten Schriftdateien sind jetzt einzeln aus dem Studio-v17-Bundle enumeriert (8 Fonteys PRO, 5 GeorgComic, 2 GeorgStorybook, Bangers, GeorgGelPen, PottyMouth BB). UI-Fundstellen im v17-Quelltext benannt. Ersetzt den Eintrag "genaue Dateiliste noch zu liefern" unter UNRESOLVED 2026-09-14.

### DECISION · Georg 2026-09-14
Rückgabe als ZIP plus Claude-Code-Handoff für Branch/PR. Basis sind die unveränderten Bundles; Font-Pass wird Folgeauftrag in editierbarer Quelle. Einzige Art-Fläche mit Brandfont: Wortmarke Kayfa·Bizarro (Textur). Zielpfad tools/KFB-ToolBox/site/. Startseite mit Config-Katalog. Podcast / Cartoon Creator / Card Viewer als ausdrücklich nicht-T1-Platzhalter.

### IMPLEMENTATION · Site
tools/KFB-ToolBox/site/: Einstieg (KFB ToolBox.dc.html, index.html, support.js) mit drei Werkzeugkacheln inkl. Boot-Befund, Config-Katalog (6 JSON, Blob/Bytes/Schema/Status), Platzhalterkacheln, Build-Identität. Roboto + System-Fallback. Bundles und Configs unverändert daneben.

### UNRESOLVED
Modulbaum 13.09. (Stop-Grenze, Anforderung in docs/MISSING_MODULES.md). Font-Pass, Lab-Graft-Default, Publikations-URL. Kein Gate außer Bundle-Identität auf PASS.

## 2026-09-14 · Review-Eingang (Fable-Teilrückgabe geprüft)

### SOURCE INTAKE
Review-Paket KFB_TOOLBOX_T1_REVIEW_2026-09-14 unverändert unter _handover/TOOLBOX_V1_2026-09-14/review_intake_2026-09-14/ gesichert (REVIEW, VALIDATION, TO_AUTHORING_WORKSPACE, MASTERPLAN_DELTA, ORIGINAL_ZIP_COMPLETE.sha256).

### CORRECTION · Prüfsumme
CHECKSUMS.sha256 der ersten Rückgabe: RETURN.md FAIL (17/18). Ursache: RETURN.md wurde nach dem Hashen um einen Satz ergänzt. Regel ab jetzt: Prüfsummen als letzter Schritt, danach keine Änderung. Neue Liste umfasst alle Dateien inkl. der fünf Configs mit Klammern (über Kopien ohne Klammern gehasht, Inhalt identisch; Mapping in CHECKSUMS.sha256 vermerkt).

### CORRECTION · Fontzählung
Eintrag „8 Fonteys PRO“ (Changelog 2026-09-14 · CORRECTION · FONT_INVENTORY) ist falsch; es sind 7 Fonteys-PRO-Dateien (Regular, Italic, Medium, MediumItalic, Bold, BoldItalic, Heavy). Gesamtzahl 17 bleibt richtig; FONT_INVENTORY.json enumeratedFiles war bereits korrekt.

### CORRECTION · Rigging-Befund
„Ordner danebenlegen genügt“ zurückgenommen. Rigging-Fehler ist ein Specifier-Auflösungsfehler im DC-Kontext, nicht 404. Import-Basis im Export zu prüfen (docs/MISSING_MODULES.md, CORRECTION).

### CLARIFICATION · Animation-Lab-Evidenz
Zwei Kaltstarts: erster zeigte lab/assets.js, zweiter lab/locomotion.js als sichtbaren Fehler (Promise.all über mehrere Imports, Reihenfolge nicht deterministisch). Konsolenmitschrift in _handover/TOOLBOX_V1_2026-09-14/evidence/console_2026-09-14.md.

### DECISION · Status
TOOLBOX_MANIFEST.status = T1_PARTIAL_BLOCKED_SOURCE_EXPORT (Review-Empfehlung übernommen). MASTERPLAN um den vorgeschlagenen Eintrag additiv ergänzt. Kein Release, kein Merge, keine Veröffentlichung der drei Tools als benutzbare Suite.

## 2026-09-14 · Review-Eingang 2 (Rig Embed v3, Donor-Paket)

### SOURCE INTAKE
Review-Paket KFB_RIG_EMBED_V3_REVIEW_2026-09-14 unverändert unter _handover/TOOLBOX_V1_2026-09-14/review_intake_embed_v3_2026-09-14/ gesichert (REVIEW, PROBE_RESULTS, SOURCE_PINS, CHANGELOG, CHECKSUMS, probe.cjs) plus eigenes INTAKE.md. Gegenstand ist tools/KFB-ToolBox/kfb-rigs-embed-v3/ @ f6e1a57d2580, nicht die drei Standalone-Bundles.

### SOURCE FACT · R1 nachgelesen
PartRig.set() prüft jeden Patch-Schlüssel gegen DEFAULTS und kehrt beim ersten Fremdschlüssel vor Object.assign zurück; carlrig-mount.v1.js übergibt { ...brow } / { ...nose } aus toPets1 und verwirft den Status. Befund des Reviews bestätigt. Ebenfalls bestätigt: kfb-rigs-embed-v3.manifest.json fehlt im Paketbaum, alle 9 SOURCE_PINS-Blobs stimmen mit dem Tree überein.

### CLARIFICATION · Ergänzung zu R1
pet.brow trägt neben mod und original auch graft sowie die flachen BrowRig-Regler aus brow.drawn — ein Fix muss positiv auf die sechs PartRig-Felder filtern. Der Verlust ist genau die gespeicherte Abweichung (PartRig-Defaults = gemessener Originalzustand); die Sichtbarkeit entscheidet der nachfolgende Zonen-Durchlauf. Kein Fix von der ToolBox aus, R1 gehört WS0.

### SOURCE FACT · Modulabdeckung
Das Donor-Paket enthält 30 Module und 2 Contract-JSONs. 4 der 9 am 13.09. neu angelegten, bis dahin nicht auffindbaren Dateien liegen jetzt gepinnt vor (carl-contract, facegraft, carlrig-mount, actor-wobble). Abdeckung: Rigging Lab 10/15, Animation Lab 0/5, Studio v17 8/17 benannte Refs. Bei allen drei Bundles fehlt die Datei des beobachteten Abbruchs. Details: docs/EMBED_V3_COVERAGE.json, Nachtrag in docs/MISSING_MODULES.md.

### DECISION · Kein Mischbaum
Keine Übernahme der Embed-Module nach site/. Bytegleichheit zum 13.09.-Workspace-Stand unbelegt (später kuratierter Donor, kein Workspace-Export); die bestehende Regel gegen handgemischte Modulbäume gilt. Auftrag TO_AUTHORING_WORKSPACE.md unverändert gültig.

### DECISION · Status unverändert
TOOLBOX_MANIFEST.status bleibt T1_PARTIAL_BLOCKED_SOURCE_EXPORT. Der in REVIEW §5 genannte Nicht-Aufhebung des Exportblockers wird übernommen. Keine GitHub-Schreiboperation, kein Owner-Wechsel, keine Änderung an Bundles oder Configs.

### UNRESOLVED
Bytegleichheit der 10 namensgleichen Module zum 13.09.-Stand. Embed-Manifest und Zwei-Figuren-Probe (WS0). Unverändert: Modulbaum 13.09., Font-Pass, Lab-Graft-Default, Publikations-URL.

## 2026-09-15 · Eingang WS0 (Quelllieferung, Ergebnis A)

### SOURCE INTAKE
Archiv `tools/KFB-ToolBox/_inbox/KFB FrankenStein ToolBox (WS0).zip` (1 846 232 B, sha256 948d1950…3c5b) über den Repo-Rohpfad geholt, unverändert unter `_inbox/WS0_2026-09-15/original/` abgelegt und nach `unpacked/` entpackt (113 Einträge, sha256 je Datei in SOURCE_MANIFEST.json). Commit-SHA nicht ermittelbar (Connector liefert nur den Tree a3adb84692fd) — als UNRESOLVED geführt, nicht geraten. Der Connector kann das ZIP nicht als Asset importieren; das ist eine Werkzeuggrenze, keine Rechteaussage.

### SOURCE FACT · Integrität und Schluß
101/101 Zeilen aus `A_QUELLSTAND/CHECKSUMS.sha256` PASS. Modulschluß je Einstieg nachgerechnet: 87 Dateien, 7 Einstiege, 78 erreicht, 0 unauflösbare lokale Modulreferenzen; 17 offene Referenzen sind ausschließlich Schriftdateien (absichtlich nicht im Paket). Rohdaten `_inbox/WS0_2026-09-15/qa-wsa/`.

### SOURCE FACT · Identität gegen den Pin
Git-Blob-SHA1 je Datei gegen den Embed-Baum an main: 30 von 31 vergleichbaren Dateien bytegleich, einzige Abweichung `lab-v6/carlrig-mount.v1.js` (5 716 → 9 780 B) = die angekündigte v3.1-Austauschdatei. Im Repo liegen die beiden v3.1-Dateien weiterhin nicht ein. Ergänzung zu WS0s Aufstellung: `contracts/kfb-carl-rig-v6.json` ist ebenfalls bytegleich (im Paket als `lab-v2/config/kfb-carl-rig-default.json`) und in DELTA.md §1a nicht aufgeführt.

### TESTED RESULT · 2026-09-15 · Kaltstart 7/7
Alle sieben Blätter aus dem frisch entpackten Ordner über HTTP gestartet; jedes rendert Oberfläche und 3D-Inhalt (Bilder `qa-wsa/coldstart-*-wsa.png`). Studio-Startbericht reproduziert (repo v1.2.8, Maßstab 0,516, Kopf 1 500 Dreiecke, 765/2 293 Punkte). Die vier Blätter, deren Kaltstart WS0 als NICHT GEPRÜFT führt (Recherchi, Vergleich, FrizzleDummy, Mech Rig v2), sind damit geprüft. Getrennt beurteilt: Daten erhalten PASS (101/101 Prüfsummen, 6/6 Blattfeldzahlen reproduziert), Parameter angewandt TEILWEISE (R1-Filter am Quelltext bestätigt, Abdeckungstabelle je Kanal fehlt), sichtbar gleich TEILWEISE (gleich zum berichteten Stand; Abweichungen 24/0 statt 25/1 Pets und Height 0,308 statt 0,312 sind der fehlenden Sitzung zuzuschreiben, die dritte nicht erklärt).

### CLARIFICATION · R1 nicht erneut reparieret
`carlrig-mount.v1.js` filtert positiv über `DEFAULTS as PART_FIELDS`, wertet den Rückgabestatus aus und führt `applied`/`rejected`; der Vollspread `{ ...brow }` ist weg. Die Stelle aus dem Review vom 14.09. ist geschlossen — genau über die sechs PartRig-Felder, wie in der Ergänzung verlangt. Nur nachgelesen, nichts geändert.

### DECISION · Status
TOOLBOX_MANIFEST.status von T1_PARTIAL_BLOCKED_SOURCE_EXPORT auf **T1_SOURCE_CLOSURE_DELIVERED**. Grund: die Stop-Grenze war der fehlende Modulbaum; er liegt vor und startet. SUPERSEDES den Statuseintrag vom 2026-09-14 (Review-Eingang), nicht die dortigen Befunde zu den Bundles. Keine Suite-Freigabe, kein Release, kein Publikations-PASS.

### DECISION · Kein zweiter Fork
Der Quellbaum wird nicht nach `site/` kopiert (Arbeitsregel: kein dauerhaft parallel gepflegter Modulbaum). Startweg ist `_inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/`. Die drei Standalone-Bundles und die sechs Configs in `site/` bleiben unverändert liegen und sind ab jetzt Ausgaben eines früheren Stands, nicht der Startweg. Keine aktive Referenz gebrochen.

### CORRECTION · Fontzahl
»18 @font-face-Regeln« aus WS0s Bericht ist die Regelzahl. Der Quelltext zeigt auf **17 verschiedene** Dateien — identisch mit docs/FONT_INVENTORY.json. Für den Font-Pass zählt die Dateiliste.

### SOURCE FACT · Prüfsummenlücke im Paket
`A_QUELLSTAND/DELTA_FOLGE_01.md` (2 608 B) ist von `CHECKSUMS.sha256` nicht gedeckt, ist also nach dem Hashen entstanden — dieselbe Fehlerklasse wie am 14.09. bei RETURN.md. Ihr sha256 ist in SOURCE_MANIFEST.json festgehalten. Regel unverändert: Prüfsummen als letzter Schritt.

### UNRESOLVED
Commit-SHA des Archivs. Feldabdeckung je Kanal. Georgs Entscheidung zu `pet-LIBRARY.json` (WS0 empfiehlt (c), fertig in B_OBERFLAECHE/). Font-Pass (17 Dateien). `kfb-pinball-sfx.json`. Rundlauf/Fremdpets/Sitzung. Vier Prüfgrößen und Drawer je Spalte (Ergebnis B). Ein `resource_error` ohne URL auf jedem Blatt, undiagnostiziert. Nachzuziehen im Repo: zwei v3.1-Dateien, `kfb-rigs-embed-v3.manifest.json`, `REVIEW_ANTWORT_v3.1.md`.

### NICHT ANGEFASST
Ergebnis B (`B_OBERFLAECHE/`: UI-Pilot, Studio mit LIBRARY-Streifen, zwei Berichte) ist gesichert, nicht geprüft, nicht eingespielt. Startseite `site/KFB ToolBox.dc.html` unverändert. Kein GitHub-Schreibvorgang, keine Owner- oder Contract-Änderung.

## 2026-09-15 · Abschluß-Pass Ergebnis A

### IMPLEMENTATION · Feldabdeckung
`_inbox/WS0_2026-09-15/FIELD_COVERAGE.md` (+ `qa-wsa/field-coverage-wsa.json`): positive Matrix über beide Leser, 48 Zeilen, Spalten gespeichertes Feld → Consumer/Reader → angewandtes Feld → Status → Beleg. Verteilung: 17 APPLIED_MEASURED, 12 APPLIED_SOURCE, 2 APPLIED_THEN_DISABLED, 2 OVERRIDDEN_BY_MODE, 3 INTENTIONAL_IGNORED, 1 REJECTED_REPORTED, 1 SILENT_DROP, 8 NOT_STORED, 2 NOT_MEASURED. Quellen: kfb-pet-capsule-carl.json (166 Blätter) und kfb-pet-graft-driver.v4.json (591 Blätter) gegen mountCarl und mountGraft.

### SOURCE FACT · Die zwei bekannten Unterschiede sind eingeordnet
24 Pets / 0 Entwürfe (WSA) gegen 25 / 1 (WS0): `kfb-pets.json` trägt 24 Einträge, der Startbericht addiert Sitzungsentwürfe (contract-guard: Repo → lokale Datei → Entwürfe). Dateistand gegen Dateistand plus einen Entwurf; kein fehlendes Feld. — Height 0,308 gegen 0,312: der Vertrag speichert `eye.dy = 0.308`, genau dieser Wert wird angewandt und gemessen; 0,312 ist der Wert der Werkbanksitzung `kfb.carl.rig.v6.3`, die nur im Authoring überstimmen darf. Gegenprobe: dx, ring, track, lidFit, lashes sind in Vertrag und beiden Messungen gleich. Beide Unterschiede sind erklärt, keiner ist korrigiert; der Eintrag »nicht erklärt« in RETURN_WSA.md ist ersetzt.

### SOURCE FACT · Nebenbefund zur Zonenfarbe
`mountCarl` liest das Wirtsfeld `color` (`#d99a4e`, sandfarben) nicht; die Zonenfarbe `zones[].color` (`#c03` auf Insel 1 und 6) gewinnt. Damit ist der Mechanismus hinter »sandfarbener Carl ist der Entwurf, nicht der ausgelieferte Look« am Quelltext benannt, nicht nur behauptet.

### SOURCE FACT · Drei neue Befunde, kein Blocker
F1 `mountGraft` führt kein `applied[]`/`rejected[]` je Feld; der Positivfilter läßt unbekannte Felder ohne Meldung fallen (u. a. `eye.colors.*`) — Berichtslücke, im ausgelieferten Vertrag ist keines der betroffenen Felder belegt. F2 `mouth` ist der einzige ungefilterte Vollspread in `mountGraft`. F3 Bart-Feldname divergiert (`moustache.form` bei Carl gegen `mp0.style` bei Graft); der Driver-Vertrag trägt kein `moustache`-Feld, heute ohne Wirkung. Alle drei betreffen den Leser-Bericht, nicht die Daten. Owner WS0.

### DECISION · Startseite umgestellt
`site/KFB ToolBox.dc.html` (+ `index.html`, gleicher Inhalt) zeigt jetzt sieben Werkzeugkacheln auf den Quellstand-Startweg `_inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/`, je Kachel Kaltstartbefund, Modulschluß-Zahl und Beobachtung plus Link auf das Kaltstartbild. Neu: Abschnitt »Herkunft und Prüfungen« (fünf Kennzahlen) und »Bundles vom 13.09. · Ausgaben, nicht Startweg« — die drei Bundles bleiben sichtbar, verlinkt und unverändert, mit dem erwarteten FAIL benannt. Config-Katalog unverändert, um den Hinweis ergänzt, dass der Quellstand eigene Verträge trägt. Statusanzeige BLOCKIERT → QUELLSTAND GESCHLOSSEN · nicht abgenommen. Zwei Tweak-Props: `showNotice`, `showLegacyBundles`. Ersetzte Fassung vollständig unter `_archive/site-v1_2026-09-14/` (inkl. support.js, dort weiter öffenbar). Keine aktive Referenz gebrochen.

### UNRESOLVED · Git-Sicherung
Die Sicherung des Jobordners auf GitHub ist **nicht ausgeführt**: der Zugang dieser Umgebung ist lesend (Baum, Dateien, Suche, Vergleich, Kopie ins Projekt), es gibt keinen Commit-/Branch-/PR-Weg. Anleitung mit Branchname, `git add`-Liste, Commit-Text und zwei Vorabentscheidungen (Dopplung `original/` gegen `unpacked/`, Freigabeumfang) in `_inbox/WS0_2026-09-15/PUSH.md`. Nachzutragen nach dem Commit: `archive.commit`, `github.md → commit:`, `site.workBranch`.

### NICHT ANGEFASST
Ergebnis B weiterhin nur gesichert. Bundles, Configs und der Eingang vom 13.09. unverändert. Keine Contract- oder Owner-Änderung, kein Schema-Wechsel, keine Sitzung und kein Preset geschrieben.

## 2026-09-15 · Nachtrag zum Abschluß-Pass · Git-Sicherung gemessen

### SOURCE FACT · Schreibzugriff verweigert, drei Endpunkte geprüft
Der Schreibweg ist in dieser Umgebung **vorhanden** (Dateien pushen, Branch anlegen, Datei anlegen/ändern, PR öffnen) — die GitHub-App-Installation auf `georg-doc/kayfabizarro` lehnt ihn ab. Geprüft und jeweils `403 Resource not accessible by integration`: `POST /git/refs` (Branch `toolbox/ws0-quellstand-2026-09-15`), `POST /git/trees` (Commit auf `main`), `PUT /contents/…` (Einzeldatei auf `main`). SUPERSEDES die Formulierung »der Zugang dieser Umgebung ist lesend« im Eintrag vom 15.09. (UNRESOLVED · Git-Sicherung): die Ursache ist nicht ein fehlendes Werkzeug, sondern das fehlende Recht `Contents: Read and write` dieser Installation. Keine Plattformdiagnose, keine Aussage über Georgs eigene Rechte am Repo.

### IMPLEMENTATION · Der Push ist ohne diese Umgebung ausführbar gemacht
`_inbox/WS0_2026-09-15/PUSH.md` neu gefaßt: der gemessene 403-Befund mit Endpunkttabelle, die zwei Wege (A: Recht nachziehen, dann läuft der Push von hier · B: Push von Georgs Rechner, braucht nichts von hier), die unveränderte Befehlsliste — und neu eine **Prüftabelle mit Git-Blob-SHA1 und Bytes je Jobdokument**, damit nach dem Commit jede Datei einzeln gegen den hier geprüften Stand gestellt werden kann (`git hash-object`). Der Jobordner ist zusätzlich als ZIP zur Übergabe bereitgestellt.

### IMPLEMENTATION · Bildbelege gepinnt
`qa-wsa/QA_EVIDENCE.md` neu: die sieben Kaltstartbilder mit Bytes und sha256, dazu die fünf QA-JSON. Grund: der Schreibweg überträgt Text, die PNG sind Binärdateien und über ihn nicht übertragbar. Damit zeigen Feldmatrix und RETURN auf identifizierbare Belege, auch solange die Bilder nur lokal liegen.

### DECISION · Kein Rückschritt, keine Wiederholung
Die Feldabdeckungsmatrix hat keinen Widerspruch aufgedeckt; die belastbar grünen Prüfungen (101/101 Prüfsummen, Modulschluß, Identität, 7/7 Kaltstart) sind **nicht** wiederholt worden. Status bleibt T1_SOURCE_CLOSURE_DELIVERED, Startseite bleibt auf dem Quellstand-Startweg, Ergebnis B bleibt unangetastet. Ergebnis A ist damit inhaltlich geschlossen; offen ist allein der Commit selbst.

### UNRESOLVED · unverändert
Commit-SHA des Archivs · Laufzeitmitschnitt `report.applied[]` (WS0) · `seat` und `cardRider` · `pet-LIBRARY.json` (Georg) · Font-Pass (17 Dateien) · `kfb-pinball-sfx.json` · Rundlauf/Fremdpets/Sitzung · `resource_error` ohne URL · vier Prüfgrößen und Drawer je Spalte (Ergebnis B) · im Repo nachzuziehen: zwei v3.1-Dateien, `kfb-rigs-embed-v3.manifest.json`, `REVIEW_ANTWORT_v3.1.md`.

## 2026-09-15 · Birthday-Consumer-Handoff (P0.1)

### TESTED RESULT
Casting am echten Rig, beide Hero-Figuren, KayKit Rig_Medium: Idle_A (General) · Waving (Simulation) · Cheering (Simulation) · Rückweg Idle_A — je 69/69 Tracks gebunden. FrizzleBob über `frizzlegraft-v1/graft-mount.v1.js#mountGraft` (Fixture v1.2.9 **und** Georgs Profil 15.09.), Novacyy/GothGirl aus `GothGirl.glb` (23 Knochen, 0 eingebettete Clips; lokale Packs bytegleich zur Shared-Library). Beleg: `_handover/BIRTHDAY_STARTSCREEN_2026-09-15/qa/` (Probe, JSON, 12 Bilder per sha256), Return `RETURN_BIRTHDAY_CONSUMER.md`.

### DECISION
Dance bleibt P1: kein Tanzclip im Spender; genau ein Kandidat benannt (`Rig_Medium_Special · Skeletons_Taunt_Longer`, Bindung 69/69, Lesart als Groove ungesichtet). Hihi = inaktiver Slot auf `kfb.pet-library/1` pet `cat`; der Name »Hihi« ist im Repo nicht registriert. EyeRig Speaker P1: Prop `GothGirl_Speaker.gltf` vorhanden, Montage nicht ausgeführt.

### SOURCE FACT
`FIELD_COVERAGE.md` im Repo bytegleich zur WSA-Fassung (Blob 52519a1b46e2); Jobordner-Kern und `KFB ToolBox.zip` liegen auf `main` (d3c16e3a), `qa-wsa/`, `PUSH.md`, `original/` und der entpackte A-Baum nur im ZIP. Georgs Studio-Export 15.09. trägt **keinen** `anim`-Block (Fixture 13.09. schon) — Rundlauf-Befund, Owner WS0, kein Birthday-Blocker.

### UNRESOLVED
Surf-Sektion im Studio, nicht rücksetzbare Rotation, flatternde Surf-Karte (Georg 15.09.) — Kanal seat/cardRider/pose, Owner WS0. Registry v1 kennt GothGirl nicht (Pin 12.09.), Librarian-Nachzug P0.4.

### IMPLEMENTATION · Site
Startseite: ein Navigationslink »Birthday-Casting« auf den Return. Sonst unverändert; Ergebnis B unangetastet.
