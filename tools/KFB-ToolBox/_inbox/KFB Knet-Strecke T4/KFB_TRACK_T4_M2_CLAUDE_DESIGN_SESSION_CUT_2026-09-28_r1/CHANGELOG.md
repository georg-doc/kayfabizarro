# CHANGELOG · Knetwelt-Linie (additiv, neu oben)

## 2026-09-28 abends · Markierung M2.2 + T4 auf M2 (Session Cut r1)

- **Einmündung:** Wartelinie liegt eine Lücke (0,6 m) hinter der Rand-Leitlinie, nicht mehr darauf. Sie reicht über den ganzen eigenen Fahrstreifen, bündig an der Begrenzung und entlang der Randlinie im Bogen, Lücken gleichmäßig gestreckt. Die Fahrstreifenbegrenzung beginnt an der Wartelinie.
- **Linksabbieger:** Sperrfläche (Rand + Schraffur) in Rolle `centre`, im US-Regelwerk also signal. Neue Farbregel im Vertrag: `colors.roles.centreRule`.
- **Parken:** Parkstreifen ersetzt durch Parkbucht im Gehweg (4 Stände, Bord 45° zurück, Trennstriche nur zwischen Ständen).
- **Parkdeck:** Fahrgasse als Einbahn, zwei Pfeile mittig in Fahrtrichtung statt vier gegenläufiger.
- **Vertrag** `road-markings.m2.json` 2.1.0 → 2.2.0: `placement.yield`, `elements.yield.note`, `parking.parallel.bay`, `parking.perpendicular.aisleFlow`, `colors.roles.centreRule`, `consumers`.
- **Neu** `lab-track/road-markings.m2.js`: 3D-Bau M2 (Randlinien S/B mit 20-m-Keil, Takt-Auslauf, Blocklinie, Mitte mit Anfahrtsfolge, Zebra 12 m vor Ende, gerade Enden, keine Wobble).
- `transition-atlas.v1.js`: `makeAtlas({ …, M2 })`, baut mit M2, Fallback M1. Mesh-Namen `m2-markierung-hell/-signal`, `A.info.markSet`, `A.info.mark`.
- `track-look.v5.js`: lädt `road-markings.m2.json?r=4`, reicht M2 an den Atlas, Zebra-Kamera auf 12–18 m vor dem Ende.
- `KFB Knet-Strecke T4.dc.html`: Link und Beschriftungen M2, Import `track-look.v5.js?r=18`.
- Blatt §9 „Offen" aktualisiert.
- Doku: `docs/ROAD_MARKINGS_M2.md`, `POSTMORTEM.md`.

## 2026-09-28 · Markierung M2 (Neuaufbau, nur Regelwerk-Blatt)

- Neues Blatt `KFB Markierungen M2.dc.html` + Vertrag `lab-track/road-markings.m2.json`. M1 bleibt als Verlauf.
- Maße aus RMS/StVO, Längen × 2, Strichbreiten × 2,5: S 0,30 · B 0,60 · Q 1,20 m. Leitlinie 6/12, Knoten 3/3, Warnlinie 6/3, Wartelinie 1,2/0,6, Zebra Q/Q, Pfeil 10 m.
- Enden gerade, Ecken 7,5 cm. Echte Stöße (Haltlinie, Wartelinie, Parkstände, Startboxen). Pfeilfamilie mit einem Kopf und einem Bogen.
- Übergänge: Takt-Auslauf (deterministisch), Verwehung als Front mit Zungen, Knetfleck ohne Kante.
- 3D T4 läuft noch mit M1, Umstellung nach Abnahme.

## 2026-09-28 · T4.2 · Markierung M1.2 (Fugen, Anker, Verwehung, Abgleich Grammatik-Input)

