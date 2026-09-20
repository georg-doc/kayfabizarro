# Integration 01 · verbindliche Auslieferung · r2

**18.09.2026 · DECISION BY GEORG.**

Nutzerkorrektur: »als chatgpt site sowie als cloudflare via KFB bereitstellen, nicht via rawcdn.githack.com«.

## Zwei Ziele, derselbe Quellstand

**1. ChatGPT-Site:** eine echte ausführbare Site in der ChatGPT-Zielumgebung, mit deren tatsächlichem Site-/Versionsbeleg. Hierüber soll Georg die Anwendung direkt testen können. Weder Screenshot noch HTML-/ZIP-Download, iframe-Attrappe oder Link auf eine anderswo gehostete Seite erfüllt dieses Ziel. Eine browserlokale Probe allein ist kein ChatGPT-Site-PASS.

**2. Cloudflare über KFB:** Veröffentlichung über die vorhandene `kayfabizarro`-Pages-Integration und den bestehenden Hub. BOX1-Ziel:

`https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-environment-lab/`

Einstieg:

`https://kayfabizarro.pages.dev/kfb-hub/`

Bestehende Module behalten ihre Owner und ihre bereits vereinbarten KFB-/Projektpfade. Keine neue Deployment-Plattform, kein neues Cloudflare-Konto oder kostenpflichtiger Service allein zur Umgehung einer unklaren bestehenden Konfiguration.

Source-of-Truth bleiben die benannten GitHub-Owner-Repositories. Beide Fassungen referenzieren denselben Source-Commit/Integrations-Lock. Plattformbedingte Base-URL-, Import-, Build-/CSP- oder Asset-Transport-Anpassungen sind kleine versionierte Packaging-Adapter. Keine getrennten Implementierungen und keine irreführende Byteidentitätsbehauptung, wenn der Build unterschiedlich verpackt wird. Source-/Assetidentität und funktionaler Abgleich müssen dann explizit belegt sein.

## Kein Ersatzhost

Githack und andere nicht beauftragte Host-/CDN-Adressen sind keine akzeptierten Liefer- oder Ausweichziele. Die früher erfolgreich getestete githack-Fassung bleibt als **ARCHIVED TEST EVIDENCE** in datierten Returns/Source-Snapshots erhalten. Nicht als aktuelle Startempfehlung oder als Erfüllung der beiden Ziele im Hub anzeigen. Bereits erzeugte Historie nicht löschen oder in einen Cloudflare-PASS umbenennen.

Das Verbot betrifft die ausgelieferte Site/Startadresse. Es verbietet nicht automatisch vorhandene gepinnte Paket- oder Asset-CDNs, die aus dem Source-/Lizenzvertrag benötigt werden. Keine unnötige Three.js-/Asset-Transportmigration aus dieser Hostingkorrektur ableiten.

## Capability-Gate in der tatsächlichen ausführenden Session

Zu Beginn bestätigen: native ChatGPT-Site erzeugen/aktualisieren und öffnen; GitHub lesen/schreiben; KFB-Cloudflare-Publishing und Buildstatus prüfen. Nicht annehmen, dass eine andere Session dieselben Werkzeuge oder Rechte hat.

Fehlt das Site-Werkzeug, `CHATGPT_SITE: BLOCKED_TOOL_UNAVAILABLE` ausweisen und den vorhandenen Quellstand mit Einstieg/Buildanleitung an die dafür geeignete bereits vorgesehene Work-/Sites-Session geben. Keine Site-ID oder URL erfinden. Ein Drittanbieter-Websitegenerator ist kein Ersatz für diese angeforderte ChatGPT-Site.

Fehlt Cloudflare-Zugriff oder scheitert der Build, `CLOUDFLARE: BLOCKED` mit dem konkreten Run/Fehler melden und den bestehenden KFB-Weg reparieren. GitHub-Pages-Erfolg ist kein Cloudflare-Erfolg. Keine Zugangsdaten im Repo/Chat ablegen und keine unberechtigten Schutz-/Berechtigungsänderungen.

Fehlt eines der Ziele, ist die **Auslieferung PARTIAL/BLOCKED**, selbst wenn das andere oder ein lokaler Build funktioniert. Das ist keine Rücknahme bereits erteilter Klang-/Fahrgefühlentscheidungen.

## Belege pro Ziel

- Echter Site-/Deploy-Identifier, Source-Revision und Startadresse; für ChatGPT nur die tatsächlich vom verfügbaren Site-Werkzeug gelieferte Referenz.
- Kalter Start, ausführbares WebGL, Modell-/Textur-/Modul-Ladevorgang, Tastatur-/Touchfokus und Audio-Nutzergeste in der jeweiligen wirklichen Zielumgebung. Kein bloßes Vorhandensein der HTML-Datei.
- BOX1-Ablauf: Fahrzeug wählen → Test Lap → Countdown → fahren → Original/Deformer → Environment-Wechsel → Radio. Gleiches Seed-/Asset-/Profil-Ergebnis auf beiden Zielen, soweit vergleichbar; Unterschiede benennen.
- Persistenz gesondert: LocalStorage ist Origin-gebunden. Vor Wechsel gespeicherte Shortlist erhalten/exportieren; keine automatische Synchronisation behaupten und vorhandene Daten nicht löschen.
- Cloudflare zusätzlich: ausgelieferter Build-/Source-Marker und KFB-Hub-Link zur echten Route prüfen. Ein Build-Status allein reicht nicht.

Der World-Gegencheck berücksichtigt diesen Vertrag. Er darf weder eines der beiden Ziele still streichen noch aus dem alten Source-Snapshot die frühere githack-Fallback-Erlaubnis wieder einsetzen.

## Status dieses Dokumenteintrags

**IMPLEMENTED:** Auslieferungsauftrag korrigiert. **NOT CLAIMED:** neu erzeugte ChatGPT-Site, abgeschlossener Cloudflare-Build oder neuer Gesamt-Browser-PASS. Konkrete Testergebnisse gehören in den jeweiligen Return, nicht in die Formulierung einer Anforderung.
