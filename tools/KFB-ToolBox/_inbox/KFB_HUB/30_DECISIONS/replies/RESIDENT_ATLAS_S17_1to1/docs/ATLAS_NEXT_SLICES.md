# KFB Town Resident Atlas · Nächste Scheiben

**Stand:** 2026-09-18 · nach Sprint S36 · 27 Residents

Dieses Dokument ist für einen frischen Chat geschrieben. Es enthält, was der nächste Lauf wissen muss, damit er nicht messen muss, was schon gemessen ist. Alles hier ist `candidate-only`; Freigabe bleibt beim empfangenden Modul.

**Zuerst lesen:** `docs/ATLAS_RETURN.md` (Entscheidungen, Befunde, OPEN-Liste 1–30) und den Kopf von `data/cast.js` (Strukturregel für Hand-Requisiten). Das genügt. Der `CHANGELOG.md` ist 31 Sprints lang und nur bei einer konkreten Rückfrage nötig.

---

## Die fünf Regeln, die alles tragen

1. **Identität zuerst — aber sie gilt pro Waffenfamilie.** `handslot`-Bones sind authored Befestigungspunkte; eine Requisite mit Identitäts-Transform sitzt richtig, in jeder Pose. Das ist belegt für alles mit der LANGACHSE auf lokal +Y (Schwerter, Äxte, Streitkolben, Stäbe). **Schusswaffen haben sie auf lokal +Z** (Blaster, ToySoldier_Rifle, Marksman_Rifle) und brauchen deshalb immer `slotAxis {from:[0,0,1], to:[0,1,0]}` plus einen gerechneten Rollwinkel — sonst zeigt der Lauf auf Slot-oben, also quer. Erst prüfen, welche Achse die lange ist, dann Identität probieren.
2. **Der Pivot sagt die Rolle.** Boden = Standobjekt, Griff/Kante = Handrequisit, mittig in allen drei Achsen = schwebendes Artefakt. Objekthöhe und Pivotlage entscheiden, nicht der Dateiname.
3. **Ausrichtung ist eine Achsen-Zuordnung, keine Weltrichtung.** In T-Pose hat `handslot` lokal X = außen, Y = vorn, Z = oben — bei Rig_Medium und Rig_Large gleich. `hand.slotAxis: {from, to}` ist deshalb posen-fest; `hand.aim` gilt nur in der Pose, gegen die es gerechnet wurde.
4. **Box3 lügt** — und `applyBoneTransform` auch, wenn der Knoten nach dem Binden verschoben wird (S33b: `bindMatrixInverse` ist die Weltmatrix zum Bindezeitpunkt, die Verschiebung wird doppelt gezählt). Weltlagen von SkinnedMesh-Vertices laufen über `skinnedWorld()` in `lib/atlas.js`.
5. **Box3 lügt.** Bei posierten SkinnedMesh (S9), bei der Kamera-Einpassung (S23) und bei der Kollisionsfreiheit diagonaler Objekte (S26). Freiprüfungen laufen über Abstände echter Vertex-Wolken.

## Vier Fehlerklassen, die sich in diesem Projekt wiederholt haben

Sie sind der eigentliche Wert dieser Notiz. Jede hat mindestens zwei Sprints gekostet.

- **Veraltete Zahl.** Gemessen, dann einen Parameter geändert, dann die alte Messung dokumentiert. → Nach der LETZTEN Parameteränderung neu messen, nicht nach der letzten Codeänderung.
- **Erfundener Befund.** Ein „geht nicht" ohne Gegenprobe (S28 Foliant, S29 Pack-Bibliothek, S29 zwei rechtshändige Requisiten — alle drei falsch). → Ein „geht nicht" ist selbst eine Behauptung und braucht denselben Beleg wie ein „geht".
- **Unvollständiger Widerruf.** Dokumente korrigiert, Code-Kommentare und Header stehen gelassen. → Projektweit case-insensitiv nach dem Wortstamm greppen, nicht nach dem eigenen Satz.
- **Prüfsatz mit Loch.** Drei Sprints Kopf-, Banner- und Bodenabstand gemessen und nie den Abstand zur HAND — also genau die Größe, um die es ging. → Vor dem Messen fragen: welche Größe beantwortet den Auftrag?

---

## Scheibe A · Clown-Inszenierung — ERLEDIGT (S32)

