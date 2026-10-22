// Renders the organic transition sample DIRECTLY from the lab's src/clay/kfb-blend.ts (KFB_BLEND_GLSL, 1:1 Joyride) plus
// R2D's kfbLayer (three sizes, Georg 03.10.) in headless Chrome/WebGL. Nothing re-drawn by hand.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const LAB = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Island Worldbuilder Lab';
const require = createRequire(path.join(LAB, 'package.json')); const { chromium } = require('playwright-core');
const ts = fs.readFileSync(path.join(LAB, 'src/clay/kfb-blend.ts'), 'utf8');
const BLEND = ts.match(/KFB_BLEND_GLSL\s*=\s*\/\*\s*glsl\s*\*\/\s*`([\s\S]*?)`/)[1];
const r2d = fs.readFileSync('/Users/georgv.westphalen/Dropbox/CLAUDE/KFB World Core R2D v0 Insel/kfb-r2d-session-2026-10-03/KFB_R2D_v0/island.js', 'utf8');
const LAYER = r2d.match(/(float kfbLayer\(vec2 p, float cell, float w, out float rim\)\{[\s\S]*?return sel; \})/)[1];
const OUT = process.argv[2];
const cases = JSON.parse(process.argv[3]);   // [{name, base, alt, cell, w: 'ramp'|'band', a, b, units, W, H}]
const html = `<canvas id=c></canvas><script>
const BLEND=${JSON.stringify(BLEND)}, LAYER=${JSON.stringify(LAYER)};
window.render=(C)=>{const c=document.getElementById('c');c.width=C.W;c.height=C.H;const gl=c.getContext('webgl',{preserveDrawingBuffer:true});
const vs='attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0,1);}';
const fs='precision highp float;varying vec2 uv;uniform vec3 A,B;uniform float cell,a,b,units,aspect,mode;'+BLEND+LAYER+
'void main(){vec2 su=vec2(uv.x*units,uv.y*units/aspect);float x=su.x;float w=mode<0.5?smoothstep(a,b,x):(1.0-smoothstep(0.0,b-a,abs(x-a)));float r;float s=kfbLayer(su,cell,w,r);vec3 col=mix(A,B,s)*(1.0-0.12*r);gl_FragColor=vec4(col,1);}';
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o;};
const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
const U=(n)=>gl.getUniformLocation(pr,n);gl.uniform3fv(U('A'),C.base);gl.uniform3fv(U('B'),C.alt);gl.uniform1f(U('cell'),C.cell);gl.uniform1f(U('a'),C.a);gl.uniform1f(U('b'),C.b);
gl.uniform1f(U('units'),C.units);gl.uniform1f(U('aspect'),C.W/C.H);gl.uniform1f(U('mode'),C.w==='band'?1:0);gl.viewport(0,0,C.W,C.H);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);return c.toDataURL('image/png');};
</script>`;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
const page = await browser.newPage(); await page.setContent(html);
for (const C of cases) { const url = await page.evaluate((C) => window.render(C), C); fs.writeFileSync(path.join(OUT, C.name + '.png'), Buffer.from(url.split(',')[1], 'base64')); console.log('wrote', C.name); }
await browser.close();
