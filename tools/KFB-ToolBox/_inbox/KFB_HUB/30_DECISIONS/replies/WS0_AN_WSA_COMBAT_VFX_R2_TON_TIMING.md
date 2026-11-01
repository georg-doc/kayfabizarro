# Zusatz WSA work · Combat VFX R2 · Ton und Takt · WS0 · 01.11.2026 (V-1170, V-1171, ergänzt Reparatur 1)
Georg hat die Klänge gehört: gute Richtung, „das nicht ewig optimieren“. Bau jetzt den Weg, keine neuen Klänge. Absicht: Waffen und Zerstörung sind die realistische Ebene von KFB, viszeral, fast Call of Duty mit Star Wars und Dieselpunk, alte klapprige DIY-Mechanik. Die Figuren bleiben cartoonig.

1. **Eine Ereigniskette je Schuss:** Ton, Flamme, Rückstoß, Geschoss und Einschlag laufen über dieselbe Schuss-ID und die Spielzeit. Der Treffer-Ton sitzt am wirklichen Treffer, nicht am Abschuss. Kaskade im Einschlag: Anschlag, Bersten, Trümmer, Nachrollen, abhängig von Größe, Material und Entfernung.
2. **Nicht-repetitiv, aber typisch:** Je Schuss aus jeder Schicht zufällig, ohne direkte Wiederholung: Anschlag, Körper, Mechanik. Dazu kleine Streuung in Tonhöhe, Pegel und Versatz. `shot_layers` in `40_AUDIO/elevenlabs_r1/combat_destruct_map.r1.json` auf `assets/private` @3ab91d03. Die Waffe bleibt am Klang erkennbar.
3. **Einzel- und Schnellfeuer:** Gatling aus einzelnen Schüssen im Takt der Flamme, deutliches Staccato, nicht als Rausch-Schleife, Hochlauf und Auslauf aus `gatling`. Pool und Ereignisring für die volle Folge prüfen.
4. **Wirkung einfach und plausibel:** Tabelle je Waffe, kein echtes Balancing: wofür taugt sie (Figuren, Fahrzeuge, Wände, Gebäude)? Einzelschuss gegenüber Schnellfeuer. Nur Daten über den vorhandenen Schadens-Owner, keine neue Logik. Georg soll spüren, welche Waffe wofür gut ist. Du schlägst die Werte selbst vor.
5. **Später, jetzt nicht:** Patronenhülsen mit Bild und Ton. Sieh nur vor, dass die Kette dafür ein Ereignis hergibt.

**Rückgabe:** Wie in Reparatur 1, im selben Durchgang. Prüf die Kette an Werten: Versatz Flamme zu Ton, Treffer zu Ton, Wiederholungen je 20 Schuss. Hören kann nur Georg.
