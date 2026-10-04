# BAUKASTEN — Tiny Swords in HTML/Canvas (living document, v1.2)

Stand: 2026-08-14 · Gilt für `Nexus Village v3.dc.html` · Quelle der Wahrheit für Regeln:
Pixel-Frog-Tilemap-Guide (itch.io Devlog 1138989) + die Packs im Repo `georg-doc/kayfabizarro`
unter `media/2D_Assets/Tiny Swords (Update 010 | Free Pack | Enemy Pack)`.
Katalog zum Nachschlagen: `media/3D_Assets/CATALOG/2d-catalog.json` (noch nicht gegen den ATLAS abgeglichen — siehe Housekeeping).

## 0.-1 Slice-Blätter: erst die Bau-Logik (Lehre aus v3.8)
Ein Slice-Blatt ist eine **Konstruktionsvorschrift**, keine Textur. Reihenfolge, immer:
1. Zellgröße messen (TS: 64). 2. Daraus die **Mindestgröße** ableiten (9-Slice: 2 Ecken + 1 Kachel
je Achse). 3. Blatt nach Element wählen: **`*_3Slides`** für einzeilige Knöpfe/Reiter/Bänder,
**`*_9Slides`** nur für Flächen ab 2×2 Zellen. 4. Die **Box an das Blatt** anpassen (Knopfhöhe =
eine Zeile), nie das Blatt an die Box. 5. Maßstab nur ganzzahlig.
**Nachtrag v3.9:** Vor dem ersten Codezeichen das Blatt **messen** (Breite/Höhe, Alpha-Profil je
Spalte) — nicht die Zellgröße raten. Und: passt ein Element in Originalgröße, ist das ganze Blatt
**1:1** die richtige Lösung, nicht Slicing (`Ribbon_Red_3Slides` = 192×64 → Header mit fester
Breite, Text zentriert im Band x≈40..152).
Wer nur die Ecken nimmt und die Mitte dehnt, bekommt entweder skalierte Ecken (CSS `border-image`)
oder Beschnitt — beides ist falsch. Für kompakte HUDs ohne passendes Blatt gilt: **eigene UI-Sprache**
statt halber TS-Optik (so gelöst in v3.8).

## 0.-1 Weltrand
Die Insel braucht **mindestens 4 Wasserkacheln** zu jeder Weltkante — Wasser ist Ebene 0 und muss
sichtbar bleiben. Praktisch: Welt größer rechnen als die Insel (hier +4 Kacheln je Seite), Inhalt
verschieben, Ellipse mit ≥4,5 Kacheln Inset. Wer die Ellipse nur "fast" bis zum Rand zieht, bekommt
abgeschnittene Küsten ohne Foam.

## 0.0 HUD-Doktrin (ab v3.4)
Meta-Fläche kostet Dorf. Deshalb: **Statuszeile + zwei Knöpfe** sichtbar, alles andere hinter
`Log` und `Settings` (Progressive Disclosure). Gebäude-Meta erscheint **erst on Hover** (Schild in
der Welt) und **on Click** (Tafel) — nie dauerhaft. Ein Ort pro Sache: keine zwei Anzeigen für
denselben Inhalt (Weltschild **oder** Tooltip). Responsiv: obere/untere Leiste als Flex-Reihen mit
`flex-wrap`, Fenster als `min(px, calc(100vw − 20px))` mit `max-height` + eigenem Scroll.
Scrollbars und Regler werden **mitgestaltet** (Holzrinne, Messing-Griff, harte 2-px-Outline).
Sprache: **EN im Code**, DE später über eine Textmap (nicht im Markup verstreut).
**v3.8:** genau **drei** Fenster (Alarm · Konsole mit Reitern · Detail) plus Banner und
Steuer-Cluster; **Tab** minimiert auf Banner + Steuerung, **Escape** schließt. Flächen sind dunkles
Glas (`rgba(20,25,19,.88)`, 1-px-Kante `rgba(240,226,196,.16)`, Radius 6) — zurückhaltend, damit
das Dorf trägt. Keine Party-Leiste: Helden werden im Dorf angeklickt.

## 0.05 Kollision: nur der Sockel ist massiv
Gebäude sperren eine **flache Ellipse am Sockel** (`rx ≈ h·0.32`, `ry ≈ h·0.13`), nicht ihre
Silhouette. Ein grösserer Block sperrt die Fläche **hinter** dem Haus mit — dann läuft nie jemand
dahinter und die Tiefensortierung wird unsichtbar. Aufprall = Abprall: Rückstoss entlang der
Normalen, Hopser mit Quetschung, Staub, danach **Route neu rechnen** (nicht am Haus kleben).

## 0.1 Units zeigen Absicht
Ein Held ohne sichtbares Ziel wirkt zufällig. Deshalb: gestrichelte Linie entlang der restlichen
Wegpunkte in der Aktivitätsfarbe + Raute am Ziel; Label über dem Kopf; rastende Helden bilden Paare,
wenden sich zu und bekommen eine Sprechblase.

## 0 Zwei Welten, die nie vermischt werden
| | Welt | HUD |
|---|---|---|
| Wo | `<canvas>`, Weltkoordinaten, 64-px-Raster | DOM über dem Canvas, Screenkoordinaten |
| Was | Terrain, Bauten, Units, FX, Wolken | Tafeln, Buttons, Ribbons, Tooltips |
| Regel | alles per `drawImage` aus dem ATLAS | alles per `border-image` 9-/3-Slice |
| Sortierung | nach **Fuß-Y** | Flex-Fluss in Spalten, feste Anker nur außen |

## 1 Terrain — mentales Modell
Ebenen strikt in dieser Reihenfolge (Guide):
```
Layer 0  BG Color (Wasser)
Layer 1  Water Foam        (animiert)
Layer 2  Flat Ground
Layer 3  Shadow            ← gehört zur Elevated Ground, NICHT zur Flat-Insel
Layer 4  Elevated Ground
(3+4 wiederholen sich pro Höhenstufe)
```
**Ohne Elevation gibt es keine Shadow-Ebene.** Das war Bug #3 (siehe Changelog).

### 1.1 Flat Ground = 4×4-Blob-Autotile
`Tilemap_Flat.png` = 640×256 = 10×4 Kacheln à 64. Grasblock ab Spalte 0, Sandblock ab Spalte 5.
Innerhalb eines 4×4-Blocks gilt:

| | Spalte 0 | Spalte 1 | Spalte 2 | Spalte 3 |
|---|---|---|---|---|
| **Zeile 0** | oben-links | oben | oben-rechts | oben+unten offen, links/rechts zu |
| **Zeile 1** | links | **Füllung** | rechts | senkrechter Streifen |
| **Zeile 2** | unten-links | unten | unten-rechts | … |
| **Zeile 3** | waagerechter Streifen | … | … | Einzelkachel |

Merksatz: **Spalte 0 = links, 1 = Mitte, 2 = rechts, 3 = „einzeln"; Zeile 0 = oben, 1 = Mitte, 2 = unten, 3 = „einzeln".**
Code: `tileIdx(maske, c, r)` → `[spalte, zeile]` aus der 4-Nachbarschaft.
**Der Satz hat keine Innenecken** → Masken konvex halten (Ellipse, Rechteck, abgerundete Formen).

### 1.2 Water Foam = 192-px-Stempel, kein Autotile
Foam ist EIN Sprite über 3×3 Kacheln, das **mittig auf jede Land-Randkachel** gesetzt wird; die
Überlappungen bilden den durchgehenden Kranz. 8 Frames (`Foam.png` = 1536×192), ~7 fps.
Das war Bug #4: per-Kachel-Autotiling ergibt gerade Bänder und weiße Kästen.

### 1.3 Shadow (nur bei Elevation)
`Shadows.png` = 192×192, ebenfalls Stempel, aber **um genau eine 64er-Kachel nach unten versetzt**
unter dem Fußabdruck der erhöhten Fläche.

### 1.4 Wege
Sand ist eine zweite Maske über der Gras-Maske, mit demselben Autotiler. Wegpunkte **auf Kachelmitten
schnappen** (`Math.round((v-32)/64)*64+32`), sonst reißen die Korridore. Halbbreiten: Hauptweg 38 px,
Nebenweg 30 px, Platz als gestauchte Ellipse.

