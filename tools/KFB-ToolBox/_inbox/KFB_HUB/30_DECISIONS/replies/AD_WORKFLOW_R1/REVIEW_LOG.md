# Review-Log AD-Workflow R1

Je Runde ein frischer, unabhängiger Kritiker-Agent (general-purpose), nur mit diesem Ordner, den SOP-Dateien und Georgs Absicht; Achsen: sofort einsatzfähig, kein Drift, Rückverfolgbarkeit, Georg nicht Kopier-Station, private Medien, ChatGPT-Realismus, Skript-Fehler.

## Runde 1 · 23.11. · 15 Befunde, davon 3 Blocker
| # | Schwere | Befund | Umgesetzt |
|---|---|---|---|
| 1 | BLOCKER | 16:9-Screenshots vs. feste Modellformate (3:2, 1:1): `ziel` hätte jedes echte Bild abgelehnt | Paket liefert je Still `…__edit.png` (grauer Rand auf 3:2, unskaliert); Skript akzeptiert Original- oder Edit-Format; Ingest entfernt den Rand und skaliert zurück (pixelgenau geprüft) |
| 2 | BLOCKER | Erzeugte Bilder liegen wohl nicht als Datei in der Sandbox → Bundle fällt aus, „einzeln“ war schwach | „einzeln“ ist gleichwertiger Weg: Download-Knopf am Bild, Reihenfolge egal, Ingest paart über Ähnlichkeit zum Quell-Still im Zeitfenster Chat-Beginn … Rückgabedatei, Blick nur bei Mehrdeutigkeit; Übersicht nur mit Dateien, sonst Bilder einzeln; Skill prüft den Weg beim ersten Bild |
| 3 | BLOCKER | `sync_github.sh` spiegelt Erfassungs-PNGs öffentlich (auch künftige Hub-Bilder) | Nicht geändert (WS0-Datei): fertige Änderung `VORSCHLAG_sync_github.diff`, im Workflow als Vorbedingung vor dem ersten Lauf; Claude-Skill A2: bis dahin Erfassung unter `_privat/`; AD-Hub-Bilder nur unter `_privat/` |
| 4 | MAJOR | Paket über GitHub-App: Text statt Bytes, Drift erst am Ende | Versuch A gestrichen; Dateien kommen per Hineinziehen; Aufrufzeile trägt die Paket-Prüfsumme, `start --erwarte` bricht sofort ab |
| 5 | MAJOR | Skript kann abgetippt/verändert laufen | Skill kopiert per `find`/`cp`; `start` meldet die Skript-Prüfsumme (muss der in SKILL.md gleichen); Rückgabe trägt sie; Ingest kennt nur `tools/skill_versions.json`; Test erzwingt Gleichstand |
| 6 | MAJOR | Edit verändert Text/Gesichter mit, nur Selbstauskunft | optionaler `bereich` je Befund; Ingest misst die Abweichung außerhalb (ab 25/255 klären) und erzeugt ein Kern-Komposit, das der Blind-Vergleich als Ziel nutzt; Frames nicht mehr im Edit-Aufruf |
| 7 | MAJOR | Clip-Zeit nie gesetzt | `ad_package` rechnet Clip-Zeiten aus `video_beginn_s` + `ereignis_s`; Bewegung ohne Zeitfenster nur mit ausdrücklicher Ausnahme `zeit_unsicher` (im Paket sichtbar); Vorschlag an die Erfassung §11.2 |
| 8 | MAJOR | Äste/Referenzen setzt der Webchat | `aeste` und `referenzen` je Befund im Paket, Skript und Ingest lehnen Abweichungen ab |
| 9 | MAJOR | Leitplanke/Referenzen ungepinnt, Stilwörter ohne Frames, SOP §6 widerspricht | SOP-Stand aus den SOP-Köpfen ins Paket, Skript bricht bei Abweichung ab, Test schlägt bei SOP-Hochzählung fehl; Referenzen per Name aus `KFB_REFERENZEN_R1.md` (nimm/nicht/Äste/Wirksamkeit); jeder malbare Befund braucht eine Referenz mit Frames; SOP-Zeile als Vorschlag §11.3 |
| 10 | MAJOR | Weg „einzeln“ kann falsch paaren | Zeitfenster bis zur Rückgabedatei, Ähnlichkeits-Paarung mit Eindeutigkeitsprüfung, `versandbereit` nur bei eindeutiger oder bestätigter Paarung (`--paarung-ok`) |
| 11 | MAJOR | Vergleichsschleife ohne Werkzeug | `tools/ad_vergleich.py`: prüft Kritiker-Ausgabe, zählt Runden, PASS (B ≥ 8), Besserung, STOPP; `basis` macht relative Pfade eindeutig |
| 12 | MAJOR | WS0-Seite nicht startklar | Claude-Skill mit festen Pfaden, §0 Sitzungsstart-Scan, `pakete.json` löst `--paket` selbst auf; Installation nach `~/.claude/skills` bleibt WS0-Schritt (§11.4) |
| 13 | MINOR | `lauf` immer 1, Dateinamen kollidieren | Lauf in der Aufrufzeile; Dateiname mit Startzeit; `publish` überschreibt keinen vorhandenen Rückgabe-Ordner |
| 14 | MINOR | Übersicht nur 4 Bilder | mehrere Blätter |
| 15 | MINOR | Dubletten, Traceback bei abgebrochenem Download, Schema doppelt | `beendet` bleibt bei Wiederholung gleich; `scan` je run/Familie/Lauf; Ingest meldet unlesbare Datei; Test auf gleiche Schema-Kopien |

