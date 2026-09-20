# Session-Cut v10-S21 — 10. August 2026

**Weitergearbeitet wird an `KFB Overworld v10.dc.html`.** Dieses Dokument ist der Einstieg für den
nächsten Chat: was gilt, was heute gelernt wurde, was offen ist — in Reihenfolge.

---

## 1 · Was diese Session gebaut hat (S5 → S21)

Siebzehn Slices, alle im Changelog mit Messzahlen. Die sechs, die den Stand verändert haben:

**V10-S6 — Der Fortschritt ist umgebaut.** Sechs Werte (Bizarro · Kayfabe · Bingo · Bongo · Boggle ·
BLÖDSINN!), **Fluff ist keiner davon**, sondern die abgeleitete Lebenszahl. **POP statt XP, kein
Level.** Preise: Wert anheben `4 + 2 × Wert`, Slots 15 und 40.

**V10-S8 — Die Kante der Kartenzone stimmt.** *Karte · Kartenfeder · Wasser · dünne Feder*, ohne
Streifen dazwischen. Die Zone merkt ihre Kante als `zone._plate`.

**V10-S15 — Die gestrichelte Feder** (`card-dash`): dieselbe Kontur, dieselbe Bauchung, unterbrochen.
Trägt Flüstern, später Terrain-Schnittlinien und die Schere.

**V10-S18/S19 — ChatterBox S1.** Geometrie vor dem Streaming · Schrei mit Zackenkontur · Denkblasen
für Tiere und Arbeitende · **Präsentationsbudget**: max 2 Blasen in der Welt, 1 je Zone, Eskalation
bis 4, darüber nackte Pottymouth-Glyphs.

**V10-S20 — Die Welt kennt den Spieler persönlich.** Name + Titel beim Avatar, Titel als Trophäe
ohne Wirkung, und die **Ruf-Schmähung**: ab −3 wird geschmäht (mit Name und Titel), ab −9
angegriffen. Eine Schwelle, kein zweiter Automat.

**V10-S17 — Mini-Story-Gerüst.** Sechs Anlässe, Beats von außen (NIE), `reveal` 1,6 s nach `win`.

---

## 2 · Die zwölf Hausregeln, die heute Geld gekostet haben

Sortiert nach dem, was sie gekostet haben — die ersten drei am teuersten.

1. **Fünfmal dieselbe Klasse: das HUD führte für jede Eigenschaft des Wertemodells eine eigene
   Kopie** — Werteliste, Anzeigeslots, Farben, Zähler, Beschriftung. Vier davon habe ich einzeln
   repariert; erst die fünfte hat mich zur gemeinsamen Quelle geführt.
   *Wer ein Modell ändert, sucht besser einmal alle Leser, als viermal den nächsten.*
2. **Eine Ersetzung, die nichts findet, meldet nichts.** Zweimal war ein `replaceText`-Anker falsch,
   zweimal lag das Modul danach tot daneben (RSS-Leitung, Stat-Getter). *Geprüft wird am geladenen
   Stand, nicht am geschriebenen Code.*
3. **Abnahme über einen Weg, der nicht der Bedienweg ist, ist keine Abnahme.** Der Schrei wurde über
   einen direkten Aufruf geprüft und war im Spiel tot; das Blasenbudget in einer kampffreien Phase,
   also genau nicht durch den Fehlerpfad.
4. **Ein Schalter, der zwei Dinge auf einmal sagt, wird irgendwo für das falsche gelesen** (`frei`
   hieß »umgeht Abkühlung« UND »umgeht Budget«).
5. **Ein Merkmal, das man als Stellvertreter für ein anderes benutzt, trägt genau einmal** (`potty`
   stand für »Eskalation« und ließ den Schmähruf durchs Raster fallen).
6. **Modulreferenzen nachschlagen, nicht einfangen.** `this.OWA=window.OW_AI` fror eine Instanz ein;
   danach liefen zwei Gehirne mit zwei Zählern (0 gegen 219).
7. **Eine Schnittstelle darf ablehnen; werfen darf sie nicht.**
8. **Eine CSS-Regel, deren Trefferzahl man nicht gemessen hat, ist eine Vermutung** (der
   Frequency-Selektor traf null Elemente, der Changelog behauptete das Gegenteil).
