# TEST REPORT · 2026-09-26 r2
| Test | Ergebnis | Beleg |
|---|---|---|
| Laden in der Claude-Design-Vorschau (Entry-DC) | **PASS** | ready_for_verification; eine leere Meldung `{}` war schon vorher da |
| Hintergrund-Verifier nach Body/Import/Talk | **PASS** nach Fix (Syntaxfehler durch `//`-Kommentar, behoben) | Verifier-Befund 26.09. |
| Verifier Bottom-Bar / Animation Studio | NOT_RUN (lief bei Cut-Erstellung noch) | — |
| Selbsttest »…« | **NOT_RUN** in r2 (r1: 27/27) | — |
| zipcheck.py | NOT_RUN (hier kein Python) | CHECKSUMS.sha256 per JS erzeugt |
| Clean-Run aus dem entpackten ZIP | NOT_RUN | — |
| Sichtprüfung Georg | OFFEN | evidence/ = Georgs Befund-Screenshots vor den Fixes |

## Sichtprüfung (für Georg)
1. Rigging › Eyes · Style Clay → Lider liegen auf dem Ball · Blink schließt oben, unten und an den Ecken · Closing Glide ↔ Fold.
2. Rigging › Ears · Spacing/Forward/Height/Depth + Base rotation → die Wurzel geht mit, kein Hautstreifen im Kopf.
3. Rigging › Body · Chunky / Tall → Gelenke knicken nicht, Füße am Boden.
4. Schatten: der Körper wirft wieder, kein Flackern beim Orbit.
5. Mouth Source Painted → Talk bewegt den Mund.
6. Bottom-Bar: Emotes / Viseme / Anim wirken in Studio und Rigging.
