/**
 * Build a GitHub Pages (project subpath) compatible copy of the site.
 * GitHub Pages project sites are served from /<repo>/, so root-absolute
 * URLs like /assets/... must be rewritten to relative paths.
 */
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist-gh');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const FILES = [
  'index.html',
  'privacy.html',
  'terms.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'sw.js',
  '_headers',
  '_redirects',
  'assets'
];

for (const file of FILES) {
  await cp(path.join(root, file), path.join(out, file), { recursive: true });
}

const REWRITES = [
  ['href="/assets/', 'href="assets/'],
  ['src="/assets/', 'src="assets/'],
  ['href="/privacy"', 'href="privacy"'],
  ['href="/terms"', 'href="terms"'],
  ['href="/#', 'href="./#'],
  ['href="/"', 'href="./"']
];

for (const page of ['index.html', 'privacy.html', 'terms.html', '404.html']) {
  let html = await readFile(path.join(out, page), 'utf8');
  for (const [from, to] of REWRITES) {
    html = html.split(from).join(to);
  }
  await writeFile(path.join(out, page), html);
}

const manifestPath = path.join(out, 'site.webmanifest');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
manifest.start_url = './';
manifest.icons = manifest.icons.map((icon) => ({
  ...icon,
  src: icon.src.replace(/^\//, '')
}));
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

let sw = await readFile(path.join(out, 'sw.js'), 'utf8');
sw = sw
  .replace("'/'", "'./'")
  .replace(/'\/index\.html'/g, "'index.html'")
  .replace(/'\/assets\//g, "'assets/");
await writeFile(path.join(out, 'sw.js'), sw);

let mainJs = await readFile(path.join(out, 'assets/js/main.js'), 'utf8');
mainJs = mainJs.replace("register('/sw.js')", "register('sw.js')");
await writeFile(path.join(out, 'assets/js/main.js'), mainJs);

// GitHub Pages/Jekyll: keep files such as _headers and _redirects.
await writeFile(path.join(out, '.nojekyll'), '');
