/* UI. Wenig davon, und nie über dem Spiel klebend: ein Kopfband, ein Aktor-Blatt, ein
   LAB-Schublade, ein Hilfe-Overlay. Alles einklappbar; die Welt bleibt dominant.
   Spielertexte sind Englisch (Briefing §13), Diagnosetexte ebenfalls — das LAB liest
   dieselbe Sprache wie die Beschriftungen. */
import * as THREE from 'three';

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

export class Hud {
  constructor(root, opts) {
    this.root = root;
    this.opts = opts;
    this.labels = new Map();
    this.build();
  }

  build() {
    const o = this.opts;

    /* --- Kopfband --- */
    const bar = el('div', 'bar');
    bar.appendChild(el('div', 'brand', 'KFB Free Roam <b>Platformer Hub</b> <span class="tag">POC v0</span>'));
    this.modeBtn = el('button', 'seg');
    this.modeBtn.innerHTML = '<span data-m="chill">Chill &amp; Fun</span><span data-m="game">KFB Game</span>';
    this.modeBtn.addEventListener('click', (e) => {
      const m = e.target.dataset.m;
      o.onMode(m || (o.getMode() === 'chill' ? 'game' : 'chill'));
    });
    bar.appendChild(this.modeBtn);
    this.score = el('div', 'score', '');
    bar.appendChild(this.score);
    const right = el('div', 'right');
    this.actorBtn = el('button', 'btn', 'Characters');
    this.labBtn = el('button', 'btn', 'Motion Lab');
    this.helpBtn = el('button', 'btn ghost', 'Controls');
    right.append(this.actorBtn, this.labBtn, this.helpBtn);
    bar.appendChild(right);
    this.root.appendChild(bar);

    /* --- Aktor-Blatt --- */
    this.actorPanel = el('div', 'panel actors hidden');
    this.actorPanel.appendChild(el('h3', null, 'Characters <em>lazy-loaded, one at a time</em>'));
    this.actorList = el('div', 'list');
    this.actorPanel.appendChild(this.actorList);
    this.root.appendChild(this.actorPanel);
    /* Beide Blätter hängen am gleichen Anker rechts oben — also schließen sie sich
       gegenseitig aus, statt sich zu verdecken. Stapeln wäre mehr UI über der Welt; und
       gemessen deckte das Lab die drei proof-Aktoren vollständig ab. */
    this.actorBtn.addEventListener('click', () => this.toggle(this.actorPanel, this.lab));

    /* --- LAB --- */
    this.lab = el('div', 'panel lab hidden');
    this.lab.appendChild(el('h3', null, 'Motion Lab <em>diagnostics, not the controller</em>'));
    this.labBody = el('div', 'labbody');
    this.lab.appendChild(this.labBody);
    const clipRow = el('div', 'row');
    clipRow.appendChild(el('label', null, 'Manual clip'));
    this.clipSel = el('select');
    this.clipSel.addEventListener('change', () => o.onManualClip(this.clipSel.value || null));
    clipRow.appendChild(this.clipSel);
    this.lab.appendChild(clipRow);
    const rateRow = el('div', 'row');
    rateRow.appendChild(el('label', null, 'Playback'));
    this.rate = el('input');
    this.rate.type = 'range'; this.rate.min = '0.2'; this.rate.max = '2'; this.rate.step = '0.05'; this.rate.value = '1';
    this.rate.addEventListener('input', () => o.onRate(parseFloat(this.rate.value)));
    rateRow.appendChild(this.rate);
    this.lab.appendChild(rateRow);
    const presetRow = el('div', 'row');
    presetRow.appendChild(el('label', null, 'Input preset'));
    this.preset = el('select');
    this.preset.innerHTML = '<option value="KFB_TRAVEL">KFB / Travel (A/D turn)</option><option value="PLATFORMER_CAMERA_RELATIVE">Platformer (camera-relative)</option>';
    this.preset.addEventListener('change', () => o.onPreset(this.preset.value));
    presetRow.appendChild(this.preset);
    this.lab.appendChild(presetRow);
    const assistRow = el('div', 'row');
    assistRow.appendChild(el('label', null, 'Chill assist'));
    this.assistSel = el('select');
    this.assistSel.innerHTML = '<option value="on">Assisted jump</option><option value="flow">Assisted + Flow Hop</option><option value="off">Off (manual)</option>';
    this.assistSel.addEventListener('change', () => o.onAssist(this.assistSel.value));
    assistRow.appendChild(this.assistSel);
    this.lab.appendChild(assistRow);
    this.root.appendChild(this.lab);
    this.labBtn.addEventListener('click', () => this.toggle(this.lab, this.actorPanel));

    /* --- Hilfe --- */
    this.help = el('div', 'overlay hidden');
    this.help.innerHTML = `<div class="card">
      <h3>Controls</h3>
      <table>
        <tr><td>W / S</td><td>forward / back</td></tr>
        <tr><td>A / D</td><td>turn (KFB preset) · strafe in camera-relative preset</td></tr>
        <tr><td>Q / E</td><td>strafe</td></tr>
        <tr><td>Shift</td><td>run</td></tr>
        <tr><td>Space</td><td>jump — assisted in Chill, manual in Game</td></tr>
        <tr><td>Ctrl / C</td><td>duck</td></tr>
        <tr><td>Drag</td><td>free orbit · wheel zooms</td></tr>
        <tr><td>F</td><td>recenter camera behind the character</td></tr>
        <tr><td>R</td><td>rescue to the last safe platform</td></tr>
        <tr><td>G</td><td>emote (wave)</td></tr>
        <tr><td>Enter</td><td>open the portal you are standing on</td></tr>
      </table>
      <p class="fine">Chill &amp; Fun highlights the next plausible platform and flies a computed arc — you still see anticipation, takeoff, airborne and landing. KFB Game uses the same world without a guaranteed landing.</p>
      <button class="btn">Close</button></div>`;
    this.help.querySelector('button').addEventListener('click', () => this.help.classList.add('hidden'));
    this.helpBtn.addEventListener('click', () => this.help.classList.toggle('hidden'));
    this.root.appendChild(this.help);

    /* --- Portal-Aufforderung --- */
    this.prompt = el('div', 'prompt hidden');
    this.root.appendChild(this.prompt);

    /* --- Weltbeschriftungen --- */
    this.labelLayer = el('div', 'labels');
    this.root.appendChild(this.labelLayer);

    /* --- Ladeanzeige --- */
    this.loading = el('div', 'loading', '<div><b>Loading the island</b><span id="loadnote">reading GitHub source refs…</span></div>');
    this.root.appendChild(this.loading);
  }

