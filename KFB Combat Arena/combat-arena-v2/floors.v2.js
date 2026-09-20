/**
 * combat-arena-v2/floors.v2.js — der BODENKATALOG als Werkzeug (MASTERPLAN §5, Slice S0).
 *
 * Das Prüfwerkzeug kommt VOR dem Gegenstand. Diese Datei ist der Katalog C1–C12 plus die
 * Messung, die jeder Boden selbst mitbringt. Sie zeichnet nichts und spielt nichts.
 *
 * Vier Zustände, und der dritte ist der wichtige:
 *   ✓ bestanden   gemessen, Zahl steht daneben
 *   ✗ gefallen    gemessen, Zahl steht daneben
 *   ○ wartet      das Modul, das diesen Boden erfüllt, ist noch nicht gebaut (Slice steht dabei)
 *   ~ teilweise   gemessen, aber nur über einen Teil des Gegenstands (Umfang steht dabei)
 *
 * »wartet« ist kein Freibrief: er nennt den Slice, in dem der Boden fällig wird. Ein Boden, der
 * ohne Modul »grün« meldet, wäre die stille Fehlerklasse, gegen die dieser Katalog gebaut ist.
 *
 * ENVIRONMENT.md: der Kritiker kennt den Bauauftrag NICHT und liest nur die Seite — deshalb steht
 * jeder Boden mit Text, Register, Zahl und Zustand im Overlay, nicht nur in der Konsole.
 */

export const REGISTER = { block: 'BLOCK', warn: 'warn', info: 'info' };
export const ZUSTAND = { pass: '✓', fail: '✗', wait: '○', part: '~' };

const pass = (v) => ({ z: 'pass', v });
const fail = (v) => ({ z: 'fail', v });
const wait = (v) => ({ z: 'wait', v });
const part = (v) => ({ z: 'part', v });

/**
 * Jeder Boden: id · text (verbatim aus MASTERPLAN §5) · register · slice (wann fällig) ·
 * quelle (wer ihn erfüllt) · mess(p) → { z, v }.  `p` ist die Sonde des Wirts.
 */
