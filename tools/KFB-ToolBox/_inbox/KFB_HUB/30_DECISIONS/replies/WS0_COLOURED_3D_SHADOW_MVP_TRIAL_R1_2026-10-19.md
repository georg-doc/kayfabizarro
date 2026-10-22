# WS0 intake · Gesamtes Terrainkonzept mit Banden und Rampen · R1.2
19.10.2026 · Georgs Eincheck-Auftrag, präzisiert ca. 20:17 CEST.
**Dieser Auftrag ersetzt die fehlerhaften Fassungen R1 (nur Schatten) und R1.1 (Motion-Konzept).**
Der bestehende Dateiname ist ein historischer Link; er beschreibt den Gesamtumfang nicht mehr.

## Auftrag — Georgs tatsächlicher Umfang
Das **gesamte gemeinsam entwickelte Terrainkonzept** für WS0 sichern und im bestehenden MVP erproben:
- das vollständige Terrain-/Geländekonzept einschließlich **Banden**;
- die besprochene Rampenform, **nicht als höhenstufenartige Rampe**;
- der zusammengehörige Cartoon-Look mit einfachen Farbflächen und wenig Gradienten;
- die dunklere Farbmasse im unteren/vorderen Bildbereich, aus der jeweiligen Terrain-/Biompalette;
- echte geometriebasierte 3D-Schatten für Figuren und Racer: folgen Bewegung/Pose und tatsächlichen Empfangsflächen, farbig aus der Umgebungspalette; harte Kanten möglich, Überlagerung einfach und kontrolliert;
- keine gebastelten runden Fake-/Blob-Schatten als Ersatz.

**Vorhandener ähnlicher POC: WS1, auf GitHub** (Georgs direkte Korrektur). Nicht DS1. Zuerst diesen und den ursprünglichen Gesamtentwurf wiederverwenden.
Georgs letzte Präzisierung im Wortlaut: „Nein, ich meine unser ganzes Terrassekonzept, wie wir es entwickelt haben, mit den Banden, mit dem nicht höhenstufenartigen Rampending, so also das ganze Konzept wirklich.“
„Terrassekonzept“ nicht eigenmächtig zu einem stufigen Terrassen-System auslegen; das würde der ausdrücklichen Rampenkorrektur widersprechen.

## Quellenlage und ehrliche Lücke
Der aktuelle Chat enthält die Schatten-/Farbpräzisierung, aber **nicht die vollständige frühere Terrain-/Banden-/Rampenbeschreibung**. Der Projektverlauf nennt „Funktionsvergleich Roadster KFB“, 19.10.2026, als angrenzende Ursprungskonversation.
Ein zusätzlicher Gesprächsabruf war fehlerhaft und lieferte nur irrelevante August-Legacy-Dateien; diese sind **keine** Grundlage dieses Auftrags.
Der genaue WS1-GitHub-POC wurde in dieser Sitzung noch nicht eindeutig identifiziert. Darum sind Rampengeometrie, Bandenführung, Höhen-/Kantenmodell, Abmessungen und weitere ursprüngliche Konzeptdetails hier **nicht rekonstruiert** und dürfen nicht erfunden werden.
**Kein Anspruch, dass diese Notiz den ursprünglichen Gesamtentwurf bereits vollständig ersetzt.** Sie sichert den richtigen Gesamtauftrag plus bestätigte Details und sperrt die falschen Interpretationen.

## Empfänger und bestehende Owner
- WS0: ursprünglichen vollständigen Terrainentwurf und WS1-GitHub-POC zusammenführen, Quellen pinnen und den bestehenden MVP-Look-/Terrain-Auftrag daraus ableiten.
- WS1b: einziger produktiver Spiel-/Terrain-Integrationsweg im bestehenden kfb-planet-MVP; keine neue Runtime, kein separates Demospiel.
- Arbeitsroute laut aktueller Übernahme: combo/r2; öffentlicher Spiegel ws1/combo-r2; Status und Übergabe auf ws1/r3f-frame.
- Gemeinsames Licht-/Material-/Palettensystem bleibt; Schatten nur darin integrieren. Bestehende Banden-/Fahr-/Terrainmodule vor Neubau prüfen.

Frisch gelesen:
- Register: ARCHITECTURE_R1.md, KFB_WORKING_RULES_R1.md, STYLE_GUIDE_3D_R1.md, DECISIONS.md, LIGHT_MODEL_R2.md, BRIEF_WS1_LOOK_RUN_L2.md, BRIEF_WS1B_TAKEOVER_R1.md.
- ws1/r3f-frame: WS1_STATUS.md und WS1_HANDOVER.md.
- ws1/combo-r2: Verzeichnisse src, src/world, src/vendor, scripts, test, docs, ws1/proofs.
- WS1_STATUS §§72–75 zeigt vorhandene Mesa-/Farbdrehbuch-/Gelände-/Schattenarbeit; §§94–97 und die Übergabe benennen aktuellen MVP-/Owner-Stand. Das ist **kein Nachweis**, welcher davon Georgs gemeinter POC ist.
- V-429: ein gemeinsames Rig, Figuren werfen und empfangen Schatten. V-440/447: größenrobuster Bias/Frustum und Schattensaum-Prüfung. V-305/403: vorhandene Paletten-/Übergangs-Owner.
- Öffentlicher Spiegel ws1/combo-r2 bei Lektüre: 15d672792f6974114818bcd4acd5a311f3b17c6e. Vor Integration aktuellen WS1b-Head erneut prüfen.

