import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: true,
  },
  optimizeDeps: {
    include: ["pixi.js", "@pixi/react"],
  },
});
