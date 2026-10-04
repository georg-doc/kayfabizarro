# Living Document · KFB Travel Globe

> Nach `skills/living-document_v1.md` (gelesen 29.8.). **Additiv:** nichts wird überschrieben,
> überholte Einträge werden `NACHTRAG` und bleiben stehen. Wer nur den aktuellen Stand sieht, kann
> nicht erkennen, welche Wege verworfen wurden — und geht sie wieder.

---

## 00 · Übergabe

```
Zuletzt passiert   30.8., Nachmittag · **Der Boden gehört jetzt der Quelle. Sieben Zutaten von uns
                   sind dafür gestorben, zwei sind mit Begründung geblieben.**
                   Ausgelöst von Georgs Befunden am fertigen Bild, in dieser Reihenfolge:
                   „metall rost BGs für den HUD — das war nie die Idee" · „die ganzen BG boxen
                   müssen weg" · „terrains und farben grau-bläulich verwaschen" · „bäume zu hell" ·
                   „würfel falsch beleuchtet" · „die dunkelblauen Wellen … sieht in tinyskies
                   deutlich besser aus" · „kein guesswork mehr! kein mess&guess!" · „ich will den
                   tinyskies look zurück, 1:1! warum geht das nicht?!" · „mach den dritten Weg".

                   **Was es wirklich war — vier Ursachen, keine vierzehn Symptome:**
                   1. `rimPower` stand auf **2,5** statt **8,5** (Quelle). `pow(0.5,2.5)` gegen
                      `pow(0.5,8.5)` ist Faktor 63, additiv auf jedes Pixel, warmweiß. **Das
                      Verwaschene war ein Exponent, keine Farbe** — deshalb hat keine der beiden
                      Farbrunden geholfen.
                   2. Die Landpalette war gegen ein Luminanzband kalibriert, das am 29.8. widerlegt
                      und ersetzt wurde — **das Instrument wurde ersetzt, die Werte nicht** (§05o).
                   3. Die Ozeanfarben standen in allen drei Presets und wurden von keinem Leser
                      gelesen; gefärbt wurde einmal, aus dem Preset der Startzeit (§05o).
                   4. Der Fragment-Patch des Oberflächenmaterials war **nachgerechnet, nicht
                      kopiert** — Glitzern mit eigener Formel, fehlende Grundaufhellung,
                      verschmolzenes Wasser-Tor. Darüber stand der Kommentar „jede Formelzeile steht
                      wörtlich so in der Quelle" (§05p).

                   **Gemessen, nachher gegen vorher:** Land-Albedo 0,085 → **0,229** · Sättigung
                   0,21 → **0,628** · Wasser 0,005 → **0,145** (Quelle 0,144) · Props-zu-Land 2,6×
                   → 0,99× · `sat-keep 0 ⚠` → **0,747 ok** · Wasser-Max 0,584 → 0,218 (= Quelle).
                   Drei neue Wächter im Panel, die durchfallen können: `Source constants` (8/8) ·
                   `Land palette vs source` (21 Werte, Farbton frei, S und L Δ 0,000) ·
                   `Ocean follows preset` (beide Verbraucher). Konsole leer.

                   **Und die Vorgabe, die ab jetzt über allem steht** (§05q): *„TS ist führend für
                   uns, weil es gut ist und funktioniert. Im Zweifel stirbt ein Feature und wir
                   denken uns etwas passendes aus."* Plus: Kollisionen werden **gemeldet**, nicht
                   in der Mitte geschlichtet.

Zuletzt davor      30.8., früh · **Slices C · D · F · G sind durch. v5 ist der aktive Zweig.**
                   ⚠ NACHTRAG: von G gilt nur, was nicht Oberfläche war — die vier HUD-Platten sind
                   ersatzlos gestrichen (§05o), die Maßfamilie und die Flug-Reaktion bleiben.

Als Nächstes       0. ~~**Fake-AO + Objekt-Rim**~~ **DURCH, 30.8.** · 32/32 Materialien, AO-Spanne
                      0,10–1,00 (§05w). Nächster großer Zug: **Skydome aus v23a, frischer Chat.**
                   1. ~~**„Weltstimmungen" (Slice H)**~~ **DURCH, 30.8.** · `Mood gate ✓ 4/4`,
                      vier Stimmungen, Sättigung 0,387…0,417 (keine verliert). Siehe §05u.
                      **Fahrzeuge entschieden** (Georg 30.8.): nur Skins, später ggf. Ausbau nach
                      tinyskies fürs Boot — Vertrag mit fünf Feldern steht in `BACKLOG_globe.md`.
                   1b. ~~Alte Fassung dieser Zeile:~~ **„Weltstimmungen" (Slice H)** · verdant · molten · frost · bone,
                      `molten` zuerst (E-36). ⚠ **Die Grundlage hat sich am 30.8. geändert, zum
                      Guten:** vier Farbeingänge stehen jetzt statt zwei — `trail.setTint()` (D) ·
                      `rauch.setTint()` (F) · `globe.setOceanColors()` (neu, §05o) · die zwölf
                      Zonen-Fleckenfarben (neu, §05r). Und der Nullpunkt ist nicht mehr zu dunkel:
                      eine Stimmung kann von hier aus in BEIDE Richtungen, hell und dunkel.
                      **Bedingung aus §05q:** die Sättigung ist die Größe, die nicht verhandelbar
                      ist — `frost` und `bone` sind genau die zwei Stimmungen, die dazu verführen,
                      sie wegzunehmen. Der Wächter `Land palette vs source` muss dabei grün
                      bleiben, sonst ist die Stimmung ein Rückfall.
                   2. **„Portal" (Slice E)** · entsperrt, fünf Entscheidungen liegen vor. Größter
                      Brocken, EINZIGER mit Zwischenabnahme durch Georg.
                   3. **„G2 · HUD-Würfel + Belohnungsflug"** · Zielbild §S14 Punkte 4–6. Platte und
                      Reaktion stehen; der Würfel ist ein kleiner Renderer wie das Zahnrad.
                      ⏳ Augen-Logik liegt bei Georg.
                   4. **„tinyskies-Inventar"** · Georgs Frage vom 30.8.: welche Fahrzeuge, Travel
                      Modes und FX gibt es dort noch, und was ist mit Mond/Weltraum?
                      → eigenes Dokument, siehe Register. Analyse, kein Slice.
                   5. **„Post Mortems → SOPs"** · E-42, eigener frischer Chat, Startraster §05h.
                   6. **„Alternative Fahrzeuge"** (Badewanne) · Befund und Preis in
                      `docs/BACKLOG_globe.md`. Niedrige Prio, aber der Fahrzeug-Vertrag ist die
                      billige Vorarbeit, die teuer wird, wenn man sie auslässt.
                   7. **„Schatten-Architektur"** · R1 ist keine Deckkraft (§06b).

Offen bei Georg    · **Ankunftston (R2)** — kein Audio-Gerät am Rechner (30.8.).
                   · **Kielwasser bei Reisetempo:** quellentreu erst ab Tempo 0,5, unser Maximum
                     ist 0,78 → rechnerisch 70 % Deckkraft, nie 100 %. Regler „Spray: speed gate".
                     **Ansehen, dann entscheiden** (PM-68).
                   · **HUD-Reaktion:** Beträge sind bewusst klein (±1,5° / ±4 px). Wenn es zu
                     dezent ist, sind die zwei Regler in „HUD frame" der Ort — sie warnen ab 3°/6 px.
                   · **Loop D, drei Kaskaden ⚠ auf Draw-Calls** — kein Leck (PM-69), zu schmales
                     Kontrollfenster. Benannt statt weggeklickt.

So wird gearbeitet · unverändert §00b und §05b. Dazu die Regeln, die diese Sitzung erzeugt hat:
                   · Jedes Prüfwerkzeug braucht eine Kontrollprobe, die durchfallen KANN.
                   · Eine Referenz ist ein Zeitpunkt, kein Wert (PM-64).
                   · Bevor man einen Regler an etwas baut, prüft man, wer es schreibt (PM-65).
                   · Nach Bedeutung schneiden, nicht nach Zeilenposition (PM-66).
                   · Streiten zwei Schreiber um eine Eigenschaft, ist ein zweites ELEMENT billiger
                     als ein Kompromiss (§05n).
                   · Ein Element wegschieben ist keine Gestaltung, solange man nicht sagt, wohin
                     und warum (PM-72).
                   · Die Quelle ist erreichbar (`github.md`) — Raten lesen schlägt Raten schätzen.
```

---

## 00g · NACHTRAG · Übergabe-Stand nach Slice F (30.8.)

**Bleibt stehen (additiv).**

```
Zuletzt passiert   30.8. · **Slice C, D und F sind durch, v5 ist der aktive Zweig.**
                   C („Alle Kaskaden"): `intro.handover` · `world.respawn`, Respawn an EINER
                   Stelle, Prüfstand angeschlossen, Nahkamera Standard, Kontrollprobe-Kachel.
                   D („Parameter freilegen"): 123 Parameter in acht Modulen, Abnahme
                   **0 off source**.
                   F („Wake & Drift-Rauch"): `carpet-wake.js` und `drift-smoke.js` aus der
                   Quelle portiert (Branch war erreichbar, echte Raten statt geschätzter).
                   **`water.enter` steht auf 3/3 — die Abnahme, die in Slices Ds Übergabe
                   vorausgeschrieben war, ist eingetreten, und die Konsole ist zum ersten Mal
                   seit Slice B komplett leer.**
                   **13 Befunde in drei Slices (PM-57…PM-69).**

Als Nächstes       1. **„HUD-Einfassung" (Slice G)** · gestanzte battered Metal-Platte, Rost aus
                      `Metal022_1K-JPG`, Zahnrad und Pop-Würfel in derselben Metall-Logik.
                      ⚠ **NACHTRAG 30.8.: zurückgenommen.** Georg: „Metall-Rost war NIE die Idee",
                      dann „die ganzen BG-Boxen müssen weg". Diese Zeile hat Slice G in die
                      falsche Richtung geschickt — sie stand als Vorgabe da, war aber nie eine.
                   2. **„Weltstimmungen" (Slice H)** · verdant · molten · frost · bone,
                      `molten` zuerst (E-36). **Zwei Farbeingänge stehen dafür schon:**
                      `trail.setTint()` und `rauch.setTint()` — beide aus Slice D/F.
                   3. **„Portal" (Slice E)** · entsperrt, fünf Entscheidungen liegen vor. Größter
                      Brocken, EINZIGER mit Zwischenabnahme durch Georg.
                   4. **„Post Mortems → SOPs"** · E-42, eigener frischer Chat, Startraster §05h.
                   5. **„Alternative Fahrzeuge"** · Georgs Badewanne (30.8.) — Befund und Preis
                      stehen in `docs/BACKLOG_globe.md`. **Niedrige Prio, aber EINE Vorarbeit ist
                      billig und wird teuer, wenn man sie auslässt** (Fahrzeug-Vertrag, siehe dort).
                   6. **„Schatten-Architektur"** · R1 ist keine Deckkraft (§06b).

Offen bei Georg    · **Ankunftston (R2)** — Georg hat kein Audio-Gerät am Rechner (30.8.).
                     Panelzeile „Sound variance" beantwortet es, sobald eins da ist.
                   · **Kielwasser bei Reisetempo:** die Quelle schaltet es erst ab Tempo 0,5 ein,
                     unser Maximum ist 0,78 — also erreicht es rechnerisch 70 % Deckkraft und nie
                     100 %. Quellentreu, aber eine Gestaltungsfrage: Regler „Spray: speed gate"
                     im Panel. **Ansehen, dann entscheiden.**
                   · **Loop D, drei Kaskaden mit ⚠ auf Draw-Calls** — kein Leck (Geometrien,
                     Texturen, Frame-Fehler alle 0), sondern ein zu schmales Kontrollfenster.
                     Siehe PM-69, offen und benannt statt weggeklickt.

So wird gearbeitet · unverändert, siehe §00b (Onboarding) und §05b (der Vertrag).
                   · **Jedes Prüfwerkzeug braucht eine Kontrollprobe, die durchfallen KANN.**
                   · **Eine Referenz ist ein Zeitpunkt, kein Wert** (PM-64).
                   · **Bevor man einen Regler an etwas baut, prüft man, wer es schreibt** (PM-65).
                   · **Nach Bedeutung schneiden, nicht nach Zeilenposition** (PM-66).
                   · NEU: **die Quelle ist erreichbar** (Branch `cursor/globefly-…`, `github.md`).
                     Raten aus der Quelle lesen kostet zwei Aufrufe und schlägt jede Schätzung.
```

---

## 00f · NACHTRAG · Übergabe-Stand nach Slice D (30.8.)

**Bleibt stehen (additiv).**

```
Zuletzt passiert   30.8. · **Slice C UND Slice D sind durch, v5 ist der aktive Zweig.**
                   Slice C („Alle Kaskaden"): `intro.handover` und `world.respawn` als Kaskaden,
                   Respawn nur noch an EINER Stelle, der Prüfstand ist angeschlossen (er lag in v4
                   als Modul da, von nirgends importiert), Nahkamera als Standard, Kachel 0 jedes
                   Bildstreifens ist die Kontrollprobe, Post-Shader wird vorgewärmt.
                   Slice D („Parameter freilegen"): **123 Parameter in acht Modulen**, jedes mit
                   `params` · `quelle` · `abweichungen()` · `zeile()`, und die Abnahme ist EINE
                   Zahl: **0 off source — Slice D hat nichts verändert.**
                   **Zehn Befunde in zwei Slices (PM-57…PM-66), und neun stecken im Prüfwerkzeug
                   oder in meinem eigenen Vorgehen, nicht im Spiel.**

Als Nächstes       1. **„Wake & Drift-Rauch" (Slice F)** · `carpet-wake.js` · `drift-smoke.js`.
                      `water.enter` trägt einen VORGEMERKTEN Beat; Loop B weist ihn als
                      „1 vorgemerkt (Wirker fehlt: wake)" aus. Der Platz ist beschriftet.
                   2. **„HUD-Einfassung" (Slice G)** · ⚠ **NACHTRAG 30.8.: die Metall-Vorgabe in
                      dieser Zeile ist zurückgenommen, siehe §05o.** Der HUD trägt keine Platten.
                   3. **„Weltstimmungen" (Slice H)** · verdant · molten · frost · bone. Das
                      Sättigungstor steht, `molten` zuerst (E-36). **Slice D hat dafür
                      vorgearbeitet:** `trail.setTint(r,g,b)` ist der erste Farbeingang, der
                      nicht im Shader festgenagelt ist.
                   4. **„Portal" (Slice E)** · entsperrt, alle fünf Entscheidungen liegen vor.
                      Der größte Brocken und der EINZIGE mit Zwischenabnahme durch Georg.
                   5. **„Post Mortems → SOPs"** · E-42, eigener frischer Chat, Startraster §05h.
                   6. **„Schatten-Architektur"** · R1 ist keine Deckkraft (§06b).

Offen bei Georg    · **Ankunftston (R2) bleibt ungeprüft** — Klang braucht eine Nutzergeste, und
                     der Prüfstand hat keine Hände. Georg hat am 30.8. kein Audio-Gerät am
                     Rechner; die Panelzeile „Sound variance" beantwortet es, sobald er eins hat.
                   · Der ERSTE Kartendurchflug legt eine Geometrie an (Erstbenutzung des Blatts,
                     nachgewiesen kein Leck). Wenn er ruckelt, ist das der nächste Vorwärm-Kandidat.

So wird gearbeitet · unverändert, siehe §00b (Onboarding, drei Dateien) und §05b (der Vertrag).
                   · NEU und teuer bezahlt: **jedes Prüfwerkzeug braucht eine Kontrollprobe, die
                     durchfallen KANN.** Vier Befunde dieser Runde waren Prüfwerkzeuge, die nach
                     OBEN gelogen haben — also so, dass es wie Erfolg aussah.
                   · NEU: **eine Referenz ist ein Zeitpunkt, kein Wert** (PM-64), und **bevor man
                     einen Regler an etwas baut, prüft man, wer es schreibt** (PM-65).
                   · NEU: **Code nach Zeilenbereich ausschneiden nimmt mit, was zufällig
                     dazwischen liegt** (PM-66) — nach Bedeutung schneiden, nicht nach Position.
```

---

## 00e · NACHTRAG · Übergabe-Stand nach Slice C (30.8.)

**Bleibt stehen (additiv).** Der Stand vor Slice D.

```
Zuletzt passiert   30.8. · **Schnitt auf v5, Slice C „Alle Kaskaden" abgeschlossen.**
                   `globe-v4/` → `globe-v5/`, `KFB Travel Globe v5.dc.html` ist der Einstieg,
                   v4 bleibt lauffähig und ist EINGEFROREN.
                   Inhaltlich: die zwei letzten stummen Ereignisse sind Kaskaden geworden
                   (`intro.handover`, `world.respawn`), der Respawn steht nur noch an EINER
                   Stelle (`neustart()` statt zwei gleicher Kopien in Taste und Panel-Knopf),
                   der **Prüfstand ist angeschlossen** — er lag in v4 als Modul da und war von
                   nirgends importiert —, die Nahkamera ist Standard, Kachel 0 jedes
                   Bildstreifens ist die Kontrollprobe, `frameFehler` hat einen Zahlenkanal,
                   und der Post-Shader wird beim Laden vorgewärmt (2,4 ms).
                   **Sechs Befunde, alle am eigenen Prüfwerkzeug** (PM-57…PM-62): ein Beat-Audit,
                   das die Welt statt die Partitur zählte · eine Invariante, die nicht
                   durchfallen konnte · ein Messgerät, das von der geprüften Kaskade abgeschaltet
                   wurde · eine Toleranz, die neun von zehn Kaskaden falsch anschwärzte.

Als Nächstes       1. **„Parameter freilegen" (Slice D)** · acht Module ohne `params`.
                   2. **„Portal" (Slice E)** · entsperrt, alle fünf Entscheidungen liegen vor.
                   3. **„Wake & Drift-Rauch" (Slice F)** · `water.enter` trägt einen VORGEMERKTEN
                      Beat; Loop B weist ihn als „1 vorgemerkt (Wirker fehlt: wake)" aus, statt
                      ihn als Ausfall zu melden. Der Platz ist beschriftet.
                   4. **„Post Mortems → SOPs"** · E-42, eigener frischer Chat, Startraster §05h.
                   5. **„HUD-Einfassung" (Slice G)** · ⚠ **NACHTRAG 30.8.: zurückgenommen** (§05o).
                   6. **„Schatten-Architektur"** · R1 ist keine Deckkraft (§06b).

Offen bei Georg    · **Ankunftston (R2) bleibt ungeprüft.** Klang braucht eine Nutzergeste, und
                     der Prüfstand hat keine Hände. Eine Taste drücken, eine Karte sammeln —
                     danach sagt die Panelzeile „Sound variance", ob die Tonhöhe wirkt.
                   · Der ERSTE Kartendurchflug legt eine Geometrie an (Erstbenutzung des
                     Blatts, nachgewiesen kein Leck). Wenn er ruckelt, ist das der Kandidat für
                     die nächste Vorwärmung.

So wird gearbeitet · unverändert, siehe §00b (Onboarding, drei Dateien) und §05b (der Vertrag).
                   · NEU aus dieser Runde: **jedes Prüfwerkzeug braucht eine Kontrollprobe, und
                     zwar eine, die durchfallen KANN.** Fünf der sechs Befunde dieses Slice sind
                     Prüfwerkzeuge, die nach oben gelogen haben — also so, dass es wie Erfolg aussah.
```

---

## 00d · NACHTRAG · Übergabe-Stand nach dem Schnitt auf v4 (30.8.)

**Bleibt stehen (additiv).** Der Stand VOR Slice C. Wer wissen will, welche Lücken der
Prüfstand hatte, bevor er angeschlossen war, liest diesen Block.

```
Zuletzt passiert   30.8. · **Schnitt auf v4.** `globe-v3/` → `globe-v4/`, `KFB Travel Globe
                   v4.dc.html` ist der Einstieg, v3 bleibt lauffähig und ist EINGEFROREN.
                   Davor in derselben Runde: Slice A (Tag/Nacht läuft, Dämmerung von 15 % auf
                   30 % nach Georgs Entscheidung, Bodenschatten an) und Slice B (die
                   Verdrahtungsebene: `fx-bus` · `fx-script` · `trauma` · `step(dt)`).
                   Dazu: Design Critique in zwei Teilen (D-08), 13 Entscheidungen von Georg
                   eingearbeitet (E-31…E-42), SOP-01 „Was ein Beweis ist",
                   `session-design-briefing` als Fassung 1.2, Standalone-Export mit eigenem
                   Bauverfahren — der Bundler des Werkzeugs ist nachweislich untauglich.

Als Nächstes       1. **„Prüfstand-Lücken"** · Nahkamera als Standard + Kontrollprobe-Kachel in
                      `loopA`. Damit ist ein Beweisbild ein Aufruf statt Handwerk (SOP-01, 4+5) —
                      und Slice A bekommt endlich sein Schattenbild.
                   2. **„Alle Kaskaden" (Slice C)** · `boost.start` · `water.enter` ·
                      `ground.touch` feuern schon; offen sind Respawn, Intro-Übergabe, der
                      vorkompilierte Burst-Pool (tinyskies `Game.ts:1527`) und Loop D.
                   3. **„Parameter freilegen" (Slice D)** · acht Module ohne `params`.
                   4. **„Portal" (Slice E)** · entsperrt, alle fünf Entscheidungen liegen vor.
                   5. **„Post Mortems → SOPs"** · E-42, eigener frischer Chat, Startraster in §05h.
                   6. **„Schatten-Architektur"** · R1 ist keine Deckkraft, sondern die Frage
                      echter Shadow Map gegen Fleck (§06b).

So wird gearbeitet · Onboarding für einen frischen Chat steht in §00b — DREI Dateien, nicht sieben.
                   · Gemessen wird VOR der Diagnose, ANGESEHEN wird vor dem Messen bei Formfragen.
                   · Jede Messung protokolliert ihre Umgebung mit (`hidden:` in derselben Zeile).
                   · Ein Beweisbild erfüllt SOP-01 (§05i) — sieben Bedingungen, sonst ist es eine
                     Behauptung mit Bildanteil.
                   · Kein Werkzeug, das nur im Chatverlauf existiert. Was zweimal gebraucht wird,
                     wird ein Modul mit Bericht.
                   · Georg kann keine Konsole lesen. Jede Zahl, mit der argumentiert wird, steht
                     im Panel unter „Diagnostics".
                   · tinyskies ist Benchmark, nicht Grundlage.
                   · Eine Scheibe endet, BEVOR das Kontextfenster eng wird.
```

---

## 00b · Onboarding für einen frischen Chat

**Drei Dateien, in dieser Reihenfolge. Nicht mehr.**

1. **`skills/session-design-briefing.md`** (Fassung 1.2) — wie geredet wird, in welcher Reihenfolge
   gearbeitet wird, was als Beweis zählt.
2. **Dieses Dokument**, §00 Übergabe → §00b → §05 Masterplan → §05x Sprint-Übergaben (die
   jüngsten sind **§05k C**, **§05l D**, **§05m F** und **§05n G** — mehr braucht ein frischer
   Chat nicht) →
   Entscheidungsprotokoll → Post Mortems scannen.
3. **`docs/CRITIQUE_Animation-Transition-VFX_v1.md`** (D-08) — North Star und Guideline für
   Animation, Transition, VFX, Audio-FX. Co-Deliverable jedes Exports.

**Alles Weitere kontextuell, nur wenn der Anlass da ist:**

| Anlass | Datei |
|---|---|
| Stand-Dokument führen oder anlegen | `skills/living-document_v1.md` |
| Sprint endet, Export gefragt | `skills/session-export_v1.md` |
| Chat endet | `skills/session-cut_v1.md` |
| Zwei Arbeitsplätze zusammenführen | `skills/workspace-sync_v1.md` |
| Personalisierung fehlt | `skills/georg_v1.md` |
| Quellen-Zuordnung tinyskies nötig | `github.md` |
| DecisionLog als Skill bauen | `docs/HANDOVER_KFB-DecisionLog.md` (D-09) |

⚠ **Warum nicht alle auf einmal:** ein frischer Chat, der sieben Vorlagen lädt, hat sein Fenster
zu einem Drittel mit Vorschriften gefüllt, bevor er das Projekt gesehen hat — und die meisten davon
sind in dieser Sitzung nicht anwendbar. Das ist das Anti-Pattern „Archiv statt Übergabe", nur mit
Skills statt mit Material. Die Vorlage 1.2 trägt ihre Auslöser selbst (`loads_on_demand` plus
Tabelle in §9); der frische Chat lädt die eine, die passt.

---

## 00c · NACHTRAG · Übergabe-Stand vom 30.8., erste Hälfte des Tages

**Bleibt stehen (additiv).** Was hier steht, ist der Stand VOR dem Schnitt auf v4 — die
Ursachenanalyse zu BUG-01/BUG-02 und der Kernbefund des Critique. Wer wissen will, warum die
Verdrahtungsebene gebaut wurde, liest diesen Block.

```
Zuletzt passiert   30.8. · **BUG-01 ist gefunden — und keine der beiden alten Hypothesen war
                   richtig.** Drei Ursachen, alle gemessen: (1) der Platzhalter ist EIN Bild für alle
                   Karten, also sind bis zum Artwork-Pump alle 38 Karten der Welt byte-identisch
                   (704 von 780 Paaren, Abweichung 2,8/255); (2) Indexkollision in der
                   Turmzuteilung (Schrittweite 3 bei bis zu 4 Etagen); (3) Wegweiser und Flugkarten
                   zogen dieselben Deck-Plätze 0…5. (2) und (3) sind behoben und nachgemessen,
                   (1) ist eine Entscheidung, die bei Georg liegt.
                   **BUG-02 ist behoben, aber nicht mit einer Zahl:** das Wegweiser-Blatt wird jetzt
                   GEBAUT statt geladen — Rechteck im Sollformat 1,74, sanfte Wölbung, aufgeworfene
                   Ecken, unruhiger Rand, zwei Lagen in EINER Geometrie (beidseitig lesbar).
                   Das GLB war ein Kissen mit fünfeckiger Silhouette, und die halbe Welt zeigte die
                   Wortmarke spiegelverkehrt.
                   **Design Critique (D-08) liegt vor, zwei Teile.** Kernbefund: dieses Projekt
                   hat kein Bau-Problem, sondern ein **Verdrahtungs-Problem**. Sechs Ereignisse
                   feuern beim Kartendurchflug alle bei t=0, der Höhepunkt bei t=1,05 s ist
                   stumm; `petKin.kick/trigger` wird NIE gerufen; `zyklus` und `schatten` sind
                   gebaut und ausgeschaltet; `playSFX` kann Pitch, bekommt ihn nie.
                   Teil 2 korrigiert drei eigene Fehlurteile aus Teil 1 (PM-52).

Als Nächstes       1. **„Bauordnung FX"** · `fx-bus.js` + `fx-script.js` + `trauma.js` (D-08 §14).
                      Kaskaden als DATEN, EIN Eigentümer der Kamerawucht, `fx.report()` mit
                      zählbaren Beats. **Zuerst**, weil sonst alles zweimal gebaut wird.
                   2. „Anschließen statt bauen" · Ankunftston, Pitch-Varianz, HUD-Recoil,
                      FOV-Stoß, Pet an die Ereignisse. Vokabular ist da, Aufrufe fehlen (PM-52).
                   3. „Einschalten" · `zyklus.on` und `schatten.on` — beide gebaut, beide aus.
                   4. „Post Mortems zusammenziehen" · §7 (1–12) und verstreut (10, 40–52).
                   5. „HUD-Einfassung" · ~~Georg 30.8.: gestanzte, battered Metal-Platte,
                      Rost-Textur `Metal022_1K-JPG`~~ ⚠ **NACHTRAG 30.8.: nie eine Vorgabe.**
                      Georg hat die Platten am fertigen Bild zweimal verworfen (erst das Metall,
                      dann den Kasten selbst). Der HUD trägt Zeichen mit Tuschekante, keinen Grund.
                   6. „Portal" · Georg 30.8.: die Wegweiser zeigen den kürzesten Weg zum PORTAL,
                      Motive sind Karten ANDERER Decks (Nachbarschaft, „good neighborhood").
                      Braucht Entscheidungen vor dem Bau (D-08 §10).
                   7. „Weltstimmungen" · verdant · molten · frost · bone. Das Tor dafür steht.
                   8. „Vierter Würfel" · grün = Powerups/Skins (Regenbogen-Munition, Konfetti-
                      Contrails). Georg 30.8.: erst planen, dann bauen — keine Bastelei.

So wird gearbeitet · Gemessen wird VOR der Diagnose — und **angesehen wird vor dem Messen, wenn die
                     Frage eine FORM betrifft.** BUG-02 hat zwei Runden gekostet, weil drei
                     korrekte Messungen am falschen Gegenstand lagen (PM-49).
                   · **Jede Messung nennt ihre Bedingung — auch die unsichtbaren.** Eine Messung in
                     einem verdeckten Tab (`document.hidden`) hätte in dieser Sitzung fast eine
                     vierte Ursache erfunden: der Artwork-Pump steht dort still (PM-50).
                   · Sechs Post Mortems dieser Sitzung sind Messgeräte, die falsch anzeigten — ein
                     falsches Instrument ist teurer als keins, weil man ihm glaubt.
                   · Jede Zahl mit Haken oder Warnung wird im selben Zug abgelesen, wie sie
                     geschrieben wird. Eine umbenannte Zahl ist eine erfundene Zahl.
                   · Georg kann keine Konsole lesen. Jede Zahl, mit der argumentiert wird, steht
                     im Panel unter „Diagnostics".
                   · tinyskies ist Benchmark, nicht Grundlage: gelesen wird die Mechanik,
                     übernommen werden Raten und Verhältnisse. Abweichungen bekommen einen Grund.
                   · Vor jeder Grenze: welche Größe, in welcher Einheit, über welche Menge?
```

---

## 01 · North Star

Eine Kugelwelt, über die ein KFB-Pet auf einer Karte fliegt und Kayfabizarro-Karten einsammelt.
Der Flug soll sich **gut anfühlen**, nicht korrekt sein — das ist der Prüfstein bei jeder
Entscheidung. Die Karten sind der Inhalt: sie werden gefunden, angeflogen und gelesen, nicht als
Punkte gezählt. Und die Welt soll aussehen wie eine KFB-Zeichnung, nicht wie eine Techniküberprüfung.

---

## 02 · Konzepte

| Konzept | Status | Kern |
|---|---|---|
| **Kugelflug** (tinyskies-Physik) | aktiv | Höhe relativ zur Oberfläche, keine absolute Grenze; Bodenkontakt ist kein Modus-Wechsel |
| **Karte als Sammelziel** | aktiv | Durchflug statt Kollisionssolver; Lesbarkeit schlägt Physik |
| **Karte als Rückseite** | aktiv | Platzhalter ist NIE Text, immer die kanonische KFB-Rückseite |
| **Würfel als Pickup** | aktiv | Farbe = Modifier, Augenzahl = Betrag |
| **Würfel ohne Zahlen** („RPG-Würfel") | aktiv, ungebaut | in der Welt trägt die FORM die Information, im HUD die Augenzahl |
| **Weltstimmungen** | aktiv, ungebaut | `verdant` · `molten` · `frost` · `bone` — hell UND dunkel erlaubt |
| **Wegweiser als Asset-Typ** | aktiv | Deck-Cover als Motiv; bei Kontakt dreht der Kurs zur Karte |
| **Katapult mit Feder** | aktiv, ungebaut | automatisch bei Kontakt; die Feder ERKLÄRT die Wucht sichtbar |
| **POI-Direktor** | aktiv, ungebaut | 1–2 Ziele im FOV — Regie, nicht Deko |
| **Küstensuche** | **verworfen** | eine Kursänderung ohne sichtbaren Anlass liest als Defekt (PM-26) |
| **Tone Mapping** | **verworfen** | die Quelle hat keins; ACES würde ein Farbproblem hinter einer Kurve verstecken |
| **Zwei Beleuchtungsmodelle** | **verworfen** | war die Ursache des Whack-a-Mole (PM-40) |

---

## 04 · Entscheidungsprotokoll

Titel als Aussage, nicht als Thema — wer den Titel liest, kennt die Entscheidung.

| Kennung | Entscheidung | Status | Begründung |
|---|---|---|---|
| **E-01** | Ozean bleibt 1:1 quellentreu | Fest | Cyan und Blau sind gesättigt, klippen also in ihren Hue statt in Weiß — es gab nie ein Problem |
| **E-02** | Würfel ohne Zahlen, nur Geometrie | Fest | Silhouette = Typ ist im Vorbeiflug lesbar, eine Augenzahl nicht; löscht die Pip-Naht |
| **E-03** | Katapult löst AUTOMATISCH bei Kontakt aus | Fest | wie Karten und Würfel; eine Zone treffen zu müssen ist Geschick genug |
| **E-04** | Wegweiser bleiben ein eigener Asset-Typ | Fest | sie sollen weisen: Deck-Cover als Motiv, Kurs dreht zur getroffenen Karte |
| **E-05** | Landmarken aus Primitiven, nicht aus Kit-Modellen | Fest | surreal komponierbar, kein UV-Mapping, Karten auf planen Flächen möglich |
| **E-06** | Die Grenze für „überstrahlt" ist SÄTTIGUNG, nicht Helligkeit | Fest | tinyskies' Gras ist heller als mein Band und überstrahlt nicht — gesättigt klippt in den Hue |
| **E-07** | Landfarben: nur Helligkeit geändert, Hue und Sättigung sind Kanon | Fest | der Kanon sagt WELCHE Farbe, die Helligkeit ist Technik |
| **E-08** | Firn gibt Sättigung ab (die eine Ausnahme zu E-07) | Fest | ein Near-White bezieht seine Weißheit aus NIEDRIGER Sättigung; sonst wird Schnee olivgold |
| **E-09** | `buildLightRig` ist der EINZIGE Erzeuger von Weltlichtern | Fest | ein anonymes achtes Licht war der Anfang des Whack-a-Mole |
| **E-10** | Kein `scene.environment` — Environment nur auf Pet-Materialien | Fest | Phong ignoriert es, PBR nicht; das spaltete den Lichthaushalt |
| **E-11** | Das Pet ist der einzige begründete PBR-Sonderfall | Fest | es SOLL plastischer sein als die Welt |
| **E-12** | Küstensuche steht auf AUS | Fest | siehe PM-26; die leere See wird durch SICHTBARE Ziele gelöst, nicht durch Automatik |
| **E-13** | Alle Bildschirmrechnungen gegen das CANVAS, nie gegen das Fenster | Fest | im Editor ist das Canvas eingerückt; sonst schneidet der Rand |
| **E-14** | Die UV-Abbildung des Papier-Blatts kommt von UNS | Fest | das Modell hat UVs, aber alle auf einem Texel — vorhanden ist nicht brauchbar |
| **E-15** | Ein Flash zum Kaschieren ist eine NOTLÖSUNG, kein Fix | Fest | Georgs eigene Einordnung; braucht Schalter, Begründung im Code und Ereignis-Sync |
| **E-16** | Die Abnahme ist SÄTTIGUNGSERHALT (≥ 0,55), das Luminanzband nur Rückfall | Fest | eine gesättigte Farbe klippt in ihren Hue, eine ungesättigte in Weiß — die alte Grenze verbot helle Welten mit |
| **E-17** | Ein Würfel ist ein PICKUP, nie Bühnenbild | Fest | ein unbeweglicher Würfel im Boden lehrt das Gegenteil von Georgs Kollisionsregel |
| **E-18** | Wortmarke wird GESTALTET, bevor sie animiert wird | Fest | eine Flug-Reaktion auf einen Notbehelf macht ihn beweglich, nicht besser |
| **E-19** | HUD-Kinetik: EIN Signalgeber, vier Leser mit eigenem Charakter | Fest | vier Leser auf `carpet.state` wären vier Verwalter; und vier gleich reagierende Ecken lesen als Wackeln |
| **E-20** | Die Abnahme rechnet mit dem TAG-Faktor (2,546), nie mit dem Live-Licht | Fest | eine Palette ist eine Konstante, das Licht nicht — nachts besteht jede Palette, weil nichts klippt |
| **E-21** | Jedes Urteil nennt die Bedingung, unter der es gilt | Fest | ein Urteil ohne seine Bedingung ist eine Behauptung (`gate@day` neben `@now`) |
| **E-22** | Nach jeder Ersetzung wird AM ORT gelesen, nie gezählt | Fest | `replaceText` schweigt bei Fehlschlag; vier stille Fehlschläge in Folge (BUG-08) |
| **E-23** | Ein Anker muss aus dem AKTUELLEN Dateiinhalt kommen | Fest | wer mehrere Ersetzungen stapelt, verschiebt seine eigenen Muster |
| **E-24** | Das Wegweiser-Blatt wird GEBAUT, nicht geladen | Fest | das GLB ist ein Kissen mit fünfeckiger Silhouette; ein Rechteck mit Wölbung, Eckenwurf und unruhigem Rand bedient „kein Box-Look" UND „kein perfektes Rechteck" — zwölf Zeilen Mathematik statt eines Netzabrufs |
| **E-25** | Ein Motiv gehört EINEM Ort in der Welt | Fest | ein Wegweiser ist Landmarke, eine Flugkarte ist Beute; dasselbe Motiv an beiden Stellen liest als Wiederholung (BUG-01). Der Schnitt bleibt innerhalb des Packs, „EINE Welt, EIN Deck" gilt weiter |
| **E-26** | Ein Wegweiser ist von BEIDEN Seiten lesbar | Fest | zwei Lagen in einer Geometrie, Rückseite mit gespiegeltem u — `DoubleSide` auf einer Lage schrieb „orrasiBafyaK" in die Welt |
| **E-27** | Laden ist schnell, Entspannen ist langsam — Faktor ~2 | Fest | steht zweimal im Code (`chase 40/20` in `pet-kinetics`, `ALTITUDE_RISE 0,75 / FALL 0,38` in `carpet`) und nirgends im Dokument. Hausregel für jede Feder, die noch kommt |
| **E-28** | Eine Kaskade ist eine Datentabelle, kein Codezweig | Fest | ohne diese Regel wächst jeder neue Effekt als `if` im Runner, und die Staffelung ist beim nächsten Mal wieder verloren (Critique §14.3) |
| **E-29** | Höchstens DREI Beats auf `t = 0` je Kaskade | Fest | mehr ist ein Akkord, kein Nachhall. Prüfbar in `fx.report()` — damit wird „die Effekte feuern alle gleichzeitig" eine Zahl statt einer Meinung |
| **E-30** | Ein Modul, das nicht gelesen wurde, wird nicht beurteilt — auch nicht negativ | Fest | „ungeprüft" ist ein zulässiges Urteil, „fehlt, weil ich es nicht sehen konnte" ist keines (PM-52) |

---

## 07b · Post Mortems · neu am 30.8.

**PM-49 · Eine Frage nach der FORM wird nicht durch eine Zahl beantwortet.**
Drei Messungen an `KFB_PaperCard_01`, alle korrekt, alle am falschen Gegenstand: das Hüllmaß sagte,
wie groß das Modell ist (0,510×0,516×0,306); die z-Verteilung sagte, wo die Masse liegt (33 % nahe
der Mittelebene → Kissen); die Wölbungstiefe sagte, wie flach es skaliert ist (2,3 % der Breite).
Kaputt war der **Umriss** — ein Fünfeck mit Spitzen — und keine dieser Zahlen kann das zeigen.
Gekostet: zwei Runden „blasig deformiert", beide mit einer gesenkten Zahl beantwortet.
*Regel: betrifft die Frage eine Form, ist die erste Messung ein BILD. Eine zweite Kamera in die
Szene setzen und hinsehen kostet einen Aufruf.*
Das ist PM-47 („die richtige Größe messen") ein zweites Mal — mit der Verschärfung, dass die
richtige „Größe" hier gar keine Zahl war.

**PM-50 · Die Messbedingung, die man nicht sieht: `document.hidden`.**
Eine Messung der Kartenvarianz meldete „Türme: 0/32 Artwork" nach 40 Sekunden Laufzeit und hätte
als vierte Ursache von BUG-01 durchgehen können („der Pump läuft nicht"). Gemessen war aber ein
**verdeckter Tab**: `pumpArt` bricht bei `document.hidden` ab, korrekt und mit Absicht. Der Pump
war in Ordnung, die Messung stand im Dunkeln.
Derselbe Bau wie BUG-07 (das Tor rechnete mit dem Live-Licht): **nicht der gemessene Gegenstand war
die Nicht-Konstante, sondern die Umgebung des Messens.** Beim dritten Mal in zwei Sitzungen ist es
keine Panne mehr, sondern eine fehlende Gewohnheit.
*Regel: jede Messung protokolliert ihre Umgebung mit — hier wörtlich `hidden: true` in derselben
Zeile wie das Ergebnis. Ein Ergebnis ohne seine Umgebung ist eine Behauptung (E-21, eine Ebene
tiefer).*

**PM-51 · Eine Entscheidung für ein Objekt gilt nicht automatisch für seine Vervielfältigung.**
„Platzhalter ist NIE Text, immer die kanonische KFB-Rückseite" ist für die EINE Flugkarte richtig —
sie IST die Rückseite. Auf 32 stehende Wegweiser angewandt ergibt dieselbe Regel 32 identische
Schilder, und das ist gemessen die dominante Ursache von „Karten wiederholen sich" (704 identische
Paare). Die Regel wurde nie falsch; ihr Geltungsbereich ist stillschweigend gewachsen.
*Regel: wenn ein Asset-Typ vervielfältigt wird, wird seine Platzhalter-Regel neu begründet.*

**PM-52 · Ein Modul, das nicht gelesen wurde, wird nicht beurteilt — auch nicht negativ.**
Teil 1 des Design Critique hat sieben Module mit „ungeprüft, weil unlesbar" abgetan und dann
trotzdem über sie geurteilt. **Drei Urteile waren falsch:** „Anticipation fehlt überall" (sie ist
vollständig in `pet-kinetics` — asymmetrisches Nachziehen 40/20, Bank-Rate als eigene Größe,
Landungs-Squash ∝ Aufprall) · „Kamera zieht nicht zurück" (sie fällt bei Boost von Abstand 1,2 auf
0,6 und Höhe 0,7 auf 0,15) · „Bandtrail ungeprüft" (`carpet-trail` ist zeichengleich zur Quelle,
8-Segment-Einblende inklusive). Ein `grep` hätte jeden der drei in einem Aufruf geklärt.
**Die Korrekturen haben den wahren Befund freigelegt:** dieses Projekt hat kein Bau-Problem,
sondern ein **Verdrahtungs-Problem**. `rig.shake` — gebaut, drei Aufrufer. `petKin.kick/trigger`
— gebaut, **nie** gerufen. `zyklus` — gebaut, `on: false`. `schatten` — gebaut, `opacity: 0`.
`playSFX(…, playbackRate)` — vorhanden, nie übergeben. Fünf Fundstellen, ein Muster.
*Regel: bevor ein Effekt als fehlend gemeldet wird, wird nach seinem AUFRUFER gesucht, nicht nach
seinem Modul. Ein gebautes Vokabular ohne Aufrufer ist teurer als ein fehlendes — es sieht in der
Codebasis wie erledigt aus.*

---

## 05 · Masterplan v4 · „Anschließen statt bauen"

**Angelegt 30.8. aus D-08 (Design Critique).** Georgs Auftrag: große Slices, autonom, additiv
dokumentiert, mit Screenshot-Beweisen und **automatisierten Kaskaden-Abnahmen statt
Einzel-Insel-Tests**. Zwischenabnahme nur bei Produktions-Blockern oder Richtungsentscheidungen.

**Der North Star dieses Plans, in einem Satz:** dieses Projekt hat kein Bau-Problem, sondern ein
Verdrahtungs-Problem (PM-52) — fünf gebaute Systeme werden von keinem Ereignis erreicht oder sind
ausgeschaltet. Also wird zuerst die Verdrahtungsebene gebaut, dann angeschlossen, dann erweitert.

### Abweichung von D-08 §17, mit Grund

§17 setzt die Bauordnung an Platz 1. Zwei Änderungen:
1. **„Einschalten und ansehen" kommt davor** (Slice A). `zyklus.on` und `schatten.on` sind zwei
   Zeilen — aber ihr Ergebnis ist eine GESTALTUNGSFRAGE, und die gehört Georg. Sie vorzuziehen
   kostet nichts und hält die eine nötige Zwischenabnahme klein.
2. **Die Bauordnung liefert EINE Referenz-Kaskade, nicht alle acht** (Slice B gegen C). Bus plus
   acht Kaskaden in einem Zug wäre eine Abnahme, die niemand prüfen kann; mit einer Referenz ist
   der Rest mechanisch und die Abnahme automatisiert.

### Die Slices

| Slice | Name | Umfang | Abnahme MIT BEWEIS | Gate |
|---|---|---|---|---|
| **A** | **Einschalten und ansehen** | `zyklus.on = true` · `skyHz` 4 → ≥ 12 · `schatten.on` + Deckkraft messen · `carpet-leaves` Rate/Tor (gemessen 0 lebende Partikel) | Bildpaare Tag/Abend/Nacht · Schatten bei drei Höhen · `laub.lebend > 0` | **JA — Georg urteilt** |
| **B** | **Bauordnung** | `fx-bus.js` · `fx-script.js` · `trauma.js` (D-08 §14) + `card.collect` als Referenz-Kaskade vollständig verdrahtet: Ankunftston, Pitch-Varianz, HUD-Recoil, FOV-Stoß, Pet-Kick, Sidechain-Dip | **Loop A** Bildstreifen 12 Bilder · **Loop B** Beat-Audit ≤ 1 Bild Abweichung · Panel-Zeile `fx.report()` | nein |
| **C** | **Alle Kaskaden** | Würfel · Wegweiser · Schuss · Wasser · Boost · Bodenkontakt · Respawn · Intro-Übergabe. Mechanisch nach B | Bildstreifen je Kaskade · Beat-Audit alle grün · **Loop D** Invarianten (Draw-Calls ± 2 auf Basislinie 121) | nein |
| **D** | **Parameter freilegen** | `carpet` · `trail` · `lines` · `rig` · `petKin` · `hud` · `leaves` · `biom` bekommen `params` + `report()` + Panel-Zeilen. Kein Verhaltenswechsel | Panelbild mit allen Werten · Diff-Beweis: Verhalten vorher/nachher identisch (Loop C, gleiche Ereigniszahlen) | nein |
| **E** | **Wegweiser & Portal** | Portal-Modul · Wegweiser zeigen kürzesten Weg dorthin · Motive aus Nachbar-Decks | Bildstreifen Portal-Durchflug · Messung: Trefferfläche gegen sichtbaren Ring (Soll 1,47×) | **JA — Entscheidungen offen, D-08 §10** |
| **F** | **Wake & Drift-Rauch** | `carpet-wake.js` · `drift-smoke.js` nach tinyskies-Raten | Bildpaare über Wasser / über Land · Partikelzähler · Bildzeit gegen Basislinie 12,3 ms | nein |
| **G** | **HUD-Einfassung** | ⚠ **NACHTRAG 30.8.:** die Metall-Platte war nie eine Vorgabe (§05o). Was von G gilt: EINE Maßfamilie für alle vier Ecken, Tempo in der Nabe, Flug-Reaktion. Keine Hintergrund-Kästen — Gegensatz zu den In-Game-Hartgummi-Würfeln | Bild der vier Ecken · Flug-Reaktion als Bildstreifen | nein |
| **H** | **Weltstimmungen** | `verdant` · `molten` · `frost` · `bone` — das Sättigungstor steht | Vier Bilder · `gate self-test 4/4 ✓` je Stimmung | nein |

**Reihenfolge:** A → B → C → D → F → G → H, E sobald die Entscheidungen stehen.

### Vierter Würfel (Georg 30.8.)

Grün = **Powerups/Skins**, keine „echte" Kraft: Regenbogen-Munitionsfarbe oder Konfetti-Contrails.
**Ausdrücklich nicht in einem Slice zwischendurch** — Georgs Ansage: sauber geplant und animiert,
keine Bastelei. Gehört hinter C (dann existiert die Kaskadenschicht, die es braucht).

---

## 05b · Arbeitsweise in Slices — der Vertrag

**Damit frische Chats nahtlos übernehmen und Georg nur Fortschritt prüfen muss.**

**Je Slice, ohne Ausnahme:**
1. **Onboarding:** §00 Übergabe + §05 Masterplan + der Sprint-Übergabe-Block des Vorgängers
   lesen. Kein Chatverlauf nötig.
2. **Messen vor Diagnose, ANSEHEN vor Messen bei Formfragen** (PM-49).
3. **Abnahme automatisiert und als KASKADE**, nie als Insel: die vier Loops aus D-08 §15
   (Bildstreifen · Beat-Audit · Gameplay-Simulation · Szenen-Invarianten). Jede Schleife braucht
   ihre Kontrollprobe — ein Prüfwerkzeug ohne Kontrollprobe ist eine Meinung (PM-41).
4. **Jede Messung protokolliert ihre Umgebung mit**, wörtlich `hidden: false` neben dem Ergebnis
   (PM-50).
5. **Beweise als Dateien:** `docs/evidence/<slice>-<sache>.png`, im Slice-Block verlinkt.
6. **Sprint-Übergabe am Slice-Ende** als eigener Block hier im Dokument: *was geändert wurde ·
   gemessene Zahlen · Beweisdateien · die ersten drei Züge des nächsten Slice.* Ein frischer Chat
   liest nur diesen Block und arbeitet weiter.
7. **Kontextfenster:** ein Slice endet, bevor das Fenster eng wird — nicht, wenn es voll ist. Die
   Übergabe wird geschrieben, während noch Platz ist, nie danach.

**Zwischenabnahme durch Georg nur bei** Produktions-Blocker oder Richtungsentscheidung. Im
Masterplan sind das genau **zwei** Slices (A und E). Alles andere läuft durch.

---

---

## 05c · Sprint-Übergabe · Slice A „Einschalten und ansehen" (30.8.)

**Umgebung jeder Messung: `hidden: true`** — und das ist diesmal der wichtigste Satz des Blocks,
siehe „Befund 3" unten.

### Was geändert wurde

| Datei | Vorher | Jetzt | Grund |
|---|---|---|---|
| `globe-poc.js` → `createDayNight` | `on: false` (Modul-Standard), `skyHz: 4` | **`on: true`, `skyHz: 14`** | der Zyklus ist die einzige langsame Transition im Spiel und war nie im Bild beurteilt (D-08 §3.2). 4 Hz sind eine Quantisierung einer stetigen Größe |
| `globe-poc.js` → `createCardShadow` | `{ opacity: 0, on: false }` | **`{ opacity: 0.30, on: true }`** | ein Rand-Artefakt ist ein Schönheitsfehler, eine fehlende Höhenanzeige ein Lesefehler (D-08 §3.3) |
| `carpet-leaves` | — | **unverändert** | siehe Befund 1 |

### Befund 1 · `carpet-leaves` war kein Befund — A12 ist gestrichen

Gemessen `lebend: 0`, `landAlpha: 0`. **Das ist quellentreu und richtig:** die Schwelle ist Tempo
**0,5**, unser Reisetempo ist `MIN_SPEED 0,28`. Der Modulkopf sagt es wörtlich — *„bei unserem
Reisetempo 0,28 passiert also NICHTS — Blätter sind ein Schnellflug-Effekt."*
Mein Vergleich in D-08 §12.5 („24× sparsamer als tinyskies") stellte `CarpetLeaves` (0,25 Blätter
je Bild) gegen `CarpetWake` (6 Spritzer je Bild) — **zwei verschiedene Effekte.** `EMIT_PER_FRAME
0,25` ist in beiden Projekten dieselbe Zahl.
→ **Vierte Selbstkorrektur an D-08**, dieselbe Klasse wie PM-52: geurteilt, ohne den Modulkopf zu
lesen. Offen bleibt nur eine echte Messung bei Tempo > 0,5 (gehört in Loop C).

### Befund 2 · Der Zyklus läuft — und die goldene Stunde ist die kürzeste Phase

Phasenkarte gemessen in Schritten von 0,05 (6 Minuten je Tag):

| Segment | Phasenbereich | Anteil | Dauer je Umlauf |
|---|---|---|---|
| `day` | 0,00 – 0,40 | **45 %** | 2:42 |
| `evening` | 0,45 – 0,50 · 0,95 | **15 %** | 0:54, in zwei Stücken |
| `night` | 0,55 – 0,90 | **40 %** | 2:24 |

**Beweise:** [`A-zyklus`](./evidence/01-A-zyklus.png) · [02](./evidence/02-A-zyklus.png) ·
[03](./evidence/03-A-zyklus.png) · [04](./evidence/04-A-zyklus.png) — Tag, Nacht mit Sternen und
Nebel, Nacht, Dämmerung. Vier klar verschiedene Bilder, der Wechsel funktioniert.

⚠ **Die Gestaltungsfrage für Georg:** die Dämmerung — das schönste Licht — hat **0:54 von 6:00**,
und sie ist zerlegt in **0:36 Abend und 0:18 Morgengrauen**. Achtzehn Sekunden Morgenlicht pro
Umlauf. Die Nacht dagegen dauert 2:24, und in ihr ist die Welt fast farblos. *Vorschlag, wenn du
zustimmst: Dämmerung auf ~25 % anheben (Nacht auf ~30 %), also Segmentgrenzen verschieben — keine
neuen Presets, nur andere Bereiche.*

### Befund 3 · Messen in einem verdeckten Tab taugt nicht für Zeit — und das ist eine Bauvorgabe

`bildMs 16` und `intro.active: true` **auch 10 s nach dem Laden**: in einem verdeckten Tab drosselt
der Browser `requestAnimationFrame`, also läuft die Welt fast nicht. Damit ist **jede zeitbasierte
Messung und jedes Bild eines Zustandswechsels aus einem verdeckten Tab unbrauchbar.**
Das ist PM-50 zum dritten Mal in zwei Sitzungen, und es hört auf, eine Panne zu sein:

> **Die QA-Loops dürfen nicht auf `rAF` warten. Sie müssen die Welt mit einem EIGENEN festen `dt`
> vorwärtsdrehen.** Ein Prüfstand, dessen Uhr der Browser stellt, misst die Aufmerksamkeit des
> Zuschauers mit.

→ **Erster Bauteil in Slice B ist deshalb nicht der Bus, sondern der Antrieb:** ein
`step(dt)`-Eingang, der einen Weltschritt ohne `rAF` ausführt. Loop A und Loop B hängen daran, und
ohne ihn ist die Abnahme von B selbst nicht messbar.

### Was Slice A offen lässt

**Der Schatten ist an (`opacity 0,30`, gemessen), aber noch nicht im Bild beurteilt.** Vier
Nahaufnahme-Versuche mit handgesetzten Kameras haben den Avatar nicht getroffen (die Kamera landete
an der Wasseroberfläche) — und der Grund ist Befund 3: ohne laufende Welt steht der Avatar nicht da,
wo die Rechnung ihn erwartet. **Ich baue dafür keine zweite Krücke.** Das Schattenbild kommt aus
Loop A, sobald der `step(dt)`-Antrieb steht — mit derselben Mechanik, die auch alle Kaskaden belegt.

### Die ersten drei Züge von Slice B

1. **`step(dt)`** im Runner: ein Weltschritt ohne `rAF`, plus `world.freeze()` / `thaw()`.
   Kontrollprobe: 60 × `step(1/60)` muss die Weltuhr um genau 1,000 s bewegen.
2. **`trauma.js`** — ein Eigentümer der Kamerawucht, gerichtet + Rollkanal + FOV-Stoß
   (`camera-rig` liest, besitzt nicht mehr; die drei bestehenden `rig.shake`-Aufrufe fallen weg).
3. **`fx-bus.js` + `fx-script.js`** mit `card.collect` als Referenz-Kaskade (D-08 §14.2), dann
   Loop A (Bildstreifen) und Loop B (Beat-Audit) als Abnahme — und dabei fällt das ausstehende
   Schattenbild als Nebenprodukt an.

---

## 05d · Asset-Vormerkungen · Georg 30.8.

Aus `georg-doc/kayfabizarro` · `media/3D_Assets/KFB/`. **Vorgemerkt, nicht gebaut** — jede Zeile
nennt den Slice, in den sie gehört. Georgs Auswahlkriterium: *„gute Basis-Coverage, nicht zu eng,
Rule of Three."*

| Asset | Wofür | Slice | Notiz |
|---|---|---|---|
| `Rocks by Quaternius - gYhoEOKItJ.glb` | Terrain-Props, Basis-Coverage | F/G-Umfeld | Felsen sind die billigste Silhouetten-Varianz — sie brauchen kein UV und tragen keine Farbe |
| `Mushrooms by Brandon Wood - 3mC86fzhLSZ.glb` | Terrain-Props | dito | **aus der Base herauslösen** (Georg) — der Sockel gehört nicht in unser Gelände |
| `Arch by Kay Lousberg - uS8wgBVxOL.glb` | Portal-Kandidat | **E** | Georgs eigener Vorbehalt steht dabei: *„tinyskies könnte mit den ovalen Portalen cooler aussehen und sich besser für den Durchflug zur Kamera ausrichten"* — und das ist gemessen richtig: `CosmicWorldPortal` dreht seinen Ring **zur Kamera**, während er senkrecht zur Planetenoberfläche stehen bleibt. Ein Torbogen aus dem Gelände kann das nicht, ohne seine Statik zu verlieren. → **Entscheidung in E**, nicht vorher |
| `Skateboard by Poly by Google - 7Dfn4VtTCWY.glb` | Fahrzeug (Flug **und** Wasser) neben der Badewanne | Backlog | dritter Fahrzeugtyp — das Vokabular „Teppich/Badewanne/Board" ist Rule of Three |
| `dice set by Jeremy Eyring - 2pU6Ie7DcmX.glb` | RPG-Würfel MIT Zahlen · und/oder Terrain-Landmarken mit **Zähler-Option** (physische Drehung in Gelände, Wasser oder Luft) | nach **C** | ⚠ Berührt E-02 („Würfel ohne Zahlen, nur Geometrie") — kein Widerspruch, wenn die Zahlen im HUD bzw. auf einem drehbaren LANDMARKEN-Würfel stehen und nicht auf dem Pickup. Und E-17 („ein Würfel ist ein Pickup, nie Bühnenbild") gilt weiter: ein drehbarer Zähler-Würfel ist ein DRITTER Typ und braucht seine eigene Begründung, sonst ist er der rote Würfel aus BUG-05 mit neuem Namen |
| `media/3D_Assets/Textures/Metal022_1K-JPG` | ⚠ **NACHTRAG 30.8.: nicht verwendet, zurückgenommen** (§05o) | — | Georg 30.8.: gestanzte battered Metal-Platte; die In-Game-Würfel bleiben Hartgummi — der Kontrast ist die Aussage |
| `kenney_platformer-kit/…/spring.glb` | Katapult | Backlog | steht seit dem 29.8. vorgemerkt |
| `Bubbly_Bathroom_…/bath.gltf` | Badewanne als Fahrzeug | Backlog | dito |

---

## 05e · Sprint-Übergabe · Slice B „Bauordnung" (30.8.)

**Umgebung: `hidden: true`** — und das ist diesmal die Pointe: der Prüfstand liefert in einem
verdeckten Tab brauchbare Bilder und Zahlen, weil er nicht mehr auf `rAF` wartet.

### Neue Dateien

| Datei | Rolle |
|---|---|
| `globe-v3/trauma.js` | **EIN Eigentümer der Kamerawucht.** Gewichtstabelle mit Begründung je Ereignis, gerichtete Auslenkung, kohärenter Rollkanal, FOV-Stoß, eine Abklingkonstante. Ersetzt das achsweise Weltraum-Rauschen |
| `globe-v3/fx-bus.js` | **EIN Eingang für Ereignisse.** Abspieler mit eigener Uhr, Selbstüberschreibung zählt verworfene Beats, unbekannter Wirker ist ein Zähler statt eines Absturzes, `zeile()` fürs Panel |
| `globe-v3/fx-script.js` | **Die Kaskaden als DATEN** (E-28) — acht Partituren, keine Logik, keine Imports |

### Geänderte Dateien

`globe-poc.js` (Antrieb `step(dt)` · `freeze/thaw` · Wirker · vier Handler auf `fx.fire` reduziert ·
sechs Panel-Zeilen) · `camera-rig.js` (liest Trauma auf drei Kanälen, `shake()` ist eine Weiche) ·
`audio-switch.js` (`sfx(kind, strength, opt)` mit `rate`-Intervall) · `pet-kinetics.js` (`kick()`
nach außen) · `day-night.js` (Segmentgrenzen, Slice A · Georgs Entscheidung).

### Abnahme — gemessen, nicht behauptet

**1 · Antrieb.** 60 × `step(1/60)` → `60/60` Schritte, `frameFehler: 0`. Phasenzuwachs **0,003**
gegen Soll **0,002778** — die Differenz ist die **Auflösung des Messgeräts**, nicht des Antriebs:
`zyklus.report().phase` rundet auf drei Stellen, und 0,002778 rundet zu 0,003. *Notiert als kleiner
Instrumentenbefund: ein gerundeter Bericht ist keine Uhr.*

**2 · `fx.selbsttest()` — 4/4 ✓**
```
✓ 3 beats gespielt (3)
✓ reihenfolge 0,1,2
✓ zeiten 0.017 / 0.117 / 0.267 (soll 0,000 / 0,100 / 0,250, Toleranz 1 Bild)
✓ kontrollprobe: +100 ms wird als abweichung erkannt
```

**3 · `wucht.selbsttest()` — 4/4 ✓** (Name→Gewicht · Klemmen bei 10× portal · Abklingen trifft
`ln 10 / k` = 0,38 s auf 0,100 · unbekannter Name wird gezählt).

**4 · Loop B · Beat-Audit `card.collect`** — Ist gegen Soll, Toleranz ein Bild (16,7 ms):

| Soll `t` | Beats | Ist `t` | Abweichung |
|---|---|---|---|
| 0,000 | 3 | 0,017 | +17 ms (ein Bild — ein Beat bei t=0 fällt beim ersten Schritt) |
| 0,060 | 2 | 0,067 | +7 ms |
| 0,100 | 1 | 0,100 | 0 ms |

**5 · `fx.zeile()`** — `8 cascades · 0 live (peak 1) · 4 fired · 15 beats · 0 dropped ·
max t=0 beats: 3 (card.collect)`.
→ **E-29 ist eingehalten und ABLESBAR.** Vorher lag der Kartendurchflug bei sechs Ereignissen auf
`t = 0`; jetzt bei drei, und die Zahl steht im Panel.

**6 · Trauma-Kanäle** — `pos 7,5 cm · roll 3,15° · fov 5°`, Abklingen `6/s → 10 % nach 0,38 s`.
Der Rollkanal hat sein **eigenes** Budget neben `MAX_TILT` (3,44° für die Kurve) — die beiden
addieren sich, keiner nimmt dem anderen etwas weg.

**7 · Loop A · Bildstreifen** — [`B-loopA-strip.png`](./evidence/B-loopA-strip.png):
12 Bilder von `ground.touch` bei `dt = 1/30 s`, mit Zeitachse und `hidden:true` **im Bild
gestempelt**. Das Werkzeug steht.

### Drei Befunde aus der eigenen Abnahme

**a) Der Bildstreifen kann den Trauma-Kanal bei `dt = 1/30` nicht zeigen — aus Rechengründen.**
Die Modulation läuft mit **22 Hz**, die Abtastung mit 30 Hz. Nyquist ist 15 Hz, also ist die
Vibration unterabgetastet und im Streifen unsichtbar (Aliasing), obwohl sie im Bild existiert.
→ **Regel für Loop A: `dt ≤ 1/(2,5 · höchste Frequenz der Kaskade)`.** Für 22 Hz heißt das
`dt ≤ 1/55 s`. *Ein Messwerkzeug mit zu grober Abtastung zeigt nicht „kein Effekt", sondern
„nichts messbar" — und das sieht gleich aus.* Dieselbe Klasse wie PM-47: die richtige Größe
messen, hier die richtige Rate.

**b) Die Tonhöhen-Varianz ist ungeprüft:** `rateAngewandt: 0 · rateOhneWirkung: 0` — es hat kein
Ton gespielt, weil der Klang eine Nutzergeste braucht. **Das kann nur Georg prüfen** (eine Taste
drücken, dann eine Karte sammeln). Der Zähler im Panel unter `Sound variance` sagt danach, ob sie
wirkt oder im Synth-Zweig verpufft.

**c) Der Selbsttest schrieb seinen Probelauf in die Betriebszahlen.** `unbekannteNamen: 3` stand im
Bericht — erzeugt vom Test selbst (er prüft absichtlich einen unbekannten Namen). Die Panel-Zeile
hätte also nach jedem Aufruf **falschen Alarm** gemeldet. Behoben: der Test stellt den Zähler
zurück. *Dieselbe Klasse wie BUG-07 — ein Prüfwerkzeug, das seine Probe in die Messung schreibt,
macht die Messung unlesbar.*

### Was Slice B offen lässt

- **Das Schattenbild** (aus Slice A). Der Streifen zeigt die Welt aus Reiseflug-Distanz; der Avatar
  ist darin wenige Pixel groß. Loop A braucht eine **Kaskaden-Nahkamera** — das ist ein Bauteil von
  Slice C, nicht eine Handkamera.
- **`water.enter` hat keinen Wirker** (`wake`) — bewusst: die Kaskade ist die Vormerkung für
  Slice F und meldet sich selbst (`fx-bus` zählt den fehlenden Wirker, Konsole warnt beim Laden).
- `boost.start` und `water.enter` sind definiert, aber noch **nicht gefeuert** — die Aufrufstellen
  gehören zu Slice C.

### Die ersten drei Züge von Slice C

1. **Loop A um eine Nahkamera erweitern** (`dt ≤ 1/55`, Blick auf den Avatar) — damit fallen
   Schattenbild und Trauma-Sichtbarkeit als Nebenprodukt an.
2. **Die restlichen Kaskaden feuern:** `boost.start` (an `c.elevate`-Flanke), `water.enter` (an
   `S.isOverWater`-Flanke), `ground.touch` (an der Bodenberührung — heute feuert nur
   `impact-dust`), Intro-Übergabe.
3. **Loop D · Szenen-Invarianten:** Draw-Calls zurück auf Basislinie ±2 nach jeder Kaskade,
   Geometrie- und Texturzahl unverändert, `frameFehler === 0`. Basislinie neu messen, weil Slice A
   den Schatten eingeschaltet hat.

---

## 05f · Georgs Entscheidungen vom 30.8. — vollständig eingearbeitet

Aus `KFB Entscheidungen v1.dc.html`. **Zwei Punkte waren keine Entscheidungen, sondern Fragen an
die Quelle** — die stehen als Messung darunter, nicht als Meinung.

### Blocker · Slice E ist damit entsperrt

| Kennung | Entscheidung | Folge für den Bau |
|---|---|---|
| **E-31** | **Portalanzahl ist VARIABEL je Spielmodus und Welt** | `portal.js` bekommt die Anzahl als Parameter, nicht als Konstante. Der Wegweiser darf also nicht „das Portal" kennen, sondern muss „das nächste" rechnen — Entfernung je Bild, nicht einmal beim Bau |
| **E-32** | **Durchflug = Sprung auf DERSELBE Kugel, weit entfernte Seite, mit VFX und Audio** | Kein Weltwechsel, keine Zustandsübergabe, kein Ladeschirm. Das Ziel wird nach Winkelabstand gewählt (Quelle: Mindestabstand 1,2 rad ≈ 69°; „weit entfernt" heißt bei uns ≥ 2,0 rad ≈ 115°) |
| **E-33** | **Portal-Form: Oval wie tinyskies** | Torus + Shader, richtet sich je Bild zur Kamera und bleibt senkrecht zur Oberfläche. Der Torbogen (`Arch by Kay Lousberg`) bleibt Kandidat für einen späteren Rahmen, nicht für die Mechanik |
| **E-34** | **Wegweiser-Motiv erstmal RANDOM, später konfigurierbar je Spielmodus und Setting** | Die Deckwahl wird ein Parameter mit Standard `random`. Kein Nachbarschafts-Lookup in Slice E — der wäre eine Wette auf eine Logik, die es noch nicht gibt |
| **E-35** | **ZWEI Sorten Wegweiser, unterschieden durch FX-Farbe, beide PULSIEREND** | Karten-Weiser regenbogenfarben, Portal-Weiser in Portalfarben. ⚠ Das ist die erste Stelle, an der eine FARBE Bedeutung trägt, ohne dass die Form es tut — also gehört sie in die Kaskadenschicht als eigener Wirker (`glow`), nicht als Materialschalter am Modell |

### Richtung

| Kennung | Entscheidung |
|---|---|
| **E-36** | **Weltstimmung „molten" zuerst** — der härteste Test für das Sättigungstor. Besteht molten, bestehen alle |
| **E-37** | **RPG-Würfel werden DURCHFLUGZIELE** — zum Zersplittern und zum Ausprobieren mehrerer Varianten, aus denen später ein Best-of wird. Georg wörtlich: *„keine billigen/LAZY FX again!!"* → das ist ein Explorationsslice mit mehreren gebauten Varianten, kein Effekt |
| **E-38** | **Vierter Würfel: noch keine Festlegung, ausdrücklich EXPLORATIV** — Georgs Zielbild: sechs FX für Würfel/Kollision/Kontakt, den Würfelflächen zugeordnet |

**R2 (Ankunftston) bleibt offen** — Georg testet später, Silent-Mode.

### Später

| Kennung | Entscheidung |
|---|---|
| **E-39** | Skateboard als drittes Fahrzeug **nach** den Weltstimmungen |
| **E-40** | Post-Mortem-Umzug **jetzt**, zwischen zwei Slices |
| **E-41** | Felsen und Pilze ins Terrain **später** — nicht in Slice F |

---

---

## 05p · [GATE] Rückbau auf die Quelle · 30.8., nach `use-what-works v1.1`

```
[GATE] Stand:    Land- und Wasserfarben sind auf Quellenniveau, das Bild ist trotzdem verwaschen.
[GATE] Auftrag:  „kein guesswork mehr! kein mess&guess!" · „ich will den tinyskies look
                 zurück, 1:1! warum geht das nicht?!?" (Georg, 30.8.)
[GATE] Vorlagen: dannylimanseta/tinyskies@2659a5cc987d · client/src/game/Globe.ts ·
                 createSurface() — Palette, Höhenbänder, Fleckenrauschen, Fragment-Patch,
                 rimIntensity/rimPower
[GATE] Fork:     globe-v5/globe.js · SURFACE_FRAGMENT_BODY wird ERSETZT, nicht geflickt (Regel 4)
[GATE] Fehlt:    nichts — die Datei ist gelesen
```

### [Q]/[A] — vor dem Bauen, nicht danach

- **[Q]** Warum ist es nach zwei Farbrunden noch verwaschen — fehlt eine Farbe?
  **[A]** Nein. `Globe.ts`: `rimIntensity = 0.8`, `rimPower = 8.5`. Unsere Fassung:
  `0.6` / `2.5`. Bei Fresnel 0,5 ist `pow(0.5, 2.5) = 0.177` gegen `pow(0.5, 8.5) = 0.0028` —
  **Faktor 63**, und das Ergebnis wird ADDIERT, auf jedes Pixel. Ein Saum mit Exponent 2,5 ist
  kein Saum, sondern ein Schleier über der ganzen Kugel. `rimColor 0xffeebb` ist warmweiß; bei
  Landalbedo 0,2 kam über die Hälfte der Flächenhelligkeit aus diesem Schleier. **Das ist das
  Verwaschene, und es ist keine Farbe, sondern ein Exponent.**
- **[Q]** Läuft unser Wasser-Shader wie ihr Wasser-Shader?
  **[A]** Nein, an drei weiteren Stellen. (1) Ihr Außentor ist die FARB-Prüfung
  `vColor.b > vColor.r + vColor.g * 0.5`, und `vOceanDepth > 0.0 && < 1.0` ist nur der
  INNEN-Block für die Kontourlinien. Wir hatten beide zu EINEM Block verschmolzen — dadurch
  bekam **tiefes Wasser (`depth == 1.0`) weder offenen Schaum noch Glitzern.** Totes Blau.
  (2) Ihre erste Zeile im Wasser, `gl_FragColor.rgb += vec3(0.04, 0.06, 0.10)`, fehlte bei uns
  ganz. (3) Das Glitzern war nachgerechnet: sie bilden
  `sp1*sp2*sp3*sp4 + sp2*sp3*sp5*0.5` und maskieren mit `smoothstep(0.15, 0.5, mask)`, wir
  `sp1*sp2*sp3*sp4*sp5*max(0,mask)` — anderes Verfahren, ein Produktterm fehlt, Schwelle 1,0
  statt 0,97.
- **[Q]** Wie konnte das durchrutschen?
  **[A]** Der Kommentar über dem Block behauptet: *„jede Formelzeile steht wörtlich so in der
  Quelle."* Das war falsch, und niemand hat es geprüft. **Regel 2: ein nachgerechnetes Verfahren
  ist ein NEUES Verfahren, auch mit denselben Formeln darin** — und eine Behauptung im Kommentar
  ist kein Beweis. Meine letzten zwei Runden waren Regel 4 in Reinform: an der eigenen Fassung
  weitergeflickt, jede Reparatur mit eigener Messung, jede Messung an der falschen Sache.
- **[Q]** Was ist der Beweis, dass die Kopie echt ist (Regel 6)?
  **[A]** `createSurface` ist stumm — kein Log. Also nach Skill-Vorgabe: ihre Zahlen einmal
  ausgeben und gegen die Quelle prüfen. `globe.quellenProbe()` gibt die vier Konstanten aus, die
  abwichen, und meldet ✗ bei Abweichung. Sie steht im Panel unter „Diagnostics".
- **[Q]** Was lässt sich NICHT kopieren (Naht)?
  **[A]** Zwei Dinge, benannt statt verschwiegen. (a) Ihre Höhe kommt aus
  `terrain.elevation`, unsere aus `terrainElevationFromValue` — dieselbe Größe, eigene
  Normierung auf `MOUNTAIN_HEIGHT`; das ist die Naht und bleibt unsere Arbeit. (b) Der
  `biomeTint`-Regler ist unsere Zutat und steht ab jetzt auf **0** (quellentreu); er bleibt als
  Regler für Slice H erhalten, ist aber im Standardbild nicht beteiligt.

### [CHANGELOG] additiv

- **NEU:** `SURFACE_FRAGMENT_BODY` ist die wörtliche Kopie aus `Globe.ts` (Außentor als
  Farbprüfung · `+= vec3(0.04, 0.06, 0.10)` · Kontour als Innen-Block · Glitzern mit beiden
  Produkttermen und Maskenschwelle 0,15…0,5 · `smoothstep(thresh, 0.97, …)`).
- **NEU:** `rimIntensity 0.8` · `rimPower 8.5` — die Werte der Quelle.
- **NEU:** `globe.quellenProbe()` als Regel-6-Beleg, ablesbar im Panel.
- **UNVERÄNDERT:** Landpalette und Fleckenrauschen (vorige Runde, schon 1:1) · Ozeanfarben ·
  Atmosphäre (`pow(rim, 1.8) * 0.22`, war bereits zeichengleich) · alle Lichter.
- **ENTFERNT:** unsere Glitzer-Formel · unser verschmolzenes Wasser-Tor · `rimPower 2.5`.

### [NAHT]

Die Kopie endet in `SURFACE_FRAGMENT_BODY` mit `gl_FragColor.rgb += rim;`. Ab dort beginnt
unsere Bühne: das Uniform `foamColor` wird vom Tag/Nacht-Zyklus geschrieben (`setOceanColors`),
was die Quelle nicht tut — sie baut die Welt pro Preset neu.

### [BEWEIS]

`globe.quellenProbe()` nach dem Bau: siehe Panel-Zeile „Source constants (Globe.ts)".

---

## 05q · Vorgabe: tinyskies ist führend · 30.8.

Georg, wörtlich: **„zukünftig bitte Warnung, falls unsere Arbeiten hier solche Konflikte auslösen —
im Zweifel stirbt ein Feature und wir denken uns etwas passendes aus! TS ist führend für uns, weil
es gut ist und funktioniert!"**

Das ist keine Notiz, sondern die Vorfahrtsregel für alles, was die Quelle auch hat. Operativ:

1. **Kollision wird GEMELDET, nicht geschlichtet.** Wenn eine KFB-Zutat und die Quelle sich
   widersprechen, ist das eine Meldung an Georg — nicht eine stille Anpassung „in der Mitte". Die
   Mitte war heute dreimal die schlechteste Stelle: halbe Sättigung, halber Schaum, halbe Kopie.
2. **Im Zweifel stirbt das Feature.** Nicht: es wird abgeschwächt. Heute so entschieden bei der
   Biom-Übertönung (Standard 0) und beim Kartenschatten (Standard aus, Regler bleibt) — beide waren
   unsere Zutaten, beide standen dem Vorbild im Weg.
3. **Und dann wird etwas Passendes erfunden**, statt die Lücke zu lassen. Für die Landfarbe war das
   der „dritte Weg": IHRE Regeln (Sättigung, Fleckenmuster, heller nach oben), UNSERE Farbtöne.
   Neun Farbwerte, Sättigung und Helligkeit unangetastet aus der Quelle.
4. **Jede bewusste Abweichung braucht ein Instrument, das sie ausspricht.** Sonst ist sie nach zwei
   Runden nicht mehr von einem Fehler zu unterscheiden — genau das ist mit `rimPower 2.5` und mit
   der abgedunkelten Palette passiert. Neu im Panel: `Land palette vs source` (Farbton darf
   abweichen, Sättigung und Helligkeit nicht) und `Source constants (Globe.ts)` (acht Konstanten,
   8/8).

> **Fehlerklasse, die diese Vorgabe verhindert: die stille Mitte.** Zwischen „Vorbild übernehmen"
> und „eigene Idee behalten" gibt es keinen Kompromiss, der beides erfüllt — es gibt nur ein
> Ergebnis, das keins von beidem ist. Heute dreimal bezahlt.

### Was die Vorgabe rückblickend umgestoßen hat

| unsere Zutat | Stand | warum |
|---|---|---|
| KFB-Landpalette (5 Höhenbänder) | **tot** | Struktur der Quelle übernommen (4 Grün + 3 warme Flecken + Berg + Schnee); KFB lebt als Farbton weiter, nicht als Palette |
| Biom-Übertönung 34 % | **tot** | zweites System für denselben Grundton; entsättigte das erste |
| Biom-Zonen als **Fleckenfarbe** | **NEU** (30.8., „lass uns das versuchen") | das „etwas Passendes ausdenken" aus Punkt 3 — siehe §05r |
| Kartenschatten | **aus** (Regler bleibt) | die Quelle hat im Flug keinen sichtbaren Schatten (Schattenkamera ±22 bei Radius 5) — war eine Zutat, kein Ersatz. ⚠ Beim ersten Anlauf nur der Modul-Standard geändert, während die Aufrufstelle `on: true` überschrieb — zwei Eigentümer, siehe §05s. Offene Schuld: die Höhenanzeige, die er ersetzte, ist noch nicht erfunden |
| Schaum in die Vertexfarbe gebacken | **tot** | die Quelle hat Schaum nur im Shader; doppelt aufgetragen = weißer Küstensaum |
| eigene Glitzer-Formel | **tot** | nachgerechnet statt kopiert (Regel 2) |
| `rimPower 2.5` | **tot** | 8,5 in der Quelle; der Unterschied war der graue Schleier über allem |
| Gischtfarbe (3 Tageszeiten) | **harmonisiert** | Farbton KFB, S und L aus der Quelle — §05t. Der Wasserkörper bleibt zeichengleich |
| Umfärb-Schwelle 0,012 statt Hex-Gleichheit | **bleibt** | die Quelle schreibt sonst je Bild 66 049 Vertices; Fehler der Quelle, kein Vorteil |
| Pixel-Deckel auf Partikelgrößen | **bleibt** | bewusste Abweichung MIT Begründung, in `github.md` dokumentiert — die Quelle hat hier einen Fehler, keinen Vorteil |
| Sättigungs-Abnahme (`SAT_KEEP`) | **bleibt, mit Ausnahme** | Schneeband (e>0.7) ausgenommen und ausgewiesen, wie in der Quelle |

---

## 05r · Die Zonen kommen zurück — als Fleckenfarbe, nicht als Übertönung

Georg, 30.8.: *„ja, lass uns das versuchen."* Ausgangslage: die Biom-Übertönung war tot (§05q), und
damit war die Gegend auf der Kugel nicht mehr ablesbar — ein echter Verlust, kein Ballast.

### Warum die alte Bauform nicht zu retten war

Sie mischte einen Grundton über die **ganze** Landmasse, luminanzgepinnt, 34 %. Das ist ein
**Mittelwert**, und ein Mittelwert über vier Töne nimmt Sättigung weg — genau die Größe, aus der das
Aussehen der Quelle besteht. Zwei Systeme, die beide den Grundton des Bodens bestimmen, sind eines
zuviel; und von den zwei war unseres das, welches das andere kaputt machte.

### Die Bauform der Quelle, für unseren Zweck erweitert

`Globe.ts` hat für dieselbe Aufgabe ein besseres Werkzeug: das **Fleckenmuster**. Rauschgesteuert
(`seed + 555`, Skala 4, Schwelle 0,2, Beimischung bis 0,6), nur auf den Tieflagen, und es lässt
zwischen den Flecken die Grundfarbe **stehen** — Unruhe statt Weichzeichner.

Erweiterung: **jede Zone erbt ihre eigene Dreiergruppe von Fleckenfarben.** Der Mechanismus bleibt
unangetastet der der Quelle. Was sich je Gegend ändert, ist ausschließlich der Farbton; Sättigung
und Helligkeit sind in allen zwölf Werten die der Quelle, auf drei Stellen genau.

| Zone | Zonenfarbe · Hue | Fleckengruppe | Hue im Bild¹ |
|---|---|---|---|
| plateau | `0x695628` · 42° | `0x9a7b30` `0xa88530` `0xb08828` | 34° |
| spires | `0x484b62` · 233° | `0x303c9a` `0x303ea8` `0x2838b0` | 237° |
| shatter | `0x375746` · 148° | `0x309a62` `0x30a868` `0x28b068` | 139° |
| flatwater | `0x695c2e` · 47° | `0x9a8330` `0xa88e30` `0xb09228` | 40° |

¹ Die letzte Spalte ist der Wert, den die Panel-Zeile **am gemalten Fleck** abliest — nicht der der
Zonenfarbe. Die 5–9° Unterschied entstehen beim Übertragen auf 8-Bit-Kanäle (Sättigung und
Helligkeit werden exakt gehalten, der Farbton nimmt die Rundung auf). Beide Zahlen sind richtig, sie
messen Verschiedenes: die dritte Spalte die ENTSCHEIDUNG, die vierte das ERGEBNIS. Sie stehen
nebeneinander, weil ich heute zweimal ein Dokument geschrieben habe, das eine andere Zahl behauptete
als der Build zeigte.

Die Zonengewichte sind weich, also wandert der Fleckenton über eine Grenze hinweg allmählich —
**eine Gegend hat keine Grenze, sie hat eine Mitte.**

### Warum es KEINEN Regler für „ein bisschen Zone" gibt

`spires` ist blau und springt 125° vom Grün weg. Ein Regler, der zwischen Quellen-Warmton und
Zonenton mischt, wäre §05q in Reinform: **eine RGB-Blende zwischen zwei weit entfernten Farbtönen
läuft durch Grau.** Bei 0,5 hätte dieser Regler exakt den Fehler wieder eingebaut, der heute dreimal
bezahlt wurde. Deshalb der volle Ton — und wenn eine Zone im Bild zu laut ist, wird die
**Zonenfarbe** geändert, nicht die Beimischung verdünnt.

⚠ **Ein bekannter Schwachpunkt, benannt statt verschwiegen:** `plateau` (42°) und `flatwater` (47°)
liegen fünf Grad auseinander — als Fleckenfarbe sind die beiden Zonen praktisch nicht zu
unterscheiden. Das ist der KFB-Kanon, nicht ein Fehler der Übernahme; wer die Zonen wirklich
ablesbar will, muss einer der beiden einen eigenen Ton geben. Gemessen in der Testwelt: 73 % der
Landfläche liegt bei 90–120° (Grundgrün), 15 % bei 60–90°, 8 % bei 30–60° — die Flecken sind da, die
blaue Zone kam in dieser Welt nicht vor.

### Der Wächter

`Land palette vs source` prüft jetzt **21 Werte** statt 9: die neun Landfarben plus die zwölf
Zonen-Fleckenfarben. Der Farbton darf abweichen (das ist der Zweck), Sättigung und Helligkeit nicht.
Stand: `✓ 21 slots · hue OURS by decision (max Δ 168°) · saturation & lightness = source (Δ 0 / 0)`.
*Ohne diese Zeile wäre „die Zonen sind bunt, aber nicht blass" eine Behauptung — und beim nächsten
Abdunkeln hätte niemand die Zonen als Ursache verdächtigt.*

---

## 05s · Zwei Nachträge der Abnahme — beide sind Fehlerklassen dieses Dokuments, an mir selbst

**PM · Ein Standard ist keine Einstellung, solange ein Aufruf ihn überschreibt.**
Ich habe `card-shadow.js` auf `on: false` gesetzt, Georg gemeldet „kein Schatten mehr — damit ist
der dunkle Keil weg", und es in **zwei Dokumente** geschrieben. Der Schatten war die ganze Zeit an:
`globe-poc.js:382` übergibt `params: { opacity: 0.30, on: true }`, und `card-shadow.js` macht
`Object.assign(defaults, opts.params)` — die Aufrufstelle gewinnt. Gemessen von der Abnahme:
`schatten.enabled = true`, Mesh `card-shadow` sichtbar.
Das ist die Zwei-Eigentümer-Klasse aus §05o, diesmal nicht in fremdem Code, sondern in meiner
eigenen Reparatur — **und der Schaden ist größer als der Defekt:** eine falsche Meldung an Georg und
zwei Dokumente, die einen Zustand beschreiben, den der Build nicht hat.
> **Regel daraus: wer einen Standard ändert, muss die Aufrufstellen zählen — und wer eine Änderung
> MELDET, muss den Wert am laufenden Build gelesen haben, nicht in der Datei, die er editiert hat.**
> Das ist Regel 3 aus `use-what-works* („erst sehen, dann melden") auf Zahlen angewendet.

**PM · Eine Abnahme, die nichts druckt, liest sich wie eine, die bestanden hat.**
Die Schnee-Ausnahme (§05o-Nachtrag) sollte ablesbar machen, dass das Band `e > 0.7` von `SAT_KEEP`
befreit ist. In einer Welt ohne Gipfel über 0,7 gibt `stat([])` aber `null` zurück — die Zeile fiel
komplett aus. Die Ausnahme galt, und **niemand konnte es sehen.** Jetzt druckt sie
`0 % of land · exemption idle`.
> **Regel daraus: ein leerer Eimer ist ein Ergebnis.** Eine Abnahme muss sagen, dass sie nichts zu
> sagen hat — Schweigen ist von Zustimmung nicht zu unterscheiden.

---

## 05t · Die Gischt harmonisiert — und ein Modul, das ich „erfunden" habe, stand schon in der Quelle

Georg, 30.8., zum Sonnenuntergangsbild: *„kommen die orangen wellen von uns? → sieht ganz
interessant aus - aber könnte zur farbpalette harmonisiert werden..?"*

### Erst die Herkunft: nein, sie kommen nicht von uns

`SkyPresets.ts:130–132` · Sonnenuntergang: `oceanShallow 0x5a4a98` · `oceanDeep 0x302868` ·
**`oceanFoam 0xff9944`**. Alle drei Ozean-Tripel waren bei uns **zeichengleich** mit der Quelle, in
allen drei Tageszeiten. Die orangen Wellen sind die Gischt der Quelle bei ihrem eigenen
Abendlicht.

### Und ein unbequemer Nebenbefund

`Globe.setOceanColors(shallow, deep, foam)` **existiert in der Quelle** — `Globe.ts` 5329–5338,
gerufen aus `Game.ts:6274` bei jedem Preset-Wechsel, mit Früh-Ausstieg bei Gleichheit. Das ist
dasselbe Modul, unter demselben Namen, das ich am 30.8. als eigene Reparatur gebaut und in §05o als
„die Quelle macht es anders" beschrieben habe. Sie macht es nicht anders — **sie macht es genau so,
und ich habe die Stelle nicht gesucht, weil ich schon eine Lösung hatte.**

> **Fehlerklasse: die Quelle nach dem Bau lesen.** Ich hatte den Feldkommentar
> (`vertexOceanDepth … for day/night ocean recolor`) als Hinweis benutzt und daraus die Bauform
> abgeleitet — statt nach dem Setter zu suchen, den der Kommentar ankündigt. Das Ergebnis war
> zufällig richtig, und genau das ist das Problem: eine Ableitung, die zufällig stimmt, ist von
> einer Kopie nicht zu unterscheiden, bis sie einmal nicht stimmt.
> Die eine echte Abweichung dort ist **bewusst und bleibt:** wir färben ab einer Schwelle von
> 0,012 (linear) um, die Quelle bei exakter Hex-Ungleichheit. Bei laufender Blende schreibt sie
> damit praktisch **jedes Bild 66 049 Vertices** neu. Das ist ein Fehler der Quelle, kein Vorteil —
> derselbe Fall wie der Pixel-Deckel auf den Partikelgrößen (§05q).

### Harmonisiert nach der Regel, die schon steht

Kein neues Verfahren: derselbe „dritte Weg" wie beim Land (§05q). **Farbton KFB, Sättigung und
Helligkeit exakt aus der Quelle** — die Gischt bleibt damit genau so kräftig und genau so hell wie
dort, nur ihre Familie ist unsere.

| Tageszeit | Quelle | jetzt | Farbton |
|---|---|---|---|
| day | `0xb3ffff` Cyan | `0xfffab3` **Creme** | firn 53° — das Papier der Karten |
| sunset | `0xff9944` Orange | `0xffd144` **Gold** | strand 45° — der Ton der Wortmarke |
| night | `0x2050aa` Marine | `0x2030aa` | spires 233° — 11° von der Quelle, die kalte KFB-Zone |

Sättigung und Helligkeit: Δ 0,00 in allen drei Fällen, nachgerechnet.

**Der Wasserkörper selbst ist unangetastet** und weiter zeichengleich. Das war Absicht: Georg hat
nach den Wellen gefragt, nicht nach dem Wasser. Eine Frage über die Gischt ist kein Auftrag für den
Ozean.

### Zwei Defekte in der Abnahme dieser Runde — beide in den Instrumenten, nicht in den Farben

**PM · Ein falscher Schlüssel hat sich als Farbdrift ausgegeben.** Der neue Wächter fragte
`getSkyPreset('sunset')` — die QUELLE nennt ihr Abend-Preset so, **unsere Tageszeit heißt
`evening`** (`TIMES_OF_DAY`). Der Aufruf gab `undefined`, und der Vergleich lief gegen das
TAG-Preset. Gemeldet wurde `✗ sunset.oceanFoam drifted · Δ 0.234 / 0.196` — **der Wächter war rot,
die Palette war richtig.**
> **Regel: ein Instrument darf seine eigene Blindstelle nie in die Maßeinheit des Messwerts
> übersetzen.** Ein fehlender Schlüssel als „Farbabweichung 0,234" ist eine Lüge in der Sprache, der
> man am meisten glaubt: in Zahlen. Der Wächter meldet jetzt `✗ MISSING KEY: …` und holt seine
> Namensliste aus `TIMES_OF_DAY` statt aus einer getippten Kopie — eine zweite Namensliste neben
> einer vorhandenen ist die Zwei-Eigentümer-Klasse in Textform.
> Und die schwerere Hälfte: **ein Wächter, der dauerhaft ✗ meldet, ist schlimmer als keiner.** Er
> erzieht dazu, ihn zu überlesen, und dann fängt er den echten Fall nicht mehr.

**PM · Eine Anzeige hat ihre eigene Ausnahme in ihr Textfeld geschrieben.** Die Zonen-Zeile fragte
eine Variable `biom` im Runner ab, die es dort nicht gibt, und stand im Panel als
`⚠ biom is not defined`. Sie holt ihre Zahlen jetzt aus `globe.zonenFarben` — von dort, wo die
Werte liegen.
> Aufgefallen ist beides beim **Lesen der Zeile im laufenden Bild**, nicht beim Schreiben. Das ist
> §05s zum zweiten Mal am selben Tag, und deshalb steht es hier noch einmal: **wer ein Instrument
> baut, muss es ablesen, bevor er sein Ergebnis meldet.**

### Der Wächter

Neu im Panel: **`Ocean palette vs source`** — prüft alle **neun** Ozeanwerte (drei Tageszeiten ×
Flachwasser/Tiefe/Gischt), nicht nur die drei geänderten. Farbton darf abweichen, Sättigung und
Helligkeit nicht. Gemessen über alle drei Tageszeiten, und zwar am **Shader-Uniform**, nicht an der
Preset-Tabelle: day `#fffab3` · sunset `#ffd144` · night `#2030aa`, jeweils identisch mit Preset
UND mit der zuletzt gemalten Vertexfarbe.

---

## 05u · Slice H „Weltstimmungen" — verdant · molten · frost · bone

Georg, 30.8.: *„dann: Weltstimmungen"*. Gebaut auf dem Boden, der eine Stunde vorher gegen die
Quelle geprüft wurde — das war der günstigste Moment, an Farben zu drehen, und er ist genutzt.

### Die eine Regel, aus der alles folgt

**Eine Stimmung liefert FARBTÖNE, nichts anderes.** Sättigung und Helligkeit kommen in jedem Fall
aus den Werten der Quelle. Das ist keine Sparmaßnahme, sondern die Lehre des Tages in einer Zeile:
**das Verwaschene war nie eine Farbe, es war Sättigung** (Land 0,21 gegen 0,63). Eine Stimmung, die
an der Sättigung drehen darf, kann diesen Fehler wieder einbauen — viermal, an vier Orten, jeder mit
eigener Begründung.

`frost` und `bone` sind genau die zwei, die dazu verführen: „frostig" und „knochig" klingen nach
blass. Sie sind hier nicht blass, sie sind **kalt** bzw. **dürr** — und das ist ein Farbton, kein
Fehlen.

### Vier Eingänge, keiner neu erfunden

| Eingang | woher | seit |
|---|---|---|
| Atmosphäre: Verlauf, Nebel, Hüllenglut | `zyklus.setHimmelTon` (Modifikator) | H |
| Landpalette (4 Grundtöne + Berg + Schnee) | `globe.setStimmung` | H (neu) |
| Zonen-Fleckenfarben (4 × 3) | `globe.setStimmung` | §05r |
| Ozean, Flachwasser und Tiefe | `globe.setWasserTon` → `setOceanColors` (ein Schreiber) | §05o |
| Spuren: Band und Driftstaub | `trail.setTint` · `rauch.setTint` | D und F |

**Nicht angefasst:** der Himmel (gehört dem Tag/Nacht-Zyklus — eine Stimmung, die ihm
hineinschreibt, wäre der zweite Schreiber auf derselben Eigenschaft) und die **Gischt**. Letzteres
ist die Kategorienregel vom selben Tag: *Gischt ist Licht auf Wasser, kein Material.* Eine
molten-Welt hat heißes Land und heißes Licht, aber ihre Brandung bleibt Brandung. Gemessen über alle
vier Stimmungen: `#b3ffff`, unverändert.

### Umfärben statt neu bauen — zwei Zahlen je Vertex

Dieselbe Bauform wie beim Ozean: **Höhe** und **Fleckenwert** liegen als `Float32Array` je Vertex
(`elevs`, `patchVals`). Beide sind Rauschergebnisse, und *ein Wert, der aus Rauschen kommt, wird
gespeichert, nicht wiederholt* — eine Wiederholung ist nicht nur teuer, sie ist auch nicht garantiert
dasselbe Ergebnis.

Und die Landfarbe ist **eine Funktion mit zwei Aufrufern** (`landFarbe`): Bäcker und
`setStimmung()` müssen bitgleich rechnen, sonst sieht die Welt nach einer Umschaltung anders aus
als nach einem Neuladen — und niemand findet das, weil beide „richtig" aussehen. Zwei-Eigentümer,
diesmal **vorab vermieden statt hinterher bezahlt.**

### Das Tor · durchfallbar, gemessen

Für jede Stimmung wird angelegt, die Landsättigung gemessen (Median, ohne Schnee) und mit `verdant`
verglichen. Unter 90 % ist ein Rückfall — egal wie gut es aussieht.

| Stimmung | Landfarbton | Sättigung | vs verdant |
|---|---|---|---|
| verdant | 99° | 0,387 | 100 % |
| molten | 18° | 0,415 | 107 % |
| frost | 196° | 0,416 | 107 % |
| bone | 44° | 0,417 | 108 % |

**`Mood gate ✓ 4/4`**, am laufenden Bild abgelesen. Der Prüfstand stellt danach den
Ausgangszustand wieder her: *ein Prüfstand, der die Welt verändert zurücklässt, ist ein Eingriff,
kein Messgerät.*

### PM · Ein Register, das unbekannte Schlüssel ignoriert, ist ein Tippfehler-Verstecker

Die Stimmungs-Auswahl war zuerst **unsichtbar**. Ich hatte `kind: 'select'` geschrieben; das Panel
kennt `slider · toggle · seg · button · info · keys · note`. Die Zeile fiel durch
`if (make) body.appendChild(make(r))` — **lautlos: kein Fehler, keine Warnung, kein Eintrag.**
Ohne das Ablesen des Panels hätte ich ein Feature gemeldet, das nicht existierte.
> **Behoben an der Ursache, nicht am Symptom:** unbekannte Zeilenarten rendern jetzt
> `✗ unknown row kind "select" — known: …`. Ein stiller Fallback in einem Register ist derselbe
> Fehler wie eine Abnahme, die nichts druckt (§05t): **Schweigen ist von Erfolg nicht zu
> unterscheiden.**
> Das ist die vierte stille Fehlerklasse dieses Tages. Alle vier hatten dieselbe Form: eine Stelle,
> an der ein Fehler in *nichts* übersetzt wurde statt in eine Meldung.

### PM · Ich habe die Regel in den Kommentar geschrieben und zwei Zeilen später gebrochen

Die erste Fassung von `stimmungSetzen()` rief `globe.setOceanColors()` **selbst** — während der
Tag/Nacht-Zyklus dieselbe Funktion aus seiner Schleife ruft, mit den ungedrehten Preset-Werten.
Zwei Schreiber auf einer Eigenschaft, und der Zyklus gewinnt nach **einem Tick**.

Gemessen von der Abnahme: Stimmung `frost` anlegen → `#2a94a0`. Ein `zyklus.update(0.2)` später →
`#2a8ca0`, der reine Preset-Wert. Nach zwei Sekunden Laufzeit unverändert, während `globe.stimmung`
weiter `frost` meldete. **Der Zustand log, und bei laufender Uhr — der Standardeinstellung — war
die Wasserfarbe der Stimmung nie sichtbar.** Einer von vier dokumentierten Eingängen war tot, und
das Dokument behauptete ihn.

Und der Kommentar direkt über dem Aufruf lautete:
*„Wasser und Gischt bleiben unberührt — die haben ihren eigenen Eigentümer, und zwei Schreiber auf
einer Eigenschaft ist die Klasse, die dieses Projekt am häufigsten bezahlt hat."*

> **Eine Regel im Kommentar zu haben und zwei Zeilen später zu brechen, ist schlechter als sie nicht
> zu kennen — sie beruhigt beim Lesen.** Genau dafür ist sie da, und genau deshalb hat sie hier
> geschadet: ich habe den Absatz geschrieben, mich richtig gefühlt und weitergetippt.

**Behoben als EIN Eigentümer, nicht als Reihenfolge.** Die Stimmung schreibt nicht mehr; sie setzt
einen Modifikator (`globe.setWasserTon(grad)`). Der Zyklus bleibt der einzige Aufrufer von
`setOceanColors`, `globe` hält den letzten Eingang (`ozeanEingang`) und dreht **innen**, an einer
Stelle. Eine Stimmungsumschaltung malt mit dem gespeicherten Eingang neu und braucht den Zyklus
nicht. *Ein Wettlauf wird nicht durch bessere Reihenfolge gelöst, sondern durch einen Eigentümer.*

Gemessen nachher: frost anlegen → `#4a9098` · zwei Ticks → `#4a8f97` (folgt der Blende, behält
die Drehung) · zwei Sekunden Laufzeit → unverändert.

### PM · Die Abnahme war in BEIDE Richtungen blind

`Ocean follows preset` verglich die gemalte Farbe mit `zyklus.preset.oceanShallow` — dem **rohen**
Preset. Sobald eine Stimmung dreht, ist das der falsche Bezugspunkt: die Zeile meldete ✓ mit und
ohne Stimmung. Sie hat weder die Drehung als Abweichung gemeldet (richtig) noch ihr Verschwinden
(falsch) — sie hat gar nichts gemessen.
> **Eine Abnahme braucht den SOLL-Wert, nicht einen Nachbarwert.** Jetzt vergleicht sie gegen
> `globe.ozeanSoll()` (Preset **plus** Stimmungsdrehung) und weist die Drehung zusätzlich aus:
> `mood tint live, 66° off preset`. Steht eine Stimmung an, ohne dass das Wasser messbar abweicht,
> meldet sie ⚠ — eine Stimmung, die nichts tut, ist sonst nicht von einer wirksamen zu
> unterscheiden.

### PM · Und der neue Wächter maß das falsche Paar

Die reparierte Zeile fragte: *„weicht das Wasser vom rohen Preset ab?"* — und meldete im
**Startzustand ✗**, für eine korrekt arbeitende Stimmung. Grund: `verdant` gibt dem Wasser 191°, das
Tag-Preset hat 190,2°. Die Drehung ist richtig und praktisch unsichtbar, also sah der Wächter „keine
Wirkung" und schlug Alarm.

Das ist die Falle aus §05t, eine Runde später als Standardzustand ausgeliefert. Aber der
Fehlalarm ist nicht das Schlimmste: **die alte Frage konnte „von einem zweiten Schreiber
überschrieben" nicht von „Stimmungston fällt mit dem Preset zusammen" unterscheiden.** Sie hätte
den Fehler, für den sie gebaut wurde, genau dort verpasst, wo er wie ein Zufall aussieht.

> **Ein Instrument muss das Paar messen, um das es geht.** Jetzt: **gemalter Farbton gegen den
> Farbton der STIMMUNG** (`≤1,5°`). Wird die Drehung überschrieben, springt der gemalte Ton auf den
> Preset-Ton — gemessen sind das 15° (day/molten), 4–6° (day/frost, day/bone), 48–66° (evening),
> 15–34° (night). Laut genug.
> Und die eine ehrliche Einschränkung steht **in der Zeile**, nicht als Warnung getarnt: bei
> day+verdant liegen Preset- und Stimmungston 1° auseinander, dort kann kein Test „angewendet" von
> „überschrieben" trennen — und es gibt auch keinen sichtbaren Unterschied.

Gerechnet über alle **zwölf** Kombinationen (4 Stimmungen × 3 Tageszeiten): **12/12 grün**,
`dTiefe` und `dSchaum` je 0,000, Farbton-Abweichung zur Stimmung 0,0–0,4°.

**Nebenbefund derselben Klasse:** `window.__globe && (window.__globe.stimmungSetzen = …)` stand
300 Zeilen VOR der Erzeugung von `window.__globe`. Der Wächter kurzschloss, der Haken wurde nie
gesetzt, kein Hinweis. `a && (a.b = c)` ist die kürzeste Schreibweise für **„tu nichts und sag es
nicht"**.

### Offen

- Die Stimmung wirkt auf Land, Zonen, Wasser und Spuren — **nicht auf Himmel und Licht.** Für
  `molten` wäre ein wärmeres Preset naheliegend, aber das ist ein Eingriff in den Zyklus und
  braucht eine eigene Entscheidung (zwei Schreiber).
- `plateau` (42°) und `flatwater` (47°) bleiben in jeder Stimmung schwer unterscheidbar — der
  Schwachpunkt aus §05r wandert mit.

---

## 05v · Wasser auf Bergen — eine Farbheuristik, die durch unsere eigene Erweiterung ungültig wurde

Georg, 30.8., am Bild: *„da ist teilweise wasser & wellen auf bergen/hügeln…?"* — Schaumtupfen und
orange Kontourlinien auf den grünen Hügeln.

### Die Ursache, gemessen

Das Außentor des Wasser-Zweigs war die **Farbprüfung der Quelle**:
`if (vColor.b > vColor.r + vColor.g * 0.5)`. Wie viele LAND-Vertices sie bestehen, je Stimmung:

| Stimmung | Land besteht das Farbtor | Anteil der Landmasse |
|---|---|---|
| verdant | 151 | 1,3 % |
| molten | 0 | 0 % |
| **frost** | **11 447** | **100 %** |
| bone | 0 | 0 % |

Bei `frost` liegt der Landton auf 196° — blaugrün. Damit besteht **die ganze Insel** die Prüfung,
und der komplette Wasser-Zweig (Schaum, Kontourlinien, Glitzern) läuft über Berge. Die 1,3 % bei
`verdant` sind die `spires`-Zone, die schon immer blaustichig war — das waren die einzelnen
Tupfen, die auch ohne Stimmung zu sehen waren.

### Wer hier den Fehler gemacht hat, und wer nicht

**Die Quelle hat diesen Fehler nicht** — ihr Land ist immer grün, ihre Heuristik ist dort gültig.
Ungültig wurde sie durch **unsere** Erweiterung: Slice H dreht den Farbton des Landes, und damit
verliert eine Prüfung, die aus der Farbe auf die Bedeutung schließt, ihre Grundlage.

> **Und dieses Projekt hatte die Falle schon einmal aufgeschrieben** — in `light-budget.js`, beim
> Landmasken-Befund: *„Eine Farbheuristik wäre der nächste Fehler derselben Art: das Biom `spires`
> ist selbst blaustichig und würde als Wasser gezählt. Wer raten muss, hat den falschen Ort
> gefragt."* Dieselbe Diagnose, dieselbe Lösung — nur diesmal im Shader statt im Messgerät. Ich habe
> den Absatz selbst geschrieben und die Kopie zwei Wochen später mit genau diesem Muster übernommen.
> *Eine Fehlerklasse zu kennen schützt nicht davor, sie in einer Kopie zu importieren.*

### Behoben am richtigen Ort

Das Außentor ist jetzt `vOceanDepth > 0.0`, die Kontour-Bedingung innen nur noch
`vOceanDepth < 1.0` — Struktur der Quelle, aber mit dem **DATEN-Tor** statt dem Farb-Tor. Die
Wassertiefe liegt als Attribut bereit: 0 auf Land, ≥ 0,001 auf Wasser, geschrieben vom Bäcker, der
Land oder Wasser sowieso entscheidet.

**Eine bewusste Abweichung von der Quelle, nach §05q gemeldet statt geschlichtet.** Sie steht an
drei Orten ablesbar:
- im Dateikopf von `globe.js`, mit Grund und Messung
- in `quellenProbe()` als eigene Zeile: `✓ water gate = depth (ours, not source colour heuristic)`
  — die Erwartung ist umgestellt, damit die Abnahme eine gewollte Abweichung nicht als Fehler
  meldet (das erzieht zum Überlesen) und sie auch nicht verschweigt
- als neue Panel-Zeile **`Water gate (depth, not colour)`** mit zwei durchfallbaren Zahlen: die
  Invariante (`land=0, water>0` für JEDEN Vertex) und die Zahl der Land-Vertices, die das alte
  Farbtor bestehen würden. Gemessen: Invariante ✓ in allen vier Stimmungen.

*Die zweite Zahl ist der Beweis für die Abweichung — nicht der Satz darüber.*

### Dritte Fassung desselben Tors: die Tiefe war richtig gedacht und falsch skaliert

Georg, kurz darauf, wieder am Bild: *„das scheint immer noch zu hoch zu sitzen mit den
polygonen…?"* — Wasser lief weiter über Küstenhügel, **obwohl das Daten-Tor stand.** Zuerst geprüft,
was bei ihm läuft, statt zu vermuten: `torDaten: true, torFarbe: false`. Der Build hatte die
Änderung, der Fehler war ein anderer.

**Ursache: Interpolation.** Ein Varying wird über das DREIECK interpoliert. Land trägt
`oceanDepth = 0`, Flachwasser `Math.max(0.001, depth)` — **die beiden liegen numerisch fast
aufeinander.** Jedes Dreieck mit einer Wasser- und zwei Landecken hat damit über fast seiner ganzen
Fläche einen Wert > 0, und der Shader hält sie für Wasser. Eine höhere Schwelle wäre keine Lösung:
dann fiele echtes Flachwasser mit heraus, das genau dort auch bei 0,001 liegt.

> **Ein Tor, dessen zwei Antworten 0 und 0,001 heißen, ist kein Tor, sondern eine Rundung.**
> Behoben mit einem Wert, der den vollen Bereich hat: `landFlag`, 1 auf Land, 0 auf Wasser. Bei
> `vLand < 0.5` schneidet die Interpolation exakt in der geometrischen Mitte des Küstendreiecks,
> statt über seine ganze Fläche zu bluten.

Und warum es so groß zu sehen war: bei Kameradistanz **0,52** über einer Kugel mit Radius **5** ist
ein einzelnes Terrain-Dreieck bildschirmfüllend. *Ein Fehler von der Größe eines Dreiecks ist nicht
klein, wenn die Kamera einen Meter über dem Boden hängt.*

### PM · Der Name war falsch, während die Prüfung stimmte

Die Zeile in `quellenProbe()` hieß nach dem Umbau weiter **`water gate = depth`**, obwohl das Tor
längst auf dem Land-Bit lief. Die BEDINGUNG war richtig (sie testete `vLand < 0.5`, deshalb stand
sie auf ✓) — nur der Name war alt. Und dieselbe Stelle noch einmal in der Nachbarzeile
(„this is why the gate is depth-based").

Ursache: mein globales Ersetzen von `if (vOceanDepth > 0.0) {` traf auch den **Prüfstring** in
`quellenProbe`; die spätere Umbenennung fand ihr Muster deshalb nicht mehr — und literales
Ersetzen ohne Treffer meldet nichts. Dieselbe stille Klasse wie beim `mischGrad`-Arrow.

> **Ein Instrument, das seinen eigenen Gegenstand falsch benennt, ist schlimmer als eines, das
> schweigt** — es schickt den nächsten Leser an eine Stelle im Code, die es nicht gibt. In einem
> Projekt, dessen Regel lautet „Instrumente lügen nicht", ist der Name Teil der Messung.
> **Wer einen Mechanismus umbenennt, muss seine Erwähnungen zählen, nicht seine Definition ändern.**

Am laufenden Panel nachgelesen, nicht in der Datei:
`✓ water gate = land bit (ours, not source colour heuristic) 1` · alte Namen im Panel: **0**.

### Vierte Fassung — und die Ursache war nie der Shader, sondern die GEOMETRIE

Georg: *„bitte nochmal checken, ob wir für die Küste mit den obersten Polygonen nicht falsch
interpretieren bauen → bitte nochmal beim Original checken."* Genau die richtige Frage, und die
Antwort liegt in einer Zeile unseres eigenen Codes.

`terrain-surface.js:58` lautete:
`surfaceDisplacementFromValue = zoneBlend(nx, ny, nz, rawDisplacementFromValue(...))`

`rawDisplacementFromValue` gibt für Wasser immer `-OCEAN_DEPTH * depth`, also **≤ 0**. Eine
positive Wasserhöhe kann damit rechnerisch **nur** aus `zoneBlend` kommen — und `zoneBlend` ist
die KFB-Bauplatz-Planierung (v3 · S3a), **unsere Zutat**, die `TerrainSurface.ts` nicht hat. Sie
wurde auf JEDEN Vertex angewandt, ohne zu fragen, ob er Land oder Wasser ist.

Gemessen am fertigen Netz (Radius 5, 256 Segmente):

| | vorher | nachher |
|---|---|---|
| Wasser-Vertices über der Kugeloberfläche | **365** (0,9 %) | **0** |
| höchster Wasser-Vertex | **+0,1207** | **0** |
| Wasser-Vertices ganz von Land eingeschlossen | 19, höchster bei +0,1014 (Landnachbarn ⌀ +0,0994) | 0 |

**Die Bildfolge, Schritt für Schritt:** so ein Vertex trägt `landFlag = 0`, also läuft die halbe
Raute um ihn durch den Wasser-Zweig. Und `oceanDepth` klemmt auf **0,001**, weil die Verschiebung
positiv ist — `depthFade` wird dadurch **1,0**, und die Kontour-Gischt malt bei **voller
Helligkeit**. Auf einen Berg.

> Das Land-Bit hat das großflächige Bluten behoben. **Einen Vertex, der wirklich als Wasser auf
> Kuppenhöhe klassifiziert ist, kann kein Tor retten** — vier Fassungen an einem Tor, und die
> Ursache lag drei Module weiter.
> Zwei Lehren, beide teuer bezahlt:
> **1. Wer viermal am selben Tor baut, sucht an der falschen Stelle.** Nach der zweiten Fassung
> hätte die Frage lauten müssen „kann ein Wasser-Vertex überhaupt oben liegen?" statt „wie
> unterscheide ich Wasser von Land?".
> **2. Ein Messwert, der bei falscher Eingabe seinen günstigsten Wert annimmt, verdeckt den Fehler
> doppelt.** `Math.max(0.001, …)` machte aus „unmöglicher Zustand" ein „flachstmögliches Wasser" —
> und flachstes Wasser ist genau der Zustand mit der HELLSTEN Gischt.

Behoben nach §05q — **unsere Seite gibt nach:** `zoneBlend` planiert nur noch Land. Ein Bauplatz im
Meer ist auch inhaltlich keiner. Neue durchfallbare Zahl in der Panel-Zeile:
`water below sea level (ok)`; bei Bruch nennt sie die Anzahl und das Maximum und benennt die
Planierung als Ursache.

Dazu, vom Verifier gefunden und in derselben Runde behoben: die Zeile `Sky follows mood` meldete
außerhalb der Atmosphäre `gradient hue span 0° of 0° authored (100 %)` — **0 von 0 ist kein
Erfolg.** Sie sagt jetzt `idle`, wie die SNOW-BAND-Zeile.

Drei Fassungen für ein Tor — Farbheuristik (Quelle) → Wassertiefe → Land-Bit. Die Abnahme prüft
jetzt beides: dass das Bit mit der Maske übereinstimmt (`flagBruch 0`) UND dass Land `oceanDepth = 0`
trägt. Gemessen: 0 Brüche in allen Stimmungen; bei `frost` bestehen **45 743** Land-Vertices das
alte Farbtor.

---

## 05w · Fake-AO und Objekt-Rim — die zwei billigsten Dinge der Quelle, die wir nicht hatten

Georg, 30.8.: *„top! dann jetzt wie von dir vorgeschlagen."*

### Was übernommen wurde, wörtlich

`Globe.ts` legt auf jedes prozedural gebaute Objekt zwei Dinge, die zusammen den größten Teil
seiner Plastizität tragen:

| | Formel der Quelle | volle Helligkeit ab |
|---|---|---|
| Baum | `lerp(0.10, 1.0, min(1, t * 2.0))` | 50 % Höhe |
| Fels | `lerp(0.15, 1.0, min(1, py / (sy * 0.7)))` | 70 % Höhe |
| Haus | `lerp(0.15, 1.0, min(1, y / 0.5))` | 50 % Höhe |
| Rim | `addRimLight(mat, …, 0.7 / 0.5, 3.0)` | — |

Gemessen nach dem Bau: **32 Materialien lesen Vertexfarben, 32 Meshes tragen gebackenes AO,
AO-Spanne 0,10–1,00** — der Baum-Boden der Quelle auf zwei Stellen.

### Warum das hier MEHR wiegt als dort

Unsere Props werfen keinen Schatten (der Kartenschatten ist aus, §05q — die Quelle hat im Flug
auch keinen sichtbaren). **Ein Objekt ohne Schatten UND ohne dunklen Fuß sitzt nicht auf dem Boden,
es liegt darauf.** Das AO ersetzt den Schatten nicht, es macht ihn entbehrlich: die Verdunkelung
sitzt am OBJEKT, nicht auf dem Untergrund — und kann deshalb per Konstruktion keine Polygonkanten
erzeugen, also genau den Defekt nicht haben, den unser gemalter Fleck hatte.

Der Rim gibt die Gegenrichtung: eine helle Kante gegen den Himmel, die eine Silhouette lesbar macht,
ohne die Fläche aufzuhellen. Seine FARBE kommt aus `globalRimColor`, dem geteilten Fresnel-Ton, den
der Tag/Nacht-Zyklus führt (`RimLight.ts`: *„Shared Fresnel tint for all addRimLight meshes"*) — ein
Objekt-Rim mit eigener Farbe wäre ein zweiter Schreiber für die Tageszeit.

> **Plastizität ist ein Verhältnis von Fuß zu Kante, nicht eine Menge Licht.** Das ist die Antwort
> auf die Frage, die diesen Tag angefangen hat („warum sieht tinyskies besser aus?") — und sie
> kostete zwei Formeln, keine Beleuchtung.

### Naht

Die Quelle baut ihre Props selbst und kennt `sy` (die Bauhöhe) direkt. Unsere sind GLB-Modelle, die
Höhe kommt aus `propBox` — der gemeinsamen Box **aller Teile** eines Props. Das ist die Naht und sie
ist wichtig: je Teil gerechnet würde der Kronenboden eines Baums so dunkel wie der Stammfuß.

### PM · Ein bedingter Fallback, der dreimal zugeschlagen hat

Mein Import-Fix war `if (!m.includes(...)) m = replaceText(m, 'import {', neuerImport + 'import {')`
— und `replaceText` ersetzt **jedes** Vorkommen. Die Datei hatte drei `import {`-Zeilen, also stand
der Import dreimal drin: `Uncaught SyntaxError: Identifier 'initRimLight' has already been declared`,
und die ganze Szene war weg.
> **Ein Fallback, der ein Muster benutzt, das mehrfach vorkommt, ist kein Fallback, sondern eine
> Vervielfältigung.** Zwei Runden vorher hat mich dasselbe Werkzeug in die andere Richtung
> erwischt (kein Treffer, keine Meldung, §05u). *Dasselbe Werkzeug, zwei entgegengesetzte
> Fehlerarten — und beide melden nichts.*

### Abnahme

Neue Panel-Zeile **`Prop AO + rim (Globe.ts)`**: zählt Materialien mit gelesenen Vertexfarben,
Meshes mit Farb-Attribut und nennt die AO-Spanne. Ist die Spanne 1–1, wurde nichts verdunkelt und
die Zeile meldet ⚠. *Sie zählt die Leser, nicht die Werte* — die Lehre aus Slice D.

## 06b · Zwei Messungen an der Quelle (30.8.) — beide widerlegen die Annahme

### R1 · „tinyskies arbeitet ohne Schatten, glaube ich… oder?" — **Nein, umgekehrt.**

Gemessen in `dannylimanseta/tinyskies`, 96 Fundstellen:

```
Game.ts:1141   renderer.shadowMap.enabled = !this.mobile
Game.ts:1142   renderer.shadowMap.type    = VSMShadowMap
Game.ts:1165   sunLight.castShadow        = true
Globe.ts:631   surfaceMesh.receiveShadow  = true
CarpetMesh:119 mesh.castShadow = true · receiveShadow = true
```
Dazu `castShadow = true` auf praktisch allem: Bäumen (instanziert), Windmühlen, Observatorium,
Stonehenge, Schrein, Leuchtturm, Pilzen, Gremlins, Vulkan, Booten, Doppeldecker.

**tinyskies hat also einen echten Shadow Map — abgeschaltet nur auf Mobilgeräten.** Unser
`card-shadow.js` malt stattdessen einen projizierten Fleck, weil wir keinen haben. Das war nie eine
Stiltreue-Entscheidung, sondern ein Ersatz — und er ist der Grund für die Eck-Artefakte, wegen
derer er ausgeschaltet war.

⚠ **Damit ist R1 keine Geschmacksfrage mehr, sondern eine Architekturfrage**, und sie gehört auf
den Masterplan statt in eine Deckkraft:
- **(a) Echter Shadow Map wie die Quelle.** VSM, ein castender Direktionallicht, Terrain empfängt.
  Kosten: eine zweite Renderpass über 66 049 Terrain-Vertices und 776 Props. Messbar gegen die
  Basislinie (121 Draw-Calls, 12,3 ms) — und `light-budget` hat den Apparat, um es abzunehmen.
- **(b) Fleck behalten**, Artefakte in Kauf nehmen, Deckkraft nach Augenmaß.
- **(c) Fleck behalten, aber nur unter dem AVATAR** (nicht unter Props) — dort ist er ein
  Höhenmesser und kein Schattenwurf, und ein Höhenmesser darf idealisiert sein.
**Mein Vorschlag: (a) messen, (c) als Rückweg.** Kein Bau vor der Messung.

### R3 · „Was funktioniert bei tinyskies?" — **kein FX-Matrix. Eine COMBO.**

tinyskies hat **keine Würfel und keine sechs Effekte.** Es hat **einen** Pickup-Typ und holt die
Tiefe aus der Verkettung:

```
Rings.ts    DIAMOND_COUNT_CARPET 15 · DIAMOND_SIZE 0.09 · DIAMOND_XP 10
            DIAMOND_BOB_LIFT 0.012 · DIAMOND_BOB_AMP 0.017
Carpet.ts   DIAMOND_BOOST_SPEED 1.22 · DIAMOND_BOOST_DURATION_SEC 1.7
Boat.ts     DIAMOND_BOOST_SPEED 0.58 · DIAMOND_BOOST_DURATION_SEC 3.0   ← je Fahrzeug anders
Game.ts     DIAMOND_COMBO_WINDOW_MS 900 · COMBO_MAX_STEPS 5
            COMBO_RATE_PER_STEP 0.028 · COMBO_XP_PER_STEP 0.05
Game.ts     DIAMOND_SFX_IDS = [ … ]        ← eine LISTE, nicht eine Datei
RingCollect DIAMOND_COLOR [0.2, 1.0, 0.8]
```

**Drei Befunde, die Georgs „explorativ arbeiten" eine Richtung geben:**

1. **Die Tiefe kommt aus der KETTE, nicht aus der Vielfalt.** 900 ms Fenster, bis zu fünf Stufen,
   je Stufe +0,028 Tempo und +0,05 XP. Ein Pickup, aber fünf mögliche Zustände — und der Spieler
   erzeugt sie selbst. **Sechs verschiedene FX wären sechs Einzelereignisse; eine Combo ist ein
   Bogen.** Für die Würfel heißt das: die interessantere Achse ist nicht *welcher* Würfel, sondern
   *wie schnell hintereinander*.
2. **Derselbe Pickup wirkt je Fahrzeug anders** (Teppich 1,22 / 1,7 s · Boot 0,58 / 3,0 s). Das ist
   die billigste Variantenvielfalt überhaupt: eine Tabelle, kein Effekt. Und sie greift bei uns,
   sobald das Skateboard kommt (E-39).
3. **`DIAMOND_SFX_IDS` ist eine Liste.** Damit ist die Klangvarianz in der Quelle nicht ein
   Zufallspitch, sondern ein Datei-Pool — unsere Pitch-Lösung (Slice B) ist der Ersatz, weil wir
   nur eine Datei je Anlass haben. Sobald mehrere Dateien da sind, wird aus dem Pitch ein Pool.
   *Notiert als Vormerkung, nicht als Befund.*

⚠ **Und eine Praxis, die wir nicht haben** (`Game.ts:1527`, wörtlich): *„Pre-compile the
collect-burst pool so the first pickup does not pay shader/GPU upload cost."*
Der erste Pickup einer Sitzung ruckelt, weil dann der Shader kompiliert und die Textur hochgeladen
wird. Die Quelle wärmt den Pool beim Laden vor. **Das gehört in Slice C** — es ist eine Zeile und
betrifft jeden einmaligen Effekt, den wir bauen.

**PM-53 · Ein Klassenfeld, das wirft, hinterlässt die ALTE Fassung — nicht eine Fehlermeldung.**
Im Entscheidungs-Dokument stand `feld = React.createRef()` als Klassenfeld. Klassenfelder werden
bei der Konstruktion ausgewertet, `React` ist dort nicht garantiert — die Instanz warf, und die
Laufzeit zeigte weiter die **vorherige** Fassung. Sichtbar war das als *„die Seite reagiert nicht
mehr und zeigt `[object Object]`"*, und ich habe daraufhin dreimal am Textfeld gesucht: `value`
statt Kinder, `String()` um den Wert, `<pre>` statt `<textarea>`. Alle drei Eingriffe waren
korrekt und alle drei wirkungslos, weil die Datei gar nicht mehr lief.
**Das Symptom lag drei Ebenen von der Ursache entfernt** — und die verräterische Zahl stand die
ganze Zeit im Bild: der Zähler blieb bei „0 von 13", obwohl ich eine Option geklickt hatte. *Wenn
eine Anzeige auf eine Eingabe NICHT reagiert, ist die Frage nicht, was die Anzeige falsch macht,
sondern ob überhaupt noch etwas läuft.*
*Regel: reagiert nach einer Änderung irgendetwas nicht mehr, das vorher reagierte, wird ZUERST
geprüft, ob die Datei noch lebt — nicht, was am geänderten Element falsch ist. Und:
Initialisierung, die eine injizierte Abhängigkeit braucht, gehört nie in ein Klassenfeld.*

---

## 05g · Handover-Vormerkung · Skill „KFB DecisionLog v1"

**Georg, 30.8.:** *„super Format, danke — nur das Auswahl-Kopieren könnte einfacher sein. Können
wir als Skill bitte später bauen (bzw. Handover mit diesem Doc als Template/Demo)."*

**Demo und Vorlage:** `KFB Entscheidungen v1.dc.html` (in diesem Projekt).

Was den Skill ausmacht — das, was hier funktioniert hat und deshalb übertragbar ist:

| Baustein | Warum er zählt |
|---|---|
| **Drei Gruppen nach WIRKUNG, nicht nach Thema** | „Blocker · Richtung · Später" sagt, was passiert, wenn nicht entschieden wird. Eine thematische Gruppierung sagt das nicht |
| **Progressive Disclosure, ein Punkt offen** | Dreizehn Fragen gleichzeitig sind keine Frage, sondern ein Formular |
| **Kontext in zwei Sätzen · MESSUNG separat darunter** | Die Messzeile ist mono und andersfarbig, damit man Zahl von Meinung unterscheidet, ohne zu lesen |
| **Optionen mit „Folge"-Zeile** | Nicht die Option wird beschrieben, sondern was danach anders ist |
| **Aufwandsbalken `■□□`** | Textzeichen statt Grafik: paint sofort, kein Asset, kein Style-Hole |
| **Freitext schlägt jede Option** | Georgs eigener Befund: *„deine Optionen gehen oft am Kern vorbei"* — also darf die Liste nie die Grenze sein |
| **Offene Punkte werden MITKOPIERT** | Der Text endet mit `OFFEN (entscheide du): …`. Damit ist die Nicht-Entscheidung auch eine Übergabe |
| **Der Text steht sichtbar, das Kopieren ist der Bonus** | v1 hatte `navigator.clipboard` mit `window.prompt` als Rückfall — in einem iframe ist die Zwischenablage oft gesperrt, und dann landet man in einem Prompt mit 900 Zeichen Einzeiler. Jetzt: Block aufklappen, alles markiert, `⌘C`. Automatik obendrauf |

⏳ **Zu bauen, wenn der Skill kommt:** Punkte als reine Datentabelle (JSON), damit ein Chat sie
erzeugt, ohne die Ansicht anzufassen · Zustand in `localStorage`, damit eine halbe Antwort einen
Reload übersteht · Rückweg von Antwort zu Kennung, damit der eingehende Text wieder als Auswahl
gelesen werden kann.

---

## 05h · E-42 · Post Mortems werden KONSOLIDIERT, nicht umgezogen

**Georg, 30.8.:** *„Post Mortems könnten auch non-regressiv als High-Level-Concepts bzw. SOPs und
Lessons Learned konsolidiert mitgeführt werden — gerne dann frischer Chat später."*

Das ändert die Aufgabe, und zwar zum Besseren. **E-40 („Umzug jetzt") ist damit NACHTRAG:** ein
Umzug hätte 53 Einträge an einen anderen Ort geschoben und dieselbe Leseleistung verlangt wie
vorher. Eine Konsolidierung erzeugt eine **Ebene darüber**.

**Was „non-regressiv" hier heißt und warum es die Bedingung ist:** die Einzel-Einträge bleiben
stehen. Ein Post Mortem ist der BELEG einer Regel — wer nur die Regel liest, kann nicht prüfen, ob
sie stimmt, und rollt sie beim ersten Gegenwind wieder auf. Also: SOP oben, Beleg unten, Verweis
dazwischen. Nichts wird gelöscht, nichts umgeschrieben.

**Zielform je SOP** (die Regel, in Befehlsform, mit ihren Belegen):

```
SOP-nn · <Regel als Anweisung, ein Satz>
Gilt für: <wann man sie anwendet>
Belege:   PM-x, PM-y, PM-z   (die Einzelfälle bleiben, wo sie sind)
Kosten:   <was die Verstöße gekostet haben — die Zahl, die die Regel verteidigt>
```

**Sechs SOP-Kandidaten, die schon jetzt erkennbar sind** — als Startraster für den frischen Chat,
nicht als Ergebnis:

| Kandidat | Regel, vorläufig | Belege |
|---|---|---|
| **Eigentümerschaft** | Jede Sache hat genau einen Eigentümer und einen Weg hinein | PM-1, 10, 11, 40 · E-09, E-28, Slice B (`trauma`, `fx-bus`) |
| **Messen** | Kontrollprobe zuerst · eine Einheit · ein Geltungsbereich · ablesen statt erinnern | PM-41, 42, 44, 45, 46 · BUG-01 (falscher Geltungsbereich) |
| **Die Messbedingung ist Teil der Messung** | Jedes Ergebnis nennt seine Umgebung — auch die unsichtbare | PM-50, BUG-07, E-21 · dreimal in zwei Sitzungen |
| **Die richtige Größe messen** | Betrifft die Frage eine Form, ist die erste Messung ein Bild | PM-47, PM-49 · zwei Runden „blasig deformiert" |
| **Vorhanden ≠ verdrahtet** | Bevor ein Effekt als fehlend gemeldet wird, wird nach seinem AUFRUFER gesucht | PM-52, PM-53 · fünf gebaute, unerreichte Systeme |
| **Bewegung** | Sollwert darf nicht springen · fehlt Flüssigkeit, fehlt ein Modell · Laden schnell, Entspannen langsam | PM-19, 22, 39, 48 · E-27 |

⚠ **Und ein Verdacht, der beim Konsolidieren geprüft werden muss:** von 53 Einträgen betreffen
auffällig viele nicht den Gegenstand, sondern das **Messen und das Prüfen des Messens**. Wenn das
Raster oben stimmt, sind drei der sechs SOPs Instrumenten-SOPs. Das wäre selbst ein Befund — und
er gehört in die Einleitung des SOP-Abschnitts, nicht in eine Fußnote.

**Erster Zug im frischen Chat:** Living Document lesen, die 53 Einträge gegen dieses Raster
sortieren, SOPs schreiben, Verweise setzen. Kein Bau in derselben Runde.

---

## 05i · SOP-01 · Was ein Screenshot-Beweis ist — und was bisher keiner war

**Georgs Befund, 30.8.:** *„Screenshot-Beweise sind nach wie vor kein SOP und Mangelware."*
Richtig, und zwar doppelt: sie waren nicht standardisiert, **und** die meisten waren als Beweis
untauglich. Diese Sitzung hat viermal ein Bild produziert, das nichts belegt hat — und jedes Mal aus
einem anderen Grund. Die Gründe sind der Inhalt dieses SOP.

**SOP-01 · Ein Bild ohne seine Bedingungen ist kein Beweis, sondern eine Behauptung.**
Gilt für: jede Abnahme, in der ein Bild als Argument benutzt wird.

### Die sieben Bedingungen, jede aus einem bezahlten Fehlschlag

| # | Bedingung | Woher sie kommt |
|---|---|---|
| **1** | **Die Umgebung steht IM BILD**, nicht im Text daneben: `hidden:`, `dt`, Nyquist-Grenze, Kamera, Uhrzeit der Welt | Drei Messungen dieser Sitzung waren in einem verdeckten Tab entstanden und wären als Befund durchgegangen (PM-50). Ein Bild wandert in einen Chat und verliert seinen Absatz; ein eingebrannter Stempel nicht |
| **2** | **Feste `dt` aus `step()`, nie `requestAnimationFrame`** | Im verdeckten Tab drosselt der Browser rAF fast auf null — `intro.active` war 10 s nach dem Laden noch `true`. Ein Prüfstand, dessen Uhr der Browser stellt, misst die Aufmerksamkeit des Zuschauers mit |
| **3** | **Abtastrate ≥ 2,5 × höchste Frequenz des Effekts** | Der erste Bildstreifen lief mit `dt = 1/30` gegen eine 22-Hz-Modulation. Nyquist 15 Hz, also unterabgetastet — und **„nichts messbar" sieht aus wie „kein Effekt"**. Für 22 Hz heißt das `dt ≤ 1/55` |
| **4** | **Der Gegenstand muss auflösbar sein** | Der Streifen zeigte den Avatar mit wenigen Pixeln; Schatten und Squash waren darin nicht beurteilbar. Ein Beweis, auf dem man die Sache nicht sieht, ist ein Bild von der Szene, nicht von der Frage |
| **5** | **Eine Kontrollprobe im selben Streifen** — mindestens ein Bild, dessen Antwort vorher bekannt ist (der nicht ausgelöste Zustand) | PM-41: ein Prüfwerkzeug ohne Kontrollprobe ist eine Meinung. Für Bilder gilt es genauso: ohne „vorher" ist „nachher" keine Aussage |
| **6** | **WebGL wird aus dem Renderer gelesen, nicht von der Seite** — `renderer.domElement.toDataURL()` nach einem `render()`, nicht ein Seiten-Screenshot | Zweimal in dieser Sitzung kam ein leeres Bild zurück: DOM-Aufnahmeverfahren können einen WebGL-Puffer nicht lesen. Der Fehlschlag ist **stumm** — man bekommt ein Bild, es ist nur schwarz |
| **7** | **Die Datei ist im Dokument verlinkt** (`docs/evidence/<slice>-<sache>.png`) | Ein Beweis ohne Registereintrag existiert nicht — dieselbe Regel wie für Dokumente |

### Was daraus für den Prüfstand folgt (steht drin, `globe-v3/pruefstand.js`)

`loopA()` erfüllt 1, 2, 3 und 6 von sich aus: es stempelt `hidden`, `dt` und die Nyquist-Grenze in
die Kopfzeile, dreht die Welt mit `step()`, und rendert selbst.
**Es fehlen 4 und 5:** die Nahkamera ist gebaut (`nah: true`), aber noch nicht als Standard, und
eine Kontrollprobe-Kachel gibt es nicht. → **beide gehören in Slice C**, und danach ist ein
Beweisbild kein Handwerk mehr, sondern ein Aufruf.

⚠ **Die Regel, die über die sieben hinausgeht:** ein Beweis wird für eine FRAGE gemacht, nicht für
einen Zustand. „Hier ist die Welt" ist kein Beweis. „Hier ist der Schatten bei drei Höhen, mit der
Bedingung im Bild" ist einer. Wer die Frage nicht in die Kopfzeile schreiben kann, hat noch keine.

---

## 05j · Sprint-Übergabe · Schnitt auf v4 (30.8., Sitzungsende)

### Was der Schnitt ist

| Vorher | Jetzt | Status |
|---|---|---|
| `globe-v3/` (53 Dateien) | `globe-v4/` — vollständige Kopie, ab hier wird dort gebaut | v3 **FROZEN**, v4 **AKTIV** |
| `KFB Travel Globe v3.dc.html` | `KFB Travel Globe v4.dc.html` (Titel + ein Importpfad geändert) | v3 lauffähig, unberührt |

Drei Selbstnennungen im Runner sind auf v4 gezogen (Marke, Bericht, Panel-Titel); die
**Herkunftskommentare bleiben auf v3**, weil sie sagen, woher etwas kommt, nicht was läuft.

⚠ **Geteilt und damit gefährlich:** `terrain-planets-v1/` · `cardbuilder/` · `themes/` ·
`kfb-deform-instanced.js` werden von v3 UND v4 importiert. Wer dort etwas ändert, ändert zwei
Versionen. In dieser Runde ist genau das passiert (Pfad-Hygiene in `card-registry.js`) — additiv,
also unschädlich, aber es gehört benannt.

### Standalone — und warum er ein eigenes Bauverfahren braucht

`export/globe-v4_2026-08-30/KFB Travel Globe v4 standalone.html` · **1,2 MB, eine Datei,
54 Module inline, sieben JSON-Spiegel.** Konsole nach dem Start: **eine** Meldung, und die ist
Absicht (`water.enter` ohne Wirker — Vormerkung für Slice F).

**Der Bundler des Werkzeugs ist nachweislich untauglich** und das ist keine neue Erkenntnis: er
verliert je Einstiegs-Modul die ERSTE relative Abhängigkeit (Naht 101, in v20 mit sieben Umgehungen
gemessen). Am 30.8. bestätigt — sein Bündel starb mit
`Failed to resolve module specifier "./globe.js"`.
Stattdessen das v20-Verfahren, hier neu für v4 ausgeführt: Breitensuche über den Importgraph, jeder
relative Spezifizierer wird zu `@kfb/<schlüssel>` umgeschrieben (**77 in 54 Modulen**), die Quellen
liegen als JSON im Dokument, beim Start wird je Modul eine Blob-URL angelegt und eine importmap zur
Laufzeit eingehängt. **Ein bare specifier hat keine Basis, an der sich etwas verlieren könnte.**
Abnahme: „Restliche relative Spezifizierer: keine", geprüft über **alle** Quellen, nicht über den
Einstieg. Verfahren und Befunde: `export/globe-v4_2026-08-30/README.md`.

### Zwei Befunde, die nur der Export gefunden hat

**PM-54 · Eine Basis ist auch ein Pfad.** `card-registry.js` baute lokale Pfade mit
`new URL(p, import.meta.url)`. Aus einer Blob-URL ist `import.meta.url` `blob:https://…` — **keine
hierarchische Basis**, der Konstruktor wirft. Folge im Bild: die Welt startete, **aber ohne
Karten**. Kein Absturz, sondern ein fehlender Inhalt, den man für eine Designentscheidung halten
könnte.
*Regel: Pfad-Hygiene prüft nicht nur den Pfad, sondern die BASIS, gegen die er aufgelöst wird.
`session-export_v1` §6 nennt den relativen Asset-Pfad — die Basis ist die Ebene darunter und im
Vorschaubetrieb unsichtbar.*

**PM-55 · Ein Rückfall, der funktioniert, verschweigt seinen Anlass.** `card-grids.json` fehlte im
Spiegel, die Registry fiel auf „stumpfes Seitenviertel" zurück und meldete das als **Warnung**.
Die Karten wären da gewesen — falsch beschnitten. *Regel: bei einem Export wird die Konsole gelesen,
nicht das Bild geprüft. Ein Bild, das kommt, beweist nur, dass der Start ging.*

**PM-56 · Ich habe SOP-01 geschrieben und im nächsten Zug dagegen gebaut.**
Die Warteschleife der Standalone-Hülle pollte auf `requestAnimationFrame`, um die Boot-Blende zu
entfernen. In einem verdeckten Dokument tickt rAF praktisch nicht — **gemessen an genau dieser
Datei: bei `performance.now() = 43 458 ms` stand der Text noch auf „loading …" und NICHT auf
„Start failed", obwohl die eigene 25-Sekunden-Grenze längst überschritten war.** Also hatte die
Schleife seit dem Start nicht mehr getickt, und damit waren **beide** Pfade tot: die Entblendung
UND die Fehlermeldung. Ergebnis: ein deckender „LOADING …"-Schirm über einer laufenden Welt — im
Normalfall dieser Datei (Download, Doppelklick, Tab im Hintergrund).
Behoben: Timer statt rAF, plus der Ereignispfad über die `import`-Zusage.
**Gemessen nach dem Fix, in einem verdeckten Dokument:** Blende nach 22 s entfernt, `__globe`
vorhanden, `bootErrors` leer.

⚠ **Und das ist der eigentliche Eintrag.** Ich hatte die Regel eine Stunde vorher selbst
aufgeschrieben — SOP-01 Bedingung 2: *„eigene Uhr, feste Schrittweite — nie die Bildschleife des
Browsers."* Dann habe ich eine Hülle aus einem eingefrorenen Export übernommen und die Regel nicht
darauf angewandt, weil die Hülle „schon funktioniert hat".
*Regel: eine übernommene Vorlage wird gegen die Regeln geprüft, die seit ihrer Entstehung dazugekommen
sind. „Hat schon funktioniert" ist eine Aussage über die alten Bedingungen, nicht über die neuen.*
Das ist das Anti-Pattern „Regel notiert, nicht angewandt" aus `living-document_v1` §9 — beim ersten
Mal, direkt nach dem Notieren.
⏳ **Bekannter Defekt, nicht angefasst:** `export/travel-v20_2026-08-26/tools/standalone-shell.html`
hat denselben Fehler (dort mit `window.__travelPOC`). Der Export ist eingefroren; wer ihn wieder
anfasst, patcht die Warteschleife mit.

### Was diese Sitzung geliefert hat

| Was | Wo |
|---|---|
| Wegweiser-Blatt selbst gebaut, beidseitig lesbar | `globe-v4/paper-card.js` · E-24, E-26 |
| BUG-01 gefunden (drei Ursachen, zwei behoben) | `card-towers.js`, `globe-poc.js` · E-25 |
| Design Critique, zwei Teile, mit fünf Selbstkorrekturen | D-08 |
| Slice A: Tag/Nacht läuft, Dämmerung 15 % → 30 %, Schatten an | `day-night.js`, `globe-poc.js` |
| Slice B: `fx-bus` · `fx-script` · `trauma` · `step(dt)` | vier neue Dateien, vier Handler auf `fx.fire` reduziert |
| Prüfstand mit vier QA-Schleifen | `globe-v4/pruefstand.js` |
| SOP-01 „Was ein Beweis ist" | §05i |
| 13 Entscheidungen eingearbeitet | E-31…E-42 |
| Zwei Messungen an der Quelle (Schatten, Würfel-FX) | §06b · `github.md` |
| `session-design-briefing` Fassung 1.2 | `skills/session-design-briefing_v1.2.md` |
| DecisionLog + Handover | `KFB Entscheidungen v1.dc.html` · D-09 |
| Standalone v4 mit eigenem Bauverfahren | `export/globe-v4_2026-08-30/` |

### Die ersten drei Züge des nächsten Chats

1. **`pruefstand.loopA`**: Nahkamera als Standard, `dt` auf 1/60 klemmen, **Kontrollprobe-Kachel**
   (erstes Bild = nicht ausgelöster Zustand). Damit erfüllt Loop A alle sieben Bedingungen von
   SOP-01 — und Slice A bekommt sein Schattenbild.
2. **Slice C weiterführen**: Respawn und Intro-Übergabe als Kaskaden, den **vorkompilierten
   Burst-Pool** (tinyskies `Game.ts:1527`), dann Loop D mit neuer Basislinie (Slice A hat den
   Schatten eingeschaltet, die alten 121 Draw-Calls gelten nicht mehr).
3. **`fx.report()` im Panel gegen die Wirklichkeit halten**: acht Kaskaden definiert, aber
   `boost.start` und `water.enter` waren bis heute nie gefeuert. Einmal fliegen, Zähler ablesen.

---

---

## 05k · Sprint-Übergabe · Slice C „Alle Kaskaden" + Schnitt auf v5 (30.8.)

**Umgebung jeder Messung: `hidden: true`** — und diesmal ohne Drama, weil der Prüfstand die Welt
mit `step(dt)` dreht und nie nach `requestAnimationFrame` fragt.

### Was der Schnitt ist

| Vorher | Jetzt | Status |
|---|---|---|
| `globe-v4/` (53 Dateien) | `globe-v5/` (54 Dateien) — ab hier wird dort gebaut | v4 **FROZEN**, v5 **AKTIV** |
| `KFB Travel Globe v4.dc.html` | `KFB Travel Globe v5.dc.html` (Titel + ein Importpfad) | v4 lauffähig, unberührt |

Drei Selbstnennungen sind auf v5 gezogen (Marke, Bericht, Panel-Titel), die Herkunftskommentare
bleiben auf v3/v4 — sie sagen, woher etwas kommt, nicht was läuft.
⚠ **Geteilt und damit gefährlich, unverändert:** `terrain-planets-v1/` · `cardbuilder/` ·
`themes/` · `kfb-deform-instanced.js` werden jetzt von **drei** Versionen importiert.

### Was gebaut wurde

| Datei | Änderung | Grund |
|---|---|---|
| `fx-script.js` | `intro.handover` · `world.respawn` als Partituren | die zwei letzten Ereignisse ohne Ton. Die Übergabe der Startansicht ist der **stummste Moment des Spiels und der einzige, den jeder Zuschauer sieht** |
| `globe-poc.js` | `neustart()` — EINE Stelle für den Respawn | er stand zweimal im Runner (Taste R und Panel-Knopf), Zeile für Zeile gleich, und beide Male stumm |
| `globe-poc.js` | Prüfstand importiert, `__globe.ps`, sechs Panel-Zeilen, `zeigeBild()` mit Download | er war **von nirgends importiert** (PM-57) |
| `globe-poc.js` | `vorwaermen()` beim Laden · `frameFehlerZahl` als Zahlenkanal | tinyskies `Game.ts:1527` · PM-58 |
| `pruefstand.js` | Nahkamera ist Standard · Kachel 0 = Kontrollprobe · `bildMessen()` · Loop D mit Kontrollfenster und Zweitschuss | SOP-01 Bedingung 5 · PM-60/61/62 |
| `fx-bus.js` | `setHorcher()` · `beatsJe`/`gefeuertJe` · `spielbar` und `fehlendeWirker` je Kaskade | PM-59 |
| `post-radial.js` | `praeludium()` — kompiliert den Overlay-Quad beim Laden | sein Shader entstand sonst **im ersten Kartendurchflug**, mitten in dem Moment, den er schmücken soll |

### Abnahme — gemessen, nicht behauptet

**1 · Loop B · Beat-Audit über alle zehn Kaskaden** — [`C-loopD.png`](./evidence/C-loopD.png) zeigt
die Endfassung, [`C-befund-02-loopD-drawcalls.png`](./evidence/C-befund-02-loopD-drawcalls.png) den
Zwischenstand. Ergebnis: **10 von 10 „alle spielbaren Beats"**, Kontrollprobe 4/4 ✓.
`water.enter` steht bei **2/2 spielbar · 1 vorgemerkt (Wirker fehlt: `wake`)** — die Vormerkung
für Slice F liest jetzt als Vormerkung und nicht als Ausfall.

**2 · Loop C · Gameplay-Simulation** — [`C-loopC-gameplay.png`](./evidence/C-loopC-gameplay.png):
**1800 Schritte über 30 s**, höchstens **2** gleichzeitige Kaskaden, langsamster Schritt
**38,3 ms**, 52 Beats, **0 verworfen, 0 Fehler**, Invarianten 4/4 ✓.

**3 · Loop D · Invarianten je Kaskade, drei Fenster je Kaskade** —
[`C-loopD.png`](./evidence/C-loopD.png): **zweiter Schuss 4/4 ✓ bei allen zehn Kaskaden.**
Geometrien konstant **116**, Texturen konstant **71**, Frame-Fehler **0**.
Einzige Auffälligkeit im ERSTEN Schuss: `card.collect` legt **eine** Geometrie an (115 → 116) —
die Erstbenutzung des Kartenblatts, im zweiten Schuss weg.

**4 · Loop A · Bildstreifen mit Kontrollprobe** —
[`C-loopA-card-collect.png`](./evidence/C-loopA-card-collect.png) (über den Panel-Knopf ausgelöst,
also die ganze Kette) ·
[`C-loopA-card-collect-water.png`](./evidence/C-loopA-card-collect-water.png) (über Wasser, der
Bodenschatten aus Slice A ist darin endlich zu sehen) ·
[`C-loopA-intro-handover.png`](./evidence/C-loopA-intro-handover.png).
Kopfzeile im Bild: `dt=0.0167 s (Nyquist 30 Hz) · 12 frames · 1 control + 11 fired · near cam ·
hidden:true`.

**5 · Vorwärmen** — `2,4 ms · post-radial + scene`, im Panel unter „Shader pre-warm".

**6 · Das Panel** — [`C-panel-v5.png`](./evidence/C-panel-v5.png) ·
[`C-panel-diagnostics.png`](./evidence/C-panel-diagnostics.png). Vier Loops als Knöpfe, eine
Zeile `Test bench`, eine Zeile `Shader pre-warm`. **Georg braucht für keine dieser Zahlen eine
Konsole.**

### Sechs Befunde — und alle sechs stecken im PRÜFWERKZEUG, nicht im Spiel

Das ist die Pointe dieses Slice und sie ist unangenehm: Slice B hat die Verdrahtungsebene gebaut
und dabei ein Messwerk mitgebaut, das an vier Stellen nach OBEN gelogen hat — also so, dass es
wie Erfolg aussah.

**PM-57 · Ein Prüfstand, der nicht importiert ist, fällt nicht auf — er fällt AUS.**
`pruefstand.js` lag seit Slice B im Projekt, mit Kopfkommentar, `report()` und vier Schleifen,
und **kein Modul importierte ihn.** Das ist wörtlich der Kernbefund des Critique („gebaut, aber
von keinem Ereignis erreicht"), angewandt auf mein eigenes Werkzeug — und die peinlichere
Variante, denn ein fehlendes Prüfergebnis sieht aus wie „noch nicht gemessen".

**PM-58 · Ein Zähler, der als Satz ausgeliefert wird, ist kein Zähler.**
`__globe.frameFehler` liefert bei einem Fehler `"3 · message"`. Der Prüfstand las `+welt.frameFehler || 0`
— `+"3 · message"` ist `NaN`, `NaN || 0` ist **0**. Die Invariante „frame errors 0 → 0" wäre also
**grün geblieben, egal wie oft der Frame-Loop gestorben ist.** Eine Kontrollprobe, die nicht
durchfallen kann, ist Dekoration. Behoben mit `frameFehlerZahl` — ein Kanal je Zweck.

**PM-59 · Ein Beat-Audit, das den globalen Zähler liest, misst die Welt statt die Partitur.**
Gemessen ([`C-befund-01-loopB-globalzaehler.png`](./evidence/C-befund-01-loopB-globalzaehler.png)):
`card.collect 7/6`, `intro.handover 7/4`, `boost.start 6/4`, `world.respawn 5/4` — **mehr Beats,
als die Partitur überhaupt hat.** Ursache: die Welt läuft im Messfenster weiter und feuert ihre
eigenen Kaskaden; der Loop zählte die Differenz eines GLOBALEN Zählers. Der Fehler geht nach oben,
sieht also wie Erfolg aus. Behoben mit `fx.setHorcher` — ein Steckplatz am Bus, der Name, Wirker
und Sollzeit je Beat meldet; dazu `gefeuertJe`, damit ein Fremdstart im Urteil DASTEHT.

**PM-60 · Die Kaskade, die geprüft wird, schaltet das Messgerät ab.**
Loop D meldete `draw calls 93 → 4` und `90 → 1`. Vier Draw-Calls heißt „es wurde nichts
gezeichnet" — und das stimmte sogar: `post-radial` legt bei aktivem Radial-Blur einen **zweiten**
`renderer.render` über das Bild, und `renderer.info` wird **bei jedem** `render` genullt. Nach
einem Bild mit Blur steht dort die Zahl des Overlays. Genau die Kaskaden, die den Blur auslösen
(`card.collect`, `dice.collect`), waren betroffen. Behoben: `info.autoReset = false`, selbst
nullen, EIN Bild fahren, dann lesen — die Summe beider Durchgänge, also die echten Bildkosten.

**PM-61 · Eine Draw-Call-Invariante auf einer fliegenden Kamera misst die Aussicht, nicht das Leck.**
Mit fester Toleranz ±2 (aus dem Masterplan: „Basislinie 121") waren **neun von zehn** Kaskaden
auffällig, während Geometrien und Texturen konstant blieben. Die Schwankung ist das Frustum: die
Welt fliegt weiter, also sind je Bild andere Dinge sichtbar. Behoben nach PM-41: das Band kommt
aus einer **Kontrollprobe** — dasselbe Zeitfenster ohne Kaskade — und die gemessene Eigendrift
steht im Urteil (`band ±5 from control drift -3`).
→ **Die Zahl „121 Draw-Calls ± 2" aus dem Masterplan ist damit erledigt, nicht neu gemessen.**
Eine einzelne Draw-Call-Zahl ist auf dieser Welt keine Invariante; die Invarianten sind
Geometrien (116), Texturen (71), Frame-Fehler (0) und die **Differenz gegen ein Kontrollfenster**.

**PM-62 · Ein Leck ist, was bei JEDEM Auslösen passiert.**
`card.collect` legt beim ersten Schuss eine Geometrie an. Als Leck gelesen wäre das eine Warnung,
die nie verschwindet — und Warnungen, die immer stehen, werden nicht gelesen (dieselbe Klasse wie
PM-55). Loop D fährt jetzt drei Fenster je Kaskade: Kontrolle, Erstschuss, Zweitschuss, und
**urteilt auf dem Zweitschuss.** Der Erstschuss steht daneben, weil er die Vorwärm-Kandidaten nennt.

### Die ersten drei Züge von Slice D „Parameter freilegen"

1. **Die acht Module in der Reihenfolge ihrer Regler-Nachfrage:** `carpet` · `petKin` · `rig` ·
   `trail` · `lines` · `hud` · `leaves` · `biom`. Jedes bekommt `params` + `report()` +
   Panel-Zeile, **kein Verhaltenswechsel.**
2. **Der Diff-Beweis ist jetzt billig:** Loop C liefert Ereigniszahlen, Beats, verworfene Beats und
   Invarianten in einem Aufruf — vorher/nachher gegenüberstellen, und die Abnahme ist eine Tabelle
   statt einer Behauptung. Das ist der eigentliche Ertrag dieses Slice.
3. **Reihenfolge einhalten:** wer beim Freilegen etwas „nebenbei verbessert", hat den Diff-Beweis
   verloren, den er selbst gerade gebaut hat.

---

## 05l · Sprint-Übergabe · Slice D „Parameter freilegen" (30.8.)

**Umgebung jeder Messung: `hidden: true`.**

### Der Auftrag und die Abnahme

Masterplan §05: *acht Module bekommen `params` + `report()` + Panel-Zeilen. **Kein
Verhaltenswechsel.*** Das Zweite ist der schwierige Teil, denn „ich habe nichts verändert" ist
genau die Sorte Satz, die man nicht glauben soll. Also ist die Abnahme ein Gerät:

**Jedes Modul trägt seine eingefrorene `quelle` mit und sagt, wie viele Werte davon abweichen.**

> `123 parameters across 8 modules · 0 off source — Slice D changed nothing`
> — [`D-source-check.png`](./evidence/D-source-check.png)

Sieben Module melden `all source-faithful (tinyskies …)`, `pet-kinetics` und `collect-hud` melden
`all at default` (ihre Referenz ist unsere eigene erste Fassung, nicht tinyskies — das steht so im
Bericht, weil ein falsches Herkunftssiegel schlimmer ist als keins), `biome` meldet
`unchanged since load`.

| Modul | Parameter | Referenz |
|---|---|---|
| `carpet` | 31 | tinyskies `Carpet.ts` |
| `camera-rig` | 18 | tinyskies `CameraRig.ts` |
| `carpet-trail` | 9 | tinyskies `CarpetTrail.ts` |
| `speed-lines` | 21 | tinyskies `SpeedLines.ts` |
| `pet-kinetics` | 26 | unsere Fassung (Impulssprache) |
| `carpet-leaves` | 11 | tinyskies `CarpetLeaves.ts` |
| `collect-hud` | 3 | unsere Fassung |
| `globe-biome` | 4 | Stand beim Aufbau |

**Diff-Beweis über Loop C** — [`D-abnahme-final.png`](./evidence/D-abnahme-final.png):
1800 Schritte / 30 s, max 2 gleichzeitige Kaskaden, langsamster Schritt 10,7 ms, **0 verworfen,
0 Fehler**, Texturen und Frame-Fehler unverändert.

### Was das Freilegen selbst gefunden hat

**PM-63 · Ein Konstantenblock, der Werte nicht enthält, ist schlimmer als keiner — er behält
Recht, solange niemand sucht.**
`carpet.js` hatte einen ordentlichen Block mit 25 Konstanten oben und **sechs weitere
Tuning-Zahlen als nackte Literale mitten in `update()`**: Ausrollen ohne Eingabe (`0.3 * dt`),
Anteil der Lenkung an der Schräglage (`* 0.5`), Ausstiegsschwelle aus dem Drift (`< 0.08`),
Tempo-Sockel des Gleitbonus (`0.35 + 0.65·`), Steigrate-Verstärkung (`* 1.5`), Nick-Glättung
(`4.0 * dt`). `camera-rig.js` hatte **sieben** davon — darunter die **Blickbremse `0.78`**, der
der Modulkopf drei Zeilen widmet („so look-at does not outrun position — reduces dizzy spins").
*Die einzige Zahl des Moduls, die man nicht finden konnte, ohne die Rechnung zu lesen, war die,
die als Heilmittel gegen Schwindel beschrieben ist.*

**PM-64 · Eine Basislinie ist kein Wert, sondern ein ZEITPUNKT.**
Für `globe-biome` habe ich eine Referenz deklariert und den Prüfer sagen lassen „7 off default:
`scale 1.5→2.186…`". Drei Anläufe, jeder mit einer anderen Lehre: (1) falsche **Referenz** (die
Literale, nicht das Preset) → (2) falscher **Zeitpunkt** (Basis vor der ersten Probe; die Werte
entstehen erst beim Aufbau der Kugel) → (3) siehe PM-65.

**PM-65 · Bevor man einen Regler an etwas baut, prüft man, WER es schreibt.**
Im dritten Anlauf meldete der Prüfer `scale 2.4094→2.4092`, `lacunarity 2.0101→2.0099`. Solche
Zahlen tippt niemand. `MIX` in `globe-biome.js` ist **kein Parametersatz, sondern ein
Kratzpuffer**: `fieldHook` beschreibt es JE PROBE neu aus den Domänen-Gewichten — und das steht
seit v3 im Kommentar direkt darüber („EIN wiederverwendetes Objekt, kein `new` je Probe"). *Ich
habe den Kommentar gelesen und trotzdem `setBiomeMix` gebaut: einen Eingang, dessen Wert die
nächste Probe überschreibt.* **Für einen Kratzpuffer gibt es keine Basislinie, weil es keinen
Zustand gibt.** Der Apparat war nicht falsch eingestellt, er war am falschen Gegenstand — also
ist er wieder raus, und es blieben die vier Werte, die wirklich Parameter sind (`on`, `strength`,
`sharp`, `seed`). Der Kratzpuffer ist jetzt als Beobachtung ablesbar (`biom · last mix sample`),
und der Name sagt, dass es keine Einstellung ist.
*Bemerkenswert ist, WER das gefunden hat: das Gerät, das ich gerade gebaut hatte, hat mir drei
Mal widersprochen und jedes Mal genauer. Ein Prüfwerkzeug, dem man nach dem ersten Widerspruch
glaubt, ist ein anderes Projekt als eines, dessen ⚠ man wegklickt.*

**PM-66 · Ausschneiden nach ZEILENBEREICH nimmt mit, was zufällig dazwischen liegt.**
Beim Aufräumen von `globe-biome.js` habe ich den Block zwischen `MIX` und `setBiome` ersetzt und
dabei **`fieldHook` mitgeschnitten** — die Funktion, um die es im Befund gerade ging. Ergebnis:
`fieldHook is not defined`, die Welt startete nicht, und die Konsole meldete
`[globe] start failed {}` — **einen leeren Gegenstand ohne Botschaft**, weil der Fangkorb
`console.error('…', e)` loggt und ein `ReferenceError` im Modulkontext dort als `{}` ankam. Der
Text stand auf der BÜHNE (`Start failed: fieldHook is not defined`), nicht in der Konsole.
*Zwei Lehren: nach Bedeutung schneiden, nicht nach Position — und bei „start failed {}" zuerst
das Bild lesen, nicht die Konsole.*

**PM-67 · Eine Reparatur, die nur an einem von zwei Geräten desselben Bauplans ankommt, ist eine
halbe Reparatur.**
PM-61 (Draw-Calls sind auf einer fliegenden Kamera keine Invariante) habe ich in Slice C in
Loop D behoben und **in Loop C stehen gelassen.** Die Abnahme von Slice D meldete prompt
`⚠ draw calls 255 → 106 (Δ−149, band ±3)` — die Aussicht, nicht ein Leck. Loop C hat kein
Kontrollfenster (die Eingabefolge IST der Zweck), also sind die Draw-Calls dort jetzt
**beschreibend** ausgewiesen; beurteilt werden Geometrien, Texturen, Frame-Fehler, und der
Lecktest bleibt Loop D. *Ein Nachtrag zum Nachtrag: die erste Fassung dieser Beschreibung meldete
eine Spanne `range 1…251` — die 1 war wieder der Overlay-Quad (PM-60), zum dritten Mal in einer
Sitzung, an einer neuen Stelle. Sauber messen hätte 180 `autoReset`-Umschaltungen je Loop
gekostet, also wird die Spanne nicht gemeldet: **eine Zahl, die man nicht sauber messen kann, gibt
man nicht ungefähr aus.***

### Ein Nebenprodukt, das Slice H braucht

`carpet-trail` hatte seine Farbe als Literal **im Shader** (`vec3(0.95, 0.82, 0.3)`). Sie ist
jetzt ein Uniform mit `setTint(r, g, b)` — der erste Farbeingang des Projekts, der nicht
festgenagelt ist. Für „verdant · molten · frost · bone" ist genau das der Wert, den man dreht.

### Was ausdrücklich NICHT freigelegt ist

Die Federkonstanten der Trägheitsneigung in `pet-kinetics` (`sp(roll, …, 120, 0.72)` und drei
Geschwister) und die Zahlen des Lauf-Modus. Dutzende Werte in zwei langen Pfaden, keine Nachfrage,
und jede Umschreibung wäre Änderungsrisiko ohne Ertrag. **Ein Slice, der „acht von acht" behauptet
und dabei die Hälfte still auslässt, ist schlimmer als einer, der seine Grenze nennt.** Die
Panel-Zeile sagt es mit: `lean springs still hard-coded (by decision)`.

### Ein Befund, der KEIN Befund ist, aber wie einer aussieht

`carpet-leaves`: der Land/Wasser-Blender ist der **einzige Zeitschreiber im Projekt, der `dt`
nicht liest** — 8 % je BILD, also blendet er bei 30 fps halb so schnell wie bei 60. Das ist die
Quelle 1:1, und Slice D ändert nichts: der Wert bleibt. Er heißt jetzt aber `blendJeBild` statt
`blendRate`, damit der Name sagt, was er tut, und der Befund steht im Code statt in niemandes Kopf.

### Die ersten drei Züge von Slice F „Wake & Drift-Rauch"

1. **`carpet-wake.js` bauen und als Wirker `wake` registrieren.** Der Platz ist beschriftet:
   `water.enter` hat den Beat `{ t: 0, wake: ['burst'] }`, Loop B weist ihn als „1 vorgemerkt"
   aus, und die Konsole meldet den fehlenden Wirker beim Laden. **Sobald er registriert ist,
   springt Loop B von `2/2` auf `3/3` — das ist die Abnahme, und sie ist schon geschrieben.**
2. **Raten aus der Quelle nehmen, nicht erfinden** (tinyskies-Wake), und die Parameter von Anfang
   an als `params` + `quelle` anlegen. Nach Slice D ist das der Hausstandard, kein Extraschritt.
3. **Loop D auf die neue Kaskade laufen lassen** — zweiter Schuss, Band aus dem Kontrollfenster.
   Ein Partikelsystem ist der klassische Leck-Kandidat, und der Lecktest steht bereit.

---

## 05m · Sprint-Übergabe · Slice F „Wake & Drift-Rauch" (30.8.)

**Umgebung jeder Messung: `hidden: true`.**

### Die Quelle war erreichbar — und das hat den Slice verändert

Der Masterplan sagt „nach tinyskies-Raten". Bisher stand im Projekt genau **eine** gemessene Zahl
dazu (`CarpetWake` = 6 Spritzer je Bild, aus der Korrektur zu D-08 §12.5). Der Rest wäre geschätzt
gewesen. **Der Branch ist erreichbar** (`cursor/globefly-multiplayer-globe-flight-game`, in
`github.md` notiert), also sind `CarpetWake.ts` und `CarpetDriftSmoke.ts` gelesen und portiert
worden — Pool, Lebenszeiten, Geschwindigkeiten, Öffnungswinkel, Blendraten, alles 1:1.
*Zwei Werkzeugaufrufe gegen einen Slice voller erfundener Zahlen. Das gehört in die Arbeitsweise.*

### Was gebaut wurde

| Datei | Rolle | Quelle |
|---|---|---|
| `carpet-wake.js` | Spritzwasser über dem Ozean, **zwei Fahnen an der Wasseroberfläche unter dem Fahrzeug** · dazu der Wirker `wake` | `CarpetWake.ts` |
| `drift-smoke.js` | Sandstaub an den Kanten, solange gedriftet wird | `CarpetDriftSmoke.ts` |
| `globe-poc.js` | Wirker `wake` registriert · zwei Aufrufe im Frame · Panel-Abschnitt „Wake & drift dust" · zwei Zeilen im Parameter-Check | — |

Beide bringen `params` · `quelle` · `abweichungen()` · `zeile()` **von Anfang an** mit. Nach
Slice D ist das kein Extraschritt, sondern der Hausstandard — und man sieht am Parameter-Check,
dass er trägt: aus „8 Module" wurden „10 Module", ohne dass eine Zeile Prüfcode dazukam.

### Abnahme

**1 · Die vorausgeschriebene Abnahme ist eingetreten.**
[`F-loopB.png`](./evidence/F-loopB.png): `water.enter  3/3  t=0:3  ✓ alle spielbaren Beats`.
In Slice C stand dort `2/2 · 1 vorgemerkt (Wirker fehlt: wake)`; in Slice Ds Übergabe stand der
Satz *„sobald er registriert ist, springt Loop B von 2/2 auf 3/3 — das ist die Abnahme, und sie
ist schon geschrieben."* Genau das ist passiert. **Alle zehn Kaskaden grün, Kontrollprobe 4/4 ✓.**

**2 · Die Konsole ist zum ersten Mal seit Slice B vollständig leer.** Die eine Meldung
(`[fx-bus] water.enter: Wirker „wake" ist nicht registriert.`) ist weg, weil der Platz besetzt
ist — nicht weil jemand die Warnung entfernt hat.

> ⚠ **NACHTRAG (§05n):** dieser Satz galt am Ende von Slice F und **war nach Slice G falsch** —
> G hat drei neue Warnungen eingeschleppt (`hud`-Wirker, zu spät registriert). Behoben, und der
> Vorgang steht als PM-76 in §05n. *Eine Zustandsaussage in einem Dokument hält genau bis zum
> nächsten Slice — deshalb steht sie hier mit Datum und nicht als Dauerbehauptung.* *Eine Vormerkung, die sich selbst meldet und
beim Einlösen selbst verstummt, ist die einzige Sorte Vormerkung, die etwas wert ist.*

**3 · Loop A, mit Kontrollprobe.**
[`F-loopA-water-enter.png`](./evidence/F-loopA-water-enter.png) (12 Bilder, `dt` 1/60) ·
[`F-loopA-detail.png`](./evidence/F-loopA-detail.png) (4 große Kacheln).
Kachel 0 „control · not fired" ist trocken, ab Kachel 1 stehen die Tropfen und wandern nach hinten
auseinander. **Der Beweis ist der Unterschied zwischen Kachel 0 und Kachel 1** — genau wozu die
Kontrollprobe in Slice C gebaut wurde.

**4 · Loop D · Lecktest** — [`F-loopD.png`](./evidence/F-loopD.png), `dt` 1/30 (Standard):
**Geometrie-Lecks 0 · Textur-Lecks 0 · Frame-Fehler 0**, über alle zehn Kaskaden, auf dem ZWEITEN
Schuss. Geometrien konstant 116, Texturen konstant 71. Zwei gepoolte Partikelsysteme mehr, und
kein Objekt wird je Auslösung neu angelegt — das ist die Bauform, nicht Glück.
`water.enter` selbst: **✓ auf allen vier Invarianten.**

**5 · Kosten:** je Modul **ein** Draw-Call (Pool + eigener Shader). Panel-Zeilen zeigen die
lebenden Partikel: Kielwasser bis 226/400 im Flug über Wasser, Driftstaub 0/120 im Geradeausflug.

### Vier Befunde beim Portieren

**PM-68 · Die Tempo-Tore der Quelle sind auf ihre eigene Tempospanne kalibriert — und unsere
Obergrenze reicht nicht ganz hin.**
`CarpetWake` schaltet ab `speed > 0.5` ein und blendet über `(speed − 0,5) / 0,4` auf, ist also
**erst bei 0,9 voll.** Unser `maxSpeed` ist **0,78** (1:1 aus `Carpet.ts`). Bei Vollgas ohne Boost
erreicht das Kielwasser damit rechnerisch **70 %** und nie 100 %. In der Quelle kommt man über 0,78
nur mit Upgrades — dort ist es also konsistent, bei uns ist es eine **Gestaltungsfrage**.
Die Zahl steht in der Panel-Zeile (`alpha ceiling at our max speed 0.78: 0.7`) und das Tor ist ein
Regler. *Dieselbe Klasse wie das 0,5-Tor der Blätter, das Slice A als „0 lebende Partikel" gemessen
hat: ein Effekt, der nicht kommt, ist fast immer eine Schwelle und fast nie ein Shader.*
→ **Für Georg zum Ansehen**, nicht von mir zu entscheiden.

**PM-69 · Ein Kontrollfenster ist eine Stichprobe, und Drift ist nicht stationär.**
Loop D flaggt drei Kaskaden auf Draw-Calls (Δ−5, Δ−6, Δ+7 gegen ±3), während Geometrien, Texturen
und Frame-Fehler überall sauber sind. Das ist **kein Leck**, sondern der Rest von PM-61: das Band
kommt aus EINEM Kontrollfenster, und wenn dieses Fenster gerade geradeaus fliegt und das gemessene
gerade kurvt, ist das Band zu schmall. Die Reparatur ist ein längeres oder gemitteltes
Kontrollfenster, **nicht ein breiteres Band** — eine Toleranz so lange aufziehen, bis nichts mehr
meckert, ist der kürzeste Weg zu einem Instrument, das niemand liest.
→ **Offen und benannt.** Die Invarianten, die Lecks finden, sind grün.

**PM-70 · Drei Nachbarmodule derselben Quelle zählen unterschiedlich — und nur eines ist
bildfrequenzfest.**
`CarpetDriftSmoke` sammelt **28 Partikel je SEKUNDE** über einen Akkumulator. `CarpetLeaves` und
`CarpetWake` zählen **je BILD** (0,25 bzw. 6). Also sieht der Driftstaub bei 30 und 60 fps gleich
aus und die anderen zwei nicht. Das steht jetzt in beiden Modulköpfen und in der Panel-Zeile
(`time-based (unlike leaves and wake, which count per frame)`), weil es **vor** dem ersten
Reglerdreh wichtig ist: dort ändert man eine Rate, hier eine Rate plus eine Abhängigkeit.
Bonus zum Slice-D-Befund: die dt-freie 8-%-Blende steckt auch in `CarpetWake` — es ist die
**Hausschreibweise der Quelle**, nicht ein Ausrutscher in einem Modul.

**PM-71 · Zwei Mal dieselbe Zauberzahl, und wir haben ihren Preis schon bezahlt.**
Beide Quellmodule rechnen `gl_PointSize = aSize * (K / -mvPos.z)` — `K` = 40 im Kielwasser, 180 im
Staub, **beide ohne Obergrenze.** Genau diese Bauform hat in v3 zwei Befunde auf einmal erzeugt
(`impact-dust`: „statt Partikel sehe ich große Kreise" UND „Terrain ist überstrahlt" — neun
halbtransparente Scheiben dicht an der Linse waren das Milchglas). **Hier weichen wir bewusst ab:**
echter Projektionsfaktor `hPx / (2·tan(fov/2))` als Uniform plus harter Pixel-Deckel, rückstellbar
über `params.maxPx`. Das ist die einzige Abweichung von der Quelle in diesem Slice, sie steht in
beiden Modulköpfen, und sie ist die Sorte Abweichung, die `github.md` verlangt: mit Begründung.

### Ein Nebenprodukt für Slice H

`rauch.setTint(r, g, b)` — der zweite Farbeingang nach `trail.setTint()`. Für die Weltstimmungen
ist der Staub genau der Wert, der mitwandern muss: Sand (verdant) → Asche (molten) → Schneestaub
(frost) → Kalk (bone). Wer H baut, braucht dafür keine Shader anzufassen.

### Die ersten drei Züge von Slice G „HUD-Einfassung"

1. **Erst ansehen, dann messen** (PM-49): Georgs Vorgabe ist „gestanzte, battered Metal-Platte",
   Rost aus `Metal022_1K-JPG`. Das ist eine FORM-Frage — also ein Bild vor jeder Zahl.
2. **Ein Eigentümer der HUD-Transformation.** §Backlog „HUD reagiert auf den Flug" nennt die Falle
   vorab: die Wortmarke hat seit v3j eine CSS-Schleife; wer sie zusätzlich aus JS bewegt, hat zwei
   Schreiber auf `transform` (Fehlerklasse 1). **Vor dem Bauen entscheiden**, nicht danach.
3. **Grenze aus dem Backlog übernehmen:** maximal ±1,5° Drehung und ±4 px Versatz bei voller
   Schräglage, Rückstellzeit ~0,6 s. Aus Reaktion wird sonst Seekrankheit.

---

## 05n · Sprint-Übergabe · Slice G „HUD-Einfassung" (30.8.)

### Was gebaut wurde

| Datei | Rolle |
|---|---|
| `globe-v5/hud-frame.css` | **NEU.** Die Einfassung: drei Maßvariablen, die gestanzte Blechplatte, die Tempo-Nabe, der Träger für die Flug-Reaktion |
| `globe-v5/hud-flight.js` | **NEU.** EIN Signalgeber, vier Leser · Federn zweiter Ordnung · `selbsttest()` mit Kontrollprobe |
| `KFB Travel Globe v5.dc.html` | Stylesheet nach `kfb-shell.css` · Träger um die Wortmarke |
| `globe-poc.js` | Ecken markiert · Tempo-Label · Wirker `hud` · Panel-Abschnitt „HUD frame" |
| `fx-script.js` | `hud`-Beats in `card.collect` (0,9) · `dice.collect` (1,1) · `ground.touch` (0,6) |

**Beweise:** [`G-einfassung.png`](./evidence/G-einfassung.png) ·
[`01-G-reaktion.png`](./evidence/01-G-reaktion.png) (neutral) ·
[`02-G-reaktion.png`](./evidence/02-G-reaktion.png) (volle Schräglage rechts) ·
[`03-G-reaktion.png`](./evidence/03-G-reaktion.png) (links) ·
[`04-G-reaktion.png`](./evidence/04-G-reaktion.png) (Einschlag).

*Nebenbei ein nützlicher Zufall: in einer eingefrorenen Welt kann das Bildwerkzeug den WebGL-Puffer
nicht lesen, also ist der Hintergrund leer — und der Streifen zeigt **nur das HUD.** Für eine
HUD-Abnahme ist das genau richtig, und es war kein Trick, sondern ein Nebenprodukt von `freeze()`.*

### Vier Entscheidungen, die der Slice getroffen hat — jede mit ihrem Grund

**1 · Die Datei liegt in `globe-v5/`, nicht in `themes/`.**
`themes/kfb-shell.css` ist von v3, v4 UND v5 verlinkt. Eine v5-Gestaltung dort wäre eine Änderung
an drei Versionen — §05j nennt das „geteilt und damit gefährlich", und in dieser Runde wäre es
vermeidbar gewesen und trotzdem passiert, wenn man nicht nachsieht. Eigene Datei, nach der
geteilten eingebunden, geteilte unberührt.

**2 · Die Wortmarke bekommt einen TRÄGER, keine Verhandlung.**
Der Backlog hat die Falle vorab benannt: die Marke hat seit v3j eine CSS-Schleife auf `transform`
(`kfb-wm-float`, 11 s). Zwei Optionen standen im Backlog — CSS-Variable ins Keyframe rechnen, oder
JS übernimmt beides. **Gewählt wurde eine dritte, die keiner der beiden Nachteile hat: ein
zusätzlicher Knoten.** JS schreibt den Träger, die Schleife bleibt auf dem Kind. Zwei Elemente,
zwei Eigentümer, **Fehlerklasse 1 per Konstruktion ausgeschlossen** — und die Schleife musste nicht
angefasst werden. *Wenn zwei Schreiber sich um eine Eigenschaft streiten, ist die billigste Lösung
oft ein zweites Element und nicht ein Kompromiss.*

**3 · Die Tempo-Zahl ist ein DOM-Label, keine CanvasTexture auf der Nabe.**
Der Backlog ließ es offen („erst entscheiden, dann bauen") und nannte den Preis der Textur
(neu malen bei jeder Änderung, auf 10/s drosseln). Entschieden hat es aber nicht der Preis,
sondern eine Regel, die im Zielbild schon stand: *„Die Tempozahl in der Gear … darf mitfahren,
nicht mitkippen. Der Rahmen bewegt sich, die Information nicht."* **Eine Textur auf der Nabe dreht
mit dem Zahnrad** — sie verletzt die Regel per Bauform. Damit war es keine Abwägung mehr.
*Die Entscheidung lag schon im Zielbild; ich musste sie nur finden, statt sie zu treffen.*

**4 · Keine Wrapper für die drei anderen Ecken.**
`.fan`, `.pop` und der Zahnradknopf sind absolut über `right`/`bottom` gesetzt. Ein umgebender
Knoten mit `position: relative` würde zum Bezugsrahmen ihrer absolut positionierten Kinder — die
Ecken wären verschoben, und zwar auf eine Art, die man für einen Designfehler hält. Also: die
Platte ist ein **Pseudo-Element** (`::before`/`::after`, `z-index: -1`), sie braucht keinen Knoten,
und `.kfb-plate` setzt **bewusst kein `position`**.

### Was „gestanzt und battered" heißt — und warum es kein abgerundetes Rechteck ist

Georgs Vorgabe war ein Materialbegriff, kein Formbegriff. Übersetzt:

- **Gestanzt** = aus Blech geschlagen → eine **Fase**: helle Schnittkante oben innen, dunkler Grat
  unten innen, dazu die Tuschekante außen (dasselbe Vokabular wie Karten und Würfel im Spiel).
- **Battered** = benutzt → **keine gerade Kante.** Jede der vier Platten hat ihre EIGENE
  `clip-path`-Silhouette mit leicht schiefen Ecken, vier verschiedene, damit sie nicht geklont
  wirken. *Vier gleiche `border-radius: 6px`-Kästen wären die Sprache von Software; eine schiefe
  Stanzkante ist die Sprache von Blech.*
- **Nieten:** zwei je Platte, diagonal. Vier wären eine Zierleiste, zwei sind eine Befestigung.
- **Rost:** `Metal022.png` (445 kB) statt `Metal022_1K-JPG_Color.jpg` (1,8 MB). Bei 60–120 px
  Plattenbreite ist die 1K-Karte reine Bandbreite; der große Kanal steht als Kommentar in der
  Datei, falls die Platte einmal groß gebraucht wird.
- **Der Kontrast bleibt gewahrt** (Georg 30.8.): HUD-Platte, Zahnrad und Pop-Feld sind Metall, die
  **In-Game-Würfel bleiben Hartgummi.** Das HUD ist die Maschine, die Welt ist das Spielzeug.

### Die Flug-Reaktion: warum sie nicht wackelt

Zielbild-Stufen 1–3 sind gebaut. Der Kern ist **ein** Signalgeber: der Frame-Loop schreibt vier
Zahlen auf die HUD-Wurzel (`--bank`, `--g`, `--speed`, `--hit`), jede Ecke liest, was sie braucht.
Die Alternative wären vier Leser auf `carpet.state` gewesen — eine Größe ohne Eigentümer, also
genau die Fehlerklasse, die dieses Projekt am häufigsten bezahlt hat.

**Und die Ecken reagieren absichtlich UNGLEICH:**

| Ecke | Was sie ist | Reaktion |
|---|---|---|
| Wortmarke | ein Blatt, lose angeklebt | Gegenrotation mit Nachlauf, Flattern bei Tempo (Schwingung, kein Rauschen — Rauschen liest als Fehler) |
| Zahnrad | eine Maschine | bewegt sich fast nicht; die Drehung gehört `gear-icon.js`, die Zahl bleibt aufrecht |
| Pop-Feld | ein Körper in der Ecke | kippt mit der Schräglage, **volumenerhaltender** Squash beim Einschlag |
| Kartendeck | ein Stapel Papier | **fächert in der Kurve nach außen** (hängt an der Drehrate, nicht an der Lage) |

*Das ist die Antwort auf „mehr Immersion": nicht mehr Bewegung, sondern Bewegung, die etwas über
den Gegenstand sagt. Ein Stapel, der auffächert, erzählt die Fliehkraft. Vier gleichmäßig
wackelnde Kästen erzählen nichts.*

**Grenzen, vorher vereinbart und im Panel ablesbar:** ±1,5° Drehung, ±4 px Versatz bei voller
Schräglage, Squash ≤ 6 %.

> ⚠ **NACHTRAG · die Grenzangabe war als SUMME falsch, obwohl jede Zahl darin stimmte.**
> Gemessen bei voller Schräglage: `wordmark rotate(-1.805deg)`, `stack rotate(2.576deg)` — beide
> über den genannten 1,5°. Kein Fehler im Code: `maxGrad` ist das Budget des
> **Schräglage-Kanals**, und darauf addieren zwei weitere Kanäle mit eigenem Budget (Flattern
> 0,9° bei Tempo, Deck-Auffächern 2,6° an der Drehrate) — dieselbe Buchhaltung wie Trauma-Roll
> gegen `MAX_TILT` in `camera-rig`. Summe im schlechtesten Fall: **2,4° (Wortmarke), 2,6°
> (Deck)** — beides innerhalb der Zielbild-Spanne „1–3°", also gestalterisch in Ordnung.
> *Aber die Panel-Zeile versprach eine Summe und nannte einen Summanden. Sie nennt jetzt alle
> drei Budgets und den schlechtesten Fall.* Gefunden hat es die Abnahme, nicht ich. Die Regler sagen es mit (`⚠ above the agreed ceiling` über 3° / 6 px),
damit die Grenze nicht in einem Dokument verschimmelt, während jemand am Schieber dreht.

**Der Einschlag hängt am EREIGNIS, nicht an einer Uhr** (E-15): `hud` ist ein Wirker, den die
Partituren nennen. Kein Abgriff auf `einschlagT` — das wäre eine zweite Wahrheit über denselben
Moment.

**Federn-Selbsttest, 4/4 ✓** (im Panel): Feder erreicht 1 nach 1 s · Überschwinger vorhanden ·
4/4 Träger im DOM gefunden · **Kontrollprobe: `stiff = 0` bewegt nichts.** Die letzte Zeile ist die
wichtige — ohne sie könnte der Test nicht durchfallen.

### PM-72 · Ein Element wegzuschieben ist keine Gestaltung, solange man nicht sagt, WOHIN

Die Diagnose-Marke saß auf `left:14 bottom:12` — **im Pop-Feld**, zwei Pixel daneben. Die Sorte
Kollision, die man im Standbild nicht sieht und im Betrieb dauernd. Erster Zug: Mitte unten,
Begründung „dort steht nichts". **Am Bild angesehen war das eine Verschlechterung:** die Mitte
unten ist die symmetrischste Stelle des Schirms, Symmetrie liest als Wichtigkeit, und aus einem
Diagnose-Streifen wurde eine Bildunterschrift, die die vier Ecken ausstach.
Jetzt: unten links **über** der Pop-Platte, linksbündig, leise. Die Ecken behalten die Ecken, die
Marke bekommt ein Regal.
*PM-49 („bei Formfragen ansehen, bevor man messt") hat hier meinen eigenen ersten Zug widerlegt —
und das ist der Beleg, dass die Regel etwas tut, statt nur dazustehen.*

### PM-73 · Eine Reihenfolge im Runner ist eine Abhängigkeit, auch wenn sie nicht so aussieht

Die Ecken-Markierung stand zuerst im Verdrahtungsblock — **aber das Zahnrad wird 30 Zeilen weiter
unten gebaut.** `markiere(gear && gear.el, 'gear')` hätte brav gewarnt und die Ecke wäre stumm
geblieben: die Platte fehlt, die Flug-Reaktion findet keinen Träger, und **beides sieht aus wie
„Effekt zu schwach"**, nicht wie „Knoten nicht da". Deshalb meldet `hud-flight.zeile()` jetzt
`4/4 carriers found` bzw. `⚠ carrier missing: …` — *eine Reaktion auf einem fehlenden Knoten ist
eine stille Nichtreaktion, und stille Nichtreaktionen sind in diesem Projekt die teuerste
Fehlerklasse.*

### Was Slice G offen lässt

Aus dem Zielbild §S14 sind **Punkte 4–6 nicht gebaut**, mit Grund:

- **HUD-Würfel in Pet-Grundfarbe** (statt des heutigen Pop-Feldes) — die Platte und die Reaktion
  stehen, der Würfel ist ein eigener kleiner Renderer wie das Zahnrad. Nächster Zug in G2.
- **Würfel-Belohnungsflug** (getroffener Würfel fliegt zum HUD-Würfel, Score zählt hoch) — braucht
  den HUD-Würfel als Landeplatz. Die Bauform steht: `card-flight.js` ist die Vorlage, und das
  Zielbild listet die fünf Bedingungen, die davon übernommen werden MÜSSEN (Kamera-Raum, Federn,
  Landeplatz einfrieren, kein Ziel = eigene Position, Zielgröße aus der Pixelhöhe).
- ⏳ **Augen-Logik des Würfels** (Level-Fortschritt 1…6) — **liegt bei Georg** („Logik dazu liefere
  ich nach").

### Was die Abnahme gefunden hat — drei Defekte, und zwei machten dieses Dokument falsch

Die Abnahme hat Slice G als **needs_work** zurückgegeben, und sie hatte in allen drei Punkten
recht. Alle drei sind behoben und nachgemessen; die Befunde bleiben stehen, weil sie zusammen
eine Klasse bilden: **stumme Fehler in einer Gestaltungsschicht.**

**PM-74 · Eine ungültige CSS-Zeile nimmt ihre Nachbarn mit, und sie sagt es niemandem.**
Die Rost-Textur — Georgs ausdrückliche Vorgabe — hat **auf keiner der vier Platten gerendert.**
Gemessen: `getComputedStyle(el, '::before').backgroundImage` = `"none"`, während die Regel im
Stylesheet stand. Ursache: die Tönungsebene war `var(--kfb-plate-tint)`, und das ist eine
**Farbe**. Eine Farbe ist keine gültige `<bg-image>`-Ebene → die **ganze** Deklaration wurde
verworfen, **Fase und Rost fielen gemeinsam aus.** Übrig blieb `background-color`: ein flaches
Braun mit Schlagschatten — das im Screenshot **wie eine Absicht aussah.**
*Und genau das ist der Punkt: ich habe Slice G nach PM-49 gebaut („bei Formfragen ansehen"), habe
angesehen, und das Ansehen hat den Fehler nicht gefunden, weil das Ergebnis plausibel war. Eine
fehlende Textur sieht aus wie eine dezente Textur. **Ansehen findet falsche Formen, nicht
fehlende Ebenen** — dafür braucht es eine Messung, und die kostete eine Zeile.*
Behoben: `linear-gradient(var(--tint), var(--tint))` — eine Ein-Farb-Rampe ist eine echte Ebene.

**PM-75 · Eine CSS-Regel, die nichts trifft, ist die stillste Fehlerklasse dieses Projekts.**
Der Zahnradknopf heißt `#kfb-gear`, nicht `.gear`. **Drei Regeln waren toter Text**, und die
Folge ist die pointierteste dieser Sitzung: das Zahnrad stand weiter auf `top: 14px`, während die
drei anderen Ecken auf 16 gingen. **Zwei Pixel — an genau dem Element, das das Zielbild als
Beispiel für „nicht harmonisiert" genannt hatte.** Und ich hatte „der Befund aus dem Zielbild,
Zeile für Zeile behoben" in dieses Dokument geschrieben, ohne den Selektor gegen das DOM zu
prüfen.
Zweiter Teil desselben Befunds: `--kfb-inset` und `--kfb-rust` lasen auf dem Knopf **leer**. Die
Variablen standen auf `#tv-hud, #kfb-hud, #tv-frame`, der Knopf lebt in `#kfb-ui` — einem
**Geschwister**-Teilbaum. *Custom Properties erben nach unten, nicht seitwärts; und `var()` ohne
Fallback macht aus einer leeren Variable lautlos gar nichts.* Behoben: Deklaration auf `:root`,
Selektor auf `#kfb-gear`. Gemessen danach: `gearTop 16` = `wortmarkeTop 16`, `--kfb-rust` gesetzt,
die zahnradeigene Plattentönung wirkt.

**PM-76 · `define()` prüft beim DEFINIEREN — also warnt eine späte Registrierung dauerhaft.**
Drei Warnungen je Ladevorgang (`card.collect` · `dice.collect` · `ground.touch`: „Wirker „hud"
ist nicht registriert"), obwohl der Wirker zur Laufzeit tadellos lief (gemessen: `hits` zählt).
Ursache: `fx.defineAll(KASKADEN)` läuft vor `fx.setWirker('hud', …)`, und `define()` prüft die
Wirker sofort. Folge: `unbekannteWirker` klebte die ganze Sitzung auf **3**.
**Das ist genau die Fehlerklasse, gegen die ich in Slice B den Zähler gebaut habe** — eine
Warnung, die immer steht, wird nicht gelesen (BUG-07, PM-55) — und ich habe sie in Slice G selbst
erzeugt, indem ich `hud` per `setWirker` nachgereicht habe statt in die Wirker-Tabelle zu
schreiben. **`wake` hatte in Slice F das richtige Muster vorgemacht** (früh registrierter Eingang,
spät gebautes Ziel, `let` wird beim Aufruf gelesen) — zwei Slices später habe ich es nicht
angewandt. Behoben, `unbekannteWirker` gemessen: **0**.

**Nebenbefund, mitbehoben:** die Stapel-Platte umschloss die Auffächer-Reserve des Hovers (die
oberen ~17 px eines 64-px-Kastens) und stand bei 0–1 Karten als großes leeres Blech da. Sie
umschließt jetzt den belegten Teil.

**Was ich daraus mitnehme, und es gehört in die Arbeitsweise:** Slice G war der erste Slice ohne
Messinstrument für sein eigenes Ergebnis. C, D und F hatten je eine Zahl, die durchfallen konnte
(`3/3 Beats`, `0 off source`, `0 Lecks`) — G hatte ein Bild. **Und ein Bild kann nicht
durchfallen.** Die drei Defekte sind alle in der Lücke entstanden, die das offen gelassen hat.
→ Konsequenz für Slice H: die vier Weltstimmungen brauchen **nicht nur vier Bilder, sondern eine
Messung je Bild** (das Sättigungstor liefert sie: `gate self-test 4/4 ✓`). Das war ohnehin
geplant — jetzt ist auch klar, warum es nicht optional ist.

### Zweite Abnahmerunde · PM-77 und PM-78

**PM-77 · Ein Zwischenspeicher, der `null` behält, ist ein Schalter, der auf AUS klemmt.**
Gemessen: **zwei von vier Ecken bekamen keine Reaktion** — `wordmark` und `gear` standen bei
`(NICHTS)`, während `pop` und `stack` sauber liefen. Eine Zeile:
`if (ecken[name] !== undefined) return ecken[name];`

Zwei Fehlerarten darin, beide aktiv:
1. **Negativ zwischengespeichert.** `createHudFlight()` läuft im Verdrahtungsblock, und die
   nächste Zeile rief den Selbsttest → `ecken()` → `ecke('gear')` — **rund 30 Zeilen bevor das
   Zahnrad gebaut ist.** `null` war damit festgeschrieben, und keine spätere Markierung konnte es
   einlösen. **Das ist PM-73 eine Ebene tiefer:** ich habe dort die Reihenfolge des
   `markiere`-Aufrufs korrigiert und den Zwischenspeicher stehen gelassen. *Eine Reparatur an der
   Reihenfolge repariert nichts, wenn jemand das Ergebnis der falschen Reihenfolge aufbewahrt.*
2. **Positiv zwischengespeichert, Knoten weg.** Der Wiedereinhänger baut Wortmarke, Leinwand und
   Tastenlegende neu; der gemerkte Knoten war danach **abgehängt**. Ein `style.transform` darauf
   wirft nicht — es landet nur nirgends.

**Und der Selbsttest hat mitgelogen.** `ecken()` prüfte auf Existenz (`!!ecke(n)`) statt auf
**Verbundenheit** — also meldete er die Wortmarke als vorhanden, während sie tot war. Der Test,
den ich in Slice G ausdrücklich GEGEN „eine Reaktion auf einem fehlenden Knoten ist eine stille
Nichtreaktion" gebaut habe, konnte genau diesen Fall nicht sehen.
Behoben: Zwischenspeicher mit Nachprüfung (`isConnected`), Selbsttest prüft dasselbe, und der
Selbsttest läuft erst, nachdem alle vier Ecken markiert sind.
Gemessen danach ([`02-G-reaktion.png`](./evidence/02-G-reaktion.png), Zahlen IM Bild):
```
wordmark: translate3d(-4.07px, 1.42px, 0px) rotate(-1.805deg) skewX(-0.762deg)
gear:     translate3d(-1.63px, 0px, 0px)
pop:      translate3d(2.44px, 0px, 0px) rotate(1.829deg)
stack:    translate3d(1.98px, 0px, 0px) rotate(2.576deg)
4/4 carriers found
```

**PM-78 · Eine Zeile, die eine Summe verspricht und einen Summanden nennt, ist falsch — auch
wenn jede Zahl darin stimmt.** Siehe den Nachtrag oben bei den Grenzen: drei Kanäle, drei
Budgets, und die Panel-Zeile nannte nur eines. Jetzt nennt sie alle drei plus den schlechtesten
Fall.

### Der eigentliche Befund dieser drei Runden

Slice G brauchte **drei** Abnahmerunden, C, D und F je eine. Der Unterschied ist nicht die
Schwierigkeit, sondern das Instrument:

| Slice | Abnahme | Kann durchfallen? |
|---|---|---|
| C | `water.enter 3/3 Beats` | ja |
| D | `0 off source` über 123 Parameter | ja |
| F | `0 Geometrie-Lecks` auf dem zweiten Schuss | ja |
| G, erste Fassung | ein Screenshot | **nein** |

**Ein Bild kann nicht durchfallen.** Alle sechs G-Defekte (PM-74…PM-78 plus der Nebenbefund)
sind in dieser Lücke entstanden, und sie haben eine gemeinsame Form: **stumme Fehler in einer
Gestaltungsschicht.** Eine ungültige CSS-Zeile, ein Selektor ohne Treffer, eine leere Variable,
ein toter Knoten — nichts davon wirft, nichts davon warnt, und alles davon sieht im Bild aus wie
„etwas dezenter als gedacht".
→ **Regel für jeden Gestaltungs-Slice ab hier:** neben das Bild gehört eine Zahl, die nein sagen
kann. Bei G sind es jetzt drei (`4/4 carriers found`, die Federn-Kontrollprobe, die
Budget-Summe). Bei H liefert das Sättigungstor sie (`gate self-test 4/4 ✓`) — deshalb ist es
dort nicht optional.

### Die ersten drei Züge von Slice H „Weltstimmungen"

1. **`molten` zuerst** (E-36) — der härteste Test für das Sättigungstor. Besteht molten, bestehen
   alle. Das Tor steht seit S10, `gate self-test 4/4 ✓` ist die Abnahme.
2. **Die Farbeingänge sind schon da und kosten nichts:** `trail.setTint()` (Slice D),
   `rauch.setTint()` (Slice F). Dazu die Presets für Ozean, Nebel, Rim und Wolken, die `day-night`
   ohnehin mischt. **Kein Shader muss angefasst werden** — das war der Sinn der beiden Slices.
3. **Vier Bilder, ein Aufruf.** Loop A kann Stimmungen nicht zeigen (es ist eine Kaskaden-Kamera),
   also braucht H eine eigene Kachel — vier Weltstimmungen nebeneinander, `hidden` im Bild
   gestempelt. Das ist der einzige neue Prüfteil, den H braucht.

## 09 · Betriebsregeln

- **D-08 (Design Critique) ist Co-Deliverable jedes Exports** (Georg, 30.8.): North Star und
  Guideline für Animation, Transition, VFX und Audio-FX. Jedes Session- und Re-Home-Paket enthält
  `docs/CRITIQUE_Animation-Transition-VFX_v1.md` neben `LIVING_KFB-Travel-Globe.md`. Ein Export
  ohne beide ist unvollständig.

- **Messen vor Diagnose**, und die Kontrollprobe vor der Messung: ein Prüfwerkzeug ohne
  Kontrollprobe ist eine Meinung (PM-41).
- **Georg kann keine Konsole lesen.** Jede Zahl, mit der argumentiert wird, gehört ins Panel.
- **KISS, besonders bei UI-Gimmicks** (§6g).
- **Kein Gimmick ohne Rückweg** — jeder Umbau braucht den Schalter, der die Quellfassung
  wiederherstellt.
- **Namen statt Nummern.** Wer im Chat „S10a" sagt, sagt „Sättigungsregel" daneben.
- tinyskies = Benchmark, nicht Grundlage (siehe `github.md`).

---

## 07 · Post Mortems — Index

Die Einträge stehen in §7 (Nummern 1–12) und verstreut in den Slice-Berichten (10, 40–48).
**PM-49…PM-52** in §07b · **PM-54…PM-56** in §05j · **PM-57…PM-62** in §05k · **PM-63…PM-67** in §05l · **PM-68…PM-71** in §05m · **PM-72…PM-78** in §05n (alle sechs
stecken im Prüfwerkzeug, nicht im Spiel — vier davon logen nach oben).
**Das ist selbst ein Befund:** der wertvollste Teil dieser Sitzung ist der am schlechtesten
auffindbare. Bis zum physischen Umzug gilt dieser Index.

| Thema | Nummern | Kernregel |
|---|---|---|
| **Eigentümerschaft** | 1, 10, 11, 40 | Zwei Verwalter derselben Sache sind ein Fehler; eine Summe ohne Eigentümer kann man nur raten |
| **Messen** | 41, 42, 44, 45, 46 | Kontrollprobe zuerst · eine Einheit · ein Geltungsbereich · Zahlen ablesen statt erinnern · keine Urteile über Zufallsgrößen |
| **Grenzen ziehen** | 47 | Die richtige GRÖSSE messen — wer eine Grenze zieht, verbietet auch |
| **Bewegung** | 19, 22, 39, 48 | Sollwert darf nicht springen · fehlt Flüssigkeit, fehlt ein MODELL · Wegpunkt ist kein Federziel · ein Sichteffekt darf keine Zeit steuern |
| **Zustände** | 3, 12, 13, 24 | Deklaration über dem Leser · Fehler im Tick tötet den Tick · rAF-Fehler tötet die Welt · wer in einem Zweig abbaut, beendet dort |
| **Annahmen** | 43, „Rahmen" | Aus einem Dateiformat auf eine Eigenschaft schließen ist Raten · vorhanden ≠ brauchbar |

---

## 10 · Dokumentenregister

**Ein Dokument ohne Registereintrag existiert nicht.**

| Kennung | Dokument | Status | Zweck |
|---|---|---|---|
| **D-01** | [`LIVING_KFB-Travel-Globe.md`](./LIVING_KFB-Travel-Globe.md) | aktuell | dieses — Übergabe, Entscheidungen, Post Mortems, Stand |
| **D-02** | [`S10_Weltstimmungen_und_Georgs_Brief.md`](./S10_Weltstimmungen_und_Georgs_Brief.md) | aktiv | Sättigungsregel-Herleitung · Weltstimmungen · Rule of Three · Asset-Vormerkungen (`spring.glb`, `bath.gltf`) |
| **D-03** | [`S9-S10_Stopps_Maske_BoxLook.md`](./S9-S10_Stopps_Maske_BoxLook.md) | aktiv | die STOPP-Familie · Canvas-vs-Fenster · Papier-Blatt-Messung |
| **D-04** | [`S14_HUD-Einfassung_Zielbild.md`](./S14_HUD-Einfassung_Zielbild.md) | aktiv | HUD-Zielbild: vier Ecken, Pop/Cards, Tempo in der Gear, Würfel-Belohnung |
| **D-05** | [`BUGS_offen_Uebergabe.md`](./BUGS_offen_Uebergabe.md) | **aktuell — zuerst lesen** | sechs offene/ungeprüfte Bugs mit Messwerten, Verdacht und Fix-Vorschlag |
| **D-06** | [`../github.md`](../github.md) | aktuell | Quellen-Zuordnung tinyskies, Screen-Map, letzter Sync |
| **D-07** | `BACKLOG_globe.md` | aktiv | Gimmicks, jederzeit dazwischen |
| **D-08** | [`CRITIQUE_Animation-Transition-VFX_v1.md`](./CRITIQUE_Animation-Transition-VFX_v1.md) | **aktuell** | Design Critique Animation · Transition · VFX · Screen Shake · Micro-Feedback · Kaskaden · Audio-FX. Teil 1 = Befunde, Teil 2 = Selbstkorrektur + Bauordnung (`fx-bus`/`fx-script`/`trauma`) + QA-Subloops + Solution Drafts nach Wirkung/Aufwand |
| **D-09** | [`HANDOVER_KFB-DecisionLog.md`](./HANDOVER_KFB-DecisionLog.md) | **aktuell** | Lean-Handover, damit ein Coworker oder frischer Chat den DecisionLog als Skill baut. Demo und Vorlage: `KFB Entscheidungen v1.dc.html` |

**Code:** `globe-v3/` (Runner `globe-poc.js`), Einstieg `KFB Travel Globe v3.dc.html`.

⚠ **NACHTRAG zu D-02/D-03/D-04:** diese drei sind entstanden, weil ich Abschnitte angehängt habe,
statt das Living Document zu führen — also genau die Anti-Patterns „Archiv statt Übergabe" und
„Register fehlt". Sie bleiben stehen (additiv), sind ab jetzt registriert und werden nicht weiter
verzweigt: neue Erkenntnisse kommen HIERHER.

⚠ **NACHTRAG zu meinem eigenen Vorschlag (29.8.):** ich wollte in drei Dateien trennen —
`LIVING` / `CHANGELOG` / `POSTMORTEM`. Der Skill sagt das Gegenteil: **ein** Dokument, additiv, mit
Post Mortems als Abschnitt darin. Mein Vorschlag hätte das Anti-Pattern „Register fehlt" verdoppelt
und die Übergabe auf drei Dateien verteilt. Verworfen, bevor gebaut.

**D-10 · `docs/QUELLE_tinyskies-Inventar.md`** (30.8.) — Bestandsaufnahme der Quelle auf
Georgs Frage: Fahrzeuge, Travel Modes, FX, Mond und Weltraum. Gelesen wurden alle **78**
Dateien in `client/src/game/` (Verzeichnis vollständig), gelesen im Inhalt nur die genannten.
**Analyse, kein Slice.** Drei Befunde, die den Masterplan berühren:
1. Die Quelle hat den **Fahrzeug-Vertrag schon** — `type VehicleGameFeatures`, und der
   Frame-Loop fragt die Tabelle statt den Typ. Bestätigt den Backlog-Vorschlag zur Badewanne.
2. Der **Cosmic Void** ist ein zweiter Ort mit ~20 verstreuten `if (!inCosmicVoid)` — die
   Rechnung für einen Weltwechsel ohne zentrale Abschalttabelle. **Belegt, dass E-32**
   (Sprung auf DERSELBEN Kugel, kein Weltwechsel) **die günstige Entscheidung war.**
3. Der **Mond ist eine Uhr, keine Kulisse**: `MoonThreat` (34 kB) plus fünf `Braziers`, die
   mit `eternalFlameCount` bezahlt werden und ihn dauerhaft einfrieren. Die STRUKTUR daraus
   (Druck + Währung aus mehreren Quellen + sichtbares Ziel) ist das, was uns fehlt — und das
   ist eine Design-Frage für Georg, kein Slice.

---

## Ab hier: Stand, Architektur, Backlog, Quellen, Post Mortems (gewachsene Nummerierung)

Die folgenden Abschnitte 1–7 sind der gewachsene Teil und bleiben **unverändert stehen** (additiv).
Ihre Zuordnung zu den Skill-Abschnitten:

| alt | Skill-Abschnitt |
|---|---|
| §1 Was Travel Globe ist · §2/§2b Stand | 03 Architektur (Teil) |
| §3 Offene Befunde | 08 Offene Fragen |
| §4/§5 Was noch nicht übernommen ist | 06 Recherche & Quellen |
| §6 Sprints und alle §6x-Berichte | 05 Backlog + Prozessberichte |
| §6g Arbeitsregel KISS | 09 Betriebsregeln (Verweis) |
| §7 Fehlerklassen 1–12 | 07 Post Mortems (Index oben) |

---

## 1 · Was Travel Globe ist

Eine Kugelwelt, auf der ein KFB-Pet auf einer Karte fliegt. Die Flugphysik, die Kamera, das
Gelände und die FX sind aus **tinyskies** portiert (`dannylimanseta/tinyskies`, Branch
`cursor/globefly-multiplayer-globe-flight-game`); der Avatar, der Klang, der Erzähler und die
Karten kommen aus **KFB Travel v17**. Die Trennlinie ist Absicht: tinyskies besitzt das
Fahrgefühl, KFB besitzt die Figur und die Bedeutung.

**Warum tinyskies-Physik und nicht der v17-Controller:** `flight-controller.js` klemmt eine
ABSOLUTE Höhe und drückt mit einer Kufe gegen den Boden — auf gewürfeltem Gelände stand die
Klemme dauernd an, daraus wurden drei Runden „controls sluggish". In `carpet.js` ist die Höhe
RELATIV zur Oberfläche, ohne absolute Grenze, plus Klippen-Gleitbonus.

## 2 · Stand v2 (einchecken-fertig)

- **Kugel, Flug, Kamera, Gelände, Sterne, Himmel-Presets** — 1:1 aus tinyskies, Konstanten
  unverändert. Globus-Radius 5 (nicht 10: darunter halbiert sich die Polygondichte pro
  Weltmeter und die Facetten werden doppelt so groß).
- **Avatar**: `card-carrier.js` aus v17 (gewellte Kartenplatte mit echter Dicke, Sitz liest die
  Fläche jeden Frame ab, Clip-Ebene an der Papierfläche) + Cube-Pet aus dem kanonischen
  Pet-Stack. Karte = **kanonische KFB-Rückseite**, EINE Ink-Outline, deckendes Papier.
- **Pet-Verhalten**: `pet-kinetics.js` (Squash volumenerhaltend, Federn zweiter Ordnung mit
  Überschwinger → cartoonige Trägheit) und `pet-facing.js` (im Stand zur Kamera, mit Tempo in
  den Kurs) unverändert aus v17. Reihenfolge ist Vertrag: `pet.update` → Kinetik → Facing.
- **Pet-Look (v2c)**: `pet-surface.v1.js` (Clay/Papier, triplanar, `flatShading: false`) und
  `pet-lighting.js` (PMREM-Environment, kaltes Gegenlicht, Welt-Tönung).
- **Klang**: ein Ausgang, zwei Motoren (`audio-switch.js`): KFB-Synth aus v17 oder die
  tinyskies-Mechanik. tinyskies liefert keine Audiodateien (0 von 201 im Repo) — ohne Quellen
  läuft der Fallback und die Marke sagt `tiny(synth)`.
- **Erzähler**: Reflexe über Systemstimmen, Standard aus.
- **Bedienung**: EIN Zahnrad (GLB aus dem Repo, sonst gebauter Kranz), dahinter ein Panel mit
  fünf Klappern nach Nutzungshäufigkeit. Die zwei Messwert-Leisten sind unsichtbar und nur bei
  Hover lesbar; ihr Inhalt steht im Panel unter „Technik".

### Kanon-Zahlen, die man nicht raten darf
| Größe | Wert | Herkunft |
|---|---|---|
| Globus-Radius | 5 | tinyskies durchgehend |
| Kartenbreite in Welt | 0,075 | wie der tinyskies-Teppich |
| Rig-Maßstab | 0,075 / 3,0 | Rig hat ABSOLUTE Konstanten für 3,0 Breite — nur die GRUPPE skalieren |
| Pet im Sitz | 2,2 | v17-Stock war 1,15 = 31 % Kartenbreite; Referenz ~69 % |
| Kamera-Abstand | 0,52 | 0,71 war aufs tinyskies-Bild gerechnet, dort ist der Teppich die Hauptsache |
| Bildhöhe | 0,11 rad | Kamera blickt nach unten → Avatar sitzt höher im Bild |
| agl-Umrechnung | ×26,2 | v17-Klangbereich 2…18 gegen unsere 0,03…0,64 |
| Würfel-Abstand / -Größe (v3) | 2,2 / 0,20 | v17 fliegt in einer Ebene mit 360/32 (Winkelradius 2,2°) — hier gerechnet auf 2,6° |
| Würfel-Höhenwinkel (v3) | 10…15° | Krümmung: bei 2,2 u Abstand fällt die Kugel um d²/2R = 0,48 u weg; 3° (v17) läge hinter Bergen |
| Anrollzeit (v3) | 2,6 s | Tempo-Boden 0 → 0,28, `smoothstep` — Georg: „rollt selbst an" |

## 2b · Neu in v3 (29.8., Sprint S1 + S1b in einer Runde)

- **Startansicht** (`intro-flight.js`, NEUE Arbeit): Kugel von außen (2,75·R) → Schwenk auf den
  Standort → Anflug auf 1,22·R → Blende in die Verfolgerpose. 6 s, jede Taste und jeder Klick
  bricht ab (0,45 s Blende statt Schnitt). **EIN Kamerabesitzer:** der Rig wird während des
  Intros jedes Bild mit `snapTo` nachgeführt, das Intro LIEST diese Pose und blendet dagegen —
  bei Mischung 1 kommt bitgenau die Rig-Pose heraus. `R` wiederholt.
- **Flugstart aus dem Stand**: `carpet.js` hat als einzige Änderung an der 1:1-Portierung einen
  **beweglichen Boden** unter dem Tempo (`setSpeedFloor`, Standard = MIN_SPEED). Der Start fährt
  ihn von 0 auf 0,28 — ein steigender Boden ist kein zweiter Antrieb, `carpet.update` bleibt der
  einzige Schreiber auf `speed`.
- **Maus und Touchpad** (`pointer-look.js`): **eine Gebärde** (Links-Ziehen), im Panel umschaltbar
  zwischen *umsehen* (Standard) und *lenken*; **Alt/Option + Ziehen** macht das jeweils andere
  (Georgs Wahl). Umsehen ist eine STARRE Drehung der fertigen Kamera um den Avatar (Position und
  Orientierung mit demselben Quaternion) — bei Versatz 0 bleibt die Rig-Pose stehen, der Avatar
  bleibt an derselben Bildstelle, die Welt dreht sich um ihn. 360° herum, Höhe ±83° (Untersicht
  erlaubt), Rückstellung 1,5 s. Lenken: **Eigentümerwechsel**, solange gezogen wird schweigen A/D.
  `contextmenu` unterdrückt; `pointerType: touch` bleibt draußen, damit der Pinch-Zoom seine
  Ereignisse behalt.
- **Tageszeit läuft** (`day-night.js`, Standard AUS): interpoliert zwischen den drei Presets —
  sieben Lichter, Nebel, Himmelsverlauf (4 Hz neu gemalt), Sterne, Atmosphärenglut, Wolken.
  **Grenze, bewusst:** Land- und Ozeanfarben stecken als Vertex-Farben im Mesh und bleiben in der
  Farbwelt der Startzeit.
- **Blob-Schatten** (`ground-shadow.js`, Port aus v17 + `placeOriented`): größer und blasser mit
  der Höhe — die Höhenauskunft am Boden. Auf der Kugel wird die lokale Y-Achse auf die
  Flächennormale gedreht (Quaternion, nicht Euler).
- **Kenney-Props als Landmarken** (`globe-landmarks.js`, NEU): Fibonacci-Gitter, Wasser wird
  verworfen, Höhe aus `surfaceAltitudeAt` — dieselbe Funktion, die die Flugphysik liest.
  Gemessen beim Bau: **11 Modelle, 330 Exemplare, 18 Draw-Calls** (416 Orte fielen ins Wasser).
- **Sky-Dice** (`sky-dice.js`, Port): Sitze rechnen im TANGENTIALRAHMEN statt um die Welt-Y-Achse;
  Kopplung, Atem, Wurf und der Richter unverändert. Standard aus, `K` wirft.
- **Effekte**: Radial-Blur mit Tempo (`post-radial.js` 1:1 aus v17, dritte Fassung ohne
  Rendertarget), Laub am Boden (`ground-leaves.js`, 96 Instanzen, Rate aus Tempo × Bodennähe),
  und die **Reparatur der stummen Tempostreifen** (siehe Befund 7).

## 3 · Offene Befunde (Stand 29.8.)

1. ~~**Keine Startansicht, kein Flugstart.**~~ **Erledigt in v3** (`intro-flight.js` + Tempo-Boden).
   Was bewusst offen blieb: das Intro zeigt noch keine Wortmarke und keine Pet-Auswahl — das ist
   v4 (Georgs Entscheidung, siehe S1c).
2. ~~**Sky-Dice fehlen.**~~ **Erledigt in v3**, mit Tangentialrahmen und neu gerechnetem Maßstab.
   Offen: sie hängen an keinem Takt (in v17 pulsen sie auf den Beat) — unser Klang gibt keinen
   Beat heraus.
3. ~~**Kenney-Props als Landmarken fehlen.**~~ **Erledigt in v3.** ⚠ **Richtigstellung zu diesem
   Dokument:** hier standen als Kits „city, castle, holiday, market, arcade, prototype". Im Index
   (`asset-repo.json`, 986 Assets) liegen tatsächlich `kenney_nature-kit` (329),
   `kenney_fantasy-town-kit_2.0` (167 — MODULE: Dächer, Wände, Zäune, keine ganzen Häuser),
   `kenney_survival-kit` (80) und `GLB_hexagon_kit` (72 — GANZE Gebäude: Burg, Turm, Mühle,
   Zauberturm, Markt). Landmarken kommen deshalb aus dem Hexagon-Kit, die Streuung aus dem
   Nature-Kit. Der Fantasy-Town-Kit wäre ein Bau-System, kein Streu-Set — eigener Slice.
4. **Kanten-Rundung war ein Eigenfehler, behoben** (v2c). Die Cube-Pets bringen von Kenney RUNDE
   Normalen mit; im Pet Studio heißt der Schalter `face.facet` („Facetten: AN (hart)" gegen
   „Kenney-Rundung (weich, aus)"), und `pet-library.v6.js` facettiert nur auf ausdrücklichen
   Contract-Wunsch. Unsere Facetten kamen aus einem `MeshPhongMaterial({ flatShading: true })`
   im Runner, das zusätzlich die Colormap wegwarf. Raus damit.
5. ~~**Kein Schatten unter der Karte.**~~ **Erledigt in v3.**
6. ~~**Tageszeit ist statisch.**~~ **Erledigt in v3** (Standard aus). Grenze: der BODEN bleibt in
   seiner Startfarbwelt, weil Land und Ozean Vertex-Farben sind.
7. ⚠ **NEU · Die Tempostreifen waren zwei Fassungen lang stumm.** `speed-lines.js` ist 1:1 aus
   tinyskies und rechnet `(speed − 0,8) / (1,5 − 0,8)` — unser MAX_SPEED ist **0,78**. Der Effekt
   konnte also NIE anspringen: eingebaut, gemessen „ok", im Bild nichts. tinyskies erreicht die 1,5
   mit Upgrades, die es hier nicht gibt. Behoben, ohne die Konstanten der Quelle zu verbiegen: das
   Tempoverhältnis 0…1 wird auf das Fenster der Quelle abgebildet (Regler `lineGain`).
   **Das ist Fehlerklasse 9** (siehe unten) und der Grund, sie aufzuschreiben.
8. **Offen · Kollision Landmarken ↔ Flughöhe.** Die Props sind statisch gesetzt und wissen nichts
   von der Karte; die Karte schwebt 0,03 über Grund, ein Baum ist 0,075 hoch. Man fliegt also
   DURCH Bäume. Entweder Schwebehöhe heben (ändert das Fahrgefühl) oder Props als Hindernisse
   lesen (braucht eine Abfrage „Prop in der Nähe") — Entscheidung vor S3.
9. **Offen · Bildkosten von v3 nicht gemessen.** Landmarken (18 Draw-Calls), Laub (1),
   Radial-Blur (ein Framebuffer-Kopieren je Bild bei Stärke > 0). In einer verdeckten Vorschau
   tickt rAF nicht — `__globe.probe()` und `__globe.berichte()` liefern die Zahlen erst auf
   Georgs Gerät.

10. **Offen · Schatten: Eck-Artefakte und Anschnitt.** Standard ist ab v3c **AUS** (Georg,
    29.8.: „dokumentieren für später und in Settings auf off"). Die Form sitzt jetzt, aber zwei
    Dinge nicht:
    - **Eck-Artefakte an den Rändern.** Das Gitter ist ein 8×8-Quad; die Maske (abgerundetes
      Rechteck) läuft bis in die ÄUSSERSTEN Zellen, und dort liegen die vier Ecknoten auf sehr
      unterschiedlichen Höhen. Die Kante der Maske schneidet damit durch gefaltete Dreiecke —
      als Zacke lesbar. Kandidaten: die Maske nach innen einrücken (ein Ring bleibt unsichtbar,
      billigste Lösung), radiale Topologie statt Quad (Fächer hat keine Ecken), oder mehr
      Unterteilung (kostet Proben).
    - **Wasser und Terrain schneiden weiter an.** Die Abhebung ist 0,0015 Welteinheiten, die
      Facettenkante ist 0,12 lang. Der Boden ist zwischen den Vertices LINEAR, unsere Proben sind
      die gekrümmte Rauschfunktion — die Differenz ist an Facetten größer als die Abhebung, also
      taucht der Schatten unter das Mesh. Ehrlicher Kandidat: an denselben Richtungen abtasten,
      die das Mesh als Vertices benutzt (dieselbe Quantisierung), plus ein Neigungsterm in der
      Abhebung. Alternative: Tiefentest aus — sieht am Hang falsch aus, schneidet aber nie.
11. **Erledigt in v3c · Die Wolken waren mein Eigenbau, nicht die Quelle.** Georg: „exakt von
    tinyskies übernehmen (Blend Mode, Color-Logik etc)". Nachgelesen in `Globe.ts` 5203–5214:
    `blending: AdditiveBlending` (ich hatte **NormalBlending**) und
    `soft = rim*rim*(0.3 + 0.7*upFactor)` mit `upFactor = smoothstep(-0.8, 0.2, y)` (ich hatte
    `mix(0.35, 1.0, rim)` und `smoothstep(-0.9, 0.1, y)`). **Additiv kann eine Wolke nur
    aufhellen; normal geblendet kann sie dunkler werden als der Himmel dahinter** — genau der
    Schmutz-Eindruck. Mein „cloudLift"-Regler von 02:15 war eine Behandlung des Symptoms und ist
    wieder raus. Lehre, dieselbe wie in Runde 7: **bei jedem sichtbaren Element die Stelle lesen,
    die es ERZEUGT** — hier das Material, nicht nur die Platzierung.
## 4 · Was aus v17 noch nicht übernommen ist

**Portabel, hoher Nutzen, kugelneutral:** `ground-shadow` · `travel-heat` (der eine
Regie-Skalar) · `post-radial` (Radial-Blur mit Tempo) · `card-contrails` · `ink-tail` ·
`travel-input` (Cursor-Blick, Gesten) · `card-title` (3D-Titel über der Karte).

**Portabel mit Umrechnung auf Tangentialrahmen:** `sky-cards` · `sky-dice` · `zone-ring`
(Hex-Kacheln, rechnet in einer Ebene) · `prop-scatter` · `note-field` · `hud-cube`.

**Regie-Block, nur zusammen sinnvoll:** `arrival` (EIN Fortschritt für Anflug und Abflug) +
`card-dock` (Detailansicht/Lesepult) + `card-title` + `autopilot` + `journey`/`journey-route` +
`travel-events`. **Das ist der Kern des MVP.** Hängt an `flight-controller`-Zustand; die
Kopplung ist `st` — machbar, eigener Sprint.

**Passt nicht / bewusst draußen:** `voxel-terrain` + `voxel-glyphs` (Würfelgelände einer Ebene;
unser Boden ist eine Kugel — das wäre ein zweites Weltmodell) · `walk-controller` + `mode-owner`
(Boden-Modus, braucht Aufsetzen auf der Kugel) · `skydome-shader` (zweiter Himmelsbesitzer neben
`sky-presets` — einer muss gewinnen) · `settings-overlay`/`-schema` (durch unser Panel ersetzt) ·
`academy-*` + `lesson-search` (Lektionslogik, nach dem Kartenkern) · `narrator-llm`/`-prompts`
(braucht Schlüssel) · `flight-controller` (absichtlich durch tinyskies ersetzt).

## 5 · Was aus tinyskies noch nicht übernommen ist

78 Module in `client/src/game`, portiert sind 10 (Noise, TerrainSurface, SphericalMath, Carpet,
CarpetMesh, RimLight, FlightControls, CameraRig, CarpetTrail, SpeedLines) plus Starfield und
SkyPresets.

**Fahrgefühl, billig und sofort sichtbar:** `CarpetWake` · `CarpetDriftSmoke` · `CarpetLeaves` ·
`Contrails` · `WakeTrail` · `TouchControls` (Mobile) · `DayNightCycle`.

**Welt-Leben:** `BirdFlock` · `SkyJellyfish(+Mesh)` · `OceanFish(+Mesh)` · `FireflyCluster` ·
`FloatingLanterns` · `MeteorShower` · `Aurora` · `GodRays` · `LensFlare` · `RainOverlay` ·
`RainbowArch` · `Volcano` · `WaterSpouts` · `Landmarks`.

**Spielsysteme — Entscheidung nötig, ob KFB sie überhaupt will:** `PaintballSystem`/`-Splash`
(wir schießen Kugeln ohne Trefferlogik) · `Rings`/`RingCollectVFX` · `RaceManager` ·
`UpgradeManager` · `ProgressionManager` · `PackageQuest`/`-Dialogue` · `CarpetPortalSystem` ·
`MoonThreat` · `Braziers`/`EternalFlame*` · `SkyGremlins` · `Void*`.

**Nicht übernehmen:** `Plane`/`BiplaneMesh`/`RemotePlane`/`NpcPlanes`/`Boat*`/`PilotAvatar`/
`Campsite*` (anderes Fahrzeug, anderer Avatar, Multiplayer). `Globe.ts` (223 kB) und `Game.ts`
(279 kB) sind Monolithen — daraus wird zitiert, nicht portiert.

## 6 · Sprints (Themen, flexibel)

**S1 · Ankunft in der Welt** — ✅ **erledigt in v3 (29.8.)**: Startansicht mit Übergabe,
Flugstart aus dem Stand, Blob-Schatten, Tag-Nacht-Lauf. Ziel war „die ersten fünf Sekunden
erzählen, wo man ist" — das steht. Was der Sprint NICHT geliefert hat und bewusst nicht sollte:
Marke, Titel und Pet-Auswahl auf dem Startschirm (→ S1c).

**S1b · Maus und Touchpad** — ✅ **erledigt in v3**. Entschieden (Georg, 29.8.) und gebaut:
**Links-Ziehen ist die eine Gebärde**, im Panel umschaltbar (Standard: umsehen), **Alt/Option +
Ziehen** macht das jeweils andere. Umsehen 360° herum, Höhe ±83° (Untersicht erlaubt),
Rückstellung 1,5 s. Beide Eigentümer-Fallen sind konstruktiv gelöst: Umsehen ist eine starre
Drehung der FERTIGEN Kamera um den Avatar (kein zweiter Kamerabesitzer), Lenken ist ein
Eigentümerwechsel (A/D schweigen, keine Addition).
Georgs Notiz dazu, offen für später: die Belegung ist bisher **Testing-Standard**; für ein
öffentliches Publikum wäre die Flugspiel-Konvention (freier Blick rechts, Steuerung links) die
zweite Vorgabe — deshalb bleibt der Umschalter im Panel, und die Tastenbelegung wandert in S5b
(Reise-Tagebuch als JSON mit Import/Export).

**S1c · Startschirm und Marke** *(v4, Georgs Reihenfolge)* — Wortmarke Kayfa·Bizarro (Irish
Grover) plus Sublines in Letterboxen und Meta-Zeile (Special Elite), wie in `Rollercoaster Ride
v11`; danach das **Pet-Auswahlrad**: 24+ Cube-Pets, Planet dreht im Hintergrund, Scrollrad wählt
den Flug-Avatar. Die Vorlage liegt im Projekt (`build/rollercoaster-v11/pet-select.v7.js`), es ist
also ein Port und keine Erfindung. Vor dem Bauen zu entscheiden: wählt das Rad VOR dem Intro (dann
ist das Intro die Belohnung) oder WÄHREND der Kugelansicht (dann ist es ein Bild, kein Menü).

**S1d · Kleinkram aus v3, sofort machbar** — Kollision Landmarken ↔ Flughöhe (Befund 8),
Bildkosten messen (Befund 9), Sky-Dice an einen Takt hängen (Befund 2).

**S2a · Licht, Belichtung und Prop-Look** *(29.8., teils erledigt)* — Georgs Befund „die gesamte
Szene ist arg überstrahlt" hatte DREI Ursachen, nicht eine:

1. **Die weißen Strahlen waren die Tempostreifen.** Meine Abbildung (0,8…1,5) schob normales
   Vollgas in das BOOST-Fenster der Quelle (Schwelle 1,2, Streifenbreite ×5), das dort einem
   seltenen Diamant-Boost gehört. Jetzt bleibt Reisetempo unter 1,15, nur ↑ hebt darüber.
2. **Die weißen Assets waren PBR gegen 13 Lichteinheiten.** Die Kenney-GLBs bringen
   `MeshStandardMaterial` mit hellen Grundfarben; die Szene fährt sieben Lichter und
   **kein Tonemapping** (quellentreu, `Game.ts` 1138). Der Boden entgeht dem nur, weil seine
   Vertex-Farben für dieses Licht geeicht sind. Props laufen jetzt als Lambert mit gedämpfter
   Grundfarbe (Regler „Props: Grundhelligkeit", Standard 42 %).
3. **Belichtung als Angebot, nicht als Entscheidung:** ein Umschalter „aus (quellentreu) / ACES"
   plus Stärke. Standard aus — ACES verändert ALLES, das ist Georgs Urteil, nicht meines.

Dazu: Props werden in den Boden gesetzt (14 % ihrer Höhe) und **steile Stellen verworfen**
(Neigung aus vier Nachbarproben derselben Höhenfunktion, Grenze 24°, gemessen auf Facetten-
Skala 0,02 rad — feiner gemessen liest man die glatte Rauschfunktion INNERHALB einer Facette).
Gezählt wird, was BLEIBT: 746 Exemplare Ziel, das Gitter läuft über das Sechsfache an
Kandidaten. Gemessen: 18 Draw-Calls, 11,8 ms Mittel bei dpr 2, 0,4 % geklemmte Bilder.

**S2b · Schatten, der den Boden abliest** *(29.8., erledigt)* — Georg: „rund passt nicht zur
eckigen Karte · zu groß · wird vom Terrain angeschnitten". Der v17-Blob ist raus
(`ground-shadow.js` gelöscht, liegt weiter in `terrain-v17/` für den Pet-auf-Karte-Fall, wo Y
wirklich oben ist). Neu: `card-shadow.js` — ein **Gitter aus 8×8 Feldern, dessen 81 Knoten je
Bild `surfaceAltitudeAt` an ihrer eigenen Stelle lesen**. Über einer Kante knickt er mit der
Kante, in einer Mulde sinkt er hinein; ein Quad mit vier Ecken kann das nicht. Maske ist ein
abgerundetes Rechteck im Seitenverhältnis der KFB-Karte (800:447), Grundmaß 1,0× Kartenbreite
(v17: 1,5), Wachstum und Weichheit aus der Flughöhe. **0 % im Regler ist tinyskies-treu** —
der Rückweg, den Georg selbst angeboten hat.

**S2c · UI** *(29.8., erledigt)* — das Panel ist keine Sidebar mehr, sondern eine Karte mit
Abschnitts-Gitter (`auto-fill, minmax(268px, 1fr)`: drei Spalten auf breitem Schirm, eine auf
schmalem), Kopfleiste mit Schließer, kräftigere Klapper-Köpfe (15 px, 700, Tusche auf Papier)
und **Papier-Hintergrund mit schwarzer Schrift** (Grundton + SVG-Körnung + Lichtverlauf; Rot
bleibt „aktiv"). Offen: **S1e · English pass** — alle UI-Texte, Panel-Labels, Marken- und
Erzähler-Sätze strikt EN (Georg, 29.8.). Sie stehen in genau zwei Dateien: das Schema in
`globe-poc.js`, die Sprechtexte in `narrator.js`.
**S3a · Bauplätze im Höhenfeld** *(29.8., erledigt)* — Georgs Befund „einige Assets stehen so,
dass Teile des Basis frei in das Gelände herausstehen" plus die Frage nach Zonen, „die für das
jeweilige Asset groß genug, gerade (leicht schräg ist ok) und sauber eingepasst sind".

Gebaut in zwei Teilen, und die Reihenfolge ist der ganze Trick:

- `terrain-surface.js` führt jetzt eine **Zonenliste** (`setTerrainZones`) und blendet sie in die
  Auslenkung — im COSINUS des Winkels, also ein Skalarprodukt je Zone, kein `acos`. Damit kennen
  Mesh, Flugphysik, Props, Schatten und später die Kartenplätze denselben Boden: *„single source
  of truth … must match Globe mesh vertices and boat / prop placement."* Ein Plateau-Mesh obendrauf
  wäre die zweite Höhenwahrheit gewesen — die Karte flöge hindurch.
  `rawDisplacementAt` ist die unzonierte Fassung, damit die Planung nicht gegen ihr eigenes
  Ergebnis rechnet.
- `globe-zones.js` plant **Standorte** (`planSites`) und **Bauplätze** (`planZones`). Zielhöhe ist
  die MITTLERE Höhe aus 17 Proben (ein Mittelpunkt kann auf einer Facettenkante liegen), die
  Neigung kommt aus kleinsten Quadraten über zwei Ringe und ist auf 10° geklemmt.

⚠ **Die Standorte gehören jetzt dem Terrain, nicht dem Streuer** — Entscheidung (2) aus
`prop-scatter.js`, die ich zuerst gebrochen hatte: `globe-landmarks.js` wählte seine Orte selbst
und ASYNCHRON (nach dem Asset-Index). Dann ist der Globus längst gebacken und jede Zone kommt zu
spät. Jetzt: Standorte wählen → Modell zuweisen (die Zonengröße hängt an der Modellhöhe) →
Zonen eintragen → backen. `?zonen=0` ist der Rückweg.

Und eine Zahl, die zweimal falsch war: **gezählt wird, was BLEIBT.** Auf einer Ozeanwelt sind
90 % der Gitterpunkte Wasser — mit Überzeichnung 6 kamen 1 Zone und 74 Props heraus. Mit 14
(Streuung) und 40 (Landmarken) stehen 746 Exemplare und 26 Bauplätze, 18 Draw-Calls.
Die Schleife bricht ab, sobald das Ziel erreicht ist, also kostet die Reserve nur dort, wo sie
gebraucht wird.

**S3b · Der Verbieger ist ein geteiltes Modul** *(29.8., erledigt)* — `kfb-deform-instanced.js`
liegt in der PROJEKTWURZEL neben `kfb-cartoon-deform.js`, nicht in globe-v3: er gehört keinem
Weltmodell. Inhalt ist die Attribut-Fassung derselben Mathematik (aKc1/aKc2 statt Uniforms — die
Lücke, die der Verbieger selbst notiert), der Ring-Zähler als Torwächter (unter vier Höhen-Ringen
nur neigen und verjüngen), die numerisch nachgezogenen Normalen, und Grenzwerte je Modellart
(`LIMITS.tree/bush/small/rock/build` — ein Baum verträgt Bogen, ein Turm nicht).

⚠ **Dafür musste eine Annahme fallen:** die Teil-Transformation steckte bei mir in der
INSTANZMATRIX. Bequem, aber dann liegen die Vertices je Teil in einem eigenen Raum, und der
Verbieger hätte pro Teil eine eigene Mitte und Höhe gerechnet — das Prop wäre auseinandergefallen.
Jetzt wird sie in die GEOMETRIE gebacken (wie im Verbieger und in `prop-scatter.js`), alle Teile
eines Props teilen eine Box, EIN Attributsatz und eine Biegbarkeits-Entscheidung.
Gemessen: 18 InstancedMeshes, alle mit Attributen, 12,1 ms Mittel bei dpr 2, 0 Fehler.
Regler: „Props: Verbiegung" (0 = Originalform) und „Props: Atem" (Squash, Phase je Exemplar).

**S3b-Nachtrag · zwei Befunde von Georg (29.8., 02:15)**

1. **Die Gebäude waren grau, weil eine Texturreferenz ins Leere zeigt.** Gemessen am geladenen
   GLB: Material `colormap`, Farbe #ffffff, **map: null**. Die Hexagon-Kit-GLBs liegen im Repo
   FLACH in `GLB_hexagon_kit/`, ihre Referenz zeigt auf `Textures/colormap.png` relativ zum
   Modell — dort ist nichts; der Atlas landete beim Import eine Ebene höher
   (`GLB format/Textures/colormap.png`, 512×512). Die UVs im Modell sind korrekt, es fehlte nur
   das Bild. `PACK_ATLAS` lädt es jetzt je Pack einmal (flipY = false wie bei GLTF-Texturen,
   NEAREST, weil der Atlas flache Farbfelder trägt und Filterung Nachbarfelder ineinanderlaufen
   ließe). Das Nature-Kit braucht das nicht: seine Modelle tragen pro Teil ein eigenes
   Farbmaterial (`woodBark`, `leafsGreen`) — deshalb waren die Bäume von Anfang an bunt.
2. **Wolken heller.** Die Quelle multipliziert Farbe UND Deckkraft mit derselben Schattierung —
   bei flachem Blickwinkel bleiben 35 % Helligkeit, und eine Wolke, die dunkler ist als der
   Himmel dahinter, liest als Schmutz. `cloudLift` (Standard 0,85) hebt NUR die Farbe; die Form
   bleibt in der Deckkraft. 0 = quellentreu.

⚠ **Und Fehlerklasse 6 hat wieder zugeschlagen** — von mir selbst, in derselben Sitzung, in der
sie im Panel-Modul als Warnung steht: ein Code-Anführungszeichen (Backtick) in einem Kommentar
INNERHALB des Wolken-Shader-Literals hat `globe.js` beendet. Ein Zeichen, kein Canvas.
Merksatz, jetzt zum dritten Mal: **in einem Template-Literal gibt es keine Code-Anführungen.**
## 6c · Georgs Fahrplan für den Durchflug (29.8.) — eingeplant, mit den offenen Entscheidungen

Reihenfolge ist Absicht: erst die Ziele, dann die Sammlung, dann die Währung.

**S6a · Ziele im Durchflug.** Immer 1–2 Ziele im Blickfeld, neben Landmarken und Karten am Boden.
Vorbild ist `sky-cards` (v17) statt der tinyskies-Diamanten: Karten in Flughöhe, die sich zur
Kamera drehen, damit man sie LESEN kann. Kurve: Ziele werden aus derselben Standortplanung gezogen
wie die Props (`planSites`), also ohne zweite Weltmeinung.

**S6b · Sammeln und Fächer.** Durchflug zählt hoch, Karten stapeln sich unten rechts als
gefächertes Deck, Klick öffnet später ein Overlay mit PDF-Ansicht (Blättern/Wischen). Dazu ein
Tempo-Boost beim Aufnehmen — genau die Mechanik der Diamanten in tinyskies.

**S6c · Reisetagebuch und Speicherung.** Meta, Einstellungen, gesammelte Karten/Decks. Speicher
im Browser (namensraum `kfb.globe.v3.*`, nichts Fremdes anfassen) UND JSON-Export/Import — der
Export ist der Umzug zwischen Geräten, der Browser-Speicher die Fortsetzung ohne Umzug.

**S6d · Sky-Dice als Pickups.** Auf Flughöhe schwebend, langsam um ihre Position drehend.
Durchflug zählt die getroffenen Augen als **Pop Score** (KFB-Pseudo-Währung). Anzeige unten links
in Irish Grover, in einer Flucht mit dem Kartenfächer: ein kleiner UI-Würfel in Pet-Grundfarbe
(vom Nutzer spinbar, läuft langsam zurück), daneben „Pop" und eine juicy deformierte 3D-Zahl.

**S6e · Würfel-Effekte.** Sechs Basiseffekte je Augenzahl, die Farbe ist der Modifier:
rot = schlecht, gelb = visuell/FX, grün = gut. Erst nur temporär und sichtbar, Modifier später.

### Vor dem Bauen zu entscheiden (steht als Frage bei Georg)
1. **Farbkanon.** Die drei Würfel sind heute rot · gelb · **blau** (v17, `sky-dice.js`, „Kanon,
   keine Laune"). Die vorgeschlagene Semantik braucht **grün**. Also: Kanon ändern, blau als
   „gut" lesen, oder vier Würfel?
2. **Welche Augenzahl zählt?** „Die durchflogene Seite" braucht eine Trefferseite — die Mechanik
   dafür ist schon da (`findJudge` sucht die Fläche, die der Kamera am direktesten gegenübersteht;
   dieselbe Rechnung gegen die FLUGRICHTUNG ist die Impact-Seite). Alternative: die Oberseite,
   oder ein Wurf beim Aufnehmen.
3. **Was zuerst:** Karten SAMMELN im Durchflug (Arcade) oder Karte ANFLIEGEN und LESEN (Lesepult,
   S2)? Die Abnahme von S2 ist eine Messung („wie groß muss eine Karte im Bild sein, damit man sie
   liest") — die gilt für beide, aber die Regie ist eine andere.
4. **Welche Karten** werden gesammelt: ein festes KFB-Deck, oder zufällig aus den 130 Decks des
   Index? Das entscheidet, ob das Tagebuch eine Sammlung oder ein Zufallsfund ist.
**S2 · Karten in der Welt** *(MVP-Kern)* — `card-registry` liefert 2–3 Karten als
Landmarken/Sky-Cards auf der Kugel; Anflug, Bremsen, Lesepult, Rückflug über `arrival` +
`card-dock` + `card-title`. Abnahme ist eine Messung, keine Meinung: **wie groß muss eine Karte
im Bild sein, damit man sie liest** — Prozent der Bildhöhe, notiert.

**S3 · Welt wird lebendig** — Kenney-Props als Landmarken + Sky-Dice, dann die billigen
tinyskies-FX (Wake, Driftrauch, Blätter, Contrails).

**S4 · Karten als Terrain** — erst wenn S2 die Lesbarkeitszahl geliefert hat. Technisch: der
Globus ist EINE BufferGeometry mit Vertex-Farben ohne brauchbare UVs, eine Karte „auf den
Polygonen" heißt Triplanar-Projektion oder ein Decal-Quad knapp über der Oberfläche. Deckendes
Papier, sonst kommt das Gutter zurück.

**S5 · Klang wird echt** — reale Dateien statt Synth (Ort noch offen), tinyskies-Namen in
`TINY_SOLL` bedienen.

**Jederzeit dazwischen:** die Gimmicks aus `docs/BACKLOG_globe.md`.

### Zur MVP-Reihenfolge, mit Begründung
Karte-als-Terrain-Textur ist Dekoration; Karte-als-Ziel ist das Produkt. Kayfabizarro sind
Karten, die GELESEN werden — und Text auf gefacettetem, schattiertem Low-Poly bei streifendem
Blick ist nicht lesbar. Deshalb S2 vor S4: erst messen, wie groß eine lesbare Karte ist, dann
entscheiden, ob sie als Terrain überhaupt funktioniert.

## 6b · Wiederverwendbare Bausteine (Analyse 29.8., Auftrag Georg)

Gelesen: `kfb-cartoon-deform.js` (Projektwurzel, 237 Zeilen), `terrain-v17/prop-scatter.js`
(531 Zeilen) und `KFB Card Zone Lab v2.dc.html`. Was davon OHNE den Voxel-Kontext trägt:

### A · Cartoon-Deformer — die Mathematik ist fertig, nur der Träger fehlt

Der Verbieger rechnet **objekt-normiert** (`t = (y − minY) / höhe`), **am Fuß verankert**
(Bogen mit t², Neigung mit t), verjüngt, verdreht leicht und zieht die **Normalen numerisch
nach** (zwei Nachbarpunkte mitverformen, Kreuzprodukt) — sonst kippt das Licht auf der Biegung.
Drei Regeln daraus sind Kanon: eine Sprache für das ganze Set (nie in Weltmetern), ein
Parametersatz je Set mit **Seed je Instanz**, und `segmentsAlongY` als Torwächter — unter vier
Höhen-Ringen SCHERT ein Netz statt zu biegen, dann ist Neigen + Verjüngen der ehrliche Fallback.

**Der Haken, den die Datei selbst notiert:** die Werte liegen in **Uniforms**, also je Material,
also je Prop-Instanz ein eigenes Material — mit InstancedMesh unbrauchbar. `prop-scatter.js` hat
genau das gelöst: dieselbe Mathematik auf **Instanced-Attributen** (`aKc1` = bendX/bendZ/leanX/
leanZ, `aKc2` = taper/twist/phase/rampT). Dort hängt sie aber an `voxel-terrain.js`
(`MOTION_GLSL` für den Würfel-Bob, `PALETTE_GLSL` für die Farbwelt).

**Vorschlag: `kfb-deform-instanced.js` als geteiltes Modul** (nicht in globe-v3, sondern in die
Wurzel neben den Verbieger). Inhalt: die Attribut-Fassung der Mathematik, den Ring-Zähler, die
Normalen-Nachziehung — und **einen einzigen Einhängepunkt** für die Squash-Quelle (GLSL-Schnipsel
+ Uniform). Auf der Kugel füttert ihn das Tempo oder nichts, im Voxel-Terrain der Würfel-Bob.
Damit benutzen Globe, Voxel-Terrain, Card Zone Lab und Pet Studio EINE Verformung.
Grenzwerte je `kind` (Baum verträgt Bogen, Turm nicht): eine kleine Tabelle, kein System.

### B · Card Zone Lab — die Idee heißt „EINE Höhenabfrage"

Das Lab löst genau unser Prop-Problem, nur in der Ebene. Vier Dinge sind übertragbar:

1. **`zoneTopAt(x, z)`** — „die EINE Rechnung, aus der sowohl die Zellen als auch alles, was auf
   ihnen steht, ihre Höhe zieht". Vorher ankerten Deck, Sockel und Karte an einer Konstante und
   schwebten, sobald sich der Boden verschob. Das ist wörtlich unser Befund 8.
2. **Carve + Ruhezone + Rampe am Ufer** (`setZones([{x, z, r, amt}])`): die Zone ist im
   Höhenfeld ausgeschnitten und die Welle rampt am Rand aus — nicht ein Plateau OBEN DRAUF.
3. **Stufen rasten auf ein Raster** (`SUB = CELL/6`): Terrain UND Zone rechnen in derselben
   Quantisierung, deshalb stoßen sie „Kante an Kante, ohne Überhang und ohne Ritze".
4. **Der Wasserstand hängt am tiefsten Zonenpunkt**, nicht an einer Konstante — ein flacher
   Boden bedeutet KEIN Wasser in der Zone.

### C · Terrain-Zonen auf der Kugel — der Weg, den ich empfehle

Zwei Wege, und einer davon ist die Falle:

- ❌ **Plateau-Mesh obendrauf.** Schnell gebaut, aber die Flugphysik liest `surfaceAltitudeAt` —
  sie weiß nichts von einer aufgelegten Scheibe, also fliegt die Karte hindurch. Das wäre eine
  zweite Höhenwahrheit, Fehlerklasse 1.
- ✅ **Zonen IN die Höhenfunktion.** `surfaceAltitudeAt` bekommt eine Zonenliste
  (Mittelrichtung, Winkelradius, Zielhöhe, Rampenbreite) und liefert innen die geglättete Höhe.
  Dann stimmen **automatisch** alle Leser überein: Physik, Globus-Mesh, Landmarken, Schatten,
  später die Karten. Die Zielhöhe ist die MITTLERE Höhe der Zone (sonst entstehen Tischplatten
  im Gebirge), eine leichte Neigung darf bleiben — kleinste Quadrate über ein paar Proben,
  Georg: „leicht schräg ist ok".
  Preis: der Globus ist EINMAL gebacken (256² = 66k Vertices). Zonen müssen also VOR dem Bau
  stehen oder einen Rebuild auslösen (~200 ms, also auf Knopfdruck, nicht am Regler).
  Zonengröße kommt aus dem Modell: Grundfläche × 1,6 (`fp` steht im Asset-Index).
  **Nebengewinn:** damit hat S2 seine Landeplätze für die Karten geschenkt.

### D · Zufällige Landschaft mit echten Biom-Wechseln

Heute zieht der Seed EINEN `terrainType` für die GANZE Kugel — deshalb ist die Welt monoton.
Der Trick für Abwechslung liegt schon im portierten Code: `simplex-noise.js` erzeugt sein
**Ozean-Rückgrat aus drei Großkreis-Achsen je Seed**. Dasselbe Verfahren, eine Oktave tiefer,
ergibt **Biom-Domänen**: jeder Punkt bekommt Gewichte über die vier Presets, Höhe und Farbe
werden gemischt statt geschaltet. Weil es dieselbe EINE Funktion bleibt, stimmen Physik und
Mesh weiter überein.
Was dazugehört: die Prop-Gewichte je Biom und die `_dark`/`_fall`-Namensfassungen aus
`prop-scatter.js` (dort schon gebaut, hier nur zu füttern), und eine **Abnahmezahl**: wie oft
wechselt das Biom auf 60 s Reiseflug? Ohne diese Zahl ist „abwechslungsreich" Geschmack.
Später hängen Wetter und Tageszeit an derselben Gewichtung.

✅ **Gebaut am 29.8. als S3c** (`globe-biome.js`) — mit einer Abweichung von diesem Vorschlag:
nicht drei Großkreis-Achsen, sondern vier Ankerrichtungen mit sphärischem Softmax, weil das
stetig ist, auf 1 summiert und mit `sharp` EINEN Regler für die Übergangsbreite hat. Und die
Schwelle bleibt global (Begründung im S3c-Abschnitt). Abnahmezahl gemessen: 1,75…2,75 Wechsel
je 60 s.
13. **Ein Fehler im rAF-Loop tötet die ganze Welt — und sieht aus wie „Seite lädt nicht".**
    Wirft der Frame-Körper, wird das `requestAnimationFrame` am Ende nie erreicht: die Schleife
    ist tot, das Canvas bleibt beim einen sofort gezeichneten Startbild stehen, und das ist Georgs
    hellblauer Schirm — ohne jede Zeile in der Konsole, wenn der Fehler später als der erste Tick
    passiert. Ursache am 29.8.: mein Servo-Code las `S.heading` **37 Zeilen vor**
    `const S = carpet.state` im selben Block. Temporal dead zone.
    Drei Lehren, und die dritte ist die unbequeme:
    · **Die Schleife wird angefordert, egal was passiert** — `try { körper } finally { rAF }`.
    · **Ein Bezeichner, den man vor seiner Deklaration liest, ist keine Flüchtigkeit, sondern eine
      Reihenfolgen-Wahrheit** — wer in einen 250 Zeilen langen Block oben etwas einfügt, muss
      wissen, was unten deklariert wird. (Zum dritten Mal in dieser Baureihe: Fehlerklasse 3.)
    · **Der Watchdog hat es nicht gemerkt und konnte es nicht** — 291 Ticks, 0 Fehler, während die
      Welt stand. Ein Wächter, der nur seine EIGENE Pflicht zählt, bestätigt sich selbst. Also
      zählt das Panel jetzt auch `Frame loop: N frames · M errors` samt Meldung.
    [BEWEIS] Nach der Reparatur: **240 Bilder in 2 s (118 fps), 0 Frame-Fehler**, Tempo 0,28,
    Biom-Anzeige „Shatter" — vorher 35 Bilder in 145 s.

14. **Ein Zähler fängt geworfene Fehler, keine HÄNGER — und `try/finally` auch nicht.**
    Die Abnahme hat zwei echte Endlosschleifen gefunden, beide alt, beide erst durch die neuen
    FX auslösbar, beide ohne eine Zeile Fehlermeldung:
    · `speed-lines.js`: `speedFactor` war nur nach UNTEN geklemmt. Bei Tempo über 1,25× der
      normierten Obergrenze wird `spawnRate = 0.02 + (1 − speedFactor) * 0.08` null und dann
      negativ — und `while (spawnTimer >= spawnRate) { spawnTimer -= spawnRate }` zählt mit
      negativem Schritt nach OBEN. Auslöser sind genau die Sachen dieser Baureihe: blauer
      Würfel-Boost, Dice-FX-Schlenker, `carpet.setSpeed`. Behoben: Faktor beidseitig geklemmt,
      `spawnRate` mit harter Untergrenze, plus eine Iterationssicherung gegen NaN.
    · `spherical-math.lerpAngle`: `while (diff > π) diff -= 2π` terminiert bei endlichem `diff`,
      bei **±Infinity nie** (Infinity − 2π ist Infinity). Ein einziger Infinity-Wert im Kurs
      friert den Tab ein. Behoben mit `atan2` — schnittfest, und für nicht-endliche Eingaben
      liefert es NaN statt einer Ewigkeit.
    Die Lehre gilt gegen die Reparatur von Fehlerklasse 13: der `finally { rAF }`-Fangkorb und
    die Anzeige „Frame loop: N frames" helfen NUR bei geworfenen Fehlern. Eine Endlosschleife
    erreicht das `finally` nie, und ein Panel, das nicht mehr zeichnet, kann nichts anzeigen.
    **Gegen Hänger hilft kein Wächter, nur eine Schleife, die nicht endlos sein KANN:** jede
    `while` mit variabler Schrittweite braucht eine Iterationssicherung oder eine geklemmte
    Schrittweite — und `Number.isFinite` an jeder Stelle, wo eine Weltgröße in eine Schleife geht.

15. **Ein Werkzeugausfall sieht genauso aus wie ein toter Main-Thread — und führt zur falschen
    Diagnose.** Am 29.8. hingen über ein Dutzend Messungen in Folge („Agent viewport not ready"),
    und sowohl ich als auch die Abnahme haben daraus „Endlosschleife im Startpfad" geschlossen:
    keine Konsolenausgabe, kein Screenshot, kein `eval_js(1+1)` — das Muster passt genau.
    Es war die VORSCHAU. Eine 123-Byte-Testseite ohne eine Zeile Skript lud ebenfalls nicht.
    Kosten: eine unbegründete Bisektion im laufenden Code (`?nahtd=1`-Schalter, wieder entfernt).
    **Der Test kostet zwei Werkzeugaufrufe und gehört an den ANFANG, nicht ans Ende:** bevor ein
    Ladehänger dem eigenen Code zugeschrieben wird, eine leere Seite laden. Lädt die auch nicht,
    ist die Diagnose fertig. (Der Nebenertrag war echt: die zwei Endlosschleifen oben hätten wir
    sonst nicht gesucht — aber gefunden wurden sie durch Lesen, nicht durch die Fehldiagnose.)

16. **Ein Ereignis kann mechanisch fehlerfrei und trotzdem stumm sein — und Fehlerbeheben ist
    kein Entwurf.** Die Sammel-Animation wurde dreimal gerügt („lazy & unschön") und dreimal habe
    ich stattdessen einen BUG behoben: zwei Meshes → eines, Start am Pet → Start am Treffer,
    Weltachsen-Taumeln → lesbare Ebene. Alle drei Reparaturen waren richtig, und keine hat die
    Rüge beantwortet, weil die Rüge nicht von einem Fehler sprach.
    Die Diagnose war jedes Mal verführerisch, weil sie messbar war — ein doppeltes Mesh kann man
    zählen, eine fehlende Aussage nicht. Aber „sieht lazy aus" heißt: der Bewegung fehlt ein
    SCHLAG, nicht eine Korrektur. Hier fehlte das **Vorzeigen** — man sammelt eine Karte, um sie
    zu sehen; sie flog schrumpfend in die Ecke, also las sie als Wegräumen.
    Dasselbe eine Zeile weiter, in Reinform: der Würfeltreffer setzte `visible = false` — **der
    Treffer löschte sein eigenes Ereignis.** Kein Fehler; nur nichts gesagt.
    Gegenprobe: *Welchen Satz sagt diese Bewegung, und in welchem Schlag sagt sie ihn?* Wer das
    nicht in drei Worten beantworten kann, hat repariert und nicht entworfen.

17. **Ein Objekt, das für den Betrachter stillstehen soll, muss im KAMERA-Raum gerechnet werden.**
    Georg, vierte Nennung zur Sammel-Animation: „die gesammelten Karten flackern kurz groß auf,
    wackeln und sind weg, bevor man etwas erkennt". Alle drei Wörter benennen EINE Ursache, und
    es ist ein Rechenraum-Fehler, kein Timing-Fehler: ich habe in WELT-Koordinaten zur Kamera hin
    interpoliert, während die Kamera mit 0,28/s wegflog. Ziel UND Kamera bewegten sich, jedes Bild
    neu — daraus wird „wackeln" (der Zielpunkt läuft unter der Interpolation weg), „flackert groß"
    (der Maßstab folgt einem Abstand, der nie stillsteht) und „ist weg" (die Karte fällt hinter die
    Kamera, bevor die Phase endet).
    Im Kamera-Raum ist Stillstand `position = const`, und nichts kann davonlaufen. Also: Pose
    EINMAL beim Übernehmen hineinrechnen, alles dort machen, am Schluss einmal zurück.
    Verwandt und in derselben Datei behoben: **der Maßstab wird aus dem BILD hergeleitet**
    (`presentFill` = Anteil der Bildhöhe, über `fov` in Weltmaß umgerechnet), nicht geraten —
    sonst ist die vorgezeigte Karte auf jedem Fenster anders groß.
    Und: **ein Halt muss länger sein als die Bewegung, die zu ihm hinführt.** 0,16 s Halt nach
    0,32 s Heranholen liest als Flackern; jetzt 0,70 s nach 0,30 s.

18. **Eine Drossel macht eine teure Rechnung nicht billig, nur seltener — der Hänger bleibt
    sichtbar.** Die Küstensuche tastete 7 Richtungen × 5 Stützpunkte ab: **35 Rauschabfragen auf
    einen Schlag**, jede vier Oktaven plus Biom-Mischung, alle 0,4 s. Ergebnis war Georgs
    „ruckelig auf einmal" — ein regelmäßiger Aussetzer im Sekundenrhythmus, den ich mir mit
    „gratis alle 0,4 s" selbst wegargumentiert hatte. Jetzt 5 × 3 = 15, und über Land wird gar
    nicht abgetastet.

19. **Ein Servo, dessen SOLLWERT springt, schwingt — und das fühlt sich wie kaputte Steuerung an.**
    „man wird hin-und-her gewackelt, beschleunigen unklar": `landOffset` sprang alle 0,4 s in
    Stufen (−54° → 0 → +54°) in denselben Servo, der auch Ausweichen und Würfel-Schlenker führt.
    Zwei Sicherungen, und beide braucht man: **Filter** auf den Sollwert (Zeitkonstante 1,2 s) und
    **Hysterese** auf die Wahl (eine neue Richtung muss deutlich besser sein, sonst bleibt die
    alte — ohne das flippt sie zwischen zwei fast gleich guten Seiten und der Filter kommt nie zur
    Ruhe). Spanne von 54° auf 32°. Und ein Schalter im Panel, weil eine Vorliebe abschaltbar sein
    muss.

20. **Wer zwei Zahlen für dieselbe Größe im eigenen Projekt hat, darf keine davon glauben — er
    muss messen oder kalibrieren.** Die Steinchen-Schwelle stand auf 0,045, weil im Panel „Height
    above ground 0,121" stand; in einem Dateikommentar stand „das Pet fliegt 0,03 über Grund".
    Ich habe die falsche geglaubt — der Streifschlag-Effekt feuerte dauerhaft im Reiseflug
    („die Partikel feuern dauerhaft"), und ein Effekt, der immer läuft, ist Nebel statt Ereignis.
    Behoben nicht durch eine bessere Konstante, sondern durch **Selbstkalibrierung**: die
    Reisehöhe wird als langsamer Mittelwert mitgeführt (≈ 3 s) und Steinchen gibt es unter 55 %
    davon. Damit kann die Schwelle nicht um einen Faktor vier daneben liegen, egal welche Zahl
    stimmt. Sichtbar im Panel als gemessene Schwelle.

21. **Ein Parameter, der nichts tut, ist schlimmer als keiner.** Der Runner übergab
    `{dur, arc, depth, endScale}` an `card-flight` — `dur` und `arc` gab es im Modul nicht mehr,
    seit die Bewegung in drei Schläge zerlegt ist. Sie sahen wie Einstellungen aus; man dreht
    daran und wundert sich. Wer eine Bauform umbaut, muss die Aufrufstelle mit aufräumen.

22. **„Berechnet statt konzipiert" ist eine präzise Diagnose — und die Bewegungssprache lag schon
    im Projekt.** Georg, 29.8.: „die show card animation … viel zu schnell getimed, es gibt kein
    easy in/out … eher BERECHNET als KONZIPIERT — die Methoden sind okay, aber falsch umgesetzt",
    und danach: „es ist jedenfalls nicht das ‘chilled’ animation timing aus tinyskies".
    Was ich gebaut hatte: je Phase eine eigene Easing-Funktion mit eigenen Zauberzahlen
    (`easeOutBack(1.5)`, `easeIn`, `t / 0.34`, `sin(πt)`). Jede Zeile plausibel, zusammen ohne
    Handschrift — und an den Phasengrenzen SPRINGT die Geschwindigkeit, weil zwei Kurven
    aneinanderstoßen, die nichts voneinander wissen. Genau das liest man als „kein ease in/out".
    Die Antwort stand in `card-carrier.js`, seit dem Port: `spring(cur, target, stiff, damp, dt)`,
    Federn zweiter Ordnung mit Überschwinger — damit sind dort Roll, Pitch, Kantencurl und Squash
    des Teppichs gemacht. Eine Feder löst alle drei Vorwürfe zugleich: **ease in/out gratis** (sie
    startet und endet mit Geschwindigkeit null), **keine Naht** (beim Phasenwechsel ändert sich nur
    das ZIEL; Ort und Geschwindigkeit bleiben stehen), **„chilled" ist EINE Zahl** (die
    Steifigkeit) statt sieben Kurven.
    `card-flight.js` ist jetzt eine Zustandsmaschine, die Ziele setzt, plus fünf Federn — keine
    Easing-Funktion mehr im Bewegungspfad. Und die Blickdauer beginnt, **wenn die Feder zur Ruhe
    gekommen ist**, nicht nach einer geratenen Wartezeit: die Dauer folgt der Bewegung, nicht
    umgekehrt.
    Allgemein: **wenn eine Bewegung „berechnet" wirkt, fehlt kein Parameter, sondern ein MODELL.**
    Und das Modell nicht selbst zu erfinden, wenn es im Projekt schon liegt, ist Regel 2 („die
    Quelle lesen statt die Absicht nachbauen") — hier auf Timing angewandt.

23. **Squash & Stretch gehören an den KONTAKT, nicht an die Geschwindigkeit.**
    Georg, mit Screenshot: „die Würfel sind immer noch weit vor Kontakt bereits deformiert".
    Meine Streckung hängte an `|v|`, also war der Würfel den ganzen Wurf über verformt. Das ist
    nicht „zu stark", das ist animatorisch falsch: **ein Gummiwürfel in freier Flugbahn ist ein
    Würfel.** Er verformt sich, wenn ihn etwas verformt. Jetzt steuert allein die Bodennähe
    (≈ zwei Kantenlängen): Anlauf, Aufprall, Abstoß — darüber unverformt. Der Rest des Wurfs
    erzählt über Drall und Bogen.
    Dazu die Beträge von 0,42/0,46 auf 0,20/0,24: ein Würfel ist erkennbar, WEIL er kantig und
    gleichseitig ist — wird er zum Riegel, frisst der Effekt den Gegenstand. Hartgummi verformt
    sich wenig und schnell; die Härte liegt in der KURVE, nicht im Betrag.

24. **Wer einen Zustand nur in einem Zweig abbaut, muss ihn in dem Zweig beenden, der den Zweig
    schließt.** Der Abbau von `squash` stand innerhalb von `if (d.kick)`, und der letzte Bounce
    setzt `kick = 0`: der Abbau lief nie wieder, `squash` blieb auf 1, und der Würfel war nach dem
    Neusetzen **dauerhaft ein flacher Riegel**. Der Screenshot war der Beweis, nicht der Eindruck:
    Seitenverhältnis 2,5:1, und 1/(1−0,46) ÷ (1−0,46) = **genau 2,5**. Eine Zahl aus einem Bild
    schlägt jede Vermutung. Behoben zweifach: Reset beim Beenden UND Abbau auch außerhalb.
    ⚠ **Und dieselbe Form ein zweites Mal, in derselben Runde — gefunden von der Abnahme, nicht
    von mir:** `card-flight` hatte seinen Notausstieg (`f.t > 2.5`) NUR in der letzten Phase, und
    `f.t` wird bei jedem Phasenwechsel genullt. Es gab also keine Gesamtuhr, und die zwei Phasen,
    die hängen können, waren ungesichert: beide Übergänge hängen an ABSOLUTEN Schwellen
    (`nah < 0,02`, `rest < 0,035`) ohne Rand. Hätte eine verfehlt, wäre die Karte in `sky-cards`
    ewig im Zustand `flying` geblieben — aus einem Pool von SECHS dauerhaft verloren, `hud.add`
    feuert nie, der Himmel leert sich langsam, und nichts sagt warum.
    Jetzt ein **phasenunabhängiges Lebensalter**, das nie zurückgesetzt wird, mit hartem Ausstieg
    nach 9 s VOR der Zustandsmaschine — es fragt nicht, wo die Karte steht, nur wie lange schon.
    Und `verloren` steht im Panel: die Zahl, die eine stille Fehlfunktion laut macht.
    Verallgemeinert: **eine Sicherung, die in einer Phase steht, sichert nur diese Phase.**
    Wer eine Uhr je Phase nullt, hat keine Lebensdauer — er hat Phasendauern.

25. **Ein Ausweich-Test muss die Frage eines PILOTEN stellen, nicht die eines Kollisionssystems.**
    „man fliegt durch braune Türme durch": mein Test maß die AKTUELLE Überdeckung und skalierte den
    Ausweichwinkel mit `pen²`. Ein Widerspruch in sich — der Bogen ist am schwächsten, wenn man
    noch Zeit hätte, und voll erst, wenn man drin steckt. Gerechnet: eine Mühle hat 0,153
    Wirkradius, mit Marge 1,9 also 0,29 — bei Tempo 0,28 **eine Sekunde Warnung**, und die erste
    halbe davon lenkt unter einem Viertel.
    Jetzt: Hindernis auf die Flugachse projizieren; liegt es voraus (innerhalb `lookahead` ≈ 4 s)
    und ist sein SEITLICHER Versatz klein, wird gebankt. Der Betrag kommt daraus, wie ZENTRAL es
    liegt und wie nah — nicht daraus, wie tief man drin ist. Dazu ein vertikaler Test: wer höher
    fliegt als der Bau, weicht nicht aus — und das ist der ehrliche Grund, warum Tiefflug
    gefährlicher ist als Höhenflug.

26. **Eine Bewegung, deren Anlass unsichtbar ist, liest als Defekt — und gehört abgeschaltet.**
    Die Küstensuche wurde zweimal gerügt („hin-und-her gewackelt" → gefiltert und mit Hysterese
    versehen → „man ändert über freiem Wasser unmotiviert den Kurs, schwenkt hin und her, dann
    irgendwie weiter"). Die zweite Rüge zeigt, dass die erste Reparatur die falsche Ebene traf:
    das Problem war nicht das Schwingen, sondern die **Unnachvollziehbarkeit**. Der Anlass (Land in
    vier Weltmaß) ist bei Nacht über Wasser nicht zu sehen; der Spieler erfährt nur die Wirkung.
    Steht jetzt auf AUS, Mechanik bleibt unter dem Schalter. **Langweiliges Wasser ist das kleinere
    Übel als eine Steuerung, die sich kaputt anfühlt** — und die leere See wird nicht durch
    Automatik gelöst, sondern durch etwas Sichtbares: Inseln, schwimmende Karten, ein Ziel am
    Horizont, dem man FOLGEN will. Offener Punkt, kein stiller Automatismus.

27. **Die Fortsetzung einer Bewegung ist ein Absetzen, kein Auftritt.** Georg: „die Karten
    animation muss die Karte visuell nachvollziehbar OBEN auf den Stapel GLEITEN unten rechts
    lassen". Drei Bedingungen, alle drei fehlten:
    · **oben auf** — Zwischenziel ÜBER und außerhalb des Stapels, von dem aus sie sich auflegt;
      der gerade Weg in die Ecke kann „auf etwas legen" nicht ausdrücken.
    · **gleiten** — zwei Steifigkeiten statt einer: heranfahren zügig (42), auflegen weich (15).
    · **nachvollziehbar** — die 3D-Karte wird auf **genau die Pixelhöhe des obersten Blatts**
      skaliert (der Anker liefert sie mit) und erst freigegeben, wenn Ort UND Größe stimmen.
      Vorher endete sie bei einem geratenen `endScale` — und ein Größensprung im Moment des
      Wechsels ist genau das „weg, bevor man was erkennt".
    Und die CSS-Aufnahme ist von einer Einflug-Animation auf ein kurzes Absetzen zurückgebaut:
    eine große Bewegung dort wäre ein ZWEITES Ereignis für denselben Vorgang — man sähe die Karte
    zweimal ankommen. Dieselbe Fehlerklasse wie die zwei gerenderten Karten, nur in CSS.

28. **3D kann nie vor dem HUD liegen — eine Bewegung über die Technikgrenze muss sich TEILEN,
    nicht überlappen.** Georg: „die Karte fliegt hinter das Deck; dann wird sie sichtbar nach vorne
    geflackert!?" Keine Zeitfrage, eine Schichten-Wahrheit, die ich übersehen habe: die 3D-Karte
    lebt im WebGL-Canvas, der Fächer ist DOM darüber. Mein Auflege-Ziel war die MITTE des obersten
    Blatts — sie verschwand folgerichtig dahinter, und im Übergabemoment erschien das DOM-Blatt
    obenauf: das ist das „Flackern nach vorne". **Kein `renderOrder` und kein z-index behebt das
    (das Canvas unter die Blätter zu legen wäre schlechter).**
    Die Lösung ist geometrisch: der 3D-Teil endet DIREKT ÜBER der Stapelkante und überdeckt das
    Blatt nie — dann kann er auch nicht dahinter geraten. Die letzten 20 px legt das DOM-Blatt
    selbst zurück (`intake` gleitet von −20 px herunter, genau die Strecke, die der 3D-Teil offen
    lässt). Eine Bewegung, zwei Techniken, eine sichtbare Fortsetzung — und die Übergabe passiert
    dort, wo sich die Schichten nicht streiten.
    Verallgemeinert: **wo zwei Rendertechniken eine Bewegung teilen, ist die Naht kein Zeitpunkt,
    sondern ein ORT** — und der muss so gewählt sein, dass sich die Schichten nicht überlappen.

29. **Helligkeit ohne Sättigungsabgabe ergibt Neon.** Georg, mit Screenshot: „die Würfel sind jetzt
    zu hell". `bodyLift` hob nur die Helligkeit — der gelbe Würfel liegt bei S 1,00 / L 0,35, auf
    L 0,50 gezogen ist das reines Signalgelb. Bei Nacht endlich lesbar, bei Tag leuchtet es aus dem
    Bild. Der Grund ist Farbenlehre, nicht Geschmack: **Sättigung und Helligkeit sind gemeinsam der
    Regler für „leuchtet".** Papier hat helle, WENIGER gesättigte Töne. Jetzt wird je gehobenem
    Helligkeitsschritt Sättigung abgegeben (Faktor 1,5), Lift auf 0,44, und die Eigenglut des
    Körpers von 0,22 auf 0,14 — sie stand ZUSÄTZLICH obendrauf und addierte sich zum Leuchtstoff.
    Hue bleibt unangetastet: der Kanon sagt welche FARBE, nicht wie grell. Die Lesbarkeit tragen
    die Augen (`pipGlow`), nicht der Körper.

30. **Zufall verteilt nicht gleichmäßig, er verteilt zufällig — und dieselbe Aufgabe dreimal zu
    lösen heißt, sie einmal zu vergessen.** Georg: „Karten sind oft zu eng nebeneinander platziert
    — auch hier hatten wir eine entsprechende Streuungs-Logik vorgesehen". Er hat doppelt recht:
    die Logik existiert in diesem Projekt an ZWEI Stellen (`assignMarken` für Landmarken,
    `sky-dice.anchor` für Würfel — beide als Ablehnung mit Wiederholung), und die Karten, also
    das ÄLTESTE der drei Systeme, hatten sie nicht.
    Das Clustern ist keine Pechsache: bei sechs Karten auf ±75° ist der erwartete Abstand des
    NÄCHSTEN Nachbarn ein Bruchteil des mittleren Abstands. Gleichmäßigkeit muss erzwungen werden.
    Jetzt `minGap` 0,26 (gut drei Kartenbreiten), gemessen in WELTMASS statt im Azimut — zwei
    Karten mit gleichem Azimut können in verschiedenen Höhen weit auseinanderliegen —, acht
    Versuche, dann der beste. Eine Karte fällt nie aus.
    Die eigentliche Lehre ist die über mich: **wenn eine Regel dreimal gebraucht wird, gehört sie
    EINMAL an einen Ort.** Drei Kopien derselben Überlegung sind drei Gelegenheiten, eine zu
    vergessen — und es war die, die am längsten stand.

31. **Ein Ziel in einer Bildecke darf nicht nach AUSSEN versetzt werden.** Georg: „die erste Card
    verschwindet angeschnitten hinter Maske?! erscheint dann ruckelig". Keine Maske: der
    **Viewport** hat beschnitten. Gerechnet: der Fächer sitzt 16 px vom rechten Rand, seine Mitte
    38 px; mein Anflug-Versatz von +14 nach außen setzte das Ziel auf 24 px — eine Karte, die dort
    44 px breit ankommt, hängt zur Hälfte außerhalb.
    Der Denkfehler war „sie soll von der Bildkante kommen": **in einer Ecke gibt es diese Seite
    nicht.** Der freie Raum liegt nach innen und nach oben. Jetzt −34 px (ins Bild hinein), und
    jedes Bildschirmziel wird geklemmt — **mit halber Kartenbreite**, denn sonst ist der
    Mittelpunkt drin und die Karte hängt raus. Die Breite wächst mit dem Maßstab, also muss die
    Klemme den aktuellen Maßstab kennen; genau während des großen Anflugs wurde beschnitten.

32. **Eine Bildschirm-Frage mit einer Weltlänge beantworten ist ein stiller Aufhänger.**
    Alle drei Phasentore in `card-flight` hingen an absoluten Weltschwellen (`nah < 0,02`,
    `rest < 0,035`) — aber die Fragen sind Bildschirmfragen („steht sie da, wo ich sie sehen
    will?"). Solche Schwellen hängen an Bildwinkel und Fenstergröße und können bei ungewöhnlichen
    Werten NIE erfüllt sein; dann wartet die Karte auf `maxAge` statt auf ihren Schlag.
    Jetzt **drei Tore, eine Maßeinheit** (Pixel, umgerechnet über `fov`): 14 px für den Halt,
    26 px für das Umschalten aufs Auflegen, 7 px für die Übergabe.

33. **Beim Ersetzen eines Blocks gehört der KOMPLETTE Block in den Ersatz — auch der Teil, den man
    nur „umbenennen" wollte.** Meine Bearbeitung hat `if (anflug) { … }` durch `if (anflug) {`
    ersetzt und den Körper verloren: Klammerbilanz kippte, `card-flight.js` parste nicht mehr,
    `globe-poc.js` importiert es — und der hellblaue Schirm war zurück. Ein Modul, das nicht
    parst, nimmt die ganze Welt mit; kein Fangkorb hilft, weil der Import scheitert, bevor
    irgendetwas läuft.
    Und der teurere Teil davon: **mit dem Körper verschwand der einzige Ort, der `phase = 'lay'`
    setzt** — nach einer reinen Klammer-Reparatur hätte jede Karte still bis `maxAge` geflogen und
    das Panel hätte bei JEDEM Aufsammeln „TIMED OUT" gemeldet. Ein Syntaxfehler ist laut; die
    fehlende Zustandsverbindung dahinter ist es nicht.
    Lehre: nach jeder Blockersetzung **Klammerbilanz UND die Zustandskette prüfen** („wer setzt
    diesen Zustand? wer liest ihn?"). Ein `grep` auf `phase = ` gegen `phase === ` hätte es in
    einem Aufruf gezeigt — und gehört ab jetzt zu jeder Änderung an einer Zustandsmaschine.

34. **Eine Tönung sagt WELCHE Farbe, nicht WIE HELL — und derselbe Denkfehler kam zweimal in einer
    Sitzung.** Georg: „die Würfel sind jetzt zu hell", dann „terrain UND Würfel sind überstrahlt…
    das Bild ist auch immer überstrahlt". Beide Male hatte ich FARBE gemischt und dabei ungewollt
    HELLIGKEIT addiert:
    · **Würfel:** `bodyLift` hob die Helligkeit ohne Sättigung abzugeben → Neon.
    · **Terrain:** die Biom-Tönung mischt helle Sandtöne (Flatwater #d9cfa8 = L 0,75, Plateau
      #c9b071 = L 0,60) mit 34 % über die ganze Landmasse. Das hebt die Albedo, und was die Sonne
      danach dazumultipliziert, **clippt**. Der Sand sah weiß aus, nicht sandfarben — und niemand
      sucht die Ursache in einer Farbmischung, wenn ein Bild überbelichtet wirkt.
    Reparatur beide Male dieselbe: die gemischte Farbe auf die **Luminanz der ursprünglichen**
    zurückziehen (Rec.709, im LINEAR-Raum — dort findet die Multiplikation der Beleuchtung statt).
    Das Biom bleibt voll sichtbar, weil die Domänen sich über den HUE unterscheiden, nicht über
    die Helligkeit — und es kann per Konstruktion nichts mehr überstrahlen.
    Merksatz für jede künftige Tönung: **Luminanz messen, mischen, Luminanz wiederherstellen.**

35. **Eine geratene Formel für Sprite-Größe erzeugt Fehler, die wie etwas anderes aussehen.**
    „statt Partikel sehe ich große Kreise beim dice bounce" — im Shader stand
    `gl_PointSize = size * 620.0 / max(0.05, -mv.z)`. Zwei Fehler in einer Zeile:
    **620 war eine Zauberzahl** ohne Bezug zu Bildhöhe oder Bildwinkel (richtig ist der
    Projektionsfaktor `hPx / (2·tan(fov/2))`), und es gab **keine Obergrenze**: bei `-mv.z` = 0,05
    ergab die Formel **136 px** — ein Steinchen von 11 Tausendstel Weltmaß als handtellergroße
    Scheibe. Und weil ein Bounce neun davon dicht an der Kamera erzeugt, lagen neun
    halbtransparente Scheiben über dem Bild: **ein Teil des „überstrahlten Terrains" war Milchglas
    davor, kein Beleuchtungsproblem.** Ein Symptom kann von einer Ursache kommen, die in einem
    ganz anderen Modul sitzt — und „ist zu hell" ist genau die Sorte Symptom, die man dem
    nächstliegenden Verdächtigen zuschreibt.
    Jetzt: echter Projektionsfaktor als Uniform, harte Deckelung auf 26 px (regelbar), und die
    Nah-Klemme weit genug, dass ein Steinchen vor der Linse nicht die Sicht nimmt.

36. **Ablehnungs-Würfeln kann Gleichverteilung nicht garantieren, wenn die Dinge EINZELN
    erscheinen.** Georg zweimal: „die Karten-Verteilung ist immer noch nicht korrekt
    berechnet/umgesetzt". Meine erste Antwort war Ablehnung mit Mindestabstand — dieselbe Mechanik
    wie bei Landmarken und Würfeln, und hier kann sie nicht funktionieren: **Karten respawnen
    einzeln.** Wer als erster gesetzt wird, hat keine Nachbarn und damit keine Einschränkung; die
    zweite weicht nur der ersten aus. Ablehnung verhindert Berührung; sie erzeugt keine
    Gleichverteilung — dafür müsste sie alle sechs gleichzeitig kennen.
    Richtig ist **Stratifizierung**: der Vorwärts-Sektor wird in so viele Fächer geteilt, wie es
    Karten gibt, und jede Karte gehört dauerhaft in IHR Fach (ihr Index). Innerhalb des Fachs wird
    gewürfelt — unregelmäßig, aber klumpfrei, weil zwei Karten nie dasselbe Fach haben. Eine
    Garantie statt einer Wahrscheinlichkeit, und sie kostet keinen Versuch.
    Dazu der Ringabstand **gegenläufig** gestaffelt (`cos(slot·π)`): Nachbarfächer liegen in
    verschiedenen Tiefen, damit auch bei perspektivischer Überdeckung zwei Karten als zwei lesen
    und nicht als Stapel. Das war der eigentliche Bildfehler im Screenshot.
    Lehre: **die Bauform muss zur Erscheinungsweise passen.** Gleichzeitig entstehende Dinge kann
    man ablehnen; einzeln entstehende muss man einteilen.

37. **Wer einen Parameter löscht, muss sein BEDIENELEMENT mitlöschen — und ein Grep im Modul
    beweist das nicht.** Meine Stratifizierung hat `minGap` aus `sky-cards.js` entfernt; der
    Schieber „Cards: min spacing" im Runner blieb stehen. `get()` gab `undefined`, `fmt(undefined)`
    warf bei `.toFixed`, und weil `createSettingsPanel` INNERHALB des `try` von `start()` steht,
    starb der ganze Runner: kein `__globe`, keine Schleife, kein Panel. Der hellblaue Schirm ein
    zweites Mal an einem Tag, und diesmal sah der Screenshot sogar richtig aus — das EINE Bild des
    Eröffnungsflugs war schon gezeichnet, bevor es warf, und blieb stehen.
    ⚠ Und die eigentliche Lehre ist die über meine PRÜFUNG: mein `run_script` hat „minGap übrig: 0"
    gemeldet — aber nur in `sky-cards.js` gesucht, also genau in der Datei, aus der ich es entfernt
    hatte. **Eine Suche am Tatort beweist nichts über die Zeugen.** Das ist Fehlerklasse 21
    („ein Parameter, der nichts tut") in der Umkehrung: nicht ein Regler ohne Wirkung, sondern eine
    Wirkung ohne Regler.
    Ab jetzt gehört nach jeder Parameteränderung EINE Gegenprobe dazu, die in die andere Richtung
    liest: jeden `X.params.NAME`-Zugriff des Runners gegen die Deklaration im Modul prüfen (und
    ebenso jeden `setParams({NAME`). Kostet einen Aufruf, findet genau diese Klasse — gemessen
    danach: sky 6, flug 3, dice 4, kollision 5, tuerme 2 Zugriffe, **0 fehlend**.
    Struktureller Nachtrag: dass ein Panel-Formatierer den START töten kann, ist selbst ein Fund.
    Ein Diagnosewerkzeug darf die Sache, die es beobachtet, nicht mit sich reissen.

38. **Ein Landeplatz darf kein animiertes Element sein.** Georg zweimal: „der Übergang der Karten
    zum Stapel ruckelt immer noch und ist sichtbar buggy". Ursache gemessen (von der Abnahme):
    `anchor()` liest das Rechteck des OBERSTEN BLATTS — und genau dieses Blatt trägt nach jedem
    Aufsammeln 0,34 s lang die `intake`-Animation. Es wandert dabei **22 px** und ändert seine Höhe
    um **6 %**. Beides floss je Bild in die Federn: die Position über `a.y`, der MASSSTAB über
    `a.h`. Eine Karte, die landet, während die vorige einfährt, jagt also einem wandernden Ziel
    nach — und bei sechs Karten im Vorwärts-Sektor sind zwei Treffer innerhalb 0,34 s der
    Normalfall, nicht der Randfall.
    Das ist Fehlerklasse 19 („ein Servo, dessen Sollwert springt, schwingt") ein zweites Mal, nur
    in Pixeln statt in Radiant — und ich habe sie nicht wiedererkannt, weil sie diesmal aus dem DOM
    kam und nicht aus meiner Mathematik. **Die Fehlerklasse hängt an der ROLLE des Werts (Sollwert
    eines Reglers), nicht daran, woher er kommt.**
    Behoben durch Einfrieren beim Eintritt in `tuck`, nicht in der CSS: das immunisiert zugleich
    gegen die Verschiebung durch `layout()` und gegen jede künftige HUD-Animation.
    ⚠ Und ein eingefrorener Wert braucht die BEDINGUNG, unter der er gilt: ändert sich die
    Fenstergröße mitten im Flug, ist der gemerkte Pixelort falsch, also wird er neu genommen.
    Sonst wird aus der Sicherung ein zweiter Fehler — dieselbe Falle wie eine gemerkte
    DOM-Referenz (Fehlerklasse 11).

39. **Ein Wegpunkt ist kein Federziel — eine Feder HÄLT AN ihrem Ziel.** Georg: „die Karte STOPPT
    vor dem Stapel, flackert kurz und wird dann halb-richtig weiter bewegt auf Stapel". Genau das
    hatte ich gebaut: zwei diskrete Ziele mit hartem Umschalten (erst „über und außerhalb", dann
    „auflegen"). Die Feder bremst in den Wegpunkt hinein, kommt zur Ruhe — **das ist der Stopp** —,
    dann springt das Ziel 34 px seitlich und 26 px hoch, und im selben Bild springen Steifigkeit
    (42→15) und Neigung (Kippung→0): **das ist das Flackern.**
    Der Denkfehler ist begrifflich: ein Wegpunkt beschreibt, WO die Kurve durchgeht — ein Federziel
    beschreibt, wo die Bewegung ENDET. Wer das eine als das andere benutzt, baut einen Halt in die
    Mitte seiner Bewegung. **Ein Gleiten geht durch einen Punkt hindurch; es stoppt nicht darin.**
    Richtig: EIN Ziel (der Landeplatz) plus ein **Versatz, der mit der Nähe verschwindet** — weit
    weg wird nach oben und nach innen versetzt, nah bleibt nichts übrig. Der Weg ist dann eine
    Kurve durch die Gegend, in der der Wegpunkt lag, ohne Naht und ohne Umschaltpunkt. Steifigkeit,
    Dämpfung und Neigung blenden mit demselben `k`, also kann nirgends etwas springen; der Zustand
    `lay` ist mit dem Wegpunkt entfallen (drei Phasen statt vier).
    Bemerkenswert: **das ist dieselbe Bauform, die in diesem Projekt schon zweimal richtig steht** —
    das Ausweichen an Landmarken und der Würfel-Schlenker sind beide ein Versatz, der von selbst
    auf null zurückgeht, statt eines zweiten Ziels (S7b). Ich habe sie hier nicht wiedererkannt,
    weil das Problem „Weg" hieß und nicht „Kurs". Wenn eine Bauform im Projekt dreimal gebraucht
    wird, gehört sie EINMAL an einen Ort — dieselbe Lehre wie bei der Streuung (Fehlerklasse 30),
    und ich habe sie eine Runde später wieder nicht angewandt.

## 6j · QUELLENBERICHT Beleuchtung — warum das Whack-a-Mole entstand (29.8.)

Georg: *„schluss mit whack-a-mole! → tinyskies analysieren & report & plan"*. Berechtigt: ich habe
in dieser Sitzung **siebenmal an einem Helligkeitssymptom geschraubt** (Würfelfarbe, Eigenglut,
Sättigungsabgabe, Biom-Tönung zweimal, Steinchen-Deckelung, Luminanzerhalt) und jedes Mal einen
Summanden einer Summe geändert, die **niemandem gehört**. Gelesen wurde jetzt der Code, nicht die
Absicht: `dannylimanseta/tinyskies@2659a5cc`, Zweig `cursor/globefly-multiplayer-globe-flight-game`.

### Was die Quelle tut (gelesen, mit Zeilen)

| Sache | tinyskies | wir |
|---|---|---|
| Renderer | `new WebGLRenderer({ antialias: true })` — **sonst nichts** (Game.ts 1138). Also `NoToneMapping`, Ausgabe sRGB als Standard | identisch (`globe-poc.js` 178–180), ACES nur als Regler, Standard aus ✅ |
| three | `^0.172.0` (client/package.json) | `0.160.0` — **beide ≥ r155**, also beide physikalisch korrekt, **kein π-Faktor-Unterschied** ✅ |
| Lichter | **genau sieben**, aus EINER Tabelle (`SkyPresets.ts`), gesetzt in `Game.ts` 1158–1186, nachgeführt 6249–6265 | dieselben sieben, `sky-presets.buildLightRig` ✅ |
| Tag-Werte | sun 5,0 · sun2 3,25 · fill 1,75 · fill2 1,5 · back 1,5 · hemi 1,75 · ambient 1,25 | identisch ✅ |
| Weltmaterial | `MeshPhongMaterial({ vertexColors: true, shininess: 8, flatShading: true })` (Globe.ts 519–521) | identisch ✅ |
| Boden im Lager | `MeshLambertMaterial({ vertexColors: true })` (CampsiteScene.ts 353) | — |
| PBR im Weltbild | **keins.** Alles Phong/Lambert. Kein `scene.environment` | ❌ wir haben beides |

✅ **Sechs von sieben Punkten stimmen bitgenau.** Das Problem ist NICHT die portierte Beleuchtung.

### Die drei Abweichungen — und die Rechnung dazu

**(1) Die Albedo passt nicht zum Lichthaushalt.** Das ist die Hauptursache, und sie ist rechenbar.
Bei physikalisch korrektem Licht teilt der Lambert-BRDF durch π. Eine der Sonne zugewandte Fläche
bekommt also `5,0 / π · Albedo` allein von `sun`, dazu `(1,75 + 1,25) / π · Albedo` von Hemisphere
und Ambient, dazu je nach Ausrichtung ein bis zwei Füller.

| Albedo (sRGB-Luminanz) | nur `sun` | + hemi/amb | Ergebnis |
|---|---|---|---|
| unser **Firn** `0xeeecdf` = 0,93 | 1,48 | +0,89 | **2,4 — dreifach geklippt** |
| unser **Strand** `0xd8c99c` = 0,79 | 1,26 | +0,75 | **2,0 — doppelt geklippt** |
| unsere **Ebene** `0x6f8f5e` = 0,52 | 0,83 | +0,50 | 1,3 — knapp über |
| tinyskies-Referenz (Screenshot, dunkles Oliv/Grün) ≈ 0,30 | 0,48 | +0,29 | 0,77 — **sitzt** |

**Der Lichtaufbau ist für Albedo um 0,30 kalibriert. Unsere Landpalette liegt bei 0,52–0,93.**
Deshalb brennt Sand aus und Firn ist weißes Nichts — und deshalb war jede Lichtsenkung ein
falscher Hebel: sie hätte die dunklen Bänder mitgerissen.
[BEWEIS aus der Referenz] `refs/tinyskies-02.png`: das **Terrain ist dort durchweg DUNKLER als der
Himmel**, Wasser violett, Land tiefes Oliv. In unserem Screenshot ist es umgekehrt — der Boden ist
das hellste Element im Bild. Das ist die Signatur einer zu hellen Albedo, nicht eines zu hellen Lichts.

**(2) Ein achtes Licht, das niemand mitzählt.** `pet-lighting.js` legt eine weitere
`DirectionalLight` (0,55, kaltblau) in die Szene und führt sie am Fahrzeug mit. Sie war für das Pet
gedacht — aber eine Szenenlampe leuchtet die Szene. In der Tabelle steht sie nicht.

**(3) Zwei Beleuchtungsmodelle in einer Welt.** Die Welt ist Phong (quellentreu). Die Würfel, die
Kenney-Props und das Pet kommen als `MeshStandardMaterial` — und `pet-lighting` setzt zusätzlich
`scene.environment` (PMREM-Bake des Himmels, `envMapIntensity` 1,0). **Phong ignoriert
`scene.environment` vollständig, Standard nimmt es voll.** Dieselben sieben Lichter treffen also
zwei Materialklassen mit völlig verschiedener Antwort, und die PBR-Klasse bekommt obendrein eine
achte und neunte Quelle (IBL + eigene Emissive).
**Das ist der Motor des Whack-a-Mole:** jede globale Korrektur reparierte eine Klasse und brach die
andere. Deshalb musste ich die Würfel „neon" aufhellen (sie waren die einzigen PBR-Körper in einer
Phong-Welt) und danach wieder abdunkeln.

### Der Plan — S9 · EIN Lichthaushalt, in dieser Reihenfolge

**S9a · Sichtbar machen, bevor irgendwas geändert wird.** Panel-Zeile „Light budget": alle Lichter
mit Typ und Intensität, `scene.environment` an/aus, Zahl der PBR- gegen Phong-Materialien, und die
gemessene Spitzen-Luminanz der Terrain-Vertexfarben. Ohne diese Zahlen ist jede weitere
Änderung wieder Raten — und Georg kann sie ohne Konsole lesen (S7c).

**S9b · Ein Eigentümer.** `sky-presets.buildLightRig` wird der EINZIGE Erzeuger von Weltlichtern.
Das achte Licht wandert entweder in die Presettabelle (als benannter Eintrag mit Werten je
Tageszeit) oder raus. Ein anonymer Zusatz ist nicht erlaubt — dieselbe Regel, die für `heading` und
für die Bühne schon gilt.

**S9c · EIN Beleuchtungsmodell.** Geladene GLB-Materialien werden beim Mounten nach Phong
konvertiert (Farbe, Map, flatShading übernehmen), `scene.environment` für die Welt aus. Danach
antwortet die ganze Szene gleich, und eine Entscheidung gilt für alles. ⚠ Das Pet ist der einzige
begründete Sonderfall (es SOLL plastischer sein) — dann aber als bewusster Eintrag im Haushalt,
mit `envMapIntensity` nur auf seinen eigenen Materialien.

**S9d · Die Palette in den kalibrierten Bereich.** Land- und Biomfarben auf Luminanz **0,26–0,42**
bringen — Hue und Sättigung sind der Kanon, die Helligkeit ist Technik. Firn ist der Sonderfall
(Schnee DARF hell sein, aber 0,93 ist Papier: 0,72 reicht). Danach ist keine Lichtsenkung nötig,
und die Referenz-Signatur „Terrain dunkler als Himmel" stellt sich von selbst ein.

**S9e · Abnahme gegen die Referenz, nicht gegen Geschmack.** Drei Zahlen je Tageszeit:
Spitzen-Luminanz des Terrains (**soll < 0,85**, kein Kanal geklippt), Median-Luminanz
(**soll 0,25–0,45**), und das Verhältnis Terrain-Median zu Himmel-Median (**soll < 1,0** — genau die
Signatur aus `refs/tinyskies-02.png`).

⚠ **Was in diesem Plan bewusst NICHT vorkommt:** Tone Mapping. Die Quelle hat keins, unsere Kopie
hat keins, und ACES würde ein Albedo-Problem hinter einer Kurve verstecken statt es zu lösen.
Der Regler bleibt als Notausgang, nicht als Lösung.

**Fehlerklasse 40 (die eigentliche Lehre dieser Sitzung):**
**Wenn dieselbe Beschwerde siebenmal kommt, ist der Fehler nicht im Symptom, sondern in einer
Summe ohne Eigentümer.** Sieben Lichter aus der Quelle, ein achtes von mir, eine IBL von mir, ein
Emissive je Objekt und eine Albedo, die zu keinem davon passt — fünf Beiträge, kein Haushalt.
Die Gegenprobe gehört VOR die erste Korrektur: *Wer besitzt diese Gesamtgröße, und kann ich sie
an einer Stelle ablesen?* Lautet die Antwort „niemand", ist jede Einzelkorrektur Whack-a-Mole —
und zwar per Konstruktion, nicht aus Ungeschick.

### S9 · Ein Lichthaushalt — Stand nach dem ersten Durchgang (29.8.)

**S9a · gebaut** — `light-budget.js`. Es RECHNET und ändert nichts (ein Messgerät, das eingreift,
ist keins). Panel-Zeile `Light budget`: Zahl und Summe aller Lichter, Phong- gegen PBR-Materialien,
`scene.environment` an/aus, Albedo-Maximum und -Median des Terrains und die daraus gerechnete
**face load** `(stärkstes Directional + hemi + ambient) / π · Albedo` mit `⚠ CLIPS`-Marke.
Dazu `bericht()` für das Diagnose-Blatt: jede Lampe **namentlich** — eine Zahl allein sägt nicht,
WELCHE dazugekommen ist.

**S9b · gebaut** — das achte Licht heißt `petFill`, steht als Eintrag in allen drei Presets
(0,55 Tag · 0,30 Abend · 0,18 Nacht) und wird von `day-night` mitgefahren. Vorher lag es anonym in
`pet-lighting.js` mit konstant 0,55 — es leuchtete nachts wie mittags. `buildLightRig` ist jetzt der
EINZIGE Erzeuger von Weltlichtern und benennt jede Lampe.

**S9c · gebaut** — drei Teile:
· `pet-lighting` setzt **kein `scene.environment`** mehr. Die PMREM-Map liegt als `envMap` auf den
  ausdrücklich registrierten Materialien (nur der Pet-Mount ruft `register`). *Wer sie will, sagt
  es; wer schweigt, bekommt sie nicht.*
· Die **Würfel erzeugen jetzt Phong** statt Standard — kein Konverter, sondern richtig entstanden.
  Sie waren die einzigen PBR-Körper in einer Phong-Welt und bekamen als einzige die Environment
  dazu: genau deshalb sahen sie erst „dunkel wie Gebäude" und dann „neon" aus.
· `to-phong.js` konvertiert geladene GLB (Kenney-Landmarken) nach Phong und **benennt, was ein
  Phong nicht kann** (`normalMap`, `envMap`, `metalness`) statt es still zu verwerfen. Das Pet ist
  der einzige begründete Sonderfall und bleibt PBR — markierte Materialien werden übersprungen.

**S9d · gebaut** — Palette im kalibrierten Band. Gerechnet, nicht geschätzt.

⚠ **Die Tabelle stand zuerst in sRGB und ist hier auf LINEAR korrigiert** — siehe Fehlerklasse 42.
Linear ist die Einheit dieses Slices, weil three dort das Licht multipliziert. Das URTEIL ist in
beiden Räumen dasselbe (alt klippt, neu nicht); nur die Zahlen unterscheiden sich um Faktor 1,3–3,1,
und Vergleiche über die Grenze hinweg sind sinnlos.

| Band | alt | L_lin | face load | neu | L_lin | face load |
|---|---|---|---|---|---|---|
| strand | `0xd8c99c` | 0,588 | **1,50 ⚠** | `0x72612d` | 0,123 | 0,31 ✓ |
| ebene | `0x6f8f5e` | 0,238 | 0,61 | `0x405336` | 0,075 | 0,19 ✓ |
| hang | `0x85765a` | 0,187 | 0,48 | `0x4f4636` | 0,063 | 0,16 ✓ |
| fels | `0x66605a` | 0,119 | 0,30 | `0x403d39` | 0,047 | 0,12 ✓ |
| firn | `0xeeecdf` | 0,835 | **2,13 ⚠** | `0x9b9a8d` | 0,320 | 0,81 ✓ |

**Zwei Bänder klippten, nicht vier** — und genau die zwei, die Georg benannt hat („überstrahltes
Terrain": Sand und Firn). Die mittleren Bänder waren immer in Ordnung; die sRGB-Tabelle hatte sie
fälschlich mitangeklagt. Und der Firn klippt jetzt **gar nicht** mehr (0,81), nicht „nur face-on" —
das war eine Folge der falschen Einheit, keine Messung.

Kalibriertes Band, hergeleitet statt gewählt: face load < 1,0 verlangt Albedo_lin < **0,393**; mit
Sicherheitsabstand (Füller können in ungünstiger Ausrichtung dazukommen) ist die Obergrenze
**0,33**, die Untergrenze **0,04** (darunter ist ein Band nicht von Schatten zu unterscheiden).
Steht als `BAND_LIN` in `light-budget.js` — EIN Ort, exportiert.

Biom-Töne ebenso: alle vier lagen **heller** als die Bänder, die sie tönen sollten (linear
0,367–0,622 gegen 0,119–0,238) — *eine Tönung, die aufhellt, ist keine Tönung, sondern eine
Aufhellung.* Jetzt 0,073–0,109.
✅ **Hue und Sättigung sind bitgenau die alten** (H 45→45, 99→99, 39→38, 52→52, 43→42, 233→233,
148→148, 48→47 · S ±0,01). Der Kanon sagt WELCHE Farbe, die Helligkeit ist Technik.

⚠ **Ein Eigenfehler beim ersten Rechnen, und er ist die Umkehrung von Fehlerklasse 29:** Firn auf
L 0,58 gezogen ergab **Olivgold**. Ein Near-White bezieht seine WEISSHEIT aus NIEDRIGER Sättigung
bei hoher Helligkeit; nimmt man die Helligkeit weg und lässt die Sättigung stehen, bleibt der
Buntton übrig, der vorher unsichtbar war. Firn gibt also Sättigung ab (0,31 → 0,07) und behält den
Hue. **Sättigungserhalt ist die Regel, Firn die begründete Ausnahme** — und Schnee bleibt das
hellste Band, sonst ist es kein Schnee.

**S9e · gemessen** — Abnahme in LINEARER Luminanz, **getrennt nach LAND und WASSER**:

| | Spitze | Median | face load Spitze | Urteil |
|---|---|---|---|---|
| **LAND** (das Band gilt hierfür) | 0,123 | 0,078 | 0,313 | ✓ im Band 0,04–0,33 |
| **WASSER** | *welt-abhängig* | *welt-abhängig* | *welt-abhängig* | **kein Urteil möglich** |

**Land ist seedfest, Wasser nicht — und deshalb steht hier für Wasser keine Zahl.**
Gemessen an zwei Welten: `waterworld` ergibt Wasser-Spitze 0,584 / Median 0,111 (load 1,487,
4 % der Vertices über dem Band), eine landreichere Welt 0,287 / 0,031 (load 0,731, 0 % darüber).
**Faktor 2 in der Spitze, Faktor 3,6 im Median** — je nachdem, wieviel Flachwasser die Welt hat.
Ein ✓ oder ⚠ aus einer Einzelmessung wäre für jede andere Welt falsch.
Die einzige autoritative Wasser-Anzeige ist deshalb **die Panel-Zeile im laufenden Bild**; das
Dokument nennt nur, was nicht vom Seed abhängt (die Quell-Hexwerte unten).

· Terrain-Median < Himmel-Median → **im Bild bestätigt** ✓ (Signatur aus `refs/tinyskies-02.png`)
· Landmaske vorhanden → der Bäcker liefert sie, keine Farbheuristik nötig ✓

**Fehlerklasse 44: ein Maß braucht nicht nur eine Einheit, sondern einen GELTUNGSBEREICH.**
Mein Messgerät maß die Albedo des **ganzen Netzes** und verglich sie mit `BAND_LIN`, das nur für
**Land** gilt. Folgen, alle drei gemessen:
· die Panel-Zeile meldete dauerhaft `face load 1.487 ⚠ CLIPS`, während dieses Dokument `0,31 ✓`
  behauptete — **Instrument und Bericht widersprachen sich über dieselbe Größe, auf jedem Laden**;
· alle 185 Proben über dem Band waren **Wasser, keine einzige Land** — die Anzeige klagte also
  etwas an, das S9d nie zu regeln versucht hat;
· und der Wert schwankte um **Faktor 5 mit dem Seed** (diese Welt: 5576 Wasser- gegen 429
  Landvertices). *Ein Maß, das sich mit dem Seed fünffach ändert, ist keine Grenze — es ist ein
  Zufall mit Nachkommastellen.*
Das ist Fehlerklasse 40 zum **dritten** Mal in einem Slice: erst eine Summe ohne Eigentümer (§6j),
dann eine Einheit ohne Eigentümer (42), jetzt ein Geltungsbereich ohne Eigentümer. Die Reihe sagt
etwas über mich: ich baue Messgeräte mit derselben Nachlässigkeit, mit der ich vorher Effekte
gebaut habe — und ein falsches Messgerät ist teurer als kein Messgerät, weil man ihm glaubt.
Die Gegenprobe, die alle drei gefunden hätte: *Welche Größe, in welcher Einheit, über welche Menge?*
Drei Fragen, ein Satz, vor der ersten Anzeige.

**Fehlerklasse 45: eine gemessene Zahl im Dokument muss vom Instrument abgelesen sein, nicht aus
der Erinnerung an die letzte Runde.** Beim Trennen nach Land und Wasser habe ich die WASSER-Zeile
mit **denselben Zahlen** gefüllt, deren Fehl-Zuordnung ich gerade behob: 0,584 / 0,111 / 1,487 sind
wörtlich das alte Ganznetz-Maximum, der alte Ganznetz-Median und dessen face load — umbenannt statt
neu gemessen. Gemessen sind es **0,287 / 0,031 / 0,731**, und **es klippt nichts**. Ich habe also
ein ⚠ gesetzt, wo das Instrument ✓ sagt, und daran anschließend einen ganzen Absatz gebaut.
Das ist die vierte Instanz derselben Familie in einem Slice, und die peinlichste: die drei davor
waren Konstruktionsfehler am Messgerät, dieser ist reine **Bequemlichkeit beim Berichten**.
Regel: **jede Zahl mit ✓ oder ⚠ im Dokument wird im selben Zug abgelesen wie sie geschrieben wird.**
Eine umbenannte Zahl ist eine erfundene Zahl. Und wer beim Umbau eines Instruments dessen alte
Ausgabe weiterschreibt, hat den Umbau nicht abgenommen, sondern nur durchgeführt.

**Fehlerklasse 46: eine Messung, die vom Seed abhängt, darf im Dokument kein URTEIL bekommen.**
Nach der Trennung nach Land und Wasser habe ich die Wasser-Zeile aus EINER Welt geschrieben — und
sie in der nächsten Welt widerlegt bekommen: `waterworld` ergibt Spitze 0,584 / Median 0,111, eine
landreichere Welt 0,287 / 0,031. **Faktor 2 und Faktor 3,6.** Mein „✓ klippt nicht" war für die
eine Welt richtig und für die andere falsch, und der daraus gebaute Absatz („Wasser 2,5× dunkler
als Land") war in der zweiten Welt **umgekehrt** — dort ist Wasser 1,4× HELLER.
Das ist dreimal dieselbe Bewegung: Land ist seedfest (die Palette ist eine Konstante), Wasser nicht
(sein Anteil ist gewürfelt). Ich habe die Eigenschaft der GRÖSSE ignoriert und wie bei Land
berichtet.
Regel: **bevor eine Zahl ein Urteil bekommt, muss geklärt sein, ob sie überhaupt eine Konstante
ist.** Ist sie welt-abhängig, gehört ins Dokument die SPANNE mit dem Messrezept — oder gar keine
Zahl, und die laufende Anzeige ist die einzige Autorität. Ein Urteil über eine Zufallsgröße ist
keine Abnahme, sondern eine Wette.

⚠ **Die Landmaske kommt vom BÄCKER, nicht aus einer Farbheuristik.** `globe.js` entscheidet
`terrainIsLand` sowieso je Vertex und schreibt die Antwort in `geo.userData.kfbLandMask` (ein Byte
je Vertex, 66 kB). Die naheliegende Abkürzung „blaustichig = Wasser" wäre der nächste Fehler
derselben Familie: das Biom `spires` ist selbst blaustichig (linear r 0,067 g 0,075 b **0,132**)
und würde als Wasser gezählt. **Wer raten muss, hat den falschen Ort gefragt.**

⏳ **Die offene Ozean-Frage, aus SEEDFESTEN Größen hergeleitet.** Die beiden Quellwerte hängen von
keiner Welt ab:
· `oceanShallow 0x2a8ca0` → linear **0,218** → face load **0,556**
· `oceanDeep 0x1560a0` → linear **0,111** → face load **0,283**
Das Land liegt jetzt bei Median 0,078 (load 0,199). Flachwasser ist damit **2,8×** heller als der
Landmittelwert, Tiefwasser **1,4×**. Vorher war das Land 3–5× heller als heute — der Ozean war also
gegen ein überstrahltes Land eingestellt, und dieser Vergleich fehlt jetzt. Beide Enden sind
betroffen: Flachwasser ist relativ zu hell (in wasserreichen Welten klippt es), Tiefwasser liegt so
nah am Land, dass der Kontrast Wasser/Küste verschwindet.
**Nicht blind nachziehen** — quellentreue Werte werden nicht geändert, um ein Maß zu befriedigen.
Zu entscheiden ist die FRAGE: bleibt der Ozean 1:1 quellentreu, oder kommt er wie die Landpalette
in ein eigenes kalibriertes Band? Das ist Georgs Entscheidung, keine technische.

⚠ **Der Schaum gehört NICHT in diese Messung.** `oceanFoam 0xb3ffff` hat als Hex die lineare
Luminanz 0,883 — aber Schaum ist ein **Shader-Effekt** im Ozean-Patch, keine gebackene Vertexfarbe.
Er erscheint in `albedo()` überhaupt nicht. Klippendes Wasser in der Messung ist deshalb **immer**
eine gebackene Flachwasserfarbe, nie Schaum — die Anzeige hat das eine Runde lang falsch benannt
und tut es nicht mehr.



**Fehlerklasse 42: Zwei Einheiten für dieselbe Größe sind schlimmer als keine Messung.**
Das Werkzeug, das ich gegen das Whack-a-Mole gebaut habe, meldete **linear** — Palettentabelle und
Abnahmegrenze standen in **sRGB**. Unterschied: Faktor 1,3 bis 3,1. Folgen, alle drei echt:
· die Abnahme „Median 0,25–0,45" wäre **nie** erfüllbar gewesen (linear liegt er bei 0,068);
· die Klipp-Urteile der Palettentabelle waren als Vorhersage falsch (vier Bänder angeklagt, zwei
  klippten wirklich);
· und ich hätte aus der Fehlanzeige auf „3× überkorrigiert" geschlossen und wäre erneut am Symptom
  gelandet — mit einem Messgerät als Ursache.
Das ist Fehlerklasse 40 in ihrer bösesten Form: nicht eine Summe ohne Eigentümer, sondern eine
**Einheit** ohne Eigentümer. Ein Messgerät ohne Einheit an der Anzeige ist ein Zufallszahlengeber.
Ab jetzt: `BAND_LIN` ist der eine Ort, die Panel-Zeile sagt `albedo(lin)`, und Hex-Angaben aus der
Palette (sRGB) werden im Modul ausdrücklich als „nie mit Vertexfarben vergleichen" markiert.

**Fehlerklasse 43: aus einem Dateiformat auf einen Materialtyp schließen ist Raten.**
S9c behauptete, die Kenney-Props kämen als `MeshStandardMaterial` und würden konvertiert. Gemessen
(von der Abnahme): **alle 35 Materialien sind `MeshLambertMaterial`** — und Lambert ist
quellentreu (`CampsiteScene.ts` 353). Der Wandler hat 0 umgebaut, das Panel schrieb `0 converted`,
und das Dokument behauptete das Gegenteil. Dazu hing die Verdrahtung an `marken.onReady`, das es
nicht gibt, mit einem `setTimeout(1500)`, der vor dem Ladeende feuert — ein Rückfall, der nie
gebraucht wurde, weil der Hauptweg nie existierte.
**Das Ziel war erreicht, bevor ich anfing.** Ich habe aus „GLB" auf „PBR" geschlossen statt
nachzusehen. `to-phong.js` bleibt als **Wächter**: es meldet im Panel `⚠ N UNCLAIMED PBR`, wenn
später doch ein PBR-Material in die Welt kommt — genau dann bricht der Lichthaushalt wieder
auseinander, und dann soll es AUFFALLEN statt sieben Runden zu kosten.
Nebenbefund derselben Klasse: die 36 Konsolenwarnungen kamen aus `roughness`/`metalness`, die ich
beim Wechsel auf Phong im Konstruktor stehengelassen hatte — **ein Materialwechsel ist nicht der
Wechsel des Klassennamens, sondern der Wechsel des Eigenschaftssatzes.**

**Fehlerklasse 41 (über meine Prüfung, nicht über den Code):** ich habe in diesem Slice vier Züge
an eine selbstgebaute Syntaxprüfung verloren, die mehrzeilige Imports und GLSL in Template-Strings
zerstörte und deshalb **unveränderte Dateien als fehlerhaft meldete**. Gefunden erst durch eine
KONTROLLPROBE gegen eine Datei, die ich nicht angefasst hatte.
**Ein Prüfwerkzeug ohne Kontrollprobe ist eine Meinung.** Die Kontrollprobe gehört vor die erste
Messung, nicht nach der vierten — und sie kostet einen Aufruf.

## 6h · S8 · Katapult und Parabelflug — Georgs Feature-Frage (29.8., geplant, nicht gebaut)

Georg: *„können wir jump/katapult-zonen/assets nutzen, um den spieler kurz nach oben zu
katapultieren — dann ballistische kurve mit kurzem Parabel-Flug → Karte und Pet lösen sich und
floaten mit zero-g → dann mit Transitions-Animation fällt man zurück zur Oberfläche/Flugbahn
zuvor…"*

**Ja — und es ist dieselbe Bauform, die S7b gerade richtig gemacht hat, nur auf der HÖHE statt
auf dem Kurs.** Das Ausweichen ist ein Versatz gegen einen gemerkten Kurs, der von selbst
zurückführt; die Parabel ist ein Versatz gegen die gemerkte Flughöhe, der von selbst
zurückführt. „Fällt zurück zur Flugbahn zuvor" ist wörtlich die Servo-Eigenschaft.

**Was dafür schon liegt:**
- `carpet.js` rechnet die Höhe **RELATIV zur Oberfläche und ohne absolute Grenze** — genau der
  Grund, warum wir tinyskies-Physik statt des v17-Controllers haben. Eine Parabel braucht also
  keine neue Klemme.
- Der **Tempo-Boden** (`setSpeedFloor`, S1) ist der Präzedenzfall für die saubere Naht: ein
  zusätzlicher Term IN `carpet.update`, nicht ein zweiter Schreiber daneben. Der Sprung braucht
  dasselbe: `carpet.launch(v0)` und eine Vertikalgeschwindigkeit, die `carpet` selbst integriert.
- `landmark-collide` hat bereits Klassen — `launch` ist die vierte, und die Zonen kommen aus
  `planSites`, also ohne zweite Weltmeinung.
- `pet-kinetics` (Federn zweiter Ordnung) und `card-carrier` (Sitz liest die Fläche jedes Bild)
  können „zero-g" ausdrücken, ohne dass etwas abgekoppelt wird.

**Die zwei Stellen, an denen es teuer werden kann — und die Antwort darauf:**
1. **„Karte und Pet lösen sich" darf keine Abkopplung sein.** `carrier.sync` liest fünf Felder;
   fehlt eines, verschwinden Karte UND Pet lautlos (Fehlerklasse 2, in v2 einmal bezahlt).
   Also **kein** Herausnehmen aus dem Rig, sondern ein Skalar `weightless` 0…1, der
   Federkonstanten und Ruhelagen weich verschiebt: das Pet hebt vom Sitz ab, die Karte kippt
   nach, beide bleiben Kinder derselben Kette. Sieht wie Lösen aus, ist keins.
2. **Der Kamera-Eigentümer.** Ein Parabelflug will eine andere Kamera (weiter weg, mehr Himmel).
   `intro-flight.js` hat das Muster schon: EIN Kamerabesitzer, das Zusatzmodul LIEST die Rig-Pose
   und blendet dagegen — bei Mischung 1 kommt bitgenau die Rig-Pose heraus. Genauso hier.

**Vor dem Bauen zu entscheiden (zwei Dinge, kurz):**
- **Was ist das Katapult im Bild?** Ein Asset aus einem Kit (dann vorher messen: Größe,
  Breite/Höhe, Helligkeit je Material, Fuß bei Null, Dreiecke — die Regel aus S3i), oder eine
  KFB-Sache: ein flach liegendes Kartenblatt als Sprungmatte, ein Trampolin aus der Tuschekante.
  Letzteres ist billiger und passt zur Marke.
- **Auslösen: automatisch beim Durchflug oder auf Taste?** Automatisch ist arcade und passt zu
  Karten und Würfeln; auf Taste ist ein Können. (Ich würde automatisch anfangen — eine Zone, die
  man treffen muss, ist schon Geschick genug.)

**Abnahmezahl, damit „schöne Parabel" nicht Geschmack bleibt:** Steigzeit, Gipfelhöhe über Grund
und Gesamtdauer in Sekunden — plus die Zahl, die wirklich zählt: **wie weit vom gemerkten Kurs
und von der gemerkten Höhe steht man nach der Landung ab?** Soll 0.

## 6i · Regel-Audit v3 gegen `use-what-works_v1.md` (29.8., nach Georgs Mahnung)

Auftrag verbatim: *„die Partikel bei Bodenkontakt … wirken wie Konfetti, was plötzlich über dem
Pet ausgeschüttet wird … völlig schlampig gebaut, muss neu konzipiert werden"* + *„halte dich an
meine Hauptregel"*.

**Diagnose: Anti-Pattern „Nachrechnen statt Kopieren" (Regel 2) und „Weiterflicken am Eigenen"
(Regel 4).** `ground-leaves.js` war die ABSICHT von `CarpetLeaves.ts`, nachgebaut — im Kopf der
Datei stand das sogar so, als wäre es eine Auszeichnung. Weggeworfen, nicht geflickt.

[CHANGELOG] additiv: `carpet-leaves.js` = `client/src/game/CarpetLeaves.ts` Zeile 1–300, alle
Konstanten, beide Shader und der Ablauf wörtlich · ENTFERNT: `ground-leaves.js`, dazu die
Panel-Zeile „Blätter: Menge" (die Quelle hat keine Rate zum Regeln) · UNVERÄNDERT: alles andere.

[NAHT] Eine Stelle: TS-Klasse → Fabrikfunktion mit injiziertem THREE; `isLand`, `tangentFrame`
und `cartesianFromSpherical` kommen aus unseren portierten Modulen statt aus den TS-Nachbarn.
Die `update`-Signatur bleibt wörtlich `(dt, qPosition, heading, globeRadius, speed, altitude,
seed, terrainType)` — der Runner rechnet NICHTS vor.

[BEWEIS] Die Quelle ist stumm (kein console-Aufruf), also gibt es keine Meldung zum
Wiedererscheinen. Ersatz nach Regel 6: `report()` liefert ihre eigenen Größen (`landAlpha`,
Pool 300, 0,25 je Bild, Schwelle 0,50) und beim ersten Ansprechen erscheint einmal
`[leaves] angesprungen bei Tempo 0.xx (Schwelle 0.50) · Pool 300 · 0.25 je Bild`.
⚠ **Regel 3 ehrlich: ich habe es NICHT gesehen.** In meiner Vorschau tickt rAF nicht
(`probe().bilder = 0` gemessen), also kann ich nicht behaupten, dass es im Bild anders aussieht.
Der Beweis läuft auf Georgs Schirm oder nicht.

### Warum es Konfetti war — drei Unterschiede zur Quelle
| | meine Fassung | CarpetLeaves.ts |
|---|---|---|
| Auslöser | Bodennähe (agl < 0,16) | **über LAND und Tempo > 0,50**, weich mit 0,08 nachgeführt |
| Spawn-Ort | vor und über dem Avatar | **`altitude · 0,7`**, also unter dem Fahrzeug |
| Menge | 34 je Sekunde, 96 Quads | **0,25 je Bild**, Pool 300, Blattform im Fragment-Shader |

Bei unserem Reisetempo 0,28 passiert in der Quelle **gar nichts** — Blätter sind ein
Schnellflug-Effekt. Genau deshalb sah meine Fassung nach Ausschütten aus.

### Der Rest des Audits (offen, ehrlich sortiert)

| Modul | Status gegen die Regel |
|---|---|
| `carpet-leaves.js` | ✅ Kopie (29.8.) |
| `post-radial.js` · `sky-dice.js` | ✅ Kopien aus v17 |
| `day-night.js` | ⚠ **Absicht nachgebaut.** `DayNightCycle.ts` existiert und ist ungelesen → Regel 2. Nächster Wegwurf. |
| `card-shadow.js` | ⚠ Eigenbau. Ob tinyskies einen Fahrzeugschatten hat, ist UNGEPRÜFT — vor jeder weiteren Zeile daran nachsehen. Steht auf aus. |
| `globe-landmarks.js` | ⚠ `Landmarks.ts` (tinyskies) ist ungelesen. `prop-scatter.js` ist nachweislich nicht portabel (Voxel-Kopplung), aber Landmarks.ts könnte die passende Vorlage sein. |
| Tempostreifen-Abbildung | ⚠ Ich habe den TREIBER einer 1:1-Portierung geändert (0…1 auf 0,8…1,15). Ehrlicher Befund: in der Quelle erreicht man 1,5 über Upgrades — der Effekt ist für unser Tempofenster vielleicht einfach nicht gedacht. Entscheidung offen. |
| `intro-flight.js` · `pointer-look.js` · `globe-zones.js` | ✅ legitim neu: in beiden Quellen gesucht, nichts gefunden (Intro), Maus ist unbelegt (FlightControls.ts ist Tastatur), Zonen gibt es auf einer Kugel nirgends. |

**Reihenfolge daraus:** (1) `DayNightCycle.ts` lesen und kopieren, mein `day-night.js`
wegwerfen. (2) `Landmarks.ts`, `CarpetWake.ts`, `CarpetDriftSmoke.ts`, `Contrails.ts` lesen,
bevor weitere FX entstehen. (3) Erst danach S6a (Ziele im Durchflug) — dort ist `sky-cards` aus
v17 die Vorlage, nicht meine Fantasie.
## 6e · Assets, Farbe und Licht in tinyskies — Analyse (29.8., Auftrag Georg)

### Assets: es gibt keine
`Landmarks.ts` (14 kB) enthält **kein einziges Mesh und kein einziges Asset**. Drin sind: ein
NAMENSGENERATOR für 16 Landmarken-Typen (Wortlisten aus Vor- und Nachsilben, Seed-gezogen,
Dubletten-Vermeidung), eine `LandmarkRegistry` und ein `LandmarkDetector`, der über das
Skalarprodukt der Spielernormale mit der Landmarkennormale auslöst — `enterDot: 0.995`,
`exitDot: 0.990` (Dorf), engere Werte für Leuchtturm/Mühle/Sternwarte (0.997/0.993).
Die MESHES der Landmarken stehen procedural in `Globe.ts`, aus Primitiven, ohne Textur.
Das einzige externe Modell des Projekts ist der Capybara-Passagier.

**Folge für uns, und das ist der wichtigste Satz dieser Analyse:** der portierbare Wert von
`Landmarks.ts` ist NICHT das Modell, sondern **Name + Auslöseradius**. Ein Überflug, der
„Windhaven" sagt, ist Orientierung; ein Modell ohne Namen ist Dekoration. Das gehört in S6a.

### Farbe: eine Hex-Farbe je Material, nie eine Textur
- Globus: **Vertex-Farben** plus ein Attribut `oceanDepth`, dazu vier Shader-Patches
  (Küstenkonturen, Schaum aus sieben Sinuswellen, Glitzern, Rim).
- Alles andere: `MeshPhongMaterial` mit `flatShading` und einer Hex-Farbe. Hex ist Absicht:
  `new THREE.Color(hex)` rechnet sRGB → linear, ein handgeschriebenes Float-Tripel nicht
  (unser Ausbrenner aus Runde 6).
- Texturen existieren nur als **Canvas** (Himmelsverlauf, Banner) — kein einziges Bild aus einer
  Datei.

### Licht: sieben Lampen, kein Tonemapping
Je Preset Sonne, zweite Sonne, zwei Fülllichter, Gegenlicht, Hemisphäre, Ambient — Summe der
Intensitäten tags ≈ 13. Dazu Nebel (near/far je Preset), Rim-Injektion in die Fragment-Shader,
Sterne nur nachts. `new WebGLRenderer({ antialias: true })`, **kein `toneMapping`, keine
`toneMappingExposure`**. Das geht nur auf, weil alle Farben für genau dieses Licht gewählt sind.

### Was daraus für unsere Kenney-Imports folgt
Unsere Assets sind ein FREMDES Farbsystem, und die drei Symptome dieser Nacht sind alle dasselbe:

| Kit | gemessen | Verhalten |
|---|---|---|
| `kenney_nature-kit` | `position, normal, uv`; Material je Teil mit Hex-Farbe (`woodBark`, `leafsGreen`) | ✅ funktioniert — es IST die Logik der Quelle |
| `GLB_hexagon_kit` | **nur `position, normal`** — kein `uv`; ein Material `colormap` in Weiß | ❌ weiß (überstrahlt) bzw. schwarz (Atlas bei uv 0,0 = schwarze Ecke) |
| `kenney_fantasy-town-kit_2.0` | `position, normal, tangent, uv` + Atlas `Textures/variation-a.png` | ⚠ Atlas würde greifen, aber es sind BAUTEILE, keine Häuser |

Behoben in v3c: der Atlas wird nur an Netze MIT UVs gehängt, und atlaslose Modelle bekommen eine
Hex-Farbe je Modell aus der KFB-Palette (`MARKEN[].col`) — Burg und Turm warmer Stein, Zauberturm
violett, Mühle Holz, Markt Terrakotta. Das ist die Farb-Logik der Quelle auf fremden Silhouetten,
nicht ein Atlas, den die Datei nicht tragen kann.

**Offene Entscheidung für später:** entweder die Landmarken kommen aus einem Kit MIT UVs (dann
trägt der Atlas), oder sie werden wie in tinyskies aus Primitiven gebaut (dann trägt die Palette,
und die Silhouette ist unsere). Beides ist vertretbar — der Mischweg (fremdes Modell, fremder
Atlas, unser Licht) ist der einzige, der es nicht ist.
## 6f · Landmarken: die Vorlage steht schon im Projekt (29.8.)

Georgs Entscheidungen: **Cut-outs für Kleinzeug, Türme für große Landmarken** · die Karte kommt
**aus dem Welt-Deck, die Landmarke IST das Sammelziel** · „lebendig" über den **vorhandenen
Verbieger-Atem**. Dazu sein Hinweis: ein POC „KFB Pixelbäcker v1" kann später Sprites aus den
farbigen 3D-Assets backen (Winkel und Licht für Pop-ups optimiert).

### Befund: `terrain-v17/sky-cards.js` (443 Zeilen) kann beides bereits
Gelesen 29.8. Der Kopf nennt vier Teile: Karten VERTEILEN · zur Kamera AUSRICHTEN (gedämpfter
Slerp, „Lesbarkeit schlägt Physik") · **DURCHFLUG erkennen** (Skalarprodukt mit der Kartenebene,
der Vorzeichenwechsel IST das Ereignis, kein Solver) · die Karte als **Portal auflösen**
(geteilte Alpha-Map plus steigender `alphaTest`, null CPU). Dazu: Kartenformat als EINE Zahl
(`CARD_AR` aus `cardbuilder/kfb-card-format.js`), Textfassung der Karte als Ladezustand („nie
ein leeres Blatt"), kanonische Tuschekante, `onPass`-Rückruf, `nearest()`, `setDeck()`.

**Das ist gleichzeitig das Cut-out (immer zur Kamera, gedämpft) und der Durchflug-Kern von S6a.**
Neu zu bauen wäre davon: nichts.

### Was in dieser Runde kopiert wurde (nicht verdrahtet)
[CHANGELOG] additiv: `globe-v3/sky-cards.js` (Kopie, 443 Zeilen) · `globe-v3/ink-tail.js`
(Kopie, 131 Zeilen, keine Abhängigkeiten) · `globe-v3/card-contour.js` (**Zitat** der
Kartenkante aus `academy-deck.js` Zeilen 43/240/244/245–254).

[NAHT] Zwei Stellen, beide im Kopf von `sky-cards.js` ausgeschrieben:
1. **Import der Kartenkante** → `card-contour.js`, weil `academy-deck.js` an `world-context.js`
   und `kfb-ink.js` hängt und die Kante beides nicht braucht.
2. **Die Platzierung — offen.** `place()` verteilt auf einem Ring in einer EBENE
   (`ring`, `ringJit`, `yMin`), `setCenter(x, z)` schiebt die Welt mit dem Spieler. Auf der Kugel
   braucht das den Tangentialrahmen, dieselbe Umrechnung wie in `sky-dice.js`.

[BEWEIS] Steht aus: solange Naht 2 offen ist, ist das Modul kopiert, aber **nicht bewiesen** —
in v17 lief es, hier hat es noch kein Bild gemacht. `formatReport()` ist die Abnahme, die es
selbst mitbringt (Sollformat der eingelegten Zelle).

### S3d · verdrahtet (29.8.) — Naht 2 steht

[CHANGELOG] additiv: in `sky-cards.js` eine Kugelfassung (`setSphere`, `setFrame`, ein
`if (sph.on)`-Zweig in `place()`, eine Zeile in `update()`), im Runner die Verdrahtung samt
Welt-Deck und Sammelzähler. UNVERÄNDERT: Drift, Ausrichtung, Durchflug-Erkennung, Portal,
Textblatt, Tuschekante, `pumpArt`-Drosselung — Zeile für Zeile v17.

[NAHT] Zwei Zeilen, beide gemessen statt geraten:
- **Ring in der Ebene → Bogen auf der Kugel.** Azimut um die Standortnormale, Radius als
  BOGEN (`r / R` auf die Richtung addiert), Höhe über der Oberfläche. `_up` wird in `update()`
  auf die Standortnormale gesetzt — ohne diese eine Zeile stehen die Karten auf der Kugel schief.
- **Maßstab.** v17: Karte 11, Ring 150. Wir: Karte 0,08 (die Flugkarte ist 0,075), Ring 1,15 —
  Faktor ~140, weil der Globus Radius 5 hat.
- ⚠ **Zwei eigene Fehler, beide durch Messung gefunden:** (1) `createSkyCards` ruft `place()`
  schon im Konstruktor, da ist die Kugelfassung noch aus — gemessen Radius **1,1 statt 5,2**, die
  Karten lagen INNERHALB des Globus. Behoben mit einem `reset()`, nachdem der Rahmen steht.
  (2) Mein erstes Höhenband (0,05…0,24, direkt aus v17 umgerechnet) hing die Karten bis zu drei
  Kartenbreiten über den Kurs. Jetzt 0,015…0,11 — gemessen liegen die sechs Karten 0,016…0,106
  über dem Pet, also im normalen Flug erreichbar.

[BEWEIS] `formatReport()` der Quelle antwortet (`sollformat: 1.74`), `onSphere: true`, sechs
Karten, 0 Fehler. **Das Welt-Deck läuft:** `[globe] Welt-Deck: medkayfab_psychiatry · 56 Karten`
— ein Deck je Seed, gezogen aus dem Registry-Pool.
⚠ Offen und ehrlich: `eingelegt: 0` — es ist noch KEIN Artwork eingelegt. pdf.js rendert in einer
verdeckten Seite nicht (steht seit Runde 11 als Messartefakt im Dokument), also tragen die Karten
hier ihre Textfassung. Ob echtes Artwork ankommt, ist erst auf Georgs Schirm belegbar — die Zahl
dafür ist `__globe.sky.formatReport().eingelegt`.

### S3d · Karten-Türme (29.8.)

`card-towers.js` — Landmarken als Kartenhaus: 2–4 Blätter je Turm, gegeneinander verdreht,
Neigung wächst nach oben, langsames Schwanken (zwei langwellige Sinus, Phase je Blatt).
Drei Entscheidungen mit Grund:
1. **Ein Blatt = ein Mesh** (flacher Quader, EIN Material). Ein Quader mit sechs
   Materialgruppen hätte bei 10 Türmen × 3 Etagen **180 Draw-Calls** gekostet; so sind es 32.
2. **Die Textur kommt aus `sky-cards.js`** (`cardTexture`, dafür exportiert — Naht 3). Ein
   zweiter Kartenmaler war in v2 die Ursache für Gutter und Doppelkante.
3. **Der Turm steht auf dem Bauplatz aus S3a** und liest `site.alt` — dieselbe Höhe, die
   Flugphysik, Mesh und Schatten sehen.

[BEWEIS] Gemessen: 10 Türme, 32 Blätter, erster Turm bei Radius 5,134 (Zonenhöhe), Deck 56
Karten eingehängt, 220 Draw-Calls gesamt, 0 Fehler.

[NAHT] **Trefferfenster 1,8 statt 1,0.** In v17 ist eine Karte 11 Einheiten breit, da ist ihre
Fläche ein faires Tor; bei 0,08 Breite wäre das halbe Fenster 0,04 × 0,023 — eine Nadel. 1,8
macht daraus 0,072 × 0,041. Im Panel regelbar, 1,0 ist der Quellwert.

⚠ **Eigenfehler, dokumentiert:** ein Edit hat literale `\n` in eine Zeile geschrieben statt
Zeilenumbrüche. Weil `//` die ganze Zeile schluckt, lief die Seite **fehlerfrei weiter** — aber
`yMin/yMax/passRadius` fielen auf die v17-Defaults (22…78 Einheiten Höhe!). Gefunden nur, weil
die Abnahme `passRadius` GEMESSEN hat statt sie zu behaupten. Fehlerklasse: eine stille
Rückkehr auf Defaults sieht wie Erfolg aus.

⚠ **Zweiter Eigenfehler derselben Runde, von der Abnahme gefunden:** Türme und Kenney-Gebäude
bekamen DIESELBE Standortliste — gemessen standen alle zehn Kartenhäuser IN einem Gebäude
(Abstand 0,020…0,039 u bei 0,115 u Blattbreite, die Körper durchdringen sich vollständig).
`card-towers` setzte zwar `site.turm = true`, aber niemand las es — totes Flag. Auf ein Flag zu
hören wäre auch die falsche Lösung gewesen (die Landmarken laden asynchron, die Türme werden
synchron und beim Deck-Eintreffen erneut gebaut — eine Timing-Falle). Jetzt teilt der RUNNER die
Liste: `slice(0, 10)` an die Türme, `slice(10)` an die Kenney-Modelle. **Eine Zone, ein Bauwerk.**
Nachgemessen: kleinster Abstand je Turm 2,3…5,5 u (vorher 0,02…0,04), 10 Türme, 20 Gebäude-
Instanzen, 0 Fehler.

### S3e · Surreale Umgebungs-Props (29.8.)

Georg: „ich würde Bäume und andere (gerne surreale) Kenney-Props als Environment-Props nutzen …
auch große Zuckerstangen, Bleistifte, Toiletten, Bücherregale → KFB ist absurd und surreal, aber
mit Logik unter der Haube." Erstmal alles kreativ und zufällig verteilt, Biom-Klassen später.

**Die Auswahl ist GEMESSEN, nicht gesammelt.** Jeder Kandidat wurde geladen und auf drei Dinge
geprüft: Farbe je Materialteil (die tinyskies-Logik), Dreieckszahl, Höhe.

| Modell | Teile / farbig | Dreiecke | aufgenommen |
|---|---|---|---|
| `jerryblessed-book-4923` | 10 / 9 | **120** | ✅ ein Buch für 120 Dreiecke |
| `OpenBook_FrizzleBobFractalAlmanac_01` | 2 / 2 | 464 | ✅ KFB-Kanon |
| `KFB_Crown_01` · `KFB_Coin_01` | 2 / 2 · 1 / 1 | 840 · 396 | ✅ Münze steht als Wahrzeichen |
| `quaternius_cc0-table-1411` | 2 / 2 | 1500 | ✅ |
| `palm-detailed-straight` · `barrel` · `cross-wood` | je 1, Kit-Farbe | 482 · 148 · 126 | ✅ |
| `arunangshubanerjee-dice-4550` | 1, **weiß** | 2300 | ✅ mit Palettenfarbe (Würfel sind Kanon) |
| `pixellabs-dead-tree` · `-knife` · `-stairs` | — | **49.950 · 50.000 · 50.000** | ❌ 30–400× zu teuer |
| `plaggy_cc0-scissors-590` | 2, weiß | 1264 | ❌ kommt wieder, wenn sie Farbe hat |
| `signpost` (survival) | 1, weiß | 44 | ❌ braucht einen Atlas, den das Repo nicht hat |

**Maßstab ist der Witz:** ein Buch von 0,13 Weltmaß neben einem 0,075 breiten Pet ist ein
GEBÄUDE. Die Welt liest sich als Schreibtischplatte, über die man fliegt.

[BEWEIS] Gemessen nach dem Einbau: 20 Modelle, 382 Exemplare, **39 Draw-Calls**, 0 Fehler
(`archipelago`, 17 % Land). Verteilung: 3 Bücher, 4 Almanache, 4 Tische, 3 Palmen, 3 Kreuze,
2 Fässer, 2 Kronen, 1 Münze, 1 Würfel — sparsam, damit sie auffallen.

**Offen, notiert:** Georgs Hinweis „Terrain-Cards können auch auf Wasser/Fluids liegen/floaten"
— dafür braucht `planSites` ein `allowWater` und die Karte einen Wasserstand statt einer Zone.
Dazu die Biom-Klassen („preferred assets per Biom"), die auf S3c warten, und ein JSON-Katalog
mit den gemessenen Werten (Georg kann ihn vorbereiten lassen — die drei Spalten oben sind das
Schema: Teile/farbig, Dreiecke, Höhe).

### S3f · Überflug-Namen und Kartenfächer (29.8., KISS)

**`landmark-names.js` — Mechanik portiert, Namen neu.** Aus `Landmarks.ts` übernommen: die
Hysterese (`enterDot` 0,995 / `exitDot` 0,990, enge Marken 0,997 / 0,993 — der Abstand ist der
Flackerschutz), der Gewinner über das GRÖSSTE Skalarprodukt statt über den ersten Treffer, und
`onEnter`/`onExit` als einzige Schnittstelle. Park–Miller-PRNG wie in der Quelle.
Die Wortlisten sind NEU und als solche gekennzeichnet: die Quelle nennt Dörfer „Windhaven", bei
uns heißen Orte nach dem, was dort steht — „Laute Kartei", „Gedruckte Adresse", „Heilige
Kartei". Auf der Kugel entspricht 0,995 einem Kreis von ~0,5 Weltmaß bei Radius 5.

**`collect-hud.js` — Fächer, Zähler, Ortsschild, alles DOM.** Warum kein 3D: ein Fächer aus fünf
Papierstreifen ist eine CSS-Übung; als 3D wären es fünf Meshes, fünf Texturen und ein zweiter
Kamerabesitzer fürs Overlay. Neuestes Blatt oben und gerade, ältere aufgefächert und blasser,
Zahl mit einem Punch (die einzige Animation, die es braucht). Der Ortsname blendet nach 3,2 s
von selbst aus — sonst klebt er, wie der Tonhinweis in v2.

[BEWEIS] Gemessen: 20 benannte Orte (10 Türme + 10 Kenney-Marken), Namen wie oben, Fächer legt
bei simuliertem Durchflug ein Blatt und der Zähler steht auf 1, 218 Draw-Calls, 0 Fehler.
⚠ Ein Eigenfehler unterwegs: `const hud` kollidierte mit dem bestehenden `hud` (der
Marken-Wurzel) — **Syntaxfehler, keine Seite.** Umbenannt in `hudWurzel`. Zwei gleiche Namen in
einer 1300-Zeilen-Funktion sind kein Zufall, sondern die Folge fehlender Namensräume; der
nächste Anbau bekommt ein Präfix.

### S3g · UI auf Englisch, Fächer nach Overworld-Muster (29.8.)

Georgs Liste, Punkt für Punkt:
- **Alles strict EN** (DE später): 153 Strings umgestellt — Abschnittstitel, alle Reglernamen,
  Notizen, Tastenlegende, Marke, Meldungen. Gegengeprüft: im Panel steht kein deutsches Wort mehr.
  Die Ortsnamen bleiben vorerst deutsch generiert — sie sind INHALT, nicht UI; nächster Slice.
- **Zähler in der Mitte des Fächers**, klein, ohne Platte (Kontur statt Fläche). Der rote Kasten
  von vorhin ist weg.
- **Kartenmotive auf den Blättern:** das Blatt trägt das Canvas der 3D-Karte (eine Textur, ein
  Maler). Umgewandelt wird je Aufnahme, nicht je Bild; nur die letzten sechs Blätter bleiben.
- **Fächer-Mechanik 1:1 aus `overworld-v15/card-rail-v9b.js` (`.r9pile`)**: Blätter liegen
  übereinander, der Zeiger fächert sie auf, Hover hebt den Stapel (z-index) und vertieft den
  Schatten. Geometrie hier radial, weil der Zähler in die Mitte gehört.
- **Detailansicht im Overlay** (Klick auf ein Blatt): großes Blatt, Titel, `z-index: 9999`.
- **Schließer ohne Rahmen**, dezent (Deckkraft 0,55 → 1 bei Hover) — im Panel und im Overlay.
- **Panel: Spalten statt Grid.** Ein Grid hält Reihen auf gleicher Höhe, ein zugeklappter
  Abschnitt hinterlässt also ein Loch und man scrollt ewig. `column-count: 3` (2 unter 820 px,
  1 unter 560 px) mit `break-inside: avoid` lässt alles nachrücken.
- **Ebenen geklärt:** HUD z 9, Panel z 12, Overlay z 9999 — Einstellungen liegen immer über dem
  Fächer.

[BEWEIS] Gemessen: `columnCount: 3`, HUD z 9, Panel z 12, zwei Blätter im Fächer, Zähler
„2 CARDS", kein deutsches Wort im Panel, 0 Fehler.

### S3h · Vier Abnahme-Befunde, jeder mit einer Ursache (29.8.)

Vier Runden „needs_work" in Folge — hier stehen sie, weil jede eine eigene Fehlerklasse trägt.

1. **Ortsnamen waren `NaN`** — und der Fehler war SEED-ABHÄNGIG. `seed * 7919` läuft bei einem
   Weltseed von 6·10⁸ über 2³¹, `| 0` kippt ins Negative, der Index wird negativ, das Listenfeld
   `undefined`, und `undefined + undefined` ergibt NaN. Kein Konsolenfehler, nur ein Schild, auf
   dem eine Zahl steht. Mein erster Beweis lief mit einem Seed, dessen Abschneiden zufällig
   positiv blieb — **ein einzelner Seed ist kein Beweis.** Behoben (erst modulo, dann
   multiplizieren), gegen neun Seeds × acht Arten geprüft.
2. **UI-Sprache: die Nachzügler standen in DATEN, nicht in Labels** — ein zustandsabhängiges
   Suffix („· Wasser", nur über Wasser sichtbar) und ein Quellen-Text. Statt weiter Strings zu
   tauschen: ein Sprachscan über alle Literale aller Module plus über alle 180 Textknoten im
   laufenden Bild. Danach 0 Treffer.
3. **Die Detailansicht lag nicht oben, obwohl sie `z-index: 9999` hatte.** `#kfb-hud` hat
   `position` + `z-index` und öffnet damit einen **Stacking-Context** — ein Kind darin kann das
   Geschwister `#kfb-ui` (z 12) nie überdecken, egal wie groß seine Zahl ist. Behoben nicht am
   Zahlenwert, sondern durch Herauslösen: `#kfb-look` hängt als eigene Schicht an `#tv-stage`,
   mit eigenem Wiedereinhänger im 500-ms-Intervall.
4. **Die Startansicht ertrank in der Atmosphärenhülle.** Die Hülle ist quellentreu
   (Radius 1,55·R = 7,75, BackSide, additiv) und in tinyskies unproblematisch, weil dort die
   Kamera die Oberfläche nie verlässt. Unsere Startansicht beginnt bei 2,75·R = 13,75 — von
   AUSSEN malt die Gegenhemisphäre additiv über das ganze Bild. **Das ist der erste Ort im
   Projekt, an dem die Kamera außerhalb von 1,55·R steht.** Behoben mit einer Blende nach
   Kameradistanz (Band 1,50…1,62·R, smoothstep), und beide Schreiber auf die Glut laufen jetzt
   durch EINE Stelle: `glowBase × fade`. Gemessen: 13,75 → 0 · 7,9 → 0,26 · 7,5 → 1 · innen 1.

**Lehre für die nächste Runde:** drei der vier Befunde waren unsichtbar, solange man EINEN
Zustand geprüft hat — ein Seed, ein Ort (über Land), eine Kameradistanz. Abnahme heißt hier:
mehrere Zustände durchfahren, nicht einen bestätigen.

### S3i · Einschlag, Kartenflug, Ausrichtung, Asset-Audit (29.8.)

**Der Einschlag beim Sammeln war fast nicht vorhanden — und einer der Gründe war ein Klangname,
den es nicht gibt.** `sfx('pickup')` steht in KEINER MAP von `audio-switch.js`; der Aufruf fiel
auf einen leeren Kanal. Jetzt fünf Dinge, alle aus vorhandenen Bausteinen: `sfx('card')`
(kfb `card` / tiny `chime_1`) plus `sfx('boost', 0.45)` darunter · `rig.shake(0.016, 0.22)` —
**die Kamera hat den Stoß seit v1 und er wurde nie benutzt** · Tempostreifen- und Blur-Burst über
einen 0,45-s-Nachhall · und der Flug.

**`card-flight.js` — die Karte fliegt in den Stapel, 3D.** Georgs Vorgabe: „kein einfaches
Verschieben". Startpunkt ist die Weltposition beim Durchflug, Ziel ist der HUD-Stapel, aus dem
Bildraum in die Welt ZURÜCKPROJIZIERT (dann landet sie bei jeder Fenstergröße dort, wo der Fächer
wirklich liegt), dazu ein Bogen um die Kamera-Hochachse (eine Gerade liest als Schieben), Taumeln
um zwei Achsen und ein Squash-Überschwinger bei 15 % des Wegs. **Das Blatt erscheint erst bei
ANKUNFT** — der Zähler springt, wenn die Karte da ist, nicht wenn sie getroffen wurde.
Eigenes Modul statt eines Zustands in `sky-cards.js`: die Kopie behält ihren Portal-Zerfall,
der Flug ist unsere Arbeit (Naht 4 ist eine Zeile: die Textur der getroffenen Karte merken).

**Ausrichtung.** Fächer und Zähler stehen jetzt auf DERSELBEN Achse wie das Zahnrad — gemessen
886 / 886 / 886 px. Zwei Ursachen lagen dazwischen: der Zähler war ein Kind des 44-px-Fächers
(sein `right` löste gegen diese Box auf, 60 px zu weit links), und der Punch schrieb inline
`translate(-50%,-50%)` aus einer früheren Fassung — das verschob ihn um genau die halbe Breite.
Der Fächer fächert bei Hover nach OBEN bis unter das Zahnrad (Weg 168 px, gedeckelt).

**Detailansicht auf Papier**, gleiche Breite und Kopfzeile wie die Einstellungen
(`min(960px, 100% − 32px)`), Tusche auf Papier statt schwarzem Grund — ein dunkler Hintergrund
wäre ein Dark Theme, und wir sind auf Papier.

**Kartenhöhe: Bezug ist der BODEN, nicht die Flughöhe des Spielers.** Georg: Sammeln soll leicht
sein, Darunterdurchfliegen die Ausnahme. Da der Teppich selbst in konstantem Abstand über Grund
fliegt (surfaceAlt + 0,03), ist ein konstanter Bodenabstand automatisch Flughöhe: Band 0,005…0,045
über Grund, über Wasser ab Meeresspiegel. Höher liegende Karten sind ein anderer Spielmodus.

**Asset-Audit — und die Ursache war meine Normierung.** Georg: „riesengroße dunkle Block-Meshes".
Gemessen: Buch 0,16×0,03×0,23 (Breite/Höhe **6,6**), Almanach 6,9, Tisch 3,4. Ich normierte JEDES
Modell auf seine HÖHE — ein Buch von 0,13 Höhe wird damit 0,69×0,99 groß, also eine Platte.
`prop-scatter.js` macht es richtig (`TARGET_FP`): flache Dinge auf die GRUNDFLÄCHE normieren.
Jetzt `fit: 'fp'` in der Tabelle plus Notbremse bei allem flacher als 1,8:1.
Verworfen (fail fast): `quaternius_cc0-table-1411` — beide Materialien bei Helligkeit 0,09/0,11,
also 100 % dunkel; mit unserer Albedo-Dämpfung ein schwarzer Klotz. Fast-schwarze Materialien
werden generell auf L 0,28 gehoben (Grenze 0,18, gemessen).
**Neue Regel für alle künftigen Assets:** vor dem Einbau messen — Größe, Breite/Höhe, Helligkeit
je Material, Fuß bei Null, Dreieckszahl. Vier Zahlen, und sie hätten diesen Fehler verhindert.

### S3j · Wortmarke, Kartensprünge, Zähler (29.8.)

- **Wortmarke.** Zwei Ursachen: `text-shadow: 2px 2px 0 cream` auf dem GANZEN Element liest auf
  dunklem Grund wie eine zweite, verrutschte Schrift, und `align-items: center` setzt zwei
  Schriftmetriken mittig statt auf EINE Grundlinie — deshalb saß der rote Kasten tiefer.
  Jetzt Grundlinie, allseitige dünne Cremekontur statt Versatz, Kasten auf die Versalhöhe
  gerückt, kein Kippen im HUD. Gemessen: Grundlinien-Versatz 2 px, `transform: none`.
- **Die Kartensprünge waren `recycle` und der Respawn.** In v17 liegt der Ring bei 150 Einheiten,
  ein Umsetzen passiert weit außerhalb des Bildes; bei unserem Ring von 1,15 mitten im Blick.
  Naht 5: umgesetzt wird nur, was HINTER dem Spieler liegt (Skalarprodukt mit der Flugrichtung),
  und neue Karten erscheinen am Außenrand des Rings. Dazu der Flug in den Stapel flacher und
  kürzer (Bogen 0,22 → 0,06, Dauer 0,78 → 0,55 s): die Karte wird MITGENOMMEN, nicht geworfen.
- **Label „CARDS" ersatzlos raus** (Georg: zu nah am Rand, trägt keine Information). Die Zahl
  neben dem Stapel ist selbsterklärend; Achse weiter exakt auf dem Zahnrad (886/886).

### S6d · Würfel-Durchflug und Pop Score (29.8., KISS)

- **Trefferabfrage in `sky-dice.js`** (Naht): liegt der Avatar innerhalb von 0,9·Würfelgröße,
  zählt die Augenzahl der Fläche, die der FLUGRICHTUNG am direktesten gegenübersteht — Georgs
  Regel „Impact-Seite", und dieselbe Rechnung wie `findJudge`, nur mit der Flugrichtung statt der
  Kamera. Der getroffene Würfel bleibt 6 s weg, sonst zählt ein Durchflug mehrfach.
- **Pop Score im HUD** unten links, auf derselben Grundlinie wie der Kartenzähler (gemessen
  9 px / 9 px). Ein Punch, kein Zählwerk.
- Der Einschlag benutzt die vorhandenen Bausteine: `sfx('roll')`, `rig.shake`, der 0,45-s-Nachhall
  für Tempostreifen und Blur.

[BEWEIS] Gemessen: Treffer liefert `{pips: 1, die: 'rot'}`, der zweite Versuch auf denselben
Würfel `null` (Sperre greift), HUD-Anzeige „1", 0 Fehler.
Offen: die Farbsemantik (rot = schlecht, gelb = FX, blau = gut) ist noch nicht verdrahtet — die
Farbe kommt im Treffer schon mit (`treffer.farbe`), es fehlt die Wirkung. Und der drehbare
UI-Würfel in Pet-Grundfarbe ist noch eine Zahl, kein Würfel.

### S3c · Biom-Domänen — gemischt, nicht geschaltet (29.8., erledigt)

Der Befund aus §6b D war: der Seed zieht EINEN `terrainType` für die ganze Kugel, deshalb ist die
Welt monoton. Gebaut ist jetzt `globe-biome.js` — vier Ankerrichtungen je Seed, Gewichte als
**sphärischer Softmax** (`exp(k · dot(p, anker))`, normiert). Vier Skalarprodukte und vier
Exponentialfunktionen je Probe, keine zweite Rauschfunktion, kein zweites Weltmodell.
Biome: **Plateau · Spires · Shatter · Flatwater** (Maßstab, Persistenz, Lakunarität,
Rückgrat-Band, Relief, Rauheit, Landtönung).

[NAHT] **Drei Stellen, und alle drei sind Einbahnstraßen zu EINER Wahrheit:**
1. `simplex-noise.js` bekommt EINEN Haken (`setBiomeFieldHook`) in `sampleTerrainFieldValue`.
   Der Haken sitzt dort und nicht bei den Lesern, weil Mesh, Flugphysik, Zonen, Props, Schatten
   und Karten alle über diese eine Funktion fragen. Ein Umschalten in jedem Leser wäre
   Fehlerklasse 1. Den Haken setzt `globe-biome.js` selbst — so importiert der Port nichts.
2. `terrain-surface.landDisplacement` liest `relief` und `rough` (Plateau flach, Spires zackig).
   Das Feld entscheidet, WO Land ist; die Auslenkung, WIE es aussieht — aus derselben Gewichtung.
3. `globe.js` mischt eine Landtönung NACH den Höhenbändern und **über der Firngrenze nicht mehr**
   (sonst wird der Gipfel grün). `biomeTint: 0` ist quellentreu.

⚠ **Was bewusst NICHT gemischt wird: die Schwelle.** `terrainIsLand(type, value)`,
`terrainElevationFromValue` und `terrainWaterDepthFromValue` bekommen KEINE Position. Eine
ortsabhängige Schwelle hieße drei Signaturen im 1:1-Port ändern und jeden Leser mitziehen —
genau so entstehen zwei Höhenwahrheiten. Die Land/Wasser-Grenze bleibt global; sichtbar ist die
Abwechslung trotzdem (sanfte Ebene neben Grat neben zersplitterter Küste).
Zweite Grenze, notiert: die Oktavenzahl bleibt bei 4 (dem höchsten der vier Presets) — eine
gebrochene Oktave gibt es nicht.

⚠ Reihenfolge ist wieder der ganze Trick, dieselbe Lehre wie bei den Zonen: `setBiome` läuft
**vor `planSites` und vor dem Bake**. Wer die Domänen später einschaltet, hat ein Mesh in einer
Welt und eine Physik in einer anderen.

[BEWEIS] **Die Abnahmezahl, die §6b D verlangt hat, steht:** `biomeReport()` läuft acht
Großkreis-Bahnen mit Reisetempo (0,28 / Radius 5 → Bogen 3,36 rad auf 60 s) und zählt die
Wechsel des dominanten Bioms. Gemessen über **neun Seeds: 1,75 … 2,75 Wechsel je 60 s
Reiseflug, in allen neun Welten alle vier Biome vorhanden.** (Ein Seed ist kein Beweis — die
Lehre aus S3h.)
Höhenfeld gegengeprüft an sechs Punkten: mit Biomen 0,136 / −0,005 / −0,010 / 0,070 / −0,010 /
−0,007, ohne 0,191 / −0,010 / 0,154 / −0,004 / −0,010 / 0,130 — und nach dem Wiedereinschalten
**bitgleich** zur ersten Messung. Der Rückweg ist also echt: `?biom=0` (ein Typ für die ganze
Kugel), Übergangsbreite `?biomk=4.5`. Marke und Panel zeigen das Biom unter dem Pet
(vier Skalarprodukte je Bild).

**Offen und bewusst nicht in diesem Slice:** die Prop-Vorlieben je Biom (`biomeAt().id` liegt
dafür bereit, die `_dark`/`_fall`-Namensfassungen aus `prop-scatter.js` sind der Anschluss), und
Wetter/Tageszeit an derselben Gewichtung.

### S7 · Core Events — die Kollision. Erste Runde: die Mechanik, nicht die Show (29.8.)

Georgs Befund, vollständig: Karten bleiben nach der Kollision zu lange stehen · der Einschlag
löst keine Reaktion an der Karte aus · sie verschwindet erst kurz vor dem Bildrand · die
Animation hat keinen Bezug („eine zweite Karte, schräg, nicht als Karte erkennbar — und sie geht
vom Pet aus, während die echte Karte unten weiter vorbeizieht") · der Fächer ist ungestaltet ·
**„es macht keinen SPASS, eine Karte zu treffen"** · für die Würfel gilt dasselbe.
Dazu der Vorwurf, der der wichtigste Satz dieser Runde ist:

> „allein die Idee, dass potentiell ZWEI Karten gerendert werden, um eine Animation EINER Karte
> zu realisieren, zeugt von A) großer gedanklicher und technischer Faulheit B) nachlässiger
> Arbeitsweise C) nicht-befolgen meiner Anweisungen"

Er hat in allen drei Punkten recht, und der Beweis stand in meinem eigenen Dateikopf: dort war
die Kopie als ENTSCHEIDUNG begründet („eigenes Modul, damit die Kopie ihren Portal-Zerfall
behält"), während in DIESEM Dokument Fehlerklasse 1 steht — *zwei Verwalter derselben Sache.*
Eine Begründung, die eine Regel bricht, die man selbst aufgeschrieben hat, ist keine Entscheidung,
sondern eine Ausrede. Neu als **Fehlerklasse 10** unten.

**Gebaut, mit vier Ursachen, alle gelesen und nicht geraten:**

1. **Übergabe statt Kopie (Naht 6).** Es gibt genau EIN Mesh je Karte. Beim Treffer übergibt
   `sky-cards.handOver(card)` es: Zustand `flying` — keine Drift, keine Ausrichtung, kein
   Treffertest, kein Respawn, kein Texturtausch, `recycle`/`pumpArt`/`setVisible`/`setDeck`
   fassen es nicht an. `card-flight.js` bewegt es und gibt es mit `release()` zurück in die
   Respawn-Uhr. Das Modul erzeugt jetzt **keine Geometrie, kein Material, keine Textur.**
   `takeOnPass: false` ist der Rückweg auf die v17-Portalauflösung.
2. **Der Flug ging vom PET aus, weil der Runner ihm `carrierState.position` gab.** Jetzt startet
   er an der Weltpose des Treffers — die ist mit der Übergabe automatisch da, weil es dasselbe
   Mesh ist.
3. **„Schräg, nicht als Karte erkennbar" war das Taumeln um zwei WELTACHSEN.** Jetzt bleibt die
   Karte der Kamera zugewandt und rollt in ihrer EIGENEN Ebene (Z-Roll) — *Lesbarkeit schlägt
   Physik*, dieselbe Regel, die in `sky-cards.js` schon steht. Einschlag 0,10 s (die Karte STEHT,
   punchst auf 1,26, wird weißglühend), Flug 0,42 s (vorher: 0,9 s Zerfall + 0,78 s Flug).
4. **Trefferfenster (Naht 7).** Gemessen bei `passRadius` 1,8: **0,144 × 0,083** — der Avatar ist
   0,075 breit. In der HÖHE blieben ±0,041 für einen 0,075 breiten Körper: man musste einen
   Schlitz treffen, der schmaler ist als das eigene Fahrzeug. Ein RELATIVER Faktor kann das nicht
   heilen — er skaliert das 1,74:1-Format mit und bleibt in der Höhe immer knapp. Deshalb
   `passPad`, ein ABSOLUTER Zuschlag von 0,038 (halbe Avatarbreite): *berührt mein Körper die
   Karte, ist es ein Treffer.* Jetzt **0,220 × 0,159**.

[BEWEIS] Ein Durchflug erzwungen und gezählt: **6 Kartenmeshes im Kartenraum vor dem Treffer,
5 danach, 1 im Flug** — die Summe bleibt 6, es gibt zu keinem Zeitpunkt zwei Karten für ein
Ereignis. Übergabeobjekt vorhanden, `release()` vorhanden, 0 Fehler.

**Würfel, dieselbe Runde — und hier lag DERSELBE Fehler ein zweites Mal.**
Georg: „die Würfel sind zu groß und wirken wie dunkle Gebäude · Würfelaugen sehe ich nicht ·
die Würfel sollen auch animiert in der Luft floaten, hatte ich gesagt…?"
- **Zwei Anker-Systeme für dieselbe Sache:** der Runner hielt einen `wuerfelAnker` für das ganze
  Trio, `sky-dice` verteilte darin. Deshalb sprang das Trio gemeinsam an eine neue Stelle und
  kein Würfel schwebte. Jetzt besitzt `sky-dice` die Platzierung JE WüRFEL (Weltort im
  Tangentialrahmen, Höhenband über GRUND, Neusetzen nur wenn hinter dem Spieler) — dieselbe
  Rechnung wie `sky-cards.place`, damit es nicht zwei Platzierungslogiken gibt.
  Der Runner gibt nur noch den lebenden Rahmen. `world: false` ist der Rückweg auf die v17-Sitze.
- **Schweben:** Bob längs der Standortnormale (0,014 / 0,21 Hz) plus seitliches Wandern in der
  Tangentialebene (0,010 / 0,13 Hz), inkommensurable Frequenzen.
- **„Dunkle Gebäude" war messbar:** Kanon-Farben L **0,15** (blau), 0,27 (rot), 0,35 (gelb) —
  genau der Fall, für den in S3i schon eine Regel steht. Jetzt wird nur die HELLIGKEIT auf
  `bodyLift` 0,50 gezogen, Hue und Sättigung bleiben Kanon (`bodyLift: 0` = reiner Kanon).
- **Die Augen SIND ein eigenes Mesh** (GLB `Dice-Mesh_1`), aber in #0d0b10 = **L 0,00** auf einem
  Körper von L 0,15. Schwarz auf Dunkel bei 0,07 Weltmaß ist kein Auge. Jetzt Papiercreme
  (#f2e8d0, L 0,76, leichte Eigenglut) — dieselbe Farbwelt wie die Karten.
- **Größe 0,11 → 0,07** (die Karte ist 0,08 breit; ein KÖRPER liest größer als eine Platte).
  Die Großzügigkeit trägt `pickupRadius`, nicht die Silhouette.

[BEWEIS] Würfel eingeschaltet und 0,9 s gemessen: Körper L 0,50 / Augen L 0,76 mit Glut 0,5 ·
Abstand vom Weltnullpunkt 5,045…5,195 (Globus-Radius 5, also über dem Gelände verankert) ·
**Kamera 0,809 u bewegt, Würfel 0,018…0,026 u** — sie schweben am Ort statt mitzufliegen.

### Was in S7 noch offen ist (die SHOW, und genau dafür braucht es Georgs Urteil)
Diese Runde hat die Mechanik geradegezogen — sie macht das Treffen richtig, nicht spaßig.
Offen und ausdrücklich zu entscheiden, bevor ich baue:
- **Hitstop** (0,06–0,08 s auf 25 % Zeit) — der billigste Spaß-Hebel, aber er greift in dt ein.
- **VFX-Vokabular am Einschlag:** Tuschering (EIN kameragewandtes Quad), Streifen-Burst,
  Papierschnipsel, Bildrand-Tönung in der Würfelfarbe, FOV-Kick. Nicht alles — zwei davon.
- **Fächer:** Georg „ungestaltet, die überlappenden schwarzen Outlines sind vielleicht nicht die
  beste Idee" — stimmt: gestapelte Tuschekanten summieren sich zu Matsch. Kandidat: Papierkante
  hell + EIN Schlagschatten, Aufnahme als Einschub aus der Ankunftsrichtung mit Überschwinger.
- **Würfel-Payload:** was fliegt zum Pop Score — die Augenzahl als 3D-Ziffer, der Würfel selbst,
  oder nur ein Burst? Und zerplatzt der Würfel?
- **Klang:** der Einschlag ist heute `sfx('card')` + `sfx('boost')` aus dem Synth. „Kein Spaß"
  ist zur Hälfte ein Klangproblem — das ist der Moment, S5 (echte Dateien) vorzuziehen.

### S7b · Kollisionsklassen — Georgs Antwort, in Code (29.8.)

Georgs Regel, wörtlich: *„bäume werden durchflogen · gebäude und große landmarken werden umflogen
· würfel und karten sind kollisions- und pickup-ziele · die wegweiser mit karten könnten bei
kontakt mit rotation um die pfahl-achse und/oder cartoon-deformer reagieren"* — damit ist
Befund 8 (offen seit v3) entschieden.

**Das ist eine Klassenfrage, keine Physikfrage.** Deshalb steht in `landmark-collide.js` kein
Collider, keine Broadphase, kein Solver: eine Liste mit ≤ 30 Orten und drei Klassen.
- `through` — die Streuung (Bäume, Bücher, Fässer) steht **gar nicht in der Liste**. Nichts tun
  ist die Umsetzung; wer nicht gefragt wird, kostet nichts. 382 Exemplare, 0 Rechenzeit.
- `around` — 16 Gebäude/Landmarken: eine **weiche Wand**. Sie dreht den Kurs weg und bremst auf
  72 % — sie stoppt nicht. Ein harter Stopp auf einem fliegenden Teppich liest als Fehler, ein
  Ausweichen liest als Fliegen.
- `react` — 10 Karten-Wegweiser: sie lassen durch und REAGIEREN. `card-towers.hit()` gibt eine
  Drehung um die **Pfahl-Achse** (gedämpft, 7 rad/s, läuft in 1,1 s aus), dazu Wackeln und
  volumenerhaltendes Squash entlang des Pfahls — dieselbe Sprache wie `pet-kinetics`.
  `q0` (die Ruhelage) wird mitgeführt: wer jedes Bild auf die AKTUELLE Quaternion multipliziert,
  integriert den Fehler mit und der Turm kommt nie zurück.

⚠ **Kein zweiter Schreiber auf den Kurs — und kein Schreiber auf den KURS überhaupt.**
Georgs zweiter Befund dazu: *„es scheint bei Kollision so, als würde die Flugrichtung geändert…?
statt das Objekt mit sauberer Flug-Animation (banking etc) elegant daran vorbeizuführen — ohne
den Kurs zu ändern!"* Er hat genau die Bauform erkannt: meine erste Fassung gab eine **Drehrate**
heraus, und eine Drehrate INTEGRIERT sich in `heading`. Nach dem Vorbeiflug stand der Kurs schief
— das Ausweichen hatte den Reiseweg umgeschrieben.
Jetzt liefert das Modul einen **Winkelversatz gegen den gemerkten Kurs** (0 wenn frei), und der
Runner fährt einen Servo darauf: Ziel ist „Kurs + Versatz", und weil der Versatz beim Verlassen
auf 0 zurückgeht, führt **derselbe Servo auf den alten Kurs zurück**. Netto-Kursänderung nach
dem Manöver: null, ohne Buchhaltung. Sobald der Mensch lenkt, gehört der Kurs ihm (die Erinnerung
folgt mit, damit der Servo hinterher nichts „zurückzuholen" hat).
Die **Schräglage kommt gratis**: `carpet.js` bankt aus `turnInputSmoothed`, also bankt ein weiches
Hin-und-Zurück von selbst in beide Richtungen — das ist die „saubere Flug-Animation", und sie
musste nicht gebaut werden. Die Bremse steht auf **0** (gefragt war Eleganz, nicht Stau).
`carpet.update` bleibt der einzige Ort, an dem `heading` geschrieben wird; statt einer zweiten
Konstante 0,78 im Runner hat `carpet` einen `maxSpeed`-Getter.
Die Abfrage läuft VOR `carpet.update` und liest deshalb Rahmen und Ort des VORIGEN Bildes —
4,7 Tausendstel Weltmaß Versatz bei 60 fps, notiert und unsichtbar.

**Würfel-FX, geschenkt** (Georg: *„obwohl dieser Effekt nett wäre als dice-FX"*): der rote Würfel
wirft jetzt einen **Schlenker** in denselben Servo — Richtung aus der Augenzahl, Betrag mit ihr,
Ausklang 1,25 s. Weil der Servo zurückführt, ist es ein Effekt, der den Reiseweg nicht
umschreibt: exakt der Unterschied, den Georg an der Kollision benannt hat, hier als Absicht.

[BEWEIS] Ausweichkurve an einer Testzone abgetastet (Grenze 0,380 u):
**0° · 1,4° · 7,1° · 14,8° · 23,8°** von außen nach innen, links und rechts vorzeichenverkehrt und
betragsgleich, außerhalb exakt 0 (`pen²` — linear fühlt sich an der Grenze wie ein Ruck an).
16 Hindernisse · 10 Wegweiser · Kontakt mit einem Wegweiser löst genau EINE Reaktion aus
(Hysterese: Freigabe erst bei 1,25× Grenze). 0 Fehler.
⚠ Ehrlich: welches VORZEICHEN „weg vom Hindernis" ist, kann ich nicht ohne Flug beweisen — die
Herleitung steht im Modulkopf (`links = up × fwd`, `A` gibt PLUS turnRate und A ist links), aber
daneben liegt ein Knopf **„Flip avoid direction"**. Ein Knopf ist schneller als eine Diskussion.

**Offen, von Georg selbst aufgeworfen:** *„die Wegweiser … auch wenn ich da an 3D-Türme und nicht
Wegweiser-Schilder dachte, die es momentan sind…?"* — stimmt: 2–4 Blätter à 0,115 Breite lesen aus
der Ferne als Schild, nicht als Kartenhaus. Zwei Wege, und es ist eine Entscheidung, keine
Technik: (a) sie BLEIBEN Wegweiser — dann bekommen sie einen sichtbaren Pfahl, und der Name
„Turm" fällt; (b) sie werden echte Türme — mehr Etagen, größere Blattbreite, deutliche Neigung.
Die Reaktionsdrehung um die Pfahl-Achse funktioniert in beiden Fällen.

### S7e/f/g · Die Kollision als EREIGNIS — dritte Runde (29.8.)

Georgs Bündel, und jeder Punkt hatte eine eigene Ursache:

**1. „ich sehe gerade keine würfel · zwischendurch sahen sie richtig cool aus!"**
Sie standen auf `visible: false` und mussten mit **K** geholt werden. Ein Pickup, das man
einschalten muss, ist kein Pickup. Jetzt sind sie Teil der Welt (`?dice=0` schaltet aus).

**2. „die krone sollte aus"** — raus statt umgefärbt. Ein Modell, dessen Material nicht trägt,
wird nicht nachlackiert, es wird abgewählt (840 Dreiecke war es auch der teuerste Posten der
Gruppe). Das Katalog-Zitat bleibt stehen, damit klar ist, dass wir das Asset kennen.

**3. „karten sollten nie mit text angezeigt werden, platzhalter ist immer die KFB card backside"**
Hier stand ein gemalter Textsteckbrief, und der Dateikopf nannte ihn „Ladezustand und Fallback,
nie ein leeres Blatt". Das war die **richtige Regel mit dem falschen Blatt**: die Antwort auf
„nie leer" ist die Rückseite, nicht Typografie. Eine Karte, die ihren Titel zeigt, bevor man sie
gesammelt hat, verschenkt genau das Ereignis, um das es geht.
Jetzt: `KayfaBizarro_Card_Backside_01_lowrez.png` (RAW), EINMAL geladen, von allen Karten geteilt —
dieselbe Datei, die `card-carrier.js` für die Flugkarte des Pets nimmt. Deckend ins Blatt gelegt
(`cover`, mittig beschnitten), auf DIESELBE gejitterte Kontur geclippt wie das Artwork, damit die
Kante beim Aufdecken nicht springt. Bis das Bild da ist: Papier + Tuschekante, **kein Wort**.

**4. „die karten-sammel-animation ist immer noch lazy & unschön"** (dritte Nennung).
Die Vorfassungen haben jedes Mal ein MECHANISCHES Problem behoben (zwei Meshes → eines; Start am
Pet → Start am Treffer; Weltachsen-Taumeln → lesbare Ebene) und **die Bewegung selbst nie
entworfen**. Deshalb blieb sie lazy: sie war korrekt und hatte nichts zu sagen. Das ist eine eigene
Fehlerklasse — siehe 16.
Jetzt drei Schläge: **Einschlag** (0,09 s, sie steht und quittiert) → **Vorzeigen** (0,32 s + 0,16 s
Halt: GROSS und plan vor die Kamera) → **Einstecken** (0,30 s, Ausfallschritt nach oben, dann
zügig in den Stapel). Der mittlere Schlag ist der, der fehlte: *man sammelt eine Karte, um sie zu
SEHEN.* Vorher flog sie direkt und schrumpfend in die Ecke — das liest als Wegräumen, nicht als
Beute. Gesamtdauer 0,87 s, im Panel als `Collect beat` ablesbar.

**5. „der kartenfächer sieht ungestaltet aus, die überlappenden schwarzen outlines sind da
vielleicht nicht die beste idee?"** — stimmt, und der Grund ist rechenbar: 1,5 px Tusche auf 56 px
Blatt, sechs gestapelte Blätter → **12 Kanten in 8 px** übereinander. Das summiert sich zu einem
schwarzen Klumpen. Jetzt helle Papierkante (das Blatt endet, wo das Papier aufhört) plus EIN
weicher Schlagschatten als Trenner — Schatten überlagern sich weich, Striche nicht. Tiefere
Blätter werden abgedunkelt statt transparent (Transparenz ließ den Hintergrund durchscheinen, der
Stapel sah löchrig aus statt tief). Aufnahme: das Blatt kommt aus der Ankunftsrichtung der
3D-Karte herein und schwingt über, der Stapel zuckt kurz zusammen — die Fortsetzung des
Einsteckens, nicht ein zweites Ereignis.

**6. „die würfel sollten bei kontakt mit cartoon deformer senkrecht in die luft springen, mit
transition rotieren kurz floaten, und dann wieder auf den boden bouncen (hartgummi-würfel)"**
Vorher stand an dieser Stelle `visible = false` — **der Treffer löschte sein eigenes Ereignis.**
Jetzt ein Wurf: Startgeschwindigkeit rein längs der Standortnormale (SENKRECHT ist der Kern der
Anweisung — ein Wegfliegen in Flugrichtung ist nach einem halben Bild aus dem Blick, nach oben
bleibt der Würfel im Bild, während man weiterfliegt), Zusatzdrall der mit dem Wurf ausläuft,
**Float im Scheitel als gedämpfte Schwerkraft** (ein Faktor auf g, keine zweite Phase — deshalb
bleibt der Bogen stetig statt zu stocken), dann Bounce mit Restitution 0,52 über drei Aufschläge.
Der Boden liegt UNTER der Ruhelage: der Würfel schwebt auf Flughöhe und fällt durch sie hindurch
bis aufs Gelände. Ballistik als EINE Zahl je Bild (Höhe über der Ruhelage), weil der Wurf
eindimensional ist — Vektorphysik wäre Aufwand ohne Bild.
Der **Cartoon-Deformer**: Streckung nach GESCHWINDIGKEIT, Quetschung nach AUFPRALL, beides
volumenerhaltend (quer 1/√s — ohne das wird der Würfel im Wurf größer, und genau daran erkennt
man einen billigen Deformer). ⚠ Die Achse muss die Standortnormale sein, nicht die lokale Y der
Gruppe; deshalb wird `grp` während des Wurfs auf die Normale gedreht und der Drall bleibt auf
`spinner`.

**7. „beim bouncen der dice wären kleine steinchen/partikel am impact-ort gut (ebenso wie bei
flug-boden-kontakt), die der jeweiligen impact-physik/kinetik dezent, aber wirkungsvoll animiert
folgen"** — die Spezifikation steht in seinem Nebensatz: *die Partikel folgen der jeweiligen
Kinetik.* Ein System, das immer denselben Puff macht, ist Deko; eines, das die Geschwindigkeit des
Verursachers erbt, ist Physik-Sprache. Also nimmt `impact-dust.burst()` die Impuls-Geschwindigkeit
als Argument und zerlegt sie in senkrecht und waagerecht — daraus wird **ohne zweiten Codepfad**
einmal ein Spritzen (Würfel, senkrechter Aufprall) und einmal eine Schleppe (Teppich, Streifschlag:
die Steinchen ziehen nach hinten statt nach oben zu stauben).
EIN gepooltes `Points`-Objekt, 160 Partikel, **ein Draw-Call**, keine Allokation im Bild; eigener
Mini-Shader, weil `PointsMaterial` keine Größe je Partikel kann. Schwerkraft entgegen der
Standortnormale, die jedes Steinchen mitträgt — auf einer Kugel gibt es kein globales Unten.
Ausklang durch Schrumpfen, nicht Alpha: bei 11 Tausendstel Weltmaß liest Schrumpfen als Wegrollen,
Ausblenden als Fehler. Der Boden-Kontakt ist über die ZEIT gedrosselt, nicht je Bild — sonst
hängt die Dichte an der Bildrate.

**8. „man fliegt extrem lange über ‘leere’ Wasserflächen im default Pfad"**
Keine Terrain-Frage, sondern Geometrie: bei 46 % Landanteil verbringt ein Großkreis über die halbe
Zeit auf Wasser, und Ozeane sind zusammenhängend. Mehr Land würde die Welt ändern.
Also lernt der Autopilot **die Küste zu suchen**: sieben Richtungen voraus abtasten (fünf
Stützpunkte je Richtung, bis ≈ 4 Weltmaß weit), die mit dem meisten Land nehmen, und den
Unterschied als Winkelversatz in **denselben Servo** geben, der schon Ausweichen und
Würfel-Schlenker führt. Weiter genau ein Kursbesitzer — und weil der Versatz auf 0 fällt, sobald
Land unter uns ist, führt der Servo von selbst auf den Reisekurs zurück. Greift erst nach 2,5 s
Wasser (eine kurze Bucht ist Abwechslung, kein Problem) und wird bis 12 s entschlossener.
Gedrosselt auf 0,4 s — sieben Feldabfragen sind zu teuer für jedes Bild und gratis alle 0,4 s.
Im Panel als `Coast seeking` ablesbar. Nur ohne Lenkeingabe: der Mensch besitzt den Kurs.

**9. Nachtrag zu 6 (die Abnahme hat es gefunden): die Würfel lesen das REINE Gelände.**
Sie hatten `bodenMitBauten` geerbt — dieselbe Höhenfunktion wie die Karten. Damit säße ein Würfel
über einem Schloss (0,22 hoch) bei bis zu 0,30 über Grund und wäre bei 0,12 Flughöhe
**unerreichbar**. Das ist eine Entscheidung, kein Standard: *eine Karte darf über einem Dach
hängen — man sieht sie. Ein Würfel muss treffbar sein.* Zwei Ansprüche, zwei Antworten, aber je
Anspruch genau EINE Höhenfunktion. Statt über den Bauten zu schweben, meiden die Würfel sie
**seitlich** (`setKeepOut`, sechs Versuche, dann erzwungen — ein Würfel fällt nie aus).

### S3e · Landmarken-Nachbarschaft — nicht zweimal dasselbe Wahrzeichen (29.8.)

Georg: *„es sollte auch nicht zweimal ein dominantes gebäude wie die türme/castle direkt in
nachbarschaft platziert werden"*, präzisiert: *„also nicht zweimal das castle"*.
Der Grund ist nicht Geschmack, sondern die AUFGABE: Landmarken sollen Orientierung geben — zwei
gleiche Schlösser nebeneinander löschen genau die Information, die eine Landmarke ist.
*Wo bin ich? An einem Schloss. An welchem?*

Gebaut in `assignMarken` als **Ablehnung, nicht als neue Verteilung**: die gewichtete Auswahl
(`waehlen` — die Mechanik der Quelle) bleibt Eigentümer der Wahl. Zwei Sperren, verschieden weit:
dasselbe Modell weit, ein anderes dominantes Modell eng (Schloss neben Zauberturm ist ein lesbarer
Ort; nur direkt aneinandergerückt wird es ein Klumpen). Wer abgelehnt wird, probiert erst ein
ANDERES dominantes Modell (Vielfalt vor Verzicht), dann die leisen. Eine Zuweisung fällt nie aus.
Gemessen wird als **Winkel zwischen den Standortnormalen** — auf einer Kugel ist der Bogen die
einzige ehrliche Entfernung —, und die Sperren sind Vielfache des GITTER-Nachbarbogens, sonst wäre
die Regel auf einer dichten Welt zu streng und auf einer leeren wirkungslos.

⚠ **Erste Fassung war Übererfüllung, gemessen und verworfen.** Mit 2,6 / 1,3 Nachbarbögen
(= 104° / 52°) blieben auf sechs geprüften Welten nur **3–4 dominante Bauten**, 11–15 von 26
Standorten wurden verdrängt, und die Verteilung kippte auf 10–14 Mühlen plus 8–12 Märkte — eine
Welt ohne Wahrzeichen. Bei 26 Punkten ist der Nachbarbogen rund 40°; ein Sperrbogen von 104° ist
keine „Nachbarschaft", das ist ein Kontinent. Georg hat *direkt in Nachbarschaft* gesagt, nicht
*höchstens ein Castle pro Welt*. Jetzt 1,35 / 0,75 (= 54° / 30°).

[BEWEIS] Sechs Welten: **6–7 dominante Bauten** (vorher 3–4), alle fünf Modelle in jeder Welt
vertreten, **0 Paare gleicher dominanter Modelle innerhalb der Sperre**, engster gemessener
Abstand zweier gleicher Wahrzeichen **57°–71°**. Reproduzierbar: der Ausweichwurf ist aus
`site.pick` abgeleitet, kein `Math.random` in der Weltgenerierung (Regel aus S3a).
Dazu in derselben Runde: **Fässer** von Wahrzeichen- auf Buschgröße (Georg: „viel zu groß") und
die **Krone** auf Gold statt der blassen Modellfarbe („sieht gräulich aus").

### S7c · Messen ohne Konsole (29.8.)
Georg: *„ich kann da nix messen, wenn es da um konsolen-dinge geht — oder nur mit KISS
anleitung…?"* Richtig, und das war ein Konstruktionsfehler bei mir: ich habe mit Zahlen
argumentiert, die nur ich sehen kann.

Alle Zahlen, mit denen ich argumentiere, stehen jetzt **im Panel unter „Diagnostics"**:
`Cards: one mesh?` (Karten in der Welt · im Flug · genommen/angekommen — die Summe muss konstant
bleiben, DAS ist der Übergabe-Beweis) · `Cards: hit window` (Fenster in Weltmaß gegen 0,075
Avatar) · `Fly-around` (Hindernisse, Wegweiser, ob man drin ist, Kurszuschlag) · `Dice`.
Dazu ein Knopf **„Copy diagnostics"**: Seed, Welt, Biom-Report, fps, Draw-Calls,
Karten, Flug, Kollision, Würfel, Türme, Props als ein Textblock. Aufklappen, Knopf, einfügen —
damit kann ein Befund im Chat eine MESSUNG sein statt einer Beschreibung.

⚠ **Der Knopf funktionierte im ersten Anlauf nicht** (Georg, 29.8.) — und im ZWEITEN auch nicht,
aus einem zweiten, tieferliegenden Grund. Beide sind aufgeschrieben, weil beide Klassen sind:

1. **Berechtigung.** `navigator.clipboard.writeText` braucht einen sicheren Kontext UND
   `allow="clipboard-write"`, die eine eingebettete Seite oft nicht hat. Mein Fehlerpfad schrieb
   den Text dann **in die Konsole** — also genau dorthin, wo Georg nach eigener Aussage nicht
   hinkommt. Ein Ausweg, der die Beschränkung ignoriert, die ihn nötig gemacht hat, ist keiner.
   Jetzt erscheint der Text als **Blatt auf dem Schirm, vorausgewählt**: ⌘C/Strg+C ist immer der
   Rettungsweg. `execCommand('copy')` und die moderne API laufen als Zugabe und melden ihr
   Ergebnis in der Fußzeile des Blattes.
2. **Eine gemerkte DOM-Referenz ist eine KOPIE der Wahrheit** — und die DC-Vorlage ERSETZT
   `#tv-stage`. Gemessen (von der Abnahme, nicht von mir): `document.contains(stage) === false`,
   `stage !== document.getElementById('tv-stage')`, das Blatt hing am abgetrennten Knoten.
   `appendChild` gelingt dabei, wirft nichts, und nichts ist zu sehen. Canvas, Marke, Panel, HUD
   und die Detailansicht überlebten nur, weil sie im 500-ms-Wiedereinhänger stehen — mein neues
   Blatt stand nicht drin. **Behoben nicht durch einen sechsten Sonderfall, sondern durch EINEN
   Eigentümer der Frage „welches Element ist die Bühne JETZT":** `buehne()` löst den Knoten zum
   Zeitpunkt des Gebrauchs auf, alle sieben Direktzugriffe auf `getElementById('tv-stage')` sind
   ersetzt, jedes `appendChild` und auch `resize()` gehen darüber, und `#kfb-bericht` steht im
   Wiedereinhänger. (`resize()` las bis dahin `clientWidth` von der Leiche — gemeldet 0, gedeckt
   nur vom `|| innerWidth`-Fallback. Niemand hat es gemerkt, weil der Notnagel gut war.)

[BEWEIS] Knopf gedrückt: Blatt im Dokument, **Elternknoten IST die lebende Bühne**, 10 Zeilen,
**1012 Zeichen ausgewählt**, `elementFromPoint` trifft das Textfeld, Canvas weiter da. 0 Fehler.

3. **Der Wiedereinhänger selbst war nicht ablesbar — und tat nachweislich nichts.** Die Abnahme
   hat gemessen: Canvas entfernt → nach 3000 ms weiter `isConnected === false`; `#kfb-ui`
   entfernt → nach 2500 ms weiter weg; ein eigener Kontrolltimer tickte in derselben Zeit 2×.
   `#kfb-hud` kam zurück, aber über den EIGENEN Intervall von `collect-hud.js` — was meine
   frühere Messung „Blatt wieder da" wie einen Beweis aussehen ließ. War keiner.
   **Die eigentliche Lehre ist nicht der Fehler, sondern die Unlesbarkeit:** ein Mechanismus,
   dessen Leben man nicht ablesen kann, ist eine Behauptung. Und ein Fehler in einem
   `setInterval`-Rückruf beendet still den ganzen Tick — in der alten Fassung hätte EINE werfende
   Pflicht alle folgenden mitgenommen, ohne Konsolenmeldung.
   Umgebaut: `wiederEinhaengen()` ist eine benannte Funktion, läuft einmal SOFORT und dann alle
   500 ms, und **jede Pflicht steht in ihrem eigenen `try`** (canvas · badge · meta · ui · hud ·
   look · bericht). Tickzähler, Fehlerzahl und letzte Fehlermeldung stehen im Panel
   (`Re-attach watchdog`) und im Diagnose-Blatt.
   Dazu behoben: `metaSetzen` prüfte `m.children.length` — also „irgendwas steht drin". Stand dort
   etwas FREMDES, schrieb die Funktion nie wieder und die Tastenlegende blieb für immer weg.
   Jetzt erkennt sie ihr EIGENES Kind (`.t[data-kfb="meta"]`) und schreibt sonst neu.
   [BEWEIS] Canvas und `#kfb-ui` von Hand entfernt: nach 2,6 s **beide wieder da, Elternknoten
   `tv-stage`**, Watchdog 7 → 8 Ticks (verdeckte Seite, Timer auf ~1/s gedrosselt), 0 Fehler.
   ⚠ Ehrlich: **warum die alte Fassung nicht tickte, kann ich nicht mehr beweisen** — genau das
   ist der Punkt. Es gab keine Zahl, an der man es gesehen hätte. Jetzt gibt es eine.

⚠ **Und ein Eigenfehler in derselben Reparatur, gemessen statt behauptet:** der pauschale
Textersatz `getElementById('tv-stage')` → `buehne()` hat auch den KÖRPER der neuen Funktion
getroffen — `function buehne() { return buehne(); }`, Endlosrekursion, kein Start.
Lehre: **ein globaler Ersatz muss die Definition ausnehmen, die er selbst erzeugt.** Gefunden in
einem Bild, weil nach dem Ersatz eine Messung lief und nicht eine Behauptung.

**Nachtrag S7 (Abnahme fand zwei eigene Fehler, beide in derselben Runde entstanden):**
1. **Der Zuschlag hatte keinen Regler, und ein Regler trug jetzt einen falschen Namen.** Der
   `passRadius`-Schieber hieß „Cards: hit window" und zeigte „1,8×" — das beschreibt das Fenster
   nicht mehr, seit `passPad` dazukommt; und `passPad`, die eigentliche Reparatur, war aus der UI
   gar nicht erreichbar. Ausgerechnet in der Runde, in der Georg gesagt hat, dass er ohne Konsole
   messen will. Jetzt zwei Schieber (`· scale`, `· body pad`), beide mit dem RESULTIERENDEN Fenster
   in Weltmaß als Anzeige, und die Diagnose-Zeile heißt `(measured)`.
2. **Das Würfel-Fenster schrumpfte um 36 % — in der Runde, deren Thema „Treffer werden zu oft
   verpasst" war.** `impactAt` rechnet `size × pickupRadius`; die Größe fiel 0,11 → 0,07, also das
   Fenster **0,198 → 0,126**. Meine Notiz „die Großzügigkeit trägt pickupRadius, nicht die
   Silhouette" stand im Kopf der Datei — aber nicht im Code. Derselbe absolute Zuschlag wie bei
   den Karten.
   Lehre, und sie ist die kleine Schwester von Fehlerklasse 9: **wer eine Größe ändert, muss jede
   Schwelle nachrechnen, die relativ auf ihr sitzt** — auch die eigene, drei Zeilen tiefer.
   ⚠ **Und genau das ist eine Runde später wieder passiert:** Größe 0,07 → 0,05 machte das Fenster
   0,164 → 0,128 — in DERSELBEN Runde, in der die Lehre oben schon im Dokument stand. Eine
   aufgeschriebene Regel ist keine Sicherung. Die Sicherung ist, den Zuschlag von der Größe
   ABZUKOPPELN: `pickupPad` trägt jetzt die ganze Großzügigkeit (0,075 = eine volle Avatarbreite,
   nicht mehr die halbe), Fenster bei size 0,05 = **0,165** — und bleibt das, wie klein der Würfel
   auch noch wird. *Die Silhouette darf schrumpfen, die Reichweite nicht.*
   Verallgemeinert: **wer eine Größe zweimal hintereinander vergisst, hat kein Gedächtnisproblem,
   sondern eine falsche Kopplung.** Nicht nachrechnen — entkoppeln.

### S6e · Farbsemantik der Würfel (29.8., KISS)

Georgs Regel: die FARBE ist der Modifier, die Augenzahl der Betrag — rot = schlecht,
gelb = visuell/FX, blau = gut. Jede Farbe schaltet EINEN vorhandenen Regler kurz um, kein neues
Effektsystem:
- **rot** → Bremse (bis −0,22 Tempo) plus Kamera-Trauma. ⚠ `rig.setTrauma` zählt sich NICHT
  selbst herunter (der Rig hat den Wert seit v1, niemand hat ihn je gesetzt) — der Runner fährt
  ihn über 0,9 s zurück, sonst zittert die Kamera für immer.
- **gelb** → langer FX-Nachhall (Tempostreifen + Radial-Blur), sonst nichts.
- **blau** → Tempo-Schub, skaliert mit der Augenzahl, plus `sfx('boost')`.

[BEWEIS] Alle drei Würfel einmal getroffen: `rot:2 · gelb:2 · blau:2`, 0 Fehler.
Offen bleibt der drehbare UI-Würfel in Pet-Grundfarbe (bisher eine Zahl) und die Frage, ob rote
Würfel überhaupt gewollt sind, wenn man sie nicht ausweichen kann — das ist eine Spielfrage,
keine Technik.

### Was von S3d noch offen ist
- **Karten-Türme** auf den Bauplätzen aus S3a (Kleinzeug bleibt Cut-out) — die Sky-Cards liefern
  das Cut-out-Verhalten bereits, der Turm ist eigene Geometrie.
- **Fächer, Zähler-Anzeige und Pop Score** (S6b/S6d): der Zähler steht im Panel, aber noch nicht
  als Kartenfächer unten rechts.
- **Landmarken-Namen** aus `Landmarks.ts` (Name + enterDot/exitDot) — der Überflug soll sagen,
  wo man ist.
### Der Plan für S3d, in der Reihenfolge
1. **Naht 2**: Ring in der Ebene → tangentialer Ring um den Standort. Danach `formatReport()`
   und ein Durchflug als Beweis.
2. **Deck je Weltseed**: `card-registry.pool()` liefert den Pool, der Seed zieht EIN Deck;
   `requestArt(card, cb)` liefert das Artwork nachträglich, bis dahin steht die Textfassung.
3. **Cut-outs** = Sky-Cards mit kleinem Radius am Boden (Kleinzeug), **Türme** = gestapelte
   Kartenkörper auf den Bauplätzen aus S3a (eigene Primitive, eigene UVs, Verbieger-Atem).
4. **Ein System, keine zwei**: der Durchflug einer Landmarke ist der Sammelvorgang (`onPass`).
   Damit fällt S6a mit S3d zusammen.

**Später, notiert:** Triplanar-Collage über `pet-surface.v1.js` auf den atlaslosen Kenney-Modellen
(braucht keine UVs — genau dafür wurde es gebaut) und der Pixelbäcker für gebackene Pop-up-Sprites.
## 6g · Arbeitsregel: KISS, besonders bei UI-Gimmicks (Georg, 29.8.)

Wörtlich: „gerne immer KISS — vor allem für UI-Gimmicks."

Was das in diesem Projekt praktisch heißt, an den Beispielen dieser Nacht:
- **Ein Fächer aus fünf Papierstreifen ist eine CSS-Übung**, kein 3D-Aufbau. Als Meshes wären es
  fünf Texturen und ein zweiter Kamerabesitzer fürs Overlay.
- **Zwei Schleifen statt eines Systems.** Die schwebende Wortmarke sind zwei Keyframes mit
  ungleicher Dauer — kein Animationsmodul, keine Zeitleiste.
- **Nichts hinzufügen, was schon liegt.** Der Kamerastoß beim Sammeln ist `rig.shake` (seit v1
  vorhanden, nie benutzt); der Blur-Burst ist der vorhandene Radial-Blur mit einem Nachhall.
- **Effekt lieber weglassen als halb bauen.** Der Blob-Schatten steht auf AUS, bis die
  Eck-Artefakte gelöst sind; tinyskies hat auch keinen.
- **Kein Gimmick ohne Rückweg.** Jeder sichtbare Zusatz hat einen Regler oder Standard AUS
  (Tag-Nacht, Sky-Dice, ACES, Verbiegung, Atem, Schatten).

Gegenprobe vor dem Bauen: *Was liegt schon im Projekt, das das kann?* — und wenn nichts liegt:
*Was ist die kleinste Fassung, die man am Bild prüfen kann?*
## 7 · Fehlerklassen dieser Baureihe (Pflichtlektüre vor dem nächsten Slice)

1. **Zwei Verwalter derselben Sache.** Zwei Kartenmaler (Gutter + doppelte Outline), zwei
   Fade-Schreiber, zwei Pupillen-Besitzer, zwei Himmelsbesitzer. Immer EINEN Eigentümer benennen.
2. **Unvollständiger Zustand ist ein stiller NaN-Generator.** `carrier.sync` liest fünf Felder;
   fehlte eins, verschwanden Karte UND Pet lautlos.
3. **`let` unter der Funktion, die es liest** = temporal dead zone = Start bricht ab, kein
   Canvas. Aller Zustand, den die Marke oder das Panel liest, steht in EINEM Block oben.
4. **rAF tickt in verdeckten Seiten nicht.** Warten, Wiedereinhängen und Marke laufen über
   `setInterval`, das erste Bild wird synchron gezeichnet.
5. **Maßstab ist nicht Breite.** Ein Rig mit absoluten Konstanten skaliert man als GRUPPE.
6. **Ein Backtick in einem Template-Literal beendet die Datei.** Ein Kommentar mit
   Code-Anführungen im CSS-String hat das Panel-Modul getötet und damit den ganzen Runner.
7. **Eine Abwesenheit, die ein Werkzeug nicht sehen KANN, ist keine Abwesenheit.** Der
   Repo-Baum listet keine Binärdateien — das GEAR_ICON.glb war da, meine Suche nicht.
9. **Ein portierter Effekt kann in einer anderen Weltgröße stumm sein.** Die Tempostreifen
   rechnen mit einer absoluten Tempo-Schwelle (0,8) über unserem Maximum (0,78) — zwei Fassungen
   lang eingebaut und unsichtbar. Wer eine 1:1-Portierung übernimmt, prüft ihre SCHWELLEN gegen
   die eigenen Größen, nicht nur ihre Formeln.

8. **Wer eine Pose schreibt, muss sie gültig machen** (`updateWorldMatrix`), sonst rechnet der
   nächste Leser im Bild von vorgestern.

10. **Eine Kopie mit derselben Textur IST eine zweite Sache — auch wenn nur eine sichtbar ist.**
    (Georg, 29.8., über `card-flight`: „ZWEI Karten für die Animation EINER Karte".)
    Der Reflex „ich lasse die Quelle in Ruhe und baue daneben etwas Eigenes" fühlt sich wie
    Respekt vor dem Port an und ist Faulheit: er verdoppelt den Gegenstand statt den BESITZER zu
    wechseln. Richtig ist die ÜbERGABE — ein Objekt, ein Zustand `flying`, ein `release()`.
    Verräterische Formulierung, an der man es erkennt: *„eigenes Modul, damit die Kopie ihren
    X behält"*. Und die Verschlimmerung: **diese Begründung stand im Dateikopf**, während
    Fehlerklasse 1 in diesem Dokument steht. Eine Begründung, die eine selbst aufgeschriebene
    Regel bricht, ist keine Entscheidung, sondern eine Ausrede.
    Gegenprobe vor jedem „ich baue das daneben": *Wie viele Exemplare der Sache existieren
    danach?* Ist die Antwort > 1, ist es der falsche Bau — auch wenn man Sichtbarkeit umschaltet.

11. **Eine gemerkte DOM-Referenz ist eine Kopie der Wahrheit — und die Vorlage ersetzt Knoten.**
    `const stage = await warteAufBuehne()` sieht wie sorgfältige Arbeit aus und ist der stillste
    Fehler der Baureihe: `appendChild` auf einen abgetrennten Knoten **gelingt**, wirft nichts,
    und das Element ist nie zu sehen. Gemessen am Diagnose-Blatt: `document.contains(stage)`
    false, Eltern `X-DC`, Geschwister von vorgestern.
    Was NICHT hilft: für jede neue Schicht einen Sonderfall in den Wiedereinhänger schreiben —
    dann ist die Liste die Wahrheit und wer sie vergisst, verliert. Was hilft: EIN Eigentümer der
    Frage „welches Element ist X JETZT", zum Zeitpunkt des Gebrauchs aufgelöst.
    Verwandt, aber eigenständig: **ein globaler Textersatz muss die Definition ausnehmen, die er
    selbst erzeugt** — `function buehne() { return buehne(); }` war das Ergebnis einer Sekunde
    Unaufmerksamkeit und hätte den Start ohne Nachmessung mitgenommen.

12. **Ein Fehler in einem `setInterval`-Rückruf beendet still den ganzen Tick.** Wer mehrere
    Pflichten in einen Rückruf schreibt, hat sie in Reihe geschaltet: stirbt die erste, sterben
    alle — ohne Konsolenmeldung, weil der Tick einfach endet. Jede Pflicht in ihr eigenes `try`.
    Und die schwerere Hälfte davon: **ein Mechanismus, dessen Leben man nicht ablesen kann, ist
    eine Behauptung.** Der Wiedereinhänger stand seit v2 im Dokument als Lösung für Georgs
    „hellblauen Screen" — dass er nicht tickte, hat die Abnahme gefunden, nicht ich, und ich konnte
    es nicht widerlegen, weil es keine Zahl gab. Jeder unsichtbare Wächter braucht einen Zähler an
    einer Stelle, die der NUTZER sehen kann.

---

## 05o · Die Albedo-Abzweigung — „wo sind wir falsch abgebogen?"

Georg, 30.8., nach vier Befunden am fertigen Bild: *„irgendwie sind die terrains und farben jetzt
alle grau-bläulich verwaschen"* · *„würfel sind auch wieder falsch beleuchtet"* · *„bäume zu hell"*
— und dann die Frage, die die Antwort erzwang: **„wie ist das denn bei tinyskies? wir hatten das
doch alles schon sauber?! wo sind wir falsch abgebogen? dahin müssen wir zurück!"**

### Drei Beschwerden, eine Zahl

Alles im selben Bild gemessen, Albedo in LINEARER Luminanz (dort multipliziert die Beleuchtung):

| | vorher | tinyskies | nachher |
|---|---|---|---|
| Wasser (Median) | **0,005** | 0,111 (`0x1560a0`) | **0,111** |
| Land (Median) | **0,085** | 0,215 (`0x4a8f3f`) | **0,231** |
| Props / Bäume | 0,225 | — | 0,227 (unverändert) |
| Würfel, Creme | 0,811 | Schnee 0,802 | 0,811 (unverändert) |
| **Props zu Land** | **2,6×** | ≈ 1× | **0,65×** |

Bei Albedo 0,085 und einer Lichtsumme von 16,5 kommt die sichtbare Farbe einer Fläche fast
vollständig aus den LICHTERN und kaum aus dem Material. Unser Tag-Rig hat blaue Füller
(`fillColor 0x90bbcc`, quellentreu) — also war der Boden blaugrau, egal welche Farbe in der
Palette stand. **Und alles, was auf diesem Boden STAND, war dadurch relativ zu hell.** „Bäume zu
hell" und „Würfel falsch beleuchtet" waren keine zwei weiteren Fehler, sondern zwei Blickwinkel
auf denselben. *Wer eine Beschwerde über ein Objekt hört, muss den Grund messen, auf dem es steht.*

### Abzweigung 1 · Das Instrument wurde ersetzt, die Werte nicht

Die Palette (`globe.js · LAND_HEX`) war gegen das **Luminanzband `BAND_LIN = [0.04, 0.33]`**
kalibriert — hergeleitet aus `(5,0 + 1,75 + 1,25)/π · Albedo < 1,0`, mit Sicherheitsabstand,
Zielwert „Albedo um 0,30".

Am **29.8. wurde genau dieses Band widerlegt** — von Georgs eigenen Screenshots: tinyskies' Gras
liegt über der Bandobergrenze und überstrahlt trotzdem nicht, weil ein GESÄTTIGTER Ton beim
Clippen Sättigung verliert, kein Weiß wird. Das Band wurde durch `SAT_KEEP` ersetzt, und
`light-budget.js` trägt die Begründung bis heute im Kopf: *„die alte Luminanzgrenze war doppelt
falsch: sie hat das Problem gelöst und dabei den halben Gestaltungsraum mitverboten."*

**Nur: die fünf Zahlen, die das Band erzwungen hatte, standen weiter da.** Ein Jahr Kommentar über
die Widerlegung, direkt über einer Palette, die noch der widerlegten Regel gehorchte.

> **Fehlerklasse (neu): eine Regel zurücknehmen und ihre Folgen stehen lassen.**
> Wenn ein Maß ersetzt wird, ist die Arbeit nicht fertig, bevor jeder Wert, der nach dem alten Maß
> gewählt wurde, neu entschieden ist. Sonst gilt die alte Regel weiter — nur unsichtbar, weil ihre
> Begründung gelöscht ist. Das ist schlimmer als die Regel selbst: die konnte man wenigstens lesen.

Der Rückbau ist **ein Faktor, 2,85**, auf alle fünf Bänder. Hue und Sättigung unangetastet
(H ±1°, S ±0,01), Bandstruktur unangetastet — eine Rücknahme, keine Neugestaltung:

| Band | war | ist | L(lin) |
|---|---|---|---|
| strand | `0x72612d` | `0xb89e4c` | 0,123 → 0,352 |
| ebene | `0x405336` | `0x698959` | 0,075 → 0,216 |
| hang | `0x4f4636` | `0x837459` | 0,063 → 0,180 |
| fels | `0x403d39` | `0x6b665f` | 0,047 → 0,135 |
| firn | `0x9b9a8d` | `0xdadad5` | 0,320 → 0,699 |

**Und hier die Bestätigung, dass es die richtige Abzweigung war:** `globe.js` führte die
Vor-Band-Werte als Rückweg mit — `ebene 0x6f8f5e`. Der Rückbau landet bei `0x698959`. Zwei
unabhängige Wege, dieselbe Farbe. *Wer einen Rückweg mitschreibt, kann eine Abzweigung beweisen
statt sie zu behaupten.*

### Abzweigung 2 · Der Ozean wurde einmal gefärbt und nie wieder

Alle drei Presets tragen `oceanShallow / oceanDeep / oceanFoam` — DAY `0x2a8ca0/0x1560a0`
(zeichengleich mit tinyskies), NIGHT `0x081838/0x040c20` (fast schwarz). Gelesen wurden sie
**genau einmal**: beim Bau der Welt, aus dem Preset der Startzeit. Die drei Schlüssel standen
nicht in der `COL`-Liste des Tag/Nacht-Zyklus.

Folge: **eine nachts geborene Welt behielt einen schwarzen Ozean durch den ganzen Tag** — Albedo
0,005 gegen tinyskies' 0,111, Faktor 22. Und es war unsichtbar, weil ein schwarzer Ozean aussieht
wie ein tiefer Ozean. Nur die Zahl konnte das aufdecken.

Die Quelle macht es anders **und sagt auch warum** (`Globe.ts`, Feldkommentar):
*„Per vertex: ocean mix 0–1, or -1 for land (for day/night ocean recolor without re-sampling
noise)"* — tinyskies hält die Wassertiefe je Vertex ausdrücklich vor, um beim Zeitwechsel
umfärben zu können. Wir halten dieselbe Tiefe als Attribut `oceanDepth` und haben sie nie
benutzt. Jetzt: `globe.setOceanColors()`, gerufen vom Zyklus, sobald sich die Farbe messbar
bewegt (Schwelle 0,012 linear — unter der 8-Bit-Sichtbarkeitsgrenze, also färbt es um, bevor ein
Sprung sichtbar wäre).

> **Fehlerklasse (Wiederholung, dritte Ausprägung):** ein Wert, der in einer Tabelle steht und von
> keinem Leser gelesen wird, ist kein Parameter, sondern Dekoration. Slice D hat 123 Parameter
> freigelegt und dabei GENAU DAS geprüft — „0 off source" — aber nur, ob Werte von der Quelle
> abweichen, nicht, ob sie jemand liest. **Eine Parameter-Abnahme muss die Leser zählen, nicht die
> Werte.**

### Die Abnahme, die das nächste Mal nein sagt

Neu im Panel, unter „Arrival & Time": **`Ocean follows preset`** vergleicht die Farbe, mit der das
Wasser ZULETZT GEFÄRBT wurde, mit dem, was das Preset JETZT sagt, und meldet `✗ DRIFT` samt
beiden Hexwerten und Δ. Gemessen nach dem Bau: `✓ painted #2a8ca0 · preset #2a8ca0 · Δ 0.000`.

Die Palette braucht keine neue Abnahme — `light-budget` misst sie schon, und die Zeile bestätigt
den Rückbau: `LAND sat-keep 0.939 ok (≥0.55) · albedo(lin) max 0.352 / med 0.236 · load 0.896`.
Load unter 1,0 heißt: es klippt nichts, obwohl das Land jetzt dreimal heller ist. **Genau das war
die Behauptung von `SAT_KEEP`, und sie hält.**

### Was NICHT angefasst wurde, und warum

- **Props (0,227) und Würfel-Creme (0,811) stehen unverändert.** Sie waren nie zu hell — der Grund
  war zu dunkel. Props liegen jetzt bei 0,65× ihres eigenen Bodens, die Würfel bei 3,5× statt
  9,5×. Ein Pickup DARF das hellste Ding im Bild sein; tinyskies' Schnee liegt bei 0,802.
- **Die Lichter sind quellentreu und bleiben es** (DAY: sun 5,0 · sun2 3,25 · hemi 1,75 · amb 1,25
  plus Füller — gegengelesen an `SkyPresets.ts` 63–71). Es war nie ein Beleuchtungsfehler.
- **Das Wasser-Maximum 0,584 (`load 1.487`)** ist der schaumgetönte Flachwassersaum und bleibt:
  tinyskies' `foamColor 0xb3ffff` ist genauso hell. Das Instrument weist es als
  „world-dependent, not a gate" aus — richtig so.

### Nachtrag, eine Stunde später · zwei weitere Befunde am Wasser — einer davon in der Reparatur selbst

Georg, am Bild: *„da ist immer noch etwas kaputt, die dunkelblauen Wellen etc → das sieht in
tinyskies deutlich anders und leider auch viel besser aus als bei uns!"*

**Befund A · Der Schaum war ZWEIMAL aufgetragen.** `globe.js` backte ihn mit 55 % in die
Vertexfarbe (`mix(c, foam, …)`) UND der Shader legte oben nochmal welchen drauf. Die Quelle tut
nur das Zweite: `Globe.ts` schreibt `color = oceanShallow.lerp(oceanDeep, depth)` und nichts
weiter. Sichtbar war das als **weißer Saum um jede Küste**, messbar als Wasser-Albedo max **0,584**
gegen tinyskies' 0,218 — es klippte. Der Bake ist weg; Wasser jetzt max **0,218**, genau der Wert
der Quelle, `load 0,555`.
Zwei Nebenschäden gingen mit demselben Strich: der Shader liest `shallowness` aus `vColor.r`, und
mit eingebackenem Schaum hielt er tiefes Wasser für flaches; und das Ozean-Tor
`vColor.b > vColor.r + vColor.g * 0.5` bestand nur noch knapp (1,0 gegen 0,93).
*Ein Effekt, der an zwei Stellen aufgetragen wird, ist nicht doppelt so schön, sondern an einer der
beiden Stellen falsch — und nur die Zahl sagt, an welcher.*

**Befund B · Der dunkelblaue Zickzack an der Küste war MEIN Fix, halb fertig.** Die Schaumfarbe hat
**zwei Verbraucher**: die Vertexfarben (gebacken) und das Shader-Uniform `foamColor` (Kontourlinien,
offener Schaum, Glitzern). Mein `setOceanColors()` von vorhin versorgte den ersten und übersah das
zweite. Das Uniform blieb auf der Startzeit stehen — bei einer nachts geborenen Welt `0x2050aa`,
Marineblau. Der Shader hat den ganzen Tag Schaum gezeichnet, nur in Nachtfarbe: **dunkle Zacken auf
hellem Wasser statt heller Gischt.**

> ⚠ **Und das ist derselbe Fehler, den dieser Abschnitt zwei Bildschirmseiten weiter oben als neue
> Fehlerklasse aufschreibt** („eine Regel zurücknehmen und ihre Folgen stehen lassen") — begangen
> in der Reparatur dieser Fehlerklasse, im Abstand von einer Stunde.
> **Eine Fehlerklasse aufzuschreiben schützt nicht davor, sie zu wiederholen. Nur ein Test tut das.**
> Die Abnahme `Ocean follows preset` prüfte anfangs auch nur EINEN der beiden Verbraucher und
> meldete grün, während das Bild kaputt war. Sie prüft jetzt beide, und den Schaum am **echten
> Uniform des Shaders**, nicht an unserer Notiz darüber: `✓ depth #2a8ca0/#2a8ca0 Δ0.000 · foam
> #b3ffff/#b3ffff Δ0.000`. *Ein Prüfstand, der die eigene Buchhaltung befragt, prüft nichts.*
>
> Die Regel daraus, allgemein: **wer eine Größe an eine Quelle hängt, muss ihre Verbraucher zählen.**
> Eine Farbe mit zwei Lesern ist halb versorgt kein halber Erfolg, sondern ein ganzer Fehler — und
> zwar ein besonders teurer, weil der versorgte Teil richtig aussieht und die Suche verzögert.

**Nicht behoben, weil schon bekannt:** der dunkle Keil im Land ist der Kartenschatten
(`card-shadow`, `seg: 8`, aufprojizierter Fleck mit harten Polygonkanten), nicht die Farbe. Das
ist Befund **R1** — die Quelle hat einen echten Shadow Map (`VSMShadowMap`, 96 Fundstellen),
unser Fleck ist ein Ersatz. Steht als Architekturfrage in §06b, nicht als Deckkraft.

### Für Slice H

H dreht an genau diesen Farben. Zwei Dinge stehen jetzt, die vorher fehlten: der Ozean folgt
einem Preset (also kann eine Weltstimmung ihn mitfärben), und die Landpalette liegt auf
Vorbildniveau — eine Stimmung kann von hier aus in BEIDE Richtungen, hell und dunkel. Vorher wäre
jede Stimmung von einem zu dunklen Nullpunkt gestartet und `molten` (E-36, der härteste Fall)
hätte gegen den Boden gearbeitet statt mit ihm.


---

## 05r · v6 · Slice E „Portal" · Teil 1 · 30.8.2026

**Zweig, keine Fortschreibung:** `globe-v6/` ist eine vollständige Kopie von `globe-v5/`, die
Seite heißt `KFB Travel Globe v6.dc.html`. v5 bleibt unberührt lauffähig — Slice E ist der
einzige Slice mit Zwischenabnahme durch Georg, und eine Abnahme braucht ein Vorher.

### Was steht

| Datei | Rolle |
|---|---|
| `globe-v6/portal.js` | NEU · Portalfeld: Platzierung, Bild, Trefferest, Sprung |
| `globe-v6/carpet.js` | `teleportTo()` — 1:1 `Carpet.ts:383`, der EINZIGE Weg, `qPosition` von außen zu setzen |
| `globe-v6/fx-script.js` | Kaskade `portal.pass` (9 Beats, 3 auf t=0 — E-29 ausgereizt, nicht überschritten) |
| `globe-v6/globe-poc.js` | Verdrahtung, Panel-Abschnitt „Portal (Slice E)", `?portale=N` |

**Zwei Quellendateien, ein Portal** (tinyskies@2659a5cc987d): Geometrie, Innen-Shader,
Aufklapp-Animation und Abkühlung aus `CarpetPortalSystem.ts`; Platzierung (Sektor je Portal, nur
Land, Höhe als Grund + Schwebehöhe + 0,22, Mindestabstand 1,2 rad) und die kamerazugewandte Lage aus
`CosmicWorldPortal.ts` (dessen Halo ist mitkopiert, aber AUS — Naht 5 im Nachtrag). Das ist kein Kompromiss, sondern die Bauform des Originals: dort ist das
eine ein Spieler-Portalpaar (Mechanik), das andere ein festes Weltportal (Ort). Unser Portal ist
ein Weltportal mit der Mechanik des Paars.

### Vier Nähte, jede mit einer Zahl im Panel

1. **Das Ziel ist ein ORT, kein zweites Portal** (E-32). Also muss die Ankunftshöhe erfunden
   werden — erfunden wird das Mindeste: Boden + Schwebehöhe + die Höhe über Grund, mit der man
   eingeflogen ist (geklemmt auf 0,5). Panel: `arrival AGL`.
2. **Der Kurs bleibt die Zahl, die er war.** `mapHeading` der Quelle bildet auf die Basis des
   Ziel-Portals ab; ohne Ziel-Portal gibt es keine. Die Welt wechselt, nicht die Absicht.
3. **Trefferfläche skaliert mit dem Portal.** 0,22 gegen 0,15 sind **1,47×** („forgiving
   teleports"); bei Weltskala 1,3 sind es 0,286 gegen 0,195. Das VERHÄLTNIS ist die Zusage.
4. **Der Trefferest kennt die Kamera nicht** — siehe unten, das ist der teuerste Punkt.

### Zwei Fehler, beide von einer Zahl gefunden, nicht von einer Meinung

**(a) Die Höhe der Portale war eine SUMME zweier Quellenzeilen.** Erste Fassung:
`max(Schwebehöhe, halbe Ovalhöhe) + 0,22` — der Zuschlag aus `placePortal` (wo das Portal auf
Flughöhe des Spielers gesetzt wird) addiert zu dem aus `pickWorldPose`. Beide Zeilen stehen in der
Quelle, **die Summe steht nirgends.** Ergebnis: Mitte 0,512 über Grund gegen Trefferradius 0,286
bei Reiseflughöhe 0,03 — **ein Portal, durch das man nicht fliegen kann.** Fehlerklasse 2, die
stille Mitte. Jetzt wörtlich die Quelle (`Boden + 0,03 + 0,22`), der untere Ring steckt dabei
0,022 im Gelände — **genau wie dort** (ein Riss, der aus dem Boden wächst).
Neue durchfallbare Zahl, die den Fehler gefunden hätte und ab jetzt im Panel steht:
*senkrechte Lücke Portalmitte ↔ Reiselinie gegen den Trefferradius* → `centre 0.220 u above the
cruise line vs hit radius 0.286 — reachable`.

**(b) Ein Tor, das sich mit dem Blick dreht, ist kein Tor.** E-33 (Georg) will das Portal
kamerazugewandt; der Segment-Test der Quelle prüft gegen die EBENE des Portals. Zusammengelegt
heißt das: in der Startansicht steht die Kamera fast senkrecht über der Welt, die Portalebene liegt
fast tangential, ein waagerechter Anflug ändert die Tiefe kaum — **300 Bilder Anflug, kein Sprung.**
Nach §05q wird die Kollision gemeldet, nicht geschlichtet: das Bild bleibt kamerazugewandt (E-33),
die Ebene des Trefferests steht senkrecht auf dem **Flugsegment**. Dieselbe Rechnung wie in der
Quelle, andere Normale — und damit die Aussage, die ein Weltportal braucht: *das Segment fliegt am
Mittelpunkt in weniger als `trigger` vorbei.* `t ∈ [0,1]` bleibt „Durchflug, nicht Annäherung".
Der Selbsttest prüft es aus ZWEI Richtungen; unter der Kamera-Ebene fällt die zweite durch.

**(c) Nebenbefund, aus dem ersten Testflug:** ein Sprung im ERSTEN Bild nach einem Setz-Befehl.
Kein Testfehler, sondern ein fehlender Eingang — der Trefferest ist ein Segment von der letzten zur
jetzigen Position, und nach einem fremden Ortswechsel ist dieses Segment ein Strich über die halbe
Kugel. Die Quelle hat dafür `syncToCarpet()`; wir jetzt auch (`portale.sync(carpet)`, gerufen in
`neustart()`). **Die Regel dazu: wer den Spieler versetzt, meldet es dem Trefferest.**

### Die neuen Zeilen im Panel (alle können durchfallen)

| Zeile | prüft | Stand 30.8. |
|---|---|---|
| `Portal gate (source geometry)` | Trefferverhältnis 1,47 · alle auf Land · Erreichbarkeit auf Reisehöhe · Mindestabstand ≥ 68,8° · Sprungweite ≥ 115° · Eintauchtiefe des Rings | ✓ |
| `Portal hit self-test` | Durchflug mittig · aus 90° · 95 % trifft · **105 % trifft nicht** · Anflug ohne Durchflug trifft nicht | 5/5 ✓ |
| `Nearest portal` | E-31: „das NÄCHSTE" wird je Bild gerechnet, nicht beim Bau gemerkt | Winkel + Farbe |

**Gemessen am laufenden Build** (Regel 3 des Onboardings): zwei Portale, min. Abstand 139°,
Sprungweite 136–141°, ein Durchflug im freien Flug ohne Zutun, ein zweiter im gesteuerten Anflug
(67 Bilder von 0,42 u Abstand), `portal.pass` gefeuert, 0 Frame-Fehler, Bildzeit 11,7 ms im Mittel
gegen die Basislinie 12,3 ms, 12 Objekte / 6 Draw-Calls je Portal, `glGetError 0`.

### Was in Teil 2 fehlt (Slice E ist damit NICHT durch)

Die **Wegweiser**: E-34 (Motiv random, später je Spielmodus) und E-35 (zwei Sorten, unterschieden
durch FX-Farbe, beide pulsierend — Karten-Weiser regenbogen, Portal-Weiser in Portalfarben, als
eigener Wirker `glow` in der Kaskadenschicht). Der Eingang dafür steht: `portale.naechstes(pos)`
und `PORTAL_COLORS` als EIN Eigentümer der Portalfarbe. Offen ist die Frage an Georg, ob ALLE
Wegweiser zum Portal zeigen oder die Karten-Weiser bei den Karten bleiben.

### Nachtrag aus der Abnahme · Naht 5 · der Halo

**Zum zweiten Mal in derselben Datei dieselbe Fehlerklasse, und diesmal hat sie die Abnahme
gefunden.** Der Halo (`getPortalHaloTexture`) ist wörtlich aus `CosmicWorldPortal.ts` kopiert und
stand als „1:1" im Dateikopf. Er ist es auch — nur liegt er dort **vor einer deckenden
Rift-Textur** (`/2D/rift.png`, die einzige Datei der Quelle, die im Repo nicht existiert). Bei uns
liegt dahinter das Innenblatt, und dessen Shader macht die Mitte ABSICHTLICH transparent
(`alpha = smoothstep(1,0.95,r) * centerDarkness`). Halo ohne Rift wäscht damit genau das aus, was
den Portal-Look trägt: **dunkler Kern, weißglühende Kante.**

Gemessen (Portal aus 0,8 u): mit Halo ein helles blauweißes Leuchten, der Ring verschwimmt darin;
Halo aus → sofort das Bild der Quelle. Also **Standard aus**, mit Schalter und Etikett
(`params.halo`, Panel `Portal halo (off = source look)`) — ein verworfenes Bauteil, das man nicht
wieder einschalten kann, dokumentiert keine Entscheidung, sondern eine Behauptung.

> **Lehre, allgemein und teurer als sie klingt: ein Bauteil 1:1 zu kopieren ist nicht dasselbe wie
> sein ERGEBNIS zu kopieren.** Wer ein Teil aus einem Stapel herausnimmt, kopiert seine Lage, nicht
> das Bild. Dieselbe Form wie der Höhen-Anlauf zwei Absätze weiter oben (Summe zweier
> Quellenzeilen) — und dieselbe Gegenmaßnahme: eine Zahl bzw. ein Schalter, der die Abweichung
> ausspricht, statt eines Kommentars, der sie bestreitet.

---

## 05s · v6 · Slice E „Portal" · Teil 2 · Die Wegweiser weisen · 30.8.2026

**Georgs Entscheidungen aus der Abnahme von Teil 1:** Portale je Welt **4** (Quelle: 2, bewusste
Abweichung, steht am Regler) · Portalhöhe **quellentreu lassen** · Wegweiser **zwei Sorten wie
E-35** · Gegner **nur Ziele jetzt, gefährlich als späterer Aufsatz auf denselben Treffer-Vertrag**.

### Was gebaut ist

**`card-towers.js` zeigt.** Bis v5 stand dort ein Kartenhaus mit Zufallskurs — in einem Slice, der
„Wegweiser & Portal" heißt, ist ein Schild ohne Richtung Bauschmuck. Neu:

- **Der Kurs ist ab jetzt eine GRÖSSE, nicht ein Bauwert.** `qBase` (Lage ohne Kurs) plus
  `aimYaw` ergeben die gezielte Ruhelage `q0`; die Anschlag-Reaktion aus S7b rechnet weiter gegen
  `q0`. Ein Eigentümer (Ziel-Kurs) plus ein Modifikator (Anschlag) — nicht zwei Schreiber auf
  `grp.quaternion`.
- **E-31 wortwörtlich umgesetzt:** der Wegweiser kennt nicht „das Portal", sondern fragt je Bild
  nach dem NÄCHSTEN. Gerechnet wird die Entfernung beim jeweiligen Eigentümer
  (`portale.naechstes`, `sky.nearest`); `card-towers` kennt weder Portale noch Karten, es kennt
  **Ziele** (`setAim(fn)` → `{ pos, farbe }`). Der Zielgeber im Runner ist die EINZIGE Stelle, an
  der beide Welten sich kennen.
- **E-35: zwei Sorten, unterschieden durch FARBE bei gleicher Form.** Portal-Weiser pulsieren in
  der Farbe ihres Ziel-Portals (`PORTAL_COLORS`, ein Eigentümer), Karten-Weiser in einem langsamen
  Regenbogen (0,08 Hz). Zuteilung abwechselnd nach Standort-Index, also in derselben Welt immer
  gleich: 5 + 5.
- **Der Puls gehört dem Schild, der STOSS der Partitur.** `glow` ist ab jetzt ein Wirker der
  Kaskadenschicht (E-35: „…gehört sie in die Kaskadenschicht als eigener Wirker, nicht als
  Materialschalter am Modell"), gefeuert von `signpost.hit` bei t = 0,08 — nicht bei 0, wo schon
  drei Beats liegen und ein Leuchten IM Anschlag auch dramaturgisch falsch wäre. Das getroffene
  Schild kommt als `ctx.site` mit; ohne das leuchtet bei einem Anschlag die ganze Welt.
- **E-34** ist als Parameter da (`deckWahl: 'random'`), und ein unbekannter Wert wird **gemeldet**
  statt geschluckt (Fehlerklasse 8: ein Register, das unbekannte Schlüssel ignoriert, ist ein
  Tippfehler-Verstecker).

### Ein Anlauf, gemessen und behoben

Erste Fassung ließ die Schilder aus ihrem BAUWINKEL zum Ziel schwenken. Die Abnahme meldete
`servo lag Ø 98,1°, max 140,8° ⚠ drifting` — richtig gemessen, und die Ursache war nicht der Servo,
sondern der Anfangszustand: eine Animation ohne Anlass. Jetzt wird beim ERSTEN Bild **gesetzt**,
danach gedreht; damit heißt jeder Grad Restfehler das, was er heißen soll — **Nachlauf hinter einem
Ziel, das sich bewegt.** Nachher: Ø 0,0°, max 0,0°.

### Gemessene Eigenheit, die zur Sorte gehört (keine Meinung, eine Zahl)

Die Karten leben in einem **Ring um den Spieler** (`sky-cards` setzt sie vor ihm neu, sobald er
sie hinter sich lässt). Ein Karten-Weiser zeigt darum auf ein Ziel, das mitwandert: beim Vorbeiflug
lesbar („dort liegt was"), aber **keine Wegbeschreibung** — die haben nur die Portal-Weiser, weil
ein Portal wirklich still steht. Steht so in der Panel-Notiz, damit niemand den Unterschied für
einen Fehler hält.

### Neue Panel-Zeile (kann durchfallen)

`Signpost gate (E-34/E-35)`: beide Sorten besetzt · kein Schild ohne Ziel · Servo-Restfehler
(Ø und max, ⚠ ab 25°) · **Farbabstand der beiden Sorten in Grad, gemessen am Emissiv des Blattes**
statt behauptet. Ohne Zielgeber meldet die Zeile `idle` — ein leerer Eimer ist ein Ergebnis.

Stand am laufenden Build: `✓ 5 portal + 5 card signposts · all have a target · servo lag Ø 0.0°,
max 0.0° · hue gap 113–171° between the two kinds`, Portal-Tor ✓ mit 4 Portalen (min. Abstand
79,4°, Sprungweite ≥ 132,5°), `glow` 4 Beats je `signpost.hit`, 0 fehlende Wirker, 0 Frame-Fehler.

### Damit ist Slice E durch — offen bleibt aus der Abnahme

**Gegner als Ziel-Slice** (Georgs Antwort): Auto-Target im Chill-Mode, Treffer-Vertrag, Kill-VFX
über die bestehenden Kaskaden — und der Vertrag muss so gebaut sein, dass „gefährlich" später ein
AUFSATZ ist und keine zweite Mechanik. Das Schießen existiert (Space), es hat nur kein Ziel.

### Nachtrag 2 · das Bild war das falsche Portal (Georg, 30.8.)

> *„die portale sehen extrem anders aus als in tinyskies…?"*

Er hat recht, und die Ursache ist eine **Behauptung über den Bestand statt einer Suche**: im
Dateikopf stand `/2D/rift.png` als *„die einzige Datei der Quelle, die wir nicht haben"*. Sie liegt
in `client/public/2D/rift.png` (581×680, 70 % transparent) und ist jetzt als `globe-v6/rift.png`
im Projekt.

Damit war das ganze Bild aus der falschen Datei gebaut: **Torusring plus Wirbel-Shader ist das
Portal, das der SPIELER setzt** (`CarpetPortalSystem`) — ein Weltportal (`CosmicWorldPortal`) ist
**Halo + Riss + achtzig funkelnde Sterne**, in einer um 0,65 × 1,25 gestauchten Gruppe, **ohne
Aufklapp-Animation** (ein Weltportal wird nicht geöffnet, es ist da). Alles drei jetzt 1:1
portiert; der Ring bleibt als zuschaltbarer Rahmen (`params.ring`, aus), und der Wirbel-Shader ist
**gelöscht**, nicht stillgelegt — ein Shader, den niemand kompiliert, ist kein Rückweg, sondern
Ballast; der Rückweg ist die URL im Dateikopf.

Einzige Abweichung im Bild: die achtzig Funken kommen aus einem Seed-Strom statt aus
`Math.random()` (Hausregel S3a — sonst sieht dieselbe Welt bei jedem Laden anders aus).

**Zwei Lehren, und sie sind dieselbe:**
1. **„Haben wir nicht" ist ein Messwert, kein Gefühl.** Beide Anläufe dieser Datei (Portalhöhe,
   Bild) hatten dieselbe Wurzel: eine Aussage über die Quelle, die nie an der Quelle geprüft wurde.
2. **Ordentliche Buchführung über eine erfundene Abweichung macht sie nicht kleiner.** Der Halo
   stand als „Naht 5" im Kopf, mit Messung, Schalter und Panel-Notiz — eine sauber dokumentierte
   Folge eines Fehlers, der eine Zeile weiter oben schon feststand. *Ein Instrument, das eine
   Abweichung ausspricht, prüft nicht, ob sie nötig war.*

**Dazu eine zweite Bezugsgröße im Tor**, weil sich mit dem Bild die Frage ändert: die 1,47× der
Quelle beziehen sich auf den RING (0,15). Sichtbar ist jetzt der Riss, und der ist ein Vielfaches
davon. Die Zeile nennt deshalb beides — Trefferfläche gegen Ring **und** gegen die sichtbare
Rissbreite (waagerecht ≈ 1,0, senkrecht ≈ 0,5). Wer nur die 1,47 nennt, verspricht Großzügigkeit
und liefert eine Nadel.

### Nachtrag 3 · der Regenbogen lief durch die Portalfarben

Die Abnahme hat gemessen, was das Tor nicht sehen konnte: über eine Regenbogenrunde kam ein
Karten-Weiser dem Portal-Farbton auf **0,3°** nahe — und in diesem Moment sind zwei Sorten, die
sich NUR durch Farbe unterscheiden, dasselbe. Behoben nicht durch eine Zahl, sondern durch die
Struktur: `setTabuFarben(PORTAL_COLORS)` sperrt ein Band von ±34° um jeden Portal-Farbton, und der
Regenbogen wird auf die übrigen Bögen abgebildet. Der Mindestabstand ist damit **garantiert**, nicht
gehofft — und die Farbe wandert mit, wenn die Portalfarbe sich ändert (ein Eigentümer,
weitergegeben, keine zweite Tabelle).

Zwei Fehler am Tor selbst, beide aus derselben Familie und beide behoben:
· es las EIN Paar zu EINEM Zeitpunkt → jetzt **Minimum über alle Sorten-Paare, als laufendes
  Minimum über die Sitzung** (Fehlerklasse 5: eine Abnahme, die einen von zwei Verbrauchern prüft,
  meldet grün, während das Bild kaputt ist);
· es fiel bei `Signpost glow = 0` durch → jetzt `colour idle · glow off`. **Eine Zeile, die rot
  wird, weil man einen Effekt abschaltet, erzieht zum Überlesen.**

Stand am laufenden Build: `✓ 5 portal + 5 card signposts · all have a target · servo lag Ø 0,0° ·
hue gap 43° worst of all pairs this session (guaranteed ≥ 34°)`, Portal-Tor ✓ mit 4 Portalen,
`rift.png` geladen (581×680), 4 Halos, 4 Sternenfelder, 0 Frame-Fehler.

### Nachtrag 4 · dieselbe Formel, andere Eingabegröße — der Riss zuckte

Der Riss lebte in einer Zahl, in der Float32 nicht mehr rechnen kann. Gemessen: unser Seed hat neun
Stellen, also `phase = seed * 0.0012 + i * 10` ≈ **484 569** — und ein float32-`uTime` hat bei
dieser Größe eine Schrittweite von **0,031**. Bei dt = 1/60 ändert sich der Uniform erst nach zwei
Bildern, und `sin(uTime * 25.0 + …)` im Sway springt dann um 0,78 rad auf einmal: **der Riss zuckt
in Zweibild-Stufen, die achtzig Funken blinken quantisiert im Gleichtakt** — genau die Lebendigkeit,
wegen der der Riss überhaupt geholt wurde.

Die Formel ist 1:1 aus `CosmicWorldPortal`. Dort ist `seed` eine kleine Weltzahl. **Dieselbe Formel
mit einer anderen Eingabegröße ist nicht dieselbe Formel** — dieselbe Fehlerklasse wie die
Portalhöhe und das falsche Bild, zum dritten Mal in einer Datei, diesmal numerisch. Die Absicht der
Quelle ist „Portale laufen nicht im Gleichtakt", nicht eine absolute Zeitmarke; die Phase ist jetzt
`(seed·0,0012 mod 2π) + i·1,7` (gemessen 7,4 statt 484 569).

Und weil der Defekt **im Code unsichtbar** ist — der Shader ist korrekt, die Zahl ist es nicht —
steht die größte Phase ab jetzt als durchfallbare Zahl im Tor: `shader phase 7.4 (float32-safe,
< 4000)`. Grenze 4000, weil die Auflösung dort ~0,0005 beträgt, also 30× feiner als das, was ein
Bild bewegt. Ohne diese Zeile käme derselbe Fehler beim nächsten großen Seed lautlos zurück.

> **Das Muster dieser drei Nachträge ist EINES**, und es lohnt sich, es als Frage aufzuschreiben:
> *stimmt die Eingabe, mit der ich die Quellenzeile fütternde?* Die Zeile war jedes Mal richtig —
> die Summe zweier Zeilen, die fehlende Datei, die Größenordnung des Seeds. Kopieren ist nicht die
> Zeile, sondern die Zeile MIT ihren Voraussetzungen.

### Nachtrag 5 · eine unmögliche Anfrage bekommt eine Ablehnung, keine falsche Antwort

Der Notplatz in `ortWaehlen` war der letzte Defekt dieses Slice, und er stammt direkt aus der
Quelle: nach 500 Fehlversuchen fällt `pickWorldPose` auf `moveOnSphere(q, 0, 0.4)` zurück — **ohne
Land- und ohne Abstandsprüfung**. Bei EINEM festen Weltportal ist das ein Notnagel; bei einer
VARIABLEN Anzahl (E-31) ist es eine Lüge. Gemessen auf zwei Seeds mit fünf Portalen: je **1 Riss im
Meer**, Mindestabstand auf 54,3° bzw. 30,7° gefallen — und gebrochen war dabei die dokumentierte
Regel der Platzierung selbst („nur Land").

Behoben nicht am Rand, sondern an der Antwort: `ortWaehlen` gibt `null` zurück, `bauen()` setzt
dieses Portal **nicht** und zählt es, und das Tor sagt es in Worten —
`8 asked, 6 placed — this world has no room at 1.2 rad separation`. **Ein Portal, das fehlt und
sich meldet, ist besser als eines, das steht und lügt.**

Dazu ein Folgefehler, der beim Prüfen auffiel: `setAnzahl` verglich das neue Soll mit der Zahl der
STEHENDEN Portale. Seit eine Welt eine Anfrage ablehnen darf, sind die beiden nicht mehr dasselbe —
der Weg `5 → 4` wurde verschluckt und die Meldung „5 asked, 4 placed" blieb stehen. Verglichen wird
jetzt mit dem Soll. *Wer eine Größe aufspaltet (angefordert ≠ gesetzt), muss jeden Vergleich
nachziehen, der sie vorher als eine gelesen hat* — Fehlerklasse „eine Regel zurücknehmen und ihre
Folgen stehen lassen", diesmal im gleichen Atemzug erwischt.

Am laufenden Build (Seed 97738353): 4 → ✓ 71,5° · 5 → ✓ 72,5°, alle auf Land (diese Welt trägt
fünf) · 8 → **6 gesetzt, 2 abgelehnt**, alle auf Land, 69,9° · Rückweg auf 4 exakt wieder ✓.

### Nachtrag 6 · zwei Rollen, ein Bild pro Rolle (Georg, 30.8.)

> *„das ist noch etwas anderes — das sind die transition zu space!"* · *„brauche wir auch — sind
> aber keine portale!"* · *„wir können portal erstmal innerhalb einer welt denken · risse dann zu
> anderen welten/decks"* · *„das waren schon die richtigen assets, nur falsch gebaut/animiert"*

Damit ist die Verwirrung der letzten zwei Runden aufgelöst, und sie war meine: ich habe **zwei
Rollen in ein Objekt gelegt** und beim Bild zweimal die falsche Hälfte gewählt.

| Bild | Rolle | Quelle |
|---|---|---|
| `ring` (Standard) | **Portal — innerhalb DIESER Welt** (Sprung, E-32) | `CarpetPortalSystem.PortalVisual` |
| `riss` | **Übergang zu anderen Welten/Decks** — Bild gebaut, Mechanik ist ein eigener Slice | `CosmicWorldPortalVisual` + `rift.png` |

Beide sind jetzt eigene Fabriken in `portal.js`, umschaltbar im Panel, und die Torzeile sagt die
Rolle mit: `ring image (portal in this world)` bzw. `RIFT image (world/deck transition — not a
portal)`. **Ein Bild ist keine Dekoration, es ist eine Ansage** — ein Riss sagt „dahinter ist kein
Ort dieser Welt", ein Ring sagt „dahinter ist die andere Seite".

### Drei Messungen für „richtige Assets, falsch gebaut"

1. **Kein Bloom-Pass in der Quelle.** Gesucht statt vermutet: `EffectComposer` kommt in
   `client/src` **nicht vor**, und zwei Dateien sagen den Grund in eigenen Kommentaren
   (`CapybaraFlameShots`: „simulates bloom without a post-processing pass"; `PaintballSplash`:
   „no post bloom required"). Das Leuchten im Screenshot ist also **gebaute Geometrie**. Unser
   Portal hatte davon nichts: ein dünner Ring mit einem Loch. Jetzt trägt es einen
   kamerazugewandten Schein-Sprite (dieselbe Hausschreibweise, dieselbe Halo-Textur).
2. **Der Kern leuchtet, statt dunkel zu sein.** Der gepinnte Baum malt per `centerDarkness`
   ausdrücklich ein dunkles Zentrum; das ausgelieferte Spiel zeigt weißblaue Glut. **Die
   ausgelieferte Fassung ist neuer als unser Pin** (dieselbe Branch, anderer Stand) — §05q sagt
   „die Quelle hat Vorfahrt", und die Quelle ist das SPIEL, nicht der Zeitstempel. Also drei Zeilen
   Shader mit einem Regler, dessen **0 exakt der gepinnte Baum ist** (`Portal core glow`,
   Standard 75 %).
3. **Die Größe war eine Konstante und ist jetzt eine Entscheidung.** `BASE_PORTAL_RADIUS 0.15`
   ergibt ein Portal, das **schmaler als der Teppich** ist (0,25 gegen 0,35 u) — im Screenshot füllt
   es ein Drittel des Bildes. Eine Zahl aus einem Foto zu schätzen wäre wieder Mess-und-Rate, also
   steht sie als Regler mit BEZUGSGRÖSSE im Panel (Portalbreite in Teppichbreiten; die pinned 1,3
   ist markiert). Standard 2,6 → **0,51 × 0,98 u, 1,4× Teppichbreite**, Trefferfläche wächst mit
   (0,572) und die Zusage 1,47× bleibt.

⚠ Und ein Eigenfehler, der zehn Minuten gekostet hat: der neue Shader-Kommentar enthielt
**Backticks** — der Fragment-Shader lebt in einem Template-Literal, also endete der Shader mitten
im Satz (`SyntaxError: Unexpected identifier 'centerDarkness'`, vier Ladeversuche). Steht jetzt als
Warnung im Block: *in einem Template-Literal ist ein Backtick im Kommentar ein Sprengsatz.*

Offen und sichtbar als Zahl: bei Größe 2,6 steckt der Ring **0,295 u im Boden** (die Höhenregel
bleibt quellentreu, Georgs Entscheidung). Wenn das Portal auf dem Hügel STEHEN soll, ist das ein
zweiter Regler — nicht heimlich, sondern auf Zuruf.

### Nachtrag 7 · die Höhe gehört dem BILD, weil sie in der Quelle dem OBJEKT gehört

Die Portalhöhe stand fest auf `Grund + 0,03 + 0,22` — der Regel aus `pickWorldPose`, richtig für den
RISS. Als das Standardbild der RING wurde, ist diese Regel stehen geblieben: Ergebnis 0,295 u
versenkter Ring, also 27 % seiner Höhe im Hügel, während Georgs Referenzbild das ganze Oval auf dem
Hügel STEHEN zeigt. Und die Torzeile gab die Folge als `source does the same` aus — die Quelle tut
für einen Ring ausdrücklich das Gegenteil (`placePortal`: `max(Schwebehöhe, halbe Ovalhöhe + 0,02)`,
Kommentar „Ensure the portal's bottom edge clears the ground").

Damit war es zweimal dieselbe Fehlerklasse in derselben Zahl: erst habe ich die beiden Quellregeln
**addiert** (Nachtrag a: Portal unerreichbar), dann die Rolle des Bildes gewechselt und die Höhe des
**alten** Bildes stehen gelassen. **Ein Instrument, das eine erfundene Abweichung als Quellentreue
ausgibt, ist schlimmer als keins.**

Jetzt wählt die Höhe das Bild:

| Bild | Höhe | Quelle | gemessen (Größe 2,6) |
|---|---|---|---|
| `ring` | `Grund + max(hover, halbeOvalhöhe + 0,02)` | `placePortal` | Kante **0,000** im Boden, Lücke 0,535 gegen Treffer 0,572 ✓ |
| `riss` | `Grund + hover + 0,22` | `pickWorldPose` | Kante 0,295 im Boden — ein Riss wächst heraus ✓ |

Skalierungsstabil, und das ist der Punkt: die Lücke ist 0,2096·Skala − 0,01 gegen einen
Trefferradius von 0,22·Skala, das Verhältnis bleibt 0,95 bei jeder Größe. Ein Regler kann das Tor
also nicht mehr aus Versehen brechen. Auch die Größenangabe im Tor rechnet jetzt je Bild
(Ring 0,51 × 0,98 u · Riss 1,19 × 2,29 u) — vorher untertrieb sie im Rissmodus um Faktor 2,3.

### Nachtrag 8 · die 1,47 war ein Netz, kein Versprechen

Der letzte Defekt dieses Slice ist das Produkt zweier eigener Entscheidungen — Kugeltest (Naht 4)
× Größenregler (Nachtrag 6) — und niemand hat ihn einzeln verursacht: seit Naht 4 lautete die
Prüfung „Abstand Segment ↔ Mittelpunkt ≤ trigger", also eine **Fangkugel**, und mit dem Regler wuchs
sie auf 0,572 u, während das sichtbare Oval nur 0,254 u halbbreit ist. Gemessen mit synthetischem
Vorbeiflug: **0,55 u seitlich (2,2× die sichtbare Halbbreite) hat teleportiert.** Man wurde von
außen gegriffen, ohne das Portal zu berühren.

Die 1,47 der Quelle sind in deren EBENEN-Test gebunden: 0,22 gegen einen 0,15er Ring **in derselben
Ebene**, und ein paralleler Vorbeiflug kann eine Ebene nicht durchstoßen. Ohne diese Bindung ist die
Zahl kein Versprechen, sondern ein Netz — und die Panel-Notiz verkaufte sie als *„an invitation
instead of a needle"*, während das Fangvolumen doppelt so breit war wie das Bild.

Jetzt ist die Trefferfläche eine **Ellipse an den sichtbaren Halbachsen**: seitlich
`R·0,65·1,47 = 0,372`, radial `R·1,25·1,47 = 0,715`, gemessen gegen den Punkt der größten
Annäherung und zerlegt an der Standortnormale des Portals. Damit gilt die Zusage gegen das, was man
SIEHT — bei jeder Größe —, und die Richtungsunabhängigkeit aus Naht 4 bleibt, weil die Ellipse ein
Rotationskörper um die Hochachse ist.

Zwei Instrumente sind mitgezogen, weil sie sonst weiter die falsche Zahl gelobt hätten:
· die Torzeile nennt **beide** Verhältnisse gegen die sichtbaren Halbachsen (vorher im Standardmodus
  nur „1,47× the ring" — ausgerechnet die Zahl, die den Defekt zeigt, fehlte dort);
· der Selbsttest prüft gegen die SEITLICHE Halbachse und hat einen sechsten Satz bekommen:
  *Vorbeiflug 2,2× neben dem sichtbaren Oval trifft nicht* — der Befund vom 30.8. als Dauerprobe.
Und die Erreichbarkeitszahl vergleicht die Höhenlücke jetzt mit der RADIALEN Halbachse; seit die
Fläche eine Ellipse ist, gibt es für Höhe und Breite zwei verschiedene Zahlen.

Stand: 6/6 im Selbsttest, `hit 1.47× the visible half-width (0.372 u) and 1.47× its half-height
(0.715 u) — source 1.47, as an ellipse`, Lücke 0,535 gegen 0,715 ✓, 0 Frame-Fehler.

### Nachtrag 9 · ein vorgesehener Regler darf kein Bruch sein

`Hit window · factor` machte das Portal-Tor rot: `verhOk` prüfte die Quellentreue **mit** dem
Aufweitungsfaktor darin, also fiel jeder Reglerwert ≠ 1 durch — obwohl genau dieser Regler in der
Quelle vorgesehen ist (`CarpetPortalSystem.upgrades.triggerRadiusMult`). Dieselbe Klasse wie
`Signpost glow = 0` eine Runde vorher, nur über ein anderes Bedienelement: **eine Zeile, die rot
wird, weil man einen vorgesehenen Regler bewegt, erzieht zum Überlesen.**

Behoben nach demselben Muster: Quellentreue wird **bei Faktor 1** gemessen, und der aufgeweitete
Zustand wird BENANNT statt bestraft —
`hit 1.47× the visible oval as an ellipse (source 1.47) · widened 2.50× by the upgrade knob →
3.67× the image (⚠ grabs from outside)`. Die Warnung bleibt also erhalten, sie sitzt nur an der
richtigen Stelle: nicht am Regler, sondern an seiner Folge.

Dazu ein Feld aufgeräumt, dessen Name nicht mehr sagte, was es misst: `trefferVerhaeltnis` war noch
`trigger()/R()` (=1,83) und ist jetzt das Verhältnis zur sichtbaren Halbbreite ohne Faktor (1,467).
*Ein Messwert, dessen Name eine andere Größe verspricht als seine Rechnung, ist eine Lüge mit
Nachkommastellen.*

### Nachtrag 10 · drei Etiketten, die ihre eigenen Zahlen widerlegten

Kein Mechanikfehler, sondern die teuerste Sorte Textfehler: **ein Etikett, das der Messung daneben
widerspricht.** Alle drei aus der Abnahme, alle in einer Runde behoben:

1. Die erste Portal-Notiz behauptete weiter `ground + hover + 0.22 — the lower rim sinks 0.022 u
   into the terrain, as in the source` und eine `hit disc … 1.47× the visible rift` — zwei Zeilen
   über einer Torzeile, die `rim 0.000 u into the ground · bottom edge clear` misst. Seit
   Nachtrag 7 gilt die Höhe je BILD und seit Nachtrag 8 ist die Trefferfläche eine ELLIPSE an den
   sichtbaren Halbachsen. Die Notiz nennt jetzt beides. *Zum dritten Mal in diesem Slice: wer eine
   Regel ändert, muss ihre Erzähler mitziehen — und die sind bei uns Panel-Notizen.*
2. Der Panel-Kopf hieß `Travel Globe v5 · Settings`, ebenso die Kopfzeile im Bild und der Kopf des
   Textberichts. In einem Projekt, in dem v5 **parallel lauffähig** bleibt, ist das kein
   Schönheitsfehler: wer zwei Tabs offen hat, liest den falschen Build. Jetzt v6 an allen drei
   Stellen.
3. `Portal hit self-test` war die einzige deutsche Zeile in einem durchgehend englischen Panel —
   übersetzt, inklusive der beiden Kontrollproben und des 2,2×-Satzes.

---

## 05t · v6 · Slice E2 „Fliegende Gegner" · nur ZIELE · 30.8.2026

**Georgs Antwort auf die Größenfrage:** *„Nur Ziele jetzt, gefährlich als späterer Aufsatz auf
denselben Treffer-Vertrag."* Das ist der Bauauftrag, und es ist ein VERTRAG, kein Feature.

### Quelle: `SkyGremlins.ts` (50 kB, bis heute bewusst ungelesen)

Übernommen sind ihre Zahlen und ihr Verhaltensmodell, wörtlich: Höhenband 0,52…0,65 ·
Bodenabstand 0,20 · Reisetempo 0,34 · Jagdtempo 0,50 · Wippen 2,8 rad/s bei 0,08 · Sichtweite 2,25 ·
Abstandsband 0,92 / 1,15 / 1,45 mit Orbit-Gewicht 0,92 und Rückzug 1,25 · Kurs-Blende 3,6/s ·
Höhen-Blende 2,8/s · Trefferradius 0,16 · **3 Treffer je Gegner** · Absturz 0,8 s bei Sinkrate 0,95 ·
Respawn 13…19 s · Spawn mindestens 2,5 u vom Spieler · Trefferwackeln 0,85, Abklingen exp(−5·dt).
Der Segment-Kugel-Test (`segmentHitsSphere`) ist 1:1 — und er ist keine Feinheit: bei 9 u/s legt ein
Schuss 0,15 u je Bild zurück, also fast den ganzen Trefferradius. **Ein Punkttest würde regelmäßig
durch den Gegner hindurchspringen.**

### Was ABSICHTLICH fehlt — und wo es später herkommt

Die Quelle lässt ihre Gremlins schießen (`FIRE_RANGE 1.6` · `FIRE_DOT 0.82` · `AIM_TURN_RATE 9.0` ·
Nachladen 1,85…2,95 s · `SHOT_SPEED 2.85` · `MUZZLE_FORWARD 0.12` · `AIM_SIDE_SPREAD 0.24` ·
`PLAYER_HIT_RADIUS 0.22`) und hat einen König (10 Treffer, ab 7 Abschüssen). Nichts davon ist
gebaut — **aber alle Konstanten stehen im Dateikopf**, damit der Aufsatz sie KOPIERT statt sie neu
zu erfinden. Der Vertrag hält genau die Felder offen, die er braucht: `leben`, `zustand`,
`weltPos`, `onTreffer`, `onAbschuss`. **Ein „gefährlicher" Gegner ist damit ein Sender, kein Umbau.**

### Drei eigene Nähte, jede benannt

1. **Die Gegner sind animierte GLB-Modelle** (Quaternius „Ultimate Monsters Bundle" — Ghost Skull,
   Ghost, Armabee, Hywirl, Squidle; `anim: true` steht im Index, nicht in meiner Erinnerung), nicht
   aus Primitiven gebaut wie in der Quelle. Also `SkeletonUtils.clone` je Exemplar und ein
   `AnimationMixer` je Exemplar: **ein gewöhnlicher Klon teilt das Skelett**, und dann tanzen alle
   im Gleichtakt oder brechen zusammen, weil zwei Mixer auf denselben Knochen schreiben. Der Clip
   wird nach Namen gewählt (`fly|hover|idle|float|walk|run`), gemessen läuft `Fast_Flying`.
2. **Kein Trail, keine HP-Leiste** (beides hat die Quelle). Der Trail wäre ein zweiter
   Streifenzeichner neben `carpet-trail`; die HP-Leiste ist eine HUD-Entscheidung, die Georg nicht
   getroffen hat. Dass ein Treffer gesessen hat, sagt das Trefferwackeln.
3. **Zielhilfe im Chill-Mode** (Georgs Vorgabe, in der Quelle gibt es das Gegenteil: Streuung).
   Sie biegt die Richtung **einmal beim Abschuss** — nie das Projektil im Flug, nie die
   Trefferprüfung. *Eine Zielhilfe, die während des Flugs nachlenkt, nimmt dem Spieler den Schuss
   weg; eine, die die Nase gerade richtet, gibt ihm den Treffer.* 0° ist damit exakt „aus", und das
   ist keine Sonderregel, sondern das Ergebnis der Rechnung.

### Zwei Kaskaden, weil es zwei Ereignisse sind

`enemy.hit` ist kurz und trocken (drei Beats), `enemy.kill` hat die Zeitachse: Einschlag,
Pet richtet sich auf, HUD-Stoß — und der zweite Ton plus Staub liegen bei **0,62 s**, auf dem ENDE
des 0,8-s-Sturzes. Dieselbe Regel wie bei der Kartenankunft: der Höhepunkt bekommt seinen eigenen
Klang. Ein Treffer, der klingt wie ein Abschuss, macht drei Trefferpunkte unlesbar.

### Die durchfallbare Zahl

`Enemy gate (SkyGremlins.ts)`: jeder Gegner hat einen Animationsclip (**ein starrer Gegner ist ein
Fehler, kein Stil** — er sieht wie ein vergessenes Prop aus) · Bodenabstand ≥ 0,20 · Höhenband
0,52…0,65 · Trefferkugel im Verhältnis zur Modellhöhe · und der Satz, der die Lehre aus dem Portal
VORHER anwendet: *sie fliegen 0,4…0,6 u über der Reiselinie, ↑ (Steigen) ist der Weg zu ihnen.*

Am laufenden Build: `✓ 3 enemies (3 alive, 5 models) · all animated · 0.48…0.64 u above ground
(source ≥ 0.20) · hit sphere 0.160 u = 1.00× the model height`. Über den RUNNER-Pfad geprüft (nicht
am Modul vorbei — die Lehre aus dem Würfel-Bug): Zielhilfe biegt 6,1° auf „Ghost", `enemy.hit`
gefeuert, drei Treffer ergeben einen Abschuss, Sturz und Respawn laufen, ein Schuss 0,5 u daneben
trifft nicht. 0 Frame-Fehler, 11,6 ms.

### Nachtrag 11 · zwei Messfehler auf beiden Seiten des Tisches

**(a) `Box3.setFromObject` lügt über skinned Modelle.** Die Skalierung der Gegner kam daher, und
bei „Ghost Skull" meldete die Box eine Höhe von rund **200 u** — daraus wurde `norm = 0,00076`, das
Modell war **68× zu klein**, die Bone-Spanne lag bei 1,7 Millimetern Weltmaß. Sub-pixel aus jeder
Entfernung, und das Tor meldete grün, weil es `trefferRadius / def.h` rechnete — **die Absicht gegen
sich selbst.** Behoben in zwei Schritten, beide gemessen:
· Die Größe kommt jetzt aus dem **Index** (`size: [5.50, 3.101, 1.534]` — dort wurde sie einmal
  sauber gemessen). *Eine Messung, die man schon hat, wird nicht zur Laufzeit neu erfunden.*
· Danach wird EINMAL an der **Knochen-Spanne** nachgezogen: bei einem skinned Modell sagt die
  Geometrie nur die Bindpose, wohin die Vertices wandern sagen die Knochen. Nachher: gebaut
  0,130…0,160 u gegen die geplanten 0,16 (0,81×).
Und das Tor nennt jetzt die **gebaute** Größe, gemessen am Netz, plus die **Bildschirmhöhe in
Pixeln** des nächsten Gegners (aktuell 79–98 px). *Eine Prüfzeile, die den Plan wiederholt, prüft
nichts.*

**(b) `readPixels` auf dem Default-Framebuffer misst nicht das eigene Render.** Die Abnahme
schloss aus sechs byte-identischen Messpunkten „die Gegner zeichnen kein einzelnes Pixel" — und ich
hatte mit derselben Methode dasselbe gemessen. Ohne `preserveDrawingBuffer` liegt dort das letzte
**präsentierte** Bild, nicht der Probe-Render; A/B ergibt damit zwangsläufig „identisch", egal was
in der Szene steht. Die Gegner waren die ganze Zeit da: projiziert man sie, steht Gegner 0 in 1,17 u
Abstand mit **44 px Höhe** — bei NDC (−1,06 / 0,93), also knapp neben der Bildkante, und dort hat
niemand hingesehen. Nachher, mit korrigierter Größe: 98 px, mitten im Bild.

> **Die Lehre gilt für beide Seiten und ist die teuerste dieser Sitzung: eine Messung braucht eine
> Kontrollprobe, sonst ist sie eine Meinung mit Zahlen.** Die Pixelprobe hätte man in zehn Sekunden
> entlarven können — einmal auf ein Objekt richten, von dem man WEISS, dass es sichtbar ist. Für
> „ist es zu sehen" ist die Projektion (Weltgröße, Abstand, Öffnungswinkel, Canvashöhe) das
> ehrlichere Instrument: sie kann nicht stillschweigend das falsche Bild lesen.

**Dazu ein echter Fund derselben Runde, der nichts mit Pixeln zu tun hat:** `makeBasis(right, up,
forward)` mit `right = forward × up` ergibt eine **linkshändige** Basis (Determinante −1). Bei den
Primitiven der Quelle unsichtbar; ein GLB mit `side: FrontSide` dreht damit seine Dreiecks-Wicklung
und ist von innen zu sehen. Jetzt rechtshändig gebaut (X = Y × Z, dann Y = Z × X), Determinante
gemessen **+1** — kein `DoubleSide` darüber, das wäre ein Pflaster auf einem Vorzeichen.

### Nachtrag 12 · ein Messwert, der von der Sortierung abhängt, misst die Sortierung

Die Zeile aus Nachtrag 11 — gebaut sie den 68×-Fehler fangen — hatte selbst den Fehler, den sie
verhindern soll: sie teilte das **Minimum über alle** Gegner (0,130 = Armabee) durch die Zielhöhe
von **einem** Modell (0,16 = Ghost Skull) und meldete `0.81× the intended 0.16`, obwohl jeder
Gegner exakt seine eigene Absicht erreicht hatte. Zwei verschiedene Absichten in einem Verhältnis;
mit anderer Reihenfolge im `GEGNER_SATZ` hätte dieselbe korrekte Welt „1,23×" gemeldet.

Jetzt je Gegner gegen SEINE `def.h`, ausgegeben als Spanne der Verhältnisse:
`built 0.130…0.160 u tall = 1.00…1.00× intended PER MODEL`.

> Das ist dieselbe Regel, die drei Nachträge weiter oben steht — *ein Messwert, dessen Name eine
> andere Größe verspricht als seine Rechnung, ist eine Lüge mit Nachkommastellen* — und sie ist mir
> in der Zeile passiert, deren einziger Zweck das Aufdecken genau solcher Lügen war.
> **Eine Prüfzeile ist Code und braucht dieselbe Sorgfalt wie das Geprüfte.** Der billigste Test
> dafür ist die Frage: *ändert sich diese Zahl, wenn ich nur die Reihenfolge der Eingaben tausche?*

Bewusst NICHT geändert: `nearest one is 5 px tall ⚠ barely visible` steht als Warnung im Text,
während das Tor grün bleibt. In der Startansicht steht die Kamera 9–12 u weg, da sind 5 px richtig;
im Flug sind es 98. Eine Warnung, die durchfallen würde, sobald man weit genug wegzoomt, wäre eine
Zeile, die man wegsehen lernt.

---

## 05u · Sprint-Übergabe · v6 (Slice E + E2) · Sitzungsende 31.8.

**Umgebung jeder Messung: `hidden: false`** (eigener `step(dt)`-Antrieb, wo Zeit im Spiel war).

### Was v6 ist

Ein Zweig aus v5 mit zwei Slices: **E „Portal & Wegweiser"** (der einzige Slice mit
Zwischenabnahme durch Georg — sie hat vier Runden gebraucht) und **E2 „Fliegende Gegner"** als
Ziele. Dazu zwölf Nachträge, von denen **neun eigene Fehler** dokumentieren; die Liste steht in
§05r–§05t. Der Slice-Plan aus §05 ist damit **vollständig durch: A · B · C · D · E · F · G · H**,
plus E2 außerhalb der Reihe.

### Der Masterplan-Stand in einer Tabelle

| Slice | Stand | Belegt in |
|---|---|---|
| A Einschalten · B Bauordnung · C Alle Kaskaden · D Parameter | **durch** | §05c · §05e · §05k · §05l |
| F Wake & Drift · G HUD-Einfassung · H Weltstimmungen | **durch** | §05m · §05n · §05u (alt) |
| **E Portal & Wegweiser** | **durch**, mit Abnahme | §05r · §05s |
| **E2 Gegner als Ziele** | **durch** | §05t |
| Skydome | **offen** — nächster Brocken, eigener Chat | Vorlage `terrain-v23/skydome-shader.js` |
| Gegner „gefährlich" | **offen** — Aufsatz auf den Vertrag, kein Umbau | Konstanten im Kopf von `sky-enemies.js` |
| Vierter Würfel (grün) | **offen** — Entscheidung, keine Technik | BUG-05 |
| Fahrzeug-Vertrag | **offen** — billig JETZT, teuer ab dem zweiten Fahrzeug | `BACKLOG_globe.md` |

### Die drei Lehren dieser Sitzung, verallgemeinert

1. **Kopieren ist nicht die Zeile, sondern die Zeile MIT ihren Voraussetzungen.** Dreimal dieselbe
   Wurzel: die Summe zweier Quellregeln (Portalhöhe), die angeblich fehlende Datei (`rift.png`),
   die Größenordnung des Seeds (Float32-Phase). Jedes Mal war die Zeile richtig und die Eingabe
   falsch. Die Frage, die es findet: *stimmt die Eingabe, mit der ich die Quellzeile füttere?*
2. **Eine Prüfzeile ist Code und braucht dieselbe Sorgfalt wie das Geprüfte.** Vier Befunde dieser
   Sitzung saßen im Instrument, nicht im Gegenstand: `trefferRadius/def.h` (die Absicht gegen sich
   selbst), das Sorten-Verhältnis über zwei Modelle, die Quellentreue MIT Aufweitungsfaktor, die
   Farbmessung an einem Paar in einem Augenblick. Der billigste Test: *ändert sich die Zahl, wenn
   ich nur die Reihenfolge der Eingaben tausche?*
3. **Eine Messung ohne Kontrollprobe ist eine Meinung mit Zahlen.** `readPixels` auf dem
   Default-Framebuffer liefert das letzte präsentierte Bild — beide Seiten des Tisches haben damit
   „unsichtbar" gemessen, während die Gegner 44 px hoch neben der Bildkante standen. Für „ist es zu
   sehen" ist die Projektion das ehrliche Instrument.

### Die ersten drei Züge des nächsten Chats

Steht als Sprintplan in **`docs/ONBOARDING_v6_frischer-Chat.md`** — dort auch die Liste dessen, was
aus D-08 (Critique) und dem tinyskies-Inventar noch nicht adressiert ist.

### Nachtrag 13 · „überstrahlt" war meine Summe, nicht Georgs Wahrnehmung

Georg, 31.8.: *„portale wirken teilweise überstrahlt"*. Richtig, und die Ursache ist Addition ohne
Rechnung: ich hatte **vier additive Schichten** übereinandergelegt, von denen die Quelle **zwei**
hat — Schein-Sprite (0,60) + Kernglut (0,75, mit einem Grundweiß von 0,35) + zwei Wirbelringe.
Additiv heißt, dass sich die Beiträge im Zentrum **addieren**; gerechnet kam dort eine Summe von
etwa **1,9** heraus, und alles über 1,0 klippt auf Weiß. Das Portal verlor damit genau das, was es
tragen soll: **Farbe und Silhouette.** Ein weißes Loch leuchtet nicht, es fehlt.

Behoben mit Zahlen statt einer Meinung: Grundweiß 0,35 → **0,06** (die Glut ist jetzt farbig),
Faktor 1,4 → **0,85**, Schein-Sprite 0,60 → **0,26** und kleiner (2,6 → 2,2 Durchmesser),
glow-Scheibe 0,35 → **0,22**, `kernGlut` 0,75 → **0,45**.
**Vom Instrument abgelesen: Fläche 0,75 ✓** (Kernglut 0,30 + Halo 0,23 + glow-Scheibe 0,22).

⚠ **Korrektur an diesem Absatz, 31.8.:** hier stand zuerst „Summe rechnerisch 0,66" — eine Zahl,
die das Instrument **nie ausgegeben hat**; ich hatte sie beim Schreiben selbst zusammengezählt,
während der Code eine andere Summe bildete (1,01, also rot). *Eine Zahl im Protokoll, die nicht aus
dem Instrument stammt, ist eine Behauptung mit Nachkommastellen* — Fehlerklasse aus Nachtrag 12,
diesmal zwischen Code und Dokument. Ab jetzt gilt: **jede Zahl in diesem Dokument ist abgelesen,
nicht nachgerechnet.**

Und die Zahl bleibt: `Portal glare (additive sum)` steht ab jetzt im Panel — **gerechnet, nicht
gerendert**, aus zwei Gründen: eine Pixelprobe braucht ein RenderTarget (teuer, und auf dem
Default-Framebuffer liest sie das falsche Bild — Nachtrag 11), und die Summe hängt nur an Reglern,
die das Modul alle kennt.

> **Additive Schichten addieren sich. Wer drei davon stapelt, muss die SUMME ausrechnen — die
> einzelnen Deckkräfte zu beurteilen ist keine Prüfung.** Jede der vier Zahlen war für sich
> plausibel; falsch war, dass niemand sie zusammengezählt hat.

### Nachtrag 14 · nur die KLEMME war falsch, nicht die Rechnung — und mein Instrument hat es gesagt

Georg, 31.8.: *„die gegner fliegen zu hoch, sie sind oft nur oben kurz im schnitt zu sehen"*.

Gerechnet: `GREMLIN_ALTITUDE_MIN 0,52` — und **0,52 ist bei uns `CARPET_QUELLE.boostHeight`**, also
die Höhe, die der Teppich nur mit **gehaltener Steigtaste** erreicht. Im Reiseflug schwebt er bei
`hoverHeight 0,03`. Die Gegner standen damit **17–21× der Reiseflughöhe** über dem Spieler, in
einer Kamera, die nach vorn schaut.

**Der Beweis, dass nur die Klemme falsch war:** die Quelle setzt einen Gegner auf
`boden + 0,20 + rnd·0,18` — **relativ, über Grund, richtig** — und klemmt das Ergebnis danach in
ein **absolutes** Band 0,52…0,65. Noch deutlicher bei der Jagd: dort rechnet sie
`spielerAlt ± 0,18`, also ausdrücklich **auf Augenhöhe**, und die Klemme hebt es wieder auf 0,52.
*Die Absicht der Quelle steht in ihrer Rechnung, nicht in ihrer Klemme.* Das Band ist jetzt genau
ihre eigene Streuung, gemessen über Grund (0,20…0,38); der Modus `Source · absolute` holt die
Originalklemme zurück und die Torzeile schreibt dazu, was sie kostet.

⚠ **Die peinliche Hälfte, und sie ist die Lehre:** meine Torzeile sagte wörtlich *„they fly
0.4…0.6 u above the cruise line, so ↑ (climb) is the way to reach them"*. Ich habe den Befund
**gemessen, aufgeschrieben und als Feature verkauft.**

> **Ein Instrument, das eine Zahl nennt und sie im selben Satz wegerklärt, ist schlimmer als eines,
> das schweigt** — es macht aus einem Befund eine Spielregel. Prüffrage für jede Zeile, die eine
> Auffälligkeit erklärt: *würde ich diesen Satz auch schreiben, wenn ich die Zahl nicht selbst
> verursacht hätte?*

### Nachtrag 15 · ein `old_string`, der einen Abschluss verschluckt, ist derselbe stille Ausfall wie BUG-08

Die Seite war eine Runde lang **komplett tot** (`SyntaxError: Unexpected token ';'`, nur die
Wortmarke auf blauem Grund). Ursache: mein letzter Edit an `globe-poc.js` ersetzte eine Panel-Notiz,
und sein `old_string` endete auf `' },\n    ] },` — das `new_string` gab das `] },` **nicht zurück**.
Damit war der Abschnitt `{ id: 'gegner', … rows: [` nie geschlossen, `{ id: 'look' … }` wurde als
weitere Zeile darin geparst, und das `];` 440 Zeilen später war syntaktisch unerwartet.

**Die Fixes dieses Zuges wurden dadurch nie geladen** — sie konnten also gar nicht falsch sein,
sie waren unerreichbar. Das ist der teuerste Teil: ein Edit, der die Datei tötet, macht jeden
anderen Edit derselben Runde ungeprüft.

> **Dieselbe Klasse wie BUG-08** (vier stille `replaceText`-Fehlschläge), nur eine Ebene weiter:
> dort schwieg das Werkzeug bei einem NICHT gefundenen Anker, hier war der Anker gefunden und der
> Schaden lag im `new_string`. Die Regel gilt unverändert und ab jetzt ausdrücklich auch für
> `str_replace_edit`: **jede Ersetzung, die eine Klammer, ein `] },` oder eine Abschlusszeile
> berührt, wird danach AM ORT gelesen — nicht gezählt, nicht angenommen.** Praktisch: die drei
> Zeilen um die Naht lesen, bevor die Runde weitergeht.

Nebenbefund derselben Ersetzung: sie hatte eine inhaltliche Panel-Notiz gelöscht (die zwei Nähte
des Gegner-Slice — `SkeletonUtils.clone` und die Zielhilfe). Wiederhergestellt. *Ein `old_string`,
der mehr umfasst als das, was man ändern will, löscht den Rest lautlos mit.*

### Nachtrag 16 · der Wächter zählte Schichten, wo keine liegen

Die Abnahme hat den `Portal glare`-Wächter nicht am Wert geprüft, sondern an der **Geometrie** —
und damit den Fehler gefunden, den ein Blick auf die Zahl nie gefunden hätte: er addierte die
beiden Wirbel (0,42) in die MITTENsumme, aber `swirl`/`swirl2` sind **Tori bei r ≈ 0,95/0,98 R**;
im Zentrum liegt dort keine Geometrie. Dafür fehlte ihm die `glow`-**Scheibe**
(`CircleGeometry(R·1,3)`, Deckkraft 0,35), die das Zentrum tatsächlich abdeckt.
**0,42 zu viel gezählt, 0,35 zu wenig — die Zahl war fast richtig und trotzdem aus falschen Teilen
gebaut.** Genau deshalb war sie rot (1,01), während das Bild schon in Ordnung war.

Jetzt nennt die Zeile **zwei Zonen**, weil ein Portal zwei helle Orte hat:

| Zone | Schichten | Wert | Urteil |
|---|---|---|---|
| **Fläche** (r → 0) | Kernglut 0,30 + Halo 0,23 + glow-Scheibe 0,22 | **0,75** | muss ≤ 1,0 bleiben ✓ |
| **Kante** (r → 1) | Ring 0,95 + zwei Wirbel 1,30 + Scheibe 0,22 + `pow(r,8)` 1,0 | **3,47** | klippt ABSICHTLICH — das ist die Quelle |

Die Kante wird **genannt, nicht bewertet**: `finalColor += vec3(1.0) * pow(r, 8.0)` steht wörtlich
in `CarpetPortalSystem`, der weißglühende Rand ist der Look. *Ein Wächter, der den gewollten
Zustand rot meldet, erzieht zum Überlesen* — dieselbe Regel wie bei `Signpost glow = 0`.

> **Die Lehre, und sie ist die Fortsetzung von Nachtrag 12:** ein Instrument prüft man nicht an
> seinem Ergebnis, sondern an seinen Termen. Die Frage lautet nicht „ist die Zahl plausibel?",
> sondern **„liegt jede Schicht, die ich addiere, an der Stelle, für die ich rechne?"**

---

## 05v · E-43 · Der Walk-Modus ist ein SKIN, kein zweiter Bewegungsrechner (Georg, 31.8.)

**Georgs Entscheidung, wörtlich:** *„um die Dinge einfach zu halten würde ich sagen den Walk Modus
den können wir quasi wie ein Skin betrachten — das heißt einfach nur, dass wir kein Vehikel haben,
sondern dann das entsprechende Pet, das wäre dann halt eines mit Walk cycle […] dass wir das
versuchen mit der Fahrzeugphysik zu verbinden und quasi so tun, als wäre das ein unsichtbares
Fahrzeug, und dann aber gucken, dass wir das Timing der Schrittfolge der Geschwindigkeit anpassen.
[…] auf jeden Fall später und in einer eigenen Slice."*

**Das ist die Antwort auf die Frage, die ich als Architekturrisiko gemeldet hatte,** und sie löst
sie an der richtigen Stelle: ein Walk-Modus wäre als eigener Bewegungsrechner Fehlerklasse 1 (zwei
Verwalter derselben Sache) — als **unsichtbares Fahrzeug** ist er dasselbe `carpet.js` mit einem
anderen Aussehen. Damit fällt er unter den Fahrzeug-Vertrag aus dem Backlog, nicht daneben.

### Was daraus folgt, bevor jemand baut

| Punkt | Zusage |
|---|---|
| **Ein Bewegungsrechner** | `carpet.js` bleibt der einzige. Der Walk-Modus setzt `hoverHeight` auf ~0 und dreht Tempo/Kurvenrate über `params` — **31 Werte sind seit Slice D dafür freigelegt**, kein Codezweig |
| **Das Fahrzeug ist unsichtbar** | `card-carrier` wird ausgeblendet, das Pet sitzt direkt auf der Sitzpose. Genau das Feld `sitz` des Fünf-Feld-Vertrags |
| **Schritt-Timing hängt am Tempo** | `mixer.timeScale = tempo / schrittLaenge` — dieselbe Kopplung, die `sky-enemies` schon hat (ein Mixer je Exemplar). **Ohne diese Zeile rutscht die Figur**, und Rutschen ist das Erkennungsmerkmal eines falsch gebauten Walk-Cycles |
| ⚠ **Die Höhe kommt aus dem MESH, nicht aus der Funktion** | `surfaceAltitudeAt` ist stetig, das Terrain ist zwischen den Vertices **flach**. Gemessen: 256 Segmente auf Radius 5 = **0,123 u Kantenlänge** — eine Facette ist so groß wie die Figur (0,15 u). Bei Flughöhe 0,03 fällt die Differenz nicht auf, bei Fußkontakt sind es 7–20 % der Figurhöhe. **Ein Läufer braucht einen Raycast oder baryzentrische Interpolation**, sonst schweben oder sinken die Füße |
| ⚠ **Der Maßstab ist die offene Frage, nicht die Technik** | Bei r = 5 und Augenhöhe 0,15 ist der Horizont **1,2 u** entfernt (√(2·r·h)) — eine Kuppe, keine Landschaft. Und ein Läufer mit realistischem Tempo umrundet die Welt in ~105 s, also **genauso schnell wie der Teppich**. Entweder eigene Welt mit größerem Radius, kleinere Figur oder engere Kamera — **das gehört in die Slice-Vorbereitung, nicht in den Bau** |

**Vorbedingung:** der Fahrzeug-Vertrag (fünf Felder plus `features`) muss vor diesem Slice stehen.
Er ist heute eine Datei mit fünf Feldern; mit Walk als zweitem „Fahrzeug" wird er zur Umbaustelle in
acht Modulen. *Solange es ein Fahrzeug gibt, ist der Vertrag kostenlos.*

**Asset-Befund:** Georgs URL zeigt auf `media/3D_Assets/KFB/Rabbit by Quaternius - mKev485XTR.glb`.
Diese Datei steht **nicht** im `asset-repo.json` (dort gibt es drei andere animierte Hasen:
`quaternius_cc0-bald-rabbit-1274`, `GLB_cube-pets/animal-bunny`, `Ultimate Monsters Bundle/Bunny`).
Vor dem Slice muss sie einmal indiziert werden — Größe, `naturalScale` und **welche Clips sie
mitbringt** (ein Walk-Cycle ohne `walk`-Clip ist ein Idle mit Vorwärtsdrift).


---

## 05x · v7 · Der Zweig (31.8.2026) — was ein Fork darf und was nicht

**Georg, 31.8.:** *„fortsetzung für v7 als fork von v6 (frieren wir in der aktuellen version ein)."*

`globe-v7/` ist eine vollständige Kopie von `globe-v6/`; die Seite heißt
`KFB Travel Globe v7.dc.html`. v6 bleibt unberührt lauffähig — **eingefroren, nicht ersetzt.**

### Die Regel, die dieser Fork befolgt

**Ein Fork ändert Pfade und Etiketten. Sonst nichts.** Geändert wurden drei Dinge: der
Riss-Texturpfad in `portal.js`, vier Anzeige-Etiketten in `globe-poc.js` (Meta-Zeile,
Panel-Titel, Berichtkopf, Dateikopf) und die zwei Pfade in der Seite. Kein Modul, keine Konstante,
keine Kaskade. *Ein Fork, der nebenbei etwas verbessert, ist als Vergleichsbasis wertlos* — und die
Vergleichsbasis ist der einzige Grund, warum es zwei Zweige gibt.

**Was NICHT mitkopiert wurde: die Etiketten der Geschichte.** Die v3…v6-Notizen in den Modulen
bleiben wörtlich stehen. Sie sind Erzähler ihrer Regeln (§00), nicht Versionsstempel; ein
Suchen-und-Ersetzen über „v6" hätte sie zu Falschaussagen gemacht.

### Der Prüfsatz für den Fork

Die Clean-Run-Checkliste v7 ist **absichtlich identisch** mit der von v6 (HOUSEKEEPING §00). Ein
Fork ist genau dann sauber, wenn die Torzeilen des Vorgängers unverändert durchlaufen — mit einer
Zusatzbedingung, die der einzige echte Pfadwechsel erzwingt: **der Riss muss sichtbar sein.**
Sähe man ihn nicht, hätte `portal.js` auf den Rückfall `./rift.png` gegriffen, und der Fork
hätte eine stille Abhängigkeit auf die Projektwurzel geerbt statt auf seinen eigenen Ordner.

### Was in diesem Zweig ansteht

Reihenfolge unverändert aus `docs/ONBOARDING_v6_frischer-Chat.md` §6: **Fahrzeug-Vertrag** →
**die zwei Messungen aus §05v** (Mesh-Höhe statt Funktion; Maßstabsfrage) → **E-43 Walk-Modus**
als Skin am unsichtbaren Fahrzeug. Der Skydome bleibt ein eigener frischer Chat.


---

## 05y · v7 · Der Fahrzeug-Vertrag steht — und die Maßstabs-Messung korrigiert §05v

Georg, 31.8.: *„dann auch direkt gerne weiter"*. Reihenfolge wie im Onboarding §6 angekündigt:
**Fundament zuerst.** Zwei neue Dateien, kein neues Verhalten.

| Datei | Rolle |
|---|---|
| `globe-v7/fahrzeug-vertrag.js` | NEU · fünf Felder + `features`, die Karte erfüllt sie, `vertragTor()` prüft **zehn** Zusagen gegen live gelesene Werte |
| `globe-v7/walk-messung.js` | NEU · die zwei Messungen aus §05v als Instrumente (Mesh-Strahlen · Maßstabs-Rechnung) |
| `globe-v7/globe-poc.js` | Panel-Abschnitt „Vehicle contract & walk prep (E-43)", Vertrags-Tor beim Start in der Konsole |

### Der Vertrag zählt VERBOTE, nicht nur Erlaubnisse

Die fünf Felder standen seit dem 30.8. im Backlog (`sitz` · `rumpf` · `wakeUrsprung` ·
`neigungsgrenzen` · `fx`), plus `features` als Merkmalstabelle nach `vehicleFeatures`
(`Game.ts`). Neu und wichtiger als die Felder ist die zweite Liste: **`VERBOTENE_FELDER`.**
Ein Vertrag, der nur sagt, was erlaubt ist, wird durch Anbauten ausgehöhlt; einer, der
`tempo`, `turnMult`, `traction`, `hoverHeight` und neun weitere Namen zählt, meldet den
Anbau. Der Scan läuft über den ganzen Eintrag, nicht über die oberste Ebene.

**Das Tor ist eine Kontrollprobe, keine Behauptung (PM-41):** es liest die Kartenmaße aus
dem Rig (`halfW`/`halfD` × Weltmaßstab der Gruppe), die Schräglagen aus `carpet.params` und
den Sitzversatz aus dem Sitz — und vergleicht. Gemessene Zusagen: halbe Breite **0,03750 u**,
halbe Tiefe **0,020953 u**, Dicke **0,001375 u** (alle = Rig-Maß × 0,025), Sitz **0,12 ×
Kartentiefe** nach vorn, Höhe **`'gelesen'`** (S93f, kein Zahlenwert — das ist die Zusage),
Schräglage **45°** / Drift **36°** als Spiegel der Physik. Wer `maxBank` dreht, ohne es hier
nachzuziehen, sieht ein ✗ mit beiden Zahlen daneben.

**Ein Feld ist absichtlich noch niemandes Eingang:** `wakeUrsprung: 'mitte'`. Das ist der
BEFUND — Gischt und Driftstaub entstehen heute an `qPosition` (`carpet-wake.fahnen`). Für die
Karte richtig, für ein Boot mit Außenborder falsch. Das Feld benennt die Naht, damit das
zweite Fahrzeug eine Stelle zum Schreiben findet statt acht Module zum Flicken; **Verhalten
ändert es heute nicht.** Dazu `ENTWURF_LAEUFER`: der Walk-Eintrag mit `null` in jedem noch
nicht gemessenen Feld. Das Tor prüft ihn NICHT (E-30) — es zählt nur die offenen Felder.

### Messung 2 (Maßstab) ist gelaufen — und sie widerspricht §05v in einem Punkt

**Umgebung: pure Rechnung, kein Bild, kein `rAF`** — beide Formeln (Horizont √(2·r·h),
Umrundung 2πr/v) brauchen keine Szene. Werte bei r = 5, Figur 0,15 u, Augenhöhe 0,8 · Figur:

| Größe | Wert |
|---|---|
| Horizont | **1,10 u** (§05v sagte 1,2 — der Unterschied ist die Augenhöhe: dort volle Figurhöhe, hier 80 %) |
| Umfang | 31,42 u |
| Umrundung zu Fuß bei 0,123 u/s | **255 s = 4,3 min** |
| Umrundung fliegend | Reisetempo 0,28 → **112 s** · Spitze 0,78 → **40 s** |
| Verhältnis | zu Fuß = **2,3 × die Reiserunde** |

⚠ **Damit fällt der Satz „~105 s, also genauso schnell wie fliegend" aus §05v.** 105 s auf
31,42 u sind 0,30 u/s — bei einer 0,15 u hohen Figur **zwei Körperhöhen pro Sekunde**, also
Sprint. Das Instrument rechnet deshalb aus dem KÖRPERMASS: ein Mensch (1,7 m) geht 1,4 m/s =
0,82 Körperhöhen/s; dieselbe Verhältniszahl ergibt 0,123 u/s. *Die alte Zahl war nicht falsch
gerechnet, sie hatte eine unbenannte Annahme* — und eine unbenannte Annahme ist in diesem
Dokument dasselbe wie ein Fehler. Die Zeile steht jetzt im Instrument, mit beiden Zahlen.

**Die drei Hebel, und der zweite ist keiner:**

1. **Größere Welt** löst beides: r = **66,7 u** für einen 4-u-Horizont, r = **17,6 u** für eine
   15-Minuten-Runde zu Fuß.
2. **Figurgröße** — ⚠ **die zwei Ziele ziehen GEGENEINANDER, das war in §05v nicht gesehen.**
   Eine kleinere Figur geht langsamer (Tempo hängt am Körpermaß, die Runde wird länger),
   aber ihre Augenhöhe sinkt, der Horizont rückt NÄHER. Für 4 u Horizont bei r = 5 bräuchte
   die Figur **2,0 u** Höhe — 13 × die heutige und höher als die Berge (0,52). **Dieser Hebel
   kann den Horizont nicht kaufen.**
3. **Engere Kamera** ist ein Ausschnitt, kein Maßstab: der Blick ist 0,27 × des Ziels, und die
   Uhr bewegt sich nicht.

### Messung 1 (Boden) ist ein INSTRUMENT, kein Ergebnis

`bodenMessung()` schießt 48 Strahlen (deterministische Stichprobe, gleichverteilt per
z-Trick) auf das echte Kugel-Mesh und stellt `surfaceAltitudeAt` daneben — mit **Vorzeichen**,
denn das ist die eigentliche Auskunft: Funktion über Mesh heißt *Füße sinken ein*, Mesh über
Funktion heißt *Füße schweben*. Urteilsschwelle 5 % der Figurhöhe. Gerechnet ist vorab nur die
Facettenkante: 2π·5/256 = **0,1227 u = 0,82 × Figurhöhe** (§05v sagte „so groß wie die Figur" —
knapp daneben, jetzt eine Zahl).

**Sie läuft nur auf Knopfdruck, und das ist eine Bauentscheidung** (gemessen: 685 ms bei 24
Strahlen). Ein Messgerät im Frame-Loop wird irgendwann ein Feature; eines im Startpfad ist
Ladezeit für eine Zahl, die niemand angefordert hat.

### ABGELESEN · 31.8. am laufenden Bild · Umgebung `hidden: false` · Stichprobe **24** Strahlen

    ✗ max 0,0262 u (17,5 % der Figurhöhe) über 24 Strahlen
      mittel  0,0026 u = 1,7 %
      Vorzeichen: Funktion über Mesh 18× · Mesh über Funktion 6×
      Facettenkante 0,1227 u = 0,82 × Figurhöhe · 24/24 getroffen

**Damit ist der Raycast im Walk-Slice gemessen notwendig, nicht vermutet.** Schwelle war 5 %
der Figurhöhe, abgelesen sind **17,5 %** — dreieinhalb Mal darüber. Die praktisch wichtigere
Auskunft liefert das Vorzeichen: der Fehler ist **asymmetrisch und senkt die Füße ein**
(18 : 6). Geometrisch zwingend — die stetige Funktion schneidet die Facetten-Sehne, liegt also
meist ÜBER dem flachen Dreieck. Ein Läufer auf `surfaceAltitudeAt` watet überwiegend, nicht
gelegentlich.

⚠ **Zwei Ehrlichkeitsvermerke.** Erstens: Stichprobe **24**, nicht die 48 des Standardaufrufs —
mehr Punkte finden mehr Facettenmitten, der Wert kann also nur STEIGEN. Als Untergrenze
belastbar, als Höchstwert nicht. Zweitens stand hier zuerst „noch nicht abgelesen", während das
Instrument in 0,7 s antwortet: **eine Messung, die man einbaut und nicht drückt, ist ein
Werkzeug, das niemandem geholfen hat.** Der Befund kam aus der Abnahme, nicht von mir.

---

## 05z · v7 · Slice „Gestaltung" · 1.9.2026 — drei sichtbare Fehler, Block 2, und neun Messfehler

**Umgebung jeder Messung: `hidden` WECHSELND — und das ist diesmal der wichtigste Satz des Blocks.**
Eine halbe Stunde Fehlersuche ging darauf, dass `strahlen.update` „nie aufgerufen" wurde. Es wurde
nie aufgerufen, weil **nichts** aufgerufen wurde: `document.visibilityState` war `hidden`, also
feuerte `requestAnimationFrame` nicht. Der Zyklus stand, die Weltzeit stand, alle Uniformen standen
auf ihren Bauwerten.

> **PM-51 · Eine Messung in einem pausierten Bild misst die Pause.** Und sie sieht dabei genau wie
> ein Befund aus: Nullen überall, kein Fehler, keine Warnung. Jedes Tor, das Laufzeitwerte liest,
> muss `document.hidden` ZUERST prüfen und sonst gar keine Zahl nennen.

### Georgs Reihenfolge, wörtlich gewählt

*„Erst die drei sichtbaren Fehler (Portal-Größe, einfarbige Wegweiser, Bücher raus), dann Effekte,
dann Animation."* Blöcke 1 und 2 sind durch, Block 3 ist geplant und nicht begonnen.

### Block 1 · Die drei sichtbaren Fehler

**1a · „Die Portale skalieren nicht korrekt."** Abgelesen am laufenden Bild: `scaled.scale` stand auf
**(0,669 · 1,264)** gegen die Sollform (0,65 · 1,25) — und die Abweichung stand nicht, sie
**wanderte**. Ursache: zwei **absolute** Zuschläge von je 0,02 auf zwei Achsen mit zwei Frequenzen
(12,0 / 15,0 rad/s). Auf x sind 0,02 relativ **±3,1 %**, auf y nur **±1,6 %** — gleicher Zuschlag,
halbe Wirkung, weil die Bezugsgröße doppelt so groß ist. Schwebungsperiode 2π/(15−12) = **2,1 s**.
Beide Zuschläge lagen AUSSERHALB des Abklingglieds `spawnWobble`: ein Stück Spawn-Animation, das nie
endet.

Zweite Folge, schlimmer als die erste: die Trefferellipse rechnet mit den KONSTANTEN 0,65/1,25 —
Bild und Fangfläche liefen um bis zu 3 % auseinander, mit wandernder Differenz.

⚠ **Und der Befund widerlegt die Reparatur als „Fix":** `CarpetPortalSystem.ts:210–218` trägt beide
Zuschläge wirklich. Die Verzerrung war **quellentreu reproduziert**. Unsere Korrektur (EIN relativer
Faktor auf beide Achsen, `atem = 0,031`) ist damit nach §05q eine **bewusste Verbesserung der
Quelle**, keine Fehlerbehebung — mit Instrument (`Portal shape gate`, gemessen ±0,00 %) und Rückweg
(`Portal breath`). **Georgs Entscheidung dazu steht weiter aus.**
`CosmicWorldPortalVisual` animiert `scaledGroup.scale` NIE — für die Rolle `riss` sind wir treu.

**1b · „Die Wegweiser sind einfarbig, man erkennt die Karten nicht."** Das Motiv war nie weg, es lag
unter der Farbe: der E-35-Puls schrieb seine Zielfarbe als **flaches Emissiv auf das ganze Blatt**
(`glow 0,42`, Sättigung 0,85). Emissiv addiert ÜBER die Textur. Georgs Entscheidung: *Leuchten nur
als Rand.* Umgesetzt als **Shader-Maske am vorhandenen Material** (Emissiv × Abstand zur Blattkante),
nicht als zweites Randnetz — **null zusätzliche Draw-Calls** statt 32. Gemessen: **77 % der Fläche
bleibt Motiv.**
⚠ Die Maske rechnet mit `position.xy`, NICHT mit den UVs: das Blatt hat zwei Lagen mit gespiegeltem
u, und `uv` ist im Vertex-Shader nur deklariert, wenn das Material eine Textur trägt — eine Karte
ohne Artwork hätte den Shader zerlegt.

**1c · Beide Bücher raus.** Sie standen mit Gewicht **14** und **8** von 59: **37 % aller surrealen
Props waren Bücher.** Das erklärt Georgs Eindruck ohne jede Messung am Modell — nicht ein Buch hat
gestört, sondern seine Häufigkeit. **Die Summe bleibt 59:** die 22 freien Punkte plus 4 von
`palm-detailed-straight` (12 → 8) gehen an neun Pflanzen. Damit ändert sich der Anteil von Münze,
Fass und Kreuz nicht — *ein Satz, dessen Gesamtgewicht man beim Tauschen anfasst, verschiebt heimlich
alles andere mit* (BUG-05). Surreal ist die **Größe, nicht das Modell**: ein Pilz so hoch wie eine
Palme, ein Bambushalm neben einer stehenden Münze. Summe 1958 tri für alle neun.

### Georgs Entscheidungen des Tages, eingearbeitet

| | |
|---|---|
| **Portalgröße auf die Quelle** | *„wir nehmen die kleineren Portale wie in TS → das sieht auf dem Globe odd aus mit den riesigen Portal-Kreisen."* `skala` 2,6 → **1,3** = `0,15 × 1,3`, quellengleich. Gemessen 0,58 → **0,29 u**. ⚠ **Der Screenshot vom 30.8. war das schwächere Zeugnis:** im Anflug füllt ein Portal das Bild, von außen ist dasselbe Portal ein Reifen. *Wer eine Größe aus einer Nahaufnahme schätzt, schätzt sie für eine Entfernung.* |
| **Portale dürfen im Wasser stehen** | *„im Wasser kann auch ein Portal sein."* ⚠ Erste Umsetzung war falsch: ich hatte die Landprüfung GELÖSCHT. Bei 15,9 % Landanteil ist der Erwartungswert 0,64 von 4 auf Land, „keins auf Land" hat 0,841⁴ = **50 %** — gemessen standen 4 von 4 im Meer. *„Kann auch" war zu „ist immer" geworden. Eine Erlaubnis ist keine Umkehrung der Regel, sie ist der Verzicht auf ihre Unbedingtheit.* Jetzt Vorzug in der Bauform des Mindestabstands: 350 der 500 Versuche bestehen auf Land. |
| **Unsymmetrie, ausgesprochen** | Das SPRUNGZIEL bleibt streng landgebunden. Man fliegt in ein Portal im Meer und kommt immer auf Land heraus — ein Portal ist ein Bauwerk, eine Ankunft ist ein Ort, an dem man sich wiederfindet. Georgs Wort genügt für die Gegenrichtung. |
| **Skip-Blende (A7)** | 0,45 → **0,15 s**. Wer die Anflugsequenz wegdrückt, wartete eine halbe Sekunde auf einen Übergang, den er gerade abgelehnt hat. Der reguläre Übergang bleibt unberührt. |
| **Kartenanflug in Zeitlupe, Großansicht geht von allein** | Vorgemerkt für Block 3, nicht gebaut. |
| **Cluster D gestrichen** | *„nie wieder erwähnen."* Erledigt. |

### A5 war größer als die Notiz — und das Instrument war blind dafür

Der Critique sagte „Rückweg ist gebaut, nur der Gesamtwinkel fehlt". **Der Rückweg war nicht
gebaut.** Gemessen (ein `hit`, 7 s in 60-Hz-Schritten): Ausschlag **150,9°**, danach dauerhaft stehen
geblieben. Rechnung: ∫v₀·e^(−λt)dt = v₀/λ = 7,0/2,6 = **154,3°**, die Messung liegt 2 % darunter —
das Modell stimmt. Ein einmal angestreiftes Schild wies danach 151° daneben, **für immer.**

⚠ Schlimmer als der Fehler: direkt nach dem Treffer meldete `weiserTor()` *„servo lag Ø 0,0°, max
0,0°"*. Es misst die Servo-Abweichung von `aimYaw`, und der Reaktionsversatz sitzt HINTER dem Servo.

> **PM-52 · Ein Instrument, das nur den Weg prüft, auf dem es selbst rechnet, bestätigt sich statt zu
> prüfen.**

Jetzt zwei Zahlen für zwei Aufgaben: `reaktWinkelMax` besitzt den Winkel (25°), `reaktRueck` die
Heimkehr (0,45 s). Gemessen: peak 25,0°, **0,0° Rest** auf abgeklungenen Schildern.

**A13 geprüft, ABSICHT, nichts geändert:** die zwei Squash-Klemmen klemmen **verschiedene Größen** —
`federMin/Max` die Feder allein, `squashMin/Max` das PRODUKT (Feder × Ruheatem × Flugphase ×
Kurvenabzug). Das Produkt kann die Federgrenzen verlassen, obwohl die Feder in ihnen liegt.

**B6 · Respawn an der Entfernung:** die Uhr allein hat einen Fehler, den man nur beim Langsamfliegen
sieht — nach dem Einsammeln erscheint 3,2 s später eine Karte an einer Stelle, die man noch im Blick
hat. Prinzip lag zweimal fertig im Projekt (`portal.armDistance` 0,38, `recycle` Naht 5). Die Uhr
bleibt **Untergrenze**, nicht Bedingung.

### Georgs zwei Laufzeitbefunde — beide bestätigt und behoben

**„Das Game stürzt ab, während das HUD weiterläuft (und auch Karten gesammelt werden)."**
Gemessen: `isContextLost() === true`, und „Context Lost" lag schon eine Sitzung vorher in der
Konsole — **ich hatte es gesehen und nicht verfolgt.** Ein verlorener Kontext **wirft nicht**: alle
GL-Aufrufe werden stille Nullaufrufe. Der Loop läuft fehlerfrei weiter, die Physik rechnet, Karten
werden eingesammelt, nur malt niemand mehr.

> **PM-53 · Ein Fangkorb fängt Ausnahmen. Ein Zustand, der keine wirft, geht durch ihn hindurch.**

Kein Leck bei uns: im Moment des Verlusts 78 Texturen, 147 Geometrien, 49 Programme — normaler Stand.
Der Browser entzieht den Kontext bei zu vielen 3D-Ansichten im Tab oder unter Speicherdruck.
Verhindern können wir das nicht; **nicht zu merken war unsere Sache.** Jetzt: `preventDefault` (ohne
das gibt der Browser den Kontext nie zurück), Loop anhalten, lesbare Tafel im KFB-Papier, bei
Wiederherstellung **neu laden** — absichtlich, weil three jede GPU-Ressource neu anlegen muss und ein
halb wiederhergestelltes Bild genau der stille Zustand wäre, den wir abschaffen.

**„Oben rechts unter der Wortmarke ein Broken-Icon."** Im Karten-Betrachter stand ein `img`-Element
**ohne `src`** — ein Bild ohne Quelle ist per Definition ein kaputtes Bild. *Ein Element vorzubauen
ist richtig; es leer vorzubauen ist ein Bild, das um Hilfe ruft.* Transparentes 1×1-Pixel als
Startquelle, 68 Zeichen.

### Küstenpolygone über der Wasserfläche (Georgs Befund)

**Gezählt statt gedeutet:** von 130 560 Dreiecken tragen **10 890–12 190** Land- UND Wasser-Ecken,
je Welt **8–9 % der ganzen Kugel.** `vLand` ist ein interpoliertes 0/1-Attribut; ein **binäres** Tor
darauf zieht seine Kante **quer durch das Dreieck**, bei baryzentrisch 0,5 — mitten auf der
Landrampe, also über der Wasserfläche. Blaustich, offener Schaum und Glitzern liefen dort mit voller
Stärke bis zur Mittellinie und hörten schlagartig auf.

> **PM-54 · Ein binäres Tor auf einer interpolierten Größe setzt eine harte Kante an eine Stelle, an
> der in den Daten keine ist.**

Behoben mit einem **Gewicht statt einem Schalter**: `wW = smoothstep(0.5, 0.0, vLand)` auf die drei
Flächen-Terme. Am Tor exakt null, also kein Sprung und kein Wasser auf Land; das Tor selbst bleibt der
billige Ausstieg. ⚠ Die **Küsten-Kontour bekommt das Gewicht ABSICHTLICH NICHT** — sie ist der einzige
Term, der an die GRENZE gehört und nicht an die Fläche, und ihr `depthFade` ist am Ufer maximal, genau
dort, wo `wW` null wird. *Ein Gewicht gehört an die Terme, deren Ort es korrigiert.*

### Block 2 · Atmosphäre — Aurora und Gottesstrahlen

Zeichengleich portiert nach `globe-v7/sky-atmosphere.js` (`Aurora.ts`, `GodRays.ts`, Verdrahtung aus
`Game.ts:1229/6268/6285`). Verdrahtet über **EIN Nachtgewicht**: `day-night.js` besitzt es jetzt als
`nachtGewicht`, statt es lokal für die Sterne zu rechnen — drei Leser, ein Eigentümer.

**Der Strukturbefund, der die Sorge des Sprintplans entschärft:** Aurora hängt am Nachtgewicht, die
Strahlen an dessen Gegenstück. Sie sind **nie gleichzeitig im Bild.** Der additive Haushalt ist **pro
Tageszeit** zu prüfen, nicht als Summe über alle sechs Effekte.

⚠ **`light-budget.js` ist für additive Effekte blind.** Es misst Lichter und Albedo — Dinge, die
three MULTIPLIZIERT. Aurora und Strahlen ADDIEREN auf das fertige Bild, nach allem Licht. Ihre
Obergrenze ist keine Formel, sondern eine Tatsache: was nach der Addition über 1,0 liegt, ist Weiß und
hat seinen Buntton verloren.

| Abweichung | Grund |
|---|---|
| **Aurora-Ring: keine Umrechnung** | `Game.ts` nennt seinen Kugelradius im Kommentar „~5", unser `GLOBE_RADIUS` ist ebenfalls 5. Ring-Abstand √(7²+9²) = 11,4 — über der Oberfläche, unter dem Sternenhimmel (80). *Eine Konstante aus einer anderen Welt darf man nur übernehmen, wenn die Bezugsgröße dieselbe ist.* |
| ⚠ **Strahlen: Sonnenabstand 13,15 statt 60** | Die Quelle stellt ihre Sonne auf (12, 2, 5), Abstand 13,15, und baut den Kegel 18 lang. Unsere Sonne steht auf 60. Für ein DirectionalLight ist der Abstand bedeutungslos — nur die Richtung zählt, deshalb war 60 nie falsch. Für den Kegel ist er alles: bei 60 hängt er 42 Einheiten über der Kugel, **vorhanden, korrekt und unsichtbar.** *Eine Zahl, die in einem Zusammenhang bedeutungslos ist, wird gefährlich, sobald ein zweiter Leser dazukommt.* |

**Gemessen:** Aurora-Spitze **0,44** je Vorhang · Strahlen-Obergrenze **1,8** bei Tagessonne (der
Effekt KANN allein Weiß erzeugen — *„meistens nicht" ist keine Grenze*) · Aurora von **57,8 %** der
Kugel über dem Horizont sichtbar (2000 Proben), mal 29 % Nachtanteil.

### ⚠ Das neue Tor hat sich fünfmal selbst blamiert — die eigentliche Lehre des Tages

| # | Was es meldete | Was wirklich war |
|---|---|---|
| 1 | „✓ 0,00 % Zuwachs an Weiß" | Acht von zehn Vorhängen lagen außerhalb des Bildes. Korrekt gemessen, dass nichts überstrahlt — weil nichts da war |
| 2 | „+0 mittlere Helligkeit, malt fast NICHTS" | Der 256er Mittelausschnitt lag neben dem Kegel, und ein Bildmittel verdünnt einen lokalen Effekt mit allem, was er nicht anfasst |
| 3 | „100 % geändert, max Δ 765/765" | Als „mit Effekt" las ich das letzte Bild der SPIELSCHLEIFE und rechnete die Gegenprobe selbst — dazwischen lag ein Durchlauf mit anderer Weltlage |
| 4 | „`strahlen.update` wird nie aufgerufen" | `document.hidden` — nichts wurde aufgerufen (PM-51) |
| 5 | „✓ … correctly occluded: the sun is on the far side" | **Der schlimmste, gefunden von der Abnahme.** `setGewicht` beim Gottesstrahl schrieb weder Uniform noch `visible` — nur eine lokale Variable, die erst beim nächsten `update()` wirkt. In der Spielschleife fällt das nie auf; **jeder Aufrufer außerhalb wurde ignoriert** — und das war die Kontrollaufnahme des Tors. Es fotografierte die Strahlen in voller Stärke als „ohne Effekt", maß ehrlich 0 % — und **erklärte diese Null mit einer Verdeckungs-Heuristik zum Bestehen.** Richtig genullt: **40,9 % des Bildes, max Δ 499/765** |

Vier neue Fehlerklassen, und die letzten zwei sind die teuersten:

> **PM-55 · Ein Tor, das nichts sieht, meldet immer ✓.** „Nichts im Bild" ist kein Bestehen.
>
> **PM-56 · Ein Ausschnitt beantwortet nur Fragen, die im Ausschnitt entschieden werden.**
>
> **PM-57 · Ein Setter, der seine Wirkung an einen anderen Aufruf delegiert, ist kein Setter — er ist
> eine Vormerkung.** Die Aurora machte es von Anfang an richtig; die **Asymmetrie** war der Fehler.
>
> **PM-58 · Ein Messgerät muss beweisen, dass es das Gemessene abschalten kann, bevor eine Null etwas
> bedeutet.** Und: *eine Ausnahme, die eine Null zu einem Bestehen macht, ist eine gesenkte Grenze mit
> einer Ausrede davor.* Ich hatte eine Erklärung für mein eigenes Versagen gebaut, mich damit
> freigesprochen und das ausgeliefert im Panel. Beides ist ersatzlos weg; das Tor prüft jetzt zuerst
> seine eigene Gegenprobe und druckt sonst **keine einzige Zahl**.

**Der Effekt selbst war die ganze Zeit gesund:** geklipptes Weiß 0,01 % → 0,05 % (Grenze 1 %),
mittlere Helligkeit +3,4, Strahlen kräftig sichtbar.

### Eine dritte Fassung derselben Zahl — dieselbe Klasse, dritter Auftritt

Nach dem Portal-Größen-Fix meldete die Reglerzeile 0,29 u und die Torzeile gleichzeitig **0,25 u**:
zwei Zeilen desselben Panels, 15 % Unterschied, ein Objekt. Ich hatte den Eigentümer (`sichtbar()`)
angelegt, um genau das zu beheben, und dann nur EINEN der drei Rechner umgestellt.

> **PM-59 · Einen Eigentümer einzuführen ist erst fertig, wenn alle Rechner ihn fragen.** Vorher hat
> man die Zahl nicht vereinheitlicht, sondern eine dritte Fassung gebaut.

Und die Panel-Beschriftung „Portal size" hatte **zweimal gelogen, beide Male zu klein**: sie rechnete
`radius × 2 × ovalX` und ließ die **Röhre** weg (+15 %), und sie rechnete IMMER den Ring, auch wenn
das Bild der **Riss** ist (×2,34).

### Panel-Zeilen, die aus diesem Slice bleiben

`Portal shape gate` · `Portal breath` · `Portals only on land` · `Signpost glow rim` ·
`Signpost artwork gate` · `Signpost recoil gate (A5)` + Knopf · `Plant set gate` + Knopf ·
`Card respawn gate (B6)` · `Coast gate` · `WebGL context` · `Aurora strength` ·
`God-ray strength` · `Additive white gate` + Knopf.

### Nicht angefasst, benannt

- **Die Streuung (`STREU`, 720 Props) hat weiterhin 3 Bäume, 1 Busch, 1 Pilz, 1 Fels.** Das ist der
  Satz, der die Welt *bepflanzt* aussehen lässt; die 40 surrealen Plätze sind zu selten dafür.
  Georgs Pflanzenwunsch trifft eigentlich diesen Satz. **Dichte-Entscheidung, §5.7.**
- **Ist die Aurora polar richtig?** Die Quelle setzt sie fest über den Nordpol. Alternative: sie folgt
  dem Spieler und ist jede Nacht da. Gestaltungsfrage, deshalb nicht entschieden.
- Block 3 (Kartensammeln als EINE Zeitachse) ist geplant, nicht begonnen — Zielbild und Georgs vier
  Entscheidungen stehen in `docs/SPRINT_v7-Gestaltung.md` §5.
- Vier Atmosphäre-Effekte fehlen: Glühwürmchen, Laternen, Kondensstreifen, Vogelschwarm.
- **Zwei Slices sind von Georg angemeldet** (1.9.): *Meckertronic-Modelle* (3D, passen zu den Pets)
  und *die Flugphase als Bodenbewegung* mit **animierten** Modellen. Beide brauchen Assets, die Georg
  übergibt. Vorbereitung dafür liegt seit 31.8. bereit: `fahrzeug-vertrag.js` (ein Fahrzeug ist Mesh +
  FX-Geschmack + Grenzen, nie eine zweite Physik) und `walk-messung.js` (Messung 1 sagt: Raycast im
  Walk-Slice ist gemessen Pflicht, 17,5 % gegen eine Schwelle von 5 %).
