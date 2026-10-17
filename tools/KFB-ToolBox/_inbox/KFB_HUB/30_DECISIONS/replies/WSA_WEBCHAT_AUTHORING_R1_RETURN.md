# WSA Webchat authoring R1 Return
18.10.2026 · Owner: bestehendes KFB Triplets Plugin / Asset Library Dramatis Personae

## Ergebnis für Georg
KFB Triplets **0.4.0** ist als dasselbe private Plugin aktualisiert. Ein neuer Skill begleitet Figuren, Scenelets und Dioramen im normalen Webchat: Quellen lesen, gemeinsam entwickeln, bestätigte Werte von Ideen trennen und auf ausdrücklichen Speicherauftrag einen GitHub-Änderungsvorschlag anlegen. Gewöhnliche Text-/Datenupdates benötigen keinen Work-Auftrag und keine Site-Codeänderung. GitHub muss im jeweiligen Webchat tatsächlich verfügbar und autorisiert sein.

Die bestehende private Asset Library ist als **v17** veröffentlicht. Dramatis Personae enthält den Webchat-Einstieg, eine klar markierte Vorschlagsansicht und den zusätzlichen Blattreiter **Scenelets / Dioramen**. Regulärer Bestand und Vorschläge bleiben getrennt. Nach Übernahme durch WS0 reicht GitHub aktualisieren.

Beispiel: „KFB Triplets: Lies Lady Dorys aktuellen Stand und entwickle mit mir ein Scenelet für ihren ersten Auftritt. Lass bestätigte Fakten stehen und kennzeichne neue Ideen.“ Danach: „Diese Fassung als Änderungsvorschlag speichern.“

## Identitäten und exakte Stände
- Plugin: https://chatgpt.com/plugins/plugins_6accc59cff7481918f9113f65965335f
- Backend-ID unverändert: plugins_6accc59cff7481918f9113f65965335f; USER / PRIVATE.
- Version 0.4.0; Release pluginrel_6ad401d76fa88191b33a2ac0c8f74e68. Vollständige Rückleseprüfung aller 14 Dateien.
- Alte Spoken-Triplet- und Writer’s-Room-Skillordner bytegenau erhalten; gleicher Startprompt, gleiche Reihenfolge und Typ. Portable Manifest-Metadaten verlustfrei aus bestehender Kompatibilitätsfassung übernommen.
- Site unverändert: appgprj_6ac1afef08148191b62b95f184bf845e.
- Normale Adresse: https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=dramatis-personae
- Site v17; Source 9275d53c085d37e614db3a6ddcca4f1437b5c575; Version-ID appgprj_6ac1afef08148191b62b95f184bf845e~appgver_750db001db948191bfe0fe4d2147727e; Deployment appgdep_6ad4028d7e508191b822901021f4e063, succeeded.
- Archiv SHA256 144120864b1d144957b654d0b283f196353c4748ccf8ff0f6888869e46a3ae56; 38 Dateien / 7.045.120 Bytes.
- Repo georg-doc/kayfabizarro; Register docs/kfb-decisions-register-2026-10-11.
- Implementierungscheckpoint a3146bf861693b9eecb1dbfc80d1d62e89a9b364: 21 Dateien unter replies/WEBCHAT_AUTHORING_R1, alle exakt rückgelesen. Enthält vollständiges Plugin, 4 Site-Quelldateien, Vertrag und portable Tests. Keine kanonische Figur geändert; kein Merge.

## Autorenvertrag
Die neueste Georg-Anweisung verlangt Vorschläge und hat für diesen Workflow Vorrang vor BRIEF_WSA_CHARACTER_EDITS_R2 V-416 (damals direkter Register-Write).
- Figurenblätter bleiben FIGURES_R1/characters/<id>.character.json; Aussehen bleibt in der Figurenkarte / ToolBox-Studio.
- Neue Figuren nur nach ausdrücklichem Inhaltsauftrag. Fehlende Karte bleibt null/todo, kein erfundener Körper.
- Ein neuer Vorschlag entsteht auf characters/edit-<id>-<date>-<nonce> oder scenes/edit-<id>-<date>-<nonce>. Vollständiges Kandidatendokument plus kfb.webchat-proposal/1 Beleg mit Base-Commit/Blobs, Zielen und Änderungen. Lease, Rücklesen und UNKNOWN-Reconciliation; kein automatischer Merge.
- GEORG nur für ausdrücklich gelieferte/angenommene Werte; ein Speicherauftrag allein adelt nicht alle DESIGN-Ideen. Frühere Werte/Quellen und conflicts bleiben erhalten.
- Scenelets/Dioramen sind **redaktionelle Konzepte** (kfb.authoring-scene/1) unter WEBCHAT_AUTHORING_R1/scenelets bzw. dioramas. Sie beschreiben Figurenwünsche, Reibung, Beats, räumliche Beziehungen und belegte Asset-Verweise. Keine neuen Runtime-Szenen, kein Ersatz für kfb.world/1 oder bestehende resident-set-/Performance-Owner.
- Keine Spieler-Erinnerungswerte, Roh-GLBs, privaten Lichttricks oder erfundenen Clips. Tier 0 und bestehende Figuren-/Lichtmodule bleiben verbindlich.
- WS0 übernimmt geprüfte Vorschläge in den Register-Bestand. Erst danach erscheinen sie regulär auf der Site.

