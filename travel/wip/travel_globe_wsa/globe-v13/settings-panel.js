// ============================================================================
// settings-panel.js — Einstellungen: geclustert, klappbar, lesbar
// ----------------------------------------------------------------------------
// **v3b (29.8.) — zwei Befunde von Georg, beide im Layout:**
//   1. „Das Overlay sollte die Screengröße besser nutzen, nicht nur Sidebar." Also kein
//      298-px-Streifen mehr, sondern eine **Karte mit Abschnitts-Gitter**
//      (`auto-fill, minmax(268px, 1fr)`): auf einem breiten Schirm stehen drei Spalten
//      nebeneinander, auf einem schmalen fällt es von selbst auf eine zurück. Ein Klapper
//      schrumpft dabei auf seine Kopfzeile — deshalb `align-items:start`, sonst zieht die
//      höchste Karte die ganze Reihe auf.
//   2. „Headlines/Klapper sind schlecht zu erkennen." Die Köpfe hatten 13 px bei Deckkraft 1
//      auf einer Fläche gleicher Farbe — also kein Kontrast, nur Text. Jetzt: eigene
//      Kopfleiste je Karte (helleres Cremeton, 15 px, 700, Versal-Sperrung), Trennlinie und
//      der Pfeil im Akzentrot. Der Rest der Schrift bleibt, wie er war.
// Georgs Ansage: „clean und minimalistisch mit gut lesbarer font (vgl. Anti-Pattern
// in Settings/Dice aus KFB Travel v17)". Das v17-Panel ist genau deshalb NICHT
// portiert: dort stehen ~40 Abschnitte in 10-px-Versalien mit Schreibmaschinen-
// schrift und Zahlen ohne Einheit — eine Werkbank, kein Bedienfeld.
//
// Hier gilt:
//   · Abschnitte nach NUTZUNGSHÄUFIGKEIT sortiert; die ersten zwei offen, Rest zu.
//   · Baloo 2, 14 px, gemischte Schreibweise, Zahlen tabellarisch (kein Zappeln).
//   · Eine Zeile = eine Entscheidung. Kein Regler ohne Wert daneben.
//   · Messwerte sind LESESTOFF, kein Regler — sie stehen unten in „Technik".
//
// Das Panel kennt keine Fachlogik: es bekommt ein Schema mit `get`/`set` und
// verkabelt es. Wer eine Zeile ändert, ändert sie im Runner (eine Wahrheit).
//
//   const panel = createSettingsPanel({ host, schema, onClose });
//   panel.setOpen(true);   panel.refresh();
// ============================================================================

