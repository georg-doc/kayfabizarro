# WSA → WS0 · Combat VFX R2 · Bestandsvergleich Arena ↔ Spielstamm
Stand 31.10.2026 · Schritt 1 aus V-1135; Grundauftrag V-1126.
**Status: Bestandsvergleich abgeschlossen; Quellvergleich und isolierte Prüfer-Ausführung belegt. Kein Runtime-, Bild-, Spiel-, Hör- oder Performance-PASS.**

Georg hat am 31.10. ausdrücklich beauftragt, diesen Vergleich samt Empfehlungen und offenen Fragen direkt im Register abzulegen. Diese Rückgabe enthält WSA-Empfehlungen; sie setzt keine neuen V-Entscheidungen. Nach Schritt 1 Stopp / Rückgabe an WS0. Es wurde kein Spielcode geändert.

## Für WS0 in einer Minute
- Der aktive Consumer liegt in **KFB-Stunt-Car-Race/game/integration-r2**, nicht auf Arena-main. Er bindet Pistole und Blaster ein.
- Die spätere Arena-K10-Linie enthält **12 Waffenvarianten** mit nativen Ablaufdaten. Das ist ein Donor-Bestand, keine Abnahme dieser Varianten am heutigen FB.
- Vier Combat-Module und Knet-FX sind bereits **Git-Blob-identisch** im Spiel. Ein erneuter Vollimport dieser V1-Dateien bringt keinen Qualitätsgewinn.
- Der im Spiel eingebundene Profilprüfer ist älter: derselbe ausgeführte Vergleich ergibt **4/12 CONTRACT_PASS im Spielprüfer gegen 12/12 im späteren Arena-Prüfer**. Zwei absichtlich ausgewählte verbotene Gewehr-Clips passieren den alten Prüfer.
- Mündungsblitz-Dunkelheit ist im Materialpfad nachvollziehbar. Gatling, Rakete, per-Waffe-Geschosse und kontrollierter Zusatzrückstoß brauchen weitere Consumer-Arbeit.
- FB-Gatling-R2-Messdaten sind lokal vorhanden, am unten geprüften privaten GitHub-Pfad jedoch **nicht gefunden**. Der alte Mech-Griff darf nicht unbemerkt zur FB-Vorgabe werden.
- `fx-burst` ist ein verwendbarer POC-Spender mit zusätzlichen Abhängigkeiten und Integrationsnähten. Die Riss-/Wandmodule liegen auf einer separaten Design-Linie; ihr Einbau bleibt hinter den Gates aus V-1135.

