# WSA · GitHub-Speicherweg R1 / Dramatis Personae Follow-up · 17.10.2026

**Ergebnis: getesteter Vorschlagskern vorbereitet, direkter Site-Save weiterhin blockiert. Keine neue Produktversion veröffentlicht.**

## Repository / prüfbarer Stand
- Repo: georg-doc/kayfabizarro
- Implementierungsbranch: `toolbox/github-character-proposals-r1-2026-10-17`
- Exakter Head: `9dca51687253acbcd612f5e6fb88c3e2e36ea64a`
- Entwurfs-PR: https://github.com/georg-doc/kayfabizarro/pull/416, Ziel Register-Branch `docs/kfb-decisions-register-2026-10-11`, kein Merge.
- Sechs neue Dateien im bestehenden ToolBox-Handoff `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WSA_CHARACTER_SAVE_R1/`: Transaktionsmodul, 36 Regressionstests, zwei unveränderte Quellen-Fixtures, README, TEST_REPORT.json. Alle sechs Dateien exakt zurückgelesen.
- Produktstände unverändert: ToolBox v11 veröffentlicht; Asset Library v16 lesend veröffentlicht. Norman Source only; Brain-Cyborg B10 pending.

## Was implementiert und getestet ist
Der gemeinsam nutzbare Backend-Kern prüft die exakte Karten-/Blattversion und bei Figuren zusätzlich Körper-/Rezept-Hashes. Er erstellt einen isolierten Vorschlags-Commit, nie einen Register-Merge. Doppelklick/Retry bindet sich an dieselbe Request-ID und serverseitig bestätigte Vorschlagsdatierung. Branchname: `characters/edit-<id>-<date>-<requestId12>`; der Suffix verhindert gegenseitiges Überschreiben mehrerer Vorschläge am selben Tag.

Bearbeitete Charakter-Leaves erhalten `{v, src, status: "GEORG"}`. Originale Quellenhistorie bleibt über Provenienz erhalten. Konflikte, offene Punkte, Figur-Referenzen, Körperquellen/Originalteil-Regeln und die Gesamtfreigabe einer Figur bleiben erhalten. Eine Figurenabstimmung wird nicht pauschal approved. Das tatsächliche neue Hunky-/Dory-Modell muss erst geliefert und von Georg frisch abgestimmt werden; keine alten Testwerte werden übertragen.

Vor Erfolgsmeldung verlangt der Kern Rücklesen von Branch, Dokumenthash, Beleg, Elterncommit und exakt erlaubten geänderten Dateien. Ein Timeout löst eine Zustandsprüfung aus, keine blinde Wiederholung. Keine Tokens/Account-IDs in GitHub-Dokumenten, kein Browser-Schreibproxy.

## Tatsächliche Validierung und Grenzen
- **36/36 lokale Tests PASS**, unabhängig erneut ausgeführt.
- Prüffälle: fremde/fehlende Anmeldung, fehlende Zustimmung, fremde Origin/GET; geschützte Pfade; neue Körper-/Rezeptversion; Kartenwechsel während Save; Doppelklick; Tageswechsel beim Retry; Timeout nach Branchanlage; gleiche Request-ID mit anderem Inhalt; manipuliertes Rücklesen; ungültige Zahlen/Feldtypen; verschachtelte Spieler-Erinnerung in Beziehungsvorlage; ungültige Brauenwerte.
- Die unabhängige Kritik fand zunächst zwei Validierungslücken (verschachtelte Beziehungsspeicher und beliebige Brauenwerte). Beide sind mit expliziten Schemas geschlossen und durch Regressionstests belegt.
- Diese Tests verwenden deterministische Adapter. **Kein echter Site-zu-GitHub-Schreibtest, keine neue serverseitige Site-Route, kein aktivierter Save-Knopf.** Keine kanonischen Kartenwerte geändert.
- Der Kern umfasst derzeit nur die im README ausdrücklich erlaubten Felder. Kopftransform, Dangle, Oberflächen-/Farbfelder und weitere noch nicht abgebildete Studio-Regler dürfen beim späteren Save nicht stillschweigend wegfallen. Vor UI-Freigabe muss der Adapter unsupported dirty controls sichtbar verweigern beziehungsweise ihre vollständige schema-basierte Abbildung ergänzen.
- R2-Formulare und R3-Webchat-Antworttransport sind noch nicht umgesetzt; dieser Stand ist kein Abschluss von R2/R3.