## Runde 2 · 23.11. · 12 Befunde, davon 2 Blocker (Fixes aus Runde 1 im Code bestätigt, Push gegen lokales Repo nachgespielt)
| # | Schwere | Befund | Umgesetzt |
|---|---|---|---|
| 1 | BLOCKER | Jedes erzeugte Bild ist sofort sichtbar; „still neu“ und „noch einmal zeigen“ unmöglich; Weg einzeln lädt evtl. nie freigegebene Bilder | Kopfzeile unter jedem Bild (`F03 · Aufprall · Fassung 2`, verworfene „nicht laden“); Download beim PASS in derselben Antwort; nie neu erzeugen zum Zeigen; Ingest schreibt sha256 des zugeordneten Bilds ins Manifest |
| 2 | BLOCKER | Privatschutz nur als Text; Erfassung wird an Ort neu geschrieben und wieder gespiegelt | `build` bricht ab, wenn Quelle oder Paketordner gespiegelt würden (`sync_schuetzt`: `_privat` oder Ausschluss in `sync_github.sh`); Claude-Skill A2 mit Kopie nach `_privat_quelle`; Whitelist-Spiegel abgelehnt, weil Hub-Bilder den Spiegel nutzen (bleibt WS0-Entscheidung §11.1) |
| 3 | MAJOR | Upload wird nicht geprüft (falscher Familienordner) | `start` prüft jede Datei der Familie per sha256 |
| 4 | MAJOR | Erfassung ändert sich, Auswahl nicht festgenagelt (belegt: anderes Paket nach Neuschreiben) | `pin` + Abgleich in `build`; Probelauf aus festgenageltem Schnappschuss; Befund F02 dabei als erledigt erkannt und umgelegt |
| 5 | MAJOR | Weg einzeln brüchig (Zählung, Reihenfolge, Korrektur, Zeitfilter) | alle Kandidaten ab Chat-Beginn, Duplikate ignoriert, Überzählige gemeldet, keine Reihenfolge-Logik, `--paar Ziel=Datei`, `--datei` ohne Zeitfilter, größere Miniaturen |
| 6 | MAJOR | Kein Ausweg für nicht malbare Befunde | `verwerfen --finding --grund` → Ingest `kein_bild` + Hub-Karte |
| 7 | MAJOR | Sandbox-Verlust, `start` überschreibt | `start` verweigert bei vorhandenem Entwurf (außer `--neu`); `--gestartet`, `ziel --fassung`, `ZUSTAND`-Zeile; Skill-Abschnitt Wiederaufnahme |
| 8 | MAJOR | SOP-Version hart gekoppelt, kein Neuauslieferungsweg | Leitplanke und Skript reisen im Paket (Prüfsummen in package.json); `build` verweigert bei veralteter Leitplanke; Skill-Neuupload nur bei geändertem Ablauf (Claude-Skill D) |
| 9 | MAJOR | ChatGPT-Einrichtung unrealistisch (find, Abtippen, Skill-Wahl) | Skript kommt aus dem Upload; Abtippen gestrichen; Aufrufzeile beginnt mit „Nutze den Skill kfb-art-direction:“; Hub-Karte: ohne „Skript-Prüfsumme“-Zeile neuer Chat; Tarif-Prüfung als offener Punkt |
| 10 | MAJOR | Clip-Zeitstempel fehlen | **offen:** Ermittlung per Bildvergleich bräuchte ffmpeg (nicht installiert); bleibt Vorschlag §11.2 an die Erfassung, bis dahin ausdrückliche Ausnahme `zeit_unsicher` mit Laufuhr-Ereignis im Brief |
| 11 | MAJOR | WS0-Seite nicht scharf, relative Pfade | absolute Pfade im Claude-Skill; Scan auch nach `/compact`; Install-Liste in README und §6; Installation selbst bleibt WS0-Schritt |
| 12 | MINOR | Lauf 2, Gates, absolute Pfade, Doku, Rand, Frames | Lauf 2 nach `abschluss` mit Anker-Ordner; `--gates-gruen` + max. 3 × n/a; `basis` relativ; Randprüfung → klären; Frames 1 je Referenz, Durchschlagen im Formattest prüfen (§11.5c) |

