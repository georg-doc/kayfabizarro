# WS0 → WS1 (Lead, weiter an WS-Audio und WS-NPC) · Georgs Urteile zu q188 und q189 · Übergabe-Tag (V-734)

## Tier 0
1. **Chatter-Silben: TUNE, noch nicht Standard.** Die Satzmelodie-Logik ist gut. Die hohen Stimmen quieken aber, sind anstrengend und tun fast in den Ohren weh. Im Wechselrede-Video stampfen die Schritte viel zu laut.
2. **Tratsch-Trio tr1: TUNE.** Die Sprechblasen haben wieder zu wenig Randabstand, obwohl Georg das schon angemerkt hat.
3. **Abnahme-Bilder neu:** im Live-Stand mit dem Site-Hash, ohne rosa Rahmen, ohne Amphitheater, mit unterschiedlichen Figuren. Jede Karte sagt in einem Satz, was abzunehmen ist.

## Chatter-Silben (WS-Audio, mit WS-NPC)
- **Lage:** Keine Silbe über der mittleren Lage der jeweiligen Familie. Bei hohen Instrumenten eine Oktave tiefer oder ein tieferes Paar-Instrument wählen. Die Lagenregel aus SUNO_SSOT §6 gilt: Tief und hoch kommen über Instrumentenpaare, verschoben wird höchstens um etwa ±5 Halbtöne.
- **Klang:** weicher, keine spitzen Einschwinger. Tiefpass bzw. Höhen dämpfen und die Lautstärke unter die Musik setzen, damit es plappert statt quiekt.
- **Bleibt:** Satzmelodie aus dem Satzzeichen, Laut nur mit Blase, höchstens zwei Sprecher.
- **Schritte:** Im Wechselrede-Video ist lautes Stampfen zu hören. Bitte die Schritte über den einen Mixer pegeln (Bus, Ducking wie die übrigen Effekte) und den Pegel im Return nennen.
- **Abnahme-Video:** Es beginnt direkt mit Ton, ohne stummen Vergleichsteil, höchstens 60 s, ein Ort, zwei Figuren, dann ein zweiter Ort. Je Sprecher steht die Familie im Bild.

## Tratsch-Trio tr1 (WS-NPC, Blasen-Modul)
- Der Randabstand ist Standard laut §2 der Übergabe (`bubblepad` neu). Die tr1-Bilder sind offenbar mit dem alten Abstand entstanden. Bitte prüfen, ob `lines=tr1` den neuen Abstand umgeht oder das Bildskript `bubblepad=old` setzt, und beheben.
- Neue Bilder: Live-Welt (`world=probe`, `look=terrain3`, Site-Hash aus `src/siteHash.js`), keine Bühne im Amphitheater, kein rosa Rahmen, drei verschiedene Figuren aus dem Figuren-Register. Pro Bild eine Zeile darunter: Was ist neu, worauf soll Georg achten?

## Rückgabe
Abschnitt in `WS1_STATUS.md`, dann die neuen Bilder und Videos auf `abnahme/ws1`. WS0 pflegt sie wieder in den Hub ein. Kein Merge nach `main`, nichts löschen.
