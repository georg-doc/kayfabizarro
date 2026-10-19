# BRIEF WSB · B45 · King Kayfabian + Dark-Knight-Torwächter + KFB-Castle-Bühne + Kronen-Gag · R1 · 2026-10-19 · WS0
**Register:** V-551. **Reihenfolge:** in der Warteschlange nach den Ork-Band-Assets; Georg kann in Hub q119 umsortieren.

**Tier 0**
1. **King Kayfabian**, eine helle Paladin-Version:
   - goldene Rüstung mit roten Akzenten;
   - Umhang mit klassischem Königs-Pelzrand (weiß mit schwarzen Hermelin-Tupfen);
   - Cartoon-Krone, im Kampf ein Helm.
2. **Dark Knight** (Large Rig) als Torwächter in Wächter-Pose mit Zweihänder.
3. **Bühne:** KFB-Castle auf einem Hügel mit flachem Turm bzw. Zinnen als Plattform für Verkündigungen und Kayfabulations-Urteile; Steintreppe, Nature-Props, Holzgerüst um den Turm.
4. **Kronen-Gag**, später im Spiel: Nach jeder Entscheidung wird der King vom Turm geboxt. Die Krone fliegt hoch und landet auf dem Kopf des neuen Kings, bis auch der wieder vom Turm fliegt.

## Block
**King Kayfabian**
- **Basis:** KayKit Adventurers 2.0 (Knight-Linie, CC0) oder passende Ritter-Figur aus der Asset-Suche; kein Eigenbau-Körper (V-511, Lehre aus dem Käpt'n).
- **Farben:** Rüstung gold (Knet-Look, V-385), Akzente rot (Wappen bzw. Gürtel bzw. Säume).
- **Umhang:** Hermelin-Rand an Kragen und Saum, weiß mit schwarzen Tupfen; Stoff rot.
- **Kopf-Varianten:**
  - (A) Cartoon-Krone, groß, leicht schief, rote Steine;
  - (B) Helm für den Kampf.
  - Die Krone ist ein **eigenes Prop** (`KFB_Crown`) und sitzt per `KFB_HatSeat` (B23-Logik).
- KFB-Augen, Lid = Haut gemessen, alle Augen-Zustände.
- **Clips:** Idle, Verkünden (Arm heben bzw. „Hört her!“), Jubeln, Winken, getroffen und fällt (Mixamo `Getting Thrown`/`Falling Back Death` aus `BLENDER MCP/_inbox`, falls dort; sonst KayKit Hit/Death).

**Dark Knight, Torwächter (Large)**
- **Körper:** Rig_Large-Ritter, dunkel (Schwarz bzw. Anthrazit, Akzente dunkelrot oder Stahl); Helm geschlossen mit Sehschlitz, die KFB-Augen leuchten nicht, sitzen sichtbar bzw. halb verdeckt im Schlitz (`occludedBy` falls ganz verdeckt).
- **Zweihänder:** aus Assets (KayKit Weapons bzw. Asset-Suche, CC0).
  - Halterung nach V-536: Haupthand `KFB_Grip` am Griff, zweite Hand per IK auf `KFB_Grip_L` am Griff;
  - Klingenachse = Unterarmachse der Haupthand.
- **Wächter-Pose:**
  - Zweihänder senkrecht vor dem Körper, Spitze auf dem Boden, beide Hände auf dem Knauf, breiter Stand;
  - als Idle-Loop mit leichtem Atmen;
  - dazu ein „Weg versperren“-Clip (Schwert quer).
- **Platz:** am Fuß der Steintreppe (`KFB_Gate_Spot`).

**KFB-Castle-Bühne**
- **Castle:** Georg sucht noch ein Modell (Meshy bzw. Kit). Bis dahin ein klar markierter Platzhalter aus Kit-Teilen.
- **Turm:** flache Plattform mit Zinnen (Platz für King + 2–3 Figuren).
  - Anker `KFB_Stage_Top`, `KFB_Throne_Spot`, `KFB_Fall_Edge`.
- **Hügel:** organische Knet-Form, Steintreppe hinauf (`KFB_Stair_Bottom`/`Top`), Nature-Props (Bäume, Büsche, Steinnester nach Dreier-Regel), **Holzgerüst** um den Turm (Kenney `structure`-Teile o. Ä.).
- Welt-Kontext: Terrain + Licht (Bühne V-548).

**Kronen-Gag (Scenelet-Zeitplan, Laufzeit WS1b)**
- **Marken:** `punch`, `knock_off` (über `KFB_Fall_Edge`), `crown_launch` (`detach`), `crown_apex`, `crown_land` (auf `KFB_HatSeat` des neuen Kings), `cheer`.
- Die Krone fliegt als `path:arc` mit Drall und landet mit Squash.
- Der gestürzte King fällt mit Boden-Klemme unten am Hügel und bleibt benommen liegen (Opfer-Kette wie V-530, ohne Blitzdings).
- Jeder mögliche King braucht einen `KFB_HatSeat`. Bitte listen, welche Figuren ihn schon haben.

**Abnahme / Lieferung**
- **Prüfstand:**
  - King A/B und Dark Knight, Augen Ruhe / halb / zu, Zweihänder-Achsbild;
  - Castle-Bühne als Diorama-Bogen + Spielkamera;
  - Streifen Kronen-Gag: King → geboxt → Krone fliegt → landet auf neuem King, z. B. dem Käpt'n.
- **Als Scenelet:** GLBs + Base64-`.txt` + `king_coronation_01.scenelet.json`. QA V-520, Lizenzen im RETURN.
