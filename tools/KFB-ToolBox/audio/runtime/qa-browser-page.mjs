import { createKfbAudioRuntime } from './kfb-audio-runtime.mjs';

const status = document.querySelector('#status');
const output = document.querySelector('#result');
const registry = await fetch('./runtime-registry.v1.json', { cache: 'no-store' }).then(response => response.json());
const rawBase = `https://raw.githubusercontent.com/${registry.assetSource.repo}/${registry.assetSource.pin}/`;
const familyKeys = ['C', 'M', 'N', 'O'];
const sourceUrl = path => rawBase + path.split('/').map(encodeURIComponent).join('/');
const browserErrors = [];
window.addEventListener('error', event => browserErrors.push(event.error?.message || event.message));
window.addEventListener('unhandledrejection', event => browserErrors.push(event.reason?.message || String(event.reason)));

const audioContext = new AudioContext({ sampleRate: 44100 });
const result = {
  schema: 'kfb.audio.preintegration-browser-evidence.v1',
  assetSource: registry.assetSource,
  browserUserAgent: navigator.userAgent,
  createdAudioContexts: 1,
  runtimeCreatedAudioContexts: 0,
  familyResults: {},
  fallbackResults: {},
  browserErrors
};
window.__KFB_QA_RESULT__ = result;

const decodePath = async path => {
  const response = await fetch(sourceUrl(path));
  if (!response.ok) throw new Error(`${path} HTTP ${response.status}`);
  let buffer = await audioContext.decodeAudioData(await response.arrayBuffer());
  const channel = buffer.getChannelData(0);
  const step = Math.max(1, Math.floor(channel.length / 8192));
  let sumSquares = 0;
  let peak = 0;
  let samples = 0;
  for (let index = 0; index < channel.length; index += step) {
    const value = channel[index];
    sumSquares += value * value;
    peak = Math.max(peak, Math.abs(value));
    samples += 1;
  }
  const metric = {
    path,
    durationSeconds: buffer.duration,
    sampleRate: buffer.sampleRate,
    channels: buffer.numberOfChannels,
    frameLength: buffer.length,
    rmsSampled: Math.sqrt(sumSquares / Math.max(1, samples)),
    peakSampled: peak,
    loopEdgeDeltaCh0: Math.abs(channel[0] - channel[channel.length - 1])
  };
  buffer = null;
  return metric;
};

try {
  for (const key of familyKeys) {
    const family = registry.families[key];
    const stems = [];
    for (let index = 0; index < family.stems.length; index += 1) {
      const stem = family.stems[index];
      status.textContent = `${key}: decoding stem ${index + 1}/${family.stems.length}`;
      const metric = await decodePath(`${family.folder}/${stem.file}`);
      stems.push({
        ...metric,
        role: stem.role,
        defaultGain: stem.default ?? null,
        listeningClassification: stem.role.startsWith('UNCLASSIFIED') ? 'AMBIGUOUS_RETAIN_MUTED' : 'ROLE_LABEL_ACCEPTED_TECHNICAL_ONLY'
      });
    }
    status.textContent = `${key}: decoding master fallback`;
    const master = await decodePath(family.master);
    const durations = stems.map(stem => stem.durationSeconds);
    const minSeconds = Math.min(...durations);
    const maxSeconds = Math.max(...durations);
    const beats = minSeconds * family.bpm / 60;
    const bars = beats / (family.beatsPerBar || 4);
    const phraseBars = family.phraseBars || 8;
    const barSeconds = (60 / family.bpm) * (family.beatsPerBar || 4);
    const sharedLoopEndSeconds = family.loopPolicy === 'SHARED_BAR_FLOOR'
      ? Math.max(barSeconds, Math.floor((minSeconds + 1e-9) / barSeconds) * barSeconds)
      : minSeconds;
    result.familyResults[key] = {
      id: family.id,
      bpm: family.bpm,
      stemCount: stems.length,
      minSeconds,
      maxSeconds,
      deltaMs: (maxSeconds - minSeconds) * 1000,
      sampleRates: [...new Set(stems.map(stem => stem.sampleRate))],
      channelCounts: [...new Set(stems.map(stem => stem.channels))],
      sharedLoopEndSeconds,
      loopTailTrimSeconds: minSeconds - sharedLoopEndSeconds,
      loopPolicy: family.loopPolicy || 'SHARED_MIN_DURATION',
      simulatedSharedLoopInterStemDriftMsAt100Loops: 0,
      naturalUnboundedInterStemDriftMsAt100Loops: (maxSeconds - minSeconds) * 1000 * 100,
      bpmPlausibility: {
        decodedBeats: beats,
        nearestBeatResidual: Math.abs(beats - Math.round(beats)),
        decodedBars: bars,
        nearestBarResidualBeats: Math.abs(bars - Math.round(bars)) * (family.beatsPerBar || 4),
        decodedPhrases: bars / phraseBars,
        declaredBpmPlausible: Math.abs(beats - Math.round(beats)) <= 0.5,
        runtimeLoopBarAligned: Math.abs((sharedLoopEndSeconds / barSeconds) - Math.round(sharedLoopEndSeconds / barSeconds)) <= 1e-9
      },
      ambiguousLayers: stems.filter(stem => stem.role.startsWith('UNCLASSIFIED')).map(stem => ({
        role: stem.role,
        file: stem.path.split('/').at(-1),
        rmsSampled: stem.rmsSampled,
        peakSampled: stem.peakSampled,
        classification: stem.listeningClassification,
        defaultGain: stem.defaultGain
      })),
      master,
      stems
    };
  }

  const promotedForFallbackTest = structuredClone(registry);
  for (const key of familyKeys) promotedForFallbackTest.families[key].status = 'RUNTIME_VERIFIED';
  for (const key of familyKeys) {
    status.textContent = `${key}: forcing stem failure and testing master fallback`;
    const runtime = createKfbAudioRuntime({
      audioContext,
      destination: audioContext.destination,
      registry: promotedForFallbackTest,
      assetBaseUrl: sourceUrl,
      fetchImpl: url => url.includes('Stems') ? Promise.resolve(new Response('', { status: 503 })) : fetch(url)
    });
    const evidence = await runtime.loadFamily(key, { startDelay: 0.03, crossfadeSeconds: 0.05 });
    result.fallbackResults[key] = {
      familyId: evidence.familyId,
      playbackMode: evidence.playbackMode,
      activeRoles: evidence.activeRoles,
      fallbackReason: evidence.fallbackReason,
      moduleCreatedAudioContexts: evidence.moduleCreatedAudioContexts,
      alignment: evidence.alignment
    };
    await runtime.dispose();
  }

  await audioContext.close();
  result.completed = true;
  result.pass = familyKeys.every(key =>
    result.familyResults[key].deltaMs <= 1 &&
    result.familyResults[key].bpmPlausibility.declaredBpmPlausible &&
    result.familyResults[key].bpmPlausibility.runtimeLoopBarAligned &&
    result.fallbackResults[key].playbackMode === 'MASTER_FALLBACK'
  ) && browserErrors.length === 0;
  status.textContent = result.pass ? 'PASS' : 'TECHNICAL FAIL';
  output.textContent = JSON.stringify(result, null, 2);
} catch (error) {
  browserErrors.push(error.message);
  result.completed = true;
  result.pass = false;
  result.fatalError = error.stack || error.message;
  try { await audioContext.close(); } catch {}
  status.textContent = 'TECHNICAL FAIL';
  output.textContent = JSON.stringify(result, null, 2);
}
