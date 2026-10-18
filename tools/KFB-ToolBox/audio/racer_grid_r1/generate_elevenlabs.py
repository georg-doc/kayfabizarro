#!/usr/bin/env python3
"""V-378 · Generate 48 ElevenLabs Racer sound candidates; no runtime integration.

No third-party Python packages. Requires ELEVENLABS_API_KEY only with --execute.
Every POST creates ONE candidate. Four distinct calls per effect, not one call
with an invented variants parameter. Never retry ambiguous paid POST failures.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request

REPO_ROOT = Path(__file__).resolve().parents[4]
SOURCE = REPO_ROOT / "media/3D_Assets/Audio/KFB Racer/grid_r1/SOURCE.json"
ENDPOINT = "https://api.elevenlabs.io/v1/sound-generation"


def load_source(path=SOURCE):
    src = json.loads(Path(path).read_text(encoding="utf-8"))
    effects = src["sound_effects"]
    if src["model_id"] != "eleven_text_to_sound_v2":
        raise ValueError("Only the approved ElevenLabs Sound Effects v2 model is allowed")
    if src["variant_count"] != 4 or len(effects) != 12:
        raise ValueError("V-378 must have exactly twelve effects and four variants")
    if not 0.0 <= src["prompt_influence"] <= 1.0:
        raise ValueError("Invalid prompt influence")
    if src["output_format"] != "mp3_44100_128":
        raise ValueError("Review output_format before generating")
    expected_loops = {"01_idle", "02_low", "03_mid", "04_high", "05_coast", "12_hover"}
    ids = [e["id"] for e in effects]
    if len(set(ids)) != 12 or set(e["id"] for e in effects if e["loop"]) != expected_loops:
        raise ValueError("Effect IDs or loop flags differ from V-378")
    for e in effects:
        if not re.fullmatch(r"[0-9]{2}_[a-z_]+", e["id"]):
            raise ValueError("Unsafe effect filename")
        if len(e["text"]) > 450 or not (0.5 <= e["duration_seconds"] <= 30):
            raise ValueError("Prompt/duration outside ElevenLabs limits")
        if e["loop"] and e["duration_seconds"] != 10:
            raise ValueError("All V-378 loops must be exactly 10 seconds")
        if not e["loop"] and not (1 <= e["duration_seconds"] <= 2):
            raise ValueError("V-378 one-shots must be 1–2 seconds")
    return src


def payload_for(src, effect):
    return {
        "text": effect["text"],
        "loop": effect["loop"],
        "duration_seconds": effect["duration_seconds"],
        "prompt_influence": src["prompt_influence"],
        "model_id": src["model_id"],
    }


def plan(src):
    for effect in src["sound_effects"]:
        for i in range(1, src["variant_count"] + 1):
            yield effect, i, effect["id"] + "_v" + str(i).zfill(2) + ".mp3"


def sha256_bytes(data):
    return hashlib.sha256(data).hexdigest()


def write_atomic(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tempname = tempfile.mkstemp(prefix=".kfb-", dir=path.parent)
    try:
        with os.fdopen(fd, "wb") as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(tempname, path)
    finally:
        if os.path.exists(tempname):
            os.unlink(tempname)


def make_request(key, src, effect, opener=urllib.request.urlopen):
    url = ENDPOINT + "?" + urllib.parse.urlencode({"output_format": src["output_format"]})
    req = urllib.request.Request(
        url=url,
        data=json.dumps(payload_for(src, effect)).encode("utf-8"),
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        method="POST",
    )
    # A timeout after sending a paid request is UNKNOWN. Do NOT auto-retry.
    with opener(req, timeout=120) as response:
        audio = response.read()
        billed = response.headers.get("character-cost")
        mime = response.headers.get("Content-Type", "")
    if not (audio.startswith(b"ID3") or
            (len(audio) > 2 and audio[0] == 255 and (audio[1] & 224) == 224)):
        raise RuntimeError("Response is not recognisable MP3; do not save or retry blindly")
    if len(audio) < 1024:
        raise RuntimeError("Suspiciously short MP3; stop for inspection")
    return audio, billed, mime


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true", help="Make billable ElevenLabs API calls")
    parser.add_argument("--max-calls", type=int, default=48, help="Max NEW paid POST requests in this invocation (1..48)")
    args = parser.parse_args(argv)
    if not 1 <= args.max_calls <= 48:
        parser.error("--max-calls must be 1..48")
    src = load_source()
    out_dir = REPO_ROOT / src["relative_output_dir"]
    manifest_path = out_dir / "GENERATION_MANIFEST.json"
    candidates = list(plan(src))
    if not args.execute:
        print(json.dumps({
            "mode": "DRY_RUN__NO_API_CALLS",
            "calls_planned": len(candidates),
            "loops": sum(e["loop"] for e, _, _ in candidates),
            "one_shots": sum(not e["loop"] for e, _, _ in candidates),
            "planned_files": [filename for _, _, filename in candidates],
            "output_dir": str(out_dir),
        }, indent=2))
        return 0
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        parser.error("ELEVENLABS_API_KEY is required; never commit a key")
    if manifest_path.exists():
        history = json.loads(manifest_path.read_text(encoding="utf-8"))
        if history.get("schema") != "kfb.racer.motor_grid.generated.r1":
            raise RuntimeError("Unknown manifest: stop rather than overwrite")
    else:
        history = {"schema": "kfb.racer.motor_grid.generated.r1",
                   "source_file": "SOURCE.json", "source_sha256": sha256_bytes(SOURCE.read_bytes()),
                   "generated": {}}
    if history["source_sha256"] != sha256_bytes(SOURCE.read_bytes()):
        raise RuntimeError("SOURCE changed since prior generation; stop instead of mixing candidates")
    new_calls = 0
    for effect, variant, filename in candidates:
        target = out_dir / filename
        record = history["generated"].get(filename)
        if target.exists():
            if record and record["sha256"] == sha256_bytes(target.read_bytes()):
                continue
            raise RuntimeError("Untracked or modified existing MP3; inspect: " + filename)
        if record:
            raise RuntimeError("Manifest claims audio exists but file is missing: " + filename)
        if new_calls >= args.max_calls:
            break
        print("GENERATE " + filename, flush=True)
        try:
            audio, billed, mime = make_request(key, src, effect)
        except Exception as exc:
            print("STOP: POST outcome may be unknown; inspect account/history before retry: " + repr(exc),
                  file=sys.stderr)
            return 2
        write_atomic(target, audio)
        history["generated"][filename] = {
            "effect_id": effect["id"], "variant": variant, "sha256": sha256_bytes(audio),
            "bytes": len(audio), "duration_requested_s": effect["duration_seconds"],
            "loop_requested": effect["loop"], "character_cost_header": billed,
            "response_content_type": mime, "status": "GENERATED__NOT_QA_APPROVED"
        }
        write_atomic(manifest_path, (json.dumps(history, indent=2, ensure_ascii=False) + "\n").encode("utf-8"))
        new_calls += 1
    print(json.dumps({
        "new_api_calls": new_calls, "completed_candidates": len(history["generated"]),
        "expected_candidates": len(candidates), "manifest": str(manifest_path),
        "qa": "NOT_RUN__WS0_MUST_LISTEN_AND_MEASURE_PITCH_SEAM"
    }, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
