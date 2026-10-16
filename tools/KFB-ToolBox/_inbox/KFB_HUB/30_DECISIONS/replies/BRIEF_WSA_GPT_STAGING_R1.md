# Briefing WSA · GPT-Staging-Site R1 · WS1-Stände auf der Zielplattform statt Cloudflare

WS0 → WSA (Georgs Arbeit auf der OpenAI/GPT-Plattform) · 16.10.2026 · V-356. Georg: Cloudflare-Vorschauen sind zu umständlich, zu langsam, fehleranfällig (Timeouts) und sollen aus dem Produktionsprozess raus; die Zielplattform ist eine GPT-Site (Lean Memory, User Journey, Spielstände, Konfigurationen).

## Ziel
Eine **Staging-Site auf der GPT-Plattform**, die jeden geprüften WS1-Stand automatisch übernimmt und Georg zum Testen zeigt – so wie später die echte Site. Damit stimmen sich Update- und Modul-Prozess schon jetzt ab.

## Schnittstelle (von WS1 vorgeschlagen, von WS0 bestätigt)
- WS1 legt jeden geprüften Stand auf Branch `ws1/preview` im Repo `georg-doc/kayfabizarro`: `index.html` (Einzeldatei, heute ≈ 18 MB) plus neu `build.json`:
```json
{ "schema": "kfb.ws1-build/1", "commit": "<sha>", "date": "2026-10-16T17:00:00Z", "tests": "23/23",
  "links": { "stage": "#stage,actors=fb,dialog=6", "m1": "#m1", "car": "#m1,car", "lineup": "#stage,lineup=1" },
  "notes": "kurzer deutscher Satz, was neu ist" }
```
- Falls die Plattform keine 18-MB-Einzeldatei nimmt: mehrteiliger Build (25 Dateien, größte 5,6 MB) im Ordner `dist/` auf demselben Branch, `build.json` nennt dann `"entry": "dist/index.html"`.

## Auftrag an WSA
1. **Plattform prüfen und berichten** (ein kurzer Abschnitt je Punkt): Wer hat Zugriff (Georg; können Claude-Sitzungen lesen)? Größen-Grenzen (Einzeldatei, gesamt)? Erlaubt die Seite Laufzeit-Abrufe von `raw.githubusercontent.com` (Modelle, Kartenbilder) und `api.github.com` (Dialog-Pool)? Wenn nicht: was müsste ins Bündel? Persistenz-API für Spielstände/Konfiguration/`kfb.world/1`?
2. **Staging-Seite bauen:** liest `build.json` von `ws1/preview`, zeigt Stand, Datum, Tests, Notiz und die Links als Knöpfe, lädt das Bündel, hält die letzten 5 Stände abrufbar (Rückfall bei Fehlern). Kein Umbau des WS1-Codes, nur ausliefern.
3. **Abnahme:** Georg öffnet die Staging-URL, sieht den neuesten Stand in ≤ 30 s, kann Bühne/M1/Fahrprobe per Knopf starten; ein neuer WS1-Push erscheint ohne Handarbeit.
4. Ergebnis als `WSA_GPT_STAGING_R1_RETURN.md` im Register-Branch (`replies/`), mit Staging-URL.

## Bis dahin
Cloudflare `ws1-preview` bleibt nur Rückfall, bis die Staging-Site läuft; danach nimmt WS0 Cloudflare aus dem Prozess (V-314 wird abgelöst).
