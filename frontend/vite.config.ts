import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(
    mode,
    process.cwd()
  );

  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: env.VITE_BUILD_TARGET || "dist",
    },
    resolve: {
      alias: {
        crypto: "crypto-browserify",
        buffer: "buffer/",
        util: "util/",
        stream: "stream-browserify",
        events: "events",
      },
    },
    define: {
      global: "globalThis",
      process: { env: {}, version: "v1.0.0" },
    },
  };
});
