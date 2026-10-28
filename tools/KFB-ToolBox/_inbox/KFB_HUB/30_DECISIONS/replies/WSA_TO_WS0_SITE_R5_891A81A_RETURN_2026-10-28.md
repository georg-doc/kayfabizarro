# WSA → WS0 · R5 891a81a · bestehende GPT-Site v10 · 28.10.2026

**R5 LIVE / Auslieferung geprüft / einzelne Gameplay- und Hörprüfungen offen.**
[KFB · WS1 Staging](https://kfb-ws1-staging.frizzlebob.chatgpt.site/) ist dieselbe geschützte Site. Georgs bestehende Plattform-Anmeldung reicht, kein zweites Passwort. Keine neue Site, kein World-Code-Fix, kein Audio-Site-Update, kein Merge.

## Exakte Revision
- Privatquelle `georg-doc/KFB-Stunt-Car-Race`, Branch `site/mvp-r5-dist`, **`891a81afb6071e81ce8ba19b7d49b6d099c67fd9`**.
- README: Code `game/proc-world-ws0@9fc8d09354133849a04562799b1c37e7e72b846a`; `site-build.json` nennt Elternstand `50a02b6ce49434a8c837264ffc2a793bc4ee2269`. Geprüfte nachfolgende Dateiliste: `scripts/v945/viteV945Colors.mjs`, `vite.config.js` (Ablage der Wagenfarbbilder), kein verschwiegener anderer Spielstand.
- **728/728 SHA256 PASS**, unabhängig wiederholt;160728791B gelistet. Mit originalem88488BManifest:729Dateien/160817279B. Runtime725Dateien/153,3MiB. Größte Datei19319258B, unter25MiB.
- ManifestSHA256 `6c12336ba741ad8685e01ee5fb465d306361d97539be55951ddf4d34492d888a`; Gitblob `53d56d997de8decd373d9cebd3c565e20057d127`.
- Siteprojekt `appgprj_6ad2ac305b788191af0bdfc68823a300`; nativeVersion **10**, ID `appgprj_6ad2ac305b788191af0bdfc68823a300~appgver_24e2e8d6a3dc8191a203c1eda7a7db4a`.
- Sitesource-Repository `appgprj_6ad2ac305b788191af0bdfc68823a300`, Branch `main` (Sites-verwaltet), exakter gepushter Head **`1a634b7dd6bcc59c363b239d44c4213c57e90679`**.
- Deployment `appgdep_6ae2678b0ca08191bcfe81be06fef56b`, **SUCCEEDED**,28Oct21:22:50UTC.
- Archiv181370880B/810Dateien, SHA256 `59630d376cfeb228f897761e924082f98f64ca7757d667b95a1b891bbf5b0bf3`. Frameworkausgabe und beibehaltene historischeprivateDateien erklären Differenz zum Eingang.
- Owner-private1User/0Gruppen, Environmentrevision1 unverändert; `basicAuth:false`, keine Secrets angelegt/geändert. v9 bleibt Rückfall. Keine neue PR/kein Merge.

## Was verändert wurde
68Site-Quellpfade gegenüberv9: privates `public/game-package/**`, Paketmanifest `lib/game-package.json`, neuer Receiving-Checkpoint `R5_891A81A_CHECKPOINT.md`, `tests/r5-surface.mjs`, R5Kommentar in `public/kfb-entry-default.js`, vorhandener optionalerBeobachter `public/kfb-qa-fps.js`.
**Alle gelieferten Paketdateien bleiben bytegleich.** Keine World-/Animations-/Mixer-Reparatur. Keine privaten Rohassets oder Bilder in den öffentlichen Registerbranch kopiert.

R5s eigene Leerhash-Vorgabe ist weiterhin world=probe, X wird weiterhin durch mount=live aktiviert. Der bereits vorhandene Receiving-Einstieg bleibt daher:
`#m1,harvest,look=terrain3,world=endless,hud=3d,palseed=803,mount=live`.
Nur leererHash; expliziteHashes und Queries bleiben unverändert. Der README-Testhash ohne mount=live aktiviert für sich allein X weiterhin nicht. Das ist kein behaupteter Bundlefix.

Optional nur bei `?kfbqa=1`: vorhandener rAF-Beobachter wartet10s kontinuierlich auf sichtbares/fokussiertesSpiel und sammelt3×8s. Blur/Hidden verwerfen ein unvollständigesFenster; nach3Fenstern endet er. Keine Spiel-, Audio-, Renderer- oder zweiteSimulationsuhr. NormaleAdresse bleibt ohneTestanzeige.

## Abgehakte Prüfliste
| Anforderung | Tatsächlicher Nachweis |
|---|---|
| Eingangs-Prüfsummen | **728/728 PASS**, unabhängigerTester ebenfalls728/728 |
| Gezielte Quellprüfungen | **57 PASS** (8Plattform-only/30Delivery/14Routing/5Entry); QA-SyntaxPASS |
| Frameworkbuild | PASS |
| Vollständige lokaleHTTP-Datei-/Routenprüfung | **736/736 PASS**,727exakteDateien plusRoot/Aliase/Range/H15/Audioindex |
| Live-Dateien/Routen | **21/21 PASS**, vollständigesJSONbeiliegend |
| Anonym Root, direkteFigur, /game-package/, H15, HeyGen, /raw | Je401, keineBasic-Challenge |
| Georgs normaleAnmeldung | LiveChrome öffnet dasSpiel ohnezusätzlichesPasswort |
| ExakteLiveRevision | Rootheader891a81a; README,site-build,19MBGamebundle,FB/Jetpack/WagenbildSHAgeprüft; nativeVersionprovenienz nachgelesen |
| LeereAdresse: Endlos-Welt/HUD3D | LiveChromePASS; HUDR14,FrizzleBob,Jetpack und tatsächlichesGelände sichtbar |
| P/Cast-Menü | LiveChromePASS:11Figuren,13Racer plusCombatMech/WastelandBeetle |
| Figurenwechsel | GothGirl und zurückFrizzleBob im echtenLivebild sichtbar, nicht nurHashwechsel |
| Auto rufen/aussteigen | X aufLivePASS; keine404 |
| Fahrzeugwechsel | BrasswingRoadster→CrimsonThunderjet im gemountetenZustand; Fahrer bleibt sichtbar |
| Fahren | W,HUD33KM/H beobachtet, Position20→10m; AussteigenPASS |
| Fahrer auf ALLEN13Racern | **Nicht erneut vollständig geprüft**; hier2Racer und Wechsel. Incomingj7-roof meldet13+Wechselgrün |
| Doppel-Leertaste/Jetpack-Flug | **UNVERIFIED/Automationsgrenze**; sichtbaresJetpackmodell beweist keineFlugaktivierung |
| Düsen/Tankröhren währendFigurenflug, Boost/Fassrolle | **Nicht alsPASS behauptet** |
| Klangtransport | NeuesAudioindex direkt200/CORS*, Proxy200; keinecapturedPageerrors; Hörabnahmeoffen |
| KuppelWesten/CaféNorden/Vögel | IncomingFeatureprüfungmeldetgrün; hierkeinevollständigeLandmark-/Hörprüfung |
| Seitenfehler | **0** erfasst beiLiveStart,Figuren-/Wagenwechsel,FahrtundFPS |
| 60fps-Abnahme | SieheMessung; keinp95-60FPS/HUMAN_ACCEPTED |

Die eingehenden Spieltests (host,j7-roof,closing-build,fb-shoulder-shadow,fb-canon) sind überliefertegrüneNachweise, hier nicht als neu ausgeführteSuite gezählt.

## Livebildrate: Einzelinstanz, fokussiert, nachAufwärmen
Gemessen am unverändertenLivev10 mit `?kfbqa=1`, stationärerStartkamera, palseed803. Drei8sFenster nach10sWarmup, jeweils focused=true/visible, **0Resetaufrufe**:
-506Frames/8025,1ms: **63,1FPS**,p95Frame25,0ms.
-477Frames/8004,1ms: **59,6FPS**,p95Frame25,0ms.
-461Frames/8008,4ms: **57,6FPS**,p95Frame25,1ms.

Gesamt1444Intervalle/24037,6ms≈60,1Browser-rAF/s. EffektiverHauptbuffer/CSS **1312×645**, alsoDPR1. Kein zweiter kontrollierterSpieltab, lokalerTestserver zuvor beendet.
**Nicht als gleichqualitativer kontrollierterVersionsvergleich zuR4/DPR1,25 ausgeben.** Die gemesseneBrowserumgebung/effektiveAuflösung ist anders; bestehendeOS-/andereBrowserlast nicht vollständig isoliert. P95≈25ms entspricht≈40fps imlangsamerenRand und erfüllt nicht dasM1Max-p95Ziel16,67ms. WederGPU-Timer nochEngine-onlyRendertelemetrie oder menschlicheAbnahme.

## Ton und erhaltene Verträge
AudioRawfirst `33bcb759eaf4be31b9fd1c54501f907b323538b3` unter `media/kfb-audio/r1/`; jsDelivrseparaterRückfall. NeuerBundleURLmodifiernimmtAudio bewusstvomallgemeinen /raw-Umschreiben aus. Transport direktRaw und indexProxy geprüft, keine erfundenehörbareAbnahme.
Bestehender festerkayfabizarro-/raw-Proxy, Range206,GLB/WebP/WASM/MP4-MIME, semantischeBusse, AudioContext/Mixer/ClockOwner erhalten. KeineAudio-Site-Veränderung oderGenerierung.

## Grenzen und Recovery
Der ersteBrowser-Eingabepfad verlor durch parallelaktiveUseroberfläche den Fokus; darauf folgteeineunterbrocheneNative-Steuerung. NachwiederhergestelltemTabgingenCast/X/Fahrt. Doppeltipp-Flug ließ sich vorab nicht verlässlichbeweisen; dieseAutomation nachnichtverbesserndenVersuchen eingefroren. **Kein GameplayFAIL daraus abgeleitet und keinWorldfix improvisiert.** TatsächlicherFlug/Hören bleibt offenePrüfung.
Großdatei-Downloads wurden nur bei fehlendemSHA-Abschluss erneutgeladen. KeinUsertoken angefordert. DiskzuBeginn/Ende etwa26GiBfrei; keinunbezogenerDatei-/Asset-Abbau. LetzteSitzungsbereinigung~410MBbleibt imVortagsreport, hiernichtdoppeltgezählt.

## Beweise / Persistenz
- [V10 EvidenceJSON](WSA_MVP_GPT_SITE_R1_PREPARE/R5_891A81A_LIVE_V10_EVIDENCE_2026-10-28.json), Evidencecommit `5461f547bf047634a8e171093b768d36482cd948`, exactref/file nachgelesen.
- Private lokaleScreenshots dieserSitzung: `work/r5-live-v10-driver.png`, `work/r5-live-v10-fps.png`; keineöffentlicheRohasset-/Bildkopie.
- Tester:vollständigerSHA-Audit; Critic:5Entrychecksund21Live-Records unabhängiggeprüft; Guard:CONTINUE, keinzusätzlichesApprovalgate.
- ÖffentlicherMetadatenowner `georg-doc/kayfabizarro`, Branch `docs/kfb-decisions-register-2026-10-11`; keine neuePR. FinalerReturnhead ist der nachgelesene enclosingCommit.

## Genau ein nächstes Gate
**WS0 prüft am exaktenLivev10 gezielt den nochunbestätigtenFigurenflug (Doppel-Leertaste,Düsen,Tanks) und dieLandmark-/Klanginteraktion und meldet nur konkreteFehler zurück.** WSA repariert anschließend nur nachgewieseneReceiving-Fehler; keinneuerWorld-/Runtimeowner und keinezusätzlicheGeorg-Freigabe als technischeErsatzprüfung.
