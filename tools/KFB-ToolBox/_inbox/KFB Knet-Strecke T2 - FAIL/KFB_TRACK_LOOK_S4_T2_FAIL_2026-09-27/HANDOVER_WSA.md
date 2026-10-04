# HANDOVER → WSA · S4 Track-Look · Re-Briefing nötig · 2026-09-27

**Status:** `FAILED` · Georg verwirft T1/T2 vollständig im Look. Kein weiterer Bau in dieser Linie bis zum Re-Briefing.
**Von:** Claude Design (KFB Animation Lab) · **An:** WSA-Lead · **Kopie:** Claude Coworker (Track Core)

## Bitte an WSA

Ein Re-Briefing an Claude Design, das die **Design- und Art-Guidelines ausdrücklich und verbindlich** festschreibt. Georg: »es gibt klare Farb-, Design- und Cartoon-/Claymation-Anatomie«. Der Brief S4 v2 hat auf Claybound, H0 und die Environment-Grammar verwiesen; das hat nicht gereicht, weil ich daraus eigene Entscheidungen abgeleitet habe. Das Re-Briefing sollte deshalb **Vorgaben statt Verweise** enthalten:

1. **Palette als Liste:** Hex je Masse (Fahrbahn, Streckenkörper, Gelände, Himmel, Akzent) je Welt, nicht »nach Claybound«. Gemessene Werte liegen vor: `lab-clay/clay-material.v8.js` → `PALETTES.claybound`.
2. **Formsprache mit Bildern:** Rand/Wulst, Kerb, Stütze, Portal jeweils als Referenzbild mit Maßen (Verhältnis Dicke/Höhe, Fuß, Kopf). Georg hat die Stützen-Anatomie als falsch benannt; die richtige Anatomie muss im Brief stehen.
3. **Knetspuren-Maß:** Größe von Handspur, Abdruck, Druckstelle in Metern der Streckenwelt, und wo sie erlaubt sind. Fahrbahn-Relief wie heute behalten (»das einzig Gute«).
4. **Semantik ohne Aufkleber:** Wie Race-Bedeutung (Kerb, Gefahr, Richtung) gezeigt wird, falls überhaupt. Tafeln/Schildchen sind abgelehnt.
5. **Abnahme:** ein Referenzbild je Shot (TD03 Totale, Nah, Mitfahren; TN02 Portal), gegen das verglichen wird.

## Was Claude Design mitbringt

- `POSTMORTEM_S4_T1_T2_TRACK_LOOK.md` · 12 Befunde mit Beleg und Ursache, 6 Wurzelursachen.
- `lab-track/KONZEPT_S4_KNETSTRANG.md` · ein Prinzip-Entwurf. **Nicht freigegeben**, nur als Diskussionsgrundlage; WSA-Guidelines haben Vorrang.
- Technik, die weiter trägt (Stream-Lesen, Rollen, Fahrbahn exakt, Hülle, Knetflecken, TN02-Röhre): `lab-track/track-kit.v2.js`.
- Core-Wünsche aus Phase A: Auslauf `sideL/R` 1,0 + `shoulderW` 6,0 · `capMin` 0,9 an offenen Enden · Formel für `barrierVis` < 1 · Rampe/Kicker-Form über Core-Geometrie (Georg).

## Grenzen

Track Core besitzt Geometrie, Checks, Tunnel-Größen. WSA/Race besitzt Physik, Kamera, OSM, Licht-Rig. Claude Design besitzt nur den Look, und den erst nach dem Re-Briefing.
