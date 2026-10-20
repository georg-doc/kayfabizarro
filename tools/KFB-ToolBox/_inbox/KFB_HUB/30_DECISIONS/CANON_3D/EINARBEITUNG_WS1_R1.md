# Einarbeitung WS1-Recherchen in den 3D-Kanon · R1 · 2026-10-20 · Vorlage für WS0

**Status: VERBINDLICH als Kanon-Anhang A (V-570, WS0 20.10.).** Jede Zeile Ü1–Ü30, Abschnitt 2 (Gate-Werte), 4 (Georgs Feedback) und 6 (Nicht übernehmen) gilt.

**WS0-Abweichungen:**
- **Abschnitt 4 Nr. 14 („Banden“) gilt NICHT.** Es gilt V-569: #439 ohne Banden- und Rampen-Geometrie. „Banden“ im Kanon meint nur die bestehenden J17-Streckenbanden (V-102); neue Geometrie gibt es nur nach Georgs Bild.
- **Abschnitt 5:** `value_plan`, `surface_plan`, `stamps`, `foreground_mass`, `edge_accents`, `color_key` und `interaction_points` sind Pflicht ab der nächsten Runde der Konzeptblätter (R2); in R1 empfohlen.
- **W12:** Kiesel `stone_S` dürfen bis 35° kippen; Anker und Stützen bleiben bei ≤ 12° (Grammatik R2 §4.4 eingeschränkt).
**Quellen** (`S/WS1_…`):
- R1 Inszenierung, R2 Etherington-Abgleich, R3 Set-Dressing, R4 Farbtheorie;
- R10 Cartoon-Hintergründe, R11 3D-Farbe/Licht, FG Flächengrammatik;
- **GF** = Georgs Look-Feedback 20.10., bindend.

**Zeichen:**
- [S] Startwert, kalibriert an der Musterregion (V-568).
- [I] Invariante, Verstoß = FAIL.
- TUNE = Befund ohne FAIL.

**Werkzeug:** R1, R4, R10 und R11 schlagen jeweils eigene Bild-Gates vor. Daraus wird **ein** Modul `lib/kfb_view.py`:
- Es misst auf den Renders von Spielkamera und Kritiker-Kameras, mit ID-, Tiefen- und Normalenpuffer, Schatten- und Linienmaske.
- Datenprüfungen bleiben in `kfb_env`.
- Jede [S]-Grenze ist TUNE, bis sie an 10 PASS- und 10 FAIL-Bildern geeicht ist (V-411).

## 1 · Übernehmen

