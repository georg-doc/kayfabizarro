# Für WSA Patch (InfiniteRooms) · R28: Website andocken · 15.11. (WS0, V-1794)

**Kern (3 Zeilen):**
1. Claude Design baut den Website-Hero-Shot (FB zerschneidet eine hängende Deck-Seite, V-1766) und soll ihn in einem echten Kartenraum spielen lassen statt vor einer leeren Wand.
2. Dafür braucht die Website deinen Quellstand mit dem geschlossenen Escher-Kreis (R25, Version 19) als GitHub-Zweig und vier kleine Schnittstellen.
3. Es kommen keine neuen Räume, kein Umbau und kein Merge dazu. Nur Lieferung und Beschreibung des Bestands.

**Lieferung:**
- **Quellstand:** R25 (`wsa/infiniterooms-r25-escher-circuit-20261114` @bced9451) als Zweig `wsa/infiniterooms-r28-website-20261115` im Repo `georg-doc/KFB-Stunt-Car-Race` pushen. Ist R27 dein neuester sauberer Stand, dann R27 und im RETURN sagen, welcher es ist.
- **Lageplan** als JSON plus ein Bild (JPG, höchstens 2 MB): Räume, Verbindungen, Flächen, auf denen Karten hängen dürfen, und Stellen, an denen oben und unten wechselt.
- **Zeit und Kamera:** `setTime(sek)` und `setCamera({pos, ziel, fov})` von außen, damit ein vorab berechneter Shot im Raum abläuft. Sind sie schon da, nenne Name und Datei. Fehlen sie, beschreibst du den kleinsten Weg dorthin, ohne ihn zu bauen.
- **Wand als Kartenbogen:** eine Funktion, die eine benannte Wandfläche gegen ein fremdes Mesh oder eine fremde Textur tauscht (die zerschneidbare Seite der Website). Gibt es sie nicht, beschreibst du den kleinsten Weg dorthin, ohne ihn zu bauen.
- **Zerstörungswand:** welches Ereignis die Wand beim Treffer meldet (Name, Felder: Ort, Stärke, Material), damit Funken, Ton und Kamerastoß daran hängen. Das gilt für beide Wände: die Kartenwand (Patch WebGPU) und die Tunnel-Wand mit Rapier-Trümmern (R26/R27).

**Rückgabe:** RETURN.md in `KFB_HUB/30_DECISIONS/replies/CARD_DUNGEON_R0/` mit Zweig, SHA, Lageplan-Pfad und den Funktionsnamen samt Datei. WS0 gibt es an Claude Design weiter.

**Nachtrag R28b · Splat-Versuch an einer Kartenwand (Georg 15.11., V-1795), erst nach der Lieferung oben und nach der laufenden Audio-Site-Anbindung:**
- **Ziel:** Prüfen, ob eine flache Kartenillustration beim Annähern echte Tiefe bekommt. Die Splats liefern nur die Illusion; Navigation und Raumwechsel bleiben beim vorhandenen Portal. Kein Umbau, kein Merge, privat.
- **Aufbau:** eine Original-Kartenwand mit vorhandenem Portal, als vierte Variante im Cartoon-Perspektive-Vergleich R20. Drei Fassungen derselben Wand:
  - heute.
  - Parallax-Relief aus einer Tiefenkarte des Kartenbilds.
  - Gaussian Splats mit derselben Tiefenkarte, Renderer Spark (`sparkjs/spark`, MIT, WebGL2), Version exakt gepinnt.
  - Woher die Tiefenkarte kommt, nennst du im RETURN.
- **Messung:** gleiche Wand, gleiche Kamera unter 0°, 30°, 60° und 90° plus ein Gang am Portal vorbei. Je Fassung Ladezeit, Bildzeit (Median und p95), Speicher und sichtbare Fehler (Ränder, Flimmern, Tuschekontur, Kartenrand). Bildzeit nur mit dem 1×1-Readback-Gate in gepaarten A/B-Läufen messen, nie über requestAnimationFrame-Abstände (V-1094/V-1097); dpr angeben.
- **Bilder für den Hub:** je Winkel ein Bild mit höchstens 2 Fassungen nebeneinander, beschriftet „heute“, „Relief“, „Splat“, dazu ein kurzer Clip vom Vorbeigehen je Fassung. WS0 baut daraus die Hub-Karte, Georg wählt.
