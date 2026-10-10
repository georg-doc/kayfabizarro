#!/usr/bin/env python3
"""Baut decisions.json + DECISIONS.md. Handgepflegte Einträge stehen in ENTRIES (nur ergänzen, nie umschreiben;
Ersetzen über 'supersedes'). Teil B importiert automatisch Georgs PASS/TUNE/FAIL aus ACCEPTANCE_INDEX (Skript im Lab)."""
import json, os, re, subprocess, datetime
H = os.path.dirname(os.path.abspath(__file__))
LAB = os.path.expanduser('~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab')
E = []
def d(id, date, area, verdict, text, owner='Lab', check='ungeprüft', source='Chat Steuer-Sitzung', values=None, supersedes=None):
    E.append(dict(id=id, date=date, area=area, verdict=verdict, text=text, values=values or {}, owner=owner, check=check, source=source, supersedes=supersedes))
# --- Prozess ---
d('V-001','2026-10-10','Prozess','RULE','USE WHAT WORKS: Vorlage zuerst; Nachbau ohne Freigabe = nicht bestanden.', 'alle', 'Vorlage-zuerst-Zeile je Teil', 'docs/MVP1_DONOR_AND_MODEL_MAP_R1.md §0')
d('V-002','2026-10-10','Prozess','RULE','Georg gestaltet, wir bauen Werkzeuge (God-Mode-Editor); keine Kritiker-Endlosschleifen, Abnahme durch Georg im Spiel.', 'Steuerung', 'Plan R1 §0', 'docs/KFB_WORLDBUILDER_PLAN_R1.md')
d('V-003','2026-10-11','Prozess','RULE','Entscheidungen leben hier (30_DECISIONS) mit PASS/TUNE/FAIL; sofort eintragen und mit Nummer bestätigen; Prüfung vor jeder Lieferung.', 'Steuerung', 'tools/parity + Bericht listet ungeprüfte V-Nummern')
d('V-004','2026-10-10','Prozess','RULE','Agenten-Briefings verweisen zuerst auf PASS/TUNE/FAIL bzw. ACCEPTANCE_INDEX; „nicht gefunden in …“ statt „gibt es nicht“.', 'Steuerung')
d('V-005','2026-10-10','Prozess','RULE','Höchstens zwei Baustellen gleichzeitig; Plan R1 ist maßgeblich.', 'Steuerung', 'Plan R1')
d('V-006','2026-10-10','Prozess','RULE','Disk-Regel: ≥ 40 GB frei vor schweren Läufen, Blender nur headless mit Watchdog.', 'alle')
d('V-007','2026-10-10','Prozess','RULE','Georg nie um Git-Bedienung bitten; Dateien als Links bzw. Karten liefern.', 'Steuerung')
d('V-008','2026-10-10','Prozess','RULE','Token sparen: Standbilder statt Video, wo es reicht; keine breiten Suchen.', 'alle')
d('V-009','2026-10-11','Prozess','RULE','Doku-Pflicht für die Steuerung: alle Entscheidungen, Designs und Vorgaben sofort ins Living Doc (diese Datei + Plan R1) plus additiver CHANGELOG.md (neueste oben, nie umschreiben), mit Nummer bestätigen.', 'Steuerung', 'jede Antwort mit neuer Vorgabe nennt die V-Nummer')
# --- Look ---
d('V-010','2026-10-10','Look','PASS','Joyride J17 ist Goldstandard für den Gesamt-Look: Strecke, rote Banden, orange Fahrbahn, Cartoon-Deformer, Kamera, Paletten. „absoluter Goldstandard … gesetzt“.', 'Lab', 'Bildvergleich gegen J17 pictures/chase-*.jpg', 'docs/POSTMORTEM_JOYRIDE_REGRESS_R1.md')
d('V-011','2026-10-10','Look','RULE','Keine harten Schnitte bzw. sichtbaren Kanten an Übergängen; organische Knet-Cartoon-Logik.', 'alle', 'Q8/Fugen-Test')
d('V-012','2026-10-10','Look','RULE','Diorama-Materialmix erlaubt (Knete, Balsa, Pappe, Kork, Filz, Moos); nie konstruiert oder repetitiv.', 'alle', 'Bild')
d('V-013','2026-10-10','Look','RULE','Generierte Bildblätter sind Stil-Richtung („Serviervorschlag“), nicht Pflicht-Abbild; bauarm, stilisierter Claymation.', 'alle', 'Bild')
d('V-014','2026-10-10','Look','FAIL','RKIT-Test-Hub in Vorschauen (quergestellte Teilbanden, flacher Asphalt, Gehwegplatten, Nicht-Joyride-Muster).', 'Lab', 'Vorschau-Bühne = Demo-Insel; ?rkit=1 nur Debug')
d('V-015','2026-10-10','Look','RULE','Weltlogik zuerst: jedes Element braucht eine Geschichte (wer, was, warum); Inseln = Schollen der zersprengten Erde.', 'alle')
# --- Steuerung / Kamera ---
d('V-020','2026-10-10','Steuerung','PASS','W = Joggen (Running_A ≈ 1,40 H/s), Shift+W = Sprint (Running_B ×1,3 ≈ 2,22 H/s), Strg+W = Gehen. „passt so erstmal“.', 'Lab', 'parity: gait', 'docs/critic/lab-stage2/2026-10-10_08/REPORT.md', {'jog_H_s':1.40,'sprint_H_s':2.22,'walk_H_s':0.29})
d('V-021','2026-10-11','Steuerung','RULE','Nur EIN Gangschema (J17-Travel-Core) für alle Spiel-Einstiege; walk.ts stillgelegt.', 'Lab', 'parity: beide Einstiege')
d('V-022','2026-10-11','Steuerung','RULE','WoW-Schema: ohne Maus A/D drehen, Q/E strafen; RMB = Maus lenkt Figur, A/D strafen; LMB = nur Kamera; beide = vorwärts.', 'Lab', 'parity: mouse-steer')
d('V-023','2026-10-11','Steuerung','RULE','Sprung: Leertaste im Stand = auf der Stelle; aus Joggen = vorwärts; Shift+Leertaste aus Sprint = Weitsprung (Jump_Full_Long).', 'Lab', 'parity: jumps')
d('V-024','2026-10-11','Steuerung','TBD','Doppel-Leertaste = Flug-Modus bzw. Jetpack (WoW-Logik, schon gemessen) – später.', 'Lab')
d('V-025','2026-10-11','Kamera','RULE','Spielmodus: Zoom Rad/Touchpad (normalisiert, gedämpft) bis Ich-Perspektive; träges Recenter hinter die Figur bei Bewegung; Default-Position per Slider (Rollercoaster-Vorlage).', 'Lab', 'parity: camera')
d('V-026','2026-10-11','Kamera','RULE','God-Mode: Zoom zum Cursor, nicht zu empfindlich; Orbit ohne Ruckeln (geglätteter Arm).', 'Lab', 'parity: camera-calm ≤ 0,05 lab/Frame')
d('V-027','2026-10-10','Kamera','RULE','Verdeckung: Auto 35 % Dither; Sicht-Loch mit Knetrand Option für Gebäude.', 'Lab')
# --- Fahren / Auto ---
d('V-030','2026-10-10','Auto','PASS','MVP-1 fährt geschlossenes Retro-Auto (Cicada), Figur beim Fahren unsichtbar; Cabrio nach dem MVP.', 'Lab', 'parity: default car', 'Masterplan §3')
d('V-031','2026-10-10','Auto','TUNE','Ein- und Aussteigen (Hop) als Arbeitsstand: „etwa 30 % … so nehmen, bevor wir uns verkünsteln“; Rückfall Überblenden.', 'Lab')
d('V-032','2026-10-10','Fahren','RULE','Fahrphysik = J17 k2b bytegleich; Auto vor dem Bordstein halten (Band = Bord − ½ Breite − 0,15).', 'Lab', 'md5 k2b')
d('V-033','2026-10-10','Animation','TBD','Cartoon-Prinzipien Anticipation, Impact, Recovery (Nachfedern nach dem Hop); Hut-Artefakte ggf. metanarrativ.', 'Lab')
# --- HUD / Klang / Almanach ---
d('V-040','2026-10-10','HUD','PASS','HUD = Claude-Design-HUD R3 komplett inkl. Rucksack-Overlay und Jukebox-Daten; KEIN Joyride-HUD. Ohne Rucksack nicht abnahmefähig. Spiel↔God-Mode-Plakette.', 'Lab', 'Bild + md5 vendor', 'docs/critic/lab-hud/2026-10-10_01/')
d('V-041','2026-10-10','HUD','RULE','Keine Messdaten bzw. Debug-Werte im Spiel (nur ?debug=1).', 'Lab', 'parity: no-debug')
d('V-042','2026-10-10','Klang','RULE','Ein AudioContext, Insel-Bett je Insel, Radio im HUD; Radio auch zu Fuß, wenn das Kassettenradio im Rucksack ist.', 'Lab', 'Bericht', 'docs/critic/lab-sound/2026-10-10_01/')
d('V-043','2026-10-11','Almanach','RULE','Fächer rechts, senkrecht gerade nach unten, letzte 7 + „+N“; Klick → Overlay mit Deck/Welt-Reitern und Raster der Viertel → Viewer.', 'Lab', 'Bild')
# --- Licht / Himmel / Farben / Wasser ---
d('V-050','2026-10-10','Licht','TUNE','Licht-Profile Tag/Abend/Nacht/Innen aus SKY3; Abend zu orange und zu dunkel.', 'Lab', 'Bild', 'docs/critic/lab-sky/2026-10-10_01/')
d('V-051','2026-10-10','Farben','RULE','Insel-Thema = Sechser-Palette aus Joyride (canyon, bucht, otown + Ableitungen) + Licht + Klang + Biom + Story-Tint; ein Generierungsschritt (God-Mode, Generator, Spieler).', 'Lab', 'Schema kfb.island-theme/1')
d('V-052','2026-10-10','Wasser','PASS','Claude-Design-Wasser F0–F2 inkl. Ufergelände und aller Fixes (keine Haarlinien, Faltung, Säume, Kantenartefakte). „auf keinen Fall verlieren“.', 'Lab', 'Bild', 'donors/kfb-island-kit-r2-2026-10-08/STATUS.md')
d('V-053','2026-10-10','Knete','RULE','Figuren: dezentes Resident-Atlas-Profil (fine); Umgebung: Kanon 07.10. mit Nahband.', 'Lab', 'parity: clay-profile', 'docs/BASELINE_ACCEPTED_R1.md §4')
# --- Figuren ---
d('V-060','2026-10-10','Figuren','RULE','Figuren werden nie skaliert; Maßstab K2 (H = 3,64).', 'alle', 'parity: scale')
d('V-061','2026-10-10','Figuren','RULE','Figuren-Auswahl: alle KayKit Medium/Large/Legacy, FB v4/v3/v5, alle Textur- und Farbvarianten, KFB-Eye-Rig in Georgs gespeicherter Konfiguration.', 'Lab', 'Kontaktbogen + Tabelle')
d('V-062','2026-10-10','Figuren','RULE','Studio-Übernahme 1:1: kein Regler, keine Einstellung geht verloren (inkl. Viseme aus Frankenstein- bzw. Patch-Studio).', 'Lab', 'Regler-Inventur')
# --- Assets / Lizenzen ---
d('V-070','2026-10-10','Assets','RULE','Quellen-Reihenfolge: KayKit > Tiny Treats > Quaternius (Natur) > Kenney.', 'alle')
d('V-071','2026-10-10','Lizenz','RULE','Gekaufte Assets (StreakByte, Unity, Cozy Tunes) und private Audio-Dateien nie in ein öffentliches Repo.', 'alle', 'Push-Prüfung', 'docs/KFB_PROJEKTKONTEXT.md')
d('V-072','2026-10-10','Assets','RULE','Freie Asset-Branches (CC0/eigene Inhalte) darf die Steuerung bei grünen Checks selbst nach main mergen.', 'Steuerung')
# --- Inseln / Editor ---
d('V-080','2026-10-10','Inseln','RULE','Die 8 StreakByte-Demo-Inseln bleiben, wie sie sind; keine davon ist KFB Town (baut Georg selbst).', 'Lab')
d('V-081','2026-10-10','Editor','RULE','God-Mode-Editor: Terrain-Pinsel, Asset-Overlay (Librarian), Resident-Atlas-Inline-Editor mit Snap/Ground, Muster-Pinsel, Terrain-Painter mit Dots-Übergang, Insel-Thema.', 'Lab', 'Plan F')
d('V-082','2026-10-10','Editor','TBD','Fluff-Zonen (Baum füllen, Mine/Terrain graben, Beete, Angeln) – später.', 'Lab')
d('V-083','2026-10-11','Interaktion','TBD','Tab-Ziel, Angriff per Maustaste, Fluff abschießen/abklopfen mit Zerstörung und Nachwachsen, Action-Bar 1–6 – später.', 'Lab')
d('V-084','2026-10-10','Claude Design','FAIL','Town-Massemodell R1: Claude Design baut keine 3D-Geometrie mehr.', 'Steuerung', '-', 'docs/critic/claude-design/town-massemodell-r1-FAIL_2026-10-10/')
# --- WARUM und WANN (Georg 11.10.: „why & when für decisions“) ---
# WANN = Datum der Entscheidung (Feld date) + ab wann bzw. in welcher Phase sie gilt (applies).
WHY = {
 'V-001':('Nachbauten haben Abgenommenes verloren und Fehler doppelt gebaut (Post-Mortem Stufe 1).','sofort, jede Sitzung'),
 'V-002':('LLM-Gestaltung scheitert an Komposition und Raum; Georgs Geschmack ist der Maßstab, Werkzeuge können wir.','ab Plan R1'),
 'V-003':('Entscheidungen gingen in Fließtext verloren; der Ordner 30_DECISIONS war vereinbart und blieb leer.','ab 11.10.'),
 'V-004':('Ein Agent meldete „kein Zitat“ trotz PASS-Spalte; schlechtes Briefing kostete Tokens und Vertrauen.','jede Recherche'),
 'V-005':('Zu viele parallele Baustellen, keine wurde fertig.','ab Plan R1'),
 'V-006':('Ein Blender-Lauf blähte sich auf 71 GB auf und füllte die Platte.','jeder schwere Lauf'),
 'V-007':('Git- bzw. CI-Rückfragen überfordern und frustrieren; tiefe Pfade sind im Finder nicht klickbar.','immer'),
 'V-008':('17 % des Limits verbrannt ohne sichtbaren Fortschritt.','ab 11.10.'),
 'V-009':('Damit kein Design und keine Entscheidung mehr verloren geht; Living Doc statt Chat-Gedächtnis.','ab 11.10., jede Antwort'),
 'V-010':('Joyride war gesetzt; eng gestellte Frage („nur Physik“) führte zum Regress auf RKIT-Platten.','sofort; Phase C Rückgrat'),
 'V-011':('Sichtbare Nähte bzw. Geisterlinien waren der häufigste Bildfehler.','immer'),
 'V-012':('Handgebauter Diorama-Look statt CAD; Materialmix macht es lebendig.','immer'),
 'V-013':('Bildgenerierung zeigt Ideale, die nicht 1:1 baubar sind; Kritiker-Schleifen zum Nachbilden sind teuer.','ab 10.10.'),
 'V-014':('Test-Hub-Reste wirken wie Bastelarbeit und verfälschen jede Abnahme.','ab 10.10., jede Vorschau'),
 'V-015':('Elemente ohne Geschichte wirken beliebig (Mittelalter-Generik).','immer'),
 'V-020':('Gehen als Standard war zu langsam; Georgs dokumentierte Werte aus game_r5.','ab Probe 6'),
 'V-021':('Zwei Pfade (walk.ts vs. Travel-Core) erzeugten den Regress im Spiel.','ab B0'),
 'V-022':('Vertrautes Schema; Georg will WoW-Gefühl.','ab B0'),
 'V-023':('Sprünge müssen zum Bewegungszustand passen.','ab B0'),
 'V-024':('Flug kommt später; Taste wird freigehalten.','später'),
 'V-025':('Orientierung und Komfort wie in WoW.','ab B0'),
 'V-026':('Orbit ruckelte, Zoom zu empfindlich.','ab B0'),
 'V-027':('Figur muss sichtbar bleiben.','ab Stufe 2'),
 'V-030':('Cabrio bringt Ein-/Ausstieg, Lenkrad und Kamera-Komplexität ohne MVP-Gewinn.','MVP-1'),
 'V-031':('Details später; erst Environment sauber.','MVP-1'),
 'V-032':('Abgenommenes Fahrgefühl; Bordstein-Stöße sagten nichts aus.','ab Probe 6'),
 'V-033':('Cartoon-Qualität kommt nach der Grundstruktur.','später'),
 'V-040':('Das gestaltete HUD mit Rucksack existierte schon; Joyride-HUD wäre Rückschritt.','ab Phase A'),
 'V-041':('Cleanes Interface statt Messdaten im Spiel.','ab Phase A'),
 'V-042':('Klang je Insel und Radio als Spielgefühl; Radio als Rucksack-Gegenstand ist Weltlogik.','ab Phase A'),
 'V-043':('Skalierbar für tausende Karten.','ab Phase A'),
 'V-050':('Tag-Nacht-Grundlage; Abend braucht Feintuning.','ab Phase A'),
 'V-051':('Farben, Licht und Klang gehören zusammen und sollen generierbar sein.','ab Phase A, Generator in F'),
 'V-052':('Gut funktionierender Slice, nicht wieder verlieren.','Phase B+'),
 'V-053':('Figur zu grob, Umgebung ohne Knete – Drift gegen den Kanon.','Phase B'),
 'V-060':('Figuren-Proportionen sind festgelegt; Welt passt sich an.','immer'),
 'V-061':('Qualitätskontrolle für Knete, Augen, Licht je Figurenklasse.','Phase B2'),
 'V-062':('Frühere Ports verloren Regler (z. B. Viseme).','Phase H'),
 'V-070':('KayKit, Tiny Treats und Quaternius passen zum Cartoon-Look, Kenney ist generischer.','immer'),
 'V-071':('Lizenz bzw. EULA.','immer'),
 'V-072':('Georg will keine Klick-Aufträge für reine Asset-Merges.','immer'),
 'V-080':('Studieren und nutzen statt umbauen; Town ist Georgs eigene Insel.','ab 10.10.'),
 'V-081':('Georg gestaltet selbst schneller und besser.','Phase F'),
 'V-082':('Spielmechanik Fluff, später.','nach F'),
 'V-083':('Chill-&-Fun-Interaktion, später.','nach F'),
 'V-084':('Prozedurale Primitive können keine Claymation; Regress.','ab 10.10.'),
}
for e in E:
    w = WHY.get(e['id'], ('', ''))
    e['why'], e['applies'] = w
