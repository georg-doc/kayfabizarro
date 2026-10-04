# FEATURE_PARITY · Export 2026-09-17-r1

Bezugspunkt ist der Projektstand selbst (kein Vorgänger-Export). Alle Funktionen sind im Paket enthalten; der Status beschreibt ihre **Portabilität**.

| Funktion | Status | Quelle | Nachweis |
|---|---|---|---|
| Resident-Auswahl, 21 Vignetten | `PRESERVED` | `data/cast.js`, `KFB_Resident_Atlas_S6.html` | 22 Auswahleinträge geprüft |
| Ensemble-Ansicht mit Neuverteilung | `PRESERVED` | `lib/atlas.js` (`arrange`/`respace`) | gebaut und gemessen |
| Attachment-Mechaniken (11 Optionen) | `PRESERVED` | `lib/atlas.js` (`buildVignette`) | je Mechanik mindestens ein Resident im Einsatz |
| Pose-Bindung mit Bindungsquote | `PRESERVED` | `bindReport` | 69/69, 52/52, 16/16, 18/18 je Rig-Klasse belegt |
| Motion-Audition über alle Figuren | `PRESERVED` | HTML `fillClips` | „orcA 18/18, orcB 18/18", zwei Mixer |
| Legacy-Figuren-Zusammensetzung | `PRESERVED` | `legacyAssemble` | 4/4 Teile je Figur |
| Farbvariante über Textur-Tausch | `PRESERVED` | `applySkin` | Cleric 8, Hero Man 7 Materialien |
| Prozedurale Zusatzbewegung | `PRESERVED` | `strumClip`, `reachChain` | Animatronic-Anschlag, Cleric-Armnachführung (letztere wieder ausgebaut, Mechanik bleibt) |
| Studio: Anfasser, Bone-Posing, Korrektursammlung | `PRESERVED` | `lib/studio.js` | im Panel bedienbar |
| Studio-Patch-Export | `PRESERVED` | `lib/studio.js` | `<resident>.studio-patch.json` |
| Referenzbild-Blende | `PRESERVED` | HTML `#refimg` | wirkt für 19 von 21 Residents; Orc Warband und Prototype Pete haben kein Promo im Repo |
| Enthüllungs-Zeitleiste | `PRESERVED` | `lib/studio.js` | Toy Soldier, 4,8 s |
| Key-Art-Kamera mit manuellem Override | `PRESERVED` | `keyArt.manualCamera` | Black Knight, Demon Lord, Orc Brute, Monstrosity |
| Messsonden | `PRESERVED` | `tools/*.html` | eigenständige Seiten |
| **3D-Assets** | `PRESERVED (BY_DESIGN_REMOTE)` | zentrale Repo-Quelle, gepinnt | Nach Entscheidung nicht mitkopiert. Alle 121 Referenzen mit Pfad, Pin und Laufzeit-URL in `ASSET_MANIFEST.json`. Zur Laufzeit geprüft: „alle Pfade auflösbar“ je Resident. |
| **three.js-Laufzeit** | `PRESERVED (BY_DESIGN_REMOTE)` | unpkg-Import-Map, 0.184.0 gepinnt | Gleiche Logik wie bei den Assets. Für echten Offline-Betrieb wären fünf Dateien zu spiegeln — eigene Aufgabe, nicht gebaut. |
| **Vollständiger Browser-Zustands-Export** | `REIMPLEMENTATION_REQUIRED` | — | Der Auftrag verlangt `localStorage`/IndexedDB als JSON. Nur der Studio-Patch pro Resident ist exportierbar. |
| **Import von Studio-Patches** | `REIMPLEMENTATION_REQUIRED` | — | Export existiert, Import nicht. Einpflegen ist bewusst Handarbeit (Entscheidung S6), ein Import-Pfad wurde nie gebaut. |
| Unterpfad-/Deep-Link-Betrieb | `NOT_TESTED` | — | Erwartung dokumentiert in `DEPLOYMENT.md`, nicht geprüft. |
| Mobile Bedienung | `NOT_TESTED` | — | UI nicht responsiv, Backlog Scheibe G. |

Gesamtstatus `PORTABLE_EXPORT_COMPLETE`, online-portabel. Assets und Laufzeit sind **per Entscheidung** extern und gepinnt, also kein Fehlteil — diese Einordnung war in der ersten Fassung falsch und ist korrigiert.

Echt offen bleiben: zwei `REIMPLEMENTATION_REQUIRED` (vollständiger Zustands-Export, Import von Studio-Patches) und zwei `NOT_TESTED` (Unterpfad/Deep-Link, mobile Bedienung). Dazu ein `NOT_RUN` im Testbericht: der Start aus dem entpackten Paket über HTTP.