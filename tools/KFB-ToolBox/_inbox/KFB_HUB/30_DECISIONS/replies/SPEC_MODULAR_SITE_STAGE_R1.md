# Spec · Modulare Site mit Stage-Kanal · R1 · WS0 · Übergabe-Tag (Entwurf zur Abnahme durch Georg)

Für: WS1 (Lead, Build), WSA (Plattform), alle Sitzungen, die Module liefern. Anlass: Georg möchte nicht bei jeder Änderung 45 MB verschieben und keine Meta-Sprints mit Gesamtpaket. Neue Module sollen direkt testbar sein (Stage-Idee).

## Tier 0
1. **Drei Schichten:**
   - **Hülle:** Plattform, Passwort, Lader, ein paar KB. Wird selten neu deployt.
   - **Basis:** gekaufte Modelle, groß. Ändert sich selten, liegt im Site-Paket, Dateinamen mit Inhalts-Hash.
   - **Module:** Code-Teile, Daten, Karten, Ton, öffentliche Modelle. Laden zur Laufzeit von einem festen Commit.
2. **Ein Manifest je Kanal entscheidet, welcher Stand eines Moduls lädt:** `live.json` und `stage.json`. Ein Modul-Update heißt: Dateien pushen und einen Eintrag im Manifest ändern. Kein Repack, keine WSA-Runde.
3. **Stage ist dieselbe Site mit `#stage`** (gleiches Passwort). Sie lädt `stage.json`. Abgenommen heißt: Der Eintrag wandert von `stage.json` nach `live.json`, und das schreibt der WS1-Lead.

## 1 · Was es heute schon gibt (wird verallgemeinert, nicht neu erfunden)
- **Ton:** Er liegt nicht im Paket, sondern lädt zur Laufzeit von kayfabizarro `assets/kfb-audio-r1`, über jsDelivr `gh@<commit>` mit raw als Rückfall. Gepinnt ist er in `scripts/audio/remote.json`. Genau dieses Muster gilt künftig für alle Module.
- **Schalter im Site-Hash:** etwa `chat=syl`, `hud=3d`, `treebend=1`. Ein Modul hinter einem Schalter ist heute schon eine Stage-Probe, nur ohne Kanal.
- **Öffentlicher Spiegel:** kayfabizarro `ws1/mvp-r1`, ohne `src/private`. Er ist die Quelle für öffentliche Code- und Daten-Module.
- **Site-Paket:** `site/mvp-r1-dist` mit Prüfsummen. Es wird zur Basis plus Hülle.

## 2 · Schichten im Einzelnen
| Schicht | Inhalt | Wo es liegt | Wie oft neu | Wer deployt |
|---|---|---|---|---|
| Hülle | index.html, Lader, Passwort- und Proxy-Baustein, Manifest-Abruf | Site-Paket | selten (Lader-Änderung) | WSA |
| Basis | gekaufte bzw. private Modelle, große Texturen | Site-Paket, Dateinamen mit Inhalts-Hash | wenn neue gekaufte Assets kommen | WSA (nur geänderte Dateien) |
| Module | Code-Teile (Vite-Chunks), JSON-Daten, Karten, Ton, CC0-Modelle | öffentlich: kayfabizarro auf einem Commit, über jsDelivr `gh@<commit>`; raw als Rückfall | jederzeit | nur der WS1-Lead schreibt `dist-mod` auf den Spiegel und pflegt das Manifest; die Sitzungen liefern an den Lead |

- **Gekaufte Modelle bleiben in der Basis.** So braucht die Laufzeit kein Token, und Georg richtet nichts ein.
- **Kein privater Inhalt in Modulen (V-071, V-470):**
  - Module entstehen aus einem Build ohne `src/private` und ohne `assets/private`, also nur aus dem, was auch im öffentlichen Spiegel liegt.
  - Alles, was im Build aus privaten Quellen entsteht (zum Beispiel die HUD-Kassette aus `src/private`), gehört in die Basis.
  - Vor jedem Schreiben auf den Spiegel läuft der Prüfung auf gekaufte bzw. private Dateien (V-071, V-470).
  - Ein Smoke-Test startet einen frischen Spiegel-Checkout ohne private Teile; er läuft mit Platzhaltern.
- **Code-Teile:** Der Build teilt das heutige 7,45-MB-Bündel in Teile je Modul (dynamische Importe). Jede Datei bekommt einen Hash im Namen. Ein geändertes Modul ändert nur seine Teile, den Rest hält der Browser im Cache.

## 3 · Manifest
```json
{
  "schema": "kfb.site-manifest/1",
  "channel": "live",
  "shell": "1.0.0",
  "base": "sha256:…",
  "modules": {
    "core":        { "src": "gh:georg-doc/kayfabizarro@<commit>/ws1/kfb-planet/dist-mod/core/" },
    "chatter-syl": { "src": "gh:georg-doc/kayfabizarro@<commit>/ws1/kfb-planet/dist-mod/chatter-syl/", "flag": "chat=syl" },
    "audio":       { "src": "gh:georg-doc/kayfabizarro@36c5ae419/assets/kfb-audio-r1/" }
  }
}
```
- **Ablage:** Die Manifeste liegen in kayfabizarro auf dem Zweig `site/channels` (`live.json`, `stage.json`). Die Hülle holt sie über raw mit Cache-Bruch und fällt auf die im Paket mitgelieferte Kopie zurück. Die Kopie wird bei jedem Hüllen-Deploy aktualisiert.
- **Feste Commits, nie Zweignamen.** jsDelivr cacht Zweige bis zu 12 Stunden, Commits bleiben unveränderlich.
- **Ein Modul trägt** `module.json` (id, Version, Einstieg, Abhängigkeiten, Schalter, `requires: {shell, base}`) und besteht `contract-static` sowie seine Tests in der Reihe des Leads.
- **Integrität:**
  - Jeder Manifest-Eintrag trägt `sha256` der Einstiegsdatei, der Lader prüft ihn und lädt bei Abweichung die Paket-Kopie.
  - Nur der WS1-Lead schreibt auf `site/channels`; das wird als Registerregel eingetragen.
  - Jeder Commit auf `live.json` nennt im Text die Hub-Karte mit Georgs PASS.

