// ============================================================================
// collect-hud.js — Collected cards: radial fan, centre counter, detail overlay
// ----------------------------------------------------------------------------
// KISS and DOM-only. Three parts, all English (Georg, 29.8.: "UI alles strict EN (später DE)").
//
// The fan mechanics are the ones that work in `KFB Overworld v15` (`overworld-v15/card-rail-v9b.js`,
// `.r9pile`): sheets sit on top of each other, the POINTER fans them out, hover raises the stack
// (z-index) and deepens the drop shadow. Adopted 1:1 in behaviour; the geometry here is radial
// because Georg asked for a counter in the CENTRE of the fan.
//
// Card motifs: the sheet carries the card canvas from `sky-cards` (the same texture the 3D card
// wears — one painter, no second pipeline). Only the last MAX sheets are kept, so it stays cheap.
//
// ⚠ No code quotes (backticks) anywhere in the CSS string — a backtick in a comment ends the
// template literal and kills the module. That has happened four times in this project.
// ============================================================================

const CSS = `
#kfb-hud { position:absolute; inset:0; z-index:9; pointer-events:none;
  font-family:'Special Elite', ui-monospace, monospace; }

/* ── stack, bottom right, in line with the gear icon ───────────────────────
   The gear sits at top:14 right:16 with 44 px width, so its centre line is 38 px from the right.
   The stack uses the SAME box width and the same right offset — one vertical line for both
   (Georg, 29.8.: "Karten & Stapel-Zahl in Flucht mit gear icon, dezent"). The sheets fan UPWARD
   on hover, up to just below the gear. */
#kfb-hud .fan { position:absolute; right:16px; bottom:18px; width:44px; height:64px;
  pointer-events:auto; }
/* Georg, 29.8.: "der kartenfaecher sieht ungestaltet aus, die ueberlappenden schwarzen outlines
   sind da vielleicht nicht die beste idee?" — stimmt, und der Grund ist messbar: bei 1,5 px Tusche
   auf 56 px Blatt und sechs gestapelten Blättern liegen im Ruhezustand 12 Kanten in 8 px
   übereinander. Das summiert sich zu einem schwarzen Klumpen, in dem kein einzelnes Blatt mehr
   lesbar ist — und eine Papierkante ist ohnehin keine gezogene Linie.
   Jetzt: helle Papierkante (das Blatt endet, wo das Papier aufhört) plus EIN weicher Schlagschatten
   als Trenner. Schatten überlagern sich weich, Striche nicht. */
/* Georg, 29.8.: "die stapel-KFB ink outlines im stapel stoeren -> statt dessen jede card mit
   schmalem harten schatten unten/rechts". Also KEINE Kante mehr, auch keine helle: ein Blatt
   endet, wo das Papier endet, und die Trennung macht ein harter Versatz-Schatten nach unten
   rechts. Das ist die Sprache eines Stapels (jedes Blatt wirft auf das darunter), waehrend eine
   Linie die Sprache einer Zeichnung ist. Kein Weichzeichnen: 2 px Versatz, 0 px Streuung. */
#kfb-hud .fan .sheet { position:absolute; left:50%; bottom:14px; width:56px; height:33px;
  margin-left:-28px; border:0; border-radius:2px;
  /* ⚠ v9 · contain statt cover — und das ist der eine Anschnitt, der hier BELEGT ist.
     Das Blatt ist 56×33 (Seitenverhältnis 1,697), eine Karte hat 1,74: mit cover wird das Motiv
     mittig beschnitten, damit es die Kachel füllt. Genau diese Ursache steht schon zweimal im
     Projekt — HOUSEKEEPING §Crop-Befund („Ursache ist allein cover statt fit") und die
     Kartenraster-Saga in travel-v13. Mit contain bleibt die Karte vollständig, der Rest der
     Kachel ist Papier (#f1e7cf), also sichtbar Blatt und nicht Fehler. */
  background:#f1e7cf center/contain no-repeat; cursor:pointer; pointer-events:auto;
  box-shadow:2px 2px 0 rgba(31,26,20,.55);
  transform-origin:50% 100%;
  transition:transform .34s cubic-bezier(.2,1.35,.4,1), box-shadow .3s ease, opacity .3s ease;
  font-size:7px; line-height:1.1; color:#1f1a14; overflow:hidden;
  display:flex; align-items:flex-end; justify-content:center; text-align:center; }
#kfb-hud .fan:hover .sheet { box-shadow:3px 3px 0 rgba(31,26,20,.6); }
#kfb-hud .fan .sheet:hover { transform:var(--up) scale(1.34) !important; z-index:30;
  box-shadow:4px 4px 0 rgba(31,26,20,.65); }
/* Aufnahme: das Blatt setzt sich kurz — mehr nicht. ⚠ Es war eine große Einflug-Animation von
   unten rechts, und das war ein ZWEITES Ereignis für denselben Vorgang: die 3D-Karte gleitet
   schon dorthin und ist im Moment der Übergabe genau so groß wie dieses Blatt. Wenn danach noch
   etwas hereinfliegt, sieht man die Karte zweimal ankommen — dieselbe Fehlerklasse wie die zwei
   gerenderten Karten, nur in CSS. Die Fortsetzung einer Bewegung ist ein Absetzen, kein Auftritt. */
#kfb-hud .fan .sheet.intake { animation:kfb-intake .34s cubic-bezier(.22,.9,.3,1) both; }
@keyframes kfb-intake {
  0%   { transform:translateY(-20px) scale(1.06); opacity:.35; }
  100% { transform:none; opacity:1; }
}
/* Der Stapel zuckt bei der Aufnahme kurz zusammen — er NIMMT das Blatt, statt es zu empfangen. */
#kfb-hud .fan.recoil { animation:kfb-recoil .3s ease-out both; }
@keyframes kfb-recoil {
  0% { transform:none; } 35% { transform:translateY(3px) scale(.94); } 100% { transform:none; }
}

/* Counter: below the stack, on the same centre line, quiet. */
#kfb-hud .count { position:absolute; right:16px; bottom:9px; width:44px; text-align:center;
  z-index:15; pointer-events:none; color:#f6efd9;
  font-family:'Irish Grover', cursive; font-size:15px; line-height:1;
  text-shadow:0 0 3px #1f1a14, 0 1px 0 #1f1a14, 0 2px 7px rgba(0,0,0,.7); }

/* ── Pop score, bottom left, same baseline as the card counter ─────────────── */
#kfb-hud .pop { position:absolute; left:16px; bottom:9px; display:flex; align-items:center;
  gap:7px; pointer-events:none; color:#f6efd9;
  text-shadow:0 0 3px #1f1a14, 0 1px 0 #1f1a14, 0 2px 7px rgba(0,0,0,.7); }
#kfb-hud .pop .n { font-family:'Irish Grover', cursive; font-size:15px; line-height:1; }
#kfb-hud .pop .lbl { font-size:9px; letter-spacing:.14em; opacity:.8; }

/* ── place name on fly-over ───────────────────────────────────────────── */
#kfb-hud .place { position:absolute; left:50%; top:64px; transform:translateX(-50%);
  padding:6px 14px; background:rgba(241,231,207,.92); color:#1f1a14;
  border:1.5px solid #1f1a14; border-radius:3px; font-size:13px; letter-spacing:.06em;
  box-shadow:0 4px 12px rgba(0,0,0,.3); opacity:0; transition:opacity .35s, transform .35s; }
#kfb-hud .place.on { opacity:1; transform:translateX(-50%) translateY(4px); }

/* ── detail overlay: OWN LAYER, and the SAME sheet as the settings ──────────
   #kfb-hud carries position + z-index and opens its own stacking context: a child with z-index
   9999 is trapped there and can never paint above #kfb-ui (z 12). Measured 29.8. — so this is a
   sibling layer with its own id. Paper, header, close button and type come from .kfb-sheet, which
   the settings panel defines: ONE overlay template for both. */
#kfb-look { position:fixed; inset:0; z-index:9999; display:none;
  align-items:center; justify-content:center; pointer-events:auto;
  background:rgba(31,26,20,.34); -webkit-backdrop-filter:blur(3px); backdrop-filter:blur(3px); }
#kfb-look.on { display:flex; }
#kfb-look .frame { position:relative; width:min(960px, calc(100% - 32px));
  max-height:calc(100% - 96px); overflow:auto; padding:0 14px 14px; }
#kfb-look img { display:block; margin:0 auto; max-width:100%; max-height:62vh;
  border:1.5px solid #1f1a14; border-radius:4px; box-shadow:0 8px 22px rgba(0,0,0,.28); }
`;

