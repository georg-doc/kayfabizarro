/* KFB Combat Arena v3 · runflow.v3.js — M7: DIE RUNDE HAT EINEN AUSGANG
   ────────────────────────────────────────────────────────────────────────────────────────────────
   Warum das vor dem Combat-Beat kommt (SPRINT §0): FB stand seit S3 auf 0 HP **ohne jede Folge**
   (LIVING §22). Ein Kampf, den man nicht verlieren kann, wird durch kein Hitstop spannender.

   FÜNF ZUSTÄNDE, JE EIN ÜBERGANG — keiner ist überspringbar, also kann die Runde nicht hängen:

       rüsten ──▶ countdown ──▶ play ──┬──▶ cleared ──▶ (naechste) ──▶ rüsten
                                       └──▶ verloren ─▶ (nochmal)  ──▶ rüsten

   ⚠ `rüsten` IST DER FÜNFTE ZUSTAND UND ER IST NICHT SCHMUCK. Solange die neue Karte gebaut wird
   und die Gegner noch nicht stehen, ist die Runde in KEINEM spielbaren Zustand — und genau das
   muss sie sagen können. Gemessen 06.09. (Kritiker), als es ihn nicht gab: `naechste()` setzte
   `countdown`, wartete dann rund eine Sekunde auf `newCard` + `ring.ready`, und weil
   `countdownAb` 0 ist, sprang `update()` im nächsten Bild nach `play` — dort fand die
   Clear-Prüfung **0 Lebende** (der Spawn lief ja noch) und warf sofort zurück nach `cleared`.
   Die Gegner erschienen danach in einer Phase, die nichts mehr verlässt: Tafel »Floor cleared«
   stand für immer, 3 Gegner griffen an, 300 synthetische Schritte änderten nichts.
   Merksatz: eine Phase, die einen `await` überspannt, muss ein eigener Zustand sein — sonst
   entscheidet die Uhr über einen Zustand, der noch gar nicht fertig aufgebaut ist.

   Dieses Modul besitzt **nur die Runde**: Phase, Uhr, Stockwerk, Punkte, Save-Abbild. Es besitzt
   keinen Szenenknoten, keine Figur, kein Feld — deshalb meldet es beim Wirt auch keine Fähigkeit
   an (CONTRACT §1: was nichts vom Wirt braucht, braucht keine Anmeldung). Der Integrator gibt ihm
   die vier Handgriffe, die es auslöst: `naechsteKarte` · `spawn` · `heilen` · `log`.

   ZWEI REGELN, DIE AUS BEZAHLTEN FEHLERN KOMMEN:
   · **Die Uhr ist die SIMULATIONSZEIT, nicht die Wanduhr.** Im verdeckten Fenster ist rAF
     gedrosselt (ENVIRONMENT CA-4); ein Countdown an `performance.now()` wäre dort sofort abgelaufen
     oder nie. Alles läuft über `update(dt)`.
   · **Gezählt wird, was lebt.** Die Karte ist gecleart, wenn `lebende().length === 0` — nicht wenn
     die Todes-Clips fertig sind (LIVING §15: C2 zählte im 0,9-s-Fenster Leichen als Lebende).      */

export const PHASEN = ['ruesten', 'countdown', 'play', 'cleared', 'verloren'];

export class RunFlow {
  /* Zustand VOR jedem await (LIVING §15: ein Objekt, das noch lädt, muss trotzdem antworten). */
  phase = 'countdown';
  t = 0;
  level = 1;
  countdownAb = 3;
  punkte = 0;
  kartenIds = [];
  verlustMs = null;      // Beweis für Boden C20: Abstand zwischen 0 HP und Phasenwechsel
  verlustGrund = null;   // »0 HP« oder »Karte schwarz« — zwei Enden derselben Zange (ENTWURF §2)
  _nullSeit = null;

  constructor(o = {}) {
    this.gf = o.gf || null;
    this.mb = o.mb || null;
    this.seed = o.seed || 20260906;
    /* ⚠ EIN OPTIONSFELD, DAS NIEMAND LIEST, IST EINE BEHAUPTUNG. `countdownAb` stand als
       Klassenfeld auf 3, und der Integrator übergab 0 — der Konstruktor las es nie, also blieb die
       Ziffer auf 3 stehen (Georg 06.09.: »countdown sollte dann erstmal weg (steht auf 3)« — die
       Ursache war nicht der Countdown, sondern mein nicht gelesenes Feld). Zweiter Fall derselben
       Familie wie »eine Zahl, die gesendet und nicht empfangen wird«. */
    if (o.countdownAb != null) this.countdownAb = Math.max(0, +o.countdownAb);
    this.naechsteKarte = o.naechsteKarte || (() => {});
    this.spawn = o.spawn || (() => {});
    this.heilen = o.heilen || (() => {});
    /* S11: die zweite Verlustbedingung. Die Runde FRAGT, sie rechnet nicht — wie schwarz die Karte
       ist, weiß nur die Zensur-Schicht (M12). Ohne Handgriff antwortet sie »nein«, dann läuft die
       Runde wie vor S11. */
    this.karteSchwarz = o.karteSchwarz || (() => false);
    this.log = o.log || (() => {});
    this.onPhase = o.onPhase || (() => {});
  }

