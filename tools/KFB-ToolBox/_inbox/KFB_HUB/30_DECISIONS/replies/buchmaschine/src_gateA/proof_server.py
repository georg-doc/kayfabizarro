# Probebühne: liefert den scratchpad aus und nimmt Einzelbilder per POST /save?f=<ordner>/<name>.png an (nur unter frames/).
import http.server, os, sys, urllib.parse, base64
ROOT = sys.argv[2]
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def end_headers(s): s.send_header('Cache-Control', 'no-store'); super().end_headers()
    def do_POST(s):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(s.path).query); f = q.get('f', [''])[0]
        if not f or '..' in f or f.startswith('/'): s.send_error(400); return
        p = os.path.join(ROOT, 'frames', f); os.makedirs(os.path.dirname(p), exist_ok=True)
        data = s.rfile.read(int(s.headers['Content-Length']))
        if data.startswith(b'data:'): data = base64.b64decode(data.split(b',', 1)[1])
        open(p, 'wb').write(data); s.send_response(204); s.end_headers()
    def log_message(s, *a): pass
http.server.ThreadingHTTPServer(('127.0.0.1', int(sys.argv[1])), H).serve_forever()
