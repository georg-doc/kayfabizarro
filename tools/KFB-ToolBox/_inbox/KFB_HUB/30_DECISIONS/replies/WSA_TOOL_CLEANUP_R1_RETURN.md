# WSA Tool Cleanup R1 Return · V-390 · 17.10.2026

Owner WSA work. Ergebnis: belastbare Inventur, ein offener Redirect-PR und zwei gespeicherte Site-Versionen zur Abnahme. Kein neuer Arbeitsort, kein neues Werkzeug, kein Live-Schalten, kein Auto-Merge. Sound-Studio und Footstep-Pilot (V-388/V-389, PR #413) unverändert priorisiert.

## Stand und genaue Quellen

- Repo: `georg-doc/kayfabizarro`.
- Register: `docs/kfb-decisions-register-2026-10-11`, Ausgangshead `a276c0ccceee11ed9f4065c6a26fd3d1f5c762df`; dieser Return und Inventur/Map-Patch liegen unter `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/`. Der genaue Ergebnishead ist der Commit dieses Returns und wird im Chat genannt.
- [Redirect-PR #414](https://github.com/georg-doc/kayfabizarro/pull/414), Branch `docs/wsa-tool-redirects-r1-v390-2026-10-17`, Head `f49eaae48410a8cd30cd019643048f0ed0f682cd`, Basis `main@904f0e95968999c7e8af77cc6667161bd4f3f788`. Drei neue Dateien: `_redirects`, `kfb-hub/archiv/tools-r1/index.html`, `WSA_TOOL_REDIRECTS_R1.md`. Keine Löschung. PR offen, Merge Georg.
- Main ist anhand ausgelieferter Datei-Hashes als aktuelle öffentliche Quelle belegt: 191 HTML-Seiten exakt. Ein alleiniger PR auf `cloudflare-live` wäre für den aktuellen Ursprung unzureichend.

## Inventur und Adressen

[Inventurtabelle](WSA_TOOL_CLEANUP_R1_INVENTORY.md): 297 bekannte unterschiedliche Cloudflare-HTML-Pfade, darunter 106 Root-Fallbacks; zwölf native GPT-Sites; bekannte Preview-/Startaliase; altes Hub/Steuerpult. Jeder Seitenpfad hat Titel/Zweck, letzte Quelldatei-Änderung, Ort und tatsächlichen HTTP-Befund. Metadaten und Rohbelege im Evidence-Unterordner; unbestätigte persönliche Bookmarklets und beliebige historische Deployment-Hosts werden nicht als vollständig geprüft ausgegeben.

WS0 übernimmt [WSA_TOOL_MAP_R1_PATCH.md](WSA_TOOL_MAP_R1_PATCH.md): Sound-Studio https://kfb-audio.frizzlebob.chatgpt.site, Asset-Bibliothek https://kfb-asset-librarian.frizzlebob.chatgpt.site. Canonical TOOL_MAP wurde bewusst nicht direkt geändert.

## Redirects und Motion-Tab

572 explizite relative 302-Regeln für 158 alte Navigationsseiten samt Aliassen. Der bestehende Build kopiert `_redirects` in `.cloudflare-pages/_redirects`. Alte Hub-Adressen führen zum [Production Hub](https://claude.ai/artifact/WxG16gvt7LNrBXxYkAhr9d); Motion zum [ToolBox-Tab](https://kfb-toolbox.frizzlebob.chatgpt.site/?tab=motion); Audio/Asset-Einstiege zu ihren vorhandenen Sites. Ausgemusterte Stage-/Lab-Einstiege führen auf einen kleinen Archivhinweis mit Links zu allen fünf Orten. Quellen und Profildaten bleiben erhalten.

Root, `/index.html`, JS/JSON/GLB/Medien und breite Verzeichnis-Wildcards werden nicht umgeleitet. WS1-Fallback bleibt auf seinem unveränderten eigenen Branch. Regeln sind pfadbasiert, nicht hostbegrenzt; spätere Übernahme nach `ws1/preview` braucht gesonderte Prüfung. Historische unveränderliche Deployment-URLs ändern sich durch main-Merge nicht rückwirkend.

| Bestehende Site | Gespeicherter Kandidat | Quelle | Veröffentlichung |
|---|---|---|---|
| ToolBox | v10 · `appgprj_6ac2ba44282881919d1a49287a32054e~appgver_a77591b133288191ae875e563cea4327` | `e3fb00ecf5fb29998cac848a5ba570205d5a0172` | Nicht veröffentlicht; aktuelle Site bleibt v9 |
| Alter Production Hub | v13 · `appgprj_6ab7358322a8819183d2fa036b7b12f9~appgver_39082874a3f48191bc17bc86bb7fe489` | `fcd817798f5dbdefd444419e73dcbbded23ba8c0` | Nicht veröffentlicht; aktuelle Site bleibt v12 |

Motion verwendet `lab.mjs` des vorhandenen KayKit Motion Lab inhaltlich unverändert, einschließlich Originalfiguren, Animationen, Messungen und A/B-Vergleich. Der Tab liest das vorhandene Loco-Modul plus die unveränderten PROFILE_PROPOSALS (main-Pin 904f0e9). Kein zweiter Profil-/Physics-/Audio-Owner. Das überdeckte ToolBox-Rendering pausiert; beim Verlassen des Tabs wird der Lab-Frame entfernt. Vor Integration wurde der Originaldonor isoliert sichtbar geprüft.

Der alte Hub-Kandidat leitet Root und den vorhandenen Donor-Einstieg zum Claude-Hub; beide Vorgänger-HTMLs liegen unverändert unter `archive-before-tools-r1/` außerhalb der ausgelieferten Dateien und in der Git-Historie.

## Tatsächliche Prüfungen

- 301 bekannte HTTP-Pfade geprüft; nach Ausschluss von vier nicht veröffentlichten `_handoff`-Quellen 297 Seitenpfade im Return. 191 stimmen exakt mit main überein, 106 liefern lediglich Root-HTML trotz HTTP200. Historische cloudflare-live-Liste separat mit 156 Einträgen.
- WS1-Root HTTP200, 18.100.983 Bytes, exakt Blob c890bfbb64f27a5e6235756386840ff4a41cdb09. build.json HTTP200, Tests 24/24 als Objekt, car null. Nichts daran geändert.
- 572 Regeln: eindeutige relative Quellen, 302, unter 2000 Regeln und 1000 Zeichen je Regel, keine Archiv-Schleife, keine Root-/Datenpfadtreffer. Unverändertes öffentliches Buildskript in Fixture ausgeführt: Redirects bytegleich im Ausgabeordner, Root/Modell erhalten. Kein vollständiger Repo-Deploymenttest vorgetäuscht.
- JS-Syntaxchecks für Lab und Profiladapter bestanden. Lokale Browserprüfung: Originaldonor FrizzleBob geladen; Motion-Tab mit beiden Figuren/25 Clips/5 Messprofilen; bestehender Loco-Schema-Reader mit 14 Rollen und PROFILE_PROPOSALS; Wechsel Studio → Motion → Studio, Frame entfernt, URL-Parameter korrekt. Sichtbeleg: `WSA_TOOL_CLEANUP_R1_EVIDENCE/motion-tab.png`.
- Unabhängiger Read-only Review: anfängliche ungültige absolute Redirect-Quellen korrigiert; keine verbleibenden P0/P1. P2: Bereits laufendes Band-Audio/Sprach-Timer werden durch reine Renderpause nicht ausdrücklich beendet; Motion selbst startet kein Audio. Vor einer möglichen späteren Audio-Integration gesondert prüfen.
- GitHub PR-Head und alle drei beabsichtigten Dateien nach Write exakt zurückgelesen. Sites-Quellstände gepusht, Archive aus diesen Ständen gespeichert; beide Versionen ohne deployment_id. Live-Redirects werden vor Merge/Publikation nicht als bestätigt bezeichnet.

## Georgs Bookmarklets

Keine tatsächlichen `javascript:`-Payloads in den durchsuchten aktuellen Hub-/ToolBox-/Librarian-Quellen, Register-Replies oder GitHub-Codefunden. Persönlich installierte Bookmarklets wurden nicht aus Browserprofil-Dateien ausgelesen. Folgende Ersatzregeln sind belegte Adressmigration, keine erfundene Liste installierter Bookmarklets:

| Alter Zielbezug | Ersatz | Status |
|---|---|---|
| `kayfabizarro.pages.dev/kfb-hub/`, `/stage/hub-ui-v2/`, alte Production-Hub-Site, alte Production-Control-Startadresse | https://claude.ai/artifact/WxG16gvt7LNrBXxYkAhr9d | CF im PR, alte Hub-Site v13 gespeichert; Control-Root noch offen |
| `STEUERPULT.html` / früheres Claude-Steuerpult | https://claude.ai/artifact/WxG16gvt7LNrBXxYkAhr9d | Laut V-221 bereits dieselbe Artifact-Adresse; kein separater alter Host belegt |
| `.../stage/toolbox/kaykit-motion-lab-v1/` | https://kfb-toolbox.frizzlebob.chatgpt.site/?tab=motion | CF im PR, ToolBox v10 gespeichert |
| alte ToolBox Production-Einstiege | https://kfb-toolbox.frizzlebob.chatgpt.site | ausgewählte Navigation im PR; Donor-/Datenquellen bleiben |
| alte Audio-Labs | https://kfb-audio.frizzlebob.chatgpt.site | CF im PR; alter Preview-Branch bleibt unverändert |
| `.../asset-librarian/`, `.../tools/asset_registry/librarian/` | https://kfb-asset-librarian.frizzlebob.chatgpt.site | CF im PR |
| `ws1-preview…/#stage…`, `/#m1`, Lineup | https://kfb-ws1-staging.frizzlebob.chatgpt.site mit demselben Hash im geladenen Spiel | Haupt-Lesezeichen austauschen; Cloudflare bleibt Rückfall; `car` ohne eigenes Ziel bleibt nicht verfügbar |
| Alte sonstige Stage-/Lab-Einstiege | Archivhinweis → passende fünf Orte | CF im PR; kein unbewiesener Funktionsersatz |

Ein Bookmarklet, das Code injiziert, DOM-Selektoren nutzt oder Daten aus dem alten Host liest, ist mit reinem URL-Tausch nicht als kompatibel abgenommen. Für die individuelle Zuordnung fehlen die Original-Payloads bzw. ein Lesezeichenexport.

## Offene Punkte und nächstes Gate

1. **Nächstes Gate: Georgs Abnahme der vorbereiteten Umzüge.** Danach gespeicherte ToolBox v10 und alten Hub v13 veröffentlichen, erst anschließend PR #414 mergen. Danach Hub/Motion/Audio/Asset/Archiv an den exakten Produktions-URLs prüfen und WS1-Fallback gegenprüfen. Keine Live-Freigabe aus einem HTTP200-Fallback ableiten.
2. Tatsächliche Bookmarklet-Payloads fehlen. Ersatzregeln sind vorhanden; installierte Bookmarklets bleiben unbestätigt.
3. Sechs weitere native Alt-Sites sind als Archiv kartiert, aber nicht umgeleitet oder funktional migriert. Old Production Control-Root ebenfalls noch unverändert; bestehende Backend-/Connector-Funktionen dürfen nicht durch einen unkontrollierten Vollredirect verloren gehen. Diese Folgeumzüge brauchen je eine bestehende Quelle und ein bestätigtes Ziel, keine neue Site.
4. WS0 übernimmt die zwei ergänzten Kartenadressen. Footstep-Pilot und produktive Audio-Arbeit haben Vorrang; kein bezahlter Asset-/Audio-Aufruf wurde ausgelöst.
