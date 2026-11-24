# Ingest aqua10-ad-test-r1 · Familie A · Lauf 1 · SIMULIERT

Weg: einzeln · Skill r1 · Paket-sha256: 51a532d2b011…

| Befund | Szene | PASS-Ziele | Ergebnis | Gründe / offen | versandbereit |
|---|---|---|---|---|---|
| F01 | S02_startbild | F01_still_v1 | bau | – | nein |
| F02 | S05_figurenblatt | F02_still_v1 | bau | neue Assets: großer Kit-Rahmen fürs Figurenblatt (fehlt im Kit) | nein |

Bildtreue (ad_bildtreue.py; Mittel außerhalb ab 12 Blick, ab 25 FAIL; Kachel ab 30 Blick, ab 45 FAIL): F01_still_v1 PASS (Mittel 1.08, Kachel 2.3, OCR übersprungen), F02_still_v1 PASS (Mittel 0.58, Kachel 1.6, OCR übersprungen)

**Klären:**
- Doppelt geladen (ignoriert): ChatGPT Image 2 (1).png

**Paarung einzeln geladener Bilder (eindeutig):**
- F02_still_v1 ← ChatGPT Image 1.png (Ähnlichkeit eindeutig)
- F01_still_v1 ← ChatGPT Image 2.png (Ähnlichkeit eindeutig)
