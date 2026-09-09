// ============================================================================
// fx-script.js — KFB Travel Globe v5 · Slice B/C · die Kaskaden als DATEN
// ----------------------------------------------------------------------------
// E-28: **eine Kaskade ist eine Datentabelle, kein Codezweig.** Diese Datei enthält keine Logik
// und importiert nichts — sie ist eine Partitur. Der Abspieler steht in `fx-bus.js`, die Wirker
// registriert der Runner.
//
// **Beat-Form:** `{ t: <Sekunden>, <wirker>: <Argumente> }` — genau ein Wirker je Beat, damit die
// Regel „höchstens drei Beats auf t = 0" (E-29) zählbar bleibt. Der Kontext des Anlasses
// (`pos`, `dir`, `strength`) kommt automatisch als letztes Argument dazu; kein Beat muss ihn
// nennen.
//
// **Die Zeitachse ist die eigentliche Arbeit.** Sie ist aus `FishCatchVfx.ts` abgeleitet, wo
// derselbe Vorgang (Beute wird eingesammelt und wandert zum Spieler) zwei Klänge zu zwei Zeiten
// hat: Splash bei t = 0, `fish_catch_1` bei t = 0,62 auf der Landung. Unsere Kartenflugdauer ist
// `card-flight.hold = 1,05 s` — dort liegt unsere Landung, und dort war bisher Stille.
//
// ⚠ **Zwei Klangdateien im Zufall, nicht eine.** tinyskies zieht `splash_1|splash_2`. Wir haben je
// Anlass nur eine Datei, also übernimmt die **Tonhöhe** die Varianz: `{ rate: [0.94, 1.06] }` sind
// ±6 % ≈ ein Halbton auf und ab. `tiny-audio.playSFX` kann das seit dem Port (vierter Parameter,
// geklemmt auf 0,35…2,0) — es wurde nur nie übergeben (D-08 §13.2a). Der Erzähler variiert seinen
// Pitch seit v2; die Karte nicht. Das war der Widerspruch in einer Zeile.
// ============================================================================

