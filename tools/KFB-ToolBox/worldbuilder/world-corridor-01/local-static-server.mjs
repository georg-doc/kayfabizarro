import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'../../../..');
const PORT=Number(process.env.KFB_WC1_PORT || process.argv[2] || 8772);
const MIME={
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg',
  '.jpeg':'image/jpeg','.webp':'image/webp','.glb':'model/gltf-binary','.gltf':'model/gltf+json','.bin':'application/octet-stream'
};
const server=http.createServer((req,res)=>{
  try{
    const u=new URL(req.url,'http://127.0.0.1');
    const rel=decodeURIComponent(u.pathname).replace(/^\/+/, '');
    const file=path.resolve(ROOT,rel || 'index.html');
    if(!file.startsWith(ROOT+path.sep) && file!==ROOT) throw new Error('forbidden');
    const st=statSync(file);
    if(!st.isFile()) throw new Error('not a file');
    res.writeHead(200,{
      'Content-Type':MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control':'no-store'
    });
    createReadStream(file).pipe(res);
  }catch{
    res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
    res.end('Not found');
  }
});
server.listen(PORT,'127.0.0.1',()=>{
  console.log(`KFB WC1 local server · http://127.0.0.1:${PORT}/`);
});
