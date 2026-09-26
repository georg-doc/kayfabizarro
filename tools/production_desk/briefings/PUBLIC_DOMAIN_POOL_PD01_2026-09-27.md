# PD-POOL-01 · Public-Domain-Pool · Vier-Quellen-Smoke-Test

Status: **CAN_START · bounded smoke test**
Date: 2026-09-27
Owner: Asset Librarian / Billboard Media
Source package: `tools/KFB-ToolBox/_inbox/KFB Public Domain Pool claude design.zip`

## Ziel

Den vorhandenen Auswahl-Pool nicht neu bauen, sondern mit genau vier Objekten sicher prüfen: je ein Kandidat aus The Met, Art Institute of Chicago, Wikimedia Commons und Internet Archive.

Der Pool ist für Billboard-, In-Game-Monitor-, Display-, Abspann- und Kudos-Medien gedacht. Er ersetzt weder den Asset Librarian noch die Billboard-Runtime.

## Bereits belegt

- Die Auswahloberfläche fragt alle vier Quellen ab.
- Der vorhandene Preview-Test für „silent film“ zeigte 84 freie Treffer, 6 Treffer mit Namensnennung und 40 verworfene Treffer.
- Ein Klick kann ein Objekt in eine Exportliste legen.
- Ein Downloader-Paket existiert, ist aber **UNTESTED / HOLD**.
- Internet-Archive-Lizenzangaben stammen teils von Uploadenden und benötigen vor öffentlicher Nutzung immer eine menschliche Sichtprüfung.

## Dieser Slice

1. Maximal vier Objekte laden – genau eines pro Quelle.
2. Vor jedem Download Lizenz und Quellseite erneut lesen.
3. Neben jeder Datei festhalten:
   - Quell-URL
   - Titel
   - Urheber/in, falls genannt
   - Lizenz / Public-Domain-Angabe
   - Abrufdatum
   - SHA-256
4. Prüfen, dass Quelle und tatsächlicher Medieninhalt zusammenpassen.
5. Einen zweiten Lauf ausführen: kein doppelter Download, keine teilweise Datei darf als gültig gelten.
6. Credits/Kudos ausschließlich aus den gespeicherten Belegen ableiten.
7. Internet-Archive-Objekt zusätzlich manuell ansehen.

## PASS

- 4/4 Quellen liefern je genau einen plausiblen, belegten Testgegenstand.
- Wiederholung ist idempotent.
- Fehlerhafte oder abgebrochene Downloads werden nicht als gültig registriert.
- Keine Lizenzbehauptung stammt nur aus Dateiname oder Suchtreffer.
- Ein kleiner Handoff zeigt Dateien, Belege und Credits.

## Danach

Erst nach PASS:

- `media/public_domain/` im bestehenden Asset Librarian registrieren;
- einen kleinen Billboard-Donor-Satz testen;
- **kein** Bulk-Import und **kein** automatisches Füllen aller Billboards.

## Nicht tun

- Downloader ungeprüft auf den ganzen Trefferpool loslassen.
- Internet-Archive-Metadaten ungeprüft als rechtliche Wahrheit behandeln.
- neue Asset-Bibliothek oder zweite Medien-Registry bauen.
- diese vier Testobjekte bereits als kuratierten Produktionspool ausgeben.

## Rückgabe

Exakter Branch/Head, vier Quellenbelege, vier Prüfsummen, tatsächliche Testzahlen, offene Lizenzfragen und genau ein nächster Gate.
