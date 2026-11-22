# Meshy MCP · Werkzeug-Workflow R1 (WS0, 23.11.2026, V-2099)

**Absicht:** Fehlende 3D-Modelle erzeugt WSB (Mac mini, Blender MCP) direkt über Georgs Meshy-Konto. Georg schreibt keine Prompts mehr und lädt nichts mehr hin und her.

## Entscheidung: Meshy jetzt, Tripo nicht
| | Meshy MCP (offiziell) | Tripo MCP |
|---|---|---|
| Paket | `@meshy-ai/meshy-mcp-server` (npm, MIT, meshy-dev) | `tripo-mcp` (uvx, MIT) |
| Reife | 28 Werkzeuge, Anleitung aktualisiert 04.11.2026 | „alpha“, nur über Tripo-Blender-Addon |
| Erzeugen | Text→3D (+Refine), Bild→3D, mehrere Bilder→3D | Text→3D, Import nach Blender |
| Nachbearbeitung | Remesh / Smart Topology (Polygonziel), Retexture, UV, Resize, Convert | – |
| Rig/Animation | rig, animate, text_to_motion, list_animations | nicht genannt |
| Dateien | `meshy_download_model` speichert lokal (`meshy_output/` oder `save_to`) | Import direkt in Blender |
| Konto | API ab Pro-Plan; gleiche Credits wie im Abo | API-Key-Handhabung nicht dokumentiert |
| Kosten (README, nicht offizielle Preisliste) | Mesh 20, Textur 2K/4K +10, Remesh 5, Rig 5, Animation 3/Aktion, Convert 1 | – |

Georg hat ein bezahltes Meshy-Konto. Meshy deckt alles ab, Tripo bietet nichts zusätzlich. **Ein Wechsel zu Tripo ist nicht nötig.** Erneut prüfen nur, wenn Meshy in der Praxis an Qualität oder Topologie scheitert.

## Wo es läuft: WSB (Mac mini)
- WSB hat Blender, die Blender MCP und die Ablieferung per Bundle. Meshy MCP läuft dort im selben Client: erzeugen, laden, in Blender aufbereiten, als Bundle liefern.
- Andere Sitzungen bestellen bei WSB über den WSB-Kanal und erzeugen nicht selbst.

## Einrichtung (einmalig)
1. **Georg:** Im Meshy-Konto unter API Keys einen Schlüssel anlegen (beginnt mit `msy_`). In der App Schlüsselbundverwaltung auf dem Mac mini ein neues Passwort anlegen: Name `kfb-meshy`, Account `kfb`, Passwort = der Schlüssel. Niemand sonst sieht oder tippt den Schlüssel.
2. **WSB:** Ein Startskript liest den Schlüssel aus dem Schlüsselbund und startet den Server, ohne ihn auszugeben oder in eine Konfigurationsdatei zu schreiben:
   ```
   #!/bin/zsh
   export MESHY_API_KEY="$(security find-generic-password -s kfb-meshy -a kfb -w)"
   exec npx -y @meshy-ai/meshy-mcp-server
   ```
   Danach `claude mcp add -s user meshy -- /pfad/meshy_mcp.sh` (kein `--env` mit Klartext).
3. **WSB:** Probelauf `meshy_check_balance`, dann ein kleines Testobjekt (meshy-6-lite, 5 Credits).

## Ablauf je Auftrag (SOP §2)
1. **Bestand zuerst:** Asset-Librarian, 3D-Suche, patch.gg, KayKit/Kenney. Meshy nur, wenn dort nichts passt (Such-Protokoll in den Auftrag).
2. **Absicht und Ziel:** ein Satz, wofür das Modell gebraucht wird, dazu Referenzbild oder Bildvorlage. Bild→3D vor Text→3D, wenn ein Bild existiert.
3. **Erzeugen:** Formate beim Anlegen festlegen (GLB). Mit Smart Topology und Polygonziel je Klasse (Requisit klein ≤ 5k, Figur ≤ 15k). `meshy_check_balance` vor und nach dem Auftrag, Credits im Return.
4. **In Blender aufbereiten:** Maßstab in Metern, Ursprung am Boden, KFB-Clay und das eine Licht-Rig, Anker nach Klassen-Standard (z. B. Waffen-Standard R1). Figuren: KFB-Augen über den Augen-Pfad, Bewegung aus vorhandenen Clips (Motion Library, Mixamo). Meshy-Rig und Meshy-Animation nur, wo kein vorhandener Clip passt.
5. **Prüfen:** Proof-Bühne mit Clay, Augen und Gates; Handwerks-Gates (keine offenen Kanten, keine Löcher, Maßstab). Danach still gegen das Ziel, höchstens 5 Runden.
6. **Liefern:** Bundle nur mit Zugängen, Vergleichsbild, Credits, Meshy-Task-IDs. WS0 führt mit `merge_additions.py` zusammen.

## Grenzen
- Kein Schlüssel in Code, Log, Chat, Konfiguration. Nur über den Schlüsselbund.
- Kanonfiguren (FrizzleBob, Hunky, Dory, Cast mit Figurenkarte) werden nicht neu erzeugt. Meshy ist für Requisiten, fehlende Nebenfiguren, Gegner und Teile.
- Über MCP erzeugte Modelle erscheinen nicht im Meshy-Webarbeitsbereich. Die Task-IDs im Return sind der Nachweis.

Quellen: meshy.ai/tutorials/meshy-mcp-guide · github.com/meshy-dev/meshy-mcp-server · docs.meshy.ai/api/ai · meshy.ai/tutorials/blender-mcp-guide · github.com/Tripo-Developer/tripo-mcp
