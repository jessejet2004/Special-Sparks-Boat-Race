import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
async function walk(dir) {
  const files = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    files.push(...(e.isDirectory() ? await walk(p) : [p]));
  }
  return files;
}
const files = (await walk("dist")).filter((p) => !p.endsWith("sw.js")).sort();
const digest = crypto.createHash("sha256");
for (const p of files) {
  digest.update(p);
  digest.update(await fs.readFile(p));
}
const version = "boat-race-" + digest.digest("hex").slice(0, 14),
  urls = files.map(
    (p) => "./" + path.relative("dist", p).split(path.sep).join("/"),
  );
await fs.writeFile(
  "dist/sw.js",
  `const CACHE=${JSON.stringify(version)};const FILES=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('boat-race-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data==='ready')event.ports[0]?.postMessage('ready');});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request).then(response=>{if(response.ok)cache.put(event.request,response.clone());return response;})).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Response.error()));});
`,
);
console.log(`Offline cache ${version}: ${urls.length} local files.`);
