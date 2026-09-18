# KFB Free Roam · Walk ↔ Drive ↔ Combat · Return / Recovery

## CURRENT · FR-S04-01 · 18.09.2026

**IMPLEMENTATION + SOURCE TESTED + PUBLIC BROWSER PASS · HUMAN REVIEW OPEN.** Auf Georgs Folgeauftrag wurden ein fester Testeinstieg und der begrenzte Slice-04-Fahrversuch umgesetzt. Die frühere Vorbereitung unten bleibt unverändert als datierter Ausgangsstand, nicht als heutige Aussage, dass keinerlei Runtime existiert.

**Fester Testeinstieg:** https://kayfabizarro.pages.dev/kfb-hub/free-roam/

**Erste feste Version:** https://kayfabizarro.pages.dev/kfb-hub/free-roam/versions/fr-s04-01/

Implementation-SSOT und aktuelle Runtime-Recovery: [Race / ChatGPT_web/free-roam/RETURN.md](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/main/ChatGPT_web/free-roam/RETURN.md).

**Tatsächlicher Public-Nachweis:** [PUBLIC_STATUS.md](https://github.com/georg-doc/kayfabizarro/blob/main/kfb-hub/free-roam/PUBLIC_STATUS.md). 9/9 reine Eingabetests, 19/19 Source-Browserchecks und separat 48/48 Quellen-/Byte-/Navigations-/Browserchecks auf der wirklichen KFB-Cloudflare-Adresse. Public-Run `35358106388`, Job `105642348266`, Artefakt `10553581108`. Keine menschliche oder physische Geräteabnahme daraus ableiten.

Getestete Race-Quelle `d98600ef52c9f1fc28bd93bcbbe8f6f177eece37`; Race PR #5 / Merge `04256ecb817e5d0e2e57a2476039294c26ceab79`; Public PR #57 / Merge `f044d7908d967e1cf8056b2f831a7d30529b1fda`.

Der vorhandene Slice-04-/Rapier-Spender fährt mit neuem Reverse-/Brake-Input und rohem Inputvergleich auf echten gebackenen Travel-Kontaktdreiecken. 81 Bodenproben validieren das trockene begrenzte Fixture. Eine feste lokale Schwerkraftrichtung, Maßstab und sichtbare Grenze sind explizit; das ist kein vollständiger globaler DRIVE-Receiver und nicht der laufende Travel-Host. Der frühere küstennahe Screenshotbefund wurde vor Veröffentlichung durch reine Standortauswahl korrigiert, nicht durch eine Ersatzwelt.

**Jetzt verfügbar:** ein originaler Kart, zwei Inputprofile, physisches Vor-/Rückwärtsfahren/Lenken/Bremsen/Hop, Pause/Reset/Orbit; daneben bestehende Ground8-/BOX1-/Resident-/World-Atlas-Vergleiche. Neue Free-Roam-Versionen erhalten unveränderliche Pfade und einen aktuellen Navigator-Zeiger. Owner-aktuelle Vergleichslinks sind keine eingefrorenen Altversionen.

**Weiter offen:** Human-Fahrgefühl; tatsächlicher Walk↔Drive-Transfer im vorhandenen Travel-Modusowner; sichere Ausstiegsvolumen; geparkter Wagen und Save/Reload; Charakter-/Fahrzeugwechsel in der neuen Probe; City-Quartier; Combat; Audio/Deformerintegration. Kein zweiter Spielerroot. Nächste Arbeit an genau dieser Receiver-/Übergabenaht, nicht erneut einen anderen Fahrzeugsolver entwickeln.

BOX1/v0.8 und Produktions-`race/src/physics.js` blieben unverändert. Travel/Arena/ToolBox behalten ihre Owner. Der aktive Astra-r3-Brief bleibt unverändert, der gebündelte Astra-Delta inaktiv; kein großer Astra-Lauf gestartet. Native ChatGPT-Site wurde mangels Werkzeug nicht erzeugt; die tatsächlich geprüfte Lieferung ist KFB-Cloudflare.

---

## Preparation r1 · erhaltener Ausgangsstand

**18.09.2026 · Preparation r1 · READY WITH OPEN DECISIONS**

Auftrag: [WALK_DRIVE_COMBAT_PREFLIGHT.md](WALK_DRIVE_COMBAT_PREFLIGHT.md), insbesondere §7. Dieses Ergebnis konkretisiert das KFB-Core-Zusammenspiel vorhandener Module. Es erzeugt weder eine neue Engine noch einen neuen Runtime-Owner. Der einzige aktive Astra-Ausführungsbrief bleibt [EXECUTION_BRIEF r3](EXECUTION_BRIEF.md); der große Lauf wurde hier nicht gestartet.

## Ergebnis

**Empfohlener Free-Drive-Spender: die vorhandene Production-Race-/Slice-04-Physik.** Sie hat bereits ein dynamisches Chassis, vier Suspension-Rays und freie Radlenkung. BOX1/v0.8 bleibt die akzeptierte Fahrgefühl-/Controls-/Präsentationsreferenz, nicht der freie Weltcontroller. Sein Streckenfortschritt plus seitlicher Versatz erfüllt freies Wenden nicht. Dies ist eine begründete Auswahl für den nächsten begrenzten Versuch, keine Freigabe eines Motorwechsels im bestehenden BOX1.

**Receiver: vorhandene Travel-Welt mit erweiterter WB0-Modusbrücke.** Ground, Drive und Flight sind Fortbewegung; Combat ist Handlung und Race eine Aktivität. Travel behält Welt/Anker/Modus/Persistenz, Race die Herkunft und fachliche Verantwortung seiner Fahrmodule. Animation/Deformer/Audio schreiben keine zweite physische Pose.

## Neue konkrete Quellenbefunde

1. Slice 04 bietet noch keine stabile Neutralphase vor dem Richtungswechsel, keine eigene begrenzte Rückwärtsgeschwindigkeit und keinen Boost-Eingang. Die negative Engine-Kraft allein erfüllt den vorgeschlagenen W/S-Vertrag nicht. Drift ist dort ein boolescher Wunsch, nicht bereits BOX1-Q/E samt Re-Grip.
2. Die WB0-Brücke unterstützt nur GROUND/FLIGHT. Beim Flight-Rückweg werden Owner/Präsentation schon vor dem möglichen Teleportfehler umgeschaltet. Daraus folgt kein atomarer Enter-/Exit-/Rollback-Vertrag.
3. Der Ground-Supportresolver wählt die höchste geeignete radiale Fläche. Er beweist weder freie Ausstiegsvolumen noch Wände/Unterfahrten. Die feste -Y-Gravitation, XZ-/Y-Prüfungen, Road-Checkpoints und Regionen der Race-Physik sind weitere explizite Anpassungen.
4. Ein vorhandener Quartiersspender ist gefunden: `tools/world_atlas/source/scenes/city-block.js`. Zwei Zellen enthalten gleichzeitig Gerade und Übergang. Baustellenobjekte stehen auf der Straßenachse. Das sind belegte Rezeptbefunde, noch keine gemessenen Mesh-Kollisionen.
5. Die dortige alte Aussage »KayKit City Builder nur ZIP« ist überholt: GLTF/BIN-Dateien existieren bereits am selben Asset-Pin. Der aktuelle ToolBox-Stage-First-Intake ist ebenfalls vorhanden; seine vollständige Funktionsabnahme ist damit nicht ersetzt.

Quellen, exakte Blobs und Lesetiefe: [SOURCE_REVIEW.md](WALK_DRIVE_COMBAT/SOURCE_REVIEW.md).

## Arbeitsunterlagen

- [CONTRACT_PROPOSAL.md](WALK_DRIVE_COMBAT/CONTRACT_PROPOSAL.md): Controls, Übergabetransaktion, Kamera, Persistenz, Physikraum und Combat-Anschluss.
- [FIXTURE_BUILD_ORDER.md](WALK_DRIVE_COMBAT/FIXTURE_BUILD_ORDER.md): vorhandenes City-Rezept, exakte Assetquellen, gezielte Änderungen und zusammenhängende Abnahme.
- [ASTRA_DELTA.md](WALK_DRIVE_COMBAT/ASTRA_DELTA.md): genau ein **inaktiver** konsolidierbarer Änderungsantrag für r3.
- [Quellprobe](WALK_DRIVE_COMBAT/probes/check-source.mjs), [ausgeführtes Ergebnis](WALK_DRIVE_COMBAT/evidence/source-probe.json), [additiver Changelog](WALK_DRIVE_COMBAT/CHANGELOG.md).

## Status je Naht

| Naht | Vorbereitung | Offener Nachweis |
|---|---|---|
| Motor-/Owner-Auswahl | PREPARATION READY | Empfohlener Slice-04-Spender muss im Receiver erprobt werden; BOX1 bleibt unverändert. |
| Reverse/Brake/Steer/Drift/Boost | READY WITH OPEN DECISIONS | Kleine benannte Input-/Profilanpassung; Werte sind Testvorschläge, noch kein Fahrgefühlurteil. |
| Walk↔Drive/Input/Kamera/Save | READY WITH OPEN DECISIONS | Tatsächliche Interaktionstaste prüfen; transaktionale Übergabe, Freiraum und Wiederherstellung implementieren. |
| Quartier | READY WITH OPEN DECISIONS | Bauauftrag konkret; Mesh-/Sidecar-/Größen-/Colliderprüfung noch auszuführen. |
| Sphärischer Drive-Kontakt | READY WITH OPEN DECISIONS | Runtime-Promotion BLOCKED bis begrenzter Physikraum, Up/Gravity und reale gebackene Kontaktgeometrie zusammen geprüft sind. |
| Ground→Combat→Ground | READY WITH OPEN DECISIONS | Bestehende Shot-/Action-/Muzzle-Kopplung lösen, ohne Arena-Player als zweiten Bewegungsroot einzubauen. |
| Astra-Delta | PREPARATION READY als Änderungsantrag | Nicht angenommen/konsolidiert; r3 bleibt der einzige aktive Gesamtauftrag. |

## Tatsächlich getestet

Die originale City-JS-Datei wurde lokal gegen ihren Git-Blob geprüft und als Datenrezept ausgewertet. **5/5 begrenzte Quell-/Rechenprüfungen bestanden:** Blobidentität, beide doppelten Straßenbelegungen, beide Baustellenpositionen, Zahl der Straßenteile nach vorgeschlagenem Ersetzen und ideale Kugelgleichung. Kein Donorrezept wurde geändert.

134 Platzierungen; 21 Straßenflächenplatzierungen auf 19 Zellen. Die Ersetzung statt Überlagerung würde 19 Straßenflächenplatzierungen ergeben. Die analytische Tangentenebenenrechnung verwendet R=5 und Körperhöhe 0.022 aus den Ground-Defaults. Ihre Toleranz von 5 % Körperhöhe ist ausdrücklich ein Vorschlag, keine gemessene Welt-/Fahrabweichung.

**Nicht getestet:** Modellabmessungen/Sidecars, Rapier-Dynamik, Rückwärtsfahrt, sphärisches Fahren, Ein-/Aussteigen, Combat-Integration, Browser, Deployment oder menschliche Spielabnahme. Lokaler Raw-GitHub-Zugriff scheiterte an DNS; Connector-Lektüre und die hashgeprüfte lokale Textprobe waren möglich. Keine private Race-/Arena-Vollquelle oder Assetkopie wurde in dieses öffentliche Dokumentpaket übertragen.

## Nächster begrenzter Schritt / Wiederaufnahme

Aktuelle Repo-HEADs und diese Quellenblobs abgleichen. Dann auf einem reviewbaren Kandidaten beim zuständigen Runtime-Owner genau die entscheidende Unsicherheit prüfen: **Slice-04-Fahrzeug mit benannter Reverse-/Brake-Anpassung auf gebackener Travel-Kontaktgeometrie im explizit begrenzten lokalen Physikraum**. Lenkwirkung vor/zurück, Hang/Normalen, Einheiten und Grenzen messen. Kein voller City-Neubau und kein alternativer Controller als Abkürzung.

Danach dieselbe Figur kontrolliert an dieses Fahrzeug übergeben, parken/aussteigen/Restore prüfen und die konkrete Combat-Handlungsnaht anbinden. Der gesamte Quartiersablauf bleibt das Ziel; ein isolierter Fahrtest zählt nur als Spenderbeweis. Die vorhandenen Ground=8-/Atlas-/BOX1-/v0.10-Gates bleiben erhalten. Erst die angenommenen Resultate in den einen Astra-Brief konsolidieren.

GitHub-Sync erfolgt beim Wiederaufnehmen und am Ende eines Arbeitsstands; keine Hintergrundüberwachung oder direkte Chat-zu-Chat-Kommunikation ist eingerichtet. Kein Terminal-Auftrag für Georg.
