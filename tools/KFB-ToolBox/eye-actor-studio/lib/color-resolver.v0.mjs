export const COLOR_PRIORITY=['face','body','main'];

export function normalizeHex(v){
  if(v==null)return null;
  if(typeof v==='number')return '#'+Math.max(0,Math.min(0xffffff,v)).toString(16).padStart(6,'0');
  const s=String(v).trim();
  return /^#[0-9a-f]{6}$/i.test(s)?s.toLowerCase():null;
}

export function resolveSurfaceColor({face=null,body=null,main=null}={}){
  const values={face:normalizeHex(face),body:normalizeHex(body),main:normalizeHex(main)};
  for(const source of COLOR_PRIORITY)if(values[source])return {source,color:values[source]};
  return {source:'fallback',color:'#8a8178'};
}