# --- Teil B: automatisch aus ACCEPTANCE_INDEX ---
idx = os.path.join(LAB, 'docs/ACCEPTANCE_INDEX.md')
subprocess.run(['python3', os.path.join(LAB, 'tools/acceptance/build_index.py')], stdout=open(idx, 'w'), stderr=subprocess.DEVNULL)
imp = []
for l in open(idx, encoding='utf-8'):
    m = re.match(r'\| `(.+?)` \| (.*?) \| (.*) \|$', l.strip())
    if m and m.group(1) != 'Datei:Zeile': imp.append(dict(source=m.group(1), part=m.group(2), georg=m.group(3)))
json.dump(dict(schema='kfb.decisions/1', updated=str(datetime.date.today()), entries=E, imported_acceptance=imp), open(os.path.join(H, 'decisions.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
md = ['# KFB Entscheidungen (PASS / TUNE / FAIL / RULE / TBD)', '', f'Stand {datetime.date.today()} · erzeugt aus `build_decisions.py` · Teil A handgepflegt (nur ergänzen), Teil B automatisch aus den STATUS- bzw. RETURN-Dateien.', '', '## A · Entscheidungen und Vorgaben', '', '| Nr | Datum | Gilt ab | Bereich | Urteil | Vorgabe | Warum | Besitzer | Prüfung | Quelle |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |']
for e in E: md.append(f"| {e['id']} | {e['date']} | {e['applies']} | {e['area']} | **{e['verdict']}** | {e['text']} | {e['why']} | {e['owner']} | {e['check']} | {e['source']} |")
md += ['', f'## B · Abnahmen aus Projektdateien ({len(imp)})', '', '| Datei:Zeile | Teil | Georg |', '| --- | --- | --- |']
md += [f"| `{r['source']}` | {r['part']} | {r['georg']} |" for r in imp]
open(os.path.join(H, 'DECISIONS.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(len(E), 'Einträge,', len(imp), 'importiert')
