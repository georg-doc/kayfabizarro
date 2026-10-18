# BRIEF · WS1-Übernahme auf Georgs MacBook (WS1b) · R1 · 2026-10-18 · WS0
**Register:** V-539. **Grund:** Die alte WS1 läuft im Workspace-Konto ohne Dropbox-Connector und ohne gesicherten Zugriff auf die privaten Assets. Die neue WS1b läuft unter Georgs Konto auf dem MacBook, mit Dropbox direkt im Dateisystem.

**Tier 0**
1. Lies zuerst `WS1_HANDOVER.md` (Branch `ws1/r3f-frame`, von der alten WS1). Mach dann genau dort weiter, nichts neu erfinden.
2. Rollen bleiben: WS1 = Spiel (R3F-Rahmen, Integration, Vorschau). WS0 steuert (Register, Hub), WSB baut Assets, WSA baut Module.
3. Regeln wie bisher. Dazu kommen hier ein paar zusätzliche (siehe unten), vor allem: `KFB Open World/` nie anfassen und keine fremden Ports.

## Block
**Einrichtung (einmalig)**
- **Repo:** Arbeits-Repo ist `kfb-planet`, geklont aus dem Übergabe-Bündel nach `~/Developer/kfb-planet` (Branch `combo/r2` @d762916). Veröffentlicht wird über die `ws1/*`-Branches im Repo `kayfabizarro`; dafür hast du einen eigenen Git-Worktree, den die App angelegt hat. Den Hauptordner `~/Developer/kayfabizarro-publish` (Branch `cloudflare-live`, gehört WS0) nicht umschalten oder ändern.
- **Steuerung:** WS0 hat dich gestartet, reviewt und steuert dich (Nachrichten von WS0 kommen als Session-Nachricht). Melde jeden Abschnitt kurz an WS0 und in WS1_STATUS.
- **Übergabe abwarten:** Falls `WS1_HANDOVER.md` auf `ws1/r3f-frame` noch fehlt, prüfe zuerst nur lesend die Branches (`combo/r2`, `ws1/combo-r2`, `ws1/vendor`) und melde den Stand an WS0. Nichts überschreiben, was die alte WS1 noch pushen könnte.
- **Branches:**
  - Arbeitsstand von `combo/r2` holen; die alte WS1 pusht den vor der Übergabe.
  - Veröffentlichung wie gehabt auf `ws1/combo-r2`, `ws1/preview` und `ws1/vendor`.
  - Status weiter in `WS1_STATUS.md` auf `ws1/r3f-frame`, ab §95 mit dem Zusatz „WS1b“.
- **Ports:**
  - Nie 5180 (gesperrt), nie 5192 (Lab, nicht beenden), nie 5000 (macOS AirPlay), nie 8765.
  - Eigenen Port wählen und in WS1_STATUS nennen.
  - Nur eigene Prozesse beenden.
- **Private Assets:**
  - direkt aus Dropbox lesen (`~/Dropbox/CLAUDE/KFB_HUB/50_BLENDER/*/_privat_*`, `MeshyModels/…`);
  - oder aus dem privaten Repo `georg-doc/kayfabizarro-private-assets` (V-538, Manifest `replies/PRIVATE_ASSETS_FOR_WS1.r1.json`, sha256 prüfen).
  - Nie in öffentliche Branches; im Build nur eingebettet.
- **Kanal:**
  - Steuerung liest und schreibt wie bisher `replies/WS0_TO_WS1.md` (neueste oben) und `WS1_STATUS.md`.
  - Zusätzlich kann WS0 dir direkt Nachrichten schicken (gleiche Maschine).

**Erste Aufgaben (Reihenfolge)**
1. Übergabe prüfen: Tests grün auf deinem Stand? Vorschau lokal startbar? Ergebnis als §95 in WS1_STATUS.
2. §94 abschließen, also die Veröffentlichung R1a + Saugarm + Laternen + `kfb-fluff-suck.v1`, falls die alte WS1 sie nicht mehr geschafft hat.
3. Bildrate auf Georgs GPU (sichtbares Browserfenster). **Aber:** Georg sieht den Bereich live. Keine Experimente vor seinen Augen, nur geprüfte Stände zeigen.
4. V-514 Flug + Zerstörung R1 (`replies/BRIEF_WS1_FLIGHT_DESTRUCTION_R1.md`), mit einem Modul für Entstehen und Vergehen (V-533/V-535) und Waffen-Achse nach V-536.
5. B39 r2 `roof_swallow` (V-534) mit dem Cartoon-Deformer einbauen.

**Pflichtlektüre:** die oberste Hälfte von `replies/WS0_TO_WS1.md`, `START_HERE_STEERING.md`, `KFB_WORKING_RULES_R1.md`, die QA-Liste V-520 und die Regeln V-385 (Licht), V-403 (Speckle), V-536 (Waffen-Achse).