const CSS = `
/* ── EIN Blatt für alle Overlays (Einstellungen UND Kartenbetrachter) ────────
   Georg, 29.8.: „das ist EIN Overlay-Template für Settings & Card-Viewer" — gleiches Papier,
   gleiches ✕, gleiche Schrift, EINE Textgröße, keine Trennlinien. */
.kfb-sheet { background-color:#f1e7cf; color:#1f1a14;
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/><feColorMatrix type='saturate' values='0'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='0.055'/></svg>"),
    radial-gradient(130% 100% at 10% -10%, rgba(255,255,255,.6), rgba(255,255,255,0) 62%);
  border:1px solid rgba(31,26,20,.28); border-radius:9px;
  box-shadow:0 16px 40px rgba(0,0,0,.4);
  font-family:'Baloo 2', system-ui, sans-serif; font-size:14px; line-height:1.4; }
.kfb-sheet .kfb-head { display:flex; align-items:center; justify-content:space-between;
  gap:14px; padding:12px 14px 10px; }
.kfb-sheet .kfb-head .t { font-size:15px; font-weight:700; letter-spacing:.02em; color:#17120d; }
.kfb-sheet .kfb-head .s { font-size:12px; color:rgba(31,26,20,.55); }
.kfb-sheet .kfb-x { width:26px; height:26px; flex:0 0 26px; padding:0; border:0; background:none;
  color:#1f1a14; font:inherit; font-size:17px; line-height:1; cursor:pointer; opacity:.55;
  transition:opacity .18s, transform .18s; }
.kfb-sheet .kfb-x:hover { opacity:1; transform:scale(1.12); }
#kfb-ui { position:absolute; inset:0; z-index:12; pointer-events:none;
  font-family:'Baloo 2', system-ui, sans-serif; }
#kfb-gear { position:absolute; top:14px; right:16px; width:44px; height:44px; padding:0;
  border:0; background:transparent; cursor:pointer; pointer-events:auto; opacity:.72;
  transition:opacity .18s, filter .18s; filter:drop-shadow(0 2px 4px rgba(0,0,0,.45)); }
#kfb-gear:hover, #kfb-gear.an { opacity:1; }
#kfb-gear:focus-visible { outline:1px solid rgba(239,230,208,.6); outline-offset:3px; border-radius:6px; }

/* Nur Lage und Maße — Papier, Rahmen, Schatten und Schrift kommen aus .kfb-sheet (EINE Quelle). */
.kfb-set { position:absolute; top:66px; right:16px; width:min(960px, calc(100% - 32px));
  max-height:calc(100% - 96px); overflow-y:auto; overscroll-behavior:contain;
  pointer-events:auto; transform-origin:top right;
  transition:opacity .16s ease, transform .16s ease; }
.kfb-set[hidden] { display:block; opacity:0; transform:translateY(-6px) scale(.985); pointer-events:none; }
.kfb-set::-webkit-scrollbar { width:8px; }
.kfb-set::-webkit-scrollbar-thumb { background:rgba(239,230,208,.2); border-radius:8px; }

/* Kopfleiste der ganzen Karte — sie trägt den Namen und den Schließer, damit das Gitter
   darunter nur noch Abschnitte enthält. */
.kfb-set .kfb-head { position:sticky; top:0; z-index:2; display:flex; align-items:center;
  justify-content:space-between; gap:12px; padding:12px 14px 11px;
  background:linear-gradient(rgba(24,20,16,.97), rgba(24,20,16,.9)); }
.kfb-set .kfb-head .t { font-size:15px; font-weight:700; letter-spacing:.03em; color:#fbf3df; }
.kfb-set .kfb-head .s { font-size:12px; opacity:.55; }
.kfb-set .kfb-x { width:26px; height:26px; flex:0 0 26px; padding:0; cursor:pointer; color:inherit;
  background:none; border:0; border-radius:4px;
  font:inherit; font-size:17px; line-height:1; opacity:.55;
  transition:opacity .18s, transform .18s; }
.kfb-set .kfb-x:hover { opacity:1; transform:scale(1.12); }

/* Das Gitter: SPALTEN, kein Grid. Georg, 29.8.: „zugeklappte Container — untere müssen hochrücken,
   sonst scrollt man ewig". Ein Grid hält Reihen auf gleicher Höhe, ein zugeklappter Abschnitt
   hinterlässt also ein Loch. CSS-Spalten fließen: was oben schrumpft, zieht alles darunter nach. */
.kfb-set .kfb-grid { column-count:3; column-gap:12px; padding:12px; }
@media (max-width: 820px) { .kfb-set .kfb-grid { column-count:2; } }
@media (max-width: 560px) { .kfb-set .kfb-grid { column-count:1; } }
.kfb-set .kfb-grid > * { break-inside:avoid; -webkit-column-break-inside:avoid; margin:0 0 12px; }

/* ── v10 · Georg, 2.9.: "wo finde ich denn diesen terrain card regler?" ──────────────────
   Er hat 45 Sekunden gesucht und ihn nicht gefunden — der Regler heißt "Carpet: how many",
   gesucht hat er "terrain card". **Zwei verschiedene Fehler, die gleich aussehen:** ein Panel
   ohne Suche, und ein Regler, dessen Name nicht der Name der Sache ist.
   Das Suchfeld löst beide, weil es Namen UND Stichworte durchsucht: wer "terrain" tippt, findet
   den Teppich-Regler auch dann, wenn er weiter "Carpet" heißen würde. Eine Suche ist billiger
   als 110 richtig gewählte Namen — und verzeiht die, die falsch gewählt sind. */
.kfb-set .kfb-find { position:relative; flex:1 1 190px; min-width:130px; max-width:260px; }
.kfb-set .kfb-find input { width:100%; box-sizing:border-box; padding:6px 26px 6px 26px;
  font:inherit; font-size:12.5px; color:var(--ink); background:rgba(255,255,255,.62);
  border:1px solid rgba(31,26,20,.26); border-radius:5px; }
.kfb-set .kfb-find input::placeholder { color:rgba(31,26,20,.42); }
.kfb-set .kfb-find input:focus { outline:none; border-color:#8a3a1e; background:#fff; }
.kfb-set .kfb-find .lupe { position:absolute; left:8px; top:50%; transform:translateY(-50%);
  font-size:11px; opacity:.45; pointer-events:none; }
.kfb-set .kfb-find .leer { position:absolute; right:4px; top:50%; transform:translateY(-50%);
  width:20px; height:20px; padding:0; border:0; background:none; color:var(--ink);
  font:inherit; font-size:13px; line-height:1; cursor:pointer; opacity:.5; display:none; }
.kfb-set .kfb-find.aktiv .leer { display:block; }
.kfb-set .kfb-find .leer:hover { opacity:1; }
/* Beim Suchen gilt nur noch der Treffer: versteckte Zeilen und Abschnitte sind WEG, nicht
   ausgegraut — sonst sucht man im Ergebnis nochmal. Getroffene Abschnitte klappen auf.
   ⚠ **Hier stand eine Liste von Klassen — und sie war unvollständig** (Abnahme 2.9.). Die Regel
   nannte „kfb-row" und „kfb-note", aber nicht „kfb-info", „kfb-set-btn", „kfb-keys": bei der
   Suche nach „terrain" blieben 20 Zeilen stehen, von denen 4 Treffer waren, während der Zähler
   „4 rows" behauptete. Ein Filter, der eine Bauart nicht kennt, läßt sie durch und lacht dabei
   — dieselbe Falle, vor der die Funktion „unbekannt" weiter unten warnt.
   ⚠ **Und dieser Kommentar hat das Modul schon einmal getötet** — zum ZWEITEN Mal, mit demselben
   Griff: Code-Anführungen in einem Template-Literal sind hier ein Dateiende. Elf Zeilen weiter
   unten steht die Warnung davor, und ich habe sie beim Schreiben überlesen. In DIESEM String
   gibt es keine Backticks, nur „Gänsefüßchen".
   Also nach der STELLE filtern, nicht nach der Bauart: alles, was direkt im Rumpf eines
   Abschnitts sitzt. Eine künftige Zeilenart kann sich damit nicht mehr herausreden. */
.kfb-set.suchen .kfb-sec.aus, .kfb-set.suchen .kfb-sec > .body > .aus { display:none; }
.kfb-set .kfb-treffer { grid-column:1/-1; padding:10px 12px; font-size:12.5px;
  color:rgba(31,26,20,.6); }
.kfb-set .tr { background:rgba(240,197,90,.42); border-radius:2px; }

/* ⚠ **Jede eigene Klasse steht unter .kfb-set** — und der Knopf heißt .kfb-set-btn.
   Gemessen am 28.8.: .kfb-btn gehört dem Design-System (themes/kfb-med.css: Akzentfläche,
   Hover kippt und hebt), und dessen <link> mountet mit dem Helmet am STREAM-ENDE, also nach
   dem hier injizierten <style> — der Track-Knopf wurde damit rot und kollidierte mit der
   Panel-Semantik, in der Rot „aktiv" heißt. Ein Panel-Name darf nie ein Systemname sein.
   ⚠ Und: in DIESEM String ist ein Backtick ein Dateiende. Der Kommentar stand einmal mit
   Code-Anführungen hier und hat das Template-Literal mitten im Satz geschlossen — Modul tot,
   Import unerfüllt, kein Canvas, kein Runner. Ein Zeichen, die ganze Seite. */
.kfb-set .kfb-sec { background:rgba(239,230,208,.045); border:1px solid rgba(239,230,208,.12);
  border-radius:7px; overflow:hidden; }
.kfb-set .kfb-sec > button { display:flex; align-items:center; gap:9px; width:100%; padding:10px 13px;
  background:rgba(239,230,208,.06); border:0;
  color:#fbf3df; font:inherit; font-weight:700; font-size:15px;
  letter-spacing:.03em; cursor:pointer; text-align:left; }
.kfb-set .kfb-sec > button:hover { background:rgba(239,230,208,.12); }
.kfb-set .kfb-sec .car { width:9px; flex:0 0 9px; color:#d4553f; opacity:.9; transition:transform .16s; }
.kfb-set .kfb-sec.zu .car { transform:rotate(-90deg); }
.kfb-set .kfb-sec .body { padding:2px 14px 12px; display:flex; flex-direction:column; gap:11px; }
.kfb-set .kfb-sec.zu .body { display:none; }

.kfb-set .kfb-row { display:flex; flex-direction:column; gap:5px; }
.kfb-set .kfb-row .top { display:flex; align-items:baseline; justify-content:space-between; gap:10px; }
.kfb-set .kfb-row .lab { font-size:13px; opacity:.86; }
.kfb-set .kfb-row .val { font-size:12px; opacity:.62; font-variant-numeric:tabular-nums; white-space:nowrap; }

.kfb-set input[type=range] { -webkit-appearance:none; appearance:none; width:100%; height:14px;
  background:none; cursor:pointer; }
.kfb-set input[type=range]::-webkit-slider-runnable-track { height:3px; border-radius:3px;
  background:rgba(239,230,208,.24); }
.kfb-set input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:13px; height:13px;
  margin-top:-5px; border-radius:50%; background:#efe6d0; border:0; }
.kfb-set input[type=range]::-moz-range-track { height:3px; border-radius:3px; background:rgba(239,230,208,.24); }
.kfb-set input[type=range]::-moz-range-thumb { width:13px; height:13px; border:0; border-radius:50%; background:#efe6d0; }

.kfb-set .kfb-sw { position:relative; width:36px; height:19px; flex:0 0 36px; border:0; padding:0; cursor:pointer;
  border-radius:19px; background:rgba(239,230,208,.2); transition:background .16s; }
.kfb-set .kfb-sw::after { content:''; position:absolute; top:2px; left:2px; width:15px; height:15px; border-radius:50%;
  background:#efe6d0; transition:transform .16s; }
.kfb-set .kfb-sw.an { background:#b8352a; }
.kfb-set .kfb-sw.an::after { transform:translateX(17px); }
.kfb-set .kfb-row.line { flex-direction:row; align-items:center; justify-content:space-between; gap:12px; }

.kfb-set .kfb-seg { display:flex; gap:4px; }
.kfb-set .kfb-seg button { flex:1; padding:6px 4px; font:inherit; font-size:12px; color:inherit; cursor:pointer;
  background:rgba(239,230,208,.07); border:1px solid rgba(239,230,208,.14); border-radius:4px; }
.kfb-set .kfb-seg button.an { background:#b8352a; border-color:#b8352a; }

.kfb-set .kfb-set-btn { padding:8px 10px; font:inherit; font-size:13px; color:inherit; cursor:pointer; text-align:left;
  background:rgba(239,230,208,.07); border:1px solid rgba(239,230,208,.16); border-radius:4px;
  box-shadow:none; transform:none; }
.kfb-set .kfb-set-btn:hover { background:rgba(239,230,208,.13); }

.kfb-set .kfb-info { display:flex; justify-content:space-between; gap:10px; font-size:12.5px; }
.kfb-set .kfb-info .lab { opacity:.6; }
.kfb-set .kfb-info .val { font-variant-numeric:tabular-nums; text-align:right; }
.kfb-set .kfb-note { font-size:12px; opacity:.55; line-height:1.45; }
.kfb-set .kfb-keys { display:grid; grid-template-columns:auto 1fr; gap:4px 10px; font-size:12.5px; }
.kfb-set .kfb-keys b { font-weight:600; opacity:.9; }
.kfb-set .kfb-keys span { opacity:.62; }

/* Die zwei Messwert-Leisten sind ab jetzt Beiwerk: unsichtbar, bei Hover lesbar,
   vollständig im Panel. „Dezent verstecken/onHover" (Georg, 28.8.). */
#tv-meta { opacity:0; pointer-events:auto; transition:opacity .2s; }
#tv-meta:hover { opacity:.92; }
#kfb-badge { opacity:0; transition:opacity .2s; pointer-events:auto; }
#kfb-badge:hover { opacity:.92; }

/* ── v3c · Papier statt Rauchglas (Georg, 29.8.: „paper BG, schwarze font") ──
   Als Überschreibung am Ende, nicht als Umbau der Regeln oben: der Rückweg ist damit
   das Löschen EINES Blocks. Papier = Grundton + Körnung (SVG-Rauschen, 5,5 %) + ein
   Lichtverlauf von oben links; Tusche = #1f1a14, dieselbe Farbe wie die Ink-Outline der
   Karten. Rot bleibt „aktiv" — es ist die einzige Semantik, die das Panel kennt. */
.kfb-set { --ink:#1f1a14; }
.kfb-set .kfb-head { background:linear-gradient(rgba(241,231,207,.98), rgba(241,231,207,.88)); }
.kfb-set .kfb-head .t { color:#17120d; }
.kfb-set .kfb-head .s { color:rgba(31,26,20,.55); opacity:1; }
.kfb-set .kfb-x { background:none; border:0; color:var(--ink); }
.kfb-set .kfb-x:hover { background:none; }
.kfb-set .kfb-sec { background:rgba(255,252,244,.5); border-color:rgba(31,26,20,.18); }
.kfb-set .kfb-sec > button { background:rgba(31,26,20,.06); color:#17120d; }
.kfb-set .kfb-sec > button:hover { background:rgba(31,26,20,.12); }
.kfb-set .kfb-sec .car { color:#b8352a; opacity:1; }
.kfb-set .kfb-row .lab { color:var(--ink); opacity:.92; }
.kfb-set .kfb-row .val { color:#8a3a1e; opacity:1; }
.kfb-set input[type=range]::-webkit-slider-runnable-track { background:rgba(31,26,20,.22); }
.kfb-set input[type=range]::-webkit-slider-thumb { background:#1f1a14; }
.kfb-set input[type=range]::-moz-range-track { background:rgba(31,26,20,.22); }
.kfb-set input[type=range]::-moz-range-thumb { background:#1f1a14; }
.kfb-set .kfb-sw { background:rgba(31,26,20,.22); }
.kfb-set .kfb-sw::after { background:#f6efd9; box-shadow:0 1px 2px rgba(0,0,0,.28); }
.kfb-set .kfb-sw.an { background:#b8352a; }
.kfb-set .kfb-seg button { background:rgba(31,26,20,.05); border-color:rgba(31,26,20,.2); color:var(--ink); }
.kfb-set .kfb-seg button.an { background:#b8352a; border-color:#b8352a; color:#f6efd9; }
.kfb-set .kfb-set-btn { background:rgba(31,26,20,.05); border-color:rgba(31,26,20,.22); color:var(--ink); }
.kfb-set .kfb-set-btn:hover { background:rgba(31,26,20,.12); }
.kfb-set .kfb-info .lab { color:rgba(31,26,20,.62); opacity:1; }
.kfb-set .kfb-info .val { color:var(--ink); }
.kfb-set .kfb-note { color:rgba(31,26,20,.62); opacity:1; }

/* ── v10 · Georg, 2.9.: „walls of text und alles in schmaler spalte — will ich gar nicht lesen." ──
   Zwei Ursachen, zwei Antworten, beide generisch — kein einziger Abschnitt wird umgeschrieben:
   1 **Ein Erklärtext ist ab jetzt zugeklappt.** Sichtbar bleibt ein kleines „why?". Die Begründungen
     sind das Gedächtnis dieses Projekts und werden nicht gelöscht — sie sollen nur nicht die
     Spalte füllen, in der man etwas EINSTELLEN will. Eine Fußnote, kein Absatz.
   2 **Ein Abschnitt darf die Spalten überspannen** (Schema-Feld „weit"). Die Diagnose-Zeilen
     sind Sätze, keine Zahlen; in einer 300-px-Spalte brechen sie achtmal um. Weit gestellt
     lesen sie in einer Zeile, und der Rest des Panels bleibt dreispaltig. */
.kfb-set .kfb-note { display:flex; gap:8px; align-items:baseline; }
.kfb-set .kfb-note .txt { flex:1 1 auto; min-width:0; }
.kfb-set .kfb-note.zu .txt { display:none; }
.kfb-set .kfb-why { flex:0 0 auto; padding:0; border:0; background:none; cursor:pointer;
  font:inherit; font-size:10.5px; letter-spacing:.06em; text-transform:uppercase;
  color:#8a3a1e; opacity:.65; }
.kfb-set .kfb-why:hover { opacity:1; text-decoration:underline; }
.kfb-set .kfb-sec.weit { column-span:all; break-inside:auto; }
.kfb-set .kfb-sec.weit .body { display:grid; gap:9px 20px; align-items:start;
  grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); }
.kfb-set .kfb-sec.weit .kfb-note { grid-column:1 / -1; }
.kfb-set .kfb-info { align-items:baseline; }
.kfb-set .kfb-info .val { overflow-wrap:anywhere; white-space:pre-wrap; }
.kfb-set .kfb-info.lang { flex-wrap:wrap; gap:2px 8px; }
.kfb-set .kfb-info.lang .val { flex:1 1 100%; order:3; text-align:left; }

/* Der dritte Textträger in derselben Spalte: der Wert NEBEN einem Regler. Er trug „nowrap",
   damit „0,52 u" nicht umbricht — und wurde damit bei Sätzen wie „source · peak per curtain
   0,44 · night weight 1,00" am Abschnittsrand abgeschnitten. Ohne Hinweis, ohne „more": er
   scheitert STILL, und das ist schlimmer als eine lange Zeile. Der Umbruch gehört eine Ebene
   höher (auf .top), dann bleiben kurze Zahlen weiter rechtsbündig in ihrer eigenen Zeile. */
.kfb-set .kfb-row .top { flex-wrap:wrap; }
.kfb-set .kfb-row .val { white-space:normal; overflow-wrap:anywhere; }

/* v10 · Georg, 2.9.: „es werden HUD-Elemente (hellblau) als ausgewählt markiert".
   Ursache: der Bericht-Zettel wählt sein Textfeld vor (damit ⌘C ohne Berechtigung geht) — und
   ab da färbt jeder Zieh-Klick auf dem Schirm HUD-Text blau, weil an der Oberfläche nichts
   steht, das Textauswahl verbietet. Ein HUD ist keine Seite: man liest es, man markiert es nicht.
   Ausgenommen bleibt, was wirklich Text ist — das Berichtsfeld selbst. */
#kfb-ui, .kfb-hud, .kfb-sheet { -webkit-user-select:none; user-select:none; }
#kfb-ui textarea, #kfb-ui input, .kfb-sheet textarea, textarea.kfb-bericht {
  -webkit-user-select:text; user-select:text; }
.kfb-set .kfb-keys b { color:#17120d; opacity:1; }
.kfb-set .kfb-keys span { color:rgba(31,26,20,.68); opacity:1; }
.kfb-set::-webkit-scrollbar-thumb { background:rgba(31,26,20,.28); }
`;