export const KASKADEN = {

  // ── Referenz-Kaskade · Kartendurchflug ────────────────────────────────────────────────────
  // Vorher: 6 Ereignisse bei t=0, Ankunft bei 1,05 s stumm. Jetzt: 3 bei t=0 (E-29 ausgereizt,
  // nicht überschritten), 4 danach — und der Höhepunkt hat seinen eigenen Ton.
  'card.collect': [
    { t: 0.00, sfx: ['card', 1.0, { rate: [0.94, 1.06] }] },
    { t: 0.00, trauma: ['karte'] },
    // Der Sidechain-Dip: Musik und Bett gehen kurz zurück, damit der Treffer laut WIRKT, ohne
    // lauter zu SEIN. `travel-audio.duck(on, amount)` ist derselbe Eingang, den der Erzähler
    // benutzt (0,62) — hier flacher und viel kürzer.
    { t: 0.00, duck: [0.30, 0.26] },
    // 0,06 s Versatz, weil der Streifen-Burst sonst im Shake untergeht: zwei Reize im selben Bild
    // sind ein Reiz.
    { t: 0.06, post: [0.45] },
    { t: 0.06, pet: ['kick', -0.14] },        // das Pet DUCKT sich — Vokabular war da, ungenutzt
    // v5 · Slice G · Der HUD-Rückstoß als BEAT. Vorher hing er an `hud.add()` und damit am
    // Erscheinen des Blattes; jetzt steht er in der Partitur, wo alle anderen Reize stehen.
    { t: 0.06, hud: [0.9] },
    // Der Tempo-Stoß als RAMPE, nicht als Sprung. PM-19: ein Sollwert, der springt, ist kein Ziel.
    { t: 0.10, speed: [0.34, 0.18] },
    // ⚠ **Die ANKUNFT steht NICHT hier.** Sie ist eine eigene Kaskade (`card.land`) und wird vom
    // Ankunfts-Rückruf von `card-flight` gefeuert — nicht bei `t = 1,05` geraten.
    // Der Unterschied ist der ganze Punkt: `hold` ist ein KONFIGURIERTER Wert, die Ankunft ein
    // EREIGNIS. Wer die Zeit hier hinschreibt, hat zwei Wahrheiten über denselben Moment — und die
    // gehen beim ersten Reglerdreh auseinander.
  ],

  // ── Ankunft der Karte im Stapel ────────────────────────────────────────────────────────────
  // **Hier war Stille.** Gemessen: 1,05 s nach dem Durchflug erscheint das Blatt und der Zähler
  // springt — ohne Ton, ohne Wucht. tinyskies legt genau auf diesen Moment seinen zweiten Klang
  // (`FishCatchVfx`: `fish_catch_1` bei t = 0,62, auf der Landung).
  // Der HUD-Recoil (`kfb-recoil`, 0,3 s, 35 % → `translateY(3px) scale(.94)`) und die
  // Einflug-Animation (`kfb-intake`, 0,34 s) waren gebaut und tonlos — drei Viertel des Moments
  // standen schon da (D-08 §12.6). `hud.add()` löst sie aus; diese Kaskade legt den Ton dazu.
  'card.land': [
    { t: 0.00, sfx: ['card', 0.72, { rate: [1.08, 1.18] }] },
    { t: 0.00, trauma: ['mikro'] },
  ],

  // ── Würfel-Durchflug ──────────────────────────────────────────────────────────────────────
  // Ein Würfel ist schwerer als eine Karte (Hartgummi gegen Papier) und seltener — also mehr
  // Trauma, tieferer Ton, und ein Staub-Burst, den es vorher gar nicht gab.
  'dice.collect': [
    { t: 0.00, sfx: ['roll', 0.9, { rate: [0.90, 1.02] }] },
    { t: 0.00, trauma: ['wuerfel'] },
    { t: 0.00, dust: [22, 0.5] },
    { t: 0.05, post: [0.45] },
    { t: 0.05, pet: ['kick', -0.20] },
    { t: 0.05, hud: [1.1] },       // ein Würfel ist schwerer als eine Karte — auch im HUD
  ],

  // ── Wegweiser-Kontakt ─────────────────────────────────────────────────────────────────────
  // Papier gegen Papier. Der Anschlag ist leicht, der NACHHALL ist die Reaktion des Schildes —
  // die dauert 1,1 s (`card-towers.reaktDauer`), also gehört dorthin ein zweiter, leiser Ton.
  'signpost.hit': [
    { t: 0.00, sfx: ['card', 0.35, { rate: [1.10, 1.30] }] },
    { t: 0.00, trauma: ['wegweiser'] },
    { t: 0.00, pet: ['kick', 0.06] },         // POSITIV: das Pet zuckt hoch, es duckt sich nicht
    // v6 · Slice E · Teil 2 · Der Aufleuchter (E-35). NICHT auf t=0: dort liegen schon drei Beats
    // (E-29 ist ausgereizt), und ein Leuchten IM Anschlag ist auch dramaturgisch falsch — zuerst
    // trifft das Papier, dann antwortet das Schild.
    { t: 0.08, glow: [1.0] },
    { t: 0.42, sfx: ['card', 0.18, { rate: [1.30, 1.50] }] },   // das Schild schwingt aus
  ],

  // ── Schuss ────────────────────────────────────────────────────────────────────────────────
  // Vorher: ein Ton, sonst nichts. Ein Schuss ohne Rückstoß liest als Bug.
  'shot.fire': [
    { t: 0.00, sfx: ['shoot', 1.0, { rate: [0.96, 1.10] }] },
    { t: 0.00, trauma: ['schuss'] },
    { t: 0.00, pet: ['kick', -0.06] },
  ],

  // ── Bodenkontakt ──────────────────────────────────────────────────────────────────────────
  // Die einzige Berührung mit der WELT statt mit einem Gegenstand — deshalb das schwerste Trauma
  // unter den Alltagsereignissen, und der einzige Anlass, bei dem der Staub die Hauptrolle hat.
  'ground.touch': [
    { t: 0.00, trauma: ['boden'] },
    { t: 0.00, dust: [46, 0.85] },
    { t: 0.00, sfx: ['land', 0.85, { rate: [0.88, 1.00] }] },
    { t: 0.12, pet: ['kick', -0.24] },        // erst der Aufprall, dann die Feder
    { t: 0.12, hud: [0.6] },                  // der Boden trifft das Fahrzeug, nicht die Anzeige
  ],

  // ── Boost-Einsatz ─────────────────────────────────────────────────────────────────────────
  // Kein Trauma: ein Boost ist kein Treffer. Die Wucht kommt aus der Kamera (Abstand 1,2 → 0,6)
  // und dem FOV — der ist hier der einzige Kanal, der überhaupt etwas tut.
  'boost.start': [
    { t: 0.00, sfx: ['boost', 1.0, { rate: [0.98, 1.06] }] },
    { t: 0.00, fov: [3.5, 0.45] },
    { t: 0.00, pet: ['roll'] },               // Barrel-Roll: `rollOnce()`, 0,85 s, war ungenutzt
    { t: 0.30, dust: [14, 0.6] },
  ],

  // ── Übergabe der Startansicht an den Flug (v5 · Slice C) ──────────────────────────────────
  // **Der stummste Moment des Spiels war der einzige, den JEDER Zuschauer sieht:** die
  // Startansicht endet, die Steuerung wechselt den Besitzer, und nichts sagt es. Der Runner
  // schrieb dort eine Zeile Erzählertext („Handover · W to throttle") und sonst nichts.
  //
  // Kein Trauma. Eine Übergabe ist kein Treffer — sie ist ein Anschub. Deshalb FOV und
  // Tempo-Rampe statt Wucht, und der Ton liegt **hinter** dem Bildwechsel (0,08 s): er
  // bestätigt die Übergabe, statt sie anzukündigen. Der Tempo-Stoß kommt zuletzt (0,34 s) und
  // über 0,9 s — das Anrollen gehört `carpet.setSpeedFloor`, dies ist nur der Schubs hinein.
  'intro.handover': [
    { t: 0.00, fov: [2.4, 0.5] },
    { t: 0.08, sfx: ['boost', 0.5, { rate: [1.02, 1.12] }] },
    { t: 0.08, pet: ['kick', 0.10] },          // POSITIV: es richtet sich auf, es duckt sich nicht
    { t: 0.34, speed: [0.18, 0.90] },
  ],

  // ── Respawn: zurück in die Startansicht (v5 · Slice C) ───────────────────────────────────
  // R oder der Panel-Knopf setzen Tempo auf null und beginnen die Startansicht neu. Der Vorgang
  // stand **zweimal** im Runner (Taste und Knopf) und war beide Male stumm — zwei Kopien einer
  // Sache, die dann auch noch nichts sagt (Fehlerklasse 1 plus D-08 §1). Jetzt: EINE Stelle im
  // Runner (`neustart()`), EINE Kaskade hier.
  //
  // Die Zeitachse ist die UMKEHRUNG des Durchflugs: erst wird die Welt still (`duck` zuerst,
  // tiefer und länger als bei einem Treffer), dann kommt der Ton, dann ein Mikro-Stoß. Ein
  // Rückzug, kein Einschlag — und genau deshalb ist der Ton tief gestimmt (0,74…0,86).
  'world.respawn': [
    { t: 0.00, duck: [0.50, 0.55] },
    { t: 0.00, dust: [18, 0.70] },
    { t: 0.06, sfx: ['water', 0.45, { rate: [0.74, 0.86] }] },
    { t: 0.06, trauma: ['mikro'] },
  ],

  // ── Wassereintritt ────────────────────────────────────────────────────────────────────────
  // Platzhalter mit Absicht: der eigentliche Effekt ist `carpet-wake.js` (Slice F). Bis dahin
  // steht hier, WANN er kommen muss — eine Kaskade ohne ihren Wirker ist eine Vormerkung, die
  // sich selbst meldet (`fx.report()` zählt den fehlenden Wirker).
  'water.enter': [
    { t: 0.00, sfx: ['water', 0.6, { rate: [0.92, 1.08] }] },
    { t: 0.00, trauma: [0.06] },
    { t: 0.00, wake: ['burst'] },
  ],

  // ── Portal-Durchflug (v6 · Slice E · E-32) ───────────────────────────────────────
  // **Der einzige Anlass des Spiels, bei dem sich die ganze WELT ändert** — und der einzige, bei
  // dem das Bild schon vor dem Ton anders ist: der Sprung ist im selben Bild vollzogen, in dem er
  // erkannt wurde. Eine Kaskade kann hier also nichts ANKÜNDIGEN; sie kann nur die Landung
  // erklären. Deshalb ist die Zeitachse hier umgekehrt gebaut wie bei einem Treffer:
  //   t = 0     der Riss — Welt wird still (`duck`), Blur auf Anschlag, tiefer Whoosh.
  //             Kein Trauma: ein Sprung ist kein Einschlag, und ein Shake auf einem harten
  //             Ortswechsel liest als Ruckler, nicht als Wucht.
  //   t = 0,06  der Raum weitet sich (FOV) — dazu der kleinste Trauma-Wert der Tabelle.
  //   t = 0,18  ANKUNFT: heller Ton, das Pet dreht sich einmal (es hat es überlebt).
  //   t = 0,34  Staub am neuen Ort und ein Schubs nach vorn — der Flug geht weiter.
  // ⚠ Der Staub kommt am ZIEL heraus, nicht am Portal: der Runner feuert NACH dem Sprung, also
  // ist `ctx.pos` der neue Ort. Das ist der Grund, warum die Kaskade den Ort nicht selbst nennt.
  'portal.pass': [
    { t: 0.00, duck: [0.55, 0.55] },
    { t: 0.00, post: [1.00] },
    { t: 0.00, sfx: ['boost', 0.95, { rate: [0.84, 0.92] }] },
    { t: 0.06, fov: [4.5, 0.5] },
    { t: 0.06, trauma: ['mikro'] },
    { t: 0.18, sfx: ['card', 0.50, { rate: [1.34, 1.50] }] },
    { t: 0.18, pet: ['roll'] },
    { t: 0.34, dust: [16, 0.6] },
    { t: 0.34, speed: [0.22, 0.70] },
  ],

  // ── Gegner (v6 · Slice E2) ───────────────────────────────────────────────
  // **ZWEI Kaskaden für ZWEI Ereignisse, und das ist der ganze Trick an „drei Treffer je Gegner":**
  // ein Treffer, der klingt wie ein Abschuss, macht die Lebensleiste unlesbar. Also ist `enemy.hit`
  // kurz und trocken (Papier auf Blech), `enemy.kill` hat die Zeitachse — Einschlag, dann der
  // Sturz, den man 0,8 s lang sieht (`sturzDauer` der Quelle), und erst dort der Staub.
  'enemy.hit': [
    { t: 0.00, sfx: ['shoot', 0.45, { rate: [1.20, 1.45] }] },
    { t: 0.00, trauma: ['wegweiser'] },   // dasselbe Gewicht wie Papier gegen Papier: es sitzt, es reisst nicht
    { t: 0.00, dust: [6, 0.35] },
  ],

  'enemy.kill': [
    { t: 0.00, sfx: ['roll', 0.85, { rate: [0.86, 0.98] }] },
    { t: 0.00, trauma: ['wuerfel'] },
    { t: 0.00, post: [0.55] },
    { t: 0.05, pet: ['kick', 0.12] },     // POSITIV: das Pet richtet sich auf — wir haben getroffen
    { t: 0.05, hud: [1.0] },
    // Der Sturz dauert 0,8 s (Quelle). Der zweite Ton liegt auf seinem ENDE, nicht auf dem Treffer
    // — dieselbe Regel wie bei der Kartenankunft: der Höhepunkt bekommt seinen eigenen Klang.
    { t: 0.62, sfx: ['land', 0.55, { rate: [0.90, 1.05] }] },
    { t: 0.62, dust: [18, 0.55] },
  ],
};
