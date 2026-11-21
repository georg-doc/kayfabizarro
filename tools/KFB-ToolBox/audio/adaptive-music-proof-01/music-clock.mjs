export const BOUNDARIES = Object.freeze({
  IMMEDIATE: 'IMMEDIATE',
  NEXT_BEAT: 'NEXT_BEAT',
  NEXT_BAR: 'NEXT_BAR',
  NEXT_PHRASE: 'NEXT_PHRASE'
});

export class MusicClock {
  constructor({ bpm, beatsPerBar = 4, phraseBars = 8, epoch = 0 } = {}) {
    if (!(bpm > 0)) throw new Error('MusicClock bpm must be > 0');
    this.bpm = Number(bpm);
    this.beatsPerBar = Number(beatsPerBar);
    this.phraseBars = Number(phraseBars);
    this.epoch = Number(epoch) || 0;
  }
  get beatSeconds() { return 60 / this.bpm; }
  get barSeconds() { return this.beatSeconds * this.beatsPerBar; }
  get phraseSeconds() { return this.barSeconds * this.phraseBars; }
  reset(epoch) { this.epoch = Number(epoch) || 0; return this; }
  elapsed(audioTime) { return Math.max(0, Number(audioTime) - this.epoch); }
  position(audioTime) {
    const elapsed = this.elapsed(audioTime);
    const beatFloat = elapsed / this.beatSeconds;
    const beatIndex = Math.floor(beatFloat + 1e-9);
    const barIndex = Math.floor(beatIndex / this.beatsPerBar);
    const phraseIndex = Math.floor(barIndex / this.phraseBars);
    return {elapsed,beatFloat,beatIndex,beatInBar:beatIndex%this.beatsPerBar,barIndex,barInPhrase:barIndex%this.phraseBars,phraseIndex};
  }
  nextBoundary(audioTime, mode = BOUNDARIES.NEXT_BAR, minLead = 0.045) {
    const now = Number(audioTime);
    if (mode === BOUNDARIES.IMMEDIATE) return now + Math.max(0,minLead);
    const step = mode === BOUNDARIES.NEXT_BEAT ? this.beatSeconds : mode === BOUNDARIES.NEXT_PHRASE ? this.phraseSeconds : this.barSeconds;
    const relative = Math.max(0, now - this.epoch);
    let n = Math.ceil((relative + Math.max(0,minLead)) / step - 1e-9);
    if (n < 1) n = 1;
    return this.epoch + n * step;
  }
  snapshot(audioTime) {
    const p=this.position(audioTime);
    return {bpm:this.bpm,beatsPerBar:this.beatsPerBar,phraseBars:this.phraseBars,epoch:this.epoch,beatSeconds:this.beatSeconds,barSeconds:this.barSeconds,phraseSeconds:this.phraseSeconds,...p};
  }
}
