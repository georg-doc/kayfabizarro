# Asset Librarian · Anbindung VFX-Katalog R1 (WS0, 23.11.2026)

## Ergebnis: (b), der Librarian braucht einen Einbau

Geprüft wurde `georg-doc/kayfabizarro` auf `main` (gelesen über die GitHub-Schnittstelle), dazu PR #380 „Asset Librarian private audio intake bridge“ (gemergt am 09.10.).

**Was es heute gibt:**
- **FX-Reiter:** Den Reiter gibt es schon (`tools/asset_registry/librarian/resources-ui.js`). Er liest `registry/resources/v1/fx.jsonl` aus dem Resource-Registry-Builder, 10 Zeilen, Schema `kfb.resource-registry.v1`.
- **Karte:** Sie zeigt nur `displayName`, `kind`, `fxType`, `status` (AVAILABLE, CONFIGURED, WIP, WIP_CONFIG, DOCUMENTED_REFERENCE), `executionStatus`, `provider`, `actorRefs` bzw. `scopeRef` und einen Link `source.rawPinned|rawLatest`. Alles Weitere erscheint nur als roher JSON-Text im Detail.
- **Suche:** Sie läuft nur über Name, IDs, Art und Schema.
- **Live-Muster ohne Neuveröffentlichung:** PR #380 hat dafür `tools/asset_registry/librarian/live/private-asset-live.json` eingeführt. Die Datei wird mit `cache: no-store` von GitHub `main` geholt, das Repo ist öffentlich (raw-Abruf liefert 200), Regel „nur Metadaten“.

**Warum das nicht reicht:**
1. **Kein Daten-Refresh ohne Neuveröffentlichung.** Der FX-Reiter liest über einen relativen Pfad (`../../../registry/resources/v1`) aus dem Schnappschuss der Site, also nicht live. Neue Effekte erscheinen erst nach Builder-Lauf und neuer Veröffentlichung.
2. **Fremde Quelle.** `fx.jsonl` erzeugt der Resource-Registry-Builder aus ToolBox- und Pets-Konfigurationen. Unser Katalog müsste dort hineinkopiert werden, das widerspricht „Daten nur aus vfx_katalog.r1.json“.
3. **Felder fehlen in der Darstellung.** Es fehlen Spender, Vorschaubild, Parameter-Tabelle (Name, Bereich, Standard, Wirkung), Presets, Dauer, Kosten, Einsätze, Stolpersteine und Schalter. Filter nach Art, Spender und Status gibt es nicht.

**Zwischenlösung, falls es sofort sein muss (nicht empfohlen):** Je Effekt eine Zeile nach `fx.jsonl` mit dieser Zuordnung:
- `displayName` ← `name`
- `fxType` ← `art`
- `kind` = `fx`
- `status`: „im Spiel“ → AVAILABLE, „vendored ungenutzt“ → CONFIGURED, „nur extern“ → DOCUMENTED_REFERENCE
- `executionStatus` = OWNER_RUNTIME_REQUIRED
- `provider` ← Spender-`name`
- `source.rawLatest` ← `quelle_url`

Das ist eine Kopie, braucht eine Neuveröffentlichung und zeigt den Rest nur als Rohtext. Darum Variante (b).

## Was WS0 vor dem Einbau tun muss (eigener Schritt, nicht Teil dieses Auftrags)
Die Datei `vfx_katalog.r1.json` unverändert nach `georg-doc/kayfabizarro` legen, Pfad `tools/asset_registry/librarian/live/vfx-katalog.r1.json` auf `main`. Das ist derselbe Ordner wie beim Live-Muster aus PR #380. Danach jede Pflege dort gleich nachziehen (eine Quelle: Dropbox-Original → dieselbe Datei im Repo). Medien kommen nicht ins Repo, die Vorschauen sind Links zu den Spendern. Offen ist, ob die Stamm-Pfade (privates Spiel-Repo) öffentlich lesbar sein dürfen (siehe Bericht).

---

## Auftrag an WSA Work (SOP-Format)

**WSA Work · Asset Librarian · VFX-Reiter R1**

**ABSICHT:** Georg will an einer Stelle sehen, welche Effekte KFB hat, mit Optionen, Einstellungen, vorgeschlagenen Einsätzen und Stolpersteinen. Externe Chats, Szenen und unsere Module sollen sie so modular nutzen können. Der Librarian zeigt dafür den VFX-Katalog von WS0 an. Neue Effekte erscheinen ohne neue Veröffentlichung der Site.

**GENRE:** Erweiterung der bestehenden Site, nur Darstellung. Keine neue Site, keine zweite Registry, keine Inbox.

