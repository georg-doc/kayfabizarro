# HOUSEKEEPING — KFB 3D-Table (living document)

> **Arbeitsstandard:** `docs/00_SO_ARBEITEN_WIR.md` — gilt für jede Baustelle hier, auch für die
> pausierten. Wer eine alte Baustelle wieder aufnimmt, liest die Seite zuerst.

## Stand 2026-09-06 · aktiver Scope: **KFB Boxel Blitz v4** — Würfelphysik, Wurfmodell, Verformung

| Artefakt | Status | Anmerkung |
|---|---|---|
| `KFB Boxel Blitz v4.dc.html` | **AKTIV** | Deliverable. Kopfzeile V4-S35/36 (Arbeitstitel »Boxel Banger Blitz«), Decke aus der kurzen Feldseite, zufällige Karte je Runde, Vorschaubild für den Export |
| `boxelblitz-v4/dice.v4.js` | **AKTIV** | Spielschicht. In dieser Sitzung: Materialpfad, Wurfmodell (Druck→Höhe, Zug→Tempo), Verformung, Hitstop, Zieldarstellung **stillgelegt** (`aimShow:false`), Anker der Totzone |
| `boxelblitz-v4/cube.v3.js` | **AKTIV · neu** | Fork von `cube.v2.js`. Materialmodell (sechs Paare), Decke am Körper, Aufrichten nach Frist statt Hüpfer |
| `boxelblitz-v4/surfaces.v1.js` | **AKTIV · neu** | Eigentümer der sechs Restitutionen samt gemessener Löser-Kennlinie |
| `boxelblitz-v4/cube.v2.js` | **SUPERSEDED · Rückweg** | eine globale Restitution 0,3 (»nasser Sack«). Bleibt liegen — eine Zeile in `dice.v4.js` zurück |
| `boxelblitz-v4/cube.v1.js` | **SUPERSEDED · Rückweg** | eigener Löser vor cannon |
| `cardbuilder/kfb-card-builder.js` | **AKTIV · GETEILT** | ⚠ **von mehreren Baustellen benutzt.** In dieser Sitzung additiv erweitert (`backUrl`: KFB-Rückseite als Wartezustand) — Podcast und SpinballCast bleiben unberührt |
| `boxelball-v1/*` · `boxelblitz-v2/*` | **AKTIV · GETEILT** | Ladeweg der eingefrorenen v1/v2 **und** teils der v4. Nicht als tot einstufen |
| `docs/boxelblitz-v4/LIVING_boxelblitz_v4.md` | **AKTIV · SSOT** | additiv, neueste Zeile oben. V4-S9 … V4-S36 ist diese Sitzung |
| `github.md` | **AKTIV** | Repo-Anbindung: `uuuulala/Threejs-rolling-dice-tutorial` (Vorbild), `pmndrs/cannon-es`, `georg-doc/kayfabizarro` (Skills) |
| `export/KFB Boxel Banger Blitz v4 standalone.html` | **⚠ FIX-KANDIDAT** | 793 kB, gebaut. Kopfzeile rendert, **eine Skriptdatei lädt nicht** → die 3D-Szene bleibt leer. Ursache: die ES-Modulkette mit Importkarte (≈40 relative Modulimporte). **Nicht auslieferbar**, siehe Fix-Kandidaten |
| `captures/boxelblitz-v4/` (90 Bilder) | **Abnahme-Captures** | jede Messung dieser Sitzung. **Aufräum-Kandidat:** die `01-`/`02-`-Paare sind Doppel aus mehrstufigen Aufnahmen |

### Clean-Run-Checkliste (Boxel Blitz v4)

1. Datei lädt, Konsole ohne Fehler; Messgriff `window.__kfbBoxelBall`.
2. **`document.hidden` parkt die Bildschleife** — sechstes Mal bezahlt. Wer einen Zustand ändert und
   nicht selbst `tick()` ruft, sieht den Zustand von VORHER. Zahlen ins Bild schreiben, dann
   Bildschirmfoto.
3. Versionen prüfen: `dice.dice[0].body.stats().version` = `cube-v3.0-cannon-material` ·
   `surfaces.stats().version` = `surfaces-v1.1`. **Eine Versionsnummer ist ein Messwert.**
4. `dev.klickProbe(0.45, 1, 0)` muss **Ladung 1,000** melden — das ist der Wächter über V4-S34
   (Totzone am Zeigeranker statt am Würfel).
5. `dev.ladeProbe(1,0,1,0)` muss **40 %** Stauchung melden, `dev.neigeProbe(1,0.5,1,0)` **13,98°**
   und einen **negativen** »Deckel nach vorn« (kippt gegen den Schuss).
6. Sohle: `neigeProbe` in vier Zuständen → Abstand zur Fläche **0,0000**.

### Fix-Kandidaten (nur benannt, nichts ausgeführt)

| Kandidat | Empfehlung |
|---|---|
| `export/…standalone.html` lädt eine Skriptdatei nicht | eigene Scheibe: die Modulkette für den Einzeldatei-Export vorbereiten (Importkarte auflösen, Module als Blobs). **Nicht** im Vorbeigehen |
| `captures/boxelblitz-v4/` 90 Bilder, davon ~58 als `01-`/`02-`-Doppel | nach Georgs Freigabe: nur die Abnahmebilder je Scheibe behalten |
| `media/…/FreeHitVfx/textures/t_stylizedhit_1.png` | unverändert offen: relativer Pfad ohne kanonischen Rückweg (aus dem v2-Stand) |
| Zieldarstellung in `dice.v4.js` | steht vollständig, aber stillgelegt (`aimShow:false`). **Nicht löschen** — sie ist die Vorlage für den Neubau (Band statt Strichkette) |

---

## Stand 2026-09-05 · aktiver Scope: **KFB Boxel Blitz v2** — Zufallsfarben, Lichthof auf eigener Ebene

| Artefakt | Status | Anmerkung |
|---|---|---|
| `KFB Boxel Blitz v2.dc.html` | **AKTIV** | Deliverable. three **0.160** (der Sprung auf 0.185 wurde gemessen und **zurückgenommen**). Neue Props: `palette` mit `zufall` als Vorgabe, `spread`, `fieldSeed` |
| `KFB Boxel Blitz v1.dc.html` | **FROZEN · Rückweg** | hängt an `boxelball-v1/*` — **nicht** anfassen, das ist der Weg zurück |
| `boxelblitz-v2/palette.v1.js` | **AKTIV · neu** | Zufallspaletten in gemessenen Grenzen. Kennt kein three und keine Zelle → **auch für Combat und die nächsten Spiele brauchbar**, ohne eine Zeile zu ändern |
| `boxelblitz-v2/boxel.v2.js` | **AKTIV** | Fork von `boxelball-v1/boxel.v1.js`, zwei Änderungen (Palette als Objekt · Farbverteilung zufällig) |
| `boxelblitz-v2/bloom.v2.js` | **AKTIV** | Lichthof auf eigener Ebene (`GLOW_LAYER` = 5). Abnahme: leere Ebene → Bild **bitgenau** identisch |
| `boxelblitz-v2/faces.v2.js` | **AKTIV** | Fork, eine Änderung: jedes Gesicht auf einer anderen Boxelfarbe |
| `boxelblitz-v2/hitfx.v2.js` | **AKTIV** | Fork, zwei Änderungen für die Ebenen-Trennung. **Georgs Entscheidung: bleibt drin, bis Ersatz da ist** — sein Urteil über die Form steht (»falsch und billig«) |
| `boxelblitz-v2/gutter.v5.js` · `stack.v2.js` · `cardshadow.v1.js` · `juice.v2.js` | **AKTIV** | unverändert aus V2-S1/S3/S4/S5 |
| `boxelblitz-v2/bloom.v1.js` | **SUPERSEDED · Rückweg** | hellte das ganze Bild um 25 % auf. **Bleibt liegen**, die Begründung im Kopf ist die Landkarte des Fehlers |
| `boxelblitz-v2/hitfx.v1.js` | **SUPERSEDED · Rückweg** | Elter des Forks |
| `boxelball-v1/*` (7 Dateien im Ladeweg) | **AKTIV · GETEILT** | ⚠ **v1 UND v2 importieren daraus.** `boxel.v1.js`, `faces.v1.js`, `juice.v1.js`, `stack.v1.js`, `gutter.v4.js` sehen wie überholt aus, sind aber der **aktive Ladeweg der eingefrorenen v1**. Nicht als tot einstufen |
| `boxelball-v1/pet-eye-rig.v5.js` · `pet-mouth.v1.js` | **ASSET · byteidentische Kopien** | aus Pet Studio v9-2. Kopieren, nicht nachbauen — nie ändern |
| `boxelball-v1/edge3.jpg` | **ASSET · lokal + RAW-Rückweg** | 2 kB. Hat eine kanonische Adresse als Rückfall (`EDGE_CANON`), läuft also auch ohne die Datei |
| `cardbuilder/` (3 Dateien) | **AKTIV · GETEILT** | Kartenbauer, von mehreren Baustellen benutzt |
| `docs/boxelblitz-v2/LIVING_boxelblitz_v2.md` | **AKTIV · SSOT** | additiv, neueste Zeile oben. V2-S8 bis S12 ist der jüngste Teil |
| `docs/boxelblitz-v2/AUFTRAG_designkritik_vfx_sfx.md` | **AKTIV · erste Handlung des nächsten Chats** | Designkritik und Audit VFX **plus SFX** vor jedem Bau |
| `docs/boxelblitz-v2/ONBOARDING_v2_juice.md` | **AKTIV · Referenz** | mentales Modell, Scheiben-Reihenfolge, Abnahmezahlen |
| `docs/boxelblitz-v2/ERHEBUNG_three_sprung.md` | **AKTIV · Landkarte** | die drei Stellen, die in three hineinoperieren. Gilt weiter, obwohl der Sprung zurückgenommen ist |
| `captures/v2-s8/` (5 Bilder) | **Abnahme-Captures** | 01 Zufallsfarben · 02/04 Lichthof · 03/05 Messung im Bild |
| `media/3D_Assets/FX_Visual/FreeHitVfx/textures/t_stylizedhit_1.png` | **ASSET · Fix-Kandidat** | 270 kB, hängt an einem **relativen** Pfad OHNE kanonischen Rückweg — der einzige im Ladeweg. Siehe Fix-Kandidaten unten |

### Clean-Run-Checkliste (Boxel Blitz v2)

1. Datei lädt, Konsole ohne Fehler; Messgriff `window.__kfbBoxelBall`.
2. **`document.hidden` parkt die Bildschleife** → im Vorschaufenster steht die Uhr auf 0, das Feld
   hat 0 Zellen, die Leinwand lässt sich nicht zurücklesen. Sieht wie ein kaputter Bau aus und ist
   keiner. **Dreimal bezahlt.** Wer eine Zahl braucht, schreibt sie IN das Bild und macht ein
   Bildschirmfoto — `setContext` und `render` selbst rufen.
3. Versionen prüfen: `bloom.stats().version` = `bloom-v2.0` · `hitfx` = `hitfx-v2.0` · `faces` =
   `faces-v2.0`. **Eine Versionsnummer ist ein Messwert**, nicht eine Aufschrift — sie ist der
   einzige Weg zu sehen, ob ein Rückweg gegriffen hat.
4. Lichthof: `bloom.dev.identitaet()` → `urteil: 'bitgenau'`, 0 abweichende Bildpunkte.
5. Lichthof arbeitet: `hitfx.fire(...)`, dann `bloom.dev.hof()` → `ringGewinn` > 1, **`dunklerePunkte` 0**.
6. Effekt-Ebene nicht blind: `bloom.dev.ebeneVoll()` → `gesamt` = `angemeldet`.
7. Farben: `faces.stats()` → `farben` = `gesichter` und **`farbverzicht` dabei ablesen** (ein
   gleicher Wert ohne diese Zahl sieht nach Erfolg aus, obwohl der Filter nicht gegriffen hat).
8. Belichtung steht auf **0,95** (`stage.v1.js`) — die 0,48 galt nur für three 0.185 und ist mit
   der Rücknahme des Sprungs hinfällig.

### Fix-Kandidaten (Pfad-Hygiene) — BENANNT, NICHT AUSGEFÜHRT

