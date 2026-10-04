# WS1 → ChatGPT · Antwort auf das Handoff-Paket vom 10. August 2026

**Von:** WS1 (Lead, Masterplan-SSOT)
**Betrifft:** `KFB_WS1_Handoff_All_Current_Slices` · `KFB_Overworld_Living_Concept_v22` ·
`KFB_ChatterBox_v12` · `KFB_SessionCut_Internal_Riffing_Anchors_Blindspots`
**Status:** Intake-Bescheid. Kein neuer Masterplan. Was hier steht, geht als §Intake in
`docs/MASTERPLAN_overworld.md`.

---

## 0 · Kurzfassung

Vier Dokumente, drei Qualitäten. Das Handoff ist das beste, weil es das einzige mit Statusspalte
ist — `BUILT · PARTIAL · OPEN · HOOK · DEFERRED · REJECTED` plus §23 »do not rebuild validated
work« wird ab heute Hausregel. ChatterBox §12–14 ist der unmittelbar baubare Teil, weil er Zahlen
hat. Der Session Cut ist der klügste und der gefährlichste, weil er einen Spielerstamm voraussetzt,
den es noch nicht gibt.

Angenommen: 6. Geparkt: 4. Zurückgewiesen: 1 (Doppelspezifikation von Gebautem).

---

## 1 · Korrektur an uns selbst: K1 war zu grob formuliert

Wir haben das Golden Sample zunächst als K1-Verstoß gelesen. Falsch gelesen. **`+12% DESTROY
EVERYTHING` ist Kayfabe-Power** — die Zahl ist der Witz über Power-Player, nicht eine Zahl, mit
der das Spiel rechnet. Das ist genau derselbe Mechanismus wie Card Power im physischen Spiel.

K1 wird deshalb geschärft, damit die Regel nicht weiter falsch zitiert wird:

> **K1 (neu):** Das Spiel zeigt keine Zahl, mit der es wirklich rechnet. Eine Zahl darf im UI
> stehen, wenn die Zahl selbst die Behauptung ist — Kayfabe-Power, Werbeversprechen, Angeberei,
> Statistiker-Rache. Verboten sind Trefferpunkte, Schadenszahlen und Punktestände als Wahrheit.
> Erlaubt ist jede Zahl als **Beweisstück einer Behauptung**.
>
> Prüffrage: *Rechnet das Spiel damit, oder prahlt jemand damit?*

Das Golden Sample bleibt als Referenzmuster gültig. Bitte weiter in dieser Familie liefern —
Zahl + Meta-Zeile, wobei die Meta-Zeile den Witz nicht erklärt, sondern verschiebt
(»Apparently morality has a damage stat.«).

Konsequenz, die uns gefällt: **Effective Power (v22 §55) ist damit sauber**, weil es die
*unsichtbare* Rechengröße ist, während die sechs Werte die *sichtbare* Prahlerei bleiben. Genau
diese Trennung wollen wir. Bitte in v23 so festhalten.

---

## 2 · Angenommen

**2.1 ChatterBox §12–14 — Timing, Bubble-Grammatik, Thought Bubbles.**
Der wertvollste Block im Paket. Gründe: er hat Zahlen (15 CPS, 1,0 s Sockel, 1,5–3,0 s
Normalzeile), er trennt Streaming-Tempo von Lesetempo, und §18.1 (Geometrie aus dem vollständigen
Text messen, dann streamen) beschreibt korrekt, was bei uns läuft. Wir bauen als nächstes das
**Timing Lab** aus §12.1 als eigenes Prüfbrett und melden gemessene Werte zurück, statt deine
Defaults zu übernehmen.

**2.2 Wiseguy §11 inkl. §11.8 MVP-Grenze und §11.9 Joke Craft.**
Damit ist unser offener Slice A entschieden statt offen. Besonders §11.9 ist der Punkt: nicht
bessere Witze, besserer Kontext. »Do not make the joke bigger. Make the context better.« Die Regel
wandert als Hausregel in den Masterplan.

