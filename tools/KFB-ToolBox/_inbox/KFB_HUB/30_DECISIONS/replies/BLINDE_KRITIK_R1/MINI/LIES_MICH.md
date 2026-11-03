# Blinde Kritik R1 · V-1294 · WSB, 03.11.2026

Vier Kritiker, je ein frischer Agent. Jeder bekam nur das laufende Spiel und den Global Intent: keine Briefs, keine Vorgeschichte, kein Wissen voneinander. Keiner hat die Ergebnisse der anderen gelesen. Am Spiel und an `game/integration-r2` wurde nichts geändert.

| Ordner | Thema | Befunde | Vorschläge |
|---|---|---|---|
| `1_look/` | Look | 17 | 10 |
| `2_spiel/` | Spiel | 14 | 10 |
| `3_technik/` | Technik (Code @cb50ba6 nur gelesen, Messung auf dem Mac mini M4) | 10 | 9 |
| `4_kreativ/` | Kreativ / Metaerzählung | 15 | 10 |

Ein Standbild je Befund. Die Figur ist von vorn oder von der Seite zu sehen, nie von hinten (WSB hat jedes Bild geprüft). Die Bildschirmfotos sind als JPEG (Qualität 85) abgelegt; Diagramme und Tafeln bleiben PNG.

## So lief das Spiel

- **Stand:** `game/integration-r2` @cb50ba6.
- **Bau:** lokal auf dem Mac mini, `KFB_CARDPACK=1 npx vite build`. Ausgeliefert über `vite preview` auf 127.0.0.1:5300, mit den privaten Assets (Ton, HUD-Knetkit, Kartenpacks).
- **Grund:** Chromium auf dem Mini erreicht den Testfahrt-Server 192.168.178.106 nicht.
- **Adresse:** `#m1,harvest,look=terrain3,world=endless,veg=cartoon,hud=v6,sky=r1,stars=1,fx=r2,rec=1,kamera=r1,landefeder=1,place=r3,cardart=pack,gummi=1,travel=1,deckground=1,huelle=gen,hoehendunst=1,fahrt=r2,drift=r2,reliefschein=1,popups=clay,hudkit=clay,viertel=1,ladeplan=1`. Für Messungen kam `,debug` dazu.

**Wichtig für alle vier Protokolle:** Das war nicht der offizielle Testfahrt-Build. `scripts/ir2/testfahrt-build.sh` baut mit `KFB_SPLIT=1` und legt `h15` in den Build. Beides fehlte hier. Darum lud die Mindscape-Kuppel nach 25 s das ganze Spiel in einen versteckten Rahmen (Technik, Befund 1). Das erklärt Speicherwachstum und Ruckler am Start, auch in den Läufen von Look, Spiel und Kreativ.
- Die Schwäche im Code bleibt: Die Kuppel prüft nicht, was im Rahmen ankommt.
- Die 280-MB-Einzeldatei (Technik, Befund 2) kann im Split-Build anders aussehen.
