/* KFB Combat Arena v3 · clipmarks.v3.js — DP2: DIE FEUERZEIT WIRD GEMESSEN, NICHT GESETZT
   ────────────────────────────────────────────────────────────────────────────────────────────────
   Boden **C14**: der Abgang eines Schusses liegt auf der Feuerpose der Figur, ≤ 1 Bild (16,7 ms)
   daneben.

   ⚠ WAS »FEUERPOSE« HEISST — zweimal beantwortet, einmal falsch. Erste Fassung: das Tempo-Maximum
   der Hand. Falsch, und Georg hat es sofort am Bild gesehen: »während FB noch den Arm bewegt, wird
   der Schuss ausgeloest, bevor die Gun die Abschuss-Position erreicht«. Die Hand ist am schnellsten
   MITTEN im Vorschnellen und steht an dessen Ende still. Der Abgang gehoert ans ENDE — an die
   groesste Ausladung nach vorn. Merksatz: der Gipfel einer Bewegung ist nicht ihr Ziel.

   WARUM DAS EIN EIGENES MODUL IST. In v2 stand die Feuerzeit als **Bruchteil einer Clipdauer**
   (`_schussHalt`) und die Vorhaltezeit `ant` kam aus der Mech-Bühne — einer ANDEREN Figur mit
   anderen Clips. Zwei geerbte Zahlen für eine Sache, die man an dieser Figur ablesen kann.

   DAS VERFAHREN (dasselbe wie `kfb-stride-measure.js`, dort für die Schrittlänge):
   den Clip in N Schritten abspielen, dabei die Weltposition der WAFFENSPITZE lesen und ihr Tempo
   bilden. Das Maximum ist der Abgang — im Schuss ist die Spitze genau dann am schnellsten, wenn
   die Waffe nach vorn schnellt. Kein Auge, keine Meinung, eine Kurve.

   ⚠ ZWEI FALLEN, BEIDE BEZAHLT:
   · **Die Aktion darf NICHT pausiert sein.** `mixer.setTime(t)` ruft intern `update(dt)`, und
     `update` überspringt pausierte Aktionen — mit `paused = true` bewegt sich das Skelett nie und
     die Kurve ist flach. (Genau das stand hier vorher als »Lösung«.)
   · **`updateMatrixWorld(true)` vor jedem Lesen.** Ohne das liest man die Matrix des letzten
     Bildes und die Kurve ist um einen Schritt versetzt — genau der Fehler, den C14 messen soll.  */

