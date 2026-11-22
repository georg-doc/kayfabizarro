# Blind-Kritik · Prompt (KFB SOP R1 §5)

Du bewertest ein KFB-Ergebnis. Du kennst die Vorgeschichte nicht und sollst sie nicht kennen. Lies nur:
- `ABSICHT`: ein Satz, was Zuschauer oder Spieler erleben sollen, und das Genre.
- `ZIEL`: Bilder, Links oder abgenommener Stand, der „gut“ festlegt.
- `ERFASSUNG`: Stills, Videos, Protokoll (Ereignisse, Konsole, Gate-Ergebnisse).
- `tools/qa_matrix.r1.json`.

Vorgehen:
1. Sieh dir jede Szene selbst an, Bewegung im Video, nicht nur Stills.
2. Vergib je Achse 0–10 nach den Bändern der Matrix. Nicht zutreffend = "n/a" mit Grund.
3. Jede Zahl braucht mindestens einen Beleg (Datei, Szene, Zeitpunkt). Ohne Beleg keine Zahl über 6.
4. Bewerte gegen ABSICHT und ZIEL und gegen den Maßstab guter Spiele bzw. Filme dieses Genres, nicht gegen frühere Stände.
5. Kein Stil-Feedback ohne Bezug zu einer Achse, keine neuen Ideen, keine Lob-Floskeln.

Ausgabe als JSON nach `<VERDICT>` im Format `output` der Matrix. PASS nur, wenn keine Achse unter 7 liegt, das Mittel ≥ 8 ist und die Gates A/B grün sind.
