# Übergabe an WSA · KFB ToolBox · 15.09.2026

**Zwei Ergebnisse, getrennt abgenommen.** A ist der kaltstartfähige Quellstand mit echtem Delta,
B ist die Kritik am realen Arbeitsweg plus ein UI-Pilot auf denselben Modulen. Getrennte Ordner,
damit gesicherte Baseline und spätere Änderung unterscheidbar bleiben.

    A_QUELLSTAND/     Ergebnis A · abgenommen 15.09. · 101 Dateien, 3,33 MB
    B_OBERFLAECHE/    Ergebnis B · Kritik, Pilot, geänderter Studio-Stand
    docs/             Housekeeping, Repo-Bezug, Chronik

## Der erste Lesepfad — in dieser Reihenfolge
1. `A_QUELLSTAND/qa/Start und Vergleich.dc.html` — eine Seite, alle Zahlen, die vier Kaltstartbilder.
2. `A_QUELLSTAND/RETURN.md` — was drin ist, wie es startet, was offen ist.
3. `B_OBERFLAECHE/KRITIK_UX_CARL_WEG_v1.md` — zehn Punkte mit Fundstelle.
4. `docs/HOUSEKEEPING.md` — Status je Artefakt und die Clean-Run-Checkliste.

## Der Satz, der die Reihenfolge erklärt
**Kein einziges der 30 Module von Rig-Embed v3 ist seit dem gepinnten Commit
`525288d67a9fdfd94caacf19e47b4ba333dc1ca2` angefaßt worden.** 30 von 32 baumsichtbaren Dateien sind
bytegleich, die zwei Abweichungen sind genau die angekündigten v3.1-Austauschdateien. Der Zugewinn
der Werkstatt liegt in **52 Dateien** und sieben Blättern, die v3 nie enthielt. Wer ein Delta »im
Inneren von v3« sucht, sucht am falschen Ort.

## Ergebnis A starten
`A_QUELLSTAND/src/` über **HTTP** ausliefern, dann ein Blatt öffnen. Kein Build, kein Paketmanager.

    src/KFB FrankenStein Studio v17.dc.html      vier Bewohner · Materialzonen · Anim-Reiter
    src/KFB Rigging Lab v1.dc.html               CapsuleCarl-Werkbank · 21 Zonen
    src/KFB Animation Lab v3.dc.html             Vertrag als Figurenquelle · Clips · Waffenanker
    src/KFB Recherchi Lab v1.dc.html             Würfel, sechs bedienbare HTML-Flächen
    src/KFB Vergleich Graft vs Carl v1.dc.html   Zwei-Figuren-Probe
    src/KFB FrizzleDummy Lab v1.dc.html          Messbank Wirtsfiguren
    src/KFB Mech and Vehicle Rig v2.dc.html      Sockel · Rover · Wanne

⚠ **`file://` trägt nicht** (ES-Module). ⚠ **Die Ordnerstruktur nicht umsortieren** — Studio v17
setzt `__KFB_MODBASE = petstudio-v9/` und lädt `./studio-v7/…` **und** `../lab-v6/…`.

**Gemessener Kaltstart:** Rigging Lab **0** HTTP-Ausfälle · Animation Lab **0** · Studio **3** — und
**dieselben drei, mit denselben Pfaden, in der Authoring-Quelle**. Der Export hat nichts verloren.
Mehr als drei heißt: eine Datei fehlt bei dir.

## Ergebnis B starten — ein Kopierschritt
Der Pilot lädt dieselben Module wie das Studio und muß deshalb **im selben Baum** liegen.
`A_QUELLSTAND/src/` bleibt absichtlich unangetastet, also:

    zwei Dateien aus B_OBERFLAECHE/ nach A_QUELLSTAND/src/ kopieren:
      KFB ToolBox Pilot v1.dc.html
      support.js          (nur falls dort noch keine liegt — es liegt eine)

Dann `src/KFB ToolBox Pilot v1.dc.html` öffnen. **Select → Shape & Look → Attach & Fit →
Motion & Talk → Export.** Er baut keine Figur selbst: `mountCarl` · `mountGraft` · `faceMods()`.

`KFB FrankenStein Studio v17 mit LIBRARY-Streifen.dc.html` ist der **geänderte** Studio-Stand
(nach der A-Abnahme, begründet in `A_QUELLSTAND/DELTA_FOLGE_01.md`). Wer ihn will, ersetzt damit
`src/KFB FrankenStein Studio v17.dc.html`. Wer die Baseline prüfen will, läßt ihn liegen.