- **`hitfx.v2.js` · `texUrl`** ist der EINZIGE relative Asset-Pfad im Ladeweg ohne kanonischen
  Rückweg. Beim Re-Home ohne die Datei daneben fällt die Treffer-Form aus — sie **meldet** es
  immerhin (`stats().ladung = 'FEHLT: …'`), aber sauber ist derselbe Doppelweg wie bei `edge3.jpg`:
  lokal zuerst, RAW-Adresse als Rückfall.
  ⚠ **Ich setze die RAW-Adresse nicht selbst**, weil ich nicht gemessen habe, dass die Datei im Repo
  unter diesem Pfad liegt — eine plausible Adresse ist keine geprüfte. **Frage an Georg.**
  Solange offen: die 270 kB reisen im Export mit, dann läuft der Re-Home in jedem Fall.
- Alles andere ist schon sauber: Münder, Zahnrad, Würfel, Rost-Texturen gehen über RAW-Adressen und
  durch `mirror.v1.js`.

### Cleanup-Kandidaten aus dieser Session — BENANNT, NICHT AUSGEFÜHRT

- `captures/v2-s8/03-diagnose.png` und `05-farbregel.png` — **Mess-Bilder mit Textschicht**, kein
  Bild-Beleg. Ihre Zahlen stehen im LIVING-Dokument. Nach Sign-off löschbar.
- `uploads/Bildschirmfoto 2026-09-05 um 13.27.50.png` — Georgs Feedback-Bild zu den zu ähnlichen
  Farben, **verarbeitet** (V2-S8c). Nach Sign-off löschbar.
- `boxelblitz-v2/bloom.v1.js` und `hitfx.v1.js` — **NICHT löschen.** Beide sind der dokumentierte
  Rückweg und tragen die Begründung des Fehlers im Kopf.
- `boxelball-v1/*` — **NICHT löschen.** Geteilt mit der eingefrorenen v1.

### Die Regeln, die diese Session gekostet haben

1. **Zwei Bilder nebeneinander schlagen jeden Mittelwert.** Meine erste Messung zum three-Sprung
   warf Deck- und Seitenflächen in einen Mittelwert und entlastete damit zuverlässig den Falschen.
   Georgs Zehn-Sekunden-Vergleich hat einen ganzen Versionssprung widerlegt.
2. **Ein Effekt gehört einem MOMENT, nicht einem EREIGNIS.** Die Treffer-Form hing an einem Eintrag
   im Punktesystem und feuerte am leersten Augenblick der Runde.
3. **Eine Prüfung, die im Fehlerfall durchlässt, ist keine Leitplanke.**
4. **Vor dem Drehen prüfen, WEM die Zahl gehört.** 43 rote Paletten von 5000 waren die 8-Bit-
   Rundung des Hex-Werts, nicht der Generator.
5. **Getrennte Achsen sind kein Abstand.** Farbton und Helligkeit einzeln geprüft → jede neunte
   Palette hatte ununterscheidbare Töne. Es braucht EINE Zahl.
6. **Eine Versionsnummer ist ein Messwert.** Ein Fork, der die Nummer seines Elters weiterträgt,
   macht den Rückweg unmessbar.
7. **Das Wort für einen Ladeweg darf nicht in einem Kommentar stehen** — es wird beim Umschreiben
   der Adressen auch dort gegriffen, und der Fehler zeigt auf eine Zeile, die es nicht mehr gibt.

---

## Stand 2026-09-01 · **kfb-bumper-kit** — Plug&Play-Export (Pets/Boden/Schatten · HUD · Würfel)

| Artefakt | Status | Anmerkung |
|---|---|---|
| `export/kfb-bumper-kit_2026-09-01/` | **AKTIV · EXPORT** | Geschlossener Baum für den Einbau in ein einfacheres Pinball (Wizard-Baustelle): 2 von 24 Pets als Eck-Bumper, Bühnen-Schattenkette (Weg A) + ground.v5 (Weg B), Wortmarke, Zahnrad→Settings, Score-Rolle, Ugur-Würfel + wear-layer. **Nur Kopien** — kein Original angefasst; Quelle je Datei = gleicher Pfad unter `spinballcast/` |
| `export/…/demo.html` | **AKTIV · Abnahme-Beleg** | Lauffähige Mini-Szene, per Puffer-Snapshot abgenommen (Bildschleife steht im Vorschaufenster → `window.__kitDemo.snap()`). Schatten-A/B gemessen: an/aus sichtbar an Würfeln + Pinguin (`captures/kit-demo/02/03-schatten_ab.png`) |
| `export/…/README_EINBAU.md` + `KNOWN_ISSUES.md` | **AKTIV · Pflichtlektüre vor Einbau** | Bootreihenfolge, Mini-Bühnen-Vertrag, die komplette Schatten-Regress-Akte (25 Punkte) |
| `export/…/NICHT-EINBAUEN/` | **Referenz · Warnkopf** | pet-pad.v2 + pet-shadow.v1 (stillgelegte Fehlwege) — beigelegt, damit sie niemand neu erfindet |
| `captures/kit-demo/` | **Abnahme-Captures** | Erststart + Schatten-A/B |

## Stand 2026-08-29 (spät) · aktiver Scope: **Pet Studio v10** — Rolli geschlossen, Recherchi importiert


| Artefakt | Status | Anmerkung |
|---|---|---|
| `petstudio-v9/KFB Pet Studio v10.dc.html` | **AKTIV** | Deliverable. Fork von v9. Sprechblase und Tipp-Punkte starten **aus** (lagen im Gesicht-Reiter über den Augen); Mund-Regler geweitet (Größe 1,6 · Höhe ±1,8 · Breite 3,5 — Georg stand auf allen drei alten Anschlägen); Zug-Gestik am Blatt + Pad-Abschnitt »Roll« |
| `petstudio-v9/studio-v10/KloRolli.js` | **FROZEN · nicht weiterentwickeln** | Läuft und ist gemessen, aber die Konstruktion ist falsch (Gesichtsteile auf fremdem Rohr). Blatt jetzt `SPEC.paper.mode = 'flat'`; der Verlet-Tuch-Code bleibt **unbenutzt** mit seinen Messwerten in der Datei — brauchbar für ein späteres, absichtliches Fall-Blatt. Rolli geht in **WS1 neu** |
| `docs/petstudio-v10/POST_MORTEM_rolli_v10.md` | **AKTIV · Pflichtlektüre** | die Ausbeute aus sechs Runden: zwei falsche Voraussetzungen, die Sechs-Befunde-Tabelle, fünf Fallen, **die Drei-Befunde-Regel** |
| `docs/petstudio-v10/PRUEFUNG_kopflos_rolli.md` | **AKTIV · Nachweis** | vier Durchgänge Messung, darunter das kopflose Verfahren (echter Quelltext gegen THREE-Stub), als die Vorschau nicht antwortete |
| `recherchi-v4/` (8 Dateien, 371 KB) | **AKTIV · GAST, nicht eingebaut** | Recherchi v4 lauffähig als **eigene Einheit**. ⚠ braucht **three 0.185 webgpu** (unpkg) + `three-html-render/polyfill` (jsdelivr) — das Studio hält seine eigene three-Instanz. Zwei Instanzen = das zweite System, vor dem die Spec selbst warnt. `support.js` darin ist eine **bewusst gepinnte ältere Runtime**, nicht anfassen |
| `contracts/recherchi.pet.json` | **ASSET · ENTWURF** | Art-Eintrag gegen `pet-LIBRARY.json` 0.4.3. **Nicht einspielen**, ohne `version` zu zählen und `updated` zu setzen; `canonical` nie verlieren. Fünf offene Fragen im `_offen`-Block |
| `docs/recherchi-v4/` (3 Dateien) | **AKTIV** | SPEC (Eigentum je Kanal, drei Bauteile) · README_REHOME (Clean-Run, Fix-Kandidaten) · LADEWEG.tsv |
| `recherchi-v4/assets/doccheck-doc.png` | **ASSET · Fix-Kandidat** | hängt an einem **relativen** Pfad. Läuft, weil die Datei danebenliegt; sauber ist die RAW-URL aus dem Repo |
| `recherchi-v4/Recherchi Modul SESSION_LIVING.dc.html` | **AKTIV · Doku** | Georgs Living Document zum Modul, unverändert übernommen |
| `petstudio-v9/KFB Pet Studio v9 SESSION_LIVING.dc.html` | **AKTIV · living** | Nachtrag v10 **oben** eingefügt, additiv |
| `petstudio-v9/KFB Pet Studio v9.dc.html` | **SUPERSEDED** | lauffähig, Rückweg. v10 ist der Fork |
| `petstudio-v9/studio-v10/rolli-body.v1.js` | **DEAD** | Ersatzkörper aus der Fehlannahme »kein GLB im Repo«. Nicht importiert |
| `KFB Rolli Gesicht v1 Pruefstand.dc.html` | **DEAD** | steht auf demselben Ersatzkörper |

### Clean-Run-Checkliste (v10)

1. Studio lädt, Konsole ohne Fehler; Messgriff `window.__STUDIO9`.
2. Rolli aus der Pet-Liste wählen — er ist **nicht** der Startbewohner.
3. Blatt: `S.rolli.paper.cloth.p` — alle `z` gleich (senkrecht), Oberkante innerhalb des Rollenradius.
4. Sprechblase **und** Tipp-Punkte sind nach dem Laden **aus** (`state.v2bubble.open`, `state.v2ind.on`).
5. Mund-Regler im Gesicht-Reiter: Größe bis 1,60 · Höhe bis ±1,80 · Breite bis 3,50 — **am DOM ablesen**, nicht im Quelltext (es gibt zwei Reglertabellen; die alte Konstante `MOUTH_SLIDERS` speist nur die alte Chrome).
6. Zug am Blatt: langsam ziehen rollt ab, Ruck ab ~600 px/s reisst; während des Zugs steht die Kamera, nach dem Loslassen geht sie wieder.
7. Modul-Adresse trägt `?vN` — wer `KloRolli.js` ändert, zählt in v10 hoch. **Ohne das misst man das gecachte Modul.**
8. `document.hidden` hält rAF an → im Vorschaufenster von Hand ticken (`S.rolli.update(1/60)`).

### Die Regel, die diese Session gekostet hat

**Wenn dieselbe Stelle dreimal einen Befund bekommt, ist die dritte Antwort keine Zahl mehr.** Dann
wird die Konstruktion gewechselt oder die Baustelle geschlossen. Sechs Runden Rolli waren sechs
richtige Messungen an einer falschen Vorrichtung — *messen* sieht aus wie *verstehen* und ist es
nicht.

**Zweite, kleinere:** eine Rate darf nicht an der Ereignisdichte hängen. Zugrate = Weg / Abstand
zweier Zeigerbewegungen ergibt bei einer 1000-Hz-Maus das Vierfache derselben Handbewegung
(gemessen: 31 statt 3,4). Über ein Zeitfenster sammeln.

### Cleanup-Kandidaten aus dieser Session — BENANNT, NICHT AUSGEFÜHRT

- `uploads/Bildschirmfoto 2026-08-29 um 21.20.47.png` — Feedback-Bild, verarbeitet (Beleg für die
  Montage-Diagnose). Nach Sign-off löschbar oder nach `captures/studio-v10/`.
- `petstudio-v9/studio-v10/rolli-body.v1.js` + `KFB Rolli Gesicht v1 Pruefstand.dc.html` — DEAD,
  löschbar nach Sign-off.
- `recherchi-v4/*.standalone.html` — **nicht importiert** (770 KB / 960 KB, aus der Quelle
  regenerierbar). Liegen weiter im lokalen Ordner.

---

## Stand 2026-08-25 (spät) · aktiver Scope: **Podcast v5**

