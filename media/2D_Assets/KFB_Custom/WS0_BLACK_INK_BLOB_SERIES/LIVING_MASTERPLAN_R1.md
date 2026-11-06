## Aktualisierung · 06.11.2026 · registrierter König und vorhandener SDF-Pilot

[ANIMATION_LANE_R2.md](ANIMATION_LANE_R2.md) und [ANIMATION_QUEUE_R2.json](ANIMATION_QUEUE_R2.json) konkretisieren die nächste Ausführung. King Ultimately ist als Librarian-Einzelquelle geprüft; eine noch offene Spiel-ID blockiert die Bild-/Motion-Produktion nicht. Native PNG455×515mit451×511Motiv und2pxRand;Sourcehash undRegistry-ID liegen vor. Der hiesige einzelne GIF-Fähigkeitstest ergab eine statische PNG,keine Animation. Für die nächste Ausführung ist deshalb ein tatsächlich GIF-fähiger Kanal erforderlich.

Vorhandener Piraten-GIF/Farb-/SDF-Atlas im Race-Zweig `assets/slop-anim-pilot-r1` wurde entdeckt;GIFbytegleich mit Georgs lokalem Beispiel. SDF-Outline und separate Light-wrap-/Randbehandlung sind belegt;Details im [Outline-Audit](OUTLINE_SOURCE_AUDIT_R1.md). Neue visuelle Priorität:Royal/Elite/Veteranen zuerst,ohne neue Kampfstufe aus dem Aussehen abzuleiten. R2 ersetzt die R1-Eingangshürde eines noch fehlenden registrierten Donors. Keine neue GIF-Datei oder Librarian-Animationsregistrierung in diesem Lauf.

---

# Slop-Linie · Living Masterplan R1

Stand 06.11.2026. Owner: WSA für Gestaltung/Produktionspakete; WS0 für Steuerung und Intake; bestehender Asset Librarian für kanonische Assets; WS1 für Spielbetrieb. Quelle bleibt `SET_MANIFESTS_R1.json` in diesem Ordner, Repo `georg-doc/kayfabizarro`, Zweig `assets/ws0-ink-miners-2026-11-04`, Draft-PR #469. Diese Übersicht ist eine abgeleitete Planung, kein zweiter Asset-Katalog.

## Gesicherter Stand

Georg hat einschließlich der sechs Space-Crews **142 Sheets / 852 Darstellungen** akzeptiert. **140 Sheets / 840 Darstellungen** sind für den bestehenden Intake vorgesehen. Die historischen International-Couples-Ausnahmen und der alte Miners-FAIL bleiben bestehen. Der neue Mining/Oil-Trupp ist eine eigene Quelle. 794 unterschiedliche Authoring-Identitätsschlüssel ergeben sich aus `zustand_von || id`; das ist keine Zahl eindeutig registrierter Spielcharaktere. Mehrere Stufen oder Gefühlszustände gehören ausdrücklich zu einer Identität. 142/142 Manifeste wurden am aktuellen Abnahme-Checkpoint rückgelesen.

| Erprobtes Format | Sheets | Bedeutung |
| --- | ---: | --- |
| Sechs eigenständige Figuren, 3×2 quer | 118 | Family, Team, Themen- oder Deckgruppe |
| Drei Paare, 2×3 hoch | 3 | Je Reihe zwei eigenständig verwendbare Partner |
| Drei Bewohner in zwei Zuständen, 2×3 hoch | 2 | Je Reihe eine Identität, Zustand A/B |
| Zwei Dreier-Entwicklungen, 3×2 quer | 13 | RPG-Stufen oder Berufs-/Hierarchieentwicklung |
| Zwei Story-Trios, 3×2 quer | 6 | Je Reihe drei verschiedene zusammengehörige Figuren |

Die aktuelle Deck-Registry `media/kfb/index.json` enthält 130 Decks. 30 haben ausdrückliche thematische Slop-Bindungen; für 100 ist die Zuordnung noch nicht explizit. Das heißt nicht, dass für diese 100 neue Bilder benötigt werden. `COVERAGE_R1.json` und `DECK_COVERAGE_R1.json` enthalten die belegten Quellen. Diese Vollprüfung ist ein Planungs-Meilenstein; nicht nach jeder kleinen Abnahme wiederholen.

## Was wir erhalten

Eine vollständige, aufrechte, fußlose dunkle Tintenmasse mit weichen asymmetrischen Lappen und modellierter Knetoberfläche. Das Monster trägt die Rolle, nicht eine menschliche Figur im Monsterkostüm. Dunkles Anthrazit mit zurückhaltendem violettem Schimmer, feine Fingerabdrücke und kräftige, kohärent modellierte Stoff-/Holz-/Metall-/Lederprops. Große weiße/elfenbeinfarbene Augäpfel, rote Iris, schwarze Pupille, vollständig gefüllte Lider. Augen und Mimik bleiben sichtbar. Zähne entstehen innerhalb des Munds; keine Zähne außen an der Unterlippe.

