/** R3 research donor: pure transform from measured synthetic envelope frames into display-only geometry.
 * No AudioContext, DOM, Site, World, timeline, source ownership, side effects or runtime state. */
const REQUIRED_SCHEMA = 'bell-r3-envelope.v1';
const EPS=1e-9;
const clamp01 = v => Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
export function readEnvelope(analysis,sourceId,timeSec){
  if(analysis?.schema!==REQUIRED_SCHEMA)throw Error('Unknown bell-envelope schema');
  const sample=analysis.samples?.[sourceId];
  if(!sample || !Array.isArray(sample.rows) || sample.rows.length<2)throw Error('Missing source envelope');
  const t=Math.max(0,Number.isFinite(timeSec)?timeSec:0);
  const p=Math.min(sample.rows.length-1,t/analysis.dt);
  const lo=Math.floor(p),hi=Math.min(lo+1,sample.rows.length-1),f=p-lo;
  const frame=sample.rows[lo].map((v,i)=>v*(1-f)+sample.rows[hi][i]*f);
  return {sourceId,timeSec:t,rms:clamp01(frame[0]),bands:frame.slice(1,9).map(clamp01),frequenciesHz:sample.frequencyReferencesHz.slice(),provenance:analysis.provenance};
}
export function modeToGeometry(envelope,{narrativeField=false,reducedMotion=false}={}){
  if(!envelope || envelope.bands?.length!==8)throw Error('Expected eight partial amplitudes');
  const bands=envelope.bands.map(clamp01);
  const rms=clamp01(envelope.rms);
  const arcs=bands.map((energy,i)=>({
    partialIndex:i,frequencyHz:envelope.frequenciesHz[i],energy,
    radiusX:162+i*28+energy*29,radiusY:(92+i*16+energy*16)*.67,
    strokeWidth:.65+energy*2.2,opacity:(.11+.5*energy),
    // For reduced motion, keep shape static but retain actual measured brightness.
    deformAmount:reducedMotion?0:energy*.019,
  }));
  return {
    sourceId:envelope.sourceId,timeSec:envelope.timeSec,
    sourceLevel:rms,arcs,
    cathedralVaultTopPx:160-rms*16,
    groundEchoStrength:bands.map((e,i)=>.08+e*.22),
    speculativeField:narrativeField?{artisticOnly:true,threadStrength:bands.map(v=>.09+.19*v)}:null,
    factualCategory:'MEASURED_SYNTHETIC_WAVEFORM',
    // Never interpret these acoustic intensities as any psychophysiological variable.
  };
}
export function sourceIntegrity(analysis, sourceId, expectedSha256){
  const s=analysis?.samples?.[sourceId];
  if(!s) return false;
  return typeof s.sha256==='string' && s.sha256.toLowerCase()===expectedSha256.toLowerCase();
}
