# KayfabeTips — Korpus v1

*Der Story-Beat-Kern von KayfaBizarro, an einem Ort. Teil 1 = die 5 kanonischen Tips von der Regelseite (wörtlich). Teil 2 = die Improv-Schicht aus den Freestyle-Regeln + GM_PROTOCOL. Teil 3 = Improv-Techniken, jede an eine KFB-Mechanik gebunden. Bestimmt als Beat-Prompt-Blatt für den Narrator (`media/prompts/`) und als Referenz für Design/Sim.*

**Quellen:** `kayfabizarro.pages.dev/#kfb` (KayfabeTips) · `kayfabizarro_freestyle_rules_v_1.md` (Table Principles, Heckles, Finger Rule) · `gameplay_simulation/engine/GM_PROTOCOL.md` (Tell-Frame, Modus-Kollision, Performbarkeit, Social Calls) · `frizzlebob-kayfabizarro`-Skill (Layer Zero).

---

## Teil 1 · Die 5 kanonischen KayfabeTips (wörtlich, live)

**How to Kayfabe Your Bizarro Fluff (with Plausible Deniability)**

1. **Therefore / But, never and-then.** The story is a movie running in everyone's heads at once — and you're driving it. Each beat lands because *you* link it: *therefore* (so this happens) or *but* (except it twists). "And then… and then" lets the movie stall; therefore and but keep it moving — this, therefore that, but this, therefore that. Even your most absurd turn feels caused — because you made the cause.

2. **Yes, and.** Whatever's on the Stage is true now — don't argue it away, grab it and push it somewhere weirder. Blocking kills the bit; building feeds it.

3. **We follow people, not props.** A card isn't a label, it's a soul with an opinion. Give your Actor a want, a wound, a grudge — that's the hook nobody resists.

4. **The weirder the card, the straighter your face.** Anyone can wink. The art is selling a backwards-ticking doomsday clock like it's your tax bill. Doubt is the only thing that kills kayfabe.

5. **One real picture beats ten big ideas.** "The clock ticks backwards" lands. "The nature of time" puts us to sleep. Reach for what you can see, smell, point at.

---

## Teil 2 · Die Improv-Schicht (aus Regeln + Engine)

**Die eiserne Übereinkunft (Kayfabe).** Alles, was auf der Bühne steht, erfunden und improvisiert wurde, gilt als absolute, unerschütterliche Wirklichkeit. Bring eine Karte ins Spiel und du verteidigst ihre Existenz — vehement, ohne ironische Distanz. Nie „das ist nicht passiert." Neue Karten *deuten die Realität um*, sie löschen sie nicht.

**Der Tell-Frame (GM_PROTOCOL §Tell).** Erzähl im Modus, <80 Wörter, im Gerüst: *„I am [actor], and [s1], **but** [s2], **therefore** [s3], so in the end [quest]."* Gerüst, kein Korsett — aber das but/therefore trägt die Kausalität aus Tip 1.

**Modus-Kollision ausspielen (GM_PROTOCOL §Roll).** Der Story-Mode-Würfel (Tragic/Comic/Absurd/Heroic/Mystical/Forbidden) kollidiert mit der Story? *Spiel die Kollision aus* — nicht glätten. Modus == Quest-Wert → +2 Druck.

**Performbarkeit (GM_PROTOCOL §Play).** Eine Karte liefert eine konkrete *spielbare Handlung* (true) oder nur Beschreibung/Hedge (false). Das ist der Unterschied zwischen einem Zug und einem Referat.

**Social Calls sind Improv-Offers.** Jedes Heckle ist ein Angebot — der aktive Spieler nimmt an, ignoriert, oder verdreht es:

- **KayfaBINGO** — Support-Offer mit einem *anderen* Actor.
- **KayfaBOGGLE** — kreative Herausforderung / Rätsel.
- **KayfaBONGO** — wilder Story-Vorschlag; fängt live die *nicht-performbare* Karte („du hast die Power als Mechanik genannt, nicht als Story").
- **BLÖDSINN** — Regelbruch / POV bricht / Bühne ignoriert / Modus nicht gespielt. Bestätigt der King: Verdict zählt nicht, Würfel bewegt sich nicht.

**Finger Rule.** Beim Erzählen auf die Karten zeigen. Konkretes Anfassen schlägt Abstraktion — die Handbewegung erdet die Szene (vgl. Tip 5).

**King's Verdict.** Nicht der Erzähler urteilt — der *nächste* Crit wägt die **Story** (nicht die Karte) und bewegt den Quest-Würfel: +2 (Hard-Push, 1×/Episode) / +1 / 0 / −1. Eine Zeile in seiner Stimme, keine Debatte.

**Layer Zero (Anti-Slop, kanonisch aus dem Skill).** Keine Floskeln, keine LLM-Marketing-Kadenz. Slop ist selbstverstärkend und macht Output für Marketing *und* echtes Spiel unbrauchbar.

---

## Teil 3 · Improv-Techniken, an KFB-Mechaniken gebunden

Damit es keine generische Improv-Klasse ist — jede Technik zeigt auf die Regel, in der sie im Spiel schon lebt:

- **Yes-and (bauen statt blockieren).** → KayfabeTip 2 · Table Principle „Yes And". Das Angebot annehmen und *weiterdrehen*, nicht wegdiskutieren.
- **Yes-but / Yes-therefore (Kausalkette).** → KayfabeTip 1 · Tell-Frame. „But" verdreht, „therefore" folgert; „and then" ist verboten, weil der Film stehenbleibt.
- **Endowment (Wollen, Wunde, Groll).** → KayfabeTip 3. Dem Actor eine Haltung geben, bevor er handelt — der Haken, dem keiner widersteht.
- **Heighten, don't widen (Einsatz erhöhen).** → GM_PROTOCOL Modus-Match +2 · Quest-Druck. Nicht neue Themen aufmachen — denselben Faden heißer ziehen.
- **Make your partner look good (Support).** → KayfaBINGO. Mit einem zweiten Actor die Szene des anderen stärken, statt zu überbieten.
- **Specificity over abstraction (das eine echte Bild).** → KayfabeTip 5 · Finger Rule. Zeig auf etwas Sichtbares; ein konkretes Detail schlägt zehn große Ideen.
- **Play the game of the scene (die Kollision ist das Spiel).** → GM_PROTOCOL Modus-Kollision ausspielen. Was schiefsteht zwischen Modus und Story, *ist* der Beat — nicht der Fehler.
- **Straight face / commitment.** → KayfabeTip 4 · Kayfabe-Übereinkunft. Je absurder die Karte, desto trockener die Ausführung. Zweifel tötet die Kayfabe.
- **Callback (der Faden kehrt wieder).** → Quest → Trophy/Memory · `crit_memory.py`. Frühere Karten/Quests zurückholen; die Sim zeigt, dass genau diese Rückgriffe die stärksten Momente erzeugen.

---

## Für den Narrator-Port (der offene B4-Fix)

Der Ride-Narrator (`narrator-llm.js` → `payload()` / `CODE.narrator`) kennt heute *keinen* dieser Punkte — deshalb kommt generisches „Therefore…" raus. Zum Schließen: Tip 1 (Tell-Frame) + Performbarkeit + Layer Zero in den `narrator`-Prompt, und `payload()` muss die Frame-Variablen mitgeben (actor · s1 · but-s2 · therefore-s3 · quest · mode). Dann spricht das hüpfende Pet dieselben Beats, die die Sim schon misst.
