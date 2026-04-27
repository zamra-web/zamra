import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const publicRoot = path.join(webRoot, 'public');

function collectFiles(rootDir, predicate) {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const files = [];

  entries.forEach((entry) => {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(entryPath, predicate));
      return;
    }

    if (predicate(entryPath)) files.push(entryPath);
  });

  return files;
}

function readAssetReferences(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');
  const matches = contents.match(/\/assets\/[A-Za-z0-9._/-]+/g);
  return matches ? [...new Set(matches)] : [];
}

test('all referenced /assets files exist under web/public', () => {
  const htmlFiles = collectFiles(webRoot, (filePath) => (
    path.dirname(filePath) === webRoot && filePath.endsWith('.html')
  ));
  const sourceFiles = collectFiles(path.join(webRoot, 'src'), (filePath) => (
    filePath.endsWith('.js') || filePath.endsWith('.css')
  ));

  const missing = [...htmlFiles, ...sourceFiles]
    .flatMap((filePath) => readAssetReferences(filePath))
    .filter((assetPath, index, all) => all.indexOf(assetPath) === index)
    .filter((assetPath) => !fs.existsSync(path.join(publicRoot, assetPath.replace(/^\//, ''))));

  assert.deepEqual(missing, []);
});
