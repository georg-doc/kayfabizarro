/* anim-map.v1.js — DIE ZUORDNUNG (P33 Phase 2)
 *
 * Die Spielseite spricht in Zuständen (`Idle`, `SitVehicle`, `DriveBrake`), der Spender in
 * Dateinamen (`Idle_A`, `Sit_Chair_Idle`, — nichts). Diese Datei ist die Brücke, und sie hat
 * **eine Regel**: hier stehen MUSTER, keine Namen. Welcher Name das Muster erfüllt, entscheidet
 * das Zählwerk am geladenen GLB. Ein Zustand, für den kein gezählter Clip paßt, ist FEHLT —
 * auch wenn ich glaube, daß es den Clip geben müßte.
 *
 * Die sechs Stände des Briefings (§5):
 *   FOUND_EXACT      ein Clip tut genau das
 *   FOUND_ADAPTABLE  ein Clip tut etwas Ähnliches und braucht Sitzprofil/Handkorrektur
 *   COMPOSITE        mehrere Clips ergeben zusammen den Zustand
 *   PROCEDURAL       kein Clip — der Zustand wird gerechnet (Neigung, Blick), nicht abgespielt
 *   MISSING          es gibt nichts, und es wird auch nichts gerechnet
 *   DEFER            nicht in dieser Runde entscheiden
 */

export const SCHEMA = 'kfb.animation-map.v0';

/* `want` = der Stand, WENN das erste Muster trifft. `alt` = Zweitbesetzung (immer ADAPTABLE).
   `fallback` = der Stand, wenn nichts trifft (sonst MISSING). `parts` = COMPOSITE-Bausteine. */
