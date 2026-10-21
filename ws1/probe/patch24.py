import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
rep('''<span style="font:500 11px/1 var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Rezept (kfb.terrain-recipe/1, Entwurf)</span>
        <textarea id="recipe" readonly aria-label="Rezept als JSON"></textarea>
        <div class="bar"><button type="button" class="btn" id="copy">Rezept kopieren</button><span class="msg" id="copyMsg" role="status"></span></div>''',
'''<span style="font:500 11px/1 var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Rezept (kfb.terrain-recipe/1) · einfügen und übernehmen, oder exportieren</span>
        <textarea id="recipe" spellcheck="false" aria-label="Rezept als JSON"></textarea>
        <div class="bar"><button type="button" class="btn" id="copy">Kopieren</button><button type="button" class="btn" id="rcApply">Rezept übernehmen</button><button type="button" class="btn" id="rcOpen">Datei öffnen …</button><button type="button" class="btn" id="rcSave">Als Datei speichern</button><input type="file" id="rcFile" accept=".json,application/json" hidden></div>
        <div class="bar"><input id="slotName" type="text" placeholder="Name für dieses Rezept" aria-label="Name für das Rezept" style="flex:1;min-width:8em"><button type="button" class="btn" id="slotSave">Merken</button><select id="slotSel" aria-label="Gemerkte Rezepte"></select><button type="button" class="btn" id="slotLoad">Laden</button><button type="button" class="btn" id="slotDel">Löschen</button></div>
        <div class="bar"><span class="msg" id="copyMsg" role="status"></span></div>''')
# recipe(): one sky object, dirty guard
rep("      sky: { v2: S.sky2, backdrops: S.kul, body: ['keiner', 'knet-mond', 'ringplanet'][S.moon] }, color: {","      color: {")
rep("      sky: { timeOfDay: S.tod, paintedClouds: S.painted, clayClouds: S.puffs, cloudCover: +S.cover.toFixed(2), contrails: S.trails },",
    "      sky: { timeOfDay: S.tod, paintedClouds: S.painted, clayClouds: S.puffs, cloudCover: +S.cover.toFixed(2), contrails: S.trails, v2: S.sky2, backdrops: S.kul, body: ['keiner', 'knet-mond', 'ringplanet'][S.moon] },")
rep("    $('recipe').value = JSON.stringify(r, null, 2);\n  }","    if (!RC.dirty) $('recipe').value = JSON.stringify(r, null, 2);\n    RC.last = r;\n  }")
rep("  function recipe() {","  const RC = { dirty: false, last: null };\n  function recipe() {")
rep("$('panel').addEventListener('input', (e) => { if (e.target.id === 'car') return;",
    "$('panel').addEventListener('input', (e) => { if (e.target.id === 'car') return; if (['recipe', 'slotName', 'slotSel', 'rcFile'].includes(e.target.id)) { if (e.target.id === 'recipe') RC.dirty = true; return }")
