// V-695 preparation only. Not wired into the published Staging handler.
// The receiving handler MUST run this before all game/static/raw paths;
// platform-owned sign-in routes remain owned by Sites dispatch.
const encoder = new TextEncoder();
const upstreamRoot = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/';
const denied = (body, status, headers = {}) => new Response(body, {status, headers:{'Cache-Control':'no-store', ...headers}});
async function same(a,b) {
  const [x,y] = await Promise.all([a,b].map(v=>crypto.subtle.digest('SHA-256',encoder.encode(v))));
  const u = new Uint8Array(x), v = new Uint8Array(y); let d=0;
  for(let i=0;i<u.length;i++) d |= u[i]^v[i];
  return d===0;
}
export async function authorize(request,env) {
  if(!env.SITE_USER || !env.SITE_PASS) return denied('Site gesperrt: Zugang noch nicht eingerichtet.',503);
  const h=request.headers.get('Authorization')||''; let credentials='';
  if(/^Basic /i.test(h) && h.length<4096) {
    try { credentials=new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(h.slice(6)),c=>c.charCodeAt(0))); } catch {}
  }
  const colon=credentials.indexOf(':');
  if(colon>0) {
    const checks=await Promise.all([same(credentials.slice(0,colon),env.SITE_USER),same(credentials.slice(colon+1),env.SITE_PASS)]);
    if(checks.every(Boolean)) return null;
  }
  return denied('Anmeldung nötig',401,{'WWW-Authenticate':'Basic realm="Kayfabizarro MVP", charset="UTF-8"'});
}
export function mime(path) {
  return ({html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json',glb:'model/gltf-binary',gltf:'model/gltf+json',m4a:'audio/mp4',mp3:'audio/mpeg',ogg:'audio/ogg',wav:'audio/wav',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',wasm:'application/wasm',pdf:'application/pdf'})[path.split('.').at(-1).toLowerCase()]||'application/octet-stream';
}
export function rawTarget(pathname) {
  if(!pathname.startsWith('/raw/')) return null;
  const parts=pathname.slice(5).split('/').map(p=>decodeURIComponent(p));
  if(parts.length<2 || !/^[a-f0-9]{40}$/.test(parts[0]) || parts.some(p=>!p || p==='.' || p==='..' || /[\\/\u0000-\u001f%]/.test(p))) throw new Error('Invalid pinned raw path');
  return upstreamRoot+parts.map(encodeURIComponent).join('/');
}
export async function protectedFetch(request,env,{asset,fetchUpstream=fetch}) {
  const auth=await authorize(request,env); if(auth) return auth;
  const url=new URL(request.url);
  if(url.pathname.startsWith('/raw/')) {
    if(request.method!=='GET') return denied('Nur GET',405,{Allow:'GET'});
    let target; try {target=rawTarget(url.pathname);} catch {return denied('Ungültiger Commit/Pfad',400);}
    const headers=new Headers();
    if(env.GH_READ_TOKEN) headers.set('Authorization','Bearer '+env.GH_READ_TOKEN);
    const range=request.headers.get('Range');
    if(range) {
      const m=/^bytes=(\d*)-(\d*)$/.exec(range), start=m?.[1],end=m?.[2];
      if(!m || (!start&&!end) || [start,end].some(v=>v&&!Number.isSafeInteger(Number(v))) || (start&&end&&Number(start)>Number(end)) || (!start&&Number(end)<=0)) return denied('Ungültiger Range',416);
      headers.set('Range',range);
    }
    let response; try {response=await fetchUpstream(target,{headers,redirect:'manual',signal:AbortSignal.timeout(20000)});} catch {return denied('Quelle nicht erreichbar',502);}
    if(response.status===416) return denied('Range nicht verfügbar',416,{'Content-Range':response.headers.get('Content-Range')||'bytes */*'});
    if(![200,206].includes(response.status)) return denied('Quelle nicht verfügbar',response.status===404?404:502);
    const out=new Headers({'Content-Type':mime(url.pathname),'Cache-Control':'private, max-age=31536000, immutable','Vary':'Authorization','X-Content-Type-Options':'nosniff'});
    for(const k of ['Content-Length','Content-Range','Accept-Ranges','ETag']) if(response.headers.has(k)) out.set(k,response.headers.get(k));
    return new Response(response.body,{status:response.status,headers:out});
  }
  if(!['GET','HEAD'].includes(request.method)) return denied('Methode nicht erlaubt',405,{Allow:'GET, HEAD'});
  // The actual private bundle provider must implement Range and must not fall
  // back to the old public snapshot importer or unchecked static assets.
  const response=await asset(request);
  const headers=new Headers(response.headers);
  const vary=new Set((headers.get('Vary')||'').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean));vary.add('authorization');
  headers.set('Vary',[...vary].join(', '));headers.set('X-Content-Type-Options','nosniff');
  if(response.status>=400) headers.set('Cache-Control','no-store');
  else headers.set('Cache-Control','private, max-age=0, must-revalidate');
  return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers});
}