## Was entschieden ist
**Carl ist DocCheck-Rot `#c03`, und der Vertrag gewinnt.** `kfb-pet-capsule-carl.json` färbt die Zone
»capsule (body)« selbst. Die Werkbanksitzung `kfb.carl.rig.v6.3` ist ein **lokaler Entwurf** — sie
darf den Vertrag im Authoring überstimmen, **nie in einem Consumer-Paket**. Ein sandfarbener Carl im
Rigging Lab ist dieser Entwurf, nicht der ausgelieferte Look. Georgs Sitzung wurde **nicht**
angeglichen: eine Entscheidung löscht keinen Entwurf.

**`pet-LIBRARY.json` bleibt fehlend, der Ausfall ist nicht mehr stumm.** Georgs Wahl (c). Vorher
setzte der `catch` einen Statustext, den die Chrome nirgends rendert — ein Studio ohne Emotes und
ohne Gesichts-Block, das aussah wie eines mit.

## Was offen ist
1. **Schmales Fenster.** Beide Inspector-Spalten stehen immer, die Bühne behält 382 px. Es braucht
   einen Drawer je Spalte — und **danach** die vier Prüfgrößen (1440×900 · 1024×768 · 768×1024 ·
   390×844). ⚠ Über diese Größen steht **keine** Aussage da, auch keine beruhigende: mein Versuch,
   die Breite im laufenden Blatt zu klemmen, war wirkungslos (die Bühne ist absolut positioniert),
   und ein wirkungsloser Versuch ist kein Befund.
2. **Der letzte Schritt des Prüfablaufs.** Das Profil fällt aus dem Piloten heraus, im unabhängigen
   Embed geladen wurde es noch nicht.
3. **18 `@font-face`-Regeln** auf ein `fonts/`-Verzeichnis, das es nicht gibt. **Absichtlich nicht
   im Paket** (keine Schriftdateien in Übergaben). Dateien nachreichen oder auf Web-Fonts umstellen —
   eine Entscheidung, kein Fehler.
4. **`kfb-pinball-sfx.json`** fehlt, wird erst beim ersten Klick geholt, also **ungeprüft**.
5. **Feldabdeckung über alle Kanäle** (Augenfarben, Schnurrbart, Mund-Set, Visemes, Materialzonen),
   Rundlauf Export/Import, Talk und Ruhe als Abnahme, Kaltstart der vier übrigen Blätter.
   Der Pilot zeigt `applied`/`rejected` schon als Fläche — das ist der Anfang, nicht die Tabelle.

## Vier Fallen, in diesem Projekt bezahlt
1. **Im verborgenen Vorschaufenster parkt die Bildschleife.** Vor jedem Standbild selbst rendern,
   sonst sieht ein gesunder Bau tot aus (Zähler bei 35, `tri 2`).
2. **Eine Messung darf nichts speichern.** Alles mit `save`, `_touchPet`, `_ensureInLib` schreibt in
   Georgs Sitzung. Der Pilot hat einen eigenen Schlüssel `kfb-toolbox-pilot-v1` und ist deshalb für
   Messungen unbedenklich.
3. **Das GitHub-Baumwerkzeug verbirgt `.glb` und `.gltf`** in diesem Repo. Es meldete 32 Dateien und
   verschwieg `FrizzleBob_Yellow.gltf` (608 342 B), die dort sehr wohl liegt. Direkt lesen entscheidet.
4. **Ein Manifest ist kein Identitätsanker.** Die Byte-Angaben im v3-Manifest sind durchgehend
   kleiner als Pin und Datei (12 315 statt 12 516). Nur Blob- oder sha256-Hashes taugen.

## Integrität
`A_QUELLSTAND/CHECKSUMS.sha256` deckt jede Paketdatei außer sich selbst und `MANIFEST.json`;
zuletzt erzeugt, nach allen inhaltlichen Änderungen. `MANIFEST.json` führt unter `validation` jede
Prüfung einzeln — **GEMESSEN** oder **NICHT GEPRÜFT**, nichts dazwischen.

**Keine Schreibvorgänge im Repo** durch diese Runde. Zwei Dateien sind dort nachzuziehen:
`kfb-rigs-embed-v3.manifest.json` und `REVIEW_ANTWORT_v3.1.md` liegen am Pin nicht vor, und die
beiden v3.1-Austauschdateien sind noch nicht eingespielt.
