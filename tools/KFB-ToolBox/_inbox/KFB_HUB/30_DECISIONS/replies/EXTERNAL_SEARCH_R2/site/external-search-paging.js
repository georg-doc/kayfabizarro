// The upstream offset is per source, whereas limit truncates the merged list.
// Query sources separately so advancing a page never skips the discarded merge tail.
export const WINDOW_SIZE = 36;
export function pageSize(id, offset) {
  const boundary = id === 'threedtexel' ? 50 : id === 'texturescom' ? 200 : 24;
  return Math.min(24, boundary - offset % boundary);
}
export function createSearchPager({ request, onChange = () => {} }) {
  let generation = 0, aborter;
  const state = { results: [], sources: [], visible: WINDOW_SIZE, loading: false, config: null };
  const notify = () => onChange(state);
  const canFetch = () => state.sources.some(s => !s.done);
  async function reset(config, providers) {
    generation++; aborter?.abort(); aborter = new AbortController();
    Object.assign(state, { results: [], sources: providers.map(p => ({ id: p.id, name: p.name, offset: 0, done: false, status: 'waiting', seen: new Set() })), visible: WINDOW_SIZE, loading: false, config: { ...config } });
    notify(); return fetchRound();
  }
  async function fetchRound() {
    if (state.loading || !canFetch()) return;
    const token = generation, signal = aborter.signal, config = state.config;
    const queue = state.sources.filter(s => !s.done);
    state.loading = true; notify();
    async function worker() {
      while (queue.length && token === generation && !signal.aborted) {
        const source = queue.shift(), limit = pageSize(source.id, source.offset);
        source.status = 'loading'; notify();
        try {
          const payload = await request({ ...config, providers: source.id, limit, offset: source.offset }, signal);
          if (token !== generation) return;
          const report = payload.providers?.find(r => r.provider === source.id);
          if (!report) throw new Error('No source report returned');
          Object.assign(source, { status: report.status, total: report.total, searchUrl: report.searchUrl, error: report.error });
          if (['error', 'timeout'].includes(report.status)) { notify(); continue; }
          if (['link', 'skipped'].includes(report.status)) { source.done = true; notify(); continue; }
          const rows = (payload.results || []).filter(a => a && typeof a.id === 'string' && a.type === 'model');
          const fresh = rows.filter(a => !source.seen.has(a.id));
          rows.forEach(a => source.seen.add(a.id));
          const known = new Set(state.results.map(a => a.id));
          const candidates = fresh.filter(a => (!config.free || a.price?.free === true) && (!config.downloadable || a.downloadable === true));
          for (const asset of candidates) if (!known.has(asset.id)) { state.results.push(asset); known.add(asset.id); }
          source.offset += limit;
          // Empty filtered pages are not proof of exhaustion. A finite provider
          // total is a claim, not a global unique matching total.
          if (Number.isFinite(source.total) && source.offset >= source.total) source.done = true;
          if (rows.length && !fresh.length) { source.done = true; source.bound = 'Source repeats an earlier page; continue on source site.'; }
          if (source.id === 'freestylized' && source.offset >= 100) { source.done = true; source.bound = 'Search service exposes at most 100 entries from this source.'; }
          if (!rows.length && !source.done) source.note = 'No candidates in this batch; deeper search remains available.';
          else source.note = '';
        } catch (error) {
          if (token !== generation || signal.aborted) return;
          Object.assign(source, { status: 'error', error: error.message }); // Retry same offset.
        }
        if (token === generation) notify();
      }
    }
    try { await Promise.all(Array.from({ length: Math.min(3, queue.length) }, worker)); }
    finally { if (token === generation) { state.loading = false; notify(); } }
  }
  async function more() {
    if (state.loading) return;
    if (state.visible < state.results.length) { state.visible += WINDOW_SIZE; notify(); return; }
    state.visible += WINDOW_SIZE; return fetchRound();
  }
  return { state, reset, more, canFetch };
}
