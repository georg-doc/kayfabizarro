# NOTIZ an den WSA-Lead · Knetwelt-Linie · 27.09.2026

## Stand

Die Claymation-Richtung (»KlayfaBizarro«) trägt jetzt drei Scheiben: D1 Knet-Probe (Look), M0 Knet-Medizin
(Messformen im Knet-Material) und **H0 Hirnwelt** (neu). Georg zu H0: »begeistert … großartig«. Er
nennt das Ergebnis in dieser Linie ausdrücklich besser als das, was im Work-Chat für den Look entstanden ist.

H0: ein anatomisch korrektes Hirn aus BodyParts3D (44 Netze, CC BY-SA 2.1 JP) als kleine Knetwelt.
Gyri sind Hügel, Sulci Flüsse, eine Straße läuft über die Grate und überspannt Furchen mit Brücken,
12 Orte sind nach der Funktion ihrer Region benannt, 14 KayKit-Figuren (4 Large, 10 Medium) aus dem
Resident Atlas, 8 Autos, Mitfahr-Kamera.

## Was übertragbar ist

- **Der Look ist drei Module, keine Szene.** `clay-material.v4.js` + `clay-relief.v2.js` (Material),
  `clay-soften.v1.js` (Vorstufe). Beide Bühnen (D1, H0) importieren sie unverändert. Einbau und Zahlen:
  `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`, Abschnitte 2–4.
- **Häuser bleiben unverändertes KayKit.** Die Cartoon-Fassaden (schiefe Fenster, weiche Türen) entstehen aus
  Vorstufe + Relief. Georg will genau dieses Muster behalten. Gilt auch für OSM-Blöcke.
- **Straßen auf Graten mit Brücken aus der Hüllkurve** (How-to Abschnitt 7) ist unabhängig vom Hirn und
  passt auf jedes Höhenfeld.
- **Kugel-in-Kugel** für Wolken und Bäume (How-to Abschnitt 5).

## Was der Lead wissen muss

- Nichts aus H0 berührt Race-Physik, Option-C-Kamera, OSM-Geografie, Augen-Rigs oder das World-Light-Rig.
- Kosten: H0 lädt ≈ 40 s (Vorstufe der Häuser zur Laufzeit), Bildrate nur in der Preview beobachtet.
  Für D2/Race muss die Vorstufe offline als `.glb` vorliegen.
- Lizenz: BodyParts3D CC BY-SA — abgeleitete Werke unter derselben Lizenz. Fingerabdruck-Karte (cgbookcase)
  vor Veröffentlichung prüfen.

## Gate

Georg wählt zwischen D2 (Cologne-Startgerade im Knet-Look, Bildrate), H1 (Hirnwelt mit Kreuzungen, Vorstufe
offline) und M1 (Knet-Werkstatt Erythrozyt).