**2.3 §23 Existing UI Boundary.**
`EXISTS → QA → EXTEND → NEW` gilt ab jetzt für jede Zuarbeit in beide Richtungen.

**2.4 Session Cut POC 2 — Closure als erstklassiges Journey-Ereignis.**
Angenommen, weil Closure bei uns schon einen Ort hat: die Kayfabulation beim König (v22 §40).
Die sechs Relationsoperatoren (`CAUSE · CONTRAST · ECHO · TRANSFORM · REVEAL · CONSEQUENCE`)
werden dort die THEREFORE/BUT-Bausteine ersetzen bzw. erweitern. Das ist der einzige Teil der
Journey-Brain-Familie, den wir jetzt bauen.

**2.5 v22 §61/62 Combat Flow.**
Kein separater Kampfmodus, Space als aktiver Schlag mit Blickrichtung, Auto-Attack als Chill-Linie.
Passt zu unserer gebauten Bewegung und zu `game-feel.js`. Übernommen.

**2.6 v22 §55/§57 Trennung Effective Power ↔ Fame.**
Siehe §1. Übernommen als Entwurf, Formel bleibt offen (§58 zu Recht).

---

## 3 · Zurückgewiesen: v22 §2 beschreibt Gebautes als Auftrag

Das Terrain steht seit v10-S1/S2. Nicht als Idee, mit Zahlen:

- Textur-Basis + `seamless()` mit Halbversatz und Kreuzblende (die Spiegelkachel davor war eine
  Rorschach-Figur und ist raus)
- Zeichenzeit mit Spülung: Turm 18 · Blatt 19 · Spawn 22 · Küste 29 · freies Feld 30 ms
- Boden 12 ms, Deko 5, Kontaktschatten 4 — der Boden kostet durch **Fläche**, nicht durch Pfade
- Zonengraben als eigener Baustein, als Strich gezeichnet: **0,09 ms je Bild**
- Zonen 18×10, Tusche trägt Kartenformat 1,74 über Feldbruchteile
- Paletten in `OW_SHADE.PALETTES`

Bitte §2 in v23 auf `BUILT` setzen und nicht neu spezifizieren. Was dort noch offen ist, ist genau
eine Sache: der **Signatur-Shader je Terrain-Typ** (`docs/SSOT_Waber_Shader.md`) — sponge-artiges
Muster, langsames organisches Wabern, billig. Dafür nehmen wir Zuarbeit.

Dasselbe gilt für die Sprechblasen-Geometrie, die Denk-/Ruf-Grammatik und Titel/Name im HUD: gebaut,
nicht neu beauftragen.

---

## 4 · Der teuerste Punkt im Paket: die Begriffe driften

Das ist wichtiger als jeder neue Slice, weil es sich still fortpflanzt.

Widersprüche zwischen den Dokumenten:

| Sache | Living Concept §16 | Living Concept §38 | unser Code |
|---|---|---|---|
| HP | Fluff | Fluff, abgeleitet aus sechs Werten | Fluff, abgeleitet |
| XP | POP | POP | POP |
| Fernkampf | K-Fabe = magic | Kayfabe als **Wert** | Kayfabe ist das **Betriebsprinzip der Welt** |
| Nahkampf | Bizarro = tank | Bizarro als Wert | Bizarro |
| Wert 3–5 | — | KayfaBingo · KayfaBongo · KayfaBoggle | Käfer Bingo · Käfer Boggle |

Zwei Fragen, die nur du beantworten kannst, weil sie aus dem Kartenspiel kommen:

1. **Heißt der Wert »Kayfabe«?** Wenn Kayfabe gleichzeitig das Prinzip der ganzen Welt und ein
   Angriffswert ist, verliert das Wort seine Schärfe. Vorschlag: der Wert heißt anders, das Prinzip
   behält den Namen.
2. **Bingo/Bongo/Boggle:** existiert »KayfaBongo« im physischen Spiel, oder ist das aus
   »Käfer Bingo / Käfer Boggle« entstanden? Wir brauchen die Schreibweise aus dem Deck, nicht eine
   plausible.

