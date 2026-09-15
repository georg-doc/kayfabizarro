# Delta WSA · WS0-Quellstand gegen den gepinnten Rig-Embed-Stand
*15.09.2026 · eigene Rechnung, unabhängig von `A_QUELLSTAND/DELTA.md`.
Verfahren: Git-Blob-SHA1 (`sha1("blob "+len+NUL+Inhalt)`) jeder Paketdatei gegen die Blob-Hashes
des Connector-Trees `tools/KFB-ToolBox/kfb-rigs-embed-v3/` @ `main` (Tree `a3adb84692fd`),
Präfixvergleich 12 Zeichen. Rohdaten: `qa-wsa/identity-wsa.json`.*

## 1 · Was verglichen wurde

Der Embed-Baum zeigt am Repo-Stand `main` **32** Dateien (30 Module + 2 Contracts). Für 31 von
ihnen liegt im Paket eine namens- oder rollengleiche Datei; `EMBED_KFB_RIGS_v3.md` ist Anleitung
und im Paket nicht enthalten.

| | Zahl |
|---|---|
| verglichen | **31** |
| bytegleich (Blob-Hash identisch) | **30** |
| abweichend | **1** |
| nicht auflösbare lokale Modulreferenzen im Paket | **0** |

**SOURCE FACT:** Die einzige Abweichung ist `lab-v6/carlrig-mount.v1.js` —
Pin 5 716 B / `52dfccb5ad19` → Paket 9 780 B / `ff3262743ed9`. Das ist genau die angekündigte
v3.1-Austauschdatei. Die Aussage »kein v3-Modul ist seit dem Pin angefaßt worden« hält der
Nachrechnung stand.

**Bestätigung des Pins nach der anderen Seite:** `carlrig-mount.v1.js` liegt im Repo weiterhin mit
5 716 B / `52dfccb5ad19` und `EMBED_KFB_RIGS_v3.md` mit 12 516 B / `5ac6d3ecb81c` — also genau mit
den Werten, die WS0 für den Commit `525288d6` nennt. **Die beiden v3.1-Dateien sind im Repo
weiterhin nicht eingespielt**, ebenso fehlen dort `kfb-rigs-embed-v3.manifest.json` und
`REVIEW_ANTWORT_v3.1.md`.

### Eine Ergänzung zu WS0s Aufstellung
`A_QUELLSTAND/DELTA.md` §1a zählt 29 unveränderte v3-Module und führt `contracts/kfb-carl-rig-v6.json`
nicht mit auf. Diese Datei liegt im Paket als `lab-v2/config/kfb-carl-rig-default.json` und ist
**bytegleich** (`b57d125ce047`, 2 754 B). Damit sind es 30 bytegleiche Dateien — die Zahl »30 von 32«
in `RETURN.md` ist richtig, nur die Aufzählung in §1a ist um diesen Eintrag zu kurz.

## 2 · Das eigentliche Delta: gegen unseren T1-Stand

Für die ToolBox ist die wichtigere Rechnung nicht »Paket gegen v3«, sondern **»Paket gegen das,
was T1 fehlte«**. `docs/MISSING_MODULES.md` führte neun am 13.09. angelegte Dateien als nirgends
auffindbar und fünf davon auch nach dem Embed-v3-Fund noch.

| am 14.09. nirgends auffindbar | im WS0-Paket |
|---|---|
| `lab-v6/browgraft.v1.js` | **nicht enthalten** — und **nicht mehr nötig**: die Braue kommt im Quellstand aus `lab-v6/brow.v3.js` und `petstudio-v9/studio-v12/brow-rig.v2.js`; kein Einstieg referenziert `browgraft` |
| `frizzlegraft-v1/anim-contract.v1.js` | **enthalten** (4 097 B) |
| `frizzlegraft-v1/actor-color.v1.js` | **enthalten** (2 875 B) |
| `petstudio-v9/kfb-pet-graft-driver-default.json` | **enthalten** (30 031 B) |
| `petstudio-v9/kfb-pet-capsule-carl.json` | **enthalten** (5 818 B) |

