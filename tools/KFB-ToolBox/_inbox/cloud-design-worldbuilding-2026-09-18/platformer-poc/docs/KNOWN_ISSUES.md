# Offene Punkte

Ehrlich, sortiert nach dem, was eine Integration zuerst treffen würde.

## Gameplay

1. **Manuelle Sprünge von 2×2-Plattformen** haben kaum Anlauf. Im Test 3/7 (siehe
   TEST_REPORT). Entweder Trittsteine auf 3×2 vergrößern oder dem Game Mode einen kleinen
   Sprungschub aus dem Stand geben. Bewusst NICHT einfach die Sprungkraft erhöht — das
   entwertet den Chill/Game-Unterschied.
2. **`freeroam → toolbox`** verlangt mehr Steighöhe (+2,6 bei 6,0 Lücke), als ein manueller
   Sprung hergibt. Braucht einen Trittstein oder einen zweiten Bouncer.
3. **Flow Hop** schlägt derzeit nur vor (Ring + Bogen bleiben nach der Landung stehen). Ein
   automatisches Weiterhüpfen ist bewusst nicht gebaut — das wäre Autoplay.
4. **Gegner** (Bee, Crab, Enemy, Skull) sind im Pack vorhanden, aber nicht platziert. Hazards
   beschränken sich auf Säge und Spikefalle.
5. **Goal_Flag** steht auf der Hub-Insel als Marke, ist aber kein Ziel mit Wirkung.
6. **Punch / Death** sind im Character-Pack vorhanden, aber nicht verdrahtet — Combat Arena
   bleibt Eigentümer der Kampfsemantik.

## Aktoren

7. **Legacy-Figuren sind unrigged** (0 Bones). Der Adapter meldet es, baut sie aber nicht
   zusammen. Der Zusammenbau existiert im Resident Atlas (`legacyAssemble`) und müsste bei
   einer Integration übernommen statt nachgebaut werden.
8. **Rig_Large** ist im Roster hinterlegt (Black Knight, Demon Lord), aber ungetestet.
   Skalierungsfaktor 1,12 ist gesetzt, nicht gemessen.
9. **EMOTE bindet bei KayKit-Aktoren auf `Interact`** — in den drei vorgeladenen Sets gibt es
   kein Winken. Ein späterer Ladepfad für `Special`/`Simulation` würde das lösen; heute wäre
   es unnötiger Vorabtraffic.
10. **`Jump_Full_Short` / `Jump_Full_Long`** sind absichtlich nicht in der Zustandskarte. Ob
    sie zur Sprungphysik passen, ist das offene Bewegungsexperiment aus dem Briefing.
11. Beim Graft wird `graft.report` nur als Notiz gezeigt, nicht gegen das Lab des Toolbox-
    Bündels verglichen. Die Zahlen-gegen-Zahlen-Probe aus EMBED §6 steht aus.

## Technik

12. **Kamera-Kollision** ist nicht gebaut (laut Briefing optional). Bei tiefem Pitch kann die
    Kamera in eine Plattform tauchen; der Höhenanschlag verhindert nur das Schlimmste.
13. **Kein Pause-Zustand.** Bei Tab-Wechsel drosselt der Browser `requestAnimationFrame`, die
    Simulation läuft langsamer statt anzuhalten — für einen POC egal, für eine Veröffentlichung
    nicht.
14. **Ladezeit** ~6–9 s kalt: 17 Plattformen bauen ihre Kacheln sequentiell. Parallelisieren
    (wie in `KayKit_Hex_Realm_S11`) wäre der nächste Schritt.
15. **Mobile/Touch**: es gibt keine Touch-Steuerung. Orbit per Zeiger funktioniert, Laufen und
    Springen nicht.
16. **Ton** ist synthetisiert (WebAudio-Blips), damit der Export keine Audio-Binärdateien
    trägt. Wenn KFB eine Audio-Bank beisteuern will, ist `fx.js` die einzige Stelle.

## Daten

17. **Portal-URLs sind Kandidaten** — nur `free-roam-drive` ist als veröffentlichte Route
    markiert. Die Abstimmung gehört dem Web Lead; nichts davon wurde abgerufen oder geprüft.
18. Der **Pack-Pfadindex** (`data/pack-index.json`) ist aus dem Registry-Shard erzeugt, Stand
    `eb48f50`. Wenn der Pack neu eingecheckt wird, muss er neu erzeugt werden (Rezept in
    `RECOVERY.md`).
19. Die Gleichsetzung `Platformer Game Kit - Dec 2021` = heutiges offizielles KayKit
    Platformer Pack bleibt **ungeklärt** und wird hier nirgends behauptet.