| Artefakt | Status | Anmerkung |
|---|---|---|
| `KFB Pet Podcast v5.dc.html` | **AKTIV** | Deliverable. Fork von v4 |
| `podcast-v5/ground.v5.js` | **AKTIV** | EIN Eigentümer des Pet-Bodens: je Pet Kachel + eigener Render-Durchgang + eigene Kamera. Umhüllt `renderer.render` (Rückweg gibt es zurück) |
| `podcast-v5/transcript.v5.js` | **AKTIV** | EIN Zeichner für das gesprochene Wort: Spalte, Stapel, Warten, Übergang |
| `podcast-v5/layout.v5.js` | **AKTIV** | Fork von layout.v4 + `column()` + ground.v5 |
| `podcast-v5/gaze.v5.js` | **AKTIV** | Blick als IMPULS an PetFace (nie an `rig.pointTo`) |
| `podcast-v5/inspect.v5.js` | **AKTIV** | EIN Eigentümer der freien Kamera. Friert das Layout ein, weiche Grenzen mit Sättigung, harter Boden = Neigung der Sendung, sanfte Rückfahrt. Abnahme `dev.probe()` + `dev.probeReturn()` |
| `docs/podcast-v5/HANDOVER_WS1_petstudio_v6.md` | **AKTIV · Übergabe** | für WS1: unser Boden-Konzept gegen das Studio-Rig, vier Blasen-Fallen im WS0-Paket, Blick-Eigentümer, Kachel-Maß, was v6 mitnehmen kann |
| `docs/podcast-v5/MASTERPLAN_pinball.md` | **AKTIV · SSOT Spiel** | living document: Steuerung, Würfel als Leben+Munition, Ink-Bande, Zielzonen, Reihenfolge, Modi |
| `podcast-v5/bubble-shaper.v2.js` · `bubbles.v4/v5.js` · `bubble-shapes.json` · `pet-metrics.v1.js` | **AKTIV** | WS0-Paket, nur die drei Import-Adressen geändert (EIN Kanon: `cardbuilder/kfb-ink-canon.js`) |
| `podcast-v5/ground-plane.v1.js` | **DEAD im Scope** | WS0-Stempel — Verfahren verworfen (Silhouette von OBEN ⇒ Ohr an den Füßen). Datei liegt unbenutzt, nicht importiert. Löschbar nach Sign-off |
| `kfb-pets.v5.json` | **ASSET · Vertrag 1.2.7** | die Sendung liest DIESE Datei. **Repo trägt 1.2.6 — nachziehen** (`media/3D_Assets/`) |
| `docs/podcast-v5/` (5 Docs) | **AKTIV** | README · CHANGELOG (additiv nach oben) · MODELL_szene_v5 (SSOT Szene) · SOP_kfb_ink_v1 · **MASTERPLAN_pinball** (SSOT Spiel, living document — löst `PLAN_pinball.md` ab) |
| `captures/podcast-v5/` | **ASSET · Abnahme** | Beweisbilder je Scheibe. Diagnose-Frames aus den Fehlversuchen sind Löschkandidaten |
| `KFB Pet Podcast v4.dc.html` + `podcast-v4/` | **SUPERSEDED** | lauffähig, Rückweg. v5 importiert daraus `gutter · cardback · storymode · wordmark · poke · spin · typecase · content` — **GETEILT, nicht löschen** |
| `KFB Pet Podcast v3.dc.html` + `podcast-v3/` | **SUPERSEDED** | lauffähig. `gaze.v3.js` wird von v5 NICHT mehr importiert (v5 hat `gaze.v5`) |
| `podcast-v2/` | **AKTIV · GETEILT** | v5 importiert flipper · lull · juice · inkframe · listen · body. **`bubble.v2.js` nutzt v5 NICHT mehr** |
| `podcast-v1/` | **AKTIV · GETEILT** | v5 importiert stage · voice · personas · research · mirror |
| `cardbuilder/` | **AKTIV · GETEILT** | auch Comic Stage + Card Viewer. `kfb-ink-canon.js` ist der EINE Feder-Kanon |
| `KFB Pet Podcast v2/v1.dc.html` | **FROZEN** | pausiert, lauffähig |
| `KFB Travel v13.dc.html` + `terrain-v13/` | **FROZEN** | eigener Scope, pausiert |
| `KFB Comic Stage v1`, `KFB Pet Studio v4` | **FROZEN** | Studio läuft in WS1 weiter |
| `KFB InfiniteJourney v1/v2`, `KFB Card Viewer v1` | **DEAD** | eingefroren, nicht weiterentwickeln |
| `uploads/KFB Pet Studio v5/ws0-groundplane-bubbles_2026-08-25/` | **ASSET · Vorlage** | Quelle der v5-Module. Lesen, nicht forken |
| `uploads/KFB SpinBallPop v3/` | **ASSET · Vorlage · GRUNDLAGE WS1** | Baukasten mit Belegen: Scheren-Flipper (`makeFlipper`/`mountHalf`/`fitHole`/`screw`), Kollisionsauflösung mit drei Notbremsen, Kartenstapel, Würfel, sechs Textur-Bäcker, Kontaktprotokoll. **Lesen und übernehmen, nicht forken** — Prüfliste in `docs/spinballcast-v1/UEBERNAHME_spinballpop_v3.md` §2 |
| `uploads/neon-gutter index.html` + `red-reddington/web-demos@neon-gutter` | **ASSET · Vorlage** | **vollständig gelesen 25.8.** (4 074 Zeilen; Repo-Stand byteweise identisch, Zeilenverweise gelten). Ausgewertet in `docs/spinballcast-v1/SPEC_physik_vfx_audio.md`. **EINE Kopie** — eine zweite unter `neon-gutter/` wurde nach dem Vergleich gelöscht |
| `KFB Docs.dc.html` | **AKTIV · Werkzeug** | Doku-Leser: rendert jede Projekt-`.md` lesbar (Tabellen, Zitate, ⚠-Blöcke), Seitenleiste mit 11 Docs, Rohtext-Schalter, Auswahl bleibt über `localStorage`. Grund: rohes Markdown ist im Vorschaufenster unlesbar |
| `docs/spinballcast-v1/SPEC_physik_vfx_audio.md` | **AKTIV · Übergabe (WS1)** | Physik/Kollision/VFX/Klang für **SpinballCast v1**: Flipper und Billard als EIN Löser mit zwei Kraftfeldern (die Kippung ist der Regler), Spin als Zahl, Modus-Zahlen mit chill-Werten, Abnahme-Tabelle, Georgs Entscheidungen §12b. Nichts davon gebaut |
| `docs/spinballcast-v1/UEBERNAHME_spinballpop_v3.md` | **AKTIV · Übergabe (WS1)** | Georgs acht WIP-Punkte gegen den vorhandenen Baukasten, mit Belegzeilen. Kern: das WIP zeigt den **Rückfall-Pfad ohne Scheren-GLB**, nicht einen Nachbau. §2 = 13-Zeilen-Prüfliste „wer die Zahl nicht vorzeigen kann, hat neu gebaut" |

### Clean-Run-Checkliste (v5)

1. `dev.audit()` **bad 0** über 6 Seitenverhältnisse × 2 Ansichten — **Livebild VOR dem Audit messen**, das Audit heilt Caches still.
2. `ground.stats().plantDrift` = 0/0 im Ruhezustand · `keyCasts` **false** · `werfer.casts` **true**.
3. Schatten am Pixel: dasselbe Pixel MIT und OHNE Wurf. Am Fuß > 8 Graustufen, am Bein < 3.
4. Pet-Durchgang: Versatz gegen das Haupt-Bild **x 0 / y 0** (`setViewOffset` mit vorherigem `clearViewOffset`).
5. `column().font` == `tr.stats().font` (EIN Eigentümer der Lesebreite).
6. `gaze.dev.sweep('host')` — Ausschlag > 0,15 rad UND Pupillenweg > 8 px (beides, siehe V5-S3).
7. `spin`: scaleY nie über 1, Unterkante über Boden 0,0000, Ruhe = Skala exakt 1/1.
8. `listen.vocabPending()` = 0 nach dem Laden.
9. Keine Konsolenfehler außer den zwei harmlosen PMREM-Warnungen.
10. Modul-Adresse trägt `?vN` — **und die ganze Kette**: ändert sich `ground.v5`, zählt `layout.v5` hoch, dann die Sendung.
11. `document.hidden` hält `requestAnimationFrame` an → im Vorschaufenster von Hand ticken (`layout.dev.tick(n)`, `tr.dev.tick(n)`).

### Zwei Regeln, die diese Session zweimal bezahlt hat

- **Ein `x != null ? x : ZAHL` im Aufrufer ist ein stiller zweiter Default.** Wer den Modul-Default
  gelten lassen will, übergibt das Feld GAR NICHT. (V5-S6 Lesebreite, V5-S8 Deckkraft.)
- **Ein Kriterium muss die Einheit kennen, in der es im Bild ankommt.** Ein Winkel ist kein Weg,
  eine Fläche ist keine Form, eine Grundform ist keine Silhouette. (V5-S3, V5-S7.)

### Cleanup-Kandidaten — BENANNT, NICHT AUSGEFÜHRT

Nichts davon ist gelöscht. Freigabe je Schritt einzeln:

1. `podcast-v5/ground-plane.v1.js` — verworfenes Verfahren, nicht importiert.
2. Diagnose-Frames in `captures/podcast-v5/` (01–20) — die Abnahme-Bilder 21–23 reichen.
3. Verarbeitete Feedback-Bilder in `uploads/` (Bildschirmfotos 24./25.8.) — Befunde sind im Changelog.
4. `options/shadow-A|B|C.html` — Varianten-Vorschau, durch Skizze beantwortet.
5. `KFB InfiniteJourney v1/v2` + `KFB Card Viewer v1` (**DEAD**) — Post-Mortems bleiben.
6. Schwere lokale Binaries (PDFs, GLBs, Skydomes) → gehören per RAW-URL, nicht ins Projekt.

### Pfad-Hygiene

Ein relativer Asset-Pfad im Deliverable: `./kfb-pets.v5.json`. **Bewusst so** — im Repo liegt 1.2.6,
die Fassung, die `pig`/`beaver`/`bee` ihren Mund-Block genommen hat. „Repo zuerst" wäre hier ein
Downgrade. Fix: **1.2.7 ins Repo hochladen**, dann kanonische URL nennen und die lokale Kopie zum
Spiegel machen.

---

## Stand 2026-08-26 · Vorgänger-Scope: Podcast v4

| Artefakt | Status | Anmerkung |
|---|---|---|
| `KFB Pet Podcast v4.dc.html` | **AKTIV** | Deliverable |
| `podcast-v4/` (10 Module) | **AKTIV** | ground · layout · gutter · cardback · storymode · wordmark · poke · spin · typecase · content |
| `docs/podcast-v4/` (3 Docs) | **AKTIV** | MODELL_szene_v4 = SSOT, CHANGELOG additiv nach oben |
| `kfb-pets.v3.json` | **ASSET** | lokaler Spiegel des Contracts; kanonisch = Repo-URL |
| `KFB Pet Podcast v3.dc.html` + `podcast-v3/` | **SUPERSEDED** | lauffähig, Rückweg. `gaze.v3.js` ist GETEILT — v4 importiert es |
| `podcast-v2/` | **AKTIV · GETEILT** | v4 importiert flipper · lull · juice · bubble · inkframe · **listen** (additiv geändert) |
| `podcast-v1/` | **AKTIV · GETEILT** | v4 importiert stage · body · voice · content(v1 → v4 geforkt) |
| `cardbuilder/` | **AKTIV · GETEILT** | auch Comic Stage + Card Viewer |
| `KFB Pet Podcast v2/v1.dc.html` | **FROZEN** | pausiert, lauffähig |
| `KFB Travel v13.dc.html` + `terrain-v13/` | **FROZEN** | eigener Scope, pausiert |
| `KFB Comic Stage v1`, `KFB Pet Studio v4` | **FROZEN** | Studio läuft in WS1 weiter |
| `KFB InfiniteJourney v1/v2`, `KFB Card Viewer v1` | **DEAD** | eingefroren, nicht weiterentwickeln |
| `export/podcast-v4/` | **ASSET** | Session-Export 2026-08-26, 468 KB |

### Clean-Run-Checkliste (v4)

1. `dev.audit()` **bad 0** über 6 Seitenverhältnisse × 2 Ansichten — **Livebild VOR dem Audit messen**, das Audit heilt Caches still.
2. `ground.stats().plantDrift` = 0/0 im Ruhezustand, `keyCasts` false.
3. `spin`: scaleY nie über 1, Unterkante über Boden 0,0000, Ruhe = Skala exakt 1/1.
4. `listen.vocabPending()` = 0 nach dem Laden.
5. Keine Konsolenfehler außer den zwei harmlosen PMREM-Warnungen.
6. Modul-Adresse trägt `?vN` — ohne das misst man das gecachte Modul.

### Cleanup-Kandidaten — BENANNT, NICHT AUSGEFÜHRT

Nichts davon ist gelöscht. Freigabe je Schritt einzeln:

1. `captures/` — Abnahme-Frames älterer Stufen (stufe1, v6, v7, studio-v4). Schwer, per URL ersetzbar.
2. Verarbeitete Feedback-Bilder in `uploads/` (Bildschirmfotos dieser Nacht) — Befunde sind im Changelog.
3. `KFB InfiniteJourney v1/v2` + `KFB Card Viewer v1` (**DEAD**) — Post-Mortems bleiben, Deliverables könnten weg.
4. `podcast-v3/layout.v3.js` — nur noch Rückweg; `gaze.v3.js` MUSS bleiben (geteilt).
5. Schwere lokale Binaries (PDFs, GLBs, Skydomes) → gehören per RAW-URL, nicht ins Projekt.

