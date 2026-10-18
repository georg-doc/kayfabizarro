# BRIEF WSA · Plattform-Deep-Dive (Hosting, Persistenz, Login, LLM, Vertrieb) · R1 · 2026-10-18 · WS0
**Ziel:** Ein Entscheidungs-Report für Georg. Er wird auf GitHub (privates Repo, V-538) und als Seite gespeichert. Am Ende stehen eine klare Empfehlung und ein Stufenplan. Nur recherchieren und planen, nichts einrichten, keine Konten, keine Kosten.

**Tier 0**
1. Optionen vergleichen, mit Belegen aus der jeweils aktuellen offiziellen Doku (Link + Datum).
2. EU/DSGVO-Sicht ist Pflicht, denn Georg sitzt in Deutschland.
3. Empfehlung + Stufenplan Alpha → Beta → Release, mit Kosten-Schätzung.

## Block
**Fragen**
1. **Hosting/Persistenz:**
   - Kandidaten: ChatGPT Sites (Regionssperre EEA? Datenresidenz?), Cloudflare (Workers/Pages + D1 + R2, EU-Jurisdiktion), Vercel, Netlify, Supabase (EU-Region), Firebase, GitHub Pages (nur statisch), Deno Deploy, Fly.io/Render, itch.io (kostenloser Web-Spiel-Vertrieb), weitere nach eigener Wahl.
   - **Georg: möglichst kostenlos.** Je Option angeben:
     - Gratis-Kontingent mit Zahlen: Anfragen, Speicher, Bandbreite, DB-Größe;
     - wann es kostet;
     - ob der Gratis-Plan kommerzielle Nutzung erlaubt (Vercel Hobby z. B. vermutlich nur nicht-kommerziell, bitte prüfen);
     - Einschlafen bei Inaktivität (Supabase Free);
     - EU-Region.
   - Zu persistieren: Spieler-Session, Lean Memory je Spieler/NPC, NPC-Daten, World-Builder-Stände, Configs/Builds.
   - Format: unsere `kfb.*`-Schemas, ein Adapter, local-first mit Sync.
2. **Login:** E-Mail-Link, Cloudflare Access, „Sign in with ChatGPT“ (Login + Plan-Kontingent, Teilnahme am Test für gehostete Apps), weitere OAuth-Anbieter.
3. **LLM für NPC-Dialoge:**
   - Wer zahlt: Plan-Kontingent des Spielers, unser Schlüssel mit Budget, oder Spieler-eigener Schlüssel?
   - Ausführung serverseitig. Rate-Limits.
   - Der Fluff-o-lect-Encoder bleibt bei uns (das LLM liefert nur Klartext).
   - n8n als Orchestrierung: wann, wie, Webhooks.
4. **ChatGPT-App (Apps SDK) als Zusatzkanal:** Was passt in ein Widget (Kartendossier, Fluff-o-lect-Übersetzer, Deck-Songs)? App-Verzeichnis, Prüfung, Monetarisierung.
5. **Steam:**
   - Web-Spiel als Desktop-App (Electron/Tauri/NW.js), Steamworks-Anbindung (Erfolge, Cloud-Speicher, Overlay), Offline-Fähigkeit, Steam Deck.
   - Store-Seite, Gebühr, Wartezeiten, Prüfung.
   - KI-Offenlegung: vorab erzeugt (Meshy, ElevenLabs, Suno) und live erzeugt (LLM-NPCs) mit Leitplanken.
6. **Rechte und Lizenzen für kommerziellen Vertrieb:**
   - KayKit-Kauf-Assets, Meshy je Plan, Mixamo, ElevenLabs-Plan, Suno-Plan (kommerzielle Rechte), PottyMouth-Webfont/Spiel-Einbettung, Georgs eigene Schrift.
   - Was fehlt, was muss bezahlt oder geklärt werden?
7. **Recht/Pflichten:** Datenschutzhinweis, Löschung, Altersfreigabe bzw. Ausschluss unter 13, Impressum.

**Ausgabe**
- `PLATFORM_DEEPDIVE_R1.md`: Vergleichstabelle, Risiken, Empfehlung, Stufenplan, Kosten, offene Fragen an Georg.
- Ablage im privaten Repo + als Seite. Den Link schickst du an WS0.
- Ungesichertes als „nicht verifiziert“ markieren. Keine Annahmen als Fakten.

**Ausgangslage von WS0 (bitte prüfen, nicht übernehmen)**
- ChatGPT Sites: öffentliches Veröffentlichen zum Start nicht in EEA/CH/UK; keine Datenresidenz; Zahlungen und Zielgruppe < 13 verboten.
- WS0-Tendenz: eigener Cloudflare-Stack (EU) + „Sign in with ChatGPT“ als Login-Option + Apps SDK als Zusatzkanal.
