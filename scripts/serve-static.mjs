// A strict, dependency-free preview of dist/ mounted under real website paths.
// Used for deployment smoke tests, not as an Internet production server.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const args = process.argv.slice(2);
const port = Number(args[args.indexOf("--port") + 1] || 4174);
const mounts = args.flatMap((value, i) =>
  value === "--mount" ? [args[i + 1]] : [],
);
if (!mounts.length) mounts.push("/special-sparks/boat-race/");
for (const mount of mounts) {
  if (!mount.startsWith("/") || !mount.endsWith("/"))
    throw Error("Mounts must start and end with /");
}
const root = path.resolve("dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".map": "application/json",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      const redirect = mounts.find((m) => pathname === m.slice(0, -1));
      if (redirect) {
        res.writeHead(308, { Location: redirect + url.search });
        res.end();
        return;
      }
      const mount = mounts.find((m) => pathname.startsWith(m));
      if (!mount) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const relative = pathname.slice(mount.length) || "index.html";
      const file = path.resolve(root, relative);
      if (!file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const data = await fs.readFile(file);
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "Content-Length": data.length,
        "Cache-Control": "no-cache",
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(port, "0.0.0.0", () =>
    console.log(
      `Mounted production preview on port ${port}: ${mounts.join(", ")}`,
    ),
  );
