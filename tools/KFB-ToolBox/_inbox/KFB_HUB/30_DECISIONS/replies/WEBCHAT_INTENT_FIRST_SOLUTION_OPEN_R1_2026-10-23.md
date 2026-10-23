# KFB Webchat / WS0 feedback · Intent First · Solution Open · Evidence Before Prescription · R1

**Datum:** 2026-10-23. **Herkunft:** direkte Georg-Korrektur nach Surface-VFX-Staubdiskussion und hohem Claude-Code-Tokenverlust.  
**Zuständigkeit:** bestehender WS0/30_DECISIONS Steuerungsowner für Briefing- und Webchat-Qualitätsregeln. **Keine neue Runtime-, VFX-, Art- oder Produkt-Ownerinstanz.**  
**Status:** **GEORG FEEDBACK / PROZESS- UND ZIELKORREKTUR**; nicht als neuer Shader-/Engine-/Implementierungsauftrag auslegen. Als Working-Rule zu berücksichtigen; eine etwaige eindeutige V-Nummer / Aufnahme in das generierte DECISIONS-Register vergibt WS0 beim nächsten kanonischen Register-Build, nicht durch direktes Editieren der generierten DECISIONS.md/decisions.json.

## 1 · Was schiefging

- Georg zeigte zwei Staubfahnen-Referenzbilder und beschrieb den **gewünschten sichtbaren Effekt**: hinter dem Racer eine volle, kurvig nachlaufende, in Weltkoordinaten bleibende Staub-/Materialfahne mit Bewegung, Tiefe und Auflösung.
- Der Webchat legte voreilig eine **handwerkliche Konstruktion** fest: größere, künstlich aus Mesh-/Knet-Puffs zusammengebaute Wolken. Resultat nach Georgs Feedback: visueller FAIL und erheblicher zusätzlicher Claude-Code-Tokenaufwand.
- Die anschließende „KISS“-Korrektur legte ohne visuelle Belastungsprobe einen vorhandenen **160-Partikel-Pool als erste faktische Kapazitätsgrenze** nahe und schrieb diese mehrfach als verpflichtenden A/B-Baseline-Weg in Briefe. Damit wurde erneut ein technischer Hebel über das gewünschte Ergebnis gestellt.
- WS1b meldet nun, dass kurze Lebensdauer (<1 s) und geringe Dichte keine echte Spur erzeugen. **WS1bs Vorschlag** lautet ungefähr 10–20× so viele kleine, einzelne nahezu transparente Partikel und 2–4 s Lebensdauer, die wachsen, steigen und verwehen. Dies ist eine **plausible, aber nicht unabhängig verifizierte Hypothese**, **keine neue Vorgabe** oder garantierte Performance.
- **Lehre:** Falsch spezifiziert wurde primär die Problemlösung, nicht das Tool. Ein Designbrief darf den visuellen Intent nicht durch selbst erfundene Designobjekte oder unvalidierte Optimierungszahlen verdrängen.

## 2 · Neue verbindliche Webchat-Arbeitsweise

**Kurzform: INTENT FIRST · SOLUTION OPEN · EVIDENCE BEFORE PRESCRIPTION**

1. **Ergebnis und Referenz zuerst.** Vor jeder Empfehlung die von Georg beabsichtigte Wirkung benennen: was aus Spielkamera/Top-down sichtbar sein soll, welches Bewegungs- oder Nutzungsgefühl, welche referenzierte Formlogik. Eine Referenz ist **Ziel**, nicht automatisch Mesh-, Material-, Shader- oder Partikelbauanleitung.
2. **Gestalterische Verbote nur aus tatsächlich gemeldetem FAIL ableiten.** Nicht ungefragt den visuellen Stil „konkretisieren“ zu Knetkugeln, Blobs, generischen Shapes, Template-UI etc. und dann in Produktion geben. Weder generiertes Bild noch ansprechende Theorie beweisen Zielparität.
3. **Lösungsoptionen offenhalten.** Vor der Festlegung mehrere plausible technische Wege (Donor wiederverwenden, Emissionsstrategie, Partikelanzahl/-lebensdauer, wenige Mischformen, materialseitiges Verfahren) an WIRKUNG, Reproduzierbarkeit, Aufwand, Leistung und Reversibilität vergleichen. **KISS** heißt kleinster wirksamer Versuch, nicht minimaler Partikelzähler oder primitive Form um jeden Preis.
4. **Zahlen als Parameter, nicht als Kanon.** Werte aus bestehendem Code (z. B. 160 Punkte) sind **Beobachtung/Baseline**, keine Qualitätszielvorgabe. Werte eines Builders (10–20×, 2–4 s) sind **Testbereiche/Hypothesen**, keine PASS-Fakten. Vor visueller und GPU-Bestätigung keine „maximal 160“ oder „genau 3200“ in einen verpflichtenden Brief übernehmen.
5. **Erst Quelle/Donor sichtbar isolieren**, dann kleines A/B im echten Produkt. Gleiche Szene, Kamera, Pfad und Referenz. Ein geladenes Modul beweist noch kein Design; Bilder/Bewegtbild und Zielgeräte-Leistung belegen es. Bei visuellem Fehlversuch **Approach wechseln**, nicht stundenlang einen falschen Konstruktionstyp reparieren.
6. **Brief trennt klar:** `GOAL / MUST PRESERVE / PROHIBITED BY GEORG / OPTIONS-HYPOTHESES / TEST EVIDENCE / OWNER / ONE NEXT GATE`. Nicht nach außen suggerieren, der Webchat habe ein nicht demonstriertes „mentales Modell“ der gewünschten Wolke oder ein laufendes Resultat gebaut.
7. **Keine unnötigen Folgefragen, Bauaufträge oder Zusatz-Werkzeuge.** Nutzerinitiierte Ideation/Recherchen bleiben Lösungssuche; nur ausdrücklich freigegebene Ausführung bekommt eine Implementierungsspezifikation. Keine Bildgenerierung, wenn der Nutzer technische Diskussion wollte.

