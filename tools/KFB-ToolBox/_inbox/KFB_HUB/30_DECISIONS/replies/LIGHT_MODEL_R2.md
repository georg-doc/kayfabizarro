# Licht-Modell R2 · ein Licht für alle Stimmungen (V-382, V-385) · 17.10.2026

Georg 17.10.: V-346-Licht auf der Staging-Seite = FAIL bzw. großes TUNE, auch konzeptionell. Grundlage dieser Fassung: WS0-Sichtprüfung (Tag/Gold/Nacht) + **Audit aller Licht-Recherche** `LIGHT_RESEARCH_AUDIT_R1.md` (28 Quellen, 21-Zeilen-Matrix, KayKit-Vorgehen).

## Ehrlicher Befund
WS1 hat die gemessenen Werte unserer Recherche übernommen (J17-Tageslicht, Sonnenrichtung, E50-Goldstunde, Texel-Schatten), aber die **Prinzipien** gingen verloren. **Drei der fünf Fehler hat WS0 selbst bestellt**: Randlicht (L2 Schritt 1), Gesichts-Selbstleuchten (V-346 Punkt 1), getrenntes Tonemapping `toneSplit` (V-346 Punkt 3, V-378) und die unbeleuchtete Karte (WS0_TO_WS1 „Kartenfläche bleibt toneMapped:false“, Prüfung G3). WS1 muss nichts „reparieren“, was es auf Auftrag gebaut hat – R2 ersetzt diese Aufträge.

