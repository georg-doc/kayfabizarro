# KFB Graveyard · Post-Mortem-Friedhof

Stand: **v1.10.0 · 2026-10-04** · 60 Gräber · Daten: `postmortems.json` (Schema `kfb-postmortem-graveyard/v1`)

## Was das ist

Jeder Fehler, der Georg Zeit, Tokens oder Nerven gekostet hat, bekommt ein Grab: Inschrift (`stone`), Kurzfassung (`hover`), Lehre (`lesson`) und eine Reißleine (`trigger`), also die eine Frage, die man sich im Moment stellen muss, damit es nicht wieder passiert.

Die Datei ist die Datengrundlage für die begehbare Graveyard-Zone (Camp-Hub, FrizzleBob als Friedhofsführer). Das Zonen-Modul v1.0.0 (Stand 2026-08-04, aus Dropbox `/CLAUDE/KFB VoxelWorld/KFB GraveYard Slice POC+Lights/kfb-graveyard-module/`) liegt im selben Ordner; `index.html` ist der Minigame-Host (`Graveyard_Minigame.html`) und lädt `./postmortems.json`. Ansehen: `https://kayfabizarro.pages.dev/kfb-hub/pruefen/graveyard/`. Das Standalone-Ein-File-Build ist bewusst nicht übernommen (keine Bundles). Sie ist aber vor allem die Pflichtlektüre für jeden neuen Chat: **erst die Reißleinen lesen, dann arbeiten.**

Felder: `who` = coworker | design | process (wer den Fehler gemacht hat), `size` = monument | large | medium | small (Kosten), `tags`, optional `pattern` und `source` (wo das Post-Mortem liegt).

## Herkunft dieser Fassung

Bis heute gab es nur lokale Kopien in Dropbox, in verschiedenen Ständen:

| Quelle | Version | Gräber |
|---|---|---|
| `KFB VoxelWorld/Graveyard_Slice1/postmortems.json` | 1.4.0 · 2026-07-22/24 | 34 |
| `KFB VoxelWorld/KFB-MED Project Diary (Camp-Hub)/postmortems.json` | 1.5.2 · 2026-07-21 | 28 (davon 6 nicht in Slice1) |
| `KFB Cube Academy v1`, `KFB GraveYard Slice POC+Lights` | ältere Teilstände | 12 |

v1.6.0 führt Slice1 und die 6 fehlenden Camp-Hub-Gräber zusammen (keine Duplikate, nach `id`) und ergänzt 16 neue Gräber vom 24.09.2026. **Ab jetzt ist `tools/kfb-graveyard/postmortems.json` die einzige Fassung**; die Dropbox-Kopien sind Geschichte.

## Neu am 24.09.2026 — Kontext

Der Tag war ein Konsolidierungstag nach dem Abbruch des ChatGPT-Web-Lead-Chats: Production Desk / KFB Hub gebaut, ToolBox umgezogen, WorldBuilder neu ausgerichtet (Terrain first, Kugel, Travel Globe raus), Hürth-Formsprache, Mixamo-Animationen, Billboard, Vorhang, VFX, Rennstrecken-Baukasten. Georg hat dabei viele Fehler mehrfach erklären müssen. Die Gräber:

**Aus den Post-Mortems der Bau-Chats**
- *Die Chat-Vorschau als Bühne* (Monument): Schwundformen durch „chat-taugliche“ Kopien und Bundles. Lösung: unveränderte Veröffentlichung per Wrapper unter `kfb-hub/pruefen/`.
- *Das Flickwerk an der Bordsteinkante*: Hürth R1/R2, grüne Tests, sichtbar kaputt; zwei Fehlpässe → eingefroren. Quelle: #194 `FAILURE_RECOVERY_HUERTH01_R2_2026-09-24.md`.
- *Fünf Fixes am falschen Vorhang*: Curtain v1, erst der Vergleich mit dem three.js-Original half. Quelle: `_inbox/KFB Theatre Curtain v2/docs/POSTMORTEM_…`.
- *Die Karte am falschen Pivot*: Billboard B0, geschätzt statt gemessen. Quelle: `_inbox/KFB Billboard … B0/POST_MORTEM.md`.
- *Die Frame-Folge aus dem Dateinamen* und *src-Loch, ref und Lifecycle im DC-Runtime*: VFX-01. Quelle: `_inbox/KFB_VFX_01_REVIEW/POSTMORTEM.md`.

**Aus der Coworker-Session**
- *Der Vorschlag gegen die eigene Entscheidung*: Travel als Weltbasis vorgeschlagen, obwohl anders entschieden.
- *Der Bausatz, der keiner war*: Legacy-Figuren ungeprüft als Bausätze bezeichnet.
- *Das Briefing aus Pfadzetteln*: WorldBuilder-Briefing als Pfadliste (Schwundform).
- *Der Auftrag, einen Auftrag zu schreiben*: Briefing an WSA delegiert statt selbst geschrieben.
- *Die Textbausteine zum Anhängen*: Stückwerk statt GitHub.
- *Der erprobte Weg, den es nicht gab*: unbewiesener Retarget-Weg behauptet.
- *Das Urteil über die falsche Version*: Prüfseite zeigte V1.
- *Die Briefing-Ansicht beim Zusammenlegen*: Hub-Regression.
- *Der Hub, von Hand geflickt*: erzeugte Datei von anderen Chats bearbeitet → leerer Hub.
- *Die Antwort auf Englisch*.

