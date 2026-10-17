import { MusicClock, BOUNDARIES } from '../adaptive-music-proof-01/music-clock.mjs';
import { isRuntimeVerified, resolveEventFamily, resolveFamily, validateContext, validateEvent } from './music-resolver.mjs';

const EPSILON_GAIN = 0.0001;
const OPEN_MUSIC_GAIN = 0.86;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, Number(value) || 0));
const roleMap = stems => Object.fromEntries((stems || []).map(stem => [stem.role, stem]));

export class KfbAudioRuntime {
  constructor({ audioContext, destination, assetBaseUrl, fetchImpl = globalThis.fetch, registry, onError = () => {} } = {}) {
    if (!audioContext) throw new Error('KFB Audio Runtime requires injected audioContext');
    if (!registry) throw new Error('KFB Audio Runtime requires registry');
    if (typeof fetchImpl !== 'function') throw new Error('fetchImpl required');
    this.ctx = audioContext;
    this.destination = destination || audioContext.destination;
    this.base = assetBaseUrl;
    this.fetch = fetchImpl;
    this.registry = registry;
    this.onError = onError;
    this.graph = this.#graph();
    this.current = null;
    this.retiring = new Set();
    this.context = null;
    this.functionState = 'STAYING';
    this.familyId = null;
    this.seq = -1;
    this.eventSeq = -1;
    this.speechFocus = false;
    this.log = [];
    this.errors = [];
    this.disposed = false;
    this.queue = Promise.resolve();
  }

