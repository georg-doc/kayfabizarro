# KFB SOP R1 · So arbeiten wir (23.11.2026, V-2097)

**Gilt für jede Sitzung:** WS0, Owner-Chats (Aqua, Buchmaschine, WSA), WSB (Blender), Webchats und Kritiker. Diese Seite ist der Einstieg. Sie ersetzt `START_HERE_STEERING.md` und `KFB_WORKING_RULES_R1.md` als Startpunkt; deren Inhalte sind hier eingeordnet.

**Grundsatz:** Kein Bau ohne Ziel. Kein Zeigen ohne bestandene Prüfung. Keine neue Mikro-Regel pro Vorfall: Ein Vorfall ändert diese Seite (Version hochzählen) oder wird einer bestehenden Zeile zugeordnet.

## 1 · Rangfolge (was gilt, wenn sich etwas widerspricht)
1. Georgs eigene Worte in der aktuellen Aufgabe.
2. Harte Leitplanken (§4 Stufe A): Sicherheit, Rechte, Daten.
3. Gesamtabsicht und Kanon: `DECISIONS.md` (V-Nummern), `CANON_3D/`, Figuren-SSOT.
4. Diese SOP: Ablauf, Briefing-Form, Prüfmatrix.
5. Fachspecs je Bereich (Style Guide, Motion Guide, HUD-Belegung, Rezepte).
6. Lokale Gewohnheiten einer Sitzung: gelten nur, wenn sie nichts davor verletzen.

## 2 · Der Ablauf (eine Schleife pro Produkt)
| Schritt | Wer | Ergebnis |
|---|---|---|
| 0 Bestand | Owner | Drei Zeilen: Was gibt es schon (Pfad, Commit), was wird 1:1 übernommen, was ist neu. „Fehlt“ nur mit Such-Protokoll (Repo, Asset-Librarian, patch.gg, 3D-Suche). |
| 1 Absicht spiegeln | Owner | Ein Satz Gesamtabsicht plus Genre, zurück an WS0, bevor gebaut wird. Beispiel: „Produkt-Hero-Film, das Buch ist der Star, die Maschine die Bühne.“ |
| 2 Ziel | Owner / WS0 | Was gut heißt, als Bild: (a) vorhandenes Asset oder abgenommener Stand, (b) Referenzen aus dem Genre, (c) nur wenn ein Look fehlt: Zielbild aus dem Webchat, das WS0 selbst beschafft und Georg freigibt. |
| 3 Bau | genau ein Owner | Umsetzung nach Ziel, im bestehenden Modul und Code-Pfad. |
| 4 Handwerks-Gates | Code | Automatische Prüfungen (§4 Stufe B/C). Rot = nicht fertig. |
| 5 Stille Blind-Kritik | getrennter Agent | Prüfmatrix §5 gegen Ziel und Absicht. PASS = jede Achse ≥ 7 und Mittel ≥ 8. Sonst still reparieren, höchstens 5 Runden. Zwei Runden ohne Verbesserung = Stopp, kleinsten Blocker als Karte. |
| 6 Abnahme WS0 | WS0 | Prüft selbst das Endergebnis gegen das Ziel. Leitet keine Erklärung eines Owners ungeprüft weiter. |
| 7 Abnahme Georg | Georg | Eine Hub-Karte: ein Vergleich, groß, seine Begriffe, PASS/TUNE/FAIL. Bewegung immer als Video. |
| 8 Festhalten | WS0 | Register-Zeile, Merge, GitHub. |

Georg sieht nie Zwischenstände. Er ist nie Kopier-Station zwischen Sitzungen: Übergaben laufen über GitHub-Links und Sitzungs-Nachrichten.

