#!/usr/bin/env python3
"""Schreibt <track>.gate.txt: exakte Befehle, Exit-Codes, Gate-Version/sha256, Quell-Pins und volle Ausgabe (Lyrics + STYLE).
  python3 gate_report.py <deck>/<deck>.<rev> [--batch <style.txt> ...]"""
import hashlib, json, os, subprocess, sys, datetime
H = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(H, "../../../../../../.."))
GATE = os.path.join(H, "..", "song_gate.py")
stem = os.path.join(H, sys.argv[1]) if not os.path.isabs(sys.argv[1]) else sys.argv[1]
batch = sys.argv[sys.argv.index("--batch") + 1:] if "--batch" in sys.argv else []
sl = json.load(open(stem + ".songlines.json", encoding="utf-8"))
deck = os.path.join(ROOT, sl["sourcePins"]["deck"]["path"])
media = os.path.join(ROOT, sl["sourcePins"]["media"]["path"])
rel = lambda p: os.path.relpath(p, ROOT)
cmds = [["python3", rel(GATE), "lyrics", rel(stem + ".suno.txt"), "--deck", rel(deck), "--songlines", rel(stem + ".songlines.json"),
         "--media", rel(media), "--corpus", rel(os.path.join(H, "..", "SONG_CRITICS_R3")), rel(os.path.join(H, "..", "SONGS_BESTOF_R1"))],
        ["python3", rel(GATE), "style", rel(stem + ".style.txt"), "--deck", rel(deck), "--songlines", rel(stem + ".songlines.json")]
        + (["--batch"] + [rel(os.path.join(H, b)) for b in batch] if batch else [])]
sha = lambda p: hashlib.sha256(open(p, "rb").read()).hexdigest()
out = [f"# Gate-Bericht {os.path.basename(stem)} · {datetime.date.today().isoformat()}",
       f"gate song_gate.py sha256 {sha(GATE)}", f"deck pin {sl['sourcePins']['deck']['path']} sha256 {sl['sourcePins']['deck']['sha256']}",
       f"media pin {sl['sourcePins']['media']['path']} sha256 {sl['sourcePins']['media']['sha256']}",
       f"lyrics sha256 {sha(stem + '.suno.txt')} · {len(open(stem + '.suno.txt', encoding='utf-8').read())} Zeichen (Unicode len)",
       f"style sha256 {sha(stem + '.style.txt')}", ""]
code = 0
for c in cmds:
    p = subprocess.run(c, cwd=ROOT, capture_output=True, text=True)
    code |= p.returncode
    out += ["$ " + " ".join(f"'{x}'" if " " in x or "(" in x else x for x in c), f"exit {p.returncode}", p.stdout.rstrip(), ""]
open(stem + ".gate.txt", "w", encoding="utf-8").write("\n".join(out) + "\n")
print(f"{os.path.basename(stem)}.gate.txt geschrieben · exit {code}")
sys.exit(code)
