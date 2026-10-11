# A · KayKit Creator-Staging · tatsächliche Bildstudie · 11.10.2026

Status: **6 originale Creator-GIFs / 48 Einzelbilder visuell geprüft**, keine neue Szene und kein Figuren-/Asset-Neubau.
Owner: WSA scene/biome/light research; V-122 Plan R1/Register. Quellenatlas unverändert als Vorwissen: research/kaykit-creator-tutorial-atlas-2026-10-10@a0af3ad51a2f2ada4ce388e4d2f22c83e5644831, KAYKIT_REFERENCE_ATLAS_2026-09-15. Dessen früherer „Pixel nicht verfügbar“-Stand wird für die unten genannten sechs Beispiele durch echte Bildbeobachtungen ergänzt; nicht für alle Atlasquellen.

## Quellen / Auswertung
Originale aus der im Atlas bezeichneten privaten Creator-Referenzablage. Pro GIF8 gleichmäßig über seine Frames gewählte Bilder; Quelle, Hash, Abmessungen, Frames, echte GIF-Zeitstempel und Einzelbildhashes in A_GIF_METADATA.json.
Alle6 sind600×600. Fünf haben133 Frames mit50ms Dauer, insgesamt6.650s; GothGirl160 Frames mit40/50ms,6.670s. Das ist **Dateidauer inklusive Halten, Drehung, Überblendung** – keine gemessene Orbitdauer oder Kamera-Winkelgeschwindigkeit.
Originale, Einzelbilder und Kontaktbögen bleiben privat. Auf GitHub nur Beschreibungen/Zahlen/Prüfsummen nach V-071.

## Einzelbeispiele und sichtbare Beziehungen
| Beispiel / Frame0 | Tatsächlich sichtbare Inszenierung | Bildhöhe Hauptfigur |
| --- | --- | --- |
| June2026_Farmers | Zwei Figuren rahmen eine gefüllte Schubkarre; Werkzeug, Ernte und Beete setzen Arbeit fort. Grün als Umgebung, Blau an Kleidung, orange Ernte als gemeinsamer Fokus. | 280±10px /46.7% |
| LOREKEEPER SET1 | Eine Figur vor einem erhöhten Buchständer, Kerzen und mitgetragenen Rollen; Stab und Lesestand bilden unterschiedliche Höhen. Gelb/oranger Boden mit türkisfarbenen Einschnitten trägt die Gruppe. | 273±10px /45.5% |
| GothGirl | Sitzende Figur zwischen Lautsprecher, Hocker und Mikrofonständer. Hände/Pose und Requisiten bilden eine Auftrittssituation; graue Stadtkulisse tritt hinter Gesicht/Gruppe zurück. | 308±10px /51.3%, **sitzend** |
| December2025_ToySoldier | Aufrecht stehende Figur auf wenigen warmen Brettstücken, Geschenk und Trompete in unterschiedlichen Tiefen. Weißes Schneeumfeld trennt rote Kleidung klar. | 346±10px /57.7% |
| October2025_Monstrosity | Große Figur mit zusammengebautem Tür-/Brettschild und weiterem Werkzeug auf unterbrochenem Steinweg; Wald und Farbvariante ändern Stimmung. Vordergrund verdeckt im Drehabschnitt teilweise die Figur. | 376±10px /62.7% |
| November2025_PlantWarrior | Drei Figuren mit unterschiedlichen Waffen-/Schildrollen; große mittlere Silhouette, seitliche Begleiter, Blüten als Akzente. Gruppierung bleibt bei Drehung und Farbwechsel lesbar. | 304±10px /50.7% |

Das sind OBSERVED_DEMO-Fakten, keine Bindungs-/Grip-/Animationskompatibilität und keine neue KFB-Besetzung. Rote ToySoldier-Promo ersetzt nicht den ausgewählten KFB-Prison-Guard. Bildpose beweist keine Spielhandlung.

