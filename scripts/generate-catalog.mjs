import { createHash, createPrivateKey, sign } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const manifest = JSON.parse(await readFile(join(root, 'manifest.json'), 'utf8'));
const repository = process.env.GITHUB_REPOSITORY || 'ahmeterdemserceoglu/Enverse-Distribution';
const tag = process.env.RELEASE_TAG || 'latest';
const keyText = process.env.CATALOG_PRIVATE_KEY || (process.env.CATALOG_PRIVATE_KEY_FILE
  ? await readFile(process.env.CATALOG_PRIVATE_KEY_FILE, 'utf8') : '');
if (!keyText) throw new Error('CATALOG_PRIVATE_KEY veya CATALOG_PRIVATE_KEY_FILE gerekli');

const apps = await Promise.all(manifest.apps.map(async ({ asset, ...app }) => {
  if (basename(asset) !== asset || !asset.endsWith('.apk')) throw new Error(`Geçersiz asset: ${asset}`);
  const bytes = await readFile(join(root, 'release-assets', asset));
  return {
    ...app,
    apkUrl: `https://github.com/${repository}/releases/${tag === 'latest' ? 'latest/download' : `download/${tag}`}/${asset}`,
    sizeBytes: bytes.byteLength,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    releasedAt: new Date().toISOString(),
  };
}));

const payload = { schemaVersion: manifest.schemaVersion, channel: manifest.channel, generatedAt: new Date().toISOString(), apps };
const signature = sign('RSA-SHA256', Buffer.from(JSON.stringify(payload)), createPrivateKey(keyText)).toString('base64');
await writeFile(join(root, 'apps.json'), `${JSON.stringify({ payload, signature }, null, 2)}\n`);
console.log(`İmzalı katalog üretildi: ${apps.length} uygulama`);
