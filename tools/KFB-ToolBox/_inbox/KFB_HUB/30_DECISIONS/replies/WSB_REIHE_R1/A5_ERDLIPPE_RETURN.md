# WSB_REIHE_R1 · Auftrag 5 · Erdlippe am Fuß von Stämmen und Steinen (V-864, V-753, V-1714) · RETURN

WSB (Mac mini), 14.11.2026. Brief §5.

Leitbild `replies/KRATER_MENTALMODELL_R1.md`, Stufe 1: nur die Lippe. Die Erde hat das Wachsen nach außen begleitet bzw. der Sand hat sich am Stein angehäuft.

Die Lippe verdeckt den Fuß, „eingesetzt statt draufgesetzt“. Nur aufgetragen, nie ausgestanzt (Delta ≥ 0). Nichts ins Spiel eingebaut.

## Vorlage (Blender → Proof-Stage)
**Objekte** aus dem Spiel (`src/assets/place/`), Geometrie unverändert:
- KayKit-Baum `Tree_1_A_Color1`
- Quaternius-Palme `palm_1`
- Fels `stone_felsen_m_g`

**Lippe** (`scripts/erdlippe.py`) nach dem Golden Sample, wenig Geometrie:
- Form: ein Ring aus 5 Ringen × 48 Sektoren (384 Dreiecke).
- Der innere Rand liegt 0,2 × Auslauf im Objekt; so verdeckt die Lippe den Fuß.
- Fußradius je Sektor aus den Punkten im untersten Band gemessen, wie `einbettung.js fussRadien`.
- Profil: Kamm am Fuß, außen weich auslaufend (Flanke flach). Rauschkante außen (zwei Rauschfrequenzen), keine Kreisform.
- Gemalte Abstufung als Vertex-Farbe, kein eingebackenes Licht:
  - innen der Kontaktton als schmale Stufe, 10 L* dunkler (V-570, wie `groundAlbedo.js` kfbStepL)
  - am Kamm ein Hauch Erde
  - außen die Bodenfarbe

**Je Objekt:**

| Objekt | Bauweise | Lippenhöhe | Auslauf |
|---|---|---|---|
| Baum | 4 Wurzel-Buckel (Lippe dort höher und weiter: die Erde hat das Wachsen begleitet) | 0,23 m | 0,91 m |
| Palme | gleichmäßiger Sandring | 0,11 m | 0,44 m |
| Stein | Sandverwehung, Luv höher, Lee mit langem Schweif; Höhe auf 20 % der Objekthöhe begrenzt | 0,14 m | 0,58 m |

**Bühnenfarbe:** Auf der Bühne ist der Boden die Hohlkehle `#f2e8d8`. Die Lippe nimmt deshalb diese Farbe; im Spiel nimmt sie das Gelände-Material.
- In R1 und R2 lasen sich farbige Lippen auf dem neutralen Boden als Scheibe.

**Dateien:**
- `glb/<objekt>_ohne|mit|gemalt.glb` und `glb/lippen.json`
- Proofs `proof/` mit Spielkamera 35° (threeq), seitlich, Fuß nah, vorn; Gate-Bögen PASS (G4 WARN: Kit-Inseln)
- Blätter `blaetter/A5_<objekt>.png`

## Befund: Welche Bauweise trägt im Spiel
Im Spiel ist der Boden tagsüber absichtlich flach beleuchtet (terrain3 `uT3Flat`). Alles, was nur über Normalen bzw. Schattierung wirkt, verschwindet dort. Daran sind die beiden Shader-Versuche von WS0 gescheitert.

Die Diagnose-Ansicht `diagnose/A5_diagnose_flach.jpg` (unbeleuchtete Albedo, Kanon Gebiet 17 (9a)) steht für diesen Fall. Je Objekt drei Fassungen:

1. **Ohne:** Der Fuß endet mit glatter Kante auf dem Boden, draufgesetzt.
2. **Nur gemalt** (Albedo, keine Höhe): Es entsteht ein Farbhof um den Fuß. Die Fußlinie bleibt glatt abgeschnitten, nichts wird verdeckt. Das liest sich als Fleck bzw. Halo, nicht als eingesetzt; ein Verlauf widerspricht dazu V-403.
3. **Gebaut** (kleine Geometrie plus Kontaktton): Die Lippe verdeckt den Fuß. Die Fußlinie wird unregelmäßig, das Objekt steckt im Boden. Das trägt auch ohne Licht, weil es über Verdecken und Umriss wirkt, nicht über Schattierung.

