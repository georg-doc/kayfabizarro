# Aqua · Ton-Messwerte für Kritiker B (22.11.2026, Stand r38 / Artefakt v52)

**Kurz:** Ton lässt sich im Testbrowser nicht anhören. Hier stehen die Messungen aus der Diagnose (`#diag` am Link), damit Kritiker B den Mix beurteilen kann. Georgs Höreindrücke stehen dabei.
**Stand:** Radio trocken direkt auf dem Master, Becken-Bett leiser, Blubbern weich, Echo-Schnipsel weich geblendet, echter Bubble FM Mixer.
**Zu prüfen:** Georg 22.11. abends nach Artefakt v51: „Ton passt“ (Musik, Flexa, kein Knacken mehr). Offen bleibt nur die Mischung als Ganzes (Indie- bis AAA-Anspruch).

## Signalweg
| Quelle | Weg | Pegel / Hinweis |
|---|---|---|
| Radio (Bubble FM, 72 Titel, −18 LUFS) | eigener Bus 0,8 → Master, ohne Unterwasser-Filter | Master ≈ −26 bis −28 dB RMS bei laufendem Titel |
| Bubble FM Mixer (8 Stile, Stems 110 BPM, E) | gleicher trockener Bus | ≈ −22,8 dB RMS am Mixer-Ausgang |
| Spielmusik-Score (prozedural) | Musik-Bus mit Becken-Tiefpass (≈ 1,4 kHz) | stumm, sobald das Radio einmal lief; nur der Sonar-Ping bleibt |
| Sonar-Ping | direkt auf den Master, mit Echo | etwa alle 10 s, auch ohne Radio |
| Becken-Bett | Brummen 50/100 Hz, Rumpeln, Filterrauschen | auf etwa ein Drittel gesenkt (Georg: „Dauerrauschen nicht immersiv“) |
| Ausströmer im Becken | weiche Blasen, 2–5 pro Sekunde | vorher 7–20 harte Töne pro Sekunde (Georgs „Knacken“) |
| Echo-Stimme | Sprite-Schnipsel, 15 ms Ein- und 40 ms Ausblendung | vorher harte Schnitte |
| Flexa | Video-Ton im Bullauge | |
| Ziffernblock | DTMF je Taste, Dreiklang bei OPEN, Brummen bei DENIED | |
| Ride | Cartoon Chase im Radio, Ride folgt der Abspielzeit | Radio tanzt auf st.musik |

## Georgs Höreindrücke heute
- Im Artefakt in der Chat-Ansicht keine Musik, im Browser schon.
- Vorher: nur Rauschen und harter Schlag. Ursache war der Tiefpass, behoben.
- Danach: Ton global stumm durch gespeichertes Stumm am Radio, behoben.
- Danach: „hartes, kurzes Knacken, Klopfen“. Das Blubbern ist behoben, der Rest ist offen.