## Runde 3 · 23.11. · 10 Befunde, davon 1 Blocker (Fixes aus Runde 1 und 2 im Code bestätigt; eigene Randfälle auf Temp-Kopie)
| # | Schwere | Befund | Umgesetzt |
|---|---|---|---|
| 1 | BLOCKER | Weg einzeln: Ähnlichkeit wählt die am wenigsten veränderte Fassung; versehentlich geladene ältere Fassung wird „eindeutig“ zugeordnet | Kandidaten je Ziel erst ab PASS-Zeit − 30 s; „mehrdeutig“, sobald ein weiteres Bild demselben Quell-Still am nächsten ist; PASS-Zeit in der `ZUSTAND`-Zeile und `freigabe --zeit` bei Wiederaufnahme; Regressionstests `Einzeln` |
| 2 | MAJOR | SOP-Abgleich in `build` ließ Äste/Referenzen R2 durch | Abgleich auf den vollen Eintrag (`KFB_SOP_AESTE_R1.md@R1`) |
| 3 | MAJOR | Paket r2 kollidiert im Repo und im Register | Repo-Pfad `ad/<run_id>/paket_<rev>/`, `pakete.json` je Revision, Ingest löst über die Revision der Rückgabe auf |
| 4 | MAJOR | Lauf 2 nur dokumentiert | `stage --lauf n --anker <PASS-Bild> --nur F..` (Ordner `<run>_<rev>_<F>_l<n>`, Aufrufzeile fertig), `start --nur` (übrige Befunde „anderer Lauf“, Ingest `anderer_lauf` ohne Hub-Karte), Skill-Absatz zum Anker |
| 5 | MAJOR | Bildwerkzeug beendet die Antwort | Ablauf „ein Bild je Antwort“: Kopfzeile vor dem Bild, Prüfung/„verworfen“ in der nächsten Antwort, Georg antwortet nach jedem Bild; Formattest um (d) Antwortende und (e) byte-gleiche Uploads ergänzt |
| 6 | MAJOR | Prüfsummen-Zeile nie angewiesen | Skill: erste Antwortzeile = erste Zeile der start-Ausgabe, wörtlich |
| 7 | MAJOR | Private Medien in Vergleichsrunden und auf Hub-Karten | `vergleich.json` gibt die Ablage `…/_privat/vergleich_<F>_r<n>/` vor; `ad_vergleich runde` verlangt `--erfassung` und lehnt gespiegelte Ordner ab; AD-Bilder an Georg per SendUserFile, Hub-Karte nur mit Text und privatem Link |
| 8 | MINOR | `sync_schuetzt` passte nicht zu `sync_github.sh` | realpath + Groß/klein-unabhängig; sicher nur außerhalb von 30_DECISIONS/65_SCENELETS oder unter `replies/<…>/_privat…`; `replies/_privat` und CANON_3D gelten als öffentlich |
| 9 | MINOR | Randfälle Rückgabe/Ingest | 0 PASS ohne Bildsuche; Texte nur bei Befunden mit PASS; sha-Abweichung im Weg einzeln nur Hinweis; `verwerfen` nach PASS verweigert |
| 10 | MINOR | Drift des hochgeladenen SKILL.md | Kopf „Ablauf r1“ im SKILL.md, `ablauf` in package.json, `start` gibt ihn aus, Chat stoppt bei Abweichung; Verweis in §11.5 korrigiert |

**Ende der Review-Schleife:** Drei Runden laut Auftrag; die Befunde aus Runde 3 sind umgesetzt und durch `lauf.sh` und 33 Tests abgedeckt, eine vierte Runde gab es nicht.
**Bewusst offen:**
- Clip-Zeitstempel in der Aqua-Erfassung (§11.2, Ausnahme `zeit_unsicher`).
- Öffentlicher Spiegel (§11.1, WS0/Georg).
- Formattest im ersten echten Chat (§11.5).
- Skill-Funktion in Georgs Tarif.
