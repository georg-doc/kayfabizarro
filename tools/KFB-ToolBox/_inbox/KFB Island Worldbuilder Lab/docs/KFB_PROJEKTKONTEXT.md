# KFB (Kayfabizarro) · Projektkontext für Recherche

Stand: 2026-10-09 · Zweck: Grundlage für ein NotebookLM-Notebook zum KFB-Spiel. Das Dokument erklärt, was das Projekt ist, wie es aussieht, wie es gebaut wird, wer was macht und woran es bisher gescheitert ist. Detailregeln stehen in den Regelwerken und Bauanleitungen dieses Pakets.

---

## 1 · Was KFB ist

**KFB (Kayfabizarro)** ist eine **Claymation-Cartoon-Spielzeugwelt im Browser**: schwebende Inseln, auf denen Bewohner (Residents) ihr eigenes Leben führen, bevor der Spieler ankommt. Man fährt, geht und fliegt zwischen den Inseln, trifft Figuren, die sprechen, sammelt Fluff und kann im Worldbuilder-Modus selbst Inseln gestalten.

- **Ton:** metanarrativ, cartoonig, weird und offbeat. Gesellschaftssatire ohne Moralquiz.
- **Struktur:** Vier Welten. **KFB Town** ist der historische Hub. Drei Zukunftswelten leiten sich je aus einem Kartendeck ab:
  - **Dystopia:** „Ignore Dystopia, Anatomy of a Trap“. Mechaniken der Angst: Dauer-Alarm, Krisenschleifen, Ausnahmezustand.
  - **Utopia:** „Forget Utopia“. Rhetorik verkaufter Zukünfte: Hochglanz, Terms & Conditions, CEO.
  - **Protopia:** „Protopia Sketchbook, Embrace“. Kleine konkrete Verbesserungen: Reparatur, Farmer, Werkstatt.
- **Meta-Story:** „Cancel This Planet!“ mit dem **Fluff Incident** als Genesis. Lord Hunky und Lady Dory umkreisen seit etwa 5000 Jahren die Erde, Hunkys Job ist die Fluff-Ernte. Fluff steht für das menschliche Mehr.
- **Leitsatz der lebenden Welt:** Geschichte bleibt als Schichten, Narben, Reparaturen und Umnutzung sichtbar. Karten, Billboards, Dialoge und Almanach sind Projektionen der Welt, kein Ersatz dafür. Eine Insel muss zuerst als Ort lesbar sein.

## 2 · Look

- **Claymation bzw. Knetgummi:** Alles wirkt handmodelliert wie Stop-Motion (Referenz Wallace & Gromit), mit Fingerabdruck-Relief, weichen Rundungen und satten Farben. Die Welt ist ein **Diorama**: sparsam, jede Insel eine Filmszene.
- **Asset-Basis:** KayKit (Figuren, Medieval, Dungeon, City, Forest), Tiny Treats (Möbel, Innenräume), Kenney Nature Kit (Natur, Mesa- und Felsformen), Quaternius Ultimate Nature (ergänzend, je Biom), Retro Cartoon Cars, eigene Knet-Shader (Clay v10, Clay K2).
- **Paletten:** je Insel eine Stimmung aus Joyride (Canyon, Bikini-Bucht, O-Town usw.). Die **Farb-Grammatik** vergibt Farben nach Material-Rollen: Boden, Stein, Laub, Rinde, Blüte, Wasser, Akzent. Farben folgen der natürlichen Schattierung des Bioms; surreal verschoben ist erlaubt, willkürlich nicht.
- **Übergänge:** **Sprenkel bzw. Knetflecken** (`kfbBlend`/`kfbLayer`): große Flecken mit hartem Knetrand, mittlere und kleine Tropfen nach außen, Tropfen der Grundfarbe zurück. Nie Verlauf, nie Alpha, nie gerade Linie.
- **Inseln:** flache Oberseite, Viertelkreis-Rundung über die Kante, darunter eine schwebende Erd- und Felsscholle mit zentraler Spitze und senkrechten Ausläufern (Scholle v7).
- **Straßen:** Joyride-Racetrack-Look mit roten, gerundeten Banden und oranger Fahrbahn. In der Stadt Bordsteine und Gehwegplatten aus der Knetstein-Familie A.

