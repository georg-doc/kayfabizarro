import { sampleRaceSecondaryFacts } from '/tools/KFB-ToolBox/kfb-rigs-embed-v3/secondary-motion/race-secondary-facts.v1.js';

const byId = (id) => document.getElementById(id);
const numeric = (id) => Number(byId(id).value);

function currentFacts() {
  return {
    speedNormalized: numeric('speed'),
    longitudinalAcceleration: numeric('longAccel'),
    lateralAcceleration: numeric('latAccel'),
    impactImpulse: numeric('impact'),
    relativeAirflowVector: { x: numeric('airX'), y: numeric('airY'), z: numeric('airZ') },
    angularVelocity: { x: numeric('angX'), y: numeric('angY'), z: numeric('angZ') },
    timeSeconds: numeric('time'),
    seed: 'frizzlebob-kcc1a',
    stuntState: { visualOnly: true }
  };
}

function drawPlot() {
  const canvas = byId('plot');
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(238,230,214,.14)';
  ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
  ctx.strokeStyle = '#c7a24d';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let i = 0; i < 220; i++) {
    const t = i / 219 * 2.4;
    const x = i / 219 * w;
    const y = h / 2 - sampleRaceSecondaryFacts({ ...currentFacts(), timeSeconds: t }).flutter.value * h * .38;
    if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
  }
  ctx.stroke();
}

function render() {
  byId('speedOut').textContent = numeric('speed').toFixed(2);
  byId('longOut').textContent = numeric('longAccel').toFixed(1);
  byId('latOut').textContent = numeric('latAccel').toFixed(1);
  byId('impactOut').textContent = numeric('impact').toFixed(2);
  byId('timeOut').textContent = numeric('time').toFixed(3);
  const out = sampleRaceSecondaryFacts(currentFacts());
  byId('json').textContent = JSON.stringify(out, null, 2);
  byId('energy').firstChild.nodeValue = out.energy.toFixed(3);
  byId('airStrength').firstChild.nodeValue = out.airflow.strength.toFixed(3);
  byId('flutterAmp').firstChild.nodeValue = out.flutter.amplitude.toFixed(3);
  for (const axis of ['Pitch','Roll','Yaw']) {
    byId('root' + axis).textContent = out.root[axis.toLowerCase()].toFixed(3);
    byId('tip' + axis).textContent = out.tip[axis.toLowerCase()].toFixed(3);
  }
  byId('flutterValue').textContent = out.flutter.value.toFixed(3);
  byId('flutterHz').textContent = out.flutter.frequencyHz.toFixed(2);
  byId('impactFact').textContent = out.impact.strength.toFixed(3);
  drawPlot();
}

for (const id of ['speed','longAccel','latAccel','impact','time','airX','airY','airZ','angX','angY','angZ']) {
  byId(id).addEventListener('input', render);
}

const presets = {
  rest:[0,0,0,0,.3,0,0,0,0,0,0],
  cruise:[.72,4,-3,0,.6,2,0,-29,0,-.25,.1],
  crosswind:[.78,1.5,9,0,1.1,22,-2,-27,.04,.7,-.25],
  brake:[.58,-22,1,0,1.45,-1,1,-23,.15,.05,.08],
  impact:[.46,-9,-8,-.85,2.1,-8,4,-18,.45,-.6,.8]
};
const inputIds=['speed','longAccel','latAccel','impact','time','airX','airY','airZ','angX','angY','angZ'];
document.querySelectorAll('[data-preset]').forEach(button => {
  button.addEventListener('click', () => {
    const values = presets[button.dataset.preset];
    inputIds.forEach((id, i) => { byId(id).value = String(values[i]); });
    render();
  });
});
render();
