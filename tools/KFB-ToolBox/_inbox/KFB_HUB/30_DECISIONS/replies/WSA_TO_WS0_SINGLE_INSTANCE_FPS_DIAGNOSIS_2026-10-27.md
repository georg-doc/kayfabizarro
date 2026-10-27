# WSA → WS0 · Einzelinstanz-FPS / konkreter Fix-Vorschlag · 27.10.2026

**DIAGNOSE ABGESCHLOSSEN; kein Produktionsfix behauptet.** Die niedrige Bildrate bleibt mit einer sichtbaren, fokussierten Spielinstanz reproduzierbar. Der Renderpfad ist der begründete nächste Ansatz. Keine neue Site, keine Veröffentlichung oder Änderung am World-/Audio-Owner.

## Exakter Stand und Grenzen
Bestehende [KFB · WS1 Staging](https://kfb-ws1-staging.frizzlebob.chatgpt.site/), Projekt `appgprj_6ad2ac305b788191af0bdfc68823a300`, **Version9** unverändert; Sitesource `8e8e4d07816ac42f68ab656a457bb19889d67c08`; Paket privat `georg-doc/KFB-Stunt-Car-Race`, `site/mvp-r3-dist@ec7b0579f98b0ab2be2ea51132344c8354eac308`.
Lesend geprüft wurde dessen Buildquelle `533c8dd41f9daba3428eaa9591c000af4689bcbb`. Keine neue PR / kein Merge / kein Deploy. Neuere WS0-Spielstände wurden nicht als ec7b057 ausgegeben.

MacBookPro18,2, AppleM1Max,32GiBRAM. macOS meldet keine thermische Leistungswarnung. Chromeeinzelinstanz zunächst live mit dem vorhandenen300Frame-Startzähler:25FPS statt früher11,1. Dieser Wert enthält weiterhin Start/Laden.

Für Aufwärm-/A/B-Messung dieselben unveränderten Paketbytes lokal über bestehenden Site-Worker, im SELBEN Chrome-Tab statt der Live-Instanz. Kein weiterer kontrollierter Spieltab/Spielserver parallel. Nur ignorierte lokale Build-Ausgabe des vorhandenen QA-Beobachters vorübergehend erweitert; keine Spiel-/Audio-Uhr übernommen. Original danach bytegleich wiederhergestellt, Gitstatus sauber, eigener Server beendet, Livev9 wieder offen.

## Messung: nach10s Aufwärmen,14Fenster zu je8s
CSS immer1312×645; Standardbuffer1640×806/DPR1,25, Fast1312×645/DPR1. Alle14Fenster melden sichtbar und Fokus am ENDE;0Sichtbarkeitswechsel. Fokus wird nicht kontinuierlich überwacht. Beobachter und komplette Daten beiliegend, unabhängig nachgerechnet:4594Frameintervalle über112381,3ms.

| Lauf | Fenster | FPS Ø je Fenster | p95Bildzeit ms | Einordnung |
|---|---:|---|---|---|
| Standard ohneDebug |2|21,0 /17,9|73,0 /77,8|Welt/HUD sichtbar |
| Standard debug,clean |1|21,5|76,6|Schritt2,77ms, ZeichnenCPU10,97ms |
| Fast debug,clean |2|38,5 /44,3|37,7 /32,2|DPR1, etwa36%weniger Hauptbildpixel |
| norender debug,clean |5|35,8 /73,8 /88,1 /77,3 /81,4|67,5 /33,3 /25,1 /26,5 /29,9|Keine Welt-/HUD-Bildausgabe; kein spielbarerFPS-Nachweis |
| Standard Wiederholung |4|19,0 /15,5 /19,5 /19,4|78,1 /96,2 /79,7 /81,3|Rückkehr zum langsamen Ausgangsbild |

Alle norender-Werte einschließlich erstem35,8FPS-Fenster bleiben erhalten; spätere4Fenster73,8–88,1 sind nur die besser eingelaufene Teilmenge. Fast41,4FPS über beideFenster, normaler Ausgangslauf19,5FPS; kein kausaler2,12×Beweis allein fürDPR. Sequenzielle Messung mit schwankender OS-/anderen Browserlast, kein Laborlauf. Speicher-/Anwendungsanalyse und WindowServer liefen merklich mit; fremde Prozesse/Tabs wurden nicht beendet. Enger GPU-/Treiberbackend-Nachweis fehlt; Browserpolicy blockierte GPU-Statusseite, kein Umgehungsversuch.

Simulation läuft bei Standard-Wiederholung mit etwa57–60Schritten/s trotz15–20Bildern/s. norender-Schritte2,68–3,49ms in späterenFenstern; ZeichnenCPU~0,007–0,009ms. Befund spricht gegen reine Physik/Audio als alleinige Ursache und für Render-/Auflösungs-/Compositorlast. CPU-Zeichenzeit synchronisiert nicht mitGPU, deshalb keine erfundeneGPU-Zeit oder benannterShader als bewiesenerHauptverursacher.

## Konkreter Fix-Vorschlag an WS0: ein begrenzter World-Owner-Patch
**Erster produktiver Patch: vorhandene Qualitätsregelung auf diesen Endlos-Standard ausrichten, mit korrekter Gesamtbild-Telemetrie.**

1. In `src/start/quality.js` / `src/start/QualityDpr.jsx` die bestehenden Fast/Standard-Stufen nutzen. Unter anhaltender Last die3D-Welt vonDPR1,25 auf1 absenken, HUD/CSS-Maße behalten. Entscheidung aus existierenden M1-Bildzeiten, z.B.3aufeinanderfolgende2s-Fenster über25ms; frühestens nach20s stabil unter14ms wieder anheben. Kein neuerrequestAnimationFrame-, Simulations-, Audio- oder Rendererowner. NutzerwahlSharp respektieren. Als kleine Sofortmaßnahme kann WS0 Fast für diesen Endlos-MVP als Startstufe anbieten; kein heimliches Herunterregeln als60fpsPASS.
2. Vor einer weiteren Geometrieoptimierung die Framezähler korrigieren: `src/m1/M1Loop.jsx:35` zeichnet erst Welt, dann `src/hud/hudPass.js`. Der aktuelle Endwert `renderer.info` war **14Calls/28Dreiecke** des letztenHUD-Passes, nicht der Welt. Pro Gesamtframe einmal zurücksetzen und Welt+Schatten+HUD gemeinsam zählen (autoReset für die eigene Messspanne kontrollieren und ursprünglichen Zustand restaurieren), oder je Pass getrennt vor dem nächstenReset erfassen. Kein zweiter Renderdurchlauf nur fürs Messen. Budget300Calls/600kTris erst auf vollständige Daten anwenden.
3. **Als nächste messbare Renderhypothese, noch NICHT als bewiesenerFix:** `src/world/EndlessDrive.jsx:111` reicht nurTerrain anVegetation; `src/world/endlessVeg.js:62` setzt dadurch die vorhandene perObjectFrustumCulled-Optionfalse. Vorhandenes `cull:true` für den Legacy-endlessVeg-Pfad A/B prüfen; Kamera-/Schattenränder und Fahrtübergänge abgleichen. Nicht pauschal globaleFrustum-Culling einschalten: äußereBatchbounds bleiben beim Bewegen absichtlich unzuverlässig. Der bereits aktiveShadowCullHost erfasst nurFundsachen/Plakat, nicht dieseVegetationsbatches.
4. `test/perfMvp.mjs` testet momentan **world=probe**; der ausgelieferte Standard ist **world=endless**. Endlos/gleicherSeed/palseed803 und echte Standardkamera ins vorhandene Testverfahren aufnehmen. Ladebereitschaft aus pendingLoads/terrainpending, danach zusätzliche10s und drei30s-Fenster, immer nur ein Spiel. Fast allein hat hier keine60FPS erreicht. Ziel M1Max:p95Frame≤16,67ms, getrennt von ØFPS.

Diese Hinweise beziehen sich exakt auf den geliefertenAltstand. WS0 soll sie am aktuellenWorld-Branch abgleichen und existierende neuereLösungen übernehmen, nicht ältereDateien darüberkopieren. WSA hat keinen World-Code geändert.

## Speicherplatz: ausgeführt
8klar abgegrenzte eigene Alt-Artefakte entfernt:4überholteTar-Pakete,3alte unveränderliche GitHub-Paketintakes und die alte reproduzierbare `mvp-gpt-site-r1-2026-10-24/dist`-Ausgabe. **416719321logischeBytes entfernt; gemessener Volumenfreizuwachs409600000Bytes (~410MB).** Messung direkt davor/danach:30638080000→31047680000B frei; weiterhin rund29GiB,97%belegt. AktuellerR4-Intake, aktuellerSite-Checkout samtGit,Dependencies,aktuellerDeploy-Archiv,Quellen und Beweise erhalten. Keine synchronisierten `sources/`-Dateien, persönlichenDownloads oder fremdenArbeitsverzeichnisse bereinigt. GrößerePlatzsuche ist eine separateAufgabe; kein unsicheres„allesTempweg“.

## Artefakte und tatsächliche Prüfungen
- `WSA_MVP_GPT_SITE_R1_PREPARE/SINGLE_INSTANCE_FPS_2026-10-27.json`:alle14Fenster, Bedingungen, Cleanup-Quittung.
- `WSA_MVP_GPT_SITE_R1_PREPARE/warm-frame-observer-2026-10-27.js`:reinerBeobachter, SyntaxprüfungPASS; keineProduktionsinstallation.
- PaketbundleSHA weiterhin `75660a4fe5f8afae42d1cac79651f6249f11cb5939ab5f7341d84af2d019049c`; ManifestSHAweiterhin `a67dea26c7ec3afb26e15d0bc791f45214b969a1871be2e937c7916f826443df`.
- OriginalQA-Builddatei bytegleichrestauriert, Site-Gitstatussauber. Keine Spieltests neu behauptet; vorhandener75/80Nachweis nicht rerun.
- UnabhängigerTester bestätigt Zahlen und qualifizierte Renderpfad-Hypothese, betont Endpunkt-Fokus und Hintergrundlast. KeineexakteGPU-Ursache und kein60FPS/HUMAN_ACCEPTED.

## Ein nächstes Gate
**WS0 liefert einen begrenzten aktuellenWorld-Patch für Qualitätsregelung + korrekteGesamtbildmessung und prüft ihn im Endlos-Szenario mit nur einer Instanz.** Erst der neue gepinnteBuild geht wieder an WSA; Version9 bleibt bis dahin unverändert.
