# POSTMORTEM · S1 Knet-Straße v1–v3 (+ T3 v3 Markierungen) · FAIL · 2026-09-28

**Urteil Georg (28.09., 01:34, 01:38:13, 01:38:27):** »Eindellungen sind okay. Der Rest ist ein Fail (Screenshot mit mindestens 5 Design-Fehlern, die auf fehlenden mentalen Modellen und heuristischen Design-Umsetzungen beruhen).« · »den üblichen Schatten-/Clipping-Bug ist auch zurück!« · »schwebende Markierungen …?« · Demo/Sample beigelegt (`ref/georg_sample_clay_street.png`).
**Verwendbar laut Georg:** die Eindellungen (Daumendellen/Druckmulden der Werkzeuge).
**Status:** `FAILED`. S1 v1, v2, v3 und die Markierungen in T3 v3 gelten als nicht abgenommen. K2 (Material v10) und T3 v2 sind nicht Gegenstand dieses Urteils.

## Was geliefert wurde

- **S1 v1** `road-scene.v1.js`: Verkehrsplatz, zehn Markierungsstile als Daten, KayKit-Stadtmöbel. Georg: Markierungen fragmentarisch ohne Formsprache, Bürgersteige passen nicht, Bordsteine kantig, Lampen/Ampeln sinnlos platziert, Fahrbahn grau / Markierung weiß statt Palette.
- **S1 v2** `road-scene.v2.js`: Regel »Knetwurst«, Palette `ROADPAL`, Möbel auf Palette, Ecken ausgerundet. Georg: Bordstein »draufgesetzt«, am Zebra muss er weiterlaufen, »mentale Modelle für Straßen-Architektur prüfen«.
- **S1 v3** `road-scene.v3.js`: Rinne → Bordstein-Zug → Gehweg, Falten auf der Fahrbahn aus, kräftigere Werkzeugmischung. Georg: Fail (Screenshot 01:34), Schatten-/Clipping-Bug zurück (01:38).
- **T3 v3** `track-look.v5.js`: dieselbe Knetwurst-Markierung über die TD03-Rahmen gebogen. Nicht einzeln beurteilt, beruht auf demselben Prinzip.

## Befunde an den Screenshots 01:34, 01:38:13, 01:38:27 gegen das Sample

Im Sample (Knet-Altstadt, gelbes Taxi): Die Straße ist aus einzelnen gerundeten Kopfsteinen gebaut. Die Bordsteine sind lange, helle, kastenförmige Steine mit sichtbarer Vorderseite, die Gehwege große quadratische Platten. Schwarze, kräftige Laternen stehen im Takt an der Bordsteinkante, Kugelbäume dazwischen. Die Häuser stehen direkt am Gehweg und bilden einen Straßenraum; warmes Licht, satter Himmel. Keine Fahrbahnmarkierung.