| # | Geb. | Kanon-Wortlaut (Vorschlag) | Quelle | Prüfung |
|---|---|---|---|---|
| Ü1 | 2 präzisiert | Felsgruppe: eine gemeinsame Lehnrichtung (±15° [S]) mit genau 1 Ausnahme (25–45°). Ein eiförmiger Stein liegt auf dem breiten Ende, größter Querschnitt in den unteren 40 % [S]. | R2 N1/N2 | Gate G3 (Export `lean_az`); Mesh-Profil `kfb_env_bpy` |
| Ü2 | 2 | ≥ 20 % der `stone_S` stehen schräg (> 15°) oder hochkant [S]. ≤ 1 Schlüsselstein je Steingruppe. | R2 N6 | Gate G4; K4 |
| Ü3 | 2 | ≤ 3 Primärformen je Gruppe (Primärform = ≥ 10 % der Silhouette). Keine zwei Elemente innerhalb ±10 % Höhe [S]. Jede Gruppe hat eine eigene kleine Staffel aus Vorder-, Mittel- und Hinterteil. | R2 N5/N12, R10-12 | Gate G5/G8; K3 |
| Ü4 | 2 | Hangbäume lehnen sich mit 20–40 % des Winkels zur Hangnormale [S], Nachbarstämme sind ≥ 20 % verschieden dick. Knet-Bäume zeigen 3–5 Hauptwurzeln, die einem Fels folgen. Kit-Bäume werden nur gedreht. | R2 N7/N8 | Gate G6; K4 |
| Ü5 | 2 präzisiert (Kranz) | Gras zeichnet die Form am Fuß nach. Es deckt ≤ 50 % des Fußumfangs, die längste Lücke ist ≥ 25 % [S]. Büschel sind nach Wind oder Hang gerichtet. | R2 N9 | Gate G7 (Skizze) |
| Ü6 | 2/12 | **Freiraum um den Fokus:** Im Ring 0,5 × r(Landmarke) steht ≤ 1 Objekt der Klasse M oder größer. Interaktionspunkte haben 1 H frei. Die freien Teilflächen sind ungleich, die größte ≥ 2 × die zweitgrößte. Im Bildring 0,25 × Fokus-Diagonale bleibt jedes Element unter 50 % des Fokuskontrasts [S]. | R2 N10, R1-14, R3-12 | Gate H12 (Skizze); View |
| Ü7 | 2 | Eine Tangente ist nur erlaubt, wenn `focal.tangent` sie benennt; höchstens 1 je Szene. | R2 R4 | Ausnahme im Tangententest |
| Ü8 | 2/5 | **Streckenrand:** Elemente neigen 5–20° mit Ursache. Gleichartige passieren höchstens 6 × pro Sekunde [S], die Wiederholperiode ist ≥ 3 Bildbreiten. ≥ 60 % des Detail-Budgets liegen dort, wo die Kamera unter 50 % ihrer Höchstgeschwindigkeit fährt. | R10-15/29/30 | Strecken-Export; Spieltempo-Pass |
| Ü9 | 3 | **Story-Stamp:** Kette aus 2–4 Ereignissen, jedes Requisit gehört zu genau einem Glied. 3–7 Requisiten, keine Füller. 1 Schlüsselrequisit. Ein Glied fehlt sichtbar, der Akt selbst wird nicht gezeigt. Dazu `premise_ref` und ≥ 1 `requires`, höchstens 1 × je Insel, gleiche Mikro-Stamps ≥ 2 MC auseinander. Nichts, was die Welt nicht kann. | R3-02…07, -16…18 | Gate S6/S7; K9 |
| Ü10 | 3 präzisiert (Signatur) | **Gesetz der Drei:** Die Kernaussage steht in ≥ 3 Trägern **verschiedener** Typen: Requisit, Bodenspur, Bauzustand, Bewuchs, Figur, Praktikal. | R3-06 | S5 + `carrier_type` |
| Ü11 | 3 | **Funktionsgruppe:** 1 Anker + 2–4 Werkzeuge oder Behälter + 1–3 Spuren, ≥ 70 % aus einer Materialfamilie [S]. Gerichtete Requisiten zeigen zu Arbeitspunkt, Weg oder Aussicht, nie in Wand oder Hang. | R3-10/11 | Gate S8 |
| Ü12 | 3 präzisiert | **Verfall folgt der Physik:** ≥ 70 % des Bewuchses liegen auf der Schatten- bzw. Wetterseite oder in Fugen [S]. Wasserschaden nur bis 0,3 H oder unter Tropfkanten. Je Pflanzengruppe ≥ 1 Element „Vergehen“. Spurenkette mit ≥ 3 Gliedern, fallenden Abständen, das letzte ≤ 2 H vor dem Ziel. Das Signatur-Requisit eines Residents kehrt in ≥ 2 Szenen wieder. | R3-13…15, R2 N13 | S4 erweitert; K1 |
| Ü13 | 3/K1 | Ort und Funktion sind in ≤ 15 s lesbar. ≥ 4 von 6 Story-Fragen sind sichtbar beantwortet. Stamps mit Spielbezug sind eindeutig (3/3 Läufe). Das Schlüsselrequisit ist ≥ 20 px@1080 groß, ΔL\* ≥ 15 [S]. | R3-01/08/09/21 | K1; View |
| Ü14 | 5 präzisiert | **Felsen** (GF §2): Formationen verjüngen sich nach oben, Basis ≥ 1,2 × Spitze [S]. Schichten wechseln Dicke (≥ 30 %) und Winkel (3–10°). Aufbau: Grundkörper + 2–4 Lappen, die sich 30–60 % überlappen, Rundung nach Form-DNA. Nur die Landmarken-Mesa darf kopflastig sein: Cap ≥ 1,2 × schmalste Stelle, Hals ≤ 0,6 × Cap [S], höchstens 1 Wackelstein je 3 Mesas, nie über der Fahrbahn. | R2 N3/N4, R10-10/14 | Mesh-Profil; K7 |
| Ü15 | 5/17 präzisiert | **Wertordnung nach Neigung:** Himmel > waagrecht > geneigt > senkrecht, ≥ 6 L\* je Stufe [S]. Die Wand trägt dasselbe Farbfeld wie die Fläche, nur dunkler, ohne harten Wechsel (GF §1). | R1-07 | View (Normalen) |
| Ü16 | 6 | Die 3 Töne einer Rolle liegen ≥ 10 L\* auseinander. **Gamut-Maske** = konvexe OKLab-Hülle der Zonenrollen; ≥ 95 % der bunten Pixel liegen in Hülle + 10 % [S]. Das ist Palettentreue, keine Sperre. Mittelgrau (C < 0,02, 0,45 < L < 0,65) ≤ 5 % des Bildes, ausgenommen die Fahrbahn. | R10-17, R4-08/13 | M3 Daten + View; schließt Lücke Gebiet 6 |
| Ü17 | 6 | Gemessen wird an Daten **und** Render. Weicht eine Rolle um > 5 L\* oder > 0,03 C ab, ist das ein Tonweg-Befund. Je Route ein Colour-Script-Streifen. Je Kamera bzw. Zone ein Farbkey im Engine-Render, abgenommen **vor** dem Asset-Pass. | R4-09/15, R10-18/32 | View; K0; K2 |
| Ü18 | 7 präzisiert (V-564) | Jede Rolle hat ein **Quartett**: Licht, `castShadowTint`, `contactDepthTint`, `edgeAccentTint`. Abgeleitet aus dem Empfänger: ΔL\* bei Figur −12…−18, Terrain −18…−24, Fels −22…−28 [S]; \|Δh\| ≤ 20° zur Schattenrolle; C 0,8–1,15 × (nie unter 0,3 ×). Gleiches Licht-L\* ergibt gleichen Schattensprung (±5). | R11-01…03/25 | Daten T1 (fehlende Rolle = FAIL), T7 |
| Ü19 | 7 präzisiert | Schatten: Tag L\* ≥ 15, Nacht L-6. Überlappung über `max` (±3 L\*). [I] kein Schatten mit C < 0,02 bei L\* < 20. ≤ 2 Töne je Material + 1 Kontaktstufe. Terminator ≤ 2 px, Wurfkante ≤ 3 px@1080 [S]. Keine Schatteninseln < 0,5 %. Gesichter mit geglätteten Normalen. | R4-11, R11-05/11/15…17 | View; Proof G6 |
| Ü20 | 7 | [I] Jeder Akteur wirft in Tag, Gold und Nacht einen echten Schatten; im Szenengraph kein Kapsel-, Decal- oder Blob-Objekt. Praktikals in 2–3 Ringstufen. Bounce nur im Schattenton (Hemi-Boden = `edgePalette`). Für alle Klassen eine Toon-Antwort. | R11-13/19/24/29 | Szenengraph; K6 |
| Ü21 | 5 (3) präzisiert | **Kantenakzent (Color Hold).** Nur an vier Kantenarten: Silhouette gegen die Ferne, Überdeckung, Schattenseite, echter Bruch (Dieder ≥ 40° [S]). Nie an Farbgrenzen, Fugen oder im Hintergrund. Auf der Lichtseite ≤ 20 % der Akzentlänge. Insgesamt ≤ 25 % der Kandidatenkanten und ≤ 1,5 % der Pixel. Farbe: dunklere Schwester der Fläche, \|Δh\| ≤ 15°, ΔL\* 20–35, C 0,6–1,0 ×, L\* ≥ 15 [S]. Breite 1–3 px@1080, schwankend, spitz auslaufend, Lücken auf der Lichtseite. Ab 3 × Fokusabstand ausgeblendet. Flackern ≤ ±20 %. Umsetzung als `kfb-clay`-Rolle, kein Inverted Hull. Knet-Figuren ohne Umriss. | R10-05…08, R11-06…10/21 | View; [I] schwarzer oder grauer Akzent |
| Ü22 | 8 | **Ein Fingerspur-Maßstab:** Die Textur-Wellenlänge aller Profile bleibt innerhalb von Faktor 2 zu H [I]; Hauptkorn 0,01–0,03 H [S]. Alle Profile tragen denselben Signatur-Layer, auch VFX. | R10-35/36 | Profil-Daten |
| Ü23 | 8 | **Material-Mix nur als Knet-Profile:** ≤ 4 Profile mit je ≥ 3 % Fläche, das dominante ≥ 50 % [S]. 3–5 Textursignaturen. Kritiker-Checkliste: Detailstufe, Maßstab, Lichtantwort, Grund; Prüffrage „auf dem Basteltisch knetbar?“ | R10-24/33/34/37/39 | Material-ID; K6 |
| Ü24 | 8/17 | **Textur ändert den Wert nicht:** Marken liegen ΔL\* ≤ 8 vom Grund, heller und dunkler gemischt, Deckung 15–45 %. Der Grundton bleibt auf ≥ 50 % sichtbar, im 3-Werte-Bild liegen ≥ 85 % in einem Cluster. Marken ≥ 2 px. Detail sitzt im Terminator-Band. Ruhige Fläche neben aktiver (≥ 2 ×). | R10-25…28, R11-18 | View |
| Ü25 | 12 (füllt Lücke) | Je Kamera 1 Fokus und ≤ 2 Akzente. Kompositionstyp aus einer Liste; die Spielkamera nutzt „Mittelgrund-Fokus“. Fokusfläche 4–15 % (Übersicht) bzw. 2–10 % (Spiel) [S]. Fokus in der Safe-Zone (3,5 %), nie unter dem HUD. Drittel und Leitlinien bewertet nur der Kritiker. | R1-01…04/10/11 | View; K3 |
| Ü26 | 12/16 präzisiert | **Wertmassen:** 3 Gruppen, Zentren ≥ 15 L\* auseinander, eine > 50 %, keine < 8 %. Fokus-Kontrast ≥ 1,5 × Median (ein Gate für R1 und R4). Fokus-Umriss zu ≥ 30 % mit ΔL\* ≥ 20 [S]. | R1-05/06/12, R4-01/02/04 | View |
| Ü27 | 12/16 präzisiert | **Tiefe:** Vordergrund ≤ 15 % der Fläche, an ≤ 2 Rändern, verdeckt ≤ 10 % des Fokus. Hintergrund ≤ 60 % Kontrast und ≤ 50 % Kanten des Mittelgrunds. Nachbarebenen ≥ 10 L\* auseinander oder anders in Form bzw. Textur. Himmel L\* 70–90, Spanne ≤ 15, ≤ 2 Wolken, Anteil 10–35 %. Nur über Rollen, Detail und echten Schatten. | R1-08/09/15/24, R4-03, R10-13/22 | View |
| Ü28 | 12 | Landmarke aus ≥ 3 von 4 Kameras sichtbar und einzigartig (Masken-IoU < 0,6). Spielflächen sind am ruhigsten (Kanten ≤ 0,5 × Ring). [I] keine DOF, kein Tilt-Shift, keine Vignette, kein Screen-Gradient. Kritiker-Kamera 1 auf 35° statt 45°. | R1-13/16/17, R10-16 | View; CRITIC |
| Ü29 | 15 präzisiert | **Terrain reagiert:** Die Streudichte im Ring 0,5–1,5 H nimmt in Stufen und mit Ursache ab, nie als Kranz. Vor Türen bleiben ≥ 0,3 H frei. Kantendichte der Szene 0,7–1,5 × Terrain [S]. Bauen in der Reihenfolge Sockel → Einsinken → Übergang → Streuung → Story. | R1-20…22 | View; Ringdichte |
| Ü30 | 16 präzisiert | Je fester Kamera ≥ 1 Lebensanker mit Zyklus ≥ 2 s. K2-Haltung nach Mary Blair: Kühne Farbe ist erlaubt, wenn der Wert trägt. Neue Fragen K2a–f (R4). | R10-31, R4-14 | Export; K2 |