## Genau ein nächster produktiver Schritt
**WS0 pinnt den vollständigen ursprünglichen Terrainentwurf zusammen mit WS1s GitHub-POC und lässt WS1b das gesamte zusammenhängende Konzept im bestehenden MVP als reversible Vergleichsvariante erproben.**
Vor Implementierung Quellen-Vollständigkeit herstellen: Banden, nicht höhenstufenartige Rampen, Terrainform, Farbgestaltung und Schatten gehören gemeinsam in den Auftrag. Eine Schattenprobe allein erfüllt ihn nicht.
Nachweis am bestehenden Produkt: gleiche Kamera/Route und echte vorhandene Figur/Racer vorher/nachher; Bandenführung und Übergänge, befahrbare Rampenform und Kontakt, Cartoon-Farbflächen und mitbewegte farbige Schatten gemeinsam sichtbar; kurzer Fahr-/Bewegungsclip und vorhandene Regressionstests. Keine neue Stage-Publikation allein für diese Intake-Notiz.

## Scope-Ausschlüsse aus den korrigierten Missverständnissen
Die Motion-Repos aus dem ersten Chat-Thema, Stop-Motion/Hit-Stop, PR #435 und ein Deck-Song-Clip sind **nicht der von Georg hier erteilte Terrain-Eincheck-Auftrag**. Keine automatische Übernahme dieser Punkte in die Terrainprobe. Sie bleiben separat bei ihren bestehenden Ownern.

## Return / Nachweis
Dokumentation und WS0-Auftrag; keine Runtime-Änderung, keine Produktabnahme.
Runtime-/Browser-/Performance-Tests: **0**. Neue Screenshots/Clips: **0**.
Offen: exakter vollständiger Terrain-Quelltext und eindeutiger WS1-POC-Pfad/Head. Kein Ersetzen dieser Lücke durch eine erfundene Spezifikation.
Georg muss nichts neu freigeben; der Auftrag zur Gesamtprobe liegt vor. Quellenwiederherstellung ist Arbeit von WS0/ausführender Sitzung.

## Additiver Changelog
- R1, 19.10.: zu enge Eingrenzung nur auf Schatten — **SUPERSEDED**.
- R1.1, 19.10.: falsche Erweiterung zum Motion-Konzept — **SUPERSEDED**.
- R1.2, 19.10.: Georgs tatsächlichen Gesamtumfang Terrain/Banden/Rampen gesichert; WS1/GitHub als POC-Quelle korrigiert; bestätigte Farb-/Schattenregeln erhalten; nicht verfügbare Ursprungsdetails ausdrücklich offen. Kein Motion-/Video-Auftrag aus dieser Zustimmung.


---

## 19.10.2026 · ADDITIVER DESIGN-PIN R1.3 – organische Farbflächen + echte palettenbasierte Shadow Maps

Georg hat die zuvor diskutierte Terrain-Farb-/Schattenrichtung **konkretisiert**. **Der bereits festgehaltene Gesamtauftrag und WS1/WS1b-Einzelowner bleiben unverändert.** Die Quelllücke betrifft weiterhin nur den noch nicht eindeutig identifizierten vollständigen Banden-/Rampen-Ursprungsentwurf und den exakten WS1-POC.

**Ausführliches technisch/gestalterisches Ergänzungsdokument für WS0 und Claude Code:**
`replies/WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1_2026-10-19.md`
(blobs/readback: erster Commit `aeeb02704a875eddc99104c2a5f87377c9445a98`; blob `574edcb7e962b8a0eb2080a1636e0c2cd12ac36b`).
**Begleitender Provenance-Testbericht:**
`replies/WS0_CARTOON_TERRAIN_PALETTE_SHADOW_TEST_REPORT_R1_2026-10-19.md`
(blob `c14aadd06729bd28ca6cee87c5eaf0575297435e`).

