import fs from 'node:fs';
import { reconcileMeasurements } from '../kfb-lib/motion-measurement-reconcile.v1.js';
import {
  buildForwardProfileFromLadder,
  ladderCrossCheckMeasurement,
} from '../kfb-lib/locomotion-ladder-profile.v1.js';

const [existingPath, blenderPath, outPath] = process.argv.slice(2);
if (!existingPath || !blenderPath || !outPath) {
  console.error('usage: node reconcile-measurements.mjs <existing.json> <blender-or-ladder.json> <out.json>');
  process.exit(2);
}

const existing=JSON.parse(fs.readFileSync(existingPath,'utf8'));
const source=JSON.parse(fs.readFileSync(blenderPath,'utf8'));
const isLadder=String(source?.schema||'').startsWith('kfb.locomotion-ladder/');

let blender=source;
let existingScope=existing;
let required=[];

if(isLadder){
  blender=ladderCrossCheckMeasurement(source,'Rig_Medium');
  required=(blender.clips||[]).map((x)=>x.clip).filter(Boolean);
  if(existing?.clips){
    existingScope={
      ...existing,
      clips:Object.fromEntries(required.filter((n)=>existing.clips[n]).map((n)=>[n,existing.clips[n]])),
    };
  }
}else{
  required=(blender.clips||[]).map((x)=>x.clip).filter(Boolean);
}

const report=reconcileMeasurements(existingScope,blender,required);
if(isLadder){
  report.ladderForwardProfile=buildForwardProfileFromLadder(source,{
    rigFamily:'Rig_Medium',
    speedSpace:'world',
  });
  report.ruleLadder='Ladder technical readiness and same-clip measurement reconciliation are separate. Human look choices remain open.';
}

fs.writeFileSync(outPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({
  schema:report.schema,
  clips:Object.keys(report.clips).length,
  unresolved:report.unresolved.length,
  readyForProfile:report.readyForProfile,
  ladderForwardOrder:report.ladderForwardProfile?.forwardOrder||null,
  technicalForwardReady:report.ladderForwardProfile?.technicalForwardReady??null,
  humanAccepted:report.ladderForwardProfile?.humanAccepted??null,
},null,2));
