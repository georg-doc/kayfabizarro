# Narrator-Port — der B4-Fix

*Was fehlt, damit das hüpfende Pet echte Beats spricht statt generischem „Therefore…". Der Beat-Kern existiert (Sim-Engine), aber nicht im Ride-Narrator. Dieser Port zieht ihn rüber. FB zuerst; die anderen Pets später über dieselbe Persona-Tabelle.*

**Betroffene Dateien:** `terrain-v13/narrator-llm.js` (`payload()` + Prompt-Zusammenbau) · `terrain-v13/narrator-prompts.js` (Persona-Registry) · Quelle des Kerns: `gameplay_simulation/engine/GM_PROTOCOL.md`, `kfb_roster_players.yaml`, `playtest_personas.json`, `crit_memory.py` · `KAYFABE_TIPS_corpus_v1.md`.

---

## Das Problem in einem Satz

Heute schickt `narrator-llm.js` → `payload()` nur: Karte + Modus + Tempo + Story + Cue. Und `CODE.narrator` (der laufende Contract) kennt kein but/therefore, keine Performbarkeit. Der Kausalitäts-Frame (KayfabeTip 1) fehlt im Ride-Prompt. Der Port schließt genau diese Lücke.

## Befund (2026-08-04): die Persona-Ebene existiert schon — sie ist NICHT zu bauen

Die 12 „Ride-Personas" in `narrator-prompts.js` sind **kein** zweites System. Jedes ist ein **Blatt pro PET**, das seinen **Sim-Archetyp deklariert** — also einen deiner 6 Crits. Verifiziert im Repo:

- `fox_trickster.md` → „Pet: `fox`. Sim-Archetyp: **A.I.Liza**." (voll, gepusht)
- `cat_skeptic.md` → „Pet: `cat`. Sim-Archetyp: **Doc H.A.I.ner**." (voll, gepusht)
- `bunny_carny.md` (FB, Default) → **kam leer zurück, offenbar noch nicht hochgeladen** → deshalb spricht ausgerechnet FB heute den generischen `CODE.narrator`. Das ist Task #54.

**Korrektur (alle 12 verifiziert 2026-08-04):** die 12 sind NICHT „6 Crits auf 12 Pets". Es sind **zwei Generationen + FB:** (a) **5 Sim-Crit-Stimmen** (fox=A.I.Liza · cat=Doc H.A.I.ner · tiger=Stef.A.I.n · panda=KA.I.Fabster · koala=Nad.A.I.a); (b) **6 Story-Mode-Stimmen**, je fest an eine D6-Fläche + Rasa + Welt-Tradition (deer=Tragic/Mono-no-aware · monkey=Comic/Panchatantra · crab=Absurd/Wabi-Sabi · lion=Heroic/Tolstoy · giraffe=Mystical/Yūgen · polar=Forbidden/Dostojewski), gemeinsames Gesetz **„Ma" = end before the climax = das Gap zwischen zwei Panels**, eigene `rate`/`pitch`; (c) **FB (bunny) = der einzige rotate-all**. **Repo-Stand: 11/12 gepusht, es fehlt NUR `bunny_carny.md`** (das FB-Blatt aus dieser Session) — das ist die ganze #54-Lücke.