export const FLOORS = [
  {
    id: 'S0', text: 'Referenzkugel Kanon-Gelb #f2c93c liest im Bildpuffer mit ΔE ≤ 8, kein Kanal ≥ 250',
    register: REGISTER.block, slice: 'S0', quelle: 'studio-v12/light.v1.js (CONTRACT B1)',
    mess: (p) => !p.cal ? wait('nicht gemessen — Knopf »Kalibrieren«')
      : (p.cal.pass ? pass('ΔE ' + p.cal.dE + ' · exposure ' + p.cal.exposure.toFixed(2) + ' · ' + p.cal.measured.join(','))
        : fail('ΔE ' + p.cal.dE + (p.cal.clip ? ' · CLIP' : '') + ' · ' + p.cal.measured.join(',')))
  },
  {
    id: 'C1', text: 'FB-Position nach 60 s zufälliger WASD-Eingabe (Seed) immer inside — 0 Kantenüberschreitungen',
    register: REGISTER.block, slice: 'S1', quelle: 'M1 card-field + M2 player-controller',
    mess: (p) => !p.walk ? wait('wartet auf M2 (S1) — field.contain() steht, Körper fehlt')
      /* Der Messwert TRÄGT SEINE GEOMETRIE. Ohne Feld und Radius in der Zeile konnte C1 grün für eine
         Fläche melden, die es nicht mehr gab (Kritiker 06.09.: angezeigt »0 Verstöße«, gemessen auf
         18 × 10,34 u, live war 9 × 5,17 u). Wer die Zahl liest, muss sehen, worauf sie gilt. */
      : (p.walk.verstoesse === 0 ? pass('0 Verstöße in ' + p.walk.sek + ' s · ' + p.walk.schritte + ' Schritte · ' + p.walk.feld + ' · r ' + p.walk.radius)
        : fail(p.walk.verstoesse + ' Verstöße in ' + p.walk.sek + ' s · ' + p.walk.feld + ' · r ' + p.walk.radius))
  },
  {
    id: 'C2', text: '3 Mobs gespawnt, alle ≥ 2,2 u von FB und untereinander — und zur LAUFZEIT kein Paar ineinander (Reserve ≥ 0)',
    register: REGISTER.block, slice: 'S2', quelle: 'M3 mob-brain',
    /* Die zweite Hälfte dieses Bodens kam vom Kritiker (06.09.): die Spawn-Regel galt nur beim
       Setzen, zur Laufzeit galt gar nichts. Steht FB in der Ecke, klemmt das Halteband alle Mobs auf
       denselben Keil des 2,4-u-Kreises — gemessene Paarabstände 0,11–0,26 u bei Radiensummen um
       0,65 u, also drei Monster als ein Klumpen. Ein Wert, den kein Boden fängt, wird nicht geprüft,
       auch wenn er sichtbar im Blatt steht. */
    mess: (p) => !p.spawn ? wait('wartet auf M3 (S2)')
      : p.spawn.gesetzt < p.spawn.gewuenscht ? fail(p.spawn.gesetzt + '/' + p.spawn.gewuenscht + ' gesetzt · ' + (p.spawn.grund || 'ohne Grund'))
        : p.spawn.min < 2.2 ? fail('Spawn: kleinster Abstand ' + p.spawn.min.toFixed(2) + ' u — Regel 2,2 u')
          /* KEIN URTEIL ÜBER LEICHEN. Nach einem gewonnenen Kampf lebt niemand mehr — dann gibt es
             auch keinen Laufzeit-Abstand zu prüfen. Vorher stand hier »3 Mobs · Reserve 0,00 u« aus
             den Positionen der Toten (Kritiker 06.09.): ein BLOCK-Boden, der Geisterdaten bestand. */
          : p.spawn.jetzt === 0 ? part('Spawn ' + p.spawn.min.toFixed(2) + ' u bestanden · kein Gegner mehr am Leben — kein Laufzeit-Abstand prüfbar')
            : (p.spawn.reserve != null && p.spawn.reserve < 0)
              ? fail('Laufzeit: zwei Körper stecken ' + Math.abs(p.spawn.reserve).toFixed(2) + ' u ineinander (Paarabstand ' + p.spawn.paarMin.toFixed(2) + ' u)')
              : pass(p.spawn.jetzt + ' Mobs am Leben · Spawn ' + p.spawn.min.toFixed(2) + ' u · Laufzeit-Reserve '
                  + (p.spawn.reserve != null ? p.spawn.reserve.toFixed(2) + ' u' : '–') + ' · Halteweite ' + (p.spawn.halteMin != null ? p.spawn.halteMin.toFixed(2) + ' u' : '–'))
  },
  {
    id: 'C3', text: 'Kill → genau 1 Würfel, genau 1 Pop (Zähler im Log = Kills)',
    register: REGISTER.block, slice: 'S3', quelle: 'M5 gunfight + M6 dice-pickups',
    mess: (p) => !p.kill ? wait('wartet auf M5 + M6 (S3)')
      : p.kill.kills === 0 ? part('noch kein Kill gemessen — Knopf »Schießprobe« (' + p.kill.schuesse + ' Schüsse, ' + p.kill.treffer + ' Treffer)')
        : (p.kill.kills === p.kill.wuerfel && p.kill.kills === p.kill.pops
            ? pass(p.kill.kills + ' Kills = ' + p.kill.wuerfel + ' Würfel = ' + p.kill.pops + ' Pops · ' + p.kill.gesammelt + ' aufgesammelt')
            : fail(p.kill.kills + ' Kills · ' + p.kill.wuerfel + ' Würfel · ' + p.kill.pops + ' Pops'))
  },
  {
    id: 'C4', text: 'FX-Pool nach aufraeumen + 100 ms auf Ausgangswert (EINBAU Schritt 6)',
    register: REGISTER.block, slice: 'S0 (Wirt) / S3 (Gebrauch)', quelle: 'host.v2 fx',
    mess: (p) => !p.fx ? wait('FX nicht gebootet — Knopf »FX booten«')
      : p.fx.grund ? fail(p.fx.grund)
        : (p.fx.nach === p.fx.vor ? pass('emittiert ' + p.fx.emittiert + ' · lebend vor ' + p.fx.vor + ' → nach ' + p.fx.nach + ' (+' + p.fx.wartems + ' ms)')
          : fail('lebend vor ' + p.fx.vor + ' → nach ' + p.fx.nach))
  },
  {
    id: 'C5', text: 'Save → Import → gleicher Level/Score/Kills/Karten-IDs (Roundtrip-Diff = 0)',
    register: REGISTER.block, slice: 'S4', quelle: 'host.v2 save + M7 run-flow',
    mess: (p) => !p.save ? wait('nicht gemessen — Knopf »Selbsttest«')
      : p.save.diff.length ? fail(p.save.diff.length + ' Abweichung(en): ' + p.save.diff.slice(0, 2).join(' | '))
        : (p.save.fehlend.length ? part('Diff 0 über ' + p.save.felder + ' Felder · leer bis M7: ' + p.save.fehlend.join(', '))
          : pass('Diff 0 über ' + p.save.felder + ' Felder'))
  },
  {
    id: 'C6', text: 'Konsole ohne error nach Boot + 10 s Spiel',
    register: REGISTER.block, slice: 'S0', quelle: 'Wirt-Zähler (console.error + onerror)',
    mess: (p) => p.fehler.n > 0 ? fail(p.fehler.n + ' error · zuletzt: ' + String(p.fehler.letzter).slice(0, 90))
      : (p.uptime < 10 ? part('0 error · ' + p.uptime.toFixed(0) + ' s von 10 gelaufen') : pass('0 error · ' + p.uptime.toFixed(0) + ' s gelaufen'))
  },
  {
    id: 'C7', text: 'Draw-Calls ≤ 110 im Kampf (renderer.info), Frame ≤ 8 ms Median',
    register: REGISTER.warn, slice: 'S0 (Messung) / S3 (Kampf)', quelle: 'host.v2 messung',
    mess: (p) => (p.m.frameMs == null || !p.m.calls) ? wait('Takt steht: rAF gedrosselt (ENVIRONMENT CA-4)')
      : (p.m.calls <= 110 && p.m.frameMs <= 8 ? pass(p.m.calls + ' calls · ' + p.m.frameMs + ' ms · ' + p.m.tris + ' Dreiecke')
        : fail(p.m.calls + ' calls · ' + p.m.frameMs + ' ms (Budget 110 / 8)'))
  },
  {
    id: 'C8', text: 'Figur im Bild lesbar: FB-Höhe ≥ 10 % der Bildhöhe bei Kamera-Standard (Kartenanteil steht daneben, als Zahl ohne Schwelle)',
    register: REGISTER.warn, slice: 'S1', quelle: 'host.v2 figurImBild + M2',
    /* GESCHICHTE DIESES BODENS — er wurde einmal umgeschrieben, und zwar begründet.
       Fassung 1 hieß »≥ 85 % der Karte im Bild«. Sie entstand, als das Spielfeld DIE KARTE war
       (9 × 5,2 u). Am 06.09. hat Georg am Bild entschieden: Fläche 18 u, Motiv EINE Karte, FB 1,2 u —
       ausdrücklich deshalb, weil man »durch die großflächigeren Motive die Figur/FB besser erkennt«.
       Damit ist die Flächenquote das falsche Maß: sie fällt zwangsläufig, je größer die Bühne wird,
       und sie misst nie das, was die Entscheidung trägt. Fassung 2 misst deshalb die Figur selbst:
       ihre Höhe in Prozent der Bildhöhe. Der Kartenanteil bleibt in der Zeile, ohne Schwelle — als
       Zahl zum Mitlesen, nicht als Tor.
       Schwelle 10 %: gemessen an der Ansicht, die Georg am 06.09. FREIGEGEBEN hat (Fläche 18 u,
       1 Karte, FB 1,2 u, Schulterkamera 8,4 u) — dort ist FB **11,9 % der Bildhöhe, 140 px bei
       1182 px Bildpuffer**. Die Schwelle liegt bewusst DARUNTER, mit Luft: ein Boden, der genau auf
       dem freigegebenen Bild sitzt, fällt beim ersten Rundungsfehler. Er fängt den Rückschritt (FB
       wird zum Fleck), nicht den Normalfall. Erste Fassung stand auf 12 % und meldete deshalb die
       freigegebene Ansicht als gefallen — eine Schwelle, die den eigenen Auftrag nicht besteht. */
    mess: (p) => (p.m.frameMs == null || !p.m.calls) ? wait('Takt steht: Vorschaufenster verdeckt, rAF gedrosselt (ENVIRONMENT CA-4) — Kamera auf Startpose, keine Aussage')
      : !p.figur ? wait('wartet auf FB im Wirt (M2)')
        : (p.figur.anteil >= 0.10
            ? pass('FB ' + (p.figur.anteil * 100).toFixed(0) + ' % der Bildhöhe (' + p.figur.px + ' px) · Karte ' + (p.bild ? (p.bild.anteil * 100).toFixed(0) + ' %' : '–') + ' im Bild')
            : fail('FB nur ' + (p.figur.anteil * 100).toFixed(0) + ' % der Bildhöhe (' + p.figur.px + ' px) — Kamera näher oder FB größer'))
  },
  {
    id: 'C9', text: 'Gesicht frei: kein FX-Sprite über Augen/Maul von FB (Schutzzone, EINBAU Gate 12)',
    register: REGISTER.warn, slice: 'S3', quelle: 'M5 + frizzlebob.v1.js Schutzzone',
    /* Gemessen wird der ABSTAND zur Zone, nicht ob »es gut aussieht«: jede Emission in FB-Nähe
       liefert `Abstand − Zonenradius`. Negativ heißt: sie wäre im Gesicht entstanden — M5 schiebt
       sie dann nach außen (der Treffer bleibt sichtbar, die Augen bleiben frei) und der Wert zeigt,
       wie oft es knapp war. Ohne Emission gibt es keine Aussage, und dann sagt der Boden das. */
    mess: (p) => !p.kill ? wait('wartet auf FB im Wirt (S1) und Schüsse (S3)')
      : p.kill.gesichtMin == null ? wait('noch keine Emission in FB-Nähe — nichts zu prüfen')
        : (p.kill.gesichtMin >= 0
            ? pass('kleinster Abstand zur Zone +' + p.kill.gesichtMin.toFixed(2) + ' u (Zone ' + p.kill.zone.toFixed(2) + ' u)')
            : part('Zone ' + p.kill.zone.toFixed(2) + ' u · ' + Math.abs(p.kill.gesichtMin).toFixed(2) + ' u tief getroffen → Sprite nach außen geschoben, Augen frei'))
  },
  {
    id: 'C10', text: 'Math.random in combat-arena-v2/ = 0 (Linter beim Boot)',
    register: REGISTER.warn, slice: 'S0', quelle: 'host.v2 lint()',
    mess: (p) => !p.lint ? wait('Linter nicht gelaufen')
      : (p.lint.treffer === 0 ? pass('0 · ' + p.lint.details.join(' · ')) : fail(p.lint.treffer + ' · ' + p.lint.details.join(' · ')))
  },
  {
    id: 'C11', text: 'Blindvergleich: Monster und FB »dieselbe Welt« ≥ 4 (verankertes Raster aus CONTRACT §3)',
    register: REGISTER.info, slice: 'S5', quelle: 'blinder Leser, frische Sitzung — nie automatisch',
    mess: () => wait('Urteil eines Menschen, kein Zähler (MASTERPLAN §7.2)')
  },
  {
    id: 'C12', text: 'Rutschfaktor 0,9–1,1 (Fuß-Tempo im Clip / Bodentempo) für FB Walk·Run·Run_Gun und alle Mobs mit Walk',
    register: REGISTER.block, slice: 'S1½', quelle: 'M9 locomotion-tune + kfb-stride-measure.js',
    /* Der Boden prüft DREI Dinge, und das dritte ist das wichtige:
         (1) ist der Körper überhaupt vermessen (sonst gibt es keinen Faktor, nur eine Vermutung),
         (2) liegt der Faktor im Band 0,9–1,1,
         (3) läuft die Clip-Rate in ihre Klemme — dann rutscht es sichtbar, obwohl gemessen wurde.
       Ein stehender Körper hat KEINEN Faktor (Division durch Tempo 0): er wird gezählt, nicht
       gerechnet. Die erste Fassung rechnete ihn mit und meldete 2213,40 — gemessen 06.09. */
    mess: (p) => !p.loco ? wait(p.locoGrund || 'wartet auf M9 (S1½) — Clips noch nicht vermessen')
      : p.loco.ohne.length ? fail(p.loco.ohne.length + ' Körper ohne Schrittmaß: ' + p.loco.ohne.slice(0, 3).join(', '))
        : p.loco.geklemmt.length ? fail('Rate geklemmt bei ' + p.loco.geklemmt.join(', ') + ' — Füße rutschen sichtbar')
          : p.loco.gerechnet === 0 ? part(p.loco.kalibriert + ' Körper vermessen, alle stehen — kein Faktor rechenbar (WASD drücken oder Lauftest)')
            : (p.loco.min >= 0.9 && p.loco.max <= 1.1
                ? pass(p.loco.gerechnet + '/' + p.loco.n + ' Körper in Bewegung · Faktor ' + p.loco.min.toFixed(2) + '–' + p.loco.max.toFixed(2))
                : fail(p.loco.gerechnet + ' Körper · Faktor ' + p.loco.min.toFixed(2) + '–' + p.loco.max.toFixed(2) + ' (Band 0,9–1,1)'))
  }
];

