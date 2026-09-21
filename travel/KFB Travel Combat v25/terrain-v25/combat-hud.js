// ============================================================================
// combat-hud.js — KFB Travel Combat v25.1 · Das EINE HUD: Action-Leiste, HP, Pop, Zielmarke
// ----------------------------------------------------------------------------
// **Neubau, nicht Umbau** (Georg, 05.09.): „ich wäre fast dafür, das irgendwie alles ganz
// minimalistisch und clean zu machen." Der alte Kopfbereich — Wortmarke, HP-Leiste, Pop-Score,
// Tacho-Würfel, Zielmarke mit Namenszeile — waren fünf Dinge an vier Rändern, und keines davon
// hat im Reiseflug etwas zu sagen.
//
// ═══ DAS MODELL: ZWEI EINGABERÄUME, NICHT EINER ═════════════════════════════════════════════
// Die Entscheidung, die diesen Slice trägt, ist Georgs: eine Action-Leiste unten. Ihr Wert ist
// nicht „mehr Knöpfe", sondern eine TRENNUNG — der Eingaberaum der WELT (Maus: zielen, feuern,
// Karten anklicken) und der Eingaberaum der FÄHIGKEITEN (Leiste: Klick oder Zifferntaste) sind
// nicht mehr derselbe Pixel. Damit ist Doppelklick im Feld wieder frei für Weltinteraktion, und
// das Kartengespräch kann zurückkommen, ohne mit dem Abzug zu streiten.
// Slot 1 und 2 sind die Waffen und sind VOLLWERTIGE Eingabe (Georgs Wahl): Klick und Taste feuern
// genauso wie die Maus. Sie sind damit nicht nur Anzeige, sondern ein zweiter Weg für jemanden,
// der mit Tasten fliegt und die Maus nicht am Abzug hat.
//
// ═══ GEOMETRIE ══════════════════════════════════════════════════════════════════════════════
//   Zahnrad          oben rechts (`gear-icon.js`, eigener Renderer)
//   Slot-Reihe       unten mittig, wächst von 2 auf bis zu 6
//   HP-Leiste        DIREKT DARUNTER, mittig, **feste Breite** (Georg ausdrücklich: sie darf sich
//                    nicht ändern, wenn 2–6 Slots sichtbar sind). Damit ist die Leiste der SOCKEL
//                    und die Slots wachsen darauf — eine Leiste, die mit der Slot-Zahl atmet,
//                    wäre ein zweites bewegliches Ding an derselben Kante.
//                    Feste Breite = die Reihe mit sechs Slots (6 × 40 + 5 × 6 = 270 px).
//   Pop              KEINE Dauerzahl mehr, nur der Steiger am Abschussort (Georgs Wahl)
//   Zielmarke        vier dünne Ecken, ohne Text (v25, Naht 139)
//
// Zeit nur aus `dt`. Farben aus der KFB-Palette (kfb-combat-def: INK, GOLD, RED, PAPER).
// ============================================================================

const INK = '#1f1a14', GOLD = '#e9c14a', PAPER = '#f3ead3', RED = '#b8361f', GREEN = '#7fb04a';
const SLOT = 44, GAP = 6, MAXSLOTS = 6;
/* v25.2b · 44 px, nicht 40: **dieselbe Kantenlänge wie das Zahnrad.** Georg, 05.09.: „Würfel sind
   viel zu klein (kleiner als Buttons, kleiner als Gear)" — und das war beides wahr. Der Würfel füllt
   jetzt 0,94 seiner Zelle (`slot-dice`), also rund 41 px, und Zelle und Zahnrad tragen dieselbe
   Zahl. Eine Maßfamilie, kein Augenmaß. */
const BAR_W = 3 * SLOT + 2 * GAP;   // 144 px, unabhängig von der Slot-Zahl

