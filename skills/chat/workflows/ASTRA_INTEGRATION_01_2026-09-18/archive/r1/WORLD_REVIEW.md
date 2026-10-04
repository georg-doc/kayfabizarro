# World-Chat · Gegencheck für Astra Integration 01

**Status:** REVIEW REQUEST · PENDING · kein bereits erteilter Gegencheck.
**Ziel:** den produktiven Integrationsauftrag anhand des aktuellen World-/Travel-Stands schärfen, ohne einen zweiten Gesamtplan oder neue Runtime zu bauen.

## Auftrag an den World-Chat

Lies zuerst dieses Paket: START_HERE, EXECUTION_BRIEF, SOURCE_BASELINES und WORKSPACE_RECOVERY. Prüfe dann tatsächliches aktuelles `georg-doc/KFB-Travel-Globe/main`, relevante offene PRs sowie die von deinem aktuellen World-Return benannten Quellen. Der Snapshot in diesem Paket wurde am 18.09. gegen Travel `33c731c…`, Race `616c151…`, Arena `f6a59ad…` und kayfabizarro `6abb74f…` vorbereitet; neuere echte Befunde ausdrücklich ergänzen.

Du prüfst, nicht implementierst. Keine Reaktivierung von Birthday, keine neuen universellen Schemas, kein Umbau fremder Owner. Nicht bloß zustimmen: benenne die wenigen konkreten Änderungen, die ein kalter Astra-Executor benötigt, um das richtige Produkt statt einer technisch grünen Ersatzlösung zu bauen.

## Prüffragen

| Frage | Benötigte Antwort / Nachweis |
|---|---|
| Ist der World-Cursor aktuell? | Aktuelles HEAD, relevante PRs, jetziger Runtime-/POC-Einstieg, tatsächlich noch offene oder inzwischen erfüllte Ground-/Atlas-/Pilot-Gates. Alte Recovery-Sätze nicht pauschal übernehmen. |
| Ist der konkrete Consumerpfad richtig? | Lorekeeper/Tome/Staff, Hex-Schwelle und Travel-ROAD: korrekter Quellpfad, tatsächlicher Import, persistente Recipe-Felder, Save/Reload. Benenne den real vorhandenen Pfad statt einen neuen zu erfinden. |
| Stimmen Koordinaten und Kontakt? | POC-local/relative Slot ↔ sphärischer Anker, Up/Forward/Einheiten, Normalen, Terrain-/Card-/Road-/Bridge-Support. Kein zweiter Movement-Writer, keine Terrainfüllung unter Brücken. |
| Ist die World-Erfahrung erhalten? | Muss etwas zusätzlich gemeinsam sichtbar/lebendig sein? Sind WORLD/SEQUENCE/LIFE/FEEDBACK ausreichend konkret? Wäre eine neutrale Bühne vor dem Weltbild trotz dieses Briefs noch irrtümlich als Erfolg ausgebbar? |
| Stimmen Resident-/Animation-/ToolBox-Nähte? | Exakte Profile, Props/Hands, Clips und Mixer-/Root-Motion-Policy; welche Herkunft/Kompatibilität ist wirklich geprüft, welche noch offen? Keine Annahme, dass der zentrale UNVERIFIED-Animation-Eintrag alle vorhandenen Lieferungen vollständig beschreibt. |
| Passt Facility + Environment hinein? | Eigenständige Race-Topologie erhalten; spätere gemeinsame Anker/Exclusions und visueller Stil an echtem Anlagenentwurf. Was muss World liefern, ohne Race-Route/Kamera/Kontakt zu übernehmen? |
| Was bedeutet Arena-Anbindung in diesem Lauf? | Bestätige Grenze zwischen Hub-Rückweg, konkretem Datenimport und echtem World↔Arena-Portal. Vorhandene benannte Transition-/Ground-Verträge nennen, keine neue nahtlose Welt versprechen. |
| Ist der Umfang mit einem Work-Lauf sinnvoll? | Größte realistische Quelle-/Contract-/Deployment-Blocker, sinnvoll zusammenhängender erster Release. Integrationstiefe präzisieren, ohne identity-bearing Inhalte in einem bloßen Linkhub verschwinden zu lassen. |

Zusätzlicher Literal-Executor-Check: **Was könnte Astra bei wortwörtlicher Ausführung noch weglassen und trotzdem fälschlich Erfolg behaupten?** Für jeden solchen Fall eine konkrete Briefkorrektur angeben. Die im Router benannten Briefing-Postmortems gelten; kein zusätzlicher kostenintensiver Critic-Schwarm nötig, wenn dieser unabhängige Gegencheck die Perspektiven ausreichend abdeckt.

## Wie du ergänzen sollst

Bestehende r1-Texte und Source-Pins als historischen Snapshot erhalten. Hänge unten einen datierten Abschnitt an; umfangreichere Diffs können als neue `WORLD_REVIEW_r2_<Datum>.md` im selben Auftragsordner liegen und hier verlinkt werden. Ergänze außerdem CHANGELOG.md mit Autorrolle, tatsächlichen Quell-Commits, Art des Befunds und Auswirkung. Kein silent rewrite von Kernauftrag/Ownern, keine Statusänderung zu HUMAN ACCEPTED ohne Georgs konkretes Urteil.

Für jeden Befund:

`ID → Severity → konkrete Quelle/Commit → Ist-Befund → genaue Änderung im Brief → betroffener Owner → muss vor Work-Start entschieden sein?`

Abschluss mit **READY / READY WITH SCOPED CHANGES / BLOCKED**, ausdrücklich **Briefingreife**, nicht Runtime-Abnahme. Fehlende Kernquelle oder Owner-Konflikt ist BLOCKED für die betroffene Naht. Kein globaler Stop für unabhängige, freigegebene lokale Reproduktion.

## Konsolidierung vor Implementierung

WSA/Astra liest die Ergänzungen und trägt im CHANGELOG ein, welche übernommen, abgelehnt oder zur Entscheidung offen sind. Keine zwei konkurrierenden aktiven Aufträge. Bei notwendiger neuer Brieffassung alte Fassung unverändert archivieren beziehungsweise eindeutig als ersetzt kennzeichnen und START_HERE auf genau eine aktive Fassung zeigen lassen.

Routinepräzisierungen dürfen in den freigegebenen Auftrag aufgenommen werden; Änderungen an Scope, Ownern, Produktidentität oder humanen Gates gehen an Georg. Frühere positive Audio-/BOX1-Rückmeldung wird nicht pauschal zurückgesetzt.

## Ready-to-paste Nachricht

> @GitHub Bitte prüfe das Astra-Onboarding **KFB Integration 01** in diesem Ordner gegen deinen aktuellen World-/Travel-Quellstand. Lies WORLD_REVIEW.md und den zugehörigen EXECUTION_BRIEF. Ergänze konkrete Korrekturen, fehlende Quellen/Contracts und echte Gate-Updates additiv in WORLD_REVIEW.md und CHANGELOG.md, jeweils mit Repo/Commit und betroffener Naht. Prüfe insbesondere persistent World Recipe, POC→Travel-Koordinaten, Resident-/Animation-Import, Facility/Environment und die Grenze zur Arena. Kein neuer Gesamtplan, kein Runtime-Write, keine zusätzliche Registry. Abschluss: Briefing READY / READY WITH SCOPED CHANGES / BLOCKED; fehlende menschliche Abnahmen nicht selbst erteilen.

---

## Eingegangene Reviews

Noch keine. Dieser Platzhalter ist ausdrücklich kein Gegencheck-Ergebnis.