### 1.5 Requisiten
Bäume/Büsche/Steine nur, wenn **alle acht Nachbarkacheln Land** sind — sonst stehen sie im Wasser.
Wasser-Deko (Water Rocks 16 Frames, Quietscheente 3 Frames) nur auf Kacheln **ohne** Landnachbar.

## 2 Units
- Sheets im Update-010-Pack: 192-px-Frames, Zeilen = Animation. warrior 6×8, pawn 6×6, archer 8×7.
  Zeile 0 = Idle, Zeile 1 = Walk/Run (Archer hat keinen Walk → Idle-Variante Zeile 1 nutzen).
- Farb-Fallback: `black → purple`. Upstream-Tippfehler: `Archer_Purlple.png`.
- **Sprites bringen ihren Schatten mit** — nie einen zweiten malen (Bug #5).
- Darstellungshöhe ~140 px bei 64er-Kacheln; Namensschild **über** dem Kopf (`y - disp*1.16`), sonst
  liegt es auf dem Helm (Bug #6).
- Free Pack hat getrennte Sheets (`*_Idle.png`, `*_Run.png`) — feiner, wenn Animationen einzeln
  gesteuert werden sollen.

## 3 HUD — 9-Slice und 3-Slice richtig verwenden
Die Assets sind entweder 192×192 (9-Slice, 3×3 Kacheln à 64) oder 192×64 (3-Slice, 3 Kacheln à 64).

**9-Slice** (Carved_9Slides, Button_*_9Slides, Banner_*): frei skalierbar in beide Richtungen.
```css
border-style: solid; border-width: 13px;                /* Ecke 64 px wird auf 13 px gezeichnet */
border-image: url(...9Slides.png) 64 fill stretch;      /* fill = Mitte wird gezeichnet */
background-color: rgb(204,184,141);                     /* Assetfarbe, weil die Mitte optisch bricht */
background-clip: padding-box;
image-rendering: pixelated;
```
**3-Slice** (Ribbon_*_3Slides, Button_*_3Slides): streckt **nur horizontal**, die Höhe ist fix.
Regel: **seitliche `border-width` = Elementhöhe**, sonst werden die Kappen verzerrt.
```css
height: 38px; line-height: 38px; padding: 0 14px;
border-width: 0 38px; border-image: url(...Ribbon_Red_3Slides.png) 0 64 fill stretch;
```
Das war Bug #7: 3-Slice-Buttons mit `border-width: 0 18px` und 40 px Höhe → gequetschte Kappen.
Für Buttons deshalb **immer die 9Slides-Variante** nehmen.

### 3.0 Kanon (SSOT: `ui-slices.json` + `02_UI_BAUKASTEN_TS.md` im Onboarding-Paket)
Die UI-Blätter sind **Atlanten auf 64er-Raster**: **Ecken 1:1, Kanten und Mitte gekachelt**,
Maßstab nur ganzzahlig. `Banner_Slots`, `WoodTable_Slots`, `RegularPaper`, `SpecialPaper` sind
**9-Slice**; Bars sind 3-Slice mit Lücken (Fill wird **beschnitten**, nie skaliert); `Swords.png` ist
ein 3-Slice-Trennstrich mit fünf Farbzeilen; `Carved_Regular` und hängende Banner sind `fixed` —
Requisiten, keine Flächen.
**CSS `border-image` erfüllt das nicht** (Bug #16, geschlossen in v3.5): dort hängen die Ecken an
`border-width` und werden skaliert. Der kanonische Weg ist `ui-kit-ts.js` — **Canvas**, nicht CSS:

```js
// <helmet>: asset-source.js (mode 'raw') dann ui-kit-ts.js laden
await OW_UIKIT.load();                       // misst die Blätter selbst, 99 Teile
const cv = OW_UIKIT.paper9('carved9', w, h); // Ecken 1:1, Kanten + Mitte gekachelt
el.style.backgroundImage = 'url(' + cv.toDataURL() + ')';
el.style.backgroundSize  = w + 'px ' + h + 'px';   // 1:1, kein Nachskalieren
el.style.borderImageSource = 'none';               // CSS-Rahmen abschalten
```
So gebaut in `paintSlices()`: DOM trägt Text und Klickfläche, das Kit malt die Schnitzerei.
**Maßstab-Regel (aus v3.6):** die Blätter sind für eine 1920er Bühne gemalt. Auf einem ~900er HUD
zeichnet man in **doppelter** Boxgröße und zeigt **ganzzahlig halbiert** (`background-size` = halbe
Canvas-Maße, `image-rendering:pixelated`) — auf DPR 2 pixelgenau, und das HUD bleibt klein.
**Fallen, alle drei erlebt:** (1) `window.OW_UIKIT` kann durch eine zweite Skript-Auswertung ersetzt
werden — Ladung **bei jedem Anstrich** prüfen (`PARTS.carved9`), nie in einem Flag merken.
(2) CSS-Rahmen erst abschalten, **wenn das Canvas vorliegt**, sonst stehen nackte Tafeln.
(3) Unsichtbare Boxen überspringen (`offsetWidth<24`), sonst friert eine Fehlmessung als Mindestmaß
ein und die Fläche wächst über die halbe Karte. (4) **Das Blatt bestimmt die Mindestgröße:** `paper9`
rastet auf ganze 64er-Zellen — nach dem Zeichnen `min-height`/`min-width` auf die gemalten Maße
setzen, sonst schneidet `background-repeat:no-repeat` die untere Schnitzkante ab.
Regeln, die daraus folgen: Knöpfe mindestens **64 px hoch / 128 px breit** (sonst überlappen die
64er-Ecken), Ribbons laufen über `band3` auf **64 px** Höhe, neu malen bei `resize` und Zustandswechsel
(Größen-Cache verhindert Dauerarbeit). Schlüssel: `carved9`, `carvedFix`, `btnBlue9`, `btnRed9`,
`btnBlue9P`, `ribbonRed3`, `ribbonYel3`, `bannerFP`, `table9`, `paperReg`, `barSmall`, `swords`.

### 3.1 Notbehelf: halber Maßstab in CSS
Pixel-Art-Slices dürfen nur in ganzen Teilern der Quellkachel (64 px) gezeichnet werden, sonst
verschwindet die Outline und die Ribbon-Zipfel werden zu Klötzen:
- 9-Slice-Panels: `border-width: 32px` (½ von 64), kleine Rahmen `16px` (¼).
- 9-Slice-Buttons: `border-width: 16px`.
- 3-Slice-Ribbons: Elementhöhe **32 px** (= ½ von 64), `border-width: 0 32px`, `line-height: 32px`.
- Nie 13/18/38/42 px — das sind 0,20×/0,28×/0,59×/0,66× und damit krumme Maßstäbe.
Innenabstände danach neu setzen: der Rahmen frisst 32 px pro Seite.

**Rollen der UI-Assets**
| Asset | Rolle | Nicht dafür |
|---|---|---|
| `Carved_9Slides` | Panels/Tafeln jeder Größe | Buttons |
| `Carved_Regular` (64²) | kleine Rahmen, Avatar-Slots | große Flächen |
| `Banner_Horizontal/Vertical` | Schriftrolle mit Holzstange oben/unten — Kopfzeilen, Titel | Panels mit variabler Höhe (die Stange skaliert mit) |
| `Banner_Connection_*` | Rollen, die an eine andere Fläche anschließen | freistehend |
| `Ribbon_*_3Slides` | Kopfband/Tab, feste Höhe | Panelrahmen |
| `Button_*_9Slides` (+`_Pressed`) | Buttons, Toggles (Pressed = aktiv) | Panels |
| `Bars/SmallBar_Base+Fill` | Balken (Kritikalität, Fortschritt) | — |
| `Icons/Regular_*`, `Pointers/*` | Icons, Auswahlzeiger in der Welt | — |
| `Papers/RegularPaper`, `WoodTable` | Listen-/Inventarflächen | — |

**Assetfarben** (aus den PNGs gemessen, für `background-color`):
blau `rgb(140,195,196)` · rot `rgb(200,129,118)` · gelb `rgb(187,181,82)` · rotes Ribbon `rgb(190,110,97)` ·
Pergament `rgb(204,184,141)`.
**Textfarben auf Pergament:** Titel `#6b3f12`, Text `#4a3418`, sekundär `#836039`; auf blauen Buttons
`#16303c`, auf roten `#ffe9d8`. Schrift: **Shantell Sans**.

## 4 ATLAS — die eine Tabelle
```js
ATLAS = { key: { pack, path, frame:[w,h], role, frames, fps, blocks } }
// role: autotile4x4 | autotile3x3 | tile | strip | single
blit(g, key, frameIdx, x, y, h, anchor)   // x,y = Fußpunkt-Mitte
frameOf(key, t, loop)                     // laufender Index, loop:false klemmt am Ende
```
Neues Asset = **ein** ATLAS-Eintrag; der Loader zieht es automatisch. Das ist die Datenbasis für einen
späteren Editor (Palette = `Object.entries(ATLAS)`).

## 5 Particle FX
Alle FX im Free Pack sind **einreihige Strips**: `Fire_03` 12×64, `Dust_02` 10×64,
`Explosion_02` 10×192, `Water Splash` 9×192. Einmalig abspielen (`loop:false`), Lebensdauer =
`frames / fps`, in die Y-Sortierung einhängen. Eingesetzt: Schmiede raucht dauerhaft, Ufer spritzt,
Wachturm brennt bei offenem Alarm, „Verwehren" zündet eine Explosion.

## 6 Tageszeit & Wetter
`SKY`-Keyframes (Stunde → Tint-RGB, Alpha, Glut) werden interpoliert; `tod` läuft 0–24 h,
`clockSpeed` = Stunden pro Sekunde. Wolken sind Einzelbilder (Free Pack, `Clouds_0X`), driften mit
5–18 px/s und wrappen. Regen/Nebel fehlen noch (Backlog).

## 7 HowTo — die häufigsten Aufgaben
1. **Neues Asset**: ATLAS-Eintrag ergänzen → `blit()` verwenden. Pfade mit Leerzeichen `%20`.
2. **Neues Gebäude**: `BUILDINGS`-Eintrag (`id, act, label, sub, img, x, y, h, door`) + Wegpunkt
   auf Kachelmitte + Kante ins `EDGES`-Array. Tür ist der Ziel-Wegpunkt.
3. **Neue Insel/Karte**: Maske in `buildWorld()` ersetzen (konvex halten), Wegpunkte snappen, fertig.
4. **Neue Aktivität**: `ACT`-Eintrag + Gebäude mit `act` + Pool-Einträge. Der Event-Vertrag bleibt.
5. **Neues Panel**: 9-Slice-Regel aus §3 kopieren, in eine der bestehenden Spalten legen
   (links unter dem Banner / rechts in die Flex-Spalte / unten), **nie** einen zweiten absoluten Anker
   auf dieselbe Position (Bug #8).
6. **Neue Datenquelle**: Adapter in `emit()` — eine Form: `{agentId, agentName, activity, criticality, category, ts}`.

## 8 Fallen (kurz)
- `this.props` in einer DCLogic-Klasse **niemals** überschreiben (React-Props) — Bug #1.
- `replaceText` schlägt bei falschem Anker **stumm** fehl: nach jedem Patch prüfen (Bug #2).
- Screenshot nach einer Dateiänderung erst **nach** `show_html` — sonst sieht man den alten Stand.
- Der Host kann Prop-Defaults persistieren: Ansichtszustand (Zoom, Kamera) nicht als Prop führen.


## UI-Icons — Free Pack (gemessen 2026-08-14)
Pfad: `georg-doc/kayfabizarro@main` →
`media/2D_Assets/Tiny Swords (Free Pack)/UI Elements/UI Elements/Icons/Icon_01..12.png`.
**Alle zwölf Blätter sind 64×64**, einzelne Bilder (kein Strip). Einsatzgröße 32 px = halbe
Kantenlänge (integerer Downscale); 38-px-Knopf trägt das gut. Kein Upscale, kein `filter:invert`
nötig — die Icons sind farbig mit dunkler Outline und stehen auf dunklem Grund.

| Blatt | Motiv | Rolle im HUD |
|---|---|---|
| Icon_01 | Hammer auf Holz | Bau/Forge (frei) |
| Icon_02 | Holzstamm | Ressource Holz |
| Icon_03 | Goldmünze | Ressource Gold |
| Icon_04 | Fleisch | Ressource Nahrung |
| Icon_05 | Schwert | Kampf (frei) |
| Icon_06 | Schild | Schutz (frei) |
| Icon_07 | Pfeil grün | **Show UI** |
| Icon_08 | Pfeil orange | frei (Alternative Show/Zurück) |
| Icon_09 | X rot | **Hide UI** |
| Icon_10 | Zahnrad | **Settings** |
| Icon_11 | Info im Ring | **Log/Chronik** |
| Icon_12 | Notenpaar | Jukebox |

Kein Auge und kein Fokus-Motiv im Pack. `Centre` bleibt daher gezeichnet, aber in der Ink-Sprache:
dunkle Outline (6.4 px) unter der Cream-Linie (3.2 px), Punkt in der Mitte.


## Blätter für Ressourcen, Träger und Free-Pack-Units (gemessen 2026-08-14)
Repo `georg-doc/kayfabizarro@main`, Basis `media/2D_Assets/Tiny Swords (Free Pack)/`.

| Blatt | Datei | Maß | Frames |
|---|---|---|---|
| Holz (Last/Vorrat) | `Terrain/Resources/Wood/Wood Resource/Wood Resource.png` | 64×64 | 1 |
| Gold (Last/Vorrat) | `Terrain/Resources/Gold/Gold Resource/Gold_Resource.png` | 128×128 | 1 |
| Fleisch | `Terrain/Resources/Meat/Meat Resource/Meat Resource.png` | 64×64 | 1 |
| Goldadern | `Terrain/Resources/Gold/Gold Stones/Gold Stone 1..6.png` | 128×128 | 1 |
| Schaf ruhend | `Terrain/Resources/Meat/Sheep/Sheep_Idle.png` | 768×128 | 6 |
| Schaf laufend | `Terrain/Resources/Meat/Sheep/Sheep_Move.png` | 512×128 | 4 |
| Pawn leer | `Units/<Farbe> Units/Pawn/Pawn_Run.png` | 1152×192 | 6 |
| Pawn mit Last | `Pawn_Run Wood|Gold|Meat.png` | 1152×192 | 6 |
| Lancer laufend | `Units/<Farbe> Units/Lancer/Lancer_Run.png` | 1920×320 | 6 |
| Lancer ruhend | `Lancer_Idle.png` | 3840×320 | 12 |
| Monk laufend | `Units/<Farbe> Units/Monk/Run.png` | 768×192 | 4 |
| Monk ruhend | `Idle.png` | 1152×192 | 6 |
| Depot (Stand) | `Buildings/Blue Buildings/House3.png` | 128×192 | 1 |

**Falle:** das **rote** Lancer-Blatt fehlt im Pack (nur drei Attack/Defence-Dateien) — Kombination
überspringen, nicht ersetzen.
**Zwei Blatt-Modelle:** Update 010 = **ein** Sheet mit Zeilen/Spalten (`cols/rows/run[]`),
Free Pack = **getrennte** Run-/Idle-Strips (`strip:true, F, runN, idleN`). Beides muss der
Zeichner kennen, sonst laufen Free-Pack-Units als Standbild.

## Gebäudeblätter (BuildingsCustom, gemessen)
Library 210×420 · Castle 400×270 · Forge 307×460 · Arena 320×429 · Tower 195×390 · Tavern 233×350.
Gezeichnet wird von `y − 0.55h` bis `y + 0.45h` — daraus folgen Claim, Fussabdruck und Schild.

## 1:1 ist eine Layout-Regel
Default: jedes Blatt in Originalgröße (`SCALE = 1`), Zoom-Default 1, Zoomstufen
`[.5, .75, 1, 1.5, 2, 3]`. Wer die Blätter auf ihre echte Größe stellt, muss den **Grundriss**
strecken (`LAYOUT_K`), nicht die Sprites schrumpfen: sonst schneiden sich die Claims, Türen liegen
unter Nachbardächern und die Tiefensortierung wird unlesbar. Reihenfolge: Blätter messen →
`computeClaims()` → Konsole prüfen → Grundriss strecken.


## Elevation, Shadow, Bridge (gemessen 2026-08-14)
`lietz-nexus@main` → `client/public/assets/themes/tiny-swords-cc0/Terrain/`.

| Blatt | Maß | Raster | Bedeutung |
|---|---|---|---|
| `Ground/Tilemap_Elevation.png` (Stein!) | 256×512 | 4×8 | Sp. 0/1/2/3 = links/mitte/rechts/einzeln · Z. 0–2 = Oberseite oben/mitte/unten · Z. 3 = Klippe dazu · Z. 4/5 = einreihiges Plateau + Klippe · Z. 7 = Treppen (3 breit + 1) |
| `Ground/Shadows.png` | 192×192 | 3×3 | Stempel unter der Klippe |
| `Bridge/Bridge_All.png` | 192×256 | 3×4 | Brückenteile (noch nicht verbaut) |

**Zeichenregel Plateau:** Oberseite mit derselben 4×4-Blob-Wahl wie Flat Ground; für die unterste
Reihe entscheidet der Nordnachbar, ob es ein hohes Plateau (Z. 2 + Klippe Z. 3) oder ein einreihiges
(Z. 4 + Klippe Z. 5) ist. Die Klippe wird **eine Zelle tiefer** gestempelt, der Schatten zwei.
**Treppe** immer in der Türspalte an der Unterkante — dann endet die Sandstraße von selbst am
Treppenfuß (R2). **Höhenstufe ist eine Grenze:** Wechsel nur in der Treppenspalte, sonst Abprall.


## Korrektur: welches Blatt ist „Elevated Ground"?
`Ground/Tilemap_Elevation.png` aus `lietz-nexus` ist ein **Steinplateau** — sechs Reihen Mauerwerk,
**keine Grasreihe**. Wer damit ein Plateau baut, bekommt einen Steinfleck auf der Wiese.
Das echte Terrain-Tileset liegt im **Free Pack**: `Terrain/Tileset/Tilemap_color1..5.png`,
**gemessen 576×384 = 9×6 Kacheln** (color1..5 = fünf Farbvarianten desselben Rasters):

| Bereich | Kacheln | Bedeutung |
|---|---|---|
| Sp. 0–3, Z. 0–3 | 16 | Flat Ground Gras (4×4-Blob, Sp./Z. 3 = single) |
| Sp. 4 | — | leer |
| Sp. 5–8, Z. 0–3 | 16 | **Elevated Ground Gras** (gleiche Blob-Logik) |
| Sp. 5–8, Z. 4 | 4 | **Klippe zur Wiese** darunter (eine Kachel hoch) |
| Sp. 5–8, Z. 5 | 4 | **Klippe zum Wasser** (mit Cream-Rand) |
| Sp. 0 + 3, Z. 4–5 | 4 | Diagonal-/Rampenstücke |

Das sind die „16 Gras + 8 Klippe" aus den Konstruktionsregeln §1. **Treppe** gibt es hier nicht —
sie kommt aus dem Steinblatt (`Tilemap_Elevation.png`, Zeile 7) und passt farblich, weil die Klippe
denselben Blaugrau-Ton hat.

`Terrain/Tileset/Shadow.png` (Free Pack, **gemessen 192×192**) ist **ein Stempel** wie Foam, kein
Autotile: je Plateau-Zelle einmal setzen, zusätzlich einmal **unter** der Klippe — dort liegt er auf
dem Gras und wird überhaupt erst sichtbar.

**Häuser auf einer Höhenstufe brauchen `lift`** (= Klippenhöhe, 128): sonst rechnet R1 die Tür in die
Klippenwand statt unter den Treppenfuß.
**Blockiert ist nicht angekommen:** wer Bewegung über `pi = path.length` abbricht, löst im nächsten
Frame die Ankunfts-Logik aus (Bug #43: Phantom-Ernten, falsche Vorräte). Abbruch heißt neu zielen.

**Reihenfolge beim Bauen einer Höhenstufe:** Höhenmaske **zuerst**, dann die Sandmaske — sie muss die
Stufe kennen (`elev[r][c] || elev[r-1][c] || elev[r-2][c]`, Treppenspalte ausgenommen), sonst malt sie
Straßen an eine Wand. Und Netz-Wegpunkte, die in der Stufe liegen, nach unten herausschieben:
die Sandmaske folgt den Segmenten, BFS auch — ein Wegpunkt in der Klippe erzeugt beides,
Geisterstraße und Läufer, die gegen Stein rennen.

**Schatten-Regel, endgültig:** es gibt genau zwei erlaubte Schatten — der, den ein Blatt **mitbringt**
(Units, Bauten), und der **Shadow-Stempel** unter Elevated. Alles andere (weiche Ellipse unter dem
Haus, Bodenring, Radial-Gradient) ist gemalt und damit falsch. Lieber gar keinen Schatten als einen
gemalten.


## Tilemap Guide (PDF gelesen, 2026-08-14) — was daraus verbindlich folgt
1. **Shadow liegt genau EINE Kachel tiefer.** Wörtlich: die Shadow-Sprites werden „below the same area
   as the walkable part of the Elevated Ground" gesetzt und „moved completely one 64×64 pixel square
   downwards". Also: Stempel je Plateau-Zelle, Versatz **+64 px in Y** — keine handgewählten
   14/18-px-Offsets. Überlappung macht den Verlauf, wie bei Foam.
2. **Elevated Ground hat ZWEI Klippen:** eine zum begehbaren Terrain darunter, eine zum **Wasser**.
   Das sind die Zeilen 4 und 5 — **nicht** Ober- und Unterteil einer 128-px-Klippe. Eine Klippe ist
   **eine Kachel hoch**. Wer beide übereinander stapelt, baut eine doppelte Wand (Bug #49).
   Regel: liegt unter der Klippenzelle Land → Zeile 4, liegt dort Wasser → Zeile 5.
3. **Treppen:** steht die Treppe an begehbarem Terrain, verbindet **ein** Elevated-Mittelstück sie oben.
   Steht sie an einer Klippe, braucht es **zwei** Stücke — oben die Fläche, unten den Klippenfuß.
4. **Farbvarianten sind das Mittel zur Tiefenwirkung:** „Use different terrain colors in any order to
   make the different elevation layers more noticable." Gemessene Grastöne der fünf Blätter:

| Blatt | Graston |
|---|---|
| Tilemap_color1 | 184,185,88 (hell, olivgelb) |
| Tilemap_color2 | 147,186,79 (gelbgrün) |
| Tilemap_color3 | 116,179,99 (grün — **fast identisch mit dem Flat Ground des Projekts**, 121,168,99) |
| Tilemap_color4 | 150,159,100 (grau-oliv) |
| Tilemap_color5 | 99,164,134 (blaugrün) |

Daraus die Projektwahl: Flat Ground bleibt das Repo-Blatt, **Stufe 1 = color2**, **Stufe 2 = color1** —
nach oben heller. color3 ist als Stufe untauglich, weil es der Ebene 0 gleicht.
5. **Ebenenfolge** ist Shadow/Elevated **wiederholt**, so oft wie es Stufen gibt (Layer 0–8 im Guide).
   Der Zeichner muss also pro Stufe laufen, nicht einmal global.

**Silhouette:** Kein Klotz — aber auch kein Zickzack. Ein **Breitenprofil** je Reihe (oben eingezogen,
unten durchgehende Kante) gibt eine gewachsene Kuppe mit **einer** Klippenlinie. Sobald jede Spalte
ihre eigene Unterkante hat, zerfällt die Klippe in Mauerstücke und die Anlage liest sich als Labyrinth.


## Fusslinie und Kopfhöhe: Inhaltsbox messen, nicht Frame
TS-Frames sind grösstenteils transparenter Rand, und der Rand ist **je Blatt anders**. Wer Frames
unten ausrichtet, lässt große Blätter schweben. Gemessen (Alpha-Scan Frame 0, Free Pack / Update 010):

| Unit | Frame | footPad (Rand unter den Füßen) | bodyH (Figurhöhe) |
|---|---|---|---|
| Warrior | 192 | 56 | 90 |
| Archer | 192 | 58 | 74 |
| Pawn | 192 | 64 | 58 |
| Pawn (Free Pack, Träger) | 192 | 57 | 74 |
| Lancer | 320 | 122 | 149 |
| Monk | 192 | 58 | 68 |

Zeichnen: Blattunterkante auf `a.y + footPad` → Füße liegen auf `a.y` (= Sortier-, Kollisions- und
Zielpunkt). Overlays (Name, Blase, Wartemarke, Zeiger) hängen an `headY = a.y − bodyH`.
Nie an `disp` oder einer globalen Konstante — beides ist bei einem 320er Blatt sofort falsch.

**Sockel-Kollision (R4) nach 1:1:** Ellipse aus **gemessener Breite** und Sockellinie —
`x = b.x`, `y = b.y + 0.45·h − 26`, `rx = 0.34·w`, `ry = 0.12·w`. Höhe als Ersatz für Breite (oder
umgekehrt) erzeugt unsichtbare Wände neben schmalen, hohen Häusern und durchlaufbare Sockel bei
breiten, flachen. Cache `_foot` immer dort leeren, wo die Claims neu gerechnet werden.
**Was zum Haus gehört, hängt an der Sockellinie** (Vorrat, Schild, Marken) — **nicht** an der Tür.
Die Tür ist ein Wegpunkt und wandert bei Häusern auf einer Höhenstufe eine Stufe nach unten.

**Höhen als INDEX führen, nicht als Boolean.** Sobald es zwei Stufen gibt, kann eine Vereinigungsmaske
den Wechsel nicht sehen (beide Zellen sind „oben") und jede zweite Klippe wird Deko. Mit
`lvl[r][c]` (0/1/2…) reduziert sich die Regel auf drei Zeilen: Treppenspalte frei, Klippenzelle
(darüber höhere Stufe) gesperrt, **jeder** Stufenwechsel gesperrt — und sie gilt für jede weitere Stufe
automatisch. Dieselbe Maske muss die Sandmaske, `freeAt()`, `freeSpot()` **und die Baum-Schleife**
benutzen; Letztere lief historisch an `freeAt()` vorbei.

**Editor-Regel: Generator und Editor dürfen nie dieselbe Liste besitzen.** Alles, was der Editor
schreibt, muss als Karten-Daten existieren (`mapLvl`, `mapNodes`), und der Generator darf sie nur
**füllen, wenn sie fehlen**. Dazu gehört die Trennung „Terrain neu bauen" vs. „Wirtschaft säen":
ein Editor-Schritt macht Ersteres, nie Letzteres — sonst löscht der Neubau die Bearbeitung
(Bug #55: gesetzte Abbau-Orte, importierte Knoten, Vorräte, Träger).
**Sobald eine Größe editierbar wird, dürfen abgeleitete Größen keine Konstanten mehr sein.**
Höhe wurde Karten-Daten → also muss die Tür die gemalte Höhe **ablaufen** (Sockelreihe nach unten,
solange die Stufe hält, plus eine Klippenreihe) statt ein Feld `lift` zu lesen, und die Treppe wird
eine **Menge** von Spalten statt einer globalen. Reihenfolge dabei: Terrain → Türen → Claims.
**Abgeleitete Geometrie braucht abgeleitete Knoten.** Wenn die Tür aus der Höhe berechnet wird, darf
ihr Wegpunkt nicht einmal angelegt und dann gegen Updates gesperrt sein (`_stubsDone`): Sandmaske und
BFS folgen den **Wegpunkten**, nicht der Tür — der Weg endet sonst dort, wo die Tür früher war.
Regel: einmal anlegen, danach bei jedem Commit mitführen und `buildAdj()` neu rechnen.
**Reihenfolge im Weltaufbau, verbindlich:** Höhenmaske (nur `mapLvl`) → Türen (R1/R2) → Claims (R3)
→ **malen** (Sandmaske, Hintergrund, Foam, Deko). Wer die Sandmaske vor den Türen rastert, malt die
Straße zur vorigen Türlage — bei Bauten auf einer Stufe führt sie dann das Plateau hinauf und die
echte Türzelle bleibt Gras.
**Jeder abgeleitete Wegpunkt braucht eine Land-Prüfung.** „Tür + 96" ist keine Position, sondern eine
Vermutung: an der Küste landet sie im Wasser, und weil die Sandmaske nur Land malt, endet die Straße am
Ufer während die Läufer weitergehen. Regel: erste begehbare Zelle suchen (Land, nicht `stepped`), sonst
seitlich, sonst **Befund** — nie stillschweigend setzen.
**Jede abgeleitete Position prüfen, nicht nur die letzte.** Tür *und* Anfahrt entstehen aus Höhe und
Sockellinie — also brauchen **beide** die Begehbarkeitsprüfung (Land, keine Stufe, keine Klippe).
Reihenfolge der Rettung: nach unten weiter, dann Ausweichzelle seitlich am Sockel (mit Befund), zuletzt
Tür am Sockel behalten und „Gebäude verschieben" melden. Und die Anfahrt bleibt in der Türspalte —
diagonal schneidet die Kante eine Ecke über Wasser.
**Ausweichbewegungen brauchen zwei Dinge: eine Zielprüfung und einen Ursprung.** Wer einem Punkt
ausweicht, muss die Zielzelle prüfen (Land **und** nicht `stepped`) — sonst landet er im Meer. Und die
Suche muss aus der **Ausgangslage** starten (`_wpBase`), nicht aus der letzten Position: sonst
akkumuliert jeder Commit die Verschiebung und der Punkt kommt nie zurück.
**Ein Editor braucht eine Prüfung pro Schreibweg UND eine über das Ganze.** Punktprüfungen an den
abgeleiteten Stellen (Tür, Anfahrt, Netzausweichung) reichen nicht, sobald der Nutzer selbst Knoten
setzen darf: gesetzte Knoten laufen an allen Ableitungen vorbei. Regel: (1) beim Setzen auf die nächste
begehbare Zelle einrasten oder ablehnen, (2) nach jedem Commit das ganze Netz abtasten (Knoten +
Kanten in 32-px-Schritten) und Befunde ins Panel schreiben. Ein Panel, das „ok" sagt, muss „ok" heißen.
**Ein Editor hat so viele Löcher wie Schreibwege.** Es genügt nicht, das Werkzeug abzusichern, das
gerade aufgefallen ist: **jeder** Schreibweg muss durch dieselbe Funktion laufen (`snapWalkable()` —
einrasten oder ablehnen), und die Gesamtprüfung muss **alles** ansehen, was der Editor schreiben kann
(Wegpunkte, Kanten, Abbau-Orte, Spawn, Gebäude). Sonst meldet das Panel „ok", während ein Klick auf das
Meer die halbe Simulation vergiftet — der Spawn zum Beispiel steckt in jeder Route.
**Der Import ist ein Schreibweg wie ein Werkzeug** — er muss durch dieselbe Prüfung laufen
(`snapWalkable()`, sonst überspringen und **zählen**), und zwar **nach** `deriveLvl()`, sonst prüft er
gegen die alte Höhe. Und: eine Erfolgsmeldung darf eine Befundmeldung nie überschreiben. Reihenfolge im
Text: was passiert ist, dann was gefunden wurde.


## Karten-Daten und Editor (ab v4.3)

**Regel: was der Editor anfassen kann, ist Daten.** Drei Felder tragen die Karte, der Renderer bleibt
regelbasiert und leitet alles andere daraus ab:

| Feld | Inhalt | erzeugt von | danach |
|---|---|---|---|
| `mapLvl[r][c]` | Höhenstufe 0/1/2 | Generator, einmal | gemalt, importiert |
| `mapNodes[]` | Abbau-Orte (`res`, `x`, `y`, `vein`) | Generator, einmal | gesetzt, importiert |
| `mapDeco[]` | Requisiten (`kind`, `x`, `y`, `f`/`key`, `s`) | Generator, einmal | gesetzt, importiert |

`buildWorld()` darf nichts davon neu auswürfeln — nur lesen. Prüfsatz vor jedem neuen Werkzeug:
*würfelt `buildWorld()` das noch mal aus?* Wenn ja, erst befördern, dann Werkzeug bauen.

**Abgeleitet, nie gespeichert:** `lvl`/`elev` (Maske), Türen (R1/R2), Claims (R3), Sandmaske,
Autotile-Frames, Klippenart, Foam, Schatten, Gras/Blumen. Deshalb reicht im Schnappschuss die Karte.

**Ein Schreibweg pro Ziel.**
- Position schreiben → immer `snapWalkable(p)` (rastet ein oder gibt `null`).
- Serialisieren → `mapConfig(name)`; anwenden → `applyConfig(cfg)`. Download, Slot und Konverter
  hängen sich hier an, nie daneben.
- Nach jedem Schritt `edDirty = true` setzen — sonst kehrt `edCommit()` sofort um und **keine**
  Prüfung läuft (Bug #66).
- Handlung melden mit `edDo(m)` (nicht `edSay`), damit `edCommit()` sie vor das Ergebnis stellen kann.

**Prüfungen (Befund, keine stumme Korrektur):** R1/R2 Türen und Stichwege · R2 `checkGraph()` für
Wegpunkte, Kanten, Abbau-Orte, Spawn · R3 `computeClaims()` · **R4 `checkDeco()`** Requisiten im
Wasser oder an der Klippe.

**Undo:** `edSnap()`/`edRestore()` über die drei Datenfelder plus Gebäude, `WP`, `EDGES`, `PLAZA`.
Gestik-Grenzen sind `edBegin()` (Mausdruck) und `edEnd()` (Loslassen, behält nur bei JSON-Unterschied).
20 tief. Import und Slot-Laden klammern sich genauso ein.

**Slots:** `localStorage['nvMapSlots']` = `{ Name: MapConfig }`. Kein anderer Schlüssel wird angefasst.

**Tageszeit:** `todMode` = `cycle` (Vorgabe) · `day` (12:00) · `night` (22:00) · `fixed` (Regler).
Der Uhr-Knopf im Kopf ist die Wahl; `autoClock` bleibt der Motor. Platz daneben ist für Wetter
vorgesehen (Regen/Schnee/Nebel) — noch nicht gebaut.


## Fraktionen (ab v4.4)

Eine Fraktion ist **Kader + Bau + Revier**. Register: `FACTIONS` in `Nexus Castle v4.dc.html`.
Karten-Daten dazu: `mapCamps[]` (`fac, x, y, r`) und `funits[]` (`fac, unit, x, y, flip, ph`) —
gleiche Beförderung wie `mapLvl`/`mapNodes`/`mapDeco`, also in Snapshot, Export und Import.

**Gemessene Blätter** (raw-URL geladen, Größe abgefragt; Strip = eine Reihe quadratischer Frames):

| Fraktion | Blatt | Maß | Modell |
|---|---|---|---|
| Goblin Raiders | Goblin Hut | 3072×256 | Strip 256, 12 Frames |
| | Spear Goblin / Pig Rider | 2048×256 | Strip 256, 8 |
| | Torch Goblin / Hex Shaman | 1536×192 | Strip 192, 8 |
| | Pig | 1920×192 | Strip 192, 10 |
| | Wooden Fence | 256×192 | 64er-Kachelblatt (4×3), noch ungenutzt |
| Pirate Fish | Fish Hut | 1536×192 | Strip 192, 8 |
| | Bomb Fish / Harpoon / Paddle / Seahorse | 1536×192 | Strip 192, 8 |
| | Boat | 2048×256 | Strip 256, 8 |
| | Pirate Tower Water | 1024×192 | **kein Quadrat** — nicht im Register |
| Caveborn | Cave | 1536×192 | Strip 192, 8 |
| | Bear | 2048×256 | Strip 256, 8 |
| | Lizard | 1344×192 | Strip 192, 7 |
| | Snake / Spider | 1536×192 | Strip 192, 8 |
| | Turtle | 3200×320 | Strip 320, 10 |
| Einzelgänger | Troll | 4608×384 | Strip 384, 12 |
| | Minotaur | 5120×320 | Strip 320, 16 |
| | Panda | 2560×256 | Strip 256, 10 |
| | Gnoll / Thief | 1152×192 | Strip 192, 6 |
| | Gnome / Skull | 1536×192 | Strip 192, 8 |
| | Dead Tree | 384×320 | Einzelbild (Mal des Lagers) |
| Goblins 010 | Torch / TNT | 1344×960 / 1344×576 | Raster 192, 7 Spalten |
| | Barrel | 768×768 | Raster 192, 4×4 |
| | Goblin_House | 128×192 | Einzelbild |
| | Wood_Tower | 1024×192 | **kein Quadrat** — nicht im Register |
| Nexus (je Farbe) | House_<Farbe> | 128×192 | Einzelbild |
| | Castle / Tower | 320×256 / 128×256 | Einzelbild |
| Goldmine | GoldMine_Active | 192×128 | Einzelbild |
| | Bergmann/Träger | 1536×192 | Strip 192, 8 |

**Regeln**
- **Ritterfarben sind Fraktionen** (`kind:'knight'`) und benutzen die schon geladenen `h_`/`i_`-Blätter.
  Nexus Black fehlt: Free-Pack-Schwarz ist ein Strip, kein Update-010-Raster (Backlog).
- **Grundart gehört zur Fraktion:** `water:true` (Pirate Fish) prüft gegen `waterCell()`, alles andere
  gegen `walkableCell()`. Ein Einstieg für alle: `snapFac(p, fc)`.
- **Faul laden:** `facEnsure(fc)` beim Wählen/Importieren, nie im Startladebalken.
- **Jedes selbst geladene Bild braucht `im.crossOrigin = 'anonymous'`** — ohne das ist
  `getImageData()` (Alpha-Scan der Fusslinie) verboten und wirft **pro Frame** (Bug #68).
  Alpha-Scans grundsätzlich einfassen (`facPad()`): ein Blatt darf das Dorf nicht stilllegen.
- **Idle ≠ Run.** Dasselbe Blatt-Paar einer Einheit hat oft verschiedene Framezahlen (Free-Pack-Pawn:
  Run 1152×192 = 6, Idle 1536×192 = 8). Jede Reihe einzeln messen, nie vom Nachbarblatt schließen.
- **Prüfung R5** `checkFacs()`: Einheit ohne Revier · Einheit auf falschem Grund · Revier über einem
  Nexus-Claim.

**Backlog (Pfade stehen, Stilbruch ist gewollt):** `media/2D_Assets/TreasureHunters` ·
`media/2D_Assets/Pirate_Bomb` · `media/2D_Assets/Kings_and_Pigs` (im Repo derzeit nur eine 909-Byte-
Datei — vor dem Einbau prüfen). Sidescroller-Blätter brauchen eine eigene Zeichenebene, keine
Top-down-Fusslinie.

**Diagnose-Falle:** `requestAnimationFrame` schläft in einer **verborgenen** Ansicht. Leere Leinwand
plus 0 `drawImage` ist dort normal — erst `document.visibilityState` prüfen, dann suchen.


## Leylines, Wege und Abbaustufen (ab v4.5)

**Leylines** = das Wegenetz als Energieebene, gezeichnet **auf** den Boden (nach `this.bg`, vor allen
Sprites), schaltbar über `state.leys` (Taste **L**).

**v4.6 (überholt): gefüllte Bänder.** Falsch — sie lesen sich als Flächen und kosteten pro Frame
einen zweiten Vollbild-Blit. **Ab v4.7 gilt: dünner Strich, ins Weltbild gebacken.**
- `INK_PEN` 2,6 px Bauch · `INK_END` 1,1 px am Ende · `INK_RUNIN` 0,34 der Kante.
- **Taper nur bei Grad 1** (`leyDeg()`): über Kreuzungen läuft die Linie voll durch.
- `paintLeys(g)` malt in die **Weltgrafik** (Aufruf am Ende von `buildWorld()`), `drawLeys(g)` malt pro
  Frame nur die Wanderpunkte. Umschalten (L) ruft `buildWorld()`.
- **Kein `fill()`, kein `arc()` grösser als 3 px, kein `lighter` pro Frame** in dieser Ebene.

Alte Notiz (v4.6, gilt nur noch als Begründung): **Leylines waren Tusche als Band** — sie folgen dem KFB-Ink-Kanon
(`uploads/KFB Baukasten v1/onboarding-tinyswords_2026-08-14/03_INK_OUTLINE_KANON_v2.md`):
Band-Familie, ein `fill()` zwischen zwei Offsetkurven, **Taper 0,85** (Enden = 15 % des Bauchs),
Schattenachse 0,42/0,58 (54,1°, Spanne ±52 %, untere rechte Kante schwerer), Wobble zweistimmig
(4,2 + 8,1 Perioden, 62/38). Bauchbreite `INK_PEN` 6,4 px. **Kein `arc()` in dieser Ebene** — ein
runder Punkt liest sich als UI-Marke, nicht als Licht; der Funke ist ein kurzes Bandstück mit Schweif.
Wer hier etwas ändert: `leyBand()` ist die Feder, `run(u)` das Bauchprofil.
- Bahn: 14 Stützpunkte, Auslenkung quer zur Strecke `min(16, L·0.05)·sin(u·π)` — an den Enden null.
- Sichtbarkeit auf **jedem** Grund: farbiger Schein **additiv** (α .13, 11 px) + weisser Kern
  **normal** (α .26, 1,8 px). Additiv allein verschwindet auf Sand. Keine schwarzen Outlines.
- Funke: additiver Radialschein + farbiger Ring + weisser Kern, Tempo 0,085 Bahn/s.
- Farbe: `ACT`-Farbe des Gebäudes an der Kante (`leyMap()`: `b.wp`/`b.wpApp` → Gebäude), sonst creme.
  `_leyMap` wird in `edCommit()` verworfen (Türen wandern).

**Wege**
- Um **jede** Tür liegt ein Erdfeld (Radius 62, y-Versatz 22) — unabhängig vom Stichweg.
- `segCrossesClaim(s)` → Gebäude oder `null`: Kanten durch einen Hauskörper werden **nicht** gemalt
  und gemeldet ([R2]). Türzone (104 px um die Tür) ist erlaubt, Vorplatz (untere 88 px des Claims) auch.
- Offen: die Sandmaske ist 64-px-gerastert, Diagonalen wirken stufig. Braucht eine Zwischenkachel-Ebene.

**Maßstab**
- `b.h` im Register ist die **Absicht** (Depot 176 … Burg 240). `loadAssets()` darf sie nicht mit
  `naturalHeight` überschreiben, sondern rechnet nur `b.w` aus dem Seitenverhältnis.
  `drawBuilding()` zeichnet aus `b.h`/`b.w`. Units bleiben 1:1 (`SCALE = 1`).

**Körper vs. Sortierung**
- `footprints()` = Häuser + **Schafe** (rx 34/ry 15) + **Bäume** (rx 26/ry 12). Büsche und Steine sind
  flach und bleiben begehbar. Cache `_foot` nach jeder Änderung an Schafen/Deko verwerfen.
- Sortierung nach Fuss-Y regelt nur, **wer vorn** ist — „läuft durch" ist immer ein fehlender Körper.

**Abbaustufen** (Blätter gemessen: Gold Stone 1–6 je 128×128, Stump 1–4 je 192×256)

| Rohstoff | Vorrat | Darstellung | leer |
|---|---|---|---|
| Gold | 6 | Ader: Hauptstein `gs<Stufe>` + 2 Beisteine versetzt, Erdfleck schrumpft mit | nichts (nur Fleck) |
| Holz | 4 | der Baum an der Stelle | `st1..st4` Stumpf, Baum wird ausgeblendet |
| Fleisch | 3 | die Schafe selbst | keine Stufe (grasen nach) |

- `nodeMax/nodeLeft/nodeSeed` sind tolerant: fehlt `left`, gilt das Maximum — kein Wanderungsschritt
  für alte Karten nötig.
- `mine(c)` beim Ankommen des Trägers, `regrowNodes(dt·tempo)` im Tick (26–40 s), `toNode()` meidet
  leere Orte. `left` fährt im Export mit.
- **Kein Partikeleffekt hinter einer intakten Fassade.** Brand-Frames gehören zu den beschädigten
  Fassungen (Raids, v5). Schornsteinrauch ist etwas anderes: der hat eine Quelle im Bild.


## Backlog: KFB-Ink für Karten, Panels und UI

Vom User benannt, für später (Stand 14.8.2026):
- `georg-doc/kayfabizarro` → `skills/EMBED_KFB_CardBuilder_Ink_FULL_v1.md` — Card-Zone-Embeds.
- `georg-doc/kayfabizarro` → `skills/SSOT_Card_Ink_Outline_v2.md` — KFB-Ink-Linien sowie
  Panel-/Karten- und Button-/UI-Outlines. Projektkopie liegt unter
  `uploads/KFB Baukasten v1/onboarding-tinyswords_2026-08-14/03_INK_OUTLINE_KANON_v2.md`.

Gilt schon jetzt für die Leylines (v4.6). Offen aus dem Kanon selbst (§Offen): die UI-Feder beschwert
rechts/unten, die Terrain-Schattenlogik läuft oben/unten — welche näher am Kanon liegt, ist ungemessen
und gehört entschieden, **bevor** eine weitere Bodenschicht darauf aufbaut.


## Zeichenleistung: Sichtfenster ist Pflicht (ab v4.7)

Die Welt ist 3072×2176, das Bild zeigt einen Bruchteil. **Jede** Zeichenschleife prüft gegen
`viewRect(pad)` (Transform rückwärts: `cam ± cw/2/z`, oben zusätzlich die 74 px Kopfversatz;
`pad ≈ 430` deckt hohe Sprites, deren Fusspunkt schon draussen liegt). Auch grosse Blits nehmen ein
**Quellrechteck** statt des ganzen Bildes.

Gemessen: ohne Sichtfenster **413 `drawImage` pro Frame**, mit **53**.

**Die Liste ist vollständig zu halten** — beim ersten Anlauf fehlten die zwei grössten Flächen:
Himmel-Tint (`fillRect` über die ganze Welt, aktiv über die halbe Uhr) und Nacht-Glut (500-px-
Radialgradient mit `lighter` je Gebäude). Wer eine Zeichenschleife hinzufügt, setzt `inV` **sofort**.

**Messregeln**
- Zähler und Bildrate messen, **nicht** die Dauer einzelner Canvas-Aufrufe: die sind gepuffert, die
  Kosten landen beim Aufruf, der die Pipeline leert (ein `fill()` „kostete" 12 ms und beim zweiten
  Durchgang 0).
- Vorschau kann `hidden` sein → `requestAnimationFrame` schläft, jede fps-Messung hängt oder liest 0.
  Erst `document.visibilityState` prüfen.
- Statische Grafik gehört **in** das Weltbild, nicht in eine zusätzliche Vollbild-Ebene: die kostet
  pro Frame so viel wie das Weltbild selbst (12–20 ms gemessen).


## Leistungsregeln (ab v4.8) — was pro Frame passiert, ist teuer

**Die vier Kostenarten, in der Reihenfolge, in der sie aufgetreten sind:**

1. **Zeichenbefehle** → Sichtfenster (`viewRect`/`inV`, v4.7). Zählbar, leicht zu finden.
2. **Rechenarbeit vor dem Zeichnen** → Indexe statt linearer Suchen (v4.8). Zeigt sich **nicht** in der
   Zahl der Zeichenbefehle. v4.7 senkte 413 → 53 und es ruckelte weiter.
3. **React** → `setState` nur bei echter Änderung (`uiFingerprint()`). Ein `setInterval` neben der
   Renderschleife ist ein Konkurrent.
4. **Füllfläche** → `devicePixelRatio` deckeln (1,25). Pixel-Art ohne Glättung gewinnt nichts aus dpr 2.

**Kollision:** `_foot` (Häuser + Schafe + Bäume) liegt in einem **192-px-Raster** `_fgrid`
(`Map`, Schlüssel `"c,r"`). `blockedBy` fragt genau eine Zelle. Beide Caches nach jeder Änderung an
Gebäuden, Schafen oder Deko verwerfen (`_foot = null`) — `footprints()` baut das Raster mit auf.
Bewegte Körper (Schafe) werden im Raster nachgeführt, **nicht** pro Frame neu eingehängt (0,5-s-Takt).

**Prüfsatz für jede neue Schleife:** *läuft sie pro Frame, und wie lang ist die Liste im schlechtesten
Fall?* Ab etwa 50 Einträgen gehört ein Index oder ein früher Ausstieg dazu.

**Bekannt offen:** der Seitenaufbau lädt 40+ Sprite-Blätter einzeln per raw-URL und braucht über 10 s.
Ein Atlas (ein Blatt, ein Request) ist der nächste grosse Hebel — betrifft die Ladezeit, nicht die
Bildrate.


## v5: anfassbare Leylines, Anschluss, Treppen

**Breiten sind GESAMTbreiten.** `INK_PEN` 2,6 px und `INK_END` 1,1 px sind die Breite der Bahn, nicht
die Auslenkung. `leyPath()` rechnet deshalb `wid * mul * .5`. Wer das `.5` vergisst, malt die doppelte
Breite und niemand sieht es an der Zahl (#74) — die Werte stammen aus der Strichfassung, wo sie
`lineWidth` waren.

**Leylines sind ab v5 dynamisch** (nicht mehr ins Weltbild gebacken — gebacken kann man sie nicht
verformen). Preisdeckel: **zwei `fill()` je sichtbarer Kante**, Sichtfenster über die vorberechnete
Hülle `e.x0/y0/x1/y1` (Rand 90 px für Bandbreite und Zug-Beule). Nie ein Strich je Teilstück und nie
mehr als zwei Lagen — daran ist v4.6 gescheitert.

**Gummitwist** (immer aktiv, nicht nur im Editor):
- `leyPick(p)` greift **nur den wandernden Punkt** (`LEY_DOT` 13 px), nie die Bahn — sonst liegt der
  Griff über dem halben Dorf und verdrängt Schwenken und Auswahl (#70). `leyDots(e)` ist die **eine**
  Quelle für Zeichnen und Greifen.
- Umlegen **nur auf einen bestehenden Wegpunkt** (`LEY_SNAP` 40 px). Keine neuen Wegpunkte aus einer
  Ziehbewegung: das schreibt die Wegführung aller Agenten um (#71).
- **Zwei Koordinatenräume:** `leyRest(e, u)` = Ruhelage, `leyAt(e, u)` = Anzeige (mit Beule). Griff,
  Zug und Ziel rechnen **alle** in der Ruhelage (`dx/dy = Zeiger − Ruhelage`); nur Zeichnen und
  Treffertest benutzen die Anzeige. Mischt man beides, stimmt die Rechnung genau so lange, wie keine
  Feder läuft (#75).
- Rückmeldung über `leyToast()` (unten mittig, Blasen-Optik) — `edMsg` ist editor-only, die Bahn ist
  es nicht.
- `leyBend(e, u)` Beule mit `cos²`-Abfall, Reichweite 0,42 der Kante · `leyDisp(e, k)` = Ruhelage + Beule.
- Loslassen > `LEY_SET` 40 px **und** ein bestehender Wegpunkt in Reichweite → Kante über diesen Punkt
  umlegen, `buildAdj()`, `edDirty`. Sonst Feder `leySpring` (K 92, D 7,4).
- **Alles Verformte muss durch `leyDisp`**, sonst laufen Funken und Linie auseinander.

**Anschluss (R6).** Breitensuche vom Marktplatz über `adj` — `adj` ist eine **`Map`**, also immer
`adj.get(i)`, nie `adj[i]` (#76: die Prüfung meldete sonst ausnahmslos alles als abgehängt und
verdeckte über `edCommit()` jede echte Meldung).
Breitensuche vom Marktplatz; nicht erreichte Wegpunkte werden mit den
betroffenen Gebäuden gemeldet. Merksatz: R1–R5 fragen „ist dieses Ding in Ordnung?", R6 fragt „hängt
das zusammen?" — das ist der Fehler, den man im Bild sieht.

**Sand folgt dem Graphen, immer.** Eine Kante, die im Graph steht, wird **gemalt** — auch wenn sie
durch ein Haus läuft (dann Befund R2). Nicht malen erzeugt sonst abgebrochene Wegstücke: Bild und
Graph fallen auseinander. **Anschluss vor Reinheit.**

**Ein Wegpunkt ist erst ein Weg, wenn ihn etwas zum Ziel macht.** Ziele entstehen nur über `sendTo`
(Tür), `toNode`, `toHouse`; `route()` = `bfs(nearestWp(from), nearestWp(to))`. Ein Blatt ohne Ziel liegt
auf keiner Route (#77). Prüfsatz für neue Wegpunkte: *wer zielt darauf?* — und die Antwort simulieren,
nicht ableiten. `b.wpTop` (Plateau) ist Ziel für 40 % der Wege zu diesem Haus (Ausguck).

**Treppen sind Daten** (`mapStairs`, Set von Spalten) — nicht mehr nur abgeleitet aus „Haus steht auf
einer Stufe". `isStair(c)` liest beides. Werkzeug **Treppe** im Editor, `stairs` im Export, im
Undo-Schnappschuss. `blocked()` erlaubt einen Stufenwechsel nur, wenn Start **und** Ziel in einer
Treppenspalte liegen — ein Wegpunkt oben gehört also in dieselbe Spalte wie die Anfahrt (`linkPlateau()`).

**Offen:** die Kachel für eine **seitliche** Treppe. `Tilemap_Elevation.png` ist 256×512 = 4×8,
benutzt wird (3,7). Welche der vier Kacheln in Zeile 7 die Flanke ist, ist **ungemessen** — die Kachel
gibt die Laufrichtung vor, hier nicht raten.


## Sprechblasen (ab v5)

**Eine Blase für alles**, im Ink-Stil. Wer eine neue Blase braucht, nimmt diese — keine zweite Variante.

- `inkBubblePath(g, cx, by, w, h, tx, ty)` — Rundrechteck **plus Spitze als EIN Pfad**. Die Spitzenbasis
  wird in die Unterkante eingeleitet und auf die Kanten geklemmt.
- `inkBubble(...)` — einmal füllen (`BUB_FILL` `rgba(247,240,222,.97)`), geklippte Schattenkante
  versetzt (+1,6/+2,2, α .22, 5 px), dann Kontur `BUB_INK` `rgba(74,52,24,.9)` 2,2 px.
- `inkSay(g, text, tipX, tipY, {side, max, h, gap, font, color})` — Blase auf Textbreite, Deckel 260 px.
  **Für Kommentare (Card Zone).**

**Zwei Regeln, aus Bug #69:**
1. **Nie Körper und Spitze getrennt füllen und umranden.** Die Kontur der Spitze läuft sonst quer über
   ihre Basis — das sind die „schwarzen Zacken". Ein Pfad, ein `fill()`, ein `stroke()`.
2. **Keine schwarzen Konturen.** Warme Tusche (`BUB_INK`), nie `rgba(36,23,8,…)` oder dunkler. Auf
   kleinen Blasen und bei halbem Zoom wird jede fast-schwarze 2-px-Linie zum Klecks.

Die Blase weicht zur **Gegenseite** des Gesprächspartners aus; die Spitze zeigt auf den Kopf.

**Alles über dem Kopf kommt aus `headStack(a, headY)`** — Blase, Name, Status-Chip. **Nie** eine zweite
Rechnung daneben stellen: genau das war viermal derselbe Bug (#68 Label gegen Label, #69 Blasenform,
#73 Blase gegen Label, #73b zwei Lift-Regeln mit einer Konstante dazwischen).

Die Funktion liefert `lift`, `p`, `mode`, `bubbleW/H`, `bubbleBottom`, `bubbleTop`, `bubbleMid`,
`nameBase`, `chipBase`. **Auch welche Blase erscheint**, entscheidet sie (`mode`: `wait` · `talk` ·
keine — die beiden schliessen sich aus). Eine Blase, die ihre Position selbst setzt, kollidiert mit dem
Label (#73d, Gesprächsblase mit festem `headY − 8`):
- **ein** Nachbarkasten (78×90, Nachbar mit kleinerer `id`), **ein** Schritt (`HEAD_STEP` 40).
- `bubbleBottom = headY − 14 − p·3 − lift`, Körper 30 px hoch, Spitze 11 px darunter.
- Das Label ist ein **zweizeiliger Block**: `nameBase` und `chipBase` (= `nameBase + CHIP_DY`).
  Freigeräumt wird die **Unterkante des Blocks**: `nameBase = min(headY − 20 − lift, bubbleTop − 6 − CHIP_DY)`.
  `CHIP_DY` steht **nur** in `headStack()` — `drawHero()` liest beide Grundlinien und rechnet nichts.
  (#73c: der Chip rutschte sonst in die Lücke, die für den Namen entstanden war.)

**Regel:** eine Konstante zwischen zwei Rechnungen ist eine Wette darauf, dass beide gleich ausfallen.
Wenn zwei Zeichenschritte dieselbe Geometrie brauchen, holen sie sie aus derselben Funktion.


**Wegpunkte nie aus `WP` entfernen.** Die Indizes sind die Identität: `EDGES`, `b.wp`, `b.wpApp`,
`b.wpTop` und jeder Undo-Schnappschuss verweisen darauf. Ein nicht mehr gebrauchter Punkt wird
**stillgelegt** (auf eine gültige Position gelegt, angeschlossen bleiben), nicht gelöscht (#72).