## Warum der direkte Anschluss noch fehlt
Die Sites-App-Integrationsvorgabe verlangt vor Auswahl/Deklaration eines serverseitigen Connectors `sites_list_plugin_eligibility`. Dieser Aufruf ist im aktuellen ausführbaren Werkzeugsatz weiterhin nicht vorhanden. Plugin-Suche bestätigt, dass GitHub und Sites installiert sind; das ersetzt den Site-spezifischen Nachweis nicht.

Gelesene Vorgaben:
- Sites SKILL: `/Users/georgv.westphalen/.codex/plugins/cache/openai-curated-remote/sites/1.0.0/skills/sites/SKILL.md`
- `references/app-integrations.md`: „Call native list_plugin_eligibility (…) before selecting apps or previewing their data.“
- Dieselbe Referenz verlangt bei fehlender Eligibility unabhängige Arbeit und Erhalt der vorhandenen Deklarationen statt Umgehung.

Deshalb kein geratenes Connector-Mapping, kein kopiertes Agenten-Token, keine alternative Site und kein Ersatzspeicher. Zusätzlich beschreibt die native Branch-Funktion „create or update“; ein konkreter Hosted-Adapter muss bei Kollisionen garantiert create-only arbeiten. Der Kern verweigert Adapter ohne diesen Nachweis.

**Nicht behoben durch erneutes GitHub-Anmelden:** GitHub selbst ist bereits verbunden. Fehlend ist die Site-seitige, ausführbare Connector-Freigabe-/Server-Integration. Nächste technische Voraussetzung ist ein Sites-Ausführungskontext, der diese dokumentierte Funktion bereitstellt; danach denselben Kern in die bestehenden Sites einhängen und echte Owner-/Consent-/GitHub-Schreibtests durchführen.

## Dramatis Personae: aktueller Quellenstand
Register-Snapshot: `2a842c5f67cb75c2f6839e50f31ca5dc5b9c1856`. **11 Charakterblätter, 13 Figurenkarten, Vereinigungsmenge 15 IDs.**
- Neu vorhanden: `4gtn_ceo`, `4gtn_forgotten` als Charakterblätter ohne eigene Figurenkarte. Sie müssen sichtbar „Karte fehlt / todo“ bleiben.
- Weiterhin fehlende Charakterblätter: Black Knight, Demon Lord, Monstrosity, Witch/Hexe. WSA legt sie nicht eigenmächtig an.
- Die veröffentlichte R1-Implementierung liest bereits die Vereinigungsmenge und aktuelle Verzeichnisse vom Register nach GitHub-Aktualisierung; kein zweiter Datenspeicher.
- Aktueller WS1-Stand `32480cf497e75640790b63f52eb8b1e7f5e6b4ef`: Vendor-Verzeichnis enthält das gemeinsame Licht, aber keinen ausgelieferten Figurenkarten-Loader. 3D bleibt gesperrt; kein Ersatzmodell/Privatlicht.
- V16-Tab: https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=dramatis-personae
- Vorhandene R1-Galerie/FrizzleBob-/Lord-Hunky-Bildbelege bleiben im vorherigen Return. **Keine neuen R2- oder 3D-Bildbelege in diesem Save-Kern-Schritt.**

### Figurenkarten mit offenen Punkten
Alle 13 Karten haben mindestens einen offenen Punkt. FrizzleBobs approved bleibt erhalten; der noch offene Licht-/Clay-Beweis ist davon getrennt sichtbar.

