# Session-Paket · 30.09.2026 · Billboard-Collage, PD-Pool, Film, Karten

Claude Design pusht nicht. Dieses Paket ist ZIP plus Preview; Integration macht der Web Lead.

## Inhalt

| Pfad | Status | Zweck |
|---|---|---|
| `src/KFB Billboard Kaleidoscope H5.dc.html` | KANDIDAT, Georg-Abnahme offen | H4-Kopie + freier Pool + Basis FILM |
| `src/KFB Billboard Kaleidoscope H6.dc.html` | KANDIDAT, Slice A | H5 + KFB-Karten live (Exhibition-Trio) |
| `src/KFB Card Crop Proof.dc.html` | PRÜFBOGEN | Zellen und Motivrahmen isoliert |
| `src/data/h6-card-crops.json` | DATEN | cardGrid (aus SSOT) + motifBox (geschätzt) |
| `src/support.js` | SHARED | DC-Laufzeit |
| `HANDOVER_WSA.md` | HANDOVER | Web-/Stage-Integration H5 |
| `briefings/BRIEFING_PD_POOL_R2_R3.md` | BRIEFING Web-Chat | PD-Pool registrieren (R2) und befüllen (R3) |
| `briefings/BRIEFING_KFB_CARD_BAKE.md` | BRIEFING Web-Chat, ENTWURF | KFB-Karten als Bilder rendern und ablegen |
| `BRIEFING_FRESH_CHAT.md` | KONTEXT | Kaltstart für den nächsten Chat (H6, Karten) |
| `CHANGELOG_ADDITIVE.md` | LOG | was am 30.09. entstand |
| `docs/FAIL_2026-09-30.md` | FAIL | Collage-Engine v0, Befund und Ursache |
| `context/collage-engine/` | FAILED CANDIDATE | nur zur Nachvollziehbarkeit, nicht integrieren |

H4 (`KFB Billboard Kaleidoscope H4.dc.html`, PASS 26.09.) ist unverändert und liegt im Paket `export/kfb-billboard-hypernorm-h4_2026-09-26/`.

## Keine Assets im Paket

Keine Modelle, Bilder, Clips, Fonts. H5 lädt zur Laufzeit: LoC-Platten von `tile.loc.gov`, PD-Manifest über raw am Pin `f3acaaeb98530dd9ffb7d200d61956891e738336`, Medien über jsDelivr am selben Pin, Filmclips von `upload.wikimedia.org`, Schriften von Google Fonts.
