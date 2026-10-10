# G1 · Source-fidele KFB Claymation-Diorama-Bildserie · Style-Input-Routing R1
Stand: 2026-10-10 · Webchat G1 · **Referenzsuche abgeschlossen, keine neuen Bilder generiert**

## Ziel / Owner
KFB Island Worldbuilder Lab / MVP-1 G1 · Inselkörper und Fels. Hauptkörper bleiben vorhandene Modell-/Foto-Donoren, nicht frei erfundene Textgeometrie. Die Bildserie ist eine **visuelle Übersetzung** von echten Vorlagen in KFB-Material-/Licht-/Dioramen-Logik. Nicht Runtime, nicht Golden, nicht Ersatz-Lore.

### Quellhierarchie (binding router: `skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md`)
1. **FORM SOURCE (Identität/Silhouette):** Original StreakByte `LPFI_PortLand/Floting Base.fbx` für Town, alternativ `LPFL_BackyardLand/Backyard Base.fbx`; private Quelle `KFB Island Worldbuilder Lab/public/assets/streakbyte/Models/`. In source-only Ansichten zeigen, bevor adaptierte KFB-Bilder als "originaltreu" gewertet werden. Historische `orig__all.jpg` dient nur als Gruppen-Kontext; nicht als Einzelobjekt-Beweis. Für Town 40 MC.
2. **Binding KFB material/world geometry:** aktueller Clay Surface Canon, K2, §00 Weltlogik und §01 gerundete Erdscholle, Diorama Materialmix. Nicht fremde Bilder zu Regel-/Golden-Ownern machen.
3. **Curated benchmark:** `tools/KFB-ToolBox/_inbox/KFB_OPEN_WORLD_STYLEGUIDE_2026-10-07/`, besonders `00_referenzblatt`, `01_welt`, `03_knete`.
4. **Mood/Style/Material donor:** bestehende **Dropbox** Sammlung `/CLAUDE/KFB Card Zone Lab v2/KFB Style References/`; 8 Dateien live am 2026-10-10 gelistet und alle einzeln vorzeigbar. Versionsentsprechende Repo-Spiegel unter `tools/KFB-ToolBox/_inbox/KFB Style References/` (7 der 8 Bildnamen; ROCKOS nur in Dropbox gefunden). Bei Bildgeneratorübergabe Bild-Bytes aus der zugänglichen Quelle als echte Bildreferenz bereitstellen, nicht nur ihre Namen.

## Die acht gefundenen Dropbox-Bilder (nur Quellnamen, keine privaten Links/IDs)
| Originaldatei | Vorschlag für Rolle im ersten G1-Bild | Status |
|---|---|---|
| `Georgs Designs Midjourney 01 Bildschirmfoto 2026-09-22 um 04.51.56.png` | Georg-eigene KFB-Stilrichtung; zuerst Bildinhalt sichten | Quelle gefunden; Pixelinhalt durch Webchat noch nicht beurteilt |
| `KFB Cologne Race Option C Bildschirmfoto 2026-09-22 um 04.48.35.png` | KFB World/3D-Game-Anmutung und Gesamtpräsentation; nicht Town-Geometrie kopieren | Quelle gefunden; visuelle Beurteilung offen |
| `Card Zone Lab v2 Bildschirmfoto 2026-09-22 um 01.13.13.png` | ergänzende KFB-Illustrations-/Beleuchtungssprache | Quelle gefunden; visuelle Beurteilung offen |
| `Card Zone Lab v2 Bildschirmfoto 2026-09-22 um 01.15.21.png` | ergänzender Form-/Material-Vergleich | Quelle gefunden; visuelle Beurteilung offen |
| `ROCKOS MODERNES LEBEN ARCHITEKTUR CARTOON - […].jpeg` | Vergleich handgezeichneter/Cartoon-Architektur; Fremdquelle nicht literal kopieren | Quelle gefunden; visuelle Beurteilung offen |
| `VOXEL LOOK 01 Bildschirmfoto 2026-09-22 um 01.19.04.png` | Vergleich/Negativkontrolle gegen ungewolltes Raster/Voxel bei Insel-Scholle; erst Bild prüfen | Quelle gefunden |
| `TRIPLANAR TEXTURE SEAMLESS 01 Bildschirmfoto 2026-09-21 um 23.27.24.png` | Material/Textur-Übergänge als technische Vergleichsquelle; nicht gesamte Stilführung | Quelle gefunden |
| `wallace-gromit-wallace-gromit-auf-der-jagd-1_b-w-970.jpg.jpg` | Material-/Stop-Motion-Haptik als Mood; fremdes Figuren-/Szenendesign nicht übernehmen | Quelle gefunden |

**Nicht verwechseln:** Dies sind Stilquellen, **keine** StreakByte PortLand/Backyard Source-Isolationsbilder. Eine Preview-URL, Thumbnails oder Repo-Spiegel sind kein Nachweis, dass die Pixel als Konditionierungsbild einer Bildgenerierung tatsächlich eingespeist wurden.