| Figur | Kartenstatus | Offene Punkte aus der Karte |
|---|---|---|
| Black Knight | candidate | Blender eye cleanup + anchors; eye setting on anchored seat + Georg save; clay proof |
| Brain-Cyborg | open-design | aliens collar construction PASS first; story; Blender build + clay proofs; everything in this card |
| Demon Lord | candidate | baked cleanup PASS; eye setting on anchored seat + Georg save; clay proof |
| FrizzleBob | approved | clay proof pair front/3/4/side under the R2 stage-light module (V-346.6, V-392) |
| GothGirl | candidate | Georg PASS on GothGirl_NoEyes (EYE-CLEANUP-02 contact sheet row); eye setting A vs B + save; mouth decision; clay proof pair |
| Lady Dory | candidate | Figure Workshop r4 integration report (BRIEF_WSA_ALIENS_TOOLBOX_R4, Hub b61); Georg tunes + saves (V-317); E2 lids in socket (V-348.4); Space Ranger head-turn transfer (V-353.2 / WSB B5); brows (later, V-297); Dory head oval + mouth area Blender job (V-336 BLENDER_MCP_HANDOFF) – status unknown |
| Lord Hunky | candidate | Figure Workshop r4 integration report (BRIEF_WSA_ALIENS_TOOLBOX_R4, Hub b61); Georg tunes + saves (V-317); E2 lids in socket (V-348.4); Space Ranger head-turn transfer (V-353.2 / WSB B5); brows (later, V-297) |
| Monstrosity | candidate | baked cleanup PASS; eye setting on anchored seat + Georg save; clay proof |
| Mummy_A | candidate | close-up pair front + 3/4 with EyeRig v6 on the anchors + clay (WSB re-render per ANTWORT_WS0_2026-10-17); mouth set per voice; Georg confirms which mummy sings which voice; V-201 converge/gaze check |
| Mummy_B | candidate | close-up pair front + 3/4 with EyeRig v6 on the anchors + clay (WSB re-render per ANTWORT_WS0_2026-10-17); mouth set per voice; Georg confirms which mummy sings which voice; V-201 converge/gaze check |
| Norman | open-design | Site proof: Source only → Face candidate with clay (V-380); Georg gate NORMAN_TOOLBOX_SITE_FINE_TUNE_01 (TUNE/APPROVE/REJECT); voice casting; baked texture instead of runtime texclean |
| Orc Brute | candidate | Georg confirms G4 (image ↔ "Orc passt"); animated eyes (life/blink/gaze) + Figure Workshop save (V-353 r4 run) |
| Witch | candidate | close-up pair with eye rig + clay; V-201 check |

Zusätzlich fehlen Figurenkarten für die beiden 4gtn-Blätter.

## WS0 / nächstes Gate
WS0 bitte diesen tatsächlichen Teilstand und den Plattformblock übernehmen: getesteter Kern PR #416, **noch kein direktes Speichern**. Die kommenden Hunky-/Dory-Fixes bleiben separate Quellenlieferungen. Keine Freigabewerte aus diesem Testlauf verwenden.

**Ein nächstes Gate:** dokumentierte Sites-Connector-Eligibility und create-only Serveradapter verfügbar machen; danach im bestehenden ToolBox-Studio einen echten Vorschlag mit Georgs ausdrücklicher Save-Aktion vollständig bis GitHub nachweisen. Personae-R2 nutzt anschließend denselben Vertrag; 3D wartet zusätzlich weiter auf WS1.

## Nachprüfung des Plattformblocks · 17.10.2026
Georg verlangt ausdrücklich direktes Speichern in derselben ToolBox, ohne Kopieren und ohne neues Tool. Das bleibt das Produktziel.

