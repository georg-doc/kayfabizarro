# Post-Mortem R2 · Steuerung 10.–12.10.2026: Zwischenstände, Einheiten, ungeprüfte Behauptungen

Verfasst von der Steuer-Sitzung (Claude Code), 12.10.2026, auf Georgs Auftrag. Belege: `KFB_HUB/30_DECISIONS/CHANGELOG.md`, `DECISIONS.md` (V-Nummern) und `replies/`. Was dort nicht steht, steht hier auch nicht.

## 1 · Was feststand

- **Keine harten Schnitte, keine offenen Kanten** [V-011]. Tunnel und Körper geschlossen, „keine lazy hacks“ [V-112, V-113, V-136]. Alle Abschlüsse gerundet in Claymation-Form [V-168].
- **Vorlage zuerst** und **use what works** [V-001]. „Fehlt“ nur mit Such-Protokoll [V-140].
- **Prüfung vor jeder Lieferung** mit `tools/parity`; der Bericht nennt die betroffenen V-Nummern [V-003].
- **Maßstab K2** (H = 3,64 lab); Figuren nie skalieren [V-060].
- **Entscheidungen leben im Register** und werden sofort eingetragen [V-003, V-009].
- **Lizenzen** sind seit V-071 geregelt; Cozy-Tunes-Weg seit V-087.

## 2 · Was passiert ist

1. **Banden FAIL → C4c v2 PASS.** Georgs Live-Test am 11.10.: zerrissene J17-Banden am Hub, vermutlich aus dem C4c-Arbeitsstand, dazu 40–60 s Laden, Flackern im Stand, Haltebucht nicht gefunden (CHANGELOG 11.10. „Georg live“). Das Audit fand die Ursache: Die Bande ist eine offene, gesweepte Fläche; LAB PATCH I lässt das Profil auf einen Punkt kollabieren; Zweige haben flache Fächer-Deckel über einem konkaven Querschnitt und keine Lippen (replies/AUDIT_ARCH_R1.md §2c). Folgen: V-166 (Standardansicht nur geprüfter Stand), V-171 Punkt 1, C4c v1 mit Knet-Köpfen (noch dunkle Kehle), C4c v2 mit Strang je Seite und J17-strangCap, offene Kanten 0/0, PASS [V-183].
2. **Einheitenfehler 4,9 TC-m vs. 5,8 lab.** V-169 nannte „freie Höhe nötig 4,9 (Kamera bis 4,4 + 0,5)“; das sind Track-Core-Meter aus der J17-Chase-Kamera (replies/RKIT_SPIRAL_CLEARANCE_R1.md). Die Steuerung schlug in V-175 (3) „5,8 (K2 ≥ 1,6 H, deckt Kamera 4,9)“ vor und verglich damit lab mit TC-m. Georg nahm es an. Der Dungeon-Machbarkeits-Agent fand den Widerspruch: 4,9 TC-m = 7,15 lab, die Lab-Kamera sitzt bei 6,9–8,2 lab. Korrektur V-185: Durchfahrtshöhe = max(5,8 lab, Lab-Kamera-Maximum + 0,5), vorläufig ≈ 9,0 lab.
3. **Ungeprüft weitergereichte Behauptungen.**
   - REPORT C1b+C3 „0/0/0, 1 Bauteil“ galt nur für die Join-Box; die Körper hatten 382–710 offene Kanten. Der „Fahrtest“ war ein Schienen-Folger (beide Autos bitgleich), kein k2b-Beweis (CHANGELOG 11.10. „Kritiker C1b-C3-r2“). Die Steuerung hatte R1 vorher als „V-112-Prüfungen 0/0/0 für 4 Styles × 4 Körper“ eingetragen („C1b+C3 Lieferung R1 geprüft“).
   - „Rechteckprofil fehlt“: Die Bau-Sitzung hielt es für nicht vorhanden; es lag in Core v0.12 `tunnelLooks` [V-130, Warum-Spalte].
   - „B6 race ↔ world braucht Georgs Entwurf“ (RKIT-Lückenliste) ging ungeprüft an Georg. Georg: der Übergang „ist doch in joyride schon vorhanden!!!“ [V-139]. Zweimal an einem Tag → V-140. Dazu gehört V-148: Bildstellen prüfen und nachfragen, nicht erfinden.