export function messeFeuerzeit({ THREE, root, clip, spitze, schritte = 120 }) {
  if (!THREE || !root || !clip || !spitze) return null;
  const mixer = new THREE.AnimationMixer(root);
  const akt = mixer.clipAction(clip);
  /* ⚠ EINE PAUSIERTE AKTION WIRD VOM MIXER ÜBERSPRUNGEN — und genau das stand vorher hier, samt
     einem Kommentar im Dateikopf, der es als Lösung verkaufte. `mixer.setTime(t)` ruft intern
     `update(t − alteZeit)`, und `update` überspringt jede Aktion mit `paused === true`: das
     Skelett bewegte sich nie, die Kurve blieb flach, und ich habe zuerst den Beobachtungspunkt
     verdächtigt (Waffenmesh → Handknochen) statt den Antrieb.
     Merksatz: wenn sich NICHTS bewegt, liegt es eher am Antrieb als am Fühler. */
  akt.reset(); akt.play(); akt.paused = false; akt.setEffectiveWeight(1);
  const dauer = clip.duration || 0;
  if (!(dauer > 0)) return null;

  /* ⚠ NICHT DAS TEMPO-MAXIMUM, SONDERN DIE AUSGESTRECKTE POSE (siehe Dateikopf). Gemessen wird die
     AUSLADUNG: die Position des Beobachtungspunkts im lokalen System der Figur, projiziert auf die
     Achse mit der größten Spanne — die Vorwärtsachse des Clips, gefunden statt angenommen (Rigs
     zeigen mal nach +Z, mal nach −Z). Das Tempo bleibt als Kurve erhalten: es sagt, ob überhaupt
     eine Bewegung da war. */
  /* ⚠ DIE ABFOLGE IST MATHEMATISCH KLAR — man muss nur die richtige Größe messen (Georg 06.09.:
     »die Abfolge muss doch mathematisch klar sein, oder?«). Ja, und meine drei Fehlversuche haben
     alle die falsche gemessen:
       Tempo         wie SCHNELL die Hand ist  → sagt nichts über die Richtung
       Ausladung     wie WEIT sie vorn ist     → sagt nichts über die Richtung
     Ein Schuss fällt, wenn der **Lauf auf das Ziel zeigt**. Das ist ein WINKEL, keine Strecke und
     kein Tempo — und ein Winkel hat ein eindeutiges Minimum.
     Gemessen wird also je Schritt der Winkel zwischen der Laufachse und der Blickachse der Figur.
     Welche der sechs Achsen des Handknochens der Lauf ist, wird nicht angenommen, sondern
     bestimmt: es ist die, die im Verlauf des Clips dem Ziel am nächsten kommt.
     Merksatz: die Frage »wann wird geschossen« ist eine Frage nach der Richtung, nicht nach dem Weg. */
  const p = new THREE.Vector3(), vor = new THREE.Vector3(), lok = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const ACHSEN = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  const ziel = new THREE.Vector3(0, 0, 1);          // Blickachse der Figur, in ihrem eigenen System
  const bahn = [];
  for (let i = 0; i <= schritte; i++) {
    const t = (i / schritte) * dauer;
    mixer.setTime(t);
    root.updateMatrixWorld(true);
    spitze.getWorldPosition(p);
    lok.copy(p); root.worldToLocal(lok);
    /* Die Orientierung des Knochens IM SYSTEM DER FIGUR — sonst mischt sich die Drehung der Figur
       selbst in die Messung. */
    spitze.getWorldQuaternion(q);
    q.premultiply(root.getWorldQuaternion(new THREE.Quaternion()).invert());
    const winkel = ACHSEN.map((a) => {
      const v = new THREE.Vector3(a[0], a[1], a[2]).applyQuaternion(q).normalize();
      return Math.acos(Math.max(-1, Math.min(1, v.dot(ziel)))) * 180 / Math.PI;
    });
    bahn.push({ t, v: i > 0 ? p.distanceTo(vor) / (dauer / schritte) : 0, x: lok.x, y: lok.y, z: lok.z, w: winkel });
    vor.copy(p);
  }
  akt.stop(); mixer.uncacheClip(clip);
  if (!bahn.length) return null;

  /* ⚠ EINE FLACHE KURVE IST KEINE MESSUNG. Beim ersten Lauf stand über alle 120 Schritte Tempo 0 —
     der beobachtete Punkt war eine Waffenmesh, die NICHT unter dem animierten Skelett hängt (sie
     wird erst im Takt der Figur an den Handknochen gesetzt). Der Mixer bewegte also das Skelett,
     und ich las etwas, das davon nichts mitbekommt. Das Modul sagt das jetzt, statt `fireAt 0.006`
     zu melden — eine Zahl aus einer flachen Kurve ist schlimmer als keine.
     Merksatz: bevor man ein Maximum sucht, prüft man, ob sich überhaupt etwas bewegt hat. */
  const weg = bahn.reduce((a, b) => a + b.v, 0);
  if (!(weg > 1e-4)) return { name: clip.name, dauer: +dauer.toFixed(3), fireAt: null, scharf: false,
    grund: 'Beobachtungspunkt bewegt sich im Clip nicht — hängt er unter dem Skelett?' };

  let gipfel = bahn[0];
  for (const b of bahn) if (b.v > gipfel.v) gipfel = b;
  const spanne = (k) => { let lo = Infinity, hi = -Infinity; for (const b of bahn) { if (b[k] < lo) lo = b[k]; if (b[k] > hi) hi = b[k]; } return { lo, hi, d: hi - lo }; };
  const sx = spanne('x'), sy = spanne('y'), sz = spanne('z');
  const achse = sz.d >= sx.d && sz.d >= sy.d ? 'z' : (sx.d >= sy.d ? 'x' : 'y');
  const sp = achse === 'z' ? sz : (achse === 'x' ? sx : sy);
  const mitte = (sp.hi + sp.lo) / 2;
  const richtung = Math.abs(sp.hi - mitte) >= Math.abs(sp.lo - mitte) ? 1 : -1;
  /* ⚠ DRITTE UND LETZTE FASSUNG VON »FEUERPOSE«. Die beiden vorigen waren beide messbar und beide
     falsch:
       Tempo-Maximum      0,053 s — mitten im Hochreissen. Georgs Befund: der Schuss faellt,
                          waehrend der Arm noch faehrt.
       groesste Ausladung 0,537 s von 0,708, also 76 % des Clips. Eine halbe Sekunde Verzoegerung
                          ist kein Abschuss, das ist das Nachfassen am Ende. Die Auslage steigt in
                          diesem Clip fast monoton, es gibt also keinen fruehen Umkehrpunkt.
     Gesucht ist der Augenblick, in dem die Waffe ANGEKOMMEN ist — das Ende des schnellen
     Vorschnellens. Also: ab dem Tempo-Gipfel vorwaerts der erste Punkt, an dem das Tempo unter ein
     Viertel des Gipfels faellt. Danach bewegt sich der Arm nur noch, er schnellt nicht mehr.
     Merksatz: eine Bewegung ist da, wenn sie langsam wird — nicht wenn sie schnell ist, und nicht,
     wenn sie am weitesten weg ist. */
  let weit = -Infinity;
  for (const b of bahn) { const e = b[achse] * richtung; if (e > weit) weit = e; }

  /* Die Laufachse: die der sechs Knochenachsen, die im Clip dem Ziel am nächsten kommt. */
  let iLauf = 0, minGesamt = 1e9;
  for (let a = 0; a < 6; a++) {
    let m = 1e9;
    for (const b of bahn) if (b.w[a] < m) m = b.w[a];
    if (m < minGesamt) { minGesamt = m; iLauf = a; }
  }
  const laufName = ['x+', 'x-', 'y+', 'y-', 'z+', 'z-'][iLauf];
  let best = bahn[0], bestW = 1e9;
  for (const b of bahn) if (b.w[iLauf] < bestW) { bestW = b.w[iLauf]; best = b; }

  /* ⚠ UND HIER ENDET DIE MATHEMATIK — mit einem Ergebnis, das selbst eine Auskunft ist.
     In `Idle_Shoot` zeigt der Lauf **von Bild 0 an** exakt aufs Ziel (0,0°): die Figur hält die
     Waffe die ganze Zeit im Anschlag. Das Winkelminimum ist damit 0 s — mathematisch korrekt und
     als Abschusszeit unbrauchbar. In `Run_Shoot` dagegen greift es sauber (0,236 s bei 1,2°).
     Der Grund ist keine Messschwäche: **ein Clip enthält den Abzug nicht.** Ein Animator setzt
     keine Marke »hier fällt der Schuss«, es sei denn, er tut es ausdrücklich. Was der Clip zeigt,
     ist die Reihenfolge — Anschlag, Ausrichten, Rückstoß —, nicht den Auslöser.
     Also die zweite Frage, wenn die erste entartet: **wo ist der Rückstoß?** Er ist der einzige
     Teil der Bewegung, den nur ein Schuss erklärt: ein plötzliches Zurück ENTGEGEN der Laufachse.
     Gesucht wird die stärkste negative Änderung der Ausladung — ihr Beginn ist der Abgang.
     Merksatz: wenn die saubere Größe entartet, misst man die Folge des Ereignisses, nicht es selbst. */
  const gehalten = bahn[0].w[iLauf] <= 2.0;
  let rueck = null;
  if (gehalten) {
    const proj = bahn.map((b) => ({ t: b.t, e: (b.x * (iLauf === 0 ? 1 : iLauf === 1 ? -1 : 0)) + (b.y * (iLauf === 2 ? 1 : iLauf === 3 ? -1 : 0)) + (b.z * (iLauf === 4 ? 1 : iLauf === 5 ? -1 : 0)) }));
    let steil = 0, iSteil = -1;
    for (let i = 1; i < proj.length; i++) { const d = proj[i].e - proj[i - 1].e; if (d < steil) { steil = d; iSteil = i; } }
    if (iSteil > 0) {
      /* Der BEGINN des Rückstoßes, nicht sein Tiefpunkt: von der steilsten Stelle rückwärts, bis
         die Bewegung nicht mehr rückwärts geht. */
      let i = iSteil;
      while (i > 1 && proj[i - 1].e - proj[i - 2].e < 0) i--;
      rueck = bahn[i - 1] || bahn[i];
    }
    if (rueck) best = rueck;
  }
  /* Der Tempo-Gipfel bleibt als Vergleichszahl: der Abstand zwischen ihm und der ausgestreckten
     Pose IST der Fehler, den Georg gesehen hat. */
  const mittel = bahn.reduce((a, b) => a + b.v, 0) / bahn.length;
  /* Die Spitze muss sich vom Rest ABHEBEN, sonst ist es keine Feuerpose, sondern Rauschen.
     Faktor 1,8 ist am Bild gewählt: darunter lagen bei ruhigen Clips zwei Maxima gleichauf. */
  const scharf = mittel > 0 && gipfel.v / mittel >= 1.8;
  return {
    name: clip.name, dauer: +dauer.toFixed(3), fireAt: +best.t.toFixed(3),
    anteil: +(best.t / dauer).toFixed(3), spitzeTempo: +gipfel.v.toFixed(2),
    mittelTempo: +mittel.toFixed(2), scharf, schritte,
    achse: achse + (richtung > 0 ? '+' : '-'), ausladung: +weit.toFixed(3),
    laufAchse: laufName, zielWinkel: +bestW.toFixed(1),
    gehalten, quelle: gehalten ? (rueck ? 'Rückstoß' : 'Winkel (entartet)') : 'Winkel',
    gipfelAt: +gipfel.t.toFixed(3), versatzMs: Math.round((best.t - gipfel.t) * 1000),
    kurve: bahn.filter((_, i) => i % Math.max(1, Math.floor(bahn.length / 24)) === 0).map((b) => +b.v.toFixed(1))
  };
}

