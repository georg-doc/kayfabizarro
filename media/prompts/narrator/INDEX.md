# media/prompts — Staging-Bundle (push-fertig)

*Das Wichtigste an FrizzleBob-Modes, produktiven Prompts und Quote-Pool, zusammengestellt für den Push nach `georg-doc/kayfabizarro`. Zweck: der Game-Client (Grand Theft Tax, Discourse-Engine, Ride-Narrator) zieht diese Dateien zur **Laufzeit per RAW** — der Skill selbst ist nicht fetchbar.*

**IP-Hinweis:** die Modes/Prompts sind FrizzleBob-Kanon. Öffentlich im Repo = grenzwertig, aber für den Use Case ok — **deine Entscheidung, du pushst.** Ich stage nur lokal.

**Anti-Drift:** Autor-Kanon bleibt der `frizzlebob-kayfabizarro`-Skill (+ `playtest_personas.json`). Diese media-Dateien sind **Laufzeit-Kopien**, die daraus erzeugt sind. Bei Konflikt gilt der Skill. Wenn du den Skill änderst, diese Kopien nachziehen.

## Was rein soll (Datei → Repo-Ziel → Status)

| Datei | Repo-Ziel | Status |
|---|---|---|
| `frizzlebob_modes.md` | `media/prompts/frizzlebob_modes.md` | **neu, hier im Staging** — 7 Modes + D6→Mode-Map + Beat-Frame |
| `KAYFABE_TIPS_corpus_v1.md` | `media/prompts/KAYFABE_TIPS_corpus_v1.md` | liegt in `KFB VoxelWorld/` — die 5 KayfabeTips + Craft + Improv |
| `bunny_carny.md` | `media/prompts/narrator/bunny_carny.md` | liegt in `KFB VoxelWorld/media_prompts_narrator/` — FB Golden Sample (Default-Pet) |
| `fox_trickster.md`, `cat_skeptic.md` | `media/prompts/narrator/` | **schon im Repo** ✓ |
| übrige 9 Narrator-Blätter | `media/prompts/narrator/` | prüfen/hochladen (Task #54) |
| `NARRATOR_PORT_B4_v1.md` | `media/prompts/` (oder `docs/`) | liegt in `KFB VoxelWorld/` — Wiring-Doku, optional fürs Repo |
| **Quote-Pool Spieler** `KFB_Korpus_KayfabeTaxIsBizarroTheft.md` | `media/prompts/refusal/` | liegt in `gvw/Steuer/_Kreativ_TaxIsTheft/` — Spieler-Seite der Discourse-Engine |

## Reihenfolge fürs Erste (produktiv nutzbar)

1. `frizzlebob_modes.md` + `KAYFABE_TIPS_corpus_v1.md` + `bunny_carny.md` → damit läuft der Narrator/Discourse-Kern.
2. Quote-Pool (Refusal-Korpus) → damit hat die Discourse-Engine ihren Offline-Fallback.
3. Rest der Narrator-Blätter (die anderen Pet-Stimmen) nach und nach — nicht blockierend.

*Stand 2026-08-04. Sobald gepusht, kann Grand Theft Tax die Pools per RAW ziehen (siehe Upload-Vorbedingung im GrandTheftTax-v1-Briefing).*
