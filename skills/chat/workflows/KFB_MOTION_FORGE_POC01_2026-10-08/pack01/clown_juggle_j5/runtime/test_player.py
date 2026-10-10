"""Headless proof for kfb_prop_track_player.js: skeleton + prop tracks in three.js vs Blender truth,
held-prop-in-hand check, state machine run, screenshots. Usage: python3 test_player.py (serves this folder)."""
import json, threading, http.server, socketserver, functools, os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
TRUTH = json.load(open(os.path.join(ROOT, 'blender_truth.json')))
PORT = 8765
socketserver.TCPServer.allow_reuse_address = True

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

SERVER = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=ROOT))
PORT = SERVER.server_address[1]
threading.Thread(target=SERVER.serve_forever, daemon=True).start()
STATE = {v: k for k, v in {'juggle': 'kfb_clown_juggle_cascade3_d', 'stop': 'kfb_clown_juggle_stop_j5',
                           'talk': 'kfb_clown_juggle_talk_j5', 'resume': 'kfb_clown_juggle_resume_j5'}.items()}
JS_CHECK = """
(truth) => {
  const T = window.__THREE, P = window.__perf, A = window.__actor; window.__manual = true;
  const Ci = (p) => new T.Vector3(p[0], p[2], -p[1]);           // Blender actor space -> glTF actor space
  const local = (o, p = new T.Vector3()) => A.worldToLocal(o.localToWorld(p.clone()));
  const out = { bones: 0, verts: 0, held: {}, seq: [], maxJump: 0 };
  for (const t of truth.bones) {
    P.seek(t.state, t.f);
    for (const [b, p] of Object.entries(t.bones)) {
      const o = A.getObjectByName(b.replace('.', ''));
      out.bones = Math.max(out.bones, local(o).distanceTo(Ci(p)));
    }
  }
  for (const t of truth.verts) {
    P.seek(t.state, t.f);
    const o = P.props[t.i];
    t.local.forEach((lv, k) => { out.verts = Math.max(out.verts, local(o, Ci(lv)).distanceTo(Ci(t.actor[k]))); });
  }
  // held check: grip point (glTF local (0,-grip,0)) vs the nearest handslot, per clip
  const grip = new T.Vector3(0, -truth.grip, 0);
  for (const st of ['juggle', 'stop', 'talk', 'resume']) {
    const n = P.tracks.clips[P.states[st]].frames; let near = 0, dmin = 9;
    for (let f = 0; f < n; f++) {
      P.seek(st, f);
      const hs = ['handslotr', 'handslotl'].map((b) => local(A.getObjectByName(b)));
      for (const o of P.props) {
        const g = local(o, grip); const d = Math.min(...hs.map((h) => h.distanceTo(g)));
        if (d < 0.02) near++; dmin = Math.min(dmin, d);
      }
    }
    out.held[st] = { frames: n, propFramesInHand: near, of: n * 3, minDist: +dmin.toFixed(5) };
  }
  // state machine run at 60 fps: line requested at 1.0 s, finished at 6.0 s
  P.seek('juggle', 0); let prev = P.props.map((o) => local(o)), t = 0, last = '', asked = false, done = false;
  for (let k = 0; k < 60 * 16; k++) {
    if (!asked && t >= 1.0) { P.requestLine(); asked = true; }
    if (!done && t >= 6.0) { P.endLine(); done = true; }
    P.update(1 / 60); t = (k + 1) / 60;
    const cur = P.props.map((o) => local(o));
    const j = Math.max(...cur.map((c, i) => c.distanceTo(prev[i])));
    if (j > out.maxJump) { out.maxJump = j; out.maxJumpAt = [+t.toFixed(3), P.state, Math.floor(P.frame)]; }
    prev = cur;
    const tag = P.state + (P.talkWindowOpen ? '+talk' : '');
    if (tag !== last) { out.seq.push([+t.toFixed(3), tag, Math.floor(P.frame)]); last = tag; }
  }
  return out;
}
"""

with sync_playwright() as pw:
    b = pw.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 960, 'height': 540})
    logs = []; pg.on('console', lambda m: logs.append(m.text)); pg.on('pageerror', lambda e: logs.append('ERR ' + str(e)))
    pg.goto(f'http://127.0.0.1:{PORT}/index.html?w=960&h=540')
    pg.wait_for_function('window.__ready === true', timeout=60000)
    res = pg.evaluate(JS_CHECK, TRUTH)
    os.makedirs(os.path.join(ROOT, 'shots'), exist_ok=True)
    for st, f in (('juggle', 0), ('juggle', 6), ('juggle', 13), ('juggle', 20), ('stop', 10), ('talk', 36), ('resume', 24)):
        pg.evaluate(f"() => {{ window.__perf.seek('{st}', {f}); window.__render(); }}")
        pg.screenshot(path=os.path.join(ROOT, 'shots', f'{st}_{f:03d}.png'))
    b.close()
res['console'] = logs[-5:]
print(json.dumps(res, indent=1))