Vor dem Kostüm kommen Silhouette, Blick, Lidform, Mundaktion, Körperhaltung und emotionaler Höhepunkt. Keine sechs Hutwechsel auf demselben Gesicht. Wenige markante Props mit einer verständlichen körperlichen Beziehung zur Figur; keine komplizierten Erklärmaschinen. Satire mit Verletzlichkeit und Herz, übertriebene Gewissheit und kleine praktische Freundlichkeit. Zwei weiblich gelesene Figuren in neuen normalen Sechsergruppen; bei Wiederholungszuständen/Stufen die Identitäten separat zählen. Historisch akzeptierte Besetzungen bleiben erhalten.

Die unveränderten sechs Originalreferenzen im Composer und deren SHA256-Ledger bleiben die Stilanker. Aktuelle PASS-Sheets sind zusätzliche Vergleichsbeispiele für Qualität/Format, keine automatische Kette immer neuer Stil-Eltern. Bei einer neuen Identitätsvariante oder Animation muss das tatsächliche freigegebene Einzelmotiv als Identitätsreferenz mitgegeben werden. Referenzdatei nur anzusehen genügt nicht.

## Ein integrierter Produktionsdurchlauf

1. Bestehende Families, Deck-Zuordnungen und offene Vorschläge prüfen. Ein klarer Satz beschreibt die neue soziale Situation und den visuellen Witz.
2. Format wählen; für jeden Slot Identität, Zustand, Beziehungen, Geschlechtslesart, Acting und ein bis zwei Props festhalten. Die Slot-Mimik bewusst gegenüber dem vorigen Run verändern.
3. Batch-Paket vor der Generierung speichern: Quell-Head, SOP, tatsächliche Referenzen/Hashes, Slotplan und vollständige geplante Aufrufe. Modell/Seed nur erfassen, wenn wirklich ausgegeben; sonst UNKNOWN/NOT_EXPOSED.
4. Frische referenzgestützte Bildjobs mit kleinen überprüften Gruppen. Neues/riskantes Format zuerst als Pilot; etablierte Sechserformate können in begrenzten Batches fortgesetzt werden. Timeout bedeutet UNKNOWN und wird vor einem Retry aufgeklärt.
5. Original-PNG unverändert sichern. Tatsächliche Pixelmaße, Hash, Alpha, Randabstände und Darstellung in beiden Reihen prüfen; Original, Checker, helle und dunkle Hintergründe sowie 64/96/160/192px-Ansichten vergleichen. Messung und visuelle Beobachtung getrennt erfassen.
6. Gleichzeitig aus dem eingefrorenen Slotplan Textentwürfe entwickeln: englische Persönlichkeit/Backstory, trockene deutsche FrizzleBob-Notiz, Rollen/Beziehungen. Die Texte bleiben DESIGN. Pro Identität eine Biografie, pro Darstellung Variantenhinweise; Paare/Trio zusätzlich Gruppenkontext.
7. Georgs tatsächliches PASS/TUNE/FAIL im Setmanifest persistieren. Ein Designer-PASS ersetzt weder Textfreigabe noch technische Freistellungsprüfung. Umgekehrt löschen spätere technische Hinweise den Design-PASS nicht.
8. Ein Integrator schreibt den kohärenten Satz aus Original, Prompt, Manifest, Karten, Biografien und QA. Exakten Branch-Head und alle beabsichtigten Dateien rücklesen. Kein automatisches Merge oder Live-Promote.
9. Bestehender Librarian/Verteiler übernimmt Id-Mapping, Isolation, Ableitungen und Veröffentlichung. Eingangs-/Ausgangs-Hashes und Receiving-Head zurückmelden; diese Belege in den Produktionsstatus aufnehmen. Georg lässt dies derzeit bereits separat aufbereiten: keine konkurrierende zweite Freistellung starten.

## Dateien und Versionen

Je Set: `sheet-rN.png`, `PRODUCTION_RECORD.json`, `CHARACTER_INTENT.json`, `MANIFEST.json`, `SLOP_CARDS_DESIGN.json`, `BIOGRAPHIES_DESIGN.json`, `TECHNICAL_QA.json`. Vorhandene ältere Pfade bleiben gültig und werden nicht nur zur Vereinheitlichung umbenannt. Der Set-Index ist der Einstieg; Format-Rezepte stehen in `FORMAT_RECIPES_R1.md`.