| Fehler | Ursache (Audit-Beleg) |
|---|---|
| Saum um FrizzleBob | drei helle Terme auf der Silhouette: Fresnel-Randlicht `actorRim.js` (#ffb066, 0,55) + Clay-**Sheen** 0,18 (nur GothGirl auf 0,06 gesenkt) + Look-B-violettes Gegenlicht |
| Karte nachts taghell | `MeshBasicMaterial`, `toneMapped:false` (`billboard.js:60`, `meshyStage.js:51`) – von WS0 so verlangt |
| Rahmen nachts weg | keine Praktischen am Amphitheater; gelieferte Goblin-/Atlantis-Praktische nicht eingebaut (`practicals: []`); Himmel/Nebel nachts 35 % Helligkeit, dunkler Rahmen verschmilzt |
| Gold ≈ Tag | E50 ist Mittelwert Abend/Tag; Look B wärmt schon den Tag; kühler Gegenakzent sitzt am Gegenlicht statt an der Füllung; Himmelshelligkeit unverändert |
| Figuren aufgeklebt | eigenes Randlicht + `faceFill` konstant über die Tageszeit; `toneSplit` = andere Tonkurve als die Bühne; Hemi-Boden konstant statt `edgePalette`; vier Materialklassen reagieren verschieden; nur Kontakt-Klecks, kein AO |

**KayKit-Vorgehen (unsere Tutorial-Lektion A):** eine Umgebung für die ganze Szene, Nacht = dieselbe Szene dunkler; „Characters consume that scene light; they do not carry a second private world-light rig“; ein Schatten-Hauptlicht von oben, Fackeln nur als Akzent, matte Materialien (Rauheit ≈ 0,95), Kontaktschatten unter jedem Teil, Leuchten über Emissive-Material, nicht Lampe je Teil.

## Grundsatz
**Eine Szene, ein Licht-Rig, ein Ton-Pfad, eine Material-Antwort.** Stimmungen sind Einstellungen dieses Rigs. Keine Karte und kein Boden hat ein privates Licht; Figuren haben genau ein echtes, warmes Figurenlicht als Teil des Rigs (Regel 11), keine Tricks.

### Die zehn Regeln
1. **Silhouette:** Fresnel-Randlicht entfernen **und** Figuren-Sheen ≤ 0,05 im selben Schritt (mit Schaltern belegt). Das J17-Gegenlicht bleibt **immer an** und **ungesättigt** (kein Violett).
2. **Gold** = tiefe, warme Sonne **plus kühlere Füllung**; Himmelshelligkeit ändert sich mit. Füllung nicht wärmer und nicht dunkler machen (sonst Wiederholung von V-050 „zu orange und zu dunkel“).
3. **Look-B-Sättigung im Licht streichen:** Wärme kommt nur aus Himmelstönung, Boden-Rückstrahlung und Hauptlicht.
4. **Hemi-Boden = `edgePalette` der Bühne** (V-355); ersetzt `faceFill` als Aufhellung von unten (Kinn, Mund).
5. **Ein Tonemapping für alle Schichten**, gewählt per Test bei **fester Belichtung**: ACES vs. Neutral (Lab) vs. AgX (ClayBound-Recherche). `toneSplit` entfällt.
6. **Nacht nach KayKit:** Mond + Hemisphere tragen die Lesbarkeit; Praktische sind **Licht-Inseln** (≥ 2 je Nachtbild), keine Belichtungsanhebung. Zuerst die gelieferten Praktischen (Goblin 12, Atlantis 11) einbauen.
7. **Billboard-Lampen** aus den Lampenarmen des Highway-Spenders: Emissive-Köpfe folgen dem Nachtgewicht, plus ein Pool-Licht auf Rahmen und Karte. Neue Messgröße: Rahmen-zu-Hintergrund-Kontrast.
8. **Karte = beleuchtetes, mattes Papier.** Neue Prüfung G3: Druckfarbton und Chroma bleiben, Helligkeit darf der Stimmung folgen.
9. **Gleicher Licht- und Ton-Pfad für jede Materialklasse** (Clay, Karte, Meshy, Fahrzeug; Metall mit PMREM nach V-370). AO-Probe im Budget V-370.
10. **Raster vollständig:** V-355-Messung je Schicht, Clipping < 0,1 %, G2/G4, 16:9 **und** 9:16, erster Durchgang mit fester Belichtung. Lichter-Budget = V-329-Pool (4–6) + fps-Budget V-370.

### Regel 11 · Figurenlicht wie im Cartoon (Georg 17.10., V-386)
Figuren bekommen ein **eigenes, warmes Figurenlicht**, damit Gesicht, Augen, Brauen und Mund (Eyes/Brows/Mouth as Actors) in jeder Stimmung gut lesbar und knuffig ausgeleuchtet sind – nie im Halbschatten, nie überstrahlt. Das ist kein Widerspruch zu „ein Rig“, wenn es **richtig gebaut** ist; gescheitert ist nur die falsche Bauweise (Fresnel-Saum, Selbstleuchten, eigene Tonkurve).
- **Echtes Licht, kein Trick:** ein weiches, schattenloses Licht (Spot/Rect mit weicher Kante) von vorn-oben auf Kamera-Seite, auf die sprechende Figur bzw. Dialog-Gruppe gerichtet; Farbe warm (≈ 3200–4000 K). Kein Fresnel, kein Emissive, gleiche Tonkurve wie die Szene.
- **Stimmungsabhängig:** tags kaum sichtbar (Gesicht folgt der Sonne), Gold mittel, nachts stärkster Anteil – Gesichter bleiben lesbar, auch wenn die Bühne dunkel ist (Cartoon-Konvention).
- **Gehört zur Szene:** fällt mit Abfall auch leicht auf den Boden direkt um die Figur (kein Ausschluss per Licht-Layer), dadurch kein „aufgeklebt“. Motivierbar durch Billboard-, Laternen- oder Mondlicht.
- **Augenlicht:** kleines Glanzlicht in den Augen (Catchlight) aus demselben Licht, für lebendige Augen.
- **Budget:** ein Figurenlicht pro Dialog-Gruppe, zählt im V-329-Pool.
- **Messung (L-9):** Gesichts-Helligkeit in jeder Stimmung im Zielband (nicht unter Bühnen-Mittel × 0,9, Clipping im Gesicht < 0,1 %); Mundzone vs. Stirn ≥ 0,85 (kein Halbschatten über dem Mund); Farbtemperatur im Gesicht warm; Saum weiterhin ≤ 2 px.

### Stimmungen = Rig-Einstellungen
| Stimmung | Hauptlicht | Füllung (Hemi) | Gegenlicht | Praktische | Himmel |
|---|---|---|---|---|---|
| Tag | J17-Werte (#fff4e6 / 2,9) | J17 Himmel #eef4fa, Boden = edgePalette | an, neutral 0,6 | Emissive aus | J17, nur getönt |
| Gold | tief, warm-orange | **kühler** als Tag | an, neutral | schwach (Emissive) | dunkler, wärmer |
| Nacht | Mond, kühl, schwach | dunkelblau, Schatten lesbar | an, kühl-neutral | Inseln an (Billboard + Bühnen-Praktische) | dunkel, Rahmen hebt sich ab |
| Story-Modes (später) | nur Tönung von Boden (V-305/V-331) und Praktischen | | | | |

### Ausdrücklich geändert (Register)
- V-378 Satz „Tonemapping bleibt ACES im Renderer (toneSplit)“ → ersetzt durch Regel 5.
- G3 „Kartenpixel unverändert“ → ersetzt durch Regel 8.
- BILLBOARD_STANDARD_R2 „keine Zusatzteile“ → Ausnahme: Lampenarme/Leuchtköpfe nach Regel 7.
- L-7 „≤ 2 echte Lichter“ (R2-Entwurf) → V-329-Pool + V-370-Budget.
- Gegenlicht nur Gold/Nacht (R2-Entwurf) → immer an wie J17.

## Abnahme-Raster
| ID | Prüfung | Schwelle |
|---|---|---|
| L-1 | Rahmen lesbar in jeder Stimmung | Rahmen ≥ 25 % der Kartenhelligkeit; Rahmen-zu-Hintergrund-Kontrast ≥ 1,5 : 1 |
| L-2 | Karte nie heller als ihr Licht | nachts Karte ≤ 1,5 × Rahmen; Druckfarbton/Chroma ΔE ≤ 5 zur Tagfassung |
| L-3 | kein Saum | ≤ 2 px bei 1080p an allen Figuren, alle Stimmungen |
| L-4 | Stimmungen unterscheidbar | Bildmittel Tag↔Gold ΔE ≥ 8, Gold↔Nacht ≥ 12 |
| L-5 | Figuren gehören zur Bühne | Gesicht ↔ Boden daneben 0,8–1,6; V-355 je Schicht Helligkeit/Sättigung ≤ 15 % Abstand |
| L-6 | Schatten/Clipping | Schattenkontrast tags ≥ 25 %, nachts Schatten L ≥ 8; Clipping < 0,1 % |
| L-7 | Nacht-Inseln | ≥ 2 Licht-Inseln je Nachtbild |
| L-9 | Figurenlicht | Gesicht ≥ 0,9 × Bühnen-Mittel, Clipping Gesicht < 0,1 %, Mund/Stirn ≥ 0,85, warm |
| L-8 | Budget | V-329-Pool, p95 ≥ 30 fps Zielgerät, ≤ 300 Draw Calls |
Beweis: 3 Stimmungen × (Totale, Nah FB, Nah Karte) × 16:9 + 9:16, mit Clay, **ohne Overlays** (V-383); erster Durchgang mit fester Belichtung.

---
# Part B · Light direction as staging (V-387, Georg 17.10.) — after L3 PASS
Once the rig is clean (part A), light becomes part of the staging, the way it is in cartoons. The **character light (rule 11)** can be set per moment and per story mode, not just made brighter or darker. Light cues belong to choreography, like dance and mouth.

## B1 · Character light per story mode (direction + colour, not only colour)
| Story mode | Character light | Effect |
|---|---|---|
| Comic | flat, bright, frontal, warm | cheerful, readable |
| Heroic | warm key at 3/4 from slightly below, strong silhouette, back light warm | larger than life |
| Tragic | cool top light, eyes slightly in shadow (mouth still readable) | heavy, lonely |
| Absurd | hard coloured spot from the side, ochre/gold accent | crooked, comic |
| Mystical | violet from below or the side, soft halo of the room (not of the figure) | strange, magical |
| Forbidden | **light from below**, wine red, low face light | spooky, uncanny |
The V-292 colours tint the light. Measurement L-9 (mouth readable, nothing blown out) applies in every mode.

## B2 · Performance light in front of the billboard
- **"Spot on":** when a figure steps up, a spotlight appears in the cartoon way: it pops in with an elastic scale on the cone and a visible soft light cone (additive mesh, no fog volume). It switches on **ahead of time**, half a beat before the entrance.
- **Follow spot** on the lead during their passage. It gets brighter and narrower when the voice gets louder or stands out (from the stem level in `kfb.performance/1`).
- **Disco ball as the climax:** when a deck song is unlocked or the finale is reached, a disco ball appears with light dots wandering over the stage and figures, and the colours change on the beat. Donor candidates: the Resident dance scene, and the birthday start screen (branch `alignment/a0-travel-race-2026-09-17`, `kfb-hub/index.html`); WS1/WSB locate the exact file.
- **Budget:** at most one real spot plus the character light; disco dots as a projected texture or decals, not real lights.

## B3 · Light cues in the data
`kfb.performance/1` gets a `lights[]` track: `{t, type: spot_on|spot_off|follow|disco_on|disco_off|mode, target, storyMode, intensity}`, snapped to beats, with spot_on lead time of −½ beat. The camera has base positions (wide, medium, close) and the light presets are tuned so they work from those positions.
