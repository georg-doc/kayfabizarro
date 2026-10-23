# WS0 → WSA work · MVP als Site-Update auf der GPT-Site · R1 · 24.10.2026 (V-695)

**Tier 0**
1. **Ziel:** Den geprüften Spielstand `game/mvp-r1` mit Musik als Update der bestehenden WSA-work-GPT-Site veröffentlichen (V-624). Kein Cloudflare-Pages-Projekt.
2. **Leicht und über GitHub:** Ins Site-Paket kommen nur der Spielcode, die gekauften Figuren und gegebenenfalls die Töne (§2). Alles andere lädt das Spiel zur Laufzeit von GitHub über einen festen Commit.
3. **Passwort für alle Pfade**, Secret setzt Georg auf der Plattform. Zurück: Adresse, Tester-Zugang, Commit, Prüfliste. Nichts löschen, kein Merge.

---

## 1 · Quelle und Bau
- Repo `georg-doc/KFB-Stunt-Car-Race` (privat), Branch `game/mvp-r1`. Heute geprüft: `40e2ca4` (69 PASS, 60 fps, noch ohne Musik über GitHub). Veröffentlicht wird der Commit mit Musik, den WS1 meldet.
- Maßgeblich ist die Übergabe `docs/HANDOFF_GPT_SITE_R1.md` im selben Branch: §2 Bauen, §3 Laufzeit-Funktionen, §4 offene Fragen. Dieser Auftrag ändert daran nur die Paketgröße und die Herkunft der Inhalte (WS1 §154).
- Bau: `npm ci && node scripts/site/build-site.mjs` (Node 22), dazu `ASSETS_TOKEN` (nur Lesen auf KFB-Stunt-Car-Race) für die privaten Figuren.

## 2 · Paket und Laufzeit (Georg 23.10., WS1 §154)
- **Im Site-Paket:** Spielcode und die gekauften Figuren aus `assets/private`. Die Figuren bleiben privat; sie kommen nie nach kayfabizarro und nie in eine öffentliche Vorschau.
- **Von GitHub zur Laufzeit** über einen festen 40-stelligen Commit (unveränderlich, lange cachebar): Modelle aus freien Quellen wie heute, Karten, später die Musik. Alle Kauf-Assets bleiben im privaten Paket, auch die Mystery-Series-Props (V-426), und laufen nie über kayfabizarro.
  - Songs (Suno, Cozy Tunes) dürfen nach Georgs Freigabe ins öffentliche kayfabizarro.
  - **Mit Musik (Georg 24.10.).** Die Musik kommt kleiner kodiert (96–128 kbit/s, statt 228 MB etwa 50–70 MB) über GitHub; den Weg baut WS-Audio jetzt (V-696). WS1 meldet den Commit auf `game/mvp-r1`, in dem die Musik eingehängt ist. **Diesen Stand veröffentlichst du.** Bis dahin bereitest du Plattform, Passwort, Proxy und einen Probe-Build vor, veröffentlichst aber noch nicht.
  - Wenn der Build die Töne (~14 MB) getrennt von der Musik ins passwortgeschützte Site-Paket nehmen kann, nimm sie mit (Georgs Freigabe für die Site, Übergabe §2). Kauf-Töne laufen nie über das öffentliche kayfabizarro. Sonst baue mit `KFB_SITE_AUDIO=0` und sag WS1, was für die Trennung fehlt.
- **Laufzeit-Funktionen** wie in der Übergabe §3:
  - Passwort (Name `georg`, Secret nur auf der Plattform, ohne Secret gesperrt);
  - `/raw/<ref>/<pfad>`-Proxy auf kayfabizarro (das Site-Bündel schreibt raw- und jsDelivr-Abrufe darauf um, `src/siteRaw.js`; Token erst, wenn kayfabizarro privat ist, V-599);
  - Range für Ton, MIME-Typen, eine Seite mit Hash-Adressen, externer Abruf von `pdfjs-dist`.

  Fehlt der Plattform eine Funktion (z. B. Server-Funktionen für Passwort oder Proxy), halte an und melde es. Baue keinen Ersatzweg, ohne dass WS0 und Georg ihn freigegeben haben.

## 3 · Prüfen auf der laufenden Site
- Start ohne Konsolenfehler, Passwortabfrage greift auf allen Pfaden (Seite, Dateien, /raw).
- Laufen, Fahren, HUD und ein Kampf funktionieren; Figuren und Modelle laden.
- fps auf einem Desktop-Browser notieren (Georgs Ziel: 60).
- Paketgröße und Dateizahl aus `site-build.json`.

## 4 · Zurück an WS0
Neue Datei `WSA_TO_WS0_MVP_GPT_SITE_R1_RETURN.md` im replies-Ordner mit:
- Adresse und Tester-Zugang;
- gebautem Commit und Paketgröße;
- Prüfliste §3 als PASS/FAIL mit einem Bild der laufenden Site;
- Antworten auf die Übergabe §4: Grenzen, Server-Funktionen und Secrets, Auslöser (Push oder Deploy-Befehl), Adresse.

Danach lässt WS1 den Kritiker R4 auf der laufenden Site laufen, wie in V-687 vorgesehen (nach Georgs Urteilen über die sechs Abnahmen, mit sRGB-korrigierten Bildern). Abnahme durch Georg im Spiel (V-641).
