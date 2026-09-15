# RETURN WSA · Job WS0_2026-09-15 · Quelllieferung geprüft
*15.09.2026 · Ergebnis A. **Ergebnis B (`B_OBERFLAECHE/`) ist gesichert, aber nicht geprüft und
nicht eingespielt** — der UI-Rework bleibt ein eigener Auftrag.*

## In einem Satz

Der WS0-Quellstand ist geschlossen und startet: **7 von 7 Blättern** aus dem frisch entpackten
Ordner gebootet, **0** unauflösbare lokale Modulreferenzen, **101/101** Prüfsummen PASS,
**30 von 31** Embed-Dateien bytegleich zum Pin mit genau der einen angekündigten Austauschdatei —
damit ist die T1-Stop-Grenze »Modulbaum fehlt« aufgehoben, **nicht** aber die Abnahme des
sichtbaren Stands.

## Identität

- sourceRepository: `georg-doc/kayfabizarro` · Zweig `main` · Pfad `tools/KFB-ToolBox/_inbox/KFB FrankenStein ToolBox (WS0).zip`
- sourceCommit: **UNRESOLVED** (Connector liefert Tree `a3adb84692fd`, keinen Commit-SHA — nicht geraten)
- Archiv: 1 846 232 B · sha256 `948d195017e2ab7dd26f3e9c5cb4f01d00fa614e0e6425431db04e43b2393c5b`
- Referenz-Pin: `525288d67a9fdfd94caacf19e47b4ba333dc1ca2` (von WS0 genannt; die Blob-Werte der 32 Embed-Dateien an `main` stimmen damit überein)
- aktive Authoring-Pfade je Blatt: `_inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/*.dc.html` (7 Einstiege)
- Build-/Exportkommando: **keines**. `src/` über HTTP ausliefern, ein Blatt öffnen. `file://` trägt nicht.
- workBranch / PR: nicht angelegt, keine GitHub-Schreiboperation in dieser Runde
- Vorschau-URL / Publikationsrevision: keine
- enthält uncommittierte Arbeit: **nein** auf unserer Seite (nur Ablage und Prüfdateien)

## IMPLEMENTATION

**Übernommen, nicht nachgebaut.** Das Archiv wurde über den Repo-Rohpfad geholt, gehasht, unverändert
unter `original/` abgelegt und nach `unpacked/` entpackt (113 Einträge, sha256 je Datei in
`SOURCE_MANIFEST.json`). Kein Modul umbenannt, keine Datei verändert, kein Fremdmodul beigemischt.

**Kein zweiter Fork.** Der Quellbaum wird **nicht** nach `site/` kopiert: das wäre ein dauerhaft
parallel gepflegter Modulbaum (Arbeitsregel). Er ist als lesbarer Baum an einer Adresse vorhanden
und von dort startbar. Die drei Standalone-Bundles in `site/` bleiben unverändert liegen; sie sind
ab jetzt **nicht mehr der Startweg**, sondern Ausgaben eines früheren Stands.

**Nicht wiederholt:** der R1-Fix. Er liegt im Paket am Quelltext vor und wurde nur **nachgelesen**
(siehe Beleg 2). Ebenso nicht angefaßt: `pet-LIBRARY.json`-Entscheidung, Font-Pass, Ergebnis B.

## TESTED RESULT

