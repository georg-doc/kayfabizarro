# WSA · ToolBox-Studio figure roster R1 · Return · V-409
Stand: 17.10.2026. Owner: WSA / bestehendes ToolBox-Studio. Ergebnis: **Teilstand als unveröffentlichter Entwurf v11 gesichert; nicht abgenommen.**

## Identität und Abnahmefläche
- Site: `appgprj_6ac2ba44282881919d1a49287a32054e`, KFB ToolBox. Bestehende private Zieladresse: https://kfb-toolbox.frizzlebob.chatgpt.site/
- Gespeicherte Version: **11**, `appgprj_6ac2ba44282881919d1a49287a32054e~appgver_130348f1fae08191a592f91c62db27f8`.
- Exakter gepushter Site-Quellstand: `53028aa47de97cf1c5791cdc72501212a5785094`.
- Paket: SHA256 `a36792fac18b647aef57b65c82a1665b7464fdb5516c252fc994a5249cf8c349`, 429 Dateien.
- **Kein Deployment.** Die bestehende URL zeigt weiterhin v10 und ist kein Beleg für diesen Entwurf. Sites liefert für eine gespeicherte, unveröffentlichte Version keine gesonderte Staging-URL; deshalb keine erfundene Kandidatenadresse. Browserprüfung erfolgte lokal, keine öffentliche Abnahme behauptet.
- Bildbelege und dieses Return: https://chatgpt.com/space/page_b78228a96bc88191b1029cb5a6fb458a

## Ergebnis je Figur

| Figur | Stand | Offener Punkt |
|---|---|---|
| Lord Hunky | r4 aus Karte, EyeRig v6, Mund A, Kragensitz, fein profilierter KFB Clay; Front/¾ geprüft | Georg-Tuning/Save und Kartenfreigabe fehlen; E2 ist weiterhin Karten-TODO |
| Lady Dory | r4 aus Karte, ein zentrales Auge, Mund B, Kragensitz, KFB Clay; Front/¾ geprüft | Kartenwerte bleiben Kandidat; Lid-/Socket-Passung und E2 sind sichtbar offen, keine Look-Freigabe |
| Norman | Source only zuerst; originale Quelle aus Karte mit Clay | **STOP:** vorhandener Gesichtskandidat liefert graue Bereinigungsfläche und unpassende Augen; Face-candidate-Schalter und Vorschlagsexport gesperrt, kein Ersatz |
| Brain-Cyborg | Sichtbarer Eintrag „in Arbeit · B10“ | Kein Körper/keine Augenanker in der Karte, B10 nicht geliefert; kein Ersatzmodell |

Normans fehlerhafte Kandidatenansicht ist als Fehlerbeleg erhalten. Source only bleibt verfügbar. Die Sperre gilt dieser Naht; der Elternauftrag wird mit den überprüfbaren Alien-Kandidaten fortgesetzt.

## Quellen und bestehende Owner
- Vier Figurenkarten unverändert vom Register-Branch; gegen aktuellen Head `b1ada9285ccdc4b5693252b941ad8c445c034223` nochmals blob-identisch geprüft. Kartenblobs: Hunky `941b3dc22daa42a6ff3b40ede7c221a2d95861dc`, Dory `02a7677e8fc6dc51e94a74450faf82622982e163`, Norman `5d64ed428cd150e7391b7799fbf355583d68b547`, Brain `865ed44700274095c6135430885419d9009fe7f8`.
- Alien-GLBs/Rezepte: `assets/kfb-blender-run-r1-2026-10-16` @`6ecf85775de0118a232161f4b4f9d4a08f379cc7`; Körper und Rezept per Karten-SHA256 geprüft, alte Rezept-Metadaten nicht als Quellenautorität verwendet.
- Bestehender EyeRig-v6-Owner hat exakt Kartenblob `853bcf5fb090dd6564fda8bc83d0b4cb527e6b26`. HeadPart, DangleChain, Mund, Pose und Mixer bleiben bestehende Owner.
- **Lichtmodul inzwischen geliefert und unverändert übernommen:** `ws1/r3f-frame` @`2b88f8fac94366c422780bc97f3fcc066b01dd1a`, `ws1/kfb-planet/src/vendor/light/kfb-stage-light.v1.js`, Blob `cd8bda8c2c6364be97fa6123f739fef8f11313dc`. Für Kartenfiguren sind die bisherigen Studio-Lichter ausgeblendet; das gemeinsame Modul besitzt Licht, Figurenlicht und Schattenpassung. Kein violettes World-Preview-Gegenlicht.
- Gemeinsamer Figuren-Loader weiterhin nicht geliefert. Der Übergang liest und prüft ausschließlich Kartendaten/Dateien, hat keinen eigenen Renderer. Bei Lieferung durch den gemeinsamen Loader ersetzen.
- KFB Clay bleibt im bestehenden `body-surface.v2.js`/K2-v10-Owner. Kartenprofil figure-fine wurde aus Resident Atlas `diorama.js#CLS.fine` @`ce4b94e5e92ea3c5cde1208093c0c6fa83e753ff` übernommen: figure 0.45, TOOLMIX.vehicle, print 0.8, vorhandene Maßstabsumrechnung; Sheen ≤0.05. Augen/Mund bleiben ohne Clay.
- Norman-Prototyp: `toolbox/eye-rig-batch-2026-09-18` @`d1900457e39eb56fe766fb7a7adb80ac0bc09bc3`. Bestehender Adapter übernommen; Mund auf szenenbeleuchtetes Material umgestellt. Visuelle Kandidatenprüfung dennoch FAILED, deshalb Sperre.