Und diese Repo-Blätter kodieren bereits das Meiste dieses Ports: Hard Rules (keine Gedankenstriche · „discard your first three lines" · Rent-Rule · `silence`), den `payload`-Vertrag (card/mode/speed/story), „mode is the weather". Was sie **noch nicht** tragen: den expliziten **Tell-Frame** (but/therefore, Tip 1) und die **story_mode-Stimm-Rotation** für FB. Der Port schrumpft damit auf: Tell-Frame ergänzen · FB-Mode-Stimmen ergänzen · **die fehlenden Blätter hochladen, FB zuerst.**

---

## 1 · Der neue Prompt-Aufbau (`system`, geschichtet)

Vier Schichten, in dieser Reihenfolge — von unveränderlich (unten) nach beat-spezifisch (oben):

1. **Layer Zero** (immer, aus `playtest_personas.json` → `globals_layerZero`, kanonisch aus dem Skill): keine Gedankenstriche · keine Floskel-Opener/AI-Closer · **Rent-Rule** (jeder Satz nennt Mechanismus ODER Kosten ODER liefert ein konkretes Bild ODER trägt Rhythmus, sonst streichen) · „players/readers", nicht „the audience" · keine Appliance/AI-Meta-Gags · die ersten drei Gags verwerfen.

2. **Persona** (aus der Tabelle, §3): Archetyp + Stimme des aktiven Pets. **Für FB mode-abhängig** — der Story-Mode-Würfel wählt die Stimme (§2).

3. **KayfabeTips-Kern** (aus `KAYFABE_TIPS_corpus_v1.md`, gekürzt auf den Sprech-Auftrag):
   - **Tip 1 · Tell-Frame:** erzähl im Frame *„I am [actor], and [s1], **but** [s2], **therefore** [s3], so in the end [quest]."* Never and-then.
   - **Performbarkeit:** liefere eine spielbare Handlung, keine Beschreibung/kein Hedge.
   - **Tip 5:** ein konkretes Bild statt Abstraktion. **Tip 4:** je absurder, desto trockener.

4. **Beat-Auftrag** (das `cue`): weiter Beat (Ki) stellt die Frage · Punch-Beat (Shō) holt die Antwort. Gesprochen, English, ≤2 Sätze, „silence" wenn nichts passiert.

Alles darunter (Netz) bleibt: kein `window.claude` → Layer bleibt aus, `CODE.narrator` spricht. Nie warten aufs Modell (Ki fragt vor, Shō holt ab — unverändert).

---

## 2 · `payload()` — die neuen Variablen

Heute sendet `payload()`: `card`, `mode`, `speed`, `story`, `cue`. **Dazu kommt:**

| Feld | Quelle | Wofür |
|---|---|---|
| `story_mode` (1–6, benannt) | Story-Mode-Würfel | wählt für FB die Stimme (§2); für den Modus-Ton |
| `frame_slots` | leer, das Modell füllt sie | erzwingt den Tell-Frame: `actor · s1 · but_s2 · therefore_s3 · quest` |
| `performable_hint` | letzter Play-Beat | erinnert an die Handlung-statt-Beschreibung-Regel |
| `memory` | `crit_memory.py inject(crit)` | ersetzt/erweitert `story`: Karten die er nicht halten konnte · Signature-Wins · King-Stil · liebster Social Call · was zuletzt auf ihn gerufen wurde (bounded, letzte N) |

`story_mode` ist der wichtigste Zusatz: ohne ihn kann FB die Stimme nicht rotieren, und der Beat bleibt tonlos.

---

## 3 · Die Persona-Tabelle (FB jetzt, 5 später)

Eine **Tabelle, kein Sonderfall** — genau wie `narrator-prompts.js` es schon anlegt (repo-first Blatt + Code-Netz). Jeder Eintrag: `archetype` + `voice` + `disposition` + `linguistics`. Aus `kfb_roster_players.yaml` + `playtest_personas.json`.

### FrizzleBob — jetzt, vollständig (`default: true`, `voiceTag: rotate_all_modes`)

FB hat **eine Stimme pro Story-Mode-Face** (aus `frizzlebobModeVoices`). Der Würfel wählt:

| Würfel | Mode | FB-Stimme | Voice-Cue (gekürzt) |
|---|---|---|---|
| 1 | Tragic | bedside | müde, aufmerksam, genau; Mechanismus + Kosten + Charakter |
| 2 | Comic | mensch | trockene Selbst­erkenntnis, frech aber warm; „it's your fault, play the gap" |
| 3 | Absurd | rapgod | synkopierter Wortakrobat, Binnenreim, das Unmögliche ist normal, nicht erklären |
| 4 | Heroic | carny | direkte Ansprache, hält das Objekt hoch, Barker-Bombast, spiel den Gipfel |
| 5 | Mystical | fixer | sotto voce, eine Zeile pro Beat, Mechanismus by implication |
| 6 | Forbidden | analyst-deep | cui bono zuerst, die offizielle Story 180° drehen, dann fragen wer zahlt |

Je Face liegt in `playtest_personas.json` auch ein `forbidden` (die eine Mode-Sperre) und ein `exemplar` (Few-Shot-Anker) — beide in den Prompt ziehen. FBs Disposition: `switchBias 0.15 · powerTendency 0.85 · modeCommit amplify · king.generosity 0.2 (rewards commitment)`. Linguistik: carny-barker punch, Ring/Zirkus/Backstage, yes-and status-up MC.

### Die anderen 5 Crits — später, Slot steht schon

Aus `kfb_roster_players.yaml` — Archetyp + Stimme sind da, die Mode-Stimm-Karte fehlt noch (das ist das „später"):

- **A.I.Liza** — GenZ meme-native, schnell/quippy, switcht oft, powert selten tief, lehnt Comic/Absurd.
- **Stef.A.I.n** — Boomer RPG-Grognard, theatralisch, powert bis zum Anschlag, geht in Forbidden.
- **Doc H.A.I.ner** — pensionierter Akademiker/Referee, nüchtern, als King streng, ruft schnell BLÖDSINN.
- **KA.I.Fabster** — Film-Producer, webt die 3 Scene-Slots zu einem Bogen, spielt die Bühne, transgressive Kante.
- **Nad.A.I.a** — Psychiaterin, warm/ehrlich, greift die unbequeme wahre Zeile, lehnt Mystical/Tragic.

Jeder bekommt später ein eigenes `<pet>.md`-Blatt in `media/prompts/narrator/` (die Registry findet es ohne Code-Änderung). Bis dahin: FB-Blatt als Default, die anderen erben Layer Zero + Tell-Frame und tragen nur ihren Archetyp.

---

## 4 · King's Verdict + Social Calls (Ride-Fassung)

Im Solo-Ride gibt es keinen zweiten Crit als King — aber die **Bewertungslogik** bleibt als Selbst-Check des Beats: bewog dieser Beat die *Story* (nicht die Karte)? Das ist die Messlatte aus §B4. Die **Social Calls** (BINGO/BONGO/BLÖDSINN) sind im Mehr-Pet-Fall später die Reaktions-Beats der anderen Pets auf denselben Gutter — dafür ist die Persona-Tabelle schon der Vorrat.

---

## Messung (damit es kein Referat wird)

Der Port ist erledigt, wenn der Beat prüfbar: (a) trägt eine **but/therefore-Kausalität**, nicht „and then"; (b) referenziert die **echte Karte** (Titel/Power); (c) FBs Stimme **wechselt hörbar mit dem Story-Mode-Würfel**; (d) Layer-Zero-Verstöße = 0 (kein Gedankenstrich, keine Floskel); (e) der Hop **wartet nicht** aufs Modell (Ki/Shō unverändert).
