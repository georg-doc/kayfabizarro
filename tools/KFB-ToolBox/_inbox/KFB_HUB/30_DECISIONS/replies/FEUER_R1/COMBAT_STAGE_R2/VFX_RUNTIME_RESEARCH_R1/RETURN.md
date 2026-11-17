# RETURN · VFX Runtime Research R1 · 17.11.2026

Quellcode-Recherche nach Georgs Ablehnung des Pistolen-Gunshots. Owner WSA Combat-VFX, Empfänger WS0. Repo georg-doc/KFB-Stunt-Car-Race, vorhandener Lieferzweig game/pistol-gunshot-r1-20261117, Recherche-Basis c60dc8aed5d452da6b8cb5ed03f5d9c4bae1c3fd. Kein PR/Merge. Kein Spieleinbau und keine neue Site-Veröffentlichung.

Bericht: RESEARCH.md. Quellledger: SOURCE_LEDGER.json (58 Einträge). Donor-Anatomie und Messgrenzen: DONOR_ANATOMY.json.

Ergebnis: Effekseer als Authoring-/gestaltete Effektquelle priorisieren; Quarks als direkten WebGL-Runtime-Kandidaten testen. Originale Projekte/Beispiele statt weiterer Eigenbau-Ersatzanimation. Eindeutig getrennt: neue duale EffekseerForWeb-API, veröffentlichte WebGL1.80.8-Runtime und vorhandener Patch-Adapter31f94d3. Quarks0.18.0 passt deklariert zu Three0.186.1, jedoch kein KFB-Shader-/Render-PASS. Bei Effekseer sind zusätzliche Audioinitialisierung sowie Farb-/Tiefenpfad konkret offen.

Tatsächliche Arbeit:17Quarks- und14 neue Effekseer-Originaldateien abgerufen und relevante Implementierungen gelesen; ältere native Effekseer-Initialisierung, originaler Patch-Player/Look/Demo/Lizenzen und drei editierbare Projektbäume geprüft. Offizielle Lizenz-/Download-/Editorangebote verifiziert. Quarks-Originaldemo selbst visuell gesehen. Effekseer zeigte nur die Bühne; deaktivierte Effekt-Schalter verhindern einen eigenen Hit-Abspielnachweis. Keine neue unabhängige Qualitätsbewertung, kein hörender Test und kein Runtime-/Leistungsbenchmark.

Aktueller empfangender Stamm: game/integration-r2@9fa6ddbd3f914c403a21453881cd44fdb406bfc5. Originale eigene Leuchtspur wurde als2.4m-Restsegment/55ms identifiziert; die bisherige Pistole bleibt verworfen. Bestehende53/100-C2-Kritik nicht umgewertet.

Ein nächster Gate: ein unveränderter, benannter Originaleffekt muss zuerst isoliert und danach an KFBs bestehender Farb-/Tiefen-/Taktnaht sichtbar funktionieren, bei genau einem AudioContext. Erst daraus folgt die Runtimeentscheidung.

