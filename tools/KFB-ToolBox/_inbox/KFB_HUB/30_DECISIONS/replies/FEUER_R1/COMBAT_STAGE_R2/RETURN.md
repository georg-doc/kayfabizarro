# RETURN · Combat-Insel / Pistole R2 · 17.11.2026

**Werkbank veröffentlicht; Gunshot gestalterisch NICHT abgenommen. R1 wurde von Georg verworfen.**

Owner: WSA Combat-VFX, Empfänger WS0. Privates Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig `game/pistol-gunshot-r1-20261117`. Kein PR, kein Merge, keine Live-Spielpromotion.

## Exakter Stand

- Gemeinsame VFX und native Kamera C2: `48fffaafe3cd5af08c9cc96a8435f4ea955f51d3`.
- Aktueller Implementierungsstand C3 (nur Nahkamera-Korrektur gegenüber C2, plus unveränderte Kritikerberichte): `f2efd08ee5b54b17d3bb5e9b70d7ec58a2ee2f13`. Dieser Return folgt als Dokumentationscommit. Exakte Ref wird danach erneut abgefragt.
- Bestehende World-Studio-Site: `appgprj_6ac27631f74c8191b52e4819c1973668`, weiterhin ausschließlich privat für den Owner.
- Produkt: https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/combat/
- Gepushter Site-Quellcommit: `709f8176af5fe7afd1ceb7646438f503a744ee6d`.
- Deployment: `appgdep_6afc22cf74a48191a83c1fb5a1be75bb`, Status `succeeded`.
- Version: `appgprj_6ac27631f74c8191b52e4819c1973668~appgver_124732dd52288191bbee20c625b67670`.
- Build: `combat-stage-r2-c3-20261117`; Bundle SHA256 `1a8fd1f48574a9b706223d983cc6d889d6e36db6263f80ad3c6f55d206ac23f6`.
- Exakte veröffentlichte Route in bestehender Chrome-Sitzung geöffnet, C3-Kennung im DOM bestätigt, ein tatsächliches fire/hit-Ereignispaar und laufender vorhandener Mischer (ein Kontext, zwei Plays, keine Fehler) abgefragt. Alle sieben Kamera-Schalter erreichbar; Nachtansicht selbst gezeigt. Hosted-ready in diesem Lauf ca.2.03s. Kein generelles Ladezeit-SLA.

## Gebaut

Eine zusätzliche leichte Combat-Werkbank innerhalb der bestehenden Site, verlinkt von der Feuerinsel: Spielabstand (55°), Insel, Waffe, Mündung, seitliche Schussbahn, Treffer und oben. Tag/Nacht, Holz/Stein/Metall, normal/viertel Tempo, Pause, Reset, einzelne Schüsse und6s-Aufnahme mit vorhandenem Spielton. Der Vorhang deckt das Laden ab. Keine zusätzliche Welt-/Modellbibliothek geladen.

Originale KFB-Pistole samt `KFB_Muzzle`, FB-Vorlage mit originalem Shirt/Schwanz und originalem Schussclip. Quellwaffe vor Einbau isoliert gezeigt. Die Werkbank nutzt vorhandenen Ereigniskern, Ziel-Sweep und denselben `pistolGunshot`-Baustein wie der native `combatPlayer.r2`. Ihre Ansicht „Spielabstand“ ist ausdrücklich eine Werkstattansicht; die echte M1-Spielkamera bleibt ein separater Nachweis.

Mündung: privat freigegebene CGHEVEN-Quelle, Frames5–8 nur Strahlaustritt, keine Quell-MOV im Paket. Kein runder Mündungsrauch. Kurz belichtete, zugespitzte Leuchtspur aus dem tatsächlich vom nativen Zielbesitzer begrenzten Flugsegment, keine fliegende Kugel und kein Dauerlaser. Kontakt: kleiner Flächenabdruck, Steinfragmente/Staub, Holzsplitter bzw. gerichtete Metallfunken. Fester Pool, native preDraw-Zeit statt ungerenderter Physikschritte. Vorhandener Bodenlichtkanal, keine zusätzlichen Lampen.

Native Prüfkamera wird direkt nach Teleport über den bestehenden Kamera-Besitzer versetzt; sonst zog sie quer durch die Landschaft und kippte in Draufsicht. C3 misst die Nahkamera an der originalen Releasepose, da die Ruhepose die Waffe absenkt. Das ist eine Kamera-Korrektur, keine neue VFX-Wertung.

Ton: bestehender `kfbAudio`-Graph, `combatPlanR2`,22 originale WS0-Clips (394561Bytes), keine Synthese und kein zweiter AudioContext. Die Site aktiviert `fx=r2` vor dem Modulimport; ohne diesen vorhandenen Modus war der erste Werkbank-Mitschnitt trotz geladenem Kontext stumm. Das ist behoben. Quellen und Hashes: `SFX_SOURCE.json`.

## Tatsächliche Prüfung

