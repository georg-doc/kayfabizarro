// HUD R5f (Georg „KFB HUD v4.zip“, WS0 18.10. freigegeben zur Planung) · Wirt im Spiel: die Bauteile aus vendor/hud/hud-r5/r5f-hud.js (byte-gleich) an den
// Plätzen der Tafel buildFrame R5f – Fluff-Leiste oben Mitte, Aktionsleiste unten Mitte, Rucksack-Taste unten links. Keine Spielmechanik im HUD: es zeigt
// nur (Zustände kommen aus dem Spiel). Ebene 1920 × 1080 (SIZES.desk) bzw. 390 × 693 (phone), auf das Fenster skaliert; nur die Bauteile nehmen Klicks an.
// Abweichung von der Tafel (begründet im Status): ohne Instrumente/Karte/Radio rechts oben (folgen mit Navigation), Knete-Fluff-Flug ins Fach ohne Start-
// punkt im Bild (Kügelchen springen im Fach ein, wie fl.land).
// Rucksack (C3b, V-434): R5f bagOverlay mit den aufgehobenen Fundsachen; R5f hat in der Detailansicht kein Wegwerfen, deshalb hängt der Wirt dort eine Taste
// „Wegwerfen“ an (gleiche Lack-Taste, Abweichung im Status begründet). onThrow(item) gibt das Stück an das Spiel zurück.
// api (über onApi): land(kindIndex, n) · setWeapon(w) · setCtx(c|null) · setTarget(bool) · counts() · addItem(it) · items() · openBag() · closeBag()
// Kampf R1 (Georg 22.10.): Waffen liegen als Gegenstände im Rucksack, dort aktiv setzbar. setWeapons(list) legt sie vorn in den Rucksack ({ wid, id, n, k, icon,
// note, shot? }), setActiveWeapon(wid|null) markiert die aktive; onEquip(wid|null) meldet die Auswahl ans Spiel. R5f kennt je Familie nur eine Waffe (Pistole und
// Blaster sind beide „blaster“): deshalb setzt der Wirt in der Detailansicht eine eigene Taste „Ausrüsten“ bzw. „Ablegen“ (wie „Wegwerfen“) und ein
// Häkchen am aktiven Fach; die Aktionsleiste zeigt die Familie (setWeapon). Waffen haben kein Wegwerfen; items() bleibt die Liste der Fundsachen.
import { useEffect } from 'react'
import * as H from './vendor/hud/hud-r5/r5f-hud.js'
import * as TH from './vendor/hud/hud-r4/r4-theme.js'
import { FONT_HREF } from './vendor/hud/hud-r5/r5-hud.js'