**Gate-Skizzen (`kfb_env.gate`):**
```python
# G7 Graskranz (N9): Winkellücken der Grasbüschel um den Fuß
a = sorted(math.degrees(math.atan2(q['c'][1]-o['c'][1], q['c'][0]-o['c'][0])) % 360
           for q in objs if 'grass' in (q.get('kind'), q.get('what')) and _d2(q['c'], o['c']) <= 1.3*o['r'])
if a and max(b-x for x, b in zip(a, a[1:]+[a[0]+360])) < 90: find.append(f"G7 {o['id']}: Graskranz")
# H12 Freiraum um den Fokus
M = 0.35*max(o.get('h', 0) for o in env)
if sum(1 for o in env if o is not lm and o.get('h', 0) >= M and _d2(o['c'], lm['c']) <= 1.5*lm['r']) > 1: F('H12', 'Freiraum um Fokus')
# S6 Stamp
for s in scene.get('stamps', []):
    p = s.get('props', [])
    if not (2 <= len(s.get('chain', [])) <= 4 and 3 <= len(p) <= 7 and sum(bool(x.get('key')) for x in p) == 1
            and all(x.get('chain_step') for x in p) and s.get('requires') and s.get('premise_ref')): F('S6', s.get('stamp_id'))
```

## 2 · Gate-Werte