## 3 · Spielerlebnis im MVP „Drive Loop“

Fahrt um KFB Town auf einer Ringstraße an der Inselkante, Auffahrten zu den drei Satelliten, Rennstücke wie Looping, Sprung und Tunnel dazwischen. Dazu sprechende Bewohner (Voice), Audio-Bett, HUD je Reisemodus (Gehen, Fahren, Fliegen mit Jetpack), Fluff-Score und der Worldbuilder-Modus. Einzelheiten im Masterplan R2.

## 4 · Maßstab (Vertrag K2)

- Keine Meter. **H** = Höhe der Medium-Figur = 3,64 Lab-Einheiten. **MacroCell (MC)** = 4 KayKit-Einheiten = 6,4 Lab-Einheiten = ein Dungeon-Modul = ein Stockwerk.
- Figuren und Animationen werden nie skaliert. Gebäude werden nach der **Tür-Regel** hochskaliert (Tür ≥ 1,15–1,2 H), Inseln wachsen mit.
- Weltautos sind 6 lang (1,65 H). Inselstrecken laufen mit Rennprofil × 1,46 (RACE_W).
- Die Kette lautet: Asset → Kit-Faktor → KayKit-Einheit → × 1,6 → Lab-Einheit.

## 5 · Technik

| Bereich | Stand |
| --- | --- |
| Laufzeit | Browser, three.js r186, Vite. Lokales **KFB Island Worldbuilder Lab** (Editor, Viewer, Proben). Ziel ist später eine GPT-Site |
| Inselgelände | Wird umgestellt auf die **R2D-v0-Bauweise** von Claude Design: analytische Höhe aus Abstandsfeld, Masken und Gewichte je Vertex (`aTW`), Polarnetz, Farbkarte in Draufsicht, `kfbLayer`-Sprenkel im Shader, Viertelkreis-Kante, Scholle v7 als Körper (SDF + Marching Cubes) |
| Wasser | fluid.js (Teich und Bach F0–F2 abgenommen; Wasserfall F3 und Strand/Lagune F4 geplant) |
| Straßen | **Track Core** (eigener Straßen-Compiler, Profile und Stationen), Körper in Blender (RKIT). Schnittstelle zum Gelände: `kfb.road-bed/1` (Maske, Naht, Freiflächen, Anker, Rand, Inselkoordinaten mit Umriss-Hash) |
| Natur | Instanziert (BatchedMesh), Gruppen mit Phase und Steifigkeit für Wind-Deformer und Musik-Visualizer. Budget Natur ≤ 16 Draw Calls und ≤ 120 k Dreiecke je Pass |
| Figuren | KayKit-Rigs, eigenes Eye-Rig, Animationen und NPC-Activities im Blender-Coworker |
| Voice / Audio | ChatterBox Voice Layer, ein KFB-Audio-Owner (kein zweiter AudioContext) |
| Assets | Asset Librarian v10 (GPT-Site) mit Registry, Intake und Live-Refresh; GitHub `georg-doc/kayfabizarro` als SSOT |
| Prüfen | three-inspect (Szenenbaum, Perf), `__kfb.*`-Messfunktionen im Lab, Headless-Renders, blinde Kritiker-Läufe |

**Leistungsziel:** zuerst ein MacBook, 30 bis 60 Bilder pro Sekunde. Sparsame Szenen sind Absicht.

## 6 · Wer macht was