Identität, Darstellung und Dateiversion getrennt halten. Neue Mimik desselben Slops erhält eine neue Darstellungs-/Motion-Version und `zustand_von`, keine neue Person. Ein Redesign ersetzt den bisherigen PASS erst nach ausdrücklicher Auswahl. `ersetzt`/`erneuert` und ausgewählte Version dokumentieren; alte Quellen behalten. Beziehungen entstehen aus expliziten Daten, nicht allein aus benachbarten Zellen. Gear-Stufe, Erzählrang, Kampfstufe und Trefferpunkte sind verschiedene Felder. Die erprobte Trash/Common/Elite-Optik erteilt keine neue Kampfzuweisung; bestehende Spielregeln bleiben bei WS0/WS1.

## Auflösung und Ausgabeprodukte

Die neuesten Quer-Sheets sind tatsächlich 1536×1024, nicht sechs hochauflösende Einzelmaster. Unterschiedliche Silhouetten sind erwünscht; versehentliche kleinere zweite Reihen nicht. Keine pauschale Verkleinerung bereits akzeptierter Sheets zur Layout-Reparatur. Quellen nicht überschreiben.

Drei Ausgaben aus derselben ausgewählten Identität: transparenter Einzelmaster für Katalog/Galerie, gemessene Spiel-Ableitung, Review-Sheet. Körperhöhe, Baseline und Anker werden separat von überstehenden Hüten/Props erfasst; Seitenverhältnis bleibt erhalten. Vergrößern erzeugt keine fehlenden Details. Ein neuer hochauflösender Einzelmaster muss die freigegebene Identität erhalten und als solche geprüft werden. Vorhandene Freistellungen erst über den bestehenden Librarian übernehmen. Ein logisch nummeriertes Raster ist kein zertifiziertes Schnittrechteck.

## Erweiterungsplan

`GAP_BACKLOG_R1.json` enthält Vorschläge mit Begründung und vorhandenen Nachbarn, keine bereits freigegebene Generierungswarteschlange. Priorität haben eigenständige Emotionen, schlichte Gebäudebewohner und Handlungsweisen statt weiterer Berufskostüme. Kultur, Ideologie, soziale Rolle, Epoche, emotionaler Zustand und Kampfrolle werden als unabhängige Achsen geführt.

Emotionen als Figuren funktionieren am besten als beobachtbare Situation: das mühsam bewahrte Gesicht nach einer kleinen Niederlage, unerwartete Erleichterung, schamhafte Schadenfreude. Keine sechs farbcodierten Emotionsmaskottchen. Für Gebäudereaktionen sind Identität/Zustand-Paare geeigneter; für den gemischten Mob eigenständig lesbare Figuren.

Für WFC/spawnbezogene Planung: Tags für Gebäudeklasse, Epoche, Rolle, Verhalten, Stimmung, Material-/Prop-Motiv, Gruppe und Seltenheit vorschlagen. Ein gemischter Mob darf gute Nachbarschaften statt reiner Berufsblöcke erzeugen. Optional zusammen auftretende Paare/Trio/Gangs als weiche Gewichtung planen; einzelne Figuren müssen alleine funktionieren. Ein Generator/Solver oder neue Spawnlogik wurde hier nicht implementiert.

## Animation und nächste Arbeit

`ANIMATION_PILOT_R1.md` trennt GIF-Abnahme, Identitätsprüfung und mögliche Laufzeit-Ableitung. Der separate Prüf-Agent hat die vorhandenen Loops read-only untersucht; Ergebnisse stehen in `ANIMATION_AUDIT_R1.md` und den JSON-Belegen. Es wurden keine neuen Animationen erzeugt.

Nächster zusammenhängender Schritt: WS0/Librarian liefert für einen vorhandenen Loop oder einen neuen Pilot einen kanonisch gemappten, akzeptierten Einzelmaster. Animation-Agent erzeugt genau eine kleine Idle-Mimik; separater Prüfer kontrolliert Identität/Schleife/Alpha; Georg sieht Loop und Standbildvergleich. WS1 prüft dieselbe Version in der vorhandenen Laufzeit. Nach Erfolg zunächst sechs gemischte Fälle, dann größere begrenzte Batches. Keine Bestands-Massengenerierung vor diesem Nachweis.

## Pflege des Living Documents

Nach jeder tatsächlichen Batch-Abnahme die Quellmanifeste und das zentrale Set-Index aktualisieren; die abgeleitete Coverage bei einem sinnvollen Meilenstein neu erzeugen. Nach Formatänderungen Rezept und Beispiel aktualisieren. Neue Vorschläge mit Datum und Status aufnehmen; erst eine konkrete Beauftragung macht daraus Produktion. Der aktuelle Return enthält genauen Stand, offene Arbeit und einen nächsten Übergang. Hub-/Stage-Publikation ist für diesen Dokumentationsauftrag nicht erforderlich.
