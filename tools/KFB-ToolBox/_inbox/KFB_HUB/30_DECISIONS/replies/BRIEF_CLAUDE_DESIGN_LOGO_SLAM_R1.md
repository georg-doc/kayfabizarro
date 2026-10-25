# Briefing für Claude Design · KayfaBizarro-Logo „Typographic Monster Slam“ · Design-Paket R1 · WS0 · 25.10.2026 (V-657, V-385, V-392, V-292, V-740)

Du bist Art Director für KFB (Kayfabizarro), ein cartoonig-surreales Universum in Claymation-Optik. Du gestaltest die Wortmarke als animiertes 3D-Modul: Aus „Kayfabe“ wird durch einen Wrestling-Move „KayfaBizarro“. Die Buchstaben selbst spielen die Szene. Zuerst geht es um Design, Technik kommt danach.

## Tier 0
1. **Ergebnis von Phase 1 sind Bilder:** ein Moodboard, eine Tafel Gestaltungssprache und zwei Schrift-Behandlungen (A und B) mit je vier Style-Frames. Georg wählt danach eine. Erst in Phase 2 folgt ein kurzes Animatic der gewählten Behandlung, erst danach ein Modul im Code.
2. **Georgs Idee gilt wörtlich:** `quelle/MONSTER_SLAM_BRIEF_R1.md` (Abschnitte 1, 3 und 7) mit der Dramaturgie Setup, Unterbrechung, Monster Slam, Erholung und Idle. Wo dieses Briefing etwas schärfer fasst, gilt dieses Briefing.
3. **Knete statt Plastik:** Die Buchstaben sehen aus wie von Hand modelliert, mit unregelmäßigen Fasen, kleinen Daumendellen und weicher Eigenverschattung. Licht nur aus unserem einen Licht-Modul `material/kfb-stage-light.v1.1.js` (V-392): Sonne plus Hemisphäre, keine zusätzliche Fülllampe, kein Rand- oder Gegenlicht, kein Emissive (V-385). Glänzender 3D-Text, aufgeblasene Ballonbuchstaben und Neon sind Fails.

## Die Szene (etwa 5 Sekunden, dann Idle)
1. **Setup:** „Kayfabe“ steht schwer und gewichtig wie ein Lexikoneintrag. Darunter die Definition auf Englisch: *Kayfabe (n.): The practice of presenting a staged performance as genuine reality.*
2. **Unterbrechung:** Die Endung „be“ zittert kaum merklich. „Bizarro“ schiebt sich von rechts ins Bild, weit nach hinten gebogen wie ein Wrestler vor dem Angriff.
3. **Monster Slam:** „Bizarro“ beschleunigt, dreht leicht nach vorn und knallt auf „be“. Beide werden plastisch breitgedrückt, „be“ zerplatzt in Knet-Spritzer in seiner eigenen Farbe und in kleine Buchstaben-Bruchstücke. Die ganze Wortmarke verzieht sich unter dem Aufprall.
4. **Erholung:** „Kayfa“ und „Bizarro“ federn zurück, eine Verformungswelle läuft von links nach rechts. Die Wortmarke richtet sich auf und steht richtig geschrieben: „KayfaBizarro“.
5. **Idle:** langsames, schwebendes 3D-Idle mit kleinem Kippen. Lesbarkeit geht vor.

Cartoon-Physik, keine Rigid-Body-Simulation: Squash and Stretch, zeitversetzte Reaktionen der Buchstaben, wenige gezielte Spritzer, ruhig leicht ruckeliges Stop-Motion-Timing. Keine Augen, Arme oder Wrestler-Figuren; die Buchstaben spielen allein. Sie sind keine Figuren, darum gilt die Augen-Pflicht für Figuren hier nicht (Georgs Konzept).

