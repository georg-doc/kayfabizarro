# Sprechblasen-Vorgabe R2 · WS0 · 31.10.2026 (V-1099, ergänzt V-204, V-501, V-887, V-992, V-1067)
Abnahme-Maßstab ist das Bild `SPRECHBLASEN_SSOT_R2/ref_08_gespraech.png`. Fehlerbild: `SPRECHBLASEN_SSOT_R2/fail_lauf_A_5.jpg`. Werte und Verhalten stehen im freigegebenen Prototyp `SPRECHBLASEN_SSOT_R2/proto-bubbles.ref.js` und gelten damit für das Spiel. Diese Seite beantwortet die Bitte aus dem HUD-Paket (`NACHRICHT_WS0_sprechblasen.md`).

## Für alle Sprechblasen
- **Zipfel (Georg):** Länge bis 30 px, Fuß 22 px bei 900 px Bildhöhe, statt 18 und 12. Beides wächst mit der Bildhöhe mit. Der Fuß bleibt auf der geraden Kante; bei sehr kleinen Blasen wird er nur so weit schmaler, wie die Kante es verlangt.
- **Ziel:** Bei Figuren-Blasen zeigt der Zipfel weiter auf die Kopfmitte, der Ansatz wandert über den Rand (V-887).
- **Abstände:** Innenabstand und Zeilenabstand wie im Prototyp (`AIR`), Satzteile mit normalem Zeilenabstand, kein Zusatzabstand von 0,5 em. Georg hat zu enge Ränder schon bemängelt (V-734).
- **Umbruch:** Keine einzelnen Wörter allein in der letzten Zeile. `LIMITS.lastLineShare` wird angewendet, im Host, ohne Änderung der Vendor-Datei.
- **Grundfarbe:** Papier `#fbf2df` als Standard der Tönungslogik aus V-519, keine Ruffarbe in der Blase. Kein Umriss (V-204).

## Antwort-Blasen
- **Lage:** Eine Spalte neben dem Kopf der Spielfigur, vertikal mittig auf Kopfhöhe, auf der Seite ohne NPC-Blase. Sie folgt dem Kopf ruhig, ohne Sprünge, und überdeckt nie Figuren oder HUD (V-887).
- **Zipfel:** Immer an der Spielfigur zugewandten Seite, mittig, leicht zur Kopfhöhe geneigt, wie im Prototyp. V-887 „wandert über den Rand“ gilt für gestapelte Antworten nicht, denn an der Unterkante liest es sich falsch.
- **Abstand:** 18 px zwischen den Blasen bei 900 px Bildhöhe.
- **Rangfolge:** Alle Antworten in Papierfarbe, Text in Tinte. Die Nummer steht als fette Ziffer im Text. Keine farbigen Punkte, keine getönten Blasen.
- **Zustände:** Hover Gold `#E9B53A` im Körper und leicht größer, Druck kurz gestaucht, Auswahl: die gewählte bleibt und wird zur Sprechblase der Spielfigur, die anderen gehen.
- **Inhalt:** Zwei bis vier gesprochene Antworten (V-1067). „Show a card“ ist keine Antwort-Blase mehr. Das Ausspielen läuft über den Kontext-Knopf der Leiste (V-1067); Taste bleibt.
