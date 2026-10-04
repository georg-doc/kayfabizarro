// ============================================================================
// kit-massstab.js — EIN Maßstab pro Kit, Ausnahmen mit Grund
// ----------------------------------------------------------------------------
// Anlass (Georg, 2.9., nach zwei Messrunden über 1326 Modelle): „die Felsen sind relativ zu den
// Bäumen zu klein" — und davor, 29.8.: „die Fässer sind viel zu groß". Beide Beschwerden hatten
// dieselbe Ursache, und sie war nicht das Modell: **jedes Prop bekam seine Welthöhe einzeln von
// Hand** (`h:` je Eintrag). Gemessen gegen die Proportionen, die der Kit-Designer gebaut hat:
//   · GLB_pirate: das Fass ist beim Designer 29 % der Palme, bei uns 16 %      → −44 %
//   · GLB_hexagon_kit: die Burg ist beim Designer 78 % des Turms, bei uns 110 % → +41 %
//   · kenney_nature-kit: unsere Faktoren zwischen 0,044 (Baum) und 0,38 (Pilz) → Spanne 9×
// Jede Korrektur an einem Modell verschob heimlich das Verhältnis zu allen Nachbarn. Und die
// Rule of Three (Georg, 2.9.) braucht stimmige Verhältnisse INNERHALB einer Gruppe — mit 23
// einzeln gewählten Zahlen kann sie nicht funktionieren.
//
// **Die Regel jetzt:** ein Kit hat EINE Einheit, und die wird EINMAL in Weltmaß übersetzt. Ein
// Modell bekommt nur dann eine eigene Höhe, wenn wir BEWUSST abweichen — und dann steht der Grund
// daneben (`grund:`). Der Pilz in Palmenhöhe ist so eine Ausnahme; eine Blume, die man aus der
// Luft sehen soll, ist keine — dafür gibt es den Sichtbarkeitsboden (unten).
//
// **Welche Kits sind in Metern?** Aus den Messungen: KayKit-Bäume 2,9–10,8 · Quaternius-Bäume
// 2,1–7,4 · Piraten-Palmen 4,2 · Kenney-Nature-Bäume 0,9–2,1 (kleine, stilisierte Bäume, aber
// Blume 0,24 und Pilz 0,25 — das sind Meter) · KFB-Bäume 0,8–3,6. Diese Kits teilen EINEN Faktor,
// und damit ist ein KayKit-Felsen von 4,6 m neben einer Kenney-Blume von 24 cm genau das, was er
// sein soll: ein Brocken neben einer Blume. **Frei kombinierbar heißt: eine Einheit.**
// Zwei Kits sind NICHT in Metern: das Hexagon-Kit (Kachelmaß, Turm = 1,02) und das Graveyard-Kit
// (stilisiert, Kreuz 1,05). Sie behalten ihre eigenen Faktoren, geeicht an dem, was heute steht.
//
// **Eichung von METER:** an `tree_default` (Kenney, 1,708 roh → 0,075 Welt), dem häufigsten Prop
// der Welt — damit der Baum, den man am meisten sieht, sich um keinen Millimeter bewegt. Was sich
// dadurch ändert, steht im Tor (`tor()`), nicht in einer Behauptung hier.
// ============================================================================

// ⚠ **2.9., abends — die Meter-Annahme war falsch, und Georg hat es im Flug gesehen:** „Riesensteine
// mitten im Bild … Kenney-Felsformationen so groß wie Pilze … Felsen so groß wie ein Turmaufsatz."
// Ich hatte alle Natur-Kits auf EINEN Faktor gelegt („Meter sind Meter"). Die eigenen Messungen
// hatten das Gegenteil gezeigt und ich habe sie überlesen: Kenney-Bäume 1,33 · KayKit 5,54 ·
// Quaternius 4,61 · Piraten-Palmen 4,2. Kein Kit meint mit „1 Einheit" dasselbe. Ergebnis: ein
// KayKit-Fels (3,6) stand doppelt so hoch wie ein Kenney-Baum (1,7), ein Kenney-Stein (0,2) wurde
// zum Krümel. Die Messung war richtig, die Schlussfolgerung falsch — schlechter als vorher.
//
// **Die Regel jetzt: jedes Kit wird an seinem eigenen BAUM-MEDIAN geeicht.** Ein Baum ist ein Baum
// — in jedem Kit gleich hoch (BAUM_WELT). Alles andere im Kit folgt dem Verhältnis, das der
// Designer gebaut hat: KayKit-Felsen sind dann 40–65 % eines Baums, wie in jedem Kit. Zahlen aus
// den zwei Messrunden (uploads/kfb-asset-audit-index*.json), keine neue Messung nötig.
// Kits ohne Bäume (Hexagon, Graveyard, Pirate) behalten den Anker, der heute steht.

