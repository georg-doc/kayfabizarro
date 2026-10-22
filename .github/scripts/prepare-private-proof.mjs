// Prepare a disposable browser-QA copy; never changes or publishes the source Site.
import { cp, mkdir, readFile, writeFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';

const source = path.resolve(process.argv[2] || '.cloudflare-pages');
if (!process.argv[3]) throw new Error('Usage: node prepare-private-proof.mjs <projection> <separate-preview-root>');
const target = path.resolve(process.argv[3]);
if (target === source || target.startsWith(source + path.sep)) throw new Error('Use a separate preview directory');
const prior = await readdir(target).catch(error => error.code === 'ENOENT' ? [] : Promise.reject(error));
if (prior.length) throw new Error('Use a new empty preview directory; stale files must not mask missing assets');
const dist = path.join(target, 'dist');
await mkdir(path.join(target, '.openai'), { recursive: true });
await writeFile(path.join(target, '.openai/hosting.json'), JSON.stringify({ static: { directory: 'dist' } }) + '\n');
await cp(source, dist, { recursive: true });
const allow = "'self' data: blob: 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://unpkg.com https://fonts.googleapis.com https://fonts.gstatic.com https://www.youtube.com https://www.youtube-nocookie.com https://i.ytimg.com https://api.anthropic.com";
const meta = '<meta http-equiv="Content-Security-Policy" content="default-src ' + allow + '; worker-src \'self\' blob: https://cdnjs.cloudflare.com https://unpkg.com; object-src \'none\';">';
async function walk(directory) {
  for (const e of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, e.name);
    if (e.isDirectory()) { await walk(file); continue; }
    if (!/\.(html|js|mjs|css|json|jsonl)$/.test(file)) continue;
    let text = (await readFile(file, 'utf8')).replaceAll('https://kayfabizarro.pages.dev', '');
    text = text.replace(/(<script type="__bundler\/manifest">\s*)([\s\S]*?)(\s*<\/script>)/g, (all, open, json, close) => {
      const entries = JSON.parse(json); let changed = false;
      for (const value of Object.values(entries)) {
        if (!/^(text\/|application\/(javascript|json))/.test(value.mime)) continue;
        const data = Buffer.from(value.data, 'base64');
        const before = (value.compressed ? gunzipSync(data) : data).toString();
        const after = before.replaceAll('https://kayfabizarro.pages.dev', '');
        if (after !== before) { const bytes = Buffer.from(after); value.data = (value.compressed ? gzipSync(bytes) : bytes).toString('base64'); changed = true; }
      }
      return changed ? open + JSON.stringify(entries) + close : all;
    });
    if (file.endsWith('.html')) text = text.replace(/<head[^>]*>/i, match => match + meta);
    await writeFile(file, text);
  }
}
await walk(dist);
const cases = (await readdir(path.join(dist, 'FrizzleBob'))).filter(p => /^(0[1-9]|1[0-8])-.+\.md$/.test(p)).sort().map(p => ({ url: '/FrizzleBob/' + p, kind: 'reading' }));
const registry = JSON.parse(await readFile(path.join(dist, 'media/kfb/index.json'), 'utf8'));
for (const deck of registry.decks) {
  let filename = deck.pdf;
  try { await access(path.join(dist, 'media/kfb', filename)); }
  catch { filename = filename.replaceAll("'", '’'); }
  cases.push({ url: '/media/kfb/' + filename, kind: 'pdf' }, { url: '/media/kfb/' + deck.data, kind: 'json' });
}
for (const url of [
  'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/FrizzleBob/01-first-reading.md',
  'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/FrizzleBob/01-first-reading.md',
  'https://georg-doc.github.io/kayfabizarro/FrizzleBob/01-first-reading.md',
  'https://api.github.com/repos/georg-doc/kayfabizarro/contents/media/kfb',
  'https://raw.githack.com/georg-doc/kayfabizarro/main/FrizzleBob/index.html',
]) cases.push({ url, kind: 'deny' });
const harness = `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline';"><h1>Private migration network proof</h1><pre id="result">RUNNING</pre><script>
const cases=${JSON.stringify(cases)};
(async()=>{const results=[];let idx=0;async function job(){while(idx<cases.length){const c=cases[idx++];try{const r=await fetch(encodeURI(c.url),{method:c.kind==='pdf'?'HEAD':'GET',cache:'no-store'});let valid=r.ok;if(c.kind==='reading')valid=valid&&(await r.text()).includes('##');if(c.kind==='json'){try{await r.json()}catch{valid=false}}if(c.kind==='pdf')valid=valid&&(r.headers.get('content-type')||'').includes('pdf');results.push({...c,status:r.status,pass:c.kind==='deny'?false:valid})}catch(e){results.push({...c,pass:c.kind==='deny',error:String(e)})}}}await Promise.all(Array.from({length:6},job));const summary={total:results.length,passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass),byKind:{}};for(const k of ['reading','pdf','json','deny'])summary.byKind[k]={passed:results.filter(r=>r.kind===k&&r.pass).length,total:results.filter(r=>r.kind===k).length};document.getElementById('result').textContent=JSON.stringify(summary,null,2);})();</script>`;
await writeFile(path.join(dist, '__private-switch-proof.html'), harness);
console.log('Prepared ' + cases.length + ' checks. Start through sites-preview; open /__private-switch-proof.html. No production or visibility change.');
