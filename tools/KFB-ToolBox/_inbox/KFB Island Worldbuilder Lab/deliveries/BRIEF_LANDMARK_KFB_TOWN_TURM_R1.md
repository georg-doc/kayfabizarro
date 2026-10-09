# Briefing · Landmarke KFB Town: Königsturm R1 (Golden Sample für alle Landmarken)

Stand: 2026-10-09 · Georg-Richtung · **noch kein Bauauftrag.** Zuerst wird ein Platzhalter aus dem Asset Librarian gewählt, dann entsteht das Konzeptblatt.

## Geschichte (§00)

King Kayfabian, der helle Paladin mit Krone, hat sich seinen Sitz auf die Anhöhe über dem Marktplatz gebaut. Die Leute aus der Stadt haben dafür Stein für Stein aus Knetstein geschichtet. Der Turm ist cartoonig deformiert, leicht schief und zu hoch, eine satirische, nicht-heroische Macht.

Wer zum König will, muss die Ton-Treppe hinaufsteigen wie zu einem Thron. Vor Tor bzw. Zugbrücke steht der Schwarze Ritter Wache. Wappen, Banner und Fähnchen zeigen, wer hier wohnt. Auf dem Marktplatz unten steht das königliche Billboard.

## Bestandteile

| Teil | Inhalt | Bezug |
| --- | --- | --- |
| Anhöhe + Treppe | leicht erhöhtes Plateau, Ton-Treppe als Aufstieg | Mauerwerk-Familie A (Stufe, Mauer, Deckstein) |
| Innenhof | kleiner Hof hinter dem Tor, halb offen einsehbar | Kanten-Grammatik: Abschlussstücke, Rubbel |
| Tor / Zugbrücke | gebautes Ende, Wachposten des Schwarzen Ritters (Wach-Idle) | Blender-Coworker: Wach-Idle |
| Hoher Turm | eine starke, schiefe Silhouette, aus jeder Kamera als KFB Town erkennbar | Landmarke = höchstes Element |
| Thronraum | optional als halb offene Raumszene, Konstruktion mit dem Dungeon-Generator bzw. Dungeon-Modulen (MacroCell) | Maßstab K2, Tür ≥ 1,15 H |
| Heraldik | Wappen, Banner, Fähnchen in der Inselpalette, bewegt (Wind-Gruppe) | Farb-Grammatik `ENV_ROLES` |
| Königliches Billboard | auf dem Marktplatz, königliche Bekanntmachungen bzw. Quotes | Clay Stage R2, Billboard-Kit |

## Golden Sample

Der Turm wird das Muster dafür, wie KFB Landmarken baut:
- zuerst die Geschichte;
- dann Silhouette und Maßstab;
- dann Bauteile aus den Familien;
- dann die Abnahme aus den Spielkameras.

Danach folgen weitere Landmarken nach demselben Verfahren, zum Beispiel der Kölner Dom (bisher nur eine Grundidee).

## MVP-Arbeitshypothese (Georg, 09.10.)

- **Für den MVP gesetzt:** die Burg mit dem **zentralen hohen Turm** aus „Hyper Casual Cartoon Castles“ (Unity Asset Store, gekauft). Das ist die orange-rosa Burg mit Mittelturm und vier Ecktürmen, in Georgs Screenshot die mittlere Reihe.
  - Das Paket hat je Burg **3 Zerstörungsstufen**. Das Modell wird so genommen, nicht geschnitten. Für späteres Zerstören kommen Knet-Rubbel-Kügelchen dazu (Kanten-Grammatik). Das ist nicht die Zellen-Logik, aber ein Ausgangspunkt.
  - **Figuren:** der helle Paladin auf dem Mittelturm, der Schwarze Ritter vor dem Tor. Damit lässt sich prüfen, wie ein Medium-Rig auf einem großen Landmarken-Turm wirkt.
  - **Alternative:** die rote Burg mit Zugbrücke aus demselben Paket.
  - **Inventur (09.10.):** Bericht `KFB_HUB/00_INBOX/claude-code/2026-10-09_claude-code_unity-pakete-intake.md`; Dateien `~/KFB-AssetCache/unity/` (nur lokal, Asset Store EULA: im eigenen Build ja, nie roh ins öffentliche Repo, kein KI-Training).
    - Die Burg mit Mittelturm ist **Big Castle** (von Georg bestätigt: die rosa bzw. terrakotta Burg, 2. Spalte von rechts in der Paketübersicht), Dateien `CS_Big_Castle_Stage01/02/03.fbx`. Jede Stufe ist ein Mesh mit 16×16-Palette, das Umfärben auf die Inselpalette ist also leicht. Zerstörung erfolgt per Modelltausch.
    - Mittelturm-Plattform: Ø 2,9 m auf 5,06 m Höhe, ohne Treppe. Tür 0,9 m, deshalb **× ≈ 2,2 skalieren** (Türregel ≥ 1,15 H). Danach hat die Plattform ≈ 3,7 H Durchmesser, der Turm ist ≈ 6,5 H hoch, Platz für den Paladin. Weltlogik: Aufstieg durch eine Innentreppe im Turm.
    - Zugbrücke nur bei **Evil Castle** (fest eingebaut). Weitere Burgen: Hexagon, Small.
- **Später (Golden Sample):** ein gewundener, cartoonig deformierter Turm nach Bildvorlage, mit Blender MCP bzw. einem Mesh-Tool. Daraus entsteht eine Form- und Bildsprache für weitere Landmarken: Kölner Dom, MoMA, Louvre, Tate, Vatikan bzw. Vatikanbank, Eiffelturm; übertrieben hoch und schief, Cartoon-Deformer bei hohen Strukturen. Anschluss an die frühere OpenStreetMap-Linie mit den „Cartoon-Elastik-Grotesk-Landmarks“.

## Ablauf

1. **Georg** wählt im Asset Librarian einen Platzhalter, ein Turm- oder Burgmodell mit passendem Maßstab.
2. **Konzeptblatt:** Silhouette aus drei Kameras, Bauteilliste, Maße in H und MC.
3. **Bau:** Owner ist RKIT bzw. der Blender-MCP-Coworker. Der Turm wird aus Mauerwerk-Familie A plus den gewählten Kit-Teilen gebaut, nicht als freie Neuform.
4. **Abnahme:** harte Regeln, blinder Kritiker, dann Georg.
