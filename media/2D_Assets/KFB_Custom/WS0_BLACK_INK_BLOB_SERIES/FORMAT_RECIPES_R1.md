# Slop-Ausgabeformate · Rezepte R1

Diese Rezepte sind neue Arbeitsvorlagen aus den akzeptierten Varianten. Sie sind keine nachträglich behaupteten Originalprompts. Exakte historische Prompts bleiben in den jeweiligen `PRODUCTION_RECORD.json`; stilistisch gilt `SOP_INK_MONSTERS_R2.md` mit aktueller Georg-Steuerung.

## Gemeinsamer Prompt-Kern

> Create a new KFB claymation ink-blob character sheet. Actual supplied originals are bounded STYLE REFERENCES, not a text-only substitute and not costume templates. Every actor is a complete upright footless charcoal-black ink splat, subtle violet sheen, thick rounded asymmetric lobes and short goo hands. Face directly in goo; no cropped human torso, legs, feet or full robot body. Rich softly sculpted plasticine and coherent rounded prop craft. White/ivory sclera, red iris, black pupil; thick filled lids. Keep eyes readable. Teeth inside mouth, never on outside lower lip. Plan distinct contour, gaze, mouth action, body acting and emotional peak before costume. Few bold functional-looking props. True transparent PNG; complete silhouettes and generous margins, no overlap, scenery, floor, labels or logos. Equal substantial scale in both rows. Preserve source individuality rather than six identical grins.

Vor dem Aufruf jeden Slot konkret füllen: Name/Identität, Geschlechtslesart, Körperform, Blick/Lider, Mundaktion, Haltung, emotionaler Moment, Rolle, ein bis zwei Props. Weiblich gelesene Figuren nicht immer in dieselben Zellen setzen; neue Mimikkombination pro Run. Tatsächliche Referenzpfade und Argumente mitspeichern. Das Format allein löst keine Beziehung oder Kampfrolle aus.

## 1 · Family / Team / Deck · 3 Spalten × 2 Reihen

Sechs unterschiedliche Figuren. Übliche gemessene Quelle: 1536×1024. Zellen 0–5 zeilenweise; geometrische Zellgrenzen bleiben logisch, bis sichere Isolation geprüft ist. Zwei weiblich gelesene Identitäten. Alle Figuren müssen alleine lesbar bleiben.

Prompt-Ergänzung: `Exactly six unique standalone actors. TOP LEFT … TOP MIDDLE … TOP RIGHT … BOTTOM LEFT … BOTTOM MIDDLE … BOTTOM RIGHT …. COMPOSITION: three columns by two rows, equal cell scale, full props and generous transparent gutters.`

Belege: `SPACE_CYBORGS_6_2026-11-06/MANIFEST.json`, `SPORTS4_FANA_6_2026-11-06/MANIFEST.json`. Die jeweils ausgewählte Quelle und deren Hash aus dem Manifest verwenden, keine Browser-Vorschau als Master.

## 2 · Drei Paare · 2 Spalten × 3 Reihen hoch

Sechs unterschiedliche Figuren, je Reihe eine erkennbare Beziehung. Farben/Materialmotive, Haltung und Temperament verbinden das Paar. Keine zwingende Gegenstandsübergabe und kein über Zellen reichender Blick-/Armaufbau. Links und rechts müssen auch außerhalb der Paarung sinnvoll bleiben. Drei Paare sind nicht sechs Zustände einer Person.

Prompt-Ergänzung: `Portrait layout, two columns by three rows. Each row contains two distinct related characters with opposing temperaments. No overlap or direct object handover. Shared costume/accessory cues, independent usable poses.`

Daten: gegenseitiges `paar_mit`; keine `zustand_von`-Verknüpfung ohne dieselbe Identität. Beleg: `SETS/couples-pilot/MANIFEST.json`. Die zwei historischen International-Couples-Sets behalten ihren derzeitigen Intake-Ausschluss; der Formaterfolg hebt das nicht auf.

## 3 · Bewohner / A–B-Emotion · 2×3 hoch

