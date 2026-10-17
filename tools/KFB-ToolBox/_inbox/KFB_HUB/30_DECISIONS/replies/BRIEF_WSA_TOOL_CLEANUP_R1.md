# Brief WSA work · tidy up the tools R1 (V-390) · 17.10.2026

Basis: `replies/TOOL_MAP_R1.md` on the register branch (five places, each with one owner).

1. **Inventory:** list every address Georg can reach. That means every Cloudflare Pages path under `kayfabizarro.pages.dev` and `ws1-preview…`, every ChatGPT site, every `kfb-hub/stage/*` page and the old Production Hub / STEUERPULT. For each one record: what it is, when it was last changed, and which of the five places it belongs to, or "archive".
2. **Redirects instead of dead links:**
   - Cloudflare: `_redirects` file in the published folder (one PR; this is a docs/config change, Georg merges).
   - Old Production Hub → https://claude.ai/artifact/WxG16gvt7LNrBXxYkAhr9d
   - Old stage/lab pages (including `kaykit-motion-lab-v1`) → their new place, or a small archive page with a link.
   - Delete nothing; redirect and mark only.
3. **Motion Lab becomes a tab** in the Figure workshop (ToolBox). The data (`locomotion-profiles.v1.js`, PROFILE_PROPOSALS) stays where it is. The tab is what reads it.
4. **Fill in the addresses** of the Sound studio and Asset library in the TOOL_MAP. Write it as a WSA_* file; WS0 takes it over.
5. **Georg's bookmarklets:** list which old addresses they hit, plus the replacement for each.

Return: inventory table, PR link for the redirects, open points. Don't build any new tools. This runs alongside production: the footstep pilot (Hub b74) in the Sound studio takes priority.
