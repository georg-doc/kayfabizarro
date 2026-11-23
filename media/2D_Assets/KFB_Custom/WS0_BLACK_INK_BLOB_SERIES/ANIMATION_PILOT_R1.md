## Aktualisierung · 06.11.2026 · registrierter König und vorhandener SDF-Pilot

[ANIMATION_LANE_R2.md](ANIMATION_LANE_R2.md) und [ANIMATION_QUEUE_R2.json](ANIMATION_QUEUE_R2.json) konkretisieren die nächste Ausführung. King Ultimately ist als Librarian-Einzelquelle geprüft; eine noch offene Spiel-ID blockiert die Bild-/Motion-Produktion nicht. Native PNG455×515mit451×511Motiv und2pxRand;Sourcehash undRegistry-ID liegen vor. Der hiesige einzelne GIF-Fähigkeitstest ergab eine statische PNG,keine Animation. Für die nächste Ausführung ist deshalb ein tatsächlich GIF-fähiger Kanal erforderlich.

Vorhandener Piraten-GIF/Farb-/SDF-Atlas im Race-Zweig `assets/slop-anim-pilot-r1` wurde entdeckt;GIFbytegleich mit Georgs lokalem Beispiel. SDF-Outline und separate Light-wrap-/Randbehandlung sind belegt;Details im [Outline-Audit](OUTLINE_SOURCE_AUDIT_R1.md). Neue visuelle Priorität:Royal/Elite/Veteranen zuerst,ohne neue Kampfstufe aus dem Aussehen abzuleiten. R2 ersetzt die R1-Eingangshürde eines noch fehlenden registrierten Donors. Keine neue GIF-Datei oder Librarian-Animationsregistrierung in diesem Lauf.

---

# Slop-Motion · begrenzter Pilot und Agent-Auftrag R1

Status: PLAN / AUDIT, keine neue GIF-Produktion oder Laufzeitänderung. Der bestehende Librarian bereitet die Figuren bereits auf; diese Arbeit wird nicht dupliziert. Bilder-PASS und Motion-PASS sind getrennte Entscheidungen.

## Was vorliegt

Sechs lokale GIF-Dateien, fünf unterschiedliche Byte-Quellen. Jeder Loop hat sechs Frames, 1.32s oder 1.44s Gesamtdauer, Transparenz und Endlosschleife. Alle zeigen einzelne Figuren; auch „Sechsfaches …“ ist kein Sechser-Sheet. Die beiden Piraten-Dateien sind identisch. Die Königskrone berührt in Frames2/3 den oberen Rand; beim Zauberer bleibt nur1–2px Luft. Details, Zubehör und Körper bewegen sich teilweise mit. Der letzte→erste Übergang hat im Pixeldifferenztest keinen groben Ausreißer, ist damit aber nicht als wahrnehmbar nahtlos oder spielgeeignet zertifiziert. Keine fehlenden Generierungs-Prompts oder Ursprungs-IDs nachträglich erfinden.

Technikbelege: `ANIMATION_AUDIT_R1.md`, `ANIMATION_SOURCE_AUDIT_R1.json`, `ANIMATION_CONTINUITY_R1.json`. Dropbox-Originale unverändert; GIF-Binaries wurden in diesem Auftrag nicht in den öffentlichen Quell-PR kopiert. Die SHA256-Werte erlauben einen gezielten Import durch den bestehenden Owner. Drei PNG-Sheets im Ordner stimmen mit den bekannten Mechaniker-/Matrosen-/Piraten-Quellhashes überein; daraus wird keine automatische Identitätszuordnung der GIFs abgeleitet.

## Aktuelle Fähigkeit und offene Verbindung