Dazu die drei Dateien, an denen im Kaltstart der drei Bundles jeweils abgebrochen wurde:
`petstudio-v9/studio-v7/pet-session.v1.js` · `lab-v2/sources.js` · `lab/assets.js` — **alle drei
enthalten**. Ebenso das Spendermodell `petstudio-v9/assets/models/FrizzleBob_Yellow.gltf` (608 342 B).

**SOURCE FACT:** Damit ist die Stop-Grenze aus `docs/MISSING_MODULES.md` aufgehoben. Der Quellstand
ist geschlossen: 87 Dateien, 7 Einstiege, 78 davon von einem Einstieg aus erreichbar,
**0 unauflösbare lokale Modulreferenzen**. Die Anforderung »Modulordner aus dem Authoring-Workspace
exportieren« ist erfüllt — allerdings **nicht** als Ergänzung neben die Bundles, sondern als
eigener, startfähiger Quellbaum mit sieben eigenen `.dc.html`-Einstiegen.

### Was der Quellstand mehr kann als die drei Bundles
Vier zusätzliche Einstiege (Recherchi Lab, Vergleich Graft vs Carl, FrizzleDummy Lab,
Mech & Vehicle Rig v2), Animation Lab **v3** statt v2 (Vertrag als Figurenquelle), Recherchi als
vierte Bewohnerklasse im Studio, Carl-Farb- und Oberflächenzonen, Kartenreiter, Sockel und Wanne.
Fähigkeitsdetails: `unpacked/A_QUELLSTAND/DELTA.md` §2 — dort belegt, hier nicht nachgeprüft.

## 3 · Nicht statisch erreichte Dateien (9) — keine Lücke

`_ds/…/_ds_bundle.js` und `colors_and_type.css` (Oberflächenrahmen, vom Wirt geladen) ·
`fixtures/kfb-rig-driver-bath-01.json` · `fixtures/kfb-rig-driver-cockpit-01.json` (Fixtures, per Hand geladen) ·
`frizzlegraft-v1/ears.v1.js` (bewußt behaltener Rückfallweg) ·
`frizzlegraft-v1/kfb-card-backside.png` (über die Konstante `CARD_ART` geladen, nicht als Pfadliteral) ·
`lab-v2/config/kfb-carl-rig-default.json` · `lab-v2/config/kfb-pet-graft-driver.json` (Vorgabedateien) ·
`petstudio-v9/support.js` (zweite Kopie der DC-Laufzeit, identisch zur Kopie in `src/`).

Drei Spezifizierer sind statisch **nicht** entscheidbar und deshalb so geführt:
`LIB_URL` (Studio → `pet-LIBRARY.json`), `SPEC` (KloRolli), `BASE` (Klangbank).

## 4 · Was am Paket nicht stimmt (klein, aber benannt)

1. **`DELTA_FOLGE_01.md` ist von `CHECKSUMS.sha256` nicht gedeckt.** Die Liste deckt 101 Dateien;
   ungedeckt sind `CHECKSUMS.sha256` selbst, `MANIFEST.json` — **und** `DELTA_FOLGE_01.md` (2 608 B).
   Die Datei ist also nach dem Hashen entstanden. Dieselbe Fehlerklasse wie am 14.09. bei `RETURN.md`
   (Changelog, CORRECTION · Prüfsumme). Kein Blocker: ihr sha256 ist jetzt in `SOURCE_MANIFEST.json`
   festgehalten. Regel bleibt: Prüfsummen als letzter Schritt.
2. **17, nicht 18 Schriftdateien.** Der Quelltext von Studio v17 zeigt auf **17 verschiedene**
   Dateien unter `fonts/` (Liste in `qa-wsa/closure-wsa.json` unter `unresolvedLocalRefs`) —
   identisch mit `docs/FONT_INVENTORY.json`. WS0 nennt »18 `@font-face`-Regeln«; das ist die Zahl
   der Regeln, nicht der Dateien. Sachlich derselbe Befund, für den Font-Pass zählt die Dateiliste.
3. **Die Umbenennung `&` → `and`** im Mech-Rig-Blatt ist im Paket vollzogen und in `DELTA.md` §1e
   offengelegt; unsere Startpfade folgen dem Paketnamen.