### Neue tatsächliche Befunde
- Native `get_site` bestätigt ToolBox v11, Rolle owner, bestehende private Adresse und `requires_byop:false`. Das ist der aktuelle fehlende Runtime-Anschluss, kein Nachweis einer administrativen Ablehnung.
- Das bestehende Manifest ist static-only; keine Plugin-/Connector-Deklarationen. Die Sites-Integrationsreferenz dokumentiert serverseitige Connector-Aufrufe und den Ausbau derselben bestehenden project_id. Kein neues Site-Projekt nötig.
- Der ausführbare Sites-Werkzeugsatz wurde erneut auf Eligibility/Discovery geprüft: `sites_list_plugin_eligibility` fehlt weiterhin. Plugin-Suche/Installationsmetadaten ersetzen ihn ausdrücklich nicht.
- Zusätzlich im angemeldeten Chrome die tatsächlichen ToolBox-Site-Einstellungen geöffnet: https://chatgpt.com/space/sites/appgprj_6ac2ba44282881919d1a49287a32054e/plugins
- Der Tab Plugins meldet „Die aktuellen Plugins der Website konnten nicht geladen werden“. Ein gezieltes Erneut versuchen endet wieder in derselben Meldung. Keine Ursache/Admin-Sperre daraus ableitbar.
- „Hinzufügen“ öffnet einen nicht abgesendeten Work-Entwurf zum Verbinden eines Plugins mit der bestehenden ToolBox. Es ist kein Freigabe-Schalter und liefert keine Eligibility-Daten. Kein neuer Chat-Auftrag wurde abgesendet, keine Verbindung/Permission verändert.
- Öffentliche OpenAI-Dokumentation wurde ergänzend geprüft. Sign-in-Identität und Connector-Berechtigungen sind getrennt; bloßes ChatGPT-Anmelden ersetzt die GitHub-Runtime-Freigabe nicht. Kein öffentlich dokumentierter Ersatz für die fehlende native Sites-Eligibility gefunden. Quellen: https://developers.openai.com/siwc/quickstart und https://developers.openai.com/training/walkthroughs/building-a-shareable-site

### Konkreter Anschlussweg nach Auflösung
1. Im Sites-Ausführungskontext für genau project_id `appgprj_6ac2ba44282881919d1a49287a32054e` die dokumentierte Eligibility bereitstellen, GitHub auf allowed prüfen und die zurückgegebenen Plugin-/Connector-IDs übernehmen.
2. Dieselbe ToolBox um unterstützte Serverrouten ergänzen und GitHub mit dem dokumentierten Schreibmodus deklarieren. Nur serverseitige Ziel-/Aktionsauswahl, keine Browser-Zugangsdaten. Die bestehende GitHub-Verbindung wird durch die Besucherfreigabe genutzt.
3. Den vorbereiteten Kern aus PR #416 anschließen; davor create-only Branchsemantik des konkreten Adapters beweisen und alle geänderten Studio-Regler vollständig abbilden oder sichtbar verweigern.
4. In der bestehenden UI „Als Änderungsvorschlag speichern“ mit Vorschau der Änderungen: neue Figurenkartenversion vom aktuellen Register, Werte aus Georgs aktueller Abstimmung, isolierter Branch/Commit, exaktes Rücklesen, Link zum Vorschlag. Kein Merge. Neue Hunky-/Dory-Fixes nicht durch alte Kartenwerte ersetzen.
5. Erst tatsächliche Hosted-Anmeldung/Zustimmung/Read/Write/Rückleseprüfung belegen den Anschluss. Die bestehenden 36 lokalen Tests ersetzen das nicht.

**Präziser Blocker:** fehlende Site-spezifische Connector-Discovery im aktuellen Ausführungskontext, zusätzlich fehlernde Plugin-Verwaltung in der Weboberfläche. Kein nachgewiesener GitHub-OAuth-Defekt. Ein Sites-Kontext mit dieser nativen Funktion bzw. die Behebung der Plugin-Verwaltung ist die nächste technische Voraussetzung; WS0 kann dafür nur koordinieren, die Plattformfunktion nicht durch eine Figurenkartenänderung ersetzen.

Keine neue Site-Version, keine kanonische Karte, keine neue Berechtigung und kein Merge in dieser Nachprüfung. PR #416 bleibt offen/draft auf `9dca51687253acbcd612f5e6fb88c3e2e36ea64a`. Der getestete Kern bleibt vorbereitet, direktes Speichern bleibt noch nicht aktiv.

## ChatGPT Work Gegenprüfung · 17.10.2026 · bestehende private ToolBox

