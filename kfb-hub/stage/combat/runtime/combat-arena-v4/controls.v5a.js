import {ACTIONS,MAX_EQUIPMENT_SLOTS} from './actions.v5a.js';

export function controlsMarkup(){
  const controls=ACTIONS.map(a=>a.button
    ? `<button type="button" data-action="${a.id}" ${a.id==='slam'?'data-slam':''} title="${a.hint||a.label}"><kbd>${a.key}</kbd><span>${a.label}</span></button>`
    : `<span class="v5-control" title="${a.hint||a.label}"><kbd>${a.key}</kbd><span>${a.label}</span></span>`).join('');
  return `<style>
  .v4-tools{display:flex;flex-direction:column;align-items:stretch!important;gap:7px!important;pointer-events:none}
  .v5-loadout{pointer-events:auto;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .v5-slot{box-sizing:border-box;min-width:56px;min-height:44px;display:flex;align-items:center;justify-content:center;padding:7px 10px;border:2px solid #1f1a14;border-radius:6px;background:#1f1a14e8;color:#b9ad92;font-size:14px}
  .v5-slot.active{background:#b8361f;color:#fff6e4;box-shadow:3px 3px #1f1a14;font-weight:700;gap:8px}
  .v5-slot.empty{border-style:dashed;min-width:44px;opacity:.72}
  .v5-loadout small{background:#1f1a14dd;padding:7px 10px;border-radius:5px;font-size:13px;line-height:1.35}
  .v5-strip{display:flex;gap:5px;flex-wrap:wrap;align-items:stretch;background:#1f1a14e8;padding:7px;border:1px solid #6a5c42;border-radius:8px;pointer-events:auto}
  .v5-strip button,.v5-control{display:flex;align-items:center;gap:6px!important;font-size:14px!important;line-height:1.2;min-height:40px;box-sizing:border-box}
  .v5-control{padding:7px 9px;color:#fff3d4;border:1px solid #61543f;border-radius:4px}
  .v5-strip button{padding:7px 10px!important;box-shadow:none!important}
  .v5-strip kbd{font:700 12px/1.1 system-ui,sans-serif;white-space:nowrap;padding:4px 5px;border:1px solid currentColor;border-radius:3px}
  .v5-strip [data-slam]{min-width:0!important;background:#e9c14a}
  .v5-options{display:flex;gap:5px;margin-left:auto}
  .v5-strip button:disabled{opacity:.48}
  .v5-legend{pointer-events:auto;position:absolute;bottom:100%;right:0;max-width:min(430px,90vw);max-height:min(65vh,420px);overflow:auto;margin-bottom:8px;padding:15px;border:2px solid #1f1a14;border-radius:8px;background:#f3ead3;color:#1f1a14;box-shadow:4px 4px #1f1a14;font-size:14px;line-height:1.6}
  .v5-legend[hidden]{display:none}.v5-legend p{margin:6px 0}.v5-legend strong{color:#9e2d1b}
  @media(max-width:900px){.v5-control{display:none}.v5-loadout small{display:none}.v5-strip{gap:4px}.v5-options{margin-left:0}.v5-strip button{font-size:13px!important}.v5-slot{min-height:36px}}
  </style>
  <div class="v5-loadout" role="group" aria-label="Ausrüstung · maximal sechs Plätze">
    <span class="v5-slot active" aria-label="Aktiv: Würfel-Gun"><span aria-hidden="true">⚄</span> Würfel-Gun</span>
    ${Array.from({length:MAX_EQUIPMENT_SLOTS-1},(_,i)=>`<span class="v5-slot empty" aria-label="Ausrüstungsplatz ${i+2} frei">—</span>`).join('')}
    <small>Trank & Bomben: beim Aufsammeln aktiv</small>
  </div>
  <div class="v5-strip" role="group" aria-label="Spielsteuerung">
    ${controls}
    <div class="v5-options"><button type="button" data-chill aria-pressed="true" title="Chill: kein Game Over. Action: HP und Tinte entscheiden.">Chill ☀</button><button type="button" data-sound aria-pressed="false">Ton aus</button><button type="button" data-help aria-expanded="false">Controls & Loot</button></div>
  </div>
  <div class="v5-legend" hidden>
    <strong>Deine Moves</strong>
    <p>W/S oder ↑/↓ laufen · A/D drehen · Q/E oder ←/→ seitwärts · Shift rennen · Space springen · F Slam · Esc Pause.</p>
    <p>Gegner oder Karte anklicken: ausrichten & schießen. Halten: weiterfeuern. Rechts ziehen: Kamera · Mausrad: Zoom.</p>
    <strong>Aufheben & los!</strong>
    <p>Grüner Trank: +20 HP<br>Wasserfarb-Bombe: Tinte weg & Treffer im Umkreis<br>Rauchbombe: Gegner im Umkreis 2,5 s benommen<br>Goldmünze: +1 Pop</p>
    <p>Alles schwebt knapp über dem Boden. Du kannst darüber springen – und auch nach Card clear weitersammeln.</p>
  </div>`;
}
