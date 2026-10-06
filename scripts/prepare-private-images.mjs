import { readdir, mkdir, copyFile, unlink, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicRoot = path.resolve(root, "public", "images");
const privateRoot = path.resolve(root, "private");
if (!publicRoot.startsWith(root + path.sep) || !privateRoot.startsWith(root + path.sep)) throw new Error("Unexpected image directory");
const groups = ["hero", "story", "journey", "memories", "reasons", "ending"];
let before = 0;
let after = 0;
for (const group of groups) {
  const sourceDir = path.join(publicRoot, group);
  const destinationDir = path.join(privateRoot, "images", group);
  const originalDir = path.join(privateRoot, "originals", group);
  await mkdir(destinationDir, { recursive: true });
  await mkdir(originalDir, { recursive: true });
  for (const name of await readdir(sourceDir)) {
    if (!/^[a-z0-9-]+\.webp$/.test(name)) continue;
    const source = path.join(sourceDir, name);
    const destination = path.join(destinationDir, name);
    const original = path.join(originalDir, name);
    before += (await stat(source)).size;
    await copyFile(source, original);
    await sharp(source).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(destination);
    after += (await stat(destination)).size;
    try { await unlink(source); }
    catch (error) {
      if (error.code !== "EBUSY") throw error;
      console.warn(`Could not remove ${source}; close any process using it, then remove the public copy.`);
    }
  }
}
console.log(`Private photos prepared: ${(before / 1048576).toFixed(1)} MiB → ${(after / 1048576).toFixed(1)} MiB. Originals kept under private/originals.`);
