# HANDOVER → WSA · S4 Track-Look · T3 Knetstrang · 2026-09-27

**Status:** `ACCEPTED AS BASE` · löst den FAIL von T1/T2 ab (Postmortem in `docs/`).
**Von:** Claude Design (KFB Animation Lab) · **An:** WSA-Lead · **Kopie:** Claude Coworker (Track Core)
**Georg 27.09.:** »Top! wir haben endlich ein Design ;-) ich denke, wir können das noch verbessern, aber eine sehr coole und ausbaufähige Basis!«
**Richtung (Georg):** bunt, lebendig, harmonisch-schräg; Rocko × SpongeBob × Wallace & Gromit × Mario Kart; Maßstab Claybound, Ansätze aus K1 und H0.

## Was geliefert ist

- Bühne `KFB Knet-Strecke T3.dc.html` → `lab-track/track-look.v3.js` auf TD03 (Track Core v0.8.1), eigenständig, **ohne** `track-kit.v2`.
- Designprinzip »Knetstrang« umgesetzt: eine Masse je Welt (Kehle + Wulst + Bauch + Stützen), Fahrbahn exakt aus dem Stream, Bedeutung durch Form.
- Drei Welten als Farbsätze auf denselben Formen: **A Claybound-Canyon · B Bikini-Bucht · C O-Town**. Werte in `DESIGN_SPEC_T3.md`.
- Kameras: Übersicht, Mitfahren (Kart), Rippen, Prallwulst, Stützen, Boost, Kicker, Looping. Graustufen-Schalter für Bedingung 5.

## Was für WSA/Race gilt (Grenzen eingehalten)

- Keine Kollision, keine Fahrflächen-Änderung: Fahrbahn = Stream-Slots road_L..road_R, Mitte gegen `p` gemessen (Panel-Zeile).
- Alle Zusätze außerhalb road_L..road_R oder unter der Fahrbahn. Boost-Pfeile liegen 2 cm + 0,11 m Wulst auf der Fahrbahn (visuell, keine Kollision).
- Luftstücke (`prm.surface = 0`) bleiben frei. 7-m-Hülle nicht berührt (keine Aufbauten über der Fahrbahn).
- Material `clay-material.v8` unverändert; Handmaß 1,5 m (k = 3) wie T2 21:30.

## Offen (Problem zuerst)

1. **Rippen innen lesen noch nicht als Rippen.** In der Kehre ist die Hohlkehle schmal (Schulter × sideL); Rippen sitzen auf der Wulst-Innenflanke. Vorschlag: breitere Kehle innen in Kurven als Core-Parameter (`shoulderW` je Zone) oder Rippen als eigene Knetwülste quer.
2. **Helix-Etagen ohne Stützen dazwischen:** eine Stütze stünde auf der Fahrbahn der Etage darunter. Lösung braucht Core-Anker außerhalb der Fahrbahn (Stützen-Slot seitlich) oder ein Parkhaus-Gebäude als Welt-Asset.
3. **Looping frei stehend** (Cartoon-Physik). Brief-Frage 4 bleibt Georgs.
4. **Prallwulst bis +0,3 m über Wandhöhe** in engen Kurven: visuell gelöst, als Core-Frage `barrierH` je Zone weiterhin offen.
5. **Offene Enden:** Lippe als runder Querwulst gesetzt, Bauch nie dünner als 0,7 m. Die Verjüngung selbst kommt aus dem Core (`END_TAPER`).
6. **Skins:** nur Straße ↔ Bahn als Knetflecken; `mag` fährt auf Bahn + Boost-Pfeile. `buoy`, `toy`, Tunnel (TN02) in T3 nicht gezeigt.
7. **Karts** sind Platzhalter aus Grundformen (Kopf ohne KFB-Augen-Rig), nur für Maßstab und Leben.
8. **Ladezeit/Leistung** nicht gemessen gegen Race-Budget; Welt ist zusammengefasst je Farbe (wenige Draw Calls).

## Bitte an WSA

- Integrationsweg festlegen: T3-Look als Modul für Race (Look-Owner Claude Design, Geometrie Track Core) oder erst weitere Look-Runde.
- Reihenfolge der offenen Punkte 1–6 priorisieren; 1, 2, 4 brauchen Core-Zahlen vom Coworker.
- Georg: Welt(en) wählen oder je Biom zuordnen (A Canyon · B Bucht · C O-Town).

## Nicht mehr gültig

- T1/T2-Look (Farbe je Core-Slot, Tafeln, Streifen, Stab-Stützen). `track-kit.v2.js` bleibt nur Technik-Referenz (TN02-Röhre, Knetflecken, Atlas).
