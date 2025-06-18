import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";

export default defineConfig({
  plugins: [solid()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/App.tsx"),
      name: "JsonViewer",
      formats: ["es"],
    },
    minify: false,
    sourcemap: true,
    rollupOptions: {
      external: ["solid-js"],
    },
  },
});
