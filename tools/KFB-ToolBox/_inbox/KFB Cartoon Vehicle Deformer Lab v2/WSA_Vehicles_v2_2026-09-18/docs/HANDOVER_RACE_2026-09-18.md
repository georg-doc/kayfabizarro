# ÜBERGABE an den Race-Chat · 18.09.2026

Fahrzeug-Linie `lab-v7`. Werkbank: `KFB Cartoon Vehicle Deformer Lab.dc.html`.
Vollständige Rückmeldung nach Briefing-Schema: `RETURN_cartoon_vehicle_deformer.md`.

## Die Naht, unverändert gültig

```js
window.__cvd.setSignals({ speed, longAccel, lateral, bank, drift });  // je Frame
window.__cvd.railImpact({ side: -1 | 1, strength: 0..1 });            // Wand: je Frame melden
window.__cvd.railRelease();                                           // optional
window.__cvd.landing({ strength: 0..1 });
window.__cvd.run('DRIFT LEFT'); window.__cvd.reset(); window.__cvd.readout(); window.__cvd.nodes();
```

**Teilmengen sind erlaubt.** Jeder Eingang geht durch einen Endlichkeitsfilter — ein NaN aus der
Telemetrie kann das Rig nicht vergiften.

**`railImpact` darf je Frame gerufen werden.** Aufrufe dichter als `retriggerMs` (140 ms)
gelten als DERSELBE Kontakt: ein Impuls, dann gehaltene Schräglage, dann Aufrichten beim
Loslassen. Kehrseite, benannt statt versteckt: zwei echte Einschläge innerhalb von 140 ms
verschmelzen. Wer sie getrennt braucht, ruft `railRelease()` dazwischen.

**Die Architekturgrenze steht.** Der Deformer schreibt ausschließlich in eigene
Presentation-Knoten. Es gibt im Modul keine Zuweisung an `contactRoot.position` oder
`.quaternion`, keine Kollisionsgeometrie, kein Grip- oder Drift-Tuning. Was Race liefert, sind
Fakten; was dieses Modul daraus macht, ist eine Deutung, und die überschreibt nichts.

## Was der Race-Chat entscheiden oder liefern muss

| # | Sache | Was gebraucht wird |
|---|---|---|
| R1 | **Signalvertrag** | Die Namen sind aus dem v0.7-Entwurf übernommen, der ausdrücklich nicht eingefroren ist. Gegen den echten Runtime ist nichts gelaufen. Entweder einfrieren oder die Abweichung nennen. |
| R2 | **KayKit ActionFigure / Rig_Medium** | Fehlt im Handoff-Satz (141 Assets, kein Treffer auf `rig_medium|actionfigure`). Briefing-Fixture 3 (Skateboard + Rider) ist damit nicht baubar. Nächstliegend: `Astronaut_*` (43 Joints), `Mech_*` (13 Joints) — beide keine ActionFigure. Offener AssetRef, kein Ersatz genommen. |
| R3 | **Go-Kart by Poly** | Nicht achsenparallel autoriert. Alle sechs Lagen durchgemessen, keine richtet ihn auf. Ein Schalter in der Werkbank kann das nicht heilen — Blender-Fix im Asset oder Freigabe für eine freie Rotation je Fixture. |
| R4 | **Rollerskate + Skateboard** | Rollen sind verschweißtes Einzelnetz, die Inseltrennung kann sie nicht herauslösen. Es bräuchte benannte Rollenknoten im Asset. Board-Roll-Kette läuft trotzdem, aber ohne Radaufstandsmessung. |
| R5 | **Maßstab** | car_hatchback Radstand 0,50, Poly-Taxi 37,1 — Faktor 100. Dem Deformer gleichgültig (er rechnet in Anteilen der gemessenen Maße), einer gemeinsamen Strecke nicht. Wer normiert, Race oder Asset-Seite? |
| R6 | **Mech-Fixture** | `MECH_FUTURE` ist Profilstruktur ohne Fixture. Solange keines im Satz liegt, bleibt es unabgestimmt. |

## Was NICHT von Race kommt

Ton, Staub, Kamera-Shake und Lautwort sind bewusst nicht gebaut — Motion-Skill §15 verlangt
erst die Choreografie, und er deckelt sie danach: ein Haupt-Read, ein Lautwort, ein
Kamera-Griff. Trailer-Nachlauf fehlt, weil die Quelle fehlt (Space Base Bits) und weil offen
ist, ob der Nachlauf zum Zugfahrzeug gehört oder ein eigener Actor ist.

## Wo die Zahlen belastbar sind

`BROWSER TESTED` in `RETURN_cartoon_vehicle_deformer.md` — gemessen an `car_hatchback`
(4 Räder aus benannten Knoten, r 0,072, Spur 0,35, Radstand 0,50). Dort stehen auch sieben
Messfehler, die dabei gefunden und behoben wurden, samt der Regel, die daraus folgt.

**Keine Zahl ist von Georg abgenommen.** Die Startbereiche stammen aus dem Briefing.
