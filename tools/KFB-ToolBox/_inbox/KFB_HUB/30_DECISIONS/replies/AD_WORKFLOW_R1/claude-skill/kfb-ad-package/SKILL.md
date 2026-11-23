---
name: kfb-ad-package
description: WS0-Gegenstück zum ChatGPT-Skill kfb-art-direction. Verwenden, wenn aus einer Kritiker-Erfassung (Stills, Videoloops, protokoll.json) ein Art-Direction-Paket für den Webchat entstehen soll, beim Sitzungsstart und nach jedem /compact (Rückgaben abholen), wenn eine Datei kfb-ad-return_*.json in ~/Downloads oder KFB_AD/eingang liegt, oder wenn freigegebene Zielbilder zu SOP-Aufträgen und Blind-Vergleichen werden sollen.
---

# kfb-ad-package · R1 (WS0)

Feste Pfade (absolut verwenden, das Arbeitsverzeichnis ist `~/Dropbox/CLAUDE`):
```
A=$HOME/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/replies/AD_WORKFLOW_R1   # Workflow, Schemas, Skills, tools/
T=$A/tools                                                           # ad_package.py, ad_ingest.py, ad_vergleich.py, test_ad.py
R=$HOME/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/replies                  # Produkt-Ordner liegen darunter
KFB_AD=$HOME/Dropbox/CLAUDE/KFB_AD                                   # Georgs Upload-Ordner, pakete.json, eingang/ (Werkzeuge legen ihn an)
```
Regeln und Begründung: `$A/AD_WORKFLOW_R1.md`. Nach jeder Änderung an Werkzeugen, Leitplanke oder Skript: `python3 -W ignore $T/test_ad.py` muss OK melden; bei geändertem `ad_return.py` die neue Prüfsumme in `$T/skill_versions.json` ergänzen (alte stehen lassen, solange Rückgaben offen sind).

## 0 · Sitzungsstart und nach jedem /compact
`python3 $T/ad_ingest.py scan` → jede neue Rückgabe sofort nach B. Georg meldet nichts. (Zeile für `WS0_STATE.md`: „AD: beim Start `ad_ingest.py scan`“.)

## A · Paket bauen (nach jedem Kritiker-Lauf mit Erfassung)
1. **Bestand (3 Zeilen):** Erfassung, Kritiker-Liste, schon ein Paket in `$KFB_AD/pakete.json`?
2. **Privat:** Die Erfassung muss unter einem `_privat`-Ordner liegen oder `sync_github.sh` enthält den Ausschluss aus `$A/VORSCHLAG_sync_github.diff`; sonst bricht `build` ab. Liegt sie öffentlich: Hub-Karte an Georg wegen §11.1 und bis dahin eine Kopie der nötigen Dateien nach `$R/<PRODUKT>/ad_<run>/_privat_quelle/erfassung_r<n>/<lauf>/` (Muster `$A/test_r1/_privat_quelle`).
3. **Auswahl** `$R/<PRODUKT>/ad_<run>/auswahl_r1.json` (Muster `$A/test_r1/auswahl_r1.json`):
   - Jeden Befund am aktuellen Still selbst ansehen; nicht mehr sichtbar oder „behoben“ → nicht aufnehmen oder auf ein Still umlegen, das ihn zeigt (Probelauf: Fisch-Karte inzwischen im Kit → Befund aufs Figurenblatt gelegt).
   - Je Befund: `achse`, `schwere`, `art`, `owner` (genau eine Sitzung), `malbar`, `aeste`, `referenzen`, optional `bereich` (x, y, w, h als Anteile).
   - `referenzen[]`: `name` exakt wie fett in `KFB_REFERENZEN_R1.md`, je Referenz 1 Frame; jeder malbare Befund braucht eine Referenz mit Frame.
   - Bewegung: Clip + Stills `ausholung`/`aufprall` mit `ereignis` und `ereignis_s` (Laufuhr). Clip-Zeit rechnet das Werkzeug aus `video_beginn_s` im Protokoll; fehlt das, nur mit `--erlaube-zeit-unsicher` (Register-Vermerk).
   - Familien A–F; je Familie ≤ 7 Bilder (Upload ≤ 10 Dateien inkl. package.json, LEITPLANKEN.md, ad_return.py).
   - Danach `python3 $T/ad_package.py pin <auswahl>`: nagelt die gesehenen Dateien fest. Ändert sich die Erfassung später, bricht `build` ab.
4. `python3 $T/ad_package.py build <auswahl> $R/<PRODUKT>/ad_<run>/_privat/paket [--erlaube-zeit-unsicher]` (bricht ab bei öffentlicher Quelle, abweichenden Dateien, veralteter Leitplanke).
5. `python3 $T/ad_package.py publish <paket> --push` (privat, Branch `ad/<run_id>`, Schlüssel `~/.ssh/kfb_private_assets_deploy`), dann `git ls-remote` prüfen.
6. Je Familie `python3 $T/ad_package.py stage <paket> <F>` → `$KFB_AD/<run_id>_<rev>_<F>_l1/`; die Ausgabe nennt die Aufrufzeile (mit Ordnername).
7. **Hub-Briefing** (eine Karte, Familien nacheinander): je Familie die Aufrufzeile zum Kopieren und „neuer ChatGPT-Chat, Zeile einfügen, alle Dateien aus dem genannten Ordner in Dropbox › KFB_AD hineinziehen. Nach jedem Bild PASS, TUNE … oder FAIL (oder ‚weiter‘). Beginnt die erste Antwort nicht mit ‚Skript-Prüfsumme …‘, neuen Chat öffnen.“