  #graph() {
    const master = this.ctx.createGain();
    const eq = this.ctx.createBiquadFilter();
    const music = this.ctx.createGain();
    eq.type = 'peaking';
    eq.frequency.value = 2200;
    eq.Q.value = 0.85;
    eq.gain.value = 0;
    music.gain.value = OPEN_MUSIC_GAIN;
    music.connect(eq);
    eq.connect(master);
    master.connect(this.destination);
    return { master, eq, music };
  }

  #url(path) {
    if (typeof this.base === 'function') return this.base(path);
    if (!this.base) return path;
    return new URL(path, this.base).href;
  }

  #record(type, extra = {}) {
    this.log.push({ type, time: this.ctx.currentTime, ...extra });
    if (this.log.length > 160) this.log.shift();
  }

  #recordError(error, extra = {}) {
    const message = error instanceof Error ? error.message : String(error);
    this.errors.push({ message, time: this.ctx.currentTime, ...extra });
    if (this.errors.length > 40) this.errors.shift();
    this.#record('ERROR', { message, ...extra });
    this.onError(error instanceof Error ? error : new Error(message));
  }

  #enqueue(task) {
    const run = this.queue.then(task, task);
    this.queue = run.catch(() => {});
    return run;
  }

  async #decode(path) {
    const response = await this.fetch(this.#url(path));
    if (!response.ok) throw new Error(path + ' HTTP ' + response.status);
    return this.ctx.decodeAudioData(await response.arrayBuffer());
  }

  async #decodeFamily(family) {
    let stemError = null;
    if (Array.isArray(family.stems) && family.stems.length) {
      try {
        const loaded = await Promise.all(family.stems.map(async stem => ({
          stem,
          buffer: await this.#decode(family.folder + '/' + stem.file)
        })));
        return { loaded, playbackMode: 'STEMS', fallbackReason: null };
      } catch (error) {
        stemError = error;
      }
    } else {
      stemError = new Error('No stem roster configured');
    }
    if (!family.master) throw stemError;
    const buffer = await this.#decode(family.master);
    return {
      loaded: [{ stem: { file: family.master, role: 'MASTER', default: 1 }, buffer }],
      playbackMode: 'MASTER_FALLBACK',
      fallbackReason: stemError.message
    };
  }

  #buildDeck(id, family, decoded, { startDelay = 0.16 } = {}) {
    const durations = decoded.loaded.map(item => item.buffer.duration);
    const sampleRates = decoded.loaded.map(item => item.buffer.sampleRate);
    const channelCounts = decoded.loaded.map(item => item.buffer.numberOfChannels);
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    const barSeconds = (60 / family.bpm) * (family.beatsPerBar || 4);
    const sharedLoopEnd = family.loopPolicy === 'SHARED_BAR_FLOOR'
      ? Math.max(barSeconds, Math.floor((min + 1e-9) / barSeconds) * barSeconds)
      : min;
    const epoch = this.ctx.currentTime + Math.max(0.02, Number(startDelay) || 0);
    const clock = new MusicClock({ bpm: family.bpm, beatsPerBar: family.beatsPerBar || 4, phraseBars: family.phraseBars || 8, epoch });
    const familyGain = this.ctx.createGain();
    familyGain.gain.value = this.current ? 0 : 1;
    familyGain.connect(this.graph.music);
    const voices = new Map();
    for (const { stem, buffer } of decoded.loaded) {
      const gain = this.ctx.createGain();
      gain.gain.value = Math.max(EPSILON_GAIN, stem.default ?? 0);
      gain.connect(familyGain);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = 0;
      source.loopEnd = sharedLoopEnd;
      source.connect(gain);
      source.start(epoch);
      voices.set(stem.role, { stem, buffer, gain, src: source });
    }
    return {
      id, family, voices, familyGain, clock, epoch, durations, sampleRates, channelCounts,
      sharedLoopEnd,
      decodedMinDuration: min,
      deltaMs: (max - min) * 1000,
      playbackMode: decoded.playbackMode,
      fallbackReason: decoded.fallbackReason
    };
  }

  #retireDeck(deck, when = this.ctx.currentTime + 0.02) {
    if (!deck) return;
    this.retiring.add(deck);
    let remaining = deck.voices.size;
    const clean = () => {
      remaining -= 1;
      if (remaining > 0) return;
      try { deck.familyGain.disconnect(); } catch {}
      this.retiring.delete(deck);
    };
    if (!remaining) clean();
    for (const voice of deck.voices.values()) {
      voice.src.onended = () => {
        try { voice.src.disconnect(); } catch {}
        try { voice.gain.disconnect(); } catch {}
        clean();
      };
      try { voice.src.stop(when); } catch { clean(); }
    }
  }

  async #loadFamily(id, { startDelay = 0.16, crossfadeSeconds } = {}) {
    if (this.disposed) throw new Error('KFB Audio Runtime is disposed');
    if (id === this.familyId && this.current) {
      this.#record('FAMILY_RETAIN', { id });
      return this.getEvidence();
    }
    const family = this.registry.families?.[id];
    if (!family || !isRuntimeVerified(family)) throw new Error('Family not runtime verified: ' + id);
    const decoded = await this.#decodeFamily(family);
    const next = this.#buildDeck(id, family, decoded, { startDelay });
    const previous = this.current;
    const fade = Math.max(0.05, Number(crossfadeSeconds ?? family.crossfadeSeconds ?? 1.25));
    const fadeStart = next.epoch;
    const fadeEnd = fadeStart + fade;
    if (previous) {
      previous.familyGain.gain.cancelScheduledValues(this.ctx.currentTime);
      previous.familyGain.gain.setValueAtTime(previous.familyGain.gain.value, this.ctx.currentTime);
      previous.familyGain.gain.linearRampToValueAtTime(EPSILON_GAIN, fadeEnd);
      next.familyGain.gain.setValueAtTime(EPSILON_GAIN, this.ctx.currentTime);
      next.familyGain.gain.setValueAtTime(EPSILON_GAIN, fadeStart);
      next.familyGain.gain.linearRampToValueAtTime(1, fadeEnd);
      this.#retireDeck(previous, fadeEnd + 0.08);
    }
    this.current = next;
    this.familyId = id;
    this.#record('FAMILY_START', {
      id, epoch: next.epoch, deltaMs: next.deltaMs, sharedLoopEnd: next.sharedLoopEnd,
      playbackMode: next.playbackMode, fallbackReason: next.fallbackReason,
      crossfadeSeconds: previous ? fade : 0
    });
    return this.getEvidence();
  }

  loadFamily(id, options = {}) {
    return this.#enqueue(async () => {
      try { return await this.#loadFamily(id, options); }
      catch (error) {
        this.#recordError(error, { familyId: id, seam: 'LOAD_FAMILY' });
        throw error;
      }
    });
  }

  async #stopFamily() {
    if (!this.current) return;
    const current = this.current;
    this.current = null;
    this.familyId = null;
    this.#retireDeck(current, this.ctx.currentTime + 0.02);
    this.#record('FAMILY_STOP', { id: current.id });
  }

  stopFamily() {
    return this.#enqueue(() => this.#stopFamily());
  }

  #when(boundary = 'BAR') {
    if (!this.current) return this.ctx.currentTime + 0.02;
    const map = { NOW: BOUNDARIES.IMMEDIATE, BEAT: BOUNDARIES.NEXT_BEAT, BAR: BOUNDARIES.NEXT_BAR, PHRASE: BOUNDARIES.NEXT_PHRASE };
    return this.current.clock.nextBoundary(this.ctx.currentTime, map[boundary] || BOUNDARIES.NEXT_BAR, 0.055);
  }

  applyPreset(name, { boundary = 'BAR' } = {}) {
    if (!this.current) return null;
    const preset = this.current.family.presets?.[name];
    if (!preset) return null;
    const when = this.#when(boundary);
    for (const [role, voice] of this.current.voices) {
      if (!Object.hasOwn(preset, role)) continue;
      voice.gain.gain.cancelScheduledValues(when);
      voice.gain.gain.setTargetAtTime(Math.max(EPSILON_GAIN, preset[role]), when, 0.10);
    }
    this.#record('PRESET', { family: this.current.id, name, boundary, when });
    return when;
  }

  setSpeechFocus(on, { boundary = 'BEAT' } = {}) {
    const when = this.#when(boundary);
    const family = this.current?.family;
    const cfg = family?.speechFocus || this.registry.families?.D?.speechFocus || {};
    this.speechFocus = Boolean(on);
    if (this.current) {
      const defaults = roleMap(family?.stems);
      for (const [role, voice] of this.current.voices) {
        const open = defaults[role]?.default ?? (role === 'MASTER' ? 1 : 0);
        const multiplier = cfg.roleMultipliers?.[role] ?? 1;
        const target = on ? open * multiplier : open;
        voice.gain.gain.cancelScheduledValues(when);
        voice.gain.gain.setTargetAtTime(Math.max(EPSILON_GAIN, target), when, 0.12);
      }
    }
    this.graph.music.gain.cancelScheduledValues(when);
    this.graph.music.gain.setTargetAtTime(on ? (cfg.musicGain ?? 0.72) : OPEN_MUSIC_GAIN, when, 0.14);
    this.graph.eq.frequency.setValueAtTime(cfg.eqHz ?? 2200, when);
    this.graph.eq.Q.setValueAtTime(cfg.eqQ ?? 0.85, when);
    this.graph.eq.gain.setTargetAtTime(on ? (cfg.eqGainDb ?? -4.5) : 0, when, 0.14);
    this.#record('SPEECH_FOCUS', { on: Boolean(on), when, cooperatesWithHostDucking: true });
    return when;
  }

  async #applyContext(snapshot) {
    if (snapshot.seq <= this.seq) return this.getEvidence();
    this.seq = snapshot.seq;
    this.context = snapshot;
    const resolution = resolveFamily({ context: snapshot, registry: this.registry, previousFunction: this.functionState, previousFamily: this.familyId });
    const changedFunction = resolution.function !== this.functionState;
    this.functionState = resolution.function;
    if (resolution.familyId && resolution.familyId !== this.familyId) {
      try { await this.#loadFamily(resolution.familyId); }
      catch (error) { this.#recordError(error, { familyId: resolution.familyId, seam: 'SET_CONTEXT' }); }
    }
    if (resolution.function === 'TALKING') this.setSpeechFocus(true, { boundary: 'BEAT' });
    else if (this.speechFocus) this.setSpeechFocus(false, { boundary: 'BAR' });
    this.#record('CONTEXT', { seq: snapshot.seq, function: resolution.function, familyId: resolution.familyId, reason: resolution.reason, changedFunction });
    return this.getEvidence();
  }

  setContext(snapshot) {
    validateContext(snapshot);
    return this.#enqueue(() => this.#applyContext(snapshot));
  }

  emit(event) {
    validateEvent(event);
    return this.#enqueue(async () => {
      if (event.seq <= this.eventSeq) return this.getEvidence();
      this.eventSeq = event.seq;
      this.#record('EVENT', { eventType: event.type, seq: event.seq, sourceId: event.sourceId || null, intensity01: clamp(event.intensity01) });
      if (event.type === 'DIALOGUE_START') {
        const resolution = resolveEventFamily({ type: event.type, context: this.context, registry: this.registry, previousFamily: this.familyId });
        this.functionState = 'TALKING';
        if (resolution.familyId && resolution.familyId !== this.familyId) {
          try { await this.#loadFamily(resolution.familyId); }
          catch (error) { this.#recordError(error, { familyId: resolution.familyId, seam: 'DIALOGUE_START' }); }
        }
        this.setSpeechFocus(true, { boundary: 'BEAT' });
      } else if (event.type === 'DIALOGUE_END') {
        this.setSpeechFocus(false, { boundary: 'BAR' });
        if (this.context) await this.#applyContext({ ...this.context, seq: this.seq + 1 });
      } else if (event.type === 'POI_DISCOVERED') {
        const resolution = resolveEventFamily({ type: event.type, context: this.context, registry: this.registry, previousFamily: this.familyId });
        this.functionState = 'POI_DISCOVERY';
        if (resolution.familyId && resolution.familyId !== this.familyId) {
          try { await this.#loadFamily(resolution.familyId); }
          catch (error) { this.#recordError(error, { familyId: resolution.familyId, seam: 'POI_DISCOVERED' }); }
        }
      }
      return this.getEvidence();
    });
  }

  getCapabilities() {
    const verified = Object.entries(this.registry.families || {}).filter(([, family]) => isRuntimeVerified(family));
    return {
      schema: 'kfb.audio.capabilities.v1', contextSchema: 'kfb.audio.context.v1', eventSchema: 'kfb.audio.event.v1',
      createsAudioContext: false, audioContextOwner: 'HOST_INJECTED', adaptiveMusic: true, speechFocus: true,
      masterFallback: true, sharedLoopEnd: true, quantizedTransitions: ['NOW', 'BEAT', 'BAR', 'PHRASE'],
      families: verified.map(([key, family]) => ({ key, id: family.id, status: family.status, functionHints: family.functionHints || [] })),
      functions: [...new Set(verified.flatMap(([, family]) => family.functionHints || []))]
    };
  }

  getEvidence() {
    const current = this.current;
    return {
      schema: 'kfb.audio.evidence.v1', contextSeq: this.seq, eventSeq: this.eventSeq,
      resolvedFunction: this.functionState, familyId: this.familyId, audioContextState: this.ctx.state,
      audioContextOwner: 'HOST_INJECTED', moduleCreatedAudioContexts: 0,
      clock: current?.clock.snapshot(this.ctx.currentTime) || null,
      alignment: current ? {
        count: current.durations.length, minSeconds: Math.min(...current.durations), maxSeconds: Math.max(...current.durations),
        deltaMs: current.deltaMs, sampleRates: [...new Set(current.sampleRates)], channelCounts: [...new Set(current.channelCounts)],
        sharedLoopEnd: current.sharedLoopEnd,
        loopTailTrimSeconds: current.decodedMinDuration - current.sharedLoopEnd,
        loopPolicy: current.family.loopPolicy || 'SHARED_MIN_DURATION'
      } : null,
      playbackMode: current?.playbackMode || null, fallbackReason: current?.fallbackReason || null,
      activeRoles: current ? [...current.voices.keys()] : [], speechFocus: this.speechFocus,
      retiringDecks: this.retiring.size, errors: [...this.errors], log: this.log.slice(-40)
    };
  }

  async suspend() { if (this.ctx.state === 'running') await this.ctx.suspend(); }
  async resume() { if (this.ctx.state === 'suspended') await this.ctx.resume(); }

  dispose() {
    return this.#enqueue(async () => {
      this.disposed = true;
      await this.#stopFamily();
      for (const deck of [...this.retiring]) this.#retireDeck(deck, this.ctx.currentTime + 0.02);
      try { this.graph.music.disconnect(); } catch {}
      try { this.graph.eq.disconnect(); } catch {}
      try { this.graph.master.disconnect(); } catch {}
    });
  }
}

export function createKfbAudioRuntime(options) { return new KfbAudioRuntime(options); }
