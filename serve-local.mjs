import { serve } from "bun";
import { join, dirname } from "path";
import { existsSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import handler from "./.output/server/index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, ".output/public");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

serve({
  port: 3014,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    const filePath = join(PUBLIC_DIR, url.pathname);
    
    if (url.pathname !== "/" && existsSync(filePath)) {
      const ext = url.pathname.substring(url.pathname.lastIndexOf("."));
      const contentType = mimeTypes[ext] || "application/octet-stream";
      return new Response(readFileSync(filePath), {
        headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=3600" },
      });
    }

    return handler.fetch(req);
  },
});

console.log("Servidor local CINAP Portal ativo em http://0.0.0.0:3014");