## Tatsächliche Prüfung
- **9/9 gruppierte Sicherheitsprüfungen PASS**, unabhängig wiederholt: Ref-/Pfadgrenzen, geschützte Figurenkarten, Quellstatus, fehlerhafte/null Dokumente, Receipt-Zielbindung, keine fingierte Freigabe, 404 vs. Fehlerzustand.
- Unabhängige Quellenkritik: alte Skills unverändert; Proposal-only, Status/Provenienz, 3D-Sperre und bestehende Owner erhalten.
- Echter GitHub-Transporttest: characters/edit-lord_hunky-2026-10-18-a86b108d935a491480d04f84bfe6ab76; Head 32054508059f62ff32f8862e075a0fce45c4d4d5. Explizit testOnly; keine Figurenwerte geändert.
- Create-only-Kollision tatsächlich geprüft: erneutes create_branch mit gleichem Branch und anderem Commit lieferte **422 Reference already exists**. Branch blieb exakt am alten Head. Danach bewusster Update mit expected_sha/force false, exakter Receipt-Readback; Hunky-Blob unverändert 11251a74925fd5f8615145da89a7f374b223f104.
- Lokale Browserprüfung gegen echte GitHub-Reads: 15 Figuren / 11 Blätter, Registeransicht; Prüfvorschlag @32054508 sichtbar als nicht übernommen und technischer Test; ungültiger main-Ref verweigert; nicht vorhandener Vorschlag HTTP404 behält klar gekennzeichneten bisherigen Stand; Rückkehr zum Register; neuer Szenenreiter; 3D weiterhin gesperrt.
- Bildbeleg: work/kfb-webchat-authoring-r1/proofs/personae-proposal-local.png. **Lokaler Beleg, kein Live-Screenshot.**
- Native Sites-Veröffentlichung und exakte Source-Provenienz bestätigt. Aufruf der privaten veröffentlichten URL zeigt im verfügbaren In-App-Browser Anmeldung erforderlich. Daher **keine visuelle Host-Abnahme behauptet**. Zugriffskreis wurde nicht erweitert.

## Grenzen und offene Punkte
1. Der neue Skill ist veröffentlicht/rückgelesen; sein Verhalten in einem frischen normalen Webchat wurde nicht als separater Gesprächslauf getestet. Der tatsächliche GitHub-Proposal-Transport wurde hier mit nativen Werkzeugen geprüft.
2. Der Plugin-Link öffnet das Plugin; er überträgt nicht automatisch den ausgewählten Figurenkontext. Der Webchat liest die von Georg benannte Figur frisch von GitHub.
3. Die Site prüft Proposal-/Szenenstruktur und zeigt Quellenstatus. Sie ist kein forensischer Nachweis, dass jede Branchänderung exakt dem Receipt entspricht; das endgültige Rücklesen/Diff bleibt Autorenchat und WS0-Aufgabe.
4. Keine neuen fiktiven Charaktere oder Szeneninhalte auf Vorrat erstellt. Noch keine spielbare Diorama-/3D-Vorschau.
5. ToolBox bleibt v11; direkter Site-Speicherknopf bleibt separat an Sites-Eligibility blockiert. Diese Erweiterung umgeht ihn nicht, sondern nutzt den bereits funktionierenden Webchat-GitHub-Weg. Norman Source only, B10 pending und Personae-3D-Sperre bleiben bestehen.

## WS0 und nächster Schritt
WS0 erhält diesen Return im bestehenden Production-Control-Workflow KFB-WSA-TOOLBOX-ROSTER-R1-V409. Kein neuer Hub, keine Cloudflare-Arbeit, keine neue Site und kein zweites Plugin.
Nächster produktiver Schritt: Georg entwickelt im normalen Webchat eine konkrete Figur oder Szene; der Chat sichert auf seinen Auftrag einen echten Inhaltsvorschlag und liefert den vorausgefüllten Site-Link. WS0 entscheidet die Übernahme. Keine Kopierarbeit oder Work-Neuveröffentlichung pro gewöhnlichem Inhaltsupdate.
