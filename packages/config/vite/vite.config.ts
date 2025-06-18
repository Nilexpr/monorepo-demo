import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    target: "node",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "vite-config",
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    minify: false,
    sourcemap: true,
    rollupOptions: {
      external: ["vite"],
    },
  },
  plugins: [dts()],
});