  /* Öffnet `panel` und schließt `other` — ein Blatt zur Zeit. */
  toggle(panel, other) {
    const open = panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !open);
    if (open) other.classList.add('hidden');
  }

  setLoading(text) {
    if (text === false) { this.loading.classList.add('gone'); return; }
    const n = this.loading.querySelector('#loadnote');
    if (n) n.textContent = text;
  }

  setMode(m) {
    for (const s of this.modeBtn.children) s.classList.toggle('on', s.dataset.m === m);
  }

  setActors(list, currentId, onPick) {
    this.actorList.innerHTML = '';
    let group = null;
    for (const a of list) {
      if (a.group !== group) { group = a.group; this.actorList.appendChild(el('div', 'group', group)); }
      const b = el('button', 'actor' + (a.id === currentId ? ' on' : ''), `${a.name}${a.proof ? '<i>proof</i>' : ''}`);
      b.addEventListener('click', () => onPick(a));
      this.actorList.appendChild(b);
    }
  }

  setClips(names, current) {
    this.clipSel.innerHTML = '<option value="">— follow gameplay state —</option>' +
      names.map((n) => `<option${n === current ? ' selected' : ''}>${n}</option>`).join('');
    this.clipSel.disabled = !names.length;
  }

  label(id, text, sub) {
    let l = this.labels.get(id);
    if (!l) { l = el('div', 'label'); this.labelLayer.appendChild(l); this.labels.set(id, l); }
    l.innerHTML = `<b>${text}</b>${sub ? `<span>${sub}</span>` : ''}`;
    return l;
  }

  placeLabels(world, camera, canvas) {
    const v = new THREE.Vector3();
    for (const p of world.platforms) {
      if (!p.portal) continue;
      const l = this.label(p.id, p.portal.label, p.portal.sub);
      v.set(p.center.x, p.top + 2.2 * world.cell, p.center.z).project(camera);
      const y = (-v.y * 0.5 + 0.5) * canvas.clientHeight;
      /* Beschriftungen, die unter dem Kopfband lägen, werden AUSGEBLENDET statt geklemmt —
         geklemmt stapeln sie sich dort und man liest Beschriftung auf Bedienung. */
      const vis = v.z < 1 && y > 70 && Math.abs(v.x) < 1.05;
      l.style.display = vis ? 'block' : 'none';
      if (!vis) continue;
      l.style.left = ((v.x * 0.5 + 0.5) * canvas.clientWidth) + 'px';
      l.style.top = y + 'px';
      l.style.opacity = String(Math.max(0.25, 1 - Math.max(0, Math.abs(v.x) - 0.6)));
    }
  }

  setPrompt(portal) {
    if (!portal) { this.prompt.classList.add('hidden'); return; }
    this.prompt.classList.remove('hidden');
    this.prompt.innerHTML = `<b>${portal.label}</b> <span>${portal.sub || ''}</span>
      <a href="${portal.url}" target="_blank" rel="noopener">Open ↗</a>
      <em>${portal.resolved ? 'published route' : 'candidate URL — web lead reconciles'}</em>
      <kbd>Enter</kbd>`;
  }

  setScore(s) { this.score.innerHTML = s; }

  setLab(rows) {
    this.labBody.innerHTML = rows.map(([k, v]) => `<div class="kv"><span>${k}</span><b>${v}</b></div>`).join('');
  }
}
