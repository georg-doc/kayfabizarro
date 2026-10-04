# WSA-Briefing- und Routing-Defekte (Session 2026-09-29)

| # | Defekt | Folge | Korrektur |
|---|---|---|---|
| 1 | Schatten-Rezept nur in Session-Cuts (`_inbox/…Production-03/…/LESSONS_SHADOWS.md`), stabiler Pfad existierte nicht | J02/J03 ohne Kanon | PR #290 legt `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md` an (Georg); mergen |
| 2 | S5-Fassaden-Brief nur auf Branch `georg-doc-patch-2` | Main-Suche findet nichts | Router `CLAY_BUILDING_FACADE_ROUTER.md` (PR #290) |
| 3 | K1-Codebasis nicht im Repo auffindbar bis 29.09. abends | 3 Pässe aus Screenshots geraten | jetzt `_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/` → in den Router aufnehmen |
| 4 | Router sagt „neue Bühnen = K2 v10“, K1/H0-Look = v8 ohne Werkzeugmix | Widerspruch für jede Bühne, die „wie K1“ aussehen soll | Router ergänzen: Haus-Look K1 ⇒ v8 + K1-Uniforms, oder v10-Profil nachweisen, das K1 gleicht |
| 5 | Fingerabdruck-Textur als „nicht enthalten“ in Exporten, aber vom Shader vorausgesetzt | stilles Fehlen der Dellen | als Pflicht-Asset in `ASSETS.md` + Pfadprüfung |
| 6 | T4 Übergangsatlas verschmilzt Hausteile und biegt; Router nennt R0A-`bend()` „nicht universell“, T4 nutzt es trotzdem für Fahrszenen | Dächer brechen beim Kneten | T4-Hauspfad als eigener Adapter mit K1-Reihenfolge (kneten je Teil → skalieren → erst dann platzieren) |
| 7 | PlayCanvas-Fork als Fahr-Owner vorgeschlagen, Werte passten nicht zu KFB-Feel | J02/J03 unbrauchbar gefahren | Race v0.8 bleibt Fahr-Owner; Fork nur als Referenz |
| 8 | R0A-Footer-Pfad falsch (`export/…/START_HERE.md`) | Irreführung | in PR #290 notiert |