/** Alle Schussclips einer Figur vermessen. Ergebnis ist eine Tabelle, kein Einzelwert — sie gehört
    ins Protokoll, damit die Zahl nachlesbar ist statt geglaubt. */
export function messeAlle({ THREE, root, clips, spitze, muster = /shoot|fire|attack/i }) {
  const tab = {};
  /* Clips kommen je nach Figur als ARRAY (FrizzleBob: `ownClips`) oder als Objekt. Beides zulassen
     ist billiger als den Aufrufer zu zwingen — und der Aufrufer hat schon einmal die falsche Ablage
     erwischt (`clipCache` trägt den GLB-Namen, nicht die Clips). */
  /* ⚠ EIN EINTRAG IST NICHT DER CLIP. `fb.ownClips` trägt **Beschreibungen**
     (`{ name, dur, clip, source, matched, total }`) — der eigentliche `AnimationClip` steckt in
     `.clip`. Meine erste Fassung prüfte `clip.duration` am Umschlag, fand undefined und übersprang
     alle 18 Clips: die Tabelle kam als **leeres Objekt** zurück, und C14 stand auf ○, ohne dass
     irgendwo ein Fehler aufgetaucht wäre.
     Merksatz: ein Eintrag mit einem Feld namens `clip` ist kein Clip. */
  const roh = Array.isArray(clips)
    ? clips.map((c) => [c.name, c])
    : Object.keys(clips || {}).map((n) => [n, clips[n]]);
  const liste = roh.map(([n, e]) => [n, e && e.isAnimationClip ? e : (e && e.clip) || null]);
  for (const [name, clip] of liste) {
    if (!muster.test(name) || !clip || !clip.duration) continue;   // Umschlag schon aufgemacht (siehe oben)
    const m = messeFeuerzeit({ THREE, root, clip, spitze });
    if (m) tab[name] = m;
  }
  return tab;
}

export function zeile(tab) {
  const k = Object.keys(tab || {});
  if (!k.length) return '[clipmarks] nichts gemessen (kein Schussclip oder keine Waffenspitze)';
  return '[clipmarks] ' + k.map((n) => tab[n].fireAt == null
    ? n + ' ⚠ ' + (tab[n].grund || 'nicht messbar')
    : n + ' fireAt ' + tab[n].fireAt + ' s von ' + tab[n].dauer
      + ' (' + Math.round(tab[n].anteil * 100) + ' % · aus ' + tab[n].quelle + ' · Lauf ' + tab[n].laufAchse
      + ' bis auf ' + tab[n].zielWinkel + '° · Tempo-Gipfel ' + tab[n].gipfelAt + ' s)'
      + (tab[n].scharf ? '' : ' ⚠ unscharf')).join(' · ');
}

export default { messeFeuerzeit, messeAlle, zeile };
