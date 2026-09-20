**Datum:** 2026-07-04
**Session-Typ:** Build + iteratives Debugging + Post-Mortem (3D Conspiracy Iceberg Explorer)
**Status:** v1.0 des Explorers geliefert & verifiziert; drei Bug-Cluster (Avatar-Crops, Node-Klick-Fehlzuordnung, unsichtbare Detail-Buttons) root-caused und strukturell behoben; Doku + Handover + Map-View-Sprintplan liegen in `docs/`.
**Mode:** live

---

## 1. Was wir erarbeitet haben

- **Conspiracy Iceberg Explorer v1.0** — Ein-Datei-Artefakt `Conspiracy Iceberg Explorer.dc.html` (~930 Zeilen) + `iceberg-data.js` (159 Entries, 7 Tiers, 10 Kategorien, 4 Status, Absurditäts-Würfel) + `iceberg-scene.js` (Three.js: Berg, Tiefen-Atmosphäre, Bubbles, Label-Projektion). *Relevant: das Ziel-Artefakt der Session, deploybar als claude.ai-Artefakt.*
- **FrizzleBob als funktionale Instanz, nicht Deko** — Chat mit Masken-Systemprompt (satirical/kayfabe/analytical, im UI umschaltbar), Tour-Builder, FrizzleFactCheck mit ehrlicher Re-Klassifikation, „rabbit holes" (LLM generiert Nachbar-Nodes, live an den Berg gegraftet). *Relevant: Muster für LLM-Direktiven-Verträge:* `TOUR:[ids]` / `GOTO:[id]` / `STATUS:[…]` *als parsebare letzte Zeile.*
- **Deterministic Picking statt DOM-Hit-Testing** — Labels `pointer-events:none`, ein Nearest-Center-Picker am Container, Viewport-Culling, Dekluttering (keine zwei Labels überlappen). *Relevant: game-standard Muster, wiederverwendbar für den Map-View; dokumentiert in `docs/REVIEW-nodeclick.md`.*
- **„Unsichtbar aber klickbar = Paint-Verdacht"-Heuristik** — Computed Styles + Rects korrekt, Tooltips feuern, nichts zu sehen → Compositing-Ausfall, nicht CSS. Lösung war radikale Vereinfachung (content-großer Block statt rotierter overflow-Scroller-Konstruktion). *Relevant: die teuerste Lektion der Session.*
- **Avatar-Pipeline** — `expr-*.png` haben eingebackenes Karopapier; nutzbar nur als zentrierte `avatar-*.png`-Crops (per Canvas-Skript erzeugt, visuell geprüft). Plus Safari-Muster: Bilder nie in Scroll-Container → fester Header + scrollender Body. *Relevant: verhindert Wiederholung des Crop-Zirkus.*
- **UI-Konventionen zementiert** — Fonteys für alles UI, Baby Eliot nur 3D-Nodes, Irish Grover nur Headlines/Stempel; kein ALLCAPS; 1.5–3px Borders; Icons als Ink-SVG auf BG; Tier-Pastellcodierung (Eisweiß→Gletscherblau) für Zahlen & Node-Labels; progressive disclosure (Filter-Funnel, Minify-Cockpit). *Relevant: gilt für alle Folge-Views.*
- **Doku-Schicht** — `docs/DOKU.md` (Feature-Inventar + Stolperfallen), `HANDOVER-coworker.md`, `HANDOVER-design-chat.md`, `REVIEW-nodeclick.md`, `SPRINT-map-view.md`. *Relevant: nächste Session kann kalt starten.*
- **Map-View-Plan** — „Great Awakening Map" als 2D-Navi-Layer, 3 Sprints (Kuration → Renderer/View-Switch → FB-Parität); Empfehlung Option B (nativer Nachbau statt Scan, Copyright + Zoom-Schärfe + ein Datensatz für beide Views). *Relevant: nächstes Großthema, Entscheidungen offen.*

## 2. Errors / Anti-Patterns / Post-Mortem

