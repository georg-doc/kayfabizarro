# WSA → WS0 · ToolBox-Konsolidierung / aktueller Stand R1 · 22.10.2026

**PAUSIERT DURCH GEORG.** Nur Dokumentation und Bestandssicherung. Keine weitere Umsetzung, kein neuer Export, kein Live, kein Merge, keine neue Figurenkonfiguration und kein automatisches Wiederaufnehmen.

## Auftrag und Anlass
Georg stimmt den Gesamtbestand und die verbindliche ToolBox-Quelle mit WS0 ab. Ihm fehlen im Studio weitere bereits konfigurierte Kit-Characters sowie Pencil und Eraser. Diese Meldung ist als Wiederherstellungs-/Konsolidierungsbedarf zu behandeln, nicht als neuer Figurenbauauftrag. Georg soll seine vorhandenen Einstellungen nicht erneut rekonstruieren müssen.

Begleitendes Postmortem: `WSA_TOOLBOX_REGRESSION_POSTMORTEM_2026-10-22.md`.

## Verbindlicher Ist-Stand
| Gegenstand | Befund |
| --- | --- |
| Produkt / Eigentümer | Bestehendes ToolBox-Studio, keine neue Werkstatt oder zweite Site |
| Site | `https://kfb-toolbox.frizzlebob.chatgpt.site/`, Projekt `appgprj_6ac2ba44282881919d1a49287a32054e` |
| Veröffentlichung | Sites-Metadaten beim Pause-Check: v11, updated_at 2026-10-17; keine Veröffentlichung aus R2/R3/Nahbildversuchen |
| P08-Konfiguration | `dist/data/kfb-pet-frizzlebob-earrig-v5.georg-2026-10-21.p08.json`; SHA-256 `8b7ac319a0ba9c4b9cdce5fddc738a35d85a8dc517b6f1f40585c378fc843ce9`, erneut lokal unverändert geprüft |
| Georgs FB-Werte | Rig-Augen, originale Brauen mit Tiefe −0,08 / Pitch 8; vorhandene Nase/Mund-/Körper-/Ohrenwerte sind Ausgangsdaten, keine Neugestaltungsfläche |
| FB-Basis | v5b ist ein Basis-Donor, keine allein lauffähige fertige Figur. Profil und vorhandene Face-/Rig-/Materialmodule gehören dazu |
| R2 / R3 | Beide visuell FAIL; R3-Hash `17e20ab4…` darf nicht kanonisiert werden |
| Technische Belege R3 | 1,81 m; 38 Clips / 2.554 Tracks gegenüber R2 unverändert. Keine Aussage über visuelle Freigabe |
| Letzte Quellen-Sicherung | Managed-Sites-Branch `wsa/fb-canon-r3-2026-10-22` @ `afb97250a49dcc5dc0ea1ab1a82d332143b0fe6d`; dieser Stand ist kein akzeptierter Figurenstand |
| Jüngste lokale Versuche | Lokaler Branch `wsa/fb-face-preview-r4-2026-10-22`, Basis afb97250…, uncommitted / unpushed / unfreigegeben; kein neuer GLB, keine fertig gespeicherte Nahbildreihe |
| Pause | Eigener Browser-Prüftab geschlossen, eigener Prüfserver beendet; Umsetzung bleibt pausiert |
| Figurenkarte / Ohren | Kein R2/R3-Hash in der kanonischen Karte; Ohrreduktion nicht begonnen |

## Tatsächliche Auswahlquellen im lokalen ToolBox-Checkout
`dist/index.html` enthält:
- feste Einträge: FrizzleBob Driver Graft, FrizzleBob Ear Rig v5, Hunky r4, Dory r4, Orc Brute und Warband Orc;
- 24 Cube Pets;
- zusätzliche Einträge Norman und Brain-Cyborg in `_roster()`;
- dynamische Residents ausschließlich aus `tools/resident_atlas/scenes/index.json` am alten Pin `8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e`. Dieser geprüfte Index enthält nur Cave Camp mit Caveman als Actor.