  describe() { return { name: 'runflow.v3', schicht: 'runde', determinismus: 'seeded', braucht: [] }; }

  setze(p, grund) {
    if (this.phase === p) return p;
    this.phase = p; this.t = 0;
    /* ⚠ DIE UHR WIRD ZURÜCKGESETZT, ALSO AUCH DIE MARKE AUF IHR. `_nullSeit` überlebte den
       Phasenwechsel und wurde danach mit einer frischen `t` verglichen: gemessen 06.09.
       **verlustMs −6676** — und `tor()` ließ das durchgehen, weil es nur nach oben prüfte.
       Merksatz: ein Zeitstempel gehört zu SEINER Uhr; wer die Uhr stellt, wirft die Stempel weg. */
    this._nullSeit = null;
    /* Im Kampf wird geschossen, sonst nicht. EIN Schalter, und zwar der, den M5 selbst führt. */
    if (this.gf) {this.gf.aktiv = (p === 'play' || p === 'cleared');this.gf.roundPhase=p;}
    /* ⚠ FRIEDEN IST DER AUSGANGSZUSTAND JEDER KARTE (Georg 07.09.: »bei einer neuen Karte fangen die
       auch direkt an zu schießen — das sollten wir vermeiden und die gleiche Ausgangssituation
       schaffen«). `aggro` war ein Schalter fürs ganze Spiel: einmal gedrückt, blieb er es über alle
       Stockwerke. Jetzt wird er beim Aufbau zurückgenommen, und die Gegner streifen wieder.
       Merksatz: ein Zustand, der eine Runde beschreibt, muss mit der Runde zurückgesetzt werden. */
    if (this.gf && (p === 'ruesten' || p === 'countdown')) {
      this.gf.aggro = false;
      if (this.gf.mb) this.gf.mb.friedlich = true;
    }
    this.log('[runde] ' + p + (grund ? ' · ' + grund : '') + ' · Stockwerk ' + this.level);
    this.onPhase(p);
    return p;
  }

  lebende() {
    if (!this.mb) return [];
    return this.mb.lebende ? this.mb.lebende() : (this.mb.mobs || []).filter((m) => m && !m.tot);
  }

  update(dt) {
    if (!(dt > 0)) return this.phase;
    this.t += dt;
    if(this.gf)this.punkte=(this.gf.zaehler.kills||0)+(this.gf.coins||0);
    /* `rüsten` kennt keinen Übergang aus der Uhr — es endet, wenn der Aufbau fertig ist, und nur
       dort (`naechste`/`nochmal`). Die Uhr läuft mit, damit die Wartezeit messbar bleibt. */
    if (this.phase === 'ruesten') return this.phase;
    const hp = this.gf ? this.gf.hp : 1;

    if (this.phase === 'countdown') {
      if (this.t >= this.countdownAb) this.setze('play', 'Countdown abgelaufen');
      return this.phase;
    }

    if (this.phase === 'play') {
      /* NIEDERLAGE ZUERST. Wer im selben Bild den letzten Gegner tötet und selbst auf 0 fällt, hat
         gewonnen — deshalb steht `cleared` danach und prüft `hp > 0` (die sechs Zustände, SPRINT §5). */
      if (hp <= 0) {
        if (this._nullSeit == null) this._nullSeit = this.t;
        this.verlustMs = Math.round((this.t - this._nullSeit) * 1000);
        this.verlustGrund = '0 HP';
        return this.setze('verloren', '0 HP');
      }
      /* Die andere Backe der Zange: wer nichts tut, wird nicht angegriffen — aber die Karte wird
         schwarz. Steht NACH dem Nulltod, weil ein Körper auf 0 HP das dringendere Ereignis ist. */
      if (this.karteSchwarz()) {
        this.verlustGrund = 'Karte schwarz';
        return this.setze('verloren', 'Karte zu 100 % zensiert');
      }
      this._nullSeit = null;
      if (this.lebende().length === 0 && this.t > 0.4 && !this.gf?.rewards?.pendingDeaths()) {
        this.punkte = this.gf ? this.gf.zaehler.kills+(this.gf.coins||0) : this.punkte;
        return this.setze('cleared', 'kein Gegner mehr am Leben');
      }
    }
    return this.phase;
  }

