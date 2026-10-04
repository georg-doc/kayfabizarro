/* Native v14 rail-v9b.3 makePile; source blob 8555c44f539db20d1a174395d22afc60af3bddaa.
 * Donor: overworld/overworld-v14_2026-08-13/KFB-Overworld-v14-standalone.html @ 9c2fee62b815f19cf967867f54985bd22e3f222b.
 * Only drawing and width are injected; original fan/ring/hover/drag geometry is retained. */
import {CARD_AR as AR} from '../../../../skills/kfb-card-format.js';
  const VIS = 6;                       // Blätter im Fächer; alles darüber liegt auf dem Ring
export function makeAlmanacPile(host,{width=()=>224,drawCard}={}) {
    const smallW=width;
    const mk=cls=>{const el=document.createElement('div');el.className='r9c '+cls;el.innerHTML='<canvas></canvas>';return el};
    const cardSheet=(cv,card,seed)=>drawCard(cv,card,seed);
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
