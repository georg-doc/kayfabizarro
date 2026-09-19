# Backlog · KFB Plant Prop Lab

Stand 2026-09-19. Ungeschönt: jede Zeile ist entweder **gemessen**, als **Vermutung**
gekennzeichnet oder als **Entscheidung** markiert, die jemand treffen muss.

Prioritäten: **P0** blockiert eine Freigabe · **P1** vor dem nächsten Konsumenten
· **P2** Komfort/Reichweite · **P3** Idee mit Beleg, ungeplant.

---

## P0 · blockiert Freigabe

### P0-1 · Rezepte zeigen auf `main`, nicht auf einen Commit
`revision: "main"` in jedem `PlantRecipe` und in jeder RAW-URL in `lib/kit-lab.js:10`.
Verschiebt jemand ein Pack, bricht ein altes Rezept **stillschweigend**. Behebung: ein
Commit-SHA in `SRC()` und in der RAW-Basis. **Entscheidung offen:** wer pflegt den SHA und
bei welchem Anlass wird er gehoben. Gleiche Stelle projektweit (`HOUSEKEEPING.md`,
Pfad-Hygiene).

### P0-2 · Kein Durchdringungs-Audit für Mischgruppen
Töpfe stehen auf einem Ring mit Rauschen (Radius 0,85–1,40, gemessen). Bei fünf grossen
Töpfen können Ränder einander schneiden. `relaxOverlaps()` ist **absichtlich** nicht
angewandt — eine Gruppe darf dicht stehen —, damit fehlt aber auch die Prüfung. Zu bauen:
Gate „Topfränder frei" mit einer Toleranz, die Berührung erlaubt und Durchdringung nicht.
Muster existiert: `auditFootprints()` mit `ignorePair` aus S11.

---

## P1 · vor dem nächsten Konsumenten

### P1-1 · Schmales Fenster in S18 nicht gemessen
Die Regel (< 1100 px → Leiste als Overlay) stammt aus `ref/ui-split-shell.html` und ist
**dort** gemessen. In S18 selbst: `NOT_TESTED`.

### P1-2 · Lichtkalibrierungen ohne Messung
Vier Stimmungen sind visuell beurteilt. S13.3 hat dafür die Luminanzprobe (Rec. 709) —
für eine Palette-Entscheidung, die World bindet, müsste dieselbe Messung her:
4 Stimmungen × Laubfamilien × Topfpaletten.

### P1-3 · `offset` ohne Anfasser
Das Rezept trägt `offset` je Behälter, die Oberfläche hat keinen Griff dafür. Wer eine Gruppe
genau stellen will, editiert JSON und lädt es zurück (der Rundlauf trägt das).

### P1-4 · Krone als Augensitz bleibt heikel
Blattwerk hat Löcher. Mit kleinem, vorgerücktem Wirt trägt es; bei offenen Pflanzen
(Pothos-Ranken, Kakteen) sitzen die Augen luftig. `pot` ist Standard, `float` der Rückweg.
Ein echter Blatt-Wirt bräuchte eine **gemessene Blattfläche** — nicht gebaut.

### P1-5 · L3–L5 des Lebensmodells fehlen
Gebaut sind `STATIC | AMBIENT | AWARE`. Alles darüber (Reaktion auf Ereignisse, Bewegung
durch die Welt, Interaktion untereinander) ist S19-Gegenstand und hat dort einen Vertrag.

---

## P2 · Reichweite · neue Inhalte

Georgs Wunschliste, gegen den gemessenen Bestand geprüft. **Was vorhanden ist, ist
vorhanden — was fehlt, fehlt und wird nicht erfunden.**