**R2-Grundbefund:** Etherington nennt keine Prozente. Belegt sind nur:
- Abstand 2 : 1;
- 3 Größen;
- ≤ 3 Primärformen;
- 5 Tiefenstufen;
- 8 Landmarken-Typen.

Alle `SINK`/`RULES`-Prozente sind deshalb KFB-Startwerte und werden so etikettiert. „Ungerade Gruppen“ ist ein allgemeines Prinzip, keine Etherington-Regel.

| Schlüssel | alt → neu | Grund |
|---|---|---|
| `SINK['stone_L']` | 0,45–0,60 → **0,40–0,50** | Georg stimmt zu (GF §2). Über 0,50 kehrt sich der umgekehrte Eisberg um. |
| `SINK['rock']` | 0,25–0,45 → **0,40–0,50** | GF: „Findling 40–50 %“; `rock` ist laut R2 der Findling. |
| `SINK_CAP` neu | **0,50** [I] für `rock`, `rockgroup`, `stone_*` | Kappe ≤ 50 % (GF). |
| `RULES['size_tol']` | 0,10 → **0,20** [S] | Eine halbe Größenstufe; 10 % sieht aus der Spielkamera gleich aus. Gleichzeitig in `grammar.js` ändern. |
| `RULES['spread']` | FAIL bleibt bei 0,30; neu TUNE `spread_tune` 0,45, Ziel `spread_target` 0,50 | 2 : 1 ist die einzige belegte Zahl. `nest()`-Test: Mittel über 50 Seeds ≥ 0,45. |
| neue Schlüssel | `lean_tol` 15, `lean_exc` (25, 45), `pebble_tilt` (15°, 0,20), `grass_gap` 0,25, `primary_max` 3, `height_tol` 0,10, `focal_ring` 0,5, `interact_free_H` 1,0, `tree_lean` (0,2, 0,4) | Ü1–Ü7 |
| unverändert | übrige `RULES`, `NEST`, übrige `SINK` | kein Widerspruch in der Quelle |

