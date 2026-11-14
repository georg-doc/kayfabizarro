# FB Web-Kanon · Twin r1c · RETURN (WSB, Mac mini, 14.11.2026)

**Auftrag (WS0):** Twin-Variante mit dem Atlas-Bake aus DP_WEB_KANON_R1 nachziehen, damit der Jetpack sein Knetkorn bekommt. Das Spiel bleibt unverändert.

| Datei | Größe | sha256 (Anfang) |
|---|---|---|
| `_privat_kauf_asset/FB_WEB_KANON_twin.r1c.glb` | 5,22 MB | d71f96e874806aa2 |

Sie ersetzt `FB_WEB_KANON_twin.r1b.glb`. FB-Hauptdatei und Agent bleiben bei r1b.

## Was anders ist als r1b
- **Jetpack:** Die 35 Twin-Teile haben im Spiel Knete ohne Bake. Sie liegen jetzt in einem eigenen Atlas (Atlas-Funktion des Spiels), in dem das Spiel-Material gerendert wurde: Farbe und Shader-Normale, 2048².
- **Sichtbar** in `blaetter/T1_twin_r1c.jpg`, Zeile „Jetpack nah“ (Spiel / r1b / r1c):
  - Das rote Band ist wieder rot statt rosa.
  - Tanks und Schläuche haben Knetkorn wie im Spiel.
- **FB selbst:** Atlas, Augen, Gesicht, Clips und Knoten wie r1b. Der FB-Normal-Atlas bleibt PNG; nur der neue Jetpack-Atlas ist JPEG q92.
- **Packen:** Die Auswahl der JPEG-Normalen geht jetzt über den Texturnamen. Vorher hätte `textureCompress` auch FBs Atlas umgewandelt, weil es den Filter nicht beachtet.

## Prüfung
- **Kanon-Wache** ok (`data/r1c/pruefung.json`):
  - beide Ohren mit A11, Schwanz, Shirt;
  - Anker `KFB_Jetpack_Anchor`, `KFB_Jetpack_Twin`, `KFB_Thrust_L`, `KFB_Thrust_R`.
- **Inhalt:** 26 Clips, Höhe 1,742 m.
- **Bildpaar Spiel ↔ Web:** mittlere Abweichung je Pixel (0–255) 2,5 / 2,6 / 3,2 (vorn / seitlich / Gesicht). r1b lag bei 2,5 / 2,7 / 3,2.
- **Bilder:** `bilder_r1c/twin/`, Skripte in `scripts/r1c/`.
