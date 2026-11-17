# WSA · Prozedurale Zwei-Deck-Kartenreise R1 · 17.11.2026

Privat, kein Merge. Veröffentlichung erfolgreich. Site-Quelle (Cloudflare-Artefakt, kein Game-GitHub-Branch): `67fd563cb124447865c1df47a14a1b024900c78a`.
Private Reise: https://kfb-infiniterooms.frizzlebob.chatgpt.site/stream-lab/
Deployment: `appgdep_6afcb5cfe30481919aaceeebe3b98d3a`.
Gespeicherte Version: `appgprj_6af7435fa7b48191a1739992fa8ffed7~appgver_97905c353b988191896a545a225ad92f`.

## Ergebnis

Vorhandenen MIT-Dungeon-Generator an die zwei geprüften Kartendecks angeschlossen. Fünf Raumanker und native Verbindungen, seed-basiert statt einer festen Geraden. Seed 1337: fünf Räume, sechs native Kanten, zwei Schleifen. Ein anderer Seed erzeugt einen anderen reproduzierbaren Plan. Vergleich der vorherigen Geraden unter `?layout=linear`.

Echte nord-/ost-/süd-/westseitige Durchgänge, passende Kollisionen und orthogonale Korridore. Karte und Guide verwenden das tatsächlich begehbare Bodengitter; freies Laufen und Guide funktionieren in beiden Richtungen. Kein Portal und kein verpflichtender Kampf.

Der Adapter übernimmt **Anker und Graph**, nicht sämtliche nativen variablen Raumformen oder deren ursprüngliche Kachel-Korridore. Kartenmodule bleiben 6,5 m groß. Zusätzliche Korridorkreuzungen sind echte Verbindungen. Native Enemy-/Boss-Rollen sind nur Metadaten; keine neuen Gegner gespawnt.

## Bestehende Zerstörung erhalten

Ein vorhandener CombatPlayer / eine CombatTarget-Quelle, nativer Bruchgraph, Rapier-Kollisionen, Kartenmotive und begrenzte Bruchstücke. Höchstens drei Raum-Besitzer, Entfernungshysterese, Checkpoints binden auch die Anschluss-Topologie. Geschützte 1,5-m-Mittelspuren und permanente geschützte Korridore gewährleisten Rückwege. Raumzustände gelten nur für die Sitzung. Kurzlebiger Schutt wird bei Wiederkehr nicht erneut abgespielt, abgelöstes Material bleibt entfernt.

Kartenräume behalten Originalbilder; sekundäre Korridorflächen nutzen 448 px breite, proportional beschnittene Darstellungsbilder. Geschätzter gemeinsamer Texturhaushalt unverändert 128 MiB.

## Belege

- Vier neue Prüfungen bestanden: acht Seeds reproduzierbar und beidseitig erreichbar; echte Port-Kollisionen; exakte Korridorabdeckung; echter Rapier-Kapsel-Rundweg durch alle Räume und zurück mit Entladen, identischem Bruchzustand und Reset.
- Elf bestehende Checkpoint-/Streaming-Prüfungen bestanden. Vollständiger Site-Build bestanden.
- Browser Seed 1337: Grafikstart, Karte und Guide ins zweite Deck. Ein echter Blastertreffer, eine akzeptierte Meldung, eine Kaskade, 24 entfernte Materialzellen. Rückreise zum ersten Deck entlädt den beschädigten Raum. Wiederkehr: weiterhin 24 Zellen entfernt; Reset: 0. Kein Ladefehler, höchstens drei geladene Räume. Rund 102 MB geschätzte Texturen im beobachteten Zustand.
- Lokale Seed-Neuladeprüfung blieb im Modulstart hängen, ohne Konsolenfehler; veröffentlichte Seed-42-Seite startet dagegen vollständig mit dem anderen erzeugten Plan (Sichtprüfung bestanden). Keine behauptete Ursache und kein kontrollierter Performance-PASS.
- Archivierte Einzelbelege und Bild: `docs/handoffs/procedural-route-r1/` in der gepinnten Site-Quelle.

Unveränderter Spender `vendor/dungeon/generator.js`, SHA-256 `de177239f09dcda643047e0cf15ae9faff7babe0172f81013829ebb24c879472`; benachbarte MIT-Lizenz, Majid Manzarpour 2026.

## Weiter offen

Kontrollierter Performance-/Speicher-Langzeittest bei geringer Rechnerlast, Sicht-/Geschwindigkeits-Vorladen, dynamisch gestreamte Korridore und mehr als fünf Räume, weitere Decks, sechs Richtungen/Schwerkraft und Escher-Rezepte, räumliche Musik-/Ambient-Wiedergabe. Oberflächen-Dissolve bleibt im separaten Blaster-Prüfstand; diese Reise zeigt Karten. Game-Stamm und native Spender unverändert. Einbau ausschließlich durch WS0 nach Georgs PASS.
