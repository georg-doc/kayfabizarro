// node bake.cjs <svgdir> <pngdir> [lipColour|transparent] -> 512x256 transparent PNG per SVG
const {chromium}=require('/Users/georgv.westphalen/Developer/kfb-npc-proof/node_modules/playwright-core');const fs=require('fs'),path=require('path');
(async()=>{const [sd,od,lip]=process.argv.slice(2);fs.mkdirSync(od,{recursive:true});
const b=await chromium.launch({executablePath:process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:512,height:256}});
for(const f of fs.readdirSync(sd).filter(x=>x.endsWith('.svg'))){
 const s=fs.readFileSync(path.join(sd,f),'utf8').replace('width="256" height="128"','width="512" height="256"');
 await p.setContent(`<html><body style="margin:0;background:transparent"><div style="${lip?"--kfb-lip:"+lip:""}">${s}</div></body></html>`);await p.waitForTimeout(50);
 await p.screenshot({path:path.join(od,f.replace('.svg','.png')),omitBackground:true});}
await b.close();})();
