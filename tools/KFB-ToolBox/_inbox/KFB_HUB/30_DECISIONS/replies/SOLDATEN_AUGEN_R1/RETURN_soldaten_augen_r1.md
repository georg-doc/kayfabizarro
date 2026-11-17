# Soldaten-Augen R1 · Probe auf der Proof-Bühne · RETURN (WSB, 17.11.2026)

**Auftrag:** Georg im Chat bei WSB am 17.11., Wortlaut in `replies/WSB_KANAL/WSB_AN_WS0_2026-11-17.md` §7. WS0 hat bestätigt (Reihenfolge nach dem Würfelmonster-Abschluss).
**Ziel:** Plastik-Soldaten mit etwa doppelt so großen Augen, nur Oberlider, unter dem Helmrand im Anschnitt (grimmig), kein Auge durch den Helm, Schielen wie die KayKit-NPCs.

## Grundlage
- **Soldat:** `50_BLENDER/WSB_REIHE_R1/1_SOLDATEN/r2/glb/plastic_army_soldier.r5.glb` mit der Karte `plastic_army_soldier_gruen.figure.json`, wie im Spiel.
- **Augen wie im Spiel** (`src/world/arena/soldatAugen.js` @787a373b): `mountEyes` mit der Karte, Augen R2 (Ring 1,15, converge 0,45), Lid in der dunkleren Körperfarbe #47721c, lidFix.
- **Bühne:** Kopie der R1b-Bühne mit den Spiel-Augenmodulen (`stage/vendor_spiel/`).

## Probe (`stage/augen-probe.v1.js`, Treiber `scripts/augen.mjs`)
- **Stellgrößen:**
  - Größe × Faktor um die Augenmitte;
  - Augenmitte höher bzw. tiefer in den Kopf (Meter);
  - nur Oberlid (Unterlid ganz offen und ausgeblendet);
  - converge 0,45.
- **Helm-Gate:** Augen-Vertices gegen das geschlossene Helm-Netz `Helmet`, Grenze 2 mm. Gegenprobe: Die Augen 6 cm nach oben geschoben ergeben FAIL (1 718 Punkte, 0,4 cm tief); das Gate schlägt also an.

| Variante | Faktor | Verschiebung | Augenradius | Helm-Gate |
|---|---|---|---|---|
| heute (Spiel) | 1 | – | 1,4 cm | PASS |
| **A** | 1,8 | – | 2,5 cm | PASS |
| **B** | 1,8 | 1,2 cm höher, 0,6 cm tiefer in den Kopf (im Anschnitt unter dem Helmrand) | 2,5 cm | PASS |
| **C** | 1,9 | 0,8 cm höher, 0,5 cm tiefer, 0,2 cm zur Mitte (halb im Anschnitt) | 2,7 cm | PASS |

**Blatt:** `belege/SOLDATEN_AUGEN_R1_probe_v2.jpg` (Gesicht nah, dreiviertel und Seite je Variante).

## Einschätzung WSB
- **A** liest sich am klarsten, wirkt aber eher erstaunt als grimmig.
- **B** kommt Georgs „grimmig im Anschnitt“ am nächsten: Der Helmrand schneidet die Augen oben an, der Blick kommt böse unter dem Helm hervor.
- **C** liegt dazwischen.
- Ein Faktor 2,0 mit stärkerem Anschnitt verdeckte zu viel und wirkte schläfrig (Vorrunde, `data/augen_v1.json`).

## Für den Einbau (WS0)
- **Werte je Variante:** `data/augen_v2.json`.
- **„Nur Oberlid“** ist hier eine Bildprobe (Unterlid offen und ausgeblendet). Die Leistungsersparnis im Spiel bräuchte eine E2-Lidhaut ohne Unterlid; das ist Sache des Augen-Moduls.
- **Pose:** Gezeigt ist die Bindepose. Im Zielclip sitzt der Kopf anders; das Helm-Gate sollte im Spiel je Clip laufen.
