# RETURN · World Core R2D v0 · eine Insel · 2026-10-03

Seite: `KFB World Core R2D v0 Insel.dc.html` · Code: `KFB_R2D_v0/island.js` · Bilder: `evidence/`
Brief: R2D @ 14a1c55 (PR #328), Schritte 3–5, erster sichtbarer Schnitt. Kein Push.

## Was es ist
Eine schwebende Knet-Insel aus neun unsichtbaren Hexzellen. Sichtbar ist ein einziger Geländekörper mit Oberseite, gerundetem Rand und Unterseite. Darüber läuft eine Straße aus dem Track Core, dazu zwei Häuser, Bäume, Felsen und geplante Plätze für Figuren. Seed 1–4 und vier R2C-Biome sind umschaltbar.

## Status
- **PASS** · Keine sichtbaren Kacheln oder Säulen. Oberseite, Rand und Unterseite sind ein Mesh.
- **PASS** · Straße aus dem Track Core 0.8.1, Prüfungen bestanden. Gelände mit Straßenbett, Damm oder Einschnitt. Auf der Insel niedrige Bordkante, an den Brückenköpfen hohe Brüstung, beides über Parameterkurven des Kerns.
- **TUNE** · Inselform, Farbflecken, Unterseite, Größenverhältnis Straße zu Insel.
- **TUNE** · Haus = KayKit building_A (Golden-Weg v8, auf 9 m skaliert). B2-Fassaden-Owner noch nicht angeschlossen.
- **OPEN** · Figuren fehlen (Register-To-do). Kreuzung, Kreisverkehr, Tunnel, Dreiergruppe, R2C-Vergleich mit gleicher Kamera folgen.

## DECISION
- Insel-Straßen ohne Querneigung (`bankDeg: 0`). Mit der Standard-Neigung (≈ 17°) lag die tiefere Fahrbahnseite unter dem Gelände.
- Fahrbahnmitte und -breite aus den Track-Core-Slots gelesen, nicht geschätzt.
- Masken (Fahrbahn, Gehwege, Plätze, Gebäude, Vegetation, Rand) werden vor der Dekoration berechnet. Bäume stehen nur in »Vegetation«, Felsen nur im Randstreifen.
- Ein Plan aus Höhen- und Maskenfunktion speist Gelände, Raster, Bäume und Häuser.

## TESTED RESULT (Claude-Vorschau)
Seeds 1–3, Biome Burg/Utopia/Dystopia, Ansichten Draufsicht, Mittel, Fahrhöhe, Laufhöhe und Unterseite im Bild geprüft. Drei Fehler im Bild gefunden und behoben: Straßenbett neben der Fahrbahn, Gelände über der geneigten Fahrbahn, zu hohe Leitplanken auf der Insel. fps-Werte in der Seite stammen aus der Vorschau.

## NOT_TESTED
GPU auf Georgs Gerät · Fahrt-Kamera über längere Zeit · Mobil.

## Nachtrag 2026-10-03 · Georgs vier Punkte
1. **Häuser ohne Bodenplatte · erledigt.** Bei building_A fallen alle Dreiecke weg, die ganz auf oder unter der Plattenoberkante y = 0,1 liegen. Das Haus steht mit seiner Unterkante im Gelände (`evidence/v1_lauf_haus_ohne_platte.jpg`).
2. **Joyride-Straßenlook · OPEN.** Quelle gefunden: `KFB_JOYRIDE_J14_…/lab-track/track-look.v5.js` (Knetstrang: Hohlkehle, Randwulst, Bauch, runde Bandenköpfe) auf Track Core v0.12 + `stream-to-three.v5.mjs` @ 927a1b4. Der Strang wird aber innerhalb von `boot()` als ganze Bühne gebaut und ist kein einzeln aufrufbarer Baustein. Ohne Kopie geht es nur auf zwei Wegen: (A) Joyride-Owner stellt den Strang als Funktion bereit (WSA-Aufgabe), oder (B) die Insel wird in die T4-Bühne gesetzt. Entscheidung offen.
3. **Textur-Artefakte und Pixelecken · behoben.** Die Oberseite bekommt jetzt eine 1024²-Farbkarte in Draufsicht (Knetflecken je Pixel, Wege und Plätze als gezeichnete Formen) statt harter Eckfarben. Masken laufen über dieselbe Karte; die Flächen werden in m² ausgezählt.
4. **Hexform · Standard ist jetzt der freie Umriss** aus 6–8 weichen Knetballen. Der Hex-Plan bleibt als Umschalter erhalten, weil R2C-Weltgraph und Brief das Raster als Planungsgrundlage führen. Sichtbar ist es nirgends mehr.

Dazu: Inselstraßen jetzt NARROW (10,8 m) statt STANDARD, und der Brückenkopf endet 6 m hinter dem letzten Inselpunkt (zweiter compileRecipe-Lauf mit gekürztem Endstück).

## Nachtrag 2026-10-03 (2) · Übergänge, Wasser, eine Naturfamilie
- **Übergänge** mit dem Joyride-Patchmuster `kfbBlend` (`road-markings.m1.js` @ 927a1b4, importiert): drei Lagen über den Grasflecken, Fels am Inselrand, Sand an Bankett und Ufer, Pflaster an Plätzen und Wegen. Der harte hellgrüne Randstreifen ist weg; Gras läuft in Punkten in den Fels der Unterseite aus.
- **Teich** am offensten freien Platz, eingesenkt, Wasserfläche in Knete, rund 260 instanzierte Knet-Tröpfchen, zum Ufer hin kleiner und seltener. Maske »Wasser + Ufer«.
- **Natur als eine Familie:** KayKit Forest Nature Pack (Baumform Tree_1 A/B/C, Büsche, Felsen, Gras) und Quaternius-Trittsteine auf den Gehwegen, alle @ 378b209. Die KayKit-Hexagon-Bäume und -Steine sind raus. Bäume stehen in drei Gruppen (Rule of Three), Büsche um die Gruppen, Felsen am Rand, Gras auf den Übergängen.
- Brief an WSA für den Knetstrang als Baustein: `BRIEF_WSA_KNETSTRANG_BAUSTEIN.md`.

## Nachtrag 2026-10-03 (3) · Bach, Schlucht, Wasserfall, Übergänge in drei Größen
- **Übergänge** jetzt in drei Größen aus derselben `kfbBlend`-Funktion: große Flecken, mittlere und kleine Tropfen nach außen, Tropfen der Grundfarbe zurück in die Fläche. Kein Verlauf.
- **Bach** vom Teich zur Inselkante, mäandernd. Er wird so geführt, dass er die Straße kreuzt; dort entsteht eine **Schlucht**, die Straße wird zur Brücke. Häuser und Plätze sind vor dem Ausschneiden geschützt.
- **Wasserfall** über die Inselkante: Knet-Wasserband plus 120 animierte Knet-Tropfen.
- **Stützen** unter der Schluchtbrücke nach dem J14-Rezept (Elefantenfuß, Taille, Bauch, Kapitell). PLATZHALTER: die Form ist aus `track-look.v5.js` übernommen, weil der Strang dort nicht als Baustein abrufbar ist. Wird durch `buildClayStrand` ersetzt (Brief an WSA).
- **Zwischen Inseln** fährt die Straße frei durch die Luft (Georg). Stützen nur, wo das Design sie verlangt: Schlucht, Brücke auf der Insel.
- **Keine Einzelhalme oder Einzelblätter** mehr (Georg). Felsen am Rand jetzt in drei Dreiergruppen, Büsche in Dreiergruppen um die Baumgruppen.
- Quaternius-Trittsteine größer (2,2 m Gruppe, 2,4 m Abstand).

TUNE: Schluchtwände, Wasserfallform, Kameraführung »Bach/Brücke«. Auf manchen Seeds liegt die Kreuzung nahe der Kante; dann sitzt der Wasserfall direkt unter der Brücke (Seed 6).

## Nachtrag 2026-10-03 (4)
- Start jetzt auf Insel #3 (Teich, Bach, Schlucht, Wasserfall). Insel #1 hat keinen Teich, deshalb zeigten »Bach/Brücke« und »Wasserfall« dort nichts.
- Post Mortem Quaternius-Pfadsteine: `POSTMORTEM_QUATERNIUS_PFADSTEINE_2026-10-03.md`.
- Session-ZIP für WSA: `export/kfb-r2d-session-2026-10-03/`.

## Nächster Schritt
Georg schaut die Insel an und sagt, ob Form und Maßstab die richtige Richtung sind. Danach: drei Inseln mit Verbindungsbrücke, Kreuzung und Kreisverkehr aus dem Track Core, Figuren aus dem Register.
