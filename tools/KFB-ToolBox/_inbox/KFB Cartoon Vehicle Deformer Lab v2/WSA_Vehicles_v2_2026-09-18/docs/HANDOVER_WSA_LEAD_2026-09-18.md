# ÜBERGABE an den WSA-Lead-Chat · 18.09.2026

Session-Cut der Fahrzeug-Linie. Kein Review-Gate erreicht — es fehlt die Sichtabnahme.

## Wo die Linie steht

Der Cartoon-Deformer für Race-Fahrzeuge ist gebaut und in sich geprüft: gruppenbasiert
(nested Groups, bounded scale, gedämpfte Springs), vier Profile, zwölf deterministische
Testsequenzen, 43 vermessene Fixtures aus Georgs Handoff und dem Registry. Zwölf Sequenzen
laufen und enden im Ruhezustand; `RESET` setzt alle Springs exakt auf null.

Werkbank: `KFB Cartoon Vehicle Deformer Lab.dc.html`.
Rückmeldung nach Briefing-Schema: `RETURN_cartoon_vehicle_deformer.md`.
Stand-Dokument: `LIVING_VEHICLES.md`. Zeitachse: `CHANGELOG.md`.

## Was der Lead wissen muss

**Die Arbeitsteilung ist entschieden und hat gehalten.** Die Strecke besitzt Physik und Lage,
diese Werkbank besitzt die Sicht darauf. Es ist keine zweite Fahrphysik gebaut worden. Die Naht
ist eine Telemetrie-Funktion, und sie ist einseitig: der Deformer liest, er schreibt nicht
zurück.

**Der Handoff ist eine Kandidatenliste, und er sagt das selbst:**
`selectionStatus: candidate-only`, `suitabilityDecision: owned-by-receiving-consumer`.
Die Eignung liegt also bei uns. Von 43 Fixtures sind vier nachweislich untauglich
(Go-Kart nicht achsenparallel, Skateboard und Rollerskate ohne Radknoten, `Kart by Ben` mit
Radstand 0,00). Das ist die Quote, die eine Kandidatenliste hat.

**Drei Abhängigkeiten liegen außerhalb dieses Chats:**
1. Space Base Bits (drei Fahrzeuge) ist im Browser nicht ladbar. Abhilfe: als `.glb` nach
   `kayfabizarro/media/3D_Assets` — eine Datei ohne Sidecar, öffentlich abrufbar.
2. KayKit ActionFigure / Rig_Medium fehlt im Satz. Briefing-Fixture 3 nicht baubar.
3. Die Maßstäbe der Quellen klaffen um Faktor 100. Für den Deformer gleichgültig, für eine
   gemeinsame Strecke nicht.

**Was noch keiner gesehen hat.** Keine Zahl ist abgestimmt, kein Profil freigegeben, keine
Fixture als Bildreihe abgenommen. Belege liegen als Einzelaufnahmen unter
`screenshots/01-cvd-*.png` und `02-cvd-*.png`. Ein Kontaktbogen über alle zwölf Sequenzen
ist der naheliegende nächste Beweis — er ist nicht gebaut, weil die Abnahmekriterien fehlen.

## Ein Fehler, der als Regel weitergegeben werden sollte

Beim Poly-Police-Car war die Türplatte als Rad geriggt und **rotierte bei ACCEL mit**. Ursache:
die Insel-Radsuche nahm jede scheibenförmige Insel für ein Rad — 15 »Räder«. Das ist der
Unterschied zwischen einer falschen Zahl und sichtbar falscher Bewegung, und eine Zahl im
Bericht hätte es nicht gefunden.

**Regel:** eine Formprüfung allein erkennt kein Rad. Ein Rad hat ein Gegenstück auf der anderen
Seite, es hat Bodenkontakt auf derselben Höhe wie die anderen, und es hat die gleiche Größe.
Wer nur die Form prüft, riggt Türen.

Zweite Regel aus derselben Runde: **ein Amplitudenwert misst keine Ereignis-Energie.** Erst die
Abweichung vom Spring-Ziel tut das — ein Spring auf seinem Ziel hat keine Energie, auch wenn er
weit ausgelenkt ist. Vorher standen zwei Sekunden Neutralfahrt auf `impact 0,10`.

## Was als Nächstes ansteht, wenn die Linie weiterläuft

1. Sichtabnahme der zwölf Sequenzen durch Georg — danach lassen sich die Profile abstimmen.
2. Die vier Punkte, die beim Race-Chat liegen (`HANDOVER_RACE_2026-09-18.md`, R2–R5).
3. Erst dann Ton, Staub, Kamera-Shake, Lautwort. Motion-Skill §15, und er deckelt sie.
