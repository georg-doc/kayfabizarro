# Handover — PDF-Renderpfad im `kfb-card-builder` (Skill *kfb-embed-bundle v3*)

**An:** wer den Skill `skills/kfb-embed-bundle v3` im Repo `georg-doc/kayfabizarro` pflegt
**Von:** Combat Arena v2, Slice S1 (06.09.2026) · alle Zahlen in diesem Dokument sind gemessen, nicht geschätzt
**Betrifft:** `kfb-card-builder.js` — sechs Änderungen, die in der PROJEKTKOPIE stecken und in der Skill-Quelle fehlen
**Dringlichkeit:** hoch. Ohne diese Änderungen liefert der Builder in Claude-Design-Vorschauen **nie** Deck-Artwork. Er wirft dabei keinen Fehler; er wartet still.

---

## 1 · Worum es geht, in einem Satz

Der Builder hat in unserer Umgebung monatelang nur Textkarten gezeigt. Das sah nach „PDF-Rendern ist langsam" aus und war in Wahrheit **vier voneinander unabhängige Stillstände** in pdf.js — jeder davon ohne Fehlerzeile, jeder davon reproduzierbar, alle vier behoben. Dazu zwei Cache-Fehler, die falsche Auflösungen still weitergaben.

Kein Fork, kein Nachbau: es ist dieselbe Datei mit sechs chirurgischen Änderungen. Die Projektkopie liegt in `cardbuilder/kfb-card-builder.js` des Design-Projekts *Pet Studio v10 + KFB Lab + Graveyard + Academy*.

---

## 2 · Die sechs Änderungen

### (1) `isEvalSupported: false` — der wichtigste Fund

```js
lib.getDocument({ data: buf, …, isEvalSupported: false })
```

Die Vorschau läuft unter einer CSP **ohne `unsafe-eval`**. pdf.js baut intern Auswertungsfunktionen per `eval`, fängt den Verstoß und **wartet dann endlos** — `render().promise` settelt nie, die Konsole bleibt leer.

*Messung:* dieselbe Seite mit dem Flag: **60 ms**. Ohne: nach 25 s kein Ergebnis, keine Meldung.

### (2) Worker als Blob statt CDN-URL

```js
const src = await (await fetch(PDFJS_WORKER)).text();
lib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
```

Ein Modul-Worker von fremdem Ursprung wird im iframe blockiert; `getDocument` hängt ohne Fehler. Der Blob ist same-origin und darf. Fällt der Abruf aus, bleibt die CDN-URL stehen (pdf.js nimmt dann seinen Fake-Worker-Rückfall) — also kein neuer Single Point of Failure.

### (3) `{ data: ArrayBuffer }` statt `{ url }`

```js
const buf = await pdfData(url);                 // fetch + arrayBuffer, je PDF EINMAL, geteilt
doc = await lib.getDocument({ data: buf.slice(0), … }).promise;
```

`getDocument({url})` hängt: der PDF-Host antwortet auf Range-Requests mit HTTP 206, sendet aber keinen `accept-ranges`-Kopf. Selbst geholter Puffer läuft. `slice(0)` gibt pdf.js eine Kopie — es entkoppelt den übergebenen Puffer sonst und der Cache wäre danach leer.

### (4) `disableFontFace: true` (+ `cMapUrl`, `standardFontDataUrl`)

Eingebettete Schriften bindet pdf.js sonst über `document.fonts` — dieser Ladeweg löst im verdeckten Fenster nie auf. Pfad-Rendering statt CSS-Schriften: **gleiches Bild**, keine Naht.

### (5) Auflösung in BEIDE Cache-Schlüssel

```js
const key = url + '#' + pageNum + '@' + targetW;      // Seiten-Cache
const ck  = card.packId + '#' + card.n + '@' + P.pdfRes;  // Artwork-Cache (cropCard)
```

Vorher hieß der Seiten-Cache nur `url#seite`: wer eine Seite zuerst klein zog, bekam sie für immer klein. Und der `artCache` war gar nicht nach Auflösung geschlüsselt — ein noch fliegender Auftrag der alten Größe füllte ihn nach dem Leeren **wieder**, und der neue Bau konsumierte den zu kleinen Schnitt.

*Messung:* Feld 18 u zeigte 85 px/u (Schnitt 1530 px), obwohl `pdfRes` auf 4096 stand. Mit Auflösung im Schlüssel: 113,8 px/u (Schnitt 2048 px), auf Anhieb, ohne Umweg.

### (6) `pdfRes` in die Cache-Leerung von `setParams`

```js
if (p && (p.quadrant !== undefined || … || (p.pdfRes !== undefined && p.pdfRes !== P.pdfRes))) artCache.clear();
```

Ergänzt (5): wer die Auflösung ändert, darf die Schnitte von gestern nicht behalten.

### Ohne Frist, aber erwähnenswert

