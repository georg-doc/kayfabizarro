/* ============================================================================
   card-rail-v9b.js — KFB Overworld v9-B · die rechte Spalte ist ein Kartenspiel
   ---------------------------------------------------------------------------
   Stand 9.8. (dritter Durchgang, Georgs Befund am Bild):

   1 **EINE Sichtbarkeit für alles.** Die Aktionskarten waren richtig — der Rest
     war zu leise. `--r9op` ist jetzt dieselbe Zahl für Statleiste, Insel, Stapel
     und v7s eigenes Möbel; nur Zeigerkontakt und Kampf heben sie.
   2 **Die Statleiste ist ein Blatt** wie alles andere: Papier, Kanon-Kante,
     dieselbe normierte Feder — nur flach und breit, als Kopfleiste.
   3 **Stapel statt Reihe.** Almanach (Actor + Szenen) liegt unten rechts
     HINTEREINANDER; bei Zeigerkontakt fächert er nach OBEN auf und wird groß.
     Der Quest-Log unter der Insel folgt derselben Regel, nur nach UNTEN.
   4 **Tusche überall, EINE Federstärke** (`inkGain()` normiert die Kanon-Feder
     auf eine absolute Breite — sonst ist sie auf dem Fenster ein Balken und auf
     der Minikarte ein Haar). Jedes Blatt mit eigenem Seed, nichts wiederholt sich.
   5 **Karten nur mit Kante, kein Gutter** (`OVERSCAN` frisst den gedruckten
     Kartenrahmen weg). Schwarze Rollen-Stempel bleiben geparkt.
   6 **Statmodell nach Living Concept §38:** Fluff ist HP und abgeleitet, die
     sechs fraktalen Werte sind das Profil, POP die Währung.

   Nicht-invasiv: v8 lädt dieses Skript nicht, `overworld/` bleibt geteilt.

   KLICK-KONZEPT: HUD gegen Welt wird an EINER Stelle entschieden — eine Torwache in der
   Fangphase am Shadow-Root. Die fünf Regeln stehen im Rumpf bei `UI_SEL`.
   ============================================================================ */