## Messmethode und Grenzen
Manuelle Bounding Boxes im tatsächlich betrachteten Frame0, Kopf/Hut bis Fuß, ±10px. A_STAGING_MEASUREMENTS.json enthält Koordinaten und Rechenschritte.
H_img = sichtbare Pose einschließlich Kopfbedeckung; **nicht** World-H. Die projizierten Abstände/Größen sind durch Tiefe, Pose und Kamera beeinflusst. GothGirls Sitzhöhe ist insbesondere keine Stehhöhe.
Farmers: projizierter Abstand der Figurenmittelpunkte≈0.76H_img. PlantWarrior-Begleiter haben≈0.74/0.80 der sichtbaren zentralen Höhe. Diese Werte beschreiben das Bild, sie rechtfertigen **keine Figurenskalierung** (V-060).
Aus den Bildern nicht bestimmt: Brennweite, tatsächlicher Kameraradius, physischer Abstand, Lux/Godot-Lichtenergie, Shaderparameter, echte Kontaktversenkung. Kamera sichtbar schräg von oben; genaue Gradzahl UNKNOWN.
Die Drehsequenzen zeigen Seiten/Rücken und Umgebung. Ob Kamera oder ganze Szene gedreht wird, ist aus den Bildern nicht sicher bewiesen. Keine pauschale 360°/6.65s-Vorschrift.

## Übertragbare Editor-Regeln (V-002/V-015)
1. Zuerst **eine Tätigkeit und einen gemeinsamen Fokus** setzen: Ernte+Schubkarre, Lesen+Buch, Auftritt+Mikrofon. Danach passende Raum-/Requisitenbeziehungen. Ein Werkzeug braucht einen Arbeitsplatz und einen Weg zu seinem Zweck.
2. Die Beispiele zeigen1,2 oder3 Hauptfiguren/Gruppenmitglieder. Dreier-Gruppen sind ein nachgewiesener Fall, **keine universelle Pflicht**. Gleich große Einzelmodelle in gleichmäßigen Reihen vermeiden.
3. Eine größere Hauptsilhouette, anders gerichtete oder versetzte Nebenrollen und kleinere Akzente schaffen Hierarchie. Im Lab über Anordnung/Tiefe/Quelle lösen, nicht Figurenmaßstab.
4. Untergrund verbindet die Gruppe: Beet, Brettfläche, Weg, Küstenabschnitt – passend zur Handlung. Kein zusätzliches einheitliches Sockelmodell für jede Szene.
5. Hintergrund und Vordergrund teilen eine Farbwelt, unterscheiden sich aber in Kontrast und Detail. Hoher Detailkontrast bleibt am Fokus.
6. Material-Look und natürliche Szene bleiben getrennt: unveränderte KayKit-Karten/Formen sind Source-Beleg; KFB-Umgebung verwendet weiterhin den Clay-Kanon (V-053).
7. Promo-Orbit ist kein Spielkamera-Golden: vorübergehende Verdeckung wie bei Monstrosityf75 im Spiel mit V-027/der existierenden Kamera lösen.
8. Typ-/Scale-/Ground-Snap-Werkzeuge für Georg müssen Beziehungen und Kontakte ermöglichen. Daraus entsteht keine automatisch angenommene WSA-Insel.

## Creator-Tutorial ergänzt
Das bisher INPUT_BLOCKED genannte Lichtvideo Vfr3n4WKsc0 wurde im tatsächlichen Browser geöffnet. Zeitmarkierte englische Untertitel und9 tatsächliche Videoaufnahmen (Tag/Ambient/AO/Fog/Nacht/Indoor) sind privat gesichert; Werbeaufnahmen ausdrücklich ausgeschlossen. Auswertung in C_LIGHT.md.
Kein vollständiger Creator-Videoatlas oder Godot→Three-Port behauptet. Andere Videos bleiben wie im bestehenden Atlas ungesehen, bis echte Medien ausgewertet werden.

## Bedeutung für den R1-FAIL
Nicht „mehr Assets“, sondern eine erkennbare Beziehung und räumliche Aufgabe macht die Szene verständlich. R1 hatte Source-Identität, aber keine ausreichende Beziehung. Dieser Befund ist Research-Eingang für Georgs Editor (F/G), keine nächste Render-/Kritikerschleife.