In drei Tiefenebenen gruppiert: hinten Ballontrauben (Schwebehöhen 2,25–3,15) plus Ball und Reifen, Mitte Podest und Figur, vorn Ballonhunde am Podestfuß und Bomben/Keulen als Pointe. Nur Positionswerte, kein Objekt getauscht oder skaliert. Offen bleibt nur, was schon offen war: die Staffelungstiefe ist Bildabgleich, keine gemessene Größe.

## Scheibe B · Jonglier-Clip (eigene Sitzung, baubar)

**Präzedenzfall im Code:** `strumClip()` in `lib/atlas.js` rechnet für den Animatronic einen prozeduralen Anschlag **additiv** auf die gemessene Pose, mit einer per Probedrehung GEMESSENEN Achse statt getippter Grad. Jonglage ist dasselbe Prinzip, eine Stufe komplexer. `reachChain()` (CCD) steht ebenfalls bereit.

**Reihenfolge der Abhängigkeit — in dieser Richtung, nicht anders:**

1. **Flugbahn zuerst.** Wurfhöhe und Erdbeschleunigung legen die Flugzeit fest, die Flugzeit legt die Zyklusperiode fest. Nicht umgekehrt eine Periode wählen und die Höhe anpassen.
2. **Handpositionen als Ankerpunkte.** Wurf- und Fangpunkt pro Hand, gemessen aus der Basispose, nicht getippt.
3. **Arme per CCD** an diese Punkte (`reachChain`). Restfehler über ~0,1 heißt: Ziel verwerfen, nicht Ergebnis behalten (S29-Lehre — eine Nachführung, die ihr Ziel nicht erreicht, ist ein verbogener Arm).
4. **Keulenrotation zuletzt.** Sie muss eine GANZE Zahl von Halbdrehungen pro Flug machen, sonst landet die Keule verkehrt in der Hand. Das ist eine Teilbarkeitsbedingung, keine Geschmacksfrage.

**Der Haken, vorher nennen:** der Loop muss exakt schließen. Ein Restfehler von einem Grad pro Zyklus ist nach zwanzig Zyklen eine sichtbar schief liegende Keule. Deshalb den Zyklus **nicht aus Keyframes** bauen, sondern aus einer Phasenfunktion — dann schließt er per Konstruktion.

**Maß-Vorbehalt:** Clown-Keulen 0,64 lang bei 2,1 Figurenhöhe, Handslots ~0,25 auseinander. Drei Keulen gehen sicher. Bei sechs erst rechnen, ob sich die Flugbahnen schneiden — das ist eine Rechnung, kein Versuch.

## Scheibe C · KFB Dance Move Set (eigene Sitzung)

Benchmark laut Georg: WoW-Rasse-spezifische `/dance`-Stile. Drei Zielklassen:

- **Rig_Medium** — 23 Bones, 119 geteilte Clips. Reichste Basis.
- **Rig_Large** — 23 gleiche Bone-NAMEN, andere Proportionen, nur 34 Clips. Rig_Medium-Clips binden 69/69 und deformieren trotzdem falsch (S9/S10). Für Large muss eigenständig gebaut werden.
- **Rig_Legacy** — SECHS Bones (Body, Head, armLeft, handSlotLeft, armRight, handSlotRight), 30 Clips. KISS-Variante: mit sechs Bones ist nur Rumpf-, Kopf- und Armbewegung möglich, keine Beinarbeit.

Kritisch bei Legacy: die Figuren sind zusammengesetzt (rigide Teile), Requisiten hängen am ARM-Bone, nicht am handSlot (S28). Ein Tanz-Clip, der den handSlot relativ zum Arm bewegt, löst die Requisite optisch von der Pfote — bei Tanz ohne Requisiten irrelevant, mit Requisiten muss es geprüft werden.

Vorgehen wie bei `strumClip`: additiv auf die gemessene Pose, Achsen per Probedrehung gemessen, Amplitude als STRECKE statt als Gradzahl (prüfbar: „die Hüfte legt 12 cm zurück" gegen unprüfbar: „18° am Becken").

## Scheibe D · Screenshot-basierter QA-Pass — ANGEFANGEN (S33)

