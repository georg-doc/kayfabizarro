// node sheets_r2.cjs <svgdir> <variantsdir> <outdir>
const {chromium}=require('/Users/georgv.westphalen/Developer/kfb-npc-proof/node_modules/playwright-core');
const fs=require('fs'),path=require('path');
const [svgdir,vdir,out]=process.argv.slice(2);
const J=JSON.parse(fs.readFileSync(path.join(__dirname,'shapes.json')));
const rd=(dir,id)=>fs.readFileSync(path.join(dir,id+'.svg'),'utf8').replace(/<!--[\s\S]*?-->/,'');
const SKIN='#E4B53C';
const font=`font-family:'Avenir Next','Helvetica Neue',Arial,sans-serif;`;
const card=(dir,id,lab,bg,extra='')=>`<div style="display:inline-block;margin:10px;vertical-align:top">
 <div style="width:384px;height:192px;background:${bg};border-radius:22px;box-shadow:inset 0 -10px 22px rgba(80,50,0,.10);${extra}">
  ${rd(dir,id).replace('width="256" height="128"','width="384" height="192"')}</div>
 <div style="${font}font-size:19px;color:#3A2318;margin-top:6px"><b>${id}</b> <span style="color:#7a6450">· ${lab}</span></div></div>`;
const page=(body,w)=>`<html><body style="margin:0;background:#EFE8DC;width:${w}px">${body}</body></html>`;
const head=(t,s)=>`<div style="padding:22px 24px 6px;${font}"><div style="font-size:30px;font-weight:700;color:#3A2318">${t}</div><div style="font-size:17px;color:#7a6450;margin-top:4px">${s}</div></div>`;
const sec=t=>`<div style="padding:10px 24px 0;${font};font-size:20px;font-weight:700;color:#3A2318">${t}</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const p=await b.newPage({viewport:{width:1250,height:800}});
 let h=head('KFB Mund-Set R2 · 12 Formen · Standard: lip=full, teeth=row','SVG 256×128 · Anker 128,64 · Schattierung nur über SVG-Verläufe (keine Filter) · Lippe = <code>--kfb-lip</code> (hier = Haut) · Hintergrund nur Vorschau')+'<div style="padding:0 14px">';
 J.order.forEach(id=>h+=card(svgdir,id,J.labels[id],SKIN));
 h+='</div>'+sec('Variante A: lip=thin, teeth=gap')+'<div style="padding:0 14px">';
 ['talk_open','wide','smile_open'].forEach(id=>h+=card(path.join(vdir,'lip-thin_teeth-gap'),id,J.labels[id],SKIN));
 h+='</div>'+sec('Variante B: lip=full, teeth=none · andere Haut + <code>--kfb-lip: #C9605E</code>')+'<div style="padding:0 14px 18px">';
 ['talk_open','round','smile_closed'].forEach(id=>h+=card(path.join(vdir,'lip-full_teeth-none'),id,J.labels[id],'#E9B98F','--kfb-lip:#C9605E;'));
 h+='</div>';
 await p.setContent(page(h,1250)); await p.waitForTimeout(150);
 await p.screenshot({path:path.join(out,'contact_sheet.png'),fullPage:true});
 const cyc=['rest_closed','talk_small','talk_open','round','talk_small','rest_closed'];
 let t=head('Sprech-Zyklus R2 · 6 Frames','rest_closed → talk_small → talk_open → round → talk_small → rest_closed · gleicher Anker, nur Form-Tausch')+'<div style="padding:0 14px 16px;white-space:nowrap">';
 cyc.forEach((id,i)=>t+=card(svgdir,id,`Frame ${i+1}`,SKIN));
 t+='</div>';
 await p.setViewportSize({width:2490,height:300});
 await p.setContent(page(t,2490)); await p.waitForTimeout(150);
 await p.screenshot({path:path.join(out,'talk_cycle.png'),fullPage:true});
 await b.close();
})();
