# RETURN · S16b · Batch-EyeRig + Combat Mech · 2026-10-03/04

## Auftrag
1. Neues Batch-Eye-Rigging für approved Characters (Large + Medium, Legacy später) in S16 übernehmen.
2. Combat Mech (Series 5 · Character 1) in beiden Farbvarianten als Residents, Boden- und Flugpose (Jetpack),
   Waffen korrekt eingepasst wie in den Promo-Bildern.

## Geliefert
- `lib/frizzlegraft/batch-eyes.v1.js` + Donoren `donoreyes.v1.js`, `eyeoval.v1.js`, `face-color-sampler.v1.js`
  (unverändert aus dem Repo). Profile: `data/eye-rig/` (Large reviewed v1, Medium batch (1)).
- Regeln: Kopfgeometrie klonen vor dem Ausblenden · Identitätsprüfung gegen das Abnahme-Paar (Dreiecke + z) ·
  Lidfarbe Profil → sourceFace → gemessen → gemeldeter Rückfall · NoEyes hat Vorrang · `noBatchEyes` (Action Figure).
- `data/cast.js`: `combat-mech`, `combat-mech-alt`. `lib/atlas.js`: `hover`, `spin`, `tickers`.
- Waffen gemessen: Minigun am hängenden Arm → slotAxis Z→vorn; in Gewehrhaltung (Running_HoldingRifle als
  Oberkörper-Schicht) Slot-Z vorn 0,94 / Slot-Y oben 0,93 → Identität. Axt Identität. Flügel per `parts` 38° aus.
- `tools/combat-mech-probe.html`: Pack-Inhalt über den Registry-Shard gezählt (die Baumansicht filtert glb/gltf).

## Befunde
- „Approved" stimmt nur für Large (4/4). Medium: 2/33 approved (Mannequin, Rogue_Hooded, keine Residents), 30 adjusted, 1 unreviewed.
- Large-Lidfarben jetzt gemessen statt `#b58f83` (Monstrosity #eae9e0, Black Knight #8ea7b5, Demon Lord #ec8d8e).
- Regex-Falle: `/^Jump_Idle$|^Spawn_Air$/` traf Spawn_Air, weil General vor MovementBasic geladen wird. Pose jetzt eindeutig.

## Offen
Siehe HANDOVER §E.