export const STATES = [
  { id:'Idle',   group:'Zu Fuß', want:'FOUND_EXACT',     cand:[['General', /^Idle_A$/]], alt:[['General', /^Idle_B$/]] },
  { id:'Walk',   group:'Zu Fuß', want:'FOUND_EXACT',     cand:[['MovementBasic', /^Walking_A$/]], alt:[['MovementBasic', /^Walking_[BC]$/]] },
  { id:'Run',    group:'Zu Fuß', want:'FOUND_EXACT',     cand:[['MovementBasic', /^Running_A$/]], alt:[['MovementBasic', /^Running_B$/]] },
  { id:'Jump',   group:'Zu Fuß', want:'FOUND_EXACT',     cand:[['MovementBasic', /^Jump_Full_Long$/]], alt:[['MovementBasic', /^Jump_Full_Short$/]],
    parts:[['MovementBasic', /^Jump_Start$/], ['MovementBasic', /^Jump_Idle$/], ['MovementBasic', /^Jump_Land$/]],
    notes:'⚠ Georgs Befund am Bild: `Jump_Full_Short` liest sich als kleines Hüpfen, nicht als Sprung. Deshalb steht jetzt `Jump_Full_Long` vorn und das Hüpfen als Zweitbesetzung. Für einen steuerbaren Sprung gibt es zusätzlich Start · Schwebe · Landung einzeln.' },
  { id:'Wave',   group:'Zu Fuß', want:'FOUND_EXACT',     cand:[['Simulation', /^Waving$/]] },
  { id:'Cheer',  group:'Zu Fuß', want:'FOUND_EXACT',     cand:[['Simulation', /^Cheering$/]] },
  { id:'Interact', group:'Zu Fuß', want:'FOUND_EXACT',   cand:[['General', /^Interact$/]], alt:[['General', /^Use_Item$/], ['General', /^PickUp$/]] },
  { id:'Hit',    group:'Zu Fuß', want:'FOUND_EXACT',     cand:[['General', /^Hit_A$/]], alt:[['General', /^Hit_B$/]] },
  { id:'Recover', group:'Zu Fuß', want:'FOUND_ADAPTABLE', cand:[['Simulation', /^Lie_StandUp$/]], alt:[['Special', /^Skeletons_Awaken_Floor$/]],
    notes:'Aufstehen vom Boden gibt es — ein Aufrappeln nach einem Treffer nicht. Die Liegepose davor muß gesetzt werden, sonst springt der Anfang.' },
  { id:'Dance',  group:'Zu Fuß', cand:[], fallback:'MISSING',
    notes:'Kein Tanzclip im ganzen Spenderpaket. Nächstliegend wäre Cheering (Jubel) — das ist kein Tanz. Kandidat für eine eigene Aufnahme.' },

  { id:'Melee',  group:'Werkzeug & Spielzeug', want:'FOUND_EXACT', cand:[['CombatMelee', /^Melee_Unarmed_Attack_Punch_A$/]], alt:[['CombatMelee', /^Melee_Unarmed_Attack_Kick$/]] },
  { id:'ToyShoot', group:'Werkzeug & Spielzeug', want:'FOUND_ADAPTABLE', cand:[['CombatRanged', /^Ranged_1H_Shoot$/]],
    parts:[['CombatRanged', /^Ranged_1H_Aiming$/], ['CombatRanged', /^Ranged_1H_Reload$/]],
    notes:'Einhändig zielen · schießen · nachladen liegt vor. Das Spielzeug ist kein Revolver — die Hand hält es anders, das ist eine Handkorrektur, kein neuer Clip.' },
  { id:'Work',   group:'Werkzeug & Spielzeug', want:'FOUND_EXACT', cand:[['Tools', /^Working_A$/]], alt:[['Tools', /^Working_[BC]$/], ['Tools', /^Hammering$/], ['Tools', /^Digging$/]],
    notes:'Tools bringt 29 Clips — Hämmern, Graben, Sägen, Hacken je als Schlag und als Dauerform.' },

  { id:'SitVehicle', group:'Sitzen', want:'FOUND_ADAPTABLE', cand:[['Simulation', /^Sit_Chair_Idle$/]],
    notes:'Stuhlsitzen. Knie, Hände und Rückenwinkel gehören danach ins Sitzprofil — die Badewanne ist kein Stuhl.' },
  { id:'SitRelaxed', group:'Sitzen', want:'FOUND_ADAPTABLE', cand:[['Simulation', /^Sit_Floor_Idle$/]], alt:[['Simulation', /^Lie_Idle$/]] },
  { id:'EnterVehicle', group:'Sitzen', want:'FOUND_ADAPTABLE', cand:[['Simulation', /^Sit_Chair_Down$/]],
    notes:'Hinsetzen auf einen Stuhl. Einsteigen ist ein Bein-über-Kante-Weg — sichtbar anders. Erst mit Sitzprofil probieren, dann urteilen.' },
  { id:'ExitVehicle', group:'Sitzen', want:'FOUND_ADAPTABLE', cand:[['Simulation', /^Sit_Chair_StandUp$/]] },

  { id:'DriveIdle', group:'Fahren', want:'FOUND_ADAPTABLE', cand:[['Simulation', /^Sit_Chair_Idle$/]],
    notes:'Dieselbe Sitzhaltung wie SitVehicle, plus Handziele am Lenkrad.' },
  { id:'DriveSteerLeft',  group:'Fahren', cand:[], fallback:'PROCEDURAL', notes:'Oberkörper-Neigung aus dem Lenkwert. Presentation, keine Fahrzeugphysik (Briefing §13).' },
  { id:'DriveSteerRight', group:'Fahren', cand:[], fallback:'PROCEDURAL', notes:'Spiegelbild von DriveSteerLeft.' },
  { id:'DriveAccelerate', group:'Fahren', cand:[], fallback:'PROCEDURAL', notes:'Leichtes Zurücklegen. Gerechnet, nicht abgespielt.' },
  { id:'DriveBrake',      group:'Fahren', cand:[], fallback:'PROCEDURAL', notes:'Leichtes Vorlegen. Gerechnet, nicht abgespielt.' },
  { id:'DriveAirborneBrace', group:'Fahren', cand:[], fallback:'PROCEDURAL',
    notes:'Anspannen in der Luft. Jump_Idle ist die Referenz für die Haltung, aber stehend — sitzend muß es gerechnet werden.' },
  { id:'DriveLandingReact', group:'Fahren', want:'FOUND_ADAPTABLE', cand:[['MovementBasic', /^Jump_Land$/]], fallback:'PROCEDURAL',
    notes:'Landung liegt als stehender Clip vor. Sitzend ist davon nur der Ruck brauchbar — als kurzer Stoß auf die Sitzhaltung.' },
];

const findIn = (entries, set, re) => {
  const e = entries.find((q) => q.set === set);
  if (!e) return null;
  const c = (e.clips || []).find((q) => re.test(q.name));
  return c ? { set, ...c } : null;
};

/** Mißt die Zuordnung gegen ein gezähltes Inventar. Nichts wird behauptet, was nicht gefunden wurde. */
export function resolve(entries) {
  return STATES.map((st) => {
    let hit = null;
    for (const [set, re] of (st.cand || [])) { hit = findIn(entries, set, re); if (hit) break; }
    let status, clip = null, set = null;
    if (hit) { status = st.want || 'FOUND_ADAPTABLE'; clip = hit.name; set = hit.set; }
    else {
      let a = null;
      for (const [s2, re] of (st.alt || [])) { a = findIn(entries, s2, re); if (a) break; }
      if (a) { status = 'FOUND_ADAPTABLE'; clip = a.name; set = a.set; }
      else status = st.fallback || 'MISSING';
    }
    const alts = (st.alt || []).map(([s2, re]) => findIn(entries, s2, re)).filter(Boolean).map((q) => q.name).filter((n) => n !== clip);
    const parts = (st.parts || []).map(([s2, re]) => findIn(entries, s2, re)).filter(Boolean).map((q) => q.name);
    if (parts.length && status.startsWith('FOUND')) status = st.want === 'FOUND_EXACT' && parts.length ? status : status;
    return {
      state: st.id, group: st.group, status, clip, set,
      duration: hit ? hit.duration : null,
      loopCandidate: hit ? hit.loopCandidate : null,
      rootMotion: hit ? hit.rootMotion : null,
      alternatives: alts, parts, notes: st.notes || '',
    };
  });
}

