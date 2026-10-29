# SPEC · Platzierungs-Grammatik R2 · Fluff und Übergangssteine · WSB · 2026-10-17

**Status: R2 draft (V-400) · WS0 decisions 18.10. (answer to WS1 §78):** contour rule between fluff balls on the same plant, relax ≤ 0.85× or ≥ 1.25× (never 0.92×); odd numbers for hanging balls per plant; bare trees carry no fluff; 1 KayKit unit = 0.616 m (M_PER_RIG); 6 spots per tree OK.

**Original status line:** R2 draft (V-400). Geschrieben von WSB, Code-Owner WS1 (`src/world/grammar.js`, `fluff.js`). Liegt in `50_BLENDER/SPEC/`, WS0 verschiebt ihn ins Register (`30_DECISIONS/replies/`).

**Grundlage:**
- **Fluff:** Konzept `50_BLENDER/B2/R2/CONCEPT_B2R2_FLUFF_GRAMMAR.md` und die Proof-Seite `B2/R2/proof/fluff_stage.html`, Muster „gewachsen“ (Georg 17.10.: „Verteilungsmuster jetzt auch gut“, „mehr Luft als Default“).
- **Steine:** neu für V-341/V-396.

Ersetzt nichts aus R1 (`LAB/docs/SPEC_PLACEMENT_GRAMMAR_R1.md`), sondern verlängert die Ebenen nach unten.

## 0 · Grundsatz
**Eine Grammatik, dieselben Operatoren auf allen Ebenen.** Fluff am Busch und Geröll an der Bühne sind derselbe Vorgang: Etwas entsteht an einer Quelle, gruppiert sich nach 1 : 3 : Rest und wandert abwärts. Es gibt keine zweite Regel für Steine.

**Zahlen-Regeln für alle Ebenen** (aus `ETHERINGTON_REGELN_IN_ZAHLEN_R1.md`):
- ungerade Mengen (3/5/7);
- nie zwei gleich große nebeneinander;
- die Abstände zu den Nachbarn unterscheiden sich um ≥ 30 %;
- höchstens 2 auf einer Geraden;
- Konturen entweder ≥ 15 % überlappt oder ≥ 25 % Luft, nie ein Fast-Berühren;
- Negativraum ≥ 30 %.

**Verboten:**
- Poisson- oder Gitter-Teppiche (QA §6);
- Reihen und Ketten (die Lichterketten-Optik);
- „Nachbar andersfarbig“ auf Kugel- oder Stein-Ebene;
- Objekte, die obenauf liegen statt einzusinken.

## 1 · Ebenen
| Ebene | Anker | Stützen | Rest | Quelle |
|---|---|---|---|---|
| Zone | 2–4 Gruppen | – | Negativraum ≥ 30 % | R1 |
| Gruppe (Pflanzen) | 1 Anker 1,2–1,4 | 2–3 Stützen 0,7–0,9 | 1 Akzent | Bauweise Regel 4 |
| Träger (eine Pflanze) | Fruchtstände je nach Größe: Baum 7, großer Busch 4, Busch 3, Kaktus 2 | – | 1–2 Fallobst | B2-R2 „gewachsen“ |
| Bühnenrand (neu) | Ringband 0 / 1 / 2 | Gruppen je Band | Kies | dieses Dokument §4 |
| Nest / Steingruppe | 1 groß | ~3 mittel | 1–5 klein | `nest()`: 1 : 3 : Rest, Größe 1 : 0,62 : 0,38 |

## 2 · Operatoren (Signaturen für WS1)
Alle sind deterministisch über `seed`; Zufall nur über `rng(seed)`.

- **`candidates(surface, n = 220)`:** Richtungen auf einer Fibonacci-Kugel (Schritt 2,39996 rad), per Raycast auf die Oberfläche projiziert.
  - Behalten werden Treffer mit `n·d ≥ 0,45` und Höhenanteil `hs ≥ 0,18` (Kaktus `≥ 0,55`).
