// Hosting entry recovery only. Do not change the game's hash/mode contract.
const aliases=new Set(['/game-package','/game-package/','/game-package/index.html','/index.html']);
export function canonicalEntry(request) {
  const url=new URL(request.url);
  if(!aliases.has(url.pathname))return null;
  // A Location without a fragment inherits the browser's current fragment.
  // Hence #m1,car,... survives without ever being sent to the server.
  return new Response(null,{status:307,headers:{Location:'/'+url.search,'Cache-Control':'no-store'}});
}
export async function fetchPackageAsset(request,binding,path) {
  const url=new URL(request.url);url.pathname='/game-package'+path;
  const response=await binding.fetch(new Request(url,request));
  if(![301,302,303,307,308].includes(response.status))return response;
  // Sites may canonicalize index.html even when the local Worker setting says
  // html_handling:none. Consume ONLY that exact same-origin redirect inside
  // the provider; never send the internal package URL to the browser.
  if(path!=='/index.html')throw Error('Unexpected package asset redirect');
  const location=response.headers.get('Location');
  if(!location)throw Error('Missing package redirect');
  const next=new URL(location,url);
  if(next.origin!==url.origin || next.pathname!=='/game-package/' || next.search!==url.search || next.hash)throw Error('Unsafe package redirect');
  await response.body?.cancel();
  const result=await binding.fetch(new Request(next,request));
  if(result.status!==200)throw Error('Package index did not resolve');
  return result;
}
