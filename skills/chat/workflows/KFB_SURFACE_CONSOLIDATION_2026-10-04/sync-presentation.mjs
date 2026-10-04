import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map((entry) => {
  const [key, ...rest] = entry.replace(/^--/, "").split("=");
  return [key, rest.join("=")];
}));
if (!args.hub || !args.toolbox || !args.control) throw new Error("Use --hub=... --toolbox=... --control=...");

const config = JSON.parse(await readFile(new URL("./surface-config/PRESENTATION.json", import.meta.url), "utf8"));
const staticFile = (values) => `${JSON.stringify({ schema: "kfb.surface-presentation/1", cssVariables: values }, null, 2)}\n`;
await writeFile(resolve(args.hub, "presentation.json"), staticFile(config.hub));
await writeFile(resolve(args.toolbox, "presentation.json"), staticFile(config.toolbox));
const css = `:root{\n${Object.entries(config.control).map(([key, value]) => `  --${key}:${value};`).join("\n")}\n}\n`;
await writeFile(resolve(args.control, "surface-theme.css"), css);
console.log("Presentation configuration synced for Hub, ToolBox and Control.");
