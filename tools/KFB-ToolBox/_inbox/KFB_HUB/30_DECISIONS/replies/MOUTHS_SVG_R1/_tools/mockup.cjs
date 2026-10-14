// node mockup.cjs <svgdir> <outdir> <fb_render.png>
const {chromium}=require('/Users/georgv.westphalen/Developer/kfb-npc-proof/node_modules/playwright-core');
const fs=require('fs'),path=require('path');
const [svgdir,out,fbpng]=process.argv.slice(2);
const svg=id=>fs.readFileSync(path.join(svgdir,id+'.svg'),'utf8').replace(/<!--[\s\S]*?-->/,'');
const SHAPES=['rest_closed','talk_open','wide','round','smile_open'];
const font=`font-family:'Avenir Next','Helvetica Neue',Arial,sans-serif;`;
const EXE=process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const TILE=520, Z=2.2;           // tile px, zoom of the source render
const UNIT_PER_MOUTHW=150;       // SVG units that correspond to the old mouth width

function pageHTML(title, sub, tiles){
  return `<html><body style="margin:0;background:#EFE8DC;width:${3*TILE+110}px;${font}">
  <div style="padding:22px 26px 8px;display:flex;align-items:baseline;gap:18px">
   <div style="font-size:30px;font-weight:700;color:#3A2318">${title}</div>
   <div style="font-size:18px;font-weight:700;color:#fff;background:#B5432F;padding:4px 12px;border-radius:8px">2D-Bildmontage, kein 3D</div></div>
  <div style="padding:0 26px 6px;font-size:15px;color:#7a6450">${sub}</div>
  <div style="padding:6px 16px 20px">${tiles}</div></body></html>`;
}
const tileWrap=(inner,label)=>`<div style="display:inline-block;margin:10px;vertical-align:top">
  <div style="position:relative;width:${TILE}px;height:${TILE}px;overflow:hidden;border-radius:16px;background:#d9d2c6">${inner}</div>
  <div style="font-size:19px;color:#3A2318;margin-top:6px">${label}</div></div>`;

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const p=await b.newPage({viewport:{width:3*TILE+110,height:900}});

 // ---------- 1) FrizzleBob: measure old mouth + inpaint skin ----------
 const src='data:image/png;base64,'+fs.readFileSync(fbpng).toString('base64');
 await p.setContent('<html><body></body></html>');
 const fb=await p.evaluate(async({src,Z,TILE})=>{
  const im=new Image(); im.src=src; await im.decode();
  const c=document.createElement('canvas'); c.width=452; c.height=478;   // panel "ToolBox P08 vorn"
  const x=c.getContext('2d'); x.drawImage(im,0,0);
  const D=x.getImageData(0,0,452,478); const d=D.data;
  const px=(i,j)=>{const k=(j*452+i)*4;return [d[k],d[k+1],d[k+2]];};
  // old mouth = pixels in the lower face that are NOT saturated yellow skin
  let x0=1e9,x1=-1,y0=1e9,y1=-1;
  for(let j=258;j<315;j++)for(let i=150;i<295;i++){const [r,g,bb]=px(i,j);
    const mx=Math.max(r,g,bb),mn=Math.min(r,g,bb); const sat=mx?(mx-mn)/mx:0;
    const hueYellow = r>=g && g>bb && (g-bb)>0.45*(r-bb);
    const reddish=r>1.6*g; if(!(hueYellow && sat>0.55) && !reddish){ if(i<x0)x0=i; if(i>x1)x1=i; if(j<y0)y0=j; if(j>y1)y1=j; } }
  const cx=(x0+x1)/2, cy=(y0+y1)/2, w=x1-x0, h=y1-y0;
  // inpaint: per column, lerp between rows just above/below an ellipse, feathered
  const rx=w/2+26, ry=h/2+13;
  const out=new ImageData(new Uint8ClampedArray(d),452,478); const o=out.data;
  const avg=(i,j)=>{let s=[0,0,0],n=0;for(let a=-6;a<=6;a++)for(let bq=-2;bq<=2;bq++){const q=px(Math.round(i+a),Math.round(j+bq));s[0]+=q[0];s[1]+=q[1];s[2]+=q[2];n++;}return s.map(v=>v/n);};
  for(let i=Math.floor(cx-rx-6);i<=Math.ceil(cx+rx+6);i++){
    const u=(i-cx)/(rx*1.24+1); if(Math.abs(u)>=1) continue;
    const half=(ry*1.24+1)*Math.sqrt(1-u*u); const ya=Math.abs(i-cx)<26?Math.max(cy-half,254):cy-half, yb=cy+half;
    const A=avg(i,ya), B=avg(i,yb);
    for(let j=Math.floor(ya);j<=Math.ceil(yb);j++){
      const e=Math.hypot((i-cx)/rx,(j-cy)/ry); // 1 at the inner ellipse
      const a=e<=1?1:Math.max(0,1-(e-1)/0.22); if(a<=0) continue;
      const t=(j-ya)/(yb-ya); const k=(j*452+i)*4;
      for(let ch=0;ch<3;ch++){const v=A[ch]*(1-t)+B[ch]*t; o[k+ch]=o[k+ch]*(1-a)+v*a;}
    }}
  // smooth the fill (kills column streaks): box blur inside the feathered ellipse
  const M=new Float32Array(452*478);
  for(let j=0;j<478;j++)for(let i=0;i<452;i++){const e=Math.hypot((i-cx)/rx,(j-cy)/ry);M[j*452+i]=e<=1?1:Math.max(0,1-(e-1)/0.22);}
  for(let pass=0;pass<3;pass++){const src2=new Uint8ClampedArray(o);
    for(let j=1;j<477;j++)for(let i=4;i<448;i++){const m=M[j*452+i]; if(m<=0) continue;
      for(let ch=0;ch<3;ch++){let s2=0,n=0;for(let a=-4;a<=4;a++)for(let bq=-1;bq<=1;bq++){s2+=src2[((j+bq)*452+i+a)*4+ch];n++;}
        const k=(j*452+i)*4+ch; o[k]=src2[k]*(1-m)+(s2/n)*m;}}}
  const origP=c.toDataURL("image/png"); x.putImageData(out,0,0);
  const clean=c.toDataURL('image/png');
  return {cx,cy,w,h,clean,orig:origP};
 },{src,Z,TILE});
 console.log('FB old mouth bbox centre',fb.cx,fb.cy,'w',fb.w,'h',fb.h);

 const fbScale = fb.w/UNIT_PER_MOUTHW;           // px per SVG unit at 1x
 const fbTile=(img,id,label)=>{
   const ox=TILE/2 - fb.cx*Z, oy=TILE/2 - (fb.cy-40)*Z;   // keep face centred, mouth slightly below centre
   let inner=`<img src="${img}" style="position:absolute;left:${ox}px;top:${oy}px;width:${452*Z}px;height:${478*Z}px">`;
   if(id){ const sw=256*fbScale*Z, sh=128*fbScale*Z;
     inner+=`<div style="position:absolute;left:${ox+fb.cx*Z-sw/2}px;top:${oy+fb.cy*Z-sh/2}px;width:${sw}px;height:${sh}px;--kfb-lip:transparent;filter:blur(.5px)">${svg(id).replace('width="256" height="128"',`width="${sw}" height="${sh}"`)}</div>`;}
   return tileWrap(inner,label);
 };
 let t=fbTile(fb.orig,null,'<b>Vorher</b> · aktueller Mund (Decal)');
 SHAPES.forEach(id=>t+=fbTile(fb.clean,id,`<b>${id}</b>`));
 await p.setContent(pageHTML('FrizzleBob · Mund-Set R1',
   `Quelle: ws1/r3f-frame · ws1/proofs/2026-10-14-fb-v240/fb_georg_pair_front_q_side.png, Panel „ToolBox P08 vorn“ (${Z}× vergrößert). Alter Mund per 2D-Retusche entfernt, SVG an Mundmitte (Anker 128,64) und Mundbreite (${fb.w}px ≙ ${UNIT_PER_MOUTHW} SVG-Einheiten) gesetzt. Lippe = Haut → --kfb-lip transparent.`,t));
 await p.waitForTimeout(200);
 await p.screenshot({path:path.join(out,'mockup_frizzlebob.png'),fullPage:true});

 // ---------- 2) Placeholder head (no unmasked KayKit render exists) ----------
 const head=(id)=>{
   const S=TILE; const mx=S/2, my=S*0.66; const sc=1.45; // px per SVG unit for the mouth
   let s=`<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" style="position:absolute;left:0;top:0">
   <defs>
    <radialGradient id="hd" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#F2C85A"/><stop offset=".55" stop-color="#E0AE38"/><stop offset="1" stop-color="#B9861F"/></radialGradient>
    <radialGradient id="ey" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#ECE8E0"/><stop offset="1" stop-color="#BDB6AA"/></radialGradient>
   </defs>
   <path d="M${S*0.5},${S*0.10} C${S*0.80},${S*0.09} ${S*0.88},${S*0.30} ${S*0.87},${S*0.52} C${S*0.86},${S*0.78} ${S*0.72},${S*0.92} ${S*0.50},${S*0.92} C${S*0.27},${S*0.92} ${S*0.135},${S*0.79} ${S*0.13},${S*0.53} C${S*0.125},${S*0.29} ${S*0.22},${S*0.11} ${S*0.5},${S*0.10} Z" fill="url(#hd)"/>
   <path d="M${S*0.29},${S*0.31} C${S*0.33},${S*0.27} ${S*0.41},${S*0.27} ${S*0.44},${S*0.31}" stroke="#5A3A1E" stroke-width="15" stroke-linecap="round" fill="none"/>
   <path d="M${S*0.57},${S*0.30} C${S*0.61},${S*0.265} ${S*0.69},${S*0.27} ${S*0.72},${S*0.315}" stroke="#5A3A1E" stroke-width="15" stroke-linecap="round" fill="none"/>
   <circle cx="${S*0.365}" cy="${S*0.43}" r="${S*0.075}" fill="url(#ey)"/><circle cx="${S*0.635}" cy="${S*0.43}" r="${S*0.075}" fill="url(#ey)"/>
   <circle cx="${S*0.375}" cy="${S*0.44}" r="${S*0.027}" fill="#141414"/><circle cx="${S*0.625}" cy="${S*0.44}" r="${S*0.027}" fill="#141414"/>
   <circle cx="${S*0.383}" cy="${S*0.432}" r="${S*0.007}" fill="#fff"/><circle cx="${S*0.633}" cy="${S*0.432}" r="${S*0.007}" fill="#fff"/>
   </svg>
   <div style="position:absolute;left:14px;top:12px;font-size:17px;font-weight:700;color:#fff;background:#6b5a48;padding:3px 10px;border-radius:7px">Platzhalter-Kopf</div>`;
   if(id){ const sw=256*sc, sh=128*sc;
     s+=`<div style="position:absolute;left:${mx-sw/2}px;top:${my-sh/2}px;width:${sw}px;height:${sh}px;--kfb-lip:transparent;filter:blur(.5px)">${svg(id).replace('width="256" height="128"',`width="${sw}" height="${sh}"`)}</div>`;}
   return s;
 };
 let t2=tileWrap(head(null),'<b>Vorher</b> · ohne Mund');
 SHAPES.forEach(id=>t2+=tileWrap(head(id),`<b>${id}</b>`));
 await p.setContent(pageHTML('KayKit-Slot · Platzhalter-Kopf · Mund-Set R1',
   'Kein Render eines unmaskierten KayKit-Medium mit KFB-Augen gefunden (main + ws1/r3f-frame; einziger KayKit-Gesichtsrender f1_front = Rogue mit Maske). Daher neutraler Ton-Kopf als Platzhalter – NICHT KayKit.',t2));
 await p.waitForTimeout(200);
 await p.screenshot({path:path.join(out,'mockup_kaykit.png'),fullPage:true});
 await b.close();
})();
