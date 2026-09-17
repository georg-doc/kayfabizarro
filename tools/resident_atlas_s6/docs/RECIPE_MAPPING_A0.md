# RECIPE_MAPPING_A0 · Atlas-Rezepte auf die fünf A0-Konzepte

**Vorbehalt vorweg:** `KFB_ASSEMBLY_CONTRACT_A0_2026-09-17.md` liegt im Quell-Repo und war aus dieser Umgebung nicht lesbar. Dieses Mapping ist deshalb aus den fünf im Exportauftrag genannten Begriffen abgeleitet, nicht gegen den Contract-Text geprüft. Wo die Semantik unklar ist, steht das als Lücke — es sind keine Pflichtfelder erfunden und der zentrale Contract ist nicht geändert.

| A0-Konzept | Atlas-Entsprechung | Belegt | Lücke |
|---|---|---|---|
| `AssetRef` | `entry.a` (Repo-Pfad) + `entry.commit` (Revision) + `measured`-Eintrag (Maße, Bones, Clips) | ja | Kein `sourceBlobSha` und kein `sha256` — dieses Projekt besitzt die Bytes nicht. Identität hängt an Pfad+Commit, nicht am Hash. |
| `TransformSlot` | `entry.p [x,z]`, `y`, `float`, `r`/`rx`/`rz`, `s`, plus die Befestigungsform: `hand:{of,bone,…}`, `on:<id>`, `sitOn`, `hold:{of,…}` | ja | Der Atlas kennt **elf** Befestigungsvarianten. Ob A0 einen Slot-Typ oder eine Slot-Familie erwartet, ist nicht belegt. Die Regel-Hierarchie (Identität → Achsen-Zuordnung → Weltrichtung) müsste im Contract abbildbar sein, sonst geht die Begründung verloren. |
| `Surface` | `on:<id>` stapelt auf die **gemessene** Oberkante des Basisobjekts; `sitOn` richtet am Hüft-Bone gegen die gemessene Sitzfläche aus; Boden ist y=0 | teilweise | Der Atlas misst Oberkanten, benennt sie aber nicht als adressierbare Flächen. Eine echte `Surface`-ID (z. B. „Tischplatte") existiert nicht — nur „oben auf diesem Objekt". |
| `Connector` | **fehlt.** Die benannten `handslot.l`/`handslot.r`-Bones sind die einzigen echten Anschlusspunkte, und sie sind Rig-Eigenschaft, nicht Rezept-Eigenschaft. | nein | Dies ist die größte Lücke. Der Atlas hat keine Kanten-/Anschluss-Grammatik; er braucht sie für Vignetten auch nicht. Für Travel-Hexagon-Adjazenz wäre sie nötig — das ist World Atlas, nicht dieses Projekt. |
| `RecipeEnvelope` | Ein Resident-Objekt in `data/cast.js`: `residentId`, `pack`, `status: candidate-only`, `reference`, `keyArt`, `actor`, `habitat[]`, `signatureProps[]`, `notes[]`, `open[]` | ja | `notes`/`open` sind Freitext, kein Schema. Sie tragen die Beweisführung — wenn A0 sie nicht aufnimmt, verliert das Rezept seine Begründung und behält nur die Zahlen. |

## Was der Atlas zusätzlich führt und A0 vermutlich nicht kennt

- **Slot-Rollen 1–6** (Identität, Aktivität, Zuhause, Sozial, Lore, Eigenheit) als erzählerische Kategorie über der Geometrie.
- **Pose-Herkunft**: `rig`, `rigFamily`, `pose` (Regex), `poseTime`, `poseFreeze`, `layer`, `animLib` — plus die gemessene Bindungsquote. Eine geladene Figur beweist keine Retarget-Sicherheit; das ist im Atlas Datum, nicht Kommentar.
- **Bewusste Abweichungen** als `scaleNote` pro Eintrag (z. B. „exakt 2× die Pack-Variante, keine Atlas-Skalierung").

Für generierte Geometrie sind keine fiktiven Quell-Assets angelegt — der Atlas generiert keine Geometrie.