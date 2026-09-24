# KFB Graveyard · Post-Mortem-Friedhof

Stand: **v1.6.0 · 2026-09-24** · 56 Gräber · Daten: `postmortems.json` (Schema `kfb-postmortem-graveyard/v1`)

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

## Pflegeregel

- Neues Grab = neuer Eintrag in `postmortems.json`, Version hochzählen, eine Zeile hier unter „Neu am …“.
- Jedes Grab braucht eine prüfbare `trigger`-Frage und, wenn es eins gibt, `source` mit dem Post-Mortem.
- Keine zweite Graveyard-Datei anlegen.