Wir haben zusätzlich eine **8-s-Frist je Seitenrender** eingebaut, die den Cache-Eintrag verwirft, damit ein Aufrufer die nächste Karte nehmen kann. Das ist Versicherung, keine Diagnose — nach den Fixes (1)–(4) ist kein Hänger mehr aufgetreten. Ein früher notierter Verdacht („manche Seiten rendern nie") **hat sich nicht bestätigt**: zehn Seiten desselben Decks 94–279 ms, drei Kaltstarts mit verschiedenen Decks 888/709/868 ms inklusive PDF-Abruf. Die zwei beobachteten Hänger fielen in eine Fassung mit Warteschlange, in der ein offener Auftrag alle Folgeaufträge mitnahm. **Keine Warteschlange über Renderaufträge legen.**

---

## 3 · Was NICHT geändert wurde

- Kein neuer Renderpfad. Der Feldmodus der Combat Arena nutzt `pageOf(card, targetW)` — dieselbe Lesefunktion, nur ganze Seite statt Viertel, derselbe Seiten-Cache.
- Keine Änderung an Tusche, Maske, Decal, Kartenraster, `card-grids.json`, Registry-Ladeweg oder den vier Regeln im Kopfkommentar.
- Keine API-Brüche. `createCardBuilder`, `pool`, `make`, `pageOf`, `setParams`, `lastCrop` verhalten sich wie dokumentiert.
- Eine **API-Falle** blieb absichtlich unverändert und ist nur dokumentiert: `pdfRes` muss durch `params:` gehen — `createCardBuilder({ THREE, params: { pdfRes: 3000 } })`. Am Wurzel-Objekt wird es still verworfen (`opts.params` ist die einzige gemischte Quelle). Das hat uns eine Runde gekostet; eine Warnung bei unbekannten Wurzel-Schlüsseln wäre eine gute kleine Ergänzung.

---

## 4 · Umgebungsfallen, die kein Code-Fehler sind

Zwei Riegel im Builder bzw. in der Umgebung, die Messungen verfälschen. Wer den Builder testet, muss sie kennen:

| Riegel | Wirkung | Konsequenz für Tests |
|---|---|---|
| `pump()`: `if (busy \|\| !queue.length \|\| document.hidden) return` | Die Artwork-Warteschlange läuft **nicht**, solange das Fenster verdeckt ist | Karten-Artwork nur in der **sichtbaren** Ansicht messen. Im Hintergrundfenster bleibt die Karte Text ohne Bild — das ist Absicht, kein Defekt |
| `requestAnimationFrame` ist im verdeckten Fenster gedrosselt | pdf.js plant Render-Häppchen per rAF | Wir setzen `task.onContinue = (weiter) => weiter()`, damit der Aufrufer die Häppchen selbst weitertreibt |

---

## 5 · Wie man prüft, dass es angekommen ist

Im Browser, in einer **sichtbaren** Seite mit geladenem `THREE`:

```js
const cb = createCardBuilder({ THREE, params: { pdfRes: 3000 } });
const pool = await cb.pool();
const t0 = performance.now();
const p = await cb.pageOf(pool[0], 3000);
console.log(p.seite, p.w + '×' + p.h, Math.round(performance.now() - t0) + ' ms', cb.pageTrace);
```

**Soll:** eine Seite, ~3000 px breit, unter 1000 ms bei kaltem Start (inkl. PDF-Abruf), unter 300 ms warm. `cb.pageTrace` endet auf `gerendert 3000×…`.
**Falsch:** die Spur endet auf `vp 3000×…` und nichts folgt → einer der Fixes (1)–(4) fehlt.

Für den Schnitt zusätzlich `cb.lastCrop.cw` lesen: bei `pdfRes` 3000 rund 1530 px, bei 4096 rund 2048 px. Bleibt `cw` beim kleineren Wert, obwohl `params.pdfRes` größer ist, fehlt (5) oder (6).

---

## 6 · Vorschlag fürs Repo

1. Die sechs Änderungen in `skills/kfb-embed-bundle v3/kfb-card-builder.js` übernehmen — sie sind additiv und ändern kein Verhalten außerhalb des PDF-Ladewegs.
2. Die Fallen aus §4 in die Skill-Dokumentation aufnehmen (ein Absatz „Umgebung", direkt nach den vier Regeln).
3. `createCardBuilder` um eine Warnung bei unbekannten Wurzel-Optionen erweitern (`pdfRes`, `preset`, `aspect` gehören in `params`).
4. Diagnose behalten: `cb.pageTrace` mit Zeitmarken war der einzige Grund, warum diese vier Stillstände überhaupt unterscheidbar waren. Wo etwas hängt, muss ablesbar sein — ein stiller Ausfall sieht aus wie Absicht.

**Merksätze aus dieser Sitzung, falls sie jemandem Zeit sparen:**
Einen Parameter setzen ist nicht dasselbe wie ihn ankommen sehen. Einen Cache zeitlich leeren heißt, sich auf Reihenfolge zu verlassen — was den Wert unterscheidet, gehört in den Schlüssel. Und: eine einzelne Beobachtung, zweimal gesehen, ist noch keine Ursache.