function el(tag, cls, txt) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
}

export function createSettingsPanel(o = {}) {
  if (!document.getElementById('kfb-set-css')) {
    const st = el('style');
    st.id = 'kfb-set-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  const root = el('div', 'kfb-set kfb-sheet');
  root.hidden = true;
  const updaters = [];

  // Kopfleiste über dem Gitter: Name, Hinweis, Schließer.
  const head = el('div', 'kfb-head');
  const headL = el('div');
  headL.appendChild(el('div', 't', o.title || 'Einstellungen'));
  headL.appendChild(el('div', 's', o.subtitle || 'G schließt · Esc schließt'));
  head.appendChild(headL);
  // Suchfeld: es steht zwischen Titel und Schließer, weil es der zweithäufigste Griff ist —
  // öffnen, tippen, drehen. Autofocus wäre falsch: G öffnet das Panel, und wer danach W drückt,
  // will fliegen, nicht "w" ins Suchfeld schreiben.
  const find = el('div', 'kfb-find');
  find.appendChild(el('span', 'lupe', '⌕'));
  const findInp = document.createElement('input');
  findInp.type = 'search';
  findInp.placeholder = 'Suche … (z. B. terrain, wasser)';
  findInp.spellcheck = false;
  find.appendChild(findInp);
  const findX = el('button', 'leer', '✕');
  findX.type = 'button';
  findX.title = 'Suche leeren';
  find.appendChild(findX);
  head.appendChild(find);
  const xBtn = el('button', 'kfb-x', '✕');
  xBtn.type = 'button';
  xBtn.title = 'Schließen';
  head.appendChild(xBtn);
  root.appendChild(head);
  const grid = el('div', 'kfb-grid');
  root.appendChild(grid);

  function slider(r) {
    const row = el('div', 'kfb-row');
    const top = el('div', 'top');
    top.appendChild(el('span', 'lab', r.label));
    const val = el('span', 'val');
    top.appendChild(val);
    const inp = document.createElement('input');
    inp.type = 'range';
    inp.min = r.min; inp.max = r.max; inp.step = r.step != null ? r.step : 0.01;
    // ⚠ **Ein Bedienelement darf die Welt nicht mit sich reissen.** Am 29.8. hat ein Formatierer
    // für einen Parameter, den es nicht mehr gab, `undefined.toFixed` gerufen — und weil das Panel
    // im `try` von `start()` gebaut wird, starb der ganze Runner: kein Canvas, keine Schleife,
    // hellblauer Schirm. Ein Diagnosewerkzeug, das die Sache tötet, die es beobachten soll, ist
    // der schlechteste mögliche Tausch.
    // Deshalb hält jede Zeile ihren eigenen Fehler AUS und sagt ihn AN: `⚠ no value` statt
    // Weltuntergang. Und der Name des Reglers steht dabei, damit der Befund lesbar ist, ohne in
    // die Konsole zu schauen (Georg kann das nicht — S7c).
    const show = () => {
      try {
        const v = r.get();
        if (v == null || (typeof v === 'number' && !Number.isFinite(v))) {
          val.textContent = '⚠ no value'; return;
        }
        inp.value = v;
        val.textContent = r.fmt ? r.fmt(v) : (+v).toFixed(2);
      } catch (e) {
        val.textContent = '⚠ ' + ((e && e.message) || 'error');
        row.style.opacity = '.55';
      }
    };
    inp.addEventListener('input', () => { r.set(parseFloat(inp.value)); show(); });
    row.appendChild(top); row.appendChild(inp);
    updaters.push(show); show();
    return row;
  }
  function toggle(r) {
    const row = el('div', 'kfb-row line');
    row.appendChild(el('span', 'lab', r.label));
    const sw = el('button', 'kfb-sw');
    sw.type = 'button';
    const show = () => { try { sw.classList.toggle('an', !!r.get()); } catch (e) { row.style.opacity = '.55'; } };
    sw.addEventListener('click', () => { try { r.set(!r.get()); } catch (e) {} show(); });
    row.appendChild(sw);
    updaters.push(show); show();
    return row;
  }
  function seg(r) {
    const row = el('div', 'kfb-row');
    const top = el('div', 'top');
    top.appendChild(el('span', 'lab', r.label));
    row.appendChild(top);
    const box = el('div', 'kfb-seg');
    const btns = r.options.map((op) => {
      const b = el('button', null, op.l);
      b.type = 'button';
      b.addEventListener('click', () => { r.set(op.v); show(); });
      box.appendChild(b);
      return { b, v: op.v };
    });
    const show = () => { try { const cur = r.get(); btns.forEach((x) => x.b.classList.toggle('an', x.v === cur)); } catch (e) { row.style.opacity = '.55'; } };
    row.appendChild(box);
    updaters.push(show); show();
    return row;
  }
  function button(r) {
    const b = el('button', 'kfb-set-btn', r.label);
    b.type = 'button';
    b.addEventListener('click', () => { r.onClick(); refresh(); });
    return b;
  }
  /** v10 · Eine Info-Zeile faltet sich SELBST, wenn ihr Wert ein Satz ist statt einer Zahl.
   *  Georg, 2.9.: „der Diagnostik-Klapper ist kognitiver und visueller Overkill". Er hat recht,
   *  und die Ursache ist keine einzelne Zeile, sondern eine Mischung: zwischen zwölf Zahlen
   *  stehen fünf Sätze, und die Sätze gewinnen optisch. Statt das Schema umzuschreiben (350
   *  Zeilen, jede mit ihrer Geschichte) entscheidet die Zeile es hier, an EINER Stelle: bis
   *  GRENZE Zeichen steht sie ganz da, darüber steht ihr Anfang plus „more". Nichts geht
   *  verloren, nichts drängt sich auf — und der Kopier-Knopf liefert ohnehin alles ungekürzt,
   *  denn so liest Georg diese Werte tatsächlich. */
  const INFO_GRENZE = 84;
  function info(r) {
    const row = el('div', 'kfb-info');
    row.appendChild(el('span', 'lab', r.label));
    const val = el('span', 'val');
    const mehr = el('button', 'kfb-why', 'more');
    mehr.type = 'button';
    let auf = false;
    mehr.addEventListener('click', () => { auf = !auf; mehr.textContent = auf ? 'less' : 'more'; show(); });
    // Die Info-Zeilen sind die Diagnose selbst — hier ist ein Fangkorb am wichtigsten: ein
    // Report-Getter, der auf ein umgebautes Modul zeigt, würde sonst das Panel mitnehmen, das
    // genau diesen Umbau sichtbar machen soll.
    const show = () => {
      let t;
      try { t = String(r.get()); } catch (e) { t = '⚠ ' + ((e && e.message) || 'error'); }
      const lang = t.length > INFO_GRENZE;
      mehr.style.display = lang ? '' : 'none';
      row.classList.toggle('lang', lang);
      val.textContent = (lang && !auf) ? t.slice(0, INFO_GRENZE).replace(/\s+\S*$/, '') + ' …' : t;
    };
    row.appendChild(val); row.appendChild(mehr);
    updaters.push(show); show();
    return row;
  }
  function keys(r) {
    const box = el('div', 'kfb-keys');
    for (const [k, t] of r.pairs) { box.appendChild(el('b', null, k)); box.appendChild(el('span', null, t)); }
    return box;
  }
  /** v10 · Ein `note` ist eine Fußnote, kein Absatz — zugeklappt, bis jemand „why?" drückt.
   *  Der Grund steht im CSS-Block unten. Nichts wird gelöscht, nur nichts mehr aufgedrängt. */
  function note(r) {
    const d = el('div', 'kfb-note zu');
    const b = el('button', 'kfb-why', 'why?');
    b.type = 'button';
    b.addEventListener('click', () => { b.textContent = d.classList.toggle('zu') ? 'why?' : 'less'; });
    d.appendChild(b);
    d.appendChild(el('span', 'txt', r.text));
    return d;
  }

  /** ⚠ **Eine unbekannte Zeilenart wird SICHTBAR, nicht verschwiegen.**
   *  Bis 30.8. stand unten `if (make) body.appendChild(make(r))` — eine Zeile mit unbekanntem
   *  `kind` fiel damit lautlos aus: kein Fehler, keine Warnung, kein Eintrag im Panel. Genau so ist
   *  die Stimmungs-Auswahl von Slice H verschwunden (ich hatte `kind: 'select'` geschrieben, und
   *  diese Art gibt es hier nicht — die Auswahl heißt `seg`). Gefunden wurde es beim ABLESEN des
   *  Panels, nicht beim Schreiben; ohne das Ablesen hätte ich ein Feature gemeldet, das nicht da war.
   *  *Ein Register, das unbekannte Schlüssel ignoriert, ist ein Tippfehler-Verstecker.* */
  function unbekannt(r) {
    const d = el('div', 'kfb-row line');
    d.appendChild(el('span', 'lab', r.label || '(no label)'));
    d.appendChild(el('span', 'val', '✗ unknown row kind "' + r.kind + '" — known: '
      + Object.keys(KIND).join(', ')));
    d.style.opacity = '1';
    return d;
  }

  const KIND = { slider, toggle, seg, button, info, keys, note };

  // Der Suchindex: je Zeile ihr Element, ihr Abschnitt und der Text, der sie findbar macht —
  // Label, Abschnittstitel und optionale `tags`. Er wird beim Bauen gefüllt, nicht beim Suchen
  // aus dem DOM gelesen: `kfb-row` trägt Werte, die sich zweimal pro Sekunde ändern.
  const index = [];
  for (const s of (o.schema || [])) {
    const sec = el('div', 'kfb-sec' + (s.open ? '' : ' zu') + (s.weit ? ' weit' : ''));
    const secHead = el('button');
    secHead.type = 'button';
    const car = el('span', 'car', '▾');
    secHead.appendChild(car);
    secHead.appendChild(el('span', null, s.title));
    secHead.addEventListener('click', () => sec.classList.toggle('zu'));
    const body = el('div', 'body');
    for (const r of s.rows) {
      const make = KIND[r.kind] || unbekannt;
      const node = make(r);
      body.appendChild(node);
      index.push({ node, sec,
        wort: ((r.label || '') + ' ' + (r.tags || '') + ' ' + s.title).toLowerCase() });
    }
    sec.appendChild(secHead); sec.appendChild(body);
    sec._body = body;
    sec._zuVorher = sec.classList.contains('zu');
    grid.appendChild(sec);
  }

  /** Suchen. Ein Wort je Zeile muß vorkommen (UND) — "terrain karte" findet die Zeile, die
   *  beides trägt, nicht jede, die eines trägt. Getroffene Abschnitte klappen auf; beim Leeren
   *  geht jeder Abschnitt in den Zustand zurück, in dem er vor der Suche war. */
  const treffer = el('div', 'kfb-treffer');
  treffer.hidden = true;
  grid.parentNode.insertBefore(treffer, grid);
  function suchen(q) {
    const worte = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    find.classList.toggle('aktiv', !!worte.length);
    root.classList.toggle('suchen', !!worte.length);
    if (!worte.length) {
      treffer.hidden = true;
      for (const e of index) { e.node.classList.remove('aus'); e.sec.classList.remove('aus'); }
      for (const sec of grid.children) sec.classList.toggle('zu', !!sec._zuVorher);
      return;
    }
    const secTreffer = new Set();
    let n = 0;
    for (const e of index) {
      const hit = worte.every((w) => e.wort.includes(w));
      e.node.classList.toggle('aus', !hit);
      if (hit) { n++; secTreffer.add(e.sec); }
    }
    for (const sec of grid.children) {
      const hit = secTreffer.has(sec);
      sec.classList.toggle('aus', !hit);
      if (hit) sec.classList.remove('zu');
    }
    treffer.hidden = false;
    treffer.textContent = n
      ? n + ' row' + (n === 1 ? '' : 's') + ' in ' + secTreffer.size + ' section'
        + (secTreffer.size === 1 ? '' : 's')
      : 'Nothing found for „' + q.trim() + '“ — try: terrain, card, water, light, mech, wind';
  }
  findInp.addEventListener('input', () => suchen(findInp.value));
  findInp.addEventListener('keydown', (e) => {
    e.stopPropagation();   // sonst lenkt das Tippen den Träger
    if (e.key === 'Escape') { findInp.value = ''; suchen(''); findInp.blur(); }
  });
  findX.addEventListener('click', () => { findInp.value = ''; suchen(''); findInp.focus(); });

  function refresh() { for (const u of updaters) { try { u(); } catch (e) {} } }

  // ⚠ **Der Anfangszustand muss AM ELEMENT stehen, nicht nur in der Variablen** (Georg, 3.9.:
  // „intro-sequenz zeigt settings statt globe"). `offen` stand seit v2 auf `false`, aber das
  // Attribut `hidden` wurde erst in `setOpen()` geschrieben — und das ruft niemand beim Bauen.
  // Die CSS-Regel hängt an `.kfb-set[hidden]`; ohne Attribut greift sie nicht, und das Panel stand
  // ab dem ersten Bild offen über der Startansicht. **Eine Variable, die einen Zustand behauptet,
  // den das DOM nicht kennt, ist keine Wahrheit, sondern eine Absicht.**
  let offen = false, timer = 0;
  root.hidden = true;
  // ⚠ **Bei geschlossenem Panel laufen die Leser NICHT — und das ist Absicht, nicht Vergessen.**
  // Eine Abnahme hat das 2.9. als Nebenbefund gemeldet: bei zugeklapptem Panel stand noch
  // „carpets off", obwohl 24 Teppiche standen. Die Zeilen waren Bauzeit-Stände.
  // Trotzdem bleibt es so: unter den ~110 Info-Zeilen stecken teure Leser — `streuungTor` zieht
  // 1200 Feldproben, die Prüfstand-Zeilen lesen die halbe Szene. Zweimal pro Sekunde im
  // Hintergrund wäre ein Messgerät, das die Bildrate misst, indem es sie senkt.
  // **Wer von außen liest (Konsole, Abnahme), ruft `__globe.panel.refresh()` — eine Zeile.**
  // Das ist der Preis dafür, dass die Diagnose nichts kostet, solange niemand hinsieht.
  function setOpen(on) {
    offen = !!on;
    root.hidden = !offen;
    if (offen) { refresh(); if (!timer) timer = setInterval(refresh, 500); }
    else if (findInp.value) { findInp.value = ''; suchen(''); }   // sonst öffnet es gefiltert
    else if (timer) { clearInterval(timer); timer = 0; }
    if (o.onOpen) o.onOpen(offen);
  }
  xBtn.addEventListener('click', () => setOpen(false));

  return {
    name: 'settings-panel', el: root, refresh, setOpen,
    /** Panel öffnen UND auf ein Stichwort filtern — für Onboarding-Verweise ("wo ist X?"). */
    find(q) { setOpen(true); findInp.value = q || ''; suchen(findInp.value); },
    get open() { return offen; },
    toggle() { setOpen(!offen); },
    dispose() { if (timer) clearInterval(timer); root.remove(); },
  };
}
