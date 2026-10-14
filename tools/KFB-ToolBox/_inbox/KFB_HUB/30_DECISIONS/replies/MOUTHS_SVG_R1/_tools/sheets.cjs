// node sheets.cjs <svgdir> <outdir>
const {chromium}=require('/Users/georgv.westphalen/Developer/kfb-npc-proof/node_modules/playwright-core');
const fs=require('fs'),path=require('path');
const [svgdir,out]=process.argv.slice(2);
const J=JSON.parse(fs.readFileSync(path.join(__dirname,'shapes.json')));
const svg=id=>fs.readFileSync(path.join(svgdir,id+'.svg'),'utf8').replace(/<!--[\s\S]*?-->/,'');
const SKIN='#E4B53C';
const font=`font-family:'Avenir Next','Helvetica Neue',Arial,sans-serif;`;
const card=(id,lab,bg,extra='')=>`<div style="display:inline-block;margin:10px;vertical-align:top">
 <div style="width:384px;height:192px;background:${bg};border-radius:22px;box-shadow:inset 0 -10px 22px rgba(80,50,0,.10);display:flex;align-items:center;justify-content:center;${extra}">
  <div style="width:384px;height:192px">${svg(id).replace('width="256" height="128"','width="384" height="192"')}</div></div>
 <div style="${font}font-size:19px;color:#3A2318;margin-top:6px"><b>${id}</b> <span style="color:#7a6450">· ${lab}</span></div></div>`;
const page=(body,w)=>`<html><body style="margin:0;background:#EFE8DC;width:${w}px">${body}</body></html>`;
(async()=>{
 const b=await chromium.launch({executablePath:process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const p=await b.newPage({viewport:{width:1250,height:800},deviceScaleFactor:1});
 // contact sheet
 let h=`<div style="padding:22px 24px 6px;${font}"><div style="font-size:30px;font-weight:700;color:#3A2318">KFB Mund-Set R1 · 12 Formen</div>
 <div style="font-size:17px;color:#7a6450;margin-top:4px">SVG 256×128 · Anker Mundmitte 128,64 · Lippe = <code>--kfb-lip</code> (hier = Haut, daher unsichtbar) · Hintergrund nur Vorschau</div></div><div style="padding:0 14px">`;
 J.order.forEach(id=>h+=card(id,J.labels[id],SKIN));
 h+=`</div><div style="padding:8px 24px 0;${font};font-size:20px;font-weight:700;color:#3A2318">Tint-Probe: andere Haut + <code>--kfb-lip: #C9605E</code></div><div style="padding:0 14px 18px">`;
 ['talk_open','round','smile_closed'].forEach(id=>h+=card(id,J.labels[id],'#E9B98F','--kfb-lip:#C9605E;'));
 h+='</div>';
 await p.setContent(page(h,1250)); await p.waitForTimeout(150);
 await p.screenshot({path:path.join(out,'contact_sheet.png'),fullPage:true});
 // talk cycle
 const cyc=['rest_closed','talk_small','talk_open','round','talk_small','rest_closed'];
 let t=`<div style="padding:20px 24px 4px;${font}"><div style="font-size:28px;font-weight:700;color:#3A2318">Sprech-Zyklus · 6 Frames</div>
 <div style="font-size:16px;color:#7a6450">rest_closed → talk_small → talk_open → round → talk_small → rest_closed · gleicher Anker, nur Form-Tausch</div></div><div style="padding:0 14px 16px;white-space:nowrap">`;
 cyc.forEach((id,i)=>t+=card(id,`Frame ${i+1}`,SKIN));
 t+='</div>';
 await p.setViewportSize({width:2490,height:300});
 await p.setContent(page(t,2490)); await p.waitForTimeout(150);
 await p.screenshot({path:path.join(out,'talk_cycle.png'),fullPage:true});
 await b.close();
})();
