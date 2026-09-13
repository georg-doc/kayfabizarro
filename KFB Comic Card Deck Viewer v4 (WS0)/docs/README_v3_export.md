# KFB Deck Viewer — Export v3.2 (2026-08-02)

Lauffähiger Stand. Läuft ohne den Rest des Projekts.

## Was hier liegt

| Datei | Wofür |
|---|---|
| `KFB-Deck-Viewer-v3-standalone.html` | **Eine Datei, 1,2 MB.** Doppelklick im Browser, oder als einzelne Datei auf Cloudflare Pages / GitHub Pages werfen. |
| `index.html` + `support.js` + `deckviewer/` | Dieselbe App als Ordner. Für ein Pages-Deployment mit lesbaren Diffs. |

Beide Fassungen sind derselbe Stand; die Einzeldatei ist aus dem Ordner gebündelt.

## Was der Viewer kann

**Vier Ansichten auf denselben Korpus.**

- **Reader** — senkrecht durch ein Comic scrollen, zoomen, Tiefenlink per Adresse.
- **Galerie** — alle 130 Cover als gekipptes Raster, suchbar, mit Lesezeichen.
- **Stapel** — die Cover liegen gemischt, der Zug hebt sie einzeln ab und dreht sie um.
- **Coverflow** — aufgereiht, zur Mitte gedreht; ziehen oder scrollen, Titel unten in Irish Grover.

Stapel und Coverflow zeigen wahlweise **ein Cover je Comic** oder **jedes einzelne Blatt** (1914)
— derselbe Umschalter neben der Suche. Bei Blättern liegt an jeder Comic-Grenze eine Schnittmarke.

**Bedienung:** Klick holt die Karte in die Mitte und öffnet den Infokasten · nochmal Klick
schließt ihn · **Doppelklick öffnet das Comic** · Pfeiltasten, Rad und Ziehen fahren die Reihe ·
`/` springt in die Suche · `g` Galerie · `f` Stapel · Escape zurück · `t` hell/dunkel.

**Editor** (`?edit=1` ist noch nicht scharf, siehe unten): sieben Felder je Comic, Markdown,
Entwurfshilfe im FrizzleBob-Ton, Export als zeichengleiches JSON (Δ 0).

## Was NICHT eingebettet ist — und das ist Absicht

Die Comics. Der Viewer holt bei jedem Start

```
https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/index.json
```

mit `cache: 'no-store'` und daraus die Deck-JSONs und PDFs. **Das Repo ist die Wahrheit.** Ein
Viewer mit eingebackenem Korpus wäre am Tag nach dem Export veraltet — genau der Fehler, der die
Registry zweimal tagelang zu klein stehen ließ.

Folge: **ohne Netz zeigt die Datei nur die Hülle.** Und: wächst der Korpus im Repo, wächst diese
Datei ohne Änderung mit.

Zwischengespeichert wird trotzdem — Seitenbilder landen in IndexedDB (`kfb-deckviewer`), der
zweite Start ist schnell, und nach einem Durchgang liegt ein Comic vollständig lokal.

## Deployment

**Cloudflare Pages / GitHub Pages, einfachster Weg:** `KFB-Deck-Viewer-v3-standalone.html` nach
`index.html` umbenennen, hochladen, fertig. Kein Build, kein Backend, keine Umgebungsvariablen.

**Als Ordner:** die drei Einträge (`index.html`, `support.js`, `deckviewer/`) in die Wurzel.
Gleiches Ergebnis, aber diffbar.

**Voraussetzung:** `raw.githubusercontent.com` muss erreichbar sein. Das Repo ist öffentlich,
CORS steht. Liegt der Viewer auf demselben Host wie `media/kfb`, lohnt der Umbau auf eine
zweistufige Basis (erst `/media/kfb`, dann raw) — siehe `docs/SPEC_KFB_consolidation.md` §1.

## Als Claude-Artefakt

Die Einzeldatei ist mit 1,2 MB zu groß, als dass ein Chat sie nachbauen könnte — sie ist zum
**Hochladen und Öffnen** gedacht. Wer in einem neuen Chat daran weiterbaut, hängt die
Ordner-Fassung an (`index.html` + `deckviewer/*.js`); `support.js` ist Laufzeit und muss nicht
mitgelesen werden.

Der Entwurfshelfer („draft with FrizzleBob") ruft `window.claude.complete` auf. Den gibt es nur
im Artefakt-Kontext — auf Cloudflare/GitHub ist der Knopf da, aber tot. Kein Fehler, nur eine
Umgebung ohne Modell.

## Stand

**130 comics · 1914 pages · 6985 cards.**

## Drei offene Punkte, die man vor einer öffentlichen Adresse kennen sollte

1. **`?edit=1`-Gating fehlt.** `editMode()` gibt `this.props.edit !== false` zurück — der Stift
   ist **immer** sichtbar. Eine Zeile, vorbereitet und kommentiert.
2. **Alle Download-Knöpfe stehen auf „Coming soon…"**, weil in `deckviewer/deck-meta.js` noch
   keine einzige `gumroadUrl` gefüllt ist. Das ist gewollt: ohne gültige Shop-Adresse gibt der
   Viewer kein Versprechen ab.
3. **21 der 130 Comics brechen den Kanon** „vier Karten je Blatt, Seite 1 ist Cover" — zwei davon
   sind abgebrochene Auszüge. Details: `docs/HANDOVER_deckanalyse_coworker.md`.

Alles Weitere: `docs/SESSION_CUT_deckviewer_v3.md` und `docs/HANDOVER_deckviewer_v4.md`.
