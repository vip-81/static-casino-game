const res = await fetch('https://static-casino-demo.pages.dev/');
const html = await res.text();
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
console.log('HTTP', res.status);
console.log('JSON-LD blocks:', blocks.length);
blocks.forEach((b, i) => {
  try {
    const o = JSON.parse(b);
    console.log(`  ${i + 1}: OK @type=${o['@type']}`);
  } catch (e) {
    console.log(`  ${i + 1}: INVALID ${e.message}`);
  }
});
console.log('h1 count:', (html.match(/<h1/g) || []).length);
console.log('img tags:', (html.match(/<img/g) || []).length);
console.log('og:image:', (html.match(/property="og:image" content="([^"]+)"/) || [])[1]);
console.log('canonical:', (html.match(/rel="canonical" href="([^"]+)"/) || [])[1]);
