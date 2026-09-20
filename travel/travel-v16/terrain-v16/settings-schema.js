// ============================================================================
// settings-schema.js — KFB Travel · Slice S44b (V9-C, Teil 2) · das Panel als DATEN
// ----------------------------------------------------------------------------
// Vorher standen ~290 Zeilen Regler-Definitionen mitten im Runner. Sie sind kein
// Orchestrierungscode und keine Physik — sie sind eine LISTE. Genau deshalb hat
// die Intermission gemessen, dass ein TravelManager allein den Runner nicht klein
// macht: über die Hälfte war Panel und Frame-Schleife, nicht Verdrahtung.
//
// **Zwei Sorten Abhängigkeit, zwei Wege:**
//  · **Module und Funktionen** (`ctx.terrain`, `ctx.academy`, `ctx.note`, `ctx.requestMode` …) kommen als
//    Referenz — sie ändern sich nicht.
//  · **Veränderliche Runner-Zustände** (`danceMode`, `bpm`, `groundCalm` …) kommen über EIN
//    Objekt `S`, dessen Eigenschaften im Runner an die echten Variablen gebunden sind
//    (`Object.defineProperty` mit get/set). Der Runner behält damit seine Locals — der
//    Frame-Pfad wird NICHT angefasst —, und das Schema liest/schreibt sie trotzdem ctx.live.
//    Der Umweg ist Absicht: 33 Variablen in ein Zustandsobjekt umzuschreiben hätte den
//    Frame-Pfad berührt, und der ist gemessen und läuft.
//
//   settings = createSettingsOverlay({ …, sections: buildSections(ctx) });
//
// **Warum `ctx.x` und keine Destrukturierung:** die läse alles SOFORT, und mehrere Bezüge werden
// im Runner erst NACH dem Panel deklariert (`resize`, `mountPet`, die Eingabe-Schicht). Eager
// gelesen ergibt das einen TDZ-Fehler beim Start — genau so gemessen, bevor es hier stand.
// ============================================================================

import { PALETTE_OPTIONS, PALETTE_NOTES } from './world-palettes.js';