| # | Fehler im Bild | Beleg | Fehlendes mentales Modell / Heuristik |
|---|---|---|---|
| 1 | **Bordstein liest als Wurst**, die auf dem Gehweg liegt: runder Schlauch, keine erkennbare Stirnseite, keine Steine | 01:34 Kurve links, 01:38 | Ich habe die Formel des Strangs (Randwulst, T3) auf die Stadt übertragen. Ein Bordstein ist ein Baustein: Quader mit gerundeten Kanten, senkrechte Ansicht zur Fahrbahn, Stoßfugen, eine Reihe Steine. »Rund = Knete« war die Heuristik. |
| 2 | **Schwarzes Band vor dem Bordstein** liest als Loch oder Schlagschatten, nicht als Rinne | 01:34, 01:38 | Rinne als dunklere, abgesenkte Farbfläche gebaut; kein Bild einer echten oder gezeichneten Gosse (im Sample: keine sichtbare Rinne, der Kopfstein läuft an den Bordstein). Dazu Fehler 6. |
| 3 | **Fahrbahn als Kratzerteppich**: Fingerfächer-Stempel gleichmäßig über 10 m, lesen als Moiré und Schraffur | 01:34 unten | Oberfläche aus Werkzeugspuren statt aus Form. Im Sample trägt die Fahrbahn ihre Bedeutung über Bausteine (Kopfstein). Die Werkzeug-Mischung wurde nach Gefühl hochgedreht, um »fehlende Textur« zu beheben (Whack-a-mole, wie T2 #9). |
| 4 | **Markierungen als Stöcke auf der Fahrbahn**: Zebra aus dicken Pillen mit geriffelter Oberseite, Haltelinie schwebt schräg über dem Zebra, Leitlinien-Striche verschieden lang | 01:34 Mitte | Regel »alles ist eine Knetwurst« aus der Boost-Pfeil-Idee verallgemeinert. Straßenfarbe ist flach und bündig; die Haltelinie gehört VOR den Zebrastreifen und quer zur Spur, nicht darüber. Längen aus Kurvenabschnitten statt aus einem Takt. Kein Abgleich mit einer echten Kreuzung. |
| 5 | **Palette ohne Wärme und ohne Wertstufen**: Aubergine-Fahrbahn, Flieder-Gehweg, Petrol-Tisch, alles mittelhell | 01:34 gesamt | `ROADPAL` je Welt aus den T3-Farben abgeleitet, ohne Bild. Das Sample hat eine klare Leiter: dunkles Blau-Grau (Pflaster) → Hellgrau (Bordstein, Platten) → warme Fassaden → sattes Blau (Himmel). |
| 6 | **Schatten-/Clipping-Bug**: Stab und Bordstein zeigen abgerissene, gestufte Schatten; der Pfahl steht mit Schattenlücke am Fuß (»Peter Panning«) | 01:38 | Schattenkamera auf ±230 m gezogen (4096² → ≈ 11 cm pro Texel) und `normalBias` 0,15 für Objekte, deren Details 5–20 cm groß sind. Das Problem ist aus T2 bekannt und im How-to nicht als Regel festgehalten; ich habe es nicht gegengeprüft. |
| 7 | **Stadtmöbel falsch in Material und Form**: KayKit-Ampel eckig und texturiert, Schild als blaue Kiste, Laternen als dünne weiße Stäbe | 01:34 oben links | Möbel nur umgefärbt statt nach Cartoon-Anatomie gewählt oder gebaut. Im Sample: Laterne = schwarzer Mast mit dickem Fuß und großem Kopf, im Takt am Bordstein. |
| 9 | **Markierungen schweben**: Zebra und Haltelinie werfen einen versetzten, abgelösten Schatten, an den Kanten eine geriffelte dunkle Linie; sie lesen als Stöcke 20–30 cm über der Fahrbahn | 01:38:27 | Geometrisch liegen sie 4 mm über der Fahrbahn (Unterkante gemessen im Code: Extrusion −bv…+bv, Versatz +bv+0,004). Das Schweben kommt aus dem Licht: `normalBias` 0,15 m verschiebt den Schatten um mehr als die Dicke der Markierung (5 cm), dazu Schattenakne an den Fasen und kein Kontaktschatten (GTAO-Radius 1,2 m ist für 5 cm zu groß). Zweite Wirkung von #6. Dazu #4: 5 cm hohe, gewölbte Pillen haben eine eigene Silhouette und sind damit keine bündige Farbe. |
| 8 | **Kein Straßenraum**: breite leere Gehwegplatten, dahinter Tisch, keine Häuser | 01:34, Übersicht | Straße als isoliertes Objekt gebaut. Eine Straße liest erst mit ihren Rändern (Fassaden, Bäume, Laternen im Takt). Das stand im Brief (Rule of Three, Environment Grammar) und im Sample. |

## Wurzelursachen

1. **Wieder ohne Bildvorlage gebaut.** Die Regel aus dem T2-Postmortem (»kein Bau ohne freigegebenes, bebildertes Designprinzip«) habe ich für S1 nicht angewendet. Das Sample kam von Georg, nicht von mir.
2. **Ein Prinzip aus einem anderen Kontext übertragen.** »Knetstrang/Knetwurst« war für eine Fantasie-Rennstrecke richtig und wurde auf Stadtstraße, Bordstein und Verkehrszeichen gestülpt. Straßenarchitektur hat eigene Bauteile (Pflaster, Bordstein, Platten, Rinne, Möbel im Takt), die ich nicht aus einem Vorbild abgeleitet habe.
3. **Kritik lokal gepatcht.** Jede Rückmeldung (Bordstein, Textur, Linien) wurde als Einzelreparatur gelöst; drei Fassungen in 90 Minuten, jede erzeugte neue Fehler (Rinne als Loch, Kratzerteppich).
4. **Zahlenbeweis statt Bildurteil.** Messungen (Falten an/aus, Armrichtung) waren korrekt, beantworteten aber nicht die Frage, ob das Bild wie eine Knet-Straße aussieht.
5. **Bekannter technischer Fehler nicht als Regel verankert** (Schattenkasten/Bias). Er taucht in jeder neuen Bühne mit großem Schattenkasten wieder auf.

## Was bleibt verwendbar

- Eindellungen (Georg).
- Messwerkzeug: Schichten einzeln schalten und aufnehmen; hat die Falten als Linienursache gefunden.
- Vertex-Atlas-Farbe für KayKit (Klassen Pfahl/hell/rot/gelb/grün/blau) als Technik, nicht als Look.
- Aufbau von Markierungen in (s, u) über Stream-Rahmen (`track-look.v5`) als Technik.
- `fillet()` für ausgerundete Polygonecken.

## Was nicht wieder passieren darf

- Keine Straßen-, Stadt- oder Möbelform ohne Bildvorlage und benannte Bauteile daraus.
- Kein Prinzip einer anderen Welt übertragen, ohne es gegen die neue Vorlage zu prüfen.
- Bordstein ist ein Stein, Markierung ist bündige Farbe (oder in der Knetwelt eine sehr flache, bündig eingelegte Platte), Pflaster ist Form.
- Schattenkasten eng an die Kamera, `normalBias` und Kastengröße im Maßstab der kleinsten Details; jede Bühne mit einer Nahaufnahme am Fuß eines Pfahls und an einer Markierungskante prüfen.
- Kontaktschatten für Details unter 0,2 m (kleiner AO-Radius oder eigener Kontaktschatten), sonst lesen flache Teile als schwebend.
- Keine dritte Fassung am selben Abend: nach der zweiten Absage anhalten und Bildvorlage einholen.