export default function HudR5f({ counts = [0, 0, 0, 0, 0, 0], weapon = 'fist', mode = 'walk', world = 'otown', onApi = null, onCtx = null, onInteract = null, onThrow = null, onEquip = null, hide = false }) {
  useEffect(() => {
    if (!document.querySelector('link[data-kfb-fredoka]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT_HREF; l.dataset.kfbFredoka = '1'; document.head.appendChild(l) }
    const phone = window.innerWidth < 760, Z = phone ? H.SIZES.phone : H.SIZES.desk, T = TH.hudTheme(TH.stagePalette(world), 'A')
    const root = document.createElement('div'); root.id = 'kfb-hud-r5f'
    root.style.cssText = `position:fixed;left:0;top:0;width:${Z.W}px;height:${Z.H}px;transform-origin:0 0;pointer-events:none;z-index:8990;font-family:Fredoka,system-ui,sans-serif`
    const fit = () => { const k = Math.min(window.innerWidth / Z.W, window.innerHeight / Z.H); root.style.transform = `scale(${k})`; root.style.left = '0px'; root.style.width = `${window.innerWidth / k}px`; root.style.height = `${window.innerHeight / k}px` }   // Ebene = Fenster (Bauteile skaliert): Leiste klebt unten, Fluff oben, Rucksack links unten – auch bei nicht-16:9 (Georg 20.10.: Leiste schwebte mittig)
    const place = (node, css) => { node.style.position = 'absolute'; node.style.pointerEvents = 'auto'; node.style.cssText += ';' + css; if (hide) node.style.display = 'none'; root.append(node); return node } // hide: Knet-HUD (V-656) zeigt Fluff, Leiste und Truhe selbst; Rucksack-Ansicht und api bleiben von hier
    const fl = H.fluffBar(T, Z, { counts, numbers: !phone })
    place(fl, phone ? `left:${Z.pad}px;top:${Z.pad}px` : `left:50%;top:${Z.pad}px;translate:-50% 0`)
    const bar = H.actionBar(T, Z, { weapon, mode, onCtx: (c) => onCtx?.(c), onInteract: () => onInteract?.() })
    place(bar, `left:50%;bottom:${Z.pad}px;translate:-50% 0`)
    const items = [], weapons = [], bagPos = `left:${Z.pad}px;bottom:${Z.pad + (Z.tray - Z.key) / 2}px`
    let bag = null, ov = null, activeW = null
    const drawBag = () => { const b = H.bagButton(Z, weapons.length + items.length, () => openBag()); if (bag) bag.replaceWith(b); bag = b; if (!bag.isConnected) place(bag, bagPos); else { bag.style.position = 'absolute'; bag.style.pointerEvents = 'auto'; bag.style.cssText += ';' + bagPos; if (hide) bag.style.display = 'none' } }
    const closeBag = () => { ov?.remove(); ov = null }
    const openBag = (sel = null) => {
      const all = [...weapons.map((w) => ({ ...w, fam: undefined, ctx: undefined })), ...items], NW = weapons.length
      closeBag(); if (!all.length) return
      if (sel == null) sel = items.length ? NW : 0 // ohne Angabe wie bisher die erste Fundsache (Waffen stehen vorn)
      const shots = Object.fromEntries(weapons.filter((w) => w.shot).map((w) => [w.id, w.shot]))
      ov = H.bagOverlay(T, Z, { items: all.slice(), shots, sel: Math.min(sel, all.length - 1), onClose: closeBag })
      ov.style.pointerEvents = 'auto'; ov.style.zIndex = 40; root.append(ov)
      let cur = Math.min(sel, all.length - 1)
      const cells = [...ov.querySelectorAll('[title]')].filter((c) => all.some((it) => it.n === c.title))
      cells.forEach((c, i) => c.addEventListener('click', () => { cur = i; setTimeout(addRows, 0) }))
      // Häkchen am Fach der aktiven Waffe (Farbe der Familie wie R5f)
      cells.forEach((c, i) => { if (i < NW && weapons[i].wid === activeW) { const m = document.createElement('span'); m.dataset.kfbActive = '1'; m.style.cssText = `position:absolute;left:${phone ? 3 : 7}px;top:${phone ? 3 : 7}px;width:${phone ? 13 : 24}px;height:${phone ? 13 : 24}px;border-radius:50%;background:${H.FAM.blaster.c};display:grid;place-items:center`; m.append(H.ic('check', phone ? 9 : 16, '#FFF8E2')); c.append(m) } })
      const detail = () => [...ov.querySelectorAll('div')].find((d) => d.textContent.includes(all[cur]?.n || '\u0000') && d.querySelector('img,svg') && d.children.length >= 4)
      const row = (icon, label, title, onClick, data) => { const k = H.key(Math.round(Z.key * 0.9), icon, { color: '#E8C894', title, onClick })
        const lab = document.createElement('span'); lab.textContent = label; lab.style.cssText = `font:600 ${phone ? 13 : 21}px/1 Fredoka,sans-serif;color:#2B1A0B`
        const r = document.createElement('div'); r.dataset[data] = '1'; r.style.cssText = 'display:flex;align-items:center;gap:12px'; r.append(k, lab); return r }
      const addRows = () => { const det = detail(); if (!det) return
        if (cur < NW) { if (det.querySelector('[data-kfb-equip]')) return
          for (const d of det.children) if (d.textContent === 'Benutzen' || d.textContent === '3D-Modell folgt') d.style.display = 'none' // R5f-Platzhalter für Gegenstände ohne Familie
          for (const n of [...det.childNodes]) if (n.nodeType === 3 && n.textContent === 'null') n.remove() // R5f mit Bild (shots): replaceChildren(…, null) schreibt sonst „null“
          const w = weapons[cur], on = w.wid === activeW
          det.append(row(on ? 'close' : 'check', on ? 'Ablegen' : 'Ausrüsten', on ? 'Ablegen' : 'Ausrüsten', () => { activeW = on ? null : w.wid; onEquip?.(activeW); openBag(cur) }, 'kfbEquip')) }
        else { if (det.querySelector('[data-kfb-throw]')) return
          det.append(row('close', 'Wegwerfen', 'Wegwerfen', () => { const it = items.splice(cur - NW, 1)[0]; drawBag(); closeBag(); if (it) onThrow?.(it); if (weapons.length + items.length) openBag(Math.max(0, cur - 1)) }, 'kfbThrow')) } }
      addRows()
    }
    drawBag()
    document.body.appendChild(root); fit()
    const ro = () => fit(); window.addEventListener('resize', ro)
    onApi?.({ land: (i, n = 1) => fl.land(i, n), setWeapon: (w) => bar.setWeapon(w), setCtx: (c) => bar.setCtx(c), setTarget: (b) => bar.setTarget(b), counts: () => fl.counts(), el: root,
      addItem: (it) => { if (weapons.length + items.length >= 20) return false; items.push(it); drawBag(); return true }, items: () => items.slice(), openBag, closeBag, bagOpen: () => !!ov,
      setWeapons: (list) => { weapons.splice(0, weapons.length, ...(list || []).slice(0, 4)); drawBag(); if (ov) openBag() }, weapons: () => weapons.slice(), // Kampf R1
      setActiveWeapon: (wid) => { activeW = wid ?? null; if (ov) openBag() }, activeWeapon: () => activeW, weapon: () => bar.weapon(),
      throwItem: (i) => { const it = items.splice(i, 1)[0]; drawBag(); closeBag(); if (it) onThrow?.(it); return it || null } }) // Prüfungen: Wegwerfen ohne Klick
    return () => { window.removeEventListener('resize', ro); root.remove(); onApi?.(null) }
  }, []) // einmal aufbauen; Änderungen laufen über die api (keine React-Neuzeichnung des HUD)
  return null // lebt im R3F-Baum: kein DOM-Element zurückgeben (das HUD hängt selbst an document.body)
}
