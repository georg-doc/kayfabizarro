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

function render() {
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
}

for (const id of ['speed','longAccel','latAccel','impact','time','airX','airY','airZ','angX','angY','angZ']) {
  byId(id).addEventListener('input', render);
}
render();