**Bitte liefere als eigenes kleines Dokument: eine Begriffstabelle, ein Name je Sache**, Spalten
`Name · gilt für · Quelle (Deck/Regel/Code) · verbotene Synonyme`. Das ist der Auftrag mit dem
höchsten Hebel im ganzen Paket. Alles andere kann warten, das nicht.

Fest bleiben: **BLÖDSINN!** (immer so), Uncle FrizzleBob, King Kayfabian, Kayfabulation,
Stay fluffy. Sprache EN, Eigennamen deutsch.

---

## 5 · Geparkt (nicht abgelehnt)

**5.1 Journey Brain / Hypothesen / Personalization Bait (Session Cut §3–13, §22 POC 1/3/4/5).**
Deine Blindspots sind alle richtig erkannt — Test-Sättigung, Reward-Validität, falsche
Korrelationen, »closure ≠ selection«. Genau darum: die Familie setzt einen Spielerstamm und viele
Sitzungen voraus. Wir haben einen Spieler. Bis dahin sammelt die Journey ohnehin schon Fakten
(`journey.js`, Save aus Seeds + Fakten, Ruf als zweite Währung); die Hypothesen-Schicht kann später
darauf aufsetzen, ohne dass wir jetzt eine Maschine bauen, die niemandem antwortet.
**Ausnahme siehe 2.4.**

**5.2 Historian / FAQ / Cross-System-Bridge (§9, §10, Session-Cut-Extension).**
Stark, aber es ist ein Produkt, kein Slice. Unser Erzähler ist gerade als **Datumscomputer** offen
(Slice F) — Deadpan, Loriot-Logik, keine Betonung im Text. Der Historian ist die Ausbaustufe
davon, nicht sein Ersatz. Reihenfolge: erst der Datumscomputer sprechen, dann Wissen dazu.
Deine Warnung teilen wir: er darf nicht die Navigationsebene des Ökosystems werden.

**5.3 Karaoke · Mob Disco · Speaker's Corner · Abyss (§19, ChatterBox §8).**
Bleiben Hooks. Der Abyss ist der stärkste davon und der beste Langzeitgedächtnis-POC — aber erst,
wenn Chatter-Timing gemessen ist.

**5.4 Semantic Slot Machine / Rolodeck (§15) · Arena/Theatre (§16) · 3D Ball (§21).**
Geparkt, unverändert.

---

## 6 · Asset Compiler §20: fange nicht bei null an

Angenommen als POC — mit einer Korrektur, die viel Arbeit spart.

**Das Vorderteil deiner Kette existiert.** `export/assetlab-v4_S23b_2026-08-05/` ist ein
lauffähiges Asset Lab v4: GLB laden, Kamera, Studio-Licht, Snapshot. Dazu
`docs/HANDOVER_assetlab_v4_WS0.md` mit Hausregeln und den Fünf Fallen.

Damit reduziert sich der POC auf drei neue Schritte:

```text
[vorhanden: Asset Lab v4]  GLB → Pose/Frame → Kamera → Licht/Material → High-Res-Master
[neu 1] Kanon-Kamera festschreiben (eine Zahl, ein Ort — kein Regler)
[neu 2] Stil-Durchgang KFB_INK_2D  (Render → KFB-Outline → Pixel)
[neu 3] Rezept-JSON + Pixel-Reduktion auf die Kanon-Zelle
```

Zustimmung zu deinen vier Entscheidungen: `KFB_INK_2D` ist der erste Test · 64×64 ist eine **Zelle,
keine Objektgrenze** · Mehrzell-Kreaturen sind Architektur-Hook · Landmarks dürfen später
Waypoints werden. Der Schattenstapel `base → light → mid → shadow → ink` gehört ohnehin in unsere
Feder-Familie (`cardbuilder/kfb-ink-canon.js`, `skills/SSOT_Card_Ink_Outline_v2.md`) — bitte keine
zweite Tuschefamilie erfinden.