**Korrigierte Sachlogik:**
- Form/Collider: bestehender WS1-Owner; 3–4 breite unregelmäßige Farbflächen werden **nicht nach Höhe**, sondern über unabhängige maskierte Color Fields plus szenen-/biomgebundene Farbro​llen verteilt. Auf senkrechten Flächen müssen passende Tangential-Projektionen existieren. Domain-Warp nur als **unsichtbare Konturformung**, kein sichtbares Noise-/Gradient-Gesprenkel.
- Vordere Tonmasse ist eine ruhige **eigene grafische Farbmaske**, von echter Schlagschatten-Visibility verschieden und nicht als Bildschirm-Vignette/Blob.
- **Echte 3D-Shadowmaps mit den vorhandenen Animations-/Fahrzeug-/Terrain-Geometrien**; Receiver wählt Shadow-/Contact-/Edge-Farben aus seiner vorhandenen Bühnen-/Biompalette. Keine geklebten runden Fake-Schatten, keine schwarzgraue Standard-Multiply-Lösung; zwei gedeckelte, klare Schatten-Wertstufen sind Designoption.
- Spärliche farbige Cliff-/Bandenkanten dort, wo reale sichtbare Formbrüche vorliegen, keine globale schwarze Tusche.
- **Banden, nicht-stufige Rampen, Terrainform, organische Farbflächen, Schatten und Fahrkontakt gehören in einen gemeinsamen bestehenden WS1b-MVP-Vergleich.** Keine Shadow-only-Aufspaltung, keine neue Runtime, kein WB2-R4-Restart.

**Tatsächliche Prüfung:** 12/12 dokumentarische Source-Text-Assertions PASS; GitHub-Readbacks der Design- und Testdatei exakt. Shader-/3D-/Browser-/Performance-Tests 0. Keine source-isolierten Visuals in diesem Turn; keine Georg-Produktabnahme, keine Site/Cloudflare-Publikation.

**Genau ein nächster Gate (unverändert):** WS0 pinnt Original-Banden/Rampen-/Terrain-Entwurf und echten WS1-GitHub-POC und lässt WS1b eine einzige reversible Gesamt-Terrain-Variante im bestehenden MVP vornehmen. Claude Code liest als ausführender, von WS0 autorisierter Builder das neue Dokument, übernimmt aber keine eigene Runtime-Ownership.

## Additiver Changelog
- R1.3, 19.10.: vollständige Farbflächen-/Kanten-/Foreground-/Shadow-Designspezifikation und Testbericht als **neue Begleitdateien** hinzugefügt; Parent-Issue #439 bleibt bestehen. Keine alten R1/R1.1-Fehlfassungen reaktiviert.


---

## 2026-10-22 · Addendum R1.4 · Particle-First Surface VFX, kein künstliches Wolkenmodell

**Georgs Korrektur / verbindliche Design-Richtung:** Die zuvor vorgeschlagenen größeren, prozedural „gebastelten“ Knetwolken sind **verworfen**. Claude Code soll keine künstlichen Blob-, Kugel-, Ballon- oder Billboard-Staubwolken erstellen. Die Fahne entsteht aus den **vorhandenen kleinen gepoolten Partikeln**, nach echter Racer-Trajektorie, bestehendem `k2t.signals.drift`, Emissionsrate, Dispersion, Lebensdauer und **tatsächlicher Oberflächen-/Biom-Palette**. Wasser/Spray nutzt denselben Emitter mit kurzem ballistischem Profil und den bestehenden Wasser-Owner für Wakes/Ripples – keine Fake-Fluid-Simulation. Keine Ersatzschatten; Geometrie wirft weiterhin reale 3D-Schatten.

**Neue, direkt lesbare KFB-Unterlagen für WS0, Claude Code, WS1b:**
- `replies/WS0_PARTICLE_FIRST_SURFACE_VFX_R1_2026-10-22.md` (Design/Quellpfade/Grenzen, 160-Punkte-Baseline, `k2t` hat Drift-Signal bereits);
- `replies/WS0_PARTICLE_FIRST_SURFACE_VFX_TEST_REPORT_R1_2026-10-22.md` (14/14 dokumentierte Source-/Textprüfungen, tatsächliche Browser/Runtime/GPU-Tests 0);
- `replies/WS0_PARTICLE_FIRST_SURFACE_VFX_RETURN_R1_2026-10-22.md` (exakter Owner/Branch, offene Material-Palette-/Water-Receiver-Nähte, nächster Gate).

**Parent-Auftrag #439 bleibt** das ganze Gelände einschließlich Banden, nicht-stufiger Rampen, organischer Farbflächen und echter Schatten. Dieses VFX-Addendum ist eine *anschließende optionale, reversible same-scene A/B-Verbesserung* des bestehenden WS1b-Racers, **kein neuer Runtime-Owner, kein separater Cloud-Sandbox-Test und keine automatische höhere Priorität**. Beim späteren VFX-Gate zuerst das echte 160-Partikel-Modul im aktuellen WS1b-Stand source-isoliert und sichtbar zeigen.

### Additiver Changelog
- R1.4, 22.10.: Particle-First anstelle „Knetwolken“ konkretisiert; aktuelle WS1-Mirror-Quelle der Staub-Emitter, Drift-Signal und potenzielle Material-Palette-Naht gepinnt; Testmatrix und Return als Begleitdateien; keine Umsetzung, kein neuer Shader-/Runtime-/Cloudflare-Code.
