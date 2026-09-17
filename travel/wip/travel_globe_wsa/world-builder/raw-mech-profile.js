// Raw Quaternius Mech control profile for WB0 Movement Lab.
// This deliberately contains NO FrizzleBob/cockpit Frankenstein work: it is the clean control
// specimen used to separate original Mech locomotion/animation behavior from the composite rig.

export const RAW_FLAMINGO_PATH = 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Characters/GLTF/Mech_FernandoTheFlamingo.gltf';

export async function buildRawFlamingoMovementRuntime({
  THREE, loader, raw, def, bodyHeight, worldLambert, normalizeHeight, makeEntry, autoMap,
}) {
  const gltf = await loader.loadAsync(raw(def.body || RAW_FLAMINGO_PATH));
  const model = gltf.scene;
  model.name = 'Fernando · Flamingo · raw Quaternius control';
  // HUMAN BROWSER CORRECTION 17.09.2026:
  // the previous inherited +180° donor correction made Fernando face backwards in WB0 Ground.
  // Keep the source orientation here; this is presentation-only and does not touch Ground heading.
  model.rotation.y = 0;
  worldLambert(model);

  const targetHeight = bodyHeight * 3.6;
  const measure = normalizeHeight(model, targetHeight);
  const entries = [];
  for (const clip of gltf.animations || []) {
    const entry = makeEntry(model, clip, 'QuaterniusFlamingo', measure.worldScale);
    if (entry) entries.push(entry);
  }
  if (!entries.length) throw new Error('Fernando raw Mech: no bindable embedded clips found');
  const auto = autoMap(entries);
  if (!auto.idle || !auto.walk || !auto.run || !auto.jump) {
    throw new Error(`Fernando raw Mech missing locomotion clips: ${['idle','walk','run','jump'].filter((k) => !auto[k]).join(', ')}`);
  }

  const speedMul = targetHeight / bodyHeight;
  return {
    def,
    model,
    actionRoot: model,
    mixer: new THREE.AnimationMixer(model),
    entries,
    auto,
    measure,
    fallback: false,
    speedMul,
    locomotionHeight: targetHeight,
    donorReport: {
      donor: 'raw Quaternius Space Kit',
      asset: def.body || RAW_FLAMINGO_PATH,
      clips: (gltf.animations || []).map((clip) => clip.name),
      targetHeight,
      speedMul,
      forwardCorrectionDeg: 0,
      forwardEvidence: 'HUMAN BROWSER CORRECTION · previous 180° correction was backwards in WB0',
      composition: 'RAW CONTROL · no cockpit · no FrizzleBob',
    },
    status: `RAW Quaternius control · ${entries.length} embedded clips · move ${speedMul.toFixed(2)}× · source forward · no cockpit / no FrizzleBob`,
  };
}
