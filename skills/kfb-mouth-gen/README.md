# KFB Mund-Generierung · Spezifikation und Erfahrungen (lebendes Dokument)

**Zweck:** An einem Ort steht, wie wir Cartoon-Münder per Bild-KI (ChatGPT-Bild-Chat) als Sprite-Bögen erzeugen, schneiden, verankern und einbauen, und welche Fehler wir dabei gelernt haben. Jede neue Mund-Runde ergänzt den Abschnitt „Erfahrungen“ und legt ihren Prompt als eigene Datei daneben.

**Stand:** 19.11.2026 (PETS-M1, WSB). Bisherige Runden: R1 (Spec), R2 (Spiel-Format), R4 (sechs Cartoon-Typen, 14.11.), Cute-Pets v1 (19.11., dieser Ordner).

## Dateien

| Datei | Inhalt |
|---|---|
| `README.md` | diese Spezifikation + Erfahrungen |
| `PROMPT_cute_pets_v1.md` | Prompts für die Cube-Pets (`pet_soft`, `pet_lipless`, `pet_fang`, `pet_buck`) |
| R4-Brief (Hub) | `KFB_HUB/30_DECISIONS/replies/MOUTHS_GPT_R4/BRIEF_CHATGPT_MOUTHS_R4.md`, Rückmeldung `RETURN.md` |
| Werkzeuge (Hub) | `MOUTHS_GPT_R1/_tools/cut_align.py` (schneiden), `MOUTHS_GPT_R2/_tools/cut_align.py` (Spielformat: Anker, Schatten, `closed_width_px`), `MOUTHS_GPT_R4/_tools/game_r2_r4.py` |

## Spezifikation (gilt für jede Runde)

1. **Bogen:**
   - Ein Bild je Mund-Typ mit festem Raster und fester Reihenfolge. Je Briefing höchstens zwei Bögen.
   - Der Hintergrund ist transparent; wenn das nicht geht, flaches Grün #00FF00.
   - **Kein Schachbrett-Muster** (das ist eingebranntes RGB und lässt sich nicht freistellen).
2. **Nur der Mund:** keine Nase, kein Kinn, keine Haut, keine Schatten, kein Text.
3. **Gleicher Maßstab:**
   - Alle Formen haben dieselbe Breite, außer oh, oo und pout mit mindestens 0,6 der Breite.
   - Die Oberlippe soll auf gleicher Höhe liegen. GPT zentriert trotzdem jede Zelle; das Werkzeug richtet es beim Schneiden aus.
4. **Höhe:**
   - Grenze für dicke Lippen: 1,7 × Ruheform.
   - Bei dünnen Lippen oder ohne Lippe ist die Grenze 1,7 × max(closed-Höhe, 0,578 × closed-Breite) (R4-Regel).
   - Cube-Pets: breit und flach, die Ruheform mindestens 2,5 : 1.
5. **Zähne:** in jeder Zelle exakt dieselben Zähne. Die Ruheformen (closed, mbp, smile_closed) zeigen **keine** Zahnreihen, außer bei Hasenzähnen.
6. **Stil:** Knete, matt, weiche Volumen, keine Glanzlichter und keine Realistik.
7. **Spielformat** (R2-Schritt, Pflicht):
   - Leinwand 512 × 512, Anker x 256 / y 220 (Lippenlinie), `upperLift` 0,35 eingebacken.
   - Dazu `closed_width_px` in `anchors.json`. Ohne dieses Feld setzt das Spiel die volle Leinwand an, und der Mund wird nur halb so breit.
