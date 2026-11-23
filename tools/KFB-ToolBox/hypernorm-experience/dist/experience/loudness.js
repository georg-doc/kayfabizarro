// BS.1770 K-weighting coefficients at 48 kHz; 400ms / 75% overlap,
// absolute -70 LUFS and relative -10 LU gates. Stereo channel weights = 1.
export function measureLoudness(channels,rate=48000){
 if(rate!==48000)throw Error('Loudness measurement requires 48 kHz PCM');
 const n=channels[0].length,energy=new Float64Array(n);let peak=0;
 const stages=[
  [[1.53512485958697,-2.69169618940638,1.19839281085285],[-1.69065929318241,.73248077421585]],
  [[1,-2,1],[-1.99004745483398,.99007225036621]]
 ];
 for(const samples of channels){let data=new Float64Array(samples);for(const v of data)peak=Math.max(peak,Math.abs(v));for(const [b,a] of stages){let x1=0,x2=0,y1=0,y2=0;for(let i=0;i<n;i++){const x=data[i],y=b[0]*x+b[1]*x1+b[2]*x2-a[0]*y1-a[1]*y2;data[i]=y;x2=x1;x1=x;y2=y1;y1=y;}}for(let i=0;i<n;i++)energy[i]+=data[i]*data[i];}
 const window=19200,step=4800,blocks=[];let sum=0;for(let i=0;i<window&&i<n;i++)sum+=energy[i];
 for(let start=0;start+window<=n;start+=step){if(start>0){for(let j=start-step;j<start;j++)sum-=energy[j];for(let j=start+window-step;j<start+window;j++)sum+=energy[j];}const e=Math.max(0,sum/window);blocks.push({energy:e,lufs:-.691+10*Math.log10(Math.max(e,1e-15))});}
 const absolute=blocks.filter(b=>b.lufs>=-70),avg=a=>a.reduce((s,b)=>s+b.energy,0)/Math.max(1,a.length);
 const threshold=-.691+10*Math.log10(avg(absolute))-10,gated=absolute.filter(b=>b.lufs>threshold);
 return {integratedLufs:-.691+10*Math.log10(avg(gated)),samplePeakDb:20*Math.log10(Math.max(peak,1e-15)),seconds:n/rate,blocks:blocks.length,gatedBlocks:gated.length};
}
