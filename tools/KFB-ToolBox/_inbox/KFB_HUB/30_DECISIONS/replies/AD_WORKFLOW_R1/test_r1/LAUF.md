# Probelauf test_r1 · AD-Workflow R1 (23.11.2026)

**Kurz:** Ende-zu-Ende mit echtem Material, ohne Bildgenerierung. Paket aus einem festgenagelten Schnappschuss von `AQUA_10/erfassung_r1/trouble_desktop` (Lauf 23.11. 02:22 UTC, unter `test_r1/_privat_quelle/`; Stills, mp4, protokoll.json) mit 4 Befunden aus `AQUA_CRITIC_R2/ZUSAMMEN_R2.md` in 2 Familien, davon 1 Bewegungsbefund. Webchat-Seite mit dem echten Skill-Skript `ad_return.py` simuliert (Ziele = aufgefüllte bzw. originale Stills, teils auf 1536×1024 skaliert wie ein Bildmodell; `simuliert: true`). Ingest, Briefs, Vergleichs-Eingaben und zwei Vergleichsrunden erzeugt. Alles grün; 33 Werkzeug-Tests grün.
**Wiederholen:** `bash test_r1/lauf.sh` (aus `AD_WORKFLOW_R1/`; löscht und baut `test_r1/_privat`, `ingest_A`, `ingest_D` neu, nichts geht nach außen).

## Befunde im Paket `aqua10-ad-test-r1` r1
| ID | Familie | Szene | Quelle | Art | Ergebnis Probelauf |
|---|---|---|---|---|---|
| F01 | A | S02_startbild | ZUSAMMEN #24 (B13) | still | PASS → bau |
| F02 | A | S05_figurenblatt | ZUSAMMEN #11 (B10, A24) | still, mit Bereich | PASS → bau, nicht versandbereit (neues Kit-Teil). Erst auf S04 Fischwahl geplant; die neu geschriebene Erfassung zeigt die Fisch-Karte schon im Kit-Rahmen → Befund aufs Figurenblatt umgelegt |
| F03 | D | S16_hai_angriff | ZUSAMMEN #14 (B6, A15) | **bewegung** (Clip + Ausholung + Aufprall) | TUNE → v2 PASS → bau; OWNER klären („WSB + WS0“); Vergleich: Runde 1 WEITER, Runde 2 PASS |
| F04 | D | S16_hai_angriff (naehe) | ZUSAMMEN #19 (A19) | still, mit Bereich | PASS → bau; Abweichung außerhalb 0/255, Kern-Komposit erzeugt |

Dazu Lauf 2 für Familie D (`stage --lauf 2 --anker … --nur F04`, `start --nur F04`) und zwei Vergleichsrunden (öffentlicher Erfassungsordner abgelehnt).
Familie D über Weg **bundle** (eine Datei), Familie A über Weg **einzeln** (zwei „Downloads“ in umgekehrter Reihenfolge im Modellformat 1536×1024, ein Doppelklick-Duplikat und eine ältere Fremddatei: richtig zugeordnet, Duplikat und Fremddatei ignoriert). Kein Brief ist versandbereit, weil alles simuliert ist.