## Sequenz der Webchat-Bildserie · keine Parallel-Generierung
- **Bild 1 / A / Town-PortLand:** genau ein nachweislich originalgetreuer 3/4-Diorama-Render einer einzelnen freigestellten Scholle. Bedingung: Bildgenerator erhält **wirklich** die isolierte PortLand-FORM-Vorlage plus eine kleine, visuell geprüfte Auswahl aus den acht STYLE-Bildern. Ursprung/Silhouette nicht aus reinen Prompt-Texten schätzen.
- **Bild 2:** Georgs gezieltes A-Tuning derselben Silhouette (nur benannte Änderungen), kein generisches alternatives Inselkonzept.
- **Bild 3+ erst nach akzeptiertem Anker:** front, side, below mit derselben Form/Licht-/Materialfamilie; danach Backyard oder Protopia.
- Pro Render nur das Einzelobjekt. Heller neutraler Studiogrund oder minimaler Anschlussboden. Keine Figuren, Tiere, Fahrzeuge, Gebäude, Schrift, Logos, Landschafts-Requisiten. Für schwebende Scholle immer dicke, organische, verwitterte Erdmasse; keine flache Tellerplatte, keine hängenden langen Würste, keine Kopier-Raster.
- Material Knetstein #e6d4b5 / #d1ba99 / #b29c7d / #9e856b, sparsam Gras/Fels, natürliche spürbare Handarbeit; wenn notwendig Kork/Pappe/Moos/Balsaholz als Materialmix. Keine ungefragten starken Clay-Deformationen über die KFB-Golden-Grenze hinaus.

## Render-Prompt R1 (English; for a generator with ACTUAL image references attached)
```text
TASK: Faithful visual material conversion of the ATTACHED ORIGINAL StreakByte PortLand floating-island base, not concept invention.
Preserve the original landmass geometry, overall silhouette, top outline, proportions and rock underside distribution. The source image is the authority for shape; do not add, remove or swap rock spurs. Use the attached verified KFB style references only for material, tactility, gentle hand-crafted surface irregularities, color role, lighting and stylized 3D game readability.

Produce one isolated three-quarter upper-front view of the entire single floating earth slab, centered and unobstructed against a clean warm-light neutral studio background. Make its geological body heavy, thick and contiguous under a gently rounded grass-and-earth rim. Warm painted claystone and earth, restrained grass-green top; sculpted stop-motion plasticine with subtle touch marks, uneven-but-purposeful edges, soft handmade transitions. Allowed complementary handmade materials: cork, felt moss, painted pebble, thin balsa for purposeful repairs only. Compact cartoon forms, solid readable silhouette, plausible in-game asset, soft directional studio light, informative natural shading, sufficient depth on the rock underside. Warm KFB material roles #e6d4b5 #d1ba99 #b29c7d #9e856b; avoid sterile CAD-perfect geometry.

STRICT SOURCE FIDELITY: No extra mini islands, platforms, buildings, roads, props, residents, vehicles, animals, typography, logo, symbols, framing devices, background world, pixel-art or voxel blocks; no detached underside noodles, no thin plate/lip, no generic pointy cone substitution, no repetitive identical rocks. The output must remain instantly recognizable as the attached exact original island donor. Only one rendered image, not a labeled storyboard or multi-image grid.
```

## Qualitätssicherung für Bild 1 (nicht durchgeführt)
- Referenz in *einer eigenen Ansicht* betrachtet; anhand Kontur/Unterseite eindeutig PortLand, nicht nur Datei/URL geladen;
- Bildgenerator hat tatsächliche Bilddaten als Form- und Stilreferenzen erhalten; prompt name alone genügt nicht;
- Kontur/Landmassenschwerpunkt, Anzahl/Gruppierung der Hauptvorsprünge, Eckprofil, Tiefe gegen Original verglichen;
- KFB-Diorama handgemacht, nicht Blender-CAD und nicht Papier-/Aquarell-Zwang für Partikel;
- G1 `picked` und `goldenRef` bleiben null/false bis Georgs konkrete Entscheidung.

## Aktueller Blocker / genau ein nächster Schritt
**Echte Bildreferenzen in den bildgenerierenden Webchat-Kontext übergeben und nur den ersten PortLand-Render erzeugen.** Der verbundene Dropbox-Connector liefert diesen Chat-Tools Datei-/Preview-URLs, aber **kein direktes Pixelinput für einen Bildgenerator**; deshalb wurden hier weder PortLand-Quellbilder noch KFB-Stilbilder als Konditionierung verwendet. Das zuvor vorbereitete lokale Source-Isolation-Runbook bleibt die präziseste Methode für die originalgetreue Geometrie-Basis. Kein neues Bild erfinden oder als donor-treu ausgeben, bevor die Quelle sichtbar ist.
