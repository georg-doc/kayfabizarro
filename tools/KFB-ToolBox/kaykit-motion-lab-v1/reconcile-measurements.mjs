import fs from 'node:fs';
import { reconcileMeasurements } from '../kfb-lib/motion-measurement-reconcile.v1.js';

const [existingPath, blenderPath, outPath] = process.argv.slice(2);
if (!existingPath || !blenderPath || !outPath) {
  console.error('usage: node reconcile-measurements.mjs <existing.json> <blender.json> <out.json>');
  process.exit(2);
}
const existing=JSON.parse(fs.readFileSync(existingPath,'utf8'));
const blender=JSON.parse(fs.readFileSync(blenderPath,'utf8'));
const required=(blender.clips||[]).map(x=>x.clip).filter(Boolean);
const report=reconcileMeasurements(existing,blender,required);
fs.writeFileSync(outPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({schema:report.schema,clips:Object.keys(report.clips).length,unresolved:report.unresolved.length,readyForProfile:report.readyForProfile},null,2));
