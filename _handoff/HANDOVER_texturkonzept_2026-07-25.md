# HANDOVER — KFB Texturkonzept / Voxel-Material (Stand 2026-07-25, Sessionende)

Für Coworker + nächsten Design-Chat. Kurz genug zum Vorlesen, konkret genug zum Weiterbauen.

---

## 1 Wo wir stehen

**Slice 0 (App-Asset-Index) und Slice 1 (Texturen anwenden) sind abgenommen.**
Aktuelle Arbeit: das **Material-/Texturkonzept** für die Voxel-Box-Sprache — noch nicht fertig,
aber die Richtung steht und ist mehrfach belegt.

| Datei | Rolle |
|---|---|
| `KFB Material Bench.dc.html` | **Arbeitsgerät.** Fünf Material-Blöcke nebeneinander (Papier · Karton · Filz · Ton · Stein), Regler für Stochastik / Kacheln pro Einheit / Struktur-Stärke / Fuge / Tint. Hier wird Material für Material abgenommen |
| `KFB Voxel Zone S2.dc.html` | **Entscheidungs-Seite.** Eine Zone, links Bestands-Rezept (Travel v9), rechts prozedural, verschiebbare Naht, Tusche-Kontur über allem |
| `kfb-box-material.js` | Das Material-System (Shader). Eigenständig, ohne Abhängigkeit zur Bank → **rückspielbar nach Travel v10+** |
| `kfb-ink-outline.js` | Screen-Space-Tusche (Sobel über Tiefe + Normalen). Ebenfalls eigenständig |
| `asset-repo.json` · `kfb-textures.json` · `constructs.json` · `asset-index.js` | Slice-0-Fundament: 986 platzierbare Kenney-Assets, Texturen, Konstrukt-Format, Runtime-API |

## 2 Was gelernt ist (die teuren Erkenntnisse)

1. **In der Box-Sprache variiert man Werte, nicht Orientierungen.** UV-Rotation/Offset pro Instanz auf einer Foto-Textur = gekippte, verschobene Muster. Bei der **Bevel-Maske** ist Rotation dagegen richtig, weil eine Vignette rotationsinvariant ist.
2. **Muster gehören an die Welt, nicht an die Fläche.** Pro-Face-Mapping macht aus jedem Würfel eine eigene Briefmarke. Triplanar in Weltkoordinaten.
3. **Variation muss gekoppelt sein.** Zufall pro Würfel liest als Glitch; der Zufall muss aus einem niederfrequenten Ortsfeld kommen (Nachbarn im selben Fleck).
4. **Gegen Kachel-Wiederholung gibt es ein Standardverfahren:** stochastisches Sampling (Quilez; Heitz/Deliot, Unity Labs 2019) — pro virtueller Kachel zufälliger Versatz, überblendet. Ist eingebaut, Regler `Stochastik`.
5. **Das, was durchgehend funktioniert, ist edge3** — als Kanten-Fassung UND jetzt als **Bevel-Maske** (dunkel auslaufende Ränder runden die harte 90°-Kante optisch ab).
6. **Der Kitt zwischen Asset-Welten ist die Kontur, nicht die Textur.** Ein Screen-Space-Tusche-Pass umrandet Voxel, Kenney-GLB, Pet und Karte mit demselben Stift — ohne ein Asset anzufassen.
7. **Was fehlt, ist Licht, nicht Textur:** Kontakt-AO in den Fugen, Rim-Light, Höhen-Nebel, Glühen auf Kuppen.

## 3 Offene Befunde aus dem letzten Review (Georg, an der Bank)

- **Stein/Bricks** zu kleinteilig und noch repetitiv.
- **Filz** praktisch unsichtbar, weil zu hell.
- **Karton + Papier** haben fleckige Wiederholung.
- **Ein globaler Regler für alle fünf Materialien ist der Konstruktionsfehler** — Stein braucht andere Kachelgröße als Papier.
- Panel zu groß; gewünscht ist ein **kompaktes quadratisches Viewport-Layout** mit zwei Optionen zum Vergleich statt einer 6er-Palette.
- **Behoben in dieser Session:** Oberseiten wirkten durchsichtig / Textur drehte nicht mit → der Seed der Bevel-Rotation kam aus der Fragment-Weltposition (änderte sich mitten auf der Fläche). Jetzt Seed pro **Instanz + Flächen-Achse**. Noch visuell gegenzuprüfen.

## 4 Nächste Schritte (Reihenfolge)

1. **Presets pro Materialfamilie** statt globaler Regler: Kacheln/Einheit, Bevel-Stärke, Eigenwert je Material.
2. **Papier + Karton mit mehreren Varianten** aus dem Ordner mischen, über großflächiges Perlin geblendet (`Paper001/004/006`, `Cardboard001/003/004`, `CardboardSet001`, `Chipboard007`).
3. **Kompaktes Panel** (quadratischer Viewport, zwei Optionen nebeneinander).
4. **Top-to-Bottom-Gradient pro Block** + **Bevel/AO** (Kanten heller, Fugen dunkler) — der größte Plastizitäts-Sprung pro Zeile Code.
5. **Großflächiges Welt-Noise** auf die Instanz-Tönung (sanfte Verläufe über ganze Hügelketten).
6. **Rückspielung:** `kfb-box-material.js` + `kfb-ink-outline.js` als Modul-Paket nach Travel v10+.

## 5 Für die Textur-Suche (was hilft, was nicht)

**Gebraucht werden nur zwei Sorten:**
- **Bevel-/Kanten-Kacheln** im Stil von `edge3.jpg` — Graustufen, dunkel auslaufende Ränder, kein erkennbares Motiv. Davon gern 3–5 Varianten (weich, rau, ausgefranst, gebrochen).
- **Stochastische Flächenstrukturen**: Papier, Karton, Filz, Ton, Putz — **ohne** erkennbares Objektmuster (keine Ziegel, keine Planken, keine Fliesen), gleichmäßig „rauschig", damit stochastisches Sampling greift. 1K reicht, JPG reicht, Diffuse reicht.

**Nicht gebraucht:** Normal-/Bump-/Displacement-Maps (bei diesem Look unsichtbar bis schädlich),
alles mit geometrischem Motiv in Fotoauflösung, alles über 1K.

**Faustregel für die Auswahl:** Wenn man die Textur auf Armlänge betrachtet und ein *Objekt* erkennt
(einen Ziegel, ein Brett, eine Fliese), ist sie falsch. Wenn man nur *Material* sieht, ist sie richtig.

## 6 Kanon / Regeln, die bleiben

- WebGL, three 0.160, ein Renderer. Assets nur über RAW-URL, keine Datei > 2 MB im Export.
- Farbe kommt **immer** aus den sechs D6-Story-Modi (`world-context.js`) — Texturen liefern Struktur, nie Farbe.
- Kein Löschen/Verschieben ohne Georgs Freigabe. Session-Export nach `skills/session-export_v1.md`.

## 7 Weiterführende Doku im Projekt

`docs/TEXTUR_KONZEPT_voxel.md` (Denkmodell + alle sechs Iterationen mit Begründung) ·
`docs/ART_DIRECTION_konsolidiert.md` (was aus den externen Papieren übernommen ist, Übernahme-Reihenfolge v10+) ·
`docs/SPRINT_3D-AssetRepo.md` (Slices, Datenverträge, Runtime-Learnings) ·
`HOUSEKEEPING.md` (Status je Artefakt) · `docs/COWORKER_catalog-fixes.md` (Katalog-Probleme + Fixes).
