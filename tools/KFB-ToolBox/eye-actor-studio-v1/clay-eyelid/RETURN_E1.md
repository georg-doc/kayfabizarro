# RETURN · KFB Clay-Lid E1 · 2026-10-14

Status: **TUNE** · Georg 14.10.2026: »das ist schon nicht schlecht«. Kein PASS, kein FAIL. Die Kugel-Konstruktion ist die Basis
zum Feinstellen; Oval (Schritt 6) und EyeRig-v6-Anbindung (Schritt 7) warten auf PASS. Kein Merge, kein Profilwechsel, keine Live-Promotion.
Werkbank: `KFB Clay-Lid E1.dc.html` · Module `lab-eyelid/{clay-eyelid.v1,mesh-qa.v1,eyelid-bench.v1}.js`
Spender (unverändert, kayfabizarro @33051aa3 → `tools/KFB-ToolBox/eye-actor-studio-v1/`): `clay-lid.v1.mjs`, `upper-lid-volume.v1.mjs`, `thin-clay-lid.v1.mjs` (Negativ).

## Transkript-Gate
Beim Bau von E1 lagen keine Transkripte vor; E1 übernimmt aus den Videos nichts.
Nachgereicht im Re-Briefing 14.10. (Georgs Auswertung, hier nicht selbst geprüft):
- Video A, Jen Abbott (y3Q3oD7A1kM): getrennte Blick- und Lid-Controller, gegenläufige Ober-/Unterlider, Einzel- und Master-Controller.
- Video B, Raymond Gabriel (hTl825DO-Aw): Augapfel und Hornhaut getrennt verformt, Vertex-Gewichte, IK/Copy Scale, Oval über Lattice.
- Keins der beiden zeigt ein wasserdichtes Ton-Lidnetz. Für E1 relevant: A → Schritt 7 (Steuerung), B-Lattice → Schritt 6 (Oval).

## Bau (Geometrie-Vertrag §15/§16)
- Ein Augapfel R, eine Hülle Ri = R·(1 + clearance). Ober- und Unterlid = zwei Hälften dieser Hülle.
- Rahmen augenlokal, Scharnierachse X durch beide Lidwinkel. Jede Hälfte: konvexes Profil (abgerundetes Rechteck,
  79 Punkte, Innenkante 0,016 R knapp, Außenlippe 0,065 R weich), entlang β von Pol zu Pol gezogen, 96 Ringe.
- Ring j liegt ganz auf dem Kegel β_j um X → Ringe können sich nicht schneiden; Profil konvex → keine Selbstdurchdringung
  in keinem Zustand. Pole = je ein Scheitel auf ±X·Ri, von Ober- und Unterlid geteilt.
- Lidschluss: die Kante wandert nach EyeRig v6, die hintere Fuge (±177°) bleibt stehen, der Körper dehnt sich.
  Gleiche Topologie in jedem Zustand; die Lage wird neu gerechnet, das Netz nicht neu aufgebaut.

## Gemessen aus pet-eye-rig.v6.js (gelesen, nicht verändert)
Lidkante vorn: Oberlid 63,68° − 67,61°·c, Unterlid gespiegelt (aus rotation.x = ∓(1,30 − 1,18·c), Kappe 0,56π / 0,44π).
Ruhe c = 0,12 / 0,06 → Kante +55,6° / −59,6°. Lid zu c = 1 → −3,9° / +3,9° (7,8° Überdeckung). Weit c = −0,35 → ±87,3°.
Pupille: Kappe auf 1,004 R, Öffnung 0,12 + 0,5·0,62 rad. Blick ±0,5 rad. Schräge −slant·0,85 um Z. Lidfarbe 0xf2c93c·0,72, HSL +0,05/−0,02.

## Regel Pupillentiefe
clearance = max(0,012 R, Pupillenschale − R + 0,004 R). Bei v6 (1,004) bleibt 0,012; Stress 1,030 hebt die Hülle auf 1,034.

## Prüfung im Browser (Zustände weit, Ruhe, 25, 50, 75, zu; je Lid)
E1: Randkanten 0 (roh und verschweißt) · nicht-mannigfaltig 0 · Windungskonflikte 0 · Volumen > 0 · χ = 2 · 1 Teilkörper ·
Selbstdurchdringung 0 Treffer · entartet/doppelt 0/0 · Dreiecksgüte min 0,042 (Polfächer) · Abstand 1,20 % R · 14 592 Dreiecke.
Pixel-Verdeckung bei Lid zu, 6 Ansichten × 5 Blickrichtungen: Pupille 0 px.
thin-clay-lid.v1 (Negativ, Ruhe): 161 nicht-mannigfaltige Kanten, χ = 261, 280 entartete, 118 doppelte Dreiecke, Güte 0.
Grenze des Tests: Durchdringung wird über Kante-gegen-Dreieck geprüft; koplanare Überlappung erkennt er nicht.

## Offen für Georg
1. Liest E1 als zwei weiche Ton-Lider über einem Auge? (Vorn, 3/4, Lidschlag langsam)
2. Lidwinkel laufen spitz in den Pol zu; von der Seite liest das als Keil. Soll der Lidwinkel stumpfer werden?
3. Rückseite: 6° Fuge bleibt offen (im Wirt 0,24 R unter der Haut).
4. Oval und Frosch-Gieren nur als Anzeige; die Dicke skaliert dort mit der Achse.

## Re-Briefing 14.10. · Stand je Schritt
| # | Auftrag | Stand |
|---|---|---|
| 1 | clay-lid.v1 und upper-lid-volume.v1 isoliert zeigen | erledigt, unverändert geladen, Werkbank »Quelle« |
| 2 | thin-clay-lid.v1 nur als Negativ | erledigt, Netzprüfung zeigt die Schäden in Zahlen |
| 3 | Kugelauge, zwei geschlossene Lider aus einer Basis | E1 · TUNE |
| 4 | Topologie, Normalen, Oberseite, Lippe, Kontakt, Verdeckung | Netzprüfung 11/11, Pupille 0 px · Sichturteil TUNE |
| 5 | Ruhe und Lidschlag aus mehreren Winkeln, oben/hinten mit Drahtgitter | Werkbank, sechs Ansichten + Zustandsleiste |
| 6 | gemeinsame Lattice-artige Ovalverformung für Auge + Lider | wartet auf PASS von 3 |
| 7 | Anbindung an EyeRig v6 ohne neuen Owner | wartet auf PASS von 6 |

## Was beim TUNE offen ist
Georg hat keinen Einzelpunkt benannt. Kandidaten aus der eigenen Sichtung: Lidwinkel spitz (Keil von der Seite),
Dicke und Lippenradius, Dehnung des Oberlids beim Schließen (Spanne 116° → 181°), 6° Fuge hinten.