8. **Ruheform-Familie im Werkzeug:** `CLOSED_FAMILY = ['closed', 'mbp', 'smile_closed']`. smirk und sad sind in den Bögen offen, sonst rutscht die Lippenlinie.
9. **Ersatz statt Neumalen:** Fehlt eine brauchbare Form, kommt eine Ersatzzuordnung in `anchors.json` (z. B. `fv → l_th`, `disgust → grimace`).
10. **Einbau an Figuren:**
    - Die Mundbreite bezieht sich auf den Grundkörper und nicht auf die Gesamthöhe. Bei Cube-Pets: Würfel 1,25 Kenney-Einheiten, Mundfläche etwa 0,33.
    - Abstand zu Augen und Nase für alle Sprechformen einhalten.
    - Die Mundfläche nie mittig zerschneiden; nur freistellen und einpassen.

## Lippenfarbe: einfärbbar statt eingemalt

- **Problem (Cube-Pets, 19.11.):**
  - Farbige Lippen (Rosé, Tomatenrot, Violett, Gelb) beißen sich mit dem Fell.
  - Ein heller Lippenton auf hellem Fell verschwindet, zum Beispiel FB-Gelb auf gelbem Hasen.
  - Je nach Fell wirkt der Mund aufgeklebt.
- **Regel ab Cute-Pets v1:** Die Lippen werden als **ungefärbte, neutralgraue Knete** gemalt, nur mit Hell-Dunkel-Schattierung. Nur Mundinneres (dunkelrot), Zunge (rosa) und Zähne (gebrochen weiß) haben Farbe.
  - Im Prompt steht das ausdrücklich als „COLOUR RULE“ mit Verboten: kein Rot, kein Rosa, kein Braun, kein Lippenstift.
- **Laufzeit:**
  - Lippenmaske per Farbschlüssel: wenig Sättigung bei mittlerer Helligkeit ist Lippe, hell und ungesättigt sind Zähne, gesättigtes Rot ist Mundinneres.
  - Nur die Lippe wird mit der Lippenfarbe der Figur multipliziert: Fell abgedunkelt und leicht röter, wie bei den Lidern.
- **Variante ohne Lippen** (`pet_lipless`): Die Öffnung hat nur eine dunkelgraue Kontur. Das passt zu Kenneys Linienmündern und ist für die meisten Tiere vermutlich die beste Wahl.
- **Darstellung:**
  - Münder im Renderer beleuchtet (MeshStandard + Alpha) statt `unlit`, damit sie wie die Haut Schatten empfangen.
  - Die Knete-Struktur kommt aus dem Bild.

## Erfahrungen (je Runde ergänzen)

- **R4 (14./15.11.):**
  - GPT hält die Oberlippe nicht auf einer Höhe; das Werkzeug richtet sie aus.
  - Ein Bogen zeigte in den Ruheformen beide Zahnreihen und wurde verworfen (S09).
  - Ein Bogen hatte das Schachbrett eingebrannt (S15) und wurde verworfen.
  - Dünne Lippen ergaben eine flache Ruheform, und die 1,7-Regel schlug falsch an; Lösung siehe Spezifikation Punkt 4.
  - Wiederkehrende Fehlformen: fv mit Unterzähnen, ee mit Unterzähnen, disgust mit herausgestreckter Zunge. Behoben über Ersatz.
  - Beim oh rutschen manche Typen 3 bis 9 px unter die Nase; je Figur dy etwas tiefer setzen.
  - GPT „verbessert“ den Typ gern, zum Beispiel volle statt schmaler Lippen (buck_grin) oder Koralle statt Tomatenrot (sausage_coral). Dann einen eigenen Namen vergeben, statt zu verwerfen.
- **Cube-Pets R1 (19.11.):**
  - R4 passt nur bei etwa 20 % der Pets.
  - Die Gründe sind: Lippenfarbe, unbeleuchtet ohne Schatten, Minimund auf kleinen Gesichtern und bei Schnabeltieren ein vom Schnabel getrennter Mund.
  - Daher Mund aus bei 21 Pets, Backlog PETS-M1, neuer breiter Satz mit grauen Lippen.
- **Schnabeltiere:** kein Lippenmund. Der Schnabel ist der Mund (Kiefer-Gelenk oder Schnabel-Sprechformen), das ist ein eigener Auftrag.
