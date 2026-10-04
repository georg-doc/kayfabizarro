# KFB Travel v8+ // TinySkies Architektur-Transfer

**Analyse-Quelle:** `dannylimanseta/tinyskies`
**Fokus:** KISS, Modul-Extraktion und Adaption für den analogen, handgezeichneten Retro-Comic-Style der KFB Engine. Kein Schnickschnack, nur das was KFB direkt besser macht.

## Cluster 1: Data-Driven Vehicles (Vehicle Capabilities)
TinySkies definiert Vehikel (Flugzeug, Teppich, Boot) strikt über externe Config-Files (`vehicleCapabilities.ts`), statt Logik zu duplizieren.

*   **KFB Modul-Vorschlag:** `VehicleConfig` (JSON/TS) & `VehicleFactory`
*   **Umsetzung für Claude:** Die abstrakten Fahrzeug-Werte (Thrust, Drag, TurnRate, MaxPitch) komplett aus den Hardcodes des `flight-controller.js` entfernen. Der `TravelManager` lädt beim Modus-Wechsel lediglich eine neue Config (z.B. für "Card", "Balloon" oder "Rollercoaster") und füttert den Controller damit.

## Cluster 2: Quaternion Spherical Math
TinySkies löst den "Gimbal Lock" (Verdrehen der Achsen an den Polen der Weltkugel) durch konsequente Quaternionen-Mathematik ("singularity-free globe flight").

*   **KFB Komponente-Vorschlag:** `QuaternionSurfaceMath` (Utility-Klasse)
*   **Umsetzung für Claude:** Der `FlightController` muss (falls nicht schon geschehen) auf saubere Quaternionen umgebaut werden. Das ist essenziell, falls das KFB-Spielfeld komplexere 3D-Topologien oder Loopings hat. Es sichert flüssige Kamerapfade und verhindert ruckartige, künstliche Rotationen des `CardRig`.

## Cluster 3: Modular Modifier Deck (Vehicle Upgrades)
TinySkies nutzt per-vehicle Upgrade-Pools (Level-Up Karten, die das Handling ändern).

*   **KFB Modul-Vorschlag:** `ModifierPipeline` (als Teil des `TravelManager`)
*   **Umsetzung für Claude:** Ein perfekter Fit für KFB als Card Game Framework! Wir bauen eine Pipeline, in die "Travel-Cards" (z.B. Boost, Heavy Wind) gesteckt werden. Bevor der Controller die Physik auf den State anwendet, werden die Base-Stats durch die aktiven Karten modifiziert.

## Cluster 4: Session Contracts (Gameplay Loops)
Das Cursor-Review von TinySkies kritisiert das "Open Sandbox"-Problem: Spieler fliegen ziellos herum, weil Endlos-Loops ermüden. Die Lösung dort: "Run Contracts" (z.B. "Zünde 3 Feuer an").

*   **KFB Modul-Vorschlag:** `TravelContractTracker`
*   **Umsetzung für Claude:** Ein leichtgewichtiges Modul, das sich an unseren im v7-Audit geforderten `EventBus` hängt. Es lauscht rein passiv auf Events wie `OnNodeReached` oder `OnBoostUsed` und wertet kleine Session-Ziele aus, ohne die Core-Loop zu verlangsamen.

## Cluster 5: Network Sync & SLERP (Multiplayer / Ghosts)
TinySkies glänzt bei (Koop-)Flügen durch Client-Side Prediction und SLERP-Interpolation (Spherical Linear Interpolation).

*   **KFB Komponente-Vorschlag:** `SyncTransform`
*   **Umsetzung für Claude:** Falls asynchroner Multiplayer, Leaderboards oder Ghost-Replays (andere Spieler) geplant sind: Die externe Position via SLERP glätten. **WICHTIG:** Das `PetKinetics` Modul greift weiterhin *lokal* auf diesen geglätteten Transform zu. So bleibt die Pet-Animation (Squash & Stretch, Ear Lag) immer organisch und "snappy", selbst wenn die Netzwerk-Daten laggen.

## Cluster 6: HUD Anti-Pattern (Was wir NICHT übernehmen)
TinySkies hat eine monströse `HUD.ts` (God-Class mit Inline-Styles).

*   **KFB Architektur-Regel:** Strikte Trennung von UI und Canvas.
*   **Umsetzung für Claude:** UI-Elemente werden als reines, sauberes HTML/CSS-Overlay über die Rive/WebGL-Szene gelegt. Der `TravelManager` feuert Events, die UI reagiert. Keine DOM-Updates in der `update(dt)`-Loop der Controller!

---
**Handover-Direktive für Claude:**
Nimm diese Cluster als architektonische Blueprint für den v8 Branch. 
1. `TravelManager` und Interfaces sauberziehen (aus v7 Audit).
2. `VehicleConfig` auslagern.
3. `ModifierPipeline` für das kartenbasierte Handling integrieren.