export const BAUM_WELT = 1.33 * (0.075 / 1.708);   // = 0,0584 · Kenney-Baum-Median bleibt, wo er war
const anBaum = (median) => BAUM_WELT / median;

export const KIT = {
  'kenney_nature-kit':                   { f: anBaum(1.33), einheit: 'Baum-Median 1,33' },
  'KayKit_Forest_Nature_Pack_1.0_FREE':  { f: anBaum(5.54), einheit: 'Baum-Median 5,54' },
  'SciFI_Ultimate Space Kit_Quaternius': { f: anBaum(4.61), einheit: 'Baum-Median 4,61' },
  'KFB':                                 { f: anBaum(2.69), einheit: 'Baum-Median 2,69' },
  'kenney_fantasy-town-kit_2.0':         { f: anBaum(2.75), einheit: 'Baum-Median 2,75' },
  'kenney_holiday-kit':                  { f: anBaum(1.97), einheit: 'Baum-Median 1,97' },
  // Ohne Baum-Median — geeicht an dem, was heute steht und von Georg abgenommen ist:
  // Palmen: kein Baum-Median im Kit, also am Baum der WELT geeicht — 1,6 Baumhöhen. Georg, 2.9.:
  // „die Palmen sind auch noch zu groß" — sie standen bei 0,17, das 2,3-fache eines Baums.
  'GLB_pirate':      { f: (1.6 * BAUM_WELT) / 4.213, einheit: 'Palme = 1,6 Bäume (palm-detailed-straight 4,21)' },
  'GLB_hexagon_kit': { f: 0.20 / 1.020, einheit: 'Kachel (building-tower 1,02 → 0,20)' },
  'GLB_graveyard':   { f: 0.07 / 1.045, einheit: 'stilisiert (cross-wood 1,05 → 0,07)' },
};
export const METER = KIT['kenney_nature-kit'].f;   // Altname, nur noch Kenney

/** Der Sichtbarkeitsboden — die EINE Zahl, die früher in zwölf `h:`-Werten versteckt war.
 *  Blumen (0,24 m → 0,0105 u) und Pilze wären kit-treu aus Reiseflughöhe unsichtbar; deshalb
 *  standen sie bei 0,03. Statt jedes kleine Ding einzeln aufzublasen, gilt ein Boden: nichts
 *  wird kleiner gebaut als `mindestHoehe`. Das Tor zählt, wie viele Modelle angehoben wurden —
 *  und der Regler im Panel macht die Frage „ab wann sieht man es" zu einer, die man dreht. */
export const BODEN = { mindestHoehe: 0.024 };

/** ⚠ **Die Fels-Ausnahme — deklariert, mit Grund, und mit der Gegenrechnung daneben.**
 *  Georg, 3.9., am Bild: „diese Kenney-Terrain-Blöcke sind irgendwie viel zu klein". Gemessen an
 *  der laufenden Welt, bevor irgendetwas gedreht wurde: 308 Felsstücke, KEINES im Wasser, Höhen
 *  0,10–0,81 Baumhöhen, Median **0,60**. Das ist kit-treu und war seit v10 ausdrücklich so
 *  gewollt („ein Fels ist 40–65 % eines Baums, wie in jedem Kit") — die Zahl ist also nicht
 *  falsch, sie ist nur nicht mehr richtig.
 *
 *  **Was sich geändert hat, ist die Nachbarschaft, nicht der Fels.** In v10 stand er neben
 *  gestreuten Kit-Bäumen mit derselben flachen Lambert-Fläche. Seit v12 steht daneben gebaute
 *  Vegetation — mit AO am Fuß, Saum an der Kante, Wind in der Krone. Ein Objekt ohne diese drei
 *  Dinge braucht MASSE, um sich zu behaupten; sonst liest es als Schotter zwischen den Pflanzen.
 *  Dieselbe Beobachtung wie bei den grau-braunen Bauten am selben Tag: *eine Größe ist so wenig
 *  eine Eigenschaft des Objekts wie eine Palettenfarbe — beide gelten gegen die Nachbarn.*
 *
 *  Die Form der Ausnahme ist die, die sich schon bewährt hat (`familienBoden` in flora.js): EIN
 *  Faktor für die ganze Familie, **Verhältnisse bleiben**. 1,75 hebt den Median auf 1,05 Bäume;
 *  der Kiesel bleibt ein Kiesel (0,10 → 0,18), der Brocken wird ein Brocken (0,81 → 1,42).
 *  Und ein Deckel, weil das Gegenbeispiel bekannt ist (Stumpf über Baumhöhe, 2.9.): kein Fels
 *  wird höher als `maxBaeume`. Beißt der Deckel, steht es im Tor.
 *  `?fels=1` stellt den kit-treuen Zustand wieder her — der Vergleich muss möglich bleiben. */