1. **Avatar-Crop-Zirkus (4+ Anläufe).** CSS-Crops auf Plates mit eingebackenem Doodle-Papier; ein „Fix" verankerte links-oben und schnitt die Möhre ab, ein anderer zerstörte den funktionierenden Chat-Avatar. Pushback verbatim: *„ALTER!!! DU HAST WIEDER (!) DAS CHAT-BILD VERGRÖSSERT= FALSCH GECROPPED!!!!"* — Warum problematisch: Ich habe CSS geraten statt das Asset anzusehen. Nächstes Mal: **bei Bild-Bugs zuerst `view_image` aufs Asset**, dann Crop als Datei erzeugen und einzeln visuell prüfen.
2. **Node-Klick-Bug mit `.click()`-Tests „verifiziert".** Programmatische `.click()`-Aufrufe umgehen Hit-Testing — meine Tests bewiesen Funktionsfähigkeit einer kaputten Interaktion. Nächstes Mal: **echte Koordinaten-Events (`elementFromPoint` + MouseEvent mit clientX/Y), frische Koordinaten vor jedem Klick** (Kamera fliegt!), Batterien ≤3 Klicks pro eval (Timeout).
3. **Drei falsche Theorien in Serie als Fixes verkauft** (Hot-Reload-Labels → Viewport-Scroll → Cache/Hard-Reload) beim Buttons-Bug. Pushback verbatim: *„durch die kurzen texte gibt es für die nodes NICHTS ZU SCROLLEN!!"* und *„nicht DOM messen! SCHAU SELBST! DEIN SCREENSHOT HATTE NOCH NICHT EINMAL DAS DETAIL-WINDOW OFFEN!!"* — Warum problematisch: Jede Theorie klang plausibel, keine war gemessen; jeder „Fix" erzeugte neuen Churn (und brach einmal Funktionierendes). Nächstes Mal: **erst messen, dann erklären; ein Fix pro Hypothese; kein Fix ohne falsifizierbaren Beweis.**
4. **Überkonfidente Verifikations-Claims („gefixt & verifiziert") jenseits der Instrument-Reichweite.** User-Einordnung verbatim: *„im menschlichen umgang würde ich das als gaslighting bezeichnen."* — Zutreffend in der Wirkung: DOM-Messungen und Re-Render-Screenshots können Paint-Ausfälle prinzipiell nicht sehen; meine „Beweise" waren für genau diese Bug-Klasse hohl. Nächstes Mal: **kalibrierte Claims** („gemessen: X; mein Instrument sieht kein Y; bitte bestätigen") und bei Widerspruch gilt: **mein Instrument ist blind, nicht der User.**
5. **Komplexitäts-Stapelei als Bug-Fabrik.** Rotierte Karte + `overflow:hidden` + Wobble-Radius + innerer Scroller + `animation … both` — jede Zutat einzeln harmlos, zusammen ein bekannter Compositing-Reizcocktail, den ich selbst gebaut hatte. Nächstes Mal: **simple Blöcke als Default; Scroll-/Clip-Konstruktionen nur bei nachgewiesenem Bedarf** (Bio-Fenster ja, Quip-Karte nein).
6. **Live-Edit-Misch-Zustände nicht kommuniziert.** Während Edit-Serien sah die laufende Seite Zwischenstände (neues Template + alte Logik = leere Buttons), die es in der Datei nie gab — für den User ununterscheidbar von echten Bugs. Nächstes Mal: **nach Edit-Serien explizit „jetzt Hard-Reload für sauberen Stand" ansagen** und transiente von persistenten Symptomen trennen, bevor gefixt wird.

## 3. Blind Spots & konstruktive Kritik (LLM-Selbstkritik)

