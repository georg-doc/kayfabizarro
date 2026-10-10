import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const outputName = ".cloudflare-pages";
const outputRoot = path.join(repoRoot, outputName);
const maxFiles = 18_000;
const maxAssetBytes = 25 * 1024 * 1024;

const skippedRoots = new Set([
  ".git",
  ".github",
  "_handoff",
  "skills",
  "node_modules",
  outputName,
]);

const skippedExtensions = new Set([
  ".aseprite",
  ".blend",
  ".c3p",
  ".capx",
  ".dae",
  ".docx",
  ".fbx",
  ".md",
  ".mtl",
  ".obj",
  ".psd",
  ".pyc",
  ".zip",
]);

function normalizedRelative(source) {
  return path.relative(repoRoot, source).split(path.sep).join("/");
}

function shouldSkip(source) {
  const rel = normalizedRelative(source);
  if (!rel) return false;

  const [root] = rel.split("/");
  if (skippedRoots.has(root) || root.startsWith(".") || root.startsWith('"')) return true;
  if (rel === ".assetsignore" || rel === ".gitignore" || rel === "wrangler.jsonc") return true;
  if (rel === "media/2D_Assets" || rel.startsWith("media/2D_Assets/")) return true;
  if (rel === "media/3D_Assets" || rel.startsWith("media/3D_Assets/")) return true;
  if (rel === "tools/KFB-ToolBox/_inbox" || rel.startsWith("tools/KFB-ToolBox/_inbox/")) return true;
  if (rel.split("/").includes("_handover")) return true;
  if (rel.split("/").includes("__pycache__")) return true;
  return skippedExtensions.has(path.extname(rel).toLowerCase());
}

async function copyPublicSurface() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const entries = await readdir(repoRoot, { withFileTypes: true });
  for (const entry of entries) {
    const source = path.join(repoRoot, entry.name);
    if (shouldSkip(source)) continue;
    await cp(source, path.join(outputRoot, entry.name), {
      recursive: true,
      filter: async (candidate) => {
        if (shouldSkip(candidate)) return false;
        const facts = await stat(candidate);
        if (facts.isFile() && facts.size > maxAssetBytes) {
          console.log(`Skipping >25 MiB Pages asset: ${normalizedRelative(candidate)}`);
          return false;
        }
        return true;
      },
    });
  }
}

async function countFiles(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    count += entry.isDirectory() ? await countFiles(target) : 1;
  }
  return count;
}

await copyPublicSurface();
const fileCount = await countFiles(outputRoot);
if (fileCount > maxFiles) {
  throw new Error(`Cloudflare public projection has ${fileCount} files; safety limit is ${maxFiles}.`);
}
console.log(`Cloudflare public projection ready: ${fileCount} files in ${outputName}/`);
