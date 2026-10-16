# RETURN · KFB Clay-Lid E2 · geschlossene Lidhaut · 2026-10-14

Status: KANDIDAT · wartet auf Georgs Sichtprüfung. E1 bleibt TUNE und unverändert daneben.
Werkbank: `KFB Clay-Lid E2.dc.html` · Module `lab-eyelid/clay-eyelid.v2.js`, `lab-eyelid/eyelid-bench.v2.js` (Fork von v1), `mesh-qa.v1.js`.
Kein Merge, kein Profilwechsel, kein neuer Runtime-Owner, keine Live-Promotion.

## Georgs Vorgaben (14.10. abends) → Umsetzung
| Vorgabe | E2 |
|---|---|
| Keine Schnittkante hinten und seitlich, Stielauge muss gehen | Eine Haut um den ganzen Augapfel, hinten zwei Pole (innen/außen), keine Fuge. Ruhe, von hinten: Augenweiß 0 px |
| Lider = eine geschlossene Form, Lidspalt als Öffnung mit passender Rundung | Ein Netz, Kugeltopologie (χ = 2), der Lidspalt ist die einzige Öffnung |
| Weit offen (Ruhe) wandern die Lidwinkel nach hinten | Lidwinkel A: Ruhe 105° von vorn (hinter der Silhouette), weit 118°, zu 80° (seitlich sichtbar). Regler |
| Ränder rund, innen bündige Kante zum Augapfel | Außenrundung 0,075 R, Innenkante 0,012 R, Innenfläche 1,012 R |

## Bau
Lidspalt in einer mittelabstandstreuen Karte um die Blickachse: x = A·cos ψ, y = U·|sin ψ|^(2γ) oben, −L·… unten.
U/L = Lidkante in der Mitte aus EyeRig v6 (Ruhe 55,6° / 59,6°, gleiche Formel wie E1), bei Lid zu 0,06° (Spalt 0,002 R).
160 Spalten vom Lidrand nach hinten: erst entlang der Randnormalen (0,5 rad), dann radial bis zum hinteren Pol.
Je Spalte ein offenes Profil innen → Innenkante → Lippe → Außenrundung → außen, 97 Punkte. 31 360 Dreiecke.
Am Lidwinkel wird die Normale über eine weichere Kurve geführt, damit die Spalten auch beim fast geschlossenen Spalt
fächern statt sich zu stauen. Gleiche Topologie in jedem Zustand, Lidschluss rechnet nur die Lage neu.

## Prüfung im Browser (weit, Ruhe, 25, 50, 75, zu)
Randkanten 0 roh/verschweißt · nicht-mannigfaltig 0 · Windung 0 · Volumen > 0 · χ = 2 · 1 Körper ·
Selbstdurchdringung 0 Treffer (442 367 Paare) · entartet/doppelt 0/0 · Dreiecksgüte min 0,026 · Abstand 1,20 % R.
Pupille bei Lid zu: 0 px in 8 Ansichten (vorn, 40° l/r, 30° o/u, 75° seitlich, von oben, von hinten) × 5 Blickrichtungen.
Gegenprobe Ruhe, Blick Mitte: vorn Pupille 5 088 px, seitlich 90° 106 px, von hinten 0 px Weiß.
GLB-Export des aktuellen Zustands: geprüft, 925 kB (eyeball, pupil, lid_skin).

## Bekannte Schwächen
- Bei Lid zu staucht sich die Haut am Ende der Naht, die Lippe bildet dort eine kleine Kerbe.
- Am hinteren Pol laufen 160 Dreiecke in einen Punkt; schattiert unauffällig, im Drahtgitter dunkel.
- Die Lidbewegung ist ein Gleiten der Öffnung, keine Drehung. Die Haut dehnt sich beim Schließen.
- Oval nur als Anzeige; Schritt 6 (Lattice-artig, Auge + Haut gemeinsam) wartet auf PASS.
