// MVP-Site (V-618, Georg 22.10.: „erstmal KISS per PW, später E-Mail“) · Passwortschutz für ALLE Adressen dieses Pages-Projekts (Seite, Assets, /raw-Proxy).
// Name und Passwort stehen NIE im Repo: Cloudflare-Pages-Umgebung SITE_USER und SITE_PASS (als Secret gesetzt von Georg im Dashboard).
// Fehlen sie, ist die Site gesperrt (lieber zu als offen).
const enc = new TextEncoder()
async function same(a, b) { // gleichlange Hash-Vergleiche (kein Zeit-Leck über die Länge)
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))])
  const u = new Uint8Array(x), v = new Uint8Array(y); let d = 0; for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i]; return d === 0
}
export async function onRequest({ request, env, next }) {
  const user = env.SITE_USER, pass = env.SITE_PASS
  if (!user || !pass) return new Response('Site gesperrt: SITE_USER/SITE_PASS fehlen in der Pages-Umgebung.', { status: 503 })
  const h = request.headers.get('Authorization') || ''
  if (h.startsWith('Basic ')) {
    let dec = ''; try { dec = new TextDecoder().decode(Uint8Array.from(atob(h.slice(6)), (c) => c.charCodeAt(0))) } catch (e) { dec = '' }
    const i = dec.indexOf(':')
    if (i > 0 && (await same(dec.slice(0, i), user)) & (await same(dec.slice(i + 1), pass))) return next()
  }
  return new Response('Anmeldung nötig', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Kayfabizarro MVP", charset="UTF-8"', 'Cache-Control': 'no-store' } })
}
