import { chromium } from 'playwright'
const out = process.argv[2]
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900" font-family="Helvetica, Arial, sans-serif">
<rect width="1400" height="900" fill="#f6f1e7"/>
<text x="40" y="58" font-size="34" font-weight="700" fill="#2b2622">Kampfbühne R1 · Grundriss (Draufsicht)</text>
<text x="40" y="92" font-size="20" fill="#6b625a">runder ebener Platz 40 m · niedriger Gummiring · Aktionsachse Ost–West</text>
<g transform="translate(700,490)">
 <rect x="-680" y="-30" width="410" height="60" fill="#d9cdb8" stroke="#b3a48b" stroke-dasharray="8 6"/>
 <text x="-660" y="-42" font-size="18" fill="#6b625a">Anlauf-Bahn für den Wagen (30 m)</text>
 <circle r="280" fill="#cfd9b4" stroke="#7a8d4a" stroke-width="3"/>
 <circle r="280" fill="none" stroke="#3e6a83" stroke-width="14" stroke-dasharray="1650 110" transform="rotate(170)"/>
 <text x="0" y="-296" font-size="18" fill="#3e6a83" text-anchor="middle">Gummiring (Lücke für die Anlauf-Bahn)</text>
 <line x1="-280" y1="0" x2="280" y2="0" stroke="#a64670" stroke-width="3" stroke-dasharray="10 8"/>
 <text x="170" y="-12" font-size="17" fill="#a64670">Aktionsachse</text>
 <circle cx="-42" cy="0" r="18" fill="#e9c14a" stroke="#2b2622" stroke-width="2"/><text x="-42" y="7" font-size="18" font-weight="700" text-anchor="middle">A</text>
 <text x="-42" y="46" font-size="16" text-anchor="middle" fill="#2b2622">Angreifer (FB)</text>
 <circle cx="42" cy="0" r="30" fill="none" stroke="#6b4e7d" stroke-width="2" stroke-dasharray="4 4"/>
 <circle cx="42" cy="0" r="18" fill="#d97c3a" stroke="#2b2622" stroke-width="2"/><text x="42" y="7" font-size="18" font-weight="700" text-anchor="middle">Z</text>
 <text x="28" y="92" font-size="16" fill="#2b2622" text-anchor="end">Ziel · <tspan font-weight="700">oben</tspan> = Kamera senkrecht darüber</text>
 <g font-size="15" fill="#2b2622">
  <rect x="300" y="60" width="170" height="122" rx="10" fill="#fffaf0" stroke="#b3a48b"/>
  <text x="314" y="86" font-weight="700">Ziel-Slots</text>
  <text x="314" y="110">Plastik-Soldat</text><text x="314" y="130">Würfelmonster</text><text x="314" y="150">Slop</text><text x="314" y="170">weiße Übungspuppe</text>
  <rect x="-250" y="130" width="160" height="56" rx="10" fill="#fffaf0" stroke="#b3a48b"/><text x="-238" y="154" font-weight="700">Prop-Slot</text><text x="-238" y="174">Baum · Pilz · Pop-up</text>
 </g>
 <g font-size="16" font-weight="700" fill="#2b2622">
  <path d="M 42 0 L 140 -160" stroke="#6b4e7d" stroke-width="2"/><circle cx="140" cy="-160" r="12" fill="#6b4e7d"/><text x="158" y="-162">totale</text><text x="158" y="-142" font-weight="400" font-size="14">12 m, schräg von oben</text>
  <path d="M 42 0 L 42 140" stroke="#6b4e7d" stroke-width="2"/><circle cx="42" cy="140" r="12" fill="#6b4e7d"/><text x="60" y="146">seite</text><text x="60" y="164" font-weight="400" font-size="14">quer, 8 m, Augenhöhe</text>
  <path d="M 42 0 L 120 -60" stroke="#6b4e7d" stroke-width="2"/><circle cx="120" cy="-60" r="10" fill="#6b4e7d"/><text x="136" y="-62">dreiviertel</text>
  <path d="M 42 0 L 72 34" stroke="#6b4e7d" stroke-width="2"/><circle cx="72" cy="34" r="8" fill="#6b4e7d"/><text x="86" y="50">kontakt</text>
  <circle cx="-330" cy="0" r="12" fill="#3e6a83"/><text x="-380" y="56">fahrkamera</text><text x="-380" y="74" font-weight="400" font-size="14">hinter dem Wagen</text>
 </g>
</g>
<text x="40" y="870" font-size="17" fill="#6b625a">Licht: das eine Spiel-Rig, feste Tageszeit · jede Aufnahme gleichzeitig in zwei Ansichten (Haupt + Nah) plus Einzelbilder an den Rezept-Marken</text>
</svg>`
const br = await chromium.launch(), p = await br.newPage({ viewport: { width: 1400, height: 900 } })
await p.setContent('<html><body style="margin:0">' + svg + '</body></html>'); await p.screenshot({ path: out }); await br.close()