### Pfad-Hygiene

Ein relativer Asset-Pfad im Deliverable: `./kfb-pets.v3.json`. **Bewusst so** — die Repo-Fassung kennt
Georgs rote Lippen und Wimpern nicht (Befund 25.8.). Fix-Kandidat: den Export ins Repo hochladen, dann
kanonische URL nennen und die lokale Kopie zum Spiegel machen. Solange die Datei fehlt, ist der
relative Pfad die richtige Wahl, nicht die faule.


Nachtrag 2026-08-25 (spät): **aktiver Scope ist Podcast v4** (Fork von v3). v3 bleibt unangetastet
und lauffähig. Neue Dateien, alle AKTIV: `KFB Pet Podcast v4.dc.html`, `podcast-v4/layout.v4.js`
(Fork von layout.v3), `podcast-v4/ground.v4.js` (**NEU — EIN Eigentümer des Pet-Bodens**:
Bodenebene, Pflanzen der Sohle, Fänger, Schattenlicht, Anker für VFX/Bounce),
`docs/podcast-v4/CHANGELOG_podcast_v4.md` (Zahlen + vier protokollierte Fehlversuche).
Mess-Handle `window.__kfbPodcast4`. `podcast-v3/gaze.v3.js` wird geteilt, nicht geforkt.
**Wichtig für den nächsten Chat:** in v4 gilt „y ist Physik (Weltmaß), x ist Komposition (Pixel)" —
die Bild-Korrektur `bias` aus v3 ist ersatzlos weg, und `ground.plant()` muss die LETZTE
Schreibstelle an `wrap.position.y` vor dem Rendern bleiben.

Nachtrag 2026-08-25: **Podcast v3** (§0c, Fork von v2) — jetzt Vorgänger von v4. Travel v13 (§0) und
Podcast v1/v2 (§0b) sind pausiert und lauffähig — nichts halb gebaut.

**Check-in v3 (25.8.):** `docs/podcast-v3/CHECKIN_v3_2026-08-25.md` · Post-Mortem Bodenschatten
`docs/podcast-v3/POST_MORTEM_bodenschatten.md` · Szenen-Modell (SSOT, zuerst lesen)
`docs/podcast-v3/MODELL_szene.md` · Onboarding für den v4-Chat `docs/podcast-v3/ONBOARDING_v4.md`.
Neue Dateien dieser Session, alle AKTIV: `KFB Pet Podcast v3.dc.html`, `podcast-v3/layout.v3.js`,
`podcast-v3/gaze.v3.js`, `kfb-pets.v3.json` (Georgs Studio-Export, die Sendung liest DIESE Datei),
`captures/podcast-v3/` (Abnahme-Bilder), `options/shadow-A|B|C.html` (Varianten-Vorschau — **kann
weg**, war ein Zwischenschritt).

Nachtrag 2026-08-18: **zwei aktive Scopes** in diesem Projekt — Travel v13 (§0) und Podcast v1 (§0b).
Der Podcast teilt `cardbuilder/`, `kfb-pets.js` und den Pet-Stack mit Studio/Travel; wer dort
aufräumt, prüft §0b zuerst.

Zweck: EINE Quelle für Aufräum-Entscheidungen und saubere Clean-Runs. Deckt den Pet- und
Motion-Editor-Scope ab sowie den Rest des Projekts. Kein Automatismus, nichts wird ohne Freigabe
gelöscht. Status-Spalte ist die Wahrheit, nicht das Datum.

Pflege: wer eine Version einfriert, ein Experiment beendet oder Assets verschiebt, trägt es hier
nach. Beim nächsten Clean-Run von oben nach unten durchgehen.

Legende Status: **AKTIV** (produktiv, weiterbauen) · **FROZEN** (Referenz, nicht anfassen, nicht
löschen) · **SUPERSEDED** (durch neuere Version ersetzt, archivierbar) · **EXPERIMENT** (unklarer
Wert, Entscheidung offen) · **DEAD** (Fehlversuch, löschbar nach Sign-off) · **ASSET** (Binär/Bild).

---

## 0c. Podcast v3 (2026-08-25) — aktiver Scope

Doku `docs/podcast-v3/README_podcast_v3.md` · Changelog (additiv nach oben)
`docs/podcast-v3/CHANGELOG_podcast_v3.md`. Ziel: Flipper mit Pets (Scheren unten, 1–3 Würfel,
Pets als Bumper oben) auf EINER Geometrie mit zwei Kamera-Haltepunkten.

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Pet Podcast v3.dc.html` | **AKTIV** | Deliverable. Fork von v2; v2 bleibt lauffähig |
| `podcast-v3/layout.v3.js` | **AKTIV** | EIN Eigentümer von Kamera, Blatt, Sitzen, Bändern, Ausgängen. Abnahme `dev.audit()` = bad 0 (12/12) |
| `podcast-v1/stage.v1.js` | AKTIV · **GETEILT** | additive Naht: Sitz trägt x/y/z (v1+v2 identisch) — nicht als v3-eigen einstufen |
| `podcast-v2/flipper.v2.js` | AKTIV · **GETEILT** | additive Naht `floorOf` (Boden = Sitzhöhe), 12 gezählte Änderungen. v2 nutzt sie mit Wert 0 |
| `uploads/KFB SpinBallPop v3/` | **ASSET · Vorlage** | Baukasten für Scheiben 4+5 (Scheren, Solver). Nicht löschen, nicht forken — lesen und Werte übernehmen |
| `uploads/neon-gutter index.html` | ASSET · Vorlage | Ruhe-Schwelle, Auswurf vor/nach Integration, Ermüdung |
| `docs/podcast-v3/MODELL_szene.md` | **SSOT · zuerst lesen** | Vier Dinge, EINE Regel (Boden-Anker), vier Prüffragen. Ohne das wiederholt man die sechs Schatten-Fehlversuche |
| `docs/podcast-v3/POST_MORTEM_bodenschatten.md` | AKTIV · Lehre | Fehlerklassen A–E: Ersatz statt Vorhandenem · Studio-Werte ersetzt · ein Maß für zwei Aufgaben · Zahl statt Bild · Methode misst sich selbst |
| `docs/podcast-v3/CHECKIN_v3_2026-08-25.md` | AKTIV · Übergabe | Stand, gemessene Zahlen, offene Punkte in Reihenfolge |
| `docs/podcast-v3/ONBOARDING_v4.md` | AKTIV · für den nächsten Chat | Erste Handlung, Regeln, Slice 1 = Aufprall-VFX an den Anker |
| `podcast-v3/gaze.v3.js` | **AKTIV** | EIN Eigentümer von „die Augen folgen der Bahn"; fragt `rig.pointTo` aus Studio v4 |
| `kfb-pets.v3.json` | **AKTIV · Vertrag 1.2.6** | Georgs Studio-Export vom 24.8. — die Sendung liest DIESE Datei, nicht die Repo-Fassung |
| `captures/podcast-v3/` | AKTIV · Abnahme | Bilder, an denen die Scheiben abgenommen wurden. Aufräumbar, sobald v4 eigene hat |
| `options/shadow-A\|B\|C.html` | **KANN WEG** | Varianten-Vorschau für eine Frage, die Georg per Skizze beantwortet hat |

**Backlog, hier mitgeführt (Georgs Punkte 25.8.):** Transgressions/Portale (Kartenzone → tiefere
Zone), Drain als **Tor** statt Verlust, Kamera folgt dem Haupt-Pet im Sog, „KFB Infinite Canvas /
fractal Almanac" mit Journey-Diary (Session-Import/Export, gesammelte Karten) — und ein späterer
**Fork für DocCheck-CME-Präsentationen**. Letzterer ist ausdrücklich KEINE Annahme im Fundament:
das Layout-Rig darf keinen Inhalt voraussetzen, der eine CME-Nutzung ausschließt.

---

## 0b. Podcast v1 (Session-Cut 2026-08-18) — zweiter aktiver Scope neben Travel

Session-Cut `docs/SESSION_CUT_podcast_v1_2026-08-18.md` · Fahrplan `docs/SPRINT_podcast_v2.md` ·
Onboarding `docs/ONBOARDING_podcast_v2.md` · Ist-Stand `docs/PET_PODCAST_v1.md`.

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Pet Podcast v1.dc.html` | **AKTIV** | Deliverable; v2 startet als Fork (Sprint §1) |
| `podcast-v1/stage.v1.js` | AKTIV | Bühne, Sitze, Panel (5,9 × 3,39 bei y 1,79), Schatten |
| `podcast-v1/flipper.v1.js` | AKTIV | Wurf-Physik — **v2 §1 greift genau hier ein** (Deckel + Tiefen-Skala) |
| `podcast-v1/body.v1.js` | AKTIV | Körper-Betonung aus echten Wortgrenzen der TTS |
| `podcast-v1/bubble.v1.js` | AKTIV | Blasen; Anker ist `stage.SEATS`, ein Platz darf leer sein |
| `podcast-v1/voice.v1.js` | AKTIV | Browser-TTS, abschaltbar |
| `podcast-v1/content.v1.js` | AKTIV | Was im Panel liegt (Karte, Text, Link) |
| `podcast-v1/personas.v1.js` | AKTIV | Besetzung; 12 von 24 Persona-Blättern liegen im Repo |
| `podcast-v1/research.v1.js` | AKTIV | Destillat CLAIM/MECHANISM/NUMBER/COST/FRICTION |
| `podcast-v1/mirror.v1.js` | **AKTIV · kritisch** | Asset-Weg über `kayfabizarro.pages.dev`. **Ohne dieses Modul lädt nichts** (raw = 429, privates Repo = kein CDN). Nicht als Hilfsdatei einstufen |

### Fremde Module, die diese Session verändert hat (GETEILT — nicht als tot einstufen)

| Artefakt | Status | Eingriff 17./18.8. |
|---|---|---|
| `cardbuilder/kfb-card-builder.js` | AKTIV · **GETEILT** (Travel, Diorama, Podcast) | `card.cell` (Vorspann-Versatz), Viertel als Default-Raster, `quadTrim`, Bild füllt Kontur-Rahmen, `lastCrop` auch bei Cache-Treffern, `gridTable()`. `seamFit`/`pageRows` sind **absichtlich aus** — gemessen, dokumentiert, kein Aufräum-Kandidat |
| `kfb-pets.js` | AKTIV · GETEILT | Loader mit Budget (2 Anläufe, 9 s) statt Endlos-Leiter |
| `cardbuilder/kfb-ink-canon.js`, `kfb-card-format.js` | AKTIV · GETEILT | unverändert, aber Kanon für den Schnitt |

### Podcast-spezifische Aufräum-Kandidaten (nur benannt)

- Keine. Der Scope hat in dieser Session keine SUPERSEDED-Datei erzeugt (v1 ist die erste Fassung).
- Sobald v2 als Fork existiert: v1 auf FROZEN, hier nachtragen.

---

## 0. Travel v13 (Session-Cut 2026-07-29, Stand S93f)