export function buildSections(ctx) {
  const S = ctx.S;
  const cp = ctx.colorP;   // S58 · die fünf Farb-Regler leben als EIN Objekt im Runner
  const setCol = (k, v) => { cp[k] = v; ctx.terrain.setColorParams({ [k]: v }); };
  return [
      { id: 'cards', title: 'Karten', hint: 'Der Story-Modus färbt Welt, Himmel und Würfel. Die Ink-Outline gilt vorerst für die Pet-Karte — Sky-Karten bekommen eigene Regler, sobald sie eigene Stile tragen (Torn, Bend).',
        controls: [
          { kind: 'select', label: 'Story-Modus', options: ctx.MODES.map((m) => ({ v: m.key, l: m.n + ' · ' + m.name })),
            get: () => S.story, set: (v) => { S.story = v; ctx.applyWorld(true); } },
          { kind: 'info', label: 'Palette', get: () => S.storyMode.name + '  ·  Ink #' + new ctx.THREE.Color(S.storyMode.ink).getHexString() },
          { kind: 'slider', label: 'Ink-Outline der Pet-Karte', min: 0, max: 18, step: 0.5, get: () => ctx.rig.ink.width,
            set: (v) => ctx.rig.setInk({ width: v }), fmt: (v) => (v === 0 ? 'aus' : v.toFixed(1) + ' px') },
          { kind: 'slider', label: 'Strich-Unruhe', min: 0, max: 1, step: 0.05, get: () => ctx.rig.ink.wobble,
            set: (v) => ctx.rig.setInk({ wobble: v }), fmt: (v) => Math.round(v * 100) + ' %' },
          { kind: 'slider', label: 'Kanten-Zittern', min: 0, max: 14, step: 0.5, get: () => ctx.rig.ink.jitter,
            set: (v) => ctx.rig.setInk({ jitter: v }), fmt: (v) => v.toFixed(1) + ' px' },
        ] },

      { id: 'cards', title: 'Sky-Karten', hint: 'Karten schweben in Zero-G im Himmel und richten sich gedämpft zur Kamera — immer ein guter Lese- und Durchflugwinkel. Durchflug löst sie als Portal auf.',
        controls: [
          { kind: 'toggle', label: 'Karten sichtbar', get: () => ctx.skyCards.params.visible, set: (on) => ctx.skyCards.setVisible(on) },
          { kind: 'slider', label: 'Kartengröße', min: 5, max: 24, step: 0.5, get: () => ctx.skyCards.params.width,
            set: (v) => { ctx.skyCards.setParams({ width: v }); }, fmt: (v) => v.toFixed(1) + ' m' },
          { kind: 'slider', label: 'Abstand (Ring)', min: 60, max: 320, step: 5, get: () => ctx.skyCards.params.ring, set: (v) => ctx.skyCards.setParams({ ring: v }) },
          { kind: 'slider', label: 'Höhenband oben', min: 30, max: 140, step: 2, get: () => ctx.skyCards.params.yMax, set: (v) => ctx.skyCards.setParams({ yMax: v }) },
          { kind: 'slider', label: 'Zero-G-Drift', min: 0, max: 8, step: 0.2, get: () => ctx.skyCards.params.driftAmp, set: (v) => ctx.skyCards.setParams({ driftAmp: v }) },
          { kind: 'slider', label: 'Eigen-Neigung', min: 0, max: 0.7, step: 0.02, get: () => ctx.skyCards.params.tiltAmp, set: (v) => ctx.skyCards.setParams({ tiltAmp: v }) },
          { kind: 'slider', label: 'Ausrichtung folgt (träge → flink)', min: 0.2, max: 4, step: 0.1, get: () => ctx.skyCards.params.faceDamp, set: (v) => ctx.skyCards.setParams({ faceDamp: v }) },
          { kind: 'slider', label: 'Trefferfenster', min: 0.5, max: 1.6, step: 0.05, get: () => ctx.skyCards.params.passRadius, set: (v) => ctx.skyCards.setParams({ passRadius: v }) },
          { kind: 'info', label: 'Gesammelt', get: () => ctx.skyCards.collected + ' Karten' + (S.lastPass ? '  ·  zuletzt: ' + S.lastPass.title : '') },
          { kind: 'toggle', label: 'Echtes Artwork laden', get: () => S.artOn, set: (on) => { S.artOn = on; if (!on) ctx.cardReg.clearQueue(); } },
          { kind: 'info', label: 'Artwork', get: () => (ctx.cardReg.decks.length ? ctx.cardReg.decks.length + ' Decks  ·  ' + (ctx.cardReg.pending ? ctx.cardReg.pending + ' in Arbeit' : 'geladen') : 'Textkarten (Registry nicht erreichbar)') },
        ] },
      { id: 'cards', title: 'Academy', hint: 'Die Akademie ist das Deck: eine Zone pro Deck, echte KFB-Karten aus den Repo-PDFs. Doppelklick auf eine Karte fliegt sie an — nach der Ankunft nimmt die Kamera das Blatt. Karten sind Beweisstücke, keine Powers: kein Punktestand, keine Trefferquote.',
        controls: [
          { kind: 'toggle', label: 'Akademie im Himmel', get: () => S.academyOn, set: (on) => {
            S.academyOn = on; ctx.academy.setVisible(on); ctx.skyCards.setVisible(!on);
            if (!on) { ctx.live.release(); if (S.shownLive) { ctx.academy.clearLive(S.shownLive); S.shownLive = null; } ctx.auto.cancel(); }
          } },
          { kind: 'info', label: 'Fortschritt', get: () => ctx.academy.visited + ' von ' + ctx.academy.total + ' besucht'
            + (S.lastLesson ? '  ·  zuletzt: ' + S.lastLesson.title : '') },
          { kind: 'slider', label: 'Anflugzeit', min: 2, max: 24, step: 0.5, get: () => S.flyTime,
            set: (v) => { S.flyTime = v; ctx.auto.setParams({ seconds: v }); }, fmt: (v) => v.toFixed(1) + ' s' },
          { kind: 'button', label: 'Lektion suchen (oder Tacho anklicken)', onClick: () => ctx.search.open() },
          { kind: 'button', label: 'Route abfliegen (leicht → schwer)', onClick: () => ctx.flyRoute() },
          { kind: 'toggle', label: 'Nach Ankunft landen (Detailansicht)', get: () => S.dockOnArrive,
            set: (on) => { S.dockOnArrive = on; if (!on && ctx.dock.owns) ctx.dock.release(); } },
          { kind: 'slider', label: 'Randabstand in der Detailansicht', min: 1, max: 1.5, step: 0.02,
            get: () => ctx.dock.params.pad, set: (v) => ctx.dock.setParams({ pad: v }), fmt: (v) => v.toFixed(2) + '×' },
          { kind: 'button', label: 'Detailansicht verlassen', onClick: () => ctx.dock.release() },
          // S56 · Die Ankunfts-Regie. EIN Fortschritt 0→1 speist Zoom, Dock-Gewicht, Deckkraft
          // und Facing; der Abflug ist derselbe Fortschritt rückwärts. Die Regler hier ändern
          // deshalb nie einen einzelnen Anteil, sondern immer die gemeinsame Kurve.
          { kind: 'info', label: 'Ankunfts-Regie', get: () => {
            const a = ctx.arrival;
            if (!a.owns) return 'bereit  ·  ' + a.runs + ' Ankünfte';
            return (a.dir < 0 ? '◀ Abflug · ' : '▶ ') + a.phase + '  ·  ' + a.a.toFixed(2);
          } },
          { kind: 'slider', label: 'Landen (letzter Weg zum Blatt)', min: 0.3, max: 2.2, step: 0.05,
            get: () => ctx.arrival.params.landTime, set: (v) => ctx.arrival.setParams({ landTime: v }),
            fmt: (v) => v.toFixed(2) + ' s' },
          { kind: 'slider', label: 'Abflug-Tempo (derselbe Weg zurück)', min: 0.4, max: 2.5, step: 0.1,
            get: () => ctx.arrival.params.outScale, set: (v) => ctx.arrival.setParams({ outScale: v }),
            fmt: (v) => (v * 1.22).toFixed(2) + ' s gesamt' },
          { kind: 'slider', label: 'Nähe in der Landung', min: 1.4, max: 6, step: 0.1,
            get: () => ctx.arrival.params.zoomNear, set: (v) => ctx.arrival.setParams({ zoomNear: v }),
            fmt: (v) => v.toFixed(1) + ' u' },
          { kind: 'slider', label: 'Sprungbremse auf dem Fortschritt', min: 0.5, max: 4, step: 0.1,
            get: () => ctx.arrival.params.maxRate, set: (v) => ctx.arrival.setParams({ maxRate: v }),
            fmt: (v) => v.toFixed(1) + ' /s' },
          // Die Abnahme dieses Slices ist eine ZAHL, also gehört sie ins Panel und nicht in einen
          // Chatverlauf: Blickdrehung pro Frame, getrennt nach hin und zurück.
          { kind: 'info', label: 'Messung (°/Frame)', get: () => {
            const r = ctx.arrival.report();
            if (!r.up.n) return 'noch nichts gemessen — eine Karte anfliegen';
            const f = (x) => (x.n ? x.med.toFixed(2) + ' med · ' + x.p95.toFixed(2) + ' p95 · Spitze ' + x.spike.toFixed(2) + '×' : '–');
            return 'hin ' + f(r.up) + '   ·   zurück ' + f(r.down) + (r.ok === false ? '  ·  AUSREISSER' : (r.ok ? '  ·  ok' : ''));
          } },
          { kind: 'button', label: 'Messung zurücksetzen', onClick: () => { ctx.arrival.resetMeter(); ctx.note('Messung der Ankunfts-Regie zurückgesetzt.'); } },
          { kind: 'toggle', label: 'Nach Ankunft kreisen', get: () => ctx.auto.params.loiter,
            set: (on) => ctx.auto.setParams({ loiter: on }) },
          { kind: 'slider', label: 'Kreis-Radius', min: 12, max: 40, step: 1, get: () => ctx.auto.params.loiterRadius,
            set: (v) => ctx.auto.setParams({ loiterRadius: v }), fmt: (v) => Math.round(v) + ' u' },
          { kind: 'button', label: 'Anflug abbrechen (Steuerung zurück)', onClick: () => { ctx.auto.cancel(); ctx.note('Steuerung zurück bei dir.'); } },
          { kind: 'info', label: 'Pilot', get: () => {
            const s = ctx.auto.status;
            if (s.mode === 'off') return 'Hand  ·  Doppelklick auf eine Karte = Anflug';
            if (s.mode === 'dwell') return 'kreist · wartet an der Karte  ·  ' + s.queued + ' in der Route';
            if (s.mode === 'loiter') return 'kreist um die Karte  ·  jede Steuereingabe übernimmt';
            if (s.mode === 'hand') return 'Übergabe …';
            return 'Anflug  ·  ' + Math.round(s.dist) + ' u  ·  ETA ' + s.eta.toFixed(1) + ' s  ·  nötig '
              + Math.round(s.need) + ' / ' + Math.round(s.max) + ' u/s' + (s.feasible ? '' : '  ·  NICHT ERFÜLLBAR');
          } },
          { kind: 'toggle', label: 'Kartentitel (Irish Grover, extrudiert)', get: () => S.titleOn,
            set: (on) => { S.titleOn = on; ctx.attachTitle(ctx.academy.focused); } },
          { kind: 'toggle', label: 'Titel-Sublines (2 Zeilen)', get: () => S.titleSubOn,
            set: (on) => { S.titleSubOn = on; ctx.attachTitle(ctx.academy.focused); } },
          { kind: 'slider', label: 'Titel-Tiefe', min: 1, max: 14, step: 1, get: () => ctx.cardTitle.params.layers,
            set: (v) => ctx.cardTitle.setParams({ layers: Math.round(v) }), fmt: (v) => Math.round(v) + ' Ebenen' },
          { kind: 'slider', label: 'Titel-Schweben', min: 0, max: 0.4, step: 0.02, get: () => ctx.cardTitle.params.float,
            set: (v) => ctx.cardTitle.setParams({ float: v }), fmt: (v) => v.toFixed(2) + ' u' },
          { kind: 'toggle', label: 'Voxel-Glyph-Titel (alt)', get: () => S.glyphsOn, set: (on) => {
            S.glyphsOn = on;
            if (!on) ctx.attachGlyphs(null); else ctx.attachGlyphs(ctx.academy.focused);
          } },
          { kind: 'slider', label: 'Glyph-Würfelgröße', min: 0.12, max: 0.4, step: 0.01, get: () => S.glyphCube,
            set: (v) => { S.glyphCube = v; const c = S.glyphCard; S.glyphCard = null; ctx.attachGlyphs(c); },
            fmt: (v) => v.toFixed(2) + '  ·  Terrain = 1,0' },
          { kind: 'info', label: 'Titel', get: () => (ctx.glyphs.text ? ctx.glyphs.text + '  ·  ' + ctx.glyphs.live + ' Würfel' : 'keiner') },
          { kind: 'toggle', label: 'Live-Demo auf dem Blatt', get: () => ctx.live.enabled, set: (on) => {
            ctx.live.setEnabled(on);
            if (!on && S.shownLive) { ctx.academy.clearLive(S.shownLive); S.shownLive = null; }
          } },
          { kind: 'toggle', label: 'Vorschaubilder (nur three.js-Lektionen)', get: () => ctx.academy.params.previews,
            set: (on) => ctx.academy.setPreviews(on) },
          { kind: 'info', label: 'Vorschau', get: () => {
            const s = ctx.academy.previewStats;
            return s.ok + ' geladen' + (s.fail ? '  ·  ' + s.fail + ' ohne Bild' : '') + (s.busy ? '  ·  lädt …' : '');
          } },
          { kind: 'slider', label: 'Live-Auflösung', min: 320, max: 1024, step: 64, get: () => ctx.live.params.size,
            set: (v) => { if (S.shownLive) { ctx.academy.clearLive(S.shownLive); S.shownLive = null; } ctx.live.setSize(v); }, fmt: (v) => Math.round(v) + ' px' },
          { kind: 'info', label: 'Live', get: () => (ctx.live.live
            ? ctx.live.example + '  ·  ' + Math.round(ctx.live.stats.fps) + ' fps  ·  ' + ctx.live.stats.calls + ' Calls  ·  ' + ctx.live.stats.size
            : (ctx.live.enabled ? 'keine Karte im Zugriff (näher ran)' : 'aus')) },
          // Diese beiden Regler zeigten nach dem Zonen-Stern (S43) auf Parameter, die es nicht mehr
          // gibt: `ring` war wirkungslos, `yTop` druckte NaN. Ein Regler ohne Zahl dahinter ist
          // dieselbe Fehlerklasse wie eine Zahl an zwei Orten — nur in der Gegenrichtung.
          // Zonen-Abstand und -Größe stehen jetzt im Abschnitt „Reise" (dort, wo Warp wohnt).
          { kind: 'slider', label: 'Höhe: erste Lektion', min: 20, max: 90, step: 2, get: () => ctx.academy.params.yBase,
            set: (v) => ctx.academy.setParams({ yBase: v }), fmt: (v) => Math.round(v) + ' u' },
          { kind: 'slider', label: 'Höhen-Anstieg über das Kapitel', min: 0, max: 70, step: 2, get: () => ctx.academy.params.yRise,
            set: (v) => ctx.academy.setParams({ yRise: v }), fmt: (v) => (v === 0 ? 'flach' : '+' + Math.round(v) + ' u bis zur letzten') },
          { kind: 'slider', label: 'Fächer einer Zone', min: 0, max: 24, step: 1, get: () => ctx.academy.params.raySpread,
            set: (v) => ctx.academy.setParams({ raySpread: v }), fmt: (v) => (v === 0 ? 'exakt hintereinander' : '±' + Math.round(v) + '°') },
          { kind: 'slider', label: 'Zugriff ab Abstand', min: 20, max: 90, step: 2, get: () => ctx.academy.params.focusDist,
            set: (v) => ctx.academy.setParams({ focusDist: v }), fmt: (v) => Math.round(v) + ' u' },
          { kind: 'slider', label: 'Post-it: Rand eingeklappt', min: 0.08, max: 0.5, step: 0.01, get: () => ctx.academy.params.foldPeek,
            set: (v) => ctx.academy.setParams({ foldPeek: v }),
            fmt: (v) => { const r = ctx.academy.foldReport(); return r.zettel ? r.randZu + ' % Kartenhöhe schauen hervor' + (r.tapeGanzSichtbar ? '  ·  Streifen ganz sichtbar' : '  ·  Streifen angeschnitten') : 'Skala ' + v.toFixed(2); } },
          { kind: 'slider', label: 'Post-it: Klapptempo', min: 2, max: 18, step: 0.5, get: () => ctx.academy.params.foldSpeed,
            set: (v) => ctx.academy.setParams({ foldSpeed: v }), fmt: (v) => 'Dämpfung ' + v.toFixed(1) + '  ·  ~' + (3 / v).toFixed(2) + ' s' },
          { kind: 'button', label: 'Alle Post-its zuklappen', onClick: () => {
            const n = ctx.academy.foldAll(false); ctx.note(n + ' Zettel zugeklappt.');
          } },
          { kind: 'button', label: 'Akademie hier neu ankern', onClick: () => {
            const p = !ctx.isWalk() ? ctx.flight.state.position : ctx.walk.state.position;
            ctx.academy.setCenter(p.x, p.z); ctx.note('Akademie neu geankert.');
          } },
          { kind: 'button', label: 'Fortschritt zurücksetzen', onClick: () => { ctx.academy.resetProgress(); ctx.note('Alle Stempel weg.'); } },
          { kind: 'info', label: 'Blätter', get: () => (ctx.academy.pending ? ctx.academy.pending + ' werden noch gemalt' : 'alle gemalt') },
        ] },

      { id: 'narrator', title: 'Erzähler (FrizzleBob)', hint: 'Uncle FrizzleBob spricht: Reflexe im Flug und der Text der Karte, die man erreicht. Mit „Erfinden" kommt die LLM-Ebene DARÜBER — sie darf einen Beat ersetzen, nie verzögern; ohne Antwort spricht die Karte ihren eigenen Text. Braucht eine englische Systemstimme; ist keine da, bleibt er still und die Welt fliegt weiter.',
        controls: [
          { kind: 'toggle', label: 'Erzähler an', get: () => S.narratorOn, set: (on) => { S.narratorOn = on; ctx.narrator.setEnabled(on); } },
          { kind: 'select', label: 'Stimme',
            options: () => { const v = ctx.narrator.voice.listVoices(); return v.length ? v.map((x) => ({ v: x.voiceURI, l: x.name })) : [{ v: '', l: 'keine englische Stimme' }]; },
            get: () => (ctx.narrator.voice.voice && ctx.narrator.voice.voice.voiceURI) || '',
            set: (v) => ctx.narrator.setVoiceURI(v) },
          { kind: 'slider', label: 'Lautstärke', min: 0, max: 1, step: 0.05, get: () => ctx.narrator.params.volume, set: (v) => ctx.narrator.setVolume(v), fmt: (v) => Math.round(v * 100) + ' %' },
          { kind: 'slider', label: 'Musik zurück, wenn er redet', min: 0, max: 1, step: 0.02,
            get: () => ctx.audio.params.duckAmount, set: (v) => ctx.audio.setParams({ duckAmount: v }),
            fmt: (v) => (v <= 0 ? 'nicht' : '−' + Math.round(v * 100) + ' %') },
          { kind: 'slider', label: 'Mindestabstand der Reflexe', min: 2000, max: 20000, step: 200,
            get: () => ctx.narrator.params.gap, set: (v) => ctx.narrator.setParams({ gap: v }), fmt: (v) => (v / 1000).toFixed(1) + ' s' },
          { kind: 'toggle', label: 'Reflexe im Anflug stumm', get: () => ctx.narrator.params.approachMute,
            set: (on) => ctx.narrator.setParams({ approachMute: on }) },
          { kind: 'info', label: 'Stand', get: () => { const r = ctx.narrator.report();
            return (r.stimme ? r.stimme : 'keine Stimme') + '  ·  ' + r.gesagt + ' gesagt, ' + r.verschluckt + ' verschluckt'
                   + (r.unterdrückt ? '  ·  ' + r.unterdrückt + ' Reflexe im Anflug zurückgehalten' : '')
                   + (r.imAnflug ? '  ·  Anflug taktet' : '')
                   + (ctx.audio.ducked > 0 ? '  ·  Musik −' + Math.round(ctx.audio.ducked * 100) + ' %' : ''); } },
          { kind: 'info', label: 'Zuletzt', get: () => ctx.narrator.report().zuletzt || '—' },
          // S80 · Die LLM-Ebene. Standard aus: sie kostet eine Anfrage pro Zeile, und eine Stimme,
          // die man nicht bestellt hat, ist ein Radio — eine, die dabei erfindet, erst recht.
          { kind: 'toggle', label: 'Erfinden (LLM)', get: () => S.llmOn,
            set: (on) => { S.llmOn = on; if (on && !S.narratorOn) { S.narratorOn = true; ctx.narrator.setEnabled(true); } } },
          { kind: 'select', label: 'Persönlichkeit',
            options: () => ctx.promptReg.personas().map((p) => ({ v: p.id, l: p.label })),
            get: () => ctx.narrLLM.persona || '', set: (v) => { ctx.narrLLM.setPersona(v); } },
          { kind: 'select', label: 'Rolle',
            options: () => [{ v: 'narrator', l: 'Erzähler (kayfabuliert)' }, { v: 'tutor', l: 'Tutor (erklärt DIESES Blatt)' }, { v: 'qa', l: 'QA (gemessen oder behauptet?)' }],
            get: () => ctx.narrLLM.role, set: (v) => { ctx.narrLLM.setRole(v); } },
          { kind: 'button', label: 'Jetzt fragen (Rolle antwortet)', onClick: () => {
            const live = ctx.llmLive();
            if (!live.card) { ctx.note('Keine Karte im Anflug — erst ein Ziel wählen.'); return; }
            ctx.narrLLM.ask(null, live).then((s) => ctx.note(s ? 'Gesagt.' : 'Nichts gesagt (siehe Stand).'));
          } },
          { kind: 'slider', label: 'Mindestabstand der Anfragen', min: 2000, max: 20000, step: 500,
            get: () => ctx.narrLLM.params.minGap, set: (v) => ctx.narrLLM.setParams({ minGap: v }), fmt: (v) => (v / 1000).toFixed(1) + ' s' },
          { kind: 'info', label: 'LLM', get: () => { const r = ctx.narrLLM.report(), p = ctx.promptReg.report();
            if (!r.an) return 'aus' + (r.grund ? '  ·  ' + r.grund : '');
            return r.gefragt + ' gefragt, ' + r.geliefert + ' geliefert, ' + r.still + '× silence, ' + r.leerImFach + '× Fach leer'
              + '  ·  ' + r.ms + ' ms (max ' + r.msMax + ')'
              + '  ·  Prompt aus ' + (r.quelle === 'repo' ? 'dem Repo' : 'dem Code')
              + (p.fehler ? '  ·  ' + p.fehler + ' Ladefehler: ' + p.letzterFehler : '')
              + (r.fehler ? '  ·  ' + r.fehler + ' Anfragefehler' : '')
              + (r.verworfen ? '  ·  ' + r.verworfen + ' verworfen' : ''); } },
        ] },

      { id: 'music', title: 'Klang & Rhythmus', hint: 'Der Takt treibt Cube-Tanz und Blinken. Ton startet erst mit einem Klick — Browser lassen Audio nicht von allein an.',
        controls: [
          { kind: 'toggle', label: 'Ton an', get: () => S.soundOn, set: (on) => {
            S.soundOn = on;
            if (on) { ctx.audio.start(); ctx.audio.setEnabled(true); } else ctx.audio.setEnabled(false);
          } },
          { kind: 'select', label: 'Track',
            options: () => (ctx.audio.tracks.length ? ctx.audio.tracks.map((t) => ({ v: t.file, l: t.title + (t.bpm ? '  ·  ' + t.bpm + ' BPM' : '') })) : [{ v: '', l: 'lädt …' }]),
            get: () => ctx.audio.track || '', set: (v) => ctx.audio.setTrack(v) },
          { kind: 'slider', label: 'Musik', min: 0, max: 0.6, step: 0.02, get: () => ctx.audio.params.music,
            set: (v) => ctx.audio.setMusicVol(v), fmt: (v) => (v <= 0 ? 'aus' : Math.round(v * 100 / 0.6) + ' %') },
          { kind: 'slider', label: 'Drone', min: 0, max: 2, step: 0.05, get: () => ctx.audio.params.drone, set: (v) => ctx.audio.setDroneVol(v) },
          { kind: 'slider', label: 'Fahrtwind', min: 0, max: 2, step: 0.05, get: () => ctx.audio.params.wind, set: (v) => ctx.audio.setWindVol(v) },
          { kind: 'slider', label: 'Rumpeln (Bodennähe)', min: 0, max: 2, step: 0.05, get: () => ctx.audio.params.rumble, set: (v) => ctx.audio.setRumbleVol(v) },
          { kind: 'slider', label: 'Böen', min: 0, max: 2, step: 0.05, get: () => ctx.audio.params.gust, set: (v) => ctx.audio.setGustVol(v) },
          { kind: 'slider', label: 'Sample-Trim', min: 0, max: 2, step: 0.05, get: () => ctx.audio.params.sfx, set: (v) => ctx.audio.setSfxVol(v) },
          { kind: 'slider', label: 'Effekte (FX)', min: 0, max: 2, step: 0.05, get: () => ctx.audio.params.fx, set: (v) => ctx.audio.setFxVol(v) },
          { kind: 'slider', label: 'Tempo (ohne Ton)', min: 60, max: 170, step: 1, get: () => S.bpm,
            set: (v) => { S.bpm = v; ctx.audio.setBpm(v); }, fmt: (v) => Math.round(v) + ' BPM' },
          { kind: 'slider', label: 'Beat-Kopplung', min: 0, max: 2, step: 0.05, get: () => S.beatGain, set: (v) => { S.beatGain = v; } },
          { kind: 'info', label: 'Takt', get: () => (ctx.audio.running
            ? Math.round(ctx.audio.bpm) + ' BPM aus dem Track  ·  Puls ' + Math.round(ctx.audio.pulse * 100) + ' %'
            : (ctx.audio.ready ? 'Ton aus (' + ctx.audio.state + ') — synthetisch ' + Math.round(S.bpm) + ' BPM'
                           : 'synthetisch (' + Math.round(S.bpm) + ' BPM)')) },
          { kind: 'select', label: 'Cube-Tanz koppeln an', options: [
            { v: 'both', l: 'Musik + Tempo' }, { v: 'beat', l: 'nur Musik (Dancefloor)' },
            { v: 'speed', l: 'nur Reisetempo' }, { v: 'steady', l: 'gleichmäßig (Flow ohne Musik)' },
            { v: 'off', l: 'aus — Cubes stehen still' },
          ], get: () => S.danceMode, set: (v) => { S.danceMode = v; } },
          { kind: 'select', label: 'Cube-Blinken koppeln an', options: [
            { v: 'both', l: 'Musik + Tempo' }, { v: 'beat', l: 'nur Musik (Dancefloor)' },
            { v: 'speed', l: 'nur Reisetempo' }, { v: 'steady', l: 'gleichmäßig' },
            { v: 'off', l: 'aus — kein Leuchten' },
          ], get: () => S.blinkMode, set: (v) => { S.blinkMode = v; } },
          { kind: 'slider', label: 'Blink-Stärke', min: 0, max: 2.5, step: 0.05, get: () => S.blinkGain, set: (v) => { S.blinkGain = v; } },
          { kind: 'slider', label: 'Flow statt Dancefloor', min: 0, max: 1, step: 0.05, get: () => ctx.terrain.flow,
            set: (v) => ctx.terrain.setFlow(v),
            fmt: (v) => (v <= 0 ? 'Dancefloor' : v >= 1 ? 'Flow' : Math.round(v * 100) + ' % Flow') },
        ] },

      { id: 'travel', title: 'Zonen-Ring',
        hint: 'Die Lage der Zonen kommt aus den Daten: zone-index.json (Gitter, Biome, Ebenen) und zone-registry.json (Karte → Modus → Biome → Kachel). Das Gitter ist um den Spieler zentriert; welche Zonen im Bild stehen, entscheidet das Blickfeld — nicht eine Richtung im Code. EINE Zone steht in der Welt und bleibt stehen: getrennt wird beim Platzieren (Kachel-Versatz + die abgeleiteten Ebenen), nicht laufend gegen die Kamera. Dass aus manchen Blickwinkeln eine Zone hinter einer anderen steht, ist deshalb kein Fehler, sondern Tiefe — und dafür dreht man den Kopf.',
        controls: [
          { kind: 'info', label: 'Zustand', get: () => {
            if (!ctx.ring.ok) return 'Zonen-Daten nicht geladen — v12-Sternraster läuft';
            if (!ctx.ring.ready) return 'geladen, noch keine Karten abgeleitet';
            const r = ctx.ring.report();
            return r.zonen + ' Zonen · Kacheln ' + r.belegt + '/' + r.slots + ' · Mitte ' + r.mitte
                 + ' · Höhenband ' + r.basis + ' u · kleinste Bodenluft ' + (r.luft != null ? r.luft + ' u' : '–')
                 + (ctx.ringOn ? '' : '  ·  ABGEHÄNGT');
          } },
          { kind: 'toggle', label: 'Reise über Ring-Kanten (flow/river)', get: () => S.ringRoute,
            set: (on) => { S.ringRoute = on; } },
          // Die Abnahme-Zahlen dieses Slices. `mittel` soll bei ~3 liegen, `überlagerungen` bei 0 —
          // gemessen über eine 360°-Drehung in 24 Schritten, nicht per Augenmaß.
          { kind: 'info', label: 'Messung (360°-Drehung)', get: () => {
            const s = ctx.ring.sweep(ctx.camera);
            if (!s) return 'noch nichts gemessen';
            return s.lesbar + ' lesbare Zonen im Mittel (' + s.lesbarMin + '–' + s.lesbarMax + ') · '
                 + s.mittel + ' im Bild · engster Winkel ' + s.minWinkel + '° · aus ' + s.überlagerungen
                 + ' Blickwinkeln steht eine Zone hinter einer anderen (das ist Tiefe: Kopf drehen)';
          } },
          { kind: 'slider', label: 'Kachelgröße (Dichte)', min: 80, max: 260, step: 4,
            get: () => ctx.ring.params.hexSize,
            set: (v) => { ctx.ring.params.hexSize = v; ctx.ring.recenter(ctx.flight.state.position, null, true, ctx.camera.position); ctx.academy.setRing(ctx.ring); },
            fmt: (v) => Math.round(v) + ' u' },
          { kind: 'slider', label: 'Überlagerungs-Faktor', min: 1, max: 2.5, step: 0.05,
            get: () => ctx.ring.params.sep, set: (v) => { ctx.ring.params.sep = v; },
            fmt: (v) => v.toFixed(2) + '× Berührungsgrenze' },
          // S87 · Der Regler bleibt, aber sein Standard ist AUS und die Beschriftung sagt, warum:
          // kameragebundenes Ausweichen erzeugt fortlaufende Bewegung (gemessen 73,8 u je 2 s).
          { kind: 'slider', label: 'Ausweichen (bewegt die Zonen — normalerweise aus)', min: 0, max: 60, step: 2,
            get: () => ctx.ring.params.settleRate, set: (v) => { ctx.ring.params.settleRate = v; },
            fmt: (v) => (v === 0 ? 'aus — die Zonen stehen still' : Math.round(v) + '°/s  ·  Zonen wandern mit') },
          { kind: 'slider', label: 'Kachel-Versatz (Staffelung)', min: 0, max: 0.8, step: 0.05,
            get: () => ctx.ring.params.stagger,
            set: (v) => { ctx.ring.params.stagger = v; ctx.ring.recenter(ctx.flight.state.position, null, true, ctx.camera.position); ctx.academy.setRing(ctx.ring); },
            fmt: (v) => (v === 0 ? 'aus — Kacheln stehen in Reihe' : Math.round(v * 100) + ' % der halben Kachel') },
          { kind: 'slider', label: 'Lesbar bis', min: 150, max: 480, step: 10,
            get: () => ctx.ring.params.visR, set: (v) => { ctx.ring.params.visR = v; },
            fmt: (v) => Math.round(v) + ' u' },
          { kind: 'slider', label: 'Schalen um den Spieler', min: 1, max: 3, step: 1,
            get: () => ctx.ring.params.shells,
            set: (v) => { ctx.ring.params.shells = v; ctx.ring.recenter(ctx.flight.state.position, null, true, ctx.camera.position); ctx.academy.setRing(ctx.ring); },
            fmt: (v) => (v === 1 ? '1 — Contract-Minimum (6 Nachbarn)' : v + ' Schalen') },
          { kind: 'slider', label: 'Bodenluft (Mindestabstand zum Terrain)', min: 6, max: 40, step: 1,
            get: () => ctx.ring.params.clear,
            set: (v) => { ctx.ring.params.clear = v; ctx.ring.reheight(ctx.flight.state.position); },
            fmt: (v) => Math.round(v) + ' u' },
          { kind: 'info', label: 'Ebenen (up/mid/down)', get: () => {
            const r = ctx.ring.report();
            return ['up', 'mid', 'down'].map((k) => k + ' ' + (r.ebenen[k] || 0)).join(' · ');
          } },
          { kind: 'button', label: 'Neu ableiten + neu vergeben', onClick: () => {
            ctx.ring.derive(ctx.academy.cards);
            ctx.ring.recenter(ctx.flight.state.position, null, true, ctx.camera.position);
            ctx.academy.setRing(ctx.ring);
            ctx.note('Zonen neu abgeleitet: ' + ctx.ring.report().zonen + ' Zonen', 4);
          } },
          { kind: 'button', label: 'Ring abhängen (zurück auf v12-Raster)', onClick: () => {
            ctx.academy.setRing(null); ctx.note('Zonen-Ring abgehängt — Sternraster aus v12.', 4);
          } },
        ] },

      { id: 'travel', title: 'Reise',
        hint: 'Die Form der Reise entscheidet die Reihenfolge, nicht den Ort: die Zonen bleiben nach Decks sortiert. Gemischt ist gesät — dieselbe Zahl gibt dieselbe Reise, man kann sie also wiederholen und darüber reden.',
        controls: [
          { kind: 'select', label: 'Form der Reise', options: () => ctx.FORMS,
            get: () => ctx.jRoute.form, set: (v) => ctx.jRoute.setForm(v) },
          { kind: 'slider', label: 'Wurf (Mischung)', min: 1, max: 9999, step: 1,
            get: () => ctx.jRoute.seed, set: (v) => ctx.jRoute.setSeed(v), fmt: (v) => '#' + Math.round(v) },
          { kind: 'button', label: 'Neu mischen — neuer Wurf', onClick: () => { ctx.jRoute.reroll(); } },
          { kind: 'toggle', label: 'Reise fährt nach der Lesezeit selbst weiter', get: () => S.routeAuto,
            set: (on) => { S.routeAuto = on; } },
          { kind: 'toggle', label: 'Pet beim Anflug ausblenden (Netz, normalerweise aus)',
            get: () => ctx.arrival.params.hideOn, set: (on) => { ctx.arrival.setParams({ hideOn: on }); } },
          { kind: 'button', label: 'Reise starten (R)', onClick: () => ctx.flyRoute() },
          // S85 · Das Heranwachsen gehört v12. Mit laufendem Ring ist es abgeschaltet (`!ringOn` in
          // `travel-poc.js`), also darf das Panel es auch nicht als bedienbar anbieten — ein Regler,
          // der nichts tut, ist eine Falschaussage. Dieselbe Lösung wie bei der Lesezeit: die Zeile
          // sagt, wovon sie abhängt, statt stumm wirkungslos zu sein.
          { kind: 'toggle', label: 'Reise wächst mit (nur ohne Zonen-Ring)',
            get: () => S.growOn && !ctx.ringOn, set: (on) => { S.growOn = on; } },
          { kind: 'slider', label: '… ab Entfernung', min: 150, max: 900, step: 10, get: () => S.growFrom,
            set: (v) => { S.growFrom = v; },
            fmt: (v) => (ctx.ringOn ? 'aus — der Ring stellt die Zonen' : Math.round(v) + ' u') },
          { kind: 'slider', label: '… dann in', min: 90, max: 400, step: 10, get: () => S.growDist,
            set: (v) => { S.growDist = v; },
            fmt: (v) => (ctx.ringOn ? 'aus — der Ring stellt die Zonen'
              : Math.round(v) + ' u  ·  ' + (v / 42).toFixed(1) + ' s Flug') },
          { kind: 'button', label: 'Karten zurück ins Ur-Raster', onClick: () => ctx.academy.ungrow() },
          { kind: 'info', label: 'Gewachsen', get: () => { const r = ctx.academy.growReport();
            if (ctx.ringOn) return 'abgeschaltet — die Lage kommt aus dem Zonen-Ring  ·  '
              + r.besucht + ' von ' + r.karten + ' besucht';
            return r.gewachsen + ' von ' + r.karten + ' Karten liegen an ihrem gewachsenen Platz  ·  '
                   + r.besucht + ' besucht'; } },
          { kind: 'toggle', label: 'Sprung bei weiten Strecken', get: () => S.jumpOn, set: (on) => { S.jumpOn = on; } },
          { kind: 'slider', label: 'Sprung ab Entfernung', min: 120, max: 900, step: 10,
            get: () => ctx.jump.params.from, set: (v) => ctx.jump.setParams({ from: v }), fmt: (v) => Math.round(v) + ' u' },
          { kind: 'slider', label: 'Sprung-Tempo', min: 1, max: 8, step: 0.1,
            get: () => ctx.jump.params.boost, set: (v) => ctx.jump.setParams({ boost: v }), fmt: (v) => '×' + v.toFixed(1) },
          { kind: 'info', label: 'Sprung', get: () => { const r = ctx.jump.report(), b = ctx.spdBase;
            const t = r.sekunden600(b);
            return r.phase + '  ·  ×' + r.faktor + ' (' + Math.round(b * r.faktor) + ' u/s)  ·  Blende ' + r.blende
                   + '  ·  600 u: ' + t.mit + ' s statt ' + t.ohne + ' s'; } },
          { kind: 'toggle', label: 'Post-its zeigen', get: () => S.postitsOn, set: (on) => { S.postitsOn = on; ctx.academy.setPostits(on); } },
          { kind: 'slider', label: 'Lesezeit an der Karte', min: 1, max: 20, step: 0.5,
            get: () => S.routeRead, set: (v) => { S.routeRead = v; },
            fmt: (v) => (S.routeAuto ? v.toFixed(1) + ' s' : 'wirkt nur, wenn die Reise selbst weiterfährt') },
          { kind: 'info', label: 'Stand', get: () => { const r = ctx.jRoute.report();
            return r.länge ? (r.form === 'mixed' ? 'gemischt #' + r.seed : 'linear') + '  ·  ' + r.länge + ' Karten  ·  '
                   + (r.decks || []).length + ' Decks  ·  ab „' + r.erste + '"'
                 : 'noch nicht gebaut — Reise starten'; } },
          { kind: 'toggle', label: 'Boden-Modus (F)', get: () => ctx.isWalk(), set: (on) => ctx.requestMode(on ? 'walk' : 'fly', 'hand') },
          // v15/F0 · Der Schalter steht auf AUS und sagt jetzt auch, was das heißt. Bodenkontakt
          // ist ein Fahrzustand (die Kufe schiebt sich über den Hügel), kein Landebefehl.
          { kind: 'toggle', label: 'Modus folgt der Höhe (v15: aus)', get: () => S.autoMode, set: (on) => { S.autoMode = on; } },
          { kind: 'info', label: 'Landen', get: () => (S.autoMode
            ? 'Bodenkontakt + Sinkwille wechselt in den Boden-Modus (v14-Verhalten)'
            : 'nur mit der Hand: F · Bodenkontakt fliegt weiter') },
          // ── v15/F1 · Fahrdynamik nach tinyskies ────────────────────────────────────────
          // Vorbild: `dannylimanseta/tinyskies`, `client/src/game/Carpet.ts`. Die Zahlen dort
          // sind auf Weltradius 5 und Tempo 0,28…1,45 geeicht; übernommen sind die RATEN
          // (1/s) und die Verhältnisse, nicht die Absolutwerte.
          { kind: 'toggle', label: 'Drift (Haftung reißt in der Kurve)', get: () => ctx.flight.params.driftOn,
            set: (on) => ctx.flight.setParams({ driftOn: on }) },
          { kind: 'info', label: 'Drift jetzt', get: () => {
            const s = ctx.flight.state;
            return (s.drift ? 'RUTSCHT  ·  ' : 'haftet  ·  ')
              + Math.round(s.driftAmt * 100) + ' %  ·  Lenkrate ' + s.turnRate.toFixed(2) + ' rad/s'
              + (s.hug > 0.01 ? '  ·  Kufe ' + Math.round(s.hug * 100) + ' %' : '');
          } },
          { kind: 'slider', label: 'Haftung normal', min: 1.5, max: 12, step: 0.1, get: () => ctx.flight.params.gripNormal,
            set: (v) => ctx.flight.setParams({ gripNormal: v }),
            fmt: (v) => v.toFixed(1) + ' /s  ·  ' + (1 / v).toFixed(2) + ' s bis 63 %' },
          { kind: 'slider', label: 'Haftung im Rutsch', min: 0.3, max: 5, step: 0.1, get: () => ctx.flight.params.gripDrift,
            set: (v) => ctx.flight.setParams({ gripDrift: v }), fmt: (v) => v.toFixed(1) + ' /s' },
          { kind: 'slider', label: 'Kurve, ab der die Haftung reißt', min: 0.3, max: 1, step: 0.02,
            get: () => ctx.flight.params.driftTurn, set: (v) => ctx.flight.setParams({ driftTurn: v }),
            fmt: (v) => Math.round(v * 100) + ' % des vollen Ausschlags' },
          { kind: 'slider', label: 'Lenkung glätten', min: 2, max: 20, step: 0.5, get: () => ctx.flight.params.turnSmooth,
            set: (v) => ctx.flight.setParams({ turnSmooth: v }),
            fmt: (v) => v.toFixed(1) + ' /s  ·  ' + Math.round(1000 / v) + ' ms Anstieg' },
          { kind: 'slider', label: 'Kurve senkt das Höchsttempo', min: 0, max: 0.4, step: 0.01, get: () => ctx.flight.params.turnDrag,
            set: (v) => ctx.flight.setParams({ turnDrag: v }),
            fmt: (v) => (v === 0 ? 'aus — v14-Verhalten' : 'volle Kurve: ' + Math.round(ctx.flight.params.SPD_MAX * (1 - v)) + ' statt ' + Math.round(ctx.flight.params.SPD_MAX) + ' u/s') },
          { kind: 'slider', label: 'Rutschwinkel-Deckel', min: 0.2, max: 1.4, step: 0.05, get: () => ctx.flight.params.driftMaxGap,
            set: (v) => ctx.flight.setParams({ driftMaxGap: v }),
            fmt: (v) => Math.round(v * 180 / Math.PI) + '°  ·  ohne Deckel wären es ' + Math.round(ctx.flight.params.yawRate / ctx.flight.params.gripDrift * 180 / Math.PI) + '°' },
          { kind: 'slider', label: 'Steigen', min: 1, max: 8, step: 0.1, get: () => ctx.flight.params.altRise,
            set: (v) => ctx.flight.setParams({ altRise: v }), fmt: (v) => v.toFixed(1) + ' /s' },
          { kind: 'slider', label: 'Sinken', min: 0.5, max: 6, step: 0.1, get: () => ctx.flight.params.altFall,
            set: (v) => ctx.flight.setParams({ altFall: v }),
            fmt: (v) => v.toFixed(1) + ' /s  ·  ' + (ctx.flight.params.altRise / v).toFixed(1) + '× langsamer als Steigen' },
          { kind: 'slider', label: 'Kufe (Auftrieb über dem Boden)', min: 0, max: 14, step: 0.5, get: () => ctx.flight.params.hugRise,
            set: (v) => ctx.flight.setParams({ hugRise: v }),
            fmt: (v) => (v === 0 ? 'aus — harte Klemme wie v14' : v.toFixed(1) + ' /s  ·  Schwebehöhe '
              + (ctx.flight.params.ALT_MIN + ctx.flight.params.hugBand * v / (v + ctx.flight.params.altFall)).toFixed(2) + ' u über Grund') },
          { kind: 'slider', label: 'Kissenhöhe', min: 0, max: 5, step: 0.1, get: () => ctx.flight.params.hugBand,
            set: (v) => ctx.flight.setParams({ hugBand: v }), fmt: (v) => v.toFixed(1) + ' u' },
          { kind: 'slider', label: 'Warp-Faktor', min: 0, max: 5, step: 0.1, get: () => ctx.flight.params.warpGain,
            set: (v) => ctx.flight.setParams({ warpGain: v }),
            fmt: (v) => (v === 0 ? 'aus' : 'bis ' + Math.round(ctx.flight.params.SPD_MAX * (1 + v)) + ' u/s  ·  ⇧+Leertaste') },
          { kind: 'info', label: 'Warp jetzt', get: () => {
            const s = ctx.flight.state;
            return (s.warp > 0.01 ? Math.round(s.warp * 100) + ' %  ·  ' + Math.round(s.speed) + ' u/s'
              + (s.warpOver > 0.02 ? '  ·  +' + Math.round(s.warpOver * 100) + ' % über der Grenze' : '') : 'aus');
          } },
          { kind: 'slider', label: 'Erste Karte ab', min: 60, max: 400, step: 10, get: () => ctx.academy.params.zoneNear,
            set: (v) => ctx.academy.setParams({ zoneNear: v }), fmt: (v) => Math.round(v) + ' u vom Start' },
          { kind: 'slider', label: 'Kartenabstand', min: 50, max: 260, step: 5, get: () => ctx.academy.params.zoneStep,
            set: (v) => ctx.academy.setParams({ zoneStep: v }), fmt: (v) => Math.round(v) + ' u  ·  ' + (v / 42).toFixed(1) + ' s Flug' },
          { kind: 'slider', label: 'Höchsttempo Flug', min: 18, max: 90, step: 1, get: () => ctx.flight.params.SPD_MAX,
            set: (v) => ctx.flight.setParams({ SPD_MAX: v }), fmt: (v) => Math.round(v) + ' u/s' },
          { kind: 'slider', label: 'Lauftempo', min: 2, max: 12, step: 0.2, get: () => ctx.walk.params.speed,
            set: (v) => ctx.walk.setParams({ speed: v }), fmt: (v) => v.toFixed(1) + ' u/s' },
          // S79 · Boden-Kinetik: die Zahlen, mit denen Füße, Gummi und Höhenwechsel eingestellt werden.
          { kind: 'slider', label: 'Schrittlänge gehen', min: 1.2, max: 6, step: 0.1,
            get: () => ctx.petKin.stride.walk, set: (v) => ctx.petKin.setStride('walk', v),
            fmt: (v) => v.toFixed(1) + ' u pro Zyklus  ·  gilt für alle 24 Pets' },
          { kind: 'slider', label: 'Schrittlänge rennen', min: 2, max: 10, step: 0.1,
            get: () => ctx.petKin.stride.run, set: (v) => ctx.petKin.setStride('run', v),
            fmt: (v) => v.toFixed(1) + ' u pro Zyklus' },
          { kind: 'info', label: 'Füße', get: () => {
            const f = ctx.petKin.feetReport();
            if (!ctx.isWalk()) return 'nur im Boden-Modus';
            return (f.gekoppelt ? 'an der Strecke gekoppelt' : 'prozedural (kein Clip: ' + f.clip + ')')
              + '  ·  ' + f.tempo.toFixed(1) + ' u/s  ·  ' + f.zyklen.toFixed(2) + ' Zyklen/s'
              + '  ·  Größe ×' + f.sizeK.toFixed(2)
              + (f.dauer ? '  ·  Clip ' + f.dauer.toFixed(2) + ' s' : '');
          } },
          { kind: 'slider', label: 'Gummi (Nachhüpfen)', min: 0, max: 0.6, step: 0.02,
            get: () => ctx.walk.params.bounce, set: (v) => ctx.walk.setParams({ bounce: v }),
            fmt: (v) => (v === 0 ? 'aus' : Math.round(v * 100) + ' % der Aufprallhöhe') },
          { kind: 'slider', label: 'Prellsprünge höchstens', min: 0, max: 4, step: 1,
            get: () => ctx.walk.params.bounceMax, set: (v) => ctx.walk.setParams({ bounceMax: v }),
            fmt: (v) => (v === 0 ? 'aus' : Math.round(v) + '×') },
          { kind: 'slider', label: 'Sprungkraft', min: 8, max: 22, step: 0.5,
            get: () => ctx.walk.params.jumpV, set: (v) => ctx.walk.setParams({ jumpV: v }),
            fmt: (v) => v.toFixed(1) + ' u/s  ·  ' + (v * v / (2 * ctx.walk.params.gravity)).toFixed(1) + ' u hoch' },
          { kind: 'slider', label: 'Höhenwechsel-Tempo', min: 6, max: 30, step: 1,
            get: () => ctx.walk.params.floatMax, set: (v) => ctx.walk.setParams({ floatMax: v }),
            fmt: (v) => 'bis ' + Math.round(v) + ' u/s  ·  fließend statt Schnitt' },
          { kind: 'slider', label: 'Kamera-Abstand', min: 0, max: 17, step: 0.5,
            get: () => (ctx.isWalk() ? ctx.walk.state.cam.dist : ctx.camRig.zoomTarget),
            set: (v) => { if (ctx.isWalk()) ctx.walk.zoom(v - ctx.walk.state.cam.dist); else ctx.camRig.setZoom(v); } },
          { kind: 'toggle', label: 'POV (Blick des Pets)',
            get: () => (ctx.isWalk() ? ctx.walk.state.cam.dist <= 1.6 : ctx.camRig.zoomTarget <= 1.6),
            set: (on) => { if (ctx.isWalk()) ctx.walk.zoom((on ? 0 : 9) - ctx.walk.state.cam.dist); else ctx.camRig.setZoom(on ? 0 : 9); } },
          { kind: 'slider', label: 'Tacho-Eichung', min: 0.2, max: 1.5, step: 0.05, get: () => ctx.heat.params.unitMeters,
            set: (v) => ctx.heat.setParams({ unitMeters: v }), fmt: (v) => '1 Unit = ' + v.toFixed(2) + ' m' },
          // S57 · Der W\u00fcrfel tr\u00e4gt die Kanten-Textur der Welt-W\u00fcrfel (Multiply auf die Fl\u00e4chenfarbe,
          // dieselbe Rechnung wie im Terrain-Shader). Der Regler ist die Abnahme: 0 = alter Zustand,
          // 1 = Weltrechnung 1:1 \u2014 der Unterschied muss im Bild stehen, nicht in der Behauptung.
          { kind: 'slider', label: 'Würfel-Korn (Welt-Kante)', min: 0, max: 1, step: 0.05, get: () => ctx.hud.edgeGain,
            set: (v) => ctx.hud.setEdgeGain(v),
            fmt: (v) => (!ctx.hud.hasEdge ? 'Textur lädt …' : (v === 0 ? 'aus (glatte Fläche)' : (v >= 0.999 ? 'wie die Welt' : Math.round(v * 100) + ' %'))) },
          { kind: 'info', label: 'Aktuell', get: () => Math.round(ctx.heat.kmh) + ' km/h  ·  ctx.heat ' + ctx.heat.value.toFixed(2) },
        ] },

      { id: 'fx', title: 'Boost & FX', hint: 'Alles hier hängt am Regie-Skalar travelHeat — in Ruhe ist es aus, nicht bloss leise. Der Blur ist ein Fullscreen-Pass; bei 0 rendert die Szene direkt (kein Puffer, volles MSAA).',
        controls: [
          { kind: 'toggle', label: 'Speedlines', get: () => ctx.lines.enabled, set: (on) => ctx.lines.setEnabled(on) },
          { kind: 'toggle', label: 'Kartenecken-Streifen', get: () => ctx.trails.active, set: (on) => ctx.trails.setActive(on) },
          { kind: 'slider', label: 'Streifen ab', min: 5, max: 60, step: 1, get: () => ctx.trails.params.kmhOn,
            set: (v) => ctx.trails.setParams({ kmhOn: v }), fmt: (v) => Math.round(v) + ' km/h' },
          { kind: 'slider', label: 'Eckstreifen-Breite', min: 0.02, max: 0.14, step: 0.005, get: () => ctx.trails.params.width,
            set: (v) => ctx.trails.setParams({ width: v }), fmt: (v) => v.toFixed(3) },
          { kind: 'select', label: 'Streifen-Look', options: [{ v: 'light', l: 'Licht (additiv, Panel-Farbe)' }, { v: 'ink', l: 'Tinte (Story-Farbe)' }],
            get: () => ctx.lines.look, set: (v) => ctx.lines.setLook(v) },
          { kind: 'slider', label: 'Streifen-Dichte', min: 0.2, max: 2.5, step: 0.1, get: () => ctx.lines.params.density,
            set: (v) => ctx.lines.setParams({ density: v }), fmt: (v) => v.toFixed(1) + '×' },
          { kind: 'slider', label: 'Streifen-Deckkraft', min: 0, max: 0.6, step: 0.02, get: () => ctx.lines.params.opacity,
            set: (v) => ctx.lines.setParams({ opacity: v }) },
          { kind: 'slider', label: 'Radial-Blur', min: 0, max: 2, step: 0.05, get: () => S.fxBlur,
            set: (v) => { S.fxBlur = v; }, fmt: (v) => (v === 0 ? 'aus' : v.toFixed(2) + '×') },
          { kind: 'toggle', label: 'Barrel-Roll beim Boost', get: () => ctx.petKin.barrelRoll.on, set: (on) => ctx.petKin.setBarrelRoll(on) },
          { kind: 'slider', label: 'Lenken im Boost', min: 1, max: 1.8, step: 0.02, get: () => ctx.flight.params.boostYawGain,
            set: (v) => ctx.flight.setParams({ boostYawGain: v }), fmt: (v) => v.toFixed(2) + '×' },
          { kind: 'info', label: 'Live', get: () => 'Streifen ' + ctx.lines.liveCount + '  ·  Blur ' + ctx.post.strength.toFixed(3) },
        ] },

      { id: 'world', title: 'Welt', hint: 'Alles hier baut das Terrain neu — die Änderung greift kurz nach dem Loslassen.',
        controls: [
          { kind: 'slider', label: 'Rauheit', min: 0, max: 1, step: 0.02, get: () => ctx.tp('terrainRoughness', 0.6), set: (v) => ctx.setTp('terrainRoughness', v) },
          { kind: 'slider', label: 'Höhenskala', min: 4, max: 40, step: 0.5, get: () => ctx.tp('heightScale', 16), set: (v) => ctx.setTp('heightScale', v) },
          { kind: 'slider', label: 'Wasserlinie', min: -12, max: 12, step: 0.5, get: () => ctx.tp('waterLevel', 0), set: (v) => ctx.setTp('waterLevel', v) },
          { kind: 'slider', label: 'Farbversatz', min: 0, max: 1, step: 0.02, get: () => ctx.tp('colorShift', 0.5), set: (v) => ctx.setTp('colorShift', v) },
          { kind: 'slider', label: 'Cube-Tanz', min: 0, max: 1, step: 0.02, get: () => ctx.tp('motionAmplitude', 0.35), set: (v) => ctx.setTp('motionAmplitude', v) },
          { kind: 'slider', label: 'Ruhezone am Boden', min: 0, max: 1, step: 0.05, get: () => S.groundCalm,
            set: (v) => { S.groundCalm = v; }, fmt: (v) => (v === 0 ? 'aus' : Math.round(v * 100) + ' %') },
          { kind: 'info', label: 'Zone unter der Karte', get: () => (ctx.isWalk() ? 'Walk: Läufer-Zone' : Math.round(S.calmAmt * 100) + ' % ruhig') },
          { kind: 'slider', label: 'Bodenschatten', min: 0, max: 1.6, step: 0.05, get: () => S.shadowGain,
            set: (v) => { S.shadowGain = v; ctx.terrain.setCasterGain(v); }, fmt: (v) => (v === 0 ? 'aus' : Math.round(v * 100) + ' %') },
        ] },

      // v16/L1 · **Die Stufung.** Steigung und Klippe sind kein Gegensatz von Höhe, sondern von
      // Stufengröße: dieselbe Differenz ist eine Treppe in zwölf Stufen und eine Wand in einer.
      // Die Regler hier ändern nie die Landschaft, nur ihre Rasterung — der Berg bleibt, wo er ist.
      { id: 'stufung', title: 'Stufung (v16)', hint: 'Die Stufengröße ist ein ORT-Merkmal, kein Weltparameter: eine langwellige Reliefkarte teilt die Welt in feine Hänge, Terrassen, Kisten und Klippen. Jede Änderung backt das Terrain neu.',
        controls: [
          { kind: 'toggle', label: 'Feine Stufung an', get: () => ctx.terrain.stepping.on,
            set: (on) => ctx.terrain.setStepping({ on }) },
          { kind: 'slider', label: 'Teiler der feinen Stufe', min: 1, max: 12, step: 1, get: () => ctx.terrain.stepping.div,
            set: (v) => ctx.terrain.setStepping({ div: v }),
            fmt: (v) => (3 / v).toFixed(2) + ' u  ·  ' + v + ' Stufen je Würfelhöhe' },
          { kind: 'slider', label: 'Reliefgröße', min: 0.0015, max: 0.012, step: 0.0005, get: () => ctx.terrain.stepping.reliefFreq,
            set: (v) => ctx.terrain.setStepping({ reliefFreq: v }),
            fmt: (v) => Math.round(1 / v) + ' u Wellenlänge' },
          // v16/L1b · Die drei Schwellen sind jetzt FLÄCHENANTEILE, nicht Rauschwerte (Naht 115):
          // `reliefAt` gibt den Perzentilrang zurück, also heißt 45 % genau 45 % der Fläche — auf
          // JEDER gewürfelten Welt, nicht nur auf der, auf der einmal gemessen wurde. Der Regler
          // „Relief-Spreizung" ist ersatzlos weg: er war das falsche Werkzeug (er verschob eine
          // Verteilung, ohne sie zu kennen).
          { kind: 'slider', label: 'Anteil Hänge', min: 0.05, max: 0.9, step: 0.01, get: () => ctx.terrain.stepping.tFein,
            set: (v) => ctx.terrain.setStepping({ tFein: Math.min(v, ctx.terrain.stepping.tMittel - 0.02) }),
            fmt: (v) => 'Hang ' + Math.round(v * 100) + ' % der Fläche' },
          { kind: 'slider', label: '… bis Terrassen', min: 0.1, max: 0.95, step: 0.01, get: () => ctx.terrain.stepping.tMittel,
            set: (v) => ctx.terrain.setStepping({ tMittel: Math.max(ctx.terrain.stepping.tFein + 0.02, Math.min(v, ctx.terrain.stepping.tGrob - 0.02)) }),
            fmt: (v) => 'Terrasse ' + Math.round((v - ctx.terrain.stepping.tFein) * 100) + ' %' },
          { kind: 'slider', label: '… bis Kisten (Rest = Klippe)', min: 0.2, max: 1, step: 0.01, get: () => ctx.terrain.stepping.tGrob,
            set: (v) => ctx.terrain.setStepping({ tGrob: Math.max(ctx.terrain.stepping.tMittel + 0.02, v) }),
            fmt: (v) => 'Kiste ' + Math.round((v - ctx.terrain.stepping.tMittel) * 100) + ' %  ·  KLIPPE ' + Math.round((1 - v) * 100) + ' %' },
          { kind: 'slider', label: 'Klippenhöhe', min: 1, max: 4, step: 0.5, get: () => ctx.terrain.stepping.klippeMul,
            set: (v) => ctx.terrain.setStepping({ klippeMul: v }),
            fmt: (v) => (3 * v).toFixed(1) + ' u  ·  ' + (3 * v > ctx.walk.params.autoJumpMax ? 'nicht kletterbar' : 'der Läufer springt hoch') },
          // **Die Abnahme ist diese Zeile.** Eine Reliefkarte kann man sich ausdenken; ob daraus
          // Hänge NEBEN Klippen werden, muß man zählen.
          { kind: 'info', label: 'Gemessen (480 u um dich)', get: () => {
            const p = ctx.isWalk() ? ctx.walk.state.position : ctx.flight.state.position;
            const r = ctx.terrain.stepReport(p.x, p.z, 240, ctx.walk.params.autoJumpMax);
            const v = r.verteilung;
            return 'Hang ' + v.fein + ' % · Terrasse ' + v.mittel + ' % · Kiste ' + v.grob + ' % · Klippe ' + v.klippe + ' %'
              + '  ·  Sprung ⌀ ' + r.mittlererSprung + ' u, max ' + r.maxSprung + ' u';
          } },
          // ⚠ **DIE Abnahmezahl von L1**, und sie steht hier, weil die alte („Wandanteil gesamt")
          // genau die Trennung wegmittelte, um die es geht. „Steigungen und Senken NEBEN hohen
          // Klippen" heißt nicht „weniger Wände" — eine Klippe IST eine Wand, das ist ihr Zweck —
          // sondern: die Wände liegen in den Klippengebieten, und der Rest ist begehbar.
          { kind: 'info', label: 'Wände — wo liegen sie?', get: () => {
            const p = ctx.isWalk() ? ctx.walk.state.position : ctx.flight.state.position;
            const r = ctx.terrain.stepReport(p.x, p.z, 240, ctx.walk.params.autoJumpMax);
            return 'in Klippengebieten ' + r.wandInKlippe + ' %  ·  überall sonst ' + r.wandSonst
              + ' %  ·  gesamt ' + r.wandAnteil + ' %';
          } },
          { kind: 'info', label: 'Unter dir', get: () => {
            const p = ctx.isWalk() ? ctx.walk.state.position : ctx.flight.state.position;
            const s = ctx.terrain.stepAt(p.x, p.z);
            const art = s <= 3 / ctx.terrain.stepping.div + 1e-6 ? 'Hang' : s <= 1.5 + 1e-6 ? 'Terrasse' : s <= 3 + 1e-6 ? 'Kiste' : 'Klippe';
            return art + '  ·  Stufe ' + s.toFixed(2) + ' u  ·  Boden ' + ctx.terrain.groundHeightAt(p.x, p.z).toFixed(2);
          } },
        ] },

      // v16/L2 · **Die Farbwelten.** Der Shader konnte die Front seit v3 — hier steht, wer sie
      // auslöst. Kein Regler hier baut das Terrain neu (außer dem Weltwürfel, der es muß).
      { id: 'farbwelten', title: 'Farbwelten (v16)', hint: 'Die Farbwelt ist ein ORT, kein Zustand: eine Kachel von 1800 u trägt eine Palette, das Überfliegen der Grenze schickt eine radiale Front über Terrain, Himmel und Nebel. Der Story-Modus bleibt davon unberührt — er trägt die Tinte (HUD, Würfel, Speedlines, Ton).',
        controls: [
          { kind: 'toggle', label: 'Farbwelten an', get: () => ctx.colors.params.on,
            set: (on) => ctx.colors.setParams({ on }) },
          { kind: 'info', label: 'Hier', get: () => {
            const r = ctx.colors.report();
            const p = ctx.isWalk() ? ctx.walk.state.position : ctx.flight.state.position;
            return r.hier + '  ·  Farbton ' + r.farbton + '°  ·  ' + r.wechsel + ' Wechsel, '
              + r.atemzuege + ' Atemzüge  ·  Nachbarn: ' + ctx.colors.neighbours(p.x, p.z).slice(1).join(', ');
          } },
          { kind: 'info', label: 'Sitzungs-Seed', get: () => ctx.colors.seed + '  ·  Reihenfolge: ' + ctx.colors.report().reihenfolge.join(' → ') },
          { kind: 'button', label: 'Weltwürfel (neuer Start, neue Reihenfolge)', onClick: () => ctx.rollWorld() },
          { kind: 'toggle', label: 'Start würfeln (sonst immer heroic)', get: () => S.varyStart, set: (on) => { S.varyStart = on; } },
          { kind: 'slider', label: 'Kachelgröße einer Farbwelt', min: 600, max: 4000, step: 100, get: () => ctx.colors.params.cellSize,
            set: (v) => ctx.colors.setParams({ cellSize: v }),
            fmt: (v) => Math.round(v) + ' u  ·  ' + (v / 42).toFixed(0) + ' s bei Reisetempo' },
          { kind: 'slider', label: 'Front-Dauer beim Wechsel', min: 2, max: 24, step: 0.5, get: () => ctx.colors.params.crossDur,
            set: (v) => ctx.colors.setParams({ crossDur: v }), fmt: (v) => v.toFixed(1) + ' s' },
          { kind: 'slider', label: 'Front-Weite', min: 300, max: 2000, step: 50, get: () => ctx.colors.params.crossDist,
            set: (v) => ctx.colors.setParams({ crossDist: v }), fmt: (v) => Math.round(v) + ' u  ·  Horizont ~520' },
          // Der Atem ist DIESELBE Front, kleiner. Eine zweite Bewegung wäre die Konfetti-Falle
          // aus Overworld v12 (Naht 82) — hier gibt es nur eine.
          { kind: 'toggle', label: 'Atem (Farbton driftet in Zügen)', get: () => ctx.colors.params.atemOn,
            set: (on) => ctx.colors.setParams({ atemOn: on }) },
          { kind: 'slider', label: 'Atemzug alle', min: 8, max: 180, step: 2, get: () => ctx.colors.params.atemGap,
            set: (v) => ctx.colors.setParams({ atemGap: v }), fmt: (v) => Math.round(v) + ' s' },
          { kind: 'slider', label: 'Farbtondrehung je Zug', min: 0.005, max: 0.12, step: 0.005, get: () => ctx.colors.params.atemHue,
            set: (v) => ctx.colors.setParams({ atemHue: v }), fmt: (v) => (v * 360).toFixed(1) + '°' },
          { kind: 'slider', label: 'Umkehr nach', min: 1, max: 10, step: 1, get: () => ctx.colors.params.atemSwing,
            set: (v) => ctx.colors.setParams({ atemSwing: v }),
            fmt: (v) => v + ' Zügen  ·  Ausschlag ±' + (v * ctx.colors.params.atemHue * 360).toFixed(0) + '°' },
          // ⚠ Der Riegel ist eine MESSUNG, keine Vorliebe: die Karten sind cremefarbenes Papier
          // mit Tusche. Wird die helle Spitze so hell wie das Papier, ist die Karte weg.
          { kind: 'toggle', label: 'Lesbarkeits-Riegel', get: () => S.colorGuard, set: (on) => { S.colorGuard = on; ctx.applyPalette(true); } },
          { kind: 'slider', label: 'Hellste Spitze', min: 0.6, max: 1, step: 0.02, get: () => S.colorMaxLum,
            set: (v) => { S.colorMaxLum = v; ctx.applyPalette(true); }, fmt: (v) => Math.round(v * 100) + ' % Helligkeit' },
        ] },

      // v16/L2d · **Die Ringwellen.** Kein Draw-Call, kein Attribut, kein Rebake: acht Plätze in
      // einem Uniform-Array, jede Säule prüft im Fragment-Shader ihren Abstand. Eine flache
      // Scheibe wäre die falsche Bauweise — sie z-fightet mit den Würfeloberseiten und schwebt
      // über Stufen, und L1 hat das Gelände gerade stufiger gemacht.
      { id: 'wellen', title: 'Ringwellen (v16)', wide: true, hint: 'Farbkreise laufen über das Terrain, breiten sich aus und verlaufen — Variante A: kein Gedächtnis, danach ist alles wie vorher. Ausgelöst durch EREIGNISSE, nie durch den Beat: eine Welle beim Aufsetzen liest sich als Ursache, eine Welle im Takt als Deko.',
        controls: [
          { kind: 'toggle', label: 'Ringwellen an', get: () => S.rippleOn, set: (on) => { S.rippleOn = on; } },
          { kind: 'info', label: 'Jetzt', get: () => {
            const r = ctx.terrain.rippleReport();
            return r.live + ' von ' + r.plaetze + ' Plätzen  ·  ' + r.gesamt + ' insgesamt'
              + (r.radien.length ? '  ·  Radien ' + r.radien.join(', ') + ' u' : '');
          } },
          { kind: 'button', label: 'Welle hier auslösen (Probe)', onClick: () => {
            const p = ctx.isWalk() ? ctx.walk.state.position : ctx.flight.state.position;
            ctx.terrain.spawnRipple(p.x, p.z, ctx.rippleColor(), { life: 4, alpha: 0.95 });
          } },
          { kind: 'info', label: 'Wellenfarbe jetzt', get: () => {
            const c = ctx.rippleColor(), p = ctx.paletteStops()[1];
            const hex = (v) => '#' + v.map((x) => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, '0')).join('');
            return hex(c) + '  gegen Fläche ' + hex(p)
              + '  ·  Farbton +155°, Sättigung hoch, Helligkeit leicht ÜBER der Fläche (0,40–0,70)';
          } },
          { kind: 'slider', label: 'Wellentempo', min: 8, max: 140, step: 2, get: () => ctx.terrain.rippleParams.speed,
            set: (v) => ctx.terrain.setRippleParams({ speed: v }),
            fmt: (v) => Math.round(v) + ' u/s  ·  ' + (v < 42 ? 'langsamer als Reisetempo — der Spieler überholt sie' : 'schneller als Reisetempo (42)') },
          { kind: 'slider', label: 'Ringbreite', min: 4, max: 90, step: 2, get: () => ctx.terrain.rippleParams.width,
            set: (v) => ctx.terrain.setRippleParams({ width: v }), fmt: (v) => Math.round(v) + ' u Kantenweichheit' },
          { kind: 'slider', label: 'Deckkraft', min: 0, max: 1.5, step: 0.05, get: () => ctx.terrain.rippleParams.gain,
            set: (v) => ctx.terrain.setRippleParams({ gain: v }),
            fmt: (v) => (v === 0 ? 'unsichtbar' : Math.round(v * 100) + ' %') },
          { kind: 'keys', rows: [
            ['Aufsetzen', 'Welle am Landepunkt — Größe aus der Wucht (Kiste ≠ Klippensturz)'],
            ['Karte durchflogen', 'Welle vom Ort der KARTE, läuft dem Spieler hinterher'],
            ['Neue Farbwelt', 'Welle sagt »jetzt«, die Front trägt die Farbe'],
            ['Atemzug', 'dieselbe Welle, schwächer (0,42 statt 0,90)'],
            ['Beat', '— ausdrücklich NICHT: das wäre Deko statt Ursache'],
          ] },
          { kind: 'toggle', label: 'Auslöser: Aufsetzen', get: () => S.rippleTouch, set: (on) => { S.rippleTouch = on; } },
          { kind: 'toggle', label: 'Auslöser: Karte durchflogen', get: () => S.rippleZone, set: (on) => { S.rippleZone = on; } },
          { kind: 'toggle', label: 'Auslöser: Farbwelt-Wechsel', get: () => S.rippleRegion, set: (on) => { S.rippleRegion = on; } },
        ] },

      // v16/L3 · Die Props. Kenney-Assets statt der grauen Platzhalter-Blöcke, geladen zur Laufzeit
      // über asset-repo.json (RAW-URLs, nichts im Projekt), gestreut auf denselben Standorten, die
      // vorher die Blöcke trugen, verbogen mit der Mathematik aus kfb-cartoon-deform.js — nur pro
      // Instanz statt pro Mesh.
      { id: 'props', title: 'Props (v16)', wide: true, hint: 'Die Standorte gehören dem Terrain (dieselben wie die grauen Blöcke), die Modelle diesem Abschnitt. Laden die Assets nicht, streuen die Blöcke weiter — ein 404 macht die Landschaft nicht leer, nur ärmer.',
        controls: [
          { kind: 'info', label: 'Geladen', get: () => {
            const r = ctx.props.report();
            return r.geladen + ' Modelle in ' + r.ladezeit + '  ·  ' + r.drawCalls + ' Draw-Calls'
              + '  ·  ' + r.vertsGesamt + ' Vertices  ·  Aufbau ' + r.aufbau;
          } },
          { kind: 'info', label: 'Gestreut', get: () => {
            const r = ctx.props.report();
            return r.gesetzt + ' von ' + r.standorte + ' Standorten'
              + (r.ueberBudget ? '  ·  ' + r.ueberBudget + ' über Budget (' + r.budget + ')' : '  ·  im Budget')
              + '  ·  Biom ' + (r.biom || '—');
          } },
          { kind: 'toggle', label: 'Props statt grauer Blöcke', get: () => ctx.terrain.propsOwn,
            set: (on) => { ctx.terrain.setPropsOwn(on && ctx.props.ready); if (on && ctx.props.ready) ctx.props.rebuild(ctx.terrain); } },
          { kind: 'slider', label: 'Dichte', min: 0, max: 3, step: 0.1, get: () => ctx.terrain.propDensity,
            set: (v) => { ctx.terrain.setPropDensity(v); if (ctx.props.ready) ctx.props.rebuild(ctx.terrain); },
            fmt: (v) => (v === 0 ? 'leer' : Math.round(v * 100) + ' %  ·  ' + ctx.props.report().gesetzt + ' Props') },
          { kind: 'slider', label: 'Budget', min: 300, max: 6000, step: 100, get: () => ctx.props.params.budget,
            set: (v) => { ctx.props.setParams({ budget: v }); ctx.props.rebuild(ctx.terrain); },
            fmt: (v) => v + ' Props  ·  Obergrenze über alle Modelle' },
          // Die Biom-Logik läuft über den DATEINAMEN (_dark / _fall), nicht über eine Tabelle.
          { kind: 'toggle', label: 'Biom-Logik (Namensfassung + Gewichte)', get: () => ctx.props.params.biomeLogic,
            set: (on) => { ctx.props.setParams({ biomeLogic: on }); ctx.props.rebuild(ctx.terrain); } },
          { kind: 'info', label: 'Was steht wo', get: () => ctx.props.report().modelle.join('   ·   ') },
          // ── Runde Kanten (v16/L3c) ────────────────────────────────────────────────────
          // Zwei Regler, ein Eindruck: die Normale von hart nach weich mischen (Beleuchtung) und
          // entlang der weichen Normale aufblasen (Silhouette). Eine echte Fase wäre Geometrie,
          // die 1400-fach bezahlt werden müsste.
          { kind: 'slider', label: 'Kanten weich', min: 0, max: 1, step: 0.05, get: () => ctx.props.params.round,
            set: (v) => ctx.props.setParams({ round: v }),
            fmt: (v) => (v === 0 ? 'hart — Kenney-Facetten' : Math.round(v * 100) + ' % gerundete Beleuchtung') },
          { kind: 'slider', label: 'Aufblasen', min: 0, max: 0.06, step: 0.002, get: () => ctx.props.params.inflate,
            set: (v) => ctx.props.setParams({ inflate: v }),
            fmt: (v) => (v === 0 ? 'aus' : v.toFixed(3) + ' × Höhe  ·  rundet die Silhouette') },
          { kind: 'slider', label: 'Boden färbt ein', min: 0, max: 1, step: 0.05, get: () => ctx.props.params.tint,
            set: (v) => ctx.props.setParams({ tint: v }),
            fmt: (v) => (v === 0 ? 'Kenney-Farben pur' : Math.round(v * 100) + ' % Farbe des Würfels darunter') },
          // ── Der Verbieger ─────────────────────────────────────────────────────────────
          { kind: 'slider', label: 'Verbieger: Mischung', min: 0, max: 1, step: 0.05, get: () => ctx.props.params.mix,
            set: (v) => ctx.props.setParams({ mix: v }),
            fmt: (v) => (v === 0 ? 'aus — Originalform' : Math.round(v * 100) + ' %') },
          { kind: 'slider', label: 'Biegen', min: 0, max: 0.3, step: 0.005, get: () => ctx.props.params.bend,
            set: (v) => { ctx.props.setParams({ bend: v }); ctx.props.rebuild(ctx.terrain); },
            fmt: (v) => v.toFixed(3) + ' × Höhe  ·  nur ab 4 Höhen-Ringen' },
          { kind: 'slider', label: 'Neigen', min: 0, max: 0.25, step: 0.005, get: () => ctx.props.params.lean,
            set: (v) => { ctx.props.setParams({ lean: v }); ctx.props.rebuild(ctx.terrain); },
            fmt: (v) => v.toFixed(3) + ' × Höhe' },
          { kind: 'slider', label: 'Verjüngen', min: 0, max: 0.5, step: 0.01, get: () => ctx.props.params.taper,
            set: (v) => { ctx.props.setParams({ taper: v }); ctx.props.rebuild(ctx.terrain); } },
          { kind: 'slider', label: 'Verdrehen', min: 0, max: 45, step: 1, get: () => ctx.props.params.twist,
            set: (v) => { ctx.props.setParams({ twist: v }); ctx.props.rebuild(ctx.terrain); }, fmt: (v) => v + '°' },
          { kind: 'slider', label: 'Atmen (Squash)', min: 0, max: 0.2, step: 0.005, get: () => ctx.props.params.squash,
            set: (v) => ctx.props.setParams({ squash: v }),
            fmt: (v) => (v === 0 ? 'aus' : Math.round(v * 100) + ' %  ·  am Bob des Würfels, nicht an eigener Uhr') },
          { kind: 'slider', label: 'Nachlauf (Follow-Through)', min: 0, max: 0.4, step: 0.01, get: () => ctx.props.params.squashLag,
            set: (v) => ctx.props.setParams({ squashLag: v }),
            fmt: (v) => (v === 0 ? 'starr am Boden' : v.toFixed(2) + ' s später als der Boden') },
          { kind: 'slider', label: 'Nachlauf streuen', min: 0, max: 0.3, step: 0.01, get: () => ctx.props.params.squashLagJitter,
            set: (v) => ctx.props.setParams({ squashLagJitter: v }),
            fmt: (v) => (v === 0 ? 'alle gleichzeitig — wirkt wie ein Uhrwerk' : '±' + v.toFixed(2) + ' s je Prop') },
          { kind: 'slider', label: 'Größenstreuung', min: 0, max: 0.4, step: 0.02, get: () => ctx.props.params.sizeJitter,
            set: (v) => { ctx.props.setParams({ sizeJitter: v }); ctx.props.rebuild(ctx.terrain); }, fmt: (v) => '±' + Math.round(v * 100) + ' %' },
        ] },

      { id: 'world', title: 'Farbwelt', hint: 'Zurückgeholt aus „KFB Terrain + Skydome v3": der Shader konnte das die ganze Zeit, es fehlte die Auswahl. Nichts hier baut das Terrain neu — es sind Uniforms, sie greifen im nächsten Bild. Die Story-Tinte für Himmel, Nebel und Würfel bleibt unberührt: hier färben sich die Würfel der Welt.',
        controls: [
          { kind: 'select', label: 'Palette', options: PALETTE_OPTIONS,
            get: () => S.paletteId, set: (v) => { S.paletteId = v; ctx.applyPalette(true); } },
          { kind: 'info', label: 'Was das ist', get: () => PALETTE_NOTES[S.paletteId] || '—' },
          { kind: 'toggle', label: 'Ausbreitung bei Wechsel', get: () => S.paletteSpread, set: (on) => { S.paletteSpread = on; } },
          { kind: 'slider', label: 'Helligkeit min', min: 0.1, max: 0.9, step: 0.01, get: () => cp.brightMin,
            set: (v) => setCol('brightMin', v), fmt: (v) => v.toFixed(2) },
          { kind: 'slider', label: 'Hell/Dunkel-Range', min: 0, max: 1.1, step: 0.01, get: () => cp.brightRange,
            set: (v) => setCol('brightRange', v), fmt: (v) => v.toFixed(2) },
          { kind: 'slider', label: 'Sättigung', min: 0, max: 1.2, step: 0.01, get: () => cp.satBase,
            set: (v) => setCol('satBase', v), fmt: (v) => v.toFixed(2) },
          { kind: 'slider', label: 'Sättigungs-Range', min: 0, max: 0.8, step: 0.01, get: () => cp.satRange,
            set: (v) => setCol('satRange', v), fmt: (v) => v.toFixed(2) },
          { kind: 'slider', label: 'Höhe ↔ Zufall', min: 0, max: 1, step: 0.01, get: () => cp.topoMix,
            set: (v) => setCol('topoMix', v), fmt: (v) => (v > 0.5 ? 'Höhe ' : 'Zufall ') + v.toFixed(2) },
          // Die zwei Regenbogen-Regler stehen hier und nicht in einer eigenen Sektion: sie tun nur
          // etwas, solange die Palette „Regenbogen" gewählt ist — und das sagt die Anzeige auch.
          { kind: 'slider', label: 'Regenbogen-Tempo', min: 0, max: 0.25, step: 0.005, get: () => S.rainbowSpeed,
            set: (v) => { S.rainbowSpeed = v; ctx.applyPalette(false); },
            fmt: (v) => (S.paletteId === 'rainbow' ? v.toFixed(3) : v.toFixed(3) + '  ·  wirkt bei „Regenbogen"') },
          { kind: 'slider', label: 'Regenbogen-Skala', min: 0.1, max: 1.6, step: 0.01, get: () => S.rainbowSpread,
            set: (v) => { S.rainbowSpread = v; ctx.applyPalette(false); },
            fmt: (v) => (S.paletteId === 'rainbow' ? v.toFixed(2) : v.toFixed(2) + '  ·  wirkt bei „Regenbogen"') },
        ] },

      { id: 'sky', title: 'Würfel im Himmel', hint: 'Drei Würfel — rot, gelb, blau — gleichmäßig im Skydome verteilt: wer sich dreht, hat nach höchstens 120° einen im Bild. Ihre Eigendrehungen hängen zyklisch voneinander ab: kein Paar erklärt das Muster, erst alle drei. Recht spricht die Seite, die dir am direktesten gegenübersteht.',
        controls: [
          { kind: 'toggle', label: 'Würfel sichtbar', get: () => ctx.dice.params.visible, set: (on) => ctx.dice.setVisible(on) },
          { kind: 'slider', label: 'Streuung der Sitze', min: 0.1, max: 1, step: 0.02, get: () => ctx.dice.params.spreadAz,
            set: (v) => ctx.dice.setParams({ spreadAz: v }),
            fmt: (v) => Math.round(v * 120) + '° Abstand' + (v >= 0.95 ? '  ·  Kanon: man dreht sich hin' : '  ·  alle drei im Bild') },
          { kind: 'toggle', label: 'Bahn (Auf- und Untergang)', get: () => ctx.dice.params.orbitOn, set: (on) => ctx.dice.setParams({ orbitOn: on }) },
          { kind: 'slider', label: 'Umlaufdauer (ein Tag)', min: 0.5, max: 20, step: 0.5, get: () => ctx.dice.params.orbitMin,
            set: (v) => ctx.dice.setParams({ orbitMin: v }), fmt: (v) => v.toFixed(1) + ' min pro Umlauf' },
          { kind: 'toggle', label: 'Tageszeit läuft von selbst', get: () => ctx.dice.params.orbitAuto, set: (on) => ctx.dice.setParams({ orbitAuto: on }) },
          { kind: 'slider', label: 'Tageszeit', min: 0, max: 1, step: 0.005, get: () => ctx.dice.params.orbitPhase,
            set: (v) => ctx.dice.setParams({ orbitPhase: v }),
            fmt: (v) => Math.floor(v * 24) + ':' + String(Math.floor((v * 24 % 1) * 60)).padStart(2, '0') + (ctx.dice.params.orbitAuto ? '  ·  läuft' : '  ·  von Hand') },
          { kind: 'slider', label: 'Kulmination der Bahn', min: 0.04, max: 1.2, step: 0.02, get: () => ctx.dice.params.orbitEl,
            set: (v) => ctx.dice.setParams({ orbitEl: v }),
            fmt: (v) => Math.round(v * 57.3) + '° höchster Stand' + (v > 0.22 ? '  ·  über dem Bildband (nur beim Umsehen)' : '  ·  läuft durchs Bild') },
          { kind: 'slider', label: 'Bahn heben', min: 0, max: 1, step: 0.05, get: () => ctx.dice.params.orbitLift,
            set: (v) => ctx.dice.setParams({ orbitLift: v }),
            fmt: (v) => (v === 0 ? 'Großkreis — exakt 120°, halbe Zeit unten (Standard)' : '+' + v.toFixed(2) + '  ·  häufiger über dem Horizont, aber über dem Bild') },
          { kind: 'button', label: 'Werfen', onClick: () => ctx.dice.roll(1) },
          { kind: 'toggle', label: 'Wurf setzt den Story-Modus', get: () => S.diceJudges, set: (on) => { S.diceJudges = on; } },
          { kind: 'slider', label: 'Größe', min: 12, max: 120, step: 2, get: () => ctx.dice.params.size,
            set: (v) => ctx.dice.setParams({ size: v }), fmt: (v) => Math.round(v) + ' u Kantenlänge' },
          { kind: 'slider', label: 'Abstand', min: 150, max: 700, step: 10, get: () => ctx.dice.params.radius,
            set: (v) => ctx.dice.setParams({ radius: v }), fmt: (v) => Math.round(v) + ' u um dich' },
          { kind: 'slider', label: 'Verschränkung (Option)', min: 0, max: 1.5, step: 0.05, get: () => ctx.dice.params.couple,
            set: (v) => ctx.dice.setParams({ couple: v }),
            fmt: (v) => (v === 0 ? 'aus — jeder dreht für sich (Standard)' : 'K = ' + v.toFixed(2) + '  ·  die drei hören einander zu') },
          { kind: 'slider', label: 'Achsen-Wandern (Zero-G)', min: 0, max: 0.5, step: 0.01, get: () => ctx.dice.params.drift,
            set: (v) => ctx.dice.setParams({ drift: v }), fmt: (v) => (v === 0 ? 'starre Achse' : v.toFixed(2) + '  ·  trudelt') },
          { kind: 'slider', label: 'Drehtempo', min: 0, max: 0.6, step: 0.01, get: () => ctx.dice.params.spinHz,
            set: (v) => ctx.dice.setParams({ spinHz: v }), fmt: (v) => (v === 0 ? 'stehen' : v.toFixed(2) + ' Hz') },
          { kind: 'slider', label: 'Leuchten', min: 0, max: 2.5, step: 0.05, get: () => ctx.dice.params.glow,
            set: (v) => ctx.dice.setParams({ glow: v }), fmt: (v) => (v === 0 ? 'aus' : v.toFixed(2)) },
          { kind: 'slider', label: 'Atem', min: 0, max: 1.2, step: 0.02, get: () => ctx.dice.params.pulseHz,
            set: (v) => ctx.dice.setParams({ pulseHz: v }), fmt: (v) => (v === 0 ? 'ruhig' : v.toFixed(2) + ' Hz') },
          { kind: 'toggle', label: 'Am Takt pulsieren', get: () => ctx.dice.params.beatOn, set: (on) => ctx.dice.setParams({ beatOn: on }) },
          { kind: 'slider', label: 'Takt-Ausschlag', min: 0, max: 0.3, step: 0.01, get: () => ctx.dice.params.beatScale,
            set: (v) => ctx.dice.setParams({ beatScale: v }), fmt: (v) => (v === 0 ? 'aus' : '±' + Math.round(v * 100) + ' % Größe') },
          { kind: 'slider', label: 'Squash & Stretch', min: 0, max: 1, step: 0.05, get: () => ctx.dice.params.beatSquash,
            set: (v) => ctx.dice.setParams({ beatSquash: v }), fmt: (v) => (v === 0 ? 'nur größer' : Math.round(v * 100) + ' % davon als Stauchen') },
          { kind: 'slider', label: 'Disco (Drehung am Takt)', min: 0, max: 5, step: 0.1, get: () => ctx.dice.params.beatSpin,
            set: (v) => ctx.dice.setParams({ beatSpin: v }), fmt: (v) => (v === 0 ? 'aus' : '×' + (1 + v).toFixed(1) + ' auf dem Beat') },
          { kind: 'slider', label: 'Wurfdauer', min: 1.2, max: 5, step: 0.1, get: () => ctx.dice.params.tumbleDur,
            set: (v) => ctx.dice.setParams({ tumbleDur: v }), fmt: (v) => v.toFixed(1) + ' s' },
          { kind: 'info', label: 'Modell', get: () => ctx.dice.report().modell },
          // Der Handel, den Georgs Frage aufmacht: Gleichmäßigkeit gegen Sichtbarkeit. Drei Zahlen an
          // einem Ort, damit man ihn beim Regeln SIEHT — und `sichtbar` ist im Bildraum gemessen.
          { kind: 'info', label: 'Verteilung', get: () => {
            const v = ctx.dice.verteilung();
            // **`ganzImBild` ist die Abnahmezahl, nicht `sichtbar`.** `sichtbar` zählt Mittelpunkte und
            // meldete 3/3, während oben eine Ecke fehlte (S60g). Beide stehen da, damit man den
            // Unterschied sieht: gleich = kein Anschnitt, kleiner = einer hängt über der Kante.
            return 'Mindestwinkel ' + v.mindestwinkel + '° (Ideal 120)'
              + '  ·  über dem Horizont ' + v.ueberHorizont + '/3'
              + '  ·  ganz im Bild ' + (v.ganzImBild == null ? '–' : v.ganzImBild + '/3')
              + ' (Mittelpunkte ' + (v.sichtbar == null ? '–' : v.sichtbar + '/3')
              + ', Winkelradius ' + v.winkelradius + '°)';
          } },
          // Abnahme der Kopplung: bei K = 0 stehen die drei Drehraten fest (Spanne konstant), mit
          // Kopplung atmet die Spanne — man sieht im Panel, dass die drei einander zuhören.
          { kind: 'info', label: 'Drehraten', get: () => {
            const r = ctx.dice.report();
            return r.omega.map((o) => o.toFixed(2)).join(' / ') + '   Spanne ' + r.spread.toFixed(2);
          } },
          { kind: 'info', label: 'Richter jetzt', get: () => {
            const r = ctx.dice.report();
            return (r.richter ? '⚀ ' + r.richter + '  ·  ' + r.wuerfel : '–')
              + (r.rollt ? '  ·  rollt' : '') + '  ·  Takt ' + r.beatEnv.toFixed(2);
          } },
        ] },

      { id: 'sky', title: 'Himmel',
        controls: [
          { kind: 'select', label: 'Variante', options: [
            { v: 'S', l: 'Sphäre (Default)' }, { v: 'A', l: 'Waber-Noise' }, { v: 'space', l: 'Space' },
            { v: 'watercolor', l: 'Aquarell' }, { v: 'watercolor2', l: 'Aquarell II' }, { v: 'starfield', l: 'Sternenfeld' },
            { v: 'night', l: 'Nacht' }, { v: 'morning', l: 'Morgen' }, { v: 'day', l: 'Tag' }, { v: 'alien', l: 'Alien' },
          ], get: () => ctx.sky.getVariant(), set: (v) => { ctx.sky.setVariant(v); ctx.lighting.bakeEnvironment(ctx.sky.group); } },
          { kind: 'slider', label: 'Welt-Mischung', min: 0, max: 1, step: 0.02, get: () => S.skyWorldMix, set: (v) => { S.skyWorldMix = v; ctx.sky.setWorldMix(v); } },
          { kind: 'slider', label: 'Belichtung', min: 0.4, max: 1.8, step: 0.05, get: () => S.skyExposure, set: (v) => { S.skyExposure = v; ctx.sky.setExposure(v); } },
          { kind: 'toggle', label: 'Hypno-Spirale', get: () => S.skySpiral, set: (on) => { S.skySpiral = on; ctx.sky.setSpiral(on); } },
        ] },

      { id: 'S.pet', title: 'Pet', hint: 'Alle Pets aus dem kanonischen Vertrag. Der Wechsel räumt das alte Pet ab (ein Augenpaar).',
        controls: [
          { kind: 'select', label: 'Blickrichtung', options: [
            { v: 'auto', l: 'Auto (Stand → zu dir, Tempo → Fahrtrichtung)' },
            { v: 'player', l: 'Player (immer zu dir)' },
            { v: 'track', l: 'Track (immer Fahrtrichtung)' },
          ], get: () => ctx.petFace.mode, set: (v) => ctx.petFace.setMode(v) },
          { kind: 'toggle', label: 'Augen folgen dem Cursor/der Kamera', get: () => ctx.petFace.params.eyeTrack,
            set: (on) => ctx.petFace.setParams({ eyeTrack: on }) },
          { kind: 'info', label: 'Blick', get: () => Math.round(ctx.petFace.blend * 100) + ' % zu dir  ·  '
            + Math.round(ctx.petFace.yaw * 180 / Math.PI) + '°' },
          { kind: 'slider', label: 'Tempo-Kopplung (Blick)', min: 0.5, max: 3, step: 0.1, get: () => ctx.petFace.params.speedGain,
            set: (v) => ctx.petFace.setParams({ speedGain: v }), fmt: (v) => v.toFixed(1) + '×' },
          { kind: 'select', label: 'Cube-Pet',
            options: () => ((S.petLib && S.petLib.pets) || []).map((p) => ({ v: p.id, l: p.name || p.id })),
            get: () => S.petId, set: (v) => ctx.mountPet(v) },
          { kind: 'info', label: 'Geladen', get: () => (S.pet ? (S.pet.name || S.petId) : '…') },
          { kind: 'slider', label: 'Himmels-Licht', min: 0, max: 2, step: 0.05, get: () => ctx.lighting.params.env,
            set: (v) => ctx.lighting.setEnv(v), fmt: (v) => (v === 0 ? 'aus' : v.toFixed(2) + '×') },
          { kind: 'slider', label: 'Fill-Licht (Gegenlicht)', min: 0, max: 1.5, step: 0.05, get: () => ctx.lighting.params.fill,
            set: (v) => ctx.lighting.setFill(v) },
          { kind: 'slider', label: 'Story-Tint', min: 0, max: 0.5, step: 0.01, get: () => ctx.lighting.tintAmount,
            set: (v) => ctx.lighting.setTint(null, v), fmt: (v) => (v === 0 ? 'aus' : Math.round(v * 100) + ' %') },
        ] },

      // v17/T1 · **Varianten.** Drei Knöpfe auf dem, was schon steht — kein neues System.
      // Der Parametersatz gehört in jedes Testergebnis (Naht 115), deshalb liegt er in
      // `localStorage['kfb-travel-params']`, wo die Testliste ihn abholt.
      { id: 'varianten', title: 'Varianten & Test', hint: 'Ein Testergebnis ohne den Parametersatz, der es erzeugt hat, ist eine Anekdote. Der Weltwürfel ändert die WELT, der Regler-Würfel nur die Regler — nie beides zugleich, sonst weiß man nicht, welches gewirkt hat.',
        controls: [
          { kind: 'button', label: 'Parametersatz sichern (für die Testliste)', onClick: () => ctx.saveParams() },
          { kind: 'button', label: 'Regler würfeln (Welt bleibt)', onClick: () => ctx.rollParams() },
          { kind: 'info', label: 'Zuletzt gesichert', get: () => {
            try {
              const raw = localStorage.getItem('kfb-travel-params');
              if (!raw) return 'noch nichts — Knopf oben';
              const j = JSON.parse(raw);
              return (j.at || '?').slice(0, 19).replace('T', ' ') + '  ·  Seed ' + j.seed + '  ·  ' + j.story + '  ·  Biom ' + (j.biome || '—');
            } catch (e) { return 'Speicher nicht lesbar'; }
          } },
          { kind: 'info', label: 'Testliste', get: () => 'KFB Travel Testliste.dc.html — dort »Aus dem Spiel holen«' },
        ] },

      { id: 'controls', title: 'Steuerung', wide: true, hint: 'Beide Travel-Modi in einer Tabelle — dafür ist die Legende aus dem Bild verschwunden. v15: Landen und Starten gehören der Hand (F), Bodenkontakt fliegt weiter.',
        controls: [{ kind: 'keys', rows: [
          ['F', 'LANDEN / STARTEN — der einzige Weg (v15)'], ['Leertaste ×2', 'Boden: ABHEBEN (verlängerter Sprung)'],
          ['X', 'HART BREMSEN + sinken'], ['⇧ + Leertaste', 'WARP — über die Reisegrenze hinaus'],
          ['W / S', 'Flug: Schub · langsamer'], ['W / S', 'Boden: laufen · rückwärts'],
          ['A / D', 'lenken (Flug) · drehen (Boden)'], ['Q / E', 'Flug: Standdrehung · Boden: seitwärts'],
          ['↑ / ↓', 'Flug: steigen · sinken'], ['Shift', 'Boden: rennen'],
          ['Leertaste', 'Flug: Boost (freieres Lenken, kein Kurvenwiderstand)'], ['Leertaste', 'Boden: Sprung'],
          ['A/D halten bei Tempo', 'Flug: die Haftung reißt — das Pad RUTSCHT und lehnt sich hinein'],
          ['X in der Kurve', 'Flug: Haftung sofort zurück (der Ausweg aus dem Drift)'],
          ['J', 'Flug: Pet hüpft'],
          ['Tab', 'Einstellungen'], ['Esc', 'Einstellungen schließen'],
          ['Ziehen', 'lenken (Flug) · umsehen (Boden)'], ['Rad / Pinch', 'Zoom bis POV'],
          ['Doppelklick auf Karte', 'Academy: Anflug (Auto-Pilot)'], ['R', 'Academy: Route abfliegen'],
          ['Tacho anklicken', 'Lektion suchen (Live-Suche über 31 Lektionen)'], ['Enter / Doppelklick', 'Suche: Treffer anfliegen'],
          ['Ziehen im Kartenfenster', 'Academy: die Live-Demo bedienen'], ['Steuern', 'bricht den Anflug ab'],
          ['Würfel unten rechts', 'drehen → Seite klicken → Sektion'],
        ] }] },

      { id: 'system', title: 'System', wide: true, hint: 'Selten gebraucht, deshalb unten.',
        controls: [
          { kind: 'text', label: 'Welt-Seed', get: () => S.worldSeed, set: (v) => { S.worldSeed = v || ctx.WORLD_SEED; ctx.applyWorld(true); } },
          { kind: 'button', label: 'Seed neu würfeln', onClick: () => { S.worldSeed = 'kfb-' + Math.random().toString(36).slice(2, 9); ctx.applyWorld(true); } },
          { kind: 'slider', label: 'Auflösung', min: 0.6, max: 2, step: 0.1, get: () => S.quality, set: (v) => {
            S.quality = v; ctx.renderer.setPixelRatio(v); ctx.resize();
          }, fmt: (v) => v.toFixed(1) + '×' },
          { kind: 'button', label: 'Alles zurücksetzen', onClick: () => {
            S.story = ctx.STORY; S.worldSeed = ctx.WORLD_SEED; ctx.applyWorld(true);
            ctx.flight.setParams({ SPD_MAX: 42 }); ctx.walk.setParams({ speed: 5.4 });
            ctx.heat.setParams({ unitMeters: 0.5 }); ctx.heat.reset(ctx.curMode());
            S.fxBlur = 1; ctx.lines.setEnabled(true); ctx.lines.setParams({ density: 1, opacity: 0.32, look: 'light' });
            ctx.trails.setActive(true); ctx.trails.setParams({ kmhOn: 20, width: 0.055 });
            ctx.petKin.setBarrelRoll(true); ctx.flight.setParams({ boostYawGain: 1.28 });
            S.bpm = 104; S.beatGain = 1; ctx.camRig.setZoom(9);
            S.danceMode = 'both'; S.blinkMode = 'both'; S.blinkGain = 1; S.groundCalm = 0.9;
            ctx.terrain.setFlow(0); S.shadowGain = 1;
            S.paletteId = 'story'; S.paletteSpread = true; S.rainbowSpeed = 0.055; S.rainbowSpread = 0.55;
            cp.brightMin = 0.52; cp.brightRange = 0.62; cp.satBase = 0.72; cp.satRange = 0.34; cp.topoMix = 0.6;
            ctx.terrain.setColorParams(cp); ctx.applyPalette(false);
            ctx.lighting.setEnv(1); ctx.lighting.setFill(0.55); ctx.lighting.setTint(S.storyMode.ink, 0.18);
            ctx.rig.setInk({ width: 6, wobble: 0.5, jitter: 4 });
            ctx.sky.setVariant('S'); ctx.sky.setWorldMix(0.4); ctx.sky.setExposure(1); ctx.sky.setSpiral(false);
            S.skyWorldMix = 0.4; S.skyExposure = 1; S.skySpiral = false;
            if (ctx.isWalk()) ctx.requestMode('fly', 'S.story');
          } },
        ] },
  ];
}