**Abgelöst:** Grammatik R1 §4 („5–15 % für alles“, dunkler Ring am Fuß).
**Landmarke:** „höchstes Element“ bleibt Default. Die 8 Typen (`landmark_type`) kommen nur nach Georgs Entscheid.

## 3 · Widersprüche (Georg und Register gelten)

| # | Konflikt | Empfehlung |
|---|---|---|
| W1 | Rim-/Gegenlicht, Figuren-Rim, Lichtvektor je Figur (R11-26/28/30) ↔ V-392, V-564 | Nicht übernehmen. Stattdessen Silhouette-Rescue, Wertabstand und dunkler Color-Hold-Akzent. |
| W2 | Blau/Grün-Sperre (R10-37), harte Sättigungsgrenze (R4-05), ≤ 3 Farbfamilien (R4-07, R10-19), Laub in „bucht“ dämpfen ↔ V-565 (einzige Grenze Chroma ≤ 0,195), J17 Gold (V-174) | Nur als Kritikerfrage bzw. TUNE, nie FAIL. Lila Gras bleibt erlaubt, „bucht“ bleibt. |
| W3 | Kühle Schatten (R4-11), Gooch warm/kalt ↔ V-564 Empfänger-Tönung | Nur „nie schwarz“ übernehmen. |
| W4 | Erfundene bzw. gemalte Schatten und Licht, Kapsel- und Decal-Schatten (R10-04, R11-04/13/27) ↔ V-564 echte Schatten | Nicht übernehmen. Erfunden werden darf nur die Ursache. |
| W5 | Vordergrund-Tonmasse in der Albedo (FG-9, R10-01) ↔ M2, V-564 (Höhe nie Farbe) | Palettenrolle `foregroundValue`: weltfest, nur feste Kameras, höhenunabhängig, in der Albedo-Ansicht erklärt. Ein Schatten darauf dunkelt höchstens 8 L\* nach, Ergebnis L\* ≥ 15. M2 bekommt diese Ausnahme ausdrücklich. |
| W6 | Mesa, Stamps, Komposition, Akzente, Palette ↔ RA 1:1 (K8) | Bei RA-Quellen nur über Terrain, Knet-Oberfläche und Kamera; das Original bleibt 1:1. |
| W7 | Dunkler Fußkontakt (GF, R11-11) ↔ contactAO „ohne dunkle Ringe“ (LIGHT_MODEL_R2, V-011) | Georg gilt: schmale, harte Stufe, kein weicher Ring. |
| W8 | Nachts L\* ≥ 15 (R4-11, R11-11) ↔ L-6 (L ≥ 8) | Register gilt: am Tag 15, nachts L-6. |
| W9 | Tiefennebel und X-Toon-Rampe (R4-03, R11-20/22) ↔ ein Tonweg (V-385); V-444 nur am Horizont | Nebel nur am Horizont in der `sky`-Farbe. Die Rampe nur nach A/B vor Georg. |
| W10 | Kanon 5 (2) „Domain-Warping-Feld“, 17 (3) und V-568 „Zungen“ ↔ GF §1 | Kanon korrigieren (4.1). |
| W11 | Spielbrett mit `edge3.jpg` (GF §4) ↔ Kanon 15 (3) fremde Textur | Als markiertes A/B-Experiment erlaubt, erst wenn die Übergänge sauber sind. Kein Kanon ohne Georg. |
| W12 | Kiesel bis 35° (R2 N6) ↔ Grammatik R2 §4.4 ≤ 12° | WS0-Spec, kein Georg-Wort: §4.4 per V-Nummer auf Anker und Stützen beschränken. |
| W13 | `contactAO` als Schwellenversatz (R11-12) ↔ Clay-Golden | Nur mit Nachweis der Gleichwertigkeit (WS1). |