## Was brach und wie es behoben ist
Runde vor dem Review:
1. `publish`-Probe meldete „fremde Pfade“ (`diff-tree --root` gibt die Commit-ID aus) → `--no-commit-id`.
2. `ad_ingest.py` lief unter Python 3.9 nicht (verschachtelter f-String) → umgeschrieben.
3. `write_vergleich` NameError → behoben.
4. Referenz-Frame-Links ohne `paket/` → behoben.
5. Clip-Fenster „None–None s“ → klarer Text.
6. Rückgabe-Schema fehlte im Skill, Prüfung lief still nicht → liegt in `references/`, fehlt es, bricht `abschluss` ab.
7. Äste je Befund pauschal → jetzt fest je Befund aus dem Paket.
8. Pflicht-Rollen je Befund nur bei Bewegung → jetzt aus `beleg[]`.
9. Brief-Gate erkannte keinen Bereich → Stub nennt `--domains`; mechanisch Exit 0.
10. Unverändertes Original als Ziel → abgelehnt (außer simuliert).
11. Drift über Roh-Bytes hätte jede Neu-Formatierung abgelehnt → kanonische Prüfsumme.
Während der Arbeit: Die Aqua-Erfassung wurde an Ort und Stelle neu geschrieben (andere Stills, Laufzeiten, Befund F02 erledigt) → `pin`/Abgleich in `build`, Schnappschuss unter `_privat_quelle`.
Nach Review-Runde 3: Paarung je Ziel erst ab PASS-Zeit und „mehrdeutig“ bei zweitem passenden Bild (Regressionstest), exakter SOP-Abgleich in `build`, Repo-Pfad `paket_<rev>` und Register je Revision, Lauf 2 gebaut, ein Bild je Antwort mit Kopfzeile davor, erste Antwortzeile = Prüfsummenzeile, Ablauf-Stand im Paket, `--erfassung` im Vergleich, Privat-Guard über realpath, Randfälle (0 PASS, FAIL ohne Texte, sha-Hinweis im Weg einzeln, `verwerfen` nicht nach PASS).
Nach Review-Runde 2: Quelle/Paket müssen privat sein (sonst bricht `build` ab), Skript und Leitplanke reisen im Paket, `start` prüft Upload je Familie, `verwerfen`, Wiederaufnahme (`--gestartet`, `--fassung`, ZUSTAND-Zeile), Kopfzeilen und Download beim PASS, Duplikate und `--paar`/`--datei` im Ingest, Randprüfung, `--gates-gruen`, `basis` relativ.
Nach Review-Runde 1 (`REVIEW_LOG.md`): Bildformat (aufgefüllte Fassung + Rückführung, im Lauf aus 1536×1024 pixelgenau), Weg einzeln mit Ähnlichkeits-Paarung, Skript-Prüfsumme, SOP-Stand-Abgleich, Referenzen aus `KFB_REFERENZEN_R1.md`, Bereich + Messung außerhalb, `ad_vergleich.py`, Paket-Register, Rückgabe-Dateiname mit Startzeit, mehrere Übersichtsblätter, saubere Meldung bei abgebrochenem Download.

## Negativ-Proben (alle wie erwartet abgewiesen)
Paket: öffentliche Erfassung als Quelle · Paketordner außerhalb `_privat` · Datei weicht von der festgenagelten ab · Bewegung ohne Zeitfenster (ohne Ausnahme) · behobener Befund · Bewegung ohne Clip · Referenzen ohne Frames · manipulierte Datei · `--unter ../x`.
Webchat-Skript: falsche Paket-Prüfsumme · Ordner A mit „Familie D“ · verändertes Skript · zweiter `start` ohne `--neu` · fremde Familie · Format 1000×1000 · Rolle nicht verlangt · Referenz nicht zum Befund · Äste ändern · Abschluss mit offenem TUNE · Freigabe einer alten Fassung · unverändertes Original.
Ingest: SIMULIERT ohne Schalter · Drift · unbekannte Skript-Prüfsumme · verlorener Befund · Äste abweichend · manipuliertes Bundle-Bild · abgebrochener Download · rote Baubarkeit → klären · Bewegung ohne Aufprall-PASS → klären.
Weg einzeln: zweite passende Fassung nach dem PASS → mehrdeutig, nicht versandbereit; ältere Fassung vor dem PASS → ignoriert.
Lauf 2 ohne Anker → abgelehnt.
Vergleich: öffentlicher Erfassungsordner → abgelehnt · zwei Runden ohne Besserung → STOPP · B = 7 bei sonst 9 → kein PASS · ohne `--gates-gruen` kein PASS.

## Was der Probelauf nicht zeigt
- Echte Bildgenerierung: welches Format das Modell liefert und ob erzeugte Bilder als Datei in der Sandbox liegen (Formattest im ersten Chat, `AD_WORKFLOW_R1.md` §11.5). Beide Fälle sind abgedeckt.
- Ob Georgs ChatGPT-Arbeitsbereich Skills hat (sonst Projekt-Rückfall) und wie viele Dateien eine Nachricht annimmt (Paket rechnet vorsichtig mit 10).
- `publish --push` (bewusst nicht ausgeführt; der Weg auf einen bestehenden Branch wurde im Review gegen ein lokales Repo nachgespielt).
- Clip-Zeitfenster: `protokoll.json` hat keinen Video-Start → Ausnahme `zeit_unsicher` (Vorschlag §11.2).