| Rolle | Aufgabe |
| --- | --- |
| **Georg** | kreative Leitung, Abnahme (PASS / TUNE / FAIL), Weltlogik, Story |
| **Claude Code, Steuer-Sitzung** | Konzept, Integration, Prüfung, Briefings, das Lab |
| **Claude Code, RKIT-Sitzung** | Straßenbaukasten R3 (Track Core, Blender), Mauerwerk-Familie A, Bauweise-Blatt |
| **Claude Code, Environment-Sitzung** | Natur, Biome, Erdung, Biom-Vorlagen aus den Demo-Szenen |
| **Blender-Coworker (Mac mini)** | Bewohner, Rigging, Animationen, NPC-Activities |
| **Claude Design** | Formen und Look: Insel-Kit R2, HUD, Vorhang, Four-Island-Varianten |
| **WSA-Work (Web-Chat)** | GitHub-Workflows, Asset Librarian, Integration in die GPT-Site |

## 7 · Arbeitsweise

1. **Konzept vor Code.** Bauweise- oder Biom-Blatt mit Baugeschichte je Element und Referenzbildern. Georg gibt frei, erst dann wird gebaut.
2. **Harte Regeln** werden automatisch gemessen, zum Beispiel: nichts schwebt, keine Verläufe, Straße frei von Gelände, Kamera nie im Mesh.
3. **Blinder Kritiker** mit Punkten je Kriterium, darunter Weltlogik.
4. **Georg** sieht nur Bestandenes oder einen ehrlichen Stopp-Bericht.

Regeln stehen in Dateien, nicht in Chats. Jeder Baustein hat einen Besitzer.

## 8 · Lehren aus den bisherigen Fehlschlägen

| Fehlschlag | Ursache | Lehre |
| --- | --- | --- |
| Island MVP R4 („No MVP, World-Model-Failure“) | Vorhandene Story und Biografie wurden nicht in die Komposition geleitet; eine generische Mittelalterstadt war der Ersatz | Story-Quellen sind Pflicht-Eingang; Komposition aus Biografie |
| RKIT-Atlas v0.15 | Anforderungen erfüllt, aber nichts „gebaut“: Farbverläufe und Formüberblendungen statt Bauteile | Bauweise-Blatt: wer baut was, womit, warum |
| Environment-Probe 1 und 2 | Felsen lagen auf statt tief im Gelände; Blümchenringe, Kontaktverläufe, dunkle Ringe | Erdung nach Objektart und Physik; keine Verläufe |
| Eigenes Lab-Gelände | zweite Wahrheit neben der Claude-Design-Bauanleitung, Rückschritt gegenüber R2D/R2B | auf R2D v0 + Scholle v7 umstellen |
| Maßstab („Figur 1,9 m“) | falscher Code-Kommentar, in andere Sitzungen gewandert | Maßstab-Vertrag K2 ohne Meter |
| Skizzen zur Abnahme | 2D-Illustrationen ließen die 3D-Form nicht erkennen; vergrößerte Ausschnitte verfälschten den Sprenkel | 3D-Render mit Profilschnitt, aus Spielkameras |
| Generell | billigste Lösung, die aus einem Winkel gut aussieht | aus mehreren Winkeln prüfen; Weltlogik ≥ 7 beim Kritiker |

## 9 · Lizenz- und Quellregeln

- Gekaufte Unity-Assets (z. B. StreakByte „Low Poly Floating Islands“, Cozy Tunes) dürfen nie in ein öffentliches Repo.
- Kein proprietärer Code (z. B. Unity Road Constructor) wird kopiert, nur Konzepte.
- Externe Funde werden erst nach dem Intake im Asset Librarian kanonisch.

## 10 · Rangfolge der Quellen bei Widersprüchen

1. Georgs jüngste Entscheidung (Masterplan §0 und §7, Regelwerke §00 und §01).
2. QA-Regelwerke und Maßstab K2.
3. Bauanleitungen bzw. Specs.
4. Projektstand-Log (chronologisch, neueste Einträge oben; ältere können überholt sein).
5. Story-Proposals und Referenzbilder.

Das alte Erzählraster und die Environment-Proben 1 und 2 sind überholt bzw. FAIL-Beispiele.