## 4 · Georgs Feedback als Kanonregeln

1. **Gebiete 17 (3) und 5 (2), korrigiert:**
   - Farbflächen sind geschlossene, gerundete Blobs. Sie verschmelzen per smooth-min, mit Größenhierarchie und Verschachtelung.
   - **Nie** Schwellwert-Rauschen (fbm + Warp) als Flächengenerator.
   - Keine langgezogenen Zungen, keine dünnen Hälse, kein Mäander; Seitenverhältnis ≤ 1,25 [S].
   - Danach nur schwache Konturverzerrung (≈ 6 m Hauptkontur, ≈ 1,5 m Rand) [S].
   - „Zungen“ wird gestrichen.
   - *Prüfung:* Laufzeit-Test auf Seitenverhältnis und Halsbreite; Kritiker.
2. **Gebiete 4/17 [I]:** keine Schnittkanten, keine Vektorpfad-Bugs. Gegeninseln schrumpfen weich aus dem Übergangsband, nie abgeschnitten. *Prüfung:* V-403-Test.
3. **Gebiet 17 bestätigt:** Übergänge fließen cartoonig ineinander. Dots und Sprenkel variieren natürlich und liegen in Nestern.
4. **Gebiet 5:** Wand = Feld des Plateaus, nur dunkler, ohne harten Wechsel an der Kante (Ü15).
5. **Gebiet 5:** keine zackigen Berge. Es gelten die Etherington-Steinregeln (Ü1, Ü14); Felsen sind Knet-Blöcke mit weichen Kanten.
6. **Gebiet 2:** Steine tiefer, Findling 40–50 %, Kappe 50 % (Abschnitt 2).
7. **Gebiet 4:** Kontakt-Brocken (V-565) bestätigt, C1 bleibt.
8. **Gebiete 7 + 4, Erdung/Kontakt:**
   - Jedes Requisit und jedes Diorama trägt unten einen **dunklen, nicht schwarzen** Kontaktton, ebenso Übergänge wie Baumkronen-Unterseiten.
   - `contactDepthTint` liegt 8–12 L\* unter dem Wurfschatten, harte Stufe, ≤ 0,15 × Aufstandsradius [S].
   - *Prüfung:* Die dunkelsten 5 % des Fußrings liegen in dieser Zone; K4.