Quelle: Coworker-Export `travel-v12_S83c_2026-07-26` + `kfb-cut-v4` (Zone Registry v3).
Session-Cut: **`docs/travel-v13/SESSION_CUT_v13_2026-07-29.md`** (Vorgänger `…_2026-07-28.md`, FROZEN) · Coworker-Handover:
`docs/travel-v13/HANDOVER_coworker_2026-07-28.md` · Fahrplan **`docs/travel-v13/SPRINT_travel-v14.md`** (v13-Sprint abgeschlossen) · Deck-/Ausschnitt-SSOT **`docs/travel-v13/SSOT_deck_data_und_ausschnitt.md`** ·
Changelog additiv nach oben `docs/travel-v13/CHANGELOG_travel.md` · Doku `README_v13.md`.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v13.dc.html` | die Reise, Stand **S93f** (Sitz + Papier-Oberfläche + Ruhewind + Erzähler + Lesepult + Fußkontakt) | **AKTIV** |
| `terrain-v13/` (56 Module) | Runner + Slices | **AKTIV** |
| `terrain-v13/zone-ring.js` | Eigentümer der Zonen-Lage (S84/S87) | AKTIV |
| `terrain-v13/arrival.js` | EINE Uhr für Anflug + Abflug (S85–S89o) | AKTIV — **S93:** führt keine eigene Endzahl mehr, `zoomNearOf` fragt das Dock. `zoomNear` bleibt die Zahl (Regler + Rückfall) |
| `terrain-v13/card-dock.js` | Eigentümer des Lesebilds: Leseweite, Achse **und Sitz** (S93) | AKTIV — `seatNdc`/`cardNdc`/`seatDepth`, Löser mit 8 Runden; `report()` liefert Restfehler, Sitz-Tiefe, Abstand, Fit. Rückweg `seatOn: false` |
| `terrain-v13/flight-controller.js` | `hold` + `holdSnap` = echter Stillstand (S89/S89b) | AKTIV |
| `terrain-v13/card-carrier.js` | Flug-Karte, `padParts`, `setCalm` (S88/S89), `setWind` (S95), `setLectern` (S93d), **`surfaceAt` + Sitz-Pflanzung (S93f)** | AKTIV — Ruhewind und Lesepult leben nur bei `calm`; `surfaceAt` liest die **verformte Geometrie** (keine zweite Kopie der Wellen-Formel), der Sitz wird jeden Frame darauf gestellt. Rückwege `amp: 0` / `setLectern(0)` / `setSeatPlant(false)` |
| `terrain-v13/travel-input.js` | Zug-Kennlinie, Landewille, `e.repeat`-Sperre (S86/S89) | AKTIV |
| `terrain-v13/pet-facing.js` | Facing (Gier + Kopfheben) — **die Augen gehören `PetFace`** (S93b) | AKTIV — Gesichtsachse **+Z** (am Modell gemessen; der alte −Z-Kommentar war falsch und mit ihm das Vorzeichen von `front`) |
| `terrain-v13/kfb-pets.js` | lokaler Spiegel des kanonischen Pet-Stacks | **Fallback, nie Quelle** — `travel-poc` lädt `PETS_CANON` über jsdelivr. **Befund S94:** auch die KANONISCHE Datei ist VERSION 1 (20.7.) und kennt `surface` nicht; die Bauanleitung v2 (22.7.) beschreibt einen nicht deployten Stand |
| `pet-surface.v1.js` (Repo, per URL) | Clay/Papier-Oberfläche, geteiltes Modul (S94) | AKTIV, **kein lokaler Spiegel** — Importausfall = flacher Default (Rückweg) |
| `zone-index.json` · `zone-registry.json` (Wurzel) | Struktur- und Ableitungs-Wahrheit | AKTIV (Contract, **fremd — nur lesen**) |
| `terrain-v13/card-grids.json` | Crop-Vertrag pro Deck: EINE Zahl (`yShift`), Viertel-Regel + `legacy` als Rückweg | AKTIV, **vollständig seit S90a** (28.7.) — Verhältnis-Widerspruch rechnerisch aufgelöst, alle fünf Decks tragen einen Wert, `sonic_slaughterhouse` auf `yShift: 0`. Offen ist NICHT mehr der Crop, sondern (a) Sollformat 1,74 gegen Seitenviertel 1,79 und (b) ob die sieben unbenutzten Deck-PDFs ins Manifest kommen. (Der „fehlende" Sonic-PDF-Befund vom 28.7. war falsch und ist zurückgenommen — die Datei ist da.) |
| `cardbuilder/kfb-card-builder.js` | Karten setzen (physisch, geteilt) | AKTIV, **weicht bewusst ab** (S90a): eigenes `gridOf` mit den sechs alten Zahlen — dieselbe Karte 750×418 in Travel gegen 573×391 hier. Entscheidung über physische Karten, gehört Georg + Coworker |
| `cardbuilder/` · `themes/` · `tools/travel/` | Karten bauen, Palette, Raster messen | AKTIV (geteilt) |
| `kfb-cartoon-deform.js` · `kfb-box-material.js` · `kfb-texture-catalog.json` · `asset-repo.json` | mitgebracht, nicht eingehängt | **EXPERIMENT** bis S88-Props |
| `captures/v13_s84/` (15 PNG) | Abnahme-Frames S84 | **ASSET** |
| `captures/s90a/` | Abnahme-Frames S90a: Viertel gegen Raster + alle elf Deck-PDFs + Beleg der gescheiterten Auto-Messung | **ASSET** |
| `terrain-v13/kfb-index.json` | Notnagel-Kopie des Repo-Manifests | AKTIV — **28.7. korrigiert**: `sonic_slaughterhouse` trug die Epistemic-Dateien. Die Repo-Vorlage `media/kfb/kfb-index.json` hat den Fehler noch |
| `docs/travel-v13/README_v12_export.md`, `HANDOVER_v12.md`, `SESSION_CUT_v12_S83c.md`, `SPRINT_travel-v12.md`, `PROJEKTANWEISUNG_v12.md`, `HOUSEKEEPING_v12.md`, `github_v12.md` | Herkunfts-Doku des Forks | **FROZEN** (Referenz, nicht pflegen) |
| `docs/travel-v13/HANDOVER_v13_coworker.md` (v12-Fassung) | vom Coworker mitgebracht | **SUPERSEDED** von `HANDOVER_coworker_2026-07-28.md` |
| `docs/travel-v13/SESSION_CUT_v13_2026-07-29.md` | Cut der Sitzung 28./29.7. (S90a…S95b), offene Punkte konsolidiert | **AKTIV** |
| `docs/travel-v13/SPRINT_travel-v14.md` | Fahrplan v14: Stufe 0 + Block A–D, je Slice Eigentümer/Messung/Rückweg | **AKTIV** (maßgeblich) |
| `docs/travel-v13/SSOT_deck_data_und_ausschnitt.md` | **eine** Wahrheit für Deck-Daten + Kartenausschnitt: Repo-Bestand, Checkliste, Vorlagen, offene Widersprüche | **AKTIV** (maßgeblich) |
| `docs/travel-v13/SPRINT_travel-v13.md` | v13-Fahrplan, abgeschlossen; Zeiger auf v14 | **FROZEN** (Referenz, Slice-Historie) |
| `docs/travel-v13/SESSION_CUT_v13_2026-07-28.md` | Cut Stand S89o | **FROZEN** |
| `github.md` (Wurzel) | Repo-Rückweg, Screen map, Last sync | AKTIV, bei jedem Repo-Zugriff neu schreiben |

**Geteilt, nicht löschen:** `cardbuilder/kfb-card-format.js` (von `academy-deck.js` UND `sky-cards.js`
importiert — die eine Zahl `CARD_AR`), `themes/kfb-med.css` (Wortmarke im DC).

**Clean-Run-Checkliste v13**
1. `KFB Travel v13.dc.html` öffnen, ~8 s warten: Voxel-Welt, drei Würfel, Pet auf der Flug-Karte,
   Kartenblätter erscheinen nach 3–8 s. Im versteckten Tab kommt nichts — Absicht.
2. **`T.mgr.runStep('fade', 1/60)` und `T.mgr.runStep('vehicle', 1/60)` müssen `true` sein,
   `window.__loopErr` `null`.** (`__bootErrors` sieht diese Fehlerklasse NICHT — siehe S89o.)
3. Doppelklick auf eine Karte: Pad fliegt hin, **bleibt sichtbar stehen**, Teppich hört auf zu wellen,
   dann fährt die Kamera in den POV. Kein Ausblenden vor dem Halt.
4. Ohne Eingabe 60 s angedockt bleiben: Tempo ~0, kein selbsttätiger Abflug.
5. Esc: Abflug ~3,9 s, monoton, kein Sprung. Kein Fleck und keine Bänder ohne Fahrzeug.
6. Panel → *Zonen-Ring*: Bodenluft > 0, Biome-Verteilung nicht einseitig.
7. **Lesebild (S93f, Abnahme offen):** angedockt die Maus langsam über das Bild ziehen — die Füße des
   Erzählers stehen auf dem Blatt (nicht schwebend, nicht senkrecht auf schräger Fläche), die Pupillen
   folgen, Cursor auf dem Pet = ruhige Mitte, nach ~2,2 s ohne Bewegung löst sich der Blick in den Drift.

**Regel für diesen Scope:** `terrain-v12/` liegt NICHT hier (v13 ist ein Fork). Vergleichsmaßstab
bei Bedarf aus dem lokalen Ordner `KFB VoxelWorld` holen.

---

## 1. Pet- und Motion-Editor (mein Scope)

### SSOT und Contracts (die eigentliche Wahrheit)
| Artefakt | Rolle | Status |
|---|---|---|
| `pet-LIBRARY.json` (root) | Deploy-Snapshot Aussehen, `kfb.pet-library/1` v0.4.3 (2026-07-18) | AKTIV, inhaltsgleich mit Working-Copy |
| `PET_EDITOR/pet-LIBRARY.json` | Working-Copy, die die Editoren lesen, v0.4.3, 24 Pets | AKTIV |
| `media/3D_Assets/pet-LIBRARY.json` | Mirror der kanonischen URL, v0.4.3 | AKTIV |
| `motion-LIBRARY.json` (root) | Bewegung, `kfb.motion-library/1` v1.2.0, mit `canonical` | AKTIV für v1-Konsumenten; **Schema-Nachfolger: `motion-LIBRARY.v2.json`** |
| `motion-LIBRARY.v2.json` (root) | Bewegung Contract v2 (`kfb.motion-library/2` v2.0.0, 2026-07-19): motions (aus v1.2.0) + `clips` + `face` (Mienenspiel) + `triggers`. Motion-Editor v2 liest/schreibt; Export überschreibt beim Commit die kanonische URL | AKTIV |
| kanonisch: GitHub-raw `…/media/3D_Assets/pet-LIBRARY.json` | die eine Wahrheit, Apps fetchen sie | extern |

Regel: wer schreibt, zählt `version` hoch, setzt `updated`, verliert `canonical` nie. Lokale Kopien
sind Snapshots, im Zweifel die URL fetchen.

### Embed, Bundles & Referenz (2026-07-22)
| Datei | Rolle | Status |
|---|---|---|
| `pet-bundles.v1.js` (root) | Kuratierte State-Bundles über `makePet`-`pet` (attend/greet/notice/agree/disagree/celebrate/think/startle/shiver/sleep/wake/talk/byMood). Reine App-Schicht, kein Motor-Eingriff. **Ziel-Repo: `media/3D_Assets/pet-bundles.v1.js`** (Georg lädt hoch) | AKTIV |
| `pet-surface.v1.js` (root + `media/3D_Assets/`) | Geteilter Clay/Papier-Oberflächen-Look als Modul: v9-`makeMat`+`_surfShader`+`reskin`+`_buildLidSampler` herausgezogen. `createPetSurface({THREE,renderer,material})` liest `koerper.material.live` aus dem Vertrag → Studio/Reference/Embed teilen EINEN Look. `kfb-pets.js` verdrahtet `reskin`+`lidSampler` über `opts.surface`. **2026-07-23 in `media/3D_Assets/` gespiegelt** (Georg lädt hoch) | AKTIV, geteilt |
| `media/3D_Assets/kfb-pets.js` | Kanonisches Embed-Modul. **2026-07-23 nachgezogen** aus der Reference-Bergung: `opts.surface` (Oberflächen-Modul) + `rawHex` + `lidSampler`-Durchreichung; `resolvePet` faltet jetzt `pets[].mouth` (+`_male`) statt globalem Rückfall-Mund. PetMouth-Import zeigt kanonisch auf jsdelivr-`build/`. **Offen (WS0):** `build/pet-mouth.v1.js` hat falsche Visem-PNG-Namen (fehlt `_0001s`-Segment) — bis zum Fix trägt nur die lokale Reference-Kopie korrekte Münder | AKTIV, geteilt |
| `uploads/EMBED_CUBE_PET_FULL_v2.md` | Plug-&-Play-Embed-Rezept v2 = Coworker-v1 (Round-Trip §14, Bloom/Story §15) + §7e „Lebendig platzieren" + §7f „State-Bundles". Korrigiert: `setLife`-Signatur/`{on}`+PetFace-Vorbehalt, `motion.loop('idle')`-Hinweis. **2026-07-23: §10 auf das geteilte `pet-surface.v1.js`/`createPetSurface` umgestellt** (statt „bring your own makeMat"), Stack-Tabelle + `makePet`-Optionen (`surface`) nachgezogen. **2026-07-30: v2.1** = neuer §16 „Puppeting / External Drive" (Treiber-Vertrag Studio v4 §2b, sechs Methoden + Timeline-Format + Kamera-Presets gegen die echten Signaturen). **2026-08-04: v2.2** = §6 richtiggestellt — die v2.1-Fassung war an drei Punkten FALSCH: flache Ebene + View-Facing-Fade (ist seit v4 ein 52-Punkt-Shrinkwrap, tiefengetestet), zwei Sets (sind drei, und ein Set darf Formen fehlen), unvollständige `setParams`-Liste (`lift`/`wrap`/`onTop`/`slope`/`set`/`visemeMap` fehlten). Neu §6.1–6.4 + Fallback-Hinweis in §16.1 + §13-Backlog nachgezogen. **Ziel-Repo: `media/3D_Assets/GLB_cube-pets/EMBED_CUBE_PET_FULL_v2.md`** (löst v1 ab) | AKTIV — **Upload-Kandidat, Abstimmung Coworker** |
| `uploads/EMBED_CUBE_PET_FULL_v1.md` | Vorgänger (Coworker-Stand) | SUPERSEDED von v2 |
| `KFB Pet Reference.dc.html` (root) | Interaktive Vokabel-/Feature-Referenz: lädt volles Pet-Paket live aus dem Repo, schaltet Beleuchtung/Material/Bundles/Emotes/Story-Farbe/Bloom durch, zeigt je Regler Begriff + Chat-Satz. Fable-Werkzeug, kein Contract-Artefakt | AKTIV |
| `docs/HANDOVER_pet_bundles_and_reference_2026-07-22.md` | Abstimmung mit Coworker: 3 Contract-nahe Befunde (setLife-Signatur, setMotion-No-op, Bundles in den Contract?) | AKTIV |

### Geteilte Runtime-Module (ein Code-Pfad für beide Benches und alle Apps)
| Datei | Rolle | Status |
|---|---|---|
| `pet-library.v6.js` | Character + Face-Chirurgie (stripEyes/stripSnout) | AKTIV, geteilt |
| `pet-eye-rig.v4.js` | EyeRig v4 — nur noch von den EINGEFRORENEN v1-Benches referenziert (Motion-Editor v1, Journey) | SUPERSEDED von v5 (Rig-v5-Hub 2026-07-19: beide aktiven Benches auf v5) |
| `pet-eye-rig.v5.js` | EyeRig v5 (Actor: Asymmetrie/Leben/Kinetik + lid-Flag) — **beide aktiven Benches** (Pet-Editor v9, Motion-Editor v2; dort Life AUS, PetFace trägt den Drift). **2026-07-22 additiv: Wimpern** (`opts.lashes {length,density}` + `setLashes()`, dunkle Kegel entlang der Oberlid-Kante, Kind des Oberlids → folgt Blink; Default off, per Pet) | AKTIV, geteilt |
| `pet-motion.v1.js` | PetMotion (Squash-Schicht) | SUPERSEDED von `pet-motion.v2.js` (v1 bleibt Referenz für den v1-Editor) |
| `pet-motion.v2.js` | PetMotion v2: v1 + Clip-Layer (alle 8 GLB-Clips), Trigger-Bus (drop/brake/curveL/R/card/still), Combos (doubleTake/shiver/tada/random), Sekundär-Federn (ear/tail/antler-Knoten, additiv nach Mixer) | AKTIV, geteilt |
| `pet-face.v1.js` | Mienenspiel (SPRINT_mienenspiel.md): kontinuierlicher Emote-Raum, Drift+Tremor, reaktiv, Augen-Pop/Oval-Federn; treibt EyeRig nur über Public API | AKTIV, geteilt |
| `pet-fx.v1.js` | Cartoon-FX: dust/ring/star/speedlines, Cel-Look, settlet in Ruhe | AKTIV, geteilt |
| `pet-puppet.v1.js` (in `studio-v3/`) | **NEU 2026-07-30 (Studio v4 §2b):** Treiber-Vertrag als Fassade — `setViseme`/`setExpression`/`playState`/`speak(timeline)`/`setCamera`/`setBackground` + `update(dt)`/`onEmphasis`/`stop`. Besitzt NUR die Sprech-Uhr, die Namens-Zuordnung (`EXPRESSION_MAP`) und die Kamera-/Hintergrund-Presets; alles andere über die Public API der Eigentümer. Gemessen: 11/11 Timeline-Ereignisse, Zeitfehler 17 ms, 3/3 Betonungen, Kamerafahrten settlen auf ±0,002 × Radius. `dist` = Vielfaches des Pet-Radius, `az` relativ zur **gemessenen** Blickrichtung. **Ziel-Repo: `media/3D_Assets/build/pet-puppet.v1.js`** (WS0 lädt hoch). §2c (`onEmphasis` → PetMotion) offen | AKTIV, neu |
| `pet-mouth.v1.js` | Talking Mouths: 13 Character-Animator-PNGs als Surface-Fit-Plane, Visem-Shuffle ohne Lip-Sync, Ruhe-Mund folgt Mienenspiel. **2026-07-22 additiv: `MOUTH_SETS` male\|female** (female = `FrizzleBob-FemaleMouth_01/`, eigener Prefix/Mittelsegment, gleiche 13 Keys; `opts.set`/`setSet()`; male-Alias unveraendert) + `dx`-Versatz + View-Facing-Fade (interim gegen das Silhouetten-Floaten). **OFFEN/Backlog: Mund als `DecalGeometry` aufs Body-Mesh statt flache Plane+Fade — Begruendung + Plan `docs/REPORT_Studio_Mund-Decal_2026-07-22.md`. Backlog: Mund-Neigung (`tilt`, kippt um obere Kante) folgt der Koerperwoelbung noch nicht sauber — abgenommen als „passt fuer jetzt“, Fix offen.** **2026-07-29 additiv (Studio v4 §2a): Visem-Schicht** — `VISEMES` (5: closed/open/wide/round/smile), `VISEME_MAP_DEFAULT` (closed→m, open→ah, wide→ee, round→oh, smile→smile), `setViseme(id,{pop,rest})`, `setVisemeMap()`, `visemeKey`; `setTex(name, pop=true)` bekam einen zweiten Parameter (Default = altes Verhalten), `talk(true)` setzt `viseme=null`, `setRest()` ebenso. Reine Zustands-Umschaltung der bestehenden 13 Decals, KEIN neuer Mund; Sprech-Shuffle/female-Set/express unverändert. **Achtung Divergenz (vorbestehend, nicht von v4):** der Patch liegt in `studio-v3/pet-mouth.v1.js` (12,8 kB, die Fassung, die Studio + Motion-Editor lesen). Die Root-Kopie `pet-mouth.v1.js` (9,3 kB, von `kfb-pets.js` importiert) ist älter — kein `MOUTH_SETS`, kein `tilt/bend/express` — und hat die Visem-Schicht NICHT. Vor dem Heben in die kanonische `build/`-Fassung müssen die drei Kopien von WS0 zusammengeführt werden. **2026-07-29 zweiter additiver Slice (Auflage):** `_shrinkwrap()` tastet beim `refit()` alle 52 Eckpunkte per Raycast auf die Körperfläche ab (Wölbungstiefe 0,000 → **0,284 U**), neue Parameter `lift` (war hart auf U*0.03), `wrap` (0 = flache Ebene = Rückweg) und `onTop` (false = **`depthTest` jetzt AN** + `polygonOffset −2/−2`; true = alter Zustand). Behebt „der Mund liegt vor dem Modell". Rest-Überstand bei `sx > 1.2` ist Look-Entscheidung, nicht Bug (4/52 Punkte verfehlen den Körper bei sx 1.54, 0/52 bei 1.00). **2026-08-04 dritter additiver Slice (Rote Lippen):** `MOUTH_SETS` hat ein **drittes** Set `red` (`FrizzleBob-RedMouth_01/`, 12 PNG à 274×169 = gleiche Leinwand wie male → Platzierung trägt unverändert durch; eigener Prefix, `Aa` statt `Ah`, `W-Oo` mit großem O). Eigentlicher Eingriff: **ein Set darf Formen FEHLEN** — neu `_key(name)` (Auflöser: Schlüssel → `set.fallback` → null) + `has(name)` + Getter `setId`; alle sechs Prüfstellen (`_loadTex`, `setViseme`, `setSet`, `setTex`, `setRest`×2) laufen darüber, damit nie ein Ladeversuch auf `base+"undefined"` entsteht. `red` hat kein `smile` → Fallback `neutral`, das Lächeln trägt `bend +0.35` (**kein** Ersatz-Mapping auf `ee` — das wäre ein Grinsen). Gemessen: 12/12 PNG, `fails []`, einheitlich 274×169, `closed→m · open→ah · wide→ee · round→oh · smile→neutral`; `TALK_POOL`+`CLOSERS` (11 Formen) vollständig ohne Ersatz. **Dazu §Knick-Bremse:** neuer Parameter `slope` (Default 0.05 U je Spalte, `<=0` = Rückweg) begrenzt die Tiefen-Wanderung von der Mitte nach außen — behebt die harte Stufe in der Oberlippe bei großen Mündern; größter Nachbar-Sprung **0,1352 → 0,0500 U (−63 %)** bei −1 % Wölbungstiefe (0,290 → 0,287). | AKTIV, geteilt |

### Check-in Pet Studio v4 (2026-08-04) — Scope geschlossen, nichts halb gebaut

Nach `skills/session-export_v1.md` abgearbeitet. **Manifest der Session** (nur was hier entstand):

| | Datei | Status |
|---|---|---|
| (a) | `KFB Pet Studio v4.dc.html` | AKTIV — Bench, dritte Set-Option + Mess-Handle `window.__petStudio` |
| (a) | `studio-v3/pet-puppet.v1.js` | **NEU** — Treiber-Vertrag §2b |
| (a) | `studio-v3/pet-mouth.v1.js` | AKTIV, **geteilt** — Visem-Schicht, Shrinkwrap, `red`-Set, `_key`/`slope` |
| (b) | `studio-v3/kfb-pets.json` | v1.2.1, **diese Session nicht geschrieben** (v4-Felder entstehen beim Studio-Export) — `version`/`updated` bewusst NICHT gebumpt, sonst behauptet die Datei eine Änderung, die nicht drin ist |
| (c) | `docs/PET_STUDIO_v4.md` | AKTIV — Ist-Stand, §7 v5-Backlog, §8/§9 Rote Lippen, §10 Handover |
| (c) | `docs/HOUSEKEEPING.md` · `CLAUDE.md` | AKTIV |
| (c) | `uploads/EMBED_CUBE_PET_FULL_v2.md` | **v2.2** — Upload- und Abstimmungs-Kandidat (siehe Embed-Tabelle) |
| (d) | `captures/studio-v4/` (21 PNG, 0,71 MB) | ASSET — Abnahme-Frames inkl. `501-redmouth-kontaktbogen.png` |

**Pfad-Hygiene geprüft (Schritt 6):** keine `./assets/`-Referenzen. Texturen, GLBs, Skydome und der
kanonische Contract laufen über RAW-URL. **Aber:** v4 lädt seine Motor-Module relativ über
`./studio-v3/…` — der Ordner muss in jedem Export mit, sonst startet die Bench nicht.



Alle Slices (§2a Viseme · §Auflage · §2b Treiber · §Blase · §Ausgabe · §Ruhemund) sind gemessen,
dokumentiert und haben einen Rückweg. **Kein halber Zustand im Baum.** Backlog für v5 steht in
`docs/PET_STUDIO_v4.md` §7 (A Look-Zahlen · B Folge-Slices · C WS0-Naht); §5 und §7 dort wurden beim
Schnitt richtiggestellt — die alte Fassung behauptete noch „§2b nicht gebaut".

Offen und **bewusst liegengelassen**: §2c (`onEmphasis` → PetMotion; Vorfrage: Studio oder
Motion-Editor besitzt die Betonung?) · View-Facing-Fade verkleinern · Krone/Accessory-Slot · §4
Audio/Export. Look-Zahlen zur Abnahme: `sad −0,55`, `angry → s`, Kamera `close 2,55`/`zoom 2,05`,
`sx 1,54`.

**Neu im Backlog (30.7.):** drittes Mund-Set **`FrizzleBob-RedMouth_01`** (Repo, 12 PNG à 274×169 —
gleiche Leinwand wie male/female, also kein Fit-Problem). Rote Lippen sind auf dem gelben Körper
sichtbar, das beige male-Set ist es kaum. **Blocker: `smile` fehlt** (12 statt 13 Dateien) und das
Namensschema weicht dreifach ab (`Aa` statt `Ah`, `W-Oo`, eigener Prefix). Analyse
`docs/PET_STUDIO_v4.md` §8, Kontaktbogen `captures/studio-v4/501-redmouth-kontaktbogen.png`.

**Erledigt 2026-08-04 — §Rote Lippen eingehängt** (`docs/PET_STUDIO_v4.md` §9): `MOUTH_SETS.red` +
dritte Option „rote Lippen" im Mund-Tab, und als eigentlicher Eingriff `_key()`/`has()` — ein Set
darf jetzt Formen fehlen, ohne dass ein Ladeversuch auf `base+"undefined"` läuft. Gemessen: 12/12
PNG, einheitlich 274×169, `smile→neutral` über den Fallback, die vier Sprech-Viseme auf echten
Dateien, `TALK_POOL`+`CLOSERS` vollständig ohne Ersatz.

**Nachtrag §Knick-Bremse (2026-08-04, Bug bei großen Lippen):** bei `size 0.71 · sx 1.54` bekam die
Oberlippe eine harte Stufe — ein Eckpunkt, der um die Wangenkante eine zurückweichende Fläche traf
(oder von seinem Nachbarn erbte), sprang in EINEM Spaltenschritt nach hinten. Neuer Regler `slope`
(Default 0.05, `<=0` = Rückweg) begrenzt die Tiefen-Wanderung je Spalte: größter Nachbar-Sprung
**0,1352 → 0,0500 U (−63 %)** bei nur **−1 %** Wölbungstiefe (0,290 → 0,287); `slope 0.03` drückt das
Anschmiegen flach (−29 %) und ist darum nicht Default. Rest-Überstand (27/52 Punkte ohne Körper =
Mund breiter als der Kopf) ist Look-Entscheidung, die Konsole meldet es mitsamt `slope`-Wert.
Mess-Handle `window.__petStudio` neu.

Offen (Look): braucht `red` ein
`smile`-PNG, oder trägt `bend +0.35`? · Lippenstift-Register mit Wimpern (clownesk) = Slice mit
zwei Eigentümern (Mund **und** EyeRig) → v5.

**Die einzige Naht nach außen ist WS0** (die drei `pet-mouth.v1.js`-Fassungen, siehe Modul-Zeile
unten): die Visem-Schicht wirkt heute nur in `studio-v3/`. Relevant, sobald **Travel v14** ein
sprechendes Pet auf der Flug-Karte will — sonst bleibt sie sauber offen.

### Benches
| Datei | Status |
|---|---|
| `KFB Pet Studio v4.dc.html` (root; Motor-Module in `studio-v3/`) | **AKTIV (2026-07-29)** — Talking Puppet, Zwischensprint nach `uploads/HANDOVER_PetStudio_v3_to_v4_TalkingPuppet.md`. Fork von v3, EIN Slice drin: **§2a Visem-Mund** — Abschnitt „Viseme (5 Formen)" im Gesicht-Tab (Visem wählen → Form aus den 13 Decals zuweisen → „5 durchspielen" für die Abnahme, „Standard-Look" als Rückweg) + Visem-Pads in der unteren Leiste. Zuordnung liegt pro Pet in `mouth.visemeMap` und geht mit in den `kfb-pets.json`-Export. Gemessen: 5 Zustände erreichbar, `_pop` bleibt 1,000 (kein Skalen-Plopp), Vertex-Zahl 52 konstant, Skala über alle 5 Wechsel unverändert; Frames `captures/studio-v4/`. **Nachtrag Auflage:** Mund schmiegt sich an (52-Punkt-Shrinkwrap, Wölbung 0,284 U) und ist tiefengetestet — „liegt vor dem Modell" behoben; Regler Abstand/Anschmiegen/Breite + Rückweg-Schalter „Immer obenauf". **§2b Treiber-Vertrag gebaut (2026-07-30, nach Look-Abnahme):** neues `studio-v3/pet-puppet.v1.js` + Bank im Motion-Tab; EMBED-Doc auf **v2.1** (neuer §16 „Puppeting / External Drive"). **§Blase (30.7.):** Zipfel-Backlog erledigt — Anker ist jetzt das geglättete Pet-ZENTRUM (`_petPoints`/`_anchorTick`, auf den Bühnenkasten geklemmt) statt der Bbox-Oberkante, dazu Randregeln (oben geklemmt → zeigt immer nach unten). Zipfel ist ein getaperter **Pfeil** (Fuß 18, Schultern bei 55 %, Länge 14…`arrow`), Trägheit über EINE Totzone (`dead` 44 px, `lazy` 0,10, Tempo-Deckel 18 px/Frame). Gemessen: Idle-Drift **0,00 px**, 286 px Weg in 0,22 s ohne Sprung (vorher 54,7 px/Frame). Kamera `close` 2,55 / `zoom` 2,05 × Radius (war zu nah). **§Ausgabe (30.7.):** Renderer war ohne `alpha:true` gebaut → „transparent" lieferte schwarz; behoben, und die `ShadowMaterial`-Ebene liegt jetzt auf `this._shadowPlane` mit Schalter + Deckkraft-Regler, bleibt bei transparentem BG stehen (Alpha-Differenz 82/255 = 32,2 % bei 0,32 · 153/255 = 60,0 % bei 0,60, ~7.140 Pixel) → freigestelltes Pet + halbtransparenter Schatten für den PNG-Export. **§Ruhemund (30.7.):** Backlog „happy-Emote ↔ Mund-Verdrahtung" geschlossen — `_applyEmote` ruft `mouth.setRest`, und `restMap`-Einträge dürfen eine FORM sein (`{tex,bend,rot}`) statt nur eines Decals: happy +0,35 · sad −0,55 · angry −0,45 · thinking −0,15/−3°. Während des Sprechens tragen die Viseme die Form (Ruhe-Form fällt weg). **Offen: §2c „der ganze Körper spricht"** — `onEmphasis` meldet die Betonungen, aber PetMotion ist in diesem Studio nicht eingehängt; kein Audio/Alignment/Export (§4). Teilt den Pet-Vertrag mit **Travel v14+** (derselbe `kfb-pets.js`-Stack): die Visem-Schicht ist additiv + reversibel, Travel bricht nicht. Doku `docs/PET_STUDIO_v4.md`. |
| `KFB Pet Studio v3.dc.html` (root; Motor-Module + Contracts in `studio-v3/`) | **AKTIV (2026-07-22)**: Root-Deliverable (im Seiten-Dropdown neben v1/v2), Fork der studio-v3-Fassung mit auf `./studio-v3/` umgebogenen Pfaden. Sprint §4i **Stufen 1–5 drin**: Blasen-Generator (Sprech/Denk/Flüster, handgezogen), Mund+Viseme („die Stimme ist die Uhr“, `speechSynthesis.boundary` taktet Mund+Text, DE-Buchstaben→Visem), Indikator (3 Zeichen über dem Körper-Anker via `getFaceShells`, Bewegung statt Farbe: neu=Pet-Farbe+KFB-rot pulsierend, gelesen=still, denkt=Typing-Wave in Kreisen), Streaming (erstes Mal strömt · Wiederholung sofort · Klick zeigt alles), Schlaf (ein Auslöser setzt Lider+Atem+Wiegen+Vorneigung, Klick weckt mit Freuden-Hüpfer, Auto bei Untaetigkeit pro Pet). UI: Panel-Header scrollt mit, 8 Clip-Buttons auf allen Tabs. Three 0.160. Render lädt `studio-v3/PET_EDITOR/pet-LIBRARY.json` v0.4.4; Export-Contract **canonical `kfb-pets.json` v1.2.0** (WS0-Merge 2026-07-22: v1.0.3 + Repo v1.1.0, `bubble.pad`=9, `speech.category` global null=aus Archetyp). Studio fetcht ab jetzt **canonical zuerst**, lokale `studio-v3/kfb-pets.json` (v1.2.0-Mirror) nur Fallback. Offen: happy-Emote↔Mund-Verdrahtung, Krone (Folge-Sprint). **Seit 2026-07-29 Vorgänger von v4 (Talking Puppet); Sign-off der Stufen 1–5 steht noch aus, deshalb noch nicht SUPERSEDED.** **Backlog: Sprechblasen-Zipfel-Orientierung bricht bei starkem Zoom/Rotation** (Kopf-Anker liegt ueber der oben geklemmten Blase → Zipfel zeigt nach oben ins Header statt runter zum Pet; Klemm-vs-Zipfel-Logik in `_rectPath`/`_bubbleTick`). Plan: `docs/PET_STUDIO_SPRINT_4i_PLAN.md`. |
| `studio-v3/KFB Pet Studio v3.dc.html` | **SUPERSEDED (2026-07-22)** von der Root-Fassung: gleiche Basis, aber ohne Stufe 2–5 und mit `./`-Pfaden. Clean-Run-Kandidat (Root ist die Wahrheit). Module in `studio-v3/` bleiben AKTIV/geteilt — die Root-Fassung importiert sie. |
| `KFB Pet Studio v2.dc.html` | **AKTIV (2026-07-20)**: Vertrags-Editor. **Sprint A + C fertig, am Pixel verifiziert.** A: lädt `kfb-pets.json` über kanonisches `kfb-pets.js` (canonical→lokal→inline), Defaults aus der Datei, Reiter→Abschnitt per-Pet/global, Export mit `version`-Bump, Round-Trip grün. C: 3D-Bühne über `makePet` (kein Sonderweg) — RoomEnvironment-HDRI + weicher Key + Bodenschatten, OrbitControls, Cursor-Blick (x negiert), Pads spielen Clips/Motions/Emotes/Triggers live, Voice-Transport → `pet.talk()`; Pet-Wechsel + Regler ändern das Bild sofort, EIN Augenpaar. WS0-Fixes am Pixel bestätigt: 20.07. (Farbe→Zahl=Gold, `mods:['emotes']`, `rig.build()`), 21.07. jsdelivr-Importe + Doppel-Einfärbung weg (gelb mit Zeichnung) + Mund/Mienenspiel verdrahtet (`pet.talk`, Ruhemund folgt Ausdruck: neutral→smile→m am Pixel bestätigt). Abnahme `captures/studio-v2/`. `three@0.160` via importmap (jsdelivr).
| — offene WS0-Fixes / lokale Proof-Patches | **`pet-mouth.v1.js` `MOUTH_FILES` haben falsche PNG-Namen**: echt = `FrizzleBobMouth_01_0000s_0001s_00NN_Name.png`, Modul lässt das `_0001s_`-Segment weg → alle 13 Mund-Texturen 404 → mundloser Pet. Lokal in `pet-mouth.v1.js` korrigiert + `kfb-pets.js` PetMouth-Import temporär auf `./pet-mouth.v1.js` gezogen (Proof). **WS0 auf GitHub: `_0001s_` in alle 13 Namen einfügen**, dann beide Proof-Patches zurücknehmen (Import wieder jsdelivr). | Offen: Sprint B (wartet auf WS0-Felder Licht/Kinetik/Voice/Perform), D (Export-Kreis). |
| `kfb-pets.js` (root) | ASSET/CODE, geteilt — lokale Kopie des kanonischen Moduls (`media/3D_Assets/kfb-pets.js`), damit die relativen Sibling-Importe auf die Root-Module zeigen. Datenquelle bleibt die kanonische URL. |
| `KFB Pet Studio v1.dc.html` | **FROZEN (2026-07-20)**: UI-Direktions-Pass, superseded von v2. Ist-Stand `docs/PET_STUDIO_v1.md`. Reine Shell (nur `support.js`), keine Runtime. Referenz für die UI-Direktion, nicht weiterbauen. |
| `KFB Pet Studio - Skizze.dc.html` | EXPERIMENT — Vorgänger-Skizze (Panel-Gruppierung) zu Studio v1 |
| `KFB Pet Editor v9.dc.html` | **AKTIV (aktueller Aussehen-Editor, 2026-07-19)**: v8 + Mund-Tab (Talk-Münder pro Pet platzieren, `pet.mouth {size,dy,sx}` im Contract; Motion-Editor v2 liest sie). Doku `docs/PET_EDITOR_v9.md` |
| `KFB Pet Editor v8.dc.html` | SUPERSEDED von v9 (Textur-Diagnose + Triplanar-Fell + Actor-Schnitte bleiben in v9 enthalten) |
| `KFB Pet Editor v7.dc.html` | SUPERSEDED von v8 (runder Kenney-Look default, Pfad Colormap+Papier+Gelb, `facet`/Look im Contract, v0.4.2) |
| `KFB Pet Editor v6.dc.html` | SUPERSEDED von v7 (Lid-Farbe aus Colormap, 24 Pets, v0.4.1) |
| `KFB Pet Editor v5.dc.html` | SUPERSEDED von v6 |
| `KFB Pet Editor v5 - standalone.html` | SUPERSEDED (Standalone von v5) |
| `KFB Pet Motion Editor v2.dc.html` | **AKTIV (aktueller Bewegungs-Editor, 2026-07-19)**: DAW-UI (Pad-Bar unten: Clips · Motions · Gesicht · Events · Combos; Tuning+Global rechts), Pet-Dropdown (alle 24), Talk-Münder, Abstands-Regler Begleiter↔Vehikel, Cursor-Blick, FX, kompakter Modus <920px. Doku `docs/MOTION_EDITOR_v2.md` |
| `KFB Pet Motion Editor v1.dc.html` (v1.1) | SUPERSEDED von v2 (eingefroren, liest weiter Contract v1) |
| `KFB Pet Editor v1/v2/v3/v4.dc.html` | SUPERSEDED (jede eingefroren als Referenz) |
| `KFB Pet Editor v3 - standalone.html` | SUPERSEDED |
| `pet-eye-rig.v1/v2/v3.js` | SUPERSEDED |
| `cube-pet.js`, `cube-pet.v6.js` | SUPERSEDED (Vorläufer der Library) |

Clean-Run-Kandidat: v1 bis v7 der Benches (v8 ist der aktive) plus die alten Rigs nach
`archive/pet-editors/` verschieben, danach CLAUDE.md-Pfade nachziehen. Nicht vor Sign-off, weil
CLAUDE.md sie als Referenz führt. **Achtung:** CLAUDE.md kennt v8 noch nicht (führt v7 als aktuell) —
beim nächsten CLAUDE.md-Update die v8-Zeile ergänzen und v7 auf SUPERSEDED setzen.

---

## 2. Restliche Projekte (Kontext, nicht mein Scope, hier nur geflaggt)

### Die Reise / Infinite Journey
| Datei | Status |
|---|---|
| `KFB InfiniteJourney v1.dc.html` + `infinite-journey.v1.js` | AKTIV, SUPERSEDED von v2 laut CLAUDE.md |
| `KFB InfiniteJourney v2.dc.html` + `infinite-journey.v2.js` | FROZEN (bend-Referenz) |
| `backup/KFB InfiniteJourney v1.CURRENT/.REFERENCE.dc.html` + zwei `.js` | EXPERIMENT/Backup, Wert prüfen |

`backup/` hält vier Dateien, die wie manuelle Sicherungen aussehen (CURRENT/REFERENCE-Paare). Wenn
die in v1/v2 aufgegangen sind, ist `backup/` löschbar. Entscheidung offen.

### Card-Viewer
| Datei | Status |
|---|---|
| `KFB Card Viewer v1.dc.html` + `card-viewer.v1.js` | DEAD (Fehlversuch, in CLAUDE.md dokumentiert, eingefroren) |
| `KFB Card Viewer v2.dc.html` + `card-viewer.v2b.js` | EXPERIMENT, NICHT in CLAUDE.md, Wert unklar |
| `KFB Card Viewer v3.dc.html` + `card-viewer.v3.js` | EXPERIMENT, NICHT in CLAUDE.md, Wert unklar |

Card-Viewer v2 und v3 sind nach v1s Post-Mortem entstanden, aber nirgends dokumentiert. Bitte
Ansage: dokumentieren, archivieren oder löschen.

### Tisch / Table
| Datei | Status |
|---|---|
| `KFB Table v6.dc.html` + `kfb-table.v6.js` | AKTIV (aktueller Tisch) |
| `KFB Table v3/v4/v5.dc.html` + zugehörige `.js` | FROZEN/SUPERSEDED (Referenzen) |
| `KFB Table v4 - standalone.html` | SUPERSEDED |

### Greybox / Explorationen
| Datei | Status |
|---|---|
| `KFB Comic Cube v1.dc.html` + `comic-cube.v1.js` / `comic-cube.v2.js` | FROZEN (Greybox-Proto, v2 = Graybox-Basis für die Reise) |
| `Hex Canvas.dc.html` + `hex-canvas.v1.js` | FROZEN (demoted, Overworld-Layer) |
| `Canvas.dc.html` | EXPERIMENT, nicht dokumentiert, Wert prüfen |
| `Sprint 08 - Floor & Bases Studie.dc.html` | EXPERIMENT/Studie, archivierbar |
| `archive/phase1/`, `archive/v2/` | FROZEN (Phase-1-Archiv, nicht weiterbauen) |
| `explore/bases_sample.png`, `explore/hex_preview.png` | ASSET (Explorations-Renders) |

---

## 3. 3D-Modelle (schwere Binärdateien, Projekt-Root-Hygiene)

CLAUDE.md-Regel: Assets IMMER per GitHub-raw laden, nichts Schweres ins Projekt. Verstöße:

| Datei | Flag |
|---|---|
| `dice_ugur_lowpoly.glb` (root) | ASSET, schwer, liegt im Repo-Root statt per raw-URL. Prüfen ob noch referenziert (Table nutzt Würfel), sonst raus und per URL ziehen. |
| `assets/dungeon/*.glb` (banner, barrel, chest, column, …) + `assets/dungeon/Textures/` | ASSET, Kenney-Dungeon-Props für Comic Cube v1 (FROZEN). Wenn die Greybox eingefroren ist, kann der Ordner nach GitHub und aus dem Projekt raus. |
| `.thumbnail` (root) | System-Artefakt, ignorieren. |

Aktion: erst prüfen, wer die GLBs noch lädt (grep), dann per raw-URL ersetzen und lokal entfernen.
Nicht blind löschen, der Table und die Greybox referenzieren evtl. lokale Pfade.

---

## 4. Screenshots (Produktion und Abnahme)

### Deine Produktions-Screenshots
| Ort | Inhalt | Flag |
|---|---|---|
| `uploads/Bildschirmfoto 2026-07-15…/2026-07-16…png` (19 Stück) | deine manuellen Screenshots aus der Produktion | zu sichten. Feedback-relevante nach `captures/<projekt>/` umbenennen und einsortieren, Rest löschen. |
| `uploads/GREYBOX INK OUTLINE 90von100 v1*.png` (4 Stück, teils Duplikate mit Hash-Suffix) | Outline-Feedback-Bilder | verarbeitet? dann löschen (Hygiene-Regel CLAUDE.md: Feedback-Bilder nach Verarbeitung löschen). |

### Abnahme-Captures (Agent-generiert)
Regel: pro Version die letzte Abnahme-Sequenz behalten, Diagnose-Frames sofort löschen. Nur in
`captures/stufeN/` bzw. `captures/<version>/`.
| Ordner | Status |
|---|---|
| `captures/v8/` | AKTIV, Abnahme Pet-Editor v8 (Fell-Triplanar, weiche Kanten, Lid-Fixes) |
| `captures/v6/`, `captures/v7/` | Abnahme Pet-Editor v6/v7, behalten bis v8 sign-off, dann löschbar |
| `captures/v5/` | Abnahme Pet-Editor v5 + Motion-Compat, SUPERSEDED, löschbar nach Sign-off |
| `captures/motion_v1/` | Abnahme Motion-Library v1, behalten oder in ein Archiv falten |
| `captures/stufe1/`, `captures/stufe2/` | Reise-Abnahme, gehört zum Journey-Scope |
| `captures/v4_check/` | Pet-Editor v4, SUPERSEDED, löschbar nach Sign-off |
| `captures/stufe3/` | Diagnose-Frames Studio-v3 (Blasen-Zipfel/Indikator-Probe, 2026-07-22) — 3D zeichnete im Agent-Iframe nicht, Abnahme lief über Georgs Live-Ansicht; DELETE-Kandidat |

---

## 5. Doku-Landschaft (docs/)

Neu 2026-07-22 (v3-Check-In): `docs/CHECKIN_2026-07-22_studio_v3.md` (v3-Stand, eingefroren vor v4),
`docs/ONBOARDING_pet_studio_v4.md` (Handover für den v4-Chat: Krone §4l + Glattziehen),
`docs/EMBED_CUBE_PET_FULL_v1.md` (Plug-&-Play-Bauanleitung für externe LLMs — ein Dokument, alle
Features/24 Pets/Farben/Beleuchtung/Fallstricke; **Ziel-Ablage GitHub**
`media/3D_Assets/GLB_cube-pets/EMBED_CUBE_PET_FULL_v1.md`, löst `EMBED_CUBE_PETS_v1.md` +
`EMBED_CUBE_PETS_v2_PROPOSAL.md` ab, sobald Georg es hochlädt).

AKTIV und maßgeblich: `docs/LEAD_PLAN_MVP1.md` (Fahrplan), `docs/PET_EDITOR_v9.md` (Ist-Stand Aussehen-Editor), `docs/MOTION_EDITOR_v2.md` (Ist-Stand Bewegungs-Editor), `docs/SESSIONCUT_2026-07-19.md` + `docs/HANDOVER_editors_2026-07-19.md` (aktueller Cut/Handover), `docs/ONBOARDING_pet_studio.md` (nächster Auftrag: Studio-Merge), `skills/session-export_v1.md` (Export-Regeln: Manifest → Veto → schlankes Zip), `docs/PET_EDITOR_v8.md`,
`docs/HANDOVER_pet_editor_v8.md` (Cowork), `docs/ONBOARDING_pet_editor_v8.md` (frische Chats),
`docs/MOTION_LIBRARY_v1.md`, `docs/CARTOON_MOTION_KNOWLEDGE.md`, `docs/ONBOARDING_pet_motion.md`,
**`docs/PET_STUDIO_v4.md`** (Ist-Stand Talking Puppet; §7 = v5-Backlog, §9 = Rote Lippen + Knick-Bremse,
§10 = Handover an den Coworker), dieses Dokument.

SUPERSEDED, aufräumbar: `docs/PET_EDITOR_v4.md` bis `_v7.md`, `docs/CHECKIN_2026-07-16_editors.md`,
`docs/HANDOVER_editors_2026-07-16.md`, `docs/00_START_HERE_v3.md`, `docs/BACKLOG_v3.md`,
`docs/SPRINT_07_cube_pets_avatars.md`, ältere `00_START_HERE_v*`. Nicht löschen ohne Blick, einige
sind in CLAUDE.md verlinkt.

---

## 6. Clean-Run-Checkliste (nach Freigabe, nicht vorher)

1. Card-Viewer v2/v3 entscheiden (dokumentieren, archivieren, löschen).
2. `uploads/`-Screenshots sichten, Feedback-Bilder löschen, Rest einsortieren.
3. `backup/`-Paare prüfen, ob in Journey v1/v2 aufgegangen, dann löschen.
4. 3D-GLBs im Root und `assets/dungeon/` auf raw-URL umstellen, lokal entfernen.
5. Pet-Editor v1 bis v4, alte Rigs, `cube-pet*.js` nach `archive/` verschieben, CLAUDE.md-Pfade nachziehen.
6. SUPERSEDED-Captures und -Docs entfernen.
6b. `studio-v3/KFB Pet Studio v3.dc.html` (SUPERSEDED-Dup der Root-Fassung) und die Diagnose-Frames `captures/stufe3/` entfernen.
6c. `uploads/Bildschirmfoto 2026-08-04 um 03.32.38.png` (Georgs Knick-Befund) — **verarbeitet**, Fix
   gemessen und dokumentiert (§9 PET_STUDIO_v4). Nach Hygiene-Regel löschbar.
6d. Podcast-Scope: `window.__kfbPodcast.gridTable()` auslesen und die gesammelten `cardGrid`-Zahlen
   ins `media/kfb/index.json` heben (EMBED §6) — die Tabelle gehört ins Repo, nicht in localStorage.
6e. Bei jeder Modul-Änderung im Podcast-Scope: **harter Reload** vor der Abnahme. Die laufende Seite
   hält die alte ES-Modul-Instanz und meldet keinen Fehler (kostete diese Session zwei Messrunden).
7. Danach Session-Export NACH `skills/session-export_v1.md`: Manifest → Georgs Veto-Fenster → nur Session-Dateien zippen (hartes 2-MB-Budget pro Datei, Assets per RAW-URL). NIE Voll-Projekt-Zip.

Jeder Schritt einzeln, jeder mit Sign-off. Keine Sammellöschung.