**Empfehlung für das Spiel: gebaut**, also je Objekt ein kleiner Lippenring wie `einbettung.js`, nur kleiner:
- Material = Gelände-Material (wie `dioboden=r1`, Biom-Gewichte), damit keine Scheibe entsteht.
- Kontaktton als schmale Stufe; Rauschkante.
- Instanziert je Objektart, 96–384 Dreiecke, für die Ferne 24 Sektoren × 3 Ringe.
- **Höhe im Höhenfeld** trägt nur, wenn das Geländegitter fein genug ist. Die Lippen sind 0,4–1 m breit; bei Gitterweiten um 1 m geht das nicht. Höhe bleibt deshalb Dioramen bzw. großen Objekten (Düne) vorbehalten.
- Die gemalte Albedo bleibt als zweite Schicht: Kontaktton und Sprenkel aus `groundAlbedo.js`, nicht als Ring-Verlauf.

## Kritiker (CRITIC_3D_R1, gezählt K4 und K6) · STOPP-BERICHT
| Runde | Stand | K4 | K6 | Urteil |
|---|---|---|---|---|
| R1 | Ordner oben (v5) | 5 | 7 | REWORK |
| R2 | `r2/` (v7): Palme mit Lappen, Stein als gerichtete Verwehung (Luv steigt an, Lee-Schweif), harte Kontakt-Stufe, flacherer Auslauf, Satelliten, Helligkeit abgeglichen | 5 | 6 | REWORK |

Nach zwei Reparaturen ohne Punktgewinn bei K4 greift die Stopp-Regel.

**Die Kernfrage beantworten beide Läufe gleich:**
- In der flachen Diagnose liest sich **nur „gebaut“** als eingesetzt statt draufgesetzt.
- Die harte schmale Kontaktlinie und das Verdecken des Fußes bleiben auch ohne Licht sichtbar.
- „Nur gemalt“ liest sich als Fleck bzw. Ring neben einem unveränderten Fuß, „ohne“ als draufgesetzt.

**Vermutete Ursache der offenen Mängel** (Scheibe bzw. Teller, Doppelkontur am Rand, Ton weicht vom Boden ab, Fläche liest sich in der Diagnose als Fleck): Die Vorlage steht auf der Proof Stage, nicht im Gelände.
- Die Lippe ist eine eigene Requisite (Knet-Profil midground), der Bühnenboden die Hohlkehle (Profil background) mit anderer Materialantwort.
- Ein und derselbe Boden lässt sich auf der Bühne deshalb nicht herstellen. Jeder Ton- oder Kantenunterschied liest sich als aufgelegtes Material.
- Im Spiel nimmt die Lippe das Gelände-Material selbst (wie `einbettung.js` mit `dioboden=r1`: Biom-Gewichte je Ecke, eine Materialantwort). Damit entfallen Ton-Sprung und Randkontur.
- Weitere Runden auf der Bühne würden nur die Bühnen-Abweichung nachstimmen.

**Vorschlag:** Bauweise „gebaut“ im Spiel an einer Musterstelle mit Gelände-Material prüfen (Spielkamera, Tag mit uT3Flat), dann den Kritiker im echten Gelände. Kanon Gebiet 15(6): Abnahme immer im echten Terrain.

**Weitere offene Punkte des Kritikers** für den Einbau im Spiel:
- Wurzel-Buckel des Baums aus 35° zu schwach.
- Umriss beim Baum eckig (48 Sektoren); im Spiel mit 64 Sektoren und Glättung.
- Satelliten sollen Cluster aus Klecks- und Keilformen sein statt runder Punkte (Sprenkel-Modul V-403 statt eigener Klümpchen).
- Die Lippenfläche beim Baum ist groß im Verhältnis zum Stamm.

Gültig ist der Stand `r2/`: `r2/glb`, `r2/proof`, `r2/blaetter`, `r2/diagnose`, Skript `r2/erdlippe.r2.py`.

## Dateien
- `glb/`, `proof/`, `blaetter/`
- `diagnose/` (Einzelbilder `<objekt>_<fassung>_flach.png`)
- `scripts/`: `erdlippe.py`, `diag.py`, `r1.sh`
