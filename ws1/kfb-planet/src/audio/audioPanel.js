// WS-Audio R1 (V-598) · Ton-Panel (Host-DOM, kein HUD-Stil): ein Regler je Bus (Musik, SFX, Atmo, UI) + Gesamt + Ton aus, Titel der Jukebox.
// Erscheint nur in der vollen Fassung (lokaler Ton-Server), unten links als kleiner Knopf; Werte bleiben im Browser (localStorage).
const LABELS = [['master', 'Gesamt'], ['music', 'Musik'], ['sfx', 'Effekte'], ['atmo', 'Atmo'], ['ui', 'UI']]
export function mountAudioPanel(A) {
  const root = document.createElement('div'); root.id = 'kfb-audio-panel'
  root.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:50;font:12px/1.3 system-ui,sans-serif;color:#2b2118;user-select:none'
  const btn = document.createElement('button'); btn.type = 'button'; btn.title = 'Ton'; btn.textContent = '♪'
  btn.style.cssText = 'width:34px;height:34px;border-radius:17px;border:0;background:#f4e7cf;box-shadow:0 2px 6px #0004;font-size:17px;cursor:pointer'
  const box = document.createElement('div'); box.style.cssText = 'display:none;margin-bottom:8px;padding:10px 12px;border-radius:10px;background:#f4e7cfee;box-shadow:0 2px 10px #0005;width:210px'
  const v = A.volumes(), rows = LABELS.map(([k, label]) => {
    const row = document.createElement('label'); row.style.cssText = 'display:flex;align-items:center;gap:8px;margin:3px 0'
    const s = document.createElement('input'); s.type = 'range'; s.min = 0; s.max = 1; s.step = 0.01; s.value = v[k]; s.style.cssText = 'flex:1'
    s.addEventListener('input', () => A.setVolume(k, +s.value)); s.addEventListener('change', () => s.blur()) // Pfeiltasten gehören danach wieder dem Spiel
    const t = document.createElement('span'); t.textContent = label; t.style.cssText = 'width:52px'
    row.append(t, s); return row })
  const mute = document.createElement('label'); mute.style.cssText = 'display:flex;gap:6px;margin-top:6px'
  const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!v.muted; cb.addEventListener('change', () => { A.setVolume('muted', cb.checked); btn.style.opacity = cb.checked ? 0.5 : 1 })
  mute.append(cb, document.createTextNode('Ton aus'))
  const now = document.createElement('div'); now.style.cssText = 'margin-top:6px;opacity:.75;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'
  box.append(...rows, mute, now); root.append(box, btn); document.body.append(root)
  btn.addEventListener('click', () => { box.style.display = box.style.display === 'none' ? 'block' : 'none'; btn.blur() })
  const tick = setInterval(() => { const p = A.nowPlaying?.(); now.textContent = p ? (p.list === 'suno' ? '♫ Suno · ' : '♫ Cozy · ') + p.title : '' }, 1000)
  return { dispose() { clearInterval(tick); root.remove() } }
}
