# Übernahmekarte · MVP-Site (WSA-GPT-Site)
Stand 24.10.2026 · Format nach `sessions/lead.md` (V-713). Schnappschuss; ausführlich in `docs/HANDOFF_GPT_SITE_R1.md` (Spiel-Repo, Stand 22.10., Ton-Teil überholt, siehe §2) und WS1_STATUS §156, §161, §166.

## 1 · Auftrag und Grenzen
- **Ziel:** Das MVP läuft auf der GPT-Site, die ein WSA-Work-Job aufsetzt (Georg 22.10.). Cloudflare Pages ist nur Rückfall (`docs/SITE_SETUP.md`, nicht eingerichtet).
- **WS1 liefert:** Spiel-Stand und Build. **WSA liefert:** die Plattform (Passwort, Hosting, Caching). **Georg:** setzt Passwort und `ASSETS_TOKEN` selbst, gibt Stände frei. WS1 hat keinen Zugang zu Plattform-Einstellungen oder Tokens.
- Öffentlich erlaubt (Georg 23.10.): Songs und Effekte. Gekaufte bzw. private Modelle nur aus dem privaten Repo, nie nach kayfabizarro.

## 2 · Repo, Zweig, Stand
| Was | Wo |
|---|---|
| Quelle | privates Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig **`game/mvp-r1`** = Schnappschuss von `kfb-planet` `ws1/mvp-r1` (je neuem Stand ein Commit, WS1 meldet ihn) |
| Aktuell empfohlen | `game/mvp-r1` **@3a6e010** (mvp 4f32c76, Reihe 75 PASS). Neuere mvp-Merges (HUD-Bilder, Disco-MC Talkbox, Band-Versatz, Site-Kassette 7353238) folgen mit dem nächsten Spiegel |
| Private Dateien | gleiches Repo, Zweig `assets/private` (@4e3a497): Figuren, private Quellen; der Build klont ihn flach mit `ASSETS_TOKEN` |
| Ton | **nicht im Paket**, zur Laufzeit von GitHub: kayfabizarro `assets/kfb-audio-r1` @36c5ae419 über jsDelivr `gh@…`, Rückfall raw (gepinnt in `scripts/audio/remote.json`). Musik AAC-LC 128 kbit/s |
| Öffentlicher Spiegel | kayfabizarro `ws1/mvp-r1` (Präfix `ws1/kfb-planet/`, ohne `src/private` und `src/private-gen`) |
| Was live ist | bei WSA bzw. WS0 erfragen; WS1 hat zuletzt @8119a2a (§156) und @6a594f8 (§161) gemeldet |

## 3 · Bauen und prüfen
- `npm ci && node scripts/site/build-site.mjs` (Node 22). Ohne `ASSETS_TOKEN`: Platzhalter-Build mit Warnung.
- Der Build erzeugt die HUD-Kassette aus `src/private` (`scripts/hud/shrink-cassette.mjs`, seit 7353238).
- Probe 24.10. (lokal, mvp 192bbb7): **124 Dateien, 45,4 MB**, größte Datei 7,45 MB (JS-Bündel), keine über 25 MiB. Bericht `dist/site-build.json`.
- Start-Adresse ohne Hash führt direkt ins Spiel (`#m1,harvest,look=terrain3,world=probe`); die alte Startseite nur mit `start`.
- **Achtung:** `build-site` überschreibt `dist`. Vor Browser-Tests danach `npm run build` (die Tests laden `dist`).
- Laufzeit-Anforderungen an die Plattform: siehe HANDOFF §3 (Passwort für alle Pfade, `/raw`-Proxy, Range für Ton, MIME `.glb`/`.m4a`, Abruf jsDelivr für pdfjs und Ton).

## 4 · Laufende Aufträge
- WSA-Einrichtung (Auftrag bei WS0, §156).
- Nach jedem gemergten Paket: Testreihe, Spiegel, Commit an WS0/WSA melden.

## 5 · Offen bei Georg / WS0 / WSA
- Ist die WSA-Site eingerichtet, unter welcher Adresse, welcher Stand läuft?
- Kritiker R4 auf der Live-Site (nach Einrichtung).
- Später: E-Mail-Login, sobald es Spielstände gibt; „öffentlich“ nur auf Georgs Wort.

## 6 · Sonderregeln (Verweise)
- Passwort und Tokens nie ins Repo, nie in Nachrichten; nur Plattform-Secrets (Georg setzt sie).
- Spiel nie ohne Hash öffnen (alte Zweige zeigten die Hex-Insel).
- Plumbing-Pushes nur mit geprüftem Commit (`"${C}:refs/…"`, `[ -n "$C" ]`, Elternprüfung).

## 7 · Nächster sinnvoller Schritt
WSA-Stand erfragen; danach den nächsten Spiegel (mit Chatter-Silben und HUD-Nacharbeit, sobald gemergt) als Site-Stand melden.
