# CA2-03 · Zwei KayKit-Gegnerprofile

**Goal:** Daten-/Visualprobe zweier Gegneradapter; keine Kopie der Combat-Logik.  
**Protected:** Arena behält drei Gegnerplätze, Leben, Schaden, Tod, Rewards und Respawn.

Beginne mit Skeleton Warrior (Melee). Prüfe Skeleton Rogue (Ranged); ohne gemessene Crossbow-/2H-Fire-Kette bleibt er HOLD und ein belegter Medium-Kandidat wird vorgeschlagen. Pro Profil: exakte Model-/Rig-/Clip-/Weapon-Pfade, Scale/Bodenanker, Face-Modus, Arena-State→Clip für Idle/Move/Attack/Hit/Defeat und echte same-rig Fallbacks.

Liefere `ENEMY_PROFILES.json`, `ANIMATION_MAP.json`, `SOURCE.json`, Browserchecks/Screenshots. Keine Live-Arena-Integration, PR ohne Auto-Merge.