## Was du lieferst (Phase 1)
1. **Moodboard (eine Tafel):** Knet-Typografie, Claymation-Squash-and-Stretch, Wrestling-Slam-Posen, Cartoon-Aufprall. Je Referenz eine Zeile, was wir nehmen und was nicht.
2. **Gestaltungssprache (eine Tafel):**
   - Marke: Die Zweiteilung Kayfa/Bizarro bleibt. „Kayfa“ in Tinte `#1f1a14`, „Bizarro“ in Creme `#f6efd9` auf dem roten Marker-Block `#b8361f` mit hartem Versatzschatten (die heutige `kb-mark` der Website).
   - Begleitfarben (Georgs Wunsch Apricot/Ocker und gedämpftes Türkis) aus den kanonischen Website-Farben (V-292): Ocker `#e9c14a`, Apricot `#d97c3a`, Türkisblau `#3e6a83`. Kein Regenbogen.
   - Jeder Buchstabe hat eine flache Knetfarbe. Volumen entsteht nur aus dem Licht-Rig und der Knet-Oberfläche, nie aus eingemalten Verläufen oder Schatten in der Farbe.
   - Der harte Versatzschatten der `kb-mark` wird in 3D eine echte modellierte Knet-Schicht hinter „Bizarro“ (oder der echte Schatten der Sonne), nie eine flache Schattenplatte.
   - Material: Knete nach unserem einen Knet-Material `material/kfb-clay.v1.1.js`, Profil `character`, fester Seed (Dellen, Klumpen, Körnung); Licht nach `material/LIGHT_MODEL_R2.md` mit dem Modul `material/kfb-stage-light.v1.1.js`.
   - Spritzer: Knete in der Farbe des Buchstabens, aus dem sie kommen, physikalisch zusammenhängend, kein Konfetti.
3. **Zwei Behandlungen mit je vier Style-Frames**, 16:9, in Endqualität des Looks, nicht als Skizze:
   - **A:** Irish Grover als echte extrudierte 3D-Geometrie (Irish Grover ist bei uns nur noch im Logo im Einsatz, V-657).
   - **B:** eine einzige, sorgfältig gewählte alternative Kontur, falls Irish Grover beim Biegen zu dünn oder unleserlich wird. Keine neue Markenidentität.
   - Die vier Frames: „Kayfabe“ mit Definition, „Bizarro“ in der Ausholbewegung, Aufprall auf „be“, „KayfaBizarro“ fertig.
   - Zu jeder Behandlung ein fünftes Bild: die fertige Wortmarke klein als Header bei 320 px Breite, um die Lesbarkeit zu prüfen.

Phase 1 ist ein Bild-Auftrag ohne 3D-Bau; die drei Pflichtzeilen des 3D-Kanons (CANON_3D §0) gelten erst für Phase 2 und stehen dann in deren Briefing. Phase 2 (nach Georgs Wahl, nicht jetzt): ein kurzes Animatic der gewählten Behandlung. Danach ein Modul mit drei Profilen: `hero` (ganze Sequenz einmal, dann Idle), `header` (fertige Wortmarke, ruhig) und `poster` (exaktes Standbild für Mobilgeräte, reduzierte Bewegung und Ladefehler).

## Material in diesem Paket
- `quelle/MONSTER_SLAM_BRIEF_R1.md`: Georgs Konzept samt Website-Bestand (Schriften, `kb-mark`, Farben), aus georg-doc/kayfabizarro PR #452.
- `material/kfb-clay.v1.1.js`: das eine KFB-Knet-Material (three.js, `onBeforeCompile`). Daraus gelten die Merkmale Dellen, Klumpen und Körnung.
- `material/LIGHT_MODEL_R2.md`: ein Licht-Rig (Sonne plus Hemisphäre), matte Knete.
- `material/kfb-stage-light.v1.1.js`: das eine Licht-Modul, Pflicht für three.js-Renders der Style-Frames und später fürs Modul (V-392).

Die Website bleibt bis zur Abnahme unverändert. Rückgabe: die Tafeln und Frames als Bilder in diesem Ordner auf dem privaten Branch `design/claude-design-r3` unter `rueckgabe/` (V-683), je Frame eine Zeile, was er zeigt. Georg nimmt die Bilder im Hub ab.
