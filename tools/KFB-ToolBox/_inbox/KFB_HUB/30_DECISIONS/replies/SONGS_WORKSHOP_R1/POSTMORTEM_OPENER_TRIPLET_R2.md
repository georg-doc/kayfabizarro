# Post-Mortem R2 · Triplets und Opener im Song-Workshop · 21.–23.10.2026
**An:** WS0. **Von:** Deck-Songs (frischer Song-Chat nach `POSTMORTEM_SONG_PILOTS_R1.md`).
**Anlass:** Georg 23.10.: „wir hatten da (und auch hier im Song-Workshop-Chat) die gleichen Probleme“. Die Opener- und Triplet-Logik war recherchiert und gebrieft, kam aber weder in den Suno-Tracks noch hier an.
**Ergebnis:** Nach fünf Fassungen trägt BBBW t4 (Georg: „das passt, mit Tune später“). Daraus ist der Baukasten `../BAUKASTEN_SPOKEN_LINES_SSOT_R1.md` entstanden.

## 1 · Verlauf
| Fassung | Was gebaut wurde | Georgs Urteil | Fehler in einem Satz |
|---|---|---|---|
| Deck-Verständnis R1 | These, mentale Modelle, Kartenfamilien, Bewohner | Kommando ja, Spielzeugkiste ja | Bewohner aus dem Asset gelesen (gut), aber Wechselköpfe zum Witz gemacht |
| p1 | 6-Beat-Probe, Narben- und Wechselkopf-Pointe | „kontext-unaware Meta-Humor, endet in völliger Verwirrung“ | Witz aus Asset-Wissen, das kein Spieler hat |
| p2 | dieselbe Kette, Plastikgewehr | (überholt) | Probe zur zweiten Schicht statt zum Kern des Decks |
| t1 | 56 Kartenzeilen, 97 % Kartentext, keine Opener; danach 15 Decks Batch 1 genauso | „weder Sätze noch Triplets … nur vorgelesen; die Mini-Opener fehlen“, pragmatisch übernommen | „keine Vorsatzwörter“ als „keine Opener“ missverstanden; Lore paraphrasiert statt Aussage gebaut |
| Probe Büro | Opener laufen in den Titel, Faden Büro/Chef/HR | „besser, aber AI-Slop-Register, Büro-Humor“ | richtige Form, Klischee-Inhalt |
| t2 | Faden „ich gegen mein Gehirn“, Opener nur an jeder zweiten Karte | „viele Fragment-Sätze ohne Kontext und Flow“ | Karten ohne Einbettung bleiben Fragmente |
| t3 | jede Karte mit Kontext-Satz davor, Best-of 42 | „Ballast davorgeklebt … keine Stand-up-Opener“ | Nebenhandlung statt Einbettung |
| **t4** | Stand-up-Opener betten die Karte ein (ein Satz), Uptake-Kette, Best-of 45 | **„das passt (mit Tune später)“** | – |

## 2 · Ursachen
1. **Regeln einzeln umgesetzt statt als Schichtenmodell.** „90 % Kartentext“, „nichts vor die Zeilen“, „Anekdoten-Routine“ und „Brücken 1–3 Wörter“ wurden jeweils für sich optimiert. Das ergab ein Pendeln zwischen Extremen: vorgelesen (t1) → Nebenhandlung (t3). Es fehlte das Modell, das sagt, welche Schicht welche Aufgabe hat.
2. **Eine Kritik als Verbot gelesen statt als Qualitätskriterium.** „Nicht ein, zwei Wörter davor, das killt den Flow“ meinte: keine losen Wörter ohne Satz. Umgesetzt wurde: gar keine Opener.
3. **Opener als Erzählung missverstanden.** Ein Stand-up-Opener ist die Sprechhandlung, in der die Karte gesagt wird: Gerücht, Frage, Theorie, Begegnung. Ein Erzählsatz mit Punkt davor ist Ballast.
4. **Triplet-Begriff nicht angewandt.** Spec R2, Goldens und `TRIPLET_METHOD_FROM_WRINKLE_R1` lagen vor. Trotzdem entstanden Titel + Lore-Satz statt Titel + Power-Begriff, Telegramm-Takte und Pointe.
5. **Klischee-Register als Ersatz für Witz:** Büro, HR, Chef, Familien-Sitcom. Absurd und surreal aus dem Deck selbst trägt besser; bei BBBW ist es das Cover-Bild „Gehirn als Gegner“.
6. **Wissen des Writers statt Wissen des Hörers.** Asset-Details (Wechselköpfe, aufgemalte Narbe) und Kartenbilder, die man nicht sieht, bauen Witze, die niemand versteht.
7. **Breite vor Abnahme des Verfahrens.** 15 Decks wurden als t1 parallel gebaut, bevor das Verfahren an einem Deck abgenommen war. Der gleiche Fehler wie in Post-Mortem R1 §3.7.
8. **Vorhandene Recherche nicht als Baukasten verknüpft.** Opener-Pool, Opener-Bogen-Modell, P43-Operatoren (inklusive Uptake UP-01–10), BG-1..8 und das NotebookLM-Summary lagen im Repo. Sie waren Listen, kein Bauplan mit Schichten und Satzbau-Typen.
9. **Messgrößen ohne Bezug zur Qualität.** Kartentext-Quote und Gate-PASS lassen sich gut messen, Flow nicht. Die messbaren Größen haben die Arbeit gesteuert.

## 3 · Lessons learned (für alle Writer, Mensch oder Modell)
1. **Erst die Schicht bestimmen, dann schreiben:** Karte, Triplet, Opener, Verbindung, Rahmen (Baukasten §1).
2. **Das Triplet ist eine Aussage der Karte**, kein vorgelesener Lore-Text. Prüffrage: Funktioniert es als Satz?
3. **Der Opener bettet die Karte ein.** Opener und Karte bilden einen Satz. Nie zwei lose Wörter, nie ein Erzählsatz davor.
4. **Flow entsteht durch Uptake**, also das Aufgreifen des letzten Worts, und durch die Kartenlogik (deshalb/aber). Eine erzwungene Storyline braucht es nicht.
5. **Absurd statt Klischee.** Der Stoff kommt aus dem Deck selbst (Cover, Kartenlogik), nicht aus Allerweltsszenen.
6. **Nur was der Hörer weiß, trägt Witz.**
7. **Erst ein Deck abnehmen, dann skalieren.**
8. **Kritik nach ihrer Absicht umsetzen**, nicht nach dem Wortlaut. Bei Unklarheit eine Probe von 8–10 Zeilen statt eines ganzen Decks.
9. **Messwerte sind Hygiene.** Kartentext-Quote und Gate-PASS nie als Qualität melden.

## 4 · Was jetzt gilt
- **SSOT-Vorschlag:** `../BAUKASTEN_SPOKEN_LINES_SSOT_R1.md`. Aufträge an WS0 stehen dort in §6.
- **Referenz:** BBBW t4 im Writers' Room und unter `big_bad_brain_wrestling/*.t4.*`.
- **Opener-Pool nach Haltung und Satzbau:** `OPENER_POOL_BY_STANCE_R1.{json,md}`.
- **Batch 1 (15 Decks):** t1 als Basis. Überarbeitung nach Baukasten erst nach Georgs Tune an BBBW.