**OWNER:** WSA Work (Site `tools/asset_registry/librarian/`). Die Daten gehören WS0 (`vfx-katalog.r1.json`, Schema `kfb.vfx-katalog/1`).

**ZIEL:** Der bestehende Reiter `FX` (bzw. ein Unterbereich „VFX-Katalog“ darin) liest live `tools/asset_registry/librarian/live/vfx-katalog.r1.json` von `main`, mit `cache: no-store` wie `private-asset-live.json`. Bei Ausfall bleibt der lokale Schnappschuss, Fehler werden leise behandelt (fail soft). Er zeigt:
- **Liste:** je Effekt eine Karte mit `name`, `art`, Spender-`name`, `status` als Badge (im Spiel, vendored ungenutzt, nur extern) und `vorschau.url` als Bild. Ohne URL ein neutraler Platzhalter, `vorschau.datei` als Text.
- **Filter:** Spender, `art`, `status`; Volltextsuche über `name`, `id`, `use_cases`, `caveats`, `schalter`.
- **Detail:** Kopf (`name`, `id`, Spender mit `quelle_url`, `lizenz`, `einbauweg`, `im_stamm`, `schalter`). Danach Tabelle `parameter` (name, bereich, standard, wirkung), `presets` und `kfb_presets` (Name + Werte), `dauer_s` (bei Elements zusätzlich `phasen_s`), `kosten` (stufe + worauf), Liste `use_cases`, Liste `caveats` (Effekt und Spender) und Zusatzfelder als einfache Zeilen.
- **Spender-Ansicht:** je Spender `caveats`, `globale_parameter`, `api`.
- **Übergabe:** Knopf „Referenz kopieren“, der `{ katalog: "kfb.vfx-katalog/1", id, einbauweg, parameter-Werte }` in die Zwischenablage legt (gleiche Art wie `kfb.asset-handoff.v1`, nur Kandidat).
- **Kopf der Seite:** `stand` und `zahlen` der Datei.

**FERTIG, wenn:**
- 127 Effekte aus 10 Spendern erscheinen. Zahlen und Filter stimmen mit `zahlen.nach_status` überein (20 / 72 / 35).
- Eine Änderung an der JSON auf `main` (Test: ein Feld `stand` ändern) erscheint nach Neuladen ohne neue Veröffentlichung der Site.
- Vorschaubilder von git.patch.gg bzw. cdn.patch.gg laden. Wo eins fehlt, steht ein Platzhalter und es kommt kein Konsolenfehler.
- Assets, Motions, Decks, Intake und die bestehenden FX-Zeilen aus `fx.jsonl` laufen unverändert, die Browser-Tests sind grün.
- Handy-Breite ist geprüft.
- Rückgabe mit PR-Link, Site-Version und Beleg des Daten-Refreshs (vorher/nachher).

**GRENZEN:**
- Daten nur aus `vfx-katalog.r1.json` lesen. Keine Kopie der Inhalte in die Site, in `fx.jsonl` oder in den Resource-Registry-Builder.
- Nichts in die JSON schreiben, keine Felder umdeuten oder ergänzen. Unbekannte Felder als Text zeigen.
- Keine Medien ins Repo, keine Effekte abspielen oder rendern (kein Effekseer, kein three.js für VFX).
- Keine Änderung am Spiel-Repo.
- Nicht ohne Georgs Freigabe live schalten. Die PR bleibt Kandidat, bis WS0 zustimmt.

**DETAIL:**
- **Struktur:** Schema und Felder stehen in `replies/VFX_KATALOG_R1/README.md` (WS0 legt eine Kopie als `live/vfx-katalog.README.md` daneben). Effekte hängen unter `spender[].effekte[]`. Zum Anzeigen flach machen und den Spender je Effekt mitführen.
- **Typen:** `bereich` kann eine Liste `[min, max]`, eine Liste von Werten, ein Text oder `null` sein. `standard` und `werte` können Zahl, Text, Liste oder Objekt sein, also als JSON-Kurztext zeigen. `dauer_s` kann Zahl oder Text sein.
- **„unbekannt“** ist ein gültiger Wert, nicht ausblenden.
- **Vorschau-URLs:** sie zeigen auf feste Commits (immutable), Bilder 112 × 112 webp, Spender-Cover 800 px.
- **Live-Laden:** `private-asset-live.json` aus PR #380 ist die Vorlage für Live-Laden, Schnappschuss und Fail-soft. Die Vertrauensregeln von dort gelten mit, also keine Zugangsdaten und keine privaten Speicher-URLs.