## Abgesicherte Altlasten
1. Alte r1-Abstimmungen werden bei anderer Kartenidentität nicht auf r4 gelegt; vollständige alte Werte bleiben als Konflikt erhalten.
2. Dangle liest die explizite Seite aus dem Rezept, nie aus dem Knotennamen.
3. Veraltete Hals-Automatik entfernt; r4-Kragensitz bleibt aus dem Rezept.
4. Mundprojektion liest nun die tatsächlich verformten/geskinnten Kopfpositionen und neu berechneten Normalen für die Projektion. Kein Umbau des Körpers oder Verschieben der Kartenanker.
5. Kartenfiguren übernehmen keine alten FB-Emote-/Lid-Vorgaben. Insbesondere `lids.use=false` wird nicht zu ungültigen Zahlen überschrieben.
6. Quellfehler/Prüfsummenfehler werden sichtbar verweigert. Kein Raw-GLB-Fallback.

## Speichern / Karten
**Keine neuen Georg-Werte und keine aktualisierten Freigaben.** Agent-Prüfwerte wurden nicht als GEORG oder approved zurückgeschrieben. Kanonische Karten blieben unverändert.

Der vorhandene Save-Knopf speichert ausdrücklich im Browser. Für Hunky/Dory erzeugt „Abstimmung kopieren“ einen Vorschlag mit Basis-Karten-/Körperhash und den tatsächlich eingestellten Werten. Das ist **noch kein GitHub-Commit**. Der verlangte direkte GitHub-Speicherweg ist offen: eine statische Site kann den GitHub-Connector nicht selbst aufrufen. Dafür ist eine begrenzte, geprüfte Backend-Integration im bestehenden Site-Projekt nötig. Keine Tokens im Browser, kein Ersatzspeicher.

Nach tatsächlichem Georg-Tuning: Vorschlag gegen aktuelle Karte prüfen, eigener Branch `characters/edit-<id>-<date>`, Commit ohne Merge; nur tatsächlich entschiedene Werte/Freigaben ändern, übrige Konflikte und E2-TODOs erhalten.

## Tatsächliche Prüfungen
- Drei Körperdateien + zwei r4-Rezepte SHA256 PASS; falsche GLB-Prüfsumme wird vor dem Parsen abgelehnt.
- Brain-Karte liefert pending; kein Ersatzladepfad.
- Syntaxprüfung Hauptlogik und Daten-/Materialmodule PASS.
- Lokaler Browser: Hunky/Dory laden, Front/¾ mit Clay und Mundprojektion geprüft. Pupille .40 → .41 → .40 über echten Regler, ohne Save.
- Norman Source-first PASS; Gesichtskandidat visuell FAILED → STOP; gesperrter Schalter im Browser geprüft.
- Motion-Tab: vorhandenes iframe mit kanonischen Profilen ready; Rückkehr in Rigging geprüft.
- Kein privates Produktionslogin oder öffentliches v11-Hosting als geprüft ausgegeben.

## Geänderte Site-Dateien
`dist/index.html`, `dist/kfb-lib/figure-card-data.v1.js`, `body-surface.v2.js`, `kfb-stage-light.v1.js`, `kaykit-eye-adapter.v1.js`, `norman-face.v1.js`, `clay/clay-toolmix.v1.js`, vier unveränderte Kartenkopien + zwei Norman-Quelldokumente unter `dist/data/figure-cards/`, gepinnte drei GLBs/zwei Rezepte unter `dist/data/roster-r4/`, `ROSTER_R1.md`.

Register-Handoff: dieses neue Return; kein Hub-/Router-Umbau. Kein neuer Source-PR; native Site-Version ist der unveröffentlichte Änderungsträger. PR #414 bleibt Georgs Merge.

**Nächstes Gate:** WS0 klärt Normans kleinste Fehlernaht und den GitHub-Save-Weg; danach Georgs Tuning/Abnahme und ausdrückliche Veröffentlichungsfreigabe. Bis dahin bleibt v10 live.