## Folgeentscheidung (WSA, PR #201, 24.09.2026)

Aus diesem Tag folgt: Der Coworker darf künftig Statusdaten aktualisieren, aber keine ungeprüften produktiven Briefings mehr schreiben. Der kompakte Production Desk ist der einzige KFB Hub; nächstes Gate `HUB-CTRL-01`.

## Neu am 29.09.2026 — WSA-Lead Canon-Persistenz-Fail

- *Der Kanon, der nur irgendwo auf GitHub lag* (Large · Process/WSA Lead): Shadow-/Contact- und Clay-Fassaden-Regeln waren technisch vorhanden und teils abgenommen, blieben aber in Session-Cuts bzw. einem branch-lokalen S5-Brief ohne stabile Main-Routing-/Vorrangsschicht. Ein frischer Chat konnte den geltenden Stand deshalb korrekt verfehlen und gelöste Arbeit wieder als offen behandeln.
- Reißleine: **„Kann ein frischer Chat die abgenommene Regel von START_HERE aus finden?“**
- Vollständiger Postmortem: `skills/chat/recovery/POSTMORTEM_WSA_LEAD_CANON_PERSISTENCE_FAILURE_2026-09-29.md`.
- Recovery/Canon-Routing: Draft PR #290.

## Neu am 04.10.2026 — One-Shot / Legacy-OSM-Donor-Fail

- *Der technische Donor, der zur Welt wurde* (Monument · Process/WSA Lead): Der Hürth/OSM-B1-Strang war für Gebäude-/Fassadenmechanik bewiesen, wurde aber ohne visuelle Abnahme als sichtbare aktuelle WB2-Weltgrundlage promoted. Der One-Shot schützte diese falsche Grundlage mit “World PASS / do not rebuild”, sodass WSA den Player korrekt in die falsche Welt integrierte.
- Reißleine: **„Welche sichtbaren Quellen sind wirklich im Frame?“**
- Neue Bindung: Donor-Scope getrennt nach MECHANISM / PRESENTATION / CONTENT / DATA; sichtbare Quellen brauchen Allow-/Denylist.
- Vollständiger Postmortem: `skills/chat/recovery/POSTMORTEM_WSA_ONE_SHOT_LEGACY_OSM_CONTAMINATION_2026-10-04.md`.
- Current recovery: `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/CURRENT_ONE_SHOT_VISUAL_RECOVERY_2026-10-04.md`.


## Neu am 04.10.2026 — Sites-first / Cloudflare-Delivery-Fail

- *Cloudflare vor der Site* (Large · Process/WSA): Production Hub, EyeRig, Asset Librarian und Audio existierten bereits als GPT-Site-Linie, mehrere Projektverträge sagten ausdrücklich Site-first bzw. Cloudflare nur Recovery/Regression. Der globale Root-Workflow blieb jedoch Cloudflare-first. WSA begann im MVP-Run deshalb erneut am Cloudflare-Mirror und wechselte erst nach Georgs Eingriff zum vereinbarten GPT-Site-Ziel.
- Reißleine: **„Was ist die vereinbarte primäre Produktoberfläche?“**
- Neue Bindung: GPT Site ist bei Site-capable KFB-Produkten die primäre Produkt-/Authoring-/Daily-Use-Oberfläche; Cloudflare ist nachgelagerter, begrenzter Kompatibilitäts-/KFB-Hub-Mirror, wenn benötigt. Fehlende Sites-Capability führt zum Sites-fähigen Handoff, nicht zum Host-Austausch.
- Vollständiger Postmortem: `skills/chat/recovery/POSTMORTEM_WSA_CLOUDFLARE_FIRST_SITE_DELIVERY_DRIFT_2026-10-04.md`.
- Root-Policy: `skills/chat/KFB_SITES_FIRST_DELIVERY_POLICY_2026-10-04.md`.


## Neu am 04.10.2026 — Publish-only / Kosten-Fail

- *High Reasoning fürs Publish-Klicken* (Large · Process): Ein bereits gebauter/frozen Site-Kandidat sollte erneut über teure High-Reasoning-Kapazität laufen, nur weil dort die Sites-Capability verfügbar war. Georg stoppte die Eskalation.
- Reißleine: **„Muss hier wirklich noch gedacht werden — oder nur publiziert?“**
- Neue Bindung: `PUBLISH_ONLY` ist ein eigener Low-Cost-Modus. QA-grüne Kandidaten hinterlassen ein exaktes Publish-Paket; Site-Publishing geht an den günstigsten Sites-fähigen Executor. Capability-Lücke → warten/übergeben, nicht Reasoning-Tier hochschalten.
- Contract: `skills/chat/SITES_PUBLISH_ONLY_CONTRACT_2026-10-04.md`.

## Pflegeregel

- Neues Grab = neuer Eintrag in `postmortems.json`, Version hochzählen, eine Zeile hier unter „Neu am …“.
- Jedes Grab braucht eine prüfbare `trigger`-Frage und, wenn es eins gibt, `source` mit dem Post-Mortem.
- Keine zweite Graveyard-Datei anlegen.