  /** Nächstes Stockwerk: Karte tauschen, neu aufstellen, heilen, Countdown. */
  async naechste() {
    if (this.phase !== 'cleared') return this.phase;
    this.level++;
    this.setze('ruesten', 'nächste Karte wird gebaut');
    try { const id = await this.naechsteKarte(this.level); if (id) this.kartenIds.push(id); }
    catch (e) { this.log('[runde] Karte kam nicht: ' + ((e && e.message) || e)); }
    this.heilen();
    await this.spawn(3);
    /* Erst wenn die Gegner WIRKLICH stehen. Ein Countdown auf eine leere Karte wäre genau die
       Lücke, durch die die Runde vorher gefallen ist. */
    return this.setze('countdown', 'Karte steht · ' + this.lebende().length + ' Gegner');
  }

  /** Nach der Niederlage: dasselbe Stockwerk, dieselbe Karte, dieselbe Aufstellung (Seed). */
  async nochmal() {
    if (this.phase !== 'verloren') return this.phase;
    this.setze('ruesten', 'nochmal');
    this.heilen();
    await this.spawn(3);
    return this.setze('countdown', 'Aufstellung steht · ' + this.lebende().length + ' Gegner');
  }

  /* ── Save (Boden C5): alles, was Georg genannt hat — Level, Punkte, Kills, Karten, Seed ──── */
  snapshot() {
    const z = this.gf ? this.gf.zaehler : {};
    return {
      version: 3, seed: this.seed, level: this.level, phase: this.phase,
      punkte: this.punkte, kills: z.kills || 0, schuesse: z.schuesse || 0, treffer: z.treffer || 0,
      wuerfel: z.wuerfel || 0, pops: z.pops || 0, fbSchaden: z.fbSchaden || 0,
      coins: this.gf?.coins || 0, hp: this.gf ? this.gf.hp : null, karten: this.kartenIds.slice()
    };
  }

  load(o) {
    if (!o) return null;
    this.level = +o.level || 1;
    this.punkte = +o.punkte || 0;
    this.kartenIds = Array.isArray(o.karten) ? o.karten.slice() : [];
    if (this.gf) this.gf.coins = Math.max(0, +o.coins || 0);
    if (this.gf && o.hp != null) this.gf.hp = +o.hp;
    if (this.gf && o.kills != null) this.gf.zaehler.kills = +o.kills;
    if (this.gf) this.gf.zaehler.pops=(this.gf.zaehler.kills||0)+(this.gf.coins||0);
    this.setze('countdown', 'aus Save geladen');
    return this.snapshot();
  }

  /** Roundtrip-Beweis für C5: Abbild → Text → Abbild, Feld für Feld verglichen. */
  roundtrip() {
    const a = this.snapshot();
    const b = JSON.parse(JSON.stringify(a));
    const diff = Object.keys(a).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
    return { felder: Object.keys(a).length, diff };
  }

  probe() {
    return { phase: this.phase, t: +this.t.toFixed(2), level: this.level, punkte: this.punkte,
             lebende: this.lebende().length, hp: this.gf ? this.gf.hp : null, verlustMs: this.verlustMs,
             verlustGrund: this.verlustGrund };
  }

  zeile() {
    const p = this.probe();
    return '[runde] ' + p.phase + (p.phase === 'countdown' ? ' ' + Math.max(0, Math.ceil(this.countdownAb - this.t)) : (p.phase === 'ruesten' ? ' seit ' + p.t + ' s' : ''))
      + ' · Stockwerk ' + p.level + ' · ' + p.lebende + ' am Leben · FB ' + p.hp + ' HP'
      + (p.verlustGrund ? ' · verloren durch ' + p.verlustGrund : '')
      + (p.verlustMs != null ? ' · Verlust erkannt in ' + p.verlustMs + ' ms' : '');
  }

  /** Tor: der Ausgang existiert und wird schnell erkannt (C20). */
  tor() {
    const ok = this.verlustMs == null || (this.verlustMs >= 0 && this.verlustMs <= 1000);
    return { name: 'runflow.v3', pass: ok, zeile: 'C20 · Phasenwechsel bei 0 HP ' + (this.verlustMs == null ? 'noch nicht ausgelöst' : this.verlustMs + ' ms (≤ 1000)') };
  }
}

export default RunFlow;
