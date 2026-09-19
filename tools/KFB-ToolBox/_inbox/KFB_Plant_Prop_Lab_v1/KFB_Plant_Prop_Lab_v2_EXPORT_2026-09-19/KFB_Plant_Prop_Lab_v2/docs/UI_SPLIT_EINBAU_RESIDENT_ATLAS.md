# Einbau-Anleitung · Split-Screen-Schale für den Resident Atlas S6

Stand 2026-09-17. Vorlage: `KayKit_Dungeon_Generator_S13_2.html` (Environment Atlas), lauffähige
Referenz zum Aufmachen und Kopieren: **`ref/ui-split-shell.html`**.

Diese Anleitung ist für `KFB_Resident_Atlas_S6.html` im Resident-Atlas-Projekt geschrieben. Ich habe
dessen Quelltext hier **nicht** vorliegen — die Element-Namen unten stammen aus dem Screenshot vom
17.09. 23:53. Wo ein `id` genannt ist, das dort anders heisst, bitte den eigenen nehmen; die Regeln
darunter gelten unverändert.

## Warum überhaupt

Im Split-Screen (Chat links, Seite rechts) blieb vom Betrachter ein Streifen übrig: drei Kopfzeilen
(Titel + Auswahl + Badges · sieben Schaltflächen · Motion-Zeile) und eine dauerhaft offene
Studio-Leiste rechts kosteten zusammen mehr Fläche als die Figur. Dazu kam ein zweiter, stiller
Fehler: **eine umbrechende Kopfzeile verschiebt die Szene bei jeder Fensteränderung um eine
Zeilenhöhe** — bei Split-Screen ständig.

Die Schale löst beides mit drei Zuständen: **Leiste zu** (Normalfall), **Leiste auf**, **nur
Ansicht**.

## Schritt 1 · Rahmen ersetzen

Aus `ref/ui-split-shell.html` den kompletten `<style>`-Block bis `.legend` übernehmen (oder die
eigenen Farben behalten und nur die Struktur-Regeln kopieren: `#app`, `#app.panel`, `#app.clean`,
`header`, `#stage`, `aside`, die `@media (max-width:1100px)`-Regel).

Die vier Regeln, auf die es ankommt:

| Regel | Zweck |
|---|---|
| `#app{grid-template-columns:minmax(0,1fr) 0;grid-template-rows:38px minmax(0,1fr)}` | Leiste ist **zu**, Kopf ist **eine** Zeile |
| `header{overflow:hidden}` + `#bar{flex:1 1 auto;min-width:0;overflow-x:auto;scrollbar-width:none}` | zu viele Bedienelemente **scrollen** in der Mitte, sie brechen nicht um |
| `#barwrap{position:relative;padding:0 26px}` + `#less`/`#more` + `::before`/`::after` | **beide** Kanten sagen, dass dort noch etwas liegt — Verlauf + Knopf, je aus einer Messung |
| `.tail{flex:0 0 auto}` mit `Nur Ansicht` + `☰` | die zwei Knöpfe, die den Rahmen bedienen, scrollen **nie** weg |
| `#stage{min-width:0;min-height:0}` | ohne das wächst ein Canvas in einem Grid-Feld ins Unendliche |
| `@media (max-width:1100px)` → `aside{position:fixed}` | schmal legt sich die Leiste **über** die Szene statt sie zu quetschen |

**Warum `.tail` getrennt steht — gemessen, nicht vorsichtshalber.** Die erste Fassung liess die
ganze Kopfzeile scrollen. Bei 924 px Breite (Split-Screen) ergab das `header.scrollWidth` 1149
gegen `clientWidth` 924: `Nur Ansicht` und `☰` lagen 225 px ausserhalb — und weil die Scrollleiste
absichtlich unsichtbar ist, gab es keinen Hinweis darauf. Genau bei der Breite, für die der Umbau
gemacht ist, war die Leiste nicht mehr zu öffnen. Mit der Kopfzeile des Resident Atlas
(Resident-Auswahl + 4 Ansichten + 4 Ebenen + Motion + Licht + ☰) tritt das sofort ein.

**Und die Kante muss auf BEIDE Seiten.** Erst nur rechts gebaut, verlegte sie den Fehler bloss:
nach einem Schub nach rechts lag das Resident-Feld mit 0 von 112 px im Bild, ohne Verlauf, ohne
Knopf, ohne Hinweis. Jetzt schaltet **eine** Messung beide Seiten:

```js
const syncMore = () => {
  wrap.dataset.less = bar.scrollLeft > 2 ? '1' : '0';
  wrap.dataset.more = bar.scrollWidth - bar.clientWidth - bar.scrollLeft > 2 ? '1' : '0';
};
```

