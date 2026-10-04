# GEORG-FEEDBACK · Fight Sandbox 02 · 2026-09-30 (nach dem Durchspielen von S15)

Urteil: **Als Basis-Set und Proof of Concept gut.** Der Nahkampf ist mit Cartoon-Kontakt machbar. Der Zweikampf läuft bei 20–30 fps flüssig (Georgs Eindruck, keine Messung). Offen sind Details, die unten stehen. In diesem Lauf ist nichts davon behoben, weil das hier ein Export ist und keine Reparatur.

## 1 · Befunde

| # | Befund (Georg) | Ursache (gemessen oder vermutet) | Weg |
|---|---|---|---|
| F1 | Komplexere Animationen brauchen Nacharbeit. Teils stehen die Kämpfer mit dem Rücken zueinander. | Vermutet: die „von hinten“-Reaktionen (fall_flat, shoved_spin, surprise_uppercut) drehen den Verteidiger beim Treffer absichtlich weg (`hitFrom: behind`). Hinzu kommen große Folge-Drehungen im Clip. Nicht pro Combo geprüft. | Im Detail durchgehen: Combo für Combo mit Georg, Urteil im Sandbox-Export |
| F2 | Der Hammer steckt oft im eigenen Körper. | Die Requisite hängt starr am `handslot.r`. `sword_and_shield_attack` ist für ein kurzes Schwert authored, der Hammerstiel ist länger. Arme und Requisite prüft keine Kollision; die Kapsel schließt die Arme bewusst aus. | **Feedback an Blender MCP**, siehe §2 |
| F3 | Brute: Der Ring ist zu klein, sie fliegen durch die Seile. | Ring 9 m (`data/fight-sandbox-02.json ring.acrossM`), unabhängig vom Rig. Ein Brute-Rückstoß wandert 1,4 m, die Trennung schiebt bis 3,5 m. | Ring nach Rig-Maßstab (× 2,568 → ca. 23 m) oder Anker näher zur Mitte. Später Wunsch: **Seil-Rückprall**, braucht eine Seil-Kollision |
| F4 | Die Staubwolken-Keilerei funktioniert noch nicht. Die Kämpfer laufen seitlich oder rückwärts aufeinander zu, die Wolke erscheint ohne Aktion, danach gehen sie auseinander, einer fällt, und sie sehen sich nicht an. | **Gemessener Widerspruch:** Der Katalog meldet für `boxing_a` `facingYawDeg` −33,1°. Aus den Kampfdaten ergibt sich −128,7° (Achse −101,6 + 180 − Deckung 207,1). Die Differenz von rund 95° dreht die Wolken-Kämpfer zur Seite. Die Wolke nutzt als einziges Stück den Katalogwert. Außerdem gibt es keinen Aufprall-Moment: Nach 0,9 s Anlauf wächst die Wolke ohne Hit-Stop und ohne Puff. | Blickrichtung aus den Kampfdaten ableiten (`startFacingYawDeg`) oder zur Laufzeit messen (Hüfte → Kopf, Vorwärtsachse). Zusammenprall-Beat vor der Wolke: Hit-Stop, Puff, dann wächst die Wolke aus dem Puff. Beim Auswurf muss A zum Fallenden schauen |
| F5 | Studio und Diorama: Liegende Figuren stecken zu tief im Boden, teils verschwinden sie. | **Gemessen (S15, skinned Vertices):** Raider `standing_death_left`-Ende minY −0,82 m, 52 % der Vertices unter dem Boden. `fall_flat`-Ende −0,51 m, 40 %. Brute 31 % / 62 %. Stehend 0,4 %. Die Library-Clips legen den Körper so tief, wie es das Mixamo-Maß verlangt. Die KayKit-Köpfe sind viel größer und liegen deshalb im Boden. | Boden-Lift nur für liegende Posen: pro Bild den Tiefpunkt weniger Probe-Vertices (Kopf, Becken) messen und bis auf eine erlaubte Einsinktiefe (z. B. 3 cm × Maßstab) anheben. Gleicher Weg wie der Fußkontakt im Friedhof. Oder in Blender je Rig korrigieren |
| F6 | fps 20–30, flüssig. | Unter dem 50-fps-Budget (Diorama). Für den Zweikampf von Georg als flüssig beurteilt. | Messung mit ⋯ → Leistung auf dem M1, zusammen mit OPEN_LATER |

## 2 · Feedback an den Blender-MCP-Chat (mitnehmen)

1. **Requisiten-Kollision:** Wie lassen sich Requisiten (Hammer, Pfanne, Schild) gegen den eigenen Körper prüfen? Vorschlag: je Requisite eine Kapsel aus ihrer Griff- und Spitzenlänge. Dazu je Clip die Bilder, in denen die Kapsel den eigenen Körper schneidet, gemessen im Bake. Als Daten wie `rigs.*.headSphere`.
2. **Eigene Körperteile:** Arm- und Beinkapseln je Rig, damit die Laufzeit Durchdringungen melden kann (nur melden, keine Physik). Heute schließt die Körperkapsel die Arme aus.
3. **Liegende Posen:** je Reaktion mit `endsLying` den tiefsten Vertex am Endbild und je Rig (Raider/Brute) einen Lift-Vorschlag.
4. **Blickrichtung:** `facingYawDeg` im Katalog und die Kampfdaten widersprechen sich bei `boxing_a` (−33,1° gegen −128,7°). Welche Konvention gilt?
5. **Prop-Schlag:** ein Clip oder ein Offset für längere Stiele. `sword_and_shield_attack` passt nur für kurze Klingen.

## 3 · Nicht-Ziele bleiben

Keine Physik, kein Ragdoll, keine Mesh-Kollision, kein IK, kein Retiming. Die Seil-Kollision (F3) wäre eine neue Entscheidung.
