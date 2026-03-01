import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const bgDir = path.join(root, 'src', 'assets', 'imgs', 'background');

/**
 * Generate smaller WebP variants for responsive delivery.
 * Keeps originals intact.
 */
const targets = [
  { file: 'img_theatro.webp', widths: [640, 1280] },
  { file: 'img_museu_ipiranga.webp', widths: [640, 1280] },
  { file: 'img_paulista.webp', widths: [640, 1280] },
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  for (const t of targets) {
    const inputPath = path.join(bgDir, t.file);
    if (!(await exists(inputPath))) {
      console.warn(`[optimize-images] Missing: ${inputPath}`);
      continue;
    }

    const baseName = t.file.replace(/\.webp$/i, '');

    for (const width of t.widths) {
      const outName = `${baseName}_${width}.webp`;
      const outPath = path.join(bgDir, outName);

      // Skip if already generated
      if (await exists(outPath)) continue;

      await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 72, effort: 4 })
        .toFile(outPath);

      console.log(`[optimize-images] Wrote ${outName}`);
    }
  }
}

main().catch((err) => {
  console.error('[optimize-images] Failed', err);
  process.exitCode = 1;
});
