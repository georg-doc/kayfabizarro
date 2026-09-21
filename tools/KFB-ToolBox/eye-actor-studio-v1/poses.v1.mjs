export const POSES=Object.freeze({
  neutral:{label:'Neutral',upper:0,lower:0,slant:0,gaze:[0,0]},
  skeptical:{label:'Skeptical',upper:[.60,.12],lower:[.16,.03],slant:[.22,-.05],gaze:[0,0]},
  tired:{label:'Tired',upper:.46,lower:.17,slant:.08,gaze:[0,-.10]},
  angry:{label:'Angry',upper:.30,lower:.11,slant:-.42,gaze:[0,0]},
  surprised:{label:'Surprised',upper:-.20,lower:-.10,slant:0,gaze:[0,0]},
  aim:{label:'Aim selected',upper:.58,lower:.14,slant:.16,gaze:[.18,0]}
});
export function valueFor(v,index=0){
  return Array.isArray(v)?(v[index]??v[0]??0):(v??0);
}