(function () {
'use strict';
const INKC = '#1f1a14', CREAM = '#f2e8cf', PAPER = '#efe2c4';
const AR = 1.74;                 // cardbuilder/kfb-card-format.js
const SEA = '#2a686e', LAND = [104, 140, 74], SAND = [196, 176, 118];
const NEED = 3;                  // so viele Szenen-Karten will der König hören
const OVERSCAN = 1.055;          // frisst den gedruckten Kartenrahmen weg — kein Gutter
const REF_MIN = 340;             // Bezugsgröße der Feder, in Gerätepixeln — siehe inkGain()
const PEEK = 22;                 // wie weit ein Blatt im Stapel hervorschaut (px) — genug fuer das Motiv
const GAP = 9;                   // aufgefächert: Luft ZWISCHEN den Blättern, kein Überlapp
let canon = null;
/* Die eigene Adresse, einmal am Modulkopf gelesen: `document.currentScript` gilt nur, solange die
   Datei läuft — in `install()` ist sie längst null. Daraus kommt der Ordner der RPG-Symbole,
   damit die Seite sie auch aus einem Unterordner heraus findet. */
const SELF = (document.currentScript && document.currentScript.src) || '';
const ICON_BASE = SELF ? SELF.replace(/[^/]*$/, '') + 'icons-rpg/' : 'overworld/icons-rpg/';

/* Living Concept §38 — sechs fraktale Kampfwerte, Fluff ist ihre Summe, POP die Währung.
   `from` sagt, woher der Wert HEUTE kommt: `hero` führt der Runner, `rail` liegt hier, bis der
   Runner ihn führt. Keine erfundene Zahl. */
const STATS = [
  { id: 'bizarro',   ab: 'BZ', kanon: 'Biz', label: 'Bizarro',     from: 'hero', col: '#c4402f',
    hint: 'how hard the world bends when you push' },
  { id: 'kayfabe',   ab: 'KF', kanon: 'Kay', label: 'Kayfabe',     from: 'hero', col: '#7b3fa8',
    hint: 'charges \u2014 what an act costs to play' },
  { id: 'bingo',     ab: 'BI', kanon: 'Bin', label: 'KayfaBingo',  from: 'hero', col: '#c8622a',
    hint: 'calling the pattern before it lands' },
  { id: 'bongo',     ab: 'BO', kanon: 'Bon', label: 'KayfaBongo',  from: 'hero', col: '#a8862b',
    hint: 'keeping the beat when the room turns' },
  { id: 'boggle',    ab: 'BG', kanon: 'Bog', label: 'KayfaBoggle', from: 'hero', col: '#3f7fa8',
    hint: 'rearranging what everyone already saw' },
  { id: 'bloedsinn', ab: 'BS', kanon: 'Bl\u00f6', label: 'BL\u00d6DSINN!', from: 'hero', col: '#1b8476',
    hint: 'the nonsense that turns out to be true' },
];

/* **Das Kürzel gehört dem Runner, wenn er es führt — sonst dem Glossar** (10.8., WS0-Regel).
   Drei Buchstaben, weil ein Schnitt aus dem Etikett bei KayfaBingo/-Bongo/-Boggle/Kayfabe **viermal
   »Kay«** ergäbe. Unsere Zwei-Buchstaben-Kürzel (`BZ KF BI BO BG BS`) fallen weg.
   `game` ist **kein** Global — er wird in `install(game, sh)` hereingereicht; eine Suche auf
   `window.game` läuft ins Leere und fällt still auf den alten Wert zurück. Deshalb wird er
   übergeben, nicht gesucht. */
function kurz(s, game) {
  const e = game && game.STAT_INFO && game.STAT_INFO[s.id];
  return (e && (e.short || e.kurz)) || s.kanon || s.ab;
}

const CSS = `
/* ACHTUNG: dieser Block ist ein Template-Literal — KEINE Backticks in den Kommentaren.
   Zweimal hat ein zitierter Bezeichner das Literal beendet und das ganze Modul lahmgelegt. */
.v7{--r9w:clamp(150px,15vw,196px);--r9op:.78;--r9opCards:.92;--r9ic:40px;
  --e9:cubic-bezier(.4,0,.2,1);--e9in:cubic-bezier(.4,0,.2,1)}
/* v12-H5 · EIN Polster für alle Ecken (Georg 12.8.: »sollte nicht direkt am linken Rand kleben
   → globales Padding für UI-Elemente«). v7 führt die Zahl bereits als --pad und alle vier Ecken
   hängen daran — sie war nur zu klein (8–13 px). Eine Zahl, ein Ort, alle Ecken. */
.v7{--pad:clamp(13px,1.5vw,22px)}
/* EINE Sichtbarkeit. Die Aktionskarten geben sie vor, alles andere folgt. */
.v7 .amb{opacity:var(--r9op)}
.v7-hero,.v7-nav .side{display:none!important}
.v7-nav canvas.map{display:none!important}
.v7-nav .mapw{display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex:none}
/* v7 wirft bei jeder gesicherten Karte ein Blatt zum Almanach-Stapel. Der Stapel ist bei uns
   versteckt, also flog es nach 0/0 — die Karte, die oben links wegfliegt. Das Feedback macht
   jetzt der eigene Stapel (er baut sich neu und fächert), der Wurf ist damit doppelt und geht. */
.v7-fly{display:none!important}
/* Schliessknopf: kein Kasten, kein Schrift-Kreuz — das Tiny-Swords-Blatt, in derselben Groesse
   wie alle anderen Knoepfe, mit denselben Zustaenden (Ruhe, Zeiger, Druck). */
.v7 .icobtn.close{width:var(--r9ic);height:var(--r9ic);padding:0;border:0!important;
  background-color:transparent!important;box-shadow:none!important;border-radius:0!important;
  font-size:0;color:transparent;cursor:pointer;opacity:.82;
  background-image:var(--r9x);background-size:contain;background-repeat:no-repeat;
  background-position:center;image-rendering:pixelated;
  transition:opacity .3s var(--e9),transform .3s var(--e9);
  filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}
.v7 .icobtn.close:hover{opacity:1;transform:scale(1.08)}
.v7 .icobtn.close:active{transform:scale(.94);transition-duration:.1s}
/* Das Handkonfig-Feld war auf eine Zeile gequetscht. Es ist KEIN pre, sondern ein div.slab — und
   der Fehler liegt nicht an ihm, sondern am Rumpf: der scrollt selbst und ist eine Flex-Spalte,
   also nimmt der Algorithmus das fehlende Maß beim einzigen Kind mit eigenem overflow heraus
   (min-height:auto wird dort 0). Gemessen: 19 px sichtbar bei 730 px Inhalt. Deshalb bekommt JEDES
   Kind im Rumpf seine Eigenhöhe — gescrollt wird der Rumpf, nicht das Feld. */
.v7 .v7-box .wb>*{flex:none;min-height:0}
/* Auch das Reisetagebuch des Runners schließt mit dem Tuscheblatt statt mit dem Wort »close« —
   zwei Schließsprachen in einem Bild sind eine zu viel. */
.diary .close,.after .close{width:var(--r9ic,40px);height:var(--r9ic,40px);padding:0;flex:none;
  border:0!important;background-color:transparent!important;box-shadow:none!important;
  border-radius:0!important;font-size:0;color:transparent;cursor:pointer;opacity:.82;
  background-image:var(--r9x);background-size:contain;background-repeat:no-repeat;
  background-position:center;image-rendering:pixelated;
  transition:opacity .3s var(--e9),transform .3s var(--e9)}
.diary .close:hover,.after .close:hover{opacity:1;transform:scale(1.08)}
.diary .close:active,.after .close:active{transform:scale(.94);transition-duration:.1s}
/* == Zeremonie: ziehen, ansehen, annehmen ==
   Die Karten kommen vom Ruecken-Stapel auf der Insel, nicht aus dem Nichts. */
.r9stage{position:absolute;inset:0;z-index:20;pointer-events:auto;
  background:rgba(12,9,6,.42);opacity:0;transition:opacity .5s var(--e9)}
.r9stage.on{opacity:1}
.r9deckpile{position:absolute;pointer-events:none}
.r9deckpile canvas,.r9deckpile img{position:absolute;left:0;top:0;width:100%;height:100%;
  filter:drop-shadow(0 2px 5px rgba(0,0,0,.4))}
.r9fly{position:absolute;transform-origin:50% 50%;pointer-events:none;
  filter:drop-shadow(0 6px 14px rgba(0,0,0,.45));
  transition:left .9s var(--e9),top .9s var(--e9),width .9s var(--e9),
    height .9s var(--e9),transform .9s var(--e9),opacity .5s var(--e9)}
.r9fly canvas{display:block;width:100%;height:100%}
.r9fly.pick{cursor:pointer;pointer-events:auto}
.r9fly.dim{opacity:.5}
.r9ask{position:absolute;left:50%;bottom:12%;transform:translateX(-50%);z-index:22;
  display:flex;flex-direction:column;align-items:center;gap:11px;
  opacity:0;transition:opacity .45s var(--e9) .25s}
.r9ask.on{opacity:1}
.r9ask p{margin:0;font-family:'Special Elite',ui-monospace,monospace;font-size:14px;
  color:#f7eed8;text-shadow:0 2px 0 #1f1a14;letter-spacing:.02em}
.r9ask .row{display:flex;gap:11px}
.r9ask button{font-family:'Special Elite',ui-monospace,monospace;font-size:12px;letter-spacing:.06em;
  padding:8px 16px;border:0;cursor:pointer;color:#241d15;background:#efe2c4;
  box-shadow:0 0 0 2px #1f1a14;transition:transform .28s var(--e9),background .28s var(--e9)}
.r9ask button:hover{background:#f7eed8;transform:translateY(-2px)}
.r9ask button:active{transform:translateY(0) scale(.97);transition-duration:.1s}
.r9ask button.hot{background:#8c3a1e;color:#f7eed8}
.r9ask button.hot:hover{background:#a2451f}
/* Tiny-Swords-Knöpfe: freistehend, ohne Kasten. Sie stehen als EINE Reihe unter der Insel —
   Peilung, Ton, Einstellungen — und geben die Flucht vor, an der Nearest-Leiste und Quest-Stapel
   ausgerichtet sind: alle vier Blöcke teilen dieselbe rechte Kante. */
.v7-nav .cog{display:none!important}
.r9ico{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex:none}
/* ── v11-H6 · Die rechte Spalte nach dem Mockup ─────────────────────────────────
   Vorher: Insel · Zieltitel · drei Knöpfe · Quest-Stapel — vier Zeilen, und die Knöpfe standen als
   Riegel zwischen zwei Dingen, die zusammengehören. Jetzt:

     [ Ton · Einstellungen ]  [ INSEL ]     ← eine Reihe, die Knöpfe links neben der Karte
                              [ Zieltitel ] ← so breit wie die Insel, linke Kanten fluchten
     [ Peilung ]                            ← links bündig mit der Inselkante
                              [ Quest-Fächer ] ← rückt hoch, weil der Riegel weg ist

   Die beiden seltenen Griffe (Ton, Einstellungen) sitzen oben außerhalb der Karte, wo sie niemandem
   im Weg sind; der häufige (Peilung zum nächsten Ziel) bleibt in der Spalte und ist jetzt links
   bündig statt rechts eingerückt. Georgs Mockup zeigt genau das. */
/* Die Knöpfe stehen AUSSERHALB des Flusses (rechts:100% = links neben der Reihe). Sonst wächst die
   ganze rechte Spalte um ihre Breite — gemessen: die Zieltafel wurde 240 statt 144 px breit, und
   ihre linke Kante fluchtete mit den Knöpfen statt mit der Insel. Genau die Stufe, die im Mockup
   weggeschoben ist. Absolut gesetzt bestimmt die Insel allein die Spaltenbreite, und alles darunter
   (Zieltafel, Peilung, Quest-Fächer) fluchtet mit ihr. */
.r9top{position:relative;display:flex;align-items:flex-start;justify-content:flex-end;gap:9px}
/* Enger als die übrigen Knopfreihen: zwei Schalter, die zusammengehören, sind ein Paar und keine
   Reihe. 3 px statt 7 (Georg: »die sollen enger gesetzt werden«). */
.r9top .r9ico{position:absolute;right:100%;top:0;margin-right:9px;gap:3px;padding-top:2px}
.r9aim{width:100%;justify-content:flex-start}
/* ── v11-H8 · Peilung und Quest-Fächer in EINER Zeile ───────────────────────────
   Die Knöpfe sind nach oben gewandert, also ist unter der Zieltafel eine Zeilenhöhe frei geworden —
   und der Fächer stand trotzdem eine Zeile tiefer, weil die Peilung allein eine ganze Zeile für
   sich hatte. Ein Knopf links und ein Kartenstapel rechts brauchen aber keine zwei Zeilen: sie
   teilen eine, wie im Mockup. Damit rückt der Fächer um 45 px nach oben und schließt an die Tafel
   an, statt in der Landschaft zu hängen. */
/* Insel und Zieltafel sind EINE Einheit (5 px Abstand, der Spaltenabstand). Was darunter kommt,
   gehört nicht mehr dazu — also der doppelte Abstand, damit die Fuge zwischen den Gruppen größer
   ist als die innerhalb einer Gruppe. 5 + 7 = 12 (Georg: »ungefähr der doppelte Abstand«). */
.r9row2{display:flex;align-items:flex-start;justify-content:space-between;gap:9px;width:100%;
  margin-top:7px}
.r9row2 .r9aim{width:auto;flex:none}
.r9row2 .r9qpile{flex:none}
.r9ico button{width:var(--r9ic);height:var(--r9ic);padding:0;border:0;background:transparent;
  cursor:pointer;opacity:var(--r9op);
  transition:opacity .3s var(--e9) .1s,transform .3s var(--e9) .1s;
  filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))}
.r9ico button:hover{opacity:1;transform:translateY(-2px) scale(1.06)}
.r9ico button:active{transform:translateY(0) scale(.96);transition-delay:0s}
.r9ico img{display:block;width:100%;height:100%;image-rendering:pixelated}
.r9ico button.off img{filter:grayscale(1) brightness(1.25);opacity:.6}
/* Der Peilknopf dreht nur SEIN Blatt, nicht den Knopf — sonst würde der Hover-Hub mitrotieren. */
.r9ico button.aim img{transform:rotate(var(--a,0deg));transition:transform .7s var(--e9)}
.v7-stack{display:none!important}
.v7.fight .amb,.v7.fight .r9c,.v7.fight .r9stat,.v7.fight .r9near{opacity:1}
/* ── Das Logbuch ist standardmäßig WEG (Georg, 9.8.) ──
   v7 führt dafür schon ein Signal: idle geht nach neun ruhigen Sekunden an und bei jeder neuen
   Zeile wieder aus. Das ist genau »zeig dich bei Meldungen, geh bei Ruhe« — also wird es benutzt,
   statt ein zweites Signal danebenzustellen. Neu ist nur: aus heißt AUS (nicht gedämpft), der
   Ausklang ist lang, und Kampf oder eine Eingabe des Spielers wecken es ebenfalls.
   pointer-events bleibt aus: ein Logbuch, das Klicks auf die Welt frisst, wäre teurer als eins,
   das man nicht anfassen kann. */
.v7 .v7-log{transition:opacity 1.9s ease}
/* v12-H3b · Das Logbuch SPRINGT nicht mehr (Georg 12.8.). v7 legt auf den Ruhezustand ein
   translateX(-10px) — beim Erscheinen rutschte es also seitlich herein. Zwei Gründe, es zu
   nehmen: es ruckt im Bild, und es verschiebt sein eigenes Rechteck, während der Zeiger daran
   gemessen wird — daraus wird ein Flackern, das sich selbst antreibt (siehe die Nähe unten).
   Es blendet jetzt, es fährt nicht. */
.v7 .v7-log.idle{transform:none}
/* v12-H11 · Das Logbuch ist so hoch wie sein Inhalt (Georg 12.8.). v7 gibt der Zeilenspalte eine
   FESTE Höhe (min(19vh,108px)) und schiebt den Text mit flex-end nach unten — bei zwei Meldungen
   steht darüber leeres Papier. Eine feste Höhe ist hier auch gar nicht nötig: was oben hinausläuft,
   ist Vergangenheit, und dafür reicht eine OBERGRENZE. */
.v7 .v7-log .lines{height:auto;max-height:min(19vh,108px)}
.v7.r9liftlog .v7-log .lines{height:auto;max-height:min(12vh,72px)}
.v7 .v7-log.idle{opacity:0}
.v7 .v7-log:hover,.v7 .v7-log.r9hot,.v7.fight .v7-log{opacity:var(--r9op);transition:opacity .2s ease}
/* Eigene Klassennamen mit Präfix: v7 führt schon ein .actor (min-width:104px, der Wahlknopf im
   Charakterblatt). Ohne Präfix erbte die Actor-KARTE dessen Mindestbreite und stand 17 px aus
   ihrer Spalte heraus — ein Namensraum ist billiger als ein Gegen-!important. */
.r9c{position:relative;pointer-events:auto;cursor:pointer;opacity:var(--r9op);
  min-width:0;max-width:none;flex:none;
  filter:drop-shadow(0 2px 4px rgba(0,0,0,.3));
  transition:opacity .32s var(--e9) .08s,filter .32s var(--e9)}
.r9c canvas{display:block;width:100%;height:100%}
.r9c.r9map{width:var(--r9w);aspect-ratio:${AR};cursor:crosshair}
.r9c.r9map:hover{opacity:1}
/* ── Stapel: hintereinander, bei Zeigerkontakt aufgefächert ── */
/* Die BREITE wird nicht animiert, nur der Auffächerungsweg. Grund: die Blätter sind Canvas —
   während einer Breitenüberblendung ist clientWidth ein Zwischenwert, das Blatt würde in der
   falschen Größe gerastert und danach nie wieder. Springende Größe, scharfe Kante.

   Die Kinetik: ein Stapel wird AUSGETEILT, nicht aufgeklappt. Jedes Blatt läuft mit eigenem
   Versatz los (Staffel) und gleitet weich an — ease-in-out, kein Rückfedern: das Zucken war es,
   was das Bild hektisch machte.
   **Seit dem Ring (9.8.) steht die Geometrie in der Logik, nicht hier.** Position, Neigung und
   Deckkraft setzt makePile.lay() je Blatt inline; das Drehen läuft über requestAnimationFrame.
   Eine CSS-Übergangszeit auf transform würde dagegen arbeiten — deshalb bleibt hier nur, was
   das Drehen NICHT anfasst.
   (Und ja: dieser Kommentar stand einmal mit Backticks um die Bezeichner da. Er hat das
   Template-Literal beendet und das ganze Modul lahmgelegt — zum dritten Mal in diesem Projekt.
   Die Warnung oben im Block ist keine Verzierung.) */
.r9pile{position:relative;pointer-events:auto}
.r9pile .r9c{position:absolute;
  transition:opacity .25s var(--e9),filter .5s var(--e9)}
.r9pile:hover .r9c{filter:drop-shadow(0 6px 12px rgba(0,0,0,.38))}
.r9pile:hover{z-index:6}
@keyframes r9deal{0%{filter:drop-shadow(0 1px 3px rgba(0,0,0,.28))}
  40%{filter:drop-shadow(0 12px 19px rgba(0,0,0,.46))}
  100%{filter:drop-shadow(0 6px 12px rgba(0,0,0,.38))}}
.r9deck{display:flex;flex-direction:column;align-items:flex-end;gap:5px;pointer-events:none}
/* Die Nearest-Leiste ist so breit wie die Insel und trägt nur den Titel — die Peilung sitzt als
   Zeiger oben in der Icon-Reihe. */
/* v11-H6: **so breit wie die Insel**, nicht var(--r9w). Die Leiste gehört zur Karte, also fluchtet
   ihre linke Kante mit deren linker Kante — bei fester Eigenbreite war sie schmaler und rechts
   angeschlagen, und links entstand die Stufe, die Georg im Mockup weggeschoben hat. */
.r9near{display:flex;align-items:center;gap:7px;width:100%;opacity:var(--r9op);
  pointer-events:auto;cursor:pointer;transition:opacity .3s var(--e9)}
.r9near:hover{opacity:1}
.r9near b{position:relative;z-index:1;display:block;
  font-family:'Special Elite',ui-monospace,monospace;font-size:11px;font-weight:400;
  letter-spacing:.02em;color:#241d15;padding:5px 9px;
  overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.r9near .plate{position:relative;flex:1;min-width:0}
.r9near .plate canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.r9near.off{visibility:hidden}
.r9call{pointer-events:auto;cursor:pointer;border:0;padding:4px 7px;align-self:stretch;
  font-family:'Special Elite',ui-monospace,monospace;font-size:9.5px;letter-spacing:.05em;
  color:#f7eed8;background:rgba(140,58,30,.9);opacity:var(--r9op);text-align:left;display:none;
  box-shadow:0 0 0 1.4px ${INKC};transition:opacity .18s ease}
.r9call.on{display:block;animation:r9pulse 5s ease-in-out infinite}
.r9call:hover{opacity:1;background:#a2451f}
@keyframes r9pulse{0%,100%{opacity:var(--r9op)}50%{opacity:.98}}
.r9c.hot canvas{animation:r9glow 5s ease-in-out infinite}
@keyframes r9glow{0%,100%{filter:none}50%{filter:drop-shadow(0 0 8px rgba(216,180,95,.7))}}
/* == Statleiste == EIN Kasten: Avatar links, der zweizeilige Block daneben.
   (Vorher stand der Avatar frei daneben — zwei Böcke, die nur so tun, als gehörten sie zusammen.
   Ein Blatt, eine Kante, ein Gegenstand.)
   **Papier ist Papier, kein Glas** (9.8.): die Leiste lief auf der gemeinsamen Sichtbarkeit
   --r9op (0,78) mit. Bei den kleinen Kartenblaettern faellt das nicht auf, bei einer Flaeche von
   446x69 schon — das Gras schien durch und machte aus dem Papier eine olivgruene Scheibe. Georgs
   Befund "die alte Fluff-Box wiederherstellen" war genau das. Die gemeinsame Sichtbarkeit gilt
   weiter fuer alles, was TEIL des Bildes ist; ein beschriebenes Blatt gehoert nicht dazu. */
/* ── v11-H12 · EINE Durchsicht für das Interface (Georg 11.8.) ──────────────────
   Die Leiste stand auf opacity:1, alles andere auf --r9op (0,78). Der Grund von damals steht oben:
   bei 446×69 schien das Gras durch und machte aus dem Papier eine olivgrüne Scheibe. Der Grund ist
   inzwischen weg — das Blatt trägt eine gezogene Kante, einen deckenden Balken mit eigenem Rahmen
   und dunkle Schrift, also liest es sich auch durchscheinend als Papier.

   Damit gilt für die Durchsicht dieselbe Regel wie für die Farben: **eine Zahl an einer Stelle.**
     --r9op       0,78 — alles, was Auskunft gibt: Leiste, Insel, Zieltafel, Knöpfe, Fächer
     --r9opCards  0,92 — die Aktionskarten, die EINZIGEN, die weniger durchscheinen als der Rest

   **Richtung korrigiert am 11.8.:** zuerst stand hier 0,62 für die Karten im TAB-Modus, also
   durchscheinender. Falsch, und zwar gegen Georgs Regel: »die einzigen, die etwas weniger
   Transparenz haben, sind die Action Cards unten«. Weniger Transparenz heißt HÖHER, nicht tiefer.
   Der Grund dahinter ist auch der bessere: im TAB-Modus sind die Karten das einzige Interface, das
   überhaupt noch steht — was übrig bleibt, wenn man alles wegnimmt, muss das Lesbarste sein.
   Deshalb gilt der Wert jetzt in BEIDEN Modi, und der Modus-Zusatz im Namen ist weg.
   Im Kampf gehen ohnehin alle auf 1 (siehe .v7.fight), und Zeigerkontakt hebt einzeln an. */
.r9stat{position:absolute;left:var(--pad);top:var(--pad);z-index:3;pointer-events:auto;
  opacity:var(--r9op);transition:opacity .3s var(--e9);
  filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))}
.r9stat:hover{opacity:1}
.r9stat .av{position:absolute;left:12px;top:-8px;z-index:2;
  width:108px;height:108px;object-fit:contain;display:block;image-rendering:pixelated;cursor:pointer;
  transition:transform .3s var(--e9);transform-origin:50% 100%;
  filter:drop-shadow(0 3px 4px rgba(0,0,0,.42))}
.r9stat .av:hover{transform:scale(1.05)}
.r9stat .sheet{position:relative;width:446px;overflow:visible}
.r9stat canvas.edge{position:absolute;inset:0;width:100%;height:100%;z-index:0}
/* Der Avatar hängt ÜBER die Unterkante, statt die Box aufzusperren: er liegt absolut im Blatt und
   ist damit aus dem Fluss — die Höhe bestimmen allein die zwei Zeilen. Sein Platz wird links als
   Polster freigehalten, sonst läge Schrift unter ihm. So darf er groß sein, ohne dass die Leiste
   wächst, und beim Ausfahren wandert er nicht mit. */
.r9stat .ct{position:relative;z-index:1;display:flex;align-items:flex-start;gap:13px;
  padding:13px 16px 14px 132px;font-family:'Special Elite',ui-monospace,monospace;color:#241d15}
/* == Name und Titel ===========================================================
   Die Zeile steht GANZ OBEN, weil sie sagt, wer hier gemeint ist — alles darunter sind seine
   Zahlen. Beides kommt aus OW_IDENT (ident-v1), nicht von hier: der Name gehoert dem Spieler,
   der Titel ist eine Trophäe, und wer sich beides selbst ausdenkt, hat eine zweite Wahrheit
   neben WS1s Fassung stehen. Ohne das Modul fällt die Zeile still weg. */
.r9stat .r0{display:flex;align-items:baseline;gap:7px;min-height:19px;min-width:0}
.r9stat .r0 .who{font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;
  font-size:15px;line-height:1.1;color:#241d15;cursor:text;outline:none;
  border-bottom:1.5px solid transparent;transition:border-color .2s var(--e9),color .2s var(--e9)}
.r9stat .r0 .who:hover{border-bottom-color:rgba(140,58,30,.45)}
.r9stat .r0 .who:focus{color:#8c3a1e;border-bottom-color:#8c3a1e}
.r9stat .r0 .tit{font-style:normal;font-size:11.5px;letter-spacing:.02em;color:#6d5c3e;
  cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  transition:color .2s var(--e9)}
.r9stat .r0 .tit:before{content:'· '}
.r9stat .r0 .tit:hover{color:#8c3a1e}
.r9stat .r0 .tit.none{opacity:.55;font-style:italic}
/* Verstecken muss GEWINNEN: die eigene Regel ist spezifischer als [hidden] der Browserregeln, also
   blieb das versteckte Bild im Fluss stehen und schob das Blatt 86 px zur Seite. */
/* Roster: Gesichter in einem Raster, blätterbar. */
.r9favs{display:flex;gap:9px;margin-top:9px;flex-wrap:wrap}
.r9fav{width:64px;height:64px;flex:none;position:relative;
  transition:transform .3s var(--e9)}
.r9fav canvas{width:100%;height:100%;display:block;image-rendering:pixelated}
.r9fav.empty{background:rgba(31,26,20,.07);box-shadow:inset 0 0 0 2px rgba(31,26,20,.28)}
.r9fav.over{transform:scale(1.08)}
.r9fav.set{cursor:pointer}
.r9favhint{font-family:'Special Elite',ui-monospace,monospace;font-size:10px;color:#8a7757;
  margin-top:6px}
.r9roster{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:13px;
  margin-top:9px}
.r9ru{display:flex;flex-direction:column;align-items:center;gap:6px;padding:7px 4px;
  cursor:pointer;transition:transform .3s var(--e9)}
.r9ru.locked{cursor:default;opacity:.5}
.r9ru.locked:hover{transform:none}
.r9ru:hover{transform:translateY(-2px)}
.r9ru canvas{width:64px;height:64px;display:block;image-rendering:pixelated;
  filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}
.r9ru b{font-family:'Special Elite',ui-monospace,monospace;font-size:10.5px;font-weight:400;
  color:#3a3025;text-align:center;line-height:1.25}
.r9ru.me b{color:#8c3a1e}
.r9ru.me canvas{filter:drop-shadow(0 0 7px rgba(216,180,95,.95))}
.r9ru.locked canvas{filter:grayscale(1) brightness(.85)}
.r9ru[draggable=true]{cursor:grab}
.r9ru.drag{opacity:.45}
/* Sprechblase: weißes Blatt, Kanon-Kante, keine runden Ecken — was wichtig ist, liest sich auf
   Weiß am besten, und eine gerundete Ecke gehört in kein getuschtes Bild. */
.r9bub{position:absolute;z-index:40;pointer-events:none;min-width:132px;max-width:224px;
  opacity:0;transition:opacity .25s var(--e9)}
.r9bub.on{opacity:1}
.r9bub canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.r9bub .ct{position:relative;z-index:1;padding:9px 12px;
  font-family:'Special Elite',ui-monospace,monospace;color:#241d15;font-size:11px;line-height:1.35}
.r9bub b{display:block;font-weight:400;font-size:12.5px;margin-bottom:3px}
.r9bub em{font-style:normal;display:block;color:#6d5c3e;font-size:10px;letter-spacing:.06em;
  text-transform:uppercase;margin-top:4px}
.r9bub .sk{display:inline-block;margin:3px 5px 0 0;padding:1px 6px;font-size:10px;
  background:rgba(31,26,20,.08);box-shadow:0 0 0 1.4px rgba(31,26,20,.45)}
.r9stat .av[hidden]{display:none!important}
/* Kein eindeutiges Avatarblatt → kein Bild (Georg 11.8.: die Sprites skalieren falsch, also erstmal
   raus). Dann fällt auch sein Platz weg: die 132/112/−116 px sind SEIN Polster, und ein Polster ohne
   Bewohner ist ein Loch. */
.r9stat.noav .ct{padding-left:16px}
/* v12-H6 · Der Kontostand ist eine ZEILE, keine Spalte (Georg 12.8.: »der POP-account-Text ist
   noch auf die Spalte begrenzt statt durchgehend«). Siehe die Regel bei .r9stat .acct weiter
   unten — dort steht das Maß, hier stand nur der Sonderfall ohne Avatar. */
.r9stat.noav .acct{padding-left:0}
.r9stat.noav.open .more{margin-left:0}
/* NICHTS springt beim Ausfahren: Avatar und Zeilen hängen an der OBERKANTE, nur die Unterkante
   des Blattes wandert nach unten. Mittige Ausrichtung hätte beide beim Aufklappen mitgezogen —
   der Kopf wäre nach unten gerutscht, während man liest. */
.r9stat .rows{display:flex;flex-direction:column;gap:7px;min-width:0;flex:1}
.r9stat .r1,.r9stat .r2{min-height:22px}
/* Die Reihe muss PASSEN, nicht schrumpfen. Als der Fluff-Balken seine Breite halten durfte, fiel
   der Fehlbetrag auf das letzte Kind — die POP-Zahl stand 3 px neben dem Papier. Ein Stossdaempfer
   im Balken war die falsche Loesung; die richtige ist ein Blatt, das die Zeile traegt. */
.r9stat .r1,.r9stat .r2{display:flex;align-items:center;gap:12px}
.r9stat .r2{gap:15px;flex-wrap:wrap}
.r9stat .lab{font-size:9.5px;letter-spacing:.15em;color:#6d5c3e}
/* Der Fluff-Balken trägt die Kanon-Feder, nicht einen CSS-Rahmen — eine Linie mitten im
   Tuschebild, die als einzige gestochen ist, fällt auf. Sie ist absichtlich etwas dünner als die
   Blattkante drum herum: eine Naht IM Blatt, keine zweite Aussenkante. */
.r9stat .fluff{position:relative;width:118px;height:13px;flex:none}
.r9stat .fluff canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.r9stat .fluff i{position:absolute;z-index:1;left:2px;top:3px;bottom:3px;width:0%;
  max-width:calc(100% - 4px);
  background:linear-gradient(90deg,#a83a2b,#d8b45f 58%,#6fc48a);transition:width .4s var(--e9)}
.r9stat .num{font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;
  line-height:1}
.r9stat .hp{font-size:14px;color:#8c3a1e;min-width:54px}
/* == Optisch ausrichten, nicht mechanisch (Georg, 9.8.: »alignment text/bars/ui«) ==========
   Alle drei Stücke der ersten Zeile standen exakt mittig — gemessen 29,2 px Mitte für Etikett,
   Balken und Zahl — und sahen trotzdem verrutscht aus. Der Grund steht in den Schriften:
   »Special Elite« reserviert 3 px Unterlänge, hat bei FLUFF aber keine; ihre Tusche liegt
   dadurch 1,34 px ÜBER der Kastenmitte. »Shantell Sans« trägt in 120/120 eine echte Unterlänge
   und liegt 0,99 px DARUNTER — zusammen 2,3 px Versatz zwischen zwei Dingen, die eine Zeile
   bilden sollen. Ausgerichtet wird deshalb die TUSCHE, nicht der Kasten. (Gemessen mit
   TextMetrics: actual/fontBoundingBox, nicht geschätzt.) */
.r9stat .lab,.r9stat .six{transform:translateY(1.3px)}
.r9stat .hp{transform:translateY(-1px)}
/* ── v11-H2 · Die Leiste sagt VIER Dinge (Georg 11.8.) ─────────────────────────
   »die Bar jetzt auch mit den ganzen Stats ist vielleicht zu viel, sie dauerhaft anzuzeigen« —
   und der POP-Zähler »passt nicht so richtig da rein«. Beides trifft zu, aus zwei Gründen:

   1 Die sechs Werte stehen **doppelt** im Bild: hier als Zeile UND im ausgefahrenen Blatt, dort mit
     Etikett und Erklärung. Eine Auskunft zweimal ist eine zu viel — und die schlechtere Fassung
     stand dauerhaft offen. Die Zeile geht weg, der ausgefahrene Stand bleibt: **es fehlt nichts**,
     man klickt einmal.
   2 Die Münze war ein Fremdkörper: ein 44-px-Kreis mit Pixelkunst neben lauter flachem Papier und
     gestochener Feder. Sie war die Antwort auf ein anderes Problem (die Zeile sprang, wenn die Zahl
     eine Stelle mehr bekam) — das löst eine feste Mindestbreite genauso, ohne ein zweites Material.

   Was bleibt: Avatar · Name und Titel · Fluff mit Zahl · POP. Vier Auskünfte, eine Zeile Höhe
   weniger, und das Blatt von 446 auf 434 px (die Breite ist der kleine Gewinn, die Zeile der große —
   siehe die Rechnung im Nachtrag). Der Klick auf POP öffnet weiterhin die Einkaufsliste — das
   Verhalten ist unangetastet, nur das Aussehen ist flach.

   ZUM DRITTEN MAL DIE BACKTICK-FALLE: dieser Kommentar steht IN einem Template-Literal. Mein
   »Nachtrag« unten hatte zwei zitierte Bezeichner in Backticks, damit endete das Literal mitten im
   Text und das ganze Modul lief nicht mehr — kein Rail, kein Fächer, das alte v7-Möbel zurück. Die
   Warnung stand dreißig Zeilen weiter oben und ich habe sie gelesen und trotzdem gemacht. In diesem
   Block wird zitiert mit »Gänsefüßchen«, nie mit Backticks. */
/* ── Nachtrag zur Breite: NACHGERECHNET, nicht geschätzt ──────────────────────
   Erster Versuch: Blatt auf 334 px, Avatar auf 92, Polster auf 110. Beides falsch, und beides
   hätte ich vorher ausrechnen können:

   1 **Der Avatar folgt keinem Stylesheet.** Seine Größe schreibt der Mal-Helfer als Inline-Stil
     (»style="width:108px;height:108px"«, Attribute 216² bei dpr 2) — eine Regel im Blatt verliert
     dagegen, egal wie spezifisch. Übernommen wurden nur »left« und »top«, also ragte er 8 px in das
     Wort FLUFF hinein und aus »FLUFF« wurde »LUFF«. Avatar und Polster bleiben deshalb, wie sie
     sind (108/132): wer die Größe ändern will, ändert sie beim Maler, nicht hier.

   2 **Die Zeile passt nicht in 334 px** — genau die Regression, vor der der Kommentar zwanzig Zeilen
     weiter oben warnt: der Fehlbetrag fällt auf das letzte Kind, und die Fluff-Zahl stand über dem
     POP-Feld und 4 px neben dem Papier. Die Rechnung, die vorher fehlte:

       132 Polster + 36 Etikett + 12 + 104 Balken + 12 + 50 Zahl + 13 + 54 POP + 16 = **429 px**

     Blattbreite also 434 (5 px Luft), statt 446. Der Gewinn ist eine ZEILE, nicht die Breite — und
     das war auch der Auftrag: die sechs Werte dauerhaft anzuzeigen war zu viel, 12 px Breite waren
     niemandes Problem. */
.r9stat.slim .r2{display:none}
.r9stat.slim .sheet{width:434px}
/* ── v11-H6 · Der Kopf nach Georgs Mockup (11.8., 19:04) ────────────────────────
   Drei Festlegungen, alle drei aus dem Bild abgelesen:

   1 **Erst der Wert, dann sein Etikett** — »140 Fluff«, »3 Pop«. Vorher stand FLUFF links vor dem
     Balken und die Zahl dahinter, das Etikett gehörte also optisch zum Balken statt zur Zahl. Jetzt
     bilden Zahl und Wort ein Paar in EINER Farbe, und zwei solche Paare stapeln sich rechts
     untereinander: der Blick findet beide Zahlen auf derselben Kante.
   2 **Der Balken nimmt die Zeile.** Er ist die einzige Auskunft im Blatt, die eine Länge hat —
     104 px waren eine Restbreite, keine Entscheidung. Jetzt füllt er, was die Zeile übrig lässt.
   3 **Die Naht unter dem Kopf ist weg.** Georg: »die läuft so ungut unter dem Avatarbild«, und das
     stimmt — die Linie beginnt links in der Luft, weil der Avatar die ersten 120 px belegt. Eine
     Trennlinie, die unter einem Bild anfängt, trennt nichts, sie stört. Der Abstand macht es. Ein
     Strich kommt später wieder, wenn unten der Ruf bei den Fraktionen dazukommt — DER trennt dann
     zwei Dinge, die wirklich verschieden sind, und er läuft über die ganze Breite. */
.r9stat.slim .lab{display:none}
.r9stat.slim .r1{gap:11px}
.r9stat.slim .fluff{flex:1;width:auto;height:14px}
/* ── v11-H7 · Der Balken im HUD: Volltonfarbe nach Stand, Tuschekante, leichte Spiegelung ──────
   Die Farbe kommt aus OW_FEEL.fluffColor (siehe game-feel.js) und wird in renderStats gesetzt —
   ein Wert, eine Farbe. Darüber liegt eine flache senkrechte Spiegelung: hell an der Oberkante,
   ein Hauch Schatten unten. Das ist die »leichte Spiegelung« aus dem Mockup, und sie darf sein,
   weil dieser Balken IM Blatt liegt, wo die Kanon-Feder ohnehin die Kante zieht (das Canvas
   darunter, 0,3 Federstärke). Draußen auf der Karte gilt das Gegenteil — dort steht die
   Pixel-Outline, siehe overworld-game-v10.js drawUnitTag. */
.r9stat.slim .fluff i{background-color:#5fbf7a;
  background-image:linear-gradient(180deg,rgba(255,255,255,.46) 0%,rgba(255,255,255,.13) 44%,
    rgba(0,0,0,.10) 100%);
  transition:width .4s var(--e9),background-color .5s var(--e9)}
/* ── v11-H9 · Zahl und Etikett sind EIN Ding, und die Paare fluchten ────────────
   Vier Festlegungen, alle vier aus Georgs Bild:
   1 **Dieselbe Farbe** für Zahl und Etikett — sonst liest man zwei Angaben statt einer.
   2 **Dieselbe Schrift und Größe:** Shantell Sans, 14 px, wie der Name darüber. Special Elite
     (Schreibmaschine) bleibt den Fließtexten; die Kopfzeile ist jetzt durchgehend die Comic-Schrift.
   3 **Zwei feste Spalten** — 40 px Zahl rechtsbündig, 42 px Etikett linksbündig. Damit stehen die
     Zahlen von Fluff und Pop auf EINER Kante und die Wörter auf einer zweiten, egal ob dreistellig
     oder einstellig. Vorher war es eine Flex-Reihe, in der jede Ziffer alles verschob.
   4 **Kein Schatten, keine Kontur** an der Ziffer. Die 0 war »kaum lesbar« — sie hatte beides
     geerbt, und ein Ring mit Kontur und Schlagschatten ist keine Ziffer mehr, sondern ein Fleck. */
.r9stat.slim .hp,.r9stat.slim .r0 .r9acct{display:grid;grid-template-columns:40px 42px;gap:5px;
  align-items:baseline;min-width:0}
/* ── v11-H10 · Die Zahl gehört zum Balken, also trägt sie seine Farbe ──────────
   »140 Fluff« stand in Dunkelrot — eine schöne Farbe, aber sie sagte nichts: bei voller Gesundheit
   war der Balken grün und die Zahl rot, also standen zwei Farben für einen Zustand, und keine davon
   für den, der gerade gilt (Georg: »man weiß überhaupt nicht, dass das mit der Health-Bar zu tun
   hat, das ist disconnected«).

   Zwei Wege standen zur Wahl: die Zahl schwarz (dann ist sie neutral und die Farbe bleibt allein
   beim Balken) oder die Zahl in der Farbe des Balkens. Ich nehme den zweiten, weil er die
   Verbindung HERSTELLT statt sie nur zu vermeiden: die Zahl wechselt mit dem Balken von Grün nach
   Rot, und damit ist sichtbar, dass beide dasselbe messen. Sie läuft dabei über
   OW_FEEL.fluffColor(t, 0.34) — dieselbe Farbe, ein Drittel zur Tusche gemischt, weil ein reines
   Balkengrün als Ziffer auf Creme zu schwach ist.

   **Das WORT bleibt Tusche.** Ein Etikett hat keinen Zustand; färbte es mit, stünde die Auskunft
   dreimal da. Regel für die Kopfzeile: die Zahl sagt, wie es steht, das Wort sagt nur, was es ist. */
.r9stat.slim .hp{transform:none}
.r9stat.slim .hp em,.r9stat.slim .r0 .r9acct em{color:#241d15;opacity:.72}
.r9stat.slim .hp b{transition:color .5s var(--e9)}
.r9stat.slim .hp b,.r9stat.slim .hp em,
.r9stat.slim .r0 .r9acct b,.r9stat.slim .r0 .r9acct em{
  font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;font-size:14px;
  line-height:1;font-style:normal;text-shadow:none;-webkit-text-stroke:0;filter:none;opacity:1}
.r9stat.slim .hp b,.r9stat.slim .r0 .r9acct b{text-align:right}
.r9stat.slim .hp em,.r9stat.slim .r0 .r9acct em{text-align:left}
.r9stat.slim .more{border-top:0;padding-top:3px}
.r9stat.slim .r9acct{width:auto;min-width:54px;height:22px;display:flex;align-items:center;
  justify-content:flex-end;gap:6px;align-self:center;background:none;box-shadow:none}
.r9stat.slim .r9acct .coin{display:none}
/* v11-H7 · Hier stand ein »:before« mit dem Inhalt »POP« — die Etikett-Lösung von damals, als das
   Etikett kein eigenes Element hatte. Seit v11-H6 steht es als »em« hinter der Zahl, wie im Mockup.
   Beide zusammen lasen »POP 0 Pop«. Wieder gelöscht statt überschrieben: eine Regel, die durch eine
   neue Lösung gegenstandslos wird, muss verschwinden — »content:none« hätte die Fundstelle liegen
   lassen, und die nächste Suche nach dem Etikett hätte zwei Orte gefunden. */
.r9stat.slim .r9acct b{font-size:14px;color:#8c6a1e;min-width:24px;text-align:right}
.r9stat.slim .r9acct:hover b{color:#c8622a}
/* ── v11-H5 · Warum POP gesprungen ist, und warum es jetzt nicht mehr kann ────
   Das Feld war ein GESCHWISTER des ganzen Textblocks, nicht Teil einer Zeile. Damit hing seine
   Höhe an der Höhe des Blattes: zu 75 px, aufgeklappt 384 — jede Ausrichtung (mittig, unten, oben)
   ist bei zwei so verschiedenen Höhen an einer Stelle richtig und an der anderen falsch. Ich hatte
   das mit zwei Regeln erschlagen, eine je Zustand, und genau dieser Wechsel IST der Sprung, den
   Georg beim Drüberfahren sieht. Eine Ausrichtung, die vom Zustand abhängt, ist keine.

   Jetzt steht POP IN der Namenszeile, ganz rechts. Die Zeile ist 19 px hoch, ob das Blatt zu oder
   offen ist — es gibt also nichts mehr, was sich verschieben könnte. Und es ist dort besser
   aufgehoben: Name, Titel und Kontostand sind alle drei »wer ich bin«, während die Zeile darunter
   »wie es mir geht« sagt.

   **Die Zahl war außerdem nicht lesbar** — Georg: »ein grauer Punkt, man erkennt nicht, ob das eine
   Null ist«. Das war keine Täuschung: eine fette 0 in Shantell Sans IST ein Ring, bei 14 px in
   Dunkelgold auf Creme. Sie bekommt dieselbe Größe und dasselbe Grün wie der Kontostand im
   ausgefahrenen Blatt — eine Zahl, eine Farbe, an zwei Stellen dieselbe. */
/* ── v11-H10 · Ein Titel wird nicht abgeschnitten ───────────────────────────────
   Dieses Blatt ist der EINZIGE Ort, an dem der Spieler seinen eigenen Titel sieht (in der Welt
   steht er nur in fremdem Mund, im Schmähruf). Ein Ort, der ihn zeigt, darf ihn nicht kürzen —
   »Leichenfle…« war die schlechteste aller Fassungen: zu lang für die Zeile und zu kurz zum Lesen.
   Also darf die Zeile umbrechen. Kurze Titel bleiben neben dem Namen, lange rutschen darunter, und
   das Blatt wächst um eine Zeilenhöhe. Das POP-Feld hängt an margin-left:auto und bleibt oben —
   es verliert dabei nichts, weil seine Kante von der Spaltenbreite kommt, nicht vom Umbruch.

   **Kein Titel heißt: nichts.** Vorher stand dort blass »no title yet« — ein Etikett für die
   Abwesenheit eines Etiketts. Das Dreieck bleibt sichtbar, also ist der Weg zur Wahl da; die Zeile
   behauptet nur nichts mehr. */
.r9stat.slim .r0{flex-wrap:wrap;row-gap:2px}
.r9stat.slim .r0 .tit{white-space:normal;overflow:visible;text-overflow:clip;max-width:100%}
.r9stat.slim .r0 .tit.none{display:none}
/* ── v11-H11 · POP ist ORANGE, und zwar das Orange, das schon im Bild ist ───────
   Grün war falsch, und zwar aus einem Grund, der über POP hinausgeht: **Grün ist im Interface die
   Farbe der Gesundheit** (voller Balken, volle Fluff-Zahl). Zwei Bedeutungen auf einem Kanal sind
   eine zu viel — dieselbe Regel, mit der die Gegner-Leisten keine Rangfarbe bekommen.

   Der Ton ist nicht erfunden, sondern GEMESSEN: der Richtungspfeil (Tiny Swords) hat als häufigste
   gesättigte Farbe **#f6844f** (920 von 4096 Pixeln, ausgelesen am geladenen Blatt). Damit kommt
   keine neue Farbe ins Interface, sondern die, die dort schon zeigt, wo es hingeht.
   Für Schrift auf Creme um 12 % zur Tusche gemischt (#d97741) — wie bei der Fluff-Zahl: als Fläche
   trägt der pure Ton, als Ziffer nicht.

   Bleibt unterscheidbar von den beiden Nachbarn: BLÖDSINN! ist Blaugrün (#1b8476), KayfaBingo ein
   dunkleres, röteres Orange (#c8622a). Georgs Einschätzung, dass die Nähe zu Bingo vertretbar ist,
   teile ich — die Kürzel stehen im ausgefahrenen Blatt, POP in der Kopfzeile, sie treffen sich nie
   in derselben Zeile. */
.r9stat.slim .r0 .r9acct{margin-left:auto;align-self:baseline;transform:none;
  width:auto;height:auto;background:none;box-shadow:none;color:#d97741}
.r9stat.slim .r0 .r9acct b{color:#d97741}
.r9stat.slim .r0 .r9acct:hover b{color:#a8501c}
.r9stat.slim .r0 .r9acct:hover em{color:#a8501c}
/* ── v11-H9 · Name ändern und Titel wählen, beides an Ort und Stelle ────────────
   Der Name war schon beschreibbar, aber ohne sichtbares Ende: man tippte und musste raten, wann es
   gilt (es galt beim Verlassen des Feldes). Jetzt erscheinen beim Schreiben zwei kleine Schalter —
   Häkchen behalten, Kreuz verwerfen — in derselben Sprache wie das Plus im ausgefahrenen Blatt.
   Der Titel war ein Ringtausch: jeder Klick der nächste, ohne zu wissen, was kommt. Für zwei Titel
   geht das, für sieben nicht. Jetzt ein Dreieck und eine Liste: oben, was man tragen kann, unten —
   blass und ohne Klick — was es noch zu holen gibt, mit dem Grund daneben. Das ist der Appetizer,
   und er kostet keine Zeile Spiellogik: die Bedingungen stehen längst in identity.js. */
.r9stat .r0 .whoOK,.r9stat .r0 .whoNO{display:none;width:17px;height:17px;place-items:center;
  cursor:pointer;font-size:10px;line-height:1;flex:none;
  background:rgba(31,26,20,.05);box-shadow:0 0 0 1.3px rgba(31,26,20,.4);
  transition:background-color .15s var(--e9),transform .15s var(--e9)}
.r9stat .r0.editing .whoOK,.r9stat .r0.editing .whoNO{display:grid}
.r9stat .r0 .whoOK{color:#3f8f4a}
.r9stat .r0 .whoNO{color:#8c3a1e}
.r9stat .r0 .whoOK:hover,.r9stat .r0 .whoNO:hover{background:rgba(216,180,95,.42);
  transform:translateY(-1px)}
/* Das Dreieck ist GEZEICHNET, nicht gesetzt: als Schriftzeichen (\u25be) fällt es in Shantell Sans
   auf einen Ersatz zurück und stand als »\u203a« da — ein Winkel nach rechts, also die falsche
   Richtung für ein Menü, das nach unten aufgeht. Drei Ränder sind hier verlässlicher als jede
   Schrift, und die Farbe folgt dem Titel daneben. */
.r9stat .r0 .titdd{flex:none;box-sizing:content-box;width:0;height:0;padding:0;margin:0 0 1px 5px;
  background:none;cursor:pointer;font-size:0;color:transparent;line-height:0;
  border:0;border-left:4.5px solid transparent;border-right:4.5px solid transparent;
  border-top:5.5px solid #6d5c3e;
  transition:border-top-color .15s var(--e9),transform .15s var(--e9)}
.r9stat .r0 .titdd:hover{border-top-color:#8c3a1e;transform:translateY(1px)}
/* v12-H2 · EIN DREIECK VON 9×6 PX IST KEIN ZIEL (Georg 12.8.: »man muss es sehr genau treffen«).
   Die Zeichnung bleibt klein — sie soll ein Hinweis sein, kein Knopf —, die TREFFERFLÄCHE wächst:
   ein unsichtbares Kind spannt 31×28 px auf, also mehr als die 24 px, die eine Fingerkuppe
   braucht. *Zeichen und Ziel sind zwei Dinge; wer das Ziel vergrößert, muss nicht das Zeichen
   vergrößern.* (Der Titeltext daneben öffnet dieselbe Liste — das war schon so.) */
.r9stat .r0 .titdd{position:relative}
.r9stat .r0 .titdd:after{content:'';position:absolute;left:-13px;top:-15px;width:31px;height:28px}
.r9stat .titmenu{position:absolute;z-index:9;left:112px;top:36px;min-width:210px;max-width:280px;
  background:#f2e8cf;box-shadow:0 0 0 1.6px rgba(31,26,20,.5),0 7px 16px rgba(0,0,0,.3);
  padding:5px 0 7px;font-family:'Special Elite',ui-monospace,monospace;text-align:left}
.r9stat .titmenu[hidden]{display:none}
.r9stat .titmenu button{display:block;width:100%;text-align:left;border:0;background:none;
  font:inherit;font-size:12px;color:#241d15;padding:5px 13px;cursor:pointer;
  transition:background-color .13s var(--e9)}
.r9stat .titmenu button:hover{background:rgba(216,180,95,.4)}
.r9stat .titmenu button.on{color:#8c3a1e}
.r9stat .titmenu button.on:before{content:'\u00b7 '}
.r9stat .titmenu .hd{padding:8px 13px 3px;margin-top:4px;font-size:9px;letter-spacing:.14em;
  color:#6d5c3e;border-top:1px solid rgba(31,26,20,.16)}
.r9stat .titmenu .locked{padding:3px 13px;color:#6d5c3e;opacity:.68}
.r9stat .titmenu .locked span{display:block;font-size:11.5px}
.r9stat .titmenu .locked em{display:block;font-style:normal;font-size:9.5px;opacity:.85}
.r9stat.slim.open .more{margin-right:0}
.r9stat .more .acct{border-bottom:0}
/* == POP als runder Knopf, nicht als Zeile ====================================
   DER NAME IST RAIL-EIGEN (r9acct), und das ist kein Geschmack. Der Runner besitzt
   .pop bereits — als Vollbild-Modal (position:absolute; inset:0; background:rgba(12,18,15,.72),
   mit .pop .box, .pop button.buy, .pop .ok). Hiess das Badge auch .pop, erbte es
   dessen dunklen Hintergrund: hinter dem runden Knopf mit durchsichtigen Ecken lag ein
   schwarzes Quadrat. position und display wurden ueberschrieben, der Hintergrund nicht —
   ein Fehler, der nur an den Ecken sichtbar wird und sonst wie Absicht aussieht.
   Zwei verschiedene Dinge unter einem Klassennamen sind die »zwei Wahrheiten«-Klasse in CSS.
   Georg, 9.8.: der Stand steht IM Knopf. Der Knopf ist ein Einzelstueck (Tiny Swords,
   TinyRoundBlueButton) — feste Form, kein 9-Slice, denn ein Kreis hat keine dehnbare Mitte.
   Das 64er Blatt wird auf 32 gesetzt: exakt halbiert, also weiter auf ganzen Pixeln.

   **Nichts darf springen.** Deshalb hat der Knopf eine FESTE Kastengroesse und die Zahl liegt
   mittig darin: ob 2 oder 128 drinsteht, die Zeile bleibt gleich breit. Vorher trug die Zeile
   Text (POP 8) — jede Stelle mehr schob die Zeile.

   Georg, 9.8. (zwei Korrekturen):
   1 Der Knopf ist jetzt SmallBlueRoundButton — eine glatte Scheibe ohne Nietenrand, auf der die
     Ziffer frei steht. Er wird NICHT pixelig skaliert: das Blatt ist 128 px, der Kasten 44 —
     ein Kreis mit nearest-neighbour bei Faktor 0,34 bekaeme eine ausgefranste Kante, und die
     Scheibe traegt keine Pixelkunst, die es zu erhalten gaebe.
   2 Er sitzt nicht mehr in der oberen Zeile, sondern MITTIG rechts im Blatt — als eigenes Kind
     der Inhaltszeile (align-self:center), also auf halber Hoehe zwischen Fluff und den sechs
     Werten. Beim Ausfahren haengt er wieder oben, sonst rutschte er beim Lesen nach unten. */
/* v11-H9 · »place-items:center« ist hier RAUS. Es gehörte der Münze: ein 44er Quadrat, in dessen
   Mitte eine Ziffer über einer Scheibe stand. Seit das Feld zwei Spalten hat (Zahl rechtsbündig,
   Wort linksbündig), macht die Mittenausrichtung genau das Gegenteil — sie schrumpft beide Zellen
   auf ihren Inhalt (gemessen: 24 statt 40 px, 26 statt 42) und schiebt sie zusammen. Die Kanten
   lagen dadurch 8 px neben denen der Fluff-Zeile, also neben dem einen Punkt, um den es ging.
   Vierte liegengebliebene Regel dieser Art in diesem Blatt — deshalb hier gelöscht und nicht in der
   .slim-Regel überstimmt: die Ursache verschwindet, nicht ihre Wirkung. */
.r9stat .r9acct{position:relative;flex:none;width:44px;height:44px;align-self:center;
  display:grid;transform-origin:50% 55%;cursor:pointer;
  transition:transform .2s var(--e9)}
.r9stat .r9acct:hover{transform:scale(1.07)}
.r9stat .r9acct:active{transform:scale(.95);transition-duration:.08s}
.r9stat.open .r9acct{align-self:flex-start;margin-top:2px}
.r9stat .r9acct .coin{position:absolute;inset:0;background-repeat:no-repeat;background-size:100% 100%;
  filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}
/* Die Zahl liegt auf dem Knopf, nicht daneben. Creme, solange nichts zu holen ist —
   **weiss und leuchtend, sobald ein Kauf moeglich ist** (Georgs Regel). */
/* Die Zahl sitzt geometrisch exakt auf der Scheibe (gemessen: Versatz 0/0 zwischen
   Ziffernkasten und Knopfmitte, Ziffernmitte gegen Zeilenbox 0,11 px). Schief AUSSAH sie wegen
   des Schattens: 0 1.5px nach unten legt eine dunkle Kopie unter die Ziffer und kippt die
   wahrgenommene Achse. Ein Schatten mit Richtung ist auf einer runden Scheibe immer eine
   Behauptung ueber Licht - hier ersetzt ihn ein SYMMETRISCHER Umriss, der nichts behauptet. */
.r9stat .r9acct b{position:relative;z-index:1;font-size:16px;color:#f7ecd0;line-height:1;
  text-shadow:-1px 0 0 #16294a,1px 0 0 #16294a,0 -1px 0 #16294a,0 1px 0 #16294a,
    0 0 4px rgba(10,20,40,.75);transition:color .25s var(--e9)}
.r9stat.can .r9acct b{color:#fff;text-shadow:-1px 0 0 #16294a,1px 0 0 #16294a,0 -1px 0 #16294a,
    0 1px 0 #16294a,0 0 9px rgba(255,235,150,.95)}
.r9stat.can .r9acct .coin{filter:drop-shadow(0 1px 2px rgba(0,0,0,.35)) drop-shadow(0 0 5px rgba(255,222,120,.7))}
/* Der Zugewinn ist ein Cartoon-Schlag: erst stauchen, dann ueberschiessen, dann ruhig.
   Eine reine Vergroesserung waere eine Zustandsaenderung; das hier ist eine Reaktion. */
.r9stat .r9acct.bump{animation:r9pin .72s cubic-bezier(.34,1.56,.64,1)}
@keyframes r9pin{0%{transform:scale(1)}18%{transform:scale(.82,1.16)}
  38%{transform:scale(1.28,.86)}60%{transform:scale(.96,1.05)}100%{transform:scale(1)}}
/* »+2 POP« steigt ueber dem Knopf auf und nimmt keinen Platz weg (absolut, ohne Fluss). */
.r9stat .gain{position:absolute;left:50%;bottom:100%;margin-bottom:2px;pointer-events:none;
  font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;font-size:13px;
  white-space:nowrap;color:#ffe89a;text-shadow:0 2px 0 #1f1a14,0 0 6px rgba(31,26,20,.75);
  animation:r9gain 1.25s var(--e9) both}
@keyframes r9gain{0%{transform:translate(-50%,6px) scale(.7);opacity:0}
  25%{transform:translate(-50%,-4px) scale(1.1);opacity:1}
  55%{transform:translate(-50%,-12px) scale(1)}
  100%{transform:translate(-50%,-30px) scale(1);opacity:0}}
.r9stat .six{display:flex;gap:13px;font-size:9.5px;letter-spacing:.12em;color:#6d5c3e}
.r9stat .six span{display:flex;align-items:baseline;gap:4px;cursor:help;min-width:0}
.r9stat .six span b{font-size:16px;min-width:9px;text-align:right}
/* Ausgefahren: die Kryptik wird aufgelöst. Die Kante wird dabei NEU GEZOGEN, nicht gedehnt —
   deshalb springt die Höhe und nur der Inhalt blendet auf; eine Höhenanimation hätte die Tusche
   in die Länge gezogen, und eine gedehnte Feder ist keine Feder mehr. */
.r9stat .more{display:none;flex-direction:column;gap:0;
  border-top:1.5px solid rgba(31,26,20,.2);padding-top:8px;margin-top:1px}
/* Die Einblendung bewegt NUR, sie schaltet nicht sichtbar. Eine Animation, die bei opacity 0
   beginnt, versteckt den Inhalt, sobald die Uhr steht (versteckter Tab, gedrosselte Vorschau) —
   gemessen: der ganze Erklärblock stand auf 0. Sichtbarkeit ist Zustand, nicht Bewegung. */
.r9stat.open .more{display:flex;animation:r9fade .5s var(--e9) both}
/* == Der ausgefahrene Block nimmt das ganze Blatt ==============================
   Vorher stand er in der Spalte der zwei Zeilen (241 px) — rechts blieb Platz ungenutzt, links
   lag unter dem Kopf eine handbreite leere Papierfläche, und die Erklärzeilen brachen mitten im
   Satz um (»how hard the world bends when you / push«). Beides derselbe Fehler: der Text hat die
   Breite des Blattes nicht bekommen.
   Gemessen: von der Zeilenspalte bis zur linken Blattkante sind es 116 px, bis zur rechten 57 —
   also genau diese beiden negativen Ränder, und der Block sitzt auf 16 px Blattpolster.
   Der KOPF (POP-Konto) behält links das Polster des Avatars: er ist die einzige Zeile, die neben
   ihm liegt, und füllt damit die Stelle, die vorher leer war. Alles darunter beginnt unterhalb
   des Kopfes und darf über die volle Breite laufen. */
.r9stat.open .more{margin-left:-116px;margin-right:-57px;padding-bottom:2px}
/* v11-H5 · Hier stand »margin-right:-67px« — der Ausgleich für ein POP-Feld, das NEBEN dem Textblock
   saß und dessen Spalte der ausgefahrene Stand überbrücken musste. Seit das Feld in der Namenszeile
   steht, gibt es diese Spalte nicht mehr: der Block reicht von sich aus bis an die Inhaltskante.
   Die Regel ist deshalb **gelöscht und nicht überschrieben** — zwei Regeln mit gleicher Stärke für
   dieselbe Eigenschaft entscheidet die Reihenfolge in der Datei, und das ist keine Entscheidung,
   das ist ein Zufall. Gemessen war genau das der Fehler: die Knöpfe standen 48 px neben dem Papier,
   weil die alte Zeile die neue schlug. */
@keyframes r9fade{from{transform:translateY(-6px)}to{transform:none}}
/* ── v11-H5 · Vier feste Spalten, keine Trennstriche ────────────────────────────
   Erklärung links, dann rechts der Block, der die Auskunft trägt: Kürzel · Zahl · Knopf. Alle drei
   in FESTEN Spalten — dadurch stehen die sechs Zahlen auf einer Kante, egal ob eine Erhöhung
   gerade bezahlbar ist, und egal wie lang der Name ist.

   **Die Trennstriche sind raus** (Georg: »die finde ich ein bisschen störend«). Sie waren die
   Notlösung dafür, dass eine Zeile aus zwei Textgrößen besteht und nach unten auslief. Das löst
   Abstand besser als eine Linie: fünf Pixel Polster je Zeile, und die Erklärung klebt an ihrem
   Namen. Eine Linie bleibt — die Naht unter dem Kopf, wo das Blatt aufklappt. Die trennt zwei
   Dinge, die wirklich verschieden sind. */
.r9stat .more .row{display:grid;grid-template-columns:1fr 34px 26px 22px;align-items:baseline;
  gap:8px;padding:5px 0}
.r9stat .more .k{font-size:10px;letter-spacing:.06em;text-align:right;opacity:.85}
.r9stat .more .t{font-size:12px;color:#241d15;line-height:1.25}
.r9stat .more .t em{display:block;font-style:normal;font-size:10px;color:#6d5c3e;
  letter-spacing:.01em;margin-top:1px}
/* ── v11-H4 · Die Zahl darf nicht wandern (Georg 11.8.: »dass das da nicht springt mit den
   POP-Werten«) ──────────────────────────────────────────────────────────────────────────────
   Wert und Plus lagen in EINER Gitterzelle mit auto-Breite, und das Plus wurde mit »display:none«
   ausgeblendet. Beides zusammen heißt: sobald man POP einnimmt oder ausgibt, erscheint bei einer
   Zeile ein Knopf, die Zelle wird 16 px breiter — und die Zahl rutscht nach links. Nicht bei
   allen Zeilen gleichzeitig, sondern bei denen, die sich gerade lohnen. Genau das liest man als
   Springen, und es passiert, während man hinsieht.
   Die Zelle hat jetzt zwei FESTE Spalten: 26 px für die Zahl, 18 für den Knopf. Der Knopf gibt
   seinen Platz nie her (»visibility« statt »display«, siehe renderStats), also steht die Zahl
   immer auf derselben Kante — derselben wie die POP-Zahl im Kopf. */
.r9stat .more .v{font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;
  font-size:15px;text-align:right}
/* ── v11-H5 · Das Plus sieht jetzt aus wie etwas, das man drückt ──────────────
   Vorher war es ein nacktes Zeichen in Schriftfarbe — Georg: »das war bisher nicht so richtig gut
   als Klick-Option erkennbar«. Es bekommt dieselbe Sprache wie die Merkmalsplaketten der
   Roster-Blase (»r9bub .sk«): Papier, eine 1,4-px-Feder ringsum, kein Radius. Kein neues Material,
   nur eine vorhandene Form an einer neuen Stelle.
   Er behält seinen Platz auch unsichtbar (siehe renderStats, »visibility« statt »display«) —
   deshalb kann die Zahl daneben nicht wandern, wenn sich POP ändert. */
.r9stat .more .up{width:20px;height:20px;padding:0;border:0;cursor:pointer;
  display:grid;place-items:center;align-self:center;
  background:rgba(31,26,20,.05);box-shadow:0 0 0 1.4px rgba(31,26,20,.4);
  font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;font-size:13px;
  line-height:1;color:#8c3a1e;
  transition:background-color .16s var(--e9),transform .16s var(--e9),box-shadow .16s var(--e9)}
.r9stat .more .up:hover{background:rgba(216,180,95,.4);box-shadow:0 0 0 1.4px rgba(31,26,20,.62);
  transform:translateY(-1px)}
.r9stat .more .up:active{transform:translateY(0) scale(.92);transition-duration:.07s}
.r9stat.can .r2 .six span b{text-shadow:0 0 7px rgba(216,180,95,.9)}
/* Der Kontostand ist die KOPFZEILE des Blocks, nicht die Fußzeile: unten stand er auf der
   Tuschekante (Georgs Markierung, 9.8.) — eine Zeile, die auf der Kante klebt, sieht abgeschnitten
   aus, egal wieviel Polster darunter steht. Oben trägt sie zusätzlich den leeren Streifen neben
   dem Avatar. Die 112 px links sind sein Platz, gemessen (Kopf 12…120 px im Blatt). */
/* v12-H6 · Der Kontostand ist eine ZEILE, keine Spalte (Georg 12.8.: »der POP-account-Text ist
   noch auf die Spalte begrenzt statt durchgehend«). Das Polster links ist der Platz des Avatars
   — es stand als feste 112 da und blieb stehen, als der Avatar responsiv wurde (v12-H1); im
   schmalen Blatt blieben dem Satz dann rund 140 px, und er brach dreimal um. Jetzt SEIN Maß,
   eine Zahl an einem Ort. Der Nachsatz nimmt den Rest der Zeile, statt sich eine eigene Spalte
   zu suchen: ohne min-width:0 hält ein Flex-Kind seine kleinste Wortbreite und bricht lieber um. */
.r9stat .acct{display:flex;align-items:center;gap:7px;min-height:32px;
  padding:0 0 8px 112px;margin:0 0 4px;
  border-bottom:1.5px solid rgba(31,26,20,.2);font-size:10.5px;color:#4a4034}
/* Dieselbe Zahl, dieselbe Farbe: der Kontostand im ausgefahrenen Blatt ist derselbe POP wie oben
   in der Kopfzeile. Zwei Farben für einen Wert wären zwei Werte. */
.r9stat .acct b{font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;
  font-size:15px;color:#d97741}
.r9stat .acct em{font-style:normal;color:#6d5c3e;font-size:10px}
/* == POP-Gewinn: Münze und Zahl steigen auf, wie es sich gehört == */
.r9pop{position:absolute;z-index:9;display:flex;align-items:center;gap:5px;pointer-events:none;
  font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;font-size:17px;
  color:#f7eed8;text-shadow:0 2px 0 #1f1a14,0 0 6px rgba(31,26,20,.7);
  animation:r9rise 1.9s var(--e9) both}
.r9pop span{width:var(--r9ic);height:var(--r9ic);flex:none;background-repeat:no-repeat;
  image-rendering:pixelated;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))}
@keyframes r9rise{0%{transform:translate(-50%,0) scale(.85);opacity:0}
  22%{transform:translate(-50%,-20px) scale(1.04);opacity:1}
  42%{transform:translate(-50%,-27px) scale(1)}
  100%{transform:translate(-50%,-72px) scale(1);opacity:0}}
/* ══ Blattraster in den Fenstern ══ */
.r9grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:11px;margin-top:9px}
.r9gi{position:relative}
.r9gi canvas{display:block;width:100%;aspect-ratio:${AR};
  filter:drop-shadow(0 2px 4px rgba(0,0,0,.24))}
.r9gi .cap{margin-top:5px;font-family:'Special Elite',ui-monospace,monospace;font-size:10.5px;
  line-height:1.28;color:#3a3025}
.r9gi .cap i{font-style:normal;display:block;color:#8a7757;font-size:9px;letter-spacing:.09em;
  text-transform:uppercase}
.r9gi.dim{opacity:.42}
.r9sub{font-family:'Special Elite',ui-monospace,monospace;font-size:10px;letter-spacing:.12em;
  text-transform:uppercase;color:#8a7757;margin:16px 0 0}
.r9sub:first-child{margin-top:0}
.r9empty{font-family:'Special Elite',ui-monospace,monospace;font-size:11px;color:#8a7757;margin-top:8px}
.r9box{position:relative}
.r9box canvas.edge{position:absolute;inset:0;width:100%;height:100%;z-index:0}
/* == Symbole auf den Aktionskarten ============================================
   Georgs Auftrag (9.8.): die Handkarten sollen zeigen, WAS sie tun — nicht nur, wie sie heißen.
   Die Zuordnung haengt an der WIRKUNG (effect.type), nicht am Titel: kommt eine neue Karte mit
   der Wirkung freeze dazu, hat sie ihr Symbol, ohne dass hier jemand nachtraegt.
   Gezeichnet wird als INLINE-SVG, nicht als Bild oder Maske: nur so erbt die Figur mit
   fill=currentColor die Bandfarbe ihrer Karte. Ein PNG haette ein schwarzes Quadrat ins Blatt
   gestanzt, und eine CSS-Maske faellt bei jedem Export und jeder Abzeichnung des DOM aus.
   Herkunft und Lizenz der Blaetter: overworld/icons-rpg/CREDITS.md (game-icons.net, CC BY 3.0). */
.v7-card .r9ic{position:absolute;z-index:1;right:5%;top:50%;pointer-events:none;
  width:calc(var(--ch)*.56);height:calc(var(--ch)*.56);margin-top:calc(var(--ch)*-.28);
  color:var(--c);opacity:.26;line-height:0;
  transition:opacity .2s var(--e9),transform .2s var(--e9)}
.v7-card .r9ic svg{width:100%;height:100%;display:block}
.v7-card:hover .r9ic{opacity:.42}
.v7-card.spent .r9ic{opacity:.14}
.v7-card.locked .r9ic{color:#6d5c3e;opacity:.3}
/* Ärmel hoch für den Titel: das Symbol liegt als WASSERZEICHEN unter der Schrift, nicht neben
   ihr. Als Geschwister in der Textzeile nahm es dem Titel die halbe Breite (gemessen: 43 statt
   72 px) — und der Fitter des Runners hört bei drei Zeilen auf zu verkleinern, also wurde
   »Fourth Wall, Please Open« schlicht abgeschnitten. Unter der Schrift kostet es keine Breite. */
.r9box>.ct{position:relative;z-index:1}
/* == Einkaufsliste (POP) ======================================================
   Ein normales Fenster wie Quest-Log und Roster — kein Aufsetzer ueber dem Bild. Was man
   kaufen kann, steht in einer Zeile mit dem, was es kostet; was man NICHT kaufen kann, steht
   trotzdem da, nur blass. Eine Liste, die nur das Erschwingliche zeigt, verschweigt das Ziel. */
.r9shop{display:flex;flex-direction:column;margin-top:7px}
.r9row{display:grid;grid-template-columns:26px 1fr auto auto;align-items:center;gap:12px;
  padding:9px 2px;font-family:'Special Elite',ui-monospace,monospace;color:#241d15}
.r9row+.r9row{border-top:1px solid rgba(31,26,20,.09)}
.r9row .k{font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;font-size:14px}
.r9row .t{font-size:12px;line-height:1.3}
.r9row .t em{display:block;font-style:normal;color:#6d5c3e;font-size:10px;margin-top:1px}
.r9row .v{font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;font-weight:700;font-size:15px;
  min-width:24px;text-align:right}
.r9row .buy{font-family:'Special Elite',ui-monospace,monospace;font-size:10.5px;letter-spacing:.04em;
  padding:6px 11px;border:0;cursor:pointer;color:#f7eed8;background:#2f6f86;
  box-shadow:0 0 0 1.6px ${INKC};white-space:nowrap;
  transition:transform .22s var(--e9),background .22s var(--e9)}
.r9row .buy:hover{background:#3d8aa5;transform:translateY(-1px)}
.r9row .buy:active{transform:translateY(0) scale(.97);transition-duration:.1s}
.r9row.no{opacity:.42}
.r9row.no .buy{background:#6d5c3e;cursor:not-allowed;transform:none}
/* Die Leiste hat EINE Breite — zugeklappt wie ausgefahren, schmal wie breit. Eine Leiste, die
   beim Zeigerkontakt oder beim Fensterwechsel die Breite ändert, lässt das ganze Bild zucken; und
   die sechs Werte sind immer da, nie eingeklappt. */
.r9stat{width:auto}
.v7.narrow{--r9w:clamp(112px,26vw,150px)}
/* == Tab: das Blatt wird zum Streifen ==
   Wie in v4: alles geht, es bleiben Fluff-Balken und POP-Zähler — aber MIT ihrem Blatt und der
   Tuschekante, sonst steht die Zahl unlesbar im Gras. Die Leiste bleibt, wo sie ist, und rollt auf
   Zeigerkontakt wieder aus: der Weg zu den Werten darf nicht vom Modus abhängen.

   ── EIN ZU FRÜH GESCHLOSSENER KOMMENTAR, gefunden am 11.8. ──────────────────────────────────────
   Hier standen ZWEI Absätze, und der erste endete mit einem Kommentar-Schluss. Die drei Zeilen des
   zweiten liefen damit als CSS weiter — und ungültiger Text vor einer Regel verschluckt die Regel:
   genau die darunter, die im TAB-Modus Insel, Knöpfe, Zieltafel und Quest-Fächer ausblendet.
   Der Befund sah nach einem Selektorfehler aus und war keiner: der Selektor traf das Element
   (»el.matches« sagte true), aber KEINE Regel im ganzen Shadow-Root setzte »display« darauf — die
   Regel existierte nicht mehr. Der TAB-Modus hat deshalb wahrscheinlich nie etwas ausgeblendet.
   *Ein Kommentar, der die Regel unter sich frisst, ist schlimmer als kein Kommentar.*

   Der erste Absatz sagte außerdem das Gegenteil des zweiten (»die Breite ist im Tab dieselbe, ob der
   Zeiger darauf liegt«). Georgs Vorgabe vom 11.8. entscheidet das: im TAB-Modus kompakt, auf
   Zeigerkontakt darf sie ausfahren. Der widersprechende Absatz ist deshalb weg, statt beides zu
   behaupten. */
.v7.lean .r9map,.v7.lean .r9ico,.v7.lean .r9near,.v7.lean .r9qpile,.v7.lean .r9deck,
.v7.lean .v7-card.locked{display:none!important}
/* ── v11-H12 · Der TAB-Modus zeigt ZWEI Dinge ───────────────────────────────────
   Georgs ursprüngliche Idee, jetzt gebaut: derselbe Kasten wie immer, aber kompakt — **nur der
   Lebensbalken und der POP-Stand**, keine Etiketten, kein Avatar, kein Name, kein Titel. Unten
   bleiben die Aktionskarten, alles andere ist weg. Das ist die Haltung »ich spiele jetzt, ich
   verwalte nicht«: Balken heißt, wie es mir geht, POP heißt, ob ich mir was leisten kann.

   Zwei Entscheidungen dabei:
   1 **Eine Zeile statt zwei.** Die Reihen werden nebeneinander gelegt (Balken links, POP rechts),
     nicht übereinander — bei zwei Auskünften ist eine Zeile die kompaktere Form, und der Kasten
     wird 248 px breit statt 434.
   2 **Alles gilt nur, solange NICHT ausgefahren** (»:not(.open)«). Wer mit dem Zeiger draufgeht,
     bekommt das volle Blatt zurück, mit Avatar, Namen, Etiketten und den sechs Werten. Der Weg zu
     den Werten darf nicht vom Modus abhängen — im TAB-Modus sieht man weniger, man verliert nichts.
   Die Etiketten sind weg, POP bleibt trotzdem eindeutig: die Farbe trägt die Bedeutung (Orange =
   POP, seit v11-H11 die Farbe des Richtungspfeils), und der Balken daneben ist unverwechselbar. */
.v7.lean .r9stat:not(.open) .lab,.v7.lean .r9stat:not(.open) .hp,
.v7.lean .r9stat:not(.open) .r2,.v7.lean .r9stat:not(.open) .who,
.v7.lean .r9stat:not(.open) .tit,.v7.lean .r9stat:not(.open) .titdd,
.v7.lean .r9stat:not(.open) .whoOK,.v7.lean .r9stat:not(.open) .whoNO,
.v7.lean .r9stat:not(.open) .r9acct em{display:none}
.v7.lean .r9stat:not(.open) .av{display:none!important}
.v7.lean .r9stat:not(.open) .sheet{width:248px}
.v7.lean .r9stat:not(.open) .ct{padding:10px 13px}
.v7.lean .r9stat:not(.open) .rows{flex-direction:row;align-items:center;gap:12px}
.v7.lean .r9stat:not(.open) .r1{order:1;flex:1;min-height:0}
.v7.lean .r9stat:not(.open) .r0{order:2;flex:none;width:auto;min-height:0;row-gap:0}
.v7.lean .r9stat:not(.open) .r0 .r9acct{grid-template-columns:auto;margin-left:0}
/* Im TAB-Modus zwei Pixel höher: der Balken ist dort die einzige Auskunft über den Zustand, und er
   steht ohne Zahl daneben. Zwei Pixel sind wenig — sie sind der Unterschied zwischen »ein Strich«
   und »eine Anzeige«. */
.v7.lean .r9stat:not(.open) .fluff{flex:1;width:auto;height:16px}
/* Beide Modi, ein Wert. Die zweite Zeile hebt hud-v7s eigene Abdunklung im TAB-Modus auf
   (».v7.lean .amb,.v7.lean .v7-card{opacity:.42}«, hud-v7.js:155) — die stammt aus der Zeit, als
   der TAB-Modus alles leiser machen sollte statt es wegzunehmen.
   Der Zeigerkontakt bleibt bei 1: hud-v7 regelt das mit ».v7-card:hover« (0,1,1), und die Regel
   hier ist mit (0,2,0) stärker — ohne die eigene Hover-Zeile hätte ich die Karten festgenagelt. */
/* ── v12-H10 · DIE FLUFF-BOX IST WIEDER DIE AUS v11, ZEICHENGLEICH ───────────────────────────
   Georg, 12.8.: »wieso kannst du nicht einfach die Fluff-Box aus v11 übernehmen? gibt es da ein
   technisches Problem?« — Nein. Es gab keins. Es war mein Umbau: ich habe die Box nachgebaut und
   dabei responsiv gemacht (v12-H1), und die Stufen haben die Kopfzeile umbrechen lassen. Danach
   habe ich die Anordnung ausgetauscht (v12-H8/H9), statt den Regler zurückzudrehen. Beides ist
   raus; die Maße von v11 stehen wieder da, wo sie standen: Blatt 446 / zugeklappt 434, Avatar 108,
   sein Polster 132, Fluff-Balken 118.
   *Wer eine Fassung ersetzt, die niemand beanstandet hat, muss beweisen, dass die neue besser ist —
   und das kann nur der, der sie ansieht.*

   Was aus der Runde bleibt, weil es eigene Befunde waren und die Box nicht anfasst:
     · Papier ist Papier, kein Glas (§4h Naht 11) — das Blatt lief wieder auf 0,78 mit;
     · --pad 13…22 statt 8…13 für alle vier Ecken des HUD (Georg: »zu eng am Rand«);
     · das Titel-Dreieck hat eine Trefferfläche von 31×28 statt 9×6;
     · die POP-account-Zeile im ausgefahrenen Blatt bleibt weg (ACCT_ZEILE). */
.r9stat{opacity:1}
.v7 .v7-card{opacity:var(--r9opCards)}
.v7.lean .v7-card{opacity:var(--r9opCards)}
.v7 .v7-card:hover,.v7 .v7-card:focus-visible,.v7 .v7-hand:hover .v7-card{opacity:1}
/* == Das Panel des Runners zeigt DASSELBE noch einmal ==========================
   Seit V10-S6 (POP) blendet der Runner seine eigene Statistik-Leiste wieder ein: FLUFF-Balken,
   XP-Balken mit 8 POP, Level-Zeile, drei Werte. Sie liegt oben links - also genau dort, wo
   unser Blatt liegt: die gruene Zahl schlug mitten durch den Fluff-Balken, und der dunkle
   Kasten des Panels lag als graugruene Platte ueber unserem Papier.
   Das ist keine Grafikstoerung, sondern ZWEI WAHRHEITEN IM SELBEN BILD.
   Erster Anlauf blendete nur die Zeilen weg - zu wenig: der Kasten selbst (Hintergrund,
   Rahmen, Polsterung) blieb stehen und nahm dem Papierblatt seine Wirkung. Jetzt faellt er mit.
   WAS BLEIBT, SIND DIE KAYFABE-LADUNGEN (.kf): die zeigt unser Blatt NICHT, und wer eine
   Anzeige versteckt, die er nicht ersetzt, nimmt dem Spiel eine Auskunft weg. */
/* Reicht die Bahn unten nicht fuer beides, steigt das Logbuch ueber die Karten - gesetzt von
   lane(), das die echten Rechtecke misst. Die Hoehe kommt ebenfalls gemessen (--r9hand),
   damit hier keine zweite Zahl steht, die spaeter nicht mehr stimmt. */
.v7.r9liftlog .v7-log{bottom:calc(var(--pad) + var(--r9hand,96px))}
.v7.r9liftlog .v7-log .lines{height:min(12vh,72px)}
.v7 .left .panel,.left .panel{background:none!important;border:0!important;
  box-shadow:none!important;padding:0!important;backdrop-filter:none!important}
.v7 .left .panel>*:not(.kf),.left .panel>*:not(.kf){display:none!important}
`;

/* ── Blätter zeichnen ───────────────────────────────────────────────────────
   Kanon-Regel 4: Fläche und Tusche teilen EINE Kontur. */
function fit(cv) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = cv.clientWidth || 120, h = cv.clientHeight || Math.round(120 / AR);
  const W = Math.max(8, Math.round(w * dpr)), H = Math.max(8, Math.round(h * dpr));
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  return { g: cv.getContext('2d'), W, H };
}
/* Die Feder. Der Kanon skaliert sie mit der Fläche — auf einer Karte richtig, auf einem Fenster
   falsch. Hier auf eine ABSOLUTE Breite normiert: jedes Blatt zeigt denselben Strich.
   GEMESSEN (9.8., Mittelzeile von links, dunkle Pixel gezählt): die Aktionskarte von v7 trägt
   6 Gerätepixel Band, unsere Blätter trugen 2. Georgs Vorgabe: die Aktionskarte ist das MAXIMUM,
   der Rest etwas dünner. REF_MIN 340 ergibt rund 4,5 — drei Viertel davon, sichtbar gezogen,
   ohne der Hand die Höchststärke streitig zu machen. */
function inkGain(W, H) {
  // Die Obergrenze muss hoch stehen: die Statleiste ist nur 56 Gerätepixel hoch, und eine zu
  // niedrige Klemme gab ausgerechnet dem flachsten Blatt die dünnste Kante (gemessen 3 gegen 4).
  return Math.max(0.18, Math.min(9, REF_MIN / Math.max(1, Math.min(W, H))));
}
function sheet(cv, seed, paint, gainMul) {
  const { g, W, H } = fit(cv);
  g.clearRect(0, 0, W, H);
  const pts = canon ? canon.contour('card', seed, W, H) : null;
  g.save();
  if (pts) { canon.pathOf(g, pts); g.clip(); }
  paint(g, W, H);
  g.restore();
  if (pts) canon.drawInk('card', g, pts, W, H, seed, inkGain(W, H) * (gainMul || 1));
}
function paper(g, W, H) {
  g.fillStyle = CREAM; g.fillRect(0, 0, W, H);
  const rg = g.createRadialGradient(W * 0.34, H * 0.22, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.82);
  rg.addColorStop(0, 'rgba(255,252,240,.55)'); rg.addColorStop(1, 'rgba(120,96,60,.16)');
  g.fillStyle = rg; g.fillRect(0, 0, W, H);
}
/* GEPARKT (Georg, 9.8.): der schwarze Rollen-Stempel. Bleibt stehen, damit er nicht neu erfunden
   werden muss, wenn die Blätter wieder größer werden — gerufen wird er nicht. */
function stamp(g, W, H, text) {
  if (!text) return;
  const fs = Math.max(8, Math.round(W * 0.052));
  g.save();
  g.font = fs + 'px "Special Elite",ui-monospace,monospace';
  g.textBaseline = 'top'; g.textAlign = 'left';
  const w = g.measureText(text).width, px = fs * 0.5, py = fs * 0.34;
  g.translate(W * 0.052, H * 0.072); g.rotate(-0.021);
  g.fillStyle = 'rgba(31,26,20,.88)'; g.fillRect(0, 0, w + px * 2, fs + py * 2);
  g.fillStyle = 'rgba(247,238,216,.94)'; g.fillText(text, px, py + 1);
  g.restore();
}
/* Das Textblatt ist der SOFORTZUSTAND (Builder-Regel 1), nicht der Ersatz. */
function titleSheet(g, W, H, card) {
  paper(g, W, H);
  const pad = Math.round(W * 0.085);
  g.fillStyle = INKC; g.textAlign = 'left'; g.textBaseline = 'top';
  let size = Math.round(W * 0.115);
  const words = String((card && card.t) || '\u2014').split(/\s+/);
  const lay = () => {
    g.font = size + 'px "Irish Grover","Special Elite",cursive';
    const ls = []; let l = '';
    for (const w of words) {
      const t = l ? l + ' ' + w : w;
      if (g.measureText(t).width > W - 2 * pad && l) { ls.push(l); l = w; } else l = t;
    }
    if (l) ls.push(l);
    return ls;
  };
  let lines = lay();
  while (lines.length > 3 && size > 8) { size = Math.round(size * 0.86); lines = lay(); }
  let y = Math.max(pad, (H - lines.length * size * 1.16) / 2);
  for (const line of lines.slice(0, 4)) { g.fillText(line, pad, y); y += size * 1.16; }
}
/* Kein Gutter: der gedruckte Rahmen der Karte wird überzogen, die Tuschekante ist die Kante.
   **Zwei Absichten, zwei Passungen** (10.8.): ein Daumennagel im Rail ist ein *Bild* — er darf
   überziehen, sonst steht Papier neben der Briefmarke. Eine große Vorlage ist die *Karte* — und die
   gedruckte Zelle trägt Titel, POWER und LORE selbst. `cover` schneidet sie weg (Zelle 1,81 gegen
   Blatt 1,74, der Titel beginnt an der linken Kante), `fit` zeigt sie. Kanon §3: einpassen, nie
   strecken, Rest bleibt cremefarben INNERHALB der Feder. */
function artSheet(g, W, H, art, fitten) {
  if (fitten) {
    paper(g, W, H);
    const s = Math.min(W / art.width, H / art.height);
    const aw = art.width * s, ah = art.height * s;
    g.drawImage(art, (W - aw) / 2, (H - ah) / 2, aw, ah);
    return;
  }
  const s = Math.max(W / art.width, H / art.height) * OVERSCAN;
  const aw = art.width * s, ah = art.height * s;
  g.drawImage(art, (W - aw) / 2, (H - ah) / 2, aw, ah);
}
/* ── Lebende Blätter ───────────────────────────────────────────────────────
   **Ein Blatt hängt nicht an seinem Rückruf.** Bis 9.8. wurde ein Blatt genau dann neu gezeichnet,
   wenn SEINE Anfrage settelte — und damit nie mehr, sobald die Anfrage aufgegeben wurde (Watchdog
   nach drei Anläufen) oder der Stapel sein Blatt zwischendurch neu gebaut hatte. Gemessen: zwei von
   vier Karten standen dauerhaft auf dem Textblatt, während ihr Motiv im Cache lag.

   Jetzt führt das Modul eine Liste der SICHTBAREN Blätter und gleicht sie im Takt ab: liegt Motiv
   im Cache, das dieses Blatt noch nicht trägt, wird gezeichnet; fehlt es, wird in Ruhe erneut
   gefragt. Abgehängte Blätter fallen aus der Liste. Der Zustand heilt sich damit selbst, egal was
   die Warteschlange getan hat — und der Wunsch »kein Platzhaltertext« hängt nicht mehr daran,
   dass genau ein Rückruf sein Ziel findet. */
const live = new Set();

/* ── Kartenkunst: EIN Modul, zwei Aufrufer (Review §3a) ────────────────────────
   `card-art-v9b.js` ist **ersatzlos gestrichen**. Das Motiv kommt jetzt aus dem Lead-Modul
   `card-art-2d.js` (`OW_ART`, art-v1.2). Es kann beide Wege — rohe Viertelseite und gemessene
   Zelle — und liest `card-grids.json` **neben sich selbst**, also aus dem Runner-Verzeichnis.
   Damit ist auch Konflikt (b) erledigt: kein Pfad auf `terrain-v13/` mehr, und die Crop-Zahlen
   haben wieder nur einen Ort.

   Was hier steht, ist **kein zweites Modul**, sondern ein Adapter von fünfundzwanzig Zeilen:
   das Rail braucht im Zeichentakt eine SYNCHRONE Antwort (`cached`), `OW_ART` liefert ein
   Versprechen. Der Adapter hält das Ergebnis fest — er rendert nichts und misst nichts.

   Für die Hand ist `art()` richtig, nicht `quarter()`: am Blatt in der Hand darf der Rand kein
   Papier sein. Die Viertelseite gehört dem Terrain-Reader. Zwei Wege, zwei Zwecke — so benannt
   im Kopf von `card-art-2d.js`. */
const ART = (function () {
  const hit = new Map(), miss = new Map(), bad = new Map(), pend = new Set();
  const key = (c) => (c && c.packId) + '#' + (c && c.n);
  const KFB = () => (window.OW_SRC ? window.OW_SRC.kfb('') : '');
  /* Das Deck-Verzeichnis. **Dieselbe Auswahlregel wie der Runner** (`loadDeck`, V9-B4b):
     mindestens 20 Karten · Spielart KFB · kein `medkayfab` · und **nur gemessene Raster**.
     Der letzte Punkt ist der wichtige: ein Deck ohne gemessenes `cardGrid` liefert
     angeschnittene Karten (Georgs Befund »die Karte ist zu stark im Anschnitt«) — der
     Rückfallwert in `card-art-2d.js` ist ausdrücklich geraten und sagt das auch in der Konsole.
     Eine Quest, die eine angeschnittene Karte zeigt, ist schlechter als eine Quest weniger. */
  const MEASURED = ['forget_utopia', 'ignore_dystopia', 'embrace_protopia'];
  let regP = null, regList = [];
  function registry() {
    if (regP) return regP;
    regP = fetch(KFB() + 'index.json').then((r) => r.json()).then((j) => {
      const all = (j.decks || []).filter((d) => d.cardCount >= 20 && d.gameMode === 'KFB'
        && !/^medkayfab/.test(d.packId));
      const good = all.filter((d) => d.cardGrid || MEASURED.indexOf(d.packId) >= 0);
      regList = good.length ? good : all;
      if (!good.length) console.warn('[rail-v9b] kein Deck mit gemessenem Raster — Quests könnten anschneiden');
      return regList;
    }).catch((e) => { console.warn('[rail-v9b] Deck-Verzeichnis:', e.message); regList = []; return regList; });
    return regP;
  }
  const cardsOf = new Map();
  return {
    ready() { return registry(); },
    decks() { return regList.slice(); },
    /* Kartenliste eines Decks — Feldnamen wie im Runner (`n` · `t` · `l`), damit ein Heft
       hier und dort dasselbe heißt. */
    deckCards(packId) {
      if (cardsOf.has(packId)) return Promise.resolve(cardsOf.get(packId));
      const d = regList.find((x) => x.packId === packId);
      if (!d || !d.data) { cardsOf.set(packId, []); return Promise.resolve([]); }
      return fetch(KFB() + encodeURIComponent(d.data)).then((r) => r.json()).then((dj) => {
        const arr = Array.isArray(dj) ? dj
          : (dj.cards || dj.items || Object.values(dj).find((v) => Array.isArray(v) && v.length > 5));
        const out = (arr || []).map((c) => ({ n: c.n != null ? c.n : c.cardNumber,
          t: c.t != null ? c.t : c.cardName, l: c.l != null ? c.l : c.lore })).filter((c) => c.t);
        cardsOf.set(packId, out); return out;
      }).catch((e) => { console.warn('[rail-v9b] Deck-Daten', packId + ':', e.message);
        cardsOf.set(packId, []); return []; });
    },
    cached(card) { return hit.get(key(card)) || null; },
    /* Ein Deck gilt erst nach drei Fehlversuchen als unlesbar — und **auch dann nur auf Zeit**.
       Ein einzelner Ausfall ist eine hängende Verbindung, kein kaputtes Deck; drei Ausfälle
       hintereinander sind meistens ein gedrosselter Tab, in dem der Wachhund von `card-art-2d`
       zuschlägt, weil kein Bild kommt. Wer daraus »unlesbar für immer« macht, löscht ein
       vollständig gesundes Deck wegen einer Minute im Hintergrund — genau der Almanach-Befund
       vom 10.8. Deshalb: 30 Sekunden Ruhe, dann noch einmal fragen.
       **Im versteckten Tab wird gar nicht erst gezählt** (siehe `art()`). */
    isBroken(pid) {
      if ((miss.get(pid) || 0) < 3) return false;
      const t = bad.get(pid) || 0;
      if (Date.now() - t < 30000) return true;
      miss.delete(pid); bad.delete(pid); return false;
    },
    art(card, done, fail) {
      const A = window.OW_ART;
      if (!A || !A.art) { if (fail) fail(); return; }
      const k = key(card);
      if (pend.has(k)) return;                       // eine Anfrage je Karte, nicht eine je Bild
      pend.add(k);
      A.art(card, { res: 640 }).then((r) => {
        pend.delete(k);
        if (r && r.canvas) { hit.set(k, r.canvas); miss.delete(card.packId); bad.delete(card.packId); if (done) done(); }
        else {
          /* Ein Fehlschlag im versteckten Tab ist eine Aussage über den Tab, nicht über das Deck. */
          if (!document.hidden) {
            const n = (miss.get(card.packId) || 0) + 1;
            miss.set(card.packId, n);
            if (n >= 3) bad.set(card.packId, Date.now());
          }
          if (fail) fail();
        }
      }).catch(() => { pend.delete(k); if (fail) fail(); });
    }
  };
})();

function cardSheet(cv, card, seed, fitten) {
  const CA = ART;
  const rec = { cv, card, seed, art: false, next: 0 };
  const draw = () => {
    const art = CA && CA.cached(card);
    rec.art = !!art;
    sheet(cv, seed, (g, W, H) => (art ? artSheet(g, W, H, art, fitten) : titleSheet(g, W, H, card)));
  };
  rec.draw = draw;
  draw();
  if (CA && card && card.packId && card.n) { live.add(rec); reconcile(); }
  return draw;
}
function reconcile() {
  const CA = ART;
  if (!CA) return;
  const now = Date.now();
  for (const rec of Array.from(live)) {
    if (!rec.cv.isConnected) { live.delete(rec); continue; }
    const art = CA.cached(rec.card);
    if (art) { if (!rec.art) rec.draw(); continue; }
    /* Ein unlesbares Deck fragt man nicht alle vier Sekunden neu — aber man wirft das Blatt auch
       nicht weg: `isBroken` gilt auf Zeit, und danach ist der nächste Anlauf fällig. Bis 10.8.
       flog der Eintrag hier aus der Liste und das Blatt blieb Text, bis es neu gebaut wurde. */
    if (CA.isBroken && CA.isBroken(rec.card.packId)) { rec.next = now + 5000; continue; }
    if (now < rec.next) continue;
    rec.next = now + 4000;
    CA.art(rec.card, rec.draw, rec.draw);
  }
}

/* ── Die Insel als Kartenblatt ─────────────────────────────────────────────── */
function makeMap(game, cv) {
  let baked = null, bakedFor = null, geo = null, target = null;
  function bake() {
    const W = game.W, H = game.H, land = game.land;
    if (!W || !land) return null;
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    const o = off.getContext('2d'), img = o.createImageData(W, H);
    for (let i = 0; i < W * H; i++) {
      const v = land[i], c = v === 2 ? LAND : (v === 1 ? SAND : [42, 104, 110]);
      img.data[i * 4] = c[0]; img.data[i * 4 + 1] = c[1]; img.data[i * 4 + 2] = c[2]; img.data[i * 4 + 3] = 255;
    }
    o.putImageData(img, 0, 0);
    return off;
  }
  function nearest() {
    const h = game.hero, open = (game.zones || []).filter((z) => !z.cleared && !z.noProgress);
    if (!h) return null;
    if (!open.length) return game.tavern
      ? { x: game.tavern.x, y: game.tavern.y, label: 'The tavern' } : null;
    let best = null, bd = 1e18;
    for (const z of open) {
      const zx = (z.x + z.w / 2) * 64, zy = (z.y + z.h / 2) * 64;
      const d = (zx - h.x) * (zx - h.x) + (zy - h.y) * (zy - h.y);
      if (d < bd) { bd = d; best = { x: zx, y: zy, z, label: (z.card && z.card.t) || z.biome }; }
    }
    return best;
  }
  function paint() {
    if (!game.ready || !game.land) return;
    const sig = game.att.seed + '|' + game.att.layout + '|' + game.W;
    if (bakedFor !== sig) { baked = bake(); bakedFor = sig; }
    if (!baked) return;
    target = nearest();
    sheet(cv, 17, (g, W, H) => {
      g.imageSmoothingEnabled = false;
      g.fillStyle = SEA; g.fillRect(0, 0, W, H);
      const sc = Math.min(W * 0.955 / game.W, H * 0.955 / game.H);
      const iw = game.W * sc, ih = game.H * sc, ox = (W - iw) / 2, oy = (H - ih) / 2;
      g.drawImage(baked, ox, oy, iw, ih);
      geo = { ox, oy, sc, W, H };
      g.imageSmoothingEnabled = true;
      const toX = (wx) => ox + wx / 64 * sc, toY = (wy) => oy + wy / 64 * sc;
      const r = Math.max(2.4, W * 0.017);
      for (const z of (game.zones || [])) {
        if (z.noProgress) continue;
        const x = toX((z.x + z.w / 2) * 64), y = toY((z.y + z.h / 2) * 64);
        g.lineWidth = Math.max(1.2, W * 0.0065);
        if (z.cleared) {
          g.strokeStyle = 'rgba(239,226,196,.92)';
          g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
        } else {
          g.fillStyle = '#c8622a'; g.strokeStyle = INKC;
          g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke();
        }
      }
      if (game.tavern) {
        const x = toX(game.tavern.x), y = toY(game.tavern.y), s = r * 1.45;
        g.fillStyle = '#d8763f'; g.strokeStyle = INKC; g.lineWidth = Math.max(1.1, W * 0.0055);
        g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + s * 0.9, y + s * 0.75);
        g.lineTo(x - s * 0.9, y + s * 0.75); g.closePath(); g.fill(); g.stroke();
      }
      const h = game.hero;
      if (h && target) {
        const x0 = toX(h.x), y0 = toY(h.y), x1 = toX(target.x), y1 = toY(target.y);
        const a = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0);
        if (len > r * 3) {
          g.save();
          g.strokeStyle = 'rgba(31,26,20,.6)'; g.lineWidth = Math.max(1.1, W * 0.005);
          g.setLineDash([W * 0.017, W * 0.015]);
          g.beginPath(); g.moveTo(x0 + Math.cos(a) * r * 1.8, y0 + Math.sin(a) * r * 1.8);
          g.lineTo(x1 - Math.cos(a) * r * 1.9, y1 - Math.sin(a) * r * 1.9); g.stroke();
          g.restore();
        }
      }
      if (h) {
        const x = toX(h.x), y = toY(h.y);
        g.fillStyle = '#fff'; g.strokeStyle = INKC; g.lineWidth = Math.max(1.3, W * 0.0075);
        g.beginPath(); g.arc(x, y, r * 0.92, 0, 7); g.fill(); g.stroke();
      }
    });
  }
  paint.geo = () => geo;
  paint.target = () => target;
  return paint;
}

