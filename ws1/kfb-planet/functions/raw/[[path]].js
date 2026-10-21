// MVP-Site (V-618: „keine Laufzeit-Abrufe von raw.githubusercontent.com“) · Der Browser lädt Repo-Dateien über /raw/<ref>/<pfad> von dieser Site;
// die Funktion holt sie serverseitig aus georg-doc/kayfabizarro (mit GH_READ_TOKEN, falls gesetzt – nötig, sobald das Repo privat ist, V-599)
// und legt sie in den Cloudflare-Cache. Nur dieses eine Repo, nur GET. Der Passwortschutz (_middleware.js) gilt auch hier.
const REPO = 'georg-doc/kayfabizarro'
export async function onRequestGet({ request, params, env, waitUntil }) {
  const parts = [].concat(params.path || []); if (parts.length < 2 || parts.some((p) => p === '..' || p === '')) return new Response('Pfad ungültig', { status: 400 })
  const cache = caches.default, key = new Request(new URL(request.url).toString(), { method: 'GET' })
  const hit = await cache.match(key); if (hit) return hit
  const url = `https://raw.githubusercontent.com/${REPO}/${parts.map(encodeURIComponent).join('/')}`
  const res = await fetch(url, { headers: env.GH_READ_TOKEN ? { Authorization: `token ${env.GH_READ_TOKEN}` } : {} })
  if (!res.ok) return new Response(`Nicht gefunden (${res.status})`, { status: res.status === 404 ? 404 : 502 })
  const pinned = /^[0-9a-f]{40}$/.test(parts[0]) // Commit-gepinnte Pfade ändern sich nie
  const out = new Response(res.body, { status: 200, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream', 'Cache-Control': pinned ? 'public, max-age=31536000, immutable' : 'public, max-age=600' } })
  waitUntil(cache.put(key, out.clone())); return out
}