export const FELS = { faktor: 1.75, maxBaeume: 2.2 };
export function setFelsFaktor(f) { FELS.faktor = Math.max(1, Math.min(4, +f || 1)); }

/**
 * Welthöhe eines Props. Rückgabe nennt den WEG, nicht nur die Zahl — damit ein Tor sagen kann,
 * welcher Anteil der Welt kit-treu steht und welcher nicht.
 *   'explizit'  — def.h gesetzt (Ausnahme mit Grund, oder MARKEN: Zonenplanung braucht h vorher)
 *   'kit'       — Faktor des Kits × Rohmaß
 *   'kit+boden' — kit, aber auf den Sichtbarkeitsboden angehoben
 *   'ohne-kit'  — Pack unbekannt: METER als Annahme, und das ist eine Warnung, keine Antwort
 */
export function weltHoehe(def, pack, rohBezug, opt) {
  if (def && def.h != null) return { h: def.h, weg: 'explizit', grund: def.grund || null };
  const kit = KIT[pack];
  const f = kit ? kit.f : METER;
  let h = f * Math.max(1e-4, rohBezug);
  let weg = kit ? 'kit' : 'ohne-kit';
  // `ohneBoden`: für Stücke, die unter dem Boden liegen SOLLEN (Detail-Kiesel, „nur im Nahfeld").
  // ⚠ Ohne diese Ausnahme wurde ein 6-cm-Flachstein auf 0,024 u HÖHE gehoben — Faktor 8 — und mit
  // ihm seine 50 cm Breite: 0,18 u, breiter als der Fokusfels (Abnahme 2.9.). Der Boden ist ein
  // Sichtbarkeits-Versprechen für Dinge, die man sehen soll; ein Kiesel ist keines.
  if (!(opt && opt.ohneBoden) && h < BODEN.mindestHoehe) { h = BODEN.mindestHoehe; weg = kit ? 'kit+boden' : 'ohne-kit'; }
  // Die Fels-Ausnahme (siehe FELS oben). Sie gilt für die ART, nicht für ein Modell — deshalb
  // hier und nicht in zwölf Tabellenzeilen, und deshalb trägt der Weg sie im Namen.
  const art = (opt && opt.art) || (def && def.kind) || null;
  if (art === 'rock' && FELS.faktor > 1.001) {
    const deckel = FELS.maxBaeume * BAUM_WELT;
    const roh = h * FELS.faktor;
    h = Math.min(deckel, roh);
    weg = 'kit×' + FELS.faktor.toFixed(2) + ' (rock family' + (roh > deckel ? ', capped' : '') + ')';
  }
  return { h, weg, grund: null, faktor: f };
}

/** Das Tor. Bekommt das Protokoll der geladenen Modelle (name → {zielHoehe, weg, pack, rohHoehe,
 *  vorher}) und sagt, was kit-treu steht, was Ausnahme ist, was angehoben wurde, was ohne Kit lief
 *  — und was sich gegenüber der Handtabelle bewegt hat. */
export function tor(protokoll) {
  const z = { kit: 0, boden: 0, explizit: 0, ohneKit: 0, gesamt: 0 };
  const ohne = new Set(), bewegt = [], ausnahmen = [];
  for (const [name, p] of protokoll) {
    if (!p || p.stand !== 'geladen') continue;
    z.gesamt++;
    if (p.weg === 'kit') z.kit++;
    else if (p.weg === 'kit+boden') z.boden++;
    else if (p.weg === 'explizit') { z.explizit++; if (p.grund) ausnahmen.push(name + ' (' + p.grund + ')'); }
    else if (p.weg === 'ohne-kit') { z.ohneKit++; ohne.add(p.pack || '?'); }
    if (p.vorher != null && Math.abs(p.vorher - p.zielHoehe) / p.vorher > 0.05) {
      bewegt.push(name + ' ' + p.vorher.toFixed(3) + '→' + p.zielHoehe.toFixed(3));
    }
  }
  const ok = z.gesamt > 0 && z.ohneKit === 0;
  return {
    ok, ...z, ohnePacks: Array.from(ohne), bewegt, ausnahmen,
    text: !z.gesamt ? '— nothing loaded yet'
      : (ok ? '✓' : '⚠') + ' ' + z.kit + ' kit-true · ' + z.boden + ' lifted to floor ' + BODEN.mindestHoehe.toFixed(3)
        + ' · ' + z.explizit + ' explicit' + (ausnahmen.length ? ' (' + ausnahmen.length + ' with reason)' : '')
        + (z.ohneKit ? ' · ⚠ ' + z.ohneKit + ' WITHOUT kit factor: ' + Array.from(ohne).join(', ') : '')
        + (bewegt.length ? '  ·  moved vs. hand table: ' + bewegt.join(', ') : '  ·  nothing moved >5 %'),
  };
}
