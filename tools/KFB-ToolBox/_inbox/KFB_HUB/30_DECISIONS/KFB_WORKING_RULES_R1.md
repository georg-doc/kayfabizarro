# KFB Arbeitsregeln R1 · Was sich bewährt hat (14.10.2026)

Für jede neue Bau- oder Planungssitzung, besonders WS1 (R3F-Spielrahmen) und den Karten-Dialog. Zusammengefasst aus zwei Wochen Lab-Arbeit: aus dem, was funktioniert hat, und aus den Fails (Post-Mortems R1/R2). Das Register `DECISIONS.md` hat Vorrang.

## CURRENT ADDITIVE QUALITY GATE · 14.10.2026 · GEORG DIRECT FAIL / WS0 V-Nummer ausstehend

For **all KFB character-facing design, Studio/Scenelet, animated NPC and Wireface/Card-performance output**: **NO VERIFIED KFB ANIMATED EYE-RIG = FAIL**. This is a hard source/acceptance gate, not cosmetic tuning, and not waived by old temporary V-202 Original-KayKit eyes.

- Use the actual source-isolated **KFB EyeRig v6** and per-character approved anchored configuration (V-061/V-090; EYE-CLEANUP-01 for approved subset). The V-200/V-201 *Lab eye regressions are FAIL*, not acceptable alternative eyes. Source: Resident Atlas Cut R2 `lib/frizzlegraft/anchored-eyes.v1.js` and `pet-eye-rig.v6.js`. Empty `NoEyes.glb` anchors, original/static KayKit eyes, painted/drawn eyes or guessed Wireface substitute faces do **not** satisfy the KFB EyeRig requirement.
- Before showing a figure in a positive composite, provide same-camera **source vs stage eye close-up**, plus **visible animation evidence** of gaze/eye tracking left/right, pupil motion, blink and lid color, life/kinetics and eyes→head→body sequencing in talk/reaction; a still alone does not prove motion. Per-actor PASS only, never blanket PASS inferred from a shared rig file.
- For the same KFB Wireface Stage, a **real landscape KFB PDF quarter-card** (fit, no placeholders/portrait swaps) and the real ink-free **V-204 `Clay pur` bubble** (one `chatterbox-core` DOM renderer; no outline) are simultaneous hard gates.
- The historical `KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/evidence/s2_bubble_still.jpg` has **ink outline, portrait placeholder-looking card and no verified approved animated EyeRig**; it is **NEGATIVE GOLDEN / FAIL**, NEVER a positive donor. Details: `replies/WIREFACE_STAGE_VISUAL_DONOR_FAIL_2026-10-14.md`.
- **3/3 real-source proof before Studio composite**. If missing, report unavailable source and do not substitute any fake figure/card/bubble. WS0 owns adding a V-number to `DECISIONS.md` under V-213; this note captures Georg's direct decision now without fabricating a register number.

## 1 · Bevor gebaut wird
1. **Vorlage zuerst (V-140).** Vor jedem Teil eine Zeile an die Steuerung:
   - Was gibt es schon? Pfad, Commit.
   - Was wird 1:1 übernommen?
   - Was ist neu, und warum?

   „Fehlt“ oder „gibt es nicht“ gilt nur mit Such-Protokoll („nicht gefunden in …“).
2. **Übernahme heißt derselbe Code-Pfad (V-206).** Dieselbe Funktion bzw. dasselbe Modul aufrufen, nie „ähnlich nachbauen“. Ein zweiter Code-Weg für dasselbe Element ist ein FAIL: so entstanden die Regresse bei Joyride, Augen und Strecke.
3. **Ein Modul pro Slice**, nach dem Modulvertrag `create(options) → {object3d, update(dt, ctx), dispose()}`. Daten-Module sind reine Funktionen.
4. **Bilder prüfen, nicht erfinden (V-148).** Generierte Referenzbilder sind Hinweise auf Logik und Stil. Unklares geht als Frage an Georg, nicht als Annahme.
5. **Inventur mit Beleg.** Jede Aussage „funktioniert“ braucht einen ausgeführten Beleg. Alles andere heißt `UNGEPRÜFT` (Vorbild: `replies/MODULE_INVENTORY_R1.md`).

