# MINI_kampf_r1 · Würfelmonster Kampf R1 · RETURN (WSB, 17.11.2026, V-1852/V-1854)

**Bundle:** `wsb-wuerfelmonster-kampf-r1.bundle`, sha256 `7aafa094d333b6a02eb5b2ac37dc557bc770aa6eaeccba5f811b1050527cd6aa`
- Zweig `assets/wsb-wuerfelmonster-kampf-r1` @7856d49d, ab `assets/private` @eb113fea.
- 223 neue Dateien, alle unter `50_BLENDER/WUERFELMONSTER_KAMPF_R1/`, nur additiv. Die GLB-Dateien sind unverändert. WSB pusht nicht.

**Messblatt** (je Art die Clip-Folge, Zeiten, Reichweiten, Lücken, Runden, Kritiker): `50_BLENDER/WUERFELMONSTER_KAMPF_R1/RETURN_wuerfelmonster_kampf_r1.md`.
**Patches für die Figuren-SSOT:** `50_BLENDER/WUERFELMONSTER_KAMPF_R1/patches_abgabe/q_<art>.game.patch.json` (17, `game`-Felder, alle `DESIGN`; für `q_cthulhu` als neue ID).
**Belege:** `belege_r4/` mit Kontaktbögen und Vorschlägen je Art, Übersicht und 12 Videos (Krabbe, Pilz, Schwein, Dämon). Die Bögen hier im Ordner sind eine Auswahl.

## Kurz
- **Es gibt keinen Kiefer:** In keinem Kit-Clip der 17 Dateien geht ein Maul auf oder zu. Der Biss ist deshalb nur über Kopfstoß und Timing zusammensetzbar. Das ist **Lücke 1** für Georgs Entscheid (V-954).
- **Vorschläge** (für alle Arten gleich, nur Ausschnitt, Tempo und Überblendung):
  - **Biss:** Ausholen aus `HitRecieve`, harter Stoß aus `Bite_Front`, Kontakt gehalten; Kontaktbild 0,427 s.
  - **Spucken:** Zurücklehnen aus `HitRecieve`, Vorschnellen aus `Bite_Front`; Abgang 0,333 s am Anker `KFB_Mouth`.
  - **Umfallen:** `Death`, letztes Bild gehalten.
- **Kontakt-Gate:** alle Bisse PASS, tiefste 0,9 cm bei 1,73 cm Grenze.
- **Look nach Georg 17.11.** (mit dir abgestimmt): KFB-Augen weiß, Pupille 0,24, converge 0,45, dazu `kreaturFarbe` (V-1850).
- **Weitere Lücken:**
  - `q_tree` hat keinen `Death`.
  - `q_ghost` hat keine Datei mit Augen-Ankern.
  - Cthulhu steht auf der Bühne geerdet.
- **Blinder Kritiker (ein Lauf, Runde 1): REWORK.** Das Ausholen ist nachgearbeitet und das Spucken jetzt sichtbar. Ohne Kiefer liest sich der Biss aber weiter als Kopfstoß. Details im Messblatt.
- **Befund fürs Spiel:** `darkFluffer.js` zeigt die Original-Augen statt KFB-Augen, und `kreaturlook` ist aus (q725).