## 1 · Gepinnte Quellen
| Kürzel | Repo / Branch | Commit |
|---|---|---|
| GAME | [KFB-Stunt-Car-Race · game/integration-r2](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/b09ba49d7ce4804c50442faf300e4ace8196ea61) | `b09ba49d7ce4804c50442faf300e4ace8196ea61` |
| ARENA-K10 | [KFB-Combat-Arena · wsa/k10-weapon-families-2026-10-21](https://github.com/georg-doc/KFB-Combat-Arena/tree/8ef6740621479f931ac288b4c379333c5d5e05a1) | `8ef6740621479f931ac288b4c379333c5d5e05a1` |
| ARENA-PORTABLE | [wsa/openworld-modules-v584-2026-10-21](https://github.com/georg-doc/KFB-Combat-Arena/tree/cb0d93cf3d4542c15f70f88ce2ab08d418374049) | `cb0d93cf3d4542c15f70f88ce2ab08d418374049` |
| ARENA-AV | [ws1/combat-av-r1](https://github.com/georg-doc/KFB-Combat-Arena/tree/17f4403e69bc02b74b4f8eb42b2d12eed576c81a) | `17f4403e69bc02b74b4f8eb42b2d12eed576c81a` |
| BURST | [KFB-Stunt-Car-Race · poc/cascade-sphere-r0](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/6efa42c4309e16a737394c1aedd452e4188cb6cd) | `6efa42c4309e16a737394c1aedd452e4188cb6cd` |
| WALL | [design/kartengebaeude-r1](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/98dc511d63bf0019b8b596caff1a36cf334779a3) | `98dc511d63bf0019b8b596caff1a36cf334779a3` |
| PRIVATE | KFB-Stunt-Car-Race · assets/private | `a290c8d1bbc43306ee962c8971004e919afe7246` |
| REGISTER-READ | kayfabizarro · docs/kfb-decisions-register-2026-10-11 | `a4443092ab10495f2d9eea5fba1d51803ef9b19d` |

Arena-main ist weiterhin `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`; es ist kein Sammelstand der separaten Gameplay-Linien. Der im Browser noch sichtbare alte localhost-Soldat wurde nicht als heutiger Spielstand verwendet.

Maßgebliche Consumer-Herkunft: [GAME src/vendor/combat/SOURCE.md](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/b09ba49d7ce4804c50442faf300e4ace8196ea61/src/vendor/combat/SOURCE.md). Sie verlangt unveränderte V1-Imports und Änderungen beim WSA-Eigentümer.

## 2 · Was schon unverändert angekommen ist
Git-Blob-Vergleich der vollständigen, nicht abgeschnittenen GAME-/Arena-Bäume:

| Baustein | Arena → GAME | gemeinsamer Git-Blob |
|---|---|---|
| Teilnehmer-Hit-Stop | ARENA-PORTABLE modules/combat/hit-stop.v1.mjs → src/vendor/combat/hit-stop.v1.mjs | `81e410c0bd1c8ae3ceb29ec16e97812b9ede3315` |
| älterer Profilprüfer | ARENA-PORTABLE modules/combat/weapon-profile.v1.mjs → src/vendor/combat/weapon-profile.v1.mjs | `9e4713557e2f6509cdf3d4e037cc5f4f821d44c3` |
| Original-Mündungsblitz | ARENA-PORTABLE modules/combat/muzzle-fx.v1.mjs → src/vendor/combat/muzzle-fx.v1.mjs | `75e042fe931b9032ef04e9b8b7dc12e74736d803` |
| Mündungsquellen | ARENA-PORTABLE modules/combat/muzzle-sources.v1.mjs → src/vendor/combat/muzzle-sources.v1.mjs | `11fbcf7a284a9613ef39facebc6bda9492457794` |
| Knet-Effekte | ARENA-AV combat-arena-v5/ws1/knet-fx.v1.mjs → src/vendor/combat/knet-fx.v1.mjs | `5b1a7dd548da19aaaf0f2d9bad4a802e297b2252` |

Auch die zwei GAME-K10-Karten und SOURCE_LOCK sind Blob-identisch mit den Fixtures aus ARENA-PORTABLE. Monster-Roster wurde laut SOURCE.md bewusst nicht übernommen: Gegner bleiben beim WS-NPC-Owner. Kein Anlass, daraus eine zweite Gegnerverwaltung zu machen.

**Empfehlung:** diese bestehenden Quellen und Eigentumsgrenzen erhalten. Für R2 gezielt einen versionierten Eigentümer-Delta liefern, Consumer-Import und Herkunfts-Lock explizit nachziehen; keine stille Bearbeitung der als byte-identisch dokumentierten V1-Kopie.

## 3 · Waffenbestand und heutige Integrationslücke
Quelle: [ARENA-K10 weapons.json](https://github.com/georg-doc/KFB-Combat-Arena/blob/8ef6740621479f931ac288b4c379333c5d5e05a1/combat-arena-v5/k10/weapons.json), gleichnamige Profile und `actor.js`, dazu `combat-arena-v2/gunfight.v2.js`. Die Tabelle nennt vorhandenen Code/Daten, keinen neuen Sicht- oder Spiel-PASS.

| Variante | Vorhandener Arena-Ansatz | GAME-Consumer / sinnvolle Verwendung |
|---|---|---|
| pistol | 1H, nativer Abgang 0,2667 s, Original-Flash | angeschlossen; erster Flammen-/Ton-/Rückstoß-Referenzfall |
| blaster | 1H, 0,2667 s, Original-Flash und Varianten | angeschlossen; elektrische R2-Variante statt eigener Kampfpfad |
| action-rifle | 1H, 0,2667 s; 2H und 1H_Reload ausgeschlossen | nicht in K10_WEAPONS; Profil/Marker später übernehmen |
| crossbow | 2H-Abgang 0,2667 s, Release-Puff statt Flash | nicht angeschlossen; Ablauf/Release-Messung brauchbar, Geschossdarstellung prüfen |
| gatling | Mech-Daten, rootYaw −36°, 18 Hz, 0,16 s Anlauf, lokale +Z-Laufrotation | nicht angeschlossen; Kadenz-/Marker-Vertrag brauchbar, FB-R2-Griff separat nötig |
| smoke | Throw-Abgang 0,6333 s, gemessener Abwurf, Ballistik, Rauch beim ersten Bounce | nicht angeschlossen; vorhandene Wurflogik als Referenz; Rauchdarstellung ist Basispuff |
| blade | 1H-Kontaktmarker, Spitzenspur/Sweep, bestehender Schaden und Teilnehmer-Hit-Stop | nicht angeschlossen; Marker/Vertrag wiederverwenden, Host-Kontaktpfad erhalten |
| wand | Cast 0,3 s, charged/channel; Summon mit Waffe ausgeschlossen | nicht angeschlossen; Cast-Daten nutzen, generische Stern-/Kugeloptik noch kein Qualitätsziel |
| staff | Cast 0,3 s; Raise und Summon ausgeschlossen | nicht angeschlossen; Ausschlüsse übernehmen |
| skeleton-staff | Cast 0,3 s; Raise und Summon ausgeschlossen | nicht angeschlossen; Ausschlüsse übernehmen |
| bow-a | Draw_Up → optional Hold → Release_Up, Abgang 0,0333 s im Release; rootYaw −39° | nicht angeschlossen; shootCycle, Draw-Morph, echter Pfeil, Ballistik vorhanden; Death_B gesperrt |
| bow | gleicher Zyklus, anderer Griff/Draw, rootYaw −24,4° | nicht angeschlossen; keine gemeinsame geratene Bogen-Halterung; Death_B gesperrt |

Zusätzlich vorhanden: `combat-arena-v5/k10/weapon-drop.mjs` mit gemessenen Endlagen, Rücksetzen und Bodenbegrenzung. Rauchbombe nutzt darin einen ausdrücklich deklarierten Laufzeit-Fallback. Dieser Adapter ist auf den Arena-Actor-Root und dessen Bodenannahme zugeschnitten; kein fertiger Welt-/Hang-Untergrund-Adapter.

Die Arena-Gatling dreht in der aktiven Attacke hoch; `cancelAttack()` entfernt den Attack-Zustand. Ein eigener sanfter Auslauf ist dort nicht erkennbar. Für V-1126 reicht eine 1:1-Übernahme daher nicht.

**Nicht als Ganzes übernehmen:** Arena-Actor erzeugt Mixer, Augen und Clay-Anbindung; der alte Gunfight besitzt Arena-Ziele, Schaden, Würfelphysik und Powerups. Im GAME bleiben diese Aufgaben beim bestehenden Actor/Controller, Gegner- und Combat-Owner. Wiederverwendung betrifft die passenden Module/Daten und freigegebenen Abläufe.

## 4 · Tatsächlich ausgeführter Profilvergleich
**Ausführung:** Node v24.21.0, `node compare-profiles.mjs`, Exit 0. Vor der Prüfung wurden **16 lokale Referenzdateien gegen ihre vollständigen Git-Blob-SHAs verifiziert**: zwei Prüfer, deren zwei Quellmodule und zwölf Profile. Anfangs beim lokalen Texttransport hinzugekommene Schlusszeilen wurden vor der Messung entfernt; die anschließende Blob-Prüfung ist exakt.

| Prüfer | geprüfte Profile | CONTRACT_PASS | CONTRACT_FAIL |
|---|---:|---:|---:|
| GAME, Blob 9e471355… | 12 | 4 | 8 |
| ARENA-K10, Blob 8d551dd7… | 12 | 12 | 0 |

GAME-PASS: pistol, blaster, action-rifle, blade.
GAME-FAIL: crossbow, gatling, smoke, wand, staff, skeleton-staff, bow, bow-a.

Typische Gründe: ältere Griff-/Familienregeln, noch erzwungene Flash-Felder für Magie, fehlende Zulassung des neueren Bogen-/Dauerfeuervertrags. **Das sind konkrete Schema-/Versionsunterschiede; keine neue Widerlegung der gemessenen Waffen.**

Fünf zusätzliche Mutationsproben setzen ausdrücklich ausgeschlossene Clips als ausgewählten Release ein:
- Action-rifle + Ranged_1H_Reload: GAME **CONTRACT_PASS**, neuer Prüfer **SELECTED_CLIP_EXCLUDED**.
- Action-rifle + Ranged_2H_Shoot: GAME **CONTRACT_PASS**, neuer Prüfer **SELECTED_CLIP_EXCLUDED**.
- Gatling + flight_aim, Staff + Ranged_Magic_Raise, Bow + Ranged_Bow_Release: beide melden FAIL; der GAME-Prüfer allerdings aus älteren Schema-Gründen, ohne Ausschlussprüfung.
- Der GAME-Prüfer exportiert kein `isClipExcluded`; der spätere Arena-Prüfer tut es. Neuer Prüfer lehnt alle fünf gezielt aufgrund des Ausschlusses ab.

Belege: [comparison.json](WSA_COMBAT_VFX_R2_INVENTORY_EVIDENCE/comparison.json), [SOURCE_LOCK.json](WSA_COMBAT_VFX_R2_INVENTORY_EVIDENCE/SOURCE_LOCK.json), [ausgeführtes Prüfskript](WSA_COMBAT_VFX_R2_INVENTORY_EVIDENCE/compare-profiles.mjs). Die Referenzdateien werden für die Wiederholung aus den darin gepinnten Quellen in die angegebenen Zielpfade gelegt; kein Kaufmodell ist nötig.

**Empfehlung:** neueren Prüfer zunächst als versionierten WSA-Delta übernehmen und mit GAME-Bestandskarten regressionsprüfen. Auswahl und tatsächlicher Clipstart müssen Ausschlüsse erzwingen. Bloßes Bestehen von Metadaten ersetzt weder Quellenhashprüfung am Asset noch Bild-/Spielabnahme.

## 5 · VFX, Geschosse, Ton: wiederverwenden und ergänzen
### Mündung / Bewegung
[GAME combatPlayer.js](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/b09ba49d7ce4804c50442faf300e4ace8196ea61/src/modules/combatPlayer.js) benutzt physisches KFB_Muzzle +Z, native Release-Marke und einen bestehenden Actor-Mixer. `muzzle-fx.v1` klont Quellmaterial ohne Selbstleuchten; Standarddauer 0,06 s. Keine Helligkeitshüllkurve oder Slot-Rückstoßfunktion dort gefunden. `holdFlash(s)` ist vorhanden, aber noch kein präzises Anhalten am R2-Helligkeitsmaximum.

V-1126 ergänzt genau hier: bestehende Kit-Form, heller Kern/gelb/orange, zeitlicher Aufbau/Streckung/axiale Variation, ein gemeinsames Spieler-Lichtsignal und begrenzter Slot-Impuls. Fester Griff und native Clips bleiben erhalten. Stärke des Zusatzimpulses gegen vorhandenen nativen Recoil prüfen; keine doppelte Übertreibung und kein sichtbares Ablösen der Hand.

### Geschosse / Events
GAME nutzt für beide Waffen dieselbe längliche Icosahedron-Geometrie, unterschiedlich gefärbt, einheitlich 34 u/s und 26 u Reichweite. Pool 12, Event-Ring 64. Knet-Treffer, Trail und Teilnehmer-Hit-Stop sind angeschlossen. Ein frisches Geschoss bleibt im Abgangsbild an der Mündung und bewegt sich ab dem folgenden Update; diese vorhandene Naht erhalten, keine zusätzliche Eingabelatenz.

Für R2 fehlen im geprüften Consumer spezifische Gatling-/Raketen-/Ballistikdarstellungen und Daten dafür. **Empfehlung:** je Waffe getrennte Datenfelder für Geschossform, Spur, Kadenz/Impuls und Effektklasse; Schaden/Targets bleiben beim vorhandenen Owner. Ein Schuss-ID-/Zeitpfad für Projektil, Flash und Audio. `energy` im Audioevent ist eine Zahl 0…1; die Knet-Energieklasse ist dagegen ein String wie kinetic/electric. Nicht versehentlich vertauschen.

GAME meldet fire/contact/kill mit seq/id. `fire()` lehnt AIRBORNE ab und vor dem Release einen zweiten Auftrag mit PENDING. Diese Boden-/Marker-Grenzen sind Quellbefund, kein neuer Steuerungs-PASS. Ein FX-Pass soll sie nicht nebenbei zu einer neuen Controller-/Flugkampflogik erweitern.

### Rauch / Explosion
`src/modules/dustTrail.js` existiert im GAME mit GPU-/Pool-Emittern, Puff-/Thrust-Ansätzen; wiederverwenden.

BURST `cascade/r4/fx-burst.js`, Blob `d98823636451175110a4b4eaef57dde8ff1ab6a3`, ist **nicht im GAME-Baum gefunden**. Das POC-Modul bindet ein:
- `cascade/r4/fx/kfb-fx-flame.js`;
- `cascade/r4/fx/kfb-fx-sprites.js`;
- `cascade/r4/fx/fire_point_6x5.png`;
- `review/donors/sw-fx.js`;
- den jeweiligen `src/modules/dustTrail.js`-Stand.

Vor Übernahme die gesamte Abhängigkeitsmenge pinnen und gegen GAME prüfen. Bereits sichtbare Integrationsnähte:
1. Die Flammensaat wird aus `id * 17` berechnet. GAME-IDs wie `k10:123` sind Strings; ohne getrennte stabile Zahlensaat kollabiert die Variation nach NaN-/Integer-Umwandlung. Das ist ein Codebefund; kein behaupteter sichtbarer NaN-Renderfehler.
2. Das lokale `seen`-Set wächst bis reset/dispose unbegrenzt. Für längeres Gameplay Ledger begrenzen oder an den Host-Vertrag anbinden.
3. `createWeaponFX` erzeugt selbst ein Licht, das der POC-Adapter sofort aus der Szene entfernt. Bei der Integration den Licht-Owner explizit bewahren; V-1126 erlaubt ein gemeinsames Spieler-Schusslicht, keine unbemerkten weiteren Lichtinstanzen.
4. Die drei Nachbrennerpositionen verwenden Welt-X/Y und Z-Versatz. Ausrichtung auf beliebige Auftreffnormalen für Boden und andere Wandrichtungen ist ungeprüft.

Arena hat außerdem `modules/kfb-combat-def.js` und `kfb-combat-atlas.js` mit bestehenden Energie-/Oberflächenregeln und 18 Zellen (burst/star/puff/…/arc/plasma). Sie sind Wiederverwendungs- und Referenzbestand; die ältere Würfel-Waffenbalance und generischen Stern-/Puff-Effekte sind kein fertiger R2-Qualitätsbeleg.

### Ton
[GAME cueMap.js](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/b09ba49d7ce4804c50442faf300e4ace8196ea61/src/audio/cueMap.js) enthält bereits Zuordnungen für die zwölf K10-Varianten, Rocket-Launch, Materialtreffer und explosive Intensität. `kfbAudio.k10()` hat Anschlag/Körper/Ausklang, Gatling-Schleife sowie Spin-up/down-Cues. **Das Vorhandensein von Cues beweist nicht ihre hörbar richtige Kopplung.**

Derzeit startet Gatling-Ton beim ersten fire/raise-Ereignis; Auslauf folgt einem 0,18-s-Timeout ohne weitere Schüsse. Für die echte Hochlaufphase muss Bild-/Ton-Kopplung gezielt angeschlossen werden. Unbekannte fire-Waffen fallen in der Cue-Tabelle auf Pistole zurück; R2 soll fehlende Profilzuordnungen sichtbar diagnostizieren. Zentralen Audioweg und AudioHost-Seq-Deduplikation erhalten, keinen zweiten AudioContext/Abspielpfad bauen.

## 6 · FB-Gatling: konkrete Quelllücke vor Einbau
Lokal gelesen:
`/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_HUB/50_BLENDER/K10/data/combatmech_minigun_mounts.fb_r2.json`
SHA-256: `67a170f26d88bfdf489f1855fd15685a089746fa49bb1d0aab1f20d8c561f7af`.

WSB-K10-R2-Daten vom 29.10.: FB_CANON A11, Griffposition **[0,0,0.155]**, Quaternion [-0.26562,0.39234,-0.08089,0.87691], ruhiger Oberkörper Running_HoldingRifle@0,25 s, **rootYawDeg −35** als Messdatenempfehlung. Ranged_1H_* und Ranged_2H_* ausgeschlossen. 40/40 Clearance-PASS ist eine **deklarierte WSB-Quellenangabe**, hier nicht neu gerendert/nachgemessen.

Am selben Pfad auf PRIVATE kommt 404; in der gelesenen K10/data-Liste kein passender FB-R2-Dateiname. Die dort vorhandene alte Minigun-Waffenkarte (Blob 02665112…) ist weiterhin der Mech-Stand [0,0,0.15] / −36° ohne diese FB-Variante.

**G0-Lücke für die FB-Gatling, keine Blockade des Pistolen-Flammenpasses.** Nicht lokal geraten ausgleichen. WS0 bitte kanonischen privaten Commit/Pfad samt Figurvariante und Mündungsregel benennen.

## 7 · Risse / Bildvorlagen: Abhängigkeit sauber trennen
GAME `src/look/impactStar.js` und `impactScar.js` erzeugen eine großflächige Stern-/Schmauchform im Gelände über Welt-X/Z-Koordinaten. Das ist **kein nachgewiesener Innen-/Außen-Wandriss-Adapter**.

WALL enthält `cascade/r4/fracture.mjs` (Blob d888cca6…) und `impact-mask.mjs` (5e8aa9a8…). Ein gemeinsames Fracture-/Wandfeld für Loch, Risse und Wandzuordnung ist vorhanden, mit Wanddicke 0,36 und getrennten Wandachsen. Daraus folgt noch kein sichtbarer PASS für feine kurze Risse, korrekte Innenflächen und Lochtiefe.

Gemäß V-1135 zuerst quellengestützte Einzelbilder aus 75_REFS/impact_vfx_r1 und ETHERINGTON_ZERSTOERUNG_R1 an WS0, dann Georgs Wahl, **Riss-Code erst nach Wahl und Kartengebäude im Stamm**. Detailwahl muss Größenrelation Treffer↔Riss, harte Lochkante, Verzweigung ohne Ringe/Kreuzungen, gemeinsame Innen-/Außenposition und schräge Ansicht der Tiefe zeigen. Ein gutes PNG allein beweist diese geometrische Fortsetzung nicht.

## 8 · Empfehlung für die nächsten Schritte
1. **Grundlage im nächsten Runtime-Schritt:** gezielter versionierter Prüfer-Delta plus Regressionsfälle; bestehende Actor-/Zeit-/Audio-Owner erhalten. Pistole/Blaster als erste R2-Bild-/Tonreferenz.
2. **Gatling nach G0:** FB-R2-Messdaten fest pinnen, Kadenz aus vorhandenen 18-Hz-/0,16-s-Daten; Host-Zustände hochlaufen/feuern/auslaufen verbinden. Dauerfeuer benötigt eine Belastungsprobe, da vorhandener Pool/Event-Ring nicht automatisch für alle neuen Lebenszeiten genügt.
3. **Rakete:** Originalmodell aus dem Auftrag als Referenz, Burst-Abhängigkeiten korrekt übernehmen, Launch-/Contact-Energie als Präsentationsdaten. Bestehende Treffer-/Kill-Logik erhalten; keine neue AoE-Schadenslogik.
4. **Geschosse:** ausdrücklich eigener V-1135-Schritt; alle weiteren Waffen nur mit Profilzeile/Quellenbeleg, fehlende Wirkung melden.
5. **Bildvorlagen/Risse:** private Einzelfiles auf assets/private, Auswahl über WS0; kein Riss-Umbau vor dem Gebäude-Gate.
6. **Bewegungsabnahme:** aktuelle Spielfigur, native Clips und Originalgriff. Ungelöste Kombination als Figur/Waffe/Clip/Zeitpunkt/Bild an WS0 für Blender.

Je Schritt nur die zugehörigen Stufe-A-Tests, off-Baseline (Bild und Programmliste) sowie Ressourcen-Zählwerte. Der Code-/Prüfervergleich hier ersetzt diese späteren Runtime-Prüfungen nicht. Höchstens ein blinder Kritiker am beauftragten Meilenstein; keine iterative Vollprojekt-Auditschleife.

## 9 · Offene Fragen an WS0
| ID | Frage / benötigte Rückgabe | WSA-Empfehlung / Auswirkung |
|---|---|---|
| COMBAT-R2-Q01 | Welcher private Commit/Pfad ist kanonisch für die FB-Gatling-R2-Halterung? Soll −35° aus der FB-Messdatei die Figurenvariante bilden, während −36° Mech-spezifisch bleibt? | FB-R2-Daten veröffentlichen/pinnen; keine globale −36°-Konstante aus dem alten Mech-Consumer. Benötigt vor FB-Gatling. |
| COMBAT-R2-Q02 | Gilt für den ersten Runtime-Pass weiterhin Boden-Kampf wie im heutigen Consumer, oder wird zugleich eine freigegebene Flug-/Fahr-Clipfamilie beauftragt? | Erst vorhandenen Bodenpfad absichern; Flug/Fahren als benannten Folgeschritt führen. Die heutige AIRBORNE-Sperre ist dokumentiert. |
| COMBAT-R2-Q03 | Welcher WS1-Integrationsstand und Ereignis-/Koordinatenvertrag des Kartengebäudes soll den späteren Riss-Consumer speisen? | WALL bleibt gepinnter Donor bis zur Integration und Bildwahl. WS0 übergibt die verbindliche Naht an WSA; kein zweiter Wand-/Collider-Owner. |

Prüfer-Upgrade, stabile separate FX-Zahlensaat, begrenzte Pools/Ledger und Nutzung des vorhandenen Audiowegs sind technische Empfehlungen, keine neuen Georg-Auswahlfragen.

**Was Georg als Nächstes wählen muss:** Für diesen Bestandsvergleich keine Bildwahl. Zuerst WS0-Rückmeldung auf Q01–Q03 und Zuordnung des nächsten Schritts; später die Einzelbildvorlagen über WS0. Es wurden noch keine Bilder erzeugt.

## 10 · Prüfgrenzen und Ablage
- Ausgeführt: gepinnte GitHub-Leseprüfung, vollständige relevante Quellbäume, 5 Blob-Gleichheitspaare, 16 Byte-Checks, 24 Profilprüfungen (12 × 2) und 10 Mutationsprüfungen (5 × 2), Exit 0.
- Nicht ausgeführt: Asset-GLB-Render/Geometrieprüfung, Arena-/GAME-Build, Gesamt-Test-Suite, Browser-/Spiel-/Hörabnahme, Peak-Aufnahmen, neue Perf-Messung, blinder Bildkritiker.
- Keine Kauf-Binärdatei in dieser Rückgabe. Register erhält diesen Bericht und maschinenlesbare Metadaten/Testbelege; Spiel-/Asset-Branches bleiben unangetastet.
- Gemeinsame lokale Ablage: CLAUDE/KFB Combat Arena/_handover/COMBAT_VFX_R2_INVENTORY_2026-10-31/. Ausführbare Referenzkopien und Prüfskript liegen dort mit SOURCE_LOCK, damit ein frischer Chat reproduzieren kann.
- Nächster Gate: **WS0 nimmt Schritt 1 entgegen und gibt den nächsten benannten Schritt zurück.**