## 2 · Prüfen, bevor Georg etwas sieht
6. **Nur Fertiges an Georg (V-206, V-166).** Arbeitsstände bleiben hinter einem URL-Schalter. Georg sieht keine Zwischenstände und keine „Serviervorschläge“.
7. **Bildpaar gegen die Referenz:** gleiche Kamera, gleiche Figur, links Referenz, rechts Stand. Die Steuerung prüft selbst und lässt nichts mit Abweichung durch.
8. **Automatische Prüfungen vor jeder Lieferung:**
   - Paritätstests für alle abgenommenen Bausteine;
   - offene Kanten = 0;
   - Fuß- und Fahrtests nur bei ≥ 50 fps (V-159), oder als deterministisches Replay mit festem Zeitschritt (V-190, `replies/REPLAY_HARNESS_SPEC_R1.md`).
   - Headless verfälscht die Physik. Die **Endabnahme läuft im Browser auf Georgs Rechner.**
9. **Regress-Wächter:** Jede von Georg abgenommene Eigenschaft (Steuerung, Augen, Look) bekommt einen Test. Was keinen Test hat, bricht beim nächsten Umbau.

## 3 · Kritik von außen
10. **Blinder Kritiker bzw. Art Director:** ein getrennter Agent ohne Chatverlauf, nur mit Ziel, Pfaden und Referenzbildern. Er fand Fehler, die die Bausitzung übersah, zum Beispiel beim Portal-Konzept (FAIL → Konzept → PASS, V-130).
11. **Externes Architektur-Audit** (`replies/AUDIT_ARCH_R1.md`) fand die echten Ursachen für Ladezeit (48 → 7 s) und Flackern. Wiederholen, sobald ein neuer Rahmen steht.
12. **Echte Unabhängigkeit:** ein anderes Modell bzw. ein anderer Anbieter (WSA, ChatGPT, Fable) prüft gegen. Es bekommt nur den Branch-Link und die Fragen, keine Schlussfolgerungen der Steuerung (V-178).

## 4 · Festhalten
13. **Register mit V-Nummern** (`DECISIONS.md`), dazu ein **additiver Changelog**. Jede Georg-Entscheidung bekommt eine V-Nummer und ein Warum/Wann. Korrekturen ergänzen das alte Eintrag, sie ersetzen ihn nicht (Querverweis).
14. **GitHub ist die einzige Wahrheit** (V-208, V-191). Google Docs, Drive und NotebookLM dienen nur als Lese-Spiegel.
15. **Post-Mortem nach jedem größeren Fail**, mit der Tabelle „Lehre → Regel → wie geprüft“.
16. **Startseite für neue Sitzungen** (`START_HERE_STEERING.md`): Vorrang-Liste, Zuständigkeiten, gesperrte Dateien.

## 5 · Mit Georg reden
17. **Fragen nur, wenn er sie auf einen Blick beantworten kann:** große Bilder, seine Begriffe, ein Klick. Technische Fragen mit klarer Antwort entscheidet die Steuerung selbst.
18. **Keine Lizenz- oder „kein Merge“-Floskeln (V-184).** Nur einen neuen, ungeklärten Fall melden, in einer Zeile.
19. **Nur bei Meilensteinen melden.** Kurz: was jetzt geht, was nicht, was als Nächstes kommt.

## 6 · Technik und Betrieb
20. **Eine three.js-Instanz (0.186.1), eine pdf.js-Version (4.7.76), ein Besitzer** für Licht, Nebel und Himmel.
21. **Teure Ergebnisse cachen**, inhaltsadressiert (Schlüssel = Hash der echten Eingaben). Belegt mit „byte-gleich mit und ohne Cache“.
22. **Speicher- und Plattenwächter:** ≥ 40 GB frei vor schweren Läufen, nur ein Headless-Browser zur Zeit. Agenten beenden **nur ihre eigenen PIDs**, nie `pkill vite` o. ä.
23. **Dev-Server dauerhaft** über einen Terminal-Tab mit Wächter, nicht aus der Vorschau einer Sitzung (die endet mit dem Zug).

## 7 · Inhalt
24. **Dialog nur aus dem Pool.** Triplets und Brücken kommen ausschließlich aus dem KEEP-Pool bzw. der Kartenquelle (Vertrag PR #379). Das Spiel erzeugt keine Texte; fehlt eine Zeile, steht „…“.
25. **Sprechblasen plain** (V-204): ohne Tusche, eine Form, ein Zipfel, weicher Schatten.
26. **Kartenbilder sind Viertelseiten-Zuschnitte**, ohne Beschnitt; die Randnotizen zählen.