**Gilt für KFB-Webchats/Brainstorming/WS0-Briefings mit offenem visuellem, bewegungs- oder gameplaybezogenem Outcome.** Nach eindeutiger Georg-Entscheidung und echtem Golden kann ein Owner selbstverständlich eine erwiesene technische Route verbindlich sperren/freigeben. Vorher nicht.

## 3 · Konkreter Staub- und WS1b-Handoff (ersetzt nur unbewiesene Methodenvorgaben)

**Outcome:** dicht wirkende, geschwungene, auch nach einer Kurve verbleibende Staubfahne, die aus der tatsächlichen Fahrzeugbewegung stammt; sichtbar aus Chase- und Oberkamera; Staubtönung nach Material/Biom; zeitlich glaubwürdiges Ansteigen, Ausbreiten, Abklingen. Die Nutzerreferenz bleibt maßgeblich.

**Georgs echtes Negativfeedback:** keine erfundenen Knet-/Mesh-Wolkengebilde, keine zusammengesteckten Kugelstapel oder erzwungene Fake-Blobs. Ein **partikelbasierter Versuch wird bevorzugt**, aber dessen technische Teilparameter bleiben offen. Nicht auf der Wortwahl „Knetwolke“ als Gestaltungsobjekt aufsetzen.

**Technische Ausgangslage:** `vehicleRig.js` hat historischen Pool von 160 Punkten, `kfb-flight-vfx.js` andere Pools; `k2t.signals.drift` bereits vorhanden; Source-Farbe heute noch height-/slope-basiert. **160 ist nicht verbindlich**, auch kein „Optimierungsziel“. WS1b soll den heute wirklich aktuellen lokalen Code/Owner-Stand vor Verwendung feststellen.

**WS1b-Vorschlag als Hypothese, nicht Produktbeschluss:** Partikeldichte um ca. Faktor 10–20 erhöhen, Lebensdauer testweise 2–4 Sekunden; geringe individuelle Deckkraft, alters-/geschwindigkeitsabhängige Größe und Wind-/Driftverhalten. Möglichst viele kleine Elemente können plausibler sein als wenige große runde Sprites, jedoch könnten transparente Überdeckungen teuer werden. **Nicht ohne A/B behaupten, dass dieser Bereich nötig oder performant ist.**

**Prüfauftrag, falls WS0 die sowieso laufende WS1b-Arbeit explizit entsprechend priorisiert:**
- Reale referenzgestützte A/B-Bildfolge **gleicher Driftstrecke** (seitlich/chase/top), korrekte World-Space-Trajektorie, länger verbleibender Nachlauf, Übergänge ohne runde Knetklumpen.
- Der Builder sucht den kleinsten **optisch ausreichenden** Partikel-/Lifetime-Bereich nach wenigen klar unterscheidbaren Varianten; keine Token-intensiven Schönheitsreparaturen eines sichtbar falschen Ansatzes.
- Zielgeräte-GPU vor/nach, transparenter Overdraw, Rahmenbedingungen/Limits und Reversibilität berichten. Qualität zuerst als visuelles Gate; Performance als messbarer zweiter Gate. **Kein** willkürliches 160-/1600-/3200-PASS-Gate.
- Aktuelle Figurenlicht-Aufgaben `figamb=1` und laufende Tests bleiben unangetastet. WS0 plant die Staubprobe ohne Konflikt mit laufendem Build und bestehenden Source-Ownern; kein neuer Runner/Stage/Site notwendig allein wegen dieses Dokuments.

## 4 · Dokumentenkonfliktauflösung

Dieses Feedback **SUPERSEDES methodisch** (nicht die faktischen Codefunde):
- `WS0_PARTICLE_FIRST_SURFACE_VFX_R1_2026-10-22.md` und `WS0_PARTICLE_FIRST_VFX_SOURCE_BRIDGE_R1_2026-10-22.md`, wo „zuerst bei 160 bleiben“, „fixed 160 as acceptance“ oder ausschließlich ein enger Test vorgeschrieben wurde.
- Die alte `TEST_REPORT`-Source-QA bleibt wahr: „Im untersuchten Stand 160“. Sie beweist **nicht**, dass 160 genug oder ein hoher Wert automatisch besser ist.
- `CANON_3D/CANON_3D_R1.md` und bestehende Golden-Donors bleiben als Ergebnis-/Look-Qualitätskontext gültig, werden durch die neue Webchat-Prozessregel nicht abgelöst.

**Ein nächster Gate:** WS0 übernimmt diese Georg-Korrektur ins aktive Arbeits-/Briefing-Register und stimmt mit der bereits laufenden WS1b-Sitzung eine **referenzbasierte, ergebnisoffene Staubfahnen-A/B-Probe** ab, sobald sie ohne Unterbrechung der laufenden figamb-Build-/Testreihe möglich ist. Der menschliche Lookentscheid bleibt bei Georg. Keine automatische Genehmigung eines zweiten Runtime-Owners, keinen Live-Merge.