- Zwei Fugen statt freier Lücken: F1 = 1 Takt längs, F2 = 2b quer. Leitlinie 2 : 1, Warnlinie 4 : 1, Blocklinie 1 : 1, alle mit Lücke F1. Muster werden vom Ereignis aus angelegt, nie gestreckt.
- Zebra: Balken W2, Lücke F2, Randlinien laufen durch, Mittellinie setzt F1 aus. Sperrlinie 6 Takte.
- Sackgasse: keine gezeichnete Zunge mehr. Asphalt und Randlinien laufen gerade weiter, Platzsand weht darüber (`m1-verwehung`, Überdeckungsregel). Kein Asphalt außerhalb der Fahrbahn.
- Regelwerk abgeglichen mit `uploads/visuelle Grammatik für Fahrbahnmarkierungen.md`: Kernsatz, 8 Formfamilien, Punktfolge, Doppellinie, Pfeilkopf 3 × 2, Wartelinie als Blockfolge, Rahmen für Parken/Start/Box, Curbs, drei Farbebenen, DE/US-Schalter. Parken: Längsparken als Regelfall, Senkrecht nur Parkdeck.

## 2026-09-28 · T4.1 · Markierungssystem M1 + Knetfleck-Regel + Auslaufzunge

- Neu `lab-track/road-markings.m1.json` (Regelwerk, Vertrag) + `road-markings.m1.js` (Bau). Lesbar als `KFB Markierungen M1.dc.html`.
- Markierungen: Grundstärke b = 25 cm, Takt m = 1,5 m, Stärken W1–W4, Muster durchgezogen / Leitlinie 2:2 / Warnlinie 4:1 / Blocklinie 1:1 / Tropfen. Farbrollen hell/signal je Welt.
- Bänder folgen der Fahrbahn Sample für Sample, auch im Loop, statt starrer 2-m-Stücke. Randlinie bündig an road_L/road_R (vorher 0,4 m Lücke zur Kehle), Strecke W3 → Stadt W2 gleitend. Magnetzone: Blocklinie Signal.
- Stadt-Enden: Sperrlinie 8 m, Zebra (W3/W3, 3 m) 8 m vor Ende, danach Auslaufzunge mit rundem Ende, Randlinien enden mit Tropfen. Platzsockel dafür 2 m nach hinten versetzt.
- Knetfleck-Regel ersetzt das alte Fleckenfeld (Fahrbahn, Strang, Böschung, Zunge): Differenz zweier Gauß-Kugelfelder, symmetrisch, runde Tropfen in beide Richtungen, Deckung = w. Vorher: einseitig, Kanten gerade (Hyperbelstücke).
- Strang-Flecken laufen jetzt über die Bogenlänge ums Profil (vorher Vertex-Index, dadurch gestreckte Flecken an der Bande).

## 2026-09-28 · T4 · Übergangsatlas + Clay-VFX (Kandidat)

- Neu `lab-track/track-look.v5.js` (aus v4 kopiert, v4 unverändert). Eingriffe: Strang-Querschnitt liest `barrierT`, Strang-Ring mit Knetflecken zur Bord-/Wiesenfarbe, Fahrbahn-Skinfeld aus dem Übergangsvertrag mit dritter Farbe Naturweg, Welt-Platzierung meidet Stadt/Böschung/Brett, T3-Baumformen nehmen eine Grundhöhe.
- Neu `lab-track/transition-atlas.v1.js` + `transition-profiles.v1.json`: Zonen ZC/ZB/ZN/ZA auf TD03, Familien A/B/C, 14 Layer mit eigenen Fenstern.
- Neu `lab-vfx/clay-vfx.v1.js` + `clay-particle-profiles.v1.json`: 24 Profile (6 Ereignisse × 4 Biome), drei Qualitätsstufen, Pool 200, drei Draw Calls.
- Befund 1: Markierungen lasen als dunkle Striche. Ursache: linkshändige Basis (R, U, T) spiegelt die Riegel, Rückseiten zeigen nach außen. Fix: (R, U, −T). Gleiches für Bordsteine.
- Befund 2: Markierungen mit Fahrbahnprofil `road` wirkten grau. Jetzt Profil wie die Boost-Platten (`water`, legacy 1).
- Befund 3: Krümel 0,1–0,3 m lasen im Probenbrett als Rauschen. `sizeRange` × 1,5 (Profile v1.0.1).
- Befund 4: Brett-Landungen feuerten fast nie (Bodenkontakt nur bei k < 0,003 je Periode). Jetzt Periodenwechsel als Landung.
- Umgebung: verdeckte Vorschau richtet Timer > 0 ms auf 1 min aus. v5 gibt beim Werkzeugkarten-Bau über einen MessageChannel ab (nur für diesen Aufruf) und hat `frame(n)` / `measureSync()` für Aufnahmen ohne requestAnimationFrame.
