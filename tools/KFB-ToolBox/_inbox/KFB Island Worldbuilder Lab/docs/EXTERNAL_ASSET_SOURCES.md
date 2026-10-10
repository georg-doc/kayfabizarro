# Externe Asset-Quellen (Stand 2026-10-08)

Von Georg am 07.10. gefunden, für Requisiten, Texturen, Materialien und Shader der Inseln.

| Quelle | Was | Zugriff | Lizenz | Hinweis |
| --- | --- | --- | --- | --- |
| [3D Asset Server](https://github.com/arielshad/3d-asset-server) | eine Suche über 20 Seiten: Modelle, PBR-Texturen, HDRIs | MCP-Tools `search_assets`, `get_asset`, `download_asset`, `list_providers`; lokal mit Node 20+ oder Docker | Repo Apache-2.0; Treffer mit Lizenzangabe je Asset | Direkt-Download: Poly Haven, ambientCG, BlenderKit, Polyfork, 3DAssets.dev, HDRMaps, Kenney. Nur Links: CGTrader, itch.io, Quaternius, Fab, TurboSquid u. a. |
| [3d.shep.bot](https://3d.shep.bot) | gehostete Version davon | Web-Suche, REST, MCP unter `https://3d.shep.bot/mcp` | wie oben | noch nicht in Claude Code eingetragen |
| [UltraTex](https://github.com/yiboz2001/UltraTex) | KI erzeugt 2K-Texturen für Meshes (Multi-View-Diffusion) | Python, PyTorch, FLUX-Basismodell | MIT | braucht NVIDIA/CUDA, läuft nicht auf dem M1 Max; nur über Cloud-GPU |
| r/TopologyAI-Beitrag | KI-Texturierung | – | – | Link noch nicht wiedergefunden |

Regeln (aus dem Asset-Librarian-Konzept in `georg-doc/kayfabizarro`, Branch `planning/asset-librarian-external-3d-search-r1-2026-10-07`):

- Funde werden erst nach Intake und Quellen-Isolation zu KFB-Assets.
- Zuerst CC0, dann Lizenzen mit Namensnennung (Attribution wird mitgespeichert).
- Clay-Look und Joyride-Paletten werden auf die Funde gelegt; Fremd-Ästhetik nicht ungeprüft übernehmen.

Gekauftes Paket im Lab: StreakByte „Low Poly Floating Islands“ (Unity Asset Store, Standard-EULA), ausgepackt in `donors/streakbyte-floating-islands/`. Rohdateien nicht in ein öffentliches Repo.
