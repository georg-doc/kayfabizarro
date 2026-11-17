# Für WS0 · Racer Chill & Fun R1 / Badewanne V-1885 · 17.11.2026

**Geliefert:** private Racer-Site Version10 mit besserer Geländefahrt/Kantenhilfe, Doppel-Space Hyperjump, G Strecken-Hop und F-Schweben für neun echte KFB-Hybride. Originale Apex-Flammen und KFB-Fahnen sind integriert; Staub folgt echtem Bodenkontakt und Materialcode. Rückwärts-Reifenspuren sind sichtbar und verblassen. Zeitfahren erzwingt competitive, Bestzeiten bleiben getrennt. Dolls Straßenrand R2 bleibt enthalten.

Site: https://kfb-racer-open-world.frizzlebob.chatgpt.site · Werkstatt: https://kfb-racer-open-world.frizzlebob.chatgpt.site/project.html (Revision2026-11-17.6).

## Exakter Stand

Native Site main: `892370163affd9bbf64af551982a46a77322b79b`; Version10 `appgprj_6afb696ed0748191adfb37df6e9cdac8~appgver_99f78748b1e88191a6f171503b034bb3`; Deployment `appgdep_6afbc806df308191a35dd494c8ec9d8c` succeeded2026-11-17T03:20:55.708982+00:00. Audience unverändert privat. Receiving branch `georg-doc/KFB-Stunt-Car-Race:racer/kern-r1`; Source/Evidence checkpoint `427993902a552233e1c9d947c2b8e5ab2544aa8e`. Kein Main-Merge, kein Live-Promote.

[Quellen, Anschlüsse und WIP](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/427993902a552233e1c9d947c2b8e5ab2544aa8e/_inbox/RACER_DRIVE_FUN_R1_2026-11-17/public/project/CHILL_FUN_R1_HANDOFF_2026-11-17.md) · [Tests/Guard](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/427993902a552233e1c9d947c2b8e5ab2544aa8e/_inbox/RACER_DRIVE_FUN_R1_2026-11-17/evidence/drive-assist-r1)

39 begrenzte native PASS-Fälle (8 competitive,8 Gelände/Kante,18 aktuelle Eingabe-/Kontrollfälle,5 VFX), mit ehrlichem Teil-Neulauf und Hashgrenzen in FINAL_SEAL. Zusätzlich vorhandene Dolls10/Core27/Vehicle-Swap bestanden. Echter Browser: Vorwärtsboost,66km/h rückwärts mit Spuren, kurze Doppeltaps, Crimsonhover ohne neuen Bodenstaub,G-Rückkehr,390×844Touch und competitive-Sperre. Keine Appfehler in Snapshots. Alle sechs privaten Host-HTTP-Prüfungen treffen neue Revision/Bundles. Kein Geräte-FPS- oder menschlicher Look-/Sound-PASS; kein authentifizierter Host-Spieltest behauptet.

## Nächster Integrationsdurchgang – dein R2-Plan

1. Ein Straßenmodul: deterministischerSeed, gestreamteKacheln, HOST_CONTRACT, keineWelt-/Renderer-Hoheit. Eine Linienquelle für Gelände,ClaudeStofffelder und Randbegegnungen: strassenUm(x,z,r) plus Breite/Kreuzungen. endlessTerrain/reserveOpening/gelaendeOeffnung, bündige viertelZufahrt-Kante, ein curbOwner src/modules/kfb-curb, surfaceAt/Materialcode. Das aktuelle begrenzte Site-Netz wird nicht als bereits endloses Hauptgame-Modul ausgegeben.
2. Fahrzeugprofile als Unterschiede auf aktuellen Stamm/Patch1(M2Car,patchHaftung,patchStunt); toy/gummi→HartgummiTabelle, Figuren→autoPuppenTempo. Kein zweiter Handling-/Physikbesitzer.
3. Echter Stammtest auf buehne=r1 mit __kfbBuehne.wagen(), setze(soldat|wuerfelmonster), test/lib/buehne.mjs; Fahrkamera auf freier Strecke. In diesem Site-Pass noch nicht ausgeführt.

## Badewanne als dritter Fahrzeugtyp – eingeplant

V-1885: vorhandene bathtub_kart r6e / WSB TUB_R6 und bathtub_kart.kfb-vehicle.json aus game/integration-r2 verwenden. CAR_TYPE_BADEWANNE.json im vorhandenen Profilformat: sichtbare/physische Hülle, Skalierung/Ursprung, Bodenfreiheit, Materialien, Effektparameter, Medium- undLarge-Sitz. roofDriver.js/kfb.tub-driver/1 und kfb_tub_drive_ik/enter/exit wiederverwenden. Schwer,gutmütig,leichtschaukelnd auf demselben Patch-Kern. Fahrer für offeneFahrzeuge; geschlosseneWagen erhalten hier keine zusätzliche Fahrerfigur. Erst Modell einzeln zeigen und Werte messen, dann Anschluss-/Kampfbühnentest. Hier noch nicht importiert oder vermessen.

Deine gemeinsame Boden-VFX-Ebene bekommt Tempo, echtenBodenkontakt/Anker, Breite, Untergrund. Beim Transfer genau einen Bodenstaub-Owner aktiv lassen, lokalenEmitterabschalten sobald der gemeinsame übernimmt; Auspuff/Jet separat. ExakteHostAPI/Version vor Integration aus dem Stamm lesen. Die echte KFB-Fahne ist bereits verfügbar; keine weitere Quellanforderung nötig.

Speedlines später. Fünf festeReifengeometrien offen. Oil/Pencil/Aquarell keine weiterenGame-Aufgaben; historischeClaudeWebsite-Übergabe bleibt. NächsterGate: gemeinsamerStraßenvertrag gegen aktuellenStamm, dann einen Kandidaten im Prüfort abnehmen. Hub-Karte und Main-Integration bleiben bei WS0.