`dist/data/figure-cards/` bündelt nur vier Karten: lord_hunky, lady_dory, norman und brain_cyborg. Der aktuelle Datenadapter `figure-card-data.v1.js` kennt ebenfalls nur diese vier IDs. Andere feste Einträge nutzen weitere Ladepfade. Der Studio-Bestand ist damit **keine vollständige Projektion des Figurenkartenbestands**.

Diese Befunde stammen aus dem lokalen Quellstand auf Basis afb97250…, nicht aus einem vollständigen Browser-Test aller Figuren der veröffentlichten v11. Aus einer Dateisuche folgt nicht, dass Georgs Konfigurationen gelöscht wurden.

## Registerkarten versus Studio-Routen
Register-Snapshot: `00bce086c5426cbe68f074a92f6dbdd028c0701a`, Ordner `replies/FIGURES_R1/figures/`. 13 Karten einzeln gelesen. Ihre vorhandenen Freigaben und offenen Punkte sind zu erhalten; Einbindung ist nicht gleich neue Designfreigabe.

| Karten-ID | Aktueller lokaler Studio-Anschluss |
| --- | --- |
| frizzlebob | Zwei feste FB-Routen + P08-Import, nicht über den vier-ID-Kartenadapter; bekannte Quellen müssen zusammengeführt werden |
| lord_hunky | Fester r4-Eintrag und gebündelte Karte; aktuelle Quellen-/Freigabeparität noch zu konsolidieren |
| lady_dory | Fester r4-Eintrag und gebündelte Karte; aktuelle Quellen-/Freigabeparität noch zu konsolidieren |
| norman | Eigene Kartenroute; bisheriger Georg-Auftrag Source only bleibt, keine neue Freigabe abgeleitet |
| brain_cyborg | Sichtbarer Pending-Eintrag / B10; aktueller Lieferstand muss von WS0 zugeordnet werden, kein Ersatz |
| orc_brute | Fester KayKit-Eintrag vorhanden; nicht über den aktuellen Kartenadapter geladen |
| black_knight | Registerkarte vorhanden, kein ausdrücklicher Eintrag im untersuchten lokalen Roster |
| demon_lord | Registerkarte vorhanden, kein ausdrücklicher Eintrag im untersuchten lokalen Roster |
| gothgirl | Registerkarte vorhanden, kein ausdrücklicher Eintrag im untersuchten lokalen Roster |
| monstrosity | Registerkarte vorhanden, kein ausdrücklicher Eintrag im untersuchten lokalen Roster |
| mummy_a | Registerkarte vorhanden, kein ausdrücklicher Eintrag im untersuchten lokalen Roster |
| mummy_b | Registerkarte vorhanden, kein ausdrücklicher Eintrag im untersuchten lokalen Roster |
| witch | Registerkarte vorhanden, kein ausdrücklicher Eintrag im untersuchten lokalen Roster |

Dies ist ein belegter Mindestbestand, **nicht** die vollständige Liste aller jemals konfigurierten Kit-Characters. Die darüber hinausgehenden Bestände und gespeicherten Profile müssen abgeglichen werden.

## Pencil und Eraser
- **Georgs aktuelle Angabe:** Beide waren bereits als Figuren konfiguriert und sollen im Studio verfügbar sein. Das ist die maßgebliche Wiederherstellungsanforderung.
- **Pencil:** Historischer `kfb-hub/stage/toolbox/kaykit-character-compat-v0/SOURCE_MATRIX.json` nennt `pencil-a-long`, VERIFIED_SOURCE, `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_A_long.gltf`. Auch die Arbeitskarte vom 04.10. führt Pencil als vorhandenen isolierten Donor. Die aktuelle lokale Studio-Liste enthält keinen Pencil-Eintrag. Das beweist eine fehlende Zuordnung, nicht das Fehlen des Assets oder der späteren Abstimmung.
- **Eraser:** Dieselbe ältere Matrix nennt `rubber-eraser` noch SOURCE_REQUIRED. Dieser historische Stand beweist ausdrücklich **nicht**, dass es Georgs später konfigurierte Fassung nicht gibt. Im untersuchten aktuellen lokalen Roster/Kartenadapter fehlt eine Eraser-Zuordnung. Die spätere Konfigurationsquelle ist wiederzufinden, nicht durch Ersatzgeometrie zu ersetzen.
- Keine neuen Pencil-/Eraser-Modelle, keine erfundenen Einstellungen und keine Rückstufung von Georgs Aussage auf Basis alter Matrixdaten.