/** Die Standardwerte des Stapels. `rise` ist der Weg des obersten Blatts nach oben — gemessen so,
 *  dass es unter dem Zahnrad (top 14 px, 44 px hoch) endet und nichts verdeckt. */
export const HUD_QUELLE = Object.freeze({ maxSheets: 6, placeSeconds: 3.2, rise: 168 });

export function createCollectHud(opts = {}) {
  if (!document.getElementById('kfb-hud-css')) {
    const st = document.createElement('style');
    st.id = 'kfb-hud-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  // `rise` ist der Weg des obersten Blatts nach oben — gemessen so, dass es unter dem Zahnrad
  // (top 14 px, 44 px hoch) endet und nichts verdeckt.
  /* Slice D · v5 · Dieses Modul HATTE schon `params` — drei Werte. Der Slice ergänzt sie um die
   * Zahlen, die als Literale im Code lagen, und um `quelle`/`abweichungen`, damit es dieselbe
   * Auskunft gibt wie die anderen sieben. `HUD_QUELLE` ist hier NICHT tinyskies, sondern unsere
   * eigene erste Fassung — deshalb heißt der Bericht `off default` und nicht `off source`. */
  const P = Object.assign({}, HUD_QUELLE, opts.params || {});
  function abweichungen() {
    const a = [];
    for (const k in HUD_QUELLE) if (P[k] !== HUD_QUELLE[k]) a.push(k + ' ' + HUD_QUELLE[k] + '→' + P[k]);
    return a;
  }

  const root = document.createElement('div');
  root.id = 'kfb-hud';
  const fan = document.createElement('div');
  fan.className = 'fan';
  const count = document.createElement('div');
  count.className = 'count';
  count.textContent = '0';
  const place = document.createElement('div');
  place.className = 'place';
  const pop = document.createElement('div');
  pop.className = 'pop';
  pop.innerHTML = '<span class="n">0</span><span class="lbl">Pop</span>';
  const look = document.createElement('div');
  look.id = 'kfb-look';
  look.innerHTML = '<div class="frame kfb-sheet">'
    + '<div class="kfb-head"><div><div class="t"></div>'
    + '<div class="s">collected card</div></div>'
    + '<button class="kfb-x" type="button" title="Close">\u2715</button></div>'
    // ⚠ **Hier stand `<img alt="">` ohne `src` — und das ist per Definition ein kaputtes Bild.**
    // Georg, 1.9., am Screenshot: „oben rechts unter der Wortmarke scheint ein broken-icon
    // angezeigt zu werden." Richtig, und es war genau dieses Element: ein `<img>` ohne Quelle malt
    // in den meisten Browsern das Platzhalter-Symbol, auch bei 0×0 und in einem versteckten
    // Elternteil, sobald der Browser es einmal auflösen will.
    // Ein transparentes 1×1-Pixel als Startquelle kostet 68 Zeichen und hat immer eine Antwort.
    // *Ein Element vorzubauen ist richtig; es leer vorzubauen ist ein Bild, das um Hilfe ruft.*
    + '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"></div>';
  look.addEventListener('click', (e) => { if (e.target === look) close(); });
  look.querySelector('.kfb-x').addEventListener('click', close);
  root.appendChild(fan); root.appendChild(place); root.appendChild(pop);
  root.appendChild(count);   // NICHT in .fan: dort löste `right` gegen die 44-px-Box auf
  // `look` wird NICHT an `root` gehängt — der Aufrufer hängt es als eigene Schicht ein.

  const sheets = [];
  let n = 0, placeT = 0, popScore = 0;
  let mitArt = 0, ohneArt = 0;   // Blätter mit Artwork gegen Blätter mit Rückseite

  function close() { look.classList.remove('on'); }

  function open(bild, titel) {
    // Auch OHNE Motiv öffnen: sonst reagiert ein Blatt, dessen Umwandlung fehlschlug, stumm auf
    // den Klick — und stumm sieht wie kaputt aus.
    const img = look.querySelector('img');
    img.style.display = bild ? 'block' : 'none';
    if (bild) img.src = bild;
    look.querySelector('.kfb-head .t').textContent = titel || 'Card';
    look.classList.add('on');
  }

  /**
   * Two layouts, one transform per sheet: RESTING they lie on each other with a hint of rotation;
   * on hover they fan UPWARD (the CSS hover rule reuses the --up value). The topmost sheet lands
   * just below the gear icon, which is why the rise is capped by `P.rise`.
   */
  function layout() {
    const total = sheets.length;
    const hoch = P.rise / Math.max(1, total - 1);
    for (let i = 0; i < total; i++) {
      const k = total - 1 - i;                       // 0 = newest, on top
      const rest = 'rotate(' + (k % 2 ? -1.6 : 1.6) * Math.ceil(k / 2) + 'deg) translateY('
        + (-k * 1.6) + 'px)';
      const up = 'translateY(' + (-k * hoch) + 'px) rotate(' + (k % 2 ? -1 : 1) * (2 + k * 1.4)
        + 'deg)';
      sheets[i].style.setProperty('--up', up);
      sheets[i].style.transform = rest;
      sheets[i].dataset.up = up;
      // Tiefere Blätter werden nicht mehr transparent, sondern nur noch abgedunkelt: Transparenz
      // liess den Hintergrund durchscheinen, und dadurch sah der Stapel löchrig aus statt tief.
      sheets[i].style.opacity = '1';
      sheets[i].style.filter = k ? 'brightness(' + (1 - Math.min(0.34, k * 0.07)).toFixed(2) + ')' : 'none';
      sheets[i].style.zIndex = String(14 - k);
    }
  }
  // Hover on the stack: every sheet moves to its fanned position (CSS alone cannot address
  // siblings by index, so the JS writes the transform and CSS carries the timing).
  fan.addEventListener('pointerenter', () => {
    for (const s of sheets) s.style.transform = s.dataset.up || s.style.transform;
  });
  fan.addEventListener('pointerleave', () => layout());

  function add(card, canvas) {
    n++;
    // Zählen, was das Blatt WIRKLICH trägt. Die Rückseite wird 720 px breit gemalt
    // (`cardTexture`), das Artwork 900 (`artTexture`) — die Breite ist damit die ehrlichste
    // Unterscheidung, die das HUD ohne Kenntnis der Kartenpipeline treffen kann.
    // Ohne diese Zahl war Georgs Befund („im Stapel mit Pre-Loading-Backside") nur sichtbar, nicht
    // messbar — und ein Fehler, der nur beim ersten Fund auftritt, ist genau der, den man ohne
    // Zähler nicht wiederfindet.
    if (canvas && canvas.width >= 860) mitArt++; else ohneArt++;
    const s = document.createElement('div');
    s.className = 'sheet';
    const titel = String((card && (card.title || card.n)) || 'KFB');
    let bild = null;
    // Card motif: the canvas of the 3D card, once converted. Cheap because it happens per pickup,
    // not per frame — and only the last sheets are kept.
    try {
      if (canvas && canvas.toDataURL) { bild = canvas.toDataURL('image/webp', 0.8); s.style.backgroundImage = 'url(' + bild + ')'; }
    } catch (e) {}
    if (!bild) s.textContent = titel.slice(0, 40);
    s.title = titel;
    s.addEventListener('click', () => open(bild, titel));
    fan.appendChild(s);
    sheets.push(s);
    if (sheets.length > P.maxSheets) sheets.shift().remove();
    layout();
    // Aufnahme: EINE Klasse, das Timing steht im CSS. `layout()` schreibt `transform` direkt, also
    // muss die Animation NACH dem Layout starten — und sie überschreibt die Ruhelage nur für ihre
    // Dauer (`both` + `animation`-Vorrang), danach gilt wieder die Ruhelage aus `layout()`.
    s.classList.add('intake');
    fan.classList.remove('recoil');
    void fan.offsetWidth;                 // Reflow: sonst startet die Animation beim 2. Mal nicht neu
    fan.classList.add('recoil');
    setTimeout(() => { s.classList.remove('intake'); fan.classList.remove('recoil'); }, 460);
    count.textContent = String(n);
    count.style.transition = 'none';
    count.style.transform = 'scale(1.4) rotate(-5deg)';
    requestAnimationFrame(() => {
      count.style.transition = 'transform .4s cubic-bezier(.2,1.6,.4,1)';
      count.style.transform = 'scale(1) rotate(0deg)';
    });
  }

  /** Pop score: pips of the impact face. One punch, no counter animation — KISS. */
  function addPop(pips) {
    popScore += pips;
    const el = pop.querySelector('.n');
    el.textContent = String(popScore);
    el.style.transition = 'none';
    el.style.transform = 'scale(1.45) rotate(-6deg)';
    requestAnimationFrame(() => {
      el.style.transition = 'transform .4s cubic-bezier(.2,1.6,.4,1)';
      el.style.transform = 'scale(1) rotate(0deg)';
    });
    return popScore;
  }

  function showPlace(text) {
    place.textContent = text;
    place.classList.add('on');
    placeT = P.placeSeconds;
  }

  return {
    name: 'collect-hud', el: root, lookEl: look, add, showPlace, open, close, addPop,
    params: P, quelle: HUD_QUELLE, abweichungen,
    zeile() {
      const a = abweichungen();
      return Object.keys(HUD_QUELLE).length + ' params · '
        + (a.length ? '⚠ ' + a.length + ' off default: ' + a.join(', ') : 'all at default')
        + ' · ' + n + ' collected · ' + sheets.length + '/' + P.maxSheets + ' sheets'
        + ' · ' + mitArt + ' with artwork'
        + (ohneArt ? '  ·  ⚠ ' + ohneArt + ' still backside' : '');
    },
    get pop() { return popScore; },
    /** Mitte des Pop-Zählers in CSS-Pixeln — das Ziel für fliegende Sammelstücke (muenzen.js).
     *  Der Zähler ist der EINE Ort, an dem Punkte ankommen; wer dorthin fliegen will, fragt hier
     *  nach der Adresse, statt sie zu schätzen. */
    popAnker() {
      const r = pop.getBoundingClientRect();
      if (!r.width) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
    hidePlace() { place.classList.remove('on'); placeT = 0; },
    /** The name fades by itself — otherwise it sticks, like the audio hint in v2. */
    update(dt) { if (placeT > 0) { placeT -= dt; if (placeT <= 0) place.classList.remove('on'); } },
    get count() { return n; },
    get detailOpen() { return look.classList.contains('on'); },
    report() { const a = abweichungen();
                return { cards: n, sheets: sheets.length, placeVisible: placeT > 0,
                        mitArtwork: mitArt, mitRueckseite: ohneArt,
                        detail: look.classList.contains('on'),
                        parameter: Object.keys(HUD_QUELLE).length,
                        abweichungen: a.length, abweichend: a }; },
    dispose() { root.remove(); },
  };
}
