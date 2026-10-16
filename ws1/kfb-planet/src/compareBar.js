// Vergleichsleiste für Georgs Abnahme in der Vorschau (Georg 16.10.: „wüsste nicht, wie ich Look A oder B abnehmen soll“). Nur mit light=l1, kein Spiel-HUD
// (HUD R4 kommt von Claude Design): beschriftete Knöpfe statt URL-Schaltern. Tageszeit wechselt sofort (Licht-Schreiber liest lightState.tod je Bild),
// Look, Knet und Tonemapping setzen den Hash-Schalter und laden neu (Materialien und Renderer-Einstellung entstehen beim Start). Aktiver Knopf ist hervorgehoben,
// darunter ein Satz, worauf zu achten ist. Ausblenden mit nobar.
const GROUPS = [
  { key: 'look', label: 'Look', opts: [['a', 'A · J17'], ['b', 'B · warm']], hint: 'Look: Wirkt B wärmer und gemütlicher als A, ohne dass Karte, Augen und Münder schlechter lesbar werden?' },
  { key: 'tod', label: 'Tageszeit', opts: [['day', 'Tag'], ['gold', 'Gold'], ['night', 'Nacht']], live: true, hint: 'Tageszeit: Passt die Stimmung? Nachts sollen die Figuren im Licht gut lesbar bleiben.' },
  { key: 'clay', label: 'Knet', opts: [['0', 'aus'], ['1', 'GothGirl'], ['all', 'alle']], hint: 'Knet: Sehen die Figuren nach handgemachter Knete aus? Bei „alle“ trägt auch FrizzleBob Knet – so lassen oder nicht?' },
  { key: 'tm', label: 'Tonemapping', opts: [['aces', 'ACES'], ['none', 'ohne']], hint: 'Tonemapping: ACES ist weicher (wie J17), „ohne“ etwas heller und bunter. Was gefällt besser?' },
]
const TOD = { day: 1, gold: 0.5, night: 0 }

function current(hash) {
  const get = (re, d) => (re.exec(hash)?.[1] ?? d)
  return { look: get(/look=([ab])/, 'a'), tod: get(/tod=(day|gold|night)/, 'day'), clay: get(/clay=(1|all)/, '0'), tm: get(/tm=(none)/, 'aces') }
}
// Hash-Schalter setzen bzw. entfernen; Rest des Hashs bleibt
function withParam(hash, key, val) {
  const parts = hash.replace(/^#/, '').split(',').filter((p) => p && !p.startsWith(key + '='))
  const def = { look: null, tod: null, clay: '0', tm: 'aces' }[key]
  if (val !== def) parts.push(key + '=' + val)
  if (key === 'look' && !parts.some((p) => p.startsWith('look='))) parts.push('look=a')
  return '#' + parts.join(',')
}

export function mountCompareBar({ hash, lightState }) {
  if (typeof document === 'undefined' || /(^|[#,])nobar(,|$)/.test(hash)) return () => {}
  const cur = current(hash)
  const box = document.createElement('div'); box.id = 'kfb-compare'
  box.style.cssText = 'position:fixed;left:14px;top:12px;z-index:9001;display:flex;flex-direction:column;gap:6px;max-width:min(560px,calc(100vw - 28px));font:600 13px/1.2 system-ui,sans-serif'
  const hint = document.createElement('div'); hint.style.cssText = 'margin-top:2px;padding:6px 10px;border-radius:10px;background:rgba(40,28,16,.72);color:#ffe9b8;font-weight:400;font-size:13px;line-height:1.35'
  hint.textContent = 'Vergleichen: Knöpfe anklicken. ' + GROUPS[0].hint
  for (const g of GROUPS) {
    const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:6px;align-items:center;flex-wrap:wrap'
    const lab = document.createElement('span'); lab.textContent = g.label; lab.style.cssText = 'min-width:88px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.6)'; row.appendChild(lab)
    for (const [val, text] of g.opts) {
      const b = document.createElement('button'); b.textContent = text; b.dataset.group = g.key; b.dataset.val = val
      const on = cur[g.key] === val
      b.style.cssText = `padding:5px 11px;border:0;border-radius:10px;cursor:pointer;font:inherit;${on ? 'background:#ffd36a;color:#2a1d0c' : 'background:rgba(40,28,16,.72);color:#ffe9b8'}`
      b.onmouseenter = () => { hint.textContent = g.hint }
      b.onclick = () => {
        if (g.live) { lightState.tod = TOD[val]; cur.tod = val; history.replaceState(null, '', withParam(location.hash, g.key, val)) /* Hash mitführen, ohne neu zu laden */; row.querySelectorAll('button').forEach((x) => { const o = x.dataset.val === val; x.style.background = o ? '#ffd36a' : 'rgba(40,28,16,.72)'; x.style.color = o ? '#2a1d0c' : '#ffe9b8' }); hint.textContent = g.hint; return }
        location.hash = withParam(location.hash, g.key, val); location.reload()
      }
      row.appendChild(b)
    }
    box.appendChild(row)
  }
  box.appendChild(hint); document.body.appendChild(box)
  return () => box.remove()
}
