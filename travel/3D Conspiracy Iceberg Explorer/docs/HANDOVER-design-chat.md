# Onboarding — neuer Design-Chat (Kontext-Briefing)
Projekt: **3D Conspiracy Iceberg Explorer** · Stand 2026-07-05 · **v1.3**

Lies zuerst `docs/DOKU.md` (Feature-Inventar + Stolperfallen). Dann nach Bedarf:
`docs/ENGINE.md` (Technik), `docs/UI-UX.md` (Design-Sprache), `docs/HANDOVER-coworker.md`
(LLM/Backlog), `docs/BUILD-as-artifact.md` (1:1-Artefakt), `docs/SPRINT-map-view.md`
(nächstes Großthema). Post-Mortems: `docs/REVIEW-nodeclick.md`, `docs/cuts/`.

## Projekt in einem Satz
Satirischer 3D-Conspiracy-Iceberg-Explorer (Three.js) mit Uncle FrizzleBob (KayfaBizarro-DS)
als Guide — Chat/LLM-Touren, Filter, FactChecks, Evidence-Bilder, Ghost-Nachbarn, Atmo,
Import/Export. Medienkompetenz im Fellmantel, keine Truther-App.

## Wie Georg arbeitet (etabliert über mehrere Sessions)
- **Sprache:** Georg schreibt Deutsch, App-Copy ist Englisch (FrizzleBob-Voice).
- **Iteration:** kurze, konkrete Punchlisten, oft mit Screenshots. Punkt für Punkt abarbeiten,
  **nichts ungefragt umbauen/„verbessern".** Vorschläge anbieten statt eigenmächtig ergänzen.
- **Evidenz statt Behauptung:** keine „gefixt & verifiziert"-Claims ohne Beleg. Bei visuellen
  Bugs **selbst hinschauen** (echter User-View-Screenshot), nicht nur DOM messen. Die
  Verifikations-Sprachregelung ist bei Paint-Verdacht Pflicht; sonst normal liefern.
- **Post-Mortems auf Zuruf** (nicht automatisch). Format „Session-Handover Prompt v1.2":
  strikte Struktur, keine Aufwärm-Floskeln, keine Closing-Angebote, ehrliche LLM-Selbstkritik.
- **Eskalationssignal** (CAPS + „!!!"): sofort Theorie-Produktion stoppen → Self-Audit + messen.
  Georgs physikalische Intuition ist ein Messgerät — ernst nehmen (die Paint-Saga hat ER
  diagnostiziert, nicht das Modell).

## Look & Konventionen (bindend, KayfaBizarro-DS — Details docs/UI-UX.md)
- Comic/Zine, aber **entschlackt**. Wenig Deko, wenige Größen (12/13/15/20px), kein ALLCAPS.
- **Typo:** Fonteys (UI/Body/Chat/Buttons), Baby Eliot (nur 3D-Node-Labels), Irish Grover
  (Headlines/Stempel). CamelCase „FrizzleBob". **Rich-Text:** `**bold**`/`*italic*` in Chat/
  Summary/Quip (sparsam).
- **Farben:** blaue 3D-Welt (arktisch→abyss), Papier-Creme fürs UI, Tier-Pastellcodierung
  (Eisweiß→Gletscherblau) für Zahlen & Node-Labels. Borders 1.5–2px, kein Vollschwarz bei dünn.
- **Icons** als Ink-SVG auf BG (keine Buttons, keine Icon-Fonts, kein Emoji). Dice-Faces für
  Absurdität. REDACTED-Stempel für fehlende Bilder.
- **Wobble-Streuung:** jedes Fenster eigener Radius (nicht der eine geteilte — verrät das Konstrukt).
- **Layout-Anker:** Narrator-Box links oben · Tier-Rail linksbündig · Detail-Window rechts daneben ·
  Suche+Filter rechts oben · Cockpit rechts unten (draggable, minify, ♪+Speaker) · Hints links unten.

## Technische Fallen (Details DOKU.md §Stolperfallen)
1. Mascot: nur `assets/mascot/avatar-*.png` (zentrierter Crop) — `expr-*.png` haben Karopapier.
2. **PAINT-REGEL (bindend, dreimal erkauft):** scrollt etwas, trägt NICHTS darüber ein `transform`.
   DS-Rotation auf den äußeren Rahmen; Scroller innen `translateZ(0)`. Bilder nie roh in Scroller
   (Safari clippt) → Header/Body-Muster. Verifikation NUR per echtem User-View-Screenshot.
3. „Unsichtbar aber klickbar" = Paint-Verdacht, nicht CSS → Konstruktion vereinfachen, messen.
4. `support.js` = generierte DC-Runtime, nie editieren.
5. LLM (`window.claude.complete`) läuft voll nur im Deploy — Fallbacks drin lassen.
6. DC-Live-Edits: Template & Logik laden getrennt → nach Edit-Serien Hard-Reload ansagen.
7. Evidence-Bild-opacity NUR imperativ per ref (nicht im Template-Style — React re-applied es).

## Stand / Nächstes
v1.3 steht & verifiziert: 159 Entries · Schema-v2-Fundament (Detail-Card v2: Evidence+REDACTED,
Summary, good neighbours mit Ghost-Materialisierung) · View-Contract · Rich-Text · Dice-Faces ·
Wobble-Streuung · prozedurale Atmo + 11Labs-Pipeline. Standalone-Build neben dem DC.
**Nächstes:** theme.js + Pack-Format v2 → dann **Map-View** („Great Awakening Chart", nativer
Nachbau, gleiche Engine). Reihenfolge & Entscheidungen: `docs/SPRINT-map-view.md`, `docs/HANDOVER-coworker.md`.