Die [offizielle OpenAI-Bilddokumentation](https://developers.openai.com/api/docs/guides/image-generation#generate-animated-gif-output), gelesen06.11.2026, dokumentiert GIF-Ausgabe mit Bildreferenzen sowie einstellbare Framezahl und Dauer. Die vorhandenen Beispiele belegen zusätzlich Georgs lokalen ChatGPT-Workflow. Ein in diesem Chat nutzbarer wiederholbarer GIF-Batch-Aufruf wurde noch nicht ausgeführt oder verifiziert; die bisherige native PNG-Aufrufsignatur enthielt diese Steuerfelder nicht. API-Zugang, Kosten, Limits und ein produktiver Adapter sind hier nicht getestet. Keinen API-/CLI-Wechsel oder unbeaufsichtigten Großlauf aus der bloßen Existenz des Features ableiten.

## Ein Pilot vor dem Batch

1. WS0/Librarian liefert eine akzeptierte kanonisch gemappte Einzel-PNG-Quelle mit Originalhash, Registrierungs-ID, Baseline, Anker, Körper-/Prop-Bounds und ausreichendem Rahmen. Den vorhandenen Mumien-Schlummerloop nur als Bewegungsbeispiel betrachten; sein kanonisches Mapping ist derzeit unbekannt.
2. Ein Animation-Worker erzeugt genau einen Idle-Blink aus dieser tatsächlichen Identitätsquelle. Startwert passend zu den Beispielen: sechs Frames, etwa220ms je Frame; wirklich ausgegebene Zeiten messen. Keine komplette Neuproduktion einer Family.
3. Fester Bildrahmen und Root-Anker. Augenlidbewegung erlauben; Hut, Props, Schriftfreiheit, Zahnanzahl und Materialdetails schützen. Mund in diesem Pilot stabil. Für spätere Augenrollen/Mundloops je einen eigenen Jobtyp verwenden, statt alle Gesten auf einmal anzufordern.
4. Separater QA-Worker vergleicht jeden Frame mit dem akzeptierten Donor: Augenlogik, Form, Props, Details, Alpha, Randkontakt, Root-/Baseline-Verschiebung und Loop-Übergang. Schwerpunktverschiebung messen, aber beabsichtigte Verformung nicht automatisch als Fehler werten. Auffälligkeiten als TUNE sichtbar machen.
5. Georg bekommt Standbild/Donorvergleich, tatsächlichen Loop und Frameübersicht. Ein technischer Hash-PASS ersetzt das visuelle Motion-Urteil nicht. Ausgangsbild bleibt bei TUNE/FAIL gültig.
6. WS1 prüft exakt diesen Kandidaten in der vorhandenen Laufzeit und meldet Receiving-Head, Tests und sichtbaren Beleg zurück. Erst dann auf sechs bewusst verschiedene Figuren erweitern: ruhige Mimik, großer Hut, schwerer Prop, große Mundform, Cyborg-Detail, asymmetrischer Körper. Danach größere begrenzte Batches.

Geplantes Motion-Manifest `kfb.slop-motion/1`: kanonische Identität + Quell-Darstellung, Source-PNG-Hash, Intent/State, tatsächlicher Prompt/Provider/Modell soweit bekannt, Framezahl/-zeiten, gemeinsame Canvas/Baseline/Anker, Framehashes, Loop-/Alpha-/Detailbefunde, Georg-PASS/TUNE/FAIL und Runtime-Intake getrennt. Für die Ausführung gelten `ANIMATION_JOB_SCHEMA_R1.json` und `ANIMATION_QUEUE_R1.json` als Vorschlagsvertrag; noch kein neuer produktiver Registry-Typ.

## Entfernungsabhängige Darstellung · WS1-Vorschlag

Geprüfte Quelle: `georg-doc/KFB-Stunt-Car-Race`, Ref `cdd362a9c5ee5ca7d7e159001d6d1c29ad6e8997`, `src/npc/mobs2d.js`. Der gelesene Code lädt einen statischen Atlas mit TextureLoader und Rechtecken je Instanz. Automatisches GIF-Abspielen wurde dadurch nicht nachgewiesen. Es wurde kein Browser-/Game-Test ausgeführt.

Vorschlag: GIF als leicht prüfbares Abnahmeformat behalten; Frames zu einem gemeinsamen Sprite-Atlas bzw. einer von WS1 gewählten vorhandenen Textur-Animation ableiten. Das ist eine Integrationshypothese, keine schon funktionierende Laufzeitlösung. [Three.js TextureLoader](https://threejs.org/docs/pages/TextureLoader.html) beschreibt Textur-Laden, keine spezifische Slop-Motion-Steuerung.

- Fern: vorhandenes Standbild und bestehende Bewegung; keine individuellen Loop-Updates nötig.
- Mittel: bestehende Bounce-/Deformer-Bewegung, optional reduzierte Updatefrequenz nach Messung.
- Nah: zusätzlicher Mimik-Loop nur für sichtbare priorisierte Slops. Framephasen versetzen, damit eine Gruppe nicht synchron blinzelt.
- Auswahl bevorzugt nach projizierter Figurgröße auf dem Bildschirm, Entfernung als ergänzender Faktor. Schwellenwerte, aktive Anzahl und Frequenz erst am Zielgerät messen; Hysterese verhindert Flattern zwischen Modi.
- Root-Bewegung bleibt beim vorhandenen Bounce/Deformer. Enthält ein Loop schon Körperwippen, Wirkung reduzieren oder einen ruhigeren Loop wählen, damit nicht zweimal gewippt wird. Körper- und Gesichtsanimation bleiben unabhängige Ebenen.
- Statischer Fallback bei fehlendem/gesperrtem Loop, unsichtbare Figuren nicht fortlaufend dekodieren, begrenzter gemeinsamer Cache statt unbeschränkt einer Textur pro Figur.

Nachweis: identische Quelle vor/nach Umschalten, keine Positionssprünge, kein abgeschnittener Hut, saubere Kanten auf beliebigem Hintergrund, erhaltene Treffer-/Kollisionslogik, Speicher-/Framezeitmessung mit benannter Menge sichtbarer Slops. Bestehenden Instancing-/Renderpfad erweitern; keinen zweiten Mob-Renderer einführen.

## Rollen des Agentenlaufs

Integrator WSA besitzt Paket/Branch. Animation-Worker arbeitet nur an benannten Eingangs-IDs und einer begrenzten Jobzahl. QA-Worker schreibt Befunde, keine produktiven Asset-Änderungen. WS0 steuert Mapping und Priorität, Librarian behält kanonische Registrierung, WS1 die Laufzeit. Jeder Job hat einen dauerhaften Status; UNKNOWN wird vor Retry aufgeklärt, Duplikate über Quellhash+Motion-Intent+Version vermieden. Nach zwei nicht verbessernden Reparaturen die kleinste problematische Motion parken und den übrigen Batch fortsetzen; das Standbild nicht verwerfen.

Dieser Auftrag hat einen separaten read-only Prüf-Agenten tatsächlich eingesetzt und seine Berichte gesichert. Es läuft kein unbeaufsichtigter Generator im Hintergrund. Nächster Übergang ist der gemappte Einzelmaster und der Fähigkeitsnachweis für genau einen identitätstreuen Blink-Pilot.
