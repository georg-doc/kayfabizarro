# WS1 · P3 echte Höhenmuster als Bild (V-874)

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

**Kontext**
- Georg hat Frage 1 der Lead-Sammlung bejaht: echte Höhenmuster (Kölner Bucht, Herkules) zuerst als Bild, nichts einbauen. Du lieferst wie angeboten das Back-Skript (Terrarium → Höhenmuster, offline) und die Bilder, WS0 baut später hinter einem Schalter ein.
- Die anderen Punkte aus q254 (P4 Popup-Bäume, Straßennetz C, Worker- und Tageslicht-Angebot, Start-Sechs) ruhen vorerst.
- Konzeptblatt: Es ist eine reine Gelände-Probe ohne gesetzte Objekte. WS0 schreibt das Konzeptblatt erst für den Einbau der Kölner Tasche; für diese Probe gilt Gebiet 5 (Terrain) des Kanons. WS0-Entscheid: Die Vorlage gilt für Szenen (Diorama, Scenelet, Demo); eine Gelände-Probe ohne Objekte ist keine Szene.

**Auftrag**
- Grundlage: `docs/WORLD_EXPLORER_EVAL_R1.md` §3 Probe P3 und Konzept R1.6 §5.10/§5.11 (deine Dokumente), Kölner Tasche mit gemessener Ebene (V-747), Biom-Fahrt (V-619), ein Höhen-Owner `endlessTerrain`.
- Bilder: je Ort (Kölner Bucht, Herkules/Bergpark Wilhelmshöhe) die Biom-Fahrt mit dem gebackenen Höhenmuster, daneben dieselbe Kamera auf dem heutigen Gelände. Beide Varianten im echten Spiel mit Site-Hash, gleicher Knete-Look, das eine Licht-Rig. Maßgeblich ist die Spielkamera; eine Drohnen-Ansicht kommt nur als Zusatz dazu.
- Dazu die Rampen-Tabelle aus R1.6 §5.10 neu gerechnet (Anteil Gebäude mit Rampe > 15°). PASS laut deinem Dokument, wenn die Bucht ohne Abtrag die Werte der „Ebene 0,3“ erreicht oder unterbietet.
- Ausgabe: Skript und Bilder auf einem eigenen Branch (`ws1/p3-hoehenmuster-r1`, Spiegel ins kayfabizarro-Repo wie üblich). Keine großen Höhendateien über das CDN, gebackene Daten klein halten. Kein Merge nach main.
- Abgabe wie Tier 0 Punkt 3: Gate grün, dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md` (er urteilt nur über die Bilder aus der Spielkamera). Rückmeldung an WS0 mit Branch-URL, Bildern, Tabelle und Kritiker-Urteil. Erst dann legt WS0 Georg die Bilder als Hub-Karte vor.
