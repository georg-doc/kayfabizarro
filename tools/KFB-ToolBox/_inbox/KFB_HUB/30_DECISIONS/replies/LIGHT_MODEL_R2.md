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
**Eine Szene, ein Licht-Rig, ein Ton-Pfad, eine Material-Antwort.** Stimmungen sind Einstellungen dieses Rigs. Keine Figur, keine Karte, kein Boden hat ein privates Licht.

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
| L-8 | Budget | V-329-Pool, p95 ≥ 30 fps Zielgerät, ≤ 300 Draw Calls |
Beweis: 3 Stimmungen × (Totale, Nah FB, Nah Karte) × 16:9 + 9:16, mit Clay, **ohne Overlays** (V-383); erster Durchgang mit fester Belichtung.
