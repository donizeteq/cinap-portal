import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  server: {
    allowedHosts: true,
  },
  nitro: {
    serveStatic: true,
  } as any,
});