export function createCombatHud(o) {
  const stageOf = o.stage || (() => document.getElementById('tv-hud'));
  const onSlot = o.onSlot || (() => {});
  const root = document.createElement('div');
  root.id = 'kfb-combat-hud';
  root.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';

  // ── Unterbau: Slot-Reihe + HP darunter, beide mittig, EIN Block
  const dock = document.createElement('div');
  dock.id = 'kfb-hud-dock';
  /* v25.2e · Der Sockel ist jetzt eine VARIABLE (Georg, 06.09.: „Meta-Text unter den Würfeln
     anzeigen statt darüber"). Damit die Textzeile unter die Leiste kann, muß die Leiste um deren
     Höhe steigen — und das darf nicht diese Datei entscheiden: sie kennt die Zeile nicht. Also
     nimmt sie einen Sockel an (`setSockel`), und ihr Eigentümer, der Runner, rechnet ihn aus dem
     gemessenen Textkasten. 12 px bleibt der Wert, solange niemand etwas anderes sagt. */
  let sockel = 12;
  const dockCss = () => 'position:absolute;left:50%;bottom:' + sockel + 'px;transform:translateX(-50%);'
    + 'display:flex;flex-direction:column;align-items:center;gap:7px;';
  dock.style.cssText = dockCss();
  const reihe = document.createElement('div');
  reihe.style.cssText = 'position:relative;display:flex;gap:' + GAP + 'px;align-items:flex-end;';
  dock.appendChild(reihe);
  /* v25.2 · **Die Würfel-Leinwand liegt HINTER den Knöpfen.** Sie zeichnet nur; geklickt wird
     weiter auf die DOM-Knöpfe (Trefferfläche, Tastatur, Titel, Fokusring). Ein Canvas, das Klicks
     selbst verteilen müßte, wäre ein zweiter Eingabepfad neben dem, der schon funktioniert.
     Der Wirt reicht die Leinwand herein (`o.dice`), weil das Laden des GLB seine Sache ist. */
  const dice = o.dice || null;
  if (dice && dice.canvas) reihe.appendChild(dice.canvas);

  /* HP unter den Slots. Feste Breite, und die Umrandung ist EIN Rahmen mit `box-sizing:border-box`
     — die alte Fassung hatte einen 2-px-Rand auf einem Element, dessen Füllung 100 % Höhe hatte,
     und genau daraus entstand Georgs „falsche Outline, da ist irgendwie eine Lücke zu sehen": die
     Füllung lief unter den Rand, nicht bis an ihn. Kein Schatten mehr nach unten rechts — auf einer
     4 px hohen Leiste ist ein Schlagschatten ein zweiter Strich. */
  const hpWrap = document.createElement('div');
  hpWrap.style.cssText = 'width:' + BAR_W + 'px;height:6px;box-sizing:border-box;border:1.5px solid ' + INK + ';'
    + 'border-radius:3px;background:rgba(31,26,20,.42);overflow:hidden;opacity:0;transition:opacity .3s;';
  const hpFill = document.createElement('div');
  hpFill.style.cssText = 'height:100%;width:100%;background:' + GREEN + ';transition:width .12s linear, background .25s;';
  hpWrap.appendChild(hpFill); dock.appendChild(hpWrap);
  root.appendChild(dock);

  // ── Zielmarke: vier dünne Ecken, kein Text (Naht 139)
  const mark = document.createElement('div');
  mark.style.cssText = 'position:absolute;width:36px;height:36px;transform:translate(-50%,-50%);display:none;';
  for (let i = 0; i < 4; i++) {
    const c = document.createElement('div');
    const top = i < 2, left = i % 2 === 0;
    c.style.cssText = 'position:absolute;width:7px;height:7px;border:1.5px solid ' + GOLD + ';'
      + (top ? 'top:0;border-bottom:none;' : 'bottom:0;border-top:none;') + (left ? 'left:0;border-right:none;' : 'right:0;border-left:none;')
      + 'filter:drop-shadow(0 1px 0 rgba(31,26,20,.7));';
    mark.appendChild(c);
  }
  root.appendChild(mark);

  // ── Burnout-Blende, Meldung, Treffer-Flash (unverändert: sie sagen etwas, wenn es zählt)
  const veil = document.createElement('div');
  veil.style.cssText = 'position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at 50% 50%, rgba(184,54,31,0) 30%, rgba(31,26,20,.85) 100%);transition:opacity .25s;';
  root.appendChild(veil);
  const msg = document.createElement('div');
  msg.style.cssText = "position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);font-family:'Irish Grover',cursive;font-size:44px;color:" + PAPER + ";text-shadow:0 4px 0 " + INK + ";opacity:0;transition:opacity .2s;white-space:nowrap;";
  root.appendChild(msg);
  const flash = document.createElement('div');
  flash.style.cssText = 'position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at 50% 50%, rgba(184,54,31,0) 45%, rgba(184,54,31,.55) 100%);';
  root.appendChild(flash);

  const floaters = [];
  let popVal = 0, flashT = 0, msgT = 0, hpShown = 100, hpSicht = 0, platzT = 0;

  /* ═══ v25.1d · DER HUD BESITZT DEN UNTEREN BILDRAND ═════════════════════════════
     v25.1b hat die Leiste über ihre Nachbarn GEHOBEN, um die Kollision zu lösen — richtig gegen die
     Überschneidung, falsch gegen Georgs Wunsch („action buttons & HP weiter nach unten"). Also die
     andere Richtung, und die ist die ehrlichere: **die Leiste bleibt unten, der TEXT weicht.**
     Begründung, die über Geschmack hinausgeht: Meta-Zeile und Zonen-Streifen sind Auskunft für den
     AUTOR (Seed, Welt, Palette, Lektion); Slots und HP sind Auskunft für den SPIELER. Wenn zwei
     Dinge um dieselbe Kante streiten, gewinnt das, was man im Spiel braucht.
     Diese Datei hebt die Nachbarn nicht selbst — sie gibt nur ihre Höhe heraus (`hoehe`). Wer sie
     verschiebt, ist ihr Eigentümer (der Runner). Ein HUD, das fremde Elemente umsetzt, wäre ein
     zweiter Schreiber auf deren Position. */
  function sockelSetzen(px) {
    const v = Math.max(0, Math.round(+px || 0));
    if (v === sockel) return false;
    sockel = v; dock.style.cssText = dockCss();
    return true;
  }

  // ── Die Slots. Sie werden aus der Beschreibung des Wirts GEBAUT, nicht hier erfunden:
  // welche es gibt, entscheidet der Kampf (Waffen) und der Kontext (Karte, Pickups).
  const zellen = new Map();   // id → { el }
  function slotEl(s, i) {
    const el = document.createElement('button');
    el.type = 'button';
    el.title = s.name + (s.key ? ' (' + s.key + ')' : '');
    /* v25.2 · **Der Knopf ist unsichtbar, der Würfel IST der Knopf.** Kein Rahmen, keine Füllung,
       kein Zeichen, keine Zifferntaste — die Augen sagen die Zahl, und ein Rahmen um einen Körper
       macht aus dem Körper wieder ein Bild in einer Zelle. Was bleibt, ist die Trefferfläche von
       40 px (die Mindestgröße, die dieses Projekt zitiert) und der Fokusring für die Tastatur.
       Hover und Klick gehen an die Würfel-Leinwand: dort verformt der Cartoon-Deformer, hier
       würde ein CSS-`transform` ein zweites, nicht abgestimmtes Wackeln erzeugen. */
    el.style.cssText = 'position:relative;width:' + SLOT + 'px;height:' + SLOT + 'px;padding:0;'
      + 'pointer-events:auto;cursor:pointer;border:0;background:transparent;outline:none;'
      + '-webkit-tap-highlight-color:transparent;';
    el.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.__hudClaimed = true; if (dice) dice.klick(s.id); onSlot(s.id); });
    el.addEventListener('pointerenter', () => { if (dice) dice.hover(s.id, true); });
    el.addEventListener('pointerleave', () => { if (dice) dice.hover(s.id, false); });
    return { el };
  }
  /** Der Wirt sagt, welche Slots es gibt. Gleiche Liste = kein Neubau (der Vergleich läuft über
   *  die IDs, nicht über die Länge: ein Tausch bei gleicher Zahl wäre sonst unsichtbar). */
  let signatur = '';
  function setSlots(list) {
    const l = (list || []).slice(0, MAXSLOTS);
    const sig = l.map((s) => s.id + ':' + s.key).join('|');
    if (sig === signatur) return false;
    signatur = sig;
    reihe.textContent = ''; zellen.clear();
    if (dice && dice.canvas) reihe.appendChild(dice.canvas);
    l.forEach((s, i) => { const z = slotEl(s, i); reihe.appendChild(z.el); zellen.set(s.id, z); });
    /* Die Augenzahl IST die Slot-Nummer (Georgs Idee): Slot 1 zeigt ein Auge. Damit trägt derselbe
       Körper Identität und Position, und später Ladungen — ohne Text, ohne Abzeichen. */
    if (dice) dice.setzen(l.map((s, i) => ({ id: s.id, augen: i + 1, farbe: s.farbe })));
    return true;
  }

  function attach() {
    if (document.contains(root)) return;
    const s = stageOf(); if (s) s.appendChild(root);
  }
  attach();

  return {
    name: 'combat-hud', root, get slotBreite() { return BAR_W; },
    /** Eigene Höhe in px — der Runner hängt die Meta-Zeile und den Zonen-Streifen darüber. */
    get hoehe() { const r = dock.getBoundingClientRect(); return Math.round(r.height) + sockel; },
    /** v25.2e · Sockelhöhe der Leiste in px — der Runner setzt sie auf die Höhe der Meta-Zeile,
     *  die jetzt UNTER der Leiste steht. Rückgabe: hat sich etwas geändert? */
    setSockel: sockelSetzen,
    get sockel() { return sockel; },
    /** v25.2b · Wie hoch die UNTERKANTE DER WÜRFELREIHE über dem Bildrand liegt. Das Zahnrad liest
     *  das und setzt sich auf dieselbe Grundlinie — Georgs „gear & Würfel haben keine gemeinsame
     *  Flucht". Gemessen statt gerechnet: die HP-Leiste darunter ändert ihre Höhe, wenn jemand am
     *  Rand dreht, und eine addierte Konstante wäre dann still falsch. */
    get reiheUnten() {
      const r = reihe.getBoundingClientRect();
      /* Rückfall ist NICHT 12 (der Sockel), sondern die Unterkante der Reihe, wie sie sich aus den
         drei Zahlen dieser Datei ergibt: Sockel 12 + HP-Leiste 6 + Zwischenraum 7 = 25. Warum das
         wichtig ist: das Zahnrad liest diesen Wert, und der Abgleich hängt an der Bildschleife.
         Mit 12 als Rückfall stand es einen Moment falsch und SPRANG dann um 13 px — ein sichtbarer
         Fehler in der ersten halben Sekunde jeder Sitzung. Die Messung korrigiert weiter, wenn die
         Lage anders ausfällt; der Rückfall ist nur der richtige Startwert. */
      if (!r.height) return 12 + 6 + 7;
      return Math.max(0, Math.round((window.innerHeight || 0) - r.bottom));
    },
    get slotMass() { return SLOT; },
    setSlots,
    /** Nach dem Nachladen der Würfel-Geometrie: Signatur verwerfen, damit der nächste Takt die
     *  Reihe neu baut. Ohne das bliebe sie leer — `setSlots` baut nur bei Änderung, und das GLB
     *  kommt später als der erste Aufbau. */
    entwerten() { signatur = ''; },
    /** Zustand je Slot: Abklingzeit 0…1 und ob er scharf ist. Je Bild, billig. */
    setSlotState(id, st) {
      const z = zellen.get(id); if (!z) return;
      // Die Abklingzeit ist jetzt die DECKKRAFT des Würfels (Georg: „Transparenz ist die Uhr").
      if (dice) dice.zustand(id, { cool: Math.max(0, Math.min(1, (st && st.cool) || 0)) });
      z.el.style.opacity = (st && st.bereit === false) ? '.55' : '1';
    },
    setPop(n, delta, at) {
      popVal = n;
      if (!delta) return;
      /* Pop ist jetzt NUR der Steiger am Ort des Abschusses (Georgs Wahl). Die Dauerzahl oben
         rechts ist weg: eine Zahl, die sich alle zwei Minuten um eins ändert, ist kein Instrument,
         sie ist Möblierung. Der Steiger dagegen ist die Belohnung, und die gehört an den Ort. */
      const f = document.createElement('div');
      f.textContent = (delta > 0 ? '+' : '') + delta + (at && at.text ? ' ' + at.text : '');
      f.style.cssText = 'position:absolute;left:' + (at && at.x != null ? at.x : 50) + '%;top:' + (at && at.y != null ? at.y : 50) + '%;transform:translate(-50%,-50%);'
        + "font-family:'Irish Grover',cursive;font-size:" + (Math.abs(delta) > 1 ? 40 : 27) + 'px;color:' + (Math.abs(delta) > 1 ? RED : GOLD) + ';text-shadow:0 3px 0 ' + INK + ';white-space:nowrap;';
      root.appendChild(f); floaters.push({ el: f, t: 0, y: at && at.y != null ? at.y : 50 });
    },
    setHp(v, max) {
      hpShown = Math.max(0, Math.min(100, (v / (max || 100)) * 100));
      hpFill.style.width = hpShown + '%';
      hpFill.style.background = hpShown >= 80 ? GREEN : (hpShown >= 20 ? GOLD : RED);
    },
    /** v25.1 · Die Leiste erscheint mit dem KAMPF, nicht mit dem Schaden (Georgs Wahl: „erster
     *  Aggro oder eigener Schuss"). Begründung: sonst lernt man, dass es eine Leiste gibt, in dem
     *  Moment, in dem sie schon zählt. `hpSicht` ist eine Restzeit in Sekunden — der Wirt stößt sie
     *  an, `update` blendet aus. Unter 100 % HP bleibt sie IMMER: eine Wunde ist ein Zustand. */
    kampfPuls(sek) { hpSicht = Math.max(hpSicht, sek == null ? 4.5 : sek); },
    hit() { flashT = 0.35; },
    burnout(on, text) { veil.style.opacity = on ? '1' : '0'; if (text) { msg.textContent = text; msg.style.opacity = '1'; msgT = 2.2; } else if (!on) msg.style.opacity = '0'; },
    say(text, secs) { msg.textContent = text; msg.style.opacity = '1'; msgT = secs || 1.4; },
    setTarget(ndc, label, w, h) {
      if (!ndc || ndc.z > 1) { mark.style.display = 'none'; return; }
      mark.style.display = 'block';
      mark.style.left = ((ndc.x + 1) * 0.5 * w) + 'px'; mark.style.top = ((1 - ndc.y) * 0.5 * h) + 'px';
    },
    update(dt) {
      attach();
      if (hpSicht > 0) hpSicht -= dt;
      // Sichtbar, solange der Kampf nachklingt ODER etwas fehlt. Zwei Bedingungen, eine Zahl.
      hpWrap.style.opacity = (hpSicht > 0 || hpShown < 99.5) ? '1' : '0';
      if (flashT > 0) { flashT -= dt; flash.style.opacity = String(Math.max(0, flashT / 0.35)); }
      if (msgT > 0) { msgT -= dt; if (msgT <= 0) msg.style.opacity = '0'; }
      for (let i = floaters.length - 1; i >= 0; i--) {
        const f = floaters[i]; f.t += dt;
        const k = f.t / 1.1;
        if (k >= 1) { f.el.remove(); floaters.splice(i, 1); continue; }
        f.el.style.top = (f.y - k * 14) + '%';
        f.el.style.opacity = String(1 - Math.max(0, (k - 0.55) / 0.45));
        f.el.style.transform = 'translate(-50%,-50%) scale(' + (1 + Math.sin(Math.min(1, k * 3) * Math.PI) * 0.35) + ')';
      }
    },
    get pop() { return popVal; },
    zeile() { return 'combat-hud · ' + zellen.size + ' Slots · HP ' + Math.round(hpShown) + ' % · Leiste ' + BAR_W + ' px fest' + (dice ? ' · ' + dice.zeile() : ''); },
    dispose() { root.remove(); },
  };
}