4. **Falscher Fußtest-PASS unter Last.** Die Fußtests zu V-138 und V-153 vom 11.10. nachmittags waren PASS, obwohl eine Fuge zwischen Bord und Gehweg offen war; große Zeitschritte sprangen darüber. Fix LAB PATCH G2, Wiederholung bei 60 fps 6/6, Regel V-159. Schon vorher hatte ein alter Fußtest ein verdrehtes Lenkvorzeichen („Hex unerreichbar“ gestrichen, CHANGELOG „C4a fertig“). Parity lief mehrfach „PASS nach Wiederholung unter Last“ (PROJECT_STATE; Audit §4).
5. **Falsche Bezugsmaße.**
   - RKIT-Poller-Vorlage: Hüfthöhe ≈ 1,50 lab, gemessen am Farmer-A-Modell. Die Bounding-Box enthielt eine „Icosphere“, die der Blender-glTF-Import als Knochenform anlegt. Richtig sind 0,65–0,83 lab; Poller 0,85 (replies/RKIT_POLLER_VORLAGE_R1.md, RKIT_POLLER_R1.md). RKIT hat sich selbst korrigiert.
   - Spiralen: Die td03-Parkhaus-Spirale (auch in J17 p1b.v2, P1 B, td05) hat 3,35 TC-m frei statt nötig 4,9; die Chase-Kamera hängt in der Etage darüber. Geprüft wurde das erst nach Georgs Hinweis [V-169]; Prüfung `spiral_clearance` in Track Core 0.16.10.
6. **Ladezeit und Flackern.** Georg sah 40–60 s Laden und Flackern im Stand live. Die Ursachen fand erst das externe Audit: Neuberechnung von levelSet-Meshing und Tunnel-Booleans bei jedem Aufruf (`buildMs` 30,6–35,8 s), versteckt gebaute Lab-Inseln, ein Sprung der dynamischen Auflösung (0,95 % Pixel in einem Bild), LOD ohne Hysterese, near 0,5 (Audit §2a, §2b). Die Zahlen lagen vorher in unseren Berichten: „Bauzeit 53,7 s“ beim Feld-Tunnel-Prototyp (CHANGELOG 11.10.), „Bauzeit > 3 s ok, später vorab backen“ [V-116]. Das Audit fand außerdem `dist/` mit StreakByte-Assets nicht ignoriert und das Lab ohne Git. Folge: V-171.
7. **Ewige Lizenz- und Public-Floskeln.** Briefs und Antworten wiederholten „nur Text und Zahlen“, „keine gekauften Dateien“, „kein Merge“, obwohl V-071, die Asset-Merge-Ausnahme und V-087 alles geregelt hatten (z. B. replies/STEERING_REPLY_WSA_C_R1.md). Georg: das kostet Zeit und Nerven → V-184.
8. **Zwei Planungssysteme, Persistenzlücken.** Der Blender-Coworker fand am 11.10.: Plan R1 und Projektstand nicht auf GitHub, GitHub-Register nur bis V-084, kein Golden-Lieferant nach V-084, alte Besitzer-Tabelle bzw. RKIT-P2 nicht abgelöst, Georg-Entscheidungen nur in WSA-Returns (CHANGELOG „Blender-Review“; V-120). Der WSA-Router führte den Vier-Insel-A/B-Vergleich als „einziges Tor“ (REVIEW_STEUERUNG_R1). Folgen: V-117 (Dokument-Vorrang, Persistenz-Pflicht), V-122 (Plan R1 gilt auch für WSA), `START_HERE_STEERING.md`, `sync_github.sh`. Noch am 12.10. fehlte eine alte Abnahme im Register (Motion Library 01 vom 24.09., nachgetragen als V-186).

## 3 · Ursachen (ehrlich, Steuerung zuerst)

1. **Ich habe Zahlen ohne Bezug weitergegeben.** „0/0/0“ ohne zu fragen, für welches Objekt; „4,9“ ohne Einheit; „1,50“ ohne Messobjekt. Eine Zahl ohne Objekt und Einheit ist keine Prüfung.
2. **Ich habe Fehlt-Meldungen geglaubt.** Rechteckprofil und B6 lagen in Vorlagen, die seit C0 auf dem Tisch waren. Ich habe nicht selbst in den Donor-Karten nachgesehen, bevor ich Georg fragte.
3. **Arbeitsstände waren sichtbar.** Die Standardansicht war nicht an „letzte geprüfte Lieferung“ gebunden. Georg testet live; er sah den C4c-Zwischenstand.
4. **Bauprinzip statt Einzelfehler übersehen.** Die Bande war von Anfang an eine offene Fläche. Wir haben Enden verformt und gedeckelt, statt einen geschlossenen Endbaustein zu bauen. Es gab keinen Offene-Kanten-Test für Strecken-Meshes.
5. **Tests hingen an der Rechnerlast.** Wanduhr und Bildrate entschieden über PASS. „PASS nach Wiederholung“ habe ich als PASS gelesen.
6. **Was nicht gemessen wird, fällt nicht auf.** Ladezeit und Flackern hatten keinen Test und keine Schranke. Die Bauzeit stand in Berichten, ich habe sie als „später backen“ abgelegt.
7. **Gold heißt nicht geprüft.** Die J17-Spirale galt als Vorlage; ob die Kamera darin passt, hat niemand gemessen.
8. **Floskeln statt Regeln.** Ich habe geklärte Lizenzfragen in jeden Brief kopiert, statt auf V-071 zu verweisen.
9. **Persistenz war Absicht, nicht Ablauf.** Register, Plan und Stand lagen lokal; andere Sitzungen sahen sie nicht. Entscheidungen aus WSA-Chats kamen nicht zurück.

