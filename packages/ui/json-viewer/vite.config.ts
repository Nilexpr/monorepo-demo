import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [solid(), tailwindcss()],
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
