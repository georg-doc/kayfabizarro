import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map((entry) => {
  const [key, ...rest] = entry.replace(/^--/, "").split("=");
  return [key, rest.join("=")];
}));
if (!args.hub) throw new Error("Use --hub=/absolute/path/to/hub/dist");

const root = new URL(".", import.meta.url);
const source = new URL("./surface-config/CURRENT_BOARD.json", root);
const raw = await readFile(source, "utf8");
const board = JSON.parse(raw);
if (board.schema !== "kfb.surface-board/1") throw new Error("Unexpected board schema");
if (board.owner !== "KFB Production Control") throw new Error("Production Control must remain the board owner");
if (board.syncMode !== "DETERMINISTIC_SYNC") throw new Error("Board must declare deterministic sync");
if (board.p0?.length !== 2) throw new Error("Expected exactly two current P0 gates");

await writeFile(resolve(args.hub, "current-board.json"), raw.endsWith("\n") ? raw : `${raw}\n`);
console.log(`Synced ${board.revision} to ${resolve(args.hub, "current-board.json")}`);