# import / export logic after copy handler
rep("""    setTimeout(() => { msg.textContent = '' }, 3000);
  });
""","""    setTimeout(() => { msg.textContent = '' }, 3000);
  });
  // Rezept → Regler (Gegenstück zu recipe()). Fehlende Angaben in älteren Rezepten: Gelände-Zusätze von später (Diorama, Etherington, Felsgruppen,
  // organische Flächen, Punkte) gelten als aus – so sieht ein altes Rezept aus wie damals; der neue Himmel bleibt an
  function recipeToUI(r) {
    const p = {}, f = r.form || {}, st = r.stylize || {}, c = r.color || {}, w = r.world || {}, sk = r.sky || {}, d = w.diorama || {};
    const num = (k, v) => { if (typeof v === 'number' && isFinite(v)) p[k] = v }, bool = (k, v, dflt) => { p[k] = typeof v === 'boolean' ? v : dflt }, idx = (k, arr, v) => { const i = arr.indexOf(v); if (i >= 0) p[k] = i };
    num('seed', r.seed); num('scale', f.featureSize); num('amp', f.height); num('oct', f.octaves); num('ridge', f.ridge); num('warp', f.warp); num('macro', f.calmHillyVariation);
    num('valley', st.flatValleys); p.plateau = typeof st.plateauAt === 'number' ? st.plateauAt : 1; num('steps', st.terraces); num('sharp', st.terraceEdge); num('water', st.waterLevel);
    bool('ether', st.etheringtonRound, false); bool('rockc', st.rockClusters, false);
    bool('org', c.organicFields, false); idx('fstage', ['B makro', 'C +übergänge', 'D +sprenkel', 'v3', 'v4 formlogik'], c.surfaceStage); p.kus = Math.max(0, ['aus', 'biom', 'konfetti', 'netz'].indexOf(c.polkaDot));
    if (c.palette && typeof c.palette === 'object') { const base = PALETTES[c.biome], keys = PAL_KEYS.filter((k) => /^#[0-9a-f]{6}$/i.test(c.palette[k] || ''))
      if (keys.length === PAL_KEYS.length && (!base || keys.some((k) => base[k].toLowerCase() !== c.palette[k].toLowerCase()))) { PALETTES.rezept = Object.assign({ name: 'Aus Rezept' }, c.palette, { name: 'Aus Rezept' }); for (const sel of ['palA', 'palB']) if (![...$(sel).options].some((o) => o.value === 'rezept')) { const o = document.createElement('option'); o.value = 'rezept'; o.textContent = 'Aus Rezept'; $(sel).appendChild(o) } p.palA = 'rezept' } }
    if (!p.palA && c.biome && PALETTES[c.biome]) p.palA = c.biome; if (c.biomeTravel && PALETTES[c.biomeTravel]) p.palB = c.biomeTravel; p.mix = c.biomeTravel != null;
    num('soft', c.bandSoftness); num('cliff', c.cliffSlopeDeg); bool('strata', c.strata, false); bool('toon', c.steppedLight, false);
    bool('rings', w.viewRings, false); bool('gridworld', w.gridWorld, false); num('gs', w.gridSpacing); idx('gshape', ['eckig', 'geschwungen', 'kreise'], w.gridShape); idx('gfill', ['linien', 'schachbrett', 'schachbrett+linien'], w.gridFill);
    if (w.checkerColors) p.gcol = w.checkerColors === 'bunt' ? 1 : 0; p.gtex = w.checkerTexture === 'edge3' ? 1 : 0; bool('clay', w.clayLook, false); if (w.testTempo) p.tempo = w.testTempo;
    bool('dio', d.on, false); bool('dpal', d.palette, true); bool('berm', d.plinthAndBerm, true); bool('ring', d.colourRingSpeckle, true); bool('stones', d.stoneBand, true); bool('props', d.props, true); bool('ground', d.grounding, true); bool('shadows', d.realShadows, true); bool('crumbs', d.contactCrumbs, true); bool('fgmass', d.foregroundMass, false); bool('edges', d.colouredEdges, false);
    if (sk.timeOfDay) p.tod = sk.timeOfDay; bool('painted', sk.paintedClouds, true); bool('puffs', sk.clayClouds, true); num('cover', sk.cloudCover); bool('trails', sk.contrails, true);
    bool('sky2', sk.v2, true); bool('kul', sk.backdrops, true); p.moon = Math.max(0, ['keiner', 'knet-mond', 'ringplanet'].indexOf(sk.body));
    return p }
  const say = (t) => { $('copyMsg').textContent = t; clearTimeout(say.t); say.t = setTimeout(() => { $('copyMsg').textContent = '' }, 4000) };
  function applyRecipeText(txt) {
    let r; try { r = JSON.parse(txt) } catch (e) { say('Kein gültiges JSON: ' + e.message); return false }
    if (!r || typeof r !== 'object' || !String(r.schema || '').startsWith('kfb.terrain-recipe/')) { say('Das ist kein Gelände-Rezept (schema „kfb.terrain-recipe/…“ fehlt).'); return false }
    setUI(recipeToUI(r)); markPreset(null); RC.dirty = false; update(); say('Rezept übernommen.'); return true }
  $('rcApply').addEventListener('click', () => applyRecipeText($('recipe').value));
  $('rcOpen').addEventListener('click', () => $('rcFile').click());
  $('rcFile').addEventListener('change', (e) => { const fl = e.target.files && e.target.files[0]; if (!fl) return; const rd = new FileReader(); rd.onload = () => { $('recipe').value = String(rd.result); applyRecipeText(String(rd.result)) }; rd.readAsText(fl); e.target.value = '' });
  $('rcSave').addEventListener('click', () => { const txt = JSON.stringify(RC.last, null, 2), a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/json' })); a.download = 'kfb-gelaende-rezept-' + new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-') + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500); say('Datei gespeichert (Download-Ordner).') });
  // Gemerkte Rezepte (nur in diesem Browser)
  const SLOT_KEY = 'kfb-gelaende-rezepte';
  const slots = () => { try { return JSON.parse(localStorage.getItem(SLOT_KEY) || '{}') } catch (e) { return {} } };
  const fillSlots = () => { const o = slots(), sel = $('slotSel'); sel.innerHTML = ''; const names = Object.keys(o).sort(); if (!names.length) { const op = document.createElement('option'); op.textContent = '– noch keine –'; op.value = ''; sel.appendChild(op) } for (const n of names) { const op = document.createElement('option'); op.value = n; op.textContent = n; sel.appendChild(op) } };
  $('slotSave').addEventListener('click', () => { const n = $('slotName').value.trim() || ('Rezept ' + new Date().toLocaleString('de-DE')); const o = slots(); o[n] = RC.last; try { localStorage.setItem(SLOT_KEY, JSON.stringify(o)); say('Gemerkt: ' + n) } catch (e) { say('Speichern im Browser nicht möglich.') } fillSlots(); $('slotSel').value = n });
  $('slotLoad').addEventListener('click', () => { const n = $('slotSel').value, r = slots()[n]; if (!r) return; $('recipe').value = JSON.stringify(r, null, 2); applyRecipeText($('recipe').value) });
  $('slotDel').addEventListener('click', () => { const n = $('slotSel').value; if (!n) return; const o = slots(); delete o[n]; try { localStorage.setItem(SLOT_KEY, JSON.stringify(o)) } catch (e) {} fillSlots(); say('Gelöscht: ' + n) });
  fillSlots();
""")
open(p,'w').write(s); print('ok')