## 4 · Was sich ändert (gilt ab sofort)

1. **Jede Zahl mit Einheit und Objekt** [V-185]. Freiraum in lab oder TC-m; Prüfwerte mit dem geprüften Objekt („0/0 für alle Körper“, nicht „0/0/0“).
2. **Fehlt-Meldungen prüft die Steuerung selbst** gegen die V-140-Liste, bevor sie an Georg gehen [V-140]. Uneindeutige Bildstellen werden gefragt, nicht erfunden [V-148].
3. **Standardansicht = letzte geprüfte Lieferung;** alles andere hinter URL-Schalter [V-166].
4. **Geschlossene Endbausteine und Offene-Kanten-Test** für alle Strecken-Meshes; Parity Check 11 [V-168, V-171 (1), V-183].
5. **Tests zählen nur bei ≥ 50 fps** und mit fps-Angabe im Bericht [V-159]; deterministische Tests mit `fixedDt` folgen [V-171 (6)].
6. **Ladezeit und Flackern bekommen Schranken:** warm ≤ 5 s, kalt ≤ 15 s; Flicker-Probe ≤ 0,5 % je Bildpaar (Audit §7, V-171 (2)(3)).
7. **Messungen an Lab-Dateien,** nicht an importierten Modellen; Icosphere-Knochenformen ausschließen (RKIT-Regel, replies/RKIT_POLLER_R1.md). Spiralen gegen die Chase-Kamera prüfen [V-169].
8. **Keine Lizenz-Floskeln;** nur neue, ungeklärte Fälle in einer Zeile [V-184].
9. **Persistenz bei jeder Änderung:** Register, Plan R1, Projektstand, START_HERE auf GitHub (`sync_github.sh`) [V-117]; WSA und andere Sitzungen arbeiten ab START_HERE und melden Georg-Entscheidungen zur Registrierung [V-122].

## 5 · Lessons Learned

| Lesson | Regel / V-Nummer | Wie geprüft |
| --- | --- | --- |
| Arbeitsstände nie in der Standardansicht | V-166 | Standard-URL = letzte Lieferung; WIP nur hinter Schalter (z. B. `?c4c=1`, `?flk=1`) |
| Offene Flächen sind ein Bauprinzip-Fehler | V-168, V-171 (1), V-183 | `open-edges.mjs` und Parity Check 11: 0 offen, 0 mehrfach in 300 lab um den Hub; Nahbild jedes Endes |
| Zahl ohne Einheit ist kein Maß | V-185 | Steuerung prüft jede Freiraum- und Maßangabe auf lab bzw. TC-m vor Eintrag ins Register |
| Prüfwert ohne Objekt ist keine Prüfung | V-003, V-125 | Bericht nennt das geprüfte Objekt; Steuerung gleicht mit Roh-JSON ab, blinde Kritiker je Lieferung |
| Fehlt-Meldungen erst gegen Bestand prüfen | V-140, V-139 | Such-Protokoll „nicht gefunden in …“ Pflicht; Steuerung prüft vor Weitergabe |
| Bildlogik prüfen, nicht erfinden | V-148 | Liste „uneindeutig“ je Bild in der Vorlagen-Zeile |
| Tests unter Last lügen | V-159, V-171 (6) | fps/fpsOk im Fuß- und Fahrtest-Bericht; später `fixedDt`, dreimal gleiches Ergebnis mit CPU × 4 |
| Am echten Objekt messen | V-060, RKIT_POLLER_R1 | Maße aus Lab-Figurdateien; Icosphere-Knochenformen ausgeschlossen |
| Gold-Vorlagen auch prüfen | V-169 | Track Core `spiral_clearance` gegen Chase-Kamera; Kamera-Test in Spiralen |
| Was zählt, braucht eine Schranke | V-171 (2)(3) | Ladezeit warm ≤ 5 s / kalt ≤ 15 s; Flicker-Probe DPR 2, CPU × 4, ≤ 0,5 % |
| Geklärtes nicht wiederholen | V-184 | Briefs und Berichte ohne Lizenz-Floskeln; neue Fälle in einer Zeile |
| Ein Plan, ein Register, für alle sichtbar | V-117, V-122 | `sync_github.sh` nach jeder Register-Änderung; GitHub-Kopf-V-Nummer = lokal; START_HERE als Einstieg für alle Sitzungen |
