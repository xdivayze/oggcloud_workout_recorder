import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      buffer: "buffer/",
      util : "util/",
      stream: "stream-browserify",
      events: "events"
    },
  },
  define: {
    global: "globalThis",
    process: { env: {}, version: "v1.0.0" },
  },
});