- **`score(c)`:** Rangfolge der Kandidaten.
  - Formel: `rng·0,6 + max(0, n·sun)·0,5 + n·cam·0,3`, mit `cam = normalize(0,25, 0, 1)` (Lese- bzw. Kameraseite).
- **`stands(cands, G, minDist)`:**
  1. Bei allem außer kleinen Büschen zuerst einen Stand an der Spitze setzen (`hs > 0,86`), Georg: „auch oben Früchte“.
  2. Danach nach Score auffüllen bis `G` Stände, Mindestabstand `minDist = 0,62 × Kronenradius` (Kaktus 0,4).
- **`ripeness(c)`:** `clamp(0,22 + 0,62·(1 − hs) + 0,32·sun ± 0,09, 0,12, 1)`.
  - Unten und auf der Sonnenseite reif, oben jung.
  - Bei Reife < 0,5 wird der dunkle Ton der Sorte genommen (V-292 dunkel).
- **`stand(c, rip)`:** 1 / 2 / 3 Früchte bei Reife ≤ 0,36 / ≤ 0,62 / darüber.
  - **Größen:** `R0·(0,42 + 0,62·rip)·[1; 0,74; 0,56]`.
  - **Abstand der Folgefrüchte:** `(r_prev + r)·(1,15 … 1,5)`, nur manchmal berühren (Georg: mehr Luft).
  - **Seitlich versetzt** um ±0,7 rad zur Hängerichtung.
  - **Reife Früchte hängen tiefer:** `−0,14·r·rip` in y.
- **`embed(ball)`:** Mittelpunkt `0,45 r` vor der Oberfläche (`EMB`); gut die Hälfte steckt im Laub, „wie Äpfel“.
- **`nest(p, dir, count, scale)`:** 1 groß, 3 mittlere bei ±1,2 / 0,1 / 1,3 rad um die Hängerichtung, kleine außen.
  - **Abstand:** `(R + r)·0,86·spread`, mit `spread = 1,75` als Default „mehr Luft“.
- **`relax(items, k = 6)`:** schiebt Überlappungen auseinander, bis `d ≥ 0,92·(r_a + r_b)`.
  - Gilt für Kugeln, für Steine mit dem Hüllradius.
- **`fall(src, n)` / `rollToRest`:**
  - **Fallobst:** Der reifste Stand wirft 1–2 Früchte ab (Baum 2). Sie landen hangabwärts mit `0,25 + 0,3·i` Kronenradius Versatz.
  - **Steine:** Kleine Steine einer Gruppe wandern hangabwärts (§4).

## 3 · Farbe
- Ein Nest ist einfarbig. Eine Pflanze hat eine Leitfarbe und höchstens einen Akzent: beim Baum die Stände 1 und 4, sonst der letzte Stand.
- Die Zone mischt über die Pflanzen: Hauptsorte ~40 %, jede andere ≥ 8 % (V-368).
- **Comic-Oliv:** auf Nicht-Grün-Trägern; auf Grün nur die hellere V-292-Stufe (V-400). Kein Kontrastlicht.
- **Steine:** Farbe aus der `edgePalette` der Bühne, nie aus der Zonenfarbe allein (§4.5).

## 4 · Übergangssteine am Bühnenrand (neu, V-341 / V-396)
**Story:** Die Bühne ist das älteste Stück des Ortes. Steine und Erde aus ihrem Sockel sind über die Zeit abgebröckelt und nach außen gerollt. Deshalb gilt:
- nahe an der Bühne liegen sie groß und tief, außen klein und selten;
- an der Hangseite liegen mehr als an der Bergseite.

