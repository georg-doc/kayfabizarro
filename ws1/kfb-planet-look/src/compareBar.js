// Vergleichsleiste für Georgs Abnahme in der Vorschau (Georg 16.10.: „wüsste nicht, wie ich Look A oder B abnehmen soll“). Nur mit light=l1, kein Spiel-HUD.
// V-383 (Georg 17.10.): nichts über dem Motiv. Die Leiste sitzt eingeklappt als kleiner Reiter am unteren linken Rand; aufgeklappt liegt sie als
// schmales Band unten am Bildrand (Hinweistext darin, nie über Karte oder Figuren). „Sauberes Bild“ (Knopf oder Taste H, über den Host-Router)
// blendet alle Bedien-Elemente aus (Leiste, Kamera-Marken, Vorschau-Kennzeichnung, Info-Symbol); H holt sie zurück.
// Tageszeit wechselt sofort (das Rig liest lightState.tod je Bild); Look, Knet und Tonemapping setzen den Hash-Schalter und laden neu.
const GROUPS = [
  { key: 'lset', label: 'Stimmung', opts: [['mesa', 'Mesa · Krazy Kat'], ['cozy', 'Gemütlich'], ['r2', 'J17']], hint: 'Stimmung: Mesa = warme Sonne, violette Schatten, Türkis-Himmel wie die Krazy-Kat-Sonntagsseiten. Gemütlich und J17 zum Vergleich.' },
  { key: 'world', label: 'Farbwelt', opts: [['canyon', 'A · Canyon'], ['bucht', 'B · Bikini-Bucht'], ['otown', 'C · O-Town']], hint: 'Farbwelt: Bühnenpalette aus den drei Joyride-Welten, voll nach Rollen umgefärbt. Welche passt am besten?' },
  { key: 'tod', label: 'Tageszeit', opts: [['day', 'Tag'], ['gold', 'Gold'], ['night', 'Nacht']], live: true, hint: 'Tageszeit: Gold mit tiefer warmer Sonne, Nacht mit Licht-Inseln. Bleiben Gesichter lesbar?' },
  { key: 'tm', label: 'Tonemapping', opts: [['aces', 'ACES'], ['neutral', 'Neutral'], ['agx', 'AgX'], ['none', 'ohne']], hint: 'Tonemapping: eine Kurve für alles (Figuren, Bühne, Karte). Welche wirkt am stimmigsten?' },
  { key: 'look', label: 'Himmel', opts: [['a', 'A · Palette'], ['b', 'B · warm getönt']], hint: 'Himmel: B tönt nur den Himmel wärmer, das Licht bleibt gleich.' },
  { key: 'clay', label: 'Knet', opts: [['0', 'aus'], ['1', 'GothGirl'], ['all', 'alle']], hint: 'Knet: handgemacht, ohne hellen Saum an den Figuren?' },
]
const TOD = { day: 1, gold: 0.5, night: 0 }
const DEF = { tod: null, tm: 'aces', look: 'b', clay: 'all', lset: 'mesa', world: 'canyon' }
const CLEAN_IDS = ['kfb-compare', 'kfb-cam-marks', 'kfb-preview-badge', 'kfb-info', 'kfb-m1-info', 'kfb-drive-label', 'kfb-figure-status', 'kfb-perf']

function current(hash) {
  const get = (re, d) => (re.exec(hash)?.[1] ?? d)
  return { look: get(/look=([ab])/, 'b'), tod: get(/tod=(day|gold|night)/, 'day'), clay: get(/clay=(0|1|all)/, 'all'), tm: get(/tm=(aces|neutral|agx|none)/, 'aces'), lset: get(/lset=(mesa|cozy|r2)/, 'mesa'), world: get(/world=(canyon|bucht|otown)/, 'canyon') }
}
function withParam(hash, key, val) {
  const parts = hash.replace(/^#/, '').split(',').filter((p) => p && !p.startsWith(key + '='))
  if (val !== DEF[key]) parts.push(key + '=' + val)
  return '#' + parts.join(',')
}
// Sauberes Bild: alle Bedien-Elemente aus bzw. wieder an (CSS-Regel am body, damit auch später eingehängte Elemente verschwinden)
export function toggleClean(force) {
  if (typeof document === 'undefined') return false
  let st = document.getElementById('kfb-clean-style')
  if (!st) { st = document.createElement('style'); st.id = 'kfb-clean-style'; st.textContent = CLEAN_IDS.map((id) => `body.kfb-clean #${id}`).join(',') + '{display:none!important}'; document.head.appendChild(st) }
  const on = force ?? !document.body.classList.contains('kfb-clean'); document.body.classList.toggle('kfb-clean', on); return on
}

export function mountCompareBar({ hash, lightState }) {
  if (typeof document === 'undefined' || /(^|[#,])nobar(,|$)/.test(hash)) return () => {}
  const cur = current(hash)
  const box = document.createElement('div'); box.id = 'kfb-compare'
  box.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:9001;font:600 12px/1.2 system-ui,sans-serif;max-width:calc(100vw - 20px)'
  const tab = document.createElement('button'); tab.textContent = 'Vergleich ▸'; tab.dataset.role = 'tab'
  tab.style.cssText = 'padding:5px 10px;border:0;border-radius:9px;cursor:pointer;font:inherit;background:rgba(40,28,16,.72);color:#ffe9b8'
  const panel = document.createElement('div'); panel.style.cssText = 'display:none;margin-top:6px;padding:8px 10px;border-radius:10px;background:rgba(28,20,12,.82);color:#ffe9b8;flex-direction:column;gap:5px'
  const hint = document.createElement('div'); hint.style.cssText = 'font-weight:400;line-height:1.35;max-width:520px'; hint.textContent = GROUPS[0].hint
  tab.onclick = () => { const open = panel.style.display === 'none'; panel.style.display = open ? 'flex' : 'none'; tab.textContent = open ? 'Vergleich ◂' : 'Vergleich ▸' }
  const btnCss = (on) => `padding:4px 9px;border:0;border-radius:8px;cursor:pointer;font:inherit;${on ? 'background:#ffd36a;color:#2a1d0c' : 'background:rgba(255,233,184,.14);color:#ffe9b8'}`
  for (const g of GROUPS) {
    const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:5px;align-items:center;flex-wrap:wrap'
    const lab = document.createElement('span'); lab.textContent = g.label; lab.style.cssText = 'min-width:84px'; row.appendChild(lab)
    for (const [val, text] of g.opts) {
      const b = document.createElement('button'); b.textContent = text; b.dataset.group = g.key; b.dataset.val = val; b.style.cssText = btnCss(cur[g.key] === val)
      b.onmouseenter = () => { hint.textContent = g.hint }
      b.onclick = () => {
        if (g.live) { lightState.tod = TOD[val]; cur.tod = val; history.replaceState(null, '', withParam(location.hash, g.key, val)); row.querySelectorAll('button').forEach((x) => { x.style.cssText = btnCss(x.dataset.val === val) }); hint.textContent = g.hint; return }
        location.hash = withParam(location.hash, g.key, val); location.reload()
      }
      row.appendChild(b)
    }
    panel.appendChild(row)
  }
  const clean = document.createElement('button'); clean.textContent = 'Sauberes Bild (H)'; clean.style.cssText = btnCss(false); clean.onclick = () => toggleClean(true)
  panel.append(hint, clean); box.append(tab, panel); document.body.appendChild(box)
  return () => { box.remove(); toggleClean(false) }
}