/** Alle Böden messen. Gibt Zeilen für das Overlay zurück — eine Zeile je Boden, immer alle. */
export function bewerten(p) {
  return FLOORS.map((f) => {
    let r;
    try { r = f.mess(p) || wait('keine Messung'); }
    catch (e) { r = fail('Messfehler: ' + ((e && e.message) || e)); }
    return { id: f.id, text: f.text, register: f.register, slice: f.slice, quelle: f.quelle, zustand: r.z, glyph: ZUSTAND[r.z], wert: r.v };
  });
}

/** Eine Zeile für Bootzeile und Konsole — der Kritiker liest sie auch ohne Tabelle. */
export function zeile(rows) {
  const z = (k) => rows.filter((r) => r.zustand === k).length;
  const blockOffen = rows.filter((r) => r.register === REGISTER.block && r.zustand === 'fail').length;
  return 'Böden ' + rows.length + ' · ✓ ' + z('pass') + ' · ~ ' + z('part') + ' · ○ ' + z('wait') + ' · ✗ ' + z('fail')
    + ' · BLOCK gefallen: ' + blockOffen;
}

/** Tor des Slice: ein BLOCK-Boden, der GEFALLEN ist, hält an. »wartet« hält nicht an, es benennt.
    `slice` wird ÜBERGEBEN, nicht getippt: der Name stand als Literal »S0-Tor« drin und bewertete
    längst S1 — wer nur die Seite liest, hielt den Stand für S0 (Kritiker 06.09.). */
export function tor(rows, slice) {
  const zeilen = [], offen = [];
  let ok = 0, von = 0, nm = 0;
  for (const r of rows) {
    if (r.register === REGISTER.info) { zeilen.push('· ' + r.id + ' ' + r.wert); continue; }
    if (r.zustand === 'wait') { nm++; zeilen.push('○ ' + r.id + ' ' + r.wert + ' [' + r.slice + ']'); offen.push(r.id + '→' + r.slice); continue; }
    von++;
    if (r.zustand === 'fail') zeilen.push('✗ ' + r.id + ' ' + r.wert);
    else { ok++; zeilen.push((r.zustand === 'part' ? '~ ' : '✓ ') + r.id + ' ' + r.wert); }
  }
  return { ok: ok === von, bestanden: ok, von, nichtMessbar: nm, offen, zeilen,
    text: (slice || 'Tor') + '-Tor: ' + ok + '/' + von + ' gemessen bestanden, ' + nm + ' warten auf ihr Modul (' + offen.join(' ') + ')' };
}