### 4.1 Quelle und Ringbänder
- **Quelle:** das `footprint`-Polygon aus `kfb.stage-edges/1`.
- **Bodenhöhe:** Das Gelände trifft die Bühne auf `groundY_u`, z. B. B7 0,0238 u = 0,10 m, gemessen.
- **Ausgespart:** Eingänge, Treppenfüße und Wege (V-396: „Schürze ohne Überbrücken von Eingängen“). Freiraum je Eingang ≥ 1,2 m breit, ≥ 2 m tief.
- **Drei Bänder** mit Abstand `s` zum Polygon (Schürze 4 m / 3 Ringe):

| Band | Abstand s | Gruppen je 10 m Rand | Größenklassen | Einsinken |
|---|---|---|---|---|
| 0 | −0,1–0,7 m (bis 0,15 m in die Hülle, weil die Hülle breiter ist als der echte Sockel) | 2,0 | L (Anker), M, S | L 45–60 %, M 35–50 % |
| 1 | 0,9–3 m | 0,9 | M (Anker), S | 35–50 % |
| 2 | 3–6 m | 0,3 | S, Kies | 30–40 % |

### 4.2 Wo die Gruppen sitzen
- **Thomas-/Matérn-Prozess** statt Poisson: Gruppenkeime entlang des Randes.
- **Benachbarte Keime:** Abstand zum vorigen um ≥ 30 % variiert.
- **Je Band ungerade Zahl** an Gruppen.
- **Gewichtung:**
  - ×1,6 an Ecken bzw. Vorsprüngen (Kanten bröckeln zuerst);
  - ×1,4 auf der Hangseite (Gefälle des Höhenfelds);
  - ×0,5 hinter der Bühne, aus der Kamerasicht.
- **Lücken:** ≥ 30 % der Randlänge bleiben frei. Längste Lücke ≥ 15 % des Umfangs, damit kein Kranz entsteht.

### 4.3 Eine Gruppe = `nest()`
- **Pool (Steinkit v3, Georg 17.10.):** Grundformen aus KayKit Forest FREE und Quaternius (Ultimate Nature, MegaKit FREE), alle CC0, in Knete übertragen. Dazu die eigenen Ruinen-Passstücke (Mauer, Trommel, Platte, Keil, Kiesel-Nest).
  - Gezogen wird nach `weight` aus `kfb.stone-kit/1`: runde Findlinge 1,0, Kiesel-Nester 0,8–1,0, flache Platten 0,6, Pflaster-Reste 0,4, Ruinen-Passstücke 0,3–0,5, KayKit-Blöcke 0,2, Steinstapel 0,05 (nur Band-0-Anker).
  - Ergebnis: ≈ 85 % Grundformen, ≈ 15 % Passstücke. Die Passstücke geben die Ruinen-Geschichte, die Findlinge die Natürlichkeit.
- **Aufbau:** 1 Anker, ~3 Stützen, 1–5 Kiesel. Größen 1 : 0,62 : 0,38 der Ankergröße.
- **Ankergröße:**
  - Band 0: 0,5–0,9 m;
  - Band 1: 0,25–0,45 m;
  - Band 2: 0,10–0,20 m.
- **Lage:** Die Stützen lehnen am Anker; Konturen ≥ 15 % überlappt, also ineinander gesunken, oder ≥ 25 % Luft.
- **Kiesel:**
  - wandern hangabwärts, Versatz `(0,3 … 0,8) × Ankergröße` in Fallrichtung;
  - liegen an der Hangseite häufiger.
- **Nie** zwei gleich große nebeneinander, **nie** drei auf einer Geraden.

### 4.4 Sitz im Boden
- **Einsinktiefe:** Einsinken = Anteil der Steinhöhe unter `terrainY(x, z)`, Bereich je Stein aus dem Kit (`sinkMin/Max`).
  - Größere Steine sinken tiefer ein.
  - Jeder Stein berührt den Boden, keiner balanciert.
- **Ausrichtung:**
  - `upAxis` des Steins = Mittel aus Geländenormale und Welt-oben (50/50);
  - zusätzliche Neigung ≤ 12°, Drehung um oben zufällig.
