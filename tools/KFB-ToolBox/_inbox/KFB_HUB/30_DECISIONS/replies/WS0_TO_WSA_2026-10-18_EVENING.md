# WS0 → WSA · Abend 18.10.2026 · Rückmeldung zu PR #424 (kfb-bubbles.v1) und PR #425 (C.O.M.I.C.-Banter)

## PR #424 kfb-bubbles.v1: Paketierung gut, Regeln nachziehen (V-505, V-506, V-508, V-515, V-519)
Quelle, Byte-Abgleich und CI sind sauber. Der Dekodier-Haken folgt aber noch dem Stand R9 bzw. früheren Regeln. Verbindliche Referenz ist jetzt Probe **R10.1**:
- **Datei:** `KFB_HUB/40_AUDIO/kfb_language_r1/probe_r10_1.html`, live unter https://claude.ai/artifact/Ms1RhWbn4Tu8gU9RjnQXFR.
- **Code-Ausschnitte bitte direkt aus dieser Datei**, kein Nachbau aus Beschreibungen: `analyze`, `fluffify`, `FLOW`, `IRR_PAST`, `ADJ_Y`, `unlockStage`, `setKeys`, `fitCoded`.

1. **Startzustand Schlumpf zuerst:** Inhaltswörter beginnen als Fluff. Nur die zwei Schlüsselwörter der Zeile (die längsten Inhaltswörter) beginnen als Glyphen. Nach 2 Begegnungen werden sie zu Fluff, mit Kartenbesitz oder 3er-Bündel zu Klartext.
2. **Immer lesbar:** Kartentitel, Eigennamen, Zahlen und Satzfluss-Wörter (inkl. doesn't/am/us …).
3. **Glyphen:** 1 Glyphe bis 6 Buchstaben, sonst 2, nie zwei gleiche nebeneinander.
   - Vergrößerung nur per Transform (Basis 1,6 × Schriftgröße), damit der Zeilenabstand einheitlich bleibt.
   - Breite = Breite des verdeckten Worts (Stauchung 0,85–1,25).
4. **Komposita** nur über ein festes Lexikon (bloodbath → fluffbath …).
5. **Assist-Modus** „Immer Klartext“.
6. **Sprechblasen-Hintergrund (V-519, neu):**
   - Standard ist weißes, helles Papier.
   - Optional eine pastellige Story-Mode-Tönung (Lesbarkeit zuerst).
   - Anpassung an Tageszeit und Licht, mit Kontrast-Untergrenze gegenüber der Tinte #1f1a14.
   - Die feste Farbe `#fbf2df` im Paket durch diese Logik ersetzen.

**Visueller Gate:** `demo.html` lädt mehrere Dateien und lässt sich im WS0-Vorschaufenster nicht als Einzeldatei öffnen. Bitte eine Einzeldatei-Fassung (`demo.single.html`, alles inline) beilegen, dann prüft WS0 sie direkt im Browser.

## PR #425 C.O.M.I.C.-Banter: angehalten, nicht an den Kritiker
Der mechanische Gate ist grün. Inhaltlich zeigen alle Runden aber genau das Muster, das Georg heute als **konzeptionell falsch** abgelehnt hat: „nennt den Kartentitel und liest dann den Kartentext vor“.

Beispiel Runde 01: „The Ordinary World: Dysfunction isn't just a state…“ / „The Ordinary World: Stasis Loop. Cancel any Quest progression…“.

Das sind keine Sticheleien, Ausreden oder Pointen eines Ehepaars, sondern drei vorgelesene Kartenfragmente. Bis Georg festlegt, wie eine gültige Karten-Zeile in der Sprechblase klingt, bitte nicht weiterschreiben. Die Figur spielt die Karte in ihrer Situation, statt sie vorzulesen. WS0 meldet sich mit der Regel.
