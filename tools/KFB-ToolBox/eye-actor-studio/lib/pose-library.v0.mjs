export const EYE_ACTOR_POSES=Object.freeze({
  neutral:{label:'Neutral',eye:{lidUpper:0,lidLower:0,slant:0,pupil:'normal',gaze:'front'},brow:'neutral'},
  skeptical:{label:'Skeptical blink',eye:{lidUpper:[.58,.12],lidLower:[.15,.02],slant:[.18,-.04],pupil:'normal',gaze:'front'},brow:'skeptical'},
  aimLeft:{label:'Combat aim · left eye',eye:{lidUpper:[.10,.62],lidLower:[.02,.18],slant:[-.02,.12],pupil:'normal',gaze:'front'},brow:'critical-angry',point:[-.82,.04]},
  aimRight:{label:'Combat aim · right eye',eye:{lidUpper:[.62,.10],lidLower:[.18,.02],slant:[-.12,.02],pupil:'normal',gaze:'front'},brow:'critical-angry',point:[.82,.04]},
  tired:{label:'Tired',eye:{lidUpper:[.44,.48],lidLower:[.16,.18],slant:[.08,.08],pupil:'normal',gaze:'down'},brow:'tired'},
  angry:{label:'Angry',eye:{lidUpper:[.28,.28],lidLower:[.10,.10],slant:[-.42,-.42],pupil:'normal',gaze:'front'},brow:'angry'},
  surprised:{label:'Surprised',eye:{lidUpper:[-.22,-.22],lidLower:[-.10,-.10],slant:0,pupil:'wide',gaze:'front'},brow:'surprised'}
});
export const EYE_ACTOR_POSE_IDS=Object.keys(EYE_ACTOR_POSES);

export function applyEyeActorPose(rig,brow,id){
  const p=EYE_ACTOR_POSES[id]||EYE_ACTOR_POSES.neutral;
  rig.setGazeFollow?.(false);rig.applyEmote?.(p.eye);
  if(p.point){rig.pointTo?.(...p.point);rig.setGazeFollow?.(true);}
  if(brow?.expression)brow.expression(p.brow);
  return p;
}
