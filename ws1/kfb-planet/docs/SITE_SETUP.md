# MVP-Site einrichten (Cloudflare Pages, privat, mit Passwort) · V-618 · RÜCKFALL

> **Stand 22.10.:** Zielplattform ist die GPT-Site, die ein WSA-Work-Job aufsetzt (Georg). Siehe `docs/HANDOFF_GPT_SITE_R1.md`. Diese Anleitung nur nutzen, wenn wir auf Cloudflare zurückfallen.

Das Spiel liegt als Branch **`game/mvp-r1`** im privaten Repo **georg-doc/KFB-Stunt-Car-Race**. Die privaten Dateien (Figuren, Töne, Musik) holt der Build aus dem Branch `assets/private` desselben Repos. Ins öffentliche Repo `kayfabizarro` kommt davon nichts.

Diese Schritte macht Georg (Konto-Zugänge); WS1 hat keinen Zugang zu Cloudflare oder zu Token-Einstellungen.

## 1 · Lese-Token bei GitHub (einmalig)
GitHub → Settings → Developer settings → **Fine-grained tokens** → *Generate new token*
- Name: `kfb-mvp-site-build`, Laufzeit nach Wahl
- Repository access: **Only select repositories** → `georg-doc/KFB-Stunt-Car-Race`
- Permissions: **Contents: Read-only** (sonst nichts)
- Token kopieren (wird nur einmal angezeigt).

## 2 · Pages-Projekt anlegen
Cloudflare Dashboard → **Workers & Pages** → *Create* → **Pages** → *Connect to Git* → `georg-doc/KFB-Stunt-Car-Race`
- Projektname: z. B. `kfb-mvp`  → Adresse `kfb-mvp.pages.dev`
- **Production branch:** `game/mvp-r1`
- Framework preset: **None**
- **Build command:** `npm ci && node scripts/site/build-site.mjs`
- **Build output directory:** `dist`
- Root directory: leer lassen

**Wichtig – nur diesen Branch bauen:** Projekt → Settings → Builds & deployments → **Branch control** → *Preview branches*: **None**. (Das Repo hat sehr viele Branches; sonst baut Cloudflare jeden davon.)

## 3 · Umgebungsvariablen (Settings → Variables and Secrets, für Production)
| Name | Wert | Art |
|---|---|---|
| `NODE_VERSION` | `22` | Text |
| `ASSETS_TOKEN` | Token aus Schritt 1 | **Secret** |
| `SITE_USER` | `georg` | Text |
| `SITE_PASS` | dein Passwort | **Secret** |
| `GH_READ_TOKEN` | optional, erst nötig wenn kayfabizarro privat wird (V-599): Lese-Token mit Zugriff auf `georg-doc/kayfabizarro` | Secret |

Danach: Deployments → *Retry deployment* (oder neuer Commit auf `game/mvp-r1`).

## 4 · Was die Site tut
- **Passwort für alles:** `functions/_middleware.js` schützt jede Adresse des Projekts (Seite, Dateien, Ton, `/raw`). Ohne `SITE_USER`/`SITE_PASS` ist die Site gesperrt.
- **Repo-Dateien über die eigene Site:** Abrufe von raw.githubusercontent.com/jsDelivr laufen im Site-Build über `/raw/…` (Cloudflare-Cache).
- **Ton:** `scripts/audio/site-copy.mjs` (WS-Audio) legt die Töne und die Musik nach `dist/kfb-audio/` (Georg 22.10.: „ja, alles darf auf die Site“ – nur diese passwortgeschützte Site).
- **Bericht:** `https://<projekt>.pages.dev/site-build.json` (Commit, Dateizahl, größte Dateien). Pages-Grenze 25 MiB je Datei wird beim Bauen geprüft.

## 5 · Später
- E-Mail-Login (Cloudflare Access), sobald es Spielstände gibt (Georg).
- „Öffentlich“: Middleware entfernen bzw. Access umstellen – erst auf Georgs Wort.
