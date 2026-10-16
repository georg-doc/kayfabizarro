import {artifact} from '../../../../lib/staging';
export async function GET(_request:Request,{params}:{params:Promise<{sha:string,path:string[]}>}){const p=await params;return artifact(p.sha,p.path.join('/'))}
