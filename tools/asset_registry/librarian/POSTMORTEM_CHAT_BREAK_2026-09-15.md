# KFB Asset Librarian · Postmortem nach Chat-Abbruch

Stand: 15.09.2026 · Dokumentations-Review nach beendetem Produktionschat. Keine Runtime-Änderung.

## Kurzbefund

Der Chat ist abgebrochen, aber der technische Stand ist nicht verloren. Der letzte geprüfte Code-Stand vor diesem Dokumentationscommit liegt auf `main` bei:

`3f6e8dcc5d00ff642488f7e5e1c76cd6ad052f84`

Commit: `Merge Asset Librarian v1.7 browse and filter pass`.

Die eigentliche Gefahr ist deshalb nicht verlorener Code, sondern **Dokumentationsdrift nach dem letzten Merge**.

## Was nachweislich fertig auf main liegt

### v1.6 · Town Workbench

Merge: `cb7eaa34d10a13ce904700f8bdca7bb352ae8ee6`.

Der Workbench-Code liegt in `tools/asset_registry/librarian/town-workbench.js` und ergänzt den bestehenden Librarian, statt eine zweite Registry zu bauen.

Nachgewiesene Funktionen:

- Town-Tab mit Environment, KayKit Characters und Character Props;
- Nature/Forest, Buildings/Town und Space/Sci-fi als UI-Gruppierungen auf vorhandenen Registry-Fakten;
- KayKit Mystery Series Priorisierung und Rig_Small / Rig_Medium / Rig_Large Filter;
- same-collection Character Props;
- lokaler candidate-only Scene Plan für Environment + Character + Prop (`kfb.town-scene-candidate.v1`);
- KayKit local/shared Motion-Auswahl am gewählten Character;
- externe Motion-Source wird auf dem gewählten Character über dessen eigenen Three.js AnimationMixer abgespielt;
- zero-track binding scheitert geschlossen.

Der dokumentierte v1.6-Browserlauf `34914515885` nennt unter anderem GothGirl, 165 konkrete lokale/geteilte Motion-Preview-Optionen und `Death_A` mit 69/69 gebundenen Tracks.

### v1.7 · Browse/Filter Pass

Merge: `3f6e8dcc5d00ff642488f7e5e1c76cd6ad052f84`.

Neue Hauptpunkte:

- sichtbare Site-Version v1.7;
- Primary Assets vs All Representations;
- bevorzugte Repräsentation je logischem Modell, aktuell GLB vor GLTF vor OBJ/FBX/DAE/3DS/BLEND;
- Animation-Source-Dateien werden aus normalem Primary-Browse herausgehalten;
- paging / Show more statt eines einzigen großen Resultsets;
- Multi-Select Type- und Format-Filter;
- UI-Typen wie Character, Weapon, Character prop, Environment prop, Building, Nature, Vehicle, Banner/signage, Animation source, Texture/image, Audio, Other 3D;
- Typen sind ausdrücklich Browse-Heuristiken und keine neue Registry-Wahrheit.

## TESTED RESULT · v1.7 CI

GitHub Actions `KFB Asset Librarian Browser Smoke`, Run `34919321337`, Head `3f6e8dcc…`: **SUCCESS**.

Alle Schritte grün, ausdrücklich einschließlich:

- bestehender v1 WebGL Regression;
- v1.3 Production Resources;
- v1.4 Live Registry + Rig Preview;
- v1.5 Animation Discovery / Framing / Permanent URL;
- v1.6 Town Workbench + On-character Motion Preview;
- v1.7 Browse Pagination + Multiselect Filter.

Evidence artifact: `kfb-asset-librarian-browser-smoke`, artifact `10377063453`, SHA256 `72b8a9272653af55731d4531701278aeebe097816a7f489824560dd3c9d5836f`.

Der parallel laufende alte GitHub-Pages-Job ist am Merge-Commit rot. Das ist nach Georgs bisherigem Deployment-Vertrag **nicht** der maßgebliche Asset-Librarian-Deploy. Ein neuer Cloudflare-v1.7-Deploy wurde in diesem Review nicht separat verifiziert.

## Die tatsächliche Abbruchkante

Der Code ist weiter als die Dokumentation:

- `index.html` und `app.js` melden v1.7;
- `README.md` beginnt noch mit v1.6;
- `CHANGELOG.md` endet bei v1.6;
- `BUILD_MANIFEST.json` beschreibt `1.6-town-workbench`;
- `RETURN.md` steht sogar noch auf v1.2.

Das ist der wichtigste Recovery-Befund. Ein frischer Chat darf daraus **nicht** schließen, v1.7 müsse neu gebaut werden. Er muss zunächst den bereits gemergten Stand lesen und die Dokumentation/Return-Schicht nachziehen.

## Warum der Chat wahrscheinlich zu groß wurde

Dies ist eine Einordnung aus der Git-Historie, keine Messung des verlorenen Kontextfensters:

- v1.5 Animation Discovery/Framing wurde direkt um v1.6 Town Workbench erweitert;
- v1.6 kombinierte World-Candidate-Browse, Character/Prop-Beziehungen, Scene Plan und echte externe Motion-Preview;
- unmittelbar danach kam v1.7 mit einer allgemeinen Asset-Klassifikation, Repräsentations-Deduplizierung, Paging, Multi-Filtern und Regressionserhalt;
- in weniger als zwei Stunden entstanden mehrere Feature-Schichten plus viele Test-Harness-Korrekturen.

Die Implementation ist durch Tests abgesichert, aber die letzte Dokumentationsrunde fiel sichtbar hinten herunter. Künftig nach einem kohärenten Slice zuerst Return/Manifest/Deploy-Pointer schließen, bevor die nächste allgemeine Browse-Schicht beginnt.

## Recovery-Auftrag für einen frischen Asset-Librarian-Chat

1. `skills/chat/RECOVERY_PATH.md` lesen.
2. Diesen Postmortem lesen.
3. Aktuelles `main` und `tools/asset_registry/librarian/` prüfen.
4. **Nicht v1.6/v1.7 nachbauen.** Zuerst README, CHANGELOG, BUILD_MANIFEST und RETURN mit dem tatsächlichen v1.7-Stand versöhnen.
5. Permanent URL gegen den aktuellen Main-Stand prüfen und Cloudflare-Deploystatus separat belegen.
6. Town Workbench anschließend nur entlang eines konkreten Town-Bedarfs erweitern. Kategorien bleiben Browse-/Workbench-Heuristik, keine Registry-Semantik.
7. Animation Lab bleibt Owner der finalen Motion-/Attachment-Kompatibilität; Town-Scene-Ausgaben bleiben candidate-only.

## Scope für den nächsten Town-Schritt

Nicht sofort weitere Taxonomie bauen. Der vorhandene Workbench kann bereits Environment, Character und Character Prop zusammenstellen und KayKit-Motions am Character vorspielen.

Als nächstes reicht ein konkreter Consumer-Handoff für die Geburtstags-/Town-Szene: wenige gewählte Environment-Kandidaten, FrizzleBob/GothGirl beziehungsweise die tatsächlich gewählten Actors, passende Motions und Props. Der Town-Consumer entscheidet Maßstab, Komposition und Runtime.