## 3 · Briefing-Form (jedes Briefing, jede Sitzung)
```
ABSICHT  (1 Satz)     Was soll der Zuschauer/Spieler erleben? Wer ist der Star?
GENRE    (1 Zeile)    Welche bekannte Grammatik gilt (Produktfilm, GTA-Heist, Award-Scrollseite, Cartoon-Kampf)?
OWNER    (1 Zeile)    Genau eine bauende Sitzung, Branch, Modul.
ZIEL     (Links)      Vorhandenes Asset / Referenzen / freigegebenes Zielbild.
FERTIG   (1 Zeile)    Prüfmatrix §5 bestanden + welche Gates.
GRENZEN  (≤ 3 Zeilen) Was nicht angefasst wird (fremde Owner, Kanon).
DETAIL   (1 Block)    Nur was ohne die Links nicht klar ist.
```
Kein Briefing ohne ABSICHT und ZIEL. Das Brief-Gate (`tools/brief_gate.py`, `tools/BRIEF_GATE_PROMPT.md`) prüft Widersprüche zum Register, bevor es rausgeht.

## 4 · Leitplanken in Prüf-Reihenfolge
**Stufe A · hart, immer (Verstoß = sofort Stopp)**
- Keine Schlüssel, Passwörter, Tokens in Code, Log, Chat. Keychain nur über vorhandene Skripte.
- `src/private` und private Assets nie in öffentliche Branches; Bundles nur additiv, vor Push `diff-tree` prüfen.
- Ein Owner pro Datei/Modul; fremde Prozesse nie beenden; keine Merges ohne Prüfung.
- Downloads nur aus erlaubten Quellen (Asset-Librarian, patch.gg, 3D-Suche, Georgs eigene Links).

**Stufe B · Handwerk (im Code geprüft, Rot = nicht fertig)**
- Kit- und HUD-Teile: Seitenverhältnis bleibt (≤ 1 %), nie über Originalgröße, kein 3-/9-Teiler außer als dehnbar markiert, kein Teil in fremdem Zusammenhang (kein leerer Badge, kein Icon in fremder Fassung), kein Beschneiden.
- Passt ein Teil nicht: Liste „fehlt im Kit“, nicht basteln.
- Figuren: KFB-Augen korrekt (Lider, Blick), keine Gliedmaßen im Körper, Füße auf dem Boden.
- Konsole ohne Fehler; Ziel-Bildrate auf Desktop und Handy.

**Stufe C · Kanon und Look**
- Ein Licht-Rig, ein Look (Clay im Vordergrund, realistischer Hintergrund), keine gemalten Glanzpunkte.
- HUD: bestehende Positionen bleiben, diegetisch, aus dem Kit.
- Bewegung: echte Clips (Motion Library, KayKit, Mixamo) statt Eigenbau; Extremposen auf Ausholung und Aufprall; Ease-in/-out, Holds, keine linearen Fahrten.
- Effekte: Ursache und Richtung lesbar, eine physikalische Vorstellung, keine Kameratricks.
- Texte und Stimme: nie aus dem Nichts. Quelle = Georgs Zeilen oder Sprachnotiz, Kartentexte (Triplet-SSOT), Golden Samples (`replies/META_TEXTE/GOLDEN_SAMPLES_AQUA_R1.md`). Claude schneidet und setzt ein, erfindet keine Witze. Fehlt Material: Georg um 3–5 Kernzeilen bitten. Blind-Text-Kritik gegen Golden und Anti-Samples (`replies/META_TEXTE/ANTI_SAMPLES_R1.md`); ein Slop-Marker = FAIL.

**Stufe D · Belege**
- Belege im Spiel-Look und mit festen Kamera-Presets; Bewegung als Video.
- Hub-Karte: Frage + 1–2 Sätze + Bild, Optionen = Bildbeschriftungen, keine Zahlen für Georg.

## 5 · Prüfmatrix für die Blind-Kritik
Maschinenlesbar in `tools/qa_matrix.r1.json`, Prompt in `tools/CRITIC_BLIND_PROMPT.md`. Der Kritiker bekommt nur: Absichtssatz, Ziel (Bilder/Links), Erfassung (Stills, Videos, Protokoll), diese Matrix. Keine Notizen des Owners.

