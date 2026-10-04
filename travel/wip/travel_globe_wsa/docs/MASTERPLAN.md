# Travel Globe · Masterplan

Stand 2026-09-13 · B0 IN PROGRESS

## Erledigt und belegt

Privates Implementation-Repository: https://github.com/georg-doc/KFB-Travel-Globe. PR #1 mit unverändertem v13.3-R0-Import und Infrastruktur gemergt (`65d9f5c4397ae8e14b27cf488bcddf75e054c0ef`). Initiales GitHub-main bleibt erhalten. Tests/Build/Verify bestehen lokal und in GitHub Actions, einschließlich main nach Merge. Herkunft und 108 Datei-Hashes: B0_BASELINE.json. CI- und Quellenbelege: qa/B0/RETURN.md.

Astra verwaltet Branches, PRs und Merges. Dieses Repository ist einzige Travel-Implementation-SSOT. Stunt, kayfabizarro und Combat bleiben Quellen/Spender.

## B0 offen

1. Verifizierten Travel-main-Build über den bestehenden Kayfabizarro-WIP-Mirror veröffentlichen und tatsächliche Auslieferung prüfen. Keine neue Cloudflare-Verbindung nötig. Ablauf: `_handover/B0_CLOUDFLARE/START_HERE.md`.
2. Normale Browser-QA: Kaltstart, Bunny, Flug/Bremse/Schwebe, Steigen/Sinken, Sammlung, Portal/Rift, Aktion und Fokuswiederkehr. Codex-Werkzeugzugriff scheitert weiter am eigenen Richtlinien-Prüfschritt; keine konkrete Maschinenrichtlinie festgestellt.
3. Sechs byte-identische feste Pet-Modul-Kandidaten erst nach belegter Regression übernehmen.
4. Vollständige B0-Rückgabe mit WIP, Build-ID, Belegen und validiertem Rückkehrpunkt; STOP zur Georg-Abnahme.

## Zusammenarbeit und Folge

`_handover/INDEX.md`: begrenzte Browser-/Dependency-Prüfung, Web-WSA-Meta-Report, Studio-Eingaben. Rückgaben in `_inbox/` sind Review-Eingaben, keine automatische Integration. Astra prüft Basis/Verträge, testet und integriert.

Aktuelle Georg/WSA-Ergänzung: MVP1 Bath Flight nach B0-Abnahme. Donor-Preflight abgeschlossen unter `_handover/MVP1_BATH_FLIGHT_PREFLIGHT/`: SeatLab/PoseRig/DriveActing adaptieren, Travel bleibt Movement Owner. Kein Greenfield-IK oder zweiter Rider-Controller. Frühere Card-Rider-Vorbereitung bleibt archivierte Quelle. Studio-v16-Look, tatsächlicher Sitzclip und Bath-Konfiguration dürfen geliefert werden; noch keine Runtime-Integration. Ground/Drive/Walk, Stunt und Combat bleiben spätere separate Slices.

## Donor-Refresh v16 · 2026-09-13

Gezielter Quellenrefresh abgeschlossen: Stunt@9a24a2f99b8972c0b9d09508d5db5aad6367c7e3, 23 aktive Pins und vorhandene Bath-Config. Neuer PoseRig ersetzt v15; SeatLab/DriveActing sind identisch. Neue Materialzonen brauchen den vorhandenen v16-Hostanschluss, `look.v1.js` allein reicht nicht. Keine Neuplanung, keine Runtime-Integration. Card-Rider-Motiv/Kippung sind für Bath ausdrücklich kein Blocker.

B0-Zugänge nach Refresh erneut geprüft: kein Cloudflare-Kontozugang in den verfügbaren Werkzeugen, Browser-Sicherheitsprüfung weiterhin fehlgeschlagen. Lokale unveränderte Baseline ausgeliefert (sechs Routen HTTP 200); aktuelle Belege in `qa/B0/access-check-v16-refresh.json`. Kein normaler Browser-PASS, kein WIP-Deployment. B0 bleibt offen bis externe Zugänge/Belege vorliegen.

## Publikationsentscheidung · 2026-09-13

Georg gibt `georg-doc/kayfabizarro/travel/wip/travel_globe_wsa/` als öffentlichen WIP-/QA-Mirror frei. Travel bleibt einzige Implementation-SSOT. Aktives Gate: verified Travel main → reproducible build → public Kayfabizarro WIP mirror → normal browser QA. Frühere Kontozugangs-Befunde sind historische Befunde, keine Publikationsvoraussetzung mehr. STOP nach Return zur Georg-Abnahme.
