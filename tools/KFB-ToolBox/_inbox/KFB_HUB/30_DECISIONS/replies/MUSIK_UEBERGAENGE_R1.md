# Musik-Übergänge R1 · WS0 · 13.11.2026 (Georg: Biom-, Deck- und Stimmungswechsel ohne harten Schnitt, nicht immer derselbe Anfang)

**Wie es andere machen (bekannte Praxis, kein neuer Eigenbau):**
- World of Warcraft: Musik je Zone als Wiedergabeliste kurzer Stücke mit Stille dazwischen; beim Zonenwechsel blendet das alte Stück in wenigen Sekunden aus, das neue setzt ein; beim ersten Betreten ein eigenes Einstiegsstück.
- Middleware (Wwise, FMOD): Wechsel nur an Takt- oder Phrasengrenzen; Einstiegs- und Ausstiegsmarken je Stück; kurze Stinger überdecken den Wechsel.
- Zwei Grundtechniken: horizontal (Abschnitte neu ordnen, an Phrasengrenzen springen) und vertikal (Stems je Stimmung zu- und abschalten).

**Für KFB (ein Ton-Pfad kfbAudio, nie zwei Musiken, V-841):**
1. **Weiter, wo es war:** je Titel merkt sich die Sitzung die Abspielstelle. Kommt der Titel wieder, startet er an der nächsten Phrasengrenze ab dieser Stelle, nicht am Anfang. Phrasen und Takt liegen schon im Katalog (`bpm`, `offset_s`, `harvest`/`phrases_total`).
2. **Wechsel auf dem Takt:** Zonen-, Biom- oder Deckwechsel blendet am nächsten Taktende über (2–4 s), bei großem Stimmungssprung mit kurzem Stinger aus dem Bestand.
3. **Stems als Stimmungsregler:** Titel mit Stems (34 heute) dünnen beim Verlassen eines Kontexts aus (Schlagzeug und Bass zuerst) und bauen sich im neuen Kontext auf; so klingt ein Übergang wie ein Arrangement statt wie ein Schnitt.
4. **Abwechslung (V-1703):** Signature-Sound des Decks zuerst, danach tag-verwandte, in der Sitzung noch nicht gespielte Titel; kein Titel zweimal, solange es passende ungespielte gibt.
5. **Neue Songs dafür:** instrumental, festes Tempo, Abschnitte in 8er-Phrasen, kein Ausblenden, klares Ende, getrennte Instrumente (Stems). Die sechs Suno-Karten b411–b416 folgen dem.