- **Flache Platten:** liegen hangparallel. Mauerbrocken stehen mit der Bruchkante zur Bühne.
- **Tropfkante:** Unter dem Anker in Band 0 wird der Boden 10 % dunkler, Radius 1,3 × Ankergröße (Bauweise-Erdung).

### 4.5 Farbe
- **Grundfarbe:** Die Kit-Albedo ist hell-neutral, die Tönung kommt zur Laufzeit.
  - Der größte Anteil der `edgePalette` ist schon der Boden (V-396). Die Steine nehmen deshalb **die übrigen Anteile**, sonst verschwinden sie im Boden.
  - Anker = hellster der übrigen Anteile;
  - Stützen = Anker oder zweithellster;
  - Kiesel = dunkelster.
  - Beispiel B7: Anker `#c09b72`, Stützen `#977943`, Kiesel `#72601e`.
  - Jitter ±4 % L, Farbton unverändert.
- **Übergang ins Gelände als Sprenkel, nicht als Verlauf (V-403):** Kein Stein wird stufenlos zur Bodenfarbe gemischt.
  - Jeder Stein wählt **diskret** zwischen Sockel-Tönen und dem Stein-Ton der Bodenrolle (`ENV_ROLES.stone` der Zonenpalette).
  - Wahrscheinlichkeit für den Boden-Stein: Band 0 ≈ 10 %, Band 1 ≈ 35 %, Band 2 ≈ 65 %.
  - Damit wandern einzelne Sockelsteine weit hinaus und einzelne Geländesteine bis an die Bühne, in beide Richtungen.
  - Die Proof-Skizze mischt noch stufenlos; das wird bei WS1 durch diese Regel ersetzt.
- **Kein Konfetti:** eine Gruppe ist ein Farbton, höchstens zwei.

### 4.6 Was nicht passieren darf
- eiförmige oder kugelige Steine (das Kit liefert keine);
- Reihen;
- gleichmäßiger Kranz um die Bühne;
- Steine auf Wegen oder in Eingängen;
- Steine, die in die Bühne hineinstechen (Abstand ≥ 0 zum Footprint, Band 0 darf bis 0,1 m überlappen, wenn sie dort einsinken);
- Steine, die schweben: Unterkante über dem Gelände.

## 5 · Abnahme (WS1 im Spiel, gleiche Kamera-Marken)
1. **Messungen:** pro Bühne
   - Anteil freier Randlänge ≥ 30 %;
   - keine drei Steine auf einer Geraden (Toleranz 5 % der Gruppengröße);
   - Größenabfall von Band 0 zu Band 2 ≥ Faktor 3;
   - 0 schwebende Steine (Unterkante − Gelände ≤ 0);
   - 0 Steine in Eingangs-Freiräumen.
2. **Sichtprüfung:** Vorher/nachher im Spiel, Georg-Frage „wächst die Bühne aus dem Boden?“.
3. **Fluff:** die Messwerte aus dem B2-R2-Proof als Referenz. Mehr Luft als die erste Fassung, Spitzen-Stand vorhanden, Fallobst hangabwärts.

