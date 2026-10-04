# SOURCE · KFB Hub UX Recovery

Gelesen am 2026-09-25 zwischen 18:02 und 18:07 UTC.

| Quelle | Ref | Verwendung |
|---|---|---|
| `kfb-hub/index.html` | `dfaafac070747f9543b5eb5a635e2aaa74e57b83` (blob `0de46343`) | Donor, byte-genau kopiert nach `hub-recovery/donor/` |
| `tools/production_desk/HUB_UX_RECOVERY_CLAUDE_DESIGN_2026-09-25.md` | `ef8dbb07032a1d148893f2e0a125e04fe90263fd` | Brief |
| `tools/production_desk/config.json` | `ef8dbb07` | Lane-Wahrheit, Buckets |
| `tools/production_desk/desk/desk.template.html` | `ef8dbb07` | Quellen-Reihenfolge, Polling, Fallback-Muster, Copy-Brief-Logik |
| `skills/chat/workflows/KFB_HUB_UI_V2_2026-09-19/ACCEPTANCE_RETURN_2026-09-21.md` | `ef8dbb07` | Georg-Abnahme v2 |
| `skills/chat/workflows/KFB_HUB_UI_V2_2026-09-19/CLAUDE_DESIGN_BRIEF.md` | `ef8dbb07` | v2-Regeln |
| `…/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/HUB_BRIEFING_CATALOG.json` | `chatgpt-web/production-architecture-v3-2026-09-24` | Strang-Struktur (zur Kontrolle) |
| `registry/production/v1/*.json` | `bot/production-desk-update` (manifest sourceCommit `74c6fa5c`, checkedAt 2026-09-25T17:41:10Z) | eingebauter Fallback |

Zur Laufzeit liest der Kandidat live von `bot/production-desk-update`, dann `main`. Beim Test lieferte die Live-Registry bereits sourceCommit `c62d903` (Stand 18:06 UTC); der Fallback ist damit älter als live und wird korrekt ersetzt.

Icons: Pfaddaten nach Lucide (ISC-Lizenz), inline als SVG.