`tools/prop-qa.html` steht: `?resident=<id>` baut die Vignette und gibt pro Hand-Requisite Hand-, Freihand- und Kopfabstand, Unterkante, Langachse in Weltkoordinaten und Punkt-in-Mesh-Durchdringung aus, pro Figur Bodenkontakt und POSIERTE Höhe (`applyBoneTransform`, nicht Box3), dazu acht Bilder aus vier Winkeln. `?identity=1` schaltet die Achsen-Zuordnungen ab und macht jede Zuordnung zu einem A/B. Zwei Prüfmethoden mussten dabei ersetzt werden (siehe S33 im Changelog) — die erste schlug bei jeder Kombination an, die zweite meldete drei verschieden posierte Figuren als exakt gleich hoch.

Offen: der Lauf über alle 27 in einem Durchgang, die Bindungsquote in der Tabelle, und die Projektionsprüfung gegen die HUD-Kante (Scheibe G). Was der Pass mindestens prüfen muss, pro Resident und pro Requisite:

1. Abstand Requisite ↔ HAND (Vertex-Wolken) — die Größe, die „sitzt in der Hand" beantwortet.
2. Abstand Requisite ↔ Kopf.
3. Unterkante über Grund (≥ 0).
4. Bindungsquote der Pose.
5. Und zwar **an gefrorener Pose** — Requisitenlage mitten in einem laufenden Clip beweist nichts (S25).

Ein wiederverwendbares Prüfskript dafür gibt es noch nicht. Es zu bauen ist die halbe Scheibe und lohnt: dieselben vier Messungen sind in den letzten sechs Sprints jedes Mal von Hand geschrieben worden.

## Scheibe E · Architektur, Import/Export

Bestandsaufnahme, ehrlich:

- `lib/atlas.js` ist auf über 1200 Zeilen gewachsen und trägt jetzt fünf Aufgaben: Laden/Messen, Rig-Introspektion, Vignetten-Bau, prozedurale Clips (`strumClip`, `reachChain`), Kamera/Viewer. Eine Trennung in `atlas-load`, `atlas-rig`, `atlas-build`, `atlas-motion` wäre sauber — ist aber ein Umbau, der alle 21 Recipes berührt und deshalb eine eigene Scheibe braucht.
- Die Attachment-Optionen sind über sieben Sprints organisch gewachsen: `off`, `push`/`pushAxis`, `aim`/`axis`/`roll`/`grip`, `slotAxis`/`slotRoll`, `paw`, `pull`, `hold`, `float`, `on`, `sitOn`. Mehrere überlappen. Vor einer Konsolidierung erst zählen, welche in den 21 Recipes wirklich benutzt werden — und die Regel-Hierarchie erhalten: Identität, dann Zuordnung, dann Weltrichtung.
- **Assets werden nicht lokal gelesen.** `loadAsset()` lädt über `raw.githubusercontent.com` am gepinnten Commit. Ein 404 im lokalen `media/`-Ordner beweist nichts (S24-Lehre). Drei Pins: `PIN.assets`, `PIN.anims`, `PIN.legacy` — plus ein `commit: main` pro Eintrag bei Mixed Bag 1.

## Scheibe G · UI kompakt und responsiv — ERLEDIGT (S35)

Eingebaut nach `docs/UI_SPLIT_EINBAU_RESIDENT_ATLAS.md` (Georgs Anleitung, jetzt im Projekt, lauffähige Vorlage in `ref/ui-split-shell.html`). Drei Zustände: Leiste zu · Leiste auf · nur Ansicht. Gemessen bei 895 × 615: Bühne 516.415 px mit Leiste zu UND auf (unter 1100 px overlayt sie), 550.425 px in „nur Ansicht"; Kopf scrollt nicht, nur die Mitte. Im `clean`-Zustand am Toy Soldier MIT sichtbarer Zeitleiste und Pick-Karte nachgemessen (S35b, nachdem die erste Prüfung an einem Resident lief, der beide gar nicht einschaltet): beide 0 px, einziges Overlay ist der Weg zurück. Die HUD-Caption, Ursache des S32-Verdeckungsfehlers, ist in die Leiste gewandert. Offen bleibt nur, was die Anleitung selbst ausnimmt: Mobil unter 600 px.

<!-- ursprüngliches Briefing, zur Nachvollziehbarkeit -->
### Ursprüngliches Briefing

Ziel: Fokus auf Bühne und Kulisse. Die Panels nehmen heute dauerhaft Platz weg, und die HUD-Caption hat in S32 sogar Requisiten verdeckt.

