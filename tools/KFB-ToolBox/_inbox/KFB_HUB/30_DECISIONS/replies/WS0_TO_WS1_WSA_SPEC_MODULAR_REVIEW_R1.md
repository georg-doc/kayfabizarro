# WS0 → WS1 (Lead) und WSA work · Bitte um Gegencheck der Spec „Modulare Site mit Stage-Kanal“ R1

Georg findet die Richtung gut und möchte, dass ihr beide sie prüft, bevor gebaut wird. Spec: `30_DECISIONS/replies/SPEC_MODULAR_SITE_STAGE_R1.md` (Register-Branch). Es ist ein Prüfauftrag, kein Bauauftrag. Nichts umbauen, nichts deployen.

## Tier 0
1. **WS1 prüft Build und Lader:** Code-Splitting je Modul, Spiegel ohne private Teile, Leak-Scan, Manifest-Pflege allein durch den Lead, `#stage` im `siteHash`.
2. **WSA prüft die Plattform:** GPT-Site mit CSP für `import()` von jsDelivr, Caching, nur geänderte Dateien deployen, Passwort vor allen Pfaden, Hülle und Basis.
3. **Antwort je Abschnitt:** PASS, TUNE oder BLOCK mit kurzer Begründung und dem kleinsten Änderungsvorschlag.

## WS1 (Lead), Fragen
- Lässt sich das heutige Bündel (7,45 MB) mit vertretbarem Aufwand in Teile je Modul schneiden? Welche Module ergeben sich natürlich (core, hud, chatter, npc, audio, vehicles …)?
- Ist ein Build ohne `src/private` heute lauffähig (mit Platzhaltern)? Was hängt sonst noch an privaten Quellen außer der HUD-Kassette?
- Wie groß sind Basis, Code und Daten im Paket @6a03920 (Aufteilung aus `site-build.json`)?
- Passt der Ablauf „Sitzung meldet → Lead führt ins mvp → Leak-Scan → Spiegel → `stage.json`“ zu euren Übernahmekarten? Was fehlt?
- Rückgabe als Abschnitt in `WS1_STATUS.md`.

## WSA work, Fragen (Audit zum Workflow)
- Erlaubt die GPT-Site `import()` von `cdn.jsdelivr.net` (script-src) und Abrufe von `raw.githubusercontent.com` (connect-src)? Bitte mit einem Dummy-Modul prüfen, ohne das Spiel zu ändern.
- Kann die Plattform nur geänderte Dateien deployen (Basis mit Inhalts-Hash im Namen), oder ist jeder Deploy ein Vollpaket?
- Lassen sich Hülle und Basis getrennt aktualisieren? Bleibt das Passwort dabei vor allen Pfaden?
- Was würdest du am Ablauf ändern, damit du nur noch bei Hülle oder Basis gebraucht wirst?
- Rückgabe als Return-Datei wie gewohnt.

## Grenzen
Keine neue Site, kein Merge, nichts löschen, keine Tokens von Georg. Das veröffentlichte MVP-Paket (b214) hat Vorrang vor diesem Audit.
