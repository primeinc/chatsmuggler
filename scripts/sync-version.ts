import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PackageJson {
  version: string;
}

interface ManifestJson {
  version: string;
}

async function syncVersion(): Promise<void> {
  const root = resolve(__dirname, "..");
  const pkgPath = resolve(root, "package.json");
  const manifestPath = resolve(root, "manifest.json");

  const pkg = JSON.parse(await readFile(pkgPath, "utf-8")) as unknown as PackageJson;
  const manifest = JSON.parse(await readFile(manifestPath, "utf-8")) as unknown as ManifestJson;

  if (manifest.version !== pkg.version) {
    console.log(`Syncing manifest.json version: ${manifest.version} -> ${pkg.version}`);
    const updatedManifest = { ...manifest, version: pkg.version };
    await writeFile(manifestPath, JSON.stringify(updatedManifest, null, 2) + "\n");
  } else {
    console.log(`Versions are in sync: ${pkg.version}`);
  }
}

syncVersion().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