| Achse | 0–3 | 4–6 | 7–8 | 9–10 |
|---|---|---|---|---|
| A Absicht | Star/Geschichte nicht erkennbar | erkennbar, aber verwässert | klar, jede Szene dient ihr | sofort und mit Witz lesbar |
| B Ziel-Treue | widerspricht dem Ziel | Richtung stimmt, Details fehlen | entspricht dem Ziel | im Blindvergleich kaum vom Ziel zu trennen |
| C Handwerk | verzerrte/geflickte Teile, Clipping | einzelne Ausrutscher | sauber | makellos, Detailpflege sichtbar |
| D Bewegung & Timing | linear, ruckelig, tot | Grundprinzipien teilweise | Ausholung, Ease, Holds, Bögen | lebendig, cartoonig, pointiert |
| E Lesbarkeit & Hierarchie | Blick findet nichts | überladen oder zu klein | klare Reihenfolge, lesbar am Handy | sofort klar, elegant |
| F Spielschleife / Ablauf | Sackgassen, unklares Ziel | Ziel da, Übergänge holprig | Ziel, Scheitern, Retry, Menü klar | Sog, man will nochmal |
| G Ton | stört oder fehlt | passt teilweise | stützt Lage und Rhythmus | erzählt mit |
| H Technik | Fehler, Abstürze, Ruckeln | gelegentliche Fehler | fehlerfrei auf Desktop und Handy | dazu schnell geladen |

**PASS:** keine Achse unter 7, Mittel ≥ 8, Stufe-A/B-Gates grün. Nicht zutreffende Achsen = „n/a“ mit Grund. Jede Bewertung mit Beleg (Datei, Szene, Zeitpunkt). Für Vergleichbarkeit: gleiche Erfassung, gleicher Prompt, gleiche Matrix-Version.

## 6 · Rollen
- **WS0:** Gesamtabsicht, Briefings in dieser Form, Ziele beschaffen (auch Webchat), Endprüfung, Register, Merges. Reicht keine Zwischenstände weiter.
- **Owner-Chat:** Bestand, Absicht spiegeln, bauen, Gates, stille Schleife, eine Meldung mit Belegen.
- **WSB:** Modelle und Clips nach Auftrag; erzeugt fehlende Modelle über Meshy MCP (`replies/TOOLS/MESHY_MCP_WORKFLOW_R1.md`); liefert Bundles nur additiv mit Vergleichsbild.
- **Webchat (Bildgenerierung):** Zielbilder nur, wo ein Look fehlt; bedient von WS0.
- **Kritiker:** blind, nur Matrix und Belege, ein Kritiker pro Runde.
- **Georg:** Absicht, Freigabe der Zielbilder, Endabnahme.

## 7 · Anti-Muster (Erkennen → Stopp)
- Bauen ohne Ziel oder ohne gespiegelte Absicht.
- Teile passend skalieren, schneiden, umdeuten.
- Einzelfixes im Akkord statt einer Runde gegen das Ziel.
- Zwischenstände oder ungeprüfte Erklärungen an Georg.
- Die Elementliste eines Briefings abarbeiten und die Absicht verlieren.
- Pro Vorfall eine neue Regel statt dieser Seite.

## 8 · Pflege
WS0 pflegt diese Seite. Änderungen nur mit Register-Zeile und neuer Versionszeile unten. Gespiegelt auf GitHub durch `sync_github.sh` (kayfabizarro, Branch `docs/kfb-decisions-register-2026-10-11`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`).

- R1 · 23.11.2026 · Erstfassung nach Georgs Workflow (V-2096, V-2097).
- R1.1 · 23.11.2026 · Texte und Stimme in Stufe C, Anti-Samples (V-2098, Falkenstein-FAIL).
