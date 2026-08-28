import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "./",
    server: {
      allowedHosts: true,
    },
  },
  nitro: {
    preset: process.env.NITRO_PRESET || "node-server",
  },
});
