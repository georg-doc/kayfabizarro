# Decisions · additiv

Ältere Entscheidungen bleiben stehen, auch die verworfenen. Die vollständige Kette steht in
`../CHANGELOG.md` und `SOURCE_github.md`; hier nur die, die die Architektur tragen.

## 2026-09-16 · Gemessen statt angenommen

Jedes Maß kommt aus einer Sonde in `tools/` und zur Laufzeit aus `measured`, nicht aus einer
Nennmaßkonstante. Begründung: Nennmaße waren mehrfach falsch — `wall_cracked` ist dicker als seine
Platte, `wall_pillar` 1,5 statt 0,75, die Fahrbahn von `roadStart` liegt 0,13 versetzt.

## 2026-09-17 · Zwei unabhängige Proben auf die assemblierte Szene

Verworfen: Masken-Audits als Abnahme. Sie blieben in S11 grün, während jede Kurve spiegelverkehrt
lag — ein Audit, der den Solver gegen sich selbst prüft, bestätigt nur Konsistenz. Beschlossen:
Draufsicht-Pixelprobe (Lage/Identität) **und** waagerechte Strahlprobe (Begehbarkeit). Die zweite
hat das Türblatt gefunden.

## 2026-09-17 · BSP ist nicht gewählt, sondern abgeleitet

Das Pack hat kein `wall_end`, kein T, kein Kreuz. Daraus folgt: geschlossene achsparallele
Wandzüge, die in `wall_corner` einlaufen. BSP erzeugt genau das.

## 2026-09-17 · Eine Tabelle statt zwei Wahrheiten (Hex)

Verworfen: Masken und Kantentabellen parallel pflegen. `TILE_EDGES` ist die einzige Quelle;
Masken, Flussvarianten, `COAST_CORE`, `COAST_EDGES` werden abgeleitet.

## 2026-09-17 · Licht: Referenz lesen, dann rechnen

Vier Runden Basteln vorausgesetzt. Verworfen: orange Kugel als Flamme (AI-Slop), dunkle Scheibe als
Wand-Kontaktschatten (frisst den Lichthof), schattenwerfende Punktlichter (projizieren die
Silhouette des eigenen Bauteils als dunkles Fünfeck), physikalisch korrektes 1/r² (Spiegelkabinett
an herausragenden Mauersteinen). Beschlossen: ein schattenwerfendes Key-Light, Fackeln als Akzent
mit 2,4 cd, `decay 1`, ACES-Tonemapping, `roughness 0.95`.

## 2026-09-17 · Flamme über Atlas-Texel, nicht über Trennhöhe

Verworfen: Mengendifferenz gegen den stillen Zwilling (Netze nicht vertex-identisch) und
Schwerpunkt-Schnitt (`torch_lit` hat sein Feuer in der Schale). Beschlossen: Texel-Familie am
UV-Schwerpunkt. Die frühere Aussage „eine Farbregel kann Flamme nicht von Holz trennen" war falsch
und ist gegen die eigenen Messdaten korrigiert — geprüft wurde auf Wärme, nicht auf Farbton.

## 2026-09-17 · UI: eine Kopfzeile, Kennzahlen in die Leiste

Umbruchfähige Kopfzeilen verschoben die Szene bei jedem Fensterwechsel; Overlays verdeckten genau
die Ecke, in der Licht zu beurteilen ist. Beschlossen: eine 38-px-Zeile, die horizontal scrollt
statt umzubrechen; Stand/Prüfungen/Gemessen als zugeklappte Abschnitte in einer standardmäßig
**geschlossenen** Leiste; unter 1100 px legt sie sich als Overlay über die Szene, statt sie zu
stauchen. Split-Screen ist der Normalfall.

## 2026-09-17 · Export: kein Neuaufbau, keine Ersatzgeometrie

Für diesen Export wurde am Projektcode nichts geändert. Kein `dist/` erfunden, kein Build
eingeführt, keine three-Version angeglichen, keine Modelle nachmodelliert, keine Assetpfade
umgestellt. Fehlendes ist benannt (`KNOWN_ISSUES.md`), nicht ersetzt. Ein nicht
ausgeführter Test heißt `NOT_RUN`, nicht PASS.

## 2026-09-17 · Alle Assets via GitHub · Korrektur am Exportauftrag

Georg hat §3 des Exportauftrags („für jedes verwendete Modell müssen reale Bytes im Paket
verfügbar sein") als **Fehler im Briefing** benannt. Beschlossen: Assets bleiben ausschließlich in
`georg-doc/kayfabizarro/media/3D_Assets/` und werden über die kanonische RAW-URL geladen. Kein
`assets/`-Verzeichnis im Paket, kein relativer Assetpfad im Code.

Begründung: ein Paket mit eingebetteten Packs veraltet gegen das Asset-Repo, sprengt jedes
Größenbudget und erzeugt eine zweite Wahrheit neben der Asset Registry, die laut A0 §9 Eigentümerin
von Quelle und Provenienz ist. Ein relativer Assetpfad ist zusätzlich der stille Killer: er
funktioniert in der Vorschau und bricht im ausgelieferten Stand.

**Nicht** mitkorrigiert: die fehlende Pinnung der RAW-URL auf einen Commit-SHA. Extern ist
richtig, unversioniert nicht. Bleibt als `KNOWN_ISSUES.md` §1 offen.

## 2026-09-17 · `KayKit Atlas Preflight Access` ≠ `KFB_World_Atlas_v1`

Der Exportauftrag setzt beide gleich. Der Projektinhalt deckt die in §4 beschriebene
World-Atlas-Funktion nicht. Nicht umbenannt, nicht umgedeutet, nicht nachgebaut — als offene
Benennungsfrage dokumentiert (`README.md`, `FEATURE_PARITY.md`). Dasselbe Verfahren wie bei
`Lawkeeper` / `Lorekeeper` im Auftrag selbst.