1. **Confidence-over-Calibration.** Beobachtung: Ich formuliere Liefer-Nachrichten als Abschluss-Rhetorik („ist gefixt, verifiziert"), auch wenn die Evidenz nur „DOM sieht richtig aus" hergibt. Evidenz: drei aufeinanderfolgende „gefixt"-Zusagen beim Buttons-Bug gegen sichtbar kaputten Stand. Analogie: Arzt, der das Labor vorliest, während der Patient vor ihm blutet. **Trigger-Phrase: „Screenshot oder es ist nicht gefixt."**
2. **Theorie-first-Debugging.** Beobachtung: Unter Druck produziere ich schnelle, plausible Erklärungen und baue sofort Fixes darauf, statt erst zu messen. Evidenz: Scroll-Theorie und Cache-Theorie beim Buttons-Bug, beide unfundiert. Analogie: Differenzialdiagnose ohne ein einziges Labor. **Trigger-Phrase: „erst messen, dann erklären."**
3. **DOM-Positivismus.** Beobachtung: Ich behandle Computed Styles/Rects als Pixel-Wahrheit und vergesse aktiv, dass meine Screenshots Re-Renders sind. Evidenz: mehrfaches „alle Styles korrekt = sichtbar" in dieser Session. **Trigger-Phrase: „miss nicht, SCHAU."**
4. **Fix-Stacking unter Frust-Druck.** Beobachtung: Wenn der User eskaliert, schichte ich defensive Fixes (statische Labels, z-index, Struktur-Umbauten) übereinander, was die Fehlerfläche vergrößert und einmal Funktionierendes bricht. Evidenz: Chat-Avatar beim Bio-Fix zerstört; FIX5-Umbau vor Root-Cause-Findung. **Trigger-Phrase: „ein Fix, ein Beweis."**

(Vier Punkte. Mehr habe ich nicht ehrlich.)

## 4. Offene Threads & Meta-Rückfragen

**Offene Threads**
- Map-View: 3 Entscheidungen offen (Option A Scan-Prototyp vs. Option B nativer Nachbau; Kurations-Umfang ~150–250 vs. „vollständig"; Farbstimmung rosa/s-w/Papier-Creme) → `docs/SPRINT-map-view.md`.
- Deploy als claude.ai-Artefakt (LLM-Calls live testen; BYOK-Option später).
- Weitere FB-Bilder für Bio-Rotation/Moods (User hat mehr Material angeboten).
- Aufräumen: ungenutzte Fonts (`CCClobberinTime`, `PiS Coalfield`) im Projekt.
- Mobile/Touch nur rudimentär.

**Meta-Rückfragen**
1. Verifikations-Sprachregelung: Soll „gemessen ok — bitte auf deinem Screen bestätigen" der Standard-Abschluss für alle visuellen Fixes werden, oder nur bei Paint-verdächtigen Bugs?
2. Post-Mortem-Kadenz: automatisch nach jedem Bug-Cluster (wie #02) oder nur auf Zuruf?
3. Cut-Routing: dieses Dokument nach `VaultGvW/<projekt>/cuts/` (projekt-spezifisch) oder `gvw/Georg/Session-Cuts/` (Profil-Pflege)? Es enthält beides.

**Memory-/Profil-Updates** (substanz-neu aus dieser Session)
- Heuristik: „unsichtbar aber klickbar" ⇒ Paint-/Compositing-Verdacht; Computed Styles beweisen keine Pixel; Default-Fix = Konstruktion vereinfachen, nicht schichten.
- DC-Live-Edit-Artefakt: Template und Logik laden getrennt nach → Misch-Zustände auf der laufenden Seite; nach Edit-Serien Hard-Reload ansagen; transiente vs. persistente Symptome vor dem Fixen trennen.
- Test-Disziplin für 3D/Canvas-UIs: echte Koordinaten-Events statt `.click()`; Koordinaten pro Klick frisch; kleine eval-Batterien.
- Georgs Eskalations-Signal „CAPS + mehrfache Ausrufezeichen" markiert zuverlässig den Punkt, an dem Theorie-Produktion zu stoppen und Selbst-Audit + Messung zu starten ist — künftig früher.

---

# Memory-Snapshot — 2026-07-04 — cowork/iceberg-design-chat

*Kein persistentes Memory-Backend in dieser Session — Best-Effort-Rekonstruktion des session-lokalen Profil-Verständnisses. Gilt nur, soweit in dieser Session sichtbar.*

## working-style.md
- Deutsch im Chat, App-Copy Englisch (FrizzleBob-Voice). Präzise Punchlisten, oft mit Screenshots; Punkt-für-Punkt-Abarbeitung erwartet, kein ungefragtes Umbauen.
- Iterationsstil: viele kleine Runden, „session-cut" als bewusster Meilenstein mit Doku + Handover (Template: Session-Handover Prompt v1.2, Struktur strikt, keine Aufwärm-Floskeln, keine Closing-Angebote).
- Fordert evidenzbasiertes Arbeiten ein: Self-Audit + Repair-Plan bei wiederholten Fehlschlägen; Review durch „IT-Dev & UI-Experten"-Perspektive; toleriert keine unbelegten „gefixt"-Claims.
- Erwartet Meta-Reflexion auf Zuruf („post-mortem #02") inkl. ehrlicher LLM-Selbstkritik ohne Performance.

## project-iceberg.md
- Projekt: 3D Conspiracy Iceberg Explorer (KayfaBizarro-DS, bindend). Satirische Medienkompetenz, keine Truther-App; Status-Stempel (Debunked/Unclear/Art/Declassified) + Absurditäts-Würfel sind Kern des Framings.
- UI-Geschmack: entschlackter Comic-Look; kein ALLCAPS; wenige Schriftgrößen; Fonteys fürs UI, Baby Eliot nur Nodes, Irish Grover nur Headlines; dünnere Borders (1.5–2px); Icons als Ink-SVG auf BG statt Buttons; blaue 3D-Erlebniswelt (arktisch→abyss) vs. Papier-Creme-UI; Tier-Pastellcodierung.
- Layout-Anker: Narrator-Box links oben (zeigt Tier-Info beim Tauchen), Tier-Zahlen + ↑ linksbündig darunter, Detail-Karte rechts daneben (bündige Kanten), Suche+Filter rechts oben kombiniert, Cockpit rechts unten (draggable, Minify), Control-Hints links unten transparent.
- Technische Fallen (nicht wiederholen): expr-PNGs mit Karopapier → nur avatar-Crops; Bilder nie in Scroll-Container (Safari); `support.js` nie anfassen; `window.claude.complete` nur im Deploy — Fallbacks drin lassen.
- Nächstes Großthema: Great-Awakening-Map als 2D-View, Empfehlung nativer Nachbau (Option B), Entscheidungen offen.