## B · Rückgabe einlesen
1. `python3 $T/ad_ingest.py ingest <rückgabe.json> --aus $R/<PRODUKT>/ad_<run>/ingest_<F>_l<n> [--bilder ~/Downloads]` (Paket aus `pakete.json`). Exit 2: Grund lesen, nicht flicken (Drift → Paket der Rückgabe; unbekannte Skript-Prüfsumme → neuer Chat mit Ordner).
2. **Selbst prüfen (SOP Schritt 6):** jedes PASS-Bild `_privat/ziele/<id>.png` gegen Ausgangs-Still und Leitplanke §5 ansehen; Abweichung außerhalb des Bereichs beachten. Paarung „mehrdeutig“: ansehen, dann neu einlesen mit `--paar F04_naehe_v1="ChatGPT Image 2.png"` (oder `--datei` je Bild ohne Zeitfilter, `--paarung-ok`, wenn sie stimmt).
3. `python3 $T/ad_package.py publish <aus>/_privat --run <run_id> --unter rueckgabe/<F>_l<n> --push`.
4. Je Befund laut `ingest_bericht.json`: `bau` + versandbereit → Stub vervollständigen (Branch/Modul), Brief-Gate mit den genannten `--domains` + Prüf-Agent, über den Kanal des Owners senden · `bau` mit offenem Owner/neuen Assets → erst klären bzw. Eskalationsleiter (SOP §2a) · `klaeren` und `kein_bild` (vom Webchat verworfen) → Hub-Karte an Georg (Bilder per SendUserFile, siehe unten) · `kein_pass` → nichts.
5. Register-Zeile je Rückgabe: Paket, Familie, Lauf, PASS-IDs, Owner, private Links, Ausnahmen.
6. **Neuer Lauf derselben Familie** (Stil-Drift, Georg will neu): der alte Chat schließt erst mit `abschluss` ab (PASS-Bilder bleiben erhalten). Dann `python3 $T/ad_package.py stage <paket> <F> --lauf 2 --anker <erstes PASS-Bild aus ingest_…/_privat/ziele> --nur <noch offene Befunde>`; die Aufrufzeile kommt fertig (Lauf 2, Nur …, Ordner). Im Ingest erscheinen die übrigen Befunde als `anderer_lauf`.

## C · Blind-Vergleich Bau ↔ Zielbild (nach Meldung des Owners)
1. Neue Erfassung derselben Szene nach `vergleich/<F>.json › erfassung_vorgabe`.
2. Frischer Kritiker-Agent nur mit `absicht`, `genre`, `ziel.bilder` (relativ zu `basis`) + `ziel.kern`, neuer Erfassung, `tools/qa_matrix.r1.json`, `tools/CRITIC_BLIND_PROMPT.md`.
3. Gate-Ausgabe des Owners (Stufe A/B) selbst prüfen, dann `python3 $T/ad_vergleich.py runde <vergleich/F.json> <kritiker.json> --erfassung <…/_privat/vergleich_<F>_r<n>> --gates-gruen` (ohne den Schalter kein PASS; öffentliche Erfassungsordner werden abgelehnt). Exit 0 PASS → WS0 prüft → Hub-Karte (Ziel neben Bau, Bewegung als Video); Exit 1 WEITER → still an den Owner; Exit 3 STOPP → kleinster Blocker als Hub-Karte.

## D · Skill-Auslieferung an Georg
Nur bei geändertem `SKILL.md` (Ablauf) ist ein neuer Upload nötig: Hub-Karte „Skill neu hochladen“ mit dem Klickweg (ChatGPT → Skills → kfb-art-direction ersetzen → Ordner Dropbox › CLAUDE › KFB_HUB › 30_DECISIONS › replies › AD_WORKFLOW_R1 › chatgpt-skill › kfb-art-direction). Verlangt der Upload eine ZIP, legt WS0 sie einmal daneben. Leitplanke und Skript reisen mit jedem Paket und brauchen keinen neuen Upload.

## Bilder für Georg
AD-Bilder (klären, verworfen, Endabnahme Ziel neben Bau, Bewegung als Video) per SendUserFile direkt an Georg; die Hub-Karte trägt Frage, 1–2 Sätze und den privaten GitHub-Link, keine Bilddatei unter `replies/` außerhalb von `_privat`.

## Grenzen
- Medien nur im privaten Repo und lokal unter `_privat…/`. Nie nach kayfabizarro.
- Georg: eine Zeile, Ordner hineinziehen, PASS/TUNE/FAIL, Download-Klicks. Kein Umbenennen, Kopieren von Texten oder Terminal.
