import { access, cp, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(projectRoot, "private", "images");
const assetRoot = path.join(projectRoot, ".open-next", "assets");
const target = path.join(assetRoot, "_private-story-images");

if (path.relative(assetRoot, target) !== "_private-story-images") {
  throw new Error("Invalid private image destination.");
}

await access(source);
await access(assetRoot);
await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });

async function countWebp(directory) {
  let count = 0;
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) count += await countWebp(file);
    else if (item.isFile() && item.name.endsWith(".webp")) count++;
  }
  return count;
}

console.log(`Copied ${await countWebp(target)} private photos into Worker assets.`);