**Status: NICHT ANGESCHLOSSEN · SITES_PLUGIN_ELIGIBILITY_UNAVAILABLE.** Der ausdrücklich beauftragte erste Gate wurde im ChatGPT-Work-Kontext geprüft: vollständige native Tool-Inventur nach `sites.*eligib`, anschließend nach sämtlichen `eligib`-/Tool-Search-Funktionen: jeweils 0 Treffer. `sites_list_plugin_eligibility` ist nicht callable; daher kein projektbezogener Aufruf, keine erste Ergebnisseite, kein Cursor und keine Pagination möglich. Keine allowed Plugin-/Connector-IDs erhalten. Das ist ein fehlendes Plattformwerkzeug, keine returned denial und kein nachgewiesenes Admin-/OAuth-Verbot. GitHub fetch_file/fetch_pr/fetch_commit funktionieren über die bestehende Verbindung; keine Reauth angefordert.

Native `get_site` für `appgprj_6ac2ba44282881919d1a49287a32054e` erneut erfolgreich: active, current_user_role owner, v11, custom access nur Owner, 0 externe Besucher, keine Gruppen/Editoren, requires_byop false, disabled_by null, bestehende URL https://kfb-toolbox.frizzlebob.chatgpt.site . Keine Zugriffsänderung. Source `53028aa47de97cf1c5791cdc72501212a5785094` ist der vorher dokumentierte v11-Stand; in diesem Gate-Lauf nicht erneut aus Source-Checkout verifiziert. Kein Source-Helper/Source-Write gestartet, weil keine Source-Änderung nach dem fehlenden ersten Gate autorisiert sinnvoll ist.

Gelesen: aktuelle START_HERE, CHAT_GITHUB_KFB_STAGE_WORKFLOW, FRESH_CHAT_SLICE_PROTOCOL, bestehender Owner-Return/README und KNOWN_FAILURES [Figure]/[Georg-facing]. Native PR-Abfrage bestätigt #416 weiterhin open/draft, unmerged; Implementierungshead `9dca51687253acbcd612f5e6fb88c3e2e36ea64a`. Register vor Return-Write `bfcf60f8faed39d5cbae3f715737cee95e890765`.

**Prüfungen dieses Laufs:** native Site-Metadaten-Read erfolgreich; GitHub Quellen-/PR-Reads erfolgreich; 0 ausführbare Eligibility-Funktionen; 0 lokale Tests neu ausgeführt; vorhandene 36/36 bleiben historische Kernprüfung, kein neuer Testclaim. Hosted Reads/Consent/Write jeweils NOT_RUN wegen fehlender Discovery. Keine Browserprüfung, kein neuer Screenshot, kein Testbranch, keine Kartenänderung, keine neue Site-Version oder Deployment. Design/Studio/Animation/Rigging/Motion/Renderer unverändert. Kein Kopier-/Downloadersatz und kein Ersatzbackend.

**Vorschlagsweg bleibt:** expliziter Studio-Save → trusted Sites Identity/Consent + same-origin POST → bestehender Kern aus PR #416 → atomarer create-only Vorschlagsbranch/Commit → connector status success UND exaktes GitHub-Rücklesen → Link. Vor Freigabe weiterhin create-only Adapterbeweis und vollständige Dirty-Reglerabbildung erforderlich; aktuelle Karten/Körper-/Rezepthashes verwenden, keine erfundenen Georg-Werte. Norman Source only, B10 pending und Personae v16 lesend/3D gesperrt bleiben geschützt.

**Ein nächster Gate:** Plattform muss die dokumentierte native `sites_list_plugin_eligibility` für diese bestehende project_id im Work-Ausführungskontext verfügbar machen; danach alle Ergebnisseiten lesen und ausschließlich returned allowed GitHub-IDs verwenden. WS0 erhält diesen präzisen Plattformbefund im bestehenden Workflow KFB-WSA-TOOLBOX-ROSTER-R1-V409; keine Routine-Hub-/Cloudflare-Synchronisation.