## 4 · Stage-Kanal (Testen ohne Gesamtpaket)
- **Öffnen:** `…/#stage` (oder `#stage,<schalter>`) lädt `stage.json` statt `live.json`. Gleiche Site, gleiches Passwort, kein zweites Hosting. `src/siteHash.js` kennt `stage` als Kanalschlüssel und ergänzt sonst den Standard-Hash. Im Bild steht klein „STAGE“.
- **Neues Modul testen:**
  1. Die Sitzung baut ihr Modul.
  2. Sie meldet es dem Lead (Branch, Commit, Tests grün).
  3. Der Lead führt es ins mvp, schreibt nach Leak-Scan den Spiegel-Schnappschuss und trägt den Commit in `stage.json` ein. Das ist ein kleiner Merge je Modul, kein Gesamtpaket.
  4. Georg öffnet `#stage` und sieht es sofort im echten Spiel.
- **Abnahme:** Georg urteilt im Hub. Bei PASS kopiert der Lead den Eintrag nach `live.json`, das ist eine Zeile. WSA muss dafür nichts tun.
- **Rückweg:** Bei FAIL zeigt der Eintrag in `stage.json` wieder auf den vorigen Commit. `live.json` war nie berührt.
- **Abnahme-Bilder und Videos** entstehen auf `#stage` mit dem Site-Hash aus einer Stelle (`src/siteHash.js`). Das ist die Lehre aus dem verschwommenen Hintergrund.

## 5 · Wer was tut
- **WS1 (Lead):**
  - Den Build auf Teile je Modul umstellen, `dist-mod/<modul>/` nach Leak-Scan auf den Spiegel schreiben (als Einziger).
  - Den Lader in der Hülle bauen (Manifest holen, Teile per Import laden, Rückfall auf die Paket-Kopie).
  - `live.json` und `stage.json` pflegen.
- **WSA:** Hülle und Basis einmal neu deployen, danach nur noch bei einer Hüllen- oder Basis-Änderung, und dann nur die geänderten Dateien. CSP bzw. Abruf für jsDelivr und raw freigeben; für Ton und pdfjs ist das schon nötig.
- **Alle Sitzungen:** liefern Module an den Lead, kein Gesamtpaket. Der Antrag ist Branch, Commit, Schalter und grüne Tests.
- **WS0:** registriert, führt die Abnahmen im Hub und hält diese Spec als SSOT.

## 6 · Reihenfolge (klein anfangen)
0. **Basis-Transport (läuft):**
   - WSA lädt kein Repo mehr, sondern nur das fertige Paket auf dem Zweig `site/mvp-r1-dist`, Datei für Datei mit Prüfsummen (Hub b214).
   - Den Paket-Commit und den Quell-Commit meldet der WS1-Lead; diese Spec fixiert keine Commits.
   - Der Lead schreibt in `site-build.json` die Aufteilung der 45 MB in Basis (private Modelle), Code und übrige Daten.
1. Dieses Paket einmal veröffentlichen, so wie es ist: Das MVP ist dann spielbar.
2. Hülle mit Lader und Manifest, zuerst nur mit dem Ton-Modul, das schon so lädt. Damit ist der Weg bewiesen.
3. Erstes Code-Modul über Stage: Chatter-Silben (`chat=syl`), ohne neues Gesamtpaket.
4. Danach jedes weitere Modul so.

## 7 · Technik-Hinweise für WS1 und WSA
- Vite mit relativer `base`. Eine gemeinsame three-Instanz über ein Vendor-Modul oder eine Import-Map.
- Die Dateiliste aus dem Manifest dient als `modulepreload`, damit beim Start kein Wasserfall vieler kleiner Abrufe entsteht.
- Die CSP der GPT-Site muss `import()` von jsDelivr erlauben (script-src). Das ist etwas anderes als Ton (connect-src, media-src). Vorab prüft WSA ein Dummy-Modul von jsDelivr auf der Site.
- Registereintrag nach Georgs Ja: Der Spielcode lädt künftig modular zur Laufzeit. Das ändert V-695, wo der Spielcode im Paket liegt.

## 8 · Abnahme-Kriterien
- **Modul-Update ohne WSA:** Ein Stage-Modul ist 5 Minuten nach dem Push auf `#stage` sichtbar.
- **Kleiner Transfer:** Ein Modul-Update lädt beim Spieler nur die geänderten Teile, gemessen im Netzwerk-Panel.
- **Live unberührt:** `#stage`-Tests ändern `live.json` nie.
- **Rückfall:** Ohne Netz zum Manifest startet die Site mit der Paket-Kopie.
- **Leak-Scan** vor jedem Spiegel-Schreiben grün; der Spiegel-only-Start läuft.
- **Erststart:** Zahl der Abrufe und Ladezeit gemessen und im Return genannt.
- **Live unberührt:** Nach einem Stage-Test zeigt der Git-Diff auf `site/channels` keine Änderung an `live.json`.
- **Manifest-Schema** mit `requires: {shell, base}` und `sha256` je Eintrag wird beim Laden geprüft.
