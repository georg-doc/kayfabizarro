# Claude Design · KFB Island Look R1

Du baust den **Look einer schwebenden KFB-Insel** als three.js-Design-Lab, im selben Stil wie die Joyride-Sessions (J14–J17). Keine Story, keine Bewohner, keine Straßen. Nur: Wie sieht eine gute Insel aus, von oben, von der Seite und von unten?

## Referenzen (angehängt)

1. **DioramaScenes (Übersicht + A–I)** (`KFB Claymation Reference/`): acht schwebende Inseln. Das ist die Zielform: flache, bewohnbare Oberseite, darunter abgerissene Erde. Jede Insel hat ein eigenes Biom und **eine** klare Landmarke.
2. **FLOATING ISLANDS DESIGN** (gleicher Ordner): illustrierte Inselkarte, Stimmung und Inselvielfalt.
3. **Joyride-Paletten** (`track-look.v5.js` · `WORLDS`): Canyon, Bikini-Bucht, O-Town, Werte unten.
4. **Joyride-Naturgrammatik** (`track-look.v5.js`): krumme Röhrenstämme mit Kugel-in-Kugel-Kronen, gequetschte Buschkugeln, klumpige Felsen, schiefe Kissenblock-Türme, Kugelwolken. **Rule of Three:** ein Baum als Anker, zwei Büsche als Stütze, ein Fels als Akzent.
5. **KFB Clay K2** (`clay-material v10` + Fingerabdruck-Scan): Material für alle Flächen.

## Was der letzte Versuch falsch gemacht hat (nicht wiederholen)

- **Die Unterseite war ein umgedrehter Kegel mit Facetten.** Das war bisher bei jedem Inselversuch der Fehler.
- **Die Vegetation war gleichmäßig verteilt.** Dreiergruppen gab es technisch, aber so dicht, dass keine Komposition zu lesen war.
- **Die Oberseite war eine glatte Scheibe** ohne Relief an der Kante.

## Was die Unterseite zeigen muss

Gemessen an den Referenzen (W = Inselbreite an der Kante, gemessen in der Referenzansicht ~15–20° von oben):

- Platte (Grasnarbe + Erde) 4–9 % von W, **dicke variiert** rund um die Kante; harte obere Kante, Seitenflächen leicht gekippt, sodass helle und dunkle Abschnitte wechseln.
- Die Unterseite beginnt etwa 10 % von W **innerhalb** der Kante, die Platte wirft eine dunkle Lippe.
- Tiefe unterhalb der Platte 0,21–0,29 W.
- Breite der Unterseite bei 25 / 50 / 75 % ihrer Tiefe ungefähr 64–70 / 39–42 / 18 % von W (Referenz A).
- Ende: entweder eine außermittige Spitze (A, E) oder 2–4 hängende Zacken unterschiedlicher Länge (C, G). Tiefster Punkt nicht in der Mitte.
- Große Dreiecksfacetten, 15–35 % Helligkeitsunterschied zwischen Nachbarn; 5–9 Ecken je Seite im Umriss; eine Stufe auf 30–50 % der Tiefe.
- Umriss oben: 12–20+ gerade Kanten mit 2–3 Buchten von 4–8 % W.

Sie muss wie ein aus dem Boden gerissenes Stück Erde aussehen, nicht wie ein Kreisel:

- **Erdschichten:** sichtbare Strata mit unterschiedlicher Dicke und Farbe, direkt unter der Grasnarbe eine dunkle Humusschicht.
- **Unregelmäßiger Umriss nach unten:** mehrere Zapfen und Lappen statt einer zentrierten Spitze. Asymmetrisch, mit Abbruchkanten.
- **Wurzeln** hängen heraus, wo oben Bäume stehen.
- **Felsbrocken** stecken in der Erde und ragen heraus.
- **Überhang:** Die Grasnarbe steht ein Stück über, an einzelnen Stellen hängt sie herunter.
- **Optional:** Ein Wasserfall läuft über die Kante, wo oben ein Teich ist. Einzelne Knetkrümel fallen langsam nach unten.

## Was die Oberseite zeigen muss

- **Komposition statt Streuung:** eine Landmarken-Zone (Platzhalter-Fußabdruck reicht, das Gebäude setze ich selbst), dazu zwei bis drei Vegetationsgruppen nach Rule of Three. Dazwischen freie Fläche, auf der ein Weg oder Platz liegen kann.
- **Relief:** Kante mit Felsen, kleine Klippen oder Absätze, Teich oder Bach, wo das Biom es hergibt.
- **Größenstaffel:** wenige große Elemente, mehr mittlere, viele kleine.

## Paletten (1:1 aus Joyride)

| Insel | Boden | Hügel | Türme | Laub | Stamm | Fels | Himmel |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A · Canyon | #8b68c7 | #a582d9 / #7b5bb8 | #ef5a22 / #e8743a | #1f7a3e / #2f8a45 / #cdc666 | #8a5a3a | #e2d0bc | #96bede |
| B · Bikini-Bucht | #f0cf7e (Sand) | #5cc3bf / #46adb2 (Aqua-Dünen) | #9a6fd0 / #b08ae0 (Korallen) | #8fcf45 / #5fb84a / #f7a1c4 (Blüten) | #c9895a | #9a6fd0 | #8fd6ec |
| C · O-Town | #3aa596 (Petrol) | #2f8f83 / #4cb5a5 | #c9508f / #e0679f (Wackeltürme) | #f08a2c / #f5b041 / #c9508f | #6b4a8a (lila) | #e0679f | #a8d8b9 (Mint) |

Die Farben der Unterseite leitest du aus der jeweiligen Palette ab, zum Beispiel beim Canyon Terrakotta-Orange wie die Türme.

## Lieferung

1. **Eine HTML-Seite** mit den drei Inseln Canyon, Bikini-Bucht und O-Town, jeweils mit Ansicht von oben, von der Seite und von unten. Ein Umschalter zwischen den Inseln reicht.
2. **Ein JS-Modul** `island-look.v1.js` mit einer Funktion
   `buildIsland({ outline: [[x,z],…], palette, seed, features: { pond, mount, towers, trees } }) → THREE.Group`.
   - `outline` ist ein beliebiger geschlossener Umriss in Metern. Die Insel muss für **jede** Form funktionieren, auch langgezogen oder eingebuchtet, denn ich ziehe die Form im Editor selbst.
   - Größenordnung: 40–70 m Durchmesser, Figur 1,9 m.
   - Dazu `heightAt(x, z)`, damit Gebäude auf dem Boden stehen.
3. **Screenshots** pro Insel: oben, Seite, unten.

## Nicht machen

- Keine Gebäude, keine Bewohner, keine Straßen, keine Story.
- Kein umgedrehter Kegel, keine gleichmäßige Streuung, keine Low-Poly-Fremdästhetik. Die Floating Islands sind die Formreferenz, Joyride und Clay sind die Materialsprache.
