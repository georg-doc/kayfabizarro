// Vendored 1:1 aus KFB Audio Site 0.7.6 (kayfabizarro@945518d3 tools/KFB-Audio-Site/dist/footsteps/sample-shape.mjs).
// Pure PCM processing; no AudioContext, DOM, clock or generated sound.
export function shapePCM(channels,sampleRate,{cutoff,tail,attack=.01,highpass=65,levelDb=0}){
 const length=Math.min(channels[0].length,Math.floor(tail*sampleRate));
 function filter(input,f,q,high){const w=2*Math.PI*f/sampleRate,c=Math.cos(w),a=Math.sin(w)/(2*q),d=1+a;
  const b0=(high?1+c:1-c)/2/d,b1=(high?-(1+c):1-c)/d,b2=b0,a1=-2*c/d,a2=(1-a)/d;
  let x1=0,x2=0,y1=0,y2=0;return Float32Array.from(input,x=>{const y=b0*x+b1*x1+b2*x2-a1*y1-a2*y2;x2=x1;x1=x;y2=y1;y1=y;return y;});}
 const shaped=channels.map(pcm=>{const out=filter(filter(pcm.subarray(0,length),highpass,.707,true),cutoff,.5,false);
  for(let i=0;i<length;i++){const t=i/sampleRate,k=t<attack?t/attack:t<tail*.55?Math.pow(.24,(t-attack)/(tail*.55-attack)):.24*(tail-t)/(tail*.45);out[i]*=Math.max(0,k);}return out;});
 let energy=0,peak=0;for(const pcm of shaped)for(const x of pcm){energy+=x*x;peak=Math.max(peak,Math.abs(x));}
 // Fixed 240-ms reference window matches ENERGY PER CONTACT, not unequal clip lengths.
 const rms=Math.sqrt(energy/(.24*sampleRate*shaped.length)),gain=Math.min(.010*Math.pow(10,levelDb/20)/Math.max(1e-8,rms),.12/Math.max(1e-8,peak));
 for(const pcm of shaped)for(let i=0;i<length;i++)pcm[i]*=gain;
 let onset=length;for(const pcm of shaped)for(let i=0;i<length;i++)if(Math.abs(pcm[i])>=peak*gain*.2){onset=Math.min(onset,i);break;}
 return {channels:shaped,rms:rms*gain,peak:peak*gain,onsetSeconds:onset/sampleRate,gain};
}
