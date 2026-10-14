// usage: node crop.cjs in.png out.png x y w h [scale]
const {chromium}=require('/Users/georgv.westphalen/Developer/kfb-npc-proof/node_modules/playwright-core');
const fs=require('fs');
(async()=>{const [i,o,x,y,w,h,s]=process.argv.slice(2);const sc=+(s||1);
const b=await chromium.launch({executablePath:process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:Math.round(w*sc),height:Math.round(h*sc)}});
const d='data:image/png;base64,'+fs.readFileSync(i).toString('base64');
await p.setContent(`<body style="margin:0;overflow:hidden"><div style="width:${w*sc}px;height:${h*sc}px;overflow:hidden;position:relative"><img src="${d}" style="position:absolute;left:${-x*sc}px;top:${-y*sc}px;transform-origin:0 0;transform:scale(${sc});image-rendering:auto"></div></body>`);
await p.waitForTimeout(100);await p.screenshot({path:o});await b.close();})();
