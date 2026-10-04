// Card-Hex Ascent · UI/HUD owner (DOM overlay). Reads state; never writes game truth.
export class Hud {
  constructor(root) {
    this.root = root;
    root.innerHTML = `
      <div class="hud-top">
        <div class="hud-zone"><b id="hz-zone">Card 0 · Spawn</b><span id="hz-obj">Move with WASD · climb the Hex route</span></div>
        <div class="hud-stats"><span id="hz-hearts"></span><span id="hz-weapon">Blaster</span><span id="hz-coins">0</span><span id="hz-time">0:00</span><span id="hz-mode">Chill &amp; Fun</span></div>
      </div>
      <div class="hud-msg" id="hz-msg"></div>
      <div class="hud-cross" id="hz-cross"></div>
      <div class="hud-keys">WASD move · Shift sprint · Space jump (assist plans long/double jumps; Space in air = extra jump) · Q dodge · Click / F fire · E or right mouse aim · 1/2 weapon · Tab Chill/Game · M music · R restart</div>
      <div class="hud-panel" id="hz-start"><h1>Card-Hex Ascent</h1><p id="hz-inc"></p><p>Climb from Card 0 through the KayKit Hex islands, win the Card duels, finish on the last Card.</p><button id="hz-go">Click to play</button><p class="small" id="hz-load">loading…</p></div>
      <div class="hud-panel hidden" id="hz-result"><h1 id="hr-title">Ascent complete</h1><table id="hr-table"></table><button id="hz-again">Play again (R)</button></div>`;
    this.$ = id => root.querySelector('#' + id);
    this.msgT = 0;
  }
  loading(text) { this.$('hz-load').textContent = text; }
  ready(inc) { this.$('hz-inc').textContent = 'Increment ' + inc; this.$('hz-go').disabled = false; }
  hideStart() { this.$('hz-start').classList.add('hidden'); }
  message(text, sec = 2.2) { const m = this.$('hz-msg'); m.textContent = text; m.classList.add('on'); this.msgT = sec; }
  update(dt, s) {
    if (this.msgT > 0 && (this.msgT -= dt) <= 0) this.$('hz-msg').classList.remove('on');
    this.$('hz-zone').textContent = s.zoneLabel; this.$('hz-obj').textContent = s.objective;
    this.$('hz-hearts').textContent = '♥'.repeat(Math.max(0, s.hp)) + '♡'.repeat(Math.max(0, s.maxHp - s.hp));
    this.$('hz-weapon').textContent = s.weaponLabel + (s.weapons > 1 ? ' (1/2)' : '');
    this.$('hz-coins').textContent = '● ' + s.coins;
    const t = Math.floor(s.time); this.$('hz-time').textContent = Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
    this.$('hz-mode').textContent = s.mode === 'chill' ? 'Chill & Fun' : 'Game';
    const c = this.$('hz-cross'); c.classList.toggle('lock', !!s.locked); c.style.display = s.inEncounter ? 'block' : 'none';
  }
  result(rows, title) {
    this.$('hr-title').textContent = title;
    this.$('hr-table').innerHTML = rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
    this.$('hz-result').classList.remove('hidden');
  }
  hideResult() { this.$('hz-result').classList.add('hidden'); }
}
