# Bericht an Georg · Gehweg/Bord Town-Ring Lauf 02 (2026-10-10)

**Nicht bestanden:** 5,0. Q1–Q9: bestanden. Stark: Innenseite (Bord + Plattengehweg) konsequent und gut lesbar.

## Die 3 wichtigsten Befunde
1. **Außen- und Geländeanschlüsse gebastelt** (U3 = 3; `ausnahme_beide_gehwege`, `kopf_0/1_bodennah`): harte Farbkante Asphalt/Gras, Bankett-Wülste mit Messerspitze bzw. Kerbe, Geisterlinie.
2. **Gehweg biegt sich wie Gummi** in der Senke (`kopf_1_09H`): Bordhöhe geht gegen null; Regel „kürzen statt biegen“.
3. **Aussichtspunkt ohne Baulogik** (U8; `uebersicht_schraeg`, `kopf_0_09H`): Platte liegt auf einem Grashügel, Ecke schwebt, kein Zugang; Bandenenden verschieden; Ablauf lose aufgelegt.

## Entscheidung Steuerung
Strukturfehler erkannt: RKIT modelliert Gelände und Bankett im Blender-Platzhalter selbst. Laut Straßenbett-Vertrag gehört der Geländeanschluss dem Lab (analytisches Straßenbett + Sprenkel S1). Ab Lauf 03 wird RKIT-Ware im Lab auf der echten Insel (rkit_hub) gerendert und dort bewertet; RKIT liefert nur die gebauten Teile.