| Gate | PASS / FAIL / NOT_TESTED | Umgebung / Revision | Beobachtung | Beleg |
|---|---|---|---|---|
| Boot 7/7 Blätter | **PASS** | Chromium-Vorschau über HTTP, 924×540, frisch entpackter Ordner, 15.09. | jedes Blatt rendert Oberfläche **und** 3D-Inhalt | `qa-wsa/coldstart-{studio,rigging,animlab,recherchi,vergleich,frizzledummy,mechrig}-wsa.png` |
| Modulschluß je Einstieg | **PASS** | statische Analyse, MODBASE-Anker modelliert | 87 Dateien · 78 erreicht · **0** unauflösbare lokale Modulreferenzen | `qa-wsa/closure-wsa.json` |
| Paketintegrität | **PASS** | sha256 beim Entpacken | 101/101 Zeilen aus `CHECKSUMS.sha256` stimmen | `qa-wsa/checksums-wsa.json` |
| Identität gegen Pin | **PASS** | Git-Blob-SHA1 | 30/31 bytegleich, 1 Abweichung = v3.1-Austauschdatei | `qa-wsa/identity-wsa.json` |
| Daten erhalten (Verträge) | **PASS** | JSON-Blattzählung | 591 · 589 · 166 · 52 · 99 · 865 exakt reproduziert, 24 Pets, Schemata `kfb.pets/1` / `kfb.carl.rig/6` | `qa-wsa/fields-wsa.json` |
| Parameter angewandt | **PASS für die belegten Felder** | Quelltext + Kaltstart + Feldmatrix | R1-Filter vorhanden und wirksam; 48 Matrixzeilen, 17 davon mit Sichtbeleg, 2 \`NOT_MEASURED\` | Beleg 2 unten · \`FIELD_COVERAGE.md\` · \`qa-wsa/field-coverage-wsa.json\` |
| Sichtbar gleich | **TEILWEISE** | Kaltstart gegen WS0-Bericht | Startbericht und Meßzahlen reproduziert; Vergleich gegen die **laufende Authoring-Quelle** war uns nicht möglich | Beleg 3 unten |
| Graft / Carl / Clips | **TEILWEISE** | Kaltstart | Graft, CapsuleCarl, Recherchi, Dummy, Mech bauen und rendern; Clip spielt (`Jump_Full_Long`, 2 333 ms) | Bilder oben |
| Mods / Talk / Blick | NOT_TESTED | — | keine Bedienung ausgelöst | — |
| Rundlauf Export/Import · Fremdpets · Sitzung | NOT_TESTED | — | nichts gespeichert, nichts importiert | — |
| Prüfgrößen 1440×900 / 1024×768 / 768×1024 / 390×844 | NOT_TESTED | — | gehört zu Ergebnis B | — |
| Fontnetzwerk / Zoom / Focus / Reload | NOT_TESTED | — | — | — |
| Klangbank (`kfb-pinball-sfx.json`) | NOT_TESTED | — | wird erst beim ersten Klick geholt | — |
| Publikation / Build-Identität | **FAIL (unauflösbar hier)** | — | Commit-SHA des Archivs nicht ermittelbar | Identität oben |

WS0s eigene Messungen (`A_QUELLSTAND/qa/`) sind **historische Donor-QA** und zählen nicht als heute ausgeführt.

## Die drei Belege, getrennt

**1 · Daten erhalten — PASS.** 101/101 Prüfsummen. Alle sechs Blattfeldzahlen aus `RETURN.md`
unabhängig reproduziert (591 · 589 · 166 · 52 · 99 · 865); `kfb-pets.json` trägt 24 Einträge;
beide Contracts aus dem Embed-Baum bytegleich im Paket. Nichts abgeschnitten, nichts vereinheitlicht.

**2 · Parameter angewandt — TEILWEISE.** Am Quelltext nachgelesen, **nicht** neu reparieret:
`lab-v6/carlrig-mount.v1.js` importiert `DEFAULTS as PART_FIELDS` aus `partrig.v1.js` und übergibt
`{ ...only(brow.original, PART_FIELDS), enabled: brow.mod === 'block' }` (ebenso für `nose`); der
Rückgabestatus wird ausgewertet, `applied`/`rejected` und `UNSUPPORTED` sind vorhanden, der frühere
Vollspread `{ ...brow }` kommt nicht mehr vor. Damit ist die Stelle aus dem Review vom 14.09.
geschlossen — und zwar positiv über die sechs `PartRig`-Felder, wie in der Ergänzung verlangt,
nicht nur über `mod`.
**Gemessen im Kaltstart:** die Werkbank steht mit Spacing 0,226 · Height 0,308 · Eye size 0,140 ·
Lid fit 0,92 · Lash length 0,45 — die Nicht-Standardwerte kommen an. Carl ist DocCheck-Rot;
in unserer Umgebung ohne lokale Werkbanksitzung gewinnt also der **Vertrag**, genau wie entschieden.
**Nachgeliefert 15.09.:** die positive Abdeckungsmatrix \`FIELD_COVERAGE.md\` (48 Zeilen über beide
Leser: gespeichertes Feld → Consumer → angewandtes Feld → Status → Beleg). Ergebnis: kein
gespeichertes Feld geht unbemerkt verloren. Drei Befunde betreffen den **Bericht**, nicht die Daten —
\`mountGraft\` führt kein \`applied[]\`/\`rejected[]\` je Feld, der Mund ist der einzige ungefilterte
Vollspread, und der Bart-Feldname divergiert zwischen den Lesern (\`form\` gegen \`style\`). Keiner davon
ist ein Source- oder Contract-Blocker; Owner WS0. Offen bleibt nur der Laufzeitmitschnitt von
\`report.applied[]\` aus einem echten \`mountCarl\`-Aufruf (WS0s Prüfseite) sowie \`seat\` und \`cardRider\`.

**3 · Sichtbar gleich — TEILWEISE.** Der Startbericht des Studios reproduziert sich Wort für Wort:
`repo v1.2.8`, `[GUARD] kein Entwurf ueberstimmt das Repo`, Maßstab **0,516**, Kopf **1 500 Dreiecke**,
**765/2 293 Punkte**, `facegraft` Spender `matchesExpected: true`. Die Abweichungen sind **alle** der
fehlenden Sitzung zuzuschreiben und damit erklärt, nicht offen:

| | WS0 (mit Georgs Sitzung) | WSA (ohne Sitzung) |
|---|---|---|
| Studio-Startbericht | 25 Pets · 1 Entwurf | **24 Pets · 0 Entwürfe** |
| Animation Lab, gewählte Figur | Monstrosity, `Running_A` | Graft · Driver, `Jump_Full_Long` |
| Rigging Lab, Height | 0,312 | **0,308** |

Die ersten zwei Zeilen sind der Sitzungsunterschied selbst (der 25. Pet und der Entwurf sind Georgs).
**Die dritte ist seit der Feldmatrix ebenfalls erklärt** (\`FIELD_COVERAGE.md\` §3.2): der Vertrag
\`kfb-pet-capsule-carl.json\` speichert \`eye.dy = 0.308\` — der Leser wendet also den Vertragswert an,
und 0,312 ist der Wert der Werkbanksitzung \`kfb.carl.rig.v6.3\`, die nur im Authoring überstimmen darf.
Gegenprobe in derselben Matrixzeile: \`dx\`, \`ring\`, \`track\`, \`lidFit\`, \`lashes\` sind in Vertrag **und**
beiden Messungen gleich; abweichend ist genau das eine Feld, das die Sitzung hält.
Ein Vergleich gegen die **laufende** Authoring-Quelle war uns technisch nicht möglich; »gleich« heißt
hier: gleich zum berichteten Stand.

## Zwei Beobachtungen aus dem Start, die Arbeit sparen

1. **Zu früh ist falsch.** Nach ~1 s zeigt das Rigging Lab `Loading Carl …` und die Regler stehen auf
   0,164 / 0,317 / 0,130; erst nach vollem Laden auf 0,226 / 0,308 / 0,140. Ein Standbild aus dem
   halben Boot belegt die falschen Zahlen. Verwandt mit WS0s Falle 1, aber eine eigene: hier parkt
   nichts, hier ist nur noch nicht geladen.
2. **Ein Konsolenfehler auf jedem Blatt, undiagnostiziert:** `[resource_error] SCRIPT failed to load:`
   **ohne URL**. Kein Blatt bricht dadurch ab. Kandidat ist der Oberflächenrahmen `_ds/…/_ds_bundle.js`
   oder eine Schrift-Anfrage der Vorschau — **nicht nachgewiesen**, deshalb als offen geführt.

## GEORG ACCEPTANCE

**Nicht angefragt.** Keine Freigabe vorweggenommen. Zur Entscheidung stehen unverändert Georgs offene
Frage aus `RETURN.md` (`pet-LIBRARY.json`: Weg a/b/c — WS0 nennt (c) als seine Wahl und hat sie in
`B_OBERFLAECHE/` schon umgesetzt) und der Font-Weg (Dateien nachreichen oder auf Web-Fonts umstellen).

## UNRESOLVED / DEFERRED

| Offen | Auswirkung | Owner | nächster konkreter Test |
|---|---|---|---|
| Commit-SHA des Archivs | Herkunft nur über sha256 gepinnt, nicht über die Historie | ToolBox/WSA | SHA aus der Commit-Historie des Pfads ablesen und in `SOURCE_MANIFEST.json` nachtragen |
| Feldabdeckung je Kanal | Beleg 2 bleibt Stichprobe | WS0 | Prüfseite in `qa/`, die `mountCarl`/`mountGraft` mit den Verträgen aufruft und `applied[]`/`rejected[]` ausschreibt |
| `pet-LIBRARY.json` | keine Emotes, kein Gesichts-Block; Ausfall im Quellstand stumm | Georg entscheidet, WS0 baut | Weg a/b/c wählen; (c) liegt in `B_OBERFLAECHE/` fertig |
| 17 Schriftdateien | 17 Regeln ohne Datei, `swap` trägt | Georg / WS0 | Dateien nachreichen **oder** Web-Font-Umstellung; Liste in `docs/FONT_INVENTORY.json` |
| `kfb-pinball-sfx.json` | Klang ungeprüft | WS0 | einen Klick auslösen und Konsole mitschreiben |
| Rundlauf / Fremdpets / Sitzung | Datenverlustrisiko unbelegt | ToolBox/WSA | Export–Import auf frischer **und** vorhandener Sitzung, False/0/Null/Unknown erhalten |
| Vier Prüfgrößen, Drawer je Spalte | schmales Fenster unbenutzbar | Ergebnis B | eigener Auftrag |
| `resource_error` ohne URL | unklar | ToolBox/WSA | Netzwerkmitschrift bei einem Blattstart |
| `kfb-rigs-embed-v3.manifest.json` · `REVIEW_ANTWORT_v3.1.md` · zwei v3.1-Dateien | Repo hinkt dem Paket nach | WS0 | in `tools/KFB-ToolBox/kfb-rigs-embed-v3/` einspielen |
| `DELTA_FOLGE_01.md` außerhalb `CHECKSUMS.sha256` | Integrität dieser einen Datei nicht paketgepinnt | WS0 | Prüfsummen als letzter Schritt neu erzeugen |

Keine pauschale Plattform- oder Berechtigungsdiagnose: der Connector konnte das ZIP nicht als Asset
importieren (nur Bilder und Schriften), der Repo-Rohpfad trug. Das ist eine Werkzeuggrenze, keine Aussage über Rechte.

## Recovery

Letzter funktionierender Stand: **dieser Jobordner**.
Startweg: `_inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/` über HTTP, ein `.dc.html` öffnen.
Rückweg: `original/KFB FrankenStein ToolBox -WS0-.zip` (sha256 im Manifest) neu entpacken.
Ziel-Consumer: WS0-Authoring-Workspace. Keine Secret- oder Font-Binaries im Paket und in dieser Ablage.
Nächste konkrete Handlung: Feldabdeckungstabelle **oder** Georgs Entscheidung zu `pet-LIBRARY.json` —
beides blockiert Ergebnis A nicht, beides blockiert eine Suite-Freigabe.
