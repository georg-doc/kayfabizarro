# WORLD-MOBILITY-M1 · Test Report

Datum: 2026-09-27  
Status: `LOCAL_BROWSER_PASS`

## Paket und Owner

`package-proof-m1.mjs` → **40/40 PASS**

Belegt wurden unter anderem:

- exakte Travel-Donoren samt SHA-256;
- genau ein aktiver Movement- und Camera-Owner pro Modus;
- bestehende World-r2-Ground-Runtime bleibt zuständig;
- tatsächlicher Travel-Card-Carrier statt Ersatzobjekt;
- 400-ms-Intent ohne doppelten Ground-Sprung;
- kein ST01-Proxy und kein Track-Modul;
- Clay als reversible Präsentation;
- Drive und Water bleiben ohne Source-Owner gesperrt.

## Browser

`browser-proof-m1.mjs` → **40/40 PASS** über lokale HTTP-Preview.

Ansichten: 1280 × 820 und 390 × 844.

Pro Ansicht geprüft:

- Hürth-Welt bootet;
- Start in Ground/Original;
- gefalteter Track ist abwesend;
- nur der Ground-Owner schreibt Bewegung und Kamera;
- erster Space bleibt Ground und startet den bestehenden Sprung;
- zweiter Space innerhalb von 400 ms aktiviert Flight;
- echter Travel-Carrier trägt FrizzleBob;
- Router übergibt Movement und Camera gemeinsam;
- Flight bewegt sich und gewinnt Höhe;
- Clay ist sichtbar und reversibel;
- Rückkehr zu Ground stellt den World-Owner wieder her;
- Inline-Dokumentation funktioniert;
- 0 Seiten-/Konsolenfehler;
- 0 fehlgeschlagene Requests;
- 0 HTTP-Fehler.

## Noch nicht behauptet

- keine öffentliche `pages.dev`-Verifikation;
- kein Race-Track-Core;
- kein Drive- oder Water-Modus;
- kein finales Movement-Tuning.