export const TALLY = (rows) => rows.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});

export function mapJSON(rig, rows, meta) {
  const states = {};
  rows.forEach((r) => {
    states[r.state] = { status: r.status, clip: r.clip, set: r.set, duration: r.duration,
      loopCandidate: r.loopCandidate, rootMotion: r.rootMotion,
      alternatives: r.alternatives, parts: r.parts, notes: r.notes };
  });
  return {
    schema: SCHEMA, rigFamily: rig, measuredAt: new Date().toISOString(),
    donorRepo: (meta && meta.donorRepo) || null,
    inventory: 'AnimationInventory_' + rig.replace('Rig_', '') + '.json',
    rule: 'Jeder Clipname stammt aus dem gezählten Inventar. Ein Zustand ohne Treffer ist MISSING oder PROCEDURAL — nie ein geratener Name.',
    tally: TALLY(rows), states,
  };
}

const MARK = { FOUND_EXACT: 'use', FOUND_ADAPTABLE: 'seat profile / hand correction', COMPOSITE: 'compose', PROCEDURAL: 'compute', MISSING: 'future custom clip', DEFER: 'decide later' };

export function missingMD(rig, rows, meta) {
  const t = TALLY(rows), L = [];
  L.push('# MISSING_ANIMATIONS · ' + rig);
  L.push('');
  L.push('Gemessen am ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' gegen das gezählte Inventar.');
  L.push('Kein Clipname in dieser Datei ist geraten — was nicht im Inventar steht, steht hier als FEHLT.');
  L.push('');
  L.push(Object.keys(t).sort().map((k) => '**' + k + '** ' + t[k]).join(' · '));
  L.push('');
  L.push('| KFB-Zustand | Clip beim Spender | Stand | Was zu tun ist |');
  L.push('|---|---|---|---|');
  rows.forEach((r) => L.push('| ' + r.state + ' | ' + (r.clip ? '`' + r.clip + '`' : '—') + ' | ' + r.status + ' | ' + (MARK[r.status] || '') + ' |'));
  L.push('');
  L.push('## Wirklich fehlend');
  L.push('');
  const miss = rows.filter((r) => r.status === 'MISSING');
  if (!miss.length) L.push('Keiner der ' + rows.length + ' Zustände ist ohne Antwort.');
  else miss.forEach((r) => L.push('- **' + r.state + '** — ' + (r.notes || 'kein passender Clip im Spenderpaket.')));
  L.push('');
  L.push('## Gerechnet statt abgespielt');
  L.push('');
  rows.filter((r) => r.status === 'PROCEDURAL').forEach((r) => L.push('- **' + r.state + '** — ' + r.notes));
  L.push('');
  L.push('## Anmerkungen zu den anpassbaren Zuständen');
  L.push('');
  rows.filter((r) => r.status === 'FOUND_ADAPTABLE' && r.notes).forEach((r) => L.push('- **' + r.state + '** (`' + r.clip + '`) — ' + r.notes));
  return L.join('\n');
}

/* Die acht Knöpfe in der unteren Leiste sprechen eine ältere Sprache als das Briefing (sie kommt
   von den Cube-Pets: `celebrate`, `eat`, `react-positive`). Hier steht die Übersetzung — an EINER
   Stelle, damit die Leiste nicht ihre eigene Zuordnung hält.
   ⚠ Zwei Knöpfe versprechen mehr, als der Spender hat: »Dance« spielt **Cheering** (Jubel), weil es
   keinen Tanzclip gibt, und »Eat« spielt **Interact**. Das steht als Hinweis am Bildschirm, nicht
   nur hier — ein Knopf, der still etwas anderes tut, ist eine Lüge mit Rahmen. */
export const BAR_TO_STATE = {
  idle: 'Idle', enter: 'Walk', run: 'Run', eat: 'Interact',
  celebrate: 'Cheer', 'react-positive': 'Wave', 'react-negative': 'Hit',
};
export const BAR_NOTE = {
  celebrate: 'Dance fehlt im Spenderpaket — das ist Cheering (Jubel).',
  eat: 'Essen gibt es nicht — das ist Interact.',
};