| Wunsch | Bestand | Aufwand |
|---|---|---|
| **Kakteen im Topf** | **da**: `cactus_A…D` (0,33–0,64 hoch) + Zwilling `cacti_plant_pot_large` (1,489 breit wie `pot_B_large`) | klein: Familie in die Grammatik, Einsetztiefe wie gehabt |
| **Sukkulenten** | **da**: `succulent_A…D` (0,22–0,34 hoch) | klein, gleicher Weg |
| **Bäume** | **da**: Quaternius `Tree_Blob/Floating/Lava/Light/Spikes_*` (2,08–5,88) · KayKit Forest `Tree_1…4`, `Tree_Bare_1…2` (3,5–10,8, 1 Einheit ≈ 1 m) | mittel: eigene **Maßstabsklasse**, ein 5,9-Baum ist keine Tischrequisite |
| **Fleischfressende Pflanzen** | **fehlt** in beiden aufgenommenen Packs | Quellsuche nötig (siehe unten) |
| **Mushrooms** | **fehlt**: Forest Pack hat 105 Teile = Bäume/Büsche/Gras/Felsen, keine Pilze | Quellsuche nötig |
| **Flowers** | **fehlt** in den aufgenommenen Packs | Quellsuche nötig |
| **Fruits** | **da, aber woanders**: Restaurant Bits `food_ingredient_tomato/carrot/potato/lettuce/cheese…` (144 Teile, vermessen) | klein bis mittel: Maßstab prüfen, Pack-Aufnahme existiert schon |
| **Hamburger-Bäume** | **Bauteile da**: `food_burger`, `food_ingredient_bun_top/bottom`, `…_burger_cooked`, `food_vegetableburger` | **Komposition**, kein Asset: Stamm aus Pflanzen-Spender + Frucht aus Restaurant Bits. Braucht Fruchtsitz-Grammatik (Ankerpunkte auf der Krone) |
| **Bonbon-Büsche** | **fehlt** — kein Süsswaren-Asset in den geprüften Packs | entweder Quellsuche oder Materialweg: bestehender Busch + Bonbonmuster aus dem Musterfeld |

**Quellsuche · konkrete Aufgabe (P2-Q):** Contents-API-Sonde wie
`tools/probe-plant-packs.html` gegen die noch nicht aufgenommenen Ordner in
`media/3D_Assets/` fahren, Kandidatennamen für `mushroom*`, `flower*`, `venus*`,
`carnivor*`, `candy*`, `lollipop*` per Ladeversuch prüfen. Ergebnis geht als Zeile nach
`docs/PACK_GAPS.md` — egal ob Fund oder Lücke. **Nicht** mit Ersatzgeometrie überspielen;
das ist die Projektregel seit S3b.

---

## P3 · belegte Ideen, ungeplant

- **Instancing** über Topf/Pflanze sollte tragen (ein Netz je Teil, ein Atlas je Pack) —
  *Vermutung, nicht ausprobiert.*
- **`THREE.Clock` ist in 0.184 veraltet.** Eine Warnung, kein Fehler. Umstellung auf
  `THREE.Timer` ist eine Zeile, betrifft aber `kit-lab.js` und damit 18 andere Seiten —
  bewusst nicht angefasst.
- **Alien-Spender mit negativem Fuss** (`Bush_1`: minY −0,389) könnte bei kleiner
  Einsetztiefe unter dem Topfboden hervorschauen. Im Bau nicht aufgefallen, **nicht geprüft**.
- **Getopfte Zwillinge** nutzen vermutlich die B-Topffamilie. Für die Einsetztiefe irrelevant,
  für einen Silhouetten-Vergleich wäre es zu messen.
- **Erstbeweis normiert die Schauhöhe** (3,2; Landmarke 6,6). Der Faktor steht in der Legende,
  das Bild zeigt trotzdem nicht die absoluten Grössen. Die Werkbank zeigt sie.

---

## Erledigt in S18.1 (2026-09-19) — nicht mehr offen

Erde im Topfinneren (Radius statt Höhe, 0,597 bei `pot_D_large`) · Stammachse zentriert
(90-%-Quantil statt Boxbreite; Fussebenen-Fehler `-crownY / s` → `-crownY − raw.min.y·s`) ·
Augenmass (`ring` 0,50, Augenradius 0,23, `inset` 0,10) · Cartoon-Raster gedeckelt
(`CELL_LIMITS` nu ≤ 14, nv ≤ 8) mit Kontur aus derselben Feldrechnung · Paletten 6 → 12 mit
benannter Harmonie und Rollen statt Indizes.
