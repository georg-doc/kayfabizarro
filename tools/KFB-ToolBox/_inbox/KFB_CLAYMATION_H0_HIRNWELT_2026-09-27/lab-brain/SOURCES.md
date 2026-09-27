# lab-brain · Quellen und Lizenzen

| Datei | Quelle | Lizenz | Bearbeitung |
|---|---|---|---|
| `brain-world.v1.bin` + `.json` | BodyParts3D 3.0, © The Database Center for Life Science (DBCLS). STL-Spiegel `github.com/Kevin-Mattheus-Moerman/BodyParts3D` @f0eeb6e84338 `assets/BodyParts3D_data/stl/` | CC BY-SA 2.1 Japan | 44 Netze (35 Großhirn-Gyri/Lappen, Kleinhirn, Pons, Medulla, Mesencephalon, Pedunculus, Hypothalamus, Chiasma). Achsen wie `lab-med` (x = links, y = kranial, z = anterior). Je Punkt einer gleichwinkligen Würfelkugel (6 × 161²) der äußerste Treffer vom Zentrum; 98,9 % getroffen, 1,1 % aus Nachbarn gefüllt. Abgeleitete Werke stehen unter derselben Lizenz. |
| Figuren | KayKit Mystery Series (Black Knight, Demon Lord, Monstrosity, Orc Brute = Rig_Large; Caveman, Farmers, Lorekeeper, Witch, Goth Girl, Clown, Ultra Turbo Hero Man, Toy Soldier, Cleric = Rig_Medium), Zuordnung aus `tools/resident_atlas_s6/data/cast.js` | KayKit-Lizenz | unverändert, Knet-Material, Maßstab 0,47 für alle (Large bleibt ≈ 2×) |
| Clips | `KayKit_Character_Animations_1.1/Animations/gltf/Rig_{Medium,Large}/…_{General,MovementBasic}.glb` | KayKit-Lizenz | Idle_A/Idle_B/Walking_A, Skalenspuren entfernt, Positionsspur nur an der Hüfte |
| Häuser, Autos, Laternen | KayKit City Builder Bits 1.0 | CC0 | Vorstufe `clay-soften.v1` |

Alle KayKit-Pfade @2ff8b350, byteweise geprüft (Status 200, Länge > 0).

**Lücke in der Quelle:** Gyrus frontalis inferior (Broca-Region), Gyrus lingualis und Cuneus gibt es in BodyParts3D 3.0 nicht als eigene Netze. Am unteren Stirnlappen liegt deshalb die Insula frei (Region 34/35 »Gyrus brevis accessorius«); die Regionen 32/33 (Insula) erreichen die Oberfläche nicht.