9. **Wer zwei Abstände addiert, hat keinen** — und *eine Blockhöhe, die man nicht am tiefsten
   Rechteck geprüft hat, ist geraten*.
10. **Eine Kopplung kann richtig sein und trotzdem falsch aussehen.** Die Laufanimation hing korrekt
    an der Strecke — nur deckte ein Bild 31 px Boden ab, und das liest das Auge als Gleiten.
11. **Ein Sprecher, den niemand sieht, ist schlechter als das Logbuch.**
12. **Eine Trophäe, die man wieder verlieren und noch einmal gewinnen kann, ist keine.**

---

## 3 · Was zwischen den Workspaces gilt

**Die Grenze:** Laufzeit gehört dem Lead, Inhalt und Oberfläche gehören WS0, Semantik gehört der
NIE. Dreimal bestätigt, dreimal beinahe verletzt.

**Neu seit heute:** ein Handoff, das Produktion auslöst, braucht eine Spalte **»existiert bereits«**
— am 10.8. enthielt die »build now«-Liste fünf fertige Punkte. Statusvokabular:
`BUILT · PARTIAL · OPEN · HOOK · DEFERRED · REJECTED` (Masterplan §6).

**Der Vertrag nach außen** (Masterplan §6): `travelPoint(x,y,label,nachsicht)` ·
`popCost/popSpend` · `hudCardAward` · `zone._plate` · `STAT_KEYS/STAT_INFO` · `OW_IDENT.wer()`.

**Offen bei WS0:** Paket 3 kam zurück (HUD-Baukasten), Lulls-Skins sind beauftragt
(`docs/BRIEFING_WS0_lulls-skins.md`), Fluff-Leiste wartet auf `ui-kit-ts.js`.

---

## 4 · Offen, in Reihenfolge

1. **Wiseguy** — alle Bausteine liegen (Blase, Knöpfe, Emotes, Budget). Der erste Mob, den man wegen
   seines Verhaltens hasst statt wegen seiner Werte. Hartes Ende: drei Fehlschläge oder acht
   Sekunden, ein Treffer möglich.
2. **NIE × Goblins — der Referenzdurchlauf.** Eine Fraktion komplett durch den Ein-Zeilen-Generator,
   mit zwei bewusst verworfenen Varianten und Begründung. **Erst danach** lohnt der große
   Phrasen-Pool. (ChatGPTs Vorschlag »Three Goblins mining gold near a Kant Card« ist der richtige
   Testfall.)
3. **Timing-Feinschliff** — 15 CPS, Mindeststandzeit, Antwortverzögerung, Pointen-Pause.
4. **Fluff-Leiste** aus WS0s Baukasten.
5. **Name/Titel-Fenster** — `setName`/`setTitel`/`besitz()` liegen bereit.
6. **Signatur-Shader je Terrain** (`docs/SSOT_Waber_Shader.md`) — liegt seit v10-S2 still.
7. **`byPage`-Kartenraster** — entschieden, KISS-vertagt.
8. **Terrain-Schnittlinien und Schere** — das Preset trägt beides, es fehlt der Ort.
9. **3D-Ball-POC** — isolierter technischer Test, blockiert nichts, **nach** den Lulls-Skins.

---

## 5 · Konzept-Aufträge (parallel, ohne Code)

`docs/KONZEPT_SLICES_ChatGPT.md` — K1 Titel-Katalog (drei Herkunftsarten, sechs Angles,
Lulls-Skins) · K5 Mini-Story-Beats · K3 Witzpool · K2 Schmährufe · K4 Deck→Skin.
Dazu `docs/NIE_ADAPTER_HOOK.md` — der Vertrag steht als Form fest, gebaut ist nichts.

---

## 6 · Einstieg für den nächsten Chat

1. Dieses Dokument
2. `docs/MASTERPLAN_overworld.md` — §6 (Vertrag), §4.2b/4.3b/4.3c (Kante, Federn, Blasen)
3. `docs/CHANGELOG_overworld.md` — V10-S21 zuoberst, additiv
4. `docs/ANTWORT_Handoff_und_VoiceEngine.md` — der Stand mit dem Konzept-Workspace

**Stay fluffy.**