-61 Tests PASS: combatEventsR1, combatEventsHostR1, combatTargets, pistolReference, pistolGunshotR1, mit `--experimental-vm-modules`. Syntaxprüfung und `git diff --check` PASS. Nach ausschließlicher Kameraänderung C3 weitere5Gunshot-Tests PASS.
-9 Site-Quellassets und22 SFX-Dateien gegen SHA256-Roster geprüft.
-Nativer C2-Lauf: vier tatsächliche Treffer (Holz1,Stein1,Metall2), acht Trace-/acht Flash-Zeichnungen, kein verworfener Partikel. Film mit originalem Mischer aufgenommen. Audiosignal nach Dekodierung Peak0.921,RMS0.105. Das ist kein hörendes Klangurteil.
-C3-Nahkamera: originaler Browserfilm zeigt angehobene Waffe samt Mündungsfeuer vollständig im Bild. Audio nicht mehr stumm (RMS0.139, dekodierter Peak1.070; möglicher Codec-/Lautheitsreserve-Befund, kein Clipfreiheit-PASS). Native Spielaufnahme und Nahaufnahme sind zwei ausdrücklich getrennte Filme.
-Native Bildabstände: Median22.5ms,p9568.5ms,Maximum256.1ms. **Keine stabile60fps-/Performance-Abnahme.** MP4-Ausgabe mit30fps normalisiert beweist keine Renderkadenz.
-Repositoryweiter Audio-Inventartest hat die offenen Prüfungen `musicCatalogIndexed`, `noAudioInRepo`, `siteCopyOnlyWithSite`; nicht als bestanden ausgegeben, Baseline nicht erneut reproduziert. Kein Full-Build/CI-PASS behauptet. Optionales game-dev-CLI nicht verfügbar; native Prüfungen verwendet.

## Unabhängiger Kritiker

Explizit getrennte frische Agent-Instanz `/root/blind_combat_critic`, ohne Builder-Verlauf/Hypothesen/Reparaturliste oder Selbstwertung; nur Leseauftrag. Raster vor Kandidatenzugriff festgelegt. Eigene Browserläufe und eigene Bilder, keine Builder-Bilder als unabhängiger Beleg. Acht Kriterien: Kausalität15,Mündung15,Spur15,Treffer15,Spiel-Lesbarkeit15,Ton10,Tag/Nacht10,Wiederholung5. Empfehlung ab80/100 plus Evidenz-Gates.

C1: **46/100, keine Abnahme**. C2: **53/100, keine Abnahme**. Beide Originalberichte unverändert unter `docs/combat-stage-r2/`. C2 verbessert Spur/Nacht; Kontakte bleiben grafisch flach/geometrisch, vollständige native unabhängige und hörende AV-Prüfung offen. Der Kritiker hat nicht gehört. Seine C2-Nahkamera-Beanstandung wurde in C3 durch den Builder korrigiert; **C3 wurde nicht unabhängig neu bewertet**. Kein Riot-/AAA-PASS.

## Dateien und Übergabe

Game: `src/modules/{pistolGunshot.r1,combatPlayer.r2,combatReferenceConfig}.js`, `src/pistol-gunshot/boot.js`, `src/combat-stage/boot.js`, `src/audio/kfbAudio.js`, `src/assets/fx/pistol-gunshot-r2/`, `test/unit/pistolGunshotR1.mjs`, `scripts/pistol-gunshot/build-combat-site.mjs`, `docs/combat-stage-r2/`, aktueller `docs/pistol-gunshot-r1/RETURN.md`.

Site: `dist/combat/{index.html,combat.css,build/boot.js,SOURCE.json,assets/,audio/}`, `dist/kfb-combat/`, ergänzte vorhandene Three186-Lader, Links in `dist/index.html` und `dist/effects/index.html`. Bestehende Feuer-/World-Routen und private Zielgruppe erhalten.

Sichtbare Medien und Rohdaten: `EVIDENCE.json`; dauerhafte Ausgaben im Codex-Auftragsordner `outputs/combat-stage-r2/`, Filme `KFB-Pistole-C2-Spielkamera.mp4` und `KFB-Pistole-C3-Muendung.mp4`, Hosted-Screenshot und unveränderte Kritikerberichte. Rohaufnahmen sind echte Runtime-Aufnahmen, keine generierten Bilder/Animationen.

**Nächster Gate:** Eine überzeugende, unabhängig belegte Pistolen-Gesamtsequenz in der echten Spielkamera mit hörender AV-Beurteilung und ausreichender Renderkadenz. Bis dahin keine Hochskalierung auf Uzi/Gatling/Blaster/Raketen. Georg entscheidet Optik und Ton; WS0 erhält keinen als abgenommen bezeichneten Gunshot.

Guard-Folge: `GUARD_ROUTE.md` (unabhängig, read-only) hält die53/100/keine Abnahme aufrecht. Kleinster offener C3-Nachweis ist die vollständig sichtbare Mündung beim Schuss in der vorgesehenen Nahkamera bei Tag UND Nacht durch einen unabhängigen Prüfer. Der Builder-Nahfilm schließt diesen unabhängigen Gate nicht.