## 6 · Offene Punkte
- **Startwerte aus der Proof-Skizze** (`50_BLENDER/STEINKIT/proof/stonekit.html`, B7, 23 m Umfang): 9 Gruppen, 62 Steine; die Vordertreppe bleibt frei. Bilder: `STEINKIT/renders/`.
- **Bodenfarbe nach V-396 (an WS0/WS1):** Bei B7 ist der größte Rand-Anteil Moos (`#5a610d`, die Pflanzen auf dem Sockel). Als Boden wird das unter ACES ein grelles Limettengrün (`STEINKIT/renders/Steinkit_4_Boden_nach_V396_moosgruen.png`). Vorschlag: Für den Boden gesättigte Grüntöne (Pflanzen) überspringen bzw. die Sättigung begrenzen und den nächsten Erd-Anteil nehmen. Mit Erdboden wirkt dieselbe Szene ruhig (`Steinkit_2_…Erdboden.png`).
- **Eingänge:** Freiräume müssen pro Bühne als Daten kommen (Vorschlag: `entrances[]` im Bühnen-Deskriptor mit Mitte, Richtung, Halbbreite). Die Skizze hat die B7-Treppe fest eingetragen.
- **Startwerte bestätigen:** Gruppen je 10 m und Bandbreiten sind Startwerte. Georg oder WS1 tunen sie im Spiel (God-Mode-Schieber: `density`, `spread`, `sinkBias`).
- **Footprint-Methode:** Die Hüllen-Näherung (WSB) und WS0s Methode (Bodenplatten-Schnitt) unterscheiden sich. Für Steine zählt die Grenze, an der die Bühne den Boden trifft.
- **Etherington-Originale:** noch nicht gegengelesen (siehe Konzept, offene Frage 4).


## 7 · Nachtrag 29.10.2026 (Georg, V-1005): eine Verteilungslogik für alle Kleinteile
Für Materialcodes, Fundstücke, Fluff-Nester, Fluff-Kugeln und Blumen gilt dieselbe Logik: Gruppen nach der **Dreier-Regel**, platziert mit `kfb-place` bzw. WFC, harmonisch über die Fläche verteilt. Nie wahllos geworfene Haufen, nie ein Teppich.
- **Gruppe = zwei bis drei verwandte Elemente.** Verwandt heißt je nach Art:
  - Materialcodes: Größe (ein größeres, ein bis zwei kleinere; `SPEC_GUTTER_CURB_R1.md` §8).
  - Fundstücke: Familie (Süßes und Backwaren zusammen: Donut, Windbeutel, Kirschkuchen; Geschirr zusammen: Teekanne, Teller). Kein Hamburger neben dem Donut. Kein Überhang einer Sorte (nicht mehrere Brote in einer Gruppe), höchstens ein Element je Sorte pro Gruppe.
  - Blumen: Farbe und Sorte (z. B. zwei weiße neben einer gelben). Mehrere Gruppen ergeben einen Beet-Charakter. Die Blütenfarben folgen den Farbrollen des Bioms bzw. Themas.
- **Abstand innerhalb der Gruppe:** Fundstücke liegen nicht aufeinander, sondern mit Sammelabstand nebeneinander bzw. leicht gestaffelt entlang einer Laufrichtung. So kann man sie nacheinander aufnehmen und es entsteht eine kleine Spur.
- **Verteilung zwischen Gruppen:**
  - Abstand und Dichte nach den Etherington-Zahlen.
  - Fundstücke, Fluff-Nester und Blumen weichen einander aus bzw. ergänzen sich, z. B. Fundstück-Spur zum Fluff-Nest, Blumen am Wegrand.
  - Je Spielerblick sind mindestens drei verschiedene Codes zu sehen, keine Art dominiert.
- **Quellen:**
  - Fundstücke: WSB B28 Loot (`media/3D_Assets/WSB_BLENDER/public_r1/B28/`) bzw. Prop-Pool.
  - Blumen: Quaternius Nature-Packs aus dem Prop-Pool (V-920, im Asset Librarian vollständig aufgenommen).
  - Kügelchen: Kugel-Kern.
  - Im Spiel betroffen: `src/world/loot.js`, `src/modules/foundItems3d.js`, die Fluff-Nester in `src/world/placeVeg.js`.
- **Bäume** bleiben bei ihren bestehenden Regeln (Massen und Formationen). Blumen folgen der gleichen Grundidee in klein.
- **Prüfung:** Eine Zählprüfung je Kamera-Marke stellt fest: Gruppengröße 2–3, keine Sorte doppelt je Fundstück-Gruppe, kein Fremd-Element in einer Familie, Mindestabstand eingehalten, mindestens drei Codes im Blick.
