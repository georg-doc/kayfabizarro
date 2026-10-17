#!/usr/bin/env python3
"""WSB B1 proof server: serves the B1 job folder read-only and accepts
POST /save/<relpath> (PNG/JPEG/JSON bodies) into renders/, data/ or _frames/ only.
Usage: python3 -I wsb_proof_server.py <port>   (never 5180 / 5192)"""
import http.server, os, sys, base64

ROOT = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))
WRITABLE = ('renders/', 'data/', '_frames/')


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, fmt, *args):
        if self.command == 'POST':
            sys.stderr.write('%s\n' % (fmt % args))

    def do_POST(self):
        if not self.path.startswith('/save/'):
            return self.send_error(404)
        rel = self.path[len('/save/'):].split('?')[0]
        if '..' in rel or not rel.startswith(WRITABLE):
            return self.send_error(403, 'path not writable')
        dst = os.path.realpath(os.path.join(ROOT, rel))
        if not dst.startswith(ROOT + os.sep):
            return self.send_error(403)
        body = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        if body.startswith(b'data:'):
            body = base64.b64decode(body.split(b',', 1)[1])
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(dst, 'wb') as f:
            f.write(body)
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'%d' % len(body))


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5241
    assert port not in (5180, 5192)
    http.server.ThreadingHTTPServer(('127.0.0.1', port), H).serve_forever()