Zwei Dinge dabei sind gemessen, nicht Geschmack: die Polster gehören auf **`#barwrap`**
(`padding` auf `#bar` verlängert nur den Inhalt an seinem Ende und reserviert nichts an der
Sichtkante — der Knopf lag sonst 19 px auf `Optional`), und der Schub setzt `scrollLeft`
**synchron**. Weder `scrollBy({behavior:'smooth'})` noch `requestAnimationFrame` waren verlässlich;
in einer Vorschau kam über 10 s kein einzelner Frame und der Knopf tat nichts. Das Tweenen läuft
nur als Zugabe darauf.

## Schritt 2 · Bedienung umsortieren

Aus dem Screenshot, Zeile für Zeile:

| heute | künftig |
|---|---|
| Titel „KFB Resident Atlas · S6" | `h1` mit `S6`, klein, monospace |
| Resident-Auswahl (Dropdown) | bleibt im Kopf — das ist der Hauptschalter |
| Badges `candidate-only`, `5 Objekte` | **in die Leiste**, Abschnitt „Resident" |
| Key Art · Draufsicht · Raster · Maße | Kopf, als **eine** Schaltgruppe (`.steps`), genau eine Wahl |
| Aktor · Requisiten · Habitat · Optional | Kopf, zweite Schaltgruppe, **mehrere** Wahlen (`aria-pressed` je Knopf) |
| Motion · Recipe-Pose (Dropdown) | Kopf, hinter einem `.sep` |
| Golden Hour | Kopf, als `label.sl` + `select` (Licht) |
| Referenz-Schieber | **in die Leiste**, Abschnitt „Studio" |
| Recipe JSON | **in die Leiste**, Abschnitt „Studio" |
| Studio · Anfasser (ganze rechte Spalte) | **in die Leiste**, erster `<details open>`-Abschnitt |
| „Leiste ausblenden" unten rechts | entfällt — der `☰`-Knopf in `.tail` macht das |

Alles aus der Tabelle, das im Kopf bleibt, gehört in `#bar`. In `.tail` stehen genau zwei Knöpfe:
`Nur Ansicht` und `☰`. Kommt ein dritter dazu, ist er ein Kandidat für die Leiste.

Faustregel, die im Environment Atlas trägt: **auf der Szene liegt nur das Ergebnis eines Klicks**
(`#pick`). Alles, was eine Zahl ist, steht in der Leiste.

## Schritt 3 · Die drei Handgriffe

```js
document.getElementById('panel').onclick = (e) => {
  const on = app.classList.toggle('panel');
  e.currentTarget.setAttribute('aria-pressed', String(on));
  requestAnimationFrame(() => V.resize());      // ← euer Viewer
};
const setClean = (on) => {
  app.classList.toggle('clean', on);
  requestAnimationFrame(() => { V.resize(); if (on) V.frame(root, [0.55, 0.9, 1], 1.04); V.draw(); });
};
addEventListener('keydown', (e) => { if (e.key === 'Escape') setClean(false); });
```

**Der `requestAnimationFrame` ist nicht kosmetisch.** Die Grid-Spalte ändert ihre Breite erst nach
dem Layout; ein `resize()` im selben Tick misst die alte Breite und der Betrachter bleibt verzerrt.

Im Resident Atlas kommt eine Sache dazu, die der Dungeon nicht hat: **die Kamera ist auf eine Figur
gerahmt, nicht auf eine Szene.** Nach `clean` also nicht neu framen, sondern denselben Zielpunkt
behalten und nur `resize()` rufen — sonst springt die Figur beim Ein- und Ausschalten.

## Schritt 4 · Zwei Fallen, die uns schon Zeit gekostet haben

1. **Vorrang in `className`-Ausdrücken.** In S13.2 stand `'mono' + fails ? ' bad' : ''` — das
   markierte jeden Zustand als rot, weil `+` vor `?:` bindet. Klammern setzen, oder besser
   `classList.toggle('bad', fails > 0)`.
2. **Ein versteckter Knopf ist kein entfernter Knopf.** `display:none` auf einem Bedienelement, das
   eine Prüfung auslöst, lässt die Prüfung weiterlaufen. Im Resident Atlas betrifft das die
   Anfasser: solange ein Anfasser-Modus aktiv ist, fängt er Klicks auf der Szene ab — beim
   Umschalten auf „nur Ansicht" den Modus auf `Aus` setzen.

## Was die Schale nicht mitbringt

Sie ist ein Rahmen, kein Design. Keine Typo-Skala, keine Icons, keine Zustände für Mobil unter
600 px (dort ist ein 3D-Betrachter mit Bedienleiste ohnehin die falsche Antwort). Wenn der Resident
Atlas eine Kopfzeile mit mehr als ~14 Bedienelementen bekommt, ist die nächste Frage nicht „noch
eine Zeile", sondern welche zwei davon in die Leiste gehören.