## Offene Abgleiche für eine echte SSOT
Vorschlag zur Abstimmung, **noch keine implementierte neue Datenarchitektur**:
1. Ein verbindliches Bestandsverzeichnis im bestehenden ToolBox-/Figurenkarten-Owner: stabile Figuren-ID → genaue vorhandene Karte/Konfiguration → Modell/Hash → Rig-/Face-/E2-/Mund-/Clay-/Licht-Owner → Georg-Freigaben. Bestehende Register und Schemas weiterverwenden; keine zweite Figurenverwaltung.
2. Zu jeder vorhandenen Figur festhalten: welche Quelle ist maßgeblich, welche browserlokale Abstimmung existiert, welche publizierte Fassung zeigt sie tatsächlich? Konflikte sichtbar bewahren, nichts mit Defaults überschreiben.
3. Karten, P08-/Legacy-Rezepte und frühere Werkstätten zuerst als vorhandene Quellen kartieren. Für Pencil/Eraser und weitere Kit-Characters die zuletzt konfigurierte Fassung übernehmen; keinen Neuaufbau aus alten Rohmodellen.
4. Studio-Auswahl und Dramatis Personae sollen dieselben IDs und referenzierten Dateien lesen. Appearance bleibt im bestehenden ToolBox-Studio; Inhalt bleibt im bestehenden Asset-Library-Tab. Keine neue Site.
5. Karten-/Bestands-Parität als eigene Prüfung: Ein erwarteter konfigurierter Actor darf nicht still aus dem Dropdown verschwinden. Ungeklärte Zuordnungen sichtbar melden, nicht durch einen kleineren Bestand als erledigt erklären.
6. Erst nach Georg/WS0-Abgleich den kleinsten Wiederherstellungsauftrag festlegen. Material-/Modulwechsel müssen vorhandene Gesichts- und Mundwerte erhalten; ein echtes vollständiges Nahbild ist Voraussetzung vor einem weiteren Export.

## Gesicherter lokaler Zwischenstand
Arbeitsordner: `work/toolbox-consolidation-paused-2026-10-22/` im gemeinsamen KFB-Hub-Workspace.
- `PAUSED_STATE.json`;
- `R4_UNREVIEWED_TRACKED_CHANGES.patch`;
- vollständige Kopien der vier unfreigegebenen Dateien unter `unreviewed-source/`: index.html, body-surface.v2.js, pet-mouth.v1.js und der lokale face-appearance-preview.v1.js-Adapter.

Der Versuch enthält auch den nicht mehr fertig geprüften optionalen Mouth-Grid-Parameter und Anpassungen am Mundträger. **Nicht übernehmen, nicht deployen, nicht als neue Quelle nutzen.** Dass dieser Umweg bereits begonnen wurde, wird nicht als erfolgreiche Wiederherstellung dargestellt. Originale Quellen und Fehlbelege bleiben erhalten.

## Kommunikation / nächster Schritt
Letzter erneuter WS0-Check auf Register-Snapshot 00bce086… und in der lokalen WS0-Datei: letzte einschlägige Antwort weiterhin V-669; keine neuere Antwort auf R3-FAIL nachgewiesen. Keine Behauptung über ungelesene andere Kanäle.

**Nächste Autorität: Georg stimmt mit WS0 Bestand und Quelle ab.** Bis zu einer ausdrücklichen Wiederaufnahme bleibt die Implementierung pausiert. WSA hat keine neue Figuren-SSOT als bereits umgesetzt oder akzeptiert deklariert.