9. **Gebiet 7:** Echte 3D-Schatten sind Pflicht (60 fps gemessen). Der p95-Nachweis gegen V-370 bleibt.
10. **Gebiete 5 (4) und 16 (4), Vordergrund-Tonmasse wie bei Road Runner:**
    - Dunklere, ruhige Fläche unten, kein Gradient.
    - Höhe 6–12 %, Breite ≥ 60 %, ΔL\* 15–25 unter dem Mittelgrund, L\* ≥ 15 [S].
    - Oberkante gebrochen (kein gerades Stück > 25 %, 1–3 Silhouetten ragen hinein).
    - Ohne Akzent und Fokus, mit Ursache.
    - Nur feste Kameras; nicht in der Verfolger- und nicht in der freien Übersicht.
    - *Prüfung:* View + Kritikerfrage „Standfläche oder Vignette?“
11. **Gebiet 5 (3):** Farbige Outlines nur an bestimmten Kanten (Ü21). Standardmäßig aus, bis Color Hold steht; die Gratkanten erzeugten Keile.
12. **Gebiet 7, präzisiert:** je Biom **4** Flächenfarben (bisher „3–4“), dazu `shadow`, `deepShadow` (nur bei Überlagerung oder engem Kontakt) und `edgeAccent`; ≤ 2 Stufen, keine Multiply-Kaskade.
13. **Backlog:** Die Stil-Recherche (R10/R11) ist eingearbeitet, das Spielbrett steht unter W11.
14. **Gebiet 5, Begriff:**
    - „Banden“ heißt nur J17-Streckenbanden (`src/m2/k2t.js`, #ef5a22, V-102).
    - Georgs „Höhen-/Farbbänder“ heißen im Kanon Farbbänder.
    - Herkunft „Banden und Rampen“ in #439: Gespräch „Funktionsvergleich Roadster KFB“ vom 19.10. Basis ist der Bestand in combo/r2 (`BRIEF_WS1_TERRAIN_439_R1`).
    - WS0 bestätigt das WS1. Neue Geometrie entsteht nur nach Georgs Bild.
15. **Pflege:** `WS1_*` fehlt in `S/MANIFEST.tsv` (0 Einträge). WS0 trägt es nach.

## 5 · Konzeptblatt

| Feld | Änderung |
|---|---|
| `cameras` | je Kamera `composition_type`, Fokus-Zielgröße, Lebensanker (Ü25, Ü30) |
| `value_plan` (neu) | dominante Wertgruppe, Staffel normal oder umgekehrt, Tiefenband-Schwellen (Ü26/27) |
| `foreground_mass` (neu) | je feste Kamera: ja/nein, Ursache; Verfolgerkamera immer nein (GF 10) |
| `surface_plan` (neu) | Makroflächen mit Ursache, Blob-Formen, Übergangsbreite w (Gebiet 17 (1), GF 1) |
| `palette_roles` | Quartett je Rolle, L\*-Index, Rolle `foregroundValue`, 4 Flächenfarben (Ü16/18, GF 12) |
| `edge_accents` (neu) | Kantenarten und Objekte (Ü21) |
| `color_key` (neu) | Farbkey-Render je Kamera bzw. Zone vor dem Asset-Pass; Colour-Script-Streifen (Ü17) |
| `stamps` (neu) | `stamp_id, premise_ref, questions, chain, key_prop, props, carriers, requires, gameplay, facing` (Ü9–Ü11) |
| `interaction_points` (neu) | id, Position, Objekt (Ü6) |
| `focal` | optional `tangent`; `landmark_type` erst nach Georgs Entscheid |
| `material_codes` | Profil je Code, ≤ 4 Profile (Ü23) |

Erweiterung: `CONCEPT_FIELDS += ('value_plan', 'surface_plan', 'cameras')`. Pflicht für diorama, resident, scenelet und island; `stamps` ist Pflicht, sobald Requisitengruppen vorkommen.

## 6 · Nicht übernehmen

| Punkt | Grund |
|---|---|
| Rim, Gegenlicht, Figuren-Lichtvektor (R11-26/28/30) | V-392, eine Sonne |
| Farbsperren, harte Sättigungs- bzw. Familiengrenzen (R10-37, R4-05/07, R10-19) | V-565 |
| Kühle Schatten, Gooch (R4-11, R11-02) | V-564 |
| Gemalte bzw. erfundene Schatten und Licht, Kapsel-, Decal- und Blob-Schatten, Decal-Lichter (R10-04, R11-04/13/19/27) | V-564, Kanon 15 (3) |
| Schwarze HB-Linien, Inverted Hull, Kontaktlinie (R10-07/08, R11-14) | Kanon 4/6/8 |
| Versatz Linie/Fläche (R10-09) | wirkt in 3D als Fehler; nur die Unregelmäßigkeit bleibt |
| Spitze Noble-Zacken (R10-10) | Form-DNA, GF §2 |
| Tilt-Shift, Sättigungs-Pass, Farbversatz statt DOF (R1-17, R11-23) | Kanon 6/7, Erdung verdeckt, fremde Marke |
| Kulissen je Kamera (R1-18) | QA §00; nur die Ferne darf Kulisse sein |
| Curved-World-Shader (R1-24) | Inselunterseite, K2; nur der Himmelsanteil bleibt |
| Vordergrund ≥ 60 % in der Spielkamera (R1-02) | Die Figur muss frei bleiben |
| Dual-Grid-Übergangskacheln (R1-19) | erkennbares Konstruktionsmuster (V-403); erst nach dem Speckle-Modul |
| Bodenflickenteppich aus 3–5 Belägen (R2 N14) | Gebiet 17 (2)/(8), Georgs „kein Tarnfleck“ |
| HHA-Füllboni, Müll-Abzug (R3-10/11) | belohnen Fülle; Verfall gehört zur Biografie |
| Wasser-Fließrichtung, Spiegelung (R2 N11); Spuren bleiben liegen (R3-19) | erst mit Wasser-Shader bzw. Kostenmessung |
| Getöntes Neutral als Trennband als Gate (R10-20) | verdeckte Farbregel; nur Kritikerfrage |
| Figuren-Umriss (R11 F3), Terminator-Farbband (F6) | Standard nein; nur nach Georg bzw. A/B |
