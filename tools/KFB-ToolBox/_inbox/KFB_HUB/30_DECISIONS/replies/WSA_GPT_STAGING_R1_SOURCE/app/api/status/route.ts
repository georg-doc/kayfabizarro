import {sync,history} from '../../../lib/staging';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{return Response.json(new URL(request.url).searchParams.has('history')?await history():await sync(),{headers:{'Cache-Control':'no-store'}})}catch(e:any){return Response.json({builds:[],error:e.message},{status:503})}}