function store(game) {
  const KEY = 'kfb.v9b.rail.' + (game.att ? game.att.seed : 0);
  let s = { actor: null, quests: [], stats: {} };
  try { const j = JSON.parse(localStorage.getItem(KEY) || 'null'); if (j) s = Object.assign(s, j); } catch (e) {}
  if (!s.stats) s.stats = {};
  /* Wer schon einen Actor hat, hat die Zeremonie hinter sich — ein alter Spielstand wird nicht
     zurück an den Anfang geschickt, nur weil das Ritual neu ist. */
  if (s.actor && !(s.intro && s.intro.done)) s.intro = { done: true, grandfathered: true };
  return { get() { return s; }, save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} } };
}
function rand(a) { let x = (a | 0) || 1; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }

function install(game) {
  const sh = game.shadowRoot, root = sh && sh.querySelector('.v7');
  if (!root || game._r9) return;
  game._r9 = true;
  const st = document.createElement('style'); st.textContent = CSS; sh.appendChild(st);
  const mapw = root.querySelector('.mapw'), deckw = root.querySelector('.v7-deck');
  if (!mapw || !deckw) { console.warn('[rail-v9b] v7-HUD hat keinen Kartenplatz'); return; }
  /* Die vier Rückseiten einmal beim Anhängen holen. Der Stapel wird beim Öffnen der Bühne gebaut
     und kann dort nicht warten — ohne Vorlauf blitzt beim ersten Ziehen ein leerer Rahmen. */
  if (window.OW_BACKS) OW_BACKS.vorladen('kfb')
    .then((s) => console.log('[rail-v9b] Rückseiten', s.satz, s['blätter'], 'geladen', s.geladen, 'gefehlt', s.gefehlt))
    .catch(() => {});
  const S = store(game), state = S.get();
  const CA = ART;
  /* Die zwei Maße stehen als ELEMENTE im Bild, nicht als Zahl im Kopf: klein ist die Aktionskarte
     (Georgs Vorgabe »größe wie action cards«), groß ist die Insel. `getPropertyValue` auf eine
     CSS-Variable liefert hier nur den Text "clamp(…)" — `parseFloat` daran war stumm NaN und der
     Stapel lief auf seinen Ersatzzahlen. */
  const smallW = () => {
    const c = root.querySelector('.v7-card');
    return (c && c.clientWidth) || 92;
  };
  const bigW = () => (mapEl && mapEl.clientWidth) || Math.round(smallW() * 1.95);
  const mk = (cls) => { const el = document.createElement('div'); el.className = 'r9c ' + cls;
    el.innerHTML = '<canvas></canvas>'; return el; };

  /* ── Fächer: zwei Ringe statt zweier Listen ───────────────────────────────
     Georgs Vorgabe (9.8.): **immer offen** · **gleiche Blattgröße wie die Aktionskarten**, damit
     die Spalte nicht breiter wird · **Drehpunkt rechts AUSSERHALB**, die Blätter schwingen nach
     links ins Bild · und ab dem siebten Blatt ein **echter Ring** — man sieht sie kommen.

     Die Geometrie steht in einer Formel, nicht in einer Tabelle: ein Kreisbogen mit dem
     Mittelpunkt rechts neben der Spalte. Jedes Blatt sitzt am selben Ort und wird nur GEDREHT —
     die Drehung um einen fernen Punkt verschiebt es fast senkrecht und neigt es dabei leicht.
     Das ist derselbe Zug wie bei den Handkarten unten, nur hochkant.

     **Warum sich die Blattgröße nicht mehr ändert:** die Blätter sind Canvas. Eine CSS-Skalierung
     weicht die Tuschekante auf, also müsste jede Größenänderung ein Neuzeichnen auslösen — beim
     Drehen wäre das ein Neuzeichnen je Bild. Feste Größe heißt: Drehen kostet nur `transform`
     und `opacity`, und die Tusche bleibt scharf. Gezeichnet wird nur, wenn sich die SPALTE ändert.

     **Der Radius ist aus der Blattbreite gerechnet** (×5), nicht gesetzt: er bestimmt beides —
     wie stark die Blätter neigen und wie weit der Fächer nach links ausgreift. Bei sechs Blättern
     sind das rund 10° am Rand und keine 8 px Ausgriff. Ein kleinerer Radius sähe wilder aus und
     würde die Spalte verbreitern; genau das war die Vorgabe »nicht viel breiter als jetzt«. */
  const VIS = 6;                       // Blätter im Fächer; alles darüber liegt auf dem Ring
  function makePile(host, dir) {
    const cards = [];                  // {el, draw, card}
    let off = 0, want = 0, raf = 0, hot = false;
    const geo = (n) => {
      const cw = smallW(), ch = cw / AR;
      const R = cw * 5;                                  // Drehpunkt rechts außerhalb
      /* **Der Zeigerkontakt öffnet den Fächer weiter — er vergrößert die Blätter nicht.**
         Georgs Vorgabe war: eine Größe für beide Zustände. Ohne einen zweiten Zustand las sich
         der Fächer aber wie der alte Stapel — zwei Blätter bei 4° Neigung sehen aus wie zwei
         Blätter übereinander. Also ändert der Kontakt den SCHRITT, nicht das Maß: aus 0,62
         Blatthöhen werden 1,02 — die Blätter rücken auseinander, die Tusche bleibt scharf,
         und die Spalte wird trotzdem nicht breiter. */
      const stepPx = ch * (hot ? 1.02 : 0.62);
      const stepDeg = (stepPx / R) * 180 / Math.PI;
      /* Der Fächer ist so hoch wie das, was WIRKLICH darin liegt — nicht so hoch wie sechs
         Bätter, wenn zwei drin sind. Sonst reserviert die Spalte Platz für Karten, die es
         nicht gibt, und das Bild sieht aus, als fehlte etwas. */
      const shown = Math.max(1, Math.min(VIS, n || 1));
      const half = (shown - 1) / 2;
      const spanPx = 2 * R * Math.sin(half * stepDeg * Math.PI / 180);
      return { cw, ch, R, stepDeg, half, spanPx, H: spanPx + ch };
    };
    function lay() {
      const n = cards.length;
      const g = geo(n);
      host.style.width = g.cw + 'px';
      host.style.height = (n ? g.H : 0) + 'px';
      const cy = g.H / 2;
      /* Bis sechs Blätter steht der Fächer **mittig um seine Mitte**; ab dem siebten führt der
         Ring, und dann gehört die Mitte dem vordersten Blatt — sonst würde beim Drehen der
         ganze Fächer wandern statt der Blätter darin. */
      const ring = n > VIS;
      const mid = ring ? 0 : (n - 1) / 2;
      /* **Der Ausgriff nach rechts wird ausgeglichen, nicht in Kauf genommen.** Eine Drehung um
         einen Punkt rechts außerhalb schiebt das Blatt nicht nur nach unten, sondern auch ein
         Stück nach rechts — beim äußersten Blatt des Rings waren das gemessen 36 px, und die
         standen über dem Bildrand hinaus. Also rückt der Fächer um genau diesen Betrag nach
         links und der Drehpunkt wandert mit: die äußersten Blätter schließen bündig ab. */
      const maxTh = (ring ? (g.half + 1) : g.half) * g.stepDeg * Math.PI / 180;
      const EXC = Math.round(g.R * (1 - Math.cos(maxTh)) + (g.ch / 2) * Math.sin(maxTh));
      cards.forEach((c, i) => {
        /* **Der kürzeste Weg auf dem Ring**, nicht der Abstand in der Liste. Ohne diese Faltung
           wäre das letzte Blatt n−1 Schritte vom ersten entfernt statt einen — der Ring wäre
           eine Liste mit Sprung am Ende. */
        let d;
        if (ring) { d = ((i - off) % n + n) % n; if (d > n / 2) d -= n; }
        else d = i - mid;
        const th = d * g.stepDeg;
        /* Ein Blatt über dem Rand blendet aus, statt zu verschwinden: so sieht man beim Drehen,
           dass da noch etwas kommt. */
        const vis = Math.max(0, Math.min(1, (g.half + 1) - Math.abs(d)));
        const el = c.el.style;
        el.width = g.cw + 'px'; el.height = g.ch + 'px';
        el.left = (-EXC) + 'px'; el.right = 'auto';
        el.top = (cy - g.ch / 2) + 'px'; el.bottom = 'auto';
        el.transformOrigin = (g.cw + g.R + EXC) + 'px ' + (g.ch / 2) + 'px';
        el.transform = 'rotate(' + th.toFixed(2) + 'deg)';
        /* Waehrend das Rad laeuft, darf keine Uebergangszeit auf transform liegen - sie wuerde
           gegen die Bild-fuer-Bild-Rechnung arbeiten und das Drehen zaeh machen. Beim Oeffnen
           und Schliessen des Faechers ist sie dagegen genau das, was die Bewegung weich macht. */
        el.transition = raf ? 'opacity .25s var(--e9)'
          : 'opacity .25s var(--e9),top .38s var(--e9),transform .38s var(--e9)';
        el.opacity = vis.toFixed(2);
        el.pointerEvents = vis > 0.5 ? 'auto' : 'none';
        el.zIndex = String(100 - Math.round(Math.abs(d) * 10));
      });
      for (const c of cards) c.draw();
    }
    /* Nachlauf statt Sprung: das Rad dreht weich aus. Der Ring läuft nur, solange sich etwas
       bewegt — keine Dauerschleife im Hintergrund. */
    function spin() {
      if (raf) return;
      const tick = () => {
        const d = want - off;
        if (Math.abs(d) < 0.002) { off = want; raf = 0; lay(); return; }
        off += d * 0.18; lay();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    const turnable = () => cards.length > VIS;
    /* Nichts startet sofort: ein Fächer, der beim bloßen Vorbeifahren aufspringt, flackert.
       Also wartet er, ob der Zeiger wirklich BLEIBT — und beim Verlassen kurz, ob er wiederkommt.
       Das ist der Unterschied zwischen nervös und ruhig (dieselbe Regel wie im alten Stapel). */
    const HOVER_IN = 220, HOVER_OUT = 200;
    let intent = 0;
    const setHot = (v) => { if (hot === v) return; hot = v; host.classList.toggle('hot', v); lay(); };
    host.addEventListener('mouseenter', () => {
      clearTimeout(intent); intent = setTimeout(() => setHot(true), HOVER_IN);
    });
    host.addEventListener('mouseleave', () => {
      clearTimeout(intent); intent = setTimeout(() => setHot(false), HOVER_OUT);
    });
    host.addEventListener('wheel', (e) => {
      if (!turnable()) return;
      e.preventDefault(); e.stopPropagation();
      want += Math.sign(e.deltaY);
      spin();
    }, { passive: false });
    /* Ziehen dreht ebenfalls — der Weg wird in Blätter umgerechnet, nicht in Grad: so fühlt sich
       eine Handbreite immer gleich viel an, egal wie groß die Spalte gerade ist. */
    let drag = null;
    host.addEventListener('pointerdown', (e) => {
      if (!turnable()) return;
      drag = { y: e.clientY, off: want, moved: 0 };
      host.setPointerCapture(e.pointerId);
    });
    host.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dy = e.clientY - drag.y;
      drag.moved = Math.max(drag.moved, Math.abs(dy));
      want = drag.off - dy / (geo(cards.length).ch * 0.62);
      spin();
    });
    const endDrag = (e) => {
      if (!drag) return;
      /* Ein Zug ist kein Klick. Ohne diese Sperre öffnet das Blatt, auf dem der Finger
         losgelassen wird, seine Karte — und das Drehen fühlt sich an wie ein Fehlgriff. */
      if (drag.moved > 4) { host._r9drag = Date.now(); want = Math.round(want); spin(); }
      drag = null;
      try { host.releasePointerCapture(e.pointerId); } catch (err) {}
    };
    host.addEventListener('pointerup', endDrag);
    host.addEventListener('pointercancel', endDrag);
    return {
      set(list) {
        host.innerHTML = ''; cards.length = 0; off = 0; want = 0;
        list.forEach((it) => {
          const el = mk(it.cls || 'r9scene');
          el.title = it.title || '';
          if (it.click) el.onclick = (ev) => {
            if (host._r9drag && Date.now() - host._r9drag < 300) return;
            it.click(ev);
          };
          host.appendChild(el);
          cards.push({ el, draw: () => {}, card: it.card });
        });
        // erst hängen, dann zeichnen: ein Blatt kennt seine Größe erst im Fächer
        lay();
        cards.forEach((c, i) => {
          c.draw = cardSheet(c.el.querySelector('canvas'), list[i].card, list[i].seed);
        });
        lay();
      },
      lay, get els() { return cards.map((c) => c.el); },
    };
  }
  /* 1 · Insel */
  const mapEl = mk('r9map');
  mapEl.title = 'click the island to travel';
  mapw.insertBefore(mapEl, mapw.firstChild);
  const paintMap = makeMap(game, mapEl.querySelector('canvas'));
  mapEl.addEventListener('click', (ev) => {
    const geo = paintMap.geo(); if (!geo) return;
    const r = mapEl.getBoundingClientRect();
    const px = (ev.clientX - r.left) / r.width * geo.W, py = (ev.clientY - r.top) / r.height * geo.H;
    const wx = (px - geo.ox) / geo.sc * 64, wy = (py - geo.oy) / geo.sc * 64;
    /* **Die Nachsicht gehört dem Anker, nicht dem Klick** (v10-S1h). Der Runner nimmt ohne
       viertes Argument **drei Felder** Umkreis — auf einer 112 px breiten Insel für 240 Felder
       ist ein Pixel zwei Felder, die Nachsicht also größer als die Genauigkeit: jeder Klick
       fand irgendein Ufer. Das ist der Strand-Teleport. Klicks rufen mit **1**, benannte Orte
       mit der Vorgabe. `hud-v7.js:858` macht es genauso — wer den Kompaß ersetzt, erbt die Regel. */
    if (game.travelPoint) game.travelPoint(wx, wy, 'the map', 1);
    else if (game.setMoveTarget) game.setMoveTarget(wx, wy);
  });

  /* ── Tiny-Swords-Knöpfe ─────────────────────────────────────────────
     Die Adresse kommt aus dem **Baukasten** (`ui-kit-ts.js`), nicht mehr aus `paper-atlas.js`.
     Vorher rechnete diese Stelle sich Adressen aus, indem sie in einer fremden URL `Regular_`
     gegen `Pressed_` tauschte und den Icons-Ordner gegen den Resources-Ordner — dieselbe Liste
     an zwei Orten, nur als Textersatz getarnt. Jetzt steht jeder Name EINMAL, in der Teileliste.

     `src()` ist bewusst der synchrone Weg: dieses Chrome wird beim Anhängen gebaut und kann
     nicht auf das Laden warten. Gemessene Blätter (9-Slice, Bänder, Leisten) kommen über
     `OW_UIKIT.load()`, bloße Bildadressen über `src()` — eine Liste, zwei Zugriffsarten.

     Georg will die Pressed-Fassung (die mit der dunklen Kante): sie steht frei im Bild, ohne
     Kasten, und braucht deshalb einen kräftigeren Umriss als die helle Regular-Fassung. */
  const UK = window.OW_UIKIT;
  if (!UK) console.warn('[rail-v9b] ui-kit-ts.js fehlt — Knöpfe bleiben leer');
  const iconUrl = (name, style) => {
    if (!UK || !UK.iconSrc) return '';
    try { return UK.iconSrc(name, (style || 'Pressed').toLowerCase()); }
    catch (e) { console.warn('[rail-v9b]', e.message); return ''; }
  };
  /* Zwei Münzblätter, zwei Zwecke (gemessen 9.8.):
     `G_Idle.png` ist 128×128, EIN Bild — die ruhende Münze. Die gehört an die Zähler.
     `G_Spawn.png` ist 896×128, sieben Bilder — und Bild 1 ist der weiße Blitz, nicht die Münze.
     Als Zähler wäre das ein Fleck; als Gewinn-Wurf ist genau dieser Blitz der Mario-Moment. */
  const COIN = UK ? UK.src('coinIdle') : '', COIN_SPIN = UK ? UK.src('coinSpin') : '';
  /* Die POP-Fassung ist ein ANDERES Teil als die Muenze: der runde blaue Knopf traegt die Zahl,
     die Goldmuenze fliegt beim Gewinn. Zwei Rollen, zwei Bilder — wer beides aus einem Blatt
     nimmt, hat entweder eine Muenze, auf der Text schlecht lesbar ist, oder einen Knopf,
     der durch die Luft segelt. */
  const ROUND = UK ? UK.src('btnRoundS') || UK.src('btnRound') : '';
  const ROUND_DN = UK ? UK.src('btnRoundSP') : '';
  /* Der Zielpfeil ist ein eigenes Blatt (Icon_08, orange) und zeigt im Blatt nach LINKS —
     die 180 Grad stehen unten bei der Peilung, nicht hier. */
  const ARROW = UK ? UK.src('arrowNear') : '';
  /* Das Schliess-Blatt als CSS-Variable: die Regel steht im Stylesheet, die Adresse kommt aus dem
     Atlas. In Anfuehrungszeichen, weil der Tiny-Swords-Ordner Klammern im Namen hat. */
  root.style.setProperty('--r9x', 'url("' + iconUrl('close', 'Regular') + '")');
  /* Das Tagebuch des Runners liegt AUSSERHALB von .v7 — die Variable muss deshalb auch am
     Wurzelknoten des Shadow-DOM stehen, sonst erbt es sie nicht. */
  if (sh.host) sh.host.style.setProperty('--r9x', 'url("' + iconUrl('close', 'Regular') + '")');
  const icoBar = document.createElement('div');
  icoBar.className = 'r9ico';
  const mkIco = (name, title, fn, cls) => {
    const b = document.createElement('button');
    b.type = 'button'; b.title = title;
    if (cls) b.className = cls;
    const im = document.createElement('img');
    im.src = name === 'aim' ? (ARROW || (UK && UK.pointerSrc ? UK.pointerSrc('arrow') : '')) : iconUrl(name);
    im.alt = title;
    b.appendChild(im);
    /* Ein Knopfdruck ist kein Spielzug: sonst hört die Welt darunter mit und der Held läuft los. */
    b.addEventListener('pointerdown', (ev) => ev.stopPropagation());
    b.onclick = fn;
    icoBar.appendChild(b);
    return b;
  };
  /* Reihenfolge: Peilung, Ton, Einstellungen — vom häufigsten zum seltensten Griff.
     Aus heißt grau: das Icon selbst IST die Aus-Stellung, kein zweites Symbol. */
  const aimBtn = mkIco('aim', 'Travel to the nearest page', () => {
    const t = paintMap.target(); if (!t) return;
    /* Die Peilung zeigt auf einen **benannten Ort** — hier ist die Vorgabe (drei Felder) richtig,
       weil der Zielpunkt bewusst unter dem Anker liegt. Nicht mit dem Insel-Klick verwechseln. */
    if (game.travelPoint) game.travelPoint(t.x, t.y, 'the compass');
    else if (game.setMoveTarget) game.setMoveTarget(t.x, t.y);
  }, 'aim');
  const sndBtn = mkIco('sound', 'Sound on / off', () => {
    const on = !(game.audio ? game.audio.enabled !== false : game.att.sound !== false);
    game.att.sound = on;
    if (game.audio) game.audio.enabled = on;
    syncSound();
    if (game.syncSettings) game.syncSettings();
  });
  function syncSound() {
    const on = game.audio ? game.audio.enabled !== false : game.att.sound !== false;
    sndBtn.classList.toggle('off', !on);
    sndBtn.title = on ? 'Sound is on' : 'Sound is off';
  }
  const gearOrig = root.querySelector('.cog');
  mkIco('gear', 'Settings & keys', (e) => {
    if (e) e.stopPropagation();
    halt();
    if (gearOrig) gearOrig.click();
  });
  syncSound();

  /* 2 · »Nearest«: der Titel auf einem Blatt, die Peilung oben im Zeigerknopf */
  const near = document.createElement('div');
  near.className = 'r9near off';
  near.innerHTML = '<div class="plate"><canvas></canvas><b></b></div>';
  mapw.appendChild(near);
  /* Der Titel liegt auf einem BLATT, nicht auf einem CSS-Rahmen. Eine 1,5-px-Linie neben lauter
     gezogenen Kanten liest sich als dünner, auch wenn sie es kaum ist — also dieselbe Feder wie
     überall, mit eigenem Seed.

     **Der Faktor gehört in den linearen Bereich, nicht unter die Klemme.** Solange `inkGain` in
     `Math.min(9, …)` läuft, ändert der Faktor gar nichts — genau das ist hier passiert: bei 20 px
     Leistenhöhe lag die Verstärkung bei 8,5, und ich habe den Faktor blind von 1,34 auf 0,9
     heruntergelaufen. Mit 24 px (Polster 5) liegt sie bei 7,1, die Klemme greift nicht mehr und der
     Faktor wirkt wieder proportional. Merksatz: erst prüfen, ob die Klemme greift, dann messen. */
  const nearEdge = near.querySelector('.plate canvas');
  /* **Farbcode statt zweiter Zahl** (Georg, 9.8.): das Blatt traegt die Naehe als Ton, nicht als
     Ziffer — heiss orange heisst »fast da«, blass heisst »weit«. Der Ton wird MULTIPLIZIERT auf
     das Papier gelegt, nicht darueber gemalt: so bleibt die Koernung des Blattes sichtbar und die
     Tuschekante unberuehrt. Ein flaechiger Anstrich haette aus dem Papier eine Farbkarte gemacht.
     Die Schwellen sind Schritte (64 px = ein Feld), damit sie dieselbe Einheit haben wie der Tipp. */
  const NEAR_TONES = [[4, '#ff9a52'], [10, '#ffc086'], [1e9, '#ffe3c0']];
  let nearTone = NEAR_TONES[NEAR_TONES.length - 1][1];
  const paintNear = () => sheet(nearEdge, 173, (g, W, H) => {
    paper(g, W, H);
    g.globalCompositeOperation = 'multiply';
    g.fillStyle = nearTone; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'source-over';
  }, 1.0);
  if ('ResizeObserver' in window) new ResizeObserver(paintNear).observe(near.querySelector('.plate'));
  near.onclick = () => aimBtn.click();

  /* 3 · Quest-Log: die zuletzt ausgelobte Karte vorn, der Rest gestaffelt DARUNTER */
  const qPileEl = document.createElement('div');
  qPileEl.className = 'r9pile r9qpile';
  mapw.appendChild(qPileEl);
  const qPile = makePile(qPileEl, 'top');
  /* Eine Spalte, eine Reihenfolge: Insel \u2192 Knöpfe \u2192 Nearest \u2192 Quest-Stapel. Der Einbau oben
     hängt die Stücke an, sobald sie entstehen; hier wird die Reihenfolge einmal geradegezogen. */
  /* v11-H6 · Eine Reihe oben (Knöpfe neben der Insel), darunter Zieltitel, Peilung, Quest-Fächer.
     Die Peilung bekommt eine eigene Zeile, weil sie links bündig steht und die anderen zwei Knöpfe
     rechts oben — dieselbe Klasse, zwei Plätze, ein Aussehen. */
  const topRow = document.createElement('div');
  topRow.className = 'r9top';
  const aimRow = document.createElement('div');
  aimRow.className = 'r9ico r9aim';
  aimRow.appendChild(aimBtn);
  topRow.appendChild(icoBar);
  topRow.appendChild(mapEl);
  const row2 = document.createElement('div');
  row2.className = 'r9row2';
  row2.appendChild(aimRow);
  row2.appendChild(qPileEl);
  mapw.appendChild(topRow);
  mapw.appendChild(near);
  mapw.appendChild(row2);

  /* 4 · Almanach: Actor vorn, geräumte Szenen dahinter — fächert nach OBEN */
  const deck = document.createElement('div'); deck.className = 'r9deck';
  const call = document.createElement('button'); call.className = 'r9call';
  const almPileEl = document.createElement('div'); almPileEl.className = 'r9pile r9alm';
  deck.appendChild(call); deck.appendChild(almPileEl);
  deckw.appendChild(deck);
  const almPile = makePile(almPileEl, 'bottom');
  call.onclick = () => {
    if (game.openAfterglow) game.openAfterglow();
    else if (game.msg) game.msg('The King is not in the tavern yet.');
  };

  /* ── Kurzhinweise: GEPARKT (Georg, 9.8.) ────────────────────────────────────
     Erst kamen sie sofort, dann nach 2,4 s — beides flackerte im Kampf, wenn der Zeiger über die
     Hand fährt. Jetzt werden sie beim Überfahren ABGEHÄNGT und nicht wieder angehängt. Der Satz
     geht nicht verloren: er liegt in `data-r9tip`, und wer ihn zurückholen will, setzt TIP_ON. */
  const TIP_ON = false;
  let tipEl = null, tipT = 0;
  const tipOff = (el) => {
    if (!el || el.dataset.r9tip != null) return;
    const t = el.getAttribute('title');
    if (t == null || t === '') return;
    el.dataset.r9tip = t; el.removeAttribute('title');
  };
  const tipOn = (el) => {
    if (!TIP_ON || !el || el.dataset.r9tip == null) return;
    el.setAttribute('title', el.dataset.r9tip); delete el.dataset.r9tip;
  };
  root.addEventListener('mouseover', (e) => {
    const el = e.target && e.target.closest && e.target.closest('[title],[data-r9tip]');
    if (!el || el === tipEl) return;
    tipOn(tipEl); clearTimeout(tipT);
    tipEl = el; tipOff(el);
    if (TIP_ON) tipT = setTimeout(() => { if (tipEl === el) tipOn(el); }, 2400);
  }, true);
  root.addEventListener('mouseout', (e) => {
    const el = e.target && e.target.closest && e.target.closest('[title],[data-r9tip]');
    if (!el || el !== tipEl) return;
    clearTimeout(tipT); tipOff(el); tipEl = null;
  }, true);

  /* Das Logbuch weckt auch die Eingabe des Spielers, nicht nur eine neue Zeile. */
  const logw = root.querySelector('.v7-log');
  let logT = 0;
  function wakeLog() {
    if (!logw) return;
    logw.classList.remove('idle');
    clearTimeout(logT);
    logT = setTimeout(() => logw.classList.add('idle'), 6000);
  }
  if (logw) {
    for (const ev of ['keydown', 'pointerdown', 'wheel']) game.addEventListener(ev, wakeLog, true);
    logw.classList.add('idle');
  }

  /* ── Dialoge und die Welt trennen ─────────────────────────────────────
     Zwei Befunde, eine Wurzel: ein Fenster hält die Uhr an, löscht aber das LAUFZIEL nicht. Wer
     vor dem Öffnen irgendwohin geklickt hat, läuft nach dem Schließen dorthin weiter — und das
     liest sich wie »ich klicke links und laufe rechts«, weil der neue Klick auf dem Dialog lag und
     die Welt gar nicht erreichte. Also: wer pausiert, räumt auch den Weg ab.
     Und der Klick auf den Hintergrund SCHLIESST nur — er ist kein Spielzug. Erst der nächste. */
  function halt() {
    game.moveTarget = null; game.path = null; game.attackTarget = null;
    game.keys = {};
  }
  function guardWin(w) {
    if (!w || w._r9guard) return;
    w._r9guard = true;
    w.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (e.target !== w) return;                 // nur der Hintergrund schließt
      e.preventDefault();
      const cb = w.querySelector('.close');
      if (cb) cb.click();
      else { w.classList.remove('on'); game._ow7Paused = false; game.paused = false; }
    }, true);
  }
  for (const w of root.querySelectorAll('.v7-win')) guardWin(w);

  /* ═══ EIN KONZEPT FÜR KLICKS: HUD gegen WELT ═══════════════════════════════

     Der Streit »HUD oder Terrain« wird an EINER Stelle entschieden, nicht in fünfzehn Handlern.

     1 **Die Torwache steht ganz vorn.** Ein `pointerdown` in der Fangphase am Shadow-Root sieht
       jeden Klick als Erster. Enthält sein Weg ein Bedienteil (`[data-r9ui]` oder v7s eigenes
       Möbel), ist der Klick VERBRAUCHT: er wird gestoppt und erreicht die Welt nie.
     2 **Was zur Welt gehört, klaut ihm niemand.** Alles, was nicht bedienbar ist, steht auf
       `pointer-events:none` — geprüft: von zehn HUD-Stellen leitet keine einen Weltklick um.
     3 **Ein Dialog schluckt genau einen Klick.** Der Klick auf den Hintergrund SCHLIESST nur;
       erst der nächste ist wieder ein Spielzug.
     4 **Wer pausiert, räumt den Weg ab** (`halt()`) — sonst läuft der Held nach dem Schließen
       sein altes Ziel weiter, und das liest sich wie eine kaputte Steuerung.
     5 **Rechts ist der Befehl, links ist die Auswahl.** Das ist v8-Kanon (`overworld-game.js`:
       `if(e.button!==2)return`) und bleibt so — aber es wird jetzt GESAGT: wer zweimal ins Gelände
       linksklickt und sich wundert, bekommt den Hinweis, statt sich zu fragen, warum die Einheit
       ihr altes Ziel weiterläuft. Genau das war der Befund »ich klicke links und laufe rechts«:
       die Zielrechnung stimmte (gemessen: Klick 7853 → Ziel 7854 → erster Schritt nach links),
       nur war der Linksklick nie ein Befehl. */
  const UI_SEL = '[data-r9ui],.r9stat,.r9ico,.r9near,.r9pile,.r9c,.r9deck,.r9call,.r9stage,'
    + '.v7-win,.v7-hero,.v7-hand,.v7-deck,.v7-nav,.v7-log,.pe';
  /* EIN Tor, ALLE Zeigerereignisse. `pointerdown` allein reichte nicht: ein Trackpad liefert
     `contextmenu` auch ohne vorangegangenes `pointerdown` auf demselben Ziel, und `click` kommt
     nach, wenn das Bedienteil sich beim Druck schon geschlossen hat — dann lag darunter die Welt.
     Wer im HUD drückt, drückt nicht in die Welt, egal welches Ereignis der Browser daraus macht. */
  /* Das Tor steht in der FANGPHASE und darf deshalb nur Ereignisse stoppen, die kein Bedienteil
     selbst braucht. Ein stopPropagation in der Fangphase haelt das Ereignis auf dem Weg NACH UNTEN
     an — es erreicht sein Ziel nie. Genau das hat einmal das ganze HUD tot gelegt, als click mit
     in dieser Liste stand: die Knoepfe bekamen ihren eigenen Klick nicht mehr.
     Gestoppt werden nur pointerdown und contextmenu: Ersteres ist der Weltbefehl, Letzteres
     braucht im HUD niemand — und ein Trackpad liefert es auch ohne vorangegangenen Druck. */
  for (const ev of ['pointerdown', 'contextmenu']) {
    sh.addEventListener(ev, (e) => {
      const path = e.composedPath ? e.composedPath() : [];
      let ui = false;
      for (const n of path) {
        if (n === sh || n === game) break;
        if (n.nodeType === 1 && n.matches && n.matches(UI_SEL)) { ui = true; break; }
      }
      if (ui) { e.stopPropagation(); return; }
      if (ev === 'pointerdown' && e.button === 0 && game.ready && !game.paused) leftOnWorld();
    }, true);
  }
  let leftHint = 0, leftCount = 0;
  function leftOnWorld() {
    const now = Date.now();
    if (now - leftHint < 20000) return;
    if (++leftCount < 2) return;
    leftCount = 0; leftHint = now;
    if (game.msg) game.msg('Right-click walks. Left-click only picks things up here.');
  }

  /* ── Statleiste als Blatt (Living Concept §38) ──────────────────────────── */
  const bar = document.createElement('div');
  bar.className = 'r9stat slim';   // v11-H2: vier Auskünfte, die sechs Werte liegen im Ausfahren
  bar.innerHTML = '<div class="sheet"><canvas class="edge"></canvas><div class="ct">'
    + '<canvas class="av" hidden></canvas><img class="av" hidden alt="">'
    + '<div class="rows">'
    + '<div class="r0"><b class="who" spellcheck="false"></b>'
    + '<span class="whoOK pe" title="keep this name">\u2713</span>'
    + '<span class="whoNO pe" title="discard">\u2715</span>'
    + '<em class="tit"></em><button class="titdd pe" title="choose a title">\u25be</button>'
    + '<span class="r9acct pe" title="POP \u2014 open the shopping list">'
    + '<span class="coin"></span><b class="num">0</b><em>Pop</em></span></div>'
    + '<div class="r1"><span class="lab">FLUFF</span>'
    + '<span class="fluff"><canvas></canvas><i></i></span>'
    + '<span class="hp num"><b></b><em>Fluff</em></span></div>'
    + '<div class="r2"><span class="six">' + STATS.map((s) =>
        '<span data-s="' + s.id + '" title="' + s.label + '">' + kurz(s, game)
        + ' <b class="num">0</b></span>').join('')
    + '</span></div>'
    + '<div class="more"></div></div>'
    + '<div class="titmenu pe" hidden></div>'
    + '</div></div>';
  root.appendChild(bar);
  const barEdge = bar.querySelector('canvas.edge');
  const fluffEdge = bar.querySelector('.fluff canvas');
  const avCv = bar.querySelector('canvas.av'), avImg = bar.querySelector('img.av');
  const fluffBar = bar.querySelector('.fluff i'), hpEl = bar.querySelector('.hp'),
        popEl = bar.querySelector('.r9acct b'), popBox = bar.querySelector('.r9acct'),
        moreEl = bar.querySelector('.more'), sixEls = {};
  for (const el of bar.querySelectorAll('.six span[data-s]')) sixEls[el.dataset.s] = el.querySelector('b');
  /* ── Name und Titel ────────────────────────────────────────────────────────
     `OW_IDENT` ist die eine Wahrheit (ident-v1, aus dem S22-Stand vorgezogen). Das Blatt liest
     und schreibt sie, es führt sie nicht: der Name geht durch `setName`, der Titel durch
     `setTitel`, gespeichert wird drüben.
     **Der Name wird an Ort und Stelle geschrieben, nicht in einem Abfragefenster.** `prompt()`
     kann in einem eingebetteten Rahmen unterdrückt werden — dann passiert schlicht nichts, ohne
     eine Zeile Fehler. Ein bearbeitbares Feld kann das nicht.
     Wichtig dabei: **die Tasten dürfen nicht durchfallen.** Wer seinen Namen tippt, läuft sonst
     mit WASD durch die Welt, während er schreibt. */
  const r0El = bar.querySelector('.r0'), whoEl = bar.querySelector('.r0 .who'),
        titEl = bar.querySelector('.r0 .tit');
  const IDENT = () => window.OW_IDENT || null;
  function titelName(id) {
    const I = IDENT(); if (!I) return id;
    const t = (I.TITEL || []).filter((x) => x.id === id)[0];
    return t ? t.name : id;
  }
  let identSig = '';
  function renderIdent() {
    const I = IDENT();
    if (!I) { r0El.style.display = 'none'; return; }
    const i = I.get(), t = i.titel || 'no title yet';
    const sig = i.name + '|' + t;
    if (sig === identSig) return;
    identSig = sig;
    whoEl.textContent = i.name;
    titEl.textContent = t;
    titEl.classList.toggle('none', !i.titel);
    titEl.title = 'click to switch title \u00b7 earned: '
      + (I.besitz() || []).map(titelName).join(', ');
    whoEl.title = 'click to write your name';
  }
  const okBtn = bar.querySelector('.whoOK'), noBtn = bar.querySelector('.whoNO');
  let whoVorher = '';
  /* v11-H9: die Schalter dürfen den Fokus NICHT nehmen — sonst löst ihr eigener Zeigerdruck erst
     das Verlassen des Feldes aus (und damit das Speichern), und der Klick kommt zu spät, um noch
     etwas zu verwerfen. Deshalb pointerdown abfangen und die Tat erst im click ausführen. */
  const keepFocus = (el, fn) => {
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); });
    el.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
  };
  keepFocus(okBtn, () => whoEl.blur());
  keepFocus(noBtn, () => {
    whoEl.textContent = whoVorher; identSig = ''; renderIdent(); whoEl.blur();
  });
  whoEl.contentEditable = 'true';
  whoEl.addEventListener('focus', () => {
    whoVorher = (whoEl.textContent || '').trim();
    r0El.classList.add('editing');
  });
  whoEl.addEventListener('pointerdown', (e) => e.stopPropagation());
  whoEl.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); whoEl.blur(); }
    if (e.key === 'Escape') { e.preventDefault(); identSig = ''; renderIdent(); whoEl.blur(); }
  });
  whoEl.addEventListener('blur', () => {
    r0El.classList.remove('editing');
    const I = IDENT(); if (!I) return;
    const v = (whoEl.textContent || '').replace(/\s+/g, ' ').trim();
    I.setName(v); identSig = ''; renderIdent();
  });
  /* ── v11-H9 · Der Titel ist eine WAHL, also zeigt er die Auswahl ───────────────────────────
     Bisher ein Ringtausch: ein Klick, der nächste Titel, ohne zu wissen, was kommt. Bei zwei
     Titeln ist das charmant, bei sieben ist es Raten. Jetzt eine Liste — oben, was man tragen darf
     (»kein Titel« eingeschlossen, das ist eine gültige Wahl), unten blass und ohne Klick, was es
     noch zu holen gibt, samt Grund. Die Gründe stehen schon in identity.js (»woher«), es wird also
     nichts erfunden: das Blatt zeigt, was die Datei weiß. */
  const ddBtn = bar.querySelector('.titdd'), titMenu = bar.querySelector('.titmenu');
  const closeTit = () => { titMenu.hidden = true; };
  function buildTit() {
    const I = IDENT(); if (!I) return;
    const own = I.besitz() || [], cur = I.get().titel;
    titMenu.innerHTML = '';
    const add = (label, val, on) => {
      const b = document.createElement('button');
      b.className = 'pe' + (on ? ' on' : '');
      b.textContent = label;
      b.addEventListener('pointerdown', (e) => e.stopPropagation());
      b.onclick = (e) => {
        e.stopPropagation();
        I.setTitel(val); identSig = ''; renderIdent(); closeTit();
        if (game.msg) game.msg(val ? 'You go by \u00bb' + val + '\u00ab now.' : 'No title. Just the name.');
      };
      titMenu.appendChild(b);
    };
    for (const t of I.TITEL) if (own.indexOf(t.id) >= 0) add(t.name, t.name, cur === t.name);
    add('no title', null, cur == null);
    const rest = I.TITEL.filter((t) => own.indexOf(t.id) < 0);
    if (rest.length) {
      const hd = document.createElement('div');
      hd.className = 'hd'; hd.textContent = 'STILL OUT THERE';
      titMenu.appendChild(hd);
      for (const t of rest) {
        const d = document.createElement('div'); d.className = 'locked';
        const n = document.createElement('span'); n.textContent = t.name;
        const w = document.createElement('em'); w.textContent = t.woher;
        d.appendChild(n); d.appendChild(w); titMenu.appendChild(d);
      }
    }
  }
  const toggleTit = (e) => {
    if (e) e.stopPropagation();
    if (titMenu.hidden) { buildTit(); titMenu.hidden = false; } else closeTit();
  };
  titEl.addEventListener('pointerdown', (e) => e.stopPropagation());
  titEl.onclick = toggleTit;
  ddBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
  ddBtn.onclick = toggleTit;
  /* Ein Klick woandershin schließt. Über den zusammengesetzten Pfad geprüft, weil das Blatt im
     Shadow-Root liegt und »e.target« von außen nur den Wirt nennt. */
  sh.addEventListener('pointerdown', (e) => {
    if (titMenu.hidden) return;
    const p = e.composedPath();
    if (p.indexOf(titMenu) < 0 && p.indexOf(ddBtn) < 0 && p.indexOf(titEl) < 0) closeTit();
  }, true);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTit(); }, true);
  /* **Verdienen war eine Rechnung ohne Aufrufer** \u2014 in unserem Stand ruft der Runner `pruefe()`
     nicht (er ist S10, die Titel kamen mit S20). Also fragt das Blatt: mit dem, was hier wirklich
     bekannt ist, und ohne erfundene Felder. Was wir nicht wissen (Jagd, Schreie), lassen wir weg. */
  function checkTitel() {
    const I = IDENT(); if (!I || !I.pruefe) return;
    const stand = { collected: (game.collected || []).length };
    const rep = game.rep || (game.att && game.att.rep);
    if (rep) stand.rep = rep;
    const neu = I.pruefe(stand);
    if (neu && neu.length && game.msg)
      for (const t of neu) game.msg('Title earned: \u00bb' + t.name + '\u00ab \u2014 ' + t.woher + '.');
  }
  /* Warum die Leiste einen eigenen Faktor bekommt: `inkGain` normiert die Feder auf eine absolute
     Breite, aber der Kanon moduliert das Band ENTLANG der Kontur (Schattenachse, unten rechts
     satter), und `contour` verteilt seine Punkte nach Seitenverhältnis. Auf einem Blatt von 14:1
     trifft die linke Kante deshalb eine viel flachere Stelle dieser Modulation als auf einer Karte
     mit 1,74:1 — gemessen 3 gegen 4 Gerätepixel. Kein Klemmenproblem, eine Formfrage. Also wird der
     Ausgleich gemessen gesetzt, wie REF_MIN selbst. */
  const BAR_INK = 1.28;
  function paintBar() {
    sheet(barEdge, 211, (g, W, H) => paper(g, W, H), BAR_INK);
    /* ── v11-H9 · Der Lebensbalken ist ein RECHTECK, kein gerissenes Blatt ───────────────────
       Vorher lief er durch »sheet()«, also durch die Kanon-Kontur: eine mit der Hand gezogene
       Kante, deren Stärke der Kanon ENTLANG der Kontur moduliert und deren Punkte nach
       Seitenverhältnis verteilt werden. Auf einem Kasten von 15:1 fällt auf die kurzen Seiten
       kaum ein Punkt — deshalb sah man oben und unten eine Linie und links und rechts keine
       (Georgs Befund: »die sieht nicht aus, als würde sie die Bar auch rechts und links
       einfassen — das ist quasi wirklich ein Rechteck«).

       Also wird sie hier gezeichnet statt gerissen: vier Seiten, gleiche Stärke, Ecken auf Stoß.
       Das ist kein Bruch mit dem Kanon, sondern seine Grenze — eine Anzeige ist ein Instrument,
       kein Papierschnipsel, und ein Instrument hat gerade Kanten. Die Feder bleibt dort, wo sie
       etwas kann: an den Blättern ringsum. Stärke etwas kräftiger als vorher (19 % der Höhe,
       bei 14 px also 2,7 — Georg: »könnte noch ein kleines bisschen dicker sein«). */
    /* v11-H13 · **Das Fehlende muss man sehen** (Georg 11.8.: der Balken ist im TAB-Modus und
       durchscheinend schlecht erkennbar). Die Rinne war 16 % Tusche — auf Creme ein Hauch, über Gras
       gar nichts. Jetzt 42 %: der leere Teil ist dunkel, also liest man nicht nur, wieviel Fluff da
       ist, sondern auch, wieviel weg ist. Das ist derselbe Griff wie bei den Leisten über den Köpfen,
       die auf einem deckenden dunklen Rücken liegen — und dort hat er von Anfang an funktioniert. */
    const fe = fit(fluffEdge);
    fe.g.clearRect(0, 0, fe.W, fe.H);
    fe.g.fillStyle = 'rgba(31,26,20,.42)';
    fe.g.fillRect(0, 0, fe.W, fe.H);
    const flw = Math.max(2, Math.round(Math.min(fe.W, fe.H) * 0.19));
    fe.g.lineJoin = 'miter'; fe.g.strokeStyle = INKC; fe.g.lineWidth = flw;
    fe.g.strokeRect(flw / 2, flw / 2, fe.W - flw, fe.H - flw);
  }
  if ('ResizeObserver' in window) new ResizeObserver(paintBar).observe(bar);

  /* Die Münze ist ein Streifen (Tiny Swords G_Idle), kein Einzelbild. Die Bildzahl wird am
     geladenen Blatt GEMESSEN und die Schrittregel danach eingesetzt — eine geratene Zahl hätte
     eine halbe Münze stehen lassen. */
  (function primeCoin() {
    if (!COIN && !ROUND) return;
    const rule = (sel, url, extra) => {
      /* Die Adresse MUSS in Anführungszeichen: der Tiny-Swords-Ordner heißt »Tiny Swords
         (Update 010)«, und ein nacktes url(…) bricht an der ersten Klammer ab. Die Regel wird dann
         stillschweigend verworfen — die Nachbardeklaration überlebt, also sieht es aus, als hätte
         es geklappt, und das Bild fehlt einfach. Gilt für JEDE injizierte url() aus dem Atlas. */
      const st2 = document.createElement('style');
      st2.textContent = sel + '{background-image:url("' + url + '")' + (extra || '') + '}';
      sh.appendChild(st2);
    };
    rule('.r9stat .r9acct .coin', ROUND || COIN);
    if (ROUND_DN) rule('.r9stat .r9acct.dn .coin,.r9stat .r9acct:active .coin', ROUND_DN);
    const im = new Image();
    im.onload = () => {
      if (!COIN_SPIN) return;
      const n = Math.max(1, Math.round(im.width / im.height));
      /* **Der Streifen wird über `background-size` geschoben, nicht über Pixel.** Prozente bei
         `background-position-x` rechnen gegen (Kasten − Bild), nicht gegen die Bildbreite: bei
         18 px Kasten und 126 px Bild landet −700 % bei +756 px, also weit rechts neben dem Kasten,
         und `no-repeat` malt nichts. Mit Bildbreite n×100 % und Position 100 % steht das letzte
         Bild exakt am rechten Rand — und weil beides relativ ist, gilt dieselbe Regel für jede
         Kastengröße (Zähler 18 px, Wurf 20 px teilen sie sich). */
      rule('.r9pop span', COIN_SPIN, ';background-size:' + (n * 100) + '% 100%;'
        + 'animation:r9coin .62s steps(' + n + ') infinite');
      const kf = document.createElement('style');
      kf.textContent = '@keyframes r9coin{to{background-position-x:100%}}';
      sh.appendChild(kf);
    };
    im.src = COIN_SPIN;
  })();

  /* **POP ist der Kontostand, nicht die Erfahrung.** Woher er kommt, entscheidet der RUNNER:
     seit V10-S6 führt er `hero.pop`; die ältere Fassung führte nur `hero.xp` und nannte es
     Erfahrung. Gelesen wird, **was da ist** — erfunden wird nichts, und wenn der neue Stand
     ankommt, stimmt die Zahl von selbst.
     Offene Punkte führt WS1 unter hero.skillPoints (Alias sp) — dieselbe Quelle wie v7. */
  const popOf = (h) => (h && h.pop != null ? h.pop : ((h && h.xp) || 0));
  const openPts = (h) => Math.max(0, (h && (h.skillPoints != null ? h.skillPoints : h.sp)) | 0);
  /* Was ein Wert kostet, entscheidet der Runner. **Die Signatur nimmt Art UND Kennung**
     (`popCost('stat','bizarro')`) — nicht Wert plus Stufe: die Stufe steckt im Helden, und der
     Aufrufer soll sie nicht mitrechnen müssen, sonst gibt es zwei Rechnungen für einen Preis.
     Ohne Preisliste gibt es keinen Preis — eine geratene Zahl wäre genau der Punktestand,
     den der Kanon nicht will (K1). */
  const costOf = (s) => (game.popCost ? game.popCost('stat', s.id) : null);
  const canBuy = (h, s) => (game.popSpend
    ? (costOf(s) == null ? popOf(h) > 0 : popOf(h) >= costOf(s))
    : openPts(h) > 0);
  let shopSync = null;
  function raise(s) {
    const h = game.hero;
    if (!h) return;
    /* **Zwei Wege, ein Knopf — geprüft wird die Fähigkeit, nicht die Version.**
       Seit V10-S6 kauft POP: game.popCost(id) nennt den Preis, game.popSpend(id) bucht ab.
       Solange der Runner das nicht führt, gilt der alte Weg über einen offenen Punkt.
       Kein Versionsvergleich — der wäre eine Zahl an einem zweiten Ort. */
    if (game.popSpend) {
      const cost = costOf(s);
      if (cost != null && popOf(h) < cost) {
        if (game.msg) game.msg('Not enough POP \u2014 ' + s.label + ' costs ' + cost + '.');
        return;
      }
      /* **`popSpend` gibt immer ein Objekt**, nie einen Restbetrag: `{ok, note}`. Der Kontostand
         steht in `hero.pop`, und bei `ok` sind Autosave und `updateHud` schon gelaufen — wir
         buchen hier nichts nach. Die Notiz des Runners ist die Meldung; eine eigene daneben
         wäre eine zweite Wahrheit in Worten. */
      const res = game.popSpend('stat', s.id);
      if (!res || res.ok !== true) {
        if (game.msg && res && res.note) game.msg(res.note);
        return;
      }
      if (game.msg) game.msg(s.label + ' \u2014 ' + (res.note || 'bought with POP') + '.');
    } else {
      if (openPts(h) < 1) return;
      if (s.from === 'hero' && game.hudSpendPoint) game.hudSpendPoint(s.id);
      else {
        state.stats[s.id] = (state.stats[s.id] || 0) + 1;
        if (h.skillPoints != null) h.skillPoints--; else if (h.sp != null) h.sp--;
        S.save();
        if (game.msg) game.msg('Skill point spent \u2014 ' + s.label + ' is now ' + state.stats[s.id] + '.');
      }
    }
    statSig = ''; renderStats();
    if (shopSync) shopSync();
  }
  let moreBuilt = false, barT = 0;
  function buildMore() {
    if (moreBuilt) return;
    moreBuilt = true;
    for (const s of STATS) {
      const row = document.createElement('div'); row.className = 'row';
      /* v11-H5 · **Die Reihenfolge des Lesens war falsch.** Links stand die Abkürzung, also traf das
         Auge zuerst das Kryptische (»Biz«) und danach das Verständliche (»Bizarro«). Georg: »dann
         haben wir diese kryptischen Bezeichnungen nicht direkt links als Erstes«. Jetzt liest man
         Name, Erklärung, und ganz rechts das Paar, das zusammengehört: **Kürzel direkt vor der
         Zahl** — sie erklären sich gegenseitig, und beide tragen die Farbe des Wertes. Das Kürzel
         hatte ich einen Durchgang vorher entfärbt; falsch, weil es links allein stand. Neben seiner
         Zahl ist die Farbe keine zweite Auskunft, sondern die Klammer um eine. */
      row.innerHTML = '<span class="t">' + s.label + '<em>' + s.hint + '</em></span>'
        + '<span class="k" style="color:' + s.col + '">' + kurz(s, game) + '</span>'
        + '<b class="v" data-v="' + s.id + '" style="color:' + s.col + '">0</b>'
        + '<button class="up" data-u="' + s.id + '" title="raise this value">+</button>';
      row.querySelector('.up').onclick = (e) => { e.stopPropagation(); raise(s); };
      moreEl.appendChild(row);
    }
    const acct = document.createElement('div'); acct.className = 'acct';
    acct.innerHTML = 'POP account <b class="acctn">0</b><em class="acctw"></em>';
    if (ACCT_ZEILE) moreEl.insertBefore(acct, moreEl.firstChild);
  }
  bar.addEventListener('mouseenter', () => {
    clearTimeout(barT);
    barT = setTimeout(() => {
      buildMore(); bar.classList.add('open'); statSig = ''; renderStats();
    }, 90);
  });
  bar.addEventListener('mouseleave', () => {
    clearTimeout(barT);
    barT = setTimeout(() => bar.classList.remove('open'), 180);
  });
  /* v11-H4 · **Ein Klick öffnet dasselbe wie das Verweilen.** Bisher hing der ausgefahrene Stand
     allein am Zeiger: wer klickt statt zu warten, bekam nichts, und auf einem Zeigergerät ohne Hover
     gibt es die sechs Werte überhaupt nicht. Seit die Zeile aus der Leiste raus ist, ist dieses Blatt
     der EINZIGE Weg zu ihnen — ein einziger Auslöser ist dafür zu wenig.
     Der Klick schaltet um und lässt die Kinder in Ruhe: Name (schreibt), POP (Einkaufsliste),
     Avatar (Roster) und alles im ausgefahrenen Block behalten ihre eigene Bedeutung. */
  bar.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('.r9acct, .who, .whoOK, .whoNO, .tit, .titdd, .titmenu, .av, .more')) return;
    clearTimeout(barT);
    if (bar.classList.contains('open')) { bar.classList.remove('open'); return; }
    buildMore(); bar.classList.add('open'); statSig = ''; renderStats();
  });
  function statVal(s) {
    if (s.from === 'hero') return ((game.hero && game.hero.stats) || {})[s.id] || 0;
    return state.stats[s.id] || 0;
  }
  /* ── Avatar ─────────────────────────────────────────────────────────
     Die Blätter sind im Repo nach dem KLARNAMEN der Einheit benannt (»Harpoon Shark.png«), nicht
     nach ihrer Kennung — also wird der Name gefragt, nicht geraten. Wer keins hat, bekommt seinen
     Kopf aus dem Idle-Sprite geschnitten: quadratisch, mit Tuschekante, weil ein angeschnittenes
     Sprite ohne Rahmen wie ein Fehler aussieht. */
  /* Die Adresse des Avatarblattes steht im KATALOG (OW_UNITS, Feld avatar) — dort, wo die Einheit
     definiert ist. Eine eigene Namensliste hier wäre eine zweite Wahrheit, die beim nächsten
     Einheitenpack veraltet. Der Sprite-Kopf bleibt der Ersatzfall. */
  function unitDef(id) {
    const C = window.OW_UNITS;
    if (!C || !id) return null;
    return (C.enemies && C.enemies[id]) || (C.playable && C.playable[id]) || null;
  }
  function avatarUrl(u) {
    if (u && u.def && u.def.avatar) return u.def.avatar;
    const d = unitDef(u && u.id);
    return (d && d.avatar) || '';
  }
  let avDone = '';
  /* EIN Weg für alle Gesichter, und immer auf die Alpha-Grenzen zugeschnitten. Die Avatarblätter
     sind 256×256 mit viel Luft drumherum — ungeschnitten füllt das Gesicht ein Viertel der Kachel
     und sieht heruntergerechnet aus. Zugeschnitten füllt es sie. Ein Blatt bekommt KEINE Kante
     (es bringt seine eigene mit), ein Sprite-Kopf bekommt eine. */
  function drawFace(cv, u, seed) {
    const url = avatarUrl(u);
    if (url) {
      loadFace(url).then((im) => {
        if (!im || !im.width || !cv.isConnected) { spriteFace(cv, u, seed); return; }
        const bb = spriteBox({ img: im, fw: im.width, fh: im.height, sy: 0 }, 'av:' + u.id);
        /* Auch hier: Seitenverhältnis behalten, mittig einlegen. Ein Avatarblatt ist quadratisch,
           sein MOTIV aber selten — ein erzwungenes Quadrat hätte es breitgezogen. */
        const sw = bb ? Math.round(bb.w * 1.04) : im.width;
        const shh = bb ? Math.round(bb.h * 1.04) : im.height;
        const cx = bb ? bb.x + bb.w / 2 : im.width / 2;
        const cy = bb ? bb.y + bb.h / 2 : im.height / 2;
        const sx = Math.max(0, Math.min(im.width - Math.min(sw, im.width), Math.round(cx - sw / 2)));
        const sy = Math.max(0, Math.min(im.height - Math.min(shh, im.height), Math.round(cy - shh / 2)));
        const w = Math.min(sw, im.width - sx), h = Math.min(shh, im.height - sy);
        const f = fit(cv);
        f.g.clearRect(0, 0, f.W, f.H);
        f.g.imageSmoothingEnabled = false;
        const s = Math.min(f.W / w, f.H / h);
        f.g.drawImage(im, sx, sy, w, h, (f.W - w * s) / 2, (f.H - h * s) / 2, w * s, h * s);
      });
      return;
    }
    spriteFace(cv, u, seed);
  }
  /* **Nur ein echtes Avatarblatt darf ein Gesicht sein** (Georg 11.8.). Der Ersatzfall — Kopf aus
     dem Idle-Sprite schneiden — rechnete beim Schaf ein 38-px-Motiv auf 108 px hoch: ein
     Pixelbrei, der wie ein Fehler aussieht, weil er einer ist. Ein fehlendes Bild ist ehrlicher
     als ein falsch skaliertes; die Leiste rückt einfach zusammen. Der Weg zurück ist eine Zeile:
     `avatar` im Katalog füllen, dann kommt das Gesicht von selbst wieder. */
  function paintAvatar() {
    const u = game.hero && game.hero.unit;
    const url = u && u.id ? avatarUrl(u) : '';
    if (!url) {
      avCv.hidden = true; if (avImg) avImg.hidden = true;
      bar.classList.add('noav'); avDone = ''; return;
    }
    bar.classList.remove('noav');
    /* v12-H1b: die Kantenlänge steht im CSS, nicht hier. Eine Inline-Zeile schlägt jede Regel —
       solange sie hier stand, war jede CSS-Fassung ein Vorschlag, den niemand las. */
    avCv.hidden = false;
    if (avDone === u.id) return;
    avDone = u.id;
    drawFace(avCv, u, 233);
  }
  /* Eine feste Kantenlänge als Rückfall: eine Bezugsgröße, die sich mit dem ZUSTAND des Blattes
     ändert, ist keine — vorher wuchs der Kopf beim Ausfahren auf Bildschirmhöhe. Mit der
     Fenstergröße darf sie sich ändern (v12-H1), deshalb wird gemessen statt angenommen. */
  const AV_SIZE = 108;
  function sheetH() { return avCv.clientHeight || AV_SIZE; }
  /* Der Ausschnitt wird am SPRITE gemessen, nicht am Fußanker. Der Anker sitzt unter den Füßen;
     bei Seitenansichten liegt der Kopf davon versetzt, und bei breiten Tieren (Schildkröte: Motiv
     148 px breit, Kasten 71) war er schlicht außerhalb — zu sehen war der Panzer. Also: einmal die
     Alpha-Grenzen des Ruhebildes lesen und das ganze Motiv ins Quadrat legen. Lieber verkleinert
     und vollständig als angeschnitten und falsch. */
  const bboxCache = new Map();
  function spriteBox(A, id) {
    if (bboxCache.has(id)) return bboxCache.get(id);
    let box = null;
    try {
      const c = document.createElement('canvas');
      c.width = A.fw; c.height = A.fh;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(A.img, 0, A.sy || 0, A.fw, A.fh, 0, 0, A.fw, A.fh);
      const d = x.getImageData(0, 0, A.fw, A.fh).data;
      let x0 = A.fw, y0 = A.fh, x1 = -1, y1 = -1;
      for (let py = 0; py < A.fh; py++) {
        for (let px = 0; px < A.fw; px++) {
          if (d[(py * A.fw + px) * 4 + 3] > 40) {
            if (px < x0) x0 = px; if (px > x1) x1 = px;
            if (py < y0) y0 = py; if (py > y1) y1 = py;
          }
        }
      }
      if (x1 > x0 && y1 > y0) box = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
    } catch (e) { box = null; }
    bboxCache.set(id, box);
    return box;
  }
  function spriteFace(cv, u, seed) {
    const A = u.anims && u.anims.idle;
    if (A && A.img && A.img.width && canon) { cropInto(cv, A, A.fw, u.id, seed); return; }
    const d = u.def || unitDef(u.id);
    const src = d && (d.sheet || (d.anims && d.anims.idle));
    if (typeof src !== 'string') { blankFace(cv, seed); return; }
    loadFace(src).then((im) => {
      if (!cv.isConnected) return;
      if (!im || !im.width) { blankFace(cv, seed); return; }
      const cell = (d && d.cell) || im.height;
      cropInto(cv, { img: im, fw: cell, fh: cell, sy: 0 }, cell, 'roster:' + u.id, seed);
    });
  }
  /* Der Ausschnitt wird am SPRITE gemessen, nicht am Fußanker. Der Anker sitzt unter den Füßen;
     bei Seitenansichten liegt der Kopf davon versetzt, und bei breiten Tieren war er schlicht
     außerhalb — zu sehen war der Rücken. */
  function cropInto(cv, A, cell, key, seed) {
    const bb = spriteBox(A, key);
    /* NIE verzerren: der Ausschnitt behält sein Seitenverhältnis und wird MITTIG ins Quadrat
       gelegt (contain). Vorher zwang ich ein Quadrat aus der Quelle — bei nicht-quadratischen
       Einzelbildern lief das über den Rahmenrand hinaus und das Wesen wurde breitgezogen. */
    const sw = bb ? Math.round(bb.w * 1.1) : cell;
    const shh = bb ? Math.round(bb.h * 1.1) : cell;
    const cx = bb ? bb.x + bb.w / 2 : A.fw / 2, cy = bb ? bb.y + bb.h / 2 : A.fh / 2;
    const sx = Math.max(0, Math.min(A.fw - Math.min(sw, A.fw), Math.round(cx - sw / 2)));
    const sy = Math.max(0, Math.min(A.fh - Math.min(shh, A.fh), Math.round(cy - shh / 2)));
    const w = Math.min(sw, A.fw - sx), h = Math.min(shh, A.fh - sy);
    sheet(cv, seed || 233, (g, W, H) => {
      paper(g, W, H);
      g.imageSmoothingEnabled = false;
      const s = Math.min(W / w, H / h);
      g.drawImage(A.img, sx, (A.sy || 0) + sy, w, h,
        (W - w * s) / 2, (H - h * s) / 2, w * s, h * s);
    }, 0.8);
  }
  function blankFace(cv, seed) {
    sheet(cv, seed || 317, (g, W, H) => {
      g.fillStyle = 'rgba(31,26,20,.1)'; g.fillRect(0, 0, W, H);
    }, 0.8);
  }

  /* ── Statleiste zeichnen ───────────────────────────────────────────── */
  let statSig = '', popShown = null;
  function renderStats() {
    const h = game.hero; if (!h) return;
    const vals = STATS.map(statVal);
    const pts = openPts(h);
    const pop = popOf(h);
    const sig = Math.round(h.hp) + '|' + h.maxhp + '|' + pop + '|' + vals.join(',') + '|' + pts
      + '|' + bar.classList.contains('open');
    if (sig === statSig) return;
    statSig = sig;
    const fT = Math.max(0, Math.min(1, h.hp / (h.maxhp || 1)));
    fluffBar.style.width = (fT * 100).toFixed(1) + '%';
    // v11-H7: grün → gelb → orange → rot, dieselbe Funktion wie die Leisten über den Köpfen
    if (window.OW_FEEL && OW_FEEL.fluffColor) {
      fluffBar.style.backgroundColor = OW_FEEL.fluffColor(fT);
      // v11-H10: die Zahl folgt dem Balken, nur tiefer gemischt, damit sie auf Creme trägt
      const hb = hpEl.querySelector('b');
      if (hb) hb.style.color = OW_FEEL.fluffColor(fT, 0.34);
    }
    /* v11-H6: die Zahl trägt ihr Etikett neben sich, also nur noch der STAND — das Verhältnis
       zeigt der Balken, und »140/140« zweimal dieselbe Auskunft. Der Höchstwert steht im Tooltip,
       damit er nicht verloren ist. */
    hpEl.querySelector('b').textContent = Math.max(0, Math.round(h.hp));
    hpEl.title = Math.max(0, Math.round(h.hp)) + ' of ' + h.maxhp + ' Fluff';
    if (popShown !== pop) {
      popEl.textContent = pop;
      if (popShown != null && pop > popShown) {
        popBox.classList.remove('bump'); void popBox.offsetWidth; popBox.classList.add('bump');
        /* »+2 POP« über dem Knopf. Das alte Element wird ENTFERNT, bevor das neue kommt —
           zwei Gewinne kurz nacheinander sollen nicht übereinanderliegen. */
        const old = popBox.querySelector('.gain'); if (old) old.remove();
        const g = document.createElement('span');
        g.className = 'gain'; g.textContent = '+' + (pop - popShown) + ' POP';
        popBox.appendChild(g);
        setTimeout(() => g.remove(), 1300);
      }
      popShown = pop;
    }
    bar.classList.toggle('can', STATS.some((s) => canBuy(h, s)));
    STATS.forEach((s, i) => {
      const b = sixEls[s.id]; if (!b) return;
      b.textContent = vals[i];
      // Die Zahl trägt IMMER ihre Farbe — auch die Null. Ein grauer Wert liest sich wie
      // »gibt es nicht«, dabei heißt er »noch nicht ausgebaut«.
      b.style.color = s.col;
      b.style.opacity = vals[i] > 0 ? '1' : '.5';
    });
    if (moreBuilt) {
      for (const s of STATS) {
        const v = moreEl.querySelector('[data-v="' + s.id + '"]');
        if (v) v.textContent = statVal(s);
        const u = moreEl.querySelector('[data-u="' + s.id + '"]');
        if (u) {
          /* Der Knopf zeigt sich nur, wenn der Zug WIRKLICH geht — ein Plus, das nichts tut,
             ist eine Lüge im Bild. Was »geht« heißt, entscheidet der Runner (POP-Preis oder
             offener Punkt), nicht dieses Modul. */
          /* `visibility`, nicht `display`: der Knopf behält seinen Platz, auch wenn er nichts zu
             sagen hat. Sonst wandert die Zahl daneben, sobald sich POP ändert (v11-H4). */
          u.style.visibility = canBuy(h, s) ? '' : 'hidden';
          const c = costOf(s);
          u.title = c != null ? 'raise for ' + c + ' POP' : 'raise this value';
        }
      }
      const an = moreEl.querySelector('.acctn'), aw = moreEl.querySelector('.acctw');
      if (an) an.textContent = pop;
      /* **Kein Level im Text.** Der alte Satz sagte »the next level brings the next point« —
         es gibt seit V10-S6 kein sichtbares Spieler-Level mehr (Masterplan §4.4), und ein
         HUD, das eins verspricht, ist die zweite Wahrheit in Worten statt in Zahlen. */
      if (aw) aw.textContent = game.popSpend
        ? (STATS.some((s) => canBuy(h, s)) ? '\u00b7 enough to raise something' : '\u00b7 keep going, POP buys the next step')
        : (pts > 0 ? '\u00b7 ' + pts + ' point' + (pts === 1 ? '' : 's') + ' ready to spend' : '\u00b7 evidence pays');
    }
  }

  /* ── Actor ──────────────────────────────────────────────────────────────── */
  /* Der Salz-Wert macht den zweiten Zug zu einem ANDEREN Zug — ohne ihn hätte »nochmal ziehen«
     dieselbe Karte gebracht, und die Ablehnung wäre eine Attrappe. */
  function drawActor(salt) {
    const pack = game.deck && game.deck.packId, list = game.cards || [];
    if (!pack || !list.length) return null;
    const i = Math.floor(rand(((game.att.seed * 2654435761) ^ 0x9e37) + (salt || 0)) * list.length) % list.length;
    const c = list[i];
    return { packId: pack, n: c.n, t: c.t, l: c.l, deck: game.deck.title };
  }
  /* Vor der Zeremonie zieht NIEMAND still eine Karte: der Actor wird dem Spieler vorgelegt. */
  function actorCard() {
    if (!state.actor && state.intro && state.intro.done) {
      const a = drawActor(); if (a) { state.actor = a; S.save(); }
    }
    return state.actor;
  }

  /* ── Quests: der König lobt aus, Deckel sechs ───────────────────────────── */
  let questBusy = false, introRunning = false;
  async function ensureQuests(want) {
    if (questBusy || !CA) return;
    if (!(state.intro && state.intro.done)) return;   // der König lobt erst nach der Zeremonie aus
    questBusy = true;
    try {
      await CA.ready();
      /* Erst ausmisten: ein Heft, dessen PDF nicht lesbar ist, kann seine Karte nie zeigen —
         eine Quest ohne Motiv ist genau der Platzhalter, den es nicht geben soll. Also wird sie
         gestrichen und unten neu gezogen.
         **Zweiter Grund seit dem Umbau:** ein GESPEICHERTES Heft kann aus einem Deck ohne
         gemessenes Kartenraster stammen — die Auswahlregel gilt beim Ziehen, nicht rückwirkend
         für den Spielstand. Solche Hefte zeigen eine angeschnittene Karte und melden sich als
         »kein gemessenes Raster« in der Konsole. Also fliegen sie beim Aufwachen mit raus. */
      const ok = CA.decks().map((d) => d.packId);
      const bad = state.quests.filter((q) => (CA.isBroken && CA.isBroken(q.packId))
        || ok.indexOf(q.packId) < 0);
      if (bad.length) {
        state.quests = state.quests.filter((q) => bad.indexOf(q) < 0);
        S.save(); qSig = '';
        console.log('[rail-v9b] Quest verworfen (unlesbar oder ungemessen):', bad.map((q) => q.packId).join(', '));
      }
      const pool = CA.decks().filter((d) => d.packId !== (game.deck && game.deck.packId)
        && !(CA.isBroken && CA.isBroken(d.packId)));
      let guard = 0;
      while (state.quests.length < Math.min(6, want) && pool.length && guard++ < 8) {
        const used = state.quests.map((q) => q.packId);
        const cand = pool.filter((d) => used.indexOf(d.packId) < 0);
        const src = cand.length ? cand : pool;
        const d = src[Math.floor(rand(game.att.seed + state.quests.length * 977) * src.length)];
        if (!d) break;
        const cards = await CA.deckCards(d.packId);
        if (!cards.length) { pool.splice(pool.indexOf(d), 1); continue; }
        const c = cards[Math.floor(rand(game.att.seed ^ (state.quests.length * 40503)) * cards.length)];
        /* Ein Heft wird nur ausgelobt, wenn es sein Blatt auch ZEIGEN kann. Der Griff nach dem
           Motiv ist die Probe — scheitert er, ist das Deck ab hier als unlesbar bekannt und der
           nächste Durchlauf wählt ein anderes. */
        const ok = await new Promise((res) => CA.art({ packId: d.packId, n: c.n },
          () => res(true), () => res(false)));
        if (!ok) { pool.splice(pool.indexOf(d), 1); continue; }
        state.quests.push({ packId: d.packId, n: c.n, t: c.t, l: c.l, deck: d.title });
        S.save();
        if (state.quests.length === 1 && game.msg)
          game.msg('The King calls for \u00bb' + c.t + '\u00ab \u2014 a page from ' + d.title + '.');
      }
    } catch (e) { console.warn('[rail-v9b] Quest:', e.message); }
    questBusy = false;
    renderQuests();
  }
  let qSig = '';
  function renderQuests() {
    const qs = state.quests.slice().reverse();   // zuletzt ausgelobt liegt vorn
    const sig = qs.map((q) => q.packId + '#' + q.n).join(',');
    if (sig === qSig) return;
    qSig = sig;
    qPile.set(qs.map((q) => ({
      cls: 'r9quest', card: q, seed: 29 + (q.n | 0),
      title: '\u00bb' + q.t + '\u00ab \u2014 ' + (q.deck || '') + ' \u00b7 ' + state.quests.length
        + '/6 \u00b7 click for the quest log',
      click: () => showQ(true),
    })));
  }

  /* ── Almanach-Stapel: Actor vorn, Szenen dahinter ───────────────────────── */
  let almSig = '';
  function renderAlmPile() {
    const cs = (game.collected || []).filter((c) => c && c.n);
    const pack = game.deck && game.deck.packId;
    const a = actorCard();
    const sig = (a ? a.n : 'x') + '|' + cs.map((c) => c.n).join(',') + '|' + pack;
    if (sig === almSig) return;
    almSig = sig;
    const list = [];
    if (a) list.push({ cls: 'r9actor', card: a, seed: 7 + (a.n | 0),
      title: '\u00bb' + a.t + '\u00ab \u2014 you are this card \u00b7 click for the almanac',
      click: openAlm });
    for (let i = cs.length - 1; i >= 0; i--) {
      const c = cs[i];
      list.push({ cls: 'r9scene', card: { packId: pack, n: c.n, t: c.t, l: c.l },
        seed: 61 + (c.n | 0), title: '\u00bb' + c.t + '\u00ab \u2014 secured', click: openAlm });
    }
    almPile.set(list);
    const enough = cs.length >= NEED;
    call.classList.toggle('on', enough);
    call.textContent = enough ? '\u2691 ' + cs.length + ' scenes \u00b7 tell the King \u2192' : '';
    if (enough && !call._said && game.msg) {
      call._said = true;
      game.msg('Three scenes, one actor, one quest \u2014 the King will hear the tale now.');
    }
    ensureQuests(1 + cs.length);
  }

  /* ── Almanach + Quest-Log als Fenster ───────────────────────────────────── */
  const wins = Array.prototype.slice.call(root.querySelectorAll('.v7-win'));
  const almWin = wins.filter((w) => {
    const h = w.querySelector('h3'); return h && /almanac/i.test(h.textContent);
  })[0];
  function gridItem(card, opts) {
    const it = document.createElement('div');
    it.className = 'r9gi' + (opts && opts.dim ? ' dim' : '');
    it.innerHTML = '<canvas></canvas><div class="cap"><i>' + ((opts && opts.kind) || '')
      + '</i>' + (card && card.t ? card.t.replace(/[<>&]/g, '') : '') + '</div>';
    const cv = it.querySelector('canvas');
    it._draw = () => cardSheet(cv, card, 97 + (card.n | 0));
    if ('ResizeObserver' in window) new ResizeObserver(it._draw).observe(cv);
    return it;
  }
  function fillGrid(host, cards, kind, dim) {
    const gr = document.createElement('div'); gr.className = 'r9grid';
    const items = [];
    for (const c of cards) { const it = gridItem(c, { kind, dim }); gr.appendChild(it); items.push(it); }
    host.appendChild(gr);
    for (const it of items) it._draw();
  }
  function head(host, text) {
    const h = document.createElement('p'); h.className = 'r9sub'; h.textContent = text;
    host.appendChild(h);
  }
  function note(host, text) {
    const p = document.createElement('p'); p.className = 'r9empty'; p.textContent = text;
    host.appendChild(p);
  }
  function renderAlmanac() {
    if (!almWin) return;
    const wb = almWin.querySelector('.wb'); if (!wb) return;
    wb.innerHTML = '';
    const pack = game.deck && game.deck.packId;
    const cs = (game.collected || []).filter((c) => c && c.n);
    const a = actorCard();
    head(wb, 'You are playing');
    if (a) fillGrid(wb, [a], a.deck || 'actor'); else note(wb, 'No actor drawn yet.');
    head(wb, 'Scenes secured \u00b7 ' + cs.length + ' of '
      + (game.zones || []).filter((z) => !z.noProgress).length);
    if (cs.length) fillGrid(wb, cs.map((c) => ({ packId: pack, n: c.n, t: c.t, l: c.l })),
      game.deck && game.deck.title);
    else note(wb, 'Nothing bound yet. Clear a zone and its page is yours.');
    const open = (game.zones || []).filter((z) => !z.cleared && !z.noProgress && z.card && z.card.n);
    if (open.length) {
      head(wb, 'Still out there');
      fillGrid(wb, open.map((z) => ({ packId: pack, n: z.card.n, t: z.card.t })), 'unsecured', true);
    }
    const row = document.createElement('div'); row.className = 'row'; row.style.marginTop = '16px';
    const b = document.createElement('button'); b.className = 'pbtn hot';
    b.textContent = cs.length >= NEED
      ? 'Tell the King a tall tale \u2192' : 'The King wants ' + (NEED - cs.length) + ' more scene(s)';
    b.disabled = cs.length < NEED;
    b.onclick = () => {
      almWin.classList.remove('on');
      game._ow7Paused = false; game.paused = false;
      if (game.openAfterglow) game.openAfterglow();
    };
    row.appendChild(b);
    const b2 = document.createElement('button'); b2.className = 'pbtn';
    b2.textContent = 'Quest log (' + state.quests.length + '/6)';
    b2.onclick = () => { almWin.classList.remove('on'); showQ(true); };
    row.appendChild(b2);
    wb.appendChild(row);
  }
  /* `_ow7Paused` ist die Marke, an der v7s `showWin(…,false)` erkennt, dass ES die Uhr angehalten
     hat — ohne sie läuft der Schließweg (✕, Hintergrund, Esc) durch, ohne zu entpausieren. */
  const openAlm = () => {
    if (!almWin) return;
    renderAlmanac();
    almWin.classList.add('on');
    game._ow7Paused = true; game.paused = true; halt();
  };
  if (almWin) new MutationObserver(() => {
    if (almWin.classList.contains('on') && !almWin._r9busy) {
      almWin._r9busy = true; renderAlmanac(); almWin._r9busy = false;
    }
  }).observe(almWin, { attributes: true, attributeFilter: ['class'] });

  const qWin = document.createElement('div');
  qWin.className = 'v7-win';
  qWin.innerHTML = '<div class="v7-box r9box"><canvas class="edge"></canvas><div class="ct">'
    + '<div class="wh"><div><h3>Quest Log</h3><em>what the King has called for</em></div>'
    + '<button class="icobtn close pe" title="close (Esc)">\u2715</button></div>'
    + '<div class="wb"></div></div></div>';
  root.appendChild(qWin);
  const qEdge = qWin.querySelector('canvas.edge');
  function paintEdge() {
    if (!qWin.classList.contains('on')) return;
    sheet(qEdge, 137, (g, W, H) => { g.fillStyle = PAPER; g.fillRect(0, 0, W, H); });
  }
  function showQ(on) {
    qWin.classList.toggle('on', on);
    game._ow7Paused = on; game.paused = on;
    if (on) { halt(); renderQLog(); paintEdge(); }
  }
  qWin.querySelector('.close').onclick = (e) => { if (e) e.stopPropagation(); showQ(false); };
  guardWin(qWin);
  /* v7s Esc-Handler kennt seine drei Fenster — das vierte ist unseres. */
  const esc = (e) => {
    if ((e.key || '').toLowerCase() !== 'escape' || !qWin.classList.contains('on')) return;
    showQ(false); e.preventDefault(); e.stopPropagation();
  };
  game.addEventListener('keydown', esc, true);
  window.addEventListener('keydown', esc, true);
  function renderQLog() {
    const wb = qWin.querySelector('.wb'); wb.innerHTML = '';
    head(wb, 'Called for \u00b7 ' + state.quests.length + ' of 6');
    if (state.quests.length) fillGrid(wb, state.quests, 'quest');
    else note(wb, 'The King has not called yet.');
    note(wb, 'Each quest page comes from another world. Six can hang here at once.');
  }

  /* ── Einkaufsliste: wofür POP da ist ───────────────────────────────────────
     Kein Aufsetzer über dem Bild, sondern ein Fenster wie Quest-Log und Roster — dieselbe Kante,
     dieselbe Kopfzeile, dasselbe Esc. Der Runner führt dafür schon ein eigenes Modal (.pop); das
     bleibt unberührt, wird von hier aber nicht mehr gebraucht.
     **Preise kommen aus dem Spiel** (`popCost`), nie von hier — eine Zahl, die die Oberfläche
     erfindet, ist genau der Punktestand, den der Kanon nicht will (K1). Was zu teuer ist, steht
     blass in der Liste statt zu fehlen: eine Liste, die nur das Erschwingliche zeigt, verschweigt
     das Ziel. */
  const popWin = document.createElement('div');
  popWin.className = 'v7-win';
  popWin.innerHTML = '<div class="v7-box r9box"><canvas class="edge"></canvas><div class="ct">'
    + '<div class="wh"><div><h3>Shopping List</h3><em>what POP is for</em></div>'
    + '<button class="icobtn close pe" title="close (Esc)">\u2715</button></div>'
    + '<div class="wb"></div></div></div>';
  root.appendChild(popWin);
  const popEdge = popWin.querySelector('canvas.edge');
  function showShop(on) {
    popWin.classList.toggle('on', on);
    game._ow7Paused = on; game.paused = on;
    if (on) {
      halt(); renderShop();
      sheet(popEdge, 149, (g, W, H) => { g.fillStyle = PAPER; g.fillRect(0, 0, W, H); });
    }
  }
  popWin.querySelector('.close').onclick = (e) => { if (e) e.stopPropagation(); showShop(false); };
  guardWin(popWin);
  const escShop = (e) => {
    if ((e.key || '').toLowerCase() !== 'escape' || !popWin.classList.contains('on')) return;
    showShop(false); e.preventDefault(); e.stopPropagation();
  };
  game.addEventListener('keydown', escShop, true);
  window.addEventListener('keydown', escShop, true);
  function renderShop() {
    const wb = popWin.querySelector('.wb'); wb.innerHTML = '';
    const h = game.hero;
    if (!h) { note(wb, 'No one is on the island yet.'); return; }
    head(wb, 'POP account \u00b7 ' + popOf(h));
    const list = document.createElement('div'); list.className = 'r9shop';
    wb.appendChild(list);
    const line = (k, col, title, hint, val, cost, buy) => {
      const can = cost != null && popOf(h) >= cost;
      const row = document.createElement('div');
      row.className = 'r9row' + (can ? '' : ' no');
      row.innerHTML = '<span class="k" style="color:' + col + '">' + k + '</span>'
        + '<span class="t">' + title + '<em>' + hint + '</em></span>'
        + '<span class="v">' + val + '</span>';
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'buy pe';
      b.textContent = cost == null ? 'nothing left' : '+1 \u00b7 ' + cost + ' POP';
      b.disabled = !can;
      b.onclick = (ev) => { ev.stopPropagation(); buy(); };
      row.appendChild(b);
      list.appendChild(row);
    };
    for (const s of STATS) line(kurz(s, game), s.col, s.label, s.hint, statVal(s), costOf(s), () => raise(s));
    /* Der Handplatz ist die zweite Ware des Runners — er führt sie unter `slot`, ohne Kennung.
       Kennt diese Fassung sie nicht, steht die Zeile trotzdem da, nur ohne Preis. */
    const sc = game.popCost ? game.popCost('slot') : null;
    line('\u25a3', '#6d5c3e', 'Act slot', 'one more card in your hand', (h.slots || 1), sc, () => {
      const r = game.popSpend ? game.popSpend('slot') : null;
      if (r && r.ok !== true && r.note && game.msg) game.msg(r.note);
      renderShop(); statSig = ''; renderStats();
    });
    note(wb, 'Prices come from the game, not from this sheet.');
  }
  shopSync = () => { if (popWin.classList.contains('on')) renderShop(); };
  /* Der Knopf ist ein Knopf: er drückt sich sichtbar herunter (zweites Blatt), solange der
     Zeiger liegt. **Das läuft über CSS `:active`, nicht über pointerdown** — die Torwache
     dieses Moduls hält `pointerdown` in der FANGPHASE am Shadow-Root an (damit die Welt unter
     dem HUD nicht mithört), also erreicht es sein Ziel nie. Ein Listener hier wäre toter Code;
     `:active` interessiert sich nicht für Ereignisweitergabe. */
  popBox.addEventListener('click', (e) => { e.stopPropagation(); showShop(true); });

  /* ── Zeremonie: ziehen, ansehen, annehmen ─────────────────────────────────
     Warum das nicht still passiert: der Actor IST der Spieler, und die Quest ist ein Auftrag des
     Königs. Beides ohne Geste zuzuweisen nimmt der Karte ihren Rang. Die Karten kommen deshalb
     sichtbar vom Rücken-Stapel auf der Insel (`OW_CARD.back` malt dasselbe Blatt in Rückseite),
     werden groß vorgelegt und wandern nach der Zusage klein an ihren Platz.

     Georgs Regel für später (hier absichtlich noch schlicht gehalten): die Karte wird nach dem OK
     kleiner und legt sich UNTER die vorderste Karte ihres Stapels — der Weg dorthin ist eine
     Kurve, keine Gerade. Das steckt in `flyTo`; wenn der Ablauf wächst, wächst er dort. */
  function stageRect(el) {
    const r = el.getBoundingClientRect(), rr = root.getBoundingClientRect();
    return { x: r.left - rr.left, y: r.top - rr.top, w: r.width, h: r.height };
  }
  function mkFly(w) {
    const el = document.createElement('div');
    el.className = 'r9fly';
    el.innerHTML = '<canvas></canvas>';
    el.style.width = w + 'px';
    el.style.height = (w / AR) + 'px';
    return el;
  }
  function place(el, x, y, w, rot, scale) {
    el.style.left = Math.round(x) + 'px';
    el.style.top = Math.round(y) + 'px';
    el.style.width = Math.round(w) + 'px';
    el.style.height = Math.round(w / AR) + 'px';
    el.style.transform = 'rotate(' + (rot || 0) + 'deg) scale(' + (scale == null ? 1 : scale) + ')';
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function runIntro() {
    if (introRunning || (state.intro && state.intro.done)) return;
    if (!(game.cards || []).length || !canon) return;
    introRunning = true;
    const stage = document.createElement('div'); stage.className = 'r9stage';
    root.appendChild(stage);
    game._ow7Paused = true; game.paused = true; halt();
    /* Die Bühne ist kein Spielfeld: kein Klick von hier erreicht die Welt. */
    stage.addEventListener('pointerdown', (e) => e.stopPropagation(), true);
    await wait(30); stage.classList.add('on');

    const rr = root.getBoundingClientRect();
    const mr = stageRect(mapEl);
    /* Georgs Vorgabe 10.8.: **die Karte muss viel größer sein — man kann ja nichts erkennen.**
       Vorher 0,26 der Fensterbreite, gedeckelt bei 320 px: das ist eine Briefmarke auf einer Fläche,
       die ein Vielfaches hergibt. Jetzt gegen **beide** Achsen, damit die Frage darunter im Bild
       bleibt — dieselbe Regel, die uns die Kartenschau beigebracht hat. */
    const bigW = Math.round(Math.max(320, Math.min(rr.width * 0.56, rr.height * 0.58 * AR)));
    /* Georgs Vorgabe 10.8.: der Stapel **überlagert die Insel knapp**, unregelmäßig gestapelt, die
       Ecken stehen subtil heraus. Vorher lag er mit 0,44 der Inselbreite mittig DRIN — dadurch las
       er sich als Beschriftung der Karte statt als Stapel, der darauf liegt. 1,02 ist »knapp«:
       gerade so groß, daß die gedrehten Ecken über die Kante ragen, ohne die Insel zu verdecken. */
    const deckW = Math.max(56, mr.w * 1.02);
    const deckX = mr.x + (mr.w - deckW) / 2, deckY = mr.y + (mr.h - deckW / AR) / 2;

    /* Der Rücken-Stapel liegt auf der Insel — dort wohnt das Deck.
       **Die echten Blätter, nicht das gezeichnete Ersatzblatt.** Hier stand `OW_CARD.back()`: ein
       cremefarbenes Blatt mit den Buchstaben »KFB«. Die vier gestempelten Rückseiten (Anti-Rules
       S. 16, geschnitten mit dem Vorderseiten-Raster) liegen seit dem Re-Home in `OW_BACKS` — das
       Rail ist älter als das Modul und hat sie nie gesehen. `SETS` ist synchron lesbar, also
       braucht das Chrome hier kein Versprechen (§4h Naht 2).
       **Unregelmäßig, aber nicht zufällig:** vier feste Lagen. Würfeln würde bei jedem Aufbau
       anders stapeln, und ein Stapel, der sich beim Zusehen umsortiert, ist keine Handlung. */
    const pile = document.createElement('div'); pile.className = 'r9deckpile';
    pile.style.left = deckX + 'px'; pile.style.top = deckY + 'px';
    pile.style.width = deckW + 'px'; pile.style.height = (deckW / AR) + 'px';
    const backs = (window.OW_BACKS && OW_BACKS.SETS && OW_BACKS.SETS.kfb) || [];
    const LAGEN = [[-3.1, 0, 3], [2.4, 4, 1], [-1.6, 1, 4], [0.6, 2, 0]];
    LAGEN.forEach((lage, i) => {
      let el;
      if (backs.length) {
        el = document.createElement('img');
        el.src = backs[(i * 3 + 1) % backs.length]; el.alt = '';
      } else {
        el = OW_CARD.back({ size: Math.round(deckW * 2), seed: 3 + i * 7 }).canvas;
      }
      el.style.transform = 'translate(' + lage[1] + 'px,' + (-lage[2]) + 'px) rotate('
        + lage[0] + 'deg)';
      pile.appendChild(el);
    });
    stage.appendChild(pile);
    await wait(420);

    const ask = document.createElement('div'); ask.className = 'r9ask';
    ask.innerHTML = '<p></p><div class="row"></div>';
    stage.appendChild(ask);
    const askP = ask.querySelector('p'), askRow = ask.querySelector('.row');
    function question(text, opts) {
      askP.textContent = text;
      askRow.innerHTML = '';
      return new Promise((res) => {
        opts.forEach((o) => {
          const b = document.createElement('button');
          if (o.hot) b.className = 'hot';
          b.textContent = o.label;
          b.onclick = () => { ask.classList.remove('on'); res(o.value); };
          askRow.appendChild(b);
        });
        requestAnimationFrame(() => ask.classList.add('on'));
      });
    }
    /* Ziehen: vom Stapel in die Mitte, mit einer Drehung, die sich beim Ankommen aufrichtet. */
    async function deal(card, x, y, w, rot) {
      const el = mkFly(deckW);
      place(el, deckX, deckY, deckW, -6, 0.9);
      el.style.opacity = '0';
      stage.appendChild(el);
      const draw = cardSheet(el.querySelector('canvas'), card, 41 + (card.n | 0), true);
      await wait(20);
      el.style.opacity = '1';
      place(el, x, y, w, rot || 0, 1);
      await wait(950);
      draw();
      return el;
    }
    async function flyTo(el, host, extraRot) {
      const t = stageRect(host);
      const w = Math.max(40, t.w);
      place(el, t.x, t.y + (host === qPileEl ? 0 : t.h - w / AR), w, extraRot || 0, 1);
      el.style.opacity = '0';
      await wait(900);
      el.remove();
    }

    /* 1 · Der Actor. Einmal darf man ablehnen — die zweite Karte ist die eigene. */
    let actor = null, declined = 0;
    while (!actor) {
      const c = drawActor(declined * 977 + 13);
      const el = await deal(c, (rr.width - bigW) / 2, rr.height * 0.13, bigW, 0);
      const opts = [{ label: 'Play as this one', value: true, hot: true }];
      if (declined < 1) opts.push({ label: 'Draw another', value: false });
      const ok = await question('\u00bb' + c.t + '\u00ab \u2014 your actor?', opts);
      if (ok) {
        actor = c;
        state.actor = c; S.save(); almSig = ''; renderAlmPile();
        await flyTo(el, almPileEl, -2);
      } else {
        declined++;
        place(el, deckX, deckY, deckW, 8, 0.85);
        el.style.opacity = '0';
        await wait(700); el.remove();
      }
    }

    /* 2 · Drei Angebote des Königs, nebeneinander. Eines wird angenommen. */
    const offers = await threeOffers();
    if (offers.length) {
      const gap = Math.max(12, rr.width * 0.02);
      const oW = Math.min(bigW * 0.86, (rr.width - 4 * gap) / 3);
      const total = offers.length * oW + (offers.length - 1) * gap;
      const els = [];
      for (let i = 0; i < offers.length; i++) {
        const el = await deal(offers[i], (rr.width - total) / 2 + i * (oW + gap),
          rr.height * 0.26, oW, (i - 1) * 2.2);
        el.classList.add('pick');
        els.push(el);
      }
      let chosen = 0;
      const mark = () => els.forEach((e, i) => e.classList.toggle('dim', i !== chosen));
      els.forEach((e, i) => { e.onclick = () => { chosen = i; mark(); }; });
      mark();
      await question('King Kayfabian offers three. Accept one?',
        [{ label: 'Accept quest', value: true, hot: true }]);
      state.quests = [offers[chosen]]; S.save(); qSig = '';
      state.intro = { done: true, declined }; S.save();
      renderQuests();
      for (let i = 0; i < els.length; i++) {
        if (i === chosen) await flyTo(els[i], qPileEl, 1.5);
        else { els[i].style.opacity = '0'; setTimeout(((e) => () => e.remove())(els[i]), 700); }
      }
    }
    state.intro = { done: true, declined }; S.save();
    stage.classList.remove('on');
    await wait(500);
    stage.remove();
    game._ow7Paused = false; game.paused = false;
    almSig = ''; qSig = '';
    renderAlmPile(); renderQuests(); ensureQuests(1);
    if (game.msg) game.msg('You are \u00bb' + actor.t + '\u00ab. The King has spoken.');
    introRunning = false;
  }
  /* Drei Angebote aus fremden Welten \u2014 nur aus Heften, die ihr Blatt auch ZEIGEN k\u00f6nnen. */
  async function threeOffers() {
    if (!CA) return [];
    const out = [];
    try {
      await CA.ready();
      const pool = CA.decks().filter((d) => d.packId !== (game.deck && game.deck.packId)
        && !(CA.isBroken && CA.isBroken(d.packId)));
      let guard = 0;
      while (out.length < 3 && pool.length && guard++ < 10) {
        const d = pool.splice(Math.floor(rand(game.att.seed + guard * 977) * pool.length), 1)[0];
        const cards = await CA.deckCards(d.packId);
        if (!cards.length) continue;
        const c = cards[Math.floor(rand(game.att.seed ^ (guard * 40503)) * cards.length)];
        const ok = await new Promise((res) => CA.art({ packId: d.packId, n: c.n },
          () => res(true), () => res(false)));
        if (!ok) continue;
        out.push({ packId: d.packId, n: c.n, t: c.t, l: c.l, deck: d.title });
      }
    } catch (e) { console.warn('[rail-v9b] Angebote:', e.message); }
    return out;
  }

  /* ── Roster: der Avatar ist eine Tür ──────────────────────────────────────
     Dasselbe Fenster wie der Almanach, nur mit Einheiten statt Blättern — blätterbar, weil der
     Katalog größer ist als jede Seite. Zum Testen ist alles freigeschaltet; die Sperrlogik hängt
     später an derselben Liste. */
  /* ── Freischalten: ein Gesicht verdient man ────────────────────────────────
     Vorher stand alles offen (Testschalter). Die Regel jetzt: **die eigene Fraktion kann man von
     Anfang an, alles andere schaltet frei, wer es besiegt hat.** Das braucht keine neue Tabelle —
     der Runner führt die Mobs, und ein Mob mit hp ≤ 0 ist ein Beleg. Der aktuelle Held zählt immer
     dazu, sonst könnte man sich selbst nicht wiederwählen. */
  if (!state.unlocked) state.unlocked = [];
  const bare = (id) => String(id || '').replace(/^hero_/, '').replace(/_(blue|red|yellow|purple|black)$/i, '');
  function unlockedSet() {
    const C = window.OW_UNITS;
    const s = new Set(state.unlocked.map(bare));
    for (const k in ((C && C.KNIGHT_CLASSES) || {})) s.add(k);   // die eigene Fraktion
    /* Auch die KFB-Helden sind eigene Seite — sie laufen nie als Mob herum, also könnte sie
       niemand »besiegen«. FrizzleBob stand hier von Hand; die übrigen kommen aus derselben
       Quelle, statt einzeln nachgetragen zu werden. */
    s.add('frizzlebob');
    for (const k in ((window.OW_HERO && window.OW_HERO.HEROES) || {})) s.add(k);
    const h = game.hero && game.hero.unit && game.hero.unit.id;
    if (h) s.add(bare(h));
    return s;
  }
  let rosterDirty = false;
  function harvestKills() {
    for (const m of (game.mobs || [])) {
      if (m.hp > 0 || m._r9seen) continue;
      m._r9seen = true;
      const id = m.unit && m.unit.id;
      if (!id) continue;
      const b = bare(id);
      if (state.unlocked.indexOf(b) < 0) {
        state.unlocked.push(b); S.save(); rosterDirty = true;
        if (game.msg) game.msg('A new face for the roster: ' + (m.unit.name || b) + '.');
      }
    }
  }

  /* ── Sprechblase ───────────────────────────────────────────────────────────
     Auch für gesperrte Einheiten: was man noch nicht spielen kann, darf man trotzdem lesen —
     sonst wäre die Sperre auch eine Wissenssperre. */
  const bub = document.createElement('div');
  bub.className = 'r9bub';
  bub.innerHTML = '<canvas></canvas><div class="ct"></div>';
  root.appendChild(bub);
  const bubEdge = bub.querySelector('canvas'), bubCt = bub.querySelector('.ct');
  let bubT = 0;
  /* Die Fähigkeiten kommen aus `roster()`, nicht aus der rohen Definition: dort normalisiert der
     Katalog Rolle, Angriffsfähigkeit und Temperament für JEDE Einheit — die Rowsheet-Ritter tragen
     in ihrer eigenen Definition gar kein `role`, ihre Blase las sich deshalb als „Knights" und
     sonst nichts. Und ein Hinweis auf ein vorhandenes Avatar-PNG war nie eine Fähigkeit, sondern
     eine Auskunft über unsere Dateiablage — der Chip ist raus. */
  let rosterMetaCache = null;
  function rosterMeta(id) {
    const C = window.OW_UNITS;
    if (!C || !C.roster) return null;
    if (!rosterMetaCache) {
      rosterMetaCache = {};
      for (const e of C.roster()) rosterMetaCache[e.id] = e;
    }
    return rosterMetaCache[bare(id)] || rosterMetaCache[id] || null;
  }
  function showBub(el, u, open) {
    clearTimeout(bubT);
    if (!open) { bub.classList.remove('on'); return; }
    const d = u.def || {};
    const m = rosterMeta(u.id) || {};
    const skills = [];
    /* Die SPEZIFISCHE Angabe gewinnt: `roster()` leitet die Rolle der Ritterklassen aus einer
       groben Ternäre ab (Archer → ranged, sonst melee) und machte damit aus dem Monk einen
       Nahkämpfer, obwohl seine eigene Definition `support` sagt. Die Liste ist für die Einheiten
       gut, die gar keine Rolle führen — überstimmen darf sie niemanden. */
    const role = d.role || m.role;
    if (role) skills.push(role);
    if (d.ranged && skills.indexOf('ranged') < 0) skills.push('ranged');
    if (m.canAttack === false) skills.push('no attack');
    if (m.temper) skills.push(m.temper);
    if (d.anims && d.anims.attack2) skills.push('combo');
    if (d.faction || m.group) skills.push(d.faction || m.group);
    bubCt.innerHTML = '<b>' + String(d.name || m.label || u.id).replace(/[<>&]/g, '') + '</b>'
      + skills.map((s) => '<span class="sk">' + String(s).replace(/[<>&]/g, '') + '</span>').join('')
      + '<em>' + (u.locked ? 'defeat one to unlock' : 'ready to play') + '</em>';
    const r = el.getBoundingClientRect(), rr = root.getBoundingClientRect();
    bub.style.left = Math.round(r.left - rr.left + r.width / 2 - 80) + 'px';
    bub.style.top = Math.round(r.top - rr.top - 8) + 'px';
    bub.style.transform = 'translateY(-100%)';
    bubT = setTimeout(() => {
      bub.classList.add('on');
      sheet(bubEdge, 401, (g, W, H) => { g.fillStyle = '#fdfaf2'; g.fillRect(0, 0, W, H); }, 0.7);
    }, 220);
  }

  /* ── Favoriten: sechs Plätze, per Zug befüllt ─────────────────────────────── */
  if (!state.favs) state.favs = [];
  const FAV_MAX = 6;
  let dragId = null;
  function renderFavs(host) {
    const wrap = document.createElement('div'); wrap.className = 'r9favs';
    const C = window.OW_UNITS;
    const all = rosterList();
    for (let i = 0; i < FAV_MAX; i++) {
      const id = state.favs[i];
      const u = id && all.filter((x) => x.id === id)[0];
      const slot = document.createElement('div');
      slot.className = 'r9fav' + (u ? ' set' : ' empty');
      if (u) {
        slot.innerHTML = '<canvas></canvas>';
        rosterFace(slot.querySelector('canvas'), u);
        slot.title = (u.def.name || u.id) + ' \u2014 click to play as \u00b7 drag out to clear';
        slot.onclick = () => pickUnit(u);
        slot.addEventListener('mouseenter', () => showBub(slot, u, true));
        slot.addEventListener('mouseleave', () => showBub(slot, u, false));
      } else slot.title = 'drop a face here';
      slot.addEventListener('dragover', (e) => { e.preventDefault(); slot.classList.add('over'); });
      slot.addEventListener('dragleave', () => slot.classList.remove('over'));
      slot.addEventListener('drop', (e) => {
        e.preventDefault(); slot.classList.remove('over');
        if (!dragId) return;
        const cur = state.favs.filter((f) => f !== dragId);
        cur.splice(Math.min(i, cur.length), 0, dragId);
        state.favs = cur.slice(0, FAV_MAX);
        S.save(); renderRoster();
      });
      wrap.appendChild(slot);
    }
    host.appendChild(wrap);
    const hint = document.createElement('p'); hint.className = 'r9favhint';
    hint.textContent = 'Drag a face up here \u2014 six favourites, in your order.';
    host.appendChild(hint);
  }
  function pickUnit(u) {
    const C = window.OW_UNITS;
    const cls = bare(u.id);
    const pickId = (C && C.KNIGHT_CLASSES && C.KNIGHT_CLASSES[cls]) ? cls : u.id;
    if (!(C && C.isHero && C.isHero(pickId))) return;
        showRoster(false);
        game.setAttribute('hero', pickId);
        avDone = '';
        setTimeout(halt, 60);   // der Neuladevorgang darf keinen Laufbefehl erben
        if (game.msg) game.msg('You are ' + (u.def.name || (u.meta && u.meta.label) || u.id) + ' now.');
  }

  const ROSTER_PER = 12;
  let rosterPage = 0;
  const rWin = document.createElement('div');
  rWin.className = 'v7-win';
  rWin.innerHTML = '<div class="v7-box r9box"><canvas class="edge"></canvas><div class="ct">'
    + '<div class="wh"><div><h3>Roster</h3><em>every face the island knows</em></div>'
    + '<button class="icobtn close pe" title="close (Esc)"></button></div>'
    + '<div class="wb"></div></div></div>';
  root.appendChild(rWin);
  guardWin(rWin);
  const rEdge = rWin.querySelector('canvas.edge');
  function showRoster(on) {
    rWin.classList.toggle('on', on);
    game._ow7Paused = on; game.paused = on;
    /* Auch beim SCHLIESSEN den Weg abräumen: ein Wechsel der Einheit lädt den Helden neu, und ein
       alter Laufbefehl hätte ihn sofort wieder losgeschickt — genau das las sich als »ich klicke
       im HUD und laufe nach rechts«. */
    halt();
    if (on) { renderRoster(); sheet(rEdge, 149, (g, W, H) => { g.fillStyle = PAPER; g.fillRect(0, 0, W, H); }); }
  }
  rWin.querySelector('.close').onclick = (e) => { if (e) e.stopPropagation(); showRoster(false); };
  /* Wer im Fenster steht, entscheidet der KATALOG — `roster()` ist dort ausdrücklich die eine
     Stelle dafür, und `isHero()` liest dieselbe Liste. Vorher zählte ich die rohen Wörterbücher
     auf: dabei fehlten Rogue, Knight, Mage und das Schaf, und fünf `warrior_free_*` standen als
     ewig gesperrte Kacheln da — mit der Aufforderung, sie zu besiegen, was nie gehen konnte.
     Das Bild zur Kachel kommt weiterhin aus den Wörterbüchern; farbige Ritterklassen nehmen die
     Farbe des Spielers. */
  function rosterList() {
    const C = window.OW_UNITS;
    if (!C || !C.roster) return [];
    const col = String((game.att && game.att.color) || 'Blue').toLowerCase();
    const out = [];
    for (const e of C.roster()) {
      const def = (e.colored && C.playable[e.id + '_' + col])
        || C.playable[e.id] || C.enemies[e.id] || C.critters[e.id]
        || (window.OW_HERO && window.OW_HERO.HEROES && window.OW_HERO.HEROES[e.id])
        || { name: e.label };
      out.push({ id: e.id, def, meta: e });
    }
    /* Gesichter zuerst: die Blätter sind das, wofür das Fenster da ist — wer keins hat, steht
       hinten. Die endgültige Reihenfolge (Freischaltung, Seltenheit, Favoriten) kommt später an
       dieselbe Liste. */
    out.sort((a, b) => (b.def.avatar ? 1 : 0) - (a.def.avatar ? 1 : 0));
    return out;
  }
  function renderRoster() {
    const wb = rWin.querySelector('.wb'); wb.innerHTML = '';
    const all = rosterList();
    const pages = Math.max(1, Math.ceil(all.length / ROSTER_PER));
    rosterPage = Math.max(0, Math.min(pages - 1, rosterPage));
    const slice = all.slice(rosterPage * ROSTER_PER, (rosterPage + 1) * ROSTER_PER);
    head(wb, 'Favourites \u00b7 ' + state.favs.length + ' of ' + FAV_MAX);
    renderFavs(wb);
    const unlocked = unlockedSet();
    head(wb, 'Page ' + (rosterPage + 1) + ' of ' + pages + ' \u00b7 ' + all.length + ' units');
    const grid = document.createElement('div'); grid.className = 'r9roster';
    /* Der Loader stellt spielbaren Einheiten ein `hero_` voran (`hero_thief`), der Katalog führt
       sie ohne (`thief`). Ein Vergleich der rohen Kennungen konnte deshalb NIE zutreffen — und das
       Fenster verschwieg genau die eine Sache, für die man es öffnet: welches Gesicht man trägt.
       Verglichen wird deshalb die abgestreifte Kennung, mit dem Namen als zweitem Weg. */
    const raw = (game.hero && game.hero.unit && game.hero.unit.id) || '';
    const here = raw.replace(/^hero_/, '');
    const hereName = (game.hero && game.hero.unit && game.hero.unit.name) || '';
    for (const u of slice) {
      const mine = u.id === here || u.id === raw
        || (!!hereName && (u.def.name || '') === hereName);
      const it = document.createElement('div');
      it.className = 'r9ru' + (mine ? ' me' : '');
      it.title = (u.def.name || (u.meta && u.meta.label) || u.id)
        + (u.def.role ? ' \u00b7 ' + u.def.role : '')
        + (u.def.ranged ? ' \u00b7 ranged' : '');
      /* Der Klick wählt — aber nur, was der Katalog als Held führt. `isHero` ist dieselbe Schranke,
         die der Runner beim Attribut anlegt; ohne sie führe die Wahl ins Leere und fällt still auf
         den Warrior zurück. Gegner sind Gegner, keine Rollen.
         Ritterklassen stehen im Katalog OHNE Farbe (`monk`), im `playable` MIT (`monk_blue`) —
         gewählt wird die Klasse, die Farbe bringt der Spieler mit. */
      const C = window.OW_UNITS;
      const cls = bare(u.id);
      const pickId = (C && C.KNIGHT_CLASSES && C.KNIGHT_CLASSES[cls]) ? cls : u.id;
      const known = !!(C && C.isHero && C.isHero(pickId));
      const open = known && unlocked.has(cls);
      u.locked = !open;
      it.classList.toggle('locked', !open);
      it.draggable = true;
      it.addEventListener('dragstart', () => { dragId = u.id; it.classList.add('drag'); });
      it.addEventListener('dragend', () => { dragId = null; it.classList.remove('drag'); });
      it.addEventListener('mouseenter', () => showBub(it, u, true));
      it.addEventListener('mouseleave', () => showBub(it, u, false));
      if (open) {
        it.title += ' \u2014 click to play as';
        it.onclick = () => pickUnit(u);
      } else it.title += ' \u2014 defeat one to unlock';
      it.innerHTML = '<canvas></canvas><b>'
        + String(u.def.name || (u.meta && u.meta.label) || u.id).replace(/[<>&]/g, '') + '</b>';
      rosterFace(it.querySelector('canvas'), u);
      grid.appendChild(it);
    }
    wb.appendChild(grid);
    const row = document.createElement('div'); row.className = 'row'; row.style.marginTop = '14px';
    const prev = document.createElement('button'); prev.className = 'pbtn';
    prev.textContent = '\u2190 back'; prev.disabled = rosterPage === 0;
    prev.onclick = () => { rosterPage--; renderRoster(); };
    const next = document.createElement('button'); next.className = 'pbtn';
    next.textContent = 'more \u2192'; next.disabled = rosterPage >= pages - 1;
    next.onclick = () => { rosterPage++; renderRoster(); };
    row.appendChild(prev); row.appendChild(next);
    wb.appendChild(row);
  }
  /* Jede Kachel ist ein Blatt — auch die ohne Avatar. Wer kein Avatarblatt hat, bekommt seinen
     Sprite-Kopf auf Papier mit derselben Kanon-Feder wie alles andere; ein CSS-Rahmen wäre die
     einzige gestochene Linie im ganzen Bild gewesen. Die Quelle steht im Katalog: `sheet` bei den
     Rowsheet-Einheiten (Zellmaß `cell`), `anims.idle` bei den Gegnern. Geladen wird ERST, wenn die
     Seite es zeigt — achtunddreißig Blätter auf Vorrat wären Verschwendung. */
  const faceImgs = new Map();
  function loadFace(url) {
    if (faceImgs.has(url)) return faceImgs.get(url);
    const p = new Promise((res) => {
      const im = new Image();
      // Ohne diese Zeile ist die Kachel danach "tainted" und die Alpha-Messung (spriteBox) wirft —
      // der Ausschnitt fiele stumm auf die ganze Zelle zurück. Der CDN erlaubt es, der Loader
      // des Spiels macht es genauso.
      im.crossOrigin = 'anonymous';
      im.onload = () => res(im);
      im.onerror = () => res(null);
      im.src = url;
    });
    faceImgs.set(url, p);
    return p;
  }
  function rosterFace(cv, u) {
    if (!cv) return;
    drawFace(cv, { id: u.id, def: u.def, anims: null }, 311 + (u.id.length * 7));
  }

  for (const el of [avImg, avCv]) {
    el.addEventListener('pointerdown', (e) => e.stopPropagation());
    el.onclick = () => showRoster(true);
  }
  /* Der Avatar WAR die Tür zum Aufgebot. Seit er ohne eigenes Blatt wegfällt (11.8.), darf die Tür
     nicht mit ihm verschwinden — sonst kostet ein Bildfehler den Bedienweg. **R** öffnet und
     schließt es, Escape schließt nur; getippt wird nicht in Feldern (der Name ist editierbar). */
  /* v12-H4 · ES WAR NICHT DER FILTER, ES WAR DIE SCHATTENGRENZE (Georg 12.8.: »wenn ich den Namen
     ändern will, ruft ›r‹ das Roster-Fenster auf«). `document.activeElement` gibt bei einem
     Shadow-Root **den Wirt** zurück, nicht das Feld darin — hier also das Spiel-Element, und das
     ist weder editierbar noch ein input. Die Abfrage war da, sie hat nur nie etwas gesehen.
     Jetzt steigt sie durch jede Schattenwurzel hinab.
     Merksatz: *eine Fokusabfrage, die keine Schattenwurzel kennt, prüft den falschen Knoten — und
     antwortet trotzdem, ohne Fehler.*
     (Warum nur die Tasten mit **capture** betroffen sind: das Feld schluckt seine Tastendrücke mit
     stopPropagation, aber eine capture-Zeile am Fenster läuft VOR dem Feld. Wer capture nimmt,
     muss selbst fragen, ob gerade getippt wird.) */
  const tippt = () => {
    let a = document.activeElement;
    while (a && a.shadowRoot && a.shadowRoot.activeElement) a = a.shadowRoot.activeElement;
    if (!a) return false;
    if (a.isContentEditable) return true;
    return /^(input|textarea|select)$/i.test(a.tagName || '');
  };
  const keyR = (e) => {
    if ((e.key || '').toLowerCase() !== 'r' || e.metaKey || e.ctrlKey || e.altKey || tippt()) return;
    showRoster(!rWin.classList.contains('on')); e.preventDefault(); e.stopPropagation();
  };
  game.addEventListener('keydown', keyR, true);
  window.addEventListener('keydown', keyR, true);
  const escR = (e) => {
    if ((e.key || '').toLowerCase() !== 'escape' || !rWin.classList.contains('on')) return;
    showRoster(false); e.preventDefault(); e.stopPropagation();
  };
  game.addEventListener('keydown', escR, true);
  window.addEventListener('keydown', escR, true);

  /* v12-H3 · EIN :hover AUF ETWAS OHNE pointer-events FEUERT NIE (Georg 12.8.: »chat fehlt onHover«).
     Das Logbuch ist absichtlich durchlässig — ein Logbuch, das Klicks auf die Welt frisst, wäre
     teurer als eins, das man nicht anfassen kann (Regel von oben, sie bleibt). Genau deshalb kann
     der Zeiger es aber auch nicht **berühren**, und die :hover-Zeile daneben war seit dem Tag tot.
     Also wird die Nähe gemessen statt erwartet: liegt der Zeiger im Rechteck des Logbuchs (plus
     22 px Saum), bekommt es `r9hot`. Kein pointer-events, keine gefressenen Klicks.
     Merksatz: *wer pointer-events abschaltet, schaltet :hover mit ab.* */
  const logEl = root.querySelector('.v7-log');
  if (logEl) {
    /* v12-H3b · EIN SCHWELLWERT, DER SEIN EIGENES MASS VERSCHIEBT, SCHWINGT (Georg 12.8.:
       »flackert durchgehend zwischen den Positionen«). Das Logbuch wuchs beim Erscheinen
       (translateX) — also änderte sich genau das Rechteck, an dem der Zeiger gemessen wurde:
       drin → es rückt → draußen → es rückt zurück → drin. Zwei Griffe dagegen: die Bewegung ist
       raus (CSS oben), und die Schwelle hat eine **Hysterese** — hinein bei 20 px Saum, hinaus
       erst bei 70, gemessen am Rechteck des RUHENDEN Zustands.
       *Wer eine Grenze an etwas misst, das die Grenze bewegt, hat einen Oszillator gebaut.* */
    let hot = false, kalt = null;
    window.addEventListener('pointermove', (e) => {
      if (!hot) {
        const r = logEl.getBoundingClientRect();
        if (!r.width || !r.height) return;
        kalt = r;
      }
      if (!kalt) return;
      const m = hot ? 70 : 20;
      const drin = e.clientX >= kalt.left - m && e.clientX <= kalt.right + m
        && e.clientY >= kalt.top - m && e.clientY <= kalt.bottom + m;
      if (drin === hot) return;
      hot = drin; logEl.classList.toggle('r9hot', hot);
    }, { passive: true });
  }

  /* ── Takt ───────────────────────────────────────────────────────────────── */
  let t0 = 0, lastSmall = 0, questT = 0;
  /* Die Aktionskarte ist das Maß — und sie steht erst da, wenn die Hand gezeichnet ist. Bis dahin
     legt der Stapel auf seiner Ersatzzahl aus; sobald das echte Maß da ist, wird nachgelegt. */
  function syncWidths() {
    const sw = smallW();
    if (sw === lastSmall) return;
    lastSmall = sw; almPile.lay(); qPile.lay();
  }
  /* ── Die untere Bahn: Logbuch und Aktionskarten teilen sich EINE Kante ────────
     Beide sitzen unten links — das Logbuch absolut (v7), die Hand mittig im Fluss. Der Faecher
     kippt die aeusseren Blaetter nach aussen, und **eine Transform zaehlt fuer das Layout nicht**:
     die Hand wusste deshalb nichts davon und schob ihr linkes Blatt unter das Logbuch. Genau das
     war auf Georgs Bild zu sehen — nicht zu wenig Platz, sondern eine Breite, die niemand mass.

     Also wird gemessen, nicht gerechnet: die TATSAECHLICH belegten Rechtecke werden verglichen.

     **Georg, 9.8.: die Hand wird gar nicht mehr geschoben.** Vorher reichte das Logbuch bei
     Ueberlapp ein Polster nach und die sechs Karten rutschten nach rechts — und weil das Logbuch
     nach neun ruhigen Sekunden einschlaeft und bei Zeigerkontakt wieder auftaucht, passierte genau
     das bei jedem Hover: das Bild sprang. Zwei Aenderungen, eine Regel:
       1 Nur EIN Teil bewegt sich, und es ist das Logbuch: bei Ueberlapp geht es eine Etage hoeher.
         Die Karten stehen fest, wo sie stehen.
       2 Entschieden wird an der GEOMETRIE, nicht an der Deckkraft. Das Logbuch liegt auch
         eingeschlafen an seinem Platz — also wird es schon dort gehoben, wo es noch unsichtbar
         ist, und taucht oben auf statt beim Auftauchen zu springen. */
  function lane() {
    const log = root.querySelector('.v7-log'), hand = root.querySelector('.v7-hand');
    if (!hand) return;
    const cards = hand.querySelectorAll('.v7-card');
    hand.style.paddingLeft = '';
    root.classList.remove('r9liftlog');
    if (!cards.length || !log) return;
    const cs = getComputedStyle(log);
    /* Was gar nicht da ist, braucht auch keine Etage. Die Deckkraft zaehlt hier bewusst NICHT
       mit — sie ist der Grund, warum es vorher sprang. */
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const hr = hand.getBoundingClientRect();
    root.style.setProperty('--r9hand', Math.round(hr.height) + 'px');
    /* Die Klasse ist eine Zeile darueber entfernt worden, das Lesen erzwingt den Umbruch: was
       hier gemessen wird, ist die RUHELAGE des Logbuchs. Damit ist die Entscheidung bei jedem
       Durchlauf dieselbe und kann nicht zwischen gehoben und gesenkt flattern. */
    const lr = log.getBoundingClientRect();
    if (lr.bottom < hr.top || lr.top > hr.bottom) return;
    let l = Infinity;
    for (const c of cards) {
      const b = c.getBoundingClientRect();
      if (b.width < 2) continue;
      if (b.left < l) l = b.left;
    }
    if (l === Infinity) return;
    if (lr.right + 14 > l) root.classList.add('r9liftlog');
  }
  /* ── Symbole auf den Handkarten ──────────────────────────────────────────
     Die Karte sagt bisher nur, wie sie heißt. Ab hier zeigt sie, was sie TUT — und zwar aus der
     Wirkung heraus (`ability.effect.type`), nicht aus dem Titel: eine neue Karte mit bekannter
     Wirkung bringt ihr Symbol von selbst mit, ohne Nachtrag an dieser Stelle.
     Der Runner baut die Hand (`buildHand`) und schreibt bei jedem Takt Titel, Kosten und Zustand
     nach — aber er löscht keine fremden Kinder. Deshalb hängt das Symbol als eigenes Kind in der
     Zeile und wird hier nur nachgezogen, wenn sich sein Name ändert. Kein Eingriff im Runner. */
  const FX_ICON = { freeze: 'freeze', distract: 'distract', heal: 'heal',
    bridge: 'bridge', meta: 'meta', mark: 'mark' };
  function heroRanged() {
    const u = game.hero && game.hero.unit;
    const d = (u && u.def) || unitDef(u && u.id);
    /* Drei Schreibweisen für dieselbe Sache im Katalog (geprüft): `ranged:true` bei den Knights,
       `role:'ranged'` bei den Gegnern, und wer schießt, hat ein `projectile`. */
    return !!(d && (d.ranged === true || d.role === 'ranged' || d.projectile));
  }
  function slotList() {
    try { return (game.hudConfig && game.hudConfig().slots) || []; } catch (e) { return []; }
  }
  function iconFor(slot, b) {
    if (b.classList.contains('locked')) return 'locked';
    if (b.classList.contains('ghost')) return '';
    const act = slot && slot.action;
    if (act === 'kayfabe') {
      const K = window.OW_KAYFABE, h = game.hero;
      const id = h && h.equipped && h.equipped[slot.arg | 0];
      const ab = id && K && K.ABILITIES[id];
      const t = ab && ab.effect && ab.effect.type;
      return (t && FX_ICON[t]) || '';
    }
    /* Die Signatur ist der schwere Schlag — wer aus der Ferne kämpft, schlägt nicht, der schießt. */
    if (act === 'signature') return heroRanged() ? 'ranged' : 'strike';
    if (act === 'window') return slot.arg === 'diary' ? 'diary' : 'island';
    return '';
  }
  /* Ein Blatt wird EINMAL geholt und liegt dann als Text bereit — sechs Karten teilen sich
     dieselben Figuren, und der Takt darf keine Anfrage ausloesen. */
  const ICO_SVG = new Map();
  function icoSvg(name) {
    if (ICO_SVG.has(name)) return ICO_SVG.get(name);
    const p = fetch(ICON_BASE + name + '.svg').then((r) => (r.ok ? r.text() : ''))
      .catch(() => '');
    ICO_SVG.set(name, p);
    return p;
  }
  function dressCards() {
    const hand = root.querySelector('.v7-hand'); if (!hand) return;
    const slots = slotList();
    hand.querySelectorAll('.v7-card').forEach((b, i) => {
      const body = b.querySelector('.body'); if (!body) return;
      const name = iconFor(slots[i] || null, b);
      let ic = b.querySelector('.r9ic');
      if (!name) { if (ic) ic.remove(); return; }
      /* VOR das Textblatt gelegt: gleiche Ebene, früher in der Reihenfolge — also darunter. */
      if (!ic) { ic = document.createElement('span'); ic.className = 'r9ic';
        b.insertBefore(ic, b.querySelector('.fc')); }
      if (ic._n === name) return;
      ic._n = name;
      icoSvg(name).then((svg) => { if (ic._n === name && svg) ic.innerHTML = svg; });
    });
  }

  function renderNear() {
    const t = paintMap.target(), h = game.hero;
    if (!t || !h) { near.classList.add('off'); return; }
    near.classList.remove('off');
    /* Das Pfeilblatt (Icon_08) zeigt nach LINKS — gemessen am Alphakanal, Spitze bei x=4 von 64.
       Damit seine Spitze auf die Peilung faellt, wird der Winkel um 180° gedreht; die Zahl steht
       hier, damit sie niemand fuer einen Tippfehler haelt und »korrigiert«. */
    const deg = Math.atan2(t.y - h.y, t.x - h.x) * 180 / Math.PI + 180;
    aimBtn.style.setProperty('--a', deg.toFixed(1) + 'deg');
    const d = Math.round(Math.hypot(t.x - h.x, t.y - h.y) / 64);
    /* Verdeckte Blaetter nennen ihren Titel NICHT. Ein Ort ohne Namen heisst hier »Unknown…« —
       das ist keine Verlegenheit, sondern die halbe Miete beim Suchen. */
    const name = (t.z && (t.z.secret || t.z.hidden)) || !t.label ? 'Unknown\u2026' : t.label;
    const label = '\u00bb' + name + '\u00ab';
    if (near._l !== label) { near._l = label; near.querySelector('b').textContent = label; }
    let tone = NEAR_TONES[NEAR_TONES.length - 1][1];
    for (const [max, col] of NEAR_TONES) { if (d <= max) { tone = col; break; } }
    if (tone !== nearTone) { nearTone = tone; paintNear(); }
    const tip = 'nearest \u00b7 ' + name + ' \u00b7 ' + d + ' steps \u2014 click to travel';
    near.title = tip; aimBtn.title = tip;
  }

  /* ── POP-Gewinn: Münze und Zahl, wo der Schlag fiel ────────────────────────────
     Der Runner wirft seinen eigenen Text »+n XP« in die Leinwand. Zwei Zahlen für denselben
     Gewinn wären eine zu viel — also wird der Wurf ABGEFANGEN und durch die Münze ersetzt.
     `floaters` wird beim Weltbau neu angelegt, deshalb wird die Klammer im Takt nachgezogen. */
  function hookFloaters() {
    const f = game.floaters;
    if (!f || f._r9) return;
    f._r9 = true;
    const orig = Array.prototype.push.bind(f);
    f.push = (o) => {
      const m = o && typeof o.txt === 'string' && /^\+(\d+)\s*XP$/.exec(o.txt);
      if (m) { popGain(+m[1], o.x, o.y); return f.length; }
      return orig(o);
    };
  }
  function popGain(n, wx, wy) {
    const cv = game.cv;
    if (!cv || !game.cam) return;
    const r = cv.getBoundingClientRect(), rr = root.getBoundingClientRect();
    const z = game.zoomEff ? game.zoomEff() : 1;
    const x = (wx - game.cam.x) * z + r.width / 2 + (r.left - rr.left);
    const y = (wy - game.cam.y) * z + r.height / 2 + (r.top - rr.top);
    if (!(x > -60 && y > -60 && x < rr.width + 60 && y < rr.height + 60)) return;
    const el = document.createElement('div');
    el.className = 'r9pop';
    el.style.left = Math.round(x) + 'px';
    el.style.top = Math.round(y) + 'px';
    el.innerHTML = '<span></span>+' + n;
    root.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  /* Enge Fenster: der Maßstab ist das FENSTER, nicht der Bildschirm — das HUD sitzt im
     Shadow-DOM einer Vorschau, die jede Breite haben kann. */
  function syncFit() {
    const w = root.clientWidth || 0;
    root.classList.toggle('narrow', w < 980);
    root.classList.toggle('tiny', w < 720);
  }
  function frame(t) {
    if (!game.isConnected) return;
    if (t - t0 > 130) {
      t0 = t;
      paintMap();
      syncWidths();
      lane();
      harvestKills();
      if (rosterDirty && rWin.classList.contains('on')) { rosterDirty = false; renderRoster(); }
      reconcile();
      /* Der Quest-Log muss auch dann nachziehen, wenn sich am Stapel nichts ändert: ein Deck wird
         erst als unlesbar bekannt, NACHDEM man es angefragt hat. Bis 9.8. lief das Ausmisten nur
         beim Neubau des Stapels — also nie, und die tote Quest blieb liegen. */
      if (t - questT > 2500) {
        questT = t;
        ensureQuests(1 + (game.collected || []).length);
      }
      renderNear();
      renderAlmPile();
      renderStats();
      paintAvatar();
      const fighting = !!game.inFight;
      root.classList.toggle('fight', fighting);
      if (fighting && logw && logw.classList.contains('idle')) wakeLog();
    }
    requestAnimationFrame(frame);
  }

  (window.OW_CARD ? OW_CARD.ready() : Promise.resolve(null)).then((ink) => {
    canon = ink || (window.OW_CARD && OW_CARD.canon) || null;
    if (!canon) console.warn('[rail-v9b] kein Tusche-Kanon — Blätter ohne Kante');
    paintBar();
    syncFit();
    renderStats();
    renderAlmPile();
    renderQuests();
    ensureQuests(1);
    new ResizeObserver(() => { almPile.lay(); qPile.lay(); paintBar(); paintEdge(); lane(); }).observe(root);
    /* Drei Dinge hängen NICHT am Bild: die Klammer um die Gewinn-Würfe, das Kompaktmaß und der
       Tonknopf. Sie stehen deshalb auf einer eigenen Uhr — ein Takt, der auch läuft, wenn der
       Browser die Bilder drosselt (versteckter Tab, Vorschau ohne Fokus). Sonst hätte ein
       Tabwechsel den Kill-Wurf still abgehängt. */
    /* **Was einen ZUSTAND zeigt, darf nicht am Bild haengen.** Dieselbe Uhr, dasselbe Argument
       wie oben — nur teurer gelernt: Statleiste, Portraet und die untere Bahn standen allein in
       der rAF-Schleife. Drosselt der Browser die Bilder (Vorschau ohne Fokus, versteckter Tab,
       Screenshot-Lauf), laeuft `frame()` nie, und das Blatt bleibt LEER: kein Fluff, keine
       Werte, POP 0, kein Gesicht — ohne eine Zeile Fehler. Genau die Klasse, die dieses Projekt
       sonst jagt: still ausfallen und dabei richtig aussehen.
       Die rAF-Schleife bleibt fuer die Fluessigkeit; diese Uhr ist das Netz darunter. Doppelt
       gerechnet wird nichts — jede der drei prueft ihre eigene Signatur. */
    setInterval(() => {
      hookFloaters(); syncFit(); syncSound(); runIntro();
      renderStats(); paintAvatar(); lane(); renderNear(); renderAlmPile(); dressCards();
      renderIdent(); checkTitel();
      /* **Zum zweiten Mal dieselbe Klasse** (§4m, Naht 28): `reconcile()` stand allein in der
         Bildschleife. Im gedrosselten Tab läuft die nicht — also blieben alle Kartenblätter auf
         dem Textstand, obwohl ihr Motiv längst im Speicher lag (gemessen: `OW_ART.art()`
         antwortete in 0 ms aus dem Cache). Was einen Zustand heilt, gehört nicht ans Bild. */
      reconcile();
    }, 800);
    requestAnimationFrame(frame);
    console.log('[rail-v9b] Kartenspalte steht · Quests', state.quests.length);
  });

  game.rail = {
    version: 'rail-v9b.3',
    get state() { return state; },
    get stats() { return STATS.map((s) => ({ id: s.id, label: s.label, value: statVal(s) })); },
    spendPop(id, n) {
      const s = STATS.filter((x) => x.id === id)[0];
      if (!s || s.from !== 'rail') return false;
      state.stats[id] = (state.stats[id] || 0) + (n || 1);
      S.save(); statSig = ''; renderStats();
      return true;
    },
    setActor(n) {
      const c = (game.cards || []).filter((x) => x.n === n)[0];
      if (!c) return false;
      state.actor = { packId: game.deck.packId, n: c.n, t: c.t, l: c.l, deck: game.deck.title };
      S.save(); almSig = ''; renderAlmPile();
      return true;
    },
    dropQuest(n) { state.quests = state.quests.filter((q) => q.n !== n); S.save(); renderQuests(); },
    openAlmanac: openAlm,
    openQuestLog: () => showQ(true),
  };
}

/* Kein Eingriff im Runner: warten, bis das v7-HUD im Shadow-DOM steht. */
let tries = 0;
const boot = setInterval(() => {
  for (const el of document.querySelectorAll('overworld-game'))
    if (el.shadowRoot && el.shadowRoot.querySelector('.v7') && !el._r9) install(el);
  if (++tries > 120) clearInterval(boot);
}, 120);

window.OW_RAIL = { version: 'rail-v9b.3', install,
  note: 'Rechte Spalte als KFB-Bl\u00e4tter: Insel, Quest-Stapel (f\u00e4chert nach unten), '
      + 'Almanach-Stapel (f\u00e4chert nach oben), Statleiste als Kopfblatt. Eine Sichtbarkeit f\u00fcr alles.' };
})();