POC-Folge angenommen: Cube-Pal → Schlüssel/Truhe → Landmark → optional UFO.

---

## 7 · Was in allen vier Dokumenten fehlt: das Bildbudget

Jedes Papier rechnet für sich, keins rechnet mit den anderen. RSS + LLM + TTS + Cross-Talk +
Hypothesen + Snapshotter wollen alle gleichzeitig laufen.

Unsere gemessene Wirklichkeit: ein Bild kostet 18–30 ms je nach Standpunkt, darunter liegt ein
ortsunabhängiger Sockel von ~12 ms. Ein Viertel der Pixel spart nur ein Fünftel der Zeit — die
Notbremse ist keine Lösung.

**Deshalb ab jetzt bei jedem Vorschlag eine Zeile: was kostet das je Bild, oder was kostet es
einmalig?** Nicht gemessen ist in Ordnung — dann steht »ungemessen« da. Behauptet ist nicht in
Ordnung. Bei uns gilt: eine Zahl oder es gilt nicht. Und: Zeichenzeit ohne Spülung ist keine
Zeichenzeit, Rauschen ±6 ms, Varianten also im Wechsel messen.

---

## 8 · Aufträge zurück an dich, in dieser Reihenfolge

**A1 · Begriffstabelle** (siehe §4). Höchster Hebel. Ein Name je Sache, Quelle je Zeile.

**A2 · Wiseguy-Vorrat nach §11.9.** Nicht brillante Witze — flaches Material für gute Regie.
Format: je Fraktion sechs Einträge, jeder Eintrag als **Beat-Kette**, nicht als Satz:
`setup · pause · punch · reaction · callback` (Felder dürfen leer bleiben). Dazu sechs
Ausweich-Zeilen für den unmöglichen Nahkampf und eine Puff-Abschiedszeile je Fraktion.
Grenze: 40 Zeichen bequem, 60 Schmerzgrenze, eine Karte pro Blase.

**A3 · Titel-Katalog K1** wie vereinbart: 24–36 Titel, sechs Angles, Achievement/Loot/Pool
getrennt ausgewiesen. Offene Entscheidung, die wir dir zurückgeben: der erste Tutorial-Titel.
`Leichenfledderer` als deutscher Eigenname schlägt `Grave Robber` unseres Erachtens — die
Eigennamen sind bei KFB ohnehin deutsch, und das Wort ist selbst schon der Witz. Bitte bestätige
oder widerlege mit einem besseren.

**A4 · Timing-Lab-Prüfzeilen** aus ChatterBox §12.1: die zehn Fälle als fertige Zeilen im
KFB-Ton, damit unser Prüfbrett echten Stoff misst und nicht Lorem Ipsum.

**A5 · Fraktions-Schmährufe K2** wie im Briefing: `{who}` mit und ohne Titel, zwei
Eskalationsstufen. Plus die Antwort auf die alte Frage: **welche 2–4 Fraktionen fehlen**, mit
Begründung, warum eigene Stimme statt Spielart.

**A6 · Closure-Operatoren** (2.4): die sechs Relationen als Bedienelemente formuliert — was steht
auf dem Klebeband, das der Spieler zwischen zwei Karten legt? Sechs Wörter, KFB-Ton, plus je eine
FrizzleBob-Hilfszeile.

Nicht gebraucht: neue Laufzeit, Dialogbäume, zweiter Ton für Emotes, Zahlen, mit denen das Spiel
rechnet.

---

## 9 · Was wir als nächstes bauen

1. §Intake + Begriffstabelle in den Masterplan (sobald A1 da ist)
2. Timing Lab (§12.1) — Prüfbrett, liefert gemessene Defaults zurück
3. Wiseguy nach §11.8 (elf Punkte, statischer Vorrat, kein LLM)
4. Hofnarr auf dem Marktplatz
5. Signatur-Shader je Terrain-Typ
6. Asset Compiler als WS0-Auftrag mit Asset Lab v4 als Fork-Basis

**Stay fluffy.**
