# TEST_REPORT · KFB Motor Grid R1 · V-378

Date: 2026-10-17 (Europe/Berlin)
State: **SOURCE VALIDATION PASS / ELEVENLABS GENERATION NOT RUN**

## Executed evidence
- Actual GitHub-source JS/static checks: **16 / 16 PASS**. Checked current branch source and generator, full 12x4 candidate roster, 24 loops, 24 one-shots, v2 model and prompt influence, duration limits, safe destination, no automatic paid retries and explicit `--execute` credential gate.
- GitHub Actions workflow `KFB Racer Motor Grid R1 — offline contract`: [run 38980028515](https://github.com/georg-doc/kayfabizarro/actions/runs/38980028515), created on tests commit `c3711a0f9f991c8fbdcc9747301b42db27e11b44`. **SUCCESS: Python compile, 10/10 unittests, and CLI 48-file dry-run PASS**.
- Python unittest definitions: **10**, automated CLI syntax/unittest/dry-run are CI targets, **10/10 PASS**; GitHub job 117238456731 log confirms `Ran 10 tests in 0.706s`, `OK` and `V-378 PASS: 48 expected files, 0 API requests, 0 credits`.
- Real ElevenLabs API executions: **0**. Generated MP3s: **0/48**. Audible seam/frequency/RPM measurements: **NOT_RUN**.
- No key read, no secret uploaded, no Studio or Stage execution.

## Next acceptance evidence after authentic generation
For each of the 48 named MP3 files collect byte SHA-256, decoded duration, level/clipping, pitch/RPM estimate, loop seam measurements/listening (for 24 loops), transient tail/onset (for 24 one-shots). WS0 should curate a consistent shared engine family rather than blindly choose one "best" per RPM. Preserve human-preferred legacy V8 idle for independent comparison.

## Evidence limitations
Source checks validate **request planning and safeguards**, not actual ElevenLabs API response behavior, sound quality, seam quality, musical drift or runtime effect.