- **Ein Toggle-Icon oben rechts** statt des Textknopfs „Leiste ausblenden". Es blendet **alle** Paletten aus, nicht nur die Seitenspalte.
- Die HUD-Caption (`#dockrow`) gehört mit unter diesen Toggle. Sie liegt über den unteren ~13 % der Leinwand und ist derzeit nicht wegschaltbar — das war die Ursache des S32-Verdeckungsfehlers.
- Header, Knöpfe und Funktionen konsolidieren und kompakt darstellen. Heute sind Mood, Draufsicht, Raster, Ebenen, Referenzblende, Motion, Bone-Auswahl, Studio-Knöpfe und Export nebeneinander im Fluss.
- Responsiv: die Seite ist nur für breite Fenster gebaut und auf Mobil nicht getestet (`TEST_REPORT.md`, zwei Zeilen `NOT_RUN`).

Messkriterium beim Abschluss: **die Bühnenfläche in Pixeln vor und nach dem Toggle**, plus eine Projektionsprüfung, dass im eingeklappten Zustand kein Objekt mehr von einem Overlay verdeckt wird. Nicht nach Augenschein.

## Scheibe F · Exporte — TEILWEISE ERLEDIGT (2026-09-17-r1)

Der Exportauftrag ist ausgeführt, Ergebnis `EXPORT_PARTIAL`: Code, Daten und alle verlangten Dokumente liegen im Paket, die 3D-Modelle nicht (`REMOTE_ONLY`). Details in `EXPORT_MANIFEST.json`, `FEATURE_PARITY.md`, `KNOWN_ISSUES.md`. Offen bleibt: Assets ins Paket ziehen, three.js nach `vendor/` spiegeln, Startest aus dem entpackten Paket über HTTP.

- **ZIP mit Code-Base:** erledigt in 2026-09-17-r1 (`PORTABLE_EXPORT_COMPLETE`, online-portabel). Die 3D-Assets gehören per **Entscheidung 14** nicht hinein — alle Assets via GitHub, gepinnt. Ein Paket mit Assets wäre ~300 MB und ab dem nächsten Pack-Update veraltet. Frühere Fassung dieses Punkts (jetzt obsolet): Die 3D-Assets gehören NICHT hinein — sie liegen im Repo und werden über die gepinnten Raw-URLs geladen. Ein Export, der sie mitkopiert, ist 300 MB groß und sofort veraltet.
- **Stand-alone HTML:** noch offen. Unter Entscheidung 14 heißt stand-alone **online-portabel**: eine Datei, die three.js von unpkg und die Assets von den gepinnten Raw-URLs zieht. Offline-Fähigkeit ist ausdrücklich NICHT das Ziel.

---

## Was NICHT wieder aufgemacht werden muss

- Rig-Familien: Black Knight, Demon Lord, Orc Brute, Monstrosity und 4GTN sind Rig_Large. Belegt und mehrfach bestätigt. Rig_Large hat 34 Clips und darunter KEINE Sitz-, Lie- oder Crouch-Haltung — nicht nochmal suchen.
- Varianten-Bauarten, alle drei belegt: zweite Texturdatei (Cleric, Hero Man, Hoarder, Plant Warrior → `skin`), zweite Palette im ungenutzten Bereich desselben Atlas (Marksman → `paletteShift`), zwei Modelle (4GTN → zwei Einträge). Die Dateiliste sagt nicht, welche vorliegt: UV-Bereiche gegen Blattgröße messen.
- Pack-eigene Animations-Ordner: bei Hero Man namensgleiche Duplikate der geteilten Sets (15/15, 11/11). Ein pack-eigener Ordner ist kein Hinweis auf zusätzliche Clips.
- Fehlende Clips, jeweils über die volle Bibliothek geprüft: kein Schuss-/Lade-Clip (Blaster, Gewehr), kein Lese-Clip (Foliant), kein Flug-Clip (Witch-Besen), kein Armbrust-Spann-Clip, kein Trommel-Clip, kein Instrumenten-Clip, keine Balance-Pose (Clown), keine liegende Schießhaltung (Marksman — 20 Kombinationen gerechnet, Gewehr in jeder im Boden).
- Schusswaffen-Konvention: Langachse lokal +Z, Zuordnung auf Slot-vorn, Rollwinkel gerechnet (Marksman 90°, Toy Soldier 105°). Über vier Posen gegengeprüft. Nicht neu suchen.
- Honig existiert im Repo nicht.
