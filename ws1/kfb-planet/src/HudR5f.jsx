// HUD R5f (Georg „KFB HUD v4.zip“, WS0 18.10. freigegeben zur Planung) · Wirt im Spiel: die Bauteile aus vendor/hud/hud-r5/r5f-hud.js (byte-gleich) an den
// Plätzen der Tafel buildFrame R5f – Fluff-Leiste oben Mitte, Aktionsleiste unten Mitte, Rucksack-Taste unten links. Keine Spielmechanik im HUD: es zeigt
// nur (Zustände kommen aus dem Spiel). Ebene 1920 × 1080 (SIZES.desk) bzw. 390 × 693 (phone), auf das Fenster skaliert; nur die Bauteile nehmen Klicks an.
// Abweichung von der Tafel (begründet im Status): ohne Instrumente/Karte/Radio rechts oben (folgen mit Navigation), Knete-Fluff-Flug ins Fach ohne Start-
// punkt im Bild (Kügelchen springen im Fach ein, wie fl.land).
// Rucksack (C3b, V-434): R5f bagOverlay mit den aufgehobenen Fundsachen; R5f hat in der Detailansicht kein Wegwerfen, deshalb hängt der Wirt dort eine Taste
// „Wegwerfen“ an (gleiche Lack-Taste, Abweichung im Status begründet). onThrow(item) gibt das Stück an das Spiel zurück.
// api (über onApi): land(kindIndex, n) · setWeapon(w) · setCtx(c|null) · setTarget(bool) · counts() · addItem(it) · items() · openBag() · closeBag()
import { useEffect } from 'react'
import * as H from './vendor/hud/hud-r5/r5f-hud.js'
import * as TH from './vendor/hud/hud-r4/r4-theme.js'
import { FONT_HREF } from './vendor/hud/hud-r5/r5-hud.js'

export default function HudR5f({ counts = [0, 0, 0, 0, 0, 0], weapon = 'fist', mode = 'walk', world = 'otown', onApi = null, onCtx = null, onInteract = null, onThrow = null }) {
  useEffect(() => {
    if (!document.querySelector('link[data-kfb-fredoka]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT_HREF; l.dataset.kfbFredoka = '1'; document.head.appendChild(l) }
    const phone = window.innerWidth < 760, Z = phone ? H.SIZES.phone : H.SIZES.desk, T = TH.hudTheme(TH.stagePalette(world), 'A')
    const root = document.createElement('div'); root.id = 'kfb-hud-r5f'
    root.style.cssText = `position:fixed;left:0;top:0;width:${Z.W}px;height:${Z.H}px;transform-origin:0 0;pointer-events:none;z-index:8990;font-family:Fredoka,system-ui,sans-serif`
    const fit = () => { const k = Math.min(window.innerWidth / Z.W, window.innerHeight / Z.H); root.style.transform = `scale(${k})`; root.style.left = '0px'; root.style.width = `${window.innerWidth / k}px`; root.style.height = `${window.innerHeight / k}px` }   // Ebene = Fenster (Bauteile skaliert): Leiste klebt unten, Fluff oben, Rucksack links unten – auch bei nicht-16:9 (Georg 20.10.: Leiste schwebte mittig)
    const place = (node, css) => { node.style.position = 'absolute'; node.style.pointerEvents = 'auto'; node.style.cssText += ';' + css; root.append(node); return node }
    const fl = H.fluffBar(T, Z, { counts, numbers: !phone })
    place(fl, phone ? `left:${Z.pad}px;top:${Z.pad}px` : `left:50%;top:${Z.pad}px;translate:-50% 0`)
    const bar = H.actionBar(T, Z, { weapon, mode, onCtx: (c) => onCtx?.(c), onInteract: () => onInteract?.() })
    place(bar, `left:50%;bottom:${Z.pad}px;translate:-50% 0`)
    const items = [], bagPos = `left:${Z.pad}px;bottom:${Z.pad + (Z.tray - Z.key) / 2}px`
    let bag = null, ov = null
    const drawBag = () => { const b = H.bagButton(Z, items.length, () => openBag()); if (bag) bag.replaceWith(b); bag = b; if (!bag.isConnected) place(bag, bagPos); else { bag.style.position = 'absolute'; bag.style.pointerEvents = 'auto'; bag.style.cssText += ';' + bagPos } }
    const closeBag = () => { ov?.remove(); ov = null }
    const openBag = (sel = 0) => {
      closeBag(); if (!items.length) return
      ov = H.bagOverlay(T, Z, { items: items.slice(), sel: Math.min(sel, items.length - 1), onClose: closeBag })
      ov.style.pointerEvents = 'auto'; ov.style.zIndex = 40; root.append(ov)
      let cur = Math.min(sel, items.length - 1)
      const cells = [...ov.querySelectorAll('[title]')].filter((c) => items.some((it) => it.n === c.title))
      cells.forEach((c, i) => c.addEventListener('click', () => { cur = i; setTimeout(addThrow, 0) }))
      const addThrow = () => { const det = [...ov.querySelectorAll('div')].find((d) => d.textContent.includes(items[cur]?.n || '\u0000') && d.querySelector('img,svg') && d.children.length >= 4); if (!det || det.querySelector('[data-kfb-throw]')) return
        const k = H.key(Math.round(Z.key * 0.9), 'close', { color: '#E8C894', title: 'Wegwerfen', onClick: () => { const it = items.splice(cur, 1)[0]; drawBag(); closeBag(); if (it) onThrow?.(it); if (items.length) openBag(Math.max(0, cur - 1)) } })
        const lab = document.createElement('span'); lab.textContent = 'Wegwerfen'; lab.style.cssText = `font:600 ${phone ? 13 : 21}px/1 Fredoka,sans-serif;color:#2B1A0B`
        const row = document.createElement('div'); row.dataset.kfbThrow = '1'; row.style.cssText = 'display:flex;align-items:center;gap:12px'; row.append(k, lab); det.append(row) }
      addThrow()
    }
    drawBag()
    document.body.appendChild(root); fit()
    const ro = () => fit(); window.addEventListener('resize', ro)
    onApi?.({ land: (i, n = 1) => fl.land(i, n), setWeapon: (w) => bar.setWeapon(w), setCtx: (c) => bar.setCtx(c), setTarget: (b) => bar.setTarget(b), counts: () => fl.counts(), el: root,
      addItem: (it) => { if (items.length >= 20) return false; items.push(it); drawBag(); return true }, items: () => items.slice(), openBag, closeBag, bagOpen: () => !!ov,
      throwItem: (i) => { const it = items.splice(i, 1)[0]; drawBag(); closeBag(); if (it) onThrow?.(it); return it || null } }) // Prüfungen: Wegwerfen ohne Klick
    return () => { window.removeEventListener('resize', ro); root.remove(); onApi?.(null) }
  }, []) // einmal aufbauen; Änderungen laufen über die api (keine React-Neuzeichnung des HUD)
  return null // lebt im R3F-Baum: kein DOM-Element zurückgeben (das HUD hängt selbst an document.body)
}
