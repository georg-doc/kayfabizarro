#!/usr/bin/env node
// Leg times from shoot.mjs logs of the demo route scripts: t(arrive until met) − t(go marker), wall-clock seconds of
// held keys, plus the player's end position vs the landmark.
//   node src/modules/demo/tools/times.mjs tools/out/demo/r2/m42_bridge_run.json [...]
import fs from 'node:fs';

for (const f of process.argv.slice(2)) {
  const log = JSON.parse(fs.readFileSync(f, 'utf8'));
  const tr = log.inputTrace ?? [];
  const go = tr.find((e) => e.step?.mark?.startsWith('go:'));
  const ai = tr.findIndex((e) => e.step?.mark?.startsWith('arrive:'));
  const met = ai >= 0 ? tr.slice(ai + 1).find((e) => e.until) : null;
  const timeouts = tr.filter((e) => e.until === 'timeout').length;
  const end = log.shots?.find((s) => s.file?.endsWith('__end.jpg'))?.player?.pos ?? null;
  const fps = log.shots?.map((s) => s.fps).filter(Boolean);
  console.log(JSON.stringify({
    file: f.split('/').pop(),
    leg: go?.step?.mark ?? null,
    seconds: go && met ? +((met.t - go.t) / 1000).toFixed(1) : null,
    arrived: met?.until ?? null,
    timeouts,
    end,
    fps,
    errors: (log.consoleErrors?.length ?? 0) + (log.pageErrors?.length ?? 0),
    fatal: log.fatal ?? null,
  }));
}