Drei Identitäten in je zwei Zuständen: links z.B. verwirrt/erschrocken, rechts unzufrieden/kämpferisch. Outfit, Props und markante Eigenheiten verbinden die Zustände. Die Deformation darf variieren, Körpergröße und Bildraum bleiben vergleichbar. Keine zerstörten Gebäude in den PNGs; Alltag wird durch Pyjama, Kragen, Gegenstand etc. lesbar.

Prompt-Ergänzung: `Each row is the SAME resident identity in two expressive states, shared signature costume and props. Strong fear/confusion versus anger/defiance contrast, equal visual scale, full upright body, independent cutouts.`

Daten: sechs Darstellungs-IDs, drei `zustand_von`-Identitäten; State und Haltung gesondert. Bei zwei Sheets entstehen zwölf Darstellungen von sechs Bewohnern. Beleg: `SETS/residents-a/MANIFEST.json` und `SETS/residents-b/MANIFEST.json`.

## 4 · Entwicklung / Stufen · 3×2 quer

Zwei Identitäten oder Rollenlinien; je Reihe drei Darstellungen. Links/mitte/rechts z.B. Trash/Common/Elite oder Anfänger/Fachkraft/Leitung. Signature-Prop, Farbmotiv und Quirk bleiben erkennbar, Haltung und Gear entwickeln sich. Ein kleiner Anfänger darf nicht nur durch pauschales Schrumpfen erzeugt werden.

Prompt-Ergänzung: `Each row shows one identity or explicitly stated role lineage in three escalating designs. Maintain the recognisable signature and comparable display size. Evolve gear, attitude and expressive action, not merely costume complexity.`

Daten: drei Darstellungs-IDs pro Linie, Beziehung explizit. Rollenlinie ist nicht automatisch dieselbe biologische Person; im Paket festlegen. Optische Trash/Common/Elite-Stufen erfinden keine Trefferpunkte. Bei Wiederholungsbildern Besetzung nach Identität dokumentieren; die normale Zwei-von-sechs-Castregel nicht mit Bildwiederholungen verwechseln.

Belege: `RPG_TIER_TRIPLETS_PILOT_2026-11-04/MANIFEST.json`, `CAREER_TIERS_36_2026-11-05/01-medizin--pflege/MANIFEST.json`.

## 5 · Zwei Story-Trios · 3×2 quer

Sechs verschiedene Figuren, zwei zusammengehörige Dreiergruppen. Eine Reihe ist ein gemeinsamer literarischer Stoff, eine Musikgruppe, Familie oder Gang. Gemeinsames Motiv, aber drei deutlich unterschiedliche soziale Funktionen, Gesichter und Silhouetten. Kein Entwicklungsautomatismus.

Prompt-Ergänzung: `Each row is a three-member ensemble, three distinct identities rather than stages of one actor. Shared narrative cues and contrasting social roles, standalone expressive poses, no prop handovers or overlap.`

Daten: `trio`/`trio_mit`, Gruppenbeschreibung und Quellen-/Inspirationsnotiz; `zustand_von` leer, wenn keine Zustandsvariante. Beleg: `STORY_TRIOS_36_2026-11-05/04-macbeth--hamlet/MANIFEST.json`.

## Neue Variante · Emotion als eigenständige Figur

Noch nicht als eigene Reihe beauftragt. Dafür Format1 nutzen: sechs verschiedene Individuen, die z.B. Scham, Erleichterung, Schadenfreude, Trotz, Verlegenheit und Sehnsucht verkörpern. Emotion sichtbar spielen lassen, nicht beschriften oder nur über eine Farbe behaupten. Eine Alltagssituation und ein einfacher sinnvoller Gegenstand geben Halt. Für denselben Bewohner vor/nach einem Ereignis stattdessen Format3 verwenden.

## Ableitungen

Katalog-Einzelmaster, Spiel-Sprite, Kontaktbogen und Motion-Loop sind verschiedene Ausgaben derselben ausgewählten Identität. Keine Figur nur für den Kontaktbogen neu erfinden. Maße, Körper-Baseline und beabsichtigte Randabstände messen, nicht vom Dateinamen ableiten. Quellen behalten; jede Reparatur/Ableitung bekommt eigene Versions-/Quellbezüge. Ein hochskaliertes Zellbild ist kein neuer nativer Detailmaster.
